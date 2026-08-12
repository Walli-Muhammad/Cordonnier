'use client';

import { useState } from 'react';
import { submitSupplierProduct } from '@/actions/supplier';

export default function SupplierProductsPage() {
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: '',
    category: 'Footwear',
    base_price: 50.00,
    description: '',
    supplier_sku: '',
    image_url: '',
    stock_count: 50,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);

    const res = await submitSupplierProduct('DEMO_SUPPLIER_ID', form);
    setSubmitting(false);

    if (res.success) {
      setSubmittedSuccess(true);
      setForm({
        title: '',
        category: 'Footwear',
        base_price: 50.00,
        description: '',
        supplier_sku: '',
        image_url: '',
        stock_count: 50,
      });
    } else {
      setErrorMsg(res.error || 'Failed to submit product.');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="border-b border-zinc-900 pb-6">
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-indigo-400 block mb-1">
            Supplier Product Pipeline
          </span>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">Submit Product For Review</h1>
          <p className="text-xs text-zinc-500 mt-1">Products submitted here undergo admin approval before being published to retail shoppers.</p>
        </div>

        {submittedSuccess && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl font-semibold flex items-center justify-between">
            <span>✓ Product submitted successfully! Status set to <code className="bg-emerald-950 px-2 py-0.5 rounded font-mono text-white">SUBMITTED</code> awaiting admin review.</span>
            <button onClick={() => setSubmittedSuccess(false)} className="text-white hover:underline ml-4">Dismiss</button>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl font-semibold">
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-6 shadow-xl">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-zinc-400 block mb-1">Product Title *</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Classic Oxford Leather Shoe"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-400 block mb-1">Category *</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Footwear">Footwear</option>
                <option value="Clothing">Clothing</option>
                <option value="Accessories">Accessories</option>
                <option value="Home & Lifestyle">Home &amp; Lifestyle</option>
                <option value="Pet Products">Pet Products</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-zinc-400 block mb-1">Wholesale / Base Price (&pound;) *</label>
              <input
                type="number"
                step="0.01"
                required
                value={form.base_price}
                onChange={(e) => setForm({ ...form, base_price: parseFloat(e.target.value) || 0 })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-400 block mb-1">Supplier SKU</label>
              <input
                type="text"
                value={form.supplier_sku}
                onChange={(e) => setForm({ ...form, supplier_sku: e.target.value })}
                placeholder="SUP-SKU-992"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-400 block mb-1">Available Quantity</label>
              <input
                type="number"
                min={1}
                value={form.stock_count}
                onChange={(e) => setForm({ ...form, stock_count: parseInt(e.target.value) || 0 })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-400 block mb-1">Image URL</label>
            <input
              type="url"
              value={form.image_url}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-400 block mb-1">Product Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Provide key product details, materials, sizing, and packaging specs..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-white hover:bg-zinc-200 text-black font-bold uppercase text-xs tracking-[0.15em] rounded-full transition-all shadow-xl active:scale-98 disabled:opacity-50"
          >
            {submitting ? 'Submitting Product...' : 'Submit Product For Approval'}
          </button>

        </form>

      </div>
    </div>
  );
}
