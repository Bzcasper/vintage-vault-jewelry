'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  imageProcessor, 
  ProcessedImage, 
  UploadProgress,
  JewelryAnalysis 
} from '@/lib/imageProcessing';
import { 
  Upload, 
  Image as ImageIcon, 
  FileImage, 
  FolderOpen, 
  X, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Eye,
  Edit,
  Save,
  Gem,
  Crown,
  Sparkles
} from 'lucide-react';

interface ImageUploaderProps {
  onImagesProcessed?: (images: ProcessedImage[]) => void;
  maxFiles?: number;
}

const ImageUploader = ({ onImagesProcessed, maxFiles = 20 }: ImageUploaderProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [processedImages, setProcessedImages] = useState<ProcessedImage[]>([]);
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [selectedImage, setSelectedImage] = useState<ProcessedImage | null>(null);
  const [editingAnalysis, setEditingAnalysis] = useState<JewelryAnalysis | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  }, []);

  const handleFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter(file => 
      imageProcessor.validateImageFile(file)
    ).slice(0, maxFiles - files.length);

    setFiles(prev => [...prev, ...validFiles]);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const processImages = async () => {
    if (files.length === 0) return;

    try {
      const results = await imageProcessor.processImages(files, setProgress);
      setProcessedImages(results);
      onImagesProcessed?.(results);
      setFiles([]); // Clear files after processing
    } catch (error) {
      console.error('Error processing images:', error);
      setProgress({
        total: files.length,
        processed: 0,
        status: 'error',
        error: 'Failed to process images'
      });
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'vintage':
        return Crown;
      case 'designer':
        return Gem;
      case 'costume':
        return Sparkles;
      default:
        return Gem;
    }
  };

  const saveEditedAnalysis = () => {
    if (!selectedImage || !editingAnalysis) return;

    setProcessedImages(prev => 
      prev.map(img => 
        img.id === selectedImage.id 
          ? { ...img, analysis: editingAnalysis }
          : img
      )
    );

    setEditingAnalysis(null);
    setSelectedImage(null);
  };

  const ImagePreview = ({ image }: { image: ProcessedImage }) => {
    const CategoryIcon = getCategoryIcon(image.analysis.category);

    return (
      <Card className="overflow-hidden">
        <div className="relative">
          <img
            src={image.processedUrl}
            alt={image.analysis.title}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-2 right-2 flex space-x-1">
            <Button
              size="sm"
              variant="secondary"
              className="h-8 w-8 p-0"
              onClick={() => setSelectedImage(image)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="h-8 w-8 p-0"
              onClick={() => {
                setSelectedImage(image);
                setEditingAnalysis(image.analysis);
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
          <div className="absolute bottom-2 left-2">
            <Badge variant="secondary" className="flex items-center space-x-1">
              <CategoryIcon className="h-3 w-3" />
              <span className="capitalize">{image.analysis.category}</span>
            </Badge>
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-medium text-sm mb-2 line-clamp-2">
            {image.analysis.title}
          </h3>
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-vintage-gold">
              ${image.analysis.estimatedPrice}
            </span>
            <Badge variant="outline" className="text-xs">
              {image.analysis.condition}
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Upload Jewelry Images</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Drag and Drop Zone */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-vintage-gold bg-vintage-gold/5' 
                : 'border-gray-300 hover:border-vintage-gold/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="h-16 w-16 bg-vintage-gold/10 rounded-full flex items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-vintage-gold" />
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-deep-charcoal mb-2">
                  Drop your jewelry images here
                </h3>
                <p className="text-warm-gray mb-4">
                  Upload single images, zip files, or select multiple files
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center space-x-2"
                >
                  <FileImage className="h-4 w-4" />
                  <span>Select Images</span>
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => folderInputRef.current?.click()}
                  className="flex items-center space-x-2"
                >
                  <FolderOpen className="h-4 w-4" />
                  <span>Select Folder</span>
                </Button>
              </div>

              <p className="text-xs text-warm-gray">
                Supports JPEG, PNG, WebP • Max 10MB per file • Up to {maxFiles} files
              </p>
            </div>
          </div>

          {/* Hidden File Inputs */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.zip"
            onChange={handleFileInput}
            className="hidden"
          />
          <input
            ref={folderInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
          />

          {/* Selected Files */}
          {files.length > 0 && (
            <div className="mt-6">
              <h4 className="font-medium mb-3">Selected Files ({files.length})</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center space-x-2">
                      <FileImage className="h-4 w-4 text-gray-500" />
                      <span className="text-sm truncate">{file.name}</span>
                      <span className="text-xs text-gray-500">
                        ({(file.size / 1024 / 1024).toFixed(1)}MB)
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeFile(index)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
              
              <Button
                onClick={processImages}
                disabled={progress?.status === 'processing'}
                className="w-full mt-4 btn-primary"
              >
                {progress?.status === 'processing' ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing Images...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Process {files.length} Image{files.length !== 1 ? 's' : ''}
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Progress */}
          {progress && (
            <div className="mt-6 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  {progress.status === 'complete' ? 'Complete!' : 'Processing...'}
                </span>
                <span className="text-sm text-gray-500">
                  {progress.processed} / {progress.total}
                </span>
              </div>
              
              <Progress 
                value={(progress.processed / progress.total) * 100} 
                className="w-full"
              />
              
              {progress.current && (
                <p className="text-xs text-gray-500">
                  Current: {progress.current}
                </p>
              )}
              
              {progress.error && (
                <div className="flex items-center space-x-2 text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{progress.error}</span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Processed Images */}
      {processedImages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Processed Listings ({processedImages.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {processedImages.map((image) => (
                <ImagePreview key={image.id} image={image} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Image Detail Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  {editingAnalysis ? 'Edit Listing' : 'Listing Details'}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedImage(null);
                    setEditingAnalysis(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Image */}
                <div>
                  <img
                    src={selectedImage.processedUrl}
                    alt={selectedImage.analysis.title}
                    className="w-full rounded-lg"
                  />
                </div>

                {/* Details */}
                <div className="space-y-4">
                  {editingAnalysis ? (
                    // Edit Mode
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <input
                          type="text"
                          value={editingAnalysis.title}
                          onChange={(e) => setEditingAnalysis({
                            ...editingAnalysis,
                            title: e.target.value
                          })}
                          className="w-full px-3 py-2 border rounded-md"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Price</label>
                        <input
                          type="number"
                          value={editingAnalysis.estimatedPrice}
                          onChange={(e) => setEditingAnalysis({
                            ...editingAnalysis,
                            estimatedPrice: Number(e.target.value)
                          })}
                          className="w-full px-3 py-2 border rounded-md"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea
                          value={editingAnalysis.description}
                          onChange={(e) => setEditingAnalysis({
                            ...editingAnalysis,
                            description: e.target.value
                          })}
                          rows={4}
                          className="w-full px-3 py-2 border rounded-md"
                        />
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button onClick={saveEditedAnalysis} className="btn-primary">
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setEditingAnalysis(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold">{selectedImage.analysis.title}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="capitalize">
                            {selectedImage.analysis.category}
                          </Badge>
                          {selectedImage.analysis.era && (
                            <Badge variant="secondary">{selectedImage.analysis.era}</Badge>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-2xl font-bold text-vintage-gold">
                          ${selectedImage.analysis.estimatedPrice}
                        </span>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Description</h4>
                        <p className="text-gray-600">{selectedImage.analysis.description}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Specifications</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>Condition: {selectedImage.analysis.condition}</div>
                          <div>Type: {selectedImage.analysis.specifications.type}</div>
                          {selectedImage.analysis.specifications.metalType && (
                            <div>Metal: {selectedImage.analysis.specifications.metalType}</div>
                          )}
                          {selectedImage.analysis.brand && (
                            <div>Brand: {selectedImage.analysis.brand}</div>
                          )}
                        </div>
                      </div>
                      
                      <Button 
                        onClick={() => setEditingAnalysis(selectedImage.analysis)}
                        variant="outline"
                        className="w-full"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Listing
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;

