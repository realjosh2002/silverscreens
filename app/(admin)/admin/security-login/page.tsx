"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AdminTopnav from "@/components/layout/AdminTopnav";
import AdminSidebar from "@/components/layout/AdminSidebar";
import {
  ChevronRight, Save, Eye, EyeOff, KeyRound, RefreshCw,
  Shield, ShieldCheck, ShieldOff, ShieldAlert,
  Monitor, Smartphone, Laptop, Tablet, Trash2,
  Download, FileSearch, Mail, Headphones, Info,
  Activity, History, CheckCircle2, Lock, Bell,
} from "lucide-react";

const RED        = "#C8202A";
const GOLD       = "#D4A64A";
const GREEN      = "#22C55E";
const BLUE       = "#3B82F6";
const BG         = "#0D1117";
const BG2        = "#131720";
const BG3        = "#181E2A";
const BG4        = "#1C2338";
const BEBAS      = "'Bebas Neue', sans-serif";
const BARLOW     = "'Barlow Condensed', sans-serif";
const BORDER     = "#252C3A";
const TEXT_MUTED = "#8B93A3";

const inp: React.CSSProperties = {
  width: "100%", background: BG3, border: "1px solid #252C3A",
  borderRadius: 6, padding: "10px 12px", fontSize: 14, color: "#fff",
  fontFamily: "'Barlow Condensed', sans-serif", outline: "none", boxSizing: "border-box",
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
      <Icon size={17} color="#D4A64A" />
      <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 17, color: "#D4A64A", margin: 0 }}>{title}</h2>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: "#131720", border: "1px solid #252C3A", borderRadius: 10, padding: 20 }}>
      {children}
    </div>
  );
}

function RailCard({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "#131720", border: "1px solid #252C3A", borderRadius: 10, padding: 18 }}>
      <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 15, color, margin: "0 0 14px" }}>{title}</h3>
      {children}
    </div>
  );
}

function ReqRow({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "4px 0", fontSize: 12, color: ok ? "#cfd3da" : "#8B93A3" }}>
      <CheckCircle2 size={13} color={ok ? "#22C55E" : "#8B93A3"} />
      {label}
    </div>
  );
}

const DEVICE_ICONS: Record<string, React.ElementType> = {
  windows: Monitor, mac: Laptop, android: Smartphone, ios: Smartphone, tablet: Tablet,
};

function SecurityRing({ percent }: { percent: number }) {
  const size = 150, stroke = 12;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  return (
    <div style={{ position: "relative", width: size, height: size, margin: "0 auto" }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="#1C2338" strokeWidth={stroke} fill="none" />
        <circle cx={size / 2} cy={size / 2} r={r} stroke="#22C55E" strokeWidth={stroke} fill="none"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontSize: 30, fontWeight: 700, color: "#fff" }}>{percent}%</div>
        <div style={{ fontSize: 12, color: "#22C55E", fontWeight: 600 }}>Excellent</div>
      </div>
    </div>
  );
}

