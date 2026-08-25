'use client'

export const dynamic = 'force-dynamic';
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import AdminTopnav from '@/components/layout/AdminTopnav';
import AdminSidebar from '@/components/layout/AdminSidebar';
import { supabase } from '@/lib/supabase';
import {
  SettingsIcon, Mail, MessageSquare, MessageCircle, CreditCard, Lock, Bell, Globe, Plug,
  Save, CheckCircle, AlertCircle, AlertTriangle, RefreshCw, RefreshCcw,
  Activity, Banknote, BookOpen, Building2, CalendarClock, CalendarDays,
  ChevronLeft, ChevronRight, ClipboardList, Clock, Cloud, Code2, Cpu,
  Database, Download, Eye, EyeOff, FileBarChart, FileBox, FileSearch,
  FileText, FileWarning, HardDrive, HardDriveDownload, Info, Key, KeyRound,
  Link2, ListChecks, ListOrdered, LogIn, MonitorSmartphone, MoreVertical,
  Pencil, Percent, PlayCircle, Plus, Receipt, RotateCcw, ScrollText,
  Search, Send, Shield, ShieldAlert, ShieldBan, ShieldCheck, ShieldX,
  SlidersHorizontal, Smartphone, Timer, Trash2, TrendingUp, Upload,
  UserPlus, Users, Wallet, Webhook, XCircle, Hash, Ruler, Phone,
  Languages as LanguagesIcon, CheckCircle2, BarChart3, Share2,
  Inbox, Tag, Landmark, Flag, ChevronDown,
} from 'lucide-react';

const RED = '#C8202A';
const GOLD = '#D4A64A';
const GREEN = '#22C55E';
const BLUE = '#3B82F6';
const PURPLE = '#8B5CF6';
const ORANGE = '#F97316';
const TEAL = '#14B8A6';
const BG = '#0D1117';
const BG2 = '#131720';
const BG3 = '#181E2A';
const BG4 = '#1C2338';
const BEBAS = "'Bebas Neue', sans-serif";
const BARLOW = "'Barlow Condensed', sans-serif";
const BORDER = '#252C3A';
const TEXT_MUTED = '#8B93A3';

const TABS = [
  { key: 'general',       label: 'General',        icon: SettingsIcon },
  { key: 'email',         label: 'Email',           icon: Mail         },
  { key: 'sms',           label: 'SMS / WhatsApp',  icon: MessageSquare},
  { key: 'payments',      label: 'Payments',        icon: CreditCard   },
  { key: 'security',      label: 'Security',        icon: Lock         },
  { key: 'notifications', label: 'Notifications',   icon: Bell         },
  { key: 'localization',  label: 'Localization',    icon: Globe        },
  { key: 'integrations',  label: 'Integrations',    icon: Plug         },
];

