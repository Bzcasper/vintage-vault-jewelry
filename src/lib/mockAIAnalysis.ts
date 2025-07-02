// Mock AI Analysis Generator for Jewelry
import { JewelryAnalysis } from './imageProcessing';

interface JewelryTemplate {
  categories: string[];
  materials: string[];
  styles: string[];
  eras: string[];
  brands: string[];
  gemstones: string[];
  metalTypes: string[];
  conditions: JewelryAnalysis['condition'][];
  priceRanges: { min: number; max: number; category: string }[];
}

const jewelryData: JewelryTemplate = {
  categories: ['necklace', 'ring', 'bracelet', 'earrings', 'brooch', 'pendant', 'watch', 'vintage', 'costume', 'designer'],
  materials: ['Sterling Silver', 'Gold Plated', '14K Gold', '18K Gold', 'Platinum', 'Silver', 'Brass', 'Copper', 'Stainless Steel', 'Mixed Metals'],
  styles: ['Art Deco', 'Victorian', 'Edwardian', 'Mid-Century Modern', 'Contemporary', 'Bohemian', 'Classic', 'Vintage', 'Retro', 'Minimalist'],
  eras: ['1920s', '1930s', '1940s', '1950s', '1960s', '1970s', '1980s', '1990s', 'Victorian', 'Art Deco', 'Mid-Century', 'Contemporary'],
  brands: ['Tiffany & Co.', 'Cartier', 'Pandora', 'Swarovski', 'David Yurman', 'Kate Spade', 'Coach', 'Vintage Designer', 'Artisan Made', 'Unknown Designer'],
  gemstones: ['Diamond', 'Ruby', 'Sapphire', 'Emerald', 'Pearl', 'Opal', 'Amethyst', 'Topaz', 'Garnet', 'Crystal', 'Cubic Zirconia', 'Rhinestone'],
  metalTypes: ['Sterling Silver', '14K Gold', '18K Gold', 'Gold Plated', 'Silver Plated', 'Brass', 'Copper', 'Platinum', 'White Gold', 'Rose Gold'],
  conditions: ['excellent', 'very-good', 'good', 'fair'],
  priceRanges: [
    { min: 15, max: 45, category: 'costume' },
    { min: 35, max: 85, category: 'vintage' },
    { min: 50, max: 150, category: 'necklace' },
    { min: 25, max: 75, category: 'bracelet' },
    { min: 20, max: 60, category: 'earrings' },
    { min: 40, max: 120, category: 'ring' },
    { min: 30, max: 90, category: 'brooch' },
    { min: 25, max: 70, category: 'pendant' },
    { min: 80, max: 300, category: 'watch' },
    { min: 100, max: 500, category: 'designer' }
  ]
};

const colors = [
  'Silver', 'Gold', 'Rose Gold', 'Black', 'White', 'Blue', 'Green', 'Red', 'Purple', 'Pink', 'Brown', 'Clear', 'Multi-colored'
];

const finishes = [
  'Polished', 'Matte', 'Brushed', 'Oxidized', 'Antiqued', 'Satin', 'Hammered', 'Textured'
];

const patterns = [
  'Solid', 'Filigree', 'Engraved', 'Geometric', 'Floral', 'Abstract', 'Chain Link', 'Mesh', 'Twisted', 'Braided'
];

