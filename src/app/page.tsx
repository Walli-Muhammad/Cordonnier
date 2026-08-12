import Link from 'next/link';
import Hero from '@/components/Hero/Hero';
import ProductGrid from '@/components/ProductGrid/ProductGrid';
import { getProducts, getCategories, formatCurrency } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <main className="relative flex w-full flex-col overflow-x-hidden bg-zinc-950 text-zinc-100">
      
      {/* 1. HERO SECTION */}
      <Hero />

      {/* 2. FEATURED CATEGORIES SECTION */}
      <section className="py-24 px-6 max-w-7xl mx-auto w-full border-b border-zinc-900">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-indigo-400 block mb-2">
              Multi-Category Platform
            </span>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white">
              Product Categories
            </h2>
          </div>
          <Link
            href="/categories"
            className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors"
          >
            Browse All Categories &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${encodeURIComponent(cat.name)}`}
              className="group relative h-64 rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 flex flex-col justify-end p-5 transition-all hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-950/30"
            >
              {cat.image_url && (
                <img
                  src={cat.image_url}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-500"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
              
              <div className="relative z-10">
                <h3 className="text-lg font-bold text-white uppercase tracking-tight group-hover:text-indigo-300 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                  {cat.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS GRID */}
      <ProductGrid products={products} />

      {/* 4. HOW WE OPERATE */}
      <section className="py-24 px-6 max-w-7xl mx-auto w-full border-b border-zinc-900">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-indigo-400 block mb-2">
            Operational Architecture
          </span>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white mb-4">
            How WALIM LTD Operates
          </h2>
          <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
            WALIM LTD develops direct-to-consumer e-commerce channels while establishing fulfillment infrastructure with verified product suppliers and third-party marketplace channels.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-8 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-black text-lg mb-6">
                01
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Direct Online Retail</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Operating high-converting digital storefronts tailored for modern consumers with fast search, responsive navigation, and multi-currency checkout capability.
              </p>
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-8 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-black text-lg mb-6">
                02
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Supplier Partnership Network</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Working with verified brand owners, wholesalers, and manufacturers to onboard new products, aggregate inventory, and manage order routing.
              </p>
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-8 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-black text-lg mb-6">
                03
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Multi-Channel Distribution</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Building API integrations for marketplace platforms including eBay, Amazon, Etsy, and Shopify to sync inventory and process orders at scale.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SUPPLIER PARTNERSHIP CTA */}
      <section className="py-24 px-6 max-w-7xl mx-auto w-full border-b border-zinc-900">
        <div className="bg-gradient-to-r from-zinc-900 via-indigo-950/40 to-zinc-900 border border-zinc-800 rounded-3xl p-8 md:p-14 flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-indigo-400 block mb-2">
              Business Partnership
            </span>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white mb-4">
              Partner With WALIM LTD As A Product Supplier
            </h2>
            <p className="text-zinc-300 text-sm md:text-base leading-relaxed">
              We are actively developing relationships with product suppliers, manufacturers, and wholesale distributors across Footwear, Clothing, Accessories, Home &amp; Lifestyle, and Pet Products.
            </p>
          </div>
          <Link
            href="/suppliers"
            className="px-8 py-4 bg-white hover:bg-zinc-200 text-black font-bold uppercase text-xs tracking-[0.15em] rounded-full transition-all shrink-0 shadow-lg active:scale-95"
          >
            Become a Supplier &rarr;
          </Link>
        </div>
      </section>

      {/* 6. MARKETPLACE & ONLINE SHOPPING */}
      <section className="py-24 px-6 max-w-7xl mx-auto w-full border-b border-zinc-900">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="lg:w-1/2">
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-indigo-400 block mb-2">
              Multi-Channel Commerce
            </span>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white mb-6">
              Marketplace Ready Architecture
            </h2>
            <p className="text-zinc-400 text-sm md:text-base leading-relaxed mb-6">
              WALIM LTD is designed to integrate with major global digital shopping channels. Our backend architecture supports automated inventory synchronization, listing management, and unified order processing across:
            </p>
            <div className="grid grid-cols-2 gap-4">
              {['eBay Integration', 'Amazon SP-API', 'Etsy Seller API', 'Shopify Storefronts'].map((m) => (
                <div key={m} className="flex items-center gap-3 p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl text-xs font-semibold text-zinc-200">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  <span>{m}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:w-1/2 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-8 text-center">
            <h3 className="text-xl font-bold text-white mb-2">Expanding Sales Channels</h3>
            <p className="text-xs text-zinc-500 mb-6">Unified inventory, product catalog management, and automated supplier order dispatch.</p>
            <div className="p-6 bg-black/40 border border-zinc-800 rounded-xl text-left text-xs space-y-3 font-mono">
              <div className="flex justify-between text-zinc-400">
                <span>Product Sync Status:</span>
                <span className="text-emerald-400">Active</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Catalog Standard:</span>
                <span className="text-indigo-400">Multi-Category Universal</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Marketplace Adapters:</span>
                <span className="text-zinc-300">Modular Ready</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. ABOUT WALIM LTD SNIPPET */}
      <section className="py-24 px-6 max-w-7xl mx-auto w-full border-b border-zinc-900">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-indigo-400 block mb-2">
              Company Overview
            </span>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white mb-6">
              About WALIM LTD
            </h2>
            <p className="text-zinc-300 text-sm md:text-base leading-relaxed mb-4">
              WALIM LTD is a private limited company registered in the United Kingdom under Company Number <strong className="text-white">17383282</strong>.
            </p>
            <p className="text-zinc-400 text-sm leading-relaxed mb-8">
              We specialize in online retail and digital commerce, building modern retail channels that connect high quality products with digital shoppers.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Read Full Company Information &rarr;
            </Link>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 space-y-4">
            <h3 className="text-lg font-bold text-white uppercase tracking-tight mb-4 border-b border-zinc-800 pb-3">
              Official Corporate Registration
            </h3>
            <div className="flex justify-between text-xs py-2 border-b border-zinc-800/60">
              <span className="text-zinc-500 font-semibold uppercase">Company Name</span>
              <span className="text-white font-bold">WALIM LTD</span>
            </div>
            <div className="flex justify-between text-xs py-2 border-b border-zinc-800/60">
              <span className="text-zinc-500 font-semibold uppercase">UK Company Number</span>
              <span className="text-indigo-400 font-mono font-bold">17383282</span>
            </div>
            <div className="flex justify-between text-xs py-2 border-b border-zinc-800/60">
              <span className="text-zinc-500 font-semibold uppercase">Company Type</span>
              <span className="text-zinc-300">Private Limited Company</span>
            </div>
            <div className="flex justify-between text-xs py-2 border-b border-zinc-800/60">
              <span className="text-zinc-500 font-semibold uppercase">Nature of Business</span>
              <span className="text-zinc-300">Online Retail &amp; E-Commerce</span>
            </div>
            <div className="flex justify-between text-xs py-2">
              <span className="text-zinc-500 font-semibold uppercase">Official Contact</span>
              <a href="mailto:walim204@gmail.com" className="text-indigo-400 hover:underline font-mono">
                walim204@gmail.com
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 8. CONTACT CTA */}
      <section className="py-24 px-6 max-w-7xl mx-auto w-full text-center">
        <span className="text-xs uppercase tracking-[0.2em] font-bold text-indigo-400 block mb-2">
          Get In Touch
        </span>
        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white mb-6">
          Have Questions Or Inquiries?
        </h2>
        <p className="text-zinc-400 text-sm md:text-base max-w-xl mx-auto mb-8">
          Whether you are a retail customer, potential supplier, or business partner, our team is ready to connect with you.
        </p>
        <Link
          href="/contact"
          className="inline-block px-8 py-4 bg-white hover:bg-zinc-200 text-black font-bold uppercase text-xs tracking-[0.15em] rounded-full transition-all shadow-xl active:scale-95"
        >
          Contact WALIM LTD
        </Link>
      </section>

    </main>
  );
}
