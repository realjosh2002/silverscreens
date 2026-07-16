'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import SilverScreensLogo from '@/components/ui/SilverScreensLogo'
import { useNotifications } from '@/context/NotificationsContext'
import {
  LayoutDashboard, FileText, MessageSquare, Mic2, Bookmark,
  Star, Bell, ChevronRight, ChevronLeft, Menu, Crown, User, Settings,
  Shield, Mail, Eye, Sliders, UserX, CreditCard,
  FolderOpen, HelpCircle, LogOut, Camera, ExternalLink, Check,
  Award, GraduationCap, Briefcase, BadgeCheck, Plus, Trash2, Pencil, X,
} from 'lucide-react'

/* ── CONSTANTS ───────────────────────────────────────────────── */
const RED    = '#C8202A'
const GOLD   = '#D4A64A'
const GREEN  = '#22C55E'
const BLUE   = '#3B82F6'
const BG     = '#050505'
const BG2    = '#0B0F14'
const BG3    = '#121821'
const BG4    = '#1C2030'
const BARLOW = '"Barlow Condensed", sans-serif'
const BEBAS  = "'Bebas Neue', sans-serif"

/* ── SIDEBAR NAV ─────────────────────────────────────────────── */
const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard',             href: '/dashboard' },
  { icon: FileText,        label: 'My Applications',       href: '/applications' },
  { icon: MessageSquare,   label: 'Messages',   href: '/messages' },
  { icon: Mic2,            label: 'Auditions',             href: '/auditions' },
  { icon: Bookmark,        label: 'Saved Castings',        href: '/saved-castings' },
  { icon: Star,            label: 'Recommended Castings',  href: '/recommended' },
  { icon: Bell,            label: 'Notifications', href: '/notifications' },
]

const dropdownLinks = [
  { label: 'Subscription', href: '/dashboard/subscription' },
  { label: 'Analytics',    href: '/analytics' },
  { label: 'Calendar',     href: '/calendar' },
  { label: 'Settings',     href: '/settings' },
  { label: 'Support',      href: '/contact' },
  { label: 'Logout',       href: '/login' },
]

/* ── SETTINGS NAV ────────────────────────────────────────────── */
const settingsNav = [
  { key: 'profile',      icon: User,        label: 'Profile & Account'    },
  { key: 'security',     icon: Shield,      label: 'Account & Security'   },
  { key: 'notifications',icon: Bell,        label: 'Notifications'        },
  { key: 'email',        icon: Mail,        label: 'Email Preferences'    },
  { key: 'privacy',      icon: Eye,         label: 'Privacy'              },
  { key: 'preferences',  icon: Sliders,     label: 'Preferences'          },
  { key: 'blocked',      icon: UserX,       label: 'Blocked Agencies'     },
  { key: 'billing',      icon: CreditCard,  label: 'Subscription & Billing'},
  { key: 'documents',    icon: FolderOpen,  label: 'Documents'            },
  { key: 'experience',   icon: Briefcase,   label: 'Experience'           },
  { key: 'education',    icon: GraduationCap, label: 'Education'          },
  { key: 'awards',       icon: Award,       label: 'Awards'               },
  { key: 'memberships',  icon: BadgeCheck,  label: 'Memberships'          },
]

/* ── SHARED COMPONENTS ───────────────────────────────────────── */
function SettingRow({ label, value, valueColor, onEdit, chevron }: {
  label: string; value?: string; valueColor?: string; onEdit?: () => void; chevron?: boolean
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <span style={{ fontSize: 16, fontFamily: BARLOW, color: 'rgba(255,255,255,0.5)' }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {value && <span style={{ fontSize: 16, fontFamily: BARLOW, color: valueColor || '#fff', fontWeight: 600 }}>{value}</span>}
        {onEdit && (
          <button onClick={onEdit} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 14, fontFamily: BARLOW, cursor: 'pointer' }}>
            ✏️ Edit
          </button>
        )}
        {chevron && <ChevronRight size={15} color="rgba(255,255,255,0.3)" />}
      </div>
    </div>
  )
}

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <div onClick={onChange} style={{ width: 38, height: 21, borderRadius: 11, cursor: 'pointer', background: on ? GREEN : 'rgba(255,255,255,0.12)', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
      <div style={{ position: 'absolute', top: 3, left: on ? 20 : 3, width: 15, height: 15, borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }} />
    </div>
  )
}

function SectionCard({ icon: Icon, iconBg, title, desc, children }: {
  icon: React.ElementType; iconBg: string; title: string; desc: string; children: React.ReactNode
}) {
  return (
    <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon size={18} color="#fff" strokeWidth={1.8} />
        </div>
        <div>
          <div style={{ fontSize: 17, fontFamily: BARLOW, fontWeight: 700, color: '#fff' }}>{title}</div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW }}>{desc}</div>
        </div>
      </div>
      {children}
    </div>
  )
}

function StatusBadge({ label, color }: { label: string; color: string }) {
  return (
    <span style={{ fontSize: 14, fontFamily: BARLOW, fontWeight: 700, color, background: `${color}18`, border: `1px solid ${color}40`, borderRadius: 20, padding: '2px 10px' }}>{label}</span>
  )
}

