'use client';
import { useState, FormEvent, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ReCAPTCHA from 'react-google-recaptcha';
import { api, setToken } from '@/lib/api';

const COUNTRY_CODES = [
  { code: '+966', flag: 'ðŸ‡¸ðŸ‡¦', name: 'Saudi Arabia' },
  { code: '+92', flag: 'ðŸ‡µðŸ‡°', name: 'Pakistan' },
  { code: '+971', flag: 'ðŸ‡¦ðŸ‡ª', name: 'UAE' },
  { code: '+1', flag: 'ðŸ‡ºðŸ‡¸', name: 'USA' },
  { code: '+44', flag: 'ðŸ‡¬ðŸ‡§', name: 'UK' },
  { code: '+91', flag: 'ðŸ‡®ðŸ‡³', name: 'India' },
  { code: '+20', flag: 'ðŸ‡ªðŸ‡¬', name: 'Egypt' },
  { code: '+962', flag: 'ðŸ‡¯ðŸ‡´', name: 'Jordan' },
  { code: '+965', flag: 'ðŸ‡°ðŸ‡¼', name: 'Kuwait' },
  { code: '+968', flag: 'ðŸ‡´ðŸ‡²', name: 'Oman' },
  { code: '+974', flag: 'ðŸ‡¶ðŸ‡¦', name: 'Qatar' },
  { code: '+973', flag: 'ðŸ‡§ðŸ‡­', name: 'Bahrain' },
];

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
  const recaptchaRef = useRef<any>(null);
  const [role, setRole] = useState<'customer'|'company'>('customer');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phoneCode, setPhoneCode] = useState('+966');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [logoFile, setLogoFile] = useState<File|null>(null);
  const [certFile, setCertFile] = useState<File|null>(null);
  const [captchaToken, setCaptchaToken] = useState('');
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
    if (!phoneNumber.trim()) e.phone = 'Phone number is required.';
    if (role === 'company') {
      if (!companyName.trim() || companyName.trim().length < 2) e.companyName = 'Company name is required.';
      if (!certFile) e.cert = 'Government registration certificate (PDF) is required.';
    }
    if (!captchaToken) e.captcha = 'Please complete the reCAPTCHA verification.';
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
        body: JSON.stringify({
          role,
          fullName: fullName.trim(),
          companyName: role==='company' ? companyName.trim() : undefined,
          email: email.trim().toLowerCase(),
          password,
          phone: phoneCode + phoneNumber.trim(),
          captchaToken,
        }),
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
      recaptchaRef.current?.reset();
      setCaptchaToken('');
    } finally { setLoading(false); }
  }

  const inp = "mt-1 w-full rounded-card border border-blueprint-100 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blueprint-500";
  const inpErr = "mt-1 w-full rounded-card border border-red-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400";

  return (
    <main className="min-h-screen bp-grid flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md rounded-card border border-blueprint-100 bg-white p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-4">
          <button onClick={() => window.history.back()} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors">
            <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
          </button>
          <Link href="/" className="font-display text-xl font-semibold">tendrlo<span className="text-blueprint-500">.</span></Link>
        </div>
        <h1 className="font-display text-2xl font-semibold">Create an account</h1>

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
            <input id="fullName" autoComplete="name" value={fullName} onChange={e=>setFullName(e.target.value)} maxLength={100} className={errors.fullName?inpErr:inp}/>
          </Field>

          {role==='company'&&<>
            <Field id="companyName" label="Company name" error={errors.companyName} required>
              <input id="companyName" autoComplete="organization" value={companyName} onChange={e=>setCompanyName(e.target.value)} maxLength={200} className={errors.companyName?inpErr:inp}/>
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

          <div>
            <label className="text-sm font-medium">Phone number <span className="text-red-500">*</span></label>
            <div className="flex gap-2 mt-1">
              <select value={phoneCode} onChange={e=>setPhoneCode(e.target.value)}
                className="rounded-card border border-blueprint-100 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blueprint-500">
                {COUNTRY_CODES.map(c=>(
                  <option key={c.code} value={c.code}>{c.name} {c.code}</option>
                ))}
              </select>
              <input id="phone" type="tel" value={phoneNumber} onChange={e=>setPhoneNumber(e.target.value)} maxLength={20}
                placeholder="5xxxxxxxx"
                className={`flex-1 ${errors.phone?inpErr:inp}`}/>
            </div>
            {errors.phone&&<p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
          </div>

          <Field id="email" label="Email" error={errors.email} required>
            <input id="email" type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} maxLength={254} className={errors.email?inpErr:inp}/>
          </Field>

          <div>
            <label className="text-sm font-medium" htmlFor="password">Password <span className="text-red-500">*</span></label>
            <div className="relative">
              <input id="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={password} onChange={e=>setPassword(e.target.value)} maxLength={128}
                className={`${errors.password?inpErr:inp} pr-10`}/>
              <button type="button" onClick={()=>setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600">
                {showPassword ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21"/></svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                )}
              </button>
            </div>
            {errors.password&&<p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            <p className="text-xs text-slate-400 mt-1">Min 8 chars, with uppercase and a number.</p>
          </div>

          <div>
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '6LeYOGYtAAAAACxVNvdwZalBpxFH81DuBk8Tnvl3'}
              onChange={(token) => setCaptchaToken(token || '')}
            />
            {errors.captcha && <p className="text-xs text-red-500 mt-1">{errors.captcha}</p>}
          </div>

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


