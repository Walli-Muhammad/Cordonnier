'use client';

import Link from 'next/link';
import { useCartStore } from '@/store/cart';
import { formatCurrency } from '@/lib/supabase';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, openCheckout } = useCartStore();

  const subtotal = getTotalPrice();
  const shipping = subtotal > 0 ? 4.99 : 0;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pt-32 pb-24 px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="border-b border-zinc-900 pb-6">
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-indigo-400 block mb-1">
            Shopping Basket
          </span>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">Your Cart</h1>
        </div>

        {items.length === 0 ? (
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-zinc-800 text-zinc-500 flex items-center justify-center text-2xl mx-auto">
              🛒
            </div>
            <h2 className="text-xl font-bold text-white uppercase tracking-tight">Your cart is empty</h2>
            <p className="text-xs text-zinc-500 max-w-xs mx-auto">
              Explore our multi-category product catalog and add items to your cart.
            </p>
            <div className="pt-2">
              <Link
                href="/shop"
                className="px-8 py-3.5 bg-white text-black font-bold text-xs uppercase tracking-wider rounded-full hover:bg-zinc-200 transition-colors inline-block"
              >
                Start Shopping
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.lineItemId}
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex gap-4 items-center"
                >
                  <div className="w-20 h-20 bg-zinc-950 rounded-xl overflow-hidden shrink-0">
                    {item.productImage ? (
                      <img src={item.productImage} alt={item.productTitle} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] font-mono text-zinc-600">
                        No IMG
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-white truncate">{item.productTitle}</h3>
                    <p className="text-xs font-mono text-indigo-400 mt-0.5">
                      {formatCurrency(item.basePrice, 'GBP')}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 border border-zinc-800 rounded-full px-3 py-1 bg-zinc-950">
                    <button
                      onClick={() => updateQuantity(item.lineItemId, item.quantity - 1)}
                      className="text-zinc-400 hover:text-white font-bold text-xs"
                    >
                      -
                    </button>
                    <span className="text-xs font-mono font-bold text-white px-1">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.lineItemId, item.quantity + 1)}
                      className="text-zinc-400 hover:text-white font-bold text-xs"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.lineItemId)}
                    className="p-2 text-zinc-500 hover:text-red-400 transition-colors text-sm"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary Column */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-6">
              <h2 className="text-lg font-bold text-white uppercase tracking-tight border-b border-zinc-800 pb-3">
                Order Summary
              </h2>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal</span>
                  <span className="font-mono text-white">{formatCurrency(subtotal, 'GBP')}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Standard UK Shipping</span>
                  <span className="font-mono text-white">{formatCurrency(shipping, 'GBP')}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-3 border-t border-zinc-800">
                  <span>Total</span>
                  <span className="font-mono text-indigo-400">{formatCurrency(total, 'GBP')}</span>
                </div>
              </div>

              <button
                onClick={openCheckout}
                className="w-full py-4 bg-white hover:bg-zinc-200 text-black font-bold uppercase text-xs tracking-[0.15em] rounded-full transition-all shadow-xl active:scale-98"
              >
                Proceed to Checkout
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
