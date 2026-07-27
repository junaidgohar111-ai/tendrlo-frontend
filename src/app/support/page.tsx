'use client';
import Link from 'next/link';

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-blueprint-100">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-4 flex items-center gap-3">
          <button onClick={() => window.history.back()} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100">
            <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
          </button>
          <Link href="/" className="font-display text-xl font-semibold">tendrlo<span className="text-blueprint-500">.</span></Link>
        </div>
      </header>
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
        <h1 className="font-display text-3xl font-semibold mb-2">Support</h1>
        <p className="text-slate-500 mb-8">We are here to help. Reach out to us anytime.</p>
        <div className="space-y-6">
          <div className="rounded-card border border-blueprint-100 p-6">
            <h2 className="font-display font-semibold text-lg mb-1">Email Support</h2>
            <p className="text-slate-500 text-sm mb-2">Send us an email and we will respond within 24 hours.</p>
            <a href="mailto:support@tendrlo.com" className="text-blueprint-600 font-medium hover:underline">support@tendrlo.com</a>
          </div>
        
          <div className="rounded-card border border-blueprint-100 p-6">
            <h2 className="font-display font-semibold text-lg mb-3">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                { q:'Is it free to post a project?', a:'Yes! Posting projects is completely free. No credit card required.' },
                { q:'Is it free to bid on projects?', a:'Yes! Bidding on projects is free for all registered company accounts.' },
                { q:'How do I get verified?', a:'Upload your government registration certificate during signup. Our team will review and verify your account.' },
                { q:'How do I contact a contractor?', a:'After receiving bids, you can message contractors directly through the platform.' },
                { q:'What file types can I upload?', a:'PDF, DWG, Excel, images, and videos up to 80MB each.' },
              ].map((item, i) => (
                <div key={i} className="border-b border-blueprint-50 pb-4 last:border-0">
                  <p className="font-medium text-sm">{item.q}</p>
                  <p className="text-slate-500 text-sm mt-1">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
