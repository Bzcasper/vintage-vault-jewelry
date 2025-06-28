import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { advancedImageProcessor, AdvancedJewelryAnalysis } from '@/lib/advancedImageProcessing';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface EnhancedUploadRequest {
  files: File[];
  userId: string;
  processingMode: 'standard' | 'advanced' | 'premium';
  options: {
    includeMarketAnalysis: boolean;
    includeBrandRecognition: boolean;
    includeConditionAssessment: boolean;
    generateSEOContent: boolean;
    batchProcessing: boolean;
  };
}

interface ProcessingJob {
  id: string;
  userId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  totalFiles: number;
  processedFiles: number;
  results: AdvancedJewelryAnalysis[];
  pipeline: any[];
  error?: string;
  processingMode: string;
  estimatedCompletion: Date;
  createdAt: Date;
  updatedAt: Date;
}

// POST /api/upload/advanced - Enhanced upload with YOLO + ViT processing
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const userId = formData.get('userId') as string;
    const processingMode = formData.get('processingMode') as string || 'advanced';
    const options = formData.get('options') ? JSON.parse(formData.get('options') as string) : {
      includeMarketAnalysis: true,
      includeBrandRecognition: true,
      includeConditionAssessment: true,
      generateSEOContent: true,
      batchProcessing: true
    };

    // Enhanced validation
    const validationResult = await validateAdvancedUpload(files, userId, processingMode);
    if (!validationResult.valid) {
      return NextResponse.json({
        error: 'Validation failed',
        details: validationResult.errors,
        warnings: validationResult.warnings
      }, { status: 400 });
    }

    // Create enhanced processing job
    const jobId = generateJobId();
    const estimatedTime = calculateProcessingTime(files.length, processingMode);
    
    const job: ProcessingJob = {
      id: jobId,
      userId,
      status: 'queued',
      progress: 0,
      totalFiles: files.length,
      processedFiles: 0,
      results: [],
      pipeline: [],
      processingMode,
      estimatedCompletion: new Date(Date.now() + estimatedTime * 1000),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Store job in database
    await storeEnhancedJob(job);

    // Start advanced processing pipeline
    processFilesAdvanced(jobId, files, userId, processingMode, options);

    return NextResponse.json({
      success: true,
      jobId,
      message: `Processing ${files.length} files with ${processingMode} mode`,
      estimatedTime,
      features: {
        yoloDetection: true,
        vitClassification: true,
        brandRecognition: options.includeBrandRecognition,
        conditionAssessment: options.includeConditionAssessment,
        marketAnalysis: options.includeMarketAnalysis,
        seoOptimization: options.generateSEOContent
      }
    });

  } catch (error) {
    console.error('Advanced upload API error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// GET /api/upload/advanced - Get job status and results
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');
    const userId = searchParams.get('userId');

    if (!jobId || !userId) {
      return NextResponse.json({
        error: 'Missing jobId or userId'
      }, { status: 400 });
    }

    const job = await getJobStatus(jobId, userId);
    if (!job) {
      return NextResponse.json({
        error: 'Job not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      job: {
        id: job.id,
        status: job.status,
        progress: job.progress,
        totalFiles: job.totalFiles,
        processedFiles: job.processedFiles,
        results: job.results,
        pipeline: job.pipeline,
        error: job.error,
        processingMode: job.processingMode,
        estimatedCompletion: job.estimatedCompletion,
        createdAt: job.createdAt,
        updatedAt: job.updatedAt
      }
    });

  } catch (error) {
    console.error('Get job status error:', error);
    return NextResponse.json({
      error: 'Failed to get job status'
    }, { status: 500 });
  }
}

