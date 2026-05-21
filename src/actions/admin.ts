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
}

export interface CreateProductResult {
  success: boolean;
  error: string | null;
  productId: string | null;
}

export async function createProduct(
  input: CreateProductInput
): Promise<CreateProductResult> {
  // Server-side validation
  if (!input.title.trim()) {
    return { success: false, error: 'Product title is required.', productId: null };
  }
  if (isNaN(input.base_price) || input.base_price <= 0) {
    return { success: false, error: 'A valid price is required.', productId: null };
  }
  if (!input.category) {
    return { success: false, error: 'Category is required.', productId: null };
  }

  const { data, error } = await supabaseAdmin
    .from('products')
    .insert({
      title:       input.title.trim(),
      base_price:  input.base_price,
      category:    input.category,
      description: input.description.trim() || null,
      is_pod:      input.is_pod,
      image_url:   input.image_url || null,
      images:      input.images || [],
      is_active:   true,
    })
    .select('id')
    .single();

  if (error) {
    console.error('[createProduct] Supabase error:', error.message);
    return { success: false, error: error.message, productId: null };
  }

  revalidatePath('/');
  return { success: true, error: null, productId: data.id };
}

export async function getAdminProducts() {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[getAdminProducts] Supabase error:', error.message);
    return [];
  }
  return data || [];
}

export async function updateProduct(
  id: string,
  input: CreateProductInput
): Promise<{ success: boolean; error: string | null }> {
  if (!id) return { success: false, error: 'Product ID is required.' };
  if (!input.title.trim()) return { success: false, error: 'Title is required.' };
  if (isNaN(input.base_price) || input.base_price <= 0) {
    return { success: false, error: 'Valid price is required.' };
  }

  const { error } = await supabaseAdmin
    .from('products')
    .update({
      title:       input.title.trim(),
      base_price:  input.base_price,
      category:    input.category,
      description: input.description.trim() || null,
      is_pod:      input.is_pod,
      image_url:   input.image_url || null,
      images:      input.images || [],
      updated_at:  new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    console.error('[updateProduct] error:', error.message);
    return { success: false, error: error.message };
  }

  revalidatePath('/');
  revalidatePath(`/admin/products/${id}/edit`);
  return { success: true, error: null };
}

export async function deleteProduct(id: string): Promise<{ success: boolean; error: string | null }> {
  if (!id) return { success: false, error: 'Product ID is required.' };

  // Soft delete to protect references in order history
  const { error } = await supabaseAdmin
    .from('products')
    .update({ is_active: false })
    .eq('id', id);

  if (error) {
    console.error('[deleteProduct] error:', error.message);
    return { success: false, error: error.message };
  }

  revalidatePath('/');
  return { success: true, error: null };
}

// ─── CATEGORY ACTIONS ──────────────────────────────────────────────────────────

const DEFAULT_CATEGORIES = [
  'Runners', 'Low-Tops', 'Hi-Tops', 'Slip-Ons', 'Trainers', 'Racers',
  'Heavyweight', 'Graphic Tees', 'Outerwear', 'Bottoms', 'Accessories'
];

export async function getCategories(): Promise<{ id: string; name: string }[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.warn('[getCategories] categories table may not exist yet, falling back:', error.message);
      return DEFAULT_CATEGORIES.map((c, i) => ({ id: `fallback-${i}`, name: c }));
    }

    if (!data || data.length === 0) {
      return DEFAULT_CATEGORIES.map((c, i) => ({ id: `fallback-${i}`, name: c }));
    }

    return data;
  } catch (err) {
    console.error('[getCategories] catch error:', err);
    return DEFAULT_CATEGORIES.map((c, i) => ({ id: `fallback-${i}`, name: c }));
  }
}

export async function addCategory(name: string): Promise<{ success: boolean; error: string | null }> {
  if (!name || !name.trim()) return { success: false, error: 'Category name is required.' };
  
  const trimmed = name.trim();
  const { error } = await supabaseAdmin
    .from('categories')
    .insert({ name: trimmed });

  if (error) {
    console.error('[addCategory] error:', error.message);
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

export async function deleteCategory(id: string): Promise<{ success: boolean; error: string | null }> {
  if (!id) return { success: false, error: 'Category ID is required.' };

  const { error } = await supabaseAdmin
    .from('categories')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('[deleteCategory] error:', error.message);
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

// ─── ORDERS & NOTIFICATIONS ACTIONS ─────────────────────────────────────────────

export interface OrderItem {
  id: string;
  product_id: string;
  variant_id: string | null;
  product_title: string;
  product_image_url: string | null;
  quantity: number;
  unit_price_pkr: number;
  pod_customization: any | null;
  is_pod: boolean;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  address_line1: string;
  city: string;
  province: string;
  gateway: string;
  gateway_txn_ref: string | null;
  subtotal_pkr: number;
  shipping_pkr: number;
  total_pkr: number;
  status: string;
  created_at: string;
  order_items?: OrderItem[];
}

export async function getAdminOrders(): Promise<Order[]> {
  // Query orders along with their nested order_items
  const { data, error } = await supabaseAdmin
    .from('orders')
    .select(`
      *,
      order_items (
        id,
        product_id,
        variant_id,
        product_title,
        product_image_url,
        quantity,
        unit_price_pkr,
        pod_customization,
        is_pod
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[getAdminOrders] error:', error.message);
    return [];
  }

  return (data as Order[]) || [];
}

export async function updateOrderStatus(
  orderId: string,
  status: string
): Promise<{ success: boolean; error: string | null }> {
  if (!orderId) return { success: false, error: 'Order ID is required.' };

  const { error } = await supabaseAdmin
    .from('orders')
    .update({ status })
    .eq('id', orderId);

  if (error) {
    console.error('[updateOrderStatus] error:', error.message);
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}
