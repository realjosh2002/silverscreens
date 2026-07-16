'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const M = "'Barlow Condensed', sans-serif"
const B = "'Bebas Neue', sans-serif"
const HERO_BG = 'https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?w=1400&q=80'

const PHONE = '+91 98765 43210'
const OTP_LENGTH = 6
const RESEND_SECONDS = 30

export default function OTPVerificationPage() {
  const [otp,        setOtp]        = useState<string[]>(Array(OTP_LENGTH).fill(''))
  const [timer,      setTimer]      = useState(RESEND_SECONDS)
  const [canResend,  setCanResend]  = useState(false)
  const [verified,   setVerified]   = useState(false)
  const router                      = useRouter()
  const inputRefs                   = useRef<(HTMLInputElement | null)[]>([])

  // Countdown timer
  useEffect(() => {
    if (timer <= 0) { setCanResend(true); return }
    const t = setTimeout(() => setTimer(t => t - 1), 1000)
    return () => clearTimeout(t)
  }, [timer])

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2,'0')}:${String(s % 60).padStart(2,'0')}`

  const handleChange = (val: string, idx: number) => {
    if (!/^\d*$/.test(val)) return
    const newOtp = [...otp]
    newOtp[idx] = val.slice(-1)
    setOtp(newOtp)
    if (val && idx < OTP_LENGTH - 1) inputRefs.current[idx + 1]?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) inputRefs.current[idx - 1]?.focus()
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g,'').slice(0, OTP_LENGTH)
    const newOtp = [...otp]
    pasted.split('').forEach((c, i) => { newOtp[i] = c })
    setOtp(newOtp)
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus()
  }

  const handleResend = () => {
    if (!canResend) return
    setOtp(Array(OTP_LENGTH).fill(''))
    setTimer(RESEND_SECONDS)
    setCanResend(false)
    inputRefs.current[0]?.focus()
  }

  const isComplete = otp.every(d => d !== '')

  return (
    <div style={{ minHeight: '100vh', background: '#050505', fontFamily: M }}>

      {/* ═══ MINIMAL NAVBAR ═══ */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        height: 64, padding: '0 48px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(5,5,5,0.95)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 0 }}>
          <span style={{ fontFamily: B, fontSize: 22, letterSpacing: 2, color: '#F5F5F5' }}>SILVER</span>
          <span style={{ position: 'relative', display: 'inline-flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontFamily: B, fontSize: 22, letterSpacing: 2, color: '#C8202A' }}>SCREENS</span>
            <span style={{ display: 'block', height: 2, background: '#C8202A', borderRadius: 1 }} />
          </span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontFamily: M, fontSize: 14, color: '#A8B0BD' }}>New to SilverScreens?</span>
          <Link href="/signup" style={{
            padding: '8px 20px', border: '1px solid #C8202A',
            borderRadius: 4, color: '#C8202A',
            fontFamily: M, fontSize: 14, fontWeight: 600,
            textDecoration: 'none', transition: 'all 0.2s',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#C8202A'; (e.currentTarget as HTMLElement).style.color = '#F5F5F5' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#C8202A' }}
          >Create an Account</Link>
        </div>
      </nav>

      {/* ═══ MAIN CONTENT ═══ */}
      <div style={{ paddingTop: 64, minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>

        {/* ── LEFT PANEL ── */}
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <img src={HERO_BG} alt="" aria-hidden="true"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(5,5,5,0.88) 0%, rgba(5,5,5,0.65) 60%, rgba(5,5,5,0.3) 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 20% 80%, rgba(200,32,42,0.15) 0%, transparent 60%)' }} />

          <div style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 56px' }}>

            {/* Secure badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 14,
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 10, padding: '12px 16px', marginBottom: 40, alignSelf: 'flex-start',
            }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(200,32,42,0.15)', border: '1px solid rgba(200,32,42,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🛡️</div>
              <div>
                <div style={{ fontFamily: M, fontSize: 14, fontWeight: 700, color: '#F5F5F5' }}>Secure & Trusted</div>
                <div style={{ fontFamily: M, fontSize: 14, color: '#A8B0BD' }}>Your information is protected<br />with industry-standard security.</div>
              </div>
            </div>

            {/* Headline */}
            <h1 style={{ fontFamily: B, fontSize: 'clamp(36px, 5vw, 60px)', lineHeight: 1, letterSpacing: 2, color: '#F5F5F5', marginBottom: 16 }}>
              One Step Closer to<br />Your Dream Break
            </h1>
            <p style={{ fontFamily: M, fontSize: 14, color: '#A8B0BD', lineHeight: 1.75, maxWidth: 380, marginBottom: 40 }}>
              We've sent a 6-digit OTP to your registered mobile number. Please verify to continue.
            </p>

            {/* Feature list */}
            {[
              { icon: '👥', title: 'Access Exclusive Opportunities', desc: 'Get discovered by top casting directors and production houses.' },
              { icon: '🛡️', title: 'Build Your Professional Profile',  desc: 'Showcase your talent, experience and portfolio in one place.'  },
              { icon: '📈', title: 'Track & Grow Your Journey',        desc: 'Stay updated on applications, auditions and career growth.'    },
            ].map((f, i, arr) => (
              <div key={f.title} style={{
                display: 'flex', alignItems: 'flex-start', gap: 14, paddingBottom: 20,
                borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none',
                marginBottom: i < arr.length - 1 ? 20 : 0,
              }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', flexShrink: 0, background: 'rgba(200,32,42,0.12)', border: '1px solid rgba(200,32,42,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{f.icon}</div>
                <div>
                  <div style={{ fontFamily: M, fontSize: 14, fontWeight: 700, color: '#F5F5F5', marginBottom: 4 }}>{f.title}</div>
                  <div style={{ fontFamily: M, fontSize: 14, color: '#A8B0BD', lineHeight: 1.6 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT PANEL — OTP Form ── */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 48px', background: '#050505' }}>
          <div style={{
            width: '100%', maxWidth: 480,
            background: '#0B0F14', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16, padding: '48px 40px',
          }}>

            {!verified ? (
              <>
                {/* Phone icon */}
                <div style={{ textAlign: 'center', marginBottom: 28 }}>
                  <div style={{ width: 72, height: 72, borderRadius: '50%', margin: '0 auto 24px', background: 'rgba(200,32,42,0.10)', border: '2px solid rgba(200,32,42,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30 }}>📱</div>
                  <h2 style={{ fontFamily: B, fontSize: 28, letterSpacing: 2, color: '#F5F5F5', marginBottom: 10 }}>Verify Your Mobile Number</h2>
                  <p style={{ fontFamily: M, fontSize: 14, color: '#A8B0BD', lineHeight: 1.6 }}>
                    Enter the 6-digit verification code we sent to
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 6 }}>
                    <span style={{ fontFamily: M, fontSize: 14, fontWeight: 700, color: '#F5F5F5' }}>{PHONE}</span>
                    <Link href="/login" style={{ fontFamily: M, fontSize: 14, fontWeight: 700, color: '#C8202A', textDecoration: 'none' }}>Edit</Link>
                  </div>
                </div>

                {/* OTP inputs */}
                <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 24 }} onPaste={handlePaste}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={el => { inputRefs.current[i] = el }}
                      type="text" inputMode="numeric" maxLength={1}
                      value={digit}
                      onChange={e => handleChange(e.target.value, i)}
                      onKeyDown={e => handleKeyDown(e, i)}
                      style={{
                        width: 52, height: 60, textAlign: 'center',
                        background: digit ? 'rgba(200,32,42,0.08)' : 'rgba(255,255,255,0.04)',
                        border: `2px solid ${digit ? '#C8202A' : 'rgba(255,255,255,0.12)'}`,
                        borderRadius: 8, color: '#F5F5F5',
                        fontFamily: B, fontSize: 28, letterSpacing: 1,
                        outline: 'none', transition: 'all 0.2s', cursor: 'text',
                      }}
                      onFocus={e => { e.target.style.borderColor = '#C8202A'; e.target.style.background = 'rgba(200,32,42,0.08)' }}
                      onBlur={e  => { if (!digit) { e.target.style.borderColor = 'rgba(255,255,255,0.12)'; e.target.style.background = 'rgba(255,255,255,0.04)' }}}
                    />
                  ))}
                </div>

                {/* Resend */}
                <div style={{ textAlign: 'center', marginBottom: 24, fontFamily: M, fontSize: 14, color: '#A8B0BD' }}>
                  Didn't receive the code?{' '}
                  <button onClick={handleResend} disabled={!canResend} style={{
                    background: 'none', border: 'none', padding: 0,
                    fontFamily: M, fontSize: 14, fontWeight: 700,
                    color: canResend ? '#C8202A' : '#6A7080',
                    cursor: canResend ? 'pointer' : 'default',
                    textDecoration: canResend ? 'underline' : 'none',
                  }}>Resend OTP</button>
                  {!canResend && (
                    <span style={{ color: '#C8202A', fontWeight: 700, marginLeft: 4 }}>in {formatTime(timer)}</span>
                  )}
                </div>

                {/* Verify button */}
                <button
                  onClick={() => {
                    if (isComplete) {
                      // Write session to localStorage so pricing page knows user is logged in
                      try {
                        const existing = JSON.parse(localStorage.getItem('ss_user') || '{}')
                        localStorage.setItem('ss_user', JSON.stringify({
                          ...existing,
                          loggedIn: true,
                          name: existing.name || 'Aspirant',
                          category: existing.category || '',
                          verifiedAt: new Date().toISOString(),
                        }))
                      } catch {}
                      setVerified(true)
                      setTimeout(() => router.push('/create-profile'), 800)
                    }
                  }}
                  style={{
                    width: '100%', padding: '14px',
                    background: isComplete ? '#C8202A' : 'rgba(200,32,42,0.3)',
                    border: 'none', borderRadius: 8,
                    color: '#F5F5F5', fontFamily: B, fontSize: 22, letterSpacing: 2,
                    cursor: isComplete ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s', marginBottom: 16,
                    boxShadow: isComplete ? '0 8px 24px rgba(200,32,42,0.3)' : 'none',
                  }}
                  onMouseEnter={e => { if (isComplete) e.currentTarget.style.background = '#e02530' }}
                  onMouseLeave={e => { if (isComplete) e.currentTarget.style.background = '#C8202A' }}
                >Verify & Continue</button>

                {/* Valid note */}
                <div style={{ textAlign: 'center', fontFamily: M, fontSize: 14, color: '#6A7080', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  🔒 Your verification code is valid for 10 minutes
                </div>
              </>
            ) : (
              /* Success */
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 80, height: 80, borderRadius: '50%', margin: '0 auto 24px', background: '#C8202A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36 }}>✓</div>
                <h2 style={{ fontFamily: B, fontSize: 32, letterSpacing: 2, color: '#F5F5F5', marginBottom: 8 }}>VERIFIED!</h2>
                <div style={{ width: 48, height: 2, background: '#C8202A', margin: '0 auto 16px' }} />
                <p style={{ fontFamily: M, fontSize: 14, color: '#A8B0BD', lineHeight: 1.7, marginBottom: 32 }}>
                  Your mobile number has been verified successfully. Welcome to SilverScreens!
                </p>
                <Link href="/create-profile" style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  padding: '14px', background: '#C8202A', borderRadius: 8,
                  color: '#F5F5F5', fontFamily: B, fontSize: 20, letterSpacing: 1, textDecoration: 'none',
                  boxShadow: '0 8px 24px rgba(200,32,42,0.3)',
                }}>Create Your Profile →</Link>
              </div>
            )}
          </div>

          {/* Need help */}
          <div style={{ marginTop: 24, fontFamily: M, fontSize: 14, color: '#A8B0BD', display: 'flex', alignItems: 'center', gap: 8 }}>
            🎧 Need help?{' '}
            <Link href="/contact" style={{ color: '#C8202A', fontWeight: 700, textDecoration: 'none' }}>Contact Support</Link>
          </div>
        </div>
      </div>
    </div>
  )
}