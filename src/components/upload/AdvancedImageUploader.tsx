'use client';

import React, { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, 
  Image as ImageIcon, 
  Folder, 
  Zap, 
  Brain, 
  Eye, 
  TrendingUp, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  Sparkles,
  Target,
  Search,
  DollarSign
} from 'lucide-react';

interface ProcessingPipeline {
  stage: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  result?: any;
  error?: string;
  startTime?: number;
  endTime?: number;
}

interface UploadJob {
  id: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  totalFiles: number;
  processedFiles: number;
  results: any[];
  pipeline: ProcessingPipeline[];
  error?: string;
  processingMode: string;
  estimatedCompletion: Date;
  createdAt: Date;
}

interface AdvancedImageUploaderProps {
  userId: string;
  onUploadComplete?: (results: any[]) => void;
  onError?: (error: string) => void;
}

const AdvancedImageUploader: React.FC<AdvancedImageUploaderProps> = ({
  userId,
  onUploadComplete,
  onError
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [currentJob, setCurrentJob] = useState<UploadJob | null>(null);
  const [processingMode, setProcessingMode] = useState<'standard' | 'advanced' | 'premium'>('advanced');
  const [uploadOptions, setUploadOptions] = useState({
    includeMarketAnalysis: true,
    includeBrandRecognition: true,
    includeConditionAssessment: true,
    generateSEOContent: true,
    batchProcessing: true
  });
  const [validationResults, setValidationResults] = useState<any>(null);
  const [realTimeUpdates, setRealTimeUpdates] = useState<any[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // File selection handlers
  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    setFiles(prev => [...prev, ...selectedFiles]);
    validateFiles([...files, ...selectedFiles]);
  }, [files]);

  const handleFolderSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    setFiles(prev => [...prev, ...selectedFiles]);
    validateFiles([...files, ...selectedFiles]);
  }, [files]);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    setFiles(prev => [...prev, ...droppedFiles]);
    validateFiles([...files, ...droppedFiles]);
  }, [files]);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
  }, []);

  // File validation
  const validateFiles = async (filesToValidate: File[]) => {
    if (filesToValidate.length === 0) {
      setValidationResults(null);
      return;
    }

    try {
      const formData = new FormData();
      filesToValidate.forEach(file => formData.append('files', file));
      formData.append('userId', userId);
      formData.append('processingMode', processingMode);

      const response = await fetch('/api/upload/validate', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      setValidationResults(result);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  // Upload and process files
  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setCurrentJob(null);
    setRealTimeUpdates([]);

    try {
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));
      formData.append('userId', userId);
      formData.append('processingMode', processingMode);
      formData.append('options', JSON.stringify(uploadOptions));

      const response = await fetch('/api/upload/advanced', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const result = await response.json();
      
      // Start polling for job status
      startJobPolling(result.jobId);

    } catch (error) {
      console.error('Upload failed:', error);
      onError?.(error instanceof Error ? error.message : 'Upload failed');
      setUploading(false);
    }
  };

  // Job status polling
  const startJobPolling = (jobId: string) => {
    const pollJob = async () => {
      try {
        const response = await fetch(`/api/upload/advanced?jobId=${jobId}&userId=${userId}`);
        if (!response.ok) return;

        const result = await response.json();
        const job = result.job;
        
        setCurrentJob(job);
        
        if (job.status === 'completed') {
          setUploading(false);
          onUploadComplete?.(job.results);
          if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current);
          }
        } else if (job.status === 'failed') {
          setUploading(false);
          onError?.(job.error || 'Processing failed');
          if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current);
          }
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    };

    pollIntervalRef.current = setInterval(pollJob, 2000);
    pollJob(); // Initial call
  };

  // Remove file
  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    validateFiles(newFiles);
  };

  // Clear all files
  const clearFiles = () => {
    setFiles([]);
    setValidationResults(null);
  };

  // Get processing mode features
  const getModeFeatures = (mode: string) => {
    const features = {
      standard: ['Basic AI Analysis', 'Category Detection', 'Price Estimation'],
      advanced: ['YOLO Detection', 'Vision Transformer', 'Brand Recognition', 'Market Analysis', 'SEO Optimization'],
      premium: ['All Advanced Features', 'High-Res Processing', 'Authenticity Verification', 'Premium Support', 'Priority Processing']
    };
    return features[mode as keyof typeof features] || [];
  };

  // Pipeline stage icons
  const getStageIcon = (stage: string) => {
    const icons: Record<string, any> = {
      'Image Preprocessing': ImageIcon,
      'YOLO Detection': Target,
      'Vision Transformer Classification': Brain,
      'Condition Assessment': Eye,
      'Brand Recognition': Search,
      'Market Analysis': TrendingUp,
      'Listing Generation': Sparkles,
      'Quality Validation': CheckCircle
    };
    return icons[stage] || Clock;
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Processing Mode Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-vintage-gold" />
            AI Processing Mode
          </CardTitle>
          <CardDescription>
            Choose your processing level for optimal results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={processingMode} onValueChange={(value: any) => setProcessingMode(value)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="standard">Standard</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
              <TabsTrigger value="premium">Premium</TabsTrigger>
            </TabsList>
            
            {['standard', 'advanced', 'premium'].map(mode => (
              <TabsContent key={mode} value={mode} className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">{mode.charAt(0).toUpperCase() + mode.slice(1)} Features</h4>
                    <ul className="space-y-1">
                      {getModeFeatures(mode).map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="font-medium">Processing Time:</span> {
                        mode === 'premium' ? '60-90s' : mode === 'advanced' ? '30-60s' : '15-30s'
                      } per image
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Max Files:</span> {
                        mode === 'premium' ? '100' : mode === 'advanced' ? '50' : '20'
                      }
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Max Size:</span> {
                        mode === 'premium' ? '50MB' : mode === 'advanced' ? '20MB' : '10MB'
                      } per file
                    </div>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Jewelry Images</CardTitle>
          <CardDescription>
            Drag and drop images, select files, or choose an entire folder
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-vintage-gold transition-colors"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <div className="space-y-4">
              <div className="flex justify-center">
                <Upload className="h-12 w-12 text-gray-400" />
              </div>
              <div>
                <p className="text-lg font-medium">Drop your jewelry images here</p>
                <p className="text-sm text-gray-500">or choose from the options below</p>
              </div>
              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2"
                >
                  <ImageIcon className="h-4 w-4" />
                  Select Images
                </Button>
                <Button
                  variant="outline"
                  onClick={() => folderInputRef.current?.click()}
                  className="flex items-center gap-2"
                >
                  <Folder className="h-4 w-4" />
                  Select Folder
                </Button>
              </div>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <input
            ref={folderInputRef}
            type="file"
            multiple
            webkitdirectory=""
            onChange={handleFolderSelect}
            className="hidden"
          />

          {/* File List */}
          {files.length > 0 && (
            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium">Selected Files ({files.length})</h4>
                <Button variant="outline" size="sm" onClick={clearFiles}>
                  Clear All
                </Button>
              </div>
              <div className="max-h-40 overflow-y-auto space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      <span className="text-sm truncate">{file.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {(file.size / 1024 / 1024).toFixed(1)}MB
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Validation Results */}
          {validationResults && (
            <div className="mt-6 space-y-4">
              {validationResults.errors?.length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-1">
                      {validationResults.errors.map((error: string, index: number) => (
                        <div key={index}>{error}</div>
                      ))}
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {validationResults.warnings?.length > 0 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-1">
                      {validationResults.warnings.map((warning: string, index: number) => (
                        <div key={index}>{warning}</div>
                      ))}
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {validationResults.recommendations?.length > 0 && (
                <Alert>
                  <Sparkles className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-1">
                      {validationResults.recommendations.map((rec: string, index: number) => (
                        <div key={index}>{rec}</div>
                      ))}
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Upload Button */}
          <div className="mt-6">
            <Button
              onClick={handleUpload}
              disabled={files.length === 0 || uploading || (validationResults && !validationResults.valid)}
              className="w-full"
              size="lg"
            >
              {uploading ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Processing with AI...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Start AI Analysis ({files.length} files)
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Processing Status */}
      {currentJob && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-vintage-gold" />
              AI Processing Status
            </CardTitle>
            <CardDescription>
              Job ID: {currentJob.id} • Mode: {currentJob.processingMode}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Overall Progress */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm text-gray-500">
                  {currentJob.processedFiles} / {currentJob.totalFiles} files
                </span>
              </div>
              <Progress value={currentJob.progress} className="h-2" />
              <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                <span>Status: {currentJob.status}</span>
                <span>
                  {currentJob.status === 'processing' && 
                    `ETA: ${new Date(currentJob.estimatedCompletion).toLocaleTimeString()}`
                  }
                </span>
              </div>
            </div>

            {/* Pipeline Stages */}
            {currentJob.pipeline && currentJob.pipeline.length > 0 && (
              <div>
                <h4 className="font-medium mb-4">Processing Pipeline</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {currentJob.pipeline.map((stage, index) => {
                    const StageIcon = getStageIcon(stage.stage);
                    return (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <StageIcon className={`h-4 w-4 ${
                            stage.status === 'completed' ? 'text-green-500' :
                            stage.status === 'processing' ? 'text-blue-500' :
                            stage.status === 'failed' ? 'text-red-500' :
                            'text-gray-400'
                          }`} />
                          <span className="text-sm font-medium">{stage.stage}</span>
                        </div>
                        <Progress value={stage.progress} className="h-1 mb-2" />
                        <div className="text-xs text-gray-500 capitalize">
                          {stage.status}
                          {stage.endTime && stage.startTime && (
                            <span className="ml-2">
                              ({((stage.endTime - stage.startTime) / 1000).toFixed(1)}s)
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Results Preview */}
            {currentJob.results && currentJob.results.length > 0 && (
              <div>
                <h4 className="font-medium mb-4">Results Preview</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentJob.results.slice(0, 6).map((result, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="space-y-2">
                        <div className="font-medium text-sm truncate">
                          {result.listing?.title || result.filename}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {result.classification?.category || 'Unknown'}
                          </Badge>
                          {result.market?.estimatedValue?.recommended && (
                            <Badge variant="outline" className="text-xs">
                              ${result.market.estimatedValue.recommended}
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          Confidence: {Math.round((result.processing?.confidence || 0) * 100)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {currentJob.results.length > 6 && (
                  <div className="text-center mt-4">
                    <span className="text-sm text-gray-500">
                      +{currentJob.results.length - 6} more results
                    </span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdvancedImageUploader;

