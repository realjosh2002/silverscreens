'use client'

export const dynamic = 'force-dynamic'
import AdminSidebar from '@/components/layout/AdminSidebar'
import AdminTopnav from '@/components/layout/AdminTopnav'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  ChevronRight, RefreshCw, Download, TrendingUp,
  Users, Building2, Megaphone, CreditCard,
  CheckCircle, Clock, BarChart2,
} from 'lucide-react'

/* ─── Tokens ── */
const BG    = '#050505'
const BG2   = '#0B0F14'
const BG3   = '#121821'
const BG4   = 'rgba(255,255,255,0.03)'
const GOLD  = '#D4A64A'
const BEBAS = "'Bebas Neue', sans-serif"
const BARLOW= "'Barlow Condensed', sans-serif"
const GREEN = '#22C55E'
const RED   = '#C8202A'
const BLUE  = '#3B82F6'
const PURPLE= '#8B5CF6'
const ORANGE= '#F97316'
const TEAL  = '#14B8A6'

/* ─── Auth ── */
function getToken() {
  try { return JSON.parse(localStorage.getItem('ss_user')||sessionStorage.getItem('ss_user')||'{}').token||'' }
  catch { return '' }
}

/* ─── Stat types ── */
interface Stats {
  totalUsers:number; aspirants:number; agencies:number; activeUsers:number
  newRegistrations:number; emailVerified:number
  aspApproved:number; aspPending:number; agcApproved:number; agcPending:number
  totalCastings:number; activeCastings:number; draftCastings:number; closedCastings:number
  totalApplications:number; applicationsToday:number; shortlisted:number; rejected:number
  totalAuditions:number; auditionsToday:number; messagesToday:number
  totalRevenue:number; aspirantRevenue:number; agencyRevenue:number; activeSubscriptions:number
}

const EMPTY_STATS: Stats = {
  totalUsers:0,aspirants:0,agencies:0,activeUsers:0,newRegistrations:0,emailVerified:0,
  aspApproved:0,aspPending:0,agcApproved:0,agcPending:0,
  totalCastings:0,activeCastings:0,draftCastings:0,closedCastings:0,
  totalApplications:0,applicationsToday:0,shortlisted:0,rejected:0,
  totalAuditions:0,auditionsToday:0,messagesToday:0,
  totalRevenue:0,aspirantRevenue:0,agencyRevenue:0,activeSubscriptions:0,
}

