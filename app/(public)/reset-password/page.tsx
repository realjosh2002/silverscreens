'use client'

import { useState } from 'react'
import Link from 'next/link'

const M = "'Barlow Condensed', sans-serif"
const B = "'Bebas Neue', sans-serif"

// Director's chair with red curtain backdrop — distinct from forgot password pages
const HERO_BG = 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=1400&q=80'

function PasswordStrengthBar({ password }: { password: string }) {
  const getStrength = () => {
    if (!password) return { level: 0, label: '', color: '' }
    let score = 0
    if (password.length >= 8)            score++
    if (password.length >= 12)           score++
    if (/[A-Z]/.test(password))          score++
    if (/[0-9]/.test(password))          score++
    if (/[^A-Za-z0-9]/.test(password))  score++
    if (score <= 1) return { level: 1, label: 'Weak',   color: '#ef4444' }
    if (score <= 3) return { level: 2, label: 'Medium', color: '#f59e0b' }
    return             { level: 3, label: 'Strong',  color: '#22c55e' }
  }
  const { level, label, color } = getStrength()
  if (!password) return null
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
      <span style={{ fontFamily: M, fontSize: 14, color: '#A8B0BD' }}>Password Strength:</span>
      <span style={{ fontFamily: M, fontSize: 14, fontWeight: 700, color }}>{label}</span>
      <div style={{ display: 'flex', gap: 4, flex: 1 }}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{
            flex: 1, height: 4, borderRadius: 2,
            background: i <= level ? color : 'rgba(255,255,255,0.1)',
            transition: 'background 0.3s',
          }} />
        ))}
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  const [password,    setPassword]    = useState('')
  const [confirm,     setConfirm]     = useState('')
  const [showPass,    setShowPass]    = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [success,     setSuccess]     = useState(false)

  const passwordsMatch = password && confirm && password === confirm

  return (
    <div style={{ minHeight: '100vh', background: '#050505', fontFamily: M, display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 520px', minHeight: 'calc(100vh - 72px)' }}>

        {/* ── LEFT — Cinematic BG ── */}
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <img src={HERO_BG} alt="" aria-hidden="true"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(5,5,5,0.85) 0%, rgba(5,5,5,0.6) 60%, rgba(5,5,5,0.25) 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(5,5,5,0.65) 0%, transparent 100%)' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 160, background: 'linear-gradient(to top, #050505, transparent)' }} />

          <div style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '48px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ width: 32, height: 2, background: '#C8202A' }} />
              <span style={{ fontFamily: M, fontSize: 14, letterSpacing: 4, color: '#C8202A', textTransform: 'uppercase' as const, fontWeight: 700 }}>Secure Your Account</span>
            </div>

            <h1 style={{ fontFamily: B, fontSize: 'clamp(44px, 6vw, 72px)', lineHeight: 0.95, letterSpacing: 2, marginBottom: 20 }}>
              <span style={{ color: '#F5F5F5', display: 'block' }}>CREATE NEW</span>
              <span style={{ color: '#C8202A', display: 'block' }}>PASSWORD</span>
            </h1>

            <p style={{ fontFamily: M, fontSize: 14, color: '#A8B0BD', lineHeight: 1.75, maxWidth: 360, marginBottom: 40 }}>
              Choose a strong, unique password to keep your SilverScreens account safe and secure.
            </p>

            {/* Password tips */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {[
                { icon: '✅', title: 'At least 8 characters',     desc: 'Longer passwords are harder to crack'     },
                { icon: '🔠', title: 'Mix of letters & numbers',   desc: 'Use uppercase, lowercase and numbers'     },
                { icon: '💡', title: 'Add a special character',    desc: 'Add !, @, #, $ for extra security'        },
              ].map((t, i, arr) => (
                <div key={t.title} style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0',
                  borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none',
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                    background: 'rgba(200,32,42,0.12)', border: '1px solid rgba(200,32,42,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
                  }}>{t.icon}</div>
                  <div>
                    <div style={{ fontFamily: M, fontSize: 14, fontWeight: 700, color: '#F5F5F5', marginBottom: 2 }}>{t.title}</div>
                    <div style={{ fontFamily: M, fontSize: 14, color: '#A8B0BD' }}>{t.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT — Form ── */}
        <div style={{
          background: '#0B0F14', borderLeft: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: '80px 48px', boxSizing: 'border-box' as const,
        }}>
          <div style={{ maxWidth: 440, width: '100%', margin: '0 auto' }}>

            {!success ? (
              <>
                <div style={{ marginBottom: 32 }}>
                  <h2 style={{ fontFamily: B, fontSize: 36, letterSpacing: 2, color: '#F5F5F5', marginBottom: 8 }}>Create New Password</h2>
                  <div style={{ width: 48, height: 2, background: '#C8202A', marginBottom: 16 }} />
                  <p style={{ fontFamily: M, fontSize: 14, color: '#A8B0BD', lineHeight: 1.7 }}>
                    Your new password must be different from previously used passwords.
                  </p>
                </div>

                {/* New Password */}
                <div style={{ marginBottom: 8 }}>
                  <label style={{ fontFamily: M, fontSize: 14, fontWeight: 600, color: '#F5F5F5', display: 'block', marginBottom: 8 }}>New Password</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 15, opacity: 0.4 }}>🔒</span>
                    <input type={showPass ? 'text' : 'password'} placeholder="Enter new password"
                      value={password} onChange={e => setPassword(e.target.value)}
                      style={{
                        width: '100%', padding: '13px 44px', background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, color: '#F5F5F5',
                        fontFamily: M, fontSize: 14, outline: 'none', boxSizing: 'border-box' as const, transition: 'border-color 0.2s',
                      }}
                      onFocus={e => e.target.style.borderColor = '#C8202A'}
                      onBlur={e  => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
                    <button onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#A8B0BD', fontSize: 16 }}>
                      {showPass ? '🙈' : '👁'}
                    </button>
                  </div>
                  <PasswordStrengthBar password={password} />
                </div>

                {/* Confirm Password */}
                <div style={{ marginBottom: 24, marginTop: 16 }}>
                  <label style={{ fontFamily: M, fontSize: 14, fontWeight: 600, color: '#F5F5F5', display: 'block', marginBottom: 8 }}>Confirm New Password</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 15, opacity: 0.4 }}>🔒</span>
                    <input type={showConfirm ? 'text' : 'password'} placeholder="Confirm new password"
                      value={confirm} onChange={e => setConfirm(e.target.value)}
                      style={{
                        width: '100%', padding: '13px 44px',
                        background: 'rgba(255,255,255,0.04)',
                        border: `1px solid ${confirm && !passwordsMatch ? '#ef4444' : 'rgba(255,255,255,0.12)'}`,
                        borderRadius: 8, color: '#F5F5F5', fontFamily: M, fontSize: 14, outline: 'none',
                        boxSizing: 'border-box' as const, transition: 'border-color 0.2s',
                      }}
                      onFocus={e => e.target.style.borderColor = '#C8202A'}
                      onBlur={e  => e.target.style.borderColor = confirm && !passwordsMatch ? '#ef4444' : 'rgba(255,255,255,0.12)'} />
                    <button onClick={() => setShowConfirm(!showConfirm)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#A8B0BD', fontSize: 16 }}>
                      {showConfirm ? '🙈' : '👁'}
                    </button>
                  </div>
                  {confirm && !passwordsMatch && <div style={{ fontFamily: M, fontSize: 14, color: '#ef4444', marginTop: 6 }}>Passwords do not match</div>}
                  {passwordsMatch && <div style={{ fontFamily: M, fontSize: 14, color: '#22c55e', marginTop: 6 }}>✓ Passwords match</div>}
                </div>

                {/* Reset Password button */}
                <button onClick={() => passwordsMatch && setSuccess(true)} style={{
                  width: '100%', padding: '14px',
                  background: passwordsMatch ? '#C8202A' : 'rgba(200,32,42,0.3)',
                  border: 'none', borderRadius: 8, color: '#F5F5F5',
                  fontFamily: B, fontSize: 22, letterSpacing: 2,
                  cursor: passwordsMatch ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s', marginBottom: 14,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                  boxShadow: passwordsMatch ? '0 8px 24px rgba(200,32,42,0.3)' : 'none',
                }}
                  onMouseEnter={e => { if (passwordsMatch) e.currentTarget.style.background = '#e02530' }}
                  onMouseLeave={e => { if (passwordsMatch) e.currentTarget.style.background = '#C8202A' }}
                >Reset Password →</button>

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
              /* ── Success ── */
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 80, height: 80, borderRadius: '50%', margin: '0 auto 24px', background: '#C8202A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36 }}>✓</div>
                <h2 style={{ fontFamily: B, fontSize: 32, letterSpacing: 2, color: '#F5F5F5', marginBottom: 8 }}>PASSWORD RESET!</h2>
                <div style={{ width: 48, height: 2, background: '#C8202A', margin: '0 auto 16px' }} />
                <p style={{ fontFamily: M, fontSize: 14, color: '#A8B0BD', lineHeight: 1.7, marginBottom: 32 }}>
                  Your password has been successfully reset. You can now log in with your new password.
                </p>
                <Link href="/login" style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  padding: '14px', background: '#C8202A', borderRadius: 8,
                  color: '#F5F5F5', fontFamily: B, fontSize: 20, letterSpacing: 1, textDecoration: 'none',
                  boxShadow: '0 8px 24px rgba(200,32,42,0.3)',
                }}>Go to Login →</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}