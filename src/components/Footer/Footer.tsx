'use client';

import Link from 'next/link';

const FOOTER_LINKS = {
  shop: {
    label: 'Platform & Catalog',
    links: [
      { label: 'Browse Platform Catalog', href: '/shop' },
      { label: 'Product Categories', href: '/categories' },
      { label: 'Footwear Channel', href: '/categories' },
      { label: 'Clothing Channel', href: '/categories' },
      { label: 'Accessories Channel', href: '/categories' },
    ],
  },
  partners: {
    label: 'Suppliers & Partners',
    links: [
      { label: 'Become a Supplier', href: '/suppliers' },
      { label: 'Supplier Application', href: '/suppliers#application-form' },
      { label: 'Marketplace Partners', href: '/about#marketplaces' },
      { label: 'Supplier Portal Sign In', href: '/supplier/login' },
    ],
  },
  company: {
    label: 'Company Information',
    links: [
      { label: 'About WALIM LTD', href: '/about' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'Help & FAQ', href: '/faq' },
    ],
  },
  legal: {
    label: 'Legal & Policies',
    links: [
      { label: 'Privacy Policy', href: '/legal/privacy' },
      { label: 'Terms & Conditions', href: '/legal/terms' },
      { label: 'Shipping Policy', href: '/legal/shipping' },
      { label: 'Returns & Refund Policy', href: '/legal/returns' },
    ],
  },
};

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-300">

      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-8">

          {/* Brand & Address Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block text-white font-black uppercase tracking-[0.2em] text-xl mb-3">
              WALIM LTD
            </Link>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">
              Online Retail &amp; Digital Commerce
            </p>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm mb-6">
              WALIM LTD is a UK-registered private limited company focused on developing online retail operations, digital storefronts, and supplier partnership networks.
            </p>

            {/* Official Credentials, Phone & Address Box */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 text-xs space-y-3 max-w-sm shadow-xl">
              <div className="flex items-center gap-2 text-slate-300">
                <span className="font-bold text-white">Company Name:</span>
                <span>WALIM LTD</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <span className="font-bold text-white">UK Company No:</span>
                <span className="font-mono text-indigo-400 font-bold">17383282</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <span className="font-bold text-white">Business Activity:</span>
                <span>Online Retail &amp; E-Commerce</span>
              </div>
              
              <div className="pt-2 border-t border-slate-700 space-y-1">
                <span className="font-bold text-white block">Registered Office Address:</span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Office 20409 182-184 High Street North, East Ham, London, United Kingdom, E6 2JA
                </p>
              </div>

              <div className="pt-2 border-t border-slate-700 space-y-1.5">
                <div className="flex items-center gap-2 text-slate-300">
                  <span className="font-bold text-white">Phone:</span>
                  <a href="tel:+447446373847" className="text-indigo-400 hover:underline font-mono font-bold">
                    +44 7446 373847
                  </a>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <span className="font-bold text-white">Email:</span>
                  <a href="mailto:walim204@gmail.com" className="text-indigo-400 hover:underline font-mono">
                    walim204@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Link Columns */}
          {Object.values(FOOTER_LINKS).map((section) => (
            <div key={section.label} className="lg:col-span-1">
              <h4 className="text-white font-bold text-xs uppercase tracking-[0.15em] mb-4">{section.label}</h4>
              <ul className="flex flex-col gap-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Legal Bar */}
      <div className="border-t border-slate-800 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">

          {/* Copyright & Registration */}
          <div className="text-center md:text-left">
            <p className="text-slate-400 text-xs">
              &copy; {new Date().getFullYear()} WALIM LTD. Registered in England &amp; Wales (Company No. 17383282). All rights reserved.
            </p>
            <p className="text-slate-500 text-[11px] mt-1">
              Office 20409 182-184 High Street North, East Ham, London, UK, E6 2JA &middot; Tel: +44 7446 373847
            </p>
          </div>

          {/* Legal links quick row */}
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <Link href="/legal/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/legal/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/legal/shipping" className="hover:text-white transition-colors">Shipping</Link>
            <Link href="/legal/returns" className="hover:text-white transition-colors">Returns</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
