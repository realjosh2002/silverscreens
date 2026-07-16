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
  User,
  Camera,
  Pencil,
  Calendar,
  Globe,
  Shield,
  ShieldCheck,
  Activity,
  Link2,
  Plus,
  Trash2,
  KeyRound,
  Download,
  Zap,
  UserCircle2,
} from "lucide-react";

// ---------- Design tokens (Admin pages) ----------
const RED = "#C8202A";
const GOLD = "#D4A64A";
const GREEN = "#22C55E";
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

// Tabs that route elsewhere because that content already lives on another finished page.
const PROFILE_TABS = [
  { key: "profile", label: "Profile Information", icon: User, href: null },
  { key: "preferences", label: "Preferences", icon: SettingsIcon, href: "/admin/account-settings" },
  { key: "security", label: "Security", icon: Shield, href: "/admin/security-login" },
  { key: "notifications", label: "Notifications", icon: Bell, href: "/admin/account-settings" },
  { key: "activity", label: "Activity", icon: Activity, href: "/admin/activity-log" },
];

function go(router: ReturnType<typeof useRouter>, item: { href: string; built: boolean; label: string }) {
  if (item.built) {
    router.push(item.href);
  } else {
    alert(`"${item.label}" page is not built yet. (404)`);
  }
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: BG3,
  border: `1px solid ${BORDER}`,
  borderRadius: 6,
  padding: "10px 12px",
  fontSize: 14,
  color: "#fff",
  fontFamily: BARLOW,
  outline: "none",
  boxSizing: "border-box",
};

const readOnlyInputStyle: React.CSSProperties = {
  ...inputStyle,
  color: "#cfd3da",
};

function Field({ label, children, badge }: { label: string; children: React.ReactNode; badge?: { text: string; color: string } }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
        <label style={{ fontSize: 13, color: "#cfd3da" }}>{label}</label>
        {badge && (
          <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 4, background: `${badge.color}22`, color: badge.color }}>{badge.text}</span>
        )}
      </div>
      {children}
    </div>
  );
}

function CardHeader({ title, desc }: { title: string; desc: string }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <h2 style={{ fontFamily: BARLOW, fontWeight: 700, fontSize: 17, color: "#fff", margin: 0 }}>{title}</h2>
      <div style={{ fontSize: 12, color: TEXT_MUTED, marginTop: 2 }}>{desc}</div>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <div style={{ background: BG2, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 20 }}>{children}</div>;
}

function RailCard({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return (
    <div style={{ background: BG2, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 18 }}>
      <h3 style={{ fontFamily: BARLOW, fontWeight: 700, fontSize: 15, color, margin: "0 0 14px", letterSpacing: 0.5 }}>{title}</h3>
      {children}
    </div>
  );
}

function CompletionRing({ percent }: { percent: number }) {
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
        <div style={{ fontSize: 12, color: GREEN, fontWeight: 600 }}>Complete</div>
      </div>
    </div>
  );
}

