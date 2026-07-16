"use client";

import React, { useState } from "react";
import Link from "next/link";
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
  ShieldAlert,
  Flag,
  Lock,
  ScrollText,
  ChevronLeft,
  Menu,
  ChevronDown,
  Save,
  Globe,
  Plug,
  MoreHorizontal,
  Info,
  Database,
  RefreshCcw,
  HardDrive,
  Activity,
  Inbox,
  Trash2,
  RotateCcw,
  Eye,
  EyeOff,
  Send,
  ListChecks,
  FileBox,
  HelpCircle,
  BookOpen,
  MessageCircle,
  Smartphone,
  UserPlus,
  ShieldCheck,
  ClipboardList,
  Wallet,
  CalendarClock,
  FileSearch,
  Landmark,
  Percent,
  RefreshCw,
  TrendingUp,
  MoreVertical,
  Plus,
  Receipt,
  Banknote,
  ListOrdered,
  FileBarChart,
  Pencil,
  Shield,
  KeyRound,
  LogIn,
  Timer,
  MonitorSmartphone,
  ShieldX,
  ShieldBan,
  XCircle,
  Search,
  ChevronRight,
  Clock,
  PlayCircle,
  SlidersHorizontal,
  Languages as LanguagesIcon,
  Download,
  Upload,
  Map,
  Video,
  Cloud,
  Share2,
  Webhook,
  Key,
  Code2,
  Cpu,
  HardDriveDownload,
  FileWarning,
  Building,
  Hash,
  Ruler,
  Phone,
  CalendarDays,
  Link2,
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

// ---------- Nav config (mirrors completed admin pages) ----------
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
];

const PROFILE_MENU = [
  { label: "My Profile", href: "/admin/profile", built: true },
  { label: "Account Settings", href: "/admin/account-settings", built: true },
  { label: "Security & Login", href: "/admin/security-login", built: true },
  { label: "Activity Log", href: "/admin/activity-log", built: true },
  { label: "Help & Support", href: "/admin/help-support", built: true },
  { label: "Logout", href: "/login", built: true },
];

// ---------- Settings tab config ----------
const TABS = [
  { key: "general", label: "General", icon: SettingsIcon },
  { key: "email", label: "Email", icon: Mail },
  { key: "sms", label: "SMS / WhatsApp", icon: MessageSquare },
  { key: "payments", label: "Payments", icon: CreditCard },
  { key: "security", label: "Security", icon: Lock },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "localization", label: "Localization", icon: Globe },
  { key: "integrations", label: "Integrations", icon: Plug },
];

function go(router: ReturnType<typeof useRouter>, item: { href: string; built: boolean; label: string }) {
  if (item.built) {
    router.push(item.href);
  } else {
    alert(`"${item.label}" page is not built yet. (404)`);
  }
}

