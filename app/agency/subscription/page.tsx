'use client';

import AgencyTopnav from '@/components/layout/AgencyTopnav'
import { useState, Suspense, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import {
  LayoutDashboard, Megaphone, PlusCircle, ClipboardList,
  UserSearch, Star, CalendarCheck, MessageSquare, Bell,
  Bookmark, ChevronLeft, Menu, BarChart2, CreditCard, Settings,
} from 'lucide-react';

// ─── Design Tokens ────────────────────────────────────────────────────────────
const RED    = '#C8202A';
const GOLD   = '#D4A64A';
const GREEN  = '#22C55E';
const BLUE   = '#3B82F6';
const PURPLE = '#8B5CF6';
const ORANGE = '#F97316';
const BG     = '#050505';
const BG2    = '#0B0F14';
const BG3    = '#121821';
const BG4    = '#1C2030';
const BEBAS  = "'Bebas Neue', sans-serif";
const BARLOW = "'Barlow Condensed', sans-serif";
const GRAY   = '#6B7280';
const LIGHT  = '#9CA3AF';
const WHITE  = '#F9FAFB';

// ─── Types ────────────────────────────────────────────────────────────────────
type Tab = 'overview' | 'billing' | 'invoices' | 'payment' | 'plans';

interface SubscriptionData {
  id: string;
  plan_name: string;
  status: string;
  starts_at: string | null;
  ends_at: string | null;
  total_amount: number;
  currency: string;
  plan_id: string;
}

interface AgencyProfile {
  company_name: string;
  profile_number: string | null;
}

interface UsageData {
  casting_calls_used: number;
  casting_calls_total: number;
  applicants_used: number;
  applicants_total: number;
  auditions_used: number;
  auditions_total: number;
  team_members_used: number;
  team_members_total: number;
  storage_used_gb: number;
  storage_total_gb: number;
}

interface Transaction {
  id: string;
  razorpay_order_id: string | null;
  plan_name: string;
  total_amount: number;
  currency: string;
  gateway_status: string | null;
  payment_method: string | null;
  created_at: string;
  discount_amount: number;
  coupon_code: string | null;
}

interface Plan {
  id: string;
  plan_key: string;
  plan_name: string;
  price: number;
  original_price: number | null;
  features: string[];
  is_featured: boolean;
  duration_months: number;
  application_limit: number;
}



// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmtCurrency(amount: number | null | undefined, currency = 'INR') {
  if (amount == null || isNaN(Number(amount))) return '—';
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency, minimumFractionDigits: 2 }).format(Number(amount));
}

function fmtDate(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function daysRemaining(endsAt: string | null) {
  if (!endsAt) return null;
  const diff = Math.ceil((new Date(endsAt).getTime() - Date.now()) / 86400000);
  return diff > 0 ? diff : 0;
}

function nextResetDate(endsAt: string | null) {
  if (!endsAt) return '—';
  const d = new Date(endsAt);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

function cycleLabel(months: number) {
  if (months === 1)  return 'Monthly';
  if (months === 3)  return 'Quarterly';
  if (months === 6)  return 'Half-Yearly';
  if (months === 12) return 'Annual';
  return `${months}-Month`;
}

// ─── Shared UI ────────────────────────────────────────────────────────────────
function UsageBar({ used, total }: { used: number; total: number }) {
  const pct = total > 0 ? Math.min((used / total) * 100, 100) : 0;
  const color = pct > 85 ? RED : pct > 60 ? ORANGE : GOLD;
  return (
    <div style={{ height: 5, background: BG4, borderRadius: 3, overflow: 'hidden', marginTop: 5 }}>
      <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 3 }} />
    </div>
  );
}

function Card({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: BG2, border: `1px solid ${BG4}`, borderRadius: 10, padding: '18px 20px', ...style }}>
      {children}
    </div>
  );
}

function SecHead({ children, noMargin }: { children: React.ReactNode; noMargin?: boolean }) {
  return (
    <div style={{ fontFamily: BEBAS, fontSize: 16, color: GOLD, letterSpacing: 1.5, marginBottom: noMargin ? 0 : 14 }}>
      {children}
    </div>
  );
}

function Skeleton({ w = '100%', h = 16 }: { w?: string | number; h?: number }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: 4,
      background: `linear-gradient(90deg, ${BG3} 25%, ${BG4} 50%, ${BG3} 75%)`,
      backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite',
    }} />
  );
}

// ─── Gold Star SVG ────────────────────────────────────────────────────────────
function GoldStar() {
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="26,4 32,20 49,20 36,30 41,47 26,37 11,47 16,30 3,20 20,20"
        fill="none" stroke={GOLD} strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
  );
}



