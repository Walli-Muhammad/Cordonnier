'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center pt-32 pb-20 px-6 bg-gradient-to-b from-slate-50 via-indigo-50/40 to-slate-100/60 border-b border-slate-200/80 overflow-hidden">
      
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-indigo-500/10 via-violet-500/10 to-sky-400/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
        
        {/* Registration Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/90 border border-indigo-200/80 text-xs font-bold text-indigo-900 mb-8 backdrop-blur-md shadow-md shadow-indigo-900/5"
        >
          <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
          <span>WALIM LTD &middot; UK Company No. 17383282</span>
        </motion.div>

        {/* Title & Tagline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 uppercase tracking-tight leading-[1.08] mb-6 max-w-4xl"
        >
          Online Retail &amp; Digital Commerce Platform
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-2xl mb-10"
        >
          WALIM LTD develops and operates online retail channels, building multi-category digital storefronts while collaborating with product suppliers and global digital marketplace partners.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <Link
            href="/shop"
            className="w-full sm:w-auto px-9 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold uppercase text-xs tracking-[0.15em] rounded-full transition-all shadow-xl shadow-indigo-600/25 active:scale-95 text-center"
          >
            Explore Products
          </Link>

          <Link
            href="/suppliers"
            className="w-full sm:w-auto px-9 py-4 bg-white hover:bg-slate-100 text-slate-900 font-bold uppercase text-xs tracking-[0.15em] rounded-full border border-slate-300 transition-all shadow-md active:scale-95 text-center"
          >
            Become a Supplier
          </Link>
        </motion.div>

        {/* Operating Pillars Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl mt-16 pt-10 border-t border-slate-200/80 text-left"
        >
          <div className="bg-white/90 border border-slate-200/80 rounded-2xl p-6 shadow-xl shadow-slate-900/5">
            <span className="text-xs uppercase tracking-widest text-indigo-600 font-extrabold block mb-1">01 / Retail Channels</span>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Multi-Category Storefront</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Direct digital retail catalog spanning footwear, clothing, accessories, and home items.</p>
          </div>

          <div className="bg-white/90 border border-slate-200/80 rounded-2xl p-6 shadow-xl shadow-slate-900/5">
            <span className="text-xs uppercase tracking-widest text-indigo-600 font-extrabold block mb-1">02 / Suppliers</span>
            <span className="text-sm font-bold text-slate-900 mb-1 block">Partnership Network</span>
            <p className="text-xs text-slate-500 leading-relaxed">Connecting manufacturers and product suppliers to digital retail customer demand.</p>
          </div>

          <div className="bg-white/90 border border-slate-200/80 rounded-2xl p-6 shadow-xl shadow-slate-900/5">
            <span className="text-xs uppercase tracking-widest text-indigo-600 font-extrabold block mb-1">03 / Marketplaces</span>
            <span className="text-sm font-bold text-slate-900 mb-1 block">Multi-Channel Growth</span>
            <p className="text-xs text-slate-500 leading-relaxed">Architected for multi-channel listing, inventory sync, and marketplace operations.</p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
