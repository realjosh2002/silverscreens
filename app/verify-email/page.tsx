// app/verify-email/page.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const BG     = '#050505'
const BG2    = '#0B0F14'
const BG3    = '#121821'
const RED    = '#C8202A'
const GOLD   = '#D4A64A'
const BEBAS  = "'Bebas Neue', sans-serif"
const BARLOW = "'Barlow Condensed', sans-serif"

function getAuthHeaders(): Record<string, string> {
  try {
    const u = JSON.parse(localStorage.getItem('ss_user') || '{}')
    return u.token ? { Authorization: `Bearer ${u.token}` } : {}
  } catch { return {} }
}

export default function VerifyEmailPage() {
  const router = useRouter()
  const [otp,       setOtp]       = useState(['', '', '', '', '', ''])
  const [loading,   setLoading]   = useState(false)
  const [sending,   setSending]   = useState(false)
  const [error,     setError]     = useState('')
  const [success,   setSuccess]   = useState('')
  const [countdown, setCountdown] = useState(0)
  const [userEmail, setUserEmail] = useState('')
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('ss_user') || '{}')
      if (!u.email) { router.replace('/login'); return }
      if (u.verifiedAt) { router.replace('/dashboard'); return }
      setUserEmail(u.email)
      // Auto-send OTP on page load using email directly
      setTimeout(() => handleSendOtpWithEmail(u.email, true), 100)
    } catch {
      router.replace('/login')
    }
  }, [])

  useEffect(() => {
    if (countdown <= 0) return
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  async function handleSendOtpWithEmail(email: string, silent = false) {
    if (!email) return
    setSending(true)
    if (!silent) setError('')
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (data.success) {
        setCountdown(60)
        if (!silent) setSuccess('A new OTP has been sent to your email.')
      } else {
        if (!silent) setError(data.message || 'Failed to send OTP.')
      }
    } catch {
      if (!silent) setError('Something went wrong. Please try again.')
    } finally {
      setSending(false)
    }
  }

  async function handleSendOtp(silent = false) {
    await handleSendOtpWithEmail(userEmail, silent)
  }

  function handleOtpChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return
    const next = [...otp]
    next[index] = value.slice(-1)
    setOtp(next)
    setError('')
    if (value && index < 5) inputRefs.current[index + 1]?.focus()
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !otp[index] && index > 0) inputRefs.current[index - 1]?.focus()
  }

  function handleOtpPaste(e: React.ClipboardEvent) {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted.length === 6) {
      setOtp(pasted.split(''))
      inputRefs.current[5]?.focus()
    }
  }

  async function handleVerify() {
    const code = otp.join('')
    if (code.length !== 6) { setError('Please enter all 6 digits.'); return }
    setLoading(true)
    setError('')
    try {
      const h = getAuthHeaders()
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...h },
        body: JSON.stringify({ otp: code, email: userEmail }),
      })
      const data = await res.json()
      if (data.success) {
        setSuccess('Email verified! Redirecting...')
        try {
          const u = JSON.parse(localStorage.getItem('ss_user') || '{}')
          localStorage.setItem('ss_user', JSON.stringify({ ...u, verifiedAt: new Date().toISOString() }))
        } catch {}
        setTimeout(() => router.replace('/dashboard'), 1500)
      } else {
        setError(data.message || 'Verification failed. Please try again.')
        setOtp(['', '', '', '', '', ''])
        inputRefs.current[0]?.focus()
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const isComplete = otp.every(d => d !== '')

  const maskedEmail = userEmail
    ? userEmail.replace(/^(.{2})(.+)(@.+)$/, (_, a, b, c) => a + '*'.repeat(b.length) + c)
    : 'your email address'

  return (
    <div style={{ minHeight: '100vh', background: BG, fontFamily: BARLOW, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 16px' }}>

      {/* Logo */}
      <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', marginBottom: 32 }}>
        <span style={{ fontFamily: BEBAS, fontSize: 24, letterSpacing: 2, color: '#F5F5F5' }}>SILVER</span>
        <span style={{ position: 'relative', display: 'inline-flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontFamily: BEBAS, fontSize: 24, letterSpacing: 2, color: RED }}>SCREENS</span>
          <span style={{ display: 'block', height: 2, background: RED, borderRadius: 1 }} />
        </span>
      </Link>

      {/* Card */}
      <div style={{ width: '100%', maxWidth: 440, background: BG2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '40px 36px' }}>

        {/* Icon + heading */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', margin: '0 auto 20px', background: 'rgba(200,32,42,0.10)', border: '2px solid rgba(200,32,42,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>
            ✉️
          </div>
          <h1 style={{ fontFamily: BEBAS, fontSize: 28, letterSpacing: 2, color: '#F5F5F5', marginBottom: 10 }}>
            VERIFY YOUR EMAIL
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
            We sent a 6-digit code to<br />
            <span style={{ color: '#F5F5F5', fontWeight: 700 }}>{maskedEmail}</span>
          </p>
        </div>

        {/* OTP inputs */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 24 }} onPaste={handleOtpPaste}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={el => { inputRefs.current[i] = el }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleOtpChange(i, e.target.value)}
              onKeyDown={e => handleOtpKeyDown(i, e)}
              style={{
                width: 52, height: 60, textAlign: 'center',
                background: digit ? 'rgba(200,32,42,0.08)' : BG3,
                border: `2px solid ${error ? RED : digit ? `${RED}` : 'rgba(255,255,255,0.12)'}`,
                borderRadius: 8, color: '#F5F5F5',
                fontFamily: BEBAS, fontSize: 28, letterSpacing: 1,
                outline: 'none', transition: 'all 0.2s', cursor: 'text',
              }}
              onFocus={e => { e.target.style.borderColor = RED; e.target.style.background = 'rgba(200,32,42,0.08)' }}
              onBlur={e  => { if (!digit) { e.target.style.borderColor = 'rgba(255,255,255,0.12)'; e.target.style.background = BG3 } }}
            />
          ))}
        </div>

        {/* Error */}
        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(200,32,42,0.1)', border: '1px solid rgba(200,32,42,0.25)', borderRadius: 8, marginBottom: 16 }}>
            <span style={{ fontSize: 15 }}>⚠️</span>
            <span style={{ fontSize: 15, color: RED }}>{error}</span>
          </div>
        )}

        {/* Success */}
        {success && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 8, marginBottom: 16 }}>
            <span style={{ fontSize: 15 }}>✓</span>
            <span style={{ fontSize: 15, color: '#22C55E' }}>{success}</span>
          </div>
        )}

        {/* Verify button */}
        <button
          onClick={handleVerify}
          disabled={loading || !isComplete}
          style={{
            width: '100%', padding: '14px',
            background: isComplete && !loading ? RED : 'rgba(200,32,42,0.3)',
            border: 'none', borderRadius: 8,
            color: '#F5F5F5', fontFamily: BEBAS, fontSize: 22, letterSpacing: 2,
            cursor: isComplete && !loading ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s', marginBottom: 16,
            boxShadow: isComplete && !loading ? '0 8px 24px rgba(200,32,42,0.3)' : 'none',
          }}
          onMouseEnter={e => { if (isComplete && !loading) e.currentTarget.style.background = '#e02530' }}
          onMouseLeave={e => { if (isComplete && !loading) e.currentTarget.style.background = RED }}
        >
          {loading ? 'VERIFYING...' : 'VERIFY EMAIL'}
        </button>

        {/* Resend */}
        <div style={{ textAlign: 'center', fontSize: 15, color: 'rgba(255,255,255,0.45)' }}>
          {countdown > 0 ? (
            <>Resend OTP in <span style={{ color: GOLD, fontWeight: 700 }}>{countdown}s</span></>
          ) : (
            <>
              Didn't get the code?{' '}
              <button
                onClick={() => handleSendOtp(false)}
                disabled={sending}
                style={{ background: 'none', border: 'none', padding: 0, fontFamily: BARLOW, fontSize: 15, fontWeight: 700, color: sending ? 'rgba(255,255,255,0.3)' : RED, cursor: sending ? 'default' : 'pointer', textDecoration: 'underline' }}
              >
                {sending ? 'Sending...' : 'Resend OTP'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Footer note */}
      <div style={{ marginTop: 24, fontSize: 15, color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>
        Wrong account?{' '}
        <Link href="/login" style={{ color: GOLD, fontWeight: 700, textDecoration: 'none' }}>Sign in with a different email</Link>
      </div>

      {/* Valid note */}
      <div style={{ marginTop: 12, fontSize: 14, color: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', gap: 6 }}>
        🔒 Your verification code is valid for 10 minutes
      </div>
    </div>
  )
}