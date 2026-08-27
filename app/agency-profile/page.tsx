'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AgencyTopnav from '@/components/layout/AgencyTopnav';
import AdminTopnav  from '@/components/layout/AdminTopnav';
import { AgencyVerificationProvider } from '@/context/AgencyVerificationContext';
import {
  LayoutDashboard, Megaphone, PlusCircle, ClipboardList,
  UserSearch, Star, CalendarCheck, MessageSquare, Bell,
  Bookmark, ChevronLeft, Menu, Edit, MapPin, Globe, Mail,
  Calendar, Users, Building2, CheckCircle2, ChevronRight,
  AlertCircle, UserCheck, FileText, Flag, ShieldCheck,
  CreditCard, Database, BarChart2, ScrollText, KeyRound,
  Settings, BellRing, Ticket, Tag,
} from 'lucide-react';

/* ─── Design tokens ───────────────────────────────────────────── */
const RED    = '#C8202A';
const GOLD   = '#D4A64A';
const GREEN  = '#22C55E';
const ORANGE = '#F97316';
const BLUE   = '#3B82F6';
const BG     = '#050505';
const BG2    = '#0B0F14';
const BG3    = '#121821';
const BG4    = '#1C2030';
const BEBAS  = "'Bebas Neue', sans-serif";
const BARLOW = "'Barlow Condensed', sans-serif";
const WHITE  = '#F5F5F5';
const GRAY   = '#6B7280';
const LIGHT  = '#A8B0BD';

/* ─── Nav ─────────────────────────────────────────────────────── */
const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard',               href: '/agency/dashboard' },
  { icon: PlusCircle,      label: 'Create Casting Call',     href: '/agency/create-casting' },
  { icon: Megaphone,       label: 'Casting Calls List',      href: '/agency/casting-calls' },
  { icon: UserSearch,      label: 'Talent Search',           href: '/agency/talent-search' },
  { icon: ClipboardList,   label: 'Applications Management', href: '/agency/applications' },
  { icon: Star,            label: 'Shortlisted Talents',     href: '/agency/shortlisted' },
  { icon: CalendarCheck,   label: 'Audition Management',     href: '/agency/auditions' },
  { icon: Bookmark,        label: 'Saved Talents',           href: '/agency/saved-talents' },
  { icon: MessageSquare,   label: 'Messages',                href: '/agency/messages' },
  { icon: Bell,            label: 'Notifications',           href: '/agency/notifications' },
];

const ADMIN_NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard',                href: '/admin/dashboard'             },
  { icon: Users,           label: 'User Management',          href: '/admin/users'                 },
  { icon: UserCheck,       label: 'Talent Verification',      href: '/admin/talent-verification'   },
  { icon: Building2,       label: 'Agency Verification',      href: '/admin/agency-verification'   },
  { icon: FileText,        label: 'Applications Monitoring',  href: '/admin/applications'          },
  { icon: Flag,            label: 'Reports & Complaints',     href: '/admin/reports'               },
  { icon: ShieldCheck,     label: 'Fraud Detection',          href: '/admin/fraud'                 },
  { icon: CreditCard,      label: 'Subscription Management',  href: '/admin/subscriptions'         },
  { icon: Megaphone,       label: 'Advertisement Management', href: '/admin/advertisements'        },
  { icon: Database,        label: 'CMS Management',           href: '/admin/cms'                   },
  { icon: BellRing,        label: 'Notifications Management', href: '/admin/notifications'         },
  { icon: BarChart2,       label: 'Analytics & Reports',      href: '/admin/analytics'             },
  { icon: Ticket,          label: 'Support Tickets',          href: '/admin/support'               },
  { icon: ScrollText,      label: 'Audit Logs',               href: '/admin/audit'                 },
  { icon: KeyRound,        label: 'Roles & Permissions',      href: '/admin/roles'                 },
  { icon: Settings,        label: 'Settings',                 href: '/admin/settings'              },
];

const GOLD_DIM = 'rgba(212,166,74,0.12)';
const GOLD_BDR = 'rgba(212,166,74,0.22)';

const PROFILE_MENU = [
  { label: 'Reports & Analytics',    href: '/agency/reports' },
  { label: 'Subscription & Billing', href: '/agency/subscription' },
  { label: 'Company Profile',        href: '/agency-profile' },
  { label: 'Documents',              href: '/agency/documents' },
  { label: 'Calendar',               href: '/agency/calendar' },
  { label: 'Settings',               href: '/agency/settings' },
  { label: 'Support',                href: '/contact' },
  { label: 'Logout',                 href: '/login' },
];

const TABS = ['Overview', 'Casting Calls', 'Applications', 'Auditions', 'Saved Talents'];

/* ─── Types ───────────────────────────────────────────────────── */
interface AgencyProfile {
  id: string;
  company_name: string;
  profile_number: string | null;
  company_description: string | null;
  years_of_experience: number | null;
  website_url: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  logo_url: string | null;
  banner_url: string | null;
  gallery_urls: string[] | null;
  contact_email: string;
  contact_phone: string;
  show_email: boolean | null;
  show_phone: boolean | null;
  social_links: Record<string, string> | null;
  verification_status: string | null;
  trust_score: number | null;
  profile_views: number | null;
  created_at: string | null;
  profiles: {
    email: string;
    profile_number: string | null;
  };
}

interface CastingCall {
  id: string;
  title: string;
  project_type: string;
  role_name: string;
  location: string | null;
  status: string;
  applications_count: number | null;
  last_application_date: string;
  created_at: string | null;
}

interface Application {
  id: string;
  status: string;
  applied_at: string | null;
  casting_calls: { title: string; project_type: string };
  aspirant_profiles: {
    first_name: string;
    last_name: string;
    profile_image_url: string | null;
    category: string | null;
    role: string | null;
  };
}

interface Audition {
  id: string;
  scheduled_at: string;
  mode: string;
  status: string;
  venue_details: string | null;
  meeting_link: string | null;
  casting_calls: { title: string };
  aspirant_profiles: {
    first_name: string;
    last_name: string;
    profile_image_url: string | null;
  };
}

interface SavedTalent {
  id: string;
  created_at: string | null;
  aspirant_profiles: {
    id: string;
    first_name: string;
    last_name: string;
    category: string | null;
    role: string | null;
    city: string | null;
    profile_image_url: string | null;
    verification_status: string | null;
  };
}

interface Stats {
  casting_calls: { total: number; active: number; closed: number };
  applicants:    { total: number; shortlisted: number; selected: number };
  auditions:     { total: number; scheduled: number; completed: number };
  shortlisted_talents: number;
}

/* ─── Helpers ─────────────────────────────────────────────────── */
function getAuthHeaders(): Record<string, string> {
  try {
    const u = JSON.parse(localStorage.getItem('ss_user') || '{}');
    return u.token ? { Authorization: `Bearer ${u.token}` } : {};
  } catch { return {}; }
}

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

function fmtDate(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function calcYearsExp(foundingYear: number | null): string {
  if (!foundingYear) return '—';
  const years = new Date().getFullYear() - foundingYear;
  return years > 0 ? `${years}+ Years` : '< 1 Year';
}

function fmtMemberSince(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
}

function statusColor(s: string) {
  if (s === 'active' || s === 'approved' || s === 'completed' || s === 'selected') return GREEN;
  if (s === 'rejected' || s === 'cancelled' || s === 'closed' || s === 'expired') return RED;
  if (s === 'shortlisted' || s === 'scheduled' || s === 'in_review') return ORANGE;
  return BLUE;
}

function statusBg(s: string) { return `${statusColor(s)}18`; }

function statusLabel(s: string) {
  return s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

/* ─── Skeleton ─────────────────────────────────────────────────── */
function Sk({ w = '100%', h = 16 }: { w?: string | number; h?: number }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: 4,
      background: `linear-gradient(90deg,${BG3} 25%,${BG4} 50%,${BG3} 75%)`,
      backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite',
    }} />
  );
}

