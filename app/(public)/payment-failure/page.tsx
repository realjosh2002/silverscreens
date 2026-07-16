'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import PublicNavbar from '@/components/layout/PublicNavbar'

const M = "'Barlow Condensed', sans-serif"
const B = "'Bebas Neue', sans-serif"

const FAILURE_REASONS = [
  { code: 'INSUFFICIENT_FUNDS',  label: 'Insufficient Funds',       desc: 'Your account does not have enough balance to complete this transaction.' },
  { code: 'CARD_DECLINED',       label: 'Card Declined',            desc: 'Your card was declined by the issuing bank. Please try a different card.' },
  { code: 'NETWORK_ERROR',       label: 'Network Error',            desc: 'A network interruption occurred. Your card has not been charged.' },
  { code: 'TIMEOUT',             label: 'Transaction Timeout',      desc: 'The transaction timed out. Please try again.' },
]

function PaymentFailureInner() {
  const searchParams = useSearchParams()
  const planKey = searchParams.get('plan') || 'pro'
  const amount  = searchParams.get('amount') || '589'
  const reason  = FAILURE_REASONS[Math.floor(Math.random() * FAILURE_REASONS.length)]
  const txnRef  = 'SS' + Date.now().toString().slice(-10).toUpperCase()

  const [pulse, setPulse] = useState(false)
  const [show,  setShow]  = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setPulse(true), 100)
    const t2 = setTimeout(() => setShow(true),  600)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  return (
    <>
      <PublicNavbar />
      <div style={{ background: '#050505', minHeight: '100vh', fontFamily: M, color: '#F5F5F5', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 24px 60px' }}>

        {/* Ambient glow — reddish for failure */}
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 60% 40% at 50% 40%, rgba(200,32,42,0.06) 0%, transparent 70%)' }} />

        <div style={{ maxWidth: 560, width: '100%', position: 'relative' as const, zIndex: 1 }}>

          {/* Failure icon */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
            <div style={{
              width: 100, height: 100, borderRadius: '50%',
              border: `3px solid ${pulse ? '#C8202A' : 'transparent'}`,
              background: 'rgba(200,32,42,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 44,
              transition: 'border-color 0.6s ease, box-shadow 0.6s ease',
              boxShadow: pulse ? '0 0 40px rgba(200,32,42,0.2), 0 0 80px rgba(200,32,42,0.08)' : 'none',
            }}>✕</div>
          </div>

          {/* Title */}
          <div style={{ textAlign: 'center', marginBottom: 32, opacity: show ? 1 : 0, transform: show ? 'translateY(0)' : 'translateY(16px)', transition: 'all 0.5s ease' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 10 }}>
              <div style={{ width: 32, height: 1, background: '#C8202A' }} />
              <span style={{ fontFamily: M, fontSize: 14, letterSpacing: 4, color: '#C8202A', fontWeight: 700, textTransform: 'uppercase' as const }}>Payment Failed</span>
              <div style={{ width: 32, height: 1, background: '#C8202A' }} />
            </div>
            <h1 style={{ fontFamily: B, fontSize: 'clamp(36px,5vw,52px)', letterSpacing: 4, color: '#F5F5F5', margin: '0 0 12px' }}>
              TRANSACTION FAILED
            </h1>
            <p style={{ fontFamily: M, fontSize: 14, color: '#A8B0BD', lineHeight: 1.7 }}>
              {reason.desc} <strong style={{ color: '#F5F5F5' }}>Your account has not been charged.</strong>
            </p>
          </div>

          {/* Error details card */}
          <div style={{
            background: '#0B0F14', border: '1px solid rgba(200,32,42,0.2)',
            borderRadius: 12, padding: 28, marginBottom: 24,
            opacity: show ? 1 : 0, transition: 'opacity 0.6s ease 0.2s',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div>
                <div style={{ fontFamily: B, fontSize: 20, letterSpacing: 2, color: '#F5F5F5' }}>ERROR DETAILS</div>
                <div style={{ fontFamily: M, fontSize: 14, color: '#6A7080', marginTop: 2 }}>Transaction Reference</div>
              </div>
              <div style={{ background: 'rgba(200,32,42,0.1)', border: '1px solid rgba(200,32,42,0.25)', borderRadius: 20, padding: '4px 14px' }}>
                <span style={{ fontFamily: M, fontSize: 14, fontWeight: 700, color: '#C8202A', letterSpacing: 1 }}>✕ FAILED</span>
              </div>
            </div>

            {[
              { label: 'Reason',         value: reason.label },
              { label: 'Attempted Plan', value: (({ pro:'PRO', premium:'PREMIUM', starter:'STARTER', growth:'GROWTH', enterprise:'ENTERPRISE' } as Record<string,string>)[planKey] || 'PRO') + ' Plan' },
              { label: 'Amount',         value: '₹' + Number(amount).toLocaleString() },
              { label: 'Reference ID',   value: txnRef },
              { label: 'Status',         value: 'Not Charged' },
            ].map((row, i) => (
              <div key={row.label} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 0', borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              }}>
                <span style={{ fontFamily: M, fontSize: 14, color: '#6A7080' }}>{row.label}</span>
                <span style={{ fontFamily: M, fontSize: 14, fontWeight: 600, color: row.label === 'Status' ? '#4ADE80' : row.label === 'Reason' ? '#C8202A' : '#F5F5F5' }}>{row.value}</span>
              </div>
            ))}
          </div>

          {/* Troubleshooting tips */}
          <div style={{
            background: 'rgba(200,32,42,0.04)', border: '1px solid rgba(200,32,42,0.12)',
            borderRadius: 12, padding: 22, marginBottom: 28,
            opacity: show ? 1 : 0, transition: 'opacity 0.6s ease 0.35s',
          }}>
            <div style={{ fontFamily: B, fontSize: 16, letterSpacing: 2, color: '#C8202A', marginBottom: 14 }}>TROUBLESHOOTING TIPS</div>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
              {[
                { icon: '💳', text: 'Check that your card details are entered correctly' },
                { icon: '🏦', text: 'Ensure your bank has not blocked online transactions' },
                { icon: '📞', text: 'Contact your bank if the issue persists' },
                { icon: '🔄', text: 'Try using a different payment method (UPI, Net Banking)' },
              ].map(item => (
                <div key={item.text} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <span style={{ fontSize: 15, flexShrink: 0 }}>{item.icon}</span>
                  <span style={{ fontFamily: M, fontSize: 14, color: '#A8B0BD', lineHeight: 1.6 }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12,
            opacity: show ? 1 : 0, transition: 'opacity 0.6s ease 0.5s',
          }}>
            <Link href={`/payment?plan=${planKey}`} style={{ textDecoration: 'none' }}>
              <button style={{
                width: '100%', padding: '14px',
                background: '#D4A64A', border: 'none', borderRadius: 8, cursor: 'pointer',
                fontFamily: B, fontSize: 18, letterSpacing: 2, color: '#050505',
                boxShadow: '0 8px 24px rgba(212,166,74,0.25)', transition: 'all 0.2s',
              }}>🔄 TRY AGAIN</button>
            </Link>
            <Link href="/pricing" style={{ textDecoration: 'none' }}>
              <button style={{
                width: '100%', padding: '14px',
                background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, cursor: 'pointer',
                fontFamily: B, fontSize: 18, letterSpacing: 2, color: '#A8B0BD', transition: 'all 0.2s',
              }}>VIEW PLANS</button>
            </Link>
          </div>

          {/* Support note */}
          <div style={{ textAlign: 'center', marginTop: 24, opacity: show ? 1 : 0, transition: 'opacity 0.6s ease 0.6s' }}>
            <p style={{ fontFamily: M, fontSize: 14, color: '#6A7080' }}>
              Need help? <span style={{ color: '#D4A64A', cursor: 'pointer', textDecoration: 'underline' }}>Contact our support team</span> with reference ID: <strong style={{ color: '#A8B0BD' }}>{txnRef}</strong>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default function PaymentFailurePage() {
  return (
    <Suspense fallback={<div style={{ background: '#050505', minHeight: '100vh' }} />}>
      <PaymentFailureInner />
    </Suspense>
  )
}