'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const nav = [
  { href:'/admin', label:'Dashboard' },
  { href:'/admin/users', label:'Users' },
  { href:'/admin/companies', label:'Companies' },
  { href:'/admin/projects', label:'Projects' },
  { href:'/admin/categories', label:'Categories' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className="w-52 shrink-0 bg-ink text-white flex flex-col">
        <div className="px-5 py-5 border-b border-white/10">
          <Link href="/" className="font-display text-lg font-semibold">tendrlo<span className="text-blueprint-400">.</span></Link>
          <p className="text-xs text-white/40 mt-0.5 font-mono uppercase tracking-wide">Admin Panel</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {nav.map(n=>(
            <Link key={n.href} href={n.href}
              className={`flex items-center px-3 py-2.5 rounded-card text-sm transition-colors ${path===n.href?'bg-blueprint-500 text-white':'text-white/60 hover:text-white hover:bg-white/10'}`}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="px-5 py-4 border-t border-white/10">
          <Link href="/" className="text-xs text-white/40 hover:text-white">Back to site</Link>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
