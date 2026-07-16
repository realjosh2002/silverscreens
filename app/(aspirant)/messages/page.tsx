'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import SilverScreensLogo from '@/components/ui/SilverScreensLogo';
import {
  LayoutDashboard, FileText, MessageSquare, Mic2,
  Bookmark, Star, Bell, ChevronRight, ChevronDown, ChevronLeft, Menu,
  Search, Paperclip, Smile, Send, Phone, MoreVertical,
  Trash2, Archive, UserX, ArrowLeft, Check, Play, Filter,
  BadgeCheck, Info,
} from 'lucide-react';

/* ─── Design tokens — identical to dashboard / my-applications ── */
const RED    = '#C8202A';
const GOLD   = '#D4A64A';
const BG     = '#050505';
const BG2    = '#0B0F14';
const BG3    = '#121821';
const BG4    = '#1C2030';
const BARLOW = '"Barlow Condensed", sans-serif';
const MONT   = "'Barlow Condensed', sans-serif";

/* ─── Sidebar items — Messages active ───────────────────────── */
const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard',            href: '/dashboard' },
  { icon: FileText,        label: 'My Applications',      href: '/my-applications' },
  { icon: MessageSquare,   label: 'Messages',             href: '/messages',    badge: 2, active: true },
  { icon: Mic2,            label: 'Auditions',            href: '/auditions' },
  { icon: Bookmark,        label: 'Saved Castings',       href: '/saved-castings' },
  { icon: Star,            label: 'Recommended Castings', href: '/recommended' },
  { icon: Bell,            label: 'Notifications',        href: '/notifications', badge: 3 },
];

const dropdownLinks = ['Subscription', 'Analytics', 'Calendar', 'Settings', 'Support', 'Logout'];

/* ─── Conversation tabs ──────────────────────────────────────── */
const CONV_TABS = [
  { label: 'All',    badge: 12 },
  { label: 'Unread', badge: 3  },
  { label: 'Starred' },
];

/* ─── Types ──────────────────────────────────────────────────── */
type Conversation = {
  id: number; name: string; role?: string;
  avatarUrl?: string; initials: string; avatarBg: string;
  verified: boolean; preview: string; time: string;
  unread: number; starred: boolean; activeStatus: string;
};

type MsgItem = {
  id: number; sender: 'me' | 'them';
  text?: string;
  attachment?: { name: string; size: string; format: string; thumbUrl?: string };
  time: string; delivered: boolean;
};

type MsgGroup = { date: string; items: MsgItem[] };

/* ─── Conversations ──────────────────────────────────────────── */
const CONVERSATIONS: Conversation[] = [
  { id: 1, name: 'Dharma Productions',   initials: 'DP', avatarBg: '#1A3A5C', verified: true,
    preview: 'Regarding your application for City of Dreams – Lead Hero',
    time: '10:45 AM', unread: 2, starred: false, activeStatus: 'Active 1h ago' },
  { id: 2, name: 'Neha Kapoor',          role: 'Senior Casting Director',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612a381?w=80&h=80&fit=crop&crop=face',
    initials: 'NK', avatarBg: '#1A3A2C', verified: false,
    preview: "Hi Arjun, we'd like to schedule an audition for you...",
    time: 'Yesterday', unread: 1, starred: false, activeStatus: 'Active 3h ago' },
  { id: 3, name: 'Red Frame Studios',    initials: 'RF', avatarBg: '#3D1515', verified: false,
    preview: 'Regarding your application for The Silent Witness – Supporting',
    time: '21 May', unread: 0, starred: false, activeStatus: 'Active yesterday' },
  { id: 4, name: 'Dream Factory',        initials: 'DF', avatarBg: '#15153D', verified: false,
    preview: 'Thanks for showing interest in Love in Rewind',
    time: '20 May', unread: 0, starred: false, activeStatus: 'Active 2 days ago' },
  { id: 5, name: 'Karan Malhotra',       role: 'Casting Associate',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop&crop=face',
    initials: 'KM', avatarBg: '#2A1A3A', verified: false,
    preview: 'Can you share a recent video of your performance?',
    time: '18 May', unread: 0, starred: true, activeStatus: 'Active 4 days ago' },
  { id: 6, name: 'NextWave Originals',   initials: 'NW', avatarBg: '#0F2D2D', verified: false,
    preview: 'Invitation for audition – Rangbaaz: Dobara',
    time: '17 May', unread: 0, starred: false, activeStatus: 'Active last week' },
  { id: 7, name: 'SilverScreens Team',   initials: 'SS', avatarBg: '#3D0B0E', verified: false,
    preview: 'Welcome to SilverScreens! Here are some tips to get you started...',
    time: '15 May', unread: 0, starred: false, activeStatus: 'Official Account' },
];

