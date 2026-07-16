'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const M = "'Barlow Condensed', sans-serif"
const B = "'Bebas Neue', sans-serif"

export default function AspirantProfileSubmittedPage() {
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
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M6 16l7 7 13-13" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 style={{ fontFamily: B, fontSize: 28, letterSpacing: 3, color: '#F5F5F5', margin: '0 0 12px' }}>
          ROSTER FILE SAVED
        </h1>
        <p style={{ fontFamily: M, fontSize: 14, color: '#6A7080', lineHeight: 1.7, margin: '0 0 32px', maxWidth: 380, marginLeft: 'auto', marginRight: 'auto' }}>
          Your professional profile properties have successfully integrated into the database network registry pipelines.
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
            <span style={{ fontFamily: M, fontSize: 14, fontWeight: 700, color: '#A8B0BD', letterSpacing: 1.5, textTransform: 'uppercase' as const }}>Verification Metrics</span>
            <span style={{ fontFamily: M, fontSize: 14, fontWeight: 700, color: '#D4A64A', letterSpacing: 1 }}>PROCESSING</span>
          </div>

          {/* Rows */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontFamily: M, fontSize: 14, color: '#6A7080' }}>Estimated Setup Window:</span>
            <span style={{ fontFamily: M, fontSize: 14, color: '#F5F5F5', fontWeight: 600 }}>~ 24 Hours</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ fontFamily: M, fontSize: 14, color: '#6A7080' }}>Casting Feed Status:</span>
            <span style={{ fontFamily: M, fontSize: 14, color: '#A8B0BD', fontWeight: 600 }}>Hidden (In Review)</span>
          </div>

          {/* Info note */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8 }}>
            <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1, color: '#6A7080' }}>ⓘ</span>
            <span style={{ fontFamily: M, fontSize: 14, color: '#6A7080', lineHeight: 1.6 }}>
              You will receive an automated notification confirmation once approval goes live.
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