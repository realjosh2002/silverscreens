'use client'

import { useEffect, useState } from 'react'
import SilverScreensLogo from '@/components/ui/SilverScreensLogo'

const BG    = '#050505'
const BG2   = '#0B0F14'
const BG3   = '#121821'
const GOLD  = '#D4A64A'
const GOLD2 = '#E5BF63'
const RED   = '#C8202A'
const BEBAS = "'Bebas Neue', sans-serif"
const BARLOW = "'Barlow Condensed', sans-serif"

function AnimatedDot({ delay }: { delay: number }) {
  return (
    <span style={{
      display: 'inline-block',
      width: 6, height: 6,
      borderRadius: '50%',
      background: GOLD,
      margin: '0 4px',
      animation: `pulse 1.4s ease-in-out ${delay}s infinite`,
    }} />
  )
}

function FilmStrip({ top }: { top: boolean }) {
  const holes = Array.from({ length: 20 })
  return (
    <div style={{
      position: 'absolute' as const,
      [top ? 'top' : 'bottom']: 0,
      left: 0, right: 0,
      height: 36,
      background: '#000',
      display: 'flex',
      alignItems: 'center',
      gap: 0,
      overflow: 'hidden',
      zIndex: 2,
    }}>
      {holes.map((_, i) => (
        <div key={i} style={{
          width: 24, height: 18,
          borderRadius: 4,
          background: BG3,
          flexShrink: 0,
          margin: '0 8px',
        }} />
      ))}
    </div>
  )
}