// ─── Right Sidebar ────────────────────────────────────────────────────────────
function RightSidebar({
  onTabChange, usage, subscription, loadingUsage,
}: {
  onTabChange: (t: Tab) => void;
  usage: UsageData | null;
  subscription: SubscriptionData | null;
  loadingUsage: boolean;
}) {
  const usageItems = usage ? [
    { label: 'Casting Calls',       icon: '📋', used: usage.casting_calls_used,  total: usage.casting_calls_total,  unit: '' },
    { label: 'Applicants',          icon: '👤', used: usage.applicants_used,     total: usage.applicants_total,     unit: '' },
    { label: 'Auditions Scheduled', icon: '📅', used: usage.auditions_used,      total: usage.auditions_total,      unit: '' },
    { label: 'Team Members',        icon: '👥', used: usage.team_members_used,   total: usage.team_members_total,   unit: '' },
    { label: 'Cloud Storage',       icon: '☁️', used: usage.storage_used_gb,     total: usage.storage_total_gb,     unit: ' GB' },
  ] : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: 300, flexShrink: 0 }}>

      {/* Usage Summary */}
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <SecHead noMargin>USAGE SUMMARY</SecHead>
          <span style={{ fontSize: 14, color: GRAY, fontFamily: BARLOW }}>
            {subscription?.ends_at ? `Resets on ${nextResetDate(subscription.ends_at)}` : '—'}
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
          {loadingUsage
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i}>
                  <Skeleton h={14} />
                  <div style={{ marginTop: 5 }}><Skeleton h={5} /></div>
                </div>
              ))
            : usageItems.map(u => (
                <div key={u.label}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <span style={{ fontSize: 14 }}>{u.icon}</span>
                      <span style={{ fontSize: 14, color: LIGHT, fontFamily: BARLOW }}>{u.label}</span>
                    </div>
                    <span style={{ fontSize: 14, color: WHITE, fontFamily: BARLOW, fontWeight: 600 }}>
                      {u.used.toLocaleString()}{u.unit} / {u.total > 0 ? u.total.toLocaleString() + u.unit : '∞'}
                    </span>
                  </div>
                  <UsageBar used={u.used} total={u.total} />
                </div>
              ))
          }
        </div>
        <button
          onClick={() => onTabChange('billing')}
          style={{
            marginTop: 14, width: '100%', background: 'none', border: 'none',
            borderTop: `1px solid ${BG4}`, paddingTop: 12,
            color: GOLD, fontFamily: BARLOW, fontSize: 14, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}
        >View Usage Details <span style={{ fontSize: 15 }}>›</span></button>
      </Card>



      {/* Need Help */}
      <Card>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, color: GOLD, fontFamily: BARLOW, letterSpacing: 1.5, fontWeight: 700, marginBottom: 2 }}>NEED HELP?</div>
            <div style={{ fontSize: 14, color: GRAY, fontFamily: BARLOW, marginBottom: 14 }}>Our support team is here to help you.</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <a href="mailto:support@silverscreens.in"
                style={{ fontSize: 14, color: LIGHT, fontFamily: BARLOW, display: 'flex', alignItems: 'center', gap: 7, textDecoration: 'none' }}>
                <span>✉️</span> support@silverscreens.in
              </a>
              <a href="tel:+919941661499"
                style={{ fontSize: 14, color: LIGHT, fontFamily: BARLOW, display: 'flex', alignItems: 'center', gap: 7, textDecoration: 'none' }}>
                <span>📞</span> +91 99416 61499
              </a>
            </div>
          </div>
          <div style={{ fontSize: 32, opacity: 0.6, marginLeft: 10 }}>🎧</div>
        </div>
        <button
          onClick={() => window.location.href = '/agency/support'}
          style={{
            marginTop: 14, width: '100%', background: BG3, border: `1px solid ${BG4}`,
            borderRadius: 6, padding: '9px', color: WHITE, fontFamily: BARLOW,
            fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        ><span>🎧</span> Contact Support</button>
      </Card>
    </div>
  );
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────
function OverviewTab({
  onTabChange, subscription, usage, transactions, loading, loadingUsage,
}: {
  onTabChange: (t: Tab) => void;
  subscription: SubscriptionData | null;
  usage: UsageData | null;
  transactions: Transaction[];
  loading: boolean;
  loadingUsage: boolean;
}) {
  const [autoRenew, setAutoRenew] = useState(true);

  const days    = daysRemaining(subscription?.ends_at ?? null);
  const planKey = subscription?.plan_id ?? '';

  // Derive billing cycle label from plan_id / duration heuristic
  const billingCycleLabel = (() => {
    if (!planKey) return '—';
    if (planKey.includes('annual') || planKey.includes('yearly')) return 'Annual';
    if (planKey.includes('half'))    return 'Half-Yearly';
    if (planKey.includes('quarter')) return 'Quarterly';
    return 'Monthly';
  })();

  // Recent invoices = last 3 transactions (paid)
  const recentTx = transactions.slice(0, 3);

  const statusColor = (s: string | null) => {
    if (s === 'active') return GREEN;
    if (s === 'expired' || s === 'cancelled') return RED;
    return ORANGE;
  };

  return (
    <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
      {/* LEFT — main content */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Current Plan */}
        <Card>
          <SecHead>CURRENT PLAN</SecHead>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Skeleton h={28} w="60%" />
              <Skeleton h={14} w="80%" />
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <div style={{ flexShrink: 0, marginTop: 2 }}><GoldStar /></div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <span style={{ fontFamily: BEBAS, fontSize: 28, color: WHITE, letterSpacing: 0.5 }}>
                      {subscription?.plan_name ?? 'No Active Plan'}
                    </span>
                    <span style={{
                      background: `${statusColor(subscription?.status ?? null)}22`,
                      color: statusColor(subscription?.status ?? null),
                      fontSize: 14, fontFamily: BARLOW, padding: '3px 10px', borderRadius: 4, fontWeight: 700,
                      textTransform: 'capitalize',
                    }}>
                      {subscription?.status?.replace('_', ' ') ?? 'Inactive'}
                    </span>
                  </div>
                  <p style={{ color: LIGHT, fontSize: 14, fontFamily: BARLOW, margin: '0 0 12px' }}>
                    {subscription ? `${billingCycleLabel} subscription — renews ${fmtDate(subscription.ends_at)}` : 'Subscribe to a plan to get started.'}
                  </p>
                  <button
                    onClick={() => onTabChange('plans')}
                    style={{ background: 'none', border: 'none', color: GOLD, fontFamily: BARLOW, fontSize: 14, cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 4 }}
                  >View Plan Details <span>›</span></button>
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: 14, color: GRAY, fontFamily: BARLOW, marginBottom: 6 }}>Current Billing Cycle</div>
                <div style={{ fontFamily: BEBAS, fontSize: 19, color: WHITE, letterSpacing: 0.5 }}>
                  {fmtDate(subscription?.starts_at ?? null)} – {fmtDate(subscription?.ends_at ?? null)}
                </div>
                <div style={{ fontSize: 14, color: GRAY, fontFamily: BARLOW, marginTop: 4 }}>
                  {days !== null ? `${days} days remaining` : '—'}
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Next Payment */}
        <Card>
          <SecHead>NEXT PAYMENT</SecHead>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Skeleton h={38} w="40%" />
              <Skeleton h={14} w="60%" />
            </div>
          ) : !subscription ? (
            /* ── No active subscription — clean empty state ── */
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 0', gap: 14, textAlign: 'center' as const }}>
              <div style={{ fontSize: 40 }}>💳</div>
              <div style={{ fontFamily: BEBAS, fontSize: 22, color: WHITE, letterSpacing: 0.5 }}>
                No Active Subscription
              </div>
              <div style={{ fontSize: 14, color: GRAY, fontFamily: BARLOW, maxWidth: 340, lineHeight: 1.6 }}>
                You don't have an active plan yet. Choose a plan to unlock casting calls, talent search, and all agency features.
              </div>
              <button
                onClick={() => onTabChange('plans')}
                style={{
                  background: GOLD, color: BG, border: 'none', borderRadius: 6,
                  padding: '12px 32px', fontFamily: BEBAS, fontSize: 18, letterSpacing: 1,
                  cursor: 'pointer', marginTop: 4,
                }}
              >View Plans & Subscribe</button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              {/* Left col */}
              <div>
                <div style={{ fontSize: 14, color: GRAY, fontFamily: BARLOW, marginBottom: 4 }}>Amount</div>
                <div style={{ fontFamily: BEBAS, fontSize: 38, color: WHITE, letterSpacing: 1, lineHeight: 1 }}>
                  {fmtCurrency(subscription.total_amount, subscription.currency)}
                </div>
                <div style={{ fontSize: 14, color: GRAY, fontFamily: BARLOW, marginBottom: 16 }}>(Including applicable taxes)</div>
                <div style={{ fontSize: 14, color: GRAY, fontFamily: BARLOW, marginBottom: 18 }}>
                  Billing Date &nbsp;
                  <span style={{ color: WHITE, fontWeight: 600 }}>{fmtDate(subscription.ends_at)}</span>
                </div>
                <button
                  onClick={() => onTabChange('payment')}
                  style={{
                    background: GOLD, color: BG, border: 'none', borderRadius: 6,
                    padding: '12px 0', fontFamily: BEBAS, fontSize: 18, letterSpacing: 1,
                    cursor: 'pointer', width: '100%',
                  }}
                >Pay Now</button>
              </div>
              {/* Right col */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { label: 'Plan',              value: subscription.plan_name },
                  { label: 'Billing Cycle',     value: billingCycleLabel },
                  { label: 'Next Billing Date', value: fmtDate(subscription.ends_at) },
                ].map(row => (
                  <div key={row.label}>
                    <div style={{ fontSize: 14, color: GRAY, fontFamily: BARLOW }}>{row.label}</div>
                    <div style={{ fontSize: 14, color: WHITE, fontFamily: BARLOW, fontWeight: 600 }}>{row.value}</div>
                  </div>
                ))}
                <div style={{
                  marginTop: 4, padding: '10px 12px', background: BG3,
                  border: `1px solid ${BG4}`, borderRadius: 6,
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <span style={{ fontSize: 14, flexShrink: 0 }}>ℹ️</span>
                  <span style={{ fontSize: 14, color: LIGHT, fontFamily: BARLOW, flex: 1, lineHeight: 1.3 }}>
                    Auto-renewal is {autoRenew ? 'enabled' : 'disabled'} for this subscription.
                  </span>
                  <button
                    onClick={() => setAutoRenew(!autoRenew)}
                    style={{ background: 'none', border: 'none', color: GOLD, fontSize: 14, fontFamily: BARLOW, cursor: 'pointer', padding: 0, whiteSpace: 'nowrap' }}
                  >Manage Auto-renewal</button>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Recent Invoices */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <SecHead noMargin>RECENT INVOICES</SecHead>
            <button
              onClick={() => onTabChange('invoices')}
              style={{ background: 'none', border: 'none', color: GOLD, fontFamily: BARLOW, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
            >View All Invoices <span style={{ fontSize: 14 }}>›</span></button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${BG4}` }}>
                {['INVOICE ID', 'DATE', 'PLAN', 'AMOUNT', 'STATUS', 'DOWNLOAD'].map(h => (
                  <th key={h} style={{
                    padding: '7px 10px', textAlign: h === 'DOWNLOAD' ? 'center' : 'left',
                    fontSize: 14, color: GRAY, fontFamily: BARLOW, fontWeight: 700, letterSpacing: 0.5,
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i} style={{ borderBottom: `1px solid ${BG4}` }}>
                      {Array.from({ length: 6 }).map((_, j) => (
                        <td key={j} style={{ padding: '11px 10px' }}><Skeleton h={14} /></td>
                      ))}
                    </tr>
                  ))
                : recentTx.length === 0
                  ? (
                    <tr>
                      <td colSpan={6} style={{ padding: '20px 10px', textAlign: 'center', color: GRAY, fontFamily: BARLOW, fontSize: 14 }}>
                        No invoices found
                      </td>
                    </tr>
                  )
                  : recentTx.map(tx => (
                      <tr key={tx.id}
                        style={{ borderBottom: `1px solid ${BG4}`, cursor: 'pointer' }}
                        onMouseEnter={e => (e.currentTarget.style.background = BG3)}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        <td style={{ padding: '11px 10px', fontSize: 14, color: GOLD, fontFamily: BARLOW }}>
                          {tx.razorpay_order_id ?? tx.id.slice(0, 12).toUpperCase()}
                        </td>
                        <td style={{ padding: '11px 10px', fontSize: 14, color: LIGHT, fontFamily: BARLOW }}>{fmtDate(tx.created_at)}</td>
                        <td style={{ padding: '11px 10px', fontSize: 14, color: LIGHT, fontFamily: BARLOW }}>{tx.plan_name}</td>
                        <td style={{ padding: '11px 10px', fontSize: 14, color: WHITE, fontFamily: BARLOW, fontWeight: 600 }}>
                          {fmtCurrency(tx.total_amount, tx.currency)}
                        </td>
                        <td style={{ padding: '11px 10px' }}>
                          <span style={{
                            background: (tx.gateway_status === 'captured' || tx.gateway_status === 'success') ? `${GREEN}20` : `${ORANGE}20`,
                            color: (tx.gateway_status === 'captured' || tx.gateway_status === 'success') ? GREEN : ORANGE,
                            fontSize: 14, fontFamily: BARLOW, padding: '3px 10px', borderRadius: 4, fontWeight: 600, textTransform: 'capitalize',
                          }}>{(tx.gateway_status === 'captured' || tx.gateway_status === 'success') ? 'Paid' : tx.gateway_status ?? 'Pending'}</span>
                        </td>
                        <td style={{ padding: '11px 10px', textAlign: 'center' }}>
                          <button onClick={() => {
                            const inv = `SILVERSCREENS INVOICE\n${'='.repeat(40)}\nInvoice ID: ${tx.razorpay_order_id ?? tx.id}\nDate: ${new Date(tx.created_at).toLocaleDateString('en-IN')}\nPlan: ${tx.plan_name}\nAmount: ${tx.total_amount} ${tx.currency}\nStatus: ${tx.gateway_status ?? 'Pending'}\n${'='.repeat(40)}\nThank you for your subscription.`;
                            const blob = new Blob([inv], { type: 'text/plain' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url; a.download = `invoice-${(tx.razorpay_order_id ?? tx.id).slice(0,12)}.txt`;
                            a.click(); URL.revokeObjectURL(url);
                          }} style={{ background: 'none', border: `1px solid ${BG4}`, borderRadius: 4, padding: '4px 9px', color: LIGHT, cursor: 'pointer', fontSize: 14 }}>⬇</button>
                        </td>
                      </tr>
                    ))
              }
            </tbody>
          </table>
          <div style={{ marginTop: 10, fontSize: 14, color: GRAY, fontFamily: BARLOW }}>All amounts are inclusive of applicable taxes.</div>
        </Card>
      </div>

      {/* RIGHT sidebar */}
      <RightSidebar onTabChange={onTabChange} usage={usage} subscription={subscription} loadingUsage={loadingUsage} />
    </div>
  );
}

// ─── Billing History Tab ──────────────────────────────────────────────────────
function BillingHistoryTab({ transactions, loading }: { transactions: Transaction[]; loading: boolean }) {
  const [filter, setFilter] = useState('All');
  const filters = ['All', 'Charges', 'Credits'];

  const filtered = transactions.filter(tx => {
    if (filter === 'Credits') return (tx.discount_amount ?? 0) > 0;
    if (filter === 'Charges') return (tx.discount_amount ?? 0) <= 0;
    return true;
  });

  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <SecHead noMargin>BILLING HISTORY</SecHead>
        <div style={{ display: 'flex', gap: 6 }}>
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              background: filter === f ? GOLD : BG3,
              border: `1px solid ${filter === f ? GOLD : BG4}`,
              borderRadius: 5, padding: '5px 14px',
              color: filter === f ? BG : LIGHT,
              fontFamily: BARLOW, fontSize: 14, cursor: 'pointer', fontWeight: 600,
            }}>{f}</button>
          ))}
        </div>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: `1px solid ${BG4}` }}>
            {['DATE', 'DESCRIPTION', 'AMOUNT', 'TYPE'].map(h => (
              <th key={h} style={{
                padding: '8px 12px', textAlign: h === 'AMOUNT' ? 'right' : 'left',
                fontSize: 14, color: GRAY, fontFamily: BARLOW, fontWeight: 700, letterSpacing: 0.5,
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${BG4}` }}>
                  {Array.from({ length: 4 }).map((_, j) => (
                    <td key={j} style={{ padding: '12px 12px' }}><Skeleton h={14} /></td>
                  ))}
                </tr>
              ))
            : filtered.length === 0
              ? (
                <tr>
                  <td colSpan={4} style={{ padding: '20px 12px', textAlign: 'center', color: GRAY, fontFamily: BARLOW, fontSize: 14 }}>
                    No billing history found
                  </td>
                </tr>
              )
              : filtered.map((tx) => {
                  const isCredit = (tx.discount_amount ?? 0) > 0;
                  const desc = isCredit
                    ? `Promo discount applied${tx.coupon_code ? ` – ${tx.coupon_code}` : ''}`
                    : `Subscription – ${tx.plan_name}`;
                  const amt = isCredit
                    ? `-${fmtCurrency(tx.discount_amount ?? 0, tx.currency)}`
                    : fmtCurrency(tx.total_amount, tx.currency);

                  return (
                    <tr key={tx.id}
                      style={{ borderBottom: `1px solid ${BG4}` }}
                      onMouseEnter={e => (e.currentTarget.style.background = BG3)}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '12px 12px', fontSize: 14, color: GRAY, fontFamily: BARLOW, whiteSpace: 'nowrap' }}>{fmtDate(tx.created_at)}</td>
                      <td style={{ padding: '12px 12px', fontSize: 14, color: WHITE, fontFamily: BARLOW }}>{desc}</td>
                      <td style={{ padding: '12px 12px', fontSize: 14, color: isCredit ? GREEN : WHITE, fontFamily: BARLOW, fontWeight: 600, textAlign: 'right', whiteSpace: 'nowrap' }}>{amt}</td>
                      <td style={{ padding: '12px 12px' }}>
                        <span style={{
                          background: isCredit ? `${GREEN}20` : `${BLUE}20`,
                          color: isCredit ? GREEN : BLUE,
                          fontSize: 14, fontFamily: BARLOW, padding: '3px 10px', borderRadius: 4, fontWeight: 600,
                        }}>{isCredit ? 'Credit' : 'Charge'}</span>
                      </td>
                    </tr>
                  );
                })
          }
        </tbody>
      </table>
    </Card>
  );
}

