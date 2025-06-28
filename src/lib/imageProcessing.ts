'use client';

// Enhanced image processing using Modal.com jewelry classification API
export interface JewelryAnalysis {
  title: string;
  description: string;
  category: 'vintage' | 'costume' | 'designer' | 'necklace' | 'ring' | 'bracelet' | 'earrings' | 'brooch' | 'pendant' | 'watch';
  era?: string;
  brand?: string;
  materials: string[];
  condition: 'excellent' | 'very-good' | 'good' | 'fair';
  estimatedPrice: number;
  careInstructions: string[];
  keywords: string[];
  specifications: {
    type: string;
    size?: string;
    weight?: string;
    gemstones?: string[];
    metalType?: string;
    style?: string;
    colorAnalysis?: {
      dominantColors: string[];
      colorHarmony: string;
      brightness: string;
      saturation: string;
    };
    textureAnalysis?: {
      surfaceFinish: string;
      pattern: string;
    };
  };
  confidence: number;
  aiAnalysis?: {
    yoloResults?: any;
    clipResults?: any;
    qwenResults?: any;
    samResults?: any;
  };
  seoData?: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    tags: string[];
  };
}

export interface ProcessedImage {
  id: string;
  originalFile: File;
  processedUrl: string;
  analysis: JewelryAnalysis;
  confidence: number;
  processingTime: number;
  jobId?: string;
}

export interface UploadProgress {
  total: number;
  processed: number;
  current?: string;
  status: 'uploading' | 'processing' | 'analyzing' | 'complete' | 'error';
  error?: string;
  jobId?: string;
}

export interface ModalAnalysisResponse {
  filename: string;
  category: string;
  materials: string[];
  gemstones: string[];
  style: string;
  confidence: number;
  optimized_listing: {
    title: string;
    description: string;
    price: number;
    category: string;
    tags: string[];
    features: string[];
    care_instructions: string[];
    target_audience: string;
    occasion_suitability: string[];
  };
  seo_data: {
    meta_title: string;
    meta_description: string;
    keywords: string[];
    tags: string[];
    alt_text: string;
  };
  ai_analysis: {
    yolo_results: any;
    clip_results: any;
    qwen_results: any;
    sam_results: any;
  };
  processing_time: number;
}

// Enhanced image processing pipeline using Modal.com
export class ImageProcessor {
  private static instance: ImageProcessor;
  private modalEndpoint: string;
  private modalTokenId: string;
  private modalTokenSecret: string;
  
  constructor() {
    this.modalEndpoint = process.env.NEXT_PUBLIC_MODAL_ENDPOINT || 'https://ai-tool-pool--jewelry-classifier-api.modal.run';
    this.modalTokenId = process.env.MODAL_TOKEN_ID || '';
    this.modalTokenSecret = process.env.MODAL_TOKEN_SECRET || '';
  }
  
  static getInstance(): ImageProcessor {
    if (!ImageProcessor.instance) {
      ImageProcessor.instance = new ImageProcessor();
    }
    return ImageProcessor.instance;
  }

