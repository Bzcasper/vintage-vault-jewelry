import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  is_seller?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  original_price?: number;
  category: 'vintage' | 'costume' | 'designer';
  condition: 'excellent' | 'very_good' | 'good' | 'fair';
  material?: string;
  brand?: string;
  era?: string;
  images: string[];
  seller_id: string;
  is_featured: boolean;
  is_sold: boolean;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shipping_address: any;
  payment_intent_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Newsletter {
  id: string;
  email: string;
  subscribed_at: string;
}

