-- =============================================
-- CORDONNIER — Generation Credits Migration
-- Run this in Supabase SQL Editor AFTER schema.sql
-- =============================================

-- 1. Create the user_credits table to track per-user generation credits
CREATE TABLE IF NOT EXISTS public.user_credits (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id            UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  generation_credits INTEGER NOT NULL DEFAULT 3,
  total_generated    INTEGER NOT NULL DEFAULT 0,
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Auto-update updated_at on every write
CREATE TRIGGER user_credits_updated_at
  BEFORE UPDATE ON public.user_credits
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 3. RLS: Enable row level security
ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;

-- 4. Users can only read their own credits (browser client)
CREATE POLICY "Users can read own credits"
  ON public.user_credits FOR SELECT
  USING (auth.uid() = user_id);

-- NOTE: Credits are decremented server-side using the service_role key
-- which bypasses RLS — no UPDATE policy needed for the browser client.

-- 5. Auto-provision a credits row for every new sign-up
CREATE OR REPLACE FUNCTION public.handle_new_user_credits()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_credits (user_id, generation_credits, total_generated)
  VALUES (NEW.id, 3, 0)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created_credits ON auth.users;
CREATE TRIGGER on_auth_user_created_credits
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_credits();
