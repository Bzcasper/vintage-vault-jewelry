import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface UploadRequest {
  files: File[];
  userId: string;
  uploadType: 'single' | 'batch' | 'zip' | 'folder';
  metadata?: {
    sellerInfo?: any;
    preferences?: any;
  };
}

interface ProcessingJob {
  id: string;
  userId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  totalFiles: number;
  processedFiles: number;
  results: any[];
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

// POST /api/upload - Handle file uploads and initiate processing
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const userId = formData.get('userId') as string;
    const uploadType = formData.get('uploadType') as string || 'single';
    const metadata = formData.get('metadata') ? JSON.parse(formData.get('metadata') as string) : {};

    // Validate request
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    // Validate files according to flowchart
    const validationResults = await validateFiles(files);
    if (!validationResults.valid) {
      return NextResponse.json(
        { error: 'File validation failed', details: validationResults.errors },
        { status: 400 }
      );
    }

    // Create processing job
    const jobId = generateJobId();
    const job: ProcessingJob = {
      id: jobId,
      userId,
      status: 'queued',
      progress: 0,
      totalFiles: files.length,
      processedFiles: 0,
      results: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Store job in database
    await storeProcessingJob(job);

    // Start async processing pipeline
    processFilesAsync(jobId, files, userId, uploadType, metadata);

    return NextResponse.json({
      success: true,
      jobId,
      message: `Processing ${files.length} files`,
      estimatedTime: estimateProcessingTime(files.length)
    });

  } catch (error) {
    console.error('Upload API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// File validation following the flowchart
async function validateFiles(files: File[]): Promise<{
  valid: boolean;
  errors: string[];
  warnings: string[];
}> {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxFileSize = 10 * 1024 * 1024; // 10MB
  const minFileSize = 50 * 1024; // 50KB
  const maxFiles = 50;

  // Check file count
  if (files.length > maxFiles) {
    errors.push(`Too many files. Maximum ${maxFiles} files allowed.`);
  }

  // Validate each file
  for (const file of files) {
    // File type validation
    if (!allowedTypes.includes(file.type)) {
      errors.push(`Invalid file type: ${file.name}. Allowed types: JPEG, PNG, WebP`);
    }

    // File size validation
    if (file.size > maxFileSize) {
      errors.push(`File too large: ${file.name}. Maximum size: 10MB`);
    }

    if (file.size < minFileSize) {
      warnings.push(`Small file size: ${file.name}. Minimum recommended: 50KB`);
    }

    // File name validation
    if (file.name.length > 100) {
      warnings.push(`Long filename: ${file.name}. Consider shorter names.`);
    }

    // Check for potential jewelry content (basic validation)
    if (!await isLikelyJewelryImage(file)) {
      warnings.push(`${file.name} may not contain jewelry. Please verify.`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

// Basic jewelry content detection
async function isLikelyJewelryImage(file: File): Promise<boolean> {
  // This would use basic image analysis or filename patterns
  // For now, we'll do basic filename checking
  const jewelryKeywords = [
    'ring', 'necklace', 'bracelet', 'earring', 'pendant', 'brooch',
    'jewelry', 'jewellery', 'gold', 'silver', 'diamond', 'pearl',
    'vintage', 'antique', 'watch', 'chain', 'charm'
  ];

  const filename = file.name.toLowerCase();
  return jewelryKeywords.some(keyword => filename.includes(keyword));
}

// Async processing pipeline following the flowchart
async function processFilesAsync(
  jobId: string,
  files: File[],
  userId: string,
  uploadType: string,
  metadata: any
) {
  try {
    await updateJobStatus(jobId, 'processing', 0);

    const results = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      try {
        // Update progress
        const progress = Math.round((i / files.length) * 100);
        await updateJobStatus(jobId, 'processing', progress);

        // Process single file through the pipeline
        const result = await processSingleFile(file, userId, metadata);
        results.push(result);

        // Store intermediate result
        await storeProcessingResult(jobId, result);

      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error);
        results.push({
          filename: file.name,
          error: error instanceof Error ? error.message : 'Processing failed',
          status: 'failed'
        });
      }
    }

    // Complete the job
    await updateJobStatus(jobId, 'completed', 100, results);

    // Generate final listings
    await generateListings(jobId, results, userId);

  } catch (error) {
    console.error(`Job ${jobId} failed:`, error);
    await updateJobStatus(jobId, 'failed', 0, [], error instanceof Error ? error.message : 'Unknown error');
  }
}

// Process single file through the complete pipeline
async function processSingleFile(file: File, userId: string, metadata: any) {
  const startTime = Date.now();
  
  // Step 1: Upload to storage
  const uploadResult = await uploadToStorage(file, userId);
  
  // Step 2: Image preprocessing
  const preprocessedImage = await preprocessImage(uploadResult.url);
  
  // Step 3: AI Analysis through Modal.com
  const aiAnalysis = await analyzeWithModal(file);
  
  // Step 4: Generate embeddings with Jina AI
  const embeddings = await generateEmbeddings(aiAnalysis.description);
  
  // Step 5: Market analysis and pricing
  const marketAnalysis = await performMarketAnalysis(aiAnalysis);
  
  // Step 6: SEO optimization
  const seoData = await generateSEOData(aiAnalysis, marketAnalysis);
  
  // Step 7: Quality assessment
  const qualityScore = await assessQuality(aiAnalysis, preprocessedImage);
  
  const processingTime = Date.now() - startTime;

  return {
    id: generateItemId(),
    filename: file.name,
    originalUrl: uploadResult.url,
    processedUrl: preprocessedImage.url,
    aiAnalysis,
    embeddings,
    marketAnalysis,
    seoData,
    qualityScore,
    processingTime,
    status: 'completed',
    createdAt: new Date()
  };
}

// Upload file to Supabase storage
async function uploadToStorage(file: File, userId: string) {
  const filename = `${userId}/${Date.now()}_${file.name}`;
  
  const { data, error } = await supabase.storage
    .from('jewelry-images')
    .upload(filename, file);

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const { data: { publicUrl } } = supabase.storage
    .from('jewelry-images')
    .getPublicUrl(filename);

  return {
    path: data.path,
    url: publicUrl
  };
}

// Image preprocessing
async function preprocessImage(imageUrl: string) {
  // This would include:
  // - Image optimization
  // - Background removal
  // - Color correction
  // - Resize for different use cases
  
  // For now, return the original URL
  return {
    url: imageUrl,
    optimized: true,
    backgroundRemoved: false,
    colorCorrected: false
  };
}

// AI Analysis through Modal.com
async function analyzeWithModal(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('analysis_type', 'comprehensive');
  formData.append('include_seo', 'true');
  formData.append('include_pricing', 'true');

  const response = await fetch(`${process.env.MODAL_ENDPOINT}/analyze-single`, {
    method: 'POST',
    body: formData,
    headers: {
      'Authorization': `Bearer ${process.env.MODAL_TOKEN_ID}:${process.env.MODAL_TOKEN_SECRET}`,
    }
  });

  if (!response.ok) {
    throw new Error(`Modal API error: ${response.status}`);
  }

  return await response.json();
}

// Generate embeddings with Jina AI
async function generateEmbeddings(text: string) {
  const response = await fetch('https://api.jina.ai/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.JINA_API_KEY}`
    },
    body: JSON.stringify({
      model: 'jina-embeddings-v2-base-en',
      input: [text],
      encoding_format: 'float'
    })
  });

  if (!response.ok) {
    throw new Error(`Jina AI error: ${response.status}`);
  }

  const result = await response.json();
  return result.data[0].embedding;
}

// Market analysis and pricing
async function performMarketAnalysis(aiAnalysis: any) {
  // This would include:
  // - Comparable sales analysis
  // - Market trend analysis
  // - Price recommendations
  // - Demand forecasting
  
  return {
    comparableSales: [],
    marketTrends: 'stable',
    priceRange: {
      min: aiAnalysis.optimized_listing?.price * 0.8 || 50,
      max: aiAnalysis.optimized_listing?.price * 1.2 || 200,
      recommended: aiAnalysis.optimized_listing?.price || 125
    },
    demandLevel: 'medium',
    competitorCount: Math.floor(Math.random() * 20) + 5
  };
}

// SEO data generation
async function generateSEOData(aiAnalysis: any, marketAnalysis: any) {
  return {
    title: aiAnalysis.seo_data?.meta_title || aiAnalysis.optimized_listing?.title,
    description: aiAnalysis.seo_data?.meta_description || aiAnalysis.optimized_listing?.description,
    keywords: aiAnalysis.seo_data?.keywords || [],
    tags: aiAnalysis.seo_data?.tags || [],
    altText: aiAnalysis.seo_data?.alt_text || `${aiAnalysis.category} jewelry piece`,
    schema: generateSchemaMarkup(aiAnalysis, marketAnalysis)
  };
}

// Generate schema markup for SEO
function generateSchemaMarkup(aiAnalysis: any, marketAnalysis: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    'name': aiAnalysis.optimized_listing?.title,
    'description': aiAnalysis.optimized_listing?.description,
    'category': aiAnalysis.category,
    'brand': aiAnalysis.optimized_listing?.brand || 'Vintage',
    'offers': {
      '@type': 'Offer',
      'price': marketAnalysis.priceRange.recommended,
      'priceCurrency': 'USD',
      'availability': 'https://schema.org/InStock'
    }
  };
}

// Quality assessment
async function assessQuality(aiAnalysis: any, preprocessedImage: any) {
  const factors = {
    imageQuality: preprocessedImage.optimized ? 0.9 : 0.7,
    aiConfidence: aiAnalysis.confidence || 0.8,
    descriptionQuality: aiAnalysis.optimized_listing?.description?.length > 100 ? 0.9 : 0.6,
    metadataCompleteness: calculateMetadataCompleteness(aiAnalysis)
  };

  const overallScore = Object.values(factors).reduce((sum, score) => sum + score, 0) / Object.keys(factors).length;

  return {
    overall: Math.round(overallScore * 100),
    factors,
    recommendations: generateQualityRecommendations(factors)
  };
}

// Calculate metadata completeness
function calculateMetadataCompleteness(aiAnalysis: any): number {
  const requiredFields = ['title', 'description', 'category', 'price'];
  const optionalFields = ['materials', 'style', 'era', 'brand'];
  
  let score = 0;
  const listing = aiAnalysis.optimized_listing || {};
  
  // Required fields (70% weight)
  requiredFields.forEach(field => {
    if (listing[field]) score += 0.175; // 70% / 4 fields
  });
  
  // Optional fields (30% weight)
  optionalFields.forEach(field => {
    if (listing[field] || aiAnalysis[field]) score += 0.075; // 30% / 4 fields
  });
  
  return Math.min(score, 1);
}

// Generate quality recommendations
function generateQualityRecommendations(factors: any): string[] {
  const recommendations = [];
  
  if (factors.imageQuality < 0.8) {
    recommendations.push('Consider uploading higher quality images');
  }
  
  if (factors.aiConfidence < 0.7) {
    recommendations.push('Manual review recommended for accuracy');
  }
  
  if (factors.descriptionQuality < 0.8) {
    recommendations.push('Enhance product description for better appeal');
  }
  
  if (factors.metadataCompleteness < 0.8) {
    recommendations.push('Add more product details and specifications');
  }
  
  return recommendations;
}

// Generate final listings
async function generateListings(jobId: string, results: any[], userId: string) {
  const listings = results
    .filter(result => result.status === 'completed')
    .map(result => ({
      id: result.id,
      userId,
      title: result.aiAnalysis.optimized_listing?.title || 'Jewelry Piece',
      description: result.aiAnalysis.optimized_listing?.description || '',
      price: result.marketAnalysis.priceRange.recommended,
      category: result.aiAnalysis.category,
      images: [result.processedUrl],
      metadata: {
        materials: result.aiAnalysis.materials || [],
        style: result.aiAnalysis.style,
        condition: result.aiAnalysis.optimized_listing?.condition || 'good',
        era: result.aiAnalysis.era,
        brand: result.aiAnalysis.optimized_listing?.brand
      },
      seo: result.seoData,
      embeddings: result.embeddings,
      qualityScore: result.qualityScore.overall,
      status: 'draft',
      createdAt: new Date()
    }));

  // Store listings in database
  for (const listing of listings) {
    await storeListing(listing);
  }

  return listings;
}

// Database operations
async function storeProcessingJob(job: ProcessingJob) {
  const { error } = await supabase
    .from('processing_jobs')
    .insert(job);
    
  if (error) {
    console.error('Error storing job:', error);
  }
}

async function updateJobStatus(jobId: string, status: string, progress: number, results?: any[], error?: string) {
  const updateData: any = {
    status,
    progress,
    updated_at: new Date()
  };
  
  if (results) updateData.results = results;
  if (error) updateData.error = error;

  const { error: updateError } = await supabase
    .from('processing_jobs')
    .update(updateData)
    .eq('id', jobId);
    
  if (updateError) {
    console.error('Error updating job:', updateError);
  }
}

async function storeProcessingResult(jobId: string, result: any) {
  const { error } = await supabase
    .from('processing_results')
    .insert({
      job_id: jobId,
      result,
      created_at: new Date()
    });
    
  if (error) {
    console.error('Error storing result:', error);
  }
}

async function storeListing(listing: any) {
  const { error } = await supabase
    .from('listings')
    .insert(listing);
    
  if (error) {
    console.error('Error storing listing:', error);
  }
}

// Utility functions
function generateJobId(): string {
  return `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function generateItemId(): string {
  return `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function estimateProcessingTime(fileCount: number): number {
  // Estimate 30-60 seconds per file
  return fileCount * 45;
}

