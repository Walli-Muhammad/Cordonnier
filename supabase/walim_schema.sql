-- =============================================
-- WALIM LTD - E-Commerce Platform Database Schema
-- Run in Supabase SQL Editor
-- =============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- ENUMS
-- =============================================

CREATE TYPE product_status AS ENUM (
  'DRAFT',
  'SUBMITTED',
  'UNDER_REVIEW',
  'APPROVED',
  'REJECTED',
  'PUBLISHED',
  'SUSPENDED'
);

CREATE TYPE supplier_status AS ENUM (
  'SUBMITTED',
  'UNDER_REVIEW',
  'APPROVED',
  'REJECTED',
  'SUSPENDED'
);

CREATE TYPE order_status AS ENUM (
  'pending',
  'payment_received',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'refunded'
);

CREATE TYPE inventory_status AS ENUM (
  'available',
  'reserved',
  'incoming',
  'out_of_stock'
);

CREATE TYPE user_role AS ENUM (
  'CUSTOMER',
  'SUPPLIER',
  'ADMIN'
);

-- =============================================
-- CATEGORIES
-- =============================================
CREATE TABLE IF NOT EXISTS public.categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL UNIQUE,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url   TEXT,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- SUPPLIERS & SUPPLIER APPLICATIONS
-- =============================================
CREATE TABLE IF NOT EXISTS public.suppliers (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id                 UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  company_name            TEXT NOT NULL,
  contact_person          TEXT NOT NULL,
  email                   TEXT NOT NULL UNIQUE,
  phone                   TEXT,
  country                 TEXT NOT NULL,
  website                 TEXT,
  categories              TEXT[],
  product_range           TEXT,
  wholesale_available    BOOLEAN DEFAULT TRUE,
  moq                     INTEGER DEFAULT 1,
  shipping_regions        TEXT[],
  fulfillment_method      TEXT,
  registration_info       TEXT,
  status                  supplier_status NOT NULL DEFAULT 'SUBMITTED',
  notes                   TEXT,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.supplier_applications (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name            TEXT NOT NULL,
  contact_person          TEXT NOT NULL,
  email                   TEXT NOT NULL,
  phone                   TEXT,
  country                 TEXT NOT NULL,
  website                 TEXT,
  categories              TEXT[],
  product_range           TEXT,
  wholesale_available    BOOLEAN DEFAULT TRUE,
  moq                     INTEGER DEFAULT 1,
  shipping_regions        TEXT[],
  fulfillment_method      TEXT,
  registration_info       TEXT,
  message                 TEXT,
  status                  supplier_status NOT NULL DEFAULT 'SUBMITTED',
  reviewed_at             TIMESTAMPTZ,
  reviewer_notes          TEXT,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- PRODUCTS
-- =============================================
CREATE TABLE IF NOT EXISTS public.products (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sku               TEXT UNIQUE,
  title             TEXT NOT NULL,
  description       TEXT,
  category          TEXT NOT NULL,
  category_id       UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  brand             TEXT DEFAULT 'WALIM LTD',
  base_price        NUMERIC(10, 2) NOT NULL,
  sale_price        NUMERIC(10, 2),
  currency          TEXT NOT NULL DEFAULT 'GBP',
  image_url         TEXT,
  images            TEXT[],
  supplier_id       UUID REFERENCES public.suppliers(id) ON DELETE SET NULL,
  supplier_sku      TEXT,
  status            product_status NOT NULL DEFAULT 'PUBLISHED',
  is_active         BOOLEAN NOT NULL DEFAULT TRUE,
  is_pod            BOOLEAN NOT NULL DEFAULT FALSE,
  stock_count       INTEGER NOT NULL DEFAULT 100,
  weight            NUMERIC(6, 2),
  dimensions        JSONB, -- { "length": 0, "width": 0, "height": 0, "unit": "cm" }
  shipping_info     TEXT,
  tags              TEXT[],
  seo_title         TEXT,
  seo_description   TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- PRODUCT VARIANTS
-- =============================================
CREATE TABLE IF NOT EXISTS public.variants (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id    UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  sku           TEXT UNIQUE,
  size          TEXT,
  color         TEXT,
  color_hex     TEXT,
  stock_count   INTEGER NOT NULL DEFAULT 0,
  price_delta   NUMERIC(10, 2) DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- ORDERS & ORDER ITEMS
-- =============================================
CREATE TABLE IF NOT EXISTS public.orders (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id       UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name     TEXT NOT NULL,
  customer_email    TEXT NOT NULL,
  customer_phone    TEXT NOT NULL,
  address_line1     TEXT NOT NULL,
  address_line2     TEXT,
  city              TEXT NOT NULL,
  postal_code       TEXT NOT NULL,
  country           TEXT NOT NULL DEFAULT 'United Kingdom',
  payment_method    TEXT NOT NULL DEFAULT 'test_mode',
  payment_txn_ref   TEXT,
  subtotal          NUMERIC(12, 2) NOT NULL,
  shipping_cost     NUMERIC(12, 2) NOT NULL DEFAULT 0,
  tax_amount        NUMERIC(12, 2) NOT NULL DEFAULT 0,
  total_amount      NUMERIC(12, 2) NOT NULL,
  currency          TEXT NOT NULL DEFAULT 'GBP',
  status            order_status NOT NULL DEFAULT 'pending',
  tracking_number   TEXT,
  carrier           TEXT,
  notes             TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.order_items (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id              UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id            UUID NOT NULL REFERENCES public.products(id),
  supplier_id           UUID REFERENCES public.suppliers(id),
  variant_id            TEXT,
  product_title         TEXT NOT NULL,
  product_image_url     TEXT,
  sku                   TEXT,
  quantity              INTEGER NOT NULL CHECK (quantity > 0),
  unit_price            NUMERIC(10, 2) NOT NULL,
  pod_customization     JSONB,
  fulfillment_status    TEXT DEFAULT 'unfulfilled',
  tracking_number       TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- INVENTORY LOCATIONS
-- =============================================
CREATE TABLE IF NOT EXISTS public.inventory_locations (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  location_type TEXT NOT NULL, -- 'WALIM_WAREHOUSE' | 'SUPPLIER' | 'MARKETPLACE'
  country       TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- MARKETPLACE LISTINGS
-- =============================================
CREATE TABLE IF NOT EXISTS public.marketplace_listings (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id      UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  platform        TEXT NOT NULL, -- 'eBay' | 'Amazon' | 'Etsy' | 'Shopify'
  external_id     TEXT,
  external_url    TEXT,
  sync_status     TEXT NOT NULL DEFAULT 'pending',
  last_synced_at  TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- CUSTOMER PROFILES & ROLES
-- =============================================
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name     TEXT,
  email         TEXT NOT NULL,
  role          user_role NOT NULL DEFAULT 'CUSTOMER',
  phone         TEXT,
  company_name  TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed Categories
INSERT INTO public.categories (name, slug, description) VALUES
  ('Footwear', 'footwear', 'Quality footwear, shoes, and lifestyle sneakers'),
  ('Clothing', 'clothing', 'Apparel, knitwear, and everyday essentials'),
  ('Accessories', 'accessories', 'Bags, small leather goods, and fashion accessories'),
  ('Home & Lifestyle', 'home-lifestyle', 'Living decor, textiles, and everyday home items'),
  ('Pet Products', 'pet-products', 'Pet accessories, care items, and supplies')
ON CONFLICT (name) DO NOTHING;
