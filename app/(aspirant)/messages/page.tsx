'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation'

import SilverScreensLogo from '@/components/ui/SilverScreensLogo';
import {
  LayoutDashboard, FileText, MessageSquare, Mic2,
  Bookmark, Star, Bell, ChevronRight, ChevronDown, ChevronLeft, Menu,
  Search, Paperclip, Smile, Send, Phone, MoreVertical,
  Trash2, Archive, UserX, ArrowLeft, Check, Filter,
  BadgeCheck, Info, LogOut,
} from 'lucide-react';

const RED    = '#C8202A';
const GOLD   = '#D4A64A';
const BG     = '#050505';
const BG2    = '#0B0F14';
const BG3    = '#121821';
const BG4    = '#1C2030';
const BARLOW = '"Barlow Condensed", sans-serif';

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard',            href: '/dashboard' },
  { icon: FileText,        label: 'My Applications',      href: '/my-applications' },
  { icon: MessageSquare,   label: 'Messages',             href: '/messages',    active: true },
  { icon: Mic2,            label: 'Auditions',            href: '/auditions' },
  { icon: Bookmark,        label: 'Saved Castings',       href: '/saved-castings' },
  { icon: Star,            label: 'Recommended Castings', href: '/recommended' },
  { icon: Bell,            label: 'Notifications',        href: '/notifications' },
];

const PROFILE_MENU_APPROVED = [
  { label: 'My Profile',      href: '/my-profile'             },
  { label: 'Subscription',    href: '/dashboard/subscription' },
  { label: 'Analytics',       href: '/analytics'              },
  { label: 'Calendar',        href: '/calendar'               },
  { label: 'Settings',        href: '/settings'               },
  { label: 'Help & Support',  href: '/settings?tab=support'   },
];
const PROFILE_MENU_PENDING = [
  { label: 'My Profile', href: '/create-profile' },
];

const CONV_TABS = [
  { label: 'All' },
  { label: 'Unread' },
  { label: 'Starred' },
];

const BG_COLORS = ['#1A3A5C','#1A3A2C','#3D1515','#15153D','#2A1A3A','#0F2D2D','#3D0B0E'];

type Conversation = {
  id: string; name: string; role?: string;
  avatarUrl?: string; initials: string; avatarBg: string;
  verified: boolean; preview: string; time: string;
  unread: number; starred: boolean; activeStatus: string;
};

type MsgItem = {
  id: string; sender: 'me' | 'them';
  text?: string; time: string; delivered: boolean;
};

type MsgGroup = { date: string; items: MsgItem[] };

function getAuthHeaders(): Record<string, string> {
  try {
    const u = JSON.parse(localStorage.getItem('ss_user') || '{}');
    return u.token ? { Authorization: `Bearer ${u.token}` } : {};
  } catch { return {}; }
}

function getCurrentUserId(): string {
  try {
    const u = JSON.parse(localStorage.getItem('ss_user') || '{}');
    return u.id ?? '';
  } catch { return ''; }
}