export default function AdminSettingsPage() {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifPanelOpen, setNotifPanelOpen] = useState(false);
  const [msgPanelOpen, setMsgPanelOpen] = useState(false);

  const topbarNotifications = [
    { id: 1, text: "New agency verification request submitted", time: "5 minutes ago", read: false },
    { id: 2, text: "Payment gateway Stripe was disconnected", time: "32 minutes ago", read: false },
    { id: 3, text: "Subscription plan renewed for Razorpay Studios", time: "1 hour ago", read: false },
    { id: 4, text: "Casting call \"Lead Actor - Mumbai\" flagged for review", time: "3 hours ago", read: true },
    { id: 5, text: "Weekly platform report is ready to download", time: "Yesterday", read: true },
  ];

  const topbarMessages = [
    { id: 1, sender: "Priya Sharma (Verifier)", text: "Can you review the pending talent docs?", time: "10 minutes ago", read: false },
    { id: 2, sender: "Arjun Mehta (Content Moderator)", text: "Flagged 3 casting calls for spam.", time: "1 hour ago", read: false },
    { id: 3, sender: "Support Team", text: "Ticket #2245 has been escalated to you.", time: "2 hours ago", read: true },
  ];
  const [activeTab, setActiveTab] = useState("general");
  const [saved, setSaved] = useState(false);

  // ---- General settings state ----
  const [platformName, setPlatformName] = useState("SilverScreens");
  const [tagline, setTagline] = useState("Where Talent Shines");
  const [supportEmail, setSupportEmail] = useState("support@silverscreens.com");
  const [supportPhone, setSupportPhone] = useState("+91 98765 43210");
  const [timezone, setTimezone] = useState("(GMT+05:30) Asia/Kolkata");
  const [dateFormat, setDateFormat] = useState("DD MMM YYYY (24 Jun 2026)");
  const [timeFormat, setTimeFormat] = useState("12 Hour (AM/PM)");
  const [itemsPerPage, setItemsPerPage] = useState("25");

  const [toggles, setToggles] = useState({
    newUserRegistration: true,
    emailVerification: true,
    mobileVerification: true,
    autoApproveTalents: false,
    autoApproveAgencies: false,
    maintenanceMode: false,
  });

  const toggle = (key: keyof typeof toggles) =>
    setToggles((t) => ({ ...t, [key]: !t[key] }));

  // ---- Email settings state ----
  const [smtpHost, setSmtpHost] = useState("smtp.sendgrid.net");
  const [smtpPort, setSmtpPort] = useState("587");
  const [encryption, setEncryption] = useState("TLS");
  const [smtpUsername, setSmtpUsername] = useState("apikey");
  const [smtpPassword, setSmtpPassword] = useState("SG.xxxxxxxxxxxxxxxxxxxxxxxx");
  const [showSmtpPassword, setShowSmtpPassword] = useState(false);
  const [fromEmail, setFromEmail] = useState("no-reply@silverscreens.com");
  const [replyToEmail, setReplyToEmail] = useState("support@silverscreens.com");
  const [replyToName, setReplyToName] = useState("SilverScreens Support");
  const [fromName, setFromName] = useState("SilverScreens");

  const [emailToggles, setEmailToggles] = useState({
    tlsEncryption: true,
    authentication: true,
    welcomeEmail: true,
    emailVerification: true,
    passwordReset: true,
    newApplicationAlerts: true,
    systemAlerts: true,
  });

  const toggleEmail = (key: keyof typeof emailToggles) =>
    setEmailToggles((t) => ({ ...t, [key]: !t[key] }));

  // ---- SMS / WhatsApp settings state ----
  const [smsProvider, setSmsProvider] = useState("Twilio");
  const [smsAccountSid, setSmsAccountSid] = useState("ACb********************1234");
  const [smsAuthToken, setSmsAuthToken] = useState("xxxxxxxxxxxxxxxxxxxxxxxxxxxx");
  const [showSmsAuthToken, setShowSmsAuthToken] = useState(false);
  const [smsFromNumber, setSmsFromNumber] = useState("+91 98765 43210");
  const [smsSendingLimit, setSmsSendingLimit] = useState("1,000 SMS / Day");

  const [waProvider, setWaProvider] = useState("360dialog");
  const [waAccessToken, setWaAccessToken] = useState("xxxxxxxxxxxxxxxxxxxxxxxxxxxx");
  const [showWaAccessToken, setShowWaAccessToken] = useState(false);
  const [waPhoneNumberId, setWaPhoneNumberId] = useState("123456789098765");
  const [waBusinessNumber, setWaBusinessNumber] = useState("+91 98765 43210");
  const [waSendingLimit, setWaSendingLimit] = useState("500 Messages / Day");

  const [preferredChannel, setPreferredChannel] = useState<"whatsapp" | "sms">("whatsapp");

  const [smsWaToggles, setSmsWaToggles] = useState({
    enableSms: true,
    enableWhatsApp: true,
    fallbackToSms: true,
    userRegSms: true,
    userRegWa: true,
    verificationSms: true,
    verificationWa: true,
    castingAppSms: true,
    castingAppWa: true,
    appStatusSms: true,
    appStatusWa: true,
    paymentSms: true,
    paymentWa: true,
    subExpirySms: true,
    subExpiryWa: true,
  });

  const toggleSmsWa = (key: keyof typeof smsWaToggles) =>
    setSmsWaToggles((t) => ({ ...t, [key]: !t[key] }));

  // ---- Payments settings state ----
  const [gateways, setGateways] = useState([
    { id: "razorpay", name: "Razorpay", desc: "Recommended for India", status: "Active", mode: "Live", fee: "2.00% + ₹2", icon: "razorpay" },
    { id: "stripe", name: "Stripe", desc: "International cards & wallets", status: "Active", mode: "Live", fee: "2.90% + $0.30", icon: "stripe" },
    { id: "paypal", name: "PayPal", desc: "Global payments", status: "Active", mode: "Live", fee: "3.49% + $0.49", icon: "paypal" },
    { id: "cashfree", name: "Cashfree", desc: "UPI, Cards, NetBanking, Wallets", status: "Inactive", mode: "Test", fee: "2.50% + ₹1", icon: "cashfree" },
    { id: "banktransfer", name: "Bank Transfer", desc: "Manual verification", status: "Active", mode: "Live", fee: "No Charges", icon: "bank" },
  ]);

  const toggleGatewayStatus = (id: string) =>
    setGateways((gs) => gs.map((g) => (g.id === id ? { ...g, status: g.status === "Active" ? "Inactive" : "Active" } : g)));

  const [currencies] = useState([
    { name: "Indian Rupee", symbol: "INR", countries: "India", status: "Active" },
    { name: "US Dollar", symbol: "USD", countries: "All Countries", status: "Active" },
    { name: "Euro", symbol: "EUR", countries: "EU Countries", status: "Active" },
  ]);

  const [taxes] = useState([
    { name: "GST", rate: "18%", applicableTo: "India", status: "Active" },
    { name: "IGST", rate: "18%", applicableTo: "International", status: "Active" },
    { name: "CGST", rate: "9%", applicableTo: "India", status: "Active" },
    { name: "SGST", rate: "9%", applicableTo: "India", status: "Active" },
  ]);

  const [refundPolicy, setRefundPolicy] = useState("Standard Refund Policy");
  const [disputeHandling, setDisputeHandling] = useState("Manual Review");
  const [autoRefund, setAutoRefund] = useState(false);

  // ---- Security settings state ----
  const [twoFaEnabled, setTwoFaEnabled] = useState(true);
  const [loginAttemptLimit, setLoginAttemptLimit] = useState("5 Attempts");
  const [lockoutDuration, setLockoutDuration] = useState("30 Minutes");
  const [activeSessionsPolicy, setActiveSessionsPolicy] = useState("1 Web + 1 Mobile");
  const [rememberDevice, setRememberDevice] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState("30 Minutes");

  const [passwordPolicy] = useState([
    { label: "Minimum Length", value: "8 Characters" },
    { label: "Require Uppercase", value: "Enabled" },
    { label: "Require Lowercase", value: "Enabled" },
    { label: "Require Numbers", value: "Enabled" },
    { label: "Require Special Chars", value: "Enabled" },
    { label: "Password Expiry", value: "90 Days" },
  ]);

  const [whitelistedIps] = useState(["103.21.244.0/24", "2405:204:8000::/48", "106.51.120.10"]);
  const [blockedIps] = useState(["45.77.12.0/24", "193.168.1.100"]);

  // ---- Notifications settings state ----
  const [channelToggles, setChannelToggles] = useState({
    inApp: true,
    email: true,
    sms: true,
    whatsapp: true,
  });
  const toggleChannel = (key: keyof typeof channelToggles) =>
    setChannelToggles((t) => ({ ...t, [key]: !t[key] }));

  const [moduleFilter, setModuleFilter] = useState("All Modules");
  const [eventSearch, setEventSearch] = useState("");

  const [notificationEvents, setNotificationEvents] = useState([
    { id: "user-reg", name: "User Registration", module: "User", desc: "When a new user registers on the platform.", inApp: true, email: true, sms: false, whatsapp: false },
    { id: "user-verify-approved", name: "User Verification Approved", module: "User", desc: "When a user's verification is approved.", inApp: true, email: true, sms: true, whatsapp: false },
    { id: "user-verify-rejected", name: "User Verification Rejected", module: "User", desc: "When a user's verification is rejected.", inApp: true, email: true, sms: true, whatsapp: true },
    { id: "casting-published", name: "Casting Call Published", module: "Casting", desc: "When a new casting call is published.", inApp: true, email: true, sms: false, whatsapp: false },
    { id: "app-submitted", name: "Application Submitted", module: "Application", desc: "When a user applies to a casting call.", inApp: true, email: true, sms: false, whatsapp: false },
    { id: "app-shortlisted", name: "Application Shortlisted", module: "Application", desc: "When a user is shortlisted for a casting call.", inApp: true, email: true, sms: true, whatsapp: true },
    { id: "payment-success", name: "Payment Successful", module: "Payment", desc: "When a payment is completed successfully.", inApp: true, email: true, sms: true, whatsapp: true },
    { id: "sub-expiring", name: "Subscription Expiring Soon", module: "Subscription", desc: "When a subscription is about to expire.", inApp: true, email: true, sms: true, whatsapp: true },
  ]);

  const toggleEventChannel = (id: string, channel: "inApp" | "email" | "sms" | "whatsapp") =>
    setNotificationEvents((evts) => evts.map((e) => (e.id === id ? { ...e, [channel]: !e[channel] } : e)));

  const [quietHoursEnabled, setQuietHoursEnabled] = useState(true);
  const [quietStart, setQuietStart] = useState("10:00 PM");
  const [quietEnd, setQuietEnd] = useState("08:00 AM");
  const [quietTimezone, setQuietTimezone] = useState("(GMT+05:30) Asia/Kolkata");

  // ---- Localization settings state ----
  const [localizationSubTab, setLocalizationSubTab] = useState("languages");

  const [languages, setLanguages] = useState([
    { id: "en", name: "English", native: "English", code: "en", direction: "LTR", status: "Active", isDefault: true },
    { id: "hi", name: "Hindi", native: "हिंदी", code: "hi", direction: "LTR", status: "Active", isDefault: false },
    { id: "ta", name: "Tamil", native: "தமிழ்", code: "ta", direction: "LTR", status: "Active", isDefault: false },
    { id: "te", name: "Telugu", native: "తెలుగు", code: "te", direction: "LTR", status: "Active", isDefault: false },
    { id: "bn", name: "Bengali", native: "বাংলা", code: "bn", direction: "LTR", status: "Inactive", isDefault: false },
  ]);

  const toggleLanguageStatus = (id: string) =>
    setLanguages((ls) => ls.map((l) => (l.id === id ? { ...l, status: l.status === "Active" ? "Inactive" : "Active" } : l)));

  const [defaultPlatformLanguage, setDefaultPlatformLanguage] = useState("English (en)");
  const [allowLanguageChange, setAllowLanguageChange] = useState(true);
  const [browserLangDetection, setBrowserLangDetection] = useState(true);

  // ---- Localization: Countries & Regions ----
  const [regions, setRegions] = useState([
    { id: "in", name: "India", code: "IN", region: "Asia Pacific", currency: "INR", status: "Active", primary: true },
    { id: "us", name: "United States", code: "US", region: "North America", currency: "USD", status: "Active", primary: false },
    { id: "gb", name: "United Kingdom", code: "GB", region: "Europe", currency: "GBP", status: "Active", primary: false },
    { id: "ae", name: "United Arab Emirates", code: "AE", region: "Middle East", currency: "AED", status: "Active", primary: false },
    { id: "au", name: "Australia", code: "AU", region: "Asia Pacific", currency: "AUD", status: "Inactive", primary: false },
  ]);
  const toggleRegionStatus = (id: string) =>
    setRegions((rs) => rs.map((r) => (r.id === id ? { ...r, status: r.status === "Active" ? "Inactive" : "Active" } : r)));

  // ---- Localization: Currencies (display formats) ----
  const [localizationCurrencies, setLocalizationCurrencies] = useState([
    { id: "inr", name: "Indian Rupee", symbol: "₹", code: "INR", rate: "1.00", status: "Active", isDefault: true },
    { id: "usd", name: "US Dollar", symbol: "$", code: "USD", rate: "0.012", status: "Active", isDefault: false },
    { id: "eur", name: "Euro", symbol: "€", code: "EUR", rate: "0.011", status: "Active", isDefault: false },
    { id: "gbp", name: "British Pound", symbol: "£", code: "GBP", rate: "0.0095", status: "Active", isDefault: false },
    { id: "aed", name: "UAE Dirham", symbol: "د.إ", code: "AED", rate: "0.044", status: "Inactive", isDefault: false },
  ]);
  const toggleCurrencyStatus = (id: string) =>
    setLocalizationCurrencies((cs) => cs.map((c) => (c.id === id ? { ...c, status: c.status === "Active" ? "Inactive" : "Active" } : c)));

  // ---- Localization: Date & Time ----
  const [globalDateFormat, setGlobalDateFormat] = useState("DD MMM YYYY (24 Jun 2026)");
  const [globalTimeFormat, setGlobalTimeFormat] = useState("12 Hour (AM/PM)");
  const [firstDayOfWeek, setFirstDayOfWeek] = useState("Monday");
  const [defaultTimezoneDisplay, setDefaultTimezoneDisplay] = useState("User's Local Timezone");
  const [autoDST, setAutoDST] = useState(true);

  // ---- Localization: Number & Format ----
  const [decimalSeparator, setDecimalSeparator] = useState("Period (.)");
  const [thousandsSeparator, setThousandsSeparator] = useState("Comma (,)");
  const [decimalPlaces, setDecimalPlaces] = useState("2");
  const [measurementUnit, setMeasurementUnit] = useState("Metric (cm, kg)");
  const [phoneNumberFormat, setPhoneNumberFormat] = useState("International (+91 98765 43210)");

  // ---- Integrations settings state ----
  const [integrationFilter, setIntegrationFilter] = useState("All Integrations");
  const [integrationSearch, setIntegrationSearch] = useState("");

  const [integrations, setIntegrations] = useState([
    { id: "sendgrid", name: "SendGrid", category: "Email", desc: "Reliable email delivery for transactional and marketing emails.", status: "Connected", lastSynced: "24 May 2026, 10:15 AM", icon: "email", color: "#1A82E2" },
    { id: "twilio", name: "Twilio", category: "SMS / Voice", desc: "Send SMS, WhatsApp messages and voice notifications.", status: "Connected", lastSynced: "24 May 2026, 10:12 AM", icon: "sms", color: "#F22F46" },
    { id: "razorpay", name: "Razorpay", category: "Payments", desc: "Accept online payments securely and manage transactions.", status: "Connected", lastSynced: "24 May 2026, 09:48 AM", icon: "razorpay", color: "#0E2B5C" },
    { id: "stripe", name: "Stripe", category: "Payments", desc: "Global payments infrastructure for international users.", status: "Disconnected", lastSynced: "—", icon: "stripe", color: "#635BFF" },
    { id: "ga4", name: "Google Analytics 4", category: "Analytics", desc: "Track user behavior and platform performance.", status: "Connected", lastSynced: "24 May 2026, 09:30 AM", icon: "analytics", color: ORANGE },
    { id: "s3", name: "Amazon S3", category: "Storage", desc: "Secure and scalable cloud storage for media files.", status: "Connected", lastSynced: "24 May 2026, 09:25 AM", icon: "storage", color: "#E25444" },
    { id: "cloudinary", name: "Cloudinary", category: "Media", desc: "Image and video optimization and delivery.", status: "Connected", lastSynced: "24 May 2026, 09:22 AM", icon: "media", color: BLUE },
    { id: "meta", name: "Meta (Facebook)", category: "Social", desc: "Enable social login and share integrations.", status: "Disconnected", lastSynced: "—", icon: "social", color: BLUE },
  ]);

  const toggleIntegration = (id: string) =>
    setIntegrations((ints) =>
      ints.map((i) =>
        i.id === id
          ? { ...i, status: i.status === "Connected" ? "Disconnected" : "Connected", lastSynced: i.status === "Connected" ? "—" : "Just now" }
          : i
      )
    );

  const [recentActivity] = useState([
    { id: 1, text: "SendGrid integration connected successfully", date: "24 May 2026 10:15 AM", color: GREEN },
    { id: 2, text: "Twilio configuration updated", date: "24 May 2026 10:12 AM", color: GREEN },
    { id: 3, text: "Razorpay webhook verified", date: "24 May 2026 09:50 AM", color: GREEN },
    { id: 4, text: "Stripe integration disconnected", date: "24 May 2026 09:35 AM", color: RED },
    { id: 5, text: "Cloudinary settings updated", date: "24 May 2026 09:20 AM", color: GREEN },
  ]);

  // ---- Other settings state ----
  const [cacheToggles, setCacheToggles] = useState({
    pageCache: true,
    apiCache: true,
    imageCdn: true,
    debugMode: false,
  });
  const toggleCacheSetting = (key: keyof typeof cacheToggles) =>
    setCacheToggles((t) => ({ ...t, [key]: !t[key] }));

  const [legalLinks, setLegalLinks] = useState([
    { id: "terms", label: "Terms & Conditions", url: "/terms", lastUpdated: "01 Jan 2026", status: "Published" },
    { id: "privacy", label: "Privacy Policy", url: "/privacy", lastUpdated: "01 Jan 2026", status: "Published" },
    { id: "cookie", label: "Cookie Policy", url: "/cookie-policy", lastUpdated: "01 Jan 2026", status: "Draft" },
    { id: "refund", label: "Refund Policy", url: "/refund-policy", lastUpdated: "15 Mar 2026", status: "Published" },
    { id: "community", label: "Community Guidelines", url: "/community-guidelines", lastUpdated: "—", status: "Draft" },
  ]);

  const [footerText, setFooterText] = useState("© 2026 SilverScreens. All rights reserved.");
  const [companyAddress, setCompanyAddress] = useState("SilverScreens Media Pvt. Ltd., Chennai, Tamil Nadu, India");
  const [gstNumber, setGstNumber] = useState("33AAAAA0000A1Z5");
  const [dataRetentionDays, setDataRetentionDays] = useState("365 Days");

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
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
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 1,
              padding: "4px 10px",
              borderRadius: 5,
              background: RED,
              color: "#fff",
            }}
          >
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
              <span
                style={{
                  position: "absolute",
                  top: -6,
                  right: -6,
                  background: RED,
                  color: "#fff",
                  fontSize: 9,
                  fontWeight: 700,
                  borderRadius: 8,
                  padding: "1px 5px",
                }}
              >
                {topbarMessages.filter((m) => !m.read).length}
              </span>
            </button>

            {msgPanelOpen && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: 38,
                  width: 320,
                  background: BG3,
                  border: `1px solid ${BORDER}`,
                  borderRadius: 8,
                  overflow: "hidden",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                  zIndex: 40,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", borderBottom: `1px solid ${BORDER}` }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Messages</span>
                  <span
                    onClick={() => {
                      setMsgPanelOpen(false);
                      alert('"All Messages" page is not built yet. (404)');
                    }}
                    style={{ fontSize: 12, color: GOLD, cursor: "pointer" }}
                  >
                    View All
                  </span>
                </div>
                {topbarMessages.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => {
                      setMsgPanelOpen(false);
                      alert(`Open conversation with "${m.sender}" (demo action).`);
                    }}
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
              <span
                style={{
                  position: "absolute",
                  top: -6,
                  right: -6,
                  background: RED,
                  color: "#fff",
                  fontSize: 9,
                  fontWeight: 700,
                  borderRadius: 8,
                  padding: "1px 5px",
                }}
              >
                {topbarNotifications.filter((n) => !n.read).length}
              </span>
            </button>

            {notifPanelOpen && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: 38,
                  width: 340,
                  background: BG3,
                  border: `1px solid ${BORDER}`,
                  borderRadius: 8,
                  overflow: "hidden",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                  zIndex: 40,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", borderBottom: `1px solid ${BORDER}` }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Notifications</span>
                  <span
                    onClick={() => {
                      setNotifPanelOpen(false);
                      router.push("/admin/notifications");
                    }}
                    style={{ fontSize: 12, color: GOLD, cursor: "pointer" }}
                  >
                    View All
                  </span>
                </div>
                {topbarNotifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      setNotifPanelOpen(false);
                      alert(`Open notification: "${n.text}" (demo action).`);
                    }}
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
              onClick={() => {
                setProfileOpen((p) => !p);
                setNotifPanelOpen(false);
                setMsgPanelOpen(false);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "#fff",
              }}
            >
              <img
                src="https://i.pravatar.cc/100?img=12"
                alt="Super Admin"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: `1px solid ${GOLD}`,
                }}
              />
              <div style={{ textAlign: "left", lineHeight: 1.25 }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>Super Admin</div>
                <div style={{ fontSize: 11, color: TEXT_MUTED }}>Administrator</div>
              </div>
              <ChevronDown size={14} color={TEXT_MUTED} />
            </button>

            {profileOpen && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: 50,
                  width: 220,
                  background: BG3,
                  border: `1px solid ${BORDER}`,
                  borderRadius: 8,
                  overflow: "hidden",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                  zIndex: 30,
                }}
              >
                {PROFILE_MENU.map((m) => (
                  <div
                    key={m.label}
                    onClick={() => {
                      setProfileOpen(false);
                      go(router, m);
                    }}
                    style={{
                      padding: "10px 14px",
                      fontSize: 13,
                      cursor: "pointer",
                      color: m.label === "Logout" ? RED : "#E6E8EC",
                      borderBottom: `1px solid ${BORDER}`,
                    }}
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
            <button
              onClick={() => setCollapsed((c) => !c)}
              style={{ background: "transparent", border: "none", color: TEXT_MUTED, cursor: "pointer", display: "flex", alignItems: "center" }}
              aria-label="Toggle sidebar"
            >
              {collapsed ? <Menu size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>

          {/* Profile block */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: collapsed ? "12px 0" : "10px 16px 16px",
              justifyContent: collapsed ? "center" : "flex-start",
            }}
          >
            <img
              src="https://i.pravatar.cc/100?img=12"
              alt="Super Admin"
              style={{
                width: 38,
                height: 38,
                minWidth: 38,
                borderRadius: "50%",
                objectFit: "cover",
                border: `1px solid ${GOLD}`,
              }}
            />
            {!collapsed && (
              <div style={{ lineHeight: 1.3 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Super Admin</div>
                <div style={{ fontSize: 12, color: RED, fontWeight: 600 }}>ADM000001</div>
              </div>
            )}
          </div>

          {/* Flat nav list */}
          <div style={{ padding: "4px 8px 14px", flex: 1 }}>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = item.label === "Settings" || item.href === "/admin/settings";
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
                    justifyContent: collapsed ? "center" : "space-between",
                    borderRadius: 6,
                    cursor: "pointer",
                    color: active ? GOLD : "#cfd3da",
                    fontWeight: active ? 700 : 400,
                    fontSize: 14,
                    marginBottom: 2,
                    background: active ? "rgba(212,166,74,0.12)" : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (!active) e.currentTarget.style.background = BG3;
                  }}
                  onMouseLeave={(e) => {
                    if (!active) e.currentTarget.style.background = "transparent";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Icon size={17} />
                    {!collapsed && <span>{item.label}</span>}
                  </div>
                  {!collapsed && active && <ChevronRight size={14} />}
                </div>
              );
            })}
          </div>

          {/* Settings pinned at bottom */}
          <div style={{ padding: "10px 8px", borderTop: `1px solid ${BORDER}` }}>
            <div
              onClick={() => router.push("/admin/settings")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: collapsed ? "10px 0" : "9px 12px",
                justifyContent: collapsed ? "center" : "flex-start",
                borderRadius: 6,
                background: "rgba(212,166,74,0.12)",
                border: `1px solid ${GOLD}`,
                color: GOLD,
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              <SettingsIcon size={17} />
              {!collapsed && <span>Settings</span>}
            </div>
          </div>
        </div>

        {/* ---------------- MAIN CONTENT ---------------- */}
        <div style={{ flex: 1, padding: "24px 28px", display: "flex", gap: 24 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <h1 style={{ fontFamily: BEBAS, fontSize: 34, letterSpacing: 1, color: GOLD, margin: 0 }}>
                  SETTINGS
                </h1>
                <p style={{ fontSize: 14, color: TEXT_MUTED, margin: "4px 0 0" }}>
                  Manage platform settings and preferences.
                </p>
              </div>
              <button
                onClick={handleSave}
                style={{
                  background: GOLD,
                  color: BG,
                  border: "none",
                  borderRadius: 6,
                  padding: "10px 18px",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Save size={15} />
                {saved ? "Saved!" : "Save Changes"}
              </button>
            </div>

            {/* Tabs */}
            <div
              style={{
                background: BG2,
                border: `1px solid ${BORDER}`,
                borderRadius: 10,
                padding: "0 16px",
                marginBottom: 20,
                display: "flex",
                gap: 4,
                overflowX: "auto",
              }}
            >
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.key;
                return (
                  <div
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                      padding: "14px 14px 12px",
                      fontSize: 14,
                      cursor: "pointer",
                      color: active ? GOLD : "#cfd3da",
                      borderBottom: active ? `2px solid ${GOLD}` : "2px solid transparent",
                      whiteSpace: "nowrap",
                      fontWeight: active ? 600 : 400,
                    }}
                  >
                    <Icon size={15} />
                    {tab.label}
                  </div>
                );
              })}
            </div>

            {/* Panel content */}
            <div
              style={{
                background: BG2,
                border: `1px solid ${BORDER}`,
                borderRadius: 10,
                padding: 24,
              }}
            >
              {activeTab === "general" && (
                <GeneralPanel
                  values={{ platformName, tagline, supportEmail, supportPhone, timezone, dateFormat, timeFormat, itemsPerPage }}
                  setters={{ setPlatformName, setTagline, setSupportEmail, setSupportPhone, setTimezone, setDateFormat, setTimeFormat, setItemsPerPage }}
                  toggles={toggles}
                  toggle={toggle}
                />
              )}
              {activeTab === "email" && (
                <EmailPanel
                  values={{ smtpHost, smtpPort, encryption, smtpUsername, smtpPassword, fromEmail, replyToEmail, replyToName, fromName }}
                  setters={{ setSmtpHost, setSmtpPort, setEncryption, setSmtpUsername, setSmtpPassword, setFromEmail, setReplyToEmail, setReplyToName, setFromName }}
                  toggles={emailToggles}
                  toggle={toggleEmail}
                  showPassword={showSmtpPassword}
                  setShowPassword={setShowSmtpPassword}
                  router={router}
                />
              )}
              {activeTab === "sms" && (
                <SmsPanel
                  values={{ smsProvider, smsAccountSid, smsAuthToken, smsFromNumber, smsSendingLimit, waProvider, waAccessToken, waPhoneNumberId, waBusinessNumber, waSendingLimit, preferredChannel }}
                  setters={{ setSmsProvider, setSmsAccountSid, setSmsAuthToken, setSmsFromNumber, setSmsSendingLimit, setWaProvider, setWaAccessToken, setWaPhoneNumberId, setWaBusinessNumber, setWaSendingLimit, setPreferredChannel }}
                  toggles={smsWaToggles}
                  toggle={toggleSmsWa}
                  showSmsAuthToken={showSmsAuthToken}
                  setShowSmsAuthToken={setShowSmsAuthToken}
                  showWaAccessToken={showWaAccessToken}
                  setShowWaAccessToken={setShowWaAccessToken}
                />
              )}
              {activeTab === "payments" && (
                <PaymentsPanel
                  gateways={gateways}
                  toggleGatewayStatus={toggleGatewayStatus}
                  currencies={currencies}
                  taxes={taxes}
                  refundPolicy={refundPolicy}
                  setRefundPolicy={setRefundPolicy}
                  disputeHandling={disputeHandling}
                  setDisputeHandling={setDisputeHandling}
                  autoRefund={autoRefund}
                  setAutoRefund={setAutoRefund}
                  router={router}
                />
              )}
              {activeTab === "security" && (
                <SecurityPanel
                  twoFaEnabled={twoFaEnabled}
                  setTwoFaEnabled={setTwoFaEnabled}
                  loginAttemptLimit={loginAttemptLimit}
                  setLoginAttemptLimit={setLoginAttemptLimit}
                  lockoutDuration={lockoutDuration}
                  setLockoutDuration={setLockoutDuration}
                  activeSessionsPolicy={activeSessionsPolicy}
                  rememberDevice={rememberDevice}
                  setRememberDevice={setRememberDevice}
                  sessionTimeout={sessionTimeout}
                  setSessionTimeout={setSessionTimeout}
                  passwordPolicy={passwordPolicy}
                  whitelistedIps={whitelistedIps}
                  blockedIps={blockedIps}
                  router={router}
                />
              )}
              {activeTab === "notifications" && (
                <NotificationsPanel
                  channelToggles={channelToggles}
                  toggleChannel={toggleChannel}
                  moduleFilter={moduleFilter}
                  setModuleFilter={setModuleFilter}
                  eventSearch={eventSearch}
                  setEventSearch={setEventSearch}
                  notificationEvents={notificationEvents}
                  toggleEventChannel={toggleEventChannel}
                  router={router}
                />
              )}
              {activeTab === "localization" && (
                <LocalizationPanel
                  subTab={localizationSubTab}
                  setSubTab={setLocalizationSubTab}
                  languages={languages}
                  toggleLanguageStatus={toggleLanguageStatus}
                  defaultPlatformLanguage={defaultPlatformLanguage}
                  setDefaultPlatformLanguage={setDefaultPlatformLanguage}
                  allowLanguageChange={allowLanguageChange}
                  setAllowLanguageChange={setAllowLanguageChange}
                  browserLangDetection={browserLangDetection}
                  setBrowserLangDetection={setBrowserLangDetection}
                  regions={regions}
                  toggleRegionStatus={toggleRegionStatus}
                  localizationCurrencies={localizationCurrencies}
                  toggleCurrencyStatus={toggleCurrencyStatus}
                  globalDateFormat={globalDateFormat}
                  setGlobalDateFormat={setGlobalDateFormat}
                  globalTimeFormat={globalTimeFormat}
                  setGlobalTimeFormat={setGlobalTimeFormat}
                  firstDayOfWeek={firstDayOfWeek}
                  setFirstDayOfWeek={setFirstDayOfWeek}
                  defaultTimezoneDisplay={defaultTimezoneDisplay}
                  setDefaultTimezoneDisplay={setDefaultTimezoneDisplay}
                  autoDST={autoDST}
                  setAutoDST={setAutoDST}
                  decimalSeparator={decimalSeparator}
                  setDecimalSeparator={setDecimalSeparator}
                  thousandsSeparator={thousandsSeparator}
                  setThousandsSeparator={setThousandsSeparator}
                  decimalPlaces={decimalPlaces}
                  setDecimalPlaces={setDecimalPlaces}
                  measurementUnit={measurementUnit}
                  setMeasurementUnit={setMeasurementUnit}
                  phoneNumberFormat={phoneNumberFormat}
                  setPhoneNumberFormat={setPhoneNumberFormat}
                  router={router}
                />
              )}
              {activeTab === "integrations" && (
                <IntegrationsPanel
                  integrations={integrations}
                  toggleIntegration={toggleIntegration}
                  filter={integrationFilter}
                  setFilter={setIntegrationFilter}
                  search={integrationSearch}
                  setSearch={setIntegrationSearch}
                  router={router}
                />
              )}
              {activeTab !== "general" && activeTab !== "email" && activeTab !== "sms" && activeTab !== "payments" && activeTab !== "security" && activeTab !== "notifications" && activeTab !== "localization" && activeTab !== "integrations" && (
                <PlaceholderPanel label={TABS.find((t) => t.key === activeTab)?.label || ""} />
              )}
            </div>
          </div>

          {/* ---------------- RIGHT RAIL ---------------- */}
          <div style={{ width: 300, minWidth: 300, display: "flex", flexDirection: "column", gap: 20 }}>
            {activeTab === "email" && (
              <>
                <EmailSystemInfo />
                <EmailQuickActions router={router} />
                <HelpTips />
              </>
            )}
            {activeTab === "sms" && (
              <>
                <SmsSystemInfo />
                <SmsUsage />
                <SmsQuickActions router={router} />
              </>
            )}
            {activeTab === "payments" && (
              <>
                <PaymentSystemInfo />
                <PaymentOverview router={router} />
                <PaymentQuickActions router={router} />
              </>
            )}
            {activeTab === "security" && (
              <>
                <SecurityOverview />
                <RecentSecurityActivity router={router} />
                <SecurityQuickActions router={router} />
              </>
            )}
            {activeTab === "notifications" && (
              <>
                <NotificationOverview />
                <QuietHours
                  enabled={quietHoursEnabled}
                  setEnabled={setQuietHoursEnabled}
                  start={quietStart}
                  setStart={setQuietStart}
                  end={quietEnd}
                  setEnd={setQuietEnd}
                  timezone={quietTimezone}
                  setTimezone={setQuietTimezone}
                />
                <NotificationQuickActions router={router} />
              </>
            )}
            {activeTab === "localization" && (
              <>
                <LocalizationOverview />
                <ActiveLocales router={router} />
                <LocalizationQuickActions router={router} />
              </>
            )}
            {activeTab === "integrations" && (
              <>
                <IntegrationsOverview integrations={integrations} />
                <RecentActivityCard activity={recentActivity} router={router} />
                <IntegrationsQuickActions router={router} />
              </>
            )}
            {activeTab !== "email" && activeTab !== "sms" && activeTab !== "payments" && activeTab !== "security" && activeTab !== "notifications" && activeTab !== "localization" && activeTab !== "integrations" && (
              <>
                <SystemInformation router={router} />
                <QuickActions router={router} />
                <DangerZone />
              </>
            )}
          </div>
        </div>
      </div>

      <div style={{ textAlign: "center", padding: "18px 0 28px", fontSize: 12, color: TEXT_MUTED, borderTop: `1px solid ${BORDER}` }}>
        © 2026 SilverScreens. All rights reserved.
      </div>
    </div>
  );
}

// ---------------- Sub components ----------------

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ fontSize: 13, color: "#cfd3da", display: "block", marginBottom: 6 }}>{label}</label>
      {children}
      {hint && <div style={{ fontSize: 12, color: TEXT_MUTED, marginTop: 5 }}>{hint}</div>}
    </div>
  );
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
      <div
        style={{
          position: "absolute",
          top: 2,
          left: on ? 22 : 2,
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: "#fff",
          transition: "left 0.15s",
        }}
      />
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{ fontFamily: BARLOW, fontWeight: 700, fontSize: 18, color: GOLD, margin: "0 0 16px" }}>
      {children}
    </h2>
  );
}

function PrefRow({
  icon: Icon,
  title,
  desc,
  on,
  onClick,
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
  on: boolean;
  onClick: () => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 0",
        borderBottom: `1px solid ${BORDER}`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Icon size={18} color={TEXT_MUTED} />
        <div>
          <div style={{ fontSize: 14, color: "#fff" }}>{title}</div>
          <div style={{ fontSize: 12, color: TEXT_MUTED }}>{desc}</div>
        </div>
      </div>
      <ToggleSwitch on={on} onClick={onClick} />
    </div>
  );
}

