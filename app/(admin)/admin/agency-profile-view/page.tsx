'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import AdminSidebar from '@/components/layout/AdminSidebar'
import AdminTopnav from '@/components/layout/AdminTopnav'
import {
  ArrowLeft, Building2, MapPin, Globe, CheckCircle, XCircle,
  Clock, AlertTriangle, Shield, Star, FileText, Image, Users,
  Briefcase, TrendingUp, Eye, Flag, Ban, Download, ExternalLink,
  ChevronRight, CreditCard, Activity, UserCheck, Megaphone,
  Copy, Check,
} from 'lucide-react'

const BG    = '#050505'
const BG2   = '#0B0F14'
const BG3   = '#121821'
const GOLD  = '#D4A64A'
const RED   = '#C8202A'
const GREEN = '#22C55E'
const BLUE  = '#3B82F6'
const AMBER = '#F59E0B'
const BEBAS = "'Bebas Neue', sans-serif"
const BARLOW= "'Barlow Condensed', sans-serif"
const INTER = "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
const MONO  = "'Courier New', monospace"

function getToken(): string {
  try {
    const raw = Object.keys(localStorage).find(k => k.startsWith('sb-') && k.endsWith('-auth-token'))
    if (raw) return JSON.parse(localStorage.getItem(raw) || '{}')?.access_token || ''
  } catch {}
  return ''
}

function fmtDate(val: string | null | undefined): string {
  if (!val) return '—'
  try { return new Date(val).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) }
  catch { return val }
}
function fmtNum(n: number | null | undefined): string {
  if (n == null) return '0'
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K'
  return String(n)
}

const VSTATUS: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  approved:       { label: 'Verified',          color: GREEN, bg: 'rgba(34,197,94,0.12)',   icon: <CheckCircle size={13} /> },
  pending:        { label: 'Pending Review',    color: AMBER, bg: 'rgba(245,158,11,0.12)',  icon: <Clock size={13} /> },
  rejected:       { label: 'Rejected',          color: RED,   bg: 'rgba(200,32,42,0.12)',   icon: <XCircle size={13} /> },
  suspended:      { label: 'Suspended',         color: RED,   bg: 'rgba(200,32,42,0.12)',   icon: <Ban size={13} /> },
  info_requested: { label: 'Info Requested',    color: BLUE,  bg: 'rgba(59,130,246,0.12)', icon: <AlertTriangle size={13} /> },
}
const ASTATUS: Record<string, { label: string; color: string; bg: string }> = {
  active:    { label: 'Active',    color: GREEN, bg: 'rgba(34,197,94,0.12)'  },
  inactive:  { label: 'Inactive',  color: AMBER, bg: 'rgba(245,158,11,0.12)' },
  suspended: { label: 'Suspended', color: RED,   bg: 'rgba(200,32,42,0.12)'  },
}

interface Agency {
  id: string; profile_number: string; company_name: string; company_type: string
  registration_number: string | null; gst_number: string | null; pan_number: string | null
  website_url: string | null; description: string | null; established_year: number | null
  employee_count: string | null; logo_url: string | null; banner_url: string | null
  email: string; phone: string | null; address_line1: string | null; address_line2: string | null
  city: string | null; state: string | null; country: string | null; pincode: string | null
  verification_status: string; account_status: string; subscription_plan: string | null
  subscription_expires: string | null; trust_score: number; total_castings: number
  active_castings: number; total_applications: number; shortlisted_count: number
  hired_count: number; profile_views: number; followers_count: number; reports_count: number
  created_at: string; last_login: string | null; verified_at: string | null
  verified_by: string | null; rejection_reason: string | null
  social_instagram: string | null; social_facebook: string | null
  social_youtube: string | null; social_linkedin: string | null
  documents: { id: string; name: string; type: string; url: string; uploaded_at: string }[]
  gallery: { id: string; url: string; caption: string | null }[]
  casting_calls: { id: string; title: string; status: string; applications: number; created_at: string }[]
  activity_log: { id: string; action: string; details: string; created_at: string }[]
}

function StatCard({ icon, label, value, color = GOLD }: { icon: React.ReactNode; label: string; value: string | number; color?: string }) {
  return (
    <div style={{ background: BG3, border: '1px solid rgba(212,166,74,0.1)', borderRadius: 10, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color }}>{icon}</div>
      <div>
        <div style={{ fontSize: 22, fontFamily: BEBAS, letterSpacing: 1, color: '#F5F5F5', lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontFamily: INTER, marginTop: 2 }}>{label}</div>
      </div>
    </div>
  )
}

