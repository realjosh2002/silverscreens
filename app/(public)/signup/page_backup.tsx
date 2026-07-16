'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import SilverScreensLogo from '@/components/ui/SilverScreensLogo'

const steps = [
  { num: 1, label: 'Basic Information' },
  { num: 2, label: 'Verification'      },
  { num: 3, label: 'Complete'          },
]

const features = [
  { icon: '👤', title: 'Create Your Profile',      desc: 'Showcase your talent to the world'              },
  { icon: '🎬', title: 'Apply for Casting Calls',  desc: 'Find roles that match your skills'              },
  { icon: '🔔', title: 'Get Noticed',              desc: 'By casting directors and top companies'         },
  { icon: '📈', title: 'Grow Your Career',         desc: 'Build your portfolio and achieve your dreams'   },
]

export default function SignUpPage() {
  const [step,        setStep]        = useState(1)
  const [userType,    setUserType]    = useState<'talent' | 'company'>('talent')
  const [agreed,      setAgreed]      = useState(false)
  const [showPass,    setShowPass]    = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [otpValues,   setOtpValues]   = useState<string[]>(Array(6).fill(''))
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])
  const [form, setForm] = useState({
    fullName: '', username: '', email: '',
    mobile: '', password: '', confirmPassword: '',
  })

  const inputStyle = (focused = false): React.CSSProperties => ({
    width: '100%', padding: '11px 14px 11px 40px',
    background: 'rgba(255,255,255,0.03)',
    border: `1px solid ${focused ? 'var(--gold)' : 'rgba(212,166,74,0.2)'}`,
    borderRadius: 4, color: '#F5F5F5', fontSize: 14,
    outline: 'none', fontFamily: "'Barlow Condensed', sans-serif",
    transition: 'border-color 0.2s',
  })

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: 14, fontWeight: 600,
    color: '#F5F5F5', letterSpacing: '0.5px', marginBottom: 7,
    fontFamily: "'Barlow Condensed', sans-serif",
  }

  const iconStyle: React.CSSProperties = {
    position: 'absolute', left: 13, top: '50%',
    transform: 'translateY(-50%)', fontSize: 14, opacity: 0.4,
  }

  return (
    <div style={{ minHeight: '100vh', background: '#050505', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>

      {/* ══ LEFT PANEL ══ */}
      <div style={{
        position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(160deg, #0B0F14 0%, #050505 100%)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '100px 60px 60px',
      }}>
        {/* Background glows */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `
            radial-gradient(ellipse 70% 50% at 50% 40%, rgba(212,166,74,0.10) 0%, transparent 60%),
            radial-gradient(ellipse 40% 60% at 80% 70%, rgba(212,166,74,0.05) 0%, transparent 50%)
          `,
        }} />
        {/* Scan line */}
        <div className="scan-line" />
        {/* Film strip */}
        <div className="film-strip left">
          {Array.from({ length: 30 }).map((_, i) => <div key={i} className="film-hole" />)}
        </div>

        {/* Big BG text */}
        <div style={{
          position: 'absolute', bottom: 40, left: 44,
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 'clamp(60px, 10vw, 130px)',
          color: 'transparent',
          WebkitTextStroke: '1px rgba(212,166,74,0.06)',
          letterSpacing: -2, lineHeight: 1,
          userSelect: 'none', pointerEvents: 'none', whiteSpace: 'nowrap',
        }}>SILVERSCREENS</div>

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          {/* Eyebrow */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 36, height: 1, background: 'var(--gold)' }} />
            <span style={{
              fontSize: 14, letterSpacing: 4, color: 'var(--gold)',
              textTransform: 'uppercase', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600,
            }}>Join SilverScreens</span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 'clamp(48px, 6vw, 76px)',
            lineHeight: 0.92, letterSpacing: 1,
            marginBottom: 20,
          }}>
            <span style={{ display: 'block', color: '#F5F5F5' }}>CREATE YOUR</span>
            <span style={{ display: 'block', color: '#F5F5F5' }}>ACCOUNT AND</span>
            <span style={{
              display: 'block',
              background: 'linear-gradient(90deg, #E5BF63, #D4A64A)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>UNLOCK OPPORTUNITIES</span>
          </h1>

          <p style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 14, color: '#A8B0BD', lineHeight: 1.7,
            maxWidth: 360, marginBottom: 40,
          }}>
            Join thousands of talented individuals and top companies building the future of Film &amp; Media.
          </p>

          {/* Feature list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {features.map((f, i) => (
              <div key={f.title} style={{
                display: 'flex', alignItems: 'center', gap: 16,
                padding: '14px 0',
                borderBottom: i < features.length - 1 ? '1px solid rgba(212,166,74,0.1)' : 'none',
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                  background: 'rgba(212,166,74,0.10)',
                  border: '1px solid rgba(212,166,74,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
                }}>{f.icon}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#F5F5F5', fontFamily: "'Barlow Condensed', sans-serif" }}>{f.title}</div>
                  <div style={{ fontSize: 14, color: '#A8B0BD', marginTop: 2, fontFamily: "'Barlow Condensed', sans-serif" }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom trust bar */}
        <div style={{
          position: 'relative', zIndex: 2,
          display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(212,166,74,0.15)',
          borderRadius: 8, overflow: 'hidden', marginTop: 40,
        }}>
          {[
            { icon: '🛡️', num: '100%',    lbl: 'Secure'       },
            { icon: '👥', num: '50,000+', lbl: 'Members'      },
            { icon: '💼', num: '15,000+', lbl: 'Jobs Posted'  },
            { icon: '🎧', num: '24/7',    lbl: 'Support'      },
          ].map((s, i) => (
            <div key={s.lbl} style={{
              textAlign: 'center', padding: '16px 8px',
              borderRight: i < 3 ? '1px solid rgba(212,166,74,0.1)' : 'none',
            }}>
              <div style={{ fontSize: 18, marginBottom: 4 }}>{s.icon}</div>
              <div style={{
                fontFamily: "'Bebas Neue', sans-serif", fontSize: 20,
                background: 'linear-gradient(135deg, #F5F5F5, #D4A64A)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>{s.num}</div>
              <div style={{ fontSize: 14, letterSpacing: 1, color: '#6A7080', textTransform: 'uppercase', fontFamily: "'Barlow Condensed', sans-serif" }}>{s.lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ══ RIGHT PANEL — Form ══ */}
      <div style={{
        background: '#0B0F14',
        borderLeft: '1px solid rgba(212,166,74,0.15)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '100px 60px 60px',
        overflowY: 'auto',
      }}>
        <div style={{ maxWidth: 500, width: '100%', margin: '0 auto' }}>

          {/* Heading */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <h2 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 42, letterSpacing: 3, color: '#F5F5F5', marginBottom: 8,
            }}>SIGN UP</h2>
            <p style={{
              fontSize: 14, color: '#A8B0BD',
              fontFamily: "'Barlow Condensed', sans-serif", fontStyle: 'italic',
            }}>
              Create your account and start your journey with SilverScreens.
            </p>
          </div>

          {/* Step indicator */}
          <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 36 }}>
            {steps.map((s, i) => (
              <div key={s.num} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div style={{
                    position: 'absolute', top: 16, left: '50%', right: '-50%', height: 1,
                    background: step > s.num ? 'var(--gold)' : 'rgba(212,166,74,0.2)',
                    transition: 'background 0.3s',
                  }} />
                )}
                {/* Circle */}
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', zIndex: 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: "'Bebas Neue', sans-serif", fontSize: 15,
                  border: `2px solid ${step >= s.num ? 'var(--gold)' : 'rgba(212,166,74,0.2)'}`,
                  background: step === s.num
                    ? 'linear-gradient(135deg, #E5BF63, #D4A64A)'
                    : step > s.num ? 'rgba(212,166,74,0.2)' : 'transparent',
                  color: step === s.num ? '#050505' : step > s.num ? 'var(--gold)' : '#6A7080',
                  transition: 'all 0.3s',
                }}>
                  {step > s.num ? '✓' : s.num}
                </div>
                {/* Label */}
                <div style={{
                  fontSize: 14, letterSpacing: 0.5, marginTop: 6, textAlign: 'center',
                  color: step >= s.num ? 'var(--gold)' : '#6A7080',
                  fontFamily: "'Barlow Condensed', sans-serif", fontWeight: step === s.num ? 700 : 400,
                  whiteSpace: 'nowrap',
                }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* ── Step 1: Basic Information ── */}
          {step === 1 && (
            <div>
              {/* Full Name + Username */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={labelStyle}>Full Name</label>
                  <div style={{ position: 'relative' }}>
                    <span style={iconStyle}>👤</span>
                    <input
                      type="text" placeholder="Enter your full name"
                      value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })}
                      style={inputStyle()}
                      onFocus={e => e.target.style.borderColor = 'var(--gold)'}
                      onBlur={e  => e.target.style.borderColor = 'rgba(212,166,74,0.2)'}
                    />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Username</label>
                  <div style={{ position: 'relative' }}>
                    <span style={iconStyle}>@</span>
                    <input
                      type="text" placeholder="Choose a username"
                      value={form.username} onChange={e => setForm({ ...form, username: e.target.value })}
                      style={inputStyle()}
                      onFocus={e => e.target.style.borderColor = 'var(--gold)'}
                      onBlur={e  => e.target.style.borderColor = 'rgba(212,166,74,0.2)'}
                    />
                  </div>
                  <div style={{ fontSize: 14, color: '#6A7080', marginTop: 4, fontFamily: "'Barlow Condensed', sans-serif" }}>Username must be unique</div>
                </div>
              </div>

              {/* Email + Mobile */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={labelStyle}>Email Address</label>
                  <div style={{ position: 'relative' }}>
                    <span style={iconStyle}>✉️</span>
                    <input
                      type="email" placeholder="Enter your email address"
                      value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                      style={inputStyle()}
                      onFocus={e => e.target.style.borderColor = 'var(--gold)'}
                      onBlur={e  => e.target.style.borderColor = 'rgba(212,166,74,0.2)'}
                    />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Mobile Number</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {/* Country code */}
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '11px 10px',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(212,166,74,0.2)',
                      borderRadius: 4, flexShrink: 0, cursor: 'pointer',
                    }}>
                      <span style={{ fontSize: 14 }}>🇮🇳</span>
                      <span style={{ fontSize: 14, color: '#F5F5F5', fontFamily: "'Barlow Condensed', sans-serif" }}>+91</span>
                      <span style={{ fontSize: 14, color: '#6A7080' }}>▾</span>
                    </div>
                    <input
                      type="tel" placeholder="Enter mobile number"
                      value={form.mobile} onChange={e => setForm({ ...form, mobile: e.target.value })}
                      style={{ ...inputStyle(), paddingLeft: 14, flex: 1 }}
                      onFocus={e => e.target.style.borderColor = 'var(--gold)'}
                      onBlur={e  => e.target.style.borderColor = 'rgba(212,166,74,0.2)'}
                    />
                  </div>
                </div>
              </div>

              {/* Password + Confirm */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={labelStyle}>Password</label>
                  <div style={{ position: 'relative' }}>
                    <span style={iconStyle}>🔒</span>
                    <input
                      type={showPass ? 'text' : 'password'}
                      placeholder="Create a password"
                      value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                      style={{ ...inputStyle(), paddingRight: 40 }}
                      onFocus={e => e.target.style.borderColor = 'var(--gold)'}
                      onBlur={e  => e.target.style.borderColor = 'rgba(212,166,74,0.2)'}
                    />
                    <button onClick={() => setShowPass(!showPass)} style={{
                      position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer', color: '#6A7080', fontSize: 14,
                    }}>{showPass ? '🙈' : '👁'}</button>
                  </div>
                  <div style={{ fontSize: 14, color: '#6A7080', marginTop: 4, fontFamily: "'Barlow Condensed', sans-serif" }}>Minimum 8 characters with letters and numbers</div>
                </div>
                <div>
                  <label style={labelStyle}>Confirm Password</label>
                  <div style={{ position: 'relative' }}>
                    <span style={iconStyle}>🔒</span>
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                      style={{ ...inputStyle(), paddingRight: 40 }}
                      onFocus={e => e.target.style.borderColor = 'var(--gold)'}
                      onBlur={e  => e.target.style.borderColor = 'rgba(212,166,74,0.2)'}
                    />
                    <button onClick={() => setShowConfirm(!showConfirm)} style={{
                      position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer', color: '#6A7080', fontSize: 14,
                    }}>{showConfirm ? '🙈' : '👁'}</button>
                  </div>
                </div>
              </div>

              {/* I am signing up as */}
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>I am signing up as</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {(['talent', 'company'] as const).map((t) => (
                    <div key={t} onClick={() => setUserType(t)} style={{
                      padding: '14px 16px',
                      background: userType === t ? 'rgba(212,166,74,0.08)' : 'rgba(255,255,255,0.03)',
                      border: `2px solid ${userType === t ? 'var(--gold)' : 'rgba(212,166,74,0.15)'}`,
                      borderRadius: 6, cursor: 'pointer', transition: 'all 0.2s',
                      display: 'flex', alignItems: 'center', gap: 12,
                    }}>
                      {/* Radio */}
                      <div style={{
                        width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                        border: `2px solid ${userType === t ? 'var(--gold)' : '#6A7080'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {userType === t && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--gold)' }} />}
                      </div>
                      <div style={{ fontSize: 18 }}>{t === 'talent' ? '🎭' : '🏢'}</div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#F5F5F5', fontFamily: "'Barlow Condensed', sans-serif" }}>
                          {t === 'talent' ? 'Talent' : 'Company / Recruiter'}
                        </div>
                        <div style={{ fontSize: 14, color: '#A8B0BD', marginTop: 2, fontFamily: "'Barlow Condensed', sans-serif" }}>
                          {t === 'talent' ? 'I want to showcase my talent and find opportunities' : 'I want to hire talent for my projects'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Terms */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                <div onClick={() => setAgreed(!agreed)} style={{
                  width: 18, height: 18, borderRadius: 3, flexShrink: 0, cursor: 'pointer',
                  border: `2px solid ${agreed ? 'var(--gold)' : 'rgba(212,166,74,0.3)'}`,
                  background: agreed ? 'var(--gold)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
                }}>
                  {agreed && <span style={{ color: '#050505', fontSize: 14, fontWeight: 700 }}>✓</span>}
                </div>
                <span style={{ fontSize: 14, color: '#A8B0BD', fontFamily: "'Barlow Condensed', sans-serif" }}>
                  I agree to the{' '}
                  <Link href="/terms"          style={{ color: 'var(--gold)', textDecoration: 'none', fontWeight: 600 }}>Terms &amp; Conditions</Link>
                  {' '}and{' '}
                  <Link href="/privacy-policy" style={{ color: 'var(--gold)', textDecoration: 'none', fontWeight: 600 }}>Privacy Policy</Link>
                </span>
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: 12 }}>
                <Link href="/login" style={{
                  flex: 1, padding: '13px', textAlign: 'center',
                  background: 'transparent',
                  border: '1px solid rgba(212,166,74,0.3)',
                  borderRadius: 4, color: '#A8B0BD', fontSize: 14,
                  fontWeight: 600, letterSpacing: 1, textDecoration: 'none',
                  fontFamily: "'Barlow Condensed', sans-serif",
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s',
                }}>
                  Cancel
                </Link>
                <button
                  onClick={() => setStep(2)}
                  disabled={!agreed}
                  style={{
                    flex: 2, padding: '13px',
                    background: agreed ? 'linear-gradient(135deg, #E5BF63, #D4A64A)' : 'rgba(212,166,74,0.2)',
                    border: 'none', borderRadius: 4, cursor: agreed ? 'pointer' : 'not-allowed',
                    color: agreed ? '#050505' : '#6A7080',
                    fontSize: 14, fontWeight: 700, letterSpacing: 2,
                    textTransform: 'uppercase', fontFamily: "'Barlow Condensed', sans-serif",
                    transition: 'all 0.2s',
                    boxShadow: agreed ? '0 8px 24px rgba(212,166,74,0.25)' : 'none',
                  }}
                  onMouseEnter={e => agreed && (e.currentTarget.style.transform = 'translateY(-1px)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
                >
                  Continue →
                </button>
              </div>

              {/* Already have account */}
              <div style={{ textAlign: 'center', marginTop: 20 }}>
                <span style={{ fontSize: 14, color: '#A8B0BD', fontFamily: "'Barlow Condensed', sans-serif" }}>
                  Already have an account?{' '}
                  <Link href="/login" style={{ color: 'var(--gold)', fontWeight: 600, textDecoration: 'none' }}>Log In</Link>
                </span>
              </div>
            </div>
          )}

          {/* ── Step 2: Verification ── */}
          {step === 2 && (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📧</div>
              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, letterSpacing: 2, color: '#F5F5F5', marginBottom: 12 }}>VERIFY YOUR EMAIL</h3>
              <p style={{ fontSize: 14, color: '#A8B0BD', fontFamily: "'Barlow Condensed', sans-serif", marginBottom: 32 }}>
                We&apos;ve sent a verification code to <strong style={{ color: '#C8202A' }}>{form.email || 'your email'}</strong>
              </p>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 24 }}>
                {otpValues.map((digit, i) => (
                  <input
                    key={i}
                    ref={el => { otpRefs.current[i] = el }}
                    type="text" inputMode="numeric" maxLength={1}
                    value={digit}
                    onChange={e => {
                      const val = e.target.value.replace(/\D/g, '')
                      const newOtp = [...otpValues]
                      newOtp[i] = val.slice(-1)
                      setOtpValues(newOtp)
                      if (val && i < 5) otpRefs.current[i + 1]?.focus()
                    }}
                    onKeyDown={e => {
                      if (e.key === 'Backspace' && !digit && i > 0) otpRefs.current[i - 1]?.focus()
                    }}
                    style={{
                      width: 48, height: 56, textAlign: 'center',
                      background: digit ? 'rgba(200,32,42,0.08)' : 'rgba(255,255,255,0.04)',
                      border: `2px solid ${digit ? '#C8202A' : 'rgba(255,255,255,0.12)'}`,
                      borderRadius: 6, color: '#F5F5F5',
                      fontSize: 24, fontFamily: "'Bebas Neue', sans-serif", outline: 'none',
                      transition: 'all 0.2s',
                    }}
                    onFocus={e => { e.target.style.borderColor = '#C8202A'; e.target.style.background = 'rgba(200,32,42,0.08)' }}
                    onBlur={e  => { if (!digit) { e.target.style.borderColor = 'rgba(255,255,255,0.12)'; e.target.style.background = 'rgba(255,255,255,0.04)' }}}
                  />
                ))}
              </div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 14, color: '#A8B0BD', marginBottom: 24 }}>
                Didn&apos;t receive the code?{' '}
                <button onClick={() => setOtpValues(Array(6).fill(''))} style={{ background: 'none', border: 'none', color: '#C8202A', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 14, fontWeight: 700, cursor: 'pointer', padding: 0 }}>
                  Resend
                </button>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => setStep(1)} style={{
                  flex: 1, padding: '13px', background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.15)', borderRadius: 4,
                  color: '#A8B0BD', fontSize: 18, fontFamily: "'Bebas Neue', sans-serif", cursor: 'pointer',
                }}>BACK</button>
                <button onClick={() => otpValues.every(d => d) && setStep(3)} style={{
                  flex: 2, padding: '13px',
                  background: otpValues.every(d => d) ? '#C8202A' : 'rgba(200,32,42,0.3)',
                  border: 'none', borderRadius: 4,
                  cursor: otpValues.every(d => d) ? 'pointer' : 'not-allowed',
                  color: '#F5F5F5', fontSize: 20, letterSpacing: 2,
                  fontFamily: "'Bebas Neue', sans-serif",
                  boxShadow: otpValues.every(d => d) ? '0 8px 24px rgba(200,32,42,0.3)' : 'none',
                }}>VERIFY →</button>
              </div>
            </div>
          )}



          {/* ── Step 3: Complete ── */}
          {step === 3 && (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{
                width: 80, height: 80, borderRadius: '50%', margin: '0 auto 24px',
                background: 'linear-gradient(135deg, #E5BF63, #D4A64A)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36,
              }}>✓</div>
              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, letterSpacing: 2, color: '#F5F5F5', marginBottom: 12 }}>
                WELCOME TO SILVERSCREENS!
              </h3>
              <p style={{ fontSize: 14, color: '#A8B0BD', fontFamily: "'Barlow Condensed', sans-serif", marginBottom: 32 }}>
                Your account has been created successfully. Your journey starts now.
              </p>
              <Link href="/dashboard" style={{
                display: 'block', padding: '14px',
                background: 'linear-gradient(135deg, #E5BF63, #D4A64A)',
                borderRadius: 4, color: '#050505',
                fontSize: 14, fontWeight: 700, letterSpacing: 2,
                textTransform: 'uppercase', textDecoration: 'none',
                fontFamily: "'Barlow Condensed', sans-serif",
              }}>
                Go to Dashboard →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}