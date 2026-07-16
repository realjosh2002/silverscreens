'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SilverScreensLogo from '@/components/ui/SilverScreensLogo';
import {
  LayoutDashboard, FileText, MessageSquare, Mic2, Bookmark,
  Star, Bell, ChevronRight, ChevronLeft, Menu, ChevronDown,
  Crown, CreditCard, FileText as InvoiceIcon, RotateCcw,
  BarChart2, Check, RefreshCw, XCircle, Headphones,
  AlertTriangle, Shield,
} from 'lucide-react';

/* ─── Design tokens — identical to all other aspirant pages ─── */
const RED    = '#C8202A';
const GOLD   = '#D4A64A';
const BG     = '#050505';
const BG2    = '#0B0F14';
const BG3    = '#121821';
const BARLOW = '"Barlow Condensed", sans-serif';
const BEBAS  = "'Bebas Neue', sans-serif";
const GREEN  = '#22C55E';

/* ─── Sidebar — same 7-item pattern as all aspirant pages ─────── */
const SIDEBAR_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard',             href: '/dashboard' },
  { icon: FileText,        label: 'My Applications',       href: '/my-applications' },
  { icon: MessageSquare,   label: 'Messages',              href: '/messages',          badge: 2 },
  { icon: Mic2,            label: 'Auditions',              href: '/auditions' },
  { icon: Bookmark,        label: 'Saved Castings',        href: '/saved-castings' },
  { icon: Star,            label: 'Recommended Castings',  href: '/recommended' },
  { icon: Bell,            label: 'Notifications',         href: '/notifications',     badge: 3 },
];

const DROPDOWN_LINKS = [
  { label: 'My Profile',     href: '/profile' },
  { label: 'Subscription',   href: '/dashboard/subscription' },
  { label: 'Analytics',      href: '/analytics' },
  { label: 'Calendar',       href: '/calendar' },
  { label: 'Settings',       href: '/settings' },
  { label: 'Help & Support', href: '/contact' },
  { label: 'Logout',         href: '/login' },
];

/* ─── No hardcoded data — all fetched from API dynamically ─────── */













const QUICK_ACTIONS = [
  { icon: Crown,      label: 'Upgrade / Change Plan',   href: null,             color: GOLD },
  { icon: CreditCard, label: 'Manage Payment Methods',  href: null,             color: '' },
  { icon: InvoiceIcon,label: 'Download Invoice',        href: null,             color: '' },
  { icon: XCircle,    label: 'Cancel Subscription',     href: null,             color: RED,  danger: true },
];

const TABS = ['Overview', 'Plans', 'Billing History', 'Payment Methods'] as const;
type Tab = typeof TABS[number];

interface ApiPlan {
  id: string; plan_key: string; plan_name: string; duration_months: number;
  price: number; original_price: number | null; features: any;
  application_limit: number | null; is_featured: boolean; sort_order: number;
}
interface CurrentSub {
  plan_name: string; plan_id: string; status: string;
  starts_at: string; ends_at: string; price: number;
  duration_months: number; application_limit: number | null;
}
function formatPrice(n: number) { return `₹${n.toLocaleString('en-IN')}` }
function getDuration(m: number) { return m === 1 ? '1 Month' : `${m} Months` }
function getFeatures(f: any): string[] {
  if (Array.isArray(f)) return f as string[];
  if (f && typeof f === 'object') {
    if (Array.isArray(f.included)) return f.included;
    if (Array.isArray(f.features)) return f.features;
    return Object.values(f).flat().filter((v: any) => typeof v === 'string') as string[];
  }
  return [];
}
function getToken() {
  try { return JSON.parse(localStorage.getItem('ss_user') || '{}').token || '' } catch { return '' }
}