/* ── EDIT MODAL ──────────────────────────────────────────────── */
function EditModal({ label, value, onClose, onSave }: { label: string; value: string; onClose: () => void; onSave: (v: string) => void }) {
  const [val, setVal] = useState(value)
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, backdropFilter: 'blur(4px)' }}>
      <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: '28px', maxWidth: 420, width: '100%', boxShadow: '0 40px 80px rgba(0,0,0,0.7)' }}>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`, borderRadius: 2 }} />
        </div>
        <div style={{ fontFamily: BEBAS, fontSize: 22, letterSpacing: 1, color: '#fff', marginBottom: 16, marginTop: 8 }}>Edit {label}</div>
        <input
          value={val}
          onChange={e => setVal(e.target.value)}
          style={{ width: '100%', background: BG3, border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '11px 14px', color: '#fff', fontSize: 16, fontFamily: BARLOW, outline: 'none', boxSizing: 'border-box' as const, marginBottom: 18 }}
          autoFocus
        />
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={onClose} style={{ flex: 1, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '11px', fontSize: 16, fontFamily: BARLOW, fontWeight: 700, color: '#fff', cursor: 'pointer' }}>Cancel</button>
          <button onClick={() => { onSave(val); onClose() }} style={{ flex: 1, background: RED, border: 'none', borderRadius: 8, padding: '11px', fontSize: 16, fontFamily: BARLOW, fontWeight: 700, color: '#fff', cursor: 'pointer' }}>Save</button>
        </div>
      </div>
    </div>
  )
}

/* ── MAIN PAGE ───────────────────────────────────────────────── */
export default function SettingsPage() {
  const router = useRouter()
  const { counts, markAllRead } = useNotifications()
  const [sidebarOpen,  setSidebarOpen]  = useState(false)
  const SB_W = sidebarOpen ? 210 : 56
  const [dropOpen,    setDropOpen]    = useState(false)
  const [activeTab,   setActiveTab]   = useState('profile')
  const [editField,   setEditField]   = useState<{ label: string; value: string; key: string } | null>(null)

  // Profile state — starts from localStorage, API load will update it
  const [profile, setProfile] = useState(() => {
    try {
      const u = JSON.parse(localStorage.getItem('ss_user') || '{}')
      return {
        fullName:   u.name    || '',
        stageName:  u.stageName || '',
        email:      u.email   || '',
        mobile:     u.phone   || '',
        location:   u.location || '',
        visibility: 'Public',
      }
    } catch {
      return { fullName: '', stageName: '', email: '', mobile: '', location: '', visibility: 'Public' }
    }
  })

  // User identity for topnav/sidebar — from localStorage
  const [userName,   setUserName]   = useState(() => { try { return JSON.parse(localStorage.getItem('ss_user') || '{}').name || 'My Account' } catch { return 'My Account' } })
  const [userAvatar, setUserAvatar] = useState(() => { try { return JSON.parse(localStorage.getItem('ss_user') || '{}').profilePhoto || '' } catch { return '' } })
  const [userEmail,  setUserEmail]  = useState(() => { try { return JSON.parse(localStorage.getItem('ss_user') || '{}').email || '' } catch { return '' } })

  // Security state
  const [twoFA,       setTwoFA]       = useState(true)
  const [secModal,    setSecModal]    = useState<null|'password'|'2fa'|'sessions'|'activity'>(null)
  const [pwForm,      setPwForm]      = useState({ current: '', newPw: '', confirm: '' })
  const [pwError,     setPwError]     = useState('')
  const [pwSuccess,   setPwSuccess]   = useState(false)

  // Notifications state
  const [notifs, setNotifs] = useState({
    push: true, email: true, sms: false,
    // Push granular
    pushCasting: true, pushCallback: true, pushMessages: true, pushReminders: true, pushPromotions: false,
    // Email granular
    emailCasting: true, emailCallback: true, emailMessages: false, emailReminders: true, emailWeekly: true,
    // SMS granular
    smsCasting: false, smsCallback: true, smsReminders: false,
  })
  const toggleNotif = (key: string) => setNotifs(p => ({ ...p, [key]: !p[key as keyof typeof p] }))

  // Email prefs
  const [emailPrefs, setEmailPrefs] = useState({ castingOpp: true, appUpdates: true, marketing: false, newsletter: true })
  const toggleEmailPref = (key: string) => setEmailPrefs(p => ({ ...p, [key]: !p[key as keyof typeof p] }))
  const [emailFrequency, setEmailFrequency] = useState('realtime')
  const [emailFormat,    setEmailFormat]    = useState('html')
  const [unsubAll,       setUnsubAll]       = useState(false)

  // Privacy
  const [privacy, setPrivacy] = useState({ profileVisibility: 'Public', whoCanMessage: 'Everyone', showContact: 'Agencies Only' })
  const [privacyModal, setPrivacyModal] = useState<null|'visibility'|'message'|'contact'|'activity'>(null)
  const [deleteStep, setDeleteStep] = useState<null|'confirm'|'otp'|'success'>(null)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', ''])
  const [otpError, setOtpError] = useState('')
  const [otpResendCooldown, setOtpResendCooldown] = useState(0)
  const updatePrivacy = (key: string, val: string) => setPrivacy(p => ({ ...p, [key]: val }))

  // Preferences
  const [prefs, setPrefs] = useState({
    availability: 'Available', language: 'English',
    preferredRoles: ['Lead Actor', 'Supporting Actor'] as string[],
    preferredLocations: ['Mumbai', 'Goa'] as string[],
  })
  const [prefsModal, setPrefsModal] = useState<null|'roles'|'locations'|'availability'|'language'>(null)
  const togglePrefTag = (key: 'preferredRoles' | 'preferredLocations', val: string) =>
    setPrefs(p => ({ ...p, [key]: p[key].includes(val) ? p[key].filter(v => v !== val) : [...p[key], val] }))
  const setPrefValue = (key: 'availability' | 'language', val: string) =>
    setPrefs(p => ({ ...p, [key]: val }))

  // Blocked agencies state
  const [blockedModal, setBlockedModal] = useState<null|'agencies'>(null)
  const [blockedAgencies, setBlockedAgencies] = useState([
    { id: 1, name: 'Crimson Studios',       reason: 'Inappropriate messages', date: '12 Mar 2025' },
    { id: 2, name: 'Starline Productions',  reason: 'Spam casting calls',     date: '02 Feb 2025' },
  ])
  const unblockAgency = (id: number) => setBlockedAgencies(p => p.filter(a => a.id !== id))

  const updateProfile = (key: string, val: string) => setProfile(p => ({ ...p, [key]: val }))

  /* ── Auth helper ── */
  function getToken(): string {
    try { return JSON.parse(localStorage.getItem('ss_user') || '{}').token || '' } catch { return '' }
  }

  /* ── Load all profile data from API on mount ── */
  useState(() => {
    const token = getToken()
    if (!token) return
    fetch('/api/profile/aspirant', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return
        const p = data.data?.profile ?? data.profile ?? data
        if (!p) return
        // Basic profile
        const name = [p.first_name, p.last_name].filter(Boolean).join(' ')
        if (name) {
          setProfile(prev => ({ ...prev, fullName: name, email: p.profiles?.email || prev.email, mobile: p.profiles?.phone || prev.mobile, location: [p.city, p.state].filter(Boolean).join(', ') || prev.location }))
          setUserName(name)
          setUserEmail(p.profiles?.email || '')
        }
        if (p.profile_image_url) setUserAvatar(p.profile_image_url)
        // social_links contains education, awards, memberships, documents
        const sl = p.social_links || {}
        if (Array.isArray(sl.education)   && sl.education.length)   setEducations(sl.education.map((e: any, i: number) => ({ ...e, id: e.id || i + 1 })))
        if (Array.isArray(sl.awards)      && sl.awards.length)      setAwards(sl.awards.map((a: any, i: number) => ({ ...a, id: a.id || i + 1 })))
        if (Array.isArray(sl.memberships) && sl.memberships.length) setMemberships(sl.memberships.map((m: any, i: number) => ({ ...m, id: m.id || i + 1 })))
        // Experience (credits) already in social_links.credits
        if (Array.isArray(sl.credits) && sl.credits.length) {
          setExperiences(sl.credits.map((c: any, i: number) => ({
            id: c.id || i + 1, project: c.title || '', role: c.role || '',
            company: c.company || '', from: c.from || c.year || '',
            to: c.to || '', current: c.current || false, description: c.description || '',
          })))
        }
        // Documents from aspirant_media where type = 'document'
        if (Array.isArray(p.aspirant_media)) {
          const docs = p.aspirant_media
            .filter((m: any) => m.type === 'document' || m.media_type === 'document')
            .map((m: any, i: number) => ({
              id: i + 1, name: m.title || m.file_name || 'Document',
              type: m.document_type || m.title || 'Document',
              status: 'Uploaded', size: m.file_size ? `${(m.file_size / 1024).toFixed(0)} KB` : '',
              date: m.created_at ? new Date(m.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '',
              url: m.url || '',
            }))
          if (docs.length) setDocuments(docs)
        }
      })
      .catch(() => {})
  })

  /* ── Save social_links data to API ── */
  async function saveSocialLinks(patch: Record<string, unknown>) {
    const token = getToken()
    if (!token) return
    // First get current social_links so we don't overwrite other keys
    try {
      const r = await fetch('/api/profile/aspirant', { headers: { Authorization: `Bearer ${token}` } })
      const data = r.ok ? await r.json() : null
      const current = data?.data?.profile?.social_links || data?.profile?.social_links || {}
      await fetch('/api/profile/aspirant', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ social_links: { ...current, ...patch } }),
      })
    } catch {}
  }

  // Documents state
  const [documents, setDocuments] = useState<{ id: number; name: string; type: string; status: string; size: string; date: string; url?: string }[]>([])
  const [docUploadOpen, setDocUploadOpen] = useState(false)
  const [docUploadType, setDocUploadType] = useState('Resume')
  const [docDeleteId, setDocDeleteId] = useState<number | null>(null)
  const deleteDocument = (id: number) => { setDocuments(p => p.filter(d => d.id !== id)); setDocDeleteId(null) }
  const [docUploading, setDocUploading] = useState(false)
  const uploadDocument = async (file: File) => {
    const token = getToken()
    if (!token || !file) return
    setDocUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('type', 'document')
      fd.append('title', docUploadType)
      fd.append('document_type', docUploadType)
      const res = await fetch('/api/upload', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd })
      if (res.ok) {
        const data = await res.json()
        const url = data.data?.url ?? data.url ?? ''
        const newDoc = {
          id: Date.now(), name: file.name, type: docUploadType,
          status: 'Uploaded', size: `${(file.size / 1024).toFixed(0)} KB`,
          date: 'Just now', url,
        }
        setDocuments(p => [newDoc, ...p])
        setDocUploadOpen(false)
      }
    } catch {}
    setDocUploading(false)
  }

  // ── Experience ──
  interface ExperienceEntry { id: number; project: string; role: string; company: string; from: string; to: string; current: boolean; description: string }
  const [experiences, setExperiences] = useState<ExperienceEntry[]>([])
  const [expModal, setExpModal] = useState<null | 'add' | number>(null)
  const blankExp = (): ExperienceEntry => ({ id: Date.now(), project: '', role: '', company: '', from: '', to: '', current: false, description: '' })
  const [expForm, setExpForm] = useState<ExperienceEntry>(blankExp())
  const saveExp = () => {
    let updated: ExperienceEntry[]
    if (expModal === 'add') {
      updated = [...experiences, { ...expForm, id: Date.now() }]
    } else {
      updated = experiences.map(e => e.id === expModal ? expForm : e)
    }
    setExperiences(updated)
    setExpModal(null)
    // Save to API as social_links.credits
    saveSocialLinks({ credits: updated.map(e => ({ id: e.id, title: e.project, role: e.role, company: e.company, from: e.from, to: e.to, current: e.current, description: e.description, year: e.from })) })
  }

  const deleteExp = (id: number) => {
    const updated = experiences.filter(e => e.id !== id)
    setExperiences(updated)
    saveSocialLinks({ credits: updated.map(e => ({ id: e.id, title: e.project, role: e.role, company: e.company, from: e.from, to: e.to, current: e.current, description: e.description, year: e.from })) })
  }

  // ── Education ──
  interface EducationEntry { id: number; degree: string; institution: string; field: string; from: string; to: string; grade: string }
  const [educations, setEducations] = useState<EducationEntry[]>([])
  const [eduModal, setEduModal] = useState<null | 'add' | number>(null)
  const blankEdu = (): EducationEntry => ({ id: Date.now(), degree: '', institution: '', field: '', from: '', to: '', grade: '' })
  const [eduForm, setEduForm] = useState<EducationEntry>(blankEdu())
  const saveEdu = () => {
    let updated: EducationEntry[]
    if (eduModal === 'add') {
      updated = [...educations, { ...eduForm, id: Date.now() }]
    } else {
      updated = educations.map(e => e.id === eduModal ? eduForm : e)
    }
    setEducations(updated)
    setEduModal(null)
    saveSocialLinks({ education: updated })
  }

  const deleteEdu = (id: number) => {
    const updated = educations.filter(e => e.id !== id)
    setEducations(updated)
    saveSocialLinks({ education: updated })
  }

  // ── Awards ──
  interface AwardEntry { id: number; name: string; category: string; issuedBy: string; year: string; description: string }
  const [awards, setAwards] = useState<AwardEntry[]>([])
  const [awardModal, setAwardModal] = useState<null | 'add' | number>(null)
  const blankAward = (): AwardEntry => ({ id: Date.now(), name: '', category: '', issuedBy: '', year: '', description: '' })
  const [awardForm, setAwardForm] = useState<AwardEntry>(blankAward())
  const saveAward = () => {
    let updated: AwardEntry[]
    if (awardModal === 'add') {
      updated = [...awards, { ...awardForm, id: Date.now() }]
    } else {
      updated = awards.map(a => a.id === awardModal ? awardForm : a)
    }
    setAwards(updated)
    setAwardModal(null)
    saveSocialLinks({ awards: updated })
  }

  const deleteAward = (id: number) => {
    const updated = awards.filter(a => a.id !== id)
    setAwards(updated)
    saveSocialLinks({ awards: updated })
  }

  // ── Memberships ──
  interface MembershipEntry { id: number; association: string; membershipId: string; since: string; validTill: string; lifetime: boolean; cardFile: string }
  const [memberships, setMemberships] = useState<MembershipEntry[]>([])
  const [memModal, setMemModal] = useState<null | 'add' | number>(null)
  const blankMem = (): MembershipEntry => ({ id: Date.now(), association: '', membershipId: '', since: '', validTill: '', lifetime: false, cardFile: '' })
  const [memForm, setMemForm] = useState<MembershipEntry>(blankMem())
  const saveMem = () => {
    let updated: MembershipEntry[]
    if (memModal === 'add') {
      updated = [...memberships, { ...memForm, id: Date.now() }]
    } else {
      updated = memberships.map(m => m.id === memModal ? memForm : m)
    }
    setMemberships(updated)
    setMemModal(null)
    saveSocialLinks({ memberships: updated })
  }

  const deleteMem = (id: number) => {
    const updated = memberships.filter(m => m.id !== id)
    setMemberships(updated)
    saveSocialLinks({ memberships: updated })
  }

  // shared input style for modals
  const mi: React.CSSProperties = { width: '100%', background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '9px 12px', color: '#fff', fontSize: 15, fontFamily: BARLOW, outline: 'none', boxSizing: 'border-box' as const }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: BG, color: '#F5F5F5', fontFamily: BARLOW, overflow: 'hidden' }}>
      {editField && (
        <EditModal
          label={editField.label}
          value={editField.value}
          onClose={() => setEditField(null)}
          onSave={val => updateProfile(editField.key, val)}
        />
      )}

      {/* ── TOPNAV ── */}
      <header style={{ height: 60, flexShrink: 0, background: BG2, borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', padding: '0 24px', gap: 16, zIndex: 50 }}>
        <SilverScreensLogo size="md" href="/" showTagline={false} />
        <div style={{ flex: 1 }} />
        {/* Find Casting Calls */}
        <button onClick={() => router.push('/casting-calls')} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'transparent', border: `1px solid ${GOLD}`, color: GOLD, borderRadius: 8, padding: '0 18px', height: 36, fontSize: 15, fontWeight: 600, fontFamily: BARLOW, cursor: 'pointer', whiteSpace: 'nowrap' }}>+ Find Casting Calls</button>
        {/* Icons — Messages and Bell only, Saved Castings removed */}
        {[
          { n: <MessageSquare size={16}/>, badge: counts.messages,      href: '/messages',      readKey: 'messages' as const },
          { n: <Bell size={16}/>,         badge: counts.notifications, href: '/notifications', readKey: 'notifications' as const },
        ].map((item, i) => (
          <div key={i} onClick={() => { markAllRead(item.readKey); router.push(item.href) }} style={{ position: 'relative', cursor: 'pointer' }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.15s' }}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.12)'}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.06)'}
            >
              {item.n}
            </div>
            {!!item.badge && <div style={{ position: 'absolute', top: -5, right: -5, background: RED, borderRadius: '50%', width: 17, height: 17, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, pointerEvents: 'none' }}>{item.badge}</div>}
          </div>
        ))}
        {/* Avatar */}
        <div style={{ position: 'relative' }}>
          <div onClick={() => setDropOpen(v => !v)} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <img src={userAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=C8202A&color=fff`} alt={userName} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${GOLD}` }} />
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.2 }}>{userName}</div>
              <div onClick={e => { e.stopPropagation(); router.push('/profile') }} style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}
                onMouseEnter={e => (e.currentTarget.style.color = RED)}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
              >View Profile</div>
            </div>
            <ChevronRight size={12} color="rgba(255,255,255,0.35)" style={{ transform: 'rotate(90deg)' }} />
          </div>
          {dropOpen && (
            <div style={{ position: 'absolute', top: 46, right: 0, width: 180, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, overflow: 'hidden', zIndex: 200, boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}>
              {dropdownLinks.map(({ label, href }) => (
                <div key={label} onClick={() => router.push(href)} style={{ padding: '10px 16px', fontSize: 15, cursor: 'pointer', color: label === 'Logout' ? '#ff6b6b' : '#fff', borderTop: label === 'Logout' ? '1px solid rgba(255,255,255,0.07)' : 'none' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >{label}</div>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* ── BODY ── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* ── SIDEBAR — now collapsible ── */}
        <aside style={{ width: SB_W, flexShrink: 0, background: BG2, borderRight: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', overflowY: 'auto', overflowX: 'hidden', transition: 'width 0.2s ease' }}>
          {/* Toggle */}
          <div style={{ display: 'flex', justifyContent: sidebarOpen ? 'flex-end' : 'center', padding: sidebarOpen ? '10px 12px 0' : '10px 0 0', flexShrink: 0 }}>
            <button onClick={() => setSidebarOpen((v: boolean) => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', width: 30, height: 30, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            >{sidebarOpen ? <ChevronLeft size={16} /> : <Menu size={16} />}</button>
          </div>
          {/* User card — only when expanded */}
          {sidebarOpen && (
            <div style={{ padding: '16px 14px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <img src={userAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=C8202A&color=fff`} alt="" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${GOLD}` }} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{userName}</div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW }}>Aspirant</div>
                <div style={{ fontSize: 14, color: RED, cursor: 'pointer' }} onClick={() => router.push('/profile')}>View Profile</div>
              </div>
            </div>
          )}
          <nav style={{ flex: 1, padding: '6px 0' }}>
            {sidebarItems.map(({ icon: Icon, label, active, href, danger }) => {
              const readKey = label === 'Messages' ? 'messages' : label === 'Notifications' ? 'notifications' : null
              const badge = readKey === 'messages' ? counts.messages : readKey === 'notifications' ? counts.notifications : undefined
              return (
              <div key={label} title={!sidebarOpen ? label : undefined} onClick={() => { if (readKey) markAllRead(readKey); router.push(href) }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'space-between' : 'center', padding: sidebarOpen ? '8px 14px' : '10px 0', cursor: 'pointer', background: active ? 'rgba(200,32,42,0.1)' : 'transparent', borderLeft: sidebarOpen && active ? `3px solid ${RED}` : '3px solid transparent' }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: sidebarOpen ? 10 : 0 }}>
                  <Icon size={15} color={active ? RED : danger ? '#ff6b6b' : 'rgba(255,255,255,0.45)'} strokeWidth={active ? 2.5 : 1.8} />
                  {sidebarOpen && <span style={{ fontSize: 14, color: active ? '#fff' : danger ? '#ff6b6b' : 'rgba(255,255,255,0.65)', fontWeight: active ? 700 : 400 }}>{label}</span>}
                </div>
                {sidebarOpen && !!badge && <div style={{ background: RED, color: '#fff', borderRadius: 12, fontSize: 14, fontWeight: 700, padding: '1px 6px', minWidth: 18, textAlign: 'center' as const }}>{badge}</div>}
              </div>
              )
            })}
          </nav>
          {/* Go Premium */}
          {sidebarOpen && (
            <div style={{ margin: '10px 10px 14px', borderRadius: 10, background: 'linear-gradient(135deg, #1a0507, #2a0b0e)', border: '1px solid rgba(200,32,42,0.25)', padding: '14px 12px', textAlign: 'center' as const, flexShrink: 0 }}>
              <div style={{ fontSize: 20, marginBottom: 5 }}>⭐</div>
              <div style={{ fontSize: 16, fontFamily: BARLOW, fontWeight: 700, color: '#fff', marginBottom: 4 }}>Go Premium</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 12, lineHeight: 1.55 }}>Unlock more opportunities and advance your career.</div>
              <button onClick={() => router.push('/dashboard/subscription')} style={{ width: '100%', background: RED, color: '#fff', border: 'none', borderRadius: 6, padding: '8px 0', fontSize: 14, fontWeight: 700, fontFamily: BARLOW, cursor: 'pointer' }}>Upgrade Now</button>
            </div>
          )}
        </aside>

        {/* ── MAIN CONTENT ── */}
        <div style={{ flex: 1, minWidth: 0, overflowY: 'auto', overflowX: 'hidden', display: 'flex' }}>

          {/* ── SETTINGS LEFT NAV ── */}
          <div style={{ width: 220, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.07)', padding: '24px 12px' }}>
            <div style={{ fontSize: 14, fontFamily: BARLOW, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: 2, textTransform: 'uppercase' as const, marginBottom: 10, paddingLeft: 8 }}>Settings</div>
            {settingsNav.map(({ key, icon: Icon, label }) => (
              <div key={key} onClick={() => setActiveTab(key)}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 10px', borderRadius: 8, cursor: 'pointer', marginBottom: 2, background: activeTab === key ? 'rgba(200,32,42,0.1)' : 'transparent', borderLeft: activeTab === key ? `3px solid ${RED}` : '3px solid transparent', transition: 'all 0.15s' }}
                onMouseEnter={e => { if (activeTab !== key) e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
                onMouseLeave={e => { if (activeTab !== key) e.currentTarget.style.background = 'transparent' }}
              >
                <Icon size={16} color={activeTab === key ? RED : 'rgba(255,255,255,0.45)'} strokeWidth={1.8} />
                <span style={{ fontSize: 15, fontFamily: BARLOW, color: activeTab === key ? '#fff' : 'rgba(255,255,255,0.6)', fontWeight: activeTab === key ? 700 : 400 }}>{label}</span>
              </div>
            ))}
          </div>

          {/* ── SETTINGS CONTENT ── */}
          <div style={{ flex: 1, minWidth: 0, padding: '24px 28px 60px' }}>

            {/* Page header */}
            <div style={{ marginBottom: 24 }}>
              <h1 style={{ fontFamily: BEBAS, fontSize: 32, letterSpacing: 2, color: '#fff', margin: '0 0 4px' }}>Settings</h1>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, margin: 0 }}>Manage your account, preferences and privacy settings.</p>
            </div>

            {/* ══ PROFILE & ACCOUNT ══ */}
            {activeTab === 'profile' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '24px' }}>
                  <div style={{ fontSize: 19, fontFamily: BARLOW, fontWeight: 700, color: '#fff', marginBottom: 4 }}>Profile & Account</div>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, marginBottom: 20 }}>Manage your personal information and public profile.</div>
                  <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start' }}>
                    {/* Avatar */}
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      <img src={userAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=C8202A&color=fff&size=200`} alt="" style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', border: `3px solid ${GOLD}`, display: 'block' }} />
                      <button style={{ position: 'absolute', bottom: 2, right: 2, width: 28, height: 28, borderRadius: '50%', background: BG3, border: `2px solid ${BG2}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <Camera size={13} color="rgba(255,255,255,0.7)" />
                      </button>
                      <div style={{ marginTop: 10, textAlign: 'center' as const }}>
                        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, marginBottom: 4 }}>Profile visibility</div>
                        <StatusBadge label="Public" color={GREEN} />
                        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', fontFamily: BARLOW, marginTop: 6, lineHeight: 1.4 }}>Your profile is visible to<br/>agencies and casting directors.</div>
                      </div>
                    </div>
                    {/* Fields */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {[
                        { label: 'Full Name',     value: profile.fullName,  key: 'fullName'  },
                        { label: 'Stage Name',    value: profile.stageName, key: 'stageName' },
                        { label: 'Email Address', value: profile.email,     key: 'email'     },
                        { label: 'Mobile Number', value: profile.mobile,    key: 'mobile'    },
                        { label: 'Location',      value: profile.location,  key: 'location'  },
                      ].map(f => (
                        <SettingRow key={f.key} label={f.label} value={f.value}
                          onEdit={() => setEditField({ label: f.label, value: f.value, key: f.key })}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ══ ACCOUNT & SECURITY ══ */}
            {activeTab === 'security' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                {/* ── CHANGE PASSWORD MODAL ── */}
                {secModal === 'password' && (
                  <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, backdropFilter: 'blur(4px)' }}>
                    <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '32px', maxWidth: 440, width: '100%', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, #3B82F6, transparent)', borderRadius: '16px 16px 0 0' }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
                        <div style={{ fontFamily: BEBAS, fontSize: 24, letterSpacing: 1.5, color: '#fff' }}>Change Password</div>
                        <button onClick={() => { setSecModal(null); setPwForm({ current: '', newPw: '', confirm: '' }); setPwError(''); setPwSuccess(false) }} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 20 }}>✕</button>
                      </div>
                      {pwSuccess ? (
                        <div style={{ textAlign: 'center', padding: '24px 0' }}>
                          <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
                          <div style={{ fontSize: 19, fontFamily: BARLOW, fontWeight: 700, color: '#fff', marginBottom: 6 }}>Password Updated!</div>
                          <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', fontFamily: BARLOW }}>Your password has been changed successfully.</div>
                          <button onClick={() => { setSecModal(null); setPwSuccess(false); setPwForm({ current: '', newPw: '', confirm: '' }) }} style={{ marginTop: 20, background: RED, border: 'none', borderRadius: 8, padding: '10px 24px', color: '#fff', fontSize: 15, fontFamily: BARLOW, fontWeight: 700, cursor: 'pointer' }}>Done</button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 14 }}>
                          {[
                            { label: 'Current Password', key: 'current', placeholder: 'Enter current password' },
                            { label: 'New Password',     key: 'newPw',   placeholder: 'At least 8 characters' },
                            { label: 'Confirm Password', key: 'confirm', placeholder: 'Re-enter new password' },
                          ].map(({ label, key, placeholder }) => (
                            <div key={key}>
                              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, letterSpacing: 1, textTransform: 'uppercase' as const, marginBottom: 6 }}>{label}</div>
                              <input type="password" placeholder={placeholder} value={pwForm[key as keyof typeof pwForm]}
                                onChange={e => { setPwForm(p => ({ ...p, [key]: e.target.value })); setPwError('') }}
                                style={{ width: '100%', background: BG3, border: `1px solid ${pwError && key !== 'current' ? 'rgba(200,32,42,0.5)' : 'rgba(255,255,255,0.1)'}`, borderRadius: 8, padding: '11px 14px', color: '#fff', fontSize: 15, fontFamily: BARLOW, outline: 'none', boxSizing: 'border-box' as const }} />
                            </div>
                          ))}
                          {pwError && <div style={{ fontSize: 14, color: RED, fontFamily: BARLOW }}>{pwError}</div>}
                          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', fontFamily: BARLOW, lineHeight: 1.5 }}>
                            Password must be at least 8 characters and include a number and special character.
                          </div>
                          <div style={{ display: 'flex', gap: 12 }}>
                            <button onClick={() => { setSecModal(null); setPwForm({ current: '', newPw: '', confirm: '' }); setPwError('') }} style={{ flex: 1, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '12px', fontSize: 16, fontFamily: BARLOW, fontWeight: 700, color: '#fff', cursor: 'pointer' }}>Cancel</button>
                            <button onClick={() => {
                              if (!pwForm.current) { setPwError('Please enter your current password'); return }
                              if (pwForm.newPw.length < 8) { setPwError('New password must be at least 8 characters'); return }
                              if (pwForm.newPw !== pwForm.confirm) { setPwError('Passwords do not match'); return }
                              setPwSuccess(true)
                            }} style={{ flex: 1, background: '#3B82F6', border: 'none', borderRadius: 8, padding: '12px', fontSize: 16, fontFamily: BARLOW, fontWeight: 700, color: '#fff', cursor: 'pointer' }}>Update Password</button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ── 2FA MODAL ── */}
                {secModal === '2fa' && (
                  <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, backdropFilter: 'blur(4px)' }}>
                    <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '32px', maxWidth: 440, width: '100%', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${twoFA ? RED : GREEN}, transparent)`, borderRadius: '16px 16px 0 0' }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
                        <div style={{ fontFamily: BEBAS, fontSize: 24, letterSpacing: 1.5, color: '#fff' }}>Two-Factor Authentication</div>
                        <button onClick={() => setSecModal(null)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 20 }}>✕</button>
                      </div>
                      <div style={{ background: BG3, borderRadius: 10, padding: '16px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 10, background: twoFA ? 'rgba(34,197,94,0.1)' : 'rgba(200,32,42,0.1)', border: `1px solid ${twoFA ? 'rgba(34,197,94,0.25)' : 'rgba(200,32,42,0.25)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                          {twoFA ? '🔒' : '🔓'}
                        </div>
                        <div>
                          <div style={{ fontSize: 17, fontFamily: BARLOW, fontWeight: 700, color: '#fff', marginBottom: 3 }}>2FA is currently <span style={{ color: twoFA ? GREEN : RED }}>{twoFA ? 'Enabled' : 'Disabled'}</span></div>
                          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, lineHeight: 1.5 }}>{twoFA ? 'Your account is protected with an additional layer of security.' : 'Enable 2FA to add an extra layer of protection to your account.'}</div>
                        </div>
                      </div>
                      {twoFA ? (
                        <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', fontFamily: BARLOW, lineHeight: 1.65, marginBottom: 20 }}>
                          Disabling 2FA will make your account less secure. You'll only need your password to log in.
                        </div>
                      ) : (
                        <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', fontFamily: BARLOW, lineHeight: 1.65, marginBottom: 20 }}>
                          When enabled, you'll be asked for a verification code from your authenticator app each time you log in.
                        </div>
                      )}
                      <div style={{ display: 'flex', gap: 12 }}>
                        <button onClick={() => setSecModal(null)} style={{ flex: 1, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '12px', fontSize: 16, fontFamily: BARLOW, fontWeight: 700, color: '#fff', cursor: 'pointer' }}>Cancel</button>
                        <button onClick={() => { setTwoFA(v => !v); setSecModal(null) }}
                          style={{ flex: 1, background: twoFA ? RED : GREEN, border: 'none', borderRadius: 8, padding: '12px', fontSize: 16, fontFamily: BARLOW, fontWeight: 700, color: twoFA ? '#fff' : '#000', cursor: 'pointer' }}>
                          {twoFA ? 'Disable 2FA' : 'Enable 2FA'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── LOGIN SESSIONS MODAL ── */}
                {secModal === 'sessions' && (
                  <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, backdropFilter: 'blur(4px)' }}>
                    <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '32px', maxWidth: 520, width: '100%', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, #8B5CF6, transparent)', borderRadius: '16px 16px 0 0' }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
                        <div style={{ fontFamily: BEBAS, fontSize: 24, letterSpacing: 1.5, color: '#fff' }}>Login Sessions</div>
                        <button onClick={() => setSecModal(null)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 20 }}>✕</button>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 12, marginBottom: 20 }}>
                        {[
                          { device: 'Chrome on Windows', location: 'Mumbai, India', time: 'Active now', icon: '💻', current: true },
                          { device: 'Safari on iPhone',  location: 'Mumbai, India', time: '2 hours ago', icon: '📱', current: false },
                          { device: 'Chrome on Android', location: 'Pune, India',   time: 'Yesterday, 4:30 PM', icon: '📱', current: false },
                        ].map((s, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, background: BG3, borderRadius: 10, padding: '14px 16px', border: s.current ? `1px solid rgba(34,197,94,0.2)` : '1px solid rgba(255,255,255,0.06)' }}>
                            <div style={{ fontSize: 24, flexShrink: 0 }}>{s.icon}</div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                                <span style={{ fontSize: 16, fontFamily: BARLOW, fontWeight: 700, color: '#fff' }}>{s.device}</span>
                                {s.current && <span style={{ fontSize: 14, fontFamily: BARLOW, fontWeight: 700, color: GREEN, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 20, padding: '1px 8px' }}>Current</span>}
                              </div>
                              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW }}>{s.location} · {s.time}</div>
                            </div>
                            {!s.current && (
                              <button style={{ background: 'none', border: '1px solid rgba(200,32,42,0.3)', borderRadius: 6, padding: '5px 12px', color: RED, fontSize: 14, fontFamily: BARLOW, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' as const }}>Sign Out</button>
                            )}
                          </div>
                        ))}
                      </div>
                      <button style={{ width: '100%', background: 'rgba(200,32,42,0.08)', border: '1px solid rgba(200,32,42,0.2)', borderRadius: 8, padding: '12px', color: RED, fontSize: 16, fontFamily: BARLOW, fontWeight: 700, cursor: 'pointer' }}>
                        Sign Out All Other Sessions
                      </button>
                    </div>
                  </div>
                )}

                {/* ── SECURITY ACTIVITY MODAL ── */}
                {secModal === 'activity' && (
                  <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, backdropFilter: 'blur(4px)' }}>
                    <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '32px', maxWidth: 540, width: '100%', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${RED}, transparent)`, borderRadius: '16px 16px 0 0' }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
                        <div style={{ fontFamily: BEBAS, fontSize: 24, letterSpacing: 1.5, color: '#fff' }}>Security Activity</div>
                        <button onClick={() => setSecModal(null)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 20 }}>✕</button>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 0 }}>
                        {[
                          { icon: '🔐', label: 'Password changed',          detail: 'Chrome on Windows · Mumbai', time: '3 days ago',   color: GOLD  },
                          { icon: '✅', label: '2FA enabled',               detail: 'Chrome on Windows · Mumbai', time: '2 weeks ago',  color: GREEN },
                          { icon: '🔑', label: 'Login from new device',     detail: 'Safari on iPhone · Mumbai',  time: '2 weeks ago',  color: BLUE  },
                          { icon: '📧', label: 'Email address verified',    detail: 'Account setup',              time: '1 month ago',  color: GREEN },
                          { icon: '⚠️', label: 'Failed login attempt',      detail: 'Unknown device · Delhi',    time: '1 month ago',  color: RED   },
                          { icon: '👤', label: 'Account created',           detail: 'SilverScreens signup',       time: '2 months ago', color: 'rgba(255,255,255,0.4)' },
                        ].map((a, i, arr) => (
                          <div key={i} style={{ display: 'flex', gap: 14, padding: '14px 0', borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                            <div style={{ width: 36, height: 36, borderRadius: 8, background: BG3, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0 }}>{a.icon}</div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 16, fontFamily: BARLOW, fontWeight: 700, color: '#fff', marginBottom: 3 }}>{a.label}</div>
                              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW }}>{a.detail}</div>
                            </div>
                            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', fontFamily: BARLOW, whiteSpace: 'nowrap' as const, textAlign: 'right' as const }}>{a.time}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── SECURITY MAIN CARD ── */}
                <SectionCard icon={Shield} iconBg="rgba(59,130,246,0.2)" title="Account & Security" desc="Secure your account and manage login settings.">

                  {/* Change Password */}
                  <div onClick={() => setSecModal('password')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }}
                    onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.opacity = '0.75'}
                    onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.opacity = '1'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>🔑</div>
                      <div>
                        <div style={{ fontSize: 16, fontFamily: BARLOW, fontWeight: 600, color: '#fff' }}>Change Password</div>
                        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', fontFamily: BARLOW }}>Last changed 3 days ago</div>
                      </div>
                    </div>
                    <ChevronRight size={16} color="rgba(255,255,255,0.3)" />
                  </div>

                  {/* 2FA */}
                  <div onClick={() => setSecModal('2fa')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }}
                    onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.opacity = '0.75'}
                    onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.opacity = '1'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: twoFA ? 'rgba(34,197,94,0.1)' : 'rgba(200,32,42,0.1)', border: `1px solid ${twoFA ? 'rgba(34,197,94,0.2)' : 'rgba(200,32,42,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>{twoFA ? '🔒' : '🔓'}</div>
                      <div>
                        <div style={{ fontSize: 16, fontFamily: BARLOW, fontWeight: 600, color: '#fff' }}>Two-Factor Authentication</div>
                        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', fontFamily: BARLOW }}>Adds an extra layer of security to your account</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <StatusBadge label={twoFA ? 'Enabled' : 'Disabled'} color={twoFA ? GREEN : RED} />
                      <ChevronRight size={16} color="rgba(255,255,255,0.3)" />
                    </div>
                  </div>

                  {/* Login Sessions */}
                  <div onClick={() => setSecModal('sessions')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }}
                    onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.opacity = '0.75'}
                    onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.opacity = '1'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>💻</div>
                      <div>
                        <div style={{ fontSize: 16, fontFamily: BARLOW, fontWeight: 600, color: '#fff' }}>Login Sessions</div>
                        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', fontFamily: BARLOW }}>3 active sessions — manage connected devices</div>
                      </div>
                    </div>
                    <ChevronRight size={16} color="rgba(255,255,255,0.3)" />
                  </div>

                  {/* Security Activity */}
                  <div onClick={() => setSecModal('activity')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', cursor: 'pointer' }}
                    onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.opacity = '0.75'}
                    onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.opacity = '1'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(200,32,42,0.1)', border: '1px solid rgba(200,32,42,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>🛡️</div>
                      <div>
                        <div style={{ fontSize: 16, fontFamily: BARLOW, fontWeight: 600, color: RED }}>Security Activity</div>
                        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', fontFamily: BARLOW }}>Recent account activity and alerts</div>
                      </div>
                    </div>
                    <ExternalLink size={15} color={RED} />
                  </div>

                </SectionCard>
              </div>
            )}

            {/* ══ NOTIFICATIONS ══ */}
            {activeTab === 'notifications' && (
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16 }}>

                {/* Master toggles */}
                <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(212,166,74,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Bell size={18} color={GOLD} strokeWidth={1.8} />
                    </div>
                    <div>
                      <div style={{ fontSize: 17, fontFamily: BARLOW, fontWeight: 700, color: '#fff' }}>Notifications</div>
                      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW }}>Choose how and when you want to be notified.</div>
                    </div>
                  </div>
                  {[
                    { key: 'push',  icon: '📱', label: 'Push Notifications',  desc: 'Alerts on your phone and browser' },
                    { key: 'email', icon: '📧', label: 'Email Notifications', desc: `Sent to ${userEmail}`  },
                    { key: 'sms',   icon: '💬', label: 'SMS Notifications',   desc: 'Sent to your mobile number'          },
                  ].map(({ key, icon, label, desc }, i, arr) => (
                    <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 34, height: 34, borderRadius: 8, background: notifs[key as keyof typeof notifs] ? 'rgba(212,166,74,0.1)' : 'rgba(255,255,255,0.04)', border: `1px solid ${notifs[key as keyof typeof notifs] ? 'rgba(212,166,74,0.25)' : 'rgba(255,255,255,0.07)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, transition: 'all 0.2s' }}>{icon}</div>
                        <div>
                          <div style={{ fontSize: 16, fontFamily: BARLOW, fontWeight: 600, color: '#fff' }}>{label}</div>
                          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', fontFamily: BARLOW }}>{desc}</div>
                        </div>
                      </div>
                      <Toggle on={!!notifs[key as keyof typeof notifs]} onChange={() => toggleNotif(key)} />
                    </div>
                  ))}
                </div>

                {/* Push granular — only when push is on */}
                {notifs.push && (
                  <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '20px' }}>
                    <div style={{ fontSize: 16, fontFamily: BARLOW, fontWeight: 700, color: '#fff', marginBottom: 4 }}>📱 Push Notification Preferences</div>
                    <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', fontFamily: BARLOW, marginBottom: 16 }}>Choose which push notifications you receive.</div>
                    {[
                      { key: 'pushCasting',   label: 'New Casting Calls',      desc: 'When new roles matching your profile are posted' },
                      { key: 'pushCallback',  label: 'Callbacks & Shortlists', desc: 'When an agency shortlists or callbacks you'      },
                      { key: 'pushMessages',  label: 'New Messages',           desc: 'When you receive a message from a studio'        },
                      { key: 'pushReminders', label: 'Audition Reminders',     desc: '24 hours before your upcoming auditions'         },
                      { key: 'pushPromotions',label: 'Promotions & Offers',    desc: 'Platform updates, offers and announcements'      },
                    ].map(({ key, label, desc }, i, arr) => (
                      <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                        <div>
                          <div style={{ fontSize: 15, fontFamily: BARLOW, fontWeight: 600, color: notifs[key as keyof typeof notifs] ? '#fff' : 'rgba(255,255,255,0.45)' }}>{label}</div>
                          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', fontFamily: BARLOW }}>{desc}</div>
                        </div>
                        <Toggle on={!!notifs[key as keyof typeof notifs]} onChange={() => toggleNotif(key)} />
                      </div>
                    ))}
                  </div>
                )}

                {/* Email granular — only when email is on */}
                {notifs.email && (
                  <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '20px' }}>
                    <div style={{ fontSize: 16, fontFamily: BARLOW, fontWeight: 700, color: '#fff', marginBottom: 4 }}>📧 Email Notification Preferences</div>
                    <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', fontFamily: BARLOW, marginBottom: 16 }}>Choose which emails you receive.</div>
                    {[
                      { key: 'emailCasting',  label: 'New Casting Calls',      desc: 'Relevant casting calls matching your profile'    },
                      { key: 'emailCallback', label: 'Callbacks & Shortlists', desc: 'Agency callbacks and shortlist notifications'     },
                      { key: 'emailMessages', label: 'Message Digest',         desc: 'Daily digest of unread messages'                 },
                      { key: 'emailReminders',label: 'Audition Reminders',     desc: 'Email reminders for upcoming auditions'          },
                      { key: 'emailWeekly',   label: 'Weekly Summary',         desc: 'Your weekly activity and opportunity summary'    },
                    ].map(({ key, label, desc }, i, arr) => (
                      <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                        <div>
                          <div style={{ fontSize: 15, fontFamily: BARLOW, fontWeight: 600, color: notifs[key as keyof typeof notifs] ? '#fff' : 'rgba(255,255,255,0.45)' }}>{label}</div>
                          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', fontFamily: BARLOW }}>{desc}</div>
                        </div>
                        <Toggle on={!!notifs[key as keyof typeof notifs]} onChange={() => toggleNotif(key)} />
                      </div>
                    ))}
                  </div>
                )}

                {/* SMS granular — only when sms is on */}
                {notifs.sms && (
                  <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '20px' }}>
                    <div style={{ fontSize: 16, fontFamily: BARLOW, fontWeight: 700, color: '#fff', marginBottom: 4 }}>💬 SMS Notification Preferences</div>
                    <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', fontFamily: BARLOW, marginBottom: 16 }}>Choose which SMS alerts you receive.</div>
                    {[
                      { key: 'smsCasting',   label: 'Urgent Casting Calls', desc: 'Only urgent or expiring casting calls'       },
                      { key: 'smsCallback',  label: 'Callbacks',            desc: 'When an agency calls you back via SMS'      },
                      { key: 'smsReminders', label: 'Audition Reminders',   desc: 'SMS reminder 2 hours before auditions'      },
                    ].map(({ key, label, desc }, i, arr) => (
                      <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                        <div>
                          <div style={{ fontSize: 15, fontFamily: BARLOW, fontWeight: 600, color: notifs[key as keyof typeof notifs] ? '#fff' : 'rgba(255,255,255,0.45)' }}>{label}</div>
                          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', fontFamily: BARLOW }}>{desc}</div>
                        </div>
                        <Toggle on={!!notifs[key as keyof typeof notifs]} onChange={() => toggleNotif(key)} />
                      </div>
                    ))}
                  </div>
                )}

                {/* Info note */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: 'rgba(212,166,74,0.06)', border: '1px solid rgba(212,166,74,0.15)', borderRadius: 10, padding: '14px 16px' }}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>ℹ️</span>
                  <span style={{ fontSize: 14, fontFamily: BARLOW, color: 'rgba(255,255,255,0.45)', lineHeight: 1.65 }}>
                    Turning off a channel (Push / Email / SMS) disables all notifications for that channel. Individual preferences are saved and restored when you re-enable the channel.
                  </span>
                </div>

              </div>
            )}

            {/* ══ EMAIL PREFERENCES ══ */}
            {activeTab === 'email' && (
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16 }}>

                {/* What you receive */}
                <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Mail size={18} color="#818cf8" strokeWidth={1.8} />
                    </div>
                    <div>
                      <div style={{ fontSize: 17, fontFamily: BARLOW, fontWeight: 700, color: '#fff' }}>Email Preferences</div>
                      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW }}>Manage the emails you receive from SilverScreens. Sent to {userEmail}.</div>
                    </div>
                  </div>
                  {[
                    { key: 'castingOpp', icon: '🎬', label: 'Casting Opportunities', desc: 'New roles matching your profile and saved searches' },
                    { key: 'appUpdates', icon: '📋', label: 'Application Updates',   desc: 'Status changes on applications you have submitted' },
                    { key: 'marketing',  icon: '📣', label: 'Marketing & Promotions',desc: 'Platform offers, partner deals and feature announcements' },
                    { key: 'newsletter', icon: '📰', label: 'Newsletter',            desc: 'Monthly roundup of industry news and platform highlights' },
                  ].map(({ key, icon, label, desc }, i, arr) => {
                    const on = emailPrefs[key as keyof typeof emailPrefs]
                    return (
                      <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', opacity: unsubAll ? 0.4 : 1, transition: 'opacity 0.2s' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ width: 34, height: 34, borderRadius: 8, background: on ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.04)', border: `1px solid ${on ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.07)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{icon}</div>
                          <div>
                            <div style={{ fontSize: 16, fontFamily: BARLOW, fontWeight: 600, color: '#fff' }}>{label}</div>
                            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', fontFamily: BARLOW }}>{desc}</div>
                          </div>
                        </div>
                        <Toggle on={on && !unsubAll} onChange={() => !unsubAll && toggleEmailPref(key)} />
                      </div>
                    )
                  })}
                </div>

                {/* Delivery preferences */}
                <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '20px', opacity: unsubAll ? 0.4 : 1, transition: 'opacity 0.2s' }}>
                  <div style={{ fontSize: 16, fontFamily: BARLOW, fontWeight: 700, color: '#fff', marginBottom: 16 }}>Delivery Preferences</div>

                  {/* Frequency */}
                  <div style={{ marginBottom: 18 }}>
                    <div style={{ fontSize: 14, fontFamily: BARLOW, color: 'rgba(255,255,255,0.45)', marginBottom: 8 }}>Email Frequency</div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const }}>
                      {[
                        { key: 'realtime', label: 'Real-time' },
                        { key: 'daily',    label: 'Daily Digest' },
                        { key: 'weekly',   label: 'Weekly Digest' },
                      ].map(({ key, label }) => (
                        <button key={key} disabled={unsubAll} onClick={() => setEmailFrequency(key)} style={{
                          background: emailFrequency === key ? 'rgba(99,102,241,0.15)' : BG3,
                          border: `1px solid ${emailFrequency === key ? '#818cf8' : 'rgba(255,255,255,0.08)'}`,
                          borderRadius: 20, padding: '7px 16px', fontSize: 14, fontFamily: BARLOW,
                          color: emailFrequency === key ? '#fff' : 'rgba(255,255,255,0.5)',
                          cursor: unsubAll ? 'not-allowed' : 'pointer', transition: 'all 0.15s',
                        }}>{label}</button>
                      ))}
                    </div>
                  </div>

                  {/* Format */}
                  <div>
                    <div style={{ fontSize: 14, fontFamily: BARLOW, color: 'rgba(255,255,255,0.45)', marginBottom: 8 }}>Email Format</div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {[
                        { key: 'html', label: 'Rich (HTML)' },
                        { key: 'text', label: 'Plain Text'  },
                      ].map(({ key, label }) => (
                        <button key={key} disabled={unsubAll} onClick={() => setEmailFormat(key)} style={{
                          background: emailFormat === key ? 'rgba(99,102,241,0.15)' : BG3,
                          border: `1px solid ${emailFormat === key ? '#818cf8' : 'rgba(255,255,255,0.08)'}`,
                          borderRadius: 20, padding: '7px 16px', fontSize: 14, fontFamily: BARLOW,
                          color: emailFormat === key ? '#fff' : 'rgba(255,255,255,0.5)',
                          cursor: unsubAll ? 'not-allowed' : 'pointer', transition: 'all 0.15s',
                        }}>{label}</button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Unsubscribe from all */}
                <div style={{ background: unsubAll ? 'rgba(200,32,42,0.08)' : BG2, border: `1px solid ${unsubAll ? 'rgba(200,32,42,0.25)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 12, padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, transition: 'all 0.2s' }}>
                  <div>
                    <div style={{ fontSize: 16, fontFamily: BARLOW, fontWeight: 700, color: unsubAll ? RED : '#fff', marginBottom: 3 }}>Unsubscribe from all emails</div>
                    <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, lineHeight: 1.5, maxWidth: 420 }}>
                      {unsubAll ? 'You will not receive any emails from SilverScreens, including casting opportunities.' : 'Stop all email communication from SilverScreens. You can resubscribe anytime.'}
                    </div>
                  </div>
                  <Toggle on={unsubAll} onChange={() => setUnsubAll(v => !v)} />
                </div>

              </div>
            )}

            {/* ══ OVERVIEW (all panels) ══ */}
            {activeTab === 'profile' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginTop: 20 }}>
                {/* Account & Security */}
                <div onClick={() => setActiveTab('security')} style={{ cursor: 'pointer' }}>
                  <SectionCard icon={Shield} iconBg="rgba(59,130,246,0.2)" title="Account & Security" desc="Secure your account and manage login settings.">
                    <SettingRow label="Change Password" chevron />
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <span style={{ fontSize: 16, fontFamily: BARLOW, color: 'rgba(255,255,255,0.5)' }}>Two-Factor Authentication</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <StatusBadge label="Enabled" color={GREEN} />
                        <ChevronRight size={14} color="rgba(255,255,255,0.3)" />
                      </div>
                    </div>
                    <SettingRow label="Login Sessions" chevron />
                    <div style={{ paddingTop: 10 }}>
                      <span style={{ fontSize: 14, color: RED, fontFamily: BARLOW, fontWeight: 700, cursor: 'pointer' }}>Security Activity ↗</span>
                    </div>
                  </SectionCard>
                </div>

                {/* Notifications */}
                <SectionCard icon={Bell} iconBg="rgba(212,166,74,0.2)" title="Notifications" desc="Choose how and when you want to be notified.">
                  {['Push Notifications', 'Email Notifications', 'SMS Notifications'].map(l => (
                    <div key={l} onClick={() => setActiveTab('notifications')} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }}>
                      <span style={{ fontSize: 15, fontFamily: BARLOW, color: 'rgba(255,255,255,0.5)' }}>{l}</span>
                      <ChevronRight size={14} color="rgba(255,255,255,0.3)" />
                    </div>
                  ))}
                </SectionCard>

                {/* Email Prefs */}
                <SectionCard icon={Mail} iconBg="rgba(99,102,241,0.2)" title="Email Preferences" desc="Manage the emails you receive from SilverScreens.">
                  {[
                    { l: 'Casting Opportunities', on: true  },
                    { l: 'Application Updates',   on: true  },
                    { l: 'Marketing & Promotions',on: false },
                    { l: 'Newsletter',             on: true  },
                  ].map(({ l, on }) => (
                    <div key={l} onClick={() => setActiveTab('email')} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }}>
                      <span style={{ fontSize: 15, fontFamily: BARLOW, color: 'rgba(255,255,255,0.5)' }}>{l}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 14, color: on ? GREEN : 'rgba(255,255,255,0.3)', fontWeight: 700, fontFamily: BARLOW }}>{on ? 'On' : 'Off'}</span>
                        <ChevronRight size={14} color="rgba(255,255,255,0.3)" />
                      </div>
                    </div>
                  ))}
                </SectionCard>

                {/* Privacy */}
                <SectionCard icon={Eye} iconBg="rgba(34,197,94,0.2)" title="Privacy" desc="Control your visibility and data privacy.">
                  {[
                    { l: 'Profile Visibility',      v: 'Public',        c: GREEN },
                    { l: 'Who Can Message You',     v: 'Everyone',      c: GREEN },
                    { l: 'Show Contact Information',v: 'Agencies Only', c: GOLD  },
                    { l: 'Data & Activity',         v: '',              c: ''    },
                  ].map(({ l, v, c }) => (
                    <div key={l} onClick={() => setActiveTab('privacy')} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }}>
                      <span style={{ fontSize: 15, fontFamily: BARLOW, color: 'rgba(255,255,255,0.5)' }}>{l}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {v && <span style={{ fontSize: 14, color: c, fontWeight: 700, fontFamily: BARLOW }}>{v}</span>}
                        <ChevronRight size={14} color="rgba(255,255,255,0.3)" />
                      </div>
                    </div>
                  ))}
                </SectionCard>

                {/* Preferences */}
                <SectionCard icon={Sliders} iconBg="rgba(245,158,11,0.2)" title="Preferences" desc="Customize your experience on the platform.">
                  {[
                    { l: 'Preferred Roles',     v: '',          c: '' },
                    { l: 'Preferred Locations', v: '',          c: '' },
                    { l: 'Availability',         v: 'Available', c: GREEN },
                    { l: 'Language',             v: 'English',   c: GREEN },
                  ].map(({ l, v, c }) => (
                    <div key={l} onClick={() => setActiveTab('preferences')} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }}>
                      <span style={{ fontSize: 15, fontFamily: BARLOW, color: 'rgba(255,255,255,0.5)' }}>{l}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {v && <span style={{ fontSize: 14, color: c, fontWeight: 700, fontFamily: BARLOW }}>{v}</span>}
                        <ChevronRight size={14} color="rgba(255,255,255,0.3)" />
                      </div>
                    </div>
                  ))}
                </SectionCard>

                {/* Blocked Agencies */}
                <div onClick={() => setActiveTab('blocked')} style={{ cursor: 'pointer' }}>
                  <SectionCard icon={UserX} iconBg="rgba(200,32,42,0.2)" title="Blocked Agencies" desc="Manage agencies you have blocked.">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 0' }}>
                      <span style={{ fontSize: 16, fontFamily: BARLOW, color: 'rgba(255,255,255,0.5)' }}>Blocked Agencies</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 16, color: '#fff', fontWeight: 700, fontFamily: BARLOW }}>{blockedAgencies.length}</span>
                        <ChevronRight size={14} color="rgba(255,255,255,0.3)" />
                      </div>
                    </div>
                  </SectionCard>
                </div>
              </div>
            )}

            {/* ══ SUBSCRIPTION & BILLING ══ */}
            {activeTab === 'profile' && (
              <div style={{ marginTop: 16 }}>
                <div onClick={() => setActiveTab('billing')} style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '20px', cursor: 'pointer' }}
                  onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.opacity = '0.85'} onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.opacity = '1'}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(200,32,42,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Crown size={18} color={RED} />
                    </div>
                    <div>
                      <div style={{ fontSize: 17, fontFamily: BARLOW, fontWeight: 700, color: '#fff' }}>Subscription & Billing</div>
                      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW }}>Manage your plan, billing details and invoices.</div>
                    </div>
                    <ChevronRight size={18} color="rgba(255,255,255,0.3)" style={{ marginLeft: 'auto' }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                    <div>
                      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', fontFamily: BARLOW, marginBottom: 4 }}>Current Plan</div>
                      <div style={{ fontSize: 16, color: GOLD, fontFamily: BARLOW, fontWeight: 700 }}>Star Plan</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', fontFamily: BARLOW, marginBottom: 4 }}>Next Billing Date</div>
                      <div style={{ fontSize: 16, color: '#fff', fontFamily: BARLOW, fontWeight: 600 }}>25 Jun 2025</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', fontFamily: BARLOW, marginBottom: 4 }}>Status</div>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: GREEN }} />
                        <span style={{ fontSize: 16, color: GREEN, fontFamily: BARLOW, fontWeight: 700 }}>Active</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ══ INDIVIDUAL SECTION VIEWS ══ */}
            {activeTab === 'privacy' && (
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16 }}>

                {/* ── PROFILE VISIBILITY MODAL ── */}
                {privacyModal === 'visibility' && (
                  <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, backdropFilter: 'blur(4px)' }}>
                    <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '32px', maxWidth: 460, width: '100%', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, #22C55E, transparent)', borderRadius: '16px 16px 0 0' }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <div style={{ fontFamily: BEBAS, fontSize: 24, letterSpacing: 1.5, color: '#fff' }}>Profile Visibility</div>
                        <button onClick={() => setPrivacyModal(null)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 20 }}>✕</button>
                      </div>
                      <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, marginBottom: 20 }}>Control who can find and view your profile.</div>
                      {[
                        { key: 'Public',   icon: '🌍', desc: 'Anyone on SilverScreens can find and view your profile' },
                        { key: 'Verified Agencies Only', icon: '🏢', desc: 'Only verified agencies and casting directors can view your profile' },
                        { key: 'Private',  icon: '🔒', desc: 'Your profile is hidden from search and discovery' },
                      ].map(opt => (
                        <button key={opt.key} onClick={() => updatePrivacy('profileVisibility', opt.key)} style={{
                          width: '100%', display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left' as const,
                          background: privacy.profileVisibility === opt.key ? 'rgba(34,197,94,0.08)' : BG3,
                          border: `1px solid ${privacy.profileVisibility === opt.key ? 'rgba(34,197,94,0.35)' : 'rgba(255,255,255,0.07)'}`,
                          borderRadius: 10, padding: '14px', marginBottom: 10, cursor: 'pointer', transition: 'all 0.15s',
                        }}>
                          <span style={{ fontSize: 22, flexShrink: 0 }}>{opt.icon}</span>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 16, fontFamily: BARLOW, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{opt.key}</div>
                            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, lineHeight: 1.4 }}>{opt.desc}</div>
                          </div>
                          {privacy.profileVisibility === opt.key && <Check size={18} color={GREEN} strokeWidth={2.5} style={{ flexShrink: 0 }} />}
                        </button>
                      ))}
                      <button onClick={() => setPrivacyModal(null)} style={{ width: '100%', marginTop: 8, background: RED, border: 'none', borderRadius: 8, padding: '12px', fontSize: 16, fontFamily: BARLOW, fontWeight: 700, color: '#fff', cursor: 'pointer' }}>Done</button>
                    </div>
                  </div>
                )}

                {/* ── WHO CAN MESSAGE YOU MODAL ── */}
                {privacyModal === 'message' && (
                  <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, backdropFilter: 'blur(4px)' }}>
                    <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '32px', maxWidth: 460, width: '100%', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, #22C55E, transparent)', borderRadius: '16px 16px 0 0' }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <div style={{ fontFamily: BEBAS, fontSize: 24, letterSpacing: 1.5, color: '#fff' }}>Who Can Message You</div>
                        <button onClick={() => setPrivacyModal(null)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 20 }}>✕</button>
                      </div>
                      <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, marginBottom: 20 }}>Control who can send you direct messages.</div>
                      {[
                        { key: 'Everyone',         icon: '💬', desc: 'Any registered user can message you' },
                        { key: 'Verified Agencies Only', icon: '🏢', desc: 'Only verified agencies and casting directors can message you' },
                        { key: 'No One',           icon: '🚫', desc: 'Disable direct messages entirely' },
                      ].map(opt => (
                        <button key={opt.key} onClick={() => updatePrivacy('whoCanMessage', opt.key)} style={{
                          width: '100%', display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left' as const,
                          background: privacy.whoCanMessage === opt.key ? 'rgba(34,197,94,0.08)' : BG3,
                          border: `1px solid ${privacy.whoCanMessage === opt.key ? 'rgba(34,197,94,0.35)' : 'rgba(255,255,255,0.07)'}`,
                          borderRadius: 10, padding: '14px', marginBottom: 10, cursor: 'pointer', transition: 'all 0.15s',
                        }}>
                          <span style={{ fontSize: 22, flexShrink: 0 }}>{opt.icon}</span>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 16, fontFamily: BARLOW, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{opt.key}</div>
                            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, lineHeight: 1.4 }}>{opt.desc}</div>
                          </div>
                          {privacy.whoCanMessage === opt.key && <Check size={18} color={GREEN} strokeWidth={2.5} style={{ flexShrink: 0 }} />}
                        </button>
                      ))}
                      <button onClick={() => setPrivacyModal(null)} style={{ width: '100%', marginTop: 8, background: RED, border: 'none', borderRadius: 8, padding: '12px', fontSize: 16, fontFamily: BARLOW, fontWeight: 700, color: '#fff', cursor: 'pointer' }}>Done</button>
                    </div>
                  </div>
                )}

                {/* ── SHOW CONTACT INFO MODAL ── */}
                {privacyModal === 'contact' && (
                  <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, backdropFilter: 'blur(4px)' }}>
                    <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '32px', maxWidth: 460, width: '100%', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`, borderRadius: '16px 16px 0 0' }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <div style={{ fontFamily: BEBAS, fontSize: 24, letterSpacing: 1.5, color: '#fff' }}>Show Contact Information</div>
                        <button onClick={() => setPrivacyModal(null)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 20 }}>✕</button>
                      </div>
                      <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, marginBottom: 20 }}>Control who can see your email and phone number on your profile.</div>
                      {[
                        { key: 'Everyone',         icon: '👁️', desc: 'Your contact info is visible to all users' },
                        { key: 'Agencies Only',    icon: '🏢', desc: 'Only verified agencies can see your contact info' },
                        { key: 'Hidden',           icon: '🙈', desc: 'Your contact info is never shown on your profile' },
                      ].map(opt => (
                        <button key={opt.key} onClick={() => updatePrivacy('showContact', opt.key)} style={{
                          width: '100%', display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left' as const,
                          background: privacy.showContact === opt.key ? 'rgba(212,166,74,0.08)' : BG3,
                          border: `1px solid ${privacy.showContact === opt.key ? 'rgba(212,166,74,0.35)' : 'rgba(255,255,255,0.07)'}`,
                          borderRadius: 10, padding: '14px', marginBottom: 10, cursor: 'pointer', transition: 'all 0.15s',
                        }}>
                          <span style={{ fontSize: 22, flexShrink: 0 }}>{opt.icon}</span>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 16, fontFamily: BARLOW, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{opt.key}</div>
                            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, lineHeight: 1.4 }}>{opt.desc}</div>
                          </div>
                          {privacy.showContact === opt.key && <Check size={18} color={GOLD} strokeWidth={2.5} style={{ flexShrink: 0 }} />}
                        </button>
                      ))}
                      <button onClick={() => setPrivacyModal(null)} style={{ width: '100%', marginTop: 8, background: RED, border: 'none', borderRadius: 8, padding: '12px', fontSize: 16, fontFamily: BARLOW, fontWeight: 700, color: '#fff', cursor: 'pointer' }}>Done</button>
                    </div>
                  </div>
                )}

                {/* ── DATA & ACTIVITY MODAL ── */}
                {privacyModal === 'activity' && (
                  <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, backdropFilter: 'blur(4px)' }}>
                    <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '32px', maxWidth: 480, width: '100%', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, #818cf8, transparent)', borderRadius: '16px 16px 0 0' }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <div style={{ fontFamily: BEBAS, fontSize: 24, letterSpacing: 1.5, color: '#fff' }}>Data & Activity</div>
                        <button onClick={() => setPrivacyModal(null)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 20 }}>✕</button>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 10, marginBottom: 20 }}>
                        {[
                          { icon: '📥', label: 'Download Your Data',  desc: 'Get a copy of your profile, applications and activity', action: 'Download' },
                          { icon: '👁️', label: 'Profile View History', desc: 'See who has viewed your profile recently', action: 'View' },
                          { icon: '🗑️', label: 'Delete Account',      desc: 'Permanently delete your account and all associated data', action: 'Delete', danger: true },
                        ].map(item => (
                          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 14, background: item.danger ? 'rgba(200,32,42,0.06)' : BG3, border: `1px solid ${item.danger ? 'rgba(200,32,42,0.2)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 10, padding: '14px' }}>
                            <span style={{ fontSize: 22, flexShrink: 0 }}>{item.icon}</span>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 16, fontFamily: BARLOW, fontWeight: 700, color: item.danger ? RED : '#fff' }}>{item.label}</div>
                              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, lineHeight: 1.4 }}>{item.desc}</div>
                            </div>
                            <button onClick={() => { if (item.danger) { setPrivacyModal(null); setDeleteStep('confirm') } }} style={{ background: 'none', border: `1px solid ${item.danger ? 'rgba(200,32,42,0.4)' : 'rgba(255,255,255,0.15)'}`, borderRadius: 7, padding: '7px 14px', color: item.danger ? RED : '#fff', fontSize: 14, fontFamily: BARLOW, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' as const, flexShrink: 0 }}>{item.action}</button>
                          </div>
                        ))}
                      </div>
                      <button onClick={() => setPrivacyModal(null)} style={{ width: '100%', background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '12px', fontSize: 16, fontFamily: BARLOW, fontWeight: 700, color: '#fff', cursor: 'pointer' }}>Close</button>
                    </div>
                  </div>
                )}

                {/* ── DELETE ACCOUNT · STEP 1: CONFIRM MODAL ── */}
                {deleteStep === 'confirm' && (
                  <div style={{ position: 'fixed', inset: 0, zIndex: 1100, background: 'rgba(0,0,0,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, backdropFilter: 'blur(4px)' }}>
                    <div style={{ background: BG2, border: '1px solid rgba(200,32,42,0.3)', borderRadius: 16, padding: '32px', maxWidth: 460, width: '100%', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${RED}, transparent)`, borderRadius: '16px 16px 0 0' }} />
                      <div style={{ textAlign: 'center' as const, marginBottom: 18 }}>
                        <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(200,32,42,0.1)', border: '1px solid rgba(200,32,42,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, margin: '0 auto 14px' }}>⚠️</div>
                        <div style={{ fontFamily: BEBAS, fontSize: 24, letterSpacing: 1.5, color: '#fff', marginBottom: 6 }}>Are you sure you want to delete this account?</div>
                        <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', fontFamily: BARLOW, lineHeight: 1.6 }}>This action is permanent and cannot be undone.</div>
                      </div>

                      <div style={{ background: 'rgba(200,32,42,0.06)', border: '1px solid rgba(200,32,42,0.15)', borderRadius: 10, padding: '14px 16px', marginBottom: 18 }}>
                        <div style={{ fontSize: 14, fontFamily: BARLOW, fontWeight: 700, color: RED, marginBottom: 8 }}>You will permanently lose:</div>
                        {[
                          'Your profile, photos and showreel',
                          'All applications and audition history',
                          'Messages and conversations with agencies',
                          'Your subscription — no refund for remaining time',
                        ].map(item => (
                          <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 5 }}>
                            <span style={{ color: RED, fontSize: 14, marginTop: 2 }}>✕</span>
                            <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', fontFamily: BARLOW, lineHeight: 1.5 }}>{item}</span>
                          </div>
                        ))}
                      </div>

                      <div style={{ marginBottom: 20 }}>
                        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, marginBottom: 8 }}>Type <strong style={{ color: '#fff' }}>DELETE</strong> to confirm</div>
                        <input
                          value={deleteConfirmText}
                          onChange={e => setDeleteConfirmText(e.target.value)}
                          placeholder="DELETE"
                          style={{ width: '100%', background: BG3, border: '1px solid rgba(200,32,42,0.25)', borderRadius: 8, padding: '11px 14px', color: '#fff', fontSize: 16, fontFamily: BARLOW, outline: 'none', boxSizing: 'border-box' as const, letterSpacing: 2 }}
                        />
                      </div>

                      <div style={{ display: 'flex', gap: 12 }}>
                        <button onClick={() => { setDeleteStep(null); setDeleteConfirmText('') }} style={{ flex: 1, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '12px', fontSize: 16, fontFamily: BARLOW, fontWeight: 700, color: '#fff', cursor: 'pointer' }}>Cancel</button>
                        <button
                          disabled={deleteConfirmText !== 'DELETE'}
                          onClick={() => { setDeleteStep('otp'); setOtpDigits(['', '', '', '', '', '']); setOtpError(''); setOtpResendCooldown(30) }}
                          style={{ flex: 1, background: deleteConfirmText === 'DELETE' ? RED : 'rgba(200,32,42,0.25)', border: 'none', borderRadius: 8, padding: '12px', fontSize: 16, fontFamily: BARLOW, fontWeight: 700, color: deleteConfirmText === 'DELETE' ? '#fff' : 'rgba(255,255,255,0.4)', cursor: deleteConfirmText === 'DELETE' ? 'pointer' : 'not-allowed' }}
                        >Continue</button>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── DELETE ACCOUNT · STEP 2: OTP MODAL ── */}
                {deleteStep === 'otp' && (
                  <div style={{ position: 'fixed', inset: 0, zIndex: 1100, background: 'rgba(0,0,0,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, backdropFilter: 'blur(4px)' }}>
                    <div style={{ background: BG2, border: '1px solid rgba(200,32,42,0.3)', borderRadius: 16, padding: '32px', maxWidth: 440, width: '100%', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${RED}, transparent)`, borderRadius: '16px 16px 0 0' }} />
                      <div style={{ textAlign: 'center' as const, marginBottom: 20 }}>
                        <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(200,32,42,0.1)', border: '1px solid rgba(200,32,42,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, margin: '0 auto 14px' }}>📧</div>
                        <div style={{ fontFamily: BEBAS, fontSize: 22, letterSpacing: 1.5, color: '#fff', marginBottom: 6 }}>Verify It's You</div>
                        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', fontFamily: BARLOW, lineHeight: 1.6 }}>
                          We've sent a 6-digit code to<br/><strong style={{ color: '#fff' }}>{userEmail}</strong>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 14 }}>
                        {otpDigits.map((d, i) => (
                          <input
                            key={i}
                            id={`del-otp-${i}`}
                            value={d}
                            maxLength={1}
                            inputMode="numeric"
                            onChange={e => {
                              const val = e.target.value.replace(/[^0-9]/g, '')
                              const next = [...otpDigits]
                              next[i] = val
                              setOtpDigits(next)
                              setOtpError('')
                              if (val && i < 5) {
                                const nextInput = document.getElementById(`del-otp-${i + 1}`)
                                nextInput?.focus()
                              }
                            }}
                            onKeyDown={e => {
                              if (e.key === 'Backspace' && !otpDigits[i] && i > 0) {
                                const prevInput = document.getElementById(`del-otp-${i - 1}`)
                                prevInput?.focus()
                              }
                            }}
                            style={{ width: 44, height: 52, textAlign: 'center' as const, background: BG3, border: `1px solid ${otpError ? 'rgba(200,32,42,0.6)' : 'rgba(255,255,255,0.12)'}`, borderRadius: 8, color: '#fff', fontSize: 22, fontFamily: BARLOW, fontWeight: 700, outline: 'none' }}
                          />
                        ))}
                      </div>

                      {otpError && <div style={{ textAlign: 'center' as const, fontSize: 14, color: RED, fontFamily: BARLOW, marginBottom: 14 }}>{otpError}</div>}

                      <div style={{ textAlign: 'center' as const, marginBottom: 22 }}>
                        {otpResendCooldown > 0 ? (
                          <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', fontFamily: BARLOW }}>Resend code in {otpResendCooldown}s</span>
                        ) : (
                          <button onClick={() => setOtpResendCooldown(30)} style={{ background: 'none', border: 'none', color: GOLD, fontSize: 14, fontFamily: BARLOW, fontWeight: 700, cursor: 'pointer' }}>Resend Code</button>
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: 12 }}>
                        <button onClick={() => { setDeleteStep('confirm') }} style={{ flex: 1, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '12px', fontSize: 16, fontFamily: BARLOW, fontWeight: 700, color: '#fff', cursor: 'pointer' }}>Back</button>
                        <button
                          onClick={() => {
                            const code = otpDigits.join('')
                            if (code.length < 6) { setOtpError('Please enter all 6 digits'); return }
                            // Demo: any 6-digit code is accepted. Wire to real verification API later.
                            setDeleteStep('success')
                          }}
                          style={{ flex: 1, background: RED, border: 'none', borderRadius: 8, padding: '12px', fontSize: 16, fontFamily: BARLOW, fontWeight: 700, color: '#fff', cursor: 'pointer' }}
                        >Verify & Delete</button>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── DELETE ACCOUNT · STEP 3: SUCCESS ── */}
                {deleteStep === 'success' && (
                  <div style={{ position: 'fixed', inset: 0, zIndex: 1100, background: 'rgba(0,0,0,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, backdropFilter: 'blur(4px)' }}>
                    <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '36px', maxWidth: 420, width: '100%', textAlign: 'center' as const, position: 'relative' }}>
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)', borderRadius: '16px 16px 0 0' }} />
                      <div style={{ fontSize: 44, marginBottom: 16 }}>👋</div>
                      <div style={{ fontFamily: BEBAS, fontSize: 24, letterSpacing: 1.5, color: '#fff', marginBottom: 8 }}>Account Deleted</div>
                      <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', fontFamily: BARLOW, lineHeight: 1.6, marginBottom: 24 }}>
                        Your account and all associated data have been permanently removed. We're sorry to see you go.
                      </div>
                      <button onClick={() => router.push('/')} style={{ width: '100%', background: BG3, border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: '12px', fontSize: 16, fontFamily: BARLOW, fontWeight: 700, color: '#fff', cursor: 'pointer' }}>Return to Homepage</button>
                    </div>
                  </div>
                )}

                {/* ── PRIVACY MAIN CARD ── */}
                <SectionCard icon={Eye} iconBg="rgba(34,197,94,0.2)" title="Privacy" desc="Control your visibility and data privacy.">

                  <div onClick={() => setPrivacyModal('visibility')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }}
                    onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.opacity = '0.75'} onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.opacity = '1'}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>🌍</div>
                      <div>
                        <div style={{ fontSize: 16, fontFamily: BARLOW, fontWeight: 600, color: '#fff' }}>Profile Visibility</div>
                        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', fontFamily: BARLOW }}>Who can find and view your profile</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 15, color: GREEN, fontWeight: 700, fontFamily: BARLOW }}>{privacy.profileVisibility}</span>
                      <ChevronRight size={16} color="rgba(255,255,255,0.3)" />
                    </div>
                  </div>

                  <div onClick={() => setPrivacyModal('message')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }}
                    onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.opacity = '0.75'} onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.opacity = '1'}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>💬</div>
                      <div>
                        <div style={{ fontSize: 16, fontFamily: BARLOW, fontWeight: 600, color: '#fff' }}>Who Can Message You</div>
                        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', fontFamily: BARLOW }}>Control who can send you direct messages</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 15, color: GREEN, fontWeight: 700, fontFamily: BARLOW }}>{privacy.whoCanMessage}</span>
                      <ChevronRight size={16} color="rgba(255,255,255,0.3)" />
                    </div>
                  </div>

                  <div onClick={() => setPrivacyModal('contact')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }}
                    onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.opacity = '0.75'} onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.opacity = '1'}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(212,166,74,0.1)', border: '1px solid rgba(212,166,74,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>👁️</div>
                      <div>
                        <div style={{ fontSize: 16, fontFamily: BARLOW, fontWeight: 600, color: '#fff' }}>Show Contact Information</div>
                        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', fontFamily: BARLOW }}>Who can see your email and phone number</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 15, color: GOLD, fontWeight: 700, fontFamily: BARLOW }}>{privacy.showContact}</span>
                      <ChevronRight size={16} color="rgba(255,255,255,0.3)" />
                    </div>
                  </div>

                  <div onClick={() => setPrivacyModal('activity')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', cursor: 'pointer' }}
                    onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.opacity = '0.75'} onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.opacity = '1'}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(129,140,248,0.1)', border: '1px solid rgba(129,140,248,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>📊</div>
                      <div>
                        <div style={{ fontSize: 16, fontFamily: BARLOW, fontWeight: 600, color: '#fff' }}>Data & Activity</div>
                        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', fontFamily: BARLOW }}>Download your data, view history, or delete account</div>
                      </div>
                    </div>
                    <ChevronRight size={16} color="rgba(255,255,255,0.3)" />
                  </div>

                </SectionCard>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16 }}>

                {/* ── PREFERRED ROLES MODAL ── */}
                {prefsModal === 'roles' && (
                  <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, backdropFilter: 'blur(4px)' }}>
                    <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '32px', maxWidth: 480, width: '100%', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, #F59E0B, transparent)`, borderRadius: '16px 16px 0 0' }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <div style={{ fontFamily: BEBAS, fontSize: 24, letterSpacing: 1.5, color: '#fff' }}>Preferred Roles</div>
                        <button onClick={() => setPrefsModal(null)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 20 }}>✕</button>
                      </div>
                      <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, marginBottom: 20 }}>Select role types you're interested in. We'll prioritize matching casting calls.</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 8, marginBottom: 22 }}>
                        {['Lead Actor', 'Supporting Actor', 'Background Artist', 'Voice Artist', 'Model', 'Dancer', 'Stunt Performer', 'Anchor', 'Influencer'].map(role => {
                          const selected = prefs.preferredRoles.includes(role)
                          return (
                            <button key={role} onClick={() => togglePrefTag('preferredRoles', role)} style={{
                              display: 'flex', alignItems: 'center', gap: 6,
                              background: selected ? 'rgba(245,158,11,0.15)' : BG3,
                              border: `1px solid ${selected ? '#F59E0B' : 'rgba(255,255,255,0.08)'}`,
                              borderRadius: 20, padding: '8px 16px', cursor: 'pointer',
                              fontSize: 14, fontFamily: BARLOW, color: selected ? '#fff' : 'rgba(255,255,255,0.5)',
                              transition: 'all 0.15s',
                            }}>
                              {selected && <Check size={13} color="#F59E0B" strokeWidth={3} />}
                              {role}
                            </button>
                          )
                        })}
                      </div>
                      <button onClick={() => setPrefsModal(null)} style={{ width: '100%', background: RED, border: 'none', borderRadius: 8, padding: '12px', fontSize: 16, fontFamily: BARLOW, fontWeight: 700, color: '#fff', cursor: 'pointer' }}>Save Preferences</button>
                    </div>
                  </div>
                )}

                {/* ── PREFERRED LOCATIONS MODAL ── */}
                {prefsModal === 'locations' && (
                  <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, backdropFilter: 'blur(4px)' }}>
                    <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '32px', maxWidth: 480, width: '100%', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, #F59E0B, transparent)`, borderRadius: '16px 16px 0 0' }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <div style={{ fontFamily: BEBAS, fontSize: 24, letterSpacing: 1.5, color: '#fff' }}>Preferred Locations</div>
                        <button onClick={() => setPrefsModal(null)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 20 }}>✕</button>
                      </div>
                      <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, marginBottom: 20 }}>Select cities you're available to work in or relocate to.</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 8, marginBottom: 22 }}>
                        {['Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Goa', 'Jaipur', 'Lucknow'].map(loc => {
                          const selected = prefs.preferredLocations.includes(loc)
                          return (
                            <button key={loc} onClick={() => togglePrefTag('preferredLocations', loc)} style={{
                              display: 'flex', alignItems: 'center', gap: 6,
                              background: selected ? 'rgba(245,158,11,0.15)' : BG3,
                              border: `1px solid ${selected ? '#F59E0B' : 'rgba(255,255,255,0.08)'}`,
                              borderRadius: 20, padding: '8px 16px', cursor: 'pointer',
                              fontSize: 14, fontFamily: BARLOW, color: selected ? '#fff' : 'rgba(255,255,255,0.5)',
                              transition: 'all 0.15s',
                            }}>
                              {selected && <Check size={13} color="#F59E0B" strokeWidth={3} />}
                              {loc}
                            </button>
                          )
                        })}
                      </div>
                      <button onClick={() => setPrefsModal(null)} style={{ width: '100%', background: RED, border: 'none', borderRadius: 8, padding: '12px', fontSize: 16, fontFamily: BARLOW, fontWeight: 700, color: '#fff', cursor: 'pointer' }}>Save Preferences</button>
                    </div>
                  </div>
                )}

                {/* ── AVAILABILITY MODAL ── */}
                {prefsModal === 'availability' && (
                  <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, backdropFilter: 'blur(4px)' }}>
                    <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '32px', maxWidth: 440, width: '100%', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, #22C55E, transparent)', borderRadius: '16px 16px 0 0' }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <div style={{ fontFamily: BEBAS, fontSize: 24, letterSpacing: 1.5, color: '#fff' }}>Availability</div>
                        <button onClick={() => setPrefsModal(null)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 20 }}>✕</button>
                      </div>
                      <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, marginBottom: 20 }}>Let agencies know your current availability for work.</div>
                      {[
                        { key: 'Available',     icon: '✅', desc: 'Actively looking and available for new roles' },
                        { key: 'Open to Offers',icon: '👀', desc: 'Not actively searching but open to the right opportunity' },
                        { key: 'Busy',          icon: '🎬', desc: 'Currently committed to a project' },
                        { key: 'Unavailable',   icon: '⏸️', desc: 'Not available — hidden from new casting matches' },
                      ].map(opt => (
                        <button key={opt.key} onClick={() => setPrefValue('availability', opt.key)} style={{
                          width: '100%', display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left' as const,
                          background: prefs.availability === opt.key ? 'rgba(34,197,94,0.08)' : BG3,
                          border: `1px solid ${prefs.availability === opt.key ? 'rgba(34,197,94,0.35)' : 'rgba(255,255,255,0.07)'}`,
                          borderRadius: 10, padding: '14px', marginBottom: 10, cursor: 'pointer', transition: 'all 0.15s',
                        }}>
                          <span style={{ fontSize: 22, flexShrink: 0 }}>{opt.icon}</span>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 16, fontFamily: BARLOW, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{opt.key}</div>
                            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, lineHeight: 1.4 }}>{opt.desc}</div>
                          </div>
                          {prefs.availability === opt.key && <Check size={18} color={GREEN} strokeWidth={2.5} style={{ flexShrink: 0 }} />}
                        </button>
                      ))}
                      <button onClick={() => setPrefsModal(null)} style={{ width: '100%', marginTop: 8, background: RED, border: 'none', borderRadius: 8, padding: '12px', fontSize: 16, fontFamily: BARLOW, fontWeight: 700, color: '#fff', cursor: 'pointer' }}>Done</button>
                    </div>
                  </div>
                )}

                {/* ── LANGUAGE MODAL ── */}
                {prefsModal === 'language' && (
                  <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, backdropFilter: 'blur(4px)' }}>
                    <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '32px', maxWidth: 420, width: '100%', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, #22C55E, transparent)', borderRadius: '16px 16px 0 0' }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <div style={{ fontFamily: BEBAS, fontSize: 24, letterSpacing: 1.5, color: '#fff' }}>Platform Language</div>
                        <button onClick={() => setPrefsModal(null)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 20 }}>✕</button>
                      </div>
                      <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, marginBottom: 20 }}>Choose your preferred display language.</div>
                      {['English', 'Hindi', 'Tamil', 'Telugu', 'Bengali', 'Marathi'].map(lang => (
                        <button key={lang} onClick={() => setPrefValue('language', lang)} style={{
                          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', textAlign: 'left' as const,
                          background: prefs.language === lang ? 'rgba(34,197,94,0.08)' : BG3,
                          border: `1px solid ${prefs.language === lang ? 'rgba(34,197,94,0.35)' : 'rgba(255,255,255,0.07)'}`,
                          borderRadius: 10, padding: '13px 16px', marginBottom: 8, cursor: 'pointer', transition: 'all 0.15s',
                        }}>
                          <span style={{ fontSize: 16, fontFamily: BARLOW, fontWeight: 600, color: '#fff' }}>{lang}</span>
                          {prefs.language === lang && <Check size={18} color={GREEN} strokeWidth={2.5} />}
                        </button>
                      ))}
                      <button onClick={() => setPrefsModal(null)} style={{ width: '100%', marginTop: 10, background: RED, border: 'none', borderRadius: 8, padding: '12px', fontSize: 16, fontFamily: BARLOW, fontWeight: 700, color: '#fff', cursor: 'pointer' }}>Done</button>
                    </div>
                  </div>
                )}

                {/* ── PREFERENCES MAIN CARD ── */}
                <SectionCard icon={Sliders} iconBg="rgba(245,158,11,0.2)" title="Preferences" desc="Customize your experience on the platform.">

                  <div onClick={() => setPrefsModal('roles')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }}
                    onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.opacity = '0.75'} onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.opacity = '1'}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>🎭</div>
                      <div>
                        <div style={{ fontSize: 16, fontFamily: BARLOW, fontWeight: 600, color: '#fff' }}>Preferred Roles</div>
                        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', fontFamily: BARLOW, maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>
                          {prefs.preferredRoles.length > 0 ? prefs.preferredRoles.join(', ') : 'Not set'}
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={16} color="rgba(255,255,255,0.3)" />
                  </div>

                  <div onClick={() => setPrefsModal('locations')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }}
                    onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.opacity = '0.75'} onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.opacity = '1'}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>📍</div>
                      <div>
                        <div style={{ fontSize: 16, fontFamily: BARLOW, fontWeight: 600, color: '#fff' }}>Preferred Locations</div>
                        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', fontFamily: BARLOW, maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>
                          {prefs.preferredLocations.length > 0 ? prefs.preferredLocations.join(', ') : 'Not set'}
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={16} color="rgba(255,255,255,0.3)" />
                  </div>

                  <div onClick={() => setPrefsModal('availability')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }}
                    onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.opacity = '0.75'} onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.opacity = '1'}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>✅</div>
                      <div>
                        <div style={{ fontSize: 16, fontFamily: BARLOW, fontWeight: 600, color: '#fff' }}>Availability</div>
                        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', fontFamily: BARLOW }}>Your current status for new roles</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 15, color: GREEN, fontWeight: 700, fontFamily: BARLOW }}>{prefs.availability}</span>
                      <ChevronRight size={16} color="rgba(255,255,255,0.3)" />
                    </div>
                  </div>

                  <div onClick={() => setPrefsModal('language')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', cursor: 'pointer' }}
                    onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.opacity = '0.75'} onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.opacity = '1'}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>🌐</div>
                      <div>
                        <div style={{ fontSize: 16, fontFamily: BARLOW, fontWeight: 600, color: '#fff' }}>Language</div>
                        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', fontFamily: BARLOW }}>Platform display language</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 15, color: GREEN, fontWeight: 700, fontFamily: BARLOW }}>{prefs.language}</span>
                      <ChevronRight size={16} color="rgba(255,255,255,0.3)" />
                    </div>
                  </div>

                </SectionCard>
              </div>
            )}

            {activeTab === 'blocked' && (
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16 }}>

                {/* ── BLOCKED AGENCIES MODAL ── */}
                {blockedModal === 'agencies' && (
                  <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, backdropFilter: 'blur(4px)' }}>
                    <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '32px', maxWidth: 520, width: '100%', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${RED}, transparent)`, borderRadius: '16px 16px 0 0' }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <div style={{ fontFamily: BEBAS, fontSize: 24, letterSpacing: 1.5, color: '#fff' }}>Blocked Agencies</div>
                        <button onClick={() => setBlockedModal(null)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 20 }}>✕</button>
                      </div>
                      <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, marginBottom: 20 }}>These agencies cannot view your profile, message you, or invite you to casting calls.</div>
                      {blockedAgencies.length === 0 ? (
                        <div style={{ textAlign: 'center' as const, padding: '32px 0' }}>
                          <div style={{ fontSize: 36, marginBottom: 10 }}>🎉</div>
                          <div style={{ fontSize: 16, fontFamily: BARLOW, color: 'rgba(255,255,255,0.4)' }}>No blocked agencies</div>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 10, marginBottom: 8 }}>
                          {blockedAgencies.map(a => (
                            <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 14, background: BG3, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '14px' }}>
                              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(200,32,42,0.1)', border: '1px solid rgba(200,32,42,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>🏢</div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 16, fontFamily: BARLOW, fontWeight: 700, color: '#fff' }}>{a.name}</div>
                                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW }}>{a.reason} · Blocked {a.date}</div>
                              </div>
                              <button onClick={() => unblockAgency(a.id)} style={{ background: 'none', border: '1px solid rgba(34,197,94,0.35)', borderRadius: 7, padding: '7px 16px', color: GREEN, fontSize: 14, fontFamily: BARLOW, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' as const, flexShrink: 0 }}>Unblock</button>
                            </div>
                          ))}
                        </div>
                      )}
                      <button onClick={() => setBlockedModal(null)} style={{ width: '100%', marginTop: 14, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '12px', fontSize: 16, fontFamily: BARLOW, fontWeight: 700, color: '#fff', cursor: 'pointer' }}>Close</button>
                    </div>
                  </div>
                )}

                {/* ── BLOCKED AGENCIES MAIN CARD ── */}
                <SectionCard icon={UserX} iconBg="rgba(200,32,42,0.2)" title="Blocked Agencies" desc="Manage agencies you have blocked.">

                  <div onClick={() => setBlockedModal('agencies')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', cursor: 'pointer' }}
                    onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.opacity = '0.75'} onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.opacity = '1'}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(200,32,42,0.1)', border: '1px solid rgba(200,32,42,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>🏢</div>
                      <div>
                        <div style={{ fontSize: 16, fontFamily: BARLOW, fontWeight: 600, color: '#fff' }}>Blocked Agencies</div>
                        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', fontFamily: BARLOW }}>Agencies you've restricted from contacting you</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 16, color: '#fff', fontWeight: 700, fontFamily: BARLOW }}>{blockedAgencies.length}</span>
                      <ChevronRight size={16} color="rgba(255,255,255,0.3)" />
                    </div>
                  </div>

                </SectionCard>
              </div>
            )}

            {activeTab === 'billing' && (
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16 }}>

                {/* Current Plan card */}
                <div style={{ position: 'relative', background: `linear-gradient(135deg, ${BG2}, ${BG3})`, border: '1px solid rgba(212,166,74,0.2)', borderRadius: 14, padding: '24px', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap' as const, gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 11, background: 'rgba(212,166,74,0.12)', border: '1px solid rgba(212,166,74,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Crown size={20} color={GOLD} />
                      </div>
                      <div>
                        <div style={{ fontSize: 17, fontFamily: BARLOW, fontWeight: 700, color: '#fff' }}>Subscription & Billing</div>
                        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW }}>Manage your plan, billing details and invoices.</div>
                      </div>
                    </div>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 20, padding: '4px 12px', fontSize: 14, fontFamily: BARLOW, fontWeight: 700, color: GREEN }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: GREEN }} /> Active
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 20 }}>
                    {[
                      { label: 'Current Plan',      value: 'Star Plan',      color: GOLD  },
                      { label: 'Next Billing Date', value: '25 Jun 2025',    color: '#fff' },
                      { label: 'Amount',            value: '₹499 / 6 Months', color: '#fff' },
                    ].map(({ label, value, color }) => (
                      <div key={label} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '14px' }}>
                        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', fontFamily: BARLOW, letterSpacing: 1, textTransform: 'uppercase' as const, marginBottom: 4 }}>{label}</div>
                        <div style={{ fontSize: 17, color, fontFamily: BARLOW, fontWeight: 700 }}>{value}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' as const }}>
                    <button onClick={() => router.push('/dashboard/subscription/manage')} style={{ display: 'flex', alignItems: 'center', gap: 7, background: GOLD, border: 'none', borderRadius: 8, padding: '11px 22px', color: '#050505', fontSize: 15, fontFamily: BARLOW, fontWeight: 700, cursor: 'pointer' }}>
                      <Crown size={15} /> Manage Subscription
                    </button>
                    <button onClick={() => router.push('/dashboard/subscription/manage')} style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'none', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: '11px 22px', color: '#fff', fontSize: 15, fontFamily: BARLOW, fontWeight: 600, cursor: 'pointer' }}>
                      <CreditCard size={15} /> View Billing History
                    </button>
                  </div>
                </div>

                {/* RingsNRoses bundle preview */}
                <div style={{ background: BG2, border: '1px solid rgba(212,166,74,0.15)', borderRadius: 14, padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' as const }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <span style={{ fontSize: 24 }}>💍</span>
                    <div>
                      <div style={{ fontSize: 16, fontFamily: BARLOW, fontWeight: 700, color: '#fff', marginBottom: 2 }}>RingsNRoses Bundle</div>
                      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW }}>Bronze plan active · ₹250 · Expires 15 Jul 2025</div>
                    </div>
                  </div>
                  <button onClick={() => router.push('/dashboard/subscription/manage')} style={{ background: 'none', border: '1px solid rgba(212,166,74,0.3)', borderRadius: 7, padding: '8px 18px', color: GOLD, fontSize: 14, fontFamily: BARLOW, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' as const }}>Manage Bundle</button>
                </div>

                {/* Quick links row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div onClick={() => router.push('/pricing')} style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}
                    onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.opacity = '0.75'} onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.opacity = '1'}>
                    <div style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(200,32,42,0.1)', border: '1px solid rgba(200,32,42,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Crown size={16} color={RED} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontFamily: BARLOW, fontWeight: 600, color: '#fff' }}>Compare Plans</div>
                      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', fontFamily: BARLOW }}>Upgrade or change your plan</div>
                    </div>
                    <ChevronRight size={15} color="rgba(255,255,255,0.3)" />
                  </div>
                  <div onClick={() => router.push('/contact')} style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}
                    onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.opacity = '0.75'} onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.opacity = '1'}>
                    <div style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <HelpCircle size={16} color="#3B82F6" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontFamily: BARLOW, fontWeight: 600, color: '#fff' }}>Billing Support</div>
                      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', fontFamily: BARLOW }}>Questions about a charge?</div>
                    </div>
                    <ChevronRight size={15} color="rgba(255,255,255,0.3)" />
                  </div>
                </div>

              </div>
            )}

            {activeTab === 'documents' && (
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16 }}>

                {/* ── UPLOAD MODAL ── */}
                {docUploadOpen && (
                  <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, backdropFilter: 'blur(4px)' }}>
                    <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '32px', maxWidth: 440, width: '100%', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`, borderRadius: '16px 16px 0 0' }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <div style={{ fontFamily: BEBAS, fontSize: 24, letterSpacing: 1.5, color: '#fff' }}>Upload Document</div>
                        <button onClick={() => setDocUploadOpen(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 20 }}>✕</button>
                      </div>

                      <div style={{ marginBottom: 18 }}>
                        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, letterSpacing: 1, textTransform: 'uppercase' as const, marginBottom: 8 }}>Document Type</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 8 }}>
                          {['Resume', 'ID Proof', 'Showreel', 'NOC Letter', 'Other'].map(type => (
                            <button key={type} onClick={() => setDocUploadType(type)} style={{
                              background: docUploadType === type ? 'rgba(212,166,74,0.15)' : BG3,
                              border: `1px solid ${docUploadType === type ? GOLD : 'rgba(255,255,255,0.08)'}`,
                              borderRadius: 20, padding: '7px 14px', fontSize: 14, fontFamily: BARLOW,
                              color: docUploadType === type ? '#fff' : 'rgba(255,255,255,0.5)', cursor: 'pointer', transition: 'all 0.15s',
                            }}>{type}</button>
                          ))}
                        </div>
                      </div>

                      <label style={{ display: 'block', border: '2px dashed rgba(212,166,74,0.3)', borderRadius: 12, padding: '32px 20px', textAlign: 'center' as const, cursor: docUploading ? 'wait' : 'pointer', background: 'rgba(212,166,74,0.03)', transition: 'all 0.15s', marginBottom: 20 }}
                        onMouseEnter={e => { if (!docUploading) { (e.currentTarget as HTMLLabelElement).style.background = 'rgba(212,166,74,0.07)'; (e.currentTarget as HTMLLabelElement).style.borderColor = 'rgba(212,166,74,0.5)' } }}
                        onMouseLeave={e => { (e.currentTarget as HTMLLabelElement).style.background = 'rgba(212,166,74,0.03)'; (e.currentTarget as HTMLLabelElement).style.borderColor = 'rgba(212,166,74,0.3)' }}
                      >
                        <input type="file" accept=".pdf,.jpg,.jpeg,.png,.mp4" style={{ display: 'none' }} disabled={docUploading}
                          onChange={e => { const f = e.target.files?.[0]; if (f) uploadDocument(f) }}
                        />
                        <div style={{ fontSize: 32, marginBottom: 10 }}>{docUploading ? '⏳' : '📤'}</div>
                        <div style={{ fontSize: 16, fontFamily: BARLOW, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{docUploading ? 'Uploading...' : 'Click to choose a file'}</div>
                        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW }}>PDF, JPG, PNG or MP4 — up to 25 MB</div>
                      </label>

                      <button onClick={() => setDocUploadOpen(false)} style={{ width: '100%', background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '12px', fontSize: 16, fontFamily: BARLOW, fontWeight: 700, color: '#fff', cursor: 'pointer' }}>Cancel</button>
                    </div>
                  </div>
                )}

                {/* ── DELETE CONFIRM MODAL ── */}
                {docDeleteId !== null && (
                  <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, backdropFilter: 'blur(4px)' }}>
                    <div style={{ background: BG2, border: '1px solid rgba(200,32,42,0.3)', borderRadius: 16, padding: '28px', maxWidth: 380, width: '100%', textAlign: 'center' as const }}>
                      <div style={{ fontSize: 32, marginBottom: 12 }}>🗑️</div>
                      <div style={{ fontFamily: BEBAS, fontSize: 21, letterSpacing: 1, color: '#fff', marginBottom: 8 }}>Delete this document?</div>
                      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', fontFamily: BARLOW, marginBottom: 22, lineHeight: 1.5 }}>
                        {documents.find(d => d.id === docDeleteId)?.name} will be permanently removed.
                      </div>
                      <div style={{ display: 'flex', gap: 10 }}>
                        <button onClick={() => setDocDeleteId(null)} style={{ flex: 1, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '11px', fontSize: 15, fontFamily: BARLOW, fontWeight: 700, color: '#fff', cursor: 'pointer' }}>Cancel</button>
                        <button onClick={() => deleteDocument(docDeleteId)} style={{ flex: 1, background: RED, border: 'none', borderRadius: 8, padding: '11px', fontSize: 15, fontFamily: BARLOW, fontWeight: 700, color: '#fff', cursor: 'pointer' }}>Delete</button>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── DOCUMENTS MAIN CARD ── */}
                <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap' as const, gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(212,166,74,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FolderOpen size={18} color={GOLD} strokeWidth={1.8} />
                      </div>
                      <div>
                        <div style={{ fontSize: 17, fontFamily: BARLOW, fontWeight: 700, color: '#fff' }}>Documents</div>
                        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW }}>Manage your uploaded documents and certificates.</div>
                      </div>
                    </div>
                    <button onClick={() => { setDocUploadType('Resume'); setDocUploadOpen(true) }} style={{ display: 'flex', alignItems: 'center', gap: 7, background: RED, border: 'none', borderRadius: 8, padding: '10px 18px', color: '#fff', fontSize: 15, fontFamily: BARLOW, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' as const }}>
                      <span style={{ fontSize: 16 }}>+</span> Upload Document
                    </button>
                  </div>

                  {documents.length === 0 ? (
                    <div style={{ textAlign: 'center' as const, padding: '36px 0' }}>
                      <div style={{ fontSize: 36, marginBottom: 12 }}>📁</div>
                      <div style={{ fontSize: 17, fontFamily: BARLOW, color: 'rgba(255,255,255,0.5)' }}>No documents uploaded yet.</div>
                      <div style={{ fontSize: 14, fontFamily: BARLOW, color: 'rgba(255,255,255,0.35)', marginTop: 6 }}>Upload your resume, ID proof, or showreel to complete your profile.</div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
                      {documents.map(doc => {
                        const iconMap: Record<string, string> = { 'Resume': '📄', 'ID Proof': '🪪', 'Showreel': '🎬', 'NOC Letter': '📋', 'Other': '📎' }
                        const statusColor = doc.status === 'Verified' ? GREEN : doc.status === 'Pending' ? GOLD : RED
                        return (
                          <div key={doc.id} style={{ display: 'flex', alignItems: 'center', gap: 14, background: BG3, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '14px' }}>
                            <div style={{ width: 42, height: 42, borderRadius: 10, background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{iconMap[doc.type] || '📎'}</div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 15, fontFamily: BARLOW, fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{doc.name}</div>
                              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW }}>{doc.type} · {doc.size} · {doc.date}</div>
                            </div>
                            <span style={{ fontSize: 14, fontFamily: BARLOW, fontWeight: 700, color: statusColor, background: `${statusColor}18`, border: `1px solid ${statusColor}40`, borderRadius: 20, padding: '3px 10px', flexShrink: 0, whiteSpace: 'nowrap' as const }}>{doc.status}</span>
                            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                              <button title="Download" style={{ width: 32, height: 32, borderRadius: 7, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.6)' }}>⬇️</button>
                              <button title="Delete" onClick={() => setDocDeleteId(doc.id)} style={{ width: 32, height: 32, borderRadius: 7, background: 'rgba(200,32,42,0.08)', border: '1px solid rgba(200,32,42,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: RED }}>🗑️</button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* Info note */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: 'rgba(212,166,74,0.06)', border: '1px solid rgba(212,166,74,0.15)', borderRadius: 10, padding: '14px 16px' }}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>ℹ️</span>
                  <span style={{ fontSize: 14, fontFamily: BARLOW, color: 'rgba(255,255,255,0.45)', lineHeight: 1.65 }}>
                    Verified documents help agencies trust your profile faster. ID proof is required for the SilverScreens Verified badge.
                  </span>
                </div>

              </div>
            )}

            {/* ══ EXPERIENCE ══ */}
            {activeTab === 'experience' && (
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16 }}>
                {/* Modal */}
                {expModal !== null && (
                  <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, backdropFilter: 'blur(4px)' }}>
                    <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: 28, maxWidth: 520, width: '100%', boxShadow: '0 40px 80px rgba(0,0,0,0.7)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <div style={{ fontFamily: BEBAS, fontSize: 22, letterSpacing: 1, color: '#fff' }}>{expModal === 'add' ? 'Add Experience' : 'Edit Experience'}</div>
                        <button onClick={() => setExpModal(null)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 20 }}>✕</button>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                        {[
                          { label: 'Project / Show Title', key: 'project', placeholder: 'e.g. Ek Baar Phir' },
                          { label: 'Your Role',            key: 'role',    placeholder: 'e.g. Lead Actor' },
                          { label: 'Production Company',   key: 'company', placeholder: 'e.g. Dharma Productions' },
                          { label: 'From (Year)',          key: 'from',    placeholder: 'e.g. 2022' },
                        ].map(f => (
                          <div key={f.key}>
                            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, marginBottom: 5, textTransform: 'uppercase' as const, letterSpacing: 1 }}>{f.label}</div>
                            <input value={expForm[f.key as keyof ExperienceEntry] as string} onChange={e => setExpForm(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} style={mi} />
                          </div>
                        ))}
                        <div>
                          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, marginBottom: 5, textTransform: 'uppercase' as const, letterSpacing: 1 }}>To (Year)</div>
                          <input value={expForm.to} onChange={e => setExpForm(p => ({ ...p, to: e.target.value }))} placeholder="e.g. 2023" style={{ ...mi, opacity: expForm.current ? 0.4 : 1 }} disabled={expForm.current} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 24 }}>
                          <input type="checkbox" id="expCurrent" checked={expForm.current} onChange={e => setExpForm(p => ({ ...p, current: e.target.checked, to: '' }))} style={{ width: 16, height: 16, accentColor: RED }} />
                          <label htmlFor="expCurrent" style={{ fontSize: 15, fontFamily: BARLOW, color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}>Currently working here</label>
                        </div>
                      </div>
                      <div style={{ marginBottom: 18 }}>
                        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, marginBottom: 5, textTransform: 'uppercase' as const, letterSpacing: 1 }}>Description (optional)</div>
                        <textarea value={expForm.description} onChange={e => setExpForm(p => ({ ...p, description: e.target.value }))} placeholder="Brief description of your work..." rows={3} style={{ ...mi, resize: 'vertical' as const }} />
                      </div>
                      <div style={{ display: 'flex', gap: 12 }}>
                        <button onClick={() => setExpModal(null)} style={{ flex: 1, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 11, fontSize: 15, fontFamily: BARLOW, fontWeight: 700, color: '#fff', cursor: 'pointer' }}>Cancel</button>
                        <button onClick={saveExp} style={{ flex: 1, background: RED, border: 'none', borderRadius: 8, padding: 11, fontSize: 15, fontFamily: BARLOW, fontWeight: 700, color: '#fff', cursor: 'pointer' }}>Save</button>
                      </div>
                    </div>
                  </div>
                )}
                <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: 22 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                    <div>
                      <div style={{ fontSize: 19, fontFamily: BARLOW, fontWeight: 700, color: '#fff' }}>Experience</div>
                      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW }}>Add your film, TV, theatre and commercial credits.</div>
                    </div>
                    <button onClick={() => { setExpForm(blankExp()); setExpModal('add') }} style={{ display: 'flex', alignItems: 'center', gap: 7, background: RED, border: 'none', borderRadius: 8, padding: '9px 18px', color: '#fff', fontSize: 15, fontFamily: BARLOW, fontWeight: 700, cursor: 'pointer' }}>
                      <Plus size={15} /> Add Experience
                    </button>
                  </div>
                  {experiences.length === 0 ? (
                    <div style={{ textAlign: 'center' as const, padding: '48px 0', color: 'rgba(255,255,255,0.25)' }}>
                      <Briefcase size={36} color="rgba(255,255,255,0.12)" style={{ margin: '0 auto 14px' }} />
                      <div style={{ fontSize: 16, fontFamily: BARLOW, marginBottom: 6 }}>No experience added yet</div>
                      <div style={{ fontSize: 14, fontFamily: BARLOW, color: 'rgba(255,255,255,0.2)' }}>Add your acting, directing or other industry credits.</div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 12 }}>
                      {experiences.map(e => (
                        <div key={e.id} style={{ background: BG3, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 14 }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 17, fontFamily: BARLOW, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{e.project || '—'}</div>
                            <div style={{ fontSize: 15, fontFamily: BARLOW, color: RED, marginBottom: 4 }}>{e.role}{e.company ? ` · ${e.company}` : ''}</div>
                            <div style={{ fontSize: 14, fontFamily: BARLOW, color: 'rgba(255,255,255,0.35)' }}>{e.from}{e.current ? ' – Present' : e.to ? ` – ${e.to}` : ''}</div>
                            {e.description && <div style={{ fontSize: 14, fontFamily: BARLOW, color: 'rgba(255,255,255,0.5)', marginTop: 6, lineHeight: 1.55 }}>{e.description}</div>}
                          </div>
                          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                            <button onClick={() => { setExpForm(e); setExpModal(e.id) }} style={{ width: 32, height: 32, borderRadius: 7, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Pencil size={13} color="rgba(255,255,255,0.6)" /></button>
                            <button onClick={() => deleteExp(e.id)} style={{ width: 32, height: 32, borderRadius: 7, background: 'rgba(200,32,42,0.08)', border: '1px solid rgba(200,32,42,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Trash2 size={13} color={RED} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ══ EDUCATION ══ */}
            {activeTab === 'education' && (
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16 }}>
                {eduModal !== null && (
                  <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, backdropFilter: 'blur(4px)' }}>
                    <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: 28, maxWidth: 520, width: '100%', boxShadow: '0 40px 80px rgba(0,0,0,0.7)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <div style={{ fontFamily: BEBAS, fontSize: 22, letterSpacing: 1, color: '#fff' }}>{eduModal === 'add' ? 'Add Education' : 'Edit Education'}</div>
                        <button onClick={() => setEduModal(null)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 20 }}>✕</button>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18 }}>
                        {[
                          { label: 'Degree / Certificate',    key: 'degree',      placeholder: 'e.g. B.A. in Performing Arts' },
                          { label: 'Institution / School',    key: 'institution', placeholder: 'e.g. FTII Pune' },
                          { label: 'Field of Study',          key: 'field',       placeholder: 'e.g. Acting' },
                          { label: 'Grade / Percentage',      key: 'grade',       placeholder: 'e.g. 85%' },
                          { label: 'From (Year)',              key: 'from',        placeholder: 'e.g. 2018' },
                          { label: 'To (Year)',                key: 'to',          placeholder: 'e.g. 2021' },
                        ].map(f => (
                          <div key={f.key}>
                            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, marginBottom: 5, textTransform: 'uppercase' as const, letterSpacing: 1 }}>{f.label}</div>
                            <input value={eduForm[f.key as keyof EducationEntry] as string} onChange={e => setEduForm(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} style={mi} />
                          </div>
                        ))}
                      </div>
                      <div style={{ display: 'flex', gap: 12 }}>
                        <button onClick={() => setEduModal(null)} style={{ flex: 1, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 11, fontSize: 15, fontFamily: BARLOW, fontWeight: 700, color: '#fff', cursor: 'pointer' }}>Cancel</button>
                        <button onClick={saveEdu} style={{ flex: 1, background: RED, border: 'none', borderRadius: 8, padding: 11, fontSize: 15, fontFamily: BARLOW, fontWeight: 700, color: '#fff', cursor: 'pointer' }}>Save</button>
                      </div>
                    </div>
                  </div>
                )}
                <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: 22 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                    <div>
                      <div style={{ fontSize: 19, fontFamily: BARLOW, fontWeight: 700, color: '#fff' }}>Education</div>
                      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW }}>Add your academic and professional training.</div>
                    </div>
                    <button onClick={() => { setEduForm(blankEdu()); setEduModal('add') }} style={{ display: 'flex', alignItems: 'center', gap: 7, background: RED, border: 'none', borderRadius: 8, padding: '9px 18px', color: '#fff', fontSize: 15, fontFamily: BARLOW, fontWeight: 700, cursor: 'pointer' }}>
                      <Plus size={15} /> Add Education
                    </button>
                  </div>
                  {educations.length === 0 ? (
                    <div style={{ textAlign: 'center' as const, padding: '48px 0', color: 'rgba(255,255,255,0.25)' }}>
                      <GraduationCap size={36} color="rgba(255,255,255,0.12)" style={{ margin: '0 auto 14px' }} />
                      <div style={{ fontSize: 16, fontFamily: BARLOW, marginBottom: 6 }}>No education added yet</div>
                      <div style={{ fontSize: 14, fontFamily: BARLOW, color: 'rgba(255,255,255,0.2)' }}>Add your degrees, diplomas and acting workshops.</div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 12 }}>
                      {educations.map(e => (
                        <div key={e.id} style={{ background: BG3, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 14 }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 17, fontFamily: BARLOW, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{e.degree || '—'}</div>
                            <div style={{ fontSize: 15, fontFamily: BARLOW, color: RED, marginBottom: 4 }}>{e.institution}{e.field ? ` · ${e.field}` : ''}</div>
                            <div style={{ fontSize: 14, fontFamily: BARLOW, color: 'rgba(255,255,255,0.35)' }}>{e.from}{e.to ? ` – ${e.to}` : ''}{e.grade ? ` · ${e.grade}` : ''}</div>
                          </div>
                          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                            <button onClick={() => { setEduForm(e); setEduModal(e.id) }} style={{ width: 32, height: 32, borderRadius: 7, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Pencil size={13} color="rgba(255,255,255,0.6)" /></button>
                            <button onClick={() => deleteEdu(e.id)} style={{ width: 32, height: 32, borderRadius: 7, background: 'rgba(200,32,42,0.08)', border: '1px solid rgba(200,32,42,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Trash2 size={13} color={RED} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ══ AWARDS ══ */}
            {activeTab === 'awards' && (
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16 }}>
                {awardModal !== null && (
                  <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, backdropFilter: 'blur(4px)' }}>
                    <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: 28, maxWidth: 520, width: '100%', boxShadow: '0 40px 80px rgba(0,0,0,0.7)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <div style={{ fontFamily: BEBAS, fontSize: 22, letterSpacing: 1, color: '#fff' }}>{awardModal === 'add' ? 'Add Award' : 'Edit Award'}</div>
                        <button onClick={() => setAwardModal(null)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 20 }}>✕</button>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                        {[
                          { label: 'Award Name',    key: 'name',     placeholder: 'e.g. Best Actor' },
                          { label: 'Category',      key: 'category', placeholder: 'e.g. Short Film' },
                          { label: 'Issued By',     key: 'issuedBy', placeholder: 'e.g. Filmfare' },
                          { label: 'Year',          key: 'year',     placeholder: 'e.g. 2023' },
                        ].map(f => (
                          <div key={f.key}>
                            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, marginBottom: 5, textTransform: 'uppercase' as const, letterSpacing: 1 }}>{f.label}</div>
                            <input value={awardForm[f.key as keyof AwardEntry] as string} onChange={e => setAwardForm(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} style={mi} />
                          </div>
                        ))}
                      </div>
                      <div style={{ marginBottom: 18 }}>
                        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, marginBottom: 5, textTransform: 'uppercase' as const, letterSpacing: 1 }}>Description (optional)</div>
                        <textarea value={awardForm.description} onChange={e => setAwardForm(p => ({ ...p, description: e.target.value }))} placeholder="Brief description..." rows={2} style={{ ...mi, resize: 'vertical' as const }} />
                      </div>
                      <div style={{ display: 'flex', gap: 12 }}>
                        <button onClick={() => setAwardModal(null)} style={{ flex: 1, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 11, fontSize: 15, fontFamily: BARLOW, fontWeight: 700, color: '#fff', cursor: 'pointer' }}>Cancel</button>
                        <button onClick={saveAward} style={{ flex: 1, background: RED, border: 'none', borderRadius: 8, padding: 11, fontSize: 15, fontFamily: BARLOW, fontWeight: 700, color: '#fff', cursor: 'pointer' }}>Save</button>
                      </div>
                    </div>
                  </div>
                )}
                <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: 22 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                    <div>
                      <div style={{ fontSize: 19, fontFamily: BARLOW, fontWeight: 700, color: '#fff' }}>Awards & Recognitions</div>
                      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW }}>Add awards, nominations and recognitions you have received.</div>
                    </div>
                    <button onClick={() => { setAwardForm(blankAward()); setAwardModal('add') }} style={{ display: 'flex', alignItems: 'center', gap: 7, background: RED, border: 'none', borderRadius: 8, padding: '9px 18px', color: '#fff', fontSize: 15, fontFamily: BARLOW, fontWeight: 700, cursor: 'pointer' }}>
                      <Plus size={15} /> Add Award
                    </button>
                  </div>
                  {awards.length === 0 ? (
                    <div style={{ textAlign: 'center' as const, padding: '48px 0' }}>
                      <Award size={36} color="rgba(255,255,255,0.12)" style={{ margin: '0 auto 14px' }} />
                      <div style={{ fontSize: 16, fontFamily: BARLOW, color: 'rgba(255,255,255,0.25)', marginBottom: 6 }}>No awards added yet</div>
                      <div style={{ fontSize: 14, fontFamily: BARLOW, color: 'rgba(255,255,255,0.2)' }}>Showcase your recognitions to stand out to casting directors.</div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 12 }}>
                      {awards.map(a => (
                        <div key={a.id} style={{ background: BG3, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 14 }}>
                          <div style={{ display: 'flex', gap: 12, flex: 1 }}>
                            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(212,166,74,0.1)', border: '1px solid rgba(212,166,74,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <Award size={16} color={GOLD} />
                            </div>
                            <div>
                              <div style={{ fontSize: 17, fontFamily: BARLOW, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{a.name || '—'}</div>
                              <div style={{ fontSize: 15, fontFamily: BARLOW, color: GOLD, marginBottom: 4 }}>{a.issuedBy}{a.category ? ` · ${a.category}` : ''}</div>
                              <div style={{ fontSize: 14, fontFamily: BARLOW, color: 'rgba(255,255,255,0.35)' }}>{a.year}</div>
                              {a.description && <div style={{ fontSize: 14, fontFamily: BARLOW, color: 'rgba(255,255,255,0.45)', marginTop: 4, lineHeight: 1.5 }}>{a.description}</div>}
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                            <button onClick={() => { setAwardForm(a); setAwardModal(a.id) }} style={{ width: 32, height: 32, borderRadius: 7, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Pencil size={13} color="rgba(255,255,255,0.6)" /></button>
                            <button onClick={() => deleteAward(a.id)} style={{ width: 32, height: 32, borderRadius: 7, background: 'rgba(200,32,42,0.08)', border: '1px solid rgba(200,32,42,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Trash2 size={13} color={RED} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ══ MEMBERSHIPS ══ */}
            {activeTab === 'memberships' && (
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16 }}>
                {memModal !== null && (
                  <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, backdropFilter: 'blur(4px)' }}>
                    <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: 28, maxWidth: 520, width: '100%', boxShadow: '0 40px 80px rgba(0,0,0,0.7)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <div style={{ fontFamily: BEBAS, fontSize: 22, letterSpacing: 1, color: '#fff' }}>{memModal === 'add' ? 'Add Membership' : 'Edit Membership'}</div>
                        <button onClick={() => setMemModal(null)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 20 }}>✕</button>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 12, marginBottom: 12 }}>
                        <div>
                          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, marginBottom: 5, textTransform: 'uppercase' as const, letterSpacing: 1 }}>Association / Federation Name *</div>
                          <input value={memForm.association} onChange={e => setMemForm(p => ({ ...p, association: e.target.value }))} placeholder="e.g. CINTAA, Film Federation of India" style={mi} />
                        </div>
                        <div>
                          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, marginBottom: 5, textTransform: 'uppercase' as const, letterSpacing: 1 }}>Membership ID</div>
                          <input value={memForm.membershipId} onChange={e => setMemForm(p => ({ ...p, membershipId: e.target.value }))} placeholder="e.g. CINTAA-2024-00123" style={mi} />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                          <div>
                            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, marginBottom: 5, textTransform: 'uppercase' as const, letterSpacing: 1 }}>Member Since</div>
                            <input value={memForm.since} onChange={e => setMemForm(p => ({ ...p, since: e.target.value }))} placeholder="e.g. 2019" style={mi} />
                          </div>
                          <div>
                            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, marginBottom: 5, textTransform: 'uppercase' as const, letterSpacing: 1 }}>Valid Till</div>
                            <input value={memForm.validTill} onChange={e => setMemForm(p => ({ ...p, validTill: e.target.value }))} placeholder="e.g. 2025" style={{ ...mi, opacity: memForm.lifetime ? 0.4 : 1 }} disabled={memForm.lifetime} />
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <input type="checkbox" id="memLifetime" checked={memForm.lifetime} onChange={e => setMemForm(p => ({ ...p, lifetime: e.target.checked, validTill: '' }))} style={{ width: 16, height: 16, accentColor: RED }} />
                          <label htmlFor="memLifetime" style={{ fontSize: 15, fontFamily: BARLOW, color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}>Lifetime membership</label>
                        </div>
                        {/* Membership card scan — optional */}
                        <div>
                          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, marginBottom: 5, textTransform: 'uppercase' as const, letterSpacing: 1 }}>
                            Membership Card Scan <span style={{ color: 'rgba(255,255,255,0.25)', fontWeight: 400, textTransform: 'none' as const, letterSpacing: 0 }}>(optional)</span>
                          </div>
                          {memForm.cardFile ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 8 }}>
                              <span style={{ fontSize: 18 }}>📄</span>
                              <span style={{ fontSize: 15, fontFamily: BARLOW, color: GREEN, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{memForm.cardFile}</span>
                              <button onClick={() => setMemForm(p => ({ ...p, cardFile: '' }))} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}>✕</button>
                            </div>
                          ) : (
                            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, height: 72, borderRadius: 8, background: 'rgba(255,255,255,0.02)', border: '2px dashed rgba(255,255,255,0.1)', cursor: 'pointer', transition: 'border-color 0.2s' }}
                              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(200,32,42,0.4)')}
                              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                            >
                              <input type="file" accept="image/*,.pdf" style={{ display: 'none' }}
                                onChange={e => {
                                  const file = e.target.files?.[0]
                                  if (file) setMemForm(p => ({ ...p, cardFile: file.name }))
                                }}
                              />
                              <span style={{ fontSize: 20 }}>📎</span>
                              <span style={{ fontSize: 15, fontFamily: BARLOW, color: 'rgba(255,255,255,0.35)' }}>Upload image or PDF of membership card</span>
                            </label>
                          )}
                          <div style={{ fontSize: 13, fontFamily: BARLOW, color: 'rgba(255,255,255,0.2)', marginTop: 5 }}>Accepted: JPG, PNG, PDF · Max 5 MB</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 12 }}>
                        <button onClick={() => setMemModal(null)} style={{ flex: 1, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 11, fontSize: 15, fontFamily: BARLOW, fontWeight: 700, color: '#fff', cursor: 'pointer' }}>Cancel</button>
                        <button onClick={saveMem} disabled={!memForm.association.trim()} style={{ flex: 1, background: memForm.association.trim() ? RED : 'rgba(200,32,42,0.3)', border: 'none', borderRadius: 8, padding: 11, fontSize: 15, fontFamily: BARLOW, fontWeight: 700, color: '#fff', cursor: memForm.association.trim() ? 'pointer' : 'not-allowed' }}>Save</button>
                      </div>
                    </div>
                  </div>
                )}
                <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: 22 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                    <div>
                      <div style={{ fontSize: 19, fontFamily: BARLOW, fontWeight: 700, color: '#fff' }}>Memberships</div>
                      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW }}>Add your industry association and federation memberships.</div>
                    </div>
                    <button onClick={() => { setMemForm(blankMem()); setMemModal('add') }} style={{ display: 'flex', alignItems: 'center', gap: 7, background: RED, border: 'none', borderRadius: 8, padding: '9px 18px', color: '#fff', fontSize: 15, fontFamily: BARLOW, fontWeight: 700, cursor: 'pointer' }}>
                      <Plus size={15} /> Add Membership
                    </button>
                  </div>
                  {memberships.length === 0 ? (
                    <div style={{ textAlign: 'center' as const, padding: '48px 0' }}>
                      <BadgeCheck size={36} color="rgba(255,255,255,0.12)" style={{ margin: '0 auto 14px' }} />
                      <div style={{ fontSize: 16, fontFamily: BARLOW, color: 'rgba(255,255,255,0.25)', marginBottom: 6 }}>No memberships added yet</div>
                      <div style={{ fontSize: 14, fontFamily: BARLOW, color: 'rgba(255,255,255,0.2)' }}>Add CINTAA, Film Federation and other industry memberships.</div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 12 }}>
                      {memberships.map(m => (
                        <div key={m.id} style={{ background: BG3, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 14 }}>
                          <div style={{ display: 'flex', gap: 12, flex: 1 }}>
                            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <BadgeCheck size={16} color={GREEN} />
                            </div>
                            <div>
                              <div style={{ fontSize: 17, fontFamily: BARLOW, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{m.association}</div>
                              {m.membershipId && <div style={{ fontSize: 14, fontFamily: BARLOW, color: 'rgba(255,255,255,0.45)', marginBottom: 3 }}>ID: {m.membershipId}</div>}
                              <div style={{ fontSize: 14, fontFamily: BARLOW, color: 'rgba(255,255,255,0.35)' }}>
                                {m.since ? `Since ${m.since}` : ''}
                                {m.lifetime ? ' · Lifetime' : m.validTill ? ` · Valid till ${m.validTill}` : ''}
                              </div>
                              {m.cardFile && (
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 6, fontSize: 13, fontFamily: BARLOW, color: GREEN, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 6, padding: '2px 8px' }}>
                                  📄 {m.cardFile}
                                </div>
                              )}
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                            <button onClick={() => { setMemForm(m); setMemModal(m.id) }} style={{ width: 32, height: 32, borderRadius: 7, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Pencil size={13} color="rgba(255,255,255,0.6)" /></button>
                            <button onClick={() => deleteMem(m.id)} style={{ width: 32, height: 32, borderRadius: 7, background: 'rgba(200,32,42,0.08)', border: '1px solid rgba(200,32,42,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Trash2 size={13} color={RED} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}