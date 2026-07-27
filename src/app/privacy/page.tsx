'use client';
import Link from 'next/link';

export default function PrivacyPage() {
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
        <h1 className="font-display text-3xl font-semibold mb-2">Privacy Policy</h1>
        <p className="text-slate-500 text-sm mb-8">Last updated: July 2026</p>
        <div className="prose text-slate-700 space-y-6 text-sm leading-relaxed">
          <div>
            <h2 className="font-display font-semibold text-lg mb-2">1. Information We Collect</h2>
            <p>We collect information you provide when creating an account (name, email, phone), posting projects, submitting bids, and uploading files. We also collect usage data and IP addresses for security purposes.</p>
          </div>
          <div>
            <h2 className="font-display font-semibold text-lg mb-2">2. How We Use Your Information</h2>
            <p>We use your information to provide and improve our services, send notifications about bids and messages, verify company accounts, and ensure platform security.</p>
          </div>
          <div>
            <h2 className="font-display font-semibold text-lg mb-2">3. Data Storage</h2>
            <p>Your data is stored securely on Neon (PostgreSQL database) and AWS S3 (file storage). All data is encrypted in transit and at rest.</p>
          </div>
          <div>
            <h2 className="font-display font-semibold text-lg mb-2">4. Data Sharing</h2>
            <p>We do not sell your personal data. We share data only with service providers necessary to operate our platform (AWS, Stripe for payments) and when required by law.</p>
          </div>
          <div>
            <h2 className="font-display font-semibold text-lg mb-2">5. Your Rights</h2>
            <p>You can request access to, correction of, or deletion of your personal data at any time by contacting us at <a href="mailto:support@tendrlo.com" className="text-blueprint-600 hover:underline">support@tendrlo.com</a></p>
          </div>
          <div>
            <h2 className="font-display font-semibold text-lg mb-2">6. Cookies</h2>
            <p>We use essential cookies for authentication and security. We do not use tracking or advertising cookies.</p>
          </div>
          <div>
            <h2 className="font-display font-semibold text-lg mb-2">7. Contact</h2>
            <p>For privacy questions, contact us at <a href="mailto:support@tendrlo.com" className="text-blueprint-600 hover:underline">support@tendrlo.com</a></p>
          </div>
        </div>
      </section>
    </main>
  );
}

