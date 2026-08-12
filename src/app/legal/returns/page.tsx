import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Returns & Refund Policy | WALIM LTD',
  description: 'Returns, Exchanges, and Refund Policy for WALIM LTD online retail platform.',
};

export default function ReturnsPolicyPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 pt-32 pb-24 px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        
        <div className="border-b border-zinc-900 pb-6">
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-indigo-400 block mb-2">Legal Policy</span>
          <h1 className="text-4xl font-black text-white uppercase tracking-tight mb-2">Returns &amp; Refund Policy</h1>
          <p className="text-xs text-zinc-500 font-mono">WALIM LTD &middot; UK Company No. 17383282 &middot; Last updated: August 2026</p>
        </div>

        <section className="space-y-4 text-sm leading-relaxed text-zinc-400">
          <h2 className="text-lg font-bold text-white uppercase tracking-tight">1. 14-Day Return Window</h2>
          <p>
            Customers may request a return or exchange for eligible standard retail items within 14 days of delivery, provided items are unworn, undamaged, and in original packaging.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-zinc-400">
          <h2 className="text-lg font-bold text-white uppercase tracking-tight">2. Return Process</h2>
          <p>
            To initiate a return request, please contact our team at <a href="mailto:walim204@gmail.com" className="text-indigo-400 hover:underline">walim204@gmail.com</a> with your order reference number and reason for return.
          </p>
        </section>

      </div>
    </div>
  );
}
