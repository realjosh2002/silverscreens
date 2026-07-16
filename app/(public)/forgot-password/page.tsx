'use client'

import { useState } from 'react'
import Link from 'next/link'

const M = "'Barlow Condensed', sans-serif"
const B = "'Bebas Neue', sans-serif"

// Director's chair with clapperboard — film set with camera and lights
const HERO_BG_STEP1 = 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=1400&q=80'
// Camera equipment with neon — different cinematic feel for success state
const HERO_BG_STEP2 = 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1400&q=80'

export default function ForgotPasswordPage() {
  const [email, setEmail]         = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [resent,    setResent]    = useState(false)

  return (
    <div style={{ minHeight: '100vh', background: '#050505', fontFamily: M, display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 520px', minHeight: 'calc(100vh - 72px)' }}>

        {/* ── LEFT — Cinematic BG ── */}
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <img
            src={submitted ? HERO_BG_STEP2 : HERO_BG_STEP1}
            alt="" aria-hidden="true"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', transition: 'opacity 0.5s' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(5,5,5,0.85) 0%, rgba(5,5,5,0.6) 60%, rgba(5,5,5,0.25) 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(5,5,5,0.65) 0%, transparent 100%)' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 160, background: 'linear-gradient(to top, #050505, transparent)' }} />

          <div style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '48px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ width: 32, height: 2, background: '#C8202A' }} />
              <span style={{ fontFamily: M, fontSize: 14, letterSpacing: 4, color: '#C8202A', textTransform: 'uppercase' as const, fontWeight: 700 }}>
                {submitted ? 'Check Your Email' : 'Account Recovery'}
              </span>
            </div>

            {!submitted ? (
              <>
                <h1 style={{ fontFamily: B, fontSize: 'clamp(44px, 6vw, 72px)', lineHeight: 0.95, letterSpacing: 2, marginBottom: 20 }}>
                  <span style={{ color: '#F5F5F5', display: 'block' }}>RESET YOUR</span>
                  <span style={{ color: '#C8202A', display: 'block' }}>PASSWORD</span>
                </h1>
                <p style={{ fontFamily: M, fontSize: 14, color: '#A8B0BD', lineHeight: 1.75, maxWidth: 360, marginBottom: 0 }}>
                  No worries! It happens to the best of us. Enter your email and we'll help you get back to your account.
                </p>
              </>
            ) : (
              <>
                <h1 style={{ fontFamily: B, fontSize: 'clamp(44px, 6vw, 72px)', lineHeight: 0.95, letterSpacing: 2, marginBottom: 20 }}>
                  <span style={{ color: '#F5F5F5', display: 'block' }}>YOU'RE ALL SET!</span>
                </h1>
                <p style={{ fontFamily: M, fontSize: 14, color: '#A8B0BD', lineHeight: 1.75, maxWidth: 360 }}>
                  We've sent a reset link to your email address. Follow the link to create a new password and get back to discovering opportunities.
                </p>
              </>
            )}
          </div>
        </div>

        {/* ── RIGHT — Form ── */}
        <div style={{
          background: '#0B0F14', borderLeft: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: '80px 48px', boxSizing: 'border-box' as const,
        }}>
          <div style={{ maxWidth: 440, width: '100%', margin: '0 auto' }}>

            {!submitted ? (
              /* ── Step 1: Email Entry ── */
              <>
                <div style={{ marginBottom: 32 }}>
                  <h2 style={{ fontFamily: B, fontSize: 36, letterSpacing: 2, color: '#F5F5F5', marginBottom: 8 }}>Reset Password</h2>
                  <div style={{ width: 48, height: 2, background: '#C8202A', marginBottom: 16 }} />
                  <p style={{ fontFamily: M, fontSize: 14, color: '#A8B0BD', lineHeight: 1.7 }}>
                    Enter the email address associated with your SilverScreens account and we'll send you a link to reset your password.
                  </p>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontFamily: M, fontSize: 14, fontWeight: 600, color: '#F5F5F5', display: 'block', marginBottom: 8 }}>Email Address</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 15, opacity: 0.4 }}>✉️</span>
                    <input
                      type="email" placeholder="Enter your registered email address"
                      value={email} onChange={e => setEmail(e.target.value)}
                      style={{
                        width: '100%', padding: '13px 14px 13px 44px',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: 8, color: '#F5F5F5',
                        fontFamily: M, fontSize: 14, outline: 'none',
                        boxSizing: 'border-box' as const, transition: 'border-color 0.2s',
                      }}
                      onFocus={e => e.target.style.borderColor = '#C8202A'}
                      onBlur={e  => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
                    />
                  </div>
                </div>

                <button onClick={() => email && setSubmitted(true)} style={{
                  width: '100%', padding: '14px',
                  background: '#C8202A', border: 'none', borderRadius: 8,
                  color: '#F5F5F5', fontFamily: B, fontSize: 22, letterSpacing: 2,
                  cursor: 'pointer', transition: 'all 0.2s', marginBottom: 20,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                  boxShadow: '0 8px 24px rgba(200,32,42,0.3)',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = '#e02530'}
                  onMouseLeave={e => e.currentTarget.style.background = '#C8202A'}
                >Send Reset Link →</button>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                  <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
                  <span style={{ fontFamily: M, fontSize: 14, color: '#6A7080', letterSpacing: 2 }}>OR</span>
                  <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
                </div>

                <Link href="/login" style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  width: '100%', padding: '13px', background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8,
                  color: '#F5F5F5', fontFamily: B, fontSize: 18, letterSpacing: 1, textDecoration: 'none',
                }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = '#C8202A'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)'}
                >← Back to Login</Link>
              </>
            ) : (
              /* ── Step 2: Email Sent Success ── */
              <>
                {/* Green check circle */}
                <div style={{
                  width: 80, height: 80, borderRadius: '50%', margin: '0 auto 24px',
                  border: '2px solid #22c55e', background: 'rgba(34,197,94,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ color: '#22c55e', fontSize: 36, fontWeight: 700 }}>✓</span>
                </div>

                <h2 style={{ fontFamily: B, fontSize: 36, letterSpacing: 2, color: '#F5F5F5', marginBottom: 8, textAlign: 'center' }}>EMAIL SENT!</h2>
                <div style={{ width: 48, height: 2, background: '#22c55e', margin: '0 auto 20px' }} />

                <p style={{ fontFamily: M, fontSize: 14, color: '#A8B0BD', lineHeight: 1.7, textAlign: 'center', marginBottom: 24 }}>
                  If an account exists with the email address{' '}
                  <span style={{ color: '#22c55e', fontWeight: 600 }}>{email}</span>,{' '}
                  you will receive a password reset link shortly.
                </p>

                {/* Info box */}
                <div style={{
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 8, padding: '16px 20px', marginBottom: 20,
                  display: 'flex', alignItems: 'flex-start', gap: 14,
                }}>
                  <span style={{ fontSize: 20, flexShrink: 0 }}>✉️</span>
                  <div>
                    <div style={{ fontFamily: M, fontSize: 14, fontWeight: 700, color: '#F5F5F5', marginBottom: 4 }}>Didn't receive the email?</div>
                    <div style={{ fontFamily: M, fontSize: 14, color: '#A8B0BD', lineHeight: 1.6 }}>
                      Check your spam or junk folder.<br />
                      Still can't find it? You can resend the link.
                    </div>
                  </div>
                </div>

                {/* Resend button */}
                {resent && (
                  <div style={{
                    fontFamily: M, fontSize: 14, color: '#22c55e', fontWeight: 600,
                    textAlign: 'center', marginBottom: 10,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  }}>✓ Reset link resent successfully!</div>
                )}
                <button onClick={() => setResent(true)} style={{
                  width: '100%', padding: '14px',
                  background: resent ? '#1a1a1a' : '#C8202A',
                  border: `1px solid ${resent ? '#22c55e' : 'transparent'}`,
                  borderRadius: 8, color: resent ? '#22c55e' : '#F5F5F5',
                  fontFamily: B, fontSize: 20, letterSpacing: 2,
                  cursor: 'pointer', transition: 'all 0.2s', marginBottom: 14,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                  boxShadow: resent ? 'none' : '0 8px 24px rgba(200,32,42,0.3)',
                }}
                  onMouseEnter={e => { if (!resent) e.currentTarget.style.background = '#e02530' }}
                  onMouseLeave={e => { if (!resent) e.currentTarget.style.background = '#C8202A' }}
                >{resent ? '✓ Link Sent Again' : 'Resend Reset Link 🔄'}</button>

                {/* Back to Login */}
                <Link href="/login" style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  width: '100%', padding: '13px', background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8,
                  color: '#F5F5F5', fontFamily: B, fontSize: 18, letterSpacing: 1, textDecoration: 'none',
                }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = '#C8202A'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)'}
                >← Back to Login</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}