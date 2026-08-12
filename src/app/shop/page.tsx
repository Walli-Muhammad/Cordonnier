import type { Metadata } from 'next';
import Link from 'next/link';
import ProductGrid from '@/components/ProductGrid/ProductGrid';
import { getProducts } from '@/lib/supabase';

export const metadata: Metadata = {
  title: 'Platform Catalog | WALIM LTD Online Retail',
  description: 'Explore the WALIM LTD generalized online retail platform and catalog infrastructure.',
};

export const dynamic = 'force-dynamic';

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pt-32 pb-24 px-6">
      
      {/* Header Banner */}
      <div className="max-w-7xl mx-auto mb-12">
        <span className="text-xs uppercase tracking-[0.2em] font-bold text-indigo-400 block mb-2">
          WALIM LTD Platform Catalog
        </span>
        <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white mb-4">
          Online Retail Catalog
        </h1>
        <p className="text-zinc-400 text-sm md:text-base max-w-2xl leading-relaxed">
          WALIM LTD is developing its online retail channels across Footwear, Clothing, Accessories, Home &amp; Lifestyle, and Pet Products.
        </p>
      </div>

      {products.length === 0 ? (
        <div className="max-w-4xl mx-auto bg-zinc-900 border border-zinc-800 rounded-3xl p-10 sm:p-14 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center text-2xl mx-auto font-bold">
            🛍️
          </div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
            Catalog In Development
          </h2>
          <p className="text-zinc-400 text-sm max-w-md mx-auto leading-relaxed">
            Real products will be listed as supplier partnerships and inventory onboarding are finalized.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/suppliers"
              className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-zinc-200 text-black font-bold text-xs uppercase tracking-wider rounded-full transition-colors"
            >
              Become a Supplier
            </Link>
            <Link
              href="/contact"
              className="w-full sm:w-auto px-8 py-3.5 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs uppercase tracking-wider rounded-full transition-colors"
            >
              Contact WALIM LTD
            </Link>
          </div>
        </div>
      ) : (
        <ProductGrid products={products} />
      )}

    </div>
  );
}