// ─── Invoices Tab ─────────────────────────────────────────────────────────────
function InvoicesTab({ transactions, loading }: { transactions: Transaction[]; loading: boolean }) {
  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <SecHead noMargin>ALL INVOICES</SecHead>
        <button onClick={() => {
          const headers = 'Invoice ID,Date,Plan,Amount,Currency,Status';
          const rows = transactions.map(tx => [
            tx.razorpay_order_id ?? tx.id,
            new Date(tx.created_at).toLocaleDateString('en-IN'),
            tx.plan_name,
            tx.total_amount,
            tx.currency,
            tx.gateway_status ?? 'Pending',
          ].join(',')).join('\n');
          const csv = headers + '\n' + rows;
          const blob = new Blob([csv], { type: 'text/csv' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url; a.download = `silverscreens-invoices-${new Date().toISOString().slice(0,10)}.csv`;
          a.click(); URL.revokeObjectURL(url);
        }} style={{
          background: BG3, border: `1px solid ${GOLD}`, borderRadius: 5,
          padding: '6px 14px', color: GOLD, fontFamily: BARLOW, fontSize: 14,
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600,
        }}>⬇ Download All</button>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: `1px solid ${BG4}` }}>
            {['INVOICE ID', 'DATE', 'PLAN', 'AMOUNT', 'STATUS', 'DOWNLOAD'].map(h => (
              <th key={h} style={{
                padding: '8px 12px', textAlign: h === 'DOWNLOAD' ? 'center' : 'left',
                fontSize: 14, color: GRAY, fontFamily: BARLOW, fontWeight: 700, letterSpacing: 0.5,
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${BG4}` }}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <td key={j} style={{ padding: '12px 12px' }}><Skeleton h={14} /></td>
                  ))}
                </tr>
              ))
            : transactions.length === 0
              ? (
                <tr>
                  <td colSpan={6} style={{ padding: '20px 12px', textAlign: 'center', color: GRAY, fontFamily: BARLOW, fontSize: 14 }}>
                    No invoices found
                  </td>
                </tr>
              )
              : transactions.map(tx => (
                  <tr key={tx.id}
                    style={{ borderBottom: `1px solid ${BG4}`, cursor: 'pointer' }}
                    onMouseEnter={e => (e.currentTarget.style.background = BG3)}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '12px 12px', fontSize: 14, color: GOLD, fontFamily: BARLOW }}>
                      {tx.razorpay_order_id ?? tx.id.slice(0, 12).toUpperCase()}
                    </td>
                    <td style={{ padding: '12px 12px', fontSize: 14, color: LIGHT, fontFamily: BARLOW }}>{fmtDate(tx.created_at)}</td>
                    <td style={{ padding: '12px 12px', fontSize: 14, color: LIGHT, fontFamily: BARLOW }}>{tx.plan_name}</td>
                    <td style={{ padding: '12px 12px', fontSize: 14, color: WHITE, fontFamily: BARLOW, fontWeight: 600 }}>
                      {fmtCurrency(tx.total_amount, tx.currency)}
                    </td>
                    <td style={{ padding: '12px 12px' }}>
                      <span style={{
                        background: (tx.gateway_status === 'captured' || tx.gateway_status === 'success') ? `${GREEN}20` : `${ORANGE}20`,
                        color: (tx.gateway_status === 'captured' || tx.gateway_status === 'success') ? GREEN : ORANGE,
                        fontSize: 14, fontFamily: BARLOW, padding: '3px 10px', borderRadius: 4, fontWeight: 600, textTransform: 'capitalize',
                      }}>{(tx.gateway_status === 'captured' || tx.gateway_status === 'success') ? 'Paid' : tx.gateway_status ?? 'Pending'}</span>
                    </td>
                    <td style={{ padding: '12px 12px', textAlign: 'center' }}>
                      <button onClick={() => {
                        const inv = `SILVERSCREENS INVOICE\n${'='.repeat(40)}\nInvoice ID: ${tx.razorpay_order_id ?? tx.id}\nDate: ${new Date(tx.created_at).toLocaleDateString('en-IN')}\nPlan: ${tx.plan_name}\nAmount: ${tx.total_amount} ${tx.currency}\nStatus: ${tx.gateway_status ?? 'Pending'}\n${'='.repeat(40)}\nThank you for your subscription.`;
                        const blob = new Blob([inv], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url; a.download = `invoice-${(tx.razorpay_order_id ?? tx.id).slice(0,12)}.txt`;
                        a.click(); URL.revokeObjectURL(url);
                      }} style={{ background: 'none', border: `1px solid ${BG4}`, borderRadius: 4, padding: '5px 10px', color: LIGHT, cursor: 'pointer', fontSize: 14 }}>⬇</button>
                    </td>
                  </tr>
                ))
          }
        </tbody>
      </table>
      <div style={{ marginTop: 12, fontSize: 14, color: GRAY, fontFamily: BARLOW }}>All amounts are inclusive of applicable taxes.</div>
    </Card>
  );
}

// ─── Payment Methods Tab ──────────────────────────────────────────────────────
function PaymentMethodsTab({ transactions, loading }: { transactions: Transaction[]; loading: boolean }) {
  const [showAdd, setShowAdd] = useState(false);
  const [newCard, setNewCard] = useState({ number: '', expiry: '', cvv: '', holder: '' });
  const [focused, setFocused] = useState<string | null>(null);

  // Last used payment method from most recent successful transaction
  const lastTx     = transactions.find(tx => tx.gateway_status === 'captured' || tx.gateway_status === 'success' || tx.gateway_status === 'paid');
  const lastMethod = lastTx?.payment_method ?? null;

  // Format card number with spaces every 4 digits
  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  // Format expiry MM/YY
  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2);
    return digits;
  };

  // Display masked card number on the visual card
  const displayNumber = newCard.number
    ? newCard.number.replace(/\d(?=.{4})/g, '•')
    : '•••• •••• •••• ••••';

  const inputStyle = (key: string): React.CSSProperties => ({
    width: '100%', background: focused === key ? BG2 : BG3,
    border: `1px solid ${focused === key ? GOLD : BG4}`,
    borderRadius: 6, padding: '10px 12px', color: WHITE,
    fontFamily: BARLOW, fontSize: 15, outline: 'none',
    boxSizing: 'border-box', transition: 'border-color 0.15s',
    letterSpacing: key === 'number' ? 2 : 0,
  });

  return (
    <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>

      {/* LEFT — saved method or empty state */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <SecHead noMargin>PAYMENT METHODS</SecHead>
            <button onClick={() => setShowAdd(!showAdd)} style={{
              background: showAdd ? BG3 : RED, border: `1px solid ${showAdd ? BG4 : RED}`,
              borderRadius: 6, padding: '7px 16px', color: WHITE,
              fontFamily: BARLOW, fontSize: 14, cursor: 'pointer', fontWeight: 600,
            }}>{showAdd ? '✕ Cancel' : '+ Add New Card'}</button>
          </div>

          {loading ? (
            <Skeleton h={100} />
          ) : lastMethod ? (
            /* ── Saved method pill ── */
            <div style={{
              background: 'linear-gradient(135deg, #1a1410 0%, #0f1218 100%)',
              border: `1px solid ${GOLD}40`, borderRadius: 10, padding: '16px 20px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 8,
                  background: `linear-gradient(135deg, ${GOLD}30, ${GOLD}10)`,
                  border: `1px solid ${GOLD}40`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20,
                }}>💳</div>
                <div>
                  <div style={{ fontSize: 15, color: WHITE, fontFamily: BARLOW, fontWeight: 600, marginBottom: 2 }}>
                    {lastMethod.charAt(0).toUpperCase() + lastMethod.slice(1)}
                  </div>
                  <div style={{ fontSize: 13, color: GRAY, fontFamily: BARLOW }}>
                    Last used · {fmtDate(lastTx?.created_at ?? null)}
                  </div>
                </div>
              </div>
              <span style={{
                background: `${GOLD}18`, color: GOLD,
                fontSize: 13, fontFamily: BARLOW, padding: '3px 10px',
                borderRadius: 4, fontWeight: 700,
              }}>DEFAULT</span>
            </div>
          ) : (
            /* ── Empty state ── */
            <div style={{
              padding: '32px 0', textAlign: 'center' as const,
              display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 10,
            }}>
              <div style={{ fontSize: 36, opacity: 0.4 }}>💳</div>
              <div style={{ fontSize: 15, color: GRAY, fontFamily: BARLOW }}>
                No payment method saved.
              </div>
              <div style={{ fontSize: 14, color: `${GRAY}99`, fontFamily: BARLOW }}>
                Payments are processed securely via Razorpay.
              </div>
            </div>
          )}
        </Card>

        {/* ── Add New Card form ── */}
        {showAdd && (
          <Card style={{ marginTop: 16 }}>
            <SecHead>ADD NEW CARD</SecHead>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 14 }}>
              {/* Card Number */}
              <div>
                <label style={{ display: 'block', fontSize: 13, color: GRAY, fontFamily: BARLOW, marginBottom: 5, letterSpacing: 0.5 }}>CARD NUMBER</label>
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="cc-number"
                  placeholder="1234 5678 9012 3456"
                  value={newCard.number}
                  maxLength={19}
                  onFocus={() => setFocused('number')}
                  onBlur={() => setFocused(null)}
                  onChange={e => setNewCard(c => ({ ...c, number: formatCardNumber(e.target.value) }))}
                  style={inputStyle('number')}
                />
              </div>
              {/* Card Holder */}
              <div>
                <label style={{ display: 'block', fontSize: 13, color: GRAY, fontFamily: BARLOW, marginBottom: 5, letterSpacing: 0.5 }}>CARDHOLDER NAME</label>
                <input
                  type="text"
                  autoComplete="cc-name"
                  placeholder="Name on card"
                  value={newCard.holder}
                  onFocus={() => setFocused('holder')}
                  onBlur={() => setFocused(null)}
                  onChange={e => setNewCard(c => ({ ...c, holder: e.target.value }))}
                  style={inputStyle('holder')}
                />
              </div>
              {/* Expiry + CVV side by side */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, color: GRAY, fontFamily: BARLOW, marginBottom: 5, letterSpacing: 0.5 }}>EXPIRY DATE</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    placeholder="MM / YY"
                    value={newCard.expiry}
                    maxLength={5}
                    onFocus={() => setFocused('expiry')}
                    onBlur={() => setFocused(null)}
                    onChange={e => setNewCard(c => ({ ...c, expiry: formatExpiry(e.target.value) }))}
                    style={inputStyle('expiry')}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, color: GRAY, fontFamily: BARLOW, marginBottom: 5, letterSpacing: 0.5 }}>CVV</label>
                  <input
                    type="password"
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    placeholder="•••"
                    value={newCard.cvv}
                    maxLength={4}
                    onFocus={() => setFocused('cvv')}
                    onBlur={() => setFocused(null)}
                    onChange={e => setNewCard(c => ({ ...c, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                    style={inputStyle('cvv')}
                  />
                </div>
              </div>
            </div>
            {/* Security note */}
            <div style={{
              marginTop: 14, padding: '10px 12px', background: BG3,
              border: `1px solid ${BG4}`, borderRadius: 6,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span style={{ fontSize: 14, flexShrink: 0 }}>🔒</span>
              <span style={{ fontSize: 13, color: GRAY, fontFamily: BARLOW }}>
                Your card details are encrypted and processed securely via Razorpay. We never store your CVV.
              </span>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
              <button onClick={() => { setShowAdd(false); setNewCard({ number: '', expiry: '', cvv: '', holder: '' }); }} style={{
                flex: 1, background: BG3, border: `1px solid ${BG4}`, borderRadius: 6,
                padding: '11px', color: LIGHT, fontFamily: BARLOW, fontSize: 14, cursor: 'pointer',
              }}>Cancel</button>
              <button onClick={() => alert('Card management is handled securely via Razorpay during checkout. Your card will be saved automatically when you make a payment.')} style={{
                flex: 2, background: GOLD, border: 'none', borderRadius: 6,
                padding: '11px', color: BG, fontFamily: BEBAS, fontSize: 18,
                cursor: 'pointer', letterSpacing: 0.5,
              }}>Save Card</button>
            </div>
          </Card>
        )}
      </div>

      {/* RIGHT — visual credit card preview */}
      <div style={{ width: 300, flexShrink: 0 }}>
        <div style={{ fontSize: 13, color: GRAY, fontFamily: BARLOW, marginBottom: 10, letterSpacing: 0.5 }}>CARD PREVIEW</div>
        {/* Card face */}
        <div style={{
          width: 300, height: 180, borderRadius: 14,
          background: 'linear-gradient(135deg, #1C1008 0%, #2A1E0E 40%, #0B0F14 100%)',
          border: `1px solid ${GOLD}40`,
          boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px ${GOLD}20`,
          padding: '20px 22px', display: 'flex', flexDirection: 'column' as const,
          justifyContent: 'space-between', position: 'relative' as const, overflow: 'hidden',
        }}>
          {/* BG glow */}
          <div style={{
            position: 'absolute' as const, top: -40, right: -40,
            width: 160, height: 160, borderRadius: '50%',
            background: `radial-gradient(circle, ${GOLD}18, transparent 70%)`,
            pointerEvents: 'none' as const,
          }} />
          {/* Top row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontFamily: BEBAS, fontSize: 16, color: GOLD, letterSpacing: 2 }}>SILVER SCREENS</div>
            <div style={{ fontSize: 20 }}>💳</div>
          </div>
          {/* Chip */}
          <div style={{
            width: 36, height: 28, borderRadius: 5,
            background: 'linear-gradient(135deg, #D4A64A, #8A6A2F)',
            border: `1px solid ${GOLD}60`,
          }} />
          {/* Card number */}
          <div style={{
            fontFamily: "'Courier New', monospace", fontSize: 17,
            color: WHITE, letterSpacing: 3, marginTop: 2,
          }}>{displayNumber}</div>
          {/* Bottom row */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 9, color: `${GOLD}80`, fontFamily: BARLOW, letterSpacing: 1, marginBottom: 2 }}>CARD HOLDER</div>
              <div style={{ fontSize: 13, color: WHITE, fontFamily: BARLOW, fontWeight: 600, letterSpacing: 1 }}>
                {newCard.holder || 'YOUR NAME'}
              </div>
            </div>
            <div style={{ textAlign: 'right' as const }}>
              <div style={{ fontSize: 9, color: `${GOLD}80`, fontFamily: BARLOW, letterSpacing: 1, marginBottom: 2 }}>EXPIRES</div>
              <div style={{ fontSize: 13, color: WHITE, fontFamily: BARLOW, fontWeight: 600 }}>
                {newCard.expiry || 'MM/YY'}
              </div>
            </div>
          </div>
        </div>
        {/* Note below card */}
        <div style={{ marginTop: 12, fontSize: 13, color: GRAY, fontFamily: BARLOW, lineHeight: 1.5 }}>
          Payments are processed securely via <span style={{ color: GOLD }}>Razorpay</span>. Card details are never stored on our servers.
        </div>
      </div>

    </div>
  );
}

// ─── Plans & Add-ons Tab ──────────────────────────────────────────────────────
function PlansAddonsTab({
  plans, subscription, loading,
}: {
  plans: Plan[];
  subscription: SubscriptionData | null;
  loading: boolean;
}) {
  // Agency has 3 plans each with a different duration (3mo / 6mo / 12mo)
  // No Monthly/Annual toggle needed — all 3 plans always shown
  // Sorted by duration: Starter → Growth → Enterprise
  const sortedPlans = [...plans].sort((a, b) => a.duration_months - b.duration_months);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Plans */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ fontFamily: BEBAS, fontSize: 20, color: GOLD, letterSpacing: 1 }}>SUBSCRIPTION PLANS</div>
          <div style={{ fontSize: 14, color: GRAY, fontFamily: BARLOW }}>
            All plans include GST · Prices in INR
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} style={{ background: BG2, border: `2px solid ${BG4}`, borderRadius: 10, padding: 20 }}>
                <Skeleton h={22} w="70%" />
                <div style={{ marginTop: 10 }}><Skeleton h={38} w="50%" /></div>
                <div style={{ marginTop: 10 }}><Skeleton h={14} w="90%" /></div>
                <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {Array.from({ length: 5 }).map((_, j) => <Skeleton key={j} h={14} />)}
                </div>
              </div>
            ))}
          </div>
        ) : sortedPlans.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center' as const, color: GRAY, fontFamily: BARLOW, fontSize: 14 }}>
            No plans available. Please contact support.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(sortedPlans.length, 3)}, 1fr)`, gap: 16 }}>
            {sortedPlans.map(plan => {
              const isCurrent  = subscription?.plan_id === plan.plan_key;
              const isFeatured = plan.is_featured;
              const price      = fmtCurrency(Number(plan.price), 'INR');
              const durLabel   = cycleLabel(plan.duration_months);
              const pricePerMonth = Number(plan.price) / plan.duration_months;

              return (
                <div key={plan.id} style={{
                  background: isCurrent ? BG3 : BG2,
                  border: `2px solid ${isCurrent ? GOLD : isFeatured ? PURPLE : BG4}`,
                  borderRadius: 10, padding: 20, position: 'relative' as const,
                  display: 'flex', flexDirection: 'column' as const,
                }}>
                  {/* Badge */}
                  {isCurrent && (
                    <div style={{
                      position: 'absolute' as const, top: -1, right: 20,
                      background: GOLD, color: BG, fontFamily: BARLOW, fontSize: 14,
                      fontWeight: 700, padding: '3px 10px', borderRadius: '0 0 6px 6px',
                    }}>CURRENT PLAN</div>
                  )}
                  {isFeatured && !isCurrent && (
                    <div style={{
                      position: 'absolute' as const, top: -1, right: 20,
                      background: PURPLE, color: WHITE, fontFamily: BARLOW, fontSize: 14,
                      fontWeight: 700, padding: '3px 10px', borderRadius: '0 0 6px 6px',
                    }}>RECOMMENDED</div>
                  )}

                  {/* Plan name + duration pill */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ fontFamily: BEBAS, fontSize: 22, color: isCurrent ? GOLD : WHITE, letterSpacing: 0.5 }}>
                      {plan.plan_name}
                    </div>
                    <div style={{
                      background: BG4, color: LIGHT, fontFamily: BARLOW,
                      fontSize: 13, fontWeight: 600, padding: '2px 8px', borderRadius: 4,
                    }}>{durLabel}</div>
                  </div>

                  {/* Price */}
                  <div style={{ marginBottom: 4 }}>
                    <span style={{ fontFamily: BEBAS, fontSize: 34, color: isCurrent ? GOLD : WHITE, letterSpacing: 0.5 }}>
                      {price}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, color: GRAY, fontFamily: BARLOW, marginBottom: 14 }}>
                    for {plan.duration_months} {plan.duration_months === 1 ? 'month' : 'months'}
                    {plan.duration_months > 1 && (
                      <> · ≈ {fmtCurrency(pricePerMonth, 'INR')}/mo</>
                    )}
                  </div>

                  {/* Application limit if set */}
                  {plan.application_limit > 0 && (
                    <div style={{ fontSize: 13, color: GRAY, fontFamily: BARLOW, marginBottom: 10 }}>
                      Up to {plan.application_limit.toLocaleString()} applications/month
                    </div>
                  )}

                  {/* Features */}
                  <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 7, marginBottom: 16, flex: 1 }}>
                    {plan.features.map((f: string) => (
                      <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <span style={{ color: isCurrent ? GOLD : GREEN, fontSize: 14, flexShrink: 0 }}>✓</span>
                        <span style={{ fontSize: 14, color: LIGHT, fontFamily: BARLOW }}>{f}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <button
                    disabled={isCurrent}
                    onClick={() => { if (!isCurrent) window.location.href = `/payment?plan=${plan.plan_key}`; }}
                    style={{
                      width: '100%', padding: '10px', borderRadius: 6,
                      fontFamily: BARLOW, fontSize: 14, fontWeight: 600,
                      cursor: isCurrent ? 'default' : 'pointer',
                      background: isCurrent ? `${GOLD}18` : isFeatured ? GOLD : BG3,
                      border: `1px solid ${isCurrent ? GOLD : isFeatured ? GOLD : BG4}`,
                      color: isCurrent ? GOLD : isFeatured ? BG : WHITE,
                      opacity: isCurrent ? 0.85 : 1,
                    }}
                  >
                    {isCurrent
                      ? '✓ Current Plan'
                      : subscription
                        ? `Switch to ${plan.plan_name}`
                        : `Choose ${plan.plan_name}`}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}


// ─── Nav config ───────────────────────────────────────────────────────────────
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

const PROFILE_MENU = [
  { label: 'Reports & Analytics',   href: '/agency/reports' },
  { label: 'Subscription & Billing', href: '/agency/subscription' },
  { label: 'Company Profile',        href: '/agency-profile' },
  { label: 'Documents',              href: '/agency/documents' },
  { label: 'Calendar',               href: '/agency/calendar' },
  { label: 'Settings',               href: '/agency/settings' },
  { label: 'Support',                href: '/agency/support' },
  { label: 'Logout',                 href: '/login' },
];

// ─── Inner Page ───────────────────────────────────────────────────────────────
function SubscriptionBillingInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [sidebarOpen,  setSidebarOpen]  = useState(false);
  const [msgCount,     setMsgCount]     = useState(0);
  const [notifCount,   setNotifCount]   = useState(0);

  const validTabs: Tab[] = ['overview', 'billing', 'invoices', 'payment', 'plans'];
  const tabParam    = searchParams.get('tab') as Tab | null;
  const initialTab: Tab = (tabParam && validTabs.includes(tabParam)) ? tabParam : 'overview';
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);

  // ── Data state ──
  const [subscription,  setSubscription]  = useState<SubscriptionData | null>(null);
  const [agency,        setAgency]        = useState<AgencyProfile | null>(null);
  const [usage,         setUsage]         = useState<UsageData | null>(null);
  const [transactions,  setTransactions]  = useState<Transaction[]>([]);
  const [plans,         setPlans]         = useState<Plan[]>([]);

  const [loading,       setLoading]       = useState(true);
  const [loadingUsage,  setLoadingUsage]  = useState(true);
  const [loadingPlans,  setLoadingPlans]  = useState(true);

  // ── Fetch helpers ──
  const fetchMain = useCallback(async () => {
    try {
      setLoading(true);

      // Get auth token from localStorage (same pattern used across all agency pages)
      const token = JSON.parse(localStorage.getItem('ss_user') || '{}')?.token ?? '';
      const headers = { 'Authorization': `Bearer ${token}` };

      const [subRes, agencyRes, txRes] = await Promise.all([
        // ✅ New route we built: app/api/agency/subscription/route.ts
        fetch('/api/agency/subscription', { headers }),
        // ✅ Correct path: app/api/profile/agency/route.ts
        fetch('/api/profile/agency', { headers }),
        // ✅ New route we built: app/api/agency/transactions/route.ts
        fetch('/api/agency/transactions', { headers }),
      ]);

      if (subRes.ok) {
        const d = await subRes.json();
        // Response shape: { data: { data: subscription | null } }
        setSubscription(d.data?.data ?? d.data ?? null);
      }

      if (agencyRes.ok) {
        const d = await agencyRes.json();
        const profile = d.data?.profile ?? null;
        if (profile) {
          setAgency({
            company_name:   profile.company_name ?? profile.profiles?.name ?? '',
            profile_number: profile.profile_number ?? profile.profiles?.profile_number ?? null,
          });
        }
      }

      if (txRes.ok) {
        const d = await txRes.json();
        // Response shape: { data: { data: Transaction[] } }
        const txRaw = d.data?.data ?? d.data;
        setTransactions(Array.isArray(txRaw) ? txRaw : []);
      }
    } catch (e) {
      console.error('Subscription page fetch error:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUsage = useCallback(async () => {
    try {
      setLoadingUsage(true);
      // Usage is derived from agency/reports/stats which already exists:
      // app/api/agency/reports/stats/route.ts
      const token = JSON.parse(localStorage.getItem('ss_user') || '{}')?.token ?? '';
      const res = await fetch('/api/agency/reports/stats', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        const d = await res.json();
        // Map the stats response shape to our UsageData type
        // Response shape: { data: { casting_calls, applicants, auditions } }
        const stats = d.data ?? {};
        setUsage({
          casting_calls_used:  stats.casting_calls?.active  ?? 0,
          casting_calls_total: Math.max(stats.casting_calls?.total ?? 0, 10),
          applicants_used:     stats.applicants?.total      ?? 0,
          applicants_total:    Math.max(stats.applicants?.total ?? 0, 100),
          auditions_used:      stats.auditions?.total       ?? 0,
          auditions_total:     Math.max(stats.auditions?.total ?? 0, 50),
          team_members_used:   1,
          team_members_total:  5,
          storage_used_gb:     0,
          storage_total_gb:    10,
        });
      }
    } catch (e) {
      console.error('Usage fetch error:', e);
    } finally {
      setLoadingUsage(false);
    }
  }, []);

  const fetchPlans = useCallback(async () => {
    try {
      setLoadingPlans(true);
      // ✅ Correct path: app/api/plans/route.ts  param: ?type=agency
      const res = await fetch('/api/plans?type=agency');
      if (res.ok) {
        const d = await res.json();
        // Response shape: { data: { agency_plans: Plan[], aspirant_plans: Plan[], all_plans: Plan[] } }
        const plansRaw = d.data?.agency_plans;
        setPlans(Array.isArray(plansRaw) ? plansRaw : []);
      }
    } catch (e) {
      console.error('Plans fetch error:', e);
    } finally {
      setLoadingPlans(false);
    }
  }, []);

  useEffect(() => {
    fetchMain();
    fetchUsage();
    fetchPlans();
  }, [fetchMain, fetchUsage, fetchPlans]);

  const SB_W = sidebarOpen ? 230 : 52;

  // Poll notification + message counts every 30s
  useEffect(() => {
    function fetchCounts() {
      const u = JSON.parse(localStorage.getItem('ss_user') || '{}');
      const h = u.token ? { Authorization: `Bearer ${u.token}` } : {};
      fetch('/api/notifications', { headers: h })
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          if (!data) return;
          const count = data.data?.unread_count ?? data.unread_count;
          if (count != null) { setNotifCount(count); return; }
          const list = data.data?.notifications ?? data.notifications ?? [];
          if (Array.isArray(list)) setNotifCount(list.filter((n: any) => !n.is_read).length);
        }).catch(() => {});
      fetch('/api/messages/conversations', { headers: h })
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          if (!data) return;
          const list = data.data?.conversations ?? data.conversations ?? [];
          if (Array.isArray(list)) setMsgCount(list.filter((c: any) => c.unreadCount > 0).length);
        }).catch(() => {});
    }
    fetchCounts();
    const interval = setInterval(fetchCounts, 30000);
    return () => clearInterval(interval);
  }, []);

  const TABS: { key: Tab; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'billing',  label: 'Billing History' },
    { key: 'invoices', label: 'Invoices' },
    { key: 'payment',  label: 'Payment Methods' },
    { key: 'plans',    label: 'Plans' },
  ];

  const agencyName     = agency?.company_name ?? 'Your Agency';
  const agencyInitials = initials(agencyName);

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: BG, fontFamily: BARLOW, color: '#F5F5F5' }}>

        {/* ══ TOPNAV ══ */}
        <AgencyTopnav />

        {/* ══ BODY ══ */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

          {/* ── COLLAPSIBLE SIDEBAR ── */}
          <aside style={{ width: SB_W, flexShrink: 0, background: BG2, borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', overflowY: 'auto', overflowX: 'hidden', scrollbarWidth: 'none', transition: 'width 0.2s ease' }}>
            <div style={{ height: 52, display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'flex-end' : 'center', padding: sidebarOpen ? '0 12px' : 0, borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
              <button onClick={() => setSidebarOpen(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', width: 30, height: 30, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'none')}
              >{sidebarOpen ? <ChevronLeft size={16} /> : <Menu size={16} />}</button>
            </div>

            {sidebarOpen && (
              <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: 9, background: 'linear-gradient(135deg,#1a1410,#2a1e0e)', border: `1px solid ${GOLD}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: GOLD, fontFamily: BEBAS, flexShrink: 0 }}>
                  {agencyInitials}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#F5F5F5', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {agencyName}
                  </div>
                  <div onClick={() => router.push('/agency-profile')} style={{ fontSize: 14, color: RED, fontWeight: 600, cursor: 'pointer' }}>View Company Profile</div>
                </div>
              </div>
            )}

            <nav style={{ flex: 1, padding: sidebarOpen ? '8px 6px' : '8px 4px', overflowY: 'auto', scrollbarWidth: 'none' }}>
              {NAV_ITEMS.map(({ icon: Icon, label, active, href }) => {
                const badge = label === 'Messages' ? (msgCount > 0 ? msgCount : undefined) : label === 'Notifications' ? (notifCount > 0 ? notifCount : undefined) : undefined;
                return (
                <div key={label} onClick={() => router.push(href)} title={!sidebarOpen ? label : undefined}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'space-between' : 'center', padding: sidebarOpen ? '8px 10px' : '10px 0', marginBottom: 2, borderRadius: 6, cursor: 'pointer', background: active ? 'rgba(200,32,42,0.12)' : 'transparent', borderLeft: sidebarOpen && active ? `3px solid ${RED}` : sidebarOpen ? '3px solid transparent' : 'none', position: 'relative' }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background = active ? 'rgba(200,32,42,0.12)' : 'transparent'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: sidebarOpen ? 9 : 0, justifyContent: 'center' }}>
                    <Icon size={15} color={active ? RED : 'rgba(255,255,255,0.42)'} strokeWidth={active ? 2.5 : 1.8} />
                    {sidebarOpen && <span style={{ fontSize: 15, fontWeight: active ? 600 : 400, color: active ? '#F5F5F5' : 'rgba(255,255,255,0.6)', whiteSpace: 'nowrap' }}>{label}</span>}
                  </div>
                  {sidebarOpen && badge && <div style={{ background: RED, color: '#fff', borderRadius: 10, fontSize: 13, fontWeight: 700, padding: '1px 6px', minWidth: 18, textAlign: 'center' }}>{badge}</div>}
                  {!sidebarOpen && badge && <div style={{ position: 'absolute', top: 6, right: 4, background: RED, borderRadius: '50%', width: 14, height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: '#fff' }}>{badge}</div>}
                </div>
                );
              })}
            </nav>
          </aside>

          {/* ── SCROLLABLE CONTENT ── */}
          <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '24px 24px 40px' }}>

            {/* Page header row */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <h1 style={{ fontFamily: BEBAS, fontSize: 34, color: GOLD, margin: 0, letterSpacing: 1 }}>
                  SUBSCRIPTION & BILLING
                </h1>
                <p style={{ color: GRAY, fontSize: 14, margin: '4px 0 0', fontFamily: BARLOW }}>
                  Manage your subscription, billing details and payment history.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('plans')}
                style={{
                  background: BG3, border: `1px solid ${GOLD}`, borderRadius: 6,
                  padding: '9px 18px', color: GOLD, fontFamily: BARLOW, fontSize: 14,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600,
                }}
              >⇄ Change Plan</button>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: `1px solid ${BG4}`, marginBottom: 22 }}>
              {TABS.map(tab => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
                  background: 'transparent', border: 'none',
                  borderBottom: activeTab === tab.key ? `2px solid ${GOLD}` : '2px solid transparent',
                  padding: '10px 22px', fontFamily: BARLOW, fontSize: 15,
                  color: activeTab === tab.key ? GOLD : LIGHT,
                  cursor: 'pointer', fontWeight: activeTab === tab.key ? 700 : 400,
                  marginBottom: -1, transition: 'color 0.15s',
                }}>{tab.label}</button>
              ))}
            </div>

            {/* Tab body */}
            {activeTab === 'overview'  && (
              <OverviewTab
                onTabChange={setActiveTab}
                subscription={subscription}
                usage={usage}
                transactions={transactions}
                loading={loading}
                loadingUsage={loadingUsage}
              />
            )}
            {activeTab === 'billing'   && <BillingHistoryTab transactions={transactions} loading={loading} />}
            {activeTab === 'invoices'  && <InvoicesTab transactions={transactions} loading={loading} />}
            {activeTab === 'payment'   && <PaymentMethodsTab transactions={transactions} loading={loading} />}
            {activeTab === 'plans'     && <PlansAddonsTab plans={plans} subscription={subscription} loading={loadingPlans} />}

          </div>
        </div>
      </div>
    </>
  );
}

// ─── Default Export wrapped in Suspense (required for useSearchParams) ────────
export default function SubscriptionBillingPage() {
  return (
    <Suspense fallback={<div style={{ background: '#050505', height: '100vh' }} />}>
      <SubscriptionBillingInner />
    </Suspense>
  );
}