  async processImages(
    files: File[],
    onProgress?: (progress: UploadProgress) => void
  ): Promise<ProcessedImage[]> {
    const results: ProcessedImage[] = [];
    const total = files.length;

    onProgress?.({
      total,
      processed: 0,
      status: 'uploading'
    });

    // Process images in batches for better performance
    const batchSize = 3;
    for (let i = 0; i < files.length; i += batchSize) {
      const batch = files.slice(i, i + batchSize);
      const batchPromises = batch.map(async (file, batchIndex) => {
        const globalIndex = i + batchIndex;
        
        try {
          onProgress?.({
            total,
            processed: globalIndex,
            current: file.name,
            status: 'processing'
          });

          const processedImage = await this.processSingleImage(file);
          
          onProgress?.({
            total,
            processed: globalIndex + 1,
            status: globalIndex + 1 === total ? 'complete' : 'processing'
          });

          return processedImage;

        } catch (error) {
          console.error(`Error processing ${file.name}:`, error);
          onProgress?.({
            total,
            processed: globalIndex,
            current: file.name,
            status: 'error',
            error: `Failed to process ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`
          });
          return null;
        }
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults.filter(result => result !== null) as ProcessedImage[]);
    }

    return results;
  }

  private async processSingleImage(file: File): Promise<ProcessedImage> {
    const startTime = Date.now();
    
    try {
      // Convert file to base64 for API
      const base64Image = await this.fileToBase64(file);
      
      // Analyze image with Modal.com jewelry classification API
      const modalResponse = await this.analyzeWithModal(base64Image, file.name);
      
      // Convert Modal response to our format
      const analysis = this.convertModalResponseToAnalysis(modalResponse);
      
      // Create processed image URL (in real app, this would be uploaded to cloud storage)
      const processedUrl = URL.createObjectURL(file);
      
      const processingTime = Date.now() - startTime;

      return {
        id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        originalFile: file,
        processedUrl,
        analysis,
        confidence: modalResponse.confidence || 0.85,
        processingTime,
        jobId: modalResponse.job_id
      };

    } catch (error) {
      console.error('Error processing image:', error);
      // Return fallback analysis if Modal API fails
      const fallbackAnalysis = this.getFallbackAnalysis();
      const processingTime = Date.now() - startTime;

      return {
        id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        originalFile: file,
        processedUrl: URL.createObjectURL(file),
        analysis: fallbackAnalysis,
        confidence: 0.5,
        processingTime
      };
    }
  }

  private async analyzeWithModal(base64Image: string, filename: string): Promise<ModalAnalysisResponse> {
    const formData = new FormData();
    
    // Convert base64 back to blob for FormData
    const byteCharacters = atob(base64Image);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/jpeg' });
    
    formData.append('file', blob, filename);
    formData.append('analysis_type', 'comprehensive');
    formData.append('include_seo', 'true');
    formData.append('include_pricing', 'true');

    const response = await fetch(`${this.modalEndpoint}/analyze-single`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${this.modalTokenId}:${this.modalTokenSecret}`,
        // Don't set Content-Type for FormData, let browser set it with boundary
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Modal API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    return result;
  }

  private convertModalResponseToAnalysis(modalResponse: ModalAnalysisResponse): JewelryAnalysis {
    const listing = modalResponse.optimized_listing;
    const seo = modalResponse.seo_data;
    const aiAnalysis = modalResponse.ai_analysis;

    // Map category to our enum
    const categoryMap: { [key: string]: JewelryAnalysis['category'] } = {
      'necklace': 'necklace',
      'ring': 'ring',
      'bracelet': 'bracelet',
      'earrings': 'earrings',
      'brooch': 'brooch',
      'pendant': 'pendant',
      'watch': 'watch',
      'vintage': 'vintage',
      'costume': 'costume',
      'designer': 'designer'
    };

    const category = categoryMap[modalResponse.category.toLowerCase()] || 'costume';

    // Extract era from style or AI analysis
    const era = aiAnalysis?.clip_results?.style_classification?.includes('1920') ? '1920s' :
                aiAnalysis?.clip_results?.style_classification?.includes('1960') ? '1960s' :
                aiAnalysis?.clip_results?.style_classification?.includes('victorian') ? 'Victorian' :
                aiAnalysis?.clip_results?.style_classification?.includes('art deco') ? 'Art Deco' :
                undefined;

    // Determine condition based on confidence and analysis
    const condition: JewelryAnalysis['condition'] = 
      modalResponse.confidence > 0.9 ? 'excellent' :
      modalResponse.confidence > 0.8 ? 'very-good' :
      modalResponse.confidence > 0.7 ? 'good' : 'fair';

    return {
      title: listing.title || `Beautiful ${modalResponse.category}`,
      description: listing.description || 'A stunning piece of jewelry with unique character and charm.',
      category,
      era,
      brand: undefined, // Would be extracted from AI analysis if available
      materials: modalResponse.materials || ['Mixed metals'],
      condition,
      estimatedPrice: Math.max(20, Math.min(500, listing.price || 125)),
      careInstructions: listing.care_instructions || [
        'Store in a dry place away from direct sunlight',
        'Clean gently with a soft, dry cloth',
        'Avoid exposure to chemicals and perfumes'
      ],
      keywords: seo.keywords || listing.tags || ['jewelry', 'vintage', 'unique'],
      specifications: {
        type: modalResponse.category || 'jewelry',
        style: modalResponse.style || 'classic',
        gemstones: modalResponse.gemstones,
        metalType: modalResponse.materials?.[0],
        colorAnalysis: aiAnalysis?.clip_results?.color_analysis ? {
          dominantColors: aiAnalysis.clip_results.color_analysis.dominant_colors || [],
          colorHarmony: aiAnalysis.clip_results.color_analysis.color_harmony || 'unknown',
          brightness: aiAnalysis.clip_results.color_analysis.brightness || 'medium',
          saturation: aiAnalysis.clip_results.color_analysis.saturation || 'medium'
        } : undefined,
        textureAnalysis: aiAnalysis?.clip_results?.texture_analysis ? {
          surfaceFinish: aiAnalysis.clip_results.texture_analysis.surface_finish || 'polished',
          pattern: aiAnalysis.clip_results.texture_analysis.pattern || 'solid'
        } : undefined
      },
      confidence: modalResponse.confidence,
      aiAnalysis: {
        yoloResults: aiAnalysis?.yolo_results,
        clipResults: aiAnalysis?.clip_results,
        qwenResults: aiAnalysis?.qwen_results,
        samResults: aiAnalysis?.sam_results
      },
      seoData: {
        metaTitle: seo.meta_title || listing.title,
        metaDescription: seo.meta_description || listing.description,
        keywords: seo.keywords || [],
        tags: seo.tags || listing.tags || []
      }
    };
  }

  private getFallbackAnalysis(): JewelryAnalysis {
    return {
      title: 'Vintage Jewelry Piece',
      description: 'A beautiful piece of jewelry with unique character and timeless appeal. Perfect for collectors or those who appreciate vintage craftsmanship.',
      category: 'vintage',
      materials: ['Mixed metals'],
      condition: 'good',
      estimatedPrice: 125,
      careInstructions: [
        'Store in a dry place away from direct sunlight',
        'Clean gently with a soft, dry cloth',
        'Avoid exposure to chemicals and perfumes'
      ],
      keywords: ['vintage', 'jewelry', 'unique', 'collectible'],
      specifications: {
        type: 'jewelry'
      },
      confidence: 0.5
    };
  }

  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1]; // Remove data:image/jpeg;base64, prefix
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Batch processing for multiple images
  async processBatch(files: File[]): Promise<{ jobId: string }> {
    const formData = new FormData();
    
    files.forEach((file, index) => {
      formData.append(`files`, file);
    });
    
    formData.append('analysis_type', 'comprehensive');
    formData.append('include_seo', 'true');
    formData.append('include_pricing', 'true');

    const response = await fetch(`${this.modalEndpoint}/analyze-batch`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${this.modalTokenId}:${this.modalTokenSecret}`,
      }
    });

