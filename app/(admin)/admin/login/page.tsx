'use client'

export const dynamic = 'force-dynamic';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import SilverScreensLogo from '@/components/ui/SilverScreensLogo';
import { Eye, EyeOff, Lock, Mail, Shield, AlertCircle, ChevronLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const BG     = '#050505';
const BG2    = '#0B0F14';
const BG3    = '#121821';
const RED    = '#C8202A';
const GOLD   = '#D4A64A';
const BEBAS  = "'Bebas Neue', sans-serif";
const BARLOW = "'Barlow Condensed', sans-serif";

const RESEND_SECONDS = 180;

export default function AdminLoginPage() {
  const router = useRouter();

  const [role,      setRole]      = useState<'admin' | 'verifier'>('admin');
  const [email,     setEmail]     = useState('');
  const [password,  setPassword]  = useState('');
  const [showPwd,   setShowPwd]   = useState(false);
  const [remember,  setRemember]  = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [loginError, setLoginError] = useState('');   // errors on login step
  const [otpError,   setOtpError]   = useState('');   // errors on 2FA step
  const [step,      setStep]      = useState<'login' | '2fa'>('login');
  const [otp,       setOtp]       = useState(['', '', '', '', '', '']);
  const [timer,     setTimer]     = useState(RESEND_SECONDS);
  const [canResend, setCanResend] = useState(false);

  // Pending session — held in memory between login and 2FA
  const pendingSession = useRef<object | null>(null);

  // ── Countdown timer — only runs when on 2FA step ──
  useEffect(() => {
    if (step !== '2fa') return;
    if (timer <= 0) {
      setCanResend(true);
      return;
    }
    const t = setTimeout(() => setTimer(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timer, step]);

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  // ── Step 1: Credential login ──
  const handleLogin = async () => {
    if (!email || !password) {
      setLoginError('Please enter your email and password.');
      return;
    }
    setLoginError('');
    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (authError || !data.session) {
        setLoginError(authError?.message || 'Invalid email or password.');
        setLoading(false);
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, name')
        .eq('id', data.session.user.id)
        .single();

      if (profileError || !profile) {
        setLoginError('Profile not found. Please contact support.');
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }

      const allowedRoles = role === 'admin' ? ['admin'] : ['admin', 'verifier'];
      if (!allowedRoles.includes(profile.role)) {
        setLoginError(`Access denied. This account does not have ${role} privileges.`);
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }

      // Store session temporarily — only persist after 2FA passes
      pendingSession.current = {
        loggedIn:            true,
        token:               data.session.access_token,
        refreshToken:        data.session.refresh_token,
        userType:            profile.role,
        adminRole:           profile.role,
        id:                  data.session.user.id,
        name:                profile.name || data.session.user.email,
        email:               data.session.user.email,
        profileNumber:       profile.role,
        profileStatus:       'active',
        verifiedAt:          data.session.user.email_confirmed_at ?? new Date().toISOString(),
        loginAt:             new Date().toISOString(),
        twoFactorVerifiedAt: null,
        plan:                null,
        subscribed:          false,
        profilePhoto:        '',
        roles:               [],
        departments:         [],
        category:            '',
        country:             '',
      };

      // Send OTP
      const otpRes = await fetch('/api/auth/send-otp', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      if (!otpRes.ok) {
        const otpErr = await otpRes.json().catch(() => ({}));
        setLoginError(otpErr?.error || 'Failed to send OTP. Please try again.');
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }

      // Switch to 2FA — reset all OTP state cleanly
      setOtp(['', '', '', '', '', '']);
      setOtpError('');
      setTimer(RESEND_SECONDS);
      setCanResend(false);
      setLoading(false);
      setStep('2fa');

    } catch (err) {
      console.error('[ADMIN LOGIN ERROR]', err);
      setLoginError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  // ── Resend OTP ──
  const handleResendOtp = async () => {
    if (!canResend) return;
    setOtp(['', '', '', '', '', '']);
    setOtpError('');
    setCanResend(false);
    setTimer(RESEND_SECONDS);
    document.getElementById('otp-0')?.focus();

    const res = await fetch('/api/auth/send-otp', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email: email.trim().toLowerCase() }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      setOtpError(err?.error || 'Failed to resend OTP. Please try again.');
    }
  };

  // ── OTP input handlers ──
  const handleOtpChange = (val: string, idx: number) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 5) document.getElementById(`otp-${idx + 1}`)?.focus();
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      document.getElementById(`otp-${idx - 1}`)?.focus();
    }
  };

  // ── Step 2: Verify OTP ──
  const handleVerify = async () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 6) return;
    setOtpError('');
    setLoading(true);

    try {
      const res  = await fetch('/api/auth/verify-otp', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ otp: otpValue, email: email.trim().toLowerCase() }),
      });
      const data = await res.json();

      if (!res.ok) {
        setOtpError(data?.error || 'Invalid OTP. Please try again.');
        setLoading(false);
        return;
      }

      // Persist session now that 2FA passed
      // Admin sessions always use localStorage — they must not clear on tab close
      if (pendingSession.current) {
        const ssUser = {
          ...(pendingSession.current as object),
          twoFactorVerifiedAt: new Date().toISOString(),
        };
        localStorage.setItem('ss_user', JSON.stringify(ssUser));
        // Also mirror to sessionStorage so components that read either will find it
        sessionStorage.setItem('ss_user', JSON.stringify(ssUser));
        pendingSession.current = null;
      }

      setLoading(false);
      router.push('/admin/dashboard');

    } catch (err) {
      console.error('[ADMIN 2FA ERROR]', err);
      setOtpError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  const inp = (extra?: object) => ({
    width: '100%',
    background: BG3,
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: '12px 14px',
    color: '#F5F5F5',
    fontFamily: BARLOW,
    fontSize: 16,
    outline: 'none',
    boxSizing: 'border-box' as const,
    WebkitTextFillColor: '#F5F5F5',
    ...extra,
  });

  return (
    <div style={{ minHeight: '100vh', background: BG, display: 'flex', flexDirection: 'column', fontFamily: BARLOW, color: '#F5F5F5' }}>

      <header style={{ height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', background: BG2, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <SilverScreensLogo size="md" href="/" showTagline={false} />
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.45)', fontSize: 14, fontFamily: BARLOW, textDecoration: 'none' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#F5F5F5')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
        >
          <ChevronLeft size={14} /> Back to main site
        </a>
      </header>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{ width: '100%', maxWidth: 460 }}>

          {/* Header icon + title */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: 'rgba(200,32,42,0.12)', border: '1px solid rgba(200,32,42,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <Shield size={28} color={RED} />
            </div>
            <div style={{ fontFamily: BEBAS, fontSize: 28, letterSpacing: 2, color: '#F5F5F5', marginBottom: 6 }}>
              {step === 'login' ? 'ADMIN PORTAL' : 'TWO-FACTOR AUTH'}
            </div>
            <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>
              {step === 'login'
                ? 'Restricted access. Authorised personnel only.'
                : `Enter the 6-digit code sent to ${email}`}
            </div>
          </div>

          <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '32px 32px 28px', boxShadow: '0 24px 64px rgba(0,0,0,0.6)' }}>

            {/* ══ LOGIN STEP ══ */}
            {step === 'login' ? (
              <>
                {/* Role selector */}
                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: 'block', fontSize: 14, color: 'rgba(255,255,255,0.5)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>Login As</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {[
                      { key: 'admin',    label: 'Admin',    icon: '👤', desc: 'Full platform access' },
                      { key: 'verifier', label: 'Verifier', icon: '✅', desc: 'Verification access only' },
                    ].map(r => (
                      <div key={r.key} onClick={() => setRole(r.key as 'admin' | 'verifier')}
                        style={{ padding: '12px 14px', background: role === r.key ? 'rgba(200,32,42,0.1)' : BG3, border: `1px solid ${role === r.key ? RED : 'rgba(255,255,255,0.08)'}`, borderRadius: 10, cursor: 'pointer', transition: 'all 0.15s' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span style={{ fontSize: 18 }}>{r.icon}</span>
                          <span style={{ fontFamily: BARLOW, fontSize: 15, fontWeight: 700, color: role === r.key ? '#F5F5F5' : 'rgba(255,255,255,0.6)' }}>{r.label}</span>
                          {role === r.key && (
                            <div style={{ marginLeft: 'auto', width: 18, height: 18, borderRadius: '50%', background: RED, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <span style={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>✓</span>
                            </div>
                          )}
                        </div>
                        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', fontFamily: BARLOW }}>{r.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Email */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 14, color: 'rgba(255,255,255,0.5)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>Email Address</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} color="rgba(255,255,255,0.3)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                    <input type="email" value={email}
                      onChange={e => { setEmail(e.target.value); setLoginError(''); }}
                      placeholder="admin@silverscreens.com"
                      style={{ ...inp(), paddingLeft: 42 }}
                    />
                  </div>
                </div>

                {/* Password */}
                <div style={{ marginBottom: 8 }}>
                  <label style={{ display: 'block', fontSize: 14, color: 'rgba(255,255,255,0.5)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} color="rgba(255,255,255,0.3)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                    <input type={showPwd ? 'text' : 'password'} value={password}
                      onChange={e => { setPassword(e.target.value); setLoginError(''); }}
                      onKeyDown={e => e.key === 'Enter' && handleLogin()}
                      placeholder="Enter your password"
                      autoComplete="new-password"
                      style={{ ...inp(), paddingLeft: 42, paddingRight: 44 }}
                    />
                    <button type="button" onClick={() => setShowPwd(v => !v)}
                      style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', zIndex: 2, padding: 4 }}>
                      {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Remember + Forgot */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }} onClick={() => setRemember(v => !v)}>
                    <div style={{ width: 18, height: 18, borderRadius: 4, border: `1px solid ${remember ? RED : 'rgba(255,255,255,0.2)'}`, background: remember ? RED : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}>
                      {remember && <span style={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>✓</span>}
                    </div>
                    <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)' }}>Remember this device</span>
                  </div>
                  <button onClick={() => router.push('/forgot-password')}
                    style={{ background: 'none', border: 'none', color: GOLD, fontSize: 14, fontFamily: BARLOW, fontWeight: 600, cursor: 'pointer' }}>
                    Forgot password?
                  </button>
                </div>

                {/* Login error */}
                {loginError && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(200,32,42,0.1)', border: '1px solid rgba(200,32,42,0.25)', borderRadius: 8, marginBottom: 16 }}>
                    <AlertCircle size={16} color={RED} />
                    <span style={{ fontSize: 14, color: RED, fontFamily: BARLOW }}>{loginError}</span>
                  </div>
                )}

                {/* Login button */}
                <button onClick={handleLogin} disabled={loading}
                  style={{ width: '100%', padding: '14px', background: loading ? 'rgba(200,32,42,0.5)' : RED, border: 'none', borderRadius: 10, color: '#fff', fontFamily: BEBAS, fontSize: 20, letterSpacing: 2, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background 0.2s' }}
                  onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = '#a01822'; }}
                  onMouseLeave={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = RED; }}
                >
                  {loading ? (
                    <>
                      <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                      AUTHENTICATING…
                    </>
                  ) : `LOGIN AS ${role.toUpperCase()}`}
                </button>
              </>

            ) : (
              /* ══ 2FA STEP ══ */
              <>
                {/* OTP boxes */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 14, color: 'rgba(255,255,255,0.5)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 16, textAlign: 'center' }}>
                    Enter Verification Code
                  </label>
                  <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        id={`otp-${idx}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={e => handleOtpChange(e.target.value, idx)}
                        onKeyDown={e => handleOtpKeyDown(e, idx)}
                        style={{
                          width: 52, height: 56, textAlign: 'center',
                          background: digit ? 'rgba(212,166,74,0.08)' : BG3,
                          border: `1px solid ${digit ? GOLD : 'rgba(255,255,255,0.1)'}`,
                          borderRadius: 10, color: '#F5F5F5',
                          fontFamily: BEBAS, fontSize: 24, letterSpacing: 2,
                          outline: 'none', transition: 'border-color 0.15s',
                        }}
                        onFocus={e => { e.target.style.borderColor = GOLD; e.target.style.background = 'rgba(212,166,74,0.08)'; }}
                        onBlur={e  => { if (!digit) { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = BG3; } }}
                      />
                    ))}
                  </div>
                </div>

                {/* Timer + Resend */}
                <div style={{ textAlign: 'center', marginBottom: 16, fontSize: 14, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>
                  Didn't receive the code?{' '}
                  <button
                    onClick={handleResendOtp}
                    disabled={!canResend}
                    style={{
                      background: 'none', border: 'none', padding: 0,
                      color: canResend ? GOLD : 'rgba(255,255,255,0.3)',
                      fontSize: 14, fontFamily: BARLOW, fontWeight: 600,
                      cursor: canResend ? 'pointer' : 'default',
                      textDecoration: canResend ? 'underline' : 'none',
                    }}>
                    Resend OTP
                  </button>
                  {/* Timer shown while countdown is active */}
                  {!canResend && (
                    <span style={{ color: GOLD, fontWeight: 700, marginLeft: 6 }}>
                      in {formatTime(timer)}
                    </span>
                  )}
                </div>

                {/* OTP error */}
                {otpError && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(200,32,42,0.1)', border: '1px solid rgba(200,32,42,0.25)', borderRadius: 8, marginBottom: 16 }}>
                    <AlertCircle size={16} color={RED} />
                    <span style={{ fontSize: 14, color: RED, fontFamily: BARLOW }}>{otpError}</span>
                  </div>
                )}

                {/* Verify button */}
                <button
                  onClick={handleVerify}
                  disabled={loading || otp.some(d => !d)}
                  style={{
                    width: '100%', padding: 14,
                    background: otp.every(d => d) ? RED : 'rgba(255,255,255,0.06)',
                    border: 'none', borderRadius: 10,
                    color: otp.every(d => d) ? '#fff' : 'rgba(255,255,255,0.3)',
                    fontFamily: BEBAS, fontSize: 20, letterSpacing: 2,
                    cursor: otp.every(d => d) ? 'pointer' : 'not-allowed',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    transition: 'all 0.2s',
                  }}>
                  {loading ? (
                    <>
                      <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                      VERIFYING…
                    </>
                  ) : 'VERIFY & LOGIN'}
                </button>

                {/* Back to login */}
                <button
                  onClick={() => { setStep('login'); setOtp(['', '', '', '', '', '']); setOtpError(''); setLoginError(''); }}
                  style={{ width: '100%', marginTop: 10, padding: 12, background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: 'rgba(255,255,255,0.5)', fontFamily: BARLOW, fontSize: 15, cursor: 'pointer' }}>
                  ← Back to Login
                </button>
              </>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 24 }}>
            <Lock size={13} color="rgba(255,255,255,0.25)" />
            <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>
              This is a secured admin portal. All login attempts are logged and monitored.
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::-ms-reveal, input::-ms-clear { display: none; }
        input::-webkit-credentials-auto-fill-button { display: none !important; visibility: hidden; }
        input[type="password"]::-webkit-textfield-decoration-container { display: none; }
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0px 1000px ${BG3} inset !important;
          -webkit-text-fill-color: #F5F5F5 !important;
          caret-color: #F5F5F5;
          border: 1px solid rgba(255,255,255,0.1) !important;
        }
      `}</style>
    </div>
  );
}