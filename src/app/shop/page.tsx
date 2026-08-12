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
    <div className="min-h-screen bg-slate-50 text-slate-900 pt-32 pb-24 px-6">
      
      {/* Header Banner */}
      <div className="max-w-7xl mx-auto mb-12">
        <span className="text-xs uppercase tracking-[0.2em] font-extrabold text-indigo-600 block mb-2">
          WALIM LTD Platform Catalog
        </span>
        <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-slate-900 mb-4">
          Online Retail Catalog
        </h1>
        <p className="text-slate-600 text-sm md:text-base max-w-2xl leading-relaxed">
          WALIM LTD is developing its online retail channels across Footwear, Clothing, Accessories, Home &amp; Lifestyle, and Pet Products.
        </p>
      </div>

      {products.length === 0 ? (
        <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-3xl p-10 sm:p-14 text-center space-y-6 shadow-xl">
          <div className="w-16 h-16 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center text-2xl mx-auto font-bold shadow-sm">
            🛍️
          </div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900">
            Catalog In Development
          </h2>
          <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
            Real products will be listed as supplier partnerships and inventory onboarding are finalized.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/suppliers"
              className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider rounded-full transition-colors shadow-md"
            >
              Become a Supplier
            </Link>
            <Link
              href="/contact"
              className="w-full sm:w-auto px-8 py-3.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-900 font-bold text-xs uppercase tracking-wider rounded-full transition-colors shadow-sm"
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