export default function MyProfilePage() {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifPanelOpen, setNotifPanelOpen] = useState(false);
  const [msgPanelOpen, setMsgPanelOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [saved, setSaved] = useState(false);

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

  // ---- Profile Information ----
  const [firstName, setFirstName] = useState("Arun");
  const [lastName, setLastName] = useState("Kumar");
  const [displayName, setDisplayName] = useState("Arun Kumar");
  const [designation, setDesignation] = useState("Super Administrator");
  const [email, setEmail] = useState("admin@silverscreens.com");
  const [department, setDepartment] = useState("Administration");
  const [mobile, setMobile] = useState("+91 98765 43210");
  const [dob, setDob] = useState("1985-01-15");
  const [employeeId] = useState("SS-ADM-001");
  const [language, setLanguage] = useState("English");

  // ---- Professional Information (read-only / admin-assigned) ----
  const [officeLocation, setOfficeLocation] = useState("Chennai, India");
  const [timezone, setTimezone] = useState("(GMT+05:30) Asia/Kolkata");

  // ---- About Me ----
  const [bio, setBio] = useState("Passionate about building secure, scalable platforms and enabling talent to shine on the global stage.");

  // ---- Social Links ----
  const [socialLinks, setSocialLinks] = useState([
    { id: "li", icon: "linkedin", url: "https://linkedin.com/in/arunkumar" },
    { id: "tw", icon: "twitter", url: "https://twitter.com/arunkumar" },
    { id: "web", icon: "web", url: "https://www.arunkumar.com" },
  ]);

  const removeSocialLink = (id: string) => {
    if (confirm("Remove this social link?")) {
      setSocialLinks((links) => links.filter((l) => l.id !== id));
    }
  };

  const addSocialLink = () => {
    const url = prompt("Enter the URL for the new social link:");
    if (url) {
      setSocialLinks((links) => [...links, { id: `link-${Date.now()}`, icon: "web", url }]);
    }
  };

  const handleEditToggle = () => {
    if (editMode) {
      setSaved(true);
      setEditMode(false);
      setTimeout(() => setSaved(false), 2000);
    } else {
      setEditMode(true);
    }
  };

  const sidebarWidth = collapsed ? 52 : 220;
  const SOCIAL_ICON_MAP: Record<string, React.ElementType> = { linkedin: Link2, twitter: MessageSquare, web: Globe };

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
                <UserCircle2 size={17} />
                {!collapsed && <span>My Profile</span>}
              </div>
              {!collapsed && <ChevronRight size={14} />}
            </div>
          </div>
        </div>

        {/* ---------------- MAIN CONTENT ---------------- */}
        <div style={{ flex: 1, padding: "24px 28px", display: "flex", gap: 20 }}>
          <div style={{ flex: 1.6, minWidth: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <h1 style={{ fontFamily: BEBAS, fontSize: 32, letterSpacing: 1, color: GOLD, margin: 0 }}>MY PROFILE</h1>
                <p style={{ fontSize: 14, color: TEXT_MUTED, margin: "4px 0 0" }}>View and manage your personal information, preferences and profile settings.</p>
              </div>
              <button
                onClick={handleEditToggle}
                style={{ background: GOLD, color: BG, border: "none", borderRadius: 6, padding: "10px 18px", fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap" }}
              >
                <Pencil size={14} />
                {saved ? "Saved!" : editMode ? "Save Changes" : "Edit Profile"}
              </button>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: 22, borderBottom: `1px solid ${BORDER}`, marginBottom: 20 }}>
              {PROFILE_TABS.map((t) => {
                const active = t.key === "profile";
                return (
                  <div
                    key={t.key}
                    onClick={() => t.href && router.push(t.href)}
                    style={{
                      paddingBottom: 10,
                      fontSize: 14,
                      cursor: "pointer",
                      color: active ? GOLD : "#cfd3da",
                      borderBottom: active ? `2px solid ${GOLD}` : "2px solid transparent",
                      fontWeight: active ? 600 : 400,
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                      whiteSpace: "nowrap",
                    }}
                  >
                    <t.icon size={15} />
                    {t.label}
                  </div>
                );
              })}
            </div>

            {/* Profile Information */}
            <div style={{ marginBottom: 20 }}>
              <Card>
                <CardHeader title="Profile Information" desc="Manage your personal details and professional information." />
                <div style={{ display: "flex", gap: 22 }}>
                  <div style={{ textAlign: "center", flexShrink: 0 }}>
                    <img src="https://i.pravatar.cc/200?img=12" alt="Profile" style={{ width: 96, height: 96, borderRadius: "50%", objectFit: "cover", border: `2px solid ${GOLD}`, marginBottom: 10 }} />
                    <button
                      onClick={() => alert("Change Photo dialog would open here (demo action).")}
                      style={{ background: "transparent", border: `1px solid ${GOLD}`, color: GOLD, borderRadius: 6, padding: "8px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, margin: "0 auto" }}
                    >
                      <Camera size={13} />
                      Change Photo
                    </button>
                    <div style={{ fontSize: 10, color: TEXT_MUTED, marginTop: 6 }}>JPG, PNG or GIF. Max 5MB</div>
                  </div>

                  <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 18px" }}>
                    <Field label="First Name">
                      <input style={editMode ? inputStyle : readOnlyInputStyle} value={firstName} onChange={(e) => setFirstName(e.target.value)} readOnly={!editMode} />
                    </Field>
                    <Field label="Last Name">
                      <input style={editMode ? inputStyle : readOnlyInputStyle} value={lastName} onChange={(e) => setLastName(e.target.value)} readOnly={!editMode} />
                    </Field>
                    <Field label="Display Name">
                      <input style={editMode ? inputStyle : readOnlyInputStyle} value={displayName} onChange={(e) => setDisplayName(e.target.value)} readOnly={!editMode} />
                    </Field>
                    <Field label="Designation">
                      <input style={readOnlyInputStyle} value={designation} readOnly />
                    </Field>
                    <Field label="Email Address" badge={{ text: "Verified", color: GREEN }}>
                      <input style={editMode ? inputStyle : readOnlyInputStyle} value={email} onChange={(e) => setEmail(e.target.value)} readOnly={!editMode} />
                    </Field>
                    <Field label="Department">
                      <input style={readOnlyInputStyle} value={department} readOnly />
                    </Field>
                    <Field label="Mobile Number" badge={{ text: "Verified", color: GREEN }}>
                      <input style={editMode ? inputStyle : readOnlyInputStyle} value={mobile} onChange={(e) => setMobile(e.target.value)} readOnly={!editMode} />
                    </Field>
                    <Field label="Date of Birth">
                      <div style={{ position: "relative" }}>
                        <input
                          style={{ ...(editMode ? inputStyle : readOnlyInputStyle), paddingRight: 34 }}
                          type={editMode ? "date" : "text"}
                          value={editMode ? dob : new Date(dob).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                          onChange={(e) => setDob(e.target.value)}
                          readOnly={!editMode}
                        />
                        {!editMode && <Calendar size={15} color={TEXT_MUTED} style={{ position: "absolute", right: 10, top: 12 }} />}
                      </div>
                    </Field>
                    <Field label="Employee ID">
                      <input style={readOnlyInputStyle} value={employeeId} readOnly />
                    </Field>
                    <Field label="Language">
                      <select style={editMode ? inputStyle : readOnlyInputStyle} value={language} onChange={(e) => setLanguage(e.target.value)} disabled={!editMode}>
                        <option>English</option>
                        <option>Hindi</option>
                        <option>Tamil</option>
                      </select>
                    </Field>
                  </div>
                </div>
              </Card>
            </div>

            {/* Professional Information */}
            <div style={{ marginBottom: 20 }}>
              <Card>
                <CardHeader title="Professional Information" desc="Your role and responsibilities within the organization." />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 18px" }}>
                  <Field label="Role">
                    <div style={{ ...readOnlyInputStyle, display: "flex", alignItems: "center", gap: 8 }}>
                      <ShieldCheck size={15} color={GREEN} />
                      {designation}
                    </div>
                  </Field>
                  <Field label="Date Joined">
                    <div style={{ ...readOnlyInputStyle, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      12 Mar 2023
                      <Calendar size={15} color={TEXT_MUTED} />
                    </div>
                  </Field>
                  <Field label="Access Level">
                    <input style={readOnlyInputStyle} value="Full Access" readOnly />
                  </Field>
                  <Field label="Office Location">
                    <input style={editMode ? inputStyle : readOnlyInputStyle} value={officeLocation} onChange={(e) => setOfficeLocation(e.target.value)} readOnly={!editMode} />
                  </Field>
                  <Field label="Reporting To">
                    <input style={readOnlyInputStyle} value="Not Applicable" readOnly />
                  </Field>
                  <Field label="Time Zone">
                    <select style={editMode ? inputStyle : readOnlyInputStyle} value={timezone} onChange={(e) => setTimezone(e.target.value)} disabled={!editMode}>
                      <option>(GMT+05:30) Asia/Kolkata</option>
                      <option>(GMT+00:00) UTC</option>
                      <option>(GMT-05:00) America/New_York</option>
                    </select>
                  </Field>
                </div>
                <div style={{ fontSize: 11, color: TEXT_MUTED, marginTop: -8 }}>
                  Role, Access Level and Reporting structure are managed by Roles & Permissions and cannot be edited here.
                </div>
              </Card>
            </div>

            {/* About Me + Social Links */}
            <div style={{ display: "flex", gap: 20 }}>
              <div style={{ flex: 1 }}>
                <Card>
                  <h2 style={{ fontFamily: BARLOW, fontWeight: 700, fontSize: 17, color: GOLD, margin: "0 0 2px" }}>About Me</h2>
                  <div style={{ fontSize: 12, color: TEXT_MUTED, marginBottom: 12 }}>A short bio about yourself.</div>
                  <div style={{ position: "relative" }}>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      readOnly={!editMode}
                      rows={4}
                      style={{ ...(editMode ? inputStyle : readOnlyInputStyle), resize: "none", paddingRight: 34, fontFamily: BARLOW }}
                    />
                    {!editMode && (
                      <Pencil
                        size={14}
                        color={TEXT_MUTED}
                        style={{ position: "absolute", right: 10, bottom: 10, cursor: "pointer" }}
                        onClick={() => setEditMode(true)}
                      />
                    )}
                  </div>
                </Card>
              </div>

              <div style={{ flex: 1 }}>
                <Card>
                  <h2 style={{ fontFamily: BARLOW, fontWeight: 700, fontSize: 17, color: GOLD, margin: "0 0 2px" }}>Social Links (Visible to Agency Users)</h2>
                  <div style={{ fontSize: 12, color: TEXT_MUTED, marginBottom: 12 }}>Add your professional social media links.</div>

                  {socialLinks.map((l) => {
                    const Icon = SOCIAL_ICON_MAP[l.icon] || Link2;
                    return (
                      <div key={l.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: 6, background: BG3, border: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Icon size={15} color={GOLD} />
                        </div>
                        <input
                          style={editMode ? inputStyle : readOnlyInputStyle}
                          value={l.url}
                          readOnly={!editMode}
                          onChange={(e) => setSocialLinks((links) => links.map((x) => (x.id === l.id ? { ...x, url: e.target.value } : x)))}
                        />
                        <Trash2 size={16} color={RED} style={{ cursor: "pointer", flexShrink: 0 }} onClick={() => removeSocialLink(l.id)} />
                      </div>
                    );
                  })}

                  <button
                    onClick={addSocialLink}
                    style={{ width: "100%", background: "transparent", border: `1px solid ${GOLD}`, color: GOLD, borderRadius: 6, padding: "10px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, marginTop: 6 }}
                  >
                    <Plus size={14} />
                    Add New Link
                  </button>
                </Card>
              </div>
            </div>
          </div>

          {/* ---------------- RIGHT RAIL ---------------- */}
          <div style={{ width: 300, minWidth: 300, display: "flex", flexDirection: "column", gap: 20 }}>
            <RailCard title="PROFILE COMPLETION" color={GOLD}>
              <CompletionRing percent={100} />
              <div style={{ textAlign: "center", fontSize: 12, color: TEXT_MUTED, marginTop: 14 }}>
                Great! Your profile is complete.
                <br />
                Last updated: 24 May 2026, 10:15 AM
              </div>
            </RailCard>

            <RailCard title="ACCOUNT SUMMARY" color={GOLD}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 13 }}>
                <span style={{ color: "#cfd3da" }}>Username</span>
                <span style={{ color: "#fff" }}>superadmin</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 13 }}>
                <span style={{ color: "#cfd3da" }}>Account Status</span>
                <span style={{ color: GREEN, display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: GREEN }} />
                  Active
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 13 }}>
                <span style={{ color: "#cfd3da" }}>Email Verified</span>
                <span style={{ color: GREEN }}>Yes</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 13 }}>
                <span style={{ color: "#cfd3da" }}>2FA Status</span>
                <span style={{ color: GREEN }}>Enabled</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 13 }}>
                <span style={{ color: "#cfd3da" }}>Last Login</span>
                <span style={{ color: "#fff" }}>24 May 2026, 10:22 AM</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 13 }}>
                <span style={{ color: "#cfd3da" }}>Member Since</span>
                <span style={{ color: "#fff" }}>12 Mar 2023</span>
              </div>
            </RailCard>

            <RailCard title="MY STATISTICS" color={GOLD}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 13 }}>
                <span style={{ color: "#cfd3da" }}>Logins This Month</span>
                <span style={{ color: "#fff" }}>48</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 13 }}>
                <span style={{ color: "#cfd3da" }}>Profile Updates</span>
                <span style={{ color: "#fff" }}>6</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 13 }}>
                <span style={{ color: "#cfd3da" }}>Tickets Raised</span>
                <span style={{ color: "#fff" }}>3</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 13 }}>
                <span style={{ color: "#cfd3da" }}>Tickets Resolved</span>
                <span style={{ color: "#fff" }}>3</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 13 }}>
                <span style={{ color: "#cfd3da" }}>Reports Exported</span>
                <span style={{ color: "#fff" }}>12</span>
              </div>
            </RailCard>

            <RailCard title="QUICK ACTIONS" color={GOLD}>
              <div onClick={() => router.push("/admin/security-login")} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", cursor: "pointer", borderBottom: `1px solid ${BORDER}`, color: "#cfd3da" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
                  <KeyRound size={15} color={TEXT_MUTED} />
                  Change Password
                </div>
                <ChevronRight size={13} color={TEXT_MUTED} />
              </div>
              <div onClick={() => router.push("/admin/security-login")} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", cursor: "pointer", borderBottom: `1px solid ${BORDER}`, color: "#cfd3da" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
                  <Shield size={15} color={TEXT_MUTED} />
                  Manage 2FA Settings
                </div>
                <ChevronRight size={13} color={TEXT_MUTED} />
              </div>
              <div onClick={() => router.push("/admin/activity-log")} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", cursor: "pointer", borderBottom: `1px solid ${BORDER}`, color: "#cfd3da" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
                  <Activity size={15} color={TEXT_MUTED} />
                  View Login History
                </div>
                <ChevronRight size={13} color={TEXT_MUTED} />
              </div>
              <div onClick={() => alert("Your data export has started. You'll receive a download link by email (demo action).")} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", cursor: "pointer", borderBottom: `1px solid ${BORDER}`, color: "#cfd3da" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
                  <Download size={15} color={TEXT_MUTED} />
                  Download My Data
                </div>
                <ChevronRight size={13} color={TEXT_MUTED} />
              </div>
              <div
                onClick={() => {
                  if (confirm("Deactivate your account? You will be signed out and will need another admin to reactivate it.")) {
                    alert("Account deactivation requested (demo action).");
                  }
                }}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", cursor: "pointer", color: RED }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
                  <Zap size={15} color={RED} />
                  Deactivate Account
                </div>
                <ChevronRight size={13} color={RED} />
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