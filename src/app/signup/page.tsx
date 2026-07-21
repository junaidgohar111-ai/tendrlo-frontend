'use client';
import { useState, FormEvent, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, setToken } from '@/lib/api';

function Field({ id,label,error,required,children }:{id:string;label:string;error?:string;required?:boolean;children:React.ReactNode}) {
  return (
    <div>
      <label className="text-sm font-medium" htmlFor={id}>{label}{required&&<span className="text-red-500 ml-0.5">*</span>}</label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

export default function SignupPage() {
  const router = useRouter();
  const logoRef = useRef<HTMLInputElement>(null);
  const certRef = useRef<HTMLInputElement>(null);
  const [role, setRole] = useState<'customer'|'company'>('customer');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [about, setAbout] = useState('');
  const [logoFile, setLogoFile] = useState<File|null>(null);
  const [certFile, setCertFile] = useState<File|null>(null);
  const [errors, setErrors] = useState<Record<string,string>>({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  function validate() {
    const e: Record<string,string> = {};
    if (!fullName.trim() || fullName.trim().length < 2) e.fullName = 'Full name must be at least 2 characters.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email address.';
    if (password.length < 8) e.password = 'Password must be at least 8 characters.';
    if (!/[A-Z]/.test(password)) e.password = 'Password must include at least one uppercase letter.';
    if (!/[0-9]/.test(password)) e.password = 'Password must include at least one number.';
    if (role === 'company') {
      if (!companyName.trim() || companyName.trim().length < 2) e.companyName = 'Company name is required.';
      if (!phone.trim()) e.phone = 'Phone number is required.';
      if (!certFile) e.cert = 'Government registration certificate (PDF) is required.';
    }
    return e;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setServerError('');
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      const { token } = await api('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ role, fullName:fullName.trim(), companyName:role==='company'?companyName.trim():undefined, email:email.trim().toLowerCase(), password, phone:phone.trim()||undefined }),
      });
      setToken(token);
      if (role === 'company' && (logoFile || certFile)) {
        const fd = new FormData();
        if (logoFile) fd.append('logo', logoFile);
        if (certFile) fd.append('certificate', certFile);
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies/me/documents`, {
          method:'POST', headers:{Authorization:`Bearer ${token}`}, body: fd,
        });
      }
      router.push('/dashboard');
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally { setLoading(false); }
  }

  const inp = "mt-1 w-full rounded-card border border-blueprint-100 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blueprint-500";
  const inpErr = "mt-1 w-full rounded-card border border-red-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400";

  return (
    <main className="min-h-screen bp-grid flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md rounded-card border border-blueprint-100 bg-white p-6 sm:p-8">
        <Link href="/" className="font-display text-xl font-semibold">tendrlo<span className="text-blueprint-500">.</span></Link>
        <h1 className="font-display text-2xl font-semibold mt-5">Create an account</h1>

        <div className="mt-5 grid grid-cols-2 gap-2 rounded-card bg-blue-50 p-1">
          {(['customer','company'] as const).map(r=>(
            <button key={r} type="button" onClick={()=>{setRole(r);setErrors({});}}
              className={`rounded-card py-2 text-sm font-medium transition-colors ${role===r?'bg-white text-ink shadow-sm':'text-slate-500'}`}>
              {r==='customer'?'Post projects':'Bid on projects'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4" noValidate>
          <Field id="fullName" label="Full name" error={errors.fullName} required>
            <input id="fullName" autoComplete="name" value={fullName} onChange={e=>setFullName(e.target.value)} className={errors.fullName?inpErr:inp}/>
          </Field>

          {role==='company'&&<>
            <Field id="companyName" label="Company name" error={errors.companyName} required>
              <input id="companyName" autoComplete="organization" value={companyName} onChange={e=>setCompanyName(e.target.value)} className={errors.companyName?inpErr:inp}/>
            </Field>
            <Field id="phone" label="Phone number" error={errors.phone} required>
              <input id="phone" type="tel" autoComplete="tel" placeholder="+966 5xxxxxxxx" value={phone} onChange={e=>setPhone(e.target.value)} className={errors.phone?inpErr:inp}/>
            </Field>
            <Field id="about" label="About your company (optional)">
              <textarea id="about" rows={3} placeholder="Brief description of your services..." value={about} onChange={e=>setAbout(e.target.value)} className={inp}/>
            </Field>
            <div>
              <label className="text-sm font-medium">Company logo <span className="text-slate-400">(optional)</span></label>
              <div onClick={()=>logoRef.current?.click()} className="mt-1 border-2 border-dashed border-blueprint-100 rounded-card p-4 text-center cursor-pointer hover:border-blueprint-500 transition-colors">
                {logoFile?<p className="text-sm text-emerald-600 font-medium">{logoFile.name}</p>:<p className="text-sm text-slate-500">Click to upload logo (PNG, JPG)</p>}
              </div>
              <input ref={logoRef} type="file" accept=".png,.jpg,.jpeg,.webp" onChange={e=>setLogoFile(e.target.files?.[0]||null)} className="hidden"/>
            </div>
            <div>
              <label className="text-sm font-medium">Government registration certificate <span className="text-red-500">*</span></label>
              <p className="text-xs text-slate-500 mt-0.5">CR, Commercial License, or VAT Certificate (PDF only)</p>
              <div onClick={()=>certRef.current?.click()} className={`mt-1 border-2 border-dashed rounded-card p-4 text-center cursor-pointer transition-colors ${errors.cert?'border-red-300 bg-red-50':'border-blueprint-100 hover:border-blueprint-500'}`}>
                {certFile?<p className="text-sm text-emerald-600 font-medium">{certFile.name}</p>:<p className="text-sm text-slate-500">Click to upload certificate (PDF)</p>}
              </div>
              <input ref={certRef} type="file" accept=".pdf" onChange={e=>setCertFile(e.target.files?.[0]||null)} className="hidden"/>
              {errors.cert&&<p className="text-xs text-red-500 mt-1">{errors.cert}</p>}
            </div>
          </>}

          <Field id="email" label="Email" error={errors.email} required>
            <input id="email" type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} className={errors.email?inpErr:inp}/>
          </Field>
          <Field id="password" label="Password" error={errors.password} required>
            <input id="password" type="password" autoComplete="new-password" value={password} onChange={e=>setPassword(e.target.value)} className={errors.password?inpErr:inp}/>
            <p className="text-xs text-slate-400 mt-1">Min 8 chars, with uppercase and a number.</p>
          </Field>

          {serverError&&<div className="rounded-card bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">{serverError}</div>}

          <button type="submit" disabled={loading} className="w-full rounded-card bg-blueprint-500 py-3 text-sm font-medium text-white hover:bg-blueprint-600 disabled:opacity-60 transition-colors">
            {loading?'Creating account...':'Create account'}
          </button>
        </form>
        <p className="mt-5 text-sm text-center text-slate-500">
          Already have an account? <Link href="/login" className="text-blueprint-600 font-medium hover:underline">Log in</Link>
        </p>
      </div>
    </main>
  );
}
