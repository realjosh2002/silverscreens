'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Plus, Trash2, Pencil, Check, X,
  Save, RotateCcw, Eye, EyeOff, Crown, Star,
  Zap, Building, TrendingUp, Layers, AlertCircle,
  ChevronRight, Tag,
} from 'lucide-react'
import AdminTopnav from '@/components/layout/AdminTopnav'
import AdminSidebar from '@/components/layout/AdminSidebar'

const BG    = '#0D1117'
const BG2   = '#131720'
const BG3   = '#181E2A'
const BG4   = '#1C2338'
const RED   = '#EF4444'
const GOLD  = '#D4A64A'
const GREEN = '#22C55E'
const BLUE  = '#3B82F6'
const PURPLE= '#8B5CF6'
const ORANGE= '#F97316'
const BARLOW = "'Barlow Condensed', sans-serif"
const BEBAS  = "'Bebas Neue', sans-serif"
const LS_KEY = 'ss_pricing_config'

interface PlanFeature { text: string; included: boolean }
interface Plan {
  id: string; name: string; icon: string;
  duration: string; durationShort: string; months: number;
  price: number; pricePerMonth: number;
  usdPrice: number; usdPricePerMonth: number;
  tagline: string; popular: boolean; badge: string | null;
  active: boolean; features: PlanFeature[];
}
interface PricingConfig {
  aspirantPlans: Plan[]; agencyPlans: Plan[];
  rnrPrices: { spotlight: number; star: number; icon: number; usdSpotlight: number; usdStar: number; usdIcon: number };
  updatedAt: string;
}

const DEFAULT_CONFIG: PricingConfig = {
  aspirantPlans: [
    { id:'spotlight', name:'Spotlight', icon:'zap', duration:'3 Months', durationShort:'3 mo', months:3, price:299, pricePerMonth:99.67, usdPrice:3, usdPricePerMonth:1, popular:false, badge:null, active:true, tagline:'Get started and explore your first casting opportunities.', features:[{text:'Full profile with photos & showreel',included:true},{text:'Apply to casting calls',included:true},{text:'Browse all talent listings',included:true},{text:'Direct messaging with studios',included:true},{text:'Profile analytics dashboard',included:true},{text:'SilverScreens verified badge',included:true},{text:'Priority listing in search',included:false},{text:'Featured profile placement',included:false},{text:'Direct casting invites',included:false},{text:'Dedicated account manager',included:false}] },
    { id:'star', name:'Star', icon:'star', duration:'6 Months', durationShort:'6 mo', months:6, price:499, pricePerMonth:83.17, usdPrice:5, usdPricePerMonth:0.83, popular:true, badge:'Most Popular', active:true, tagline:'The most popular choice for working professionals.', features:[{text:'Full profile with photos & showreel',included:true},{text:'Apply to casting calls',included:true},{text:'Browse all talent listings',included:true},{text:'Direct messaging with studios',included:true},{text:'Profile analytics dashboard',included:true},{text:'SilverScreens verified badge',included:true},{text:'Priority listing in search',included:true},{text:'Featured profile placement',included:true},{text:'Direct casting invites',included:false},{text:'Dedicated account manager',included:false}] },
    { id:'icon', name:'Icon', icon:'crown', duration:'12 Months', durationShort:'12 mo', months:12, price:999, pricePerMonth:83.25, usdPrice:10, usdPricePerMonth:0.83, popular:false, badge:'Best Value', active:true, tagline:'Maximum visibility for serious industry professionals.', features:[{text:'Full profile with photos & showreel',included:true},{text:'Apply to casting calls',included:true},{text:'Browse all talent listings',included:true},{text:'Direct messaging with studios',included:true},{text:'Profile analytics dashboard',included:true},{text:'SilverScreens verified badge',included:true},{text:'Priority listing in search',included:true},{text:'Featured profile placement',included:true},{text:'Direct casting invites',included:true},{text:'Dedicated account manager',included:true}] },
  ],
  agencyPlans: [
    { id:'starter', name:'Starter', icon:'building', duration:'3 Months', durationShort:'3 mo', months:3, price:5999, pricePerMonth:1999.67, usdPrice:63, usdPricePerMonth:21, popular:false, badge:null, active:true, tagline:'For small teams and independent casting directors.', features:[{text:'Post up to 5 casting calls',included:true},{text:'Basic talent search & filters',included:true},{text:'Up to 3 team members',included:true},{text:'Manage & track applications',included:true},{text:'Email support',included:true},{text:'Advanced search filters',included:false},{text:'Up to 10 team members',included:false},{text:'Analytics dashboard',included:false},{text:'Unlimited casting calls',included:false},{text:'Dedicated account manager',included:false}] },
    { id:'growth', name:'Growth', icon:'trending', duration:'6 Months', durationShort:'6 mo', months:6, price:24999, pricePerMonth:4166.5, usdPrice:263, usdPricePerMonth:43.83, popular:true, badge:'Most Popular', active:true, tagline:'For growing production houses with ongoing hiring.', features:[{text:'Post up to 5 casting calls',included:true},{text:'Basic talent search & filters',included:true},{text:'Up to 3 team members',included:true},{text:'Manage & track applications',included:true},{text:'Email support',included:true},{text:'Advanced search filters',included:true},{text:'Up to 10 team members',included:true},{text:'Analytics dashboard',included:true},{text:'Unlimited casting calls',included:false},{text:'Dedicated account manager',included:false}] },
    { id:'enterprise', name:'Enterprise', icon:'layers', duration:'12 Months', durationShort:'12 mo', months:12, price:99999, pricePerMonth:8333.25, usdPrice:1050, usdPricePerMonth:87.50, popular:false, badge:'Best Value', active:true, tagline:'For large studios and organisations at scale.', features:[{text:'Post up to 5 casting calls',included:true},{text:'Basic talent search & filters',included:true},{text:'Up to 3 team members',included:true},{text:'Manage & track applications',included:true},{text:'Email support',included:true},{text:'Advanced search filters',included:true},{text:'Up to 10 team members',included:true},{text:'Analytics dashboard',included:true},{text:'Unlimited casting calls',included:true},{text:'Dedicated account manager',included:true}] },
  ],
  rnrPrices: { spotlight:149, star:250, icon:500, usdSpotlight:2, usdStar:3, usdIcon:5 },
  updatedAt: '',
}

