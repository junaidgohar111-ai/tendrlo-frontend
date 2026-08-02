'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, getStoredToken } from '@/lib/api';

export default function CompanyProfilePage() {
  const router = useRouter();
  const logoRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);
  const [company, setCompany] = useState<any>(null);
  const [companyName, setCompanyName] = useState('');
  const [about, setAbout] = useState('');
  const [yearsExperience, setYearsExperience] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [coveredCities, setCoveredCities] = useState('');
  const [logoFile, setLogoFile] = useState<File|null>(null);
  const [logoPreview, setLogoPreview] = useState<string|null>(null);

  useEffect(() => {
    async function load() {
      try {
        const me = await api('/auth/me');
        setUser(me.user);
        if (me.user.role !== 'company') { router.push('/dashboard'); return; }
        const d = await api('/companies/me');
        setCompany(d.company);
        setCompanyName(d.company.company_name || '');
        setAbout(d.company.about || '');
        setYearsExperience(d.company.years_experience || '');
        setWebsiteUrl(d.company.website_url || '');
        setCoveredCities((d.company.covered_cities || []).join(', '));
        if (d.company.logo_url) setLogoPreview(d.company.logo_url);
      } catch {
        router.push('/login');
      } finally { setLoading(false); }
    }
    load();
  }, []);

  function handleLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  }

  async function save() {
    setSaving(true);
    setError('');
    setSuccess(false);
    try {
      await api('/companies/me', {
        method: 'PATCH',
        body: JSON.stringify({
          companyName: companyName.trim(),
          about: about.trim(),
          yearsExperience: yearsExperience ? Number(yearsExperience) : undefined,
          websiteUrl: websiteUrl.trim() || undefined,
          coveredCities: coveredCities.split(',').map(c => c.trim()).filter(Boolean),
        }),
      });

      if (logoFile) {
        const fd = new FormData();
        fd.append('logo', logoFile);
        const token = getStoredToken();
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies/me/documents`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token || ''}` },
          body: fd,
        });
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch(e: any) {
      setError(e.message || 'Failed to save.');
    } finally { setSaving(false); }
  }

  const inp = "mt-1 w-full rounded-card border border-blueprint-100 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blueprint-500";

  if (loading) return (
    <main className="min-h-screen flex items-center justify-center">
      <p className="text-slate-500 text-sm">Loading...</p>
    </main>
  );

  return (
    <main className="min-h-screen bg-white pb-16">
      <header className="border-b border-blueprint-100">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={() => window.history.back()} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors">
              <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
            <Link href="/" className="font-display text-xl font-semibold">tendrlo<span className="text-blueprint-500">.</span></Link>
          </div>
          <Link href="/dashboard" className="text-sm text-slate-500 hover:text-ink">Dashboard</Link>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-2xl font-semibold">Company Profile</h1>
          {company?.is_verified && (
            <span className="rounded-full bg-emerald-50 text-emerald-600 px-3 py-1 text-xs font-mono">Verified ✓</span>
          )}
        </div>

        <div className="space-y-5 rounded-card border border-blueprint-100 bg-white p-6 sm:p-8">

          {/* Logo */}
          <div>
            <label className="text-sm font-medium">Company logo</label>
            <div className="mt-2 flex items-center gap-4">
              <div className="w-20 h-20 rounded-card border border-blueprint-100 overflow-hidden bg-slate-50 flex items-center justify-center">
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo" className="w-full h-full object-cover"/>
                ) : (
                  <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                )}
              </div>
              <button onClick={() => logoRef.current?.click()}
                className="rounded-card border border-blueprint-100 px-4 py-2 text-sm hover:border-blueprint-500 transition-colors">
                Change logo
              </button>
              <input ref={logoRef} type="file" accept=".png,.jpg,.jpeg,.webp" onChange={handleLogo} className="hidden"/>
            </div>
          </div>

          {/* Company Name */}
          <div>
            <label className="text-sm font-medium">Company name <span className="text-red-500">*</span></label>
            <input value={companyName} onChange={e => setCompanyName(e.target.value)} maxLength={200} className={inp}/>
          </div>

          {/* About */}
          <div>
            <label className="text-sm font-medium">About your company</label>
            <textarea value={about} onChange={e => setAbout(e.target.value)} rows={4} maxLength={2000}
              placeholder="Describe your company, services, expertise..." className={inp}/>
          </div>

          {/* Years Experience */}
          <div>
            <label className="text-sm font-medium">Years of experience</label>
            <input type="number" min="0" max="100" value={yearsExperience} onChange={e => setYearsExperience(e.target.value)} className={inp}/>
          </div>

          {/* Website */}
          <div>
            <label className="text-sm font-medium">Website URL</label>
            <input type="url" value={websiteUrl} onChange={e => setWebsiteUrl(e.target.value)} maxLength={500}
              placeholder="https://yourcompany.com" className={inp}/>
          </div>

          {/* Covered Cities */}
          <div>
            <label className="text-sm font-medium">Cities you cover</label>
            <input value={coveredCities} onChange={e => setCoveredCities(e.target.value)} maxLength={500}
              placeholder="Jeddah, Riyadh, Dammam" className={inp}/>
            <p className="text-xs text-slate-400 mt-1">Separate cities with commas</p>
          </div>

          {/* Verification Status */}
          <div className="rounded-card bg-slate-50 border border-blueprint-100 p-4">
            <h3 className="font-medium text-sm mb-1">Verification Status</h3>
            {company?.is_verified ? (
              <p className="text-sm text-emerald-600">Your company is verified. Your documents have been reviewed and approved.</p>
            ) : (
              <p className="text-sm text-slate-500">Your company is pending verification. Our team will review your documents shortly.</p>
            )}
          </div>

          {error && <div className="rounded-card bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">{error}</div>}
          {success && <div className="rounded-card bg-emerald-50 border border-emerald-100 px-4 py-3 text-sm text-emerald-600">Profile updated successfully!</div>}

          <button onClick={save} disabled={saving}
            className="w-full rounded-card bg-blueprint-500 py-3 text-sm font-medium text-white hover:bg-blueprint-600 disabled:opacity-60 transition-colors">
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </section>
    </main>
  );
}