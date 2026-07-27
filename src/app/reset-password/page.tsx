'use client';
import { useState, FormEvent, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (!/[A-Z]/.test(password)) { setError('Password must include at least one uppercase letter.'); return; }
    if (!/[0-9]/.test(password)) { setError('Password must include at least one number.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    if (!token) { setError('Invalid reset link.'); return; }
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/password-reset/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed to reset password.'); return; }
      setSuccess(true);
      setTimeout(() => router.push('/login'), 3000);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally { setLoading(false); }
  }

  if (!token) {
    return (
      <div className="text-center">
        <p className="font-display text-xl font-semibold text-red-600">Invalid reset link</p>
        <Link href="/forgot-password" className="mt-4 inline-block text-blueprint-600 hover:underline">Request a new one</Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center py-4">
        <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
        </div>
        <h1 className="font-display text-xl font-semibold">Password reset!</h1>
        <p className="text-slate-500 text-sm mt-2">Your password has been updated. Redirecting to login...</p>
        <Link href="/login" className="mt-4 inline-block text-blueprint-600 font-medium hover:underline">Go to login</Link>
      </div>
    );
  }

  return (
    <>
      <h1 className="font-display text-2xl font-semibold">Reset password</h1>
      <p className="text-slate-500 text-sm mt-1">Enter your new password below.</p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
        <div>
          <label className="text-sm font-medium">New password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Min 8 chars, uppercase and number"
              className="mt-1 w-full rounded-card border border-blueprint-100 px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blueprint-500"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600">
              {showPassword ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21"/></svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
              )}
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-1">Min 8 chars, with uppercase and a number.</p>
        </div>
        <div>
          <label className="text-sm font-medium">Confirm password</label>
          <input
            type="password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            placeholder="Re-enter your new password"
            className="mt-1 w-full rounded-card border border-blueprint-100 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blueprint-500"
          />
        </div>
        {error && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-card px-3 py-2">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-card bg-blueprint-500 py-3 text-sm font-medium text-white hover:bg-blueprint-600 disabled:opacity-60 transition-colors"
        >
          {loading ? 'Resetting...' : 'Reset password'}
        </button>
      </form>
    </>
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