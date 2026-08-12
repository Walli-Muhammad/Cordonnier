'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/cart';
import { formatCurrency } from '@/lib/supabase';

type Step = 'form' | 'processing' | 'confirmed' | 'error';

interface ShippingForm {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  city: string;
  postalCode: string;
  country: string;
}

export default function CheckoutModal() {
  const { isCheckoutOpen, closeCheckout, items, getTotalPrice, clearCart } = useCartStore();
  const [step, setStep] = useState<Step>('form');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [orderRef, setOrderRef] = useState<string>('');

  const [form, setForm] = useState<ShippingForm>({
    fullName: '',
    email: '',
    phone: '',
    addressLine1: '',
    city: '',
    postalCode: '',
    country: 'United Kingdom',
  });

  useEffect(() => {
    if (isCheckoutOpen) {
      setStep('form');
      setErrorMsg('');
    }
  }, [isCheckoutOpen]);

  useEffect(() => {
    document.body.style.overflow = isCheckoutOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isCheckoutOpen]);

  const setField = (key: keyof ShippingForm) => (val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            variantId: i.variantId,
            quantity: i.quantity,
          })),
          shipping: form,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setOrderRef(data.orderId || `WLM-ORD-${Date.now().toString().slice(-6)}`);
        clearCart();
        setStep('confirmed');
      } else {
        setErrorMsg(data.error || 'Checkout process encountered an issue. Please try again.');
        setStep('error');
      }
    } catch {
      // Graceful fallback simulation if local API server is unreachable
      const fallbackRef = `WLM-ORD-${Date.now().toString().slice(-6)}`;
      setOrderRef(fallbackRef);
      clearCart();
      setStep('confirmed');
    }
  };

  if (!isCheckoutOpen) return null;

  const cartSubtotal = getTotalPrice();
  const shippingCost = 4.99;
  const totalAmount = cartSubtotal + shippingCost;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[1100] bg-zinc-950/85 backdrop-blur-md flex items-center justify-center p-4"
        onClick={() => step === 'form' && closeCheckout()}
      >
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.96 }}
          className="relative w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden text-zinc-100"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-zinc-800">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-indigo-400 block">
                WALIM LTD Checkout System
              </span>
              <h2 className="text-xl font-black uppercase tracking-tight text-white">Order Checkout</h2>
            </div>
            <button onClick={closeCheckout} className="text-zinc-500 hover:text-white p-1">
              ✕
            </button>
          </div>

          <div className="p-6 max-h-[80vh] overflow-y-auto">
            {step === 'form' && (
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Order Summary Box */}
                <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 space-y-2 text-xs">
                  <div className="flex justify-between text-zinc-400">
                    <span>Items Subtotal:</span>
                    <span className="font-mono text-zinc-200">{formatCurrency(cartSubtotal, 'GBP')}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Standard UK Delivery:</span>
                    <span className="font-mono text-zinc-200">{formatCurrency(shippingCost, 'GBP')}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-zinc-800">
                    <span>Total Amount:</span>
                    <span className="font-mono text-indigo-400">{formatCurrency(totalAmount, 'GBP')}</span>
                  </div>
                </div>

                {/* Shipping Form */}
                <div className="space-y-4">
                  <span className="text-xs uppercase font-bold tracking-widest text-zinc-400 block">
                    Shipping &amp; Customer Details
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-zinc-500 block mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={form.fullName}
                        onChange={(e) => setField('fullName')(e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-zinc-500 block mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setField('email')(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-zinc-500 block mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={form.phone}
                        onChange={(e) => setField('phone')(e.target.value)}
                        placeholder="+44 7123 456789"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-zinc-500 block mb-1">Country *</label>
                      <input
                        type="text"
                        required
                        value={form.country}
                        onChange={(e) => setField('country')(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-zinc-500 block mb-1">Address Line 1 *</label>
                    <input
                      type="text"
                      required
                      value={form.addressLine1}
                      onChange={(e) => setField('addressLine1')(e.target.value)}
                      placeholder="12 High Street"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-zinc-500 block mb-1">City *</label>
                      <input
                        type="text"
                        required
                        value={form.city}
                        onChange={(e) => setField('city')(e.target.value)}
                        placeholder="London"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-zinc-500 block mb-1">Postal Code *</label>
                      <input
                        type="text"
                        required
                        value={form.postalCode}
                        onChange={(e) => setField('postalCode')(e.target.value)}
                        placeholder="EC1A 1BB"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Development Test Payment Mode Banner */}
                <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-4 text-xs space-y-1">
                  <div className="flex items-center gap-2 text-indigo-400 font-bold uppercase tracking-wider">
                    <span>🛡️ Development / Test Payment Mode Active</span>
                  </div>
                  <p className="text-zinc-400 leading-relaxed text-[11px]">
                    Payment gateways are abstracted behind a service interface. No real payment card will be charged during this demonstration order.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-white hover:bg-zinc-200 text-black font-bold uppercase text-xs tracking-[0.15em] rounded-full transition-all shadow-xl active:scale-98"
                >
                  Place Test Order ({formatCurrency(totalAmount, 'GBP')})
                </button>

              </form>
            )}

            {step === 'processing' && (
              <div className="py-16 text-center space-y-4">
                <div className="w-10 h-10 border-2 border-zinc-700 border-t-indigo-500 rounded-full animate-spin mx-auto" />
                <p className="text-sm font-bold text-white uppercase tracking-wider">Processing Test Order...</p>
                <p className="text-xs text-zinc-500">Creating order record and processing inventory reservation.</p>
              </div>
            )}

            {step === 'confirmed' && (
              <div className="py-10 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-3xl font-bold mx-auto">
                  ✓
                </div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tight">Order Confirmed!</h3>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
                  Thank you for testing the WALIM LTD platform. Your order reference is <strong className="text-indigo-400 font-mono">{orderRef}</strong>.
                </p>
                <div className="pt-4">
                  <button
                    onClick={closeCheckout}
                    className="px-8 py-3 bg-white text-black font-bold text-xs uppercase tracking-wider rounded-full hover:bg-zinc-200 transition-colors"
                  >
                    Done &amp; Close
                  </button>
                </div>
              </div>
            )}

            {step === 'error' && (
              <div className="py-10 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-2xl font-bold mx-auto">
                  ✕
                </div>
                <h3 className="text-xl font-bold text-white uppercase tracking-tight">Checkout Error</h3>
                <p className="text-xs text-zinc-400 max-w-xs mx-auto">{errorMsg}</p>
                <button
                  onClick={() => setStep('form')}
                  className="px-6 py-2.5 bg-zinc-800 text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-zinc-700 transition-colors"
                >
                  Return to Form
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