export default function SecurityLoginPage() {
  const router = useRouter();

  const [saved,           setSaved]           = useState(false);
  const [toast,           setToast]           = useState<{ msg: string; type: "success" | "error" | "info" } | null>(null);
  const [confirmModal,    setConfirmModal]    = useState<{ msg: string; onConfirm: () => void } | null>(null);
  const [currentPwd,      setCurrentPwd]      = useState("");
  const [newPwd,          setNewPwd]          = useState("");
  const [confirmPwd,      setConfirmPwd]      = useState("");
  const [showNewPwd,      setShowNewPwd]      = useState(false);
  const [showConfirmPwd,  setShowConfirmPwd]  = useState(false);
  const [mfaEnabled,      setMfaEnabled]      = useState(true);
  const [backupCodes,     setBackupCodes]     = useState(8);
  const [loginAlerts,     setLoginAlerts]     = useState(true);
  const [secEmail,        setSecEmail]        = useState("admin@silverscreens.in");
  const [emailModal,      setEmailModal]      = useState(false);
  const [newEmailVal,     setNewEmailVal]     = useState("");
  const [devices,         setDevices]         = useState([
    { id: "d1", device: "Windows PC",     icon: "windows", browser: "Chrome 126",    location: "Chennai, India",   ip: "103.21.244.0",        lastActive: "Now",         current: true  },
    { id: "d2", device: "MacBook Pro",    icon: "mac",     browser: "Safari 17",     location: "Chennai, India",   ip: "103.21.244.0",        lastActive: "2 Hours Ago", current: false },
    { id: "d3", device: "iPhone 14",      icon: "ios",     browser: "Safari iOS",    location: "Mumbai, India",    ip: "117.211.45.33",       lastActive: "2 Days Ago",  current: false },
    { id: "d4", device: "Android Mobile", icon: "android", browser: "Chrome Mobile", location: "Bengaluru, India", ip: "2405:db00::8a26:370", lastActive: "Yesterday",   current: false },
  ]);

  const pwdChecks = {
    minLength: newPwd.length >= 8,
    upper:     /[A-Z]/.test(newPwd),
    lower:     /[a-z]/.test(newPwd),
    number:    /[0-9]/.test(newPwd),
    special:   /[^A-Za-z0-9]/.test(newPwd),
    match:     newPwd.length > 0 && newPwd === confirmPwd,
  };

  function showToast(msg: string, type: "success" | "error" | "info" = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }

  function showConfirm(msg: string, onConfirm: () => void) {
    setConfirmModal({ msg, onConfirm });
  }

  async function handleUpdatePassword() {
    if (!currentPwd || !newPwd || !confirmPwd) { showToast("Please fill in all password fields.", "error"); return; }
    if (!Object.values(pwdChecks).every(Boolean)) { showToast("Password does not meet all requirements.", "error"); return; }
    try {
      const raw = localStorage.getItem("ss_user");
      const token = raw ? JSON.parse(raw).token : "";
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify({ currentPassword: currentPwd, newPassword: newPwd }),
      });
      const data = await res.json();
      if (res.ok) { showToast("Password updated successfully.", "success"); setCurrentPwd(""); setNewPwd(""); setConfirmPwd(""); }
      else { showToast(data?.error || "Failed to update password.", "error"); }
    } catch { showToast("Network error. Please try again.", "error"); }
  }

  function handleDisableMfa() {
    showConfirm("Disable multi-factor authentication? This will make your account less secure.", () => { setMfaEnabled(false); showToast("MFA disabled.", "info"); });
  }

  function handleRegenerateCodes() {
    showConfirm("Regenerate backup codes? This will invalidate all existing codes.", () => { setBackupCodes(10); showToast("New backup codes generated.", "success"); });
  }

  function removeDevice(id: string) {
    showConfirm("Remove this trusted device? It will need to verify again on next login.", () => { setDevices(d => d.filter(dev => dev.id !== id)); showToast("Device removed.", "success"); });
  }

  function removeAllOtherDevices() {
    showConfirm("Remove all other trusted devices except this one?", () => { setDevices(d => d.filter(dev => dev.current)); showToast("All other devices removed.", "success"); });
  }

  function confirmChangeEmail() {
    if (!newEmailVal.trim() || !newEmailVal.includes("@")) { showToast("Please enter a valid email address.", "error"); return; }
    setSecEmail(newEmailVal.trim()); setEmailModal(false); showToast("Security email updated. Please verify the new address.", "success");
  }

  function toggleLoginAlerts() {
    setLoginAlerts(prev => { showToast(!prev ? "Login alerts enabled." : "Login alerts disabled.", !prev ? "success" : "info"); return !prev; });
  }

  function handleSave() { setSaved(true); showToast("Security settings saved.", "success"); setTimeout(() => setSaved(false), 2200); }

  const loginActivity = [
    { id: 1, label: "Current Session",      browser: "Chrome on Windows", location: "Chennai, India",   status: "active-now" },
    { id: 2, label: "Today, 10:22 AM",       browser: "Chrome on Windows", location: "Chennai, India",   status: "success"    },
    { id: 3, label: "Today, 09:45 AM",       browser: "Edge on Windows",   location: "Chennai, India",   status: "success"    },
    { id: 4, label: "Yesterday, 07:58 AM",   browser: "Chrome on Android", location: "Bengaluru, India", status: "success"    },
    { id: 5, label: "24 May 2026, 08:15 AM", browser: "Safari on iPhone",  location: "Mumbai, India",    status: "failed"     },
  ];

  const checklist = [
    { label: "Strong Password",           ok: true,        note: "Enforced",                           nc: TEXT_MUTED },
    { label: "Two-Factor Authentication", ok: mfaEnabled,  note: mfaEnabled ? "Enabled" : "Disabled", nc: mfaEnabled ? GREEN : RED },
    { label: "Recovery Codes",            ok: true,        note: "Available",                          nc: TEXT_MUTED },
    { label: "Trusted Devices",           ok: true,        note: devices.length + " Devices",          nc: TEXT_MUTED },
    { label: "Login Alerts",              ok: loginAlerts, note: loginAlerts ? "Enabled" : "Disabled", nc: loginAlerts ? GREEN : RED },
    { label: "Account Monitoring",        ok: true,        note: "Active",                             nc: TEXT_MUTED },
  ];

  const quickActions = [
    { label: "View Login History",        icon: History,    fn: () => router.push("/admin/activity-log") },
    { label: "Download Account Activity", icon: Download,   fn: () => showToast("Export coming soon.", "info") },
    { label: "Manage Recovery Codes",     icon: FileSearch, fn: handleRegenerateCodes },
    { label: loginAlerts ? "Disable Login Alerts" : "Enable Login Alerts", icon: Bell, fn: toggleLoginAlerts },
  ];

  const toastColor = toast ? (toast.type === "success" ? GREEN : toast.type === "error" ? "#EF4444" : BLUE) : GREEN;
  const toastBg    = toast ? (toast.type === "success" ? "rgba(34,197,94,0.15)" : toast.type === "error" ? "rgba(239,68,68,0.15)" : "rgba(59,130,246,0.15)") : "";

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", background: BG, fontFamily: BARLOW, color: "#E6E8EC" }}>
      <AdminTopnav />
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <AdminSidebar />
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5, fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
                <span onClick={() => router.push("/admin/dashboard")} style={{ cursor: "pointer" }}>Home</span>
                <ChevronRight size={12} />
                <span style={{ color: "rgba(255,255,255,0.7)" }}>Security &amp; Login</span>
              </div>
              <h1 style={{ fontFamily: BEBAS, fontSize: 32, letterSpacing: 1, color: GOLD, margin: 0 }}>SECURITY &amp; LOGIN</h1>
              <p style={{ fontSize: 14, color: TEXT_MUTED, margin: "4px 0 0" }}>Manage your password, authentication methods and login security.</p>
            </div>
            <button onClick={handleSave} style={{ background: GOLD, color: BG, border: "none", borderRadius: 6, padding: "10px 18px", fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
              <Save size={15} />
              {saved ? "Saved!" : "Save Changes"}
            </button>
          </div>
          <div style={{ display: "flex", gap: 20 }}>
            <div style={{ flex: 1.4, minWidth: 0, display: "flex", flexDirection: "column", gap: 20 }}>
              <Card>
                <CardHeader icon={KeyRound} title="Change Password" />
                <div style={{ fontSize: 12, color: TEXT_MUTED, marginBottom: 16 }}>Regularly update your password to keep your account secure.</div>
                <div style={{ display: "flex", gap: 20 }}>
                  <div style={{ flex: 1.3 }}>
                    <Field label="Current Password">
                      <input style={inp} type="password" value={currentPwd} onChange={e => setCurrentPwd(e.target.value)} />
                    </Field>
                    <Field label="New Password">
                      <div style={{ position: "relative" }}>
                        <input style={{ ...inp, paddingRight: 38 }} type={showNewPwd ? "text" : "password"} value={newPwd} onChange={e => setNewPwd(e.target.value)} />
                        <div onClick={() => setShowNewPwd(p => !p)} style={{ position: "absolute", right: 10, top: 11, cursor: "pointer", color: TEXT_MUTED }}>
                          {showNewPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                        </div>
                      </div>
                    </Field>
                    <Field label="Confirm New Password">
                      <div style={{ position: "relative" }}>
                        <input style={{ ...inp, paddingRight: 38 }} type={showConfirmPwd ? "text" : "password"} value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)} />
                        <div onClick={() => setShowConfirmPwd(p => !p)} style={{ position: "absolute", right: 10, top: 11, cursor: "pointer", color: TEXT_MUTED }}>
                          {showConfirmPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                        </div>
                      </div>
                    </Field>
                    <button onClick={handleUpdatePassword} style={{ width: "100%", background: GOLD, color: BG, border: "none", borderRadius: 6, padding: "11px 14px", fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                      <Lock size={14} /> Update Password
                    </button>
                  </div>
                  <div style={{ flex: 1, border: "1px solid #252C3A", borderRadius: 8, padding: 14, alignSelf: "flex-start" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: GOLD, marginBottom: 8 }}>Password Requirements</div>
                    <ReqRow ok={pwdChecks.minLength} label="Minimum 8 characters" />
                    <ReqRow ok={pwdChecks.upper}     label="At least one uppercase letter" />
                    <ReqRow ok={pwdChecks.lower}     label="At least one lowercase letter" />
                    <ReqRow ok={pwdChecks.number}    label="At least one number" />
                    <ReqRow ok={pwdChecks.special}   label="At least one special character" />
                    <ReqRow ok={pwdChecks.match}     label="Passwords must match" />
                    <div style={{ fontSize: 11, color: TEXT_MUTED, marginTop: 10 }}>Last changed: 7 days ago</div>
                  </div>
                </div>
              </Card>
              <Card>
                <CardHeader icon={ShieldAlert} title="Multi-Factor Authentication (MFA)" />
                <div style={{ fontSize: 12, color: TEXT_MUTED, marginBottom: 16 }}>Add an extra layer of security to your account.</div>
                <div style={{ display: "flex", gap: 16 }}>
                  <div style={{ flex: 1, border: "1px solid " + (mfaEnabled ? GREEN : BORDER), borderRadius: 8, padding: 16, display: "flex", alignItems: "center", gap: 12 }}>
                    {mfaEnabled ? <ShieldCheck size={28} color={GREEN} /> : <ShieldOff size={28} color={TEXT_MUTED} />}
                    <div>
                      <div style={{ fontSize: 12, color: TEXT_MUTED }}>MFA Status</div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: mfaEnabled ? GREEN : TEXT_MUTED }}>{mfaEnabled ? "Enabled" : "Disabled"}</div>
                      <div style={{ fontSize: 11, color: TEXT_MUTED }}>{mfaEnabled ? "Your account is protected" : "Your account is at risk"}</div>
                    </div>
                  </div>
                  <div style={{ flex: 1, border: "1px solid #252C3A", borderRadius: 8, padding: 16 }}>
                    <div style={{ fontSize: 12, color: TEXT_MUTED, marginBottom: 8 }}>MFA Method</div>
                    <div style={{ fontSize: 13, color: "#fff", marginBottom: 4 }}>Authenticator App {mfaEnabled && "(Primary)"}</div>
                    <div style={{ fontSize: 11, color: TEXT_MUTED, marginBottom: 12 }}>Added on 24 May 2026, 10:15 AM</div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => showToast("MFA method change coming soon.", "info")} style={{ flex: 1, background: "transparent", border: "1px solid " + GOLD, color: GOLD, borderRadius: 6, padding: "9px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Change Method</button>
                      <button onClick={handleDisableMfa} disabled={!mfaEnabled} style={{ flex: 1, background: "transparent", border: "1px solid " + RED, color: RED, borderRadius: 6, padding: "9px 12px", fontSize: 12, fontWeight: 600, cursor: mfaEnabled ? "pointer" : "not-allowed", opacity: mfaEnabled ? 1 : 0.5, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                        <ShieldOff size={12} /> Disable MFA
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
              <Card>
                <CardHeader icon={RefreshCw} title="Backup Codes" />
                <div style={{ fontSize: 12, color: TEXT_MUTED, marginBottom: 16 }}>Use backup codes if you lose access to your authenticator app.</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: 12, color: TEXT_MUTED }}>Remaining Codes</div>
                    <div style={{ fontSize: 26, fontWeight: 700, color: "#fff" }}>{backupCodes}</div>
                    <div style={{ fontSize: 11, color: TEXT_MUTED }}>of 10 available · Generated on 24 May 2026</div>
                  </div>
                  <button onClick={handleRegenerateCodes} style={{ background: "transparent", border: "1px solid " + GOLD, color: GOLD, borderRadius: 6, padding: "10px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 7 }}>
                    <RefreshCw size={14} /> Regenerate Codes
                  </button>
                </div>
              </Card>
              <Card>
                <CardHeader icon={Shield} title="Trusted Devices" />
                <div style={{ fontSize: 12, color: TEXT_MUTED, marginBottom: 16 }}>These devices are trusted and can access your account.</div>
                <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1.3fr 1fr 0.8fr 0.8fr", padding: "0 0 8px", borderBottom: "1px solid #252C3A" }}>
                  {["DEVICE", "BROWSER", "LOCATION", "LAST ACTIVE", "STATUS", "ACTION"].map(h => (
                    <div key={h} style={{ fontSize: 10, color: TEXT_MUTED, fontWeight: 600 }}>{h}</div>
                  ))}
                </div>
                {devices.map(d => {
                  const DIcon = DEVICE_ICONS[d.icon] || Monitor;
                  return (
                    <div key={d.id} style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1.3fr 1fr 0.8fr 0.8fr", alignItems: "center", padding: "11px 0", borderBottom: "1px solid #252C3A" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <DIcon size={15} color={GOLD} />
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
                      <div><span style={{ fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 4, background: "rgba(34,197,94,0.13)", color: GREEN }}>Trusted</span></div>
                      <div style={{ textAlign: "right" }}>
                        {d.current ? <span style={{ fontSize: 12, color: TEXT_MUTED }}>—</span> : <span onClick={() => removeDevice(d.id)} style={{ fontSize: 12, color: RED, cursor: "pointer" }}>Remove</span>}
                      </div>
                    </div>
                  );
                })}
                <button onClick={removeAllOtherDevices} style={{ width: "100%", marginTop: 16, background: "transparent", border: "1px solid " + RED, color: RED, borderRadius: 6, padding: "10px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
                  <Trash2 size={14} /> Remove All Other Devices
                </button>
              </Card>
            </div>
            <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 20 }}>
              <Card>
                <CardHeader icon={History} title="Login Activity" />
                <div style={{ fontSize: 12, color: TEXT_MUTED, marginTop: -4, marginBottom: 14 }}>Monitor your recent login activity.</div>
                {loginActivity.map(a => (
                  <div key={a.id} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 0", borderBottom: "1px solid #252C3A" }}>
                    <Shield size={15} color={TEXT_MUTED} style={{ marginTop: 2 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, color: "#fff" }}>{a.label}</div>
                      <div style={{ fontSize: 11, color: TEXT_MUTED }}>{a.browser}</div>
                      <div style={{ fontSize: 11, color: TEXT_MUTED }}>{a.location}</div>
                    </div>
                    {a.status === "active-now"
                      ? <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 4, background: "rgba(34,197,94,0.13)", color: GREEN }}>Active Now</span>
                      : <div style={{ width: 8, height: 8, borderRadius: "50%", background: a.status === "failed" ? RED : GREEN, marginTop: 4 }} />
                    }
                  </div>
                ))}
                <div style={{ textAlign: "center", marginTop: 12 }}>
                  <span onClick={() => router.push("/admin/activity-log")} style={{ fontSize: 13, color: GOLD, cursor: "pointer" }}>View All Activity</span>
                </div>
              </Card>
              <Card>
                <CardHeader icon={Activity} title="Session Management" />
                <div style={{ fontSize: 12, color: TEXT_MUTED, marginTop: -4, marginBottom: 14 }}>Manage your active sessions across devices.</div>
                <div style={{ fontSize: 12, color: TEXT_MUTED, marginBottom: 4 }}>Current Active Sessions</div>
                <div style={{ fontSize: 26, fontWeight: 700, color: GREEN, marginBottom: 2 }}>
                  {devices.length} <span style={{ fontSize: 14, color: TEXT_MUTED, fontWeight: 400 }}>of 5 allowed</span>
                </div>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10, background: "rgba(59,130,246,0.1)", border: "1px solid #3B82F6", borderRadius: 8, padding: "10px 12px", fontSize: 12, color: "#9DC2FB", marginTop: 12 }}>
                  <Info size={14} color={BLUE} style={{ marginTop: 1, flexShrink: 0 }} />
                  You can have up to 5 active sessions across web and mobile.
                </div>
              </Card>
              <Card>
                <CardHeader icon={Mail} title="Security Email" />
                <div style={{ fontSize: 12, color: TEXT_MUTED, marginTop: -4, marginBottom: 14 }}>Security alerts and notifications will be sent to this email.</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <span style={{ fontSize: 14, color: "#fff", fontWeight: 600 }}>{secEmail}</span>
                  <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 4, background: "rgba(34,197,94,0.13)", color: GREEN }}>Verified</span>
                </div>
                <button onClick={() => { setNewEmailVal(secEmail); setEmailModal(true); }} style={{ width: "100%", background: "transparent", border: "1px solid " + GOLD, color: GOLD, borderRadius: 6, padding: "10px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                  Change Email
                </button>
              </Card>
            </div>
            <div style={{ width: 290, minWidth: 290, display: "flex", flexDirection: "column", gap: 20 }}>
              <RailCard title="SECURITY SCORE" color={GOLD}>
                <SecurityRing percent={92} />
                <div style={{ textAlign: "center", fontSize: 12, color: TEXT_MUTED, marginTop: 14 }}>Your account security is excellent. Keep up the good work!</div>
              </RailCard>
              <RailCard title="SECURITY CHECKLIST" color={GOLD}>
                {checklist.map(item => (
                  <div key={item.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 0" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#cfd3da" }}>
                      <CheckCircle2 size={14} color={item.ok ? GREEN : TEXT_MUTED} />
                      {item.label}
                    </div>
                    <span style={{ fontSize: 12, color: item.nc }}>{item.note}</span>
                  </div>
                ))}
              </RailCard>
              <RailCard title="NEED HELP?" color={GOLD}>
                <div style={{ fontSize: 12, color: TEXT_MUTED, lineHeight: 1.5, marginBottom: 14 }}>If you notice suspicious activity or need assistance, contact support immediately.</div>
                <button onClick={() => router.push("/admin/help-support")} style={{ width: "100%", background: "transparent", border: "1px solid " + GOLD, color: GOLD, borderRadius: 6, padding: "10px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
                  <Headphones size={14} /> Contact Support
                </button>
              </RailCard>
              <RailCard title="QUICK ACTIONS" color={GOLD}>
                {quickActions.map((item, i) => (
                  <div key={item.label} onClick={item.fn}
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", cursor: "pointer", borderBottom: i < quickActions.length - 1 ? "1px solid #252C3A" : "none", color: "#cfd3da" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#cfd3da")}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
                      <item.icon size={15} color={TEXT_MUTED} />
                      {item.label}
                    </div>
                    <ChevronRight size={13} color={TEXT_MUTED} />
                  </div>
                ))}
              </RailCard>
            </div>
          </div>
        </div>
      </div>

      {toast && (
        <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 999, padding: "12px 20px", borderRadius: 10, background: toastBg, border: "1px solid " + toastColor, color: toastColor, fontFamily: BARLOW, fontSize: 15, fontWeight: 600, boxShadow: "0 4px 24px rgba(0,0,0,0.4)" }}>
          {toast.type === "success" ? "✓" : toast.type === "error" ? "✗" : "ℹ"} {toast.msg}
        </div>
      )}

      {confirmModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 600, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: BG2, border: "1px solid #252C3A", borderRadius: 12, width: 420, padding: 24 }}>
            <div style={{ fontFamily: BEBAS, fontSize: 20, color: GOLD, letterSpacing: 1, marginBottom: 12 }}>CONFIRM ACTION</div>
            <div style={{ fontSize: 15, color: "#cfd3da", lineHeight: 1.6, marginBottom: 20 }}>{confirmModal.msg}</div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setConfirmModal(null)} style={{ flex: 1, padding: "10px", background: BG3, border: "1px solid #252C3A", borderRadius: 7, color: TEXT_MUTED, fontFamily: BARLOW, fontSize: 15, cursor: "pointer" }}>Cancel</button>
              <button onClick={() => { confirmModal.onConfirm(); setConfirmModal(null); }} style={{ flex: 2, padding: "10px", background: RED, border: "none", borderRadius: 7, color: "#fff", fontFamily: BEBAS, fontSize: 18, letterSpacing: 1, cursor: "pointer" }}>Confirm</button>
            </div>
          </div>
        </div>
      )}

      {emailModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 600, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: BG2, border: "1px solid #252C3A", borderRadius: 12, width: 420, padding: 24 }}>
            <div style={{ fontFamily: BEBAS, fontSize: 20, color: GOLD, letterSpacing: 1, marginBottom: 12 }}>CHANGE SECURITY EMAIL</div>
            <div style={{ fontSize: 14, color: TEXT_MUTED, marginBottom: 16, lineHeight: 1.6 }}>Security alerts will be sent to this address. You will need to verify the new email.</div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, color: TEXT_MUTED, marginBottom: 6 }}>New Email Address</label>
              <input value={newEmailVal} onChange={e => setNewEmailVal(e.target.value)} placeholder="admin@silverscreens.in" style={inp} />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setEmailModal(false)} style={{ flex: 1, padding: "10px", background: BG3, border: "1px solid #252C3A", borderRadius: 7, color: TEXT_MUTED, fontFamily: BARLOW, fontSize: 15, cursor: "pointer" }}>Cancel</button>
              <button onClick={confirmChangeEmail} style={{ flex: 2, padding: "10px", background: GOLD, border: "none", borderRadius: 7, color: BG, fontFamily: BEBAS, fontSize: 18, letterSpacing: 1, cursor: "pointer" }}>Update Email</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}