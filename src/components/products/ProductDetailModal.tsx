'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Product } from '@/lib/products';
import { 
  Heart, 
  ShoppingCart, 
  Star,
  Gem,
  Crown,
  Sparkles,
  Share2,
  Ruler,
  Weight,
  Calendar,
  Award,
  Shield,
  Truck,
  RotateCcw
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: (product: Product) => void;
  onToggleWishlist?: (product: Product) => void;
  isInWishlist?: boolean;
}

const ProductDetailModal = ({ 
  product, 
  isOpen, 
  onClose, 
  onAddToCart, 
  onToggleWishlist,
  isInWishlist = false 
}: ProductDetailModalProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedTab, setSelectedTab] = useState<'details' | 'care' | 'seller'>('details');

  if (!product) return null;

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

  const CategoryIcon = getCategoryIcon(product.category);

  const discountPercentage = product.original_price 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent':
        return 'bg-green-100 text-green-800';
      case 'very_good':
        return 'bg-blue-100 text-blue-800';
      case 'good':
        return 'bg-yellow-100 text-yellow-800';
      case 'fair':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const tabs = [
    { id: 'details', label: 'Details', icon: Gem },
    { id: 'care', label: 'Care', icon: Shield },
    { id: 'seller', label: 'Seller', icon: Award },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">Product Details</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-gradient-to-br from-soft-champagne to-vintage-gold/10 rounded-lg overflow-hidden relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <CategoryIcon className="h-24 w-24 text-vintage-gold/30" />
              </div>
              <div className="absolute inset-4 bg-white/80 rounded-lg flex items-center justify-center">
                <span className="text-sm text-warm-gray text-center px-4">
                  {product.title}
                </span>
              </div>
              
              {/* Image Navigation */}
              {product.images.length > 1 && (
                <>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 rounded-full"
                    onClick={() => setCurrentImageIndex((prev) => 
                      prev === 0 ? product.images.length - 1 : prev - 1
                    )}
                  >
                    ‹
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 rounded-full"
                    onClick={() => setCurrentImageIndex((prev) => 
                      (prev + 1) % product.images.length
                    )}
                  >
                    ›
                  </Button>
                </>
              )}
            </div>
            
            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((_, index) => (
                  <button
                    key={index}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg border-2 transition-colors ${
                      index === currentImageIndex 
                        ? 'border-vintage-gold' 
                        : 'border-gray-200 hover:border-vintage-gold/50'
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <div className="w-full h-full bg-gradient-to-br from-soft-champagne to-vintage-gold/10 rounded-md flex items-center justify-center">
                      <CategoryIcon className="h-6 w-6 text-vintage-gold/50" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Product Information */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="capitalize">
                  {product.category}
                </Badge>
                {product.is_featured && (
                  <Badge className="bg-vintage-gold text-white">Featured</Badge>
                )}
                <Badge className={getConditionColor(product.condition)}>
                  {product.condition.replace('_', ' ')}
                </Badge>
              </div>
              
              <h1 className="text-2xl font-serif font-bold text-deep-charcoal mb-2">
                {product.title}
              </h1>
              
              {product.brand && (
                <p className="text-warm-gray mb-2">by {product.brand}</p>
              )}
              
              {/* Rating */}
              {product.rating && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating!) 
                            ? 'text-vintage-gold fill-current' 
                            : 'text-gray-300'
                        }`} 
                      />
                    ))}
                  </div>
                  <span className="text-sm text-warm-gray">
                    {product.rating} ({product.reviews_count} reviews)
                  </span>
                </div>
              )}
            </div>
            
            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-deep-charcoal">
                ${product.price}
              </span>
              {product.original_price && (
                <>
                  <span className="text-xl text-warm-gray line-through">
                    ${product.original_price}
                  </span>
                  <Badge variant="destructive">
                    Save {discountPercentage}%
                  </Badge>
                </>
              )}
            </div>
            
            {/* Actions */}
            <div className="flex gap-3">
              <Button 
                className="btn-primary flex-1"
                onClick={() => onAddToCart?.(product)}
                disabled={product.is_sold}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {product.is_sold ? 'Sold Out' : 'Add to Cart'}
              </Button>
              <Button 
                variant="outline"
                onClick={() => onToggleWishlist?.(product)}
              >
                <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-current text-red-500' : ''}`} />
              </Button>
              <Button variant="outline">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 py-4 border-y">
              <div className="text-center">
                <Shield className="h-6 w-6 text-vintage-gold mx-auto mb-1" />
                <p className="text-xs text-warm-gray">Authenticated</p>
              </div>
              <div className="text-center">
                <Truck className="h-6 w-6 text-vintage-gold mx-auto mb-1" />
                <p className="text-xs text-warm-gray">Free Shipping</p>
              </div>
              <div className="text-center">
                <RotateCcw className="h-6 w-6 text-vintage-gold mx-auto mb-1" />
                <p className="text-xs text-warm-gray">Easy Returns</p>
              </div>
            </div>
            
            {/* Tabs */}
            <div>
              <div className="flex border-b">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                      selectedTab === tab.id
                        ? 'border-vintage-gold text-vintage-gold'
                        : 'border-transparent text-warm-gray hover:text-deep-charcoal'
                    }`}
                    onClick={() => setSelectedTab(tab.id as any)}
                  >
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                ))}
              </div>
              
              <div className="py-4">
                {selectedTab === 'details' && (
                  <div className="space-y-4">
                    <p className="text-warm-gray leading-relaxed">
                      {product.description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {product.material && (
                        <div className="flex items-center gap-2">
                          <Gem className="h-4 w-4 text-vintage-gold" />
                          <span className="text-sm">
                            <strong>Material:</strong> {product.material}
                          </span>
                        </div>
                      )}
                      
                      {product.era && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-vintage-gold" />
                          <span className="text-sm">
                            <strong>Era:</strong> {product.era}
                          </span>
                        </div>
                      )}
                      
                      {product.size && (
                        <div className="flex items-center gap-2">
                          <Ruler className="h-4 w-4 text-vintage-gold" />
                          <span className="text-sm">
                            <strong>Size:</strong> {product.size}
                          </span>
                        </div>
                      )}
                      
                      {product.weight && (
                        <div className="flex items-center gap-2">
                          <Weight className="h-4 w-4 text-vintage-gold" />
                          <span className="text-sm">
                            <strong>Weight:</strong> {product.weight}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {product.tags.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Tags</h4>
                        <div className="flex flex-wrap gap-2">
                          {product.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {selectedTab === 'care' && (
                  <div className="space-y-4">
                    <h4 className="font-medium">Care Instructions</h4>
                    <ul className="space-y-2 text-sm text-warm-gray">
                      <li>• Store in a cool, dry place away from direct sunlight</li>
                      <li>• Clean gently with a soft, lint-free cloth</li>
                      <li>• Avoid exposure to chemicals, perfumes, and lotions</li>
                      <li>• Remove before swimming, showering, or exercising</li>
                      <li>• Have professionally cleaned and inspected annually</li>
                    </ul>
                  </div>
                )}
                
                {selectedTab === 'seller' && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 bg-vintage-gold/10 rounded-full flex items-center justify-center">
                        <Award className="h-6 w-6 text-vintage-gold" />
                      </div>
                      <div>
                        <h4 className="font-medium">{product.seller_name}</h4>
                        <p className="text-sm text-warm-gray">Verified Seller</p>
                      </div>
                    </div>
                    <p className="text-sm text-warm-gray">
                      This seller has been verified and has an excellent track record 
                      of providing authentic, high-quality jewelry pieces.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailModal;

