'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
  { icon: MessageSquare,   label: 'Messages',                href: '/agency/messages', active: true },
  { icon: Bell,            label: 'Notifications',           href: '/agency/notifications' },
];

interface Conversation {
  id: string; name: string; role: string; avatar: string; gradient: string;
  lastMsg: string; time: string; unread: number; online: boolean;
}

interface Message {
  id: string; from: 'me' | 'them'; text: string; time: string; read: boolean;
}

const GRADIENTS = [
  'linear-gradient(135deg,#667eea,#764ba2)', 'linear-gradient(135deg,#f093fb,#f5576c)',
  'linear-gradient(135deg,#4facfe,#00f2fe)', 'linear-gradient(135deg,#43e97b,#38f9d7)',
  'linear-gradient(135deg,#fa709a,#fee140)', 'linear-gradient(135deg,#a18cd1,#fbc2eb)',
  'linear-gradient(135deg,#fccb90,#d57eeb)',
];

function getAuthHeaders(): Record<string, string> {
  try {
    const u = JSON.parse(localStorage.getItem('ss_user') || '{}');
    return u.token ? { Authorization: `Bearer ${u.token}` } : {};
  } catch { return {}; }
}

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

function apiToMessages(list: any[], currentUserId: string): Message[] {
  return list.map((m: any, i: number) => ({
    id:   String(m.id ?? m._id ?? i),
    from: (m.isOwn ?? m.sender_id === currentUserId) ? 'me' : 'them',
    text: m.content ?? m.text ?? '',
    time: m.sent_at ?? m.createdAt
      ? new Date(m.sent_at ?? m.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
      : m.time ?? '',
    read: m.is_read ?? m.read ?? true,
  }));
}

function makePlaceholder(recipientId: string, recipientName: string): Conversation {
  const name = recipientName || 'Aspirant';
  return {
    id:       `new_${recipientId}`,
    name,
    role:     'Aspirant',
    avatar:   name.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase(),
    gradient: GRADIENTS[0],
    lastMsg:  'Start a conversation',
    time:     '',
    unread:   0,
    online:   false,
  };
}

export default function MessagesPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();

  // Read URL params immediately — before any async work
  const recipientId   = searchParams.get('recipient_id') ?? '';
  const recipientName = searchParams.get('recipient_name') ?? '';

  const [sidebarOpen,    setSidebarOpen]    = useState(false);
  const [profileOpen,    setProfileOpen]    = useState(false);
  const [searchQuery,    setSearchQuery]    = useState('');
  const [newMessage,     setNewMessage]     = useState('');
  const [messagesState,  setMessagesState]  = useState<Record<string, Message[]>>({});
  const [conversations,  setConversations]  = useState<Conversation[]>(() => {
    // ← If URL has a recipient, immediately seed the placeholder so the chat
    //   window is visible before the API responds
    if (recipientId) return [makePlaceholder(recipientId, recipientName)];
    return [];
  });
  const [activeConv,     setActiveConv]     = useState<string>(() =>
    recipientId ? `new_${recipientId}` : ''
  );
  const [loadingConvs,   setLoadingConvs]   = useState(true);
  const [agencyName,     setAgencyName]     = useState('My Agency');
  const [agencyInitials, setAgencyInitials] = useState('AG');
  const [agencyId,       setAgencyId]       = useState('AGE·········');
  const [agencyType,     setAgencyType]     = useState('Production House');
  const [msgCount,       setMsgCount]       = useState(0);
  const [notifCount,     setNotifCount]     = useState(0);
  const [currentUserId,  setCurrentUserId]  = useState('');

  const chatEndRef = useRef<HTMLDivElement>(null);
  const SB_W = sidebarOpen ? 230 : 52;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv, messagesState]);

  // Load agency identity from localStorage
  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('ss_user') || '{}');
      if (u.name) {
        setAgencyName(u.name);
        setAgencyInitials(u.name.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase());
      }
      if (u.profileNumber) setAgencyId(u.profileNumber);
      if (u.id) setCurrentUserId(u.id);
    } catch {}
  }, []);

  // Fetch real conversations and merge with placeholder
  useEffect(() => {
    const h = getAuthHeaders();

    fetch('/api/messages/conversations', { headers: h })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        const list = data.data?.conversations ?? data.conversations ?? [];
        if (!Array.isArray(list)) return;

        const normalised = list.map((c: any, i: number) => apiToConversation(c, i));
        setMsgCount(normalised.filter((c: Conversation) => c.unread > 0).length);

        if (recipientId) {
          // Check if a real conversation already exists with this recipient
          const existing = normalised.find((c: Conversation, i: number) => {
            const raw = list[i];
            return (
              raw?.aspirant_id === recipientId ||
              raw?.agency_id   === recipientId ||
              raw?.otherParty?.id === recipientId ||
              c.name.toLowerCase() === recipientName.toLowerCase()
            );
          });

          if (existing) {
            // Replace placeholder with real conversation
            setConversations([existing, ...normalised.filter(c => c.id !== existing.id)]);
            setActiveConv(existing.id);
          } else {
            // Keep placeholder at top, append real conversations below
            setConversations([makePlaceholder(recipientId, recipientName), ...normalised]);
            setActiveConv(`new_${recipientId}`);
          }
        } else {
          setConversations(normalised);
          if (normalised.length > 0 && !activeConv) {
            setActiveConv(normalised[0].id);
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoadingConvs(false));

    // Agency profile
    fetch('/api/profile/agency', { headers: h })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        const p = data.data?.profile ?? data.profile ?? data;
        if (p.company_name || p.companyName || p.name) {
          const name = p.company_name ?? p.companyName ?? p.name;
          setAgencyName(name);
          setAgencyInitials(name.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase());
        }
        if (p.profile_number ?? p.profileNumber) setAgencyId(p.profile_number ?? p.profileNumber);
        if (p.company_type  ?? p.companyType)    setAgencyType(p.company_type ?? p.companyType);
      }).catch(() => {});

    // Notifications count
    fetch('/api/notifications', { headers: h })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        const count = data.data?.unread_count ?? data.unread_count;
        if (count != null) setNotifCount(count);
      }).catch(() => {});
  }, []);

  // Fetch messages when active conversation changes
  useEffect(() => {
    if (!activeConv || activeConv.startsWith('new_')) return;
    const h = getAuthHeaders();
    fetch(`/api/messages/${activeConv}`, { headers: h })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        const list = data.data?.messages ?? data.messages ?? [];
        if (!Array.isArray(list)) return;
        setMessagesState(prev => ({ ...prev, [activeConv]: apiToMessages(list, currentUserId) }));
      }).catch(() => {});
  }, [activeConv, currentUserId]);

  const conv     = conversations.find(c => c.id === activeConv) ?? null;
  const messages = messagesState[activeConv] || [];
  const filteredConvs = conversations.filter(c =>
    !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeConv) return;
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

    try {
      const h = getAuthHeaders();
      const isNew = activeConv.startsWith('new_');
      const rid   = isNew ? activeConv.replace('new_', '') : undefined;

      const body = isNew
        ? { recipient_id: rid, content: text }
        : { conversationId: activeConv, content: text };

      const res = await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...h },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const data = await res.json();
        const realConvId = String(data.data?.conversation_id ?? data.conversation_id ?? '');

        if (isNew && realConvId) {
          // Replace placeholder with real conversation ID
          setConversations(prev => prev.map(c =>
            c.id === activeConv ? { ...c, id: realConvId } : c
          ));
          setMessagesState(prev => {
            const msgs = prev[activeConv] ?? [];
            const next = { ...prev };
            delete next[activeConv];
            next[realConvId] = msgs.map(m => m.id === msg.id ? { ...m, read: true } : m);
            return next;
          });
          setActiveConv(realConvId);
          router.replace('/agency/messages');
        } else {
          setMessagesState(p => ({
            ...p,
            [activeConv]: (p[activeConv] || []).map(m => m.id === msg.id ? { ...m, read: true } : m),
          }));
        }
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
                  { label: 'Reports & Analytics',   href: '/agency/reports'   },
                  { label: 'Subscription & Billing', href: '/pricing'          },
                  { label: 'Company Profile',        href: '/agency-profile'   },
                  { label: 'Documents',              href: '/agency/documents' },
                  { label: 'Calendar',               href: '/agency/calendar'  },
                  { label: 'Settings',               href: '/agency/settings'  },
                  { label: 'Support',                href: '/contact'          },
                  { label: 'Logout',                 href: '/login'            },
                ].map(({ label, href }) => (
                  <div key={label} onClick={() => {
                    if (label === 'Logout') { localStorage.removeItem('ss_user'); window.location.replace('/login'); }
                    else { router.push(href); setProfileOpen(false); }
                  }}
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

        {/* ── SIDEBAR ── */}
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
                style={{ display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'space-between' : 'center', padding: sidebarOpen ? '8px 10px' : '10px 0', marginBottom: 2, borderRadius: 6, cursor: 'pointer', background: active ? 'rgba(200,32,42,0.12)' : 'transparent', borderLeft: sidebarOpen && active ? `3px solid ${RED}` : sidebarOpen ? '3px solid transparent' : 'none' }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = active ? 'rgba(200,32,42,0.12)' : 'transparent'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: sidebarOpen ? 9 : 0 }}>
                  <Icon size={15} color={active ? RED : 'rgba(255,255,255,0.42)'} strokeWidth={active ? 2.5 : 1.8} />
                  {sidebarOpen && <span style={{ fontSize: 14, color: active ? '#fff' : 'rgba(255,255,255,0.6)', fontWeight: active ? 700 : 400, whiteSpace: 'nowrap' }}>{label}</span>}
                </div>
                {sidebarOpen && badge && <div style={{ background: RED, color: '#fff', borderRadius: 12, fontSize: 14, fontWeight: 700, padding: '1px 6px', minWidth: 18, textAlign: 'center' }}>{badge}</div>}
              </div>
            ))}
          </nav>
        </aside>

        {/* ── MESSAGES PANEL ── */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

          {/* Conversations list */}
          <div style={{ width: 300, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', background: BG2 }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <button onClick={() => router.push('/agency/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', fontSize: 14, fontFamily: BARLOW, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12, padding: 0 }}>
                <ChevronLeft size={14} /> Back
              </button>
              <div style={{ fontFamily: BEBAS, fontSize: 20, letterSpacing: 1, marginBottom: 12 }}>MESSAGES</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: BG3, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '7px 10px' }}>
                <Search size={13} color="rgba(255,255,255,0.35)" />
                <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search conversations..." style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 14, color: '#fff', fontFamily: BARLOW }} />
              </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none' }}>
              {loadingConvs && filteredConvs.filter(c => !c.id.startsWith('new_')).length === 0 && (
                <div style={{ padding: '32px 0', textAlign: 'center', fontSize: 14, color: 'rgba(255,255,255,0.3)' }}>Loading…</div>
              )}
              {!loadingConvs && filteredConvs.length === 0 && (
                <div style={{ padding: '32px 16px', textAlign: 'center', fontSize: 14, color: 'rgba(255,255,255,0.3)' }}>No conversations yet</div>
              )}
              {filteredConvs.map(c => (
                <div key={c.id} onClick={() => setActiveConv(c.id)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', cursor: 'pointer', borderLeft: `3px solid ${activeConv === c.id ? RED : 'transparent'}`, background: activeConv === c.id ? 'rgba(200,32,42,0.08)' : 'transparent', transition: 'all 0.15s' }}
                  onMouseEnter={e => { if (activeConv !== c.id) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = activeConv === c.id ? 'rgba(200,32,42,0.08)' : 'transparent'; }}
                >
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: c.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: '#fff', fontFamily: BEBAS }}>{c.avatar}</div>
                    {c.online && <div style={{ position: 'absolute', bottom: 1, right: 1, width: 9, height: 9, borderRadius: '50%', background: GREEN, border: `2px solid ${BG2}` }} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
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

            {!conv ? (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, color: 'rgba(255,255,255,0.3)' }}>
                <MessageSquare size={40} color="rgba(255,255,255,0.1)" />
                <div style={{ fontSize: 16 }}>Select a conversation to start messaging</div>
              </div>
            ) : (
              <>
                {/* Chat header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: BG2, flexShrink: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ position: 'relative' }}>
                      <div style={{ width: 40, height: 40, borderRadius: '50%', background: conv.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: '#fff', fontFamily: BEBAS }}>{conv.avatar}</div>
                      {conv.online && <div style={{ position: 'absolute', bottom: 1, right: 1, width: 9, height: 9, borderRadius: '50%', background: GREEN, border: `2px solid ${BG2}` }} />}
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{conv.name}</div>
                      <div style={{ fontSize: 14, color: conv.online ? GREEN : 'rgba(255,255,255,0.4)' }}>
                        {conv.online ? 'Online' : 'Offline'}{conv.role ? ` · ${conv.role}` : ''}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {[
                      { icon: <Phone size={15} />,          label: 'Call'    },
                      { icon: <Video size={15} />,          label: 'Video'   },
                      { icon: <Info size={15} />,           label: 'Profile' },
                      { icon: <MoreHorizontal size={15} />, label: 'More'    },
                    ].map(({ icon, label }) => (
                      <button key={label} title={label} style={{ width: 34, height: 34, borderRadius: 8, background: BG3, border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.6)' }}
                        onMouseEnter={e => (e.currentTarget.style.background = BG4)}
                        onMouseLeave={e => (e.currentTarget.style.background = BG3)}
                      >{icon}</button>
                    ))}
                  </div>
                </div>

                {/* Messages area */}
                <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none', padding: '20px 20px 10px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {activeConv.startsWith('new_') && messages.length === 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: 12, padding: '40px 0' }}>
                      <div style={{ width: 56, height: 56, borderRadius: '50%', background: conv.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 800, color: '#fff', fontFamily: BEBAS }}>{conv.avatar}</div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>{conv.name}</div>
                      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', textAlign: 'center', maxWidth: 280, lineHeight: 1.6 }}>
                        This is the start of your conversation with <strong style={{ color: '#fff' }}>{conv.name}</strong>. Type a message below to get started.
                      </div>
                    </div>
                  )}
                  {!activeConv.startsWith('new_') && messages.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '40px 0', fontSize: 14, color: 'rgba(255,255,255,0.3)' }}>No messages yet. Say hello!</div>
                  )}
                  {messages.map(msg => (
                    <div key={msg.id} style={{ display: 'flex', justifyContent: msg.from === 'me' ? 'flex-end' : 'flex-start', alignItems: 'flex-end', gap: 8 }}>
                      {msg.from === 'them' && (
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: conv.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: '#fff', fontFamily: BEBAS, flexShrink: 0, marginBottom: 2 }}>
                          {conv.avatar}
                        </div>
                      )}
                      <div style={{ maxWidth: '65%' }}>
                        <div style={{ background: msg.from === 'me' ? RED : BG3, borderRadius: msg.from === 'me' ? '16px 16px 4px 16px' : '16px 16px 16px 4px', padding: '10px 14px', fontSize: 14, color: '#fff', lineHeight: 1.55, border: msg.from === 'them' ? '1px solid rgba(255,255,255,0.07)' : 'none' }}>
                          {msg.text}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4, justifyContent: msg.from === 'me' ? 'flex-end' : 'flex-start' }}>
                          <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)' }}>{msg.time}</span>
                          {msg.from === 'me' && (msg.read ? <CheckCheck size={12} color={BLUE} /> : <Check size={12} color="rgba(255,255,255,0.3)" />)}
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
                      placeholder={`Message ${conv.name}…`}
                      autoFocus
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}