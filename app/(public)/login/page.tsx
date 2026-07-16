'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Shield, Lock, Mail, AlertCircle } from 'lucide-react'
import SilverScreensLogo from '@/components/ui/SilverScreensLogo'

/* ─── Tokens — identical to signup and all other pages ───────── */
const RED    = '#C8202A'
const GOLD   = '#D4A64A'
const BG     = '#050505'
const BG2    = '#0B0F14'
const BG3    = '#121821'
const BARLOW = "'Barlow Condensed', sans-serif"
const BEBAS  = "'Bebas Neue', sans-serif"

const FILM_BG = 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1400&q=80'

/* ─── Sprocket strip (same as signup) ────────────────────────── */
function SprocketStrip() {
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 20, background: 'rgba(0,0,0,0.5)', borderRight: '0.5px solid rgba(212,166,74,0.15)' }}>
      <svg width="20" height="100%" viewBox="0 0 20 600" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        {Array.from({ length: 28 }).map((_, i) => (
          <rect key={i} x="4" y={10 + i * 22} width="12" height="9" rx="1.5" fill="rgba(212,166,74,0.4)" />
        ))}
      </svg>
    </div>
  )
}

export default function LoginPage() {
  const [userType,  setUserType]  = useState<'talent' | 'company'>('talent')
  const [showPass,  setShowPass]  = useState(false)
  const [remember,  setRemember]  = useState(false)
  const [email,     setEmail]     = useState('')
  const [password,  setPassword]  = useState('')
  const [error,     setError]     = useState('')
  const [loading,   setLoading]   = useState(false)
  const [adminMode, setAdminMode] = useState(false)
  const [adminRole, setAdminRole] = useState<'admin' | 'verifier'>('admin')
  const [step,      setStep]      = useState<'login' | '2fa'>('login')
  const [otp,       setOtp]       = useState(['', '', '', '', '', ''])
  const router = useRouter()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const role = params.get('role')
    if (role === 'admin' || role === 'verifier') {
      setAdminMode(true)
      setAdminRole(role as 'admin' | 'verifier')
    }
  }, [])

  /* ─────────────────────────────────────────────────────────────
     handleLogin — wired to POST /api/auth/login
  ───────────────────────────────────────────────────────────── */
  const handleLogin = async () => {
    if (!email || !password) { setError('Please enter your email and password.'); return }
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        // API returns { error: string } or { message: string }
        setError(data.error || data.message || 'Invalid email or password.')
        setLoading(false)
        return
      }

      // ── data shape from your API:
      // { token, user: { id, name, email, userType, category, departments,
      //                  roles, verifiedAt, subscribed, plan, country,
      //                  profileStatus, profileNumber, ... } }
      const { token, user } = { token: data.data?.session?.access_token, user: data.data?.user }
      const refreshToken = data.data?.session?.refresh_token

      // Build the ss_user object matching the app's auth contract
      const ssUser = {
        loggedIn:      true,
        token,
        refreshToken,
        id:            user.id,
        name:          user.name,
        email:         user.email,
        userType: user.role ?? user.userType,
        category:      user.category      ?? '',
        departments:   user.departments   ?? [],
        roles:         user.roles         ?? [],
        verifiedAt:    user.verifiedAt    ?? null,
        subscribed:    user.subscribed    ?? false,
        plan:          user.plan          ?? null,
        country:       user.country       ?? '',
        profileStatus: user.profileStatus ?? 'incomplete',
        profileNumber: user.profile_number ?? user.profileNumber ?? null,
        profilePhoto:  '',   // will be filled below
        loginAt:       new Date().toISOString(),
      }

      // Fetch profile photo immediately after login
      if (token && (user.role === 'aspirant' || user.userType === 'aspirant')) {
        try {
          const pRes = await fetch('/api/profile/aspirant', { headers: { Authorization: `Bearer ${token}` } })
          if (pRes.ok) {
            const pData = await pRes.json()
            const p = pData.data?.profile ?? pData.profile ?? pData
            if (p?.profile_image_url) ssUser.profilePhoto = p.profile_image_url
            if (p?.first_name || p?.last_name) {
              ssUser.name = [p.first_name, p.last_name].filter(Boolean).join(' ') || ssUser.name
            }
          }
        } catch {}
      }

      localStorage.setItem('ss_user', JSON.stringify(ssUser))
      localStorage.removeItem('ss_profile_draft') // clear any stale draft from previous user

      // Optionally persist email for "remember me"
      if (remember) {
        localStorage.setItem('ss_remembered_email', email)
      } else {
        localStorage.removeItem('ss_remembered_email')
      }

      // ── Route based on userType ──
      if (adminMode || user.userType === 'admin' || user.userType === 'verifier') {
        // Admin: go to 2FA step (OTP is UI-only for now; backend 2FA hook-ready)
        setStep('2fa')
        setLoading(false)
        return
      }

      if (user.role === 'agency' || user.userType === 'agency') {
        router.push('/agency/dashboard')
      } else {
        // aspirant — check profile completeness
        router.push('/dashboard')
      }

    } catch (err) {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleOtpChange = (val: string, idx: number) => {
    if (!/^\d?$/.test(val)) return
    const next = [...otp]; next[idx] = val; setOtp(next)
    if (val && idx < 5) document.getElementById(`otp-${idx + 1}`)?.focus()
  }

  /* ─────────────────────────────────────────────────────────────
     handleVerify — Admin 2FA confirm
     (OTP verification endpoint can be wired here when ready;
      for now validates the stored session and routes to admin)
  ───────────────────────────────────────────────────────────── */
  const handleVerify = async () => {
    if (otp.some(d => !d)) return
    setLoading(true)

    try {
      // TODO: wire to POST /api/auth/verify-otp when backend is ready
      // const res = await fetch('/api/auth/verify-otp', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, otp: otp.join('') }),
      // })
      // const data = await res.json()
      // if (!res.ok) { setError(data.error || 'Invalid OTP.'); setLoading(false); return }

      // Confirm admin role in ss_user
      try {
        const existing = JSON.parse(localStorage.getItem('ss_user') || '{}')
        localStorage.setItem('ss_user', JSON.stringify({
          ...existing,
          adminRole,
          twoFactorVerifiedAt: new Date().toISOString(),
        }))
      } catch {}

      router.push('/admin/dashboard')

    } catch (err) {
      setError('Verification failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Pre-fill remembered email on mount
  useEffect(() => {
    const remembered = localStorage.getItem('ss_remembered_email')
    if (remembered) { setEmail(remembered); setRemember(true) }
  }, [])

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 12px 12px 44px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 8, color: '#F5F5F5',
    fontFamily: BARLOW, fontSize: 17, outline: 'none',
    boxSizing: 'border-box', transition: 'border-color 0.2s',
  }

  /* ════════════════════════════════════════════════════
     ADMIN PORTAL — unchanged
  ════════════════════════════════════════════════════ */
  if (adminMode) {
    return (
      <div style={{ height: '100vh', background: BG, display: 'flex', fontFamily: BARLOW, color: '#F5F5F5', position: 'fixed', inset: 0, zIndex: 200 }}>
        <style>{`main { padding-top: 0 !important; }`}</style>
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#0a0505', height: '100vh' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `url('${FILM_BG}')`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.12 }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(5,5,5,0.97) 0%, rgba(25,5,5,0.92) 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(200,32,42,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(200,32,42,0.04) 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
          <div style={{ position: 'relative', zIndex: 2, padding: '80px 48px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ marginBottom: 48 }}>
              <SilverScreensLogo size="md" href="/" showTagline={false} />
            </div>
            <div style={{ width: 80, height: 80, borderRadius: 20, background: 'rgba(200,32,42,0.12)', border: '1px solid rgba(200,32,42,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 32 }}>
              <Shield size={36} color={RED} />
            </div>
            <h1 style={{ fontFamily: BEBAS, fontSize: 82, letterSpacing: 3, lineHeight: 0.9, marginBottom: 20, color: '#F5F5F5' }}>
              ADMIN<br /><span style={{ color: RED }}>PORTAL</span>
            </h1>
            <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: 380, marginBottom: 48 }}>
              Restricted access for authorised SilverScreens administrators and verifiers only.
            </p>
            {[
              { icon: '🔒', title: 'End-to-End Encrypted',  desc: 'All admin sessions are fully encrypted' },
              { icon: '📋', title: 'Activity Logged',        desc: 'Every action is recorded and audited'   },
              { icon: '🛡️', title: '2FA Authentication',    desc: 'Additional verification required'       },
            ].map(f => (
              <div key={f.title} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(200,32,42,0.1)', border: '1px solid rgba(200,32,42,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{f.icon}</div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#F5F5F5', marginBottom: 2 }}>{f.title}</div>
                  <div style={{ fontSize: 17, color: 'rgba(255,255,255,0.45)' }}>{f.desc}</div>
                </div>
              </div>
            ))}
            <a href="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 40, color: 'rgba(255,255,255,0.3)', fontSize: 17, fontFamily: BARLOW, textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#F5F5F5')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
            >← Back to main login</a>
          </div>
        </div>
        <div style={{ width: 540, flexShrink: 0, background: BG2, borderLeft: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px', overflowY: 'auto' }}>
          <div style={{ maxWidth: 440, width: '100%', margin: '0 auto' }}>
            <div style={{ marginBottom: 32, textAlign: 'center' as const }}>
              <div style={{ fontFamily: BEBAS, fontSize: 34, letterSpacing: 2, color: '#F5F5F5', marginBottom: 8 }}>{step === 'login' ? 'SIGN IN TO ADMIN' : 'TWO-FACTOR AUTH'}</div>
              <div style={{ fontSize: 17, color: 'rgba(255,255,255,0.4)' }}>{step === 'login' ? 'Enter your credentials to access the admin panel.' : `Enter the 6-digit code sent to ${email}`}</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '32px' }}>
              {step === 'login' ? (
                <div>
                  <div style={{ marginBottom: 24 }}>
                    <label style={{ display: 'block', fontSize: 15, color: 'rgba(255,255,255,0.5)', letterSpacing: 1.5, textTransform: 'uppercase' as const, marginBottom: 8, fontWeight: 700 }}>Login As</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      {[{ key: 'admin', label: 'Admin', icon: '👤', desc: 'Full platform access' }, { key: 'verifier', label: 'Verifier', icon: '✅', desc: 'Verification access only' }].map(r => (
                        <div key={r.key} onClick={() => setAdminRole(r.key as 'admin' | 'verifier')}
                          style={{ padding: '12px 14px', background: adminRole === r.key ? 'rgba(200,32,42,0.1)' : BG3, border: `1px solid ${adminRole === r.key ? RED : 'rgba(255,255,255,0.08)'}`, borderRadius: 10, cursor: 'pointer' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                            <span>{r.icon}</span>
                            <span style={{ fontSize: 17, fontWeight: 700, color: adminRole === r.key ? '#F5F5F5' : 'rgba(255,255,255,0.6)' }}>{r.label}</span>
                            {adminRole === r.key && <div style={{ marginLeft: 'auto', width: 18, height: 18, borderRadius: '50%', background: RED, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ color: '#fff', fontSize: 15, fontWeight: 700 }}>✓</span></div>}
                          </div>
                          <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.35)' }}>{r.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', fontSize: 15, color: 'rgba(255,255,255,0.5)', letterSpacing: 1.5, textTransform: 'uppercase' as const, marginBottom: 8, fontWeight: 700 }}>Email</label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={15} color="rgba(255,255,255,0.3)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                      <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError('') }} placeholder="admin@silverscreens.com" style={{ ...inputStyle }} onFocus={e => (e.target.style.borderColor = RED)} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')} />
                    </div>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', fontSize: 15, color: 'rgba(255,255,255,0.5)', letterSpacing: 1.5, textTransform: 'uppercase' as const, marginBottom: 8, fontWeight: 700 }}>Password</label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={15} color="rgba(255,255,255,0.3)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                      <input type={showPass ? 'text' : 'password'} value={password} onChange={e => { setPassword(e.target.value); setError('') }} onKeyDown={e => e.key === 'Enter' && handleLogin()} placeholder="Enter your password" style={{ ...inputStyle, paddingRight: 44 }} onFocus={e => (e.target.style.borderColor = RED)} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')} />
                      <button onClick={() => setShowPass(v => !v)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', display: 'flex' }}>
                        {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }} onClick={() => setRemember(v => !v)}>
                      <div style={{ width: 18, height: 18, borderRadius: 4, border: `1px solid ${remember ? RED : 'rgba(255,255,255,0.2)'}`, background: remember ? RED : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {remember && <span style={{ color: '#fff', fontSize: 15, fontWeight: 700 }}>✓</span>}
                      </div>
                      <span style={{ fontSize: 17, color: 'rgba(255,255,255,0.55)' }}>Remember this device</span>
                    </div>
                    <button onClick={() => router.push('/forgot-password')} style={{ background: 'none', border: 'none', color: GOLD, fontSize: 17, fontWeight: 600, cursor: 'pointer', fontFamily: BARLOW }}>Forgot password?</button>
                  </div>
                  {error && <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(200,32,42,0.1)', border: '1px solid rgba(200,32,42,0.25)', borderRadius: 8, marginBottom: 16 }}><AlertCircle size={15} color={RED} /><span style={{ fontSize: 17, color: RED }}>{error}</span></div>}
                  <button onClick={handleLogin} disabled={loading} style={{ width: '100%', padding: '14px', background: loading ? 'rgba(200,32,42,0.5)' : RED, border: 'none', borderRadius: 8, color: '#fff', fontFamily: BEBAS, fontSize: 22, letterSpacing: 2, cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#e02530'; }} onMouseLeave={e => { if (!loading) e.currentTarget.style.background = RED; }}>
                    {loading ? 'SIGNING IN...' : 'SIGN IN →'}
                  </button>
                </div>
              ) : (
                <div>
                  <label style={{ display: 'block', fontSize: 15, color: 'rgba(255,255,255,0.5)', letterSpacing: 1.5, textTransform: 'uppercase' as const, marginBottom: 16, textAlign: 'center' as const, fontWeight: 700 }}>Enter Verification Code</label>
                  <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 24 }}>
                    {otp.map((digit, idx) => (
                      <input key={idx} id={`otp-${idx}`} type="text" inputMode="numeric" maxLength={1} value={digit}
                        onChange={e => handleOtpChange(e.target.value, idx)}
                        onKeyDown={e => { if (e.key === 'Backspace' && !digit && idx > 0) document.getElementById(`otp-${idx - 1}`)?.focus() }}
                        style={{ width: 52, height: 56, textAlign: 'center' as const, background: BG3, border: `1px solid ${digit ? GOLD : 'rgba(255,255,255,0.1)'}`, borderRadius: 10, color: '#F5F5F5', fontFamily: BEBAS, fontSize: 26, letterSpacing: 2, outline: 'none' }}
                      />
                    ))}
                  </div>
                  <div style={{ textAlign: 'center' as const, marginBottom: 20 }}>
                    <span style={{ fontSize: 17, color: 'rgba(255,255,255,0.4)' }}>Didn't receive the code? </span>
                    <button style={{ background: 'none', border: 'none', color: GOLD, fontSize: 17, fontWeight: 600, cursor: 'pointer', fontFamily: BARLOW }}>Resend OTP</button>
                  </div>
                  {error && <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(200,32,42,0.1)', border: '1px solid rgba(200,32,42,0.25)', borderRadius: 8, marginBottom: 16 }}><AlertCircle size={15} color={RED} /><span style={{ fontSize: 17, color: RED }}>{error}</span></div>}
                  <button onClick={handleVerify} disabled={loading || otp.some(d => !d)}
                    style={{ width: '100%', padding: 14, background: otp.every(d => d) ? RED : 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 10, color: otp.every(d => d) ? '#fff' : 'rgba(255,255,255,0.3)', fontFamily: BEBAS, fontSize: 22, letterSpacing: 2, cursor: otp.every(d => d) ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    {loading ? 'VERIFYING…' : 'VERIFY & LOGIN'}
                  </button>
                  <button onClick={() => { setStep('login'); setOtp(['', '', '', '', '', '']); setError('') }}
                    style={{ width: '100%', marginTop: 10, padding: 12, background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: 'rgba(255,255,255,0.5)', fontFamily: BARLOW, fontSize: 17, cursor: 'pointer' }}>
                    ← Back to Login
                  </button>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 24 }}>
              <Lock size={13} color="rgba(255,255,255,0.25)" />
              <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.3)' }}>All login attempts are logged and monitored.</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  /* ════════════════════════════════════════════════════
     MAIN LOGIN — matches signup design exactly
  ════════════════════════════════════════════════════ */
  return (
    <div style={{ background: BG, fontFamily: BARLOW, color: '#F5F5F5', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* ══ TOP STRIPE — same pattern as signup ══ */}
      <div style={{ background: '#0a0a0a', borderBottom: '1px solid rgba(212,166,74,0.15)', display: 'flex', alignItems: 'stretch', height: 60, flexShrink: 0 }}>

        {/* Clapperboard cell — SilverScreensLogo (same as signup) */}
        <div style={{ width: 180, background: 'repeating-linear-gradient(135deg,#1c1c1c 0,#1c1c1c 10px,#000 10px,#000 20px)', borderRight: '1px solid rgba(212,166,74,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 18px', flexShrink: 0 }}>
          <SilverScreensLogo size="md" href="/" showTagline={false} />
        </div>

        {/* Center: sign-in label */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, position: 'relative' }}>
          <div style={{ position: 'absolute', left: 48, right: 48, top: '50%', height: 1, background: 'rgba(255,255,255,0.06)' }} />
          {[
            { label: 'TALENT',  active: userType === 'talent'  },
            { label: 'AGENCY',  active: userType === 'company' },
          ].map((s, i) => (
            <div key={s.label} onClick={() => setUserType(i === 0 ? 'talent' : 'company')}
              style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: s.active ? RED : 'rgba(255,255,255,0.05)', border: `1.5px solid ${s.active ? RED : 'rgba(255,255,255,0.15)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}>
                <span style={{ fontFamily: BEBAS, fontSize: 13, color: s.active ? '#fff' : 'rgba(255,255,255,0.3)' }}>{i + 1}</span>
              </div>
              <span style={{ fontSize: 13, letterSpacing: 2, marginTop: 3, color: s.active ? RED : 'rgba(255,255,255,0.25)', fontWeight: s.active ? 700 : 400 }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Right decoration */}
        <div style={{ borderLeft: '1px solid rgba(212,166,74,0.15)', padding: '0 22px', display: 'flex', flexDirection: 'column', justifyContent: 'center', flexShrink: 0 }}>
          <div style={{ fontSize: 12, color: 'rgba(212,166,74,0.5)', letterSpacing: 2 }}>SESSION</div>
          <div style={{ fontFamily: BEBAS, fontSize: 28, color: GOLD, lineHeight: 1 }}>01</div>
        </div>
      </div>

      {/* ══ BODY ══ */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.5fr 1fr', minHeight: 0 }}>

        {/* ── LEFT PANEL — dark editorial, same as signup ── */}
        <div style={{ background: '#080808', borderRight: '1px solid rgba(255,255,255,0.05)', padding: '40px 32px 36px 40px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
          <SprocketStrip />

          {/* BG watermark */}
          <div style={{ position: 'absolute', right: -20, top: '50%', transform: 'translateY(-50%) rotate(90deg)', fontFamily: BEBAS, fontSize: 110, color: 'rgba(255,255,255,0.015)', letterSpacing: 8, pointerEvents: 'none', userSelect: 'none', whiteSpace: 'nowrap', lineHeight: 1 }}>SIGN IN</div>

          <div style={{ paddingLeft: 20, position: 'relative', zIndex: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>

            {/* Headline with red left bar — mirrors signup */}
            <div style={{ borderLeft: `3px solid ${RED}`, paddingLeft: 16, marginBottom: 28 }}>
              <div style={{ fontSize: 13, letterSpacing: 3, color: RED, textTransform: 'uppercase' as const, marginBottom: 6 }}>Your Moment Begins</div>
              <h1 style={{ fontFamily: BEBAS, fontSize: 54, lineHeight: 0.9, letterSpacing: 1, color: '#fff', marginBottom: 12 }}>
                ENTER<br/>THE<br/><span style={{ color: GOLD }}>STAGE</span>
              </h1>
              <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.4)', lineHeight: 1.65, fontStyle: 'italic', fontWeight: 300 }}>
                Log in to access casting calls, connect with agencies, and grow your career.
              </p>
            </div>

            {/* Feature points */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '0.5px solid rgba(212,166,74,0.15)', borderRadius: 8, padding: '16px', marginBottom: 28 }}>
              <div style={{ fontSize: 12, letterSpacing: 3, color: 'rgba(212,166,74,0.6)', textTransform: 'uppercase' as const, marginBottom: 14, borderBottom: '0.5px solid rgba(255,255,255,0.06)', paddingBottom: 10 }}>WHY SILVERSCREENS</div>
              {[
                { icon: '🛡️', title: 'Secure & Trusted',     desc: 'Your data is encrypted and protected'   },
                { icon: '🎬', title: 'Endless Opportunities', desc: 'Access thousands of casting calls'      },
                { icon: '⭐', title: 'Build Your Network',    desc: 'Connect with top industry professionals' },
              ].map((f, i) => (
                <div key={f.title}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0' }}>
                    <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(200,32,42,0.1)', border: '1px solid rgba(200,32,42,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{f.icon}</div>
                    <div>
                      <div style={{ fontSize: 17, fontWeight: 700, color: '#F5F5F5' }}>{f.title}</div>
                      <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.35)' }}>{f.desc}</div>
                    </div>
                  </div>
                  {i < 2 && <div style={{ height: '0.5px', background: 'rgba(255,255,255,0.05)' }} />}
                </div>
              ))}
            </div>

            {/* Stats — same casting brief style */}
            <div style={{ marginTop: 'auto' }}>
              <div style={{ fontSize: 12, letterSpacing: 3, color: 'rgba(212,166,74,0.6)', textTransform: 'uppercase' as const, marginBottom: 10 }}>BY THE NUMBERS</div>
              <div style={{ display: 'flex', gap: 0, border: '0.5px solid rgba(212,166,74,0.15)', borderRadius: 8, overflow: 'hidden' }}>
                {[
                  { num: '50,000+', lbl: 'Talents'  },
                  { num: '5,000+',  lbl: 'Agencies' },
                  { num: '15,000+', lbl: 'Castings' },
                ].map((s, i) => (
                  <div key={s.lbl} style={{ flex: 1, padding: '12px 8px', textAlign: 'center' as const, borderRight: i < 2 ? '0.5px solid rgba(212,166,74,0.15)' : 'none', background: 'rgba(255,255,255,0.02)' }}>
                    <div style={{ fontFamily: BEBAS, fontSize: 22, color: GOLD, letterSpacing: 1 }}>{s.num}</div>
                    <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{s.lbl}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL — form, same aesthetic as signup right panel ── */}
        <div style={{ background: BG2, padding: '36px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center', overflowY: 'auto' }}>

          {/* Header — same style as "CAST REGISTRATION" in signup */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 26, paddingBottom: 16, borderBottom: '0.5px solid rgba(255,255,255,0.07)' }}>
            <div>
              <div style={{ fontSize: 13, letterSpacing: 3, color: 'rgba(212,166,74,0.6)', textTransform: 'uppercase' as const, marginBottom: 4 }}>STAGE ACCESS</div>
              <h2 style={{ fontFamily: BEBAS, fontSize: 32, letterSpacing: 2, color: '#fff', margin: 0 }}>SIGN IN</h2>
            </div>
            <div style={{ textAlign: 'right' as const }}>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.2)', letterSpacing: 1 }}>RETURNING</div>
              <div style={{ fontFamily: BEBAS, fontSize: 22, color: 'rgba(255,255,255,0.07)', letterSpacing: 2 }}>MEMBER</div>
            </div>
          </div>

          {/* User type selector — same card style as signup */}
          <div style={{ marginBottom: 22 }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: 2, textTransform: 'uppercase' as const, display: 'block', marginBottom: 10 }}>Sign in as</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { type: 'talent' as const, label: 'Talent', sub: 'Actor · Model · Artist',
                  icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={userType==='talent' ? RED : 'rgba(255,255,255,0.25)'} strokeWidth="1.8"><path d="M17.5 12c0 4.4-3.6 8-8 8S1.5 16.4 1.5 12V5L9.5 4l8 1z"/><path d="M22.5 9c0 4.4-2.2 8-6 9"/><circle cx="6.5" cy="11" r="1"/><circle cx="12.5" cy="11" r="1"/><path d="M6.5 15s1 1.5 3 1.5 3-1.5 3-1.5"/></svg> },
                { type: 'company' as const, label: 'Agency', sub: 'Studio · Production',
                  icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={userType==='company' ? GOLD : 'rgba(255,255,255,0.25)'} strokeWidth="1.8"><rect x="3" y="2" width="18" height="20" rx="1"/><path d="M9 22V12h6v10"/><path d="M7 7h.01M7 11h.01M7 15h.01M11 7h.01M11 11h.01M17 7h.01M17 11h.01"/></svg> },
              ].map(opt => {
                const active = userType === opt.type
                const bc = active ? (opt.type === 'talent' ? RED : GOLD) : 'rgba(255,255,255,0.08)'
                const bg = active ? (opt.type === 'talent' ? 'rgba(200,32,42,0.1)' : 'rgba(212,166,74,0.06)') : 'rgba(255,255,255,0.03)'
                return (
                  <div key={opt.type} onClick={() => setUserType(opt.type)}
                    style={{ flex: 1, background: bg, border: `1.5px solid ${bc}`, borderRadius: 8, padding: '12px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, transition: 'all 0.2s' }}>
                    <div style={{ width: 16, height: 16, borderRadius: '50%', border: `2px solid ${active ? bc : 'rgba(255,255,255,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {active && <div style={{ width: 7, height: 7, borderRadius: '50%', background: bc }} />}
                    </div>
                    {opt.icon}
                    <div>
                      <div style={{ fontSize: 17, fontWeight: 700, color: active ? '#fff' : 'rgba(255,255,255,0.4)' }}>{opt.label}</div>
                      <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.28)', marginTop: 1 }}>{opt.sub}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Email — underline style matching signup */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: 2, textTransform: 'uppercase' as const, display: 'block', marginBottom: 8 }}>Email Address</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, borderBottom: `1.5px solid rgba(212,166,74,0.25)`, padding: '10px 0', transition: 'border-color 0.2s' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.8"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/></svg>
              <input type="email" placeholder="you@email.com" value={email} onChange={e => { setEmail(e.target.value); setError('') }}
                style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 17, color: '#F5F5F5', fontFamily: BARLOW }}
                onFocus={e => { (e.currentTarget.parentElement as HTMLElement).style.borderBottomColor = RED }}
                onBlur={e  => { (e.currentTarget.parentElement as HTMLElement).style.borderBottomColor = 'rgba(212,166,74,0.25)' }}
              />
            </div>
          </div>

          {/* Password — underline style matching signup */}
          <div style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: 2, textTransform: 'uppercase' as const }}>Password</label>
              <Link href="/forgot-password" style={{ fontSize: 16, color: GOLD, fontWeight: 600, textDecoration: 'none' }}>Forgot password?</Link>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, borderBottom: `1.5px solid rgba(212,166,74,0.25)`, padding: '10px 0', transition: 'border-color 0.2s' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.8"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <input type={showPass ? 'text' : 'password'} placeholder="Enter your password" value={password} onChange={e => { setPassword(e.target.value); setError('') }} onKeyDown={e => e.key === 'Enter' && handleLogin()}
                style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 17, color: '#F5F5F5', fontFamily: BARLOW }}
                onFocus={e => { (e.currentTarget.parentElement as HTMLElement).style.borderBottomColor = RED }}
                onBlur={e  => { (e.currentTarget.parentElement as HTMLElement).style.borderBottomColor = 'rgba(212,166,74,0.25)' }}
              />
              <span onClick={() => setShowPass(v => !v)} style={{ cursor: 'pointer', flexShrink: 0 }}>
                {showPass
                  ? <EyeOff size={15} color={GOLD} />
                  : <Eye size={15} color="rgba(255,255,255,0.25)" />}
              </span>
            </div>
          </div>

          {/* Remember me */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22, marginTop: 10 }}>
            <div onClick={() => setRemember(v => !v)} style={{ width: 16, height: 16, borderRadius: 3, border: `2px solid ${remember ? RED : 'rgba(212,166,74,0.3)'}`, background: remember ? RED : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer', transition: 'all 0.2s' }}>
              {remember && <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5"><polyline points="20 6 9 17 4 12"/></svg>}
            </div>
            <span style={{ fontSize: 17, color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }} onClick={() => setRemember(v => !v)}>Keep me signed in on this device</span>
          </div>

          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(200,32,42,0.1)', border: '1px solid rgba(200,32,42,0.25)', borderRadius: 8, marginBottom: 16 }}>
              <AlertCircle size={14} color={RED} />
              <span style={{ fontSize: 17, color: RED }}>{error}</span>
            </div>
          )}

          {/* CTA — same style as signup "NEXT SCENE" */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
            <Link href="/signup" style={{ flexShrink: 0, background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            </Link>
            <button onClick={handleLogin} disabled={loading}
              style={{ flex: 1, background: loading ? 'rgba(200,32,42,0.4)' : RED, border: 'none', borderRadius: 8, padding: '14px', cursor: loading ? 'not-allowed' : 'pointer', color: '#fff', fontFamily: BEBAS, fontSize: 22, letterSpacing: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, transition: 'all 0.2s' }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}
            >
              {loading ? 'SIGNING IN...' : <>ENTER THE STAGE <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></>}
            </button>
          </div>

          {/* Divider + Social */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{ flex: 1, height: '0.5px', background: 'rgba(255,255,255,0.08)' }} />
            <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.25)', letterSpacing: 2 }}>OR CONTINUE WITH</span>
            <div style={{ flex: 1, height: '0.5px', background: 'rgba(255,255,255,0.08)' }} />
          </div>
          <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
            {[{ label: 'Google', icon: '🔵' }, { label: 'Apple', icon: '🍎' }].map(s => (
              <button key={s.label} style={{ flex: 1, padding: '11px 10px', background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'border-color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
              >
                <span style={{ fontSize: 19 }}>{s.icon}</span>
                <span style={{ fontFamily: BARLOW, fontSize: 17, color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>Continue with {s.label}</span>
              </button>
            ))}
          </div>

          <div style={{ textAlign: 'center' as const }}>
            <span style={{ fontSize: 17, color: 'rgba(255,255,255,0.35)' }}>New to SilverScreens? </span>
            <Link href="/signup" style={{ fontSize: 17, color: GOLD, fontWeight: 700, textDecoration: 'none' }}>Join the cast →</Link>
          </div>

          {/* Admin portal link */}
          <div style={{ textAlign: 'center' as const, marginTop: 16, paddingTop: 16, borderTop: '0.5px solid rgba(255,255,255,0.06)' }}>
            <Link href="/login?role=admin" style={{ fontSize: 15, color: 'rgba(255,255,255,0.25)', textDecoration: 'none', letterSpacing: 0.5 }}
              onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.25)')}
            >Admin portal access →</Link>
          </div>
        </div>
      </div>

      {/* ══ BOTTOM BAR — identical to signup ══ */}
      <div style={{ background: '#000', borderTop: '0.5px solid rgba(212,166,74,0.1)', padding: '14px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, flexWrap: 'wrap' as const, gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(200,32,42,0.12)', border: '1px solid rgba(200,32,42,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Lock size={14} color={RED} />
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#F5F5F5' }}>Your Security is Our Priority</div>
            <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.3)' }}>We never share your information with anyone.</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {[{ label: 'App Store', sub: 'Download on the', icon: '🍎' }, { label: 'Google Play', sub: 'Get it on', icon: '▶️' }].map(badge => (
            <a key={badge.label} href="#" style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.12)', borderRadius: 7, padding: '7px 14px', textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
            >
              <span style={{ fontSize: 20 }}>{badge.icon}</span>
              <div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', letterSpacing: 0.5 }}>{badge.sub}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'rgba(255,255,255,0.65)' }}>{badge.label}</div>
              </div>
            </a>
          ))}
        </div>
        <div style={{ textAlign: 'right' as const }}>
          <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.3)', marginBottom: 4 }}>By logging in, you agree to our</div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', alignItems: 'center' }}>
            <Link href="/terms"          style={{ fontSize: 16, color: RED, textDecoration: 'none', fontWeight: 600 }}>Terms &amp; Conditions</Link>
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
            <Link href="/privacy-policy" style={{ fontSize: 16, color: RED, textDecoration: 'none', fontWeight: 600 }}>Privacy Policy</Link>
          </div>
        </div>
      </div>
    </div>
  )
}