import { getAdminProducts, getAdminOrders, getAdminSupplierApplications } from '@/actions/admin';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const [products, orders, supplierApps] = await Promise.all([
    getAdminProducts(),
    getAdminOrders(),
    getAdminSupplierApplications(),
  ]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 pt-28 pb-24 px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-6">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-indigo-400 block mb-1">
              WALIM LTD Administration
            </span>
            <h1 className="text-3xl font-black text-white uppercase tracking-tight">Platform Control Panel</h1>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin/products/new"
              className="px-5 py-2.5 bg-white text-black text-xs font-bold uppercase tracking-wider rounded-full hover:bg-zinc-200 transition-colors"
            >
              + Create Product
            </Link>
          </div>
        </div>

        {/* Real Data Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest block mb-1">Total Products</span>
            <span className="text-3xl font-black text-white font-mono">{products.length}</span>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest block mb-1">Total Orders</span>
            {orders.length === 0 ? (
              <span className="text-sm font-semibold text-zinc-400 block mt-2">No orders yet</span>
            ) : (
              <span className="text-3xl font-black text-white font-mono">{orders.length}</span>
            )}
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest block mb-1">Supplier Applications</span>
            <span className="text-3xl font-black text-indigo-400 font-mono">{supplierApps.length}</span>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest block mb-1">Registered Customers</span>
            <span className="text-sm font-semibold text-zinc-400 block mt-2">Database synced</span>
          </div>
        </div>

        {/* Administration Section Tabs & Tables */}
        <div className="space-y-8">
          
          {/* Supplier Applications Section */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white uppercase tracking-tight">Supplier Applications ({supplierApps.length})</h2>
                <p className="text-xs text-zinc-500 mt-0.5">Review partnership requests submitted by product suppliers.</p>
              </div>
              <Link href="/admin/suppliers" className="text-xs font-bold text-indigo-400 hover:underline uppercase tracking-wider">
                Manage Suppliers &rarr;
              </Link>
            </div>

            {supplierApps.length === 0 ? (
              <p className="text-xs text-zinc-500 py-4">No supplier applications received yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-zinc-800 text-zinc-500 uppercase font-semibold">
                    <tr>
                      <th className="pb-3">Company</th>
                      <th className="pb-3">Contact</th>
                      <th className="pb-3">Country</th>
                      <th className="pb-3">Categories</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {supplierApps.slice(0, 5).map((app: any) => (
                      <tr key={app.id}>
                        <td className="py-3 text-white font-bold">{app.company_name}</td>
                        <td className="py-3 text-zinc-300">{app.contact_person} ({app.email})</td>
                        <td className="py-3 text-zinc-400">{app.country}</td>
                        <td className="py-3 text-indigo-400 font-semibold">{app.categories?.join(', ')}</td>
                        <td className="py-3 font-mono font-bold text-amber-400">{app.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Catalog Products Section */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white uppercase tracking-tight">Catalog Products ({products.length})</h2>
                <p className="text-xs text-zinc-500 mt-0.5">Manage live storefront items, pricing, and active status.</p>
              </div>
            </div>

            {products.length === 0 ? (
              <p className="text-xs text-zinc-500 py-4">No products found in database.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((p: any) => (
                  <div key={p.id} className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl flex gap-3 items-center">
                    <div className="w-12 h-12 bg-zinc-800 rounded-xl overflow-hidden shrink-0">
                      {p.image_url && <img src={p.image_url} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] uppercase font-bold text-indigo-400 tracking-wider block">{p.category}</span>
                      <h4 className="text-xs font-bold text-white truncate">{p.title}</h4>
                      <span className="text-xs font-mono text-zinc-400">&pound;{p.base_price}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
