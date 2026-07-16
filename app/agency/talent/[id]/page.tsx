'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import SilverScreensLogo from '@/components/ui/SilverScreensLogo';
import {
  LayoutDashboard, Megaphone, PlusCircle, ClipboardList,
  UserSearch, Star, CalendarCheck, MessageSquare, Bell,
  Bookmark, ChevronDown, ChevronLeft, MapPin, Menu,
  Eye, Phone, Mail, Send, Award, Film, Mic,
  Globe, Check, Play, MoreHorizontal,
  Clock, Camera, Edit2, ChevronRight, Circle,
  BookOpen, GraduationCap, Briefcase,
} from 'lucide-react';

/* ─── Design tokens ───────────────────────────────────────────── */
const RED    = '#C8202A';
const GOLD   = '#D4A64A';
const GREEN  = '#22C55E';
const BG     = '#050505';
const BG2    = '#0B0F14';
const BG3    = '#121821';
const BG4    = '#1C2030';
const BEBAS  = "'Bebas Neue', sans-serif";
const BARLOW = "'Barlow Condensed', sans-serif";

const AVAIL_COLOR: Record<string, string> = {
  'Available Now': GREEN, 'Available Soon': GOLD, 'Not Available': RED,
};

/* ─── Sidebar nav ─────────────────────────────────────────────── */
const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard',               href: '/agency/dashboard' },
  { icon: PlusCircle,      label: 'Create Casting Call',     href: '/agency/create-casting' },
  { icon: Megaphone,       label: 'Casting Calls List',      href: '/agency/casting-calls' },
  { icon: UserSearch,      label: 'Talent Search',           href: '/agency/talent-search', active: true },
  { icon: ClipboardList,   label: 'Applications Management', href: '/agency/applications' },
  { icon: Star,            label: 'Shortlisted Talents',     href: '/agency/shortlisted' },
  { icon: CalendarCheck,   label: 'Audition Management',     href: '/agency/auditions' },
  { icon: Bookmark,        label: 'Saved Talents',           href: '/agency/saved-talents' },
  { icon: MessageSquare,   label: 'Messages',  badge: 12,    href: '/agency/messages' },
  { icon: Bell,            label: 'Notifications', badge: 3, href: '/agency/notifications' },
];

/* ─── Full mock profile data ──────────────────────────────────── */
interface Credit  { type: string; year: string; role: string; title: string }
interface Education { type: string; year: string; institution: string; detail: string }
interface ActivityItem { color: string; text: string; time: string; badge?: string; badgeColor?: string }
interface MediaItem { title: string; duration: string; hasPlay: boolean; url?: string; mediaType?: string }

interface AspProfile {
  id: string; name: string; verified: boolean;
  category: string; gender: string; age: number;
  location: string; rating: number; reviews: number; views: string;
  availability: 'Available Now' | 'Available Soon' | 'Not Available';
  photo: string; photoUrl: string; gradient: string;
  lastActive: string; createdOn: string; profileId: string;
  profileStrength: number;
  strengthItems: { label: string; done: boolean }[];
  about: string;
  languages: string; height: string; build: string; eyeColor: string;
  hairColor: string; complexion: string; voiceType: string;
  chest: string; waist: string; shoeSize: string;
  // Additional fields from aspirant profile
  weight_kg: string; hip: string;
  availability_for: string[];
  roleTitle: string; experienceLevel: string;
  pincode: string; country: string; address: string;
  skills: string[];
  credits: Credit[];
  education: Education[];
  media: MediaItem[];
  stats: { label: string; value: string }[];
  activity: ActivityItem[];
  auditionsAttended: number; shortlisted: number;
  projectsWorked: number; profileViews: string; responseRate: string;
}

