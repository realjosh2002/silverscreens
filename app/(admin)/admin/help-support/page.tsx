'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminTopnav from '@/components/layout/AdminTopnav'
import AdminSidebar from '@/components/layout/AdminSidebar'
import {
  BookOpen, HelpCircle, Ticket, MessageCircle, PlayCircle, Download,
  Mail, Phone, ShieldCheck, FileBadge2, Video, FileBarChart2, Zap,
  UserCog, Building2, Clapperboard, Wallet, BarChart4, Cog,
  Search, ChevronRight, Inbox, Plus, Drama,
  Megaphone as AdsIcon, Layers as LayersIcon,
} from 'lucide-react'

const GOLD      = '#D4A64A'
const GREEN     = '#22C55E'
const BLUE      = '#3B82F6'
const PURPLE    = '#8B5CF6'
const ORANGE    = '#F97316'
const TEAL      = '#14B8A6'
const PINK      = '#EC4899'
const RED       = '#C8202A'
const BG        = '#0D1117'
const BG2       = '#131720'
const BG3       = '#181E2A'
const BEBAS     = "'Bebas Neue', sans-serif"
const BARLOW    = "'Barlow Condensed', sans-serif"
const BORDER    = '#252C3A'
const TEXT_MUTED = '#8B93A3'

