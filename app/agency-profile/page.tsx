'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SilverScreensLogo from '@/components/ui/SilverScreensLogo';
import {
  LayoutDashboard, Megaphone, PlusCircle, ClipboardList,
  UserSearch, Star, CalendarCheck, MessageSquare, Bell,
  Bookmark, ChevronDown, ChevronLeft, Menu, Edit,
  MapPin, Globe, Mail, Calendar, Users, Building2,
  CheckCircle2, TrendingUp, Film, ChevronRight,
} from 'lucide-react';

/* ─── Design tokens ───────────────────────────────────────────── */
const RED    = '#C8202A';
const GOLD   = '#D4A64A';
const GREEN  = '#22C55E';
const BLUE   = '#3B82F6';
const PURPLE = '#8B5CF6';
const BG     = '#050505';
const BG2    = '#0B0F14';
const BG3    = '#121821';
const BG4    = '#1C2030';
const BEBAS  = "'Bebas Neue', sans-serif";
const BARLOW = "'Barlow Condensed', sans-serif";

/* ─── Nav ─────────────────────────────────────────────────────── */
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

/* ─── Data ────────────────────────────────────────────────────── */
const TABS = ['Overview', 'Casting Calls', 'Applications', 'Auditions', 'Saved Talents', 'Team'];

const PROJECTS = [
  { tag: 'Web Series',  title: 'City of Dreams S2', year: 2023, sub: '9 Episodes', img: 'photo-1536440136628-849c177e76a1' },
  { tag: 'Film',        title: 'Beyond Limits',      year: 2022, sub: 'Drama',      img: 'photo-1518676590629-3dcbd9c5a5c9' },
  { tag: 'Music Video', title: 'Jeene De Na',         year: 2024, sub: '',           img: 'photo-1493225457124-a3eb161ffa5f' },
  { tag: 'Film',        title: 'The Last Chapter',   year: 2024, sub: 'Thriller',   img: 'photo-1489599849927-2ee91cede3ba' },
];

const ALL_PROJECTS = [
  { tag: 'Web Series',  title: 'City of Dreams S2',    year: 2023, sub: '9 Episodes',  img: 'photo-1536440136628-849c177e76a1' },
  { tag: 'Film',        title: 'Beyond Limits',         year: 2022, sub: 'Drama',       img: 'photo-1518676590629-3dcbd9c5a5c9' },
  { tag: 'Music Video', title: 'Jeene De Na',            year: 2024, sub: '',            img: 'photo-1493225457124-a3eb161ffa5f' },
  { tag: 'Film',        title: 'The Last Chapter',      year: 2024, sub: 'Thriller',    img: 'photo-1489599849927-2ee91cede3ba' },
  { tag: 'TV Show',     title: 'Dastaan-e-Mohabbat',    year: 2023, sub: '26 Episodes', img: 'photo-1478720568477-152d9b164e26' },
  { tag: 'Short Film',  title: 'The Silent Call',        year: 2022, sub: 'Drama',       img: 'photo-1524712245354-2c4e5e7121c0' },
  { tag: 'Film',        title: 'Rang De Sapne',          year: 2021, sub: 'Romance',     img: 'photo-1598387993441-a364f854cfbd' },
  { tag: 'Web Series',  title: 'Midnight Chronicles',   year: 2023, sub: '8 Episodes',  img: 'photo-1485846234645-a62644f84728' },
];

const CASTING_CALLS = [
  { title: 'Lead Actor – Feature Film',      type: 'Feature Film', city: 'Mumbai', apps: 124, status: 'Open'   },
  { title: 'Female Lead – Web Series',       type: 'Web Series',   city: 'Mumbai', apps: 98,  status: 'Open'   },
  { title: 'Supporting Actor – TV Show',     type: 'TV Show',      city: 'Mumbai', apps: 76,  status: 'Open'   },
  { title: 'Child Artist – Short Film',      type: 'Short Film',   city: 'Delhi',  apps: 45,  status: 'Open'   },
  { title: 'Dancer – Music Video',           type: 'Music Video',  city: 'Mumbai', apps: 62,  status: 'Closed' },
  { title: 'Voice Artist – Animation',       type: 'Animation',    city: 'Remote', apps: 38,  status: 'Open'   },
];

const HIRED_TALENTS = [
  { name: 'Arjun Malhotra', role: 'Actor',     project: 'City of Dreams S2', img: 'photo-1507003211169-0a1dd7228f2d' },
  { name: 'Meera Iyer',     role: 'Actress',   project: 'Beyond Limits',      img: 'photo-1494790108377-be9c29b29330' },
  { name: 'Kabir Singh',    role: 'Actor',     project: 'The Last Chapter',   img: 'photo-1500648767791-00dcc994a43e' },
  { name: 'Ananya Sharma',  role: 'Actress',   project: 'Jeene De Na',         img: 'photo-1529626455594-4ff0802cfb7e' },
  { name: 'Rohan Verma',    role: 'Director',  project: 'Beyond Limits',      img: 'photo-1472099645785-5658abf4ff4e' },
  { name: 'Priya Kapoor',   role: 'Actress',   project: 'City of Dreams S2',  img: 'photo-1517841905240-472988babdf9' },
  { name: 'Dev Anand',      role: 'Actor',     project: 'Rang De Sapne',       img: 'photo-1463453091185-61582044d556' },
  { name: 'Sunita Rao',     role: 'Actress',   project: 'Midnight Chronicles', img: 'photo-1524504388940-b1c1722653e1' },
];

