'use client';
import React from 'react';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState<any>(null);
  const [bids, setBids] = useState<any[]>([]);
  const [attachments, setAttachments] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [error, setError] = useState('');
  const [messaging, setMessaging] = useState<string|null>(null);

  useEffect(() => {
    api('/auth/me').then(d=>setCurrentUser(d.user)).catch(()=>{});
    api('/projects/' + id).then(d=>{setProject(d.project);setAttachments(d.attachments||[]);}).catch(e=>setError(e.message));
    api('/bids/project/' + id).then(d=>setBids(d.bids)).catch(()=>{});
  }, [id]);

  async function acceptBid(bidId: string) {
    try {
      await api('/bids/' + bidId + '/accept', {method:'POST'});
      const d = await api('/bids/project/' + id);
      setBids(d.bids);
    } catch(e: any) { setError(e?.message || 'Failed'); }
  }

  async function startChat(companyId: string) {
    setMessaging(companyId);
    try {
      const d = await api('/messages/conversations', {
        method: 'POST',
        body: JSON.stringify({ projectId: id, companyId })
      });
      router.push('/messages/' + d.conversation.id);
    } catch(e: any) { setError(e?.message || 'Failed'); setMessaging(null); }
  }

  function formatBudget() {
    if (!project) return '';
    const min = project.budget_min ? Number(project.budget_min).toLocaleString() : null;
    const max = project.budget_max ? Number(project.budget_max).toLocaleString() : null;
    if (min && max) return min + ' - ' + max + ' ' + project.currency;
    if (min) return min + ' ' + project.currency;
    if (max) return max + ' ' + project.currency;
    return 'Budget not disclosed';
  }

  if (!project && error) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500">{error}</p>
      </main>
    );
  }

  if (!project) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-blueprint-100">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={() => window.history.back()} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors">
              <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
            <Link href="/" className="font-display text-xl font-semibold">
              tendrlo<span className="text-blueprint-500">.</span>
            </Link>
          </div>
          <div className="flex gap-4">
            {currentUser && currentUser.role === 'customer' && (
              <Link href="/messages" className="text-sm text-slate-500 hover:text-ink">Messages</Link>
            )}
            <Link href="/projects" className="text-sm text-slate-500 hover:text-ink">Browse</Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold">{project.title}</h1>
            <p className="text-sm text-slate-500 mt-1 font-mono">
              {project.location_city} · {project.status} · {project.bid_count} bids
            </p>
          </div>
          <span className={'rounded-full px-3 py-1 text-xs font-mono uppercase ' + (project.status==='open' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500')}>
            {project.status}
          </span>
        </div>

        {project.cover_image_url && (
          <img src={project.cover_image_url} alt={project.title} className="w-full h-64 object-cover rounded-card mt-6"/>
        )}

        <div className="grid md:grid-cols-3 gap-8 mt-6">
          <div className="md:col-span-2">
            <p className="text-sm leading-relaxed whitespace-pre-line">{project.description}</p>

            <dl className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-sm">
              <div>
                <dt className="text-xs text-slate-500 uppercase">Budget</dt>
                <dd className="mt-1">{formatBudget()}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500 uppercase">Deadline</dt>
                <dd className="mt-1">{project.deadline ? new Date(project.deadline).toLocaleDateString() : 'Open'}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500 uppercase">Posted</dt>
                <dd className="mt-1">{new Date(project.created_at).toLocaleDateString()}</dd>
              </div>
            </dl>

            {attachments.length > 0 && (
              <div className="mt-8">
                <h2 className="font-display text-lg font-semibold mb-3">Attachments</h2>
                <div className="space-y-2">
                  {attachments.map((a) => (
                    <a key={a.id} href={a.file_url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-card border border-blueprint-100 px-4 py-3 hover:border-blueprint-500 transition-colors">
                      <span className="text-sm text-blueprint-600">{a.file_name}</span>
                      <span className="text-xs text-slate-400 font-mono ml-auto">{a.file_type}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {currentUser && currentUser.role === 'company' && project.status === 'open' && (
              <div className="rounded-card border border-blueprint-100 bg-white p-6 mt-8">
                <h3 className="font-display font-semibold mb-4">Submit your bid</h3>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement; const getVal = (name: string) => (form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | null)?.value || '';
                  const amount = getVal('amount');
                  const proposal = getVal('proposal');
                  const days = getVal('days');
                  const bidLink = getVal('bidLink'); const currency = (form.elements.namedItem('currency') as HTMLSelectElement)?.value || project.currency;
                  try {
                    await api('/bids', { method:'POST', body:JSON.stringify({
                      projectId: id,
                      amount: Number(amount), currency: currency, proposalText: proposal || ' ',
                      estimatedDays: days ? Number(days) : undefined,
                      bidLink: bidLink || undefined
                    })});
                    alert('Bid submitted successfully!');
                    const d = await api('/bids/project/' + id);
                    setBids(d.bids);
                    form.reset();
                  } catch(err: any) {
                    alert(err.message || 'Failed to submit bid.');
                  }
                }} className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Bid amount</label><div className="flex gap-2 mt-1"><select name="currency" defaultValue={project.currency} className="rounded-card border border-blueprint-100 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blueprint-500"><option value="SAR">SAR</option><option value="USD">USD</option><option value="AED">AED</option><option value="PKR">PKR</option><option value="INR">INR</option></select><input name="amount" type="number" min="1" className="flex-1 rounded-card border border-blueprint-100 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blueprint-500"/></div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Estimated days</label>
                      <input name="days" type="number" min="1"
                        className="mt-1 w-full rounded-card border border-blueprint-100 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blueprint-500"/>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Quotation link (optional)</label>
                    <p className="text-xs text-slate-500 mt-0.5">Attach your quotation via Google Drive or Dropbox.</p>
                    <input name="bidLink" type="url" placeholder="https://drive.google.com/..." maxLength={500}
                      className="mt-1 w-full rounded-card border border-blueprint-100 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blueprint-500"/>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Cover note (optional)</label>
                    <textarea name="proposal" rows={3} maxLength={2000} placeholder="Brief note about your bid..."
                      className="mt-1 w-full rounded-card border border-blueprint-100 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blueprint-500"/>
                  </div>
                  <button type="submit"
                    className="w-full rounded-card bg-blueprint-500 py-3 text-sm font-medium text-white hover:bg-blueprint-600 transition-colors">
                    Submit bid
                  </button>
                </form>
              </div>
            )}

            <h2 className="font-display text-xl font-semibold mt-10 mb-5">Bids ({bids.length})</h2>
            {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
            {bids.length === 0 ? (
              <p className="text-sm text-slate-500">No bids yet.</p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {bids.map((b) => (
                  <div key={b.id} className="rounded-card border border-blueprint-100 bg-white p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-display font-semibold text-sm">{b.company_name}</span>
                        {b.is_verified && (
                          <span className="rounded-full bg-blueprint-50 px-2 py-0.5 text-xs font-mono text-blueprint-600">Verified</span>
                        )}
                      </div>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-mono text-slate-500">{b.status}</span>
                    </div>
                    <p className="mt-3 font-mono text-2xl font-semibold text-blueprint-600">
                      {Number(b.amount).toLocaleString()} {b.currency}
                    </p>
                    {b.estimated_days && (
                      <p className="text-xs text-slate-500 font-mono mt-1">{b.estimated_days} days est.</p>
                    )}
                    <p className="mt-3 text-sm line-clamp-3">{b.proposal_text}</p>
                    {b.bid_link && (
                      <a href={b.bid_link} target="_blank" rel="noopener noreferrer"
                        className="mt-2 flex items-center gap-1 text-sm text-blueprint-600 hover:underline">
                        View quotation link
                      </a>
                    )}
                    <div className="mt-4 flex gap-2">
                      {b.status === 'submitted' && currentUser && currentUser.role === 'customer' && (
                        <button onClick={() => acceptBid(b.id)}
                          className="flex-1 rounded-card bg-blueprint-500 py-2 text-sm font-medium text-white hover:bg-blueprint-600">
                          Accept bid
                        </button>
                      )}
                      {currentUser && currentUser.role === 'customer' && currentUser.id !== b.company_id && (
                        <button onClick={() => startChat(b.company_id)} disabled={messaging === b.company_id}
                          className="flex-1 rounded-card border border-blueprint-100 py-2 text-sm font-medium text-blueprint-600 hover:border-blueprint-500 disabled:opacity-60">
                          {messaging === b.company_id ? 'Opening...' : 'Message'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="rounded-card border border-blueprint-100 p-5">
              <h3 className="font-display font-semibold text-sm mb-3">Project details</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-500">Status</dt>
                  <dd className="font-mono capitalize">{project.status}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Bids</dt>
                  <dd className="font-mono">{project.bid_count}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Category</dt>
                  <dd className="font-mono">{project.category_name || 'None'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Visibility</dt>
                  <dd className="font-mono capitalize">{project.visibility}</dd>
                </div>
              </dl>
              {project.visibility === 'invite_only' && currentUser && currentUser.role === 'customer' && (
                <div className="mt-4">
                  <button onClick={async () => {
                    try {
                      const d = await api('/projects/' + project.id + '/invite', { method: 'POST' });
                      await navigator.clipboard.writeText(d.inviteUrl);
                      alert('Invite link copied!');
                    } catch (e) {
                      alert('Failed to generate invite link.');
                    }
                  }} className="w-full rounded-card border border-blueprint-500 text-blueprint-600 py-2 text-sm font-medium hover:bg-blueprint-50 transition-colors">
                    Copy invite link
                  </button>
                  <p className="text-xs text-slate-400 mt-1 text-center">Share with contractors you want to invite</p>
                </div>
              )}
            </div>
            <button onClick={() => { const url = window.location.href; if (navigator.share) { navigator.share({ title: project.title, text: "Check out this project on Tendrlo", url }); } else { navigator.clipboard.writeText(url); alert("Link copied!"); } }} className="w-full rounded-card border border-blueprint-100 py-2.5 text-sm font-medium text-slate-600 hover:border-blueprint-500 hover:text-blueprint-600 transition-colors flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
              Share project
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}


























