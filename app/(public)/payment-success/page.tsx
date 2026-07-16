'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import PublicNavbar from '@/components/layout/PublicNavbar'

const M = "'Barlow Condensed', sans-serif"
const B = "'Bebas Neue', sans-serif"

const PLAN_NAMES: Record<string, string> = {
  spotlight: 'SPOTLIGHT', star: 'STAR', icon: 'ICON',
  pro: 'PRO', premium: 'PREMIUM',
  starter: 'STARTER', growth: 'GROWTH', enterprise: 'ENTERPRISE',
}

function PaymentSuccessInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const planKey = searchParams.get('plan') || 'pro'
  const amount = searchParams.get('amount') || '589'
  const planName = PLAN_NAMES[planKey] || 'PRO'
  const AGENCY_PLANS = ['starter', 'growth', 'enterprise']
  const isAgency = AGENCY_PLANS.includes(planKey)
  const txnId = 'SS' + Date.now().toString().slice(-10).toUpperCase()
  const date = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  const nextBilling = new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })

  const handleDownloadPDF = () => {
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>SilverScreens Receipt – ${txnId}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; background: #fff; color: #111; padding: 48px; }
    .header { text-align: center; padding-bottom: 24px; border-bottom: 2px solid #C8202A; margin-bottom: 28px; }
    .brand { font-size: 30px; font-weight: 900; letter-spacing: 3px; color: #C8202A; }
    .brand span { color: #111; }
    .subtitle { font-size: 13px; color: #666; margin-top: 4px; letter-spacing: 2px; text-transform: uppercase; }
    .badge { display: inline-block; margin-top: 10px; background: #22C55E; color: #fff; padding: 4px 16px; border-radius: 20px; font-size: 12px; font-weight: 700; letter-spacing: 1px; }
    .section-title { font-size: 13px; font-weight: 700; color: #999; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 14px; }
    .row { display: flex; justify-content: space-between; align-items: center; padding: 11px 0; border-bottom: 1px solid #eee; font-size: 14px; }
    .row:last-child { border-bottom: none; }
    .row .label { color: #666; }
    .row .value { font-weight: 700; color: #111; }
    .row .value.gold { color: #C8202A; font-size: 16px; }
    .total-row { display: flex; justify-content: space-between; align-items: center; padding: 14px 0; border-top: 2px solid #111; margin-top: 4px; }
    .total-label { font-size: 16px; font-weight: 900; letter-spacing: 1px; }
    .total-value { font-size: 22px; font-weight: 900; color: #C8202A; }
    .card { background: #f9f9f9; border: 1px solid #eee; border-radius: 8px; padding: 20px 24px; margin-bottom: 24px; }
    .footer { text-align: center; margin-top: 36px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #999; line-height: 1.8; }
    @media print { body { padding: 32px; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="brand"><span>SILVER</span> SCREENS</div>
    <div class="subtitle">Official Payment Receipt</div>
    <div class="badge">✓ &nbsp;PAYMENT CONFIRMED</div>
  </div>

  <div class="card">
    <div class="section-title">Subscription Details</div>
    <div class="row"><span class="label">Plan</span><span class="value">${planName} Plan</span></div>
    <div class="row"><span class="label">Account Type</span><span class="value">${isAgency ? 'Agency' : 'Aspirant'}</span></div>
    <div class="row"><span class="label">Date</span><span class="value">${date}</span></div>
    <div class="row"><span class="label">Next Billing Date</span><span class="value">${nextBilling}</span></div>
  </div>

  <div class="card">
    <div class="section-title">Payment Summary</div>
    <div class="row"><span class="label">Transaction ID</span><span class="value">${txnId}</span></div>
    <div class="row"><span class="label">Payment Method</span><span class="value">Online Payment</span></div>
    <div class="row"><span class="label">Status</span><span class="value" style="color:#22C55E">Successful</span></div>
    <div class="total-row">
      <span class="total-label">TOTAL PAID</span>
      <span class="total-value">₹${Number(amount).toLocaleString('en-IN')}</span>
    </div>
  </div>

  <div class="footer">
    <p><strong>SilverScreens</strong> — India's Premier Talent Marketplace</p>
    <p>For support: support@silverscreens.com &nbsp;|&nbsp; www.silverscreens.com</p>
    <p style="margin-top:8px; color:#bbb;">This is a computer-generated receipt and does not require a signature.</p>
  </div>
</body>
</html>`
    const blob = new Blob([html], { type: 'text/html' })
    const url  = URL.createObjectURL(blob)
    const win  = window.open(url, '_blank')
    if (win) {
      win.addEventListener('load', () => {
        setTimeout(() => { win.print(); URL.revokeObjectURL(url) }, 400)
      })
    }
  }

  const [ring, setRing] = useState(false)
  const [show, setShow] = useState(false)
  const [countdown, setCountdown] = useState(3)

  useEffect(() => {
    const t1 = setTimeout(() => setRing(true), 100)
    const t2 = setTimeout(() => setShow(true), 600)
    // Write plan to localStorage so session is complete
    try {
      const existing = JSON.parse(localStorage.getItem('ss_user') || '{}')
      localStorage.setItem('ss_user', JSON.stringify({
        ...existing,
        loggedIn: true,
        subscribed: true,
        plan: planKey,
        planAmount: amount,
        planActivatedAt: new Date().toISOString(),
      }))
    } catch {}

    // Auto-redirect to profile-submitted after 3 seconds
    const redirectTo = isAgency ? '/agency-profile-submitted' : '/profile-submitted'
    const c1 = setTimeout(() => setCountdown(2), 1000)
    const c2 = setTimeout(() => setCountdown(1), 2000)
    const c3 = setTimeout(() => { window.location.replace(redirectTo) }, 3000)

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(c1); clearTimeout(c2); clearTimeout(c3) }
  }, [])

  return (
    <>
      <PublicNavbar />
      <div style={{ background: '#050505', minHeight: '100vh', fontFamily: M, color: '#F5F5F5', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 24px 60px' }}>

        {/* Ambient glow */}
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 60% 40% at 50% 40%, rgba(212,166,74,0.07) 0%, transparent 70%)' }} />

        <div style={{ maxWidth: 500, width: '100%', position: 'relative' as const, zIndex: 1, textAlign: 'center' as const }}>

          {/* Success icon */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
            <div style={{
              width: 96, height: 96, borderRadius: '50%',
              border: `3px solid ${ring ? '#D4A64A' : 'transparent'}`,
              background: 'rgba(212,166,74,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 42,
              transition: 'border-color 0.6s ease, box-shadow 0.6s ease',
              boxShadow: ring ? '0 0 40px rgba(212,166,74,0.25), 0 0 80px rgba(212,166,74,0.1)' : 'none',
            }}>✓</div>
          </div>

          {/* Title */}
          <div style={{ opacity: show ? 1 : 0, transform: show ? 'translateY(0)' : 'translateY(16px)', transition: 'all 0.5s ease' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 10 }}>
              <div style={{ width: 32, height: 1, background: '#D4A64A' }} />
              <span style={{ fontFamily: M, fontSize: 14, letterSpacing: 4, color: '#D4A64A', fontWeight: 700, textTransform: 'uppercase' as const }}>Payment Confirmed</span>
              <div style={{ width: 32, height: 1, background: '#D4A64A' }} />
            </div>
            <h1 style={{ fontFamily: B, fontSize: 'clamp(32px,5vw,48px)', letterSpacing: 4, color: '#F5F5F5', margin: '0 0 12px' }}>
              PAYMENT SUCCESSFUL
            </h1>
            <p style={{ fontFamily: M, fontSize: 15, color: '#A8B0BD', lineHeight: 1.7, marginBottom: 28 }}>
              Your <strong style={{ color: '#D4A64A' }}>{planName} Plan</strong> has been activated successfully.
            </p>

            {/* Receipt summary */}
            <div style={{ background: '#0B0F14', border: '1px solid rgba(212,166,74,0.2)', borderRadius: 12, padding: '20px 24px', marginBottom: 28, textAlign: 'left' as const }}>
              {[
                { label: 'Plan',           value: planName + ' Plan' },
                { label: 'Amount Paid',    value: '₹' + Number(amount).toLocaleString() },
                { label: 'Date',           value: date },
                { label: 'Transaction ID', value: txnId },
              ].map((row, i) => (
                <div key={row.label} style={{
                  display: 'flex', justifyContent: 'space-between',
                  padding: '9px 0',
                  borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                }}>
                  <span style={{ fontFamily: M, fontSize: 14, color: '#6A7080' }}>{row.label}</span>
                  <span style={{ fontFamily: M, fontSize: 14, fontWeight: 600, color: row.label === 'Amount Paid' ? '#D4A64A' : '#F5F5F5' }}>{row.value}</span>
                </div>
              ))}
            </div>

            {/* Countdown redirect */}
            <div style={{ background: 'rgba(212,166,74,0.05)', border: '1px solid rgba(212,166,74,0.15)', borderRadius: 10, padding: '16px 20px', marginBottom: 20 }}>
              <div style={{ fontFamily: M, fontSize: 14, color: '#A8B0BD', marginBottom: 4 }}>
                Taking you to your next step in
              </div>
              <div style={{ fontFamily: B, fontSize: 36, color: '#D4A64A', letterSpacing: 2 }}>{countdown}</div>
            </div>

            {/* Manual redirect button */}
            <button onClick={() => window.location.replace(isAgency ? '/agency-profile-submitted' : '/profile-submitted')}
              style={{ width: '100%', padding: '13px', background: '#D4A64A', border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: B, fontSize: 18, letterSpacing: 2, color: '#050505', boxShadow: '0 8px 24px rgba(212,166,74,0.25)' }}>
              CONTINUE NOW →
            </button>

            <div style={{ marginTop: 12, fontFamily: M, fontSize: 13, color: '#6A7080' }}>
              Or wait {countdown} second{countdown !== 1 ? 's' : ''} to be redirected automatically
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div style={{ background: '#050505', minHeight: '100vh' }} />}>
      <PaymentSuccessInner />
    </Suspense>
  )
}