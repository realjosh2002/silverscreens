'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Check, X, Zap, Star, Crown, Building2, TrendingUp, Layers, ShieldCheck, ExternalLink } from 'lucide-react'

/* ── CONSTANTS ───────────────────────────────────────────────── */
const RED    = '#C8202A'
const GOLD   = '#D4A64A'
const GREEN  = '#22C55E'
const BG     = '#050505'
const BG2    = '#0B0F14'
const BG3    = '#121821'
const BG4    = '#1C2030'
const BARLOW = "'Barlow Condensed', sans-serif"
const BEBAS  = "'Bebas Neue', sans-serif"

/* ─────────────────────────────────────────────────────────────
   ADMIN-MANAGED CONFIG
   In production, fetched from /api/admin/plans
   Editable via Admin → Plan Manager
───────────────────────────────────────────────────────────── */
const ASPIRANT_PLANS = [
  {
    id: 'spotlight', name: 'Spotlight', icon: 'zap',
    duration: '3 Months', durationShort: '3 mo', months: 3,
    price: 299, pricePerMonth: 99.67,
    usdPrice: 3, usdPricePerMonth: 1,
    tagline: 'Get started and explore your first casting opportunities.',
    popular: false, badge: null,
    features: [
      { text: 'Full profile with photos & showreel', included: true  },
      { text: 'Apply to casting calls',              included: true  },
      { text: 'Browse all talent listings',          included: true  },
      { text: 'Direct messaging with studios',       included: true  },
      { text: 'Profile analytics dashboard',         included: true  },
      { text: 'SilverScreens verified badge',        included: true  },
      { text: 'Priority listing in search',          included: false },
      { text: 'Featured profile placement',          included: false },
      { text: 'Direct casting invites',              included: false },
      { text: 'Dedicated account manager',           included: false },
    ],
  },
  {
    id: 'star', name: 'Star', icon: 'star',
    duration: '6 Months', durationShort: '6 mo', months: 6,
    price: 499, pricePerMonth: 83.17,
    usdPrice: 5, usdPricePerMonth: 0.83,
    tagline: 'The most popular choice for working professionals.',
    popular: true, badge: 'Most Popular',
    features: [
      { text: 'Full profile with photos & showreel', included: true  },
      { text: 'Apply to casting calls',              included: true  },
      { text: 'Browse all talent listings',          included: true  },
      { text: 'Direct messaging with studios',       included: true  },
      { text: 'Profile analytics dashboard',         included: true  },
      { text: 'SilverScreens verified badge',        included: true  },
      { text: 'Priority listing in search',          included: true  },
      { text: 'Featured profile placement',          included: true  },
      { text: 'Direct casting invites',              included: false },
      { text: 'Dedicated account manager',           included: false },
    ],
  },
  {
    id: 'icon', name: 'Icon', icon: 'crown',
    duration: '12 Months', durationShort: '12 mo', months: 12,
    price: 999, pricePerMonth: 83.25,
    usdPrice: 10, usdPricePerMonth: 0.83,
    tagline: 'Maximum visibility for serious industry professionals.',
    popular: false, badge: 'Best Value',
    features: [
      { text: 'Full profile with photos & showreel', included: true },
      { text: 'Apply to casting calls',              included: true },
      { text: 'Browse all talent listings',          included: true },
      { text: 'Direct messaging with studios',       included: true },
      { text: 'Profile analytics dashboard',         included: true },
      { text: 'SilverScreens verified badge',        included: true },
      { text: 'Priority listing in search',          included: true },
      { text: 'Featured profile placement',          included: true },
      { text: 'Direct casting invites',              included: true },
      { text: 'Dedicated account manager',           included: true },
    ],
  },
]

const AGENCY_PLANS = [
  {
    id: 'starter', name: 'Starter', icon: 'building',
    duration: '3 Months', durationShort: '3 mo', months: 3,
    price: 5999, pricePerMonth: 1999.67,
    usdPrice: 63, usdPricePerMonth: 21,
    tagline: 'For small teams and independent casting directors.',
    popular: false, badge: null,
    features: [
      { text: 'Post up to 5 casting calls',          included: true  },
      { text: 'Basic talent search & filters',       included: true  },
      { text: 'Up to 3 team members',                included: true  },
      { text: 'Manage & track applications',         included: true  },
      { text: 'Email support',                       included: true  },
      { text: 'Advanced search filters',             included: false },
      { text: 'Up to 10 team members',               included: false },
      { text: 'Analytics dashboard',                 included: false },
      { text: 'Unlimited casting calls',             included: false },
      { text: 'Dedicated account manager',           included: false },
    ],
  },
  {
    id: 'growth', name: 'Growth', icon: 'trending',
    duration: '6 Months', durationShort: '6 mo', months: 6,
    price: 24999, pricePerMonth: 4166.5,
    usdPrice: 263, usdPricePerMonth: 43.83,
    tagline: 'For growing production houses with ongoing hiring.',
    popular: true, badge: 'Most Popular',
    features: [
      { text: 'Post up to 5 casting calls',          included: true  },
      { text: 'Basic talent search & filters',       included: true  },
      { text: 'Up to 3 team members',                included: true  },
      { text: 'Manage & track applications',         included: true  },
      { text: 'Email support',                       included: true  },
      { text: 'Advanced search filters',             included: true  },
      { text: 'Up to 10 team members',               included: true  },
      { text: 'Analytics dashboard',                 included: true  },
      { text: 'Unlimited casting calls',             included: false },
      { text: 'Dedicated account manager',           included: false },
    ],
  },
  {
    id: 'enterprise', name: 'Enterprise', icon: 'layers',
    duration: '12 Months', durationShort: '12 mo', months: 12,
    price: 99999, pricePerMonth: 8333.25,
    usdPrice: 1050, usdPricePerMonth: 87.50,
    tagline: 'For large studios and organisations at scale.',
    popular: false, badge: 'Best Value',
    features: [
      { text: 'Post up to 5 casting calls',          included: true },
      { text: 'Basic talent search & filters',       included: true },
      { text: 'Up to 3 team members',                included: true },
      { text: 'Manage & track applications',         included: true },
      { text: 'Email support',                       included: true },
      { text: 'Advanced search filters',             included: true },
      { text: 'Up to 10 team members',               included: true },
      { text: 'Analytics dashboard',                 included: true },
      { text: 'Unlimited casting calls',             included: true },
      { text: 'Dedicated account manager',           included: true },
    ],
  },
]

