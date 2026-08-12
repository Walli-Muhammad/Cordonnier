import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Returns Policy | WALIM LTD',
  description: 'Returns and refund policy for WALIM LTD orders.',
};

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-xl">
        <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900 mb-6">
          Returns &amp; Refund Policy
        </h1>
        <div className="space-y-6 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>
            Customer satisfaction is important to <strong>WALIM LTD</strong>. Customers in the UK have a 14-day statutory right to request a return or exchange.
          </p>
          <h2 className="text-base font-bold text-slate-900 pt-2">1. Return Eligibility</h2>
          <p>
            Items must be unused, in their original packaging, and in resaleable condition.
          </p>
          <h2 className="text-base font-bold text-slate-900 pt-2">2. How to Request a Return</h2>
          <p>
            Contact our customer support team at <strong>walim204@gmail.com</strong> or call <strong>+44 7446 373847</strong> with your order reference number.
          </p>
        </div>
      </div>
    </div>
  );
}
