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
  Filter,
  Download,
  Table2,
  Clipboard,
  Shield,
  KeyRound,
  UserCheck,
  FileDown,
  Settings2,
  XCircle,
  FileEdit,
  Receipt,
  MapPin,
  Monitor,
  Laptop,
  Smartphone,
  ArrowUpRight,
  ArrowDownRight,
  ExternalLink,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";

// ---------- Design tokens (Admin pages) ----------
const RED = "#C8202A";
const GOLD = "#D4A64A";
const GREEN = "#22C55E";
const BLUE = "#3B82F6";
const PURPLE = "#8B5CF6";
const ORANGE = "#F97316";
const TEAL = "#14B8A6";
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

const inputStyle: React.CSSProperties = {
  background: BG3,
  border: `1px solid ${BORDER}`,
  borderRadius: 6,
  padding: "9px 12px",
  fontSize: 13,
  color: "#fff",
  fontFamily: BARLOW,
  outline: "none",
  boxSizing: "border-box",
};

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

function StatCard({ icon: Icon, iconBg, iconColor, label, value, sub, change, down }: { icon: React.ElementType; iconBg: string; iconColor: string; label: string; value: string; sub: string; change: string; down?: boolean }) {
  return (
    <div style={{ flex: 1, background: BG2, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 18, display: "flex", alignItems: "flex-start", gap: 14 }}>
      <div style={{ width: 42, height: 42, borderRadius: 10, background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon size={19} color={iconColor} />
      </div>
      <div>
        <div style={{ fontSize: 11, color: TEXT_MUTED, letterSpacing: 0.5 }}>{label}</div>
        <div style={{ fontSize: 26, fontWeight: 700, color: "#fff", margin: "2px 0" }}>{value}</div>
        <div style={{ fontSize: 11, color: TEXT_MUTED, display: "flex", alignItems: "center", gap: 5 }}>
          {sub}
          <span style={{ color: down ? RED : GREEN, display: "flex", alignItems: "center" }}>
            {down ? <ArrowDownRight size={11} /> : <ArrowUpRight size={11} />}
            {change}
          </span>
        </div>
      </div>
    </div>
  );
}

function ActivityScoreRing({ percent }: { percent: number }) {
  const size = 140;
  const stroke = 11;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (percent / 100) * circumference;
  return (
    <div style={{ position: "relative", width: size, height: size, margin: "0 auto" }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke={BG4} strokeWidth={stroke} fill="none" />
        <circle cx={size / 2} cy={size / 2} r={r} stroke={GREEN} strokeWidth={stroke} fill="none" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontSize: 28, fontWeight: 700, color: "#fff" }}>{percent}%</div>
        <div style={{ fontSize: 12, color: GREEN, fontWeight: 600 }}>Excellent</div>
      </div>
    </div>
  );
}

function Donut({ segments, centerValue, centerLabel }: { segments: { value: number; color: string }[]; centerValue: string; centerLabel: string }) {
  const size = 130;
  const stroke = 16;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const total = segments.reduce((a, s) => a + s.value, 0) || 1;
  let cumulative = 0;
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        {segments.map((s, i) => {
          const frac = s.value / total;
          const dash = frac * circumference;
          const gap = circumference - dash;
          const rotation = (cumulative / total) * 360;
          cumulative += s.value;
          return (
            <circle key={i} cx={size / 2} cy={size / 2} r={r} stroke={s.color} strokeWidth={stroke} fill="none" strokeDasharray={`${dash} ${gap}`} style={{ transform: `rotate(${rotation}deg)`, transformOrigin: "50% 50%" }} />
          );
        })}
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: "#fff" }}>{centerValue}</div>
        <div style={{ fontSize: 10, color: TEXT_MUTED }}>{centerLabel}</div>
      </div>
    </div>
  );
}

const ACTIVITY_ICON_MAP: Record<string, { icon: React.ElementType; color: string }> = {
  login: { icon: ShieldCheck, color: GREEN },
  settings: { icon: Settings2, color: BLUE },
  twofa: { icon: Lock, color: PURPLE },
  approve: { icon: UserCheck, color: ORANGE },
  download: { icon: FileDown, color: RED },
  failedLogin: { icon: XCircle, color: RED },
  cms: { icon: FileEdit, color: TEAL },
  subscription: { icon: Receipt, color: GOLD },
};

