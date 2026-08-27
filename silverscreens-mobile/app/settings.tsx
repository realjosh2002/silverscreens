import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Switch, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useFonts, BebasNeue_400Regular } from '@expo-google-fonts/bebas-neue';
import {
  BarlowCondensed_400Regular,
  BarlowCondensed_500Medium,
  BarlowCondensed_600SemiBold,
} from '@expo-google-fonts/barlow-condensed';
import Toast from 'react-native-toast-message';
import { Colors, Fonts } from '../constants/theme';
import { api } from '../lib/api';
import { getUser, clearAuth } from '../lib/auth';

const BG2 = '#0B0F14';
const BG3 = '#121821';
const GREEN = '#22C55E';

const SETTINGS_SECTIONS = [
  {
    title: 'ACCOUNT',
    items: [
      { key: 'profile',      label: 'Profile & Account',     emoji: '👤', sub: 'Manage your personal information and public profile.' },
      { key: 'security',     label: 'Account & Security',    emoji: '🛡️', sub: 'Secure your account and manage login settings.' },
      { key: 'notifications',label: 'Notifications',         emoji: '🔔', sub: 'Choose how and when you want to be notified.' },
      { key: 'email',        label: 'Email Preferences',     emoji: '✉️', sub: 'Manage the emails you receive from SilverScreens.' },
    ],
  },
  {
    title: 'PRIVACY & PREFERENCES',
    items: [
      { key: 'privacy',      label: 'Privacy',               emoji: '👁️', sub: 'Control your visibility and data privacy.' },
      { key: 'preferences',  label: 'Preferences',           emoji: '⚙️', sub: 'Customize your experience on the platform.' },
      { key: 'blocked',      label: 'Blocked Agencies',      emoji: '🚫', sub: 'Manage agencies you have blocked.' },
    ],
  },
  {
    title: 'PROFILE SECTIONS',
    items: [
      { key: 'subscription', label: 'Subscription & Billing',emoji: '👑', sub: 'Manage your plan, billing details and invoices.' },
      { key: 'documents',    label: 'Documents',             emoji: '📁', sub: 'Upload and manage your documents.' },
      { key: 'experience',   label: 'Experience',            emoji: '🎬', sub: 'Add your film, TV and theatre experience.' },
      { key: 'education',    label: 'Education',             emoji: '🎓', sub: 'Add your educational background.' },
      { key: 'skills',       label: 'Skills',                emoji: '🎭', sub: 'Showcase your acting and other skills.' },
      { key: 'awards',       label: 'Awards',                emoji: '🏆', sub: 'Add your awards and achievements.' },
    ],
  },
  {
    title: 'SUPPORT',
    items: [
      { key: 'support',      label: 'Help & Support',        emoji: '🎧', sub: 'Get help and contact our support team.' },
    ],
  },
];

