'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '@/store/ui';
import { getProducts, formatCurrency, type Product } from '@/lib/supabase';
import Link from 'next/link';

export default function SearchModal() {
  const { isSearchOpen, closeSearch } = useUIStore();
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isSearchOpen) {
      setLoading(true);
      getProducts().then((res) => {
        setProducts(res);
        setLoading(false);
      });
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const filteredProducts = query.trim() === ''
    ? products.slice(0, 4) // Default recommendations
    : products.filter((p) =>
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(query.toLowerCase())) ||
        (p.brand && p.brand.toLowerCase().includes(query.toLowerCase())) ||
        (p.sku && p.sku.toLowerCase().includes(query.toLowerCase()))
      );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[1100] bg-zinc-950/80 backdrop-blur-md flex items-start justify-center pt-20 px-4"
        onClick={closeSearch}
      >
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.98 }}
          className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Input Bar */}
          <div className="flex items-center px-6 py-4 border-b border-zinc-800 gap-3">
            <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              autoFocus
              placeholder="Search products by title, SKU, brand, or category..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-white placeholder-zinc-500 text-sm focus:outline-none"
            />
            {query && (
              <button onClick={() => setQuery('')} className="text-zinc-500 hover:text-white text-xs">
                Clear
              </button>
            )}
            <button onClick={closeSearch} className="p-1 text-zinc-500 hover:text-white rounded-lg">
              ESC
            </button>
          </div>

          {/* Search Results */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {loading ? (
              <p className="text-xs text-zinc-500 uppercase tracking-widest text-center py-8">Searching product catalog...</p>
            ) : filteredProducts.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm text-zinc-400">No products found matching &quot;{query}&quot;</p>
                <p className="text-xs text-zinc-600 mt-1">Try searching for &quot;Footwear&quot;, &quot;Clothing&quot;, or &quot;Accessories&quot;.</p>
              </div>
            ) : (
              <div>
                <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-zinc-500 mb-4">
                  {query ? `Search Results (${filteredProducts.length})` : 'Featured Catalog Recommendations'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filteredProducts.map((p) => (
                    <Link
                      key={p.id}
                      href={`/shop/${p.id}`}
                      onClick={closeSearch}
                      className="flex items-center gap-3 p-3 bg-zinc-950/60 hover:bg-zinc-800/80 border border-zinc-800/80 rounded-xl transition-all group"
                    >
                      {p.image_url ? (
                        <img src={p.image_url} alt={p.title} className="w-12 h-12 rounded-lg object-cover bg-zinc-800 shrink-0" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-zinc-800 shrink-0 flex items-center justify-center text-xs text-zinc-500">
                          No IMG
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <span className="text-[9px] uppercase font-semibold text-indigo-400 tracking-wider block">
                          {p.category}
                        </span>
                        <h4 className="text-xs font-semibold text-white truncate group-hover:text-indigo-300 transition-colors">
                          {p.title}
                        </h4>
                        <p className="text-xs font-mono text-zinc-400 mt-0.5">
                          {formatCurrency(p.base_price, p.currency)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
