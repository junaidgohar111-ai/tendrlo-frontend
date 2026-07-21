"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function AdminCategories() {
  const [cats, setCats] = useState([]);
  const [newName, setNewName] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  async function load() {
    const d = await api("/admin/categories");
    setCats(d.categories);
  }

  useEffect(() => { load(); }, []);

  async function add(e: any) {
    e.preventDefault();
    setErr(""); setMsg("");
    try {
      await api("/admin/categories", { method: "POST", body: JSON.stringify({ name: newName }) });
      setNewName("");
      setMsg("Added successfully.");
      load();
    } catch (e: any) { setErr(e?.message || "Failed"); }
  }

  async function save(id: any) {
    try {
      await api("/admin/categories/" + id, { method: "PATCH", body: JSON.stringify({ name: editName }) });
      setEditId(null);
      setMsg("Updated.");
      load();
    } catch (e: any) { setErr(e?.message || "Failed"); }
  }

  async function del(id: any, name: any) {
    if (!confirm("Delete " + name + "?")) return;
    try {
      await api("/admin/categories/" + id, { method: "DELETE" });
      setMsg("Deleted.");
      load();
    } catch (e: any) { setErr(e?.message || "Failed"); }
  }

  return (
    <div className="p-6">
      <h1 className="font-display text-2xl font-semibold mb-2">Categories</h1>
      <p className="text-slate-500 text-sm mb-6">Add new categories here.</p>
      <div className="rounded-card border border-blueprint-100 bg-white p-5 mb-6">
        <form onSubmit={add} className="flex gap-3">
          <input value={newName} onChange={e => setNewName(e.target.value)} required placeholder="Category name..." className="flex-1 rounded-card border border-blueprint-100 px-4 py-2.5 text-sm focus:outline-none" />
          <button type="submit" className="rounded-card bg-blueprint-500 px-5 py-2.5 text-sm font-medium text-white">Add</button>
        </form>
        {err && <p className="mt-2 text-sm text-red-600">{err}</p>}
        {msg && <p className="mt-2 text-sm text-emerald-600">{msg}</p>}
      </div>
      <div className="rounded-card border border-blueprint-100 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-blueprint-100">
            <tr>
              <th className="text-left px-4 py-3 text-slate-500 text-xs uppercase">Name</th>
              <th className="text-left px-4 py-3 text-slate-500 text-xs uppercase">Slug</th>
              <th className="text-left px-4 py-3 text-slate-500 text-xs uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {cats.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  {editId === c.id ? (
                    <input value={editName} onChange={e => setEditName(e.target.value)} className="rounded-card border border-blueprint-500 px-3 py-1.5 text-sm" />
                  ) : (
                    <span className="font-medium">{c.name}</span>
                  )}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-slate-500">{c.slug}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {editId === c.id ? (
                      <>
                        <button onClick={() => save(c.id)} className="text-xs px-2.5 py-1.5 rounded-card border border-emerald-100 text-emerald-600">Save</button>
                        <button onClick={() => setEditId(null)} className="text-xs px-2.5 py-1.5 rounded-card border border-slate-200 text-slate-500">Cancel</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => { setEditId(c.id); setEditName(c.name); }} className="text-xs px-2.5 py-1.5 rounded-card border border-blueprint-100 text-blueprint-600">Edit</button>
                        <button onClick={() => del(c.id, c.name)} className="text-xs px-2.5 py-1.5 rounded-card border border-red-100 text-red-600">Delete</button>
                      </>
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
