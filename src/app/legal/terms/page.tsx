import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions | WALIM LTD',
  description: 'Terms & Conditions of Service for WALIM LTD (UK Company No. 17383282).',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 pt-32 pb-24 px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        
        <div className="border-b border-zinc-900 pb-6">
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-indigo-400 block mb-2">Legal Document</span>
          <h1 className="text-4xl font-black text-white uppercase tracking-tight mb-2">Terms &amp; Conditions</h1>
          <p className="text-xs text-zinc-500 font-mono">WALIM LTD &middot; UK Company No. 17383282 &middot; Last updated: August 2026</p>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-xs text-amber-300">
          ⚠️ <strong>Notice:</strong> These Terms and Conditions constitute an initial template draft for deployment and must be reviewed and finalized prior to commercial operation.
        </div>

        <section className="space-y-4 text-sm leading-relaxed text-zinc-400">
          <h2 className="text-lg font-bold text-white uppercase tracking-tight">1. Company Details</h2>
          <p>
            This website is operated by WALIM LTD, a private limited company incorporated under the laws of England &amp; Wales with Company Registration Number <strong>17383282</strong>.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-zinc-400">
          <h2 className="text-lg font-bold text-white uppercase tracking-tight">2. Use of Platform</h2>
          <p>
            By accessing or using the WALIM LTD platform, shoppers and supplier partners agree to abide by all applicable UK laws, regulations, and these Terms of Service.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-zinc-400">
          <h2 className="text-lg font-bold text-white uppercase tracking-tight">3. Products &amp; Pricing</h2>
          <p>
            Prices displayed on the website are shown in GBP (&pound;) unless specified otherwise. We reserve the right to correct pricing errors or modify product availability at any time.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-zinc-400">
          <h2 className="text-lg font-bold text-white uppercase tracking-tight">4. Contact &amp; Governance</h2>
          <p>
            For questions concerning these Terms &amp; Conditions, please contact <a href="mailto:walim204@gmail.com" className="text-indigo-400 hover:underline">walim204@gmail.com</a>.
          </p>
        </section>

      </div>
    </div>
  );
}
