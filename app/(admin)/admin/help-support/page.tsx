"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Home,
  Users,
  CheckCircle2,
  Building2,
  ClipboardCheck,
  FileText,
  BarChart3,
  AlertTriangle,
  Layers,
  Megaphone,
  Bell,
  MessageSquare,
  CreditCard,
  Settings as SettingsIcon,
  Lock,
  ScrollText,
  ChevronLeft,
  ChevronRight,
  Menu,
  ChevronDown,
  Inbox,
  Search,
  Plus,
  BookOpen,
  HelpCircle,
  Ticket,
  MessageCircle,
  PlayCircle,
  Download,
  Mail,
  Phone,
  ShieldCheck,
  FileBadge2,
  Video,
  FileBarChart2,
  Zap,
  UserPlus,
  UserCog,
  Drama,
  Megaphone as MegaphoneIcon,
  Clapperboard,
  Wallet,
  Layers as LayersIcon,
  Megaphone as AdsIcon,
  BarChart4,
  Cog,
} from "lucide-react";

// ---------- Design tokens (Admin pages) ----------
const RED = "#C8202A";
const GOLD = "#D4A64A";
const GREEN = "#22C55E";
const BLUE = "#3B82F6";
const PURPLE = "#8B5CF6";
const ORANGE = "#F97316";
const TEAL = "#14B8A6";
const PINK = "#EC4899";
const BG = "#0D1117";
const BG2 = "#131720";
const BG3 = "#181E2A";
const BG4 = "#1C2338";
const BEBAS = "'Bebas Neue', sans-serif";
const BARLOW = "'Barlow Condensed', sans-serif";
const BORDER = "#252C3A";
const TEXT_MUTED = "#8B93A3";

// ---------- Nav config (flat list, mirrors real dashboard sidebar) ----------
type NavItem = { label: string; href: string; icon: React.ElementType; built: boolean };

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: Home, built: true },
  { label: "User Management", href: "/admin/users", icon: Users, built: true },
  { label: "Talent Verification", href: "/admin/talent-verification", icon: CheckCircle2, built: true },
  { label: "Agency Verification", href: "/admin/agency-verification", icon: Building2, built: true },
  { label: "Applications Monitoring", href: "/admin/applications", icon: ClipboardCheck, built: true },
  { label: "Reports & Complaints", href: "/admin/reports", icon: FileText, built: true },
  { label: "Fraud Detection", href: "/admin/fraud-detection", icon: AlertTriangle, built: true },
  { label: "Subscription Management", href: "/admin/subscriptions", icon: CreditCard, built: true },
  { label: "Advertisement Management", href: "/admin/advertisements", icon: Megaphone, built: true },
  { label: "CMS Management", href: "/admin/cms", icon: Layers, built: true },
  { label: "Notifications Management", href: "/admin/notifications-management", icon: Bell, built: true },
  { label: "Analytics & Reports", href: "/admin/analytics", icon: BarChart3, built: true },
  { label: "Support Tickets", href: "/admin/support-tickets", icon: Inbox, built: true },
  { label: "Audit Logs", href: "/admin/audit-logs", icon: ScrollText, built: true },
  { label: "Roles & Permissions", href: "/admin/roles-permissions", icon: Lock, built: true },
  { label: "System Settings", href: "/admin/settings", icon: SettingsIcon, built: true },
];

const PROFILE_MENU = [
  { label: "My Profile", href: "/admin/profile", built: true },
  { label: "Account Settings", href: "/admin/account-settings", built: true },
  { label: "Security & Login", href: "/admin/security-login", built: true },
  { label: "Activity Log", href: "/admin/activity-log", built: true },
  { label: "Help & Support", href: "/admin/help-support", built: true },
  { label: "Logout", href: "/login", built: true },
];

function go(router: ReturnType<typeof useRouter>, item: { href: string; built: boolean; label: string }) {
  if (item.built) {
    router.push(item.href);
  } else {
    alert(`"${item.label}" page is not built yet. (404)`);
  }
}

function notBuilt(label: string) {
  alert(`"${label}" page is not built yet. (404)`);
}

