-- =============================================
-- Migration: Add Rarity, Sale Prices, Stock Inventory, and Color Swatches
-- Run this in the Supabase SQL Editor (https://supabase.com/dashboard)
-- =============================================

-- 1. Add Rarity Tiers (Defaulting to 'common')
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS rarity TEXT DEFAULT 'common';

-- 2. Add Pricing & Discounts (Sale Price)
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS sale_price NUMERIC(10, 2) DEFAULT NULL;

-- 3. Add Stock Inventory Controls
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS stock_count INTEGER DEFAULT 100;

ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS show_stock BOOLEAN DEFAULT TRUE;

-- 4. Add Color & Design Swatches JSONB column
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS colors JSONB DEFAULT '[]'::jsonb;

-- Verify the column additions
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'products'
  AND column_name IN ('rarity', 'sale_price', 'stock_count', 'show_stock', 'colors');