export default function SettingsScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Profile & Account fields
  const [profile, setProfile] = useState<any>(null);

  // Notification toggles
  const [notifSettings, setNotifSettings] = useState({
    push: true, email: true, sms: false, marketing: false,
  });

  // Privacy settings
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'Public',
    whoCanMessage: 'Everyone',
    showContact: 'Agencies Only',
  });

  // Email preferences
  const [emailPrefs, setEmailPrefs] = useState({
    castingOpportunities: true,
    applicationUpdates: true,
    marketing: false,
    newsletter: true,
  });

  const [fontsLoaded] = useFonts({
    BebasNeue_400Regular,
    BarlowCondensed_400Regular,
    BarlowCondensed_500Medium,
    BarlowCondensed_600SemiBold,
  });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const savedUser = await getUser();
      if (!savedUser) { router.replace('/login'); return; }
      setUser(savedUser);
      const res = await api.get('/api/profile/aspirant');
      setProfile(res.data?.data?.profile ?? res.data?.profile ?? null);
    } catch (err: any) {
      if (err?.response?.status === 401) { await clearAuth(); router.replace('/login'); }
    } finally {
      setLoading(false);
    }
  };

  if (!fontsLoaded || loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={Colors.gold} size="large" />
      </View>
    );
  }

  const ap = profile?.aspirant_profiles ?? {};

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <View style={styles.sectionContent}>
            <Text style={styles.sectionContentTitle}>Profile & Account</Text>
            <Text style={styles.sectionContentSub}>Manage your personal information and public profile.</Text>
            {[
              { label: 'Full Name',     value: user?.name ?? '—' },
              { label: 'Stage Name',    value: ap?.stage_name ?? '—' },
              { label: 'Email Address', value: user?.email ?? '—' },
              { label: 'Mobile Number', value: user?.phone ?? '—' },
              { label: 'Location',      value: ap?.city ? `${ap.city}, ${ap.state ?? ''}` : '—' },
            ].map(({ label, value }) => (
              <View key={label} style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>{label}</Text>
                <View style={styles.fieldRight}>
                  <Text style={styles.fieldValue}>{value}</Text>
                  <TouchableOpacity onPress={() => router.push('/edit-profile' as any)}>
                    <Text style={styles.editLink}>✏ Edit</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => router.push('/edit-profile' as any)}
            >
              <Text style={styles.primaryBtnText}>Edit Full Profile</Text>
            </TouchableOpacity>
          </View>
        );

      case 'security':
        return (
          <View style={styles.sectionContent}>
            <Text style={styles.sectionContentTitle}>Account & Security</Text>
            {[
              { label: 'Change Password',          sub: 'Update your password',                      value: '' },
              { label: 'Two-Factor Authentication', sub: 'Add extra security to your account',       value: 'Enabled' },
              { label: 'Login Sessions',            sub: 'View and manage active sessions',          value: '' },
              { label: 'Security Activity',         sub: 'Review recent account activity',           value: '↗' },
            ].map(({ label, sub, value }) => (
              <TouchableOpacity key={label} style={styles.menuRow}>
                <View style={styles.menuRowLeft}>
                  <Text style={styles.menuRowLabel}>{label}</Text>
                  <Text style={styles.menuRowSub}>{sub}</Text>
                </View>
                <Text style={[styles.menuRowValue, value === 'Enabled' && { color: GREEN }]}>
                  {value || '›'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        );

      case 'notifications':
        return (
          <View style={styles.sectionContent}>
            <Text style={styles.sectionContentTitle}>Notifications</Text>
            {([
              { key: 'push',      label: 'Push Notifications',  sub: 'Receive push notifications on your device' },
              { key: 'email',     label: 'Email Notifications', sub: 'Get updates via email' },
              { key: 'sms',       label: 'SMS Notifications',   sub: 'Receive SMS alerts' },
              { key: 'marketing', label: 'Marketing Emails',    sub: 'Receive promotional content' },
            ] as const).map(({ key, label, sub }) => (
              <View key={key} style={styles.toggleRow}>
                <View style={styles.toggleLeft}>
                  <Text style={styles.menuRowLabel}>{label}</Text>
                  <Text style={styles.menuRowSub}>{sub}</Text>
                </View>
                <Switch
                  value={notifSettings[key]}
                  onValueChange={() => setNotifSettings(prev => ({ ...prev, [key]: !prev[key] }))}
                  trackColor={{ false: '#333', true: Colors.red }}
                  thumbColor={Colors.white}
                />
              </View>
            ))}
          </View>
        );

      case 'email':
        return (
          <View style={styles.sectionContent}>
            <Text style={styles.sectionContentTitle}>Email Preferences</Text>
            {([
              { key: 'castingOpportunities', label: 'Casting Opportunities', sub: 'New castings matching your profile' },
              { key: 'applicationUpdates',   label: 'Application Updates',   sub: 'Updates on your applications' },
              { key: 'marketing',            label: 'Marketing & Promotions',sub: 'Promotional emails' },
              { key: 'newsletter',           label: 'Newsletter',            sub: 'Weekly newsletter' },
            ] as const).map(({ key, label, sub }) => (
              <View key={key} style={styles.toggleRow}>
                <View style={styles.toggleLeft}>
                  <Text style={styles.menuRowLabel}>{label}</Text>
                  <Text style={styles.menuRowSub}>{sub}</Text>
                </View>
                <View style={styles.toggleRight}>
                  <Text style={[styles.toggleStatus, { color: emailPrefs[key] ? GREEN : '#555' }]}>
                    {emailPrefs[key] ? 'On' : 'Off'}
                  </Text>
                  <Switch
                    value={emailPrefs[key]}
                    onValueChange={() => setEmailPrefs(prev => ({ ...prev, [key]: !prev[key] }))}
                    trackColor={{ false: '#333', true: Colors.red }}
                    thumbColor={Colors.white}
                  />
                </View>
              </View>
            ))}
          </View>
        );

      case 'privacy':
        return (
          <View style={styles.sectionContent}>
            <Text style={styles.sectionContentTitle}>Privacy</Text>
            {[
              { label: 'Profile Visibility',      value: privacy.profileVisibility, color: GREEN },
              { label: 'Who Can Message You',     value: privacy.whoCanMessage,     color: GREEN },
              { label: 'Show Contact Information',value: privacy.showContact,       color: Colors.gold },
              { label: 'Data & Activity',         value: '›',                       color: Colors.white },
            ].map(({ label, value, color }) => (
              <TouchableOpacity key={label} style={styles.menuRow}>
                <Text style={styles.menuRowLabel}>{label}</Text>
                <Text style={[styles.menuRowValue, { color }]}>{value}</Text>
              </TouchableOpacity>
            ))}
          </View>
        );

      case 'preferences':
        return (
          <View style={styles.sectionContent}>
            <Text style={styles.sectionContentTitle}>Preferences</Text>
            {[
              { label: 'Preferred Roles',     value: '›' },
              { label: 'Preferred Locations', value: '›' },
              { label: 'Availability',        value: 'Available', color: GREEN },
              { label: 'Language',            value: 'English',   color: GREEN },
            ].map(({ label, value, color }: any) => (
              <TouchableOpacity key={label} style={styles.menuRow}>
                <Text style={styles.menuRowLabel}>{label}</Text>
                <Text style={[styles.menuRowValue, color && { color }]}>{value}</Text>
              </TouchableOpacity>
            ))}
          </View>
        );

      case 'subscription':
        return (
          <View style={styles.sectionContent}>
            <Text style={styles.sectionContentTitle}>Subscription & Billing</Text>
            <View style={styles.subCard}>
              <View style={styles.subRow}>
                <Text style={styles.subLabel}>Current Plan</Text>
                <Text style={[styles.subValue, { color: Colors.gold }]}>
                  {user?.plan_name ?? 'Free'}
                </Text>
              </View>
              <View style={styles.subRow}>
                <Text style={styles.subLabel}>Status</Text>
                <Text style={[styles.subValue, { color: GREEN }]}>
                  {user?.subscribed ? '● Active' : '● Inactive'}
                </Text>
              </View>
              {user?.plan_expires && (
                <View style={styles.subRow}>
                  <Text style={styles.subLabel}>Expires</Text>
                  <Text style={styles.subValue}>
                    {new Date(user.plan_expires).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </Text>
                </View>
              )}
            </View>
            <TouchableOpacity style={styles.primaryBtn}>
              <Text style={styles.primaryBtnText}>👑 Upgrade Plan</Text>
            </TouchableOpacity>
          </View>
        );

      case 'support':
        return (
          <View style={styles.sectionContent}>
            <Text style={styles.sectionContentTitle}>Help & Support</Text>
            {[
              { label: 'FAQs',           emoji: '❓', sub: 'Frequently asked questions' },
              { label: 'Contact Us',     emoji: '📧', sub: 'Reach our support team' },
              { label: 'Report a Bug',   emoji: '🐛', sub: 'Help us improve the app' },
              { label: 'Privacy Policy', emoji: '📄', sub: 'Read our privacy policy' },
              { label: 'Terms of Use',   emoji: '📋', sub: 'Read our terms and conditions' },
            ].map(({ label, emoji, sub }) => (
              <TouchableOpacity key={label} style={styles.menuRow}>
                <View style={styles.menuRowLeft}>
                  <Text style={styles.menuRowLabel}>{emoji} {label}</Text>
                  <Text style={styles.menuRowSub}>{sub}</Text>
                </View>
                <Text style={styles.menuRowValue}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        {activeSection ? (
          <TouchableOpacity onPress={() => setActiveSection(null)} style={styles.backBtn}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
        )}
        <View>
          <Text style={styles.pageTitle}>SETTINGS</Text>
          <Text style={styles.pageSub}>Manage your account, preferences and privacy.</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {activeSection ? (
          renderSectionContent()
        ) : (
          <>
            {/* User card */}
            <View style={styles.userCard}>
              <View style={styles.userAvatar}>
                <Text style={styles.userAvatarText}>
                  {user?.name?.charAt(0)?.toUpperCase() ?? 'A'}
                </Text>
              </View>
              <View>
                <Text style={styles.userName}>{user?.name ?? 'Aspirant'}</Text>
                <TouchableOpacity onPress={() => router.push('/my-profile' as any)}>
                  <Text style={styles.viewProfileLink}>View Profile →</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Settings sections */}
            {SETTINGS_SECTIONS.map(section => (
              <View key={section.title} style={styles.sectionGroup}>
                <Text style={styles.sectionGroupTitle}>{section.title}</Text>
                <View style={styles.sectionCard}>
                  {section.items.map((item, i) => (
                    <TouchableOpacity
                      key={item.key}
                      style={[
                        styles.settingRow,
                        i < section.items.length - 1 && styles.settingRowBorder,
                      ]}
                      onPress={() => {
                        if (item.key === 'support') router.push('/support' as any);
                        else if (item.key === 'profile') setActiveSection('profile');
                        else if (item.key === 'notifications') router.push('/notifications' as any);
                        else setActiveSection(item.key);
                      }}
                    >
                      <Text style={styles.settingEmoji}>{item.emoji}</Text>
                      <View style={styles.settingInfo}>
                        <Text style={styles.settingLabel}>{item.label}</Text>
                        <Text style={styles.settingSub}>{item.sub}</Text>
                      </View>
                      <Text style={styles.settingChevron}>›</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}

            {/* Danger zone */}
            <View style={styles.sectionGroup}>
              <Text style={styles.sectionGroupTitle}>DANGER ZONE</Text>
              <View style={styles.sectionCard}>
                <TouchableOpacity style={styles.settingRow}>
                  <Text style={styles.settingEmoji}>🚪</Text>
                  <View style={styles.settingInfo}>
                    <Text style={[styles.settingLabel, { color: Colors.red }]}>Delete Account</Text>
                    <Text style={styles.settingSub}>Permanently delete your account and all data.</Text>
                  </View>
                  <Text style={styles.settingChevron}>›</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.version}>SilverScreens v1.0.0</Text>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  centered: { flex: 1, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center' },

  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12,
    borderBottomWidth: 1, borderBottomColor: '#1A1A1A',
  },
  backBtn: { padding: 4 },
  backArrow: { fontSize: 22, color: Colors.white },
  pageTitle: { fontFamily: Fonts.heading, fontSize: 26, color: Colors.white, letterSpacing: 3 },
  pageSub: { fontFamily: Fonts.body, fontSize: 13, color: '#666', marginTop: 2 },

  userCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    margin: 16, padding: 16, backgroundColor: BG2,
    borderRadius: 12, borderWidth: 1, borderColor: '#1A1A1A',
  },
  userAvatar: {
    width: 50, height: 50, borderRadius: 25,
    backgroundColor: Colors.red, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: Colors.gold,
  },
  userAvatarText: { fontFamily: Fonts.heading, fontSize: 24, color: Colors.white },
  userName: { fontFamily: Fonts.bodySemiBold, fontSize: 17, color: Colors.white, marginBottom: 2 },
  viewProfileLink: { fontFamily: Fonts.bodyMedium, fontSize: 13, color: Colors.red },

  sectionGroup: { marginHorizontal: 16, marginBottom: 16 },
  sectionGroupTitle: {
    fontFamily: Fonts.bodyMedium, fontSize: 11, color: '#555',
    letterSpacing: 3, marginBottom: 8, marginLeft: 4,
  },
  sectionCard: {
    backgroundColor: BG2, borderRadius: 12,
    borderWidth: 1, borderColor: '#1A1A1A',
  },
  settingRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  settingRowBorder: { borderBottomWidth: 1, borderBottomColor: '#111' },
  settingEmoji: { fontSize: 20, width: 28, textAlign: 'center' },
  settingInfo: { flex: 1 },
  settingLabel: { fontFamily: Fonts.bodyMedium, fontSize: 15, color: Colors.white, marginBottom: 2 },
  settingSub: { fontFamily: Fonts.body, fontSize: 12, color: '#555' },
  settingChevron: { fontSize: 20, color: '#444' },

  version: {
    fontFamily: Fonts.body, fontSize: 12, color: '#333',
    textAlign: 'center', marginVertical: 24,
  },

  // Section content
  sectionContent: { padding: 16 },
  sectionContentTitle: { fontFamily: Fonts.heading, fontSize: 24, color: Colors.white, letterSpacing: 2, marginBottom: 4 },
  sectionContentSub: { fontFamily: Fonts.body, fontSize: 14, color: '#666', marginBottom: 16 },

  fieldRow: {
    paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#111',
  },
  fieldLabel: { fontFamily: Fonts.body, fontSize: 13, color: '#555', marginBottom: 4 },
  fieldRight: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  fieldValue: { fontFamily: Fonts.bodyMedium, fontSize: 15, color: Colors.white, flex: 1 },
  editLink: { fontFamily: Fonts.bodyMedium, fontSize: 13, color: Colors.gold },

  menuRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#111',
  },
  menuRowLeft: { flex: 1 },
  menuRowLabel: { fontFamily: Fonts.bodyMedium, fontSize: 15, color: Colors.white },
  menuRowSub: { fontFamily: Fonts.body, fontSize: 12, color: '#555', marginTop: 2 },
  menuRowValue: { fontFamily: Fonts.bodyMedium, fontSize: 14, color: '#666', marginLeft: 10 },

  toggleRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#111',
  },
  toggleLeft: { flex: 1 },
  toggleRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  toggleStatus: { fontFamily: Fonts.bodyMedium, fontSize: 13 },

  subCard: {
    backgroundColor: BG2, borderRadius: 12, padding: 16,
    borderWidth: 1, borderColor: '#1A1A1A', marginBottom: 16,
  },
  subRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#111' },
  subLabel: { fontFamily: Fonts.body, fontSize: 14, color: '#666' },
  subValue: { fontFamily: Fonts.bodyMedium, fontSize: 14, color: Colors.white },

  primaryBtn: {
    backgroundColor: Colors.red, borderRadius: 8,
    paddingVertical: 14, alignItems: 'center', marginTop: 16,
  },
  primaryBtnText: { fontFamily: Fonts.bodySemiBold, fontSize: 16, color: Colors.white },
});