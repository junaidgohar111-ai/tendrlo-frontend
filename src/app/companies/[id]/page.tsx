'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function CompanyPage() {
  const { id } = useParams<{id:string}>();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    api(`/companies/${id}`).then(setData).catch(console.error);
  }, [id]);

  if (!data) return <main className="min-h-screen flex items-center justify-center"><p className="text-slate-500">Loading...</p></main>;
  const { company: c, categories, reviews } = data;

  function stars(r: number) {
    return Array.from({length:5},(_,i)=><span key={i} className={i<r?'text-amber-500':'text-slate-200'}>★</span>);
  }

  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-blueprint-100">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2"><button onClick={() => window.history.back()} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"><svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg></button><Link href="/" className="font-display text-xl font-semibold">tendrlo<span className="text-blueprint-500">.</span></Link></div>
          <Link href="/companies" className="text-sm text-slate-500 hover:text-ink">← All contractors</Link>
        </div>
      </header>
      <div className="w-full h-32 bg-blueprint-50 bp-grid border-b border-blueprint-100">
        {c.cover_image_url&&<img src={c.cover_image_url} alt="" className="w-full h-full object-cover"/>}
      </div>
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex items-end gap-4 -mt-8 mb-6">
          <div className="w-16 h-16 rounded-card bg-white border-2 border-white shadow flex items-center justify-center shrink-0">
            {c.logo_url?<img src={c.logo_url} alt="" className="w-full h-full rounded-card object-cover"/>
              :<span className="font-display font-bold text-blueprint-500 text-2xl">{c.company_name.charAt(0).toUpperCase()}</span>}
          </div>
          <div className="pb-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-display text-2xl font-semibold">{c.company_name}</h1>
              {c.is_verified&&<span className="rounded-full bg-blueprint-50 border border-blueprint-100 px-2.5 py-0.5 text-xs font-mono text-blueprint-600">Verified</span>}
              {c.membership_tier==='premium'&&<span className="rounded-full bg-amber-50 border border-amber-100 px-2.5 py-0.5 text-xs font-mono text-amber-500">Premium</span>}
            </div>
            <div className="flex items-center gap-1 mt-1">{stars(Math.round(parseFloat(c.avg_rating)))}
              <span className="text-sm text-slate-500 ml-1">{parseFloat(c.avg_rating)>0?`${c.avg_rating}/5 (${c.review_count} reviews)`:'No reviews yet'}</span>
            </div>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-8 pb-16">
          <div className="md:col-span-2 space-y-8">
            {c.about&&<div><h2 className="font-display text-lg font-semibold mb-2">About</h2><p className="text-sm text-slate-500 leading-relaxed">{c.about}</p></div>}
            {categories.length>0&&(
              <div><h2 className="font-display text-lg font-semibold mb-3">Services</h2>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat:any)=><span key={cat.slug} className="rounded-full border border-blueprint-100 bg-blueprint-50 px-3 py-1 text-sm text-blueprint-600">{cat.name}</span>)}
                </div>
              </div>
            )}
            <div>
              <h2 className="font-display text-lg font-semibold mb-4">Reviews ({c.review_count})</h2>
              {reviews.length===0?<p className="text-sm text-slate-500">No reviews yet.</p>:(
                <div className="space-y-4">
                  {reviews.map((r:any,i:number)=>(
                    <div key={i} className="rounded-card border border-blueprint-100 p-5">
                      <div className="flex items-center justify-between">
                        <div className="flex gap-0.5">{stars(r.rating)}</div>
                        <span className="text-xs font-mono text-slate-500">{new Date(r.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 font-mono">Project: {r.project_title}</p>
                      {r.comment&&<p className="mt-2 text-sm text-ink/80">{r.comment}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded-card border border-blueprint-100 p-5">
              <h3 className="font-display font-semibold text-sm mb-3 text-slate-500 uppercase tracking-wide">At a glance</h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between"><dt className="text-slate-500">Projects done</dt><dd className="font-mono font-semibold">{c.projects_completed}</dd></div>
                <div className="flex justify-between"><dt className="text-slate-500">Experience</dt><dd className="font-mono font-semibold">{c.years_experience??'—'} yrs</dd></div>
                <div className="flex justify-between"><dt className="text-slate-500">Rating</dt><dd className="font-mono font-semibold">{parseFloat(c.avg_rating)>0?`${c.avg_rating}/5`:'—'}</dd></div>
                <div className="flex justify-between"><dt className="text-slate-500">Membership</dt><dd className="font-mono font-semibold capitalize">{c.membership_tier}</dd></div>
              </dl>
            </div>
            {c.covered_cities?.length>0&&(
              <div className="rounded-card border border-blueprint-100 p-5">
                <h3 className="font-display font-semibold text-sm mb-3 text-slate-500 uppercase tracking-wide">Covered cities</h3>
                <div className="flex flex-wrap gap-2">
                  {c.covered_cities.map((city:string)=><span key={city} className="rounded-full border border-blueprint-100 px-2.5 py-1 text-xs text-slate-500">{city}</span>)}
                </div>
              </div>
            )}
            {c.website_url&&(
              <div className="rounded-card border border-blueprint-100 p-5">
                <h3 className="font-display font-semibold text-sm mb-2 text-slate-500 uppercase tracking-wide">Website</h3>
                <a href={c.website_url} target="_blank" rel="noopener noreferrer" className="text-sm text-blueprint-600 hover:underline break-all">{c.website_url}</a>
              </div>
            )}
            <Link href="/projects/new" className="block rounded-card bg-ink text-white p-5 text-center">
              <p className="font-semibold text-sm">Need work done?</p>
              <p className="text-xs text-white/60 mt-1">Post a project for free</p>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
