'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SilverScreensLogo from '@/components/ui/SilverScreensLogo';

const RED    = '#C8202A';
const GOLD   = '#D4A64A';
const BG     = '#050505';
const BG2    = '#0B0F14';
const BARLOW = "'Barlow Condensed', sans-serif";
const BEBAS  = "'Bebas Neue', sans-serif";

type UserType = 'talent' | 'agency';
type Step     = 1 | 2 | 3;

const IUser  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IMail  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.8"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/></svg>;
const IPhone = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.8"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.07 12a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 3 1.18h3a2 2 0 0 1 2 1.72 17.7 17.7 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
const ILock  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.8"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const IEye   = ({ on }: { on: boolean }) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={on ? GOLD : 'rgba(255,255,255,0.2)'} strokeWidth="1.8" style={{ cursor: 'pointer', flexShrink: 0 }}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/>{!on && <line x1="1" y1="1" x2="23" y2="23"/>}<circle cx="12" cy="12" r="3"/></svg>;
const ICheck = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>;
const IArrowR = ({ col }: { col?: string }) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={col || 'currentColor'} strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
const IArrowL = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>;
const IFilm  = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="1.8"><rect x="2" y="2" width="20" height="20" rx="2"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="17" y1="7" x2="22" y2="7"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="2" y1="17" x2="7" y2="17"/></svg>;

function Field({ label, icon, placeholder, type = 'text', value, onChange, extra, hint }: { label: string; icon: React.ReactNode; placeholder: string; type?: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; extra?: React.ReactNode; hint?: string; }) {
  return (
    <div>
      <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: 2, textTransform: 'uppercase' as const, display: 'block', marginBottom: 8 }}>{label}</label>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1.5px solid rgba(212,166,74,0.25)', padding: '10px 0', transition: 'border-color 0.2s' }}>
        {icon}
        <input type={type} placeholder={placeholder} value={value} onChange={onChange}
          style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 15, color: '#F5F5F5', fontFamily: BARLOW }}
          onFocus={e => { (e.currentTarget.parentElement as HTMLElement).style.borderBottomColor = RED; }}
          onBlur={e  => { (e.currentTarget.parentElement as HTMLElement).style.borderBottomColor = 'rgba(212,166,74,0.25)'; }}
        />
        {extra}
      </div>
      {hint && <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)', marginTop: 4 }}>{hint}</div>}
    </div>
  );
}

function SprocketStrip() {
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 20, background: 'rgba(0,0,0,0.5)', borderRight: '0.5px solid rgba(212,166,74,0.15)' }}>
      <svg width="20" height="100%" viewBox="0 0 20 600" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        {Array.from({ length: 28 }).map((_, i) => (<rect key={i} x="4" y={10 + i * 22} width="12" height="9" rx="1.5" fill="rgba(212,166,74,0.4)" />))}
      </svg>
    </div>
  );
}

