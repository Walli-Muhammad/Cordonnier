import { createClient } from '@supabase/supabase-js';

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isMissingEnv =
  !supabaseUrl ||
  supabaseUrl === 'https://your-project-ref.supabase.co' ||
  !supabaseAnonKey ||
  supabaseAnonKey === 'your-anon-key-here';

export const supabase = createClient(
  supabaseUrl ?? 'https://placeholder.supabase.co',
  supabaseAnonKey ?? 'placeholder-anon-key'
);

// =============================================
// Database Row Interfaces
// =============================================

export type ProductStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'PUBLISHED'
  | 'SUSPENDED';

export type SupplierStatus =
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'SUSPENDED';

export type UserRole = 'CUSTOMER' | 'SUPPLIER' | 'ADMIN';

export interface Product {
  id: string;
  sku?: string | null;
  title: string;
  description: string | null;
  category: string;
  category_id?: string | null;
  brand?: string | null;
  base_price: number;
  sale_price?: number | null;
  currency: string;
  image_url: string | null;
  images?: string[] | null;
  supplier_id?: string | null;
  supplier_sku?: string | null;
  status: ProductStatus;
  is_active: boolean;
  is_pod: boolean;
  stock_count: number;
  weight?: number | null;
  dimensions?: { length?: number; width?: number; height?: number; unit?: string } | null;
  shipping_info?: string | null;
  tags?: string[] | null;
  seo_title?: string | null;
  seo_description?: string | null;
  created_at: string;
  updated_at: string;
  colors?: { color_name: string; color_hex: string; image_url: string }[] | null;
  rarity?: string | null;
  show_stock?: boolean;
}

export interface Variant {
  id: string;
  product_id: string;
  size: string | null;
  color: string | null;
  color_hex: string | null;
  sku: string | null;
  stock_count: number;
  price_delta: number;
  created_at: string;
}

export interface PodOption {
  id: string;
  product_id: string;
  option_type: 'custom_name' | 'upload_image' | 'custom_text' | 'choose_color';
  label: string;
  is_required: boolean;
  max_length: number | null;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
}

export interface SupplierApplication {
  id: string;
  company_name: string;
  contact_person: string;
  email: string;
  phone?: string | null;
  country: string;
  website?: string | null;
  categories: string[];
  product_range?: string | null;
  wholesale_available: boolean;
  moq: number;
  shipping_regions: string[];
  fulfillment_method?: string | null;
  registration_info?: string | null;
  message?: string | null;
  status: SupplierStatus;
  created_at: string;
}

export interface Supplier {
  id: string;
  user_id?: string | null;
  company_name: string;
  contact_person: string;
  email: string;
  phone?: string | null;
  country: string;
  website?: string | null;
  categories: string[];
  status: SupplierStatus;
  created_at: string;
}

// Currency Formatter Utility
export function formatCurrency(amount: number, currency: string = 'GBP'): string {
  if (currency === 'GBP' || !currency) {
    return `£${amount.toFixed(2)}`;
  }
  if (currency === 'USD') {
    return `$${amount.toFixed(2)}`;
  }
  if (currency === 'EUR') {
    return `€${amount.toFixed(2)}`;
  }
  return `${currency} ${amount.toLocaleString()}`;
}

// =============================================
// NO FAKE OR DEMO PRODUCTS
// Production-ready data layer (populated from real database when active)
// =============================================

export const DEMO_PRODUCTS: Product[] = [];

export const DEMO_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Footwear', slug: 'footwear', description: 'Footwear, shoes, and lifestyle products channel', image_url: null, is_active: true },
  { id: 'cat-2', name: 'Clothing', slug: 'clothing', description: 'Apparel, knitwear, and everyday clothing channel', image_url: null, is_active: true },
  { id: 'cat-3', name: 'Accessories', slug: 'accessories', description: 'Bags, small leather goods, and fashion accessories channel', image_url: null, is_active: true },
  { id: 'cat-4', name: 'Home & Lifestyle', slug: 'home-lifestyle', description: 'Living decor, home textiles, and lifestyle items channel', image_url: null, is_active: true },
  { id: 'cat-5', name: 'Pet Products', slug: 'pet-products', description: 'Pet accessories, gear, and care supplies channel', image_url: null, is_active: true },
];

export async function getProducts(): Promise<Product[]> {
  if (isMissingEnv) {
    return DEMO_PRODUCTS;
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .eq('status', 'PUBLISHED')
      .order('created_at', { ascending: false });

    if (error || !data) {
      return DEMO_PRODUCTS;
    }
    return data as Product[];
  } catch {
    return DEMO_PRODUCTS;
  }
}

export async function getProductById(id: string): Promise<{
  product: Product | null;
  variants: Variant[];
  podOptions: PodOption[];
}> {
  const allProducts = await getProducts();
  const product = allProducts.find((p) => p.id === id) || null;
  return {
    product,
    variants: [],
    podOptions: [],
  };
}

export async function getCategories(): Promise<Category[]> {
  if (isMissingEnv) {
    return DEMO_CATEGORIES;
  }

  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true);

    if (error || !data || data.length === 0) {
      return DEMO_CATEGORIES;
    }
    return data as Category[];
  } catch {
    return DEMO_CATEGORIES;
  }
}
