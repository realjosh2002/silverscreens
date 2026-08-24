'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import {
  LayoutDashboard, Users, Building2, Megaphone, FileText,
  BarChart2, ShieldCheck, Flag, CreditCard, Tag, MapPin,
  Database, Settings, ScrollText, BellRing, Ticket,
  KeyRound, ChevronLeft, ChevronRight, Menu, UserCheck, BookOpen,
} from 'lucide-react'

const GOLD     = '#D4A64A'
const GOLD_DIM = 'rgba(212,166,74,0.12)'
const GOLD_BDR = 'rgba(212,166,74,0.22)'
const RED      = '#C8202A'
const BG2      = '#0B0F14'
const BARLOW  = "'Barlow Condensed', sans-serif"
const BEBAS   = "'Bebas Neue', sans-serif"

function getAdminSession() {
  try {
    const raw = localStorage.getItem('ss_user') || sessionStorage.getItem('ss_user') || '{}'
    return JSON.parse(raw)
  } catch { return {} }
}


const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard',                href: '/admin/dashboard'           },
  { icon: Users,           label: 'User Management',          href: '/admin/users'               },
  { icon: UserCheck,       label: 'Talent Verification',      href: '/admin/talent-verification' },
  { icon: Building2,       label: 'Agency Verification',      href: '/admin/agency-verification' },
  { icon: FileText,        label: 'Applications Monitoring',  href: '/admin/applications'        },
  { icon: Flag,            label: 'Reports & Complaints',     href: '/admin/reports'             },
  { icon: ShieldCheck,     label: 'Fraud Detection',          href: '/admin/fraud'               },
  { icon: CreditCard,      label: 'Subscription Management',  href: '/admin/subscriptions'       },
  { icon: Tag,             label: 'Pricing Management',       href: '/admin/pricing'             },
  { icon: MapPin,          label: 'Location Management',      href: '/admin/locations'           },
  { icon: BookOpen,        label: 'Master Data',               href: '/admin/master-data'         },
  { icon: Megaphone,       label: 'Advertisement Management', href: '/admin/advertisements'      },
  { icon: Database,        label: 'CMS Management',           href: '/admin/cms'                 },
  { icon: BellRing,        label: 'Notifications Management', href: '/admin/notifications'       },
  { icon: BarChart2,       label: 'Analytics & Reports',      href: '/admin/analytics'           },
  { icon: Ticket,          label: 'Support Tickets',          href: '/admin/support'             },
  { icon: ScrollText,      label: 'Audit Logs',               href: '/admin/audit'               },
  { icon: KeyRound,        label: 'Roles & Permissions',      href: '/admin/roles'               },
  { icon: Settings,        label: 'Settings',                 href: '/admin/settings'            },
]

interface Props {
  onCollapse?: (collapsed: boolean) => void
}

export default function AdminSidebar({ onCollapse }: Props) {
  const router   = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [adminName,    setAdminName]    = useState('Administrator')
  const [adminRole,    setAdminRole]    = useState('Admin')
  const [adminInitial, setAdminInitial] = useState('A')

  useEffect(() => {
    try {
      const raw = localStorage.getItem('ss_user') || sessionStorage.getItem('ss_user') || '{}'
      const u = JSON.parse(raw)
      if (u.name) {
        setAdminName(u.name)
        setAdminInitial((u.name as string).charAt(0).toUpperCase())
      }
      if (u.adminRole) setAdminRole(u.adminRole === 'verifier' ? 'Verifier' : 'Admin')
    } catch {}
  }, [])

  const SB_W = open ? 220 : 52

  const toggle = () => {
    const next = !open
    setOpen(next)
    onCollapse?.(!next)
  }

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/')

  return (
    <aside style={{
      width: SB_W,
      flexShrink: 0,
      background: BG2,
      borderRight: '1px solid rgba(255,255,255,0.06)',
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
      overflowX: 'hidden',
      transition: 'width 0.2s ease',
      scrollbarWidth: 'none',
    }}>

      {/* Toggle button — ALWAYS at top, never scrolls away */}
      <div style={{
        height: 52,
        display: 'flex',
        alignItems: 'center',
        justifyContent: open ? 'flex-end' : 'center',
        padding: open ? '0 12px' : 0,
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        flexShrink: 0,
      }}>
        <button
          onClick={toggle}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            width: 30, height: 30, borderRadius: 6,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'rgba(255,255,255,0.5)',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'none')}
        >
          {open ? <ChevronLeft size={16} /> : <Menu size={16} />}
        </button>
      </div>

      {/* Admin identity — only when open */}
      {open && (
        <div style={{
          padding: '14px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 38, height: 38, borderRadius: 9,
            background: 'rgba(239,68,68,0.2)',
            border: '1px solid rgba(212,166,74,0.25)',
            flexShrink: 0, display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 16, fontWeight: 700, color: RED,
          }}>{adminInitial}</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#F5F5F5', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{adminName}</div>
            <div style={{ fontSize: 14, color: RED, fontWeight: 600 }}>{adminRole}</div>
          </div>
        </div>
      )}

      {/* Nav items */}
      <nav style={{ flex: 1, padding: open ? '8px 6px' : '8px 4px', overflowY: 'auto', scrollbarWidth: 'none' }}>
        {NAV_ITEMS.map(({ icon: Icon, label, href }) => {
          const active = isActive(href)
          return (
            <div
              key={href}
              onClick={() => router.push(href)}
              title={!open ? label : undefined}
              style={{
                display: 'flex', alignItems: 'center',
                justifyContent: open ? 'flex-start' : 'center',
                padding: open ? '8px 10px' : '10px 0',
                marginBottom: 2, borderRadius: 6, cursor: 'pointer',
                background: active ? GOLD_DIM : 'transparent',
                border: active && open ? `1px solid ${GOLD_BDR}` : '1px solid transparent',
                borderLeft: open && active ? `3px solid ${GOLD}` : open ? '3px solid transparent' : 'none',
                gap: open ? 9 : 0,
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = active ? GOLD_DIM : 'transparent' }}
            >
              <Icon size={15} color={active ? GOLD : 'rgba(255,255,255,0.42)'} strokeWidth={active ? 2.5 : 1.8} />
              {open && (
                <span style={{
                  fontSize: 14, color: active ? GOLD : 'rgba(255,255,255,0.6)',
                  fontWeight: active ? 700 : 400, whiteSpace: 'nowrap', flex: 1,
                  fontFamily: BARLOW,
                }}>{label}</span>
              )}
              {open && active && <ChevronRight size={12} color={GOLD} opacity={0.6} />}
            </div>
          )
        })}
      </nav>

      {/* Logout */}
      {open && (
        <div
          onClick={() => { localStorage.removeItem('ss_user'); sessionStorage.removeItem('ss_user'); router.push('/admin/login'); }}
          style={{
            padding: '14px 16px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', alignItems: 'center', gap: 9,
            cursor: 'pointer', color: 'rgba(255,255,255,0.45)',
            fontSize: 14, fontFamily: BARLOW,
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#ff6b6b')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
        >
          <ChevronLeft size={14} style={{ transform: 'rotate(180deg)' }} />
          Logout
        </div>
      )}
    </aside>
  )
}