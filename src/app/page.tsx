'use client';
import { useEffect, useRef, useState } from 'react';
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

function useInView() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.05 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, inView };
}

export default function Home() {
  const [mounted, setMounted] = useState(true);
  const cats = useInView();
  const howIt = useInView();
  const cta = useInView();

  useEffect(() => { setMounted(true); }, []);

  return (
    <main className="min-h-screen overflow-hidden">

      {/* HEADER */}
      <header className="sticky top-0 z-50 glass border-b border-blueprint-100 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link href="/" className="font-display text-lg sm:text-xl font-semibold">
            tendrlo<span className="text-blueprint-500">.</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-500">
            <Link href="/projects" className="hover:text-ink transition-colors">Browse projects</Link>
            <Link href="/companies" className="hover:text-ink transition-colors">Find contractors</Link>
            <Link href="/pricing" className="hover:text-ink transition-colors">Pricing</Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login" className="text-sm font-medium text-slate-500 hover:text-ink px-2 sm:px-3 py-2 transition-colors">Log in</Link>
            <Link href="/signup" className="rounded-card bg-blueprint-500 px-3 sm:px-4 py-2 text-sm font-medium text-white hover:bg-blueprint-600 transition-all hover:shadow-lg hover:shadow-blueprint-500/25">
              Sign up
            </Link>
          </div>
        </div>
        {/* Mobile nav */}
        <div className="md:hidden border-t border-blueprint-100 grid grid-cols-4 text-xs text-slate-500">
          {[
            { href:'/projects', label:'Browse', icon:'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
            { href:'/companies', label:'Contractors', icon:'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
            { href:'/projects/new', label:'Post', icon:'M12 4v16m8-8H4' },
            { href:'/pricing', label:'Pricing', icon:'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
          ].map(item => (
            <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1 py-2 hover:text-blueprint-600 hover:bg-blueprint-50 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon}/>
              </svg>
              {item.label}
            </Link>
          ))}
        </div>
      </header>

      {/* HERO */}
      <section className="relative bp-grid border-b border-blueprint-100 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blueprint-500/5 rounded-full blur-3xl pointer-events-none"/>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blueprint-500/5 rounded-full blur-3xl pointer-events-none"/>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-12">
          <div className="max-w-3xl">
            <img
              src={LOGO}
              alt="Tendrlo"
              className={`h-12 sm:h-16 w-auto mb-6 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            />
            <span className={`inline-block rounded-full border border-blueprint-100 bg-blueprint-50 px-3 py-1 text-xs font-mono uppercase tracking-wider text-blueprint-600 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{transitionDelay:'100ms'}}>
              B2B Tendering Marketplace
            </span>
            <h1 className={`mt-4 font-display text-3xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-tight transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{transitionDelay:'200ms'}}>
              Post the scope.<br/>
              <span className="text-blueprint-500">Let contractors</span><br/>
              bid for it.
            </h1>
            <p className={`mt-4 text-base sm:text-lg text-slate-500 max-w-xl leading-relaxed transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{transitionDelay:'300ms'}}>
              Construction, engineering, food, materials, and more — post unlimited projects free, compare quotations side by side, award with a verified contractor.
            </p>
            <div className={`mt-8 flex flex-col sm:flex-row gap-3 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{transitionDelay:'400ms'}}>
              <Link href="/signup?role=customer"
                className="rounded-card bg-blueprint-500 px-6 py-3.5 text-sm font-medium text-white hover:bg-blueprint-600 transition-all text-center hover:shadow-xl hover:shadow-blueprint-500/30 hover:-translate-y-0.5">
                Post a project — free
              </Link>
              <Link href="/signup?role=company"
                className="rounded-card border border-blueprint-200 bg-white px-6 py-3.5 text-sm font-medium text-ink hover:border-blueprint-500 transition-all text-center hover:-translate-y-0.5 hover:shadow-md">
                Register as a contractor
              </Link>
            </div>
            <dl className={`mt-12 grid grid-cols-3 gap-4 max-w-sm font-mono transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{transitionDelay:'500ms'}}>
              {[['27+','Categories'],['$0','Listing fee'],['Free','For all']].map(([v,l])=>(
                <div key={l} className="group">
                  <dt className="text-xs text-slate-500 uppercase tracking-wide">{l}</dt>
                  <dd className="text-xl sm:text-2xl font-semibold mt-1 group-hover:text-blueprint-500 transition-colors">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* CATEGORY IMAGES */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { img:'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80', label:'Construction' },
            { img:'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&q=80', label:'Supply Chain' },
            { img:'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80', label:'Food & Catering' },
            { img:'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&q=80', label:'Maintenance' },
          ].map((item,i)=>(
            <Link key={i} href="/projects" className="relative rounded-card overflow-hidden h-40 sm:h-56 group cursor-pointer">
              <img src={item.img} alt={item.label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"/>
              <div className="absolute bottom-0 left-0 p-3">
                <span className="text-white text-sm font-semibold">{item.label}</span>
              </div>
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-blueprint-400 rounded-card transition-all duration-300"/>
            </Link>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section ref={cats.ref} className="mx-auto max-w-7xl px-4 sm:px-6 pb-10">
        <h2 className={`font-display text-xl font-semibold mb-5 transition-all duration-700 ${cats.inView?'opacity-100 translate-y-0':'opacity-0 translate-y-4'}`}>
          Popular categories
        </h2>
        <div className="flex flex-wrap gap-2">
          {categories.map((c,i)=>(
            <Link key={c}
              href={`/projects?category=${c.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'')}`}
              className={`rounded-card border border-blueprint-100 bg-white px-3 sm:px-4 py-2 text-xs sm:text-sm hover:border-blueprint-500 hover:text-blueprint-600 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 ${cats.inView?'opacity-100 translate-y-0':'opacity-0 translate-y-4'}`}
              style={{transitionDelay:`${i*30}ms`}}>
              {c}
            </Link>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section ref={howIt.ref} className="border-y border-blueprint-100 bg-gradient-to-br from-blue-50/50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16">
          <h2 className={`font-display text-xl font-semibold mb-10 transition-all duration-700 ${howIt.inView?'opacity-100 translate-y-0':'opacity-0 translate-y-4'}`}>
            How it works
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {steps.map((s,i)=>(
              <div key={s.n}
                className={`group relative p-6 rounded-card border border-blueprint-100 bg-white hover:border-blueprint-500 hover:shadow-xl hover:shadow-blueprint-500/10 hover:-translate-y-1 transition-all duration-300 ${howIt.inView?'opacity-100 translate-y-0':'opacity-0 translate-y-8'}`}
                style={{transitionDelay:`${i*150}ms`}}>
                <span className="font-mono text-3xl font-bold text-blueprint-100 group-hover:text-blueprint-200 transition-colors">{s.n}</span>
                <h3 className="font-display text-lg font-semibold mt-3">{s.title}</h3>
                <p className="mt-2 text-slate-500 text-sm leading-relaxed">{s.body}</p>
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-blueprint-500 rounded-full group-hover:w-full transition-all duration-500"/>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section ref={cta.ref} className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16">
        <div className={`relative rounded-card bg-ink text-white p-8 sm:p-12 overflow-hidden transition-all duration-700 ${cta.inView?'opacity-100 translate-y-0':'opacity-0 translate-y-8'}`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-blueprint-500/10 rounded-full blur-3xl pointer-events-none"/>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blueprint-500/10 rounded-full blur-3xl pointer-events-none"/>
          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold">Ready to grow your business?</h2>
              <p className="mt-2 text-white/60 text-sm max-w-md">
                Join contractors and customers on Tendrlo. Post projects and receive bids — completely free.
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-4">
                {['Free forever','No credit card','Instant access'].map(f=>(
                  <div key={f} className="flex items-center gap-1 text-xs text-white/60">
                    <svg className="w-3.5 h-3.5 text-blueprint-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                    </svg>
                    {f}
                  </div>
                ))}
              </div>
            </div>
            <Link href="/signup"
              className="shrink-0 rounded-card bg-white px-8 py-3.5 text-sm font-semibold text-ink hover:bg-blueprint-50 transition-all hover:shadow-2xl hover:-translate-y-0.5 text-center">
              Get started free →
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-blueprint-100 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <span>© {new Date().getFullYear()} Tendrlo. All rights reserved.</span>
          <div className="flex gap-5">
            <Link href="/support" className="hover:text-ink transition-colors">Support</Link>
            <Link href="/terms" className="hover:text-ink transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-ink transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

