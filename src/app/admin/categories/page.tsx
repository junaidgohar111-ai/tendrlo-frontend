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

  async function add(e) {
    e.preventDefault();
    setErr(""); setMsg("");
    try {
      await api("/admin/categories", { method: "POST", body: JSON.stringify({ name: newName }) });
      setNewName("");
      setMsg("Added successfully.");
      load();
    } catch (e) { setErr(e.message || "Failed"); }
  }

  async function save(id) {
    try {
      await api("/admin/categories/" + id, { method: "PATCH", body: JSON.stringify({ name: editName }) });
      setEditId(null);
      setMsg("Updated.");
      load();
    } catch (e) { setErr(e.message || "Failed"); }
  }

  async function del(id, name) {
    if (!confirm("Delete " + name + "?")) return;
    try {
      await api("/admin/categories/" + id, { method: "DELETE" });
      setMsg("Deleted.");
      load();
    } catch (e) { setErr(e.message || "Failed"); }
  }

  return (
    <div className="p-6">
      <h1 className="font-display text-2xl font-semibold mb-2">Categories</h1>
      <p className="text-slate-500 text-sm mb-6">Add new categories here.</p>
