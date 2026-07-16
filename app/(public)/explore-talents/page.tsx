'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import SilverScreensLogo from '@/components/ui/SilverScreensLogo'
import {
  Search, MapPin, Star, ChevronDown, Heart, Eye, Clock,
  Users, Mic2, Film, Music, Camera, Clapperboard, Pen,
  SlidersHorizontal, ChevronRight, X, Menu, ChevronLeft,
  LayoutDashboard, FileText, Bookmark, Bell, MessageSquare,
} from 'lucide-react';

const RED    = '#C8202A';
const GOLD   = '#D4A64A';
const BG     = '#050505';
const BG2    = '#0B0F14';
const BG3    = '#121821';
const BG4    = '#1C2030';
const BARLOW = '"Barlow Condensed", sans-serif';
const BEBAS  = "'Bebas Neue', sans-serif";

const SIDEBAR_CATS = [
  { label: 'All Talents',       value: 'all',       icon: Users,       count: 15 },
  { label: 'Actors & Actresses',value: 'Acting',     icon: Clapperboard, count: 5  },
  { label: 'Models',            value: 'Modelling',  icon: Users,       count: 3  },
  { label: 'Dancers',           value: 'Dancing',    icon: Music,       count: 2  },
  { label: 'Singers',           value: 'Singing',    icon: Mic2,        count: 2  },
  { label: 'Directors',         value: 'Direction',  icon: Film,        count: 1  },
  { label: 'Crew',              value: 'Crew',       icon: Camera,      count: 2  },
];

