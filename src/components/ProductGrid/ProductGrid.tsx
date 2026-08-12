'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/cart';
import { formatCurrency, type Product } from '@/lib/supabase';

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  const { addItem, openCart } = useCartStore();
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');

  const categories = Array.from(new Set(products.map((p) => p.category)));

  const filteredProducts = selectedCategoryFilter === 'ALL'
    ? products
    : products.filter((p) => p.category.toLowerCase() === selectedCategoryFilter.toLowerCase());

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const finalPrice = product.sale_price || product.base_price;

    addItem({
      productId: product.id,
      productTitle: product.title,
      productImage: product.image_url,
      variantId: `${product.id}_default`,
      variant: {
        size: null,
        color: null,
        color_hex: null,
        sku: product.sku || null,
        price_delta: 0,
      },
      basePrice: finalPrice,
      quantity: 1,
      isPod: product.is_pod,
      podCustomizations: null,
    });
    openCart();
  };

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto w-full">
      
      {/* Section Header & Category Filter Pills */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-indigo-600 block mb-2">
            Online Catalog
          </span>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-slate-900">
            Featured Products
          </h2>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategoryFilter('ALL')}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full border transition-all whitespace-nowrap ${
              selectedCategoryFilter === 'ALL'
                ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            All Products ({products.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategoryFilter(cat)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full border transition-all whitespace-nowrap ${
                selectedCategoryFilter === cat
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                  : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Cards Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-16 text-center bg-white border border-slate-200 rounded-2xl shadow-sm">
          <p className="text-slate-500 text-sm">No products found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => {
            const isOnSale = product.sale_price !== null && product.sale_price !== undefined && product.sale_price < product.base_price;
            const discountPercent = isOnSale ? Math.round((1 - (product.sale_price || 0) / product.base_price) * 100) : 0;

            return (
              <div
                key={product.id}
                className="group bg-white border border-slate-200 rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:border-indigo-400 hover:shadow-2xl hover:-translate-y-1"
              >
                <div>
                  {/* Image Container */}
                  <Link href={`/shop/${product.id}`} className="relative aspect-square block bg-slate-100 overflow-hidden">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-slate-400 uppercase tracking-widest font-mono">
                        No Image Available
                      </div>
                    )}

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                      <span className="bg-white/90 backdrop-blur-md border border-slate-200 text-slate-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                        {product.category}
                      </span>
                      {isOnSale && (
                        <span className="bg-red-600 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow">
                          -{discountPercent}% OFF
                        </span>
                      )}
                    </div>
                  </Link>

                  {/* Body Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                      <span>{product.brand || 'WALIM LTD'}</span>
                      {product.sku && <span className="font-mono text-[10px]">SKU: {product.sku}</span>}
                    </div>

                    <Link href={`/shop/${product.id}`} className="block group-hover:text-indigo-600 transition-colors">
                      <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug line-clamp-1">
                        {product.title}
                      </h3>
                    </Link>

                    {product.description && (
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                        {product.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer / Price & Add to Cart */}
                <div className="px-6 pb-6 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    {isOnSale ? (
                      <>
                        <span className="text-base font-black text-slate-900 font-mono">
                          {formatCurrency(product.sale_price || 0, product.currency)}
                        </span>
                        <span className="text-xs line-through text-slate-400 font-mono">
                          {formatCurrency(product.base_price, product.currency)}
                        </span>
                      </>
                    ) : (
                      <span className="text-base font-black text-slate-900 font-mono">
                        {formatCurrency(product.base_price, product.currency)}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={(e) => handleAddToCart(product, e)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider rounded-full transition-colors active:scale-95 shadow"
                  >
                    + Add to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </section>
  );
}
