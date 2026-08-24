'use client'
import AdminSidebar from '@/components/layout/AdminSidebar'
import AdminTopnav from '@/components/layout/AdminTopnav'
import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  ChevronRight, User, Mail, Phone, MapPin, Calendar,
  Shield, CheckCircle, XCircle, Clock, Star, Eye,
  Download, RefreshCw, AlertTriangle, Edit2,
  Globe, Award,
  Camera, Video, FileText, Activity, CreditCard,
} from 'lucide-react'

/* ─── Tokens ── */
const BG    = '#050505'
const BG2   = '#0B0F14'
const BG3   = '#121821'
const BG4   = 'rgba(255,255,255,0.03)'
const GOLD  = '#D4A64A'
const RED   = '#C8202A'
const GREEN = '#22C55E'
const BLUE  = '#3B82F6'
const PURPLE= '#8B5CF6'
const ORANGE= '#F97316'
const TEAL  = '#14B8A6'
const BEBAS = "'Bebas Neue', sans-serif"
const BARLOW= "'Barlow Condensed', sans-serif"

function getToken() {
  try {
    const raw = Object.keys(localStorage).find(k => k.startsWith('sb-') && k.endsWith('-auth-token'))
    if (raw) return JSON.parse(localStorage.getItem(raw) || '{}')?.access_token || ''
  } catch {}
  return ''
}

function fmt(v: any, fallback = '—') { return v || fallback }
function fmtDate(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}
function fmtAge(dob: string | null) {
  if (!dob) return '—'
  const diff = Date.now() - new Date(dob).getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25)) + ' yrs'
}
function arr(v: any): string[] {
  if (!v) return []
  if (Array.isArray(v)) return v
  try { return JSON.parse(v) } catch { return [] }
}

const VSTATUS_COLOR: Record<string,string> = {
  approved: GREEN, pending: ORANGE, rejected: RED, suspended: PURPLE,
}
const VSTATUS_LABEL: Record<string,string> = {
  approved: '✓ Approved', pending: '⏳ Pending', rejected: '✗ Rejected', suspended: '⏸ Suspended',
}

function InfoRow({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>{label}</span>
      <span style={{ fontSize: 14, color: color || '#F5F5F5', fontWeight: 600 }}>{value}</span>
    </div>
  )
}

function Card({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div style={{ background: BG3, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ fontSize: 15, fontWeight: 700, fontFamily: BARLOW, letterSpacing: 0.3 }}>{title}</div>
        {action}
      </div>
      <div style={{ padding: '14px 18px' }}>{children}</div>
    </div>
  )
}

function Tag({ label, color = GOLD }: { label: string; color?: string }) {
  return (
    <span style={{ padding: '4px 10px', borderRadius: 6, fontSize: 13, fontWeight: 600, background: `${color}20`, color, border: `1px solid ${color}44` }}>
      {label}
    </span>
  )
}

function StatBox({ label, value, color = GOLD }: { label: string; value: string | number; color?: string }) {
  return (
    <div style={{ background: BG4, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: '12px 14px', textAlign: 'center' as const }}>
      <div style={{ fontFamily: BEBAS, fontSize: 26, color, letterSpacing: 1, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>{label}</div>
    </div>
  )
}

function DeleteConfirmModal({ name, onConfirm, onCancel }: { name: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div style={{ position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: BG2, border: '1px solid rgba(200,32,42,0.35)', borderRadius: 12, width: '100%', maxWidth: 420, padding: 28 }}>
        <div style={{ fontFamily: BEBAS, fontSize: 22, letterSpacing: 1, color: RED, marginBottom: 10 }}>DELETE ACCOUNT</div>
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, marginBottom: 24, fontFamily: BARLOW }}>
          You are about to permanently delete <strong style={{ color: '#F5F5F5' }}>{name}</strong>'s account. This action <strong style={{ color: RED }}>cannot be undone</strong>. All profile data, applications, and media will be permanently removed.
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={onCancel} style={{ flex: 1, padding: '10px 0', background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'rgba(255,255,255,0.6)', fontFamily: BARLOW, fontSize: 15, cursor: 'pointer' }}>Cancel</button>
          <button onClick={onConfirm} style={{ flex: 1, padding: '10px 0', background: 'rgba(200,32,42,0.2)', border: '1px solid rgba(200,32,42,0.45)', borderRadius: 8, color: RED, fontFamily: BEBAS, fontSize: 18, letterSpacing: 1, cursor: 'pointer' }}>Delete Permanently</button>
        </div>
      </div>
    </div>
  )
}

