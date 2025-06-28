'use client';

import React from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  Star, 
  Gem, 
  Crown, 
  Sparkles,
  Heart,
  ShoppingCart,
  Eye
} from 'lucide-react';

const HomePage = () => {
  // Mock data for featured products
  const featuredProducts = [
    {
      id: 1,
      name: "Vintage Art Deco Diamond Ring",
      price: 450,
      originalPrice: 650,
      image: "/api/placeholder/300/300",
      category: "Vintage",
      rating: 4.8,
      reviews: 24,
      isNew: false,
      isSale: true
    },
    {
      id: 2,
      name: "Pearl Statement Necklace",
      price: 125,
      originalPrice: null,
      image: "/api/placeholder/300/300",
      category: "Costume",
      rating: 4.9,
      reviews: 18,
      isNew: true,
      isSale: false
    },
    {
      id: 3,
      name: "Victorian Gold Brooch",
      price: 320,
      originalPrice: null,
      image: "/api/placeholder/300/300",
      category: "Vintage",
      rating: 4.7,
      reviews: 12,
      isNew: false,
      isSale: false
    },
    {
      id: 4,
      name: "Rhinestone Cocktail Earrings",
      price: 85,
      originalPrice: 120,
      image: "/api/placeholder/300/300",
      category: "Costume",
      rating: 4.6,
      reviews: 31,
      isNew: false,
      isSale: true
    }
  ];

  const collections = [
    {
      name: "Vintage Collection",
      description: "Authentic pieces from bygone eras",
      icon: Crown,
      count: "150+ pieces",
      image: "/api/placeholder/400/300"
    },
    {
      name: "Costume Jewelry",
      description: "Statement pieces for every occasion",
      icon: Sparkles,
      count: "200+ pieces",
      image: "/api/placeholder/400/300"
    },
    {
      name: "Designer Finds",
      description: "Curated luxury at accessible prices",
      icon: Gem,
      count: "75+ pieces",
      image: "/api/placeholder/400/300"
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-luxury-gradient py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6 bg-vintage-gold/10 text-vintage-gold border-vintage-gold/20">
              ✨ New arrivals weekly
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-deep-charcoal mb-6 leading-tight">
              Timeless Treasures,
              <span className="text-vintage-gold block">Curated with Care</span>
            </h1>
            <p className="text-lg md:text-xl text-warm-gray mb-8 max-w-2xl mx-auto leading-relaxed">
              Discover authentic vintage and pre-owned jewelry that tells a story. Each piece is carefully selected and verified for quality and authenticity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="btn-primary text-lg px-8 py-3">
                Shop Collections
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="btn-secondary text-lg px-8 py-3">
                Sell Your Jewelry
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-deep-charcoal mb-4">
              Explore Our Collections
            </h2>
            <p className="text-lg text-warm-gray max-w-2xl mx-auto">
              From vintage heirlooms to contemporary costume pieces, find the perfect jewelry for every style and occasion.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {collections.map((collection, index) => (
              <Card key={index} className="jewelry-card group cursor-pointer overflow-hidden">
                <div className="relative h-48 bg-gradient-to-br from-soft-champagne to-vintage-gold/10">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <collection.icon className="h-16 w-16 text-vintage-gold opacity-20" />
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-white/90 text-deep-charcoal">
                      {collection.count}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-serif font-semibold text-deep-charcoal mb-2">
                    {collection.name}
                  </h3>
                  <p className="text-warm-gray mb-4">
                    {collection.description}
                  </p>
                  <Button variant="ghost" className="text-vintage-gold hover:text-vintage-gold/80 p-0">
                    Explore Collection
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-deep-charcoal mb-4">
              Featured Pieces
            </h2>
            <p className="text-lg text-warm-gray max-w-2xl mx-auto">
              Handpicked treasures that showcase the beauty and craftsmanship of vintage and costume jewelry.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="jewelry-card group cursor-pointer overflow-hidden">
                <div className="relative">
                  <div className="aspect-square bg-gradient-to-br from-soft-champagne to-vintage-gold/10 flex items-center justify-center">
                    <Gem className="h-16 w-16 text-vintage-gold/30" />
                  </div>
                  
                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {product.isNew && (
                      <Badge className="bg-vintage-gold text-white">New</Badge>
                    )}
                    {product.isSale && (
                      <Badge variant="destructive">Sale</Badge>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-3 w-3 ${i < Math.floor(product.rating) ? 'text-vintage-gold fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-xs text-warm-gray">({product.reviews})</span>
                  </div>
                  
                  <h3 className="font-medium text-deep-charcoal mb-1 line-clamp-2">
                    {product.name}
                  </h3>
                  
                  <Badge variant="outline" className="text-xs mb-2">
                    {product.category}
                  </Badge>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-deep-charcoal">
                        ${product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-warm-gray line-through">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>
                    <Button size="sm" className="btn-primary h-8">
                      <ShoppingCart className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button size="lg" variant="outline" className="btn-secondary">
              View All Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 lg:py-24 bg-deep-charcoal text-cream-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              Stay in the Loop
            </h2>
            <p className="text-lg text-warm-gray mb-8">
              Be the first to know about new arrivals, exclusive offers, and jewelry care tips.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-md bg-warm-gray/10 border border-warm-gray/20 text-cream-white placeholder:text-warm-gray focus:border-vintage-gold focus:ring-1 focus:ring-vintage-gold transition-colors duration-200"
              />
              <Button className="btn-primary px-8 py-3">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;

