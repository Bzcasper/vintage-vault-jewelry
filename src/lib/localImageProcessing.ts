// Local Image Processing using Sharp
import sharp from 'sharp';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export interface ProcessingOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
  preserveMetadata?: boolean;
}

export interface ProcessedImageResult {
  buffer: Buffer;
  metadata: sharp.Metadata;
  size: number;
  format: string;
  filename: string;
  url: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  fileInfo?: {
    size: number;
    type: string;
    name: string;
  };
}

export class LocalImageProcessor {
  private uploadsDir: string;
  private publicPath: string;

  constructor() {
    this.uploadsDir = join(process.cwd(), 'public', 'uploads');
    this.publicPath = '/uploads';
    this.ensureUploadDirectory();
  }

  /**
   * Ensure upload directory exists
   */
  private async ensureUploadDirectory(): Promise<void> {
    try {
      if (!existsSync(this.uploadsDir)) {
        await mkdir(this.uploadsDir, { recursive: true });
      }
    } catch (error) {
      console.error('Failed to create upload directory:', error);
    }
  }

  /**
   * Validate uploaded file
   */
  validateFile(file: File): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // File type validation
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      errors.push(`Unsupported file type: ${file.type}. Please use JPEG, PNG, or WebP.`);
    }

    // File size validation (10MB max)
    const maxSize = 10 * 1024 * 1024;
    const minSize = 10 * 1024; // 10KB min
    
    if (file.size > maxSize) {
      errors.push(`File too large: ${this.formatFileSize(file.size)}. Maximum size is ${this.formatFileSize(maxSize)}.`);
    }
    
    if (file.size < minSize) {
      warnings.push(`File very small: ${this.formatFileSize(file.size)}. Larger images provide better results.`);
    }

    // Filename validation
    if (file.name.length > 100) {
      warnings.push('Filename is very long. Consider shortening it.');
    }

    if (!/^[a-zA-Z0-9._-]+$/.test(file.name.replace(/\s+/g, '_'))) {
      warnings.push('Filename contains special characters that will be sanitized.');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      fileInfo: {
        size: file.size,
        type: file.type,
        name: file.name
      }
    };
  }

  /**
   * Process a single image
   */
  async processImage(
    file: File,
    options: ProcessingOptions = {}
  ): Promise<ProcessedImageResult> {
    const {
      maxWidth = 1200,
      maxHeight = 1200,
      quality = 85,
      format = 'webp',
      preserveMetadata = false
    } = options;

    try {
      // Convert File to Buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Get original metadata
      const originalMetadata = await sharp(buffer).metadata();

      // Process image
      let processor = sharp(buffer);

      // Resize if needed
      if (originalMetadata.width && originalMetadata.height) {
        if (originalMetadata.width > maxWidth || originalMetadata.height > maxHeight) {
          processor = processor.resize(maxWidth, maxHeight, {
            fit: 'inside',
            withoutEnlargement: true
          });
        }
      }

      // Set format and quality
      switch (format) {
        case 'jpeg':
          processor = processor.jpeg({ quality, mozjpeg: true });
          break;
        case 'png':
          processor = processor.png({ quality });
          break;
        case 'webp':
          processor = processor.webp({ quality });
          break;
      }

      // Handle metadata
      if (!preserveMetadata) {
        processor = processor.rotate(); // Auto-rotate based on EXIF, then strip EXIF
      }

      // Process the image
      const processedBuffer = await processor.toBuffer();
      const processedMetadata = await sharp(processedBuffer).metadata();

      // Generate unique filename
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2, 15);
      const sanitizedName = this.sanitizeFilename(file.name);
      const nameWithoutExt = sanitizedName.replace(/\.[^/.]+$/, '');
      const filename = `${nameWithoutExt}_${timestamp}_${randomId}.${format}`;

      // Save to public/uploads directory
      const filePath = join(this.uploadsDir, filename);
      await writeFile(filePath, processedBuffer);

      // Generate public URL
      const url = `${this.publicPath}/${filename}`;

      return {
        buffer: processedBuffer,
        metadata: processedMetadata,
        size: processedBuffer.length,
        format: format,
        filename,
        url
      };

    } catch (error) {
      console.error('Image processing error:', error);
      throw new Error(`Failed to process image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Process multiple images
   */
  async processImages(
    files: File[],
    options: ProcessingOptions = {},
    onProgress?: (processed: number, total: number, current: string) => void
  ): Promise<ProcessedImageResult[]> {
    const results: ProcessedImageResult[] = [];
    const total = files.length;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      onProgress?.(i, total, file.name);

      try {
        const result = await this.processImage(file, options);
        results.push(result);
      } catch (error) {
        console.error(`Failed to process ${file.name}:`, error);
        // Continue processing other files even if one fails
      }

      onProgress?.(i + 1, total, file.name);
    }

    return results;
  }

  /**
   * Generate multiple sizes/formats of an image
   */
  async generateImageVariants(
    file: File,
    variants: { name: string; options: ProcessingOptions }[]
  ): Promise<{ [key: string]: ProcessedImageResult }> {
    const results: { [key: string]: ProcessedImageResult } = {};

    for (const variant of variants) {
      try {
        const result = await this.processImage(file, variant.options);
        results[variant.name] = result;
      } catch (error) {
        console.error(`Failed to generate ${variant.name} variant:`, error);
      }
    }

    return results;
  }

  /**
   * Create common jewelry image variants
   */
  async createJewelryVariants(file: File): Promise<{
    thumbnail: ProcessedImageResult;
    medium: ProcessedImageResult;
    large: ProcessedImageResult;
    original: ProcessedImageResult;
  }> {
    const variants = await this.generateImageVariants(file, [
      {
        name: 'thumbnail',
        options: { maxWidth: 300, maxHeight: 300, quality: 80, format: 'webp' }
      },
      {
        name: 'medium',
        options: { maxWidth: 600, maxHeight: 600, quality: 85, format: 'webp' }
      },
      {
        name: 'large',
        options: { maxWidth: 1200, maxHeight: 1200, quality: 90, format: 'webp' }
      },
      {
        name: 'original',
        options: { maxWidth: 2000, maxHeight: 2000, quality: 95, format: 'jpeg', preserveMetadata: true }
      }
    ]);

    return variants as any; // Type assertion since we know these variants exist
  }

  /**
   * Extract basic image information for analysis
   */
  async analyzeImage(file: File): Promise<{
    dimensions: { width: number; height: number };
    fileSize: number;
    format: string;
    hasAlpha: boolean;
    colorSpace: string;
    quality: 'low' | 'medium' | 'high';
    aspectRatio: number;
  }> {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const metadata = await sharp(buffer).metadata();

    const width = metadata.width || 0;
    const height = metadata.height || 0;
    const aspectRatio = width > 0 && height > 0 ? width / height : 1;

    // Estimate quality based on file size and dimensions
    const pixelCount = width * height;
    const bytesPerPixel = file.size / pixelCount;
    const quality = bytesPerPixel > 3 ? 'high' : bytesPerPixel > 1.5 ? 'medium' : 'low';

    return {
      dimensions: { width, height },
      fileSize: file.size,
      format: metadata.format || 'unknown',
      hasAlpha: metadata.hasAlpha || false,
      colorSpace: metadata.space || 'unknown',
      quality,
      aspectRatio
    };
  }

  /**
   * Optimize image for web display
   */
  async optimizeForWeb(file: File): Promise<{
    optimized: ProcessedImageResult;
    savings: number;
    originalSize: number;
  }> {
    const originalSize = file.size;
    
    // Determine optimal settings based on image characteristics
    const analysis = await this.analyzeImage(file);
    
    const options: ProcessingOptions = {
      maxWidth: Math.min(1200, analysis.dimensions.width),
      maxHeight: Math.min(1200, analysis.dimensions.height),
      quality: analysis.quality === 'high' ? 85 : analysis.quality === 'medium' ? 80 : 75,
      format: 'webp'
    };

    const optimized = await this.processImage(file, options);
    const savings = ((originalSize - optimized.size) / originalSize) * 100;

    return {
      optimized,
      savings: Math.max(0, savings),
      originalSize
    };
  }

  /**
   * Sanitize filename for safe storage
   */
  private sanitizeFilename(filename: string): string {
    return filename
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .replace(/_{2,}/g, '_')
      .toLowerCase();
  }

  /**
   * Format file size for display
   */
  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Validate multiple files at once
   */
  validateFiles(files: File[]): {
    valid: File[];
    invalid: { file: File; errors: string[] }[];
    warnings: { file: File; warnings: string[] }[];
    totalSize: number;
  } {
    const valid: File[] = [];
    const invalid: { file: File; errors: string[] }[] = [];
    const warnings: { file: File; warnings: string[] }[] = [];
    let totalSize = 0;

    for (const file of files) {
      const validation = this.validateFile(file);
      totalSize += file.size;

      if (validation.valid) {
        valid.push(file);
      } else {
        invalid.push({ file, errors: validation.errors });
      }

      if (validation.warnings.length > 0) {
        warnings.push({ file, warnings: validation.warnings });
      }
    }

    return { valid, invalid, warnings, totalSize };
  }
}

// Export singleton instance
export const localImageProcessor = new LocalImageProcessor();
export default LocalImageProcessor;