// app/verify-email/page.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function VerifyEmailPage() {
  const router = useRouter()
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [countdown, setCountdown] = useState(0)
  const [userEmail, setUserEmail] = useState('')
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    // Fetch current verification status
    fetch('/api/auth/verification-status')
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          if (data.data.email_verified) {
            router.replace('/dashboard')
          } else {
            setUserEmail(data.data.email)
            handleSendOtp(true) // auto-send on page load
          }
        } else {
          router.replace('/login')
        }
      })
      .catch(() => router.replace('/login'))
  }, [])

  useEffect(() => {
    if (countdown <= 0) return
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  async function handleSendOtp(silent = false) {
    setSending(true)
    if (!silent) setError('')
    try {
      const res = await fetch('/api/auth/send-otp', { method: 'POST' })
      const data = await res.json()
      if (data.success) {
        setCountdown(60)
        if (!silent) setSuccess('A new OTP has been sent to your email.')
      } else {
        if (!silent) setError(data.message || 'Failed to send OTP')
      }
    } catch {
      if (!silent) setError('Something went wrong. Please try again.')
    } finally {
      setSending(false)
    }
  }

  function handleOtpChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return
    const next = [...otp]
    next[index] = value.slice(-1)
    setOtp(next)
    setError('')
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  function handleOtpPaste(e: React.ClipboardEvent) {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted.length === 6) {
      setOtp(pasted.split(''))
      inputRefs.current[5]?.focus()
    }
  }

  async function handleVerify() {
    const code = otp.join('')
    if (code.length !== 6) {
      setError('Please enter all 6 digits.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ otp: code }),
      })
      const data = await res.json()
      if (data.success) {
        setSuccess('Email verified! Redirecting...')
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

  const maskedEmail = userEmail
    ? userEmail.replace(/^(.{2})(.+)(@.+)$/, (_, a, b, c) => a + '*'.repeat(b.length) + c)
    : 'your email'

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-2xl font-bold text-white tracking-tight">
            Silver<span className="text-yellow-400">Screens</span>
          </span>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-yellow-400/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-white mb-1">Verify your email</h1>
            <p className="text-zinc-400 text-sm">
              We sent a 6-digit code to<br />
              <span className="text-white font-medium">{maskedEmail}</span>
            </p>
          </div>

          {/* OTP inputs */}
          <div className="flex gap-2 justify-center mb-6" onPaste={handleOtpPaste}>
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
                className={`w-12 h-14 text-center text-xl font-bold rounded-xl border bg-zinc-800 text-white
                  focus:outline-none focus:ring-2 transition-all
                  ${error ? 'border-red-500 focus:ring-red-500/30' : 'border-zinc-700 focus:border-yellow-400 focus:ring-yellow-400/20'}`}
              />
            ))}
          </div>

          {/* Error / Success */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 mb-4">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}
          {success && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-3 mb-4">
              <p className="text-green-400 text-sm text-center">{success}</p>
            </div>
          )}

          {/* Verify button */}
          <button
            onClick={handleVerify}
            disabled={loading || otp.join('').length !== 6}
            className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:opacity-40 disabled:cursor-not-allowed
              text-black font-semibold py-3 rounded-xl transition-colors mb-4"
          >
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>

          {/* Resend */}
          <div className="text-center">
            {countdown > 0 ? (
              <p className="text-zinc-500 text-sm">Resend OTP in <span className="text-zinc-300">{countdown}s</span></p>
            ) : (
              <button
                onClick={() => handleSendOtp(false)}
                disabled={sending}
                className="text-yellow-400 hover:text-yellow-300 text-sm font-medium disabled:opacity-50 transition-colors"
              >
                {sending ? 'Sending...' : "Didn't get the code? Resend"}
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-zinc-600 text-xs mt-6">
          Wrong account?{' '}
          <a href="/login" className="text-zinc-400 hover:text-white transition-colors">Sign in with a different email</a>
        </p>
      </div>
    </div>
  )
}