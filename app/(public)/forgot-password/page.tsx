'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const M = "'Barlow Condensed', sans-serif"
const B = "'Bebas Neue', sans-serif"
const RED   = '#C8202A'
const GREEN = '#22C55E'
const GOLD  = '#D4A64A'

const HERO_BG_STEP1 = 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=1400&q=80'
const HERO_BG_STEP2 = 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1400&q=80'

const inp: React.CSSProperties = {
  width: '100%', padding: '13px 14px',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 8, color: '#F5F5F5',
  fontFamily: M, fontSize: 16, outline: 'none',
  boxSizing: 'border-box', transition: 'border-color 0.2s',
}

export default function ForgotPasswordPage() {
  const router = useRouter()

  // Step: 'email' | 'otp' | 'success'
  const [step,    setStep]    = useState<'email' | 'otp' | 'success'>('email')
  const [email,   setEmail]   = useState('')
  const [otp,     setOtp]     = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [resent,  setResent]  = useState(false)
  const [resentLoading, setResentLoading] = useState(false)

  /* ── Step 1: Send reset email ── */
  async function handleSendLink() {
    if (!email.trim()) { setError('Please enter your email address.'); return }
    setError(''); setLoading(true)
    try {
      const res  = await fetch('/api/auth/forgot-password', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email: email.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.')
      } else {
        setStep('otp')
      }
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  /* ── Step 2: Verify OTP ── */
  async function handleVerifyOtp() {
    const cleanOtp = otp.trim()
    if (!cleanOtp || cleanOtp.length < 6) { setError('Please enter the complete 6-digit OTP.'); return }
    setError(''); setLoading(true)
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          email,
          otp:      cleanOtp,
          otp_code: cleanOtp,
          type:     'forgot_password',
          otp_type: 'forgot_password',
          identifier: email.trim(),
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || data.message || 'Invalid or expired OTP. Please try again.')
      } else {
        const token = data.data?.token || data.token || data.data?.reset_token || ''
        router.push(`/reset-password?email=${encodeURIComponent(email.trim())}&token=${encodeURIComponent(token)}`)
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  /* ── Resend OTP ── */
  async function handleResend() {
    setResentLoading(true); setResent(false); setError('')
    try {
      await fetch('/api/auth/forgot-password', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email: email.trim() }),
      })
      setResent(true)
      setTimeout(() => setResent(false), 4000)
    } catch {
      setError('Failed to resend. Please try again.')
    } finally {
      setResentLoading(false)
    }
  }

  const isStep2 = step === 'otp'

  return (
    <div style={{ minHeight: '100vh', background: '#050505', fontFamily: M, display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 520px', minHeight: '100vh' }}>

        {/* ── LEFT ── */}
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <img src={isStep2 ? HERO_BG_STEP2 : HERO_BG_STEP1} alt="" aria-hidden="true"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', transition: 'opacity 0.5s' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(5,5,5,0.85) 0%, rgba(5,5,5,0.6) 60%, rgba(5,5,5,0.25) 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(5,5,5,0.65) 0%, transparent 100%)' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 160, background: 'linear-gradient(to top, #050505, transparent)' }} />
          <div style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 48 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ width: 32, height: 2, background: RED }} />
              <span style={{ fontFamily: M, fontSize: 14, letterSpacing: 4, color: RED, textTransform: 'uppercase' as const, fontWeight: 700 }}>
                {isStep2 ? 'Check Your Email' : 'Account Recovery'}
              </span>
            </div>
            {!isStep2 ? (
              <>
                <h1 style={{ fontFamily: B, fontSize: 'clamp(44px, 6vw, 72px)', lineHeight: 0.95, letterSpacing: 2, marginBottom: 20 }}>
                  <span style={{ color: '#F5F5F5', display: 'block' }}>RESET YOUR</span>
                  <span style={{ color: RED, display: 'block' }}>PASSWORD</span>
                </h1>
                <p style={{ fontFamily: M, fontSize: 14, color: '#A8B0BD', lineHeight: 1.75, maxWidth: 360 }}>
                  No worries! It happens to the best of us. Enter your email and we'll help you get back to your account.
                </p>
              </>
            ) : (
              <>
                <h1 style={{ fontFamily: B, fontSize: 'clamp(44px, 6vw, 72px)', lineHeight: 0.95, letterSpacing: 2, marginBottom: 20 }}>
                  <span style={{ color: '#F5F5F5', display: 'block' }}>CHECK YOUR</span>
                  <span style={{ color: RED, display: 'block' }}>EMAIL</span>
                </h1>
                <p style={{ fontFamily: M, fontSize: 14, color: '#A8B0BD', lineHeight: 1.75, maxWidth: 360 }}>
                  We've sent a 6-digit OTP to your email address. Enter it below to verify your identity and reset your password.
                </p>
              </>
            )}
          </div>
        </div>

        {/* ── RIGHT — Form ── */}
        <div style={{ background: '#0B0F14', borderLeft: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '80px 48px', boxSizing: 'border-box' as const }}>
          <div style={{ maxWidth: 440, width: '100%', margin: '0 auto' }}>

            {/* ══ STEP 1: EMAIL ENTRY ══ */}
            {step === 'email' && (
              <>
                <div style={{ marginBottom: 32 }}>
                  <h2 style={{ fontFamily: B, fontSize: 36, letterSpacing: 2, color: '#F5F5F5', marginBottom: 8 }}>Reset Password</h2>
                  <div style={{ width: 48, height: 2, background: RED, marginBottom: 16 }} />
                  <p style={{ fontFamily: M, fontSize: 15, color: '#A8B0BD', lineHeight: 1.7 }}>
                    Enter the email address associated with your SilverScreens account and we'll send you a 6-digit OTP to reset your password.
                  </p>
                </div>

                {error && (
                  <div style={{ background: 'rgba(200,32,42,0.1)', border: '1px solid rgba(200,32,42,0.3)', borderRadius: 8, padding: '12px 16px', marginBottom: 16, fontFamily: M, fontSize: 14, color: '#FCA5A5' }}>
                    {error}
                  </div>
                )}

                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontFamily: M, fontSize: 14, fontWeight: 600, color: '#F5F5F5', display: 'block', marginBottom: 8 }}>Email Address</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 15, opacity: 0.4 }}>✉️</span>
                    <input type="email" placeholder="Enter your registered email address"
                      value={email} onChange={e => setEmail(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSendLink()}
                      style={{ ...inp, paddingLeft: 44 }}
                      onFocus={e => e.target.style.borderColor = RED}
                      onBlur={e  => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
                  </div>
                </div>

                <button onClick={handleSendLink} disabled={loading} style={{
                  width: '100%', padding: '14px', background: loading ? '#7a1015' : RED,
                  border: 'none', borderRadius: 8, color: '#F5F5F5', fontFamily: B,
                  fontSize: 22, letterSpacing: 2, cursor: loading ? 'not-allowed' : 'pointer',
                  marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                  boxShadow: '0 8px 24px rgba(200,32,42,0.3)', transition: 'background 0.2s',
                }}
                  onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#e02530' }}
                  onMouseLeave={e => { if (!loading) e.currentTarget.style.background = RED }}
                >
                  {loading ? 'Sending...' : 'Send Reset Link →'}
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                  <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
                  <span style={{ fontFamily: M, fontSize: 14, color: '#6A7080', letterSpacing: 2 }}>OR</span>
                  <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
                </div>

                <Link href="/login" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, width: '100%', padding: '13px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, color: '#F5F5F5', fontFamily: B, fontSize: 18, letterSpacing: 1, textDecoration: 'none' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = RED}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)'}
                >← Back to Login</Link>
              </>
            )}

            {/* ══ STEP 2: OTP ENTRY ══ */}
            {step === 'otp' && (
              <>
                {/* Green check */}
                <div style={{ width: 72, height: 72, borderRadius: '50%', margin: '0 auto 24px', border: `2px solid ${GREEN}`, background: 'rgba(34,197,94,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: GREEN, fontSize: 32, fontWeight: 700 }}>✓</span>
                </div>

                <h2 style={{ fontFamily: B, fontSize: 32, letterSpacing: 2, color: '#F5F5F5', marginBottom: 8, textAlign: 'center' }}>CHECK YOUR EMAIL</h2>
                <div style={{ width: 48, height: 2, background: GREEN, margin: '0 auto 16px' }} />

                <p style={{ fontFamily: M, fontSize: 15, color: '#A8B0BD', lineHeight: 1.7, textAlign: 'center', marginBottom: 28 }}>
                  We sent a 6-digit OTP to{' '}
                  <span style={{ color: GREEN, fontWeight: 600 }}>{email}</span>.{' '}
                  Enter it below to continue.
                </p>

                {error && (
                  <div style={{ background: 'rgba(200,32,42,0.1)', border: '1px solid rgba(200,32,42,0.3)', borderRadius: 8, padding: '12px 16px', marginBottom: 16, fontFamily: M, fontSize: 14, color: '#FCA5A5' }}>
                    {error}
                  </div>
                )}

                {resent && (
                  <div style={{ background: 'rgba(34,197,94,0.1)', border: `1px solid ${GREEN}40`, borderRadius: 8, padding: '12px 16px', marginBottom: 16, fontFamily: M, fontSize: 14, color: GREEN, textAlign: 'center' }}>
                    ✓ New OTP sent to your email!
                  </div>
                )}

                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontFamily: M, fontSize: 14, fontWeight: 600, color: '#F5F5F5', display: 'block', marginBottom: 8 }}>
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    placeholder="Enter the 6-digit code"
                    value={otp}
                    onChange={e => { setOtp(e.target.value.replace(/\D/g, '').slice(0, 6)); setError('') }}
                    onKeyDown={e => e.key === 'Enter' && handleVerifyOtp()}
                    maxLength={6}
                    style={{
                      ...inp,
                      fontSize: 28,
                      letterSpacing: 12,
                      textAlign: 'center',
                      fontFamily: B,
                      paddingLeft: 14,
                      color: GOLD,
                      borderColor: otp.length === 6 ? `${GOLD}80` : 'rgba(255,255,255,0.12)',
                    }}
                    onFocus={e => e.target.style.borderColor = GOLD}
                    onBlur={e  => e.target.style.borderColor = otp.length === 6 ? `${GOLD}80` : 'rgba(255,255,255,0.12)'}
                  />
                  <div style={{ fontFamily: M, fontSize: 13, color: 'rgba(255,255,255,0.35)', marginTop: 6, textAlign: 'center' }}>
                    OTP expires in 10 minutes
                  </div>
                </div>

                <button onClick={handleVerifyOtp} disabled={loading || otp.length < 4} style={{
                  width: '100%', padding: '14px',
                  background: loading || otp.length < 6 ? 'rgba(200,32,42,0.4)' : RED,
                  border: 'none', borderRadius: 8, color: '#F5F5F5', fontFamily: B,
                  fontSize: 22, letterSpacing: 2, cursor: loading || otp.length < 6 ? 'not-allowed' : 'pointer',
                  marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                  boxShadow: '0 8px 24px rgba(200,32,42,0.3)', transition: 'all 0.2s',
                }}
                  onMouseEnter={e => { if (!loading && otp.length >= 6) e.currentTarget.style.background = '#e02530' }}
                  onMouseLeave={e => { if (!loading && otp.length >= 6) e.currentTarget.style.background = RED }}
                >
                  {loading ? 'Verifying...' : 'Verify OTP →'}
                </button>

                {/* Resend */}
                <button onClick={handleResend} disabled={resentLoading} style={{
                  width: '100%', padding: '13px', background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8,
                  color: resentLoading ? 'rgba(255,255,255,0.3)' : '#A8B0BD',
                  fontFamily: M, fontSize: 15, cursor: resentLoading ? 'not-allowed' : 'pointer',
                  marginBottom: 14, transition: 'all 0.2s',
                }}
                  onMouseEnter={e => { if (!resentLoading) e.currentTarget.style.borderColor = GOLD }}
                  onMouseLeave={e => { if (!resentLoading) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)' }}
                >
                  {resentLoading ? 'Sending...' : '🔄 Resend OTP'}
                </button>

                {/* Change email */}
                <button onClick={() => { setStep('email'); setOtp(''); setError('') }} style={{
                  width: '100%', background: 'none', border: 'none',
                  color: 'rgba(255,255,255,0.35)', fontFamily: M, fontSize: 14,
                  cursor: 'pointer', padding: '8px 0',
                }}
                  onMouseEnter={e => e.currentTarget.style.color = '#F5F5F5'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}
                >
                  ← Use a different email address
                </button>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}