'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function InvitePage() {
  const { token } = useParams<{token:string}>();
  const router = useRouter();
  const [project, setProject] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api(`/projects/invite/${token}`)
      .then(d => setProject(d.project))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return (
    <main className="min-h-screen flex items-center justify-center">
      <p className="text-slate-500 text-sm">Loading...</p>
    </main>
  );

  if (error) return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <p className="font-display text-xl font-semibold text-red-600">Invalid or expired invite link</p>
        <p className="text-slate-500 text-sm mt-2">This link is not valid or has been removed.</p>
        <Link href="/" className="mt-4 inline-block text-blueprint-600 font-medium hover:underline">Go to homepage</Link>
      </div>
    </main>
  );

  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-blueprint-100">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-4 flex items-center gap-3">
          <button onClick={() => window.history.back()} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors">
            <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
          </button>
          <Link href="/" className="font-display text-xl font-semibold">tendrlo<span className="text-blueprint-500">.</span></Link>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
        <div className="rounded-card border border-blueprint-100 bg-blue-50 px-4 py-3 mb-6 flex items-center gap-2">
          <span className="text-blueprint-600 text-sm font-medium">You have been invited to view this private project</span>
        </div>

        <h1 className="font-display text-2xl sm:text-3xl font-semibold">{project.title}</h1>
        <p className="text-sm text-slate-500 mt-1 font-mono">{project.location_city} · Private project</p>

        <p className="mt-6 text-sm leading-relaxed text-ink/80 whitespace-pre-line">{project.description}</p>

        <dl className="mt-6 grid grid-cols-3 gap-4 font-mono text-sm">
          <div><dt className="text-xs text-slate-500 uppercase">Budget</dt><dd className="mt-1">{project.budget_min||'—'}–{project.budget_max||'—'} {project.currency}</dd></div>
          <div><dt className="text-xs text-slate-500 uppercase">Deadline</dt><dd className="mt-1">{project.deadline?new Date(project.deadline).toLocaleDateString():'Open'}</dd></div>
          <div><dt className="text-xs text-slate-500 uppercase">Posted</dt><dd className="mt-1">{new Date(project.created_at).toLocaleDateString()}</dd></div>
        </dl>

        <div className="mt-10 rounded-card border border-blueprint-100 bg-white p-6 text-center">
          <p className="font-display font-semibold text-lg">Want to bid on this project?</p>
          <p className="text-slate-500 text-sm mt-1">Create a free company account or log in to submit your bid.</p>
          <div className="mt-5 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href={`/signup?role=company&redirect=/projects/${project.id}`}
              className="rounded-card bg-blueprint-500 px-6 py-3 text-sm font-medium text-white hover:bg-blueprint-600 transition-colors">
              Register and bid
            </Link>
            <Link href={`/login?redirect=/projects/${project.id}`}
              className="rounded-card border border-blueprint-200 px-6 py-3 text-sm font-medium text-ink hover:border-blueprint-500 transition-colors">
              Log in to bid
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
