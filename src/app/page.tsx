import Link from 'next/link';
import Hero from '@/components/Hero/Hero';

export const dynamic = 'force-dynamic';

export default async function Home() {
  return (
    <main className="relative flex w-full flex-col overflow-x-hidden bg-zinc-950 text-zinc-100">
      
      {/* 1. HERO SECTION */}
      <Hero />

      {/* 2. BUILDING OUR ONLINE RETAIL PLATFORM & BUSINESS PARTNERSHIPS */}
      <section className="py-24 px-6 max-w-7xl mx-auto w-full border-b border-zinc-900">
        
        {/* Headline & Subtitle */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-indigo-400 block mb-3">
            Company Operations &amp; Growth
          </span>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mb-6">
            Building Our Online Retail Platform
          </h2>
          <p className="text-zinc-300 text-base sm:text-lg leading-relaxed font-normal">
            WALIM LTD is developing its online retail operations and building relationships with customers, suppliers, manufacturers, wholesalers, and marketplace partners.
          </p>
        </div>

        {/* Three Focused Cards: Customers, Suppliers, Business Partners */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          
          {/* Card 1: Customers */}
          <div className="bg-gradient-to-b from-zinc-900/90 to-zinc-900/40 border border-zinc-800 rounded-3xl p-8 flex flex-col justify-between transition-all hover:border-zinc-700 hover:shadow-2xl">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center text-xl mb-6">
                💬
              </div>
              <h3 className="text-xl font-bold text-white uppercase tracking-tight mb-3">Customers</h3>
              <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                Have a question or want to learn more about our upcoming products and services?
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Get In Touch &rarr;
            </Link>
          </div>

          {/* Card 2: Suppliers */}
          <div className="bg-gradient-to-b from-zinc-900/90 to-zinc-900/40 border border-zinc-800 rounded-3xl p-8 flex flex-col justify-between transition-all hover:border-zinc-700 hover:shadow-2xl">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center text-xl mb-6">
                🤝
              </div>
              <h3 className="text-xl font-bold text-white uppercase tracking-tight mb-3">Suppliers</h3>
              <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                Interested in supplying products to WALIM LTD? We welcome enquiries from manufacturers, wholesalers, and distributors.
              </p>
            </div>
            <Link
              href="/suppliers"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Supplier Enquiries &rarr;
            </Link>
          </div>

          {/* Card 3: Business Partners */}
          <div className="bg-gradient-to-b from-zinc-900/90 to-zinc-900/40 border border-zinc-800 rounded-3xl p-8 flex flex-col justify-between transition-all hover:border-zinc-700 hover:shadow-2xl">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center text-xl mb-6">
                🌐
              </div>
              <h3 className="text-xl font-bold text-white uppercase tracking-tight mb-3">Business Partners</h3>
              <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                Interested in working with WALIM LTD on e-commerce or marketplace opportunities? Get in touch with our team.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Contact Our Team &rarr;
            </Link>
          </div>

        </div>

        {/* Prominent Contact WALIM LTD CTA Banner */}
        <div className="bg-gradient-to-r from-zinc-900 via-indigo-950/40 to-zinc-900 border border-zinc-800 rounded-3xl p-8 md:p-12 text-center max-w-4xl mx-auto shadow-2xl space-y-6">
          <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
            Connect With WALIM LTD
          </h3>
          <p className="text-zinc-400 text-sm max-w-xl mx-auto leading-relaxed">
            Our team is actively reviewing commercial opportunities, supplier applications, and customer enquiries as we build our digital retail footprint.
          </p>
          <div>
            <Link
              href="/contact"
              className="inline-block px-10 py-4 bg-white hover:bg-zinc-200 text-black font-bold uppercase text-xs tracking-[0.15em] rounded-full transition-all shadow-xl active:scale-95"
            >
              Contact WALIM LTD
            </Link>
          </div>
        </div>

      </section>

      {/* 3. OPERATIONAL ROADMAP & MULTI-CHANNEL FOCUS */}
      <section className="py-24 px-6 max-w-7xl mx-auto w-full border-b border-zinc-900">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-indigo-400 block mb-2">
              Strategic Direction
            </span>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white mb-6">
              E-Commerce &amp; Multi-Channel Retail
            </h2>
            <p className="text-zinc-300 text-sm md:text-base leading-relaxed mb-4">
              WALIM LTD is establishing digital retail infrastructure designed to operate both direct online storefronts and integrated sales on third-party digital marketplaces.
            </p>
            <p className="text-zinc-400 text-sm leading-relaxed mb-8">
              We are structuring our backend capabilities to support multi-category product lines including Footwear, Clothing, Accessories, Home &amp; Lifestyle items, and Pet Products.
            </p>
            <div className="flex gap-4">
              <Link
                href="/about"
                className="px-6 py-3 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-white font-bold text-xs uppercase tracking-wider rounded-full transition-colors"
              >
                About WALIM LTD
              </Link>
              <Link
                href="/suppliers"
                className="px-6 py-3 bg-white hover:bg-zinc-200 text-black font-bold text-xs uppercase tracking-wider rounded-full transition-colors"
              >
                Supplier Onboarding
              </Link>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-white uppercase tracking-tight mb-4 border-b border-zinc-800 pb-3">
              Official Corporate Record
            </h3>
            <div className="flex justify-between text-xs py-2 border-b border-zinc-800/60">
              <span className="text-zinc-500 font-semibold uppercase">Company Name</span>
              <span className="text-white font-bold">WALIM LTD</span>
            </div>
            <div className="flex justify-between text-xs py-2 border-b border-zinc-800/60">
              <span className="text-zinc-500 font-semibold uppercase">UK Registration No</span>
              <span className="text-indigo-400 font-mono font-bold">17383282</span>
            </div>
            <div className="flex justify-between text-xs py-2 border-b border-zinc-800/60">
              <span className="text-zinc-500 font-semibold uppercase">Entity Type</span>
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

    </main>
  );
}
