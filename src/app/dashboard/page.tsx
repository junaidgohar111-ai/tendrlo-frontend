'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, clearToken } from '@/lib/api';

export default function Dashboard() {
  const [user, setUser] = useState<{full_name:string;role:string;email:string}|null>(null);

  useEffect(() => {
    api('/auth/me').then(d=>setUser(d.user)).catch(()=>{ window.location.href='/login'; });
  }, []);

  async function logout() {
    try { await api('/auth/logout', { method:'POST' }); } catch {}
    clearToken();
    window.location.href = '/';
  }

  if (!user) return <main className="min-h-screen flex items-center justify-center"><p className="text-slate-500 text-sm">Loading...</p></main>;

  return (
    <main className="min-h-screen bp-grid">
      <header className="border-b border-blueprint-100 bg-white/90 glass">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-display text-xl font-semibold">tendrlo<span className="text-blueprint-500">.</span></Link>
          <div className="flex items-center gap-4">
            <Link href="/messages" className="text-sm text-slate-500 hover:text-ink">Messages</Link>
            <button onClick={logout} className="text-sm text-slate-500 hover:text-ink">Log out</button>
          </div>
        </div>
      </header>
      <section className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
        <h1 className="font-display text-2xl sm:text-3xl font-semibold">Welcome, {user.full_name}</h1>
        <p className="text-slate-500 mt-1 text-sm font-mono uppercase">{user.role} account</p>
        <div className="mt-8 grid sm:grid-cols-2 gap-4">
          {user.role==='customer'?<>
            <Link href="/projects/new" className="crosshair rounded-card border border-blueprint-100 bg-white p-6 hover:border-blueprint-500 transition-colors">
              <h2 className="font-display font-semibold">Post a project</h2>
              <p className="text-sm text-slate-500 mt-1">Free, unlimited. Get bids from verified contractors.</p>
            </Link>
            <Link href="/projects" className="crosshair rounded-card border border-blueprint-100 bg-white p-6 hover:border-blueprint-500 transition-colors">
              <h2 className="font-display font-semibold">Browse projects</h2>
              <p className="text-sm text-slate-500 mt-1">Review bids, message contractors, award work.</p>
            </Link>
          </>:<>
            <Link href="/projects" className="crosshair rounded-card border border-blueprint-100 bg-white p-6 hover:border-blueprint-500 transition-colors">
              <h2 className="font-display font-semibold">Browse open tenders</h2>
              <p className="text-sm text-slate-500 mt-1">Find projects in your service categories.</p>
            </Link>
            <Link href="/pricing" className="crosshair rounded-card border border-blueprint-100 bg-white p-6 hover:border-blueprint-500 transition-colors">
              <h2 className="font-display font-semibold">Upgrade to Premium</h2>
              <p className="text-sm text-slate-500 mt-1">Unlock unlimited bidding and verified badge.</p>
            </Link>
          </>}
        </div>
      </section>
    </main>
  );
}
