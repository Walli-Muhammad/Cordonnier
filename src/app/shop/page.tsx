import type { Metadata } from 'next';
import ProductGrid from '@/components/ProductGrid/ProductGrid';
import { getProducts, getCategories } from '@/lib/supabase';

export const metadata: Metadata = {
  title: 'Shop All Products | WALIM LTD Online Catalog',
  description: 'Browse the WALIM LTD product catalog spanning Footwear, Clothing, Accessories, Home & Lifestyle, and Pet Products.',
};

export const dynamic = 'force-dynamic';

export default async function ShopPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pt-32 pb-24">
      
      {/* Header Banner */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <span className="text-xs uppercase tracking-[0.2em] font-bold text-indigo-400 block mb-2">
          WALIM LTD Online Retail Store
        </span>
        <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white mb-4">
          All Products &amp; Catalog
        </h1>
        <p className="text-zinc-400 text-sm max-w-2xl">
          Explore our generalized product catalog. Quality merchandise curated directly and sourced through verified supplier partners.
        </p>
      </div>

      {/* Main Grid */}
      <ProductGrid products={products} />

    </div>
  );
}
