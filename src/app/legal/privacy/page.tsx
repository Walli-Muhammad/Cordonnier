import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | WALIM LTD',
  description: 'Privacy policy and data protection governance for WALIM LTD.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-xl">
        <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900 mb-6">
          Privacy Policy
        </h1>
        <div className="space-y-6 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>
            <strong>WALIM LTD</strong> (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) is committed to protecting your privacy in compliance with UK GDPR and the Data Protection Act 2018.
          </p>
          <h2 className="text-base font-bold text-slate-900 pt-2">1. Data We Collect</h2>
          <p>
            We collect personal information necessary for processing orders, inquiries, and supplier applications, including names, contact details, delivery addresses, and business information.
          </p>
          <h2 className="text-base font-bold text-slate-900 pt-2">2. How We Use Data</h2>
          <p>
            Data is strictly used for order fulfillment, customer support, supplier onboarding, legal compliance, and service improvement. We do not sell personal data to third parties.
          </p>
          <h2 className="text-base font-bold text-slate-900 pt-2">3. Contact &amp; Rights</h2>
          <p>
            You have the right to request access, correction, or deletion of your personal data. For privacy inquiries, contact us at:
            <br />
            <strong>Official Email:</strong> walim204@gmail.com
            <br />
            <strong>Telephone:</strong> +44 7446 373847
            <br />
            <strong>Registered Address:</strong> Office 20409 182-184 High Street North, East Ham, London, United Kingdom, E6 2JA
          </p>
        </div>
      </div>
    </div>
  );
}
