'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, getStoredToken } from '@/lib/api';

const MAX_MB = 80;
const MAX_BYTES = MAX_MB * 1024 * 1024;

export default function NewProjectPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('');
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [currency, setCurrency] = useState('SAR');
  const [deadline, setDeadline] = useState('');
  const [visibility, setVisibility] = useState<'public'|'invite_only'>('public');
  const [files, setFiles] = useState<File[]>([]);
  const [oversized, setOversized] = useState<string[]>([]);
  const [links, setLinks] = useState(['']);
  const [coverImage, setCoverImage] = useState<File|null>(null);
  const [coverPreview, setCoverPreview] = useState<string|null>(null);
  const [errors, setErrors] = useState<Record<string,string>>({});
  const [loading, setLoading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState('');

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    const ok: File[] = [];
    const big: string[] = [];
    Array.from(e.target.files).forEach(f => {
      if (f.size > MAX_BYTES) big.push(f.name);
      else ok.push(f);
    });
    setFiles(prev => [...prev, ...ok]);
    setOversized(prev => [...prev, ...big]);
    e.target.value = '';
  }

  function handleCover(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Cover photo must be under 5MB.');
      return;
    }
    setCoverImage(file);
    setCoverPreview(URL.createObjectURL(file));
    e.target.value = '';
  }

  function removeCover() {
    setCoverImage(null);
    setCoverPreview(null);
  }

  function validate() {
    const e: Record<string,string> = {};
    if (!title.trim() || title.trim().length < 5) e.title = 'Title must be at least 5 characters.';
    if (!description.trim() || description.trim().length < 20) e.description = 'Scope of work must be at least 20 characters.';
    if (!city.trim()) e.city = 'City is required.';
    if (!budgetMin || Number(budgetMin) <= 0) e.budgetMin = 'Budget minimum is required.';
    if (files.length === 0 && !links.some(l => l.trim())) e.attachments = 'At least one file or link is required.';
    return e;
  }

  async function submit(status: 'draft'|'open') {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      const { project } = await api('/projects', {
        method: 'POST',
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          locationCity: city.trim(),
          budgetMin: Number(budgetMin),
          budgetMax: budgetMax ? Number(budgetMax) : undefined,
          currency,
          deadline: deadline || undefined,
          status,
          visibility,
        }),
      });

      const token = getStoredToken();

      // Upload cover image if selected
      if (coverImage) {
        setUploadMsg('Uploading cover photo...');
        const fd = new FormData();
        fd.append('cover', coverImage);
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${project.id}/cover`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token || ''}` },
          body: fd,
        });
      }

      // Upload attachments
      const validLinks = links.filter(l => l.trim());
      if (files.length > 0 || validLinks.length > 0) {
        setUploadMsg('Uploading files...');
        const fd = new FormData();
        files.forEach(f => fd.append('files', f));
        if (validLinks.length) fd.append('fileLinks', JSON.stringify(validLinks));
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/uploads/project/${project.id}`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token || ''}` },
          body: fd,
        });
      }

      router.push(`/projects/${project.id}`);
    } catch (err) {
      setErrors({ submit: err instanceof Error ? err.message : 'Something went wrong.' });
    } finally {
      setLoading(false);
      setUploadMsg('');
    }
  }

  const inp = "mt-1 w-full rounded-card border border-blueprint-100 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blueprint-500";

  return (
    <main className="min-h-screen bp-grid pb-16">
      <header className="border-b border-blueprint-100 bg-white/90 glass">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={() => window.history.back()} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors">
              <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
            <Link href="/" className="font-display text-xl font-semibold">
              tendrlo<span className="text-blueprint-500">.</span>
            </Link>
          </div>
          <Link href="/dashboard" className="text-sm text-slate-500 hover:text-ink">Dashboard</Link>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-8">
        <h1 className="font-display text-2xl sm:text-3xl font-semibold">Post a project</h1>
        <p className="text-slate-500 mt-1 text-sm">Fields marked <span className="text-red-500">*</span> are required.</p>

        <div className="mt-7 space-y-5 rounded-card border border-blueprint-100 bg-white p-6 sm:p-8">

          {/* Cover Photo */}
          <div>
            <label className="text-sm font-medium">Cover photo <span className="text-slate-400 font-normal">(optional)</span></label>
            <p className="text-xs text-slate-500 mt-0.5">Add one photo to make your project stand out in search results.</p>
            <div
              onClick={() => coverRef.current?.click()}
              className="mt-2 border-2 border-dashed border-blueprint-100 rounded-card overflow-hidden cursor-pointer hover:border-blueprint-500 transition-colors"
            >
              {coverPreview ? (
                <div className="relative">
                  <img src={coverPreview} alt="Cover preview" className="w-full h-48 object-cover"/>
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <p className="text-white text-sm font-medium">Click to change</p>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <svg className="w-10 h-10 text-slate-300 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  <p className="text-sm font-medium text-slate-500">Click to upload cover photo</p>
                  <p className="text-xs text-slate-400 mt-1">JPG, PNG - Max 5MB</p>
                </div>
              )}
            </div>
            <input ref={coverRef} type="file" accept=".jpg,.jpeg,.png,.webp" onChange={handleCover} className="hidden"/>
            {coverPreview && (
              <button onClick={removeCover} className="mt-2 text-xs text-red-400 hover:text-red-600">
                Remove photo
              </button>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="text-sm font-medium">Project title <span className="text-red-500">*</span></label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. HVAC, Civil, MEP, Supply Chain" maxLength={200}
              className={inp}
            />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium">Scope of work <span className="text-red-500">*</span></label>
            <textarea
              rows={6}
              value={description}
              onChange={e => setDescription(e.target.value)}
              maxLength={10000} placeholder="Describe what needs to be done, materials, site access, and any constraints." maxLength={5000}
              className={inp}
            />
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
          </div>

          {/* City and Deadline */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">City <span className="text-red-500">*</span></label>
              <input value={city} onChange={e => setCity(e.target.value)} maxLength={100} className={inp}/>
              {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
            </div>
            <div>
              <label className="text-sm font-medium">Deadline</label>
              <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} className={inp}/>
            </div>
          </div>

          {/* Currency */}
          <div>
            <label className="text-sm font-medium">Currency</label>
            <select value={currency} onChange={e => setCurrency(e.target.value)} className={inp}>
              <option value="SAR">SAR - Saudi Riyal</option>
              <option value="USD">USD - US Dollar</option>
              <option value="AED">AED - UAE Dirham</option>
              <option value="PKR">PKR - Pakistani Rupee</option>
              <option value="INR">INR - Indian Rupee</option>
            </select>
          </div>

          {/* Budget */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Budget min <span className="text-red-500">*</span></label>
              <input type="number" min="0" max="999999999999999" value={budgetMin} onChange={e => setBudgetMin(e.target.value)} className={inp}/>
              {errors.budgetMin && <p className="text-xs text-red-500 mt-1">{errors.budgetMin}</p>}
            </div>
            <div>
              <label className="text-sm font-medium">Budget max</label>
              <input type="number" min="0" max="999999999999999" value={budgetMax} onChange={e => setBudgetMax(e.target.value)} className={inp}/>
            </div>
          </div>

          {/* Visibility */}
          <div>
            <label className="text-sm font-medium">Bid visibility <span className="text-red-500">*</span></label>
            <div className="mt-2 grid grid-cols-2 gap-3">
              {(['public', 'invite_only'] as const).map(v => (
                <button key={v} type="button" onClick={() => setVisibility(v)}
                  className={`rounded-card border p-4 text-left transition-colors ${visibility === v ? 'border-blueprint-500 bg-blueprint-50' : 'border-blueprint-100 hover:border-blueprint-300'}`}>
                  <p className="font-medium text-sm">{v === 'public' ? 'Public bid' : 'Private bid'}</p>
                  <p className="text-xs text-slate-500 mt-1">{v === 'public' ? 'Any verified contractor can bid.' : 'Only contractors you invite can bid.'}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Attachments */}
          <div>
            <label className="text-sm font-medium">Attachments <span className="text-red-500">*</span></label>
            <p className="text-xs text-slate-500 mt-0.5">PDF, DWG, Excel, images, videos - max {MAX_MB}MB each.</p>
            <div
              onClick={() => fileRef.current?.click()}
              className="mt-2 border-2 border-dashed border-blueprint-100 rounded-card p-6 text-center cursor-pointer hover:border-blueprint-500 transition-colors"
            >
              <p className="text-sm font-medium">Click to select files</p>
              <p className="text-xs text-slate-500 mt-1">PDF, DWG, Excel, Images, Videos - Max {MAX_MB}MB</p>
            </div>
            <input
              ref={fileRef}
              type="file"
              multiple
              accept=".pdf,.dwg,.xlsx,.xls,.jpg,.jpeg,.png,.webp,.mp4"
              onChange={handleFiles}
              className="hidden"
            />

            {oversized.length > 0 && (
              <div className="mt-3 rounded-card border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-sm font-medium text-red-600 mb-1">These files exceed {MAX_MB}MB:</p>
                {oversized.map((n, i) => (
                  <div key={i} className="flex items-center justify-between text-sm text-red-600">
                    <span>{n}</span>
                    <button onClick={() => setOversized(oversized.filter((_, j) => j !== i))} className="text-xs ml-3 underline">dismiss</button>
                  </div>
                ))}
                <p className="text-xs text-red-500 mt-2 font-medium">Use the link box below for these files.</p>
              </div>
            )}

            {files.length > 0 && (
              <div className="mt-3 space-y-2">
                {files.map((f, i) => (
                  <div key={i} className="flex items-center justify-between rounded-card border border-emerald-100 bg-emerald-50 px-4 py-2.5">
                    <span className="text-sm truncate">{f.name}</span>
                    <button onClick={() => setFiles(files.filter((_, j) => j !== i))} className="text-red-400 ml-3 text-xs shrink-0">Remove</button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4">
              <p className="text-sm font-medium mb-2">File links (Google Drive, Dropbox, etc.)</p>
              {links.map((l, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input
                    type="url"
                    value={l}
                    onChange={e => { const u = [...links]; u[i] = e.target.value; setLinks(u); }}
                    placeholder="https://drive.google.com/..."
                    className={`flex-1 ${inp}`}
                  />
                  <button
                    type="button"
                    onClick={() => setLinks(links.length > 1 ? links.filter((_, j) => j !== i) : [''])}
                    className="text-red-400 hover:text-red-600 px-2"
                  >x</button>
                </div>
              ))}
              <button type="button" onClick={() => setLinks([...links, ''])} className="text-sm text-blueprint-600 font-medium hover:underline">
                + Add another link
              </button>
            </div>
            {errors.attachments && <p className="text-xs text-red-500 mt-2">{errors.attachments}</p>}
          </div>

          {uploadMsg && <p className="text-sm text-blueprint-600 font-mono">{uploadMsg}</p>}
          {errors.submit && (
            <div className="rounded-card bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
              {errors.submit}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button type="button" disabled={loading} onClick={() => submit('draft')}
              className="rounded-card border border-blueprint-200 px-5 py-2.5 text-sm font-medium hover:border-blueprint-500 disabled:opacity-60 transition-colors">
              Save as draft
            </button>
            <button type="button" disabled={loading} onClick={() => submit('open')}
              className="rounded-card bg-blueprint-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-blueprint-600 disabled:opacity-60 transition-colors">
              {loading ? 'Publishing...' : 'Publish for bidding'}
            </button>
          </div>

        </div>
      </section>
    </main>
  );
}

