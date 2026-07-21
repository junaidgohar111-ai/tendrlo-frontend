'use client';
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function ConversationPage() {
  const { id } = useParams();
  const [messages, setMessages] = useState<any[]>([]);
  const [conv, setConv] = useState(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [userId, setUserId] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api('/auth/me').then(d => setUserId(d.user.id)).catch(() => {});
    load();
    const t = setInterval(load, 3000);
    return () => clearInterval(t);
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function load() {
    try {
      const d = await api('/messages/conversations/' + id + '/messages');
      setMessages(d.messages);
      setConv(d.conversation);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function send(e?: any) {
    if (e) e.preventDefault();
    if (!text.trim() || sending) return;
    const body = text.trim();
    setText('');
    setSending(true);
    try {
      const d = await api('/messages/conversations/' + id + '/messages', {
        method: 'POST',
        body: JSON.stringify({ body })
      });
      setMessages(m => [...m, d.message]);
    } catch {
      setText(body);
    } finally {
      setSending(false);
    }
  }

  function fTime(d: string) {
    return new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  if (loading) {
    return (
      <main className="h-screen flex items-center justify-center">
        <p className="text-slate-500 text-sm">Loading...</p>
      </main>
    );
  }

  return (
    <main className="h-screen flex flex-col bg-slate-50">
      <header className="border-b border-blueprint-100 bg-white shrink-0">
        <div className="px-4 py-3 flex items-center gap-3">
          <button onClick={() => window.history.back()} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100">
            <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <Link href="/" className="font-display text-base font-semibold shrink-0">
            tendrlo<span className="text-blueprint-500">.</span>
          </Link>
          <div className="flex-1">
            <p className="font-semibold text-sm">Conversation</p>
            {conv && (
              <Link href={'/projects/' + conv.project_id} className="text-xs text-blueprint-600">
                View project
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <p className="font-semibold text-sm">Start the conversation</p>
            <p className="text-slate-500 text-sm mt-1">Type a message below.</p>
          </div>
        )}
        {messages.map((m, i) => {
          const isMe = m.sender_id === userId;
          return (
            <div key={m.id} className={'flex mb-2 ' + (isMe ? 'justify-end' : 'justify-start')}>
              <div className="max-w-[78%]">
                {!isMe && <p className="text-xs text-slate-400 mb-1 ml-1">{m.sender_name}</p>}
                <div className={'rounded-2xl px-3.5 py-2.5 text-sm ' + (isMe ? 'bg-blueprint-500 text-white' : 'bg-white border border-blueprint-100')}>
                  {m.body && <p className="break-words">{m.body}</p>}
                </div>
                <div className={'flex items-center gap-1 mt-0.5 ' + (isMe ? 'justify-end' : 'justify-start')}>
                  <span className="text-xs text-slate-400">{fTime(m.created_at)}</span>
                  {isMe && (
                    <span className={'text-xs ' + (m.is_read ? 'text-blueprint-500' : 'text-slate-400')}>
                      {m.is_read ? '✓✓' : '✓'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef}/>
      </div>

      <div className="border-t border-blueprint-100 bg-white shrink-0">
        <form onSubmit={send} className="flex items-end gap-2 px-4 py-3">
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Type a message..."
            rows={1}
            className="flex-1 rounded-2xl border border-blueprint-100 px-4 py-2.5 text-sm focus:outline-none resize-none max-h-28"
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
          />
          <button
            type="submit"
            disabled={sending || !text.trim()}
            className="w-10 h-10 rounded-full bg-blueprint-500 text-white flex items-center justify-center disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
            </svg>
          </button>
        </form>
      </div>
    </main>
  );
}
