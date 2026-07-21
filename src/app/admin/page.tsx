'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/admin/stats').then(setStats).catch(e=>setError(e.message));
  }, []);

  const cards = [
    { key:'totalUsers', label:'Total Users', color:'bg-blueprint-50 text-blueprint-600' },
    { key:'totalCompanies', label:'Companies', color:'bg-emerald-50 text-emerald-600' },
    { key:'openProjects', label:'Open Projects', color:'bg-amber-50 text-amber-500' },
    { key:'totalBids', label:'Total Bids', color:'bg-purple-50 text-purple-600' },
    { key:'premiumCompanies', label:'Premium Members', color:'bg-yellow-50 text-yellow-600' },
  ];

  return (
    <div className="p-6 sm:p-8">
      <h1 className="font-display text-2xl font-semibold mb-2">Dashboard</h1>
      <p className="text-slate-500 text-sm mb-6">Platform overview.</p>
      {error&&<div className="mb-6 rounded-card border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">{error} — Make sure you are logged in as admin.</div>}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {cards.map(c=>(
          <div key={c.key} className="rounded-card border border-blueprint-100 bg-white p-5">
            <div className={`w-9 h-9 rounded-card ${c.color} flex items-center justify-center text-lg mb-3`}>—</div>
            <p className="font-display text-2xl font-semibold">{stats?stats[c.key]:'—'}</p>
            <p className="text-xs text-slate-500 mt-1">{c.label}</p>
          </div>
        ))}
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {href:'/admin/users',label:'Manage Users',desc:'View, activate or deactivate accounts'},
          {href:'/admin/companies',label:'Manage Companies',desc:'Verify companies, manage memberships'},
          {href:'/admin/projects',label:'Manage Projects',desc:'View and moderate all projects'},
          {href:'/admin/categories',label:'Manage Categories',desc:'Add, edit or remove categories'},
        ].map(i=>(
          <a key={i.href} href={i.href} className="rounded-card border border-blueprint-100 bg-white p-5 hover:border-blueprint-500 transition-colors">
            <p className="font-semibold text-sm">{i.label}</p>
            <p className="text-xs text-slate-500 mt-1">{i.desc}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