const REVIEWS = [
  { name: 'Ritika Malhotra', role: 'Actress', img: 'photo-1494790108377-be9c29b29330', rating: 5.0, review: 'Silver Paradise is one of the most professional production houses I have worked with. Exceptional team and incredible work ethic.', time: '2 weeks ago' },
  { name: 'Arjun Kapoor',    role: 'Actor',   img: 'photo-1507003211169-0a1dd7228f2d', rating: 4.8, review: 'Incredible experience working with Silver Paradise. They truly understand talent and bring out the best in every project.', time: '1 month ago' },
  { name: 'Neha Singh',      role: 'Model',   img: 'photo-1529626455594-4ff0802cfb7e', rating: 5.0, review: 'Outstanding professionalism and creativity. Would highly recommend Silver Paradise to any aspiring talent.', time: '2 months ago' },
  { name: 'Vikram Nair',     role: 'Actor',   img: 'photo-1500648767791-00dcc994a43e', rating: 4.5, review: 'A fantastic production house with a clear vision. They made the entire casting and production process seamless.', time: '3 months ago' },
];

const TEAM_MEMBERS = [
  { name: 'Rajesh Kumar',   role: 'Founder & CEO',       img: 'photo-1472099645785-5658abf4ff4e' },
  { name: 'Priya Mehta',    role: 'Creative Director',   img: 'photo-1517841905240-472988babdf9' },
  { name: 'Amit Sharma',    role: 'Casting Director',    img: 'photo-1463453091185-61582044d556' },
  { name: 'Sunita Patel',   role: 'Production Manager',  img: 'photo-1524504388940-b1c1722653e1' },
  { name: 'Dev Malhotra',   role: 'Post Production Head',img: 'photo-1500648767791-00dcc994a43e' },
  { name: 'Riya Verma',     role: 'Talent Relations',    img: 'photo-1529626455594-4ff0802cfb7e' },
];

const APPLICATIONS = [
  { name: 'Arjun Malhotra',  role: 'Lead Actor',        casting: 'City of Dreams',         img: 'photo-1507003211169-0a1dd7228f2d', status: 'Shortlisted',        time: '2 hrs ago'    },
  { name: 'Meera Iyer',      role: 'Female Lead',        casting: 'Beyond Limits',          img: 'photo-1494790108377-be9c29b29330', status: 'Under Review',       time: '5 hrs ago'    },
  { name: 'Rohan Verma',     role: 'Supporting Actor',   casting: 'Rang De Sapne',           img: 'photo-1472099645785-5658abf4ff4e', status: 'Audition Scheduled', time: 'Yesterday'    },
  { name: 'Ananya Sharma',   role: 'Lead Actress',       casting: 'Midnight Chronicles',    img: 'photo-1529626455594-4ff0802cfb7e', status: 'Under Review',       time: 'Yesterday'    },
  { name: 'Kabir Singh',     role: 'Antagonist',         casting: 'The Last Chapter',       img: 'photo-1500648767791-00dcc994a43e', status: 'Shortlisted',        time: '2 days ago'   },
  { name: 'Priya Kapoor',    role: 'Supporting Actress', casting: 'City of Dreams',         img: 'photo-1517841905240-472988babdf9', status: 'Rejected',           time: '3 days ago'   },
];

const AUDITIONS = [
  { title: 'Lead Actor Audition – City of Dreams',      date: '28 Jun 2026', location: 'Mumbai Studio A', candidates: 8,  status: 'Upcoming'  },
  { title: 'Female Lead Screen Test – Beyond Limits',    date: '30 Jun 2026', location: 'Mumbai Studio B', candidates: 5,  status: 'Upcoming'  },
  { title: 'Supporting Cast – Rang De Sapne',            date: '15 Jun 2026', location: 'Delhi Office',    candidates: 12, status: 'Completed' },
  { title: 'Child Artist Audition – Short Film',         date: '10 Jun 2026', location: 'Mumbai Studio A', candidates: 6,  status: 'Completed' },
  { title: 'Antagonist Screen Test – Last Chapter',      date: '05 Jun 2026', location: 'Online (Zoom)',   candidates: 4,  status: 'Completed' },
  { title: 'Voice Artist Test – Animation Project',      date: '02 Jul 2026', location: 'Remote',          candidates: 10, status: 'Upcoming'  },
];

const SAVED_TALENTS = [
  { name: 'Arjun Malhotra', role: 'Actor',   location: 'Mumbai', img: 'photo-1507003211169-0a1dd7228f2d' },
  { name: 'Meera Iyer',     role: 'Actress', location: 'Delhi',  img: 'photo-1494790108377-be9c29b29330' },
  { name: 'Kabir Singh',    role: 'Actor',   location: 'Mumbai', img: 'photo-1500648767791-00dcc994a43e' },
  { name: 'Ananya Sharma',  role: 'Actress', location: 'Mumbai', img: 'photo-1529626455594-4ff0802cfb7e' },
  { name: 'Rohan Verma',    role: 'Model',   location: 'Pune',   img: 'photo-1472099645785-5658abf4ff4e' },
  { name: 'Priya Kapoor',   role: 'Singer',  location: 'Mumbai', img: 'photo-1517841905240-472988babdf9' },
  { name: 'Dev Anand',      role: 'Actor',   location: 'Mumbai', img: 'photo-1463453091185-61582044d556' },
  { name: 'Sunita Rao',     role: 'Dancer',  location: 'Chennai',img: 'photo-1524504388940-b1c1722653e1' },
];

const AGENCY_DETAILS = [
  { label: 'Verification',  value: 'Verified Agency',           gold: true  },
  { label: 'Member Since',  value: 'May 2018',                  gold: false },
  { label: 'Head Office',   value: 'Mumbai, Maharashtra, India',gold: false },
  { label: 'Response Time', value: 'Within 24 Hours',           gold: false },
  { label: 'Languages',     value: 'English, Hindi, Marathi',   gold: false },
  { label: 'Avg Rating',    value: '⭐ 4.8 (256 Reviews)',       gold: false },
  { label: 'Company Type',  value: 'Production House',          gold: false },
  { label: 'Industry',      value: 'Entertainment / Media',     gold: false },
  { label: 'Team Size',     value: '51 – 200 Employees',        gold: false },
  { label: 'Projects Done', value: '75+ Projects',              gold: false },
  { label: 'Talents Hired', value: '2,800+',                    gold: false },
  { label: 'Website',       value: 'www.silverparadise.com',    gold: true  },
];

