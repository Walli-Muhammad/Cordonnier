import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About WALIM LTD | Official Corporate Information',
  description: 'WALIM LTD is a UK-registered private limited company (Company No. 17383282) focused on online retail and digital commerce.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-14">
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-indigo-400 block mb-3">
            Official Company Profile
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white uppercase tracking-tight mb-4">
            About WALIM LTD
          </h1>
          <p className="text-zinc-400 text-base leading-relaxed">
            Corporate overview, registration details, and operational focus of WALIM LTD.
          </p>
        </div>

        {/* Corporate Summary Box */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 mb-12 shadow-xl">
          <h2 className="text-xl font-black text-white uppercase tracking-tight mb-6 pb-3 border-b border-zinc-800">
            Company Credentials &amp; Registration
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            <div>
              <span className="text-xs uppercase tracking-widest text-zinc-500 font-semibold block mb-1">Company Name</span>
              <span className="text-white font-bold text-base">WALIM LTD</span>
            </div>

            <div>
              <span className="text-xs uppercase tracking-widest text-zinc-500 font-semibold block mb-1">Entity Type</span>
              <span className="text-zinc-200">UK Private Limited Company</span>
            </div>

            <div>
              <span className="text-xs uppercase tracking-widest text-zinc-500 font-semibold block mb-1">UK Company Number</span>
              <span className="text-indigo-400 font-mono font-bold text-base">17383282</span>
            </div>

            <div>
              <span className="text-xs uppercase tracking-widest text-zinc-500 font-semibold block mb-1">Primary Business Activity</span>
              <span className="text-zinc-200">Online Retail &amp; E-Commerce</span>
            </div>

            <div className="sm:col-span-2 pt-4 border-t border-zinc-800/80">
              <span className="text-xs uppercase tracking-widest text-zinc-500 font-semibold block mb-1">Registered Office Address</span>
              <p className="text-zinc-200 text-sm">
                Office 20409 182-184 High Street North, East Ham, London, United Kingdom, E6 2JA
              </p>
            </div>

            <div className="sm:col-span-2 pt-2 border-t border-zinc-800/80">
              <span className="text-xs uppercase tracking-widest text-zinc-500 font-semibold block mb-1">Official Business Contact</span>
              <a href="mailto:walim204@gmail.com" className="text-indigo-400 hover:underline font-mono text-sm">
                walim204@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Core Business Model */}
        <div className="space-y-10 mb-16">
          <section className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Our Business &amp; Operations</h2>
            <p className="text-zinc-400 text-sm leading-relaxed mb-4">
              WALIM LTD is an online retail company developing its digital commerce operations. We are focused on building relationships with customers, suppliers, manufacturers, wholesalers, and marketplace partners.
            </p>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Our generalized e-commerce platform architecture is structured to support multi-category product lines including Footwear, Clothing, Accessories, Home &amp; Lifestyle items, and Pet Products as commercial partnerships are established.
            </p>
          </section>

          {/* Transparent Capabilities: Current Stage */}
          <section className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Current Operations &amp; Roadmap</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-black/30 border border-zinc-800 rounded-xl p-6">
                <span className="text-xs uppercase font-bold text-indigo-400 tracking-widest block mb-2">Current Stage</span>
                <h3 className="text-base font-bold text-white mb-3">Platform Development &amp; Supplier Onboarding</h3>
                <ul className="text-xs text-zinc-400 space-y-2 leading-relaxed">
                  <li>&bull; E-commerce infrastructure and backend ready</li>
                  <li>&bull; Supplier application and onboarding portal active</li>
                  <li>&bull; Partner and inquiry intake open</li>
                </ul>
              </div>

              <div className="bg-black/30 border border-zinc-800 rounded-xl p-6">
                <span className="text-xs uppercase font-bold text-indigo-400 tracking-widest block mb-2">Commercial Launch</span>
                <h3 className="text-base font-bold text-white mb-3">Live Catalog &amp; Multi-Channel Growth</h3>
                <ul className="text-xs text-zinc-400 space-y-2 leading-relaxed">
                  <li>&bull; Live product listing upon supplier approval</li>
                  <li>&bull; Marketplace integrations (eBay, Amazon, Etsy)</li>
                  <li>&bull; Multi-category retail order fulfillment</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Transparency Statement */}
          <section className="bg-indigo-950/20 border border-indigo-500/20 rounded-2xl p-8">
            <h3 className="text-base font-bold text-indigo-300 uppercase tracking-wide mb-2">Transparency &amp; Governance Statement</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              WALIM LTD is committed to complete commercial transparency. All corporate information and addresses displayed represent official UK registration records.
            </p>
          </section>
        </div>

        {/* CTA Banner */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-8 bg-zinc-900 border border-zinc-800 rounded-2xl">
          <div>
            <h3 className="text-lg font-bold text-white">Interested in working with WALIM LTD?</h3>
            <p className="text-xs text-zinc-500 mt-1">Submit a supplier application or contact our team.</p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/suppliers"
              className="px-6 py-3 bg-white text-black text-xs font-bold uppercase tracking-wider rounded-full hover:bg-zinc-200 transition-colors"
            >
              Become a Supplier
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 bg-zinc-800 text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-zinc-700 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
