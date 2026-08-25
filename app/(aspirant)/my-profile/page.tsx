'use client'

import AspirantHeader from '@/components/layout/AspirantHeader'
import ProtectedMedia from '@/components/ui/ProtectedMedia'
import AdminTopnav from '@/components/layout/AdminTopnav'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import SilverScreensLogo from '@/components/ui/SilverScreensLogo'
import {
  LayoutDashboard, FileText, MessageSquare, Mic2, Bookmark, Star, Bell,
  ChevronRight, ChevronDown, ChevronLeft, Menu,
  Share2, MoreHorizontal, CheckCircle, TrendingUp, Play, ExternalLink, Edit,
  Users, Building2, Flag, ShieldCheck, CreditCard, Database, Megaphone,
} from 'lucide-react'

const RED    = '#C8202A'
const GOLD   = '#D4A64A'
const GREEN  = '#22C55E'
const BG     = '#050505'
const BG2    = '#0B0F14'
const BG3    = '#121821'
const BARLOW = "'Barlow Condensed', sans-serif"
const BEBAS  = "'Bebas Neue', sans-serif"

const SIDEBAR_ITEMS: { icon: any; label: string; href: string; active?: boolean; badge?: number }[] = [
  { icon: LayoutDashboard, label: 'Dashboard',            href: '/dashboard'       },
  { icon: FileText,        label: 'My Applications',      href: '/my-applications' },
  { icon: MessageSquare,   label: 'Messages',             href: '/messages' },
  { icon: Mic2,            label: 'Auditions',            href: '/auditions'        },
  { icon: Bookmark,        label: 'Saved Castings',       href: '/saved-castings'  },
  { icon: Star,            label: 'Recommended Castings', href: '/recommended'     },
  { icon: Bell,            label: 'Notifications',        href: '/notifications'},
]

const DROPDOWN_LINKS = [
  { label: 'My Profile',   href: '/my-profile'             },
  { label: 'Subscription', href: '/dashboard/subscription'  },
  { label: 'Analytics',    href: '/analytics'              },
  { label: 'Calendar',     href: '/calendar'               },
  { label: 'Settings',     href: '/settings'               },
  { label: 'Help & Support',      href: '/settings?tab=support'                    },
  { label: 'Logout',       href: ''                        },
]

const PROFILE = {
  name:        'Arjun Prakash',
  verified:    true,
  roles:       ['Actor', 'Model'],
  age:         27,
  height:      "5'11\"",
  weight:      '72 kg',
  location:    'Chennai, Tamil Nadu',
  languages:   'Tamil, English, Hindi',
  photo:       'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=500&fit=crop&crop=face',
  about:       "Passionate actor with 5+ years of experience in theatre, short films and commercials. I love bringing characters to life and connecting with audiences through impactful storytelling.",
  title:       'Mr.',
  dob:         '12 May 1997',
  gender:      'Male',
  mobile:      '+91 98765 43210',
  email:       'arjun@example.com',
  address:     'No. 12, 3rd Cross, T. Nagar, Chennai, Tamil Nadu - 600017, India',
  nationality: 'Indian',
  bodyType:    'Athletic',
  complexion:  'Wheatish',
  eyeColor:    'Brown',
  hairColor:   'Black',
  chest:       '40"',
  waist:       '32"',
  hip:         '38"',
  shoe:        'UK 9',
  availableFor:['Feature Films', 'Web Series', 'TV Commercials', 'Music Videos', 'Modelling', 'Short Films'],
  departments: [
    { dept: 'Acting',    roles: ['Hero', 'Character Artist'] },
    { dept: 'Modelling', roles: ['Model', 'Advertisement']   },
  ],
  photos: [],
  videos: [],
  professional: { roleType: 'Lead, Supporting, Cameo', experience: '5+ Years', noticePeriod: '15 Days', travel: 'Yes', availableFor: 'Films, Web Series, TV Shows, Short Films, Ads' },
  social: [
    { platform: 'Instagram', handle: '@arjunprakash_official', icon: '📸' },
    { platform: 'Facebook',  handle: '/arjunprakash.actor',    icon: '📘' },
    { platform: 'YouTube',   handle: 'Arjun Prakash Official', icon: '▶️' },
    { platform: 'IMDb',      handle: 'View Profile',           icon: '🎬' },
  ],
  strength: { score: 92, label: 'Excellent', items: [
    { label: 'Profile Information',    pct: 100 },
    { label: 'Media (Photos / Videos)',pct: 100 },
    { label: 'Skills & Languages',     pct: 90  },
    { label: 'Experience',             pct: 90  },
    { label: 'Verification',           pct: 100 },
  ]},
}

const ADMIN_NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard',                href: '/admin/dashboard'            },
  { icon: Users,           label: 'User Management',          href: '/admin/users'                },
  { icon: FileText,        label: 'Talent Verification',      href: '/admin/talent-verification'  },
  { icon: Building2,       label: 'Agency Verification',      href: '/admin/agency-verification'  },
  { icon: FileText,        label: 'Applications Monitoring',  href: '/admin/applications'         },
  { icon: Flag,            label: 'Reports & Complaints',     href: '/admin/reports'              },
  { icon: ShieldCheck,     label: 'Fraud Detection',          href: '/admin/fraud'                },
  { icon: CreditCard,      label: 'Subscription Management',  href: '/admin/subscriptions'        },
  { icon: Megaphone,       label: 'Advertisement Management', href: '/admin/advertisements'       },
  { icon: Database,        label: 'CMS Management',           href: '/admin/cms'                  },
  { icon: Bell,            label: 'Notifications Management', href: '/admin/notifications'        },
  { icon: TrendingUp,      label: 'Analytics & Reports',      href: '/admin/analytics'            },
  { icon: FileText,        label: 'Support Tickets',          href: '/admin/support'              },
  { icon: FileText,        label: 'Audit Logs',               href: '/admin/audit'                },
  { icon: FileText,        label: 'Roles & Permissions',      href: '/admin/roles'                },
  { icon: FileText,        label: 'Settings',                 href: '/admin/settings'             },
]

const TABS = ['Overview', 'Media', 'Experience', 'Skills', 'Education', 'Awards', 'Documents']

function CircularProgress({ score }: { score: number }) {
  const r = 54, c = 2 * Math.PI * r
  const offset = c - (score / 100) * c
  return (
    <div style={{ position: 'relative' as const, width: 130, height: 130, margin: '0 auto 8px' }}>
      <svg width="130" height="130" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="65" cy="65" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
        <circle cx="65" cy="65" r={r} fill="none" stroke={RED} strokeWidth="10"
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <div style={{ position: 'absolute' as const, inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: BEBAS, fontSize: 32, color: '#F5F5F5', lineHeight: 1 }}>{score}%</div>
      </div>
    </div>
  )
}

