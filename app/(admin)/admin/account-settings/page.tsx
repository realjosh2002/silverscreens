"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAdminProfile } from "@/components/AdminProfileContext";
import { supabase } from "@/lib/supabase";
import AdminTopnav from "@/components/layout/AdminTopnav";
import AdminSidebar from "@/components/layout/AdminSidebar";
import {
  ChevronRight, Save, User, Camera, Eye, EyeOff, KeyRound,
  RefreshCw, Shield, ShieldCheck, Monitor, Smartphone, Laptop,
  Tablet, MoreVertical, PenTool, Upload, Trash2, Download,
  FileSearch, Key, Zap, AlertOctagon, Clock, ScrollText,
  Settings as SettingsIcon, Bell, X, CheckCircle2,
} from "lucide-react";

const RED       = "#C8202A";
const GOLD      = "#D4A64A";
const GREEN     = "#22C55E";
const BLUE      = "#3B82F6";
const BG        = "#0D1117";
const BG2       = "#131720";
const BG3       = "#181E2A";
const BG4       = "#1C2338";
const BEBAS     = "'Bebas Neue', sans-serif";
const BARLOW    = "'Barlow Condensed', sans-serif";
const BORDER    = "#252C3A";
const TEXT_MUTED = "#8B93A3";

const inputStyle: React.CSSProperties = {
  width: "100%", background: BG3, border: `1px solid ${BORDER}`, borderRadius: 6,
  padding: "10px 12px", fontSize: 14, color: "#fff", fontFamily: BARLOW,
  outline: "none", boxSizing: "border-box",
};

const btnGold: React.CSSProperties = {
  width: "100%", background: "transparent", border: `1px solid ${GOLD}`, color: GOLD,
  borderRadius: 6, padding: "10px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer",
  display: "flex", alignItems: "center", justifyContent: "center", gap: 7, marginBottom: 8,
};

const btnBorder: React.CSSProperties = {
  width: "100%", background: "transparent", border: `1px solid ${BORDER}`, color: "#cfd3da",
  borderRadius: 6, padding: "10px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer",
  display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
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
    <div onClick={onClick} style={{ width: 42, height: 22, borderRadius: 11, background: on ? GOLD : "#3A4150", cursor: "pointer", position: "relative", transition: "background 0.15s", flexShrink: 0 }}>
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

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: BG2, border: `1px solid ${BORDER}`, borderRadius: 12, width: 460, maxWidth: "94vw", padding: 28, boxShadow: "0 20px 60px rgba(0,0,0,0.6)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h2 style={{ fontFamily: BEBAS, fontSize: 22, color: GOLD, margin: 0, letterSpacing: 1 }}>{title}</h2>
          <div onClick={onClose} style={{ cursor: "pointer", color: TEXT_MUTED }}><X size={18} /></div>
        </div>
        {children}
      </div>
    </div>
  );
}

