'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function AdminCompanies() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<any>(null);

  async function load() {
    const d = await api('/admin/companies');
    setCompanies(d.companies);
    setFiltered(d.companies);
  }

  useEffect(() => { load(); }, []);

  useEffect(() => {
    const s = search.toLowerCase();
    setFiltered(companies.filter(c =>
      c.company_name?.toLowerCase().includes(s) ||
      c.email?.toLowerCase().includes(s)
    ));
  }, [search, companies]);

  async function verify(id: string) { await api(`/admin/companies/${id}/verify`, {method:'PATCH'}); load(); }
  async function setTier(id: string, tier: string) { await api(`/admin/companies/${id}/membership`, {method:'PATCH', body:JSON.stringify({tier, months:1})}); load(); }
  async function deleteCompany(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try { await api(`/admin/companies/${id}`, {method:'DELETE'}); load(); setSelected(null); }
    catch(e: any) { alert(e.message || 'Failed'); }
  }

  return (
    <div className="p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold">Companies</h1>
        <span className="text-sm text-slate-500 font-mono">{filtered.length} total</span>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by company name or email..."
          className="w-full rounded-card border border-blueprint-100 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blueprint-500"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Companies List */}
        <div className="rounded-card border border-blueprint-100 bg-white overflow-hidden">
          <div className="overflow-y-auto max-h-[600px]">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-blueprint-100 sticky top-0">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase">Company</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((c: any) => (
                  <tr key={c.id}
                    onClick={() => setSelected(c)}
                    className={`cursor-pointer hover:bg-slate-50 transition-colors ${selected?.id === c.id ? 'bg-blueprint-50' : ''}`}>
                    <td className="px-4 py-3">
                      <p className="font-medium">{c.company_name}</p>
                      <p className="text-xs text-slate-500">{c.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-mono ${c.is_verified ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                        {c.is_verified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={(e) => { e.stopPropagation(); verify(c.id); }}
                          className={`text-xs px-2 py-1 rounded border transition-colors ${c.is_verified ? 'border-slate-200 text-slate-500 hover:bg-slate-50' : 'border-blueprint-100 text-blueprint-600 hover:bg-blueprint-50'}`}>
                          {c.is_verified ? 'Unverify' : 'Verify'}
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); deleteCompany(c.id, c.company_name); }}
                          className="text-xs px-2 py-1 rounded border border-red-100 text-red-500 hover:bg-red-50 transition-colors">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Company Detail */}
        <div className="rounded-card border border-blueprint-100 bg-white p-6">
          {selected ? (
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="font-display font-semibold text-lg">{selected.company_name}</h2>
                  <p className="text-sm text-slate-500">{selected.email}</p>
                </div>
                {selected.logo_url && (
                  <img src={selected.logo_url} alt="Logo" className="w-12 h-12 rounded-card object-cover border border-blueprint-100"/>
                )}
              </div>

              <dl className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <dt className="text-slate-500">Verification</dt>
                  <dd className={`font-mono ${selected.is_verified ? 'text-emerald-600' : 'text-amber-500'}`}>
                    {selected.is_verified ? 'Verified ✓' : 'Pending review'}
                  </dd>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <dt className="text-slate-500">Membership</dt>
                  <dd className="font-mono capitalize">{selected.membership_tier}</dd>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <dt className="text-slate-500">Phone</dt>
                  <dd className="font-mono">{selected.phone || 'Not provided'}</dd>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <dt className="text-slate-500">Experience</dt>
                  <dd className="font-mono">{selected.years_experience ? selected.years_experience + ' years' : 'Not provided'}</dd>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <dt className="text-slate-500">Website</dt>
                  <dd>{selected.website_url ? <a href={selected.website_url} target="_blank" rel="noopener noreferrer" className="text-blueprint-600 hover:underline text-xs">{selected.website_url}</a> : 'Not provided'}</dd>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <dt className="text-slate-500">Cities</dt>
                  <dd className="text-xs">{selected.covered_cities?.length ? selected.covered_cities.join(', ') : 'Not provided'}</dd>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <dt className="text-slate-500">Joined</dt>
                  <dd className="font-mono text-xs">{new Date(selected.created_at).toLocaleDateString()}</dd>
                </div>
                {selected.about && (
                  <div className="border-b border-slate-50 pb-2">
                    <dt className="text-slate-500 mb-1">About</dt>
                    <dd className="text-xs text-slate-600">{selected.about}</dd>
                  </div>
                )}
              </dl>

              {/* Documents */}
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Documents</p>
                <div className="space-y-2">
                  {selected.cr_document_url && (
                    <a href={selected.cr_document_url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs text-blueprint-600 hover:underline">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                      CR Document
                    </a>
                  )}
                  {selected.vat_document_url && (
                    <a href={selected.vat_document_url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs text-blueprint-600 hover:underline">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                      VAT Document
                    </a>
                  )}
                  {selected.license_document_url && (
                    <a href={selected.license_document_url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs text-blueprint-600 hover:underline">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                      License Document
                    </a>
                  )}
                  {!selected.cr_document_url && !selected.vat_document_url && !selected.license_document_url && (
                    <p className="text-xs text-slate-400">No documents uploaded</p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-5 flex gap-2">
                <button onClick={() => verify(selected.id)}
                  className={`flex-1 rounded-card py-2 text-xs font-medium border transition-colors ${selected.is_verified ? 'border-slate-200 text-slate-500 hover:bg-slate-50' : 'border-blueprint-500 text-blueprint-600 hover:bg-blueprint-50'}`}>
                  {selected.is_verified ? 'Remove Verification' : 'Verify Company'}
                </button>
                <button onClick={() => deleteCompany(selected.id, selected.company_name)}
                  className="flex-1 rounded-card py-2 text-xs font-medium border border-red-200 text-red-600 hover:bg-red-50 transition-colors">
                  Delete Company
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-center py-16">
              <div>
                <svg className="w-10 h-10 text-slate-200 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
                <p className="text-slate-400 text-sm">Select a company to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}