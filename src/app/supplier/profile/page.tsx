import Link from 'next/link';

export default function SupplierProfilePage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="border-b border-zinc-900 pb-6">
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-indigo-400 block mb-1">
            Supplier Settings
          </span>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">Supplier Company Profile</h1>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-6">
          <h2 className="text-lg font-bold text-white uppercase tracking-tight border-b border-zinc-800 pb-3">Company Details</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div>
              <span className="text-zinc-500 font-semibold uppercase block mb-1">Company Status</span>
              <span className="text-indigo-400 font-bold">Registered Supplier Partner</span>
            </div>
            <div>
              <span className="text-zinc-500 font-semibold uppercase block mb-1">Default Shipping Region</span>
              <span className="text-zinc-200">United Kingdom &amp; EU</span>
            </div>
            <div>
              <span className="text-zinc-500 font-semibold uppercase block mb-1">Wholesale Availability</span>
              <span className="text-emerald-400 font-semibold">Active</span>
            </div>
            <div>
              <span className="text-zinc-500 font-semibold uppercase block mb-1">Fulfillment Channel</span>
              <span className="text-zinc-200">Direct Supplier Dispatch</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