function ConfirmModal({ title, message, confirmLabel = "Confirm", confirmColor = RED, onConfirm, onCancel }: {
  title: string; message: string; confirmLabel?: string; confirmColor?: string;
  onConfirm: () => void; onCancel: () => void;
}) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: BG2, border: `1px solid ${BORDER}`, borderRadius: 12, width: 420, maxWidth: "94vw", padding: 28 }}>
        <h2 style={{ fontFamily: BEBAS, fontSize: 20, color: GOLD, margin: "0 0 10px", letterSpacing: 1 }}>{title}</h2>
        <p style={{ fontSize: 14, color: "#cfd3da", lineHeight: 1.6, margin: "0 0 22px" }}>{message}</p>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onCancel} style={{ flex: 1, background: "transparent", border: `1px solid ${BORDER}`, color: "#cfd3da", borderRadius: 6, padding: "10px", fontSize: 14, cursor: "pointer" }}>Cancel</button>
          <button onClick={onConfirm} style={{ flex: 1, background: "transparent", border: `1px solid ${confirmColor}`, color: confirmColor, borderRadius: 6, padding: "10px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

function InfoToast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div style={{ position: "fixed", bottom: 28, right: 28, background: BG2, border: `1px solid ${GOLD}`, borderRadius: 10, padding: "14px 20px", color: "#F5F5F5", fontFamily: BARLOW, fontSize: 15, zIndex: 9999, maxWidth: 380, lineHeight: 1.5, boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
      {message}
    </div>
  );
}

const DEVICE_ICON_MAP: Record<string, React.ElementType> = {
  windows: Monitor, mac: Laptop, android: Smartphone, ios: Smartphone, tablet: Tablet,
};

export default function AccountSettingsPage() {
  const router = useRouter();
  const { refreshProfile, updateProfile: updateSharedProfile } = useAdminProfile();
  const [saved,            setSaved]            = useState(false);
  const [saving,           setSaving]           = useState(false);
  const [loading,          setLoading]          = useState(true);
  const [avatarSrc,        setAvatarSrc]        = useState("https://i.pravatar.cc/200?img=12");
  const [signatureSrc,     setSignatureSrc]     = useState<string | null>(null);
  const [backupCodesCount, setBackupCodesCount] = useState(8);
  const [saveError,        setSaveError]        = useState("");
  const [showUploadSig,    setShowUploadSig]    = useState(false);
  const [showDeviceDetail, setShowDeviceDetail] = useState<any>(null);
  const [showDownloadData, setShowDownloadData] = useState(false);
  const [showExportHistory,setShowExportHistory]= useState(false);
  const [firstName,        setFirstName]        = useState("Arun");
  const [lastName,         setLastName]         = useState("Kumar");
  const [displayName,      setDisplayName]      = useState("Arun Kumar");
  const [designation,      setDesignation]      = useState("Super Administrator");
  const [department,       setDepartment]       = useState("Administration");
  const [employeeId,       setEmployeeId]       = useState("SS-ADM-001");
  const [email,            setEmail]            = useState("admin@silverscreens.in");
  const [mobile,           setMobile]           = useState("+91 98765 43210");
  const [memberSince,      setMemberSince]      = useState("—");
  const [lastLogin,        setLastLogin]        = useState("—");
  const [theme,            setTheme]            = useState("Dark");
  const [language,         setLanguage]         = useState("English");
  const [timezone,         setTimezone]         = useState("(GMT+05:30) Asia/Kolkata");
  const [dateFormat,       setDateFormat]       = useState("24 Jun 2026");
  const [timeFormat,       setTimeFormat]       = useState("12 Hour (hh:mm AM/PM)");
  const [deviceMenuOpen,   setDeviceMenuOpen]   = useState<string | null>(null);
  const [infoToast,        setInfoToast]        = useState("");
  const [photoError,       setPhotoError]       = useState("");
  const [sigError,         setSigError]         = useState("");

  // Confirm modal state
  const [confirmModal, setConfirmModal] = useState<{
    title: string; message: string; confirmLabel?: string; confirmColor?: string; onConfirm: () => void;
  } | null>(null);

  function showConfirm(title: string, message: string, onConfirm: () => void, confirmLabel = "Confirm", confirmColor = RED) {
    setConfirmModal({ title, message, confirmLabel, confirmColor, onConfirm });
  }

  const [sessions, setSessions] = useState([
    { id: "s1", device: "Windows PC",    icon: "windows", browser: "Chrome 126",    location: "Chennai, India",   ip: "103.21.244.0",        lastActive: "Now",                 status: "This Device", current: true  },
    { id: "s2", device: "MacBook Pro",   icon: "mac",     browser: "Safari 17",     location: "Chennai, India",   ip: "103.21.244.0",        lastActive: "2 Hours Ago",         status: "Active",      current: false },
    { id: "s3", device: "Android Mobile",icon: "android", browser: "Chrome Mobile", location: "Bengaluru, India", ip: "2405:db00::8a2e:370", lastActive: "Yesterday 09:15 AM",  status: "Active",      current: false },
    { id: "s4", device: "iPhone 14",     icon: "ios",     browser: "Safari iOS",    location: "Mumbai, India",    ip: "117.211.45.33",       lastActive: "2 Days Ago 07:45 PM", status: "Active",      current: false },
  ]);

  const [devices, setDevices] = useState([
    { id: "d1", name: "Windows PC",     icon: "windows", os: "Windows 11 Pro",    browser: "Chrome 126", current: true  },
    { id: "d2", name: "iPhone 14",      icon: "ios",     os: "iOS 17.5",          browser: "Safari",     current: false },
    { id: "d3", name: "MacBook Pro",    icon: "mac",     os: "macOS Sonoma 14.5", browser: "Safari 17",  current: false },
    { id: "d4", name: "Android Tablet", icon: "android", os: "Android 14",        browser: "Chrome",     current: false },
  ]);

  const [notifPrefs, setNotifPrefs] = useState({ emailAlerts: true, securityAlerts: true, loginAlerts: true, maintenanceUpdates: true, weeklyReports: true });

  function toggleNotifPref(key: keyof typeof notifPrefs) {
    setNotifPrefs(function(p) { return { ...p, [key]: !p[key] }; });
  }

  function terminateSession(id: string) {
    showConfirm(
      "Terminate Session",
      "Terminate this session? The device will be signed out immediately.",
      () => setSessions(function(s) { return s.filter(function(sess) { return sess.id !== id; }); }),
      "Terminate"
    );
  }

  function terminateAllOthers() {
    showConfirm(
      "Terminate All Other Sessions",
      "Terminate all other sessions? Only this device will remain signed in.",
      () => setSessions(function(s) { return s.filter(function(sess) { return sess.current; }); }),
      "Terminate All"
    );
  }

  function removeDevice(id: string) {
    showConfirm(
      "Remove Device",
      "Remove this device? It will need to sign in again.",
      () => setDevices(function(d) { return d.filter(function(dev) { return dev.id !== id; }); }),
      "Remove"
    );
  }

  function removeAllDevices() {
    showConfirm(
      "Remove All Devices",
      "Remove all trusted devices except this one?",
      () => setDevices(function(d) { return d.filter(function(dev) { return dev.current; }); }),
      "Remove All"
    );
  }

  const loadProfile = useCallback(async function() {
    setLoading(true);
    try {
      const stored = localStorage.getItem("ss_user");
      if (!stored) { setLoading(false); return; }
      const parsed = JSON.parse(stored);
      const uid = parsed?.userId || parsed?.id || parsed?.user?.id;
      if (!uid) { setLoading(false); return; }
      const { data: sessData } = await supabase.auth.getSession();
      const freshToken = sessData?.session?.access_token;
      // ─── FIX: explicit type so TypeScript knows Authorization is always string ───
      const authHeaders: Record<string, string> = freshToken
        ? { Authorization: "Bearer " + freshToken }
        : {};
      const { createClient: cc } = await import("@supabase/supabase-js");
      const db = cc(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { global: { headers: authHeaders } });
      const { data, error } = await db.from("profiles").select("id, name, email, phone, profile_number, two_fa_enabled, created_at, last_login_at, avatar_url").eq("id", uid).single();
      if (error || !data) { setLoading(false); return; }
      const nameParts = (data.name || "").trim().split(" ");
      setFirstName(nameParts[0] || "Admin");
      setLastName(nameParts.slice(1).join(" ") || "");
      setDisplayName(data.name || nameParts[0]);
      setEmail(data.email || "");
      setMobile(data.phone || "");
      if (data.profile_number) setEmployeeId(data.profile_number);
      if (data.avatar_url) setAvatarSrc(data.avatar_url);
      if (data.created_at) setMemberSince(new Date(data.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }));
      if (data.last_login_at) setLastLogin(new Date(data.last_login_at).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }));
    } catch (e) { console.error("Profile load error:", e); }
    setLoading(false);
  }, []);

  useEffect(function() { loadProfile(); }, [loadProfile]);

  async function handleSave() {
    setSaving(true); setSaveError("");
    try {
      const stored = localStorage.getItem("ss_user");
      if (!stored) { setSaveError("Not logged in. Please refresh."); setSaving(false); return; }
      const parsed = JSON.parse(stored);
      const uid = parsed?.userId || parsed?.id || parsed?.user?.id;
      if (!uid) { setSaveError("Could not find your user ID. Please log out and back in."); setSaving(false); return; }
      const { data: sessData2 } = await supabase.auth.getSession();
      const freshToken2 = sessData2?.session?.access_token;
      // ─── FIX: explicit type ───────────────────────────────────────────────────
      const authHeaders2: Record<string, string> = freshToken2
        ? { Authorization: "Bearer " + freshToken2 }
        : {};
      const { createClient: cc2 } = await import("@supabase/supabase-js");
      const db2 = cc2(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { global: { headers: authHeaders2 } });
      const fullName = (firstName + " " + lastName).trim();
      setDisplayName(fullName);
      const updates: Record<string, any> = { name: fullName, email, phone: mobile, updated_at: new Date().toISOString() };
      if (avatarSrc.startsWith("data:")) {
        try {
          const res = await fetch(avatarSrc);
          const blob = await res.blob();
          const ext  = blob.type.includes("png") ? "png" : "jpg";
          const path = "avatars/" + uid + "." + ext;
          const { error: upErr } = await db2.storage.from("assets").upload(path, blob, { upsert: true, contentType: blob.type });
          if (!upErr) {
            const { data: urlData } = db2.storage.from("assets").getPublicUrl(path);
            if (urlData?.publicUrl) { const newUrl = urlData.publicUrl + "?t=" + Date.now(); updates.avatar_url = newUrl; setAvatarSrc(newUrl); }
          }
        } catch (photoErr) { console.error("Photo error:", photoErr); }
      }
      const { error } = await db2.from("profiles").update(updates).eq("id", uid);
      if (error) { setSaveError("Failed to save: " + error.message); setSaving(false); return; }
      setSaving(false); setSaved(true);
      updateSharedProfile({ firstName, lastName, name: fullName, email, phone: mobile, avatarUrl: updates.avatar_url || avatarSrc });
      setTimeout(function() { setSaved(false); }, 2200);
    } catch (err: any) { setSaveError("Unexpected error: " + err.message); setSaving(false); }
  }

  function handleCancel() {
    showConfirm(
      "Discard Changes",
      "Discard unsaved changes and reload from server?",
      () => loadProfile(),
      "Discard"
    );
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setPhotoError("File too large. Maximum size is 5MB."); return; }
    setPhotoError("");
    const reader = new FileReader();
    reader.onload = function(ev) { if (ev.target?.result) setAvatarSrc(ev.target.result as string); };
    reader.readAsDataURL(file);
  }

  function handleSigChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { setSigError("File too large. Maximum size is 2MB."); return; }
    setSigError("");
    const reader = new FileReader();
    reader.onload = function(ev) { if (ev.target?.result) { setSignatureSrc(ev.target.result as string); setShowUploadSig(false); } };
    reader.readAsDataURL(file);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", background: BG, fontFamily: BARLOW, color: "#E6E8EC" }}>
      <AdminTopnav />
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <AdminSidebar />
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px 40px" }}>

          {loading && (
            <div style={{ position: "fixed", inset: 0, background: "rgba(13,17,23,0.85)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
              <div style={{ width: 40, height: 40, border: `3px solid ${BORDER}`, borderTop: `3px solid ${GOLD}`, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
              <div style={{ fontFamily: BARLOW, fontSize: 15, color: TEXT_MUTED }}>Loading your profile...</div>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          <input id="photo-file-input" type="file" accept="image/jpeg,image/png,image/gif" style={{ display: "none" }} onChange={handlePhotoChange} />
          <input id="sig-file-input"   type="file" accept="image/png,image/jpeg"           style={{ display: "none" }} onChange={handleSigChange} />

          {/* Photo size error */}
          {photoError && (
            <div style={{ position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)", background: "rgba(200,32,42,0.15)", border: `1px solid ${RED}`, borderRadius: 8, padding: "12px 20px", color: RED, fontFamily: BARLOW, fontSize: 14, zIndex: 9999 }}>
              {photoError} <span onClick={() => setPhotoError("")} style={{ marginLeft: 12, cursor: "pointer" }}>✕</span>
            </div>
          )}

          {showUploadSig && (
            <Modal title="Upload Digital Signature" onClose={function() { setShowUploadSig(false); setSigError(""); }}>
              <div style={{ fontSize: 13, color: TEXT_MUTED, marginBottom: 18 }}>Upload your digital signature image. PNG or JPG only. Maximum 2MB.</div>
              {sigError && <div style={{ fontSize: 13, color: RED, marginBottom: 12 }}>{sigError}</div>}
              {signatureSrc && (
                <div style={{ background: "#fff", borderRadius: 8, padding: "14px 20px", marginBottom: 16, textAlign: "center" }}>
                  <img src={signatureSrc} alt="Signature" style={{ maxHeight: 80, maxWidth: "100%" }} />
                  <div style={{ fontSize: 11, color: "#888", marginTop: 6 }}>Current signature</div>
                </div>
              )}
              <label htmlFor="sig-file-input" style={{ ...btnGold, marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
                <Upload size={14} />
                {signatureSrc ? "Replace Signature" : "Choose Signature File"}
              </label>
              <button onClick={function() { setShowUploadSig(false); setSigError(""); }} style={btnBorder}>Cancel</button>
            </Modal>
          )}

          {showDeviceDetail && (
            <Modal title="Device Details" onClose={function() { setShowDeviceDetail(null); }}>
              {(function() {
                const Icon = DEVICE_ICON_MAP[showDeviceDetail.icon] || Monitor;
                return (
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20, padding: 14, background: BG3, borderRadius: 8 }}>
                      <Icon size={32} color={GOLD} />
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>{showDeviceDetail.name}</div>
                        {showDeviceDetail.current && <div style={{ fontSize: 12, color: GREEN }}>Current Device</div>}
                      </div>
                    </div>
                    {[
                      { label: "Operating System", value: showDeviceDetail.os },
                      { label: "Browser",           value: showDeviceDetail.browser },
                      { label: "Status",            value: showDeviceDetail.current ? "Active — Current Device" : "Trusted Device" },
                    ].map(function(row) {
                      return (
                        <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${BORDER}`, fontSize: 14 }}>
                          <span style={{ color: TEXT_MUTED }}>{row.label}</span>
                          <span style={{ color: "#fff", fontWeight: 600 }}>{row.value}</span>
                        </div>
                      );
                    })}
                    <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                      <button onClick={function() { setShowDeviceDetail(null); }} style={{ flex: 1, background: "transparent", border: `1px solid ${BORDER}`, color: "#cfd3da", borderRadius: 6, padding: "10px", fontSize: 14, cursor: "pointer" }}>Close</button>
                      {!showDeviceDetail.current && (
                        <button onClick={function() { setShowDeviceDetail(null); removeDevice(showDeviceDetail.id); }} style={{ flex: 1, background: "transparent", border: `1px solid ${RED}`, color: RED, borderRadius: 6, padding: "10px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Remove Device</button>
                      )}
                    </div>
                  </div>
                );
              })()}
            </Modal>
          )}

          {showDownloadData && (
            <Modal title="Download My Data" onClose={function() { setShowDownloadData(false); }}>
              <div style={{ fontSize: 13, color: TEXT_MUTED, marginBottom: 18 }}>Your account data export will include profile information, activity history, login history, and notification preferences.</div>
              <div style={{ background: BG3, borderRadius: 8, padding: 14, marginBottom: 18, fontSize: 13, color: "#cfd3da" }}>
                <div style={{ marginBottom: 6 }}><strong style={{ color: "#fff" }}>Export Format:</strong> JSON &amp; CSV</div>
                <div style={{ marginBottom: 6 }}><strong style={{ color: "#fff" }}>Sent To:</strong> {email}</div>
                <div><strong style={{ color: "#fff" }}>Processing Time:</strong> Up to 24 hours</div>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={function() { setShowDownloadData(false); }} style={{ flex: 1, background: "transparent", border: `1px solid ${BORDER}`, color: "#cfd3da", borderRadius: 6, padding: "10px", fontSize: 14, cursor: "pointer" }}>Cancel</button>
                <button onClick={function() { setShowDownloadData(false); setInfoToast("Your data export has been initiated. A download link will be sent to " + email + " within 24 hours."); }} style={{ flex: 1, background: GOLD, border: "none", color: BG, borderRadius: 6, padding: "10px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Request Export</button>
              </div>
            </Modal>
          )}

          {showExportHistory && (
            <Modal title="Export Login History" onClose={function() { setShowExportHistory(false); }}>
              <div style={{ fontSize: 13, color: TEXT_MUTED, marginBottom: 18 }}>Select the date range for your login history export.</div>
              <Field label="From Date"><input type="date" style={{ ...inputStyle, colorScheme: "dark" as any }} /></Field>
              <Field label="To Date"><input type="date" style={{ ...inputStyle, colorScheme: "dark" as any }} /></Field>
              <Field label="Format">
                <select style={inputStyle}><option>CSV</option><option>PDF</option></select>
              </Field>
              <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                <button onClick={function() { setShowExportHistory(false); }} style={{ flex: 1, background: "transparent", border: `1px solid ${BORDER}`, color: "#cfd3da", borderRadius: 6, padding: "10px", fontSize: 14, cursor: "pointer" }}>Cancel</button>
                <button onClick={function() { setShowExportHistory(false); setInfoToast("Login history export initiated. You will receive an email with the download link."); }} style={{ flex: 1, background: GOLD, border: "none", color: BG, borderRadius: 6, padding: "10px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Export</button>
              </div>
            </Modal>
          )}

          {/* Confirm Modal */}
          {confirmModal && (
            <ConfirmModal
              title={confirmModal.title}
              message={confirmModal.message}
              confirmLabel={confirmModal.confirmLabel}
              confirmColor={confirmModal.confirmColor}
              onConfirm={() => { confirmModal.onConfirm(); setConfirmModal(null); }}
              onCancel={() => setConfirmModal(null)}
            />
          )}

          {/* Info Toast */}
          {infoToast && <InfoToast message={infoToast} onClose={() => setInfoToast("")} />}

          {/* Page Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5, fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
                <span onClick={function() { router.push("/admin/dashboard"); }} style={{ cursor: "pointer" }}>Home</span>
                <ChevronRight size={12} />
                <span style={{ color: "rgba(255,255,255,0.7)" }}>Account Settings</span>
              </div>
              <h1 style={{ fontFamily: BEBAS, fontSize: 32, letterSpacing: 1, color: GOLD, margin: 0 }}>ACCOUNT SETTINGS</h1>
              <p style={{ fontSize: 14, color: TEXT_MUTED, margin: "4px 0 0" }}>Manage your personal profile, login credentials, security preferences and notification settings.</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
              {saveError && <div style={{ fontSize: 12, color: RED, maxWidth: 280, textAlign: "right" }}>{saveError}</div>}
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={handleCancel} style={{ background: "transparent", border: `1px solid ${BORDER}`, color: "#cfd3da", borderRadius: 6, padding: "10px 18px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
                <button onClick={handleSave} disabled={saving} style={{ background: saved ? GREEN : GOLD, color: BG, border: "none", borderRadius: 6, padding: "10px 18px", fontSize: 14, fontWeight: 700, cursor: saving ? "wait" : "pointer", display: "flex", alignItems: "center", gap: 8, opacity: saving ? 0.7 : 1 }}>
                  <Save size={15} />
                  {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
                </button>
              </div>
            </div>
          </div>

          {/* Main content + rail */}
          <div style={{ display: "flex", gap: 24 }}>
            <div style={{ flex: 1, minWidth: 0 }}>

              {/* Profile + Security */}
              <div style={{ display: "flex", gap: 20, marginBottom: 20, alignItems: "stretch" }}>
                <div style={{ flex: 1.6 }}>
                  <Card>
                    <CardHeader icon={User} title="Profile Information" />
                    <div style={{ display: "flex", gap: 22 }}>
                      <div style={{ textAlign: "center", flexShrink: 0 }}>
                        <img src={avatarSrc} alt="Profile" style={{ width: 96, height: 96, borderRadius: "50%", objectFit: "cover", border: `2px solid ${GOLD}`, marginBottom: 10 }} />
                        <label htmlFor="photo-file-input" style={{ background: "transparent", border: `1px solid ${GOLD}`, color: GOLD, borderRadius: 6, padding: "8px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, margin: "0 auto" }}>
                          <Camera size={13} />Change Photo
                        </label>
                        <div style={{ fontSize: 10, color: TEXT_MUTED, marginTop: 6 }}>JPG, PNG or GIF. Max 5MB</div>
                      </div>
                      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 18px" }}>
                        <Field label="First Name"><input style={inputStyle} value={firstName} onChange={function(e) { setFirstName(e.target.value); }} /></Field>
                        <Field label="Last Name"><input style={inputStyle} value={lastName} onChange={function(e) { setLastName(e.target.value); }} /></Field>
                        <Field label="Display Name"><input style={inputStyle} value={displayName} onChange={function(e) { setDisplayName(e.target.value); }} /></Field>
                        <Field label="Designation"><input style={inputStyle} value={designation} onChange={function(e) { setDesignation(e.target.value); }} /></Field>
                        <Field label="Department"><input style={inputStyle} value={department} onChange={function(e) { setDepartment(e.target.value); }} /></Field>
                        <Field label="Employee ID"><input style={{ ...inputStyle, color: TEXT_MUTED }} value={employeeId} readOnly /></Field>
                        <Field label="Email Address"><input style={inputStyle} value={email} onChange={function(e) { setEmail(e.target.value); }} /></Field>
                        <Field label="Mobile Number"><input style={inputStyle} value={mobile} onChange={function(e) { setMobile(e.target.value); }} /></Field>
                      </div>
                    </div>
                  </Card>
                </div>
                <div style={{ flex: 1 }}>
                  <Card>
                    <CardHeader icon={Shield} title="Security &amp; Login" />
                    <div style={{ fontSize: 13, color: TEXT_MUTED, marginBottom: 18, lineHeight: 1.7 }}>Password, two-factor authentication, trusted devices, login alerts and security settings are managed on the dedicated Security &amp; Login page.</div>
                    {[
                      { icon: KeyRound,    label: "Change Password",           sub: "Last changed 7 days ago" },
                      { icon: ShieldCheck, label: "Two-Factor Authentication", sub: "Enabled — Authentication App" },
                      { icon: Smartphone,  label: "Trusted Devices",           sub: sessions.length + " devices connected" },
                      { icon: RefreshCw,   label: "Backup Codes",              sub: backupCodesCount + " codes remaining" },
                    ].map(function(item) {
                      const Icon = item.icon;
                      return (
                        <div key={item.label} onClick={function() { router.push("/admin/security-login"); }}
                          style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0", borderBottom: `1px solid ${BORDER}`, cursor: "pointer" }}
                          onMouseEnter={function(e) { (e.currentTarget as HTMLDivElement).style.background = BG3; }}
                          onMouseLeave={function(e) { (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}>
                          <div style={{ width: 34, height: 34, borderRadius: "50%", background: GOLD + "18", border: "1px solid " + GOLD + "44", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <Icon size={15} color={GOLD} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 14, color: "#fff", fontWeight: 600 }}>{item.label}</div>
                            <div style={{ fontSize: 12, color: TEXT_MUTED, marginTop: 2 }}>{item.sub}</div>
                          </div>
                          <ChevronRight size={14} color={TEXT_MUTED} />
                        </div>
                      );
                    })}
                    <button onClick={function() { router.push("/admin/security-login"); }}
                      style={{ width: "100%", marginTop: 16, background: GOLD + "18", border: "1px solid " + GOLD, color: GOLD, borderRadius: 6, padding: "11px 14px", fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                      <Shield size={14} />Go to Security &amp; Login
                    </button>
                  </Card>
                </div>
              </div>

              {/* Preferences + Sessions */}
              <div style={{ display: "flex", gap: 20, marginBottom: 20, alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <Card>
                    <CardHeader icon={SettingsIcon} title="Personal Preferences" />
                    <Field label="Theme">
                      <select style={inputStyle} value={theme} onChange={function(e) { setTheme(e.target.value); }}>
                        <option>Dark</option><option>Light</option><option>System Default</option>
                      </select>
                    </Field>
                    <Field label="Language">
                      <select style={inputStyle} value={language} onChange={function(e) { setLanguage(e.target.value); }}>
                        <option>English</option><option>Hindi</option><option>Tamil</option>
                      </select>
                    </Field>
                    <Field label="Time Zone">
                      <select style={inputStyle} value={timezone} onChange={function(e) { setTimezone(e.target.value); }}>
                        <option>(GMT+05:30) Asia/Kolkata</option><option>(GMT+00:00) UTC</option><option>(GMT-05:00) America/New_York</option>
                      </select>
                    </Field>
                    <Field label="Date Format">
                      <select style={inputStyle} value={dateFormat} onChange={function(e) { setDateFormat(e.target.value); }}>
                        <option>24 Jun 2026</option><option>06/24/2026</option><option>2026-06-24</option>
                      </select>
                    </Field>
                    <Field label="Time Format">
                      <select style={inputStyle} value={timeFormat} onChange={function(e) { setTimeFormat(e.target.value); }}>
                        <option>12 Hour (hh:mm AM/PM)</option><option>24 Hour</option>
                      </select>
                    </Field>
                  </Card>
                </div>
                <div style={{ flex: 1.4 }}>
                  <Card>
                    <CardHeader icon={Monitor} title="Session Management" />
                    <div style={{ fontSize: 12, color: TEXT_MUTED, marginTop: -10, marginBottom: 14 }}>Manage your active sessions across devices.</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1.2fr 1fr 0.9fr 0.9fr", padding: "0 0 8px", borderBottom: `1px solid ${BORDER}` }}>
                      {["DEVICE", "BROWSER / APP", "LOCATION", "LAST ACTIVE", "STATUS", "ACTION"].map(function(h, i) {
                        return <div key={h} style={{ fontSize: 10, color: TEXT_MUTED, fontWeight: 600, textAlign: i === 5 ? "right" as const : "left" as const }}>{h}</div>;
                      })}
                    </div>
                    {sessions.map(function(s) {
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
                            <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 4, background: s.current ? `${BLUE}22` : `${GREEN}22`, color: s.current ? BLUE : GREEN }}>{s.status}</span>
                          </div>
                          <div style={{ textAlign: "right" as const }}>
                            {s.current ? <span style={{ fontSize: 12, color: TEXT_MUTED }}>—</span> : <span onClick={function() { terminateSession(s.id); }} style={{ fontSize: 12, color: RED, cursor: "pointer" }}>Terminate</span>}
                          </div>
                        </div>
                      );
                    })}
                    <button onClick={terminateAllOthers} style={{ width: "100%", marginTop: 16, background: "transparent", border: `1px solid ${RED}`, color: RED, borderRadius: 6, padding: "10px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
                      <AlertOctagon size={14} />Terminate All Other Sessions
                    </button>
                  </Card>
                  <div style={{ height: 20 }} />
                  <Card>
                    <CardHeader icon={PenTool} title="Digital Signature" />
                    <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
                      <div style={{ background: "#fff", borderRadius: 8, padding: "18px 24px", flexShrink: 0, minWidth: 140, textAlign: "center" as const }}>
                        {signatureSrc
                          ? <img src={signatureSrc} alt="Signature" style={{ maxHeight: 60, maxWidth: 120 }} />
                          : <span style={{ fontFamily: "cursive", fontSize: 26, color: "#222" }}>{firstName} {lastName}</span>
                        }
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, color: TEXT_MUTED, marginBottom: 10 }}>Upload your digital signature. Used for approvals, reports and certificates.</div>
                        <button onClick={function() { setShowUploadSig(true); }} style={{ background: "transparent", border: `1px solid ${GOLD}`, color: GOLD, borderRadius: 6, padding: "9px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 7 }}>
                          <Upload size={14} />Upload Signature
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
                  {devices.map(function(d) {
                    const Icon = DEVICE_ICON_MAP[d.icon] || Monitor;
                    return (
                      <div key={d.id} style={{ border: `1px solid ${BORDER}`, borderRadius: 8, padding: 14, position: "relative" }}>
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 }}>
                          <Icon size={20} color={GOLD} />
                          <MoreVertical size={15} color={TEXT_MUTED} style={{ cursor: "pointer" }} onClick={function() { setDeviceMenuOpen(deviceMenuOpen === d.id ? null : d.id); }} />
                          {deviceMenuOpen === d.id && (
                            <div style={{ position: "absolute", right: 8, top: 36, background: BG3, border: `1px solid ${BORDER}`, borderRadius: 6, width: 140, zIndex: 10, boxShadow: "0 8px 20px rgba(0,0,0,0.4)" }}>
                              <div onClick={function() { setDeviceMenuOpen(null); setShowDeviceDetail(d); }} style={{ padding: "9px 12px", fontSize: 12, color: "#cfd3da", cursor: "pointer" }}
                                onMouseEnter={function(e) { e.currentTarget.style.background = BG4; }}
                                onMouseLeave={function(e) { e.currentTarget.style.background = "transparent"; }}>View Details</div>
                              {!d.current && (
                                <div onClick={function() { setDeviceMenuOpen(null); removeDevice(d.id); }} style={{ padding: "9px 12px", fontSize: 12, color: RED, cursor: "pointer" }}
                                  onMouseEnter={function(e) { e.currentTarget.style.background = BG4; }}
                                  onMouseLeave={function(e) { e.currentTarget.style.background = "transparent"; }}>Remove Device</div>
                              )}
                            </div>
                          )}
                        </div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{d.name}</div>
                        {d.current && (
                          <div style={{ fontSize: 11, color: GREEN, display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                            <CheckCircle2 size={11} />Current Device
                          </div>
                        )}
                        <div style={{ fontSize: 12, color: TEXT_MUTED, marginTop: 6 }}>{d.os}</div>
                        <div style={{ fontSize: 12, color: TEXT_MUTED }}>{d.browser}</div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ textAlign: "center" as const }}>
                  <button onClick={removeAllDevices} style={{ background: "transparent", border: `1px solid ${RED}`, color: RED, borderRadius: 6, padding: "10px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 7 }}>
                    <Trash2 size={14} />Remove All Devices
                  </button>
                </div>
              </Card>

            </div>

            {/* Right Rail */}
            <div style={{ width: 300, minWidth: 300, display: "flex", flexDirection: "column", gap: 20 }}>

              <RailCard title="ACCOUNT SUMMARY" color={GOLD}>
                <div style={{ fontSize: 12, color: TEXT_MUTED, marginBottom: 6 }}>Profile Completion</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <div style={{ flex: 1, height: 7, background: BG4, borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ width: "100%", height: "100%", background: GREEN }} />
                  </div>
                  <span style={{ fontSize: 12, color: GREEN, fontWeight: 700 }}>100%</span>
                </div>
                {[
                  { label: "Last Login",   value: lastLogin },
                  { label: "Role",         value: designation },
                  { label: "Employee ID",  value: employeeId },
                  { label: "Member Since", value: memberSince },
                ].map(function(r) {
                  return (
                    <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 13 }}>
                      <span style={{ color: "#cfd3da" }}>{r.label}</span>
                      <span style={{ color: "#fff" }}>{r.value}</span>
                    </div>
                  );
                })}
                <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 13 }}>
                  <span style={{ color: "#cfd3da" }}>Status</span>
                  <span style={{ color: GREEN, display: "flex", alignItems: "center", gap: 5 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: GREEN }} />Active
                  </span>
                </div>
              </RailCard>

              <RailCard title="SECURITY STATUS" color={GOLD}>
                {[
                  { label: "Password Updated",          value: "7 Days Ago",                          color: TEXT_MUTED },
                  { label: "Two-Factor Authentication", value: "Enabled",                             color: GREEN      },
                  { label: "Recovery Codes",            value: backupCodesCount + " Available",       color: TEXT_MUTED },
                  { label: "Trusted Devices",           value: devices.length + " Devices",           color: TEXT_MUTED },
                ].map(function(r) {
                  return (
                    <div key={r.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#cfd3da" }}>
                        <CheckCircle2 size={14} color={GREEN} />
                        {r.label}
                      </div>
                      <span style={{ fontSize: 12, color: r.color }}>{r.value}</span>
                    </div>
                  );
                })}
              </RailCard>

              <RailCard title="RECENT LOGIN HISTORY" color={GOLD}>
                {[
                  { when: lastLogin !== "—" ? lastLogin : "Today", browser: "Chrome on Windows", location: "Chennai, India"   },
                  { when: "Yesterday, 09:15 AM",                   browser: "Edge on Windows",   location: "Chennai, India"   },
                  { when: "2 Days Ago, 07:45 PM",                  browser: "Android Mobile",    location: "Bengaluru, India" },
                ].map(function(h, i) {
                  return (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "9px 0", borderBottom: `1px solid ${BORDER}` }}>
                      <Clock size={14} color={TEXT_MUTED} style={{ marginTop: 2 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, color: "#fff" }}>{h.when}</div>
                        <div style={{ fontSize: 11, color: TEXT_MUTED }}>{h.browser}</div>
                      </div>
                      <div style={{ fontSize: 11, color: TEXT_MUTED, textAlign: "right" as const }}>{h.location}</div>
                    </div>
                  );
                })}
                <div style={{ textAlign: "center" as const, marginTop: 10 }}>
                  <span onClick={function() { router.push("/admin/audit"); }} style={{ fontSize: 12, color: GOLD, cursor: "pointer" }}>View All Login History</span>
                </div>
              </RailCard>

              <RailCard title="NOTIFICATION PREFERENCES" color={GOLD}>
                {[
                  { key: "emailAlerts",        label: "Email Alerts"        },
                  { key: "securityAlerts",     label: "Security Alerts"     },
                  { key: "loginAlerts",        label: "Login Alerts"        },
                  { key: "maintenanceUpdates", label: "Maintenance Updates" },
                  { key: "weeklyReports",      label: "Weekly Reports"      },
                ].map(function(p) {
                  return (
                    <div key={p.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 0" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#cfd3da" }}>
                        <CheckCircle2 size={13} color={GREEN} />
                        {p.label}
                      </div>
                      <ToggleSwitch on={(notifPrefs as any)[p.key]} onClick={function() { toggleNotifPref(p.key as keyof typeof notifPrefs); }} />
                    </div>
                  );
                })}
              </RailCard>

              <RailCard title="QUICK ACTIONS" color={GOLD}>
                {[
                  { icon: Download,   label: "Download My Data",     action: function() { setShowDownloadData(true); }    },
                  { icon: FileSearch, label: "Export Login History",  action: function() { setShowExportHistory(true); }   },
                  { icon: ScrollText, label: "View Audit Logs",       action: function() { router.push("/admin/audit"); }  },
                  { icon: Key,        label: "Manage API Tokens",     action: function() { router.push("/admin/settings"); }},
                  { icon: Bell,       label: "Notification Settings", action: function() { router.push("/admin/notifications"); }},
                ].map(function(item) {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} onClick={item.action}
                      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", cursor: "pointer", borderBottom: `1px solid ${BORDER}`, color: "#cfd3da" }}
                      onMouseEnter={function(e) { e.currentTarget.style.color = "#fff"; }}
                      onMouseLeave={function(e) { e.currentTarget.style.color = "#cfd3da"; }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
                        <Icon size={15} color={TEXT_MUTED} />
                        {item.label}
                      </div>
                      <ChevronRight size={13} color={TEXT_MUTED} />
                    </div>
                  );
                })}
                <div onClick={function() {
                  showConfirm(
                    "Deactivate Account",
                    "Deactivate your account? You will be signed out and will need another admin to reactivate it.",
                    () => setInfoToast("Account deactivation request submitted. A senior administrator will process it within 24 hours."),
                    "Deactivate",
                    RED
                  );
                }}
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
    </div>
  );
}