export default function SignUpPage() {
  const router = useRouter();
  const [step,        setStep]        = useState<Step>(1);
  const [userType,    setUserType]    = useState<UserType>('talent');
  const [agreed,      setAgreed]      = useState(false);
  const [showPass,    setShowPass]    = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [otpValues,   setOtpValues]   = useState<string[]>(Array(6).fill(''));
  const [loading,     setLoading]     = useState(false);
  const [formError,   setFormError]   = useState('');
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const registeredData = useRef<{ userId: string; profileNumber: string; token?: string; refreshToken?: string; } | null>(null);

  const [form, setForm] = useState({ fullName: '', stageName: '', email: '', mobile: '', password: '', confirmPassword: '' });

  const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => { setForm(prev => ({ ...prev, [k]: e.target.value })); setFormError(''); };

  const validateStep1 = (): boolean => {
    if (!form.fullName.trim())               { setFormError('Full name is required.'); return false; }
    if (!form.email.trim())                  { setFormError('Email address is required.'); return false; }
    if (!form.mobile.trim())                 { setFormError('Mobile number is required.'); return false; }
    if (!form.password)                      { setFormError('Password is required.'); return false; }
    if (form.password.length < 8)            { setFormError('Password must be at least 8 characters.'); return false; }
    if (!/[A-Za-z]/.test(form.password))     { setFormError('Password must contain at least one letter.'); return false; }
    if (!/[0-9]/.test(form.password))        { setFormError('Password must contain at least one number.'); return false; }
    if (!/[^A-Za-z0-9]/.test(form.password)) { setFormError('Password must contain at least one special character (e.g. @, #, $, !).'); return false; }
    if (!form.confirmPassword)               { setFormError('Please confirm your password.'); return false; }
    if (form.password !== form.confirmPassword) { setFormError('Passwords do not match. Please re-enter.'); return false; }
    if (!agreed)                             { setFormError('Please agree to the Terms & Conditions to continue.'); return false; }
    return true;
  };

  const handleRegister = async () => {
    if (!validateStep1()) return;
    setLoading(true); setFormError('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:      form.fullName.trim(),
          stageName: form.stageName.trim() || undefined,
          email:     form.email.trim().toLowerCase(),
          phone:     `+91${form.mobile.trim()}`,
          password:  form.password,
          role:  userType === 'agency' ? 'agency' : 'aspirant',
        }),
      });
      const data = await res.json();
      if (!res.ok) { setFormError(data.error || data.message || 'Registration failed. Please try again.'); setLoading(false); return; }
      const respData = data.data ?? data;
      const token = respData.session?.access_token ?? respData.token ?? '';
      const refreshToken = respData.session?.refresh_token ?? '';
      registeredData.current = { userId: respData.userId, profileNumber: respData.profileNumber, token, refreshToken };

      // Store auth immediately so payment page has the token
      localStorage.setItem('ss_user', JSON.stringify({
        loggedIn: true,
        id:            respData.userId ?? '',
        profileNumber: respData.profileNumber ?? '',
        token,
        refreshToken,
        name:          form.fullName,
        email:         form.email,
        userType:      userType === 'agency' ? 'agency' : 'aspirant',
        category: '', departments: [], roles: [],
        verifiedAt: new Date().toISOString(),
        subscribed: false, plan: null, profileStatus: 'incomplete',
      }));

      setStep(2);
    } catch { setFormError('Network error. Please check your connection and try again.'); }
    finally { setLoading(false); }
  };

  const otpComplete = otpValues.every(d => d !== '');

  const handleVerify = async () => {
    if (!otpComplete) return;
    setLoading(true); setFormError('');
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, otp: otpValues.join('') }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || data.message || 'Invalid OTP. Please try again.');
        setLoading(false);
        return;
      }
      const respData = data.data ?? data;

      // OTP verified — now sign in with email+password to get session token
      const loginRes = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const loginData = await loginRes.json();
      const loginRespData = loginData.data ?? loginData;
      const token        = loginRespData.session?.access_token ?? '';
      const refreshToken = loginRespData.session?.refresh_token ?? '';
      const userId       = loginRespData.user?.id ?? registeredData.current?.userId ?? '';
      const profileNumber = respData.profileNumber ?? registeredData.current?.profileNumber ?? '';

      localStorage.removeItem('ss_profile_draft');
      localStorage.setItem('ss_user', JSON.stringify({
        loggedIn:      true,
        id:            userId,
        profileNumber,
        token,
        refreshToken,
        name:          form.fullName,
        email:         form.email,
        userType:      userType === 'agency' ? 'agency' : 'aspirant',
        category: '', departments: [], roles: [],
        verifiedAt:    new Date().toISOString(),
        subscribed: false, plan: null, profileStatus: 'incomplete',
      }));
      setStep(3);
    } catch {
      setFormError('Network error. Please try again.');
    }
    setLoading(false);
  };

  const STEPS = [{ num: 1, sub: 'SCENE' }, { num: 2, sub: 'VERIFY' }, { num: 3, sub: 'ACTION' }];

  return (
    <div style={{ background: BG, fontFamily: BARLOW, color: '#F5F5F5', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: '#0a0a0a', borderBottom: '1px solid rgba(212,166,74,0.15)', display: 'flex', alignItems: 'stretch', height: 60, flexShrink: 0 }}>
        <div style={{ width: 180, background: 'repeating-linear-gradient(135deg,#1c1c1c 0,#1c1c1c 10px,#000 10px,#000 20px)', borderRight: '1px solid rgba(212,166,74,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 18px', flexShrink: 0 }}>
          <SilverScreensLogo size="md" href="/" showTagline={false} />
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0 48px', position: 'relative' }}>
          <div style={{ position: 'absolute', left: 48, right: 48, top: '50%', height: 1, background: 'rgba(255,255,255,0.07)' }} />
          <div style={{ position: 'absolute', left: 48, width: step === 1 ? 0 : step === 2 ? '50%' : '100%', top: '50%', height: 1, background: RED, transition: 'width 0.45s ease' }} />
          {STEPS.map((s, i) => {
            const done = step > s.num; const active = step === s.num;
            return (
              <div key={s.num} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: i === 0 ? 'flex-start' : i === 2 ? 'flex-end' : 'center', position: 'relative', zIndex: 1 }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: active ? RED : done ? 'rgba(200,32,42,0.2)' : 'rgba(255,255,255,0.05)', border: `1.5px solid ${active || done ? RED : 'rgba(255,255,255,0.15)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: BEBAS, fontSize: 14, color: active ? '#fff' : done ? RED : 'rgba(255,255,255,0.3)', transition: 'all 0.3s' }}>{done ? '✓' : s.num}</div>
                <span style={{ fontSize: 11, letterSpacing: 2, marginTop: 3, color: active ? RED : done ? 'rgba(200,32,42,0.6)' : 'rgba(255,255,255,0.25)', fontWeight: active ? 700 : 400 }}>{s.sub}</span>
              </div>
            );
          })}
        </div>
        <div style={{ borderLeft: '1px solid rgba(212,166,74,0.15)', padding: '0 22px', display: 'flex', flexDirection: 'column', justifyContent: 'center', flexShrink: 0 }}>
          <div style={{ fontSize: 10, color: 'rgba(212,166,74,0.5)', letterSpacing: 2 }}>TAKE</div>
          <div style={{ fontFamily: BEBAS, fontSize: 26, color: GOLD, lineHeight: 1 }}>0{step}</div>
        </div>
      </div>

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.5fr 1fr', minHeight: 0 }}>
        <div style={{ background: '#080808', borderRight: '1px solid rgba(255,255,255,0.05)', padding: '40px 32px 36px 40px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
          <SprocketStrip />
          <div style={{ position: 'absolute', right: -20, top: '50%', transform: 'translateY(-50%) rotate(90deg)', fontFamily: BEBAS, fontSize: 108, color: 'rgba(255,255,255,0.015)', letterSpacing: 8, pointerEvents: 'none', userSelect: 'none', whiteSpace: 'nowrap', lineHeight: 1 }}>CASTING</div>
          <div style={{ paddingLeft: 20, position: 'relative', zIndex: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ borderLeft: `3px solid ${RED}`, paddingLeft: 16, marginBottom: 28 }}>
              <div style={{ fontSize: 11, letterSpacing: 3, color: RED, textTransform: 'uppercase' as const, marginBottom: 6 }}>Your Audition Begins</div>
              <h1 style={{ fontFamily: BEBAS, fontSize: 52, lineHeight: 0.9, letterSpacing: 1, color: '#fff', marginBottom: 12 }}>JOIN<br/>THE<br/><span style={{ color: GOLD }}>CAST</span></h1>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', lineHeight: 1.65, fontStyle: 'italic', fontWeight: 300 }}>One profile. Thousands of opportunities. The biggest names in Indian film &amp; media are waiting.</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '0.5px solid rgba(212,166,74,0.15)', borderRadius: 8, padding: '16px', marginBottom: 28 }}>
              <div style={{ fontSize: 10, letterSpacing: 3, color: 'rgba(212,166,74,0.6)', textTransform: 'uppercase' as const, marginBottom: 14, borderBottom: '0.5px solid rgba(255,255,255,0.06)', paddingBottom: 10 }}>CASTING BRIEF</div>
              {[{ label: 'Active Talents', val: '50,000+', col: GOLD }, { label: 'Casting Companies', val: '5,000+', col: GOLD }, { label: 'Open Castings', val: '15,000+', col: RED }].map((row, i) => (
                <div key={row.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
                    <span style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)' }}>{row.label}</span>
                    <span style={{ fontFamily: BEBAS, fontSize: 20, color: row.col, letterSpacing: 1 }}>{row.val}</span>
                  </div>
                  {i < 2 && <div style={{ height: '0.5px', background: 'rgba(255,255,255,0.05)' }} />}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 'auto' }}>
              <div style={{ fontSize: 11, letterSpacing: 2, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' as const, marginBottom: 10 }}>You are</div>
              <div style={{ display: 'flex', gap: 10 }}>
                {[
                  { type: 'talent' as const, label: 'Talent', sub: 'Actor · Model · Artist', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={userType==='talent' ? RED : 'rgba(255,255,255,0.25)'} strokeWidth="1.8"><path d="M17.5 12c0 4.4-3.6 8-8 8S1.5 16.4 1.5 12V5L9.5 4l8 1z"/><path d="M22.5 9c0 4.4-2.2 8-6 9"/><circle cx="6.5" cy="11" r="1"/><circle cx="12.5" cy="11" r="1"/><path d="M6.5 15s1 1.5 3 1.5 3-1.5 3-1.5"/></svg> },
                  { type: 'agency' as const, label: 'Agency', sub: 'Studio · Production', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={userType==='agency' ? GOLD : 'rgba(255,255,255,0.25)'} strokeWidth="1.8"><rect x="3" y="2" width="18" height="20" rx="1"/><path d="M9 22V12h6v10"/><path d="M7 7h.01M7 11h.01M7 15h.01M11 7h.01M11 11h.01M17 7h.01M17 11h.01"/></svg> },
                ].map(opt => {
                  const active = userType === opt.type;
                  const bc = active ? (opt.type === 'talent' ? RED : GOLD) : 'rgba(255,255,255,0.08)';
                  const bg = active ? (opt.type === 'talent' ? 'rgba(200,32,42,0.1)' : 'rgba(212,166,74,0.06)') : 'rgba(255,255,255,0.03)';
                  return (
                    <div key={opt.type} onClick={() => setUserType(opt.type)} style={{ flex: 1, background: bg, border: `1.5px solid ${bc}`, borderRadius: 8, padding: '14px 10px', cursor: 'pointer', textAlign: 'center' as const, transition: 'all 0.2s' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}>{opt.icon}</div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: active ? '#fff' : 'rgba(255,255,255,0.35)' }}>{opt.label}</div>
                      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.28)', marginTop: 2 }}>{opt.sub}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div style={{ background: BG2, padding: '28px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'center', overflowY: 'auto' }}>
          {step === 1 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 20, paddingBottom: 14, borderBottom: '0.5px solid rgba(255,255,255,0.07)' }}>
                <div>
                  <div style={{ fontSize: 11, letterSpacing: 3, color: 'rgba(212,166,74,0.6)', textTransform: 'uppercase' as const, marginBottom: 4 }}>CAST REGISTRATION</div>
                  <h2 style={{ fontFamily: BEBAS, fontSize: 30, letterSpacing: 2, color: '#fff', margin: 0 }}>YOUR DETAILS</h2>
                </div>
                <div style={{ textAlign: 'right' as const }}>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', letterSpacing: 1 }}>STEP 1 OF 3</div>
                  <div style={{ fontFamily: BEBAS, fontSize: 20, color: 'rgba(255,255,255,0.07)', letterSpacing: 2 }}>SCENE ONE</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 16 }}>
                <Field label="Full Name"  icon={<IUser />} placeholder="Your full name"  value={form.fullName}  onChange={f('fullName')} />
                <Field label="Stage Name" icon={<span style={{ fontSize: 14, color: 'rgba(255,255,255,0.25)', fontFamily: BARLOW }}>@</span>} placeholder="stage_name" value={form.stageName} onChange={f('stageName')} hint="Must be unique" />
                <Field label="Email"      icon={<IMail />} placeholder="you@email.com"   value={form.email}     onChange={f('email')} type="email" />
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: 2, textTransform: 'uppercase' as const, display: 'block', marginBottom: 8 }}>Mobile</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1.5px solid rgba(212,166,74,0.25)', padding: '10px 0', transition: 'border-color 0.2s' }}>
                    <IPhone /><span style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, flexShrink: 0 }}>🇮🇳 +91</span>
                    <input type="tel" placeholder="98XXXXXXXX" value={form.mobile} onChange={f('mobile')} style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 15, color: '#F5F5F5', fontFamily: BARLOW }} onFocus={e => { (e.currentTarget.parentElement as HTMLElement).style.borderBottomColor = RED; }} onBlur={e => { (e.currentTarget.parentElement as HTMLElement).style.borderBottomColor = 'rgba(212,166,74,0.25)'; }} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: 2, textTransform: 'uppercase' as const, display: 'block', marginBottom: 8 }}>Password</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1.5px solid rgba(212,166,74,0.25)', padding: '10px 0', transition: 'border-color 0.2s' }}>
                    <ILock />
                    <input type={showPass ? 'text' : 'password'} placeholder="min. 8 chars, letter + number + symbol" value={form.password} onChange={f('password')} style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 15, color: '#F5F5F5', fontFamily: BARLOW }} onFocus={e => { (e.currentTarget.parentElement as HTMLElement).style.borderBottomColor = RED; }} onBlur={e => { (e.currentTarget.parentElement as HTMLElement).style.borderBottomColor = 'rgba(212,166,74,0.25)'; }} />
                    <span onClick={() => setShowPass(v => !v)}><IEye on={showPass} /></span>
                  </div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)', marginTop: 4 }}>Letters + numbers required</div>
                  {form.password.length > 0 && (
                    <div style={{ marginTop: 8 }}>
                      <div style={{ display: 'flex', gap: 4 }}>
                        {[{ label: 'min. 8 chars', ok: form.password.length >= 8 }, { label: 'letter', ok: /[A-Za-z]/.test(form.password) }, { label: 'number', ok: /[0-9]/.test(form.password) }, { label: 'special char', ok: /[^A-Za-z0-9]/.test(form.password) }].map(req => (
                          <div key={req.label} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontFamily: BARLOW, color: req.ok ? '#22C55E' : 'rgba(255,255,255,0.3)' }}><span>{req.ok ? '✓' : '○'}</span> {req.label}</div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: 2, textTransform: 'uppercase' as const, display: 'block', marginBottom: 8 }}>Confirm Password</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1.5px solid rgba(212,166,74,0.25)', padding: '10px 0', transition: 'border-color 0.2s' }}>
                    <ILock />
                    <input type={showConfirm ? 'text' : 'password'} placeholder="repeat password" value={form.confirmPassword} onChange={f('confirmPassword')} style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 15, color: '#F5F5F5', fontFamily: BARLOW }} onFocus={e => { (e.currentTarget.parentElement as HTMLElement).style.borderBottomColor = RED; }} onBlur={e => { (e.currentTarget.parentElement as HTMLElement).style.borderBottomColor = 'rgba(212,166,74,0.25)'; }} />
                    <span onClick={() => setShowConfirm(v => !v)}><IEye on={showConfirm} /></span>
                  </div>
                </div>
              </div>
              <div onClick={() => setAgreed(v => !v)} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 22, background: agreed ? 'rgba(212,166,74,0.05)' : 'rgba(255,255,255,0.02)', border: `0.5px solid ${agreed ? 'rgba(212,166,74,0.2)' : 'rgba(255,255,255,0.08)'}`, borderRadius: 8, padding: '14px 16px', cursor: 'pointer', transition: 'all 0.2s' }}>
                <div style={{ width: 18, height: 18, borderRadius: 4, background: agreed ? GOLD : 'transparent', border: `2px solid ${agreed ? GOLD : 'rgba(212,166,74,0.3)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1, transition: 'all 0.2s' }}>{agreed && <ICheck />}</div>
                <span style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>I agree to SilverScreens'{' '}<Link href="/terms" onClick={e => e.stopPropagation()} style={{ color: GOLD, textDecoration: 'none', fontWeight: 700 }}>Terms of Performance</Link>{' '}and{' '}<Link href="/privacy-policy" onClick={e => e.stopPropagation()} style={{ color: GOLD, textDecoration: 'none', fontWeight: 700 }}>Privacy Policy</Link>. I'm ready to step into the spotlight.</span>
              </div>
              {formError && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 14px', background: 'rgba(200,32,42,0.1)', border: '1px solid rgba(200,32,42,0.3)', borderRadius: 8, marginBottom: 14 }}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>⚠️</span>
                  <span style={{ fontSize: 15, color: '#fca5a5', fontFamily: BARLOW }}>{formError}</span>
                </div>
              )}
              <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
                <Link href="/login" style={{ flexShrink: 0, background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}><IArrowL /></Link>
                <button onClick={handleRegister} disabled={loading} style={{ flex: 1, background: loading ? 'rgba(200,32,42,0.4)' : RED, border: 'none', borderRadius: 8, padding: '14px', cursor: loading ? 'not-allowed' : 'pointer', color: '#fff', fontFamily: BEBAS, fontSize: 20, letterSpacing: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, transition: 'all 0.2s' }} onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-1px)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}>
                  {loading ? 'REGISTERING...' : <> NEXT SCENE <IArrowR /> </>}
                </button>
              </div>
              <div style={{ textAlign: 'center' as const }}>
                <span style={{ fontSize: 15, color: 'rgba(255,255,255,0.35)' }}>Already cast?{' '}</span>
                <Link href="/login" style={{ fontSize: 15, color: GOLD, fontWeight: 700, textDecoration: 'none' }}>Return to stage →</Link>
              </div>
            </div>
          )}

          {step === 2 && (
            <div style={{ textAlign: 'center' as const, padding: '20px 0' }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(200,32,42,0.1)', border: '1px solid rgba(200,32,42,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 34 }}>📧</div>
              <h3 style={{ fontFamily: BEBAS, fontSize: 32, letterSpacing: 2, color: '#F5F5F5', marginBottom: 10 }}>VERIFY YOUR EMAIL</h3>
              <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.45)', marginBottom: 32, lineHeight: 1.6 }}>We've sent a verification code to{' '}<span style={{ color: RED, fontWeight: 700 }}>{form.email || 'your email'}</span></p>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 24 }}>
                {otpValues.map((digit, i) => (
                  <input key={i} ref={el => { otpRefs.current[i] = el; }} type="text" inputMode="numeric" maxLength={1} value={digit}
                    onChange={e => { const val = e.target.value.replace(/\D/g, ''); const next = [...otpValues]; next[i] = val.slice(-1); setOtpValues(next); if (val && i < 5) otpRefs.current[i + 1]?.focus(); }}
                    onKeyDown={e => { if (e.key === 'Backspace' && !digit && i > 0) otpRefs.current[i - 1]?.focus(); }}
                    style={{ width: 50, height: 58, textAlign: 'center' as const, background: digit ? 'rgba(200,32,42,0.1)' : 'rgba(255,255,255,0.04)', border: `2px solid ${digit ? RED : 'rgba(255,255,255,0.1)'}`, borderRadius: 8, color: '#F5F5F5', fontSize: 26, fontFamily: BEBAS, outline: 'none', transition: 'all 0.2s' }}
                    onFocus={e => { e.target.style.borderColor = RED; e.target.style.background = 'rgba(200,32,42,0.1)'; }}
                    onBlur={e => { if (!digit) { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.04)'; } }}
                  />
                ))}
              </div>
              <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.35)', marginBottom: 28 }}>Didn't receive it?{' '}<button onClick={() => setOtpValues(Array(6).fill(''))} style={{ background: 'none', border: 'none', color: RED, fontFamily: BARLOW, fontSize: 15, fontWeight: 700, cursor: 'pointer', padding: 0 }}>Resend code</button></div>
              {formError && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 14px', background: 'rgba(200,32,42,0.1)', border: '1px solid rgba(200,32,42,0.3)', borderRadius: 8, marginBottom: 16 }}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>⚠️</span>
                  <span style={{ fontSize: 15, color: '#fca5a5', fontFamily: BARLOW }}>{formError}</span>
                </div>
              )}
              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => { setStep(1); setFormError(''); }} style={{ flexShrink: 0, background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '14px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#fff' }}><IArrowL /></button>
                <button onClick={handleVerify} disabled={!otpComplete || loading} style={{ flex: 1, background: otpComplete ? RED : 'rgba(200,32,42,0.2)', border: 'none', borderRadius: 8, padding: '14px', cursor: otpComplete ? 'pointer' : 'not-allowed', color: otpComplete ? '#fff' : 'rgba(255,255,255,0.2)', fontFamily: BEBAS, fontSize: 20, letterSpacing: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, transition: 'all 0.2s' }}>
                  {loading ? 'VERIFYING...' : <> VERIFY &amp; CONTINUE <IArrowR /> </>}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div style={{ textAlign: 'center' as const, padding: '28px 20px' }}>
              <div style={{ width: 88, height: 88, borderRadius: '50%', background: `linear-gradient(135deg, ${GOLD}, #E5BF63)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 40 }}>✓</div>
              <div style={{ fontFamily: BEBAS, fontSize: 14, letterSpacing: 4, color: RED, marginBottom: 8 }}>LIGHTS — CAMERA —</div>
              <h3 style={{ fontFamily: BEBAS, fontSize: 38, letterSpacing: 2, color: '#F5F5F5', marginBottom: 10, lineHeight: 0.95 }}>WELCOME TO<br/><span style={{ color: GOLD }}>SILVERSCREENS</span></h3>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', marginBottom: 24, lineHeight: 1.6, maxWidth: 380, margin: '0 auto 24px' }}>Your account is created. Complete the steps below to get on stage.</p>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(212,166,74,0.15)', borderRadius: 10, padding: '16px', marginBottom: 24, textAlign: 'left' as const }}>
                {[
                  { num: '01', label: 'Create your profile',   desc: 'Add your bio, photos and skills',       active: true  },
                  { num: '02', label: 'Choose a plan',         desc: 'Select the right plan for your career', active: false },
                  { num: '03', label: 'Complete payment',      desc: 'Secure checkout in seconds',            active: false },
                  { num: '04', label: 'Admin approval',        desc: "We'll review and verify your profile",  active: false },
                  { num: '05', label: 'Access your dashboard', desc: 'Start applying to casting calls',       active: false },
                ].map((s, i) => (
                  <div key={s.num} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: i < 4 ? '0.5px solid rgba(255,255,255,0.05)' : 'none' }}>
                    <div style={{ width: 26, height: 26, borderRadius: '50%', flexShrink: 0, background: s.active ? RED : 'rgba(255,255,255,0.05)', border: `1px solid ${s.active ? RED : 'rgba(255,255,255,0.1)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontFamily: BEBAS, fontSize: 12, color: s.active ? '#fff' : 'rgba(255,255,255,0.25)' }}>{s.num}</span></div>
                    <div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 700, color: s.active ? '#fff' : 'rgba(255,255,255,0.3)' }}>{s.label}</div><div style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)' }}>{s.desc}</div></div>
                    {s.active && <div style={{ fontSize: 12, color: RED, fontWeight: 700, letterSpacing: 1 }}>NEXT</div>}
                  </div>
                ))}
              </div>
              <button onClick={() => router.push(userType === 'agency' ? '/create-company-profile' : '/create-profile')} style={{ width: '100%', background: RED, border: 'none', borderRadius: 8, padding: '14px', cursor: 'pointer', fontFamily: BEBAS, fontSize: 20, letterSpacing: 3, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 10 }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}>
                CREATE YOUR PROFILE <IArrowR />
              </button>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)', marginTop: 8 }}>You'll choose a plan and complete payment after building your profile.</p>
            </div>
          )}
        </div>
      </div>

      <div style={{ background: '#000', borderTop: '0.5px solid rgba(212,166,74,0.1)', padding: '14px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, flexWrap: 'wrap' as const, gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(200,32,42,0.12)', border: '1px solid rgba(200,32,42,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="1.8"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>
          <div><div style={{ fontSize: 14, fontWeight: 700, color: '#F5F5F5' }}>Your Security is Our Priority</div><div style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>We never share your information with anyone.</div></div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {[{ label: 'App Store', sub: 'Download on the', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M8 12l2 2 4-4"/></svg> }, { label: 'Google Play', sub: 'Get it on', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5"><polygon points="5 3 19 12 5 21 5 3"/></svg> }].map(badge => (
            <a key={badge.label} href="#" style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.12)', borderRadius: 7, padding: '7px 14px', textDecoration: 'none' }} onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; }} onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}>
              {badge.icon}
              <div><div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: 0.5 }}>{badge.sub}</div><div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.65)' }}>{badge.label}</div></div>
            </a>
          ))}
        </div>
        <div style={{ textAlign: 'right' as const }}>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)', marginBottom: 4 }}>By signing up, you agree to our</div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', alignItems: 'center' }}>
            <Link href="/terms" style={{ fontSize: 14, color: RED, textDecoration: 'none', fontWeight: 600 }}>Terms &amp; Conditions</Link>
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
            <Link href="/privacy-policy" style={{ fontSize: 14, color: RED, textDecoration: 'none', fontWeight: 600 }}>Privacy Policy</Link>
          </div>
        </div>
      </div>
    </div>
  );
}