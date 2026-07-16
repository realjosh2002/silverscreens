'use client';

import { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import SilverScreensLogo from '@/components/ui/SilverScreensLogo';
import {
  LayoutDashboard, Megaphone, PlusCircle, ClipboardList,
  UserSearch, Star, CalendarCheck, MessageSquare, Bell,
  Bookmark, ChevronDown, ChevronLeft, Menu, BarChart2, CreditCard, Settings,
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

// ─── Static Data ──────────────────────────────────────────────────────────────
const PLAN_BENEFITS = [
  { icon: '🎬', title: 'Unlimited Casting Calls',   desc: 'Create and manage unlimited casting calls' },
  { icon: '👥', title: 'Team Collaboration',         desc: 'Add up to 15 team members' },
  { icon: '🔍', title: 'Advanced Applicant Filters', desc: 'Access advanced search and filtering options' },
  { icon: '🎧', title: 'Priority Support',           desc: '24/7 priority email & chat support' },
  { icon: '📅', title: 'Bulk Audition Scheduling',   desc: 'Schedule auditions in bulk' },
  { icon: '☁️', title: 'Cloud Storage – 100 GB',    desc: 'Store media, documents and files securely' },
  { icon: '📊', title: 'Reports & Analytics',        desc: 'Detailed insights and performance reports' },
  { icon: '✅', title: 'Verified Agency Badge',      desc: 'Showcase verified badge on your profile' },
];

const USAGE = [
  { label: 'Casting Calls',       icon: '📋', used: 24,   total: 50,   unit: '' },
  { label: 'Applicants',          icon: '👤', used: 1284, total: 2000, unit: '' },
  { label: 'Auditions Scheduled', icon: '📅', used: 156,  total: 300,  unit: '' },
  { label: 'Team Members',        icon: '👥', used: 8,    total: 15,   unit: '' },
  { label: 'Cloud Storage',       icon: '☁️', used: 48,   total: 100,  unit: ' GB' },
];

const INVOICES = [
  { id: 'INV-2026-000124', date: '01 Jun 2026', plan: 'Agency Professional', amount: '₹14,999.00', status: 'Paid' },
  { id: 'INV-2026-000112', date: '01 May 2026', plan: 'Agency Professional', amount: '₹14,999.00', status: 'Paid' },
  { id: 'INV-2026-000098', date: '01 Apr 2026', plan: 'Agency Professional', amount: '₹14,999.00', status: 'Paid' },
  { id: 'INV-2026-000085', date: '01 Mar 2026', plan: 'Agency Professional', amount: '₹14,999.00', status: 'Paid' },
  { id: 'INV-2026-000071', date: '01 Feb 2026', plan: 'Agency Professional', amount: '₹14,999.00', status: 'Paid' },
  { id: 'INV-2026-000058', date: '01 Jan 2026', plan: 'Agency Professional', amount: '₹14,999.00', status: 'Paid' },
];

const BILLING_HISTORY = [
  { date: '01 Jun 2026', description: 'Monthly subscription – Agency Professional', amount: '₹14,999.00', type: 'Charge' },
  { date: '01 May 2026', description: 'Monthly subscription – Agency Professional', amount: '₹14,999.00', type: 'Charge' },
  { date: '15 Apr 2026', description: 'Cloud Storage Add-on (50 GB)',               amount: '₹1,999.00',  type: 'Charge' },
  { date: '01 Apr 2026', description: 'Monthly subscription – Agency Professional', amount: '₹14,999.00', type: 'Charge' },
  { date: '01 Mar 2026', description: 'Monthly subscription – Agency Professional', amount: '₹14,999.00', type: 'Charge' },
  { date: '01 Feb 2026', description: 'Monthly subscription – Agency Professional', amount: '₹14,999.00', type: 'Charge' },
  { date: '12 Jan 2026', description: 'Promo discount applied – SAVE20',            amount: '-₹2,999.80', type: 'Credit' },
  { date: '01 Jan 2026', description: 'Monthly subscription – Agency Professional', amount: '₹14,999.00', type: 'Charge' },
];

const PAYMENT_METHODS_DATA = [
  { id: 'pm1', type: 'Visa',       last4: '4242', expiry: '12/28', holder: 'DreamWorks Films', isDefault: true },
  { id: 'pm2', type: 'Mastercard', last4: '8843', expiry: '09/27', holder: 'DreamWorks Films', isDefault: false },
];

const PLANS = [
  {
    id: 'starter', name: 'Agency Starter', price: '₹4,999', cycle: '/mo',
    desc: 'Perfect for small agencies just getting started.', current: false,
    features: ['10 Casting Calls/month', '500 Applicants', '50 Auditions', '3 Team Members', '10 GB Cloud Storage', 'Standard Support'],
  },
  {
    id: 'professional', name: 'Agency Professional', price: '₹14,999', cycle: '/mo',
    desc: 'Advanced hiring and collaboration tools for growing agencies.', current: true,
    features: ['Unlimited Casting Calls', '2,000 Applicants', '300 Auditions', '15 Team Members', '100 GB Cloud Storage', 'Priority Support', 'Reports & Analytics', 'Verified Badge'],
  },
  {
    id: 'enterprise', name: 'Agency Enterprise', price: '₹39,999', cycle: '/mo',
    desc: 'Full-scale enterprise features for large productions.', current: false,
    features: ['Unlimited Everything', 'Unlimited Applicants', 'Unlimited Auditions', 'Unlimited Team Members', '1 TB Cloud Storage', 'Dedicated Account Manager', 'Custom Integrations', 'SLA Guarantee'],
  },
];

const ADDONS = [
  { icon: '👤', title: 'Additional Team Members',  desc: 'Add 5 more team seats',       price: '₹2,499/mo' },
  { icon: '☁️', title: 'Extra Cloud Storage',      desc: 'Additional 50 GB storage',    price: '₹1,999/mo' },
  { icon: '🎙️', title: 'More Audition Slots',      desc: 'Add 100 more audition slots', price: '₹999/mo'   },
  { icon: '📞', title: 'Priority Phone Support',   desc: 'Dedicated phone support line', price: '₹3,499/mo' },
];

type Tab = 'overview' | 'billing' | 'invoices' | 'payment' | 'plans';

// ─── Shared helpers ───────────────────────────────────────────────────────────
function UsageBar({ used, total }: { used: number; total: number }) {
  const pct = Math.min((used / total) * 100, 100);
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

// ─── Gold Star SVG ────────────────────────────────────────────────────────────
function GoldStar() {
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="26,4 32,20 49,20 36,30 41,47 26,37 11,47 16,30 3,20 20,20"
        fill="none" stroke={GOLD} strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
  );
}

// ─── 3D Box SVG (Add-ons promo illustration) ──────────────────────────────────
function AddonsBox() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* box body */}
      <rect x="14" y="28" width="42" height="36" rx="4" fill={GOLD} opacity="0.9"/>
      {/* box lid */}
      <rect x="10" y="18" width="50" height="14" rx="3" fill="#B8882A"/>
      {/* lid shine */}
      <rect x="10" y="18" width="50" height="6" rx="3" fill={GOLD} opacity="0.5"/>
      {/* plus sign */}
      <rect x="33" y="33" width="14" height="3" rx="1.5" fill={BG}/>
      <rect x="38.5" y="27.5" width="3" height="14" rx="1.5" fill={BG}/>
      {/* sparkles */}
      <circle cx="8"  cy="14" r="2" fill={GOLD} opacity="0.7"/>
      <circle cx="70" cy="18" r="1.5" fill={GOLD} opacity="0.5"/>
      <circle cx="65" cy="8"  r="2.5" fill={GOLD} opacity="0.4"/>
      <text x="4"  y="10" fill={GOLD} fontSize="8" opacity="0.8">✦</text>
      <text x="62" y="12" fill={GOLD} fontSize="6" opacity="0.7">✦</text>
    </svg>
  );
}

