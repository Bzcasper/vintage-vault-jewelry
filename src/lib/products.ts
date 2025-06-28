'use client';

import { supabase } from './supabase';

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  original_price?: number;
  category: 'vintage' | 'costume' | 'designer';
  subcategory: string;
  condition: 'excellent' | 'very_good' | 'good' | 'fair';
  material?: string;
  brand?: string;
  era?: string;
  size?: string;
  weight?: string;
  images: string[];
  seller_id: string;
  seller_name?: string;
  is_featured: boolean;
  is_sold: boolean;
  rating?: number;
  reviews_count?: number;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface ProductFilters {
  category?: string[];
  priceRange?: [number, number];
  condition?: string[];
  material?: string[];
  brand?: string[];
  era?: string[];
  inStock?: boolean;
  featured?: boolean;
}

export interface SearchParams {
  query?: string;
  filters?: ProductFilters;
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'oldest' | 'rating' | 'popular';
  page?: number;
  limit?: number;
}

// Mock product data for development
export const mockProducts: Product[] = [
  {
    id: '1',
    title: 'Vintage Art Deco Diamond Ring',
    description: 'Stunning 1920s Art Deco diamond ring featuring a brilliant cut center stone surrounded by intricate geometric patterns. This piece exemplifies the elegance and sophistication of the Jazz Age.',
    price: 450,
    original_price: 650,
    category: 'vintage',
    subcategory: 'rings',
    condition: 'excellent',
    material: 'White Gold, Diamond',
    brand: 'Tiffany & Co.',
    era: '1920s',
    size: '6.5',
    weight: '3.2g',
    images: ['/api/placeholder/400/400', '/api/placeholder/400/400', '/api/placeholder/400/400'],
    seller_id: 'seller1',
    seller_name: 'Vintage Treasures Co.',
    is_featured: true,
    is_sold: false,
    rating: 4.8,
    reviews_count: 24,
    tags: ['art-deco', 'diamond', 'engagement', 'luxury'],
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    title: 'Pearl Statement Necklace',
    description: 'Elegant multi-strand pearl necklace perfect for special occasions. Features lustrous cultured pearls with a vintage-inspired clasp.',
    price: 125,
    category: 'costume',
    subcategory: 'necklaces',
    condition: 'very_good',
    material: 'Cultured Pearls, Silver',
    era: '1960s',
    images: ['/api/placeholder/400/400', '/api/placeholder/400/400'],
    seller_id: 'seller2',
    seller_name: 'Pearl Paradise',
    is_featured: true,
    is_sold: false,
    rating: 4.9,
    reviews_count: 18,
    tags: ['pearls', 'statement', 'formal', 'classic'],
    created_at: '2024-01-14T15:30:00Z',
    updated_at: '2024-01-14T15:30:00Z',
  },
  {
    id: '3',
    title: 'Victorian Gold Brooch',
    description: 'Exquisite Victorian-era gold brooch with intricate floral motifs. A perfect addition to any vintage jewelry collection.',
    price: 320,
    category: 'vintage',
    subcategory: 'brooches',
    condition: 'good',
    material: '14K Gold',
    era: '1880s',
    weight: '8.5g',
    images: ['/api/placeholder/400/400'],
    seller_id: 'seller3',
    seller_name: 'Antique Elegance',
    is_featured: false,
    is_sold: false,
    rating: 4.7,
    reviews_count: 12,
    tags: ['victorian', 'gold', 'floral', 'antique'],
    created_at: '2024-01-13T09:15:00Z',
    updated_at: '2024-01-13T09:15:00Z',
  },
  {
    id: '4',
    title: 'Rhinestone Cocktail Earrings',
    description: 'Glamorous 1950s cocktail earrings featuring sparkling rhinestones. Perfect for adding vintage glamour to any outfit.',
    price: 85,
    original_price: 120,
    category: 'costume',
    subcategory: 'earrings',
    condition: 'very_good',
    material: 'Rhinestone, Silver-tone Metal',
    era: '1950s',
    images: ['/api/placeholder/400/400', '/api/placeholder/400/400'],
    seller_id: 'seller4',
    seller_name: 'Retro Glam',
    is_featured: false,
    is_sold: false,
    rating: 4.6,
    reviews_count: 31,
    tags: ['rhinestone', 'cocktail', 'glamour', '1950s'],
    created_at: '2024-01-12T14:20:00Z',
    updated_at: '2024-01-12T14:20:00Z',
  },
  {
    id: '5',
    title: 'Designer Emerald Pendant',
    description: 'Contemporary designer pendant featuring a stunning emerald stone in a modern setting. Signed piece from renowned jewelry designer.',
    price: 780,
    category: 'designer',
    subcategory: 'necklaces',
    condition: 'excellent',
    material: 'Platinum, Emerald',
    brand: 'Cartier',
    weight: '5.1g',
    images: ['/api/placeholder/400/400', '/api/placeholder/400/400', '/api/placeholder/400/400'],
    seller_id: 'seller5',
    seller_name: 'Luxury Consignment',
    is_featured: true,
    is_sold: false,
    rating: 4.9,
    reviews_count: 8,
    tags: ['emerald', 'designer', 'luxury', 'contemporary'],
    created_at: '2024-01-11T11:45:00Z',
    updated_at: '2024-01-11T11:45:00Z',
  },
  {
    id: '6',
    title: 'Vintage Charm Bracelet',
    description: 'Delightful vintage charm bracelet with various travel-themed charms collected over the years. Each charm tells a story.',
    price: 195,
    category: 'vintage',
    subcategory: 'bracelets',
    condition: 'good',
    material: 'Sterling Silver',
    era: '1940s',
    weight: '28.3g',
    images: ['/api/placeholder/400/400', '/api/placeholder/400/400'],
    seller_id: 'seller6',
    seller_name: 'Memory Lane Jewelry',
    is_featured: false,
    is_sold: false,
    rating: 4.5,
    reviews_count: 15,
    tags: ['charm-bracelet', 'travel', 'sterling-silver', 'collectible'],
    created_at: '2024-01-10T16:30:00Z',
    updated_at: '2024-01-10T16:30:00Z',
  },
];

