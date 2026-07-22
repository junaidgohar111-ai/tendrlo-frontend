'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, clearToken } from '@/lib/api';

export default function Dashboard() {
  const [user, setUser] = useState<{full_name:string;role:string;email:string}|null>(null);
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    api('/auth/me').then(d=>setUser(d.user)).catch(()=>{ window.location.href='/login'; });
    loadUnread();
    const t = setInterval(loadUnread, 30000);
    return () => clearInterval(t);
  }, []);

  async function loadUnread() {
    try {
      const d = await api('/messages/conversations');
      const count = d.conversations.reduce((acc: number, c: any) => acc + Number(c.unread_count || 0), 0);
      setUnreadMessages(count);
    } catch {}
  }

  async function logout() {
    try { await api('/auth/logout', { method:'POST' }); } catch {}
    clearToken();
    window.location.href = '/';
  }

  if (!user) return (
    <main className="min-h-screen flex items-center justify-center">
      <p className="text-slate-500 text-sm">Loading...</p>
    </main>
  );

  return (
    <main className="min-h-screen bp-grid">
      <header className="border-b border-blueprint-100 bg-white/90 glass">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={() => window.history.back()} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors">
              <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
            <Link href="/" className="font-display text-xl font-semibold">
              tendrlo<span className="text-blueprint-500">.</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/messages" className="relative text-sm text-slate-500 hover:text-ink flex items-center gap-1">
              Messages
              {unreadMessages > 0 && (
                <span className="w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-mono">
                  {unreadMessages > 9 ? '9+' : unreadMessages}
                </span>
              )}
            </Link>
            <button onClick={logout} className="text-sm text-slate-500 hover:text-ink">Log out</button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
        <h1 className="font-display text-2xl sm:text-3xl font-semibold">Welcome, {user.full_name}</h1>
        <p className="text-slate-500 mt-1 text-sm font-mono uppercase">{user.role} account</p>

        <div className="mt-8 grid sm:grid-cols-2 gap-4">
          {user.role === 'customer' ? (
            <>
              <Link href="/projects/new" className="crosshair rounded-card border border-blueprint-100 bg-white p-6 hover:border-blueprint-500 transition-colors">
                <h2 className="font-display font-semibold">Post a project</h2>
                <p className="text-sm text-slate-500 mt-1">Free, unlimited. Get bids from verified contractors.</p>
              </Link>
              <Link href="/projects" className="crosshair rounded-card border border-blueprint-100 bg-white p-6 hover:border-blueprint-500 transition-colors">
                <h2 className="font-display font-semibold">Browse projects</h2>
                <p className="text-sm text-slate-500 mt-1">Review bids, message contractors, award work.</p>
              </Link>
              <Link href="/messages" className="crosshair rounded-card border border-blueprint-100 bg-white p-6 hover:border-blueprint-500 transition-colors">
                <div className="flex items-center justify-between">
                  <h2 className="font-display font-semibold">Messages</h2>
                  {unreadMessages > 0 && (
                    <span className="rounded-full bg-red-500 text-white text-xs px-2 py-0.5 font-mono">
                      {unreadMessages} new
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-500 mt-1">Chat with contractors about your projects.</p>
              </Link>
              <Link href="/companies" className="crosshair rounded-card border border-blueprint-100 bg-white p-6 hover:border-blueprint-500 transition-colors">
                <h2 className="font-display font-semibold">Find contractors</h2>
                <p className="text-sm text-slate-500 mt-1">Browse verified contractors by category.</p>
              </Link>
            </>
          ) : (
            <>
              <Link href="/projects" className="crosshair rounded-card border border-blueprint-100 bg-white p-6 hover:border-blueprint-500 transition-colors">
                <h2 className="font-display font-semibold">Browse open tenders</h2>
                <p className="text-sm text-slate-500 mt-1">Find projects in your service categories.</p>
              </Link>
              <Link href="/messages" className="crosshair rounded-card border border-blueprint-100 bg-white p-6 hover:border-blueprint-500 transition-colors">
                <div className="flex items-center justify-between">
                  <h2 className="font-display font-semibold">Messages</h2>
                  {unreadMessages > 0 && (
                    <span className="rounded-full bg-red-500 text-white text-xs px-2 py-0.5 font-mono">
                      {unreadMessages} new
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-500 mt-1">Chat with customers about their projects.</p>
              </Link>
              <Link href="/pricing" className="crosshair rounded-card border border-blueprint-100 bg-white p-6 hover:border-blueprint-500 transition-colors">
                <h2 className="font-display font-semibold">Pricing</h2>
                <p className="text-sm text-slate-500 mt-1">All features are free for all members.</p>
              </Link>
              <Link href="/companies" className="crosshair rounded-card border border-blueprint-100 bg-white p-6 hover:border-blueprint-500 transition-colors">
                <h2 className="font-display font-semibold">Find contractors</h2>
                <p className="text-sm text-slate-500 mt-1">Browse other verified contractors.</p>
              </Link>
            </>
          )}
        </div>
      </section>
    </main>
  );
}