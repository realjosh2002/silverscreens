"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  Home, Users, CheckCircle2, Building2, ClipboardCheck, FileText,
  BarChart3, AlertTriangle, Layers, Megaphone, Bell, MessageSquare,
  CreditCard, Settings as SettingsIcon, Lock, ScrollText, ChevronLeft,
  ChevronRight, Menu, ChevronDown, Inbox, User, Camera, Pencil,
  Calendar, Globe, Shield, Activity, Link2, Plus, Trash2, KeyRound,
  Download, Zap, UserCircle2, Tag, MapPin,
} from "lucide-react";
import AdminTopnav from '@/components/layout/AdminTopnav'
import AdminSidebar from '@/components/layout/AdminSidebar'

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

type NavItem = { label: string; href: string; icon: React.ElementType; built: boolean };

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard",               href: "/admin/dashboard",             icon: Home,           built: true },
  { label: "User Management",         href: "/admin/users",                 icon: Users,          built: true },
  { label: "Talent Verification",     href: "/admin/talent-verification",   icon: CheckCircle2,   built: true },
  { label: "Agency Verification",     href: "/admin/agency-verification",   icon: Building2,      built: true },
  { label: "Applications Monitoring", href: "/admin/applications",          icon: ClipboardCheck, built: true },
  { label: "Reports & Complaints",    href: "/admin/reports",               icon: FileText,       built: true },
  { label: "Fraud Detection",         href: "/admin/fraud-detection",       icon: AlertTriangle,  built: true },
  { label: "Subscription Management", href: "/admin/subscriptions",         icon: CreditCard,     built: true },
  { label: "Pricing Management",      href: "/admin/pricing",               icon: Tag,            built: true },
  { label: "Location Management",     href: "/admin/locations",             icon: MapPin,         built: true },
  { label: "Advertisement Management",href: "/admin/advertisements",        icon: Megaphone,      built: true },
  { label: "CMS Management",          href: "/admin/cms",                   icon: Layers,         built: true },
  { label: "Notifications Management",href: "/admin/notifications",         icon: Bell,           built: true },
  { label: "Analytics & Reports",     href: "/admin/analytics",             icon: BarChart3,      built: true },
  { label: "Support Tickets",         href: "/admin/support",       icon: Inbox,          built: true },
  { label: "Audit Logs",              href: "/admin/audit",                 icon: ScrollText,     built: true },
  { label: "Roles & Permissions",     href: "/admin/roles-permissions",     icon: Lock,           built: true },
  { label: "System Settings",         href: "/admin/settings",              icon: SettingsIcon,   built: true },
];

const PROFILE_MENU = [
  { label: "My Profile",       href: "/admin/profile",          built: true },
  { label: "Account Settings", href: "/admin/account-settings", built: true },
  { label: "Security & Login", href: "/admin/security-login",   built: true },
  { label: "Notification Preferences", href: "/admin/account-settings", built: true },
  { label: "Activity Log",     href: "/admin/audit",            built: true },
  { label: "Help & Support",   href: "/admin/help-support",     built: true },
  { label: "Logout",           href: "/login",                  built: true },
];

const PROFILE_TABS = [
  { key: "profile",       label: "Profile Information", icon: User,         href: null },
  { key: "preferences",   label: "Preferences",         icon: SettingsIcon, href: "/admin/account-settings" },
  { key: "security",      label: "Security",            icon: Shield,       href: "/admin/security-login" },
  { key: "notifications", label: "Notifications",       icon: Bell,         href: "/admin/notifications" },
  { key: "activity",      label: "Activity",            icon: Activity,     href: "/admin/audit" },
];

function go(router: ReturnType<typeof useRouter>, item: { href: string; built: boolean; label: string }) {
  if (item.built) { router.push(item.href); }
  else { alert('"' + item.label + '" page is not built yet.'); }
}

