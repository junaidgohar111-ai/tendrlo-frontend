'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');

  async function load() {
    const p = new URLSearchParams();
    if (role) p.set('role', role);
    const d = await api(`/admin/users?${p}`);
    setUsers(d.users);
    setFiltered(d.users);
  }

  useEffect(() => { load(); }, [role]);

  useEffect(() => {
    const s = search.toLowerCase();
    setFiltered(users.filter(u =>
      u.full_name?.toLowerCase().includes(s) ||
      u.email?.toLowerCase().includes(s)
    ));
  }, [search, users]);

  async function toggle(id: string) { await api(`/admin/users/${id}/toggle-active`, {method:'PATCH'}); load(); }
  async function deleteUser(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try { await api(`/admin/users/${id}`, {method:'DELETE'}); load(); }
    catch(e: any) { alert(e.message || 'Failed'); }
  }

  return (
    <div className="p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold">Users</h1>
        <span className="text-sm text-slate-500 font-mono">{filtered.length} total</span>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-3 mb-4">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or email..." maxLength={100}
          className="flex-1 rounded-card border border-blueprint-100 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blueprint-500"
        />
        <select value={role} onChange={e => setRole(e.target.value)}
          className="rounded-card border border-blueprint-100 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blueprint-500">
          <option value="">All roles</option>
          <option value="customer">Customers</option>
          <option value="company">Companies</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      <div className="rounded-card border border-blueprint-100 bg-white overflow-hidden overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead className="bg-slate-50 border-b border-blueprint-100">
            <tr>
              {['Name','Email','Phone','Role','Joined','Status','Actions'].map(h => (
                <th key={h} className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map((u: any) => (
              <tr key={u.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium">{u.full_name}</td>
                <td className="px-4 py-3 text-slate-500 text-xs">{u.email}</td>
                <td className="px-4 py-3 text-slate-500 text-xs">{u.phone || '-'}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-mono uppercase ${u.role==='admin'?'bg-red-50 text-red-600':u.role==='company'?'bg-blueprint-50 text-blueprint-600':'bg-slate-100 text-slate-500'}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs font-mono text-slate-500">{new Date(u.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-mono ${u.is_active?'bg-emerald-50 text-emerald-600':'bg-red-50 text-red-600'}`}>
                    {u.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => toggle(u.id)}
                      className={`text-xs px-3 py-1.5 rounded-card border transition-colors ${u.is_active?'border-red-100 text-red-600 hover:bg-red-50':'border-emerald-100 text-emerald-600 hover:bg-emerald-50'}`}>
                      {u.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                    {u.role !== 'admin' && (
                      <button onClick={() => deleteUser(u.id, u.full_name)}
                        className="text-xs px-3 py-1.5 rounded-card border border-red-200 text-red-700 hover:bg-red-50 transition-colors">
                        Delete
                      </button>
                    )}
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
