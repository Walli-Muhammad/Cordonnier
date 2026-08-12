'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/cart';
import { useUIStore } from '@/store/ui';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { createBrowserClient } from '@supabase/ssr';
import type { User } from '@supabase/supabase-js';
import Sidebar from '@/components/Sidebar/Sidebar';

export default function Navbar() {
  const { toggleCart, getTotalItems } = useCartStore();
  const { toggleSearch } = useUIStore();
  const totalItems = getTotalItems();

  const [isMounted, setIsMounted] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
  );

  useEffect(() => {
    setIsMounted(true);
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return (
    <>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} user={user} />
      
      <motion.header
        variants={{
          visible: { y: 0, opacity: 1 },
          hidden: { y: "-150%", opacity: 0 },
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="fixed top-5 left-0 right-0 z-[980] flex justify-center px-4 pointer-events-none"
      >
        <div 
          className={`pointer-events-auto flex items-center justify-between px-6 py-3.5 rounded-full transition-all duration-500 ease-out border ${
            isScrolled 
              ? 'w-full max-w-5xl bg-white/90 backdrop-blur-xl border-slate-200/90 shadow-xl shadow-slate-900/5 text-slate-900' 
              : 'w-full max-w-7xl bg-white/70 backdrop-blur-md border-slate-200/60 shadow-lg shadow-slate-900/5 text-slate-900'
          }`}
        >
          {/* Left Side: Mobile Menu + Brand */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-1.5 -ml-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Open menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <Link
              href="/"
              className="flex items-center gap-2 font-black uppercase tracking-[0.2em] text-slate-900 text-base md:text-lg transition-transform hover:scale-[1.02]"
            >
              <span className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-700 bg-clip-text text-transparent font-black">
                WALIM LTD
              </span>
            </Link>
          </div>

          {/* Center Links (Desktop) */}
          <div className="hidden lg:flex items-center gap-7">
            <Link
              href="/shop"
              className="text-xs font-bold uppercase tracking-widest text-slate-600 hover:text-indigo-600 transition-colors"
            >
              Products / Shop
            </Link>
            <Link
              href="/categories"
              className="text-xs font-bold uppercase tracking-widest text-slate-600 hover:text-indigo-600 transition-colors"
            >
              Categories
            </Link>
            <Link
              href="/suppliers"
              className="text-xs font-bold uppercase tracking-widest text-slate-600 hover:text-indigo-600 transition-colors"
            >
              Supplier Partnership
            </Link>
            <Link
              href="/about"
              className="text-xs font-bold uppercase tracking-widest text-slate-600 hover:text-indigo-600 transition-colors"
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className="text-xs font-bold uppercase tracking-widest text-slate-600 hover:text-indigo-600 transition-colors"
            >
              Contact
            </Link>
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-3">
            
            {/* Direct Phone Number Badge */}
            <a
              href="tel:+447446373847"
              className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
            >
              <svg className="w-3.5 h-3.5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>+44 7446 373847</span>
            </a>

            {/* Search Trigger */}
            <button
              onClick={toggleSearch}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-slate-700 hover:text-slate-900 bg-slate-100/80 border border-slate-200 hover:bg-slate-200 transition-colors"
            >
              <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-widest text-slate-600">Search</span>
            </button>

            {/* Auth / Account Link */}
            {isMounted && (
              user ? (
                <div className="flex items-center gap-3">
                  <Link
                    href="/account"
                    className="text-xs font-bold uppercase tracking-widest text-indigo-600 hover:text-indigo-700 transition-colors hidden sm:block"
                  >
                    Account
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="text-[11px] font-medium uppercase tracking-wider text-slate-500 hover:text-red-600 transition-colors hidden md:block"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="text-xs font-bold uppercase tracking-widest text-slate-700 hover:text-indigo-600 transition-colors hidden sm:block"
                >
                  Sign In
                </Link>
              )
            )}

            <div className="w-px h-4 bg-slate-200 mx-1 hidden sm:block" />

            {/* Cart Button */}
            <button
              onClick={toggleCart}
              aria-label="Open cart"
              className="relative flex items-center gap-2 px-3 py-1.5 rounded-full text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/20 active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="text-xs font-bold tracking-wider hidden sm:block uppercase">Cart</span>
              {isMounted && totalItems > 0 && (
                <span className="bg-white text-indigo-600 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center tabular-nums shadow">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </motion.header>
    </>
  );
}
