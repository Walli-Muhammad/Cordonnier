import Link from 'next/link';

export default function SupplierOrdersPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 pt-32 pb-24 px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="border-b border-zinc-900 pb-6">
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-indigo-400 block mb-1">
            Supplier Order Routing
          </span>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">Assigned Fulfillment Orders</h1>
          <p className="text-xs text-zinc-500 mt-1">Manage order fulfillment, tracking numbers, and dispatch notifications.</p>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-zinc-800 text-zinc-500 flex items-center justify-center mx-auto text-lg font-bold">
            📦
          </div>
          <h2 className="text-lg font-bold text-white uppercase tracking-tight">No Active Orders Assigned</h2>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed">
            When customer orders match your published supplier products, fulfillment requests and dispatch slips will appear here automatically.
          </p>
          <div className="pt-4">
            <Link href="/supplier/dashboard" className="text-xs font-bold uppercase tracking-wider text-indigo-400 hover:underline">
              Return to Supplier Dashboard &rarr;
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
