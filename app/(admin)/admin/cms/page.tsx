'use client';
import AdminSidebar from '@/components/layout/AdminSidebar';

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminTopnav from '@/components/layout/AdminTopnav'
import SilverScreensLogo from '@/components/ui/SilverScreensLogo'
import {
  LayoutDashboard, Users, Building2, Megaphone, FileText,
  BarChart2, ShieldCheck, Flag, CreditCard, Wallet,
  Database, Settings, ScrollText, Bell, ChevronRight,
  ChevronLeft, Menu, ChevronDown, MessageSquare,
  BadgeCheck, UserCheck, BellRing, Ticket, KeyRound,
  Eye, Edit, Copy, MoreVertical, Search, Filter, X,
  Globe, Image, HelpCircle, Layers, Plus, ExternalLink,
  PieChart, Link, AlignLeft, Layout, RefreshCw,
} from 'lucide-react'
/* ─── Design tokens (match admin dashboard exactly) ─────────── */
const BG       = '#0D1117'
const BG2      = '#131720'
const BG3      = '#181E2A'
const BG4      = '#1C2338'
const GOLD     = '#D4A64A'
const GOLD_DIM = 'rgba(212,166,74,0.12)'
const GOLD_BDR = 'rgba(212,166,74,0.22)'
const BEBAS    = "'Bebas Neue', sans-serif"
const BARLOW   = "'Barlow Condensed', sans-serif"
const GREEN    = '#22C55E'
const RED      = '#EF4444'
const BLUE     = '#3B82F6'
const PURPLE   = '#8B5CF6'
const ORANGE   = '#F97316'
const TEAL     = '#14B8A6'

/* ─── Sidebar nav ────────────────────────────────────────────── */

const PROFILE_MENU = [
  { label: 'My Profile',               href: '/admin/profile'          },
  { label: 'Account Settings',         href: '/admin/account-settings' },
  { label: 'Security & Login',         href: '/admin/security-login'   },
  { label: 'Notification Preferences', href: '/admin/notifications'    },
  { label: 'Activity Log',             href: '/admin/activity-log'     },
  { label: 'Help & Support',           href: '/admin/help-support'     },
  { label: 'Logout',                   href: '/login'                  },
];

/* ─── CMS Data ───────────────────────────────────────────────── */
const CMS_ITEMS = [
  // href = actual built route | null = page not built yet (shows 404)
  { id: 1,  icon: '📄', title: 'About SilverScreens',         slug: '/about-silverscreens',       type: 'Page',   section: 'Company',        status: 'Published', updated: 'May 21, 2025 11:32 AM', by: 'Super Admin',     href: '/about'              },
  { id: 2,  icon: '📄', title: 'How It Works',                slug: '/how-it-works',              type: 'Page',   section: 'Help & Support', status: 'Published', updated: 'May 20, 2025 04:15 PM', by: 'Super Admin',     href: null                  },
  { id: 3,  icon: '📄', title: 'Terms & Conditions',          slug: '/terms-and-conditions',      type: 'Page',   section: 'Legal',          status: 'Published', updated: 'May 18, 2025 09:45 AM', by: 'Super Admin',     href: '/terms'              },
  { id: 4,  icon: '📄', title: 'Privacy Policy',              slug: '/privacy-policy',            type: 'Page',   section: 'Legal',          status: 'Published', updated: 'May 18, 2025 09:40 AM', by: 'Super Admin',     href: '/privacy-policy'     },
  { id: 5,  icon: '📄', title: 'For Talent (Aspirants)',      slug: '/for-aspirants',             type: 'Page',   section: 'Landing Pages',  status: 'Published', updated: 'May 17, 2025 02:20 PM', by: 'Content Manager', href: '/signup'             },
  { id: 6,  icon: '📄', title: 'For Agencies',                slug: '/for-agencies',              type: 'Page',   section: 'Landing Pages',  status: 'Published', updated: 'May 17, 2025 02:18 PM', by: 'Content Manager', href: '/signup'             },
  { id: 7,  icon: '🖼️', title: 'Home Banner – Main Slider',  slug: '/banner/home-main-slider',   type: 'Banner', section: 'Home',           status: 'Published', updated: 'May 21, 2025 10:05 AM', by: 'Marketing Admin', href: '/'                   },
  { id: 8,  icon: '🖼️', title: 'Aspirant Onboarding Banner', slug: '/banner/aspirant-onboarding',type: 'Banner', section: 'Aspirant',       status: 'Published', updated: 'May 20, 2025 03:50 PM', by: 'Marketing Admin', href: '/dashboard'          },
  { id: 9,  icon: '🖼️', title: 'Agency Dashboard Banner',    slug: '/banner/agency-dashboard',   type: 'Banner', section: 'Agency',         status: 'Draft',     updated: 'May 19, 2025 01:25 PM', by: 'Marketing Admin', href: '/agency/dashboard'   },
  { id: 10, icon: '❓', title: 'Frequently Asked Questions',  slug: '/faq',                       type: 'FAQ',    section: 'Help & Support', status: 'Published', updated: 'May 21, 2025 11:00 AM', by: 'Content Manager', href: '/faq'                },
  { id: 11, icon: '❓', title: 'Subscription FAQs',           slug: '/faq/subscription',          type: 'FAQ',    section: 'Help & Support', status: 'Published', updated: 'May 19, 2025 09:20 AM', by: 'Content Manager', href: '/faq'                },
  { id: 12, icon: '🌐', title: 'Contact Us',                  slug: '/contact',                   type: 'Page',   section: 'Company',        status: 'Published', updated: 'May 16, 2025 03:10 PM', by: 'Super Admin',     href: '/contact'            },
  { id: 13, icon: '📄', title: 'Cookie Policy',               slug: '/cookie-policy',             type: 'Page',   section: 'Legal',          status: 'Published', updated: 'May 15, 2025 11:45 AM', by: 'Super Admin',     href: '/cookie-policy'      },
  { id: 14, icon: '🖼️', title: 'Pricing Page Banner',        slug: '/banner/pricing',            type: 'Banner', section: 'Pricing',        status: 'Draft',     updated: 'May 14, 2025 02:30 PM', by: 'Marketing Admin', href: '/pricing'            },
]