function apiToConv(c: any, idx: number): Conversation {
  const other = c.otherParty ?? c.participant ?? {};
  const name  = other.name ?? c.name ?? `Conversation ${idx + 1}`;
  const initials = name.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase();
  return {
    id:           String(c.id ?? c._id ?? idx),
    name,
    role:         other.role ?? c.role ?? undefined,
    avatarUrl:    other.profilePhoto ?? other.avatarUrl ?? undefined,
    initials,
    avatarBg:     BG_COLORS[idx % BG_COLORS.length],
    verified:     other.verified ?? c.verified ?? false,
    preview:      c.lastMessage?.content ?? c.preview ?? c.lastMessageContent ?? '',
    time:         c.lastMessageAt
      ? new Date(c.lastMessageAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
      : c.time ?? '',
    unread:       c.unreadCount ?? c.unread ?? 0,
    starred:      c.starred ?? false,
    activeStatus: c.activeStatus ?? 'Active recently',
  };
}

function apiToMsgGroups(messages: any[], currentUserId: string): MsgGroup[] {
  if (!messages.length) return [];
  const grouped: Record<string, MsgItem[]> = {};
  messages.forEach((m: any, i: number) => {
    const sentAt  = m.sent_at ?? m.createdAt ?? m.created_at;
    const d       = sentAt ? new Date(sentAt) : new Date();
    const dateKey = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
    if (!grouped[dateKey]) grouped[dateKey] = [];
    // isOwn flag from API, or compare sender_id to current user
    const isOwn = m.isOwn !== undefined
      ? m.isOwn
      : (m.sender_id === currentUserId);
    grouped[dateKey].push({
      id:        String(m.id ?? m._id ?? i),
      sender:    isOwn ? 'me' : 'them',
      text:      m.content ?? m.text ?? undefined,
      time:      d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      delivered: m.is_read ?? m.delivered ?? m.status === 'delivered' ?? false,
    });
  });
  return Object.entries(grouped).map(([date, items]) => ({ date, items }));
}

export default function MessagesPage() {
  const router = useRouter()
  const [sidebarOpen,   setSidebarOpen]   = useState(false);
  const [profileNumber,  setProfileNumber]  = useState('ASP·······');
  const [isApproved, setIsApproved] = useState(false);
  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('ss_user') || '{}');
      const pn = u?.profileNumber ?? u?.profile_number;
      if (pn) setProfileNumber(pn);
      const ps = u?.profileStatus;
      setIsApproved(ps === 'approved' || ps === 'active');
    } catch {}
  }, []);
  const [activeConvId,  setActiveConvId]  = useState<string | null>(null);
  const [convTab,       setConvTab]       = useState(0);
  const [searchQuery,   setSearchQuery]   = useState('');
  const [messageText,   setMessageText]   = useState('');
  const [menuOpen,      setMenuOpen]      = useState(false);
  const [dropdownOpen,  setDropdownOpen]  = useState(false);
  const [starredConvs,  setStarredConvs]  = useState<Set<string>>(new Set());
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messageGroups, setMessageGroups] = useState<MsgGroup[]>([]);
  const [loadingConvs,  setLoadingConvs]  = useState(true);
  const [loadingMsgs,   setLoadingMsgs]   = useState(false);
  const [userName,      setUserName]      = useState('My Account');
  const [avatarUrl,     setAvatarUrl]     = useState('');
  const [notifCount,    setNotifCount]    = useState(0);
  const [msgCount,      setMsgCount]      = useState(0);
  const [currentUserId, setCurrentUserId] = useState('');

  const SB_W = sidebarOpen ? 210 : 56;
  const menuRef    = useRef<HTMLDivElement>(null);
  const dropRef    = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConvId, messageGroups]);

  // Load user identity
  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('ss_user') || '{}');
      if (u.profilePhoto) setAvatarUrl(u.profilePhoto);
      if (u.id)           setCurrentUserId(u.id);
    } catch {}
  }, []);

  // Fetch conversations on mount
  // Fetch conversations — called on mount and every 5s for real-time updates
  const fetchConversations = (isInitial = false) => {
    const h = getAuthHeaders();
    fetch('/api/messages/conversations', { headers: h })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        const list = data.data?.conversations ?? data.conversations ?? [];
        if (!Array.isArray(list)) return;
        const normalised = list.map((c: any, i: number) => apiToConv(c, i));
        setConversations(prev => {
          // Merge: keep unread=0 for the currently active conversation
          return normalised.map((n: Conversation) => {
            const existing = prev.find(p => p.id === n.id);
            if (existing && existing.unread === 0 && n.id === activeConvId) return { ...n, unread: 0 };
            return n;
          });
        });
        setStarredConvs(new Set(normalised.filter((c: Conversation) => c.starred).map((c: Conversation) => c.id)));
        // Update unread badge — don't count active conversation
        const unreadCount = normalised.filter((c: Conversation) => c.unread > 0 && c.id !== activeConvId).length;
        setMsgCount(unreadCount);
        if (isInitial && normalised.length > 0 && !activeConvId) setActiveConvId(normalised[0].id);
      })
      .catch(() => {})
      .finally(() => { if (isInitial) setLoadingConvs(false); });
  };

  useEffect(() => {
    const h = getAuthHeaders();

    // Initial load
    fetchConversations(true);

    // Poll every 5 seconds for new messages
    const pollInterval = setInterval(() => fetchConversations(false), 5000);

    fetch('/api/notifications', { headers: h })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        const count = data.data?.unread_count ?? data.unread_count;
        if (count != null) { setNotifCount(count); return; }
        const list = data.data?.notifications ?? data.notifications ?? [];
        if (Array.isArray(list)) setNotifCount(list.filter((n: any) => !n.is_read && !n.read).length);
      }).catch(() => {});

    return () => clearInterval(pollInterval);
  }, []);

  // Fetch messages when active conversation changes, poll every 5s for new ones
  useEffect(() => {
    if (!activeConvId) return;
    const h = getAuthHeaders();
    const uid = currentUserId || getCurrentUserId();
    setLoadingMsgs(true);
    setMessageGroups([]);

    const fetchMsgs = (initial = false) => {
      fetch(`/api/messages/${activeConvId}`, { headers: h })
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          if (!data) return;
          const list = data.data?.messages ?? data.messages ?? [];
          if (!Array.isArray(list)) return;
          setMessageGroups(apiToMsgGroups(list, uid));
        })
        .catch(() => {})
        .finally(() => { if (initial) setLoadingMsgs(false); });
    };

    fetchMsgs(true);
    const poll = setInterval(() => fetchMsgs(false), 5000);
    return () => clearInterval(poll);
  }, [activeConvId, currentUserId]);

  const activeConv = conversations.find(c => c.id === activeConvId) ?? null;

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

  const liveCounts = useMemo(() => ({
    all:     conversations.length,
    unread:  conversations.filter(c => c.unread > 0).length,
    starred: conversations.filter(c => starredConvs.has(c.id)).length,
  }), [conversations, starredConvs]);

  const toggleStar = (id: string) => {
    setStarredConvs(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const markAllAsRead = async () => {
    // Optimistically clear all unread counts locally
    setConversations(prev => prev.map(c => ({ ...c, unread: 0 })))
    setMsgCount(0)
    // Call PUT for each unread conversation
    const h = getAuthHeaders()
    const unreadConvs = conversations.filter(c => c.unread > 0)
    await Promise.all(
      unreadConvs.map(c =>
        fetch(`/api/messages/${c.id}`, { method: 'PUT', headers: h }).catch(() => {})
      )
    )
  }

  const markConvAsRead = (convId: string) => {
    setActiveConvId(convId)
    // Optimistically clear unread count in local state
    setConversations(prev =>
      prev.map(c => c.id === convId ? { ...c, unread: 0 } : c)
    )
    // Tell the server to reset unread count + mark messages read
    const h = getAuthHeaders()
    fetch(`/api/messages/${convId}`, { method: 'PUT', headers: h })
      .catch(() => {})
    // Also update sidebar badge count
    setMsgCount(prev => Math.max(0, prev - 1))
  }

  const handleSend = async () => {
    if (!messageText.trim() || !activeConvId) return;
    const text = messageText.trim();
    setMessageText('');

    const optimisticMsg: MsgItem = {
      id: `opt_${Date.now()}`, sender: 'me', text, delivered: false,
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

  const DeliveredIcon = () => (
    <span style={{ display: 'inline-flex', gap: -3 }}>
      <Check size={12} strokeWidth={3} color="rgba(255,255,255,0.45)" />
      <Check size={12} strokeWidth={3} color="rgba(255,255,255,0.45)" style={{ marginLeft: -6 }} />
    </span>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: BG, fontFamily: BARLOW, color: '#fff' }}>

      {/* ══ TOP NAVBAR ══ */}
      <header style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '0 24px', height: 60, flexShrink: 0, background: BG2, borderBottom: '1px solid rgba(255,255,255,0.07)', position: 'relative', zIndex: 100 }}>
        <SilverScreensLogo size="md" href="/" showTagline={false} />
        <div style={{ flex: 1 }} />
        <button onClick={() => isApproved && router.push('/casting-calls')} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'transparent', border: `1px solid ${isApproved ? GOLD : 'rgba(212,166,74,0.3)'}`, color: isApproved ? GOLD : 'rgba(212,166,74,0.35)', borderRadius: 8, padding: '0 18px', height: 36, fontSize: 15, fontWeight: 600, fontFamily: BARLOW, cursor: isApproved ? 'pointer' : 'not-allowed', opacity: isApproved ? 1 : 0.6 }}>{isApproved ? '+ Find Casting Calls' : '🔒 Find Casting Calls'}</button>
        <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => router.push('/notifications')}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bell size={16} />
          </div>
          {notifCount > 0 && <div style={{ position: 'absolute', top: -5, right: -5, background: RED, borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700 }}>{notifCount}</div>}
        </div>
        <div style={{ position: 'relative', width: 36, height: 36, borderRadius: 8, background: `rgba(200,32,42,0.15)`, border: `1px solid ${RED}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onClick={() => router.push('/messages')}>
          <MessageSquare size={16} color={RED} />
          {msgCount > 0 && <div style={{ position: 'absolute', top: -5, right: -5, background: RED, borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700 }}>{msgCount}</div>}
        </div>
        <div ref={dropRef} style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => setDropdownOpen(v => !v)}>
            <img src={avatarUrl || undefined} alt={userName} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${GOLD}` }} />
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.2 }}>{isApproved ? userName : 'My Account'}</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)' }}>Aspirant</div>
            </div>
            <ChevronRight size={12} color="rgba(255,255,255,0.4)" style={{ transform: 'rotate(90deg)' }} />
          </div>
          {dropdownOpen && (
            <>
              <div onClick={() => setDropdownOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 150 }} />
              <div style={{ position: 'absolute', top: 46, right: 0, width: 210, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, overflow: 'hidden', zIndex: 200, boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}>
                {isApproved && (
                  <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>Aspirant ID</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: GOLD }}>{profileNumber}</span>
                  </div>
                )}
                {(isApproved ? PROFILE_MENU_APPROVED : PROFILE_MENU_PENDING).map(({ label, href }) => (
                  <div key={label}
                    onClick={() => { router.push(href); setDropdownOpen(false); }}
                    style={{ padding: '10px 16px', fontSize: 15, cursor: 'pointer', color: '#F5F5F5', fontFamily: BARLOW }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >{label}</div>
                ))}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                  <div onClick={() => { localStorage.removeItem('ss_user'); window.location.replace('/login'); }}
                    style={{ padding: '10px 16px', fontSize: 15, cursor: 'pointer', color: '#ff6b6b', fontFamily: BARLOW, display: 'flex', alignItems: 'center', gap: 8 }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  ><LogOut size={14} /> Logout</div>
                </div>
              </div>
            </>
          )}
        </div>
      </header>

      {/* ══ BODY ══ */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* ── SIDEBAR ── */}
        <aside style={{ width: SB_W, flexShrink: 0, background: BG2, borderRight: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', overflowY: 'auto', overflowX: 'hidden', transition: 'width 0.2s ease' }}>
          <div style={{ display: 'flex', justifyContent: sidebarOpen ? 'flex-end' : 'center', padding: sidebarOpen ? '10px 12px 0' : '10px 0 0', flexShrink: 0 }}>
            <button onClick={() => setSidebarOpen(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', width: 30, height: 30, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            >{sidebarOpen ? <ChevronLeft size={16} /> : <Menu size={16} />}</button>
          </div>
          <nav style={{ flex: 1, padding: '10px 0' }}>
            {sidebarItems.map(({ icon: Icon, label, active, badge, href }) => (
              <div key={label} title={!sidebarOpen ? label : undefined} style={{ display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'space-between' : 'center', padding: sidebarOpen ? '9px 16px' : '10px 0', cursor: 'pointer', background: active ? 'rgba(200,32,42,0.12)' : 'transparent', borderLeft: sidebarOpen && active ? `3px solid ${RED}` : '3px solid transparent' }}
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
          <div style={{ width: 360, flexShrink: 0, background: BG2, borderRight: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '18px 18px 14px', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
              <h1 style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 28, letterSpacing: 1, fontWeight: 400, marginBottom: 2 }}>My Messages</h1>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>All your conversations in one place</p>
            </div>

            <div style={{ padding: '12px 14px 0', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: BG3, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '0 12px', height: 38 }}>
                <Search size={14} color="rgba(255,255,255,0.3)" />
                <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search messages..." style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: '#F5F5F5', fontSize: 14, fontFamily: BARLOW }} />
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 0, padding: '12px 14px 0', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
              {CONV_TABS.map((tab, i) => {
                const count = [liveCounts.all, liveCounts.unread, liveCounts.starred][i];
                return (
                  <button key={i} onClick={() => setConvTab(i)} style={{ flex: 1, background: 'none', border: 'none', borderBottom: `2px solid ${convTab === i ? RED : 'transparent'}`, padding: '0 0 10px', cursor: 'pointer', fontFamily: BARLOW, fontSize: 15, fontWeight: convTab === i ? 700 : 400, color: convTab === i ? '#fff' : 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    {tab.label}
                    {i > 0 && count > 0 && <span style={{ background: convTab === i ? RED : 'rgba(255,255,255,0.12)', color: '#fff', borderRadius: 10, fontSize: 12, fontWeight: 700, padding: '0 6px', minWidth: 18, textAlign: 'center' as const }}>{count}</span>}
                  </button>
                );
              })}
            </div>

            {/* Mark all as read */}
            {conversations.some(conv => conv.unread > 0) && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '8px 16px 0', flexShrink: 0 }}>
                <button onClick={markAllAsRead} style={{ background: 'none', border: 'none', color: GOLD, fontSize: 13, fontWeight: 700, fontFamily: BARLOW, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, padding: 0 }}>
                  ✓ Mark all as read
                </button>
              </div>
            )}

            {/* Conversation items */}
            <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none' }}>
      {/* Profile incomplete banner */}
      {!isApproved && (
        <div style={{ margin: '16px 24px 0', padding: '14px 20px', background: 'rgba(212,166,74,0.08)', border: '1px solid rgba(212,166,74,0.25)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 22 }}>🎬</span>
            <div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 17, letterSpacing: 1, color: '#D4A64A' }}>COMPLETE YOUR PROFILE TO UNLOCK THIS SECTION</div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>Submit your profile, choose a plan, complete payment and get admin approval to access all features.</div>
            </div>
          </div>
          <button onClick={() => router.push('/create-profile')} style={{ padding: '9px 20px', background: '#D4A64A', border: 'none', borderRadius: 7, color: '#050505', fontFamily: "'Bebas Neue', sans-serif", fontSize: 15, letterSpacing: 1, cursor: 'pointer', whiteSpace: 'nowrap' }}>
            CREATE PROFILE →
          </button>
        </div>
      )}
              {loadingConvs && (
                <div style={{ padding: '40px 0', textAlign: 'center', fontSize: 14, color: 'rgba(255,255,255,0.3)' }}>Loading…</div>
              )}
              {!loadingConvs && filteredConvs.length === 0 && (
                <div style={{ padding: '40px 16px', textAlign: 'center', fontSize: 14, color: 'rgba(255,255,255,0.3)' }}>
                  {convTab === 0 ? 'No conversations yet. When an agency messages you, it will appear here.' : 'No conversations match this filter.'}
                </div>
              )}
              {filteredConvs.map(conv => {
                const isActive = conv.id === activeConvId;
                const isStarred = starredConvs.has(conv.id);
                return (
                  <div key={conv.id} onClick={() => markConvAsRead(conv.id)} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 16px', cursor: 'pointer', background: isActive ? 'rgba(200,32,42,0.08)' : 'transparent', borderLeft: `3px solid ${isActive ? RED : 'transparent'}`, transition: 'all 0.12s' }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = isActive ? 'rgba(200,32,42,0.08)' : 'transparent'; }}
                  >
                    <div style={{ width: 44, height: 44, borderRadius: '50%', flexShrink: 0, overflow: 'hidden', background: conv.avatarBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700 }}>
                      {conv.avatarUrl ? <img src={conv.avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : conv.initials}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                          <span style={{ fontSize: 15, fontWeight: conv.unread > 0 ? 700 : 500, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{conv.name}</span>
                          {conv.verified && <BadgeCheck size={14} color="#3B82F6" />}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, marginLeft: 6 }}>
                          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>{conv.time}</span>
                          <Star size={13} color={isStarred ? GOLD : 'rgba(255,255,255,0.2)'} fill={isStarred ? GOLD : 'none'} style={{ cursor: 'pointer', flexShrink: 0 }}
                            onClick={e => { e.stopPropagation(); toggleStar(conv.id); }}
                          />
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 13, color: conv.unread > 0 ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.35)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{conv.preview}</span>
                        {conv.unread > 0 && <div style={{ width: 18, height: 18, borderRadius: '50%', background: RED, color: '#fff', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginLeft: 6 }}>{conv.unread}</div>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── CHAT WINDOW ── */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

            {!activeConv ? (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, color: 'rgba(255,255,255,0.3)' }}>
                <MessageSquare size={44} color="rgba(255,255,255,0.08)" />
                <div style={{ fontSize: 16 }}>Select a conversation to start reading</div>
              </div>
            ) : (
              <>
                {/* Chat header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)', background: BG2, flexShrink: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', overflow: 'hidden', background: activeConv.avatarBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, flexShrink: 0 }}>
                      {activeConv.avatarUrl ? <img src={activeConv.avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : activeConv.initials}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 15, fontWeight: 700 }}>
                        {activeConv.name}
                        {activeConv.verified && <BadgeCheck size={15} color="#3B82F6" />}
                      </div>
                      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{activeConv.role ?? activeConv.activeStatus}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {[
                      { icon: <Phone size={15} />,        label: 'Call'    },
                      { icon: <Info size={15} />,         label: 'Profile' },
                      { icon: <MoreVertical size={15} />, label: 'More'    },
                    ].map(({ icon, label }) => (
                      <button key={label} title={label} style={{ width: 34, height: 34, borderRadius: 8, background: BG3, border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.6)' }}
                        onMouseEnter={e => (e.currentTarget.style.background = BG4)}
                        onMouseLeave={e => (e.currentTarget.style.background = BG3)}
                      >{icon}</button>
                    ))}
                  </div>
                </div>

                {/* Messages */}
                <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none', padding: '20px 20px 10px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {loadingMsgs && (
                    <div style={{ padding: '40px 0', textAlign: 'center', fontSize: 14, color: 'rgba(255,255,255,0.3)' }}>Loading messages…</div>
                  )}
                  {!loadingMsgs && messageGroups.length === 0 && (
                    <div style={{ padding: '40px 0', textAlign: 'center', fontSize: 14, color: 'rgba(255,255,255,0.3)' }}>No messages yet. Say hello!</div>
                  )}
                  {messageGroups.map(group => (
                    <div key={group.date}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '12px 0 8px' }}>
                        <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
                        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap' }}>{group.date}</span>
                        <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
                      </div>
                      {group.items.map(msg => (
                        <div key={msg.id} style={{ display: 'flex', justifyContent: msg.sender === 'me' ? 'flex-end' : 'flex-start', marginBottom: 8 }}>
                          {msg.sender === 'them' && (
                            <div style={{ width: 30, height: 30, borderRadius: '50%', background: activeConv.avatarBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0, marginRight: 8, alignSelf: 'flex-end' }}>
                              {activeConv.initials}
                            </div>
                          )}
                          <div style={{ maxWidth: '68%' }}>
                            <div style={{ background: msg.sender === 'me' ? RED : BG3, borderRadius: msg.sender === 'me' ? '16px 16px 4px 16px' : '16px 16px 16px 4px', padding: '10px 14px', fontSize: 14, color: '#fff', lineHeight: 1.55, border: msg.sender === 'them' ? '1px solid rgba(255,255,255,0.07)' : 'none', whiteSpace: 'pre-wrap' as const }}>
                              {msg.text}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 3, justifyContent: msg.sender === 'me' ? 'flex-end' : 'flex-start' }}>
                              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>{msg.time}</span>
                              {msg.sender === 'me' && <DeliveredIcon />}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>

                {/* Message input */}
                <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.07)', background: BG2, flexShrink: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '8px 12px' }}>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 4, color: 'rgba(255,255,255,0.4)' }}><Paperclip size={16} /></button>
                    <input
                      value={messageText}
                      onChange={e => setMessageText(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                      placeholder={`Message ${activeConv.name}…`}
                      style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 14, color: '#fff', fontFamily: BARLOW }}
                    />
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 4, color: 'rgba(255,255,255,0.4)' }}><Smile size={16} /></button>
                    <button onClick={handleSend} style={{ width: 34, height: 34, borderRadius: 8, background: messageText.trim() ? RED : 'rgba(255,255,255,0.06)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: messageText.trim() ? 'pointer' : 'default', transition: 'background 0.15s', flexShrink: 0 }}>
                      <Send size={15} color={messageText.trim() ? '#fff' : 'rgba(255,255,255,0.3)'} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}