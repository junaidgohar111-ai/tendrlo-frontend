'use client';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, setToken } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password) { setError('Please enter your email and password.'); return; }
    setLoading(true);
    try {
      const { token } = await api('/auth/login', { method:'POST', body:JSON.stringify({ email:email.trim().toLowerCase(), password }) });
      setToken(token);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally { setLoading(false); }
  }

  return (
    <main className="min-h-screen bp-grid flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm rounded-card border border-blueprint-100 bg-white p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-6">
          <button onClick={() => window.history.back()} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors">
            <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
          </button>
          <Link href="/" className="font-display text-xl font-semibold">tendrlo<span className="text-blueprint-500">.</span></Link>
        </div>
        <h1 className="font-display text-2xl font-semibold">Log in</h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
          <div>
            <label className="text-sm font-medium" htmlFor="email">Email</label>
            <input id="email" type="email" required autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)}
              className="mt-1 w-full rounded-card border border-blueprint-100 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blueprint-500"/>
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="password">Password</label>
            <div className="relative">
              <input id="password" type={showPassword ? 'text' : 'password'} required autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)}
                className="mt-1 w-full rounded-card border border-blueprint-100 px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blueprint-500"/>
              <button type="button" onClick={()=>setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600">
                {showPassword ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21"/></svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                )}
              </button>
            </div>
          </div>
          {error && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-card px-3 py-2">{error}</p>}
          <button type="submit" disabled={loading} className="w-full rounded-card bg-blueprint-500 py-3 text-sm font-medium text-white hover:bg-blueprint-600 disabled:opacity-60 transition-colors">
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>
        <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
          <Link href="/signup" className="text-blueprint-600 font-medium hover:underline">Create account</Link>
          <Link href="/forgot-password" className="hover:text-ink hover:underline">Forgot password?</Link>
        </div>
      </div>
    </main>
  );
}