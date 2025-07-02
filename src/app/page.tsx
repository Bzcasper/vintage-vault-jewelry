'use client';

import React, { useState, useEffect } from 'react';
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
  Eye,
  Award,
  Shield,
  Truck,
  Clock,
  CheckCircle,
  Users,
  TrendingUp
} from 'lucide-react';

const HomePage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Enhanced mock data for featured products
  const featuredProducts = [
    {
      id: 1,
      name: "Vintage Art Deco Diamond Ring",
      price: 450,
      originalPrice: 650,
      image: "/test-jewelry.webp",
      category: "Vintage",
      rating: 4.8,
      reviews: 24,
      isNew: false,
      isSale: true,
      era: "1920s"
    },
    {
      id: 2,
      name: "Pearl Statement Necklace",
      price: 125,
      originalPrice: null,
      image: "/test-jewelry.webp",
      category: "Costume",
      rating: 4.9,
      reviews: 18,
      isNew: true,
      isSale: false,
      era: "Contemporary"
    },
    {
      id: 3,
      name: "Victorian Gold Brooch",
      price: 320,
      originalPrice: null,
      image: "/test-jewelry.webp",
      category: "Vintage",
      rating: 4.7,
      reviews: 12,
      isNew: false,
      isSale: false,
      era: "Victorian"
    },
    {
      id: 4,
      name: "Rhinestone Cocktail Earrings",
      price: 85,
      originalPrice: 120,
      image: "/test-jewelry.webp",
      category: "Costume",
      rating: 4.6,
      reviews: 31,
      isNew: false,
      isSale: true,
      era: "1960s"
    }
  ];

  const collections = [
    {
      name: "Vintage Collection",
      description: "Authentic pieces from bygone eras, each with its own unique story",
      icon: Crown,
      count: "150+ pieces",
      image: "/test-jewelry.webp",
      color: "from-vintage-gold/20 to-soft-champagne"
    },
    {
      name: "Costume Jewelry",
      description: "Statement pieces for every occasion and personal style",
      icon: Sparkles,
      count: "200+ pieces",
      image: "/test-jewelry.webp",
      color: "from-rose-gold/20 to-soft-champagne"
    },
    {
      name: "Designer Finds",
      description: "Curated luxury at accessible prices from renowned designers",
      icon: Gem,
      count: "75+ pieces",
      image: "/test-jewelry.webp",
      color: "from-warm-gray/20 to-soft-champagne"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      text: "The quality and authenticity of the pieces exceeded my expectations. Each item comes with detailed provenance.",
      rating: 5,
      location: "New York, NY"
    },
    {
      name: "Emily Chen",
      text: "Found the perfect vintage engagement ring here. The authentication process gave me complete confidence.",
      rating: 5,
      location: "Los Angeles, CA"
    },
    {
      name: "Maria Rodriguez", 
      text: "As a collector, I appreciate the careful curation and detailed descriptions of each piece's history.",
      rating: 5,
      location: "Chicago, IL"
    }
  ];

  const stats = [
    { icon: Users, value: "50K+", label: "Happy Customers" },
    { icon: Gem, value: "10K+", label: "Curated Pieces" },
    { icon: Award, value: "99%", label: "Authenticity Rate" },
    { icon: TrendingUp, value: "4.9", label: "Average Rating" }
  ];

  return (
    <Layout>
      {/* Enhanced Hero Section */}
      <section className="relative hero-gradient py-24 lg:py-40 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 animate-float">
            <Gem className="h-8 w-8 text-vintage-gold/50" />
          </div>
          <div className="absolute top-40 right-20 animate-float" style={{ animationDelay: '2s' }}>
            <Crown className="h-6 w-6 text-vintage-gold/50" />
          </div>
          <div className="absolute bottom-40 left-20 animate-float" style={{ animationDelay: '4s' }}>
            <Sparkles className="h-7 w-7 text-vintage-gold/50" />
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <Badge 
              variant="secondary" 
              className={`mb-8 bg-vintage-gold/10 text-vintage-gold border-vintage-gold/20 animate-shimmer ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
            >
              ✨ New arrivals weekly • Authenticated & Verified
            </Badge>
            
            <h1 className={`text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-deep-charcoal mb-8 leading-tight ${isVisible ? 'animate-fade-in-up-delay' : 'opacity-0'}`}>
              Timeless Treasures,
              <span className="text-gradient block animate-glow">Curated with Care</span>
            </h1>
            
            <p className={`text-xl md:text-2xl text-warm-gray mb-12 max-w-3xl mx-auto leading-relaxed ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
              Discover authentic vintage and pre-owned jewelry that tells a story. Each piece is carefully selected, authenticated, and verified for quality and provenance.
            </p>
            
            <div className={`flex flex-col sm:flex-row gap-6 justify-center ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.6s' }}>
              <Button size="lg" className="btn-primary text-xl px-10 py-4 group">
                Shop Collections
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg" className="btn-secondary text-xl px-10 py-4 group">
                Sell Your Jewelry
                <TrendingUp className="ml-3 h-6 w-6 group-hover:scale-110 transition-transform" />
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className={`mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.8s' }}>
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <stat.icon className="h-8 w-8 text-vintage-gold mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <div className="text-2xl font-bold text-deep-charcoal">{stat.value}</div>
                  <div className="text-sm text-warm-gray">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Featured Collections */}
      <section className="py-20 lg:py-32 collection-gradient">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-6 text-vintage-gold border-vintage-gold/20">
              Curated Collections
            </Badge>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-deep-charcoal mb-6 animate-fade-in-up">
              Explore Our <span className="text-shimmer">Premium Collections</span>
            </h2>
            <p className="text-xl text-warm-gray max-w-3xl mx-auto animate-fade-in-up-delay">
              From vintage heirlooms to contemporary costume pieces, discover carefully curated collections that celebrate the artistry and history of fine jewelry.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {collections.map((collection, index) => (
              <Card key={index} className="premium-card group cursor-pointer animate-scale-in" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className={`relative h-64 bg-gradient-to-br ${collection.color} overflow-hidden`}>
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-4 left-4">
                      <collection.icon className="h-8 w-8 text-vintage-gold" />
                    </div>
                    <div className="absolute top-8 right-8">
                      <collection.icon className="h-6 w-6 text-vintage-gold" />
                    </div>
                    <div className="absolute bottom-8 left-8">
                      <collection.icon className="h-4 w-4 text-vintage-gold" />
                    </div>
                  </div>
                  
                  {/* Main Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <collection.icon className="h-20 w-20 text-vintage-gold opacity-30 group-hover:opacity-50 group-hover:scale-110 transition-all duration-500" />
                  </div>
                  
                  {/* Count Badge */}
                  <div className="absolute top-6 right-6">
                    <Badge className="bg-vintage-gold text-white group-hover:bg-vintage-gold/90 transition-colors">
                      {collection.count}
                    </Badge>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-vintage-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                <CardContent className="p-8">
                  <h3 className="text-2xl font-serif font-bold text-deep-charcoal mb-3 group-hover:text-vintage-gold transition-colors">
                    {collection.name}
                  </h3>
                  <p className="text-warm-gray mb-6 leading-relaxed">
                    {collection.description}
                  </p>
                  <Button variant="ghost" className="text-vintage-gold hover:text-vintage-gold/80 hover:bg-vintage-gold/5 p-0 group">
                    Explore Collection
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Featured Products */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-6 text-vintage-gold border-vintage-gold/20">
              Featured Pieces
            </Badge>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-deep-charcoal mb-6">
              Handpicked <span className="text-gradient">Treasures</span>
            </h2>
            <p className="text-xl text-warm-gray max-w-3xl mx-auto">
              Discover exceptional pieces that showcase the beauty, craftsmanship, and history of vintage and costume jewelry from renowned eras.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product, index) => (
              <Card key={product.id} className="premium-card group cursor-pointer animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="relative overflow-hidden">
                  <div className="aspect-square bg-gradient-to-br from-soft-champagne via-vintage-gold/10 to-soft-champagne flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                    />
                    <div className="absolute inset-0 bg-vintage-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  
                  {/* Enhanced Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.isNew && (
                      <Badge className="bg-vintage-gold text-white animate-shimmer">New</Badge>
                    )}
                    {product.isSale && (
                      <Badge variant="destructive" className="animate-shimmer">Sale</Badge>
                    )}
                    <Badge variant="secondary" className="bg-deep-charcoal/80 text-white text-xs">
                      {product.era}
                    </Badge>
                  </div>
                  
                  {/* Enhanced Action Buttons */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                    <Button size="sm" variant="secondary" className="h-9 w-9 p-0 backdrop-blur-sm bg-white/90 hover:bg-white hover:scale-110 transition-all">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="secondary" className="h-9 w-9 p-0 backdrop-blur-sm bg-white/90 hover:bg-white hover:scale-110 transition-all">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Quick Add to Cart */}
                  <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <Button size="sm" className="btn-primary h-9 px-3">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-vintage-gold fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-sm text-warm-gray">({product.reviews})</span>
                  </div>
                  
                  {/* Product Name */}
                  <h3 className="font-semibold text-deep-charcoal mb-2 line-clamp-2 group-hover:text-vintage-gold transition-colors">
                    {product.name}
                  </h3>
                  
                  {/* Category */}
                  <Badge variant="outline" className="text-xs mb-3 text-vintage-gold border-vintage-gold/30">
                    {product.category}
                  </Badge>
                  
                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-deep-charcoal">
                        ${product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-warm-gray line-through">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>
                    {product.isSale && (
                      <Badge variant="destructive" className="text-xs">
                        {Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)}% OFF
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-16">
            <Button size="lg" variant="outline" className="btn-secondary group">
              View All Products
              <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-20 lg:py-32 premium-gradient">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-6 text-vintage-gold border-vintage-gold/20 bg-vintage-gold/5">
              Customer Reviews
            </Badge>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-cream-white mb-6">
              What Our <span className="text-vintage-gold">Customers Say</span>
            </h2>
            <p className="text-xl text-warm-gray max-w-3xl mx-auto">
              Hear from jewelry enthusiasts who have discovered their perfect pieces through our curated collection.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="premium-card bg-cream-white/10 backdrop-blur-sm border-vintage-gold/20">
              <CardContent className="p-8 lg:p-12 text-center">
                <div className="mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 text-vintage-gold fill-current inline-block mr-1" />
                  ))}
                </div>
                
                <blockquote className="text-2xl lg:text-3xl font-serif text-cream-white mb-8 leading-relaxed">
                  "{testimonials[currentTestimonial].text}"
                </blockquote>
                
                <div className="text-vintage-gold font-semibold text-lg">
                  {testimonials[currentTestimonial].name}
                </div>
                <div className="text-warm-gray">
                  {testimonials[currentTestimonial].location}
                </div>
                
                <div className="flex justify-center mt-8 space-x-3">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentTestimonial 
                          ? 'bg-vintage-gold scale-125' 
                          : 'bg-vintage-gold/30 hover:bg-vintage-gold/60'
                      }`}
                      onClick={() => setCurrentTestimonial(index)}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Enhanced Newsletter Section */}
      <section className="py-20 lg:py-32 luxury-gradient border-t border-vintage-gold/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="mb-6 text-vintage-gold border-vintage-gold/20">
              Newsletter
            </Badge>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-deep-charcoal mb-6">
              Join Our <span className="text-gradient">Collector's Circle</span>
            </h2>
            <p className="text-xl text-warm-gray mb-12 max-w-2xl mx-auto">
              Be the first to discover new arrivals, exclusive collections, and insider jewelry care tips from our curators.
            </p>
            
            <Card className="premium-card max-w-2xl mx-auto">
              <CardContent className="p-8">
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="flex-1 px-6 py-4 rounded-lg bg-cream-white border-2 border-vintage-gold/20 text-deep-charcoal placeholder:text-warm-gray focus:border-vintage-gold focus:ring-4 focus:ring-vintage-gold/20 transition-all duration-300 text-lg"
                  />
                  <Button className="btn-primary px-8 py-4 text-lg group">
                    Subscribe
                    <CheckCircle className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  </Button>
                </div>
                
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-warm-gray">
                  <div className="flex items-center justify-center gap-2">
                    <Clock className="h-4 w-4 text-vintage-gold" />
                    Weekly arrivals
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Shield className="h-4 w-4 text-vintage-gold" />
                    Exclusive access
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Sparkles className="h-4 w-4 text-vintage-gold" />
                    Care tips
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trust Indicators */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <Shield className="h-10 w-10 text-vintage-gold mx-auto mb-3" />
                <div className="font-semibold text-deep-charcoal">Authenticated</div>
                <div className="text-sm text-warm-gray">Every piece verified</div>
              </div>
              <div className="text-center">
                <Truck className="h-10 w-10 text-vintage-gold mx-auto mb-3" />
                <div className="font-semibold text-deep-charcoal">Free Shipping</div>
                <div className="text-sm text-warm-gray">Orders over $100</div>
              </div>
              <div className="text-center">
                <Award className="h-10 w-10 text-vintage-gold mx-auto mb-3" />
                <div className="font-semibold text-deep-charcoal">Expert Curation</div>
                <div className="text-sm text-warm-gray">Hand-selected pieces</div>
              </div>
              <div className="text-center">
                <Users className="h-10 w-10 text-vintage-gold mx-auto mb-3" />
                <div className="font-semibold text-deep-charcoal">50K+ Customers</div>
                <div className="text-sm text-warm-gray">Join our community</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;

