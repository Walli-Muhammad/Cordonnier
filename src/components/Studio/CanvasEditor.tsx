'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useCartStore } from '@/store/cart';
import { createBrowserClient } from '@supabase/ssr';
import Image from 'next/image';

// ─── Constants ────────────────────────────────────────────────────────────────
const SIZES = ['EU 39', 'EU 40', 'EU 41', 'EU 42', 'EU 43', 'EU 44', 'EU 45'];

type ModelType = 'high-top' | 'low-top';

const MODELS: { id: ModelType; label: string; subtitle: string; price: number; image: string }[] = [
  {
    id: 'high-top',
    label: 'Classic High Top',
    subtitle: 'Canvas vulcanized construction with ankle-high silhouette',
    price: 5500,
    image: '/high-top-outer.png',
  },
  {
    id: 'low-top',
    label: 'Trendy Low Top',
    subtitle: 'Sleek low-profile build with premium mesh upper',
    price: 4800,
    image: '/low-top-outer.png',
  },
];

// Per-model angle filenames for the 2×2 grid
const MODEL_ANGLES: Record<ModelType, { file: string; label: string }[]> = {
  'high-top': [
    { file: '/high-top-outer.png', label: 'Outer' },
    { file: '/high-top-inner.png', label: 'Inner' },
    { file: '/high-top-back.png',  label: 'Back'  },
    { file: '/high-top-top.png',   label: 'Top'   },
  ],
  'low-top': [
    { file: '/low-top-outer.png',  label: 'Outer'  },
    { file: '/low-top-inner.png',  label: 'Inner'  },
    { file: '/low-top-top.png',    label: 'Top'    },
    { file: '/low-top-angled.png', label: 'Angled' },
  ],
};

