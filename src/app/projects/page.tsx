'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import type { Project } from '@/lib/types';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [keyword, setKeyword] = useState('');
  const [city, setCity] = useState('');
  const [sort, setSort] = useState('newest');
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const p = new URLSearchParams();
    if (keyword) p.set('keyword', keyword.slice(0, 100));
    if (city) p.set('city', city.slice(0, 100));
    p.set('sort', sort);
    try {
      const d = await api(`/projects?${p}`);
      setProjects(d.projects);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function formatBudget(p: any) {
    if (!p.budget_min && !p.budget_max) return 'Budget TBD';
    const min = p.budget_min ? Number(p.budget_min).toLocaleString() : null;
    const max = p.budget_max ? Number(p.budget_max).toLocaleString() : null;
    if (min && max) return min + ' - ' + max + ' ' + p.currency;
    if (min) return min + ' ' + p.currency;
    return max + ' ' + p.currency;
  }

  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-blueprint-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 flex items-center justify-between">
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
          <Link href="/projects/new" className="rounded-card bg-blueprint-500 px-4 py-2 text-sm font-medium text-white hover:bg-blueprint-600">
            Post a project
          </Link>
        </div>
      </header>

      <section className="bp-grid border-b border-blueprint-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
          <h1 className="font-display text-2xl sm:text-3xl font-semibold mb-5">Open tenders</h1>
          <form onSubmit={e => { e.preventDefault(); load(); }} className="flex flex-wrap gap-2 sm:gap-3">
            <input
              placeholder="Search keyword..."
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              className="flex-1 min-w-[150px] rounded-card border border-blueprint-100 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blueprint-500"
            />
            <input
              placeholder="City"
              value={city}
              onChange={e => setCity(e.target.value)}
              className="w-32 rounded-card border border-blueprint-100 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blueprint-500"
            />
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="rounded-card border border-blueprint-100 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blueprint-500"
            >
              <option value="newest">Newest</option>
              <option value="closing_soon">Closing soon</option>
            </select>
            <button type="submit" className="rounded-card bg-ink px-5 py-2.5 text-sm font-medium text-white hover:bg-ink/90">
              Search
            </button>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        {loading && <p className="text-slate-500 text-sm">Loading...</p>}
        {!loading && projects.length === 0 && (
          <p className="text-slate-500 text-sm">No open projects match your search.</p>
        )}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p: any) => (
            <Link
              key={p.id}
              href={`/projects/${p.id}`}
              className="rounded-card border border-blueprint-100 bg-white hover:border-blueprint-500 transition-colors overflow-hidden"
            >
              {p.cover_image_url ? (
                <img
                  src={p.cover_image_url}
                  alt={p.title}
                  className="w-full h-40 object-cover"
                />
              ) : (
                <div className="w-full h-40 bg-blueprint-50 flex items-center justify-center">
                  <svg className="w-10 h-10 text-blueprint-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                  </svg>
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-display text-base font-semibold leading-snug">{p.title}</h2>
                  {p.category_name && (
                    <span className="shrink-0 rounded-full bg-blueprint-50 px-2 py-0.5 text-xs font-mono text-blueprint-600">
                      {p.category_name}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-slate-500 line-clamp-2">{p.description}</p>
                <div className="mt-3 flex items-center justify-between text-xs font-mono text-slate-500">
                  <span>{p.location_city}</span>
                  <span>{formatBudget(p)}</span>
                  <span>{p.bid_count} bid{p.bid_count !== '1' ? 's' : ''}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}