const QUICK_LINKS = [
  { label: 'Site Settings',   href: '/admin/settings',         icon: Settings  },
  { label: 'Audit Logs',      href: '/admin/audit',            icon: ScrollText},
  { label: 'Notifications',   href: '/admin/notifications',    icon: Bell      },
  { label: 'Email Templates', href: '/admin/email-templates',  icon: MessageSquare },
  { label: 'SMS Templates',   href: '/admin/sms-templates',    icon: MessageSquare },
]

const RECENT_ACTIVITY = [
  { color: GREEN,  text: 'About SilverScreens page updated',  time: 'May 21, 2025 11:32 AM' },
  { color: BLUE,   text: 'Home Banner – Main Slider published', time: 'May 21, 2025 10:05 AM' },
  { color: TEAL,   text: 'FAQ section added',                  time: 'May 20, 2025 04:20 PM' },
  { color: PURPLE, text: 'Privacy Policy page updated',        time: 'May 18, 2025 09:42 AM' },
]

const TYPE_COLORS: Record<string, string> = {
  Page:   PURPLE,
  Banner: BLUE,
  FAQ:    TEAL,
}
const STATUS_COLORS: Record<string, string> = {
  Published: GREEN,
  Draft:     ORANGE,
  Inactive:  RED,
}

// DONUT_DATA is now computed dynamically inside ContentDonut component
const DONUT_DATA_STATIC = [
  { label: 'Pages',   value: 0, pct: 25, color: PURPLE },
  { label: 'Banners', value: 0, pct: 25, color: BLUE   },
  { label: 'FAQs',    value: 0, pct: 25, color: TEAL   },
  { label: 'Others',  value: 0, pct: 25, color: ORANGE },
]

function ContentDonut({ data }: { data: { label: string; value: number; pct: number; color: string }[] }) {
  const cx = 70, cy = 70, R = 58, r = 36
  const toRad = (d: number) => (d * Math.PI) / 180
  const pt = (a: number, rad: number) => [cx + rad * Math.cos(toRad(a)), cy + rad * Math.sin(toRad(a))]
  let start = -90
  const arcs = data.map(seg => {
    const sweep = (seg.pct / 100) * 360
    const end = start + sweep
    const large = sweep > 180 ? 1 : 0
    const [x1, y1] = pt(start, R); const [x2, y2] = pt(end, R)
    const [x3, y3] = pt(end, r);   const [x4, y4] = pt(start, r)
    const d = `M ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${r} ${r} 0 ${large} 0 ${x4} ${y4} Z`
    start = end + 1.5
    return { ...seg, d }
  })
  return (
    <svg viewBox="0 0 140 140" style={{ width: 140, height: 140, flexShrink: 0 }}>
      <circle cx={cx} cy={cy} r={r - 1} fill={BG3} />
      {arcs.map(a => <path key={a.label} d={a.d} fill={a.color} />)}
    </svg>
  )
}

