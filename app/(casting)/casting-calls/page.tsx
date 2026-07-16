'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import Link from 'next/link'
import SilverScreensLogo from '@/components/ui/SilverScreensLogo'
import { useRouter } from 'next/navigation'
import {
  Search, MapPin, Clock, Users, Lock, Briefcase,
  Calendar, Bookmark, X, LogIn, ChevronDown, ChevronLeft, Menu, Bell, MessageSquare,
  Film, Tv, Music, Mic2, Star, Clapperboard, SlidersHorizontal,
  LayoutDashboard, FileText,
} from 'lucide-react'

/* ── TOKENS ── */
const RED    = '#C8202A'
const GOLD   = '#D4A64A'
const BG     = '#050505'
const BG2    = '#0B0F14'
const BG3    = '#121821'
const BG4    = '#1C2030'
const BARLOW = '"Barlow Condensed", sans-serif'
const BEBAS  = "'Bebas Neue', sans-serif"
const GUEST_FREE = 3

const SIDEBAR_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard',            href: '/dashboard'        },
  { icon: FileText,        label: 'My Applications',      href: '/my-applications'  },
  { icon: MessageSquare,   label: 'Messages',             href: '/messages',         badge: 2 },
  { icon: Mic2,            label: 'Auditions',            href: '/auditions'         },
  { icon: Bookmark,        label: 'Saved Castings',       href: '/saved-castings'   },
  { icon: Star,            label: 'Recommended Castings', href: '/recommended'      },
  { icon: Bell,            label: 'Notifications',        href: '/notifications',    badge: 3 },
]

const DROPDOWN_LINKS = [
  { label: 'My Profile',   href: '/my-profile'            },
  { label: 'Subscription', href: '/dashboard/subscription' },
  { label: 'Analytics',    href: '/analytics'             },
  { label: 'Calendar',     href: '/calendar'              },
  { label: 'Settings',     href: '/settings'              },
  { label: 'Support',      href: '/contact'               },
  { label: 'Logout',       href: ''                       },
]

