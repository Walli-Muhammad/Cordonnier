-- =============================================
-- CORDONNIER — Support Multiple Images for Products
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard)
-- =============================================

-- Add images column as a text array if it doesn't exist
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';

-- Migrate existing single image_url values into the images array
UPDATE public.products 
SET images = ARRAY[image_url] 
WHERE image_url IS NOT NULL 
  AND (images IS NULL OR array_length(images, 1) IS NULL OR images = '{}');
