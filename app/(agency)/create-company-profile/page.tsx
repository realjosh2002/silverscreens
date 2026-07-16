'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import SilverScreensLogo from '@/components/ui/SilverScreensLogo'
import {
  LayoutDashboard, Megaphone, PlusCircle, ClipboardList,
  UserSearch, Star, CalendarCheck, MessageSquare, Bell,
  Bookmark, ChevronDown, ChevronLeft, Menu, Check,
} from 'lucide-react'

const RED    = '#C8202A'
const BARLOW = "'Barlow Condensed', sans-serif"
const BEBAS  = "'Bebas Neue', sans-serif"

const M = "'Barlow Condensed', sans-serif"
const B = "'Bebas Neue', sans-serif"
const GOLD = '#D4A64A'
const GOLD_DIM = 'rgba(212,166,74,0.12)'
const GOLD_BORDER = 'rgba(212,166,74,0.25)'
const BG  = '#050505'
const BG2 = '#0B0F14'
const BG3 = '#121821'

// ── Data ──
const NAV_PRIMARY = [
  { icon: LayoutDashboard, label: 'Dashboard',              href: '/agency/dashboard'     },
  { icon: PlusCircle,      label: 'Create Casting Call',    href: '/agency/create-casting'},
  { icon: Megaphone,       label: 'Casting Calls List',     href: '/agency/casting-calls' },
  { icon: UserSearch,      label: 'Talent Search',          href: '/agency/talent-search' },
  { icon: ClipboardList,   label: 'Applications',           href: '/agency/applications'  },
  { icon: Star,            label: 'Shortlisted Talents',    href: '/agency/shortlisted'   },
  { icon: CalendarCheck,   label: 'Audition Management',    href: '/agency/auditions'     },
  { icon: Bookmark,        label: 'Saved Talents',          href: '/agency/saved-talents' },
  { icon: MessageSquare,   label: 'Messages',     badge: 12, href: '/agency/messages'     },
  { icon: Bell,            label: 'Notifications',badge: 3,  href: '/agency/notifications'},
]

const COMPANY_TYPES   = ['Production House', 'Casting Agency', 'Talent Management', 'Advertising Agency', 'OTT Platform', 'Broadcasting Network', 'Music Label', 'Theatre Company', 'Event Management', 'PR Agency', 'Other']
const COMPANY_SIZES   = ['1 - 10 Employees', '11 - 50 Employees', '51 - 200 Employees', '201 - 500 Employees', '500+ Employees']
const LANGUAGES_LIST  = ['Hindi', 'English', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Bengali', 'Marathi', 'Gujarati', 'Punjabi', 'Urdu', 'Other']
const GENRES_LIST     = ['Drama', 'Thriller', 'Romance', 'Action', 'Comedy', 'Horror', 'Sci-Fi', 'Documentary', 'Biopic', 'Musical', 'Animation', 'Reality']
const EXPERTISE_LIST  = ['Feature Films', 'Web Series', 'Short Films', 'Documentaries', 'Commercials', 'Music Videos', 'Branded Content', 'Animation', 'OTT Content', 'Theatre']
const YEARS           = Array.from({ length: 55 }, (_, i) => String(2024 - i))

const STEPS = [
  { id: 'basic',   label: 'Basic Info' },
  { id: 'about',   label: 'About'      },
  { id: 'media',   label: 'Media'      },
  { id: 'team',    label: 'Team'       },
  { id: 'review',  label: 'Review'     },
]

const SIDEBAR_MAIN = [
  { icon: '🏠', label: 'Dashboard',       href: '/dashboard'    },
  { icon: '📁', label: 'Projects',        href: '/projects'     },
  { icon: '🔍', label: 'Talent Search',   href: '/talent-search'},
  { icon: '🎤', label: 'Auditions',       href: '/auditions'    },
  { icon: '🎬', label: 'Castings',        href: '/castings'     },
  { icon: '📋', label: 'My Applications', href: '/applications' },
  { icon: '💬', label: 'Messages',        href: '/messages', badge: 2 },
]
const SIDEBAR_COMPANY = [
  { icon: '🏢', label: 'Company Profile', href: '/company-profile' },
  { icon: '👥', label: 'Team Members',    href: '/team-members'   },
  { icon: '📽️', label: 'Company Projects',href: '/company-projects'},
]
const SIDEBAR_TOOLS = [
  { icon: '📌', label: 'Shortlist',       href: '/shortlist'     },
  { icon: '💾', label: 'Saved Profiles',  href: '/saved-profiles'},
  { icon: '📊', label: 'Insights',        href: '/insights'      },
  { icon: '💳', label: 'Billing & Plans', href: '/billing'       },
]

// ── Shared input styles ──
const inp = (extra?: React.CSSProperties): React.CSSProperties => ({
  width: '100%', padding: '10px 12px',
  background: BG3, border: `1px solid rgba(255,255,255,0.1)`,
  borderRadius: 6, color: '#F5F5F5',
  fontFamily: M, fontSize: 14, outline: 'none',
  boxSizing: 'border-box' as const,
  ...extra,
})
const sel: React.CSSProperties = {
  ...inp(), cursor: 'pointer', appearance: 'none' as const,
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath fill='%23A8B0BD' d='M5 7L1 3h8z'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center',
  backgroundSize: '10px', paddingRight: 32,
}
const lbl: React.CSSProperties = {
  display: 'block', fontFamily: M, fontSize: 14, fontWeight: 600,
  color: '#A8B0BD', marginBottom: 6,
}
const reqStar = <span style={{ color: GOLD, marginLeft: 2 }}>*</span>

function SectionCard({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: BG2, border: `1px solid rgba(255,255,255,0.07)`, borderRadius: 10, padding: 24, marginBottom: 16, ...style }}>
      {children}
    </div>
  )
}

