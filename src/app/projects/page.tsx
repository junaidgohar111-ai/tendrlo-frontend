'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import type { Project } from '@/lib/types';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [keyword, setKeyword] = useState('');
  const [city, setCity] = useState('');
  const [sort, setSort] = useState('newest');
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const p = new URLSearchParams();
    if (keyword) p.set('keyword', keyword.slice(0,100));
    if (city) p.set('city', city.slice(0,100));
    p.set('sort', sort);
    try { const d = await api(`/projects?${p}`); setProjects(d.projects); } finally { setLoading(false); }
  }

  useEffect(()=>{ load(); },[]);

  function fmt(p:Project) {
    if (!p.budget_min && !p.budget_max) return 'Budget TBD';
    if (p.budget_min && p.budget_max) return `${Number(p.budget_min).toLocaleString()} – ${Number(p.budget_max).toLocaleString()} ${p.currency}`;
    return `${Number(p.budget_min||p.budget_max).toLocaleString()} ${p.currency}`;
  }

  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-blueprint-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-display text-xl font-semibold">tendrlo<span className="text-blueprint-500">.</span></Link>
          <Link href="/projects/new" className="rounded-card bg-blueprint-500 px-4 py-2 text-sm font-medium text-white hover:bg-blueprint-600">Post a project</Link>
        </div>
      </header>
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-10">
        <h1 className="font-display text-2xl sm:text-3xl font-semibold">Open tenders</h1>
        <form onSubmit={e=>{e.preventDefault();load();}} className="mt-5 flex flex-wrap gap-2 sm:gap-3">
          <input placeholder="Search keyword..." value={keyword} onChange={e=>setKeyword(e.target.value)}
            className="flex-1 min-w-[150px] rounded-card border border-blueprint-100 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blueprint-500"/>
          <input placeholder="City" value={city} onChange={e=>setCity(e.target.value)}
            className="w-32 rounded-card border border-blueprint-100 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blueprint-500"/>
          <select value={sort} onChange={e=>setSort(e.target.value)}
            className="rounded-card border border-blueprint-100 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blueprint-500">
            <option value="newest">Newest</option>
            <option value="closing_soon">Closing soon</option>
          </select>
          <button type="submit" className="rounded-card bg-ink px-5 py-2.5 text-sm font-medium text-white hover:bg-ink/90">Search</button>
        </form>
        <div className="mt-7 grid sm:grid-cols-2 gap-4">
          {loading&&<p className="text-slate-500 text-sm">Loading...</p>}
          {!loading&&projects.length===0&&<p className="text-slate-500 text-sm">No open projects match your search.</p>}
          {projects.map(p=>(
            <Link key={p.id} href={`/projects/${p.id}`}
              className="crosshair rounded-card border border-blueprint-100 bg-white p-5 sm:p-6 hover:border-blueprint-500 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-display text-base sm:text-lg font-semibold leading-snug">{p.title}</h2>
                {p.category_name&&<span className="shrink-0 rounded-full bg-blueprint-50 px-2.5 py-1 text-xs font-mono text-blueprint-600">{p.category_name}</span>}
              </div>
              <p className="mt-2 text-sm text-slate-500 line-clamp-2">{p.description}</p>
              <div className="mt-4 flex items-center justify-between text-xs font-mono text-slate-500">
                <span>{p.location_city}</span>
                <span>{fmt(p)}</span>
                <span>{p.bid_count} bid{p.bid_count!=='1'?'s':''}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
