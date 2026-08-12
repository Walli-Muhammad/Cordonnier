import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions | WALIM LTD',
  description: 'Terms and conditions of service for WALIM LTD online retail platform.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-xl">
        <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900 mb-6">
          Terms &amp; Conditions
        </h1>
        <div className="space-y-6 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>
            Welcome to the official online retail platform of <strong>WALIM LTD</strong> (UK Company No. 17383282).
          </p>
          <h2 className="text-base font-bold text-slate-900 pt-2">1. Governing Law</h2>
          <p>
            These terms and conditions are governed by the laws of England and Wales.
          </p>
          <h2 className="text-base font-bold text-slate-900 pt-2">2. Supplier &amp; Retail Terms</h2>
          <p>
            Product listings and supplier applications submitted via this website are subject to verification, review, and authorization by WALIM LTD management.
          </p>
          <h2 className="text-base font-bold text-slate-900 pt-2">3. Corporate Information</h2>
          <p>
            <strong>WALIM LTD</strong>
            <br />
            UK Company Number: 17383282
            <br />
            Registered Office Address: Office 20409 182-184 High Street North, East Ham, London, United Kingdom, E6 2JA
            <br />
            Telephone: +44 7446 373847
            <br />
            Official Email: walim204@gmail.com
          </p>
        </div>
      </div>
    </div>
  );
}
