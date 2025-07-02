import { NextRequest, NextResponse } from 'next/server';
import { localImageProcessor } from '@/lib/localImageProcessing';
import { MockAIAnalyzer } from '@/lib/mockAIAnalysis';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    
    if (files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No files provided' },
        { status: 400 }
      );
    }

    // Validate files
    const validation = localImageProcessor.validateFiles(files);
    
    if (validation.invalid.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Some files are invalid',
        details: {
          valid: validation.valid.length,
          invalid: validation.invalid.map(item => ({
            filename: item.file.name,
            errors: item.errors
          })),
          warnings: validation.warnings.map(item => ({
            filename: item.file.name,
            warnings: item.warnings
          }))
        }
      }, { status: 400 });
    }

    // Process valid files
    const results = [];
    
    for (let i = 0; i < validation.valid.length; i++) {
      const file = validation.valid[i];
      
      try {
        // Process image (resize, optimize)
        const processedImage = await localImageProcessor.optimizeForWeb(file);
        
        // Generate AI analysis
        const analysis = MockAIAnalyzer.generateAnalysis(file.name, file.size);
        
        // Calculate processing time
        const processingTime = MockAIAnalyzer.calculateProcessingTime(file.size, 'standard');
        
        results.push({
          id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          filename: file.name,
          originalSize: file.size,
          processedSize: processedImage.optimized.size,
          savings: processedImage.savings,
          url: processedImage.optimized.url,
          analysis,
          processingTime,
          confidence: analysis.confidence
        });
        
      } catch (error) {
        console.error(`Error processing ${file.name}:`, error);
        results.push({
          filename: file.name,
          error: `Failed to process: ${error instanceof Error ? error.message : 'Unknown error'}`
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully processed ${results.filter(r => !r.error).length} of ${files.length} files`,
      results,
      summary: {
        totalFiles: files.length,
        processed: results.filter(r => !r.error).length,
        failed: results.filter(r => r.error).length,
        totalSavings: results
          .filter(r => !r.error && r.savings)
          .reduce((sum, r) => sum + r.savings, 0) / results.filter(r => !r.error).length || 0
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Upload failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Local image upload and processing API',
    status: 'ready',
    capabilities: [
      'File validation',
      'Image optimization',
      'Format conversion',
      'Mock AI analysis',
      'Batch processing'
    ]
  });
}

