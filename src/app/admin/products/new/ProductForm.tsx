'use client';

import { useState, useEffect, useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CldUploadWidget } from 'next-cloudinary';
import { createProduct, getCategories, type CreateProductResult } from '@/actions/admin';
import { Plus, Trash2, ArrowLeft, Image as ImageIcon, Sparkles, Check } from 'lucide-react';

const EMPTY_FORM = {
  title: '',
  base_price: '',
  category: '',
  description: '',
  is_pod: false,
  image_url: null as string | null, // main listing image
  images: [] as string[],           // all uploaded images array
  rarity: 'common',
  sale_price: '',
  stock_count: '100',
  show_stock: true,
  colors: [] as { color_name: string; color_hex: string; image_url: string }[],
};

export default function NewProductForm() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [result, setResult] = useState<CreateProductResult | null>(null);
  const [isPending, startTransition] = useTransition();

  // Color Swatch Builder Local State
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#ffffff');
  const [newColorImage, setNewColorImage] = useState<string | null>(null);

  // Load dynamic categories
  useEffect(() => {
    async function loadCats() {
      const cats = await getCategories();
      setCategories(cats);
    }
    loadCats();
  }, []);

  const addColorVariant = () => {
    if (!newColorName.trim() || !newColorHex.trim() || !newColorImage) return;
    setForm((f) => ({
      ...f,
      colors: [
        ...f.colors,
        { color_name: newColorName.trim(), color_hex: newColorHex.trim(), image_url: newColorImage },
      ],
    }));
    setNewColorName('');
    setNewColorHex('#ffffff');
    setNewColorImage(null);
  };

  const removeColorVariant = (idx: number) => {
    setForm((f) => ({
      ...f,
      colors: f.colors.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);

    const price = parseFloat(form.base_price);
    const salePrice = form.sale_price ? parseFloat(form.sale_price) : null;
    const stockCount = parseInt(form.stock_count) || 0;
    if (!form.title || !form.category || isNaN(price) || price <= 0) return;

    startTransition(async () => {
      const res = await createProduct({
        title:       form.title,
        base_price:  price,
        category:    form.category,
        description: form.description,
        is_pod:      form.is_pod,
        image_url:   form.image_url,
        images:      form.images,
        rarity:      form.rarity,
        sale_price:  salePrice,
        stock_count: stockCount,
        show_stock:  form.show_stock,
        colors:      form.colors,
      });

      setResult(res);
      if (res.success) {
        setForm(EMPTY_FORM); // clear form for next product
      }
    });
  };

  const field = (key: keyof typeof EMPTY_FORM, value: any) =>
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
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">Add New Product</h1>
          <p className="text-zinc-500 text-sm">Fill in the details below to create a premium storefront listing.</p>
        </div>
      </div>

      {/* Success Banner */}
      {result?.success && (
        <div className="mb-6 flex items-center gap-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-5 py-4 text-emerald-400 animate-pulse">
          <Check className="w-5 h-5 shrink-0" />
          <div>
            <p className="font-semibold">Product created successfully!</p>
            <p className="text-xs text-emerald-500/70 mt-0.5">ID: {result.productId}</p>
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

        {/* Dynamic Category & Price row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Title */}
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
              Base Price (PKR) <span className="text-red-400">*</span>
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

          {/* Rarity & Discount Fields */}
          <div>
            <label className="block text-xs uppercase tracking-widest font-semibold text-zinc-400 mb-2">
              Rarity Tier <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <select
                required
                value={form.rarity}
                onChange={(e) => field('rarity', e.target.value)}
                className="w-full bg-zinc-900/40 border border-zinc-800 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors appearance-none cursor-pointer pr-10"
              >
                <option value="common">⬜ Common (Cordonnier Base)</option>
                <option value="restricted">🟦 Restricted (Cordonnier Craft)</option>
                <option value="classified">🟣 Classified (Cordonnier Édition)</option>
                <option value="covert">🔴 Covert (Cordonnier Rare)</option>
                <option value="contraband">🟡 Contraband (Cordonnier Légendaire)</option>
              </select>
              <span className="absolute top-1/2 right-4 -translate-y-1/2 text-zinc-500 pointer-events-none text-xs">▼</span>
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest font-semibold text-zinc-400 mb-2">
              Discount/Sale Price (PKR, Optional)
            </label>
            <input
              type="number"
              min={0}
              step="0.01"
              value={form.sale_price}
              onChange={(e) => field('sale_price', e.target.value)}
              placeholder="Leave blank for no discount"
              className="w-full bg-zinc-900/40 border border-zinc-800 rounded-xl px-4 py-3.5 text-white placeholder:text-zinc-650 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>

          {/* Stock Counts */}
          <div>
            <label className="block text-xs uppercase tracking-widest font-semibold text-zinc-400 mb-2">
              In-Stock Quantity
            </label>
            <input
              type="number"
              min={0}
              value={form.stock_count}
              onChange={(e) => field('stock_count', e.target.value)}
              placeholder="100"
              className="w-full bg-zinc-900/40 border border-zinc-800 rounded-xl px-4 py-3.5 text-white placeholder:text-zinc-650 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-3 bg-zinc-950/20 border border-zinc-900 rounded-xl px-4 py-2 mt-1">
            <button
              type="button"
              role="checkbox"
              aria-checked={form.show_stock}
              onClick={() => field('show_stock', !form.show_stock)}
              className={`relative w-9 h-5 rounded-full transition-colors shrink-0 ${form.show_stock ? 'bg-indigo-500' : 'bg-zinc-800'}`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${form.show_stock ? 'translate-x-4' : 'translate-x-0'}`}
              />
            </button>
            <div>
              <p className="text-xs font-semibold text-zinc-350 uppercase tracking-wider">Show Stock Level</p>
              <p className="text-[10px] text-zinc-550">Displays inventory count on the storefront.</p>
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
            placeholder="Premium mesh upper with suede panels, dynamic support sole constructed for athletic comfort..."
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
              <p className="text-zinc-500 text-xs mt-0.5">Upload up to 8 images. The first uploaded is set as &quot;Main&quot; by default.</p>
            </div>

            {/* Cloudinary Widget Trigger */}
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
                      image_url: f.image_url ? f.image_url : info.secure_url // set first image as main thumbnail
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

          {/* Interactive Multi-Image Gallery List */}
          {form.images.length === 0 ? (
            <div className="h-32 rounded-xl border border-dashed border-zinc-900 flex flex-col items-center justify-center text-zinc-650 bg-zinc-950/20">
              <ImageIcon className="w-8 h-8 mb-1.5 text-zinc-800" />
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

                    {/* Simple badge with count */}
                    <span className="absolute bottom-2.5 right-2.5 bg-black/60 backdrop-blur text-white text-[9px] font-mono px-1.5 py-0.5 rounded">
                      {idx + 1}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Color & Design Variants (Swatches) */}
        <div className="bg-zinc-950/40 border border-zinc-900 p-5 rounded-2xl space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-widest font-semibold text-zinc-400">
              Color & Design Variants Swatches
            </label>
            <p className="text-zinc-500 text-xs mt-0.5">
              Create interactive round color swatches for the storefront details modal. Users can tap a swatch to swap the display shoe image dynamically.
            </p>
          </div>

          {/* List of active color swatches */}
          {form.colors.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {form.colors.map((c, idx) => (
                <div 
                  key={idx}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs"
                >
                  <span 
                    className="w-4 h-4 rounded-full border border-zinc-700 block shrink-0" 
                    style={{ backgroundColor: c.color_hex }}
                  />
                  <span className="text-zinc-200 font-medium">{c.color_name}</span>
                  {c.image_url && (
                    <div className="w-6 h-6 rounded overflow-hidden bg-zinc-950 relative shrink-0">
                      <img src={c.image_url} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => removeColorVariant(idx)}
                    className="text-red-400 hover:text-red-300 ml-1 font-bold text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Swatch Creator Controls */}
          <div className="bg-zinc-900/40 border border-zinc-800/80 p-4 rounded-xl space-y-4">
            <h4 className="text-xs uppercase tracking-wider font-bold text-indigo-400">Add New Swatch</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Color/Design Name</label>
                <input 
                  type="text"
                  value={newColorName}
                  onChange={(e) => setNewColorName(e.target.value)}
                  placeholder="e.g. Neon Horizon"
                  className="w-full bg-zinc-950/40 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder:text-zinc-700 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Swatch Hex Code</label>
                <div className="flex gap-2">
                  <input 
                    type="color"
                    value={newColorHex}
                    onChange={(e) => setNewColorHex(e.target.value)}
                    className="w-10 h-8 rounded border border-zinc-800 bg-zinc-950 cursor-pointer p-0.5 shrink-0"
                  />
                  <input 
                    type="text"
                    value={newColorHex}
                    onChange={(e) => setNewColorHex(e.target.value)}
                    placeholder="#ffffff"
                    className="w-full bg-zinc-950/40 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder:text-zinc-700 focus:outline-none focus:border-indigo-500 font-mono text-center"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Variant Image</label>
                {newColorImage ? (
                  <div className="flex items-center gap-2 bg-zinc-950/40 border border-zinc-850 p-1.5 rounded-lg">
                    <img src={newColorImage} alt="" className="w-6 h-6 rounded object-cover shrink-0" />
                    <span className="text-[10px] text-zinc-400 truncate flex-1 font-semibold">Image Selected</span>
                    <button 
                      type="button" 
                      onClick={() => setNewColorImage(null)} 
                      className="text-red-400 text-xs font-bold hover:text-red-300 px-1"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="h-8 rounded-lg border border-dashed border-zinc-800 flex items-center justify-center text-[10px] text-zinc-650 bg-zinc-950/10">
                    Click a photo below to select
                  </div>
                )}
              </div>
            </div>

            {/* Gallery Picker list */}
            {form.images.length > 0 && (
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-zinc-550 mb-1.5 font-semibold">
                  Select Associated Photo:
                </span>
                <div className="flex gap-2 overflow-x-auto py-1 scrollbar-thin">
                  {form.images.map((img, idx) => (
                    <button
                      key={img}
                      type="button"
                      onClick={() => setNewColorImage(img)}
                      className={`relative w-12 h-12 rounded border-2 overflow-hidden shrink-0 transition-all ${
                        newColorImage === img ? 'border-indigo-500 scale-95 shadow' : 'border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <span className="absolute bottom-0 right-0 bg-black/60 text-white text-[8px] font-mono px-1">
                        {idx + 1}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={addColorVariant}
              disabled={!newColorName.trim() || !newColorImage}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-950/30 disabled:text-indigo-500 disabled:cursor-not-allowed rounded-lg text-xs font-bold text-white transition-all shadow-md"
            >
              Add Swatch Variant
            </button>
          </div>
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

        {/* Action triggers */}
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
                Creating Product...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Save Product Listing
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => { setForm(EMPTY_FORM); setResult(null); }}
            className="px-4 py-3 rounded-xl text-zinc-400 hover:text-white transition-colors text-sm font-medium"
          >
            Reset
          </button>
        </div>

      </form>
    </div>
  );
}
