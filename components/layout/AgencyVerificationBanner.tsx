'use client'

import { useState, useEffect } from 'react'

const GOLD   = '#D4A64A'
const BARLOW = "'Barlow Condensed', sans-serif"

function getAuthHeaders(): Record<string, string> {
  try {
    const u = JSON.parse(localStorage.getItem('ss_user') || '{}')
    return u.token ? { Authorization: `Bearer ${u.token}` } : {}
  } catch { return {} }
}

export default function AgencyVerificationBanner() {
  const [status, setStatus] = useState<string | null>(null)

  useEffect(() => {
    // Check localStorage first for instant render
    try {
      const u = JSON.parse(localStorage.getItem('ss_user') || '{}')
      const s = u.verificationStatus ?? u.verification_status
      if (s) { setStatus(s); return }
    } catch {}

    // Fall back to API
    const h = getAuthHeaders()
    fetch('/api/profile/agency', { headers: h })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return
        const p = data.data?.profile ?? data.profile ?? data
        const s = p.verification_status ?? p.verificationStatus ?? 'pending'
        setStatus(s)
      }).catch(() => {})
  }, [])

  const isApproved = status === 'approved' || status === 'active'
  if (isApproved || status === null) return null

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '11px 20px', margin: '0 0 0 0',
      background: 'rgba(212,166,74,0.08)',
      border: '1px solid rgba(212,166,74,0.25)',
      borderRadius: 0, flexShrink: 0,
    }}>
      <span style={{ fontSize: 18, flexShrink: 0 }}>⏳</span>
      <div style={{ flex: 1 }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: GOLD, fontFamily: BARLOW }}>
          {status === 'rejected' ? 'Profile Rejected — ' : 'Pending Verification — '}
        </span>
        <span style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', fontFamily: BARLOW }}>
          {status === 'rejected'
            ? 'Your profile was rejected. Please contact support for assistance.'
            : 'Your profile is pending verification. You\'ll get full access once approved by Admin.'}
        </span>
      </div>
      <a href="/agency/support" style={{ fontSize: 14, color: GOLD, fontFamily: BARLOW, fontWeight: 700, textDecoration: 'none', flexShrink: 0, padding: '5px 12px', border: '1px solid rgba(212,166,74,0.4)', borderRadius: 6 }}>
        Contact Support →
      </a>
    </div>
  )
}