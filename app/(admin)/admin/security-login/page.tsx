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
  Menu,
  ChevronDown,
  ChevronRight,
  Save,
  Inbox,
  Eye,
  EyeOff,
  KeyRound,
  RefreshCw,
  Shield,
  ShieldCheck,
  ShieldOff,
  ShieldAlert,
  Monitor,
  Smartphone,
  Laptop,
  Tablet,
  Trash2,
  Download,
  FileSearch,
  Mail,
  Headphones,
  Info,
  Activity,
  History,
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ fontSize: 13, color: "#cfd3da", display: "block", marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  );
}

function CardHeader({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 6 }}>
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

function ReqRow({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "4px 0", fontSize: 12, color: ok ? "#cfd3da" : TEXT_MUTED }}>
      <CheckCircle2 size={13} color={ok ? GREEN : TEXT_MUTED} />
      {label}
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

function SecurityRing({ percent }: { percent: number }) {
  const size = 150;
  const stroke = 12;
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
        <div style={{ fontSize: 30, fontWeight: 700, color: "#fff" }}>{percent}%</div>
        <div style={{ fontSize: 12, color: GREEN, fontWeight: 600 }}>Excellent</div>
      </div>
    </div>
  );
}

export default function SecurityLoginPage() {
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

  // ---- Change Password ----
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordChecks = {
    minLength: newPassword.length >= 8,
    upper: /[A-Z]/.test(newPassword),
    lower: /[a-z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
    special: /[^A-Za-z0-9]/.test(newPassword),
    match: newPassword.length > 0 && newPassword === confirmPassword,
  };

  const handleUpdatePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Please fill in all password fields.");
      return;
    }
    if (!Object.values(passwordChecks).every(Boolean)) {
      alert("Please make sure your new password meets all requirements and matches the confirmation.");
      return;
    }
    alert("Password updated successfully (demo action).");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  // ---- MFA ----
  const [mfaEnabled, setMfaEnabled] = useState(true);

  const handleDisableMfa = () => {
    if (confirm("Disable multi-factor authentication? This will make your account less secure.")) {
      setMfaEnabled(false);
      alert("MFA disabled (demo action).");
    }
  };

  // ---- Backup Codes ----
  const [backupCodesRemaining, setBackupCodesRemaining] = useState(8);
  const handleRegenerateCodes = () => {
    if (confirm("Regenerate backup codes? This will invalidate all existing codes.")) {
      setBackupCodesRemaining(10);
      alert("New backup codes generated (demo action).");
    }
  };

  // ---- Trusted Devices ----
  const [trustedDevices, setTrustedDevices] = useState([
    { id: "d1", device: "Windows PC", icon: "windows", browser: "Chrome 126", location: "Chennai, India", ip: "103.21.244.0", lastActive: "Now", current: true },
    { id: "d2", device: "MacBook Pro", icon: "mac", browser: "Safari 17", location: "Chennai, India", ip: "103.21.244.0", lastActive: "2 Hours Ago", current: false },
    { id: "d3", device: "iPhone 14", icon: "ios", browser: "Safari iOS", location: "Mumbai, India", ip: "117.211.45.33", lastActive: "2 Days Ago", current: false },
    { id: "d4", device: "Android Mobile", icon: "android", browser: "Chrome Mobile", location: "Bengaluru, India", ip: "2405:db00::8a26:370", lastActive: "Yesterday", current: false },
  ]);

  const removeDevice = (id: string) => {
    if (confirm("Remove this trusted device? It will need to verify identity again on next login.")) {
      setTrustedDevices((d) => d.filter((dev) => dev.id !== id));
    }
  };
  const removeAllOtherDevices = () => {
    if (confirm("Remove all other trusted devices except this one?")) {
      setTrustedDevices((d) => d.filter((dev) => dev.current));
    }
  };

  // ---- Security Email ----
  const [securityEmail, setSecurityEmail] = useState("admin@silverscreens.com");
  const handleChangeEmail = () => {
    const newEmail = prompt("Enter new security email:", securityEmail);
    if (newEmail) {
      setSecurityEmail(newEmail);
      alert("Security email updated (demo action). Please verify the new address.");
    }
  };

  // ---- Login Alerts ----
  const [loginAlertsEnabled, setLoginAlertsEnabled] = useState(true);
  const toggleLoginAlerts = () => {
    setLoginAlertsEnabled((prev) => {
      const next = !prev;
      alert(next ? "Login alerts enabled. You'll be notified by email of any new sign-ins." : "Login alerts disabled (demo action).");
      return next;
    });
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  const sidebarWidth = collapsed ? 52 : 220;

  const loginActivity = [
    { id: 1, label: "Current Session", browser: "Chrome on Windows", location: "Chennai, India", status: "active-now" },
    { id: 2, label: "Today, 10:22 AM", browser: "Chrome on Windows", location: "Chennai, India", status: "success" },
    { id: 3, label: "Today, 09:45 AM", browser: "Edge on Windows", location: "Chennai, India", status: "success" },
    { id: 4, label: "Yesterday, 07:58 AM", browser: "Chrome on Android", location: "Bengaluru, India", status: "success" },
    { id: 5, label: "24 May 2026, 08:15 AM", browser: "Safari on iPhone", location: "Mumbai, India", status: "failed" },
  ];

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
              onClick={() => { setMsgPanelOpen((o) => !o); setNotifPanelOpen(false); setProfileOpen(false); }}
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
              onClick={() => { setNotifPanelOpen((o) => !o); setMsgPanelOpen(false); setProfileOpen(false); }}
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
                <Shield size={17} />
                {!collapsed && <span>Security & Login</span>}
              </div>
              {!collapsed && <ChevronRight size={14} />}
            </div>
          </div>
        </div>

        {/* ---------------- MAIN CONTENT ---------------- */}
        <div style={{ flex: 1, padding: "24px 28px", display: "flex", gap: 20 }}>
          <div style={{ flex: 1.4, minWidth: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <h1 style={{ fontFamily: BEBAS, fontSize: 32, letterSpacing: 1, color: GOLD, margin: 0 }}>SECURITY & LOGIN</h1>
                <p style={{ fontSize: 14, color: TEXT_MUTED, margin: "4px 0 0" }}>Manage your password, authentication methods and login security.</p>
              </div>
              <button
                onClick={handleSave}
                style={{ background: GOLD, color: BG, border: "none", borderRadius: 6, padding: "10px 18px", fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap" }}
              >
                <Save size={15} />
                {saved ? "Saved!" : "Save Changes"}
              </button>
            </div>

            {/* Change Password */}
            <div style={{ marginBottom: 20 }}>
              <Card>
                <CardHeader icon={KeyRound} title="Change Password" />
                <div style={{ fontSize: 12, color: TEXT_MUTED, marginBottom: 16 }}>Regularly update your password to keep your account secure.</div>

                <div style={{ display: "flex", gap: 20 }}>
                  <div style={{ flex: 1.3 }}>
                    <Field label="Current Password">
                      <input style={inputStyle} type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                    </Field>
                    <Field label="New Password">
                      <div style={{ position: "relative" }}>
                        <input style={{ ...inputStyle, paddingRight: 38 }} type={showNewPassword ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                        <div onClick={() => setShowNewPassword(!showNewPassword)} style={{ position: "absolute", right: 10, top: 11, cursor: "pointer", color: TEXT_MUTED }}>
                          {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </div>
                      </div>
                    </Field>
                    <Field label="Confirm New Password">
                      <div style={{ position: "relative" }}>
                        <input style={{ ...inputStyle, paddingRight: 38 }} type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        <div onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ position: "absolute", right: 10, top: 11, cursor: "pointer", color: TEXT_MUTED }}>
                          {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </div>
                      </div>
                    </Field>
                    <button
                      onClick={handleUpdatePassword}
                      style={{ width: "100%", background: GOLD, color: BG, border: "none", borderRadius: 6, padding: "11px 14px", fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                    >
                      <Lock size={14} />
                      Update Password
                    </button>
                  </div>

                  <div style={{ flex: 1, border: `1px solid ${BORDER}`, borderRadius: 8, padding: 14, alignSelf: "flex-start" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: GOLD, marginBottom: 8 }}>Password Requirements</div>
                    <ReqRow ok={passwordChecks.minLength} label="Minimum 8 characters" />
                    <ReqRow ok={passwordChecks.upper} label="At least one uppercase letter" />
                    <ReqRow ok={passwordChecks.lower} label="At least one lowercase letter" />
                    <ReqRow ok={passwordChecks.number} label="At least one number" />
                    <ReqRow ok={passwordChecks.special} label="At least one special character" />
                    <ReqRow ok={passwordChecks.match} label="Passwords must match" />
                    <div style={{ fontSize: 11, color: TEXT_MUTED, marginTop: 10 }}>Last changed: 7 days ago</div>
                  </div>
                </div>
              </Card>
            </div>

            {/* MFA */}
            <div style={{ marginBottom: 20 }}>
              <Card>
                <CardHeader icon={ShieldAlert} title="Multi-Factor Authentication (MFA)" />
                <div style={{ fontSize: 12, color: TEXT_MUTED, marginBottom: 16 }}>Add an extra layer of security to your account.</div>

                <div style={{ display: "flex", gap: 16 }}>
                  <div style={{ flex: 1, border: `1px solid ${mfaEnabled ? GREEN : BORDER}`, borderRadius: 8, padding: 16, display: "flex", alignItems: "center", gap: 12 }}>
                    {mfaEnabled ? <ShieldCheck size={28} color={GREEN} /> : <ShieldOff size={28} color={TEXT_MUTED} />}
                    <div>
                      <div style={{ fontSize: 12, color: TEXT_MUTED }}>MFA Status</div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: mfaEnabled ? GREEN : TEXT_MUTED }}>{mfaEnabled ? "Enabled" : "Disabled"}</div>
                      <div style={{ fontSize: 11, color: TEXT_MUTED }}>{mfaEnabled ? "Your account is protected" : "Your account is at risk"}</div>
                    </div>
                  </div>

                  <div style={{ flex: 1, border: `1px solid ${BORDER}`, borderRadius: 8, padding: 16 }}>
                    <div style={{ fontSize: 12, color: TEXT_MUTED, marginBottom: 8 }}>MFA Method</div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                      <div>
                        <div style={{ fontSize: 13, color: "#fff" }}>Authenticator App {mfaEnabled && "(Primary)"}</div>
                        <div style={{ fontSize: 11, color: TEXT_MUTED }}>Added on 24 May 2026, 10:15 AM</div>
                      </div>
                      {mfaEnabled && (
                        <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 4, background: `${GREEN}22`, color: GREEN }}>Primary</span>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={() => alert("Change MFA Method dialog would open here (demo action).")}
                        style={{ flex: 1, background: "transparent", border: `1px solid ${GOLD}`, color: GOLD, borderRadius: 6, padding: "9px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                      >
                        Change Method
                      </button>
                      <button
                        onClick={handleDisableMfa}
                        disabled={!mfaEnabled}
                        style={{ flex: 1, background: "transparent", border: `1px solid ${RED}`, color: RED, borderRadius: 6, padding: "9px 12px", fontSize: 12, fontWeight: 600, cursor: mfaEnabled ? "pointer" : "not-allowed", opacity: mfaEnabled ? 1 : 0.5, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
                      >
                        <ShieldOff size={12} />
                        Disable MFA
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Backup Codes */}
            <div style={{ marginBottom: 20 }}>
              <Card>
                <CardHeader icon={RefreshCw} title="Backup Codes" />
                <div style={{ fontSize: 12, color: TEXT_MUTED, marginBottom: 16 }}>Use backup codes to sign in if you lose access to your authenticator app.</div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: 12, color: TEXT_MUTED }}>Remaining Codes</div>
                    <div style={{ fontSize: 26, fontWeight: 700, color: "#fff" }}>{backupCodesRemaining}</div>
                    <div style={{ fontSize: 11, color: TEXT_MUTED }}>of 10 available</div>
                    <div style={{ fontSize: 11, color: TEXT_MUTED }}>Generated on 24 May 2026</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <button
                      onClick={handleRegenerateCodes}
                      style={{ background: "transparent", border: `1px solid ${GOLD}`, color: GOLD, borderRadius: 6, padding: "10px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 7 }}
                    >
                      <RefreshCw size={14} />
                      Regenerate Codes
                    </button>
                    <div style={{ fontSize: 11, color: TEXT_MUTED, marginTop: 6 }}>This will invalidate all existing codes.</div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Trusted Devices */}
            <Card>
              <CardHeader icon={Shield} title="Trusted Devices" />
              <div style={{ fontSize: 12, color: TEXT_MUTED, marginBottom: 16 }}>These devices are trusted and can access your account.</div>

              <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1.3fr 1fr 0.8fr 0.8fr", padding: "0 0 8px", borderBottom: `1px solid ${BORDER}` }}>
                <div style={{ fontSize: 10, color: TEXT_MUTED, fontWeight: 600 }}>DEVICE</div>
                <div style={{ fontSize: 10, color: TEXT_MUTED, fontWeight: 600 }}>BROWSER / APP</div>
                <div style={{ fontSize: 10, color: TEXT_MUTED, fontWeight: 600 }}>LOCATION</div>
                <div style={{ fontSize: 10, color: TEXT_MUTED, fontWeight: 600 }}>LAST ACTIVE</div>
                <div style={{ fontSize: 10, color: TEXT_MUTED, fontWeight: 600 }}>STATUS</div>
                <div style={{ fontSize: 10, color: TEXT_MUTED, fontWeight: 600, textAlign: "right" }}>ACTION</div>
              </div>

              {trustedDevices.map((d) => {
                const Icon = DEVICE_ICON_MAP[d.icon] || Monitor;
                return (
                  <div key={d.id} style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1.3fr 1fr 0.8fr 0.8fr", alignItems: "center", padding: "11px 0", borderBottom: `1px solid ${BORDER}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Icon size={15} color={GOLD} />
                      <div>
                        <div style={{ fontSize: 12, color: "#fff" }}>{d.device}</div>
                        {d.current && <div style={{ fontSize: 10, color: GOLD }}>This Device</div>}
                      </div>
                    </div>
                    <div style={{ fontSize: 12, color: "#cfd3da" }}>{d.browser}</div>
                    <div>
                      <div style={{ fontSize: 12, color: "#cfd3da" }}>{d.location}</div>
                      <div style={{ fontSize: 10, color: TEXT_MUTED }}>{d.ip}</div>
                    </div>
                    <div style={{ fontSize: 11, color: TEXT_MUTED }}>{d.lastActive}</div>
                    <div>
                      <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 4, background: `${GREEN}22`, color: GREEN }}>Trusted</span>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      {d.current ? (
                        <span style={{ fontSize: 12, color: TEXT_MUTED }}>—</span>
                      ) : (
                        <span onClick={() => removeDevice(d.id)} style={{ fontSize: 12, color: RED, cursor: "pointer" }}>
                          Remove
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

              <button
                onClick={removeAllOtherDevices}
                style={{ width: "100%", marginTop: 16, background: "transparent", border: `1px solid ${RED}`, color: RED, borderRadius: 6, padding: "10px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}
              >
                <Trash2 size={14} />
                Remove All Other Devices
              </button>
            </Card>
          </div>

          {/* ---------------- MIDDLE COLUMN ---------------- */}
          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 20 }}>
            <Card>
              <CardHeader icon={History} title="Login Activity" />
              <div style={{ fontSize: 12, color: TEXT_MUTED, marginTop: -4, marginBottom: 14 }}>Monitor your recent login activity.</div>

              {loginActivity.map((a) => (
                <div key={a.id} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 0", borderBottom: `1px solid ${BORDER}` }}>
                  <Shield size={15} color={TEXT_MUTED} style={{ marginTop: 2 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: "#fff" }}>{a.label}</div>
                    <div style={{ fontSize: 11, color: TEXT_MUTED }}>{a.browser}</div>
                    <div style={{ fontSize: 11, color: TEXT_MUTED }}>{a.location}</div>
                  </div>
                  {a.status === "active-now" ? (
                    <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 4, background: `${GREEN}22`, color: GREEN }}>Active Now</span>
                  ) : (
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: a.status === "failed" ? RED : GREEN, marginTop: 4 }} />
                  )}
                </div>
              ))}

              <div style={{ textAlign: "center", marginTop: 12 }}>
                <span onClick={() => router.push("/admin/activity-log")} style={{ fontSize: 13, color: GOLD, cursor: "pointer" }}>
                  View All Activity
                </span>
              </div>
            </Card>

            <Card>
              <CardHeader icon={Activity} title="Session Management" />
              <div style={{ fontSize: 12, color: TEXT_MUTED, marginTop: -4, marginBottom: 14 }}>Manage your active sessions across devices.</div>

              <div style={{ fontSize: 12, color: TEXT_MUTED, marginBottom: 4 }}>Current Active Sessions</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: GREEN, marginBottom: 2 }}>
                {trustedDevices.length} <span style={{ fontSize: 14, color: TEXT_MUTED, fontWeight: 400 }}>of 5 allowed</span>
              </div>

              <div style={{ display: "flex", alignItems: "flex-start", gap: 10, background: "rgba(59,130,246,0.1)", border: `1px solid ${BLUE}`, borderRadius: 8, padding: "10px 12px", fontSize: 12, color: "#9DC2FB", marginTop: 12 }}>
                <Info size={14} color={BLUE} style={{ marginTop: 1, flexShrink: 0 }} />
                You can have up to 5 active sessions across web and mobile.
              </div>
            </Card>

            <Card>
              <CardHeader icon={Mail} title="Security Email" />
              <div style={{ fontSize: 12, color: TEXT_MUTED, marginTop: -4, marginBottom: 14 }}>Security alerts and notifications will be sent to this email.</div>

              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <span style={{ fontSize: 14, color: "#fff", fontWeight: 600 }}>{securityEmail}</span>
                <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 4, background: `${GREEN}22`, color: GREEN }}>Verified</span>
              </div>

              <button
                onClick={handleChangeEmail}
                style={{ width: "100%", background: "transparent", border: `1px solid ${GOLD}`, color: GOLD, borderRadius: 6, padding: "10px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
              >
                Change Email
              </button>
            </Card>
          </div>

          {/* ---------------- RIGHT RAIL ---------------- */}
          <div style={{ width: 290, minWidth: 290, display: "flex", flexDirection: "column", gap: 20 }}>
            <RailCard title="SECURITY SCORE" color={GOLD}>
              <SecurityRing percent={92} />
              <div style={{ textAlign: "center", fontSize: 12, color: TEXT_MUTED, marginTop: 14 }}>
                Your account security is excellent.
                <br />
                Keep up the good work!
              </div>
            </RailCard>

            <RailCard title="SECURITY CHECKLIST" color={GOLD}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#cfd3da" }}>
                  <CheckCircle2 size={14} color={GREEN} />
                  Strong Password
                </div>
                <span style={{ fontSize: 12, color: TEXT_MUTED }}>Enforced</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#cfd3da" }}>
                  <CheckCircle2 size={14} color={GREEN} />
                  Two-Factor Authentication
                </div>
                <span style={{ fontSize: 12, color: mfaEnabled ? GREEN : RED }}>{mfaEnabled ? "Enabled" : "Disabled"}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#cfd3da" }}>
                  <CheckCircle2 size={14} color={GREEN} />
                  Recovery Codes
                </div>
                <span style={{ fontSize: 12, color: TEXT_MUTED }}>Available</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#cfd3da" }}>
                  <CheckCircle2 size={14} color={GREEN} />
                  Trusted Devices
                </div>
                <span style={{ fontSize: 12, color: TEXT_MUTED }}>{trustedDevices.length} Devices</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#cfd3da" }}>
                  <CheckCircle2 size={14} color={loginAlertsEnabled ? GREEN : TEXT_MUTED} />
                  Login Alerts
                </div>
                <span style={{ fontSize: 12, color: loginAlertsEnabled ? GREEN : RED }}>{loginAlertsEnabled ? "Enabled" : "Disabled"}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#cfd3da" }}>
                  <CheckCircle2 size={14} color={GREEN} />
                  Account Monitoring
                </div>
                <span style={{ fontSize: 12, color: TEXT_MUTED }}>Active</span>
              </div>
            </RailCard>

            <RailCard title="NEED HELP?" color={GOLD}>
              <div style={{ fontSize: 12, color: TEXT_MUTED, lineHeight: 1.5, marginBottom: 14 }}>
                If you notice any suspicious activity or need assistance with your account, please contact support immediately.
              </div>
              <button
                onClick={() => router.push("/admin/help-support")}
                style={{ width: "100%", background: "transparent", border: `1px solid ${GOLD}`, color: GOLD, borderRadius: 6, padding: "10px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}
              >
                <Headphones size={14} />
                Contact Support
              </button>
            </RailCard>

            <RailCard title="QUICK ACTIONS" color={GOLD}>
              <div onClick={() => router.push("/admin/activity-log")} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", cursor: "pointer", borderBottom: `1px solid ${BORDER}`, color: "#cfd3da" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
                  <History size={15} color={TEXT_MUTED} />
                  View Login History
                </div>
                <ChevronRight size={13} color={TEXT_MUTED} />
              </div>
              <div onClick={() => alert("Account activity export started (demo action).")} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", cursor: "pointer", borderBottom: `1px solid ${BORDER}`, color: "#cfd3da" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
                  <Download size={15} color={TEXT_MUTED} />
                  Download Account Activity
                </div>
                <ChevronRight size={13} color={TEXT_MUTED} />
              </div>
              <div onClick={handleRegenerateCodes} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", cursor: "pointer", borderBottom: `1px solid ${BORDER}`, color: "#cfd3da" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
                  <FileSearch size={15} color={TEXT_MUTED} />
                  Manage Recovery Codes
                </div>
                <ChevronRight size={13} color={TEXT_MUTED} />
              </div>
              <div onClick={toggleLoginAlerts} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", cursor: "pointer", color: "#cfd3da" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
                  <Bell size={15} color={TEXT_MUTED} />
                  {loginAlertsEnabled ? "Disable Login Alerts" : "Enable Login Alerts"}
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