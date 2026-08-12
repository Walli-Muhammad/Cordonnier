import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shipping Policy | WALIM LTD',
  description: 'Shipping & Delivery Policy for WALIM LTD online retail orders.',
};

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 pt-32 pb-24 px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        
        <div className="border-b border-zinc-900 pb-6">
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-indigo-400 block mb-2">Legal Policy</span>
          <h1 className="text-4xl font-black text-white uppercase tracking-tight mb-2">Shipping Policy</h1>
          <p className="text-xs text-zinc-500 font-mono">WALIM LTD &middot; UK Company No. 17383282 &middot; Last updated: August 2026</p>
        </div>

        <section className="space-y-4 text-sm leading-relaxed text-zinc-400">
          <h2 className="text-lg font-bold text-white uppercase tracking-tight">1. Order Processing</h2>
          <p>
            Standard retail orders placed on the WALIM LTD platform are processed within 1-2 business days. Tracking details are provided upon dispatch.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-zinc-400">
          <h2 className="text-lg font-bold text-white uppercase tracking-tight">2. Shipping Regions &amp; Rates</h2>
          <p>
            Standard domestic UK shipping is available across England, Wales, Scotland, and Northern Ireland. Shipping fees are calculated at checkout based on total item weight and delivery method.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-zinc-400">
          <h2 className="text-lg font-bold text-white uppercase tracking-tight">3. Inquiries</h2>
          <p>
            If you have questions regarding shipping or tracking an existing order, please contact our support team at <a href="mailto:walim204@gmail.com" className="text-indigo-400 hover:underline">walim204@gmail.com</a>.
          </p>
        </section>

      </div>
    </div>
  );
}
