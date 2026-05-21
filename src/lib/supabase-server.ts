/**
 * Server-only Supabase client using the service_role key.
 *
 * ⚠️ SECURITY: This client bypasses ALL Row Level Security policies.
 * Import ONLY inside:
 *   - app/api/**\/route.ts
 *   - server actions (actions/*.ts)
 *   - NEVER in 'use client' components
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

// NOTE: We intentionally do NOT throw here at module level.
// Throwing at import time crashes Next.js static page-data collection during `next build`.
// A runtime error will still surface if a route is called without these env vars configured.
export const supabaseAdmin = createClient(supabaseUrl || 'https://placeholder.supabase.co', serviceRoleKey || 'placeholder', {
  auth: {
    // Prevents the service client from trying to persist session to localStorage
    persistSession: false,
    autoRefreshToken: false,
  },
});
