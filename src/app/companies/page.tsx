'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const p = new URLSearchParams();
    if (keyword) p.set('keyword', keyword);
    try { const d = await api(`/companies?${p}`); setCompanies(d.companies); } finally { setLoading(false); }
  }

  useEffect(()=>{ load(); },[]);

  function stars(r: string) {
    const n = Math.round(parseFloat(r)||0);
    return Array.from({length:5},(_,i)=><span key={i} className={i<n?'text-amber-500':'text-slate-200'}>★</span>);
  }

  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-blueprint-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2"><button onClick={() => window.history.back()} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"><svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg></button><Link href="/" className="font-display text-xl font-semibold">tendrlo<span className="text-blueprint-500">.</span></Link></div>
          <Link href="/projects/new" className="rounded-card bg-blueprint-500 px-4 py-2 text-sm font-medium text-white hover:bg-blueprint-600">Post project</Link>
        </div>
      </header>
      <section className="bp-grid border-b border-blueprint-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
          <h1 className="font-display text-3xl font-semibold">Find contractors</h1>
          <form onSubmit={e=>{e.preventDefault();load();}} className="mt-5 flex gap-3">
            <input placeholder="Search company name..." value={keyword} onChange={e=>setKeyword(e.target.value)}
              className="flex-1 rounded-card border border-blueprint-100 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blueprint-500"/>
            <button type="submit" className="rounded-card bg-ink px-5 py-2.5 text-sm font-medium text-white">Search</button>
          </form>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        {loading&&<p className="text-slate-500 text-sm">Loading...</p>}
        {!loading&&companies.length===0&&<p className="text-slate-500 text-sm">No contractors found.</p>}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {companies.map((c:any)=>(
            <Link key={c.id} href={`/companies/${c.id}`} className="crosshair rounded-card border border-blueprint-100 bg-white p-5 hover:border-blueprint-500 transition-colors">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-card bg-blueprint-50 flex items-center justify-center shrink-0 font-display font-bold text-blueprint-500">
                  {c.logo_url?<img src={c.logo_url} alt="" className="w-10 h-10 rounded-card object-cover"/>:c.company_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-display font-semibold text-sm">{c.company_name}</h2>
                    {c.is_verified&&<span className="rounded-full bg-blueprint-50 px-2 py-0.5 text-xs font-mono text-blueprint-600">Verified</span>}
                    {c.membership_tier==='premium'&&<span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-mono text-amber-500">Premium</span>}
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">{stars(c.avg_rating)}<span className="text-xs text-slate-500 ml-1">{parseFloat(c.avg_rating)>0?`${c.avg_rating} (${c.review_count})`:'No reviews'}</span></div>
                </div>
              </div>
              {c.about&&<p className="mt-3 text-sm text-slate-500 line-clamp-2">{c.about}</p>}
              <div className="mt-3 flex justify-between text-xs font-mono text-slate-500">
                {c.years_experience?<span>{c.years_experience} yrs exp</span>:<span>—</span>}
                {c.covered_cities?.length>0&&<span>{c.covered_cities.slice(0,2).join(', ')}</span>}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
