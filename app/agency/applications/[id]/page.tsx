'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import SilverScreensLogo from '@/components/ui/SilverScreensLogo';
import {
  LayoutDashboard, Megaphone, PlusCircle, ClipboardList,
  UserSearch, Star, CalendarCheck, MessageSquare, Bell,
  Bookmark, ChevronDown, ChevronLeft, ChevronRight,
  Eye, MapPin, Check, X, Play, Edit2,
  Menu, FileText, Activity, Phone, Globe,
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

const STATUS_COLORS: Record<string, string> = {
  New: BLUE, 'In Review': GOLD, Shortlisted: GREEN, Rejected: RED,
  Selected: GREEN, 'On Hold': GOLD,
};

/* ─── Sidebar nav ─────────────────────────────────────────────── */
const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard',               href: '/agency/dashboard' },
  { icon: PlusCircle,      label: 'Create Casting Call',     href: '/agency/create-casting' },
  { icon: Megaphone,       label: 'Casting Calls List',      href: '/agency/casting-calls' },
  { icon: UserSearch,      label: 'Talent Search',           href: '/agency/talent-search' },
  { icon: ClipboardList,   label: 'Applications Management', href: '/agency/applications', active: true },
  { icon: Star,            label: 'Shortlisted Talents',     href: '/agency/shortlisted' },
  { icon: CalendarCheck,   label: 'Audition Management',     href: '/agency/auditions' },
  { icon: Bookmark,        label: 'Saved Talents',           href: '/agency/saved-talents' },
  { icon: MessageSquare,   label: 'Messages',  href: '/agency/messages' },
  { icon: Bell,            label: 'Notifications', href: '/agency/notifications' },
];

/* ─── Full application data (keyed by applicant id) ──────────── */
interface AppDetail {
  id: string; appId: string; aspirantProfileId: string; name: string; verified: boolean;
  category: string; gender: string; age: number; location: string;
  rating: number; reviews: number; views: string;
  img: string; status: 'New' | 'In Review' | 'Shortlisted' | 'Rejected';
  appliedOn: string; appliedTime: string;
  castingCall: string; castingCallStatus: string; castingCallPoster: string;
  productionHouse: string; projectType: string; roleApplied: string;
  shootLocation: string;
  coverLetter: string;
  experience: string; availability: string; languages: string;
  joiningDate: string; height: string; weight: string;
  travel: string; portfolioLink: string; bodyType: string;
  skills: string[];
  /* role requirements */
  reqRole: string; reqGender: string; reqAgeRange: string;
  reqHeight: string; reqLanguage: string; reqExperience: string;
  /* media */
  media: { title: string; type: string; size: string; duration?: string; img: string }[];
  extraMedia: number;
  /* audition */
  auditionDate: string; auditionTime: string; auditionFormat: string;
  auditionLocation: string; auditionNotes: string;
  /* extended aspirant profile */
  dob: string; role: string;
  chest: string; hip: string; waist: string; shoe: string;
  hairColor: string; eyeColor: string; complexion: string;
  aboutMe: string; socialLinks: Record<string, string>;
  availabilityFor: string[];
  experienceCredits: { role: string; title: string; type: string; year: string; character: string; director: string; production: string; platform: string; language: string; description: string }[];
  agencyLogoUrl: string;
  castingCallId: string;
}

const MEDIA_IMGS = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=200&h=150&fit=crop',
  'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=200&h=150&fit=crop',
  'https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?w=200&h=150&fit=crop',
  'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=200&h=150&fit=crop',
];

const POSTER_IMGS: Record<string, string> = {
  a1: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=120&h=160&fit=crop',
  a2: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=120&h=160&fit=crop',
  a3: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=120&h=160&fit=crop',
};

function buildFallback(id: string): AppDetail {
  return {
    id, appId: '', aspirantProfileId: '', name: '',
    verified: false, category: '', gender: '', age: 0,
    location: '', rating: 0, reviews: 0, views: '0',
    img: '', status: 'New', appliedOn: '', appliedTime: '',
    castingCall: '', castingCallStatus: 'Open',
    castingCallPoster: '',
    productionHouse: '', projectType: '',
    roleApplied: '', shootLocation: '',
    coverLetter: '', experience: '', availability: '', languages: '',
    joiningDate: '', height: '', weight: '',
    travel: '', portfolioLink: '', bodyType: '',
    skills: [],
    reqRole: '', reqGender: '', reqAgeRange: '',
    reqHeight: '', reqLanguage: '', reqExperience: '',
    media: [], extraMedia: 0,
    auditionDate: '', auditionTime: '', auditionFormat: '',
    auditionLocation: '', auditionNotes: '',
    dob: '', role: '',
    chest: '', hip: '', waist: '', shoe: '',
    hairColor: '', eyeColor: '', complexion: '',
    aboutMe: '', socialLinks: {}, availabilityFor: [], experienceCredits: [], agencyLogoUrl: '', castingCallId: '',
  };
}

