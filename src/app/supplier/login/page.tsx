'use client';

import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SupplierLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
    } else {
      router.push('/supplier/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 flex items-center justify-center px-6 pt-24 pb-16">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl space-y-6">
        
        <div className="text-center">
          <span className="text-xs uppercase font-bold text-indigo-400 tracking-[0.2em] block mb-2">
            Supplier Portal Access
          </span>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight">Supplier Sign In</h1>
          <p className="text-xs text-zinc-500 mt-1">Manage catalog submissions, inventory, and order fulfillment.</p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl font-semibold">
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 block mb-1">
              Supplier Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="supplier@company.com"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 block mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-white hover:bg-zinc-200 text-black font-bold uppercase text-xs tracking-wider rounded-full transition-all active:scale-98 disabled:opacity-50"
          >
            {loading ? 'Signing In...' : 'Sign In to Portal'}
          </button>
        </form>

        <div className="pt-4 border-t border-zinc-800/80 text-center text-xs text-zinc-500">
          Not registered as a supplier yet?{' '}
          <Link href="/suppliers#application-form" className="text-indigo-400 hover:underline font-semibold">
            Apply Here &rarr;
          </Link>
        </div>

      </div>
    </div>
  );
}