export class MockAIAnalyzer {
  /**
   * Generate realistic mock analysis for a jewelry image
   */
  static generateAnalysis(filename: string, fileSize: number): JewelryAnalysis {
    // Use filename and size to create deterministic but varied results
    const seed = this.createSeed(filename, fileSize);
    
    // Determine primary category based on filename hints
    const category = this.extractCategoryFromFilename(filename) || this.getRandomElement(jewelryData.categories, seed);
    
    // Generate consistent data based on category
    const priceRange = jewelryData.priceRanges.find(p => p.category === category) || jewelryData.priceRanges[0];
    const estimatedPrice = this.generatePrice(priceRange.min, priceRange.max, seed);
    
    const materials = this.selectRandomElements(jewelryData.materials, 1, 3, seed);
    const condition = this.getRandomElement(jewelryData.conditions, seed + 1);
    const style = this.getRandomElement(jewelryData.styles, seed + 2);
    const era = Math.random() > 0.3 ? this.getRandomElement(jewelryData.eras, seed + 3) : undefined;
    const brand = Math.random() > 0.7 ? this.getRandomElement(jewelryData.brands, seed + 4) : undefined;
    
    // Generate title and description
    const title = this.generateTitle(category, materials[0], style, brand);
    const description = this.generateDescription(category, materials, style, condition, era);
    
    // Generate specifications
    const gemstones = Math.random() > 0.4 ? this.selectRandomElements(jewelryData.gemstones, 1, 2, seed + 5) : undefined;
    const metalType = materials.find(m => m.includes('Gold') || m.includes('Silver') || m.includes('Platinum')) || materials[0];
    
    // Generate color and texture analysis
    const dominantColors = this.selectRandomElements(colors, 1, 3, seed + 6);
    const surfaceFinish = this.getRandomElement(finishes, seed + 7);
    const pattern = this.getRandomElement(patterns, seed + 8);
    
    // Generate keywords and care instructions
    const keywords = this.generateKeywords(category, materials, style, era);
    const careInstructions = this.generateCareInstructions(materials, gemstones);
    
    // Calculate confidence based on various factors
    const confidence = this.calculateConfidence(filename, fileSize, category);
    
    return {
      title,
      description,
      category: category as JewelryAnalysis['category'],
      era,
      brand,
      materials,
      condition,
      estimatedPrice,
      careInstructions,
      keywords,
      specifications: {
        type: category,
        style,
        gemstones,
        metalType,
        colorAnalysis: {
          dominantColors,
          colorHarmony: this.generateColorHarmony(dominantColors),
          brightness: this.getRandomElement(['bright', 'medium', 'subtle'], seed + 9),
          saturation: this.getRandomElement(['high', 'medium', 'low'], seed + 10)
        },
        textureAnalysis: {
          surfaceFinish,
          pattern
        }
      },
      confidence,
      seoData: {
        metaTitle: title,
        metaDescription: description.substring(0, 160),
        keywords: keywords.slice(0, 10),
        tags: [...keywords.slice(0, 5), category, ...materials.slice(0, 2)]
      }
    };
  }

