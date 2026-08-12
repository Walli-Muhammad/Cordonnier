import { getAdminSupplierApplications, reviewSupplierApplication } from '@/actions/admin';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export default async function AdminSuppliersPage() {
  const applications = await getAdminSupplierApplications();

  const handleApprove = async (formData: FormData) => {
    'use server';
    const id = formData.get('id') as string;
    await reviewSupplierApplication(id, 'APPROVED');
    revalidatePath('/admin/suppliers');
  };

  const handleReject = async (formData: FormData) => {
    'use server';
    const id = formData.get('id') as string;
    await reviewSupplierApplication(id, 'REJECTED');
    revalidatePath('/admin/suppliers');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 pt-28 pb-24 px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="border-b border-zinc-900 pb-6">
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-indigo-400 block mb-1">
            Supplier Governance
          </span>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">Supplier Applications &amp; Partners</h1>
          <p className="text-xs text-zinc-500 mt-1">Review partnership submissions, company credentials, and approve product suppliers.</p>
        </div>

        {applications.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-12 text-center text-xs text-zinc-500">
            No supplier applications submitted yet.
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app: any) => (
              <div key={app.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2 max-w-xl">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-white">{app.company_name}</h3>
                    <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded bg-zinc-800 text-amber-400">
                      {app.status}
                    </span>
                  </div>

                  <div className="text-xs text-zinc-400 space-y-1">
                    <p><strong className="text-zinc-300">Contact:</strong> {app.contact_person} &middot; {app.email} &middot; {app.phone || 'N/A'}</p>
                    <p><strong className="text-zinc-300">Location &amp; Web:</strong> {app.country} &middot; {app.website || 'No website provided'}</p>
                    <p><strong className="text-zinc-300">Categories:</strong> <span className="text-indigo-400">{app.categories?.join(', ')}</span></p>
                    {app.product_range && <p><strong className="text-zinc-300">Range:</strong> {app.product_range}</p>}
                    {app.registration_info && <p><strong className="text-zinc-300">Registration Info:</strong> {app.registration_info}</p>}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <form action={handleApprove}>
                    <input type="hidden" name="id" value={app.id} />
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider rounded-full transition-colors"
                    >
                      Approve Supplier
                    </button>
                  </form>

                  <form action={handleReject}>
                    <input type="hidden" name="id" value={app.id} />
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-zinc-800 hover:bg-red-900/50 text-zinc-300 hover:text-red-300 text-xs font-bold uppercase tracking-wider rounded-full transition-colors"
                    >
                      Reject
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