function GeneralPanel({
  values,
  setters,
  toggles,
  toggle,
}: {
  values: any;
  setters: any;
  toggles: any;
  toggle: (k: any) => void;
}) {
  return (
    <>
      <SectionTitle>General Settings</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 28px" }}>
        <Field label="Platform Name" hint="This name will be used throughout the platform.">
          <input style={inputStyle} value={values.platformName} onChange={(e) => setters.setPlatformName(e.target.value)} />
        </Field>
        <Field label="Platform Tagline" hint="Displayed on login, landing page and emails.">
          <input style={inputStyle} value={values.tagline} onChange={(e) => setters.setTagline(e.target.value)} />
        </Field>
        <Field label="Support Email" hint="Primary email for user support and notifications.">
          <input style={inputStyle} value={values.supportEmail} onChange={(e) => setters.setSupportEmail(e.target.value)} />
        </Field>
        <Field label="Support Phone" hint="Phone number for user support.">
          <input style={inputStyle} value={values.supportPhone} onChange={(e) => setters.setSupportPhone(e.target.value)} />
        </Field>
        <Field label="Default Timezone" hint="Timezone for system and event scheduling.">
          <select style={inputStyle} value={values.timezone} onChange={(e) => setters.setTimezone(e.target.value)}>
            <option>(GMT+05:30) Asia/Kolkata</option>
            <option>(GMT+00:00) UTC</option>
            <option>(GMT-05:00) America/New_York</option>
          </select>
        </Field>
        <Field label="Date Format" hint="Default format for dates across the platform.">
          <select style={inputStyle} value={values.dateFormat} onChange={(e) => setters.setDateFormat(e.target.value)}>
            <option>DD MMM YYYY (24 Jun 2026)</option>
            <option>MM/DD/YYYY</option>
            <option>YYYY-MM-DD</option>
          </select>
        </Field>
        <Field label="Time Format" hint="Default time format.">
          <select style={inputStyle} value={values.timeFormat} onChange={(e) => setters.setTimeFormat(e.target.value)}>
            <option>12 Hour (AM/PM)</option>
            <option>24 Hour</option>
          </select>
        </Field>
        <Field label="Items Per Page" hint="Default number of records per page.">
          <select style={inputStyle} value={values.itemsPerPage} onChange={(e) => setters.setItemsPerPage(e.target.value)}>
            <option>10</option>
            <option>25</option>
            <option>50</option>
            <option>100</option>
          </select>
        </Field>
      </div>

      <div style={{ marginTop: 8, marginBottom: 24 }}>
        <SectionTitle>Platform Preferences</SectionTitle>
        <PrefRow icon={Users} title="New User Registration" desc="Allow new users to register on the platform." on={toggles.newUserRegistration} onClick={() => toggle("newUserRegistration")} />
        <PrefRow icon={CheckCircle2} title="Email Verification" desc="Require email verification for all new users." on={toggles.emailVerification} onClick={() => toggle("emailVerification")} />
        <PrefRow icon={Bell} title="Mobile Verification" desc="Require mobile number verification for all new users." on={toggles.mobileVerification} onClick={() => toggle("mobileVerification")} />
        <PrefRow icon={Users} title="Auto Approve Talents" desc="Automatically approve talent profiles after submission." on={toggles.autoApproveTalents} onClick={() => toggle("autoApproveTalents")} />
        <PrefRow icon={Building2} title="Auto Approve Agencies" desc="Automatically approve agency profiles after verification." on={toggles.autoApproveAgencies} onClick={() => toggle("autoApproveAgencies")} />
      </div>

      <div>
        <SectionTitle>Maintenance Mode</SectionTitle>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div style={{ fontSize: 13, color: TEXT_MUTED }}>Enable maintenance mode to restrict access to the platform.</div>
          <ToggleSwitch on={toggles.maintenanceMode} onClick={() => toggle("maintenanceMode")} />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "rgba(59,130,246,0.1)",
            border: `1px solid ${BLUE}`,
            borderRadius: 8,
            padding: "12px 14px",
            fontSize: 13,
            color: "#9DC2FB",
          }}
        >
          <Info size={16} color={BLUE} />
          When maintenance mode is enabled, only admins will be able to access the platform.
        </div>
      </div>
    </>
  );
}

function PlaceholderPanel({ label }: { label: string }) {
  return (
    <div style={{ padding: "60px 20px", textAlign: "center" }}>
      <SettingsIcon size={32} color={TEXT_MUTED} style={{ marginBottom: 12 }} />
      <div style={{ fontSize: 16, color: "#cfd3da", marginBottom: 6 }}>{label} Settings</div>
      <div style={{ fontSize: 13, color: TEXT_MUTED }}>This section is under development. Check back soon.</div>
    </div>
  );
}

function RailCard({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return (
    <div style={{ background: BG2, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 18 }}>
      <h3 style={{ fontFamily: BARLOW, fontWeight: 700, fontSize: 15, color, margin: "0 0 14px", letterSpacing: 0.5 }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

function InfoRow({ icon: Icon, label, value, badge }: { icon: React.ElementType; label: string; value?: string; badge?: { text: string; color: string } }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 0" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#cfd3da" }}>
        <Icon size={14} color={TEXT_MUTED} />
        {label}
      </div>
      {badge ? (
        <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 4, background: `${badge.color}22`, color: badge.color }}>
          {badge.text}
        </span>
      ) : (
        <span style={{ fontSize: 13, color: "#fff" }}>{value}</span>
      )}
    </div>
  );
}

function SystemInformation({ router }: { router: ReturnType<typeof useRouter> }) {
  return (
    <RailCard title="SYSTEM INFORMATION" color={GOLD}>
      <InfoRow icon={Info} label="Platform Version" value="v2.4.1" />
      <InfoRow icon={Info} label="Environment" badge={{ text: "Production", color: GREEN }} />
      <InfoRow icon={Info} label="Last Backup" value="24 Jun 2026, 03:15 AM" />
      <InfoRow icon={Info} label="Next Backup" value="25 Jun 2026, 03:00 AM" />
      <InfoRow icon={Database} label="Database Size" value="12.45 GB" />
      <InfoRow icon={Activity} label="Server Status" badge={{ text: "Healthy", color: GREEN }} />
      <InfoRow icon={Info} label="Uptime" value="15d 6h 24m" />
      <InfoRow icon={Info} label="PHP Version" value="8.2.10" />
      <InfoRow icon={Database} label="Database" value="PostgreSQL 15" />
      <InfoRow icon={HardDrive} label="Storage Used" value="235.6 GB / 500 GB" />
      <div style={{ height: 6, background: BG4, borderRadius: 3, marginTop: 8, overflow: "hidden" }}>
        <div style={{ width: "47%", height: "100%", background: GOLD }} />
      </div>
      <div style={{ textAlign: "right", fontSize: 11, color: TEXT_MUTED, marginTop: 4 }}>47%</div>
    </RailCard>
  );
}

function ActionRow({ icon: Icon, label, onClick, danger }: { icon: React.ElementType; label: string; onClick: () => void; danger?: boolean }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 0",
        cursor: "pointer",
        borderBottom: `1px solid ${BORDER}`,
        color: danger ? RED : "#cfd3da",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
        <Icon size={16} color={danger ? RED : TEXT_MUTED} />
        {label}
      </div>
      <ChevronLeft size={14} style={{ transform: "rotate(180deg)" }} color={danger ? RED : TEXT_MUTED} />
    </div>
  );
}

function QuickActions({ router }: { router: ReturnType<typeof useRouter> }) {
  return (
    <RailCard title="QUICK ACTIONS" color={GOLD}>
      <ActionRow icon={Trash2} label="Clear Cache" onClick={() => alert("Cache cleared (demo action).")} />
      <ActionRow icon={Database} label="Optimize Database" onClick={() => alert("Database optimization started (demo action).")} />
      <ActionRow icon={RefreshCcw} label="System Backup Now" onClick={() => alert("Backup started (demo action).")} />
      <ActionRow icon={ScrollText} label="View Activity Logs" onClick={() => router.push("/admin/audit-logs")} />
      <ActionRow icon={Mail} label="Reset Email Queue" onClick={() => alert("Email queue reset (demo action).")} />
    </RailCard>
  );
}

function DangerZone() {
  return (
    <RailCard title="DANGER ZONE" color={RED}>
      <div
        onClick={() => {
          if (confirm("This will clear cache across the platform. Continue?")) alert("All cache cleared.");
        }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 0",
          cursor: "pointer",
          borderBottom: `1px solid ${BORDER}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Trash2 size={16} color={RED} />
          <div>
            <div style={{ fontSize: 13, color: RED }}>Clear All Cache</div>
            <div style={{ fontSize: 11, color: TEXT_MUTED }}>This will clear cache across the platform.</div>
          </div>
        </div>
        <ChevronLeft size={14} style={{ transform: "rotate(180deg)" }} color={RED} />
      </div>
    </RailCard>
  );
}

// ============== EMAIL TAB ==============

function CircularProgress({ percent, label }: { percent: number; label: string }) {
  const size = 110;
  const stroke = 9;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (percent / 100) * circumference;
  return (
    <div style={{ position: "relative", width: size, height: size, margin: "0 auto" }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke={BG4} strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={GREEN}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ fontSize: 20, fontWeight: 700, color: "#fff" }}>{percent}%</div>
        <div style={{ fontSize: 11, color: TEXT_MUTED }}>{label}</div>
      </div>
    </div>
  );
}

function EmailPanel({
  values,
  setters,
  toggles,
  toggle,
  showPassword,
  setShowPassword,
  router,
}: {
  values: any;
  setters: any;
  toggles: any;
  toggle: (k: any) => void;
  showPassword: boolean;
  setShowPassword: (v: boolean) => void;
  router: ReturnType<typeof useRouter>;
}) {
  return (
    <>
      <SectionTitle>Email Settings</SectionTitle>
      <div style={{ fontSize: 13, color: TEXT_MUTED, marginTop: -10, marginBottom: 18 }}>
        Configure email delivery, templates and preferences.
      </div>

      {/* SMTP Configuration */}
      <div
        style={{
          border: `1px solid ${BORDER}`,
          borderRadius: 8,
          padding: 18,
          marginBottom: 24,
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 16 }}>SMTP Configuration</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 20px" }}>
          <Field label="SMTP Host">
            <input style={inputStyle} value={values.smtpHost} onChange={(e) => setters.setSmtpHost(e.target.value)} />
          </Field>
          <Field label="SMTP Port">
            <input style={inputStyle} value={values.smtpPort} onChange={(e) => setters.setSmtpPort(e.target.value)} />
          </Field>
          <Field label="Encryption">
            <select style={inputStyle} value={values.encryption} onChange={(e) => setters.setEncryption(e.target.value)}>
              <option>TLS</option>
              <option>SSL</option>
              <option>None</option>
            </select>
          </Field>

          <Field label="SMTP Username">
            <input style={inputStyle} value={values.smtpUsername} onChange={(e) => setters.setSmtpUsername(e.target.value)} />
          </Field>
          <Field label="SMTP Password / API Key">
            <div style={{ position: "relative" }}>
              <input
                style={{ ...inputStyle, paddingRight: 38 }}
                type={showPassword ? "text" : "password"}
                value={values.smtpPassword}
                onChange={(e) => setters.setSmtpPassword(e.target.value)}
              />
              <div
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: "absolute", right: 10, top: 11, cursor: "pointer", color: TEXT_MUTED }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </div>
            </div>
          </Field>
          <Field label="From Email">
            <input style={inputStyle} value={values.fromEmail} onChange={(e) => setters.setFromEmail(e.target.value)} />
          </Field>

          <Field label="Reply To Email">
            <input style={inputStyle} value={values.replyToEmail} onChange={(e) => setters.setReplyToEmail(e.target.value)} />
          </Field>
          <Field label="Reply To Name">
            <input style={inputStyle} value={values.replyToName} onChange={(e) => setters.setReplyToName(e.target.value)} />
          </Field>
          <Field label="From Name">
            <input style={inputStyle} value={values.fromName} onChange={(e) => setters.setFromName(e.target.value)} />
          </Field>
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", gap: 30, marginTop: 6 }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 14, color: "#fff" }}>Enable TLS Encryption</div>
              <div style={{ fontSize: 12, color: TEXT_MUTED }}>Secure email transmission using TLS encryption.</div>
            </div>
            <ToggleSwitch on={toggles.tlsEncryption} onClick={() => toggle("tlsEncryption")} />
          </div>
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 14, color: "#fff" }}>Enable Authentication</div>
              <div style={{ fontSize: 12, color: TEXT_MUTED }}>Use SMTP authentication for secure login.</div>
            </div>
            <ToggleSwitch on={toggles.authentication} onClick={() => toggle("authentication")} />
          </div>
          <button
            onClick={() => alert("Test email sent to " + values.fromEmail + " (demo action).")}
            style={{
              flex: 1,
              background: "transparent",
              border: `1px solid ${GOLD}`,
              color: GOLD,
              borderRadius: 6,
              padding: "11px 14px",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <Send size={15} />
            Send Test Email
          </button>
        </div>
      </div>

      {/* Email Preferences + Sending Limits */}
      <div style={{ display: "flex", gap: 20, alignItems: "flex-start", marginBottom: 24 }}>
        <div style={{ flex: 1.4 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 2 }}>Email Preferences</div>
          <div style={{ fontSize: 12, color: TEXT_MUTED, marginBottom: 10 }}>Manage global email preferences and notifications.</div>
          <PrefRow icon={Mail} title="Welcome Email" desc="Send welcome email to new users after registration." on={toggles.welcomeEmail} onClick={() => toggle("welcomeEmail")} />
          <PrefRow icon={CheckCircle2} title="Email Verification" desc="Send email verification link to users." on={toggles.emailVerification} onClick={() => toggle("emailVerification")} />
          <PrefRow icon={Lock} title="Password Reset" desc="Send password reset link when requested." on={toggles.passwordReset} onClick={() => toggle("passwordReset")} />
          <PrefRow icon={Bell} title="New Application Alerts" desc="Notify agencies about new applications." on={toggles.newApplicationAlerts} onClick={() => toggle("newApplicationAlerts")} />
          <PrefRow icon={ShieldAlert} title="System Alerts" desc="Receive important system and security alerts." on={toggles.systemAlerts} onClick={() => toggle("systemAlerts")} />
        </div>

        <div style={{ flex: 1, border: `1px solid ${BORDER}`, borderRadius: 8, padding: 18 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 14 }}>Email Sending Limits</div>
          <InfoRow icon={Mail} label="Daily Email Limit" value="10,000" />
          <InfoRow icon={Send} label="Emails Sent Today" value="2,342" />
          <InfoRow icon={ListChecks} label="Remaining Limit" value="7,658" />
          <div style={{ marginTop: 10 }}>
            <CircularProgress percent={23} label="Used" />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 8,
              background: "rgba(59,130,246,0.1)",
              border: `1px solid ${BLUE}`,
              borderRadius: 8,
              padding: "10px 12px",
              fontSize: 12,
              color: "#9DC2FB",
              marginTop: 14,
            }}
          >
            <Info size={14} color={BLUE} style={{ marginTop: 1 }} />
            <div>
              <div>Limit resets in 08:15:32</div>
              <div style={{ color: TEXT_MUTED }}>Daily limit will reset at 00:00 AM (Server Time)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Email Templates Overview */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          border: `1px solid ${BORDER}`,
          borderRadius: 8,
          padding: "16px 18px",
        }}
      >
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Email Templates Overview</div>
          <div style={{ fontSize: 12, color: TEXT_MUTED }}>Manage and customize email templates for system notifications.</div>
        </div>
        <button
          onClick={() => go(router, { href: "/admin/email-templates", built: false, label: "Email Templates" })}
          style={{
            background: GOLD,
            color: BG,
            border: "none",
            borderRadius: 6,
            padding: "10px 16px",
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <FileBox size={15} />
          Manage Email Templates
        </button>
      </div>
    </>
  );
}

function EmailSystemInfo() {
  return (
    <RailCard title="SYSTEM INFORMATION" color={GOLD}>
      <InfoRow icon={Mail} label="SMTP Provider" value="SendGrid" />
      <InfoRow icon={Activity} label="Connection Status" badge={{ text: "Connected", color: GREEN }} />
      <InfoRow icon={Mail} label="Last Test Email" badge={{ text: "24 Jun 2026, 10:45 AM", color: GREEN }} />
      <InfoRow icon={Inbox} label="Email Queue" value="12" />
      <InfoRow icon={Info} label="Bounce Rate" badge={{ text: "0.32%", color: GREEN }} />
      <InfoRow icon={Info} label="Spam Complaints" badge={{ text: "0.01%", color: GREEN }} />
    </RailCard>
  );
}

function EmailQuickActions({ router }: { router: ReturnType<typeof useRouter> }) {
  return (
    <RailCard title="QUICK ACTIONS" color={GOLD}>
      <ActionRow icon={Send} label="Test Email Configuration" onClick={() => alert("Test email configuration triggered (demo action).")} />
      <ActionRow icon={ListChecks} label="Email Queue" onClick={() => alert('"Email Queue" page is not built yet. (404)')} />
      <ActionRow icon={FileText} label="Email Logs" onClick={() => alert('"Email Logs" page is not built yet. (404)')} />
      <ActionRow icon={FileBox} label="Email Templates" onClick={() => go(router, { href: "/admin/email-templates", built: false, label: "Email Templates" })} />
    </RailCard>
  );
}

function HelpTips() {
  return (
    <RailCard title="HELP & TIPS" color={GOLD}>
      <div style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.5, marginBottom: 12 }}>
        Ensure your SMTP credentials are correct to avoid email delivery failures.
      </div>
      <div style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.5, marginBottom: 12 }}>
        We recommend using a dedicated email service for better deliverability.
      </div>
      <div style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.5, marginBottom: 14 }}>
        Need help? Contact our support team.
      </div>
      <button
        onClick={() => alert('"View Documentation" page is not built yet. (404)')}
        style={{
          width: "100%",
          background: "transparent",
          border: `1px solid ${GOLD}`,
          color: GOLD,
          borderRadius: 6,
          padding: "9px 12px",
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 7,
        }}
      >
        <BookOpen size={14} />
        View Documentation
      </button>
    </RailCard>
  );
}

// ============== SMS / WHATSAPP TAB ==============

function EventToggleRow({
  icon: Icon,
  title,
  desc,
  smsOn,
  waOn,
  onSms,
  onWa,
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
  smsOn: boolean;
  waOn: boolean;
  onSms: () => void;
  onWa: () => void;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 100px 100px",
        alignItems: "center",
        padding: "12px 0",
        borderBottom: `1px solid ${BORDER}`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Icon size={18} color={TEXT_MUTED} />
        <div>
          <div style={{ fontSize: 14, color: "#fff" }}>{title}</div>
          <div style={{ fontSize: 12, color: TEXT_MUTED }}>{desc}</div>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <ToggleSwitch on={smsOn} onClick={onSms} />
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <ToggleSwitch on={waOn} onClick={onWa} />
      </div>
    </div>
  );
}

function SmsPanel({
  values,
  setters,
  toggles,
  toggle,
  showSmsAuthToken,
  setShowSmsAuthToken,
  showWaAccessToken,
  setShowWaAccessToken,
}: {
  values: any;
  setters: any;
  toggles: any;
  toggle: (k: any) => void;
  showSmsAuthToken: boolean;
  setShowSmsAuthToken: (v: boolean) => void;
  showWaAccessToken: boolean;
  setShowWaAccessToken: (v: boolean) => void;
}) {
  return (
    <>
      <SectionTitle>SMS / WhatsApp Settings</SectionTitle>
      <div style={{ fontSize: 13, color: TEXT_MUTED, marginTop: -10, marginBottom: 18 }}>
        Configure SMS and WhatsApp providers, templates and preferences.
      </div>

      {/* Provider Configuration */}
      <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 14 }}>Provider Configuration</div>
      <div style={{ display: "flex", gap: 18, alignItems: "flex-start", marginBottom: 26 }}>
        {/* SMS Provider Card */}
        <div style={{ flex: 1, border: `1px solid ${BORDER}`, borderRadius: 8, padding: 16 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <MessageCircle size={17} color={PURPLE} />
              <span style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>SMS Provider</span>
            </div>
            <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 4, background: `${GREEN}22`, color: GREEN }}>
              Active
            </span>
          </div>

          <Field label="Provider">
            <select style={inputStyle} value={values.smsProvider} onChange={(e) => setters.setSmsProvider(e.target.value)}>
              <option>Twilio</option>
              <option>MSG91</option>
              <option>AWS SNS</option>
            </select>
          </Field>
          <Field label="Account SID">
            <input style={inputStyle} value={values.smsAccountSid} onChange={(e) => setters.setSmsAccountSid(e.target.value)} />
          </Field>
          <Field label="Auth Token">
            <div style={{ position: "relative" }}>
              <input
                style={{ ...inputStyle, paddingRight: 38 }}
                type={showSmsAuthToken ? "text" : "password"}
                value={values.smsAuthToken}
                onChange={(e) => setters.setSmsAuthToken(e.target.value)}
              />
              <div onClick={() => setShowSmsAuthToken(!showSmsAuthToken)} style={{ position: "absolute", right: 10, top: 11, cursor: "pointer", color: TEXT_MUTED }}>
                {showSmsAuthToken ? <EyeOff size={16} /> : <Eye size={16} />}
              </div>
            </div>
          </Field>
          <Field label="From Number">
            <input style={inputStyle} value={values.smsFromNumber} onChange={(e) => setters.setSmsFromNumber(e.target.value)} />
          </Field>
          <Field label="SMS Sending Limit" hint="Remaining: 652 SMS">
            <input style={inputStyle} value={values.smsSendingLimit} onChange={(e) => setters.setSmsSendingLimit(e.target.value)} />
          </Field>

          <button
            onClick={() => alert("Test SMS sent to " + values.smsFromNumber + " (demo action).")}
            style={{
              width: "100%",
              background: "transparent",
              border: `1px solid ${GOLD}`,
              color: GOLD,
              borderRadius: 6,
              padding: "10px 14px",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <Send size={15} />
            Test SMS
          </button>
        </div>

        {/* WhatsApp Provider Card */}
        <div style={{ flex: 1, border: `1px solid ${BORDER}`, borderRadius: 8, padding: 16 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <MessageSquare size={17} color={GREEN} />
              <span style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>WhatsApp Provider</span>
            </div>
            <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 4, background: `${GREEN}22`, color: GREEN }}>
              Active
            </span>
          </div>

          <Field label="Provider">
            <select style={inputStyle} value={values.waProvider} onChange={(e) => setters.setWaProvider(e.target.value)}>
              <option>360dialog</option>
              <option>Meta Cloud API</option>
              <option>Gupshup</option>
            </select>
          </Field>
          <Field label="Access Token">
            <div style={{ position: "relative" }}>
              <input
                style={{ ...inputStyle, paddingRight: 38 }}
                type={showWaAccessToken ? "text" : "password"}
                value={values.waAccessToken}
                onChange={(e) => setters.setWaAccessToken(e.target.value)}
              />
              <div onClick={() => setShowWaAccessToken(!showWaAccessToken)} style={{ position: "absolute", right: 10, top: 11, cursor: "pointer", color: TEXT_MUTED }}>
                {showWaAccessToken ? <EyeOff size={16} /> : <Eye size={16} />}
              </div>
            </div>
          </Field>
          <Field label="Phone Number ID">
            <input style={inputStyle} value={values.waPhoneNumberId} onChange={(e) => setters.setWaPhoneNumberId(e.target.value)} />
          </Field>
          <Field label="WhatsApp Business Number">
            <input style={inputStyle} value={values.waBusinessNumber} onChange={(e) => setters.setWaBusinessNumber(e.target.value)} />
          </Field>
          <Field label="Message Sending Limit" hint="Remaining: 312 Messages">
            <input style={inputStyle} value={values.waSendingLimit} onChange={(e) => setters.setWaSendingLimit(e.target.value)} />
          </Field>

          <button
            onClick={() => alert("Test WhatsApp message sent to " + values.waBusinessNumber + " (demo action).")}
            style={{
              width: "100%",
              background: "transparent",
              border: `1px solid ${GOLD}`,
              color: GOLD,
              borderRadius: 6,
              padding: "10px 14px",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <Send size={15} />
            Test WhatsApp
          </button>
        </div>

        {/* Delivery Settings */}
        <div style={{ flex: 1, border: `1px solid ${BORDER}`, borderRadius: 8, padding: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 14 }}>Delivery Settings</div>

          <PrefRow icon={MessageCircle} title="Enable SMS Notifications" desc="Send SMS notifications for important events." on={toggles.enableSms} onClick={() => toggle("enableSms")} />
          <PrefRow icon={MessageSquare} title="Enable WhatsApp Notifications" desc="Send WhatsApp notifications for updates." on={toggles.enableWhatsApp} onClick={() => toggle("enableWhatsApp")} />
          <PrefRow icon={RefreshCcw} title="Fallback to SMS" desc="If WhatsApp fails, send message via SMS." on={toggles.fallbackToSms} onClick={() => toggle("fallbackToSms")} />

          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 14, color: "#fff", marginBottom: 4 }}>Preferred Channel</div>
            <div style={{ fontSize: 12, color: TEXT_MUTED, marginBottom: 10 }}>Select default channel for notifications.</div>
            <RadioRow
              label="WhatsApp First (Recommended)"
              selected={values.preferredChannel === "whatsapp"}
              onClick={() => setters.setPreferredChannel("whatsapp")}
            />
            <RadioRow
              label="SMS First"
              selected={values.preferredChannel === "sms"}
              onClick={() => setters.setPreferredChannel("sms")}
            />
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 2 }}>Notification Preferences</div>
      <div style={{ fontSize: 12, color: TEXT_MUTED, marginBottom: 10 }}>Choose which events should trigger SMS / WhatsApp notifications.</div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 100px 100px", padding: "0 0 8px", borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ fontSize: 12, color: TEXT_MUTED, fontWeight: 600, letterSpacing: 0.5 }}>EVENT</div>
        <div style={{ fontSize: 12, color: TEXT_MUTED, fontWeight: 600, letterSpacing: 0.5, textAlign: "center" }}>SMS</div>
        <div style={{ fontSize: 12, color: TEXT_MUTED, fontWeight: 600, letterSpacing: 0.5, textAlign: "center" }}>WHATSAPP</div>
      </div>

      <EventToggleRow icon={UserPlus} title="User Registration" desc="When a new user registers" smsOn={toggles.userRegSms} waOn={toggles.userRegWa} onSms={() => toggle("userRegSms")} onWa={() => toggle("userRegWa")} />
      <EventToggleRow icon={ShieldCheck} title="Email / Mobile Verification" desc="When user verifies email or mobile" smsOn={toggles.verificationSms} waOn={toggles.verificationWa} onSms={() => toggle("verificationSms")} onWa={() => toggle("verificationWa")} />
      <EventToggleRow icon={ClipboardList} title="Casting Call Application" desc="When user applies for a casting call" smsOn={toggles.castingAppSms} waOn={toggles.castingAppWa} onSms={() => toggle("castingAppSms")} onWa={() => toggle("castingAppWa")} />
      <EventToggleRow icon={Bell} title="Application Status Update" desc="When application status is updated" smsOn={toggles.appStatusSms} waOn={toggles.appStatusWa} onSms={() => toggle("appStatusSms")} onWa={() => toggle("appStatusWa")} />
      <EventToggleRow icon={Wallet} title="Payment Confirmation" desc="When a payment is successful" smsOn={toggles.paymentSms} waOn={toggles.paymentWa} onSms={() => toggle("paymentSms")} onWa={() => toggle("paymentWa")} />
      <EventToggleRow icon={CalendarClock} title="Subscription Expiry Reminder" desc="Remind users before subscription expires" smsOn={toggles.subExpirySms} waOn={toggles.subExpiryWa} onSms={() => toggle("subExpirySms")} onWa={() => toggle("subExpiryWa")} />
    </>
  );
}

function RadioRow({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <div onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", cursor: "pointer" }}>
      <div
        style={{
          width: 16,
          height: 16,
          borderRadius: "50%",
          border: `2px solid ${selected ? GOLD : TEXT_MUTED}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {selected && <div style={{ width: 8, height: 8, borderRadius: "50%", background: GOLD }} />}
      </div>
      <span style={{ fontSize: 13, color: "#cfd3da" }}>{label}</span>
    </div>
  );
}

function SmsSystemInfo() {
  return (
    <RailCard title="SYSTEM INFORMATION" color={GOLD}>
      <InfoRow icon={MessageCircle} label="SMS Provider" value="Twilio" />
      <InfoRow icon={MessageSquare} label="WhatsApp Provider" value="360dialog" />
      <InfoRow icon={Activity} label="Account Status" badge={{ text: "Active", color: GREEN }} />
      <InfoRow icon={Smartphone} label="Last Test (SMS)" badge={{ text: "24 Jun 2026, 11:45 AM", color: GREEN }} />
      <InfoRow icon={Smartphone} label="Last Test (WhatsApp)" badge={{ text: "24 Jun 2026, 11:47 AM", color: GREEN }} />
      <InfoRow icon={ListChecks} label="Total SMS Sent (This Month)" value="3,248" />
      <InfoRow icon={ListChecks} label="Total WhatsApp Sent (This Month)" value="1,864" />
    </RailCard>
  );
}

function DualGauge({ percent, color, usedLabel, used, remaining, dailyLimit }: { percent: number; color: string; usedLabel: string; used: string; remaining: string; dailyLimit: string }) {
  const size = 110;
  const stroke = 9;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (percent / 100) * circumference;
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
          <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
            <circle cx={size / 2} cy={size / 2} r={r} stroke={BG4} strokeWidth={stroke} fill="none" />
            <circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={stroke} fill="none" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>{percent}%</div>
            <div style={{ fontSize: 10, color: TEXT_MUTED }}>{usedLabel}</div>
          </div>
        </div>
        <div style={{ fontSize: 12, flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
            <span style={{ color: "#cfd3da" }}>Used</span>
            <span style={{ marginLeft: "auto", color: "#fff" }}>{used}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#3A4150" }} />
            <span style={{ color: "#cfd3da" }}>Remaining</span>
            <span style={{ marginLeft: "auto", color: "#fff" }}>{remaining}</span>
          </div>
        </div>
      </div>
      <div style={{ fontSize: 11, color: TEXT_MUTED, marginTop: 10 }}>Daily Limit: {dailyLimit}</div>
    </div>
  );
}

function SmsUsage() {
  return (
    <>
      <RailCard title="SMS USAGE (THIS MONTH)" color={GOLD}>
        <DualGauge percent={65} color={GOLD} usedLabel="Used" used="648 SMS" remaining="352 SMS" dailyLimit="1,000 SMS" />
      </RailCard>
      <RailCard title="WHATSAPP USAGE (THIS MONTH)" color={GREEN}>
        <DualGauge percent={62} color={GREEN} usedLabel="Used" used="312 Msg" remaining="188 Msg" dailyLimit="500 Messages" />
      </RailCard>
    </>
  );
}

function SmsQuickActions({ router }: { router: ReturnType<typeof useRouter> }) {
  return (
    <RailCard title="QUICK ACTIONS" color={GOLD}>
      <ActionRow icon={MessageCircle} label="SMS Templates" onClick={() => go(router, { href: "/admin/sms-templates", built: false, label: "SMS Templates" })} />
      <ActionRow icon={MessageSquare} label="WhatsApp Templates" onClick={() => go(router, { href: "/admin/sms-templates", built: false, label: "WhatsApp Templates" })} />
      <ActionRow icon={FileSearch} label="Message Logs" onClick={() => alert('"Message Logs" page is not built yet. (404)')} />
      <ActionRow icon={BookOpen} label="Provider Documentation" onClick={() => alert('"Provider Documentation" page is not built yet. (404)')} />
    </RailCard>
  );
}

// ============== PAYMENTS TAB ==============

function StatusBadge({ status }: { status: string }) {
  const isActive = status === "Active";
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 600,
        padding: "2px 8px",
        borderRadius: 4,
        background: isActive ? `${GREEN}22` : `${RED}22`,
        color: isActive ? GREEN : RED,
      }}
    >
      {status}
    </span>
  );
}

