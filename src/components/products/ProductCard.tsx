'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/lib/products';
import { useCart } from '@/lib/cart';
import { 
  Heart, 
  ShoppingCart, 
  Eye, 
  Star,
  Gem,
  Crown,
  Sparkles
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  onToggleWishlist?: (product: Product) => void;
  isInWishlist?: boolean;
}

const ProductCard = ({ 
  product, 
  onQuickView, 
  onAddToCart, 
  onToggleWishlist,
  isInWishlist = false 
}: ProductCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const { addItem } = useCart();

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

  const handleImageError = () => {
    // Fallback to a placeholder or default image
    console.log('Image failed to load for product:', product.id);
  };

  const nextImage = () => {
    if (product.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product.images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  const discountPercentage = product.original_price 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  return (
    <Card 
      className="jewelry-card group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        {/* Product Image */}
        <div className="aspect-square bg-gradient-to-br from-soft-champagne to-vintage-gold/10 flex items-center justify-center relative overflow-hidden">
          {product.images.length > 0 ? (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-soft-champagne to-vintage-gold/10" />
              <CategoryIcon className="h-16 w-16 text-vintage-gold/30 absolute" />
              {/* In a real app, this would be the actual product image */}
              <div className="absolute inset-2 bg-white/80 rounded-lg flex items-center justify-center">
                <span className="text-xs text-warm-gray text-center px-2">
                  {product.title}
                </span>
              </div>
            </>
          ) : (
            <CategoryIcon className="h-16 w-16 text-vintage-gold/30" />
          )}
          
          {/* Image Navigation */}
          {product.images.length > 1 && isHovered && (
            <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex justify-between">
              <Button
                size="sm"
                variant="secondary"
                className="h-6 w-6 p-0 rounded-full opacity-80"
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
              >
                ‹
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="h-6 w-6 p-0 rounded-full opacity-80"
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
              >
                ›
              </Button>
            </div>
          )}
        </div>
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.is_featured && (
            <Badge className="bg-vintage-gold text-white text-xs">Featured</Badge>
          )}
          {product.original_price && (
            <Badge variant="destructive" className="text-xs">
              -{discountPercentage}%
            </Badge>
          )}
          {product.condition === 'excellent' && (
            <Badge variant="secondary" className="text-xs">Excellent</Badge>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button 
            size="sm" 
            variant="secondary" 
            className="h-8 w-8 p-0"
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist?.(product);
            }}
          >
            <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-current text-red-500' : ''}`} />
          </Button>
          <Button 
            size="sm" 
            variant="secondary" 
            className="h-8 w-8 p-0"
            onClick={(e) => {
              e.stopPropagation();
              onQuickView?.(product);
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>

        {/* Image Indicators */}
        {product.images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {product.images.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 w-1.5 rounded-full transition-colors duration-200 ${
                  index === currentImageIndex ? 'bg-vintage-gold' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-3 w-3 ${
                    i < Math.floor(product.rating!) 
                      ? 'text-vintage-gold fill-current' 
                      : 'text-gray-300'
                  }`} 
                />
              ))}
            </div>
            <span className="text-xs text-warm-gray">({product.reviews_count})</span>
          </div>
        )}
        
        {/* Product Title */}
        <h3 className="font-medium text-deep-charcoal mb-1 line-clamp-2 text-sm">
          {product.title}
        </h3>
        
        {/* Category and Era */}
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline" className="text-xs capitalize">
            {product.category}
          </Badge>
          {product.era && (
            <span className="text-xs text-warm-gray">{product.era}</span>
          )}
        </div>
        
        {/* Brand */}
        {product.brand && (
          <p className="text-xs text-warm-gray mb-2">{product.brand}</p>
        )}
        
        {/* Price and Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-deep-charcoal">
              ${product.price}
            </span>
            {product.original_price && (
              <span className="text-sm text-warm-gray line-through">
                ${product.original_price}
              </span>
            )}
          </div>
          <Button 
            size="sm" 
            className="btn-primary h-8 px-3"
            onClick={(e) => {
              e.stopPropagation();
              addItem(product);
              onAddToCart?.(product);
            }}
            disabled={product.is_sold}
          >
            {product.is_sold ? (
              'Sold'
            ) : (
              <ShoppingCart className="h-3 w-3" />
            )}
          </Button>
        </div>
        
        {/* Seller Info */}
        {product.seller_name && (
          <p className="text-xs text-warm-gray mt-2">
            by {product.seller_name}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductCard;

