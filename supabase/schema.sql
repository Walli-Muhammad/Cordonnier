-- =============================================
-- CORDONNIER E-COMMERCE / POD STORE - Supabase Schema
-- Run this in your Supabase SQL Editor
-- =============================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- TABLES
-- =============================================

-- Products (standard apparel + POD)
CREATE TABLE IF NOT EXISTS public.products (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title         TEXT NOT NULL,
  description   TEXT,
  base_price    NUMERIC(10, 2) NOT NULL,
  image_url     TEXT,
  category      TEXT,
  is_pod        BOOLEAN NOT NULL DEFAULT FALSE,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Product Variants (size/color/SKU combos)
CREATE TABLE IF NOT EXISTS public.variants (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id    UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  size          TEXT,                   -- e.g., 'EU 39', 'EU 40', 'EU 41', 'EU 42', 'EU 43', 'EU 44', 'EU 45'
  color         TEXT,                   -- e.g., 'Midnight Black', 'Chalk White'
  color_hex     TEXT,                   -- e.g., '#1a1a1a'
  sku           TEXT UNIQUE,
  stock_count   INTEGER NOT NULL DEFAULT 0,
  price_delta   NUMERIC(10, 2) DEFAULT 0, -- Extra cost above base_price (e.g., XXL = +Rs 200)
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- POD Customization Options (per product)
CREATE TABLE IF NOT EXISTS public.pod_options (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id    UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  option_type   TEXT NOT NULL, -- 'custom_name' | 'upload_image' | 'custom_text' | 'choose_color'
  label         TEXT NOT NULL, -- human-readable label shown in the UI (e.g., "Your Name")
  is_required   BOOLEAN NOT NULL DEFAULT FALSE,
  max_length    INTEGER,       -- For text fields: max characters allowed
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- UPDATED_AT TRIGGER
-- =============================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE public.products   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.variants   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pod_options ENABLE ROW LEVEL SECURITY;

-- PRODUCTS: Anyone can read active products (public storefront)
CREATE POLICY "Products are publicly readable"
  ON public.products FOR SELECT
  USING (is_active = TRUE);

-- VARIANTS: Anyone can read variants belonging to active products
CREATE POLICY "Variants are publicly readable"
  ON public.variants FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.products p
      WHERE p.id = product_id AND p.is_active = TRUE
    )
  );

-- POD_OPTIONS: Anyone can read POD options for active products
CREATE POLICY "POD options are publicly readable"
  ON public.pod_options FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.products p
      WHERE p.id = product_id AND p.is_active = TRUE
    )
  );

-- ADMIN writes: only authenticated service_role can mutate (handled by server SDK)
-- Add specific INSERT/UPDATE/DELETE policies for authenticated admins if needed.

-- =============================================
-- SEED DATA (6 blank sneaker silhouettes)
-- =============================================

INSERT INTO public.products (title, description, base_price, image_url, category, is_pod) VALUES
  ('Blank Runner Silhouette', 'Lightweight mesh upper with rubber outsole. Full-wrap POD canvas — print any graphic across every panel.',         5500, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80', 'Runners',   TRUE),
  ('Classic Low-Top',         'Clean canvas vulcanised-sole low-top. Minimalist profile ideal for bold custom artwork on the lateral panel.',      4800, 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&q=80', 'Low-Tops',  TRUE),
  ('Hi-Top Court',            'Premium suede-feel high-top silhouette. Extended ankle panel gives maximum real-estate for large custom graphics.', 6200, 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80', 'Hi-Tops',   TRUE),
  ('Slip-On Wave',            'Elastic-gore slip-on with perforated upper. Sublimation-ready surface for edge-to-edge colour prints.',            4200, 'https://images.unsplash.com/photo-1512374382149-233c42b6a83b?w=800&q=80', 'Slip-Ons',  TRUE),
  ('Chunky Trainer',          'Exaggerated platform sole with multi-layer upper. Every panel is a POD canvas — bold and statement-ready.',         7000, 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80', 'Trainers',  TRUE),
  ('Sock Knit Racer',         'Stretch-knit sock construction for a barefoot second-skin fit. Gradient and all-over prints look stunning.',         5200, 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&q=80', 'Racers',    FALSE)
ON CONFLICT DO NOTHING;
