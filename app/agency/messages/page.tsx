'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import SilverScreensLogo from '@/components/ui/SilverScreensLogo';
import {
  LayoutDashboard, Megaphone, PlusCircle, ClipboardList,
  UserSearch, Star, CalendarCheck, MessageSquare, Bell,
  Bookmark, ChevronDown, ChevronLeft, Menu,
  Search, Send, MoreHorizontal, Check, CheckCheck,
  Phone, Video, Info, Paperclip, Smile,
} from 'lucide-react';

const RED    = '#C8202A';
const GOLD   = '#D4A64A';
const GREEN  = '#22C55E';
const BLUE   = '#3B82F6';
const BG     = '#050505';
const BG2    = '#0B0F14';
const BG3    = '#121821';
const BG4    = '#1C2030';
const BEBAS  = "'Bebas Neue', sans-serif";
const BARLOW = "'Barlow Condensed', sans-serif";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard',               href: '/agency/dashboard' },
  { icon: PlusCircle,      label: 'Create Casting Call',     href: '/agency/create-casting' },
  { icon: Megaphone,       label: 'Casting Calls List',      href: '/agency/casting-calls' },
  { icon: UserSearch,      label: 'Talent Search',           href: '/agency/talent-search' },
  { icon: ClipboardList,   label: 'Applications Management', href: '/agency/applications' },
  { icon: Star,            label: 'Shortlisted Talents',     href: '/agency/shortlisted' },
  { icon: CalendarCheck,   label: 'Audition Management',     href: '/agency/auditions' },
  { icon: Bookmark,        label: 'Saved Talents',           href: '/agency/saved-talents' },
  { icon: MessageSquare,   label: 'Messages',  badge: 12,    href: '/agency/messages', active: true },
  { icon: Bell,            label: 'Notifications', badge: 3, href: '/agency/notifications' },
];

interface Conversation {
  id: string; name: string; role: string; avatar: string; gradient: string;
  lastMsg: string; time: string; unread: number; online: boolean;
}

interface Message {
  id: string; from: 'me' | 'them'; text: string; time: string; read: boolean;
}

const CONVERSATIONS: Conversation[] = [
  { id: 'c1', name: 'Arjun Malhotra',  role: 'Actor · Lead Hero',          avatar: 'AM', gradient: 'linear-gradient(135deg,#667eea,#764ba2)', lastMsg: 'Sure, I will be there on time.', time: '11:30 AM', unread: 3, online: true },
  { id: 'c2', name: 'Meera Iyer',      role: 'Actor · Female Lead',        avatar: 'MI', gradient: 'linear-gradient(135deg,#f093fb,#f5576c)', lastMsg: 'Thank you for the opportunity!', time: '10:45 AM', unread: 1, online: true },
  { id: 'c3', name: 'Vikram Singh',    role: 'Actor · Antagonist',         avatar: 'VS', gradient: 'linear-gradient(135deg,#4facfe,#00f2fe)', lastMsg: 'What documents do I need to bring?', time: 'Yesterday', unread: 0, online: false },
  { id: 'c4', name: 'Aisha Sharma',    role: 'Actor · Supporting Actress', avatar: 'AS', gradient: 'linear-gradient(135deg,#43e97b,#38f9d7)', lastMsg: 'Looking forward to the audition.', time: 'Yesterday', unread: 0, online: false },
  { id: 'c5', name: 'Kabir Malhotra',  role: 'Actor · Supporting Actor',   avatar: 'KM', gradient: 'linear-gradient(135deg,#fa709a,#fee140)', lastMsg: 'Can we reschedule the audition?', time: 'Mon', unread: 2, online: false },
  { id: 'c6', name: 'Priya Nair',      role: 'Dancer · Lead Actress',      avatar: 'PN', gradient: 'linear-gradient(135deg,#a18cd1,#fbc2eb)', lastMsg: 'I have submitted all the required docs.', time: 'Mon', unread: 0, online: true },
  { id: 'c7', name: 'Rohan Deshmukh',  role: 'Actor · Lead Hero',          avatar: 'RD', gradient: 'linear-gradient(135deg,#fccb90,#d57eeb)', lastMsg: 'Please find attached my updated portfolio.', time: 'Sun', unread: 0, online: false },
];