/* ─── Messages per conversation ──────────────────────────────── */
const MESSAGES: Record<number, MsgGroup[]> = {
  1: [
    {
      date: '20 May 2024',
      items: [
        { id: 1, sender: 'them', delivered: true, time: '10:30 AM',
          text: 'Hi Arjun,\n\nThank you for applying for the role of Lead Hero in our feature film City of Dreams.\n\nWe have reviewed your profile and would like to move forward with your application. Please share a recent self-tape (2–3 mins) performing a dramatic scene.' },
        { id: 2, sender: 'me', delivered: true, time: '10:45 AM',
          text: 'Hi,\n\nThank you so much! Please find my self-tape attached.' },
        { id: 3, sender: 'me', delivered: true, time: '10:45 AM',
          attachment: { name: 'Arjun_Malhotra_SelfTape.mp4', size: '82.4 MB', format: 'MP4',
            thumbUrl: 'https://images.unsplash.com/photo-1598387993441-a364f854cfbd?w=120&h=80&fit=crop' } },
      ],
    },
    {
      date: '21 May 2024',
      items: [
        { id: 4, sender: 'them', delivered: true, time: '9:15 AM',
          text: "Great work, Arjun!\n\nWe'd like to invite you for a look test. Please confirm your availability." },
        { id: 5, sender: 'me', delivered: true, time: '9:20 AM',
          text: "Thank you! I'm available on 24th or 25th May." },
      ],
    },
  ],
  2: [
    {
      date: 'Yesterday',
      items: [
        { id: 1, sender: 'them', delivered: true, time: '2:30 PM',
          text: "Hi Arjun, we'd like to schedule an audition for you. Are you available this week for a screen test?" },
      ],
    },
  ],
  3: [
    {
      date: '21 May 2024',
      items: [
        { id: 1, sender: 'them', delivered: true, time: '3:15 PM',
          text: 'Regarding your application for The Silent Witness – Supporting Actor role. We will review your profile and get back to you soon.' },
      ],
    },
  ],
  4: [
    {
      date: '20 May 2024',
      items: [
        { id: 1, sender: 'them', delivered: true, time: '11:00 AM',
          text: 'Thanks for showing interest in Love in Rewind. We have received your application and will review it shortly.' },
      ],
    },
  ],
  5: [
    {
      date: '18 May 2024',
      items: [
        { id: 1, sender: 'them', delivered: true, time: '4:45 PM',
          text: 'Hi Arjun, can you share a recent video of your performance? It will help us evaluate your suitability for the role.' },
      ],
    },
  ],
  6: [
    {
      date: '17 May 2024',
      items: [
        { id: 1, sender: 'them', delivered: true, time: '10:00 AM',
          text: 'You have been invited for an audition for Rangbaaz: Dobara. Please confirm your availability for 22nd May 2024 at 3:00 PM.' },
      ],
    },
  ],
  7: [
    {
      date: '15 May 2024',
      items: [
        { id: 1, sender: 'them', delivered: true, time: '9:00 AM',
          text: "Welcome to SilverScreens! 🎬\n\nHere are some tips to get you started:\n• Complete your profile 100%\n• Upload a showreel\n• Apply to relevant casting calls\n\nGood luck with your career!" },
      ],
    },
  ],
};

/* ── Auth helper ── */
function getAuthHeaders(): Record<string, string> {
  try {
    const u = JSON.parse(localStorage.getItem('ss_user') || '{}');
    return u.token ? { Authorization: `Bearer ${u.token}` } : {};
  } catch { return {}; }
}