function SectionTitle({ icon, num, title, sub }: { icon: string; num: number; title: string; sub?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
      <div style={{ width: 36, height: 36, borderRadius: '50%', background: GOLD_DIM, border: `1px solid ${GOLD_BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0 }}>{icon}</div>
      <div>
        <div style={{ fontFamily: M, fontSize: 16, fontWeight: 700, color: '#F5F5F5' }}>{num}. {title}</div>
        {sub && <div style={{ fontFamily: M, fontSize: 14, color: '#6A7080', marginTop: 1 }}>{sub}</div>}
      </div>
    </div>
  )
}

function TagPill({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px 4px 12px', background: GOLD_DIM, border: `1px solid ${GOLD_BORDER}`, borderRadius: 20, fontFamily: M, fontSize: 14, color: GOLD }}>
      {label}
      <button onClick={onRemove} style={{ background: 'none', border: 'none', color: GOLD, cursor: 'pointer', fontSize: 14, lineHeight: 1, padding: '0 0 0 2px' }}>×</button>
    </span>
  )
}

function ExpertiseCheckbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange} style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      padding: '7px 14px', borderRadius: 6, cursor: 'pointer',
      border: `1px solid ${checked ? GOLD : 'rgba(255,255,255,0.1)'}`,
      background: checked ? GOLD_DIM : 'transparent',
      fontFamily: M, fontSize: 14, color: checked ? GOLD : '#A8B0BD',
      transition: 'all 0.15s',
    }}>
      <div style={{ width: 16, height: 16, borderRadius: 4, border: `1.5px solid ${checked ? GOLD : 'rgba(255,255,255,0.2)'}`, background: checked ? GOLD : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {checked && <span style={{ color: '#050505', fontSize: 14, fontWeight: 900 }}>✓</span>}
      </div>
      {label}
    </button>
  )
}

// ── Donut SVG ──
function Donut({ pct }: { pct: number }) {
  const r = 40, cx = 50, cy = 50
  const circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ
  return (
    <svg width="90" height="90" viewBox="0 0 100 100">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={GOLD} strokeWidth="10"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform="rotate(-90 50 50)" style={{ transition: 'stroke-dasharray 0.5s' }} />
      <text x="50" y="50" textAnchor="middle" dominantBaseline="central"
        style={{ fontFamily: M, fontSize: 16, fontWeight: 700, fill: '#F5F5F5' }}>{pct}%</text>
    </svg>
  )
}

export default function CreateCompanyProfilePage() {
  const router = useRouter()
  const logoRef    = useRef<HTMLInputElement>(null)
  const bannerRef  = useRef<HTMLInputElement>(null)
  const galleryRef = useRef<HTMLInputElement>(null)
  const videoRef   = useRef<HTMLInputElement>(null)

  // ── Form state ──
  const [form, setForm] = useState({
    companyName: 'DreamLine Films', companyType: 'Production House', establishedYear: '2018',
    website: 'www.dreamlinefilms.com', email: 'hello@dreamlinefilms.com', phone: '+91 98765 43210',
    headquarters: 'Mumbai, Maharashtra, India',
    bio: 'DreamLine Films is a Mumbai based production house passionate about creating powerful stories that entertain, inspire and leave a lasting impact. We specialize in feature films, web series, commercials and branded content.',
    companySize: '11 - 50 Employees', regNo: '27AABCD1234E1Z5', gst: '27AABCD1234E1Z5', pan: 'AABCD1234E',
    subsidiary: 'DreamLine Studios',
    talentManagement: 'yes',
    instagram: 'https://instagram.com/dreamlinefilms',
    facebook: 'https://facebook.com/dreamlinefilms',
    linkedin: 'https://linkedin.com/company/dreamlinefilms',
    youtube: 'https://youtube.com/@dreamlinefilms',
    twitter: 'https://twitter.com/dreamlinefilms',
  })
  const [expertise,       setExpertise]       = useState<string[]>(['Feature Films', 'Web Series', 'Short Films', 'Commercials', 'Branded Content'])
  const [languages,       setLanguages]       = useState<string[]>(['Hindi', 'English', 'Marathi'])
  const [genres,          setGenres]          = useState<string[]>(['Drama', 'Thriller', 'Romance', 'Action'])
  const [operatingCities, setOperatingCities] = useState<string[]>(['Mumbai', 'Delhi', 'Bangalore'])
  const [cityInput,       setCityInput]       = useState('')
  const [logoSrc,         setLogoSrc]         = useState<string>('')
  const [bannerSrc,       setBannerSrc]       = useState<string>('')
  const [gallery,         setGallery]         = useState<string[]>([])
  const [videoName,       setVideoName]       = useState<string>('')
  const [activeStep,      setActiveStep]      = useState(0)
  const [userMenuOpen,    setUserMenuOpen]    = useState(false)
  const [sidebarOpen,     setSidebarOpen]     = useState(false)
  const [profileOpen,     setProfileOpen]     = useState(false)
  const [isEditMode,      setIsEditMode]      = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('ss_agency_profile_draft')
      if (raw) {
        const draft = JSON.parse(raw)
        if (draft?.editMode) setIsEditMode(true)
      }
    } catch {}
  }, [])

  useEffect(() => {
    const handler = () => setUserMenuOpen(false)
    if (userMenuOpen) document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [userMenuOpen])

  const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }))

  const toggle = (arr: string[], set: (v: string[]) => void, val: string) =>
    set(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val])

  const handleImg = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setter(ev.target?.result as string)
    reader.readAsDataURL(file)
  }
  const handleGallery = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 6 - gallery.length)
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = ev => setGallery(g => [...g, ev.target?.result as string])
      reader.readAsDataURL(file)
    })
  }

  // Completion
  const checks = [!!form.companyName, !!form.companyType, !!form.email, !!form.phone, !!form.headquarters, !!form.bio, expertise.length > 0, !!form.companySize, languages.length > 0, !!logoSrc, !!bannerSrc]
  const completion = Math.round((checks.filter(Boolean).length / checks.length) * 100)

  // Checklist items
  const checklistItems = [
    { label: 'Basic Information',  done: !!(form.companyName && form.companyType && form.email) },
    { label: 'About Your Company', done: !!(form.bio && expertise.length > 0) },
    { label: 'Company Details',    done: !!(form.companySize && languages.length > 0) },
    { label: 'Media & Branding',   done: !!(logoSrc && bannerSrc) },
    { label: 'Team Members',       done: false },
    { label: 'Review & Submit',    done: false },
  ]

  const SB_W = sidebarOpen ? 230 : 52

  return (
    <div style={{ display: 'flex', flexDirection: 'column' as const, height: '100vh', overflow: 'hidden', background: BG, fontFamily: M, color: '#F5F5F5' }}>

      {/* ── TOPNAV ── */}
      <header style={{ height: 60, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 14, padding: '0 24px', background: BG2, borderBottom: '1px solid rgba(255,255,255,0.06)', zIndex: 100 }}>
        <SilverScreensLogo size="md" href="/" showTagline={false} />
        <div style={{ flex: 1 }} />
        <button onClick={() => router.push('/agency/create-casting')} style={{ display: 'flex', alignItems: 'center', gap: 7, background: RED, color: '#fff', border: 'none', borderRadius: 8, padding: '0 18px', height: 36, fontSize: 15, fontWeight: 700, fontFamily: M, cursor: 'pointer', whiteSpace: 'nowrap' as const }}>
          Post a Casting <span style={{ fontSize: 16 }}>+</span>
        </button>
        <div onClick={() => router.push('/agency/messages')} style={{ position: 'relative' as const, cursor: 'pointer' }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MessageSquare size={15} color="rgba(255,255,255,0.7)" />
          </div>
          <div style={{ position: 'absolute' as const, top: -5, right: -5, background: RED, borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#fff', pointerEvents: 'none' }}>12</div>
        </div>
        <div onClick={() => router.push('/agency/notifications')} style={{ position: 'relative' as const, cursor: 'pointer' }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bell size={15} color="rgba(255,255,255,0.7)" />
          </div>
          <div style={{ position: 'absolute' as const, top: -5, right: -5, background: RED, borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#fff', pointerEvents: 'none' }}>3</div>
        </div>
        <div style={{ position: 'relative' as const }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer' }} onClick={() => setProfileOpen(v => !v)}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#1a1410,#2a1e0e)', border: `2px solid ${GOLD}60`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: GOLD, fontFamily: BEBAS }}>DP</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.2 }}>Dharma Productions</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>Production House</div>
            </div>
            <ChevronDown size={12} color="rgba(255,255,255,0.4)" />
          </div>
          {profileOpen && (
            <>
              <div onClick={() => setProfileOpen(false)} style={{ position: 'fixed' as const, inset: 0, zIndex: 150 }} />
              <div style={{ position: 'absolute' as const, top: 46, right: 0, width: 200, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, overflow: 'hidden', zIndex: 200, boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}>
                {[
                  { label: 'Company Profile',    href: '/agency-profile'  },
                  { label: 'Account Settings',   href: '/agency/settings' },
                  { label: 'Billing & Plans',    href: '/pricing'         },
                  { label: 'Support',            href: '/contact'         },
                  { label: 'Logout',             href: '/login'           },
                ].map(({ label, href }) => (
                  <div key={label} onClick={() => { router.push(href); setProfileOpen(false); }}
                    style={{ padding: '10px 16px', fontSize: 15, fontFamily: M, cursor: 'pointer', color: label === 'Logout' ? '#ff6b6b' : '#F5F5F5', borderTop: label === 'Logout' ? '1px solid rgba(255,255,255,0.07)' : 'none' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >{label}</div>
                ))}
              </div>
            </>
          )}
        </div>
      </header>

      {/* ── BODY ── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* ── COLLAPSIBLE SIDEBAR ── */}
        <aside style={{ width: SB_W, flexShrink: 0, background: BG2, borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column' as const, overflowY: 'auto' as const, overflowX: 'hidden', scrollbarWidth: 'none' as const, transition: 'width 0.2s ease' }}>
          <div style={{ height: 52, display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'flex-end' : 'center', padding: sidebarOpen ? '0 12px' : 0, borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
            <button onClick={() => setSidebarOpen(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', width: 30, height: 30, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            >{sidebarOpen ? <ChevronLeft size={16} /> : <Menu size={16} />}</button>
          </div>
          {sidebarOpen && (
            <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
              <div style={{ width: 38, height: 38, borderRadius: 9, flexShrink: 0, background: 'linear-gradient(135deg,#1a1410,#2a1e0e)', border: `1px solid ${GOLD}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: GOLD, fontFamily: BEBAS }}>DP</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#F5F5F5', whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis' }}>Dharma Productions</div>
                <div onClick={() => router.push('/agency-profile')} style={{ fontSize: 13, color: RED, fontWeight: 600, cursor: 'pointer' }}>View Profile</div>
              </div>
            </div>
          )}
          <nav style={{ flex: 1, padding: sidebarOpen ? '8px 6px' : '8px 4px', overflowY: 'auto' as const, scrollbarWidth: 'none' as const }}>
            {NAV_PRIMARY.map(({ icon: Icon, label, badge, href }) => (
              <div key={label} onClick={() => router.push(href)} title={!sidebarOpen ? label : undefined}
                style={{ display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'space-between' : 'center', padding: sidebarOpen ? '8px 10px' : '10px 0', marginBottom: 2, borderRadius: 6, cursor: 'pointer', background: 'transparent', position: 'relative' as const }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: sidebarOpen ? 9 : 0, justifyContent: 'center' }}>
                  <Icon size={15} color="rgba(255,255,255,0.42)" strokeWidth={1.8} />
                  {sidebarOpen && <span style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', whiteSpace: 'nowrap' as const }}>{label}</span>}
                </div>
                {sidebarOpen && badge && <div style={{ background: RED, color: '#fff', borderRadius: 10, fontSize: 13, fontWeight: 700, padding: '1px 6px' }}>{badge}</div>}
                {!sidebarOpen && badge && <div style={{ position: 'absolute' as const, top: 6, right: 4, background: RED, borderRadius: '50%', width: 14, height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: '#fff' }}>{badge}</div>}
              </div>
            ))}
          </nav>
        </aside>

        {/* ── MAIN CONTENT — single scroll ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' as const, overflow: 'hidden' }}>

          {/* Page heading */}
          <div style={{ padding: '20px 28px 0', flexShrink: 0 }}>
            <h1 style={{ fontFamily: BEBAS, fontSize: 28, letterSpacing: 1, color: '#F5F5F5', margin: '0 0 4px' }}>{isEditMode ? 'Edit Company Profile' : 'Create Company Profile'}</h1>
            <p style={{ fontFamily: M, fontSize: 14, color: '#6A7080', margin: 0 }}>{isEditMode ? 'Update your agency details — changes will go live after review' : 'Build your agency / production company profile to connect with top talent'}</p>
            {isEditMode && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'rgba(212,166,74,0.07)', border: '1px solid rgba(212,166,74,0.2)', borderRadius: 8, marginTop: 12 }}>
                <span style={{ fontSize: 16 }}>✏️</span>
                <span style={{ fontFamily: M, fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>You are editing your company profile. Changes will be reviewed before going live.</span>
                <button onClick={() => router.push('/agency-profile')} style={{ marginLeft: 'auto', background: 'none', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 6, padding: '5px 12px', color: 'rgba(255,255,255,0.5)', fontFamily: M, fontSize: 13, cursor: 'pointer', flexShrink: 0 }}>Cancel</button>
              </div>
            )}
          </div>

          {/* Scrollable form area */}
          <div style={{ flex: 1, overflowY: 'auto' as const, padding: '20px 28px 24px' }}>

            {/* ── Profile Completion bar ── */}
            <SectionCard style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: M, fontSize: 15, fontWeight: 700, color: '#F5F5F5', marginBottom: 4 }}>Profile Completion</div>
                  <div style={{ fontFamily: M, fontSize: 14, color: '#6A7080', marginBottom: 14 }}>Complete all sections to increase your visibility</div>
                  {/* Step progress */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                    {STEPS.map((step, i) => (
                      <div key={step.id} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                        <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 5 }}>
                          <div style={{
                            width: 32, height: 32, borderRadius: '50%',
                            background: i < activeStep ? GOLD : i === activeStep ? GOLD_DIM : BG3,
                            border: `2px solid ${i <= activeStep ? GOLD : 'rgba(255,255,255,0.1)'}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', transition: 'all 0.3s',
                          }} onClick={() => setActiveStep(i)}>
                            {i < activeStep
                              ? <span style={{ color: '#050505', fontSize: 14 }}>✓</span>
                              : <span style={{ fontFamily: M, fontSize: 14, fontWeight: 700, color: i === activeStep ? GOLD : '#6A7080' }}>{i < 3 ? '●' : i === 4 ? '○' : '○'}</span>
                            }
                          </div>
                          <span style={{ fontFamily: M, fontSize: 14, fontWeight: 600, color: i === activeStep ? GOLD : i < activeStep ? '#A8B0BD' : '#6A7080', whiteSpace: 'nowrap' as const }}>{step.label}</span>
                        </div>
                        {i < STEPS.length - 1 && (
                          <div style={{ flex: 1, height: 2, background: i < activeStep ? GOLD : 'rgba(255,255,255,0.08)', margin: '0 4px', marginBottom: 20, transition: 'background 0.3s' }} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ flexShrink: 0, marginLeft: 32 }}>
                  <Donut pct={completion} />
                </div>
              </div>
            </SectionCard>

            {/* ════ 1. BASIC INFORMATION ════ */}
            <SectionCard>
              <SectionTitle icon="👤" num={1} title="Basic Information" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                <div style={{ gridColumn: '1 / 2' }}>
                  <label style={lbl}>Company / Agency Name {reqStar}</label>
                  <input value={form.companyName} onChange={f('companyName')} style={inp()} />
                </div>
                <div>
                  <label style={lbl}>Company Type {reqStar}</label>
                  <select value={form.companyType} onChange={f('companyType')} style={sel}>
                    <option value=''>-- Select --</option>
                    {COMPANY_TYPES.map(t => <option key={t} value={t} style={{ background: BG2 }}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={lbl}>Established Year {reqStar}</label>
                  <div style={{ position: 'relative' as const }}>
                    <input value={form.establishedYear} onChange={f('establishedYear')} placeholder="2018" style={inp({ paddingRight: 36 })} />
                    <span style={{ position: 'absolute' as const, right: 12, top: '50%', transform: 'translateY(-50%)', opacity: 0.4, fontSize: 14 }}>📅</span>
                  </div>
                </div>
                <div>
                  <label style={lbl}>Website</label>
                  <input value={form.website} onChange={f('website')} style={inp()} />
                </div>
                <div>
                  <label style={lbl}>Email {reqStar}</label>
                  <input value={form.email} onChange={f('email')} style={inp()} />
                </div>
                <div>
                  <label style={lbl}>Phone Number {reqStar}</label>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <div style={{ ...inp({ width: 70, flexShrink: 0, padding: '10px 8px' }), display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ fontSize: 14 }}>🇮🇳</span>
                      <span style={{ color: '#A8B0BD', fontSize: 14 }}>▾</span>
                    </div>
                    <input value={form.phone} onChange={f('phone')} style={{ ...inp(), flex: 1 }} />
                  </div>
                </div>
                <div>
                  <label style={lbl}>Headquarters Location {reqStar}</label>
                  <input value={form.headquarters} onChange={f('headquarters')} style={inp()} />
                </div>
                <div style={{ gridColumn: '2 / 4' }}>
                  <label style={lbl}>Operating Cities</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6, padding: '8px 10px', background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, minHeight: 42 }}>
                    {operatingCities.map(c => (
                      <TagPill key={c} label={c} onRemove={() => setOperatingCities(operatingCities.filter(x => x !== c))} />
                    ))}
                    <input value={cityInput} onChange={e => setCityInput(e.target.value)}
                      onKeyDown={e => { if ((e.key === 'Enter' || e.key === ',') && cityInput.trim()) { setOperatingCities([...operatingCities, cityInput.trim()]); setCityInput('') } }}
                      placeholder="+ Add More" style={{ background: 'none', border: 'none', outline: 'none', color: '#A8B0BD', fontFamily: M, fontSize: 14, minWidth: 80 }} />
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* ════ 2. ABOUT YOUR COMPANY ════ */}
            <SectionCard>
              <SectionTitle icon="📝" num={2} title="About Your Company" />
              <div style={{ marginBottom: 18 }}>
                <label style={lbl}>Company Bio {reqStar}</label>
                <textarea value={form.bio} onChange={f('bio')} rows={5}
                  style={{ ...inp(), resize: 'vertical' as const, lineHeight: 1.7 }} />
                <div style={{ fontFamily: M, fontSize: 14, color: '#6A7080', marginTop: 4, textAlign: 'right' as const }}>{form.bio.length} / 500</div>
              </div>
              <div>
                <label style={{ ...lbl, marginBottom: 12 }}>Areas of Expertise (Select all that apply) {reqStar}</label>
                <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 8 }}>
                  {EXPERTISE_LIST.map(e => (
                    <ExpertiseCheckbox key={e} label={e} checked={expertise.includes(e)} onChange={() => toggle(expertise, setExpertise, e)} />
                  ))}
                  <button style={{ padding: '7px 14px', borderRadius: 6, border: '1px dashed rgba(255,255,255,0.15)', background: 'transparent', color: '#6A7080', fontFamily: M, fontSize: 14, cursor: 'pointer' }}>+ Other</button>
                </div>
              </div>
            </SectionCard>

            {/* ════ 3. COMPANY DETAILS ════ */}
            <SectionCard>
              <SectionTitle icon="🏢" num={3} title="Company Details" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={lbl}>Company Size {reqStar}</label>
                  <select value={form.companySize} onChange={f('companySize')} style={sel}>
                    <option value=''>-- Select --</option>
                    {COMPANY_SIZES.map(s => <option key={s} value={s} style={{ background: BG2 }}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={lbl}>Languages We Work In {reqStar}</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6, padding: '6px 10px', background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, minHeight: 42 }}>
                    {languages.map(lang => <TagPill key={lang} label={lang} onRemove={() => setLanguages(languages.filter(x => x !== lang))} />)}
                    <select onChange={e => { if (e.target.value && !languages.includes(e.target.value)) setLanguages([...languages, e.target.value]); e.target.value = '' }}
                      style={{ background: 'none', border: 'none', outline: 'none', color: '#A8B0BD', fontFamily: M, fontSize: 14, cursor: 'pointer' }}>
                      <option value="">+ Add More</option>
                      {LANGUAGES_LIST.filter(l => !languages.includes(l)).map(l => <option key={l} value={l} style={{ background: BG2 }}>{l}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Genres */}
              <div style={{ marginBottom: 16 }}>
                <label style={lbl}>Genres We Work In {reqStar}</label>
                <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6 }}>
                  {genres.map(g => <TagPill key={g} label={g} onRemove={() => setGenres(genres.filter(x => x !== g))} />)}
                  <select onChange={e => { if (e.target.value && !genres.includes(e.target.value)) setGenres([...genres, e.target.value]); e.target.value = '' }}
                    style={{ background: 'none', border: '1px dashed rgba(212,166,74,0.3)', borderRadius: 16, outline: 'none', color: GOLD, fontFamily: M, fontSize: 14, cursor: 'pointer', padding: '4px 10px' }}>
                    <option value="">+ Add More</option>
                    {GENRES_LIST.filter(g => !genres.includes(g)).map(g => <option key={g} value={g} style={{ background: BG2 }}>{g}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={lbl}>Company Registration Number</label>
                  <input value={form.regNo} onChange={f('regNo')} style={inp()} />
                </div>
                <div>
                  <label style={lbl}>GST Number</label>
                  <input value={form.gst} onChange={f('gst')} style={inp()} />
                </div>
                <div>
                  <label style={lbl}>PAN Number</label>
                  <input value={form.pan} onChange={f('pan')} style={inp()} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={lbl}>Production Arm / Subsidiary (if any)</label>
                  <input value={form.subsidiary} onChange={f('subsidiary')} style={inp()} />
                </div>
                <div>
                  <label style={lbl}>Do you provide talent management? {reqStar}</label>
                  <div style={{ display: 'flex', gap: 24, paddingTop: 10 }}>
                    {['yes', 'no'].map(v => (
                      <label key={v} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                        <div onClick={() => setForm(p => ({ ...p, talentManagement: v }))}
                          style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${form.talentManagement === v ? GOLD : 'rgba(255,255,255,0.2)'}`, background: form.talentManagement === v ? GOLD_DIM : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                          {form.talentManagement === v && <div style={{ width: 8, height: 8, borderRadius: '50%', background: GOLD }} />}
                        </div>
                        <span style={{ fontFamily: M, fontSize: 14, color: '#A8B0BD', textTransform: 'capitalize' as const }}>{v}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* ════ 4. MEDIA & BRANDING ════ */}
            <SectionCard>
              <SectionTitle icon="🎨" num={4} title="Media & Branding" />

              {/* Logo + Banner row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
                {/* Logo */}
                <div>
                  <label style={lbl}>Company Logo {reqStar}</label>
                  <input ref={logoRef} type="file" accept="image/*" onChange={handleImg(setLogoSrc)} style={{ display: 'none' }} />
                  <div style={{ position: 'relative' as const, width: 140, height: 140, background: BG3, border: `1px solid rgba(255,255,255,0.1)`, borderRadius: 10, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {logoSrc
                      ? <img src={logoSrc} style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt="logo" />
                      : <div style={{ textAlign: 'center' as const }}>
                          <div style={{ fontSize: 32, marginBottom: 4, opacity: 0.3 }}>🏢</div>
                          <div style={{ fontFamily: M, fontSize: 14, color: '#6A7080' }}>No logo</div>
                        </div>
                    }
                    <button onClick={() => logoRef.current?.click()} style={{ position: 'absolute' as const, bottom: 8, left: '50%', transform: 'translateX(-50%)', padding: '5px 14px', background: 'rgba(0,0,0,0.7)', border: `1px solid ${GOLD_BORDER}`, borderRadius: 5, color: GOLD, fontFamily: M, fontSize: 14, cursor: 'pointer', whiteSpace: 'nowrap' as const }}>
                      {logoSrc ? 'Change Logo' : 'Upload Logo'}
                    </button>
                  </div>
                  <div style={{ fontFamily: M, fontSize: 14, color: '#6A7080', marginTop: 6 }}>JPG, PNG or SVG. Max size 2MB</div>
                </div>

                {/* Banner */}
                <div>
                  <label style={lbl}>Cover Banner {reqStar}</label>
                  <input ref={bannerRef} type="file" accept="image/*" onChange={handleImg(setBannerSrc)} style={{ display: 'none' }} />
                  <div style={{ position: 'relative' as const, height: 140, background: bannerSrc ? 'transparent' : BG3, border: `1px solid rgba(255,255,255,0.1)`, borderRadius: 10, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {bannerSrc
                      ? <img src={bannerSrc} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="banner" />
                      : <div style={{ textAlign: 'center' as const }}>
                          <div style={{ fontSize: 28, opacity: 0.3 }}>🎬</div>
                          <div style={{ fontFamily: M, fontSize: 14, color: '#6A7080' }}>No banner</div>
                        </div>
                    }
                    <button onClick={() => bannerRef.current?.click()} style={{ position: 'absolute' as const, bottom: 8, right: 10, padding: '5px 14px', background: 'rgba(0,0,0,0.7)', border: `1px solid ${GOLD_BORDER}`, borderRadius: 5, color: GOLD, fontFamily: M, fontSize: 14, cursor: 'pointer', whiteSpace: 'nowrap' as const }}>
                      {bannerSrc ? 'Change Banner' : 'Upload Banner'}
                    </button>
                  </div>
                  <div style={{ fontFamily: M, fontSize: 14, color: '#6A7080', marginTop: 6 }}>Recommended size: 2400 × 800 px. Max size 5MB</div>
                </div>
              </div>

              {/* Company Gallery */}
              <div style={{ marginBottom: 24 }}>
                <label style={lbl}>Company Gallery</label>
                <div style={{ fontFamily: M, fontSize: 14, color: '#6A7080', marginBottom: 10 }}>Add images that showcase your work environment, events or team.</div>
                <input ref={galleryRef} type="file" accept="image/*" multiple onChange={handleGallery} style={{ display: 'none' }} />
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' as const }}>
                  {gallery.map((src, i) => (
                    <div key={i} style={{ width: 100, height: 80, borderRadius: 8, overflow: 'hidden', position: 'relative' as const, background: BG3, flexShrink: 0 }}>
                      <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                      <button onClick={() => setGallery(gallery.filter((_, j) => j !== i))} style={{ position: 'absolute' as const, top: 4, right: 4, width: 20, height: 20, borderRadius: '50%', background: 'rgba(0,0,0,0.7)', border: 'none', color: '#fff', fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                    </div>
                  ))}
                  {gallery.length < 6 && (
                    <div onClick={() => galleryRef.current?.click()} style={{ width: 100, height: 80, borderRadius: 8, border: '1px dashed rgba(255,255,255,0.15)', background: BG3, display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: 4 }}>
                      <span style={{ fontSize: 20, color: '#6A7080' }}>+</span>
                      <span style={{ fontFamily: M, fontSize: 14, color: '#6A7080' }}>Add More</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Showreel */}
              <div>
                <label style={lbl}>Showreel / Intro Video (Optional)</label>
                <div style={{ fontFamily: M, fontSize: 14, color: '#6A7080', marginBottom: 10 }}>Upload a video that represents your company's work and style.</div>
                <input ref={videoRef} type="file" accept="video/*" onChange={e => { const f = e.target.files?.[0]; if (f) setVideoName(f.name) }} style={{ display: 'none' }} />
                {videoName ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', background: BG3, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 8, background: GOLD_DIM, border: `1px solid ${GOLD_BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ color: GOLD, fontSize: 18 }}>▶</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: M, fontSize: 14, color: '#F5F5F5', marginBottom: 2 }}>{videoName}</div>
                      <div style={{ fontFamily: M, fontSize: 14, color: '#6A7080' }}>1920 × 1080 · Video file</div>
                    </div>
                    <button onClick={() => videoRef.current?.click()} style={{ padding: '7px 14px', background: 'transparent', border: `1px solid ${GOLD_BORDER}`, borderRadius: 6, color: GOLD, fontFamily: M, fontSize: 14, cursor: 'pointer' }}>Change Video</button>
                  </div>
                ) : (
                  <div onClick={() => videoRef.current?.click()} style={{ border: '1px dashed rgba(255,255,255,0.12)', borderRadius: 8, padding: '28px', textAlign: 'center' as const, cursor: 'pointer', background: BG3 }}>
                    <div style={{ fontSize: 28, marginBottom: 6, opacity: 0.4 }}>🎥</div>
                    <div style={{ fontFamily: M, fontSize: 14, color: '#A8B0BD', marginBottom: 3 }}>Upload Showreel / Intro Video</div>
                    <div style={{ fontFamily: M, fontSize: 14, color: '#6A7080' }}>MP4, MOV up to 500MB</div>
                  </div>
                )}
              </div>
            </SectionCard>

            {/* ════ 5. SOCIAL LINKS ════ */}
            <SectionCard>
              <SectionTitle icon="🔗" num={5} title="Social Links" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                <div>
                  <label style={lbl}>Instagram</label>
                  <input value={form.instagram} onChange={f('instagram')} placeholder="https://instagram.com/..." style={inp()} />
                </div>
                <div>
                  <label style={lbl}>Facebook</label>
                  <input value={form.facebook} onChange={f('facebook')} placeholder="https://facebook.com/..." style={inp()} />
                </div>
                <div>
                  <label style={lbl}>LinkedIn</label>
                  <input value={form.linkedin} onChange={f('linkedin')} placeholder="https://linkedin.com/..." style={inp()} />
                </div>
                <div>
                  <label style={lbl}>YouTube</label>
                  <input value={form.youtube} onChange={f('youtube')} placeholder="https://youtube.com/..." style={inp()} />
                </div>
                <div>
                  <label style={lbl}>X (Twitter)</label>
                  <input value={form.twitter} onChange={f('twitter')} placeholder="https://twitter.com/..." style={inp()} />
                </div>
              </div>
            </SectionCard>

          </div>{/* end scrollable form area */}

          {/* ── BOTTOM ACTION BAR ── */}
          <div style={{ flexShrink: 0, background: BG2, borderTop: '1px solid rgba(255,255,255,0.07)', padding: '14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 10 }}>
            <div style={{ fontFamily: M, fontSize: 14, color: '#6A7080' }}>Our team will review your profile. You'll be notified once it's live.</div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button style={{ padding: '11px 28px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, color: '#A8B0BD', fontFamily: M, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                Save as Draft
              </button>
              <button onClick={() => {
                try { localStorage.setItem('ss_agency_profile_draft', JSON.stringify({ editMode: false })) } catch {}
                router.push(isEditMode ? '/agency-profile' : '/pricing?for=agency')
              }} style={{ padding: '11px 28px', background: GOLD, border: 'none', borderRadius: 8, color: '#050505', fontFamily: M, fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: `0 6px 20px rgba(212,166,74,0.3)`, display: 'flex', alignItems: 'center', gap: 8 }}>
                {isEditMode ? 'Save Changes' : 'Submit for Review'} <span>→</span>
              </button>
            </div>
          </div>

        </div>{/* end main content */}
      </div>{/* end body */}
    </div>
  )
}