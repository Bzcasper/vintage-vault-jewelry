'use client';

import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import AdvancedImageUploader from '@/components/upload/AdvancedImageUploader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, 
  TrendingUp, 
  Shield, 
  Truck, 
  Brain,
  Target,
  Eye,
  Search,
  DollarSign,
  CheckCircle,
  Star,
  Award
} from 'lucide-react';
import { useAuth } from '@/lib/auth';

const SellPage = () => {
  const { user } = useAuth();
  const [uploadResults, setUploadResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleUploadComplete = (results: any[]) => {
    setUploadResults(results);
    setShowResults(true);
  };

  const handleUploadError = (error: string) => {
    console.error('Upload error:', error);
    // Handle error display
  };

  const aiFeatures = [
    {
      icon: Target,
      title: 'YOLO Object Detection',
      description: 'Advanced computer vision to locate and isolate jewelry pieces in your images',
      color: 'text-blue-500'
    },
    {
      icon: Brain,
      title: 'Vision Transformer Classification',
      description: 'State-of-the-art AI for fine-grained material, style, and era identification',
      color: 'text-purple-500'
    },
    {
      icon: Search,
      title: 'Brand Recognition',
      description: 'Automatic detection of hallmarks, logos, and brand-specific features',
      color: 'text-green-500'
    },
    {
      icon: Eye,
      title: 'Condition Assessment',
      description: 'AI-powered analysis of wear patterns, defects, and authenticity indicators',
      color: 'text-orange-500'
    },
    {
      icon: DollarSign,
      title: 'Market Analysis',
      description: 'Real-time pricing recommendations based on comparable sales data',
      color: 'text-emerald-500'
    },
    {
      icon: Sparkles,
      title: 'SEO Optimization',
      description: 'Auto-generated titles, descriptions, and keywords for maximum visibility',
      color: 'text-pink-500'
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-soft-champagne to-white">
        <div className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-deep-charcoal mb-4">
              Sell Your Jewelry with AI
            </h1>
            <p className="text-xl text-warm-gray max-w-3xl mx-auto mb-8">
              Transform your jewelry photos into professional listings in seconds using our advanced AI technology. 
              YOLO detection, Vision Transformers, and market intelligence work together to maximize your sales.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <Brain className="h-4 w-4 mr-2" />
                AI-Powered Analysis
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <Target className="h-4 w-4 mr-2" />
                YOLO Detection
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <Sparkles className="h-4 w-4 mr-2" />
                Auto-Generated Listings
              </Badge>
            </div>
          </div>

          {/* AI Features Grid */}
          <div className="mb-12">
            <h2 className="text-3xl font-serif font-bold text-center mb-8">
              Cutting-Edge AI Technology
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {aiFeatures.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <feature.icon className={`h-8 w-8 ${feature.color}`} />
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Upload Section */}
          {!showResults ? (
            <div className="mb-12">
              <AdvancedImageUploader
                userId={user?.id || 'demo-user'}
                onUploadComplete={handleUploadComplete}
                onError={handleUploadError}
              />
            </div>
          ) : (
            /* Results Section */
            <div className="mb-12">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                    Processing Complete!
                  </CardTitle>
                  <CardDescription>
                    Your {uploadResults.length} jewelry items have been analyzed and optimized for listing.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {uploadResults.map((result, index) => (
                      <Card key={index} className="border-2 border-green-200">
                        <CardHeader>
                          <CardTitle className="text-lg truncate">
                            {result.listing?.title || `Item ${index + 1}`}
                          </CardTitle>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline">
                              {result.classification?.category || 'Jewelry'}
                            </Badge>
                            <Badge variant="outline" className="text-green-600">
                              ${result.market?.estimatedValue?.recommended || 'N/A'}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="font-medium">Condition:</span> {result.condition?.overall || 'Good'}
                            </div>
                            <div>
                              <span className="font-medium">Materials:</span> {
                                result.classification?.materials?.map((m: any) => m.material).join(', ') || 'Mixed'
                              }
                            </div>
                            <div>
                              <span className="font-medium">AI Confidence:</span> {
                                Math.round((result.processing?.confidence || 0.8) * 100)
                              }%
                            </div>
                            <div>
                              <span className="font-medium">SEO Score:</span> {
                                result.listing?.seoScore || 85
                              }/100
                            </div>
                          </div>
                          <Button className="w-full mt-4" size="sm">
                            Create Listing
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <div className="mt-6 text-center">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowResults(false)}
                      className="mr-4"
                    >
                      Upload More Items
                    </Button>
                    <Button>
                      Publish All Listings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Seller Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="text-center">
              <CardHeader>
                <Sparkles className="h-12 w-12 text-vintage-gold mx-auto mb-4" />
                <CardTitle>What You Get</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Professional product descriptions
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Market-based pricing recommendations
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    SEO-optimized titles and keywords
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Detailed care instructions
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Material and style identification
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-vintage-gold mx-auto mb-4" />
                <CardTitle>Commission Structure</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="text-2xl font-bold text-vintage-gold">8%</div>
                    <div className="text-sm text-gray-600">Standard Commission</div>
                    <div className="text-xs text-gray-500">On successful sales. No upfront fees or listing costs.</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-vintage-gold">5%</div>
                    <div className="text-sm text-gray-600">Premium Sellers</div>
                    <div className="text-xs text-gray-500">For sellers with 50+ successful sales and 4.8+ rating.</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Shield className="h-12 w-12 text-vintage-gold mx-auto mb-4" />
                <CardTitle>Authenticated</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-lg font-semibold">Every piece verified</div>
                  <div className="text-sm text-gray-600">
                    Our AI system checks for authenticity indicators and flags potential issues for manual review.
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Truck className="h-12 w-12 text-vintage-gold mx-auto mb-4" />
                <CardTitle>Free Shipping</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-lg font-semibold">On orders over $100</div>
                  <div className="text-sm text-gray-600">
                    We provide prepaid shipping labels and insurance for high-value items.
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Technical Specifications */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-6 w-6 text-vintage-gold" />
                Industry-Leading AI Technology
              </CardTitle>
              <CardDescription>
                Our hybrid YOLO + Vision Transformer approach delivers 94-98% accuracy in jewelry classification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-vintage-gold mb-2">0.3-0.7s</div>
                  <div className="text-sm text-gray-600">Processing time per image</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-vintage-gold mb-2">94-98%</div>
                  <div className="text-sm text-gray-600">Classification accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-vintage-gold mb-2">90-95%</div>
                  <div className="text-sm text-gray-600">Brand recognition accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-vintage-gold mb-2">$0.01-0.03</div>
                  <div className="text-sm text-gray-600">Cost per image analysis</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          {!user && (
            <Card className="text-center bg-gradient-to-r from-vintage-gold/10 to-soft-champagne">
              <CardContent className="py-12">
                <h3 className="text-2xl font-serif font-bold mb-4">Ready to Start Selling?</h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Join thousands of sellers who trust our AI-powered platform to maximize their jewelry sales. 
                  Sign up today and get your first 5 listings processed for free!
                </p>
                <div className="space-x-4">
                  <Button size="lg" className="px-8">
                    Sign Up to Sell
                  </Button>
                  <Button variant="outline" size="lg" className="px-8">
                    Learn More
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SellPage;