function GatewayIcon({ type }: { type: string }) {
  const map: Record<string, { bg: string; icon: React.ElementType }> = {
    razorpay: { bg: "#0E2B5C", icon: CreditCard },
    stripe: { bg: "#5433D6", icon: CreditCard },
    paypal: { bg: "#1A3D8F", icon: Wallet },
    cashfree: { bg: "#1F2E3D", icon: Banknote },
    bank: { bg: "#2A2A2A", icon: Landmark },
  };
  const { bg, icon: Icon } = map[type] || map.bank;
  return (
    <div style={{ width: 36, height: 36, borderRadius: 8, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <Icon size={17} color="#fff" />
    </div>
  );
}

function PaymentsPanel({
  gateways,
  toggleGatewayStatus,
  currencies,
  taxes,
  refundPolicy,
  setRefundPolicy,
  disputeHandling,
  setDisputeHandling,
  autoRefund,
  setAutoRefund,
  router,
}: {
  gateways: any[];
  toggleGatewayStatus: (id: string) => void;
  currencies: any[];
  taxes: any[];
  refundPolicy: string;
  setRefundPolicy: (v: string) => void;
  disputeHandling: string;
  setDisputeHandling: (v: string) => void;
  autoRefund: boolean;
  setAutoRefund: (v: boolean) => void;
  router: ReturnType<typeof useRouter>;
}) {
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  return (
    <>
      <SectionTitle>Payment Settings</SectionTitle>
      <div style={{ fontSize: 13, color: TEXT_MUTED, marginTop: -10, marginBottom: 22 }}>
        Configure payment gateways, currencies, taxes and refund preferences.
      </div>

      {/* Payment Gateways */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 4 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Payment Gateways</div>
          <div style={{ fontSize: 12, color: TEXT_MUTED }}>Manage and configure payment gateways for platform transactions.</div>
        </div>
        <button
          onClick={() => alert("Add Gateway dialog would open here (demo action).")}
          style={{
            background: "transparent",
            border: `1px solid ${GOLD}`,
            color: GOLD,
            borderRadius: 6,
            padding: "9px 14px",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            whiteSpace: "nowrap",
          }}
        >
          <Plus size={14} />
          Add Gateway
        </button>
      </div>

      <div style={{ marginTop: 14, marginBottom: 8 }}>
        <div style={{ display: "grid", gridTemplateColumns: "2.2fr 1fr 1fr 1.2fr 0.8fr", padding: "0 0 10px", borderBottom: `1px solid ${BORDER}` }}>
          <div style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600, letterSpacing: 0.5 }}>GATEWAY</div>
          <div style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600, letterSpacing: 0.5 }}>STATUS</div>
          <div style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600, letterSpacing: 0.5 }}>MODE</div>
          <div style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600, letterSpacing: 0.5 }}>TRANSACTION FEE</div>
          <div style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600, letterSpacing: 0.5, textAlign: "right" }}>ACTIONS</div>
        </div>

        {gateways.map((g) => (
          <div
            key={g.id}
            style={{
              display: "grid",
              gridTemplateColumns: "2.2fr 1fr 1fr 1.2fr 0.8fr",
              alignItems: "center",
              padding: "13px 0",
              borderBottom: `1px solid ${BORDER}`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <GatewayIcon type={g.icon} />
              <div>
                <div style={{ fontSize: 14, color: "#fff" }}>{g.name}</div>
                <div style={{ fontSize: 12, color: TEXT_MUTED }}>{g.desc}</div>
              </div>
            </div>
            <div onClick={() => toggleGatewayStatus(g.id)} style={{ cursor: "pointer", width: "fit-content" }}>
              <StatusBadge status={g.status} />
            </div>
            <div style={{ fontSize: 13, color: "#cfd3da" }}>{g.mode}</div>
            <div style={{ fontSize: 13, color: "#cfd3da" }}>{g.fee}</div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 14, position: "relative" }}>
              <Pencil size={15} color={TEXT_MUTED} style={{ cursor: "pointer" }} onClick={() => alert(`Edit "${g.name}" gateway (demo action).`)} />
              <MoreVertical
                size={15}
                color={TEXT_MUTED}
                style={{ cursor: "pointer" }}
                onClick={() => setMenuOpenId(menuOpenId === g.id ? null : g.id)}
              />
              {menuOpenId === g.id && (
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: 22,
                    background: BG3,
                    border: `1px solid ${BORDER}`,
                    borderRadius: 6,
                    width: 160,
                    zIndex: 10,
                    boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
                  }}
                >
                  {["View Details", "Test Connection", "Remove Gateway"].map((opt) => (
                    <div
                      key={opt}
                      onClick={() => {
                        setMenuOpenId(null);
                        alert(`"${opt}" for ${g.name} (demo action).`);
                      }}
                      style={{ padding: "9px 12px", fontSize: 12, color: opt === "Remove Gateway" ? RED : "#cfd3da", cursor: "pointer" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = BG4)}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      {opt}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center", margin: "16px 0 26px" }}>
        <span
          onClick={() => alert('"View Gateway Documentation" page is not built yet. (404)')}
          style={{ fontSize: 13, color: GOLD, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}
        >
          <BookOpen size={14} />
          View Gateway Documentation
        </span>
      </div>

      {/* Currency + Tax Settings */}
      <div style={{ display: "flex", gap: 20, alignItems: "flex-start", marginBottom: 26 }}>
        <div style={{ flex: 1, border: `1px solid ${BORDER}`, borderRadius: 8, padding: 16 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Currency Settings</div>
              <div style={{ fontSize: 12, color: TEXT_MUTED }}>Manage supported currencies and exchange rates.</div>
            </div>
            <button
              onClick={() => alert("Add Currency dialog would open here (demo action).")}
              style={{ background: "transparent", border: `1px solid ${GOLD}`, color: GOLD, borderRadius: 6, padding: "7px 10px", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 5, whiteSpace: "nowrap" }}
            >
              <Plus size={12} />
              Add Currency
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.6fr 0.8fr 1.2fr 0.9fr 0.6fr", padding: "0 0 8px", borderBottom: `1px solid ${BORDER}` }}>
            <div style={{ fontSize: 10, color: TEXT_MUTED, fontWeight: 600 }}>CURRENCY</div>
            <div style={{ fontSize: 10, color: TEXT_MUTED, fontWeight: 600 }}>SYMBOL</div>
            <div style={{ fontSize: 10, color: TEXT_MUTED, fontWeight: 600 }}>COUNTRIES</div>
            <div style={{ fontSize: 10, color: TEXT_MUTED, fontWeight: 600 }}>STATUS</div>
            <div style={{ fontSize: 10, color: TEXT_MUTED, fontWeight: 600, textAlign: "right" }}>ACTIONS</div>
          </div>
          {currencies.map((c) => (
            <div key={c.symbol} style={{ display: "grid", gridTemplateColumns: "1.6fr 0.8fr 1.2fr 0.9fr 0.6fr", alignItems: "center", padding: "11px 0", borderBottom: `1px solid ${BORDER}` }}>
              <div style={{ fontSize: 13, color: "#fff" }}>{c.name}</div>
              <div style={{ fontSize: 13, color: "#cfd3da" }}>{c.symbol}</div>
              <div style={{ fontSize: 13, color: "#cfd3da" }}>{c.countries}</div>
              <div><StatusBadge status={c.status} /></div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <Pencil size={13} color={TEXT_MUTED} style={{ cursor: "pointer" }} onClick={() => alert(`Edit ${c.name} (demo action).`)} />
                <MoreVertical size={13} color={TEXT_MUTED} style={{ cursor: "pointer" }} onClick={() => alert(`More options for ${c.name} (demo action).`)} />
              </div>
            </div>
          ))}

          <div style={{ textAlign: "center", marginTop: 12 }}>
            <span
              onClick={() => alert('"Manage Exchange Rates" page is not built yet. (404)')}
              style={{ fontSize: 12, color: GOLD, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 5 }}
            >
              <RefreshCw size={12} />
              Manage Exchange Rates
            </span>
          </div>
        </div>

        <div style={{ flex: 1, border: `1px solid ${BORDER}`, borderRadius: 8, padding: 16 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Tax Settings</div>
              <div style={{ fontSize: 12, color: TEXT_MUTED }}>Configure tax rates for different regions.</div>
            </div>
            <button
              onClick={() => alert("Add Tax dialog would open here (demo action).")}
              style={{ background: "transparent", border: `1px solid ${GOLD}`, color: GOLD, borderRadius: 6, padding: "7px 10px", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 5, whiteSpace: "nowrap" }}
            >
              <Plus size={12} />
              Add Tax
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 0.8fr 1.3fr 0.9fr", padding: "0 0 8px", borderBottom: `1px solid ${BORDER}` }}>
            <div style={{ fontSize: 10, color: TEXT_MUTED, fontWeight: 600 }}>TAX NAME</div>
            <div style={{ fontSize: 10, color: TEXT_MUTED, fontWeight: 600 }}>RATE (%)</div>
            <div style={{ fontSize: 10, color: TEXT_MUTED, fontWeight: 600 }}>APPLICABLE TO</div>
            <div style={{ fontSize: 10, color: TEXT_MUTED, fontWeight: 600 }}>STATUS</div>
          </div>
          {taxes.map((t) => (
            <div key={t.name} style={{ display: "grid", gridTemplateColumns: "1fr 0.8fr 1.3fr 0.9fr", alignItems: "center", padding: "11px 0", borderBottom: `1px solid ${BORDER}` }}>
              <div style={{ fontSize: 13, color: "#fff" }}>{t.name}</div>
              <div style={{ fontSize: 13, color: "#cfd3da" }}>{t.rate}</div>
              <div style={{ fontSize: 13, color: "#cfd3da" }}>{t.applicableTo}</div>
              <div><StatusBadge status={t.status} /></div>
            </div>
          ))}

          <div style={{ textAlign: "center", marginTop: 12 }}>
            <span
              onClick={() => alert('"Tax Documentation" page is not built yet. (404)')}
              style={{ fontSize: 12, color: GOLD, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 5 }}
            >
              <BookOpen size={12} />
              Tax Documentation
            </span>
          </div>
        </div>
      </div>

      {/* Refund & Dispute Settings */}
      <div style={{ border: `1px solid ${BORDER}`, borderRadius: 8, padding: 18 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Refund & Dispute Settings</div>
        <div style={{ fontSize: 12, color: TEXT_MUTED, marginBottom: 16 }}>Configure refund policy and dispute handling preferences.</div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 24px" }}>
          <Field label="Refund Policy" hint="Users can request refund within 7 days of payment.">
            <select style={inputStyle} value={refundPolicy} onChange={(e) => setRefundPolicy(e.target.value)}>
              <option>Standard Refund Policy</option>
              <option>Strict Refund Policy</option>
              <option>Flexible Refund Policy</option>
              <option>No Refunds</option>
            </select>
          </Field>

          <div>
            <label style={{ fontSize: 13, color: "#cfd3da", display: "block", marginBottom: 6 }}>Auto Refund</label>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 11 }}>
              <ToggleSwitch on={autoRefund} onClick={() => setAutoRefund(!autoRefund)} />
            </div>
            <div style={{ fontSize: 12, color: TEXT_MUTED, marginTop: 5 }}>Automatically approve eligible refund requests.</div>
          </div>

          <Field label="Dispute Handling" hint="All disputes will be reviewed manually by admin.">
            <select style={inputStyle} value={disputeHandling} onChange={(e) => setDisputeHandling(e.target.value)}>
              <option>Manual Review</option>
              <option>Auto Resolve</option>
              <option>Escalate to Payment Provider</option>
            </select>
          </Field>
        </div>
      </div>
    </>
  );
}

function PaymentSystemInfo() {
  return (
    <RailCard title="SYSTEM INFORMATION" color={GOLD}>
      <InfoRow icon={Banknote} label="Default Currency" value="INR (₹)" />
      <InfoRow icon={Globe} label="Currency Countries" value="3 Enabled" />
      <InfoRow icon={Percent} label="Tax (GST) Status" value="18% Enabled" />
      <InfoRow icon={CheckCircle2} label="Auto Capture" badge={{ text: "Enabled", color: GREEN }} />
      <InfoRow icon={Receipt} label="Invoice Generation" badge={{ text: "Enabled", color: GREEN }} />
      <InfoRow icon={CreditCard} label="Payment Approval" badge={{ text: "Automatic", color: GREEN }} />
      <InfoRow icon={RotateCcw} label="Refund Approval" badge={{ text: "Manual", color: ORANGE }} />
      <InfoRow icon={ShieldCheck} label="PCI DSS Compliance" badge={{ text: "Compliant", color: GREEN }} />
    </RailCard>
  );
}

function Donut({ segments, centerValue, centerLabel }: { segments: { value: number; color: string }[]; centerValue: string; centerLabel: string }) {
  const size = 140;
  const stroke = 16;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const total = segments.reduce((a, s) => a + s.value, 0) || 1;
  let cumulative = 0;
  return (
    <div style={{ position: "relative", width: size, height: size, margin: "0 auto" }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        {segments.map((s, i) => {
          const frac = s.value / total;
          const dash = frac * circumference;
          const gap = circumference - dash;
          const rotation = (cumulative / total) * 360;
          cumulative += s.value;
          return (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={r}
              stroke={s.color}
              strokeWidth={stroke}
              fill="none"
              strokeDasharray={`${dash} ${gap}`}
              strokeLinecap="butt"
              style={{ transform: `rotate(${rotation}deg)`, transformOrigin: "50% 50%" }}
            />
          );
        })}
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: "#fff" }}>{centerValue}</div>
        <div style={{ fontSize: 11, color: TEXT_MUTED }}>{centerLabel}</div>
      </div>
    </div>
  );
}

function PaymentOverview({ router }: { router: ReturnType<typeof useRouter> }) {
  return (
    <RailCard title="PAYMENT OVERVIEW (THIS MONTH)" color={GOLD}>
      <div style={{ fontSize: 12, color: TEXT_MUTED, marginBottom: 4 }}>Total Revenue</div>
      <div style={{ fontSize: 24, fontWeight: 700, color: "#fff", marginBottom: 4 }}>₹24,58,760.00</div>
      <div style={{ fontSize: 12, color: GREEN, display: "flex", alignItems: "center", gap: 4, marginBottom: 16 }}>
        <TrendingUp size={13} />
        18.6% vs last month
      </div>

      <Donut
        segments={[
          { value: 1102, color: GREEN },
          { value: 86, color: GOLD },
          { value: 60, color: RED },
        ]}
        centerValue="1,248"
        centerLabel="Transactions"
      />

      <div style={{ marginTop: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: "#cfd3da" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: GREEN }} />
            Successful
          </div>
          <div style={{ fontSize: 12, textAlign: "right" }}>
            <div style={{ color: "#fff" }}>1,102 (88.3%)</div>
            <div style={{ color: TEXT_MUTED }}>₹21,67,840.00</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: "#cfd3da" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: GOLD }} />
            Pending
          </div>
          <div style={{ fontSize: 12, textAlign: "right" }}>
            <div style={{ color: "#fff" }}>86 (6.9%)</div>
            <div style={{ color: TEXT_MUTED }}>₹1,34,560.00</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: "#cfd3da" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: RED }} />
            Failed
          </div>
          <div style={{ fontSize: 12, textAlign: "right" }}>
            <div style={{ color: "#fff" }}>60 (4.8%)</div>
            <div style={{ color: TEXT_MUTED }}>₹56,360.00</div>
          </div>
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: 14 }}>
        <span
          onClick={() => router.push("/admin/analytics")}
          style={{ fontSize: 13, color: GOLD, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}
        >
          <FileBarChart size={14} />
          View Payment Reports
        </span>
      </div>
    </RailCard>
  );
}

function PaymentQuickActions({ router }: { router: ReturnType<typeof useRouter> }) {
  return (
    <RailCard title="QUICK ACTIONS" color={GOLD}>
      <ActionRow icon={RotateCcw} label="Manage Refund Requests" onClick={() => alert('"Manage Refund Requests" page is not built yet. (404)')} />
      <ActionRow icon={ListOrdered} label="View Transactions" onClick={() => alert('"View Transactions" page is not built yet. (404)')} />
      <ActionRow icon={FileBarChart} label="Download Payout Reports" onClick={() => alert("Payout report download started (demo action).")} />
      <ActionRow icon={FileSearch} label="Payment Gateway Logs" onClick={() => alert('"Payment Gateway Logs" page is not built yet. (404)')} />
      <ActionRow icon={Receipt} label="Tax Report" onClick={() => alert("Tax report download started (demo action).")} />
    </RailCard>
  );
}

// ============== SECURITY TAB ==============

function PasswordPolicyChip({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
      <CheckCircle2 size={16} color={GREEN} style={{ marginTop: 2, flexShrink: 0 }} />
      <div>
        <div style={{ fontSize: 13, color: "#fff" }}>{label}</div>
        <div style={{ fontSize: 12, color: TEXT_MUTED }}>{value}</div>
      </div>
    </div>
  );
}

function LoginSecurityRow({
  icon: Icon,
  title,
  desc,
  control,
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
  control: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 0",
        borderBottom: `1px solid ${BORDER}`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Icon size={18} color={TEXT_MUTED} />
        <div>
          <div style={{ fontSize: 14, color: "#fff" }}>{title}</div>
          <div style={{ fontSize: 12, color: TEXT_MUTED }}>{desc}</div>
        </div>
      </div>
      {control}
    </div>
  );
}

function MiniSelect({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        background: BG3,
        border: `1px solid ${BORDER}`,
        borderRadius: 6,
        padding: "8px 10px",
        fontSize: 13,
        color: "#fff",
        fontFamily: BARLOW,
        outline: "none",
        minWidth: 150,
      }}
    >
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  );
}

function SecurityPanel({
  twoFaEnabled,
  setTwoFaEnabled,
  loginAttemptLimit,
  setLoginAttemptLimit,
  lockoutDuration,
  setLockoutDuration,
  activeSessionsPolicy,
  rememberDevice,
  setRememberDevice,
  sessionTimeout,
  setSessionTimeout,
  passwordPolicy,
  whitelistedIps,
  blockedIps,
  router,
}: {
  twoFaEnabled: boolean;
  setTwoFaEnabled: (v: boolean) => void;
  loginAttemptLimit: string;
  setLoginAttemptLimit: (v: string) => void;
  lockoutDuration: string;
  setLockoutDuration: (v: string) => void;
  activeSessionsPolicy: string;
  rememberDevice: boolean;
  setRememberDevice: (v: boolean) => void;
  sessionTimeout: string;
  setSessionTimeout: (v: string) => void;
  passwordPolicy: { label: string; value: string }[];
  whitelistedIps: string[];
  blockedIps: string[];
  router: ReturnType<typeof useRouter>;
}) {
  return (
    <>
      <SectionTitle>Security Settings</SectionTitle>
      <div style={{ fontSize: 13, color: TEXT_MUTED, marginTop: -10, marginBottom: 22 }}>
        Manage security preferences, access controls and authentication settings.
      </div>

      {/* Two-Factor Authentication */}
      <div style={{ display: "flex", gap: 20, border: `1px solid ${BORDER}`, borderRadius: 8, padding: 18, marginBottom: 22 }}>
        <div style={{ flex: 1, display: "flex", gap: 14 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 10,
              background: BG3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Smartphone size={26} color={GOLD} />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Two-Factor Authentication (2FA)</div>
            <div style={{ fontSize: 12, color: TEXT_MUTED, marginBottom: 8 }}>Add an extra layer of security to your admin account.</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: "#cfd3da" }}>2FA Status</span>
              <StatusBadge status={twoFaEnabled ? "Active" : "Inactive"} />
            </div>
            <div style={{ fontSize: 12, color: TEXT_MUTED, marginBottom: 12 }}>
              You will be asked for a verification code in addition to your password when signing in.
            </div>
            <button
              onClick={() => alert("Manage 2FA Settings dialog would open here (demo action).")}
              style={{
                background: "transparent",
                border: `1px solid ${GOLD}`,
                color: GOLD,
                borderRadius: 6,
                padding: "9px 14px",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 7,
              }}
            >
              <SettingsIcon size={14} />
              Manage 2FA Settings
            </button>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, color: "#fff", marginBottom: 10 }}>Active 2FA Method</div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: BG3,
              border: `1px solid ${BORDER}`,
              borderRadius: 8,
              padding: "12px 14px",
              marginBottom: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Shield size={18} color={GOLD} />
              <div>
                <div style={{ fontSize: 13, color: "#fff" }}>Authenticator App</div>
                <div style={{ fontSize: 11, color: TEXT_MUTED }}>Added on 24 May 2026, 10:15 AM</div>
              </div>
            </div>
            <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 4, background: `${GREEN}22`, color: GREEN }}>
              Primary
            </span>
          </div>
          <button
            onClick={() => alert("Add Backup Method dialog would open here (demo action).")}
            style={{
              width: "100%",
              background: "transparent",
              border: `1px solid ${GOLD}`,
              color: GOLD,
              borderRadius: 6,
              padding: "10px 14px",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 7,
            }}
          >
            <Plus size={14} />
            Add Backup Method
          </button>
        </div>
      </div>

      {/* Password Policy */}
      <div style={{ border: `1px solid ${BORDER}`, borderRadius: 8, padding: 18, marginBottom: 22 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Password Policy</div>
            <div style={{ fontSize: 12, color: TEXT_MUTED }}>Configure password rules for all user accounts.</div>
          </div>
          <button
            onClick={() => alert("Edit Password Policy dialog would open here (demo action).")}
            style={{
              background: "transparent",
              border: `1px solid ${GOLD}`,
              color: GOLD,
              borderRadius: 6,
              padding: "9px 14px",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 7,
              whiteSpace: "nowrap",
            }}
          >
            <Pencil size={13} />
            Edit Policy
          </button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 14 }}>
          {passwordPolicy.map((p) => (
            <PasswordPolicyChip key={p.label} label={p.label} value={p.value} />
          ))}
        </div>
      </div>

      {/* Login Security */}
      <div style={{ border: `1px solid ${BORDER}`, borderRadius: 8, padding: 18, marginBottom: 22 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Login Security</div>
        <div style={{ fontSize: 12, color: TEXT_MUTED, marginBottom: 8 }}>Manage login attempts, sessions and login restrictions.</div>

        <LoginSecurityRow
          icon={LogIn}
          title="Login Attempt Limit"
          desc="Limit the number of failed login attempts before account is locked."
          control={<MiniSelect value={loginAttemptLimit} onChange={setLoginAttemptLimit} options={["3 Attempts", "5 Attempts", "10 Attempts"]} />}
        />
        <LoginSecurityRow
          icon={Timer}
          title="Account Lockout Duration"
          desc="Duration for which account will be locked after maximum attempts."
          control={<MiniSelect value={lockoutDuration} onChange={setLockoutDuration} options={["15 Minutes", "30 Minutes", "1 Hour"]} />}
        />
        <LoginSecurityRow
          icon={MonitorSmartphone}
          title="Active Sessions"
          desc="Manage concurrent sessions for admin accounts."
          control={
            <span
              onClick={() => alert('"View Active Sessions" page is not built yet. (404)')}
              style={{
                fontSize: 13,
                color: "#cfd3da",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: BG3,
                border: `1px solid ${BORDER}`,
                borderRadius: 6,
                padding: "8px 12px",
              }}
            >
              {activeSessionsPolicy}
              <ChevronLeft size={13} style={{ transform: "rotate(180deg)" }} />
            </span>
          }
        />
        <LoginSecurityRow
          icon={KeyRound}
          title="Remember Device"
          desc="Allow trusted devices to bypass 2FA for 30 days."
          control={<ToggleSwitch on={rememberDevice} onClick={() => setRememberDevice(!rememberDevice)} />}
        />
        <div style={{ borderBottom: "none" }}>
          <LoginSecurityRow
            icon={Timer}
            title="Session Timeout"
            desc="Automatically logout inactive sessions."
            control={<MiniSelect value={sessionTimeout} onChange={setSessionTimeout} options={["15 Minutes", "30 Minutes", "1 Hour", "Never"]} />}
          />
        </div>
      </div>

      {/* IP Access Control */}
      <div style={{ border: `1px solid ${BORDER}`, borderRadius: 8, padding: 18 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 4 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>IP Access Control</div>
            <div style={{ fontSize: 12, color: TEXT_MUTED }}>Restrict access to the admin panel by IP address.</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 13, color: "#cfd3da" }}>IP Access Status</span>
            <StatusBadge status="Active" />
          </div>
        </div>

        <div style={{ display: "flex", gap: 16, marginTop: 16, alignItems: "stretch" }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", background: BG3, border: `1px solid ${BORDER}`, borderRadius: 8, padding: 14 }}>
            <div>
              <div style={{ fontSize: 13, color: "#fff", marginBottom: 6 }}>Whitelisted IPs ({whitelistedIps.length})</div>
              {whitelistedIps.map((ip) => (
                <div key={ip} style={{ fontSize: 12, color: TEXT_MUTED }}>{ip}</div>
              ))}
            </div>
            <Shield size={22} color={GREEN} />
          </div>
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", background: BG3, border: `1px solid ${BORDER}`, borderRadius: 8, padding: 14 }}>
            <div>
              <div style={{ fontSize: 13, color: "#fff", marginBottom: 6 }}>Blocked IPs ({blockedIps.length})</div>
              {blockedIps.map((ip) => (
                <div key={ip} style={{ fontSize: 12, color: TEXT_MUTED }}>{ip}</div>
              ))}
            </div>
            <ShieldBan size={22} color={RED} />
          </div>
          <button
            onClick={() => alert('"Manage IP Access" page is not built yet. (404)')}
            style={{
              background: "transparent",
              border: `1px solid ${GOLD}`,
              color: GOLD,
              borderRadius: 6,
              padding: "0 18px",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 7,
              whiteSpace: "nowrap",
            }}
          >
            <SettingsIcon size={14} />
            Manage IP Access
          </button>
        </div>
      </div>
    </>
  );
}

function SecurityOverview() {
  const items = [
    { label: "Two-Factor Authentication", value: "Enabled" },
    { label: "Strong Password Policy", value: "Enforced" },
    { label: "Login Attempt Protection", value: "Active" },
    { label: "IP Access Control", value: "Active" },
    { label: "Account Monitoring", value: "Active" },
  ];
  return (
    <RailCard title="SECURITY OVERVIEW" color={GOLD}>
      <div style={{ position: "relative", width: 130, height: 130, margin: "0 auto 14px" }}>
        <svg width={130} height={130} style={{ position: "absolute", inset: 0 }}>
          <circle cx={65} cy={65} r={58} stroke={`${GREEN}33`} strokeWidth={3} fill="none" />
          <circle cx={65} cy={65} r={46} stroke={`${GREEN}55`} strokeWidth={3} fill="none" />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: `${GREEN}1A`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ShieldCheck size={30} color={GREEN} />
          </div>
        </div>
      </div>
      <div style={{ textAlign: "center", color: GREEN, fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Your system is secure</div>
      <div style={{ textAlign: "center", color: TEXT_MUTED, fontSize: 12, marginBottom: 16 }}>
        All security measures are active and up to date.
      </div>
      {items.map((it) => (
        <div key={it.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#cfd3da" }}>
            <CheckCircle2 size={14} color={GREEN} />
            {it.label}
          </div>
          <span style={{ fontSize: 12, color: GREEN }}>{it.value}</span>
        </div>
      ))}
    </RailCard>
  );
}

function ActivityRow({
  icon: Icon,
  iconColor,
  title,
  desc,
  date,
  dotColor,
}: {
  icon: React.ElementType;
  iconColor: string;
  title: string;
  desc: string;
  date: string;
  dotColor: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 0", borderBottom: `1px solid ${BORDER}` }}>
      <div
        style={{
          width: 30,
          height: 30,
          borderRadius: 8,
          background: `${iconColor}22`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={14} color={iconColor} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, color: "#fff" }}>{title}</div>
        <div style={{ fontSize: 11, color: TEXT_MUTED }}>{desc}</div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: 10, color: TEXT_MUTED, whiteSpace: "nowrap" }}>{date}</div>
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: dotColor, marginLeft: "auto", marginTop: 4 }} />
      </div>
    </div>
  );
}

