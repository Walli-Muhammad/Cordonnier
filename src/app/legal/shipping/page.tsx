import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shipping Policy | WALIM LTD',
  description: 'Shipping and delivery policy for WALIM LTD orders.',
};

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-xl">
        <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900 mb-6">
          Shipping &amp; Delivery Policy
        </h1>
        <div className="space-y-6 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>
            <strong>WALIM LTD</strong> operates structured dispatch and fulfillment methods across our retail channels.
          </p>
          <h2 className="text-base font-bold text-slate-900 pt-2">1. Delivery Regions</h2>
          <p>
            Standard shipping covers the United Kingdom. International delivery regions depend on specific product supplier fulfillment configurations.
          </p>
          <h2 className="text-base font-bold text-slate-900 pt-2">2. Processing Times</h2>
          <p>
            Orders are dispatched within 2-3 business days. Delivery tracking updates are sent via email.
          </p>
        </div>
      </div>
    </div>
  );
}
