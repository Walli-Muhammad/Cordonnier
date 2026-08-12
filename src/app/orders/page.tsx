import Link from 'next/link';

export default function CustomerOrdersPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 pt-32 pb-24 px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <div className="border-b border-zinc-900 pb-6 flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-indigo-400 block mb-1">
              Order History &amp; Tracking
            </span>
            <h1 className="text-3xl font-black text-white uppercase tracking-tight">Your Orders</h1>
          </div>
          <Link href="/shop" className="text-xs font-bold uppercase tracking-wider text-indigo-400 hover:underline">
            Browse Store &rarr;
          </Link>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-zinc-800 text-zinc-500 flex items-center justify-center mx-auto text-xl font-bold">
            🛍️
          </div>
          <h2 className="text-lg font-bold text-white uppercase tracking-tight">No Previous Orders</h2>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed">
            You have not placed any retail orders on the WALIM LTD platform yet.
          </p>
          <div className="pt-4">
            <Link
              href="/shop"
              className="px-6 py-3 bg-white text-black text-xs font-bold uppercase tracking-wider rounded-full hover:bg-zinc-200 transition-colors inline-block"
            >
              Explore Products
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
