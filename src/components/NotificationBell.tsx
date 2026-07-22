'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function NotificationBell() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        const d = await api('/notifications');
        const unread = d.notifications.filter((n: any) => !n.is_read).length;
        setCount(unread);
      } catch {}
    }
    load();
    const t = setInterval(load, 30000);
    return () => clearInterval(t);
  }, []);

  return (
    <Link href="/messages" className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors">
      <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
      </svg>
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-mono">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </Link>
  );
}