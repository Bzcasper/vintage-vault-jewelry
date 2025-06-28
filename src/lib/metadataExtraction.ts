'use client';

import { AdvancedAIAnalysis } from './advancedAIPipeline';

export interface JewelryMetadata {
  // Basic Information
  basic: {
    id: string;
    title: string;
    category: string;
    subcategory: string;
    brand?: string;
    model?: string;
    sku?: string;
    upc?: string;
    createdAt: Date;
    updatedAt: Date;
  };

  // Physical Properties
  physical: {
    dimensions: {
      length?: number; // mm
      width?: number;  // mm
      height?: number; // mm
      diameter?: number; // mm for rings
      circumference?: number; // mm for bracelets
    };
    weight: {
      total?: number; // grams
      estimated?: number;
      unit: 'grams' | 'ounces' | 'carats';
    };
    size?: {
      ring?: string; // US ring size
      bracelet?: string; // inches
      necklace?: string; // inches
      chain?: string; // inches
    };
    color: {
      primary: string;
      secondary?: string;
      accent?: string;
      finish: 'polished' | 'matte' | 'brushed' | 'textured' | 'oxidized';
    };
  };

  // Materials and Composition
  materials: {
    primary: Array<{
      material: string;
      purity?: string; // 14k, 18k, 925, etc.
      percentage?: number;
      hallmarks?: string[];
      testing?: {
        method: string;
        result: string;
        confidence: number;
      };
    }>;
    secondary?: Array<{
      material: string;
      purpose: 'accent' | 'setting' | 'chain' | 'clasp';
      percentage?: number;
    }>;
    plating?: {
      material: string;
      thickness?: string;
      quality: 'excellent' | 'good' | 'fair' | 'poor';
    };
  };

  // Gemstones and Stones
  gemstones: Array<{
    stone: string;
    type: 'natural' | 'synthetic' | 'simulated' | 'unknown';
    cut?: string;
    shape?: string;
    size?: {
      carat?: number;
      mm?: string;
    };
    clarity?: string;
    color?: string;
    treatment?: string[];
    setting?: string;
    quantity: number;
    position: string;
    certification?: {
      lab: string;
      number: string;
      grade: string;
    };
  }>;

  // Condition and Authenticity
  condition: {
    overall: 'excellent' | 'very-good' | 'good' | 'fair' | 'poor';
    score: number; // 0-100
    details: {
      wear: 'none' | 'minimal' | 'moderate' | 'heavy';
      scratches: 'none' | 'light' | 'moderate' | 'heavy';
      dents: 'none' | 'minor' | 'moderate' | 'major';
      tarnish: 'none' | 'light' | 'moderate' | 'heavy';
      missing: string[]; // missing stones, parts, etc.
      repairs: string[]; // previous repairs
      modifications: string[]; // alterations
    };
    functionality: {
      clasp: 'excellent' | 'good' | 'fair' | 'poor' | 'broken';
      hinge: 'excellent' | 'good' | 'fair' | 'poor' | 'broken';
      movement?: 'excellent' | 'good' | 'fair' | 'poor' | 'broken'; // for watches
      chain: 'excellent' | 'good' | 'fair' | 'poor' | 'broken';
    };
    authenticity: {
      verified: boolean;
      confidence: number;
      indicators: string[];
      concerns: string[];
      testing: Array<{
        method: string;
        result: string;
        date: Date;
      }>;
    };
  };

  // Style and Design
  style: {
    era: string;
    period: string;
    design: string;
    aesthetic: string;
    motif?: string[];
    technique?: string[];
    inspiration?: string;
    rarity: 'common' | 'uncommon' | 'rare' | 'very-rare' | 'unique';
  };

  // Market and Valuation
  market: {
    estimatedValue: {
      retail: number;
      wholesale: number;
      auction: number;
      insurance: number;
      currency: 'USD' | 'EUR' | 'GBP';
    };
    comparables: Array<{
      source: string;
      price: number;
      date: Date;
      condition: string;
      url?: string;
      similarity: number;
    }>;
    trends: {
      demand: 'low' | 'medium' | 'high';
      priceDirection: 'declining' | 'stable' | 'rising';
      seasonality?: string;
      collectibility: number; // 0-100
    };
    investment: {
      grade: 'poor' | 'fair' | 'good' | 'excellent';
      appreciation: number; // annual percentage
      liquidity: 'low' | 'medium' | 'high';
      risk: 'low' | 'medium' | 'high';
    };
  };