  /**
   * Create a deterministic seed from filename and file size
   */
  private static createSeed(filename: string, fileSize: number): number {
    let hash = 0;
    const str = filename + fileSize.toString();
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Extract category hints from filename
   */
  private static extractCategoryFromFilename(filename: string): string | null {
    const lower = filename.toLowerCase();
    
    if (lower.includes('necklace') || lower.includes('chain')) return 'necklace';
    if (lower.includes('ring')) return 'ring';
    if (lower.includes('bracelet') || lower.includes('bangle')) return 'bracelet';
    if (lower.includes('earring')) return 'earrings';
    if (lower.includes('brooch') || lower.includes('pin')) return 'brooch';
    if (lower.includes('pendant')) return 'pendant';
    if (lower.includes('watch')) return 'watch';
    if (lower.includes('vintage') || lower.includes('antique')) return 'vintage';
    if (lower.includes('costume')) return 'costume';
    if (lower.includes('designer')) return 'designer';
    
    return null;
  }

  /**
   * Get random element with deterministic seed
   */
  private static getRandomElement<T>(array: T[], seed: number): T {
    return array[seed % array.length];
  }

  /**
   * Select multiple random elements
   */
  private static selectRandomElements<T>(array: T[], min: number, max: number, seed: number): T[] {
    const count = min + (seed % (max - min + 1));
    const selected: T[] = [];
    const shuffled = [...array].sort(() => 0.5 - ((seed * 9301 + 49297) % 233280) / 233280);
    
    for (let i = 0; i < Math.min(count, array.length); i++) {
      selected.push(shuffled[i]);
    }
    
    return selected;
  }

  /**
   * Generate realistic price
   */
  private static generatePrice(min: number, max: number, seed: number): number {
    const range = max - min;
    const price = min + (seed % range);
    
    // Round to reasonable increments
    if (price < 50) return Math.round(price / 5) * 5;
    if (price < 100) return Math.round(price / 10) * 10;
    return Math.round(price / 25) * 25;
  }

  /**
   * Generate jewelry title
   */
  private static generateTitle(category: string, material: string, style: string, brand?: string): string {
    const adjectives = ['Beautiful', 'Stunning', 'Elegant', 'Vintage', 'Classic', 'Exquisite', 'Charming', 'Lovely'];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    
    if (brand && brand !== 'Unknown Designer') {
      return `${brand} ${style} ${category.charAt(0).toUpperCase() + category.slice(1)}`;
    }
    
    return `${adj} ${material} ${style} ${category.charAt(0).toUpperCase() + category.slice(1)}`;
  }

  /**
   * Generate detailed description
   */
  private static generateDescription(
    category: string, 
    materials: string[], 
    style: string, 
    condition: string, 
    era?: string
  ): string {
    const descriptions = [
      `This ${style.toLowerCase()} ${category} showcases exceptional craftsmanship and timeless appeal.`,
      `A stunning piece that perfectly captures the essence of ${era ? era + ' ' : ''}elegance.`,
      `Crafted from ${materials.join(' and ').toLowerCase()}, this ${category} is both beautiful and durable.`,
      `The intricate details and quality construction make this a standout addition to any jewelry collection.`,
      `Perfect for both everyday wear and special occasions, this piece offers versatility and style.`,
      `The ${condition} condition ensures that this ${category} will be treasured for years to come.`
    ];

    // Select 2-3 random description parts
    const selectedDescs = descriptions.sort(() => 0.5 - Math.random()).slice(0, 3);
    return selectedDescs.join(' ');
  }

  /**
   * Generate relevant keywords
   */
  private static generateKeywords(category: string, materials: string[], style: string, era?: string): string[] {
    const baseKeywords = [
      'jewelry', 'vintage', 'antique', 'collectible', 'handmade', 'unique', 'elegant', 'stylish'
    ];
    
    const keywords = [
      ...baseKeywords,
      category,
      style.toLowerCase(),
      ...materials.map(m => m.toLowerCase()),
    ];
    
    if (era) {
      keywords.push(era.toLowerCase(), 'period', 'era');
    }
    
    // Remove duplicates and return
    return [...new Set(keywords)];
  }

  /**
   * Generate care instructions based on materials
   */
  private static generateCareInstructions(materials: string[], gemstones?: string[]): string[] {
    const instructions = [
      'Store in a dry place away from direct sunlight',
      'Clean gently with a soft, dry cloth'
    ];

    if (materials.some(m => m.includes('Silver'))) {
      instructions.push('Polish with silver cleaning cloth to maintain shine');
      instructions.push('Store in anti-tarnish pouch when not wearing');
    }

    if (materials.some(m => m.includes('Gold'))) {
      instructions.push('Clean with mild soap and warm water if needed');
    }

    if (gemstones) {
      instructions.push('Avoid exposure to harsh chemicals and perfumes');
      if (gemstones.includes('Pearl')) {
        instructions.push('Wipe pearls after wearing to remove oils and acids');
      }
    }

    instructions.push('Handle with care to prevent damage');
    
    return instructions;
  }

  /**
   * Generate color harmony description
   */
  private static generateColorHarmony(colors: string[]): string {
    if (colors.length === 1) return 'monochromatic';
    if (colors.includes('Gold') && colors.includes('Silver')) return 'mixed metals';
    if (colors.length === 2) return 'complementary';
    return 'multi-tonal';
  }

  /**
   * Calculate confidence score based on image characteristics
   */
  private static calculateConfidence(filename: string, fileSize: number): number {
    let confidence = 0.7; // Base confidence
    
    // Higher confidence for larger files (better quality)
    if (fileSize > 2 * 1024 * 1024) confidence += 0.1; // > 2MB
    if (fileSize > 5 * 1024 * 1024) confidence += 0.1; // > 5MB
    
    // Higher confidence if filename suggests jewelry
    const jewelryKeywords = ['jewelry', 'necklace', 'ring', 'bracelet', 'earring', 'vintage', 'gold', 'silver'];
    const hasKeyword = jewelryKeywords.some(keyword => filename.toLowerCase().includes(keyword));
    if (hasKeyword) confidence += 0.15;
    
    // Higher confidence for common image formats
    if (filename.toLowerCase().match(/\.(jpg|jpeg|png)$/)) confidence += 0.05;
    
    return Math.min(0.95, Math.max(0.5, confidence));
  }

  /**
   * Generate batch analysis for multiple files
   */
  static generateBatchAnalysis(files: { filename: string; fileSize: number }[]): JewelryAnalysis[] {
    return files.map(file => this.generateAnalysis(file.filename, file.fileSize));
  }

  /**
   * Simulate processing time based on file size and processing mode
   */
  static calculateProcessingTime(fileSize: number, processingMode: 'standard' | 'advanced' | 'premium'): number {
    const baseTime = {
      standard: 1000,  // 1 second
      advanced: 2000,  // 2 seconds  
      premium: 3000    // 3 seconds
    };

    const sizeMultiplier = Math.max(1, fileSize / (1024 * 1024)); // File size in MB
    return baseTime[processingMode] * sizeMultiplier;
  }
}

export default MockAIAnalyzer;