function InfoRow({ label, value, mono = false, copyable = false }: { label: string; value: string | null | undefined; mono?: boolean; copyable?: boolean }) {
  const [copied, setCopied] = useState(false)
  if (!value) return null
  const copy = () => { navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 1500) }
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', fontFamily: INTER, minWidth: 140 }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 14, color: '#F5F5F5', fontFamily: INTER, fontWeight: 500, letterSpacing: mono ? 0.5 : 0 }}>{value}</span>
        {copyable && <button onClick={copy} style={{ background: 'none', border: 'none', cursor: 'pointer', color: copied ? GREEN : 'rgba(255,255,255,0.3)', padding: 2 }}>{copied ? <Check size={12} /> : <Copy size={12} />}</button>}
      </div>
    </div>
  )
}

function SectionHead({ title, icon }: { title: string; icon?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
      {icon && <div style={{ color: GOLD }}>{icon}</div>}
      <div style={{ fontFamily: BEBAS, fontSize: 16, letterSpacing: 2, color: '#F5F5F5' }}>{title}</div>
      <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, rgba(212,166,74,0.25), transparent)', marginLeft: 8 }} />
    </div>
  )
}

function TrustRing({ score }: { score: number }) {
  const pct = Math.min(100, Math.max(0, score))
  const color = pct >= 75 ? GREEN : pct >= 50 ? AMBER : RED
  const r = 28, circ = 2 * Math.PI * r, dash = (pct / 100) * circ
  return (
    <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 4 }}>
      <svg width={72} height={72} viewBox="0 0 72 72">
        <circle cx={36} cy={36} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={7} />
        <circle cx={36} cy={36} r={r} fill="none" stroke={color} strokeWidth={7} strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={circ / 4} strokeLinecap="round" />
        <text x={36} y={40} textAnchor="middle" fill={color} fontSize={14} fontWeight={700} fontFamily="sans-serif">{pct}</text>
      </svg>
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontFamily: INTER }}>TRUST SCORE</div>
    </div>
  )
}

function ActionBtn({ label, icon, color = GOLD, onClick, disabled = false }: { label: string; icon?: React.ReactNode; color?: string; onClick?: () => void; disabled?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px', background: color + '18', border: `1px solid ${color}40`, borderRadius: 8, color, fontFamily: INTER, fontSize: 13, fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1, whiteSpace: 'nowrap' as const }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.background = color + '28' }}
      onMouseLeave={e => { if (!disabled) e.currentTarget.style.background = color + '18' }}
    >{icon}{label}</button>
  )
}

function Toast({ msg, onDone }: { msg: string; onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t) }, [onDone])
  return <div style={{ position: 'fixed' as const, bottom: 28, right: 28, background: BG3, border: '1px solid rgba(212,166,74,0.3)', borderRadius: 10, padding: '12px 20px', color: '#F5F5F5', fontFamily: BARLOW, fontSize: 15, zIndex: 9999, boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>{msg}</div>
}

function ConfirmModal({ title, message, confirmLabel, confirmColor = RED, onConfirm, onCancel, loading = false }: { title: string; message: string; confirmLabel: string; confirmColor?: string; onConfirm: () => void; onCancel: () => void; loading?: boolean }) {
  return (
    <div style={{ position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, width: '100%', maxWidth: 420, padding: 28 }}>
        <div style={{ fontFamily: BEBAS, fontSize: 22, letterSpacing: 1, marginBottom: 10 }}>{title}</div>
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginBottom: 24, fontFamily: INTER }}>{message}</div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={onCancel} style={{ flex: 1, padding: '10px 0', background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'rgba(255,255,255,0.6)', fontFamily: INTER, fontSize: 14, cursor: 'pointer' }}>Cancel</button>
          <button onClick={onConfirm} disabled={loading} style={{ flex: 1, padding: '10px 0', background: confirmColor + '22', border: `1px solid ${confirmColor}50`, borderRadius: 8, color: confirmColor, fontFamily: BEBAS, fontSize: 18, letterSpacing: 1, cursor: loading ? 'wait' : 'pointer' }}>{loading ? 'Processing…' : confirmLabel}</button>
        </div>
      </div>
    </div>
  )
}