export default function ActivityLogPage() {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifPanelOpen, setNotifPanelOpen] = useState(false);
  const [msgPanelOpen, setMsgPanelOpen] = useState(false);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [viewAsTable, setViewAsTable] = useState(false);

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

  // ---- Filters ----
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState("24 May 2026 - 24 Jun 2026");
  const [moduleFilter, setModuleFilter] = useState("All Modules");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [page, setPage] = useState(1);

  // ---- Activity data ----
  const timelineGroups = [
    {
      label: "Today - 24 May 2026",
      items: [
        { id: 1, time: "10:22 AM", type: "login", title: "Successful Login", desc: "Logged in successfully from Chrome on Windows", module: "Authentication", device: "Chrome on Windows", ip: "103.21.244.10", status: "Success" },
        { id: 2, time: "10:15 AM", type: "settings", title: "Updated System Settings", desc: "Changed email notification settings", module: "System Settings", device: "Chrome on Windows", ip: "103.21.244.10", status: "Success" },
        { id: 3, time: "09:40 AM", type: "twofa", title: "Two-Factor Authentication Enabled", desc: "Enabled 2FA using Authenticator App", module: "Security", device: "Chrome on Windows", ip: "103.21.244.10", status: "Success" },
        { id: 4, time: "09:15 AM", type: "approve", title: "User Approved", desc: 'Approved agency "DreamWorks Casting"', module: "Agency Verification", device: "Chrome on Windows", ip: "103.21.244.10", status: "Success" },
        { id: 5, time: "08:50 AM", type: "download", title: "Downloaded Report", desc: "Exported Users Report", module: "Reports Center", device: "Chrome on Windows", ip: "103.21.244.10", status: "Success" },
      ],
    },
    {
      label: "Yesterday - 23 May 2026",
      items: [
        { id: 6, time: "07:58 PM", type: "failedLogin", title: "Failed Login Attempt", desc: "Failed login attempt with incorrect password", module: "Authentication", device: "Chrome on Windows", ip: "103.21.244.10", status: "Failed" },
        { id: 7, time: "07:12 PM", type: "cms", title: "Updated CMS Page", desc: 'Updated page "Terms & Conditions"', module: "CMS Management", device: "Chrome on Windows", ip: "103.21.244.10", status: "Success" },
        { id: 8, time: "06:45 PM", type: "subscription", title: "Subscription Plan Updated", desc: 'Updated plan "Premium Annual"', module: "Subscription Plans", device: "Chrome on Windows", ip: "103.21.244.10", status: "Success" },
      ],
    },
  ];

  const filteredGroups = timelineGroups
    .map((g) => ({
      ...g,
      items: g.items.filter((it) => {
        const matchesSearch = search.trim() === "" || it.title.toLowerCase().includes(search.toLowerCase()) || it.desc.toLowerCase().includes(search.toLowerCase());
        const matchesModule = moduleFilter === "All Modules" || it.module === moduleFilter;
        const matchesStatus = statusFilter === "All Status" || it.status === statusFilter;
        return matchesSearch && matchesModule && matchesStatus;
      }),
    }))
    .filter((g) => g.items.length > 0);

  const handleExport = (format: string) => {
    setExportMenuOpen(false);
    alert(`Exporting activity log as ${format} (demo action).`);
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
                  <span onClick={() => { setMsgPanelOpen(false); alert('"All Messages" page is not built yet. (404)'); }} style={{ fontSize: 12, color: GOLD, cursor: "pointer" }}>View All</span>
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
                <Clipboard size={17} />
                {!collapsed && <span>Activity Log</span>}
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
                <h1 style={{ fontFamily: BEBAS, fontSize: 32, letterSpacing: 1, color: GOLD, margin: 0 }}>ACTIVITY LOG</h1>
                <p style={{ fontSize: 14, color: TEXT_MUTED, margin: "4px 0 0" }}>View your personal activity history, logins, changes and actions performed on the platform.</p>
              </div>
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setExportMenuOpen((o) => !o)}
                  style={{ background: "transparent", border: `1px solid ${GOLD}`, color: GOLD, borderRadius: 6, padding: "10px 16px", fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap" }}
                >
                  <Download size={15} />
                  Export Activity
                  <ChevronDown size={13} />
                </button>
                {exportMenuOpen && (
                  <div style={{ position: "absolute", right: 0, top: 44, width: 160, background: BG3, border: `1px solid ${BORDER}`, borderRadius: 8, overflow: "hidden", boxShadow: "0 8px 24px rgba(0,0,0,0.4)", zIndex: 30 }}>
                    {["CSV", "PDF", "Excel"].map((f) => (
                      <div key={f} onClick={() => handleExport(f)} style={{ padding: "10px 14px", fontSize: 13, color: "#E6E8EC", cursor: "pointer" }} onMouseEnter={(e) => (e.currentTarget.style.background = BG4)} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                        Export as {f}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Stat cards */}
            <div style={{ display: "flex", gap: 14, marginBottom: 20 }}>
              <StatCard icon={Clipboard} iconBg={`${GOLD}22`} iconColor={GOLD} label="TOTAL ACTIVITIES" value="1,248" sub="This Month" change="18.7%" />
              <StatCard icon={Lock} iconBg={`${GREEN}22`} iconColor={GREEN} label="LOGIN EVENTS" value="86" sub="This Month" change="12.3%" />
              <StatCard icon={Shield} iconBg={`${PURPLE}22`} iconColor={PURPLE} label="SECURITY EVENTS" value="24" sub="This Month" change="9.1%" down />
              <StatCard icon={Settings2} iconBg={`${BLUE}22`} iconColor={BLUE} label="CONFIG CHANGES" value="47" sub="This Month" change="21.4%" />
            </div>

            {/* Filters */}
            <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
              <div style={{ position: "relative", flex: "1 1 220px" }}>
                <Search size={14} color={TEXT_MUTED} style={{ position: "absolute", left: 10, top: 11 }} />
                <input style={{ ...inputStyle, width: "100%", paddingLeft: 32 }} placeholder="Search activities..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <select style={inputStyle} value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
                <option>24 May 2026 - 24 Jun 2026</option>
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>This Year</option>
              </select>
              <select style={inputStyle} value={moduleFilter} onChange={(e) => setModuleFilter(e.target.value)}>
                <option>All Modules</option>
                <option>Authentication</option>
                <option>System Settings</option>
                <option>Security</option>
                <option>Agency Verification</option>
                <option>Reports Center</option>
                <option>CMS Management</option>
                <option>Subscription Plans</option>
              </select>
              <select style={inputStyle} value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                <option>All Types</option>
                <option>Login</option>
                <option>Update</option>
                <option>Approval</option>
                <option>Export</option>
              </select>
              <select style={inputStyle} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option>All Status</option>
                <option>Success</option>
                <option>Failed</option>
              </select>
              <button
                onClick={() => alert("Advanced filters dialog would open here (demo action).")}
                style={{ background: "transparent", border: `1px solid ${GOLD}`, color: GOLD, borderRadius: 6, padding: "9px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}
              >
                <Filter size={13} />
                Filters
              </button>
            </div>

            {/* Activity Timeline */}
            <div style={{ background: BG2, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 20, marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <h2 style={{ fontFamily: BARLOW, fontWeight: 700, fontSize: 17, color: GOLD, margin: 0 }}>ACTIVITY TIMELINE</h2>
                <button
                  onClick={() => setViewAsTable((v) => !v)}
                  style={{ background: "transparent", border: `1px solid ${BORDER}`, color: "#cfd3da", borderRadius: 6, padding: "8px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
                >
                  <Table2 size={13} />
                  {viewAsTable ? "View as Timeline" : "View as Table"}
                </button>
              </div>

              {filteredGroups.length === 0 && <div style={{ padding: "30px 0", textAlign: "center", color: TEXT_MUTED, fontSize: 13 }}>No activities match your filters.</div>}

              {!viewAsTable &&
                filteredGroups.map((group) => (
                  <div key={group.label} style={{ marginBottom: 18 }}>
                    <div style={{ fontSize: 13, color: TEXT_MUTED, fontWeight: 600, marginBottom: 10 }}>{group.label}</div>
                    {group.items.map((it, idx) => {
                      const meta = ACTIVITY_ICON_MAP[it.type] || { icon: Clipboard, color: GOLD };
                      const Icon = meta.icon;
                      return (
                        <div key={it.id} style={{ display: "flex", gap: 14, position: "relative" }}>
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 16 }}>
                            <div style={{ width: 10, height: 10, borderRadius: "50%", background: meta.color, marginTop: 6, flexShrink: 0 }} />
                            {idx !== group.items.length - 1 && <div style={{ width: 2, flex: 1, background: BORDER, marginTop: 2 }} />}
                          </div>
                          <div
                            onClick={() => alert(`Activity detail: "${it.title}" (demo action).`)}
                            style={{ flex: 1, display: "grid", gridTemplateColumns: "70px 1fr 1.2fr 1.1fr 0.8fr", alignItems: "center", paddingBottom: 16, cursor: "pointer" }}
                          >
                            <div style={{ fontSize: 12, color: TEXT_MUTED }}>{it.time}</div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <div style={{ width: 28, height: 28, borderRadius: 7, background: `${meta.color}22`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                <Icon size={14} color={meta.color} />
                              </div>
                              <div>
                                <div style={{ fontSize: 13, color: "#fff" }}>{it.title}</div>
                                <div style={{ fontSize: 11, color: TEXT_MUTED }}>{it.desc}</div>
                              </div>
                            </div>
                            <div style={{ fontSize: 12, color: "#cfd3da" }}>{it.module}</div>
                            <div>
                              <div style={{ fontSize: 12, color: "#cfd3da" }}>{it.device}</div>
                              <div style={{ fontSize: 11, color: TEXT_MUTED }}>{it.ip}</div>
                            </div>
                            <div style={{ textAlign: "right" }}>
                              <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 4, background: it.status === "Success" ? `${GREEN}22` : `${RED}22`, color: it.status === "Success" ? GREEN : RED }}>
                                {it.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}

              {viewAsTable && (
                <div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr 1.2fr 1.1fr 0.8fr", padding: "0 0 8px", borderBottom: `1px solid ${BORDER}` }}>
                    <div style={{ fontSize: 10, color: TEXT_MUTED, fontWeight: 600 }}>TIME</div>
                    <div style={{ fontSize: 10, color: TEXT_MUTED, fontWeight: 600 }}>ACTIVITY</div>
                    <div style={{ fontSize: 10, color: TEXT_MUTED, fontWeight: 600 }}>MODULE</div>
                    <div style={{ fontSize: 10, color: TEXT_MUTED, fontWeight: 600 }}>DEVICE</div>
                    <div style={{ fontSize: 10, color: TEXT_MUTED, fontWeight: 600, textAlign: "right" }}>STATUS</div>
                  </div>
                  {filteredGroups.flatMap((g) => g.items).map((it) => (
                    <div
                      key={it.id}
                      onClick={() => alert(`Activity detail: "${it.title}" (demo action).`)}
                      style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr 1.2fr 1.1fr 0.8fr", alignItems: "center", padding: "11px 0", borderBottom: `1px solid ${BORDER}`, cursor: "pointer" }}
                    >
                      <div style={{ fontSize: 12, color: TEXT_MUTED }}>{it.time}</div>
                      <div style={{ fontSize: 13, color: "#fff" }}>{it.title}</div>
                      <div style={{ fontSize: 12, color: "#cfd3da" }}>{it.module}</div>
                      <div style={{ fontSize: 12, color: "#cfd3da" }}>{it.device}</div>
                      <div style={{ textAlign: "right" }}>
                        <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 4, background: it.status === "Success" ? `${GREEN}22` : `${RED}22`, color: it.status === "Success" ? GREEN : RED }}>
                          {it.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16 }}>
                <div style={{ fontSize: 12, color: TEXT_MUTED }}>Showing 1 to 10 of 1248 activities</div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <ChevronLeft size={16} color={TEXT_MUTED} style={{ cursor: "pointer" }} onClick={() => setPage((p) => Math.max(1, p - 1))} />
                  {[1, 2, 3].map((p) => (
                    <div key={p} onClick={() => setPage(p)} style={{ width: 26, height: 26, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, cursor: "pointer", background: page === p ? GOLD : "transparent", color: page === p ? BG : "#cfd3da", border: page === p ? "none" : `1px solid ${BORDER}` }}>
                      {p}
                    </div>
                  ))}
                  <span style={{ fontSize: 12, color: TEXT_MUTED, padding: "0 4px" }}>…</span>
                  <div onClick={() => setPage(125)} style={{ width: 30, height: 26, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, cursor: "pointer", background: page === 125 ? GOLD : "transparent", color: page === 125 ? BG : "#cfd3da", border: page === 125 ? "none" : `1px solid ${BORDER}` }}>
                    125
                  </div>
                  <ChevronRight size={16} color={TEXT_MUTED} style={{ cursor: "pointer" }} onClick={() => setPage((p) => Math.min(125, p + 1))} />
                </div>
              </div>
            </div>

            {/* Bottom row: Login Locations / Activity by Module / Recent Exports */}
            <div style={{ display: "flex", gap: 20 }}>
              <div style={{ flex: 1, background: BG2, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 18 }}>
                <h3 style={{ fontFamily: BARLOW, fontWeight: 700, fontSize: 15, color: GOLD, margin: "0 0 14px" }}>LOGIN LOCATIONS</h3>
                <div style={{ height: 110, borderRadius: 8, background: BG3, border: `1px solid ${BORDER}`, marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <MapPin size={26} color={TEXT_MUTED} />
                </div>
                {[
                  { city: "Chennai, India", when: "This Location", color: GREEN },
                  { city: "Bengaluru, India", when: "23 May 2026", color: GOLD },
                  { city: "Mumbai, India", when: "21 May 2026", color: GOLD },
                ].map((l) => (
                  <div key={l.city} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0", fontSize: 12 }}>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: l.color }} />
                    <div>
                      <div style={{ color: "#fff" }}>{l.city}</div>
                      <div style={{ color: TEXT_MUTED, fontSize: 11 }}>{l.when}</div>
                    </div>
                  </div>
                ))}
                <button onClick={() => alert('"View All Locations" page is not built yet. (404)')} style={{ width: "100%", marginTop: 12, background: "transparent", border: `1px solid ${GOLD}`, color: GOLD, borderRadius: 6, padding: "9px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  <MapPin size={13} />
                  View All Locations
                </button>
              </div>

              <div style={{ flex: 1, background: BG2, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 18 }}>
                <h3 style={{ fontFamily: BARLOW, fontWeight: 700, fontSize: 15, color: GOLD, margin: "0 0 14px" }}>ACTIVITY BY MODULE</h3>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <Donut
                    segments={[
                      { value: 28.5, color: PURPLE },
                      { value: 18.7, color: GOLD },
                      { value: 15.3, color: BLUE },
                      { value: 12.1, color: RED },
                      { value: 10.4, color: TEAL },
                      { value: 14.9, color: TEXT_MUTED },
                    ]}
                    centerValue="1,248"
                    centerLabel="Total"
                  />
                  <div style={{ fontSize: 11, flex: 1 }}>
                    {[
                      { label: "User Management", pct: "28.5%", color: PURPLE },
                      { label: "Agency Verification", pct: "18.7%", color: GOLD },
                      { label: "System Settings", pct: "15.3%", color: BLUE },
                      { label: "Reports Center", pct: "12.1%", color: RED },
                      { label: "CMS Management", pct: "10.4%", color: TEAL },
                      { label: "Others", pct: "14.9%", color: TEXT_MUTED },
                    ].map((m) => (
                      <div key={m.label} style={{ display: "flex", alignItems: "center", gap: 6, padding: "3px 0" }}>
                        <div style={{ width: 7, height: 7, borderRadius: "50%", background: m.color, flexShrink: 0 }} />
                        <span style={{ color: "#cfd3da", flex: 1 }}>{m.label}</span>
                        <span style={{ color: "#fff" }}>{m.pct}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <button onClick={() => alert('"View Full Breakdown" page is not built yet. (404)')} style={{ width: "100%", marginTop: 14, background: "transparent", border: `1px solid ${GOLD}`, color: GOLD, borderRadius: 6, padding: "9px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  <ExternalLink size={13} />
                  View Full Breakdown
                </button>
              </div>

              <div style={{ flex: 1, background: BG2, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 18 }}>
                <h3 style={{ fontFamily: BARLOW, fontWeight: 700, fontSize: 15, color: GOLD, margin: "0 0 14px" }}>RECENT EXPORTS</h3>
                {[
                  { name: "Users Report", date: "24 May 2026, 08:50 AM", format: "CSV", color: GREEN },
                  { name: "Applications Report", date: "23 May 2026, 06:30 PM", format: "XLSX", color: BLUE },
                  { name: "Revenue Report", date: "22 May 2026, 11:20 AM", format: "PDF", color: RED },
                ].map((e) => (
                  <div key={e.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${BORDER}` }}>
                    <div>
                      <div style={{ fontSize: 13, color: "#fff" }}>{e.name}</div>
                      <div style={{ fontSize: 11, color: TEXT_MUTED }}>{e.date}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 7px", borderRadius: 4, background: `${e.color}22`, color: e.color }}>{e.format}</span>
                      <Download size={14} color={TEXT_MUTED} style={{ cursor: "pointer" }} onClick={() => alert(`Downloading "${e.name}" (demo action).`)} />
                    </div>
                  </div>
                ))}
                <button onClick={() => router.push("/admin/reports")} style={{ width: "100%", marginTop: 14, background: "transparent", border: `1px solid ${GOLD}`, color: GOLD, borderRadius: 6, padding: "9px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  <ExternalLink size={13} />
                  View All Exports
                </button>
              </div>
            </div>
          </div>

          {/* ---------------- RIGHT RAIL ---------------- */}
          <div style={{ width: 300, minWidth: 300, display: "flex", flexDirection: "column", gap: 20 }}>
            <RailCard title="ACCOUNT ACTIVITY SCORE" color={GOLD}>
              <ActivityScoreRing percent={92} />
              <div style={{ textAlign: "center", fontSize: 12, color: TEXT_MUTED, marginTop: 14 }}>
                Great job! Your account activity is healthy.
                <br />
                Keep maintaining good security practices.
              </div>
            </RailCard>

            <RailCard title="LOGIN STATISTICS" color={GOLD}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", fontSize: 13 }}>
                <span style={{ color: "#cfd3da" }}>Total Logins</span>
                <span style={{ color: "#fff" }}>86</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", fontSize: 13 }}>
                <span style={{ color: "#cfd3da" }}>Successful Logins</span>
                <span style={{ color: GREEN }}>81 (94.2%)</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", fontSize: 13 }}>
                <span style={{ color: "#cfd3da" }}>Failed Attempts</span>
                <span style={{ color: RED }}>5 (5.8%)</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", fontSize: 13 }}>
                <span style={{ color: "#cfd3da" }}>Unique Devices</span>
                <span style={{ color: "#fff" }}>4</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", fontSize: 13 }}>
                <span style={{ color: "#cfd3da" }}>Unique Locations</span>
                <span style={{ color: "#fff" }}>2</span>
              </div>
              <svg width="100%" height="34" style={{ marginTop: 8 }}>
                <polyline
                  points="0,20 15,18 30,22 45,14 60,17 75,10 90,15 105,8 120,13 135,9 150,12 165,7 180,11 195,6 210,10 225,5"
                  fill="none"
                  stroke={GREEN}
                  strokeWidth="2"
                />
              </svg>
              <div style={{ textAlign: "right", marginTop: 6 }}>
                <span onClick={() => router.push("/admin/security-login")} style={{ fontSize: 12, color: GOLD, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 5 }}>
                  View Login History
                  <ChevronRight size={12} />
                </span>
              </div>
            </RailCard>

            <RailCard title="MOST ACTIVE MODULE" color={GOLD}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: `${PURPLE}22`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Users size={19} color={PURPLE} />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>User Management</div>
                  <div style={{ fontSize: 12, color: TEXT_MUTED }}>356 Activities</div>
                  <div style={{ fontSize: 11, color: TEXT_MUTED }}>28.5% of your total activity</div>
                </div>
              </div>
              <div style={{ height: 6, background: BG4, borderRadius: 3, marginTop: 10, overflow: "hidden" }}>
                <div style={{ width: "28.5%", height: "100%", background: PURPLE }} />
              </div>
            </RailCard>

            <RailCard title="LAST PASSWORD CHANGE" color={GOLD}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ fontSize: 13, color: "#cfd3da" }}>17 May 2026, 11:30 AM</div>
                <span style={{ fontSize: 11, color: TEXT_MUTED }}>7 days ago</span>
              </div>
              <button onClick={() => router.push("/admin/security-login")} style={{ width: "100%", background: "transparent", border: `1px solid ${GOLD}`, color: GOLD, borderRadius: 6, padding: "10px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
                <KeyRound size={14} />
                Change Password
              </button>
            </RailCard>

            <RailCard title="TRUSTED DEVICES (4)" color={GOLD}>
              {[
                { name: "Windows PC", icon: Monitor, note: "This Device", current: true },
                { name: "MacBook Pro", icon: Laptop, note: "Last active yesterday", current: false },
                { name: "iPhone 14", icon: Smartphone, note: "Last active 2 days ago", current: false },
                { name: "Android Mobile", icon: Smartphone, note: "Last active 5 days ago", current: false },
              ].map((d) => (
                <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 9, padding: "6px 0", fontSize: 12 }}>
                  <d.icon size={14} color={GOLD} />
                  <span style={{ color: "#fff", flex: 1 }}>{d.name}</span>
                  <span style={{ color: d.current ? GOLD : TEXT_MUTED, fontSize: 11 }}>{d.note}</span>
                </div>
              ))}
              <div style={{ textAlign: "right", marginTop: 8 }}>
                <span onClick={() => router.push("/admin/security-login")} style={{ fontSize: 12, color: GOLD, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 5 }}>
                  Manage Trusted Devices
                  <ChevronRight size={12} />
                </span>
              </div>
            </RailCard>

            <RailCard title="QUICK ACTIONS" color={GOLD}>
              <div onClick={() => alert("Exporting your activity log (demo action).")} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", cursor: "pointer", borderBottom: `1px solid ${BORDER}`, color: "#cfd3da" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
                  <Download size={15} color={TEXT_MUTED} />
                  Export My Activity
                </div>
                <ChevronRight size={13} color={TEXT_MUTED} />
              </div>
              <div onClick={() => alert("Activity report download started (demo action).")} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", cursor: "pointer", borderBottom: `1px solid ${BORDER}`, color: "#cfd3da" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
                  <FileDown size={15} color={TEXT_MUTED} />
                  Download Activity Report
                </div>
                <ChevronRight size={13} color={TEXT_MUTED} />
              </div>
              <div onClick={() => router.push("/admin/security-login")} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", cursor: "pointer", borderBottom: `1px solid ${BORDER}`, color: "#cfd3da" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
                  <Shield size={15} color={TEXT_MUTED} />
                  Security Review
                </div>
                <ChevronRight size={13} color={TEXT_MUTED} />
              </div>
              <div onClick={() => router.push("/admin/security-login")} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", cursor: "pointer", borderBottom: `1px solid ${BORDER}`, color: "#cfd3da" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
                  <Clipboard size={15} color={TEXT_MUTED} />
                  View Login History
                </div>
                <ChevronRight size={13} color={TEXT_MUTED} />
              </div>
              <div
                onClick={() => {
                  if (confirm("Clear old sessions older than 30 days? This won't affect your currently active sessions.")) {
                    alert("Old sessions cleared (demo action).");
                  }
                }}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", cursor: "pointer", color: "#cfd3da" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
                  <RotateCcw size={15} color={TEXT_MUTED} />
                  Clear Old Sessions
                </div>
                <ChevronRight size={13} color={TEXT_MUTED} />
              </div>
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