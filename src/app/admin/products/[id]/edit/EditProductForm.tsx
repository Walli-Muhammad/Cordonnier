'use client';

import { useState, useEffect, useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CldUploadWidget } from 'next-cloudinary';
import { updateProduct, getCategories } from '@/actions/admin';
import { Plus, Trash2, ArrowLeft, Image as ImageIcon, Sparkles, Check, Save } from 'lucide-react';
import type { Product } from '@/lib/supabase';

interface EditProductFormProps {
  product: any; // pre-processed product with fallback images array
}

export default function EditProductForm({ product }: EditProductFormProps) {
  const [form, setForm] = useState({
    title: product.title || '',
    base_price: String(product.base_price) || '',
    category: product.category || '',
    description: product.description || '',
    is_pod: !!product.is_pod,
    image_url: product.image_url as string | null,
    images: (product.images || []) as string[],
  });

  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [result, setResult] = useState<{ success: boolean; error: string | null } | null>(null);
  const [isPending, startTransition] = useTransition();

  // Load dynamic categories
  useEffect(() => {
    async function loadCats() {
      const cats = await getCategories();
      setCategories(cats);
    }
    loadCats();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);

    const price = parseFloat(form.base_price);
    if (!form.title || !form.category || isNaN(price) || price <= 0) return;

    startTransition(async () => {
      const res = await updateProduct(product.id, {
        title:       form.title,
        base_price:  price,
        category:    form.category,
        description: form.description,
        is_pod:      form.is_pod,
        image_url:   form.image_url,
        images:      form.images,
      });

      setResult(res);
      if (res.success) {
        showTemporarySuccess();
      }
    });
  };

  const showTemporarySuccess = () => {
    setTimeout(() => {
      setResult(null);
    }, 4000);
  };

  const field = (key: keyof typeof form, value: any) =>
    setForm((f) => ({ ...f, [key]: value }));

  return (
    <div className="max-w-3xl">
      <div className="mb-8 flex items-center justify-between">
        <div className="space-y-1">
          <Link 
            href="/admin" 
            className="text-zinc-500 hover:text-zinc-300 text-xs font-semibold uppercase tracking-widest flex items-center gap-1.5 mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">Edit Product</h1>
          <p className="text-zinc-500 text-sm">Update the details and images of this product listing.</p>
        </div>
      </div>

      {/* Success Banner */}
      {result?.success && (
        <div className="mb-6 flex items-center gap-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-5 py-4 text-emerald-400">
          <Check className="w-5 h-5 shrink-0" />
          <div>
            <p className="font-semibold">Product updated successfully!</p>
            <p className="text-xs text-emerald-500/70 mt-0.5">Your storefront changes are live.</p>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {result?.error && (
        <div className="mb-6 flex items-center gap-3 rounded-xl bg-red-500/10 border border-red-500/30 px-5 py-4 text-red-400">
          <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <p className="font-semibold">{result.error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Title, Category & Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className="block text-xs uppercase tracking-widest font-semibold text-zinc-400 mb-2">
              Product Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => field('title', e.target.value)}
              placeholder="e.g. Cordonnier Classic Runner"
              className="w-full bg-zinc-900/40 border border-zinc-800 rounded-xl px-4 py-3.5 text-white placeholder:text-zinc-650 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest font-semibold text-zinc-400 mb-2">
              Price (PKR) <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              required
              min={1}
              step="0.01"
              value={form.base_price}
              onChange={(e) => field('base_price', e.target.value)}
              placeholder="5500"
              className="w-full bg-zinc-900/40 border border-zinc-800 rounded-xl px-4 py-3.5 text-white placeholder:text-zinc-650 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest font-semibold text-zinc-400 mb-2">
              Category <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <select
                required
                value={form.category}
                onChange={(e) => field('category', e.target.value)}
                className="w-full bg-zinc-900/40 border border-zinc-800 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors appearance-none cursor-pointer pr-10"
              >
                <option value="" disabled>Select category...</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
              <span className="absolute top-1/2 right-4 -translate-y-1/2 text-zinc-500 pointer-events-none text-xs">▼</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs uppercase tracking-widest font-semibold text-zinc-400 mb-2">
            Description
          </label>
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => field('description', e.target.value)}
            placeholder="Premium mesh upper with suede panels..."
            className="w-full bg-zinc-900/40 border border-zinc-800 rounded-xl px-4 py-3.5 text-white placeholder:text-zinc-650 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors resize-none"
          />
        </div>

        {/* Cloudinary Multi-Image Uploader */}
        <div className="bg-zinc-950/40 border border-zinc-900 p-5 rounded-2xl space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <div>
              <label className="block text-xs uppercase tracking-widest font-semibold text-zinc-400">
                Product Image Gallery
              </label>
              <p className="text-zinc-500 text-xs mt-0.5">Upload up to 8 images. Customize which one is primary.</p>
            </div>

            {/* Cloudinary Uploader */}
            <CldUploadWidget
              uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
              options={{
                multiple: true,
                maxFiles: 8,
                resourceType: 'image',
                cropping: false,
                sources: ['local', 'url', 'camera'],
              }}
              onSuccess={(result) => {
                const info = result.info as { secure_url: string };
                if (info?.secure_url) {
                  setForm((f) => {
                    const newImages = [...f.images, info.secure_url];
                    return {
                      ...f,
                      images: newImages,
                      image_url: f.image_url ? f.image_url : info.secure_url // set first as main if none
                    };
                  });
                }
              }}
            >
              {({ open }) => (
                <button
                  type="button"
                  onClick={() => open()}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-all text-xs font-semibold"
                >
                  <Plus className="w-4 h-4" />
                  Upload Images
                </button>
              )}
            </CldUploadWidget>
          </div>

          {/* Gallery display grid */}
          {form.images.length === 0 ? (
            <div className="h-32 rounded-xl border border-dashed border-zinc-900 flex flex-col items-center justify-center text-zinc-650 bg-zinc-950/20">
              <ImageIcon className="w-8 h-8 mb-1.5 text-zinc-850" />
              <span className="text-xs">No photos uploaded. Tap the button to select files.</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {form.images.map((url, idx) => {
                const isMain = form.image_url === url;
                return (
                  <div 
                    key={url} 
                    className={`relative aspect-[3/4] rounded-xl overflow-hidden border-2 bg-zinc-900 group ${
                      isMain ? 'border-indigo-500 shadow-md shadow-indigo-950/30' : 'border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <Image
                      src={url}
                      alt={`Upload ${idx + 1}`}
                      fill
                      className="object-cover"
                    />

                    {/* Dark Hover Actions Overlap */}
                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                      {!isMain && (
                        <button
                          type="button"
                          onClick={() => field('image_url', url)}
                          className="w-full py-1.5 text-[9px] uppercase font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors"
                        >
                          Set Main
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          const updated = form.images.filter(x => x !== url);
                          setForm(f => ({
                            ...f,
                            images: updated,
                            image_url: f.image_url === url ? (updated[0] || null) : f.image_url
                          }));
                        }}
                        className="w-full py-1.5 text-[9px] uppercase font-bold text-white bg-red-650 hover:bg-red-550 rounded-lg transition-colors flex items-center justify-center gap-1"
                      >
                        <Trash2 className="w-2.5 h-2.5" />
                        Remove
                      </button>
                    </div>

                    {/* Main Badge indicator */}
                    {isMain && (
                      <span className="absolute top-2.5 left-2.5 bg-indigo-500 text-white text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow">
                        Main
                      </span>
                    )}

                    {/* Badge number */}
                    <span className="absolute bottom-2.5 right-2.5 bg-black/60 backdrop-blur text-white text-[9px] font-mono px-1.5 py-0.5 rounded">
                      {idx + 1}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Print-on-Demand (POD) Option Toggle */}
        <div className="flex items-center gap-4 p-5 rounded-2xl bg-zinc-950/40 border border-zinc-900">
          <button
            type="button"
            role="checkbox"
            aria-checked={form.is_pod}
            onClick={() => field('is_pod', !form.is_pod)}
            className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${form.is_pod ? 'bg-indigo-500' : 'bg-zinc-800'}`}
          >
            <span
              className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${form.is_pod ? 'translate-x-5' : 'translate-x-0'}`}
            />
          </button>
          <div>
            <p className="text-sm font-semibold text-white uppercase tracking-tight flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Print-on-Demand (POD) Customisation
            </p>
            <p className="text-xs text-zinc-500 mt-0.5">
              Enable if this silhouette supports custom canvas graphic generation and name print on the lateral panels.
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-4 pt-4 border-t border-zinc-900">
          <button
            type="submit"
            disabled={isPending || !form.image_url}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-650 hover:bg-indigo-600 disabled:bg-indigo-900/30 disabled:text-indigo-500 disabled:cursor-not-allowed text-white font-semibold transition-all text-sm tracking-wide shadow-lg shadow-indigo-950/20"
          >
            {isPending ? (
              <>
                <svg className="animate-spin w-4 h-4 text-white" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                  <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" className="opacity-75" />
                </svg>
                Saving Changes...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
          <Link
            href="/admin"
            className="px-4 py-3 rounded-xl text-zinc-400 hover:text-white transition-colors text-sm font-medium"
          >
            Cancel
          </Link>
        </div>

      </form>
    </div>
  );
}