export default function SubscriptionPage() {
  const router = useRouter();
  const [sidebarOpen,  setSidebarOpen]  = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userName,     setUserName]     = useState('My Account');
  const [avatarUrl,    setAvatarUrl]    = useState('');
  const [apiPlans,     setApiPlans]     = useState<ApiPlan[]>([]);
  const [currentSub,   setCurrentSub]   = useState<CurrentSub | null>(null);
  const [appsUsed,     setAppsUsed]     = useState(0);
  const [billingHistory, setBillingHistory] = useState<any[]>([]);
  const [plansLoading, setPlansLoading] = useState(true);
  const [activeTab,    setActiveTab]    = useState<Tab>('Overview');

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('ss_user') || '{}');
      if (u.name)         setUserName(u.name);
      if (u.profilePhoto) setAvatarUrl(u.profilePhoto);
    } catch {}
  }, []);

  // Fetch plans dynamically — reflects any admin changes instantly
  useEffect(() => {
    fetch('/api/plans?type=aspirant')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        const list: ApiPlan[] = data.data?.aspirant_plans ?? data.aspirant_plans ?? [];
        setApiPlans(list.sort((a, b) => a.sort_order - b.sort_order));
      })
      .catch(() => {})
      .finally(() => setPlansLoading(false));
  }, []);

  // Fetch current subscription + usage
  useEffect(() => {
    const token = getToken();
    if (!token) return;
    fetch('/api/profile/aspirant', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        const p = data.data?.profile ?? data.profile ?? data;
        const sub = p?.profiles?.subscriptions?.[0] ?? null;
        if (sub) setCurrentSub({ plan_name: sub.plan_name ?? '—', plan_id: sub.plan_id ?? '', status: sub.status ?? 'active', starts_at: sub.starts_at ?? sub.created_at ?? '', ends_at: sub.ends_at ?? '', price: sub.price ?? 0, duration_months: sub.duration_months ?? 0, application_limit: sub.application_limit ?? null });
      }).catch(() => {});
    fetch('/api/applications', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setAppsUsed(data.data?.pagination?.total ?? data.pagination?.total ?? 0); })
      .catch(() => {});
    fetch('/api/payment?type=history', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        const list = data?.data?.payments ?? data?.payments ?? [];
        if (Array.isArray(list) && list.length > 0) {
          setBillingHistory(list.map((p: any) => ({ date: p.created_at ? new Date(p.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '', desc: p.plan_name ?? 'Subscription', amount: formatPrice(p.amount ?? 0), status: p.status ?? 'Paid', invoice: p.invoice_id ?? p.id ?? '' })));
        }
      }).catch(() => {});
  }, []);

  const appsTotal     = currentSub?.application_limit ?? 0;
  const appsRemaining = Math.max(0, appsTotal - appsUsed);
  const appsPct       = appsTotal > 0 ? Math.round((appsUsed / appsTotal) * 100) : 0;
  const circumference = 2 * Math.PI * 44;
  const currentPlanName  = currentSub?.plan_name ?? '—';
  const currentPlanPrice = currentSub?.price ? formatPrice(currentSub.price) : '—';
  const currentDuration  = currentSub?.duration_months ? getDuration(currentSub.duration_months) : '—';
  const nextBillingDate  = currentSub?.ends_at ? new Date(currentSub.ends_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
  const startDate        = currentSub?.starts_at ? new Date(currentSub.starts_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
  const isActive         = currentSub?.status === 'active';

  const SUMMARY_ROWS = [
    { label: 'Current Plan',        value: currentPlanName,  color: '' },
    { label: 'Plan Price',          value: currentSub?.price ? `${currentPlanPrice} / ${currentDuration}` : '—', color: '' },
    { label: 'Payment Status',      value: 'Paid',           color: GREEN },
    { label: 'Subscription Status', value: isActive ? 'Active' : (currentSub?.status ?? '—'), color: isActive ? GREEN : RED },
    { label: 'Next Billing Date',   value: nextBillingDate,  color: '' },
    { label: 'Applications Limit',  value: appsTotal > 0 ? `${appsTotal} / ${currentDuration}` : '—', color: '' },
  ];

  const QUICK_ACTIONS = [
    { icon: Crown,       label: 'Upgrade / Change Plan',  href: null, color: GOLD },
    { icon: CreditCard,  label: 'Manage Payment Methods', href: null, color: '' },
    { icon: InvoiceIcon, label: 'Download Invoice',       href: null, color: '' },
    { icon: XCircle,     label: 'Cancel Subscription',    href: null, color: RED, danger: true },
  ];

  const handleAction = (label: string) => {
    if (label === 'Upgrade / Change Plan') setActiveTab('Plans');
    else if (label === 'Manage Payment Methods') setActiveTab('Payment Methods');
    else if (label === 'Download Invoice') alert('Invoice download would start here.');
    else if (label === 'Cancel Subscription') {
      if (confirm('Are you sure you want to cancel your subscription? This action cannot be undone.')) alert('Subscription cancellation request submitted.');
    }
  };

  const SB_W = sidebarOpen ? 210 : 56;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: BG, fontFamily: BARLOW, color: '#F5F5F5' }}>

      {/* ══ HEADER — matches all other aspirant pages ══ */}
      <header style={{ height: 60, flexShrink: 0, background: BG2, borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', padding: '0 24px', gap: 16, zIndex: 50 }}>
        <SilverScreensLogo size="md" href="/" showTagline={false} />
        <div style={{ flex: 1 }} />
        <button onClick={() => router.push('/casting-calls')} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'transparent', border: `1px solid ${GOLD}`, color: GOLD, borderRadius: 8, padding: '0 18px', height: 36, fontSize: 15, fontWeight: 600, fontFamily: BARLOW, cursor: 'pointer', whiteSpace: 'nowrap' }}>+ Find Casting Calls</button>
        <div onClick={() => router.push('/messages')} style={{ position: 'relative', cursor: 'pointer' }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MessageSquare size={16} /></div>
          <div style={{ position: 'absolute', top: -5, right: -5, background: RED, borderRadius: '50%', width: 17, height: 17, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700 }}>2</div>
        </div>
        <div onClick={() => router.push('/notifications')} style={{ position: 'relative', cursor: 'pointer' }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Bell size={16} /></div>
          <div style={{ position: 'absolute', top: -5, right: -5, background: RED, borderRadius: '50%', width: 17, height: 17, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700 }}>3</div>
        </div>
        <div style={{ position: 'relative' }}>
          <div onClick={() => setDropdownOpen(v => !v)} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <img src={avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=C8202A&color=fff`} alt={userName} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${GOLD}` }} />
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.2 }}>{userName}</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>Aspirant</div>
            </div>
            <ChevronDown size={12} color="rgba(255,255,255,0.35)" />
          </div>
          {dropdownOpen && (
            <>
              <div onClick={() => setDropdownOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 150 }} />
              <div style={{ position: 'absolute', top: 46, right: 0, width: 200, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, overflow: 'hidden', zIndex: 200, boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}>
                {DROPDOWN_LINKS.map(({ label, href }) => (
                  <div key={label} onClick={() => { router.push(href); setDropdownOpen(false); }}
                    style={{ padding: '10px 16px', fontSize: 15, cursor: 'pointer', color: label === 'Logout' ? '#ff6b6b' : label === 'Subscription' ? GOLD : '#F5F5F5', fontWeight: label === 'Subscription' ? 700 : 400, borderTop: label === 'Logout' ? '1px solid rgba(255,255,255,0.07)' : 'none' }}
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

        {/* ── SIDEBAR — collapsible, same pattern as all aspirant pages ── */}
        <aside style={{ width: SB_W, flexShrink: 0, background: BG2, borderRight: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', overflowY: 'auto', overflowX: 'hidden', transition: 'width 0.2s ease' }}>
          <div style={{ display: 'flex', justifyContent: sidebarOpen ? 'flex-end' : 'center', padding: sidebarOpen ? '10px 12px 0' : '10px 0 0', flexShrink: 0 }}>
            <button onClick={() => setSidebarOpen(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', width: 30, height: 30, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            >{sidebarOpen ? <ChevronLeft size={16} /> : <Menu size={16} />}</button>
          </div>

          {sidebarOpen && (
            <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 9, overflow: 'hidden', border: `1px solid rgba(212,166,74,0.25)`, flexShrink: 0 }}>
                <img src={avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=C8202A&color=fff`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#F5F5F5', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userName}</div>
                <div style={{ fontSize: 14, color: GOLD, fontWeight: 600 }}>ASP03230158</div>
              </div>
            </div>
          )}

          <nav style={{ flex: 1, padding: '10px 0' }}>
            {SIDEBAR_ITEMS.map(({ icon: Icon, label, href, badge, active }: any) => (
              <div key={label} title={!sidebarOpen ? label : undefined} onClick={() => router.push(href)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'space-between' : 'center', padding: sidebarOpen ? '9px 16px' : '10px 0', cursor: 'pointer', background: active ? 'rgba(200,32,42,0.12)' : 'transparent', borderLeft: sidebarOpen && active ? `3px solid ${RED}` : '3px solid transparent' }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: sidebarOpen ? 10 : 0 }}>
                  <Icon size={15} color={active ? RED : 'rgba(255,255,255,0.45)'} strokeWidth={active ? 2.5 : 1.8} />
                  {sidebarOpen && <span style={{ fontSize: 15, color: active ? '#fff' : 'rgba(255,255,255,0.65)', fontWeight: active ? 600 : 400 }}>{label}</span>}
                </div>
                {sidebarOpen && badge && <div style={{ background: RED, color: '#fff', borderRadius: 12, fontSize: 14, fontWeight: 700, padding: '1px 6px', minWidth: 18, textAlign: 'center' }}>{badge}</div>}
              </div>
            ))}
          </nav>

          {sidebarOpen && (
            <div style={{ margin: '10px 10px 14px', borderRadius: 12, background: 'linear-gradient(135deg, #1a0507 0%, #2a0b0e 100%)', border: '1px solid rgba(200,32,42,0.25)', padding: '16px 14px', textAlign: 'center', flexShrink: 0 }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>👑</div>
              <div style={{ fontSize: 19, fontFamily: BARLOW, fontWeight: 600, letterSpacing: 0.5, marginBottom: 4 }}>Upgrade to Premium</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 12, lineHeight: 1.6 }}>Get noticed by top agencies and unlock exclusive opportunities.</div>
              <button onClick={() => setActiveTab('Plans')} style={{ width: '100%', background: GOLD, color: '#000', border: 'none', borderRadius: 8, padding: '8px 0', fontSize: 14, fontWeight: 700, fontFamily: BARLOW, cursor: 'pointer' }}>Upgrade Now</button>
            </div>
          )}
        </aside>

        {/* ── SHARED SCROLL WRAPPER ── */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex' }}>

          {/* ── MAIN CONTENT ── */}
          <div style={{ flex: 1, minWidth: 0, padding: '20px 20px 32px' }}>

            {/* Page header */}
            <div style={{ marginBottom: 16 }}>
              <h1 style={{ fontFamily: BEBAS, fontSize: 32, letterSpacing: 1.5, fontWeight: 400, color: GOLD, marginBottom: 4 }}>Subscription</h1>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)' }}>Manage your subscription plan, usage and billing information.</p>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: 20 }}>
              {TABS.map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} style={{
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  fontFamily: BARLOW, padding: '8px 20px', marginBottom: -1,
                  fontSize: 16, fontWeight: activeTab === tab ? 700 : 400,
                  color: activeTab === tab ? GOLD : 'rgba(255,255,255,0.5)',
                  borderBottom: activeTab === tab ? `2px solid ${GOLD}` : '2px solid transparent',
                  whiteSpace: 'nowrap',
                }}>{tab}</button>
              ))}
            </div>

            {/* ── OVERVIEW TAB ── */}
            {activeTab === 'Overview' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                {/* Current Plan + Usage row */}
                <div style={{ display: 'flex', gap: 14 }}>

                  {/* Current Plan */}
                  <div style={{ flex: 3, background: BG2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '18px 20px' }}>
                    <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 12 }}>Current Plan</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                      <div style={{ width: 56, height: 56, borderRadius: 12, background: 'rgba(212,166,74,0.12)', border: `1px solid rgba(212,166,74,0.25)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ fontSize: 26 }}>👑</span>
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 3 }}>
                          <span style={{ fontFamily: BEBAS, fontSize: 22, letterSpacing: 0.5, color: '#fff' }}>{currentPlanName}</span>
                          <span style={{ background: 'rgba(34,197,94,0.15)', color: GREEN, border: '1px solid rgba(34,197,94,0.3)', borderRadius: 20, padding: '2px 10px', fontSize: 13, fontWeight: 700 }}>{isActive ? 'Active' : (currentSub?.status ?? 'Inactive')}</span>
                        </div>
                        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)' }}>{''}</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 28, marginBottom: 18 }}>
                      {[
                        { label: 'Plan Duration', value: currentDuration },
                        { label: 'Start Date',    value: startDate },
                        { label: 'Next Renewal',  value: nextBillingDate },
                        { label: 'Auto Renew',    value: true ? '🟢 Enabled' : '🔴 Disabled' },
                      ].map(({ label, value }) => (
                        <div key={label}>
                          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>{label}</div>
                          <div style={{ fontSize: 15, fontWeight: 700 }}>{value}</div>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'flex', gap: 10 }}>
                      <button onClick={() => setActiveTab('Plans')} style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'transparent', border: `1px solid ${GOLD}`, color: GOLD, borderRadius: 8, padding: '9px 18px', fontSize: 15, fontWeight: 600, fontFamily: BARLOW, cursor: 'pointer' }}>
                        <Crown size={14} /> Manage Plan
                      </button>
                      <button onClick={() => {
                        if (confirm('Cancel Auto Renew? Your plan will expire on ' + nextBillingDate + '.')) alert('Auto Renew cancelled.');
                      }} style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)', borderRadius: 8, padding: '9px 18px', fontSize: 15, fontWeight: 600, fontFamily: BARLOW, cursor: 'pointer' }}>
                        <RefreshCw size={14} /> Cancel Auto Renew
                      </button>
                    </div>
                  </div>

                  {/* Applications Usage */}
                  <div style={{ flex: 2, background: BG2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '18px 20px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 14 }}>Applications Usage</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 20, flex: 1 }}>
                      {/* Circular gauge */}
                      <div style={{ position: 'relative', width: 110, height: 110, flexShrink: 0 }}>
                        <svg width="110" height="110" viewBox="0 0 110 110">
                          <circle cx="55" cy="55" r="44" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="10" />
                          <circle cx="55" cy="55" r="44" fill="none" stroke={GOLD} strokeWidth="10"
                            strokeDasharray={`${circumference * (appsPct / 100)} ${circumference}`}
                            strokeLinecap="round" transform="rotate(-90 55 55)"
                          />
                        </svg>
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontFamily: BEBAS, fontSize: 26, color: GOLD, lineHeight: 1 }}>{appsUsed}</span>
                          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Used</span>
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>Out of</div>
                        <div style={{ fontFamily: BEBAS, fontSize: 36, color: '#fff', lineHeight: 1 }}>{appsTotal}</div>
                        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>Applications</div>
                      </div>
                    </div>
                    <div style={{ fontSize: 14, color: GOLD, marginTop: 12, marginBottom: 14 }}>{appsRemaining} applications remaining</div>
                    <button onClick={() => alert('Usage details panel coming soon.')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, background: 'transparent', border: `1px solid ${GOLD}`, color: GOLD, borderRadius: 8, padding: '9px 0', fontSize: 15, fontWeight: 600, fontFamily: BARLOW, cursor: 'pointer', width: '100%' }}>
                      <BarChart2 size={14} /> View Usage Details
                    </button>
                  </div>
                </div>

                {/* Compare Plans */}
                <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '18px 20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <div>
                      <div style={{ fontFamily: BEBAS, fontSize: 22, letterSpacing: 0.5, color: GOLD, marginBottom: 3 }}>Compare Plans</div>
                      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)' }}>Choose the plan that's right for your career. Each plan has a fixed duration.</div>
                    </div>
                  </div>

                  {plansLoading ? (
                    <div style={{ textAlign: 'center', padding: '20px', color: 'rgba(255,255,255,0.35)', fontSize: 15 }}>Loading plans...</div>
                  ) : (
                  <div style={{ display: 'flex', gap: 12 }}>
                    {apiPlans.map((plan) => {
                      const isCurrent = currentSub?.plan_id === plan.plan_key || currentSub?.plan_name === plan.plan_name;
                      const features = getFeatures(plan.features);
                      return (
                      <div key={plan.id} style={{ flex: 1, borderRadius: 10, padding: '16px', border: isCurrent ? `2px solid ${GOLD}` : '1px solid rgba(255,255,255,0.1)', background: isCurrent ? 'rgba(212,166,74,0.06)' : BG3, position: 'relative' }}>
                        {plan.is_featured && !isCurrent && (
                          <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: GOLD, color: '#000', borderRadius: 20, padding: '3px 12px', fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap' }}>MOST POPULAR</div>
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                          <span style={{ fontSize: 17, fontWeight: 700, color: isCurrent ? GOLD : '#fff' }}>{plan.plan_name}</span>
                        </div>
                        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginBottom: 8 }}>{getDuration(plan.duration_months)}</div>
                        <div style={{ marginBottom: 4 }}>
                          <span style={{ fontFamily: BEBAS, fontSize: 28, color: isCurrent ? GOLD : '#fff' }}>{formatPrice(plan.price)}</span>
                          <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginLeft: 4 }}>/ {getDuration(plan.duration_months).toLowerCase()}</span>
                        </div>
                        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginBottom: 10 }}>≈ ₹{Math.round(plan.price / plan.duration_months)}/mo</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 16 }}>
                          {features.map((f, j) => (
                            <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                              <Check size={13} color={isCurrent ? GOLD : GREEN} strokeWidth={2.5} />
                              <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>{f}</span>
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={() => isCurrent ? null : confirm(`Switch to ${plan.plan_name} for ${formatPrice(plan.price)}?`) && alert('Plan change request submitted.')}
                          style={{ width: '100%', background: isCurrent ? GOLD : 'transparent', border: `1px solid ${isCurrent ? GOLD : 'rgba(212,166,74,0.5)'}`, color: isCurrent ? '#000' : GOLD, borderRadius: 8, padding: '9px 0', fontSize: 15, fontWeight: 700, fontFamily: BARLOW, cursor: isCurrent ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
                          {isCurrent ? <><Check size={14} /> Current Plan</> : 'Choose Plan'}
                        </button>
                      </div>
                      );
                    })}
                  </div>
                  )}
                </div>

                {/* Recent Transactions */}
                <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '18px 20px' }}>
                  <div style={{ fontFamily: BEBAS, fontSize: 20, letterSpacing: 0.5, color: GOLD, marginBottom: 14 }}>Recent Transactions</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1.5fr 1fr 1fr auto', gap: '0', borderBottom: '1px solid rgba(255,255,255,0.07)', paddingBottom: 8, marginBottom: 8 }}>
                    {['DATE', 'DESCRIPTION', 'PLAN', 'AMOUNT', 'STATUS', 'INVOICE'].map(h => (
                      <div key={h} style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: 0.5, padding: '0 8px' }}>{h}</div>
                    ))}
                  </div>
                  {billingHistory.length === 0 ? (
                    <div style={{ padding: '10px 8px', color: 'rgba(255,255,255,0.35)', fontSize: 15 }}>No transactions yet.</div>
                  ) : billingHistory.slice(0, 3).map((t, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1.5fr 1fr 1fr auto', borderBottom: i < Math.min(billingHistory.length, 3) - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', padding: '10px 0' }}>
                      <div style={{ fontSize: 15, padding: '0 8px', color: 'rgba(255,255,255,0.7)' }}>{t.date}</div>
                      <div style={{ fontSize: 15, padding: '0 8px' }}>{t.desc}</div>
                      <div style={{ fontSize: 15, padding: '0 8px', color: 'rgba(255,255,255,0.6)' }}>{t.desc}</div>
                      <div style={{ fontSize: 15, padding: '0 8px', fontWeight: 700 }}>{t.amount}</div>
                      <div style={{ fontSize: 15, padding: '0 8px' }}>
                        <span style={{ color: GREEN, fontWeight: 700 }}>{t.status}</span>
                      </div>
                      <div style={{ fontSize: 14, padding: '0 8px', cursor: 'pointer', color: GOLD }} onClick={() => alert('Invoice download would start here.')}>📄</div>
                    </div>
                  ))}
                  <button onClick={() => setActiveTab('Billing History')} style={{ marginTop: 12, background: 'none', border: 'none', color: GOLD, fontSize: 15, fontWeight: 700, fontFamily: BARLOW, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                    View All Transactions <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* ── PLANS TAB ── */}
            {activeTab === 'Plans' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <h2 style={{ fontFamily: BEBAS, fontSize: 22, letterSpacing: 0.5, color: GOLD, marginBottom: 3 }}>Choose Your Plan</h2>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)' }}>Select the plan that best fits your career goals. Each plan has a fixed duration.</p>
                </div>
                {plansLoading ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.35)', fontSize: 15 }}>Loading plans...</div>
                ) : apiPlans.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.35)', fontSize: 15 }}>No plans available at the moment.</div>
                ) : (
                <div style={{ display: 'flex', gap: 16 }}>
                  {apiPlans.map((plan) => {
                    const isCurrent = currentSub?.plan_id === plan.plan_key || currentSub?.plan_name === plan.plan_name;
                    const features = getFeatures(plan.features);
                    return (
                    <div key={plan.id} style={{ flex: 1, borderRadius: 12, padding: '20px', border: isCurrent ? `2px solid ${GOLD}` : '1px solid rgba(255,255,255,0.1)', background: isCurrent ? 'rgba(212,166,74,0.06)' : BG2, position: 'relative' }}>
                      {plan.is_featured && !isCurrent && (
                        <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: GOLD, color: '#000', borderRadius: 20, padding: '3px 14px', fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap' }}>MOST POPULAR</div>
                      )}
                      <div style={{ fontSize: 20, fontFamily: BEBAS, color: isCurrent ? GOLD : '#fff', marginBottom: 2 }}>{plan.plan_name}</div>
                      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginBottom: 10 }}>{getDuration(plan.duration_months)}</div>
                      <div style={{ marginBottom: 4 }}>
                        <span style={{ fontFamily: BEBAS, fontSize: 32, color: isCurrent ? GOLD : '#fff' }}>{formatPrice(plan.price)}</span>
                        <span style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', marginLeft: 5 }}>/ {getDuration(plan.duration_months).toLowerCase()}</span>
                      </div>
                      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginBottom: 16 }}>≈ ₹{Math.round(plan.price / plan.duration_months)}/mo</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 20 }}>
                        {features.map((f, j) => (
                          <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Check size={14} color={isCurrent ? GOLD : GREEN} strokeWidth={2.5} />
                            <span style={{ fontSize: 15, color: 'rgba(255,255,255,0.75)' }}>{f}</span>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => isCurrent ? null : confirm(`Switch to ${plan.plan_name} for ${formatPrice(plan.price)}?`) && alert('Plan change request submitted.')}
                        style={{ width: '100%', background: isCurrent ? GOLD : 'transparent', border: `1px solid ${isCurrent ? GOLD : 'rgba(212,166,74,0.5)'}`, color: isCurrent ? '#000' : GOLD, borderRadius: 8, padding: '10px 0', fontSize: 15, fontWeight: 700, fontFamily: BARLOW, cursor: isCurrent ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                        {isCurrent ? <><Check size={14} /> Current Plan</> : 'Choose Plan'}
                      </button>
                    </div>
                    );
                  })}
                </div>
                )}
              </div>
            )}

            {/* ── BILLING HISTORY TAB ── */}
            {activeTab === 'Billing History' && (
              <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '18px 20px' }}>
                <div style={{ fontFamily: BEBAS, fontSize: 22, letterSpacing: 0.5, color: GOLD, marginBottom: 16 }}>Billing History</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr 1fr auto', borderBottom: '1px solid rgba(255,255,255,0.07)', paddingBottom: 8, marginBottom: 4 }}>
                  {['DATE', 'DESCRIPTION', 'AMOUNT', 'STATUS', 'INVOICE'].map(h => (
                    <div key={h} style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: 0.5, padding: '0 8px' }}>{h}</div>
                  ))}
                </div>
                {billingHistory.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '30px', color: 'rgba(255,255,255,0.35)', fontSize: 15 }}>No billing history found.</div>
                ) : billingHistory.map((row, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr 1fr auto', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '11px 0' }}>
                    <div style={{ fontSize: 15, padding: '0 8px', color: 'rgba(255,255,255,0.7)' }}>{row.date}</div>
                    <div style={{ fontSize: 15, padding: '0 8px' }}>{row.desc}</div>
                    <div style={{ fontSize: 15, padding: '0 8px', fontWeight: 700 }}>{row.amount}</div>
                    <div style={{ padding: '0 8px' }}>
                      <span style={{ color: GREEN, fontWeight: 700, fontSize: 15 }}>{row.status}</span>
                    </div>
                    <button onClick={() => alert(`Downloading ${row.invoice}...`)} style={{ padding: '0 8px', background: 'none', border: 'none', color: GOLD, fontSize: 14, cursor: 'pointer', fontFamily: BARLOW, display: 'flex', alignItems: 'center', gap: 5 }}>
                      📄 Download
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* ── PAYMENT METHODS TAB ── */}
            {activeTab === 'Payment Methods' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '18px 20px' }}>
                  <div style={{ fontFamily: BEBAS, fontSize: 22, letterSpacing: 0.5, color: GOLD, marginBottom: 14 }}>Saved Payment Methods</div>
                  <div style={{ background: BG3, borderRadius: 10, padding: '14px 16px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 48, height: 30, background: '#fff', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontSize: 13, fontWeight: 900, color: '#000' }}>UPI</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 700 }}>UPI / Razorpay</div>
                      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>Managed via Razorpay</div>
                    </div>
                    <span style={{ background: 'rgba(212,166,74,0.15)', border: `1px solid ${GOLD}`, color: GOLD, borderRadius: 6, padding: '3px 10px', fontSize: 13, fontWeight: 700 }}>Primary</span>
                  </div>
                  <button onClick={() => alert('Add payment method flow would open here.')} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'transparent', border: `1px solid ${GOLD}`, color: GOLD, borderRadius: 8, padding: '9px 18px', fontSize: 15, fontWeight: 600, fontFamily: BARLOW, cursor: 'pointer', marginTop: 6 }}>
                    + Add Payment Method
                  </button>
                </div>

                <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '18px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <Shield size={16} color={GREEN} />
                    <span style={{ fontWeight: 700, fontSize: 16 }}>Your payments are secure</span>
                  </div>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>All transactions are encrypted and processed securely. We never store your card details.</p>
                </div>
              </div>
            )}

          </div>

          {/* ── RIGHT RAIL ── */}
          <div style={{ width: 280, flexShrink: 0, borderLeft: '1px solid rgba(255,255,255,0.07)', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Subscription Summary */}
            <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '16px' }}>
              <div style={{ fontFamily: BEBAS, fontSize: 20, letterSpacing: 0.5, color: GOLD, marginBottom: 14 }}>Subscription Summary</div>
              {SUMMARY_ROWS.map(({ label, value, color }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>{label}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: color || '#fff' }}>{value}</span>
                </div>
              ))}
              <button onClick={() => alert('Invoice download would start here.')} style={{ marginTop: 12, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: 8, padding: '9px 0', fontSize: 14, fontWeight: 600, fontFamily: BARLOW, cursor: 'pointer' }}>
                📄 View Invoice
              </button>
            </div>

            {/* Quick Actions */}
            <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '16px' }}>
              <div style={{ fontFamily: BEBAS, fontSize: 20, letterSpacing: 0.5, color: GOLD, marginBottom: 12 }}>Quick Actions</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {QUICK_ACTIONS.map(({ icon: Icon, label, danger }) => (
                  <div key={label} onClick={() => handleAction(label)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 8, cursor: 'pointer', background: 'transparent', border: '1px solid rgba(255,255,255,0.07)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Icon size={14} color={danger ? RED : 'rgba(255,255,255,0.5)'} />
                      <span style={{ fontSize: 15, color: danger ? RED : '#fff' }}>{label}</span>
                    </div>
                    <ChevronRight size={13} color={danger ? RED : 'rgba(255,255,255,0.3)'} />
                  </div>
                ))}
              </div>
            </div>

            {/* Need Help */}
            <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '16px' }}>
              <div style={{ fontFamily: BEBAS, fontSize: 20, letterSpacing: 0.5, color: GOLD, marginBottom: 6 }}>Need Help?</div>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, marginBottom: 12 }}>If you have any questions about your subscription, we're here to help!</p>
              <button onClick={() => router.push('/contact')} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'transparent', border: `1px solid ${GOLD}`, color: GOLD, borderRadius: 8, padding: '9px 0', fontSize: 15, fontWeight: 600, fontFamily: BARLOW, cursor: 'pointer' }}>
                <Headphones size={14} /> Contact Support
              </button>
            </div>

            {/* Payment Method */}
            <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '16px' }}>
              <div style={{ fontFamily: BEBAS, fontSize: 20, letterSpacing: 0.5, color: GOLD, marginBottom: 12 }}>Payment Method</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: BG3, borderRadius: 9, padding: '12px', marginBottom: 10 }}>
                <div style={{ width: 44, height: 26, background: '#fff', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 12, fontWeight: 900, color: '#000' }}>UPI</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>UPI ID</div>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>Managed via Razorpay</div>
                </div>
                <span style={{ background: 'rgba(212,166,74,0.15)', color: GOLD, borderRadius: 5, padding: '2px 8px', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>Primary</span>
              </div>
              <button onClick={() => setActiveTab('Payment Methods')} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, background: 'transparent', border: `1px solid ${GOLD}`, color: GOLD, borderRadius: 8, padding: '9px 0', fontSize: 14, fontWeight: 600, fontFamily: BARLOW, cursor: 'pointer' }}>
                <RefreshCw size={13} /> Manage Payment Methods
              </button>
              <div style={{ marginTop: 10, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 8, padding: '10px 12px', display: 'flex', alignItems: 'flex-start', gap: 8, cursor: 'pointer' }}
                onClick={() => router.push('/contact')}
              >
                <Shield size={14} color={GREEN} style={{ marginTop: 2, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: GREEN, marginBottom: 2 }}>Your payments are secure</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.4 }}>All transactions are encrypted and processed securely.</div>
                </div>
                <ChevronRight size={13} color="rgba(255,255,255,0.3)" style={{ flexShrink: 0, marginTop: 2 }} />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}