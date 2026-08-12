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

// Initial Demo Catalog
export const DEMO_PRODUCTS: Product[] = [
  {
    id: 'walim-prod-1',
    sku: 'WLM-FW-001',
    title: 'Minimalist Leather Low-Top',
    description: 'Clean silhouette in premium full-grain leather with a durable vulcanised rubber sole. Engineered for everyday comfort and clean modern styling.',
    category: 'Footwear',
    brand: 'WALIM Studio',
    base_price: 65.00,
    sale_price: null,
    currency: 'GBP',
    image_url: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&q=80',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80'
    ],
    status: 'PUBLISHED',
    is_active: true,
    is_pod: false,
    stock_count: 45,
    weight: 0.85,
    shipping_info: 'Standard UK delivery within 2-3 business days. International delivery available.',
    tags: ['footwear', 'sneakers', 'leather'],
    seo_title: 'Minimalist Leather Low-Top | WALIM LTD',
    seo_description: 'Shop minimalist full-grain leather low-top footwear from WALIM LTD.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'walim-prod-2',
    sku: 'WLM-FW-002',
    title: 'Lightweight Breathable Runner',
    description: 'Ultra-breathable engineered mesh upper with responsive foam midsole cushioning. Ideal for active lifestyles and urban walking.',
    category: 'Footwear',
    brand: 'WALIM Studio',
    base_price: 75.00,
    sale_price: 59.99,
    currency: 'GBP',
    image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80'
    ],
    status: 'PUBLISHED',
    is_active: true,
    is_pod: false,
    stock_count: 30,
    weight: 0.65,
    shipping_info: 'Standard UK delivery within 2-3 business days.',
    tags: ['footwear', 'runners', 'sports'],
    seo_title: 'Lightweight Breathable Runner | WALIM LTD',
    seo_description: 'Engineered mesh running shoes from WALIM LTD.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'walim-prod-3',
    sku: 'WLM-CL-001',
    title: 'Organic Heavyweight Cotton Crewneck',
    description: '400 GSM heavy organic cotton fleece sweatshirt with drop-shoulder fit and ribbed collar. Soft, durable construction.',
    category: 'Clothing',
    brand: 'WALIM Retail',
    base_price: 52.00,
    sale_price: null,
    currency: 'GBP',
    image_url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80'
    ],
    status: 'PUBLISHED',
    is_active: true,
    is_pod: false,
    stock_count: 60,
    weight: 0.55,
    shipping_info: 'Delivered in eco-friendly recyclable packaging.',
    tags: ['clothing', 'sweatshirt', 'cotton'],
    seo_title: 'Organic Heavyweight Cotton Crewneck | WALIM LTD',
    seo_description: 'Heavyweight organic cotton apparel from WALIM LTD.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'walim-prod-4',
    sku: 'WLM-AC-001',
    title: 'Structured Canvas Everyday Tote',
    description: 'Heavy duty 16oz cotton canvas tote bag with reinforced handles, interior zip pocket, and magnetic snap closure.',
    category: 'Accessories',
    brand: 'WALIM Retail',
    base_price: 28.00,
    sale_price: null,
    currency: 'GBP',
    image_url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80'
    ],
    status: 'PUBLISHED',
    is_active: true,
    is_pod: false,
    stock_count: 100,
    weight: 0.35,
    shipping_info: 'Ships within 24 hours of order confirmation.',
    tags: ['accessories', 'bags', 'tote'],
    seo_title: 'Structured Canvas Everyday Tote | WALIM LTD',
    seo_description: 'Durable canvas tote bag for work, travel, and daily use.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'walim-prod-5',
    sku: 'WLM-HM-001',
    title: 'Minimalist Ceramic Diffuser & Candle Set',
    description: 'Handcrafted ceramic aromatherapy burner paired with 100% natural soy wax tea lights and essential oil blend.',
    category: 'Home & Lifestyle',
    brand: 'WALIM Living',
    base_price: 38.00,
    sale_price: 32.00,
    currency: 'GBP',
    image_url: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&q=80'
    ],
    status: 'PUBLISHED',
    is_active: true,
    is_pod: false,
    stock_count: 25,
    weight: 0.70,
    shipping_info: 'Packed in shock-resistant protective foam container.',
    tags: ['home', 'lifestyle', 'candles'],
    seo_title: 'Ceramic Diffuser & Candle Set | WALIM LTD',
    seo_description: 'Aromatherapy burner and soy wax candle set.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'walim-prod-6',
    sku: 'WLM-PT-001',
    title: 'Ergonomic Padded Dog Harness',
    description: 'Reflective, breathable mesh dog harness with dual leash attachment points, adjustable straps, and sturdy top grab handle.',
    category: 'Pet Products',
    brand: 'WALIM Pets',
    base_price: 24.00,
    sale_price: null,
    currency: 'GBP',
    image_url: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80'
    ],
    status: 'PUBLISHED',
    is_active: true,
    is_pod: false,
    stock_count: 50,
    weight: 0.25,
    shipping_info: 'Standard UK delivery within 2-3 business days.',
    tags: ['pet', 'harness', 'dogs'],
    seo_title: 'Ergonomic Padded Dog Harness | WALIM LTD',
    seo_description: 'Reflective breathable padded dog harness.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

export const DEMO_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Footwear', slug: 'footwear', description: 'Quality footwear, shoes, and casual sneakers', image_url: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&q=80', is_active: true },
  { id: 'cat-2', name: 'Clothing', slug: 'clothing', description: 'Apparel, knitwear, hoodies, and everyday essentials', image_url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80', is_active: true },
  { id: 'cat-3', name: 'Accessories', slug: 'accessories', description: 'Bags, wallets, headwear, and lifestyle items', image_url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80', is_active: true },
  { id: 'cat-4', name: 'Home & Lifestyle', slug: 'home-lifestyle', description: 'Living decor, textiles, candles, and accent pieces', image_url: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&q=80', is_active: true },
  { id: 'cat-5', name: 'Pet Products', slug: 'pet-products', description: 'Pet gear, harnesses, toys, and care supplies', image_url: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80', is_active: true },
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
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
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
