'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard',                href: '/admin/dashboard'           },
  { icon: Users,           label: 'User Management',          href: '/admin/users'               },
  { icon: UserCheck,       label: 'Talent Verification',      href: '/admin/talent-verification' },
  { icon: Building2,       label: 'Agency Verification',      href: '/admin/agency-verification' },
  { icon: FileText,        label: 'Applications Monitoring',  href: '/admin/applications'        },
  { icon: Flag,            label: 'Reports & Complaints',     href: '/admin/reports'             },
  { icon: ShieldCheck,     label: 'Fraud Detection',          href: '/admin/fraud'               },
  { icon: CreditCard,      label: 'Subscription Management',  href: '/admin/subscriptions'       },
  { icon: Megaphone,       label: 'Advertisement Management', href: '/admin/advertisements'      },
  { icon: Database,        label: 'CMS Management',           href: '/admin/cms', active: true   },
  { icon: BellRing,        label: 'Notifications Management', href: '/admin/notifications'       },
  { icon: BarChart2,       label: 'Analytics & Reports',      href: '/admin/analytics'           },
  { icon: Ticket,          label: 'Support Tickets',          href: '/admin/support'             },
  { icon: ScrollText,      label: 'Audit Logs',               href: '/admin/audit'               },
  { icon: KeyRound,        label: 'Roles & Permissions',      href: '/admin/roles'               },
  { icon: Settings,        label: 'Settings',                 href: '/admin/settings'            },
]

const PROFILE_MENU = [
  { label: 'My Profile',               href: '/admin/profile'       },
  { label: 'Account Settings',         href: '/admin/settings'      },
  { label: 'Security Settings',        href: '/admin/settings'      },
  { label: 'Notification Preferences', href: '/admin/notifications' },
  { label: 'Activity Logs',            href: '/admin/audit'         },
  { label: 'Help & Support',           href: '/contact'             },
  { label: 'Logout',                   href: '/login'               },
]

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
  { label: 'Manage Header & Footer', href: null,            icon: Layout    },
  { label: 'Manage Menu',            href: null,            icon: AlignLeft },
  { label: 'Social Media Links',     href: null,            icon: Link      },
  { label: 'Site Settings',          href: '/admin/settings', icon: Settings  },
  { label: 'Maintain SEO Settings',  href: null,            icon: Globe     },
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

const DONUT_DATA = [
  { label: 'Pages',   value: 24, pct: 42, color: PURPLE },
  { label: 'Banners', value: 16, pct: 28, color: BLUE   },
  { label: 'FAQs',    value: 48, pct: 17, color: TEAL   },
  { label: 'Others',  value: 9,  pct: 13, color: ORANGE },
]

