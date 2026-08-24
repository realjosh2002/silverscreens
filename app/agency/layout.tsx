'use client'

import { AgencyVerificationProvider, useAgencyVerification } from '@/context/AgencyVerificationContext'

const GOLD   = '#D4A64A'
const BARLOW = "'Barlow Condensed', sans-serif"

// ── Inner component reads from context ──────────────────────────
function AgencyLayoutInner({ children }: { children: React.ReactNode }) {
  const { verificationStatus, isApproved, loading } = useAgencyVerification()

  const showBanner = !loading && !isApproved

  return (
    <>
      {showBanner && (
        <div style={{
          position:     'fixed',
          top:          60,
          left:         52,
          right:        0,
          zIndex:       9998,
          display:      'flex',
          alignItems:   'center',
          gap:          12,
          padding:      '9px 20px',
          background:   'rgba(18,10,0,0.97)',
          borderBottom: '1px solid rgba(212,166,74,0.35)',
        }}>
          <span style={{ fontSize: 16 }}>⏳</span>
          <span style={{ fontSize: 14, color: GOLD, fontFamily: BARLOW, fontWeight: 700 }}>
            {verificationStatus === 'rejected'  ? 'Profile Rejected — '
             : verificationStatus === 'suspended' ? 'Account Suspended — '
             : 'Pending Verification — '}
          </span>
          <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', fontFamily: BARLOW }}>
            {verificationStatus === 'rejected'
              ? 'Your profile was rejected. Please contact support.'
              : verificationStatus === 'suspended'
              ? 'Your account has been suspended. Please contact support.'
              : "Your profile is pending verification. You'll get full access once approved by Admin."}
          </span>
          <a
            href="/agency/support"
            style={{ marginLeft: 'auto', fontSize: 13, color: GOLD, fontFamily: BARLOW, fontWeight: 700, textDecoration: 'none', padding: '3px 10px', border: '1px solid rgba(212,166,74,0.4)', borderRadius: 6, flexShrink: 0, whiteSpace: 'nowrap' }}
          >
            Contact Support →
          </a>
        </div>
      )}
      {children}
    </>
  )
}

// ── Exported layout — wraps everything in the provider ──────────
export default function AgencyLayout({ children }: { children: React.ReactNode }) {
  return (
    <AgencyVerificationProvider>
      <AgencyLayoutInner>{children}</AgencyLayoutInner>
    </AgencyVerificationProvider>
  )
}