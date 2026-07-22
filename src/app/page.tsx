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

const LOGO = 'https://tendrlo.s3.ap-southeast-1.amazonaws.com/Blue+Modern+Playful+Typographic+Patisserie+Logo+.png';

export default function Home() {
  return (
    <main className="min-h-screen">

      {/* ===== HEADER ===== */}
      <header className="sticky top-0 z-50 glass border-b border-blueprint-100">
        {/* Desktop + Mobile top bar */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link href="/" className="font-display text-lg sm:text-xl font-semibold">
            tendrlo<span className="text-blueprint-500">.</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-500">
            <Link href="/projects" className="hover:text-ink">Browse projects</Link>
            <Link href="/companies" className="hover:text-ink">Find contractors</Link>
            <Link href="/pricing" className="hover:text-ink">Pricing</Link>
          </nav>

          {/* Auth buttons â€” visible on all sizes */}
          <div className="flex items-center gap-2">
            <Link href="/login" className="text-sm font-medium text-slate-500 hover:text-ink px-2 sm:px-3 py-2">
              Log in
            </Link>
            <Link href="/signup" className="rounded-card bg-blueprint-500 px-3 sm:px-4 py-2 text-sm font-medium text-white hover:bg-blueprint-600 transition-colors">
              Sign up
            </Link>
          </div>
        </div>

        {/* Mobile bottom nav bar */}
        <div className="md:hidden border-t border-blueprint-100 grid grid-cols-4 text-xs text-slate-500">
          <Link href="/projects" className="flex flex-col items-center gap-1 py-2 hover:text-blueprint-600 hover:bg-blueprint-50 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
            Browse
          </Link>
          <Link href="/companies" className="flex flex-col items-center gap-1 py-2 hover:text-blueprint-600 hover:bg-blueprint-50 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
            Contractors
          </Link>
          <Link href="/projects/new" className="flex flex-col items-center gap-1 py-2 hover:text-blueprint-600 hover:bg-blueprint-50 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4"/>
            </svg>
            Post
          </Link>
          <Link href="/pricing" className="flex flex-col items-center gap-1 py-2 hover:text-blueprint-600 hover:bg-blueprint-50 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Pricing
          </Link>
        </div>
      </header>

      {/* ===== HERO ===== */}
      <section className="bp-grid border-b border-blueprint-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-16">
          <div className="max-w-3xl">
            <img src={LOGO} alt="Tendrlo" className="h-14 sm:h-20 w-auto mb-4"/>
            <span className="inline-block rounded-full border border-blueprint-100 bg-blueprint-50 px-3 py-1 text-xs font-mono uppercase tracking-wider text-blueprint-600">
              B2B Tendering Marketplace
            </span>
            <h1 className="mt-4 font-display text-3xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-tight">
              Post the scope.<br/>Let contractors bid for it.
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-500 max-w-xl">
              Construction, engineering, food, materials, and more â€” post unlimited projects free, compare quotations side by side, award with a verified contractor.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link href="/signup?role=customer" className="rounded-card bg-blueprint-500 px-6 py-3.5 text-sm font-medium text-white hover:bg-blueprint-600 transition-colors text-center">
                Post a project â€” free
              </Link>
              <Link href="/signup?role=company" className="rounded-card border border-blueprint-200 bg-white px-6 py-3.5 text-sm font-medium text-ink hover:border-blueprint-500 transition-colors text-center">
                Register as a contractor
              </Link>
            </div>
            <dl className="mt-10 grid grid-cols-3 gap-4 max-w-sm font-mono">
              {[['27+','Categories'],['$0','Listing fee'],['Free','For all members']].map(([v,l])=>(
                <div key={l}>
                  <dt className="text-xs text-slate-500 uppercase tracking-wide">{l}</dt>
                  <dd className="text-xl sm:text-2xl font-semibold mt-1">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ===== STATS/IMAGES SECTION ===== */}
<section className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
    <div className="relative rounded-card overflow-hidden h-48 sm:h-64">
      <img src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80" alt="Construction" className="w-full h-full object-cover"/>
      <div className="absolute inset-0 bg-black/30 flex items-end p-3">
        <span className="text-white text-sm font-semibold">Construction</span>
      </div>
    </div>
    <div className="relative rounded-card overflow-hidden h-48 sm:h-64">
      <img src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&q=80" alt="Engineering" className="w-full h-full object-cover"/>
      <div className="absolute inset-0 bg-black/30 flex items-end p-3">
        <span className="text-white text-sm font-semibold">Engineering</span>
      </div>
    </div>
    <div className="relative rounded-card overflow-hidden h-48 sm:h-64">
      <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80" alt="HVAC" className="w-full h-full object-cover"/>
      <div className="absolute inset-0 bg-black/30 flex items-end p-3">
        <span className="text-white text-sm font-semibold">HVAC</span>
      </div>
    </div>
    <div className="relative rounded-card overflow-hidden h-48 sm:h-64">
      <img src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&q=80" alt="Civil Works" className="w-full h-full object-cover"/>
      <div className="absolute inset-0 bg-black/30 flex items-end p-3">
        <span className="text-white text-sm font-semibold">Civil Works</span>
      </div>
    </div>
  </div>
</section>

      {/* ===== CATEGORIES ===== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-14">
        <h2 className="font-display text-xl font-semibold mb-4">Popular categories</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map(c=>(
            <Link key={c}
              href={`/projects?category=${c.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'')}`}
              className="rounded-card border border-blueprint-100 bg-white px-3 sm:px-4 py-2 text-xs sm:text-sm hover:border-blueprint-500 hover:text-blueprint-600 transition-colors">
              {c}
            </Link>
          ))}
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="border-y border-blueprint-100 bg-blue-50/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-14">
          <h2 className="font-display text-xl font-semibold mb-8">How it works</h2>
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

      {/* ===== CTA ===== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-14">
        <div className="rounded-card bg-ink text-white p-6 sm:p-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-semibold">Ready to grow your business?</h2>
            <p className="mt-2 text-white/60 text-sm max-w-md">
              Join contractors and customers on Tendrlo. Post projects and receive bids â€” completely free.
            </p>
          </div>
          <Link href="/signup" className="shrink-0 rounded-card bg-white px-6 py-3 text-sm font-medium text-ink hover:bg-blue-50 transition-colors text-center">
            Get started free
          </Link>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
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