/* ══════════════════════════════════════════════════════════════ */
export default function ApplicationDetailPage() {
  const router  = useRouter();

  const [msgCount,   setMsgCount]   = useState(0);
  const [notifCount, setNotifCount] = useState(0);

  function getAuthHeaders(): Record<string, string> {
    try { const key = Object.keys(localStorage).find(k => k.startsWith('sb-') && k.endsWith('-auth-token')); const token = key ? JSON.parse(localStorage.getItem(key) || '{}')?.access_token || '' : ''; return token ? { Authorization: `Bearer ${token}` } : {}; } catch { return {}; }
  }

  useEffect(() => {
    function fetchCounts() {
      const h = getAuthHeaders();
      fetch('/api/notifications', { headers: h }).then(r => r.ok ? r.json() : null).then(data => {
        if (!data) return;
        const count = data.data?.unread_count ?? data.unread_count;
        if (count != null) { setNotifCount(count); return; }
        const list = data.data?.notifications ?? data.notifications ?? [];
        if (Array.isArray(list)) setNotifCount(list.filter((n: any) => !n.is_read).length);
      }).catch(() => {});
      fetch('/api/messages/conversations', { headers: h }).then(r => r.ok ? r.json() : null).then(data => {
        if (!data) return;
        const list = data.data?.conversations ?? data.conversations ?? [];
        if (Array.isArray(list)) setMsgCount(list.filter((c: any) => c.unreadCount > 0 || c.unread_count > 0).length);
      }).catch(() => {});
    }
    fetchCounts();
    const interval = setInterval(fetchCounts, 30000);
    return () => clearInterval(interval);
  }, []);
  const params  = useParams();
  const rawId   = params?.id;
  const id      = typeof rawId === 'string' ? rawId : Array.isArray(rawId) ? rawId[0] : '';

  // prev/next navigation — populated after API fetch
  const [prevId, setPrevId] = useState<string | null>(null);
  const [nextId, setNextId] = useState<string | null>(null);

  const [app, setApp] = useState<AppDetail>(buildFallback(id));

  const [sidebarOpen,  setSidebarOpen]  = useState(false);
  const [profileOpen,  setProfileOpen]  = useState(false);
  const [agencyName,    setAgencyName]    = useState('My Agency');
  const [agencyInitials,setAgencyInitials]= useState('AG');
  const [agencyType,    setAgencyType]    = useState('Production House');
  const [agencyId,      setAgencyId]      = useState('AGE·········');
  const [isApproved,    setIsApproved]    = useState(true);

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('ss_user') || '{}');
      if (u.name) { setAgencyName(u.name); setAgencyInitials(u.name.split(' ').map((w: string) => w[0]).join('').slice(0,2).toUpperCase()); }
      if (u.profileNumber) setAgencyId(u.profileNumber);
      const st = u.profileStatus ?? 'pending';
      setIsApproved(st === 'approved' || st === 'active');
    } catch {}
    // Fetch full agency profile
    const h = getAuthHeaders();
    fetch('/api/profile/agency', { headers: h })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        const p = data.data?.profile ?? data.profile ?? data;
        const name = p.company_name ?? p.name;
        if (name) { setAgencyName(name); setAgencyInitials(name.split(' ').map((w: string) => w[0]).join('').slice(0,2).toUpperCase()); }
        const agNum = p.profile_number ?? p.profiles?.profile_number;
        if (agNum) setAgencyId(agNum);
        if (p.company_type ?? p.companyType) setAgencyType(p.company_type ?? p.companyType);
        const vs = p.verification_status ?? p.verificationStatus ?? 'pending';
        setIsApproved(vs === 'approved' || vs === 'active');
      }).catch(() => {});
  }, []);
  const [activeTab,    setActiveTab]    = useState<'application' | 'audition' | 'documents' | 'messages' | 'notes' | 'activity'>('application');
  const [note,         setNote]         = useState('');
  const [notesSaved,   setNotesSaved]   = useState<string[]>([]);
  const [appStatus,    setAppStatus]    = useState<AppDetail['status']>(app.status);
  const [moreOpen,     setMoreOpen]     = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [showSelectConfirm, setShowSelectConfirm] = useState(false);

  const SB_W = sidebarOpen ? 230 : 52;

  const handleStatusChange = async (s: AppDetail['status']) => {
    if (s === 'Selected') { setShowSelectConfirm(true); return; }
    await applyStatusChange(s);
  };

  const applyStatusChange = async (s: AppDetail['status']) => {
    setStatusUpdating(true);
    try {
      const token = JSON.parse(localStorage.getItem('ss_user') || '{}').token;
      if (!token) return;
      const dbStatus: Record<string, string> = {
        'New': 'applied', 'In Review': 'in_review', 'Shortlisted': 'shortlisted',
        'Rejected': 'rejected', 'Selected': 'selected', 'On Hold': 'on_hold',
      };
      const res = await fetch(`/api/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: dbStatus[s] ?? s.toLowerCase() }),
      });
      if (res.ok) {
        setAppStatus(s);
        // Auto-close casting call when aspirant is selected (one role per casting call per PRD)
        if (s === 'Selected' && app.castingCall) {
          const ccRes = await fetch(`/api/casting-calls/${app.aspirantProfileId ? id : id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ status: 'closed', selected_applicant_id: id }),
          });
          // Also try by casting call title lookup if direct ID fails
          if (!ccRes.ok) {
            // Fetch the application again to get casting_call_id
            const appRes = await fetch(`/api/applications/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            if (appRes.ok) {
              const appData = await appRes.json();
              const ccId = appData.data?.application?.casting_call_id ?? appData.application?.casting_call_id;
              if (ccId) {
                await fetch(`/api/casting-calls/${ccId}`, {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                  body: JSON.stringify({ status: 'closed' }),
                }).catch(() => {});
              }
            }
          }
        }
      }
    } catch {}
    setStatusUpdating(false);
    setShowSelectConfirm(false);
  };

  // Fetch real application data
  useEffect(() => {
    if (!id) return;
    const u = JSON.parse(localStorage.getItem('ss_user') || '{}');
    const token = u.token;
    if (!token) return;

    // Fetch nearby applications for prev/next navigation
    fetch(`/api/applications?limit=50`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        const list = data.data?.applications ?? data.applications ?? [];
        if (!Array.isArray(list)) return;
        const ids: string[] = list.map((a: any) => a.id).filter(Boolean);
        const idx = ids.indexOf(id);
        if (idx > 0)                setPrevId(ids[idx - 1]);
        if (idx < ids.length - 1)  setNextId(ids[idx + 1]);
      })
      .catch(() => {});
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const u = JSON.parse(localStorage.getItem('ss_user') || '{}');
    const token = u.token;
    if (!token) return;
    fetch(`/api/applications/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        const a = data.data?.application ?? data.application ?? data;
        const cc = a.casting_calls ?? {};
        const ap = a.aspirant_profiles ?? {};
        const dob = ap.date_of_birth ? new Date(ap.date_of_birth) : null;
        const age = dob ? Math.floor((Date.now() - dob.getTime()) / (1000 * 60 * 60 * 24 * 365.25)) : 0;
        const appliedAt = a.applied_at ? new Date(a.applied_at) : null;
        const statusMap: Record<string, AppDetail['status']> = {
          applied: 'New', in_review: 'In Review', shortlisted: 'Shortlisted', rejected: 'Rejected', selected: 'Selected', on_hold: 'On Hold',
        };
        const bMin = cc.budget_min, bMax = cc.budget_max;
        const compensation = bMin
          ? (bMin === bMax ? `₹${Number(bMin).toLocaleString('en-IN')}` : `₹${Number(bMin).toLocaleString('en-IN')} – ₹${Number(bMax).toLocaleString('en-IN')}`)
          : (cc.compensation_details ?? '');
        setApp(prev => ({
          ...prev,
          id:                a.id ?? prev.id,
          // ✅ KEY FIX: aspirant profile ID comes from ap.id or the FK on the application record
          aspirantProfileId: ap.id ?? a.aspirant_profile_id ?? a.aspirant_id ?? prev.aspirantProfileId,
          appId:             `APP-${a.id?.slice(0, 8).toUpperCase() ?? prev.appId}`,
          name:              [ap.first_name, ap.last_name].filter(Boolean).join(' ') || prev.name,
          verified:          ap.verification_status === 'approved',
          category:          ap.category ?? prev.category,
          gender:            ap.gender ?? prev.gender,
          age:               age || prev.age,
          location:          [ap.city, ap.state, ap.country].filter(Boolean).join(', ') || prev.location,
          img:               ap.profile_image_url ?? prev.img,
          status:            statusMap[a.status] ?? prev.status,
          appliedOn:         appliedAt ? appliedAt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : prev.appliedOn,
          appliedTime:       appliedAt ? appliedAt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : prev.appliedTime,
          castingCall:       cc.title ?? prev.castingCall,
          castingCallStatus: cc.status === 'active' ? 'Open' : (cc.status ?? prev.castingCallStatus),
          productionHouse:   cc.agency_profiles?.company_name ?? prev.productionHouse,
          projectType:       cc.project_type ?? prev.projectType,
          roleApplied:       cc.role_name ?? a.role_applied ?? prev.roleApplied,
          shootLocation:     cc.location ?? prev.shootLocation,
          experience:        ap.experience_level ?? prev.experience,
          availability:      Array.isArray(ap.availability) && ap.availability.length > 0
                               ? 'Available Now'
                               : (ap.is_available ? 'Available Now' : prev.availability),
          languages:         Array.isArray(ap.languages) ? ap.languages.join(', ') : (ap.languages ?? prev.languages),
          height:            ap.height_cm ? `${ap.height_cm} cm` : prev.height,
          weight:            ap.weight_kg ? `${Math.round(parseFloat(String(ap.weight_kg)))} kg` : prev.weight,
          bodyType:          ap.body_type      ?? prev.bodyType,
          chest:             ap.chest_size     ? `${ap.chest_size} inch` : prev.chest,
          hip:               ap.hip_size       ? `${ap.hip_size} inch` : prev.hip,
          waist:             ap.waist_size     ? `${ap.waist_size} inch` : prev.waist,
          shoe:              ap.shoe_size      ? `${ap.shoe_size}` : prev.shoe,
          hairColor:         ap.hair_color     ?? prev.hairColor,
          eyeColor:          ap.eye_color      ?? prev.eyeColor,
          complexion:        ap.body_tone      ?? prev.complexion,
          dob:               ap.date_of_birth  ? new Date(ap.date_of_birth).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : prev.dob,
          role:              ap.role           ?? prev.role,
          aboutMe:           ap.about_me       ?? prev.aboutMe,
          socialLinks:       typeof ap.social_links === 'object' && ap.social_links ? ap.social_links : prev.socialLinks,
          agencyLogoUrl:     cc.agency_profiles?.logo_url ?? prev.agencyLogoUrl,
          availabilityFor:   Array.isArray(ap.availability) && ap.availability.length > 0
                               ? ap.availability : prev.availabilityFor,
          experienceCredits: Array.isArray(ap.social_links?.credits) && ap.social_links.credits.length > 0
                               ? ap.social_links.credits.map((c: any) => ({
                                   role:        c.role        ?? '',
                                   title:       c.title       ?? '',
                                   type:        c.type        ?? '',
                                   year:        c.year        ? String(c.year) : '',
                                   character:   c.characterName ?? c.character ?? '',
                                   director:    c.director    ?? '',
                                   production:  c.productionHouse ?? c.production ?? '',
                                   platform:    c.platform    ?? '',
                                   language:    c.language    ?? '',
                                   description: c.description ?? '',
                                 }))
                               : prev.experienceCredits,
          castingCallId:     cc.id ?? a.casting_call_id ?? prev.castingCallId,
          rating:            ap.average_rating ?? prev.rating,
          reviews:           ap.total_reviews  ?? prev.reviews,
          views:             ap.profile_views  ? String(ap.profile_views) : prev.views,
          skills:            Array.isArray(ap.skills) && ap.skills.length > 0 ? ap.skills
                               : Array.isArray(ap.social_links?.skills) ? ap.social_links.skills
                               : Array.isArray(ap.specializations) && ap.specializations.length > 0 ? ap.specializations
                               : prev.skills,
          coverLetter:       a.cover_letter ?? a.notes ?? ap.about_me ?? prev.coverLetter,
          reqRole:           cc.role_name ?? prev.reqRole,
          reqGender:         cc.gender_preference ?? prev.reqGender,
          reqAgeRange:       cc.age_min && cc.age_max ? `${cc.age_min} – ${cc.age_max} Years` : prev.reqAgeRange,
          reqHeight:         cc.height_min && cc.height_max ? `${cc.height_min} – ${cc.height_max} cm` : prev.reqHeight,
          reqLanguage:       Array.isArray(cc.languages_required) ? cc.languages_required.join(', ') : prev.reqLanguage,
          reqExperience:     cc.experience_level ?? prev.reqExperience,
          // Media from aspirant_media
          media:             Array.isArray(ap.aspirant_media) && ap.aspirant_media.length > 0
                               ? ap.aspirant_media.map((m: any) => ({
                                   title:    m.title ?? m.document_type ?? (m.type === 'document' ? 'Document' : m.type === 'image' ? 'Photo' : 'Video'),
                                   type:     m.type === 'document' ? 'DOCUMENT' : m.type === 'video' ? 'VIDEO' : 'IMAGE',
                                   size:     m.file_size ? `${(m.file_size / (1024 * 1024)).toFixed(1)} MB` : '',
                                   duration: m.duration ?? undefined,
                                   img:      m.url ?? m.file_url ?? MEDIA_IMGS[0],
                                 }))
                               : prev.media,
        }));
        setAppStatus(statusMap[a.status] ?? app.status);

        // Fetch aspirant's full profile separately to get media + skills
        const apId = ap.id ?? a.aspirant_id ?? a.aspirant_profile_id;
        if (apId) {
          fetch(`/api/talents/${apId}`, { headers: { Authorization: `Bearer ${token}` } })
            .then(r => r.ok ? r.json() : null)
            .then(tData => {
              if (!tData) return;
              const t = tData.data?.talent ?? tData.talent ?? tData;
              setApp(prev => ({
                ...prev,
                skills: Array.isArray(t.skills) && t.skills.length > 0 ? t.skills
                  : Array.isArray(t.specializations) && t.specializations.length > 0 ? t.specializations
                  : prev.skills,
                media: Array.isArray(t.aspirant_media) && t.aspirant_media.length > 0
                  ? t.aspirant_media.map((m: any) => ({
                      title:    m.title ?? m.document_type ?? (m.type === 'document' ? 'Document' : m.type === 'image' ? 'Photo' : 'Video'),
                      type:     m.type === 'document' ? 'DOCUMENT' : m.type === 'video' ? 'VIDEO' : 'IMAGE',
                      size:     m.file_size ? `${(m.file_size / (1024 * 1024)).toFixed(1)} MB` : '',
                      duration: m.duration ?? undefined,
                      img:      m.url ?? m.file_url ?? '',
                    }))
                  : prev.media,
              }));
            }).catch(() => {});
        }
      })
      .catch(() => {});
  }, [id]);

  const saveNote = () => {
    if (note.trim()) { setNotesSaved(p => [...p, note.trim()]); setNote(''); }
  };

  const TABS = [
    { key: 'application', label: 'Application' },
    { key: 'audition',    label: 'Audition' },
    { key: 'documents',   label: `Documents (${app.media.filter(m => m.type === 'DOCUMENT').length + (app.portfolioLink ? 1 : 0)})` },
    { key: 'messages',    label: 'Messages' },
    { key: 'notes',       label: 'Notes' },
    { key: 'activity',    label: 'Activity Log' },
  ] as const;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: BG, fontFamily: BARLOW, color: '#F5F5F5' }}>

      {/* ── Select Confirmation Modal ── */}
      {showSelectConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.12)', borderRadius: 14, padding: '28px 24px', width: '100%', maxWidth: 420 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 20 }}>🎬</span>
              </div>
              <div style={{ fontFamily: BEBAS, fontSize: 22, letterSpacing: 0.5, color: '#fff' }}>Select this Aspirant?</div>
            </div>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', fontFamily: BARLOW, lineHeight: 1.6, marginBottom: 8 }}>
              You are about to select <strong style={{ color: '#fff' }}>{app.name}</strong> for the role of <strong style={{ color: '#fff' }}>{app.roleApplied}</strong>.
            </p>
            <p style={{ fontSize: 15, color: '#FBBF24', fontFamily: BARLOW, lineHeight: 1.6, marginBottom: 20 }}>
              ⚠️ This will automatically <strong>close the casting call</strong> "{app.castingCall}" since one role per casting call applies. No further applications will be accepted.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setShowSelectConfirm(false)} style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', borderRadius: 8, padding: '11px 0', fontSize: 15, fontWeight: 600, fontFamily: BARLOW, cursor: 'pointer' }}>
                Cancel
              </button>
              <button onClick={() => applyStatusChange('Selected')} disabled={statusUpdating} style={{ flex: 2, background: statusUpdating ? 'rgba(34,197,94,0.4)' : '#22C55E', border: 'none', color: '#000', borderRadius: 8, padding: '11px 0', fontSize: 16, fontWeight: 700, fontFamily: BARLOW, cursor: statusUpdating ? 'not-allowed' : 'pointer' }}>
                {statusUpdating ? 'Processing...' : 'Yes, Select & Close Casting'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ TOPNAV ══ */}
      <header style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0, padding: '0 24px', height: 60, background: BG2, borderBottom: '1px solid rgba(255,255,255,0.06)', zIndex: 100 }}>
        <SilverScreensLogo size="md" href="/agency/dashboard" showTagline={false} />
        <div style={{ flex: 1 }} />
        <button onClick={() => router.push('/agency/create-casting')} style={{ display: 'flex', alignItems: 'center', gap: 7, background: RED, color: '#fff', border: 'none', borderRadius: 8, padding: '0 18px', height: 36, fontSize: 16, fontWeight: 700, fontFamily: BARLOW, cursor: 'pointer', whiteSpace: 'nowrap' }}>
          Post a Casting <span style={{ fontSize: 17, fontWeight: 400 }}>+</span>
        </button>
        <div onClick={() => router.push('/agency/messages')} style={{ position: 'relative', cursor: 'pointer' }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MessageSquare size={15} color="rgba(255,255,255,0.7)" />
          </div>
          {msgCount > 0 && <div style={{ position: 'absolute', top: -5, right: -5, background: RED, borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff', pointerEvents: 'none' }}>{msgCount}</div>}
        </div>
        <div onClick={() => router.push('/agency/notifications')} style={{ position: 'relative', cursor: 'pointer' }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bell size={15} color="rgba(255,255,255,0.7)" />
          </div>
          {notifCount > 0 && <div style={{ position: 'absolute', top: -5, right: -5, background: RED, borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff', pointerEvents: 'none' }}>{notifCount}</div>}
        </div>
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer' }} onClick={() => setProfileOpen(v => !v)}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#1a1410,#2a1e0e)', border: `2px solid ${GOLD}60`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 800, color: GOLD, fontFamily: BEBAS, overflow: 'hidden' }}>
                {app.agencyLogoUrl ? <img src={app.agencyLogoUrl} alt={agencyInitials} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} /> : agencyInitials}
              </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.2 }}>{agencyName}</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>{agencyType}</div>
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

                {[
                  { label: 'Reports & Analytics', href: '/agency/reports' },
                  { label: 'Subscription & Billing', href: '/agency/subscription' },
                  { label: 'Company Profile', href: '/agency-profile' },
                  { label: 'Documents', href: '/agency/documents' },
                  { label: 'Calendar', href: '/agency/calendar' },
                  { label: 'Settings', href: '/agency/settings' },
                  { label: 'Support', href: '/agency/support' },
                  { label: 'Logout', href: '/login' },
                ].map(({ label, href }) => (
                  <div key={label} onClick={() => { if (label === 'Logout') { localStorage.removeItem('ss_user'); window.location.replace('/login'); } else { router.push(href); setProfileOpen(false); } }} style={{ padding: '10px 16px', fontSize: 16, cursor: 'pointer', color: label === 'Logout' ? '#ff6b6b' : '#F5F5F5', borderTop: label === 'Logout' ? '1px solid rgba(255,255,255,0.07)' : 'none' }}
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
              <div style={{ width: 38, height: 38, borderRadius: 9, background: 'linear-gradient(135deg,#1a1410,#2a1e0e)', border: `1px solid ${GOLD}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 800, color: GOLD, fontFamily: BEBAS, flexShrink: 0, overflow: 'hidden' }}>
                {app.agencyLogoUrl ? <img src={app.agencyLogoUrl} alt={agencyInitials} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} /> : agencyInitials}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#F5F5F5', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{agencyName}</div>
                <div onClick={() => router.push('/agency-profile')} style={{ fontSize: 14, color: RED, fontWeight: 600, cursor: 'pointer' }}>View Company Profile</div>
              </div>
            </div>
          )}
          <nav style={{ flex: 1, padding: sidebarOpen ? '8px 6px' : '8px 4px', overflowY: 'auto', scrollbarWidth: 'none' }}>
            {NAV_ITEMS.map(({ icon: Icon, label, active, href }) => {
                const badge = label === 'Messages' ? (msgCount > 0 ? msgCount : undefined) : label === 'Notifications' ? (notifCount > 0 ? notifCount : undefined) : undefined;
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
              <div style={{ fontSize: 16, fontWeight: 700, color: GOLD, marginBottom: 3 }}>Upgrade to Pro</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 10, lineHeight: 1.5 }}>Unlock advanced filters and AI matching.</div>
              <button onClick={() => router.push('/agency/subscription')} style={{ width: '100%', background: GOLD, color: '#000', border: 'none', borderRadius: 8, padding: '7px 0', fontSize: 14, fontWeight: 700, fontFamily: BARLOW, cursor: 'pointer' }}>Upgrade Now</button>
            </div>
          )}
        </aside>

        {/* ══ MAIN 3-COL LAYOUT ══ */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

          {/* ── LEFT PANEL ── */}
          <div style={{ width: 230, flexShrink: 0, background: BG2, borderRight: '1px solid rgba(255,255,255,0.06)', overflowY: 'auto', scrollbarWidth: 'none', display: 'flex', flexDirection: 'column' }}>

            {/* Back */}
            <div onClick={() => router.push('/agency/applications')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '14px 16px 10px', fontSize: 14, color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontWeight: 600 }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
            ><ChevronLeft size={14} /> Back to Applications</div>

            {/* Photo */}
            <div style={{ position: 'relative', margin: '0 14px 12px' }}>
              <div style={{ width: '100%', aspectRatio: '3/4', borderRadius: 12, overflow: 'hidden', background: BG3 }}>
                <img src={app.img} alt={app.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
              </div>
              <div onClick={() => router.push('/agency/saved-talents')} style={{ position: 'absolute', top: 10, right: 10, width: 28, height: 28, borderRadius: 6, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                onMouseEnter={e => (e.currentTarget.style.background = `${GOLD}50`)}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.55)')}
              ><Bookmark size={13} color="rgba(255,255,255,0.8)" /></div>
            </div>

            {/* Name + meta */}
            <div style={{ padding: '0 16px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
                <span style={{ fontSize: 18, fontFamily: BEBAS, letterSpacing: 1, color: '#fff' }}>{app.name}</span>
                {app.verified && <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="8" fill="#3b82f6"/><path d="M5 8l2 2 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>{app.category} · {app.gender} · {app.age} Years</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>
                <MapPin size={11} color="rgba(255,255,255,0.35)" /> {app.location}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 14, color: '#fff' }}>
                  <Star size={12} color={GOLD} fill={GOLD} /> {app.rating} <span style={{ color: 'rgba(255,255,255,0.4)' }}>({app.reviews})</span>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>
                  <Eye size={12} color="rgba(255,255,255,0.4)" /> {app.views}
                </span>
              </div>
            </div>

            {/* CTA buttons */}
            <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <button onClick={() => router.push(`/agency/talent/${app.aspirantProfileId || app.id}`)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'none', border: `1px solid ${GOLD}`, borderRadius: 8, padding: '9px 0', color: GOLD, fontSize: 15, fontFamily: BARLOW, fontWeight: 700, cursor: 'pointer', width: '100%' }}>
                <Eye size={14} color={GOLD} /> View Full Profile
              </button>
              <button onClick={() => router.push(`/agency/messages?recipient_id=${app.aspirantProfileId}&recipient_name=${encodeURIComponent(app.name)}`)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'none', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: '9px 0', color: 'rgba(255,255,255,0.7)', fontSize: 15, fontFamily: BARLOW, fontWeight: 500, cursor: 'pointer', width: '100%' }}>
                <MessageSquare size={14} /> Contact Aspirant
              </button>
            </div>

            {/* Application Status */}
            <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>Application Status</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: STATUS_COLORS[appStatus], background: `${STATUS_COLORS[appStatus]}18`, border: `1px solid ${STATUS_COLORS[appStatus]}55`, borderRadius: 20, padding: '2px 10px' }}>{appStatus}</span>
              </div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>
                Applied on <span style={{ color: '#fff', fontWeight: 600 }}>{app.appliedOn}, {app.appliedTime}</span>
              </div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>
                Application ID: <span style={{ color: 'rgba(255,255,255,0.7)' }}>{app.appId}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 4 }}>
                Actions {statusUpdating && <span style={{ fontSize: 13, color: GOLD, fontWeight: 400, marginLeft: 8 }}>Updating...</span>}
              </div>
              <button onClick={() => handleStatusChange('Selected')} disabled={statusUpdating || appStatus === 'Selected'} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: appStatus === 'Selected' ? 'rgba(34,197,94,0.15)' : '#22C55E', border: `1px solid ${GREEN}`, borderRadius: 8, padding: '9px 0', color: appStatus === 'Selected' ? GREEN : '#000', fontSize: 15, fontFamily: BARLOW, fontWeight: 700, cursor: statusUpdating || appStatus === 'Selected' ? 'default' : 'pointer', width: '100%', opacity: statusUpdating ? 0.6 : 1 }}>
                {appStatus === 'Selected' ? '✓ Selected' : '🎬 Select for Role'}
              </button>
              <button onClick={() => handleStatusChange('Shortlisted')} disabled={statusUpdating} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: appStatus === 'Shortlisted' ? 'rgba(34,197,94,0.15)' : 'none', border: `1px solid ${GREEN}`, borderRadius: 8, padding: '9px 0', color: GREEN, fontSize: 15, fontFamily: BARLOW, fontWeight: 700, cursor: statusUpdating ? 'default' : 'pointer', width: '100%', opacity: statusUpdating ? 0.6 : 1 }}>
                <Check size={14} /> {appStatus === 'Shortlisted' ? '✓ Shortlisted' : 'Shortlist'}
              </button>
              <button onClick={() => handleStatusChange('In Review')} disabled={statusUpdating} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: appStatus === 'In Review' ? `${GOLD}15` : 'none', border: `1px solid ${GOLD}`, borderRadius: 8, padding: '9px 0', color: GOLD, fontSize: 15, fontFamily: BARLOW, fontWeight: 500, cursor: statusUpdating ? 'default' : 'pointer', width: '100%', opacity: statusUpdating ? 0.6 : 1 }}>
                Move to Review
              </button>
              <button onClick={() => handleStatusChange('Rejected')} disabled={statusUpdating} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: appStatus === 'Rejected' ? 'rgba(200,32,42,0.15)' : 'none', border: `1px solid ${RED}`, borderRadius: 8, padding: '9px 0', color: RED, fontSize: 15, fontFamily: BARLOW, fontWeight: 500, cursor: statusUpdating ? 'default' : 'pointer', width: '100%', opacity: statusUpdating ? 0.6 : 1 }}>
                <X size={14} /> Reject Application
              </button>
              {/* More Actions */}
              <div style={{ position: 'relative' }}>
                <button onClick={() => setMoreOpen(v => !v)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'none', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '9px 0', color: 'rgba(255,255,255,0.6)', fontSize: 15, fontFamily: BARLOW, fontWeight: 500, cursor: 'pointer', width: '100%' }}>
                  ···  More Actions
                </button>
                {moreOpen && (
                  <>
                    <div onClick={() => setMoreOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 50 }} />
                    <div style={{ position: 'absolute', bottom: '110%', left: 0, right: 0, background: BG4, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, overflow: 'hidden', zIndex: 100, boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
                      {[
                        { label: 'Schedule Audition', onClick: () => { router.push(`/agency/auditions/schedule?applicationId=${id}`); setMoreOpen(false); } },
                        { label: 'Save to Talent Pool', onClick: () => { router.push('/agency/saved-talents'); setMoreOpen(false); } },
                        { label: 'View Talent Profile', onClick: () => { router.push(`/agency/talent/${app.aspirantProfileId}`); setMoreOpen(false); } },
                        { label: 'Download Application', onClick: () => setMoreOpen(false) },
                      ].map(({ label, onClick }) => (
                        <div key={label} onClick={onClick} style={{ padding: '9px 14px', fontSize: 15, fontFamily: BARLOW, cursor: 'pointer', color: '#F5F5F5' }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        >{label}</div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* ── CENTRE PANEL ── */}
          <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none', minWidth: 0 }}>

            {/* Header */}
            <div style={{ padding: '16px 24px 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 20, fontFamily: BEBAS, letterSpacing: 1, color: '#fff', marginBottom: 3 }}>Application Details</div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)' }}>Review and manage this application</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <button onClick={() => prevId && router.push(`/agency/applications/${prevId}`)} disabled={!prevId} style={{ display: 'flex', alignItems: 'center', gap: 4, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, padding: '6px 12px', fontSize: 14, fontFamily: BARLOW, color: prevId ? '#fff' : 'rgba(255,255,255,0.25)', cursor: prevId ? 'pointer' : 'default' }}>
                  <ChevronLeft size={13} /> Previous
                </button>
                <button onClick={() => nextId && router.push(`/agency/applications/${nextId}`)} disabled={!nextId} style={{ display: 'flex', alignItems: 'center', gap: 4, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, padding: '6px 12px', fontSize: 14, fontFamily: BARLOW, color: nextId ? '#fff' : 'rgba(255,255,255,0.25)', cursor: nextId ? 'pointer' : 'default' }}>
                  Next <ChevronRight size={13} />
                </button>
              </div>
            </div>

            {/* Casting call card */}
            <div style={{ margin: '10px 24px 0', background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '14px 16px' }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 12 }}>
                <img src={app.castingCallPoster} alt="" style={{ width: 72, height: 96, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 4, textTransform: 'uppercase' as const, letterSpacing: 0.5 }}>Casting Call</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 18, fontFamily: BEBAS, letterSpacing: 1, color: '#fff' }}>{app.castingCall}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: GREEN, background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 20, padding: '2px 8px' }}>{app.castingCallStatus}</span>
                  </div>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)' }}>{app.projectType} · {app.productionHouse}</div>
                </div>
              </div>
              {/* Metadata row */}
              <div style={{ display: 'flex', gap: 0, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 10 }}>
                {[
                  { icon: <FileText size={12} color="rgba(255,255,255,0.4)" />, label: 'Role Applied For', value: app.roleApplied, badge: true },
                  { icon: <Activity size={12} color="rgba(255,255,255,0.4)" />, label: 'Project Type', value: app.projectType },
                  { icon: <MapPin size={12} color="rgba(255,255,255,0.4)" />, label: 'Shoot Location', value: app.shootLocation },
                  { icon: <Star size={12} color="rgba(255,255,255,0.4)" />, label: 'Applied On', value: `${app.appliedOn}, ${app.appliedTime}` },
                ].map(({ icon, label, value, badge }, i) => (
                  <div key={label} style={{ flex: 1, paddingRight: 12, borderRight: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none', paddingLeft: i > 0 ? 12 : 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>{icon} {label}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{value}</span>
                      {badge && <span style={{ fontSize: 14, fontWeight: 700, color: PURPLE, background: `${PURPLE}20`, border: `1px solid ${PURPLE}50`, borderRadius: 10, padding: '1px 6px' }}>Lead Role</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 0, borderBottom: '1px solid rgba(255,255,255,0.07)', margin: '10px 24px 0', position: 'sticky', top: 0, background: BG, zIndex: 10 }}>
              {TABS.map(tab => {
                const active = activeTab === tab.key;
                return (
                  <div key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ padding: '8px 14px', cursor: 'pointer', borderBottom: active ? `2px solid ${GOLD}` : '2px solid transparent', marginBottom: -1 }}>
                    <span style={{ fontSize: 15, fontFamily: BARLOW, fontWeight: active ? 700 : 500, color: active ? GOLD : 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap' }}>{tab.label}</span>
                  </div>
                );
              })}
            </div>

            <div style={{ padding: '14px 24px 32px' }}>

              {/* ── APPLICATION TAB ── */}
              {activeTab === 'application' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

                  {/* About / Cover Letter */}
                  {app.coverLetter && (
                    <CentreCard title="About / Cover Letter">
                      <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, margin: 0 }}>{app.coverLetter}</p>
                    </CentreCard>
                  )}

                  {/* About Me */}
                  {app.aboutMe && (
                    <CentreCard title="About Me">
                      <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, margin: 0 }}>{app.aboutMe}</p>
                    </CentreCard>
                  )}

                  {/* Available For */}
                  {app.availabilityFor.length > 0 && (
                    <CentreCard title="Available For">
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {app.availabilityFor.map((a: string) => (
                          <span key={a} style={{ fontSize: 14, color: GREEN, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 20, padding: '5px 14px' }}>{a}</span>
                        ))}
                      </div>
                    </CentreCard>
                  )}

                  {/* Experience & Credits */}
                  {app.experienceCredits.length > 0 && (
                    <CentreCard title={`Experience & Credits (${app.experienceCredits.length})`}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                        {app.experienceCredits.map((c, i, arr) => (
                          <div key={i} style={{ padding: '16px 0', borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                              <div>
                                {c.role && <div style={{ fontSize: 17, fontWeight: 700, color: '#fff', letterSpacing: 0.5 }}>{c.role.toUpperCase()}</div>}
                                {c.title && <div style={{ fontSize: 15, color: GOLD, fontWeight: 600 }}>{c.title}</div>}
                                {c.character && <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)' }}>as <strong style={{ color: '#fff' }}>{c.character}</strong></div>}
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                                {c.year && <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{c.year}</span>}
                                {c.type && <span style={{ fontSize: 12, color: GOLD, background: `${GOLD}15`, border: `1px solid ${GOLD}30`, borderRadius: 20, padding: '2px 10px' }}>{c.type}</span>}
                              </div>
                            </div>
                            {(c.director || c.production || c.platform || c.language) && (
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 24px', marginBottom: 6 }}>
                                {c.director && <div style={{ fontSize: 14 }}><span style={{ color: 'rgba(255,255,255,0.4)' }}>Director: </span><strong style={{ color: '#fff' }}>{c.director}</strong></div>}
                                {c.production && <div style={{ fontSize: 14 }}><span style={{ color: 'rgba(255,255,255,0.4)' }}>Production: </span><strong style={{ color: '#fff' }}>{c.production}</strong></div>}
                                {c.platform && <div style={{ fontSize: 14 }}><span style={{ color: 'rgba(255,255,255,0.4)' }}>Platform: </span><strong style={{ color: '#fff' }}>{c.platform}</strong></div>}
                                {c.language && <div style={{ fontSize: 14 }}><span style={{ color: 'rgba(255,255,255,0.4)' }}>Language: </span><strong style={{ color: '#fff' }}>{c.language}</strong></div>}
                              </div>
                            )}
                            {c.description && <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>{c.description}</div>}
                          </div>
                        ))}
                      </div>
                    </CentreCard>
                  )}

                  {/* Personal Details */}
                  <CentreCard title="Personal Details">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0 }}>
                      {[
                        { label: 'Date of Birth',  value: app.dob },
                        { label: 'Gender',         value: app.gender },
                        { label: 'Age',            value: app.age ? `${app.age} Years` : '' },
                        { label: 'Category',       value: app.category },
                        { label: 'Role',           value: app.role },
                        { label: 'Experience',     value: app.experience },
                        { label: 'Location',       value: app.location },
                        { label: 'Languages',      value: app.languages },
                        { label: 'Availability',   value: app.availability, color: app.availability === 'Available Now' ? GREEN : GOLD },
                      ].filter(r => r.value).map(({ label, value, color }, i, arr) => (
                        <div key={label} style={{ padding: '10px 12px', borderBottom: i < arr.length - 3 ? '1px solid rgba(255,255,255,0.05)' : 'none', borderRight: i % 3 !== 2 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginBottom: 3, textTransform: 'uppercase' as const, letterSpacing: 0.4 }}>{label}</div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: color || '#fff' }}>{value}</div>
                        </div>
                      ))}
                    </div>
                  </CentreCard>

                  {/* Physical Attributes */}
                  <CentreCard title="Physical Attributes">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }}>
                      {[
                        { label: 'Height',     value: app.height },
                        { label: 'Weight',     value: app.weight },
                        { label: 'Chest',      value: app.chest },
                        { label: 'Waist',      value: app.waist },
                        { label: 'Hip',        value: app.hip },
                        { label: 'Shoe Size',  value: app.shoe },
                        { label: 'Hair Color', value: app.hairColor },
                        { label: 'Eye Color',  value: app.eyeColor },
                        { label: 'Complexion', value: app.complexion },
                        { label: 'Body Type',  value: app.bodyType },
                      ].filter(r => r.value).map(({ label, value }, i, arr) => (
                        <div key={label} style={{ padding: '10px 12px', borderBottom: i < arr.length - 4 ? '1px solid rgba(255,255,255,0.05)' : 'none', borderRight: i % 4 !== 3 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginBottom: 3, textTransform: 'uppercase' as const, letterSpacing: 0.4 }}>{label}</div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{value}</div>
                        </div>
                      ))}
                    </div>
                  </CentreCard>

                  {/* Skills */}
                  <CentreCard title="Skills">
                    {app.skills.length === 0 ? (
                      <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.35)', margin: 0 }}>No skills listed.</p>
                    ) : (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {app.skills.map(s => (
                          <span key={s} style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '5px 14px' }}>{s}</span>
                        ))}
                      </div>
                    )}
                  </CentreCard>

                  {/* Application Specifics */}
                  {(app.joiningDate || app.travel || app.portfolioLink) && (
                    <CentreCard title="Application Details">
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 0 }}>
                        {[
                          { label: 'Expected Joining', value: app.joiningDate },
                          { label: 'Travel',           value: app.travel },
                          { label: 'Portfolio Link',   value: app.portfolioLink, link: true },
                        ].filter(r => r.value).map(({ label, value, link }, i, arr) => (
                          <div key={label} style={{ padding: '10px 12px', borderBottom: i < arr.length - 2 ? '1px solid rgba(255,255,255,0.05)' : 'none', borderRight: i % 2 === 0 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginBottom: 3, textTransform: 'uppercase' as const, letterSpacing: 0.4 }}>{label}</div>
                            <div style={{ fontSize: 14, fontWeight: 600, color: link ? GOLD : '#fff', textDecoration: link ? 'underline' : 'none', cursor: link ? 'pointer' : 'default' }}
                              onClick={() => link && app.portfolioLink && window.open(app.portfolioLink.startsWith('http') ? app.portfolioLink : `https://${app.portfolioLink}`, '_blank')}
                            >{value}</div>
                          </div>
                        ))}
                      </div>
                    </CentreCard>
                  )}

                  {/* Social Links */}
                  {app.socialLinks && Object.values(app.socialLinks).some(v => v && !['credits'].includes(Object.keys(app.socialLinks)[Object.values(app.socialLinks).indexOf(v)])) && (
                    <CentreCard title="Social Links">
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {Object.entries(app.socialLinks).filter(([k, v]) => v && k !== 'credits' && typeof v === 'string').map(([k, v]) => (
                          <a key={k} href={String(v).startsWith('http') ? String(v) : `https://${v}`} target="_blank" rel="noreferrer"
                            style={{ fontSize: 14, color: BLUE, background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: 20, padding: '5px 14px', textDecoration: 'none', textTransform: 'capitalize' as const }}>
                            {k} ↗
                          </a>
                        ))}
                      </div>
                    </CentreCard>
                  )}
                </div>
              )}

              {/* ── AUDITION TAB ── */}
              {activeTab === 'audition' && (
                <CentreCard title="Audition Details">
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 40px' }}>
                    {[
                      { label: 'Audition Date',     value: app.auditionDate },
                      { label: 'Audition Time',     value: app.auditionTime },
                      { label: 'Format',            value: app.auditionFormat },
                      { label: 'Location',          value: app.auditionLocation },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 3 }}>{label}</div>
                        <div style={{ fontSize: 16, fontWeight: 500, color: '#fff' }}>{value}</div>
                      </div>
                    ))}
                  </div>
                  {app.auditionNotes && (
                    <div style={{ marginTop: 18, padding: '14px 16px', background: `${GOLD}08`, border: `1px solid ${GOLD}25`, borderRadius: 10 }}>
                      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 5 }}>Special Instructions</div>
                      <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.75)', lineHeight: 1.6 }}>{app.auditionNotes}</div>
                    </div>
                  )}
                  <div style={{ marginTop: 16 }}>
                    <button onClick={() => router.push(`/agency/auditions/schedule?applicationId=${id}`)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: RED, border: 'none', borderRadius: 8, padding: '10px 20px', color: '#fff', fontSize: 15, fontFamily: BARLOW, fontWeight: 700, cursor: 'pointer' }}>
                      <CalendarCheck size={14} /> Schedule / Update Audition
                    </button>
                  </div>
                </CentreCard>
              )}

              {/* ── DOCUMENTS TAB ── */}
              {activeTab === 'documents' && (
                <CentreCard title="Submitted Documents">
                  {(() => {
                    const docs = app.media.filter(m => m.type === 'DOCUMENT');
                    if (docs.length === 0) return (
                      <div style={{ textAlign: 'center', padding: '30px 0', color: 'rgba(255,255,255,0.35)', fontSize: 15 }}>No documents submitted.</div>
                    );
                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {docs.map((doc, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 14px', background: BG3, borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div style={{ width: 32, height: 32, borderRadius: 6, background: `${GOLD}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <FileText size={14} color={GOLD} />
                              </div>
                              <div>
                                <div style={{ fontSize: 15, color: '#fff', fontWeight: 500 }}>{doc.title || `Document ${i + 1}`}</div>
                                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)' }}>{doc.size || 'Document'}</div>
                              </div>
                            </div>
                            <button onClick={() => doc.img && window.open(doc.img, '_blank')} style={{ background: 'none', border: `1px solid ${GOLD}40`, borderRadius: 6, padding: '5px 12px', color: GOLD, fontSize: 14, fontFamily: BARLOW, cursor: 'pointer' }}>View</button>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </CentreCard>
              )}

              {/* ── MESSAGES TAB ── */}
              {activeTab === 'messages' && (
                <CentreCard title="Messages">
                  <div style={{ textAlign: 'center', padding: '30px 0' }}>
                    <MessageSquare size={36} color="rgba(255,255,255,0.15)" style={{ marginBottom: 12 }} />
                    <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.4)', marginBottom: 16 }}>No messages yet with this applicant.</div>
                    <button onClick={() => router.push(`/agency/messages?recipient_id=${app.aspirantProfileId}&recipient_name=${encodeURIComponent(app.name)}`)} style={{ background: RED, border: 'none', borderRadius: 8, padding: '9px 20px', color: '#fff', fontSize: 15, fontFamily: BARLOW, fontWeight: 700, cursor: 'pointer' }}>Start a Conversation</button>
                  </div>
                </CentreCard>
              )}

              {/* ── NOTES TAB ── */}
              {activeTab === 'notes' && (
                <CentreCard title="Notes">
                  <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Add a note about this application..." rows={4} style={{ width: '100%', background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '12px 14px', color: '#fff', fontSize: 15, fontFamily: BARLOW, outline: 'none', resize: 'vertical' as const, boxSizing: 'border-box' as const, marginBottom: 10 }} />
                  <button onClick={saveNote} style={{ background: RED, border: 'none', borderRadius: 8, padding: '9px 20px', color: '#fff', fontSize: 15, fontFamily: BARLOW, fontWeight: 700, cursor: 'pointer' }}>Save Note</button>
                  {notesSaved.length > 0 && (
                    <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {notesSaved.map((n, i) => (
                        <div key={i} style={{ background: BG3, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: '12px 14px', fontSize: 15, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>{n}</div>
                      ))}
                    </div>
                  )}
                </CentreCard>
              )}

              {/* ── ACTIVITY LOG TAB ── */}
              {activeTab === 'activity' && (
                <CentreCard title="Activity Log">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                    {[
                      { color: BLUE,  text: `Applied for "${app.castingCall}" as ${app.roleApplied}`, time: `${app.appliedOn}, ${app.appliedTime}`, badge: 'New', badgeColor: BLUE },
                      { color: GOLD,  text: `Application viewed by ${agencyName}`,              time: app.appliedOn },
                      { color: GREEN, text: 'Profile viewed',                                         time: app.appliedOn },
                    ].map((a, i, arr) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '13px 0', borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: a.color, flexShrink: 0, marginTop: 4 }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)', lineHeight: 1.5 }}>{a.text}</div>
                          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{a.time}</div>
                        </div>
                        {a.badge && <span style={{ fontSize: 14, fontWeight: 700, color: a.badgeColor, background: `${a.badgeColor}18`, border: `1px solid ${a.badgeColor}55`, borderRadius: 20, padding: '3px 10px', flexShrink: 0 }}>{a.badge}</span>}
                      </div>
                    ))}
                  </div>
                </CentreCard>
              )}
            </div>
          </div>

          {/* ── RIGHT PANEL ── */}
          <div style={{ width: 260, flexShrink: 0, overflowY: 'auto', scrollbarWidth: 'none', borderLeft: '1px solid rgba(255,255,255,0.06)', padding: '20px 18px', display: 'flex', flexDirection: 'column', gap: 18 }}>

            {/* Role Requirements */}
            <RPanel title="Role Requirements" action={<span onClick={() => app.castingCallId && router.push(`/agency/casting-calls/${app.castingCallId}`)} style={{ fontSize: 14, color: GOLD, cursor: app.castingCallId ? 'pointer' : 'default', opacity: app.castingCallId ? 1 : 0.4 }}>View Full Casting Call →</span>}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {[
                  { label: 'Role',       value: app.reqRole,       highlight: PURPLE },
                  { label: 'Gender',     value: app.reqGender },
                  { label: 'Age Range',  value: app.reqAgeRange },
                  { label: 'Height',     value: app.reqHeight },
                  { label: 'Language',   value: app.reqLanguage },
                  { label: 'Experience', value: app.reqExperience },
                ].map(({ label, value, highlight }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>{label}</span>
                    {highlight ? (
                      <span style={{ fontSize: 14, fontWeight: 700, color: highlight, background: `${highlight}20`, border: `1px solid ${highlight}50`, borderRadius: 10, padding: '2px 8px' }}>{value}</span>
                    ) : (
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{value}</span>
                    )}
                  </div>
                ))}
              </div>
            </RPanel>

            {/* Submitted Media */}
            <RPanel title="Submitted Media" action={<span onClick={() => router.push(`/agency/talent/${app.aspirantProfileId}`)} style={{ fontSize: 14, color: GOLD, cursor: 'pointer' }}>View All →</span>}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                {app.media.filter(m => m.type !== 'DOCUMENT').slice(0, 4).map((m, i) => (
                  <div key={i} style={{ borderRadius: 8, overflow: 'hidden', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.06)', transition: 'border-color 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = `${GOLD}50`)}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}
                  >
                    <div style={{ position: 'relative', height: 70 }}>
                      <img src={m.img} alt={m.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)' }} />
                      {m.duration && (
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Play size={9} color="#fff" fill="#fff" />
                          </div>
                        </div>
                      )}
                      {m.duration && <div style={{ position: 'absolute', bottom: 3, right: 4, fontSize: 14, color: '#fff', background: 'rgba(0,0,0,0.6)', borderRadius: 3, padding: '1px 4px' }}>{m.duration}</div>}
                    </div>
                    <div style={{ padding: '4px 6px', background: BG3 }}>
                      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.title}</div>
                      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)' }}>{m.type} · {m.size}</div>
                    </div>
                  </div>
                ))}
                {/* +N more tile */}
                {app.extraMedia > 0 && (
                  <div style={{ borderRadius: 8, overflow: 'hidden', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.06)', background: BG3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 90 }}>
                    <div style={{ fontSize: 18, fontFamily: BEBAS, color: '#fff', letterSpacing: 1 }}>+{app.extraMedia}</div>
                    <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)' }}>More Files</div>
                  </div>
                )}
              </div>
            </RPanel>

            {/* Application Notes */}
            <RPanel title="Application Notes" action={<span onClick={() => setActiveTab('notes')} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 14, color: GOLD, cursor: 'pointer' }}><Edit2 size={11} color={GOLD} /> Add Note</span>}>
              <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Add a note about this application..." rows={3} style={{ width: '100%', background: BG3, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '10px 12px', color: '#fff', fontSize: 14, fontFamily: BARLOW, outline: 'none', resize: 'none' as const, boxSizing: 'border-box' as const, marginBottom: 8 }} />
              {notesSaved.length === 0 ? (
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>No notes added yet.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {notesSaved.map((n, i) => (
                    <div key={i} style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', background: BG3, borderRadius: 6, padding: '8px 10px', lineHeight: 1.5 }}>{n}</div>
                  ))}
                </div>
              )}
            </RPanel>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Helpers ─────────────────────────────────────────────────── */
function CentreCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, overflow: 'hidden' }}>
      {title && (
        <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <span style={{ fontSize: 16, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, color: '#fff' }}>{title}</span>
        </div>
      )}
      <div style={{ padding: '12px 16px' }}>{children}</div>
    </div>
  );
}

function RPanel({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div style={{ background: BG2, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12 }}>
      <div style={{ padding: '12px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 16, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, color: '#fff' }}>{title}</span>
        {action}
      </div>
      <div style={{ padding: '12px 14px 14px' }}>{children}</div>
    </div>
  );
}