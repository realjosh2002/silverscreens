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
  Mail,
  MessageSquare,
  CreditCard,
  Settings as SettingsIcon,
  Lock,
  ScrollText,
  ChevronLeft,
  Menu,
  ChevronDown,
  ChevronRight,
  Save,
  Inbox,
  User,
  Camera,
  Eye,
  EyeOff,
  KeyRound,
  RefreshCw,
  Shield,
  ShieldCheck,
  Monitor,
  Smartphone,
  Laptop,
  Tablet,
  MoreVertical,
  PenTool,
  Upload,
  Trash2,
  Download,
  FileSearch,
  Key,
  Zap,
  AlertOctagon,
  Info,
  Clock,
} from "lucide-react";

// ---------- Design tokens (Admin pages) ----------
const RED = "#C8202A";
const GOLD = "#D4A64A";
const GREEN = "#22C55E";
const BLUE = "#3B82F6";
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

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ fontSize: 13, color: "#cfd3da", display: "block", marginBottom: 6 }}>{label}</label>
      {children}
      {hint && <div style={{ fontSize: 11, color: TEXT_MUTED, marginTop: 5 }}>{hint}</div>}
    </div>
  );
}

function ToggleSwitch({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      style={{
        width: 42,
        height: 22,
        borderRadius: 11,
        background: on ? GOLD : "#3A4150",
        cursor: "pointer",
        position: "relative",
        transition: "background 0.15s",
        flexShrink: 0,
      }}
    >
      <div style={{ position: "absolute", top: 2, left: on ? 22 : 2, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "left 0.15s" }} />
    </div>
  );
}

function CardHeader({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 14 }}>
      <Icon size={17} color={GOLD} />
      <h2 style={{ fontFamily: BARLOW, fontWeight: 700, fontSize: 17, color: GOLD, margin: 0 }}>{title}</h2>
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

const DEVICE_ICON_MAP: Record<string, React.ElementType> = {
  windows: Monitor,
  mac: Laptop,
  android: Smartphone,
  ios: Smartphone,
  tablet: Tablet,
};