/* ─── Star Rating ─────────────────────────────────────────────── */
function Stars({ rating }: { rating: number }) {
  return (
    <span style={{ color: GOLD, fontSize: 14 }}>
      {'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))}
      <span style={{ color: '#9CA3AF', marginLeft: 4, fontFamily: BARLOW, fontSize: 14 }}>{rating.toFixed(1)}</span>
    </span>
  );
}

/* ─── Tab Content Components ──────────────────────────────────────────────── */

// ── Overview (unchanged, keeps its own expanded state) ───────────────────────
function OverviewTab({ router, setActiveTab }: {
  router: ReturnType<typeof useRouter>;
  setActiveTab: (t: string) => void;
}) {
  return (
    <>
      {/* Row 1: About + Agency Details */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16, marginBottom: 16 }}>
        <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: 20 }}>
          <div style={{ fontFamily: BEBAS, fontSize: 17, color: '#F5F5F5', letterSpacing: 1, marginBottom: 12 }}>About Silver Paradise Productions</div>
          <p style={{ fontFamily: BARLOW, fontSize: 15, color: '#A8B0BD', lineHeight: 1.7, marginBottom: 16 }}>
            Silver Paradise Productions is a full-service production house specializing in films, television, web series, ad films and digital content. With over 18 years of rich experience, we bring stories to life with creativity, innovation and uncompromising quality.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
            {[
              { icon: <Building2 size={14} color={GOLD} />, label: 'Industry',     value: 'Entertainment / Media' },
              { icon: <Users size={14} color={GOLD} />,     label: 'Company Size', value: '51 – 200 Employees' },
              { icon: <Building2 size={14} color={GOLD} />, label: 'Company Type', value: 'Production House' },
              { icon: <Globe size={14} color={GOLD} />,     label: 'Website',      value: 'www.silverparadise.com', gold: true },
              { icon: <Calendar size={14} color={GOLD} />,  label: 'Founded',      value: 'May 2018' },
              { icon: <Mail size={14} color={GOLD} />,      label: 'Email',        value: 'info@silverparadise.com', gold: true },
            ].map(({ icon, label, value, gold }) => (
              <div key={label} style={{ display: 'flex', gap: 10 }}>
                <div style={{ marginTop: 2, flexShrink: 0 }}>{icon}</div>
                <div>
                  <div style={{ fontFamily: BARLOW, fontSize: 14, color: '#6B7280', marginBottom: 1 }}>{label}</div>
                  <div style={{ fontFamily: BARLOW, fontSize: 14, color: gold ? GOLD : '#F5F5F5', fontWeight: 600 }}>{value}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {[{ icon: '📸', label: 'Instagram' }, { icon: '👤', label: 'Facebook' }, { icon: '▶️', label: 'YouTube' }, { icon: '💼', label: 'LinkedIn' }].map(s => (
              <div key={s.label} title={s.label} style={{ width: 34, height: 34, borderRadius: '50%', background: BG3, border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, cursor: 'pointer' }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = GOLD}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.1)'}
              >{s.icon}</div>
            ))}
          </div>
        </div>
        <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: 16 }}>
          <div style={{ fontFamily: BEBAS, fontSize: 17, color: '#F5F5F5', letterSpacing: 1, marginBottom: 12 }}>Agency Details</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 16px' }}>
            {AGENCY_DETAILS.map(d => (
              <div key={d.label} style={{ marginBottom: 6 }}>
                <div style={{ fontFamily: BARLOW, fontSize: 14, color: '#6B7280', marginBottom: 1 }}>{d.label}</div>
                <div style={{ fontFamily: BARLOW, fontSize: 14, color: d.gold ? GOLD : '#F5F5F5', fontWeight: d.gold ? 700 : 500 }}>{d.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Quick-access cards linking to built pages */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
        {/* Casting Calls card */}
        <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontFamily: BEBAS, fontSize: 16, color: '#F5F5F5', letterSpacing: 1 }}>Active Casting Calls</div>
            <button onClick={() => setActiveTab('Casting Calls')} style={{ background: 'none', border: 'none', color: GOLD, fontFamily: BARLOW, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>View All</button>
          </div>
          {CASTING_CALLS.slice(0, 3).map((c, i) => (
            <div key={c.title} onClick={() => router.push('/agency/casting-calls')} style={{ paddingBottom: 10, marginBottom: 10, borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none', cursor: 'pointer' }}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.opacity = '0.7'}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.opacity = '1'}
            >
              <div style={{ fontFamily: BARLOW, fontSize: 14, fontWeight: 600, color: '#F5F5F5', marginBottom: 3 }}>{c.title}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: BARLOW, fontSize: 14, color: '#6B7280' }}>{c.type} · {c.apps} apps</span>
                <span style={{ padding: '2px 8px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 10, fontFamily: BARLOW, fontSize: 14, color: '#22c55e' }}>Open</span>
              </div>
            </div>
          ))}
          <button onClick={() => router.push('/agency/casting-calls')} style={{ width: '100%', padding: '8px', background: 'transparent', border: '1px solid rgba(212,166,74,0.3)', borderRadius: 7, color: GOLD, fontFamily: BARLOW, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            Go to Casting Calls →
          </button>
        </div>

        {/* Applications card */}
        <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontFamily: BEBAS, fontSize: 16, color: '#F5F5F5', letterSpacing: 1 }}>Recent Applications</div>
            <button onClick={() => setActiveTab('Applications')} style={{ background: 'none', border: 'none', color: GOLD, fontFamily: BARLOW, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>View All</button>
          </div>
          {APPLICATIONS.slice(0, 3).map((a, i) => (
            <div key={a.name} onClick={() => router.push('/agency/applications')} style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 10, marginBottom: 10, borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none', cursor: 'pointer' }}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.opacity = '0.7'}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.opacity = '1'}
            >
              <div style={{ width: 34, height: 34, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, background: BG3 }}>
                <img src={`https://images.unsplash.com/${a.img}?w=80&q=80`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: BARLOW, fontSize: 14, fontWeight: 600, color: '#F5F5F5', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.name}</div>
                <div style={{ fontFamily: BARLOW, fontSize: 14, color: '#6B7280' }}>{a.role}</div>
              </div>
              <span style={{ padding: '2px 8px', borderRadius: 10, fontFamily: BARLOW, fontSize: 14, fontWeight: 600, background: a.status === 'Shortlisted' ? 'rgba(212,166,74,0.15)' : a.status === 'Under Review' ? 'rgba(59,130,246,0.15)' : 'rgba(139,92,246,0.15)', color: a.status === 'Shortlisted' ? GOLD : a.status === 'Under Review' ? '#3B82F6' : '#8B5CF6', whiteSpace: 'nowrap' }}>{a.status}</span>
            </div>
          ))}
          <button onClick={() => router.push('/agency/applications')} style={{ width: '100%', padding: '8px', background: 'transparent', border: '1px solid rgba(212,166,74,0.3)', borderRadius: 7, color: GOLD, fontFamily: BARLOW, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            Go to Applications →
          </button>
        </div>

        {/* Auditions card */}
        <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontFamily: BEBAS, fontSize: 16, color: '#F5F5F5', letterSpacing: 1 }}>Upcoming Auditions</div>
            <button onClick={() => setActiveTab('Auditions')} style={{ background: 'none', border: 'none', color: GOLD, fontFamily: BARLOW, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>View All</button>
          </div>
          {AUDITIONS.slice(0, 3).map((a, i) => (
            <div key={a.title} onClick={() => router.push('/agency/auditions')} style={{ paddingBottom: 10, marginBottom: 10, borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none', cursor: 'pointer' }}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.opacity = '0.7'}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.opacity = '1'}
            >
              <div style={{ fontFamily: BARLOW, fontSize: 14, fontWeight: 600, color: '#F5F5F5', marginBottom: 3 }}>{a.title}</div>
              <div style={{ fontFamily: BARLOW, fontSize: 14, color: '#6B7280', marginBottom: 4 }}>{a.date} · {a.location}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: BARLOW, fontSize: 14, color: '#6B7280' }}>{a.candidates} candidates</span>
                <span style={{ padding: '2px 8px', background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.25)', borderRadius: 10, fontFamily: BARLOW, fontSize: 14, color: '#F97316' }}>Upcoming</span>
              </div>
            </div>
          ))}
          <button onClick={() => router.push('/agency/auditions')} style={{ width: '100%', padding: '8px', background: 'transparent', border: '1px solid rgba(212,166,74,0.3)', borderRadius: 7, color: GOLD, fontFamily: BARLOW, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            Go to Auditions →
          </button>
        </div>

        {/* Saved Talents card */}
        <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontFamily: BEBAS, fontSize: 16, color: '#F5F5F5', letterSpacing: 1 }}>Saved Talents</div>
            <button onClick={() => setActiveTab('Saved Talents')} style={{ background: 'none', border: 'none', color: GOLD, fontFamily: BARLOW, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>View All</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 12 }}>
            {SAVED_TALENTS.slice(0, 4).map(t => (
              <div key={t.name} onClick={() => router.push('/agency/saved-talents')} style={{ textAlign: 'center', cursor: 'pointer' }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.opacity = '0.7'}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.opacity = '1'}
              >
                <div style={{ width: '100%', aspectRatio: '1', borderRadius: 8, overflow: 'hidden', marginBottom: 4, background: BG3 }}>
                  <img src={`https://images.unsplash.com/${t.img}?w=100&q=80`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                </div>
                <div style={{ fontFamily: BARLOW, fontSize: 14, fontWeight: 600, color: '#F5F5F5', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.name}</div>
              </div>
            ))}
          </div>
          <button onClick={() => router.push('/agency/saved-talents')} style={{ width: '100%', padding: '8px', background: 'transparent', border: '1px solid rgba(212,166,74,0.3)', borderRadius: 7, color: GOLD, fontFamily: BARLOW, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            Go to Saved Talents →
          </button>
        </div>

        {/* Team card */}
        <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontFamily: BEBAS, fontSize: 16, color: '#F5F5F5', letterSpacing: 1 }}>Team Members</div>
            <button onClick={() => setActiveTab('Team')} style={{ background: 'none', border: 'none', color: GOLD, fontFamily: BARLOW, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>View All</button>
          </div>
          {TEAM_MEMBERS.slice(0, 3).map((t, i) => (
            <div key={t.name} style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 10, marginBottom: 10, borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, background: BG3 }}>
                <img src={`https://images.unsplash.com/${t.img}?w=80&q=80`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
              </div>
              <div>
                <div style={{ fontFamily: BARLOW, fontSize: 14, fontWeight: 600, color: '#F5F5F5' }}>{t.name}</div>
                <div style={{ fontFamily: BARLOW, fontSize: 14, color: GOLD }}>{t.role}</div>
              </div>
            </div>
          ))}
          <button onClick={() => setActiveTab('Team')} style={{ width: '100%', padding: '8px', background: 'transparent', border: '1px solid rgba(212,166,74,0.3)', borderRadius: 7, color: GOLD, fontFamily: BARLOW, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            View Full Team →
          </button>
        </div>

        {/* Reports quick card */}
        <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: 16 }}>
          <div style={{ fontFamily: BEBAS, fontSize: 16, color: '#F5F5F5', letterSpacing: 1, marginBottom: 12 }}>Performance Summary</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { label: 'Total Casting Calls', value: '24', change: '+14%', color: '#4A90D4' },
              { label: 'Total Applications',  value: '1,284', change: '+18%', color: GOLD },
              { label: 'Auditions Scheduled', value: '156', change: '+11%', color: '#9B6BD4' },
              { label: 'Hires Confirmed',     value: '6', change: '+20%', color: '#4AD48A' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: BARLOW, fontSize: 14, color: '#A8B0BD' }}>{s.label}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontFamily: BARLOW, fontSize: 15, fontWeight: 700, color: '#F5F5F5' }}>{s.value}</span>
                  <span style={{ fontFamily: BARLOW, fontSize: 14, color: '#4AD48A' }}>↑ {s.change}</span>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => router.push('/agency/reports')} style={{ width: '100%', marginTop: 14, padding: '8px', background: 'transparent', border: '1px solid rgba(212,166,74,0.3)', borderRadius: 7, color: GOLD, fontFamily: BARLOW, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            View Full Reports →
          </button>
        </div>
      </div>
    </>
  );
}

// ── Casting Calls Tab ─────────────────────────────────────────────────────────
function CastingCallsTab({ router }: { router: ReturnType<typeof useRouter> }) {
  const [filter, setFilter] = useState('All');
  const filtered = filter === 'All' ? CASTING_CALLS : CASTING_CALLS.filter(c => c.status === filter);
  return (
    <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <div style={{ fontFamily: BEBAS, fontSize: 17, color: '#F5F5F5', letterSpacing: 1 }}>Casting Calls ({CASTING_CALLS.length})</div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {['All', 'Open', 'Closed'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: '5px 14px', background: filter === f ? GOLD : BG3, border: `1px solid ${filter === f ? GOLD : 'rgba(255,255,255,0.1)'}`, borderRadius: 5, color: filter === f ? BG : '#A8B0BD', fontFamily: BARLOW, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>{f}</button>
          ))}
          <button onClick={() => router.push('/agency/casting-calls')} style={{ padding: '5px 14px', background: RED, border: 'none', borderRadius: 5, color: '#fff', fontFamily: BARLOW, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>+ New Casting Call</button>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map(c => (
          <div key={c.title} onClick={() => router.push('/agency/casting-calls')}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: BG3, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, cursor: 'pointer' }}
            onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(212,166,74,0.3)'}
            onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.06)'}
          >
            <div>
              <div style={{ fontFamily: BARLOW, fontSize: 15, fontWeight: 600, color: '#F5F5F5', marginBottom: 3 }}>{c.title}</div>
              <div style={{ fontFamily: BARLOW, fontSize: 14, color: '#6B7280' }}>{c.type} · {c.city} · {c.apps} applications</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ padding: '3px 10px', background: c.status === 'Open' ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.05)', border: `1px solid ${c.status === 'Open' ? 'rgba(34,197,94,0.25)' : 'rgba(255,255,255,0.1)'}`, borderRadius: 10, fontFamily: BARLOW, fontSize: 14, color: c.status === 'Open' ? '#22c55e' : '#6B7280' }}>{c.status}</span>
              <ChevronRight size={16} color="#6B7280" />
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16, textAlign: 'center' }}>
        <button onClick={() => router.push('/agency/casting-calls')} style={{ padding: '10px 28px', background: GOLD, border: 'none', borderRadius: 7, color: BG, fontFamily: BARLOW, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
          Manage All Casting Calls →
        </button>
      </div>
    </div>
  );
}

// ── Applications Tab ──────────────────────────────────────────────────────────
function ApplicationsTab({ router }: { router: ReturnType<typeof useRouter> }) {
  const [filter, setFilter] = useState('All');
  const statuses = ['All', 'Under Review', 'Shortlisted', 'Audition Scheduled', 'Rejected'];
  const filtered = filter === 'All' ? APPLICATIONS : APPLICATIONS.filter(a => a.status === filter);
  return (
    <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <div style={{ fontFamily: BEBAS, fontSize: 17, color: '#F5F5F5', letterSpacing: 1 }}>Applications ({APPLICATIONS.length})</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {statuses.map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{ padding: '4px 12px', background: filter === s ? GOLD : BG3, border: `1px solid ${filter === s ? GOLD : 'rgba(255,255,255,0.1)'}`, borderRadius: 5, color: filter === s ? BG : '#A8B0BD', fontFamily: BARLOW, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>{s}</button>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.map(a => (
          <div key={a.name} onClick={() => router.push('/agency/applications')}
            style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', background: BG3, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, cursor: 'pointer' }}
            onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(212,166,74,0.3)'}
            onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.06)'}
          >
            <div style={{ width: 42, height: 42, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, background: BG4 }}>
              <img src={`https://images.unsplash.com/${a.img}?w=80&q=80`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: BARLOW, fontSize: 15, fontWeight: 600, color: '#F5F5F5', marginBottom: 2 }}>{a.name}</div>
              <div style={{ fontFamily: BARLOW, fontSize: 14, color: '#6B7280' }}>{a.role} · {a.casting}</div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <span style={{ padding: '3px 10px', borderRadius: 10, fontFamily: BARLOW, fontSize: 14, fontWeight: 600,
                background: a.status === 'Shortlisted' ? 'rgba(212,166,74,0.15)' : a.status === 'Under Review' ? 'rgba(59,130,246,0.15)' : a.status === 'Audition Scheduled' ? 'rgba(249,115,22,0.15)' : 'rgba(200,32,42,0.15)',
                color: a.status === 'Shortlisted' ? GOLD : a.status === 'Under Review' ? '#3B82F6' : a.status === 'Audition Scheduled' ? '#F97316' : RED
              }}>{a.status}</span>
              <div style={{ fontFamily: BARLOW, fontSize: 14, color: '#6B7280', marginTop: 4 }}>{a.time}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16, textAlign: 'center' }}>
        <button onClick={() => router.push('/agency/applications')} style={{ padding: '10px 28px', background: GOLD, border: 'none', borderRadius: 7, color: BG, fontFamily: BARLOW, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
          Manage All Applications →
        </button>
      </div>
    </div>
  );
}

// ── Auditions Tab ─────────────────────────────────────────────────────────────
function AuditionsTab({ router }: { router: ReturnType<typeof useRouter> }) {
  const [filter, setFilter] = useState('All');
  const filtered = filter === 'All' ? AUDITIONS : AUDITIONS.filter(a => a.status === filter);
  return (
    <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <div style={{ fontFamily: BEBAS, fontSize: 17, color: '#F5F5F5', letterSpacing: 1 }}>Auditions ({AUDITIONS.length})</div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {['All', 'Upcoming', 'Completed', 'Cancelled'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: '5px 12px', background: filter === f ? GOLD : BG3, border: `1px solid ${filter === f ? GOLD : 'rgba(255,255,255,0.1)'}`, borderRadius: 5, color: filter === f ? BG : '#A8B0BD', fontFamily: BARLOW, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>{f}</button>
          ))}
          <button onClick={() => router.push('/agency/auditions')} style={{ padding: '5px 14px', background: RED, border: 'none', borderRadius: 5, color: '#fff', fontFamily: BARLOW, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Schedule Audition</button>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map(a => (
          <div key={a.title} onClick={() => router.push('/agency/auditions')}
            style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 16px', background: BG3, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, cursor: 'pointer' }}
            onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(212,166,74,0.3)'}
            onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.06)'}
          >
            <div style={{ width: 48, height: 48, borderRadius: 8, background: 'rgba(249,115,22,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <CalendarCheck size={20} color="#F97316" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: BARLOW, fontSize: 15, fontWeight: 600, color: '#F5F5F5', marginBottom: 3 }}>{a.title}</div>
              <div style={{ fontFamily: BARLOW, fontSize: 14, color: '#6B7280' }}>{a.date} · {a.location} · {a.candidates} candidates</div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <span style={{ padding: '3px 10px', borderRadius: 10, fontFamily: BARLOW, fontSize: 14, fontWeight: 600,
                background: a.status === 'Upcoming' ? 'rgba(249,115,22,0.12)' : a.status === 'Completed' ? 'rgba(34,197,94,0.1)' : 'rgba(200,32,42,0.1)',
                color: a.status === 'Upcoming' ? '#F97316' : a.status === 'Completed' ? '#22c55e' : RED
              }}>{a.status}</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16, textAlign: 'center' }}>
        <button onClick={() => router.push('/agency/auditions')} style={{ padding: '10px 28px', background: GOLD, border: 'none', borderRadius: 7, color: BG, fontFamily: BARLOW, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
          Manage All Auditions →
        </button>
      </div>
    </div>
  );
}

// ── Saved Talents Tab ─────────────────────────────────────────────────────────
function SavedTalentsTab({ router }: { router: ReturnType<typeof useRouter> }) {
  const [filter, setFilter] = useState('All');
  const categories = ['All', 'Actor', 'Actress', 'Model', 'Singer', 'Dancer'];
  const filtered = filter === 'All' ? SAVED_TALENTS : SAVED_TALENTS.filter(t => t.role === filter);
  return (
    <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <div style={{ fontFamily: BEBAS, fontSize: 17, color: '#F5F5F5', letterSpacing: 1 }}>Saved Talents ({SAVED_TALENTS.length})</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {categories.map(c => (
            <button key={c} onClick={() => setFilter(c)} style={{ padding: '4px 12px', background: filter === c ? GOLD : BG3, border: `1px solid ${filter === c ? GOLD : 'rgba(255,255,255,0.1)'}`, borderRadius: 5, color: filter === c ? BG : '#A8B0BD', fontFamily: BARLOW, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>{c}</button>
          ))}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
        {filtered.map(t => (
          <div key={t.name} onClick={() => router.push('/agency/saved-talents')}
            style={{ background: BG3, borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden', cursor: 'pointer' }}
            onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(212,166,74,0.3)'}
            onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.06)'}
          >
            <div style={{ width: '100%', aspectRatio: '1', overflow: 'hidden', background: BG4 }}>
              <img src={`https://images.unsplash.com/${t.img}?w=200&q=80`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
            </div>
            <div style={{ padding: '10px 12px' }}>
              <div style={{ fontFamily: BARLOW, fontSize: 14, fontWeight: 600, color: '#F5F5F5', marginBottom: 2 }}>{t.name}</div>
              <div style={{ fontFamily: BARLOW, fontSize: 14, color: GOLD, marginBottom: 4 }}>{t.role}</div>
              <div style={{ fontFamily: BARLOW, fontSize: 14, color: '#6B7280' }}>{t.location}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16, textAlign: 'center' }}>
        <button onClick={() => router.push('/agency/saved-talents')} style={{ padding: '10px 28px', background: GOLD, border: 'none', borderRadius: 7, color: BG, fontFamily: BARLOW, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
          Manage Saved Talents →
        </button>
      </div>
    </div>
  );
}

// ── Team Tab ──────────────────────────────────────────────────────────────────
function TeamTab() {
  return (
    <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: 20 }}>
      <div style={{ fontFamily: BEBAS, fontSize: 17, color: '#F5F5F5', letterSpacing: 1, marginBottom: 18 }}>Team Members ({TEAM_MEMBERS.length})</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
        {TEAM_MEMBERS.map(t => (
          <div key={t.name} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 14, background: BG3, borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
              <img src={`https://images.unsplash.com/${t.img}?w=100&q=80`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
            </div>
            <div>
              <div style={{ fontFamily: BARLOW, fontSize: 15, fontWeight: 600, color: '#F5F5F5', marginBottom: 2 }}>{t.name}</div>
              <div style={{ fontFamily: BARLOW, fontSize: 14, color: GOLD }}>{t.role}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main Page ───────────────────────────────────────────────── */

/* -- Auth helper -- */
function getAuthHeaders(): Record<string, string> {
  try {
    const u = JSON.parse(localStorage.getItem('ss_user') || '{}');
    return u.token ? { Authorization: `Bearer ${u.token}` } : {};
  } catch { return {}; }
}

export default function AgencyProfilePage() {
  const router = useRouter();
  const [agencyName,     setAgencyName]     = useState('My Agency');
  const [agencyInitials, setAgencyInitials] = useState('AG');
  const [agencyId,       setAgencyId]       = useState('AGE.........');
  const [agencyType,     setAgencyType]     = useState('Production House');
  const [msgCount,       setMsgCount]       = useState(0);
  const [notifCount,     setNotifCount]     = useState(0);

  // Load agency identity instantly
  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('ss_user') || '{}');
      if (u.name) {
        setAgencyName(u.name);
        setAgencyInitials(u.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase());
      }
      if (u.profileNumber) setAgencyId(u.profileNumber);
    } catch {}
  }, []);

  // Fetch agency profile + badge counts
  useEffect(() => {
    const h = getAuthHeaders();
    fetch('/api/profile/agency', { headers: h })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        const p = data.data?.profile ?? data.profile ?? data;
        if (p.companyName || p.name) {
          const name = p.companyName ?? p.name;
          setAgencyName(name);
          setAgencyInitials(name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase());
        }
        if (p.profileNumber) setAgencyId(p.profileNumber);
        if (p.companyType)   setAgencyType(p.companyType);
      }).catch(() => {});
    fetch('/api/notifications', { headers: h })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        const list = data.data?.notifications ?? data.notifications ?? data;
        if (Array.isArray(list)) setNotifCount(list.filter((n) => !n.read && !n.isRead).length);
      }).catch(() => {});
    fetch('/api/messages/conversations', { headers: h })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        const list = data.data?.conversations ?? data.conversations ?? data;
        if (Array.isArray(list)) setMsgCount(list.filter((c) => c.unreadCount > 0).length);
      }).catch(() => {});
  }, []);

  const [sidebarOpen,  setSidebarOpen]  = useState(false);
  const [profileOpen,  setProfileOpen]  = useState(false);
  const [activeTab,    setActiveTab]    = useState('Overview');
  const [expanded,     setExpanded]     = useState(false);

  const SB_W = sidebarOpen ? 230 : 52;

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
          <div style={{ position: 'absolute', top: -5, right: -5, background: RED, borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#fff', pointerEvents: 'none' }}>{msgCount > 0 ? msgCount : null}</div>
        </div>
        <div onClick={() => router.push('/agency/notifications')} style={{ position: 'relative', cursor: 'pointer' }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bell size={15} color="rgba(255,255,255,0.7)" />
          </div>
          <div style={{ position: 'absolute', top: -5, right: -5, background: RED, borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#fff', pointerEvents: 'none' }}>{notifCount > 0 ? notifCount : null}</div>
        </div>
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer' }} onClick={() => setProfileOpen(v => !v)}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#1a1410,#2a1e0e)', border: `2px solid ${GOLD}60`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: GOLD, fontFamily: BEBAS }}>{agencyInitials}</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.2 }}>{agencyName}</div>
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
                  <span style={{ fontSize: 14, fontWeight: 700, color: GOLD }}>{agencyId}</span>
                </div>
                {PROFILE_MENU.map(({ label, href }) => (
                  <div key={label} onClick={() => { router.push(href); setProfileOpen(false); }}
                    style={{ padding: '10px 16px', fontSize: 15, cursor: 'pointer', color: label === 'Logout' ? '#ff6b6b' : label === 'Company Profile' ? GOLD : '#F5F5F5', fontWeight: label === 'Company Profile' ? 700 : 400, background: label === 'Company Profile' ? 'rgba(212,166,74,0.08)' : 'transparent', borderTop: label === 'Logout' ? '1px solid rgba(255,255,255,0.07)' : 'none' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                    onMouseLeave={e => (e.currentTarget.style.background = label === 'Company Profile' ? 'rgba(212,166,74,0.08)' : 'transparent')}
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
              <div style={{ width: 38, height: 38, borderRadius: 9, background: 'linear-gradient(135deg,#1a1410,#2a1e0e)', border: `1px solid ${GOLD}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: GOLD, fontFamily: BEBAS, flexShrink: 0 }}>{agencyInitials}</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#F5F5F5', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{agencyName}</div>
                <div onClick={() => router.push('/agency-profile')} style={{ fontSize: 14, color: RED, fontWeight: 600, cursor: 'pointer' }}>View Company Profile</div>
              </div>
            </div>
          )}
          <nav style={{ flex: 1, padding: sidebarOpen ? '8px 6px' : '8px 4px', overflowY: 'auto', scrollbarWidth: 'none' }}>
            {NAV_ITEMS.map(({ icon: Icon, label, badge, href }) => {
              const active = href === '/agency-profile';
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
                  {sidebarOpen && badge && <div style={{ background: RED, color: '#fff', borderRadius: 10, fontSize: 14, fontWeight: 700, padding: '1px 6px', minWidth: 18, textAlign: 'center' }}>{badge}</div>}
                  {!sidebarOpen && badge && <div style={{ position: 'absolute', top: 6, right: 4, background: RED, borderRadius: '50%', width: 14, height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#fff' }}>{badge}</div>}
                </div>
              );
            })}
          </nav>
          {sidebarOpen && (
            <div style={{ margin: '8px 10px 14px', borderRadius: 12, background: 'linear-gradient(135deg,#1a1205,#2a1e0a)', border: '1px solid rgba(212,166,74,0.25)', padding: '14px 12px', textAlign: 'center', flexShrink: 0 }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>👑</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: GOLD, marginBottom: 3 }}>Upgrade to Pro</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 10, lineHeight: 1.5 }}>Unlock advanced filters and AI matching.</div>
              <button onClick={() => router.push('/pricing')} style={{ width: '100%', background: GOLD, color: '#000', border: 'none', borderRadius: 8, padding: '7px 0', fontSize: 14, fontWeight: 700, fontFamily: BARLOW, cursor: 'pointer' }}>Upgrade Now</button>
            </div>
          )}
        </aside>

        {/* ── SCROLLABLE CONTENT ── */}
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '20px 20px 32px', display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Breadcrumb + Edit Profile */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#6B7280' }}>
              <span onClick={() => router.push('/agency/dashboard')} style={{ color: '#6B7280', cursor: 'pointer', fontFamily: BARLOW }}
                onMouseEnter={e => (e.currentTarget.style.color = '#F5F5F5')}
                onMouseLeave={e => (e.currentTarget.style.color = '#6B7280')}
              >Dashboard</span>
              <ChevronRight size={14} color="#6B7280" />
              <span style={{ color: '#F5F5F5', fontFamily: BARLOW }}>Agency Profile</span>
            </div>
            <button onClick={() => {
                try {
                  const existing = JSON.parse(localStorage.getItem('ss_agency_profile_draft') || '{}')
                  localStorage.setItem('ss_agency_profile_draft', JSON.stringify({ ...existing, editMode: true }))
                } catch {}
                router.push('/create-company-profile')
              }} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px', background: GOLD, border: 'none', borderRadius: 7, color: '#050505', fontFamily: BARLOW, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
              <Edit size={14} /> Edit Profile
            </button>
          </div>

          {/* Hero Banner */}
          <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ position: 'relative', height: 180 }}>
              <img src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1400&q=80" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5, pointerEvents: 'none' }} alt="" />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(5,5,5,0.95) 35%, rgba(5,5,5,0.3))', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', bottom: 16, left: 20, display: 'flex', gap: 20, alignItems: 'center' }}>
                <div style={{ width: 80, height: 80, borderRadius: 10, background: BG3, border: '2px solid rgba(212,166,74,0.3)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontFamily: BEBAS, fontSize: 22, color: GOLD }}>SP</span>
                  <span style={{ fontFamily: BARLOW, fontSize: 14, color: '#6B7280' }}>PRODUCTIONS</span>
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <h1 style={{ fontFamily: BEBAS, fontSize: 26, color: '#F5F5F5', margin: 0, letterSpacing: 1 }}>Silver Paradise Productions</h1>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(212,166,74,0.15)', border: '1px solid rgba(212,166,74,0.3)', borderRadius: 20, padding: '2px 10px' }}>
                      <CheckCircle2 size={11} color={GOLD} />
                      <span style={{ fontFamily: BARLOW, fontSize: 14, fontWeight: 700, color: GOLD }}>Verified Agency</span>
                    </div>
                  </div>
                  <div style={{ fontFamily: BARLOW, fontSize: 14, color: '#A8B0BD', marginBottom: 6 }}>Production House</div>
                  <div style={{ display: 'flex', gap: 14, fontFamily: BARLOW, fontSize: 14, color: '#6B7280', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={12} color="#6B7280" /> Mumbai, Maharashtra, India</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={12} color="#6B7280" /> Est. May 2018</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: GOLD, cursor: 'pointer' }}><Globe size={12} color={GOLD} /> www.silverparadise.com</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <p style={{ fontFamily: BARLOW, fontSize: 14, color: '#A8B0BD', lineHeight: 1.7, margin: 0, maxWidth: 600 }}>
                {expanded
                  ? 'Silver Paradise Productions is a full-service production house specializing in films, television, web series, ad films and digital content. With over 18 years of rich experience, we bring stories to life with creativity, innovation and uncompromising quality.'
                  : 'Creating meaningful stories that entertain, inspire and leave a lasting impact. We specialize in films, television, web series, ad films and digital content.'}
              </p>
              <button onClick={() => setExpanded(!expanded)} style={{ background: 'none', border: 'none', color: GOLD, fontFamily: BARLOW, fontSize: 14, fontWeight: 600, cursor: 'pointer', padding: '4px 0', marginTop: 4 }}>
                {expanded ? 'See Less ▲' : 'See More ▾'}
              </button>
            </div>

            {/* Stats bar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', padding: '14px 20px' }}>
              {[['🎬','125+','Casting Calls'],['👥','2.8K+','Talents Hired'],['🏆','18+','Years Experience'],['📽️','75+','Projects'],['⭐','4.8','Rating']].map(([icon,val,lbl],i) => (
                <div key={String(lbl)} style={{ textAlign: 'center', borderRight: i < 4 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                  <div style={{ fontSize: 16, marginBottom: 3 }}>{icon}</div>
                  <div style={{ fontFamily: BEBAS, fontSize: 22, color: '#F5F5F5', letterSpacing: 1 }}>{val}</div>
                  <div style={{ fontFamily: BARLOW, fontSize: 14, color: '#6B7280' }}>{lbl}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            {TABS.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                style={{ padding: '10px 18px', background: 'none', border: 'none', borderBottom: `2px solid ${activeTab === tab ? GOLD : 'transparent'}`, marginBottom: -1, cursor: 'pointer', fontFamily: BARLOW, fontSize: 15, fontWeight: activeTab === tab ? 700 : 400, color: activeTab === tab ? GOLD : '#6B7280', whiteSpace: 'nowrap', transition: 'color 0.15s' }}>
                {tab}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {activeTab === 'Overview'      && <OverviewTab router={router} setActiveTab={setActiveTab} />}
          {activeTab === 'Casting Calls' && <CastingCallsTab router={router} />}
          {activeTab === 'Applications'  && <ApplicationsTab router={router} />}
          {activeTab === 'Auditions'     && <AuditionsTab router={router} />}
          {activeTab === 'Saved Talents' && <SavedTalentsTab router={router} />}
          {activeTab === 'Team'          && <TeamTab />}

        </div>
      </div>
    </div>
  );
}