export default function AspProfilePage() {
  const router      = useRouter()
  const params      = useSearchParams()
  const userId      = params.get('user_id') || ''

  const [loading,         setLoading]         = useState(true)
  const [error,           setError]           = useState('')
  const [profile,         setProfile]         = useState<any>(null)
  const [asp,             setAsp]             = useState<any>(null)
  const [sub,             setSub]             = useState<any>(null)
  const [actionMsg,       setActionMsg]       = useState('')
  const [actColor,        setActColor]        = useState(GREEN)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const toast = (msg: string, color = GREEN) => {
    setActionMsg(msg); setActColor(color)
    setTimeout(() => setActionMsg(''), 3000)
  }

  const fetchProfile = useCallback(async () => {
    if (!userId) { setError('No user ID provided'); setLoading(false); return }
    setLoading(true); setError('')
    try {
      const token = getToken()
      const res = await fetch(`/api/admin/users?user_id=${userId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      const d = await res.json()
      if (!res.ok) throw new Error((d.data ?? d)?.error || 'Failed to load profile')
      const u = (d.data ?? d)?.user
      if (!u) throw new Error('User not found')
      setProfile(u)
      const aspData = u.aspirant_profiles?.[0] || u.aspirant_profiles || null
      setAsp(aspData)
      const subData = u.subscriptions?.[0] || null
      setSub(subData)
    } catch (e: any) {
      setError(e.message || 'Failed to load profile')
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => { fetchProfile() }, [fetchProfile])

  async function doAction(action: string, reason?: string) {
    try {
      const token = getToken()
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ user_id: userId, action, reason }),
      })
      const d = await res.json()
      if (!res.ok) throw new Error((d.data ?? d)?.error || 'Action failed')
      toast(`User ${action} successful`)
      fetchProfile()
    } catch (e: any) {
      toast(e.message || 'Action failed', RED)
    }
  }

  async function updateVerification(status: string) {
    try {
      const token = getToken()
      const res = await fetch('/api/admin/talent-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ user_id: userId, action: status }),
      })
      if (!res.ok) throw new Error('Failed')
      toast(`Verification status updated to ${status}`)
      fetchProfile()
    } catch (e: any) {
      toast(e.message || 'Failed to update verification', RED)
    }
  }

  const vStatus  = asp?.verification_status || 'pending'
  const isActive = profile?.is_active

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: BG, fontFamily: BARLOW, color: '#F5F5F5' }}>
      <AdminTopnav />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <AdminSidebar onCollapse={() => {}} />
        <div style={{ flex: 1, overflowY: 'auto', padding: '18px 22px 40px', display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
            <span onClick={() => router.push('/admin/dashboard')} style={{ cursor: 'pointer' }}>Home</span>
            <ChevronRight size={12} />
            <span onClick={() => router.push('/admin/users')} style={{ cursor: 'pointer' }}>User Management</span>
            <ChevronRight size={12} />
            <span style={{ color: 'rgba(255,255,255,0.7)' }}>Aspirant Profile</span>
          </div>

          {loading && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300, flexDirection: 'column', gap: 12 }}>
              <RefreshCw size={24} color={GOLD} style={{ animation: 'spin 1s linear infinite' }} />
              <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)' }}>Loading profile…</div>
            </div>
          )}

          {!loading && error && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: 48 }}>
              <AlertTriangle size={32} color={RED} />
              <div style={{ fontSize: 16, color: RED }}>{error}</div>
              <button onClick={() => router.push('/admin/users')} style={{ padding: '8px 20px', background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, color: '#F5F5F5', fontFamily: BARLOW, fontSize: 15, cursor: 'pointer' }}>Back to Users</button>
            </div>
          )}

          {!loading && !error && profile && (
            <>
              {/* HERO */}
              <div style={{ background: '#121821', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '20px 22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' as const, gap: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                    <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(212,166,74,0.15)', border: '2px solid rgba(212,166,74,0.3)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', fontSize: 30, fontFamily: BEBAS, color: GOLD }}>
                      {asp?.profile_image_url ? <img src={asp.profile_image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (profile.name || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontFamily: BEBAS, fontSize: 28, letterSpacing: 1, color: '#F5F5F5', lineHeight: 1.1 }}>{profile.name || [asp?.first_name, asp?.last_name].filter(Boolean).join(' ') || 'Unknown'}</div>
                      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{asp?.profile_number || profile.profile_number || userId.slice(0, 8)}</div>
                      <div style={{ display: 'flex', gap: 7, marginTop: 8, flexWrap: 'wrap' as const }}>
                        <span style={{ padding: '3px 10px', borderRadius: 6, fontSize: 12, fontWeight: 700, background: (VSTATUS_COLOR[vStatus] || ORANGE) + '22', color: VSTATUS_COLOR[vStatus] || ORANGE, border: '1px solid ' + (VSTATUS_COLOR[vStatus] || ORANGE) + '44' }}>{VSTATUS_LABEL[vStatus] || vStatus}</span>
                        <span style={{ padding: '3px 10px', borderRadius: 6, fontSize: 12, fontWeight: 700, background: isActive ? 'rgba(34,197,94,0.15)' : 'rgba(200,32,42,0.15)', color: isActive ? GREEN : RED, border: isActive ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(200,32,42,0.3)' }}>{isActive ? 'Active' : 'Suspended'}</span>
                        {asp?.category && <span style={{ padding: '3px 10px', borderRadius: 6, fontSize: 12, fontWeight: 700, background: 'rgba(59,130,246,0.15)', color: BLUE, border: '1px solid rgba(59,130,246,0.3)' }}>{asp.category}</span>}
                        {asp?.role && <span style={{ padding: '3px 10px', borderRadius: 6, fontSize: 12, fontWeight: 700, background: 'rgba(139,92,246,0.15)', color: PURPLE, border: '1px solid rgba(139,92,246,0.3)' }}>{asp.role}</span>}
                        {sub && <span style={{ padding: '3px 10px', borderRadius: 6, fontSize: 12, fontWeight: 700, background: 'rgba(212,166,74,0.15)', color: GOLD, border: '1px solid rgba(212,166,74,0.3)' }}>{sub.plan_name}</span>}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const, alignItems: 'center' }}>
                    {vStatus === 'pending' && <>
                      <button onClick={() => updateVerification('approve')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 7, color: GREEN, fontFamily: BARLOW, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}><CheckCircle size={14} /> Approve</button>
                      <button onClick={() => updateVerification('reject')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: 'rgba(200,32,42,0.12)', border: '1px solid rgba(200,32,42,0.3)', borderRadius: 7, color: RED, fontFamily: BARLOW, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}><XCircle size={14} /> Reject</button>
                    </>}
                    {vStatus === 'approved' && <button onClick={() => updateVerification('suspend')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.3)', borderRadius: 7, color: ORANGE, fontFamily: BARLOW, fontSize: 14, cursor: 'pointer' }}><AlertTriangle size={14} /> Suspend Verification</button>}
                    <button onClick={() => doAction(isActive ? 'suspend' : 'activate')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: isActive ? 'rgba(200,32,42,0.12)' : 'rgba(34,197,94,0.12)', border: isActive ? '1px solid rgba(200,32,42,0.3)' : '1px solid rgba(34,197,94,0.3)', borderRadius: 7, color: isActive ? RED : GREEN, fontFamily: BARLOW, fontSize: 14, cursor: 'pointer' }}>
                      {isActive ? <><XCircle size={14} /> Suspend</> : <><CheckCircle size={14} /> Activate</>}
                    </button>
                    <button onClick={() => doAction('reset_password')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, color: 'rgba(255,255,255,0.6)', fontFamily: BARLOW, fontSize: 14, cursor: 'pointer' }}><Shield size={14} /> Reset Password</button>
                    <button onClick={fetchProfile} style={{ padding: '8px 10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, color: 'rgba(255,255,255,0.4)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><RefreshCw size={13} /></button>
                  </div>
                </div>
              </div>

              {/* STATS */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 10 }}>
                <StatBox label="Profile Views"    value={asp?.profile_views    || 0}         color={BLUE}   />
                <StatBox label="Profile Complete" value={`${asp?.profile_completion || 0}%`} color={GOLD}   />
                <StatBox label="Trust Score"      value={asp?.trust_score      ?? '—'}       color={GREEN}  />
                <StatBox label="Search Appears."  value={asp?.search_appearances || 0}       color={PURPLE} />
                <StatBox label="Subscription"     value={sub?.plan_name || 'None'}           color={TEAL}   />
              </div>

              {/* MAIN GRID */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <Card title="Personal Information">
                  <InfoRow label="Full Name"      value={`${asp?.title || ''} ${asp?.first_name || ''} ${asp?.last_name || ''}`.trim() || profile.name || '—'} />
                  <InfoRow label="Email"          value={fmt(profile.email)} />
                  <InfoRow label="Phone"          value={fmt(profile.phone)} />
                  <InfoRow label="Gender"         value={fmt(asp?.gender)} />
                  <InfoRow label="Date of Birth"  value={fmtDate(asp?.date_of_birth)} />
                  <InfoRow label="Age"            value={fmtAge(asp?.date_of_birth)} />
                  <InfoRow label="Email Verified" value={profile.email_verified ? '✓ Yes' : '✗ No'} color={profile.email_verified ? GREEN : RED} />
                  <InfoRow label="Member Since"   value={fmtDate(profile.created_at)} />
                  <InfoRow label="Last Login"     value={fmtDate(profile.last_login_at)} />
                </Card>
                <Card title="Location">
                  <InfoRow label="Address Line 1" value={fmt(asp?.address_line1)} />
                  <InfoRow label="Address Line 2" value={fmt(asp?.address_line2)} />
                  <InfoRow label="City"           value={fmt(asp?.city)} />
                  <InfoRow label="State"          value={fmt(asp?.state)} />
                  <InfoRow label="Pincode"        value={fmt(asp?.pincode)} />
                  <InfoRow label="Country"        value={fmt(asp?.country)} />
                </Card>
                <Card title="Physical Attributes">
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
                    {[
                      { label: 'Height',     value: asp?.height_cm  ? `${asp.height_cm} cm`  : '—' },
                      { label: 'Weight',     value: asp?.weight_kg  ? `${asp.weight_kg} kg`  : '—' },
                      { label: 'Hair Color', value: fmt(asp?.hair_color) },
                      { label: 'Eye Color',  value: fmt(asp?.eye_color)  },
                      { label: 'Body Tone',  value: fmt(asp?.body_tone)  },
                      { label: 'Body Type',  value: fmt(asp?.body_type)  },
                      { label: 'Chest Size', value: asp?.chest_size ? `${asp.chest_size}"` : '—' },
                      { label: 'Waist Size', value: asp?.waist_size ? `${asp.waist_size}"` : '—' },
                      { label: 'Hip Size',   value: asp?.hip_size   ? `${asp.hip_size}"`   : '—' },
                      { label: 'Shoe Size',  value: asp?.shoe_size  ? `${asp.shoe_size}`   : '—' },
                    ].map(r => <InfoRow key={r.label} label={r.label} value={r.value} />)}
                  </div>
                </Card>
                <Card title="Professional Details">
                  <InfoRow label="Category"         value={fmt(asp?.category)} />
                  <InfoRow label="Role"             value={fmt(asp?.role)} />
                  <InfoRow label="Experience Level" value={fmt(asp?.experience_level)} />
                  <InfoRow label="Available"        value={asp?.is_available ? '✓ Yes' : '✗ No'} color={asp?.is_available ? GREEN : ORANGE} />
                  {arr(asp?.skills).length > 0 && <div style={{ marginTop: 12 }}><div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>Skills</div><div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{arr(asp?.skills).map((s: string) => <Tag key={s} label={s} color={BLUE} />)}</div></div>}
                  {arr(asp?.languages).length > 0 && <div style={{ marginTop: 12 }}><div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>Languages</div><div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{arr(asp?.languages).map((l: string) => <Tag key={l} label={l} color={TEAL} />)}</div></div>}
                  {arr(asp?.availability).length > 0 && <div style={{ marginTop: 12 }}><div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>Available For</div><div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{arr(asp?.availability).map((a: string) => <Tag key={a} label={a} color={PURPLE} />)}</div></div>}
                </Card>
              </div>

              {/* ABOUT + SUBSCRIPTION */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 14 }}>
                <Card title="About Me">
                  {asp?.about_me ? <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, margin: 0 }}>{asp.about_me}</p> : <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', fontStyle: 'italic', margin: 0 }}>No bio added yet.</p>}
                </Card>
                <Card title="Subscription">
                  {sub ? <><InfoRow label="Plan" value={fmt(sub.plan_name)} /><InfoRow label="Status" value={fmt(sub.status)} color={sub.status === 'active' ? GREEN : ORANGE} /><InfoRow label="Expires" value={fmtDate(sub.ends_at)} /></> : <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', fontStyle: 'italic', margin: 0 }}>No active subscription.</p>}
                  <button onClick={() => router.push(`/admin/subscriptions?search=${profile.email}`)} style={{ marginTop: 14, width: '100%', padding: '8px', background: BG4, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, color: 'rgba(255,255,255,0.6)', fontFamily: BARLOW, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}><CreditCard size={13} /> View Full Subscription History</button>
                </Card>
              </div>

              {/* SOCIAL LINKS */}
              {asp?.social_links && Object.keys(asp.social_links).length > 0 && (
                <Card title="Social Media Links">
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                    {Object.entries(asp.social_links).map(([platform, url]) => url ? (
                      <a key={platform} href={String(url)} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', background: BG4, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: GOLD, fontFamily: BARLOW, fontSize: 14, textDecoration: 'none' }}>
                        <Globe size={13} /> {platform}
                      </a>
                    ) : null)}
                  </div>
                </Card>
              )}

              {/* ADMIN ACTIONS */}
              <Card title="Admin Actions">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
                  {[
                    { label: 'View Applications', color: BLUE,   action: () => router.push(`/admin/applications?aspirant_id=${userId}`) },
                    { label: 'View Reports',      color: ORANGE, action: () => router.push(`/admin/reports?user_id=${userId}`) },
                    { label: 'View Audit Logs',   color: PURPLE, action: () => router.push(`/admin/audit?user_id=${userId}`) },
                    { label: 'Reset Password',    color: TEAL,   action: () => doAction('reset_password') },
                    { label: isActive ? 'Suspend Account' : 'Activate Account', color: isActive ? RED : GREEN, action: () => doAction(isActive ? 'suspend' : 'activate') },
                    { label: 'Delete Account',    color: RED,    action: () => setShowDeleteModal(true) },
                  ].map(btn => (
                    <button key={btn.label} onClick={btn.action} style={{ padding: '10px', background: `${btn.color}15`, border: `1px solid ${btn.color}33`, borderRadius: 8, color: btn.color, fontFamily: BARLOW, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>{btn.label}</button>
                  ))}
                </div>
              </Card>
            </>
          )}

          {!loading && (
            <button onClick={() => router.push('/admin/users')} style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, color: 'rgba(255,255,255,0.6)', fontFamily: BARLOW, fontSize: 14, cursor: 'pointer' }}>
              ← Back to User Management
            </button>
          )}
        </div>
      </div>

      {showDeleteModal && (
        <DeleteConfirmModal
          name={profile?.name || [asp?.first_name, asp?.last_name].filter(Boolean).join(' ') || 'this user'}
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={() => { setShowDeleteModal(false); doAction('delete') }}
        />
      )}

      {actionMsg && (
        <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: actColor, color: '#000', padding: '12px 24px', borderRadius: 10, fontFamily: BARLOW, fontSize: 15, fontWeight: 700, zIndex: 500, boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
          {actionMsg}
        </div>
      )}

      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}