function PlanIcon({ icon, size=18, color=GOLD }: { icon:string; size?:number; color?:string }) {
  const map: Record<string,React.ReactNode> = { zap:<Zap size={size} color={color}/>, star:<Star size={size} color={color}/>, crown:<Crown size={size} color={color}/>, building:<Building size={size} color={color}/>, trending:<TrendingUp size={size} color={color}/>, layers:<Layers size={size} color={color}/> }
  return <>{map[icon]??<Star size={size} color={color}/>}</>
}

const inp: React.CSSProperties = { background:BG4, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, padding:'9px 12px', color:'#fff', fontSize:15, fontFamily:BARLOW, outline:'none', width:'100%', boxSizing:'border-box' }

function PlanCard({ plan, onEdit, onToggle }: { plan:Plan; onEdit:()=>void; onToggle:()=>void }) {
  return (
    <div style={{ background:BG3, border:`1px solid ${plan.popular?GOLD+'44':'rgba(255,255,255,0.07)'}`, borderRadius:14, padding:20, position:'relative', opacity:plan.active?1:0.55, transition:'opacity 0.2s' }}>
      {plan.badge&&<div style={{ position:'absolute', top:-12, left:'50%', transform:'translateX(-50%)', background:plan.badge==='Most Popular'?RED:GOLD, color:'#fff', fontSize:12, fontWeight:700, fontFamily:BARLOW, padding:'3px 14px', borderRadius:20, whiteSpace:'nowrap' as const }}>{plan.badge}</div>}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:36, height:36, borderRadius:9, background:`${GOLD}18`, display:'flex', alignItems:'center', justifyContent:'center' }}><PlanIcon icon={plan.icon} size={18}/></div>
          <div>
            <div style={{ fontFamily:BEBAS, fontSize:20, letterSpacing:1 }}>{plan.name}</div>
            <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', fontFamily:BARLOW }}>{plan.duration}</div>
          </div>
        </div>
        <div style={{ textAlign:'right' as const }}>
          <div style={{ fontFamily:BEBAS, fontSize:24, letterSpacing:1, color:GOLD }}>₹{plan.price.toLocaleString('en-IN')}</div>
          <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)' }}>≈ ₹{Math.round(plan.pricePerMonth)}/mo</div>
        </div>
      </div>
      <div style={{ fontSize:14, color:'rgba(255,255,255,0.5)', marginBottom:14, lineHeight:1.5 }}>{plan.tagline}</div>
      <div style={{ display:'flex', flexDirection:'column', gap:7, marginBottom:16 }}>
        {plan.features.map((f,i)=>(
          <div key={i} style={{ display:'flex', alignItems:'center', gap:8 }}>
            {f.included?<Check size={14} color={GREEN}/>:<X size={14} color="rgba(255,255,255,0.2)"/>}
            <span style={{ fontSize:14, color:f.included?'rgba(255,255,255,0.8)':'rgba(255,255,255,0.3)', textDecoration:f.included?'none':'line-through' }}>{f.text}</span>
          </div>
        ))}
      </div>
      <div style={{ display:'flex', gap:8 }}>
        <button onClick={onEdit} style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:6, padding:'9px 0', background:`rgba(212,166,74,0.1)`, border:'1px solid rgba(212,166,74,0.25)', borderRadius:8, color:GOLD, fontSize:15, fontFamily:BARLOW, fontWeight:700, cursor:'pointer' }}><Pencil size={13}/>Edit</button>
        <button onClick={onToggle} style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:6, padding:'9px 0', background:plan.active?'rgba(34,197,94,0.1)':'rgba(239,68,68,0.1)', border:`1px solid ${plan.active?'rgba(34,197,94,0.25)':'rgba(239,68,68,0.25)'}`, borderRadius:8, color:plan.active?GREEN:RED, fontSize:15, fontFamily:BARLOW, fontWeight:700, cursor:'pointer' }}>{plan.active?<><Eye size={13}/>Active</>:<><EyeOff size={13}/>Inactive</>}</button>
      </div>
    </div>
  )
}