/* ─── Empty State ─────────────────────────────────────────────── */
function EmptyState({ icon, title, desc, action, onAction }: {
  icon: string; title: string; desc: string; action?: string; onAction?: () => void;
}) {
  return (
    <div style={{
      padding: '40px 20px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
      textAlign: 'center',
      background: `linear-gradient(135deg, ${BG3}80, ${BG4}40)`,
      border: `1px solid rgba(212,166,74,0.08)`,
      borderRadius: 10,
    }}>
      {/* Icon ring */}
      <div style={{
        width: 64, height: 64, borderRadius: '50%',
        background: `rgba(212,166,74,0.08)`,
        border: `1px solid rgba(212,166,74,0.2)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 26, marginBottom: 4,
      }}>{icon}</div>
      {/* Red accent line */}
      <div style={{ width: 32, height: 2, background: `linear-gradient(90deg, transparent, ${RED}, transparent)`, borderRadius: 1 }} />
      <div style={{ fontFamily: BEBAS, fontSize: 20, color: WHITE, letterSpacing: 1 }}>{title}</div>
      <div style={{ fontFamily: BARLOW, fontSize: 14, color: GRAY, maxWidth: 300, lineHeight: 1.6 }}>{desc}</div>
      {action && onAction && (
        <button onClick={onAction} style={{
          marginTop: 6, padding: '9px 24px',
          background: GOLD, border: 'none', borderRadius: 7,
          color: BG, fontFamily: BARLOW, fontSize: 14, fontWeight: 700, cursor: 'pointer',
          boxShadow: `0 4px 16px rgba(212,166,74,0.25)`,
        }}>{action}</button>
      )}
    </div>
  );
}

/* ─── Overview Tab ─────────────────────────────────────────────── */
function OverviewTab({
  profile, stats, loading, loadingStats, router, setActiveTab, isAdmin, userRole, hasSubscription,
}: {
  profile: AgencyProfile | null;
  stats: Stats | null;
  loading: boolean;
  loadingStats: boolean;
  router: ReturnType<typeof useRouter>;
  setActiveTab: (t: string) => void;
  isAdmin?: boolean;
  userRole?: string;
  hasSubscription?: boolean;
}) {
  const social = (profile?.social_links ?? {}) as Record<string, string>;
  const canSeePhone = isAdmin || userRole === 'agency' || (userRole === 'aspirant' && hasSubscription);

  const detailRows = profile ? [
    { label: 'Verification',  value: profile.verification_status ? statusLabel(profile.verification_status) : '—', gold: profile.verification_status === 'approved' },
    { label: 'Member Since',  value: fmtMemberSince(profile.created_at) },
    { label: 'Head Office',   value: [profile.city, profile.state, profile.country].filter(Boolean).join(', ') || '—' },
    { label: 'Contact Phone', value: canSeePhone ? (profile.contact_phone || '—') : '🔒 Subscribe to view' },
    { label: 'Contact Email', value: profile.contact_email || '—' },
    { label: 'Experience',    value: calcYearsExp(profile.years_of_experience) },
    { label: 'Trust Score',   value: profile.trust_score ? `${profile.trust_score}/100` : '—' },
    { label: 'Profile Views', value: profile.profile_views?.toLocaleString() ?? '—' },
    { label: 'Website',       value: profile.website_url ?? '—', gold: !!profile.website_url, link: profile.website_url ?? undefined },
  ] : [];

  return (
    <>
      {/* Row 1: About + Agency Details */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16, marginBottom: 16 }}>
        {/* About */}
        <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: 20 }}>
          <div style={{ fontFamily: BEBAS, fontSize: 17, color: WHITE, letterSpacing: 1, marginBottom: 12 }}>
            About {loading ? '...' : profile?.company_name ?? 'Agency'}
          </div>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Sk h={14} /><Sk h={14} /><Sk h={14} w="80%" />
            </div>
          ) : (
            <p style={{ fontFamily: BARLOW, fontSize: 16, color: LIGHT, lineHeight: 1.7, marginBottom: 16 }}>
              {profile?.company_description || 'No company description added yet. Edit your profile to add a description.'}
            </p>
          )}

          {/* Info grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <Sk key={i} h={40} />)
              : [
                  { icon: <Building2 size={14} color={GOLD} />, label: 'Company Type', value: 'Production House' },
                  { icon: <Globe size={14} color={GOLD} />,     label: 'Website',      value: profile?.website_url ?? '—', gold: !!profile?.website_url, link: profile?.website_url ?? undefined },
                  { icon: <Calendar size={14} color={GOLD} />,  label: 'Member Since', value: fmtMemberSince(profile?.created_at ?? null) },
                  { icon: <Mail size={14} color={GOLD} />,      label: 'Email',        value: profile?.contact_email || '—' },
                  { icon: <Mail size={14} color={GOLD} />,      label: 'Phone',        value: canSeePhone ? (profile?.contact_phone || '—') : '🔒 Subscribe to view' },
                ].map(({ icon, label, value, gold, link }) => (
                  <div key={label} style={{ display: 'flex', gap: 10 }}>
                    <div style={{ marginTop: 2, flexShrink: 0 }}>{icon}</div>
                    <div>
                      <div style={{ fontFamily: BARLOW, fontSize: 16, color: GRAY, marginBottom: 1 }}>{label}</div>
                      {link
                        ? <a href={link.startsWith('http') ? link : `https://${link}`} target="_blank" rel="noopener noreferrer" style={{ fontFamily: BARLOW, fontSize: 15, color: GOLD, fontWeight: 600, textDecoration: 'none' }}>{value}</a>
                        : <div style={{ fontFamily: BARLOW, fontSize: 15, color: gold ? GOLD : WHITE, fontWeight: 600 }}>{value}</div>
                      }
                    </div>
                  </div>
                ))
            }
          </div>

          {/* Social links */}
          {!loading && Object.keys(social).length > 0 && (
            <div style={{ display: 'flex', gap: 10 }}>
              {Object.entries(social).map(([platform, url]) => url && (
                <a key={platform} href={url} target="_blank" rel="noopener noreferrer"
                  title={platform}
                  style={{ width: 34, height: 34, borderRadius: '50%', background: BG3, border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, cursor: 'pointer', textDecoration: 'none' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = GOLD)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                >
                  {platform === 'instagram' ? '📸' : platform === 'facebook' ? '👤' : platform === 'youtube' ? '▶️' : platform === 'linkedin' ? '💼' : '🔗'}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Agency Details */}
        <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: 16 }}>
          <div style={{ fontFamily: BEBAS, fontSize: 17, color: WHITE, letterSpacing: 1, marginBottom: 12 }}>Agency Details</div>
          {loading
            ? <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{Array.from({ length: 8 }).map((_, i) => <Sk key={i} h={32} />)}</div>
            : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 16px' }}>
                {detailRows.map(d => (
                  <div key={d.label} style={{ marginBottom: 6 }}>
                    <div style={{ fontFamily: BARLOW, fontSize: 16, color: GRAY, marginBottom: 1 }}>{d.label}</div>
                    {d.link
                      ? <a href={d.link.startsWith('http') ? d.link : `https://${d.link}`} target="_blank" rel="noopener noreferrer" style={{ fontFamily: BARLOW, fontSize: 15, color: GOLD, fontWeight: 700, textDecoration: 'none' }}>{d.value}</a>
                      : <div style={{ fontFamily: BARLOW, fontSize: 15, color: (d as any).gold ? GOLD : WHITE, fontWeight: (d as any).gold ? 700 : 500 }}>{d.value}</div>
                    }
                  </div>
                ))}
              </div>
            )
          }
        </div>
      </div>

      {/* Gallery section — only shown if agency has uploaded gallery images */}
      {!loading && (profile as any)?.gallery_urls?.length > 0 && (
        <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: 20, marginBottom: 16 }}>
          <div style={{ fontFamily: BEBAS, fontSize: 17, color: WHITE, letterSpacing: 1, marginBottom: 14 }}>
            Company Gallery
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 10 }}>
            {(profile as any).gallery_urls.map((url: string, i: number) => (
              <div key={i} onClick={() => window.open(url, '_blank')}
                style={{ width: 160, height: 120, borderRadius: 8, overflow: 'hidden', cursor: 'pointer', flexShrink: 0, border: '1px solid rgba(255,255,255,0.08)', position: 'relative' as const }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = GOLD)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
              >
                <img src={url} alt={`gallery-${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Row 2: Quick-access cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>

        {/* Casting Calls card */}
        <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontFamily: BEBAS, fontSize: 16, color: WHITE, letterSpacing: 1 }}>Active Casting Calls</div>
            <button onClick={() => setActiveTab('Casting Calls')} style={{ background: 'none', border: 'none', color: GOLD, fontFamily: BARLOW, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>View All</button>
          </div>
          {loadingStats ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{Array.from({ length: 3 }).map((_, i) => <Sk key={i} h={44} />)}</div>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
                {[
                  { label: 'Total',  value: stats?.casting_calls.total  ?? 0, color: WHITE },
                  { label: 'Active', value: stats?.casting_calls.active ?? 0, color: GREEN },
                  { label: 'Closed', value: stats?.casting_calls.closed ?? 0, color: GRAY  },
                ].map(r => (
                  <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', background: BG3, borderRadius: 6 }}>
                    <span style={{ fontFamily: BARLOW, fontSize: 16, color: LIGHT }}>{r.label}</span>
                    <span style={{ fontFamily: BEBAS, fontSize: 19, color: r.color, letterSpacing: 0.5 }}>{r.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
          <button onClick={() => router.push('/agency/casting-calls')} style={{ width: '100%', padding: '8px', background: 'transparent', border: '1px solid rgba(212,166,74,0.3)', borderRadius: 7, color: GOLD, fontFamily: BARLOW, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
            Go to Casting Calls →
          </button>
        </div>

        {/* Applications card */}
        <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontFamily: BEBAS, fontSize: 16, color: WHITE, letterSpacing: 1 }}>Applications</div>
            <button onClick={() => setActiveTab('Applications')} style={{ background: 'none', border: 'none', color: GOLD, fontFamily: BARLOW, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>View All</button>
          </div>
          {loadingStats ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{Array.from({ length: 3 }).map((_, i) => <Sk key={i} h={44} />)}</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
              {[
                { label: 'Total Received', value: stats?.applicants.total       ?? 0, color: WHITE },
                { label: 'Shortlisted',    value: stats?.applicants.shortlisted ?? 0, color: GOLD  },
                { label: 'Selected',       value: stats?.applicants.selected    ?? 0, color: GREEN },
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', background: BG3, borderRadius: 6 }}>
                  <span style={{ fontFamily: BARLOW, fontSize: 16, color: LIGHT }}>{r.label}</span>
                  <span style={{ fontFamily: BEBAS, fontSize: 19, color: r.color, letterSpacing: 0.5 }}>{r.value}</span>
                </div>
              ))}
            </div>
          )}
          <button onClick={() => router.push('/agency/applications')} style={{ width: '100%', padding: '8px', background: 'transparent', border: '1px solid rgba(212,166,74,0.3)', borderRadius: 7, color: GOLD, fontFamily: BARLOW, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
            Go to Applications →
          </button>
        </div>

        {/* Auditions card */}
        <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontFamily: BEBAS, fontSize: 16, color: WHITE, letterSpacing: 1 }}>Auditions</div>
            <button onClick={() => setActiveTab('Auditions')} style={{ background: 'none', border: 'none', color: GOLD, fontFamily: BARLOW, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>View All</button>
          </div>
          {loadingStats ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{Array.from({ length: 3 }).map((_, i) => <Sk key={i} h={44} />)}</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
              {[
                { label: 'Total',     value: stats?.auditions.total     ?? 0, color: WHITE  },
                { label: 'Scheduled', value: stats?.auditions.scheduled ?? 0, color: ORANGE },
                { label: 'Completed', value: stats?.auditions.completed ?? 0, color: GREEN  },
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', background: BG3, borderRadius: 6 }}>
                  <span style={{ fontFamily: BARLOW, fontSize: 16, color: LIGHT }}>{r.label}</span>
                  <span style={{ fontFamily: BEBAS, fontSize: 19, color: r.color, letterSpacing: 0.5 }}>{r.value}</span>
                </div>
              ))}
            </div>
          )}
          <button onClick={() => router.push('/agency/auditions')} style={{ width: '100%', padding: '8px', background: 'transparent', border: '1px solid rgba(212,166,74,0.3)', borderRadius: 7, color: GOLD, fontFamily: BARLOW, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
            Go to Auditions →
          </button>
        </div>

        {/* Saved Talents card */}
        <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontFamily: BEBAS, fontSize: 16, color: WHITE, letterSpacing: 1 }}>Saved Talents</div>
            <button onClick={() => setActiveTab('Saved Talents')} style={{ background: 'none', border: 'none', color: GOLD, fontFamily: BARLOW, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>View All</button>
          </div>
          {loadingStats ? <Sk h={60} /> : (
            <div style={{ padding: '16px 0', textAlign: 'center' }}>
              <div style={{ fontFamily: BEBAS, fontSize: 38, color: GOLD, letterSpacing: 1 }}>{stats?.shortlisted_talents ?? 0}</div>
              <div style={{ fontFamily: BARLOW, fontSize: 16, color: GRAY }}>talents saved</div>
            </div>
          )}
          <button onClick={() => router.push('/agency/saved-talents')} style={{ width: '100%', padding: '8px', background: 'transparent', border: '1px solid rgba(212,166,74,0.3)', borderRadius: 7, color: GOLD, fontFamily: BARLOW, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
            Go to Saved Talents →
          </button>
        </div>

        {/* Performance Summary card */}
        <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: 16 }}>
          <div style={{ fontFamily: BEBAS, fontSize: 16, color: WHITE, letterSpacing: 1, marginBottom: 12 }}>Performance Summary</div>
          {loadingStats ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{Array.from({ length: 4 }).map((_, i) => <Sk key={i} h={30} />)}</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Total Casting Calls', value: stats?.casting_calls.total    ?? 0, color: BLUE      },
                { label: 'Total Applications',  value: stats?.applicants.total       ?? 0, color: GOLD      },
                { label: 'Auditions Scheduled', value: stats?.auditions.scheduled    ?? 0, color: '#9B6BD4' },
                { label: 'Talents Selected',    value: stats?.applicants.selected    ?? 0, color: GREEN     },
              ].map(s => (
                <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: BARLOW, fontSize: 16, color: LIGHT }}>{s.label}</span>
                  <span style={{ fontFamily: BEBAS, fontSize: 19, color: s.color, letterSpacing: 0.5 }}>{s.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
          <button onClick={() => router.push('/agency/reports')} style={{ width: '100%', marginTop: 14, padding: '8px', background: 'transparent', border: '1px solid rgba(212,166,74,0.3)', borderRadius: 7, color: GOLD, fontFamily: BARLOW, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
            View Full Reports →
          </button>
        </div>

        {/* Quick Actions card — agency only; replaced with admin actions for admin view */}
        {!isAdmin ? (
          <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: 16 }}>
            <div style={{ fontFamily: BEBAS, fontSize: 16, color: WHITE, letterSpacing: 1, marginBottom: 12 }}>Quick Actions</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: '+ Post New Casting Call', href: '/agency/create-casting', bg: RED, color: WHITE },
                { label: '🔍 Search Talents',        href: '/agency/talent-search',  bg: BG3, color: WHITE },
                { label: '📅 Schedule Audition',     href: '/agency/auditions',      bg: BG3, color: WHITE },
                { label: '📊 View Reports',          href: '/agency/reports',        bg: BG3, color: WHITE },
              ].map(a => (
                <button key={a.label} onClick={() => router.push(a.href)} style={{ width: '100%', padding: '9px 12px', background: a.bg, border: `1px solid ${a.bg === BG3 ? 'rgba(255,255,255,0.08)' : 'none'}`, borderRadius: 7, color: a.color, fontFamily: BARLOW, fontSize: 15, fontWeight: 600, cursor: 'pointer', textAlign: 'left' }}>
                  {a.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: 16 }}>
            <div style={{ fontFamily: BEBAS, fontSize: 16, color: WHITE, letterSpacing: 1, marginBottom: 12 }}>Admin Actions</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: '👤 View User Management',    href: '/admin/users',                bg: BG3, color: WHITE },
                { label: '✅ Agency Verification',     href: '/admin/agency-verification',  bg: BG3, color: WHITE },
                { label: '🚩 Reports & Complaints',    href: '/admin/reports',              bg: BG3, color: WHITE },
                { label: '🛡️ Fraud Detection',         href: '/admin/fraud',                bg: BG3, color: WHITE },
              ].map(a => (
                <button key={a.label} onClick={() => router.push(a.href)} style={{ width: '100%', padding: '9px 12px', background: a.bg, border: `1px solid ${a.bg === BG3 ? 'rgba(255,255,255,0.08)' : 'none'}`, borderRadius: 7, color: a.color, fontFamily: BARLOW, fontSize: 15, fontWeight: 600, cursor: 'pointer', textAlign: 'left' }}>
                  {a.label}
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </>
  );
}

/* ─── Casting Calls Tab ────────────────────────────────────────── */
function CastingCallsTab({
  castingCalls, loading, router,
}: {
  castingCalls: CastingCall[];
  loading: boolean;
  router: ReturnType<typeof useRouter>;
}) {
  const [filter, setFilter] = useState('All');
  const filtered = filter === 'All' ? castingCalls : castingCalls.filter(c => c.status === filter.toLowerCase());

  return (
    <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <div style={{ fontFamily: BEBAS, fontSize: 17, color: WHITE, letterSpacing: 1 }}>
          Casting Calls {!loading && `(${castingCalls.length})`}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {['All', 'Active', 'Closed', 'Draft'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: '5px 14px', background: filter === f ? GOLD : BG3, border: `1px solid ${filter === f ? GOLD : 'rgba(255,255,255,0.1)'}`, borderRadius: 5, color: filter === f ? BG : LIGHT, fontFamily: BARLOW, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>{f}</button>
          ))}
          <button onClick={() => router.push('/agency/create-casting')} style={{ padding: '5px 14px', background: RED, border: 'none', borderRadius: 5, color: WHITE, fontFamily: BARLOW, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>+ New</button>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{Array.from({ length: 4 }).map((_, i) => <Sk key={i} h={64} />)}</div>
      ) : filtered.length === 0 ? (
        <EmptyState icon="🎬" title="No Casting Calls Yet" desc="Post your first casting call to start finding talent." action="Post Casting Call" onAction={() => router.push('/agency/create-casting')} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(c => (
            <div key={c.id} onClick={() => router.push('/agency/casting-calls')}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: BG3, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, cursor: 'pointer' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(212,166,74,0.3)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: BARLOW, fontSize: 15, fontWeight: 600, color: WHITE, marginBottom: 3 }}>{c.title}</div>
                <div style={{ fontFamily: BARLOW, fontSize: 14, color: GRAY }}>
                  {c.project_type} · {c.location ?? 'Location TBD'} · {c.applications_count ?? 0} applications · Deadline {fmtDate(c.last_application_date)}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                <span style={{ padding: '3px 10px', background: statusBg(c.status), border: `1px solid ${statusColor(c.status)}40`, borderRadius: 10, fontFamily: BARLOW, fontSize: 14, color: statusColor(c.status), fontWeight: 600 }}>{statusLabel(c.status)}</span>
                <ChevronRight size={16} color={GRAY} />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && castingCalls.length > 0 && (
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <button onClick={() => router.push('/agency/casting-calls')} style={{ padding: '10px 28px', background: GOLD, border: 'none', borderRadius: 7, color: BG, fontFamily: BARLOW, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
            Manage All Casting Calls →
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── Applications Tab ─────────────────────────────────────────── */
function ApplicationsTab({
  applications, loading, router,
}: {
  applications: Application[];
  loading: boolean;
  router: ReturnType<typeof useRouter>;
}) {
  const [filter, setFilter] = useState('All');
  const statuses = ['All', 'Applied', 'In Review', 'Shortlisted', 'Rejected', 'Selected'];
  const filtered = filter === 'All' ? applications : applications.filter(a => a.status === filter.toLowerCase().replace(' ', '_'));

  return (
    <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <div style={{ fontFamily: BEBAS, fontSize: 17, color: WHITE, letterSpacing: 1 }}>
          Applications {!loading && `(${applications.length})`}
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {statuses.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: '4px 12px', background: filter === f ? GOLD : BG3, border: `1px solid ${filter === f ? GOLD : 'rgba(255,255,255,0.1)'}`, borderRadius: 5, color: filter === f ? BG : LIGHT, fontFamily: BARLOW, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>{f}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{Array.from({ length: 5 }).map((_, i) => <Sk key={i} h={60} />)}</div>
      ) : filtered.length === 0 ? (
        <EmptyState icon="📋" title="No Applications" desc="Applications from aspirants will appear here once they apply to your casting calls." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map(a => {
            const name = a.aspirant_profiles ? `${a.aspirant_profiles.first_name ?? ''} ${a.aspirant_profiles.last_name ?? ''}`.trim() : 'Unknown';
            return (
              <div key={a.id} onClick={() => router.push('/agency/applications')}
                style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', background: BG3, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, cursor: 'pointer' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(212,166,74,0.3)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}
              >
                {/* Avatar */}
                <div style={{ width: 42, height: 42, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, background: BG4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {a.aspirant_profiles.profile_image_url
                    ? <img src={a.aspirant_profiles.profile_image_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                    : <span style={{ fontFamily: BEBAS, fontSize: 16, color: GOLD }}>{initials(name)}</span>
                  }
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: BARLOW, fontSize: 15, fontWeight: 600, color: WHITE, marginBottom: 2 }}>{name}</div>
                  <div style={{ fontFamily: BARLOW, fontSize: 14, color: GRAY }}>
                    {a.aspirant_profiles.category ?? a.aspirant_profiles.role ?? '—'} · {a.casting_calls.title}
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <span style={{ padding: '3px 10px', borderRadius: 10, fontFamily: BARLOW, fontSize: 14, fontWeight: 600, background: statusBg(a.status), color: statusColor(a.status) }}>{statusLabel(a.status)}</span>
                  <div style={{ fontFamily: BARLOW, fontSize: 14, color: GRAY, marginTop: 4 }}>{fmtDate(a.applied_at)}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && applications.length > 0 && (
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <button onClick={() => router.push('/agency/applications')} style={{ padding: '10px 28px', background: GOLD, border: 'none', borderRadius: 7, color: BG, fontFamily: BARLOW, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
            Manage All Applications →
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── Auditions Tab ────────────────────────────────────────────── */
function AuditionsTab({
  auditions, loading, router,
}: {
  auditions: Audition[];
  loading: boolean;
  router: ReturnType<typeof useRouter>;
}) {
  const [filter, setFilter] = useState('All');
  const filtered = filter === 'All' ? auditions : auditions.filter(a => a.status === filter.toLowerCase());

  return (
    <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <div style={{ fontFamily: BEBAS, fontSize: 17, color: WHITE, letterSpacing: 1 }}>
          Auditions {!loading && `(${auditions.length})`}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {['All', 'Scheduled', 'Completed', 'Cancelled'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: '5px 12px', background: filter === f ? GOLD : BG3, border: `1px solid ${filter === f ? GOLD : 'rgba(255,255,255,0.1)'}`, borderRadius: 5, color: filter === f ? BG : LIGHT, fontFamily: BARLOW, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>{f}</button>
          ))}
          <button onClick={() => router.push('/agency/auditions')} style={{ padding: '5px 14px', background: RED, border: 'none', borderRadius: 5, color: WHITE, fontFamily: BARLOW, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Schedule Audition</button>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{Array.from({ length: 4 }).map((_, i) => <Sk key={i} h={64} />)}</div>
      ) : filtered.length === 0 ? (
        <EmptyState icon="📅" title="No Auditions Yet" desc="Schedule auditions for shortlisted aspirants from your applications page." action="Go to Applications" onAction={() => router.push('/agency/applications')} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(a => {
            const name = a.aspirant_profiles ? `${a.aspirant_profiles.first_name ?? ''} ${a.aspirant_profiles.last_name ?? ''}`.trim() : 'Unknown';
            return (
              <div key={a.id} onClick={() => router.push('/agency/auditions')}
                style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 16px', background: BG3, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, cursor: 'pointer' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(212,166,74,0.3)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}
              >
                <div style={{ width: 48, height: 48, borderRadius: 8, background: 'rgba(249,115,22,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <CalendarCheck size={20} color={ORANGE} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: BARLOW, fontSize: 15, fontWeight: 600, color: WHITE, marginBottom: 3 }}>{a.casting_calls?.title ?? 'Audition'}</div>
                  <div style={{ fontFamily: BARLOW, fontSize: 14, color: GRAY }}>
                    {name} · {fmtDate(a.scheduled_at)} · {a.mode === 'online' ? (a.meeting_link ? 'Online' : 'Online') : a.venue_details ?? 'Venue TBD'}
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <span style={{ padding: '3px 10px', borderRadius: 10, fontFamily: BARLOW, fontSize: 14, fontWeight: 600, background: statusBg(a.status), color: statusColor(a.status) }}>{statusLabel(a.status)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && auditions.length > 0 && (
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <button onClick={() => router.push('/agency/auditions')} style={{ padding: '10px 28px', background: GOLD, border: 'none', borderRadius: 7, color: BG, fontFamily: BARLOW, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
            Manage All Auditions →
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── Saved Talents Tab ────────────────────────────────────────── */
function SavedTalentsTab({
  savedTalents, loading, router,
}: {
  savedTalents: SavedTalent[];
  loading: boolean;
  router: ReturnType<typeof useRouter>;
}) {
  return (
    <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <div style={{ fontFamily: BEBAS, fontSize: 17, color: WHITE, letterSpacing: 1 }}>
          Saved Talents {!loading && `(${savedTalents.length})`}
        </div>
        <button onClick={() => router.push('/agency/talent-search')} style={{ padding: '5px 14px', background: RED, border: 'none', borderRadius: 5, color: WHITE, fontFamily: BARLOW, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>+ Find Talent</button>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>{Array.from({ length: 8 }).map((_, i) => <Sk key={i} h={200} />)}</div>
      ) : savedTalents.length === 0 ? (
        <EmptyState icon="⭐" title="No Saved Talents" desc="Save talented aspirants from the Talent Search page to find them quickly later." action="Search Talents" onAction={() => router.push('/agency/talent-search')} />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
          {savedTalents.map(t => {
            const name = `${t.aspirant_profiles.first_name} ${t.aspirant_profiles.last_name}`;
            return (
              <div key={t.id} onClick={() => router.push('/agency/saved-talents')}
                style={{
                  background: BG3, borderRadius: 10,
                  border: '1px solid rgba(255,255,255,0.06)',
                  overflow: 'hidden', cursor: 'pointer',
                  transition: 'transform 0.15s, box-shadow 0.15s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(212,166,74,0.35)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.4)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Photo */}
                <div style={{ width: '100%', aspectRatio: '3/4', overflow: 'hidden', background: BG4, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  {t.aspirant_profiles.profile_image_url
                    ? <img src={t.aspirant_profiles.profile_image_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                    : (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                        <div style={{ width: 52, height: 52, borderRadius: '50%', background: `rgba(212,166,74,0.12)`, border: `1px solid ${GOLD}40`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontFamily: BEBAS, fontSize: 20, color: GOLD }}>{initials(name)}</span>
                        </div>
                      </div>
                    )
                  }
                  {/* Verified badge overlay */}
                  {t.aspirant_profiles.verification_status === 'approved' && (
                    <div style={{ position: 'absolute', top: 8, right: 8, background: `${GOLD}22`, border: `1px solid ${GOLD}60`, borderRadius: 20, padding: '2px 7px', display: 'flex', alignItems: 'center', gap: 3 }}>
                      <CheckCircle2 size={10} color={GOLD} />
                      <span style={{ fontFamily: BARLOW, fontSize: 11, color: GOLD, fontWeight: 700 }}>Verified</span>
                    </div>
                  )}
                  {/* Bottom gradient */}
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 40, background: 'linear-gradient(to top, rgba(18,24,33,0.9), transparent)', pointerEvents: 'none' }} />
                </div>
                {/* Info */}
                <div style={{ padding: '10px 12px' }}>
                  <div style={{ fontFamily: BARLOW, fontSize: 14, fontWeight: 700, color: WHITE, marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</div>
                  <div style={{ fontFamily: BARLOW, fontSize: 13, color: GOLD, marginBottom: 3 }}>{t.aspirant_profiles.category ?? t.aspirant_profiles.role ?? '—'}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <MapPin size={11} color={GRAY} />
                    <span style={{ fontFamily: BARLOW, fontSize: 13, color: GRAY }}>{t.aspirant_profiles.city ?? '—'}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && savedTalents.length > 0 && (
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <button onClick={() => router.push('/agency/saved-talents')} style={{ padding: '10px 28px', background: GOLD, border: 'none', borderRadius: 7, color: BG, fontFamily: BARLOW, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
            Manage Saved Talents →
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── Main Page ────────────────────────────────────────────────── */
export default function AgencyProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const viewId  = searchParams.get('id'); // set when admin views an agency profile
  const isAdmin = !!viewId; // when id param is present, we are in admin-view mode

  /* ── Auth ── */
  const [agencyName,     setAgencyName]     = useState('My Agency');
  const [agencyInitials, setAgencyInitials] = useState('AG');
  const [agencyId,       setAgencyId]       = useState('—');
  const [userRole,       setUserRole]       = useState<string>('agency');
  const [hasSubscription, setHasSubscription] = useState<boolean>(true);

  /* ── Data ── */
  const [profile,      setProfile]      = useState<AgencyProfile | null>(null);
  const [stats,        setStats]        = useState<Stats | null>(null);
  const [castingCalls, setCastingCalls] = useState<CastingCall[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [auditions,    setAuditions]    = useState<Audition[]>([]);
  const [savedTalents, setSavedTalents] = useState<SavedTalent[]>([]);

  /* ── Loading ── */
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingStats,   setLoadingStats]   = useState(true);
  const [loadingCasting, setLoadingCasting] = useState(true);
  const [loadingApps,    setLoadingApps]    = useState(true);
  const [loadingAuds,    setLoadingAuds]    = useState(true);
  const [loadingSaved,   setLoadingSaved]   = useState(true);

  /* ── UI ── */
  const [resolvedUuid,  setResolvedUuid]  = useState<string>('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [activeTab,   setActiveTab]   = useState('Overview');
  const [expanded,    setExpanded]    = useState(false);

  const SB_W = sidebarOpen ? 230 : 52;

  /* ── Load identity from localStorage instantly ── */
  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('ss_user') || '{}');
      if (u.name) {
        setAgencyName(u.name);
        setAgencyInitials(initials(u.name));
      }
      if (u.profileNumber) setAgencyId(u.profileNumber);
      if (u.role) setUserRole(u.role);
      // Check subscription status for aspirants
      if (u.role === 'aspirant') {
        const h2 = u.token ? { Authorization: `Bearer ${u.token}` } : {};
        fetch('/api/profile/aspirant', { headers: h2 as any })
          .then(r => r.ok ? r.json() : null)
          .then(d => {
            const subs = d?.data?.profile?.profiles?.subscriptions ?? [];
            setHasSubscription(subs.some((s: any) => s.status === 'active'));
          }).catch(() => {});
      }
    } catch {}
  }, []);

  /* ── Fetch profile ── */
  const fetchProfile = useCallback(async () => {
    try {
      setLoadingProfile(true);
      const h = getAuthHeaders();
      let p: AgencyProfile | null = null;

      if (viewId) {
        // Admin viewing a specific agency profile.
        // viewId may be a profile number (e.g. AG072610001) or a UUID — resolve to UUID first.
        let uuid = viewId;
        const looksLikeProfileNumber = /^[A-Za-z]{1,3}\d+$/.test(viewId);
        if (looksLikeProfileNumber) {
          const searchRes  = await fetch(`/api/admin/users?keyword=${encodeURIComponent(viewId)}&limit=1`, { headers: h });
          const searchData = searchRes.ok ? await searchRes.json() : null;
          const matched    = searchData?.data?.users?.[0];
          if (matched) uuid = matched.id;
        }
        setResolvedUuid(uuid);
        const res = await fetch(`/api/admin/users?user_id=${uuid}`, { headers: h });
        if (!res.ok) return;
        const d = await res.json();
        const user = d.data?.user;
        const ag = Array.isArray(user?.agency_profiles) ? user.agency_profiles[0] : user?.agency_profiles;
        if (ag) {
          p = { ...ag, profiles: { id: user.id, email: user.email, profile_number: user.profile_number, phone: user.phone } } as AgencyProfile;
        }
      } else {
        // Agency viewing their own profile
        const res = await fetch('/api/profile/agency', { headers: h });
        if (!res.ok) return;
        const d = await res.json();
        p = d.data?.profile ?? d.profile ?? d;
      }

      if (p) {
        setProfile(p);
        const name = p.company_name;
        setAgencyName(name);
        setAgencyInitials(initials(name));
        // agency_profiles has its own profile_number (AG prefix); profiles.profile_number may be aspirant-prefixed
        const agNum = (p as any).profile_number ?? p.profiles?.profile_number;
        if (agNum) setAgencyId(agNum);
      }
    } catch (e) { console.error(e); }
    finally { setLoadingProfile(false); }
  }, [viewId]);

  /* ── Fetch stats ── */
  const fetchStats = useCallback(async () => {
    try {
      setLoadingStats(true);
      const h = getAuthHeaders();
      const url = viewId
        ? `/api/agency/reports/stats?agency_user_id=${resolvedUuid || viewId}`
        : '/api/agency/reports/stats';
      const res = await fetch(url, { headers: h });
      if (!res.ok) return;
      const d = await res.json();
      setStats(d.data ?? null);
    } catch (e) { console.error(e); }
    finally { setLoadingStats(false); }
  }, [viewId, resolvedUuid]);

  /* ── Fetch casting calls ── */
  const fetchCasting = useCallback(async () => {
    try {
      setLoadingCasting(true);
      const h = getAuthHeaders();
      const url = viewId
        ? `/api/casting-calls?agency_user_id=${resolvedUuid || viewId}`
        : '/api/casting-calls';
      const res = await fetch(url, { headers: h });
      if (!res.ok) return;
      const d = await res.json();
      const list = d.data?.casting_calls ?? d.data ?? d.casting_calls ?? [];
      setCastingCalls(Array.isArray(list) ? list : []);
    } catch (e) { console.error(e); }
    finally { setLoadingCasting(false); }
  }, [viewId]);

  /* ── Fetch applications ── */
  const fetchApplications = useCallback(async () => {
    try {
      setLoadingApps(true);
      const h = getAuthHeaders();
      const url = viewId
        ? `/api/applications?agency_user_id=${resolvedUuid || viewId}`
        : '/api/applications';
      const res = await fetch(url, { headers: h });
      if (!res.ok) return;
      const d = await res.json();
      const list = d.data?.applications ?? d.data ?? d.applications ?? [];
      setApplications(Array.isArray(list) ? list : []);
    } catch (e) { console.error(e); }
    finally { setLoadingApps(false); }
  }, [viewId]);

  /* ── Fetch auditions ── */
  const fetchAuditions = useCallback(async () => {
    try {
      setLoadingAuds(true);
      const h = getAuthHeaders();
      const url = viewId
        ? `/api/auditions?agency_user_id=${resolvedUuid || viewId}`
        : '/api/auditions';
      const res = await fetch(url, { headers: h });
      if (!res.ok) return;
      const d = await res.json();
      const list = d.data?.auditions ?? d.data ?? d.auditions ?? [];
      setAuditions(Array.isArray(list) ? list : []);
    } catch (e) { console.error(e); }
    finally { setLoadingAuds(false); }
  }, [viewId]);

  /* ── Fetch saved/shortlisted talents ── */
  const fetchSaved = useCallback(async () => {
    try {
      setLoadingSaved(true);
      const h = getAuthHeaders();
      const url = viewId
        ? `/api/shortlisted?agency_user_id=${resolvedUuid || viewId}`
        : '/api/shortlisted';
      const res = await fetch(url, { headers: h });
      if (!res.ok) return;
      const d = await res.json();
      const list = d.data?.shortlisted ?? d.data ?? d.shortlisted ?? [];
      setSavedTalents(Array.isArray(list) ? list : []);
    } catch (e) { console.error(e); }
    finally { setLoadingSaved(false); }
  }, [viewId]);

  // When admin views by profile number, fetchProfile resolves the UUID first.
  // All data fetches depend on resolvedUuid being set, so we split into two effects.
  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  useEffect(() => {
    // For agency viewing own profile: viewId is empty, fetch immediately.
    // For admin viewing: wait until resolvedUuid is set by fetchProfile.
    if (viewId && !resolvedUuid) return;
    fetchStats();
    fetchCasting();
    fetchApplications();
    fetchAuditions();
    fetchSaved();
  }, [resolvedUuid, viewId, fetchStats, fetchCasting, fetchApplications, fetchAuditions, fetchSaved]);

  /* ── Derived profile fields ── */
  const location    = [profile?.city, profile?.state, profile?.country].filter(Boolean).join(', ') || '—';
  const isVerified  = profile?.verification_status === 'approved';
  const companyDesc = profile?.company_description ?? '';
  const bannerUrl   = profile?.banner_url ?? null;
  const logoUrl     = profile?.logo_url ?? null;
  const websiteUrl  = profile?.website_url ?? null;
  const yearsExp    = profile?.years_of_experience ?? null;

  /* ── Stats bar values ── */
  const statBar = [
    { icon: '🎬', val: stats ? String(stats.casting_calls.total) : '—', lbl: 'Casting Calls' },
    { icon: '👥', val: stats ? String(stats.applicants.total)    : '—', lbl: 'Applications'  },
    { icon: '📅', val: stats ? String(stats.auditions.total)     : '—', lbl: 'Auditions'     },
    { icon: '⭐', val: stats ? String(stats.shortlisted_talents) : '—', lbl: 'Saved Talents' },
    { icon: '🏆', val: calcYearsExp(yearsExp).replace(' Years', '').replace('< 1', '<1'), lbl: 'Yrs Experience'},
  ];

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: BG, fontFamily: BARLOW, color: WHITE }}>

        {/* ══ TOPNAV ══ */}
        {isAdmin ? <AdminTopnav /> : (
          <AgencyVerificationProvider>
            <AgencyTopnav />
          </AgencyVerificationProvider>
        )}

        {/* ══ BODY ══ */}
        {isAdmin && (
          <div style={{ padding: '10px 20px', background: '#131720', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => router.back()} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 7, padding: '6px 14px', color: 'rgba(255,255,255,0.7)', fontFamily: BARLOW, fontSize: 14, cursor: 'pointer' }}>← Back</button>
            <span style={{ fontFamily: BARLOW, fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>Viewing agency profile as Admin</span>
          </div>
        )}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

          <aside style={{ width: SB_W, flexShrink: 0, background: BG2, borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', overflowY: 'auto', overflowX: 'hidden', scrollbarWidth: 'none', transition: 'width 0.2s ease' }}>
            <div style={{ height: 52, display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'flex-end' : 'center', padding: sidebarOpen ? '0 12px' : 0, borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
              <button onClick={() => setSidebarOpen(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', width: 30, height: 30, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'none')}
              >{sidebarOpen ? <ChevronLeft size={16} /> : <Menu size={16} />}</button>
            </div>

            {isAdmin ? (
              <>
                {sidebarOpen && (
                  <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 9, background: 'rgba(239,68,68,0.2)', border: `1px solid rgba(212,166,74,0.25)`, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: RED }}>A</div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: WHITE, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Super Admin</div>
                      <div style={{ fontSize: 14, color: RED, fontWeight: 600 }}>Administrator</div>
                    </div>
                  </div>
                )}
                <nav style={{ flex: 1, padding: sidebarOpen ? '8px 6px' : '8px 4px', overflowY: 'auto', scrollbarWidth: 'none' }}>
                  {ADMIN_NAV_ITEMS.map(({ icon: Icon, label, href }) => (
                    <div key={label} onClick={() => router.push(href)} title={!sidebarOpen ? label : undefined}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'flex-start' : 'center', padding: sidebarOpen ? '8px 10px' : '10px 0', marginBottom: 2, borderRadius: 6, cursor: 'pointer', background: 'transparent', border: '1px solid transparent', gap: sidebarOpen ? 9 : 0 }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <Icon size={15} color="rgba(255,255,255,0.42)" strokeWidth={1.8} />
                      {sidebarOpen && <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', fontWeight: 400, whiteSpace: 'nowrap', flex: 1 }}>{label}</span>}
                    </div>
                  ))}
                </nav>
              </>
            ) : (
              <>
                {sidebarOpen && (
                  <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 9, background: 'linear-gradient(135deg,#1a1410,#2a1e0e)', border: `1px solid ${GOLD}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: GOLD, fontFamily: BEBAS, flexShrink: 0 }}>{agencyInitials}</div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: WHITE, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{agencyName}</div>
                      <div onClick={() => router.push('/agency-profile')} style={{ fontSize: 14, color: RED, fontWeight: 600, cursor: 'pointer' }}>View Company Profile</div>
                    </div>
                  </div>
                )}
                <nav style={{ flex: 1, padding: sidebarOpen ? '8px 6px' : '8px 4px', overflowY: 'auto', scrollbarWidth: 'none' }}>
                  {NAV_ITEMS.map(({ icon: Icon, label, href }) => {
                    const active = href === '/agency-profile';
                    return (
                      <div key={label} onClick={() => router.push(href)} title={!sidebarOpen ? label : undefined}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'space-between' : 'center', padding: sidebarOpen ? '8px 10px' : '10px 0', marginBottom: 2, borderRadius: 6, cursor: 'pointer', background: active ? 'rgba(200,32,42,0.12)' : 'transparent', borderLeft: sidebarOpen && active ? `3px solid ${RED}` : sidebarOpen ? '3px solid transparent' : 'none' }}
                        onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                        onMouseLeave={e => { if (!active) e.currentTarget.style.background = active ? 'rgba(200,32,42,0.12)' : 'transparent'; }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: sidebarOpen ? 9 : 0, justifyContent: 'center' }}>
                          <Icon size={15} color={active ? RED : 'rgba(255,255,255,0.42)'} strokeWidth={active ? 2.5 : 1.8} />
                          {sidebarOpen && <span style={{ fontSize: 15, fontWeight: active ? 600 : 400, color: active ? WHITE : 'rgba(255,255,255,0.6)', whiteSpace: 'nowrap' }}>{label}</span>}
                        </div>
                      </div>
                    );
                  })}
                </nav>
              </>
            )}
          </aside>

          {/* ── SCROLLABLE CONTENT ── */}
          <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>

            {/* ═══ HERO ═══ */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              {/* Blurred background from logo */}
              <div style={{ position: 'absolute', inset: 0,
                backgroundImage: logoUrl ? `url(${logoUrl})` : 'none',
                backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.07 }} />
              {/* Dark gradient overlay */}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(5,5,5,0.97) 0%, rgba(5,5,5,0.80) 60%, rgba(5,5,5,0.55) 100%)' }} />

              <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: 28, padding: '28px 28px 24px', alignItems: 'flex-start' }}>

                {/* Logo / Avatar card */}
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{ width: 140, height: 160, borderRadius: 12, overflow: 'hidden', border: '2px solid rgba(212,166,74,0.3)', background: 'linear-gradient(145deg,#0f1219,#1c1508)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    {logoUrl
                      ? <img src={logoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <>
                          <span style={{ fontFamily: BEBAS, fontSize: 48, color: GOLD, letterSpacing: 3, lineHeight: 1 }}>{agencyInitials}</span>
                          <span style={{ fontFamily: BARLOW, fontSize: 12, color: 'rgba(212,166,74,0.45)', marginTop: 4, letterSpacing: 3 }}>AGENCY</span>
                        </>
                    }
                  </div>
                </div>

                {/* Info */}
                <div style={{ flex: 1 }}>
                  {/* Name + verified */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6, flexWrap: 'wrap' }}>
                    {loadingProfile
                      ? <div style={{ height: 44, width: 280, borderRadius: 4, background: BG3 }} />
                      : <h1 style={{ fontFamily: BEBAS, fontSize: 44, letterSpacing: 2, color: '#F5F5F5', margin: 0, lineHeight: 1 }}>{profile?.company_name ?? agencyName}</h1>
                    }
                    {isVerified && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 12px', background: 'rgba(212,166,74,0.12)', border: '1px solid rgba(212,166,74,0.3)', borderRadius: 20, fontFamily: BARLOW, fontSize: 13, fontWeight: 700, color: GOLD }}>
                        <CheckCircle2 size={12} color={GOLD} /> Verified
                      </span>
                    )}
                    {profile && !isVerified && profile.verification_status === 'pending' && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 12px', background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.3)', borderRadius: 20, fontFamily: BARLOW, fontSize: 13, fontWeight: 700, color: ORANGE }}>
                        <AlertCircle size={12} color={ORANGE} /> Pending Verification
                      </span>
                    )}
                  </div>

                  {/* Company type chip */}
                  <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 14, fontFamily: BARLOW, color: RED, background: 'rgba(200,32,42,0.12)', border: '1px solid rgba(200,32,42,0.3)', borderRadius: 20, padding: '3px 12px', fontWeight: 600 }}>
                      {(profile as any)?.company_type ?? 'Production House'}
                    </span>
                  </div>

                  {/* Meta row */}
                  <div style={{ display: 'flex', gap: 22, marginBottom: 16, flexWrap: 'wrap' }}>
                    {location !== '—' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <MapPin size={15} color={GRAY} />
                        <span style={{ fontSize: 16, color: '#A8B0BD' }}>{location}</span>
                      </div>
                    )}
                    {agencyId !== '—' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Users size={15} color={GRAY} />
                        <span style={{ fontSize: 16, color: '#A8B0BD' }}>{agencyId}</span>
                      </div>
                    )}
                    {websiteUrl && (
                      <a href={websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`} target="_blank" rel="noopener noreferrer"
                        style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}>
                        <Globe size={15} color={GOLD} />
                        <span style={{ fontSize: 16, color: GOLD, fontWeight: 600 }}>{websiteUrl}</span>
                      </a>
                    )}
                    {yearsExp && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 15 }}>🏆</span>
                        <span style={{ fontSize: 16, color: '#A8B0BD' }}>{calcYearsExp(yearsExp)} Experience</span>
                      </div>
                    )}
                  </div>

                  {/* About */}
                  {!loadingProfile && (
                    <div style={{ marginBottom: 20, maxWidth: 680 }}>
                      <p style={{ fontFamily: BARLOW, fontSize: 15, color: companyDesc ? '#A8B0BD' : GRAY, lineHeight: 1.7, margin: 0 }}>
                        {companyDesc
                          ? (expanded ? companyDesc : companyDesc.slice(0, 180) + (companyDesc.length > 180 ? '...' : ''))
                          : 'No company description added yet.'}
                      </p>
                      {companyDesc.length > 180 && (
                        <button onClick={() => setExpanded(!expanded)} style={{ background: 'none', border: 'none', color: GOLD, fontFamily: BARLOW, fontSize: 14, fontWeight: 600, cursor: 'pointer', padding: '4px 0', marginTop: 2 }}>
                          {expanded ? 'See Less ▲' : 'See More ▾'}
                        </button>
                      )}
                    </div>
                  )}

                  {/* Action buttons */}
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    {!isAdmin && (
                      <button onClick={() => router.push('/create-company-profile?mode=edit')}
                        style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 22px', background: GOLD, border: 'none', borderRadius: 7, color: '#050505', fontFamily: BARLOW, fontSize: 15, fontWeight: 700, cursor: 'pointer', boxShadow: `0 6px 20px rgba(212,166,74,0.25)` }}>
                        <Edit size={14} /> Edit Profile
                      </button>
                    )}
                    {isAdmin && (
                      <button onClick={() => router.back()}
                        style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 22px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 7, color: '#F5F5F5', fontFamily: BARLOW, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
                        ← Back
                      </button>
                    )}
                    <button onClick={() => setActiveTab('Casting Calls')}
                      style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 22px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 7, color: '#F5F5F5', fontFamily: BARLOW, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
                      🎬 Casting Calls
                    </button>
                    <button onClick={() => setActiveTab('Applications')}
                      style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 22px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 7, color: '#F5F5F5', fontFamily: BARLOW, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
                      📋 Applications
                    </button>
                  </div>
                </div>
              </div>

              {/* Stats bar */}
              <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(11,15,20,0.8)', backdropFilter: 'blur(8px)' }}>
                {statBar.map(({ val, lbl }, i) => (
                  <div key={lbl} style={{ textAlign: 'center', padding: '18px 8px', borderRight: i < 4 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(212,166,74,0.04)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div style={{ fontFamily: BEBAS, fontSize: 32, color: loadingStats ? GRAY : GOLD, letterSpacing: 2, lineHeight: 1 }}>
                      {loadingStats ? '—' : val}
                    </div>
                    <div style={{ fontFamily: BARLOW, fontSize: 12, color: GRAY, marginTop: 5, letterSpacing: 1, textTransform: 'uppercase' }}>{lbl}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.07)', background: BG2, borderRadius: '10px 10px 0 0', padding: '0 8px', marginBottom: 0 }}>
              {TABS.map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '13px 22px', background: 'none', border: 'none',
                    borderBottom: `2px solid ${activeTab === tab ? GOLD : 'transparent'}`,
                    marginBottom: -1, cursor: 'pointer',
                    fontFamily: BARLOW, fontSize: 15,
                    fontWeight: activeTab === tab ? 700 : 400,
                    color: activeTab === tab ? GOLD : GRAY,
                    whiteSpace: 'nowrap', transition: 'color 0.15s',
                    letterSpacing: activeTab === tab ? 0.5 : 0,
                  }}
                  onMouseEnter={e => { if (activeTab !== tab) e.currentTarget.style.color = LIGHT; }}
                  onMouseLeave={e => { if (activeTab !== tab) e.currentTarget.style.color = GRAY; }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div style={{ padding: '20px 28px 32px' }}>
            {activeTab === 'Overview'      && <OverviewTab profile={profile} stats={stats} loading={loadingProfile} loadingStats={loadingStats} router={router} setActiveTab={setActiveTab} isAdmin={isAdmin} userRole={userRole} hasSubscription={hasSubscription} />}
            {activeTab === 'Casting Calls' && <CastingCallsTab castingCalls={castingCalls} loading={loadingCasting} router={router} />}
            {activeTab === 'Applications'  && <ApplicationsTab applications={applications} loading={loadingApps} router={router} />}
            {activeTab === 'Auditions'     && <AuditionsTab auditions={auditions} loading={loadingAuds} router={router} />}
            {activeTab === 'Saved Talents' && <SavedTalentsTab savedTalents={savedTalents} loading={loadingSaved} router={router} />}
            </div>

          </div>
        </div>
      </div>
    </>
  );
}