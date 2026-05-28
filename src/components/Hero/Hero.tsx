'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useScrambleText } from '@/hooks/useScrambleText';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Zap, Truck } from 'lucide-react';
import { useUIStore } from '@/store/ui';

const REVIEWS = [
  { text: "The sole print is flawless after months of wear. Zero cracking or peeling.", author: "Bilal A." },
  { text: "Designed my own pair in 10 minutes. Shipped in 3 days. Absolute fire.", author: "Hira Z." },
  { text: "Best custom sneakers in Pakistan. The AI preview sold me instantly.", author: "Kamran S." },
];

// Duplicate for infinite marquee loop
const MARQUEE_REVIEWS = [...REVIEWS, ...REVIEWS, ...REVIEWS];

export default function Hero() {
  const videoWrapRef = useRef<HTMLDivElement>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const { selectedCategory } = useUIStore();

  const targetText = selectedCategory ? selectedCategory.toUpperCase() : 'CORDONNIER';

  // Auto-decoding cipher — runs purely in JS
  const decodedText = useScrambleText(targetText, 2000, 500);

  const getCategorySubtitle = (category: string) => {
    if (category.toLowerCase() === 'hute') {
      return 'Classic High Top Shoes';
    }
    return `${category} Collection`;
  };

  const subtitleText = selectedCategory 
    ? getCategorySubtitle(selectedCategory)
    : 'Premium Custom Sneakers';

  const showHeadline = !hasInteracted || selectedCategory !== null;

  const videoSrc = selectedCategory?.toLowerCase() === 'hute' 
    ? '/hero-haute.mp4' 
    : '/hero-bg.mp4';

  // Initial video load animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(videoWrapRef.current, { opacity: 0, scale: 1.1, filter: 'blur(10px)' });
      gsap.to(videoWrapRef.current, {
        opacity: 1, scale: 1, filter: 'blur(0px)',
        duration: 2.2, ease: 'power3.out',
      });
    });
    return () => ctx.revert();
  }, []);

  // Listen for first interaction to trigger the stats/reviews overlay
  useEffect(() => {
    const handleInteract = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
      }
    };

    // Listen to wheel, touch, and click
    window.addEventListener('wheel', handleInteract, { once: true, passive: true });
    window.addEventListener('touchstart', handleInteract, { once: true, passive: true });
    window.addEventListener('click', handleInteract, { once: true, passive: true });

    return () => {
      window.removeEventListener('wheel', handleInteract);
      window.removeEventListener('touchstart', handleInteract);
      window.removeEventListener('click', handleInteract);
    };
  }, [hasInteracted]);

  return (
    <section className="relative flex h-screen w-full items-center justify-center overflow-hidden" style={{ background: 'var(--brand-bg-deep)' }}>
      {/* ── Cinematic Video Background ── */}
      <div
        ref={videoWrapRef}
        className="absolute inset-0 z-0 origin-center"
      >
        <video
          key={videoSrc}
          src={videoSrc}
          autoPlay loop muted playsInline preload="auto"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-b from-[#07071a]/50 via-transparent to-[#07071a]/70" />
      </div>

      <AnimatePresence mode="wait">
        {showHeadline ? (
          /* ── Typography Overlay ── */
          <motion.div
            key={`headline-${targetText}`}
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50, scale: 0.95 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4 pointer-events-none"
          >
            <h1
              className="text-[14vw] sm:text-[12vw] font-black tracking-[0.05em] text-white drop-shadow-2xl leading-none"
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {decodedText}
            </h1>
            <p className="mt-4 md:mt-8 max-w-lg text-xs md:text-base tracking-[0.4em] uppercase text-zinc-300 font-light text-center leading-relaxed">
              {subtitleText}
            </p>

            {/* Scroll/Click Indicator — only show on Cordonnier default state */}
            {!selectedCategory && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
              >
                <span className="text-[9px] tracking-[0.3em] uppercase text-zinc-400">Interact to Explore</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-zinc-400 to-transparent animate-pulse" />
              </motion.div>
            )}
          </motion.div>
        ) : (
          /* ── Animated Stats & Social Proof Overlay ── */
          <motion.div
            key="stats"
            initial={{ opacity: 0, filter: 'blur(10px)', scale: 1.05 }}
            animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#07071a]/30 backdrop-blur-[2px]"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 w-full max-w-4xl px-4 mt-12 md:mt-0">
              <div className="bg-[#0d0d2b]/80 backdrop-blur-md border border-indigo-900/50 rounded-xl p-6 flex flex-col items-center gap-3 shadow-2xl shadow-indigo-950/30">
                <Star className="w-8 h-8 text-yellow-400 drop-shadow-md" />
                <span className="text-white font-bold text-center text-sm uppercase tracking-wider">10K+ Satisfied Customers</span>
              </div>
              <div className="bg-[#0d0d2b]/80 backdrop-blur-md border border-indigo-900/50 rounded-xl p-6 flex flex-col items-center gap-3 shadow-2xl shadow-indigo-950/30">
                <Zap className="w-8 h-8 text-indigo-400 drop-shadow-md" />
                <span className="text-white font-bold text-center text-sm uppercase tracking-wider">Sneaker-Grade Print</span>
              </div>
              <div className="bg-[#0d0d2b]/80 backdrop-blur-md border border-indigo-900/50 rounded-xl p-6 flex flex-col items-center gap-3 shadow-2xl shadow-indigo-950/30">
                <Truck className="w-8 h-8 text-cyan-400 drop-shadow-md" />
                <span className="text-white font-bold text-center text-sm uppercase tracking-wider">Nationwide Delivery</span>
              </div>
            </div>

            {/* Infinite Marquee Reviews */}
            <div className="w-full mt-12 md:mt-20 overflow-hidden relative">
              {/* Fade edges */}
              <div className="absolute inset-y-0 left-0 w-12 md:w-32 bg-gradient-to-r from-transparent z-10 pointer-events-none" />
              <div className="absolute inset-y-0 right-0 w-12 md:w-32 bg-gradient-to-l from-transparent z-10 pointer-events-none" />
              
              <motion.div
                animate={{ x: [0, -1500] }}
                transition={{ 
                  repeat: Infinity, 
                  ease: "linear", 
                  duration: 30 
                }}
                className="flex flex-row items-center gap-6 w-max px-4 hover:[animation-play-state:paused]"
              >
                {MARQUEE_REVIEWS.map((review, idx) => (
                  <div
                    key={idx}
                    className="bg-[#0d0d2b]/90 backdrop-blur-xl border border-indigo-900/40 rounded-2xl p-6 w-[320px] sm:w-[380px] shrink-0 shadow-2xl shadow-indigo-950/30 pointer-events-auto cursor-default transition-transform hover:scale-[1.02]"
                  >
                    <div className="flex text-yellow-400 mb-3 gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-zinc-300 text-[15px] italic mb-4 leading-relaxed">&quot;{review.text}&quot;</p>
                    <p className="text-zinc-500 text-xs font-semibold uppercase tracking-widest">— {review.author}</p>
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