// Enhanced validation with AI-powered pre-screening
async function validateAdvancedUpload(
  files: File[], 
  userId: string, 
  processingMode: string
): Promise<{
  valid: boolean;
  errors: string[];
  warnings: string[];
  recommendations: string[];
}> {
  const errors: string[] = [];
  const warnings: string[] = [];
  const recommendations: string[] = [];

  // Basic validation
  if (!files || files.length === 0) {
    errors.push('No files provided');
  }

  if (!userId) {
    errors.push('User ID required');
  }

  // Processing mode validation
  const validModes = ['standard', 'advanced', 'premium'];
  if (!validModes.includes(processingMode)) {
    errors.push(`Invalid processing mode. Must be one of: ${validModes.join(', ')}`);
  }

  // File validation
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxFileSize = processingMode === 'premium' ? 50 * 1024 * 1024 : 20 * 1024 * 1024; // 50MB for premium, 20MB for others
  const maxFiles = processingMode === 'premium' ? 100 : processingMode === 'advanced' ? 50 : 20;

  if (files.length > maxFiles) {
    errors.push(`Too many files. Maximum ${maxFiles} files allowed for ${processingMode} mode.`);
  }

  // Enhanced file validation
  for (const file of files) {
    // File type
    if (!allowedTypes.includes(file.type)) {
      errors.push(`Invalid file type: ${file.name}. Supported: JPEG, PNG, WebP`);
    }

    // File size
    if (file.size > maxFileSize) {
      errors.push(`File too large: ${file.name}. Maximum: ${Math.round(maxFileSize / 1024 / 1024)}MB`);
    }

    if (file.size < 100 * 1024) { // 100KB minimum
      warnings.push(`Small file: ${file.name}. May affect AI analysis quality.`);
    }

    // Filename validation
    if (file.name.length > 100) {
      warnings.push(`Long filename: ${file.name}. Consider shorter names.`);
    }

    // AI-powered content pre-screening
    const contentScore = await preScreenContent(file);
    if (contentScore < 0.3) {
      warnings.push(`${file.name} may not contain jewelry. AI confidence: ${Math.round(contentScore * 100)}%`);
    } else if (contentScore > 0.8) {
      recommendations.push(`${file.name} looks excellent for AI analysis. Expected high accuracy.`);
    }
  }

  // Processing mode recommendations
  if (processingMode === 'standard' && files.length > 10) {
    recommendations.push('Consider upgrading to Advanced mode for better batch processing performance.');
  }

  if (processingMode === 'advanced' && files.some(f => f.size > 10 * 1024 * 1024)) {
    recommendations.push('Large files detected. Premium mode offers enhanced high-resolution processing.');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    recommendations
  };
}

// AI-powered content pre-screening
async function preScreenContent(file: File): Promise<number> {
  try {
    // Quick image analysis to determine if it's likely jewelry
    const base64 = await fileToBase64(file);
    
    // Use a lightweight model for quick screening
    const response = await fetch(
      'https://api-inference.huggingface.co/models/microsoft/resnet-50',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: base64
        })
      }
    );

    if (!response.ok) {
      return 0.5; // Default score if API fails
    }

    const results = await response.json();
    
    // Check for jewelry-related classifications
    const jewelryKeywords = [
      'jewelry', 'ring', 'necklace', 'bracelet', 'earring', 'watch',
      'gold', 'silver', 'diamond', 'pearl', 'gem', 'precious'
    ];

    let maxScore = 0;
    for (const result of results) {
      const label = result.label.toLowerCase();
      if (jewelryKeywords.some(keyword => label.includes(keyword))) {
        maxScore = Math.max(maxScore, result.score);
      }
    }

    return maxScore;

  } catch (error) {
    console.error('Pre-screening failed:', error);
    return 0.5; // Default score
  }
}

// Advanced processing pipeline
async function processFilesAdvanced(
  jobId: string,
  files: File[],
  userId: string,
  processingMode: string,
  options: any
) {
  try {
    await updateJobStatus(jobId, 'processing', 0);

    const results: AdvancedJewelryAnalysis[] = [];
    const batchSize = processingMode === 'premium' ? 5 : processingMode === 'advanced' ? 3 : 1;

    // Process files in batches for better performance
    for (let i = 0; i < files.length; i += batchSize) {
      const batch = files.slice(i, i + batchSize);
      const batchPromises = batch.map(async (file, index) => {
        try {
          const globalIndex = i + index;
          const progress = Math.round((globalIndex / files.length) * 100);
          
          // Update progress
          await updateJobStatus(jobId, 'processing', progress);

          // Process with advanced AI pipeline
          const result = await advancedImageProcessor.processImageAdvanced(
            file,
            (pipeline) => {
              // Store pipeline updates in real-time
              storePipelineUpdate(jobId, globalIndex, pipeline);
            }
          );

          // Store individual result
          await storeProcessingResult(jobId, result);
          
          return result;

        } catch (error) {
          console.error(`Error processing file ${file.name}:`, error);
          return {
            error: error instanceof Error ? error.message : 'Processing failed',
            filename: file.name,
            status: 'failed'
          } as any;
        }
      });

      // Wait for batch completion
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);

      // Update job with batch results
      await updateJobResults(jobId, results);
    }

    // Generate enhanced listings
    const listings = await generateEnhancedListings(jobId, results, userId, options);

    // Complete the job
    await updateJobStatus(jobId, 'completed', 100, results);

    // Send completion notification
    await sendCompletionNotification(userId, jobId, results.length);

  } catch (error) {
    console.error(`Advanced job ${jobId} failed:`, error);
    await updateJobStatus(jobId, 'failed', 0, [], error instanceof Error ? error.message : 'Unknown error');
  }
}