function RecentSecurityActivity({ router }: { router: ReturnType<typeof useRouter> }) {
  return (
    <RailCard title="RECENT SECURITY ACTIVITY" color={GOLD}>
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: -36, marginBottom: 14 }}>
        <span onClick={() => router.push("/admin/audit-logs")} style={{ fontSize: 12, color: "#cfd3da", cursor: "pointer", border: `1px solid ${BORDER}`, borderRadius: 6, padding: "4px 10px" }}>
          View All
        </span>
      </div>
      <ActivityRow icon={LogIn} iconColor={GREEN} title="Admin login successful" desc="superadmin@screens.com" date="24 May 2026 10:22 AM" dotColor={GREEN} />
      <ActivityRow icon={KeyRound} iconColor={BLUE} title="Password changed" desc="superadmin@screens.com" date="24 May 2026 09:45 AM" dotColor={GREEN} />
      <ActivityRow icon={Shield} iconColor={BLUE} title="2FA method added" desc="Authenticator App" date="24 May 2026 09:40 AM" dotColor={GREEN} />
      <ActivityRow icon={XCircle} iconColor={RED} title="Failed login attempt" desc="IP: 45.77.12.33" date="24 May 2026 08:15 AM" dotColor={RED} />
      <ActivityRow icon={MonitorSmartphone} iconColor={TEXT_MUTED} title="New device login" desc="Chrome on Windows" date="24 May 2026 07:58 AM" dotColor={GREEN} />
    </RailCard>
  );
}