/* ── DATA ── */
const CASTINGS = [
  { id: 1,  title: 'Lead Actor Required',                   project: 'Ek Baar Phir',             studio: 'Dharma Productions',         verified: true,  type: 'Feature Film', role: 'Lead Actor',        gender: 'Male',   ageRange: '25–35', location: 'Mumbai',    shootStart: 'Aug 2025', deadline: 'Jul 10, 2025', daysLeft: 8,  auditDate: '5–8 Jul 2025',  compensation: '₹2,00,000 – ₹2,50,000',     compType: 'Paid',    experience: 'Experienced', category: 'Actor',        applicants: 142, languages: ['Hindi'],             desc: 'Seeking a charismatic lead for a romantic drama set in modern Mumbai. Strong dialogue delivery and emotional range essential. Prior feature film experience preferred.',                     tags: ['Lead Role', 'Male', '25–35 Yrs', 'Hindi'],         img: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=160&h=120&fit=crop', urgent: true,  featured: true  },
  { id: 2,  title: 'Female Lead Required',                  project: 'Rising Tides (Season 1)',   studio: 'Oceanic Originals',          verified: true,  type: 'Web Series',   role: 'Lead Actress',      gender: 'Female', ageRange: '20–30', location: 'Goa',       shootStart: 'Sep 2025', deadline: 'Jul 18, 2025', daysLeft: 16, auditDate: '18–22 Jul 2025', compensation: '₹80,000 – ₹1,20,000 / ep',  compType: 'Paid',    experience: 'Experienced', category: 'Actor',        applicants: 87,  languages: ['English','Hindi'],  desc: 'Premium OTT web series seeking a compelling female lead with strong screen presence. 8-episode season shooting in Goa. Must be comfortable with complex emotional arcs.',         tags: ['Lead Role', 'Female', '20–30 Yrs', 'English, Hindi'], img: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=160&h=120&fit=crop', urgent: false, featured: true  },
  { id: 3,  title: 'Supporting Role – College Student',     project: 'College Diaries',           studio: 'Campus Creations',           verified: true,  type: 'TV Series',    role: 'Supporting Actor',  gender: 'Male',   ageRange: '18–25', location: 'Delhi',     shootStart: 'Aug 2025', deadline: 'Jul 8, 2025',  daysLeft: 6,  auditDate: '12–15 Jul 2025', compensation: '₹10,000 – ₹20,000 / ep',    compType: 'Paid',    experience: 'Any',         category: 'Actor',        applicants: 213, languages: ['Hindi'],             desc: 'Long-running TV series casting supporting roles for college-aged characters. 20-episode season. Fresh faces encouraged — natural energy matters more than training.',              tags: ['Supporting Role', 'Male', '18–25 Yrs', 'Hindi'],   img: 'https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?w=160&h=120&fit=crop', urgent: true,  featured: false },
  { id: 4,  title: 'Female Actor Required',                 project: 'Sunkissed',                 studio: 'Red Dot Studios',            verified: false, type: 'Short Film',   role: 'Lead Actress',      gender: 'Female', ageRange: '20–30', location: 'Bangalore', shootStart: 'Jun 2025', deadline: 'Jul 5, 2025',  daysLeft: 3,  auditDate: '10–13 Jul 2025', compensation: '₹5,000 – ₹10,000',          compType: 'Paid',    experience: 'Fresher',     category: 'Actor',        applicants: 34,  languages: ['Hindi'],             desc: 'Intimate short film exploring themes of self-discovery. Looking for a raw, honest performer with emotional availability. Freshers warmly welcome.',                              tags: ['Lead Role', 'Female', '20–30 Yrs', 'Hindi'],       img: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=160&h=120&fit=crop', urgent: true,  featured: false },
  { id: 5,  title: 'Background Dancers – Music Video',      project: 'Rang De (Single)',          studio: 'T-Series',                   verified: true,  type: 'Music Video',  role: 'Background Dancer', gender: 'Any',    ageRange: '18–30', location: 'Mumbai',    shootStart: 'Jul 2025', deadline: 'Jul 8, 2025',  daysLeft: 6,  auditDate: '8–9 Jul 2025',   compensation: '₹3,000 / day',              compType: 'Paid',    experience: 'Any',         category: 'Dancer',       applicants: 211, languages: ['Hindi'],             desc: 'Major label music video requiring 10 background dancers. Bollywood and contemporary fusion style. 3-day shoot. Good stamina and ability to pick up choreography quickly.',        tags: ['Group', 'Any Gender', '18–30 Yrs', 'Bollywood'],   img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=160&h=120&fit=crop', urgent: true,  featured: false },
  { id: 6,  title: 'Voice Artist – Animation Series',       project: 'Jungle Tales Season 2',     studio: 'Green Gold Animation',       verified: true,  type: 'OTT',          role: 'Voice Artist',      gender: 'Female', ageRange: '22–40', location: 'Remote',    shootStart: 'Aug 2025', deadline: 'Aug 1, 2025',  daysLeft: 30, auditDate: '20–22 Jul 2025', compensation: '₹50,000 – ₹80,000',         compType: 'Paid',    experience: 'Experienced', category: 'Voice Artist', applicants: 28,  languages: ['Hindi','English'],  desc: "Children's animation series returning for a second season. Warm, expressive female voice needed for the lead character. Must have home recording setup.",                        tags: ['Voice', 'Female', '22–40 Yrs', 'Remote'],          img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=120&fit=crop', urgent: false, featured: false },
  { id: 7,  title: 'Male Model – Grooming Brand TVC',       project: 'GQ Man Campaign',           studio: 'McCann Worldgroup India',    verified: true,  type: 'Ad Film',      role: 'Brand Face',        gender: 'Male',   ageRange: '22–32', location: 'Mumbai',    shootStart: 'Aug 2025', deadline: 'Jul 25, 2025', daysLeft: 23, auditDate: '25–27 Jul 2025', compensation: '₹1,50,000 – ₹3,00,000',     compType: 'Paid',    experience: 'Any',         category: 'Model',        applicants: 156, languages: ['Hindi','English'],  desc: "National TVC for a leading men's grooming brand. Looking for a sharp, well-groomed male with strong screen presence. Face will appear on national TV, print, and digital.",        tags: ['Brand Face', 'Male', '22–32 Yrs', 'National TVC'], img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=160&h=120&fit=crop', urgent: false, featured: true  },
  { id: 8,  title: 'Ensemble Cast – Theatre Production',    project: 'Andhera Ujala',             studio: 'Prithvi Theatre',            verified: true,  type: 'Theatre',      role: 'Ensemble Actor',    gender: 'Any',    ageRange: '20–50', location: 'Mumbai',    shootStart: 'Sep 2025', deadline: 'Jul 30, 2025', daysLeft: 28, auditDate: '28–30 Jul 2025', compensation: 'Stipend Provided',           compType: 'Stipend', experience: 'Any',         category: 'Actor',        applicants: 47,  languages: ['Hindi'],             desc: 'Original Hindi play exploring urban loneliness. Seeking 6 actors for ensemble cast. Strong stage presence and Hindi fluency mandatory. Physical theatre background a plus.',      tags: ['Ensemble', 'Any Gender', '20–50 Yrs', 'Hindi'],    img: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=160&h=120&fit=crop', urgent: false, featured: false },
  { id: 9,  title: 'Stunt Performer – Action Thriller',     project: 'Operation Zero',            studio: 'Prime Lens Studios',         verified: true,  type: 'Feature Film', role: 'Stunt Double',      gender: 'Male',   ageRange: '25–40', location: 'Chennai',   shootStart: 'Aug 2025', deadline: 'Jul 12, 2025', daysLeft: 10, auditDate: '14–15 Jul 2025', compensation: '₹80,000 – ₹1,20,000',       compType: 'Paid',    experience: 'Experienced', category: 'Stunt Artist', applicants: 19,  languages: ['Tamil','Hindi'],    desc: 'High-octane action film requiring a trained stunt performer for the male lead double. Martial arts background essential. Wire work and vehicle stunts experience preferred.',    tags: ['Stunts', 'Male', '25–40 Yrs', 'Martial Arts'],     img: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=160&h=120&fit=crop', urgent: true,  featured: false },
  { id: 10, title: 'Indie Film – Lead Actress',             project: 'Khaali Raaste',             studio: 'Independent / Student Film', verified: false, type: 'Short Film',   role: 'Lead Actress',      gender: 'Female', ageRange: '20–30', location: 'Bangalore', shootStart: 'Aug 2025', deadline: 'Aug 5, 2025',  daysLeft: 34, auditDate: '1–3 Aug 2025',   compensation: 'Credited / Unpaid',         compType: 'Unpaid',  experience: 'Fresher',     category: 'Actor',        applicants: 22,  languages: ['Kannada','Hindi'],  desc: 'FTII student graduation film about a woman navigating grief in a new city. No prior experience needed — passion and emotional availability matter most.',                       tags: ['Student Film', 'Female', '20–30 Yrs', 'Indie'],    img: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=160&h=120&fit=crop', urgent: false, featured: false },
]

const ALL_TYPES    = ['All Castings', 'Feature Film', 'Web Series', 'TV Series', 'OTT', 'Ad Film', 'Short Film', 'Music Video', 'Theatre']
const LOCATIONS    = ['All Locations', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune', 'Chennai', 'Bangalore', 'Goa', 'Remote']
const EXP_LEVELS   = ['All Levels', 'Fresher', 'Any', 'Experienced']
const COMP_TYPES   = ['All Types', 'Paid', 'Unpaid', 'Stipend']
const GENDERS      = ['All Genders', 'Male', 'Female', 'Any']
const SORT_OPTS    = ['Newest', 'Deadline Soon', 'Most Applied']
const CATEGORIES   = ['All', 'Actor', 'Model', 'Dancer', 'Voice Artist', 'Stunt Artist']

const TYPE_ICONS: Record<string, React.ReactNode> = {
  'All Castings': <Clapperboard size={15} />,
  'Feature Film': <Film size={15} />,
  'Web Series':   <Tv size={15} />,
  'TV Series':    <Tv size={15} />,
  'OTT':          <Star size={15} />,
  'Ad Film':      <Briefcase size={15} />,
  'Short Film':   <Film size={15} />,
  'Music Video':  <Music size={15} />,
  'Theatre':      <Mic2 size={15} />,
}

/* ── TYPE_COUNTS is now computed dynamically from fetched data ── */
function buildTypeCounts(list: typeof CASTINGS): Record<string, number> {
  return list.reduce((acc, c) => {
    acc['All Castings'] = (acc['All Castings'] || 0) + 1
    acc[c.type]         = (acc[c.type]         || 0) + 1
    return acc
  }, {} as Record<string, number>)
}

/* ── Auth header helper ── */
function getAuthHeaders(): Record<string, string> {
  try {
    const u = JSON.parse(localStorage.getItem('ss_user') || '{}')
    return u.token ? { Authorization: `Bearer ${u.token}` } : {}
  } catch { return {} }
}

/* ── Type badge ── */
function typeBadge(type: string) {
  const map: Record<string, { bg: string; border: string; text: string }> = {
    'Feature Film': { bg: 'rgba(200,32,42,0.15)',  border: 'rgba(200,32,42,0.35)',  text: '#e05560' },
    'Web Series':   { bg: 'rgba(212,166,74,0.15)', border: 'rgba(212,166,74,0.35)', text: GOLD      },
    'TV Series':    { bg: 'rgba(99,102,241,0.15)', border: 'rgba(99,102,241,0.35)', text: '#818cf8' },
    'OTT':          { bg: 'rgba(99,102,241,0.12)', border: 'rgba(99,102,241,0.3)',  text: '#818cf8' },
    'Ad Film':      { bg: 'rgba(34,197,94,0.12)',  border: 'rgba(34,197,94,0.3)',   text: '#4ade80' },
    'Short Film':   { bg: 'rgba(255,255,255,0.06)',border: 'rgba(255,255,255,0.12)',text: 'rgba(255,255,255,0.5)' },
    'Music Video':  { bg: 'rgba(236,72,153,0.12)', border: 'rgba(236,72,153,0.3)',  text: '#f472b6' },
    'Theatre':      { bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)',  text: '#fbbf24' },
  }
  return map[type] ?? { bg: 'rgba(255,255,255,0.06)', border: 'rgba(255,255,255,0.12)', text: 'rgba(255,255,255,0.5)' }
}

/* ── Custom dark dropdown (no white background) ── */
function FilterDropdown({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const isDefault = value === options[0]

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 1, marginBottom: 6 }}>{label}</div>
      <div ref={ref} style={{ position: 'relative' as const }}>
        <div onClick={() => setOpen(v => !v)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: BG4, border: `1px solid ${open ? RED : isDefault ? 'rgba(255,255,255,0.1)' : 'rgba(200,32,42,0.4)'}`, borderRadius: 8, padding: '9px 12px', cursor: 'pointer' }}>
          <span style={{ fontSize: 15, color: isDefault ? 'rgba(255,255,255,0.4)' : '#fff', fontFamily: BARLOW }}>{value}</span>
          <ChevronDown size={13} color="rgba(255,255,255,0.4)" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
        </div>
        {open && (
          <div style={{ position: 'absolute' as const, top: 'calc(100% + 3px)', left: 0, right: 0, background: BG3, border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, overflow: 'hidden', zIndex: 300, boxShadow: '0 8px 24px rgba(0,0,0,0.6)', maxHeight: 220, overflowY: 'auto' as const }}>
            {options.map(opt => (
              <div key={opt} onClick={() => { onChange(opt); setOpen(false) }} style={{ padding: '10px 12px', fontSize: 15, fontFamily: BARLOW, cursor: 'pointer', color: value === opt ? RED : 'rgba(255,255,255,0.7)', background: value === opt ? 'rgba(200,32,42,0.08)' : 'transparent', borderLeft: `2px solid ${value === opt ? RED : 'transparent'}` }}
                onMouseEnter={e => { if (value !== opt) e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
                onMouseLeave={e => { if (value !== opt) e.currentTarget.style.background = 'transparent' }}
              >{opt}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Guest blur overlay ── */
function GuestLockOverlay() {
  return (
    <div style={{ position: 'absolute' as const, inset: 0, zIndex: 10, backdropFilter: 'blur(6px)', background: 'rgba(5,5,5,0.55)', borderRadius: 10, display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', gap: 10 }}>
      <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(200,32,42,0.15)', border: '1px solid rgba(200,32,42,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Lock size={18} color={RED} />
      </div>
      <div style={{ fontSize: 16, fontFamily: BARLOW, fontWeight: 700, color: '#fff' }}>Sign in to Apply</div>
      <div style={{ fontSize: 14, fontFamily: BARLOW, color: 'rgba(255,255,255,0.45)', textAlign: 'center' as const, maxWidth: 180, lineHeight: 1.5 }}>Create a free account to view full details & apply</div>
      <Link href="/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: RED, color: '#fff', textDecoration: 'none', fontSize: 14, fontFamily: BARLOW, fontWeight: 700, padding: '8px 20px', borderRadius: 6, marginTop: 4 }}>
        <LogIn size={14} /> Sign Up
      </Link>
    </div>
  )
}

/* ── Casting Card ── */
function CastingCard({ c, blurred }: { c: typeof CASTINGS[0]; blurred: boolean }) {
  const badge  = typeBadge(c.type)
  const urgent = c.daysLeft <= 7
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (saving) return
    setSaving(true)
    try {
      const u = JSON.parse(localStorage.getItem('ss_user') || '{}')
      const token = u.token
      if (!token) { window.location.href = '/login'; return }
      if (saved) {
        await fetch(`/api/saved-castings?casting_call_id=${c.id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
        setSaved(false)
      } else {
        await fetch('/api/saved-castings', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ casting_call_id: c.id }) })
        setSaved(true)
      }
    } catch {} finally { setSaving(false) }
  }

  return (
    <div style={{ position: 'relative' as const }}>
      {blurred && <GuestLockOverlay />}
      <div style={{ background: BG2, border: `1px solid ${c.featured ? 'rgba(212,166,74,0.2)' : 'rgba(255,255,255,0.07)'}`, borderLeft: `3px solid ${c.featured ? GOLD : urgent ? RED : 'rgba(255,255,255,0.1)'}`, borderRadius: 10, display: 'grid', gridTemplateColumns: '140px 1fr auto', overflow: 'hidden', transition: 'background 0.2s, transform 0.2s', filter: blurred ? 'blur(2px)' : 'none' }}
        onMouseEnter={e => { if (!blurred) { (e.currentTarget as HTMLDivElement).style.background = BG3; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)' } }}
        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = BG2; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)' }}
      >
        {/* Thumbnail */}
        <div style={{ position: 'relative' as const, width: 140, flexShrink: 0 }}>
          <img src={c.img} alt={c.project} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          <div style={{ position: 'absolute' as const, top: 10, left: 10, background: badge.bg, border: `1px solid ${badge.border}`, backdropFilter: 'blur(8px)', color: badge.text, fontSize: 13, fontFamily: BARLOW, fontWeight: 700, padding: '3px 8px', borderRadius: 4, letterSpacing: 0.5, textTransform: 'uppercase' as const }}>{c.type}</div>
          {c.featured && <div style={{ position: 'absolute' as const, bottom: 10, left: 10, background: GOLD, color: '#050505', fontSize: 13, fontFamily: BARLOW, fontWeight: 700, padding: '2px 8px', borderRadius: 4, letterSpacing: 1, textTransform: 'uppercase' as const }}>Featured</div>}
        </div>

        {/* Main info */}
        <div style={{ padding: '16px 20px', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5, flexWrap: 'wrap' as const }}>
            <Link href={`/casting-calls/${c.id}`} style={{ fontSize: 19, fontFamily: BARLOW, fontWeight: 700, color: '#fff', textDecoration: 'none' }}
              onMouseEnter={e => (e.target as HTMLElement).style.color = RED}
              onMouseLeave={e => (e.target as HTMLElement).style.color = '#fff'}
            >{c.title}</Link>
            {urgent && <span style={{ background: 'rgba(200,32,42,0.12)', border: '1px solid rgba(200,32,42,0.3)', color: RED, fontSize: 13, fontFamily: BARLOW, fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>⚡ Urgent</span>}
          </div>
          <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', fontFamily: BARLOW, marginBottom: 12 }}>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>{c.project}</span>
            <span style={{ margin: '0 8px', opacity: 0.3 }}>by</span>
            {c.studio}
            {c.verified && <span style={{ display: 'inline-flex', alignItems: 'center', marginLeft: 5, color: '#60a5fa', fontSize: 13 }}>✔</span>}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 5, marginBottom: 12 }}>
            {c.tags.map(tag => <span key={tag} style={{ background: BG4, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '3px 10px', fontSize: 14, color: 'rgba(255,255,255,0.55)', fontFamily: BARLOW }}>{tag}</span>)}
          </div>
          <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' as const }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 14, color: 'rgba(255,255,255,0.45)', fontFamily: BARLOW }}><MapPin size={12} color="rgba(255,255,255,0.3)" />{c.location}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 14, color: 'rgba(255,255,255,0.45)', fontFamily: BARLOW }}><Calendar size={12} color="rgba(255,255,255,0.3)" />Audition: {c.auditDate}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 14, color: 'rgba(255,255,255,0.45)', fontFamily: BARLOW }}><Users size={12} color="rgba(255,255,255,0.3)" />{c.applicants} applied</span>
          </div>
        </div>

        {/* Right panel */}
        <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column' as const, justifyContent: 'space-between', minWidth: 190 }}>
          <div>
            <div style={{ fontSize: 17, fontFamily: BARLOW, fontWeight: 700, color: GOLD, marginBottom: 5 }}>{c.compensation}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', fontFamily: BARLOW, marginBottom: 12 }}>{c.compType}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 14, color: urgent ? RED : 'rgba(255,255,255,0.4)', fontFamily: BARLOW, fontWeight: urgent ? 700 : 400, marginBottom: 14 }}>
              <Clock size={12} color={urgent ? RED : 'rgba(255,255,255,0.3)'} />
              Deadline: {c.deadline}
              {urgent && <span style={{ marginLeft: 4, fontSize: 13 }}>({c.daysLeft}d left)</span>}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 7 }}>
            <Link href={`/casting-calls/${c.id}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: RED, color: '#fff', textDecoration: 'none', fontSize: 15, fontFamily: BARLOW, fontWeight: 700, padding: '9px 0', borderRadius: 7 }}>Apply Now</Link>
            <button onClick={handleSave} disabled={saving} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: saved ? 'rgba(212,166,74,0.1)' : 'transparent', border: `1px solid ${saved ? GOLD : 'rgba(255,255,255,0.15)'}`, color: saved ? GOLD : 'rgba(255,255,255,0.55)', fontSize: 14, fontFamily: BARLOW, padding: '7px 0', borderRadius: 7, cursor: saving ? 'default' : 'pointer' }}>
              <Bookmark size={13} fill={saved ? GOLD : 'none'} color={saved ? GOLD : 'rgba(255,255,255,0.55)'} /> {saving ? '...' : saved ? 'Saved' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── MAIN PAGE ── */
export default function CastingCallsPage() {
  const router = useRouter()
  const [activeType,   setActiveType]   = useState('All Castings')
  const [search,       setSearch]       = useState('')
  const [location,     setLocation]     = useState('All Locations')
  const [experience,   setExperience]   = useState('All Levels')
  const [compType,     setCompType]     = useState('All Types')
  const [gender,       setGender]       = useState('All Genders')
  const [category,     setCategory]     = useState('All')
  const [sort,         setSort]         = useState('Newest')
  const [sortOpen,     setSortOpen]     = useState(false)
  const [isLoggedIn,   setIsLoggedIn]   = useState(false)
  const [sidebarOpen,  setSidebarOpen]  = useState(false)
  const [filterOpen,   setFilterOpen]   = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [userName,     setUserName]     = useState('My Account')
  const [userPhoto,    setUserPhoto]    = useState('')

  /* ── Live data ── */
  const [castings,    setCastings]    = useState(CASTINGS)   // fallback = hardcoded
  const [loading,     setLoading]     = useState(true)
  const [notifCount,  setNotifCount]  = useState(3)
  const [msgCount,    setMsgCount]    = useState(2)

  const handleLogout = () => {
    localStorage.removeItem('ss_user')
    window.location.replace('/login')
  }

  /* ── Auth check + load user instantly ── */
  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('ss_user') || '{}')
      if (u?.loggedIn) {
        setIsLoggedIn(true)
        if (u.name) setUserName(u.name)
      }
    } catch {}
  }, [])

  /* ── Fetch casting calls + live badge counts ── */
  useEffect(() => {
    const h = getAuthHeaders()

    // Fetch casting calls
    fetch('/api/casting-calls?limit=100', { headers: h })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return
        const list = data.data?.casting_calls ?? data.castingCalls ?? data.data ?? data
        if (!Array.isArray(list) || list.length === 0) return

        // Normalise API shape → CastingCard shape
        const normalised = list.map((c: any) => {
          const deadlineDate = c.last_application_date ?? c.applicationDeadline
          const daysLeft = deadlineDate
            ? Math.max(0, Math.floor((new Date(deadlineDate).getTime() - Date.now()) / 86400000))
            : c.daysLeft ?? 30

          const budgetMin = c.budget_min ?? c.budgetMin
          const budgetMax = c.budget_max ?? c.budgetMax
          const compensation = budgetMin && budgetMax
            ? `₹${Number(budgetMin).toLocaleString('en-IN')} – ₹${Number(budgetMax).toLocaleString('en-IN')}`
            : c.compensation_details ?? c.compensation ?? ''

          return {
            id:           c.id          ?? c._id ?? Math.random(),
            title:        c.title       ?? c.name ?? '',
            project:      c.project_type ?? c.projectName ?? c.project ?? c.title ?? '',
            studio:       c.agency_profiles?.company_name ?? c.agency?.name ?? c.companyName ?? c.studio ?? '',
            verified:     c.agency_profiles?.verification_status === 'approved' ?? c.verified ?? false,
            type:         c.project_type ?? c.projectType ?? c.type ?? 'Feature Film',
            role:         c.role_name   ?? c.role ?? '',
            gender:       c.gender_preference ?? c.gender ?? 'Any',
            ageRange:     c.age_min && c.age_max ? `${c.age_min}–${c.age_max}` : c.ageRange ?? c.age ?? '',
            location:     c.location    ?? c.city ?? '',
            shootStart:   '',
            deadline:     deadlineDate
              ? new Date(deadlineDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
              : c.deadline ?? '',
            daysLeft,
            auditDate:    c.audition_details ?? c.auditionDate ?? c.auditDate ?? '',
            compensation,
            compType:     c.compensation_details ? 'Paid' : c.compType ?? 'Paid',
            experience:   c.experience_level ?? c.experienceLevel ?? c.experience ?? 'Any',
            category:     c.category ?? c.department ?? 'Actor',
            applicants:   c._count?.applications ?? c.applications_count ?? c.applicationCount ?? c.applicants ?? 0,
            languages:    Array.isArray(c.languages_required) ? c.languages_required : Array.isArray(c.languages) ? c.languages : [],
            desc:         c.role_description ?? c.description ?? c.desc ?? '',
            tags:         [c.role_name ?? c.role, c.gender_preference ?? c.gender, c.age_min && c.age_max ? `${c.age_min}–${c.age_max} Yrs` : ''].filter(Boolean),
            img:          c.coverImage ?? c.img ?? 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=160&h=120&fit=crop',
            urgent:       daysLeft <= 7,
            featured:     c.featured ?? c.isFeatured ?? false,
          }
        })
        setCastings(normalised)
      })
      .catch(() => {}) // keep fallback CASTINGS on error
      .finally(() => setLoading(false))

    // Notifications count (logged-in only)
    fetch('/api/notifications', { headers: h })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return
        const list = data.notifications ?? data
        if (Array.isArray(list)) setNotifCount(list.filter((n: any) => !n.read && !n.isRead).length)
      })
      .catch(() => {})

    // Messages count (logged-in only)
    fetch('/api/messages/conversations', { headers: h })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return
        const list = data.conversations ?? data
        if (Array.isArray(list)) setMsgCount(list.filter((c: any) => c.unreadCount > 0).length)
      })
      .catch(() => {})
  }, [])

  const SB_W = sidebarOpen ? 230 : 52

  // TYPE_COUNTS now reflects real fetched data
  const TYPE_COUNTS = useMemo(() => buildTypeCounts(castings), [castings])

  const filtered = useMemo(() => {
    let list = castings.filter(c => {
      if (activeType !== 'All Castings' && c.type !== activeType) return false
      if (category !== 'All' && c.category !== category) return false
      if (search && !c.title.toLowerCase().includes(search.toLowerCase()) && !c.project.toLowerCase().includes(search.toLowerCase()) && !c.studio.toLowerCase().includes(search.toLowerCase()) && !c.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))) return false
      if (location !== 'All Locations' && c.location !== location) return false
      if (experience !== 'All Levels' && c.experience !== experience) return false
      if (compType !== 'All Types' && c.compType !== compType) return false
      if (gender !== 'All Genders' && c.gender !== gender) return false
      return true
    })
    if (sort === 'Deadline Soon')  list = [...list].sort((a, b) => a.daysLeft - b.daysLeft)
    if (sort === 'Most Applied')   list = [...list].sort((a, b) => b.applicants - a.applicants)
    return list
  }, [castings, activeType, category, search, location, experience, compType, gender, sort])

  const activeFilterCount = [
    location !== 'All Locations',
    experience !== 'All Levels',
    compType !== 'All Types',
    gender !== 'All Genders',
    category !== 'All',
  ].filter(Boolean).length

  function resetFilters() {
    setLocation('All Locations'); setExperience('All Levels')
    setCompType('All Types'); setGender('All Genders'); setCategory('All')
    setSearch('')
  }

  return (
    <div style={{ background: BG, color: '#F5F5F5', fontFamily: BARLOW, minHeight: '100vh', display: 'flex', flexDirection: 'column' as const }}>

      {/* ═══ TOPNAV ═══ */}
      <header style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '0 24px', height: 60, flexShrink: 0, background: BG2, borderBottom: '1px solid rgba(255,255,255,0.07)', position: 'sticky' as const, top: 0, zIndex: 100 }}>
        <SilverScreensLogo size="md" href="/" showTagline={false} />

        {/* Nav links */}
        <nav style={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'center', gap: 4 }}>
          {[
            { label: 'Home',            href: '/'               },
            { label: 'About Us',        href: '/about'          },
            { label: 'Explore Talents', href: '/explore-talents' },
            { label: 'Casting Calls',   href: '/casting-calls'  },
            { label: 'Pricing Plans',   href: '/pricing'        },
            { label: 'FAQs',            href: '/faq'            },
            { label: 'Contact Us',      href: '/contact'        },
          ].map(link => (
            <Link key={link.label} href={link.href} style={{ padding: '6px 10px', textDecoration: 'none', color: link.href === '/casting-calls' ? '#fff' : 'rgba(255,255,255,0.55)', fontSize: 15, fontFamily: BARLOW, fontWeight: link.href === '/casting-calls' ? 600 : 500, whiteSpace: 'nowrap' as const, position: 'relative' as const }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={e => (e.currentTarget.style.color = link.href === '/casting-calls' ? '#fff' : 'rgba(255,255,255,0.55)')}
            >
              {link.label}
              {link.href === '/casting-calls' && <span style={{ position: 'absolute' as const, bottom: 0, left: 10, right: 10, height: 1, background: RED }} />}
            </Link>
          ))}
        </nav>
        {isLoggedIn ? (
          <>
            <button onClick={() => router.push('/casting-calls')} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'transparent', border: `1px solid ${GOLD}`, color: GOLD, borderRadius: 8, padding: '0 18px', height: 36, fontSize: 15, fontWeight: 600, fontFamily: BARLOW, cursor: 'pointer', whiteSpace: 'nowrap' as const }}>
              + Find Casting Calls
            </button>
            <div onClick={() => router.push('/notifications')} style={{ position: 'relative' as const, cursor: 'pointer' }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Bell size={16} /></div>
              {notifCount > 0 && <div style={{ position: 'absolute' as const, top: -5, right: -5, background: RED, borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>{notifCount}</div>}
            </div>
            <div onClick={() => router.push('/messages')} style={{ position: 'relative' as const, cursor: 'pointer' }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MessageSquare size={16} /></div>
              {msgCount > 0 && <div style={{ position: 'absolute' as const, top: -5, right: -5, background: RED, borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>{msgCount}</div>}
            </div>
            <div style={{ position: 'relative' as const }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => setDropdownOpen(v => !v)}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: RED, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: '#fff', border: `2px solid ${GOLD}` }}>
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.2 }}>{userName}</div>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)' }}>Aspirant</div>
                </div>
                <ChevronDown size={12} color="rgba(255,255,255,0.4)" />
              </div>
              {dropdownOpen && (
                <>
                  <div onClick={() => setDropdownOpen(false)} style={{ position: 'fixed' as const, inset: 0, zIndex: 150 }} />
                  <div style={{ position: 'absolute' as const, top: 46, right: 0, width: 190, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, overflow: 'hidden', zIndex: 200, boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}>
                    {DROPDOWN_LINKS.map(({ label, href }) => (
                      <div key={label}
                        onClick={() => { setDropdownOpen(false); label === 'Logout' ? handleLogout() : router.push(href) }}
                        style={{ padding: '11px 16px', fontSize: 16, cursor: 'pointer', color: label === 'Logout' ? '#ff6b6b' : '#fff', background: 'transparent', borderTop: label === 'Logout' ? '1px solid rgba(255,255,255,0.07)' : 'none' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >{label}</div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', gap: 10 }}>
            <Link href="/login"  style={{ padding: '8px 18px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', textDecoration: 'none', fontSize: 15, fontFamily: BARLOW, fontWeight: 600, borderRadius: 6 }}>Log In</Link>
            <Link href="/signup" style={{ padding: '8px 18px', background: RED, color: '#fff', textDecoration: 'none', fontSize: 15, fontFamily: BARLOW, fontWeight: 700, borderRadius: 6 }}>Sign Up</Link>
          </div>
        )}
      </header>

      {/* ═══ BODY ROW ═══ */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', height: 'calc(100vh - 60px)' }}>

      {/* ══ COLLAPSIBLE NAV SIDEBAR (logged-in only) ══ */}
      {isLoggedIn && (
        <aside style={{ width: SB_W, flexShrink: 0, background: BG2, borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column' as const, overflowY: 'auto' as const, overflowX: 'hidden', scrollbarWidth: 'none' as const, transition: 'width 0.2s ease' }}>
          <div style={{ height: 52, display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'flex-end' : 'center', padding: sidebarOpen ? '0 12px' : 0, borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
            <button onClick={() => setSidebarOpen(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', width: 30, height: 30, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            >{sidebarOpen ? <ChevronLeft size={16} /> : <Menu size={16} />}</button>
          </div>
          <nav style={{ flex: 1, padding: sidebarOpen ? '8px 6px' : '8px 4px', overflowY: 'auto' as const, scrollbarWidth: 'none' as const }}>
            {SIDEBAR_ITEMS.map(({ icon: Icon, label, href, badge }) => {
              const active = href === '/casting-calls'
              return (
                <div key={label} onClick={() => router.push(href)} title={!sidebarOpen ? label : undefined}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'space-between' : 'center', padding: sidebarOpen ? '8px 10px' : '10px 0', marginBottom: 2, borderRadius: 6, cursor: 'pointer', background: active ? 'rgba(200,32,42,0.12)' : 'transparent', borderLeft: sidebarOpen && active ? `3px solid ${RED}` : sidebarOpen ? '3px solid transparent' : 'none', position: 'relative' as const }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background = active ? 'rgba(200,32,42,0.12)' : 'transparent' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: sidebarOpen ? 9 : 0, justifyContent: 'center' }}>
                    <Icon size={15} color={active ? RED : 'rgba(255,255,255,0.42)'} strokeWidth={active ? 2.5 : 1.8} />
                    {sidebarOpen && <span style={{ fontSize: 15, fontWeight: active ? 600 : 400, color: active ? '#F5F5F5' : 'rgba(255,255,255,0.6)', whiteSpace: 'nowrap' as const }}>{label}</span>}
                  </div>
                  {sidebarOpen && badge && <div style={{ background: RED, color: '#fff', borderRadius: 10, fontSize: 13, fontWeight: 700, padding: '1px 6px', minWidth: 18, textAlign: 'center' as const }}>{badge}</div>}
                  {!sidebarOpen && badge && <div style={{ position: 'absolute' as const, top: 6, right: 4, background: RED, borderRadius: '50%', width: 14, height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: '#fff' }}>{badge}</div>}
                </div>
              )
            })}
          </nav>
          {sidebarOpen && (
            <div style={{ margin: '8px 10px 14px', borderRadius: 12, background: 'linear-gradient(135deg, #1a0507 0%, #2a0b0e 100%)', border: '1px solid rgba(200,32,42,0.25)', padding: '14px 12px', textAlign: 'center' as const, flexShrink: 0 }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>👑</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#F5F5F5', marginBottom: 3 }}>Upgrade to Premium</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 10, lineHeight: 1.5 }}>Increase your visibility and get more casting opportunities.</div>
              <button onClick={() => router.push('/dashboard/subscription')} style={{ width: '100%', background: GOLD, color: '#000', border: 'none', borderRadius: 8, padding: '8px 0', fontSize: 14, fontWeight: 700, fontFamily: BARLOW, cursor: 'pointer' }}>Upgrade Now</button>
            </div>
          )}
        </aside>
      )}

      {/* ══ SCROLLABLE CONTENT AREA ══ */}
      <div style={{ flex: 1, overflowY: 'auto' as const, display: 'flex' }}>

      {/* ══ FILTER SIDEBAR ══ */}
      <aside style={{ width: filterOpen ? 240 : 40, flexShrink: 0, background: BG2, borderRight: '1px solid rgba(255,255,255,0.07)', minHeight: '100%', display: 'flex', flexDirection: 'column' as const, transition: 'width 0.2s ease', overflow: 'hidden' }}>

        {/* Toggle button */}
        <div style={{ height: 52, display: 'flex', alignItems: 'center', justifyContent: filterOpen ? 'space-between' : 'center', padding: filterOpen ? '0 16px' : 0, borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
          {filterOpen && <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', fontFamily: BARLOW, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 1.5 }}>Browse & Filter</span>}
          <button onClick={() => setFilterOpen(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', width: 30, height: 30, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)', flexShrink: 0 }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            title={filterOpen ? 'Collapse filters' : 'Expand filters'}
          >{filterOpen ? <ChevronLeft size={16} /> : <SlidersHorizontal size={16} />}</button>
        </div>

        {filterOpen && (<>
        {/* Browse by type */}
        <div style={{ padding: '16px 0' }}>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', fontFamily: BARLOW, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 1.5, padding: '0 16px', marginBottom: 8 }}>Browse Categories</div>
          {ALL_TYPES.map(type => {
            const active = activeType === type
            const Icon   = TYPE_ICONS[type] || <Clapperboard size={15} />
            return (
              <div key={type} onClick={() => setActiveType(type)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', cursor: 'pointer', background: active ? 'rgba(200,32,42,0.12)' : 'transparent', borderLeft: active ? `3px solid ${RED}` : '3px solid transparent', transition: 'background 0.15s' }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ color: active ? RED : 'rgba(255,255,255,0.4)' }}>{Icon}</span>
                  <span style={{ fontSize: 16, fontFamily: BARLOW, color: active ? '#fff' : 'rgba(255,255,255,0.65)', fontWeight: active ? 600 : 400 }}>{type}</span>
                </div>
                <span style={{ fontSize: 14, fontFamily: BARLOW, color: active ? RED : 'rgba(255,255,255,0.3)', fontWeight: 600 }}>{TYPE_COUNTS[type] || 0}</span>
              </div>
            )
          })}
        </div>

        {/* Filters */}
        <div style={{ padding: '0 16px 16px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <span style={{ fontSize: 16, fontFamily: BARLOW, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: 6 }}>
              <SlidersHorizontal size={14} color={RED} /> Filters
              {activeFilterCount > 0 && <span style={{ background: RED, color: '#fff', fontSize: 12, fontFamily: BARLOW, fontWeight: 700, borderRadius: '50%', width: 18, height: 18, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{activeFilterCount}</span>}
            </span>
            {activeFilterCount > 0 && (
              <button onClick={resetFilters} style={{ background: 'none', border: 'none', color: RED, fontSize: 13, fontFamily: BARLOW, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                <X size={11} /> Clear
              </button>
            )}
          </div>
          <FilterDropdown label="Location"     value={location}   options={LOCATIONS}  onChange={setLocation}   />
          <FilterDropdown label="Experience"   value={experience} options={EXP_LEVELS} onChange={setExperience} />
          <FilterDropdown label="Compensation" value={compType}   options={COMP_TYPES} onChange={setCompType}   />
          <FilterDropdown label="Gender"       value={gender}     options={GENDERS}    onChange={setGender}     />
          <FilterDropdown label="Category"     value={category}   options={CATEGORIES} onChange={setCategory}   />
        </div>

        {/* Post a casting CTA */}
        <div style={{ margin: '4px 12px 20px', background: 'rgba(200,32,42,0.07)', border: '1px solid rgba(200,32,42,0.18)', borderRadius: 10, padding: 14 }}>
          <div style={{ fontSize: 16, fontFamily: BARLOW, fontWeight: 700, color: '#fff', marginBottom: 5 }}>Are you casting?</div>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, lineHeight: 1.55, margin: '0 0 12px' }}>Post your requirement and find the perfect talent.</p>
          <Link href="/post-casting" style={{ display: 'block', background: RED, color: '#fff', textAlign: 'center' as const, padding: '9px', borderRadius: 6, fontSize: 15, fontFamily: BARLOW, fontWeight: 700, textDecoration: 'none' }}>Post a Casting Call</Link>
        </div>
        </>)}
      </aside>

      {/* ══ MAIN CONTENT ══ */}
      <div style={{ flex: 1, minWidth: 0, padding: '24px 32px 64px' }}>

        {/* Page heading + sort */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <h1 style={{ fontFamily: BEBAS, fontSize: 40, fontWeight: 400, letterSpacing: 2, margin: 0, lineHeight: 1 }}>
              CASTING <span style={{ color: RED }}>CALLS</span>
            </h1>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.45)', fontFamily: BARLOW, marginTop: 5 }}>
              Discover verified casting calls across films, OTT, theatre and more.
            </p>
          </div>

          {/* Sort dropdown */}
          <div style={{ position: 'relative' as const, flexShrink: 0 }}>
            <div onClick={() => setSortOpen(v => !v)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '9px 14px', cursor: 'pointer', minWidth: 160 }}>
              <span style={{ fontSize: 16, color: '#fff', fontFamily: BARLOW, flex: 1 }}>Sort: {sort}</span>
              <ChevronDown size={13} color="rgba(255,255,255,0.4)" style={{ transform: sortOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
            </div>
            {sortOpen && (
              <>
                <div onClick={() => setSortOpen(false)} style={{ position: 'fixed' as const, inset: 0, zIndex: 100 }} />
                <div style={{ position: 'absolute' as const, top: 'calc(100% + 4px)', right: 0, background: BG3, border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, overflow: 'hidden', zIndex: 200, boxShadow: '0 8px 24px rgba(0,0,0,0.6)', minWidth: 160 }}>
                  {SORT_OPTS.map(s => (
                    <div key={s} onClick={() => { setSort(s); setSortOpen(false) }} style={{ padding: '10px 14px', fontSize: 16, fontFamily: BARLOW, cursor: 'pointer', color: sort === s ? RED : 'rgba(255,255,255,0.7)', background: sort === s ? 'rgba(200,32,42,0.08)' : 'transparent' }}
                      onMouseEnter={e => { if (sort !== s) e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
                      onMouseLeave={e => { if (sort !== s) e.currentTarget.style.background = 'transparent' }}
                    >{s}</div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Search bar */}
        <div style={{ position: 'relative' as const, marginBottom: 20 }}>
          <Search size={16} color="rgba(255,255,255,0.35)" style={{ position: 'absolute' as const, left: 16, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by title, project, studio or keyword..."
            style={{ width: '100%', padding: '13px 16px 13px 44px', background: BG2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#F5F5F5', fontSize: 16, fontFamily: BARLOW, outline: 'none', boxSizing: 'border-box' as const, transition: 'border-color 0.2s' }}
            onFocus={e => (e.target.style.borderColor = RED)}
            onBlur={e  => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
          />
          {search && <button onClick={() => setSearch('')} style={{ position: 'absolute' as const, right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)' }}><X size={15} /></button>}
        </div>

        {/* Active filter chips */}
        {activeFilterCount > 0 && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const, marginBottom: 16 }}>
            {[
              { val: location,   reset: () => setLocation('All Locations') },
              { val: experience, reset: () => setExperience('All Levels') },
              { val: compType,   reset: () => setCompType('All Types') },
              { val: gender,     reset: () => setGender('All Genders') },
              { val: category,   reset: () => setCategory('All') },
            ].filter(f => !f.val.startsWith('All')).map((f, i) => (
              <button key={i} onClick={f.reset} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(200,32,42,0.1)', border: '1px solid rgba(200,32,42,0.25)', color: '#fff', fontSize: 14, fontFamily: BARLOW, padding: '4px 12px', borderRadius: 20, cursor: 'pointer' }}>
                {f.val} <X size={11} color="rgba(255,255,255,0.5)" />
              </button>
            ))}
          </div>
        )}

        {/* Results count */}
        <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, marginBottom: 16 }}>
          {loading
            ? <span style={{ color: 'rgba(255,255,255,0.3)' }}>Loading casting calls…</span>
            : <><strong style={{ color: '#fff' }}>Showing {filtered.length}</strong> casting calls{activeType !== 'All Castings' && <> in <strong style={{ color: RED }}>{activeType}</strong></>}</>
          }
        </div>

        {/* Guest sign-in banner */}
        {!isLoggedIn && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', background: 'rgba(200,32,42,0.07)', border: '1px solid rgba(200,32,42,0.2)', borderRadius: 10, marginBottom: 20, flexWrap: 'wrap' as const, gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Lock size={16} color={RED} />
              <span style={{ fontSize: 16, fontFamily: BARLOW, color: 'rgba(255,255,255,0.8)' }}>
                Sign in to apply for roles, save favourites, and see all casting calls.
              </span>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <Link href="/login"  style={{ padding: '8px 18px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', textDecoration: 'none', fontSize: 15, fontFamily: BARLOW, fontWeight: 600, borderRadius: 6 }}>Log In</Link>
              <Link href="/signup" style={{ padding: '8px 18px', background: RED, color: '#fff', textDecoration: 'none', fontSize: 15, fontFamily: BARLOW, fontWeight: 700, borderRadius: 6 }}>Sign Up</Link>
            </div>
          </div>
        )}

        {/* Cards */}
        {filtered.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 12 }}>
            {filtered.map((c, idx) => {
              const blurred = !isLoggedIn && idx >= GUEST_FREE
              return <CastingCard key={c.id} c={c} blurred={blurred} />
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center' as const, padding: '80px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎬</div>
            <div style={{ fontSize: 26, fontFamily: BEBAS, color: '#fff', letterSpacing: 1, marginBottom: 10 }}>No roles match your filters</div>
            <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, marginBottom: 20 }}>Try adjusting or clearing your filters</p>
            <button onClick={resetFilters} style={{ background: RED, border: 'none', color: '#fff', fontSize: 16, fontFamily: BARLOW, fontWeight: 700, padding: '11px 28px', borderRadius: 6, cursor: 'pointer' }}>Clear Filters</button>
          </div>
        )}

        {/* Guest "more results" prompt */}
        {!isLoggedIn && filtered.length > GUEST_FREE && (
          <div style={{ marginTop: 24, textAlign: 'center' as const, padding: '28px', background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10 }}>
            <div style={{ fontSize: 20, fontFamily: BARLOW, fontWeight: 700, color: '#fff', marginBottom: 6 }}>
              +{filtered.length - GUEST_FREE} more casting calls available
            </div>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, margin: '0 0 18px' }}>
              Create a free account to browse all roles, apply, and save your favourites.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <Link href="/login"  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'none', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', textDecoration: 'none', fontSize: 16, fontFamily: BARLOW, fontWeight: 600, padding: '10px 24px', borderRadius: 6 }}>Log In</Link>
              <Link href="/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: RED, color: '#fff', textDecoration: 'none', fontSize: 16, fontFamily: BARLOW, fontWeight: 700, padding: '10px 24px', borderRadius: 6 }}>Sign Up — It's Free</Link>
            </div>
          </div>
        )}
      </div>
      </div> {/* end scrollable content area */}
      </div> {/* end body row */}
    </div>
  )
}