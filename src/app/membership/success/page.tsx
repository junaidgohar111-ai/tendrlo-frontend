'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function MembershipSuccess() {
  const [count, setCount] = useState(5);
  useEffect(()=>{
    const t = setInterval(()=>setCount(c=>{ if(c<=1){ clearInterval(t); window.location.href='/dashboard'; } return c-1; }),1000);
    return ()=>clearInterval(t);
  },[]);
  return (
    <main className="min-h-screen bp-grid flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-card border border-blueprint-100 bg-white p-10 text-center">
        <div className="mx-auto w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mb-5">
          <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
        </div>
        <h1 className="font-display text-2xl font-semibold">You're now Premium!</h1>
        <p className="mt-2 text-slate-500 text-sm">Your membership is active. You can now submit unlimited bids on open projects.</p>
        <div className="mt-6 rounded-card bg-blueprint-50 border border-blueprint-100 p-4 text-left space-y-1.5">
          {['Unlimited bid submissions','Verified company badge','Priority listing in search','Bid history & analytics'].map(f=>(
            <p key={f} className="text-sm text-blueprint-700">✓ {f}</p>
          ))}
        </div>
        <Link href="/projects" className="mt-7 block w-full rounded-card bg-blueprint-500 py-3 text-sm font-medium text-white hover:bg-blueprint-600 transition-colors">Browse open projects</Link>
        <p className="mt-3 text-xs text-slate-400">Redirecting to dashboard in {count} seconds...</p>
      </div>
    </main>
  );
}
