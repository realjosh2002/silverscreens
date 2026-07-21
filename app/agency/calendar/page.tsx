'use client';

import AgencyTopnav from '@/components/layout/AgencyTopnav'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SilverScreensLogo from '@/components/ui/SilverScreensLogo';
import {

  LayoutDashboard, Megaphone, PlusCircle, ClipboardList,
  UserSearch, Star, CalendarCheck, MessageSquare, Bell,
  Bookmark, ChevronDown, ChevronLeft, ChevronRight, Menu, Plus,
  Clock, MapPin, Users, Download, X,
} from 'lucide-react';

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

/* ── Event Types ── */
const EVENT_TYPES = [
  { key: 'Audition',   label: 'Audition',   color: GREEN  },
  { key: 'Callback',   label: 'Callback',   color: GOLD   },
  { key: 'Look Test',  label: 'Look Test',  color: BLUE   },
  { key: 'Meeting',    label: 'Meeting',    color: PURPLE },
  { key: 'Other',      label: 'Other',      color: '#6B7280' },
];
function evColor(type: string) { return EVENT_TYPES.find(e => e.key === type)?.color ?? BLUE; }

/* ── Events Data ── */
const EVENTS: Record<string, { type: string; title: string; time: string; location: string; project: string }[]> = {
  '2026-06-01': [{ type:'Audition', title:'Audition – Web Series',   time:'10:00 AM', location:'Studio 3',        project:'City of Dreams S2'  },
                 { type:'Meeting',  title:'Team Meeting',             time:'11:00 AM', location:'Conference Room', project:'Internal'           },
                 { type:'Other',    title:'Project Discussion',       time:'2:30 PM',  location:'Google Meet',     project:'Internal'           },
                 { type:'Other',    title:'Client Call',              time:'4:00 PM',  location:'Phone',           project:'External'           }],
  '2026-06-02': [{ type:'Audition', title:'Audition – Ad Film',      time:'11:00 AM', location:'Studio 1',        project:'Brand Campaign'     },
                 { type:'Other',    title:'Client Call',              time:'4:00 PM',  location:'Phone',           project:'External'           }],
  '2026-06-03': [{ type:'Callback', title:'Callback – TV Show',      time:'10:00 AM', location:'Studio 2',        project:'Dastaan-e-Mohabbat' },
                 { type:'Meeting',  title:'Script Reading',           time:'3:00 PM',  location:'Office',          project:'City of Dreams S2'  }],
  '2026-06-04': [{ type:'Look Test',title:'Look Test – Models',      time:'11:00 AM', location:'Studio 2',        project:'Brand Campaign'     },
                 { type:'Meeting',  title:'Production Meeting',       time:'2:00 PM',  location:'Conference Room', project:'Internal'           }],
  '2026-06-05': [{ type:'Audition', title:'Audition – Feature Film', time:'10:00 AM', location:'Studio 2',        project:'Beyond Limits'      },
                 { type:'Meeting',  title:'Team Sync',                time:'3:30 PM',  location:'Google Meet',     project:'Internal'           }],
  '2026-06-08': [{ type:'Audition', title:'Audition – Ad Film',      time:'10:30 AM', location:'Studio 1',        project:'Brand Campaign'     },
                 { type:'Meeting',  title:'Client Meeting',           time:'2:00 PM',  location:'Client Office',   project:'External'           }],
  '2026-06-09': [{ type:'Callback', title:'Callback – Web Series',   time:'11:00 AM', location:'Studio 3',        project:'City of Dreams S2'  },
                 { type:'Other',    title:'Location Recce',           time:'4:30 PM',  location:'Mumbai Suburbs',  project:'Beyond Limits'      }],
  '2026-06-10': [{ type:'Audition', title:'Audition – TV Show',      time:'10:00 AM', location:'Studio 2',        project:'Dastaan-e-Mohabbat' },
                 { type:'Meeting',  title:'Production Meeting',       time:'3:00 PM',  location:'Conference Room', project:'Internal'           }],
  '2026-06-11': [{ type:'Look Test',title:'Look Test – Actors',      time:'11:00 AM', location:'Studio 1',        project:'Beyond Limits'      },
                 { type:'Meeting',  title:'Casting Review',           time:'2:00 PM',  location:'Conference Room', project:'Internal'           }],
  '2026-06-12': [{ type:'Audition', title:'Audition – Short Film',   time:'10:00 AM', location:'Studio 3',        project:'The Silent Call'    },
                 { type:'Meeting',  title:'Budget Review',            time:'2:30 PM',  location:'Conference Room', project:'Internal'           }],
  '2026-06-15': [{ type:'Meeting',  title:'Team Meeting',            time:'10:00 AM', location:'Conference Room', project:'Internal'           },
                 { type:'Audition', title:'Audition – Web Series',   time:'1:00 PM',  location:'Studio 3',        project:'City of Dreams S2'  }],
  '2026-06-16': [{ type:'Callback', title:'Callback – Ad Film',      time:'11:00 AM', location:'Studio 1',        project:'Brand Campaign'     },
                 { type:'Other',    title:'Client Call',              time:'4:00 PM',  location:'Phone',           project:'External'           }],
  '2026-06-17': [{ type:'Audition', title:'Audition – Feature Film', time:'10:00 AM', location:'Studio 2',        project:'Beyond Limits'      },
                 { type:'Meeting',  title:'Script Discussion',        time:'3:30 PM',  location:'Office',          project:'City of Dreams S2'  }],
  '2026-06-18': [{ type:'Look Test',title:'Look Test – Models',      time:'11:00 AM', location:'Studio 2',        project:'Brand Campaign'     },
                 { type:'Meeting',  title:'Casting Review',           time:'2:00 PM',  location:'Conference Room', project:'Internal'           }],
  '2026-06-19': [{ type:'Callback', title:'Callback – TV Show',      time:'10:00 AM', location:'Studio 2',        project:'Dastaan-e-Mohabbat' },
                 { type:'Meeting',  title:'Marketing Meeting',        time:'3:00 PM',  location:'Google Meet',     project:'Internal'           }],
  '2026-06-22': [{ type:'Audition', title:'Audition – Ad Film',      time:'10:30 AM', location:'Studio 1',        project:'Brand Campaign'     },
                 { type:'Meeting',  title:'Client Meeting',           time:'2:00 PM',  location:'Client Office',   project:'External'           }],
  '2026-06-23': [{ type:'Meeting',  title:'Script Reading',          time:'11:00 AM', location:'Office',          project:'City of Dreams S2'  },
                 { type:'Other',    title:'Location Visit',           time:'4:00 PM',  location:'Andheri West',    project:'Beyond Limits'      }],
  '2026-06-24': [{ type:'Audition', title:'Audition – Web Series',   time:'10:00 AM', location:'Studio 3',        project:'City of Dreams S2'  },
                 { type:'Other',    title:'Lunch Break',              time:'12:00 PM', location:'Office Canteen',  project:'Internal'           },
                 { type:'Meeting',  title:'Team Sync',                time:'3:00 PM',  location:'Google Meet',     project:'Internal'           },
                 { type:'Meeting',  title:'Talent Review',            time:'5:00 PM',  location:'Conference Room', project:'Internal'           }],
  '2026-06-25': [{ type:'Look Test',title:'Look Test – Actors',      time:'11:00 AM', location:'Studio 1',        project:'Beyond Limits'      },
                 { type:'Meeting',  title:'Callback Review',          time:'2:30 PM',  location:'Conference Room', project:'Internal'           }],
  '2026-06-26': [{ type:'Audition', title:'Audition – Short Film',   time:'10:00 AM', location:'Studio 3',        project:'The Silent Call'    },
                 { type:'Meeting',  title:'Finance Review',           time:'4:00 PM',  location:'Conference Room', project:'Internal'           }],
  '2026-06-29': [{ type:'Meeting',  title:'Team Meeting',            time:'10:00 AM', location:'Conference Room', project:'Internal'           },
                 { type:'Audition', title:'Audition – TV Show',      time:'1:00 PM',  location:'Studio 2',        project:'Dastaan-e-Mohabbat' }],
  '2026-06-30': [{ type:'Callback', title:'Callback – Feature Film', time:'11:00 AM', location:'Studio 2',        project:'Beyond Limits'      },
                 { type:'Other',    title:'Client Call',              time:'4:00 PM',  location:'Phone',           project:'External'           }],
};

