'use client';
import Link from 'next/link';

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-blueprint-100">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={() => window.history.back()} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors">
              <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
            </button>
            <Link href="/" className="font-display text-xl font-semibold">tendrlo<span className="text-blueprint-500">.</span></Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-slate-500 hover:text-ink">Log in</Link>
            <Link href="/signup" className="rounded-card bg-blueprint-500 px-4 py-2 text-sm font-medium text-white hover:bg-blueprint-600">Sign up free</Link>
          </div>
        </div>
      </header>
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-16 text-center">
        <h1 className="font-display text-3xl sm:text-4xl font-semibold">Simple, transparent pricing</h1>
        <p className="mt-3 text-slate-500 max-w-lg mx-auto">All features are completely free for all members.</p>
      </section>
      <section className="mx-auto max-w-2xl px-4 sm:px-6 pb-16">
        <div className="rounded-card border-2 border-blueprint-500 bg-white p-8 text-center">
          <h2 className="font-display text-2xl font-semibold">Free for Everyone</h2>
          <p className="mt-2 text-slate-500">All features are available to all members at no cost.</p>
          <div className="mt-4 font-display text-5xl font-semibold text-blueprint-500">$0</div>
          <p className="text-slate-500 text-sm mt-1">for all members</p>
          <ul className="mt-8 space-y-3 text-left max-w-xs mx-auto">
            {['Post unlimited projects','Submit unlimited bids','Company profile page','Browse all projects','Direct messaging','File uploads'].map(f => (
              <li key={f} className="flex items-center gap-2 text-sm">
                <span className="text-emerald-600">✓</span>{f}
              </li>
            ))}
          </ul>
          <Link href="/signup" className="mt-8 block w-full rounded-card bg-blueprint-500 py-3 text-sm font-medium text-white hover:bg-blueprint-600 transition-colors">
            Get started free
          </Link>
          <p className="mt-3 text-xs text-slate-400">No credit card required.</p>
        </div>
      </section>
    </main>
  );
}