function SecurityQuickActions({ router }: { router: ReturnType<typeof useRouter> }) {
  return (
    <RailCard title="QUICK ACTIONS" color={GOLD}>
      <ActionRow icon={MonitorSmartphone} label="View Active Sessions" onClick={() => alert('"View Active Sessions" page is not built yet. (404)')} />
      <ActionRow icon={KeyRound} label="Reset Admin Password" onClick={() => alert("Reset Admin Password flow would start here (demo action).")} />
      <ActionRow icon={FileBarChart} label="Download Login Logs" onClick={() => alert("Login logs download started (demo action).")} />
      <ActionRow icon={ShieldAlert} label="Security Alerts Settings" onClick={() => alert('"Security Alerts Settings" page is not built yet. (404)')} />
    </RailCard>
  );
}

// ============== NOTIFICATIONS TAB ==============

function ChannelCard({
  icon: Icon,
  iconBg,
  title,
  desc,
  enabled,
  onClick,
}: {
  icon: React.ElementType;
  iconBg: string;
  title: string;
  desc: string;
  enabled: boolean;
  onClick: () => void;
}) {
  return (
    <div style={{ flex: 1, border: `1px solid ${BORDER}`, borderRadius: 8, padding: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: 8, background: iconBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={16} color="#fff" />
        </div>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{title}</div>
      </div>
      <div style={{ fontSize: 12, color: TEXT_MUTED, marginBottom: 12, minHeight: 32 }}>{desc}</div>
      <div onClick={onClick} style={{ cursor: "pointer", width: "fit-content" }}>
        <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 4, background: enabled ? `${GREEN}22` : `${RED}22`, color: enabled ? GREEN : RED, display: "inline-flex", alignItems: "center", gap: 4 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: enabled ? GREEN : RED }} />
          {enabled ? "Enabled" : "Disabled"}
        </span>
      </div>
    </div>
  );
}

const MODULE_COLORS: Record<string, string> = {
  User: PURPLE,
  Casting: BLUE,
  Application: GREEN,
  Payment: TEAL,
  Subscription: ORANGE,
};

function EventCheckbox({ checked, onClick }: { checked: boolean; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      style={{
        width: 18,
        height: 18,
        borderRadius: 4,
        border: `1.5px solid ${checked ? GOLD : BORDER}`,
        background: checked ? GOLD : "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        margin: "0 auto",
      }}
    >
      {checked && <CheckCircle2 size={13} color={BG} style={{ marginTop: -1 }} />}
    </div>
  );
}

function NotificationsPanel({
  channelToggles,
  toggleChannel,
  moduleFilter,
  setModuleFilter,
  eventSearch,
  setEventSearch,
  notificationEvents,
  toggleEventChannel,
  router,
}: {
  channelToggles: any;
  toggleChannel: (k: any) => void;
  moduleFilter: string;
  setModuleFilter: (v: string) => void;
  eventSearch: string;
  setEventSearch: (v: string) => void;
  notificationEvents: any[];
  toggleEventChannel: (id: string, channel: "inApp" | "email" | "sms" | "whatsapp") => void;
  router: ReturnType<typeof useRouter>;
}) {
  const modules = ["All Modules", "User", "Casting", "Application", "Payment", "Subscription"];
  const [notifPage, setNotifPage] = useState(1);

  const filtered = notificationEvents.filter((e) => {
    const matchesModule = moduleFilter === "All Modules" || e.module === moduleFilter;
    const matchesSearch = e.name.toLowerCase().includes(eventSearch.toLowerCase());
    return matchesModule && matchesSearch;
  });

  return (
    <>
      <SectionTitle>Notification Settings</SectionTitle>
      <div style={{ fontSize: 13, color: TEXT_MUTED, marginTop: -10, marginBottom: 22 }}>
        Manage how and when notifications are sent to users across the platform.
      </div>

      {/* Notification Channels */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Notification Channels</div>
        <div style={{ fontSize: 12, color: TEXT_MUTED, marginBottom: 14 }}>Enable or disable notification channels globally.</div>
        <div style={{ display: "flex", gap: 16 }}>
          <ChannelCard icon={Bell} iconBg={ORANGE} title="In-App Notifications" desc="Send notifications within the platform." enabled={channelToggles.inApp} onClick={() => toggleChannel("inApp")} />
          <ChannelCard icon={Mail} iconBg={BLUE} title="Email Notifications" desc="Send notifications via email." enabled={channelToggles.email} onClick={() => toggleChannel("email")} />
          <ChannelCard icon={MessageCircle} iconBg={PURPLE} title="SMS Notifications" desc="Send notifications via SMS." enabled={channelToggles.sms} onClick={() => toggleChannel("sms")} />
          <ChannelCard icon={MessageSquare} iconBg={GREEN} title="WhatsApp Notifications" desc="Send notifications via WhatsApp." enabled={channelToggles.whatsapp} onClick={() => toggleChannel("whatsapp")} />
        </div>
      </div>

      {/* Notification Events */}
      <div style={{ marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 4 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Notification Events</div>
            <div style={{ fontSize: 12, color: TEXT_MUTED }}>Configure which events trigger notifications and to whom.</div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <select style={{ ...inputStyle, width: 150, padding: "8px 10px" }} value={moduleFilter} onChange={(e) => setModuleFilter(e.target.value)}>
              {modules.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
            <div style={{ position: "relative" }}>
              <Search size={14} color={TEXT_MUTED} style={{ position: "absolute", left: 10, top: 11 }} />
              <input
                style={{ ...inputStyle, width: 180, padding: "8px 10px 8px 32px" }}
                placeholder="Search events..."
                value={eventSearch}
                onChange={(e) => setEventSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div style={{ marginTop: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.8fr 0.8fr 2.2fr 0.6fr 0.6fr 0.6fr 0.8fr 0.7fr", padding: "0 0 10px", borderBottom: `1px solid ${BORDER}` }}>
            <div style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600 }}>EVENT</div>
            <div style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600 }}>MODULE</div>
            <div style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600 }}>DESCRIPTION</div>
            <div style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600, textAlign: "center" }}>IN-APP</div>
            <div style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600, textAlign: "center" }}>EMAIL</div>
            <div style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600, textAlign: "center" }}>SMS</div>
            <div style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600, textAlign: "center" }}>WHATSAPP</div>
            <div style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600, textAlign: "right" }}>ACTION</div>
          </div>

          {filtered.map((e) => (
            <div key={e.id} style={{ display: "grid", gridTemplateColumns: "1.8fr 0.8fr 2.2fr 0.6fr 0.6fr 0.6fr 0.8fr 0.7fr", alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${BORDER}` }}>
              <div style={{ fontSize: 13, color: "#fff" }}>{e.name}</div>
              <div>
                <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 4, background: `${MODULE_COLORS[e.module]}22`, color: MODULE_COLORS[e.module] }}>
                  {e.module}
                </span>
              </div>
              <div style={{ fontSize: 12, color: TEXT_MUTED }}>{e.desc}</div>
              <EventCheckbox checked={e.inApp} onClick={() => toggleEventChannel(e.id, "inApp")} />
              <EventCheckbox checked={e.email} onClick={() => toggleEventChannel(e.id, "email")} />
              <EventCheckbox checked={e.sms} onClick={() => toggleEventChannel(e.id, "sms")} />
              <EventCheckbox checked={e.whatsapp} onClick={() => toggleEventChannel(e.id, "whatsapp")} />
              <div style={{ textAlign: "right" }}>
                <span
                  onClick={() => alert(`Edit "${e.name}" notification event (demo action).`)}
                  style={{ fontSize: 12, color: GOLD, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4 }}
                >
                  <Pencil size={12} />
                  Edit
                </span>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div style={{ padding: "30px 0", textAlign: "center", color: TEXT_MUTED, fontSize: 13 }}>No events match your filters.</div>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16 }}>
          <div style={{ fontSize: 12, color: TEXT_MUTED }}>Showing 1 to {filtered.length} of 32 events</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <ChevronLeft size={16} color={TEXT_MUTED} style={{ cursor: "pointer" }} onClick={() => setNotifPage((p) => Math.max(1, p - 1))} />
            {[1, 2, 3, 4].map((p) => (
              <div
                key={p}
                onClick={() => setNotifPage(p)}
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 6,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  cursor: "pointer",
                  background: p === notifPage ? GOLD : "transparent",
                  color: p === notifPage ? BG : "#cfd3da",
                  border: p === notifPage ? "none" : `1px solid ${BORDER}`,
                }}
              >
                {p}
              </div>
            ))}
            <ChevronRight size={16} color={TEXT_MUTED} style={{ cursor: "pointer" }} onClick={() => setNotifPage((p) => Math.min(4, p + 1))} />
          </div>
        </div>
      </div>

      {/* Notification Templates */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", border: `1px solid ${BORDER}`, borderRadius: 8, padding: "16px 18px", marginTop: 22 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Notification Templates</div>
          <div style={{ fontSize: 12, color: TEXT_MUTED }}>Manage and customize notification templates for each channel.</div>
        </div>
        <button
          onClick={() => alert('"Manage Templates" page is not built yet. (404)')}
          style={{
            background: GOLD,
            color: BG,
            border: "none",
            borderRadius: 6,
            padding: "10px 16px",
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <FileBox size={15} />
          Manage Templates
        </button>
      </div>
    </>
  );
}

function NotificationOverview() {
  return (
    <RailCard title="NOTIFICATION OVERVIEW" color={GOLD}>
      <Donut
        segments={[
          { value: 128, color: GREEN },
          { value: 118, color: BLUE },
          { value: 64, color: GOLD },
          { value: 52, color: TEAL },
        ]}
        centerValue="128"
        centerLabel="Total Active"
      />
      <div style={{ marginTop: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "5px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: "#cfd3da" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: GREEN }} />
            In-App
          </div>
          <span style={{ fontSize: 12, color: "#fff" }}>128</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "5px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: "#cfd3da" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: BLUE }} />
            Email
          </div>
          <span style={{ fontSize: 12, color: "#fff" }}>118</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "5px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: "#cfd3da" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: GOLD }} />
            SMS
          </div>
          <span style={{ fontSize: 12, color: "#fff" }}>64</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "5px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: "#cfd3da" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: TEAL }} />
            WhatsApp
          </div>
          <span style={{ fontSize: 12, color: "#fff" }}>52</span>
        </div>
      </div>
      <div style={{ borderTop: `1px solid ${BORDER}`, marginTop: 14, paddingTop: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: 13 }}>
          <span style={{ color: "#cfd3da" }}>Total Events</span>
          <span style={{ color: "#fff" }}>32</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: 13 }}>
          <span style={{ color: "#cfd3da" }}>Disabled Events</span>
          <span style={{ color: "#fff" }}>4</span>
        </div>
      </div>
    </RailCard>
  );
}

function QuietHours({
  enabled,
  setEnabled,
  start,
  setStart,
  end,
  setEnd,
  timezone,
  setTimezone,
}: {
  enabled: boolean;
  setEnabled: (v: boolean) => void;
  start: string;
  setStart: (v: string) => void;
  end: string;
  setEnd: (v: string) => void;
  timezone: string;
  setTimezone: (v: string) => void;
}) {
  return (
    <div style={{ background: BG2, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 18 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
        <h3 style={{ fontFamily: BARLOW, fontWeight: 700, fontSize: 15, color: GOLD, margin: 0, letterSpacing: 0.5 }}>QUIET HOURS</h3>
        <ToggleSwitch on={enabled} onClick={() => setEnabled(!enabled)} />
      </div>
      <div style={{ fontSize: 12, color: TEXT_MUTED, marginBottom: 14 }}>Set quiet hours to pause non-urgent notifications.</div>

      <Field label="Start Time">
        <div style={{ position: "relative" }}>
          <input style={{ ...inputStyle, paddingRight: 34 }} value={start} onChange={(ev) => setStart(ev.target.value)} />
          <Clock size={15} color={TEXT_MUTED} style={{ position: "absolute", right: 10, top: 12 }} />
        </div>
      </Field>
      <Field label="End Time">
        <div style={{ position: "relative" }}>
          <input style={{ ...inputStyle, paddingRight: 34 }} value={end} onChange={(ev) => setEnd(ev.target.value)} />
          <Clock size={15} color={TEXT_MUTED} style={{ position: "absolute", right: 10, top: 12 }} />
        </div>
      </Field>
      <Field label="Time Zone">
        <select style={inputStyle} value={timezone} onChange={(e) => setTimezone(e.target.value)}>
          <option>(GMT+05:30) Asia/Kolkata</option>
          <option>(GMT+00:00) UTC</option>
          <option>(GMT-05:00) America/New_York</option>
        </select>
      </Field>
      <div style={{ fontSize: 11, color: TEXT_MUTED }}>Quiet hours will not apply to critical alerts.</div>
    </div>
  );
}

function NotificationQuickActions({ router }: { router: ReturnType<typeof useRouter> }) {
  return (
    <RailCard title="QUICK ACTIONS" color={GOLD}>
      <ActionRow icon={Plus} label="Create New Notification" onClick={() => alert("Create New Notification dialog would open here (demo action).")} />
      <ActionRow icon={FileBox} label="Manage Templates" onClick={() => alert('"Manage Templates" page is not built yet. (404)')} />
      <ActionRow icon={FileSearch} label="Notification Logs" onClick={() => alert('"Notification Logs" page is not built yet. (404)')} />
      <ActionRow icon={PlayCircle} label="Test Notifications" onClick={() => alert("Test notification sent (demo action).")} />
      <ActionRow icon={SlidersHorizontal} label="Channel Configuration" onClick={() => alert('"Channel Configuration" page is not built yet. (404)')} />
    </RailCard>
  );
}

// ============== LOCALIZATION TAB ==============

const LOCALIZATION_SUBTABS = [
  { key: "languages", label: "Languages" },
  { key: "regions", label: "Countries & Regions" },
  { key: "currencies", label: "Currencies" },
  { key: "datetime", label: "Date & Time" },
  { key: "format", label: "Number & Format" },
];

function LocalizationPanel(props: any) {
  const { subTab, setSubTab, languages, toggleLanguageStatus, defaultPlatformLanguage, setDefaultPlatformLanguage, allowLanguageChange, setAllowLanguageChange, browserLangDetection, setBrowserLangDetection, regions, toggleRegionStatus, localizationCurrencies, toggleCurrencyStatus, globalDateFormat, setGlobalDateFormat, globalTimeFormat, setGlobalTimeFormat, firstDayOfWeek, setFirstDayOfWeek, defaultTimezoneDisplay, setDefaultTimezoneDisplay, autoDST, setAutoDST, decimalSeparator, setDecimalSeparator, thousandsSeparator, setThousandsSeparator, decimalPlaces, setDecimalPlaces, measurementUnit, setMeasurementUnit, phoneNumberFormat, setPhoneNumberFormat } = props;

  return (
    <>
      <SectionTitle>Localization Settings</SectionTitle>
      <div style={{ fontSize: 13, color: TEXT_MUTED, marginTop: -10, marginBottom: 18 }}>
        Manage languages, regions, currencies, and date/time formats for the platform.
      </div>

      {/* Sub tabs */}
      <div style={{ display: "flex", gap: 22, borderBottom: `1px solid ${BORDER}`, marginBottom: 22 }}>
        {LOCALIZATION_SUBTABS.map((t) => {
          const active = subTab === t.key;
          return (
            <div
              key={t.key}
              onClick={() => setSubTab(t.key)}
              style={{
                paddingBottom: 10,
                fontSize: 14,
                cursor: "pointer",
                color: active ? GOLD : "#cfd3da",
                borderBottom: active ? `2px solid ${GOLD}` : "2px solid transparent",
                fontWeight: active ? 600 : 400,
              }}
            >
              {t.label}
            </div>
          );
        })}
      </div>

      {subTab === "languages" && (
        <LanguagesSubPanel
          languages={languages}
          toggleLanguageStatus={toggleLanguageStatus}
          defaultPlatformLanguage={defaultPlatformLanguage}
          setDefaultPlatformLanguage={setDefaultPlatformLanguage}
          allowLanguageChange={allowLanguageChange}
          setAllowLanguageChange={setAllowLanguageChange}
          browserLangDetection={browserLangDetection}
          setBrowserLangDetection={setBrowserLangDetection}
        />
      )}
      {subTab === "regions" && <RegionsSubPanel regions={regions} toggleRegionStatus={toggleRegionStatus} />}
      {subTab === "currencies" && <CurrenciesSubPanel currencies={localizationCurrencies} toggleCurrencyStatus={toggleCurrencyStatus} />}
      {subTab === "datetime" && (
        <DateTimeSubPanel
          globalDateFormat={globalDateFormat}
          setGlobalDateFormat={setGlobalDateFormat}
          globalTimeFormat={globalTimeFormat}
          setGlobalTimeFormat={setGlobalTimeFormat}
          firstDayOfWeek={firstDayOfWeek}
          setFirstDayOfWeek={setFirstDayOfWeek}
          defaultTimezoneDisplay={defaultTimezoneDisplay}
          setDefaultTimezoneDisplay={setDefaultTimezoneDisplay}
          autoDST={autoDST}
          setAutoDST={setAutoDST}
        />
      )}
      {subTab === "format" && (
        <NumberFormatSubPanel
          decimalSeparator={decimalSeparator}
          setDecimalSeparator={setDecimalSeparator}
          thousandsSeparator={thousandsSeparator}
          setThousandsSeparator={setThousandsSeparator}
          decimalPlaces={decimalPlaces}
          setDecimalPlaces={setDecimalPlaces}
          measurementUnit={measurementUnit}
          setMeasurementUnit={setMeasurementUnit}
          phoneNumberFormat={phoneNumberFormat}
          setPhoneNumberFormat={setPhoneNumberFormat}
        />
      )}
    </>
  );
}

function LanguagesSubPanel({
  languages,
  toggleLanguageStatus,
  defaultPlatformLanguage,
  setDefaultPlatformLanguage,
  allowLanguageChange,
  setAllowLanguageChange,
  browserLangDetection,
  setBrowserLangDetection,
}: {
  languages: any[];
  toggleLanguageStatus: (id: string) => void;
  defaultPlatformLanguage: string;
  setDefaultPlatformLanguage: (v: string) => void;
  allowLanguageChange: boolean;
  setAllowLanguageChange: (v: boolean) => void;
  browserLangDetection: boolean;
  setBrowserLangDetection: (v: boolean) => void;
}) {
  const [langPage, setLangPage] = useState(1);
  return (
    <>
      {/* Platform Languages */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 4 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Platform Languages</div>
          <div style={{ fontSize: 12, color: TEXT_MUTED }}>Add and manage languages available on the platform.</div>
        </div>
        <button
          onClick={() => alert("Add Language dialog would open here (demo action).")}
          style={{
            background: "transparent",
            border: `1px solid ${GOLD}`,
            color: GOLD,
            borderRadius: 6,
            padding: "9px 14px",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            whiteSpace: "nowrap",
          }}
        >
          <Plus size={14} />
          Add Language
        </button>
      </div>

      <div style={{ marginTop: 14, marginBottom: 8 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.2fr 0.8fr 0.8fr 0.9fr 0.8fr 0.8fr", padding: "0 0 10px", borderBottom: `1px solid ${BORDER}` }}>
          <div style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600 }}>LANGUAGE</div>
          <div style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600 }}>NATIVE NAME</div>
          <div style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600 }}>CODE</div>
          <div style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600 }}>DIRECTION</div>
          <div style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600 }}>STATUS</div>
          <div style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600 }}>DEFAULT</div>
          <div style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600, textAlign: "right" }}>ACTIONS</div>
        </div>

        {languages.map((l) => (
          <div key={l.id} style={{ display: "grid", gridTemplateColumns: "1.2fr 1.2fr 0.8fr 0.8fr 0.9fr 0.8fr 0.8fr", alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${BORDER}` }}>
            <div style={{ fontSize: 13, color: "#fff" }}>{l.name}</div>
            <div style={{ fontSize: 13, color: "#cfd3da" }}>{l.native}</div>
            <div style={{ fontSize: 13, color: "#cfd3da" }}>{l.code}</div>
            <div style={{ fontSize: 13, color: "#cfd3da" }}>{l.direction}</div>
            <div onClick={() => toggleLanguageStatus(l.id)} style={{ cursor: "pointer", width: "fit-content" }}>
              <StatusBadge status={l.status} />
            </div>
            <div>
              {l.isDefault ? (
                <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 4, background: `${GOLD}22`, color: GOLD }}>Default</span>
              ) : (
                <span style={{ fontSize: 13, color: TEXT_MUTED }}>–</span>
              )}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
              <Pencil size={14} color={TEXT_MUTED} style={{ cursor: "pointer" }} onClick={() => alert(`Edit "${l.name}" language (demo action).`)} />
              <MoreVertical size={14} color={TEXT_MUTED} style={{ cursor: "pointer" }} onClick={() => alert(`More options for ${l.name} (demo action).`)} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 26 }}>
        <div style={{ fontSize: 12, color: TEXT_MUTED }}>Showing 1 to {languages.length} of 8 languages</div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <ChevronLeft size={16} color={TEXT_MUTED} style={{ cursor: "pointer" }} onClick={() => setLangPage((p) => Math.max(1, p - 1))} />
          {[1, 2].map((p) => (
            <div
              key={p}
              onClick={() => setLangPage(p)}
              style={{
                width: 26,
                height: 26,
                borderRadius: 6,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                cursor: "pointer",
                background: p === langPage ? GOLD : "transparent",
                color: p === langPage ? BG : "#cfd3da",
                border: p === langPage ? "none" : `1px solid ${BORDER}`,
              }}
            >
              {p}
            </div>
          ))}
          <ChevronRight size={16} color={TEXT_MUTED} style={{ cursor: "pointer" }} onClick={() => setLangPage((p) => Math.min(2, p + 1))} />
        </div>
      </div>

      {/* Default Language Settings + Language Translations */}
      <div style={{ display: "flex", gap: 20, alignItems: "stretch" }}>
        <div style={{ flex: 1, border: `1px solid ${BORDER}`, borderRadius: 8, padding: 18 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Default Language Settings</div>
          <div style={{ fontSize: 12, color: TEXT_MUTED, marginBottom: 16 }}>Configure default language behavior for users.</div>

          <LoginSecurityRow
            icon={LanguagesIcon}
            title="Default Platform Language"
            desc="Language used for guest users and new registrations."
            control={
              <select style={{ ...inputStyle, width: 160, padding: "8px 10px" }} value={defaultPlatformLanguage} onChange={(e) => setDefaultPlatformLanguage(e.target.value)}>
                <option>English (en)</option>
                <option>Hindi (hi)</option>
                <option>Tamil (ta)</option>
                <option>Telugu (te)</option>
              </select>
            }
          />
          <LoginSecurityRow
            icon={SlidersHorizontal}
            title="Allow Users to Change Language"
            desc="Let users select their preferred language."
            control={<ToggleSwitch on={allowLanguageChange} onClick={() => setAllowLanguageChange(!allowLanguageChange)} />}
          />
          <div style={{ borderBottom: "none" }}>
            <LoginSecurityRow
              icon={Globe}
              title="Browser Language Detection"
              desc="Automatically detect and set language based on browser."
              control={<ToggleSwitch on={browserLangDetection} onClick={() => setBrowserLangDetection(!browserLangDetection)} />}
            />
          </div>
        </div>

        <div style={{ flex: 1, border: `1px solid ${BORDER}`, borderRadius: 8, padding: 18, display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Language Translations</div>
          <div style={{ fontSize: 12, color: TEXT_MUTED, marginBottom: 16 }}>Manage translations for UI content and system messages.</div>

          <InfoRow icon={ListChecks} label="Total Translation Keys" value="1,245" />
          <InfoRow icon={CheckCircle2} label="Translated Keys" value="1,102" />
          <InfoRow icon={AlertTriangle} label="Pending Translations" value="143" />

          <div style={{ marginTop: 10, marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: TEXT_MUTED, marginBottom: 6 }}>
              <span>Completion Progress</span>
              <span style={{ color: "#fff" }}>88%</span>
            </div>
            <div style={{ height: 7, background: BG4, borderRadius: 4, overflow: "hidden" }}>
              <div style={{ width: "88%", height: "100%", background: GOLD }} />
            </div>
          </div>

          <button
            onClick={() => alert('"Manage Translations" page is not built yet. (404)')}
            style={{
              marginTop: "auto",
              width: "100%",
              background: "transparent",
              border: `1px solid ${GOLD}`,
              color: GOLD,
              borderRadius: 6,
              padding: "10px 14px",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 7,
            }}
          >
            <SettingsIcon size={14} />
            Manage Translations
          </button>
        </div>
      </div>
    </>
  );
}

function LocalizationOverview() {
  return (
    <RailCard title="LOCALIZATION OVERVIEW" color={GOLD}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            width: 70,
            height: 70,
            borderRadius: "50%",
            border: `4px solid ${GOLD}55`,
            borderTopColor: GOLD,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Globe size={28} color={GOLD} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "3px 0" }}>
            <span style={{ fontSize: 13, color: "#cfd3da" }}>Languages</span>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 13, color: "#fff" }}>8</div>
            </div>
          </div>
          <div style={{ fontSize: 11, color: GREEN, textAlign: "right", marginTop: -4, marginBottom: 6 }}>Active</div>
        </div>
      </div>
      <div style={{ marginTop: 6 }}>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
          <span style={{ fontSize: 13, color: "#cfd3da" }}>Countries/Regions</span>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 13, color: "#fff" }}>196</div>
            <div style={{ fontSize: 11, color: GREEN }}>Enabled</div>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
          <span style={{ fontSize: 13, color: "#cfd3da" }}>Currencies</span>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 13, color: "#fff" }}>12</div>
            <div style={{ fontSize: 11, color: GREEN }}>Enabled</div>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
          <span style={{ fontSize: 13, color: "#cfd3da" }}>Date Formats</span>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 13, color: "#fff" }}>6</div>
            <div style={{ fontSize: 11, color: GREEN }}>Configured</div>
          </div>
        </div>
      </div>
    </RailCard>
  );
}

