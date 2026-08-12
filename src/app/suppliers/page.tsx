'use client';

import { useState } from 'react';
import { submitSupplierApplication } from '@/actions/supplier';

export default function SuppliersPage() {
  const [submitting, setSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [form, setForm] = useState({
    company_name: '',
    contact_person: '',
    email: '',
    phone: '',
    country: 'United Kingdom',
    website: '',
    categories: [] as string[],
    product_range: '',
    wholesale_available: true,
    moq: 1,
    shipping_regions: ['United Kingdom'],
    fulfillment_method: 'Direct Supplier Fulfillment',
    registration_info: '',
    message: '',
  });

  const availableCategoryList = [
    'Footwear',
    'Clothing',
    'Accessories',
    'Home & Lifestyle',
    'Pet Products',
    'Other Consumer Products',
  ];

  const handleCategoryToggle = (cat: string) => {
    if (form.categories.includes(cat)) {
      setForm({ ...form, categories: form.categories.filter((c) => c !== cat) });
    } else {
      setForm({ ...form, categories: [...form.categories, cat] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);

    const res = await submitSupplierApplication(form);
    setSubmitting(false);

    if (res.success && res.applicationId) {
      setSubmittedId(res.applicationId);
    } else {
      setErrorMsg(res.error || 'Failed to submit application. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-14 text-center max-w-3xl mx-auto">
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-indigo-400 block mb-3">
            Supplier Partnership Program
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white uppercase tracking-tight mb-4">
            Become A WALIM LTD Supplier
          </h1>
          <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
            WALIM LTD is developing relationships with product suppliers, manufacturers, and wholesale distributors to expand our digital retail offering.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-white font-bold text-base mb-2">Digital Distribution</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              List products on WALIM LTD storefronts and access our expanding online customer base.
            </p>
          </div>
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-white font-bold text-base mb-2">Multi-Channel Growth</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Leverage multi-channel distribution integration including eBay and Amazon platform connectivity.
            </p>
          </div>
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-white font-bold text-base mb-2">Controlled Approval</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Structured catalog submissions with clear approval workflows and transparent status tracking.
            </p>
          </div>
        </div>

        {/* Application Form Box */}
        <div id="application-form" className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 sm:p-12 shadow-2xl">
          
          <div className="border-b border-zinc-800 pb-6 mb-8">
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">Supplier Application Form</h2>
            <p className="text-xs text-zinc-500 mt-1">Please provide accurate company and product catalog information for review.</p>
          </div>

          {submittedId ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-3xl font-bold mx-auto">
                ✓
              </div>
              <h3 className="text-2xl font-bold text-white uppercase tracking-tight">Application Submitted</h3>
              <p className="text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
                Thank you for applying to partner with WALIM LTD. Your application reference is <strong className="text-indigo-400 font-mono">{submittedId}</strong>. Our retail operations team will review your application.
              </p>
              <button
                onClick={() => setSubmittedId(null)}
                className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold uppercase tracking-wider rounded-full transition-colors mt-4"
              >
                Submit Another Application
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {errorMsg && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl font-semibold">
                  ⚠️ {errorMsg}
                </div>
              )}

              {/* Company Info Group */}
              <div className="space-y-4">
                <span className="text-xs uppercase font-bold tracking-widest text-indigo-400 block">01. Company Information</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-zinc-400 block mb-1">Company Name *</label>
                    <input
                      type="text"
                      required
                      value={form.company_name}
                      onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                      placeholder="Apex Trading Ltd"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-zinc-400 block mb-1">Contact Person *</label>
                    <input
                      type="text"
                      required
                      value={form.contact_person}
                      onChange={(e) => setForm({ ...form, contact_person: e.target.value })}
                      placeholder="John Smith"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-zinc-400 block mb-1">Business Email *</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="supplier@apextrading.co.uk"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-zinc-400 block mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+44 20 1234 5678"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-zinc-400 block mb-1">Country *</label>
                    <input
                      type="text"
                      required
                      value={form.country}
                      onChange={(e) => setForm({ ...form, country: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-zinc-400 block mb-1">Website URL</label>
                    <input
                      type="url"
                      value={form.website}
                      onChange={(e) => setForm({ ...form, website: e.target.value })}
                      placeholder="https://apextrading.co.uk"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Product Categories Group */}
              <div className="space-y-4 pt-4 border-t border-zinc-800">
                <span className="text-xs uppercase font-bold tracking-widest text-indigo-400 block">02. Product Categories &amp; Supply</span>
                
                <div>
                  <label className="text-xs font-semibold text-zinc-400 block mb-2">Select Supplied Categories *</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {availableCategoryList.map((cat) => (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => handleCategoryToggle(cat)}
                        className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all ${
                          form.categories.includes(cat)
                            ? 'bg-indigo-600/20 border-indigo-500 text-white'
                            : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
                        }`}
                      >
                        {form.categories.includes(cat) ? '✓ ' : '+ '}{cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-400 block mb-1">Product Range Description</label>
                  <textarea
                    rows={2}
                    value={form.product_range}
                    onChange={(e) => setForm({ ...form, product_range: e.target.value })}
                    placeholder="Brief summary of product lines, materials, and catalog size..."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-zinc-400 block mb-1">Minimum Order Quantity (MOQ)</label>
                    <input
                      type="number"
                      min={1}
                      value={form.moq}
                      onChange={(e) => setForm({ ...form, moq: parseInt(e.target.value) || 1 })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-zinc-400 block mb-1">Fulfillment Method</label>
                    <select
                      value={form.fulfillment_method}
                      onChange={(e) => setForm({ ...form, fulfillment_method: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="Direct Supplier Fulfillment">Direct Supplier Fulfillment</option>
                      <option value="WALIM Warehouse Dispatch">WALIM Warehouse Dispatch</option>
                      <option value="Drop Shipping">Drop Shipping</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Registration & Additional Message */}
              <div className="space-y-4 pt-4 border-t border-zinc-800">
                <span className="text-xs uppercase font-bold tracking-widest text-indigo-400 block">03. Business Registration &amp; Message</span>
                
                <div>
                  <label className="text-xs font-semibold text-zinc-400 block mb-1">Business Registration Info</label>
                  <input
                    type="text"
                    value={form.registration_info}
                    onChange={(e) => setForm({ ...form, registration_info: e.target.value })}
                    placeholder="UK Companies House Reg No / VAT Registration Number (if applicable)"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-400 block mb-1">Additional Message / Cover Note</label>
                  <textarea
                    rows={3}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Any specific partnership proposal or details..."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 resize-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-white hover:bg-zinc-200 text-black font-bold uppercase text-xs tracking-[0.15em] rounded-full transition-all shadow-xl active:scale-98 disabled:opacity-50"
              >
                {submitting ? 'Submitting Application...' : 'Submit Supplier Application'}
              </button>

            </form>
          )}

        </div>

      </div>
    </div>
  );
}