export default function MaintenancePage() {
  const [dots, setDots] = useState(0)
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const d = setInterval(() => setDots(p => (p + 1) % 4), 600)
    const e = setInterval(() => setElapsed(p => p + 1), 1000)
    return () => { clearInterval(d); clearInterval(e) }
  }, [])

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: BG,
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative' as const,
      overflow: 'hidden',
      fontFamily: BARLOW,
      color: '#F5F5F5',
    }}>

      {/* Background radial glow */}
      <div style={{
        position: 'absolute' as const,
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 800, height: 800,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(212,166,74,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Film strip top */}
      <FilmStrip top={true} />

      {/* Film strip bottom */}
      <FilmStrip top={false} />

      {/* Scanlines overlay */}
      <div style={{
        position: 'absolute' as const,
        inset: 0,
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)',
        pointerEvents: 'none',
        zIndex: 1,
      }} />

      {/* Main content */}
      <div style={{
        position: 'relative' as const,
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        padding: '60px 24px',
        maxWidth: 640,
        width: '100%',
        textAlign: 'center' as const,
      }}>

        {/* Logo */}
        <div style={{ marginBottom: 40 }}>
          <SilverScreensLogo size="xl" href="/" showTagline={false} />
          <div style={{
            fontSize: 11,
            letterSpacing: 4,
            color: 'rgba(255,255,255,0.3)',
            marginTop: 8,
            textTransform: 'uppercase' as const,
            fontFamily: BARLOW,
          }}>
            WE MAKE CELEBRITIES
          </div>
        </div>

        {/* Clapperboard icon */}
        <div style={{
          width: 100, height: 100,
          borderRadius: 20,
          background: BG2,
          border: `1px solid rgba(212,166,74,0.2)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 32,
          boxShadow: '0 0 40px rgba(212,166,74,0.08)',
          position: 'relative' as const,
        }}>
          {/* Clapperboard SVG */}
          <svg width={52} height={52} viewBox="0 0 52 52" fill="none">
            <rect x={4} y={16} width={44} height={30} rx={3} fill={BG3} stroke={GOLD} strokeWidth={1.5}/>
            <rect x={4} y={10} width={44} height={10} rx={2} fill={GOLD} opacity={0.9}/>
            {[0,8,16,24,32].map((x, i) => (
              <g key={i}>
                <line x1={x+4} y1={10} x2={x+8} y2={20} stroke={BG} strokeWidth={2}/>
              </g>
            ))}
            <circle cx={26} cy={33} r={6} stroke={GOLD} strokeWidth={1.5} opacity={0.6}/>
            <circle cx={26} cy={33} r={2} fill={GOLD} opacity={0.8}/>
          </svg>
          {/* Pulsing ring */}
          <div style={{
            position: 'absolute' as const,
            inset: -8,
            borderRadius: 28,
            border: `1px solid rgba(212,166,74,0.2)`,
            animation: 'ring-pulse 2s ease-out infinite',
          }} />
        </div>

        {/* Title */}
        <div style={{
          fontFamily: BEBAS,
          fontSize: 48,
          letterSpacing: 3,
          lineHeight: 1,
          marginBottom: 8,
          background: `linear-gradient(135deg, ${GOLD2}, ${GOLD})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          UNDER MAINTENANCE
        </div>

        {/* Animated dots */}
        <div style={{ marginBottom: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <AnimatedDot delay={0} />
          <AnimatedDot delay={0.2} />
          <AnimatedDot delay={0.4} />
        </div>

        {/* Description */}
        <p style={{
          fontSize: 16,
          color: 'rgba(255,255,255,0.55)',
          lineHeight: 1.7,
          marginBottom: 40,
          maxWidth: 480,
        }}>
          We're currently performing scheduled maintenance to bring you an even better experience.
          The platform will be back online shortly.
        </p>

        {/* Status card */}
        <div style={{
          width: '100%',
          background: BG2,
          border: '1px solid rgba(212,166,74,0.15)',
          borderRadius: 14,
          padding: '24px 28px',
          marginBottom: 32,
          boxShadow: '0 0 30px rgba(212,166,74,0.05)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div style={{ fontFamily: BEBAS, fontSize: 16, letterSpacing: 2, color: 'rgba(255,255,255,0.4)' }}>
              SYSTEM STATUS
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '4px 12px',
              background: 'rgba(245,158,11,0.1)',
              border: '1px solid rgba(245,158,11,0.3)',
              borderRadius: 20,
            }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#F59E0B', animation: 'pulse-dot 1.2s ease-in-out infinite' }} />
              <span style={{ fontSize: 13, color: '#F59E0B', fontWeight: 600 }}>Maintenance</span>
            </div>
          </div>

          {[
            { label: 'Platform',        status: 'Maintenance', color: '#F59E0B' },
            { label: 'API Services',    status: 'Operational', color: '#22C55E' },
            { label: 'Database',        status: 'Operational', color: '#22C55E' },
            { label: 'Media Storage',   status: 'Operational', color: '#22C55E' },
          ].map(item => (
            <div key={item.label} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '10px 0',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
            }}>
              <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>{item.label}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: item.color }} />
                <span style={{ fontSize: 13, color: item.color, fontWeight: 600 }}>{item.status}</span>
              </div>
            </div>
          ))}

          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginTop: 16, paddingTop: 16,
            borderTop: '1px solid rgba(212,166,74,0.1)',
          }}>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>Downtime elapsed</span>
            <span style={{ fontFamily: BEBAS, fontSize: 18, letterSpacing: 2, color: GOLD }}>{formatTime(elapsed)}</span>
          </div>
        </div>

        {/* What to do */}
        <div style={{
          width: '100%',
          background: 'rgba(59,130,246,0.06)',
          border: '1px solid rgba(59,130,246,0.2)',
          borderRadius: 10,
          padding: '16px 20px',
          marginBottom: 32,
          display: 'flex',
          alignItems: 'flex-start',
          gap: 12,
          textAlign: 'left' as const,
        }}>
          <svg width={18} height={18} viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
            <circle cx={9} cy={9} r={8} stroke="#3B82F6" strokeWidth={1.5}/>
            <path d="M9 8v5M9 6v.5" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round"/>
          </svg>
          <div>
            <div style={{ fontSize: 14, color: '#93C5FD', fontWeight: 600, marginBottom: 4 }}>What can you do?</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7 }}>
              Please try again in a few minutes. If you have an urgent query, contact us at{' '}
              <a href="mailto:support@silverscreens.com" style={{ color: GOLD, textDecoration: 'none' }}>
                support@silverscreens.com
              </a>
            </div>
          </div>
        </div>

        {/* Try again button */}
        <button
          onClick={() => window.location.reload()}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '13px 32px',
            background: `linear-gradient(135deg, ${GOLD}, #C49535)`,
            border: 'none',
            borderRadius: 10,
            color: '#000',
            fontFamily: BEBAS,
            fontSize: 18,
            letterSpacing: 2,
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(212,166,74,0.25)',
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
        >
          <svg width={16} height={16} viewBox="0 0 16 16" fill="none">
            <path d="M13.5 8A5.5 5.5 0 1 1 8 2.5" stroke="#000" strokeWidth={1.8} strokeLinecap="round"/>
            <path d="M8 2.5h3.5V6" stroke="#000" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Try Again
        </button>

        {/* Footer */}
        <div style={{ marginTop: 48, fontSize: 13, color: 'rgba(255,255,255,0.2)', letterSpacing: 0.5 }}>
          © {new Date().getFullYear()} SilverScreens Media Pvt. Ltd. All rights reserved.
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @keyframes ring-pulse {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.4); opacity: 0; }
        }
      `}</style>
    </div>
  )
}