export default function AccountSettingsPage() {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifPanelOpen, setNotifPanelOpen] = useState(false);
  const [msgPanelOpen, setMsgPanelOpen] = useState(false);
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
  const [department, setDepartment] = useState("Administration");
  const [employeeId] = useState("SS-ADM-001");
  const [email, setEmail] = useState("admin@silverscreens.com");
  const [mobile, setMobile] = useState("+91 98765 43210");

  // ---- Login Credentials ----
  const [username] = useState("superadmin");
  const [password] = useState("••••••••••••••");
  const [showPassword, setShowPassword] = useState(false);

  // ---- Two-Factor Auth ----
  const [twoFaEnabled, setTwoFaEnabled] = useState(true);
  const [backupCodesRemaining] = useState(8);

  // ---- Personal Preferences ----
  const [theme, setTheme] = useState("Dark");
  const [language, setLanguage] = useState("English");
  const [timezone, setTimezone] = useState("(GMT+05:30) Asia/Kolkata");
  const [dateFormat, setDateFormat] = useState("24 Jun 2026");
  const [timeFormat, setTimeFormat] = useState("12 Hour (hh:mm AM/PM)");

  // ---- Session Management ----
  const [sessions, setSessions] = useState([
    { id: "s1", device: "Windows PC", icon: "windows", browser: "Chrome 126", location: "Chennai, India", ip: "103.21.244.0", lastActive: "Now", status: "This Device", current: true },
    { id: "s2", device: "MacBook Pro", icon: "mac", browser: "Safari 17", location: "Chennai, India", ip: "103.21.244.0", lastActive: "2 Hours Ago", status: "Active", current: false },
    { id: "s3", device: "Android Mobile", icon: "android", browser: "Chrome Mobile", location: "Bengaluru, India", ip: "2405:db00::8a2e:370", lastActive: "Yesterday 09:15 AM", status: "Active", current: false },
    { id: "s4", device: "iPhone 14", icon: "ios", browser: "Safari iOS", location: "Mumbai, India", ip: "117.211.45.33", lastActive: "2 Days Ago 07:45 PM", status: "Active", current: false },
  ]);

  const terminateSession = (id: string) => {
    if (confirm("Terminate this session? The device will be signed out immediately.")) {
      setSessions((s) => s.filter((sess) => sess.id !== id));
    }
  };

  const terminateAllOthers = () => {
    if (confirm("Terminate all other sessions? Only this device will remain signed in.")) {
      setSessions((s) => s.filter((sess) => sess.current));
    }
  };

  // ---- Connected Devices ----
  const [devices, setDevices] = useState([
    { id: "d1", name: "Windows PC", icon: "windows", os: "Windows 11 Pro", browser: "Chrome 126", current: true },
    { id: "d2", name: "iPhone 14", icon: "ios", os: "iOS 17.5", browser: "Safari", current: false },
    { id: "d3", name: "MacBook Pro", icon: "mac", os: "macOS Sonoma 14.5", browser: "Safari 17", current: false },
    { id: "d4", name: "Android Tablet", icon: "android", os: "Android 14", browser: "Chrome", current: false },
  ]);
  const [deviceMenuOpen, setDeviceMenuOpen] = useState<string | null>(null);

  const removeDevice = (id: string) => {
    if (confirm("Remove this device? It will need to sign in again to access the platform.")) {
      setDevices((d) => d.filter((dev) => dev.id !== id));
    }
  };

  const removeAllDevices = () => {
    if (confirm("Remove all trusted devices except this one?")) {
      setDevices((d) => d.filter((dev) => dev.current));
    }
  };

  // ---- Notification Preferences ----
  const [notifPrefs, setNotifPrefs] = useState({
    emailAlerts: true,
    securityAlerts: true,
    loginAlerts: true,
    maintenanceUpdates: true,
    weeklyReports: true,
  });
  const toggleNotifPref = (key: keyof typeof notifPrefs) => setNotifPrefs((p) => ({ ...p, [key]: !p[key] }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  const handleCancel = () => {
    if (confirm("Discard unsaved changes?")) {
      alert("Changes discarded (demo action).");
    }
  };

  const sidebarWidth = collapsed ? 52 : 220;

  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: BARLOW, color: "#E6E8EC" }}>
      {/* ---------------- TOPNAV ---------------- */}
      <div
        style={{
          height: 68,
          background: BG2,
          borderBottom: `1px solid ${BORDER}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
            <span style={{ fontFamily: BEBAS, fontSize: 26, letterSpacing: 1, color: "#fff" }}>SILVER</span>
            <span style={{ fontFamily: BEBAS, fontSize: 26, letterSpacing: 1, color: RED, borderBottom: `2px solid ${RED}`, paddingBottom: 1 }}>SCREENS</span>
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, padding: "4px 10px", borderRadius: 5, background: RED, color: "#fff" }}>
            ADMIN
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ position: "relative" }}>
            <button
              onClick={() => {
                setMsgPanelOpen((o) => !o);
                setNotifPanelOpen(false);
                setProfileOpen(false);
              }}
              style={{ background: "transparent", border: "none", color: "#cfd3da", cursor: "pointer", position: "relative" }}
              aria-label="Messages"
            >
              <MessageSquare size={20} />
              <span style={{ position: "absolute", top: -6, right: -6, background: RED, color: "#fff", fontSize: 9, fontWeight: 700, borderRadius: 8, padding: "1px 5px" }}>
                {topbarMessages.filter((m) => !m.read).length}
              </span>
            </button>
            {msgPanelOpen && (
              <div style={{ position: "absolute", right: 0, top: 38, width: 320, background: BG3, border: `1px solid ${BORDER}`, borderRadius: 8, overflow: "hidden", boxShadow: "0 8px 24px rgba(0,0,0,0.4)", zIndex: 40 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", borderBottom: `1px solid ${BORDER}` }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Messages</span>
                  <span onClick={() => { setMsgPanelOpen(false); alert('"All Messages" page is not built yet. (404)'); }} style={{ fontSize: 12, color: GOLD, cursor: "pointer" }}>
                    View All
                  </span>
                </div>
                {topbarMessages.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => { setMsgPanelOpen(false); alert(`Open conversation with "${m.sender}" (demo action).`); }}
                    style={{ padding: "11px 14px", borderBottom: `1px solid ${BORDER}`, cursor: "pointer", background: m.read ? "transparent" : "rgba(212,166,74,0.06)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = BG4)}
                    onMouseLeave={(e) => (e.currentTarget.style.background = m.read ? "transparent" : "rgba(212,166,74,0.06)")}
                  >
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{m.sender}</div>
                    <div style={{ fontSize: 12, color: TEXT_MUTED, marginTop: 2 }}>{m.text}</div>
                    <div style={{ fontSize: 11, color: TEXT_MUTED, marginTop: 4 }}>{m.time}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ position: "relative" }}>
            <button
              onClick={() => {
                setNotifPanelOpen((o) => !o);
                setMsgPanelOpen(false);
                setProfileOpen(false);
              }}
              style={{ background: "transparent", border: "none", color: "#cfd3da", cursor: "pointer", position: "relative" }}
              aria-label="Notifications"
            >
              <Bell size={20} />
              <span style={{ position: "absolute", top: -6, right: -6, background: RED, color: "#fff", fontSize: 9, fontWeight: 700, borderRadius: 8, padding: "1px 5px" }}>
                {topbarNotifications.filter((n) => !n.read).length}
              </span>
            </button>
            {notifPanelOpen && (
              <div style={{ position: "absolute", right: 0, top: 38, width: 340, background: BG3, border: `1px solid ${BORDER}`, borderRadius: 8, overflow: "hidden", boxShadow: "0 8px 24px rgba(0,0,0,0.4)", zIndex: 40 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", borderBottom: `1px solid ${BORDER}` }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Notifications</span>
                  <span onClick={() => { setNotifPanelOpen(false); router.push("/admin/notifications"); }} style={{ fontSize: 12, color: GOLD, cursor: "pointer" }}>
                    View All
                  </span>
                </div>
                {topbarNotifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => { setNotifPanelOpen(false); alert(`Open notification: "${n.text}" (demo action).`); }}
                    style={{ padding: "11px 14px", borderBottom: `1px solid ${BORDER}`, cursor: "pointer", background: n.read ? "transparent" : "rgba(212,166,74,0.06)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = BG4)}
                    onMouseLeave={(e) => (e.currentTarget.style.background = n.read ? "transparent" : "rgba(212,166,74,0.06)")}
                  >
                    <div style={{ fontSize: 13, color: "#fff" }}>{n.text}</div>
                    <div style={{ fontSize: 11, color: TEXT_MUTED, marginTop: 4 }}>{n.time}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ position: "relative" }}>
            <button
              onClick={() => { setProfileOpen((p) => !p); setNotifPanelOpen(false); setMsgPanelOpen(false); }}
              style={{ display: "flex", alignItems: "center", gap: 10, background: "transparent", border: "none", cursor: "pointer", color: "#fff" }}
            >
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
                  <div
                    key={m.label}
                    onClick={() => { setProfileOpen(false); go(router, m); }}
                    style={{ padding: "10px 14px", fontSize: 13, cursor: "pointer", color: m.label === "Logout" ? RED : "#E6E8EC", borderBottom: `1px solid ${BORDER}` }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = BG4)}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
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
        <div
          style={{
            width: sidebarWidth,
            minWidth: sidebarWidth,
            background: BG2,
            borderRight: `1px solid ${BORDER}`,
            minHeight: "calc(100vh - 68px)",
            display: "flex",
            flexDirection: "column",
            transition: "width 0.2s ease",
            position: "sticky",
            top: 68,
            alignSelf: "flex-start",
          }}
        >
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
                <div
                  key={item.label}
                  onClick={() => go(router, item)}
                  title={collapsed ? item.label : undefined}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: collapsed ? "10px 0" : "10px 12px",
                    justifyContent: collapsed ? "center" : "flex-start",
                    borderRadius: 6,
                    cursor: "pointer",
                    color: "#cfd3da",
                    fontSize: 14,
                    marginBottom: 2,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = BG3)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <Icon size={17} />
                  {!collapsed && <span>{item.label}</span>}
                </div>
              );
            })}
          </div>

          <div style={{ padding: "10px 8px", borderTop: `1px solid ${BORDER}` }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: collapsed ? "10px 0" : "9px 12px",
                justifyContent: collapsed ? "center" : "space-between",
                borderRadius: 6,
                background: "rgba(212,166,74,0.12)",
                border: `1px solid ${GOLD}`,
                color: GOLD,
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <User size={17} />
                {!collapsed && <span>Account Settings</span>}
              </div>
              {!collapsed && <ChevronRight size={14} />}
            </div>
          </div>
        </div>

        {/* ---------------- MAIN CONTENT ---------------- */}
        <div style={{ flex: 1, padding: "24px 28px", display: "flex", gap: 24 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <h1 style={{ fontFamily: BEBAS, fontSize: 32, letterSpacing: 1, color: GOLD, margin: 0 }}>ACCOUNT SETTINGS</h1>
                <p style={{ fontSize: 14, color: TEXT_MUTED, margin: "4px 0 0" }}>
                  Manage your personal profile, login credentials, security preferences and notification settings.
                </p>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={handleCancel}
                  style={{ background: "transparent", border: `1px solid ${BORDER}`, color: "#cfd3da", borderRadius: 6, padding: "10px 18px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  style={{ background: GOLD, color: BG, border: "none", borderRadius: 6, padding: "10px 18px", fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
                >
                  <Save size={15} />
                  {saved ? "Saved!" : "Save Changes"}
                </button>
              </div>
            </div>

            {/* Profile Information + Login Credentials */}
            <div style={{ display: "flex", gap: 20, marginBottom: 20, alignItems: "stretch" }}>
              <div style={{ flex: 1.6 }}>
                <Card>
                  <CardHeader icon={User} title="Profile Information" />
                  <div style={{ display: "flex", gap: 22 }}>
                    <div style={{ textAlign: "center", flexShrink: 0 }}>
                      <img
                        src="https://i.pravatar.cc/200?img=12"
                        alt="Profile"
                        style={{ width: 96, height: 96, borderRadius: "50%", objectFit: "cover", border: `2px solid ${GOLD}`, marginBottom: 10 }}
                      />
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
                        <input style={inputStyle} value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                      </Field>
                      <Field label="Last Name">
                        <input style={inputStyle} value={lastName} onChange={(e) => setLastName(e.target.value)} />
                      </Field>
                      <Field label="Display Name">
                        <input style={inputStyle} value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                      </Field>
                      <Field label="Designation">
                        <input style={inputStyle} value={designation} onChange={(e) => setDesignation(e.target.value)} />
                      </Field>
                      <Field label="Department">
                        <input style={inputStyle} value={department} onChange={(e) => setDepartment(e.target.value)} />
                      </Field>
                      <Field label="Employee ID">
                        <input style={{ ...inputStyle, color: TEXT_MUTED }} value={employeeId} readOnly />
                      </Field>
                      <Field label="Email Address">
                        <input style={inputStyle} value={email} onChange={(e) => setEmail(e.target.value)} />
                      </Field>
                      <Field label="Mobile Number">
                        <input style={inputStyle} value={mobile} onChange={(e) => setMobile(e.target.value)} />
                      </Field>
                    </div>
                  </div>
                </Card>
              </div>

              <div style={{ flex: 1 }}>
                <Card>
                  <CardHeader icon={Lock} title="Login Credentials" />
                  <Field label="Username">
                    <input style={{ ...inputStyle, color: TEXT_MUTED }} value={username} readOnly />
                  </Field>
                  <Field label="Password">
                    <div style={{ position: "relative" }}>
                      <input style={{ ...inputStyle, paddingRight: 38 }} type={showPassword ? "text" : "password"} value={password} readOnly />
                      <div onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: 10, top: 11, cursor: "pointer", color: TEXT_MUTED }}>
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </div>
                    </div>
                  </Field>
                  <button
                    onClick={() => alert("Change Password dialog would open here (demo action).")}
                    style={{ width: "100%", background: "transparent", border: `1px solid ${GOLD}`, color: GOLD, borderRadius: 6, padding: "10px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, marginBottom: 10 }}
                  >
                    <KeyRound size={14} />
                    Change Password
                  </button>
                  <button
                    onClick={() => alert("New recovery codes generated (demo action). Previous codes are now invalid.")}
                    style={{ width: "100%", background: "transparent", border: `1px solid ${BORDER}`, color: "#cfd3da", borderRadius: 6, padding: "10px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}
                  >
                    <RefreshCw size={14} />
                    Generate Recovery Codes
                  </button>
                </Card>
              </div>
            </div>

            {/* Two-Factor Authentication + Session Management */}
            <div style={{ display: "flex", gap: 20, marginBottom: 20, alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <Card>
                  <CardHeader icon={Shield} title="Two-Factor Authentication" />
                  <div style={{ background: "rgba(34,197,94,0.08)", border: `1px solid ${GREEN}`, borderRadius: 8, padding: 14, marginBottom: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7, color: GREEN, fontWeight: 700, fontSize: 13, marginBottom: 4 }}>
                      <ShieldCheck size={15} />
                      Enabled
                    </div>
                    <div style={{ fontSize: 12, color: "#cfd3da" }}>Authentication App</div>
                    <div style={{ fontSize: 12, color: TEXT_MUTED }}>Backup Codes Remaining: {backupCodesRemaining}</div>
                  </div>
                  <button
                    onClick={() => alert("Manage 2FA Configuration dialog would open here (demo action).")}
                    style={{ width: "100%", background: "transparent", border: `1px solid ${GOLD}`, color: GOLD, borderRadius: 6, padding: "10px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", marginBottom: 8 }}
                  >
                    Configure
                  </button>
                  <button
                    onClick={() => alert("Backup codes regenerated (demo action).")}
                    style={{ width: "100%", background: "transparent", border: `1px solid ${BORDER}`, color: "#cfd3da", borderRadius: 6, padding: "10px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}
                  >
                    <RefreshCw size={13} />
                    Regenerate Codes
                  </button>
                </Card>

                <div style={{ height: 20 }} />

                <Card>
                  <CardHeader icon={SettingsIcon} title="Personal Preferences" />
                  <Field label="Theme">
                    <select style={inputStyle} value={theme} onChange={(e) => setTheme(e.target.value)}>
                      <option>Dark</option>
                      <option>Light</option>
                      <option>System Default</option>
                    </select>
                  </Field>
                  <Field label="Language">
                    <select style={inputStyle} value={language} onChange={(e) => setLanguage(e.target.value)}>
                      <option>English</option>
                      <option>Hindi</option>
                      <option>Tamil</option>
                    </select>
                  </Field>
                  <Field label="Time Zone">
                    <select style={inputStyle} value={timezone} onChange={(e) => setTimezone(e.target.value)}>
                      <option>(GMT+05:30) Asia/Kolkata</option>
                      <option>(GMT+00:00) UTC</option>
                      <option>(GMT-05:00) America/New_York</option>
                    </select>
                  </Field>
                  <Field label="Date Format">
                    <select style={inputStyle} value={dateFormat} onChange={(e) => setDateFormat(e.target.value)}>
                      <option>24 Jun 2026</option>
                      <option>06/24/2026</option>
                      <option>2026-06-24</option>
                    </select>
                  </Field>
                  <Field label="Time Format">
                    <select style={inputStyle} value={timeFormat} onChange={(e) => setTimeFormat(e.target.value)}>
                      <option>12 Hour (hh:mm AM/PM)</option>
                      <option>24 Hour</option>
                    </select>
                  </Field>
                </Card>
              </div>

              <div style={{ flex: 1.4 }}>
                <Card>
                  <CardHeader icon={Monitor} title="Session Management" />
                  <div style={{ fontSize: 12, color: TEXT_MUTED, marginTop: -10, marginBottom: 14 }}>Manage your active sessions across devices.</div>

                  <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1.2fr 1fr 0.9fr 0.9fr", padding: "0 0 8px", borderBottom: `1px solid ${BORDER}` }}>
                    <div style={{ fontSize: 10, color: TEXT_MUTED, fontWeight: 600 }}>DEVICE</div>
                    <div style={{ fontSize: 10, color: TEXT_MUTED, fontWeight: 600 }}>BROWSER / APP</div>
                    <div style={{ fontSize: 10, color: TEXT_MUTED, fontWeight: 600 }}>LOCATION</div>
                    <div style={{ fontSize: 10, color: TEXT_MUTED, fontWeight: 600 }}>LAST ACTIVE</div>
                    <div style={{ fontSize: 10, color: TEXT_MUTED, fontWeight: 600 }}>STATUS</div>
                    <div style={{ fontSize: 10, color: TEXT_MUTED, fontWeight: 600, textAlign: "right" }}>ACTION</div>
                  </div>

                  {sessions.map((s) => {
                    const Icon = DEVICE_ICON_MAP[s.icon] || Monitor;
                    return (
                      <div key={s.id} style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1.2fr 1fr 0.9fr 0.9fr", alignItems: "center", padding: "11px 0", borderBottom: `1px solid ${BORDER}` }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <Icon size={15} color={TEXT_MUTED} />
                          <div>
                            <div style={{ fontSize: 12, color: "#fff" }}>{s.device}</div>
                            {s.current && <div style={{ fontSize: 10, color: GOLD }}>Current</div>}
                          </div>
                        </div>
                        <div style={{ fontSize: 12, color: "#cfd3da" }}>{s.browser}</div>
                        <div>
                          <div style={{ fontSize: 12, color: "#cfd3da" }}>{s.location}</div>
                          <div style={{ fontSize: 10, color: TEXT_MUTED }}>{s.ip}</div>
                        </div>
                        <div style={{ fontSize: 11, color: TEXT_MUTED }}>{s.lastActive}</div>
                        <div>
                          <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 4, background: s.current ? `${BLUE}22` : `${GREEN}22`, color: s.current ? BLUE : GREEN }}>
                            {s.status}
                          </span>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          {s.current ? (
                            <span style={{ fontSize: 12, color: TEXT_MUTED }}>—</span>
                          ) : (
                            <span onClick={() => terminateSession(s.id)} style={{ fontSize: 12, color: RED, cursor: "pointer" }}>
                              Terminate
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  <button
                    onClick={terminateAllOthers}
                    style={{ width: "100%", marginTop: 16, background: "transparent", border: `1px solid ${RED}`, color: RED, borderRadius: 6, padding: "10px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}
                  >
                    <AlertOctagon size={14} />
                    Terminate All Other Sessions
                  </button>
                </Card>

                <div style={{ height: 20 }} />

                <Card>
                  <CardHeader icon={PenTool} title="Digital Signature" />
                  <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
                    <div style={{ background: "#fff", borderRadius: 8, padding: "18px 24px", flexShrink: 0 }}>
                      <span style={{ fontFamily: "cursive", fontSize: 26, color: "#222" }}>Arun Kumar</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, color: TEXT_MUTED, marginBottom: 10 }}>
                        Upload your digital signature. Used for approvals, reports and certificates.
                      </div>
                      <button
                        onClick={() => alert("Upload Signature dialog would open here (demo action).")}
                        style={{ background: "transparent", border: `1px solid ${GOLD}`, color: GOLD, borderRadius: 6, padding: "9px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 7 }}
                      >
                        <Upload size={14} />
                        Upload Signature
                      </button>
                      <div style={{ fontSize: 10, color: TEXT_MUTED, marginTop: 6 }}>PNG or JPG. Max 2MB</div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Connected Devices */}
            <Card>
              <CardHeader icon={Smartphone} title="Connected Devices" />
              <div style={{ fontSize: 12, color: TEXT_MUTED, marginTop: -10, marginBottom: 14 }}>Devices you trust and use to access your account.</div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 18 }}>
                {devices.map((d) => {
                  const Icon = DEVICE_ICON_MAP[d.icon] || Monitor;
                  return (
                    <div key={d.id} style={{ border: `1px solid ${BORDER}`, borderRadius: 8, padding: 14, position: "relative" }}>
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 }}>
                        <Icon size={20} color={GOLD} />
                        <MoreVertical size={15} color={TEXT_MUTED} style={{ cursor: "pointer" }} onClick={() => setDeviceMenuOpen(deviceMenuOpen === d.id ? null : d.id)} />
                        {deviceMenuOpen === d.id && (
                          <div style={{ position: "absolute", right: 8, top: 36, background: BG3, border: `1px solid ${BORDER}`, borderRadius: 6, width: 140, zIndex: 10, boxShadow: "0 8px 20px rgba(0,0,0,0.4)" }}>
                            <div
                              onClick={() => { setDeviceMenuOpen(null); alert(`Viewing details for ${d.name} (demo action).`); }}
                              style={{ padding: "9px 12px", fontSize: 12, color: "#cfd3da", cursor: "pointer" }}
                              onMouseEnter={(e) => (e.currentTarget.style.background = BG4)}
                              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                            >
                              View Details
                            </div>
                            {!d.current && (
                              <div
                                onClick={() => { setDeviceMenuOpen(null); removeDevice(d.id); }}
                                style={{ padding: "9px 12px", fontSize: 12, color: RED, cursor: "pointer" }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = BG4)}
                                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                              >
                                Remove Device
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{d.name}</div>
                      {d.current && (
                        <div style={{ fontSize: 11, color: GREEN, display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                          <CheckCircle2 size={11} />
                          Current Device
                        </div>
                      )}
                      <div style={{ fontSize: 12, color: TEXT_MUTED, marginTop: 6 }}>{d.os}</div>
                      <div style={{ fontSize: 12, color: TEXT_MUTED }}>{d.browser}</div>
                    </div>
                  );
                })}
              </div>

              <div style={{ textAlign: "center" }}>
                <button
                  onClick={removeAllDevices}
                  style={{ background: "transparent", border: `1px solid ${RED}`, color: RED, borderRadius: 6, padding: "10px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 7 }}
                >
                  <Trash2 size={14} />
                  Remove All Devices
                </button>
              </div>
            </Card>
          </div>

          {/* ---------------- RIGHT RAIL ---------------- */}
          <div style={{ width: 300, minWidth: 300, display: "flex", flexDirection: "column", gap: 20 }}>
            <RailCard title="ACCOUNT SUMMARY" color={GOLD}>
              <div style={{ fontSize: 12, color: TEXT_MUTED, marginBottom: 6 }}>Profile Completion</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <div style={{ flex: 1, height: 7, background: BG4, borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ width: "100%", height: "100%", background: GREEN }} />
                </div>
                <span style={{ fontSize: 12, color: GREEN, fontWeight: 700 }}>100%</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 13 }}>
                <span style={{ color: "#cfd3da" }}>Last Login</span>
                <span style={{ color: "#fff" }}>Today, 24 Jun 2026 · 08:14 AM</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 13 }}>
                <span style={{ color: "#cfd3da" }}>Role</span>
                <span style={{ color: "#fff" }}>Super Administrator</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 13 }}>
                <span style={{ color: "#cfd3da" }}>Status</span>
                <span style={{ color: GREEN, display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: GREEN }} />
                  Active
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 13 }}>
                <span style={{ color: "#cfd3da" }}>Member Since</span>
                <span style={{ color: "#fff" }}>12 Mar 2023</span>
              </div>
            </RailCard>

            <RailCard title="SECURITY STATUS" color={GOLD}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#cfd3da" }}>
                  <CheckCircle2 size={14} color={GREEN} />
                  Password Updated
                </div>
                <span style={{ fontSize: 12, color: TEXT_MUTED }}>7 Days Ago</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#cfd3da" }}>
                  <CheckCircle2 size={14} color={GREEN} />
                  Two-Factor Authentication
                </div>
                <span style={{ fontSize: 12, color: GREEN }}>Enabled</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#cfd3da" }}>
                  <CheckCircle2 size={14} color={GREEN} />
                  Recovery Codes
                </div>
                <span style={{ fontSize: 12, color: TEXT_MUTED }}>{backupCodesRemaining} Available</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#cfd3da" }}>
                  <CheckCircle2 size={14} color={GREEN} />
                  Trusted Devices
                </div>
                <span style={{ fontSize: 12, color: TEXT_MUTED }}>{devices.length} Devices</span>
              </div>
            </RailCard>

            <RailCard title="RECENT LOGIN HISTORY" color={GOLD}>
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: -36, marginBottom: 12 }} />
              {[
                { when: "Today, 08:14 AM", browser: "Chrome on Windows", location: "Chennai, India" },
                { when: "Yesterday, 09:15 AM", browser: "Edge on Windows", location: "Chennai, India" },
                { when: "2 Days Ago, 07:45 PM", browser: "Android Mobile", location: "Bengaluru, India" },
              ].map((h, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "9px 0", borderBottom: `1px solid ${BORDER}` }}>
                  <Clock size={14} color={TEXT_MUTED} style={{ marginTop: 2 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, color: "#fff" }}>{h.when}</div>
                    <div style={{ fontSize: 11, color: TEXT_MUTED }}>{h.browser}</div>
                  </div>
                  <div style={{ fontSize: 11, color: TEXT_MUTED, textAlign: "right" }}>{h.location}</div>
                </div>
              ))}
              <div style={{ textAlign: "center", marginTop: 10 }}>
                <span onClick={() => router.push("/admin/activity-log")} style={{ fontSize: 12, color: GOLD, cursor: "pointer" }}>
                  View All Login History
                </span>
              </div>
            </RailCard>

            <RailCard title="NOTIFICATION PREFERENCES" color={GOLD}>
              {[
                { key: "emailAlerts", label: "Email Alerts" },
                { key: "securityAlerts", label: "Security Alerts" },
                { key: "loginAlerts", label: "Login Alerts" },
                { key: "maintenanceUpdates", label: "Maintenance Updates" },
                { key: "weeklyReports", label: "Weekly Reports" },
              ].map((p) => (
                <div key={p.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 0" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#cfd3da" }}>
                    <CheckCircle2 size={13} color={GREEN} />
                    {p.label}
                  </div>
                  <ToggleSwitch on={(notifPrefs as any)[p.key]} onClick={() => toggleNotifPref(p.key as keyof typeof notifPrefs)} />
                </div>
              ))}
            </RailCard>

            <RailCard title="QUICK ACTIONS" color={GOLD}>
              <div onClick={() => alert("Your data export has started. You'll receive a download link by email (demo action).")} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", cursor: "pointer", borderBottom: `1px solid ${BORDER}`, color: "#cfd3da" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
                  <Download size={15} color={TEXT_MUTED} />
                  Download My Data
                </div>
                <ChevronRight size={13} color={TEXT_MUTED} />
              </div>
              <div onClick={() => alert("Login history export started (demo action).")} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", cursor: "pointer", borderBottom: `1px solid ${BORDER}`, color: "#cfd3da" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
                  <FileSearch size={15} color={TEXT_MUTED} />
                  Export Login History
                </div>
                <ChevronRight size={13} color={TEXT_MUTED} />
              </div>
              <div onClick={() => router.push("/admin/activity-log")} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", cursor: "pointer", borderBottom: `1px solid ${BORDER}`, color: "#cfd3da" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
                  <ScrollText size={15} color={TEXT_MUTED} />
                  View Audit Logs
                </div>
                <ChevronRight size={13} color={TEXT_MUTED} />
              </div>
              <div onClick={() => alert('"Manage API Tokens" page is not built yet. (404)')} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", cursor: "pointer", borderBottom: `1px solid ${BORDER}`, color: "#cfd3da" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
                  <Key size={15} color={TEXT_MUTED} />
                  Manage API Tokens
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