/* ── Normalise API conversation → Conversation shape ── */
function apiToConv(c: any, idx: number): Conversation {
  const other = c.otherParty ?? c.participant ?? {};
  const name  = other.name ?? c.name ?? `Conversation ${idx + 1}`;
  const initials = name.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase();
  const BG_COLORS = ['#1A3A5C','#1A3A2C','#3D1515','#15153D','#2A1A3A','#0F2D2D','#3D0B0E'];
  return {
    id:           c.id ?? c._id ?? idx,
    name,
    role:         other.role ?? c.role ?? undefined,
    avatarUrl:    other.profilePhoto ?? other.avatarUrl ?? c.avatarUrl ?? undefined,
    initials,
    avatarBg:     BG_COLORS[idx % BG_COLORS.length],
    verified:     other.verified ?? c.verified ?? false,
    preview:      c.lastMessage?.content ?? c.preview ?? c.lastMessageContent ?? '',
    time:         c.lastMessageAt
      ? new Date(c.lastMessageAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
      : c.time ?? '',
    unread:       c.unreadCount ?? c.unread ?? 0,
    starred:      c.starred ?? false,
    activeStatus: other.lastSeen
      ? `Active ${new Date(other.lastSeen).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit' })}`
      : c.activeStatus ?? 'Active recently',
  };
}

/* ── Normalise API messages → MsgGroup[] shape ── */
function apiToMsgGroups(messages: any[]): MsgGroup[] {
  if (!messages.length) return [];
  const grouped: Record<string, MsgItem[]> = {};
  messages.forEach((m: any, i: number) => {
    const d = m.createdAt ? new Date(m.createdAt) : new Date();
    const dateKey = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
    if (!grouped[dateKey]) grouped[dateKey] = [];
    grouped[dateKey].push({
      id:        m.id ?? m._id ?? i,
      sender:    m.isOwn ?? m.senderId === m.currentUserId ? 'me' : 'them',
      text:      m.content ?? m.text ?? undefined,
      attachment: m.attachment ?? undefined,
      time:      d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      delivered: m.delivered ?? m.status === 'delivered' ?? true,
    });
  });
  return Object.entries(grouped).map(([date, items]) => ({ date, items }));
}
export default function MessagesPage() {
  const router = useRouter();
  const [sidebarOpen,   setSidebarOpen]   = useState(false);
  const [activeConvId,  setActiveConvId]  = useState<number | null>(null);
  const [convTab,       setConvTab]       = useState(0);
  const [searchQuery,   setSearchQuery]   = useState('');
  const [messageText,   setMessageText]   = useState('');
  const [menuOpen,      setMenuOpen]      = useState(false);
  const [dropdownOpen,  setDropdownOpen]  = useState(false);
  const [starredConvs,  setStarredConvs]  = useState<Set<number>>(
    new Set(CONVERSATIONS.filter(c => c.starred).map(c => c.id))
  );

  /* ── Live data ── */
  const [conversations, setConversations] = useState<Conversation[]>(CONVERSATIONS);
  const [messageGroups, setMessageGroups] = useState<MsgGroup[]>([]);
  const [loadingMsgs,   setLoadingMsgs]   = useState(false);
  const [userName,      setUserName]      = useState('My Account');
  const [avatarUrl,     setAvatarUrl]     = useState('');
  const [notifCount,    setNotifCount]    = useState(3);

  const SB_W = sidebarOpen ? 210 : 56;

  const menuRef    = useRef<HTMLDivElement>(null);
  const dropRef    = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  /* ── Close dropdowns on outside click ── */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* ── Scroll to bottom when messages update ── */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConvId, messageGroups]);

  /* ── Load user identity instantly ── */
  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('ss_user') || '{}');
      if (u.name)         setUserName(u.name);
      if (u.profilePhoto) setAvatarUrl(u.profilePhoto);
    } catch {}
  }, []);

  /* ── Fetch conversations on mount ── */
  useEffect(() => {
    const h = getAuthHeaders();

    fetch('/api/messages/conversations', { headers: h })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        const list = data.data?.conversations ?? data.conversations ?? data;
        if (!Array.isArray(list) || list.length === 0) return;
        const normalised = list.map((c: any, i: number) => apiToConv(c, i));
        setConversations(normalised);
        setStarredConvs(new Set(normalised.filter((c: Conversation) => c.starred).map((c: Conversation) => c.id)));
        if (normalised.length > 0) setActiveConvId(normalised[0].id);
      })
      .catch(() => { setActiveConvId(CONVERSATIONS[0].id); });

    fetch('/api/notifications', { headers: h })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        const list = data.notifications ?? data;
        if (Array.isArray(list)) setNotifCount(list.filter((n: any) => !n.read && !n.isRead).length);
      }).catch(() => {});
  }, []);

  /* ── Fetch messages when active conversation changes ── */
  useEffect(() => {
    if (activeConvId === null) return;
    const h = getAuthHeaders();
    setLoadingMsgs(true);

    fetch(`/api/messages/${activeConvId}`, { headers: h })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) { setMessageGroups(MESSAGES[activeConvId as keyof typeof MESSAGES] ?? []); return; }
        const list = data.messages ?? data;
        if (!Array.isArray(list)) { setMessageGroups(MESSAGES[activeConvId as keyof typeof MESSAGES] ?? []); return; }
        setMessageGroups(apiToMsgGroups(list));
      })
      .catch(() => { setMessageGroups(MESSAGES[activeConvId as keyof typeof MESSAGES] ?? []); })
      .finally(() => setLoadingMsgs(false));
  }, [activeConvId]);

  const activeConv = conversations.find(c => c.id === activeConvId) ?? conversations[0] ?? CONVERSATIONS[0];

  /* ── Filter conversations by tab + search ── */
  const filteredConvs = useMemo(() => {
    let list = conversations;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(c => c.name.toLowerCase().includes(q) || c.preview.toLowerCase().includes(q));
    }
    if (convTab === 1) list = list.filter(c => c.unread > 0);
    if (convTab === 2) list = list.filter(c => starredConvs.has(c.id));
    return list;
  }, [convTab, searchQuery, starredConvs, conversations]);

  /* ── Live tab counts ── */
  const liveCounts = useMemo(() => ({
    all:     conversations.length,
    unread:  conversations.filter(c => c.unread > 0).length,
    starred: conversations.filter(c => starredConvs.has(c.id)).length,
  }), [conversations, starredConvs]);

  const toggleStar = (id: number) => {
    setStarredConvs(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  /* ── Send message — wired to POST /api/messages/send ── */
  const handleSend = async () => {
    if (!messageText.trim() || activeConvId === null) return;
    const text = messageText.trim();
    setMessageText('');

    // Optimistic UI
    const optimisticMsg: MsgItem = {
      id: Date.now(), sender: 'me', text, delivered: false,
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };
    const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
    setMessageGroups(prev => {
      const last = prev[prev.length - 1];
      if (last && last.date === today) return [...prev.slice(0, -1), { ...last, items: [...last.items, optimisticMsg] }];
      return [...prev, { date: today, items: [optimisticMsg] }];
    });
    setConversations(prev => prev.map(c =>
      c.id === activeConvId ? { ...c, preview: text, time: optimisticMsg.time } : c
    ));

    // POST to API
    try {
      const h = getAuthHeaders();
      const res = await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...h },
        body: JSON.stringify({ conversationId: activeConvId, content: text }),
      });
      if (res.ok) {
        setMessageGroups(prev => prev.map(group => ({
          ...group,
          items: group.items.map(m => m.id === optimisticMsg.id ? { ...m, delivered: true } : m),
        })));
      }
    } catch {}
  };

  /* Double-check mark for delivered messages */
  const DeliveredIcon = () => (
    <span style={{ display: 'inline-flex', gap: -3 }}>
      <Check size={12} strokeWidth={3} color="rgba(255,255,255,0.45)" />
      <Check size={12} strokeWidth={3} color="rgba(255,255,255,0.45)" style={{ marginLeft: -6 }} />
    </span>
  );

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100vh',
      overflow: 'hidden', background: BG, fontFamily: BARLOW, color: '#fff',
    }}>

      {/* ══ TOP NAVBAR ══ */}
      <header style={{
        display: 'flex', alignItems: 'center', gap: 16,
        padding: '0 24px', height: 60, flexShrink: 0,
        background: BG2, borderBottom: '1px solid rgba(255,255,255,0.07)',
        position: 'relative', zIndex: 100,
      }}>
        <SilverScreensLogo size="md" href="/" showTagline={false} />

        <div style={{ flex: 1 }} />

        {/* Find Casting Calls */}
        <button style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'transparent', border: `1px solid ${GOLD}`,
          color: GOLD, borderRadius: 8, padding: '0 18px', height: 36,
          fontSize: 15, fontWeight: 600, fontFamily: BARLOW, cursor: 'pointer',
        }}>+ Find Casting Calls</button>

        {/* Bell */}
        <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => router.push('/notifications')}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bell size={16} />
          </div>
          {notifCount > 0 && <div style={{ position: 'absolute', top: -5, right: -5, background: RED, borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700 }}>{notifCount}</div>}
        </div>

        {/* Messages */}
        <div style={{ position: 'relative', width: 36, height: 36, borderRadius: 8, background: `rgba(200,32,42,0.15)`, border: `1px solid ${RED}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <MessageSquare size={16} color={RED} />
          <div style={{ position: 'absolute', top: -5, right: -5, background: RED, borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700 }}>2</div>
        </div>

        {/* Avatar */}
        <div ref={dropRef} style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => setDropdownOpen(v => !v)}>
            <img src={avatarUrl} alt={userName}
              style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${GOLD}` }} />
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.2 }}>{userName}</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)' }}>Aspirant</div>
            </div>
            <ChevronRight size={12} color="rgba(255,255,255,0.4)" style={{ transform: 'rotate(90deg)' }} />
          </div>
          {dropdownOpen && (
            <div style={{ position: 'absolute', top: 46, right: 0, width: 190, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, overflow: 'hidden', zIndex: 200, boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}>
              {dropdownLinks.map(item => (
                <div key={item} style={{ padding: '10px 16px', fontSize: 16, cursor: 'pointer', color: item === 'Logout' ? '#ff6b6b' : '#fff', borderTop: item === 'Logout' ? '1px solid rgba(255,255,255,0.07)' : 'none' }}
                  onClick={() => {
                    if (item === 'Logout') { localStorage.removeItem('ss_user'); window.location.replace('/login'); }
                    else router.push(`/${item.toLowerCase()}`);
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >{item}</div>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* ══ BODY ══ */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* ── SIDEBAR — now collapsible ── */}
        <aside style={{ width: SB_W, flexShrink: 0, background: BG2, borderRight: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', overflowY: 'auto', overflowX: 'hidden', transition: 'width 0.2s ease' }}>
          {/* Toggle */}
          <div style={{ display: 'flex', justifyContent: sidebarOpen ? 'flex-end' : 'center', padding: sidebarOpen ? '10px 12px 0' : '10px 0 0', flexShrink: 0 }}>
            <button onClick={() => setSidebarOpen(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', width: 30, height: 30, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            >{sidebarOpen ? <ChevronLeft size={16} /> : <Menu size={16} />}</button>
          </div>

          <nav style={{ flex: 1, padding: '10px 0' }}>
            {sidebarItems.map(({ icon: Icon, label, active, badge, href }) => (
              <div key={label} title={!sidebarOpen ? label : undefined} style={{
                display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'space-between' : 'center',
                padding: sidebarOpen ? '9px 16px' : '10px 0', cursor: 'pointer',
                background: active ? 'rgba(200,32,42,0.12)' : 'transparent',
                borderLeft: sidebarOpen && active ? `3px solid ${RED}` : '3px solid transparent',
              }}
                onClick={() => router.push(href)}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: sidebarOpen ? 10 : 0 }}>
                  <Icon size={15} color={active ? RED : 'rgba(255,255,255,0.45)'} strokeWidth={active ? 2.5 : 1.8} />
                  {sidebarOpen && <span style={{ fontSize: 15, color: active ? '#fff' : 'rgba(255,255,255,0.65)', fontWeight: active ? 600 : 400 }}>{label}</span>}
                </div>
                {sidebarOpen && badge && <div style={{ background: RED, color: '#fff', borderRadius: 12, fontSize: 14, fontWeight: 700, padding: '1px 6px', minWidth: 18, textAlign: 'center' }}>{badge}</div>}
              </div>
            ))}
          </nav>

          {/* Upgrade to Premium */}
          {sidebarOpen && (
            <div style={{ margin: '10px 10px 14px', borderRadius: 12, background: 'linear-gradient(135deg, #1a0507 0%, #2a0b0e 100%)', border: '1px solid rgba(200,32,42,0.25)', padding: '16px 14px', textAlign: 'center', flexShrink: 0 }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>👑</div>
              <div style={{ fontSize: 19, fontFamily: BARLOW, fontWeight: 600, letterSpacing: 0.5, marginBottom: 4 }}>Upgrade to Premium</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 12, lineHeight: 1.6 }}>Get noticed by top agencies and unlock exclusive opportunities.</div>
              <button onClick={() => router.push('/pricing')} style={{ width: '100%', background: GOLD, color: '#000', border: 'none', borderRadius: 8, padding: '8px 0', fontSize: 14, fontWeight: 700, fontFamily: BARLOW, cursor: 'pointer' }}>Upgrade Now</button>
            </div>
          )}
        </aside>

        {/* ── CONTENT AREA ── */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

          {/* ── CONVERSATION LIST ── */}
          <div style={{
            width: 360, flexShrink: 0,
            background: BG2, borderRight: '1px solid rgba(255,255,255,0.07)',
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
          }}>
            {/* Panel header */}
            <div style={{ padding: '18px 18px 14px', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
              <h1 style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 28, letterSpacing: 1, fontWeight: 400, marginBottom: 2 }}>My Messages</h1>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>All your conversations in one place</p>
            </div>

            {/* Search */}
            <div style={{ padding: '12px 14px 0', flexShrink: 0 }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: BG3, border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 10, padding: '0 12px', height: 38,
              }}>
                <Search size={14} color="rgba(255,255,255,0.3)" />
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search messages..."
                  style={{
                    flex: 1, background: 'none', border: 'none', outline: 'none',
                    color: '#F5F5F5', fontSize: 14, fontFamily: BARLOW,
                  }}
                />
                <div style={{ cursor: 'pointer', opacity: 0.5 }}>
                  <Filter size={14} color="rgba(255,255,255,0.6)" />
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div style={{
              display: 'flex', gap: 0, padding: '12px 14px 0',
              borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0,
            }}>
              {CONV_TABS.map((tab, i) => {
                const count = [liveCounts.all, liveCounts.unread, liveCounts.starred][i];
                return (
                  <button key={i} onClick={() => setConvTab(i)} style={{
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    fontFamily: BARLOW, padding: '7px 14px', marginBottom: -1,
                    fontSize: 16, fontWeight: convTab === i ? 700 : 400,
                    color: convTab === i ? RED : 'rgba(255,255,255,0.5)',
                    borderBottom: convTab === i ? `2px solid ${RED}` : '2px solid transparent',
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}>
                    {tab.label}
                    {(count > 0 || i === 0) && (
                      <span style={{
                        background: convTab === i ? RED : 'rgba(255,255,255,0.12)',
                        color: '#fff', borderRadius: 10,
                        fontSize: 14, fontWeight: 700, padding: '0 6px', lineHeight: '18px',
                      }}>{count}</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Conversation list */}
            <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.07) transparent' }}>
              {filteredConvs.length === 0 ? (
                <div style={{ padding: '40px 20px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 15 }}>No conversations found.</div>
              ) : filteredConvs.map(conv => {
                const isActive = conv.id === activeConvId;
                const isStarred = starredConvs.has(conv.id);
                return (
                  <div key={conv.id}
                    onClick={() => setActiveConvId(conv.id)}
                    style={{
                      display: 'flex', alignItems: 'flex-start', gap: 12,
                      padding: '13px 16px', cursor: 'pointer',
                      borderLeft: isActive ? `3px solid ${RED}` : '3px solid transparent',
                      background: isActive ? 'rgba(200,32,42,0.08)' : 'transparent',
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                  >
                    {/* Avatar */}
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      {conv.avatarUrl ? (
                        <img src={conv.avatarUrl} alt={conv.name}
                          style={{ width: 46, height: 46, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${isActive ? RED + '60' : 'rgba(255,255,255,0.08)'}` }} />
                      ) : (
                        <div style={{
                          width: 46, height: 46, borderRadius: '50%',
                          background: conv.avatarBg, border: `2px solid ${isActive ? RED + '60' : 'rgba(255,255,255,0.1)'}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 15, fontWeight: 700, color: '#fff', letterSpacing: 0.5,
                        }}>{conv.initials}</div>
                      )}
                      {conv.unread > 0 && (
                        <div style={{
                          position: 'absolute', bottom: -2, right: -2,
                          width: 10, height: 10, borderRadius: '50%',
                          background: '#22C55E', border: `2px solid ${BG2}`,
                        }} />
                      )}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, minWidth: 0 }}>
                          <span style={{ fontSize: 16, fontWeight: conv.unread > 0 ? 700 : 500, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{conv.name}</span>
                          {conv.verified && <BadgeCheck size={13} color="#3B82F6" />}
                        </div>
                        <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.38)', whiteSpace: 'nowrap', flexShrink: 0, marginLeft: 8 }}>{conv.time}</span>
                      </div>
                      {conv.role && (
                        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 2 }}>{conv.role}</div>
                      )}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                        <span style={{
                          fontSize: 14, color: conv.unread > 0 ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.4)',
                          fontWeight: conv.unread > 0 ? 500 : 400,
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1,
                        }}>{conv.preview}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
                          {isStarred && <Star size={11} color={GOLD} fill={GOLD} />}
                          {conv.unread > 0 && (
                            <div style={{ background: RED, color: '#fff', borderRadius: 10, fontSize: 14, fontWeight: 700, padding: '1px 6px', minWidth: 18, textAlign: 'center' }}>{conv.unread}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── CHAT AREA ── */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: BG }}>

            {/* Chat header */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '0 18px', height: 62, flexShrink: 0,
              background: BG2, borderBottom: '1px solid rgba(255,255,255,0.07)',
            }}>
              {/* Back */}
              <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, borderRadius: 7, flexShrink: 0 }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <ArrowLeft size={16} color="rgba(255,255,255,0.6)" />
              </div>

              {/* Avatar */}
              {activeConv.avatarUrl ? (
                <img src={activeConv.avatarUrl} alt={activeConv.name}
                  style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.1)', flexShrink: 0 }} />
              ) : (
                <div style={{
                  width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
                  background: activeConv.avatarBg, border: '2px solid rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 700, color: '#fff',
                }}>{activeConv.initials}</div>
              )}

              {/* Name + status */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 17, fontWeight: 700 }}>{activeConv.name}</span>
                  {activeConv.verified && <BadgeCheck size={14} color="#3B82F6" />}
                </div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginTop: 1 }}>{activeConv.activeStatus}</div>
              </div>

              {/* Action icons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                {[Star, Phone, Info].map((Icon, i) => (
                  <div key={i}
                    onClick={() => i === 0 && toggleStar(activeConvId)}
                    style={{ width: 34, height: 34, borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <Icon size={16}
                      color={i === 0 && starredConvs.has(activeConvId) ? GOLD : 'rgba(255,255,255,0.55)'}
                      fill={i === 0 && starredConvs.has(activeConvId) ? GOLD : 'none'}
                    />
                  </div>
                ))}

                {/* Three-dot menu */}
                <div ref={menuRef} style={{ position: 'relative' }}>
                  <div
                    onClick={() => setMenuOpen(v => !v)}
                    style={{ width: 34, height: 34, borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', background: menuOpen ? 'rgba(255,255,255,0.08)' : 'transparent' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
                    onMouseLeave={e => { if (!menuOpen) e.currentTarget.style.background = 'transparent'; }}
                  >
                    <MoreVertical size={16} color="rgba(255,255,255,0.55)" />
                  </div>
                  {menuOpen && (
                    <div style={{
                      position: 'absolute', top: 'calc(100% + 6px)', right: 0,
                      background: BG3, border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 10, overflow: 'hidden', zIndex: 200,
                      boxShadow: '0 8px 32px rgba(0,0,0,0.6)', minWidth: 180,
                    }}>
                      {[
                        { icon: Trash2, label: 'Delete Chat',           color: '#F87171' },
                        { icon: Archive, label: 'Archive Chat',          color: 'rgba(255,255,255,0.7)' },
                        { icon: UserX,  label: 'Block / Unblock User',  color: 'rgba(255,255,255,0.7)' },
                      ].map(({ icon: Icon, label, color }) => (
                        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', cursor: 'pointer', borderTop: label === 'Block / Unblock User' ? '1px solid rgba(255,255,255,0.07)' : 'none' }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        >
                          <Icon size={14} color={color} />
                          <span style={{ fontSize: 15, color, fontFamily: BARLOW }}>{label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Messages area */}
            <div style={{
              flex: 1, overflowY: 'auto', padding: '20px 24px',
              scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.07) transparent',
              display: 'flex', flexDirection: 'column', gap: 0,
            }}>
              {messageGroups.length === 0 ? (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.25)', fontSize: 15 }}>
                  No messages yet. Start the conversation!
                </div>
              ) : messageGroups.map((group, gi) => (
                <div key={gi} style={{ marginBottom: 8 }}>
                  {/* Date separator */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '12px 0 18px' }}>
                    <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
                    <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap', fontFamily: MONT }}>{group.date}</span>
                    <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
                  </div>

                  {/* Messages */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {group.items.map(msg => (
                      <div key={msg.id} style={{
                        display: 'flex',
                        flexDirection: msg.sender === 'me' ? 'row-reverse' : 'row',
                        alignItems: 'flex-end', gap: 10,
                      }}>
                        {/* Their avatar */}
                        {msg.sender === 'them' && (
                          activeConv.avatarUrl ? (
                            <img src={activeConv.avatarUrl} alt={activeConv.name}
                              style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '1px solid rgba(255,255,255,0.1)' }} />
                          ) : (
                            <div style={{
                              width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                              background: activeConv.avatarBg,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: 14, fontWeight: 700, color: '#fff',
                            }}>{activeConv.initials}</div>
                          )
                        )}

                        {/* Bubble */}
                        <div style={{ maxWidth: '60%', display: 'flex', flexDirection: 'column', gap: 4 }}>
                          {msg.text && (
                            <div style={{
                              padding: '11px 14px',
                              background: msg.sender === 'me' ? 'rgba(200,32,42,0.35)' : BG3,
                              borderRadius: msg.sender === 'me' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                              border: msg.sender === 'me' ? '1px solid rgba(200,32,42,0.3)' : '1px solid rgba(255,255,255,0.06)',
                            }}>
                              <p style={{
                                fontSize: 15, lineHeight: 1.6, color: '#F5F5F5',
                                fontFamily: MONT, fontWeight: 400,
                                whiteSpace: 'pre-line', margin: 0,
                              }}>{msg.text}</p>
                              <div style={{
                                display: 'flex', justifyContent: 'flex-end', alignItems: 'center',
                                gap: 5, marginTop: 5,
                              }}>
                                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', fontFamily: MONT }}>{msg.time}</span>
                                {msg.sender === 'me' && <DeliveredIcon />}
                                {msg.sender === 'them' && <Smile size={13} color="rgba(255,255,255,0.25)" style={{ cursor: 'pointer' }} />}
                              </div>
                            </div>
                          )}

                          {msg.attachment && (
                            <div style={{
                              background: msg.sender === 'me' ? 'rgba(200,32,42,0.35)' : BG3,
                              border: msg.sender === 'me' ? '1px solid rgba(200,32,42,0.3)' : '1px solid rgba(255,255,255,0.06)',
                              borderRadius: msg.sender === 'me' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                              overflow: 'hidden',
                            }}>
                              {/* Thumbnail */}
                              {msg.attachment.thumbUrl && (
                                <div style={{ position: 'relative', height: 120, overflow: 'hidden' }}>
                                  <img src={msg.attachment.thumbUrl} alt="thumbnail"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                                  <div style={{
                                    position: 'absolute', inset: 0,
                                    background: 'rgba(0,0,0,0.4)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  }}>
                                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                      <Play size={14} color="#fff" fill="#fff" style={{ marginLeft: 2 }} />
                                    </div>
                                  </div>
                                </div>
                              )}
                              {/* File info */}
                              <div style={{ padding: '10px 14px' }}>
                                <div style={{ fontSize: 14, fontWeight: 600, color: '#F5F5F5', fontFamily: MONT, marginBottom: 3 }}>{msg.attachment.name}</div>
                                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', fontFamily: MONT }}>{msg.attachment.size} • {msg.attachment.format}</div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 5, marginTop: 6 }}>
                                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', fontFamily: MONT }}>{msg.time}</span>
                                  {msg.sender === 'me' && <DeliveredIcon />}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Input area */}
            <div style={{ flexShrink: 0, background: BG2, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 18px' }}>
                {/* Attachment */}
                <div style={{ width: 34, height: 34, borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <Paperclip size={17} color="rgba(255,255,255,0.4)" />
                </div>

                {/* Text input */}
                <div style={{ flex: 1, background: BG3, border: '1px solid rgba(255,255,255,0.09)', borderRadius: 10, padding: '0 14px', display: 'flex', alignItems: 'center', height: 40 }}>
                  <input
                    value={messageText}
                    onChange={e => setMessageText(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                    placeholder="Type your message..."
                    style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: '#F5F5F5', fontSize: 14, fontFamily: MONT }}
                  />
                </div>

                {/* Emoji */}
                <div style={{ width: 34, height: 34, borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <Smile size={17} color="rgba(255,255,255,0.4)" />
                </div>

                {/* Send button */}
                <button
                  onClick={handleSend}
                  style={{
                    width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
                    background: messageText.trim() ? RED : 'rgba(200,32,42,0.3)',
                    border: 'none', cursor: messageText.trim() ? 'pointer' : 'default',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'background 0.2s',
                  }}
                >
                  <Send size={15} color="#fff" style={{ marginLeft: 2 }} />
                </button>
              </div>

              {/* Safety note */}
              <div style={{ padding: '0 18px 10px', textAlign: 'center', fontSize: 14, color: 'rgba(255,255,255,0.28)', fontFamily: MONT }}>
                Never share bank details or OTP.{' '}
                <span style={{ color: GOLD, cursor: 'pointer', textDecoration: 'underline' }}>Report</span>
                {' '}suspicious messages.
              </div>
            </div>

          </div>{/* end chat area */}

        </div>{/* end content area */}

      </div>{/* end body */}
    </div>
  );
}