const PROFILES: Record<string, AspProfile> = {
  a1: {
    id: 'a1', name: 'Arjun Malhotra', verified: true,
    category: 'Actor', gender: 'Male', age: 26,
    location: 'Mumbai, Maharashtra, India',
    rating: 4.8, reviews: 32, views: '3.2K',
    availability: 'Available Now',
    photo: 'AM', photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=533&fit=crop&crop=face', gradient: 'linear-gradient(135deg,#667eea,#764ba2)',
    lastActive: '2 hours ago', createdOn: '12 Feb 2024', profileId: 'ASP062600001',
    profileStrength: 85,
    strengthItems: [
      { label: 'Profile Photo', done: true },
      { label: 'About',         done: true },
      { label: 'Experience',    done: true },
      { label: 'Skills',        done: true },
      { label: 'Media',         done: true },
      { label: 'References',    done: false },
    ],
    about: 'Passionate actor with 2+ years of experience in theatre, films and web series. Trained in method acting and dialogue delivery. Known for strong screen presence, emotional depth and versatility in diverse roles.',
    languages: 'Hindi, English, Punjabi',
    height: "5'10\"", build: 'Athletic', eyeColor: 'Brown',
    hairColor: 'Black', complexion: 'Wheatish', voiceType: 'Baritone',
    chest: '40 inch', waist: '32 inch', shoeSize: '9 (UK)',
    weight_kg: '75 kg', hip: '', availability_for: ['Feature Films', 'Web Series', 'TV Serials'], roleTitle: 'Hero', experienceLevel: '2 - 5 Years', pincode: '', country: 'India', address: '',
    skills: ['Acting', 'Dialogue Delivery', 'Dancing', 'Action', 'Singing', 'Modelling', 'Fighting', 'Improvisation', 'Voice Modulation'],
    credits: [
      { type: 'Web Series', year: '2023', role: 'Lead Actor',       title: 'City of Crime – Season 1' },
      { type: 'Short Film', year: '2022', role: 'Supporting Actor', title: 'The Last Goodbye' },
      { type: 'Theatre',    year: '2021', role: 'Lead Actor',       title: 'Hamlet (Theatre Play)' },
    ],
    education: [
      { type: 'Acting Workshop', year: '2022', institution: "Anupam Kher's Actor Prepares", detail: '' },
      { type: 'Theatre Training', year: '2021', institution: 'NSD Summer Theatre Workshop', detail: '' },
      { type: 'Graduation',       year: '2020', institution: 'B.A. in Mass Communication', detail: 'Mumbai University' },
    ],
    media: [
      { title: 'Showreel',          duration: '01:32', hasPlay: true  },
      { title: 'Scene – Emotional', duration: '01:15', hasPlay: true  },
      { title: 'Scene – Action',    duration: '01:08', hasPlay: false },
      { title: 'Dialogue Delivery', duration: '00:58', hasPlay: false },
      { title: 'Dance Reel',        duration: '01:27', hasPlay: true  },
    ],
    stats: [],
    auditionsAttended: 18, shortlisted: 7, projectsWorked: 3,
    profileViews: '3.2K', responseRate: '92%',
    activity: [
      { color: GREEN, text: 'Applied for "City of Dreams – Season 2" as Lead Hero',  time: '20 May 2024, 11:30 AM', badge: 'New',       badgeColor: GREEN },
      { color: GOLD,  text: 'Profile viewed by you',                                  time: '20 May 2024, 11:15 AM' },
      { color: '#3b82f6', text: 'Shortlisted for "Broken Silence" as Male Lead',      time: '18 May 2024, 04:20 PM', badge: 'In Review', badgeColor: GOLD },
      { color: RED,   text: 'Application rejected for "Shadow Unit – TV Series"',     time: '15 May 2024, 02:10 PM', badge: 'Rejected',  badgeColor: RED },
    ],
  },
  a2: {
    id: 'a2', name: 'Meera Iyer', verified: true,
    category: 'Actor', gender: 'Female', age: 24,
    location: 'Mumbai, Maharashtra, India',
    rating: 4.9, reviews: 48, views: '5.1K',
    availability: 'Available Now',
    photo: 'MI', photoUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=533&fit=crop&crop=face', gradient: 'linear-gradient(135deg,#f093fb,#f5576c)',
    lastActive: '30 minutes ago', createdOn: '08 Jan 2024', profileId: 'ASP129385',
    profileStrength: 92,
    strengthItems: [
      { label: 'Profile Photo', done: true },
      { label: 'About',         done: true },
      { label: 'Experience',    done: true },
      { label: 'Skills',        done: true },
      { label: 'Media',         done: true },
      { label: 'References',    done: true },
    ],
    about: 'Versatile actress with 3 years of experience in Tamil and Hindi cinema. Classical Bharatnatyam dancer with strong screen presence. Trained at Adyar Film Institute.',
    languages: 'Hindi, English, Tamil',
    height: "5'5\"", build: 'Slim', eyeColor: 'Brown',
    hairColor: 'Black', complexion: 'Fair', voiceType: 'Soprano',
    chest: '34 inch', waist: '26 inch', shoeSize: '6 (UK)',
    weight_kg: '55 kg', hip: '36 inch', availability_for: ['Feature Films', 'Short Films', 'Modelling'], roleTitle: 'Heroine', experienceLevel: '2 - 5 Years', pincode: '', country: 'India', address: '',
    skills: ['Acting', 'Classical Dance', 'Modelling', 'Yoga', 'Dialogue Delivery'],
    credits: [
      { type: 'Feature Film', year: '2024', role: 'Lead Actress',    title: 'Kaaviyam' },
      { type: 'Web Series',   year: '2023', role: 'Lead Actress',    title: 'City of Stars' },
      { type: 'Short Film',   year: '2022', role: 'Supporting Role', title: 'Uyir' },
    ],
    education: [
      { type: 'Film Institute', year: '2022', institution: 'Adyar Film Institute', detail: 'Acting & Direction' },
      { type: 'Dance Training', year: '2018', institution: 'Kalakshetra Foundation', detail: 'Bharatnatyam' },
    ],
    media: [
      { title: 'Acting Reel',    duration: '02:10', hasPlay: true  },
      { title: 'Dance Reel',     duration: '01:45', hasPlay: true  },
      { title: 'Scene – Drama',  duration: '01:22', hasPlay: false },
      { title: 'Kaaviyam Clip',  duration: '00:48', hasPlay: false },
      { title: 'Modelling Reel', duration: '01:05', hasPlay: true  },
    ],
    stats: [],
    auditionsAttended: 24, shortlisted: 11, projectsWorked: 6,
    profileViews: '5.1K', responseRate: '96%',
    activity: [
      { color: GREEN, text: 'Applied for "Kaaval" as Female Lead',          time: '21 Jun 2026, 09:00 AM', badge: 'New',   badgeColor: GREEN },
      { color: GOLD,  text: 'Profile viewed by you',                         time: '21 Jun 2026, 08:45 AM' },
      { color: '#3b82f6', text: 'Shortlisted for "Nila" as Supporting Lead', time: '19 Jun 2026, 02:00 PM', badge: 'In Review', badgeColor: GOLD },
    ],
  },
};

function buildFallback(id: string): AspProfile {
  const names: Record<string, [string, string]> = {
    a3:  ['Rohan Verma',   'RV'], a4: ['Ananya Sharma', 'AS'],
    a5:  ['Kabir Singh',   'KS'], a6: ['Priya Nair',    'PN'],
    a7:  ['Vikram Reddy',  'VR'], a8: ['Sunita Menon',  'SM'],
    a9:  ['Aditya Kumar',  'AK'], a10:['Deepika Rao',   'DR'],
  };
  const gradients = [
    'linear-gradient(135deg,#4facfe,#00f2fe)', 'linear-gradient(135deg,#43e97b,#38f9d7)',
    'linear-gradient(135deg,#fa709a,#fee140)', 'linear-gradient(135deg,#a18cd1,#fbc2eb)',
    'linear-gradient(135deg,#fccb90,#d57eeb)', 'linear-gradient(135deg,#a1c4fd,#c2e9fb)',
    'linear-gradient(135deg,#fd7043,#ff8a65)', 'linear-gradient(135deg,#26c6da,#00acc1)',
  ];
  // Use last 4 hex chars of UUID as a small stable index (0-255 range)
  const rawNum = parseInt(id.replace(/-/g, '').slice(-4), 16);
  const idx = isNaN(rawNum) ? 0 : rawNum % 20;
  const [name, photo] = names[id] || ['Aspirant Profile', 'AP'];
  return {
    id, name, verified: idx % 3 !== 0, category: 'Actor',
    gender: idx % 2 === 0 ? 'Male' : 'Female', age: 22 + idx,
    location: 'India', rating: +(4.3 + (idx % 5) * 0.1).toFixed(1),
    reviews: 10 + idx * 3, views: `${(idx + 1) * 800}`,
    availability: 'Available Now', photo, photoUrl: FALLBACK_PHOTOS[(idx - 1) % FALLBACK_PHOTOS.length] || FALLBACK_PHOTOS[0], gradient: gradients[(idx - 1) % gradients.length] || gradients[0],
    lastActive: '1 day ago', createdOn: '01 Jan 2024',
    profileId: `ASP${129386 + idx}`,
    profileStrength: 70 + idx * 3,
    strengthItems: [
      { label: 'Profile Photo', done: true  },
      { label: 'About',         done: true  },
      { label: 'Experience',    done: true  },
      { label: 'Skills',        done: idx > 1 },
      { label: 'Media',         done: idx > 2 },
      { label: 'References',    done: false },
    ],
    about: `${name} is a professional ${idx % 2 === 0 ? 'actor' : 'actress'} with ${idx + 1} years of experience. Known for dedication and versatility across film and digital formats.`,
    languages: 'Hindi, English', height: "5'8\"", build: 'Average',
    eyeColor: 'Brown', hairColor: 'Black', complexion: 'Wheatish',
    voiceType: 'Baritone', chest: '38 inch', waist: '30 inch', shoeSize: '8 (UK)',
    weight_kg: '', hip: '', availability_for: [], roleTitle: '', experienceLevel: '', pincode: '', country: 'India', address: '',
    skills: [],
    credits: [],
    education: [],
    media: [],
    stats: [],
    auditionsAttended: 0, shortlisted: 0,
    projectsWorked: 0, profileViews: '0', responseRate: '0%',
    activity: [],
  };
}


/* ─── Stock image URLs (Unsplash) ──────────────────────────── */
const FALLBACK_PHOTOS = [
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=533&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=533&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=533&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=533&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=533&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=533&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=533&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400&h=533&fit=crop&crop=face',
];

const MEDIA_IMAGES = [
  'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=320&h=180&fit=crop',
  'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=320&h=180&fit=crop',
  'https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?w=320&h=180&fit=crop',
  'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=320&h=180&fit=crop',
  'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=320&h=180&fit=crop',
  'https://images.unsplash.com/photo-1507924538820-ede94a04019d?w=320&h=180&fit=crop',
];

/* ═══════════════════════════════════════════════════════════════ */
export default function AspirantProfilePage() {
  const router = useRouter();
  const params = useParams();
  const rawId  = params?.id;
  const id     = typeof rawId === 'string' ? rawId : Array.isArray(rawId) ? rawId[0] : '';

  const p0 = PROFILES[id] ?? buildFallback(id);
  const [p, setP] = useState<AspProfile>(p0);

  const [sidebarOpen,  setSidebarOpen]  = useState(false);
  const [profileOpen,  setProfileOpen]  = useState(false);
  const [agencyName,    setAgencyName]    = useState('Agency');
  const [agencyInitials,setAgencyInitials]= useState('AG');

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('ss_user') || '{}');
      if (u.name)  { setAgencyName(u.name); setAgencyInitials(u.name.split(' ').map((w: string) => w[0]).join('').slice(0,2).toUpperCase()); }
    } catch {}
  }, []);
  const [activeTab,    setActiveTab]    = useState<'overview' | 'media' | 'auditions' | 'documents' | 'activity'>('overview');
  const [shortlisted,  setShortlisted]  = useState(false);
  const [msgSent,      setMsgSent]      = useState(false);
  const [moreOpen,     setMoreOpen]     = useState(false);
  const [agencyActivity, setAgencyActivity] = useState<ActivityItem[]>([]);
  const [realStats, setRealStats] = useState({ total: 0, shortlisted: 0, inReview: 0, rejected: 0 });

  useEffect(() => {
    if (!id) return;
    const u = JSON.parse(localStorage.getItem('ss_user') || '{}');
    const token = u.token;
    if (!token) return;
    fetch(`/api/talents/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        const t = data.data?.talent ?? data.talent ?? data;
        const dob = t.date_of_birth ? new Date(t.date_of_birth) : null;
        const age = dob ? Math.floor((Date.now() - dob.getTime()) / (1000 * 60 * 60 * 24 * 365.25)) : 0;
        const initials = [t.first_name, t.last_name].filter(Boolean).map((w: string) => w[0]).join('').toUpperCase();
        const availMap: Record<string, AspProfile['availability']> = {
          'true': 'Available Now', 'false': 'Not Available',
        };
        setP(prev => ({
          ...prev,
          id:           t.id ?? prev.id,
          name:         [t.first_name, t.last_name].filter(Boolean).join(' ') || prev.name,
          verified:     t.verification_status === 'approved',
          category:     t.category     ?? prev.category,
          gender:       t.gender       ?? prev.gender,
          age:          age || prev.age,
          location:     [t.city, t.state].filter(Boolean).join(', ') || prev.location,
          photo:        initials || prev.photo,
          photoUrl:     t.profile_image_url ?? prev.photoUrl,
          profileId:    t.profile_number ?? prev.profileId,
          profileStrength: t.profile_completion ?? prev.profileStrength,
          about:        t.about_me     ?? prev.about,
          languages:    Array.isArray(t.languages) ? t.languages.join(', ') : (t.languages ?? prev.languages),
          height:       t.height_cm    ? `${t.height_cm} cm`   : prev.height,
          build:        t.body_type    ?? prev.build,
          eyeColor:     t.eye_color    ?? prev.eyeColor,
          hairColor:    t.hair_color   ?? prev.hairColor,
          complexion:   t.body_tone    ?? prev.complexion,
          chest:        t.chest_size   ? `${t.chest_size} inch` : prev.chest,
          waist:        t.waist_size   ? `${t.waist_size} inch` : prev.waist,
          shoeSize:     t.shoe_size    ? `${t.shoe_size}`       : prev.shoeSize,
          availability: availMap[String(t.is_available)] ?? (t.availability?.[0] ? 'Available Now' : prev.availability),
          profileViews: String(t.profile_views ?? prev.profileViews),
          createdOn:    t.profiles?.created_at ? new Date(t.profiles.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : prev.createdOn,
          lastActive:   t.profiles?.last_login_at ? new Date(t.profiles.last_login_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : prev.lastActive,
          media:        Array.isArray(t.aspirant_media) && t.aspirant_media.length > 0
            ? t.aspirant_media.map((m: any) => ({
                title:     m.title ?? m.media_type ?? m.type ?? 'Media',
                duration:  m.duration ?? '',
                hasPlay:   m.media_type === 'video' || m.type === 'video',
                url:       m.url ?? m.file_url ?? m.media_url ?? '',
                mediaType: m.media_type ?? m.type ?? 'image',
              }))
            : prev.media,
          skills:       Array.isArray(t.skills) && t.skills.length > 0
            ? t.skills
            : Array.isArray(t.specializations) && t.specializations.length > 0
            ? t.specializations
            : prev.skills,
          voiceType:    t.voice_type     ?? prev.voiceType,
          rating:       t.average_rating ?? prev.rating,
          reviews:      t.total_reviews  ?? prev.reviews,
          views:        String(t.profile_views ?? prev.views),
          // Credits are stored in social_links.credits by the aspirant
          credits:      Array.isArray(t.social_links?.credits) && t.social_links.credits.length > 0
            ? t.social_links.credits.map((c: any) => ({
                type:  c.type  ?? 'Project',
                year:  c.year  ? String(c.year) : '',
                role:  c.role  ?? '',
                title: c.title ?? '',
              }))
            : prev.credits,
          // Education saved in social_links.education by aspirant from settings
          education:    Array.isArray(t.social_links?.education) && t.social_links.education.length > 0
            ? t.social_links.education.map((e: any) => ({
                type:        e.degree ?? e.type ?? 'Training',
                year:        e.to ?? e.year ?? '',
                institution: e.institution ?? '',
                detail:      e.field ?? e.specialization ?? e.detail ?? '',
              }))
            : [],
          // Additional fields the aspirant fills in
          weight_kg:    t.weight_kg    ? `${Math.round(parseFloat(String(t.weight_kg)))} kg` : prev.weight_kg,
          hip:          t.hip_size     ? `${t.hip_size} inch` : prev.hip,
          availability_for: Array.isArray(t.availability) ? t.availability : prev.availability_for,
          roleTitle:    t.role         ?? prev.roleTitle,
          experienceLevel: t.experience_level ?? prev.experienceLevel,
          pincode:      t.pincode      ?? prev.pincode,
          country:      t.country      ?? prev.country,
          address:      [t.address_line1, t.address_line2].filter(Boolean).join(', ') || prev.address,
        }));
      })
      .catch(() => {});
  }, [id]);

  // Fetch THIS agency's applications for this aspirant — filtered by agency_id server-side
  useEffect(() => {
    if (!id) return;
    const u = JSON.parse(localStorage.getItem('ss_user') || '{}');
    const token = u.token;
    if (!token) return;

    const statusColors: Record<string, string> = {
      applied: '#3b82f6', in_review: GOLD, shortlisted: GREEN,
      rejected: RED, selected: GREEN, on_hold: GOLD,
    };
    const statusLabels: Record<string, string> = {
      applied: 'New', in_review: 'In Review', shortlisted: 'Shortlisted',
      rejected: 'Rejected', selected: 'Selected', on_hold: 'On Hold',
    };

    fetch(`/api/applications?aspirant_id=${id}&limit=100`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        const list: any[] = data.data?.applications ?? data.applications ?? [];
        if (!Array.isArray(list)) return;

        // Build real stats from actual data
        const total       = list.length;
        const shortlisted = list.filter(a => a.status === 'shortlisted' || a.status === 'selected').length;
        const inReview    = list.filter(a => a.status === 'in_review').length;
        const rejected    = list.filter(a => a.status === 'rejected').length;
        setRealStats({ total, shortlisted, inReview, rejected });

        // Build agency-specific interaction timeline
        const items: ActivityItem[] = list.map((a: any) => {
          const date = a.applied_at
            ? new Date(a.applied_at).toLocaleDateString('en-IN', {
                day: '2-digit', month: 'short', year: 'numeric',
                hour: '2-digit', minute: '2-digit',
              })
            : 'Recently';
          const casting = a.casting_calls?.title ?? 'a casting call';
          const role    = a.casting_calls?.role_name ?? '';
          const status  = a.status ?? 'applied';
          return {
            color:      statusColors[status] ?? '#3b82f6',
            text:       `Applied for "${casting}"${role ? ` as ${role}` : ''}`,
            time:       date,
            badge:      statusLabels[status] ?? 'New',
            badgeColor: statusColors[status] ?? '#3b82f6',
          };
        });
        setAgencyActivity(items);
      })
      .catch(() => {});
  }, [id]);

  const SB_W = sidebarOpen ? 230 : 52;

  const handleMessage = () => {
    setMsgSent(true);
    setTimeout(() => setMsgSent(false), 2500);
  };

  /* donut SVG for profile strength */
  const radius = 40; const circ = 2 * Math.PI * radius;
  const filled = (p.profileStrength / 100) * circ;

  /* strength color */
  const strengthColor = p.profileStrength >= 80 ? GREEN : p.profileStrength >= 60 ? GOLD : RED;
  const strengthLabel = p.profileStrength >= 80 ? 'Strong Profile' : p.profileStrength >= 60 ? 'Good Profile' : 'Needs Work';

  const TABS = [
    { key: 'overview',  label: 'Overview' },
    { key: 'media',     label: `Media (${p.media.length})` },
    { key: 'auditions', label: `Experience (${p.credits.filter(c => c.title || c.role).length})` },
    { key: 'documents', label: `Documents (${p.media.filter(m => m.mediaType === 'document' || m.mediaType === 'pdf' || (m.title && ['resume','cv','noc','certificate','proof','document','headshot','measurement','contact sheet','portfolio'].some(k => m.title.toLowerCase().includes(k)))).length})` },
    { key: 'activity',  label: 'Activity' },
  ] as const;

  const mediaGradients = [
    'linear-gradient(135deg,#1a1a2e,#16213e)',
    'linear-gradient(135deg,#0f3460,#533483)',
    'linear-gradient(135deg,#1a1a2e,#533483)',
    'linear-gradient(135deg,#16213e,#0f3460)',
    'linear-gradient(135deg,#533483,#e94560)',
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: BG, fontFamily: BARLOW, color: '#F5F5F5' }}>

      {/* ══ TOPNAV ══ */}
      <header style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0, padding: '0 24px', height: 60, background: BG2, borderBottom: '1px solid rgba(255,255,255,0.06)', zIndex: 100 }}>
        <SilverScreensLogo size="md" href="/" showTagline={false} />
        <div style={{ flex: 1 }} />
        <button onClick={() => router.push('/agency/create-casting')} style={{ display: 'flex', alignItems: 'center', gap: 7, background: RED, color: '#fff', border: 'none', borderRadius: 8, padding: '0 18px', height: 36, fontSize: 16, fontWeight: 700, fontFamily: BARLOW, cursor: 'pointer', whiteSpace: 'nowrap' }}>
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
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#1a1410,#2a1e0e)', border: `2px solid ${GOLD}60`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 800, color: GOLD, fontFamily: BEBAS }}>{agencyInitials}</div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.2 }}>{agencyName}</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>Production House</div>
            </div>
            <ChevronDown size={12} color="rgba(255,255,255,0.4)" />
          </div>
          {profileOpen && (
            <>
              <div onClick={() => setProfileOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 150 }} />
              <div style={{ position: 'absolute', top: 46, right: 0, width: 200, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, overflow: 'hidden', zIndex: 200, boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}>
                {[
                  { label: 'Reports & Analytics', href: '/agency/reports' },
                  { label: 'Subscription & Billing', href: '/pricing' },
                  { label: 'Company Profile', href: '/agency-profile' },
                  { label: 'Documents', href: '/agency/documents' },
                  { label: 'Calendar', href: '/agency/calendar' },
                  { label: 'Settings', href: '/agency/settings' },
                  { label: 'Support', href: '/contact' },
                  { label: 'Logout', href: '/login' },
                ].map(({ label, href }) => (
                  <div key={label} onClick={() => { router.push(href); setProfileOpen(false); }} style={{ padding: '10px 16px', fontSize: 16, cursor: 'pointer', color: label === 'Logout' ? '#ff6b6b' : '#F5F5F5', borderTop: label === 'Logout' ? '1px solid rgba(255,255,255,0.07)' : 'none' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
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
              <div style={{ width: 38, height: 38, borderRadius: 9, background: 'linear-gradient(135deg,#1a1410,#2a1e0e)', border: `1px solid ${GOLD}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 800, color: GOLD, fontFamily: BEBAS, flexShrink: 0 }}>{agencyInitials}</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#F5F5F5', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{agencyName}</div>
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
          {sidebarOpen && (
            <div style={{ margin: '8px 10px 14px', borderRadius: 12, background: 'linear-gradient(135deg,#1a1205,#2a1e0a)', border: '1px solid rgba(212,166,74,0.25)', padding: '14px 12px', textAlign: 'center', flexShrink: 0 }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>👑</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: GOLD, marginBottom: 3 }}>Upgrade to Pro</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 10, lineHeight: 1.5 }}>Unlock advanced talent filters and AI matching.</div>
              <button onClick={() => router.push('/pricing')} style={{ width: '100%', background: GOLD, color: '#000', border: 'none', borderRadius: 8, padding: '7px 0', fontSize: 14, fontWeight: 700, fontFamily: BARLOW, cursor: 'pointer' }}>Upgrade Now</button>
            </div>
          )}
        </aside>

        {/* ══ MAIN CONTENT ══ */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

          {/* ── LEFT PANEL (fixed width) ── */}
          <div style={{ width: 220, flexShrink: 0, overflowY: 'auto', scrollbarWidth: 'none', borderRight: '1px solid rgba(255,255,255,0.06)', background: BG2, display: 'flex', flexDirection: 'column' }}>

            {/* Back */}
            <div onClick={() => router.back()} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '14px 16px 10px', fontSize: 14, color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontWeight: 600 }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
            ><ChevronLeft size={14} /> Back to Search Results</div>

            {/* Photo */}
            <div style={{ position: 'relative', margin: '0 14px 12px' }}>
              <div style={{ width: '100%', aspectRatio: '3/4', borderRadius: 12, overflow: 'hidden', background: p.gradient }}>
                <img
                  src={p.photoUrl}
                  alt={p.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                />
              </div>
              {p.verified && (
                <div style={{ position: 'absolute', bottom: 10, left: 10, display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(0,0,0,0.75)', borderRadius: 20, padding: '4px 10px', fontSize: 14, fontFamily: BARLOW, fontWeight: 700, color: '#fff', backdropFilter: 'blur(4px)' }}>
                  Verified
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="8" fill="#3b82f6"/><path d="M5 8l2 2 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              )}
              <div onClick={() => router.push('/agency/saved-talents')} style={{ position: 'absolute', top: 10, right: 10, width: 28, height: 28, borderRadius: 6, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                onMouseEnter={e => (e.currentTarget.style.background = `${GOLD}50`)}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.55)')}
              ><Bookmark size={13} color="rgba(255,255,255,0.8)" /></div>
            </div>

            {/* Name + meta */}
            <div style={{ padding: '0 16px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
                <span style={{ fontSize: 18, fontFamily: BEBAS, letterSpacing: 1, color: '#fff' }}>{p.name}</span>
                {p.verified && <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="8" fill="#3b82f6"/><path d="M5 8l2 2 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 5 }}>{p.category} · {p.gender} · {p.age} Years</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>
                <MapPin size={11} color="rgba(255,255,255,0.35)" /> {p.location}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 14, color: '#fff' }}>
                  <Star size={13} color={GOLD} fill={GOLD} /> {p.rating} <span style={{ color: 'rgba(255,255,255,0.4)' }}>({p.reviews})</span>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>
                  <Eye size={12} color="rgba(255,255,255,0.4)" /> {p.views}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <button onClick={handleMessage} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: msgSent ? 'rgba(34,197,94,0.12)' : 'none', border: `1px solid ${msgSent ? GREEN : GOLD}`, borderRadius: 8, padding: '9px 0', color: msgSent ? GREEN : GOLD, fontSize: 15, fontFamily: BARLOW, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', width: '100%' }}>
                {msgSent ? <><Check size={14} /> Sent!</> : <><MessageSquare size={14} /> Contact Aspirant</>}
              </button>
              <button onClick={() => setShortlisted(v => !v)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: shortlisted ? `${GOLD}15` : 'none', border: `1px solid ${shortlisted ? GOLD : 'rgba(255,255,255,0.15)'}`, borderRadius: 8, padding: '9px 0', color: shortlisted ? GOLD : 'rgba(255,255,255,0.7)', fontSize: 15, fontFamily: BARLOW, fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s', width: '100%' }}>
                <Bookmark size={14} fill={shortlisted ? GOLD : 'none'} /> {shortlisted ? 'Shortlisted' : 'Add to Shortlist'}
              </button>
              <div style={{ position: 'relative' }}>
                <button onClick={() => setMoreOpen(v => !v)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'none', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '9px 0', color: 'rgba(255,255,255,0.6)', fontSize: 15, fontFamily: BARLOW, fontWeight: 500, cursor: 'pointer', width: '100%' }}>
                  <MoreHorizontal size={14} /> More Actions <ChevronDown size={12} style={{ marginLeft: 'auto' }} />
                </button>
                {moreOpen && (
                  <>
                    <div onClick={() => setMoreOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 50 }} />
                    <div style={{ position: 'absolute', bottom: '110%', left: 0, right: 0, background: BG4, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, overflow: 'hidden', zIndex: 100, boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
                      {[
                        { label: 'Invite to Audition',  href: '/agency/auditions' },
                        { label: 'Save to Talent Pool', href: '/agency/saved-talents' },
                        { label: 'Report Profile',      href: '#' },
                      ].map(({ label, href }) => (
                        <div key={label} onClick={() => { if (href !== '#') router.push(href); setMoreOpen(false); }} style={{ padding: '9px 14px', fontSize: 15, fontFamily: BARLOW, cursor: 'pointer', color: label.includes('Report') ? '#ff6b6b' : '#F5F5F5', borderTop: label.includes('Report') ? '1px solid rgba(255,255,255,0.07)' : 'none' }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        >{label}</div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Profile Strength */}
            <div style={{ padding: '16px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 12 }}>Profile Strength</div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 14 }}>
                <svg width={100} height={100} viewBox="0 0 100 100">
                  <circle cx={50} cy={50} r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={10} />
                  <circle cx={50} cy={50} r={radius} fill="none" stroke={strengthColor} strokeWidth={10}
                    strokeDasharray={`${filled} ${circ - filled}`}
                    strokeDashoffset={circ * 0.25}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dasharray 0.6s ease' }}
                  />
                  <text x={50} y={46} textAnchor="middle" fill="#fff" fontSize={18} fontFamily={BEBAS} letterSpacing={1}>{p.profileStrength}%</text>
                  <text x={50} y={60} textAnchor="middle" fill={strengthColor} fontSize={9} fontFamily={BARLOW}>{strengthLabel}</text>
                </svg>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {p.strengthItems.map(item => (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 16, height: 16, borderRadius: '50%', background: item.done ? `${GREEN}20` : 'rgba(255,255,255,0.06)', border: `1.5px solid ${item.done ? GREEN : 'rgba(255,255,255,0.15)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {item.done && <Check size={9} color={GREEN} strokeWidth={2.5} />}
                    </div>
                    <span style={{ fontSize: 14, fontFamily: BARLOW, color: item.done ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.35)' }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Meta info */}
            <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Last Active',        value: p.lastActive },
                { label: 'Profile Created On', value: p.createdOn },
                { label: 'Profile ID',         value: p.profileId },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 1 }}>{label}</div>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── CENTRE + RIGHT PANELS ── */}
          <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

            {/* ── CENTRE (tabs + content) ── */}
            <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none' }}>

              {/* Tabs */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 0, borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '0 24px', background: BG2, position: 'sticky', top: 0, zIndex: 20 }}>
                {TABS.map(tab => {
                  const active = activeTab === tab.key;
                  return (
                    <div key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ padding: '14px 18px', cursor: 'pointer', borderBottom: active ? `2px solid ${GOLD}` : '2px solid transparent', marginBottom: -1 }}>
                      <span style={{ fontSize: 15, fontFamily: BARLOW, fontWeight: active ? 700 : 500, color: active ? GOLD : 'rgba(255,255,255,0.5)' }}>{tab.label}</span>
                    </div>
                  );
                })}
              </div>

              <div style={{ padding: '20px 24px 40px' }}>

                {/* ── OVERVIEW ── */}
                {activeTab === 'overview' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                    {/* About */}
                    <ContentCard title="About">
                      <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, margin: 0 }}>{p.about}</p>
                      {/* Physical grid */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px 20px', marginTop: 18 }}>
                        {[
                          { label: 'Languages',        value: p.languages },
                          { label: 'Height',           value: p.height },
                          { label: 'Weight',           value: p.weight_kg },
                          { label: 'Build',            value: p.build },
                          { label: 'Eye Color',        value: p.eyeColor },
                          { label: 'Hair Color',       value: p.hairColor },
                          { label: 'Complexion',       value: p.complexion },
                          { label: 'Location',         value: p.location },
                          { label: 'Role',             value: p.roleTitle },
                          { label: 'Experience',       value: p.experienceLevel },
                        ].filter(f => f.value).map(({ label, value }) => (
                          <div key={label}>
                            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 3 }}>{label}</div>
                            <div style={{ fontSize: 15, color: '#fff', fontWeight: 500 }}>{value}</div>
                          </div>
                        ))}
                      </div>
                      {/* Available For */}
                      {p.availability_for.length > 0 && (
                        <div style={{ marginTop: 16 }}>
                          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Available For</div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                            {p.availability_for.map(a => (
                              <span key={a} style={{ fontSize: 13, color: GREEN, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 20, padding: '3px 10px' }}>{a}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </ContentCard>

                    {/* Media strip */}
                    <ContentCard title={`Media (${p.media.length})`} action={{ label: 'View All', onClick: () => setActiveTab('media') }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
                        {p.media.map((m, i) => (
                          <div key={i} style={{ borderRadius: 8, overflow: 'hidden', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.06)' }}>
                            <div style={{ position: 'relative', height: 90 }}>
                              {m.url && m.mediaType === 'video' ? (
                                <video src={m.url} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} muted playsInline />
                              ) : (
                                <img src={m.url || MEDIA_IMAGES[i % MEDIA_IMAGES.length]} alt={m.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} onError={e => { (e.currentTarget as HTMLImageElement).src = MEDIA_IMAGES[i % MEDIA_IMAGES.length]; }} />
                              )}
                              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)' }} />
                              {m.hasPlay && (
                                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
                                    <Play size={13} color="#fff" fill="#fff" />
                                  </div>
                                </div>
                              )}
                              {m.duration && <div style={{ position: 'absolute', bottom: 5, right: 6, background: 'rgba(0,0,0,0.65)', borderRadius: 4, padding: '1px 6px', fontSize: 14, color: '#fff' }}>{m.duration}</div>}
                            </div>
                            <div style={{ padding: '6px 8px', background: BG3 }}>
                              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.title}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ContentCard>

                    {/* Stats — real values from this agency's interactions with this talent */}
                    <ContentCard title="Stats with Your Agency">
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                        {[
                          { icon: <ClipboardList size={18} color={GOLD} />, label: 'Applications',  value: realStats.total,       color: '#fff'  },
                          { icon: <Star size={18} color={GREEN} />,         label: 'Shortlisted',   value: realStats.shortlisted, color: GREEN   },
                          { icon: <Eye size={18} color={GOLD} />,           label: 'In Review',     value: realStats.inReview,    color: GOLD    },
                          { icon: <Check size={18} color={RED} />,          label: 'Rejected',      value: realStats.rejected,    color: RED     },
                        ].map(({ icon, label, value, color }) => (
                          <div key={label} style={{ textAlign: 'center', padding: '12px 8px', background: BG3, borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}>{icon}</div>
                            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.4 }}>{label}</div>
                            <div style={{ fontSize: 22, fontFamily: BEBAS, letterSpacing: 1, color }}>{value}</div>
                          </div>
                        ))}
                      </div>
                      {/* Profile views from DB */}
                      {p.profileViews && p.profileViews !== '0' && (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, padding: '10px 14px', background: BG3, borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Eye size={15} color={GOLD} />
                            <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 0.4 }}>Total Profile Views</span>
                          </div>
                          <span style={{ fontSize: 18, fontFamily: BEBAS, letterSpacing: 1, color: '#fff' }}>{p.profileViews}</span>
                        </div>
                      )}
                    </ContentCard>

                    {/* Recent Interaction Summary */}
                    {agencyActivity.length > 0 && (
                      <ContentCard title="Recent Interactions">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                          {agencyActivity.slice(0, 3).map((a, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '12px 0', borderBottom: i < Math.min(agencyActivity.length, 3) - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                              <div style={{ width: 10, height: 10, borderRadius: '50%', background: a.color, flexShrink: 0, marginTop: 4 }} />
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)', lineHeight: 1.5 }}>{a.text}</div>
                                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{a.time}</div>
                              </div>
                              {a.badge && (
                                <span style={{ fontSize: 14, fontWeight: 700, color: a.badgeColor, background: `${a.badgeColor}18`, border: `1px solid ${a.badgeColor}55`, borderRadius: 20, padding: '3px 10px', flexShrink: 0 }}>{a.badge}</span>
                              )}
                            </div>
                          ))}
                        </div>
                        {agencyActivity.length > 3 && (
                          <div onClick={() => setActiveTab('activity')} style={{ marginTop: 12, fontSize: 14, color: GOLD, cursor: 'pointer', textAlign: 'center' }}>
                            View all {agencyActivity.length} interactions →
                          </div>
                        )}
                      </ContentCard>
                    )}
                  </div>
                )}

                {/* ── MEDIA ── */}
                {activeTab === 'media' && (
                  <ContentCard title={`Media Gallery (${p.media.length})`}>
                    {p.media.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '40px 0', color: 'rgba(255,255,255,0.3)', fontSize: 15 }}>No media uploaded yet.</div>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                        {p.media.map((m, i) => (
                          <div key={i} style={{ borderRadius: 8, overflow: 'hidden', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.06)', transition: 'border-color 0.15s' }}
                            onMouseEnter={e => (e.currentTarget.style.borderColor = `${GOLD}50`)}
                            onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}
                          >
                            <div style={{ position: 'relative', height: 110 }}>
                              {m.url && m.mediaType === 'video' ? (
                                <video src={m.url} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} muted playsInline />
                              ) : (
                                <img src={m.url || MEDIA_IMAGES[i % MEDIA_IMAGES.length]} alt={m.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} onError={e => { (e.currentTarget as HTMLImageElement).src = MEDIA_IMAGES[i % MEDIA_IMAGES.length]; }} />
                              )}
                              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)' }} />
                              {m.hasPlay && (
                                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Play size={15} color="#fff" fill="#fff" />
                                  </div>
                                </div>
                              )}
                              {m.duration && <div style={{ position: 'absolute', bottom: 6, right: 8, background: 'rgba(0,0,0,0.65)', borderRadius: 4, padding: '2px 6px', fontSize: 14, color: '#fff' }}>{m.duration}</div>}
                              <div style={{ position: 'absolute', top: 6, left: 6, background: 'rgba(0,0,0,0.6)', borderRadius: 4, padding: '1px 6px', fontSize: 12, color: 'rgba(255,255,255,0.7)', textTransform: 'capitalize' }}>{m.mediaType ?? 'image'}</div>
                            </div>
                            <div style={{ padding: '8px 10px', background: BG3 }}>
                              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{m.title}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ContentCard>
                )}

                {/* ── EXPERIENCE / CREDITS ── */}
                {activeTab === 'auditions' && (
                  <ContentCard title={`Experience & Credits (${p.credits.filter(c => c.title || c.role).length})`}>
                    {p.credits.filter(c => c.title || c.role).length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '40px 0', color: 'rgba(255,255,255,0.3)', fontSize: 15 }}>No credits added yet.</div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                        {p.credits.filter(c => c.title || c.role).map((c, i, arr) => (
                          <div key={i} style={{ display: 'flex', gap: 16, padding: '14px 0', borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                            <div style={{ width: 46, height: 46, borderRadius: 8, background: `${GOLD}15`, border: `1px solid ${GOLD}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <Film size={18} color={GOLD} />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 3 }}>
                                <div style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>{c.title || '—'}</div>
                                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', flexShrink: 0 }}>{c.year}</span>
                              </div>
                              <div style={{ display: 'flex', gap: 8, marginBottom: c.role ? 4 : 0 }}>
                                {c.type && <span style={{ fontSize: 13, color: GOLD, background: `${GOLD}12`, border: `1px solid ${GOLD}30`, borderRadius: 20, padding: '2px 8px' }}>{c.type}</span>}
                                {c.role && <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>as <strong style={{ color: '#fff' }}>{c.role}</strong></span>}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ContentCard>
                )}

                {/* ── DOCUMENTS ── */}
                {activeTab === 'documents' && (
                  <ContentCard title="Documents">
                    {(() => {
                      const docs = p.media.filter(m => m.mediaType === 'document' || m.mediaType === 'pdf' || (m.title && ['resume','cv','noc','certificate','proof','document','headshot','measurement','contact sheet','portfolio'].some(k => m.title.toLowerCase().includes(k))));
                      if (docs.length === 0) {
                        return (
                          <div style={{ textAlign: 'center', padding: '40px 0', color: 'rgba(255,255,255,0.3)', fontSize: 15 }}>
                            No documents uploaded by this aspirant.
                          </div>
                        );
                      }
                      return (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {docs.map((doc, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 14px', background: BG3, borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)', cursor: doc.url ? 'pointer' : 'default' }}
                              onClick={() => doc.url && window.open(doc.url, '_blank')}
                              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
                              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{ width: 32, height: 32, borderRadius: 6, background: `${GOLD}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <BookOpen size={14} color={GOLD} />
                                </div>
                                <div>
                                  <div style={{ fontSize: 15, color: '#fff', fontWeight: 500 }}>{doc.title}</div>
                                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)' }}>{doc.mediaType?.toUpperCase() ?? 'FILE'}{doc.url ? ' · Click to view' : ''}</div>
                                </div>
                              </div>
                              {doc.url && <ChevronRight size={14} color="rgba(255,255,255,0.3)" />}
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </ContentCard>
                )}

                {/* ── ACTIVITY — only THIS agency's interactions with this talent ── */}
                {activeTab === 'activity' && (
                  <ContentCard title="Interaction History">
                    <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontFamily: BARLOW, marginBottom: 16, lineHeight: 1.6 }}>
                      Applications this talent submitted to your agency, with their current status.
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                      {agencyActivity.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px 0', color: 'rgba(255,255,255,0.3)', fontSize: 15 }}>
                          No interactions yet with this talent.
                        </div>
                      ) : agencyActivity.map((a, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 0', borderBottom: i < agencyActivity.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                          <div style={{ width: 10, height: 10, borderRadius: '50%', background: a.color, flexShrink: 0, marginTop: 5 }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)', lineHeight: 1.5 }}>{a.text}</div>
                            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{a.time}</div>
                          </div>
                          {a.badge && (
                            <span style={{ fontSize: 14, fontWeight: 700, color: a.badgeColor, background: `${a.badgeColor}18`, border: `1px solid ${a.badgeColor}55`, borderRadius: 20, padding: '3px 10px', flexShrink: 0 }}>{a.badge}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </ContentCard>
                )}
              </div>
            </div>

            {/* ── RIGHT PANEL ── */}
            <div style={{ width: 260, flexShrink: 0, overflowY: 'auto', scrollbarWidth: 'none', borderLeft: '1px solid rgba(255,255,255,0.06)', padding: '20px 18px', display: 'flex', flexDirection: 'column', gap: 18 }}>

              {/* Skills */}
              <RightCard title="Skills">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {p.skills.slice(0, 8).map(s => (
                    <span key={s} style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '3px 10px' }}>{s}</span>
                  ))}
                  {p.skills.length > 8 && (
                    <span style={{ fontSize: 14, color: GOLD, background: `${GOLD}12`, border: `1px solid ${GOLD}30`, borderRadius: 20, padding: '3px 10px' }}>+{p.skills.length - 8}</span>
                  )}
                </div>
              </RightCard>

              {/* Experience */}
              <RightCard title="Experience" action={<span onClick={() => setActiveTab('auditions')} style={{ fontSize: 14, color: GOLD, cursor: 'pointer' }}>View All</span>}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {p.credits.filter(c => c.title || c.role).length === 0 ? (
                    <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)' }}>No credits added yet.</div>
                  ) : p.credits.filter(c => c.title || c.role).slice(0, 3).map((c, i, arr) => (
                    <div key={i} style={{ display: 'flex', gap: 10, paddingBottom: i < arr.length - 1 ? 12 : 0, borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: GOLD, flexShrink: 0, marginTop: 6 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>{c.type}</span>
                          <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)' }}>{c.year}</span>
                        </div>
                        <div style={{ fontSize: 15, fontWeight: 600, color: '#fff', marginTop: 1 }}>{c.role}</div>
                        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginTop: 1 }}>{c.title}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </RightCard>

              {/* Education & Training — only show if aspirant has added entries */}
              {p.education.length > 0 && (
                <RightCard title="Education & Training">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {p.education.map((e, i) => (
                      <div key={i} style={{ display: 'flex', gap: 10, paddingBottom: i < p.education.length - 1 ? 12 : 0, borderBottom: i < p.education.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: GOLD, flexShrink: 0, marginTop: 6 }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>{e.type}</span>
                            <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)' }}>{e.year}</span>
                          </div>
                          <div style={{ fontSize: 15, fontWeight: 600, color: '#fff', marginTop: 1 }}>{e.institution}</div>
                          {e.detail && <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginTop: 1 }}>{e.detail}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </RightCard>
              )}

              {/* Physical Attributes */}
              <RightCard title="Physical Attributes">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 8px' }}>
                  {[
                    { label: 'Chest',     value: p.chest },
                    { label: 'Waist',     value: p.waist },
                    { label: 'Hip',       value: p.hip },
                    { label: 'Shoe Size', value: p.shoeSize },
                    { label: 'Weight',    value: p.weight_kg },
                  ].filter(f => f.value).map(({ label, value }) => (
                    <div key={label}>
                      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 3 }}>{label}</div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>{value}</div>
                    </div>
                  ))}
                </div>
              </RightCard>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Helpers ─────────────────────────────────────────────────── */
function ContentCard({ title, children, action }: { title: string; children: React.ReactNode; action?: { label: string; onClick: () => void } }) {
  return (
    <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, overflow: 'hidden' }}>
      <div style={{ padding: '13px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 16, fontFamily: BARLOW, fontWeight: 600, color: '#fff' }}>{title}</span>
        {action && <span onClick={action.onClick} style={{ fontSize: 14, color: GOLD, cursor: 'pointer', fontFamily: BARLOW }}>{action.label}</span>}
      </div>
      <div style={{ padding: '16px 18px' }}>{children}</div>
    </div>
  );
}

function RightCard({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12 }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 16, fontFamily: BARLOW, fontWeight: 600, color: '#fff' }}>{title}</span>
        {action}
      </div>
      <div style={{ padding: '14px 16px 16px' }}>{children}</div>
    </div>
  );
}