function RailCard({ title, color, children, action }: { title: string; color: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div style={{ background: BG2, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <h3 style={{ fontFamily: BARLOW, fontWeight: 700, fontSize: 15, color, margin: 0 }}>{title}</h3>
        {action}
      </div>
      {children}
    </div>
  )
}

const HELP_CARDS = [
  { id: 'kb',      icon: BookOpen,      iconBg: ORANGE, title: 'Knowledge Base',  desc: 'Browse guides, articles and documentation',      href: null },
  { id: 'faq',     icon: HelpCircle,    iconBg: GREEN,  title: 'FAQs',            desc: 'Find answers to commonly asked questions',        href: '/admin/settings' },
  { id: 'tickets', icon: Ticket,        iconBg: BLUE,   title: 'Support Tickets', desc: 'View your support tickets and their status',      href: '/admin/support' },
  { id: 'chat',    icon: MessageCircle, iconBg: PURPLE, title: 'Live Chat',       desc: 'Chat with our support team in real-time',         href: null },
  { id: 'videos',  icon: PlayCircle,    iconBg: ORANGE, title: 'Video Tutorials', desc: 'Watch step-by-step video guides',                 href: null },
  { id: 'dl',      icon: Download,      iconBg: BLUE,   title: 'Downloads',       desc: 'Download resources, templates and more',          href: null },
]

const TICKETS = [
  { id: '#SS-1258', subject: 'Unable to approve talent profile',   category: 'Talent Verification', catColor: PURPLE, priority: 'High',   priorityColor: RED,       status: 'In Progress', statusColor: BLUE,      updated: '24 May 2026, 10:35 AM' },
  { id: '#SS-1257', subject: 'Payment gateway integration issue',  category: 'Payments',            catColor: GREEN,  priority: 'High',   priorityColor: RED,       status: 'Open',        statusColor: GOLD,      updated: '24 May 2026, 09:15 AM' },
  { id: '#SS-1256', subject: 'Advertisement not publishing',       category: 'Advertisements',      catColor: ORANGE, priority: 'Medium', priorityColor: GOLD,      status: 'In Progress', statusColor: BLUE,      updated: '23 May 2026, 06:40 PM' },
  { id: '#SS-1255', subject: 'Unable to add new agency',          category: 'User Management',     catColor: BLUE,   priority: 'Medium', priorityColor: GOLD,      status: 'Resolved',    statusColor: GREEN,     updated: '23 May 2026, 03:20 PM' },
  { id: '#SS-1254', subject: 'Subscription plan update required', category: 'Subscription Plans',  catColor: TEAL,   priority: 'Low',    priorityColor: GREEN,     status: 'Closed',      statusColor: TEXT_MUTED,updated: '22 May 2026, 11:10 AM' },
]

const KB_CATEGORIES = [
  { label: 'Getting Started',        count: 12, icon: Zap,        color: BLUE   },
  { label: 'User Management',        count: 18, icon: UserCog,    color: PURPLE },
  { label: 'Talent & Profiles',      count: 22, icon: Drama,      color: GREEN  },
  { label: 'Agency Management',      count: 15, icon: Building2,  color: ORANGE },
  { label: 'Casting & Applications', count: 20, icon: Clapperboard,color: PINK  },
  { label: 'Payments & Billing',     count: 16, icon: Wallet,     color: BLUE   },
  { label: 'Subscription Plans',     count: 14, icon: LayersIcon, color: ORANGE },
  { label: 'Advertisements',         count: 19, icon: AdsIcon,    color: PURPLE },
  { label: 'Reports & Analytics',    count: 13, icon: BarChart4,  color: RED    },
  { label: 'System Settings',        count: 17, icon: Cog,        color: TEXT_MUTED },
]

const POPULAR = ['How to add new user', 'Subscription Plans', 'Agency Verification', 'Payment Issues', 'Profile Approval']

export default function HelpSupportPage() {
  const router  = useRouter()
  const [search, setSearch] = useState('')
  const [toast,  setToast]  = useState('')

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: BG, fontFamily: BARLOW, color: '#F5F5F5' }}>
      <AdminTopnav />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <AdminSidebar />
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px 40px' }}>

          {/* Header */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5, fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
              <span onClick={() => router.push('/admin/dashboard')} style={{ cursor: 'pointer' }}>Home</span>
              <ChevronRight size={12} />
              <span style={{ color: 'rgba(255,255,255,0.7)' }}>Help & Support</span>
            </div>
            <h1 style={{ fontFamily: BEBAS, fontSize: 30, letterSpacing: 1, margin: '0 0 4px', color: '#F5F5F5' }}>HELP & SUPPORT</h1>
            <p style={{ fontSize: 15, color: TEXT_MUTED, margin: 0 }}>Find answers, get support and manage your tickets.</p>
          </div>

          {/* Search bar */}
          <div style={{ background: BG2, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '20px 24px', marginBottom: 24 }}>
            <div style={{ fontFamily: BEBAS, fontSize: 20, letterSpacing: 0.5, marginBottom: 12, color: '#F5F5F5' }}>HOW CAN WE HELP YOU?</div>
            <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={15} color={TEXT_MUTED} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && showToast(`Search for "${search}" coming soon.`)}
                  placeholder="Search help articles, guides and FAQs..."
                  style={{ width: '100%', padding: '10px 12px 10px 36px', background: BG3, border: `1px solid ${BORDER}`, borderRadius: 8, color: '#F5F5F5', fontFamily: BARLOW, fontSize: 15, outline: 'none', boxSizing: 'border-box' as const }} />
              </div>
              <button onClick={() => showToast(`Search for "${search}" coming soon.`)}
                style={{ padding: '10px 24px', background: GOLD, border: 'none', borderRadius: 8, color: BG, fontFamily: BEBAS, fontSize: 18, letterSpacing: 1, cursor: 'pointer' }}>
                Search
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' as const }}>
              <span style={{ fontSize: 13, color: TEXT_MUTED }}>Popular:</span>
              {POPULAR.map(p => (
                <span key={p} onClick={() => { setSearch(p); showToast(`Search for "${p}" coming soon.`) }}
                  style={{ fontSize: 13, color: GOLD, cursor: 'pointer', padding: '3px 10px', background: 'rgba(212,166,74,0.08)', borderRadius: 12, border: '1px solid rgba(212,166,74,0.2)' }}>
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* Help cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
            {HELP_CARDS.map(card => (
              <div key={card.id}
                onClick={() => card.href ? router.push(card.href) : showToast(`${card.title} coming soon.`)}
                style={{ background: BG2, border: `1px solid ${BORDER}`, borderRadius: 10, padding: '18px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, transition: 'border-color 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = GOLD)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = BORDER)}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: `${card.iconBg}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <card.icon size={20} color={card.iconBg} />
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#F5F5F5', marginBottom: 3 }}>{card.title}</div>
                  <div style={{ fontSize: 13, color: TEXT_MUTED }}>{card.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Main content */}
          <div style={{ display: 'flex', gap: 20 }}>

            {/* LEFT */}
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Recent Tickets */}
              <div style={{ background: BG2, border: `1px solid ${BORDER}`, borderRadius: 10, overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: `1px solid ${BORDER}` }}>
                  <div style={{ fontFamily: BEBAS, fontSize: 18, letterSpacing: 0.5 }}>RECENT SUPPORT TICKETS</div>
                  <button onClick={() => router.push('/admin/support')}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: GOLD, border: 'none', borderRadius: 7, color: BG, fontFamily: BEBAS, fontSize: 15, letterSpacing: 0.5, cursor: 'pointer' }}>
                    <Plus size={13} /> New Ticket
                  </button>
                </div>
                <div style={{ overflowX: 'auto' as const }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' as const }}>
                    <thead>
                      <tr style={{ background: BG3 }}>
                        {['Ticket ID', 'Subject', 'Category', 'Priority', 'Status', 'Last Updated'].map(h => (
                          <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 12, color: TEXT_MUTED, fontWeight: 700, fontFamily: BARLOW, whiteSpace: 'nowrap' as const }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {TICKETS.map((t, i) => (
                        <tr key={t.id} onClick={() => router.push('/admin/support')}
                          style={{ borderTop: `1px solid ${BORDER}`, cursor: 'pointer' }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                          <td style={{ padding: '12px 16px', fontSize: 14, color: GOLD, fontFamily: 'monospace' }}>{t.id}</td>
                          <td style={{ padding: '12px 16px', fontSize: 14, color: '#F5F5F5', maxWidth: 220 }}>{t.subject}</td>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{ fontSize: 12, padding: '3px 8px', borderRadius: 4, background: `${t.catColor}22`, color: t.catColor }}>{t.category}</span>
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{ fontSize: 12, fontWeight: 700, color: t.priorityColor }}>{t.priority}</span>
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{ fontSize: 12, padding: '3px 8px', borderRadius: 4, background: `${t.statusColor}22`, color: t.statusColor }}>{t.status}</span>
                          </td>
                          <td style={{ padding: '12px 16px', fontSize: 12, color: TEXT_MUTED, whiteSpace: 'nowrap' as const }}>{t.updated}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div style={{ padding: '12px 20px', borderTop: `1px solid ${BORDER}`, textAlign: 'right' }}>
                  <span onClick={() => router.push('/admin/support')} style={{ fontSize: 13, color: GOLD, cursor: 'pointer' }}>View All Tickets →</span>
                </div>
              </div>

              {/* Knowledge Base */}
              <div style={{ background: BG2, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 20 }}>
                <div style={{ fontFamily: BEBAS, fontSize: 18, letterSpacing: 0.5, marginBottom: 16 }}>KNOWLEDGE BASE CATEGORIES</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {KB_CATEGORIES.map(c => (
                    <div key={c.label} onClick={() => showToast(`${c.label} knowledge base coming soon.`)}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: BG3, border: `1px solid ${BORDER}`, borderRadius: 8, cursor: 'pointer' }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = GOLD)}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = BORDER)}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: `${c.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <c.icon size={15} color={c.color} />
                        </div>
                        <div>
                          <div style={{ fontSize: 13, color: '#fff' }}>{c.label}</div>
                          <div style={{ fontSize: 11, color: TEXT_MUTED }}>{c.count} Articles</div>
                        </div>
                      </div>
                      <ChevronRight size={14} color={TEXT_MUTED} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT RAIL */}
            <div style={{ width: 300, minWidth: 300, display: 'flex', flexDirection: 'column', gap: 20 }}>

              <RailCard title="CONTACT SUPPORT" color={GOLD}>
                <div style={{ fontSize: 12, color: TEXT_MUTED, marginBottom: 14 }}>Our support team is available to assist you.</div>
                {[
                  { icon: MessageCircle, color: BLUE,   label: 'Live Chat',       sub: 'Available 24/7',              badge: 'Online', badgeColor: GREEN, action: () => showToast('Live chat coming soon.') },
                  { icon: Mail,          color: PURPLE, label: 'Email Support',   sub: 'support@silverscreens.com',   badge: 'Email Us', badgeColor: GOLD, action: () => { window.location.href = 'mailto:support@silverscreens.com' } },
                  { icon: Phone,         color: GREEN,  label: 'Phone Support',   sub: '+91 44 4567 8901',            badge: 'Call Us', badgeColor: GOLD, action: () => { window.location.href = 'tel:+914445678901' } },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: `1px solid ${BORDER}` }}>
                    <div style={{ width: 34, height: 34, borderRadius: 9, background: `${item.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <item.icon size={16} color={item.color} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, color: '#fff' }}>{item.label}</div>
                      <div style={{ fontSize: 11, color: TEXT_MUTED }}>{item.sub}</div>
                    </div>
                    <button onClick={item.action}
                      style={{ background: 'transparent', border: `1px solid ${item.badgeColor}`, color: item.badgeColor, borderRadius: 6, padding: '5px 10px', fontSize: 11, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' as const }}>
                      {item.badge}
                    </button>
                  </div>
                ))}
                <div style={{ fontSize: 11, color: TEXT_MUTED, marginTop: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Inbox size={12} /> Support Hours: 24/7 (All Days)
                </div>
              </RailCard>

              <RailCard title="SYSTEM STATUS" color={GOLD}
                action={<div style={{ width: 28, height: 28, borderRadius: '50%', background: `${GREEN}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ShieldCheck size={15} color={GREEN} /></div>}>
                <div style={{ fontSize: 14, fontWeight: 700, color: GREEN, marginBottom: 4 }}>All systems are operational</div>
                <div style={{ fontSize: 11, color: TEXT_MUTED, marginBottom: 12 }}>Last updated: 24 May 2026, 10:45 AM</div>
                <span onClick={() => showToast('System status page coming soon.')} style={{ fontSize: 13, color: GOLD, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                  View System Status <ChevronRight size={13} />
                </span>
              </RailCard>

              <RailCard title="HELP RESOURCES" color={GOLD}>
                {[
                  { label: 'Admin User Guide',     desc: 'Complete guide for administrators', tag: 'PDF',   color: RED,  icon: FileBadge2   },
                  { label: 'Platform Walkthrough', desc: 'Step-by-step platform overview',   tag: 'Video', color: BLUE, icon: Video        },
                  { label: 'Best Practices',       desc: 'Recommended practices & tips',     tag: 'PDF',   color: RED,  icon: FileBadge2   },
                  { label: 'Release Notes',        desc: 'Latest updates and improvements',  tag: 'Docs',  color: TEAL, icon: FileBarChart2 },
                ].map(r => (
                  <div key={r.label} onClick={() => showToast(`"${r.label}" download coming soon.`)}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: `1px solid ${BORDER}`, cursor: 'pointer' }}>
                    <r.icon size={16} color={TEXT_MUTED} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, color: '#fff' }}>{r.label}</div>
                      <div style={{ fontSize: 11, color: TEXT_MUTED }}>{r.desc}</div>
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 4, background: `${r.color}22`, color: r.color }}>{r.tag}</span>
                  </div>
                ))}
              </RailCard>

              <RailCard title="NEED IMMEDIATE HELP?" color={GOLD}>
                <div style={{ fontSize: 12, color: TEXT_MUTED, lineHeight: 1.5, marginBottom: 14 }}>
                  If you have an urgent issue that requires immediate attention, please contact our priority support line.
                </div>
                <button onClick={() => showToast('Connecting you to priority support...')}
                  style={{ width: '100%', background: 'transparent', border: `1px solid ${GOLD}`, color: GOLD, borderRadius: 6, padding: '10px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
                  <Zap size={14} /> Contact Priority Support
                </button>
              </RailCard>

            </div>
          </div>
        </div>
      </div>

      {toast && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 999, padding: '12px 20px', borderRadius: 10,
          background: 'rgba(212,166,74,0.15)', border: `1px solid ${GOLD}`, color: GOLD,
          fontFamily: BARLOW, fontSize: 15, fontWeight: 600, boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}>
          ℹ {toast}
        </div>
      )}
    </div>
  )
}