export const getProducts = async (params: SearchParams = {}): Promise<{ products: Product[]; total: number }> => {
  // In a real app, this would query Supabase
  // For now, return mock data with filtering and sorting
  
  let filteredProducts = [...mockProducts];
  
  // Apply search query
  if (params.query) {
    const query = params.query.toLowerCase();
    filteredProducts = filteredProducts.filter(product =>
      product.title.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.tags.some(tag => tag.toLowerCase().includes(query)) ||
      product.brand?.toLowerCase().includes(query) ||
      product.material?.toLowerCase().includes(query)
    );
  }
  
  // Apply filters
  if (params.filters) {
    const { category, priceRange, condition, material, brand, era, inStock, featured } = params.filters;
    
    if (category && category.length > 0) {
      filteredProducts = filteredProducts.filter(product => category.includes(product.category));
    }
    
    if (priceRange) {
      filteredProducts = filteredProducts.filter(product => 
        product.price >= priceRange[0] && product.price <= priceRange[1]
      );
    }
    
    if (condition && condition.length > 0) {
      filteredProducts = filteredProducts.filter(product => condition.includes(product.condition));
    }
    
    if (inStock) {
      filteredProducts = filteredProducts.filter(product => !product.is_sold);
    }
    
    if (featured) {
      filteredProducts = filteredProducts.filter(product => product.is_featured);
    }
  }
  
  // Apply sorting
  if (params.sortBy) {
    switch (params.sortBy) {
      case 'price_asc':
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filteredProducts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'oldest':
        filteredProducts.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case 'rating':
        filteredProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
    }
  }
  
  // Apply pagination
  const page = params.page || 1;
  const limit = params.limit || 12;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  return {
    products: filteredProducts.slice(startIndex, endIndex),
    total: filteredProducts.length,
  };
};

export const getProductById = async (id: string): Promise<Product | null> => {
  // In a real app, this would query Supabase
  return mockProducts.find(product => product.id === id) || null;
};

export const getFeaturedProducts = async (limit: number = 4): Promise<Product[]> => {
  return mockProducts.filter(product => product.is_featured).slice(0, limit);
};

export const getProductsByCategory = async (category: string, limit: number = 8): Promise<Product[]> => {
  return mockProducts.filter(product => product.category === category).slice(0, limit);
};

export const searchProducts = async (query: string, limit: number = 10): Promise<Product[]> => {
  const { products } = await getProducts({ query, limit });
  return products;
};

