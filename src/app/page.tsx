'use client';
import Link from 'next/link';

const categories = [
  'Construction','Electrical','HVAC','Civil','Plumbing','Steel Fabrication',
  'Facility Management','Manufacturing','Road Works','Equipment Rental',
  'Maintenance','IT','Food & Catering','Raw Materials','Furniture','Others',
];

const steps = [
  { n:'01', title:'Post your scope', body:'Describe the work, attach drawings or BOQ, set a budget and deadline. Free, always.' },
  { n:'02', title:'Receive sealed bids', body:'Verified contractors submit quotations. Compare side by side on price, timeline, and credentials.' },
  { n:'03', title:'Award with confidence', body:'Message bidders, clear questions, then award the project. Everything stays on the record.' },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      <header className="sticky top-0 z-50 glass border-b border-blueprint-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 flex items-center justify-between">
          <span className="font-display text-lg sm:text-xl font-semibold">tendrlo<span className="text-blueprint-500">.</span></span>
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-500">
            <Link href="/projects" className="hover:text-ink">Browse projects</Link>
            <Link href="/companies" className="hover:text-ink">Find contractors</Link>
            <Link href="/pricing" className="hover:text-ink">Membership</Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login" className="hidden sm:block text-sm font-medium text-slate-500 hover:text-ink">Log in</Link>
            <Link href="/signup" className="rounded-card bg-blueprint-500 px-3 sm:px-4 py-2 text-sm font-medium text-white hover:bg-blueprint-600 transition-colors">Post a project</Link>
          </div>
        </div>
      </header>

      <section className="bp-grid border-b border-blueprint-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-28">
          <div className="max-w-3xl">
            <span className="inline-block rounded-full border border-blueprint-100 bg-blueprint-50 px-3 py-1 text-xs font-mono uppercase tracking-wider text-blueprint-600">B2B Tendering Marketplace</span>
            <h1 className="mt-5 font-display text-3xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-tight">
              Post the scope.<br/>Let contractors bid for it.
            </h1>
            <p className="mt-5 text-base sm:text-lg text-slate-500 max-w-xl">
              Construction, engineering, food, materials, and more — post unlimited projects free, compare quotations side by side, award with a verified contractor.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link href="/signup?role=customer" className="rounded-card bg-blueprint-500 px-6 py-3.5 text-sm font-medium text-white hover:bg-blueprint-600 transition-colors text-center">Post a project — free</Link>
              <Link href="/signup?role=company" className="rounded-card border border-blueprint-200 bg-white px-6 py-3.5 text-sm font-medium text-ink hover:border-blueprint-500 transition-colors text-center">Register as a contractor</Link>
            </div>
            <dl className="mt-12 grid grid-cols-3 gap-6 max-w-sm font-mono">
              {[['27+','Categories'],['$0','Listing fee'],['Side by side','Bid review']].map(([v,l])=>(
                <div key={l}><dt className="text-xs text-slate-500 uppercase tracking-wide">{l}</dt><dd className="text-xl sm:text-2xl font-semibold mt-1">{v}</dd></div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16">
        <h2 className="font-display text-xl font-semibold mb-5">Popular categories</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map(c=>(
            <Link key={c} href={`/projects?category=${c.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'')}`}
              className="crosshair rounded-card border border-blueprint-100 bg-white px-4 py-2 text-sm hover:border-blueprint-500 hover:text-blueprint-600 transition-colors">
              {c}
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-blueprint-100 bg-blue-50/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16">
          <h2 className="font-display text-xl font-semibold mb-8 sm:mb-10">How it works</h2>
          <div className="grid sm:grid-cols-3 gap-6 sm:gap-10">
            {steps.map(s=>(
              <div key={s.n}>
                <span className="font-mono text-sm text-blueprint-500">{s.n}</span>
                <h3 className="font-display text-lg font-semibold mt-2">{s.title}</h3>
                <p className="mt-2 text-slate-500 text-sm leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16">
        <div className="rounded-card bg-ink text-white p-6 sm:p-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-semibold">Contractors bid with a Premium membership</h2>
            <p className="mt-2 text-white/60 text-sm max-w-md">Unlimited bidding, verified badge, priority listing, and analytics — $200/month.</p>
          </div>
          <Link href="/pricing" className="shrink-0 rounded-card bg-white px-6 py-3 text-sm font-medium text-ink hover:bg-blue-50 transition-colors text-center">View plans</Link>
        </div>
      </section>

      <footer className="border-t border-blueprint-100 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <span>© {new Date().getFullYear()} Tendrlo. All rights reserved.</span>
          <div className="flex gap-5">
            <Link href="/support" className="hover:text-ink">Support</Link>
            <Link href="/terms" className="hover:text-ink">Terms</Link>
            <Link href="/privacy" className="hover:text-ink">Privacy</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