function LocaleFlag({ country }: { country: "us" | "in" }) {
  if (country === "us") {
    return (
      <div style={{ width: 26, height: 18, borderRadius: 3, background: "linear-gradient(180deg,#B22234 0 16.6%,#fff 16.6% 33.2%,#B22234 33.2% 49.8%,#fff 49.8% 66.4%,#B22234 66.4% 83%,#fff 83% 100%)", position: "relative", overflow: "hidden", flexShrink: 0 }}>
        <div style={{ position: "absolute", top: 0, left: 0, width: "40%", height: "55%", background: "#3C3B6E" }} />
      </div>
    );
  }
  return (
    <div style={{ width: 26, height: 18, borderRadius: 3, overflow: "hidden", flexShrink: 0, display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, background: "#FF9933" }} />
      <div style={{ flex: 1, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", border: "1px solid #000080" }} />
      </div>
      <div style={{ flex: 1, background: "#138808" }} />
    </div>
  );
}

function ActiveLocales({ router }: { router: ReturnType<typeof useRouter> }) {
  return (
    <RailCard title="ACTIVE LOCALES" color={GOLD}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <LocaleFlag country="us" />
          <div>
            <div style={{ fontSize: 13, color: "#fff" }}>English (en)</div>
            <div style={{ fontSize: 11, color: TEXT_MUTED }}>United States</div>
          </div>
        </div>
        <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 4, background: `${GOLD}22`, color: GOLD }}>Default</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: `1px solid ${BORDER}` }}>
        <LocaleFlag country="in" />
        <div>
          <div style={{ fontSize: 13, color: "#fff" }}>Hindi (hi)</div>
          <div style={{ fontSize: 11, color: TEXT_MUTED }}>India</div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0" }}>
        <LocaleFlag country="in" />
        <div>
          <div style={{ fontSize: 13, color: "#fff" }}>Tamil (ta)</div>
          <div style={{ fontSize: 11, color: TEXT_MUTED }}>India</div>
        </div>
      </div>

      <button
        onClick={() => alert('"Manage Locales" page is not built yet. (404)')}
        style={{
          width: "100%",
          marginTop: 14,
          background: "transparent",
          border: `1px solid ${GOLD}`,
          color: GOLD,
          borderRadius: 6,
          padding: "10px 14px",
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 7,
        }}
      >
        <Globe size={14} />
        Manage Locales
      </button>
    </RailCard>
  );
}

function LocalizationQuickActions({ router }: { router: ReturnType<typeof useRouter> }) {
  return (
    <RailCard title="QUICK ACTIONS" color={GOLD}>
      <ActionRow icon={Plus} label="Add New Language" onClick={() => alert("Add New Language dialog would open here (demo action).")} />
      <ActionRow icon={FileBox} label="Manage Translations" onClick={() => alert('"Manage Translations" page is not built yet. (404)')} />
      <ActionRow icon={Upload} label="Import Translations" onClick={() => alert("Import Translations dialog would open here (demo action).")} />
      <ActionRow icon={Download} label="Export Translations" onClick={() => alert("Translations export started (demo action).")} />
      <ActionRow icon={FileBarChart} label="Language Usage Report" onClick={() => alert("Language usage report download started (demo action).")} />
    </RailCard>
  );
}

// ============== LOCALIZATION: REGIONS / CURRENCIES / DATETIME / FORMAT ==============

function RegionsSubPanel({ regions, toggleRegionStatus }: { regions: any[]; toggleRegionStatus: (id: string) => void }) {
  return (
    <>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 4 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Countries & Regions</div>
          <div style={{ fontSize: 12, color: TEXT_MUTED }}>Manage which countries and regions can access the platform.</div>
        </div>
        <button
          onClick={() => alert("Add Region dialog would open here (demo action).")}
          style={{ background: "transparent", border: `1px solid ${GOLD}`, color: GOLD, borderRadius: 6, padding: "9px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}
        >
          <Plus size={14} />
          Add Region
        </button>
      </div>

      <div style={{ marginTop: 14 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 0.7fr 1.2fr 0.8fr 0.9fr 0.8fr 0.7fr", padding: "0 0 10px", borderBottom: `1px solid ${BORDER}` }}>
          <div style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600 }}>COUNTRY</div>
          <div style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600 }}>CODE</div>
          <div style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600 }}>REGION</div>
          <div style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600 }}>CURRENCY</div>
          <div style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600 }}>STATUS</div>
          <div style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600 }}>PRIMARY</div>
          <div style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600, textAlign: "right" }}>ACTIONS</div>
        </div>

        {regions.map((r) => (
          <div key={r.id} style={{ display: "grid", gridTemplateColumns: "1.4fr 0.7fr 1.2fr 0.8fr 0.9fr 0.8fr 0.7fr", alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${BORDER}` }}>
            <div style={{ fontSize: 13, color: "#fff" }}>{r.name}</div>
            <div style={{ fontSize: 13, color: "#cfd3da" }}>{r.code}</div>
            <div style={{ fontSize: 13, color: "#cfd3da" }}>{r.region}</div>
            <div style={{ fontSize: 13, color: "#cfd3da" }}>{r.currency}</div>
            <div onClick={() => toggleRegionStatus(r.id)} style={{ cursor: "pointer", width: "fit-content" }}>
              <StatusBadge status={r.status} />
            </div>
            <div>
              {r.primary ? (
                <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 4, background: `${GOLD}22`, color: GOLD }}>Primary</span>
              ) : (
                <span style={{ fontSize: 13, color: TEXT_MUTED }}>–</span>
              )}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
              <Pencil size={14} color={TEXT_MUTED} style={{ cursor: "pointer" }} onClick={() => alert(`Edit "${r.name}" region (demo action).`)} />
              <MoreVertical size={14} color={TEXT_MUTED} style={{ cursor: "pointer" }} onClick={() => alert(`More options for ${r.name} (demo action).`)} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 22, border: `1px solid ${BORDER}`, borderRadius: 8, padding: 18, display: "flex", alignItems: "flex-start", gap: 10, background: "rgba(59,130,246,0.06)" }}>
        <Info size={16} color={BLUE} style={{ marginTop: 2, flexShrink: 0 }} />
        <div style={{ fontSize: 13, color: "#9DC2FB" }}>
          Inactive regions will be hidden from signup and casting call location filters, but existing users from those regions will not be affected.
        </div>
      </div>
    </>
  );
}

function CurrenciesSubPanel({ currencies, toggleCurrencyStatus }: { currencies: any[]; toggleCurrencyStatus: (id: string) => void }) {
  return (
    <>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 4 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Display Currencies</div>
          <div style={{ fontSize: 12, color: TEXT_MUTED }}>Manage currencies shown to users based on their region, with live conversion rates.</div>
        </div>
        <button
          onClick={() => alert("Add Currency dialog would open here (demo action).")}
          style={{ background: "transparent", border: `1px solid ${GOLD}`, color: GOLD, borderRadius: 6, padding: "9px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}
        >
          <Plus size={14} />
          Add Currency
        </button>
      </div>

      <div style={{ marginTop: 14 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 0.7fr 0.7fr 1fr 0.9fr 0.8fr 0.7fr", padding: "0 0 10px", borderBottom: `1px solid ${BORDER}` }}>
          <div style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600 }}>CURRENCY</div>
          <div style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600 }}>SYMBOL</div>
          <div style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600 }}>CODE</div>
          <div style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600 }}>RATE (vs INR)</div>
          <div style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600 }}>STATUS</div>
          <div style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600 }}>DEFAULT</div>
          <div style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600, textAlign: "right" }}>ACTIONS</div>
        </div>

        {currencies.map((c) => (
          <div key={c.id} style={{ display: "grid", gridTemplateColumns: "1.4fr 0.7fr 0.7fr 1fr 0.9fr 0.8fr 0.7fr", alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${BORDER}` }}>
            <div style={{ fontSize: 13, color: "#fff" }}>{c.name}</div>
            <div style={{ fontSize: 13, color: "#cfd3da" }}>{c.symbol}</div>
            <div style={{ fontSize: 13, color: "#cfd3da" }}>{c.code}</div>
            <div style={{ fontSize: 13, color: "#cfd3da" }}>{c.rate}</div>
            <div onClick={() => toggleCurrencyStatus(c.id)} style={{ cursor: "pointer", width: "fit-content" }}>
              <StatusBadge status={c.status} />
            </div>
            <div>
              {c.isDefault ? (
                <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 4, background: `${GOLD}22`, color: GOLD }}>Default</span>
              ) : (
                <span style={{ fontSize: 13, color: TEXT_MUTED }}>–</span>
              )}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
              <Pencil size={14} color={TEXT_MUTED} style={{ cursor: "pointer" }} onClick={() => alert(`Edit "${c.name}" currency (demo action).`)} />
              <MoreVertical size={14} color={TEXT_MUTED} style={{ cursor: "pointer" }} onClick={() => alert(`More options for ${c.name} (demo action).`)} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center", marginTop: 16 }}>
        <span
          onClick={() => alert("Exchange rates would refresh from a live FX provider here (demo action).")}
          style={{ fontSize: 13, color: GOLD, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}
        >
          <RefreshCw size={14} />
          Refresh Exchange Rates
        </span>
      </div>
    </>
  );
}

function DateTimeSubPanel({
  globalDateFormat,
  setGlobalDateFormat,
  globalTimeFormat,
  setGlobalTimeFormat,
  firstDayOfWeek,
  setFirstDayOfWeek,
  defaultTimezoneDisplay,
  setDefaultTimezoneDisplay,
  autoDST,
  setAutoDST,
}: any) {
  return (
    <>
      <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Date & Time Formats</div>
      <div style={{ fontSize: 12, color: TEXT_MUTED, marginBottom: 18 }}>Configure how dates and times are displayed across the platform.</div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 28px", marginBottom: 22 }}>
        <Field label="Default Date Format" hint="Used in tables, calendars and notifications.">
          <select style={inputStyle} value={globalDateFormat} onChange={(e) => setGlobalDateFormat(e.target.value)}>
            <option>DD MMM YYYY (24 Jun 2026)</option>
            <option>MM/DD/YYYY</option>
            <option>DD/MM/YYYY</option>
            <option>YYYY-MM-DD</option>
          </select>
        </Field>
        <Field label="Default Time Format" hint="Used across dashboards and audit logs.">
          <select style={inputStyle} value={globalTimeFormat} onChange={(e) => setGlobalTimeFormat(e.target.value)}>
            <option>12 Hour (AM/PM)</option>
            <option>24 Hour</option>
          </select>
        </Field>
        <Field label="First Day of Week" hint="Used in calendar and scheduling views.">
          <select style={inputStyle} value={firstDayOfWeek} onChange={(e) => setFirstDayOfWeek(e.target.value)}>
            <option>Sunday</option>
            <option>Monday</option>
          </select>
        </Field>
        <Field label="Default Timezone Display" hint="How timestamps are shown to users.">
          <select style={inputStyle} value={defaultTimezoneDisplay} onChange={(e) => setDefaultTimezoneDisplay(e.target.value)}>
            <option>User's Local Timezone</option>
            <option>Platform Default (Asia/Kolkata)</option>
            <option>UTC</option>
          </select>
        </Field>
      </div>

      <div style={{ border: `1px solid ${BORDER}`, borderRadius: 8, padding: 18 }}>
        <PrefRow icon={CalendarDays} title="Automatic Daylight Saving Adjustment" desc="Automatically adjust displayed times for daylight saving time where applicable." on={autoDST} onClick={() => setAutoDST(!autoDST)} />
      </div>

      <div style={{ marginTop: 22, border: `1px solid ${BORDER}`, borderRadius: 8, padding: 18 }}>
        <div style={{ fontSize: 14, color: "#fff", marginBottom: 10 }}>Preview</div>
        <div style={{ fontSize: 13, color: "#cfd3da" }}>
          Casting call deadline:&nbsp;
          <span style={{ color: GOLD }}>
            {globalDateFormat.split(" (")[0] === "DD MMM YYYY" ? "30 Jun 2026" : globalDateFormat.includes("MM/DD") ? "06/30/2026" : globalDateFormat.includes("DD/MM") ? "30/06/2026" : "2026-06-30"}
          </span>
          ,&nbsp;
          <span style={{ color: GOLD }}>{globalTimeFormat === "12 Hour (AM/PM)" ? "06:30 PM" : "18:30"}</span>
        </div>
      </div>
    </>
  );
}

function NumberFormatSubPanel({
  decimalSeparator,
  setDecimalSeparator,
  thousandsSeparator,
  setThousandsSeparator,
  decimalPlaces,
  setDecimalPlaces,
  measurementUnit,
  setMeasurementUnit,
  phoneNumberFormat,
  setPhoneNumberFormat,
}: any) {
  const sample = (() => {
    const thousands = thousandsSeparator.includes("Comma") ? "," : thousandsSeparator.includes("Period") ? "." : " ";
    const decimal = decimalSeparator.includes("Period") ? "." : ",";
    const places = decimalPlaces === "0" ? "" : decimal + "0".repeat(Number(decimalPlaces));
    return `1${thousands}24,567${places}`;
  })();

  return (
    <>
      <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Number & Format Settings</div>
      <div style={{ fontSize: 12, color: TEXT_MUTED, marginBottom: 18 }}>Configure how numbers, currency amounts and phone numbers are displayed.</div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 28px", marginBottom: 22 }}>
        <Field label="Decimal Separator">
          <select style={inputStyle} value={decimalSeparator} onChange={(e) => setDecimalSeparator(e.target.value)}>
            <option>Period (.)</option>
            <option>Comma (,)</option>
          </select>
        </Field>
        <Field label="Thousands Separator">
          <select style={inputStyle} value={thousandsSeparator} onChange={(e) => setThousandsSeparator(e.target.value)}>
            <option>Comma (,)</option>
            <option>Period (.)</option>
            <option>Space ( )</option>
          </select>
        </Field>
        <Field label="Decimal Places" hint="Used for currency and statistic displays.">
          <select style={inputStyle} value={decimalPlaces} onChange={(e) => setDecimalPlaces(e.target.value)}>
            <option>0</option>
            <option>1</option>
            <option>2</option>
          </select>
        </Field>
        <Field label="Measurement Unit" hint="Used for height/weight fields on talent profiles.">
          <select style={inputStyle} value={measurementUnit} onChange={(e) => setMeasurementUnit(e.target.value)}>
            <option>Metric (cm, kg)</option>
            <option>Imperial (ft/in, lbs)</option>
          </select>
        </Field>
        <Field label="Phone Number Format" hint="Used for display in profiles and notifications.">
          <select style={inputStyle} value={phoneNumberFormat} onChange={(e) => setPhoneNumberFormat(e.target.value)}>
            <option>International (+91 98765 43210)</option>
            <option>National (098765 43210)</option>
            <option>Compact (9876543210)</option>
          </select>
        </Field>
      </div>

      <div style={{ border: `1px solid ${BORDER}`, borderRadius: 8, padding: 18 }}>
        <div style={{ fontSize: 14, color: "#fff", marginBottom: 10 }}>Preview</div>
        <div style={{ fontSize: 13, color: "#cfd3da" }}>
          Subscription revenue this month: <span style={{ color: GOLD }}>₹{sample}</span>
        </div>
        <div style={{ fontSize: 13, color: "#cfd3da", marginTop: 6 }}>
          Support phone: <span style={{ color: GOLD }}>{phoneNumberFormat.match(/\(([^)]+)\)/)?.[1] || "+91 98765 43210"}</span>
        </div>
      </div>
    </>
  );
}

