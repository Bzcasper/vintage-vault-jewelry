'use client';

import { createClient } from '@supabase/supabase-js';
import { AdvancedJewelryAnalysis } from './advancedImageProcessing';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface AutomatedListing {
  id: string;
  userId: string;
  title: string;
  description: string;
  shortDescription: string;
  price: number;
  compareAtPrice?: number;
  category: string;
  subcategory: string;
  condition: string;
  conditionScore: number;
  images: string[];
  thumbnails: string[];
  metadata: {
    materials: Array<{
      material: string;
      confidence: number;
      purity?: string;
    }>;
    gemstones: Array<{
      stone: string;
      confidence: number;
      cut?: string;
      clarity?: string;
    }>;
    style: {
      era: string;
      design: string;
      confidence: number;
    };
    brand?: {
      name: string;
      confidence: number;
      verified: boolean;
    };
    dimensions?: {
      length?: number;
      width?: number;
      height?: number;
      weight?: number;
    };
    specifications: Record<string, any>;
    careInstructions: string[];
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
    tags: string[];
    altText: string;
    schema: any;
    score: number;
  };
  pricing: {
    basePrice: number;
    suggestedPrice: number;
    priceRange: {
      min: number;
      max: number;
    };
    marketAnalysis: {
      demandLevel: 'low' | 'medium' | 'high';
      competitorCount: number;
      averagePrice: number;
      priceHistory: Array<{
        date: string;
        price: number;
        source: string;
      }>;
    };
  };
  ai: {
    confidence: number;
    qualityScore: number;
    processingTime: number;
    modelVersions: {
      yolo: string;
      vit: string;
      llm: string;
    };
    flags: string[];
    recommendations: string[];
  };
  inventory: {
    sku: string;
    quantity: number;
    location?: string;
    supplier?: string;
  };
  shipping: {
    weight: number;
    dimensions: {
      length: number;
      width: number;
      height: number;
    };
    shippingClass: string;
    freeShipping: boolean;
  };
  status: 'draft' | 'pending_review' | 'active' | 'sold' | 'archived';
  visibility: 'public' | 'private' | 'unlisted';
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export class AutomatedListingGenerator {
  private static instance: AutomatedListingGenerator;

  static getInstance(): AutomatedListingGenerator {
    if (!AutomatedListingGenerator.instance) {
      AutomatedListingGenerator.instance = new AutomatedListingGenerator();
    }
    return AutomatedListingGenerator.instance;
  }

  async generateListing(
    analysis: AdvancedJewelryAnalysis,
    userId: string,
    imageUrls: string[],
    options: {
      autoPublish?: boolean;
      priceStrategy?: 'conservative' | 'market' | 'premium';
      includeComparables?: boolean;
      generateVariations?: boolean;
    } = {}
  ): Promise<AutomatedListing> {
    try {
      // Generate unique SKU
      const sku = this.generateSKU(analysis);

      // Create optimized title and description
      const optimizedContent = await this.generateOptimizedContent(analysis);

      // Calculate pricing strategy
      const pricing = this.calculatePricing(analysis, options.priceStrategy || 'market');

      // Generate SEO data
      const seoData = await this.generateSEOData(analysis, optimizedContent);

      // Create shipping information
      const shipping = this.generateShippingInfo(analysis);

      // Generate care instructions
      const careInstructions = this.generateCareInstructions(analysis.classification.materials);

      // Create the automated listing
      const listing: AutomatedListing = {
        id: this.generateListingId(),
        userId,
        title: optimizedContent.title,
        description: optimizedContent.description,
        shortDescription: optimizedContent.shortDescription,
        price: pricing.suggestedPrice,
        compareAtPrice: pricing.priceRange.max > pricing.suggestedPrice ? pricing.priceRange.max : undefined,
        category: analysis.classification.category,
        subcategory: analysis.classification.subcategory,
        condition: analysis.condition.overall,
        conditionScore: analysis.condition.score,
        images: imageUrls,
        thumbnails: await this.generateThumbnails(imageUrls),
        metadata: {
          materials: analysis.classification.materials,
          gemstones: analysis.classification.gemstones,
          style: analysis.classification.style,
          brand: analysis.classification.brand.detected ? {
            name: analysis.classification.brand.name!,
            confidence: analysis.classification.brand.confidence!,
            verified: analysis.condition.authenticity.verified
          } : undefined,
          specifications: analysis.listing.specifications,
          careInstructions
        },
        seo: seoData,
        pricing,
        ai: {
          confidence: analysis.processing.confidence,
          qualityScore: analysis.processing.qualityScore,
          processingTime: analysis.processing.processingTime,
          modelVersions: analysis.processing.modelVersions,
          flags: this.generateAIFlags(analysis),
          recommendations: this.generateRecommendations(analysis)
        },
        inventory: {
          sku,
          quantity: 1,
          location: 'warehouse-main'
        },
        shipping,
        status: options.autoPublish ? 'active' : 'draft',
        visibility: 'public',
        featured: this.shouldFeature(analysis),
        createdAt: new Date(),
        updatedAt: new Date(),
        publishedAt: options.autoPublish ? new Date() : undefined
      };

      // Store in database
      await this.storeListing(listing);

      // Generate variations if requested
      if (options.generateVariations) {
        await this.generateListingVariations(listing, analysis);
      }

      // Send for review if needed
      if (this.requiresReview(analysis)) {
        await this.flagForReview(listing.id, this.getReviewReasons(analysis));
      }

      return listing;

    } catch (error) {
      console.error('Automated listing generation failed:', error);
      throw new Error(`Failed to generate listing: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async generateOptimizedContent(analysis: AdvancedJewelryAnalysis) {
    const category = analysis.classification.category;
    const materials = analysis.classification.materials.map(m => m.material).join(', ');
    const style = analysis.classification.style;
    const condition = analysis.condition.overall;
    const brand = analysis.classification.brand.detected ? analysis.classification.brand.name : null;

    // Generate title with SEO optimization
    const titleParts = [
      brand || (style.era !== 'contemporary' ? style.era : ''),
      materials.includes('gold') ? 'Gold' : materials.includes('silver') ? 'Silver' : '',
      category.charAt(0).toUpperCase() + category.slice(1),
      analysis.classification.gemstones.length > 0 ? `with ${analysis.classification.gemstones[0].stone}` : '',
      condition !== 'good' ? `- ${condition.charAt(0).toUpperCase() + condition.slice(1)} Condition` : ''
    ].filter(Boolean);

    const title = titleParts.join(' ').substring(0, 60); // SEO title length limit

    // Generate comprehensive description
    const description = this.generateDescription(analysis);

    // Generate short description for previews
    const shortDescription = `${style.era} ${category} in ${condition} condition. Features ${materials} construction${analysis.classification.gemstones.length > 0 ? ` with ${analysis.classification.gemstones.map(g => g.stone).join(', ')}` : ''}.`;

    return {
      title,
      description,
      shortDescription
    };
  }

  private generateDescription(analysis: AdvancedJewelryAnalysis): string {
    const parts = [];

    // Opening statement
    parts.push(`Discover this exquisite ${analysis.classification.style.era} ${analysis.classification.category} that perfectly captures the elegance of ${analysis.classification.style.design} design.`);

    // Materials and construction
    if (analysis.classification.materials.length > 0) {
      const materials = analysis.classification.materials.map(m => 
        m.purity ? `${m.purity} ${m.material}` : m.material
      ).join(', ');
      parts.push(`Expertly crafted from ${materials}, this piece showcases exceptional quality and attention to detail.`);
    }

    // Gemstones
    if (analysis.classification.gemstones.length > 0) {
      const gemstones = analysis.classification.gemstones.map(g => 
        `${g.cut ? `${g.cut}-cut ` : ''}${g.stone}${g.clarity ? ` (${g.clarity} clarity)` : ''}`
      ).join(', ');
      parts.push(`Adorned with ${gemstones}, adding brilliance and sophistication to the overall design.`);
    }

    // Condition and authenticity
    parts.push(`This piece is in ${analysis.condition.overall} condition with a quality score of ${analysis.condition.score}/100.`);
    
    if (analysis.condition.authenticity.verified) {
      parts.push(`Authenticity has been verified through our advanced AI analysis system.`);
    }

    // Brand information
    if (analysis.classification.brand.detected) {
      parts.push(`This ${analysis.classification.brand.name} piece represents the brand's commitment to excellence and timeless style.`);
    }

    // Care instructions preview
    parts.push(`Proper care instructions are included to ensure this treasure maintains its beauty for generations to come.`);

    // Investment value
    if (analysis.market.demandLevel === 'high') {
      parts.push(`With high market demand and excellent condition, this piece represents both a beautiful accessory and a smart investment.`);
    }

    return parts.join(' ');
  }

  private calculatePricing(analysis: AdvancedJewelryAnalysis, strategy: 'conservative' | 'market' | 'premium') {
    const basePrice = analysis.market.estimatedValue.recommended;
    const priceRange = analysis.market.estimatedValue;

    let suggestedPrice: number;
    
    switch (strategy) {
      case 'conservative':
        suggestedPrice = Math.round(basePrice * 0.9);
        break;
      case 'premium':
        suggestedPrice = Math.round(basePrice * 1.1);
        break;
      default: // market
        suggestedPrice = basePrice;
    }

    // Adjust based on condition
    const conditionMultiplier = {
      'excellent': 1.1,
      'very-good': 1.0,
      'good': 0.9,
      'fair': 0.8,
      'poor': 0.7
    }[analysis.condition.overall] || 1.0;

    suggestedPrice = Math.round(suggestedPrice * conditionMultiplier);

    return {
      basePrice,
      suggestedPrice,
      priceRange: {
        min: Math.round(suggestedPrice * 0.8),
        max: Math.round(suggestedPrice * 1.3)
      },
      marketAnalysis: {
        demandLevel: analysis.market.demandLevel,
        competitorCount: analysis.market.comparables.length,
        averagePrice: analysis.market.comparables.reduce((sum, comp) => sum + comp.price, 0) / Math.max(analysis.market.comparables.length, 1),
        priceHistory: analysis.market.comparables.map(comp => ({
          date: new Date().toISOString(),
          price: comp.price,
          source: comp.source
        }))
      }
    };
  }

  private async generateSEOData(analysis: AdvancedJewelryAnalysis, content: any) {
    const keywords = [
      analysis.classification.category,
      ...analysis.classification.materials.map(m => m.material),
      analysis.classification.style.era,
      analysis.classification.style.design,
      'vintage jewelry',
      'pre-owned jewelry',
      'authentic jewelry'
    ];

    if (analysis.classification.brand.detected) {
      keywords.push(analysis.classification.brand.name!);
    }

    if (analysis.classification.gemstones.length > 0) {
      keywords.push(...analysis.classification.gemstones.map(g => g.stone));
    }

    const tags = [
      analysis.classification.category,
      analysis.classification.style.era,
      analysis.condition.overall,
      'vintage',
      'authentic',
      'jewelry'
    ];

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      'name': content.title,
      'description': content.shortDescription,
      'category': analysis.classification.category,
      'brand': analysis.classification.brand.detected ? {
        '@type': 'Brand',
        'name': analysis.classification.brand.name
      } : undefined,
      'material': analysis.classification.materials.map(m => m.material),
      'offers': {
        '@type': 'Offer',
        'price': analysis.market.estimatedValue.recommended,
        'priceCurrency': 'USD',
        'availability': 'https://schema.org/InStock',
        'condition': `https://schema.org/${analysis.condition.overall === 'excellent' ? 'NewCondition' : 'UsedCondition'}`
      },
      'aggregateRating': {
        '@type': 'AggregateRating',
        'ratingValue': Math.round(analysis.condition.score / 20), // Convert to 5-star scale
        'reviewCount': 1
      }
    };

    return {
      title: content.title,
      description: content.shortDescription,
      keywords: [...new Set(keywords)], // Remove duplicates
      tags: [...new Set(tags)],
      altText: `${analysis.classification.style.era} ${analysis.classification.category} in ${analysis.condition.overall} condition`,
      schema,
      score: this.calculateSEOScore(content.title, content.description, keywords)
    };
  }

  private generateShippingInfo(analysis: AdvancedJewelryAnalysis) {
    // Estimate dimensions and weight based on category
    const categoryDefaults = {
      ring: { weight: 0.01, length: 2, width: 2, height: 1 },
      necklace: { weight: 0.05, length: 20, width: 1, height: 1 },
      bracelet: { weight: 0.03, length: 8, width: 1, height: 1 },
      earrings: { weight: 0.02, length: 3, width: 1, height: 1 },
      brooch: { weight: 0.02, length: 5, width: 5, height: 1 },
      watch: { weight: 0.1, length: 10, width: 4, height: 1 }
    };

    const defaults = categoryDefaults[analysis.classification.category as keyof typeof categoryDefaults] || 
                    { weight: 0.05, length: 5, width: 5, height: 2 };

    return {
      weight: defaults.weight,
      dimensions: {
        length: defaults.length,
        width: defaults.width,
        height: defaults.height
      },
      shippingClass: 'jewelry',
      freeShipping: analysis.market.estimatedValue.recommended >= 100
    };
  }

  private generateCareInstructions(materials: any[]): string[] {
    const instructions = new Set<string>();

    // General jewelry care
    instructions.add('Store in a cool, dry place away from direct sunlight');
    instructions.add('Keep away from chemicals, perfumes, and cosmetics');
    instructions.add('Remove before swimming, showering, or exercising');

    // Material-specific care
    materials.forEach(material => {
      switch (material.material.toLowerCase()) {
        case 'gold':
          instructions.add('Clean gently with warm soapy water and a soft brush');
          instructions.add('Polish with a jewelry cloth to maintain shine');
          break;
        case 'silver':
          instructions.add('Clean with silver polish or a silver cleaning cloth');
          instructions.add('Store in anti-tarnish bags or with anti-tarnish strips');
          break;
        case 'platinum':
          instructions.add('Clean with mild soap and warm water');
          instructions.add('Professional cleaning recommended annually');
          break;
        case 'pearl':
          instructions.add('Wipe with a soft, damp cloth after wearing');
          instructions.add('Store separately to prevent scratching');
          instructions.add('Avoid ultrasonic cleaners');
          break;
      }
    });

    return Array.from(instructions);
  }

  private async generateThumbnails(imageUrls: string[]): Promise<string[]> {
    // In a real implementation, this would generate actual thumbnails
    // For now, return the original URLs (thumbnails would be generated by image optimization pipeline)
    return imageUrls.map(url => url.replace('.jpg', '_thumb.jpg').replace('.png', '_thumb.png'));
  }

  private generateSKU(analysis: AdvancedJewelryAnalysis): string {
    const category = analysis.classification.category.substring(0, 3).toUpperCase();
    const material = analysis.classification.materials[0]?.material.substring(0, 2).toUpperCase() || 'XX';
    const era = analysis.classification.style.era.substring(0, 2).toUpperCase();
    const timestamp = Date.now().toString().slice(-6);
    
    return `${category}-${material}-${era}-${timestamp}`;
  }

  private generateListingId(): string {
    return `listing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private shouldFeature(analysis: AdvancedJewelryAnalysis): boolean {
    return (
      analysis.processing.confidence > 0.9 &&
      analysis.condition.score > 85 &&
      analysis.market.demandLevel === 'high' &&
      (analysis.classification.brand.detected || analysis.market.estimatedValue.recommended > 200)
    );
  }

  private generateAIFlags(analysis: AdvancedJewelryAnalysis): string[] {
    const flags = [];

    if (analysis.processing.confidence < 0.7) {
      flags.push('low_confidence');
    }

    if (analysis.condition.score < 60) {
      flags.push('poor_condition');
    }

    if (!analysis.condition.authenticity.verified) {
      flags.push('authenticity_unverified');
    }

    if (analysis.classification.brand.detected && analysis.classification.brand.confidence! < 0.8) {
      flags.push('brand_uncertain');
    }

    return flags;
  }

  private generateRecommendations(analysis: AdvancedJewelryAnalysis): string[] {
    const recommendations = [];

    if (analysis.processing.confidence < 0.8) {
      recommendations.push('Consider manual review for accuracy verification');
    }

    if (analysis.condition.defects.length > 0) {
      recommendations.push('Highlight condition details in description');
    }

    if (analysis.market.demandLevel === 'low') {
      recommendations.push('Consider competitive pricing strategy');
    }

    if (analysis.listing.seoScore < 80) {
      recommendations.push('Optimize title and description for better SEO');
    }

    return recommendations;
  }

  private requiresReview(analysis: AdvancedJewelryAnalysis): boolean {
    return (
      analysis.processing.confidence < 0.7 ||
      !analysis.condition.authenticity.verified ||
      analysis.market.estimatedValue.recommended > 1000 ||
      analysis.condition.defects.some(d => d.impact === 'significant')
    );
  }

  private getReviewReasons(analysis: AdvancedJewelryAnalysis): string[] {
    const reasons = [];

    if (analysis.processing.confidence < 0.7) {
      reasons.push('Low AI confidence score');
    }

    if (!analysis.condition.authenticity.verified) {
      reasons.push('Authenticity verification required');
    }

    if (analysis.market.estimatedValue.recommended > 1000) {
      reasons.push('High-value item requires manual verification');
    }

    return reasons;
  }

  private async flagForReview(listingId: string, reasons: string[]) {
    await supabase
      .from('listing_reviews')
      .insert({
        listing_id: listingId,
        status: 'pending',
        reasons,
        created_at: new Date()
      });
  }

  private async generateListingVariations(listing: AutomatedListing, analysis: AdvancedJewelryAnalysis) {
    // Generate variations for different pricing strategies
    const variations = ['conservative', 'premium'].map(strategy => ({
      ...listing,
      id: this.generateListingId(),
      title: `${listing.title} (${strategy})`,
      pricing: this.calculatePricing(analysis, strategy as any),
      status: 'draft' as const
    }));

    for (const variation of variations) {
      await this.storeListing(variation);
    }
  }

  private async storeListing(listing: AutomatedListing) {
    const { error } = await supabase
      .from('automated_listings')
      .insert(listing);

    if (error) {
      console.error('Error storing automated listing:', error);
      throw error;
    }
  }

  private calculateSEOScore(title: string, description: string, keywords: string[]): number {
    let score = 0;

    // Title optimization (30 points)
    if (title.length >= 30 && title.length <= 60) score += 15;
    if (keywords.some(keyword => title.toLowerCase().includes(keyword.toLowerCase()))) score += 15;

    // Description optimization (40 points)
    if (description.length >= 150 && description.length <= 300) score += 20;
    if (keywords.filter(keyword => description.toLowerCase().includes(keyword.toLowerCase())).length >= 3) score += 20;

    // Keywords optimization (30 points)
    if (keywords.length >= 5 && keywords.length <= 15) score += 15;
    if (keywords.some(keyword => keyword.length >= 3)) score += 15;

    return Math.min(score, 100);
  }
}

export const automatedListingGenerator = AutomatedListingGenerator.getInstance();