/* ── COMBO CONFIG (admin-managed) ────────────────────────────────
   RingsNRoses Bronze tier is bundled by default.
   Bronze standalone prices (from ringsnroses.com/plan):
     Monthly  → ₹99/mo  (Spotlight maps to 3 × ₹99 = ₹297)
     6 Months → ₹499    (Star maps to RNR 6-month plan)
     Annual   → ₹999    (Icon maps to RNR annual plan)
   NOTE: RingsNRoses has no quarterly plan. Spotlight (3 months)
   maps to 3x monthly billing at ₹99/mo.
   IMPORTANT: Keep these prices in sync with ringsnroses.com/plan.
   Last synced: June 2025
─────────────────────────────────────────────────────────────── */
const COMBO_CONFIG = {
  enabled: true,
  partnerName: 'RingsNRoses',
  partnerTagline: "India's #1 Wedding Vendor Marketplace",
  partnerPlanName: 'Bronze',
  partnerPlanUrl: 'https://www.ringsnroses.com/plan',
  discountPct: 50,
  eligibleCategories: [
    'Make Up Artist', 'Key Make Up Artist', 'Make Up Supervisor',
    'Hair Stylist', 'Key Hair',
    'Costume Designer', 'Costume Supervisor',
    'Choreographer', 'Dancer',
    'Photographer', 'Videographer',
    'Music Composer', 'Music Composer / Director', 'Singer',
  ],
  checkoutPath: '/checkout/bundle',
  // Standalone Bronze prices per SilverScreens plan duration
  // Admin: update these when RingsNRoses changes their pricing
  rnrPriceMap: {
    spotlight: { fullPrice: 297, discounted: 149, label: '3 × ₹99/mo',    usdFullPrice: 3,  usdDiscounted: 2,  usdLabel: '3 × $0.67/mo' },
    star:      { fullPrice: 499, discounted: 250, label: '6-month plan',   usdFullPrice: 5,  usdDiscounted: 3,  usdLabel: '6-month plan'  },
    icon:      { fullPrice: 999, discounted: 500, label: 'Annual plan',    usdFullPrice: 10, usdDiscounted: 5,  usdLabel: 'Annual plan'   },
  },
}

/* ── AUTH HOOK ───────────────────────────────────────────────────
   Reads session from localStorage key 'ss_user' (set at login).
   Shape: { name: string, category: string, loggedIn: boolean }
   To wire to a different auth provider, replace the localStorage
   read with your session/cookie/context call.
─────────────────────────────────────────────────────────────── */
function useAuth() {
  const [user, setUser] = useState<{ loggedIn: boolean; name: string; category: string }>({
    loggedIn: false, name: '', category: '',
  })

  useEffect(() => {
    try {
      const raw = localStorage.getItem('ss_user')
      if (!raw) return
      const parsed = JSON.parse(raw)
      if (!parsed?.loggedIn) return

      // Session expiry — clear stale sessions older than 24 hours
      const loginTime = parsed.verifiedAt || parsed.loginAt
      if (loginTime) {
        const ageHours = (Date.now() - new Date(loginTime).getTime()) / (1000 * 60 * 60)
        if (ageHours > 24) {
          localStorage.removeItem('ss_user')
          return
        }
      }

      setUser({ loggedIn: true, name: parsed.name ?? '', category: parsed.category ?? '' })
    } catch {
      // Not logged in or malformed session
    }
  }, [])

  return user
}

/* ── HELPERS ─────────────────────────────────────────────────── */
function PlanIcon({ icon, size = 20, color = '#fff' }: { icon: string; size?: number; color?: string }) {
  if (icon === 'zap')      return <Zap      size={size} color={color} strokeWidth={2} />
  if (icon === 'star')     return <Star     size={size} color={color} strokeWidth={2} />
  if (icon === 'crown')    return <Crown    size={size} color={color} strokeWidth={2} />
  if (icon === 'building') return <Building2 size={size} color={color} strokeWidth={2} />
  if (icon === 'trending') return <TrendingUp size={size} color={color} strokeWidth={2} />
  if (icon === 'layers')   return <Layers   size={size} color={color} strokeWidth={2} />
  return null
}

