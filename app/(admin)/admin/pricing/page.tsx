'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Plus, Trash2, Pencil, Check, X, ChevronDown,
  Save, RotateCcw, Eye, EyeOff, Crown, Star,
  Zap, Building, TrendingUp, Layers, AlertCircle,
} from 'lucide-react'

/* ── Tokens ── */
const RED    = '#C8202A'
const GOLD   = '#D4A64A'
const GREEN  = '#22C55E'
const BG     = '#050505'
const BG2    = '#0B0F14'
const BG3    = '#121821'
const BG4    = '#1C2030'
const BARLOW = "'Barlow Condensed', sans-serif"
const BEBAS  = "'Bebas Neue', sans-serif"

const LS_KEY = 'ss_pricing_config'

/* ── Types ── */
interface PlanFeature { text: string; included: boolean }
interface Plan {
  id: string; name: string; icon: string;
  duration: string; durationShort: string; months: number;
  price: number; pricePerMonth: number;
  usdPrice: number; usdPricePerMonth: number;
  tagline: string; popular: boolean; badge: string | null;
  active: boolean;
  features: PlanFeature[];
}
interface PricingConfig {
  aspirantPlans: Plan[]
  agencyPlans: Plan[]
  rnrPrices: { spotlight: number; star: number; icon: number; usdSpotlight: number; usdStar: number; usdIcon: number }
  updatedAt: string
}

