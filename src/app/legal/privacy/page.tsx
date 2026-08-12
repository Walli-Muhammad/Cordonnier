import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | WALIM LTD',
  description: 'Privacy Policy for WALIM LTD (UK Company No. 17383282). Details on how data is collected and protected.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 pt-32 pb-24 px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        
        <div className="border-b border-zinc-900 pb-6">
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-indigo-400 block mb-2">Legal Document</span>
          <h1 className="text-4xl font-black text-white uppercase tracking-tight mb-2">Privacy Policy</h1>
          <p className="text-xs text-zinc-500 font-mono">WALIM LTD &middot; UK Company No. 17383282 &middot; Last updated: August 2026</p>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-xs text-amber-300">
          ⚠️ <strong>Notice:</strong> This Privacy Policy is an initial operational policy template provided for platform deployment and should be finalized by legal counsel prior to commercial launch.
        </div>

        <section className="space-y-4 text-sm leading-relaxed text-zinc-400">
          <h2 className="text-lg font-bold text-white uppercase tracking-tight">1. Overview</h2>
          <p>
            WALIM LTD (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates online retail and digital commerce channels. We respect your privacy and are committed to protecting the personal data of our website visitors, customers, and supplier partners in accordance with UK Data Protection legislation and the UK GDPR.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-zinc-400">
          <h2 className="text-lg font-bold text-white uppercase tracking-tight">2. Information We Collect</h2>
          <p>We may collect personal information including:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Contact information (Name, Email Address, Phone Number)</li>
            <li>Shipping and Billing Address details for customer orders</li>
            <li>Supplier application details (Company Name, Registration Info, Product Catalog Information)</li>
            <li>Technical data (IP Address, Browser Type, Session cookies for cart maintenance)</li>
          </ul>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-zinc-400">
          <h2 className="text-lg font-bold text-white uppercase tracking-tight">3. Use of Information</h2>
          <p>Information collected is strictly used to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Process retail customer orders and facilitate delivery</li>
            <li>Evaluate and process supplier applications</li>
            <li>Respond to customer support and corporate inquiries</li>
            <li>Maintain website security and prevent fraudulent transactions</li>
          </ul>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-zinc-400">
          <h2 className="text-lg font-bold text-white uppercase tracking-tight">4. Data Protection &amp; Contact</h2>
          <p>
            We do not sell personal data to third parties. For any data protection inquiries, please contact WALIM LTD at <a href="mailto:walim204@gmail.com" className="text-indigo-400 hover:underline">walim204@gmail.com</a>.
          </p>
        </section>

      </div>
    </div>
  );
}
