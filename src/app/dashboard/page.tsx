'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, clearToken } from '@/lib/api';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    api('/auth/me').then(d => setUser(d.user)).catch(() => { window.location.href = '/login'; });
    loadUnread();
    const t = setInterval(loadUnread, 30000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (user?.role === 'customer') {
      api('/projects/my').then(d => setProjects(d.projects || [])).catch(() => {});
    }
  }, [user]);

  async function loadUnread() {
    try {
      const d = await api('/messages/conversations');
      const count = d.conversations.reduce((acc: number, c: any) => acc + Number(c.unread_count || 0), 0);
      setUnreadMessages(count);
    } catch {}
  }

  async function logout() {
    try { await api('/auth/logout', { method: 'POST' }); } catch {}
    clearToken();
    window.location.href = '/';
  }

  function formatBudget(p: any) {
    if (!p.budget_min && !p.budget_max) return 'Budget TBD';
    const min = p.budget_min ? Number(p.budget_min).toLocaleString() : null;
    const max = p.budget_max ? Number(p.budget_max).toLocaleString() : null;
    if (min && max) return min + ' - ' + max + ' ' + p.currency;
    if (min) return min + ' ' + p.currency;
    return max + ' ' + p.currency;
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

      <section className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
        <h1 className="font-display text-2xl sm:text-3xl font-semibold">Welcome, {user.full_name}</h1>
        <p className="text-slate-500 mt-1 text-sm font-mono uppercase">{user.role} account</p>

        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {user.role === 'customer' ? (
            <>
              <Link href="/projects/new" className="rounded-card border border-blueprint-100 bg-white p-5 hover:border-blueprint-500 transition-colors">
                <h2 className="font-display font-semibold">Post a project</h2>
                <p className="text-sm text-slate-500 mt-1">Free, unlimited.</p>
              </Link>
              <Link href="/projects" className="rounded-card border border-blueprint-100 bg-white p-5 hover:border-blueprint-500 transition-colors">
                <h2 className="font-display font-semibold">Browse projects</h2>
                <p className="text-sm text-slate-500 mt-1">See all open tenders.</p>
              </Link>
              <Link href="/messages" className="rounded-card border border-blueprint-100 bg-white p-5 hover:border-blueprint-500 transition-colors">
                <div className="flex items-center justify-between">
                  <h2 className="font-display font-semibold">Messages</h2>
                  {unreadMessages > 0 && (
                    <span className="rounded-full bg-red-500 text-white text-xs px-2 py-0.5 font-mono">{unreadMessages}</span>
                  )}
                </div>
                <p className="text-sm text-slate-500 mt-1">Chat with contractors.</p>
              </Link>
              <Link href="/companies" className="rounded-card border border-blueprint-100 bg-white p-5 hover:border-blueprint-500 transition-colors">
                <h2 className="font-display font-semibold">Find contractors</h2>
                <p className="text-sm text-slate-500 mt-1">Browse verified contractors.</p>
              </Link>
            </>
          ) : (
            <>
              <Link href="/projects" className="rounded-card border border-blueprint-100 bg-white p-5 hover:border-blueprint-500 transition-colors">
                <h2 className="font-display font-semibold">Browse tenders</h2>
                <p className="text-sm text-slate-500 mt-1">Find projects to bid on.</p>
              </Link>
              <Link href="/messages" className="rounded-card border border-blueprint-100 bg-white p-5 hover:border-blueprint-500 transition-colors">
                <div className="flex items-center justify-between">
                  <h2 className="font-display font-semibold">Messages</h2>
                  {unreadMessages > 0 && (
                    <span className="rounded-full bg-red-500 text-white text-xs px-2 py-0.5 font-mono">{unreadMessages}</span>
                  )}
                </div>
                <p className="text-sm text-slate-500 mt-1">Chat with customers.</p>
              </Link>
              <Link href="/companies" className="rounded-card border border-blueprint-100 bg-white p-5 hover:border-blueprint-500 transition-colors">
                <h2 className="font-display font-semibold">Find contractors</h2>
                <p className="text-sm text-slate-500 mt-1">Browse other contractors.</p>
              </Link>
              <Link href="/pricing" className="rounded-card border border-blueprint-100 bg-white p-5 hover:border-blueprint-500 transition-colors">
                <h2 className="font-display font-semibold">Pricing</h2>
                <p className="text-sm text-slate-500 mt-1">All features are free.</p>
              </Link>
            </>
          )}
        </div>

        {user.role === 'customer' && (
          <div className="mt-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-semibold">My Projects</h2>
              <Link href="/projects/new" className="rounded-card bg-blueprint-500 px-4 py-2 text-sm font-medium text-white hover:bg-blueprint-600 transition-colors">
                + Post new
              </Link>
            </div>
            {projects.length === 0 ? (
              <div className="rounded-card border border-blueprint-100 bg-white p-8 text-center">
                <p className="font-display font-semibold">No projects yet</p>
                <p className="text-slate-500 text-sm mt-1">Post your first project to start receiving bids.</p>
                <Link href="/projects/new" className="mt-4 inline-block rounded-card bg-blueprint-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-blueprint-600 transition-colors">
                  Post a project
                </Link>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {projects.map((p: any) => (
                  <div key={p.id} className="rounded-card border border-blueprint-100 bg-white p-5 hover:border-blueprint-500 transition-colors"><div className="flex items-start justify-between gap-2"><Link href={`/projects/${p.id}`} className="flex-1"><h3 className="font-display font-semibold text-sm">{p.title}</h3><p className="text-xs text-slate-500 mt-1">{p.location_city}</p><div className="mt-3 flex items-center justify-between text-xs font-mono text-slate-500"><span>{formatBudget(p)}</span><span>{p.bid_count} bid{p.bid_count !== '1' ? 's' : ''}</span></div></Link><div className="flex flex-col items-end gap-2"><span className={`rounded-full px-2.5 py-0.5 text-xs font-mono uppercase ${p.status==='open'?'bg-emerald-50 text-emerald-600':'bg-slate-100 text-slate-500'}`}>{p.status}</span><button onClick={async () => { if (!confirm('Delete this project? This cannot be undone.')) return; try { await api(`/projects/${p.id}`, { method: 'DELETE' }); setProjects(projects.filter((x: any) => x.id !== p.id)); } catch(e: any) { alert(e.message || 'Failed to delete.'); } }} className="text-xs text-red-500 hover:text-red-700 hover:underline">Delete</button></div></div></div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