/* ── Default config (matches pricing page) ── */
const DEFAULT_CONFIG: PricingConfig = {
  aspirantPlans: [
    {
      id: 'spotlight', name: 'Spotlight', icon: 'zap',
      duration: '3 Months', durationShort: '3 mo', months: 3,
      price: 299, pricePerMonth: 99.67, usdPrice: 3, usdPricePerMonth: 1, popular: false, badge: null, active: true,
      tagline: 'Get started and explore your first casting opportunities.',
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
      price: 499, pricePerMonth: 83.17, usdPrice: 5, usdPricePerMonth: 0.83, popular: true, badge: 'Most Popular', active: true,
      tagline: 'The most popular choice for working professionals.',
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
      price: 999, pricePerMonth: 83.25, usdPrice: 10, usdPricePerMonth: 0.83, popular: false, badge: 'Best Value', active: true,
      tagline: 'Maximum visibility for serious industry professionals.',
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
  ],
  agencyPlans: [
    {
      id: 'starter', name: 'Starter', icon: 'building',
      duration: '3 Months', durationShort: '3 mo', months: 3,
      price: 5999, pricePerMonth: 1999.67, usdPrice: 63, usdPricePerMonth: 21, popular: false, badge: null, active: true,
      tagline: 'For small teams and independent casting directors.',
      features: [
        { text: 'Post up to 5 casting calls',    included: true  },
        { text: 'Basic talent search & filters', included: true  },
        { text: 'Up to 3 team members',          included: true  },
        { text: 'Manage & track applications',   included: true  },
        { text: 'Email support',                 included: true  },
        { text: 'Advanced search filters',       included: false },
        { text: 'Up to 10 team members',         included: false },
        { text: 'Analytics dashboard',           included: false },
        { text: 'Unlimited casting calls',       included: false },
        { text: 'Dedicated account manager',     included: false },
      ],
    },
    {
      id: 'growth', name: 'Growth', icon: 'trending',
      duration: '6 Months', durationShort: '6 mo', months: 6,
      price: 24999, pricePerMonth: 4166.5, usdPrice: 263, usdPricePerMonth: 43.83, popular: true, badge: 'Most Popular', active: true,
      tagline: 'For growing production houses with ongoing hiring.',
      features: [
        { text: 'Post up to 5 casting calls',    included: true  },
        { text: 'Basic talent search & filters', included: true  },
        { text: 'Up to 3 team members',          included: true  },
        { text: 'Manage & track applications',   included: true  },
        { text: 'Email support',                 included: true  },
        { text: 'Advanced search filters',       included: true  },
        { text: 'Up to 10 team members',         included: true  },
        { text: 'Analytics dashboard',           included: true  },
        { text: 'Unlimited casting calls',       included: false },
        { text: 'Dedicated account manager',     included: false },
      ],
    },
    {
      id: 'enterprise', name: 'Enterprise', icon: 'layers',
      duration: '12 Months', durationShort: '12 mo', months: 12,
      price: 99999, pricePerMonth: 8333.25, usdPrice: 1050, usdPricePerMonth: 87.50, popular: false, badge: 'Best Value', active: true,
      tagline: 'For large studios and organisations at scale.',
      features: [
        { text: 'Post up to 5 casting calls',    included: true },
        { text: 'Basic talent search & filters', included: true },
        { text: 'Up to 3 team members',          included: true },
        { text: 'Manage & track applications',   included: true },
        { text: 'Email support',                 included: true },
        { text: 'Advanced search filters',       included: true },
        { text: 'Up to 10 team members',         included: true },
        { text: 'Analytics dashboard',           included: true },
        { text: 'Unlimited casting calls',       included: true },
        { text: 'Dedicated account manager',     included: true },
      ],
    },
  ],
  rnrPrices: { spotlight: 149, star: 250, icon: 500, usdSpotlight: 2, usdStar: 3, usdIcon: 5 },
  updatedAt: '',
}

/* ── Icon map ── */
function PlanIconComp({ icon, size = 18, color = GOLD }: { icon: string; size?: number; color?: string }) {
  const map: Record<string, React.ReactNode> = {
    zap:      <Zap size={size} color={color} />,
    star:     <Star size={size} color={color} />,
    crown:    <Crown size={size} color={color} />,
    building: <Building size={size} color={color} />,
    trending: <TrendingUp size={size} color={color} />,
    layers:   <Layers size={size} color={color} />,
  }
  return <>{map[icon] ?? <Star size={size} color={color} />}</>
}

/* ── Shared input style ── */
const inp: React.CSSProperties = {
  background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7,
  padding: '9px 12px', color: '#fff', fontSize: 15, fontFamily: BARLOW,
  outline: 'none', width: '100%', boxSizing: 'border-box',
}

/* ── Plan Editor Modal ── */
function PlanEditor({
  plan, onSave, onClose,
}: {
  plan: Plan
  onSave: (p: Plan) => void
  onClose: () => void
}) {
  const [draft, setDraft] = useState<Plan>(JSON.parse(JSON.stringify(plan)))
  const upd = (k: keyof Plan, v: any) => setDraft(p => ({ ...p, [k]: v }))
  const toggleFeature = (i: number) =>
    setDraft(p => ({ ...p, features: p.features.map((f, idx) => idx === i ? { ...f, included: !f.included } : f) }))
  const updateFeatureText = (i: number, text: string) =>
    setDraft(p => ({ ...p, features: p.features.map((f, idx) => idx === i ? { ...f, text } : f) }))
  const addFeature = () =>
    setDraft(p => ({ ...p, features: [...p.features, { text: 'New feature', included: true }] }))
  const removeFeature = (i: number) =>
    setDraft(p => ({ ...p, features: p.features.filter((_, idx) => idx !== i) }))

  // Auto-calc pricePerMonth when price or months changes
  const recalcPpm = (price: number, months: number) =>
    setDraft(p => ({ ...p, price, months, pricePerMonth: parseFloat((price / months).toFixed(2)) }))

  // Auto-calc usdPricePerMonth when usdPrice changes
  const recalcUsdPpm = (usdPrice: number) =>
    setDraft(p => ({ ...p, usdPrice, usdPricePerMonth: parseFloat((usdPrice / p.months).toFixed(2)) }))

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '24px 16px', overflowY: 'auto', backdropFilter: 'blur(4px)' }}>
      <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 28, width: '100%', maxWidth: 640, marginBottom: 24 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div style={{ fontFamily: BEBAS, fontSize: 24, letterSpacing: 1.5, color: '#fff' }}>Edit — {plan.name} Plan</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 20 }}>✕</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Basic Info */}
          <div style={{ background: BG3, borderRadius: 10, padding: 18 }}>
            <div style={{ fontSize: 14, fontFamily: BARLOW, fontWeight: 700, color: RED, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 14 }}>Basic Info</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, marginBottom: 5 }}>Plan Name</div>
                <input value={draft.name} onChange={e => upd('name', e.target.value)} style={inp} />
              </div>
              <div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, marginBottom: 5 }}>Tagline</div>
                <input value={draft.tagline} onChange={e => upd('tagline', e.target.value)} style={inp} />
              </div>
              <div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, marginBottom: 5 }}>Duration Label</div>
                <input value={draft.duration} onChange={e => upd('duration', e.target.value)} style={inp} placeholder="e.g. 6 Months" />
              </div>
              <div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, marginBottom: 5 }}>Badge (optional)</div>
                <input value={draft.badge || ''} onChange={e => upd('badge', e.target.value || null)} style={inp} placeholder="e.g. Most Popular" />
              </div>
            </div>
          </div>

          {/* INR Pricing */}
          <div style={{ background: BG3, borderRadius: 10, padding: 18 }}>
            <div style={{ fontSize: 14, fontFamily: BARLOW, fontWeight: 700, color: RED, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 14 }}>🇮🇳 India Pricing (INR)</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, marginBottom: 5 }}>Total Price (₹)</div>
                <input type="number" step="0.01" value={draft.price} onChange={e => recalcPpm(Number(e.target.value), draft.months)} style={inp} />
              </div>
              <div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, marginBottom: 5 }}>Duration (months)</div>
                <input type="number" step="1" value={draft.months} onChange={e => recalcPpm(draft.price, Number(e.target.value))} style={inp} />
              </div>
              <div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, marginBottom: 5 }}>Per Month (auto)</div>
                <input value={`₹${draft.pricePerMonth.toFixed(2)}`} readOnly style={{ ...inp, opacity: 0.5, cursor: 'not-allowed' }} />
              </div>
            </div>
          </div>

          {/* USD Pricing */}
          <div style={{ background: BG3, borderRadius: 10, padding: 18, border: '1px solid rgba(212,166,74,0.15)' }}>
            <div style={{ fontSize: 14, fontFamily: BARLOW, fontWeight: 700, color: GOLD, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>🌍 International Pricing (USD)</div>
            <div style={{ fontSize: 13, fontFamily: BARLOW, color: 'rgba(255,255,255,0.35)', marginBottom: 14 }}>Shown on /pricing-international for non-India users</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, marginBottom: 5 }}>Total Price ($)</div>
                <div style={{ position: 'relative' as const }}>
                  <span style={{ position: 'absolute' as const, left: 12, top: '50%', transform: 'translateY(-50%)', color: GOLD, fontFamily: BARLOW, fontWeight: 700 }}>$</span>
                  <input type="number" step="0.01" value={draft.usdPrice ?? 0} onChange={e => recalcUsdPpm(Number(e.target.value))}
                    style={{ ...inp, paddingLeft: 24, color: GOLD }} />
                </div>
              </div>
              <div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, marginBottom: 5 }}>Per Month (auto)</div>
                <input value={`$${(draft.usdPricePerMonth ?? 0).toFixed(2)}`} readOnly style={{ ...inp, opacity: 0.5, cursor: 'not-allowed', color: GOLD }} />
              </div>
            </div>
          </div>

          {/* Toggles */}
          <div style={{ background: BG3, borderRadius: 10, padding: 18 }}>
            <div style={{ fontSize: 14, fontFamily: BARLOW, fontWeight: 700, color: RED, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 14 }}>Settings</div>
            <div style={{ display: 'flex', gap: 32 }}>
              {[
                { label: 'Mark as Popular', key: 'popular' as const },
                { label: 'Active / Visible', key: 'active' as const },
              ].map(({ label, key }) => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => upd(key, !draft[key])}>
                  <div style={{ width: 42, height: 24, borderRadius: 12, background: draft[key] ? RED : 'rgba(255,255,255,0.12)', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
                    <div style={{ position: 'absolute', top: 3, left: draft[key] ? 21 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
                  </div>
                  <span style={{ fontSize: 15, fontFamily: BARLOW, color: draft[key] ? '#fff' : 'rgba(255,255,255,0.45)' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div style={{ background: BG3, borderRadius: 10, padding: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ fontSize: 14, fontFamily: BARLOW, fontWeight: 700, color: RED, letterSpacing: 1, textTransform: 'uppercase' }}>Features</div>
              <button onClick={addFeature} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(200,32,42,0.1)', border: '1px solid rgba(200,32,42,0.25)', borderRadius: 6, padding: '5px 12px', color: RED, fontSize: 14, fontFamily: BARLOW, cursor: 'pointer' }}>
                <Plus size={13} /> Add Feature
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {draft.features.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {/* included toggle */}
                  <div onClick={() => toggleFeature(i)} style={{ width: 22, height: 22, borderRadius: 6, background: f.included ? GREEN : 'rgba(255,255,255,0.05)', border: `1.5px solid ${f.included ? GREEN : 'rgba(255,255,255,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                    {f.included && <Check size={13} color="#000" strokeWidth={3} />}
                  </div>
                  <input value={f.text} onChange={e => updateFeatureText(i, e.target.value)} style={{ ...inp, flex: 1, padding: '7px 10px', fontSize: 14 }} />
                  <button onClick={() => removeFeature(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', flexShrink: 0, padding: 4 }}
                    onMouseEnter={e => (e.currentTarget.style.color = RED)}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
                  ><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
          <button onClick={onClose} style={{ flex: 1, background: BG4, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 12, fontSize: 15, fontFamily: BARLOW, fontWeight: 700, color: '#fff', cursor: 'pointer' }}>Cancel</button>
          <button onClick={() => onSave(draft)} style={{ flex: 2, background: RED, border: 'none', borderRadius: 8, padding: 12, fontSize: 15, fontFamily: BARLOW, fontWeight: 700, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Save size={15} /> Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Plan Card ── */
function PlanCard({ plan, onEdit, onToggle }: { plan: Plan; onEdit: () => void; onToggle: () => void }) {
  return (
    <div style={{ background: BG2, border: `1px solid ${plan.popular ? GOLD+'40' : 'rgba(255,255,255,0.07)'}`, borderRadius: 12, padding: 20, position: 'relative', opacity: plan.active ? 1 : 0.5 }}>
      {plan.badge && (
        <div style={{ position: 'absolute', top: -10, left: 20, background: plan.popular ? GOLD : BG3, color: plan.popular ? '#000' : '#fff', fontSize: 12, fontFamily: BARLOW, fontWeight: 700, padding: '2px 10px', borderRadius: 10 }}>{plan.badge}</div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(212,166,74,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <PlanIconComp icon={plan.icon} size={18} />
          </div>
          <div>
            <div style={{ fontFamily: BEBAS, fontSize: 20, letterSpacing: 1, color: '#fff' }}>{plan.name}</div>
            <div style={{ fontSize: 13, fontFamily: BARLOW, color: 'rgba(255,255,255,0.4)' }}>{plan.duration}</div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: BEBAS, fontSize: 26, color: GOLD }}>₹{plan.price.toLocaleString('en-IN')}</div>
          <div style={{ fontSize: 13, fontFamily: BARLOW, color: 'rgba(255,255,255,0.4)' }}>≈ ₹{Math.round(plan.pricePerMonth)}/mo</div>
        </div>
      </div>

      <div style={{ fontSize: 14, fontFamily: BARLOW, color: 'rgba(255,255,255,0.5)', marginBottom: 14, lineHeight: 1.5 }}>{plan.tagline}</div>

      {/* Feature summary */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 16 }}>
        {plan.features.map((f, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 16, height: 16, borderRadius: 4, background: f.included ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.05)', border: `1px solid ${f.included ? GREEN : 'rgba(255,255,255,0.1)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {f.included ? <Check size={10} color={GREEN} strokeWidth={3} /> : <X size={10} color="rgba(255,255,255,0.2)" />}
            </div>
            <span style={{ fontSize: 13, fontFamily: BARLOW, color: f.included ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.3)', textDecoration: f.included ? 'none' : 'line-through' }}>{f.text}</span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={onEdit} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, padding: '8px 0', color: '#fff', fontSize: 14, fontFamily: BARLOW, fontWeight: 700, cursor: 'pointer' }}>
          <Pencil size={13} /> Edit
        </button>
        <button onClick={onToggle} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: plan.active ? 'rgba(34,197,94,0.08)' : 'rgba(200,32,42,0.08)', border: `1px solid ${plan.active ? 'rgba(34,197,94,0.25)' : 'rgba(200,32,42,0.25)'}`, borderRadius: 7, padding: '8px 0', color: plan.active ? GREEN : RED, fontSize: 14, fontFamily: BARLOW, fontWeight: 700, cursor: 'pointer' }}>
          {plan.active ? <><Eye size={13} /> Active</> : <><EyeOff size={13} /> Hidden</>}
        </button>
      </div>
    </div>
  )
}

/* ══ MAIN PAGE ══ */
export default function AdminPricingPage() {
  const router = useRouter()
  const [config, setConfig] = useState<PricingConfig>(DEFAULT_CONFIG)
  const [tab, setTab] = useState<'aspirant' | 'agency' | 'rnr'>('aspirant')
  const [editing, setEditing] = useState<{ type: 'aspirant' | 'agency'; idx: number } | null>(null)
  const [saved, setSaved] = useState(false)
  const [rnrDraft, setRnrDraft] = useState({ spotlight: 149, star: 250, icon: 500, usdSpotlight: 2, usdStar: 3, usdIcon: 5 })

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        setConfig(parsed)
        setRnrDraft(parsed.rnrPrices)
      }
    } catch {}
  }, [])

  const saveConfig = (updated: PricingConfig) => {
    const final = { ...updated, updatedAt: new Date().toISOString() }
    localStorage.setItem(LS_KEY, JSON.stringify(final))
    setConfig(final)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleSavePlan = (type: 'aspirant' | 'agency', idx: number, plan: Plan) => {
    const key = type === 'aspirant' ? 'aspirantPlans' : 'agencyPlans'
    const plans = [...config[key]]
    plans[idx] = plan
    saveConfig({ ...config, [key]: plans })
    setEditing(null)
  }

  const togglePlan = (type: 'aspirant' | 'agency', idx: number) => {
    const key = type === 'aspirant' ? 'aspirantPlans' : 'agencyPlans'
    const plans = [...config[key]]
    plans[idx] = { ...plans[idx], active: !plans[idx].active }
    saveConfig({ ...config, [key]: plans })
  }

  const resetToDefaults = () => {
    localStorage.removeItem(LS_KEY)
    setConfig(DEFAULT_CONFIG)
    setRnrDraft(DEFAULT_CONFIG.rnrPrices)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const saveRnr = () => {
    saveConfig({ ...config, rnrPrices: rnrDraft })
  }

  const editingPlan = editing
    ? (editing.type === 'aspirant' ? config.aspirantPlans : config.agencyPlans)[editing.idx]
    : null

  return (
    <div style={{ minHeight: '100vh', background: BG, fontFamily: BARLOW, color: '#F5F5F5' }}>

      {/* Edit modal */}
      {editing && editingPlan && (
        <PlanEditor
          plan={editingPlan}
          onSave={p => handleSavePlan(editing.type, editing.idx, p)}
          onClose={() => setEditing(null)}
        />
      )}

      {/* Topnav */}
      <header style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '0 28px', height: 60, background: BG2, borderBottom: '1px solid rgba(255,255,255,0.07)', position: 'sticky', top: 0, zIndex: 50 }}>
        <button onClick={() => router.back()} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: 15, fontFamily: BARLOW, cursor: 'pointer', padding: 0 }}
          onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
        >← Back</button>
        <div style={{ fontFamily: BEBAS, fontSize: 22, letterSpacing: 2 }}>PRICING <span style={{ color: RED }}>MANAGEMENT</span></div>
        <div style={{ flex: 1 }} />
        {saved && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 15, fontFamily: BARLOW, color: GREEN, fontWeight: 700 }}>
            <Check size={15} /> Saved successfully
          </div>
        )}
        <button onClick={resetToDefaults} style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: '8px 16px', color: 'rgba(255,255,255,0.6)', fontSize: 15, fontFamily: BARLOW, cursor: 'pointer' }}>
          <RotateCcw size={14} /> Reset to Defaults
        </button>
      </header>

      <div style={{ padding: '24px 28px 48px', maxWidth: 1200, margin: '0 auto' }}>

        {/* Info banner */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', background: 'rgba(212,166,74,0.07)', border: '1px solid rgba(212,166,74,0.2)', borderRadius: 10, marginBottom: 24 }}>
          <AlertCircle size={16} color={GOLD} />
          <span style={{ fontSize: 15, fontFamily: BARLOW, color: 'rgba(255,255,255,0.6)' }}>
            Changes are saved to your browser. To make them permanent, update the matching constants in <code style={{ color: GOLD, background: 'rgba(212,166,74,0.1)', padding: '1px 6px', borderRadius: 4 }}>app/(public)/pricing/page.tsx</code> after testing here.
          </span>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: BG2, borderRadius: 10, padding: 4, width: 'fit-content', border: '1px solid rgba(255,255,255,0.07)' }}>
          {[
            { key: 'aspirant', label: 'Aspirant Plans' },
            { key: 'agency',   label: 'Agency Plans'   },
            { key: 'rnr',      label: 'RingsNRoses Addon' },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key as any)}
              style={{ padding: '8px 20px', borderRadius: 7, border: 'none', cursor: 'pointer', fontFamily: BARLOW, fontSize: 15, fontWeight: 700, background: tab === t.key ? RED : 'transparent', color: tab === t.key ? '#fff' : 'rgba(255,255,255,0.45)', transition: 'all 0.15s' }}
            >{t.label}</button>
          ))}
        </div>

        {/* Aspirant Plans */}
        {tab === 'aspirant' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <div style={{ fontFamily: BEBAS, fontSize: 24, letterSpacing: 1 }}>Aspirant Plans</div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW }}>
                  {config.aspirantPlans.filter(p => p.active).length} of {config.aspirantPlans.length} plans active
                </div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
              {config.aspirantPlans.map((plan, idx) => (
                <PlanCard key={plan.id} plan={plan}
                  onEdit={() => setEditing({ type: 'aspirant', idx })}
                  onToggle={() => togglePlan('aspirant', idx)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Agency Plans */}
        {tab === 'agency' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <div style={{ fontFamily: BEBAS, fontSize: 24, letterSpacing: 1 }}>Agency Plans</div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW }}>
                  {config.agencyPlans.filter(p => p.active).length} of {config.agencyPlans.length} plans active
                </div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
              {config.agencyPlans.map((plan, idx) => (
                <PlanCard key={plan.id} plan={plan}
                  onEdit={() => setEditing({ type: 'agency', idx })}
                  onToggle={() => togglePlan('agency', idx)}
                />
              ))}
            </div>
          </div>
        )}

        {/* RingsNRoses Addon Prices */}
        {tab === 'rnr' && (
          <div>
            <div style={{ fontFamily: BEBAS, fontSize: 24, letterSpacing: 1, marginBottom: 6 }}>RingsNRoses Addon Prices</div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, marginBottom: 24 }}>
              These are the discounted addon prices shown on the pricing page when an eligible aspirant (Hair Stylist, Dancer, Singer etc.) selects a plan.
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 24 }}>
              {(['spotlight', 'star', 'icon'] as const).map(planId => (
                <div key={planId} style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                    <PlanIconComp icon={planId === 'spotlight' ? 'zap' : planId === 'star' ? 'star' : 'crown'} size={18} />
                    <div style={{ fontFamily: BEBAS, fontSize: 18, letterSpacing: 1, color: '#fff', textTransform: 'capitalize' }}>{planId} Plan Add-on</div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, marginBottom: 6 }}>🇮🇳 INR Addon Price (₹)</div>
                      <input type="number" step="0.01" value={rnrDraft[planId]} onChange={e => setRnrDraft(p => ({ ...p, [planId]: Number(e.target.value) }))}
                        style={{ ...inp, fontSize: 20, fontFamily: BEBAS, letterSpacing: 1, color: GOLD }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, marginBottom: 6 }}>🌍 USD Addon Price ($)</div>
                      <input type="number" step="0.01"
                        value={rnrDraft[`usd${planId.charAt(0).toUpperCase()}${planId.slice(1)}` as keyof typeof rnrDraft] ?? 0}
                        onChange={e => setRnrDraft(p => ({ ...p, [`usd${planId.charAt(0).toUpperCase()}${planId.slice(1)}`]: Number(e.target.value) }))}
                        style={{ ...inp, fontSize: 20, fontFamily: BEBAS, letterSpacing: 1, color: GOLD }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={saveRnr} style={{ display: 'flex', alignItems: 'center', gap: 8, background: RED, border: 'none', borderRadius: 8, padding: '11px 28px', color: '#fff', fontSize: 15, fontFamily: BARLOW, fontWeight: 700, cursor: 'pointer' }}>
              <Save size={15} /> Save RingsNRoses Prices
            </button>
          </div>
        )}

        {/* Last updated */}
        {config.updatedAt && (
          <div style={{ marginTop: 32, fontSize: 14, fontFamily: BARLOW, color: 'rgba(255,255,255,0.25)', textAlign: 'center' }}>
            Last updated: {new Date(config.updatedAt).toLocaleString('en-IN')}
          </div>
        )}
      </div>
    </div>
  )
}