// Generate enhanced listings with AI optimization
async function generateEnhancedListings(
  jobId: string,
  results: AdvancedJewelryAnalysis[],
  userId: string,
  options: any
) {
  const successfulResults = results.filter(r => !r.error);
  
  const listings = successfulResults.map(result => ({
    id: generateListingId(),
    jobId,
    userId,
    title: result.listing.title,
    description: result.listing.description,
    price: result.market.estimatedValue.recommended,
    priceRange: {
      min: result.market.estimatedValue.low,
      max: result.market.estimatedValue.high
    },
    category: result.classification.category,
    subcategory: result.classification.subcategory,
    condition: result.condition.overall,
    conditionScore: result.condition.score,
    images: [], // Would be populated with processed image URLs
    metadata: {
      materials: result.classification.materials,
      gemstones: result.classification.gemstones,
      style: result.classification.style,
      brand: result.classification.brand,
      specifications: result.listing.specifications,
      careInstructions: result.listing.careInstructions
    },
    seo: {
      title: result.listing.title,
      description: result.listing.description,
      keywords: result.listing.keywords,
      tags: result.listing.tags,
      score: result.listing.seoScore
    },
    ai: {
      confidence: result.processing.confidence,
      qualityScore: result.processing.qualityScore,
      processingTime: result.processing.processingTime,
      modelVersions: result.processing.modelVersions
    },
    market: {
      demandLevel: result.market.demandLevel,
      marketTrend: result.market.marketTrend,
      comparables: result.market.comparables
    },
    embeddings: [], // Would be populated with vector embeddings
    status: 'draft',
    createdAt: new Date(),
    updatedAt: new Date()
  }));

  // Store listings in database
  for (const listing of listings) {
    await storeListing(listing);
  }

  return listings;
}

// Database operations
async function storeEnhancedJob(job: ProcessingJob) {
  const { error } = await supabase
    .from('processing_jobs_advanced')
    .insert(job);
    
  if (error) {
    console.error('Error storing enhanced job:', error);
    throw error;
  }
}

async function updateJobStatus(
  jobId: string, 
  status: string, 
  progress: number, 
  results?: any[], 
  error?: string
) {
  const updateData: any = {
    status,
    progress,
    updated_at: new Date()
  };
  
  if (results) updateData.results = results;
  if (error) updateData.error = error;

  const { error: updateError } = await supabase
    .from('processing_jobs_advanced')
    .update(updateData)
    .eq('id', jobId);
    
  if (updateError) {
    console.error('Error updating job status:', updateError);
  }
}

async function getJobStatus(jobId: string, userId: string) {
  const { data, error } = await supabase
    .from('processing_jobs_advanced')
    .select('*')
    .eq('id', jobId)
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error getting job status:', error);
    return null;
  }

  return data;
}

async function updateJobResults(jobId: string, results: any[]) {
  const { error } = await supabase
    .from('processing_jobs_advanced')
    .update({
      results,
      processed_files: results.length,
      updated_at: new Date()
    })
    .eq('id', jobId);
    
  if (error) {
    console.error('Error updating job results:', error);
  }
}

async function storeProcessingResult(jobId: string, result: any) {
  const { error } = await supabase
    .from('processing_results_advanced')
    .insert({
      job_id: jobId,
      result,
      created_at: new Date()
    });
    
  if (error) {
    console.error('Error storing processing result:', error);
  }
}

async function storePipelineUpdate(jobId: string, fileIndex: number, pipeline: any) {
  const { error } = await supabase
    .from('pipeline_updates')
    .insert({
      job_id: jobId,
      file_index: fileIndex,
      pipeline,
      created_at: new Date()
    });
    
  if (error) {
    console.error('Error storing pipeline update:', error);
  }
}

async function storeListing(listing: any) {
  const { error } = await supabase
    .from('listings_advanced')
    .insert(listing);
    
  if (error) {
    console.error('Error storing enhanced listing:', error);
  }
}

async function sendCompletionNotification(userId: string, jobId: string, resultCount: number) {
  // Send email notification using Resend
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'VintageVault <noreply@vintagevault.com>',
        to: [userId], // Assuming userId is email
        subject: 'Your jewelry analysis is complete!',
        html: `
          <h2>Processing Complete</h2>
          <p>Your ${resultCount} jewelry items have been successfully analyzed using our advanced AI system.</p>
          <p>Job ID: ${jobId}</p>
          <p>Features used: YOLO detection, Vision Transformer classification, brand recognition, and market analysis.</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/jobs/${jobId}">View Results</a>
        `
      })
    });

    if (!response.ok) {
      console.error('Failed to send notification email');
    }
  } catch (error) {
    console.error('Error sending notification:', error);
  }
}

// Utility functions
function generateJobId(): string {
  return `adv_job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function generateListingId(): string {
  return `adv_listing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function calculateProcessingTime(fileCount: number, mode: string): number {
  const baseTime = mode === 'premium' ? 90 : mode === 'advanced' ? 60 : 30;
  return fileCount * baseTime;
}

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