/* ─── Chart components ── */
function LineChart({ datasets, labels, h=120 }: {
  datasets: {data:number[];color:string;label:string}[]
  labels: string[]
  h?: number
}) {
  const W = 560
  const pad = {t:14, b:28, l:40, r:10}
  const cw = W - pad.l - pad.r
  const ch = h - pad.t - pad.b
  const allVals = datasets.flatMap(d=>d.data)
  if (!allVals.length || allVals.every(v=>v===0)) return (
    <svg width="100%" height={h} viewBox={`0 0 ${W} ${h}`}>
      <text x={W/2} y={h/2} textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize={12} fontFamily={BARLOW}>No data yet</text>
    </svg>
  )
  const rawMax = Math.max(...allVals)
  const niceMax = (n:number) => {
    if(n<=5) return 10; if(n<=10) return 15; if(n<=20) return 25; if(n<=50) return 60
    if(n<=100) return 120; if(n<=500) return Math.ceil(n*1.25/100)*100
    const mag = Math.pow(10, Math.floor(Math.log10(n)))
    return Math.ceil(n*1.25/mag)*mag
  }
  const max = niceMax(rawMax)
  const n = Math.max(...datasets.map(d=>d.data.length))
  const toX = (i:number) => pad.l + (i / (n-1||1)) * cw
  const toY = (v:number) => pad.t + ch - (v/max)*ch
  const ticks = [0, max*0.25, max*0.5, max*0.75, max].map(Math.round)
  const fmtV = (v:number) => v>=1000 ? `${(v/1000).toFixed(1)}K` : String(v)

  return (
    <svg width="100%" height={h} viewBox={`0 0 ${W} ${h}`} preserveAspectRatio="xMidYMid meet">
      {ticks.map(v=>(
        <g key={v}>
          <line x1={pad.l} y1={toY(v)} x2={W-pad.r} y2={toY(v)} stroke="rgba(255,255,255,0.05)" strokeWidth={1}/>
          <text x={pad.l-4} y={toY(v)+4} textAnchor="end" fill="rgba(255,255,255,0.28)" fontSize={10} fontFamily={BARLOW}>{fmtV(v)}</text>
        </g>
      ))}
      {labels.map((l,i)=>(
        <text key={i} x={toX(i)} y={h-4} textAnchor="middle" fill="rgba(255,255,255,0.28)" fontSize={10} fontFamily={BARLOW}>{l}</text>
      ))}
      {datasets.map((ds,di)=>{
        const pts = ds.data.map((v,i)=>`${toX(i).toFixed(1)},${toY(v).toFixed(1)}`).join(' ')
        const fillPts = `${pad.l},${pad.t+ch} ${pts} ${toX(ds.data.length-1)},${pad.t+ch}`
        return (
          <g key={di}>
            <polygon points={fillPts} fill={`${ds.color}18`}/>
            <polyline points={pts} fill="none" stroke={ds.color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/>
          </g>
        )
      })}
    </svg>
  )
}

function BarChart({ data, color=GOLD }: { data:{label:string;value:number;pct:number}[]; color?:string }) {
  if (!data.length) return <div style={{color:'rgba(255,255,255,0.25)',fontSize:14,padding:'20px 0',textAlign:'center'}}>No data yet</div>
  const maxPct = Math.max(...data.map(d=>d.pct), 1)
  return (
    <div style={{display:'flex',flexDirection:'column',gap:10}}>
      {data.map(d=>(
        <div key={d.label}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
            <span style={{fontSize:14,color:'rgba(255,255,255,0.7)'}}>{d.label}</span>
            <span style={{fontSize:13,color:'#F5F5F5',fontWeight:600}}>{d.value.toLocaleString('en-IN')} ({d.pct}%)</span>
          </div>
          <div style={{height:5,background:'rgba(255,255,255,0.07)',borderRadius:3}}>
            <div style={{height:'100%',width:`${(d.pct/maxPct)*100}%`,background:color,borderRadius:3,transition:'width 0.4s ease'}}/>
          </div>
        </div>
      ))}
    </div>
  )
}

function ColorBarChart({ data }: { data:{label:string;value:number;pct:number;color:string}[] }) {
  if (!data.length) return <div style={{color:'rgba(255,255,255,0.25)',fontSize:14,padding:'20px 0',textAlign:'center'}}>No data yet</div>
  const maxPct = Math.max(...data.map(d=>d.pct), 1)
  return (
    <div style={{display:'flex',flexDirection:'column',gap:10}}>
      {data.map(d=>(
        <div key={d.label}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
            <div style={{display:'flex',alignItems:'center',gap:7}}>
              <div style={{width:8,height:8,borderRadius:'50%',background:d.color,flexShrink:0}}/>
              <span style={{fontSize:14,color:'rgba(255,255,255,0.7)'}}>{d.label}</span>
            </div>
            <span style={{fontSize:13,color:'#F5F5F5',fontWeight:600}}>{d.value.toLocaleString('en-IN')} ({d.pct}%)</span>
          </div>
          <div style={{height:5,background:'rgba(255,255,255,0.07)',borderRadius:3}}>
            <div style={{height:'100%',width:`${(d.pct/maxPct)*100}%`,background:d.color,borderRadius:3,transition:'width 0.4s ease'}}/>
          </div>
        </div>
      ))}
    </div>
  )
}

function Donut({ slices, cx=70, total, label }: {
  slices:{value:number;color:string;label:string}[]
  cx?:number; total:string; label:string
}) {
  const size = cx*2
  const R = cx*0.6, r = cx*0.38
  const toRad = (d:number) => d*Math.PI/180
  const pt = (a:number, rad:number):[number,number] => [cx+rad*Math.cos(toRad(a)), cx+rad*Math.sin(toRad(a))]
  const sum = slices.reduce((s,d)=>s+d.value,0)
  if (!sum) return (
    <svg width={size} height={size} style={{display:'block'}}>
      <circle cx={cx} cy={cx} r={(R+r)/2} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={R-r}/>
      <circle cx={cx} cy={cx} r={r-1} fill={BG3}/>
      <text x={cx} y={cx-8} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize={cx*0.13} fontFamily={BARLOW}>{label}</text>
      <text x={cx} y={cx+10} textAnchor="middle" fill="#F5F5F5" fontSize={cx*0.24} fontWeight={800} fontFamily={BEBAS}>{total}</text>
    </svg>
  )
  const nonZero = slices.filter(s=>s.value>0)
  if (nonZero.length===1) return (
    <svg width={size} height={size} style={{display:'block'}}>
      <circle cx={cx} cy={cx} r={(R+r)/2} fill="none" stroke={nonZero[0].color} strokeWidth={R-r}/>
      <circle cx={cx} cy={cx} r={r-1} fill={BG3}/>
      <text x={cx} y={cx-8} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize={cx*0.13} fontFamily={BARLOW}>{label}</text>
      <text x={cx} y={cx+10} textAnchor="middle" fill="#F5F5F5" fontSize={cx*0.24} fontWeight={800} fontFamily={BEBAS}>{total}</text>
    </svg>
  )
  let angle = -90
  const arcs = nonZero.map(seg=>{
    const sweep = Math.min((seg.value/sum)*360, 359.9)
    const [x1,y1] = pt(angle,R); const [x2,y2] = pt(angle+sweep,R)
    const [x3,y3] = pt(angle+sweep,r); const [x4,y4] = pt(angle,r)
    const d = `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${R} ${R} 0 ${sweep>180?1:0} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} L ${x3.toFixed(2)} ${y3.toFixed(2)} A ${r} ${r} 0 ${sweep>180?1:0} 0 ${x4.toFixed(2)} ${y4.toFixed(2)} Z`
    angle += sweep + 1.5
    return {...seg, d}
  })
  return (
    <svg width={size} height={size} style={{display:'block'}}>
      <circle cx={cx} cy={cx} r={r-1} fill={BG3}/>
      {arcs.map(a=><path key={a.label} d={a.d} fill={a.color}/>)}
      <text x={cx} y={cx-8} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize={cx*0.13} fontFamily={BARLOW}>{label}</text>
      <text x={cx} y={cx+10} textAnchor="middle" fill="#F5F5F5" fontSize={cx*0.24} fontWeight={800} fontFamily={BEBAS}>{total}</text>
    </svg>
  )
}

function Card({ children, style }: { children:React.ReactNode; style?:React.CSSProperties }) {
  return <div style={{background:BG3,border:'1px solid rgba(255,255,255,0.06)',borderRadius:10,padding:18,...style}}>{children}</div>
}

function CardTitle({ children }: { children:React.ReactNode }) {
  return <div style={{fontSize:16,fontWeight:700,color:'#F5F5F5',marginBottom:14}}>{children}</div>
}

function KpiCard({ icon, label, value, sub, color, loading }: {
  icon:React.ReactNode; label:string; value:string|number; sub:string; color:string; loading:boolean
}) {
  return (
    <div style={{background:BG3,border:'1px solid rgba(255,255,255,0.06)',borderRadius:10,padding:'14px 16px',display:'flex',gap:12,alignItems:'center'}}>
      <div style={{width:42,height:42,borderRadius:'50%',background:`${color}22`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
        {icon}
      </div>
      <div>
        <div style={{fontSize:13,color:'rgba(255,255,255,0.45)',marginBottom:2}}>{label}</div>
        <div style={{fontFamily:BEBAS,fontSize:28,color:'#F5F5F5',lineHeight:1,letterSpacing:0.5}}>
          {loading ? '…' : typeof value==='number' ? value.toLocaleString('en-IN') : value}
        </div>
        <div style={{fontSize:12,color:'rgba(255,255,255,0.3)',marginTop:2}}>{sub}</div>
      </div>
    </div>
  )
}

/* ─── Main Page ── */
export default function AnalyticsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [stats,   setStats]   = useState<Stats>(EMPTY_STATS)
  const [castingByCategory, setCastingByCategory] = useState<{label:string;value:number;pct:number;color:string}[]>([])
  const [usersByCountry,    setUsersByCountry]    = useState<{label:string;value:number;pct:number}[]>([])
  const [usersByCity,       setUsersByCity]       = useState<{label:string;value:number;pct:number}[]>([])
  const [revenueMonthly,    setRevenueMonthly]    = useState<number[]>(Array(6).fill(0))
  const [appsTrend,         setAppsTrend]         = useState<number[]>(Array(6).fill(0))
  const [growthTotal,       setGrowthTotal]       = useState<number[]>(Array(12).fill(0))
  const [growthActive,      setGrowthActive]      = useState<number[]>(Array(12).fill(0))
  const [monthLabels6,      setMonthLabels6]      = useState<string[]>(Array(6).fill(''))
  const [monthLabels12,     setMonthLabels12]     = useState<string[]>(Array(12).fill(''))

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const token = getToken()
      const res = await fetch('/api/admin/analytics', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      if (!res.ok) throw new Error('Failed')
      const d = await res.json()
      setStats(d.stats)
      setCastingByCategory(d.castingByCategory || [])
      setUsersByCountry((d.usersByCountry || []).map((c:any)=>({label:c.name,value:c.value,pct:c.pct})))
      setUsersByCity((d.usersByCity || []).map((c:any)=>({label:c.name,value:c.value,pct:c.pct})))
      setRevenueMonthly(d.revenueMonthly || Array(6).fill(0))
      setAppsTrend(d.appsTrend          || Array(6).fill(0))
      setGrowthTotal(d.growthTotal      || Array(12).fill(0))
      setGrowthActive(d.growthActive    || Array(12).fill(0))
      setMonthLabels6(d.monthLabels6    || Array(6).fill(''))
      setMonthLabels12(d.monthLabels12  || Array(12).fill(''))
    } catch(e) {
      console.error('Analytics fetch error:', e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const s = stats
  const card: React.CSSProperties = {background:BG3,border:'1px solid rgba(255,255,255,0.06)',borderRadius:10,padding:18}
  const fmt = (n:number) => n.toLocaleString('en-IN')
  const fmtRupee = (n:number) => `₹${fmt(Math.round(n))}`
  const pct = (num:number, denom:number) => denom>0 ? `${Math.round(num/denom*100)}%` : '0%'

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100vh',overflow:'hidden',background:BG,fontFamily:BARLOW,color:'#F5F5F5'}}>
      <AdminTopnav />
      <div style={{display:'flex',flex:1,overflow:'hidden'}}>
        <AdminSidebar onCollapse={()=>{}} />
        <div style={{flex:1,overflowY:'auto',padding:'18px 22px 40px',display:'flex',flexDirection:'column',gap:16}}>

          {/* Header */}
          <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between'}}>
            <div>
              <div style={{display:'flex',alignItems:'center',gap:6,fontSize:13,color:'rgba(255,255,255,0.4)',marginBottom:5}}>
                <span onClick={()=>router.push('/admin/dashboard')} style={{cursor:'pointer'}}>Home</span>
                <ChevronRight size={12}/>
                <span style={{color:'rgba(255,255,255,0.7)'}}>Analytics & Reports</span>
              </div>
              <h1 style={{fontFamily:BEBAS,fontSize:30,letterSpacing:1,margin:0,display:'flex',alignItems:'center',gap:8}}>
                Analytics & Reports
                <span style={{width:8,height:8,borderRadius:'50%',background:GOLD,display:'inline-block',marginBottom:4}}/>
              </h1>
              <p style={{fontSize:14,color:'rgba(255,255,255,0.4)',margin:'3px 0 0'}}>Real-time platform insights across all modules.</p>
            </div>
            <div style={{display:'flex',gap:8,alignItems:'center',marginTop:28}}>
              {loading && <span style={{fontSize:13,color:'rgba(255,255,255,0.4)'}}>Loading…</span>}
              <button onClick={fetchData} style={{display:'flex',alignItems:'center',gap:6,padding:'8px 14px',background:BG3,border:'1px solid rgba(255,255,255,0.1)',borderRadius:7,color:'rgba(255,255,255,0.7)',fontFamily:BARLOW,fontSize:14,cursor:'pointer'}}>
                <RefreshCw size={14}/> Refresh
              </button>
              <button onClick={()=>router.push('/admin/analytics/subscription-report')}
                style={{display:'flex',alignItems:'center',gap:6,padding:'8px 16px',background:GOLD,border:'none',borderRadius:7,color:'#000',fontFamily:BEBAS,fontSize:17,letterSpacing:1,cursor:'pointer'}}>
                <Download size={14}/> Subscription Report
              </button>
            </div>
          </div>

          {/* ── ROW 1: KPI Cards ── */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12}}>
            <KpiCard icon={<Users size={18} color={BLUE}/>}     label="Total Users"          value={s.totalUsers}          sub={`${s.aspirants} aspirants · ${s.agencies} agencies`}  color={BLUE}   loading={loading}/>
            <KpiCard icon={<CheckCircle size={18} color={GREEN}/>} label="Active Users"       value={s.activeUsers}         sub={pct(s.activeUsers,s.totalUsers)+' of total'}           color={GREEN}  loading={loading}/>
            <KpiCard icon={<TrendingUp size={18} color={TEAL}/>}  label="New This Month"      value={s.newRegistrations}    sub="Registered this calendar month"                        color={TEAL}   loading={loading}/>
            <KpiCard icon={<CreditCard size={18} color={GOLD}/>}  label="Total Revenue"       value={fmtRupee(s.totalRevenue)} sub={`${s.activeSubscriptions} active subscriptions`}  color={GOLD}   loading={loading}/>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12}}>
            <KpiCard icon={<CheckCircle size={18} color={PURPLE}/>} label="Verified Aspirants" value={s.aspApproved}       sub={`${s.aspPending} pending verification`}                color={PURPLE} loading={loading}/>
            <KpiCard icon={<Building2 size={18} color={ORANGE}/>}   label="Verified Agencies"  value={s.agcApproved}       sub={`${s.agcPending} pending verification`}                color={ORANGE} loading={loading}/>
            <KpiCard icon={<Megaphone size={18} color={RED}/>}       label="Casting Calls"      value={s.activeCastings}    sub={`${s.totalCastings} total · ${s.closedCastings} closed`} color={RED} loading={loading}/>
            <KpiCard icon={<BarChart2 size={18} color={TEAL}/>}      label="Applications"       value={s.totalApplications} sub={`${s.shortlisted} shortlisted · ${s.applicationsToday} today`} color={TEAL} loading={loading}/>
          </div>

          {/* ── ROW 2: Growth chart + User distribution donut ── */}
          <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:14}}>

            <Card>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
                <CardTitle>User Growth (12 Months)</CardTitle>
                <div style={{display:'flex',gap:14}}>
                  {[{color:GOLD,label:'Total'},{color:GREEN,label:'Active'}].map(l=>(
                    <div key={l.label} style={{display:'flex',alignItems:'center',gap:5}}>
                      <div style={{width:18,height:2,background:l.color,borderRadius:1}}/>
                      <span style={{fontSize:12,color:'rgba(255,255,255,0.5)'}}>{l.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <LineChart
                datasets={[
                  {data:growthTotal, color:GOLD,  label:'Total'},
                  {data:growthActive,color:GREEN, label:'Active'},
                ]}
                labels={monthLabels12} h={160}
              />
            </Card>

            <Card style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
              <CardTitle>User Breakdown</CardTitle>
              <Donut
                slices={[
                  {value:s.aspirants, color:GOLD,   label:'Aspirants'},
                  {value:s.agencies,  color:PURPLE,  label:'Agencies'},
                  {value:Math.max(0,s.totalUsers-s.aspirants-s.agencies), color:BLUE, label:'Other'},
                ]}
                total={fmt(s.totalUsers)}
                label="Total"
                cx={70}
              />
              <div style={{width:'100%',marginTop:12,display:'flex',flexDirection:'column',gap:7}}>
                {[
                  {label:'Aspirants',color:GOLD,  value:s.aspirants,  pct:pct(s.aspirants,s.totalUsers)},
                  {label:'Agencies', color:PURPLE, value:s.agencies,   pct:pct(s.agencies,s.totalUsers)},
                  {label:'Others',   color:BLUE,   value:Math.max(0,s.totalUsers-s.aspirants-s.agencies), pct:pct(Math.max(0,s.totalUsers-s.aspirants-s.agencies),s.totalUsers)},
                ].map(d=>(
                  <div key={d.label} style={{display:'flex',alignItems:'center',gap:7}}>
                    <div style={{width:8,height:8,borderRadius:'50%',background:d.color,flexShrink:0}}/>
                    <span style={{fontSize:13,color:'rgba(255,255,255,0.6)',flex:1}}>{d.label}</span>
                    <span style={{fontSize:13,color:'#F5F5F5',fontWeight:600}}>{fmt(d.value)} ({d.pct})</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* ── ROW 3: Applications trend + Revenue trend ── */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>

            <Card>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
                <CardTitle>Applications Trend (6 Months)</CardTitle>
                <span style={{fontFamily:BEBAS,fontSize:22,color:PURPLE,letterSpacing:0.5}}>{fmt(s.totalApplications)}</span>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8,marginBottom:14}}>
                {[
                  {label:'Total',       value:s.totalApplications, color:PURPLE},
                  {label:'Shortlisted', value:s.shortlisted,       color:GREEN},
                  {label:'Rejected',    value:s.rejected,          color:RED},
                ].map(m=>(
                  <div key={m.label} style={{background:BG4,borderRadius:8,padding:'10px 12px'}}>
                    <div style={{fontSize:12,color:'rgba(255,255,255,0.4)',marginBottom:4}}>{m.label}</div>
                    <div style={{fontFamily:BEBAS,fontSize:22,color:m.color}}>{loading?'…':fmt(m.value)}</div>
                  </div>
                ))}
              </div>
              <LineChart datasets={[{data:appsTrend,color:PURPLE,label:'Applications'}]} labels={monthLabels6} h={120}/>
            </Card>

            <Card>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
                <CardTitle>Revenue Overview (6 Months)</CardTitle>
                <span style={{fontFamily:BEBAS,fontSize:22,color:GOLD,letterSpacing:0.5}}>{fmtRupee(s.totalRevenue)}</span>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8,marginBottom:14}}>
                {[
                  {label:'Total',    value:fmtRupee(s.totalRevenue),    color:GOLD},
                  {label:'Aspirant', value:fmtRupee(s.aspirantRevenue), color:GREEN},
                  {label:'Agency',   value:fmtRupee(s.agencyRevenue),   color:BLUE},
                ].map(m=>(
                  <div key={m.label} style={{background:BG4,borderRadius:8,padding:'10px 12px'}}>
                    <div style={{fontSize:12,color:'rgba(255,255,255,0.4)',marginBottom:4}}>{m.label}</div>
                    <div style={{fontFamily:BEBAS,fontSize:20,color:m.color}}>{loading?'…':m.value}</div>
                  </div>
                ))}
              </div>
              <LineChart datasets={[{data:revenueMonthly,color:GOLD,label:'Revenue'}]} labels={monthLabels6} h={120}/>
            </Card>
          </div>

          {/* ── ROW 4: Casting by category + Countries + Cities ── */}
          <div style={{display:'grid',gridTemplateColumns:'1.4fr 1fr 1fr',gap:14}}>

            <Card>
              <CardTitle>Casting Calls by Project Type</CardTitle>
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8,marginBottom:14}}>
                {[
                  {label:'Total',  value:s.totalCastings,  color:RED},
                  {label:'Active', value:s.activeCastings,  color:GREEN},
                  {label:'Closed', value:s.closedCastings,  color:'rgba(255,255,255,0.3)'},
                ].map(m=>(
                  <div key={m.label} style={{background:BG4,borderRadius:8,padding:'10px 12px'}}>
                    <div style={{fontSize:12,color:'rgba(255,255,255,0.4)',marginBottom:4}}>{m.label}</div>
                    <div style={{fontFamily:BEBAS,fontSize:22,color:m.color}}>{loading?'…':fmt(m.value)}</div>
                  </div>
                ))}
              </div>
              <ColorBarChart data={castingByCategory}/>
            </Card>

            <Card>
              <CardTitle>Users by Country</CardTitle>
              <BarChart data={usersByCountry} color={GOLD}/>
            </Card>

            <Card>
              <CardTitle>Users by City</CardTitle>
              <BarChart data={usersByCity} color={TEAL}/>
            </Card>
          </div>

          {/* ── ROW 5: Verification status + Today activity + Subscriptions ── */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:14}}>

            {/* Verification status */}
            <Card>
              <CardTitle>Verification Status</CardTitle>
              <div style={{display:'flex',gap:16,marginBottom:16}}>
                <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center'}}>
                  <Donut
                    slices={[
                      {value:s.aspApproved,color:GREEN, label:'Approved'},
                      {value:s.aspPending, color:ORANGE,label:'Pending'},
                    ]}
                    total={fmt(s.aspirants)} label="Aspirants" cx={55}
                  />
                  <div style={{fontSize:13,color:'rgba(255,255,255,0.5)',marginTop:6}}>Aspirants</div>
                </div>
                <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center'}}>
                  <Donut
                    slices={[
                      {value:s.agcApproved,color:GREEN, label:'Approved'},
                      {value:s.agcPending, color:ORANGE,label:'Pending'},
                    ]}
                    total={fmt(s.agencies)} label="Agencies" cx={55}
                  />
                  <div style={{fontSize:13,color:'rgba(255,255,255,0.5)',marginTop:6}}>Agencies</div>
                </div>
              </div>
              {[
                {label:'Aspirants Approved', value:s.aspApproved, color:GREEN},
                {label:'Aspirants Pending',  value:s.aspPending,  color:ORANGE},
                {label:'Agencies Approved',  value:s.agcApproved, color:GREEN},
                {label:'Agencies Pending',   value:s.agcPending,  color:ORANGE},
              ].map(r=>(
                <div key={r.label} style={{display:'flex',justifyContent:'space-between',padding:'6px 0',borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
                  <span style={{fontSize:14,color:'rgba(255,255,255,0.5)'}}>{r.label}</span>
                  <span style={{fontSize:14,fontWeight:700,color:r.color}}>{loading?'…':fmt(r.value)}</span>
                </div>
              ))}
            </Card>

            {/* Today's activity */}
            <Card>
              <CardTitle>Today's Activity</CardTitle>
              {[
                {icon:'📋',label:'Applications Received',value:s.applicationsToday, color:PURPLE},
                {icon:'💬',label:'Messages Sent',        value:s.messagesToday,     color:TEAL},
                {icon:'📅',label:'Auditions Scheduled',  value:s.auditionsToday,    color:ORANGE},
                {icon:'👥',label:'Active Users',         value:s.activeUsers,       color:GREEN},
                {icon:'🎬',label:'Active Casting Calls', value:s.activeCastings,    color:RED},
              ].map(r=>(
                <div key={r.label} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'9px 0',borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
                  <div style={{display:'flex',alignItems:'center',gap:9}}>
                    <div style={{width:30,height:30,borderRadius:7,background:`${r.color}20`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:14}}>{r.icon}</div>
                    <span style={{fontSize:14,color:'rgba(255,255,255,0.6)'}}>{r.label}</span>
                  </div>
                  <span style={{fontFamily:BEBAS,fontSize:20,color:'#F5F5F5',letterSpacing:0.5}}>{loading?'…':fmt(r.value)}</span>
                </div>
              ))}
            </Card>

            {/* Subscription & revenue breakdown */}
            <Card>
              <CardTitle>Subscription & Revenue</CardTitle>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:14}}>
                {[
                  {label:'Active Subs',   value:fmt(s.activeSubscriptions), color:GREEN},
                  {label:'Total Revenue', value:fmtRupee(s.totalRevenue),   color:GOLD},
                  {label:'Aspirant Rev',  value:fmtRupee(s.aspirantRevenue),color:PURPLE},
                  {label:'Agency Rev',    value:fmtRupee(s.agencyRevenue),  color:BLUE},
                ].map(m=>(
                  <div key={m.label} style={{background:BG4,borderRadius:8,padding:'12px'}}>
                    <div style={{fontSize:12,color:'rgba(255,255,255,0.4)',marginBottom:4}}>{m.label}</div>
                    <div style={{fontFamily:BEBAS,fontSize:20,color:m.color}}>{loading?'…':m.value}</div>
                  </div>
                ))}
              </div>
              <Donut
                slices={[
                  {value:s.aspirantRevenue,color:PURPLE,label:'Aspirant'},
                  {value:s.agencyRevenue,  color:BLUE,  label:'Agency'},
                ]}
                total={fmtRupee(s.totalRevenue)}
                label="Revenue"
                cx={70}
              />
              <div style={{display:'flex',flexDirection:'column',gap:6,marginTop:10}}>
                {[
                  {label:'Aspirant Revenue',color:PURPLE,value:fmtRupee(s.aspirantRevenue),pct:pct(s.aspirantRevenue,s.totalRevenue)},
                  {label:'Agency Revenue',  color:BLUE,  value:fmtRupee(s.agencyRevenue),  pct:pct(s.agencyRevenue,s.totalRevenue)},
                ].map(d=>(
                  <div key={d.label} style={{display:'flex',alignItems:'center',gap:7}}>
                    <div style={{width:8,height:8,borderRadius:'50%',background:d.color}}/>
                    <span style={{fontSize:13,color:'rgba(255,255,255,0.5)',flex:1}}>{d.label}</span>
                    <span style={{fontSize:13,color:'#F5F5F5',fontWeight:600}}>{d.value} ({d.pct})</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

        </div>
      </div>
    </div>
  )
}