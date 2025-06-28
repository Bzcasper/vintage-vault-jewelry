'use client';

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface ImageOptimizationOptions {
  quality: number; // 1-100
  format: 'webp' | 'jpeg' | 'png' | 'avif';
  sizes: Array<{
    name: string;
    width: number;
    height?: number;
    quality?: number;
  }>;
  removeBackground: boolean;
  enhanceColors: boolean;
  sharpen: boolean;
  watermark?: {
    text: string;
    position: 'bottom-right' | 'bottom-left' | 'center';
    opacity: number;
  };
  metadata: {
    preserveExif: boolean;
    addWatermark: boolean;
    addCopyright: boolean;
  };
}

export interface OptimizedImage {
  original: {
    url: string;
    size: number;
    width: number;
    height: number;
    format: string;
  };
  optimized: Array<{
    name: string;
    url: string;
    size: number;
    width: number;
    height: number;
    format: string;
    quality: number;
    compressionRatio: number;
  }>;
  metadata: {
    processingTime: number;
    totalSizeReduction: number;
    averageCompressionRatio: number;
    colorProfile: string;
    hasTransparency: boolean;
    dominantColors: string[];
  };
  analysis: {
    sharpness: number;
    brightness: number;
    contrast: number;
    saturation: number;
    noiseLevel: number;
    qualityScore: number;
  };
}

export class ImageOptimizationPipeline {
  private static instance: ImageOptimizationPipeline;

  static getInstance(): ImageOptimizationPipeline {
    if (!ImageOptimizationPipeline.instance) {
      ImageOptimizationPipeline.instance = new ImageOptimizationPipeline();
    }
    return ImageOptimizationPipeline.instance;
  }