function ContentEditorModal({
  item, onClose, onSave,
}: {
  item: typeof CMS_ITEMS[0] | null;
  onClose: () => void;
  onSave: (updated: typeof CMS_ITEMS[0]) => void;
}) {
  const isNew = !item
  const [title,   setTitle]   = useState(item?.title   || '')
  const [slug,    setSlug]    = useState(item?.slug     || '')
  const [type,    setType]    = useState(item?.type     || 'Page')
  const [section, setSection] = useState(item?.section  || 'Company')
  const [status,  setStatus]  = useState(item?.status   || 'Draft')
  const [content, setContent] = useState('')

  const inp: React.CSSProperties = {
    width: '100%', background: '#1C2338', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 7, padding: '9px 12px', color: '#F5F5F5',
    fontFamily: "'Barlow Condensed', sans-serif", fontSize: 15, outline: 'none',
    boxSizing: 'border-box' as const,
  }
  const lbl: React.CSSProperties = {
    display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 5,
  }
  const sel: React.CSSProperties = {
    ...inp, cursor: 'pointer', appearance: 'none' as const,
  }

  const handleSave = () => {
    if (!title.trim() || !slug.trim()) return
    const now = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
    const saved = {
      id:      item?.id || Date.now(),
      icon:    item?.icon || '📄',
      title:   title.trim(),
      slug:    slug.trim().startsWith('/') ? slug.trim() : `/${slug.trim()}`,
      type, section, status,
      updated: now,
      by:      'Super Admin',
      href:    item?.href || null,
    }
    onSave(saved as typeof CMS_ITEMS[0])
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 600,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: '#131720', border: '1px solid rgba(212,166,74,0.2)',
        borderRadius: 14, width: '100%', maxWidth: 680, maxHeight: '90vh',
        overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.8)' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '18px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)',
          position: 'sticky', top: 0, background: '#131720', zIndex: 1 }}>
          <div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: 1 }}>
              {isNew ? 'ADD NEW CONTENT' : 'EDIT CONTENT'}
            </div>
            {!isNew && <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{item?.slug}</div>}
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: 4 }}>
            <span style={{ fontSize: 20 }}>✕</span>
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Title */}
          <div>
            <label style={lbl}>Title <span style={{ color: '#EF4444' }}>*</span></label>
            <input value={title} onChange={e => setTitle(e.target.value)} style={inp} placeholder="e.g. About SilverScreens" />
          </div>

          {/* Slug */}
          <div>
            <label style={lbl}>URL Slug <span style={{ color: '#EF4444' }}>*</span></label>
            <input value={slug} onChange={e => setSlug(e.target.value)} style={inp} placeholder="e.g. /about-silverscreens" />
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>
              Must start with /. This is the URL path for the page.
            </div>
          </div>

          {/* Type + Section row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={lbl}>Content Type</label>
              <select value={type} onChange={e => setType(e.target.value)} style={sel}>
                {['Page', 'Banner', 'FAQ'].map(o => <option key={o} style={{ background: '#181E2A' }}>{o}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>Section</label>
              <select value={section} onChange={e => setSection(e.target.value)} style={sel}>
                {['Company','Legal','Home','Aspirant','Agency','Landing Pages','Help & Support','Pricing'].map(o =>
                  <option key={o} style={{ background: '#181E2A' }}>{o}</option>
                )}
              </select>
            </div>
          </div>

          {/* Status */}
          <div>
            <label style={lbl}>Status</label>
            <div style={{ display: 'flex', gap: 10 }}>
              {['Published', 'Draft', 'Inactive'].map(s => (
                <button key={s} onClick={() => setStatus(s)}
                  style={{ padding: '7px 18px', borderRadius: 7, fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: 14, fontWeight: 700, cursor: 'pointer', border: 'none',
                    background: status === s
                      ? s === 'Published' ? '#22C55E' : s === 'Draft' ? '#F97316' : '#EF4444'
                      : 'rgba(255,255,255,0.07)',
                    color: status === s ? '#fff' : 'rgba(255,255,255,0.5)',
                  }}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Content editor */}
          <div>
            <label style={lbl}>Content / Notes</label>
            <textarea value={content} onChange={e => setContent(e.target.value)}
              placeholder="Add page content, banner notes, or FAQ answers here..."
              rows={6}
              style={{ ...inp, resize: 'vertical' as const, lineHeight: 1.6 }} />
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>
              A full rich-text editor (WYSIWYG) will be integrated in a future release.
            </div>
          </div>

        </div>

        {/* Footer */}
        <div style={{ display: 'flex', gap: 10, padding: '14px 24px',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          position: 'sticky', bottom: 0, background: '#131720' }}>
          <button onClick={onClose}
            style={{ flex: 1, padding: 10, background: '#181E2A', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 7, color: 'rgba(255,255,255,0.6)', fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 15, cursor: 'pointer' }}>
            Cancel
          </button>
          <button onClick={handleSave} disabled={!title.trim() || !slug.trim()}
            style={{ flex: 2, padding: 10, background: !title.trim()||!slug.trim() ? 'rgba(139,92,246,0.3)' : '#8B5CF6',
              border: 'none', borderRadius: 7, color: '#fff',
              fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: 1,
              cursor: !title.trim()||!slug.trim() ? 'not-allowed' : 'pointer' }}>
            {isNew ? 'Add Content' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}


function CMSToast({ msg, type }: { msg: string; type: 'success'|'info' }) {
  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 999, padding: '12px 20px', borderRadius: 10,
      background: type === 'success' ? 'rgba(34,197,94,0.15)' : 'rgba(139,92,246,0.15)',
      border: `1px solid ${type === 'success' ? GREEN : PURPLE}`,
      color: type === 'success' ? GREEN : PURPLE,
      fontFamily: BARLOW, fontSize: 15, fontWeight: 600, boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}>
      {type === 'success' ? '✓' : 'ℹ'} {msg}
    </div>
  )
}

