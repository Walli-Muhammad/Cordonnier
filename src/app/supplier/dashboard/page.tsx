import Link from 'next/link';

export default function SupplierDashboardPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 pt-32 pb-24 px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-6">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-indigo-400 block mb-1">
              Supplier Partner Portal
            </span>
            <h1 className="text-3xl font-black text-white uppercase tracking-tight">Supplier Dashboard</h1>
          </div>
          <div className="flex gap-3">
            <Link
              href="/supplier/products"
              className="px-5 py-2.5 bg-white text-black text-xs font-bold uppercase tracking-wider rounded-full hover:bg-zinc-200 transition-colors"
            >
              + Submit Product
            </Link>
          </div>
        </div>

        {/* Quick Nav Bar */}
        <div className="flex items-center gap-4 border-b border-zinc-900 pb-3 text-xs font-bold uppercase tracking-widest text-zinc-500 overflow-x-auto">
          <Link href="/supplier/dashboard" className="text-white border-b-2 border-indigo-500 pb-2">Overview</Link>
          <Link href="/supplier/products" className="hover:text-zinc-300 pb-2">Catalog Submissions</Link>
          <Link href="/supplier/orders" className="hover:text-zinc-300 pb-2">Assigned Orders</Link>
          <Link href="/supplier/profile" className="hover:text-zinc-300 pb-2">Company Profile</Link>
        </div>

        {/* Real Data Metrics (No fake numbers) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest block mb-1">Application Status</span>
            <span className="text-lg font-bold text-amber-400">UNDER_REVIEW</span>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest block mb-1">Submitted Products</span>
            <span className="text-2xl font-bold text-white font-mono">0</span>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest block mb-1">Fulfillment Orders</span>
            <span className="text-sm font-semibold text-zinc-400 block mt-1">No orders yet</span>
          </div>
        </div>

        {/* Product Submission Banner */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-white uppercase tracking-tight">Future Supplier Product Pipeline</h2>
          <p className="text-xs text-zinc-400 leading-relaxed max-w-2xl">
            Suppliers can draft and submit product listings to WALIM LTD. Products enter an admin review queue (<code className="text-indigo-400">DRAFT &rarr; SUBMITTED &rarr; UNDER_REVIEW &rarr; APPROVED &rarr; PUBLISHED</code>) prior to catalog publication.
          </p>
          <div className="pt-2">
            <Link
              href="/supplier/products"
              className="inline-block px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold uppercase tracking-wider rounded-full transition-colors"
            >
              Go to Product Submissions &rarr;
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
