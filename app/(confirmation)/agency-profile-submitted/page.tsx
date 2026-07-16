'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const M = "'Barlow Condensed', sans-serif"
const B = "'Bebas Neue', sans-serif"

export default function AgencyProfileSubmittedPage() {
  const router = useRouter()
  const [show, setShow] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 200)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{
      minHeight: '100vh', background: '#050505',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: M, color: '#F5F5F5', padding: 24,
    }}>
      {/* Ambient glow */}
      <div style={{ position: 'fixed' as const, inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 50% 40% at 50% 40%, rgba(34,197,94,0.06) 0%, transparent 70%)' }} />

      <div style={{
        width: '100%', maxWidth: 560,
        background: '#0B0F14',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 16, padding: '48px 40px',
        opacity: show ? 1 : 0,
        transform: show ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.5s ease',
        position: 'relative' as const, zIndex: 1,
        textAlign: 'center' as const,
      }}>

        {/* Icon */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'rgba(34,197,94,0.12)',
            border: '2px solid rgba(34,197,94,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 32px rgba(34,197,94,0.15)',
          }}>
            {/* Shield check icon */}
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M16 3L5 7.5v8c0 6.5 4.7 12.6 11 14 6.3-1.4 11-7.5 11-14v-8L16 3z" stroke="#22c55e" strokeWidth="2" strokeLinejoin="round" />
              <path d="M11 16l3.5 3.5 6.5-6.5" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 style={{ fontFamily: B, fontSize: 28, letterSpacing: 3, color: '#F5F5F5', margin: '0 0 12px' }}>
          AGENCY REQUEST RECEIVED
        </h1>
        <p style={{ fontFamily: M, fontSize: 14, color: '#6A7080', lineHeight: 1.7, margin: '0 0 32px', maxWidth: 380, marginLeft: 'auto', marginRight: 'auto' }}>
          Corporate identification assets and agency details have been locked into the verification pipeline registry.
        </p>

        {/* Status card */}
        <div style={{
          background: '#121821',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 10, padding: '20px 24px',
          marginBottom: 32, textAlign: 'left' as const,
        }}>
          {/* Header row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, paddingBottom: 14, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ fontFamily: M, fontSize: 14, fontWeight: 700, color: '#A8B0BD', letterSpacing: 1.5, textTransform: 'uppercase' as const }}>Verification Processing Window:</span>
            <span style={{ fontFamily: M, fontSize: 14, fontWeight: 700, color: '#F5F5F5' }}>~ 24 HOURS</span>
          </div>

          {/* Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ fontFamily: M, fontSize: 14, color: '#6A7080' }}>Roster Management Panel:</span>
            <span style={{ fontFamily: M, fontSize: 14, color: '#A8B0BD', fontWeight: 600 }}>Locked (Awaiting Approval)</span>
          </div>

          {/* Info note */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8 }}>
            <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1, color: '#6A7080' }}>ⓘ</span>
            <span style={{ fontFamily: M, fontSize: 14, color: '#6A7080', lineHeight: 1.6 }}>
              An operational status onboarding notification will be transmitted to officer address once verified.
            </span>
          </div>
        </div>

        {/* CTA button */}
        <button
          onClick={() => router.push('/dashboard')}
          style={{
            width: '100%', padding: '14px',
            background: '#1a1f2a',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 10, cursor: 'pointer',
            fontFamily: B, fontSize: 18, letterSpacing: 3,
            color: '#F5F5F5', transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#222936'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)' }}
          onMouseLeave={e => { e.currentTarget.style.background = '#1a1f2a'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
        >
          EXIT TO SYSTEM DASHBOARD
        </button>
      </div>
    </div>
  )
}