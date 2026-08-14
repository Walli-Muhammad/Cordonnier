import Link from 'next/link';
import Hero from '@/components/Hero/Hero';

export const dynamic = 'force-dynamic';

export default async function Home() {
  return (
    <main className="relative flex w-full flex-col overflow-x-hidden bg-slate-50 text-slate-900">
      
      {/* 1. HERO SECTION */}
      <Hero />

      {/* 2. BUILDING OUR ONLINE RETAIL PLATFORM & BUSINESS PARTNERSHIPS */}
      <section className="py-24 px-6 max-w-7xl mx-auto w-full border-b border-slate-200/80">
        
        {/* Headline & Subtitle */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.2em] font-extrabold text-indigo-600 block mb-3">
            Company Operations &amp; Growth
          </span>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-slate-900 mb-6">
            Building Our Online Retail Platform
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-normal">
            WALIM LTD is developing its online retail operations and building relationships with customers, suppliers, manufacturers, wholesalers, and marketplace partners.
          </p>
        </div>

        {/* Three Focused Cards: Customers, Suppliers, Business Partners */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          
          {/* Card 1: Customers */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col justify-between shadow-xl shadow-slate-900/5 transition-all hover:border-indigo-500 hover:shadow-2xl">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center text-xl mb-6 font-bold shadow-sm">
                💬
              </div>
              <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight mb-3">Customers</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Have a question or want to learn more about our upcoming products and services?
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              Get In Touch &rarr;
            </Link>
          </div>

          {/* Card 2: Suppliers */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col justify-between shadow-xl shadow-slate-900/5 transition-all hover:border-indigo-500 hover:shadow-2xl">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center text-xl mb-6 font-bold shadow-sm">
                🤝
              </div>
              <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight mb-3">Suppliers</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Interested in supplying products to WALIM LTD? We welcome enquiries from manufacturers, wholesalers, and distributors.
              </p>
            </div>
            <Link
              href="/suppliers"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              Supplier Enquiries &rarr;
            </Link>
          </div>

          {/* Card 3: Business Partners */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col justify-between shadow-xl shadow-slate-900/5 transition-all hover:border-indigo-500 hover:shadow-2xl">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center text-xl mb-6 font-bold shadow-sm">
                🌐
              </div>
              <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight mb-3">Business Partners</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Interested in working with WALIM LTD on e-commerce or marketplace opportunities? Get in touch with our team.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              Contact Our Team &rarr;
            </Link>
          </div>

        </div>

        {/* Prominent Contact WALIM LTD CTA Banner */}
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 border border-indigo-500 rounded-3xl p-8 md:p-12 text-center max-w-4xl mx-auto shadow-2xl text-white space-y-6">
          <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
            Connect With WALIM LTD
          </h3>
          <p className="text-indigo-100 text-sm max-w-xl mx-auto leading-relaxed">
            Our team is actively reviewing commercial opportunities, supplier applications, and customer enquiries as we build our digital retail footprint.
          </p>
          <div>
            <Link
              href="/contact"
              className="inline-block px-10 py-4 bg-white hover:bg-slate-100 text-indigo-900 font-bold uppercase text-xs tracking-[0.15em] rounded-full transition-all shadow-xl active:scale-95"
            >
              Contact WALIM LTD
            </Link>
          </div>
        </div>

      </section>

      {/* 3. OPERATIONAL ROADMAP & OUR APPROACH */}
      <section className="py-24 px-6 max-w-7xl mx-auto w-full border-b border-slate-200/80">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-extrabold text-indigo-600 block mb-2">
              Strategic Direction
            </span>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-slate-900 mb-6">
              E-Commerce &amp; Multi-Channel Retail
            </h2>
            <p className="text-slate-700 text-sm md:text-base leading-relaxed mb-4">
              WALIM LTD is establishing digital retail infrastructure designed to operate both direct online storefronts and integrated sales on third-party digital marketplaces.
            </p>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              We&apos;re building a flexible online retail platform designed to offer products across multiple consumer categories as our retail operations grow.
            </p>
            <p className="text-slate-600 text-sm leading-relaxed mb-8">
              WALIM LTD is developing its presence across established online marketplaces, including eBay, as part of its planned retail operations.
            </p>
            <div className="flex gap-4">
              <Link
                href="/about"
                className="px-6 py-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-900 font-bold text-xs uppercase tracking-wider rounded-full transition-colors shadow-sm"
              >
                About WALIM LTD
              </Link>
              <Link
                href="/suppliers"
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider rounded-full transition-colors shadow-md"
              >
                Partner With Us
              </Link>
            </div>
          </div>

          {/* OUR APPROACH CARD */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-6 shadow-xl">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 block mb-1">Our Strategy</span>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                OUR APPROACH
              </h3>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <h4 className="text-sm font-bold text-slate-900 mb-1">Customer First</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  We focus on convenient online shopping experiences and carefully selected products.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <h4 className="text-sm font-bold text-slate-900 mb-1">Supplier Partnerships</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  We welcome relationships with manufacturers, wholesalers, distributors and other product partners.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <h4 className="text-sm font-bold text-slate-900 mb-1">Digital Commerce</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  We develop flexible online retail channels designed to operate across digital marketplaces.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

    </main>
  );
}