function ContentDonut() {
  const cx = 70, cy = 70, R = 58, r = 36
  const toRad = (d: number) => (d * Math.PI) / 180
  const pt = (a: number, rad: number) => [cx + rad * Math.cos(toRad(a)), cy + rad * Math.sin(toRad(a))]
  let start = -90
  const arcs = DONUT_DATA.map(seg => {
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

export default function CMSManagementPage() {
  const router = useRouter()
  const [sidebarOpen,  setSidebarOpen]  = useState(false)
  const [profileOpen,  setProfileOpen]  = useState(false)
  const [search,       setSearch]       = useState('')
  const [typeFilter,   setTypeFilter]   = useState('All Types')
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [sectionFilter,setSectionFilter]= useState('All Sections')
  const [perPage,      setPerPage]      = useState(10)
  const [page,         setPage]         = useState(1)
  const [actionMenu,   setActionMenu]   = useState<number | null>(null)

  const SB_W = sidebarOpen ? 220 : 52

  const filtered = CMS_ITEMS.filter(item => {
    const matchSearch  = item.title.toLowerCase().includes(search.toLowerCase()) || item.slug.toLowerCase().includes(search.toLowerCase())
    const matchType    = typeFilter   === 'All Types'    || item.type    === typeFilter
    const matchStatus  = statusFilter === 'All Status'   || item.status  === statusFilter
    const matchSection = sectionFilter === 'All Sections' || item.section === sectionFilter
    return matchSearch && matchType && matchStatus && matchSection
  })

  const totalPages = Math.ceil(filtered.length / perPage)
  const paginated  = filtered.slice((page - 1) * perPage, page * perPage)

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
      alert(`"${item.title}" page is pending development.`)
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
      <header style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0, padding: '0 24px', height: 60, background: BG2, borderBottom: '1px solid rgba(255,255,255,0.06)', zIndex: 100 }}>
        <SilverScreensLogo size="md" href="/" showTagline={false} />
        <div style={{ padding: '3px 10px', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 5 }}>
          <span style={{ fontFamily: BARLOW, fontSize: 14, fontWeight: 700, color: RED, letterSpacing: 1 }}>ADMIN</span>
        </div>

        <div style={{ flex: 1 }} />


        <div onClick={() => router.push('/admin/support')} style={{ position: 'relative' as const, cursor: 'pointer' }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MessageSquare size={15} color="rgba(255,255,255,0.7)" /></div>
          <div style={{ position: 'absolute' as const, top: -5, right: -5, background: RED, borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff' }}>8</div>
        </div>
        <div onClick={() => router.push('/admin/notifications')} style={{ position: 'relative' as const, cursor: 'pointer' }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Bell size={15} color="rgba(255,255,255,0.7)" /></div>
          <div style={{ position: 'absolute' as const, top: -5, right: -5, background: RED, borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff' }}>12</div>
        </div>

        {/* Admin avatar */}
        <div style={{ position: 'relative' as const }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer' }} onClick={() => setProfileOpen(v => !v)}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(212,166,74,0.38)', flexShrink: 0 }}>
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face" alt="Admin" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.2 }}>Super Admin</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>Administrator</div>
            </div>
            <ChevronDown size={12} color="rgba(255,255,255,0.4)" />
          </div>
          {profileOpen && (
            <>
              <div onClick={() => setProfileOpen(false)} style={{ position: 'fixed' as const, inset: 0, zIndex: 150 }} />
              <div style={{ position: 'absolute' as const, top: 46, right: 0, width: 210, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, overflow: 'hidden', zIndex: 200, boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}>
                <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>Admin ID</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: RED }}>ADM000001</span>
                </div>
                {PROFILE_MENU.map(({ label, href }) => (
                  <div key={label} onClick={() => { router.push(href); setProfileOpen(false) }}
                    style={{ padding: '10px 16px', fontSize: 15, cursor: 'pointer', color: label === 'Logout' ? '#ff6b6b' : '#F5F5F5', borderTop: label === 'Logout' ? '1px solid rgba(255,255,255,0.07)' : 'none' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >{label}</div>
                ))}
              </div>
            </>
          )}
        </div>
      </header>

      {/* ══ BODY ══ */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* ── COLLAPSIBLE SIDEBAR ── */}
        <aside style={{ width: SB_W, flexShrink: 0, background: BG2, borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column' as const, overflowY: 'auto' as const, overflowX: 'hidden', transition: 'width 0.2s ease', scrollbarWidth: 'none' as const }}>
          <div style={{ height: 52, display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'flex-end' : 'center', padding: sidebarOpen ? '0 12px' : 0, borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
            <button onClick={() => setSidebarOpen(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', width: 30, height: 30, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            >{sidebarOpen ? <ChevronLeft size={16} /> : <Menu size={16} />}</button>
          </div>
          {sidebarOpen && (
            <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 9, overflow: 'hidden', border: '1px solid rgba(212,166,74,0.25)', flexShrink: 0 }}>
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#F5F5F5', whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis' }}>Super Admin</div>
                <div style={{ fontSize: 14, color: RED, fontWeight: 600 }}>ADM000001</div>
              </div>
            </div>
          )}
          <nav style={{ flex: 1, padding: sidebarOpen ? '8px 6px' : '8px 4px', overflowY: 'auto' as const, scrollbarWidth: 'none' as const }}>
            {NAV_ITEMS.map(({ icon: Icon, label, href, active }) => (
              <div key={label} onClick={() => router.push(href)} title={!sidebarOpen ? label : undefined}
                style={{ display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'flex-start' : 'center', padding: sidebarOpen ? '8px 10px' : '10px 0', marginBottom: 2, borderRadius: 6, cursor: 'pointer', background: active ? GOLD_DIM : 'transparent', border: active && sidebarOpen ? `1px solid ${GOLD_BDR}` : '1px solid transparent', borderLeft: sidebarOpen && active ? `3px solid ${GOLD}` : sidebarOpen ? '3px solid transparent' : 'none', gap: sidebarOpen ? 9 : 0 }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = active ? GOLD_DIM : 'transparent' }}
              >
                <Icon size={15} color={active ? GOLD : 'rgba(255,255,255,0.42)'} strokeWidth={active ? 2.5 : 1.8} />
                {sidebarOpen && <span style={{ fontSize: 14, color: active ? GOLD : 'rgba(255,255,255,0.6)', fontWeight: active ? 700 : 400, whiteSpace: 'nowrap' as const, flex: 1 }}>{label}</span>}
                {sidebarOpen && active && <ChevronRight size={12} color={GOLD} opacity={0.6} />}
              </div>
            ))}
          </nav>
        </aside>

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
              <button onClick={() => alert('Categories manager coming soon.')} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 7, color: '#F5F5F5', fontFamily: BARLOW, fontSize: 15, cursor: 'pointer' }}>
                <Layers size={14} /> Categories
              </button>
              <button onClick={() => window.open('/', '_blank')} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 7, color: '#F5F5F5', fontFamily: BARLOW, fontSize: 15, cursor: 'pointer' }}>
                <Eye size={14} /> Preview Site
              </button>
              <button onClick={() => alert('Content Editor coming soon. This will open a rich text editor for creating new pages, banners and FAQs.')} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px', background: PURPLE, border: 'none', borderRadius: 7, color: '#fff', fontFamily: BARLOW, fontSize: 15, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(139,92,246,0.3)' }}>
                <Plus size={15} /> Add New Content
              </button>
            </div>
          </div>

          {/* Stat cards */}
          <div style={{ display: 'flex', gap: 10 }}>
            {[
              { icon: '📄', label: 'Total Pages',    value: 24, sub: 'Published: 20  Draft: 4',    color: PURPLE },
              { icon: '🖼️', label: 'Banners',        value: 16, sub: 'Active: 12  Inactive: 4',    color: BLUE   },
              { icon: '❓', label: 'FAQs',            value: 48, sub: 'Active: 46  Inactive: 2',    color: TEAL   },
              { icon: '🌐', label: 'Site Sections',   value: 9,  sub: 'Active: 9',                  color: ORANGE },
              { icon: '🕐', label: 'Last Updated',    value: null, sub: 'May 21, 2025\n11:32 AM',   color: GOLD   },
            ].map((s, i) => (
              <div key={i} style={{ flex: 1, background: BG3, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: `${s.color}22`, border: `1px solid ${s.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{s.icon}</div>
                <div>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 3 }}>{s.label}</div>
                  {s.value !== null
                    ? <div style={{ fontFamily: BEBAS, fontSize: 28, color: '#F5F5F5', lineHeight: 1, letterSpacing: 0.5 }}>{s.value}</div>
                    : <div style={{ fontFamily: BEBAS, fontSize: 18, color: '#F5F5F5', lineHeight: 1.2 }}>May 21, 2025<br /><span style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>11:32 AM</span></div>
                  }
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginTop: 3 }}>{s.sub}</div>
                </div>
              </div>
            ))}
          </div>

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
                <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '2.5fr 0.8fr 1fr 0.8fr 1.4fr 1fr 1fr', gap: 0, padding: '11px 16px', borderBottom: i < paginated.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', alignItems: 'center', transition: 'background 0.15s' }}
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
                    <button onClick={() => alert(`Edit "${item.title}" — Content Editor coming soon.`)} title="Edit" style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: 5, color: 'rgba(255,255,255,0.5)' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    ><Edit size={14} /></button>
                    <button onClick={() => alert(`Duplicated: "${item.title}"`)} title="Duplicate" style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: 5, color: 'rgba(255,255,255,0.5)' }}
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
                            { label: item.status === 'Published' ? 'Unpublish' : 'Publish', action: () => { setActionMenu(null); alert(`${item.status === 'Published' ? 'Unpublished' : 'Published'}: ${item.title}`) } },
                            { label: 'Move to Draft',  action: () => { setActionMenu(null); alert(`Moved to Draft: ${item.title}`) } },
                            { label: 'View History',   action: () => { setActionMenu(null); router.push('/admin/audit') } },
                            { label: 'Delete',          action: () => { setActionMenu(null); confirm(`Delete "${item.title}"?`) }, danger: true },
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
                  <ContentDonut />
                  <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 8, flex: 1 }}>
                    {DONUT_DATA.map(d => (
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
                  <div key={l.label} onClick={() => l.href ? router.push(l.href) : alert(`"${l.label}" is pending development.`)}
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
                {RECENT_ACTIVITY.map((a, i) => (
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
    </div>
  )
}