function comboAddonPrice(planId: string) {
  return COMBO_CONFIG.rnrPriceMap[planId as keyof typeof COMBO_CONFIG.rnrPriceMap]?.discounted ?? 0
}
function comboFullPrice(planId: string) {
  return COMBO_CONFIG.rnrPriceMap[planId as keyof typeof COMBO_CONFIG.rnrPriceMap]?.fullPrice ?? 0
}
function comboSaving(planId: string) {
  const map = COMBO_CONFIG.rnrPriceMap[planId as keyof typeof COMBO_CONFIG.rnrPriceMap]
  return map ? map.fullPrice - map.discounted : 0
}
function comboBillingLabel(planId: string) {
  return COMBO_CONFIG.rnrPriceMap[planId as keyof typeof COMBO_CONFIG.rnrPriceMap]?.label ?? ''
}

/* ── ASPIRANT PLAN CARD ──────────────────────────────────────── */
function IntlAspirantCard({
  plan, isGuest, isEligible, withCombo, onToggleCombo, onSelect, currency,
}: {
  plan: typeof ASPIRANT_PLANS[0]
  isGuest: boolean
  isEligible: boolean
  withCombo: boolean
  currency: 'INR' | 'USD'
  onToggleCombo: () => void
  onSelect: (planId: string, withCombo: boolean) => void
}) {
  const isUSD    = currency === 'USD'
  const dispPrice = isUSD ? ((plan as any).usdPrice ?? plan.price) : plan.price
  const dispPpm   = isUSD ? ((plan as any).usdPricePerMonth ?? plan.pricePerMonth) : plan.pricePerMonth
  const sym       = isUSD ? '$' : '₹'
  const locale    = isUSD ? 'en-US' : 'en-IN'
  const rnrMap   = COMBO_CONFIG.rnrPriceMap[plan.id as keyof typeof COMBO_CONFIG.rnrPriceMap]
  const addon    = isUSD ? (rnrMap?.usdDiscounted ?? 0)  : comboAddonPrice(plan.id)
  const saving   = isUSD ? ((rnrMap?.usdFullPrice ?? 0) - (rnrMap?.usdDiscounted ?? 0)) : comboSaving(plan.id)
  const rnrFull  = isUSD ? (rnrMap?.usdFullPrice ?? 0)   : comboFullPrice(plan.id)
  const rnrLabel = isUSD ? (rnrMap?.usdLabel ?? '')       : comboBillingLabel(plan.id)
  const total    = dispPrice + (withCombo ? addon : 0)

  return (
    <div style={{
      position: 'relative',
      background: plan.popular
        ? 'linear-gradient(180deg, #181208 0%, #121007 100%)'
        : 'linear-gradient(180deg, #0d1118 0%, #090c12 100%)',
      border: `1px solid ${plan.popular ? 'rgba(212,166,74,0.35)' : 'rgba(255,255,255,0.08)'}`,
      borderRadius: 14, padding: plan.popular ? '40px 26px 26px' : '30px 26px 26px',
      display: 'flex', flexDirection: 'column' as const,
      boxShadow: plan.popular ? '0 0 80px rgba(212,166,74,0.07), 0 20px 60px rgba(0,0,0,0.4)' : '0 10px 40px rgba(0,0,0,0.3)',
      transition: 'transform 0.25s, box-shadow 0.25s',
      flex: 1,
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-6px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = plan.popular ? '0 0 100px rgba(212,166,74,0.12), 0 24px 80px rgba(0,0,0,0.5)' : '0 16px 60px rgba(0,0,0,0.5)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = plan.popular ? '0 0 80px rgba(212,166,74,0.07), 0 20px 60px rgba(0,0,0,0.4)' : '0 10px 40px rgba(0,0,0,0.3)' }}
    >
      {/* Top accent line */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, borderRadius: '14px 14px 0 0', background: plan.popular ? `linear-gradient(90deg, transparent, ${GOLD}, transparent)` : `linear-gradient(90deg, transparent, ${RED}, transparent)` }} />

      {/* Badge */}
      {plan.badge && (
        <div style={{
          position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)',
          background: plan.popular ? GOLD : BG4,
          color: plan.popular ? '#050505' : 'rgba(255,255,255,0.6)',
          fontSize: 13, fontFamily: BARLOW, fontWeight: 700, letterSpacing: 2,
          padding: '4px 18px', borderRadius: 20, whiteSpace: 'nowrap' as const,
          textTransform: 'uppercase' as const,
          border: plan.popular ? 'none' : '1px solid rgba(255,255,255,0.1)',
          boxShadow: plan.popular ? '0 4px 16px rgba(212,166,74,0.3)' : 'none',
        }}>{plan.badge}</div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 12, flexShrink: 0,
          background: plan.popular ? 'rgba(212,166,74,0.1)' : 'rgba(200,32,42,0.08)',
          border: `1px solid ${plan.popular ? 'rgba(212,166,74,0.25)' : 'rgba(200,32,42,0.18)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <PlanIcon icon={plan.icon} size={22} color={plan.popular ? GOLD : RED} />
        </div>
        <div>
          <div style={{ fontFamily: BEBAS, fontSize: 28, letterSpacing: 2, color: plan.popular ? GOLD : '#fff', lineHeight: 1 }}>{plan.name}</div>
          <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.35)', fontFamily: BARLOW, marginTop: 2 }}>{plan.duration}</div>
        </div>
      </div>

      {/* Price */}
      <div style={{ marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
          <span style={{ fontSize: 18, color: 'rgba(255,255,255,0.35)', fontFamily: BARLOW }}>{sym}</span>
          <span style={{ fontFamily: BEBAS, fontSize: 62, color: '#fff', letterSpacing: 1, lineHeight: 1 }}>{dispPrice.toLocaleString(locale)}</span>
        </div>
        <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.3)', fontFamily: BARLOW }}>
          for {plan.duration} · ≈ {sym}{isUSD ? dispPpm.toFixed(2) : Math.round(dispPpm)}/mo
        </div>
      </div>
      <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.38)', fontFamily: BARLOW, lineHeight: 1.55, margin: '0 0 18px', fontStyle: 'italic' }}>{plan.tagline}</p>

      <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${plan.popular ? 'rgba(212,166,74,0.2)' : 'rgba(255,255,255,0.08)'}, transparent)`, margin: '0 0 18px' }} />

      {/* Features */}
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 9, marginBottom: 20, flex: 1 }}>
        {plan.features.map(f => (
          <div key={f.text} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{
              width: 17, height: 17, borderRadius: '50%', flexShrink: 0,
              background: f.included
                ? (plan.popular ? 'rgba(212,166,74,0.12)' : 'rgba(200,32,42,0.1)')
                : 'transparent',
              border: `1px solid ${f.included ? (plan.popular ? 'rgba(212,166,74,0.3)' : 'rgba(200,32,42,0.2)') : 'rgba(255,255,255,0.08)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {f.included
                ? <Check size={9} color={plan.popular ? GOLD : RED} strokeWidth={3} />
                : <X     size={9} color="rgba(255,255,255,0.15)" strokeWidth={2} />}
            </div>
            <span style={{ fontSize: 15, fontFamily: BARLOW, color: f.included ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.22)' }}>{f.text}</span>
          </div>
        ))}
      </div>


      {/* ── RINGSNROSES COMBO — only for eligible logged-in aspirants ── */}
      {isEligible && (
        <div style={{
          background: withCombo ? 'rgba(212,166,74,0.06)' : 'rgba(255,255,255,0.02)',
          border: `1px solid ${withCombo ? 'rgba(212,166,74,0.22)' : 'rgba(255,255,255,0.07)'}`,
          borderRadius: 8, padding: '12px 14px', marginBottom: 14, transition: 'all 0.2s',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div onClick={onToggleCombo} style={{
                width: 34, height: 19, borderRadius: 10, cursor: 'pointer', flexShrink: 0,
                background: withCombo ? GOLD : 'rgba(255,255,255,0.1)', position: 'relative', transition: 'background 0.2s',
              }}>
                <div style={{
                  position: 'absolute', top: 3, left: withCombo ? 18 : 3,
                  width: 13, height: 13, borderRadius: '50%',
                  background: '#fff', transition: 'left 0.2s',
                }} />
              </div>
              <div>
                <div style={{ fontSize: 15, fontFamily: BARLOW, fontWeight: 700, color: withCombo ? GOLD : 'rgba(255,255,255,0.45)', lineHeight: 1.1 }}>
                  + RingsNRoses Bronze
                </div>
                <div style={{ fontSize: 14, fontFamily: BARLOW, color: 'rgba(255,255,255,0.3)', lineHeight: 1.1 }}>
                  {rnrLabel} · Wedding vendor profile
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'right' as const, flexShrink: 0 }}>
              <div style={{ fontSize: 14, color: withCombo ? GOLD : 'rgba(255,255,255,0.3)', fontFamily: BARLOW, fontWeight: 700 }}>+{sym}{addon.toLocaleString(locale)}</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.25)', fontFamily: BARLOW }}>50% off</div>
            </div>
          </div>

          {withCombo && (
            <div style={{ marginTop: 12, background: 'rgba(0,0,0,0.25)', borderRadius: 6, padding: '10px 12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 5 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontFamily: BARLOW, color: 'rgba(255,255,255,0.45)' }}>
                  <span>SilverScreens ({plan.durationShort})</span>
                  <span>{sym}{dispPrice.toLocaleString(locale)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontFamily: BARLOW, color: 'rgba(255,255,255,0.45)' }}>
                  <span>RingsNRoses Bronze ({rnrLabel})</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ textDecoration: 'line-through', opacity: 0.4 }}>{sym}{rnrFull.toLocaleString(locale)}</span>
                    <span style={{ color: GOLD }}>{sym}{addon.toLocaleString(locale)}</span>
                  </div>
                </div>
                <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '3px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontFamily: BARLOW, fontWeight: 700, color: '#fff' }}>
                  <span>Total</span>
                  <span>{sym}{total.toLocaleString(locale)}</span>
                </div>
                <div style={{ fontSize: 14, color: GREEN, fontFamily: BARLOW, textAlign: 'right' as const }}>
                  {`You save ${sym}${saving.toLocaleString(locale)} on RingsNRoses`}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CTA */}
      {isGuest ? (
        <Link href="/signup" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: plan.popular ? GOLD : RED,
          color: plan.popular ? '#050505' : '#fff',
          textDecoration: 'none', borderRadius: 7, padding: '12px',
          fontSize: 18, fontFamily: BARLOW, fontWeight: 700, letterSpacing: 0.5,
        }}>Get Started</Link>
      ) : (
        <button onClick={() => onSelect(plan.id, withCombo)} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          background: plan.popular ? GOLD : RED,
          color: plan.popular ? '#050505' : '#fff',
          border: 'none', borderRadius: 7, padding: '12px',
          fontSize: 18, fontFamily: BARLOW, fontWeight: 700,
          letterSpacing: 0.5, cursor: 'pointer', width: '100%',
        }}>
          {withCombo ? <>Get Bundle <ExternalLink size={14} /></> : `Choose ${plan.name}`}
        </button>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, marginTop: 9 }}>
        <ShieldCheck size={11} color="rgba(255,255,255,0.2)" />
        <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.2)', fontFamily: BARLOW }}>Secure payment · Cancel anytime</span>
      </div>
    </div>
  )
}

/* ── AGENCY PLAN CARD ────────────────────────────────────────── */
function IntlAgencyCard({ plan, onSelect, isGuest, currency }: {
  plan: typeof AGENCY_PLANS[0]
  isGuest: boolean
  currency: 'INR' | 'USD'
  onSelect: (planId: string) => void
}) {
  const isUSD     = currency === 'USD'
  const dispPrice = isUSD ? ((plan as any).usdPrice ?? plan.price) : plan.price
  const dispPpm   = isUSD ? ((plan as any).usdPricePerMonth ?? plan.pricePerMonth) : plan.pricePerMonth
  const sym       = isUSD ? '$' : '₹'
  const locale    = isUSD ? 'en-US' : 'en-IN'
  return (
    <div style={{
      position: 'relative',
      background: plan.popular
        ? 'linear-gradient(180deg, #181208 0%, #121007 100%)'
        : 'linear-gradient(180deg, #0d1118 0%, #090c12 100%)',
      border: `1px solid ${plan.popular ? 'rgba(212,166,74,0.35)' : 'rgba(255,255,255,0.08)'}`,
      borderRadius: 14, padding: plan.popular ? '40px 26px 26px' : '30px 26px 26px',
      display: 'flex', flexDirection: 'column' as const,
      boxShadow: plan.popular ? '0 0 80px rgba(212,166,74,0.07), 0 20px 60px rgba(0,0,0,0.4)' : '0 10px 40px rgba(0,0,0,0.3)',
      transition: 'transform 0.25s, box-shadow 0.25s', flex: 1,
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-6px)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)' }}
    >
      {/* Top accent line */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, borderRadius: '14px 14px 0 0', background: plan.popular ? `linear-gradient(90deg, transparent, ${GOLD}, transparent)` : `linear-gradient(90deg, transparent, ${RED}, transparent)` }} />

      {plan.badge && (
        <div style={{
          position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)',
          background: plan.popular ? GOLD : BG4,
          color: plan.popular ? '#050505' : 'rgba(255,255,255,0.6)',
          fontSize: 13, fontFamily: BARLOW, fontWeight: 700, letterSpacing: 2,
          padding: '4px 18px', borderRadius: 20, whiteSpace: 'nowrap' as const,
          textTransform: 'uppercase' as const,
          border: plan.popular ? 'none' : '1px solid rgba(255,255,255,0.1)',
          boxShadow: plan.popular ? '0 4px 16px rgba(212,166,74,0.3)' : 'none',
        }}>{plan.badge}</div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 12, flexShrink: 0,
          background: plan.popular ? 'rgba(212,166,74,0.1)' : 'rgba(200,32,42,0.08)',
          border: `1px solid ${plan.popular ? 'rgba(212,166,74,0.25)' : 'rgba(200,32,42,0.18)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <PlanIcon icon={plan.icon} size={22} color={plan.popular ? GOLD : RED} />
        </div>
        <div>
          <div style={{ fontFamily: BEBAS, fontSize: 28, letterSpacing: 2, color: plan.popular ? GOLD : '#fff', lineHeight: 1 }}>{plan.name}</div>
          <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.35)', fontFamily: BARLOW, marginTop: 2 }}>{plan.duration}</div>
        </div>
      </div>

      <div style={{ marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
          <span style={{ fontSize: 18, color: 'rgba(255,255,255,0.35)', fontFamily: BARLOW }}>{sym}</span>
          <span style={{ fontFamily: BEBAS, fontSize: 62, color: '#fff', letterSpacing: 1, lineHeight: 1 }}>{dispPrice.toLocaleString(locale)}</span>
        </div>
        <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.3)', fontFamily: BARLOW }}>
          for {plan.duration} · ≈ {sym}{isUSD ? dispPpm.toFixed(2) : Math.round(dispPpm).toLocaleString(locale)}/mo
        </div>
      </div>
      <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.38)', fontFamily: BARLOW, lineHeight: 1.55, margin: '0 0 18px', fontStyle: 'italic' }}>{plan.tagline}</p>
      <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${plan.popular ? 'rgba(212,166,74,0.2)' : 'rgba(255,255,255,0.08)'}, transparent)`, margin: '0 0 18px' }} />

      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 9, marginBottom: 20, flex: 1 }}>
        {plan.features.map(f => (
          <div key={f.text} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{
              width: 17, height: 17, borderRadius: '50%', flexShrink: 0,
              background: f.included ? (plan.popular ? 'rgba(212,166,74,0.12)' : 'rgba(200,32,42,0.1)') : 'transparent',
              border: `1px solid ${f.included ? (plan.popular ? 'rgba(212,166,74,0.3)' : 'rgba(200,32,42,0.2)') : 'rgba(255,255,255,0.08)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {f.included
                ? <Check size={9} color={plan.popular ? GOLD : RED} strokeWidth={3} />
                : <X     size={9} color="rgba(255,255,255,0.15)" strokeWidth={2} />}
            </div>
            <span style={{ fontSize: 15, fontFamily: BARLOW, color: f.included ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.22)' }}>{f.text}</span>
          </div>
        ))}
      </div>

      {isGuest ? (
        <Link href="/signup?for=agency" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: plan.popular ? GOLD : RED,
          color: plan.popular ? '#050505' : '#fff',
          textDecoration: 'none', borderRadius: 7, padding: '12px',
          fontSize: 18, fontFamily: BARLOW, fontWeight: 700,
        }}>Get Started</Link>
      ) : (
        <button onClick={() => onSelect(plan.id)} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: plan.popular ? GOLD : RED,
          color: plan.popular ? '#050505' : '#fff',
          border: 'none', borderRadius: 7, padding: '12px',
          fontSize: 18, fontFamily: BARLOW, fontWeight: 700,
          letterSpacing: 0.5, cursor: 'pointer', width: '100%',
        }}>Choose {plan.name}</button>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, marginTop: 9 }}>
        <ShieldCheck size={11} color="rgba(255,255,255,0.2)" />
        <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.2)', fontFamily: BARLOW }}>Secure payment · Cancel anytime</span>
      </div>
    </div>
  )
}