    if (!response.ok) {
      throw new Error(`Batch processing failed: ${response.status}`);
    }

    const result = await response.json();
    return { jobId: result.job_id };
  }

  // Check job status for batch processing
  async checkJobStatus(jobId: string): Promise<{
    status: string;
    progress: number;
    results?: ModalAnalysisResponse[];
    error?: string;
  }> {
    const response = await fetch(`${this.modalEndpoint}/job-status/${jobId}`, {
      headers: {
        'Authorization': `Bearer ${this.modalTokenId}:${this.modalTokenSecret}`,
      }
    });

    if (!response.ok) {
      throw new Error(`Job status check failed: ${response.status}`);
    }

    return await response.json();
  }

  // Utility functions for file handling
  static async extractFilesFromZip(zipFile: File): Promise<File[]> {
    // This would require a zip library like JSZip
    // For now, return the single file
    return [zipFile];
  }

  static async processFolder(files: FileList): Promise<File[]> {
    const imageFiles: File[] = [];
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (allowedTypes.includes(file.type)) {
        imageFiles.push(file);
      }
    }

    return imageFiles;
  }

  static validateImageFile(file: File): boolean {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    return allowedTypes.includes(file.type) && file.size <= maxSize;
  }

  // Enhanced validation for jewelry images
  static validateJewelryImage(file: File): {
    valid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // File type validation
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      errors.push('File type not supported. Please use JPEG, PNG, or WebP format.');
    }

    // File size validation
    const maxSize = 10 * 1024 * 1024; // 10MB
    const minSize = 50 * 1024; // 50KB
    if (file.size > maxSize) {
      errors.push('File size too large. Maximum size is 10MB.');
    }
    if (file.size < minSize) {
      warnings.push('File size is very small. Higher resolution images provide better analysis.');
    }

    // File name validation
    if (file.name.length > 100) {
      warnings.push('File name is very long. Consider using a shorter name.');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }
}

// Export singleton instance
export const imageProcessor = ImageProcessor.getInstance();