  // Photography and Visual
  photography: {
    images: Array<{
      url: string;
      type: 'main' | 'detail' | 'back' | 'side' | 'clasp' | 'hallmark' | 'wear';
      quality: number; // 0-100
      lighting: 'natural' | 'studio' | 'mixed';
      background: 'white' | 'black' | 'neutral' | 'colored' | 'textured';
      angle: string;
      focus: 'sharp' | 'soft' | 'blurred';
      resolution: {
        width: number;
        height: number;
        dpi: number;
      };
    }>;
    colorAccuracy: number; // 0-100
    detailVisibility: number; // 0-100
    overallQuality: number; // 0-100
    recommendations: string[];
  };

  // Provenance and History
  provenance: {
    origin?: {
      country: string;
      region?: string;
      maker?: string;
      workshop?: string;
      period?: string;
    };
    ownership: Array<{
      owner: string;
      period: string;
      documentation?: string;
      significance?: string;
    }>;
    exhibitions?: Array<{
      venue: string;
      date: Date;
      catalog?: string;
    }>;
    publications?: Array<{
      title: string;
      author: string;
      date: Date;
      page?: string;
    }>;
    documentation: {
      certificates: string[];
      appraisals: string[];
      receipts: string[];
      insurance: string[];
    };
  };

  // Care and Maintenance
  care: {
    instructions: string[];
    warnings: string[];
    cleaning: {
      recommended: string[];
      avoid: string[];
      frequency: string;
      professional: boolean;
    };
    storage: {
      environment: string;
      container: string;
      separation: boolean;
      climate: string;
    };
    handling: {
      precautions: string[];
      restrictions: string[];
    };
  };

  // SEO and Marketing
  seo: {
    title: string;
    description: string;
    keywords: string[];
    tags: string[];
    categories: string[];
    attributes: Record<string, string>;
    schema: any; // JSON-LD schema
    score: number; // 0-100
  };

  // Technical Metadata
  technical: {
    extraction: {
      method: 'ai' | 'manual' | 'hybrid';
      confidence: number;
      timestamp: Date;
      version: string;
      models: string[];
    };
    validation: {
      automated: boolean;
      manual: boolean;
      expert: boolean;
      confidence: number;
      flags: string[];
    };
    processing: {
      duration: number; // milliseconds
      resources: {
        gpu: number;
        cpu: number;
        memory: number;
      };
      costs: {
        total: number;
        breakdown: Record<string, number>;
      };
    };
  };
}

export class MetadataExtractor {
  private static instance: MetadataExtractor;

  static getInstance(): MetadataExtractor {
    if (!MetadataExtractor.instance) {
      MetadataExtractor.instance = new MetadataExtractor();
    }
    return MetadataExtractor.instance;
  }

