'use client';
import { useEffect, useState, FormEvent } from 'react';
import { api } from '@/lib/api';

type Category = { id: number; name: string; slug: string };

export default function AdminCategories() {
  const [cats, setCats] = useState<Category[]>([]);
  const [newName, setNewName] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  async function load() {
    const d = await api('/admin/categories');
    setCats(d.categories);
  }

  useEffect(() => { load(); }, []);

  async function add(e: FormEvent) {
    e.preventDefault();
    setErr(''); setMsg('');
    try {
      await api('/admin/categories', { method: 'POST', body: JSON.stringify({ name: newName }) });
      setNewName('');
      setMsg('Added successfully.');
      load();
    } catch (e) { setErr(e instanceof Error ? e.message : 'Failed'); }
  }

  async function save(id: number) {
    try {
      await api(`/admin/categories/${id}`, { method: 'PATCH', body: JSON.stringify({ name: editName }) });
      setEditId(null);
      setMsg('Updated.');
      load();
    } catch (e) { setErr(e instanceof Error ? e.message : 'Failed'); }
  }

  async function del(id: number, name: string) {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await api(`/admin/categories/${id}`, { method: 'DELETE' });
      setMsg('Deleted.');
      load();
    } catch (e) { setErr(e instanceof Error ? e.message : 'Failed'); }
  }

  return (
    <div className="p-6 sm:p-8">
      <h1 className="font-display text-2xl font-semibold mb-2">Categories</h1>
      <p className="text-slate-500 text-sm mb-6">Add new categories here.</p>
      <div className="rounded-card border border-blueprint-100 bg-white p-5 mb-6">
        <h2 className="font-semibold text-sm mb-3">Add a new category</h2>
        <form onSubmit={add} className="flex gap-3">
          <input value={newName} onChange={e => setNewName(e.target.value)} required placeholder="e.g. Food and Catering..." className="flex-1 rounded-card border border-blueprint-100 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blueprint-500"/>
          <button type="submit" className="rounded-card bg-blueprint-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-blueprint-600">Add</button>
        </form>
        {err && <p className="mt-2 text-sm text-red-600">{err}</p>}
        {msg && <p className="mt-2 text-sm text-emerald-600">{msg}</p>}
      </div>
      <div className="rounded-card border border-blueprint-100 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-blueprint-100">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase">Name</th>
              <th