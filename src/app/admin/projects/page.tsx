'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function AdminProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [status, setStatus] = useState('');

  async function load() { const p=new URLSearchParams(); if(status)p.set('status',status); const d=await api(`/admin/projects?${p}`); setProjects(d.projects); }
  useEffect(()=>{ load(); },[status]);
  async function changeStatus(id:string,s:string){ await api(`/admin/projects/${id}/status`,{method:'PATCH',body:JSON.stringify({status:s})}); load(); }

  const statusColor: Record<string,string> = { open:'bg-emerald-50 text-emerald-600', draft:'bg-slate-100 text-slate-500', closed:'bg-red-50 text-red-600', awarded:'bg-blueprint-50 text-blueprint-600', cancelled:'bg-red-100 text-red-700' };

  return (
    <div className="p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold">Projects</h1>
        <select value={status} onChange={e=>setStatus(e.target.value)} className="rounded-card border border-blueprint-100 px-4 py-2 text-sm focus:outline-none">
          <option value="">All</option>
          {['open','draft','awarded','closed','cancelled'].map(s=><option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div className="rounded-card border border-blueprint-100 bg-white overflow-hidden overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead className="bg-slate-50 border-b border-blueprint-100">
            <tr>{['Title','Category','City','Bids','Views','Status','Action'].map(h=><th key={h} className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {projects.map((p:any)=>(
              <tr key={p.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium max-w-[200px] truncate">{p.title}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{p.category_name||'—'}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{p.location_city}</td>
                <td className="px-4 py-3 font-mono text-xs">{p.bid_count}</td>
                <td className="px-4 py-3 font-mono text-xs">{p.view_count}</td>
                <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-0.5 text-xs font-mono uppercase ${statusColor[p.status]||'bg-slate-100 text-slate-500'}`}>{p.status}</span></td>
                <td className="px-4 py-3">
                  <select value={p.status} onChange={e=>changeStatus(p.id,e.target.value)} className="text-xs rounded-card border border-blueprint-100 px-2 py-1 focus:outline-none">
                    {['open','closed','cancelled'].map(s=><option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