export default function CMSManagementPage() {
  const router = useRouter()
  const [sidebarOpen,  setSidebarOpen]  = useState(false)
  const [search,       setSearch]       = useState('')
  const [typeFilter,   setTypeFilter]   = useState('All Types')
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [sectionFilter,setSectionFilter]= useState('All Sections')
  const [perPage,      setPerPage]      = useState(10)
  const [page,         setPage]         = useState(1)
  const [actionMenu,   setActionMenu]   = useState<number | null>(null)
  const [items,        setItems]        = useState(CMS_ITEMS)
  const [flashId,      setFlashId]      = useState<number | null>(null)
  const [toast,        setToast]        = useState<{ msg: string; type: 'success'|'info' } | null>(null)
  const [editItem,     setEditItem]     = useState<typeof CMS_ITEMS[0] | null>(null)
  const [addNew,       setAddNew]       = useState(false)

  const showToast = (msg: string, type: 'success'|'info' = 'info') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  // Load persisted CMS items from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('ss_cms_config')
      if (raw) setItems(JSON.parse(raw))
    } catch {}
  }, [])

  // Persist items to localStorage and flash the changed row
  const persistItems = (next: typeof CMS_ITEMS) => {
    setItems(next)
    localStorage.setItem('ss_cms_config', JSON.stringify(next))
  }

  const updateStatus = (id: number, status: string) => {
    persistItems(items.map(i => i.id === id ? { ...i, status, updated: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }), by: 'Super Admin' } : i))
    setFlashId(id)
    setTimeout(() => setFlashId(null), 1500)
  }

  const deleteItem = (id: number) => {
    if (!confirm('Delete this content item? This cannot be undone.')) return
    persistItems(items.filter(i => i.id !== id))
  }

  const duplicateItem = (item: typeof CMS_ITEMS[0]) => {
    const newId = Math.max(...items.map(i => i.id)) + 1
    const copy = { ...item, id: newId, title: `${item.title} (Copy)`, slug: `${item.slug}-copy`, status: 'Draft', updated: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }), by: 'Super Admin' }
    persistItems([...items, copy])
    setFlashId(newId)
    setTimeout(() => setFlashId(null), 1500)
  }

  const filtered = items.filter(item => {
    const matchSearch  = item.title.toLowerCase().includes(search.toLowerCase()) || item.slug.toLowerCase().includes(search.toLowerCase())
    const matchType    = typeFilter   === 'All Types'    || item.type    === typeFilter
    const matchStatus  = statusFilter === 'All Status'   || item.status  === statusFilter
    const matchSection = sectionFilter === 'All Sections' || item.section === sectionFilter
    return matchSearch && matchType && matchStatus && matchSection
  })

  const totalPages = Math.ceil(filtered.length / perPage)
  const paginated  = filtered.slice((page - 1) * perPage, page * perPage)

  // Compute donut chart data from actual items
  const pages   = items.filter(i => i.type === 'Page').length
  const banners = items.filter(i => i.type === 'Banner').length
  const faqs    = items.filter(i => i.type === 'FAQ').length
  const others  = items.filter(i => !['Page','Banner','FAQ'].includes(i.type)).length
  const totalItems = pages + banners + faqs + others || 1
  const donutData = [
    { label: 'Pages',   value: pages,   pct: Math.round(pages   / totalItems * 100), color: PURPLE },
    { label: 'Banners', value: banners, pct: Math.round(banners / totalItems * 100), color: BLUE   },
    { label: 'FAQs',    value: faqs,    pct: Math.round(faqs    / totalItems * 100), color: TEAL   },
    { label: 'Others',  value: others,  pct: Math.round(others  / totalItems * 100), color: ORANGE },
  ]

  // Compute recent activity from last 4 changed items
  const recentActivity = [...items]
    .sort((a, b) => { try { return new Date(b.updated).getTime() - new Date(a.updated).getTime() } catch { return 0 } })
    .slice(0, 4)
    .map(i => ({
      color: STATUS_COLORS[i.status] || PURPLE,
      text: `${i.title} — ${i.status}`,
      time: i.updated,
    }))


  const handleView = (item: typeof CMS_ITEMS[0]) => {
    if (item.href) {
      // Public pages open in new tab so admin doesn't lose context
      const publicPaths = ['/', '/about', '/contact', '/faq', '/terms', '/privacy-policy', '/cookie-policy', '/signup', '/pricing', '/explore-talents', '/casting-calls']
      if (publicPaths.some(p => item.href === p || item.href?.startsWith(p))) {
        window.open(item.href, '_blank')
      } else {
        router.push(item.href)
      }
    } else {
      showToast(`"${item.title}" page is not yet built.`, 'info')
    }
  }

  const clearFilters = () => {
    setSearch(''); setTypeFilter('All Types'); setStatusFilter('All Status'); setSectionFilter('All Sections'); setPage(1)
  }

  const selStyle = {
    background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6,
    color: '#F5F5F5', fontFamily: BARLOW, fontSize: 15, padding: '7px 28px 7px 10px',
    outline: 'none', cursor: 'pointer', appearance: 'none' as const,
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath fill='%23A8B0BD' d='M5 7L1 3h8z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center', backgroundSize: '10px',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' as const, height: '100vh', overflow: 'hidden', background: BG, fontFamily: BARLOW, color: '#F5F5F5' }}>

      {/* ══ TOPNAV ══ */}
      <AdminTopnav />

      {/* ══ BODY ══ */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* ── COLLAPSIBLE SIDEBAR ── */}
        <AdminSidebar />

        {/* ── MAIN CONTENT ── */}
        <div style={{ flex: 1, overflowY: 'auto' as const, padding: '18px 20px 32px', display: 'flex', flexDirection: 'column' as const, gap: 14 }} onClick={() => actionMenu !== null && setActionMenu(null)}>

          {/* Page header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              {/* Breadcrumb */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
                <span onClick={() => router.push('/admin/dashboard')} style={{ cursor: 'pointer' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
                >Home</span>
                <ChevronRight size={12} />
                <span style={{ color: 'rgba(255,255,255,0.7)' }}>CMS Management</span>
              </div>
              <h1 style={{ fontFamily: BEBAS, fontSize: 30, letterSpacing: 1, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                CMS Management
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: PURPLE, display: 'inline-block', marginBottom: 4 }} />
              </h1>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', margin: '3px 0 0' }}>Manage static pages, banners, FAQs and other CMS content across the platform.</p>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <button onClick={() => showToast('Categories manager coming soon.', 'info')} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 7, color: '#F5F5F5', fontFamily: BARLOW, fontSize: 15, cursor: 'pointer' }}>
                <Layers size={14} /> Categories
              </button>
              <button onClick={() => window.open('/', '_blank')} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 7, color: '#F5F5F5', fontFamily: BARLOW, fontSize: 15, cursor: 'pointer' }}>
                <Eye size={14} /> Preview Site
              </button>
              <button onClick={() => setAddNew(true)} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px', background: PURPLE, border: 'none', borderRadius: 7, color: '#fff', fontFamily: BARLOW, fontSize: 15, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(139,92,246,0.3)' }}>
                <Plus size={15} /> Add New Content
              </button>
            </div>
          </div>

          {/* Stat cards — computed from actual items */}
          {(() => {
            const pages   = items.filter(i => i.type === 'Page')
            const banners = items.filter(i => i.type === 'Banner')
            const faqs    = items.filter(i => i.type === 'FAQ')
            const sections = [...new Set(items.map(i => i.section))].length
            const lastUpdated = items.reduce((latest, i) => {
              try { return new Date(i.updated) > new Date(latest) ? i.updated : latest } catch { return latest }
            }, items[0]?.updated || '')
            const lastDate = lastUpdated ? new Date(lastUpdated).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }) : '—'
            const lastTime = lastUpdated ? new Date(lastUpdated).toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' }) : ''
            const statCards = [
              { icon: '📄', label: 'Total Pages',  value: pages.length,   sub: `Published: ${pages.filter(i=>i.status==='Published').length}  Draft: ${pages.filter(i=>i.status==='Draft').length}`, color: PURPLE },
              { icon: '🖼️', label: 'Banners',      value: banners.length, sub: `Active: ${banners.filter(i=>i.status==='Published').length}  Draft: ${banners.filter(i=>i.status==='Draft').length}`, color: BLUE   },
              { icon: '❓', label: 'FAQs',          value: faqs.length,    sub: `Published: ${faqs.filter(i=>i.status==='Published').length}  Draft: ${faqs.filter(i=>i.status==='Draft').length}`, color: TEAL   },
              { icon: '🌐', label: 'Site Sections', value: sections,       sub: `Across ${items.length} items`, color: ORANGE },
              { icon: '🕐', label: 'Last Updated',  value: null,           sub: lastTime, color: GOLD, dateStr: lastDate },
            ]
            return (
              <div style={{ display: 'flex', gap: 10 }}>
                {statCards.map((s, i) => (
                  <div key={i} style={{ flex: 1, background: BG3, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 10, background: `${s.color}22`, border: `1px solid ${s.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{s.icon}</div>
                    <div>
                      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 3 }}>{s.label}</div>
                      {s.value !== null
                        ? <div style={{ fontFamily: BEBAS, fontSize: 28, color: '#F5F5F5', lineHeight: 1, letterSpacing: 0.5 }}>{s.value}</div>
                        : <div style={{ fontFamily: BEBAS, fontSize: 18, color: '#F5F5F5', lineHeight: 1.2 }}>{(s as any).dateStr}<br /><span style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>{s.sub}</span></div>
                      }
                      {s.value !== null && <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginTop: 3 }}>{s.sub}</div>}
                    </div>
                  </div>
                ))}
              </div>
            )
          })()}

          {/* Main area: table + right panel */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 14 }}>

            {/* LEFT — Table */}
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 0, background: BG3, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, overflow: 'hidden' }}>

              {/* Filters row */}
              <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' as const }}>
                {/* Search */}
                <div style={{ position: 'relative' as const, flex: 1, minWidth: 180 }}>
                  <Search size={13} color="rgba(255,255,255,0.3)" style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)' }} />
                  <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
                    placeholder="Search by title or slug..."
                    style={{ width: '100%', padding: '7px 10px 7px 28px', background: BG2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, color: '#F5F5F5', fontFamily: BARLOW, fontSize: 14, outline: 'none', boxSizing: 'border-box' as const }} />
                </div>

                {/* Type filter */}
                <select value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setPage(1) }} style={selStyle}>
                  {['All Types', 'Page', 'Banner', 'FAQ'].map(o => <option key={o} style={{ background: BG3 }}>{o}</option>)}
                </select>

                {/* Status filter */}
                <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1) }} style={selStyle}>
                  {['All Status', 'Published', 'Draft', 'Inactive'].map(o => <option key={o} style={{ background: BG3 }}>{o}</option>)}
                </select>

                {/* Section filter */}
                <select value={sectionFilter} onChange={e => { setSectionFilter(e.target.value); setPage(1) }} style={selStyle}>
                  {['All Sections', 'Company', 'Legal', 'Home', 'Aspirant', 'Agency', 'Landing Pages', 'Help & Support', 'Pricing'].map(o => <option key={o} style={{ background: BG3 }}>{o}</option>)}
                </select>

                <button onClick={clearFilters} style={{ padding: '7px 14px', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 6, color: 'rgba(255,255,255,0.6)', fontFamily: BARLOW, fontSize: 14, cursor: 'pointer', whiteSpace: 'nowrap' as const }}>
                  Clear Filters
                </button>
                <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 6, color: 'rgba(255,255,255,0.6)', fontFamily: BARLOW, fontSize: 14, cursor: 'pointer' }}>
                  <Filter size={13} /> Filters
                </button>
              </div>

              {/* Table header */}
              <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 0.8fr 1fr 0.8fr 1.4fr 1fr 1fr', gap: 0, padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: BG2 }}>
                {['Title', 'Type', 'Section', 'Status', 'Last Updated ⓘ', 'Updated By', 'Actions'].map(h => (
                  <div key={h} style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontWeight: 700, letterSpacing: 0.5 }}>{h}</div>
                ))}
              </div>

              {/* Table rows */}
              {paginated.map((item, i) => (
                <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '2.5fr 0.8fr 1fr 0.8fr 1.4fr 1fr 1fr', gap: 0, padding: '11px 16px', borderBottom: i < paginated.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', alignItems: 'center', transition: 'background 0.3s, border 0.3s', background: flashId === item.id ? 'rgba(34,197,94,0.07)' : 'transparent' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  {/* Title */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                    <div style={{ width: 30, height: 30, borderRadius: 6, background: `${TYPE_COLORS[item.type] || PURPLE}18`, border: `1px solid ${TYPE_COLORS[item.type] || PURPLE}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>{item.icon}</div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 15, color: '#F5F5F5', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{item.title}</div>
                      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{item.slug}</div>
                    </div>
                  </div>

                  {/* Type badge */}
                  <div>
                    <span style={{ padding: '3px 10px', background: `${TYPE_COLORS[item.type]}22`, border: `1px solid ${TYPE_COLORS[item.type]}44`, borderRadius: 12, fontSize: 13, color: TYPE_COLORS[item.type], fontWeight: 600 }}>{item.type}</span>
                  </div>

                  {/* Section */}
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>{item.section}</div>

                  {/* Status */}
                  <div>
                    <span style={{ padding: '3px 10px', background: `${STATUS_COLORS[item.status]}22`, border: `1px solid ${STATUS_COLORS[item.status]}44`, borderRadius: 12, fontSize: 13, color: STATUS_COLORS[item.status], fontWeight: 600 }}>{item.status}</span>
                  </div>

                  {/* Updated */}
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{item.updated}</div>

                  {/* By */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: GOLD_DIM, border: `1px solid ${GOLD_BDR}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: GOLD, flexShrink: 0 }}>
                      {item.by.split(' ').map(w => w[0]).join('').slice(0, 2)}
                    </div>
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{item.by}</span>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, position: 'relative' as const }}>
                    <button onClick={() => handleView(item)} title="View" style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: 5, color: 'rgba(255,255,255,0.5)' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    ><Eye size={14} /></button>
                    <button onClick={() => setEditItem(item)} title="Edit" style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: 5, color: 'rgba(255,255,255,0.5)' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    ><Edit size={14} /></button>
                    <button onClick={() => duplicateItem(item)} title="Duplicate" style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: 5, color: 'rgba(255,255,255,0.5)' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    ><Copy size={14} /></button>
                    {/* More menu */}
                    <div style={{ position: 'relative' as const }}>
                      <button onClick={e => { e.stopPropagation(); setActionMenu(actionMenu === item.id ? null : item.id) }} style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: 5, color: 'rgba(255,255,255,0.5)' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      ><MoreVertical size={14} /></button>
                      {actionMenu === item.id && (
                        <div style={{ position: 'absolute' as const, right: 0, top: 32, width: 160, background: BG4, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, overflow: 'hidden', zIndex: 50, boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
                          {[
                            { label: item.status === 'Published' ? 'Unpublish' : 'Publish', action: () => { setActionMenu(null); updateStatus(item.id, item.status === 'Published' ? 'Inactive' : 'Published') } },
                            { label: 'Move to Draft',  action: () => { setActionMenu(null); updateStatus(item.id, 'Draft') } },
                            { label: 'Duplicate',      action: () => { setActionMenu(null); duplicateItem(item) } },
                            { label: 'View History',   action: () => { setActionMenu(null); router.push('/admin/audit') } },
                            { label: 'Delete',         action: () => { setActionMenu(null); deleteItem(item.id) }, danger: true },
                          ].map(m => (
                            <div key={m.label} onClick={m.action} style={{ padding: '9px 14px', fontSize: 14, cursor: 'pointer', color: (m as any).danger ? RED : '#F5F5F5' }}
                              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                            >{m.label}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Pagination */}
              <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: BG2 }}>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>
                  Showing {Math.min((page - 1) * perPage + 1, filtered.length)} to {Math.min(page * perPage, filtered.length)} of {filtered.length} entries
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 6, color: page === 1 ? 'rgba(255,255,255,0.2)' : '#F5F5F5', cursor: page === 1 ? 'not-allowed' : 'pointer' }}>‹</button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => setPage(p)}
                      style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: p === page ? PURPLE : 'transparent', border: `1px solid ${p === page ? PURPLE : 'rgba(255,255,255,0.12)'}`, borderRadius: 6, color: p === page ? '#fff' : '#F5F5F5', cursor: 'pointer', fontFamily: BARLOW, fontSize: 14, fontWeight: p === page ? 700 : 400 }}>{p}</button>
                  ))}
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                    style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 6, color: page === totalPages ? 'rgba(255,255,255,0.2)' : '#F5F5F5', cursor: page === totalPages ? 'not-allowed' : 'pointer' }}>›</button>
                  {/* Per page */}
                  <select value={perPage} onChange={e => { setPerPage(Number(e.target.value)); setPage(1) }} style={{ ...selStyle, fontSize: 13, padding: '6px 24px 6px 8px' }}>
                    {[10, 25, 50].map(n => <option key={n} style={{ background: BG3 }}>{n} / page</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* RIGHT — Panel */}
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 14 }}>

              {/* Content Overview donut */}
              <div style={{ background: BG3, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 16 }}>
                <div style={{ fontFamily: BEBAS, fontSize: 17, letterSpacing: 0.5, color: '#F5F5F5', marginBottom: 14 }}>Content Overview</div>
                <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                  <ContentDonut data={donutData} />
                  <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 8, flex: 1 }}>
                    {donutData.map(d => (
                      <div key={d.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div style={{ width: 10, height: 10, borderRadius: '50%', background: d.color, flexShrink: 0 }} />
                          <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>{d.label}</span>
                        </div>
                        <span style={{ fontSize: 14, color: '#F5F5F5', fontWeight: 600 }}>{d.value} ({d.pct}%)</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div style={{ background: BG3, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 16 }}>
                <div style={{ fontFamily: BEBAS, fontSize: 17, letterSpacing: 0.5, color: '#F5F5F5', marginBottom: 12 }}>Quick Links</div>
                {QUICK_LINKS.map(l => (
                  <div key={l.label} onClick={() => l.href ? router.push(l.href) : showToast(`"${l.label}" is coming soon.`, 'info')}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                    onMouseLeave={e => (e.currentTarget.style.color = '')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <l.icon size={14} color="rgba(255,255,255,0.4)" />
                      <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>{l.label}</span>
                    </div>
                    <ChevronRight size={13} color="rgba(255,255,255,0.3)" />
                  </div>
                ))}
              </div>

              {/* Recent Activity */}
              <div style={{ background: BG3, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 16 }}>
                <div style={{ fontFamily: BEBAS, fontSize: 17, letterSpacing: 0.5, color: '#F5F5F5', marginBottom: 12 }}>Recent Activity</div>
                {recentActivity.map((a, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: i < RECENT_ACTIVITY.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: a.color, flexShrink: 0, marginTop: 5 }} />
                    <div>
                      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', lineHeight: 1.4 }}>{a.text}</div>
                      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{a.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Content Editor Modal */}
      {(editItem || addNew) && (
        <ContentEditorModal
          item={editItem}
          onClose={() => { setEditItem(null); setAddNew(false) }}
          onSave={(updated) => {
            if (addNew) {
              persistItems([...items, updated as typeof CMS_ITEMS[0]])
              setFlashId(updated.id)
              setTimeout(() => setFlashId(null), 1500)
              showToast('New content added successfully', 'success')
            } else {
              persistItems(items.map(i => i.id === updated.id ? updated as typeof CMS_ITEMS[0] : i))
              setFlashId(updated.id)
              setTimeout(() => setFlashId(null), 1500)
              showToast('Content updated successfully', 'success')
            }
            setEditItem(null)
            setAddNew(false)
          }}
        />
      )}
      {toast && <CMSToast msg={toast.msg} type={toast.type} />}
    </div>
  )
}