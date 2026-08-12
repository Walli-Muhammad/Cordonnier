import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'FAQ | WALIM LTD Frequently Asked Questions',
  description: 'Frequently asked questions regarding WALIM LTD online retail, ordering, shipping, and supplier partnerships.',
};

const FAQS = [
  {
    q: 'What is WALIM LTD?',
    a: 'WALIM LTD is a UK-registered private limited company (Company No. 17383282) focused on online retail, multi-category e-commerce, and digital sales channels.',
  },
  {
    q: 'What product categories does WALIM LTD sell?',
    a: 'Our product platform is built to support multi-category retail including Footwear, Clothing & Apparel, Accessories, Home & Lifestyle items, and Pet Products.',
  },
  {
    q: 'How do I become a product supplier or wholesale partner?',
    a: 'Product suppliers and manufacturers can apply through our public "Become a Supplier" portal. Submitted applications are reviewed by our retail operations team.',
  },
  {
    q: 'How are customer payments processed?',
    a: 'Orders are processed through secure digital payment integrations. During development and testing stages, transactions operate in test mode with no live charges.',
  },
  {
    q: 'What is the shipping and delivery policy?',
    a: 'Standard UK orders are typically processed and dispatched within 2-3 business days. Specific shipping information is displayed on each product detail page.',
  },
  {
    q: 'How can I contact WALIM LTD directly?',
    a: 'You can email our official corporate contact at walim204@gmail.com or send a message via our website contact form.',
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        
        <div className="mb-12">
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-indigo-400 block mb-3">
            Help &amp; Knowledge Base
          </span>
          <h1 className="text-4xl font-black text-white uppercase tracking-tight mb-3">
            Frequently Asked Questions
          </h1>
          <p className="text-zinc-400 text-sm">
            Common questions about WALIM LTD retail operations, orders, and supplier partnerships.
          </p>
        </div>

        <div className="space-y-6 mb-16">
          {FAQS.map((item, idx) => (
            <div key={idx} className="bg-zinc-900 border border-zinc-800/80 rounded-2xl p-6">
              <h3 className="text-base font-bold text-white mb-2 flex items-start gap-3">
                <span className="text-indigo-400 font-mono text-sm">0{idx + 1}.</span>
                <span>{item.q}</span>
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed pl-8">
                {item.a}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-8 text-center">
          <h3 className="text-lg font-bold text-white mb-2">Still have questions?</h3>
          <p className="text-xs text-zinc-500 mb-6">Our team is available to answer any additional inquiries.</p>
          <Link
            href="/contact"
            className="inline-block px-6 py-3 bg-white hover:bg-zinc-200 text-black font-bold uppercase text-xs tracking-wider rounded-full transition-colors"
          >
            Contact Support &rarr;
          </Link>
        </div>

      </div>
    </div>
  );
}