// ============== INTEGRATIONS TAB ==============

const INTEGRATION_ICON_MAP: Record<string, React.ElementType> = {
  email: Mail,
  sms: MessageCircle,
  razorpay: TrendingUp,
  stripe: CreditCard,
  analytics: BarChart3,
  storage: Database,
  media: Cloud,
  social: Share2,
};

const INTEGRATION_FILTERS = ["All Integrations", "Communication", "Payments", "Analytics", "Storage", "Social", "Other"];

const INTEGRATION_FILTER_MAP: Record<string, string[]> = {
  Communication: ["Email", "SMS / Voice"],
  Payments: ["Payments"],
  Analytics: ["Analytics"],
  Storage: ["Storage", "Media"],
  Social: ["Social"],
};

function IntegrationCard({ integration, onToggle, router }: { integration: any; onToggle: () => void; router: ReturnType<typeof useRouter> }) {
  const Icon = INTEGRATION_ICON_MAP[integration.icon] || Plug;
  const connected = integration.status === "Connected";
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{ border: `1px solid ${BORDER}`, borderRadius: 8, padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div style={{ width: 44, height: 44, borderRadius: 10, background: integration.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon size={20} color="#fff" />
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{integration.name}</div>
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              padding: "2px 8px",
              borderRadius: 4,
              background: `${PURPLE}22`,
              color: PURPLE,
              display: "inline-block",
              marginTop: 4,
            }}
          >
            {integration.category}
          </span>
        </div>
      </div>

      <div style={{ fontSize: 12, color: TEXT_MUTED, minHeight: 32 }}>{integration.desc}</div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 12, color: TEXT_MUTED }}>Status</span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <ToggleSwitch on={connected} onClick={onToggle} />
          <span style={{ fontSize: 13, color: connected ? GREEN : TEXT_MUTED }}>{connected ? "Connected" : "Disconnected"}</span>
        </div>
      </div>

      <div style={{ fontSize: 11, color: TEXT_MUTED }}>Last Synced: {integration.lastSynced}</div>

      <div style={{ display: "flex", gap: 8, position: "relative" }}>
        {connected ? (
          <button
            onClick={() => alert(`Configure "${integration.name}" (demo action).`)}
            style={{ flex: 1, background: BG3, border: `1px solid ${BORDER}`, color: "#cfd3da", borderRadius: 6, padding: "9px 12px", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
          >
            <SettingsIcon size={13} />
            Configure
          </button>
        ) : (
          <button
            onClick={onToggle}
            style={{ flex: 1, background: GOLD, border: "none", color: BG, borderRadius: 6, padding: "9px 12px", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
          >
            <SettingsIcon size={13} />
            Connect
          </button>
        )}
        <div
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ width: 36, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${BORDER}`, borderRadius: 6, cursor: "pointer" }}
        >
          <MoreVertical size={15} color={TEXT_MUTED} />
        </div>
        {menuOpen && (
          <div
            style={{
              position: "absolute",
              right: 0,
              top: 40,
              background: BG3,
              border: `1px solid ${BORDER}`,
              borderRadius: 6,
              width: 170,
              zIndex: 10,
              boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
            }}
          >
            {["View Logs", "Test Connection", connected ? "Disconnect" : "Remove"].map((opt) => (
              <div
                key={opt}
                onClick={() => {
                  setMenuOpen(false);
                  if (opt === "Disconnect") onToggle();
                  else alert(`"${opt}" for ${integration.name} (demo action).`);
                }}
                style={{ padding: "9px 12px", fontSize: 12, color: opt === "Disconnect" || opt === "Remove" ? RED : "#cfd3da", cursor: "pointer" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = BG4)}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                {opt}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function IntegrationsPanel({
  integrations,
  toggleIntegration,
  filter,
  setFilter,
  search,
  setSearch,
  router,
}: {
  integrations: any[];
  toggleIntegration: (id: string) => void;
  filter: string;
  setFilter: (v: string) => void;
  search: string;
  setSearch: (v: string) => void;
  router: ReturnType<typeof useRouter>;
}) {
  const filtered = integrations.filter((i) => {
    const matchesFilter = filter === "All Integrations" || (INTEGRATION_FILTER_MAP[filter] || []).includes(i.category);
    const matchesSearch = i.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalCalls = 124560;
  const successCalls = 106784;
  const failedCalls = 17776;
  const usedPercent = 68;

  const totalWebhooks = 24;
  const successWebhooks = 21;
  const failedWebhooks = 3;

  return (
    <>
      <SectionTitle>Integrations</SectionTitle>
      <div style={{ fontSize: 13, color: TEXT_MUTED, marginTop: -10, marginBottom: 18 }}>
        Connect and manage third-party services and tools.
      </div>

      {/* Filter tabs + search + add */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {INTEGRATION_FILTERS.map((f) => {
            const active = filter === f;
            return (
              <div
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: "8px 14px",
                  borderRadius: 6,
                  fontSize: 13,
                  cursor: "pointer",
                  background: active ? `${GOLD}22` : "transparent",
                  border: active ? `1px solid ${GOLD}` : `1px solid ${BORDER}`,
                  color: active ? GOLD : "#cfd3da",
                  whiteSpace: "nowrap",
                }}
              >
                {f}
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ position: "relative" }}>
            <Search size={14} color={TEXT_MUTED} style={{ position: "absolute", left: 10, top: 11 }} />
            <input
              style={{ ...inputStyle, width: 200, padding: "8px 10px 8px 32px" }}
              placeholder="Search integrations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            onClick={() => alert("Add Integration dialog would open here (demo action).")}
            style={{ background: "transparent", border: `1px solid ${GOLD}`, color: GOLD, borderRadius: 6, padding: "9px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}
          >
            <Plus size={14} />
            Add Integration
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 14, marginBottom: 26 }}>
        {filtered.map((i) => (
          <IntegrationCard key={i.id} integration={i} onToggle={() => toggleIntegration(i.id)} router={router} />
        ))}
        {filtered.length === 0 && (
          <div style={{ gridColumn: "1 / -1", padding: "30px 0", textAlign: "center", color: TEXT_MUTED, fontSize: 13 }}>
            No integrations match your filters.
          </div>
        )}
      </div>

      {/* API Usage Overview + Webhook Status */}
      <div style={{ display: "flex", gap: 20, alignItems: "stretch" }}>
        <div style={{ flex: 1, border: `1px solid ${BORDER}`, borderRadius: 8, padding: 18 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>API Usage Overview</div>
          <div style={{ fontSize: 12, color: TEXT_MUTED, marginBottom: 16 }}>Monitor your API calls and usage limits.</div>

          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <CircularProgress percent={usedPercent} label="Used" />
            <div style={{ flex: 1 }}>
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 11, color: TEXT_MUTED }}>Total Calls (This Month)</div>
                <div style={{ fontSize: 16, color: "#fff", fontWeight: 700 }}>{totalCalls.toLocaleString()}</div>
              </div>
              <div style={{ display: "flex", gap: 20, marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 11, color: TEXT_MUTED }}>Successful</div>
                  <div style={{ fontSize: 14, color: GREEN, fontWeight: 700 }}>{successCalls.toLocaleString()}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: TEXT_MUTED }}>Failed</div>
                  <div style={{ fontSize: 14, color: RED, fontWeight: 700 }}>{failedCalls.toLocaleString()}</div>
                </div>
              </div>
              <div style={{ fontSize: 11, color: TEXT_MUTED }}>Remaining Limit</div>
              <div style={{ fontSize: 13, color: "#cfd3da" }}>58,240 / 1,80,000</div>
            </div>
          </div>

          <button
            onClick={() => alert('"View API Logs" page is not built yet. (404)')}
            style={{ width: "100%", marginTop: 16, background: "transparent", border: `1px solid ${GOLD}`, color: GOLD, borderRadius: 6, padding: "10px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}
          >
            <FileSearch size={14} />
            View API Logs
          </button>
        </div>

        <div style={{ flex: 1, border: `1px solid ${BORDER}`, borderRadius: 8, padding: 18, position: "relative", overflow: "hidden" }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Webhook Status</div>
          <div style={{ fontSize: 12, color: TEXT_MUTED, marginBottom: 16 }}>Monitor webhook deliveries and health.</div>

          <div style={{ display: "flex", gap: 24, marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 11, color: TEXT_MUTED, display: "flex", alignItems: "center", gap: 5 }}>
                <Webhook size={12} />
                Total Webhooks
              </div>
              <div style={{ fontSize: 18, color: "#fff", fontWeight: 700 }}>{totalWebhooks}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: TEXT_MUTED }}>Successful</div>
              <div style={{ fontSize: 14, color: GREEN, fontWeight: 700 }}>
                {successWebhooks} ({Math.round((successWebhooks / totalWebhooks) * 100)}%)
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: TEXT_MUTED }}>Failed</div>
              <div style={{ fontSize: 14, color: RED, fontWeight: 700 }}>
                {failedWebhooks} ({Math.round((failedWebhooks / totalWebhooks) * 100)}%)
              </div>
            </div>
          </div>

          <div style={{ fontSize: 11, color: TEXT_MUTED }}>Last 24 Hours</div>
          <div style={{ fontSize: 16, color: "#fff", fontWeight: 700, marginBottom: 16 }}>42 Deliveries</div>

          <button
            onClick={() => alert('"Manage Webhooks" page is not built yet. (404)')}
            style={{ background: "transparent", border: `1px solid ${GOLD}`, color: GOLD, borderRadius: 6, padding: "9px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 7 }}
          >
            <SettingsIcon size={13} />
            Manage Webhooks
          </button>

          <Globe size={120} color={GOLD} style={{ position: "absolute", right: -20, bottom: -30, opacity: 0.08 }} />
        </div>
      </div>
    </>
  );
}

function IntegrationsOverview({ integrations }: { integrations: any[] }) {
  const connected = integrations.filter((i) => i.status === "Connected").length;
  const disconnected = integrations.length - connected;
  const available = 2;
  const total = integrations.length;
  return (
    <RailCard title="INTEGRATION OVERVIEW" color={GOLD}>
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <Donut
          segments={[
            { value: connected, color: GREEN },
            { value: available, color: BLUE },
            { value: disconnected, color: RED },
          ]}
          centerValue={`${total}`}
          centerLabel="Total"
        />
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "5px 0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: "#cfd3da" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: GREEN }} />
              Connected
            </div>
            <span style={{ fontSize: 13, color: "#fff" }}>{connected}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "5px 0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: "#cfd3da" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: BLUE }} />
              Available
            </div>
            <span style={{ fontSize: 13, color: "#fff" }}>{available}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "5px 0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: "#cfd3da" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: RED }} />
              Disconnected
            </div>
            <span style={{ fontSize: 13, color: "#fff" }}>{disconnected}</span>
          </div>
        </div>
      </div>
    </RailCard>
  );
}

function RecentActivityCard({ activity, router }: { activity: any[]; router: ReturnType<typeof useRouter> }) {
  return (
    <RailCard title="RECENT ACTIVITY" color={GOLD}>
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: -36, marginBottom: 14 }}>
        <span onClick={() => router.push("/admin/audit-logs")} style={{ fontSize: 12, color: "#cfd3da", cursor: "pointer", border: `1px solid ${BORDER}`, borderRadius: 6, padding: "4px 10px" }}>
          View All
        </span>
      </div>
      {activity.map((a: any) => (
        <div key={a.id} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 0", borderBottom: `1px solid ${BORDER}` }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: `${a.color}22`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Plug size={14} color={a.color} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: "#fff" }}>{a.text}</div>
            <div style={{ fontSize: 11, color: TEXT_MUTED }}>{a.date}</div>
          </div>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: a.color, marginTop: 4, flexShrink: 0 }} />
        </div>
      ))}
    </RailCard>
  );
}

function IntegrationsQuickActions({ router }: { router: ReturnType<typeof useRouter> }) {
  return (
    <RailCard title="QUICK ACTIONS" color={GOLD}>
      <ActionRow icon={Plus} label="Add New Integration" onClick={() => alert("Add New Integration dialog would open here (demo action).")} />
      <ActionRow icon={Key} label="Manage API Keys" onClick={() => alert('"Manage API Keys" page is not built yet. (404)')} />
      <ActionRow icon={Webhook} label="Webhook Endpoints" onClick={() => alert('"Webhook Endpoints" page is not built yet. (404)')} />
      <ActionRow icon={PlayCircle} label="Test Integrations" onClick={() => alert("Running test connections for all integrations (demo action).")} />
      <ActionRow icon={FileSearch} label="Integration Logs" onClick={() => alert('"Integration Logs" page is not built yet. (404)')} />
    </RailCard>
  );
}

// ============== OTHER TAB ==============

function OtherPanel({
  cacheToggles,
  toggleCacheSetting,
  legalLinks,
  footerText,
  setFooterText,
  companyAddress,
  setCompanyAddress,
  gstNumber,
  setGstNumber,
  dataRetentionDays,
  setDataRetentionDays,
  router,
}: {
  cacheToggles: any;
  toggleCacheSetting: (k: any) => void;
  legalLinks: any[];
  footerText: string;
  setFooterText: (v: string) => void;
  companyAddress: string;
  setCompanyAddress: (v: string) => void;
  gstNumber: string;
  setGstNumber: (v: string) => void;
  dataRetentionDays: string;
  setDataRetentionDays: (v: string) => void;
  router: ReturnType<typeof useRouter>;
}) {
  return (
    <>
      <SectionTitle>Other Settings</SectionTitle>
      <div style={{ fontSize: 13, color: TEXT_MUTED, marginTop: -10, marginBottom: 22 }}>
        Legal pages, company details, performance and data retention settings.
      </div>

      {/* Legal & Compliance */}
      <div style={{ border: `1px solid ${BORDER}`, borderRadius: 8, padding: 18, marginBottom: 22 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Legal & Compliance Pages</div>
            <div style={{ fontSize: 12, color: TEXT_MUTED }}>Manage the legal pages shown across the platform.</div>
          </div>
          <button
            onClick={() => alert("Add Legal Page dialog would open here (demo action).")}
            style={{ background: "transparent", border: `1px solid ${GOLD}`, color: GOLD, borderRadius: 6, padding: "9px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}
          >
            <Plus size={14} />
            Add Page
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1.3fr 1fr 0.8fr 0.7fr", padding: "0 0 10px", borderBottom: `1px solid ${BORDER}` }}>
          <div style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600 }}>PAGE</div>
          <div style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600 }}>URL</div>
          <div style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600 }}>LAST UPDATED</div>
          <div style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600 }}>STATUS</div>
          <div style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600, textAlign: "right" }}>ACTIONS</div>
        </div>

        {legalLinks.map((l) => (
          <div key={l.id} style={{ display: "grid", gridTemplateColumns: "1.3fr 1.3fr 1fr 0.8fr 0.7fr", alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${BORDER}` }}>
            <div style={{ fontSize: 13, color: "#fff" }}>{l.label}</div>
            <div style={{ fontSize: 13, color: TEXT_MUTED, display: "flex", alignItems: "center", gap: 5 }}>
              <Link2 size={12} />
              {l.url}
            </div>
            <div style={{ fontSize: 13, color: "#cfd3da" }}>{l.lastUpdated}</div>
            <div>
              <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 4, background: l.status === "Published" ? `${GREEN}22` : `${ORANGE}22`, color: l.status === "Published" ? GREEN : ORANGE }}>
                {l.status}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
              <Pencil size={14} color={TEXT_MUTED} style={{ cursor: "pointer" }} onClick={() => alert(`Edit "${l.label}" page content (demo action).`)} />
              <MoreVertical size={14} color={TEXT_MUTED} style={{ cursor: "pointer" }} onClick={() => alert(`More options for ${l.label} (demo action).`)} />
            </div>
          </div>
        ))}
      </div>

      {/* Company Details + Data Retention */}
      <div style={{ display: "flex", gap: 20, marginBottom: 22 }}>
        <div style={{ flex: 1, border: `1px solid ${BORDER}`, borderRadius: 8, padding: 18 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 14 }}>Company & Footer Details</div>
          <Field label="Company Address">
            <input style={inputStyle} value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)} />
          </Field>
          <Field label="GST / Tax Registration Number">
            <input style={inputStyle} value={gstNumber} onChange={(e) => setGstNumber(e.target.value)} />
          </Field>
          <Field label="Footer Copyright Text" hint="Shown at the bottom of every page.">
            <input style={inputStyle} value={footerText} onChange={(e) => setFooterText(e.target.value)} />
          </Field>
        </div>

        <div style={{ flex: 1, border: `1px solid ${BORDER}`, borderRadius: 8, padding: 18 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 14 }}>Data Retention & Privacy</div>
          <Field label="Inactive Account Data Retention" hint="How long to retain data after account deletion request.">
            <select style={inputStyle} value={dataRetentionDays} onChange={(e) => setDataRetentionDays(e.target.value)}>
              <option>90 Days</option>
              <option>180 Days</option>
              <option>365 Days</option>
              <option>Indefinite</option>
            </select>
          </Field>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              background: "rgba(212,166,74,0.08)",
              border: `1px solid ${GOLD}`,
              borderRadius: 8,
              padding: "12px 14px",
              fontSize: 12,
              color: "#E8D8B0",
              marginTop: 10,
            }}
          >
            <FileWarning size={15} color={GOLD} style={{ marginTop: 1, flexShrink: 0 }} />
            Changing data retention policy affects upcoming deletion requests only, in line with applicable data protection regulations.
          </div>
        </div>
      </div>

      {/* Performance & Developer Tools */}
      <div style={{ border: `1px solid ${BORDER}`, borderRadius: 8, padding: 18 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Performance & Developer Tools</div>
        <div style={{ fontSize: 12, color: TEXT_MUTED, marginBottom: 8 }}>Caching, CDN and debug settings for the platform.</div>

        <PrefRow icon={Cpu} title="Page Caching" desc="Cache rendered pages for faster load times." on={cacheToggles.pageCache} onClick={() => toggleCacheSetting("pageCache")} />
        <PrefRow icon={Database} title="API Response Caching" desc="Cache common API responses to reduce server load." on={cacheToggles.apiCache} onClick={() => toggleCacheSetting("apiCache")} />
        <PrefRow icon={Cloud} title="Image CDN" desc="Serve images and media through a content delivery network." on={cacheToggles.imageCdn} onClick={() => toggleCacheSetting("imageCdn")} />
        <PrefRow icon={Code2} title="Debug Mode" desc="Show detailed error messages. Disable in production." on={cacheToggles.debugMode} onClick={() => toggleCacheSetting("debugMode")} />

        {cacheToggles.debugMode && (
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10, background: "rgba(200,32,42,0.08)", border: `1px solid ${RED}`, borderRadius: 8, padding: "12px 14px", fontSize: 12, color: "#F3B5B9", marginTop: 12 }}>
            <AlertTriangle size={15} color={RED} style={{ marginTop: 1, flexShrink: 0 }} />
            Debug mode is enabled. This may expose sensitive information and should never be left on in production.
          </div>
        )}
      </div>
    </>
  );
}

function OtherQuickActions({ router }: { router: ReturnType<typeof useRouter> }) {
  return (
    <RailCard title="QUICK ACTIONS" color={GOLD}>
      <ActionRow icon={ScrollText} label="Edit Legal Pages" onClick={() => alert("Scroll to Legal & Compliance section above (demo action).")} />
      <ActionRow icon={HardDriveDownload} label="Export All Settings" onClick={() => alert("Settings export started (demo action).")} />
      <ActionRow icon={Upload} label="Import Settings" onClick={() => alert("Import Settings dialog would open here (demo action).")} />
      <ActionRow icon={RefreshCcw} label="Clear All Caches" onClick={() => alert("All caches cleared (demo action).")} />
    </RailCard>
  );
}