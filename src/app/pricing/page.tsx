'use client';
import { useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';

const free = ['Browse all open projects','View project details','Save favourite projects','Company profile page','Search & filter projects'];
const premium = ['Everything in Free','Unlimited bid submissions','Upload quotations & BOQ','Verified company badge','Priority listing in search','Bid history & analytics','Direct chat with customers','Email & SMS notifications'];

export default function PricingPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function upgrade() {
    setError(''); setLoading(true);
    try { const d = await api('/payments/create-checkout-session',{method:'POST'}); window.location.href=d.url; }
    catch(e){ setError(e instanceof Error?e.message:'Make sure you are logged in as a company account.'); setLoading(false); }
  }

  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-blueprint-100">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-display text-xl font-semibold">tendrlo<span className="text-blueprint-500">.</span></Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-slate-500 hover:text-ink">Log in</Link>
            <Link href="/signup" className="rounded-card bg-blueprint-500 px-4 py-2 text-sm font-medium text-white hover:bg-blueprint-600">Sign up free</Link>
          </div>
        </div>
      </header>
      <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12 text-center">
        <h1 className="font-display text-3xl sm:text-4xl font-semibold">Simple, transparent pricing</h1>
        <p className="mt-3 text-slate-500 max-w-lg mx-auto">Customers post projects free, forever. Contractors need a Premium membership to bid.</p>
      </section>
      <section className="mx-auto max-w-4xl px-4 sm:px-6 pb-16">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-card border border-blueprint-100 bg-white p-7">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold">Free</h2>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-mono text-slate-500 uppercase">Current</span>
            </div>
            <div className="mt-3"><span className="font-display text-4xl font-semibold">$0</span><span className="text-slate-500 text-sm"> / month</span></div>
            <ul className="mt-7 space-y-3">
              {free.map(f=><li key={f} className="flex items-start gap-2 text-sm"><span className="text-emerald-600 mt-0.5">✓</span>{f}</li>)}
              <li className="flex items-start gap-2 text-sm text-slate-300"><span>✗</span>Bidding is FREE during launch period!</li>
            </ul>
            <div className="mt-7 rounded-card border border-blueprint-100 py-2.5 text-center text-sm font-medium text-slate-400">Your current plan</div>
          </div>
          <div className="rounded-card border-2 border-blueprint-500 bg-white p-7 relative">
            <span className="absolute -top-3 left-6 rounded-full bg-blueprint-500 px-3 py-1 text-xs font-medium text-white">Most popular</span>
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold">Premium</h2>
              <span className="rounded-full bg-blueprint-50 px-3 py-1 text-xs font-mono text-blueprint-600 uppercase">For contractors</span>
            </div>
            <div className="mt-3"><span className="font-display text-4xl font-semibold">$200</span><span className="text-slate-500 text-sm"> / month</span></div>
            <ul className="mt-7 space-y-3">
              {premium.map(f=><li key={f} className="flex items-start gap-2 text-sm"><span className="text-blueprint-500 mt-0.5">✓</span>{f}</li>)}
            </ul>
            {error&&<p className="mt-4 text-sm text-red-600">{error}</p>}
            <button onClick={upgrade} disabled={loading} className="mt-7 w-full rounded-card bg-blueprint-500 py-3 text-sm font-medium text-white hover:bg-blueprint-600 disabled:opacity-60 transition-colors">
              {loading?'Redirecting...':'Upgrade to Premium'}
            </button>
            <p className="mt-2 text-xs text-center text-slate-400">Secure payment via Stripe · Cancel anytime</p>
          </div>
        </div>
      </section>
    </main>
  );
}
