'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/store/cart';

export default function DedicatedCheckoutPage() {
  const { openCheckout } = useCartStore();

  useEffect(() => {
    openCheckout();
  }, [openCheckout]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 pt-32 pb-24 px-6 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-8 h-8 border-2 border-zinc-700 border-t-indigo-500 rounded-full animate-spin mx-auto" />
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Opening Checkout Modal...</p>
      </div>
    </div>
  );
}
