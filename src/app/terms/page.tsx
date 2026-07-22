import Link from 'next/link';

export default function TermsPage() {
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
        <h1 className="font-display text-3xl font-semibold mb-2">Terms of Service</h1>
        <p className="text-slate-500 text-sm mb-8">Last updated: July 2026</p>
        <div className="prose text-slate-700 space-y-6 text-sm leading-relaxed">
          <div>
            <h2 className="font-display font-semibold text-lg mb-2">1. Acceptance of Terms</h2>
            <p>By accessing and using Tendrlo, you accept and agree to be bound by these Terms of Service. If you do not agree, please do not use our platform.</p>
          </div>
          <div>
            <h2 className="font-display font-semibold text-lg mb-2">2. Use of Platform</h2>
            <p>Tendrlo is a B2B tendering marketplace that connects customers who need work done with contractors who can provide those services. Users must be at least 18 years old and provide accurate information.</p>
          </div>
          <div>
            <h2 className="font-display font-semibold text-lg mb-2">3. User Accounts</h2>
            <p>You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account.</p>
          </div>
          <div>
            <h2 className="font-display font-semibold text-lg mb-2">4. Prohibited Activities</h2>
            <p>Users may not post false or misleading information, spam other users, attempt to circumvent our platform for transactions, or engage in any illegal activities.</p>
          </div>
          <div>
            <h2 className="font-display font-semibold text-lg mb-2">5. Limitation of Liability</h2>
            <p>Tendrlo is a marketplace platform and is not responsible for the quality of work performed by contractors or the accuracy of project descriptions posted by customers.</p>
          </div>
          <div>
            <h2 className="font-display font-semibold text-lg mb-2">6. Contact</h2>
            <p>For questions about these terms, contact us at <a href="mailto:legal@tendrlo.com" className="text-blueprint-600 hover:underline">legal@tendrlo.com</a></p>
          </div>
        </div>
      </section>
    </main>
  );
}