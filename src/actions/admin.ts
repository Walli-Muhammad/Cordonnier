'use server';

import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase-server';

// ─── PRODUCTS TYPES & ACTIONS ──────────────────────────────────────────────────

export interface CreateProductInput {
  title: string;
  base_price: number;
  category: string;
  description: string;
  is_pod: boolean;
  image_url: string | null;
  images?: string[];
  rarity?: string;
  sale_price?: number | null;
  stock_count?: number;
  show_stock?: boolean;
  colors?: { color_name: string; color_hex: string; image_url: string }[];
}

export interface CreateProductResult {
  success: boolean;
  error: string | null;
  productId: string | null;
}

export async function createProduct(input: CreateProductInput): Promise<CreateProductResult> {
  if (!input.title.trim()) return { success: false, error: 'Title is required.', productId: null };
  if (isNaN(input.base_price) || input.base_price <= 0) {
    return { success: false, error: 'Valid price is required.', productId: null };
  }

  const { data, error } = await supabaseAdmin
    .from('products')
    .insert({
      title: input.title.trim(),
      base_price: input.base_price,
      currency: 'GBP',
      category: input.category || 'Footwear',
      description: input.description.trim() || null,
      is_pod: input.is_pod || false,
      image_url: input.image_url || null,
      images: input.images || [],
      is_active: true,
      status: 'PUBLISHED',
      stock_count: input.stock_count !== undefined ? input.stock_count : 50,
      colors: input.colors || [],
    })
    .select('id')
    .single();

  if (error) {
    return { success: false, error: error.message, productId: null };
  }

  revalidatePath('/');
  revalidatePath('/shop');
  revalidatePath('/admin');
  return { success: true, error: null, productId: data.id };
}

export async function updateProduct(id: string, input: CreateProductInput): Promise<{ success: boolean; error: string | null }> {
  if (!id) return { success: false, error: 'Product ID is required.' };
  if (!input.title.trim()) return { success: false, error: 'Title is required.' };

  const { error } = await supabaseAdmin
    .from('products')
    .update({
      title: input.title.trim(),
      base_price: input.base_price,
      category: input.category,
      description: input.description.trim() || null,
      is_pod: input.is_pod,
      image_url: input.image_url || null,
      images: input.images || [],
      updated_at: new Date().toISOString(),
      sale_price: input.sale_price !== undefined ? input.sale_price : null,
      stock_count: input.stock_count !== undefined ? input.stock_count : 50,
      colors: input.colors || [],
    })
    .eq('id', id);

  if (error) return { success: false, error: error.message };

  revalidatePath('/');
  revalidatePath('/shop');
  revalidatePath(`/admin/products/${id}/edit`);
  return { success: true, error: null };
}

export async function getAdminProducts() {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return data;
}

export async function deleteProduct(id: string) {
  const { error } = await supabaseAdmin
    .from('products')
    .delete()
    .eq('id', id);

  if (error) return { success: false, error: error.message };

  revalidatePath('/');
  revalidatePath('/shop');
  revalidatePath('/admin');
  return { success: true, error: null };
}

// ─── CATEGORY ACTIONS ──────────────────────────────────────────────────────────

const DEFAULT_CATEGORIES = [
  { id: 'cat-1', name: 'Footwear' },
  { id: 'cat-2', name: 'Clothing' },
  { id: 'cat-3', name: 'Accessories' },
  { id: 'cat-4', name: 'Home & Lifestyle' },
  { id: 'cat-5', name: 'Pet Products' },
];

export async function getCategories(): Promise<{ id: string; name: string }[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('categories')
      .select('id, name')
      .order('name', { ascending: true });

    if (error || !data || data.length === 0) {
      return DEFAULT_CATEGORIES;
    }
    return data;
  } catch {
    return DEFAULT_CATEGORIES;
  }
}

export async function addCategory(name: string): Promise<{ success: boolean; error: string | null }> {
  if (!name || !name.trim()) return { success: false, error: 'Category name is required.' };

  const { error } = await supabaseAdmin
    .from('categories')
    .insert({ name: name.trim(), slug: name.trim().toLowerCase().replace(/\s+/g, '-') });

  if (error) return { success: false, error: error.message };
  return { success: true, error: null };
}

export async function deleteCategory(id: string): Promise<{ success: boolean; error: string | null }> {
  if (!id) return { success: false, error: 'Category ID is required.' };
  const { error } = await supabaseAdmin.from('categories').delete().eq('id', id);
  if (error) return { success: false, error: error.message };
  return { success: true, error: null };
}

// ─── ORDERS ACTIONS ──────────────────────────────────────────────────────────

export async function getAdminOrders() {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return data;
}

// ─── SUPPLIER APPLICATIONS ACTIONS ──────────────────────────────────────────

export async function getAdminSupplierApplications() {
  const { data, error } = await supabaseAdmin
    .from('supplier_applications')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return data;
}

export async function reviewSupplierApplication(id: string, status: 'APPROVED' | 'REJECTED') {
  const { error } = await supabaseAdmin
    .from('supplier_applications')
    .update({ status, reviewed_at: new Date().toISOString() })
    .eq('id', id);

  if (error) return { success: false, error: error.message };

  revalidatePath('/admin/suppliers');
  return { success: true, error: null };
}