  async extractMetadata(
    aiAnalysis: AdvancedAIAnalysis,
    imageFiles: File[],
    userInput?: Partial<JewelryMetadata>,
    options: {
      includeProvenance?: boolean;
      includeMarketAnalysis?: boolean;
      includeCareinstructions?: boolean;
      validateWithExperts?: boolean;
    } = {}
  ): Promise<JewelryMetadata> {
    const startTime = Date.now();

    try {
      // Extract basic information
      const basic = this.extractBasicInfo(aiAnalysis, userInput);

      // Extract physical properties
      const physical = this.extractPhysicalProperties(aiAnalysis, userInput);

      // Extract materials and composition
      const materials = this.extractMaterials(aiAnalysis, userInput);

      // Extract gemstones
      const gemstones = this.extractGemstones(aiAnalysis, userInput);

      // Extract condition and authenticity
      const condition = this.extractCondition(aiAnalysis, userInput);

      // Extract style and design
      const style = this.extractStyle(aiAnalysis, userInput);

      // Extract market information
      const market = options.includeMarketAnalysis ? 
        this.extractMarketInfo(aiAnalysis, userInput) : 
        this.getDefaultMarketInfo();

      // Extract photography metadata
      const photography = this.extractPhotographyMetadata(imageFiles, aiAnalysis);

      // Extract provenance (if requested)
      const provenance = options.includeProvenance ? 
        this.extractProvenance(aiAnalysis, userInput) : 
        this.getDefaultProvenance();

      // Generate care instructions
      const care = options.includeCareinstructions ? 
        this.generateCareInstructions(materials, gemstones, condition) : 
        this.getDefaultCareInstructions();

      // Generate SEO metadata
      const seo = this.generateSEOMetadata(basic, materials, gemstones, style);

      // Create technical metadata
      const technical = this.createTechnicalMetadata(aiAnalysis, startTime);

      const metadata: JewelryMetadata = {
        basic,
        physical,
        materials,
        gemstones,
        condition,
        style,
        market,
        photography,
        provenance,
        care,
        seo,
        technical
      };

      // Validate metadata if requested
      if (options.validateWithExperts) {
        await this.validateWithExperts(metadata);
      }

      return metadata;

    } catch (error) {
      console.error('Metadata extraction failed:', error);
      throw new Error(`Metadata extraction failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private extractBasicInfo(aiAnalysis: AdvancedAIAnalysis, userInput?: Partial<JewelryMetadata>) {
    return {
      id: aiAnalysis.id,
      title: aiAnalysis.integrated.title,
      category: aiAnalysis.integrated.category,
      subcategory: aiAnalysis.integrated.subcategory,
      brand: aiAnalysis.integrated.brand.detected ? aiAnalysis.integrated.brand.name : undefined,
      model: userInput?.basic?.model,
      sku: userInput?.basic?.sku || this.generateSKU(aiAnalysis),
      upc: userInput?.basic?.upc,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  private extractPhysicalProperties(aiAnalysis: AdvancedAIAnalysis, userInput?: Partial<JewelryMetadata>) {
    const category = aiAnalysis.integrated.category;
    
    // Estimate dimensions based on category and SAM segmentation
    const primaryObject = aiAnalysis.sam.primaryObject;
    const estimatedDimensions = this.estimateDimensions(category, primaryObject);

    return {
      dimensions: {
        ...estimatedDimensions,
        ...userInput?.physical?.dimensions
      },
      weight: {
        estimated: this.estimateWeight(category, estimatedDimensions),
        unit: 'grams' as const,
        ...userInput?.physical?.weight
      },
      size: this.estimateSize(category, estimatedDimensions, userInput?.physical?.size),
      color: this.extractColor(aiAnalysis.clip.visualConcepts, userInput?.physical?.color)
    };
  }

  private extractMaterials(aiAnalysis: AdvancedAIAnalysis, userInput?: Partial<JewelryMetadata>) {
    const aiMaterials = aiAnalysis.integrated.materials;
    
    const primary = aiMaterials.map(material => ({
      material: material.material,
      purity: material.purity,
      percentage: undefined,
      hallmarks: [],
      testing: {
        method: 'ai_visual_analysis',
        result: `${material.confidence * 100}% confidence`,
        confidence: material.confidence
      }
    }));

    return {
      primary,
      secondary: userInput?.materials?.secondary,
      plating: this.detectPlating(aiAnalysis.clip.visualConcepts, userInput?.materials?.plating)
    };
  }

  private extractGemstones(aiAnalysis: AdvancedAIAnalysis, userInput?: Partial<JewelryMetadata>) {
    const aiGemstones = aiAnalysis.integrated.gemstones;
    
    return aiGemstones.map((gemstone, index) => ({
      stone: gemstone.stone,
      type: 'unknown' as const,
      cut: gemstone.cut,
      shape: undefined,
      size: undefined,
      clarity: gemstone.clarity,
      color: undefined,
      treatment: [],
      setting: undefined,
      quantity: 1,
      position: `position_${index + 1}`,
      certification: undefined
    }));
  }

  private extractCondition(aiAnalysis: AdvancedAIAnalysis, userInput?: Partial<JewelryMetadata>) {
    const aiCondition = aiAnalysis.integrated.condition;
    const aiAuthenticity = aiAnalysis.integrated.authenticity;

    return {
      overall: aiCondition.overall as any,
      score: aiCondition.score,
      details: {
        wear: this.assessWear(aiCondition.score),
        scratches: this.assessScratches(aiCondition.details),
        dents: 'none' as const,
        tarnish: this.assessTarnish(aiAnalysis.clip.visualConcepts),
        missing: [],
        repairs: [],
        modifications: []
      },
      functionality: {
        clasp: 'good' as const,
        hinge: 'good' as const,
        chain: 'good' as const
      },
      authenticity: {
        verified: aiAuthenticity.verified,
        confidence: aiAuthenticity.confidence,
        indicators: aiAuthenticity.indicators,
        concerns: [],
        testing: [{
          method: 'ai_analysis',
          result: aiAuthenticity.verified ? 'authentic' : 'uncertain',
          date: new Date()
        }]
      }
    };
  }

  private extractStyle(aiAnalysis: AdvancedAIAnalysis, userInput?: Partial<JewelryMetadata>) {
    const aiStyle = aiAnalysis.integrated.style;
    
    return {
      era: aiStyle.era,
      period: this.mapEraToPeriod(aiStyle.era),
      design: aiStyle.design,
      aesthetic: aiStyle.aesthetic,
      motif: this.extractMotifs(aiAnalysis.clip.visualConcepts),
      technique: this.extractTechniques(aiAnalysis.clip.visualConcepts),
      inspiration: undefined,
      rarity: this.assessRarity(aiAnalysis.integrated.marketAnalysis)
    };
  }

  private extractMarketInfo(aiAnalysis: AdvancedAIAnalysis, userInput?: Partial<JewelryMetadata>) {
    const aiMarket = aiAnalysis.integrated.marketAnalysis;
    const aiPrice = aiAnalysis.integrated.price;

    return {
      estimatedValue: {
        retail: aiPrice.recommended,
        wholesale: Math.round(aiPrice.recommended * 0.6),
        auction: Math.round(aiPrice.recommended * 0.8),
        insurance: Math.round(aiPrice.recommended * 1.3),
        currency: 'USD' as const
      },
      comparables: aiMarket.priceHistory.map(item => ({
        source: item.source,
        price: item.price,
        date: new Date(item.date),
        condition: 'unknown',
        similarity: 0.8
      })),
      trends: {
        demand: aiMarket.demandLevel,
        priceDirection: 'stable' as const,
        collectibility: this.assessCollectibility(aiAnalysis.integrated.style)
      },
      investment: {
        grade: this.assessInvestmentGrade(aiPrice.confidence, aiMarket.demandLevel),
        appreciation: 3, // 3% annual
        liquidity: 'medium' as const,
        risk: 'medium' as const
      }
    };
  }

  private extractPhotographyMetadata(imageFiles: File[], aiAnalysis: AdvancedAIAnalysis) {
    return {
      images: imageFiles.map((file, index) => ({
        url: URL.createObjectURL(file),
        type: index === 0 ? 'main' as const : 'detail' as const,
        quality: 85,
        lighting: 'natural' as const,
        background: 'white' as const,
        angle: 'front',
        focus: 'sharp' as const,
        resolution: {
          width: 1200,
          height: 1200,
          dpi: 72
        }
      })),
      colorAccuracy: 85,
      detailVisibility: 90,
      overallQuality: 87,
      recommendations: [
        'Consider additional detail shots',
        'Ensure consistent lighting',
        'Include scale reference'
      ]
    };
  }

  private extractProvenance(aiAnalysis: AdvancedAIAnalysis, userInput?: Partial<JewelryMetadata>) {
    return {
      origin: {
        country: 'Unknown',
        period: aiAnalysis.integrated.style.era
      },
      ownership: [],
      documentation: {
        certificates: [],
        appraisals: [],
        receipts: [],
        insurance: []
      }
    };
  }

  private generateCareInstructions(materials: any, gemstones: any[], condition: any) {
    const instructions = new Set<string>();
    
    // General care
    instructions.add('Store in a cool, dry place');
    instructions.add('Avoid exposure to chemicals and perfumes');
    instructions.add('Clean gently with appropriate methods');

    // Material-specific care
    materials.primary.forEach((material: any) => {
      switch (material.material.toLowerCase()) {
        case 'gold':
          instructions.add('Clean with warm soapy water and soft brush');
          break;
        case 'silver':
          instructions.add('Use silver polish to prevent tarnishing');
          instructions.add('Store in anti-tarnish bags');
          break;
        case 'pearl':
          instructions.add('Wipe with soft, damp cloth after wearing');
          instructions.add('Store separately to prevent scratching');
          break;
      }
    });

    return {
      instructions: Array.from(instructions),
      warnings: [
        'Avoid ultrasonic cleaners unless specifically recommended',
        'Remove before swimming or showering',
        'Handle with care to prevent damage'
      ],
      cleaning: {
        recommended: ['Soft cloth', 'Mild soap solution'],
        avoid: ['Harsh chemicals', 'Abrasive materials'],
        frequency: 'As needed',
        professional: condition.score < 70
      },
      storage: {
        environment: 'Cool, dry place',
        container: 'Jewelry box or soft pouch',
        separation: true,
        climate: 'Stable temperature and humidity'
      },
      handling: {
        precautions: ['Handle by edges', 'Avoid dropping'],
        restrictions: ['No rough handling', 'Avoid extreme temperatures']
      }
    };
  }

  private generateSEOMetadata(basic: any, materials: any, gemstones: any[], style: any) {
    const keywords = [
      basic.category,
      basic.subcategory,
      style.era,
      style.design,
      'vintage jewelry',
      'pre-owned jewelry',
      ...materials.primary.map((m: any) => m.material),
      ...gemstones.map(g => g.stone)
    ].filter(Boolean);

    const title = `${style.era} ${basic.category} - ${materials.primary[0]?.material || 'Mixed Materials'} - Vintage Jewelry`;
    const description = `Beautiful ${style.era} ${basic.category} featuring ${materials.primary.map((m: any) => m.material).join(', ')}. Pre-owned vintage jewelry in excellent condition.`;

    return {
      title: title.substring(0, 60),
      description: description.substring(0, 160),
      keywords: [...new Set(keywords)],
      tags: keywords.slice(0, 10),
      categories: [basic.category, basic.subcategory],
      attributes: {
        era: style.era,
        material: materials.primary[0]?.material || 'mixed',
        condition: 'pre-owned'
      },
      schema: this.generateJSONLDSchema(basic, materials, style),
      score: this.calculateSEOScore(title, description, keywords)
    };
  }

  private createTechnicalMetadata(aiAnalysis: AdvancedAIAnalysis, startTime: number) {
    return {
      extraction: {
        method: 'ai' as const,
        confidence: aiAnalysis.integrated.qualityMetrics.aiConfidence,
        timestamp: new Date(),
        version: '1.0.0',
        models: [
          aiAnalysis.processing.modelVersions.yolo,
          aiAnalysis.processing.modelVersions.clip,
          aiAnalysis.processing.modelVersions.langchain
        ]
      },
      validation: {
        automated: true,
        manual: false,
        expert: false,
        confidence: aiAnalysis.integrated.qualityMetrics.overallScore / 100,
        flags: aiAnalysis.processing.flags
      },
      processing: {
        duration: Date.now() - startTime,
        resources: {
          gpu: aiAnalysis.processing.gpuTime,
          cpu: aiAnalysis.processing.totalTime - aiAnalysis.processing.gpuTime,
          memory: 0
        },
        costs: {
          total: aiAnalysis.processing.resourceUsage.modalCredits * 0.01,
          breakdown: {
            modal: aiAnalysis.processing.resourceUsage.modalCredits * 0.01,
            jina: aiAnalysis.processing.resourceUsage.jinaTokens * 0.0001,
            weaviate: aiAnalysis.processing.resourceUsage.weaviateQueries * 0.001
          }
        }
      }
    };
  }

  // Helper methods
  private generateSKU(aiAnalysis: AdvancedAIAnalysis): string {
    const category = aiAnalysis.integrated.category.substring(0, 3).toUpperCase();
    const material = aiAnalysis.integrated.materials[0]?.material.substring(0, 2).toUpperCase() || 'XX';
    const timestamp = Date.now().toString().slice(-6);
    return `${category}-${material}-${timestamp}`;
  }

  private estimateDimensions(category: string, primaryObject: any) {
    // Estimate based on category and object detection
    const defaults = {
      ring: { diameter: 18, height: 3 },
      necklace: { length: 450, width: 5 },
      bracelet: { length: 180, width: 8 },
      earrings: { length: 25, width: 15 },
      brooch: { length: 40, width: 30 }
    };

    return defaults[category as keyof typeof defaults] || { length: 30, width: 20, height: 5 };
  }

  private estimateWeight(category: string, dimensions: any): number {
    // Rough weight estimation based on category and dimensions
    const densityFactors = {
      ring: 0.1,
      necklace: 0.05,
      bracelet: 0.08,
      earrings: 0.03,
      brooch: 0.06
    };

    const factor = densityFactors[category as keyof typeof densityFactors] || 0.05;
    const volume = (dimensions.length || 20) * (dimensions.width || 20) * (dimensions.height || 5);
    return Math.round(volume * factor / 100);
  }

  private estimateSize(category: string, dimensions: any, userSize?: any) {
    if (userSize) return userSize;

    switch (category) {
      case 'ring':
        return { ring: '7' }; // Average US size
      case 'bracelet':
        return { bracelet: '7.5"' };
      case 'necklace':
        return { necklace: '18"' };
      default:
        return undefined;
    }
  }

  private extractColor(visualConcepts: any[], userColor?: any) {
    if (userColor) return userColor;

    // Extract color from visual concepts
    const colorConcepts = visualConcepts.filter(concept => 
      ['gold', 'silver', 'bronze', 'copper', 'black', 'white'].some(color => 
        concept.concept.toLowerCase().includes(color)
      )
    );

    const primaryColor = colorConcepts[0]?.concept || 'mixed';

    return {
      primary: primaryColor,
      finish: 'polished' as const
    };
  }

  private detectPlating(visualConcepts: any[], userPlating?: any) {
    if (userPlating) return userPlating;

    const hasGoldTone = visualConcepts.some(concept => 
      concept.concept.toLowerCase().includes('gold') && concept.confidence > 0.7
    );

    if (hasGoldTone) {
      return {
        material: 'gold',
        quality: 'good' as const
      };
    }

    return undefined;
  }

  private assessWear(score: number): 'none' | 'minimal' | 'moderate' | 'heavy' {
    if (score > 90) return 'none';
    if (score > 75) return 'minimal';
    if (score > 60) return 'moderate';
    return 'heavy';
  }

  private assessScratches(details: string[]): 'none' | 'light' | 'moderate' | 'heavy' {
    const scratchIndicators = details.filter(detail => 
      detail.toLowerCase().includes('scratch')
    );
    
    if (scratchIndicators.length === 0) return 'none';
    if (scratchIndicators.length <= 2) return 'light';
    if (scratchIndicators.length <= 4) return 'moderate';
    return 'heavy';
  }

  private assessTarnish(visualConcepts: any[]): 'none' | 'light' | 'moderate' | 'heavy' {
    const tarnishIndicators = visualConcepts.filter(concept => 
      concept.concept.toLowerCase().includes('tarnish') || 
      concept.concept.toLowerCase().includes('oxidized')
    );

    if (tarnishIndicators.length === 0) return 'none';
    return 'light';
  }

  private mapEraToPeriod(era: string): string {
    const eraPeriodMap: Record<string, string> = {
      'victorian': '1837-1901',
      'edwardian': '1901-1915',
      'art-deco': '1920-1935',
      'retro': '1935-1950',
      'mid-century': '1950-1970',
      'contemporary': '1970-present'
    };

    return eraPeriodMap[era.toLowerCase()] || 'unknown';
  }

  private extractMotifs(visualConcepts: any[]): string[] {
    const motifKeywords = ['floral', 'geometric', 'animal', 'nature', 'abstract', 'religious'];
    
    return visualConcepts
      .filter(concept => motifKeywords.some(keyword => 
        concept.concept.toLowerCase().includes(keyword)
      ))
      .map(concept => concept.concept)
      .slice(0, 3);
  }

  private extractTechniques(visualConcepts: any[]): string[] {
    const techniqueKeywords = ['engraved', 'filigree', 'repoussé', 'granulation', 'enameled'];
    
    return visualConcepts
      .filter(concept => techniqueKeywords.some(keyword => 
        concept.concept.toLowerCase().includes(keyword)
      ))
      .map(concept => concept.concept)
      .slice(0, 3);
  }

  private assessRarity(marketAnalysis: any): 'common' | 'uncommon' | 'rare' | 'very-rare' | 'unique' {
    if (marketAnalysis.competitorCount > 50) return 'common';
    if (marketAnalysis.competitorCount > 20) return 'uncommon';
    if (marketAnalysis.competitorCount > 5) return 'rare';
    if (marketAnalysis.competitorCount > 1) return 'very-rare';
    return 'unique';
  }

  private assessCollectibility(style: any): number {
    // Score based on era and design
    const eraScores: Record<string, number> = {
      'victorian': 90,
      'edwardian': 85,
      'art-deco': 95,
      'retro': 75,
      'mid-century': 70,
      'contemporary': 50
    };

    return eraScores[style.era.toLowerCase()] || 60;
  }

  private assessInvestmentGrade(confidence: number, demand: string): 'poor' | 'fair' | 'good' | 'excellent' {
    if (confidence > 0.9 && demand === 'high') return 'excellent';
    if (confidence > 0.8 && demand !== 'low') return 'good';
    if (confidence > 0.6) return 'fair';
    return 'poor';
  }

  private generateJSONLDSchema(basic: any, materials: any, style: any) {
    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      'name': basic.title,
      'category': basic.category,
      'brand': basic.brand ? { '@type': 'Brand', 'name': basic.brand } : undefined,
      'material': materials.primary.map((m: any) => m.material),
      'productionDate': style.era,
      'condition': 'UsedCondition'
    };
  }

  private calculateSEOScore(title: string, description: string, keywords: string[]): number {
    let score = 0;

    // Title optimization
    if (title.length >= 30 && title.length <= 60) score += 25;
    if (keywords.some(keyword => title.toLowerCase().includes(keyword.toLowerCase()))) score += 25;

    // Description optimization
    if (description.length >= 120 && description.length <= 160) score += 25;
    if (keywords.filter(keyword => description.toLowerCase().includes(keyword.toLowerCase())).length >= 2) score += 25;

    return Math.min(score, 100);
  }

  private getDefaultMarketInfo() {
    return {
      estimatedValue: {
        retail: 0,
        wholesale: 0,
        auction: 0,
        insurance: 0,
        currency: 'USD' as const
      },
      comparables: [],
      trends: {
        demand: 'medium' as const,
        priceDirection: 'stable' as const,
        collectibility: 50
      },
      investment: {
        grade: 'fair' as const,
        appreciation: 2,
        liquidity: 'medium' as const,
        risk: 'medium' as const
      }
    };
  }

  private getDefaultProvenance() {
    return {
      origin: undefined,
      ownership: [],
      documentation: {
        certificates: [],
        appraisals: [],
        receipts: [],
        insurance: []
      }
    };
  }

  private getDefaultCareInstructions() {
    return {
      instructions: ['Handle with care', 'Store properly'],
      warnings: ['Avoid harsh chemicals'],
      cleaning: {
        recommended: ['Soft cloth'],
        avoid: ['Abrasive materials'],
        frequency: 'As needed',
        professional: false
      },
      storage: {
        environment: 'Cool, dry place',
        container: 'Jewelry box',
        separation: true,
        climate: 'Stable'
      },
      handling: {
        precautions: ['Handle gently'],
        restrictions: ['Avoid dropping']
      }
    };
  }

  private async validateWithExperts(metadata: JewelryMetadata) {
    // Implementation for expert validation
    // This would integrate with expert review systems
    console.log('Expert validation requested for:', metadata.basic.id);
  }
}

export const metadataExtractor = MetadataExtractor.getInstance();

