'use client';

// Local image processing with mock AI analysis for jewelry classification
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

export interface LocalAnalysisResponse {
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

// Local image processing pipeline using browser-based processing and mock AI
export class ImageProcessor {
  private static instance: ImageProcessor;
  
  constructor() {
    // No external dependencies needed for local processing
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

    // Process images sequentially for better control and error handling
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      try {
        onProgress?.({
          total,
          processed: i,
          current: file.name,
          status: 'processing'
        });

        const processedImage = await this.processSingleImage(file);
        results.push(processedImage);
        
        onProgress?.({
          total,
          processed: i + 1,
          status: i + 1 === total ? 'complete' : 'processing'
        });

      } catch (error) {
        console.error(`Error processing ${file.name}:`, error);
        onProgress?.({
          total,
          processed: i,
          current: file.name,
          status: 'error',
          error: `Failed to process ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`
        });
        
        // Continue processing other files even if one fails
        const fallbackImage = await this.createFallbackProcessedImage(file);
        results.push(fallbackImage);
      }
    }

    return results;
  }

  private async processSingleImage(file: File): Promise<ProcessedImage> {
    const startTime = Date.now();
    
    try {
      // Use local upload API for processing
      const formData = new FormData();
      formData.append('files', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success || !result.results || result.results.length === 0) {
        throw new Error(result.error || 'No results returned');
      }
      
      const uploadResult = result.results[0];
      if (uploadResult.error) {
        throw new Error(uploadResult.error);
      }
      
      const processingTime = Date.now() - startTime;

      return {
        id: uploadResult.id,
        originalFile: file,
        processedUrl: uploadResult.url,
        analysis: uploadResult.analysis,
        confidence: uploadResult.confidence || 0.85,
        processingTime: uploadResult.processingTime || processingTime
      };

    } catch (error) {
      console.error('Error processing image:', error);
      throw error; // Let the caller handle fallback
    }
  }

  private async createFallbackProcessedImage(file: File): Promise<ProcessedImage> {
    const startTime = Date.now();
    const analysis = this.getFallbackAnalysis();
    const processingTime = Date.now() - startTime;

    return {
      id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      originalFile: file,
      processedUrl: URL.createObjectURL(file),
      analysis,
      confidence: 0.5,
      processingTime
    };
  }

  // Simple local analysis method (already using mock data from API)
  private async analyzeLocally(file: File): Promise<JewelryAnalysis> {
    // This method is now handled by the upload API
    // which uses MockAIAnalyzer for generating analysis
    throw new Error('Use processSingleImage instead - this method is deprecated');
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

  // Batch processing using local advanced API
  async processBatch(files: File[], userId: string = 'anonymous', processingMode: string = 'advanced'): Promise<{ jobId: string }> {
    const formData = new FormData();
    
    files.forEach((file) => {
      formData.append('files', file);
    });
    
    formData.append('userId', userId);
    formData.append('processingMode', processingMode);
    formData.append('options', JSON.stringify({
      includeMarketAnalysis: true,
      includeBrandRecognition: true,
      includeConditionAssessment: true,
      generateSEOContent: true,
      batchProcessing: true
    }));

    const response = await fetch('/api/upload/advanced', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Batch processing failed: ${response.status}`);
    }

    const result = await response.json();
    return { jobId: result.jobId };
  }

  // Check job status for batch processing
  async checkJobStatus(jobId: string, userId: string = 'anonymous'): Promise<{
    status: string;
    progress: number;
    results?: any[];
    error?: string;
  }> {
    const response = await fetch(`/api/upload/advanced?jobId=${jobId}&userId=${userId}`);

    if (!response.ok) {
      throw new Error(`Job status check failed: ${response.status}`);
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Failed to get job status');
    }

    return {
      status: result.job.status,
      progress: result.job.progress,
      results: result.job.results,
      error: result.job.error
    };
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