/* ── INNER PAGE ──────────────────────────────────────────────── */
function PricingIntlInner() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const forParam     = searchParams.get('for')

  const [tab, setTab] = useState<'aspirants' | 'agencies'>(forParam === 'agency' ? 'agencies' : 'aspirants')

  const user       = useAuth()
  const isGuest    = !user.loggedIn
  const categoryParam = searchParams.get('category') || ''
  const isEligible = !!categoryParam && COMBO_CONFIG.eligibleCategories.includes(categoryParam)

  // Read admin-configured plans from localStorage if available
  const [aspirantPlans, setAspirantPlans] = useState(ASPIRANT_PLANS)
  const [agencyPlans,   setAgencyPlans]   = useState(AGENCY_PLANS)

  useEffect(() => {
    try {
      // Redirect India users back to INR pricing
      const u = JSON.parse(localStorage.getItem('ss_user') || '{}')
      if (u?.country && u.country.toLowerCase() === 'india') {
        router.replace('/pricing')
        return
      }
      const raw = localStorage.getItem('ss_pricing_config')
      if (raw) {
        const cfg = JSON.parse(raw)
        if (cfg.aspirantPlans?.length) setAspirantPlans(cfg.aspirantPlans.filter((p: any) => p.active !== false))
        if (cfg.agencyPlans?.length)   setAgencyPlans(cfg.agencyPlans.filter((p: any) => p.active !== false))
      }
    } catch {}
  }, [])

  // Per-plan combo toggles — default OFF (aspirant chooses to add)
  const [combos, setCombos] = useState<Record<string, boolean>>({ spotlight: false, star: false, icon: false })
  const toggleCombo = (id: string) => setCombos(prev => ({ ...prev, [id]: !prev[id] }))

  const handleAspirantSelect = (planId: string, withCombo: boolean) => {
    // Route to payment page per PRD: Choose Plan → Payment Page
    router.push(`/payment?plan=${planId}${withCombo ? '&combo=true' : ''}`)
  }

  const handleAgencySelect = (planId: string) => {
    router.push(`/payment?plan=${planId}&type=agency`)
  }

  return (
    <div style={{ background: BG, minHeight: '100vh', fontFamily: BARLOW, color: '#F5F5F5' }}>

      {/* ── CINEMATIC HERO ── */}
      <div style={{ position: 'relative', overflow: 'hidden', minHeight: 420, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src="https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?w=1600&q=80" alt="" aria-hidden="true"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
        {/* Layered overlays */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(5,5,5,0.55) 0%, rgba(5,5,5,0.75) 60%, #050505 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(200,32,42,0.1) 0%, transparent 65%)' }} />
        {/* Horizontal film-scan line */}
        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(200,32,42,0.35) 25%, rgba(200,32,42,0.35) 75%, transparent)' }} />
        {/* Sprocket holes — left strip */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 28, background: 'rgba(0,0,0,0.5)', borderRight: '0.5px solid rgba(212,166,74,0.12)' }}>
          <svg width="28" height="100%" viewBox="0 0 28 600" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            {Array.from({ length: 24 }).map((_, i) => <rect key={i} x="6" y={12 + i * 26} width="16" height="11" rx="2" fill="rgba(212,166,74,0.3)" />)}
          </svg>
        </div>
        {/* Sprocket holes — right strip */}
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 28, background: 'rgba(0,0,0,0.5)', borderLeft: '0.5px solid rgba(212,166,74,0.12)' }}>
          <svg width="28" height="100%" viewBox="0 0 28 600" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            {Array.from({ length: 24 }).map((_, i) => <rect key={i} x="6" y={12 + i * 26} width="16" height="11" rx="2" fill="rgba(212,166,74,0.3)" />)}
          </svg>
        </div>

        {/* Hero content */}
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' as const, padding: '100px 80px 60px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: 20 }}>
            <div style={{ width: 56, height: 1, background: 'linear-gradient(to right, transparent, #C8202A)' }} />
            <span style={{ fontFamily: BARLOW, fontSize: 13, letterSpacing: 5, color: RED, textTransform: 'uppercase' as const, fontWeight: 700 }}>Choose Your Plan</span>
            <div style={{ width: 56, height: 1, background: 'linear-gradient(to left, transparent, #C8202A)' }} />
          </div>
          <h1 style={{ fontFamily: BEBAS, fontSize: 'clamp(52px, 7vw, 88px)', letterSpacing: 6, color: '#F5F5F5', marginBottom: 16, lineHeight: 0.9, textShadow: '0 0 80px rgba(200,32,42,0.25)' }}>
            INTERNATIONAL<br /><span style={{ color: RED }}>PRICING</span>
          </h1>
          <p style={{ fontFamily: BARLOW, fontSize: 19, color: 'rgba(255,255,255,0.5)', fontStyle: 'italic', letterSpacing: 0.3, marginBottom: 12 }}>
            All prices in USD. One platform. Endless opportunity worldwide.
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(212,166,74,0.08)', border: '1px solid rgba(212,166,74,0.2)', borderRadius: 20, padding: '6px 16px', fontSize: 14, fontFamily: BARLOW, color: GOLD, cursor: 'default' }}>
            🌍 International Pricing (USD)&nbsp;·&nbsp;
            <span onClick={() => router.push('/pricing')} style={{ color: 'rgba(255,255,255,0.5)', cursor: 'pointer', textDecoration: 'underline' }}>Switch to India Pricing (₹)</span>
          </div>

          {/* Film dots */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 24 }}>
            {[RED, 'rgba(212,166,74,0.6)', 'rgba(255,255,255,0.2)'].map((c, i) => (
              <div key={i} style={{ width: i === 0 ? 28 : 6, height: 4, borderRadius: 2, background: c }} />
            ))}
          </div>
        </div>
      </div>

      {/* ── CINEMATIC TAB TOGGLE ── */}
      <div style={{ background: '#0a0a0a', borderTop: '0.5px solid rgba(255,255,255,0.06)', borderBottom: '0.5px solid rgba(255,255,255,0.06)', padding: '0', display: 'flex', justifyContent: 'center', alignItems: 'stretch', height: 64 }}>
        {/* Left decoration */}
        <div style={{ flex: 1, background: 'repeating-linear-gradient(135deg,#111 0,#111 8px,#0a0a0a 8px,#0a0a0a 16px)', borderRight: '0.5px solid rgba(212,166,74,0.15)', maxWidth: 80 }} />
        {/* Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '8px 20px' }}>
          {(['aspirants', 'agencies'] as const).map((t, i) => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '10px 40px', border: 'none', borderRadius: 6, cursor: 'pointer',
              background: tab === t ? RED : 'transparent',
              color: tab === t ? '#F5F5F5' : 'rgba(255,255,255,0.4)',
              fontFamily: BEBAS, fontSize: 20, letterSpacing: 2,
              display: 'flex', alignItems: 'center', gap: 10, transition: 'all 0.2s',
              boxShadow: tab === t ? '0 4px 20px rgba(200,32,42,0.3)' : 'none',
            }}>
              <span>{t === 'aspirants' ? '🎭' : '🏢'}</span>
              {t === 'aspirants' ? 'FOR ASPIRANTS' : 'FOR AGENCIES'}
            </button>
          ))}
        </div>
        {/* Right decoration */}
        <div style={{ flex: 1, background: 'repeating-linear-gradient(135deg,#111 0,#111 8px,#0a0a0a 8px,#0a0a0a 16px)', borderLeft: '0.5px solid rgba(212,166,74,0.15)', maxWidth: 80 }} />
      </div>

      {/* ── PLAN CARDS ── */}
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '40px 32px 56px' }}>
        <div style={{ position: 'relative' as const, background: 'linear-gradient(180deg, #0d1018 0%, #080b10 100%)', border: '0.5px solid rgba(255,255,255,0.07)', borderRadius: 18, padding: '36px', overflow: 'hidden' }}>

          {/* BG watermark */}
          <div style={{ position: 'absolute' as const, right: -20, top: '50%', transform: 'translateY(-50%) rotate(90deg)', fontFamily: BEBAS, fontSize: 160, color: 'rgba(255,255,255,0.015)', letterSpacing: 8, pointerEvents: 'none' as const, userSelect: 'none' as const, whiteSpace: 'nowrap' as const, lineHeight: 1 }}>
            {tab === 'aspirants' ? 'TALENT' : 'AGENCY'}
          </div>
          {/* Red accent line top */}
          <div style={{ position: 'absolute' as const, top: 0, left: 32, right: 32, height: 2, background: `linear-gradient(90deg, transparent, ${RED}, transparent)`, borderRadius: 1 }} />

          {/* Section header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
            <div style={{ width: 50, height: 50, borderRadius: '50%', background: 'rgba(200,32,42,0.1)', border: '1px solid rgba(200,32,42,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
              {tab === 'aspirants' ? '🎭' : '🏢'}
            </div>
            <div>
              <div style={{ fontSize: 11, letterSpacing: 4, color: RED, textTransform: 'uppercase' as const, marginBottom: 4 }}>SELECT A PLAN</div>
              <h2 style={{ fontFamily: BEBAS, fontSize: 34, letterSpacing: 2, color: '#F5F5F5', margin: 0, lineHeight: 1 }}>
                {tab === 'aspirants' ? 'ASPIRANT PLANS' : 'AGENCY PLANS'}
              </h2>
              <p style={{ fontFamily: BARLOW, fontSize: 15, color: 'rgba(255,255,255,0.35)', margin: 0 }}>
                {tab === 'aspirants'
                  ? 'Showcase your talent. Get discovered. Build your journey.'
                  : 'Find the best talent. Build incredible projects.'}
              </p>
            </div>
          </div>

          {/* Cards grid */}
          <div style={{ display: 'flex', gap: 20, alignItems: 'start' }}>
            {tab === 'aspirants'
              ? aspirantPlans.map(plan => (
                <IntlAspirantCard
                  key={plan.id} plan={plan}
                  isGuest={isGuest} isEligible={isEligible}
                  withCombo={combos[plan.id] ?? false}
                  onToggleCombo={() => toggleCombo(plan.id)}
                  onSelect={handleAspirantSelect}
                  currency='USD'
                />
              ))
              : agencyPlans.map(plan => (
                <IntlAgencyCard key={plan.id} plan={plan} isGuest={isGuest} onSelect={handleAgencySelect} currency='USD' />
              ))
            }
          </div>

          {/* Footer note */}
          <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px', background: 'rgba(255,255,255,0.02)', border: '0.5px solid rgba(255,255,255,0.07)', borderRadius: 8 }}>
            <span style={{ fontSize: 16, flexShrink: 0 }}>ℹ️</span>
            <span style={{ fontFamily: BARLOW, fontSize: 15, color: 'rgba(255,255,255,0.4)' }}>
              {tab === 'aspirants'
                ? 'Upgrade or renew your plan anytime. RingsNRoses bundle available for eligible categories only.'
                : <>Need a custom plan? <Link href="/contact" style={{ color: RED, fontWeight: 700, textDecoration: 'none' }}>Contact our sales team →</Link></>
              }
            </span>
          </div>
        </div>
      </div>

      {/* ── CINEMATIC TRUST BAR ── */}
      <div style={{ position: 'relative' as const, background: '#080b10', borderTop: '0.5px solid rgba(255,255,255,0.07)', borderBottom: '0.5px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}>
        {/* Red scan-line accent */}
        <div style={{ position: 'absolute' as const, top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${RED}, transparent)` }} />
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 40px', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 0 }}>
          {[
            { icon: '🔒', title: 'SECURE PAYMENTS',    desc: 'Razorpay-powered encrypted checkout'       },
            { icon: '↩️', title: '7-DAY REFUND',        desc: 'Full refund if no applications submitted'  },
            { icon: '⚡', title: 'INSTANT ACTIVATION',  desc: 'Profile goes live when payment clears'     },
            { icon: '🎬', title: '10,000+ ROLES',       desc: 'Access casting calls across all of India'  },
          ].map((item, i) => (
            <div key={item.title} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '0 28px', borderRight: i < 3 ? '0.5px solid rgba(255,255,255,0.07)' : 'none' }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', flexShrink: 0, background: 'rgba(200,32,42,0.08)', border: '1px solid rgba(200,32,42,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{item.icon}</div>
              <div>
                <div style={{ fontFamily: BEBAS, fontSize: 18, letterSpacing: 2, color: '#F5F5F5', marginBottom: 4 }}>{item.title}</div>
                <div style={{ fontFamily: BARLOW, fontSize: 15, color: 'rgba(255,255,255,0.35)', lineHeight: 1.4 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

/* ── PAGE EXPORT ─────────────────────────────────────────────── */
export default function PricingInternationalPage() {
  return (
    <Suspense fallback={<div style={{ background: '#050505', minHeight: '100vh' }} />}>
      <PricingIntlInner />
    </Suspense>
  )
}