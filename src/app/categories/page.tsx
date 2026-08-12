import type { Metadata } from 'next';
import Link from 'next/link';
import { getCategories } from '@/lib/supabase';

export const metadata: Metadata = {
  title: 'Product Categories | WALIM LTD',
  description: 'Explore WALIM LTD product categories: Footwear, Clothing, Accessories, Home & Lifestyle, and Pet Products.',
};

export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Page Header */}
        <div className="mb-14 text-center max-w-3xl mx-auto">
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-indigo-400 block mb-3">
            Multi-Category Platform Structure
          </span>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white mb-4">
            Product Categories
          </h1>
          <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
            WALIM LTD is structured as a multi-category online retail platform capable of supporting diverse consumer product lines.
          </p>
        </div>

        {/* Category Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-zinc-900/60 border border-zinc-800 rounded-3xl overflow-hidden flex flex-col justify-between transition-all hover:border-indigo-500/40 hover:shadow-2xl"
            >
              <div className="relative h-64 bg-zinc-950 overflow-hidden">
                {cat.image_url ? (
                  <img
                    src={cat.image_url}
                    alt={cat.name}
                    className="w-full h-full object-cover opacity-60 hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-mono text-xs text-zinc-600">
                    Category Cover
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-6 right-6">
                  <span className="bg-indigo-600/90 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full inline-block mb-2">
                    Active Channel
                  </span>
                  <h2 className="text-2xl font-bold text-white uppercase tracking-tight">
                    {cat.name}
                  </h2>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                  {cat.description || `Browse quality ${cat.name.toLowerCase()} products available on the WALIM LTD platform.`}
                </p>

                <Link
                  href={`/shop?category=${encodeURIComponent(cat.name)}`}
                  className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white text-center text-xs font-bold uppercase tracking-wider rounded-full transition-colors inline-block"
                >
                  Browse {cat.name} &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
