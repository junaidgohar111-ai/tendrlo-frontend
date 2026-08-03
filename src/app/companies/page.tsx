'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const d = await api('/companies');
        setCompanies(d.companies);
        setFiltered(d.companies);
      } finally { setLoading(false); }
    }
    load();
  }, []);

  useEffect(() => {
    const s = search.toLowerCase();
    setFiltered(companies.filter((c) =>
      c.company_name?.toLowerCase().includes(s) ||
      c.covered_cities?.some((city: string) => city.toLowerCase().includes(s))
    ));
  }, [search, companies]);

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
          <Link href="/projects" className="text-sm text-slate-500 hover:text-ink">Browse projects</Link>
        </div>
      </header>

      <section className="bp-grid border-b border-blueprint-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
          <h1 className="font-display text-2xl sm:text-3xl font-semibold mb-5">Find contractors</h1>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by company name or city..."
            maxLength={100}
            className="w-full max-w-md rounded-card border border-blueprint-100 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blueprint-500"
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        {loading && <p className="text-slate-500 text-sm">Loading...</p>}
        {!loading && filtered.length === 0 && (
          <p className="text-slate-500 text-sm">No contractors found.</p>
        )}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c) => (
            <Link key={c.id} href={"/companies/" + c.id}
              className="rounded-card border border-blueprint-100 bg-white p-5 hover:border-blueprint-500 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                {c.logo_url ? (
                  <img src={c.logo_url} alt={c.company_name} className="w-10 h-10 rounded-card object-cover border border-blueprint-100"/>
                ) : (
                  <div className="w-10 h-10 rounded-card bg-blueprint-50 flex items-center justify-center">
                    <span className="font-display font-bold text-blueprint-600 text-sm">{c.company_name?.charAt(0)}</span>
                  </div>
                )}
                <div>
                  <h2 className="font-display font-semibold text-sm">{c.company_name}</h2>
                  {c.is_verified && (
                    <span className="text-xs text-emerald-600 font-mono">Verified</span>
                  )}
                </div>
              </div>
              {c.about && <p className="text-sm text-slate-500 line-clamp-2">{c.about}</p>}
              <div className="mt-3 flex items-center justify-between text-xs font-mono text-slate-400">
                {c.years_experience && <span>{c.years_experience} yrs exp</span>}
                {c.covered_cities?.length > 0 && <span>{c.covered_cities.slice(0,2).join(", ")}</span>}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}


