import React, { useState, useEffect, useMemo } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  ActivityIndicator, RefreshControl, Switch,
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

type NotifType = 'application' | 'shortlisted' | 'audition' | 'message' | 'profile' | 'casting' | 'account' | 'system';

const TYPE_CFG: Record<string, { emoji: string; bg: string; color: string }> = {
  application: { emoji: '📄', bg: 'rgba(34,197,94,0.15)',   color: '#4ADE80' },
  shortlisted: { emoji: '⭐', bg: 'rgba(168,85,247,0.15)',  color: '#C084FC' },
  audition:    { emoji: '📅', bg: 'rgba(249,115,22,0.15)',  color: '#FB923C' },
  message:     { emoji: '💬', bg: 'rgba(59,130,246,0.15)',  color: '#60A5FA' },
  profile:     { emoji: '👁️', bg: 'rgba(20,184,166,0.15)',  color: '#2DD4BF' },
  casting:     { emoji: '🎬', bg: 'rgba(212,166,74,0.15)',  color: '#D4A64A' },
  account:     { emoji: '🛡️', bg: 'rgba(99,102,241,0.15)',  color: '#818CF8' },
  system:      { emoji: 'ℹ️', bg: 'rgba(148,163,184,0.12)', color: '#94A3B8' },
};

function typeToCategory(t: string) {
  if (t === 'application' || t === 'shortlisted') return 'applications';
  if (t === 'audition')  return 'auditions';
  if (t === 'message')   return 'messages';
  return 'system';
}

const FILTER_TABS = [
  { key: 'all',          label: 'All'          },
  { key: 'unread',       label: 'Unread'       },
  { key: 'applications', label: 'Applications' },
  { key: 'auditions',    label: 'Auditions'    },
  { key: 'messages',     label: 'Messages'     },
  { key: 'system',       label: 'System'       },
];