// ─── Right Sidebar (shown only on Overview tab) ───────────────────────────────
function RightSidebar({ onTabChange }: { onTabChange: (t: Tab) => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: 300, flexShrink: 0 }}>

      {/* Usage Summary */}
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <SecHead noMargin>USAGE SUMMARY</SecHead>
          <span style={{ fontSize: 14, color: GRAY, fontFamily: BARLOW }}>Resets on 01 Jul 2026</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
          {USAGE.map(u => (
            <div key={u.label}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <span style={{ fontSize: 14 }}>{u.icon}</span>
                  <span style={{ fontSize: 14, color: LIGHT, fontFamily: BARLOW }}>{u.label}</span>
                </div>
                <span style={{ fontSize: 14, color: WHITE, fontFamily: BARLOW, fontWeight: 600 }}>
                  {u.used.toLocaleString()}{u.unit} / {u.total.toLocaleString()}{u.unit}
                </span>
              </div>
              <UsageBar used={u.used} total={u.total} />
            </div>
          ))}
        </div>
        <button
          onClick={() => {}}
          style={{
            marginTop: 14, width: '100%', background: 'none', border: 'none',
            borderTop: `1px solid ${BG4}`, paddingTop: 12,
            color: GOLD, fontFamily: BARLOW, fontSize: 14, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}
        >View Usage Details <span style={{ fontSize: 15 }}>›</span></button>
      </Card>

      {/* Payment Method */}
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <SecHead noMargin>PAYMENT METHOD</SecHead>
          <button
            onClick={() => onTabChange('payment')}
            style={{ background: 'none', border: 'none', color: GOLD, fontFamily: BARLOW, fontSize: 14, cursor: 'pointer' }}
          >Manage</button>
        </div>
        {PAYMENT_METHODS_DATA.filter(p => p.isDefault).map(pm => (
          <div key={pm.id} style={{ background: BG3, border: `1px solid ${BG4}`, borderRadius: 8, padding: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  background: BLUE, color: WHITE, fontSize: 14, fontWeight: 800,
                  padding: '2px 7px', borderRadius: 3, letterSpacing: 0.5,
                }}>VISA</div>
                <span style={{ fontSize: 14, color: WHITE, fontFamily: BARLOW }}>Visa ending in {pm.last4}</span>
              </div>
              <span style={{
                background: `${GOLD}22`, color: GOLD, fontSize: 14,
                fontFamily: BARLOW, padding: '2px 9px', borderRadius: 4, fontWeight: 600,
              }}>Default</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div>
                <div style={{ fontSize: 14, color: GRAY, fontFamily: BARLOW }}>Expiry Date</div>
                <div style={{ fontSize: 14, color: WHITE, fontFamily: BARLOW, fontWeight: 600 }}>{pm.expiry}</div>
              </div>
              <div>
                <div style={{ fontSize: 14, color: GRAY, fontFamily: BARLOW }}>Card Holder</div>
                <div style={{ fontSize: 14, color: WHITE, fontFamily: BARLOW, fontWeight: 600 }}>{pm.holder}</div>
              </div>
            </div>
          </div>
        ))}
        <button
          onClick={() => onTabChange('payment')}
          style={{
            marginTop: 10, width: '100%', background: 'none',
            border: `1px dashed ${BG4}`, borderRadius: 6, padding: '9px',
            color: GOLD, fontFamily: BARLOW, fontSize: 14, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}
        >+ Add New Payment Method</button>
      </Card>

      {/* Need More – Add-ons */}
      <div style={{
        background: BG3, border: `1px solid ${BG4}`, borderRadius: 10,
        padding: '18px 20px', position: 'relative', overflow: 'hidden',
      }}>
        {/* 3D box decoration */}
        <div style={{ position: 'absolute', right: 10, top: 10, opacity: 0.9 }}>
          <AddonsBox />
        </div>
        <div style={{ paddingRight: 60 }}>
          <div style={{ fontSize: 14, color: GOLD, fontFamily: BARLOW, letterSpacing: 1.5, fontWeight: 700, marginBottom: 2 }}>NEED MORE?</div>
          <div style={{ fontFamily: BEBAS, fontSize: 22, color: WHITE, letterSpacing: 0.5, marginBottom: 3 }}>Explore Add-ons</div>
          <div style={{ fontSize: 14, color: GRAY, fontFamily: BARLOW, marginBottom: 14 }}>Enhance your plan with powerful add-ons.</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 14 }}>
          {['Additional Team Members', 'Extra Cloud Storage', 'More Audition Slots', 'Priority Phone Support'].map(a => (
            <div key={a} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <span style={{ color: GREEN, fontSize: 14 }}>✓</span>
              <span style={{ fontSize: 14, color: LIGHT, fontFamily: BARLOW }}>{a}</span>
            </div>
          ))}
        </div>
        <button
          onClick={() => onTabChange('plans')}
          style={{
            width: '100%', background: 'none', border: `1px solid ${GOLD}`,
            borderRadius: 6, padding: '9px', color: GOLD, fontFamily: BARLOW,
            fontSize: 14, cursor: 'pointer', fontWeight: 600,
          }}
        >View All Add-ons</button>
      </div>

      {/* Need Help */}
      <Card>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, color: GOLD, fontFamily: BARLOW, letterSpacing: 1.5, fontWeight: 700, marginBottom: 2 }}>NEED HELP?</div>
            <div style={{ fontSize: 14, color: GRAY, fontFamily: BARLOW, marginBottom: 14 }}>Our support team is here to help you.</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <a href="mailto:support@silverscreens.com"
                style={{ fontSize: 14, color: LIGHT, fontFamily: BARLOW, display: 'flex', alignItems: 'center', gap: 7, textDecoration: 'none' }}>
                <span>✉️</span> support@silverscreens.com
              </a>
              <a href="tel:+912212345678"
                style={{ fontSize: 14, color: LIGHT, fontFamily: BARLOW, display: 'flex', alignItems: 'center', gap: 7, textDecoration: 'none' }}>
                <span>📞</span> +91 22 1234 5678
              </a>
            </div>
          </div>
          <div style={{ fontSize: 32, opacity: 0.6, marginLeft: 10 }}>🎧</div>
        </div>
        <button
          onClick={() => {}}
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
function OverviewTab({ onTabChange }: { onTabChange: (t: Tab) => void }) {
  const [autoRenew, setAutoRenew] = useState(true);

  return (
    <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
      {/* LEFT — main content */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Current Plan */}
        <Card>
          <SecHead>CURRENT PLAN</SecHead>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
            {/* Left: star + name + desc */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
              <div style={{ flexShrink: 0, marginTop: 2 }}><GoldStar /></div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <span style={{ fontFamily: BEBAS, fontSize: 28, color: WHITE, letterSpacing: 0.5 }}>Agency Professional</span>
                  <span style={{
                    background: `${GREEN}22`, color: GREEN, fontSize: 14,
                    fontFamily: BARLOW, padding: '3px 10px', borderRadius: 4, fontWeight: 700,
                  }}>Active</span>
                </div>
                <p style={{ color: LIGHT, fontSize: 14, fontFamily: BARLOW, margin: '0 0 12px' }}>
                  Advanced hiring and collaboration tools for growing agencies.
                </p>
                <button
                  onClick={() => onTabChange('plans')}
                  style={{ background: 'none', border: 'none', color: GOLD, fontFamily: BARLOW, fontSize: 14, cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 4 }}
                >View Plan Details <span>›</span></button>
              </div>
            </div>
            {/* Right: billing cycle */}
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: 14, color: GRAY, fontFamily: BARLOW, marginBottom: 6 }}>Current Billing Cycle</div>
              <div style={{ fontFamily: BEBAS, fontSize: 19, color: WHITE, letterSpacing: 0.5 }}>01 Jun 2026 – 30 Jun 2026</div>
              <div style={{ fontSize: 14, color: GRAY, fontFamily: BARLOW, marginTop: 4 }}>30 days remaining</div>
            </div>
          </div>
        </Card>

        {/* Plan Benefits */}
        <Card>
          <SecHead>PLAN BENEFITS</SecHead>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {PLAN_BENEFITS.map(b => (
              <div key={b.title} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>{b.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, color: WHITE, fontFamily: BARLOW, fontWeight: 600 }}>{b.title}</div>
                  <div style={{ fontSize: 14, color: GRAY, fontFamily: BARLOW, marginTop: 1 }}>{b.desc}</div>
                </div>
                <span style={{ color: GREEN, fontSize: 15, flexShrink: 0, marginTop: 1 }}>✓</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Next Payment */}
        <Card>
          <SecHead>NEXT PAYMENT</SecHead>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            {/* Left col */}
            <div>
              <div style={{ fontSize: 14, color: GRAY, fontFamily: BARLOW, marginBottom: 4 }}>Amount</div>
              <div style={{ fontFamily: BEBAS, fontSize: 38, color: WHITE, letterSpacing: 1, lineHeight: 1 }}>₹14,999.00</div>
              <div style={{ fontSize: 14, color: GRAY, fontFamily: BARLOW, marginBottom: 16 }}>(Including applicable taxes)</div>
              <div style={{ fontSize: 14, color: GRAY, fontFamily: BARLOW, marginBottom: 18 }}>
                Billing Date &nbsp;
                <span style={{ color: WHITE, fontWeight: 600 }}>01 Jul 2026</span>
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
                { label: 'Plan',              value: 'Agency Professional' },
                { label: 'Billing Cycle',     value: 'Monthly' },
                { label: 'Next Billing Date', value: '01 Jul 2026' },
              ].map(row => (
                <div key={row.label}>
                  <div style={{ fontSize: 14, color: GRAY, fontFamily: BARLOW }}>{row.label}</div>
                  <div style={{ fontSize: 14, color: WHITE, fontFamily: BARLOW, fontWeight: 600 }}>{row.value}</div>
                </div>
              ))}
              {/* Auto-renewal notice */}
              <div style={{
                marginTop: 4, padding: '10px 12px', background: BG3,
                border: `1px solid ${BG4}`, borderRadius: 6,
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span style={{ fontSize: 14, flexShrink: 0 }}>ℹ️</span>
                <span style={{ fontSize: 14, color: LIGHT, fontFamily: BARLOW, flex: 1, lineHeight: 1.3 }}>
                  Auto-renewal is enabled for this subscription.
                </span>
                <button
                  onClick={() => setAutoRenew(!autoRenew)}
                  style={{ background: 'none', border: 'none', color: GOLD, fontSize: 14, fontFamily: BARLOW, cursor: 'pointer', padding: 0, whiteSpace: 'nowrap' }}
                >Manage Auto-renewal</button>
              </div>
            </div>
          </div>
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
              {INVOICES.slice(0, 3).map(inv => (
                <tr key={inv.id}
                  style={{ borderBottom: `1px solid ${BG4}`, cursor: 'pointer' }}
                  onMouseEnter={e => (e.currentTarget.style.background = BG3)}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '11px 10px', fontSize: 14, color: GOLD, fontFamily: BARLOW }}>{inv.id}</td>
                  <td style={{ padding: '11px 10px', fontSize: 14, color: LIGHT, fontFamily: BARLOW }}>{inv.date}</td>
                  <td style={{ padding: '11px 10px', fontSize: 14, color: LIGHT, fontFamily: BARLOW }}>{inv.plan}</td>
                  <td style={{ padding: '11px 10px', fontSize: 14, color: WHITE, fontFamily: BARLOW, fontWeight: 600 }}>{inv.amount}</td>
                  <td style={{ padding: '11px 10px' }}>
                    <span style={{ background: `${GREEN}20`, color: GREEN, fontSize: 14, fontFamily: BARLOW, padding: '3px 10px', borderRadius: 4, fontWeight: 600 }}>{inv.status}</span>
                  </td>
                  <td style={{ padding: '11px 10px', textAlign: 'center' }}>
                    <button style={{ background: 'none', border: `1px solid ${BG4}`, borderRadius: 4, padding: '4px 9px', color: LIGHT, cursor: 'pointer', fontSize: 14 }}>⬇</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: 10, fontSize: 14, color: GRAY, fontFamily: BARLOW }}>All amounts are inclusive of applicable taxes.</div>
        </Card>
      </div>

      {/* RIGHT sidebar */}
      <RightSidebar onTabChange={onTabChange} />
    </div>
  );
}