/* ── Nav ── */
const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard',               href: '/agency/dashboard' },
  { icon: PlusCircle,      label: 'Create Casting Call',     href: '/agency/create-casting' },
  { icon: Megaphone,       label: 'Casting Calls List',      href: '/agency/casting-calls' },
  { icon: UserSearch,      label: 'Talent Search',           href: '/agency/talent-search' },
  { icon: ClipboardList,   label: 'Applications Management', href: '/agency/applications' },
  { icon: Star,            label: 'Shortlisted Talents',     href: '/agency/shortlisted' },
  { icon: CalendarCheck,   label: 'Audition Management',     href: '/agency/auditions' },
  { icon: Bookmark,        label: 'Saved Talents',           href: '/agency/saved-talents' },
  { icon: MessageSquare,   label: 'Messages',    href: '/agency/messages' },
  { icon: Bell,            label: 'Notifications', href: '/agency/notifications' },
];

const PROFILE_MENU = [
  { label: 'Reports & Analytics',   href: '/agency/reports' },
  { label: 'Subscription & Billing',href: '/agency/subscription' },
  { label: 'Company Profile',        href: '/agency-profile' },
  { label: 'Documents',              href: '/agency/documents' },
  { label: 'Calendar',               href: '/agency/calendar' },
  { label: 'Settings',               href: '/agency/settings' },
  { label: 'Support',                href: '/contact' },
  { label: 'Logout',                 href: '/login' },
];

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function daysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate(); }
function firstDayOfMonth(y: number, m: number) { return new Date(y, m, 1).getDay(); }
function dateKey(y: number, m: number, d: number) {
  return `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
}

/* ── Add Event Modal ── */
function AddEventModal({ onClose, defaultDate }: { onClose: () => void; defaultDate: string }) {
  const [title, setTitle] = useState('');
  const [type,  setType]  = useState('Audition');
  const [date,  setDate]  = useState(defaultDate);
  const [time,  setTime]  = useState('10:00');
  const [loc,   setLoc]   = useState('');

  const inp = { width:'100%', background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, padding:'10px 12px', color:'#fff', fontSize:15, fontFamily:BARLOW, outline:'none', boxSizing:'border-box' as const };

  return (
    <div style={{ position:'fixed', inset:0, zIndex:1000, background:'rgba(0,0,0,0.85)', display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
      <div style={{ background:`linear-gradient(135deg,${BG2},${BG3})`, border:'1px solid rgba(255,255,255,0.1)', borderRadius:16, padding:32, maxWidth:460, width:'100%', boxShadow:'0 40px 80px rgba(0,0,0,0.8)', position:'relative' }}>
        <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,transparent,${GOLD},transparent)`, borderRadius:'16px 16px 0 0' }} />
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:22 }}>
          <div style={{ fontFamily:BEBAS, fontSize:24, letterSpacing:1.5, color:'#fff' }}>Add Event</div>
          <button onClick={onClose} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.4)', cursor:'pointer', fontSize:20 }}>✕</button>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div>
            <div style={{ fontSize: 14, color:'rgba(255,255,255,0.4)', fontFamily:BARLOW, letterSpacing:1, textTransform:'uppercase', marginBottom:6 }}>Event Title</div>
            <input placeholder="e.g. Audition for City of Dreams" value={title} onChange={e => setTitle(e.target.value)} style={inp} />
          </div>
          <div>
            <div style={{ fontSize: 14, color:'rgba(255,255,255,0.4)', fontFamily:BARLOW, letterSpacing:1, textTransform:'uppercase', marginBottom:6 }}>Type</div>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' as const }}>
              {EVENT_TYPES.map(et => (
                <button key={et.key} onClick={() => setType(et.key)} style={{ display:'flex', alignItems:'center', gap:6, background: type===et.key ? `${et.color}25` : 'rgba(255,255,255,0.04)', border:`1px solid ${type===et.key ? et.color : 'rgba(255,255,255,0.08)'}`, borderRadius:20, padding:'5px 12px', cursor:'pointer', fontSize: 14, fontFamily:BARLOW, color: type===et.key ? '#fff' : 'rgba(255,255,255,0.5)' }}>
                  <div style={{ width:7, height:7, borderRadius:'50%', background:et.color, flexShrink:0 }} />{et.label}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div>
              <div style={{ fontSize: 14, color:'rgba(255,255,255,0.4)', fontFamily:BARLOW, letterSpacing:1, textTransform:'uppercase', marginBottom:6 }}>Date</div>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ ...inp, colorScheme:'dark' }} />
            </div>
            <div>
              <div style={{ fontSize: 14, color:'rgba(255,255,255,0.4)', fontFamily:BARLOW, letterSpacing:1, textTransform:'uppercase', marginBottom:6 }}>Time</div>
              <input type="time" value={time} onChange={e => setTime(e.target.value)} style={{ ...inp, colorScheme:'dark' }} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: 14, color:'rgba(255,255,255,0.4)', fontFamily:BARLOW, letterSpacing:1, textTransform:'uppercase', marginBottom:6 }}>Location</div>
            <input placeholder="Studio / venue name" value={loc} onChange={e => setLoc(e.target.value)} style={inp} />
          </div>
        </div>
        <div style={{ display:'flex', gap:12, marginTop:22 }}>
          <button onClick={onClose} style={{ flex:1, background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, padding:12, fontSize:16, fontFamily:BARLOW, fontWeight:700, color:'#fff', cursor:'pointer' }}>Cancel</button>
          <button onClick={onClose} style={{ flex:1, background:GOLD, border:'none', borderRadius:8, padding:12, fontSize:16, fontFamily:BARLOW, fontWeight:700, color:BG, cursor:'pointer' }}>Save Event</button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ── */