interface Notif {
  id: string | number;
  type: string;
  read: boolean;
  message: string;
  subtitle?: string;
  timestamp: string;
}

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [settings, setSettings] = useState({
    push: true, email: true, sms: false, marketing: false,
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
      const user = await getUser();
      if (!user) { router.replace('/login'); return; }

      const res = await api.get('/api/notifications');
      const list = res.data?.data?.notifications ?? res.data?.notifications ?? [];

      const typeMap: Record<string, string> = {
        audition_scheduled: 'audition', audition_reminder: 'audition',
        application_update: 'application', application_new: 'application',
        shortlisted: 'shortlisted', message: 'message', message_new: 'message',
        profile_view: 'profile', casting_match: 'casting',
        account: 'account', system: 'system',
        audition: 'audition', application: 'application', casting: 'casting',
      };

      const mapped: Notif[] = Array.isArray(list) ? list.map((n: any, i: number) => ({
        id:        n.id ?? i,
        type:      typeMap[n.type] ?? 'system',
        read:      n.is_read ?? n.read ?? false,
        message:   n.message ?? n.title ?? 'Notification',
        subtitle:  n.subtitle ?? n.description ?? undefined,
        timestamp: n.created_at
          ? new Date(n.created_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
          : '',
      })) : [];

      setNotifs(mapped);

      // Auto mark all as read
      const hasUnread = mapped.some(n => !n.read);
      if (hasUnread) {
        api.put('/api/notifications', {}).catch(() => {});
        setNotifs(mapped.map(n => ({ ...n, read: true })));
      }
    } catch (err: any) {
      if (err?.response?.status === 401) { await clearAuth(); router.replace('/login'); }
      else Toast.show({ type: 'error', text1: 'Failed to load notifications' });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const markAllRead = () => {
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
    api.put('/api/notifications', {}).catch(() => {});
    Toast.show({ type: 'success', text1: 'All marked as read' });
  };

  const markRead = (id: string | number) => {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    api.put('/api/notifications', { notification_id: id }).catch(() => {});
  };

  if (!fontsLoaded) return null;

  const filtered = useMemo(() => {
    if (activeFilter === 'all')    return notifs;
    if (activeFilter === 'unread') return notifs.filter(n => !n.read);
    return notifs.filter(n => typeToCategory(n.type) === activeFilter);
  }, [notifs, activeFilter]);

  const counts = useMemo(() => ({
    all:          notifs.length,
    unread:       notifs.filter(n => !n.read).length,
    applications: notifs.filter(n => typeToCategory(n.type) === 'applications').length,
    auditions:    notifs.filter(n => typeToCategory(n.type) === 'auditions').length,
    messages:     notifs.filter(n => typeToCategory(n.type) === 'messages').length,
    system:       notifs.filter(n => typeToCategory(n.type) === 'system').length,
  }), [notifs]);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.pageTitle}>NOTIFICATIONS</Text>
          <Text style={styles.pageSub}>Stay updated with the latest alerts.</Text>
        </View>
        <TouchableOpacity onPress={markAllRead}>
          <Text style={styles.markAllText}>✓✓ Mark all read</Text>
        </TouchableOpacity>
      </View>

      {/* Filter tabs */}
      <View style={styles.filterScroll}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {FILTER_TABS.map(tab => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.filterTab, activeFilter === tab.key && styles.filterTabActive]}
              onPress={() => setActiveFilter(tab.key)}
            >
              <Text style={[styles.filterTabText, activeFilter === tab.key && styles.filterTabTextActive]}>
                {tab.label} ({counts[tab.key as keyof typeof counts] ?? 0})
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <ActivityIndicator color={Colors.gold} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={n => String(n.id)}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadData(); }} tintColor={Colors.gold} />}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Text style={styles.emptyEmoji}>🔔</Text>
              <Text style={styles.emptyTitle}>No notifications</Text>
              <Text style={styles.emptySub}>You're all caught up!</Text>
            </View>
          }
          ListFooterComponent={
            <View style={styles.settingsSection}>
              <Text style={styles.sectionTitle}>Notification Settings</Text>
              {([
                { key: 'push',      label: 'Push Notifications'  },
                { key: 'email',     label: 'Email Notifications' },
                { key: 'sms',       label: 'SMS Notifications'   },
                { key: 'marketing', label: 'Marketing Emails'    },
              ] as const).map(({ key, label }) => (
                <View key={key} style={styles.settingRow}>
                  <Text style={styles.settingLabel}>{label}</Text>
                  <View style={styles.settingRight}>
                    <Text style={[styles.settingStatus, { color: settings[key] ? '#4ADE80' : '#555' }]}>
                      {settings[key] ? 'On' : 'Off'}
                    </Text>
                    <Switch
                      value={settings[key]}
                      onValueChange={() => setSettings(prev => ({ ...prev, [key]: !prev[key] }))}
                      trackColor={{ false: '#333', true: Colors.red }}
                      thumbColor={Colors.white}
                    />
                  </View>
                </View>
              ))}
              <TouchableOpacity
                style={styles.manageBtn}
                onPress={() => router.push('/settings' as any)}
              >
                <Text style={styles.manageBtnText}>Manage Preferences</Text>
              </TouchableOpacity>

              {/* Need Help */}
              <View style={styles.helpBox}>
                <Text style={styles.sectionTitle}>Need Help?</Text>
                <Text style={styles.helpSub}>Learn how notifications work on SilverScreens.</Text>
                <TouchableOpacity onPress={() => router.push('/support' as any)}>
                  <Text style={styles.helpLink}>Visit Help Center →</Text>
                </TouchableOpacity>
              </View>
            </View>
          }
          renderItem={({ item: n }) => {
            const cfg = TYPE_CFG[n.type] ?? TYPE_CFG['system'];
            return (
              <TouchableOpacity
                style={[styles.notifItem, !n.read && styles.notifItemUnread]}
                onPress={() => markRead(n.id)}
                activeOpacity={0.75}
              >
                <View style={styles.notifLeft}>
                  <View style={[styles.unreadDot, { opacity: n.read ? 0 : 1 }]} />
                  <View style={[styles.notifIcon, { backgroundColor: cfg.bg }]}>
                    <Text style={styles.notifEmoji}>{cfg.emoji}</Text>
                  </View>
                </View>
                <View style={styles.notifContent}>
                  <Text style={[styles.notifMessage, !n.read && { color: Colors.white, fontWeight: '600' }]}>
                    {n.message}
                  </Text>
                  {n.subtitle ? (
                    <Text style={styles.notifSubtitle}>{n.subtitle}</Text>
                  ) : null}
                  <Text style={styles.notifTime}>{n.timestamp}</Text>
                </View>
                <Text style={styles.notifChevron}>›</Text>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

// Need to add ScrollView import

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },

  header: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12,
    borderBottomWidth: 1, borderBottomColor: '#1A1A1A',
  },
  backBtn: { padding: 4 },
  backArrow: { fontSize: 22, color: Colors.white },
  pageTitle: { fontFamily: Fonts.heading, fontSize: 24, color: Colors.white, letterSpacing: 3 },
  pageSub: { fontFamily: Fonts.body, fontSize: 13, color: '#666', marginTop: 1 },
  markAllText: { fontFamily: Fonts.bodyMedium, fontSize: 13, color: Colors.red },

  filterScroll: { borderBottomWidth: 1, borderBottomColor: '#1A1A1A', paddingLeft: 16 },
  filterTab: {
    paddingHorizontal: 12, paddingVertical: 10,
    marginRight: 4, borderBottomWidth: 2, borderBottomColor: 'transparent',
  },
  filterTabActive: { borderBottomColor: Colors.red },
  filterTabText: { fontFamily: Fonts.bodyMedium, fontSize: 13, color: '#666' },
  filterTabTextActive: { color: Colors.red, fontWeight: '700' },

  notifItem: {
    flexDirection: 'row', alignItems: 'flex-start',
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: '#111',
    gap: 12,
  },
  notifItemUnread: { backgroundColor: 'rgba(200,32,42,0.04)' },
  notifLeft: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingTop: 4 },
  unreadDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.red },
  notifIcon: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
  },
  notifEmoji: { fontSize: 18 },
  notifContent: { flex: 1 },
  notifMessage: { fontFamily: Fonts.body, fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 20, marginBottom: 3 },
  notifSubtitle: { fontFamily: Fonts.body, fontSize: 13, color: '#555', marginBottom: 4 },
  notifTime: { fontFamily: Fonts.body, fontSize: 12, color: '#444' },
  notifChevron: { fontSize: 20, color: '#333', paddingTop: 8 },

  emptyBox: { alignItems: 'center', paddingVertical: 60 },
  emptyEmoji: { fontSize: 40, marginBottom: 12 },
  emptyTitle: { fontFamily: Fonts.bodyMedium, fontSize: 16, color: '#888', marginBottom: 4 },
  emptySub: { fontFamily: Fonts.body, fontSize: 14, color: '#555' },

  settingsSection: {
    margin: 16, backgroundColor: BG2,
    borderRadius: 12, padding: 16,
    borderWidth: 1, borderColor: '#1A1A1A',
  },
  sectionTitle: { fontFamily: Fonts.bodySemiBold, fontSize: 17, color: Colors.white, marginBottom: 12 },
  settingRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: '#1A1A1A',
  },
  settingLabel: { fontFamily: Fonts.bodyMedium, fontSize: 15, color: 'rgba(255,255,255,0.75)' },
  settingRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  settingStatus: { fontFamily: Fonts.body, fontSize: 13 },
  manageBtn: {
    marginTop: 14, borderWidth: 1, borderColor: Colors.red,
    borderRadius: 8, paddingVertical: 12, alignItems: 'center',
  },
  manageBtnText: { fontFamily: Fonts.bodyMedium, fontSize: 15, color: Colors.red },
  helpBox: { marginTop: 16 },
  helpSub: { fontFamily: Fonts.body, fontSize: 14, color: '#666', marginBottom: 10 },
  helpLink: { fontFamily: Fonts.bodyMedium, fontSize: 14, color: Colors.red },
});