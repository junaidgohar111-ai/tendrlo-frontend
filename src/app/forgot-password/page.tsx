'use client';
import { useState, FormEvent } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      setSent(true);
    } catch {}
    finally { setLoading(false); }
  }

  return (
    <main className="min-h-screen bp-grid flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm rounded-card border border-blueprint-100 bg-white p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-6">
          <button onClick={() => window.history.back()} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100">
            <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
          </button>
          <Link href="/" className="font-display text-xl font-semibold">tendrlo<span className="text-blueprint-500">.</span></Link>
        </div>

        {sent ? (
          <div className="text-center py-4">
            <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
            </div>
            <h1 className="font-display text-xl font-semibold">Check your email</h1>
            <p className="text-slate-500 text-sm mt-2">If an account exists for {email}, we sent a password reset link.</p>
            <Link href="/login" className="mt-6 block text-sm text-blueprint-600 font-medium hover:underline">Back to login</Link>
          </div>
        ) : (
          <>
            <h1 className="font-display text-2xl font-semibold">Forgot password?</h1>
            <p className="text-slate-500 text-sm mt-1">Enter your email and we will send you a reset link.</p>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-medium">Email</label>
                <input type="email" required value={email} onChange={e=>setEmail(e.target.value)}
                  className="mt-1 w-full rounded-card border border-blueprint-100 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blueprint-500"/>
              </div>
              <button type="submit" disabled={loading}
                className="w-full rounded-card bg-blueprint-500 py-3 text-sm font-medium text-white hover:bg-blueprint-600 disabled:opacity-60 transition-colors">
                {loading ? 'Sending...' : 'Send reset link'}
              </button>
            </form>
            <Link href="/login" className="mt-4 block text-center text-sm text-slate-500 hover:text-ink">Back to login</Link>
          </>
        )}
      </div>
    </main>
  );
}