function RailCard({ title, color, children, action }: { title: string; color: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div style={{ background: BG2, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 18 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <h3 style={{ fontFamily: BARLOW, fontWeight: 700, fontSize: 15, color, margin: 0, letterSpacing: 0.5 }}>{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}

const HELP_CARDS = [
  { id: "kb", icon: BookOpen, iconBg: ORANGE, title: "Knowledge Base", desc: "Browse guides, articles and documentation", built: false },
  { id: "faq", icon: HelpCircle, iconBg: GREEN, title: "FAQs", desc: "Find answers to commonly asked questions", built: false },
  { id: "tickets", icon: Ticket, iconBg: BLUE, title: "My Tickets", desc: "View your support tickets and their status", built: true, href: "/admin/support-tickets" },
  { id: "chat", icon: MessageCircle, iconBg: PURPLE, title: "Live Chat", desc: "Chat with our support team in real-time", built: false },
  { id: "videos", icon: PlayCircle, iconBg: ORANGE, title: "Video Tutorials", desc: "Watch step-by-step video guides", built: false },
  { id: "downloads", icon: Download, iconBg: BLUE, title: "Downloads", desc: "Download resources, templates and more", built: false },
];

const POPULAR_SEARCHES = ["How to add new user", "Subscription Plans", "Agency Verification", "Payment Issues", "Profile Approval"];

const TICKETS = [
  { id: "#SS-1258", subject: "Unable to approve talent profile", category: "Talent Verification", catColor: PURPLE, priority: "High", priorityColor: RED, status: "In Progress", statusColor: BLUE, updated: "24 May 2026, 10:35 AM" },
  { id: "#SS-1257", subject: "Payment gateway integration issue", category: "Payments", catColor: GREEN, priority: "High", priorityColor: RED, status: "Open", statusColor: GOLD, updated: "24 May 2026, 09:15 AM" },
  { id: "#SS-1256", subject: "Advertisement not publishing", category: "Advertisements", catColor: ORANGE, priority: "Medium", priorityColor: GOLD, status: "In Progress", statusColor: BLUE, updated: "23 May 2026, 06:40 PM" },
  { id: "#SS-1255", subject: "Unable to add new agency", category: "User Management", catColor: BLUE, priority: "Medium", priorityColor: GOLD, status: "Resolved", statusColor: GREEN, updated: "23 May 2026, 03:20 PM" },
  { id: "#SS-1254", subject: "Subscription plan update required", category: "Subscription Plans", catColor: TEAL, priority: "Low", priorityColor: GREEN, status: "Closed", statusColor: TEXT_MUTED, updated: "22 May 2026, 11:10 AM" },
];

const KB_CATEGORIES = [
  { label: "Getting Started", count: 12, icon: Zap, color: BLUE },
  { label: "User Management", count: 18, icon: UserCog, color: PURPLE },
  { label: "Talent & Profiles", count: 22, icon: Drama, color: GREEN },
  { label: "Agency Management", count: 15, icon: Building2, color: ORANGE },
  { label: "Casting & Applications", count: 20, icon: Clapperboard, color: PINK },
  { label: "Payments & Billing", count: 16, icon: Wallet, color: BLUE },
  { label: "Subscription Plans", count: 14, icon: LayersIcon, color: ORANGE },
  { label: "Advertisements", count: 19, icon: AdsIcon, color: PURPLE },
  { label: "Reports & Analytics", count: 13, icon: BarChart4, color: RED },
  { label: "System Settings", count: 17, icon: Cog, color: TEXT_MUTED },
];

export default function HelpSupportPage() {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifPanelOpen, setNotifPanelOpen] = useState(false);
  const [msgPanelOpen, setMsgPanelOpen] = useState(false);
  const [search, setSearch] = useState("");

  const topbarNotifications = [
    { id: 1, text: "New agency verification request submitted", time: "5 minutes ago", read: false },
    { id: 2, text: "Payment gateway Stripe was disconnected", time: "32 minutes ago", read: false },
    { id: 3, text: "Subscription plan renewed for Razorpay Studios", time: "1 hour ago", read: false },
    { id: 4, text: "Weekly platform report is ready to download", time: "Yesterday", read: true },
  ];
  const topbarMessages = [
    { id: 1, sender: "Priya Sharma (Verifier)", text: "Can you review the pending talent docs?", time: "10 minutes ago", read: false },
    { id: 2, sender: "Arjun Mehta (Content Moderator)", text: "Flagged 3 casting calls for spam.", time: "1 hour ago", read: false },
    { id: 3, sender: "Support Team", text: "Ticket #2245 has been escalated to you.", time: "2 hours ago", read: true },
  ];

  const handleSearch = () => {
    if (search.trim()) {
      alert(`Searching help articles for "${search}" (demo action).`);
    }
  };

  const sidebarWidth = collapsed ? 52 : 220;

  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: BARLOW, color: "#E6E8EC" }}>
      {/* ---------------- TOPNAV ---------------- */}
      <div style={{ height: 68, background: BG2, borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
            <span style={{ fontFamily: BEBAS, fontSize: 26, letterSpacing: 1, color: "#fff" }}>SILVER</span>
            <span style={{ fontFamily: BEBAS, fontSize: 26, letterSpacing: 1, color: RED, borderBottom: `2px solid ${RED}`, paddingBottom: 1 }}>SCREENS</span>
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, padding: "4px 10px", borderRadius: 5, background: RED, color: "#fff" }}>ADMIN</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ position: "relative" }}>
            <button onClick={() => { setMsgPanelOpen((o) => !o); setNotifPanelOpen(false); setProfileOpen(false); }} style={{ background: "transparent", border: "none", color: "#cfd3da", cursor: "pointer", position: "relative" }} aria-label="Messages">
              <MessageSquare size={20} />
              <span style={{ position: "absolute", top: -6, right: -6, background: RED, color: "#fff", fontSize: 9, fontWeight: 700, borderRadius: 8, padding: "1px 5px" }}>{topbarMessages.filter((m) => !m.read).length}</span>
            </button>
            {msgPanelOpen && (
              <div style={{ position: "absolute", right: 0, top: 38, width: 320, background: BG3, border: `1px solid ${BORDER}`, borderRadius: 8, overflow: "hidden", boxShadow: "0 8px 24px rgba(0,0,0,0.4)", zIndex: 40 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", borderBottom: `1px solid ${BORDER}` }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Messages</span>
                  <span onClick={() => { setMsgPanelOpen(false); notBuilt("All Messages"); }} style={{ fontSize: 12, color: GOLD, cursor: "pointer" }}>View All</span>
                </div>
                {topbarMessages.map((m) => (
                  <div key={m.id} onClick={() => { setMsgPanelOpen(false); alert(`Open conversation with "${m.sender}" (demo action).`); }} style={{ padding: "11px 14px", borderBottom: `1px solid ${BORDER}`, cursor: "pointer", background: m.read ? "transparent" : "rgba(212,166,74,0.06)" }} onMouseEnter={(e) => (e.currentTarget.style.background = BG4)} onMouseLeave={(e) => (e.currentTarget.style.background = m.read ? "transparent" : "rgba(212,166,74,0.06)")}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{m.sender}</div>
                    <div style={{ fontSize: 12, color: TEXT_MUTED, marginTop: 2 }}>{m.text}</div>
                    <div style={{ fontSize: 11, color: TEXT_MUTED, marginTop: 4 }}>{m.time}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ position: "relative" }}>
            <button onClick={() => { setNotifPanelOpen((o) => !o); setMsgPanelOpen(false); setProfileOpen(false); }} style={{ background: "transparent", border: "none", color: "#cfd3da", cursor: "pointer", position: "relative" }} aria-label="Notifications">
              <Bell size={20} />
              <span style={{ position: "absolute", top: -6, right: -6, background: RED, color: "#fff", fontSize: 9, fontWeight: 700, borderRadius: 8, padding: "1px 5px" }}>{topbarNotifications.filter((n) => !n.read).length}</span>
            </button>
            {notifPanelOpen && (
              <div style={{ position: "absolute", right: 0, top: 38, width: 340, background: BG3, border: `1px solid ${BORDER}`, borderRadius: 8, overflow: "hidden", boxShadow: "0 8px 24px rgba(0,0,0,0.4)", zIndex: 40 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", borderBottom: `1px solid ${BORDER}` }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Notifications</span>
                  <span onClick={() => { setNotifPanelOpen(false); router.push("/admin/notifications"); }} style={{ fontSize: 12, color: GOLD, cursor: "pointer" }}>View All</span>
                </div>
                {topbarNotifications.map((n) => (
                  <div key={n.id} onClick={() => { setNotifPanelOpen(false); alert(`Open notification: "${n.text}" (demo action).`); }} style={{ padding: "11px 14px", borderBottom: `1px solid ${BORDER}`, cursor: "pointer", background: n.read ? "transparent" : "rgba(212,166,74,0.06)" }} onMouseEnter={(e) => (e.currentTarget.style.background = BG4)} onMouseLeave={(e) => (e.currentTarget.style.background = n.read ? "transparent" : "rgba(212,166,74,0.06)")}>
                    <div style={{ fontSize: 13, color: "#fff" }}>{n.text}</div>
                    <div style={{ fontSize: 11, color: TEXT_MUTED, marginTop: 4 }}>{n.time}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ position: "relative" }}>
            <button onClick={() => { setProfileOpen((p) => !p); setNotifPanelOpen(false); setMsgPanelOpen(false); }} style={{ display: "flex", alignItems: "center", gap: 10, background: "transparent", border: "none", cursor: "pointer", color: "#fff" }}>
              <img src="https://i.pravatar.cc/100?img=12" alt="Super Admin" style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", border: `1px solid ${GOLD}` }} />
              <div style={{ textAlign: "left", lineHeight: 1.25 }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>Super Admin</div>
                <div style={{ fontSize: 11, color: TEXT_MUTED }}>Administrator</div>
              </div>
              <ChevronDown size={14} color={TEXT_MUTED} />
            </button>
            {profileOpen && (
              <div style={{ position: "absolute", right: 0, top: 50, width: 220, background: BG3, border: `1px solid ${BORDER}`, borderRadius: 8, overflow: "hidden", boxShadow: "0 8px 24px rgba(0,0,0,0.4)", zIndex: 30 }}>
                {PROFILE_MENU.map((m) => (
                  <div key={m.label} onClick={() => { setProfileOpen(false); go(router, m); }} style={{ padding: "10px 14px", fontSize: 13, cursor: "pointer", color: m.label === "Logout" ? RED : "#E6E8EC", borderBottom: `1px solid ${BORDER}` }} onMouseEnter={(e) => (e.currentTarget.style.background = BG4)} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                    {m.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: "flex" }}>
        {/* ---------------- SIDEBAR ---------------- */}
        <div style={{ width: sidebarWidth, minWidth: sidebarWidth, background: BG2, borderRight: `1px solid ${BORDER}`, minHeight: "calc(100vh - 68px)", display: "flex", flexDirection: "column", transition: "width 0.2s ease", position: "sticky", top: 68, alignSelf: "flex-start" }}>
          <div style={{ display: "flex", justifyContent: collapsed ? "center" : "flex-end", padding: "10px 14px 0" }}>
            <button onClick={() => setCollapsed((c) => !c)} style={{ background: "transparent", border: "none", color: TEXT_MUTED, cursor: "pointer", display: "flex", alignItems: "center" }} aria-label="Toggle sidebar">
              {collapsed ? <Menu size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: collapsed ? "12px 0" : "10px 16px 16px", justifyContent: collapsed ? "center" : "flex-start" }}>
            <img src="https://i.pravatar.cc/100?img=12" alt="Super Admin" style={{ width: 38, height: 38, minWidth: 38, borderRadius: "50%", objectFit: "cover", border: `1px solid ${GOLD}` }} />
            {!collapsed && (
              <div style={{ lineHeight: 1.3 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Super Admin</div>
                <div style={{ fontSize: 12, color: RED, fontWeight: 600 }}>ADM000001</div>
              </div>
            )}
          </div>

          <div style={{ padding: "4px 8px 14px", flex: 1 }}>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} onClick={() => go(router, item)} title={collapsed ? item.label : undefined} style={{ display: "flex", alignItems: "center", gap: 10, padding: collapsed ? "10px 0" : "10px 12px", justifyContent: collapsed ? "center" : "flex-start", borderRadius: 6, cursor: "pointer", color: "#cfd3da", fontSize: 14, marginBottom: 2 }} onMouseEnter={(e) => (e.currentTarget.style.background = BG3)} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                  <Icon size={17} />
                  {!collapsed && <span>{item.label}</span>}
                </div>
              );
            })}
          </div>

          <div style={{ padding: "10px 8px", borderTop: `1px solid ${BORDER}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: collapsed ? "10px 0" : "9px 12px", justifyContent: collapsed ? "center" : "space-between", borderRadius: 6, background: "rgba(212,166,74,0.12)", border: `1px solid ${GOLD}`, color: GOLD, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <HelpCircle size={17} />
                {!collapsed && <span>Help & Support</span>}
              </div>
              {!collapsed && <ChevronRight size={14} />}
            </div>
          </div>
        </div>

        {/* ---------------- MAIN CONTENT ---------------- */}
        <div style={{ flex: 1, padding: "24px 28px", display: "flex", gap: 20 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <h1 style={{ fontFamily: BEBAS, fontSize: 32, letterSpacing: 1, color: GOLD, margin: 0 }}>HELP & SUPPORT</h1>
                <p style={{ fontSize: 14, color: TEXT_MUTED, margin: "4px 0 0" }}>We're here to help! Find answers, submit requests and get the support you need.</p>
              </div>
              <button
                onClick={() => router.push("/admin/support-tickets")}
                style={{ background: GOLD, color: BG, border: "none", borderRadius: 6, padding: "10px 18px", fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap" }}
              >
                <Plus size={15} />
                New Support Ticket
              </button>
            </div>

            {/* Search */}
            <div style={{ background: BG2, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 18, marginBottom: 20 }}>
              <div style={{ position: "relative", marginBottom: 12 }}>
                <input
                  style={{ width: "100%", background: BG3, border: `1px solid ${BORDER}`, borderRadius: 6, padding: "12px 44px 12px 14px", fontSize: 14, color: "#fff", fontFamily: BARLOW, outline: "none", boxSizing: "border-box" }}
                  placeholder="Search for help articles, guides and solutions..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <Search size={18} color={TEXT_MUTED} style={{ position: "absolute", right: 14, top: 13, cursor: "pointer" }} onClick={handleSearch} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <span style={{ fontSize: 12, color: TEXT_MUTED }}>Popular Searches:</span>
                {POPULAR_SEARCHES.map((s) => (
                  <span
                    key={s}
                    onClick={() => { setSearch(s); alert(`Searching help articles for "${s}" (demo action).`); }}
                    style={{ fontSize: 12, color: "#cfd3da", background: BG3, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "5px 12px", cursor: "pointer" }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* How can we help you */}
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontFamily: BARLOW, fontWeight: 700, fontSize: 18, color: GOLD, margin: "0 0 14px" }}>How can we help you?</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 14 }}>
                {HELP_CARDS.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => (c.built ? router.push(c.href!) : notBuilt(c.title))}
                    style={{ background: BG2, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 16, cursor: "pointer", display: "flex", flexDirection: "column", gap: 10 }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = GOLD)}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = BORDER)}
                  >
                    <div style={{ width: 38, height: 38, borderRadius: 9, background: `${c.iconBg}22`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <c.icon size={18} color={c.iconBg} />
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{c.title}</div>
                      <div style={{ fontSize: 11, color: TEXT_MUTED, marginTop: 3 }}>{c.desc}</div>
                    </div>
                    <ChevronRight size={16} color={GOLD} />
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Support Tickets */}
            <div style={{ background: BG2, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 20, marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <h2 style={{ fontFamily: BARLOW, fontWeight: 700, fontSize: 17, color: GOLD, margin: 0 }}>Recent Support Tickets</h2>
                <span onClick={() => router.push("/admin/support-tickets")} style={{ fontSize: 13, color: GOLD, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
                  View All Tickets
                  <ChevronRight size={13} />
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "0.8fr 1.7fr 1.1fr 0.7fr 0.9fr 1.1fr 0.4fr", padding: "0 0 8px", borderBottom: `1px solid ${BORDER}` }}>
                <div style={{ fontSize: 10, color: TEXT_MUTED, fontWeight: 600 }}>TICKET ID</div>
                <div style={{ fontSize: 10, color: TEXT_MUTED, fontWeight: 600 }}>SUBJECT</div>
                <div style={{ fontSize: 10, color: TEXT_MUTED, fontWeight: 600 }}>CATEGORY</div>
                <div style={{ fontSize: 10, color: TEXT_MUTED, fontWeight: 600 }}>PRIORITY</div>
                <div style={{ fontSize: 10, color: TEXT_MUTED, fontWeight: 600 }}>STATUS</div>
                <div style={{ fontSize: 10, color: TEXT_MUTED, fontWeight: 600 }}>LAST UPDATED</div>
                <div />
              </div>

              {TICKETS.map((t) => (
                <div
                  key={t.id}
                  onClick={() => router.push("/admin/support-tickets")}
                  style={{ display: "grid", gridTemplateColumns: "0.8fr 1.7fr 1.1fr 0.7fr 0.9fr 1.1fr 0.4fr", alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${BORDER}`, cursor: "pointer" }}
                >
                  <div style={{ fontSize: 13, color: GOLD }}>{t.id}</div>
                  <div style={{ fontSize: 13, color: "#fff" }}>{t.subject}</div>
                  <div>
                    <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 4, background: `${t.catColor}22`, color: t.catColor }}>{t.category}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#cfd3da" }}>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: t.priorityColor }} />
                    {t.priority}
                  </div>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 4, background: `${t.statusColor}22`, color: t.statusColor }}>{t.status}</span>
                  </div>
                  <div style={{ fontSize: 12, color: TEXT_MUTED }}>{t.updated}</div>
                  <div style={{ textAlign: "right" }}>
                    <ChevronRight size={15} color={TEXT_MUTED} />
                  </div>
                </div>
              ))}
            </div>

            {/* Knowledge Base Categories */}
            <div style={{ background: BG2, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 20 }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 4 }}>
                <div>
                  <h2 style={{ fontFamily: BARLOW, fontWeight: 700, fontSize: 17, color: GOLD, margin: 0 }}>Knowledge Base Categories</h2>
                  <div style={{ fontSize: 12, color: TEXT_MUTED }}>Browse our help articles by category.</div>
                </div>
                <span onClick={() => notBuilt("View All Articles")} style={{ fontSize: 13, color: GOLD, cursor: "pointer", display: "flex", alignItems: "center", gap: 5, whiteSpace: "nowrap" }}>
                  View All Articles
                  <ChevronRight size={13} />
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14, marginTop: 14 }}>
                {KB_CATEGORIES.map((c) => (
                  <div
                    key={c.label}
                    onClick={() => notBuilt(`${c.label} Knowledge Base`)}
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", border: `1px solid ${BORDER}`, borderRadius: 8, padding: "12px 14px", cursor: "pointer" }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = GOLD)}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = BORDER)}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: `${c.color}22`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <c.icon size={15} color={c.color} />
                      </div>
                      <div>
                        <div style={{ fontSize: 13, color: "#fff" }}>{c.label}</div>
                        <div style={{ fontSize: 11, color: TEXT_MUTED }}>{c.count} Articles</div>
                      </div>
                    </div>
                    <ChevronRight size={14} color={TEXT_MUTED} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ---------------- RIGHT RAIL ---------------- */}
          <div style={{ width: 300, minWidth: 300, display: "flex", flexDirection: "column", gap: 20 }}>
            <RailCard title="CONTACT SUPPORT" color={GOLD}>
              <div style={{ fontSize: 12, color: TEXT_MUTED, marginBottom: 14 }}>Our support team is available to assist you.</div>

              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0" }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: `${BLUE}22`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <MessageCircle size={16} color={BLUE} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: "#fff" }}>Live Chat</div>
                  <div style={{ fontSize: 11, color: TEXT_MUTED }}>Available 24/7</div>
                </div>
                <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 4, background: `${GREEN}22`, color: GREEN }}>Online</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0" }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: `${PURPLE}22`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Mail size={16} color={PURPLE} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: "#fff" }}>Email Support</div>
                  <div style={{ fontSize: 11, color: TEXT_MUTED }}>support@silverscreens.com</div>
                </div>
                <button onClick={() => (window.location.href = "mailto:support@silverscreens.com")} style={{ background: "transparent", border: `1px solid ${GOLD}`, color: GOLD, borderRadius: 6, padding: "5px 10px", fontSize: 11, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>
                  Email Us
                </button>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0" }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: `${GREEN}22`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Phone size={16} color={GREEN} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: "#fff" }}>Phone Support</div>
                  <div style={{ fontSize: 11, color: TEXT_MUTED }}>+91 44 4567 8901</div>
                </div>
                <button onClick={() => (window.location.href = "tel:+914445678901")} style={{ background: "transparent", border: `1px solid ${GOLD}`, color: GOLD, borderRadius: 6, padding: "5px 10px", fontSize: 11, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>
                  Call Us
                </button>
              </div>

              <div style={{ fontSize: 11, color: TEXT_MUTED, marginTop: 10, display: "flex", alignItems: "center", gap: 6 }}>
                <Inbox size={12} />
                Support Hours: 24/7 (All Days)
              </div>
            </RailCard>

            <RailCard
              title="SYSTEM STATUS"
              color={GOLD}
              action={
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: `${GREEN}22`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ShieldCheck size={15} color={GREEN} />
                </div>
              }
            >
              <div style={{ fontSize: 14, fontWeight: 700, color: GREEN, marginBottom: 4 }}>All systems are operational</div>
              <div style={{ fontSize: 11, color: TEXT_MUTED, marginBottom: 12 }}>Last updated: 24 May 2026, 10:45 AM</div>
              <span onClick={() => notBuilt("System Status")} style={{ fontSize: 13, color: GOLD, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
                View System Status
                <ChevronRight size={13} />
              </span>
            </RailCard>

            <RailCard title="HELP RESOURCES" color={GOLD}>
              {[
                { label: "Admin User Guide", desc: "Complete guide for administrators", tag: "PDF", color: RED, icon: FileBadge2 },
                { label: "Platform Walkthrough", desc: "Step-by-step platform overview", tag: "Video", color: BLUE, icon: Video },
                { label: "Best Practices", desc: "Recommended practices & tips", tag: "PDF", color: RED, icon: FileBadge2 },
                { label: "Release Notes", desc: "Latest updates and improvements", tag: "Docs", color: TEAL, icon: FileBarChart2 },
              ].map((r) => (
                <div
                  key={r.label}
                  onClick={() => alert(`Opening "${r.label}" (demo action).`)}
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: `1px solid ${BORDER}`, cursor: "pointer" }}
                >
                  <r.icon size={16} color={TEXT_MUTED} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: "#fff" }}>{r.label}</div>
                    <div style={{ fontSize: 11, color: TEXT_MUTED }}>{r.desc}</div>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 4, background: `${r.color}22`, color: r.color }}>{r.tag}</span>
                </div>
              ))}
            </RailCard>

            <RailCard title="NEED IMMEDIATE HELP?" color={GOLD}>
              <div style={{ fontSize: 12, color: TEXT_MUTED, lineHeight: 1.5, marginBottom: 14 }}>
                If you have an urgent issue that requires immediate attention, please contact our priority support line.
              </div>
              <button
                onClick={() => {
                  if (confirm("Contact priority support? This is reserved for urgent platform issues.")) {
                    alert("Connecting you to priority support (demo action).");
                  }
                }}
                style={{ width: "100%", background: "transparent", border: `1px solid ${GOLD}`, color: GOLD, borderRadius: 6, padding: "10px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}
              >
                <Zap size={14} />
                Contact Priority Support
              </button>
            </RailCard>
          </div>
        </div>
      </div>

      <div style={{ textAlign: "center", padding: "18px 0 28px", fontSize: 12, color: TEXT_MUTED, borderTop: `1px solid ${BORDER}` }}>
        © 2026 SilverScreens. All rights reserved.
      </div>
    </div>
  );
}