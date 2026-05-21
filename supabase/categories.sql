-- =============================================
-- CORDONNIER — Category Management Table
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard)
-- =============================================

CREATE TABLE IF NOT EXISTS public.categories (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT UNIQUE NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read the categories (storefront and dashboard dropdowns)
DROP POLICY IF EXISTS "Categories are publicly readable" ON public.categories;
CREATE POLICY "Categories are publicly readable"
  ON public.categories FOR SELECT
  USING (true);

-- Seed default categories matching your products
INSERT INTO public.categories (name) VALUES
  ('Runners'),
  ('Low-Tops'),
  ('Hi-Tops'),
  ('Slip-Ons'),
  ('Trainers'),
  ('Racers'),
  ('Heavyweight'),
  ('Graphic Tees'),
  ('Outerwear'),
  ('Bottoms'),
  ('Accessories')
ON CONFLICT DO NOTHING;
