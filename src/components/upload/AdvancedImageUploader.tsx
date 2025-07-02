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
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Processing Mode Selection */}
      <Card className="premium-card animate-fade-in-up">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-3 text-2xl font-serif">
                <div className="h-12 w-12 bg-vintage-gold/10 rounded-xl flex items-center justify-center">
                  <Zap className="h-6 w-6 text-vintage-gold" />
                </div>
                AI Processing Mode
              </CardTitle>
              <CardDescription className="text-lg mt-2">
                Choose your processing level for optimal jewelry analysis results
              </CardDescription>
            </div>
            <Badge className="bg-vintage-gold/10 text-vintage-gold border-vintage-gold/20">
              Professional AI
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={processingMode} onValueChange={(value: any) => setProcessingMode(value)}>
            <TabsList className="grid w-full grid-cols-3 h-14 bg-soft-champagne/50">
              <TabsTrigger value="standard" className="text-base py-3">Standard</TabsTrigger>
              <TabsTrigger value="advanced" className="text-base py-3">Advanced</TabsTrigger>
              <TabsTrigger value="premium" className="text-base py-3">Premium</TabsTrigger>
            </TabsList>
            
            {['standard', 'advanced', 'premium'].map((mode, modeIndex) => (
              <TabsContent key={mode} value={mode} className="mt-6 animate-fade-in-up" style={{ animationDelay: `${modeIndex * 0.1}s` }}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <h4 className="font-serif font-semibold text-lg mb-4 text-deep-charcoal">
                      {mode.charAt(0).toUpperCase() + mode.slice(1)} Features
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {getModeFeatures(mode).map((feature, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-vintage-gold/5 rounded-lg animate-scale-in" style={{ animationDelay: `${index * 0.05}s` }}>
                          <CheckCircle className="h-5 w-5 text-vintage-gold flex-shrink-0" />
                          <span className="text-sm font-medium text-deep-charcoal">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-soft-champagne/30 rounded-lg p-4 space-y-3">
                      <h5 className="font-semibold text-deep-charcoal">Specifications</h5>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-warm-gray">Processing Time:</span>
                          <Badge variant="outline" className="text-vintage-gold border-vintage-gold/30">
                            {mode === 'premium' ? '60-90s' : mode === 'advanced' ? '30-60s' : '15-30s'}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-warm-gray">Max Files:</span>
                          <Badge variant="outline" className="text-vintage-gold border-vintage-gold/30">
                            {mode === 'premium' ? '100' : mode === 'advanced' ? '50' : '20'}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-warm-gray">Max Size:</span>
                          <Badge variant="outline" className="text-vintage-gold border-vintage-gold/30">
                            {mode === 'premium' ? '50MB' : mode === 'advanced' ? '20MB' : '10MB'}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-warm-gray">Accuracy:</span>
                          <Badge className="bg-vintage-gold text-white">
                            {mode === 'premium' ? '98%' : mode === 'advanced' ? '95%' : '90%'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Enhanced Upload Area */}
      <Card className="premium-card animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-3 text-2xl font-serif">
                <div className="h-12 w-12 bg-vintage-gold/10 rounded-xl flex items-center justify-center">
                  <Upload className="h-6 w-6 text-vintage-gold" />
                </div>
                Upload Jewelry Images
              </CardTitle>
              <CardDescription className="text-lg mt-2">
                Drag and drop images, select files, or choose an entire folder for AI analysis
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-deep-charcoal">{files.length} files selected</div>
              <div className="text-xs text-warm-gray">Mode: {processingMode}</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div
            className="border-2 border-dashed border-vintage-gold/30 rounded-xl p-12 text-center hover:border-vintage-gold hover:bg-vintage-gold/5 transition-all duration-300 animate-shimmer group"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="h-20 w-20 bg-vintage-gold/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Upload className="h-10 w-10 text-vintage-gold group-hover:animate-bounce" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-serif font-semibold text-deep-charcoal mb-2">
                  Drop your jewelry images here
                </h3>
                <p className="text-lg text-warm-gray mb-4">
                  or choose from the professional upload options below
                </p>
                <div className="text-sm text-warm-gray">
                  Supports JPEG, PNG, WebP • AI-powered analysis • Professional results
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-6">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-3 px-8 py-4 text-lg group hover:bg-vintage-gold/10 hover:border-vintage-gold transition-all"
                >
                  <ImageIcon className="h-6 w-6 group-hover:scale-110 transition-transform" />
                  Select Images
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => folderInputRef.current?.click()}
                  className="flex items-center gap-3 px-8 py-4 text-lg group hover:bg-vintage-gold/10 hover:border-vintage-gold transition-all"
                >
                  <Folder className="h-6 w-6 group-hover:scale-110 transition-transform" />
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

          {/* Enhanced File List */}
          {files.length > 0 && (
            <div className="mt-8 animate-fade-in-up">
              <div className="flex justify-between items-center mb-6">
                <h4 className="font-serif font-semibold text-lg text-deep-charcoal">
                  Selected Files ({files.length})
                </h4>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm" onClick={clearFiles} className="hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors">
                    Clear All
                  </Button>
                  <Badge variant="outline" className="text-vintage-gold border-vintage-gold/30">
                    {(files.reduce((total, file) => total + file.size, 0) / 1024 / 1024).toFixed(1)}MB total
                  </Badge>
                </div>
              </div>
              <div className="max-h-64 overflow-y-auto space-y-3 pr-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-soft-champagne/20 rounded-lg border border-vintage-gold/10 hover:border-vintage-gold/30 transition-colors group animate-scale-in" style={{ animationDelay: `${index * 0.05}s` }}>
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="h-10 w-10 bg-vintage-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <ImageIcon className="h-5 w-5 text-vintage-gold" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-deep-charcoal truncate">{file.name}</div>
                        <div className="text-sm text-warm-gray">
                          {(file.size / 1024 / 1024).toFixed(1)}MB • {file.type}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge variant="secondary" className="text-xs bg-vintage-gold/10 text-vintage-gold">
                          Ready
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-600 transition-all"
                        >
                          ×
                        </Button>
                      </div>
                    </div>
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

          {/* Enhanced Upload Button */}
          <div className="mt-8">
            <div className="bg-vintage-gold/5 rounded-xl p-6 border border-vintage-gold/20">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-serif font-semibold text-lg text-deep-charcoal">Ready to Process</h4>
                  <p className="text-warm-gray">Start professional AI analysis of your jewelry images</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-vintage-gold">{files.length}</div>
                  <div className="text-sm text-warm-gray">files ready</div>
                </div>
              </div>
              
              <Button
                onClick={handleUpload}
                disabled={files.length === 0 || uploading || (validationResults && !validationResults.valid)}
                className="w-full h-14 text-lg font-semibold btn-primary group"
                size="lg"
              >
                {uploading ? (
                  <>
                    <Clock className="h-6 w-6 mr-3 animate-spin" />
                    Processing with AI Pipeline...
                  </>
                ) : (
                  <>
                    <Brain className="h-6 w-6 mr-3 group-hover:animate-pulse" />
                    Start Professional AI Analysis ({files.length} files)
                    <Sparkles className="h-5 w-5 ml-3 group-hover:animate-bounce" />
                  </>
                )}
              </Button>
              
              {files.length > 0 && !uploading && (
                <div className="mt-4 grid grid-cols-3 gap-4 text-center text-sm">
                  <div>
                    <div className="font-medium text-deep-charcoal">Estimated Time</div>
                    <div className="text-vintage-gold">
                      {Math.ceil(files.length * (processingMode === 'premium' ? 75 : processingMode === 'advanced' ? 45 : 22.5) / 60)} min
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-deep-charcoal">Processing Mode</div>
                    <div className="text-vintage-gold capitalize">{processingMode}</div>
                  </div>
                  <div>
                    <div className="font-medium text-deep-charcoal">Expected Accuracy</div>
                    <div className="text-vintage-gold">
                      {processingMode === 'premium' ? '98%' : processingMode === 'advanced' ? '95%' : '90%'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Processing Status */}
      {currentJob && (
        <Card className="premium-card animate-fade-in-up border-vintage-gold/20">
          <CardHeader className="bg-vintage-gold/5 border-b border-vintage-gold/20">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-3 text-2xl font-serif">
                  <div className="h-12 w-12 bg-vintage-gold/20 rounded-xl flex items-center justify-center">
                    <Brain className="h-6 w-6 text-vintage-gold animate-pulse" />
                  </div>
                  AI Processing Pipeline
                </CardTitle>
                <CardDescription className="text-lg mt-2">
                  Job ID: {currentJob.id} • Mode: <span className="capitalize font-medium text-vintage-gold">{currentJob.processingMode}</span>
                </CardDescription>
              </div>
              <div className="text-right">
                <Badge className={`${
                  currentJob.status === 'completed' ? 'bg-green-500' :
                  currentJob.status === 'processing' ? 'bg-blue-500 animate-pulse' :
                  currentJob.status === 'failed' ? 'bg-red-500' :
                  'bg-gray-500'
                } text-white capitalize`}>
                  {currentJob.status}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-8 p-8">
            {/* Enhanced Overall Progress */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-serif font-semibold text-lg text-deep-charcoal">Overall Progress</h4>
                  <p className="text-warm-gray">Processing {currentJob.totalFiles} jewelry images</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-vintage-gold">
                    {Math.round(currentJob.progress)}%
                  </div>
                  <div className="text-sm text-warm-gray">
                    {currentJob.processedFiles} / {currentJob.totalFiles} files
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <Progress value={currentJob.progress} className="h-4 bg-vintage-gold/10" />
                <div className="absolute inset-0 bg-gradient-to-r from-vintage-gold/20 via-vintage-gold/40 to-vintage-gold/20 rounded-full opacity-50 animate-shimmer" />
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-vintage-gold" />
                  <span className="text-warm-gray">
                    Started: {new Date(currentJob.createdAt).toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-vintage-gold">
                  {currentJob.status === 'processing' && (
                    <>
                      <TrendingUp className="h-4 w-4" />
                      <span>ETA: {new Date(currentJob.estimatedCompletion).toLocaleTimeString()}</span>
                    </>
                  )}
                  {currentJob.status === 'completed' && (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-green-600">Completed Successfully</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Enhanced Pipeline Stages */}
            {currentJob.pipeline && currentJob.pipeline.length > 0 && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-serif font-semibold text-lg text-deep-charcoal mb-2">AI Processing Pipeline</h4>
                  <p className="text-warm-gray">Advanced multi-stage analysis for comprehensive jewelry evaluation</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {currentJob.pipeline.map((stage, index) => {
                    const StageIcon = getStageIcon(stage.stage);
                    return (
                      <div key={index} className={`premium-card border-2 p-4 transition-all duration-300 ${
                        stage.status === 'completed' ? 'border-green-500/30 bg-green-50/50' :
                        stage.status === 'processing' ? 'border-vintage-gold/50 bg-vintage-gold/5 animate-pulse' :
                        stage.status === 'failed' ? 'border-red-500/30 bg-red-50/50' :
                        'border-gray-200'
                      }`}>
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                            stage.status === 'completed' ? 'bg-green-100' :
                            stage.status === 'processing' ? 'bg-vintage-gold/10' :
                            stage.status === 'failed' ? 'bg-red-100' :
                            'bg-gray-100'
                          }`}>
                            <StageIcon className={`h-5 w-5 ${
                              stage.status === 'completed' ? 'text-green-600' :
                              stage.status === 'processing' ? 'text-vintage-gold' :
                              stage.status === 'failed' ? 'text-red-600' :
                              'text-gray-400'
                            }`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-deep-charcoal truncate">
                              {stage.stage}
                            </div>
                            <div className={`text-xs capitalize ${
                              stage.status === 'completed' ? 'text-green-600' :
                              stage.status === 'processing' ? 'text-vintage-gold' :
                              stage.status === 'failed' ? 'text-red-600' :
                              'text-gray-500'
                            }`}>
                              {stage.status}
                            </div>
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <Progress value={stage.progress} className="h-2" />
                        </div>
                        
                        <div className="flex justify-between items-center text-xs text-warm-gray">
                          <span>{Math.round(stage.progress)}%</span>
                          {stage.endTime && stage.startTime && (
                            <span>
                              {((stage.endTime - stage.startTime) / 1000).toFixed(1)}s
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Enhanced Results Preview */}
            {currentJob.results && currentJob.results.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-serif font-semibold text-lg text-deep-charcoal">Processing Results</h4>
                    <p className="text-warm-gray">AI-generated listings and analysis results</p>
                  </div>
                  <Badge className="bg-green-100 text-green-700 border-green-200">
                    {currentJob.results.length} listings generated
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentJob.results.slice(0, 6).map((result, index) => (
                    <div key={index} className="premium-card p-6 animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h5 className="font-semibold text-deep-charcoal truncate">
                              {result.listing?.title || result.filename}
                            </h5>
                            <p className="text-sm text-warm-gray mt-1">
                              {result.filename || 'Processed jewelry image'}
                            </p>
                          </div>
                          <div className="h-10 w-10 bg-vintage-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Gem className="h-5 w-5 text-vintage-gold" />
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary" className="text-xs bg-vintage-gold/10 text-vintage-gold">
                            {result.classification?.category || 'Jewelry'}
                          </Badge>
                          {result.market?.estimatedValue?.recommended && (
                            <Badge variant="outline" className="text-xs border-green-200 text-green-700">
                              ${result.market.estimatedValue.recommended}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-warm-gray">AI Confidence:</span>
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-vintage-gold h-2 rounded-full transition-all duration-500" 
                                  style={{ width: `${(result.processing?.confidence || 0) * 100}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium text-vintage-gold">
                                {Math.round((result.processing?.confidence || 0) * 100)}%
                              </span>
                            </div>
                          </div>
                          
                          {result.listing?.seoScore && (
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-warm-gray">SEO Score:</span>
                              <Badge variant="outline" className="text-xs text-blue-600 border-blue-200">
                                {result.listing.seoScore}/100
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {currentJob.results.length > 6 && (
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-vintage-gold/10 rounded-lg">
                      <Sparkles className="h-4 w-4 text-vintage-gold" />
                      <span className="text-sm font-medium text-vintage-gold">
                        +{currentJob.results.length - 6} more results generated
                      </span>
                    </div>
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

