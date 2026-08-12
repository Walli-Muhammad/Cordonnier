'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-32 pb-20 px-6 bg-gradient-to-b from-zinc-950 via-[#0a0a14] to-zinc-950 overflow-hidden border-b border-zinc-900">
      
      {/* Background Radial Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
        
        {/* Registration Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-zinc-900/80 border border-zinc-800 text-xs font-semibold text-zinc-300 mb-8 backdrop-blur-md shadow-lg"
        >
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          <span>WALIM LTD &middot; UK Company No. 17383282</span>
        </motion.div>

        {/* Title & Tagline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-black text-white uppercase tracking-tight leading-[1.08] mb-6 max-w-4xl"
        >
          Online Retail &amp; Digital Commerce Platform
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-lg text-zinc-400 font-normal leading-relaxed max-w-2xl mb-10"
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
            className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-zinc-200 text-black font-bold uppercase text-xs tracking-[0.15em] rounded-full transition-all shadow-xl shadow-white/5 active:scale-95 text-center"
          >
            Explore Products
          </Link>

          <Link
            href="/suppliers"
            className="w-full sm:w-auto px-8 py-4 bg-zinc-900 hover:bg-zinc-800 text-white font-bold uppercase text-xs tracking-[0.15em] rounded-full border border-zinc-800 transition-all active:scale-95 text-center"
          >
            Become a Supplier
          </Link>
        </motion.div>

        {/* Operating Pillars */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl mt-20 pt-10 border-t border-zinc-900 text-left"
        >
          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-5">
            <span className="text-xs uppercase tracking-widest text-indigo-400 font-bold block mb-1">01 / Retail Channels</span>
            <h3 className="text-sm font-bold text-white mb-1">Multi-Category Storefront</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">Direct digital retail catalog spanning footwear, clothing, accessories, and home items.</p>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-5">
            <span className="text-xs uppercase tracking-widest text-indigo-400 font-bold block mb-1">02 / Suppliers</span>
            <span className="text-sm font-bold text-white mb-1 block">Partnership Network</span>
            <p className="text-xs text-zinc-500 leading-relaxed">Connecting manufacturers and product suppliers to digital retail customer demand.</p>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-5">
            <span className="text-xs uppercase tracking-widest text-indigo-400 font-bold block mb-1">03 / Marketplaces</span>
            <span className="text-sm font-bold text-white mb-1 block">Multi-Channel Growth</span>
            <p className="text-xs text-zinc-500 leading-relaxed">Architected for multi-channel listing, inventory sync, and marketplace operations.</p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