// ─── Billing History Tab ──────────────────────────────────────────────────────
function BillingHistoryTab() {
  const [filter, setFilter] = useState('All');
  const filters = ['All', 'Charges', 'Credits'];
  const filtered = filter === 'All' ? BILLING_HISTORY
    : filter === 'Credits' ? BILLING_HISTORY.filter(h => h.type === 'Credit')
    : BILLING_HISTORY.filter(h => h.type === 'Charge');

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
          {filtered.map((row, i) => (
            <tr key={i}
              style={{ borderBottom: `1px solid ${BG4}` }}
              onMouseEnter={e => (e.currentTarget.style.background = BG3)}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <td style={{ padding: '12px 12px', fontSize: 14, color: GRAY, fontFamily: BARLOW, whiteSpace: 'nowrap' }}>{row.date}</td>
              <td style={{ padding: '12px 12px', fontSize: 14, color: WHITE, fontFamily: BARLOW }}>{row.description}</td>
              <td style={{ padding: '12px 12px', fontSize: 14, color: row.type === 'Credit' ? GREEN : WHITE, fontFamily: BARLOW, fontWeight: 600, textAlign: 'right', whiteSpace: 'nowrap' }}>{row.amount}</td>
              <td style={{ padding: '12px 12px' }}>
                <span style={{
                  background: row.type === 'Credit' ? `${GREEN}20` : `${BLUE}20`,
                  color: row.type === 'Credit' ? GREEN : BLUE,
                  fontSize: 14, fontFamily: BARLOW, padding: '3px 10px', borderRadius: 4, fontWeight: 600,
                }}>{row.type}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

// ─── Invoices Tab ─────────────────────────────────────────────────────────────
function InvoicesTab() {
  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <SecHead noMargin>ALL INVOICES</SecHead>
        <button style={{
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
          {INVOICES.map(inv => (
            <tr key={inv.id}
              style={{ borderBottom: `1px solid ${BG4}`, cursor: 'pointer' }}
              onMouseEnter={e => (e.currentTarget.style.background = BG3)}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <td style={{ padding: '12px 12px', fontSize: 14, color: GOLD, fontFamily: BARLOW }}>{inv.id}</td>
              <td style={{ padding: '12px 12px', fontSize: 14, color: LIGHT, fontFamily: BARLOW }}>{inv.date}</td>
              <td style={{ padding: '12px 12px', fontSize: 14, color: LIGHT, fontFamily: BARLOW }}>{inv.plan}</td>
              <td style={{ padding: '12px 12px', fontSize: 14, color: WHITE, fontFamily: BARLOW, fontWeight: 600 }}>{inv.amount}</td>
              <td style={{ padding: '12px 12px' }}>
                <span style={{ background: `${GREEN}20`, color: GREEN, fontSize: 14, fontFamily: BARLOW, padding: '3px 10px', borderRadius: 4, fontWeight: 600 }}>{inv.status}</span>
              </td>
              <td style={{ padding: '12px 12px', textAlign: 'center' }}>
                <button style={{ background: 'none', border: `1px solid ${BG4}`, borderRadius: 4, padding: '5px 10px', color: LIGHT, cursor: 'pointer', fontSize: 14 }}>⬇</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: 12, fontSize: 14, color: GRAY, fontFamily: BARLOW }}>All amounts are inclusive of applicable taxes.</div>
    </Card>
  );
}

// ─── Payment Methods Tab ──────────────────────────────────────────────────────
function PaymentMethodsTab() {
  const [methods, setMethods] = useState(PAYMENT_METHODS_DATA);
  const [showAdd, setShowAdd] = useState(false);
  const [newCard, setNewCard] = useState({ number: '', expiry: '', cvv: '', holder: '' });

  const setDefault = (id: string) => setMethods(ms => ms.map(m => ({ ...m, isDefault: m.id === id })));
  const removeCard = (id: string) => setMethods(ms => ms.filter(m => m.id !== id));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <SecHead noMargin>PAYMENT METHODS</SecHead>
          <button onClick={() => setShowAdd(!showAdd)} style={{
            background: RED, border: 'none', borderRadius: 6, padding: '7px 16px',
            color: WHITE, fontFamily: BARLOW, fontSize: 14, cursor: 'pointer', fontWeight: 600,
          }}>+ Add New Card</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {methods.map(pm => (
            <div key={pm.id} style={{
              background: BG3, border: `2px solid ${pm.isDefault ? GOLD : BG4}`,
              borderRadius: 8, padding: 16,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    background: pm.type === 'Visa' ? BLUE : '#EB001B',
                    color: WHITE, fontSize: 14, fontWeight: 800, padding: '3px 8px', borderRadius: 3,
                  }}>{pm.type.toUpperCase()}</div>
                  <span style={{ fontSize: 15, color: WHITE, fontFamily: BARLOW }}>{pm.type} ending in {pm.last4}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {pm.isDefault
                    ? <span style={{ background: `${GOLD}22`, color: GOLD, fontSize: 14, fontFamily: BARLOW, padding: '2px 9px', borderRadius: 4, fontWeight: 600 }}>Default</span>
                    : <button onClick={() => setDefault(pm.id)} style={{ background: 'none', border: `1px solid ${BG4}`, borderRadius: 4, padding: '3px 10px', color: LIGHT, fontFamily: BARLOW, fontSize: 14, cursor: 'pointer' }}>Set Default</button>
                  }
                  <button onClick={() => removeCard(pm.id)} style={{ background: 'none', border: 'none', color: RED, fontSize: 16, cursor: 'pointer', lineHeight: 1 }}>✕</button>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {[
                  { label: 'Expiry Date', value: pm.expiry },
                  { label: 'Card Holder', value: pm.holder },
                  { label: 'Card Type',   value: pm.type },
                ].map(f => (
                  <div key={f.label}>
                    <div style={{ fontSize: 14, color: GRAY, fontFamily: BARLOW }}>{f.label}</div>
                    <div style={{ fontSize: 14, color: WHITE, fontFamily: BARLOW, fontWeight: 600 }}>{f.value}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {showAdd && (
        <Card>
          <SecHead>ADD NEW CARD</SecHead>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {[
              { key: 'number', label: 'Card Number',       placeholder: '1234 5678 9012 3456' },
              { key: 'holder', label: 'Card Holder Name',  placeholder: 'DreamWorks Films' },
              { key: 'expiry', label: 'Expiry Date',       placeholder: 'MM/YY' },
              { key: 'cvv',    label: 'CVV',               placeholder: '•••' },
            ].map(field => (
              <div key={field.key}>
                <label style={{ display: 'block', fontSize: 14, color: GRAY, fontFamily: BARLOW, marginBottom: 5 }}>{field.label}</label>
                <input
                  type={field.key === 'cvv' ? 'password' : 'text'}
                  placeholder={field.placeholder}
                  value={newCard[field.key as keyof typeof newCard]}
                  onChange={e => setNewCard(c => ({ ...c, [field.key]: e.target.value }))}
                  style={{
                    width: '100%', background: BG3, border: `1px solid ${BG4}`,
                    borderRadius: 6, padding: '10px 12px', color: WHITE,
                    fontFamily: BARLOW, fontSize: 14, outline: 'none', boxSizing: 'border-box',
                  }}
                />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button onClick={() => setShowAdd(false)} style={{
              flex: 1, background: BG3, border: `1px solid ${BG4}`, borderRadius: 6,
              padding: '11px', color: LIGHT, fontFamily: BARLOW, fontSize: 14, cursor: 'pointer',
            }}>Cancel</button>
            <button style={{
              flex: 2, background: GOLD, border: 'none', borderRadius: 6,
              padding: '11px', color: BG, fontFamily: BEBAS, fontSize: 18, cursor: 'pointer', letterSpacing: 0.5,
            }}>Save Card</button>
          </div>
        </Card>
      )}
    </div>
  );
}

// ─── Plans & Add-ons Tab ──────────────────────────────────────────────────────
function PlansAddonsTab() {
  const [cycle, setCycle] = useState<'monthly' | 'annual'>('monthly');

  const annualPrice = (p: string) => {
    const num = parseInt(p.replace(/[₹,]/g, ''));
    return '₹' + Math.round(num * 0.8).toLocaleString('en-IN');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Plans */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ fontFamily: BEBAS, fontSize: 20, color: GOLD, letterSpacing: 1 }}>CHOOSE YOUR PLAN</div>
          <div style={{ display: 'flex', background: BG3, border: `1px solid ${BG4}`, borderRadius: 6, overflow: 'hidden' }}>
            {(['monthly', 'annual'] as const).map(c => (
              <button key={c} onClick={() => setCycle(c)} style={{
                padding: '7px 18px', background: cycle === c ? GOLD : 'transparent',
                border: 'none', color: cycle === c ? BG : LIGHT,
                fontFamily: BARLOW, fontSize: 14, cursor: 'pointer', fontWeight: 600,
              }}>
                {c === 'annual' ? 'Annual (Save 20%)' : 'Monthly'}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {PLANS.map(plan => (
            <div key={plan.id} style={{
              background: plan.current ? BG3 : BG2,
              border: `2px solid ${plan.current ? GOLD : BG4}`,
              borderRadius: 10, padding: 20, position: 'relative',
            }}>
              {plan.current && (
                <div style={{
                  position: 'absolute', top: -1, right: 20,
                  background: GOLD, color: BG, fontFamily: BARLOW, fontSize: 14,
                  fontWeight: 700, padding: '3px 10px', borderRadius: '0 0 6px 6px',
                }}>CURRENT PLAN</div>
              )}
              <div style={{ fontFamily: BEBAS, fontSize: 22, color: WHITE, letterSpacing: 0.5, marginBottom: 4 }}>{plan.name}</div>
              <div style={{ marginBottom: 8 }}>
                <span style={{ fontFamily: BEBAS, fontSize: 34, color: plan.current ? GOLD : WHITE }}>
                  {cycle === 'annual' ? annualPrice(plan.price) : plan.price}
                </span>
                <span style={{ fontSize: 14, color: GRAY, fontFamily: BARLOW }}>{plan.cycle}</span>
              </div>
              <p style={{ fontSize: 14, color: GRAY, fontFamily: BARLOW, marginBottom: 14, lineHeight: 1.4, minHeight: 32 }}>{plan.desc}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 16 }}>
                {plan.features.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <span style={{ color: plan.current ? GOLD : GREEN, fontSize: 14 }}>✓</span>
                    <span style={{ fontSize: 14, color: LIGHT, fontFamily: BARLOW }}>{f}</span>
                  </div>
                ))}
              </div>
              <button style={{
                width: '100%', padding: '10px', borderRadius: 6, fontFamily: BARLOW, fontSize: 14,
                cursor: plan.current ? 'default' : 'pointer', fontWeight: 600,
                background: plan.current ? `${GOLD}18` : plan.id === 'enterprise' ? GOLD : BG3,
                border: `1px solid ${plan.current || plan.id === 'enterprise' ? GOLD : BG4}`,
                color: plan.current ? GOLD : plan.id === 'enterprise' ? BG : LIGHT,
              }}>{plan.current ? 'Current Plan' : `Upgrade to ${plan.name.split(' ')[1]}`}</button>
            </div>
          ))}
        </div>
      </div>

      {/* Add-ons */}
      <div>
        <div style={{ fontFamily: BEBAS, fontSize: 20, color: GOLD, letterSpacing: 1, marginBottom: 16 }}>ADD-ONS</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {ADDONS.map(addon => (
            <Card key={addon.title}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{addon.icon}</div>
              <div style={{ fontSize: 15, color: WHITE, fontFamily: BARLOW, fontWeight: 600, marginBottom: 4 }}>{addon.title}</div>
              <div style={{ fontSize: 14, color: GRAY, fontFamily: BARLOW, marginBottom: 12 }}>{addon.desc}</div>
              <div style={{ fontFamily: BEBAS, fontSize: 20, color: GOLD, marginBottom: 12 }}>{addon.price}</div>
              <button style={{
                width: '100%', background: BG3, border: `1px solid ${GOLD}`, borderRadius: 6,
                padding: '8px', color: GOLD, fontFamily: BARLOW, fontSize: 14,
                cursor: 'pointer', fontWeight: 600,
              }}>Add to Plan</button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}



const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard',               href: '/agency/dashboard' },
  { icon: PlusCircle,      label: 'Create Casting Call',     href: '/agency/create-casting' },
  { icon: Megaphone,       label: 'Casting Calls List',      href: '/agency/casting-calls' },
  { icon: UserSearch,      label: 'Talent Search',           href: '/agency/talent-search' },
  { icon: ClipboardList,   label: 'Applications Management', href: '/agency/applications' },
  { icon: Star,            label: 'Shortlisted Talents',     href: '/agency/shortlisted' },
  { icon: CalendarCheck,   label: 'Audition Management',     href: '/agency/auditions' },
  { icon: Bookmark,        label: 'Saved Talents',           href: '/agency/saved-talents' },
  { icon: MessageSquare,   label: 'Messages',  badge: 12,    href: '/agency/messages' },
  { icon: Bell,            label: 'Notifications', badge: 3, href: '/agency/notifications' },
];

const PROFILE_MENU = [
  { label: 'Reports & Analytics',   href: '/agency/reports' },
  { label: 'Subscription & Billing', href: '/agency/subscription' },
  { label: 'Company Profile',        href: '/agency-profile' },
  { label: 'Documents',              href: '/agency/documents' },
  { label: 'Calendar',               href: '/agency/calendar' },
  { label: 'Settings',               href: '/agency/settings' },
  { label: 'Support',                href: '/contact' },
  { label: 'Logout',                 href: '/login' },
];

// ─── Inner Page ───────────────────────────────────────────────────────────────
function SubscriptionBillingInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sidebarOpen,  setSidebarOpen]  = useState(false);
  const [profileOpen,  setProfileOpen]  = useState(false);
  const validTabs: Tab[] = ['overview', 'billing', 'invoices', 'payment', 'plans'];
  const tabParam = searchParams.get('tab') as Tab | null;
  const initialTab: Tab = (tabParam && validTabs.includes(tabParam)) ? tabParam : 'overview';
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);

  const SB_W = sidebarOpen ? 230 : 52;

  const TABS: { key: Tab; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'billing',  label: 'Billing History' },
    { key: 'invoices', label: 'Invoices' },
    { key: 'payment',  label: 'Payment Methods' },
    { key: 'plans',    label: 'Plans & Add-ons' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: BG, fontFamily: BARLOW, color: '#F5F5F5' }}>

      {/* ══ TOPNAV ══ */}
      <header style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0, padding: '0 24px', height: 60, background: BG2, borderBottom: '1px solid rgba(255,255,255,0.06)', zIndex: 100 }}>
        <SilverScreensLogo size="md" href="/" showTagline={false} />
        <div style={{ flex: 1 }} />
        <button onClick={() => router.push('/agency/create-casting')} style={{ display: 'flex', alignItems: 'center', gap: 7, background: RED, color: '#fff', border: 'none', borderRadius: 8, padding: '0 18px', height: 36, fontSize: 15, fontWeight: 700, fontFamily: BARLOW, cursor: 'pointer', whiteSpace: 'nowrap' }}>
          Post a Casting <span style={{ fontSize: 16, fontWeight: 400 }}>+</span>
        </button>
        <div onClick={() => router.push('/agency/messages')} style={{ position: 'relative', cursor: 'pointer' }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MessageSquare size={15} color="rgba(255,255,255,0.7)" />
          </div>
          <div style={{ position: 'absolute', top: -5, right: -5, background: RED, borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#fff', pointerEvents: 'none' }}>12</div>
        </div>
        <div onClick={() => router.push('/agency/notifications')} style={{ position: 'relative', cursor: 'pointer' }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bell size={15} color="rgba(255,255,255,0.7)" />
          </div>
          <div style={{ position: 'absolute', top: -5, right: -5, background: RED, borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#fff', pointerEvents: 'none' }}>3</div>
        </div>
        <div style={{ position: 'relative' }}>
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
              <div onClick={() => setProfileOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 150 }} />
              <div style={{ position: 'absolute', top: 46, right: 0, width: 220, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, overflow: 'hidden', zIndex: 200, boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}>
                <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>Agency ID</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: GOLD }}>AGE062600001</span>
                </div>
                {PROFILE_MENU.map(({ label, href }) => (
                  <div key={label} onClick={() => { router.push(href); setProfileOpen(false); }}
                    style={{ padding: '10px 16px', fontSize: 15, cursor: 'pointer', color: label === 'Logout' ? '#ff6b6b' : label === 'Subscription & Billing' ? GOLD : '#F5F5F5', fontWeight: label === 'Subscription & Billing' ? 700 : 400, background: label === 'Subscription & Billing' ? 'rgba(212,166,74,0.08)' : 'transparent', borderTop: label === 'Logout' ? '1px solid rgba(255,255,255,0.07)' : 'none' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                    onMouseLeave={e => (e.currentTarget.style.background = label === 'Subscription & Billing' ? 'rgba(212,166,74,0.08)' : 'transparent')}
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
        <aside style={{ width: SB_W, flexShrink: 0, background: BG2, borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', overflowY: 'auto', overflowX: 'hidden', scrollbarWidth: 'none', transition: 'width 0.2s ease' }}>
          <div style={{ height: 52, display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'flex-end' : 'center', padding: sidebarOpen ? '0 12px' : 0, borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
            <button onClick={() => setSidebarOpen(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', width: 30, height: 30, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            >{sidebarOpen ? <ChevronLeft size={16} /> : <Menu size={16} />}</button>
          </div>
          {sidebarOpen && (
            <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 9, background: 'linear-gradient(135deg,#1a1410,#2a1e0e)', border: `1px solid ${GOLD}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: GOLD, fontFamily: BEBAS, flexShrink: 0 }}>DP</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#F5F5F5', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Dharma Productions</div>
                <div onClick={() => router.push('/agency-profile')} style={{ fontSize: 14, color: RED, fontWeight: 600, cursor: 'pointer' }}>View Company Profile</div>
              </div>
            </div>
          )}
          <nav style={{ flex: 1, padding: sidebarOpen ? '8px 6px' : '8px 4px', overflowY: 'auto', scrollbarWidth: 'none' }}>
            {NAV_ITEMS.map(({ icon: Icon, label, active, badge, href }) => (
              <div key={label} onClick={() => router.push(href)} title={!sidebarOpen ? label : undefined}
                style={{ display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'space-between' : 'center', padding: sidebarOpen ? '8px 10px' : '10px 0', marginBottom: 2, borderRadius: 6, cursor: 'pointer', background: active ? 'rgba(200,32,42,0.12)' : 'transparent', borderLeft: sidebarOpen && active ? `3px solid ${RED}` : sidebarOpen ? '3px solid transparent' : 'none', position: 'relative' }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = active ? 'rgba(200,32,42,0.12)' : 'transparent'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: sidebarOpen ? 9 : 0, justifyContent: 'center' }}>
                  <Icon size={15} color={active ? RED : 'rgba(255,255,255,0.42)'} strokeWidth={active ? 2.5 : 1.8} />
                  {sidebarOpen && <span style={{ fontSize: 15, fontWeight: active ? 600 : 400, color: active ? '#F5F5F5' : 'rgba(255,255,255,0.6)', whiteSpace: 'nowrap' }}>{label}</span>}
                </div>
                {sidebarOpen && badge && <div style={{ background: RED, color: '#fff', borderRadius: 10, fontSize: 14, fontWeight: 700, padding: '1px 6px', minWidth: 18, textAlign: 'center' }}>{badge}</div>}
                {!sidebarOpen && badge && <div style={{ position: 'absolute', top: 6, right: 4, background: RED, borderRadius: '50%', width: 14, height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 700, color: '#fff' }}>{badge}</div>}
              </div>
            ))}
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
          {activeTab === 'overview' && <OverviewTab onTabChange={setActiveTab} />}
          {activeTab === 'billing'  && <BillingHistoryTab />}
          {activeTab === 'invoices' && <InvoicesTab />}
          {activeTab === 'payment'  && <PaymentMethodsTab />}
          {activeTab === 'plans'    && <PlansAddonsTab />}

        </div>
      </div>
    </div>
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