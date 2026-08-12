import Link from 'next/link';

export default function CustomerAccountPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 pt-32 pb-24 px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="border-b border-zinc-900 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-indigo-400 block mb-1">
              Customer Portal
            </span>
            <h1 className="text-3xl font-black text-white uppercase tracking-tight">Account Dashboard</h1>
          </div>
          <Link
            href="/orders"
            className="px-5 py-2.5 bg-zinc-800 text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-zinc-700 transition-colors w-fit"
          >
            View Order History &rarr;
          </Link>
        </div>

        {/* Dashboard Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest block mb-1">Total Orders</span>
            <span className="text-2xl font-bold text-white font-mono">0</span>
            <p className="text-xs text-zinc-500 mt-2">No active order history.</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest block mb-1">Saved Addresses</span>
            <span className="text-2xl font-bold text-white font-mono">0</span>
            <p className="text-xs text-zinc-500 mt-2">No saved shipping addresses.</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest block mb-1">Wishlist Items</span>
            <span className="text-2xl font-bold text-white font-mono">0</span>
            <p className="text-xs text-zinc-500 mt-2">No items in saved wishlist.</p>
          </div>
        </div>

        {/* Account Details Box */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-8 space-y-6">
          <h2 className="text-lg font-bold text-white uppercase tracking-tight border-b border-zinc-800 pb-3">
            Account &amp; Notification Preferences
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div>
              <span className="text-zinc-500 font-semibold uppercase block mb-1">Account Role</span>
              <span className="text-indigo-400 font-bold">CUSTOMER</span>
            </div>
            <div>
              <span className="text-zinc-500 font-semibold uppercase block mb-1">Account Status</span>
              <span className="text-emerald-400 font-semibold">Active &amp; Verified</span>
            </div>
            <div>
              <span className="text-zinc-500 font-semibold uppercase block mb-1">Order Dispatch Updates</span>
              <span className="text-zinc-200">Email &amp; SMS Notifications</span>
            </div>
            <div>
              <span className="text-zinc-500 font-semibold uppercase block mb-1">Preferred Currency</span>
              <span className="text-zinc-200">GBP (&pound;)</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