  async optimizeImage(
    file: File,
    options: Partial<ImageOptimizationOptions> = {},
    onProgress?: (progress: number, stage: string) => void
  ): Promise<OptimizedImage> {
    const startTime = Date.now();
    
    // Default optimization options for jewelry images
    const defaultOptions: ImageOptimizationOptions = {
      quality: 85,
      format: 'webp',
      sizes: [
        { name: 'thumbnail', width: 150, height: 150, quality: 80 },
        { name: 'small', width: 300, height: 300, quality: 85 },
        { name: 'medium', width: 600, height: 600, quality: 85 },
        { name: 'large', width: 1200, height: 1200, quality: 90 },
        { name: 'original', width: 2048, quality: 95 }
      ],
      removeBackground: false,
      enhanceColors: true,
      sharpen: true,
      metadata: {
        preserveExif: false,
        addWatermark: true,
        addCopyright: true
      }
    };

    const finalOptions = { ...defaultOptions, ...options };

    try {
      onProgress?.(10, 'Analyzing image');
      
      // Step 1: Load and analyze the original image
      const originalImageData = await this.loadImage(file);
      const analysis = await this.analyzeImage(originalImageData);

      onProgress?.(20, 'Preprocessing image');

      // Step 2: Preprocess the image
      let processedImage = originalImageData;
      
      if (finalOptions.enhanceColors) {
        processedImage = await this.enhanceColors(processedImage);
      }

      if (finalOptions.sharpen) {
        processedImage = await this.sharpenImage(processedImage);
      }

      if (finalOptions.removeBackground) {
        processedImage = await this.removeBackground(processedImage);
      }

      onProgress?.(40, 'Generating optimized versions');

      // Step 3: Generate multiple sizes and formats
      const optimizedVersions = [];
      const totalSizes = finalOptions.sizes.length;

      for (let i = 0; i < finalOptions.sizes.length; i++) {
        const sizeConfig = finalOptions.sizes[i];
        const progress = 40 + (i / totalSizes) * 40;
        
        onProgress?.(progress, `Creating ${sizeConfig.name} version`);

        const optimized = await this.createOptimizedVersion(
          processedImage,
          sizeConfig,
          finalOptions
        );

        optimizedVersions.push(optimized);
      }

      onProgress?.(85, 'Uploading to storage');

      // Step 4: Upload to storage
      const uploadedVersions = await this.uploadOptimizedImages(
        file.name,
        optimizedVersions
      );

      onProgress?.(95, 'Extracting metadata');

      // Step 5: Extract and process metadata
      const metadata = await this.extractMetadata(originalImageData, optimizedVersions);

      onProgress?.(100, 'Complete');

      const processingTime = Date.now() - startTime;

      return {
        original: {
          url: await this.uploadOriginal(file),
          size: file.size,
          width: originalImageData.width,
          height: originalImageData.height,
          format: file.type
        },
        optimized: uploadedVersions,
        metadata: {
          ...metadata,
          processingTime
        },
        analysis
      };

    } catch (error) {
      console.error('Image optimization failed:', error);
      throw new Error(`Image optimization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async optimizeBatch(
    files: File[],
    options: Partial<ImageOptimizationOptions> = {},
    onProgress?: (overallProgress: number, currentFile: string, fileProgress: number) => void
  ): Promise<OptimizedImage[]> {
    const results: OptimizedImage[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const overallProgress = (i / files.length) * 100;
      
      try {
        const result = await this.optimizeImage(
          file,
          options,
          (fileProgress, stage) => {
            onProgress?.(overallProgress, file.name, fileProgress);
          }
        );
        
        results.push(result);
      } catch (error) {
        console.error(`Failed to optimize ${file.name}:`, error);
        // Continue with other files
      }
    }

    return results;
  }

  private async loadImage(file: File): Promise<ImageData & { width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        const imageData = ctx?.getImageData(0, 0, img.width, img.height);
        if (imageData) {
          resolve({
            ...imageData,
            width: img.width,
            height: img.height
          });
        } else {
          reject(new Error('Failed to load image data'));
        }
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }

  private async analyzeImage(imageData: ImageData & { width: number; height: number }) {
    const pixels = imageData.data;
    let totalBrightness = 0;
    let totalSaturation = 0;
    let edgeCount = 0;
    
    const colorCounts: Record<string, number> = {};

    // Analyze pixels
    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];

      // Calculate brightness
      const brightness = (r + g + b) / 3;
      totalBrightness += brightness;

      // Calculate saturation
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const saturation = max === 0 ? 0 : (max - min) / max;
      totalSaturation += saturation;

      // Track dominant colors (simplified)
      const colorKey = `${Math.floor(r / 32) * 32},${Math.floor(g / 32) * 32},${Math.floor(b / 32) * 32}`;
      colorCounts[colorKey] = (colorCounts[colorKey] || 0) + 1;

      // Simple edge detection (check if pixel differs significantly from next)
      if (i + 4 < pixels.length) {
        const nextR = pixels[i + 4];
        const diff = Math.abs(r - nextR);
        if (diff > 30) edgeCount++;
      }
    }

    const pixelCount = pixels.length / 4;
    const avgBrightness = totalBrightness / pixelCount;
    const avgSaturation = totalSaturation / pixelCount;
    const sharpness = (edgeCount / pixelCount) * 100;

    // Get dominant colors
    const dominantColors = Object.entries(colorCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([color]) => `rgb(${color})`);

    return {
      sharpness: Math.min(sharpness, 100),
      brightness: (avgBrightness / 255) * 100,
      contrast: this.calculateContrast(pixels),
      saturation: avgSaturation * 100,
      noiseLevel: this.calculateNoise(pixels),
      qualityScore: this.calculateQualityScore(sharpness, avgBrightness, avgSaturation)
    };
  }

  private calculateContrast(pixels: Uint8ClampedArray): number {
    let min = 255;
    let max = 0;

    for (let i = 0; i < pixels.length; i += 4) {
      const brightness = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
      min = Math.min(min, brightness);
      max = Math.max(max, brightness);
    }

    return ((max - min) / 255) * 100;
  }

  private calculateNoise(pixels: Uint8ClampedArray): number {
    let noiseSum = 0;
    let count = 0;

    for (let i = 0; i < pixels.length - 12; i += 4) {
      const r1 = pixels[i];
      const r2 = pixels[i + 4];
      const r3 = pixels[i + 8];
      
      const variation = Math.abs(r1 - 2 * r2 + r3);
      noiseSum += variation;
      count++;
    }

    return Math.min((noiseSum / count) / 10, 100);
  }

  private calculateQualityScore(sharpness: number, brightness: number, saturation: number): number {
    // Ideal ranges for jewelry photography
    const sharpnessScore = sharpness > 20 ? 100 : (sharpness / 20) * 100;
    const brightnessScore = brightness >= 40 && brightness <= 80 ? 100 : 
                           Math.max(0, 100 - Math.abs(brightness - 60) * 2);
    const saturationScore = saturation >= 30 && saturation <= 70 ? 100 :
                           Math.max(0, 100 - Math.abs(saturation - 50) * 2);

    return (sharpnessScore + brightnessScore + saturationScore) / 3;
  }

  private async enhanceColors(imageData: ImageData & { width: number; height: number }) {
    const pixels = imageData.data;
    
    // Simple color enhancement for jewelry
    for (let i = 0; i < pixels.length; i += 4) {
      // Increase contrast slightly
      pixels[i] = Math.min(255, pixels[i] * 1.1);     // Red
      pixels[i + 1] = Math.min(255, pixels[i + 1] * 1.1); // Green
      pixels[i + 2] = Math.min(255, pixels[i + 2] * 1.1); // Blue
    }

    return imageData;
  }

  private async sharpenImage(imageData: ImageData & { width: number; height: number }) {
    // Simple sharpening kernel
    const kernel = [
      0, -1, 0,
      -1, 5, -1,
      0, -1, 0
    ];

    const pixels = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    const newPixels = new Uint8ClampedArray(pixels);

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        for (let c = 0; c < 3; c++) { // RGB channels
          let sum = 0;
          for (let ky = -1; ky <= 1; ky++) {
            for (let kx = -1; kx <= 1; kx++) {
              const pixelIndex = ((y + ky) * width + (x + kx)) * 4 + c;
              const kernelIndex = (ky + 1) * 3 + (kx + 1);
              sum += pixels[pixelIndex] * kernel[kernelIndex];
            }
          }
          const newPixelIndex = (y * width + x) * 4 + c;
          newPixels[newPixelIndex] = Math.max(0, Math.min(255, sum));
        }
      }
    }

    return {
      ...imageData,
      data: newPixels
    };
  }

  private async removeBackground(imageData: ImageData & { width: number; height: number }) {
    // Simplified background removal (would use more sophisticated algorithms in production)
    const pixels = imageData.data;
    
    // Find the most common color (assumed to be background)
    const colorCounts: Record<string, number> = {};
    
    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      const key = `${r},${g},${b}`;
      colorCounts[key] = (colorCounts[key] || 0) + 1;
    }

    const backgroundColor = Object.entries(colorCounts)
      .sort(([, a], [, b]) => b - a)[0][0]
      .split(',')
      .map(Number);

    // Remove similar colors
    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      
      const distance = Math.sqrt(
        Math.pow(r - backgroundColor[0], 2) +
        Math.pow(g - backgroundColor[1], 2) +
        Math.pow(b - backgroundColor[2], 2)
      );

      if (distance < 50) { // Threshold for background similarity
        pixels[i + 3] = 0; // Make transparent
      }
    }

    return imageData;
  }

  private async createOptimizedVersion(
    imageData: ImageData & { width: number; height: number },
    sizeConfig: { name: string; width: number; height?: number; quality?: number },
    options: ImageOptimizationOptions
  ) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Calculate dimensions
    const aspectRatio = imageData.width / imageData.height;
    let targetWidth = sizeConfig.width;
    let targetHeight = sizeConfig.height || Math.round(targetWidth / aspectRatio);

    // Maintain aspect ratio if only width is specified
    if (!sizeConfig.height) {
      targetHeight = Math.round(targetWidth / aspectRatio);
    }

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    // Create temporary canvas with original image
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = imageData.width;
    tempCanvas.height = imageData.height;
    tempCtx?.putImageData(imageData, 0, 0);

    // Draw resized image
    ctx?.drawImage(tempCanvas, 0, 0, targetWidth, targetHeight);

    // Add watermark if specified
    if (options.watermark) {
      await this.addWatermark(ctx!, options.watermark, targetWidth, targetHeight);
    }

    // Convert to blob
    const quality = (sizeConfig.quality || options.quality) / 100;
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob(resolve as any, `image/${options.format}`, quality);
    });

    if (!blob) {
      throw new Error('Failed to create optimized image blob');
    }

    const originalSize = imageData.data.length;
    const compressionRatio = originalSize / blob.size;

    return {
      name: sizeConfig.name,
      blob,
      size: blob.size,
      width: targetWidth,
      height: targetHeight,
      format: options.format,
      quality: sizeConfig.quality || options.quality,
      compressionRatio
    };
  }

  private async addWatermark(
    ctx: CanvasRenderingContext2D,
    watermark: { text: string; position: string; opacity: number },
    width: number,
    height: number
  ) {
    ctx.save();
    ctx.globalAlpha = watermark.opacity;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = `${Math.max(12, width / 40)}px Arial`;

    const textMetrics = ctx.measureText(watermark.text);
    const textWidth = textMetrics.width;
    const textHeight = 20;

    let x, y;
    switch (watermark.position) {
      case 'bottom-right':
        x = width - textWidth - 10;
        y = height - 10;
        break;
      case 'bottom-left':
        x = 10;
        y = height - 10;
        break;
      case 'center':
        x = (width - textWidth) / 2;
        y = height / 2;
        break;
      default:
        x = width - textWidth - 10;
        y = height - 10;
    }

    ctx.fillText(watermark.text, x, y);
    ctx.restore();
  }

  private async uploadOptimizedImages(originalName: string, optimizedVersions: any[]) {
    const uploadedVersions = [];

    for (const version of optimizedVersions) {
      const fileName = `${originalName.split('.')[0]}_${version.name}.${version.format}`;
      const filePath = `optimized/${Date.now()}/${fileName}`;

      const { data, error } = await supabase.storage
        .from('jewelry-images')
        .upload(filePath, version.blob);

      if (error) {
        console.error(`Failed to upload ${version.name}:`, error);
        continue;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('jewelry-images')
        .getPublicUrl(filePath);

      uploadedVersions.push({
        name: version.name,
        url: publicUrl,
        size: version.size,
        width: version.width,
        height: version.height,
        format: version.format,
        quality: version.quality,
        compressionRatio: version.compressionRatio
      });
    }

    return uploadedVersions;
  }

  private async uploadOriginal(file: File): Promise<string> {
    const filePath = `originals/${Date.now()}/${file.name}`;

    const { data, error } = await supabase.storage
      .from('jewelry-images')
      .upload(filePath, file);

    if (error) {
      throw new Error(`Failed to upload original: ${error.message}`);
    }

    const { data: { publicUrl } } = supabase.storage
      .from('jewelry-images')
      .getPublicUrl(filePath);

    return publicUrl;
  }

  private async extractMetadata(
    originalImageData: ImageData & { width: number; height: number },
    optimizedVersions: any[]
  ) {
    const totalOriginalSize = originalImageData.data.length;
    const totalOptimizedSize = optimizedVersions.reduce((sum, v) => sum + v.size, 0);
    const totalSizeReduction = ((totalOriginalSize - totalOptimizedSize) / totalOriginalSize) * 100;
    const averageCompressionRatio = optimizedVersions.reduce((sum, v) => sum + v.compressionRatio, 0) / optimizedVersions.length;

    // Extract dominant colors
    const dominantColors = this.extractDominantColors(originalImageData);

    return {
      totalSizeReduction,
      averageCompressionRatio,
      colorProfile: 'sRGB',
      hasTransparency: this.hasTransparency(originalImageData),
      dominantColors
    };
  }

  private extractDominantColors(imageData: ImageData): string[] {
    const pixels = imageData.data;
    const colorCounts: Record<string, number> = {};

    // Sample every 10th pixel for performance
    for (let i = 0; i < pixels.length; i += 40) {
      const r = Math.floor(pixels[i] / 32) * 32;
      const g = Math.floor(pixels[i + 1] / 32) * 32;
      const b = Math.floor(pixels[i + 2] / 32) * 32;
      const key = `rgb(${r},${g},${b})`;
      colorCounts[key] = (colorCounts[key] || 0) + 1;
    }

    return Object.entries(colorCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([color]) => color);
  }

  private hasTransparency(imageData: ImageData): boolean {
    const pixels = imageData.data;
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] < 255) {
        return true;
      }
    }
    return false;
  }
}

export const imageOptimizationPipeline = ImageOptimizationPipeline.getInstance();

