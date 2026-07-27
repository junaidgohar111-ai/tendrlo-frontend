'use client';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit() {
    setError('');
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (!/[A-Z]/.test(password)) { setError('Must include uppercase letter.'); return; }
    if (!/[0-9]/.test(password)) { setError('Must include a number.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    if (!token) { setError('Invalid reset link.'); return; }
    setLoading(true);
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/auth/password-reset/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed.'); return; }
      setSuccess(true);
      setTimeout(() => router.push('/login'), 3000);
    } catch {
      setError('Something went wrong.');
    } finally { setLoading(false); }
  }

  if (success) {
    return (
      <div className="text-center py-4">
        <h1 className="font-display text-xl font-semibold">Password reset!</h1>
        <p className="text-slate-500 text-sm mt-2">Redirecting to login...</p>
        <Link href="/login" className="mt-4 inline-block text-blueprint-600 font-medium hover:underline">Go to login</Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-semibold">Reset password</h1>
      <p className="text-slate-500 text-sm">Enter your new password below.</p>
      <div>
        <label className="text-sm font-medium">New password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoComplete="new-password"
          placeholder="Min 8 chars, uppercase and number"
          className="mt-1 w-full rounded-card border border-blueprint-100 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blueprint-500"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Confirm password</label>
        <input
          type="password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          autoComplete="new-password"
          placeholder="Re-enter your new password"
          className="mt-1 w-full rounded-card border border-blueprint-100 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blueprint-500"
        />
      </div>
      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-card px-3 py-2">{error}</p>}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full rounded-card bg-blueprint-500 py-3 text-sm font-medium text-white hover:bg-blueprint-600 disabled:opacity-60 transition-colors"
      >
        {loading ? 'Resetting...' : 'Reset password'}
      </button>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen bp-grid flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm rounded-card border border-blueprint-100 bg-white p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-6">
          <button onClick={() => window.history.back()} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors">
            <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
          </button>
          <Link href="/" className="font-display text-xl font-semibold">tendrlo<span className="text-blueprint-500">.</span></Link>
        </div>
        <Suspense fallback={<p className="text-slate-500 text-sm">Loading...</p>}>
          <ResetPasswordForm/>
        </Suspense>
      </div>
    </main>
  );
}