function PlanEditor({ plan, onSave, onClose }: { plan:Plan; onSave:(p:Plan)=>void; onClose:()=>void }) {
  const [d, setD] = useState<Plan>(JSON.parse(JSON.stringify(plan)))
  const upd = (k:keyof Plan,v:any) => setD(p=>({...p,[k]:v}))
  const toggleF = (i:number) => setD(p=>({...p,features:p.features.map((f,idx)=>idx===i?{...f,included:!f.included}:f)}))
  const updateFText = (i:number,text:string) => setD(p=>({...p,features:p.features.map((f,idx)=>idx===i?{...f,text}:f)}))
  const addF = () => setD(p=>({...p,features:[...p.features,{text:'New feature',included:true}]}))
  const removeF = (i:number) => setD(p=>({...p,features:p.features.filter((_,idx)=>idx!==i)}))
  const recalcPpm = (price:number,months:number) => setD(p=>({...p,price,months,pricePerMonth:parseFloat((price/months).toFixed(2))}))
  const recalcUsdPpm = (usdPrice:number) => setD(p=>({...p,usdPrice,usdPricePerMonth:parseFloat((usdPrice/p.months).toFixed(2))}))

  return (
    <div style={{ position:'fixed', inset:0, zIndex:1000, background:'rgba(0,0,0,0.85)', display:'flex', alignItems:'flex-start', justifyContent:'center', padding:'24px 16px', overflowY:'auto', backdropFilter:'blur(4px)' }}>
      <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.1)', borderRadius:16, padding:28, width:'100%', maxWidth:640, marginBottom:24 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
          <div style={{ fontFamily:BEBAS, fontSize:24, letterSpacing:1.5 }}>Edit — {plan.name} Plan</div>
          <button onClick={onClose} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.4)', cursor:'pointer', fontSize:20 }}>✕</button>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div style={{ background:BG3, borderRadius:10, padding:18 }}>
            <div style={{ fontSize:14, fontWeight:700, color:RED, letterSpacing:1, textTransform:'uppercase', marginBottom:14 }}>Basic Info</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              {[{l:'Plan Name',v:d.name,k:'name'},{l:'Tagline',v:d.tagline,k:'tagline'},{l:'Duration Label',v:d.duration,k:'duration'},{l:'Short Label',v:d.durationShort,k:'durationShort'}].map(f=>(
                <div key={f.k}><div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', marginBottom:5 }}>{f.l}</div><input value={f.v} onChange={e=>upd(f.k as keyof Plan,e.target.value)} style={inp}/></div>
              ))}
            </div>
          </div>
          <div style={{ background:BG3, borderRadius:10, padding:18 }}>
            <div style={{ fontSize:14, fontWeight:700, color:RED, letterSpacing:1, textTransform:'uppercase', marginBottom:14 }}>Pricing</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:12 }}>
              <div><div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', marginBottom:5 }}>Months</div><input type="number" value={d.months} onChange={e=>recalcPpm(d.price,Number(e.target.value))} style={inp} min={1}/></div>
              <div><div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', marginBottom:5 }}>🇮🇳 INR (₹)</div><input type="number" value={d.price} onChange={e=>recalcPpm(Number(e.target.value),d.months)} style={{...inp,color:GOLD,fontFamily:BEBAS,fontSize:18}}/></div>
              <div><div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', marginBottom:5 }}>₹/mo (auto)</div><input type="number" value={d.pricePerMonth} readOnly style={{...inp,color:'rgba(255,255,255,0.4)',fontFamily:BEBAS,fontSize:18}}/></div>
              <div><div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', marginBottom:5 }}>🌍 USD ($)</div><input type="number" value={d.usdPrice} onChange={e=>recalcUsdPpm(Number(e.target.value))} style={{...inp,color:GOLD,fontFamily:BEBAS,fontSize:18}}/></div>
            </div>
          </div>
          <div style={{ background:BG3, borderRadius:10, padding:18 }}>
            <div style={{ fontSize:14, fontWeight:700, color:RED, letterSpacing:1, textTransform:'uppercase', marginBottom:14 }}>Badge & Visibility</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12 }}>
              <div><div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', marginBottom:5 }}>Badge Label</div><input value={d.badge??''} onChange={e=>upd('badge',e.target.value||null)} placeholder="Most Popular" style={inp}/></div>
              {[{l:'Popular',k:'popular',v:d.popular},{l:'Active',k:'active',v:d.active}].map(f=>(
                <div key={f.k}><div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', marginBottom:5 }}>{f.l}</div>
                <button onClick={()=>upd(f.k as keyof Plan,!f.v)} style={{ width:'100%', padding:'9px 12px', background:f.v?'rgba(34,197,94,0.12)':BG4, border:`1px solid ${f.v?'rgba(34,197,94,0.3)':'rgba(255,255,255,0.1)'}`, borderRadius:7, color:f.v?GREEN:'rgba(255,255,255,0.4)', fontFamily:BARLOW, fontSize:15, cursor:'pointer', display:'flex', alignItems:'center', gap:7 }}>
                  {f.v?<Check size={14}/>:<X size={14}/>}{f.v?'Yes':'No'}
                </button></div>
              ))}
            </div>
          </div>
          <div style={{ background:BG3, borderRadius:10, padding:18 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
              <div style={{ fontSize:14, fontWeight:700, color:RED, letterSpacing:1, textTransform:'uppercase' }}>Features</div>
              <button onClick={addF} style={{ display:'flex', alignItems:'center', gap:5, padding:'5px 12px', background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.25)', borderRadius:6, color:RED, fontSize:14, cursor:'pointer' }}><Plus size={13}/>Add</button>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {d.features.map((f,i)=>(
                <div key={i} style={{ display:'flex', gap:8, alignItems:'center' }}>
                  <button onClick={()=>toggleF(i)} style={{ width:30, height:30, borderRadius:7, background:f.included?'rgba(34,197,94,0.12)':'rgba(239,68,68,0.1)', border:`1px solid ${f.included?'rgba(34,197,94,0.3)':'rgba(239,68,68,0.25)'}`, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', flexShrink:0 }}>
                    {f.included?<Check size={13} color={GREEN}/>:<X size={13} color={RED}/>}
                  </button>
                  <input value={f.text} onChange={e=>updateFText(i,e.target.value)} style={{...inp,flex:1,opacity:f.included?1:0.5}}/>
                  <button onClick={()=>removeF(i)} style={{ width:30, height:30, borderRadius:7, background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', flexShrink:0 }}><Trash2 size={13} color={RED}/></button>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <button onClick={onClose} style={{ flex:1, padding:12, background:BG4, border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, color:'rgba(255,255,255,0.6)', fontFamily:BARLOW, fontSize:15, cursor:'pointer' }}>Cancel</button>
            <button onClick={()=>onSave(d)} style={{ flex:2, display:'flex', alignItems:'center', justifyContent:'center', gap:7, padding:12, background:RED, border:'none', borderRadius:8, color:'#fff', fontFamily:BEBAS, fontSize:20, letterSpacing:1, cursor:'pointer' }}><Save size={15}/>Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AdminPricingPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [tab,     setTab]     = useState<'aspirant'|'agency'|'rnr'>('aspirant')
  const [config,  setConfig]  = useState<PricingConfig>(DEFAULT_CONFIG)
  const [editing, setEditing] = useState<{type:'aspirant'|'agency';idx:number}|null>(null)
  const [saved,   setSaved]   = useState(false)
  const [rnrDraft,setRnrDraft]= useState(DEFAULT_CONFIG.rnrPrices)

  useEffect(()=>{
    try { const raw=localStorage.getItem(LS_KEY); if(raw){const p=JSON.parse(raw);setConfig(p);setRnrDraft(p.rnrPrices)} } catch {}
  },[])

  const persist = (next:PricingConfig) => {
    const updated={...next,updatedAt:new Date().toISOString()}
    setConfig(updated); localStorage.setItem(LS_KEY,JSON.stringify(updated))
    setSaved(true); setTimeout(()=>setSaved(false),2500)
  }

  const handleSavePlan = (type:'aspirant'|'agency', idx:number, plan:Plan) => {
    const next={...config}
    if(type==='aspirant') next.aspirantPlans=next.aspirantPlans.map((p,i)=>i===idx?plan:p)
    else next.agencyPlans=next.agencyPlans.map((p,i)=>i===idx?plan:p)
    persist(next); setEditing(null)
  }

  const togglePlan = (type:'aspirant'|'agency', idx:number) => {
    const next={...config}
    if(type==='aspirant') next.aspirantPlans=next.aspirantPlans.map((p,i)=>i===idx?{...p,active:!p.active}:p)
    else next.agencyPlans=next.agencyPlans.map((p,i)=>i===idx?{...p,active:!p.active}:p)
    persist(next)
  }

  const addPlan = (type: 'aspirant' | 'agency') => {
    const newPlan: Plan = {
      id: `plan_${Date.now()}`,
      name: 'New Plan', icon: 'star',
      duration: '3 Months', durationShort: '3 mo', months: 3,
      price: 0, pricePerMonth: 0, usdPrice: 0, usdPricePerMonth: 0,
      tagline: 'Describe this plan.', popular: false, badge: null, active: true,
      features: [
        { text: 'Feature 1', included: true },
        { text: 'Feature 2', included: true },
        { text: 'Feature 3', included: false },
      ]
    }
    const next = { ...config }
    if (type === 'aspirant') {
      next.aspirantPlans = [...next.aspirantPlans, newPlan]
      persist(next)
      setEditing({ type: 'aspirant', idx: next.aspirantPlans.length - 1 })
    } else {
      next.agencyPlans = [...next.agencyPlans, newPlan]
      persist(next)
      setEditing({ type: 'agency', idx: next.agencyPlans.length - 1 })
    }
  }

  const deletePlan = (type: 'aspirant' | 'agency', idx: number) => {
    if (!confirm('Delete this plan?')) return
    const next = { ...config }
    if (type === 'aspirant') next.aspirantPlans = next.aspirantPlans.filter((_, i) => i !== idx)
    else next.agencyPlans = next.agencyPlans.filter((_, i) => i !== idx)
    persist(next)
  }

  const resetToDefaults = () => {
    if(!confirm('Reset all pricing to defaults?')) return
    localStorage.removeItem(LS_KEY); setConfig(DEFAULT_CONFIG); setRnrDraft(DEFAULT_CONFIG.rnrPrices)
    setSaved(true); setTimeout(()=>setSaved(false),2500)
  }

  const editingPlan = editing ? (editing.type==='aspirant'?config.aspirantPlans[editing.idx]:config.agencyPlans[editing.idx]) : null
  const totalActive = config.aspirantPlans.filter(p=>p.active).length + config.agencyPlans.filter(p=>p.active).length

  const STATS=[
    {label:'Total Plans',    value:(config.aspirantPlans.length+config.agencyPlans.length).toString(), color:PURPLE, icon:'📋'},
    {label:'Active Plans',   value:totalActive.toString(),                                             color:GREEN,  icon:'✅'},
    {label:'Aspirant Plans', value:config.aspirantPlans.length.toString(),                            color:BLUE,   icon:'🎭'},
    {label:'Agency Plans',   value:config.agencyPlans.length.toString(),                              color:ORANGE, icon:'🏢'},
    {label:'Lowest Price',   value:`₹${Math.min(...config.aspirantPlans.map(p=>p.price)).toLocaleString('en-IN')}`, color:GOLD, icon:'💰'},
  ]

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh', overflow:'hidden', background:BG, fontFamily:BARLOW, color:'#F5F5F5' }}>
      <AdminTopnav/>
      <div style={{ display:'flex', flex:1, overflow:'hidden' }}>
        <AdminSidebar onCollapse={c=>setSidebarOpen(!c)}/>

        <div style={{ flex:1, overflowY:'auto', padding:'20px 24px 40px', display:'flex', flexDirection:'column', gap:16 }}>

          {/* Page header */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:14, color:'rgba(255,255,255,0.4)', marginBottom:6 }}>
                <span style={{ cursor:'pointer' }} onClick={()=>router.push('/admin/dashboard')}>Home</span>
                <ChevronRight size={12}/>
                <span style={{ color:'#F5F5F5' }}>Pricing Management</span>
              </div>
              <h1 style={{ fontFamily:BEBAS, fontSize:28, fontWeight:400, margin:0, letterSpacing:1, display:'flex', alignItems:'center', gap:8 }}>
                <Tag size={22} color={RED}/>Pricing Management
                <span style={{ width:7, height:7, borderRadius:'50%', background:RED, display:'inline-block' }}/>
              </h1>
              <p style={{ fontSize:15, color:'rgba(255,255,255,0.45)', margin:'4px 0 0' }}>Manage subscription plans, pricing and features for aspirants and agencies.</p>
            </div>
            <div style={{ display:'flex', gap:10, alignItems:'center', marginTop:28, flexShrink:0 }}>
              {saved&&<div style={{ display:'flex', alignItems:'center', gap:6, fontSize:15, color:GREEN, fontWeight:700 }}><Check size={15}/>Saved</div>}
              <button onClick={resetToDefaults} style={{ display:'flex', alignItems:'center', gap:7, padding:'9px 14px', background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, color:'rgba(255,255,255,0.6)', fontFamily:BARLOW, fontSize:15, cursor:'pointer' }}><RotateCcw size={14}/>Reset to Defaults</button>
            </div>
          </div>

          {/* Stat cards */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:12 }}>
            {STATS.map((s,i)=>(
              <div key={i} style={{ borderRadius:12, padding:16, background:BG3, border:'1px solid rgba(255,255,255,0.06)', display:'flex', gap:14, alignItems:'center' }}>
                <div style={{ width:44, height:44, borderRadius:'50%', background:`${s.color}22`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>{s.icon}</div>
                <div>
                  <div style={{ fontSize:14, color:'rgba(255,255,255,0.5)', marginBottom:3 }}>{s.label}</div>
                  <div style={{ fontFamily:BEBAS, fontSize:28, letterSpacing:1, lineHeight:1, color:s.color }}>{s.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Info banner */}
          <div style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 18px', background:'rgba(212,166,74,0.07)', border:'1px solid rgba(212,166,74,0.2)', borderRadius:10 }}>
            <AlertCircle size={16} color={GOLD}/>
            <span style={{ fontSize:15, color:'rgba(255,255,255,0.6)' }}>
              Changes are saved to your browser. To make them permanent, update constants in{' '}
              <code style={{ color:GOLD, background:'rgba(212,166,74,0.1)', padding:'1px 6px', borderRadius:4 }}>app/(public)/pricing/page.tsx</code>
            </span>
          </div>

          {/* Tabs */}
          <div style={{ display:'flex', gap:0, borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
            {[{key:'aspirant',label:'Aspirant Plans',count:config.aspirantPlans.length},{key:'agency',label:'Agency Plans',count:config.agencyPlans.length},{key:'rnr',label:'RingsNRoses Addon',count:null}].map(t=>(
              <button key={t.key} onClick={()=>setTab(t.key as any)} style={{ padding:'10px 20px', background:'none', border:'none', borderBottom:tab===t.key?`2px solid ${RED}`:'2px solid transparent', color:tab===t.key?'#F5F5F5':'rgba(255,255,255,0.45)', fontFamily:BARLOW, fontSize:15, fontWeight:tab===t.key?700:400, cursor:'pointer', marginBottom:-1, display:'flex', alignItems:'center', gap:7 }}>
                {t.label}{t.count!==null&&<span style={{ fontSize:13, background:tab===t.key?'rgba(239,68,68,0.15)':'rgba(255,255,255,0.07)', color:tab===t.key?RED:'rgba(255,255,255,0.4)', borderRadius:10, padding:'0 7px' }}>{t.count}</span>}
              </button>
            ))}
          </div>

          {/* Aspirant Plans */}
          {tab==='aspirant'&&(
            <div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
                <div>
                  <div style={{ fontFamily:BEBAS, fontSize:20, letterSpacing:1 }}>Aspirant Plans</div>
                  <div style={{ fontSize:14, color:'rgba(255,255,255,0.4)' }}>{config.aspirantPlans.filter(p=>p.active).length} of {config.aspirantPlans.length} plans active</div>
                </div>
                <button onClick={()=>addPlan('aspirant')} style={{ display:'flex', alignItems:'center', gap:6, padding:'9px 16px', background:'rgba(200,32,42,0.1)', border:'1px solid rgba(200,32,42,0.3)', borderRadius:8, color:RED, fontFamily:BARLOW, fontSize:15, fontWeight:700, cursor:'pointer' }}><Plus size={14}/>Add Plan</button>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20 }}>
                {config.aspirantPlans.map((plan,idx)=>(
                  <div key={plan.id} style={{ position:'relative' }}>
                    <PlanCard plan={plan} onEdit={()=>setEditing({type:'aspirant',idx})} onToggle={()=>togglePlan('aspirant',idx)}/>
                    <button onClick={()=>deletePlan('aspirant',idx)} style={{ position:'absolute', top:10, right:10, background:'rgba(239,68,68,0.15)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:6, padding:'4px 8px', color:RED, cursor:'pointer', fontSize:12, fontFamily:BARLOW }}><Trash2 size={11}/></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Agency Plans */}
          {tab==='agency'&&(
            <div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
                <div>
                  <div style={{ fontFamily:BEBAS, fontSize:20, letterSpacing:1 }}>Agency Plans</div>
                  <div style={{ fontSize:14, color:'rgba(255,255,255,0.4)' }}>{config.agencyPlans.filter(p=>p.active).length} of {config.agencyPlans.length} plans active</div>
                </div>
                <button onClick={()=>addPlan('agency')} style={{ display:'flex', alignItems:'center', gap:6, padding:'9px 16px', background:'rgba(200,32,42,0.1)', border:'1px solid rgba(200,32,42,0.3)', borderRadius:8, color:RED, fontFamily:BARLOW, fontSize:15, fontWeight:700, cursor:'pointer' }}><Plus size={14}/>Add Plan</button>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20 }}>
                {config.agencyPlans.map((plan,idx)=>(
                  <div key={plan.id} style={{ position:'relative' }}>
                    <PlanCard plan={plan} onEdit={()=>setEditing({type:'agency',idx})} onToggle={()=>togglePlan('agency',idx)}/>
                    <button onClick={()=>deletePlan('agency',idx)} style={{ position:'absolute', top:10, right:10, background:'rgba(239,68,68,0.15)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:6, padding:'4px 8px', color:RED, cursor:'pointer', fontSize:12, fontFamily:BARLOW }}><Trash2 size={11}/></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* RingsNRoses */}
          {tab==='rnr'&&(
            <div>
              <div style={{ fontFamily:BEBAS, fontSize:20, letterSpacing:1, marginBottom:4 }}>RingsNRoses Addon Prices</div>
              <div style={{ fontSize:14, color:'rgba(255,255,255,0.4)', marginBottom:20 }}>Discounted addon prices for eligible aspirants (Hair Stylists, Dancers, Singers etc.)</div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20, marginBottom:20 }}>
                {(['spotlight','star','icon'] as const).map(planId=>(
                  <div key={planId} style={{ background:BG3, border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:20 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
                      <PlanIcon icon={planId==='spotlight'?'zap':planId==='star'?'star':'crown'} size={18}/>
                      <div style={{ fontFamily:BEBAS, fontSize:18, letterSpacing:1, textTransform:'capitalize' }}>{planId} Addon</div>
                    </div>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                      <div>
                        <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', marginBottom:6 }}>🇮🇳 INR (₹)</div>
                        <input type="number" step="0.01" value={rnrDraft[planId]} onChange={e=>setRnrDraft(p=>({...p,[planId]:Number(e.target.value)}))} style={{...inp,fontSize:20,fontFamily:BEBAS,letterSpacing:1,color:GOLD}}/>
                      </div>
                      <div>
                        <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', marginBottom:6 }}>🌍 USD ($)</div>
                        <input type="number" step="0.01" value={rnrDraft[`usd${planId.charAt(0).toUpperCase()}${planId.slice(1)}` as keyof typeof rnrDraft]??0} onChange={e=>setRnrDraft(p=>({...p,[`usd${planId.charAt(0).toUpperCase()}${planId.slice(1)}`]:Number(e.target.value)}))} style={{...inp,fontSize:20,fontFamily:BEBAS,letterSpacing:1,color:GOLD}}/>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={()=>{persist({...config,rnrPrices:rnrDraft})}} style={{ display:'flex', alignItems:'center', gap:8, background:RED, border:'none', borderRadius:8, padding:'11px 28px', color:'#fff', fontSize:15, fontFamily:BARLOW, fontWeight:700, cursor:'pointer' }}><Save size={15}/>Save RingsNRoses Prices</button>
            </div>
          )}

          {config.updatedAt&&<div style={{ fontSize:14, color:'rgba(255,255,255,0.25)', textAlign:'center' as const }}>Last updated: {new Date(config.updatedAt).toLocaleString('en-IN')}</div>}
        </div>
      </div>

      {editingPlan&&editing&&<PlanEditor plan={editingPlan} onSave={p=>handleSavePlan(editing.type,editing.idx,p)} onClose={()=>setEditing(null)}/>}
    </div>
  )
}