const inputStyle: React.CSSProperties = {
  width: "100%", background: BG3, border: "1px solid " + BORDER, borderRadius: 6,
  padding: "10px 12px", fontSize: 14, color: "#fff", fontFamily: BARLOW,
  outline: "none", boxSizing: "border-box",
};
const readOnlyInputStyle: React.CSSProperties = { ...inputStyle, color: "#cfd3da" };

function Field({ label, children, badge }: { label: string; children: React.ReactNode; badge?: { text: string; color: string } }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
        <label style={{ fontSize: 13, color: "#cfd3da" }}>{label}</label>
        {badge && <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 4, background: badge.color + "22", color: badge.color }}>{badge.text}</span>}
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
  return <div style={{ background: BG2, border: "1px solid " + BORDER, borderRadius: 10, padding: 20 }}>{children}</div>;
}

function RailCard({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return (
    <div style={{ background: BG2, border: "1px solid " + BORDER, borderRadius: 10, padding: 18 }}>
      <h3 style={{ fontFamily: BARLOW, fontWeight: 700, fontSize: 15, color, margin: "0 0 14px", letterSpacing: 0.5 }}>{title}</h3>
      {children}
    </div>
  );
}

function CompletionRing({ percent }: { percent: number }) {
  const size = 140, stroke = 11, r = (size - stroke) / 2;
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
  const [saving, setSaving] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState("https://i.pravatar.cc/200?img=12");
  const [userId, setUserId] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("Arun");
  const [lastName, setLastName] = useState("Kumar");
  const [displayName, setDisplayName] = useState("Arun Kumar");
  const [designation] = useState("Super Administrator");
  const [email, setEmail] = useState("admin@silverscreens.in");
  const [department] = useState("Administration");
  const [mobile, setMobile] = useState("+91 98765 43210");
  const [dob, setDob] = useState("1985-01-15");
  const [employeeId, setEmployeeId] = useState("SS-ADM-001");
  const [language, setLanguage] = useState("English");
  const [officeLocation] = useState("Chennai, India");
  const [timezone] = useState("(GMT+05:30) Asia/Kolkata");
  const [bio, setBio] = useState("Passionate about building secure, scalable platforms and enabling talent to shine on the global stage.");
  const [memberSince, setMemberSince] = useState("12 Mar 2023");
  const [lastLogin, setLastLogin] = useState("—");
  const [socialLinks, setSocialLinks] = useState([
    { id: "li",  icon: "linkedin", url: "https://linkedin.com/in/arunkumar" },
    { id: "tw",  icon: "twitter",  url: "https://twitter.com/arunkumar" },
    { id: "web", icon: "web",      url: "https://www.arunkumar.com" },
  ]);

  const topbarNotifications = [
    { id: 1, text: "New agency verification request submitted", time: "5 minutes ago", read: false },
    { id: 2, text: "Payment gateway Stripe was disconnected",   time: "32 minutes ago", read: false },
    { id: 3, text: "Subscription plan renewed for Razorpay Studios", time: "1 hour ago", read: false },
    { id: 4, text: "Weekly platform report is ready to download",    time: "Yesterday",  read: true },
  ];
  const topbarMessages = [
    { id: 1, sender: "Priya Sharma (Verifier)",        text: "Can you review the pending talent docs?", time: "10 minutes ago", read: false },
    { id: 2, sender: "Arjun Mehta (Content Moderator)",text: "Flagged 3 casting calls for spam.",       time: "1 hour ago",     read: false },
    { id: 3, sender: "Support Team",                   text: "Ticket #2245 has been escalated to you.", time: "2 hours ago",    read: true },
  ];

  const loadProfile = useCallback(async function() {
    try {
      // Always trust localStorage first — app uses its own auth system
      let uid: string | null = null;

      const stored = localStorage.getItem("ss_user");
      if (stored) {
        const parsed = JSON.parse(stored);
        uid = parsed?.userId || parsed?.id || null;
      }

      // Fallback to Supabase session if localStorage empty
      if (!uid) {
        const { data: sessData } = await supabase.auth.getSession();
        uid = sessData?.session?.user?.id || null;
      }

      console.log("loadProfile uid:", uid);
      if (!uid) return;
      setUserId(uid);
      const { data } = await supabase
        .from("profiles")
        .select("name, display_name, email, phone, avatar_url, profile_number, created_at, last_login_at")
        .eq("id", uid)
        .single();
      if (!data) return;
      if (data.name) {
        const parts = data.name.trim().split(" ");
        setFirstName(parts[0] || "");
        setLastName(parts.slice(1).join(" ") || "");
        // Use display_name if set, otherwise fall back to full name
        setDisplayName(data.display_name || data.name);
      }
      if (data.email) setEmail(data.email);
      if (data.phone) setMobile(data.phone);
      if (data.avatar_url) setAvatarSrc(data.avatar_url);
      if (data.profile_number) setEmployeeId(data.profile_number);
      if (data.created_at) setMemberSince(new Date(data.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }));
      if (data.last_login_at) setLastLogin(new Date(data.last_login_at).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }));
    } catch (e) { console.error("loadProfile:", e); }
  }, []);

  useEffect(function() { loadProfile(); }, [loadProfile]);

  async function handleSave() {
    setSaving(true);
    try {
      // Use stored userId, fallback to localStorage, fallback to session
      let uid = userId;

      if (!uid) {
        const stored = localStorage.getItem("ss_user");
        if (stored) {
          const parsed = JSON.parse(stored);
          uid = parsed?.userId || parsed?.id || parsed?.user?.id;
        }
      }

      if (!uid) {
        const { data: sessData } = await supabase.auth.getSession();
        uid = sessData?.session?.user?.id || null;
      }

      console.log("Save uid:", uid);

      if (!uid) { alert("Could not find user ID. Please log out and log back in."); setSaving(false); return; }

      // Save full name from first + last, keep display name local only
      const fullName = (firstName + " " + lastName).trim();

      let avatarUrl: string | undefined = undefined;

      // Upload photo to Supabase Storage if changed
      if (avatarSrc.startsWith("data:")) {
        try {
          const res = await fetch(avatarSrc);
          const blob = await res.blob();
          const ext = blob.type.includes("png") ? "png" : "jpg";
          const path = "avatars/" + uid + "." + ext;
          const { error: upErr } = await supabase.storage
            .from("assets")
            .upload(path, blob, { upsert: true, contentType: blob.type });
          if (!upErr) {
            const { data: urlData } = supabase.storage.from("assets").getPublicUrl(path);
            if (urlData?.publicUrl) {
              avatarUrl = urlData.publicUrl + "?t=" + Date.now();
              setAvatarSrc(avatarUrl);
            }
          }
        } catch (photoErr) {
          console.error("Photo upload error:", photoErr);
        }
      }

      // Save profile via API route (uses service role key — no permission issues)
      console.log("Calling save API with uid:", uid, "name:", fullName);
      const saveRes = await fetch("/api/admin/save-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId:       uid,
          name:         fullName,
          display_name: displayName.trim(),
          email:        email,
          phone:        mobile,
          ...(avatarUrl ? { avatar_url: avatarUrl } : {}),
        }),
      });

      console.log("API response status:", saveRes.status);
      const saveJson = await saveRes.json();
      console.log("API response:", saveJson);
      if (!saveJson.success) {
        alert("Failed to save: " + saveJson.error);
        setSaving(false);
        return;
      }

      setSaving(false); setSaved(true); setEditMode(false);
      setTimeout(function() { setSaved(false); }, 2200);
    } catch (e: any) { alert("Error: " + e.message); setSaving(false); }
  }

  function handleEditToggle() {
    if (editMode) {
      handleSave();
    } else {
      setEditMode(true);
    }
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert("File too large. Max 5MB."); return; }
    const reader = new FileReader();
    reader.onload = function(ev) { if (ev.target?.result) setAvatarSrc(ev.target.result as string); };
    reader.readAsDataURL(file);
  }

  function removeSocialLink(id: string) {
    if (confirm("Remove this social link?")) { setSocialLinks(function(links) { return links.filter(function(l) { return l.id !== id; }); }); }
  }

  function addSocialLink() {
    const url = prompt("Enter the URL for the new social link:");
    if (url) { setSocialLinks(function(links) { return [...links, { id: "link-" + Date.now(), icon: "web", url }]; }); }
  }

  const sidebarWidth = collapsed ? 52 : 220;
  const SOCIAL_ICON_MAP: Record<string, React.ElementType> = { linkedin: Link2, twitter: MessageSquare, web: Globe };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", background: BG, fontFamily: BARLOW, color: "#E6E8EC" }}>

      {/* TOPNAV */}
      <AdminTopnav />
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <AdminSidebar />
        <div style={{ flex: 1, padding: "24px 28px", display: "flex", gap: 20 }}>
          <div style={{ flex: 1.6, minWidth: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <h1 style={{ fontFamily: BEBAS, fontSize: 32, letterSpacing: 1, color: GOLD, margin: 0 }}>MY PROFILE</h1>
                <p style={{ fontSize: 14, color: TEXT_MUTED, margin: "4px 0 0" }}>View and manage your personal information, preferences and profile settings.</p>
              </div>
              <button onClick={handleEditToggle} disabled={saving}
                style={{ background: GOLD, color: BG, border: "none", borderRadius: 6, padding: "10px 18px", fontSize: 14, fontWeight: 700, cursor: saving ? "wait" : "pointer", display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap", opacity: saving ? 0.7 : 1 }}>
                <Pencil size={14} />
                {saving ? "Saving..." : saved ? "Saved!" : editMode ? "Save Changes" : "Edit Profile"}
              </button>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: 22, borderBottom: "1px solid " + BORDER, marginBottom: 20 }}>
              {PROFILE_TABS.map(function(t) {
                const active = t.key === "profile";
                return (
                  <div key={t.key} onClick={function() { if (t.href) router.push(t.href); }}
                    style={{ paddingBottom: 10, fontSize: 14, cursor: "pointer", color: active ? GOLD : "#cfd3da", borderBottom: active ? "2px solid " + GOLD : "2px solid transparent", fontWeight: active ? 600 : 400, display: "flex", alignItems: "center", gap: 7, whiteSpace: "nowrap" }}>
                    <t.icon size={15} />{t.label}
                  </div>
                );
              })}
            </div>

            {/* Profile Info */}
            <div style={{ marginBottom: 20 }}>
              <Card>
                <CardHeader title="Profile Information" desc="Manage your personal details and professional information." />
                <div style={{ display: "flex", gap: 22 }}>
                  <div style={{ textAlign: "center", flexShrink: 0 }}>
                    <img src={avatarSrc} alt="Profile" style={{ width: 96, height: 96, borderRadius: "50%", objectFit: "cover", border: "2px solid " + GOLD, marginBottom: 10 }} />
                    <label htmlFor="profile-photo-input" style={{ background: "transparent", border: "1px solid " + GOLD, color: GOLD, borderRadius: 6, padding: "8px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, margin: "0 auto" }}>
                      <Camera size={13} />Change Photo
                    </label>
                    <input id="profile-photo-input" type="file" accept="image/jpeg,image/png,image/gif" style={{ display: "none" }} onChange={function(e) { handlePhotoChange(e); }} />
                    <div style={{ fontSize: 10, color: TEXT_MUTED, marginTop: 6 }}>JPG, PNG or GIF. Max 5MB</div>
                  </div>
                  <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 18px" }}>
                    <Field label="First Name"><input style={editMode ? inputStyle : readOnlyInputStyle} value={firstName} onChange={function(e) { setFirstName(e.target.value); }} readOnly={!editMode} /></Field>
                    <Field label="Last Name"><input style={editMode ? inputStyle : readOnlyInputStyle} value={lastName} onChange={function(e) { setLastName(e.target.value); }} readOnly={!editMode} /></Field>
                    <Field label="Display Name"><input style={editMode ? inputStyle : readOnlyInputStyle} value={displayName} onChange={function(e) { setDisplayName(e.target.value); }} readOnly={!editMode} /></Field>
                    <Field label="Designation"><input style={readOnlyInputStyle} value={designation} readOnly /></Field>
                    <Field label="Email Address" badge={{ text: "Verified", color: GREEN }}><input style={editMode ? inputStyle : readOnlyInputStyle} value={email} onChange={function(e) { setEmail(e.target.value); }} readOnly={!editMode} /></Field>
                    <Field label="Department"><input style={readOnlyInputStyle} value={department} readOnly /></Field>
                    <Field label="Mobile Number" badge={{ text: "Verified", color: GREEN }}><input style={editMode ? inputStyle : readOnlyInputStyle} value={mobile} onChange={function(e) { setMobile(e.target.value); }} readOnly={!editMode} /></Field>
                    <Field label="Date of Birth">
                      <div style={{ position: "relative" }}>
                        <input style={{ ...(editMode ? inputStyle : readOnlyInputStyle), paddingRight: 34 }}
                          type={editMode ? "date" : "text"}
                          value={editMode ? dob : new Date(dob).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                          onChange={function(e) { setDob(e.target.value); }} readOnly={!editMode} />
                        {!editMode && <Calendar size={15} color={TEXT_MUTED} style={{ position: "absolute", right: 10, top: 12 }} />}
                      </div>
                    </Field>
                    <Field label="Employee ID"><input style={readOnlyInputStyle} value={employeeId} readOnly /></Field>
                    <Field label="Language">
                      <select style={editMode ? inputStyle : readOnlyInputStyle} value={language} onChange={function(e) { setLanguage(e.target.value); }} disabled={!editMode}>
                        <option>English</option><option>Hindi</option><option>Tamil</option>
                      </select>
                    </Field>
                  </div>
                </div>
              </Card>
            </div>

            {/* Professional Info */}
            <div style={{ marginBottom: 20 }}>
              <Card>
                <CardHeader title="Professional Information" desc="Office location, timezone and work details." />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 18px" }}>
                  <Field label="Office Location"><input style={readOnlyInputStyle} value={officeLocation} readOnly /></Field>
                  <Field label="Time Zone"><input style={readOnlyInputStyle} value={timezone} readOnly /></Field>
                </div>
              </Card>
            </div>

            {/* About Me */}
            <div style={{ marginBottom: 20 }}>
              <Card>
                <CardHeader title="About Me" desc="A short bio that appears on your public profile." />
                <textarea style={{ ...inputStyle, minHeight: 90, resize: "vertical", color: editMode ? "#fff" : "#cfd3da" }} value={bio} onChange={function(e) { setBio(e.target.value); }} readOnly={!editMode} />
              </Card>
            </div>

            {/* Social Links */}
            <div style={{ marginBottom: 20 }}>
              <Card>
                <CardHeader title="Social Links" desc="Add links to your professional social profiles." />
                {socialLinks.map(function(l) {
                  const Icon = SOCIAL_ICON_MAP[l.icon] || Globe;
                  return (
                    <div key={l.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                      <Icon size={16} color={GOLD} style={{ flexShrink: 0 }} />
                      <input style={{ ...(editMode ? inputStyle : readOnlyInputStyle), flex: 1 }} value={l.url} readOnly={!editMode}
                        onChange={function(e) { const val = e.target.value; setSocialLinks(function(links) { return links.map(function(x) { return x.id === l.id ? { ...x, url: val } : x; }); }); }} />
                      {editMode && <Trash2 size={16} color={RED} style={{ cursor: "pointer", flexShrink: 0 }} onClick={function() { removeSocialLink(l.id); }} />}
                    </div>
                  );
                })}
                {editMode && (
                  <button onClick={addSocialLink} style={{ background: "transparent", border: "1px dashed " + BORDER, color: TEXT_MUTED, borderRadius: 6, padding: "8px 14px", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 7, marginTop: 4 }}>
                    <Plus size={14} /> Add Social Link
                  </button>
                )}
              </Card>
            </div>
          </div>

          {/* RIGHT RAIL */}
          <div style={{ width: 280, minWidth: 280, display: "flex", flexDirection: "column", gap: 20 }}>
            <Card>
              <h3 style={{ fontFamily: BARLOW, fontWeight: 700, fontSize: 15, color: GOLD, margin: "0 0 14px" }}>PROFILE COMPLETION</h3>
              <CompletionRing percent={100} />
              <div style={{ fontSize: 13, color: TEXT_MUTED, textAlign: "center", marginTop: 10 }}>Your profile is complete</div>
            </Card>

            <RailCard title="ACCOUNT SUMMARY" color={GOLD}>
              {[
                { label: "Username",       value: "superadmin",   col: "#fff" },
                { label: "Account Status", value: "Active",       col: GREEN },
                { label: "Email Verified", value: "Yes",          col: GREEN },
                { label: "2FA Status",     value: "Enabled",      col: GREEN },
                { label: "Last Login",     value: lastLogin,      col: "#fff" },
                { label: "Member Since",   value: memberSince,    col: "#fff" },
              ].map(function(r) {
                return (
                  <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 13 }}>
                    <span style={{ color: "#cfd3da" }}>{r.label}</span>
                    <span style={{ color: r.col }}>{r.value}</span>
                  </div>
                );
              })}
            </RailCard>

            <RailCard title="MY STATISTICS" color={GOLD}>
              {[
                { label: "Logins This Month", value: "48" },
                { label: "Profile Updates",   value: "6" },
                { label: "Tickets Raised",    value: "3" },
                { label: "Tickets Resolved",  value: "3" },
                { label: "Reports Exported",  value: "12" },
              ].map(function(r) {
                return (
                  <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 13 }}>
                    <span style={{ color: "#cfd3da" }}>{r.label}</span>
                    <span style={{ color: "#fff" }}>{r.value}</span>
                  </div>
                );
              })}
            </RailCard>

            <RailCard title="QUICK ACTIONS" color={GOLD}>
              {[
                { icon: KeyRound, label: "Change Password",   action: function() { router.push("/admin/security-login"); } },
                { icon: Shield,   label: "Manage 2FA",        action: function() { router.push("/admin/security-login"); } },
                { icon: Activity, label: "View Login History",action: function() { router.push("/admin/audit"); } },
                { icon: Download, label: "Download My Data",  action: function() { alert("Your data export has been initiated. A download link will be sent to your email within 24 hours."); } },
              ].map(function(item) {
                const Icon = item.icon;
                return (
                  <div key={item.label} onClick={item.action}
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", cursor: "pointer", borderBottom: "1px solid " + BORDER, color: "#cfd3da" }}
                    onMouseEnter={function(e) { e.currentTarget.style.color = "#fff"; }}
                    onMouseLeave={function(e) { e.currentTarget.style.color = "#cfd3da"; }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
                      <Icon size={15} color={TEXT_MUTED} />{item.label}
                    </div>
                    <ChevronRight size={13} color={TEXT_MUTED} />
                  </div>
                );
              })}
              <div onClick={function() { if (confirm("Deactivate your account? You will be signed out and will need another admin to reactivate it.")) { alert("Account deactivation request submitted. A senior administrator will process it within 24 hours."); } }}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", cursor: "pointer", color: RED }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
                  <Zap size={15} color={RED} />Deactivate Account
                </div>
                <ChevronRight size={13} color={RED} />
              </div>
            </RailCard>
          </div>
        </div>
      </div>
    </div>
  );
}