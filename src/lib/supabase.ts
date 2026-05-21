import { createClient } from '@supabase/supabase-js';

// These are injected at build time via .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const isMissingEnv =
  !supabaseUrl ||
  supabaseUrl === 'https://your-project-ref.supabase.co' ||
  !supabaseAnonKey ||
  supabaseAnonKey === 'your-anon-key-here';

if (isMissingEnv) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'Missing Supabase environment variables. ' +
      'Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your deployment environment.'
    );
  }
  // In development: warn but don't crash — lets non-DB pages render for UI work.
  console.warn(
    '\n⚠️  [Cordonnier] Supabase env vars are not set.\n' +
    '   Open .env.local and fill in your project URL and anon key.\n' +
    '   Product grid and auth will not work until then.\n'
  );
}

// Singleton client for use on both server and client components.
// For server-side actions that bypass RLS (admin writes), create a separate
// server-only client using the `service_role` key (never expose to browser).
// Falls back to placeholder values in dev so non-DB pages can render.
export const supabase = createClient(
  supabaseUrl  ?? 'https://placeholder.supabase.co',
  supabaseAnonKey ?? 'placeholder-anon-key'
);

// =============================================
// Typed Database Row Interfaces
// =============================================

export interface Product {
  id: string;
  title: string;
  description: string | null;
  base_price: number;
  image_url: string | null;
  images?: string[] | null;
  category: string | null;
  is_pod: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
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

// =============================================
// Convenience Query Helpers
// =============================================

/** Mock products — shown when Supabase is not yet configured */
const MOCK_PRODUCTS: Product[] = [
  {
    id: 'mock-1', title: 'Blank Runner Silhouette',
    description: 'Lightweight mesh upper with rubber outsole. Full-wrap POD canvas — print any graphic across every panel.',
    base_price: 5500, image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
    category: 'Runners', is_pod: true, is_active: true, created_at: '', updated_at: '',
  },
  {
    id: 'mock-2', title: 'Classic Low-Top',
    description: 'Clean canvas vulcanised-sole low-top. Minimalist profile ideal for bold custom artwork on the lateral panel.',
    base_price: 4800, image_url: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&q=80',
    category: 'Low-Tops', is_pod: true, is_active: true, created_at: '', updated_at: '',
  },
  {
    id: 'mock-3', title: 'Hi-Top Court',
    description: 'Premium suede-feel high-top silhouette. Extended ankle panel gives maximum real-estate for large custom graphics.',
    base_price: 6200, image_url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80',
    category: 'Hi-Tops', is_pod: true, is_active: true, created_at: '', updated_at: '',
  },
  {
    id: 'mock-4', title: 'Slip-On Wave',
    description: 'Elastic-gore slip-on with perforated upper. Sublimation-ready surface for edge-to-edge colour prints.',
    base_price: 4200, image_url: 'https://images.unsplash.com/photo-1512374382149-233c42b6a83b?w=800&q=80',
    category: 'Slip-Ons', is_pod: true, is_active: true, created_at: '', updated_at: '',
  },
  {
    id: 'mock-5', title: 'Chunky Trainer',
    description: 'Exaggerated platform sole with multi-layer upper. Every panel is a POD canvas — bold and statement-ready.',
    base_price: 7000, image_url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80',
    category: 'Trainers', is_pod: true, is_active: true, created_at: '', updated_at: '',
  },
  {
    id: 'mock-6', title: 'Sock Knit Racer',
    description: 'Stretch-knit sock construction for a barefoot second-skin fit. Gradient and all-over prints look stunning.',
    base_price: 5200, image_url: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&q=80',
    category: 'Racers', is_pod: false, is_active: true, created_at: '', updated_at: '',
  },
];

/** Fetch all active products for the storefront grid */
export async function getProducts(): Promise<Product[]> {
  if (isMissingEnv) {
    console.info('[getProducts] Supabase not configured — using mock product data.');
    return MOCK_PRODUCTS;
  }

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[getProducts] Supabase error:', error.message);
    return MOCK_PRODUCTS;   // Fallback to mocks on DB error too
  }
  return data ?? MOCK_PRODUCTS;
}

/** Fetch a single product with all its variants and POD options */
export async function getProductById(id: string): Promise<{
  product: Product | null;
  variants: Variant[];
  podOptions: PodOption[];
}> {
  const [productRes, variantsRes, podRes] = await Promise.all([
    supabase.from('products').select('*').eq('id', id).single(),
    supabase.from('variants').select('*').eq('product_id', id),
    supabase.from('pod_options').select('*').eq('product_id', id),
  ]);

  return {
    product: productRes.data ?? null,
    variants: variantsRes.data ?? [],
    podOptions: podRes.data ?? [],
  };
}
