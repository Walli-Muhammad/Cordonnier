'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        
        <div className="mb-12">
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-indigo-400 block mb-3">
            WALIM LTD Communication
          </span>
          <h1 className="text-4xl font-black text-white uppercase tracking-tight mb-3">
            Contact &amp; Inquiries
          </h1>
          <p className="text-zinc-400 text-sm">
            Reach out to WALIM LTD for customer support, supplier partnerships, or corporate inquiries.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Contact Form */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-xl">
            <h2 className="text-lg font-bold text-white uppercase tracking-tight mb-6">Send Us A Message</h2>
            
            {submitted ? (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                  ✓
                </div>
                <h3 className="text-base font-bold text-white mb-2">Message Received</h3>
                <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                  Thank you for contacting WALIM LTD. Our team will review your inquiry and respond to <strong className="text-white">{form.email}</strong> shortly.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: 'General Inquiry', message: '' }); }}
                  className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold rounded-full transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 block mb-1.5">
                    Your Name <span className="text-indigo-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Jane Doe"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 block mb-1.5">
                    Email Address <span className="text-indigo-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="jane@example.com"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 block mb-1.5">
                    Inquiry Subject
                  </label>
                  <select
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Supplier Partnership">Supplier Partnership</option>
                    <option value="Customer Support & Orders">Customer Support &amp; Orders</option>
                    <option value="Corporate / Media">Corporate &amp; Media</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 block mb-1.5">
                    Message <span className="text-indigo-400">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="How can we help you?"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-white hover:bg-zinc-200 text-black font-bold uppercase text-xs tracking-[0.15em] rounded-full transition-all mt-2 active:scale-95 disabled:opacity-50"
                >
                  {loading ? 'Sending Message...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>

          {/* Official Company Details */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-8">
              <h2 className="text-lg font-bold text-white uppercase tracking-tight mb-6">WALIM LTD Contact Information</h2>
              
              <div className="space-y-5 text-sm">
                <div>
                  <span className="text-xs uppercase tracking-widest text-zinc-500 font-semibold block mb-1">Company Name</span>
                  <p className="text-white font-bold">WALIM LTD</p>
                </div>

                <div>
                  <span className="text-xs uppercase tracking-widest text-zinc-500 font-semibold block mb-1">UK Registration Number</span>
                  <p className="text-indigo-400 font-mono font-bold">17383282</p>
                </div>

                <div>
                  <span className="text-xs uppercase tracking-widest text-zinc-500 font-semibold block mb-1">Primary Business Contact</span>
                  <a href="mailto:walim204@gmail.com" className="text-indigo-400 hover:underline font-mono">
                    walim204@gmail.com
                  </a>
                </div>

                <div>
                  <span className="text-xs uppercase tracking-widest text-zinc-500 font-semibold block mb-1">Registered Office</span>
                  <p className="text-zinc-400 text-xs">Registered in England &amp; Wales. Official registered office records maintained with Companies House UK.</p>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-6 text-xs text-zinc-400 space-y-2">
              <span className="font-bold text-white block uppercase tracking-wider">Looking to become a supplier?</span>
              <p>Manufacturers and wholesalers can submit a partnership application through our dedicated portal.</p>
              <Link href="/suppliers" className="text-indigo-400 font-bold hover:underline inline-block pt-1">
                Go to Supplier Application &rarr;
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