function RejectModal({ onConfirm, onCancel, loading }: { onConfirm: (r: string) => void; onCancel: () => void; loading: boolean }) {
  const [reason, setReason] = useState('')
  return (
    <div style={{ position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: BG2, border: '1px solid rgba(200,32,42,0.25)', borderRadius: 12, width: '100%', maxWidth: 440, padding: 28 }}>
        <div style={{ fontFamily: BEBAS, fontSize: 22, letterSpacing: 1, color: RED, marginBottom: 8 }}>REJECT AGENCY</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 18 }}>Provide a clear reason. This will be sent to the agency via notification and email.</div>
        <textarea value={reason} onChange={e => setReason(e.target.value)} placeholder="e.g. Business registration documents are invalid or expired…" rows={4}
          style={{ width: '100%', background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#F5F5F5', padding: '10px 14px', fontSize: 14, resize: 'vertical' as const, fontFamily: 'inherit', boxSizing: 'border-box' as const }} />
        <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
          <button onClick={onCancel} style={{ flex: 1, padding: '10px 0', background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'rgba(255,255,255,0.6)', fontFamily: BARLOW, fontSize: 15, cursor: 'pointer' }}>Cancel</button>
          <button onClick={() => reason.trim() && onConfirm(reason.trim())} disabled={!reason.trim() || loading}
            style={{ flex: 1, padding: '10px 0', background: 'rgba(200,32,42,0.2)', border: '1px solid rgba(200,32,42,0.4)', borderRadius: 8, color: RED, fontFamily: BEBAS, fontSize: 18, letterSpacing: 1, cursor: !reason.trim() || loading ? 'not-allowed' : 'pointer', opacity: !reason.trim() ? 0.5 : 1 }}>
            {loading ? 'Rejecting…' : 'Reject'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AgencyProfileViewPage() {
  const router      = useRouter()
  const params      = useSearchParams()
  const agencyId    = params.get('id') || ''

  const [agency,        setAgency]        = useState<Agency | null>(null)
  const [loading,       setLoading]       = useState(true)
  const [error,         setError]         = useState('')
  const [toast,         setToast]         = useState('')
  const [activeTab,     setActiveTab]     = useState<'overview' | 'castings' | 'documents' | 'gallery' | 'activity'>('overview')
  const [actionLoading, setActionLoading] = useState(false)
  const [showApprove,   setShowApprove]   = useState(false)
  const [showReject,    setShowReject]    = useState(false)
  const [showSuspend,   setShowSuspend]   = useState(false)
  const [showActivate,  setShowActivate]  = useState(false)
  const [showInfoReq,   setShowInfoReq]   = useState(false)
  const [infoReqNote,   setInfoReqNote]   = useState('')

  const fetchAgency = useCallback(async () => {
    if (!agencyId) { setError('No agency ID provided'); setLoading(false); return }
    setLoading(true); setError('')
    try {
      const token = getToken()
      const res = await fetch(`/api/admin/agencies/${agencyId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to load')
      setAgency(data.data ?? data)
    } catch (e: any) { setError(e.message || 'Failed to load agency profile') }
    finally { setLoading(false) }
  }, [agencyId])

  useEffect(() => { fetchAgency() }, [fetchAgency])

  async function doAction(action: string, body: Record<string, unknown> = {}) {
    setActionLoading(true)
    try {
      const token = getToken()
      const res = await fetch(`/api/admin/agencies/${agencyId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ action, ...body }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Action failed')
      setToast('✓ ' + (data.message || 'Action completed'))
      await fetchAgency()
    } catch (e: any) { setToast('✗ ' + (e.message || 'Failed')) }
    finally { setActionLoading(false) }
  }

  const vs = agency ? (VSTATUS[agency.verification_status] ?? VSTATUS.pending) : null
  const as = agency ? (ASTATUS[agency.account_status] ?? ASTATUS.inactive) : null

  const TABS = [
    { key: 'overview',  label: 'Overview',  icon: <Building2 size={14} /> },
    { key: 'castings',  label: 'Castings',  icon: <Megaphone size={14} /> },
    { key: 'documents', label: 'Documents', icon: <FileText size={14} /> },
    { key: 'gallery',   label: 'Gallery',   icon: <Image size={14} /> },
    { key: 'activity',  label: 'Activity',  icon: <Activity size={14} /> },
  ] as const

  return (
    <div className="agency-profile-view" style={{ display: 'flex', flexDirection: 'column' as const, height: '100vh', overflow: 'hidden', background: BG, fontFamily: INTER, color: '#F5F5F5' }}>
      <AdminTopnav />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <AdminSidebar onCollapse={() => {}} />

        <main style={{ flex: 1, overflowY: 'auto', padding: '28px 32px', scrollbarWidth: 'none' }}>

          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 22, fontSize: 13, color: 'rgba(255,255,255,0.35)', fontFamily: INTER }}>
            <span onClick={() => router.push('/admin/dashboard')} style={{ cursor: 'pointer' }} onMouseEnter={e => (e.currentTarget.style.color = GOLD)} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}>Dashboard</span>
            <ChevronRight size={12} />
            <span onClick={() => router.push('/admin/agency-verification')} style={{ cursor: 'pointer' }} onMouseEnter={e => (e.currentTarget.style.color = GOLD)} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}>Agency Verification</span>
            <ChevronRight size={12} />
            <span style={{ color: 'rgba(255,255,255,0.6)' }}>{agency?.company_name ?? 'Agency Profile'}</span>
          </div>

          {/* Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
            <button onClick={() => router.back()} style={{ width: 36, height: 36, borderRadius: 9, background: BG3, border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', flexShrink: 0 }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = GOLD)} onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}><ArrowLeft size={16} /></button>
            <div>
              <div style={{ fontFamily: BEBAS, fontSize: 28, letterSpacing: 2, lineHeight: 1 }}>AGENCY PROFILE VIEW</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginTop: 3, fontFamily: INTER }}>Full agency profile • Admin review panel</div>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 320 }}>
              <div style={{ textAlign: 'center' as const }}>
                <div style={{ width: 28, height: 28, border: '2px solid rgba(212,166,74,0.2)', borderTop: `2px solid ${GOLD}`, borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
                <div style={{ marginTop: 14, fontSize: 16, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW }}>Loading agency profile…</div>
              </div>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div style={{ background: 'rgba(200,32,42,0.1)', border: '1px solid rgba(200,32,42,0.3)', borderRadius: 12, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <AlertTriangle size={22} color={RED} />
              <div>
                <div style={{ fontWeight: 700, color: RED, marginBottom: 4, fontFamily: BARLOW }}>Failed to load agency</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontFamily: BARLOW }}>{error}</div>
              </div>
              <button onClick={fetchAgency} style={{ marginLeft: 'auto', padding: '8px 16px', background: 'rgba(200,32,42,0.15)', border: '1px solid rgba(200,32,42,0.35)', borderRadius: 8, color: RED, fontSize: 14, cursor: 'pointer' }}>Retry</button>
            </div>
          )}

          {agency && !loading && (
            <>
              {/* HERO */}
              <div style={{ background: BG2, border: '1px solid rgba(212,166,74,0.12)', borderRadius: 14, overflow: 'hidden', marginBottom: 24 }}>
                <div style={{ height: 140, background: agency.banner_url ? `url(${agency.banner_url}) center/cover no-repeat` : 'linear-gradient(135deg,#0B0F14 0%,#1A1A2E 50%,#0D0D1A 100%)', position: 'relative' as const }}>
                  <div style={{ position: 'absolute' as const, inset: 0, background: 'linear-gradient(to bottom,transparent 40%,rgba(11,15,20,0.9) 100%)' }} />
                  {vs && <div style={{ position: 'absolute' as const, top: 14, right: 18, display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', background: vs.bg, border: `1px solid ${vs.color}40`, borderRadius: 20, color: vs.color, fontSize: 13, fontWeight: 600, fontFamily: INTER }}>{vs.icon}{vs.label}</div>}
                </div>
                <div style={{ padding: '0 24px 22px', position: 'relative' as const }}>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20, marginTop: -44 }}>
                    <div style={{ width: 80, height: 80, borderRadius: 14, border: '3px solid ' + BG2, background: agency.logo_url ? `url(${agency.logo_url}) center/cover no-repeat` : 'linear-gradient(135deg,#1a1410,#2a1e0e)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 800, color: GOLD, fontFamily: BEBAS, flexShrink: 0, boxShadow: '0 4px 20px rgba(0,0,0,0.5)', position: 'relative' as const, zIndex: 2 }}>
                      {!agency.logo_url && agency.company_name.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase()}
                    </div>
                    <div style={{ flex: 1, paddingBottom: 4, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' as const }}>
                        <div style={{ fontFamily: BEBAS, fontSize: 26, letterSpacing: 1.5, lineHeight: 1 }}>{agency.company_name}</div>
                        {agency.verification_status === 'approved' && <span style={{ color: GREEN, display: 'inline-flex' }}><Shield size={16} /></span>}
                        {as && <div style={{ padding: '3px 10px', background: as.bg, border: `1px solid ${as.color}40`, borderRadius: 20, fontSize: 12, color: as.color, fontWeight: 600, fontFamily: INTER }}>{as.label}</div>}
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 14, marginTop: 6 }}>
                        {agency.company_type && <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontFamily: INTER }}>{agency.company_type}</span>}
                        {[agency.city, agency.state, agency.country].filter(Boolean).join(', ') && (
                          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', fontFamily: INTER, display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={12} color={GOLD} />{[agency.city, agency.state, agency.country].filter(Boolean).join(', ')}</span>
                        )}
                        {agency.profile_number && <span style={{ fontSize: 13, fontFamily: INTER, fontWeight: 600, color: GOLD }}>{agency.profile_number}</span>}
                      </div>
                    </div>
                    <TrustRing score={agency.trust_score ?? 100} />
                  </div>
                  {agency.description && <div style={{ marginTop: 14, fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, maxWidth: 720, fontFamily: INTER }}>{agency.description}</div>}
                  <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 10, marginTop: 18 }}>
                    {agency.verification_status === 'pending' && <>
                      <ActionBtn label="Approve"      icon={<CheckCircle size={14} />}   color={GREEN} onClick={() => setShowApprove(true)} />
                      <ActionBtn label="Reject"       icon={<XCircle size={14} />}       color={RED}   onClick={() => setShowReject(true)} />
                      <ActionBtn label="Request Info" icon={<AlertTriangle size={14} />} color={AMBER} onClick={() => setShowInfoReq(true)} />
                    </>}
                    {agency.verification_status === 'info_requested' && <>
                      <ActionBtn label="Approve" icon={<CheckCircle size={14} />} color={GREEN} onClick={() => setShowApprove(true)} />
                      <ActionBtn label="Reject"  icon={<XCircle size={14} />}    color={RED}   onClick={() => setShowReject(true)} />
                    </>}
                    {agency.verification_status === 'approved' && agency.account_status !== 'suspended' &&
                      <ActionBtn label="Suspend Account" icon={<Ban size={14} />} color={RED} onClick={() => setShowSuspend(true)} />}
                    {agency.account_status === 'suspended' &&
                      <ActionBtn label="Activate Account" icon={<CheckCircle size={14} />} color={GREEN} onClick={() => setShowActivate(true)} />}
                    {agency.verification_status === 'rejected' &&
                      <ActionBtn label="Re-Approve" icon={<CheckCircle size={14} />} color={GREEN} onClick={() => setShowApprove(true)} />}
                    {agency.website_url && <ActionBtn label="Visit Website" icon={<ExternalLink size={14} />} color={BLUE} onClick={() => window.open(agency.website_url!, '_blank')} />}
                    <ActionBtn label="View Applications" icon={<Briefcase size={14} />} color={GOLD} onClick={() => router.push(`/admin/applications?agency_id=${agencyId}`)} />
                    <ActionBtn label="Flag / Report"  icon={<Flag size={14} />} color={RED} onClick={() => router.push(`/admin/reports?agency_id=${agencyId}`)} />
                  </div>
                </div>
              </div>

              {/* STATS */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 12, marginBottom: 24 }}>
                <StatCard icon={<Megaphone size={18} />} label="Total Castings"   value={fmtNum(agency.total_castings)}    color={GOLD}  />
                <StatCard icon={<Activity  size={18} />} label="Active Castings"  value={fmtNum(agency.active_castings)}   color={GREEN} />
                <StatCard icon={<Users     size={18} />} label="Applications"     value={fmtNum(agency.total_applications)} color={BLUE}  />
                <StatCard icon={<UserCheck size={18} />} label="Shortlisted"      value={fmtNum(agency.shortlisted_count)} color={AMBER} />
                <StatCard icon={<Briefcase size={18} />} label="Hired"            value={fmtNum(agency.hired_count)}       color={GREEN} />
                <StatCard icon={<Eye       size={18} />} label="Profile Views"    value={fmtNum(agency.profile_views)}     color={GOLD}  />
                <StatCard icon={<Star      size={18} />} label="Followers"        value={fmtNum(agency.followers_count)}   color={AMBER} />
                <StatCard icon={<Flag      size={18} />} label="Reports Against"  value={fmtNum(agency.reports_count)}     color={RED}   />
              </div>

              {/* TABS */}
              <div style={{ display: 'flex', gap: 4, marginBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                {TABS.map(t => (
                  <button key={t.key} onClick={() => setActiveTab(t.key)}
                    style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px', background: 'none', border: 'none', borderBottom: activeTab === t.key ? `2px solid ${GOLD}` : '2px solid transparent', color: activeTab === t.key ? GOLD : 'rgba(255,255,255,0.45)', fontFamily: INTER, fontSize: 14, fontWeight: activeTab === t.key ? 600 : 400, cursor: 'pointer', marginBottom: -1 }}>
                    {t.icon}{t.label}
                  </button>
                ))}
              </div>

              {/* TAB: OVERVIEW */}
              {activeTab === 'overview' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <div style={{ background: BG2, border: '1px solid rgba(212,166,74,0.1)', borderRadius: 12, padding: '20px 22px' }}>
                    <SectionHead title="Company Information" icon={<Building2 size={16} />} />
                    <InfoRow label="Company Name"     value={agency.company_name} />
                    <InfoRow label="Company Type"     value={agency.company_type} />
                    <InfoRow label="Established Year" value={agency.established_year?.toString()} />
                    <InfoRow label="Employee Count"   value={agency.employee_count} />
                    <InfoRow label="Profile Number"   value={agency.profile_number}      mono copyable />
                    <InfoRow label="Registration No." value={agency.registration_number} mono copyable />
                    <InfoRow label="GST Number"       value={agency.gst_number}          mono copyable />
                    <InfoRow label="PAN Number"       value={agency.pan_number}          mono copyable />
                    <InfoRow label="Website"          value={agency.website_url} />
                    <InfoRow label="Member Since"     value={fmtDate(agency.created_at)} />
                  </div>
                  <div style={{ background: BG2, border: '1px solid rgba(212,166,74,0.1)', borderRadius: 12, padding: '20px 22px' }}>
                    <SectionHead title="Contact & Location" icon={<MapPin size={16} />} />
                    <InfoRow label="Email"     value={agency.email}         copyable />
                    <InfoRow label="Phone"     value={agency.phone}         copyable />
                    <InfoRow label="Address 1" value={agency.address_line1} />
                    <InfoRow label="Address 2" value={agency.address_line2} />
                    <InfoRow label="City"      value={agency.city} />
                    <InfoRow label="State"     value={agency.state} />
                    <InfoRow label="Country"   value={agency.country} />
                    <InfoRow label="Pincode"   value={agency.pincode} mono />
                    <div style={{ marginTop: 20 }}>
                      <SectionHead title="Social Media" icon={<Globe size={16} />} />
                      <InfoRow label="Instagram" value={agency.social_instagram} />
                      <InfoRow label="Facebook"  value={agency.social_facebook}  />
                      <InfoRow label="YouTube"   value={agency.social_youtube}   />
                      <InfoRow label="LinkedIn"  value={agency.social_linkedin}  />
                    </div>
                  </div>
                  <div style={{ background: BG2, border: '1px solid rgba(212,166,74,0.1)', borderRadius: 12, padding: '20px 22px' }}>
                    <SectionHead title="Verification & Status" icon={<Shield size={16} />} />
                    <InfoRow label="Verification Status" value={vs?.label} />
                    <InfoRow label="Account Status"      value={as?.label} />
                    <InfoRow label="Verified On"         value={fmtDate(agency.verified_at)} />
                    <InfoRow label="Verified By"         value={agency.verified_by} />
                    <InfoRow label="Last Login"          value={fmtDate(agency.last_login)} />
                    {agency.rejection_reason && (
                      <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(200,32,42,0.08)', border: '1px solid rgba(200,32,42,0.2)', borderRadius: 8 }}>
                        <div style={{ fontSize: 12, color: RED, fontWeight: 700, marginBottom: 4 }}>REJECTION REASON</div>
                        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>{agency.rejection_reason}</div>
                      </div>
                    )}
                  </div>
                  <div style={{ background: BG2, border: '1px solid rgba(212,166,74,0.1)', borderRadius: 12, padding: '20px 22px' }}>
                    <SectionHead title="Subscription" icon={<CreditCard size={16} />} />
                    <InfoRow label="Current Plan"    value={agency.subscription_plan ?? 'No Active Plan'} />
                    <InfoRow label="Expires On"      value={fmtDate(agency.subscription_expires)} />
                    <InfoRow label="Account Created" value={fmtDate(agency.created_at)} />
                    <div style={{ marginTop: 18 }}>
                      <button onClick={() => router.push(`/admin/subscriptions?agency_id=${agencyId}`)}
                        style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 14px', background: 'rgba(212,166,74,0.08)', border: '1px solid rgba(212,166,74,0.2)', borderRadius: 8, color: GOLD, fontFamily: BARLOW, fontSize: 14, cursor: 'pointer' }}>
                        <TrendingUp size={13} /> View Subscription History
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: CASTINGS */}
              {activeTab === 'castings' && (
                <div style={{ background: BG2, border: '1px solid rgba(212,166,74,0.1)', borderRadius: 12, overflow: 'hidden' }}>
                  <div style={{ padding: '18px 22px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontFamily: BEBAS, fontSize: 18, letterSpacing: 1.5, display: 'flex', alignItems: 'center', gap: 10 }}><Megaphone size={16} color={GOLD} /> Casting Calls</div>
                    <button onClick={() => router.push(`/admin/applications?agency_id=${agencyId}`)} style={{ padding: '7px 14px', background: 'rgba(212,166,74,0.08)', border: '1px solid rgba(212,166,74,0.2)', borderRadius: 8, color: GOLD, fontFamily: BARLOW, fontSize: 14, cursor: 'pointer' }}>View All Applications</button>
                  </div>
                  {(!agency.casting_calls || agency.casting_calls.length === 0)
                    ? <div style={{ padding: 40, textAlign: 'center' as const, color: 'rgba(255,255,255,0.3)', fontSize: 15 }}>No casting calls posted yet</div>
                    : <table style={{ width: '100%', borderCollapse: 'collapse' as const }}>
                        <thead><tr style={{ background: BG3 }}>
                          {['Title', 'Status', 'Applications', 'Posted On', ''].map(h => (
                            <th key={h} style={{ padding: '10px 18px', textAlign: 'left' as const, fontSize: 12, color: 'rgba(255,255,255,0.35)', fontWeight: 600 }}>{h}</th>
                          ))}
                        </tr></thead>
                        <tbody>{agency.casting_calls.map((c, i) => {
                          const sc = c.status === 'active' ? GREEN : c.status === 'draft' ? AMBER : c.status === 'closed' ? 'rgba(255,255,255,0.3)' : GOLD
                          return (
                            <tr key={c.id} style={{ borderTop: '1px solid rgba(255,255,255,0.04)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                              <td style={{ padding: '12px 18px', fontSize: 14, color: '#F5F5F5', fontWeight: 600 }}>{c.title}</td>
                              <td style={{ padding: '12px 18px' }}><span style={{ fontSize: 12, padding: '3px 10px', background: sc + '18', border: `1px solid ${sc}40`, borderRadius: 20, color: sc, fontWeight: 700 }}>{c.status.toUpperCase()}</span></td>
                              <td style={{ padding: '12px 18px', fontSize: 14, color: GOLD, fontWeight: 700 }}>{c.applications}</td>
                              <td style={{ padding: '12px 18px', fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{fmtDate(c.created_at)}</td>
                              <td style={{ padding: '12px 18px' }}><button onClick={() => router.push(`/admin/applications?casting_id=${c.id}`)} style={{ padding: '5px 12px', background: 'rgba(212,166,74,0.08)', border: '1px solid rgba(212,166,74,0.2)', borderRadius: 6, color: GOLD, fontFamily: BARLOW, fontSize: 13, cursor: 'pointer' }}>View</button></td>
                            </tr>
                          )
                        })}</tbody>
                      </table>}
                </div>
              )}

              {/* TAB: DOCUMENTS */}
              {activeTab === 'documents' && (
                <div style={{ background: BG2, border: '1px solid rgba(212,166,74,0.1)', borderRadius: 12, padding: '20px 22px' }}>
                  <SectionHead title="Verification Documents" icon={<FileText size={16} />} />
                  {(!agency.documents || agency.documents.length === 0)
                    ? <div style={{ padding: '30px 0', textAlign: 'center' as const, color: 'rgba(255,255,255,0.3)', fontSize: 15 }}>No documents uploaded</div>
                    : <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
                        {agency.documents.map(doc => (
                          <div key={doc.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', background: BG3, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10 }}>
                            <div style={{ width: 38, height: 38, borderRadius: 8, background: 'rgba(212,166,74,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: GOLD, flexShrink: 0 }}><FileText size={16} /></div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 14, fontWeight: 600, color: '#F5F5F5' }}>{doc.name}</div>
                              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{doc.type} • Uploaded {fmtDate(doc.uploaded_at)}</div>
                            </div>
                            <button onClick={() => window.open(doc.url, '_blank')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: 8, color: BLUE, fontFamily: BARLOW, fontSize: 13, cursor: 'pointer' }}><Download size={13} /> Download</button>
                          </div>
                        ))}
                      </div>}
                </div>
              )}

              {/* TAB: GALLERY */}
              {activeTab === 'gallery' && (
                <div style={{ background: BG2, border: '1px solid rgba(212,166,74,0.1)', borderRadius: 12, padding: '20px 22px' }}>
                  <SectionHead title="Gallery & Portfolio" icon={<Image size={16} />} />
                  {(!agency.gallery || agency.gallery.length === 0)
                    ? <div style={{ padding: '30px 0', textAlign: 'center' as const, color: 'rgba(255,255,255,0.3)', fontSize: 15 }}>No gallery images uploaded</div>
                    : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 12 }}>
                        {agency.gallery.map(img => (
                          <div key={img.id} onClick={() => window.open(img.url, '_blank')}
                            style={{ aspectRatio: '1/1', background: `url(${img.url}) center/cover no-repeat`, borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', position: 'relative' as const, overflow: 'hidden' }}
                            onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 0 2px ' + GOLD)}
                            onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}>
                            {img.caption && <div style={{ position: 'absolute' as const, bottom: 0, left: 0, right: 0, padding: '8px 10px', background: 'linear-gradient(transparent,rgba(0,0,0,0.75))', fontSize: 12, color: '#fff' }}>{img.caption}</div>}
                          </div>
                        ))}
                      </div>}
                </div>
              )}

              {/* TAB: ACTIVITY */}
              {activeTab === 'activity' && (
                <div style={{ background: BG2, border: '1px solid rgba(212,166,74,0.1)', borderRadius: 12, padding: '20px 22px' }}>
                  <SectionHead title="Recent Activity Log" icon={<Activity size={16} />} />
                  {(!agency.activity_log || agency.activity_log.length === 0)
                    ? <div style={{ padding: '30px 0', textAlign: 'center' as const, color: 'rgba(255,255,255,0.3)', fontSize: 15 }}>No activity recorded</div>
                    : <div style={{ display: 'flex', flexDirection: 'column' as const }}>
                        {agency.activity_log.map((log, i) => (
                          <div key={log.id} style={{ display: 'flex', gap: 16, padding: '12px 0', borderBottom: i < agency.activity_log.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                            <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 4 }}>
                              <div style={{ width: 8, height: 8, borderRadius: '50%', background: GOLD, marginTop: 6 }} />
                              {i < agency.activity_log.length - 1 && <div style={{ width: 1, flex: 1, background: 'rgba(212,166,74,0.15)', minHeight: 20 }} />}
                            </div>
                            <div style={{ flex: 1, paddingBottom: 4 }}>
                              <div style={{ fontSize: 14, fontWeight: 600, color: '#F5F5F5' }}>{log.action}</div>
                              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginTop: 2, lineHeight: 1.5 }}>{log.details}</div>
                              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', marginTop: 4 }}>{fmtDate(log.created_at)}</div>
                            </div>
                          </div>
                        ))}
                      </div>}
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* MODALS */}
      {showApprove && <ConfirmModal title="APPROVE AGENCY" message={`Approving "${agency?.company_name}" will mark them as verified and grant full platform access. The agency will be notified by email.`} confirmLabel="Approve" confirmColor={GREEN} loading={actionLoading} onCancel={() => setShowApprove(false)} onConfirm={async () => { await doAction('approve'); setShowApprove(false) }} />}
      {showReject  && <RejectModal loading={actionLoading} onCancel={() => setShowReject(false)} onConfirm={async (reason) => { await doAction('reject', { reason }); setShowReject(false) }} />}
      {showSuspend && <ConfirmModal title="SUSPEND ACCOUNT" message={`Suspending "${agency?.company_name}" will revoke platform access immediately. You can reactivate at any time.`} confirmLabel="Suspend" confirmColor={RED} loading={actionLoading} onCancel={() => setShowSuspend(false)} onConfirm={async () => { await doAction('suspend'); setShowSuspend(false) }} />}
      {showActivate && <ConfirmModal title="ACTIVATE ACCOUNT" message={`Reactivating "${agency?.company_name}" will restore full platform access.`} confirmLabel="Activate" confirmColor={GREEN} loading={actionLoading} onCancel={() => setShowActivate(false)} onConfirm={async () => { await doAction('activate'); setShowActivate(false) }} />}

      {showInfoReq && (
        <div style={{ position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: BG2, border: '1px solid rgba(245,158,11,0.25)', borderRadius: 12, width: '100%', maxWidth: 440, padding: 28 }}>
            <div style={{ fontFamily: BEBAS, fontSize: 22, letterSpacing: 1, color: AMBER, marginBottom: 8 }}>REQUEST ADDITIONAL INFO</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 18 }}>Describe what documents or information the agency must provide before approval.</div>
            <textarea value={infoReqNote} onChange={e => setInfoReqNote(e.target.value)} placeholder="e.g. Please upload a valid GST certificate…" rows={4}
              style={{ width: '100%', background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#F5F5F5', padding: '10px 14px', fontSize: 14, resize: 'vertical' as const, fontFamily: 'inherit', boxSizing: 'border-box' as const }} />
            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              <button onClick={() => { setShowInfoReq(false); setInfoReqNote('') }} style={{ flex: 1, padding: '10px 0', background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'rgba(255,255,255,0.6)', fontFamily: BARLOW, fontSize: 15, cursor: 'pointer' }}>Cancel</button>
              <button disabled={!infoReqNote.trim() || actionLoading} onClick={async () => { await doAction('request_info', { note: infoReqNote.trim() }); setShowInfoReq(false); setInfoReqNote('') }}
                style={{ flex: 1, padding: '10px 0', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 8, color: AMBER, fontFamily: BEBAS, fontSize: 18, letterSpacing: 1, cursor: !infoReqNote.trim() || actionLoading ? 'not-allowed' : 'pointer', opacity: !infoReqNote.trim() ? 0.5 : 1 }}>
                {actionLoading ? 'Sending…' : 'Send Request'}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast msg={toast} onDone={() => setToast('')} />}
      <style>{`
        @keyframes spin{to{transform:rotate(360deg)}}
        .agency-profile-view * {
          font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
      `}</style>
    </div>
  )
}