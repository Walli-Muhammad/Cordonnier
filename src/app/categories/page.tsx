import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Product Categories | WALIM LTD',
  description: 'Explore WALIM LTD product categories: Footwear, Clothing, Accessories, Home & Lifestyle, and Pet Products.',
};

const CATEGORY_CHANNELS = [
  {
    name: 'Footwear',
    description: 'Shoes, casual footwear, and lifestyle footwear products.',
    icon: '👟',
  },
  {
    name: 'Clothing',
    description: 'Apparel, knitwear, hoodies, and everyday clothing items.',
    icon: '👕',
  },
  {
    name: 'Accessories',
    description: 'Bags, small leather goods, headwear, and lifestyle accessories.',
    icon: '🎒',
  },
  {
    name: 'Home & Lifestyle',
    description: 'Living decor, textiles, candles, and accent home items.',
    icon: '🏠',
  },
  {
    name: 'Pet Products',
    description: 'Pet gear, harnesses, supplies, and care accessories.',
    icon: '🐾',
  },
];

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Page Header */}
        <div className="mb-14 text-center max-w-3xl mx-auto">
          <span className="text-xs uppercase tracking-[0.2em] font-extrabold text-indigo-600 block mb-3">
            Multi-Category Platform Structure
          </span>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-slate-900 mb-4">
            Product Categories
          </h1>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed">
            WALIM LTD is structured as a multi-category online retail platform. Our database and fulfillment architecture support diverse consumer product lines as supplier partnerships are established.
          </p>
        </div>

        {/* Category Framework Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {CATEGORY_CHANNELS.map((cat) => (
            <div
              key={cat.name}
              className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col justify-between shadow-xl shadow-slate-900/5 transition-all hover:border-indigo-500 hover:shadow-2xl"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center text-xl mb-6 font-bold shadow-sm">
                  {cat.icon}
                </div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-600 block mb-2">
                  Category Channel
                </span>
                <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tight mb-3">
                  {cat.name}
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                  {cat.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <Link
                  href="/suppliers"
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white text-center text-xs font-bold uppercase tracking-wider rounded-full transition-colors inline-block shadow-sm"
                >
                  Supply {cat.name} &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Supplier CTA */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-700 text-white border border-indigo-500 rounded-3xl p-8 sm:p-12 text-center max-w-4xl mx-auto shadow-2xl space-y-4">
          <h3 className="text-2xl font-bold uppercase tracking-tight">Do you manufacture or distribute products in these categories?</h3>
          <p className="text-xs text-indigo-100 max-w-lg mx-auto leading-relaxed">
            Submit a supplier application to onboard your product catalog onto the WALIM LTD platform.
          </p>
          <div className="pt-2">
            <Link
              href="/suppliers"
              className="inline-block px-8 py-3.5 bg-white hover:bg-slate-100 text-indigo-900 font-bold uppercase text-xs tracking-[0.15em] rounded-full transition-all shadow-xl"
            >
              Become a Supplier
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