// ─── Canvas Stitcher ──────────────────────────────────────────────────────────
// Loads 4 images and draws them onto a hidden 2×2 canvas, returns base64 PNG.
async function stitchGridImage(angles: { file: string }[]): Promise<string> {
  const CELL = 512; // each cell is 512×512 px → total canvas 1024×1024
  const canvas = document.createElement('canvas');
  canvas.width  = CELL * 2;
  canvas.height = CELL * 2;
  const ctx = canvas.getContext('2d')!;

  // Fill with white background so model sees clean panels
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Load all 4 images in parallel then draw them
  const loadImg = (src: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      img.onload  = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load ${src}`));
      img.src = src;
    });

  const images = await Promise.all(angles.map((a) => loadImg(a.file)));

  // Layout: [0]=top-left  [1]=top-right  [2]=bottom-left  [3]=bottom-right
  const positions = [
    { x: 0,    y: 0    },
    { x: CELL, y: 0    },
    { x: 0,    y: CELL },
    { x: CELL, y: CELL },
  ];

  images.forEach((img, i) => {
    // Draw each image scaled to fit the cell while maintaining aspect ratio
    const scale = Math.min(CELL / img.width, CELL / img.height);
    const w = img.width  * scale;
    const h = img.height * scale;
    const dx = positions[i].x + (CELL - w) / 2;
    const dy = positions[i].y + (CELL - h) / 2;
    ctx.drawImage(img, dx, dy, w, h);
  });

  // Draw subtle grid lines for visual separation (helps the model distinguish panels)
  ctx.strokeStyle = '#e5e7eb';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(CELL, 0);
  ctx.lineTo(CELL, CELL * 2);
  ctx.moveTo(0, CELL);
  ctx.lineTo(CELL * 2, CELL);
  ctx.stroke();

  return canvas.toDataURL('image/png');
}

// ─── Spinner ──────────────────────────────────────────────────────────────────
function SpinnerLoader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 rounded-full border-t-2 border-indigo-500 animate-spin" />
        <div className="absolute inset-2 rounded-full border-t-2 border-cyan-400 animate-spin"
          style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
        <div className="absolute inset-4 rounded-full border-t-2 border-violet-500 animate-spin"
          style={{ animationDuration: '2s' }} />
      </div>
      <div className="text-center">
        <h3 className="text-xl font-bold text-white tracking-widest uppercase mb-2">{title}</h3>
        <p className="text-indigo-400 text-sm animate-pulse">{subtitle}</p>
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function CanvasEditor() {
  const { addItem, openCart } = useCartStore();

  const [prompt,           setPrompt]           = useState('');
  const [selectedSize,     setSelectedSize]     = useState<string | null>(null);
  const [selectedModel,    setSelectedModel]    = useState<ModelType | null>(null);
  const [step,             setStep]             = useState<'select-model' | 'design' | 'result'>('select-model');
  const [isGenerating,     setIsGenerating]     = useState(false);
  const [generateError,    setGenerateError]    = useState<string | null>(null);
  const [resultImageUrl,   setResultImageUrl]   = useState<string | null>(null);
  const [saveStatus,       setSaveStatus]       = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [saveMessage,      setSaveMessage]      = useState<string | null>(null);
  const [creditsLeft,      setCreditsLeft]      = useState<number | null>(null); // null = loading
  const [isLoggedIn,       setIsLoggedIn]        = useState<boolean | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  // ── Fetch credits on mount ──────────────────────────────────────────────────
  const fetchCredits = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setIsLoggedIn(false); setCreditsLeft(null); return; }
    setIsLoggedIn(true);
    const { data } = await supabase
      .from('user_credits')
      .select('generation_credits')
      .eq('user_id', user.id)
      .single();
    setCreditsLeft(data?.generation_credits ?? 3);
  }, [supabase]);

  useEffect(() => { fetchCredits(); }, [fetchCredits]);

  const isLocked = isLoggedIn === true && creditsLeft !== null && creditsLeft <= 0;

  const handleDepositCTA = () => {
    // TODO: Replace with real Sadapay / Stripe redirect
    alert('Redirecting to payment gateway...\n\nYou will be charged Rs 500 as a deposit to unlock 10 more generations.');
  };

  const handleSelectModel = (model: ModelType) => {
    setSelectedModel(model);
    setResultImageUrl(null);
    setGenerateError(null);
    setStep('design');
  };

  // ── Generate ──────────────────────────────────────────────────────────────
  const handleGenerate = async () => {
    if (!prompt.trim() || !selectedModel || isGenerating || isLocked) return;

    setIsGenerating(true);
    setGenerateError(null);
    setResultImageUrl(null);

    try {
      // 1. Stitch the 4 base images into one grid on the client
      const angles   = MODEL_ANGLES[selectedModel];
      const gridImage = await stitchGridImage(angles);

      // 2. Send the grid + prompt to the API (single OpenRouter call)
      const res  = await fetch('/api/generate-preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, model: selectedModel, gridImage }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Generation failed');

      setResultImageUrl(data.imageUrl);
      // Update local credit count from the API response
      if (typeof data.creditsLeft === 'number') setCreditsLeft(data.creditsLeft);
      setStep('result');
    } catch (err: any) {
      // If the server returned a 403, update credits to 0 locally
      if (err.message?.includes('No generation credits')) {
        setCreditsLeft(0);
      }
      setGenerateError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsGenerating(false);
    }
  };

  const resetStudio = () => {
    setStep('select-model');
    setSelectedModel(null);
    setPrompt('');
    setResultImageUrl(null);
    setGenerateError(null);
    setSelectedSize(null);
  };

  // ── Cart ──────────────────────────────────────────────────────────────────
  const handleAddToCart = () => {
    if (!resultImageUrl || !selectedSize || !selectedModel) return;
    const meta = MODELS.find((m) => m.id === selectedModel)!;
    addItem({
      productId:     `ai-pod-${Date.now()}`,
      productTitle:  `AI Custom ${meta.label}`,
      productImage:  resultImageUrl,
      variantId:     `ai-pod-variant-${selectedSize}`,
      variant:       { size: selectedSize, color: 'Custom AI', color_hex: '#ffffff', sku: 'AI-POD', price_delta: 0 },
      basePrice:     meta.price,
      quantity:      1,
      podCustomizations: { Type: 'AI Custom', Model: selectedModel, Size: selectedSize, Prompt: prompt },
      isPod:         true,
    });
    openCart();
  };

  // ── Wardrobe ──────────────────────────────────────────────────────────────
  const handleSaveDesign = async () => {
    if (!resultImageUrl) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setSaveMessage('Please sign in to save designs to your Wardrobe.');
      setSaveStatus('error');
      setTimeout(() => { setSaveStatus('idle'); setSaveMessage(null); }, 4000);
      setTimeout(() => (window.location.href = '/login'), 1500);
      return;
    }
    setSaveStatus('saving');
    const { error } = await supabase.from('saved_designs').insert({
      user_id:        user.id,
      user_email:     user.email,
      image_snapshot: resultImageUrl,
      size:           selectedSize,
      color_label:    'Custom AI',
      color_hex:      '#ffffff',
    });
    setSaveMessage(error ? 'Failed to save. Please try again.' : 'Design saved to your Wardrobe! ✓');
    setSaveStatus(error ? 'error' : 'saved');
    setTimeout(() => { setSaveStatus('idle'); setSaveMessage(null); }, 3500);
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col lg:flex-row h-screen w-full bg-[#09090b] text-white pt-20">

      {/* ── Left: Main Viewer ─────────────────────────────────────────── */}
      <div className="flex-grow lg:w-[70%] h-full relative overflow-hidden flex items-center justify-center bg-[#07071a] p-4 lg:p-8">

        {/* MODEL SELECTION */}
        {step === 'select-model' && (
          <div className="w-full flex flex-col items-center justify-center h-full">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-black uppercase tracking-widest text-white mb-3 drop-shadow-[0_0_25px_rgba(99,102,241,0.5)]">
                Choose Your Model
              </h2>
              <p className="text-indigo-300/70 text-sm tracking-widest">
                Select a base silhouette to start designing
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
              {MODELS.map((m) => (
                <motion.button
                  key={m.id}
                  onClick={() => handleSelectModel(m.id)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                  className="relative flex flex-col bg-[#0d0d2b] rounded-2xl overflow-hidden ring-1 ring-indigo-900/40 hover:ring-indigo-500 hover:ring-2 shadow-xl hover:shadow-indigo-900/40 group text-left transition-shadow"
                >
                  <div className="relative w-full aspect-[4/3] bg-[#111136] overflow-hidden">
                    <Image
                      src={m.image}
                      alt={m.label}
                      fill
                      className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d2b]/80 to-transparent" />
                  </div>
                  <div className="p-6 flex flex-col gap-2">
                    <span className="text-xs uppercase tracking-widest text-indigo-400 font-semibold">Cordonnier</span>
                    <h3 className="text-xl font-black text-white tracking-tight">{m.label}</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">{m.subtitle}</p>
                    <p className="text-indigo-300 text-sm font-semibold mt-1">Rs {m.price.toLocaleString('en-PK')}</p>
                    <div className="mt-3 flex items-center gap-2 text-indigo-400 text-xs uppercase tracking-widest font-bold group-hover:text-white transition-colors">
                      <span>Select & Design</span>
                      <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* LOADING */}
        {isGenerating && (
          <SpinnerLoader
            title="Generating Design..."
            subtitle="Applying your design across all 4 angles via Gemini Flash"
          />
        )}

        {/* RESULT */}
        {step === 'result' && resultImageUrl && !isGenerating && (
          <div className="w-full flex flex-col items-center h-full max-h-[800px]">
            <div className="flex justify-between items-center w-full max-w-3xl mb-6">
              <h3 className="text-2xl font-bold text-white tracking-widest uppercase drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                Your Design
              </h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setStep('design')}
                  className="text-indigo-400 hover:text-white uppercase tracking-widest text-xs font-bold border-b border-transparent hover:border-indigo-400 transition-all pb-0.5"
                >
                  ← Re-generate
                </button>
                <button
                  onClick={resetStudio}
                  className="text-zinc-500 hover:text-white uppercase tracking-widest text-xs font-bold border-b border-transparent hover:border-white transition-all pb-0.5"
                >
                  Start Over
                </button>
              </div>
            </div>
            <div className="relative w-full max-w-3xl aspect-square rounded-2xl overflow-hidden ring-1 ring-indigo-900/30 shadow-2xl shadow-indigo-950/50">
              <Image
                src={resultImageUrl}
                alt="AI generated sneaker design grid"
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          </div>
        )}

        {/* DESIGN IDLE STATE */}
        {step === 'design' && !isGenerating && !resultImageUrl && (
          <div className="flex flex-col items-center justify-center opacity-50">
            <svg className="w-20 h-20 text-indigo-500 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            <h3 className="text-2xl font-black text-white tracking-widest uppercase mb-2">Ready to Design</h3>
            <p className="text-indigo-200/60 text-sm max-w-sm text-center">
              Describe your vision in the panel and hit Generate to see your custom {selectedModel === 'high-top' ? 'High Top' : 'Low Top'}.
            </p>
          </div>
        )}

        {/* ERROR */}
        {generateError && !isGenerating && (
          <div className="absolute top-6 flex flex-col items-center space-y-3 max-w-md text-center bg-[#0d0d2b]/95 p-5 rounded-2xl border border-red-500/30 shadow-2xl z-50">
            <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 mb-1">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-red-400 font-medium text-sm">{generateError}</p>
            <button onClick={() => setGenerateError(null)} className="px-4 py-1.5 bg-zinc-900 rounded text-xs uppercase tracking-widest hover:bg-zinc-800 transition-colors">
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* ── Right: Controls ───────────────────────────────────────────── */}
      <div className="w-full lg:w-[30%] lg:min-w-[320px] max-w-sm flex flex-col gap-6 p-10 border-l border-indigo-900/30 bg-[#0d0d2b] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-indigo-900/50 pb-4">
          <h2 className="text-xl font-bold uppercase tracking-widest text-white">AI Studio</h2>
          <div className="flex items-center gap-2">
            {/* Credits Badge */}
            {isLoggedIn && creditsLeft !== null && (
              <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full border ${
                creditsLeft <= 0
                  ? 'border-red-500/50 text-red-400 bg-red-500/10'
                  : creditsLeft === 1
                  ? 'border-yellow-500/50 text-yellow-400 bg-yellow-500/10'
                  : 'border-indigo-500/30 text-indigo-400 bg-indigo-500/10'
              }`}>
                {creditsLeft}/3 left
              </span>
            )}
            {isLoggedIn === false && (
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Sign in for credits</span>
            )}
            {selectedModel && step !== 'select-model' && (
              <button
                onClick={() => setStep('select-model')}
                className="text-[10px] uppercase tracking-widest text-indigo-400 hover:text-white border border-indigo-900/50 hover:border-indigo-500 px-2 py-1 rounded transition-colors"
              >
                ← Model
              </button>
            )}
          </div>
        </div>

        {/* Selected Model Badge */}
        {selectedModel && step !== 'select-model' && (() => {
          const meta = MODELS.find((m) => m.id === selectedModel)!;
          return (
            <div className="px-4 py-3 bg-[#111136] rounded-xl border border-indigo-900/30 flex items-center gap-3">
              <div className="relative w-12 h-12 shrink-0 bg-[#0d0d2b] rounded-lg overflow-hidden">
                <Image src={meta.image} alt="" fill className="object-contain p-1" unoptimized />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-indigo-400">Selected Model</span>
                <p className="text-sm font-bold text-white">{meta.label}</p>
              </div>
            </div>
          );
        })()}

        {/* Prompt */}
        {step !== 'select-model' && (
          <div>
            <label className="text-xs uppercase tracking-widest text-indigo-400 mb-3 block">Design Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={isLocked ? 'Unlock more generations to continue designing...' : 'E.g., Cyberpunk neon cityscape with glowing pink accents...'}
              rows={4}
              disabled={isGenerating || isLocked}
              className={`w-full bg-[#111136] border text-sm text-zinc-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 placeholder:text-zinc-600 resize-none transition ${
                isLocked
                  ? 'border-red-900/40 cursor-not-allowed opacity-40 focus:border-red-900/40 focus:ring-0'
                  : 'border-indigo-900/50 focus:border-indigo-500 focus:ring-indigo-500 disabled:opacity-50'
              }`}
            />
            {isLocked && (
              <p className="mt-2 text-xs text-red-400 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                You&apos;ve used all 3 free generations.
              </p>
            )}
          </div>
        )}

        {/* Size Selector */}
        {step !== 'select-model' && (
          <div>
            <label className="text-xs uppercase tracking-widest text-indigo-400 mb-3 block">Select Size</label>
            <div className="flex flex-wrap gap-2">
              {SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all duration-300 ${
                    selectedSize === size
                      ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]'
                      : 'bg-[#111136] border border-indigo-900/30 text-zinc-400 hover:bg-[#1a1a4a]'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-auto pt-6 border-t border-indigo-900/30 flex flex-col gap-4">

          {saveMessage && (
            <p className={`text-xs text-center font-medium px-3 py-2 rounded-lg ${
              saveStatus === 'saved' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
            }`}>
              {saveMessage}
            </p>
          )}

          {/* Generate Button — swaps to Deposit CTA when locked */}
          {(step === 'design' || step === 'result') && (
            isLocked ? (
              <button
                onClick={handleDepositCTA}
                className="w-full py-4 uppercase tracking-[0.1em] text-xs font-black transition-all duration-300 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black shadow-[0_0_25px_rgba(234,179,8,0.3)] hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Unlock Unlimited — Rs 500 Deposit
              </button>
            ) : (
              <button
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                className={`w-full py-3.5 uppercase tracking-[0.15em] text-xs font-bold transition-all duration-300 rounded-lg flex items-center justify-center gap-2 ${
                  prompt.trim() && !isGenerating
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)]'
                    : 'bg-[#111136] text-zinc-600 cursor-not-allowed border border-indigo-900/30'
                }`}
              >
                {isGenerating ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    GENERATING...
                  </>
                ) : '✨ GENERATE DESIGN'}
              </button>
            )
          )}

          {/* Cart Actions — only when result is ready */}
          {step === 'result' && resultImageUrl && (
            <>
              <button
                onClick={handleSaveDesign}
                disabled={!resultImageUrl || saveStatus === 'saving'}
                className={`w-full py-3 uppercase tracking-[0.15em] text-xs font-bold transition-all duration-300 rounded-lg flex items-center justify-center gap-2 border ${
                  resultImageUrl && saveStatus !== 'saving'
                    ? 'border-indigo-500/50 text-indigo-400 hover:text-white hover:bg-indigo-500/10'
                    : 'border-indigo-900/30 text-zinc-700 cursor-not-allowed'
                }`}
              >
                {saveStatus === 'saving' ? (
                  <>
                    <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Saving...
                  </>
                ) : <><span>🗂</span> Save to Wardrobe</>}
              </button>

              <button
                onClick={handleAddToCart}
                disabled={!resultImageUrl || !selectedSize}
                className={`w-full py-4 uppercase tracking-[0.2em] text-sm font-black transition-all duration-300 rounded-lg ${
                  resultImageUrl && selectedSize
                    ? 'bg-white text-black hover:bg-zinc-200 shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-[1.02]'
                    : 'bg-[#111136] text-zinc-600 cursor-not-allowed border border-indigo-900/30'
                }`}
              >
                ADD TO CART — Rs {MODELS.find((m) => m.id === selectedModel)?.price.toLocaleString('en-PK')}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}