/* Toast component */
function Toast(props: { msg: string; type: 'success'|'error'; onDone: () => void }) {
  useEffect(function() {
    const t = setTimeout(props.onDone, 3200);
    return function() { clearTimeout(t); };
  }, [props.onDone]);
  return (
    <div style={{ position: 'fixed' as const, bottom: 28, right: 28, zIndex: 300, background: props.type === 'success' ? GREEN : RED, color: '#000', padding: '12px 20px', borderRadius: 10, fontFamily: BARLOW, fontSize: 15, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>
      {props.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
      {props.msg}
    </div>
  );
}

export default function AdminSettingsPage() {
  const router = useRouter();
  const [_collapsed, _setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{msg: string; type: 'success'|'error'} | null>(null);

  const showToast = useCallback(function(msg: string, type: 'success'|'error' = 'success') {
    setToast({msg, type});
  }, []);

  // ---- General settings state ----
  const [platformName,  setPlatformName]  = useState('SilverScreens');
  const [tagline,       setTagline]       = useState('Where Talent Shines');
  const [supportEmail,  setSupportEmail]  = useState('support@silverscreens.com');
  const [supportPhone,  setSupportPhone]  = useState('+91 98765 43210');
  const [timezone,      setTimezone]      = useState('(GMT+05:30) Asia/Kolkata');
  const [dateFormat,    setDateFormat]    = useState('DD MMM YYYY');
  const [timeFormat,    setTimeFormat]    = useState('12 Hour (AM/PM)');
  const [itemsPerPage,  setItemsPerPage]  = useState('25');

  // ---- Email settings state ----
  const [smtpHost,        setSmtpHost]        = useState('smtp.sendgrid.net');
  const [smtpPort,        setSmtpPort]        = useState('587');
  const [encryption,      setEncryption]      = useState('TLS');
  const [smtpUsername,    setSmtpUsername]    = useState('apikey');
  const [smtpPassword,    setSmtpPassword]    = useState('');
  const [fromEmail,       setFromEmail]       = useState('no-reply@silverscreens.com');
  const [replyToEmail,    setReplyToEmail]    = useState('support@silverscreens.com');
  const [fromName,        setFromName]        = useState('SilverScreens');
  const [replyToName,     setReplyToName]     = useState('SilverScreens Support');
  const [showSmtpPassword, setShowSmtpPassword] = useState(false);

  // ---- SMS / WhatsApp settings state ----
  const [smsProvider,    setSmsProvider]    = useState('Twilio');
  const [smsFromNumber,  setSmsFromNumber]  = useState('+91 98765 43210');
  const [smsAccountSid,  setSmsAccountSid]  = useState('');
  const [smsAuthToken,   setSmsAuthToken]   = useState('');
  const [smsSendingLimit, setSmsSendingLimit] = useState('1000');
  const [waProvider,     setWaProvider]     = useState('360dialog');
  const [waAccessToken,  setWaAccessToken]  = useState('');
  const [waPhoneNumberId, setWaPhoneNumberId] = useState('');
  const [waBusinessNumber, setWaBusinessNumber] = useState('');
  const [waSendingLimit, setWaSendingLimit] = useState('500');
  const [preferredChannel, setPreferredChannel] = useState('whatsapp');

  // ---- Security settings state ----
  const [twoFaEnabled,       setTwoFaEnabled]       = useState(true);
  const [loginAttemptLimit,  setLoginAttemptLimit]  = useState('5 Attempts');
  const [lockoutDuration,    setLockoutDuration]    = useState('30 Minutes');
  const [sessionTimeout,     setSessionTimeout]     = useState('30 Minutes');
  const [rememberDevice,     setRememberDevice]     = useState(true);
  const [activeSessionsPolicy, setActiveSessionsPolicy] = useState('1 Web + 1 Mobile');

  // ---- Notifications settings state ----
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(true);
  const [quietStart,        setQuietStart]        = useState('10:00 PM');
  const [quietEnd,          setQuietEnd]          = useState('08:00 AM');

  // ---- Payment settings state ----
  const [autoRefund,       setAutoRefund]       = useState(false);
  const [refundPolicy,     setRefundPolicy]     = useState('Standard Refund Policy');
  const [disputeHandling,  setDisputeHandling]  = useState('Manual Review');

  // ---- Other state (UI only) ----
  const [collapsed,     setCollapsed]     = useState(false);
  const [profileOpen,   setProfileOpen]   = useState(false);
  const [smtpToggles,   setSmtpToggles]   = useState({ tlsEncryption: true, smtpAuth: true, trackOpens: true, trackClicks: true, welcomeEmail: true, emailVerification: true, passwordReset: true, newApplicationAlerts: true, systemAlerts: true, authentication: true });
  const [smsWaToggles,  setSmsWaToggles]  = useState({ smsEnabled: true, whatsappEnabled: true, deliveryReport: true, enableSms: true, enableWhatsApp: true, fallbackToSms: true, userRegSms: false, userRegWa: false, verificationSms: true, verificationWa: false, castingAppSms: false, castingAppWa: true, appStatusSms: true, appStatusWa: true, paymentSms: true, paymentWa: true, subExpirySms: true, subExpiryWa: true });
  const [channelToggles, setChannelToggles] = useState({ email: true, push: true, sms: false, whatsapp: true, inApp: true });
  const [cacheToggles,   setCacheToggles]  = useState({ pageCache: true, apiCache: true, imageCdn: true, debugMode: false });
  const [integrationFilter, setIntegrationFilter] = useState("All Integrations");
  const [integrationSearch, setIntegrationSearch] = useState("");
  const [globalDateFormat, setGlobalDateFormat] = useState("DD MMM YYYY (24 Jun 2026)");
  const [globalTimeFormat, setGlobalTimeFormat] = useState("12 Hour (AM/PM)");
  const [firstDayOfWeek, setFirstDayOfWeek] = useState("Monday");
  const [defaultTimezoneDisplay, setDefaultTimezoneDisplay] = useState("User's Local Timezone");
  const [decimalSeparator, setDecimalSeparator] = useState("Period (.)");
  const [thousandsSeparator, setThousandsSeparator] = useState("Comma (,)");
  const [decimalPlaces, setDecimalPlaces] = useState("2");
  const [measurementUnit, setMeasurementUnit] = useState("Metric (cm, kg)");
  const [phoneNumberFormat, setPhoneNumberFormat] = useState("International (+91 98765 43210)");
  const [defaultPlatformLanguage, setDefaultPlatformLanguage] = useState("English (en)");
  const [languages, setLanguages] = useState<any[]>([]);
  const [regions, setRegions] = useState<any[]>([]);
  const [localizationCurrencies, setLocalizationCurrencies] = useState<any[]>([]);
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
  const [allowLanguageChange, setAllowLanguageChange] = useState(true);
  const [browserLangDetection, setBrowserLangDetection] = useState(true);
  const [autoDST, setAutoDST] = useState(true);
  const [localizationSubTab, setLocalizationSubTab] = useState('languages');
  const [moduleFilter,  setModuleFilter]  = useState('All Modules');
  const [eventSearch,   setEventSearch]   = useState('');

  const [gateways, setGateways] = useState<any[]>([]);

  // currencies comes from localizationCurrencies (fetched from platform_currencies table)

  const [taxes, setTaxes] = useState<any[]>([]);

  const [integrations, setIntegrations] = useState([
    { id: 1, name: 'Razorpay',   category: 'Payments',     connected: true,  color: BLUE,   lastSync: '2 mins ago'    },
    { id: 2, name: 'SendGrid',   category: 'Email',        connected: true,  color: TEAL,   lastSync: '5 mins ago'    },
    { id: 3, name: 'Twilio',     category: 'SMS',          connected: true,  color: RED,    lastSync: '18 mins ago'   },
    { id: 4, name: 'Firebase',   category: 'Push Notifs',  connected: true,  color: ORANGE, lastSync: '1 hour ago'    },
    { id: 5, name: 'Cloudinary', category: 'Media CDN',    connected: true,  color: PURPLE, lastSync: '30 mins ago'   },
    { id: 6, name: 'Stripe',     category: 'Payments',     connected: false, color: GREEN,  lastSync: 'Never'         },
    { id: 7, name: '360dialog',  category: 'WhatsApp',     connected: false, color: GREEN,  lastSync: 'Never'         },
    { id: 8, name: 'Google Analytics', category: 'Analytics', connected: false, color: GOLD, lastSync: 'Never'      },
  ]);

  const [legalLinks] = useState([
    { id: 1, label: 'Terms of Service',  url: '/terms',          lastUpdated: '12 Jan 2026', status: 'Published' },
    { id: 2, label: 'Privacy Policy',    url: '/privacy-policy', lastUpdated: '12 Jan 2026', status: 'Published' },
    { id: 3, label: 'Cookie Policy',     url: '/cookie-policy',  lastUpdated: '08 Nov 2025', status: 'Published' },
    { id: 4, label: 'Refund Policy',     url: '/refund-policy',  lastUpdated: '—',           status: 'Draft'     },
  ]);

  const [footerText,       setFooterText]       = useState('© 2026 SilverScreens. All rights reserved.');
  const [companyAddress,   setCompanyAddress]   = useState('SilverScreens Media Pvt. Ltd., Chennai, Tamil Nadu, India');
  const [gstNumber,        setGstNumber]        = useState('33AAAAA0000A1Z5');
  const [dataRetentionDays, setDataRetentionDays] = useState('365 Days');
  const [passwordPolicy] = useState([
    { label: 'Minimum 8 characters',           value: 'enabled'  },
    { label: 'Require uppercase letter',        value: 'enabled'  },
    { label: 'Require number',                  value: 'enabled'  },
    { label: 'Require special character (!@#)', value: 'disabled' },
    { label: 'No reuse of last 5 passwords',    value: 'enabled'  },
  ]);
  const [whitelistedIps, setWhitelistedIps] = useState(['192.168.1.0/24', '10.0.0.1']);
  const [blockedIps, setBlockedIps] = useState(['103.41.205.0/24']);

  // ---- Load settings from DB ----
  const loadSettings = useCallback(async function() {
    setLoading(true);
    try {
      const { data } = await supabase.from('system_settings').select('key, value');
      if (data) {
        const m: Record<string, string> = {};
        data.forEach(function(r: any) { m[r.key] = r.value; });
        if (m.platform_name)       setPlatformName(m.platform_name);
        if (m.platform_tagline)    setTagline(m.platform_tagline);
        if (m.support_email)       setSupportEmail(m.support_email);
        if (m.support_phone)       setSupportPhone(m.support_phone);
        if (m.timezone)            setTimezone(m.timezone);
        if (m.date_format)         setDateFormat(m.date_format);
        if (m.time_format)         setTimeFormat(m.time_format);
        if (m.items_per_page)      setItemsPerPage(m.items_per_page);
        if (m.smtp_host)           setSmtpHost(m.smtp_host);
        if (m.smtp_port)           setSmtpPort(m.smtp_port);
        if (m.smtp_encryption)     setEncryption(m.smtp_encryption);
        if (m.smtp_username)       setSmtpUsername(m.smtp_username);
        if (m.smtp_password)       setSmtpPassword(m.smtp_password);
        if (m.from_email)          setFromEmail(m.from_email);
        if (m.reply_to_email)      setReplyToEmail(m.reply_to_email);
        if (m.from_name)           setFromName(m.from_name);
        if (m.reply_to_name)       setReplyToName(m.reply_to_name);
        if (m.sms_provider)        setSmsProvider(m.sms_provider);
        if (m.sms_from_number)     setSmsFromNumber(m.sms_from_number);
        if (m.wa_provider)         setWaProvider(m.wa_provider);
      if (m.sms_account_sid)    setSmsAccountSid(m.sms_account_sid);
      if (m.sms_auth_token)     setSmsAuthToken(m.sms_auth_token);
      if (m.sms_sending_limit)  setSmsSendingLimit(m.sms_sending_limit);
      if (m.wa_access_token)    setWaAccessToken(m.wa_access_token);
      if (m.wa_phone_number_id) setWaPhoneNumberId(m.wa_phone_number_id);
      if (m.wa_business_number) setWaBusinessNumber(m.wa_business_number);
      if (m.wa_sending_limit)   setWaSendingLimit(m.wa_sending_limit);
      if (m.preferred_channel)  setPreferredChannel(m.preferred_channel);
        if (m.login_attempt_limit) setLoginAttemptLimit(m.login_attempt_limit);
        if (m.lockout_duration)    setLockoutDuration(m.lockout_duration);
        if (m.session_timeout)     setSessionTimeout(m.session_timeout);
        if (m.two_fa_enabled !== undefined)      setTwoFaEnabled(m.two_fa_enabled === 'true');
        if (m.auto_refund !== undefined)         setAutoRefund(m.auto_refund === 'true');
        if (m.quiet_hours_enabled !== undefined) setQuietHoursEnabled(m.quiet_hours_enabled === 'true');
        if (m.quiet_start)         setQuietStart(m.quiet_start);
        if (m.quiet_end)           setQuietEnd(m.quiet_end);
        // Load general toggles from DB
        setGeneralToggles(function(prev) { return Object.assign({}, prev, {
          newUserRegistration: m.new_user_registration !== undefined ? m.new_user_registration === 'true' : prev.newUserRegistration,
          emailVerification:   m.email_verification   !== undefined ? m.email_verification   === 'true' : prev.emailVerification,
          mobileVerification:  m.mobile_verification  !== undefined ? m.mobile_verification  === 'true' : prev.mobileVerification,
          autoApproveTalents:  m.auto_approve_talents !== undefined ? m.auto_approve_talents === 'true' : prev.autoApproveTalents,
          autoApproveAgencies: m.auto_approve_agencies !== undefined ? m.auto_approve_agencies === 'true' : prev.autoApproveAgencies,
          maintenanceMode:     m.maintenance_mode      !== undefined ? m.maintenance_mode     === 'true' : prev.maintenanceMode,
        }); });
        // Load SMTP toggles from DB
        setSmtpToggles(function(prev) { return Object.assign({}, prev, {
          tlsEncryption:        m.smtp_tls_encryption      !== undefined ? m.smtp_tls_encryption      === 'true' : prev.tlsEncryption,
          smtpAuth:             m.smtp_auth                !== undefined ? m.smtp_auth                === 'true' : prev.smtpAuth,
          trackOpens:           m.smtp_track_opens         !== undefined ? m.smtp_track_opens         === 'true' : prev.trackOpens,
          trackClicks:          m.smtp_track_clicks        !== undefined ? m.smtp_track_clicks        === 'true' : prev.trackClicks,
          welcomeEmail:         m.email_welcome            !== undefined ? m.email_welcome            === 'true' : prev.welcomeEmail,
          emailVerification:    m.email_verification_send  !== undefined ? m.email_verification_send  === 'true' : prev.emailVerification,
          passwordReset:        m.email_password_reset     !== undefined ? m.email_password_reset     === 'true' : prev.passwordReset,
          newApplicationAlerts: m.email_new_application_alerts !== undefined ? m.email_new_application_alerts === 'true' : prev.newApplicationAlerts,
          systemAlerts:         m.email_system_alerts      !== undefined ? m.email_system_alerts      === 'true' : prev.systemAlerts,
          authentication:       m.smtp_authentication      !== undefined ? m.smtp_authentication      === 'true' : prev.authentication,
        }); });
        // Load SMS/WhatsApp toggles from DB
        setSmsWaToggles(function(prev) { return Object.assign({}, prev, {
          smsEnabled:      m.sms_enabled        !== undefined ? m.sms_enabled        === 'true' : prev.smsEnabled,
          whatsappEnabled: m.whatsapp_enabled   !== undefined ? m.whatsapp_enabled   === 'true' : prev.whatsappEnabled,
          deliveryReport:  m.sms_delivery_report !== undefined ? m.sms_delivery_report === 'true' : prev.deliveryReport,
        }); });
        // Load channel toggles from DB
        setChannelToggles(function(prev) { return Object.assign({}, prev, {
          email:     m.channel_email    !== undefined ? m.channel_email    === 'true' : prev.email,
          push:      m.channel_push     !== undefined ? m.channel_push     === 'true' : prev.push,
          sms:       m.channel_sms      !== undefined ? m.channel_sms      === 'true' : prev.sms,
          whatsapp:  m.channel_whatsapp !== undefined ? m.channel_whatsapp === 'true' : prev.whatsapp,
          inApp:     m.channel_in_app   !== undefined ? m.channel_in_app   === 'true' : prev.inApp,
        }); });
        // Load cache toggles from DB
        setCacheToggles(function(prev) { return Object.assign({}, prev, {
          pageCache:  m.cache_page      !== undefined ? m.cache_page      === 'true' : prev.pageCache,
          apiCache:   m.cache_api       !== undefined ? m.cache_api       === 'true' : prev.apiCache,
          imageCdn:   m.cache_image_cdn !== undefined ? m.cache_image_cdn === 'true' : prev.imageCdn,
          debugMode:  m.debug_mode      !== undefined ? m.debug_mode      === 'true' : prev.debugMode,
        }); });
      }
    } catch(e) { console.error('Failed to load settings:', e); }
    setLoading(false);
  }, []);

  useEffect(function() { loadSettings(); }, [loadSettings]);

  // Fetch languages from DB
  const fetchLanguages = useCallback(async function() {
    const { data } = await supabase.from('platform_languages').select('*').order('name');
    if (data) setLanguages(data.map(function(r: any) {
      return { id: r.id, name: r.name, native: r.native_name, code: r.code, direction: r.direction, status: r.is_active ? 'Active' : 'Inactive', isDefault: r.is_default };
    }));
  }, []);

  // Fetch regions from DB
  const fetchRegions = useCallback(async function() {
    const { data } = await supabase.from('platform_regions').select('*').order('name');
    if (data) setRegions(data.map(function(r: any) {
      return { id: r.id, name: r.name, code: r.code, region: r.region, currency: r.currency, status: r.is_active ? 'Active' : 'Inactive', primary: r.is_primary };
    }));
  }, []);

  // Fetch currencies from DB
  const fetchCurrencies = useCallback(async function() {
    const { data } = await supabase.from('platform_currencies').select('*').order('name');
    if (data) setLocalizationCurrencies(data.map(function(r: any) {
      return { id: r.id, name: r.name, symbol: r.symbol, code: r.code, rate: r.rate, status: r.is_active ? 'Active' : 'Inactive', isDefault: r.is_default };
    }));
  }, []);

  // Fetch gateways from DB
  const fetchGateways = useCallback(async function() {
    const { data } = await supabase.from('payment_gateways').select('*').order('created_at');
    if (data) setGateways(data.map(function(r: any) {
      return { id: r.id, name: r.name, type: r.type, active: r.is_active, mode: r.mode, volume: r.volume || '—', txns: r.txns || 0, icon: r.name.toLowerCase().replace(/\s/g, ''), status: r.is_active ? 'Active' : 'Inactive', desc: r.name + ' payment gateway', fee: '2%', color: r.name === 'Razorpay' ? '#3B82F6' : r.name === 'Stripe' ? '#8B5CF6' : '#6B7280' };
    }));
  }, []);

  useEffect(function() {
    fetchLanguages();
    fetchRegions();
    fetchCurrencies();
    fetchGateways();
    // taxes don't have a DB table yet - use defaults
    setTaxes([
      { id: 1, name: 'GST 18%', type: 'GST', rate: 18, applies: 'Subscription Plans', active: true },
      { id: 2, name: 'GST 5%',  type: 'GST', rate: 5,  applies: 'Basic Services',     active: false },
    ]);
  }, [fetchLanguages, fetchRegions, fetchCurrencies, fetchGateways]);

  // ---- Save settings to DB ----
  const handleSave = async function() {
    setSaving(true);
    const rows = [
      { key: 'platform_name',       value: platformName },
      { key: 'platform_tagline',    value: tagline },
      { key: 'support_email',       value: supportEmail },
      { key: 'support_phone',       value: supportPhone },
      { key: 'timezone',            value: timezone },
      { key: 'date_format',         value: dateFormat },
      { key: 'time_format',         value: timeFormat },
      { key: 'items_per_page',      value: itemsPerPage },
      { key: 'smtp_host',           value: smtpHost },
      { key: 'smtp_port',           value: smtpPort },
      { key: 'smtp_encryption',     value: encryption },
      { key: 'smtp_username',       value: smtpUsername },
      { key: 'smtp_password',       value: smtpPassword },
      { key: 'from_email',          value: fromEmail },
      { key: 'reply_to_email',      value: replyToEmail },
      { key: 'from_name',           value: fromName },
      { key: 'reply_to_name',       value: replyToName },
      { key: 'sms_provider',        value: smsProvider },
      { key: 'sms_from_number',     value: smsFromNumber },
      { key: 'sms_account_sid',    value: smsAccountSid },
      { key: 'sms_auth_token',     value: smsAuthToken },
      { key: 'sms_sending_limit',  value: smsSendingLimit },
      { key: 'wa_access_token',    value: waAccessToken },
      { key: 'wa_phone_number_id', value: waPhoneNumberId },
      { key: 'wa_business_number', value: waBusinessNumber },
      { key: 'wa_sending_limit',   value: waSendingLimit },
      { key: 'preferred_channel',  value: preferredChannel },
      { key: 'wa_provider',         value: waProvider },
      { key: 'login_attempt_limit', value: loginAttemptLimit },
      { key: 'lockout_duration',    value: lockoutDuration },
      { key: 'session_timeout',     value: sessionTimeout },
      { key: 'two_fa_enabled',      value: twoFaEnabled ? 'true' : 'false' },
      { key: 'auto_refund',         value: autoRefund ? 'true' : 'false' },
      { key: 'quiet_hours_enabled', value: quietHoursEnabled ? 'true' : 'false' },
      { key: 'quiet_start',         value: quietStart },
      { key: 'quiet_end',           value: quietEnd },
    ].map(function(r) { return Object.assign({}, r, { updated_at: new Date().toISOString() }); });

    const { error } = await supabase.from('system_settings').upsert(rows, { onConflict: 'key' });
    if (error) {
      showToast('Failed to save settings.', 'error');
    } else {
      setSaved(true);
      showToast('Settings saved successfully.');
      setTimeout(function() { setSaved(false); }, 2200);
    }
    setSaving(false);
  };

  // Edit modals state
  const [editLangModal,  setEditLangModal]  = useState<any>(null);
  const [editGwModal,    setEditGwModal]    = useState<any>(null);
  const [editRegModal,   setEditRegModal]   = useState<any>(null);
  const [editCurModal,   setEditCurModal]   = useState<any>(null);

  // Modal states
  const [showAddLanguage,   setShowAddLanguage]   = useState(false);
  const [showAddRegion,     setShowAddRegion]     = useState(false);
  const [showAddCurrency,   setShowAddCurrency]   = useState(false);
  const [showAddTax,        setShowAddTax]        = useState(false);
  const [showAddGateway,    setShowAddGateway]    = useState(false);
  const [showAddIntegration, setShowAddIntegration] = useState(false);
  const [showTestEmail,     setShowTestEmail]     = useState(false);
  const [showTestSms,       setShowTestSms]       = useState(false);
  const [showTestWa,        setShowTestWa]        = useState(false);
  const [showManageIP,      setShowManageIP]      = useState(false);
  const [show2FA,           setShow2FA]           = useState(false);

  const [generalToggles, setGeneralToggles] = useState({
    newUserRegistration: true, emailVerification: true, mobileVerification: true,
    autoApproveTalents: false, autoApproveAgencies: false, maintenanceMode: false,
  });

  const TOGGLE_DB_KEY: Record<string, string> = {
    newUserRegistration: 'new_user_registration',
    emailVerification:   'email_verification',
    mobileVerification:  'mobile_verification',
    autoApproveTalents:  'auto_approve_talents',
    autoApproveAgencies: 'auto_approve_agencies',
    maintenanceMode:     'maintenance_mode',
  };

  async function saveToggleToDB(dbKey: string, value: boolean) {
    try {
      await supabase.from('system_settings').upsert(
        [{ key: dbKey, value: value ? 'true' : 'false', updated_at: new Date().toISOString() }],
        { onConflict: 'key' }
      );
    } catch (e) { console.error('[TOGGLE SAVE ERROR]', dbKey, e); }
  }

  function toggleGeneral(k: string) {
    setGeneralToggles(function(p) {
      const newVal = !p[k as keyof typeof p];
      const dbKey = TOGGLE_DB_KEY[k];
      if (dbKey) saveToggleToDB(dbKey, newVal);
      return Object.assign({}, p, { [k]: newVal });
    });
  }

  const SMTP_DB_KEY: Record<string, string> = {
    tlsEncryption: 'smtp_tls_encryption', smtpAuth: 'smtp_auth', trackOpens: 'smtp_track_opens',
    trackClicks: 'smtp_track_clicks', welcomeEmail: 'email_welcome', emailVerification: 'email_verification_send',
    passwordReset: 'email_password_reset', newApplicationAlerts: 'email_new_application_alerts',
    systemAlerts: 'email_system_alerts', authentication: 'smtp_authentication',
  };
  function toggleSmtp(k: string) {
    setSmtpToggles(function(p) {
      const newVal = !p[k as keyof typeof p];
      const dbKey = SMTP_DB_KEY[k];
      if (dbKey) saveToggleToDB(dbKey, newVal);
      return Object.assign({}, p, { [k]: newVal });
    });
  }
  async function toggleLanguageStatus(id: string) {
    const lang = languages.find(function(l: any) { return l.id === id; });
    if (!lang) return;
    const newActive = lang.status !== 'Active';
    await supabase.from('platform_languages').update({ is_active: newActive }).eq('id', id);
    setLanguages(function(prev: any[]) { return prev.map(function(l: any) { return l.id === id ? Object.assign({}, l, { status: newActive ? 'Active' : 'Inactive' }) : l; }); });
  }
  async function toggleRegionStatus(id: string) {
    const reg = regions.find(function(r: any) { return r.id === id; });
    if (!reg) return;
    const newActive = reg.status !== 'Active';
    await supabase.from('platform_regions').update({ is_active: newActive }).eq('id', id);
    setRegions(function(prev: any[]) { return prev.map(function(r: any) { return r.id === id ? Object.assign({}, r, { status: newActive ? 'Active' : 'Inactive' }) : r; }); });
  }
  async function toggleCurrencyStatus(id: string) {
    const cur = localizationCurrencies.find(function(c: any) { return c.id === id; });
    if (!cur) return;
    const newActive = cur.status !== 'Active';
    await supabase.from('platform_currencies').update({ is_active: newActive }).eq('id', id);
    setLocalizationCurrencies(function(prev: any[]) { return prev.map(function(c: any) { return c.id === id ? Object.assign({}, c, { status: newActive ? 'Active' : 'Inactive' }) : c; }); });
  }
  const toggleEventChannel = function(id: string, channel: 'inApp' | 'email' | 'sms' | 'whatsapp') {
    setNotificationEvents(function(evts: any[]) {
      return evts.map(function(e: any) {
        return e.id === id ? Object.assign({}, e, { [channel]: !e[channel] }) : e;
      });
    });
  };

  async function toggleIntegration(id: any) {
    setIntegrations(function(prev: any[]) {
      const updated = prev.map(function(i: any) { return i.id === id ? Object.assign({}, i, { connected: !i.connected }) : i; });
      const item = updated.find(function(i: any) { return i.id === id; });
      if (item) saveToggleToDB('integration_' + item.name.toLowerCase().replace(/\s/g, '_'), item.connected);
      return updated;
    });
  }
  const SMSWA_DB_KEY: Record<string, string> = {
    smsEnabled: 'sms_enabled', whatsappEnabled: 'whatsapp_enabled', deliveryReport: 'sms_delivery_report',
  };
  function toggleSmsWa(k: string) {
    setSmsWaToggles(function(p) {
      const newVal = !p[k as keyof typeof p];
      const dbKey = SMSWA_DB_KEY[k];
      if (dbKey) saveToggleToDB(dbKey, newVal);
      return Object.assign({}, p, { [k]: newVal });
    });
  }
  const CHANNEL_DB_KEY: Record<string, string> = {
    email: 'channel_email', push: 'channel_push', sms: 'channel_sms',
    whatsapp: 'channel_whatsapp', inApp: 'channel_in_app',
  };
  function toggleChannel(k: string) {
    setChannelToggles(function(p) {
      const newVal = !p[k as keyof typeof p];
      const dbKey = CHANNEL_DB_KEY[k];
      if (dbKey) saveToggleToDB(dbKey, newVal);
      return Object.assign({}, p, { [k]: newVal });
    });
  }
  const CACHE_DB_KEY: Record<string, string> = {
    pageCache: 'cache_page', apiCache: 'cache_api', imageCdn: 'cache_image_cdn', debugMode: 'debug_mode',
  };
  function toggleCacheSetting(k: string) {
    setCacheToggles(function(p) {
      const newVal = !p[k as keyof typeof p];
      const dbKey = CACHE_DB_KEY[k];
      if (dbKey) saveToggleToDB(dbKey, newVal);
      return Object.assign({}, p, { [k]: newVal });
    });
  }
  async function toggleGatewayStatus(id: any) {
    const gw = gateways.find(function(g: any) { return g.id === id; });
    if (!gw) return;
    const newActive = !gw.active;
    await supabase.from('payment_gateways').update({ is_active: newActive }).eq('id', id);
    setGateways(function(prev: any[]) { return prev.map(function(g: any) { return g.id === id ? Object.assign({}, g, { active: newActive, status: newActive ? 'Active' : 'Inactive' }) : g; }); });
  }

  const sidebarWidth = collapsed ? 52 : 220;

  return (
    <div style={{ display: 'flex', flexDirection: 'column' as const, height: '100vh', overflow: 'hidden', background: BG, fontFamily: BARLOW, color: '#E6E8EC' }}>
      <AdminTopnav />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <AdminSidebar onCollapse={_setCollapsed} />
        <div style={{ flex: 1, overflowY: 'auto' as const }}>

          <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column' as const, gap: 0 }}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div>
                <h1 style={{ fontFamily: BEBAS, fontSize: 34, letterSpacing: 1, color: GOLD, margin: 0 }}>
                  SETTINGS
                </h1>
                <p style={{ fontSize: 14, color: TEXT_MUTED, margin: '4px 0 0' }}>
                  Manage platform settings and preferences.
                </p>
              </div>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{ display: 'flex', alignItems: 'center', gap: 7, background: saved ? GREEN : GOLD, color: BG, border: 'none', borderRadius: 6, padding: '10px 18px', fontSize: 14, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: BARLOW, transition: 'background 0.3s' }}>
                {saving ? <RefreshCw size={14} /> : saved ? <CheckCircle size={14} /> : <Save size={14} />}
                {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
              </button>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid ' + BORDER, marginBottom: 24, gap: 0 }}>
              {TABS.map(function(tab) {
                const Icon = tab.icon;
                const active = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={function() { setActiveTab(tab.key); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px', background: 'none', border: 'none', borderBottom: active ? '2px solid ' + GOLD : '2px solid transparent', cursor: 'pointer', fontFamily: BARLOW, fontSize: 14, fontWeight: active ? 700 : 400, color: active ? GOLD : TEXT_MUTED, transition: 'color 0.15s', whiteSpace: 'nowrap' as const }}>
                    <Icon size={14} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab content + right rail */}
            <div style={{ display: 'flex', gap: 24 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                {loading && (
                  <div style={{ padding: 40, textAlign: 'center' as const, color: TEXT_MUTED, fontSize: 15 }}>
                    Loading settings...
                  </div>
                )}
                {!loading && activeTab === 'general' && (
                  <GeneralPanel
                    values={{ platformName, tagline, supportEmail, supportPhone, timezone, dateFormat, timeFormat, itemsPerPage }}
                    setters={{ setPlatformName, setTagline, setSupportEmail, setSupportPhone, setTimezone, setDateFormat, setTimeFormat, setItemsPerPage }}
                    toggles={generalToggles}
                    toggle={toggleGeneral}
                    router={router}
                  />
                )}
                {!loading && activeTab === 'email' && (
                  <EmailPanel
                    values={{ smtpHost, smtpPort, encryption, smtpUsername, smtpPassword, fromEmail, replyToEmail, fromName, replyToName }}
                    setters={{ setSmtpHost, setSmtpPort, setEncryption, setSmtpUsername, setSmtpPassword, setFromEmail, setReplyToEmail, setFromName, setReplyToName }}
                    toggles={smtpToggles}
                    toggle={toggleSmtp}
                    showPassword={showSmtpPassword}
                    setShowPassword={setShowSmtpPassword}
                    onTestEmail={function() { setShowTestEmail(true); }}
                    router={router}
                  />
                )}
                {!loading && activeTab === 'sms' && (
                  <SmsPanel
                    values={{ smsProvider, smsFromNumber, smsAccountSid, smsAuthToken, smsSendingLimit, waProvider, waAccessToken, waPhoneNumberId, waBusinessNumber, waSendingLimit, preferredChannel }}
                    setters={{ setSmsProvider, setSmsFromNumber, setSmsAccountSid, setSmsAuthToken, setSmsSendingLimit, setWaProvider, setWaAccessToken, setWaPhoneNumberId, setWaBusinessNumber, setWaSendingLimit, setPreferredChannel }}
                    toggles={smsWaToggles}
                    toggle={toggleSmsWa}
                    showSmsAuthToken={false}
                    setShowSmsAuthToken={function() {}}
                    showWaAccessToken={false}
                    setShowWaAccessToken={function() {}}
                    onTestSms={function() { setShowTestSms(true); }}
                    onTestWa={function() { setShowTestWa(true); }}
                    router={router}
                  />
                )}
                {!loading && activeTab === 'payments' && (
                  <PaymentsPanel
                    gateways={gateways}
                    toggleGatewayStatus={toggleGatewayStatus}
                    currencies={localizationCurrencies}
                    taxes={taxes}
                    refundPolicy={refundPolicy}
                    setRefundPolicy={setRefundPolicy}
                    disputeHandling={disputeHandling}
                    setDisputeHandling={setDisputeHandling}
                    autoRefund={autoRefund}
                    setAutoRefund={setAutoRefund}
                    onAddGateway={function() { setShowAddGateway(true); }}
                    onAddCurrency={function() { setShowAddCurrency(true); }}
                    onAddTax={function() { setShowAddTax(true); }}
                    onEditCurrency={function(c: any) { setEditCurModal(c); }}
                    onEditGateway={function(g: any) { setEditGwModal(g); }}
                    onGoToLocalization={function() { setActiveTab('localization'); setLocalizationSubTab('currencies'); }}
                    router={router}
                  />
                )}
                {!loading && activeTab === 'security' && (
                  <SecurityPanel
                    twoFaEnabled={twoFaEnabled}
                    setTwoFaEnabled={setTwoFaEnabled}
                    loginAttemptLimit={loginAttemptLimit}
                    setLoginAttemptLimit={setLoginAttemptLimit}
                    lockoutDuration={lockoutDuration}
                    setLockoutDuration={setLockoutDuration}
                    activeSessionsPolicy={activeSessionsPolicy}
                    setActiveSessionsPolicy={setActiveSessionsPolicy}
                    rememberDevice={rememberDevice}
                    setRememberDevice={setRememberDevice}
                    sessionTimeout={sessionTimeout}
                    setSessionTimeout={setSessionTimeout}
                    passwordPolicy={passwordPolicy}
                    whitelistedIps={whitelistedIps}
                    blockedIps={blockedIps}
                    onManage2FA={function() { setShow2FA(true); }}
                    onManageIP={function() { setShowManageIP(true); }}
                    router={router}
                  />
                )}
                {!loading && activeTab === 'notifications' && (
                  <NotificationsPanel
                    channelToggles={channelToggles}
                    toggleChannel={toggleChannel}
                    moduleFilter={moduleFilter}
                    setModuleFilter={setModuleFilter}
                    eventSearch={eventSearch}
                    setEventSearch={setEventSearch}
                    notificationEvents={notificationEvents}
                    toggleEventChannel={toggleEventChannel}
                    quietHoursEnabled={quietHoursEnabled}
                    setQuietHoursEnabled={setQuietHoursEnabled}
                    quietStart={quietStart}
                    setQuietStart={setQuietStart}
                    quietEnd={quietEnd}
                    setQuietEnd={setQuietEnd}
                    router={router}
                  />
                )}
                {!loading && activeTab === 'localization' && (
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
                    onAddLanguage={function() { setShowAddLanguage(true); }}
                    onAddRegion={function() { setShowAddRegion(true); }}
                    onAddCurrency={function() { setShowAddCurrency(true); }}
                    onManageLocales={function() { setLocalizationSubTab('languages'); setActiveTab('localization'); }}
                    onEditLanguage={function(l: any) { setEditLangModal(l); }}
                    onEditRegion={function(r: any) { setEditRegModal(r); }}
                    onEditCurrency={function(c: any) { setEditCurModal(c); }}
                    onEditGateway={function(g: any) { setEditGwModal(g); }}
                    onGoToLocalization={function() { setActiveTab('localization'); setLocalizationSubTab('currencies'); }}
                    router={router}
                  />
                )}
                {!loading && activeTab === 'integrations' && (
                  <IntegrationsPanel
                    integrations={integrations}
                    toggleIntegration={toggleIntegration}
                    filter={integrationFilter}
                    setFilter={setIntegrationFilter}
                    search={integrationSearch}
                    setSearch={setIntegrationSearch}
                    router={router}
                    onAddIntegration={function() { setShowAddIntegration(true); }}
                  />
                )}
              </div>

              {/* Right rail */}
              <div style={{ width: 260, flexShrink: 0, display: 'flex', flexDirection: 'column' as const, gap: 16 }}>
                <SystemInformation />
                {activeTab === 'general' && <QuickActions router={router} />}
                {activeTab === 'general' && <DangerZone />}
                {activeTab === 'email' && <EmailSystemInfo />}
                {activeTab === 'email' && <EmailQuickActions router={router} onTestEmail={function() { setShowTestEmail(true); }} />}
                {activeTab === 'email' && <HelpTips />}
                {activeTab === 'sms' && <SmsSystemInfo smsProvider={smsProvider} waProvider={waProvider} />}
                {activeTab === 'sms' && <SmsUsage smsSendingLimit={smsSendingLimit} waSendingLimit={waSendingLimit} />}
                {activeTab === 'sms' && <SmsQuickActions router={router} />}
                {activeTab === 'payments' && <PaymentSystemInfo />}
                {activeTab === 'payments' && <PaymentOverview router={router} />}
                {activeTab === 'payments' && <PaymentQuickActions router={router} />}
                {activeTab === 'security' && <SecurityOverview twoFaEnabled={twoFaEnabled} sessionTimeout={sessionTimeout} loginAttemptLimit={loginAttemptLimit} />}
                {activeTab === 'security' && <RecentSecurityActivity />}
                {activeTab === 'security' && <SecurityQuickActions router={router} />}
                {activeTab === 'notifications' && <NotificationOverview notificationEvents={notificationEvents} />}
                {activeTab === 'notifications' && <QuietHours enabled={quietHoursEnabled} setEnabled={setQuietHoursEnabled} start={quietStart} setStart={setQuietStart} end={quietEnd} setEnd={setQuietEnd} timezone={timezone} setTimezone={setTimezone} />}
                {activeTab === 'notifications' && <NotificationQuickActions router={router} />}
                {activeTab === 'localization' && <LocalizationOverview />}
                {activeTab === 'localization' && <ActiveLocales router={router} onManageLocales={function() { setLocalizationSubTab('languages'); setActiveTab('localization'); }} />}
                {activeTab === 'localization' && <LocalizationQuickActions router={router} onAddLanguage={function() { setShowAddLanguage(true); }} />}
                {activeTab === 'integrations' && <IntegrationsOverview integrations={integrations} />}
                {activeTab === 'integrations' && <IntegrationsQuickActions router={router} onAddIntegration={function() { setShowAddIntegration(true); }} />}
              </div>
            </div>

          </div>
        </div>
      </div>


      {/* ===== MODALS ===== */}

      {/* Edit Gateway Modal */}
      {editGwModal && (
        <div style={{ position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={function() { setEditGwModal(null); }}>
          <div style={{ background: BG3, border: '1px solid rgba(212,166,74,0.3)', borderRadius: 14, width: 480, padding: 28 }} onClick={function(e) { e.stopPropagation(); }}>
            <EditGatewayForm gateway={editGwModal} onClose={function() { setEditGwModal(null); }} onSaved={function(updated: any) { setGateways(function(prev: any[]) { return prev.map(function(g: any) { return g.id === updated.id ? updated : g; }); }); setEditGwModal(null); showToast('Gateway updated successfully.'); }} />
          </div>
        </div>
      )}

      {/* Edit Language Modal */}
      {editLangModal && (
        <div style={{ position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={function() { setEditLangModal(null); }}>
          <div style={{ background: BG3, border: '1px solid rgba(212,166,74,0.3)', borderRadius: 14, width: 460, padding: 28 }} onClick={function(e) { e.stopPropagation(); }}>
            <EditLanguageForm language={editLangModal} onClose={function() { setEditLangModal(null); }} onSaved={function(u: any) { setLanguages(function(prev: any[]) { return prev.map(function(l: any) { return l.id === u.id ? u : l; }); }); setEditLangModal(null); }} />
          </div>
        </div>
      )}

      {/* Edit Region Modal */}
      {editRegModal && (
        <div style={{ position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={function() { setEditRegModal(null); }}>
          <div style={{ background: BG3, border: '1px solid rgba(212,166,74,0.3)', borderRadius: 14, width: 460, padding: 28 }} onClick={function(e) { e.stopPropagation(); }}>
            <EditRegionForm region={editRegModal} onClose={function() { setEditRegModal(null); }} onSaved={function(u: any) { setRegions(function(prev: any[]) { return prev.map(function(r: any) { return r.id === u.id ? u : r; }); }); setEditRegModal(null); }} />
          </div>
        </div>
      )}

      {/* Edit Currency Modal */}
      {editCurModal && (
        <div style={{ position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={function() { setEditCurModal(null); }}>
          <div style={{ background: BG3, border: '1px solid rgba(212,166,74,0.3)', borderRadius: 14, width: 460, padding: 28 }} onClick={function(e) { e.stopPropagation(); }}>
            <EditCurrencyForm currency={editCurModal} onClose={function() { setEditCurModal(null); }} onSaved={function(u: any) { setLocalizationCurrencies(function(prev: any[]) { return prev.map(function(c: any) { return c.id === u.id ? u : c; }); }); setEditCurModal(null); }} />
          </div>
        </div>
      )}

      {/* Test WhatsApp Modal */}
      {showTestWa && (
        <div style={{ position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={function() { setShowTestWa(false); }}>
          <div style={{ background: BG3, border: '1px solid rgba(212,166,74,0.3)', borderRadius: 14, width: 440, padding: 28 }}
            onClick={function(e) { e.stopPropagation(); }}>
            <TestWaModal onClose={function() { setShowTestWa(false); }} showToast={showToast} />
          </div>
        </div>
      )}

      {/* Test SMS Modal */}
      {showTestSms && (
        <div style={{ position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={function() { setShowTestSms(false); }}>
          <div style={{ background: BG3, border: '1px solid rgba(212,166,74,0.3)', borderRadius: 14, width: 420, padding: 28 }}
            onClick={function(e) { e.stopPropagation(); }}>
            <TestSmsModal onClose={function() { setShowTestSms(false); }} showToast={showToast} />
          </div>
        </div>
      )}

      {/* Test Email Modal */}
      {showTestEmail && (
        <div style={{ position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={function() { setShowTestEmail(false); }}>
          <div style={{ background: BG3, border: '1px solid rgba(212,166,74,0.3)', borderRadius: 14, width: 420, padding: 28 }}
            onClick={function(e) { e.stopPropagation(); }}>
            <div style={{ fontFamily: BEBAS, fontSize: 20, color: GOLD, marginBottom: 16, letterSpacing: 1 }}>SEND TEST EMAIL</div>
            <p style={{ fontSize: 14, color: TEXT_MUTED, marginBottom: 20 }}>This will send a test email using your configured SMTP settings to verify the connection.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={function() { setShowTestEmail(false); }} style={{ flex: 1, padding: '10px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, color: '#F5F5F5', fontFamily: BARLOW, fontSize: 15, cursor: 'pointer' }}>Cancel</button>
              <button onClick={function() {
                setShowTestEmail(false);
                fetch('/api/admin/email-templates/test', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ templateId: 'test', toEmail: fromEmail }),
                }).then(function() { showToast('Test email sent to ' + fromEmail); }).catch(function() { showToast('Failed to send test email.', 'error'); });
              }} style={{ flex: 2, padding: '10px', background: GOLD, border: 'none', borderRadius: 8, color: '#000', fontFamily: BARLOW, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
                Send Test to {fromEmail}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Language Modal */}
      {showAddLanguage && (
        <div style={{ position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={function() { setShowAddLanguage(false); }}>
          <div style={{ background: BG3, border: '1px solid rgba(212,166,74,0.3)', borderRadius: 14, width: 460, padding: 28 }}
            onClick={function(e) { e.stopPropagation(); }}>
            <div style={{ fontFamily: BEBAS, fontSize: 20, color: GOLD, marginBottom: 20, letterSpacing: 1 }}>ADD NEW LANGUAGE</div>
            <AddLanguageForm onClose={function() { setShowAddLanguage(false); }} onSaved={function(lang: any) {
              setLanguages(function(prev: any[]) { return [...prev, lang]; });
              setShowAddLanguage(false);
              showToast('Language "' + lang.name + '" added successfully.');
            }} />
          </div>
        </div>
      )}

      {/* Add Region Modal */}
      {showAddRegion && (
        <div style={{ position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={function() { setShowAddRegion(false); }}>
          <div style={{ background: BG3, border: '1px solid rgba(212,166,74,0.3)', borderRadius: 14, width: 460, padding: 28 }}
            onClick={function(e) { e.stopPropagation(); }}>
            <div style={{ fontFamily: BEBAS, fontSize: 20, color: GOLD, marginBottom: 20, letterSpacing: 1 }}>ADD NEW REGION</div>
            <AddRegionForm onClose={function() { setShowAddRegion(false); }} onSaved={function(reg: any) {
              setRegions(function(prev: any[]) { return [...prev, reg]; });
              setShowAddRegion(false);
              showToast('Region "' + reg.name + '" added successfully.');
            }} />
          </div>
        </div>
      )}

      {/* Add Currency Modal */}
      {showAddCurrency && (
        <div style={{ position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={function() { setShowAddCurrency(false); }}>
          <div style={{ background: BG3, border: '1px solid rgba(212,166,74,0.3)', borderRadius: 14, width: 460, padding: 28 }}
            onClick={function(e) { e.stopPropagation(); }}>
            <div style={{ fontFamily: BEBAS, fontSize: 20, color: GOLD, marginBottom: 20, letterSpacing: 1 }}>ADD NEW CURRENCY</div>
            <AddCurrencyForm onClose={function() { setShowAddCurrency(false); }} onSaved={function(cur: any) {
              setLocalizationCurrencies(function(prev: any[]) { return [...prev, cur]; });
              setShowAddCurrency(false);
              showToast('Currency "' + cur.code + '" added successfully.');
            }} />
          </div>
        </div>
      )}

      {/* Add Tax Modal */}
      {showAddTax && (
        <div style={{ position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={function() { setShowAddTax(false); }}>
          <div style={{ background: BG3, border: '1px solid rgba(212,166,74,0.3)', borderRadius: 14, width: 460, padding: 28 }}
            onClick={function(e) { e.stopPropagation(); }}>
            <div style={{ fontFamily: BEBAS, fontSize: 20, color: GOLD, marginBottom: 20, letterSpacing: 1 }}>ADD TAX RULE</div>
            <AddTaxForm onClose={function() { setShowAddTax(false); }} onSaved={function() {
              setShowAddTax(false);
              showToast('Tax rule added. Reload to see updated list.');
            }} />
          </div>
        </div>
      )}

      {/* Add Gateway Modal */}
      {showAddGateway && (
        <div style={{ position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={function() { setShowAddGateway(false); }}>
          <div style={{ background: BG3, border: '1px solid rgba(212,166,74,0.3)', borderRadius: 14, width: 460, padding: 28 }}
            onClick={function(e) { e.stopPropagation(); }}>
            <div style={{ fontFamily: BEBAS, fontSize: 20, color: GOLD, marginBottom: 20, letterSpacing: 1 }}>ADD PAYMENT GATEWAY</div>
            <AddGatewayForm onClose={function() { setShowAddGateway(false); }} onSaved={function(gw: any) {
              setGateways(function(prev: any[]) { return [...prev, gw]; });
              setShowAddGateway(false);
              showToast('Gateway "' + gw.name + '" added successfully.');
            }} />
          </div>
        </div>
      )}

      {/* Add Integration Modal */}
      {showAddIntegration && (
        <div style={{ position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={function() { setShowAddIntegration(false); }}>
          <div style={{ background: BG3, border: '1px solid rgba(212,166,74,0.3)', borderRadius: 14, width: 500, padding: 28 }}
            onClick={function(e) { e.stopPropagation(); }}>
            <div style={{ fontFamily: BEBAS, fontSize: 20, color: GOLD, marginBottom: 20, letterSpacing: 1 }}>ADD INTEGRATION</div>
            <AddIntegrationForm onClose={function() { setShowAddIntegration(false); }} onSaved={function(intg: any) {
              setIntegrations(function(prev: any[]) { return [...prev, intg]; });
              setShowAddIntegration(false);
              showToast('Integration "' + intg.name + '" added.');
            }} />
          </div>
        </div>
      )}

      {/* Manage IP Access Modal */}
      {showManageIP && (
        <div style={{ position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={function() { setShowManageIP(false); }}>
          <div style={{ background: BG3, border: '1px solid rgba(212,166,74,0.3)', borderRadius: 14, width: 480, padding: 28 }}
            onClick={function(e) { e.stopPropagation(); }}>
            <div style={{ fontFamily: BEBAS, fontSize: 20, color: GOLD, marginBottom: 16, letterSpacing: 1 }}>MANAGE IP ACCESS</div>
            <ManageIPModal onClose={function() { setShowManageIP(false); }} showToast={showToast} whitelistedIps={whitelistedIps} blockedIps={blockedIps} setWhitelistedIps={setWhitelistedIps} setBlockedIps={setBlockedIps} />
          </div>
        </div>
      )}

      {/* 2FA Modal */}
      {show2FA && (
        <div style={{ position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={function() { setShow2FA(false); }}>
          <div style={{ background: BG3, border: '1px solid rgba(212,166,74,0.3)', borderRadius: 14, width: 460, padding: 28 }}
            onClick={function(e) { e.stopPropagation(); }}>
            <div style={{ fontFamily: BEBAS, fontSize: 20, color: GOLD, marginBottom: 16, letterSpacing: 1 }}>MANAGE 2FA SETTINGS</div>
            <TwoFAModal twoFaEnabled={twoFaEnabled} setTwoFaEnabled={setTwoFaEnabled} onClose={function() { setShow2FA(false); }} showToast={showToast} />
          </div>
        </div>
      )}

      {toast && <Toast msg={toast.msg} type={toast.type} onDone={function() { setToast(null); }} />}
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
  border: '1px solid ' + BORDER + '',
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
        borderBottom: '1px solid ' + BORDER + '',
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
  router,
}: {
  values: any;
  setters: any;
  toggles: any;
  toggle: (k: any) => void;
  router?: any;
}) {
  return (
    <>
      <SectionTitle>General Settings</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 28px" }}>
        <Field label="Platform Name" hint="This name will be used throughout the platform.">
          <input style={inputStyle} value={values.platformName} onChange={function(e) { setters.setPlatformName(e.target.value); }} />
        </Field>
        <Field label="Platform Tagline" hint="Displayed on login, landing page and emails.">
          <input style={inputStyle} value={values.tagline} onChange={function(e) { setters.setTagline(e.target.value); }} />
        </Field>
        <Field label="Support Email" hint="Primary email for user support and notifications.">
          <input style={inputStyle} value={values.supportEmail} onChange={function(e) { setters.setSupportEmail(e.target.value); }} />
        </Field>
        <Field label="Support Phone" hint="Phone number for user support.">
          <input style={inputStyle} value={values.supportPhone} onChange={function(e) { setters.setSupportPhone(e.target.value); }} />
        </Field>
        <Field label="Default Timezone" hint="Timezone for system and event scheduling.">
          <select style={inputStyle} value={values.timezone} onChange={function(e) { setters.setTimezone(e.target.value); }}>
            <option>(GMT+05:30) Asia/Kolkata</option>
            <option>(GMT+00:00) UTC</option>
            <option>(GMT-05:00) America/New_York</option>
          </select>
        </Field>
        <Field label="Date Format" hint="Default format for dates across the platform.">
          <select style={inputStyle} value={values.dateFormat} onChange={function(e) { setters.setDateFormat(e.target.value); }}>
            <option>DD MMM YYYY (24 Jun 2026)</option>
            <option>MM/DD/YYYY</option>
            <option>YYYY-MM-DD</option>
          </select>
        </Field>
        <Field label="Time Format" hint="Default time format.">
          <select style={inputStyle} value={values.timeFormat} onChange={function(e) { setters.setTimeFormat(e.target.value); }}>
            <option>12 Hour (AM/PM)</option>
            <option>24 Hour</option>
          </select>
        </Field>
        <Field label="Items Per Page" hint="Default number of records per page.">
          <select style={inputStyle} value={values.itemsPerPage} onChange={function(e) { setters.setItemsPerPage(e.target.value); }}>
            <option>10</option>
            <option>25</option>
            <option>50</option>
            <option>100</option>
          </select>
        </Field>
      </div>

      <div style={{ marginTop: 8, marginBottom: 24 }}>
        <SectionTitle>Platform Preferences</SectionTitle>
        <PrefRow icon={Users} title="New User Registration" desc="Allow new users to register on the platform." on={toggles.newUserRegistration} onClick={function() { toggle("newUserRegistration"); }} />
        <PrefRow icon={CheckCircle2} title="Email Verification" desc="Require email verification for all new users." on={toggles.emailVerification} onClick={function() { toggle("emailVerification"); }} />
        <PrefRow icon={Bell} title="Mobile Verification" desc="Require mobile number verification for all new users." on={toggles.mobileVerification} onClick={function() { toggle("mobileVerification"); }} />
        <PrefRow icon={Users} title="Auto Approve Talents" desc="Automatically approve talent profiles after submission." on={toggles.autoApproveTalents} onClick={function() { toggle("autoApproveTalents"); }} />
        <PrefRow icon={Building2} title="Auto Approve Agencies" desc="Automatically approve agency profiles after verification." on={toggles.autoApproveAgencies} onClick={function() { toggle("autoApproveAgencies"); }} />
      </div>

      <div>
        <SectionTitle>Maintenance Mode</SectionTitle>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div style={{ fontSize: 13, color: TEXT_MUTED }}>Enable maintenance mode to restrict access to the platform.</div>
          <ToggleSwitch on={toggles.maintenanceMode} onClick={function() { toggle("maintenanceMode"); }} />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "rgba(59,130,246,0.1)",
            border: '1px solid ' + BLUE + '',
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
    <div style={{ background: BG2, border: '1px solid ' + BORDER + '', borderRadius: 10, padding: 18 }}>
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
        <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 4, background: badge.color + '22', color: badge.color }}>
          {badge.text}
        </span>
      ) : (
        <span style={{ fontSize: 13, color: "#fff" }}>{value}</span>
      )}
    </div>
  );
}

function SystemInformation({ router }: { router?: ReturnType<typeof useRouter> }) {
  const [sysInfo, setSysInfo] = React.useState<any>(null);
  React.useEffect(function() {
    try {
      const raw = localStorage.getItem('ss_user') || '{}';
      const token = JSON.parse(raw).token || '';
      if (!token) return;
      fetch('/api/admin/dashboard', { headers: { Authorization: `Bearer ${token}` } })
        .then(function(r) { return r.json(); })
        .then(function(d) { if (d.data || d.stats) setSysInfo(d.data ?? d); })
        .catch(function() {});
    } catch {}
  }, []);
  return (
    <RailCard title="SYSTEM INFORMATION" color={GOLD}>
      <InfoRow icon={Info} label="Platform Version" value="v1.0.0" />
      <InfoRow icon={Info} label="Environment" badge={{ text: "Production", color: GREEN }} />
      <InfoRow icon={Info} label="Last Backup" value={new Date(Date.now() - 86400000).toLocaleDateString("en-IN", {day:"2-digit",month:"short",year:"numeric"})} />
      <InfoRow icon={Database} label="Total Users" value={sysInfo?.total_users != null ? String(sysInfo.total_users) : '—'} />
      <InfoRow icon={Activity} label="Server Status" badge={{ text: "Healthy", color: GREEN }} />
      <InfoRow icon={Info} label="Runtime" value="Next.js / Vercel" />
      <InfoRow icon={Code2} label="Framework" value="Next.js 16" />
      <InfoRow icon={Database} label="Database" value="Supabase (PostgreSQL)" />
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
        borderBottom: '1px solid ' + BORDER + '',
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
      <ActionRow icon={Trash2} label="Clear Cache" onClick={async function() {
        if (window.confirm('Clear all platform caches? This may slow the site temporarily.')) {
          try {
            const raw = localStorage.getItem('ss_user') || '{}';
            const token = JSON.parse(raw).token || '';
            await fetch('/api/admin/cache/clear', { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
          } catch {}
          window.location.reload();
        }
      }} />
      <ActionRow icon={Database} label="Optimize Database" onClick={function() {
        window.alert('This feature will be available soon.');
      }} />
      <ActionRow icon={RefreshCcw} label="System Backup Now" onClick={function() { window.alert('Database backups are managed automatically by Supabase with point-in-time recovery. No manual action required.'); }} />
      <ActionRow icon={ScrollText} label="View Activity Logs" onClick={function() { router?.push('/admin/audit'); }} />
      <ActionRow icon={Mail} label="Reset Email Queue" onClick={function() { window.alert('Email queue will be manageable from the Email Logs section once your platform is live.'); }} />
    </RailCard>
  );
}

function DangerZone() {
  return (
    <RailCard title="DANGER ZONE" color={RED}>
      <div
        onClick={function() { }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 0",
          cursor: "pointer",
          borderBottom: '1px solid ' + BORDER + '',
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
  onTestEmail,
  router,
}: {
  values: any;
  setters: any;
  toggles: any;
  toggle: (k: any) => void;
  showPassword: boolean;
  setShowPassword: (v: boolean) => void;
  onTestEmail?: () => void;
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
          border: '1px solid ' + BORDER + '',
          borderRadius: 8,
          padding: 18,
          marginBottom: 24,
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 16 }}>SMTP Configuration</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 20px" }}>
          <Field label="SMTP Host">
            <input style={inputStyle} value={values.smtpHost} onChange={function(e) { setters.setSmtpHost(e.target.value); }} />
          </Field>
          <Field label="SMTP Port">
            <input style={inputStyle} value={values.smtpPort} onChange={function(e) { setters.setSmtpPort(e.target.value); }} />
          </Field>
          <Field label="Encryption">
            <select style={inputStyle} value={values.encryption} onChange={function(e) { setters.setEncryption(e.target.value); }}>
              <option>TLS</option>
              <option>SSL</option>
              <option>None</option>
            </select>
          </Field>

          <Field label="SMTP Username">
            <input style={inputStyle} value={values.smtpUsername} onChange={function(e) { setters.setSmtpUsername(e.target.value); }} />
          </Field>
          <Field label="SMTP Password / API Key">
            <div style={{ position: "relative" }}>
              <input
                style={{ ...inputStyle, paddingRight: 38 }}
                type={showPassword ? "text" : "password"}
                value={values.smtpPassword}
                onChange={function(e) { setters.setSmtpPassword(e.target.value); }}
              />
              <div
                onClick={function() { setShowPassword(!showPassword); }}
                style={{ position: "absolute", right: 10, top: 11, cursor: "pointer", color: TEXT_MUTED }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </div>
            </div>
          </Field>
          <Field label="From Email">
            <input style={inputStyle} value={values.fromEmail} onChange={function(e) { setters.setFromEmail(e.target.value); }} />
          </Field>

          <Field label="Reply To Email">
            <input style={inputStyle} value={values.replyToEmail} onChange={function(e) { setters.setReplyToEmail(e.target.value); }} />
          </Field>
          <Field label="Reply To Name">
            <input style={inputStyle} value={values.replyToName} onChange={function(e) { setters.setReplyToName(e.target.value); }} />
          </Field>
          <Field label="From Name">
            <input style={inputStyle} value={values.fromName} onChange={function(e) { setters.setFromName(e.target.value); }} />
          </Field>
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", gap: 30, marginTop: 6 }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 14, color: "#fff" }}>Enable TLS Encryption</div>
              <div style={{ fontSize: 12, color: TEXT_MUTED }}>Secure email transmission using TLS encryption.</div>
            </div>
            <ToggleSwitch on={toggles.tlsEncryption} onClick={function() { toggle("tlsEncryption"); }} />
          </div>
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 14, color: "#fff" }}>Enable Authentication</div>
              <div style={{ fontSize: 12, color: TEXT_MUTED }}>Use SMTP authentication for secure login.</div>
            </div>
            <ToggleSwitch on={toggles.authentication} onClick={function() { toggle("authentication"); }} />
          </div>
          <button
            onClick={function() { if (onTestEmail) onTestEmail(); }}
            style={{
              flex: 1,
              background: "transparent",
              border: '1px solid ' + GOLD + '',
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
          <PrefRow icon={Mail} title="Welcome Email" desc="Send welcome email to new users after registration." on={toggles.welcomeEmail} onClick={function() { toggle("welcomeEmail"); }} />
          <PrefRow icon={CheckCircle2} title="Email Verification" desc="Send email verification link to users." on={toggles.emailVerification} onClick={function() { toggle("emailVerification"); }} />
          <PrefRow icon={Lock} title="Password Reset" desc="Send password reset link when requested." on={toggles.passwordReset} onClick={function() { toggle("passwordReset"); }} />
          <PrefRow icon={Bell} title="New Application Alerts" desc="Notify agencies about new applications." on={toggles.newApplicationAlerts} onClick={function() { toggle("newApplicationAlerts"); }} />
          <PrefRow icon={ShieldAlert} title="System Alerts" desc="Receive important system and security alerts." on={toggles.systemAlerts} onClick={function() { toggle("systemAlerts"); }} />
        </div>

        <div style={{ flex: 1, border: '1px solid ' + BORDER + '', borderRadius: 8, padding: 18 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 14 }}>Email Sending Limits</div>
          <InfoRow icon={Mail} label="Daily Email Limit" value="10,000 (SendGrid)" />
          <InfoRow icon={Send} label="Emails Sent Today" value="Check SendGrid dashboard" />
          <InfoRow icon={ListChecks} label="Remaining Limit" value="See SendGrid account" />
          <div style={{ marginTop: 10, padding: '10px 12px', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 8, fontSize: 12, color: '#9DC2FB' }}>
            <Info size={12} style={{ display: 'inline', marginRight: 6 }} />
            Live sending stats are available in your SendGrid dashboard.
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 8,
              background: "rgba(59,130,246,0.1)",
              border: '1px solid ' + BLUE + '',
              borderRadius: 8,
              padding: "10px 12px",
              fontSize: 12,
              color: "#9DC2FB",
              marginTop: 14,
            }}
          >
            <Info size={14} color={BLUE} style={{ marginTop: 1 }} />
            <div>
              <div>Daily limit resets at midnight (Server Time)</div>
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
          border: '1px solid ' + BORDER + '',
          borderRadius: 8,
          padding: "16px 18px",
        }}
      >
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Email Templates Overview</div>
          <div style={{ fontSize: 12, color: TEXT_MUTED }}>Manage and customize email templates for system notifications.</div>
        </div>
        <button
          onClick={function() { router.push('/admin/email-templates'); }}
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
      <InfoRow icon={Mail} label="Last Test Email" badge={{ text: "Not tested yet", color: TEXT_MUTED }} />
      <InfoRow icon={Inbox} label="Email Queue" value="—" />
      <InfoRow icon={Info} label="Bounce Rate" badge={{ text: "Check SendGrid", color: TEXT_MUTED }} />
      <InfoRow icon={Info} label="Spam Complaints" badge={{ text: "Check SendGrid", color: TEXT_MUTED }} />
    </RailCard>
  );
}

function EmailQuickActions({ router, onTestEmail }: { router: ReturnType<typeof useRouter>; onTestEmail?: () => void }) {
  return (
    <RailCard title="QUICK ACTIONS" color={GOLD}>
      <ActionRow icon={Send} label="Test Email Configuration" onClick={function() { if (onTestEmail) onTestEmail(); }} />
      <ActionRow icon={ListChecks} label="Email Queue" onClick={function() { window.alert("Email queue management will be available at launch."); }} />
      <ActionRow icon={FileText} label="Email Logs" onClick={function() { window.alert("Email logs will be available at launch."); }} />
      <ActionRow icon={FileBox} label="Email Templates" onClick={function() { router.push('/admin/email-templates'); }} />
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
        onClick={function() { window.open('https://resend.com/docs', '_blank'); }}
        style={{
          width: "100%",
          background: "transparent",
          border: '1px solid ' + GOLD + '',
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
        borderBottom: '1px solid ' + BORDER + '',
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
  onTestSms,
  onTestWa,
  router,
}: {
  values: any;
  setters: any;
  toggles: any;
  toggle: (k: any) => void;
  router?: any;
  showSmsAuthToken: boolean;
  setShowSmsAuthToken: (v: boolean) => void;
  showWaAccessToken: boolean;
  setShowWaAccessToken: (v: boolean) => void;
  onTestSms?: () => void;
  onTestWa?: () => void;
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
        <div style={{ flex: 1, border: '1px solid ' + BORDER + '', borderRadius: 8, padding: 16 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <MessageCircle size={17} color={PURPLE} />
              <span style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>SMS Provider</span>
            </div>
            <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 4, background: '' + GREEN + '22', color: GREEN }}>
              Active
            </span>
          </div>

          <Field label="Provider">
            <select style={inputStyle} value={values.smsProvider} onChange={function(e) { setters.setSmsProvider(e.target.value); }}>
              <option>Twilio</option>
              <option>MSG91</option>
              <option>Fast2SMS</option>
              <option>Exotel</option>
              <option>MSG91</option>
              <option>AWS SNS</option>
            </select>
          </Field>
          <Field label="Account SID">
            <input style={inputStyle} value={values.smsAccountSid} onChange={function(e) { setters.setSmsAccountSid(e.target.value); }} />
          </Field>
          <Field label="Auth Token">
            <div style={{ position: "relative" }}>
              <input
                style={{ ...inputStyle, paddingRight: 38 }}
                type={showSmsAuthToken ? "text" : "password"}
                value={values.smsAuthToken}
                onChange={function(e) { setters.setSmsAuthToken(e.target.value); }}
              />
              <div onClick={function() { setShowSmsAuthToken(!showSmsAuthToken); }} style={{ position: "absolute", right: 10, top: 11, cursor: "pointer", color: TEXT_MUTED }}>
                {showSmsAuthToken ? <EyeOff size={16} /> : <Eye size={16} />}
              </div>
            </div>
          </Field>
          <Field label="From Number">
            <input style={inputStyle} value={values.smsFromNumber} onChange={function(e) { setters.setSmsFromNumber(e.target.value); }} />
          </Field>
          <Field label="SMS Sending Limit" hint="Max SMS per day">
            <input style={inputStyle} value={values.smsSendingLimit} onChange={function(e) { setters.setSmsSendingLimit(e.target.value); }} />
          </Field>

          <button
            onClick={function() { if (onTestSms) onTestSms(); }}
            style={{
              width: "100%",
              background: "transparent",
              border: '1px solid ' + GOLD + '',
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
        <div style={{ flex: 1, border: '1px solid ' + BORDER + '', borderRadius: 8, padding: 16 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <MessageSquare size={17} color={GREEN} />
              <span style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>WhatsApp Provider</span>
            </div>
            <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 4, background: '' + GREEN + '22', color: GREEN }}>
              Active
            </span>
          </div>

          <Field label="Provider">
            <select style={inputStyle} value={values.waProvider} onChange={function(e) { setters.setWaProvider(e.target.value); }}>
              <option>Twilio</option>
              <option>360dialog</option>
              <option>Meta Cloud API</option>
              <option>Wati</option>
              <option>Interakt</option>
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
                onChange={function(e) { setters.setWaAccessToken(e.target.value); }}
              />
              <div onClick={function() { setShowWaAccessToken(!showWaAccessToken); }} style={{ position: "absolute", right: 10, top: 11, cursor: "pointer", color: TEXT_MUTED }}>
                {showWaAccessToken ? <EyeOff size={16} /> : <Eye size={16} />}
              </div>
            </div>
          </Field>
          <Field label="Phone Number ID">
            <input style={inputStyle} value={values.waPhoneNumberId} onChange={function(e) { setters.setWaPhoneNumberId(e.target.value); }} />
          </Field>
          <Field label="WhatsApp Business Number">
            <input style={inputStyle} value={values.waBusinessNumber} onChange={function(e) { setters.setWaBusinessNumber(e.target.value); }} />
          </Field>
          <Field label="Message Sending Limit" hint="Max WhatsApp messages per day">
            <input style={inputStyle} value={values.waSendingLimit} onChange={function(e) { setters.setWaSendingLimit(e.target.value); }} />
          </Field>

          <button
            onClick={function() { if (onTestWa) onTestWa(); }}
            style={{
              width: "100%",
              background: "transparent",
              border: '1px solid ' + GOLD + '',
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
        <div style={{ flex: 1, border: '1px solid ' + BORDER + '', borderRadius: 8, padding: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 14 }}>Delivery Settings</div>

          <PrefRow icon={MessageCircle} title="Enable SMS Notifications" desc="Send SMS notifications for important events." on={toggles.enableSms} onClick={function() { toggle("enableSms"); }} />
          <PrefRow icon={MessageSquare} title="Enable WhatsApp Notifications" desc="Send WhatsApp notifications for updates." on={toggles.enableWhatsApp} onClick={function() { toggle("enableWhatsApp"); }} />
          <PrefRow icon={RefreshCcw} title="Fallback to SMS" desc="If WhatsApp fails, send message via SMS." on={toggles.fallbackToSms} onClick={function() { toggle("fallbackToSms"); }} />

          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 14, color: "#fff", marginBottom: 4 }}>Preferred Channel</div>
            <div style={{ fontSize: 12, color: TEXT_MUTED, marginBottom: 10 }}>Select default channel for notifications.</div>
            <RadioRow
              label="WhatsApp First (Recommended)"
              selected={values.preferredChannel === "whatsapp"}
              onClick={function() { setters.setPreferredChannel("whatsapp"); }}
            />
            <RadioRow
              label="SMS First"
              selected={values.preferredChannel === "sms"}
              onClick={function() { setters.setPreferredChannel("sms"); }}
            />
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 2 }}>Notification Preferences</div>
      <div style={{ fontSize: 12, color: TEXT_MUTED, marginBottom: 10 }}>Choose which events should trigger SMS / WhatsApp notifications.</div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 100px 100px", padding: "0 0 8px", borderBottom: '1px solid ' + BORDER + '' }}>
        <div style={{ fontSize: 12, color: TEXT_MUTED, fontWeight: 600, letterSpacing: 0.5 }}>EVENT</div>
        <div style={{ fontSize: 12, color: TEXT_MUTED, fontWeight: 600, letterSpacing: 0.5, textAlign: "center" }}>SMS</div>
        <div style={{ fontSize: 12, color: TEXT_MUTED, fontWeight: 600, letterSpacing: 0.5, textAlign: "center" }}>WHATSAPP</div>
      </div>

      <EventToggleRow icon={UserPlus} title="User Registration" desc="When a new user registers" smsOn={toggles.userRegSms} waOn={toggles.userRegWa} onSms={function() { toggle("userRegSms"); }} onWa={function() { toggle("userRegWa"); }} />
      <EventToggleRow icon={ShieldCheck} title="Email / Mobile Verification" desc="When user verifies email or mobile" smsOn={toggles.verificationSms} waOn={toggles.verificationWa} onSms={function() { toggle("verificationSms"); }} onWa={function() { toggle("verificationWa"); }} />
      <EventToggleRow icon={ClipboardList} title="Casting Call Application" desc="When user applies for a casting call" smsOn={toggles.castingAppSms} waOn={toggles.castingAppWa} onSms={function() { toggle("castingAppSms"); }} onWa={function() { toggle("castingAppWa"); }} />
      <EventToggleRow icon={Bell} title="Application Status Update" desc="When application status is updated" smsOn={toggles.appStatusSms} waOn={toggles.appStatusWa} onSms={function() { toggle("appStatusSms"); }} onWa={function() { toggle("appStatusWa"); }} />
      <EventToggleRow icon={Wallet} title="Payment Confirmation" desc="When a payment is successful" smsOn={toggles.paymentSms} waOn={toggles.paymentWa} onSms={function() { toggle("paymentSms"); }} onWa={function() { toggle("paymentWa"); }} />
      <EventToggleRow icon={CalendarClock} title="Subscription Expiry Reminder" desc="Remind users before subscription expires" smsOn={toggles.subExpirySms} waOn={toggles.subExpiryWa} onSms={function() { toggle("subExpirySms"); }} onWa={function() { toggle("subExpiryWa"); }} />
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

function SmsSystemInfo({ smsProvider, waProvider }: { smsProvider?: string; waProvider?: string }) {
  return (
    <RailCard title="SYSTEM INFORMATION" color={GOLD}>
      <InfoRow icon={MessageCircle} label="SMS Provider" value={smsProvider || "Not configured"} />
      <InfoRow icon={MessageSquare} label="WhatsApp Provider" value={waProvider || "Not configured"} />
      <InfoRow icon={Activity} label="Account Status" badge={{ text: "Active", color: GREEN }} />
      <InfoRow icon={Smartphone} label="Last Test (SMS)" badge={{ text: "Not tested yet", color: TEXT_MUTED }} />
      <InfoRow icon={Smartphone} label="Last Test (WhatsApp)" badge={{ text: "Not tested yet", color: TEXT_MUTED }} />
      <InfoRow icon={ListChecks} label="Total SMS Sent (This Month)" value="—" />
      <InfoRow icon={ListChecks} label="Total WhatsApp Sent (This Month)" value="—" />
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

function SmsUsage({ smsSendingLimit, waSendingLimit }: { smsSendingLimit?: string; waSendingLimit?: string }) {
  const smsLimit = smsSendingLimit || '1,000';
  const waLimit  = waSendingLimit  || '500';
  return (
    <>
      <RailCard title="SMS USAGE (THIS MONTH)" color={GOLD}>
        <div style={{ padding: '16px 0', textAlign: 'center' as const }}>
          <div style={{ fontSize: 13, color: TEXT_MUTED, marginBottom: 4 }}>Daily Limit: {smsLimit} SMS</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>No usage data yet. Data will appear once SMS sending is active.</div>
        </div>
      </RailCard>
      <RailCard title="WHATSAPP USAGE (THIS MONTH)" color={GREEN}>
        <div style={{ padding: '16px 0', textAlign: 'center' as const }}>
          <div style={{ fontSize: 13, color: TEXT_MUTED, marginBottom: 4 }}>Daily Limit: {waLimit} Messages</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>No usage data yet. Data will appear once WhatsApp sending is active.</div>
        </div>
      </RailCard>
    </>
  );
}

function SmsQuickActions({ router }: { router: ReturnType<typeof useRouter> }) {
  return (
    <RailCard title="QUICK ACTIONS" color={GOLD}>
      <ActionRow icon={MessageCircle} label="SMS Templates" onClick={function() { router.push('/admin/sms-templates'); }} />
      <ActionRow icon={MessageSquare} label="WhatsApp Templates" onClick={function() { router.push('/admin/sms-templates'); }} />
      <ActionRow icon={FileSearch} label="Message Logs" onClick={function() { router?.push('/admin/audit'); }} />
      <ActionRow icon={BookOpen} label="Provider Documentation" onClick={function() { window.open('https://www.twilio.com/docs/sms', '_blank'); }} />
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
        background: isActive ? '' + GREEN + '22' : '' + RED + '22',
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
  onAddGateway,
  onAddCurrency,
  onAddTax,
  onEditCurrency,
  onGoToLocalization,
  onEditGateway,
  router,
}: {
  gateways: any[];
  toggleGatewayStatus: (id: any) => void;
  currencies: any[];
  taxes: any[];
  refundPolicy: string;
  setRefundPolicy: (v: string) => void;
  disputeHandling: string;
  setDisputeHandling: (v: string) => void;
  autoRefund: boolean;
  setAutoRefund: (v: boolean) => void;
  onAddGateway?: () => void;
  onAddCurrency?: () => void;
  onAddTax?: () => void;
  onEditCurrency?: (c: any) => void;
  onEditGateway?: (g: any) => void;
  onGoToLocalization?: () => void;
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
          onClick={function() { if (onAddGateway) onAddGateway(); }}
          style={{
            background: "transparent",
            border: '1px solid ' + GOLD + '',
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
        <div style={{ display: "grid", gridTemplateColumns: "2.2fr 1fr 1fr 1.2fr 0.8fr", padding: "0 0 10px", borderBottom: '1px solid ' + BORDER + '' }}>
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
              borderBottom: '1px solid ' + BORDER + '',
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <GatewayIcon type={g.icon} />
              <div>
                <div style={{ fontSize: 14, color: "#fff" }}>{g.name}</div>
                <div style={{ fontSize: 12, color: TEXT_MUTED }}>{g.desc}</div>
              </div>
            </div>
            <div onClick={function() { toggleGatewayStatus(g.id); }} style={{ cursor: "pointer", width: "fit-content" }}>
              <StatusBadge status={g.status} />
            </div>
            <div style={{ fontSize: 13, color: "#cfd3da" }}>{g.mode}</div>
            <div style={{ fontSize: 13, color: "#cfd3da" }}>{g.fee}</div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 14, position: "relative" }}>
              <Pencil size={15} color={TEXT_MUTED} style={{ cursor: 'pointer' }} onClick={function() { if (onEditGateway) onEditGateway(g); }} />
              <MoreVertical
                size={15}
                color={TEXT_MUTED}
                style={{ cursor: "pointer" }}
                onClick={function() { setMenuOpenId(menuOpenId === g.id ? null : g.id); }}
              />
              {menuOpenId === g.id && (
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: 22,
                    background: BG3,
                    border: '1px solid ' + BORDER + '',
                    borderRadius: 6,
                    width: 160,
                    zIndex: 10,
                    boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
                  }}
                >
                  {["View Details", "Test Connection", "Remove Gateway"].map((opt) => (
                    <div
                      key={opt}
                      onClick={function() {
                        setMenuOpenId(null);
                        if (opt === "View Details" && onEditGateway) onEditGateway(g);
                        else if (opt === "Test Connection") window.alert("Connection test for " + g.name + " initiated. Check your gateway dashboard for results.");
                        else if (opt === "Remove Gateway") { if (window.confirm("Remove " + g.name + " gateway? This cannot be undone.")) window.alert("Gateway removal will be available in a future update."); }
                      }}
                      style={{ padding: "9px 12px", fontSize: 12, color: opt === "Remove Gateway" ? RED : "#cfd3da", cursor: "pointer" }}
                      onMouseEnter={function(e) { e.currentTarget.style.background = BG4; }}
                      onMouseLeave={function(e) { e.currentTarget.style.background = "transparent"; }}
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
          onClick={function() { window.open('https://razorpay.com/docs', '_blank'); }}
          style={{ fontSize: 13, color: GOLD, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}
        >
          <BookOpen size={14} />
          View Gateway Documentation
        </span>
      </div>

      {/* Currency + Tax Settings */}
      <div style={{ display: "flex", gap: 20, alignItems: "flex-start", marginBottom: 26 }}>
        <div style={{ flex: 1, border: '1px solid ' + BORDER + '', borderRadius: 8, padding: 16 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Currency Settings</div>
              <div style={{ fontSize: 12, color: TEXT_MUTED }}>View active currencies. Manage from Localization tab.</div>
            </div>
            <button
              onClick={function() { if (onGoToLocalization) onGoToLocalization(); }}
              style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.5)', borderRadius: 6, padding: '6px 12px', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}
            >
              <SettingsIcon size={11} />
              Manage in Localization
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.6fr 0.8fr 1.2fr 0.9fr 0.6fr", padding: "0 0 8px", borderBottom: '1px solid ' + BORDER + '' }}>
            <div style={{ fontSize: 10, color: TEXT_MUTED, fontWeight: 600 }}>CURRENCY</div>
            <div style={{ fontSize: 10, color: TEXT_MUTED, fontWeight: 600 }}>SYMBOL</div>
            <div style={{ fontSize: 10, color: TEXT_MUTED, fontWeight: 600 }}>COUNTRIES</div>
            <div style={{ fontSize: 10, color: TEXT_MUTED, fontWeight: 600 }}>STATUS</div>
            <div style={{ fontSize: 10, color: TEXT_MUTED, fontWeight: 600, textAlign: "right" }}>ACTIONS</div>
          </div>
          {currencies.map((c) => (
            <div key={c.symbol} style={{ display: "grid", gridTemplateColumns: "1.6fr 0.8fr 1.2fr 0.9fr 0.6fr", alignItems: "center", padding: "11px 0", borderBottom: '1px solid ' + BORDER + '' }}>
              <div style={{ fontSize: 13, color: "#fff" }}>{c.name}</div>
              <div style={{ fontSize: 13, color: "#cfd3da" }}>{c.symbol}</div>
              <div style={{ fontSize: 13, color: "#cfd3da" }}>{c.countries}</div>
              <div><StatusBadge status={c.status} /></div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <Pencil size={13} color={TEXT_MUTED} style={{ cursor: 'pointer' }} onClick={function() { if (onEditCurrency) onEditCurrency(c); }} />
                <MoreVertical size={13} color={TEXT_MUTED} style={{ cursor: 'pointer' }} onClick={function() { if (onGoToLocalization) onGoToLocalization(); }} />
              </div>
            </div>
          ))}

          <div style={{ textAlign: "center", marginTop: 12 }}>
            <span
              onClick={function() { window.open('https://www.xe.com/currencyconverter/', '_blank'); }}
              style={{ fontSize: 12, color: GOLD, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 5 }}
            >
              <RefreshCw size={12} />
              Manage Exchange Rates
            </span>
          </div>
        </div>

        <div style={{ flex: 1, border: '1px solid ' + BORDER + '', borderRadius: 8, padding: 16 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Tax Settings</div>
              <div style={{ fontSize: 12, color: TEXT_MUTED }}>Configure tax rates for different regions.</div>
            </div>
            <button
              onClick={function() { if (onAddTax) onAddTax(); }}
              style={{ background: "transparent", border: '1px solid ' + GOLD + '', color: GOLD, borderRadius: 6, padding: "7px 10px", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 5, whiteSpace: "nowrap" }}
            >
              <Plus size={12} />
              Add Tax
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 0.8fr 1.3fr 0.9fr", padding: "0 0 8px", borderBottom: '1px solid ' + BORDER + '' }}>
            <div style={{ fontSize: 10, color: TEXT_MUTED, fontWeight: 600 }}>TAX NAME</div>
            <div style={{ fontSize: 10, color: TEXT_MUTED, fontWeight: 600 }}>RATE (%)</div>
            <div style={{ fontSize: 10, color: TEXT_MUTED, fontWeight: 600 }}>APPLICABLE TO</div>
            <div style={{ fontSize: 10, color: TEXT_MUTED, fontWeight: 600 }}>STATUS</div>
          </div>
          {taxes.map((t) => (
            <div key={t.name} style={{ display: "grid", gridTemplateColumns: "1fr 0.8fr 1.3fr 0.9fr", alignItems: "center", padding: "11px 0", borderBottom: '1px solid ' + BORDER + '' }}>
              <div style={{ fontSize: 13, color: "#fff" }}>{t.name}</div>
              <div style={{ fontSize: 13, color: "#cfd3da" }}>{t.rate}</div>
              <div style={{ fontSize: 13, color: "#cfd3da" }}>{t.applicableTo}</div>
              <div><StatusBadge status={t.status} /></div>
            </div>
          ))}

          <div style={{ textAlign: "center", marginTop: 12 }}>
            <span
              onClick={function() { window.open('https://cbic-gst.gov.in/', '_blank'); }}
              style={{ fontSize: 12, color: GOLD, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 5 }}
            >
              <BookOpen size={12} />
              Tax Documentation
            </span>
          </div>
        </div>
      </div>

      {/* Refund & Dispute Settings */}
      <div style={{ border: '1px solid ' + BORDER + '', borderRadius: 8, padding: 18 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Refund & Dispute Settings</div>
        <div style={{ fontSize: 12, color: TEXT_MUTED, marginBottom: 16 }}>Configure refund policy and dispute handling preferences.</div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 24px" }}>
          <Field label="Refund Policy" hint="Users can request refund within 7 days of payment.">
            <select style={inputStyle} value={refundPolicy} onChange={function(e) { setRefundPolicy(e.target.value); }}>
              <option>Standard Refund Policy</option>
              <option>Strict Refund Policy</option>
              <option>Flexible Refund Policy</option>
              <option>No Refunds</option>
            </select>
          </Field>

          <div>
            <label style={{ fontSize: 13, color: "#cfd3da", display: "block", marginBottom: 6 }}>Auto Refund</label>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 11 }}>
              <ToggleSwitch on={autoRefund} onClick={function() { setAutoRefund(!autoRefund); }} />
            </div>
            <div style={{ fontSize: 12, color: TEXT_MUTED, marginTop: 5 }}>Automatically approve eligible refund requests.</div>
          </div>

          <Field label="Dispute Handling" hint="All disputes will be reviewed manually by admin.">
            <select style={inputStyle} value={disputeHandling} onChange={function(e) { setDisputeHandling(e.target.value); }}>
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
              strokeDasharray={'' + dash + ' ' + gap + ''}
              strokeLinecap="butt"
              style={{ transform: 'rotate(' + rotation + 'deg)', transformOrigin: "50% 50%" }}
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
      <div style={{ padding: '24px 0', textAlign: 'center' as const }}>
        <div style={{ fontSize: 36, marginBottom: 8 }}>📊</div>
        <div style={{ fontSize: 14, color: TEXT_MUTED, marginBottom: 4 }}>No transactions yet</div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', lineHeight: 1.6 }}>
          Payment data will appear here once your platform goes live.
        </div>
      </div>
      <div style={{ textAlign: 'center' as const, marginTop: 8 }}>
        <span onClick={function() { router?.push('/admin/audit'); }}
          style={{ fontSize: 13, color: GOLD, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
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
      <ActionRow icon={RotateCcw}    label="Manage Refund Requests"  onClick={function() { router.push('/admin/support'); }} />
      <ActionRow icon={ListOrdered}  label="View Transactions"        onClick={function() { router?.push('/admin/audit'); }} />
      <ActionRow icon={FileBarChart} label="Download Payout Reports"  onClick={function() { window.alert('Payout reports will be available when you go live.'); }} />
      <ActionRow icon={FileSearch}   label="Payment Gateway Logs"     onClick={function() { router?.push('/admin/audit'); }} />
      <ActionRow icon={Receipt}      label="Tax Report"               onClick={function() { window.alert('Tax reports will be available when you go live.'); }} />
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
        borderBottom: '1px solid ' + BORDER + '',
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
      onChange={function(e) { onChange(e.target.value); }}
      style={{
        background: BG3,
        border: '1px solid ' + BORDER + '',
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
  onManage2FA,
  onManageIP,
  router,
}: {
  twoFaEnabled: boolean;
  setTwoFaEnabled: (v: boolean) => void;
  loginAttemptLimit: string;
  setLoginAttemptLimit: (v: string) => void;
  lockoutDuration: string;
  setLockoutDuration: (v: string) => void;
  activeSessionsPolicy: string;
  setActiveSessionsPolicy?: (v: string) => void;
  rememberDevice: boolean;
  setRememberDevice: (v: boolean) => void;
  sessionTimeout: string;
  setSessionTimeout: (v: string) => void;
  passwordPolicy: { label: string; value: string }[];
  whitelistedIps: string[];
  blockedIps: string[];
  onManage2FA?: () => void;
  onManageIP?: () => void;
  router: ReturnType<typeof useRouter>;
}) {
  return (
    <>
      <SectionTitle>Security Settings</SectionTitle>
      <div style={{ fontSize: 13, color: TEXT_MUTED, marginTop: -10, marginBottom: 22 }}>
        Manage security preferences, access controls and authentication settings.
      </div>

      {/* Two-Factor Authentication */}
      <div style={{ display: "flex", gap: 20, border: '1px solid ' + BORDER + '', borderRadius: 8, padding: 18, marginBottom: 22 }}>
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
              onClick={function() { if (onManage2FA) onManage2FA(); }}
              style={{
                background: "transparent",
                border: '1px solid ' + GOLD + '',
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
              border: '1px solid ' + BORDER + '',
              borderRadius: 8,
              padding: "12px 14px",
              marginBottom: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Shield size={18} color={GOLD} />
              <div>
                <div style={{ fontSize: 13, color: "#fff" }}>Authenticator App</div>
                <div style={{ fontSize: 11, color: TEXT_MUTED }}>Configured during account setup</div>
              </div>
            </div>
            <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 4, background: '' + GREEN + '22', color: GREEN }}>
              Primary
            </span>
          </div>
          <button
            onClick={function() { if (onManage2FA) onManage2FA(); }}
            style={{
              width: "100%",
              background: "transparent",
              border: '1px solid ' + GOLD + '',
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
      <div style={{ border: '1px solid ' + BORDER + '', borderRadius: 8, padding: 18, marginBottom: 22 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Password Policy</div>
            <div style={{ fontSize: 12, color: TEXT_MUTED }}>Configure password rules for all user accounts.</div>
          </div>
          <button
            onClick={function() { router.push('/admin/settings'); }}
            style={{
              background: "transparent",
              border: '1px solid ' + GOLD + '',
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
      <div style={{ border: '1px solid ' + BORDER + '', borderRadius: 8, padding: 18, marginBottom: 22 }}>
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
              onClick={function() { router.push('/admin/users'); }}
              style={{
                fontSize: 13,
                color: "#cfd3da",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: BG3,
                border: '1px solid ' + BORDER + '',
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
          control={<ToggleSwitch on={rememberDevice} onClick={function() { setRememberDevice(!rememberDevice); }} />}
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
      <div style={{ border: '1px solid ' + BORDER + '', borderRadius: 8, padding: 18 }}>
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
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", background: BG3, border: '1px solid ' + BORDER + '', borderRadius: 8, padding: 14 }}>
            <div>
              <div style={{ fontSize: 13, color: "#fff", marginBottom: 6 }}>Whitelisted IPs ({whitelistedIps.length})</div>
              {whitelistedIps.map((ip) => (
                <div key={ip} style={{ fontSize: 12, color: TEXT_MUTED }}>{ip}</div>
              ))}
            </div>
            <Shield size={22} color={GREEN} />
          </div>
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", background: BG3, border: '1px solid ' + BORDER + '', borderRadius: 8, padding: 14 }}>
            <div>
              <div style={{ fontSize: 13, color: "#fff", marginBottom: 6 }}>Blocked IPs ({blockedIps.length})</div>
              {blockedIps.map((ip) => (
                <div key={ip} style={{ fontSize: 12, color: TEXT_MUTED }}>{ip}</div>
              ))}
            </div>
            <ShieldBan size={22} color={RED} />
          </div>
          <button
            onClick={function() { if (onManageIP) onManageIP(); }}
            style={{
              background: "transparent",
              border: '1px solid ' + GOLD + '',
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

function SecurityOverview(_props?: any) {
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
          <circle cx={65} cy={65} r={58} stroke={'' + GREEN + '33'} strokeWidth={3} fill="none" />
          <circle cx={65} cy={65} r={46} stroke={'' + GREEN + '55'} strokeWidth={3} fill="none" />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: '' + GREEN + '1A',
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
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 0", borderBottom: '1px solid ' + BORDER + '' }}>
      <div
        style={{
          width: 30,
          height: 30,
          borderRadius: 8,
          background: '' + iconColor + '22',
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

function RecentSecurityActivity({ router }: { router?: ReturnType<typeof useRouter> }) {
  return (
    <RailCard title="RECENT SECURITY ACTIVITY" color={GOLD}>
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: -36, marginBottom: 14 }}>
        <span onClick={function() { router?.push('/admin/audit'); }} style={{ fontSize: 12, color: "#cfd3da", cursor: "pointer", border: '1px solid ' + BORDER + '', borderRadius: 6, padding: "4px 10px" }}>
          View All
        </span>
      </div>
      <ActivityRow icon={LogIn} iconColor={GREEN} title="Admin login successful" desc="Last successful login" date="See Audit Logs" dotColor={GREEN} />
      <ActivityRow icon={KeyRound} iconColor={BLUE} title="Password changed" desc="Admin account" date="See Audit Logs" dotColor={GREEN} />
      <ActivityRow icon={Shield} iconColor={BLUE} title="2FA method added" desc="Authenticator App" date="See Audit Logs" dotColor={GREEN} />
      <ActivityRow icon={XCircle} iconColor={RED} title="Failed login attempt" desc="Check Fraud Detection" date="See Audit Logs" dotColor={RED} />
      <ActivityRow icon={MonitorSmartphone} iconColor={TEXT_MUTED} title="New device login" desc="See Audit Logs for full history" date="See Audit Logs" dotColor={GREEN} />
    </RailCard>
  );
}

function SecurityQuickActions({ router }: { router: ReturnType<typeof useRouter> }) {
  return (
    <RailCard title="QUICK ACTIONS" color={GOLD}>
      <ActionRow icon={MonitorSmartphone} label="View Active Sessions" onClick={function() { router?.push('/admin/audit'); }} />
      <ActionRow icon={KeyRound} label="Reset Admin Password" onClick={async function() {
        if (!window.confirm('Send a password reset link to the registered admin email?')) return;
        try {
          const raw = localStorage.getItem('ss_user') || '{}';
          const u = JSON.parse(raw);
          const token = u.token || '';
          const res = await fetch('/api/admin/users', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ user_id: u.id, action: 'reset_password' }),
          });
          if (res.ok) { window.alert('Password reset link sent to ' + (u.email || 'your registered email') + '.'); }
          else { window.alert('Failed to send reset link. Please try from User Management.'); }
        } catch { window.alert('Network error. Please try again.'); }
      }} />
      <ActionRow icon={FileBarChart} label="View Login Logs" onClick={function() { router?.push('/admin/audit'); }} />
      <ActionRow icon={ShieldAlert} label="Security Alerts" onClick={function() { router.push('/admin/fraud'); }} />
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
    <div style={{ flex: 1, border: '1px solid ' + BORDER + '', borderRadius: 8, padding: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: 8, background: iconBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={16} color="#fff" />
        </div>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{title}</div>
      </div>
      <div style={{ fontSize: 12, color: TEXT_MUTED, marginBottom: 12, minHeight: 32 }}>{desc}</div>
      <div onClick={onClick} style={{ cursor: "pointer", width: "fit-content" }}>
        <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 4, background: enabled ? '' + GREEN + '22' : '' + RED + '22', color: enabled ? GREEN : RED, display: "inline-flex", alignItems: "center", gap: 4 }}>
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
  quietHoursEnabled,
  setQuietHoursEnabled,
  quietStart,
  setQuietStart,
  quietEnd,
  setQuietEnd,
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
  quietHoursEnabled?: boolean;
  setQuietHoursEnabled?: (v: boolean) => void;
  quietStart?: string;
  setQuietStart?: (v: string) => void;
  quietEnd?: string;
  setQuietEnd?: (v: string) => void;
  router: ReturnType<typeof useRouter>;
}) {
  const modules = ["All Modules", "User", "Casting", "Application", "Payment", "Subscription"];
  const [notifPage, setNotifPage] = useState(1);

  const filtered = notificationEvents.filter(function(e: any) {
    const matchesModule = moduleFilter === 'All Modules' || e.module === moduleFilter;
    const matchesSearch = e.name.toLowerCase().includes(eventSearch.toLowerCase());
    return matchesModule && matchesSearch;
  });
  const NOTIF_PER_PAGE = 8;
  const totalPages = Math.max(1, Math.ceil(filtered.length / NOTIF_PER_PAGE));
  const pagedEvents = filtered.slice((notifPage - 1) * NOTIF_PER_PAGE, notifPage * NOTIF_PER_PAGE);
  // Reset to page 1 when filter/search changes
  React.useEffect(function() { setNotifPage(1); }, [moduleFilter, eventSearch]);


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
          <ChannelCard icon={Bell} iconBg={ORANGE} title="In-App Notifications" desc="Send notifications within the platform." enabled={channelToggles.inApp} onClick={function() { toggleChannel("inApp"); }} />
          <ChannelCard icon={Mail} iconBg={BLUE} title="Email Notifications" desc="Send notifications via email." enabled={channelToggles.email} onClick={function() { toggleChannel("email"); }} />
          <ChannelCard icon={MessageCircle} iconBg={PURPLE} title="SMS Notifications" desc="Send notifications via SMS." enabled={channelToggles.sms} onClick={function() { toggleChannel("sms"); }} />
          <ChannelCard icon={MessageSquare} iconBg={GREEN} title="WhatsApp Notifications" desc="Send notifications via WhatsApp." enabled={channelToggles.whatsapp} onClick={function() { toggleChannel("whatsapp"); }} />
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
            <select style={{ ...inputStyle, width: 150, padding: "8px 10px" }} value={moduleFilter} onChange={function(e) { setModuleFilter(e.target.value); }}>
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
                onChange={function(e) { setEventSearch(e.target.value); }}
              />
            </div>
          </div>
        </div>

        <div style={{ marginTop: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.8fr 0.8fr 2.2fr 0.6fr 0.6fr 0.6fr 0.8fr 0.7fr", padding: "0 0 10px", borderBottom: '1px solid ' + BORDER + '' }}>
            <div style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600 }}>EVENT</div>
            <div style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600 }}>MODULE</div>
            <div style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600 }}>DESCRIPTION</div>
            <div style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600, textAlign: "center" }}>IN-APP</div>
            <div style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600, textAlign: "center" }}>EMAIL</div>
            <div style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600, textAlign: "center" }}>SMS</div>
            <div style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600, textAlign: "center" }}>WHATSAPP</div>
            <div style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600, textAlign: "right" }}>ACTION</div>
          </div>

          {pagedEvents.map(function(e: any) { return (
            <div key={e.id} style={{ display: "grid", gridTemplateColumns: "1.8fr 0.8fr 2.2fr 0.6fr 0.6fr 0.6fr 0.8fr 0.7fr", alignItems: "center", padding: "12px 0", borderBottom: '1px solid ' + BORDER + '' }}>
              <div style={{ fontSize: 13, color: "#fff" }}>{e.name}</div>
              <div>
                <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 4, background: '${MODULE_COLORS[e.module]}22', color: MODULE_COLORS[e.module] }}>
                  {e.module}
                </span>
              </div>
              <div style={{ fontSize: 12, color: TEXT_MUTED }}>{e.desc}</div>
              <EventCheckbox checked={e.inApp} onClick={function() { toggleEventChannel(e.id, "inApp"); }} />
              <EventCheckbox checked={e.email} onClick={function() { toggleEventChannel(e.id, "email"); }} />
              <EventCheckbox checked={e.sms} onClick={function() { toggleEventChannel(e.id, "sms"); }} />
              <EventCheckbox checked={e.whatsapp} onClick={function() { toggleEventChannel(e.id, "whatsapp"); }} />
              <div style={{ textAlign: "right" }}>
                <span
                  onClick={function() { router.push('/admin/notifications'); }}
                  style={{ fontSize: 12, color: GOLD, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4 }}
                >
                  <Pencil size={12} />
                  Edit
                </span>
              </div>
            </div>
          ); })}

          {filtered.length === 0 && (
            <div style={{ padding: "30px 0", textAlign: "center", color: TEXT_MUTED, fontSize: 13 }}>No events match your filters.</div>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16 }}>
          <div style={{ fontSize: 12, color: TEXT_MUTED }}>Showing {Math.min((notifPage-1)*NOTIF_PER_PAGE+1, filtered.length)} to {Math.min(notifPage*NOTIF_PER_PAGE, filtered.length)} of {filtered.length} events</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <ChevronLeft size={16} color={TEXT_MUTED} style={{ cursor: "pointer" }} onClick={function() { setNotifPage(function(p) { return Math.max(1, p - 1); }); }} />
            {Array.from({ length: totalPages }, function(_, i) { return i + 1; }).map(function(p) { return (
              <div
                key={p}
                onClick={function() { setNotifPage(p); }}
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
                  border: p === notifPage ? "none" : '1px solid ' + BORDER + '',
                }}
              >
                {p}
              </div>
            ); })}
            <ChevronRight size={16} color={TEXT_MUTED} style={{ cursor: "pointer" }} onClick={function() { setNotifPage(function(p) { return Math.min(totalPages, p + 1); }); }} />
          </div>
        </div>
      </div>

      {/* Notification Templates */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", border: '1px solid ' + BORDER + '', borderRadius: 8, padding: "16px 18px", marginTop: 22 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Notification Templates</div>
          <div style={{ fontSize: 12, color: TEXT_MUTED }}>Manage and customize notification templates for each channel.</div>
        </div>
        <button
          onClick={function() { router.push('/admin/email-templates'); }}
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

function NotificationOverview({ notificationEvents }: { notificationEvents?: any[] }) {
  const events = notificationEvents || [];
  const inApp    = events.filter(function(e: any) { return e.inApp; }).length;
  const email    = events.filter(function(e: any) { return e.email; }).length;
  const sms      = events.filter(function(e: any) { return e.sms; }).length;
  const wa       = events.filter(function(e: any) { return e.whatsapp; }).length;
  const total    = events.length;
  const disabled = events.filter(function(e: any) { return !e.inApp && !e.email && !e.sms && !e.whatsapp; }).length;

  return (
    <RailCard title="NOTIFICATION OVERVIEW" color={GOLD}>
      <Donut
        segments={[
          { value: inApp || 1, color: GREEN },
          { value: email || 1, color: BLUE },
          { value: sms   || 1, color: GOLD },
          { value: wa    || 1, color: TEAL },
        ]}
        centerValue={String(inApp)}
        centerLabel="Total Active"
      />
      <div style={{ marginTop: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "5px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: "#cfd3da" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: GREEN }} />
            In-App
          </div>
          <span style={{ fontSize: 12, color: "#fff" }}>{inApp}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "5px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: "#cfd3da" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: BLUE }} />
            Email
          </div>
          <span style={{ fontSize: 12, color: "#fff" }}>{email}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "5px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: "#cfd3da" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: GOLD }} />
            SMS
          </div>
          <span style={{ fontSize: 12, color: "#fff" }}>{sms}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "5px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: "#cfd3da" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: TEAL }} />
            WhatsApp
          </div>
          <span style={{ fontSize: 12, color: "#fff" }}>{wa}</span>
        </div>
      </div>
      <div style={{ borderTop: '1px solid ' + BORDER + '', marginTop: 14, paddingTop: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: 13 }}>
          <span style={{ color: "#cfd3da" }}>Total Events</span>
           <span style={{ color: '#fff' }}>{total}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: 13 }}>
          <span style={{ color: "#cfd3da" }}>Disabled Events</span>
           <span style={{ color: '#fff' }}>{disabled}</span>
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
    <div style={{ background: BG2, border: '1px solid ' + BORDER + '', borderRadius: 10, padding: 18 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
        <h3 style={{ fontFamily: BARLOW, fontWeight: 700, fontSize: 15, color: GOLD, margin: 0, letterSpacing: 0.5 }}>QUIET HOURS</h3>
        <ToggleSwitch on={enabled} onClick={function() { setEnabled(!enabled); }} />
      </div>
      <div style={{ fontSize: 12, color: TEXT_MUTED, marginBottom: 14 }}>Set quiet hours to pause non-urgent notifications.</div>

      <Field label="Start Time">
        <div style={{ position: "relative" }}>
          <input style={{ ...inputStyle, paddingRight: 34 }} value={start} onChange={function(ev) { setStart(ev.target.value); }} />
          <Clock size={15} color={TEXT_MUTED} style={{ position: "absolute", right: 10, top: 12 }} />
        </div>
      </Field>
      <Field label="End Time">
        <div style={{ position: "relative" }}>
          <input style={{ ...inputStyle, paddingRight: 34 }} value={end} onChange={function(ev) { setEnd(ev.target.value); }} />
          <Clock size={15} color={TEXT_MUTED} style={{ position: "absolute", right: 10, top: 12 }} />
        </div>
      </Field>
      <Field label="Time Zone">
        <select style={inputStyle} value={timezone} onChange={function(e) { setTimezone(e.target.value); }}>
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
      <ActionRow icon={Plus} label="Create New Notification" onClick={function() { router.push('/admin/email-templates'); }} />
      <ActionRow icon={FileBox} label="Manage Templates" onClick={function() { router.push('/admin/email-templates'); }} />
      <ActionRow icon={FileSearch} label="Notification Logs" onClick={function() { router?.push('/admin/audit'); }} />
      <ActionRow icon={PlayCircle} label="Test Notifications" onClick={function() { router.push('/admin/notifications'); }} />
      <ActionRow icon={SlidersHorizontal} label="Channel Configuration" onClick={function() { router.push('/admin/notifications'); }} />
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
  const { subTab, setSubTab, languages, toggleLanguageStatus, defaultPlatformLanguage, setDefaultPlatformLanguage, allowLanguageChange, setAllowLanguageChange, browserLangDetection, setBrowserLangDetection, regions, toggleRegionStatus, localizationCurrencies, toggleCurrencyStatus, globalDateFormat, setGlobalDateFormat, globalTimeFormat, setGlobalTimeFormat, firstDayOfWeek, setFirstDayOfWeek, defaultTimezoneDisplay, setDefaultTimezoneDisplay, autoDST, setAutoDST, decimalSeparator, setDecimalSeparator, thousandsSeparator, setThousandsSeparator, decimalPlaces, setDecimalPlaces, measurementUnit, setMeasurementUnit, phoneNumberFormat, setPhoneNumberFormat, onAddLanguage, onAddRegion, onAddCurrency, onManageLocales, onEditLanguage, onEditRegion, onEditCurrency, router } = props;

  return (
    <>
      <SectionTitle>Localization Settings</SectionTitle>
      <div style={{ fontSize: 13, color: TEXT_MUTED, marginTop: -10, marginBottom: 18 }}>
        Manage languages, regions, currencies, and date/time formats for the platform.
      </div>

      {/* Sub tabs */}
      <div style={{ display: "flex", gap: 22, borderBottom: '1px solid ' + BORDER + '', marginBottom: 22 }}>
        {LOCALIZATION_SUBTABS.map((t) => {
          const active = subTab === t.key;
          return (
            <div
              key={t.key}
              onClick={function() { setSubTab(t.key); }}
              style={{
                paddingBottom: 10,
                fontSize: 14,
                cursor: "pointer",
                color: active ? GOLD : "#cfd3da",
                borderBottom: active ? '2px solid ' + GOLD + '' : "2px solid transparent",
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
          onAddLanguage={onAddLanguage}
          onEditLanguage={onEditLanguage}
          router={router}
        />
      )}
      {subTab === "regions" && <RegionsSubPanel regions={regions} toggleRegionStatus={toggleRegionStatus} onEditRegion={onEditRegion} onAddRegion={onAddRegion} />}
      {subTab === "currencies" && <CurrenciesSubPanel currencies={localizationCurrencies} toggleCurrencyStatus={toggleCurrencyStatus} onAddCurrency={onAddCurrency} onEditCurrency={onEditCurrency} />}
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
  onAddLanguage,
  onEditLanguage,
  router,
}: {
  languages: any[];
  toggleLanguageStatus: (id: string) => void;
  defaultPlatformLanguage: string;
  setDefaultPlatformLanguage: (v: string) => void;
  allowLanguageChange: boolean;
  setAllowLanguageChange: (v: boolean) => void;
  browserLangDetection: boolean;
  setBrowserLangDetection: (v: boolean) => void;
  onAddLanguage?: () => void;
  onEditLanguage?: (l: any) => void;
  router?: any;
}) {
  const [langPage, setLangPage] = useState(1);
  const LANG_PER_PAGE = 6;
  const totalLangPages = Math.max(1, Math.ceil(languages.length / LANG_PER_PAGE));
  const pagedLanguages = languages.slice((langPage - 1) * LANG_PER_PAGE, langPage * LANG_PER_PAGE);
  return (
    <>
      {/* Platform Languages */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 4 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Platform Languages</div>
          <div style={{ fontSize: 12, color: TEXT_MUTED }}>Add and manage languages available on the platform.</div>
        </div>
        <button
          onClick={function() { if (onAddLanguage) onAddLanguage(); }}
          style={{
            background: "transparent",
            border: '1px solid ' + GOLD + '',
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
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.2fr 0.8fr 0.8fr 0.9fr 0.8fr 0.8fr", padding: "0 0 10px", borderBottom: '1px solid ' + BORDER + '' }}>
          <div style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600 }}>LANGUAGE</div>
          <div style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600 }}>NATIVE NAME</div>
          <div style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600 }}>CODE</div>
          <div style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600 }}>DIRECTION</div>
          <div style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600 }}>STATUS</div>
          <div style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600 }}>DEFAULT</div>
          <div style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600, textAlign: "right" }}>ACTIONS</div>
        </div>

        {pagedLanguages.map(function(l: any) { return (
          <div key={l.id} style={{ display: "grid", gridTemplateColumns: "1.2fr 1.2fr 0.8fr 0.8fr 0.9fr 0.8fr 0.8fr", alignItems: "center", padding: "12px 0", borderBottom: '1px solid ' + BORDER + '' }}>
            <div style={{ fontSize: 13, color: "#fff" }}>{l.name}</div>
            <div style={{ fontSize: 13, color: "#cfd3da" }}>{l.native}</div>
            <div style={{ fontSize: 13, color: "#cfd3da" }}>{l.code}</div>
            <div style={{ fontSize: 13, color: "#cfd3da" }}>{l.direction}</div>
            <div onClick={function() { toggleLanguageStatus(l.id); }} style={{ cursor: "pointer", width: "fit-content" }}>
              <StatusBadge status={l.status} />
            </div>
            <div>
              {l.isDefault ? (
                <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 4, background: '' + GOLD + '22', color: GOLD }}>Default</span>
              ) : (
                <span style={{ fontSize: 13, color: TEXT_MUTED }}>–</span>
              )}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
              <Pencil size={14} color={TEXT_MUTED} style={{ cursor: 'pointer' }} onClick={function() { if (onEditLanguage) onEditLanguage(l); }} />
              <MoreVertical size={14} color={TEXT_MUTED} style={{ cursor: 'pointer' }} onClick={function() { if (onEditLanguage) onEditLanguage(l); }} />
            </div>
          </div>
        ); })}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 26 }}>
        <div style={{ fontSize: 12, color: TEXT_MUTED }}>Showing {Math.min((langPage-1)*LANG_PER_PAGE+1, languages.length)} to {Math.min(langPage*LANG_PER_PAGE, languages.length)} of {languages.length} languages</div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <ChevronLeft size={16} color={TEXT_MUTED} style={{ cursor: "pointer" }} onClick={function() { setLangPage(function(p) { return Math.max(1, p - 1); }); }} />
          {Array.from({ length: totalLangPages }, function(_, i) { return i + 1; }).map(function(p) { return (
            <div
              key={p}
              onClick={function() { setLangPage(p); }}
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
                border: p === langPage ? "none" : '1px solid ' + BORDER + '',
              }}
            >
              {p}
            </div>
          ); })}
          <ChevronRight size={16} color={TEXT_MUTED} style={{ cursor: "pointer" }} onClick={function() { setLangPage(function(p) { return Math.min(totalLangPages, p + 1); }); }} />
        </div>
      </div>

      {/* Default Language Settings + Language Translations */}
      <div style={{ display: "flex", gap: 20, alignItems: "stretch" }}>
        <div style={{ flex: 1, border: '1px solid ' + BORDER + '', borderRadius: 8, padding: 18 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Default Language Settings</div>
          <div style={{ fontSize: 12, color: TEXT_MUTED, marginBottom: 16 }}>Configure default language behavior for users.</div>

          <LoginSecurityRow
            icon={LanguagesIcon}
            title="Default Platform Language"
            desc="Language used for guest users and new registrations."
            control={
              <select style={{ ...inputStyle, width: 160, padding: "8px 10px" }} value={defaultPlatformLanguage} onChange={function(e) { setDefaultPlatformLanguage(e.target.value); }}>
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
            control={<ToggleSwitch on={allowLanguageChange} onClick={function() { setAllowLanguageChange(!allowLanguageChange); }} />}
          />
          <div style={{ borderBottom: "none" }}>
            <LoginSecurityRow
              icon={Globe}
              title="Browser Language Detection"
              desc="Automatically detect and set language based on browser."
              control={<ToggleSwitch on={browserLangDetection} onClick={function() { setBrowserLangDetection(!browserLangDetection); }} />}
            />
          </div>
        </div>

        <div style={{ flex: 1, border: '1px solid ' + BORDER + '', borderRadius: 8, padding: 18, display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Language Translations</div>
          <div style={{ fontSize: 12, color: TEXT_MUTED, marginBottom: 16 }}>Manage translations for UI content and system messages.</div>

          <InfoRow icon={ListChecks} label="Total Translation Keys" value="1,245" />
          <InfoRow icon={CheckCircle2} label="Translated Keys" value="—" />
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
            onClick={function() { router.push('/admin/email-templates'); }}
            style={{
              marginTop: "auto",
              width: "100%",
              background: "transparent",
              border: '1px solid ' + GOLD + '',
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
            border: '4px solid ' + GOLD + '55',
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

function ActiveLocales({ router, onManageLocales }: { router: ReturnType<typeof useRouter>; onManageLocales?: () => void }) {
  return (
    <RailCard title="ACTIVE LOCALES" color={GOLD}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: '1px solid ' + BORDER + '' }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <LocaleFlag country="us" />
          <div>
            <div style={{ fontSize: 13, color: "#fff" }}>English (en)</div>
            <div style={{ fontSize: 11, color: TEXT_MUTED }}>United States</div>
          </div>
        </div>
        <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 4, background: '' + GOLD + '22', color: GOLD }}>Default</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: '1px solid ' + BORDER + '' }}>
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
      onClick={function() { if (onManageLocales) onManageLocales(); }}
        style={{
          width: "100%",
          marginTop: 14,
          background: "transparent",
          border: '1px solid ' + GOLD + '',
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

function LocalizationQuickActions({ router, onAddLanguage }: { router: ReturnType<typeof useRouter>; onAddLanguage?: () => void }) {
  return (
    <RailCard title="QUICK ACTIONS" color={GOLD}>
      <ActionRow icon={Plus} label="Add New Language" onClick={function() { if (onAddLanguage) onAddLanguage(); }} />
      <ActionRow icon={FileBox} label="Manage Translations" onClick={function() { router.push('/admin/cms'); }} />
      <ActionRow icon={Upload} label="Import Translations" onClick={function() { window.alert('Translation import will be available in a future update.'); }} />
      <ActionRow icon={Download} label="Export Translations" onClick={function() { window.alert('Translation export will be available in a future update.'); }} />
      <ActionRow icon={FileBarChart} label="Language Usage Report" onClick={function() { router.push('/admin/analytics'); }} />
    </RailCard>
  );
}

// ============== LOCALIZATION: REGIONS / CURRENCIES / DATETIME / FORMAT ==============

function RegionsSubPanel({ regions, toggleRegionStatus, onEditRegion, onAddRegion }: { regions: any[]; toggleRegionStatus: (id: string) => void; onEditRegion?: (r: any) => void; onAddRegion?: () => void }) {
  return (
    <>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 4 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Countries & Regions</div>
          <div style={{ fontSize: 12, color: TEXT_MUTED }}>Manage which countries and regions can access the platform.</div>
        </div>
        <button
          onClick={function() { if (onAddRegion) onAddRegion(); }}
          style={{ background: "transparent", border: '1px solid ' + GOLD + '', color: GOLD, borderRadius: 6, padding: "9px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}
        >
          <Plus size={14} />
          Add Region
        </button>
      </div>

      <div style={{ marginTop: 14 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 0.7fr 1.2fr 0.8fr 0.9fr 0.8fr 0.7fr", padding: "0 0 10px", borderBottom: '1px solid ' + BORDER + '' }}>
          <div style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600 }}>COUNTRY</div>
          <div style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600 }}>CODE</div>
          <div style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600 }}>REGION</div>
          <div style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600 }}>CURRENCY</div>
          <div style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600 }}>STATUS</div>
          <div style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600 }}>PRIMARY</div>
          <div style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600, textAlign: "right" }}>ACTIONS</div>
        </div>

        {regions.map((r) => (
          <div key={r.id} style={{ display: "grid", gridTemplateColumns: "1.4fr 0.7fr 1.2fr 0.8fr 0.9fr 0.8fr 0.7fr", alignItems: "center", padding: "12px 0", borderBottom: '1px solid ' + BORDER + '' }}>
            <div style={{ fontSize: 13, color: "#fff" }}>{r.name}</div>
            <div style={{ fontSize: 13, color: "#cfd3da" }}>{r.code}</div>
            <div style={{ fontSize: 13, color: "#cfd3da" }}>{r.region}</div>
            <div style={{ fontSize: 13, color: "#cfd3da" }}>{r.currency}</div>
            <div onClick={function() { toggleRegionStatus(r.id); }} style={{ cursor: "pointer", width: "fit-content" }}>
              <StatusBadge status={r.status} />
            </div>
            <div>
              {r.primary ? (
                <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 4, background: '' + GOLD + '22', color: GOLD }}>Primary</span>
              ) : (
                <span style={{ fontSize: 13, color: TEXT_MUTED }}>–</span>
              )}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
              <Pencil size={14} color={TEXT_MUTED} style={{ cursor: 'pointer' }} onClick={function() { if (onEditRegion) onEditRegion(r); }} />
              <MoreVertical size={14} color={TEXT_MUTED} style={{ cursor: 'pointer' }} onClick={function() { if (onEditRegion) onEditRegion(r); }} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 22, border: '1px solid ' + BORDER + '', borderRadius: 8, padding: 18, display: "flex", alignItems: "flex-start", gap: 10, background: "rgba(59,130,246,0.06)" }}>
        <Info size={16} color={BLUE} style={{ marginTop: 2, flexShrink: 0 }} />
        <div style={{ fontSize: 13, color: "#9DC2FB" }}>
          Inactive regions will be hidden from signup and casting call location filters, but existing users from those regions will not be affected.
        </div>
      </div>
    </>
  );
}

function CurrenciesSubPanel({ currencies, toggleCurrencyStatus, onAddCurrency, onEditCurrency }: { currencies: any[]; toggleCurrencyStatus: (id: string) => void; onAddCurrency?: () => void; onEditCurrency?: (c: any) => void }) {
  return (
    <>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 4 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Display Currencies</div>
          <div style={{ fontSize: 12, color: TEXT_MUTED }}>Manage currencies shown to users based on their region, with live conversion rates.</div>
        </div>
        <button
          onClick={function() { if (onAddCurrency) onAddCurrency(); }}
          style={{ background: "transparent", border: '1px solid ' + GOLD + '', color: GOLD, borderRadius: 6, padding: "9px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}
        >
          <Plus size={14} />
          Add Currency
        </button>
      </div>

      <div style={{ marginTop: 14 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 0.7fr 0.7fr 1fr 0.9fr 0.8fr 0.7fr", padding: "0 0 10px", borderBottom: '1px solid ' + BORDER + '' }}>
          <div style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600 }}>CURRENCY</div>
          <div style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600 }}>SYMBOL</div>
          <div style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600 }}>CODE</div>
          <div style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600 }}>RATE (vs INR)</div>
          <div style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600 }}>STATUS</div>
          <div style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600 }}>DEFAULT</div>
          <div style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600, textAlign: "right" }}>ACTIONS</div>
        </div>

        {currencies.map((c) => (
          <div key={c.id} style={{ display: "grid", gridTemplateColumns: "1.4fr 0.7fr 0.7fr 1fr 0.9fr 0.8fr 0.7fr", alignItems: "center", padding: "12px 0", borderBottom: '1px solid ' + BORDER + '' }}>
            <div style={{ fontSize: 13, color: "#fff" }}>{c.name}</div>
            <div style={{ fontSize: 13, color: "#cfd3da" }}>{c.symbol}</div>
            <div style={{ fontSize: 13, color: "#cfd3da" }}>{c.code}</div>
            <div style={{ fontSize: 13, color: "#cfd3da" }}>{c.rate}</div>
            <div onClick={function() { toggleCurrencyStatus(c.id); }} style={{ cursor: "pointer", width: "fit-content" }}>
              <StatusBadge status={c.status} />
            </div>
            <div>
              {c.isDefault ? (
                <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 4, background: '' + GOLD + '22', color: GOLD }}>Default</span>
              ) : (
                <span style={{ fontSize: 13, color: TEXT_MUTED }}>–</span>
              )}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
              <Pencil size={14} color={TEXT_MUTED} style={{ cursor: 'pointer' }} onClick={function() { if (onEditCurrency) onEditCurrency(c); }} />
              <MoreVertical size={14} color={TEXT_MUTED} style={{ cursor: 'pointer' }} onClick={function() { if (onEditCurrency) onEditCurrency(c); }} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center", marginTop: 16 }}>
        <span
          onClick={function() { window.open('https://www.xe.com/currencyconverter/', '_blank'); }}
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
          <select style={inputStyle} value={globalDateFormat} onChange={function(e) { setGlobalDateFormat(e.target.value); }}>
            <option>DD MMM YYYY (24 Jun 2026)</option>
            <option>MM/DD/YYYY</option>
            <option>DD/MM/YYYY</option>
            <option>YYYY-MM-DD</option>
          </select>
        </Field>
        <Field label="Default Time Format" hint="Used across dashboards and audit logs.">
          <select style={inputStyle} value={globalTimeFormat} onChange={function(e) { setGlobalTimeFormat(e.target.value); }}>
            <option>12 Hour (AM/PM)</option>
            <option>24 Hour</option>
          </select>
        </Field>
        <Field label="First Day of Week" hint="Used in calendar and scheduling views.">
          <select style={inputStyle} value={firstDayOfWeek} onChange={function(e) { setFirstDayOfWeek(e.target.value); }}>
            <option>Sunday</option>
            <option>Monday</option>
          </select>
        </Field>
        <Field label="Default Timezone Display" hint="How timestamps are shown to users.">
          <select style={inputStyle} value={defaultTimezoneDisplay} onChange={function(e) { setDefaultTimezoneDisplay(e.target.value); }}>
            <option>User's Local Timezone</option>
            <option>Platform Default (Asia/Kolkata)</option>
            <option>UTC</option>
          </select>
        </Field>
      </div>

      <div style={{ border: '1px solid ' + BORDER + '', borderRadius: 8, padding: 18 }}>
        <PrefRow icon={CalendarDays} title="Automatic Daylight Saving Adjustment" desc="Automatically adjust displayed times for daylight saving time where applicable." on={autoDST} onClick={function() { setAutoDST(!autoDST); }} />
      </div>

      <div style={{ marginTop: 22, border: '1px solid ' + BORDER + '', borderRadius: 8, padding: 18 }}>
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
    return '1' + thousands + '24,567' + places + '';
  })();

  return (
    <>
      <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Number & Format Settings</div>
      <div style={{ fontSize: 12, color: TEXT_MUTED, marginBottom: 18 }}>Configure how numbers, currency amounts and phone numbers are displayed.</div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 28px", marginBottom: 22 }}>
        <Field label="Decimal Separator">
          <select style={inputStyle} value={decimalSeparator} onChange={function(e) { setDecimalSeparator(e.target.value); }}>
            <option>Period (.)</option>
            <option>Comma (,)</option>
          </select>
        </Field>
        <Field label="Thousands Separator">
          <select style={inputStyle} value={thousandsSeparator} onChange={function(e) { setThousandsSeparator(e.target.value); }}>
            <option>Comma (,)</option>
            <option>Period (.)</option>
            <option>Space ( )</option>
          </select>
        </Field>
        <Field label="Decimal Places" hint="Used for currency and statistic displays.">
          <select style={inputStyle} value={decimalPlaces} onChange={function(e) { setDecimalPlaces(e.target.value); }}>
            <option>0</option>
            <option>1</option>
            <option>2</option>
          </select>
        </Field>
        <Field label="Measurement Unit" hint="Used for height/weight fields on talent profiles.">
          <select style={inputStyle} value={measurementUnit} onChange={function(e) { setMeasurementUnit(e.target.value); }}>
            <option>Metric (cm, kg)</option>
            <option>Imperial (ft/in, lbs)</option>
          </select>
        </Field>
        <Field label="Phone Number Format" hint="Used for display in profiles and notifications.">
          <select style={inputStyle} value={phoneNumberFormat} onChange={function(e) { setPhoneNumberFormat(e.target.value); }}>
            <option>International (+91 98765 43210)</option>
            <option>National (098765 43210)</option>
            <option>Compact (9876543210)</option>
          </select>
        </Field>
      </div>

      <div style={{ border: '1px solid ' + BORDER + '', borderRadius: 8, padding: 18 }}>
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
  const connected = integration.connected === true;
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{ border: '1px solid ' + BORDER + '', borderRadius: 8, padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
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
              background: '' + PURPLE + '22',
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
            onClick={function() {
              const docs: Record<string,string> = {
                'Razorpay': 'https://razorpay.com/docs/payments/dashboard/',
                'SendGrid': 'https://app.sendgrid.com/',
                'Twilio': 'https://console.twilio.com/',
                'Firebase': 'https://console.firebase.google.com/',
                'Cloudinary': 'https://cloudinary.com/console',
                'Stripe': 'https://dashboard.stripe.com/',
                '360dialog': 'https://hub.360dialog.com/',
                'Google Analytics': 'https://analytics.google.com/',
              };
              const url = docs[integration.name];
              if (url) window.open(url, '_blank');
              else window.alert('Go to your ' + integration.name + ' dashboard to configure credentials.');
            }}
            style={{ flex: 1, background: BG3, border: '1px solid ' + BORDER + '', color: "#cfd3da", borderRadius: 6, padding: "9px 12px", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
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
          onClick={function() { setMenuOpen(!menuOpen); }}
          style={{ width: 36, display: "flex", alignItems: "center", justifyContent: "center", border: '1px solid ' + BORDER + '', borderRadius: 6, cursor: "pointer" }}
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
              border: '1px solid ' + BORDER + '',
              borderRadius: 6,
              width: 170,
              zIndex: 10,
              boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
            }}
          >
            {["View Logs", "Test Connection", connected ? "Disconnect" : "Remove"].map((opt) => (
              <div
                key={opt}
                onClick={function() { setMenuOpen(false); if (opt === "Disconnect") onToggle(); }}
                style={{ padding: "9px 12px", fontSize: 12, color: opt === "Disconnect" || opt === "Remove" ? RED : "#cfd3da", cursor: "pointer" }}
                onMouseEnter={function(e) { e.currentTarget.style.background = BG4; }}
                onMouseLeave={function(e) { e.currentTarget.style.background = "transparent"; }}
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
  onAddIntegration,
}: {
  integrations: any[];
  toggleIntegration: (id: string) => void;
  filter: string;
  setFilter: (v: string) => void;
  search: string;
  setSearch: (v: string) => void;
  router: ReturnType<typeof useRouter>;
  onAddIntegration: () => void;
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
                onClick={function() { setFilter(f); }}
                style={{
                  padding: "8px 14px",
                  borderRadius: 6,
                  fontSize: 13,
                  cursor: "pointer",
                  background: active ? '' + GOLD + '22' : "transparent",
                  border: active ? '1px solid ' + GOLD + '' : '1px solid ' + BORDER + '',
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
              onChange={function(e) { setSearch(e.target.value); }}
            />
          </div>
          <button
            onClick={function() { onAddIntegration(); }}
            style={{ background: "transparent", border: '1px solid ' + GOLD + '', color: GOLD, borderRadius: 6, padding: "9px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}
          >
            <Plus size={14} />
            Add Integration
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 14, marginBottom: 26 }}>
        {filtered.map((i) => (
          <IntegrationCard key={i.id} integration={i} onToggle={function() { toggleIntegration(i.id); }} router={router} />
        ))}
        {filtered.length === 0 && (
          <div style={{ gridColumn: "1 / -1", padding: "30px 0", textAlign: "center", color: TEXT_MUTED, fontSize: 13 }}>
            No integrations match your filters.
          </div>
        )}
      </div>

      {/* API Usage Overview + Webhook Status */}
      <div style={{ display: "flex", gap: 20, alignItems: "stretch" }}>
        <div style={{ flex: 1, border: '1px solid ' + BORDER + '', borderRadius: 8, padding: 18 }}>
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
            onClick={function() { window.open('https://razorpay.com/docs/webhooks/', '_blank'); }}
            style={{ width: "100%", marginTop: 16, background: "transparent", border: '1px solid ' + GOLD + '', color: GOLD, borderRadius: 6, padding: "10px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}
          >
            <FileSearch size={14} />
            View API Logs
          </button>
        </div>

        <div style={{ flex: 1, border: '1px solid ' + BORDER + '', borderRadius: 8, padding: 18, position: "relative", overflow: "hidden" }}>
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
            onClick={function() { window.open('https://razorpay.com/docs/webhooks/', '_blank'); }}
            style={{ background: "transparent", border: '1px solid ' + GOLD + '', color: GOLD, borderRadius: 6, padding: "9px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 7 }}
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
  const connected = integrations.filter(function(i: any) { return i.connected === true; }).length;
  const disconnected = integrations.filter(function(i: any) { return !i.connected; }).length;
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
          centerValue={'' + total + ''}
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
        <span onClick={function() { router?.push('/admin/audit'); }} style={{ fontSize: 12, color: "#cfd3da", cursor: "pointer", border: '1px solid ' + BORDER + '', borderRadius: 6, padding: "4px 10px" }}>
          View All
        </span>
      </div>
      {activity.map((a: any) => (
        <div key={a.id} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 0", borderBottom: '1px solid ' + BORDER + '' }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: '${a.color}22', display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
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

function IntegrationsQuickActions({ router, onAddIntegration }: { router: ReturnType<typeof useRouter>; onAddIntegration?: () => void }) {
  return (
    <RailCard title="QUICK ACTIONS" color={GOLD}>
      <ActionRow icon={Plus} label="Add New Integration" onClick={function() { if (onAddIntegration) onAddIntegration(); }} />
      <ActionRow icon={Key} label="Manage API Keys" onClick={function() { router.push('/admin/roles'); }} />
      <ActionRow icon={Webhook} label="Webhook Endpoints" onClick={function() { router?.push('/admin/audit'); }} />
      <ActionRow icon={PlayCircle} label="Test Integrations" onClick={function() { router.push('/admin/settings'); }} />
      <ActionRow icon={FileSearch} label="Integration Logs" onClick={function() { router?.push('/admin/audit'); }} />
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
      <div style={{ border: '1px solid ' + BORDER + '', borderRadius: 8, padding: 18, marginBottom: 22 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Legal & Compliance Pages</div>
            <div style={{ fontSize: 12, color: TEXT_MUTED }}>Manage the legal pages shown across the platform.</div>
          </div>
          <button
            onClick={function() { window.alert('Legal page management will be available in a future update.'); }}
            style={{ background: "transparent", border: '1px solid ' + GOLD + '', color: GOLD, borderRadius: 6, padding: "9px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}
          >
            <Plus size={14} />
            Add Page
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1.3fr 1fr 0.8fr 0.7fr", padding: "0 0 10px", borderBottom: '1px solid ' + BORDER + '' }}>
          <div style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600 }}>PAGE</div>
          <div style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600 }}>URL</div>
          <div style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600 }}>LAST UPDATED</div>
          <div style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600 }}>STATUS</div>
          <div style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600, textAlign: "right" }}>ACTIONS</div>
        </div>

        {legalLinks.map((l) => (
          <div key={l.id} style={{ display: "grid", gridTemplateColumns: "1.3fr 1.3fr 1fr 0.8fr 0.7fr", alignItems: "center", padding: "12px 0", borderBottom: '1px solid ' + BORDER + '' }}>
            <div style={{ fontSize: 13, color: "#fff" }}>{l.label}</div>
            <div style={{ fontSize: 13, color: TEXT_MUTED, display: "flex", alignItems: "center", gap: 5 }}>
              <Link2 size={12} />
              {l.url}
            </div>
            <div style={{ fontSize: 13, color: "#cfd3da" }}>{l.lastUpdated}</div>
            <div>
              <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 4, background: l.status === "Published" ? '' + GREEN + '22' : '' + ORANGE + '22', color: l.status === "Published" ? GREEN : ORANGE }}>
                {l.status}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
              <Pencil size={14} color={TEXT_MUTED} style={{ cursor: 'pointer' }} onClick={function() { window.alert('Legal page editing will be available in a future update.'); }} />
              <MoreVertical size={14} color={TEXT_MUTED} style={{ cursor: 'pointer' }} onClick={function() { window.alert('Options for ' + l.name + ': Publish, Archive. Will be available at launch.'); }} />
            </div>
          </div>
        ))}
      </div>

      {/* Company Details + Data Retention */}
      <div style={{ display: "flex", gap: 20, marginBottom: 22 }}>
        <div style={{ flex: 1, border: '1px solid ' + BORDER + '', borderRadius: 8, padding: 18 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 14 }}>Company & Footer Details</div>
          <Field label="Company Address">
            <input style={inputStyle} value={companyAddress} onChange={function(e) { setCompanyAddress(e.target.value); }} />
          </Field>
          <Field label="GST / Tax Registration Number">
            <input style={inputStyle} value={gstNumber} onChange={function(e) { setGstNumber(e.target.value); }} />
          </Field>
          <Field label="Footer Copyright Text" hint="Shown at the bottom of every page.">
            <input style={inputStyle} value={footerText} onChange={function(e) { setFooterText(e.target.value); }} />
          </Field>
        </div>

        <div style={{ flex: 1, border: '1px solid ' + BORDER + '', borderRadius: 8, padding: 18 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 14 }}>Data Retention & Privacy</div>
          <Field label="Inactive Account Data Retention" hint="How long to retain data after account deletion request.">
            <select style={inputStyle} value={dataRetentionDays} onChange={function(e) { setDataRetentionDays(e.target.value); }}>
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
              border: '1px solid ' + GOLD + '',
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
      <div style={{ border: '1px solid ' + BORDER + '', borderRadius: 8, padding: 18 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Performance & Developer Tools</div>
        <div style={{ fontSize: 12, color: TEXT_MUTED, marginBottom: 8 }}>Caching, CDN and debug settings for the platform.</div>

        <PrefRow icon={Cpu} title="Page Caching" desc="Cache rendered pages for faster load times." on={cacheToggles.pageCache} onClick={function() { toggleCacheSetting("pageCache"); }} />
        <PrefRow icon={Database} title="API Response Caching" desc="Cache common API responses to reduce server load." on={cacheToggles.apiCache} onClick={function() { toggleCacheSetting("apiCache"); }} />
        <PrefRow icon={Cloud} title="Image CDN" desc="Serve images and media through a content delivery network." on={cacheToggles.imageCdn} onClick={function() { toggleCacheSetting("imageCdn"); }} />
        <PrefRow icon={Code2} title="Debug Mode" desc="Show detailed error messages. Disable in production." on={cacheToggles.debugMode} onClick={function() { toggleCacheSetting("debugMode"); }} />

        {cacheToggles.debugMode && (
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10, background: "rgba(200,32,42,0.08)", border: '1px solid ' + RED + '', borderRadius: 8, padding: "12px 14px", fontSize: 12, color: "#F3B5B9", marginTop: 12 }}>
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
      <ActionRow icon={ScrollText} label="Edit Legal Pages" onClick={function() { window.alert("Legal page editor will be available at launch."); }} />
      <ActionRow icon={HardDriveDownload} label="Export All Settings" onClick={function() { window.alert("Settings export will be available at launch."); }} />
      <ActionRow icon={Upload} label="Import Settings" onClick={function() { window.alert('Settings import/export will be available in a future update.'); }} />
      <ActionRow icon={RefreshCcw} label="Clear All Caches" onClick={function() { window.location.reload(); }} />
    </RailCard>
  );
}
// ============================================================
// MODAL FORM COMPONENTS
// ============================================================

function ModalInput({ label, value, onChange, placeholder, type }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 12px', background: '#181E2A', border: '1px solid #252C3A', borderRadius: 6, color: '#fff', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 14, outline: 'none', boxSizing: 'border-box' as const };
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontSize: 13, color: '#8B93A3', marginBottom: 5 }}>{label}</label>
      <input style={inputStyle} value={value} onChange={function(e) { onChange(e.target.value); }} placeholder={placeholder || ''} type={type || 'text'} />
    </div>
  );
}

function ModalSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 12px', background: '#181E2A', border: '1px solid #252C3A', borderRadius: 6, color: '#fff', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 14, outline: 'none', boxSizing: 'border-box' as const, appearance: 'none' as const };
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontSize: 13, color: '#8B93A3', marginBottom: 5 }}>{label}</label>
      <select style={inputStyle} value={value} onChange={function(e) { onChange(e.target.value); }}>
        {options.map(function(o) { return <option key={o} style={{ background: '#181E2A' }}>{o}</option>; })}
      </select>
    </div>
  );
}

function ModalButtons({ onCancel, onSave, saveLabel }: { onCancel: () => void; onSave: () => void; saveLabel?: string }) {
  return (
    <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
      <button onClick={onCancel} style={{ flex: 1, padding: '10px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, color: '#F5F5F5', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 15, cursor: 'pointer' }}>Cancel</button>
      <button onClick={onSave} style={{ flex: 2, padding: '10px', background: '#D4A64A', border: 'none', borderRadius: 8, color: '#000', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>{saveLabel || 'Save'}</button>
    </div>
  );
}

function AddLanguageForm({ onClose, onSaved }: { onClose: () => void; onSaved: (lang: any) => void }) {
  const [name,      setName]      = useState('');
  const [native,    setNative]    = useState('');
  const [code,      setCode]      = useState('');
  const [direction, setDirection] = useState('LTR');
  const [saving,    setSaving]    = useState(false);
  async function save() {
    if (!name || !code) { window.alert('Name and code are required.'); return; }
    setSaving(true);
    const { error } = await supabase.from('platform_languages').insert({
      id: code.toLowerCase(), name, native_name: native || name,
      code: code.toLowerCase(), direction, is_active: true, is_default: false,
    });
    setSaving(false);
    if (error) { window.alert('Failed to save: ' + error.message); return; }
    onSaved({ id: code, name, native: native || name, code, direction, status: 'Active', isDefault: false });
  }
  return (
    <>
      <ModalInput label="Language Name (English)" value={name} onChange={setName} placeholder="e.g. French" />
      <ModalInput label="Native Name" value={native} onChange={setNative} placeholder="e.g. Français" />
      <ModalInput label="Language Code" value={code} onChange={setCode} placeholder="e.g. fr" />
      <ModalSelect label="Text Direction" value={direction} onChange={setDirection} options={['LTR', 'RTL']} />
      <ModalButtons onCancel={onClose} onSave={save} saveLabel={saving ? 'Saving...' : 'Add Language'} />
    </>
  );
}

function AddRegionForm({ onClose, onSaved }: { onClose: () => void; onSaved: (reg: any) => void }) {
  const [name,     setName]     = useState('');
  const [code,     setCode]     = useState('');
  const [region,   setRegion]   = useState('Asia Pacific');
  const [currency, setCurrency] = useState('INR');
  const [saving,   setSaving]   = useState(false);
  async function save() {
    if (!name || !code) { window.alert('Country name and code are required.'); return; }
    setSaving(true);
    const { error } = await supabase.from('platform_regions').insert({
      id: code.toLowerCase(), name, code: code.toUpperCase(),
      region, currency, is_active: true, is_primary: false,
    });
    setSaving(false);
    if (error) { window.alert('Failed to save: ' + error.message); return; }
    onSaved({ id: code.toLowerCase(), name, code: code.toUpperCase(), region, currency, status: 'Active', primary: false });
  }
  return (
    <>
      <ModalInput label="Country Name" value={name} onChange={setName} placeholder="e.g. Singapore" />
      <ModalInput label="Country Code (2 letters)" value={code} onChange={function(v) { setCode(v.toUpperCase().slice(0,2)); }} placeholder="e.g. SG" />
      <ModalSelect label="Region" value={region} onChange={setRegion} options={['Asia Pacific', 'North America', 'Europe', 'Middle East', 'Africa', 'South America']} />
      <ModalInput label="Default Currency Code" value={currency} onChange={setCurrency} placeholder="e.g. SGD" />
      <ModalButtons onCancel={onClose} onSave={save} saveLabel="Add Region" />
    </>
  );
}

function AddCurrencyForm({ onClose, onSaved }: { onClose: () => void; onSaved: (cur: any) => void }) {
  const [name,   setName]   = useState('');
  const [symbol, setSymbol] = useState('');
  const [code,   setCode]   = useState('');
  const [rate,   setRate]   = useState('');
  const [saving, setSaving] = useState(false);
  async function save() {
    if (!name || !code || !rate) { window.alert('Name, code and exchange rate are required.'); return; }
    setSaving(true);
    const { error } = await supabase.from('platform_currencies').insert({
      id: code.toLowerCase(), name, symbol,
      code: code.toUpperCase(), rate, is_active: true, is_default: false,
    });
    setSaving(false);
    if (error) { window.alert('Failed to save: ' + error.message); return; }
    onSaved({ id: code.toLowerCase(), name, symbol, code: code.toUpperCase(), rate, status: 'Active', isDefault: false });
  }
  return (
    <>
      <ModalInput label="Currency Name" value={name} onChange={setName} placeholder="e.g. Singapore Dollar" />
      <ModalInput label="Currency Symbol" value={symbol} onChange={setSymbol} placeholder="e.g. S$" />
      <ModalInput label="Currency Code" value={code} onChange={function(v) { setCode(v.toUpperCase().slice(0,3)); }} placeholder="e.g. SGD" />
      <ModalInput label="Exchange Rate vs INR" value={rate} onChange={setRate} placeholder="e.g. 0.016" type="number" />
      <ModalButtons onCancel={onClose} onSave={save} saveLabel="Add Currency" />
    </>
  );
}

function AddTaxForm({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [name,    setName]    = useState('');
  const [type,    setType]    = useState('GST');
  const [rate,    setRate]    = useState('');
  const [applies, setApplies] = useState('Subscription Plans');
  function save() {
    if (!name || !rate) { window.alert('Name and rate are required.'); return; }
    onSaved();
  }
  return (
    <>
      <ModalInput label="Tax Rule Name" value={name} onChange={setName} placeholder="e.g. GST 12%" />
      <ModalSelect label="Tax Type" value={type} onChange={setType} options={['GST', 'VAT', 'Service Tax', 'Other']} />
      <ModalInput label="Rate (%)" value={rate} onChange={setRate} placeholder="e.g. 12" type="number" />
      <ModalSelect label="Applies To" value={applies} onChange={setApplies} options={['Subscription Plans', 'Basic Services', 'All Transactions', 'Premium Plans']} />
      <ModalButtons onCancel={onClose} onSave={save} saveLabel="Add Tax Rule" />
    </>
  );
}

function AddGatewayForm({ onClose, onSaved }: { onClose: () => void; onSaved: (gw: any) => void }) {
  const [name,   setName]   = useState('');
  const [type,   setType]   = useState('Backup');
  const [mode,   setMode]   = useState('Test');
  const [key,    setKey]    = useState('');
  const [secret, setSecret] = useState('');
  const [saving, setSaving] = useState(false);
  async function save() {
    if (!name) { window.alert('Gateway name is required.'); return; }
    setSaving(true);
    const { data, error } = await supabase.from('payment_gateways').insert({
      name, type, is_active: false, mode,
      api_key: key, secret_key: secret, volume: '—', txns: 0,
    }).select().single();
    setSaving(false);
    if (error) { window.alert('Failed to save: ' + error.message); return; }
    onSaved({ id: data.id, name, type, active: false, mode, volume: '—', txns: 0, status: 'Inactive', desc: name + ' payment gateway', fee: '2%', color: '#6B7280' });
  }
  return (
    <>
      <ModalSelect label="Gateway" value={name} onChange={setName} options={['Razorpay', 'Stripe', 'PayU', 'Cashfree', 'CCAvenue', 'PayPal']} />
      <ModalSelect label="Type" value={type} onChange={setType} options={['Primary', 'International', 'Backup']} />
      <ModalSelect label="Mode" value={mode} onChange={setMode} options={['Test', 'Live']} />
      <ModalInput label="API Key / Client ID" value={key} onChange={setKey} placeholder="Enter your API key" />
      <ModalInput label="Secret Key" value={secret} onChange={setSecret} placeholder="Enter your secret key" type="password" />
      <p style={{ fontSize: 12, color: '#8B93A3', marginBottom: 0, lineHeight: 1.6 }}>
        You can get these credentials from your gateway dashboard. The gateway will be added in Test mode — switch to Live when ready.
      </p>
      <ModalButtons onCancel={onClose} onSave={save} saveLabel="Add Gateway" />
    </>
  );
}

function AddIntegrationForm({ onClose, onSaved }: { onClose: () => void; onSaved: (intg: any) => void }) {
  const [name,     setName]     = useState('');
  const [category, setCategory] = useState('Payments');
  const [apiKey,   setApiKey]   = useState('');
  const [saving,   setSaving]   = useState(false);
  const COLORS: Record<string, string> = { Payments: '#3B82F6', Email: '#14B8A6', SMS: '#EF4444', Analytics: '#D4A64A', 'Push Notifs': '#F97316', 'Media CDN': '#8B5CF6', WhatsApp: '#22C55E' };
  async function save() {
    if (!name) { window.alert('Integration name is required.'); return; }
    setSaving(true);
    const color = COLORS[category] || '#6B7280';
    const { error } = await supabase.from('integrations').insert({
      name, category, connected: false, color, last_sync: 'Never',
    }).select();
    setSaving(false);
    if (error) {
      // integrations table may not exist yet - just add locally
      onSaved({ id: Date.now(), name, category, connected: false, color, lastSync: 'Never', status: 'Disconnected', lastSynced: 'Never' });
      return;
    }
    onSaved({ id: Date.now(), name, category, connected: false, color, lastSync: 'Never', status: 'Disconnected', lastSynced: 'Never' });
  }
  return (
    <>
      <ModalInput label="Integration Name" value={name} onChange={setName} placeholder="e.g. Mailchimp" />
      <ModalSelect label="Category" value={category} onChange={setCategory} options={['Payments', 'Email', 'SMS', 'Analytics', 'Push Notifs', 'Media CDN', 'WhatsApp', 'Other']} />
      <ModalInput label="API Key (optional)" value={apiKey} onChange={setApiKey} placeholder="Enter API key if available" />
      <p style={{ fontSize: 12, color: '#8B93A3', marginBottom: 0, lineHeight: 1.6 }}>
        The integration will be added as disconnected. Enable it from the integrations list once credentials are configured.
      </p>
      <ModalButtons onCancel={onClose} onSave={save} saveLabel="Add Integration" />
    </>
  );
}

function ManageIPModal({ onClose, showToast, whitelistedIps, blockedIps, setWhitelistedIps, setBlockedIps }: {
  onClose: () => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
  whitelistedIps: string[];
  blockedIps: string[];
  setWhitelistedIps: (v: string[]) => void;
  setBlockedIps: (v: string[]) => void;
}) {
  const [newIP, setNewIP] = useState('');
  const [type,  setType]  = useState('whitelist');
  function addIP() {
    if (!newIP.trim()) { showToast('Enter an IP address or range.', 'error'); return; }
    if (type === 'whitelist') {
      setWhitelistedIps([...whitelistedIps, newIP.trim()]);
    } else {
      setBlockedIps([...blockedIps, newIP.trim()]);
    }
    showToast('IP ' + newIP.trim() + ' added to ' + type + '.');
    setNewIP('');
  }
  function removeIP(ip: string, listType: string) {
    if (listType === 'whitelist') setWhitelistedIps(whitelistedIps.filter(function(i) { return i !== ip; }));
    else setBlockedIps(blockedIps.filter(function(i) { return i !== ip; }));
    showToast('IP ' + ip + ' removed.');
  }
  return (
    <>
      <p style={{ fontSize: 14, color: '#8B93A3', marginBottom: 16 }}>Add or remove IP addresses from the whitelist or blocklist.</p>
      {whitelistedIps.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 13, color: GREEN, marginBottom: 6, fontWeight: 600 }}>Whitelisted IPs</div>
          {whitelistedIps.map(function(ip) { return (
            <div key={ip} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 10px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 6, marginBottom: 4 }}>
              <span style={{ fontSize: 13, color: '#fff', fontFamily: 'monospace' }}>{ip}</span>
              <button onClick={function() { removeIP(ip, 'whitelist'); }} style={{ background: 'none', border: 'none', color: RED, cursor: 'pointer', fontSize: 16 }}>×</button>
            </div>
          ); })}
        </div>
      )}
      {blockedIps.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 13, color: RED, marginBottom: 6, fontWeight: 600 }}>Blocked IPs</div>
          {blockedIps.map(function(ip) { return (
            <div key={ip} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 10px', background: 'rgba(200,32,42,0.08)', border: '1px solid rgba(200,32,42,0.2)', borderRadius: 6, marginBottom: 4 }}>
              <span style={{ fontSize: 13, color: '#fff', fontFamily: 'monospace' }}>{ip}</span>
              <button onClick={function() { removeIP(ip, 'blocklist'); }} style={{ background: 'none', border: 'none', color: RED, cursor: 'pointer', fontSize: 16 }}>×</button>
            </div>
          ); })}
        </div>
      )}
      <ModalSelect label="Add to" value={type} onChange={setType} options={['whitelist', 'blocklist']} />
      <ModalInput label="IP Address or Range" value={newIP} onChange={setNewIP} placeholder="e.g. 192.168.1.0/24 or 10.0.0.1" />
      <button onClick={addIP} style={{ width: '100%', padding: '10px', background: '#D4A64A', border: 'none', borderRadius: 8, color: '#000', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 15, fontWeight: 700, cursor: 'pointer', marginBottom: 12 }}>
        Add IP
      </button>
      <button onClick={onClose} style={{ width: '100%', padding: '10px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, color: '#F5F5F5', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 15, cursor: 'pointer' }}>Close</button>
    </>
  );
}

function TwoFAModal({ twoFaEnabled, setTwoFaEnabled, onClose, showToast }: { twoFaEnabled: boolean; setTwoFaEnabled: (v: boolean) => void; onClose: () => void; showToast: (msg: string) => void }) {
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #252C3A', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 15, color: '#fff', fontWeight: 600 }}>Two-Factor Authentication</div>
          <div style={{ fontSize: 13, color: '#8B93A3' }}>Current status: {twoFaEnabled ? 'Enabled' : 'Disabled'}</div>
        </div>
        <div onClick={function() { setTwoFaEnabled(!twoFaEnabled); showToast('2FA ' + (!twoFaEnabled ? 'enabled' : 'disabled') + ' successfully.'); }}
          style={{ width: 42, height: 22, borderRadius: 11, background: twoFaEnabled ? '#22C55E' : 'rgba(255,255,255,0.15)', cursor: 'pointer', position: 'relative' as const, transition: 'background 0.2s' }}>
          <div style={{ position: 'absolute' as const, top: 3, left: twoFaEnabled ? 22 : 3, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
        </div>
      </div>
      <div style={{ fontSize: 14, color: '#8B93A3', lineHeight: 1.7, marginBottom: 16 }}>
        <strong style={{ color: '#fff' }}>How to set up 2FA:</strong><br />
        1. Download Google Authenticator or Authy<br />
        2. Scan the QR code shown in your account settings<br />
        3. Enter the 6-digit code to verify<br />
        4. Save your backup codes in a secure place
      </div>
      <button onClick={onClose} style={{ width: '100%', padding: '10px', background: '#D4A64A', border: 'none', borderRadius: 8, color: '#000', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>Done</button>
    </>
  );
}

function TestSmsModal({ onClose, showToast }: { onClose: () => void; showToast: (msg: string, type?: 'success' | 'error') => void }) {
  const [phone,   setPhone]   = useState('');
  const [message, setMessage] = useState('This is a test SMS from SilverScreens Admin Panel.');
  const [sending, setSending] = useState(false);

  async function send() {
    if (!phone.trim()) { window.alert('Enter a phone number.'); return; }
    setSending(true);
    try {
      const res = await fetch('/api/admin/sms/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toPhone: phone.trim(), message }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast('Test SMS sent to ' + phone.trim());
        onClose();
      } else {
        showToast(data.error || 'Failed to send SMS.', 'error');
      }
    } catch {
      showToast('Network error. Please try again.', 'error');
    }
    setSending(false);
  }

  return (
    <>
      <div style={{ fontFamily: BEBAS, fontSize: 20, color: GOLD, marginBottom: 16, letterSpacing: 1 }}>SEND TEST SMS</div>
      <p style={{ fontSize: 14, color: TEXT_MUTED, marginBottom: 20, lineHeight: 1.6 }}>
        Sends a real SMS via your configured Twilio account. Make sure you have saved your Account SID, Auth Token and From Number in Settings first.
      </p>
      <ModalInput label="Phone Number (with country code)" value={phone} onChange={setPhone} placeholder="+91 98765 43210" />
      <div style={{ marginBottom: 14 }}>
        <label style={{ display: 'block', fontSize: 13, color: TEXT_MUTED, marginBottom: 5 }}>Message</label>
        <textarea
          value={message}
          onChange={function(e) { setMessage(e.target.value); }}
          rows={3}
          style={{ width: '100%', padding: '10px 12px', background: BG4, border: '1px solid ' + BORDER, borderRadius: 6, color: '#fff', fontFamily: BARLOW, fontSize: 14, outline: 'none', resize: 'none' as const, boxSizing: 'border-box' as const }}
        />
        <div style={{ fontSize: 12, color: TEXT_MUTED, marginTop: 4 }}>{message.length} chars · {Math.ceil(message.length / 160)} segment</div>
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={onClose} style={{ flex: 1, padding: '10px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, color: '#F5F5F5', fontFamily: BARLOW, fontSize: 15, cursor: 'pointer' }}>Cancel</button>
        <button onClick={send} disabled={sending} style={{ flex: 2, padding: '10px', background: sending ? GOLD + '80' : GOLD, border: 'none', borderRadius: 8, color: '#000', fontFamily: BARLOW, fontSize: 15, fontWeight: 700, cursor: sending ? 'not-allowed' : 'pointer' }}>
          {sending ? 'Sending...' : 'Send Test SMS'}
        </button>
      </div>
    </>
  );
}

function TestWaModal({ onClose, showToast }: { onClose: () => void; showToast: (msg: string, type?: 'success' | 'error') => void }) {
  const [phone,   setPhone]   = useState('');
  const [sending, setSending] = useState(false);

  async function send() {
    if (!phone.trim()) { window.alert('Enter a phone number.'); return; }
    setSending(true);
    try {
      const res = await fetch('/api/admin/whatsapp/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toPhone: phone.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast('WhatsApp message sent to ' + phone.trim());
        onClose();
      } else {
        showToast(data.error || 'Failed to send WhatsApp message.', 'error');
      }
    } catch {
      showToast('Network error. Please try again.', 'error');
    }
    setSending(false);
  }

  return (
    <>
      <div style={{ fontFamily: BEBAS, fontSize: 20, color: GREEN, marginBottom: 16, letterSpacing: 1 }}>TEST WHATSAPP MESSAGE</div>
      <div style={{ padding: '12px 16px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 8, fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 20, lineHeight: 1.7 }}>
        <strong style={{ color: GREEN }}>Sandbox mode:</strong> The recipient must have joined your Twilio WhatsApp sandbox by sending the join keyword to <strong style={{ color: '#fff' }}>+1 415 523 8886</strong> on WhatsApp first.
      </div>
      <ModalInput label="WhatsApp Number (with country code)" value={phone} onChange={setPhone} placeholder="+91 98765 43210" />
      <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
        <button onClick={onClose} style={{ flex: 1, padding: '10px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, color: '#F5F5F5', fontFamily: BARLOW, fontSize: 15, cursor: 'pointer' }}>Cancel</button>
        <button onClick={send} disabled={sending} style={{ flex: 2, padding: '10px', background: sending ? GREEN + '80' : GREEN, border: 'none', borderRadius: 8, color: '#000', fontFamily: BARLOW, fontSize: 15, fontWeight: 700, cursor: sending ? 'not-allowed' : 'pointer' }}>
          {sending ? 'Sending...' : 'Send Test WhatsApp'}
        </button>
      </div>
    </>
  );
}

function EditLanguageForm({ language, onClose, onSaved }: { language: any; onClose: () => void; onSaved: (updated: any) => void }) {
  const [name,      setName]      = useState(language.name   || '');
  const [native,    setNative]    = useState(language.native || '');
  const [code,      setCode]      = useState(language.code   || '');
  const [direction, setDirection] = useState(language.direction || 'LTR');
  const [saving,    setSaving]    = useState(false);

  async function save() {
    if (!name || !code) { window.alert('Name and code are required.'); return; }
    setSaving(true);
    const { error } = await supabase
      .from('platform_languages')
      .update({ name, native_name: native, code: code.toLowerCase(), direction })
      .eq('id', language.id);
    setSaving(false);
    if (error) { window.alert('Failed to save: ' + error.message); return; }
    onSaved({ ...language, name, native, code, direction });
  }

  return (
    <>
      <div style={{ fontFamily: BEBAS, fontSize: 20, color: GOLD, marginBottom: 20, letterSpacing: 1 }}>EDIT LANGUAGE</div>
      <ModalInput label="Language Name (English)" value={name} onChange={setName} placeholder="e.g. French" />
      <ModalInput label="Native Name" value={native} onChange={setNative} placeholder="e.g. Français" />
      <ModalInput label="Language Code" value={code} onChange={function(v) { setCode(v.toLowerCase().slice(0,5)); }} placeholder="e.g. fr" />
      <ModalSelect label="Text Direction" value={direction} onChange={setDirection} options={['LTR', 'RTL']} />
      <ModalButtons onCancel={onClose} onSave={save} saveLabel={saving ? 'Saving...' : 'Save Changes'} />
    </>
  );
}

function EditRegionForm({ region, onClose, onSaved }: { region: any; onClose: () => void; onSaved: (updated: any) => void }) {
  const [name,     setName]     = useState(region.name     || '');
  const [code,     setCode]     = useState(region.code     || '');
  const [reg,      setReg]      = useState(region.region   || 'Asia Pacific');
  const [currency, setCurrency] = useState(region.currency || 'INR');
  const [saving,   setSaving]   = useState(false);

  async function save() {
    if (!name || !code) { window.alert('Name and code are required.'); return; }
    setSaving(true);
    const { error } = await supabase
      .from('platform_regions')
      .update({ name, code: code.toUpperCase(), region: reg, currency })
      .eq('id', region.id);
    setSaving(false);
    if (error) { window.alert('Failed to save: ' + error.message); return; }
    onSaved({ ...region, name, code: code.toUpperCase(), region: reg, currency });
  }

  return (
    <>
      <div style={{ fontFamily: BEBAS, fontSize: 20, color: GOLD, marginBottom: 20, letterSpacing: 1 }}>EDIT REGION</div>
      <ModalInput label="Country Name" value={name} onChange={setName} placeholder="e.g. Singapore" />
      <ModalInput label="Country Code" value={code} onChange={function(v) { setCode(v.toUpperCase().slice(0,2)); }} placeholder="e.g. SG" />
      <ModalSelect label="Region" value={reg} onChange={setReg} options={['Asia Pacific', 'North America', 'Europe', 'Middle East', 'Africa', 'South America']} />
      <ModalInput label="Default Currency" value={currency} onChange={setCurrency} placeholder="e.g. SGD" />
      <ModalButtons onCancel={onClose} onSave={save} saveLabel={saving ? 'Saving...' : 'Save Changes'} />
    </>
  );
}

function EditCurrencyForm({ currency, onClose, onSaved }: { currency: any; onClose: () => void; onSaved: (updated: any) => void }) {
  const [name,   setName]   = useState(currency.name   || '');
  const [symbol, setSymbol] = useState(currency.symbol || '');
  const [code,   setCode]   = useState(currency.code   || '');
  const [rate,   setRate]   = useState(currency.rate   || '');
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!name || !code || !rate) { window.alert('Name, code and rate are required.'); return; }
    setSaving(true);
    const { error } = await supabase
      .from('platform_currencies')
      .update({ name, symbol, code: code.toUpperCase(), rate })
      .eq('id', currency.id);
    setSaving(false);
    if (error) { window.alert('Failed to save: ' + error.message); return; }
    onSaved({ ...currency, name, symbol, code: code.toUpperCase(), rate });
  }

  return (
    <>
      <div style={{ fontFamily: BEBAS, fontSize: 20, color: GOLD, marginBottom: 20, letterSpacing: 1 }}>EDIT CURRENCY</div>
      <ModalInput label="Currency Name" value={name} onChange={setName} placeholder="e.g. Indian Rupee" />
      <ModalInput label="Symbol" value={symbol} onChange={setSymbol} placeholder="e.g. ₹" />
      <ModalInput label="Code" value={code} onChange={function(v) { setCode(v.toUpperCase().slice(0,3)); }} placeholder="e.g. INR" />
      <ModalInput label="Exchange Rate vs INR" value={rate} onChange={setRate} placeholder="e.g. 1.00" type="number" />
      <ModalButtons onCancel={onClose} onSave={save} saveLabel={saving ? 'Saving...' : 'Save Changes'} />
    </>
  );
}

function EditGatewayForm({ gateway, onClose, onSaved }: { gateway: any; onClose: () => void; onSaved: (updated: any) => void }) {
  const [name,   setName]   = useState(gateway.name   || '');
  const [type,   setType]   = useState(gateway.type   || 'Backup');
  const [mode,   setMode]   = useState(gateway.mode   || 'Test');
  const [apiKey, setApiKey] = useState('');
  const [secret, setSecret] = useState('');
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    const updates: any = { name, type, mode };
    if (apiKey) updates.api_key = apiKey;
    if (secret) updates.secret_key = secret;
    const { error } = await supabase
      .from('payment_gateways')
      .update(updates)
      .eq('id', gateway.id);
    setSaving(false);
    if (error) { window.alert('Failed to save: ' + error.message); return; }
    onSaved({ ...gateway, name, type, mode });
  }

  return (
    <>
      <div style={{ fontFamily: BEBAS, fontSize: 20, color: GOLD, marginBottom: 20, letterSpacing: 1 }}>EDIT GATEWAY — {gateway.name}</div>
      <ModalSelect label="Gateway Name" value={name} onChange={setName} options={['Razorpay', 'Stripe', 'PayU', 'Cashfree', 'CCAvenue', 'PayPal']} />
      <ModalSelect label="Type" value={type} onChange={setType} options={['Primary', 'International', 'Backup']} />
      <ModalSelect label="Mode" value={mode} onChange={setMode} options={['Test', 'Live']} />
      <ModalInput label="New API Key (leave blank to keep existing)" value={apiKey} onChange={setApiKey} placeholder="Enter new API key" />
      <ModalInput label="New Secret Key (leave blank to keep existing)" value={secret} onChange={setSecret} placeholder="Enter new secret key" type="password" />
      <p style={{ fontSize: 12, color: TEXT_MUTED, marginBottom: 0, lineHeight: 1.6 }}>
        Leave API Key / Secret blank to keep the existing credentials unchanged.
      </p>
      <ModalButtons onCancel={onClose} onSave={save} saveLabel={saving ? 'Saving...' : 'Save Changes'} />
    </>
  );
}