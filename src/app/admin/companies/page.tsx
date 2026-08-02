'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function AdminCompanies() {
  const [companies, setCompanies] = useState<any[]>([]);

  async function load() { const d = await api('/admin/companies'); setCompanies(d.companies); }
  useEffect(() => { load(); }, []);

  async function verify(id: string) { await api(`/admin/companies/${id}/verify`,{method:'PATCH'}); load(); }
  async function setTier(id: string, tier: string) { await api(`/admin/companies/${id}/membership`,{method:'PATCH',body:JSON.stringify({tier,months:1})}); load(); }

  async function deleteCompany(id: string, name: string) {
    if (!confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) return;
    try {
      await api(`/admin/companies/${id}`, { method: 'DELETE' });
      load();
    } catch(e: any) {
      alert(e.message || 'Failed to delete company.');
    }
  }

  return (
    <div className="p-6 sm:p-8">
      <h1 className="font-display text-2xl font-semibold mb-6">Companies</h1>
      <div className="rounded-card border border-blueprint-100 bg-white overflow-hidden overflow-x-auto">
        <table className="w-full text-sm min-w-[800px]">
          <thead className="bg-slate-50 border-b border-blueprint-100">
            <tr>{['Company','Email','Verified','Membership','Expires','Actions'].map(h=><th key={h} className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {companies.map((c:any)=>(
              <tr key={c.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium">{c.company_name}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{c.email}</td>
                <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-0.5 text-xs font-mono ${c.is_verified?'bg-emerald-50 text-emerald-600':'bg-slate-100 text-slate-500'}`}>{c.is_verified?'Verified':'Unverified'}</span></td>
                <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-0.5 text-xs font-mono uppercase ${c.membership_tier==='premium'?'bg-amber-50 text-amber-500':'bg-slate-100 text-slate-500'}`}>{c.membership_tier}</span></td>
                <td className="px-4 py-3 text-xs font-mono text-slate-500">{c.membership_expires_at?new Date(c.membership_expires_at).toLocaleDateString():'â€”'}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 flex-wrap">
                    <button onClick={()=>verify(c.id)} className={`text-xs px-2.5 py-1.5 rounded-card border transition-colors ${c.is_verified?'border-slate-200 text-slate-500 hover:bg-slate-50':'border-blueprint-100 text-blueprint-600 hover:bg-blueprint-50'}`}>{c.is_verified?'Unverify':'Verify'}</button>
                    {c.membership_tier==='free'
                      ?<button onClick={()=>setTier(c.id,'premium')} className="text-xs px-2.5 py-1.5 rounded-card border border-amber-200 text-amber-600 hover:bg-amber-50">Set Premium</button>
                      :<button onClick={()=>setTier(c.id,'free')} className="text-xs px-2.5 py-1.5 rounded-card border border-red-100 text-red-600 hover:bg-red-50">Revoke</button>}
                    <button onClick={()=>deleteCompany(c.id, c.company_name)} className="text-xs px-2.5 py-1.5 rounded-card border border-red-200 text-red-700 hover:bg-red-50">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