export default function MyProfilePage() {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('ss_user')
    window.location.replace('/login')
  }

  const searchParams = useSearchParams()
  const viewUserId = searchParams.get('user_id') // set by admin to view any profile
  const [isApproved,    setIsApproved]    = useState(false);
  const [resolvedUserId, setResolvedUserId] = useState<string>('')

  const [tab,           setTab]           = useState('Overview')
  const [activePhoto,   setActivePhoto]   = useState(0)
  const [dropdownOpen,  setDropdownOpen]  = useState(false)
  const [sidebarOpen,   setSidebarOpen]   = useState(false)
  const [lightboxPhoto, setLightboxPhoto] = useState<string | null>(null)
  const [lightboxIdx,   setLightboxIdx]   = useState(0)
  const [videoPlayer,   setVideoPlayer]   = useState<string | null>(null)

  // â”€â”€ Live data from API + localStorage â”€â”€
  const [liveUser, setLiveUser] = useState<{
    name?: string
    departments?: string[]
    roles?: { department: string; role: string }[]
    profileStatus?: string
    city?: string
    state?: string
    age?: number
    dob?: string
    languages?: string[]
    height?: string
    weight?: string
    availability?: string[]
    gender?: string
    about_me?: string
    profile_image_url?: string
    mobile?: string
    email?: string
    address?: string
    nationality?: string
    body_type?: string
    body_tone?: string
    eye_color?: string
    hair_color?: string
    chest?: string
    waist?: string
    hip?: string
    shoe?: string
    experience_level?: string
    profile_completion?: number
    profile_number?: string
    photos?: string[]
    videos?: { url: string; title: string }[]
    mediaFull?: { id: string; url: string; type: string; is_primary: boolean; moderation_status: string; rejection_reason: string | null }[]
    credits?: { type: string; year: string; role: string; title: string; characterName?: string; director?: string; productionHouse?: string; platform?: string; language?: string; trailerLink?: string; imdbLink?: string; description?: string }[]
  skills?: string[]
  }>({})

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('ss_user') || '{}')
    const token = u.token
    if (!token) return

    const resolveAndFetch = async () => {
      if (!viewUserId) {
        return fetch('/api/profile/aspirant', { headers: { Authorization: `Bearer ${token}` } })
          .then(r => r.ok ? r.json() : null)
      }
      // viewUserId may be a profile number (e.g. ASP07266066) or a UUID — resolve to UUID first
      let uuid = viewUserId
      const looksLikeProfileNumber = /^[A-Za-z]{1,4}\d+$/.test(viewUserId)
      if (looksLikeProfileNumber) {
        const searchRes = await fetch(`/api/admin/users?keyword=${encodeURIComponent(viewUserId)}&limit=1`, { headers: { Authorization: `Bearer ${token}` } })
        const searchData = searchRes.ok ? await searchRes.json() : null
        const matched = searchData?.data?.users?.[0]
        if (matched) uuid = matched.id
      }
      setResolvedUserId(uuid)
      return fetch(`/api/admin/users?user_id=${uuid}`, { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          if (!data?.data?.user) return null
          const user = data.data.user
          const asp = Array.isArray(user.aspirant_profiles) ? user.aspirant_profiles[0] : user.aspirant_profiles
          return { data: { profile: {
            ...asp,
            profiles: { name: user.name, email: user.email, phone: user.phone, profile_number: user.profile_number },
          }}}
        })
    }
    const fetchData = resolveAndFetch()

    fetchData
      .then(data => {
        if (!data) {
          // No profile row at all — redirect to create profile
          if (!viewUserId) router.replace('/create-profile')
          return
        }
        const p = data.data?.profile ?? data.profile ?? data

        // If profile is empty (not yet filled) redirect to create-profile
        // Only for own profile view, not admin viewing another user
        if (!viewUserId) {
          const completion = p.profile_completion ?? 0
          const hasName = p.first_name || p.last_name
          if (!hasName && completion === 0) {
            router.replace('/create-profile')
            return
          }
        }

        const ap = p.profiles ?? {}
        const dob = p.date_of_birth ? new Date(p.date_of_birth) : null
        const age = dob ? Math.floor((Date.now() - dob.getTime()) / (1000 * 60 * 60 * 24 * 365.25)) : undefined
        const dobStr = dob ? dob.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : undefined
        const address = [p.address_line1, p.address_line2, p.city, p.state, p.pincode, p.country].filter(Boolean).join(', ')
        setLiveUser(prev => ({
          ...prev,
          name:             [p.first_name, p.last_name].filter(Boolean).join(' ') || prev.name,
          city:             p.city             ?? prev.city,
          state:            p.state            ?? prev.state,
          age,
          dob:              dobStr,
          languages:        p.languages?.length ? p.languages : prev.languages,
          height:           p.height_cm ? (() => {
            const totalIn = Math.round(parseFloat(String(p.height_cm)) / 2.54)
            const ft = Math.floor(totalIn / 12)
            const inch = totalIn % 12
            return ft > 0 ? `${ft}'${inch}"` : `${parseFloat(String(p.height_cm))} cm`
          })() : prev.height,
          weight:           p.weight_kg        ? `${p.weight_kg} kg` : prev.weight,
          availability:     p.availability?.length ? p.availability : prev.availability,
          gender:           p.gender           ?? prev.gender,
          about_me:         p.about_me         ?? prev.about_me,
          profile_image_url: p.profile_image_url ?? prev.profile_image_url,
          departments:      p.category ? [p.category] : prev.departments,
          roles:            p.role && p.category ? [{ department: p.category, role: p.role }] : prev.roles,
          mobile:           ap.phone           ?? prev.mobile,
          email:            ap.email           ?? prev.email,
          address:          address            || prev.address,
          nationality:      p.country          ?? prev.nationality,
          body_type:        p.body_type        ?? prev.body_type,
          body_tone:        p.body_tone        ?? prev.body_tone,
          eye_color:        p.eye_color        ?? prev.eye_color,
          hair_color:       p.hair_color       ?? prev.hair_color,
          chest:            p.chest_size       ? `${p.chest_size}"` : prev.chest,
          waist:            p.waist_size       ? `${p.waist_size}"` : prev.waist,
          hip:              p.hip_size         ? `${p.hip_size}"` : prev.hip,
          shoe:             p.shoe_size        ? `UK ${p.shoe_size}` : prev.shoe,
          experience_level: p.experience_level ?? prev.experience_level,
          profile_completion: p.profile_completion ?? prev.profile_completion,
          profile_number:   p.profile_number   ?? prev.profile_number,
          profileStatus:    p.verification_status ?? prev.profileStatus,
          photos:           Array.isArray(p.aspirant_media)
            ? p.aspirant_media.filter((m: any) => m.type === 'image').map((m: any) => m.url)
            : prev.photos,
          videos:           Array.isArray(p.aspirant_media)
            ? p.aspirant_media.filter((m: any) => m.type === 'video').map((m: any) => ({ url: m.url, title: m.type }))
            : prev.videos,
          mediaFull:        Array.isArray(p.aspirant_media)
            ? p.aspirant_media
            : prev.mediaFull,
          credits:          p.social_links?.credits ?? prev.credits,
          skills:           Array.isArray(p.skills) ? p.skills : prev.skills,
        }))
      })
      .catch(() => {})
  }, [viewUserId])

  // Fetch full media with moderation status separately
  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('ss_user') || '{}')
    const token = u.token
    if (!token) return
    fetch('/api/profile/aspirant/media-status', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.data?.media) {
          setLiveUser(prev => ({ ...prev, mediaFull: data.data.media }))
        }
      })
      .catch(() => {})
  }, [viewUserId])

  // Merge live data into display — fall back to static PROFILE if nothing in localStorage
  const displayPhotos = liveUser.photos?.length ? liveUser.photos : []
  const displayVideos = liveUser.videos?.length ? liveUser.videos : []
  const displayCredits = liveUser.credits?.length ? liveUser.credits : []
  const displayName  = liveUser.name || ''
  const displayRoles = liveUser.roles || []
  const displayDepts = liveUser.departments || []
  // Unique role labels for the hero subtitle line
  const roleLabels   = [...new Set(displayRoles.map(r => r.role))]

  const SB_W = sidebarOpen ? 230 : 52

  const openLightbox = (photos: string[], idx: number) => {
    setLightboxIdx(idx)
    setLightboxPhoto(photos[idx])
  }
  const lightboxNext = () => {
    const next = (lightboxIdx + 1) % displayPhotos.length
    setLightboxIdx(next)
    setLightboxPhoto(displayPhotos[next])
  }
  const lightboxPrev = () => {
    const prev = (lightboxIdx - 1 + displayPhotos.length) % displayPhotos.length
    setLightboxIdx(prev)
    setLightboxPhoto(displayPhotos[prev])
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' as const, height: '100vh', overflow: 'hidden', background: BG, fontFamily: BARLOW, color: '#F5F5F5' }}>

      {/*• • • TOPNAV • • •*/}
      {viewUserId ? <AdminTopnav /> : <AspirantHeader />}

      {/*• • • BODY • • •*/}
      {viewUserId && (
        <div style={{ padding: '10px 20px', background: '#131720', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => router.push('/admin/users')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 7, padding: '6px 14px', color: 'rgba(255,255,255,0.7)', fontFamily: BARLOW, fontSize: 14, cursor: 'pointer' }}>← Back to User Management</button>
          <span style={{ fontFamily: BARLOW, fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>Viewing profile as Admin</span>
        </div>
      )}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/*COLLAPSIBLE SIDEBAR*/}
        <aside style={{ width: SB_W, flexShrink: 0, background: BG2, borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column' as const, overflowY: 'auto' as const, overflowX: 'hidden', scrollbarWidth: 'none' as const, transition: 'width 0.2s ease' }}>

          {/*Toggle button*/}
          <div style={{ height: 52, display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'flex-end' : 'center', padding: sidebarOpen ? '0 12px' : 0, borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
            <button onClick={() => setSidebarOpen(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', width: 30, height: 30, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            >{sidebarOpen ? <ChevronLeft size={16} /> : <Menu size={16} />}</button>
          </div>

          {viewUserId ? (
            <>
              {sidebarOpen && (
                <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 9, background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(212,166,74,0.25)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: RED }}>A</div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#F5F5F5', whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis' }}>Super Admin</div>
                    <div style={{ fontSize: 13, color: RED, fontWeight: 600 }}>Administrator</div>
                  </div>
                </div>
              )}
              <nav style={{ flex: 1, padding: sidebarOpen ? '8px 6px' : '8px 4px', overflowY: 'auto' as const, scrollbarWidth: 'none' as const }}>
                {ADMIN_NAV_ITEMS.map(({ icon: Icon, label, href }) => (
                  <div key={label} onClick={() => router.push(href)} title={!sidebarOpen ? label : undefined}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'flex-start' : 'center', padding: sidebarOpen ? '8px 10px' : '10px 0', marginBottom: 2, borderRadius: 6, cursor: 'pointer', background: 'transparent', gap: sidebarOpen ? 9 : 0 }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <Icon size={15} color="rgba(255,255,255,0.42)" strokeWidth={1.8} />
                    {sidebarOpen && <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', fontWeight: 400, whiteSpace: 'nowrap' as const, flex: 1 }}>{label}</span>}
                  </div>
                ))}
              </nav>
            </>
          ) : (
            <>
              {sidebarOpen && (
                <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <ProtectedMedia type="image" src={liveUser.profile_image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=C8202A&color=fff`} alt={displayName} avatar width={38} height={38} style={{ border: `2px solid ${GOLD}60`, flexShrink: 0 }} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#F5F5F5', whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis' }}>{displayName}</div>
                    <div onClick={() => router.push('/my-profile')} style={{ fontSize: 13, color: RED, fontWeight: 600, cursor: 'pointer' }}>View Profile</div>
                  </div>
                </div>
              )}
              <nav style={{ flex: 1, padding: sidebarOpen ? '8px 6px' : '8px 4px', overflowY: 'auto' as const, scrollbarWidth: 'none' as const }}>
                {SIDEBAR_ITEMS.map(({ icon: Icon, label, href, badge }) => {
                  const active = href === '/my-profile'
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
            </>
          )}
        </aside>

        {/*MAIN SCROLL AREA*/}
        <div style={{ flex: 1, overflowY: 'auto' as const }}>

          {/*Pending review banner*/}
          {liveUser.profileStatus === 'pending_review' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 28px', background: 'rgba(212,166,74,0.07)', borderBottom: '1px solid rgba(212,166,74,0.2)' }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>⏳</span>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 16, fontFamily: BARLOW, fontWeight: 700, color: GOLD }}>Profile under review — </span>
                <span style={{ fontSize: 15, fontFamily: BARLOW, color: 'rgba(255,255,255,0.5)' }}>Your updated profile has been submitted and is awaiting admin approval. Your current profile remains visible until approved.</span>
              </div>
            </div>
          )}

          {/*Profile Hero*/}
          <div style={{ position: 'relative' as const, flexShrink: 0 }}>
            <div style={{ position: 'absolute' as const, inset: 0, backgroundImage: `url(${displayPhotos[1] || displayPhotos[0]})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.08 }} />
            <div style={{ position: 'absolute' as const, inset: 0, background: 'linear-gradient(to right, rgba(5,5,5,0.97) 0%, rgba(5,5,5,0.75) 60%, rgba(5,5,5,0.5) 100%)' }} />
            <div style={{ position: 'relative' as const, zIndex: 1, display: 'flex', gap: 28, padding: '28px 28px 24px', alignItems: 'flex-start' }}>
              <div style={{ position: 'relative' as const, flexShrink: 0 }}>
                <div style={{ width: 170, height: 210, borderRadius: 10, overflow: 'hidden', border: '2px solid rgba(255,255,255,0.1)' }}>
                  <ProtectedMedia type="image" src={liveUser.profile_image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=C8202A&color=fff&size=200`} alt={displayName} avatar width="100%" height="100%" />
                </div>
                <div style={{ position: 'absolute' as const, top: 8, left: 8, background: RED, color: '#fff', fontSize: 12, fontWeight: 700, padding: '2px 8px', borderRadius: 4 }}>Primary</div>
                <button onClick={() => router.push('/edit-profile')} style={{ position: 'absolute' as const, bottom: 8, right: 8, width: 28, height: 28, borderRadius: '50%', background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <Edit size={13} color="#F5F5F5" />
                </button>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <h1 style={{ fontFamily: BEBAS, fontSize: 44, letterSpacing: 2, color: '#F5F5F5', margin: 0, lineHeight: 1 }}>{displayName}</h1>
                  {liveUser.profileStatus === 'approved' && <CheckCircle size={22} color={GREEN} fill={GREEN} />}
                </div>
                {/*Department chips*/}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const, marginBottom: 10 }}>
                  {displayDepts.map(dept => (
                    <span key={dept} style={{ fontSize: 14, fontFamily: BARLOW, color: RED, background: 'rgba(200,32,42,0.12)', border: `1px solid rgba(200,32,42,0.3)`, borderRadius: 20, padding: '3px 12px', fontWeight: 600 }}>{dept}</span>
                  ))}
                </div>
                {/*Role labels*/}
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' as const }}>
                  {roleLabels.map((r, i) => (
                    <span key={r} style={{ fontSize: 17, color: '#A8B0BD' }}>{r}{i < roleLabels.length - 1 ? ' ★ ' : ''}</span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 22, marginBottom: 16, flexWrap: 'wrap' as const }}>
                  {[
                    { icon: '🎂', val: liveUser.age ? `${liveUser.age} Years` : null },
                    { icon: '📏', val: liveUser.height || null },
                    { icon: '📍', val: liveUser.city && liveUser.state ? `${liveUser.city}, ${liveUser.state}` : (liveUser.city || liveUser.state || null) },
                    { icon: '🗣️', val: liveUser.languages?.length ? liveUser.languages.join(', ') : null },
                  ].filter(s => s.val).map(s => (
                    <div key={s.val} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 15 }}>{s.icon}</span>
                      <span style={{ fontSize: 16, color: '#A8B0BD' }}>{s.val}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 14px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 20, fontSize: 15, color: GREEN }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: GREEN, display: 'inline-block' }} /> Available for Work
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 20, fontSize: 15, color: '#A8B0BD' }}>
                    🌍 Open to Relocation
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => router.push('/edit-profile')} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 22px', background: RED, border: 'none', borderRadius: 7, color: '#fff', fontFamily: BARLOW, fontSize: 16, fontWeight: 700, cursor: 'pointer', boxShadow: '0 6px 20px rgba(200,32,42,0.3)' }}><Edit size={15} /> Edit Profile</button>
                  <button onClick={() => router.push(isApproved ? '/my-applications' : '/create-profile')} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 22px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 7, color: '#F5F5F5', fontFamily: BARLOW, fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>📞 My Applications</button>
                  <button onClick={() => router.push(isApproved ? '/recommended' : '/create-profile')} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 22px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 7, color: '#F5F5F5', fontFamily: BARLOW, fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>⭐ Recommended</button>
                </div>
              </div>
            </div>
          </div>

          {/*Tabs*/}
          <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: BG2, padding: '0 28px', display: 'flex', flexShrink: 0 }}>
            {TABS.map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ padding: '13px 20px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: BARLOW, fontSize: 16, fontWeight: tab === t ? 700 : 400, color: tab === t ? RED : '#6A7080', borderBottom: tab === t ? `2px solid ${RED}` : '2px solid transparent', display: 'flex', alignItems: 'center', gap: 6 }}>
                {t}
                {t === 'Media' && (displayPhotos.length + displayVideos.length) > 0 && <span style={{ background: RED, color: '#fff', borderRadius: 10, fontSize: 12, padding: '1px 6px' }}>{displayPhotos.length + displayVideos.length}</span>}
                {t === 'Experience' && displayCredits.length > 0 && <span style={{ background: 'rgba(255,255,255,0.1)', color: '#A8B0BD', borderRadius: 10, fontSize: 12, padding: '1px 6px' }}>{displayCredits.length}</span>}
              </button>
            ))}
          </div>

          {/*Content grid*/}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, padding: '20px 28px 28px' }}>

            {/*LEFT*/}
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16 }}>
              {tab === 'Overview' && (
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16 }}>

                  {/*About Me + Full Details (full width)*/}
                  <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: 20 }}>
                    <div style={{ fontFamily: BEBAS, fontSize: 20, letterSpacing: 1, color: '#F5F5F5', marginBottom: 10 }}>About Me</div>
                    <p style={{ fontSize: 16, color: '#A8B0BD', lineHeight: 1.7, marginBottom: 18 }}>{liveUser.about_me || ''}</p>

                    {/*Two column grid for all detail sections*/}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

                      {/*LEFT — Personal + Physical*/}
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: RED, letterSpacing: 1.5, textTransform: 'uppercase' as const, marginBottom: 8 }}>Personal Information</div>
                        {[
                          { icon: '🎂', label: 'Date of Birth', val: liveUser.dob },
                          { icon: '♥',  label: 'Gender',        val: liveUser.gender },
                          { icon: '📅', label: 'Age',           val: liveUser.age ? `${liveUser.age} Years` : undefined },
                          { icon: '📱', label: 'Mobile',         val: liveUser.mobile },
                          { icon: '📧', label: 'Email',          val: liveUser.email },
                          { icon: '📍', label: 'Address',        val: liveUser.address },
                          { icon: '🌍', label: 'Nationality',    val: liveUser.nationality },
                          { icon: '🗣️', label: 'Languages',     val: liveUser.languages?.join(', ') },
                        ].filter(row => row.val).map(row => (
                          <div key={row.label} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', gap: 12 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                              <span style={{ fontSize: 14 }}>{row.icon}</span>
                              <span style={{ fontSize: 15, color: '#6A7080' }}>{row.label}</span>
                            </div>
                            <span style={{ fontSize: 15, color: '#F5F5F5', fontWeight: 500, textAlign: 'right' as const }}>{row.val}</span>
                          </div>
                        ))}

                        <div style={{ fontSize: 13, fontWeight: 700, color: RED, letterSpacing: 1.5, textTransform: 'uppercase' as const, margin: '16px 0 8px' }}>Physical Details</div>
                        {[
                          { icon: '📏', label: 'Height',    val: liveUser.height },
                          { icon: '⚖️', label: 'Weight',    val: liveUser.weight },
                          { icon: '💪', label: 'Body Type',  val: liveUser.body_type },
                          { icon: '🎨', label: 'Complexion', val: liveUser.body_tone },
                          { icon: '👁️', label: 'Eye Color',  val: liveUser.eye_color },
                          { icon: '💇', label: 'Hair Color', val: liveUser.hair_color },
                        ].filter(row => row.val).map(row => (
                          <div key={row.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ fontSize: 14 }}>{row.icon}</span>
                              <span style={{ fontSize: 15, color: '#6A7080' }}>{row.label}</span>
                            </div>
                            <span style={{ fontSize: 15, color: '#F5F5F5', fontWeight: 500 }}>{row.val}</span>
                          </div>
                        ))}
                      </div>

                      {/*RIGHT — Measurements + Available For + Departments*/}
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: RED, letterSpacing: 1.5, textTransform: 'uppercase' as const, marginBottom: 10 }}>Measurements</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
                          {[
                            { label: 'Chest',     val: liveUser.chest },
                            { label: 'Waist',     val: liveUser.waist },
                            { label: 'Hip',       val: liveUser.hip   },
                            { label: 'Shoe Size', val: liveUser.shoe  },
                          ].filter(m => m.val).map(m => (
                            <div key={m.label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: '8px 12px' }}>
                              <div style={{ fontSize: 12, color: '#6A7080', marginBottom: 3 }}>{m.label}</div>
                              <div style={{ fontSize: 16, color: '#F5F5F5', fontWeight: 600 }}>{m.val}</div>
                            </div>
                          ))}
                        </div>

                        <div style={{ fontSize: 13, fontWeight: 700, color: RED, letterSpacing: 1.5, textTransform: 'uppercase' as const, marginBottom: 8 }}>Available For</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6, marginBottom: 20 }}>
                          {(liveUser.availability ?? []).map(a => (
                            <span key={a} style={{ padding: '4px 12px', background: 'rgba(200,32,42,0.1)', border: '1px solid rgba(200,32,42,0.25)', borderRadius: 20, fontSize: 14, color: RED }}>{a}</span>
                          ))}
                        </div>

                        <div style={{ fontSize: 13, fontWeight: 700, color: RED, letterSpacing: 1.5, textTransform: 'uppercase' as const, marginBottom: 10 }}>Departments & Roles</div>
                        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
                          {displayDepts.map(dept => (
                            <div key={dept} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                              <div style={{ minWidth: 100, flexShrink: 0, fontSize: 15, color: '#6A7080', paddingTop: 4 }}>{dept}</div>
                              <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' as const }}>
                                {displayRoles.filter(r => r.department === dept).map(r => (
                                  <span key={r.role} style={{ padding: '4px 13px', background: 'rgba(200,32,42,0.1)', border: '1px solid rgba(200,32,42,0.25)', borderRadius: 20, fontSize: 14, color: RED, fontWeight: 600 }}>{r.role}</span>
                                ))}
                              </div>
                            </div>
                          ))}
                          {displayDepts.length === 0 && (
                            <span style={{ fontSize: 15, color: '#6A7080' }}>No departments selected yet. <button onClick={() => router.push('/edit-profile')} style={{ background: 'none', border: 'none', color: RED, fontFamily: BARLOW, fontSize: 15, cursor: 'pointer', padding: 0 }}>Edit Profile →</button></span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/*Media (full width below About Me)*/}
                  <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '20px 20px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                      <div style={{ fontFamily: BEBAS, fontSize: 20, letterSpacing: 1, color: '#F5F5F5' }}>Media ({displayPhotos.length + displayVideos.length})</div>
                      <button onClick={() => setTab('Media')} style={{ background: 'none', border: 'none', color: RED, fontFamily: BARLOW, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>View All</button>
                    </div>

                    {/*Photos row*/}
                    <div style={{ fontSize: 15, color: '#A8B0BD', marginBottom: 10 }}>Photos ({displayPhotos.length})</div>
                    <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                      {displayPhotos.map((p, i) => (
                        <div key={i} onClick={() => { setActivePhoto(i); openLightbox(displayPhotos, i) }} style={{ position: 'relative' as const, flex: i === 0 ? 2 : 1, height: 200, borderRadius: 8, overflow: 'hidden', border: `2px solid ${activePhoto === i ? RED : 'transparent'}`, cursor: 'pointer', transition: 'transform 0.2s' }}
                          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.02)')}
                          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}>
                          <ProtectedMedia type="image" src={p} alt="" width="100%" height="100%" style={{ objectFit: 'cover' }} />
                          {i === 0 && (
                            <div style={{ position: 'absolute' as const, bottom: 8, left: 8, display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(0,0,0,0.7)', padding: '3px 10px', borderRadius: 10 }}>
                              <span style={{ color: GOLD, fontSize: 12 }}>☆</span>
                              <span style={{ fontSize: 12, color: '#fff' }}>Primary</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/*Videos row*/}
                    <div style={{ fontSize: 15, color: '#A8B0BD', marginBottom: 10 }}>Videos ({displayVideos.length})</div>
                    <div style={{ display: 'flex', gap: 12 }}>
                      {displayVideos.map((v, i) => (
                        <div key={i} onClick={() => setVideoPlayer(v.url)} style={{ position: 'relative' as const, flex: 1, height: 160, borderRadius: 8, overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s' }}
                          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.02)')}
                          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}>
                          <ProtectedMedia type="video" src={v.url} controls={false} width="100%" height="100%" style={{ objectFit: 'cover' }} />
                          <div style={{ position: 'absolute' as const, inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'rgba(200,32,42,0.8)', border: '2px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Play size={18} color="#fff" fill="#fff" />
                            </div>
                          </div>
                          <div style={{ position: 'absolute' as const, bottom: 6, left: 8, fontSize: 13, color: '#fff', background: 'rgba(0,0,0,0.6)', padding: '2px 6px', borderRadius: 4 }}>{v.title}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/*MEDIA TAB*/}
              {tab === 'Media' && (
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16 }}>
                  {/*Rejected media banner*/}
                  {(liveUser.mediaFull || []).some(m => m.moderation_status === 'rejected') && (
                    <div style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10, fontFamily: BARLOW }}>
                      <span style={{ fontSize: 18 }}>⚠️</span>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: '#EF4444' }}>
                          {(liveUser.mediaFull || []).filter(m => m.moderation_status === 'rejected').length} media item(s) rejected by admin
                        </div>
                        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>
                          Rejected items are shown with a red border. Please re-upload compliant replacements.
                        </div>
                      </div>
                    </div>
                  )}
                  {/*Pending media notice*/}
                  {(liveUser.mediaFull || []).some(m => m.moderation_status === 'pending') && (
                    <div style={{ padding: '10px 16px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 10, fontFamily: BARLOW, fontSize: 13, color: 'rgba(245,158,11,0.9)' }}>
                      ⏳ {(liveUser.mediaFull || []).filter(m => m.moderation_status === 'pending').length} media item(s) are pending admin review.
                    </div>
                  )}
                  {/*Photos*/}
                  <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                      <div style={{ fontFamily: BEBAS, fontSize: 20, letterSpacing: 1, color: '#F5F5F5' }}>Photos ({displayPhotos.length})</div>
                      <button onClick={() => router.push('/create-profile')} style={{ padding: '6px 16px', background: RED, border: 'none', borderRadius: 6, color: '#fff', fontFamily: BARLOW, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>+ Add Photos</button>
                    </div>
                     {(() => {
                       const allPhotos = liveUser.mediaFull?.filter(m => m.type === 'image') || displayPhotos.map((url, i) => ({ id: String(i), url, type: 'image', is_primary: i === 0, moderation_status: 'approved', rejection_reason: null }));
                       const approvedPending = allPhotos.filter(m => m.moderation_status !== 'rejected');
                       const rejected = allPhotos.filter(m => m.moderation_status === 'rejected');
                       const approvedUrls = approvedPending.map(m => m.url);
                       if (allPhotos.length === 0) return <div style={{ textAlign: 'center' as const, padding: '30px 0', color: '#6A7080', fontSize: 15 }}>No photos uploaded yet.</div>;
                       return (
                         <>
                           {approvedPending.length > 0 && (
                             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
                               {approvedPending.map((m, i) => (
                                 <div key={m.id} onClick={() => openLightbox(approvedUrls, i)} style={{ position: 'relative' as const, aspectRatio: '3/4', borderRadius: 8, overflow: 'hidden', border: `2px solid ${m.is_primary ? GOLD : 'rgba(255,255,255,0.06)'}`, cursor: 'pointer', transition: 'transform 0.2s' }}
                                   onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.03)')}
                                   onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}>
                                   <ProtectedMedia type="image" src={m.url} alt="" width="100%" height="100%" style={{ objectFit: 'cover' }} />
                                   {m.is_primary && <div style={{ position: 'absolute' as const, top: 6, left: 6, background: GOLD, color: '#000', fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4 }}>PRIMARY</div>}
                                   {m.moderation_status === 'pending' && <div style={{ position: 'absolute' as const, top: 6, right: 6, background: 'rgba(245,158,11,0.9)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4 }}>⏳</div>}
                                 </div>
                               ))}
                             </div>
                           )}
                           {rejected.length > 0 && (
                             <div style={{ marginTop: 16 }}>
                               <div style={{ fontFamily: BARLOW, fontSize: 14, fontWeight: 700, color: '#EF4444', marginBottom: 10 }}>✗ Rejected — Please Re-upload ({rejected.length})</div>
                               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
                                 {rejected.map(m => (
                                   <div key={m.id} style={{ position: 'relative' as const, aspectRatio: '3/4', borderRadius: 8, overflow: 'hidden', border: '2px solid #EF4444' }}>
                                     <ProtectedMedia type="image" src={m.url} alt="" width="100%" height="100%" style={{ objectFit: 'cover', opacity: 0.35, filter: 'grayscale(60%)' }} noWatermark />
                                     <div style={{ position: 'absolute' as const, top: 6, right: 6, background: 'rgba(239,68,68,0.95)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4 }}>✗ REJECTED</div>
                                     <div style={{ position: 'absolute' as const, bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.88)', padding: '6px 8px' }}>
                                       <div style={{ fontFamily: BARLOW, fontSize: 10, color: '#EF4444', marginBottom: 5, lineHeight: 1.3 }}>{m.rejection_reason || 'Does not meet platform standards'}</div>
                                       <label style={{ display: 'block', padding: '4px 0', background: '#C8202A', borderRadius: 4, textAlign: 'center' as const, fontFamily: BARLOW, fontSize: 11, fontWeight: 700, color: '#fff', cursor: 'pointer' }}>
                                         → Re-upload
                                         <input type="file" accept="image/*" style={{ display: 'none' }} onChange={async e => {
                                           const file = e.target.files?.[0]; if (!file) return;
                                           const u = JSON.parse(localStorage.getItem('ss_user') || '{}');
                                           const fd = new FormData(); fd.append('file', file); fd.append('replace_media_id', m.id);
                                           const res = await fetch('/api/profile/aspirant/media', { method: 'POST', headers: { Authorization: `Bearer ${u.token}` }, body: fd });
                                           if (res.ok) window.location.reload();
                                         }} />
                                       </label>
                                     </div>
                                   </div>
                                 ))}
                               </div>
                             </div>
                           )}
                         </>
                       );
                     })()}
                  </div>
                  {/*Videos*/}
                  <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                      <div style={{ fontFamily: BEBAS, fontSize: 20, letterSpacing: 1, color: '#F5F5F5' }}>Videos ({displayVideos.length})</div>
                      <button onClick={() => router.push('/create-profile')} style={{ padding: '6px 16px', background: RED, border: 'none', borderRadius: 6, color: '#fff', fontFamily: BARLOW, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>+ Add Videos</button>
                    </div>
                     {(() => {
                       const allVideos = liveUser.mediaFull?.filter(m => m.type === 'video') || displayVideos.map((v, i) => ({ id: String(i), url: v.url, type: 'video', is_primary: false, moderation_status: 'approved', rejection_reason: null }));
                       const approvedPending = allVideos.filter(m => m.moderation_status !== 'rejected');
                       const rejected = allVideos.filter(m => m.moderation_status === 'rejected');
                       if (allVideos.length === 0) return <div style={{ textAlign: 'center' as const, padding: '30px 0', color: '#6A7080', fontSize: 15 }}>No videos uploaded yet.</div>;
                       return (
                         <>
                           {approvedPending.length > 0 && (
                             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                               {approvedPending.map((m, i) => (
                                 <div key={m.id} onClick={() => setVideoPlayer(m.url)} style={{ position: 'relative' as const, borderRadius: 8, overflow: 'hidden', aspectRatio: '16/9', cursor: 'pointer', transition: 'transform 0.2s' }}
                                   onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.02)')}
                                   onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}>
                                   <ProtectedMedia type="video" src={m.url} controls={false} width="100%" height="100%" style={{ objectFit: 'cover' }} />
                                   <div style={{ position: 'absolute' as const, inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                     <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(200,32,42,0.8)', border: '2px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                       <Play size={20} color="#fff" fill="#fff" />
                                     </div>
                                   </div>
                                   {m.moderation_status === 'pending' && <div style={{ position: 'absolute' as const, top: 6, right: 6, background: 'rgba(245,158,11,0.9)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4 }}>⏳ Pending</div>}
                                 </div>
                               ))}
                             </div>
                           )}
                           {rejected.length > 0 && (
                             <div style={{ marginTop: 12 }}>
                               <div style={{ fontFamily: BARLOW, fontSize: 14, fontWeight: 700, color: '#EF4444', marginBottom: 10 }}>✗ Rejected Videos — Re-upload Required ({rejected.length})</div>
                               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                                 {rejected.map(m => (
                                   <div key={m.id} style={{ position: 'relative' as const, borderRadius: 8, overflow: 'hidden', aspectRatio: '16/9', border: '2px solid #EF4444' }}>
                                     <ProtectedMedia type="video" src={m.url} controls={false} width="100%" height="100%" style={{ objectFit: 'cover', opacity: 0.3 }} noWatermark />
                                     <div style={{ position: 'absolute' as const, inset: 0, background: 'rgba(0,0,0,0.65)', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', padding: 10 }}>
                                       <div style={{ fontFamily: BARLOW, fontSize: 11, color: '#EF4444', fontWeight: 700, marginBottom: 4 }}>✗ REJECTED</div>
                                       <div style={{ fontFamily: BARLOW, fontSize: 10, color: 'rgba(255,255,255,0.7)', textAlign: 'center' as const, marginBottom: 8, lineHeight: 1.3 }}>{m.rejection_reason || 'Does not meet platform standards'}</div>
                                       <label style={{ padding: '4px 12px', background: '#C8202A', borderRadius: 4, fontFamily: BARLOW, fontSize: 11, fontWeight: 700, color: '#fff', cursor: 'pointer' }}>
                                         → Re-upload
                                         <input type="file" accept="video/*" style={{ display: 'none' }} onChange={async e => {
                                           const file = e.target.files?.[0]; if (!file) return;
                                           const u = JSON.parse(localStorage.getItem('ss_user') || '{}');
                                           const fd = new FormData(); fd.append('file', file); fd.append('replace_media_id', m.id);
                                           const res = await fetch('/api/profile/aspirant/media', { method: 'POST', headers: { Authorization: `Bearer ${u.token}` }, body: fd });
                                           if (res.ok) window.location.reload();
                                         }} />
                                       </label>
                                     </div>
                                   </div>
                                 ))}
                               </div>
                             </div>
                           )}
                         </>
                       );
                     })()}
                  </div>
                </div>
              )}

              {/*EXPERIENCE TAB*/}
              {tab === 'Experience' && (
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 12 }}>
                  {displayCredits.filter(exp => exp.title || exp.role).length > 0 ? displayCredits.filter(exp => exp.title || exp.role).map((exp, i) => (
                    <div key={i} style={{ background: BG2, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: 20 }}>
                      {/*Header row*/}
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                        <div>
                          <div style={{ fontFamily: BEBAS, fontSize: 19, letterSpacing: 1, color: '#F5F5F5' }}>{exp.role}</div>
                          <div style={{ fontSize: 16, color: GOLD, fontWeight: 600 }}>{exp.title}</div>
                          {exp.characterName && <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>as <span style={{ color: '#F5F5F5' }}>{exp.characterName}</span></div>}
                        </div>
                        <div style={{ textAlign: 'right' as const }}>
                          <div style={{ fontSize: 14, color: '#6A7080' }}>{exp.year}</div>
                          <div style={{ padding: '3px 10px', background: 'rgba(200,32,42,0.1)', border: '1px solid rgba(200,32,42,0.2)', borderRadius: 12, fontSize: 13, color: RED, marginTop: 4 }}>{exp.type}</div>
                        </div>
                      </div>
                      {/*Details grid*/}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px', marginBottom: 12 }}>
                        {exp.director && (
                          <div><span style={{ fontSize: 13, color: '#6A7080' }}>Director: </span><span style={{ fontSize: 14, color: '#F5F5F5' }}>{exp.director}</span></div>
                        )}
                        {exp.productionHouse && (
                          <div><span style={{ fontSize: 13, color: '#6A7080' }}>Production: </span><span style={{ fontSize: 14, color: '#F5F5F5' }}>{exp.productionHouse}</span></div>
                        )}
                        {exp.platform && (
                          <div><span style={{ fontSize: 13, color: '#6A7080' }}>Platform: </span><span style={{ fontSize: 14, color: '#F5F5F5' }}>{exp.platform}</span></div>
                        )}
                        {exp.language && (
                          <div><span style={{ fontSize: 13, color: '#6A7080' }}>Language: </span><span style={{ fontSize: 14, color: '#F5F5F5' }}>{exp.language}</span></div>
                        )}
                      </div>
                      {exp.description && <p style={{ fontSize: 15, color: '#A8B0BD', lineHeight: 1.6, margin: '0 0 12px 0' }}>{exp.description}</p>}
                      {/*Links*/}
                      <div style={{ display: 'flex', gap: 12 }}>
                        {exp.trailerLink && (
                          <a href={exp.trailerLink} target="_blank" rel="noopener noreferrer" style={{ fontSize: 14, color: RED, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                            ▶ Trailer
                          </a>
                        )}
                        {exp.imdbLink && (
                          <a href={exp.imdbLink} target="_blank" rel="noopener noreferrer" style={{ fontSize: 14, color: GOLD, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                            🎬 IMDb
                          </a>
                        )}
                      </div>
                    </div>
                  )) : (
                    <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: 40, textAlign: 'center' as const }}>
                      <div style={{ fontSize: 16, color: '#6A7080', marginBottom: 12 }}>No experience credits added yet.</div>
                      <button onClick={() => router.push('/create-profile')} style={{ background: RED, border: 'none', borderRadius: 7, padding: '8px 20px', color: '#fff', fontFamily: BARLOW, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>Add Credits →</button>
                    </div>
                  )}
                </div>
              )}

              {/*SKILLS TAB*/}
              {tab === 'Skills' && (
                <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: 20 }}>
                  {/*Skills*/}
                  <div style={{ fontFamily: BEBAS, fontSize: 20, letterSpacing: 1, color: '#F5F5F5', marginBottom: 14 }}>Skills</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const, marginBottom: 24 }}>
                    {liveUser.skills?.length ? liveUser.skills.map(s => (
                      <span key={s} style={{ padding: '5px 16px', background: 'rgba(200,32,42,0.1)', border: '1px solid rgba(200,32,42,0.3)', borderRadius: 20, fontSize: 15, color: RED }}>{s}</span>
                    )) : <span style={{ fontSize: 15, color: '#6A7080' }}>No skills added yet. <span onClick={() => window.location.href = '/edit-profile'} style={{ color: RED, cursor: 'pointer', textDecoration: 'underline' }}>Add skills</span></span>}
                  </div>
                  <div style={{ fontFamily: BEBAS, fontSize: 20, letterSpacing: 1, color: '#F5F5F5', marginBottom: 16 }}>Departments & Roles</div>
                  <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 12, marginBottom: 24 }}>
                    {displayDepts.length > 0 ? displayDepts.map(dept => (
                      <div key={dept} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{ width: 110, fontSize: 15, color: '#6A7080', flexShrink: 0 }}>{dept}</div>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const }}>
                          {displayRoles.filter(r => r.department === dept).map(r => (
                            <span key={r.role} style={{ padding: '4px 14px', background: 'rgba(200,32,42,0.1)', border: '1px solid rgba(200,32,42,0.3)', borderRadius: 20, fontSize: 14, color: RED }}>{r.role}</span>
                          ))}
                        </div>
                      </div>
                    )) : <div style={{ fontSize: 15, color: '#6A7080' }}>No departments added yet.</div>}
                  </div>
                  <div style={{ fontFamily: BEBAS, fontSize: 20, letterSpacing: 1, color: '#F5F5F5', marginBottom: 14 }}>Languages</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const, marginBottom: 24 }}>
                    {(liveUser.languages?.length ? liveUser.languages : []).map(l => (
                      <span key={l} style={{ padding: '5px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, fontSize: 15, color: '#A8B0BD' }}>{l}</span>
                    ))}
                    {!liveUser.languages?.length && <span style={{ fontSize: 15, color: '#6A7080' }}>No languages added yet.</span>}
                  </div>
                  <div style={{ fontFamily: BEBAS, fontSize: 20, letterSpacing: 1, color: '#F5F5F5', marginBottom: 14 }}>Available For</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const }}>
                    {(liveUser.availability?.length ? liveUser.availability : []).map(a => (
                      <span key={a} style={{ padding: '5px 14px', background: 'rgba(200,32,42,0.1)', border: '1px solid rgba(200,32,42,0.2)', borderRadius: 20, fontSize: 14, color: RED }}>{a}</span>
                    ))}
                    {!liveUser.availability?.length && <span style={{ fontSize: 15, color: '#6A7080' }}>No availability added yet.</span>}
                  </div>
                </div>
              )}

              {/*EDUCATION TAB*/}
              {tab === 'Education' && (
                <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: 40, textAlign: 'center' as const }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>🎬</div>
                  <div style={{ fontSize: 17, color: '#F5F5F5', fontWeight: 600, marginBottom: 8 }}>No education details added yet</div>
                  <div style={{ fontSize: 15, color: '#6A7080', marginBottom: 16 }}>Add your academic qualifications, workshops and training.</div>
                  <button onClick={() => router.push('/create-profile')} style={{ background: RED, border: 'none', borderRadius: 7, padding: '8px 20px', color: '#fff', fontFamily: BARLOW, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>Edit Profile →</button>
                </div>
              )}

              {/*AWARDS TAB*/}
              {tab === 'Awards' && (
                <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: 40, textAlign: 'center' as const }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>🏆</div>
                  <div style={{ fontSize: 17, color: '#F5F5F5', fontWeight: 600, marginBottom: 8 }}>No awards added yet</div>
                  <div style={{ fontSize: 15, color: '#6A7080', marginBottom: 16 }}>Add your achievements, nominations and awards.</div>
                  <button onClick={() => router.push('/create-profile')} style={{ background: RED, border: 'none', borderRadius: 7, padding: '8px 20px', color: '#fff', fontFamily: BARLOW, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>Edit Profile →</button>
                </div>
              )}

              {/*DOCUMENTS TAB*/}
              {tab === 'Documents' && (
                <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div style={{ fontFamily: BEBAS, fontSize: 20, letterSpacing: 1, color: '#F5F5F5' }}>Documents</div>
                    <button onClick={() => router.push(isApproved ? '/settings' : '/create-profile')} style={{ padding: '6px 16px', background: RED, border: 'none', borderRadius: 6, color: '#fff', fontFamily: BARLOW, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>+ Upload</button>
                  </div>
                  <div style={{ textAlign: 'center' as const, padding: '30px 0', color: '#6A7080', fontSize: 15 }}>
                    <div style={{ fontSize: 28, marginBottom: 10 }}>📞</div>
                    No documents uploaded yet.
                  </div>
                </div>
              )}
            </div>

            {/*RIGHT*/}
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16 }}>
              {/*Profile Strength*/}
              <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: 20 }}>
                <div style={{ fontFamily: BEBAS, fontSize: 20, letterSpacing: 1, color: '#F5F5F5', marginBottom: 14 }}>Profile Strength</div>
                <CircularProgress score={liveUser.profile_completion ?? 0} />
                <div style={{ textAlign: 'center' as const, fontSize: 16, color: GREEN, fontWeight: 700, marginBottom: 14 }}>{(liveUser.profile_completion ?? 0) >= 80 ? 'Excellent' : (liveUser.profile_completion ?? 0) >= 60 ? 'Good' : 'Needs Improvement'}</div>
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 8 }}>
                  {[
                    { label: 'Profile Information', done: !!(liveUser.name && liveUser.gender && liveUser.dob) },
                    { label: 'Media (Photos / Videos)', done: (liveUser.photos?.length ?? 0) > 0 },
                    { label: 'Skills & Languages', done: (liveUser.languages?.length ?? 0) > 0 },
                    { label: 'Experience', done: (liveUser.credits?.length ?? 0) > 0 || !!liveUser.experience_level },
                    { label: 'Verification', done: liveUser.profileStatus === 'approved' },
                  ].map(item => (
                    <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <CheckCircle size={14} color={item.done ? GREEN : '#6A7080'} fill={item.done ? GREEN : 'none'} />
                        <span style={{ fontSize: 14, color: '#A8B0BD' }}>{item.label}</span>
                      </div>
                      <span style={{ fontSize: 14, color: item.done ? GREEN : '#6A7080', fontWeight: 700 }}>{item.done ? '100%' : '0%'}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => router.push('/edit-profile')} style={{ width: '100%', marginTop: 14, padding: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, color: '#A8B0BD', fontFamily: BARLOW, fontSize: 15, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <TrendingUp size={14} /> Improve Profile
                </button>
              </div>

              {/*Professional Details*/}
              <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ fontFamily: BEBAS, fontSize: 20, letterSpacing: 1, color: '#F5F5F5' }}>Professional Details</div>
                  <ChevronRight size={16} color="#6A7080" />
                </div>
                {[
                  { label: 'Role Type',         val: liveUser.roles?.map(r => r.role).join(', ') || '' },
                  { label: 'Acting Experience', val: liveUser.experience_level || '' },
                  { label: 'Available For',     val: liveUser.availability?.join(', ') || '' },
                ].filter(row => row.val).map(row => (
                  <div key={row.label} style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 13, color: '#6A7080', marginBottom: 3 }}>{row.label}</div>
                    <div style={{ fontSize: 15, color: '#F5F5F5' }}>{row.val}</div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>

      {/*• • • LIGHTBOX MODAL • • •*/}
      {lightboxPhoto && (
        <div onClick={() => setLightboxPhoto(null)}
          style={{ position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/*Close*/}
          <button onClick={() => setLightboxPhoto(null)}
            style={{ position: 'absolute' as const, top: 20, right: 24, background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', fontSize: 22, width: 40, height: 40, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1001 }}>✕</button>

          {/*Prev*/}
          <button onClick={e => { e.stopPropagation(); lightboxPrev() }}
            style={{ position: 'absolute' as const, left: 20, background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', fontSize: 28, width: 48, height: 48, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1001 }}>★</button>

          {/*Image*/}
          <div onClick={e => e.stopPropagation()} style={{ maxWidth: '80vw', maxHeight: '85vh', position: 'relative' as const }}>
            <ProtectedMedia type="image" src={lightboxPhoto} alt="" style={{ maxWidth: '80vw', maxHeight: '85vh', borderRadius: 10, objectFit: 'contain', display: 'block', boxShadow: '0 20px 80px rgba(0,0,0,0.8)' }} watermarkPosition="bottom-right" />
            {/*Counter*/}
            <div style={{ position: 'absolute' as const, bottom: -36, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8 }}>
              {displayPhotos.map((_, i) => (
                <div key={i} onClick={e => { e.stopPropagation(); setLightboxIdx(i); setLightboxPhoto(displayPhotos[i]) }}
                  style={{ width: i === lightboxIdx ? 24 : 8, height: 8, borderRadius: 4, background: i === lightboxIdx ? RED : 'rgba(255,255,255,0.3)', cursor: 'pointer', transition: 'all 0.2s' }} />
              ))}
            </div>
          </div>

          {/*Next*/}
          <button onClick={e => { e.stopPropagation(); lightboxNext() }}
            style={{ position: 'absolute' as const, right: 20, background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', fontSize: 28, width: 48, height: 48, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1001 }}>★</button>
        </div>
      )}

      {/*• • • VIDEO PLAYER MODAL • • •*/}
      {videoPlayer && (
        <div onClick={() => setVideoPlayer(null)}
          style={{ position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <button onClick={() => setVideoPlayer(null)}
            style={{ position: 'absolute' as const, top: 20, right: 24, background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', fontSize: 22, width: 40, height: 40, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1001 }}>✕</button>
          <div onClick={e => e.stopPropagation()} style={{ width: '75vw', maxWidth: 960 }}>
            {videoPlayer.startsWith('http') ? (
              <ProtectedMedia type="video" src={videoPlayer} controls autoPlay width="100%" style={{ borderRadius: 10, outline: 'none', boxShadow: '0 20px 80px rgba(0,0,0,0.8)' }} />
            ) : (
              <iframe src={videoPlayer} style={{ width: '100%', aspectRatio: '16/9', border: 'none', borderRadius: 10, boxShadow: '0 20px 80px rgba(0,0,0,0.8)' }} allowFullScreen />
            )}
          </div>
        </div>
      )}
    </div>
  )
}