const LOCATION_OPTS   = ['All Locations', 'Mumbai', 'Delhi', 'Hyderabad', 'Bangalore', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad'];
const LANGUAGE_OPTS   = ['All Languages', 'Hindi', 'English', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Bengali', 'Gujarati'];
const GENDER_OPTS     = ['All Genders', 'Male', 'Female'];
const SKILLS_OPTS     = ['All Skills', 'Method Acting', 'Voice Modulation', 'Dancing', 'Action', 'Comedy', 'Drama', 'Modelling', 'Singing'];
const SORT_OPTS       = ['Most Relevant', 'Most Viewed', 'Top Rated', 'Newest First'];

const NAV_ITEMS = [
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

type Talent = {
  id: number; name: string; category: string; speciality: string;
  location: string; languages: string[]; experience: string; experienceYears: number;
  gender: string; age: number;
  rating: number; reviews: number; views: number;
  verified: boolean; premium: boolean;
  img: string; tags: string[];
};

const TALENTS: Talent[] = [
  { id: 1,  name: 'Arjun Malhotra', category: 'Acting',    speciality: 'Method Actor',        location: 'Mumbai',    languages: ['Hindi','English'],      experience: '6 Years',  experienceYears: 6,  gender: 'Male',   age: 28, rating: 4.9, reviews: 128, views: 3400, verified: true,  premium: true,  img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face', tags: ['Film','Web Series','Theatre'] },
  { id: 2,  name: 'Priya Kapoor',   category: 'Acting',    speciality: 'Lead Actress',         location: 'Mumbai',    languages: ['Hindi','Marathi'],      experience: '4 Years',  experienceYears: 4,  gender: 'Female', age: 25, rating: 4.8, reviews: 94,  views: 2900, verified: true,  premium: true,  img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop&crop=face', tags: ['Drama','Romance','OTT'] },
  { id: 3,  name: 'Vikram Nair',    category: 'Acting',    speciality: 'Character Actor',      location: 'Chennai',   languages: ['Tamil','English'],      experience: '9 Years',  experienceYears: 9,  gender: 'Male',   age: 36, rating: 4.7, reviews: 201, views: 4100, verified: true,  premium: false, img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop&crop=face', tags: ['Action','Thriller','Film'] },
  { id: 4,  name: 'Ananya Singh',   category: 'Modelling', speciality: 'Fashion Model',        location: 'Delhi',     languages: ['Hindi','English'],      experience: '3 Years',  experienceYears: 3,  gender: 'Female', age: 23, rating: 4.6, reviews: 67,  views: 5200, verified: true,  premium: true,  img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop&crop=face', tags: ['Fashion','Ramp','Editorial'] },
  { id: 5,  name: 'Rohan Verma',    category: 'Acting',    speciality: 'Supporting Actor',     location: 'Hyderabad', languages: ['Telugu','Hindi'],       experience: '2 Years',  experienceYears: 2,  gender: 'Male',   age: 24, rating: 4.5, reviews: 43,  views: 1800, verified: false, premium: false, img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop&crop=face', tags: ['Web Series','Drama'] },
  { id: 6,  name: 'Kavya Menon',    category: 'Dancing',   speciality: 'Classical Dancer',     location: 'Bangalore', languages: ['Kannada','Tamil'],      experience: '7 Years',  experienceYears: 7,  gender: 'Female', age: 27, rating: 4.9, reviews: 156, views: 3800, verified: true,  premium: true,  img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=500&fit=crop&crop=face', tags: ['Bharatnatyam','Stage','Films'] },
  { id: 7,  name: 'Rahul Sharma',   category: 'Singing',   speciality: 'Playback Singer',      location: 'Mumbai',    languages: ['Hindi','English'],      experience: '5 Years',  experienceYears: 5,  gender: 'Male',   age: 30, rating: 4.7, reviews: 89,  views: 2600, verified: true,  premium: false, img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=500&fit=crop&crop=face', tags: ['Bollywood','Indie','Studio'] },
  { id: 8,  name: 'Meera Iyer',     category: 'Modelling', speciality: 'Commercial Model',     location: 'Chennai',   languages: ['Tamil','English'],      experience: '4 Years',  experienceYears: 4,  gender: 'Female', age: 26, rating: 4.5, reviews: 52,  views: 2200, verified: true,  premium: false, img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop&crop=face', tags: ['Ad Film','Commercial','Print'] },
  { id: 9,  name: 'Siddharth Roy',  category: 'Direction', speciality: 'Film Director',        location: 'Mumbai',    languages: ['Hindi','English'],      experience: '8 Years',  experienceYears: 8,  gender: 'Male',   age: 38, rating: 4.8, reviews: 34,  views: 1900, verified: true,  premium: true,  img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=500&fit=crop&crop=face', tags: ['Feature Film','Web Series'] },
  { id: 10, name: 'Nisha Patel',    category: 'Acting',    speciality: 'Versatile Actor',      location: 'Ahmedabad', languages: ['Gujarati','Hindi'],     experience: '1 Year',   experienceYears: 1,  gender: 'Female', age: 22, rating: 4.6, reviews: 21,  views: 1200, verified: true,  premium: false, img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=500&fit=crop&crop=face', tags: ['Family','Drama'] },
  { id: 11, name: 'Karan Bose',     category: 'Crew',      speciality: 'Cinematographer',      location: 'Kolkata',   languages: ['Bengali','Hindi'],      experience: '10 Years', experienceYears: 10, gender: 'Male',   age: 35, rating: 4.9, reviews: 78,  views: 2400, verified: true,  premium: true,  img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=500&fit=crop&crop=face', tags: ['DOP','Feature Film','OTT'] },
  { id: 12, name: 'Divya Reddy',    category: 'Dancing',   speciality: 'Contemporary Dancer',  location: 'Hyderabad', languages: ['Telugu','English'],     experience: '5 Years',  experienceYears: 5,  gender: 'Female', age: 26, rating: 4.7, reviews: 112, views: 3100, verified: true,  premium: false, img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=500&fit=crop&crop=face', tags: ['Contemporary','Fusion','Stage'] },
  { id: 13, name: 'Aisha Khan',     category: 'Modelling', speciality: 'Runway Model',         location: 'Mumbai',    languages: ['Hindi','Urdu'],         experience: '2 Years',  experienceYears: 2,  gender: 'Female', age: 22, rating: 4.4, reviews: 38,  views: 2800, verified: true,  premium: false, img: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=500&fit=crop&crop=face', tags: ['Ramp','Editorial','Fashion'] },
  { id: 14, name: 'Dev Patel',      category: 'Acting',    speciality: 'Action Actor',         location: 'Delhi',     languages: ['Hindi','Punjabi'],      experience: '3 Years',  experienceYears: 3,  gender: 'Male',   age: 27, rating: 4.5, reviews: 55,  views: 2100, verified: false, premium: false, img: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&h=500&fit=crop&crop=face', tags: ['Action','Stunt','Film'] },
  { id: 15, name: 'Pooja Nair',     category: 'Singing',   speciality: 'Classical Vocalist',   location: 'Bangalore', languages: ['Kannada','Hindi'],      experience: '6 Years',  experienceYears: 6,  gender: 'Female', age: 29, rating: 4.8, reviews: 93,  views: 1700, verified: true,  premium: true,  img: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=500&fit=crop&crop=face', tags: ['Classical','Carnatic','Stage'] },
];

function FilterDropdown({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const isDefault = value === options[0];
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', fontFamily: BARLOW, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>{label}</div>
      <div style={{ position: 'relative' }}>
        <div onClick={() => setOpen(v => !v)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: BG4, border: `1px solid ${open ? RED : 'rgba(255,255,255,0.1)'}`, borderRadius: 8, padding: '9px 12px', cursor: 'pointer', transition: 'border-color 0.15s' }}>
          <span style={{ fontSize: 16, color: isDefault ? 'rgba(255,255,255,0.4)' : '#fff', fontFamily: BARLOW }}>{value}</span>
          <ChevronDown size={13} color="rgba(255,255,255,0.4)" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
        </div>
        {open && (
          <div style={{ position: 'absolute', top: 'calc(100% + 3px)', left: 0, right: 0, background: BG3, border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, overflow: 'hidden', zIndex: 300, boxShadow: '0 8px 24px rgba(0,0,0,0.6)' }}>
            {options.map(opt => (
              <div key={opt} onClick={() => { onChange(opt); setOpen(false); }} style={{ padding: '10px 12px', fontSize: 16, fontFamily: BARLOW, cursor: 'pointer', color: value === opt ? RED : 'rgba(255,255,255,0.7)', background: value === opt ? 'rgba(200,32,42,0.08)' : 'transparent', transition: 'background 0.15s' }}
                onMouseEnter={e => { if (value !== opt) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = value === opt ? 'rgba(200,32,42,0.08)' : 'transparent'; }}
              >{opt}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ExploreTalentsPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();

  const [activeCategory, setActiveCategory] = useState('all');
  const [search,         setSearch]         = useState('');
  const [location,       setLocation]       = useState('All Locations');
  const [language,       setLanguage]       = useState('All Languages');
  const [gender,         setGender]         = useState('All Genders');
  const [skill,          setSkill]          = useState('All Skills');
  const [ageMin,         setAgeMin]         = useState(18);
  const [ageMax,         setAgeMax]         = useState(65);
  const [sortBy,         setSortBy]         = useState('Most Relevant');
  const [sortOpen,       setSortOpen]       = useState(false);
  const [savedIds,       setSavedIds]       = useState<Set<number>>(new Set());
  const [userType,       setUserType]       = useState<string | null>(null);
  const [isLoggedIn,     setIsLoggedIn]     = useState(false);
  const [sidebarOpen,    setSidebarOpen]    = useState(false);
  const [filterOpen,     setFilterOpen]     = useState(false);
  const [dropdownOpen,   setDropdownOpen]   = useState(false);
  const [userName,       setUserName]       = useState('My Account');

  const SB_W = sidebarOpen ? 230 : 52

  const handleLogout = () => {
    localStorage.removeItem('ss_user')
    window.location.replace('/login')
  }

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat && SIDEBAR_CATS.find(c => c.value === cat)) setActiveCategory(cat);
  }, [searchParams]);

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('ss_user') || '{}');
      if (u?.loggedIn) { setIsLoggedIn(true); setUserType(u.userType || null); if (u.name) setUserName(u.name); }
    } catch {}
  }, []);

  const hasFilters = location !== 'All Locations' || language !== 'All Languages' || gender !== 'All Genders' || skill !== 'All Skills' || ageMin !== 18 || ageMax !== 65 || search;

  function resetFilters() {
    setLocation('All Locations'); setLanguage('All Languages');
    setGender('All Genders'); setSkill('All Skills');
    setAgeMin(18); setAgeMax(65); setSearch('');
  }

  function toggleSave(id: number) {
    setSavedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }

  const filtered = useMemo(() => {
    let list = TALENTS.filter(t => {
      if (activeCategory !== 'all' && t.category !== activeCategory) return false;
      if (search && !t.name.toLowerCase().includes(search.toLowerCase()) && !t.speciality.toLowerCase().includes(search.toLowerCase()) && !t.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))) return false;
      if (location !== 'All Locations' && t.location !== location) return false;
      if (language !== 'All Languages' && !t.languages.includes(language)) return false;
      if (gender !== 'All Genders' && t.gender !== gender) return false;
      if (t.age < ageMin || t.age > ageMax) return false;
      return true;
    });
    if (sortBy === 'Most Viewed')  list = [...list].sort((a, b) => b.views  - a.views);
    if (sortBy === 'Top Rated')    list = [...list].sort((a, b) => b.rating - a.rating);
    if (sortBy === 'Newest First') list = [...list].sort((a, b) => a.id     - b.id);
    return list;
  }, [activeCategory, search, location, language, gender, ageMin, ageMax, sortBy]);

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
            <Link key={link.label} href={link.href} style={{ padding: '6px 10px', textDecoration: 'none', color: link.href === '/explore-talents' ? '#fff' : 'rgba(255,255,255,0.55)', fontSize: 15, fontFamily: BARLOW, fontWeight: link.href === '/explore-talents' ? 600 : 500, whiteSpace: 'nowrap' as const, position: 'relative' as const }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={e => (e.currentTarget.style.color = link.href === '/explore-talents' ? '#fff' : 'rgba(255,255,255,0.55)')}
            >
              {link.label}
              {link.href === '/explore-talents' && <span style={{ position: 'absolute' as const, bottom: 0, left: 10, right: 10, height: 1, background: RED }} />}
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
              <div style={{ position: 'absolute' as const, top: -5, right: -5, background: RED, borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>3</div>
            </div>
            <div onClick={() => router.push('/messages')} style={{ position: 'relative' as const, cursor: 'pointer' }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MessageSquare size={16} /></div>
              <div style={{ position: 'absolute' as const, top: -5, right: -5, background: RED, borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>2</div>
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
                      <div key={label} onClick={() => { setDropdownOpen(false); label === 'Logout' ? handleLogout() : router.push(href) }}
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
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

      {/* ══ COLLAPSIBLE NAV SIDEBAR (logged-in only) ══ */}
      {isLoggedIn && (
      <aside style={{ width: SB_W, flexShrink: 0, background: BG2, borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column' as const, overflowY: 'auto' as const, overflowX: 'hidden', scrollbarWidth: 'none' as const, transition: 'width 0.2s ease', height: 'calc(100vh - 60px)', position: 'sticky' as const, top: 60 }}>
        <div style={{ height: 52, display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'flex-end' : 'center', padding: sidebarOpen ? '0 12px' : 0, borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
          <button onClick={() => setSidebarOpen(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', width: 30, height: 30, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'none')}
          >{sidebarOpen ? <ChevronLeft size={16} /> : <Menu size={16} />}</button>
        </div>
        <nav style={{ flex: 1, padding: sidebarOpen ? '8px 6px' : '8px 4px', overflowY: 'auto' as const, scrollbarWidth: 'none' as const }}>
          {NAV_ITEMS.map(({ icon: Icon, label, href, badge }) => {
            const active = href === '/explore-talents'
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

      {/* ══ SCROLLABLE AREA ══ */}
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
        {/* Category list */}
        <div style={{ padding: '16px 0' }}>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', fontFamily: BARLOW, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 1.5, padding: '0 16px', marginBottom: 8 }}>Browse Categories</div>
          {SIDEBAR_CATS.map(({ label, value, icon: Icon, count }) => {
            const active = activeCategory === value;
            return (
              <div key={value} onClick={() => setActiveCategory(value)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', cursor: 'pointer', background: active ? 'rgba(200,32,42,0.12)' : 'transparent', borderLeft: active ? `3px solid ${RED}` : '3px solid transparent', transition: 'background 0.15s' }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Icon size={15} color={active ? RED : 'rgba(255,255,255,0.4)'} strokeWidth={active ? 2.5 : 1.8} />
                  <span style={{ fontSize: 16, fontFamily: BARLOW, color: active ? '#fff' : 'rgba(255,255,255,0.65)', fontWeight: active ? 600 : 400 }}>{label}</span>
                </div>
                <span style={{ fontSize: 14, fontFamily: BARLOW, color: active ? RED : 'rgba(255,255,255,0.3)', fontWeight: 600 }}>{count.toLocaleString()}</span>
              </div>
            );
          })}
        </div>

        <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '0 16px' }} />

        {/* Filters */}
        <div style={{ padding: '16px 16px 24px', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <SlidersHorizontal size={15} color="rgba(255,255,255,0.5)" />
              <span style={{ fontSize: 17, fontFamily: BARLOW, fontWeight: 600, color: '#fff' }}>Filters</span>
            </div>
            {hasFilters && (
              <button onClick={resetFilters} style={{ background: 'none', border: 'none', color: RED, fontSize: 14, fontFamily: BARLOW, fontWeight: 600, cursor: 'pointer', padding: 0 }}>Clear All</button>
            )}
          </div>

          <FilterDropdown label="Location"  value={location} options={LOCATION_OPTS} onChange={setLocation} />
          <FilterDropdown label="Gender"    value={gender}   options={GENDER_OPTS}   onChange={setGender}   />
          <FilterDropdown label="Language"  value={language} options={LANGUAGE_OPTS} onChange={setLanguage} />

          {/* Age Range */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', fontFamily: BARLOW, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Age Range</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 15, color: GOLD, fontFamily: BARLOW, fontWeight: 600 }}>{ageMin} Yrs</span>
              <span style={{ fontSize: 15, color: GOLD, fontFamily: BARLOW, fontWeight: 600 }}>{ageMax >= 65 ? '65+ Yrs' : `${ageMax} Yrs`}</span>
            </div>
            <div style={{ position: 'relative', height: 20 }}>
              <div style={{ position: 'absolute', height: 4, background: BG4, borderRadius: 2, top: 8, left: 0, right: 0 }} />
              <div style={{ position: 'absolute', height: 4, background: RED, borderRadius: 2, top: 8, left: `${((ageMin - 18) / 47) * 100}%`, right: `${100 - ((Math.min(ageMax, 65) - 18) / 47) * 100}%` }} />
              <input type="range" min={18} max={65} value={ageMin} onChange={e => setAgeMin(Math.min(+e.target.value, ageMax - 1))} style={{ position: 'absolute', width: '100%', top: 0, height: 20, opacity: 0, cursor: 'pointer', zIndex: 2 }} />
              <input type="range" min={18} max={65} value={ageMax} onChange={e => setAgeMax(Math.max(+e.target.value, ageMin + 1))} style={{ position: 'absolute', width: '100%', top: 0, height: 20, opacity: 0, cursor: 'pointer', zIndex: 3 }} />
              <div style={{ position: 'absolute', width: 16, height: 16, borderRadius: '50%', background: RED, border: '2px solid #fff', top: 2, left: `calc(${((ageMin - 18) / 47) * 100}% - 8px)`, pointerEvents: 'none', boxShadow: '0 2px 6px rgba(0,0,0,0.4)' }} />
              <div style={{ position: 'absolute', width: 16, height: 16, borderRadius: '50%', background: RED, border: '2px solid #fff', top: 2, left: `calc(${((Math.min(ageMax, 65) - 18) / 47) * 100}% - 8px)`, pointerEvents: 'none', boxShadow: '0 2px 6px rgba(0,0,0,0.4)' }} />
            </div>
          </div>

          <FilterDropdown label="Skills" value={skill} options={SKILLS_OPTS} onChange={setSkill} />
        </div>
        </>)}
      </aside>

      {/* ══ MAIN CONTENT ══ */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <div style={{ background: BG2, borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '24px 28px 0' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <h1 style={{ fontFamily: BEBAS, fontSize: 40, fontWeight: 400, letterSpacing: 2, color: '#fff', lineHeight: 1, marginBottom: 4 }}>
                EXPLORE <span style={{ color: RED }}>TALENTS</span>
              </h1>
              <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.45)', fontFamily: BARLOW }}>
                Discover verified talent across acting, modelling, dance, music and more.
              </p>
            </div>
            {/* Sort */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div onClick={() => setSortOpen(v => !v)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '9px 14px', cursor: 'pointer' }}>
                <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', fontFamily: BARLOW }}>Sort: {sortBy}</span>
                <ChevronDown size={13} color="rgba(255,255,255,0.4)" style={{ transform: sortOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
              </div>
              {sortOpen && (
                <div style={{ position: 'absolute', top: 'calc(100% + 4px)', right: 0, background: BG3, border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, overflow: 'hidden', zIndex: 200, boxShadow: '0 8px 24px rgba(0,0,0,0.5)', minWidth: 180 }}>
                  {SORT_OPTS.map(opt => (
                    <div key={opt} onClick={() => { setSortBy(opt); setSortOpen(false); }} style={{ padding: '10px 16px', fontSize: 16, fontFamily: BARLOW, cursor: 'pointer', color: sortBy === opt ? RED : 'rgba(255,255,255,0.7)', background: sortBy === opt ? 'rgba(200,32,42,0.08)' : 'transparent' }}
                      onMouseEnter={e => { if (sortBy !== opt) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = sortBy === opt ? 'rgba(200,32,42,0.08)' : 'transparent'; }}
                    >{opt}</div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '0 16px', height: 46, marginBottom: 16 }}>
            <Search size={18} color="rgba(255,255,255,0.35)" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, skill, speciality or tag..." style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: 17, fontFamily: BARLOW }} />
            {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 20, lineHeight: 1, display: 'flex', alignItems: 'center' }}><X size={16} /></button>}
          </div>

          {/* Category tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            {SIDEBAR_CATS.map(cat => {
              const active = activeCategory === cat.value;
              return (
                <button key={cat.value} onClick={() => setActiveCategory(cat.value)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '10px 16px', marginBottom: -1, fontFamily: BARLOW, fontSize: 17, fontWeight: active ? 700 : 400, color: active ? RED : 'rgba(255,255,255,0.5)', borderBottom: active ? `2px solid ${RED}` : '2px solid transparent', whiteSpace: 'nowrap' }}>
                  {cat.label} <span style={{ fontSize: 14, color: active ? RED : 'rgba(255,255,255,0.3)' }}>({cat.count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid */}
        <div style={{ flex: 1, padding: '20px 28px 40px', overflowY: 'auto' }} onClick={() => setSortOpen(false)}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.45)', fontFamily: BARLOW }}>
              Showing <strong style={{ color: '#fff' }}>{filtered.length}</strong> talent{filtered.length !== 1 ? 's' : ''}
              {search && <> matching <strong style={{ color: GOLD }}>&ldquo;{search}&rdquo;</strong></>}
            </span>
            {hasFilters && (
              <button onClick={resetFilters} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'transparent', border: '1px solid rgba(200,32,42,0.35)', color: RED, borderRadius: 6, padding: '5px 12px', fontSize: 15, fontFamily: BARLOW, cursor: 'pointer' }}>
                <X size={13} /> Clear Filters
              </button>
            )}
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🎬</div>
              <div style={{ fontSize: 22, fontFamily: BARLOW, fontWeight: 600, color: '#fff', marginBottom: 8 }}>No talents found</div>
              <div style={{ fontSize: 17, color: 'rgba(255,255,255,0.45)', fontFamily: BARLOW, marginBottom: 20 }}>Try adjusting your search or filters</div>
              <button onClick={resetFilters} style={{ background: RED, border: 'none', color: '#fff', borderRadius: 8, padding: '10px 28px', fontSize: 17, fontFamily: BARLOW, fontWeight: 700, cursor: 'pointer' }}>Clear All Filters</button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
              {filtered.map(talent => {
                const saved = savedIds.has(talent.id);
                return (
                  <div key={talent.id} style={{ background: BG2, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, overflow: 'hidden', cursor: 'pointer', transition: 'border-color 0.2s, transform 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                    onClick={() => router.push(`/explore-talents/${talent.id}`)}
                  >
                    {/* Photo */}
                    <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden' }}>
                      <img src={talent.img} alt={talent.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(11,15,20,0.96) 0%, rgba(11,15,20,0.15) 50%, transparent 100%)' }} />

                      {/* Badges */}
                      <div style={{ position: 'absolute', top: 8, left: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {talent.verified && <div style={{ background: 'rgba(29,155,240,0.92)', borderRadius: 20, padding: '3px 8px' }}><span style={{ fontSize: 14, color: '#fff', fontFamily: BARLOW, fontWeight: 700 }}>✓ Verified</span></div>}
                        {talent.premium  && <div style={{ background: 'rgba(212,166,74,0.92)', borderRadius: 20, padding: '3px 8px' }}><span style={{ fontSize: 14, color: '#000', fontFamily: BARLOW, fontWeight: 700 }}>👑 Premium</span></div>}
                      </div>

                      {/* Save */}
                      <button onClick={e => { e.stopPropagation(); toggleSave(talent.id); }} style={{ position: 'absolute', top: 8, right: 8, width: 30, height: 30, borderRadius: '50%', background: saved ? 'rgba(200,32,42,0.9)' : 'rgba(0,0,0,0.55)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}>
                        <Heart size={14} color="#fff" fill={saved ? '#fff' : 'none'} />
                      </button>

                      {/* Name overlay */}
                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '10px 12px' }}>
                        <div style={{ fontSize: 19, fontFamily: BARLOW, fontWeight: 700, color: '#fff', lineHeight: 1.2, marginBottom: 1 }}>{talent.name}</div>
                        <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.65)', fontFamily: BARLOW }}>{talent.speciality}</div>
                      </div>
                    </div>

                    {/* Card body */}
                    <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 7 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <MapPin size={12} color="rgba(255,255,255,0.4)" />
                          <span style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', fontFamily: BARLOW }}>{talent.location}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Clock size={12} color="rgba(255,255,255,0.4)" />
                          <span style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', fontFamily: BARLOW }}>{talent.experience}</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                        {talent.tags.slice(0, 3).map(tag => (
                          <span key={tag} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 20, padding: '2px 8px', fontSize: 14, color: 'rgba(255,255,255,0.5)', fontFamily: BARLOW }}>{tag}</span>
                        ))}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 5, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Star size={13} color={GOLD} fill={GOLD} />
                          <span style={{ fontSize: 16, color: '#fff', fontFamily: BARLOW, fontWeight: 700 }}>{talent.rating}</span>
                          <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW }}>({talent.reviews})</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Eye size={12} color="rgba(255,255,255,0.35)" />
                          <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', fontFamily: BARLOW }}>{(talent.views / 1000).toFixed(1)}k</span>
                        </div>
                      </div>

                      <button
                        onClick={e => {
                          e.stopPropagation();
                          if (!isLoggedIn) { router.push('/login'); return; }
                          router.push(`/explore-talents/${talent.id}`);
                        }}
                        style={{ width: '100%', background: 'transparent', border: `1px solid ${RED}`, color: RED, borderRadius: 8, padding: '8px 0', fontSize: 16, fontWeight: 600, fontFamily: BARLOW, cursor: 'pointer', transition: 'background 0.2s, color 0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = RED; e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = RED; }}
                      >{isLoggedIn ? 'View Profile' : '🔒 Login to View'}</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {filtered.length > 0 && (
            <div style={{ textAlign: 'center', marginTop: 36 }}>
              <button style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.65)', borderRadius: 8, padding: '12px 40px', fontSize: 17, fontFamily: BARLOW, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = RED; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; }}
              >Load More Talents</button>
            </div>
          )}
        </div>
      </div>
      </div> {/* end scrollable area */}
      </div> {/* end body row */}
    </div>
  );
}