const MESSAGES_MAP: Record<string, Message[]> = {
  c1: [
    { id: 'm1', from: 'me',   text: 'Hi Arjun, we would like to invite you for the audition of City of Dreams – Season 2 on 25 May 2024 at 11:00 AM.', time: '10:00 AM', read: true },
    { id: 'm2', from: 'them', text: 'Hello! Thank you so much for the opportunity. I am very excited about this role.', time: '10:15 AM', read: true },
    { id: 'm3', from: 'me',   text: 'Great! The audition will be held at Dharma Productions Office, Andheri West. Please prepare a 2-minute monologue.', time: '10:20 AM', read: true },
    { id: 'm4', from: 'them', text: 'Understood. Should I also prepare any dialogue from the script?', time: '10:45 AM', read: true },
    { id: 'm5', from: 'me',   text: 'Yes, please prepare the scenes shared in the audition brief. Contact Mohamed Jaleel at +91 99941 89841 for any queries.', time: '11:00 AM', read: true },
    { id: 'm6', from: 'them', text: 'Sure, I will be there on time.', time: '11:30 AM', read: false },
  ],
  c2: [
    { id: 'm1', from: 'me',   text: 'Hi Meera, congratulations! You have been shortlisted for The Silent Witness.', time: '09:30 AM', read: true },
    { id: 'm2', from: 'them', text: 'Thank you for the opportunity! I am really looking forward to this.', time: '10:45 AM', read: false },
  ],
  c3: [
    { id: 'm1', from: 'them', text: 'Hello, I received the audition invitation. What documents do I need to bring?', time: 'Yesterday', read: true },
    { id: 'm2', from: 'me',   text: 'Please bring your portfolio, ID proof and any prior work samples.', time: 'Yesterday', read: true },
  ],
};

/* ── Auth helper ── */
function getAuthHeaders(): Record<string, string> {
  try {
    const u = JSON.parse(localStorage.getItem('ss_user') || '{}');
    return u.token ? { Authorization: `Bearer ${u.token}` } : {};
  } catch { return {}; }
}

const GRADIENTS = [
  'linear-gradient(135deg,#667eea,#764ba2)', 'linear-gradient(135deg,#f093fb,#f5576c)',
  'linear-gradient(135deg,#4facfe,#00f2fe)', 'linear-gradient(135deg,#43e97b,#38f9d7)',
  'linear-gradient(135deg,#fa709a,#fee140)', 'linear-gradient(135deg,#a18cd1,#fbc2eb)',
  'linear-gradient(135deg,#fccb90,#d57eeb)',
];