export default function AgencyCalendarPage() {
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [year,        setYear]        = useState(2026);
  const [month,       setMonth]       = useState(5); // June = 5
  const [view,        setView]        = useState<'month'|'week'|'list'>('month');
  const [showAdd,     setShowAdd]     = useState(false);
  const [selectedDay, setSelectedDay] = useState<string|null>(null);
  const [showInvite,  setShowInvite]  = useState(false);
  const [filters,     setFilters]     = useState({ Audition:true, Callback:true, 'Look Test':true, Meeting:true, Other:true });

  const SB_W = sidebarOpen ? 230 : 52;
  const today = '2026-06-24';

  const toggleFilter = (key: string) => setFilters(f => ({ ...f, [key]: !f[key as keyof typeof f] }));
  const prevMonth = () => { if (month===0) { setMonth(11); setYear(y=>y-1); } else setMonth(m=>m-1); };
  const nextMonth = () => { if (month===11) { setMonth(0); setYear(y=>y+1); } else setMonth(m=>m+1); };

  const totalDays  = daysInMonth(year, month);
  const firstDay   = firstDayOfMonth(year, month);
  const totalCells = Math.ceil((firstDay + totalDays) / 7) * 7;

  const visibleEvents = (key: string) => (EVENTS[key] || []).filter(e => filters[e.type as keyof typeof filters]);

  const listEvents = Object.entries(EVENTS)
    .filter(([k]) => k.startsWith(`${year}-${String(month+1).padStart(2,'0')}`))
    .flatMap(([k,evts]) => evts.filter(e => filters[e.type as keyof typeof filters]).map(e => ({ ...e, dateKey:k, dayNum:parseInt(k.split('-')[2]) })))
    .sort((a,b) => a.dayNum - b.dayNum);

  const todayEvents = (EVENTS[today] || []).filter(e => filters[e.type as keyof typeof filters]);

  const upcoming = Object.entries(EVENTS)
    .filter(([k]) => k > today)
    .sort(([a],[b]) => a.localeCompare(b))
    .slice(0, 3)
    .flatMap(([k,evts]) => evts.slice(0,1).map(e => ({ ...e, date:k })));

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh', background:BG, color:'#F5F5F5', fontFamily:BARLOW, overflow:'hidden' }}>
      {showAdd && <AddEventModal onClose={() => setShowAdd(false)} defaultDate={selectedDay || today} />}

      {/* ── TOPNAV ── */}
      <AgencyTopnav />

      {/* ── BODY ── */}
      <div style={{ display:'flex', flex:1, overflow:'hidden' }}>

        {/* ── SIDEBAR ── */}
        <aside style={{ width:SB_W, flexShrink:0, background:BG2, borderRight:'1px solid rgba(255,255,255,0.06)', display:'flex', flexDirection:'column', overflowY:'auto', overflowX:'hidden', transition:'width 0.2s ease' }}>
          <div style={{ height:52, display:'flex', alignItems:'center', justifyContent:sidebarOpen?'flex-end':'center', padding:sidebarOpen?'0 12px':0, borderBottom:'1px solid rgba(255,255,255,0.06)', flexShrink:0 }}>
            <button onClick={() => setSidebarOpen(v=>!v)} style={{ background:'none', border:'none', cursor:'pointer', width:30, height:30, borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(255,255,255,0.5)' }}
              onMouseEnter={e => (e.currentTarget.style.background='rgba(255,255,255,0.07)')}
              onMouseLeave={e => (e.currentTarget.style.background='none')}
            >{sidebarOpen ? <ChevronLeft size={16}/> : <Menu size={16}/>}</button>
          </div>
          {sidebarOpen && (
            <div style={{ padding:'14px 16px', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:38, height:38, borderRadius:9, background:'linear-gradient(135deg,#1a1410,#2a1e0e)', border:'1px solid rgba(212,166,74,0.25)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:800, color:GOLD, fontFamily:BEBAS, flexShrink:0 }}>DP</div>
              <div style={{ minWidth:0 }}>
                <div style={{ fontSize:14, fontWeight:700, color:'#F5F5F5', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>Dharma Productions</div>
                <div onClick={() => router.push('/agency-profile')} style={{ fontSize: 14, color:RED, fontWeight:600, cursor:'pointer' }}>View Company Profile</div>
              </div>
            </div>
          )}
          <nav style={{ flex:1, padding:sidebarOpen?'8px 6px':'8px 4px', overflowY:'auto' }}>
            {NAV_ITEMS.map(({ icon:Icon, label, badge, href }) => (
              <div key={label} onClick={() => router.push(href)} title={!sidebarOpen?label:undefined}
                style={{ display:'flex', alignItems:'center', justifyContent:sidebarOpen?'space-between':'center', padding:sidebarOpen?'8px 10px':'10px 0', marginBottom:2, borderRadius:6, cursor:'pointer', position:'relative' }}
                onMouseEnter={e => (e.currentTarget.style.background='rgba(255,255,255,0.04)')}
                onMouseLeave={e => (e.currentTarget.style.background='transparent')}
              >
                <div style={{ display:'flex', alignItems:'center', gap:sidebarOpen?9:0, justifyContent:'center' }}>
                  <Icon size={15} color="rgba(255,255,255,0.42)" strokeWidth={1.8} />
                  {sidebarOpen && <span style={{ fontSize:15, color:'rgba(255,255,255,0.6)', whiteSpace:'nowrap' }}>{label}</span>}
                </div>
                {sidebarOpen && badge && <div style={{ background:RED, color:'#fff', borderRadius:10, fontSize: 14, fontWeight:700, padding:'1px 6px' }}>{badge}</div>}
                {!sidebarOpen && badge && <div style={{ position:'absolute', top:6, right:4, background:RED, borderRadius:'50%', width:14, height:14, display:'flex', alignItems:'center', justifyContent:'center', fontSize:8, fontWeight:700, color:'#fff' }}>{badge}</div>}
              </div>
            ))}
          </nav>
          {sidebarOpen && (
            <div style={{ margin:'8px 10px 14px', borderRadius:12, background:'linear-gradient(135deg,#1a1205,#2a1e0a)', border:'1px solid rgba(212,166,74,0.25)', padding:'14px 12px', textAlign:'center', flexShrink:0 }}>
              <div style={{ fontSize:18, marginBottom:4 }}>👑</div>
              <div style={{ fontSize:15, fontWeight:700, color:GOLD, marginBottom:3 }}>Upgrade to Pro</div>
              <button onClick={() => router.push('/pricing')} style={{ width:'100%', background:GOLD, color:'#000', border:'none', borderRadius:8, padding:'7px 0', fontSize: 14, fontWeight:700, fontFamily:BARLOW, cursor:'pointer' }}>Upgrade Now</button>
            </div>
          )}
        </aside>

        {/* ── MAIN CONTENT (scrollable, exact aspirant pattern) ── */}
        <div style={{ flex:1, minWidth:0, overflowY:'auto', overflowX:'hidden' }}>
          <div style={{ display:'flex', alignItems:'flex-start', minHeight:'100%' }}>

            {/* ── CALENDAR COLUMN ── */}
            <div style={{ flex:1, minWidth:0, padding:'24px 20px 40px', display:'flex', flexDirection:'column', gap:16 }}>

              {/* Page header */}
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
                <div>
                  <h1 style={{ fontFamily:BEBAS, fontSize:32, letterSpacing:2, color:GOLD, margin:'0 0 4px' }}>CALENDAR</h1>
                  <p style={{ fontSize:15, color:'rgba(255,255,255,0.4)', fontFamily:BARLOW, margin:0 }}>Manage your auditions, meetings, callbacks and important events.</p>
                </div>
                <div style={{ display:'flex', gap:10 }}>
                  <button onClick={() => { setSelectedDay(today); setShowAdd(true); }} style={{ display:'flex', alignItems:'center', gap:7, background:GOLD, border:'none', borderRadius:8, padding:'8px 18px', color:BG, fontSize:15, fontFamily:BARLOW, fontWeight:700, cursor:'pointer' }}>
                    <Plus size={15}/> Add Event
                  </button>
                  <button onClick={() => setShowInvite(true)} style={{ display:'flex', alignItems:'center', gap:7, background:'none', border:'1px solid rgba(255,255,255,0.15)', borderRadius:8, padding:'8px 16px', color:'#F5F5F5', fontSize:15, fontFamily:BARLOW, fontWeight:600, cursor:'pointer' }}>
                    <Users size={14}/> Invite Team
                  </button>
                  <button onClick={() => {}} style={{ display:'flex', alignItems:'center', gap:7, background:'none', border:'1px solid rgba(255,255,255,0.15)', borderRadius:8, padding:'8px 16px', color:'#F5F5F5', fontSize:15, fontFamily:BARLOW, fontWeight:600, cursor:'pointer' }}>
                    <Download size={14}/> Download
                  </button>
                </div>
              </div>

              {/* Toolbar */}
              <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' as const }}>
                <div style={{ display:'flex', background:BG2, border:'1px solid rgba(255,255,255,0.08)', borderRadius:8, overflow:'hidden' }}>
                  {(['month','week','list'] as const).map(v => (
                    <button key={v} onClick={() => setView(v)} style={{ padding:'8px 16px', border:'none', background: view===v ? GOLD : 'transparent', color: view===v ? BG : 'rgba(255,255,255,0.55)', fontSize:15, fontFamily:BARLOW, fontWeight:700, cursor:'pointer', borderRight: v!=='list' ? '1px solid rgba(255,255,255,0.07)' : 'none' }}>
                      {v.charAt(0).toUpperCase()+v.slice(1)}
                    </button>
                  ))}
                </div>
                <button onClick={() => { setYear(2026); setMonth(5); }} style={{ padding:'8px 16px', background:BG2, border:'1px solid rgba(255,255,255,0.08)', borderRadius:8, color:'rgba(255,255,255,0.7)', fontSize:15, fontFamily:BARLOW, cursor:'pointer' }}>Today</button>
                <button onClick={prevMonth} style={{ width:34, height:34, background:BG2, border:'1px solid rgba(255,255,255,0.08)', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'rgba(255,255,255,0.6)' }}><ChevronLeft size={16}/></button>
                <button onClick={nextMonth} style={{ width:34, height:34, background:BG2, border:'1px solid rgba(255,255,255,0.08)', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'rgba(255,255,255,0.6)' }}><ChevronRight size={16}/></button>
                <div style={{ fontFamily:BEBAS, fontSize:22, letterSpacing:2, color:'#fff', marginLeft:4 }}>{MONTHS[month]} {year}</div>
              </div>

              {/* Month view */}
              {view === 'month' && (
                <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, overflow:'hidden' }}>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
                    {DAYS.map(d => (
                      <div key={d} style={{ padding:'10px 0', textAlign:'center', fontSize: 14, fontFamily:BARLOW, fontWeight:700, color:'rgba(255,255,255,0.4)', letterSpacing:1 }}>{d}</div>
                    ))}
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)' }}>
                    {Array.from({ length:totalCells }, (_,i) => {
                      const dayNum = i - firstDay + 1;
                      const isCurrentMonth = dayNum >= 1 && dayNum <= totalDays;
                      const key = dateKey(year, month, dayNum);
                      const isToday = key === today;
                      const evts = isCurrentMonth ? visibleEvents(key) : [];
                      const colIndex = i % 7;
                      let displayNum = dayNum;
                      if (dayNum < 1) displayNum = daysInMonth(year, month === 0 ? 11 : month-1) + dayNum;
                      else if (dayNum > totalDays) displayNum = dayNum - totalDays;

                      return (
                        <div key={i}
                          onClick={() => { if (isCurrentMonth) { setSelectedDay(key); setShowAdd(true); } }}
                          style={{ minHeight:110, padding:'8px 6px 6px', borderRight: colIndex<6 ? '1px solid rgba(255,255,255,0.04)' : 'none', borderBottom:'1px solid rgba(255,255,255,0.04)', background: isToday ? 'rgba(212,166,74,0.05)' : 'transparent', cursor: isCurrentMonth ? 'pointer' : 'default' }}
                          onMouseEnter={e => { if (isCurrentMonth && !isToday) (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.02)'; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = isToday ? 'rgba(212,166,74,0.05)' : 'transparent'; }}
                        >
                          <div style={{ width:26, height:26, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:4, background: isToday ? GOLD : 'transparent', fontSize:14, fontFamily:BARLOW, fontWeight: isToday ? 700 : 400, color: isToday ? BG : isCurrentMonth ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.2)' }}>
                            {displayNum}
                          </div>
                          {evts.slice(0,2).map((ev, ei) => (
                            <div key={ei} style={{ display:'flex', alignItems:'center', gap:4, marginBottom:3, padding:'2px 5px', borderRadius:3, background:`${evColor(ev.type)}18`, overflow:'hidden' }}>
                              <div style={{ width:6, height:6, borderRadius:'50%', background:evColor(ev.type), flexShrink:0 }} />
                              <div style={{ overflow:'hidden' }}>
                                <div style={{ fontSize: 14, fontFamily:BARLOW, fontWeight:600, color:evColor(ev.type), whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{ev.title}</div>
                                <div style={{ fontSize: 14, color:'rgba(255,255,255,0.4)', fontFamily:BARLOW }}>{ev.time}</div>
                              </div>
                            </div>
                          ))}
                          {evts.length > 2 && <div style={{ fontSize: 14, color:'rgba(255,255,255,0.35)', fontFamily:BARLOW, paddingLeft:4 }}>+{evts.length-2} more</div>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* List view */}
              {view === 'list' && (
                <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, overflow:'hidden' }}>
                  {listEvents.length === 0 ? (
                    <div style={{ textAlign:'center', padding:48, color:'rgba(255,255,255,0.3)', fontFamily:BARLOW, fontSize:16 }}>No events this month</div>
                  ) : listEvents.map((ev, i) => (
                    <div key={i} style={{ display:'flex', alignItems:'center', gap:16, padding:'14px 20px', borderBottom: i < listEvents.length-1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}
                      onMouseEnter={e => (e.currentTarget.style.background='rgba(255,255,255,0.02)')}
                      onMouseLeave={e => (e.currentTarget.style.background='transparent')}
                    >
                      <div style={{ width:40, height:40, borderRadius:8, background:`${evColor(ev.type)}18`, border:`1px solid ${evColor(ev.type)}40`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                        <div style={{ width:10, height:10, borderRadius:'50%', background:evColor(ev.type) }} />
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:16, fontFamily:BARLOW, fontWeight:700, color:'#fff', marginBottom:2 }}>{ev.title}</div>
                        <div style={{ fontSize:14, color:'rgba(255,255,255,0.4)', fontFamily:BARLOW }}>{MONTHS[month]} {ev.dayNum}, {year} · {ev.time}</div>
                      </div>
                      <div style={{ fontSize: 14, fontFamily:BARLOW, fontWeight:700, color:evColor(ev.type), background:`${evColor(ev.type)}18`, border:`1px solid ${evColor(ev.type)}30`, borderRadius:20, padding:'3px 10px', whiteSpace:'nowrap' as const }}>
                        {ev.type}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Week view */}
              {view === 'week' && (
                <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:20, textAlign:'center' as const }}>
                  <div style={{ fontSize:20, fontFamily:BARLOW, color:'rgba(255,255,255,0.4)', marginBottom:8 }}>Week view</div>
                  <div style={{ fontSize:15, color:'rgba(255,255,255,0.25)', fontFamily:BARLOW }}>Use Month or List view for now.</div>
                </div>
              )}

              {/* Legend */}
              {view === 'month' && (
                <div style={{ display:'flex', gap:20, flexWrap:'wrap' as const }}>
                  {EVENT_TYPES.map(et => (
                    <div key={et.key} style={{ display:'flex', alignItems:'center', gap:6, fontSize:14, fontFamily:BARLOW, color:'rgba(255,255,255,0.5)' }}>
                      <div style={{ width:8, height:8, borderRadius:'50%', background:et.color }} /> {et.label}
                    </div>
                  ))}
                </div>
              )}

              {/* Reminder banner */}
              <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:'16px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:16, flexWrap:'wrap' as const }}>
                <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                  <div style={{ width:44, height:44, borderRadius:10, background:'rgba(212,166,74,0.1)', border:'1px solid rgba(212,166,74,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>🔔</div>
                  <div>
                    <div style={{ fontSize:17, fontFamily:BARLOW, fontWeight:700, color:'#fff', marginBottom:2 }}>Never Miss a Casting</div>
                    <div style={{ fontSize:14, color:'rgba(255,255,255,0.4)', fontFamily:BARLOW }}>Enable calendar reminders and get notified before your important events.</div>
                  </div>
                </div>
                <button style={{ display:'flex', alignItems:'center', gap:7, background:'none', border:`1px solid ${GOLD}`, borderRadius:8, padding:'9px 18px', color:GOLD, fontSize:15, fontFamily:BARLOW, fontWeight:700, cursor:'pointer', whiteSpace:'nowrap' as const }}>
                  🔔 Enable Reminders
                </button>
              </div>
            </div>

            {/* ── RIGHT PANEL (sticky like aspirant) ── */}
            <div style={{ width:260, flexShrink:0, borderLeft:'1px solid rgba(255,255,255,0.07)', padding:'24px 16px', display:'flex', flexDirection:'column' as const, gap:24, position:'sticky' as const, top:0 }}>

              {/* Today's Schedule */}
              <div>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
                  <div style={{ fontSize:17, fontFamily:BARLOW, fontWeight:700, color:'#fff' }}>Today · 24 Jun</div>
                  <button onClick={() => setView('list')} style={{ background:'none', border:'none', color:GOLD, fontSize:14, fontFamily:BARLOW, fontWeight:700, cursor:'pointer' }}>View All</button>
                </div>
                <div style={{ display:'flex', flexDirection:'column' as const, gap:12 }}>
                  {todayEvents.slice(0,4).map((ev,i) => (
                    <div key={i} style={{ display:'flex', gap:10, paddingBottom:12, borderBottom: i < Math.min(todayEvents.length,4)-1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                      <div style={{ width:3, background:evColor(ev.type), borderRadius:2, flexShrink:0 }} />
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:15, fontFamily:BARLOW, fontWeight:700, color:'#fff', marginBottom:2 }}>{ev.title}</div>
                        <div style={{ display:'flex', alignItems:'center', gap:4, fontSize: 14, color:'rgba(255,255,255,0.4)', fontFamily:BARLOW, marginBottom:2 }}>
                          <Clock size={11} strokeWidth={1.8} /> {ev.time}
                        </div>
                        <div style={{ display:'flex', alignItems:'center', gap:4, fontSize: 14, color:'rgba(255,255,255,0.3)', fontFamily:BARLOW }}>
                          <MapPin size={11} strokeWidth={1.8} /> {ev.location}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming */}
              <div>
                <div style={{ fontSize:17, fontFamily:BARLOW, fontWeight:700, color:'#fff', marginBottom:14 }}>Upcoming Events</div>
                <div style={{ display:'flex', flexDirection:'column' as const, gap:12 }}>
                  {upcoming.map((ev,i) => {
                    const d = new Date(ev.date+'T00:00:00');
                    return (
                      <div key={i} style={{ display:'flex', gap:12, paddingBottom:12, borderBottom: i < upcoming.length-1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                        <div style={{ textAlign:'center' as const, flexShrink:0, minWidth:44 }}>
                          <div style={{ fontFamily:BEBAS, fontSize:26, color:'#fff', lineHeight:1 }}>{d.getDate()}</div>
                          <div style={{ fontSize: 14, fontFamily:BARLOW, color:'rgba(255,255,255,0.4)', letterSpacing:0.5 }}>{MONTHS[d.getMonth()].slice(0,3).toUpperCase()}</div>
                        </div>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontSize: 14, fontFamily:BARLOW, fontWeight:700, color:evColor(ev.type), letterSpacing:0.5, textTransform:'uppercase' as const, marginBottom:2 }}>{ev.type}</div>
                          <div style={{ fontSize:15, fontFamily:BARLOW, fontWeight:700, color:'#fff', marginBottom:3 }}>{ev.title}</div>
                          <div style={{ display:'flex', alignItems:'center', gap:4, fontSize: 14, color:'rgba(255,255,255,0.4)', fontFamily:BARLOW }}>
                            <Clock size={11} strokeWidth={1.8} /> {ev.time}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Calendar Filters */}
              <div>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
                  <div style={{ fontSize:17, fontFamily:BARLOW, fontWeight:700, color:'#fff' }}>Calendar Filters</div>
                  <button onClick={() => { const allOn = Object.values(filters).every(v=>v); setFilters({ Audition:!allOn, Callback:!allOn, 'Look Test':!allOn, Meeting:!allOn, Other:!allOn }); }} style={{ background:'none', border:'none', color:GOLD, fontSize:14, fontFamily:BARLOW, fontWeight:700, cursor:'pointer' }}>
                    {Object.values(filters).every(v=>v) ? 'Clear All' : 'Show All'}
                  </button>
                </div>
                <div style={{ display:'flex', flexDirection:'column' as const, gap:8 }}>
                  {EVENT_TYPES.map(et => (
                    <div key={et.key} onClick={() => toggleFilter(et.key)} style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer', padding:'4px 0' }}>
                      <div style={{ width:20, height:20, borderRadius:5, background: filters[et.key as keyof typeof filters] ? et.color : 'rgba(255,255,255,0.08)', border:`1px solid ${filters[et.key as keyof typeof filters] ? et.color : 'rgba(255,255,255,0.15)'}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                        {filters[et.key as keyof typeof filters] && <span style={{ color:'#fff', fontSize: 14, fontWeight:700 }}>✓</span>}
                      </div>
                      <span style={{ fontSize:15, fontFamily:BARLOW, color: filters[et.key as keyof typeof filters] ? '#fff' : 'rgba(255,255,255,0.4)' }}>{et.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sync Calendar */}
              <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:16 }}>
                <div style={{ fontSize:16, fontFamily:BARLOW, fontWeight:700, color:'#fff', marginBottom:6 }}>Sync Calendar</div>
                <div style={{ fontSize:14, color:'rgba(255,255,255,0.4)', fontFamily:BARLOW, lineHeight:1.6, marginBottom:12 }}>Connect your calendar to stay updated with all events.</div>
                {[
                  { name:'Google Calendar', color:'#EA4335' },
                  { name:'Outlook Calendar', color:BLUE },
                  { name:'Apple Calendar', color:'#F5F5F5' },
                ].map(cal => (
                  <button key={cal.name} style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:'9px 12px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:8, marginBottom:8, cursor:'pointer', color:'#F5F5F5', fontFamily:BARLOW, fontSize:14, fontWeight:600 }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor=cal.color)}
                    onMouseLeave={e => (e.currentTarget.style.borderColor='rgba(255,255,255,0.08)')}
                  >
                    <div style={{ width:26, height:26, borderRadius:6, background:cal.color, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:BEBAS, fontSize:14, color:'#fff', flexShrink:0 }}>
                      {cal.name[0]}
                    </div>
                    {cal.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invite Team Modal */}
      {showInvite && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', zIndex:500, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ background:BG2, border:'1px solid rgba(255,255,255,0.1)', borderRadius:14, width:440, padding:28 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
              <div style={{ fontFamily:BEBAS, fontSize:20, color:'#F5F5F5', letterSpacing:1 }}>INVITE TEAM TO CALENDAR</div>
              <button onClick={() => setShowInvite(false)} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.5)', cursor:'pointer' }}><X size={18}/></button>
            </div>
            <div style={{ marginBottom:14 }}>
              <label style={{ display:'block', fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.5)', marginBottom:5 }}>Email Addresses</label>
              <input placeholder="Enter team member emails, comma-separated…" style={{ width:'100%', background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:6, padding:'10px 12px', color:'#F5F5F5', fontFamily:BARLOW, fontSize:14, outline:'none', boxSizing:'border-box' as const }} />
            </div>
            <div style={{ marginBottom:14 }}>
              <label style={{ display:'block', fontFamily:BARLOW, fontSize: 14, color:'rgba(255,255,255,0.5)', marginBottom:5 }}>Permission</label>
              <select style={{ width:'100%', background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:6, padding:'9px 12px', color:'#F5F5F5', fontFamily:BARLOW, fontSize:14, outline:'none' }}>
                <option>View Only</option><option>Can Edit</option><option>Full Access</option>
              </select>
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={() => setShowInvite(false)} style={{ flex:1, padding:10, background:BG3, border:'1px solid rgba(255,255,255,0.1)', borderRadius:6, color:'rgba(255,255,255,0.6)', fontFamily:BARLOW, fontSize:14, cursor:'pointer' }}>Cancel</button>
              <button onClick={() => setShowInvite(false)} style={{ flex:2, padding:10, background:GOLD, border:'none', borderRadius:6, color:BG, fontFamily:BEBAS, fontSize:17, letterSpacing:1, cursor:'pointer' }}>Send Invites</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}