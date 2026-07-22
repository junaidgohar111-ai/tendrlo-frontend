'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function MessagesPage() {
  const [convs, setConvs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        const d = await api('/messages/conversations');
        setConvs(d.conversations);
        const u = d.conversations.reduce((acc: number, c: any) => acc + Number(c.unread_count || 0), 0);
        setUnread(u);
      } catch {}
      finally { setLoading(false); }
    }
    load();
    const t = setInterval(load, 10000);
    return () => clearInterval(t);
  }, []);

  function timeAgo(d: string) {
    const m = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
    if (m < 1) return 'just now';
    if (m < 60) return m + 'm';
    const h = Math.floor(m / 60);
    if (h < 24) return h + 'h';
    return new Date(d).toLocaleDateString();
  }

  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-blueprint-100">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 py-4 flex items-center justify-between">
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
          <Link href="/dashboard" className="text-sm text-slate-500 hover:text-ink">Dashboard</Link>
        </div>
      </header>

      <section className="mx-auto max-w-2xl px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-5">
          <h1 className="font-display text-2xl font-semibold">Messages</h1>
          {unread > 0 && (
            <span className="rounded-full bg-red-500 text-white text-xs px-2.5 py-1 font-mono">
              {unread} unread
            </span>
          )}
        </div>

        {loading && <p className="text-slate-500 text-sm">Loading...</p>}

        {!loading && convs.length === 0 && (
          <div className="text-center py-16 rounded-card border border-blueprint-100">
            <p className="font-display font-semibold">No conversations yet</p>
            <p className="text-slate-500 text-sm mt-1">Conversations start when a customer contacts a contractor about a project.</p>
            <Link href="/projects" className="mt-4 inline-block text-sm text-blueprint-600 font-medium hover:underline">
              Browse projects
            </Link>
          </div>
        )}

        <div className="space-y-2">
          {convs.map((c: any) => (
            <Link key={c.id} href={`/messages/${c.id}`}
              className="flex items-center gap-4 rounded-card border border-blueprint-100 bg-white p-4 hover:border-blueprint-500 transition-colors">
              <div className="w-10 h-10 rounded-full bg-blueprint-100 flex items-center justify-center shrink-0 font-display font-bold text-blueprint-600">
                {c.company_name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-sm truncate">{c.company_name}</p>
                  {c.last_message_at && (
                    <span className="text-xs text-slate-400 font-mono shrink-0">{timeAgo(c.last_message_at)}</span>
                  )}
                </div>
                <p className="text-xs text-slate-400 truncate">{c.project_title}</p>
                {c.last_message && (
                  <p className="text-sm text-slate-500 truncate mt-0.5">{c.last_message}</p>
                )}
              </div>
              {Number(c.unread_count) > 0 && (
                <span className="shrink-0 w-5 h-5 rounded-full bg-blueprint-500 text-white text-xs flex items-center justify-center font-mono">
                  {c.unread_count}
                </span>
              )}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}