function apiToConversation(c: any, idx: number): Conversation {
  const other = c.otherParty ?? c.participant ?? {};
  const name  = other.name ?? c.name ?? `Conversation ${idx + 1}`;
  return {
    id:       String(c.id ?? c._id ?? idx),
    name,
    role:     other.role ?? other.department ?? c.role ?? '',
    avatar:   name.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase(),
    gradient: GRADIENTS[idx % GRADIENTS.length],
    lastMsg:  c.lastMessage?.content ?? c.preview ?? c.lastMessageContent ?? '',
    time:     c.lastMessageAt
      ? new Date(c.lastMessageAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
      : c.time ?? '',
    unread:   c.unreadCount ?? c.unread ?? 0,
    online:   other.isOnline ?? c.online ?? false,
  };
}

function apiToMessages(list: any[]): Message[] {
  return list.map((m: any, i: number) => ({
    id:   String(m.id ?? m._id ?? i),
    from: (m.isOwn ?? false) ? 'me' : 'them',
    text: m.content ?? m.text ?? '',
    time: m.createdAt
      ? new Date(m.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
      : m.time ?? '',
    read: m.read ?? m.isRead ?? m.status === 'read' ?? true,
  }));
}
export default function MessagesPage() {
  const router = useRouter();
  const [sidebarOpen,   setSidebarOpen]   = useState(false);
  const [profileOpen,   setProfileOpen]   = useState(false);
  const [activeConv,    setActiveConv]    = useState<string>('c1');
  const [searchQuery,   setSearchQuery]   = useState('');
  const [newMessage,    setNewMessage]    = useState('');
  const [messagesState, setMessagesState] = useState<Record<string, Message[]>>(MESSAGES_MAP);
  const chatEndRef = useRef<HTMLDivElement>(null);

  /* ── Live data ── */
  const [conversations,  setConversations]  = useState<Conversation[]>(CONVERSATIONS);
  const [agencyName,     setAgencyName]     = useState('My Agency');
  const [agencyInitials, setAgencyInitials] = useState('AG');
  const [agencyId,       setAgencyId]       = useState('AGE·········');
  const [agencyType,     setAgencyType]     = useState('Production House');
  const [msgCount,       setMsgCount]       = useState(12);
  const [notifCount,     setNotifCount]     = useState(3);

  const SB_W = sidebarOpen ? 230 : 52;

  /* ── Scroll to bottom on new messages ── */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv, messagesState]);

  /* ── Load agency identity from ss_user instantly ── */
  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('ss_user') || '{}');
      if (u.name) {
        setAgencyName(u.name);
        setAgencyInitials(u.name.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase());
      }
      if (u.profileNumber) setAgencyId(u.profileNumber);
    } catch {}
  }, []);

  /* ── Fetch conversations + badge counts on mount ── */
  useEffect(() => {
    const h = getAuthHeaders();

    fetch('/api/messages/conversations', { headers: h })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        const list = data.conversations ?? data;
        if (!Array.isArray(list) || list.length === 0) return;
        const normalised = list.map((c: any, i: number) => apiToConversation(c, i));
        setConversations(normalised);
        if (normalised.length > 0) setActiveConv(String(normalised[0].id));
        setMsgCount(normalised.filter((c: Conversation) => c.unread > 0).length);
      }).catch(() => {});

    fetch('/api/profile/agency', { headers: h })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        const p = data.profile ?? data;
        if (p.companyName || p.name) {
          const name = p.companyName ?? p.name;
          setAgencyName(name);
          setAgencyInitials(name.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase());
        }
        if (p.profileNumber) setAgencyId(p.profileNumber);
        if (p.companyType)   setAgencyType(p.companyType);
      }).catch(() => {});

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
    if (!activeConv) return;
    const h = getAuthHeaders();
    fetch(`/api/messages/${activeConv}`, { headers: h })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        const list = data.messages ?? data;
        if (!Array.isArray(list)) return;
        setMessagesState(prev => ({ ...prev, [activeConv]: apiToMessages(list) }));
      }).catch(() => {});
  }, [activeConv]);

  const conv = conversations.find(c => c.id === activeConv) ?? conversations[0] ?? CONVERSATIONS[0];
  const messages = messagesState[activeConv] || [];

  const filteredConvs = conversations.filter(c =>
    !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /* ── Send message — wired to POST /api/messages/send ── */
  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    const text = newMessage.trim();
    setNewMessage('');
    const msg: Message = {
      id: `m${Date.now()}`, from: 'me', text,
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      read: false,
    };
    // Optimistic update
    setMessagesState(p => ({ ...p, [activeConv]: [...(p[activeConv] || []), msg] }));
    setConversations(prev => prev.map(c => c.id === activeConv ? { ...c, lastMsg: text, time: msg.time } : c));
    // POST to API
    try {
      const h = getAuthHeaders();
      const res = await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...h },
        body: JSON.stringify({ conversationId: activeConv, content: text }),
      });
      if (res.ok) {
        setMessagesState(p => ({
          ...p,
          [activeConv]: (p[activeConv] || []).map(m => m.id === msg.id ? { ...m, read: true } : m),
        }));
      }
    } catch {}
  };

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
          {msgCount > 0 && <div style={{ position: 'absolute', top: -5, right: -5, background: RED, borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#fff', pointerEvents: 'none' }}>{msgCount}</div>}
        </div>
        <div onClick={() => router.push('/agency/notifications')} style={{ position: 'relative', cursor: 'pointer' }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bell size={15} color="rgba(255,255,255,0.7)" />
          </div>
          {notifCount > 0 && <div style={{ position: 'absolute', top: -5, right: -5, background: RED, borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#fff', pointerEvents: 'none' }}>{notifCount}</div>}
        </div>
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer' }} onClick={() => setProfileOpen(v => !v)}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#1a1410,#2a1e0e)', border: `2px solid ${GOLD}60`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: GOLD, fontFamily: BEBAS }}>{agencyInitials}</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.2 }}>{agencyName}</div>
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
                  { label: 'Subscription & Billing', href: '/pricing' },
                  { label: 'Company Profile', href: '/agency-profile' },
                  { label: 'Documents', href: '/agency/documents' },
                  { label: 'Calendar', href: '/agency/calendar' },
                  { label: 'Settings', href: '/agency/settings' },
                  { label: 'Support', href: '/contact' },
                  { label: 'Logout', href: '/login' },
                ].map(({ label, href }) => (
                  <div key={label} onClick={() => { if (label === 'Logout') { localStorage.removeItem('ss_user'); window.location.replace('/login'); } else { router.push(href); setProfileOpen(false); } }}
                    style={{ padding: '10px 16px', fontSize: 15, cursor: 'pointer', color: label === 'Logout' ? '#ff6b6b' : '#F5F5F5', borderTop: label === 'Logout' ? '1px solid rgba(255,255,255,0.07)' : 'none' }}
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
              <div style={{ width: 38, height: 38, borderRadius: 9, background: 'linear-gradient(135deg,#1a1410,#2a1e0e)', border: `1px solid ${GOLD}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: GOLD, fontFamily: BEBAS, flexShrink: 0 }}>{agencyInitials}</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#F5F5F5', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{agencyName}</div>
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
                  {sidebarOpen && <span style={{ fontSize: 14, fontWeight: active ? 600 : 400, color: active ? '#F5F5F5' : 'rgba(255,255,255,0.6)', whiteSpace: 'nowrap' }}>{label}</span>}
                </div>
                {sidebarOpen && badge && <div style={{ background: RED, color: '#fff', borderRadius: 10, fontSize: 14, fontWeight: 700, padding: '1px 6px', minWidth: 18, textAlign: 'center' }}>{badge}</div>}
                {!sidebarOpen && badge && <div style={{ position: 'absolute', top: 6, right: 4, background: RED, borderRadius: '50%', width: 14, height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 700, color: '#fff' }}>{badge}</div>}
              </div>
            ))}
          </nav>
          {sidebarOpen && (
            <div style={{ margin: '8px 10px 14px', borderRadius: 12, background: 'linear-gradient(135deg,#1a1205,#2a1e0a)', border: '1px solid rgba(212,166,74,0.25)', padding: '14px 12px', textAlign: 'center', flexShrink: 0 }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>👑</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: GOLD, marginBottom: 3 }}>Upgrade to Pro</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 10, lineHeight: 1.5 }}>Unlock unlimited messaging and priority support.</div>
              <button onClick={() => router.push('/pricing')} style={{ width: '100%', background: GOLD, color: '#000', border: 'none', borderRadius: 8, padding: '7px 0', fontSize: 14, fontWeight: 700, fontFamily: BARLOW, cursor: 'pointer' }}>Upgrade Now</button>
            </div>
          )}
        </aside>

        {/* ── MESSAGES LAYOUT ── */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

          {/* Conversation list */}
          <div style={{ width: 300, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', background: BG2 }}>
            {/* Header */}
            <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div onClick={() => router.back()} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 14, color: 'rgba(255,255,255,0.4)', cursor: 'pointer', marginBottom: 10, width: 'fit-content' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
              >
                <ChevronLeft size={13} /> Back
              </div>
              <div style={{ fontSize: 18, fontFamily: BEBAS, letterSpacing: 1, color: '#fff', marginBottom: 10 }}>Messages</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '7px 12px' }}>
                <Search size={14} color="rgba(255,255,255,0.4)" />
                <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search conversations..." style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: 14, color: '#fff', fontFamily: BARLOW, flex: 1 }} />
              </div>
            </div>

            {/* Conversation rows */}
            <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none' }}>
              {filteredConvs.map(c => (
                <div key={c.id} onClick={() => setActiveConv(c.id)}
                  style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 16px', cursor: 'pointer', background: activeConv === c.id ? 'rgba(200,32,42,0.1)' : 'transparent', borderLeft: activeConv === c.id ? `3px solid ${RED}` : '3px solid transparent', transition: 'background 0.1s' }}
                  onMouseEnter={e => { if (activeConv !== c.id) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                  onMouseLeave={e => { if (activeConv !== c.id) e.currentTarget.style.background = 'transparent'; }}
                >
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <div style={{ width: 42, height: 42, borderRadius: '50%', background: c.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: '#fff', fontFamily: BEBAS }}>
                      {c.avatar}
                    </div>
                    {c.online && <div style={{ position: 'absolute', bottom: 1, right: 1, width: 10, height: 10, borderRadius: '50%', background: GREEN, border: `2px solid ${BG2}` }} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 3 }}>
                      <span style={{ fontSize: 14, fontWeight: c.unread > 0 ? 700 : 500, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</span>
                      <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', flexShrink: 0, marginLeft: 6 }}>{c.time}</span>
                    </div>
                    <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.role}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 14, color: c.unread > 0 ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.35)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{c.lastMsg}</span>
                      {c.unread > 0 && <div style={{ width: 18, height: 18, borderRadius: '50%', background: RED, color: '#fff', fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginLeft: 6 }}>{c.unread}</div>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat window */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

            {/* Chat header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: BG2, flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ position: 'relative' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: conv.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: '#fff', fontFamily: BEBAS }}>
                    {conv.avatar}
                  </div>
                  {conv.online && <div style={{ position: 'absolute', bottom: 1, right: 1, width: 9, height: 9, borderRadius: '50%', background: GREEN, border: `2px solid ${BG2}` }} />}
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{conv.name}</div>
                  <div style={{ fontSize: 14, color: conv.online ? GREEN : 'rgba(255,255,255,0.4)' }}>{conv.online ? 'Online' : 'Offline'} · {conv.role}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {[
                  { icon: <Phone size={15} />, label: 'Call',    onClick: () => {} },
                  { icon: <Video size={15} />, label: 'Video',   onClick: () => {} },
                  { icon: <Info size={15} />,  label: 'Profile', onClick: () => router.push(`/agency/talent/${activeConv === 'c1' ? 'a1' : activeConv === 'c2' ? 'a2' : 'a1'}`) },
                  { icon: <MoreHorizontal size={15} />, label: 'More', onClick: () => {} },
                ].map(({ icon, label, onClick }) => (
                  <button key={label} onClick={onClick} title={label} style={{ width: 34, height: 34, borderRadius: 8, background: BG3, border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.6)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = BG4)}
                    onMouseLeave={e => (e.currentTarget.style.background = BG3)}
                  >{icon}</button>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none', padding: '20px 20px 10px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {messages.map(msg => (
                <div key={msg.id} style={{ display: 'flex', justifyContent: msg.from === 'me' ? 'flex-end' : 'flex-start', alignItems: 'flex-end', gap: 8 }}>
                  {msg.from === 'them' && (
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: conv.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: '#fff', fontFamily: BEBAS, flexShrink: 0, marginBottom: 2 }}>
                      {conv.avatar}
                    </div>
                  )}
                  <div style={{ maxWidth: '65%' }}>
                    <div style={{
                      background: msg.from === 'me' ? RED : BG3,
                      borderRadius: msg.from === 'me' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      padding: '10px 14px',
                      fontSize: 14,
                      color: '#fff',
                      lineHeight: 1.55,
                      border: msg.from === 'them' ? '1px solid rgba(255,255,255,0.07)' : 'none',
                    }}>
                      {msg.text}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4, justifyContent: msg.from === 'me' ? 'flex-end' : 'flex-start' }}>
                      <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)' }}>{msg.time}</span>
                      {msg.from === 'me' && (
                        msg.read
                          ? <CheckCheck size={12} color={BLUE} />
                          : <Check size={12} color="rgba(255,255,255,0.3)" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Message input */}
            <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.06)', background: BG2, flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: BG3, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '8px 12px' }}>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 4, color: 'rgba(255,255,255,0.4)' }}>
                  <Paperclip size={16} />
                </button>
                <input
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  placeholder="Type a message..."
                  style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 14, color: '#fff', fontFamily: BARLOW }}
                />
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 4, color: 'rgba(255,255,255,0.4)' }}>
                  <Smile size={16} />
                </button>
                <button onClick={sendMessage} style={{ width: 34, height: 34, borderRadius: 8, background: newMessage.trim() ? RED : 'rgba(255,255,255,0.06)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: newMessage.trim() ? 'pointer' : 'default', transition: 'background 0.15s', flexShrink: 0 }}>
                  <Send size={15} color={newMessage.trim() ? '#fff' : 'rgba(255,255,255,0.3)'} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}