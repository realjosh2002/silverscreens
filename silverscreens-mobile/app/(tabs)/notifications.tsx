import React, { useState, useEffect, useMemo } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  ActivityIndicator, RefreshControl, ScrollView,
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
import { api } from '../../lib/api';
import { getUser, clearAuth } from '../../lib/auth';

const RED = '#C8202A';
const GOLD = '#D4A64A';
const BG = '#080808';
const CARD = '#111113';

const TYPE_CFG: Record<string, { emoji: string; bg: string }> = {
  audition:    { emoji: '📅', bg: 'rgba(212,166,74,0.15)'  },
  application: { emoji: '📄', bg: 'rgba(34,197,94,0.15)'   },
  shortlisted: { emoji: '🏆', bg: 'rgba(168,85,247,0.15)'  },
  message:     { emoji: '✉️', bg: 'rgba(59,130,246,0.15)'  },
  profile:     { emoji: '👁', bg: 'rgba(20,184,166,0.15)'  },
  casting:     { emoji: '🎬', bg: 'rgba(212,166,74,0.15)'  },
  system:      { emoji: '⚙️', bg: 'rgba(148,163,184,0.12)' },
  announcement:{ emoji: '📢', bg: 'rgba(168,85,247,0.15)'  },
};

const FILTER_TABS = ['All', 'Unread', 'Applications', 'Auditions'];

function typeToCategory(t: string) {
  if (t === 'application' || t === 'shortlisted') return 'Applications';
  if (t === 'audition') return 'Auditions';
  return 'System';
}

interface Notif {
  id: string | number;
  type: string;
  read: boolean;
  message: string;
  subtitle?: string;
  timestamp: string;
}

const PER_PAGE = 8;

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

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
        account: 'system', system: 'system',
        audition: 'audition', application: 'application',
      };

      const mapped: Notif[] = Array.isArray(list) ? list.map((n: any, i: number) => ({
        id:        n.id ?? i,
        type:      typeMap[n.type] ?? 'system',
        read:      n.is_read ?? n.read ?? false,
        message:   n.message ?? n.title ?? 'Notification',
        subtitle:  n.subtitle ?? n.description ?? undefined,
        timestamp: n.created_at
          ? new Date(n.created_at).toLocaleString('en-IN', {
              day: '2-digit', month: 'short', year: 'numeric',
              hour: '2-digit', minute: '2-digit',
            })
          : '',
      })) : [];

      setNotifs(mapped);

      // Auto mark all as read
      if (mapped.some(n => !n.read)) {
        api.put('/api/notifications', {}).catch(() => {});
      }
    } catch (err: any) {
      if (err?.response?.status === 401) { await clearAuth(); router.replace('/login'); }
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

  if (!fontsLoaded) return null;

  const filtered = useMemo(() => {
    if (activeFilter === 'All')          return notifs;
    if (activeFilter === 'Unread')       return notifs.filter(n => !n.read);
    if (activeFilter === 'Applications') return notifs.filter(n => typeToCategory(n.type) === 'Applications');
    if (activeFilter === 'Auditions')    return notifs.filter(n => typeToCategory(n.type) === 'Auditions');
    return notifs;
  }, [notifs, activeFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated  = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);
  const unreadCount = notifs.filter(n => !n.read).length;

  const tabCounts: Record<string, number> = {
    All:          notifs.length,
    Unread:       notifs.filter(n => !n.read).length,
    Applications: notifs.filter(n => typeToCategory(n.type) === 'Applications').length,
    Auditions:    notifs.filter(n => typeToCategory(n.type) === 'Auditions').length,
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.hamburger}>
          <View style={styles.hLine} />
          <View style={[styles.hLine, { width: 16 }]} />
          <View style={styles.hLine} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.brandWhite}>SILVER </Text>
          <Text style={styles.brandRed}>SCREENS</Text>
        </View>
        <View style={styles.bellWrap}>
          <Text style={styles.bellIcon}>🔔</Text>
          {unreadCount > 0 && (
            <View style={styles.bellBadge}>
              <Text style={styles.bellBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Title + Mark all read */}
      <View style={styles.titleRow}>
        <View>
          <Text style={styles.pageTitle}>NOTIFICATIONS</Text>
          <Text style={styles.pageSub}>Stay updated with the latest alerts and opportunities.</Text>
        </View>
        <TouchableOpacity onPress={markAllRead}>
          <Text style={styles.markAll}>✓✓ Mark all as read</Text>
        </TouchableOpacity>
      </View>

      {/* Filter tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={{ paddingHorizontal: 16 }}>
        {FILTER_TABS.map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.filterTab, activeFilter === tab && styles.filterTabActive]}
            onPress={() => { setActiveFilter(tab); setCurrentPage(1); }}
          >
            <Text style={[styles.filterTabText, activeFilter === tab && styles.filterTabTextActive]}>
              {tab} ({tabCounts[tab] ?? 0})
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? (
        <ActivityIndicator color={GOLD} style={{ marginTop: 40 }} />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadData(); }} tintColor={GOLD} />}
        >
          <View style={styles.list}>
            {paginated.length === 0 ? (
              <View style={styles.emptyBox}>
                <Text style={styles.emptyEmoji}>🔔</Text>
                <Text style={styles.emptyTitle}>No notifications</Text>
                <Text style={styles.emptySub}>You're all caught up!</Text>
              </View>
            ) : paginated.map((n, idx) => {
              const cfg = TYPE_CFG[n.type] ?? TYPE_CFG['system'];
              return (
                <TouchableOpacity key={n.id} style={styles.notifItem} activeOpacity={0.8}>
                  {/* Icon */}
                  <View style={[styles.notifIcon, { backgroundColor: cfg.bg }]}>
                    <Text style={styles.notifEmoji}>{cfg.emoji}</Text>
                  </View>
                  {/* Content */}
                  <View style={styles.notifContent}>
                    <Text style={[styles.notifMsg, !n.read && styles.notifMsgUnread]}>
                      {n.message}
                    </Text>
                    {n.subtitle ? <Text style={styles.notifSub}>{n.subtitle}</Text> : null}
                    <Text style={styles.notifTime}>{n.timestamp}</Text>
                  </View>
                  {/* Unread dot */}
                  {!n.read && <View style={styles.unreadDot} />}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Pagination */}
          {filtered.length > 0 && (
            <View style={styles.paginationSection}>
              <Text style={styles.showingText}>
                Showing {(currentPage - 1) * PER_PAGE + 1} to {Math.min(currentPage * PER_PAGE, filtered.length)} of {filtered.length} notifications
              </Text>
              <View style={styles.paginationRow}>
                <TouchableOpacity
                  style={[styles.pageBtn, currentPage === 1 && styles.pageBtnDisabled]}
                  onPress={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <Text style={styles.pageBtnText}>‹</Text>
                </TouchableOpacity>
                {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => i + 1).map(p => (
                  <TouchableOpacity
                    key={p}
                    style={[styles.pageBtn, p === currentPage && styles.pageBtnActive]}
                    onPress={() => setCurrentPage(p)}
                  >
                    <Text style={[styles.pageBtnText, p === currentPage && styles.pageBtnTextActive]}>{p}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={[styles.pageBtn, currentPage === totalPages && styles.pageBtnDisabled]}
                  onPress={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <Text style={styles.pageBtnText}>›</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View style={{ height: 20 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: '#151515',
  },
  hamburger: { gap: 4, padding: 4 },
  hLine: { width: 22, height: 2, backgroundColor: '#666', borderRadius: 1 },
  headerCenter: { flexDirection: 'row', alignItems: 'center' },
  brandWhite: { fontFamily: 'BebasNeue_400Regular', fontSize: 20, color: '#fff', letterSpacing: 2 },
  brandRed: { fontFamily: 'BebasNeue_400Regular', fontSize: 20, color: RED, letterSpacing: 2 },
  bellWrap: { position: 'relative', padding: 4 },
  bellIcon: { fontSize: 22 },
  bellBadge: {
    position: 'absolute', top: 0, right: 0,
    backgroundColor: RED, borderRadius: 10,
    minWidth: 18, height: 18, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 4,
  },
  bellBadgeText: { fontFamily: 'BarlowCondensed_600SemiBold', fontSize: 10, color: '#fff' },

  titleRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    padding: 16, paddingBottom: 12,
  },
  pageTitle: { fontFamily: 'BebasNeue_400Regular', fontSize: 32, color: '#fff', letterSpacing: 2 },
  pageSub: { fontFamily: 'BarlowCondensed_400Regular', fontSize: 13, color: '#666', marginTop: 2, maxWidth: 200 },
  markAll: { fontFamily: 'BarlowCondensed_500Medium', fontSize: 13, color: RED, marginTop: 6 },

  filterScroll: { borderBottomWidth: 1, borderBottomColor: '#151515', paddingBottom: 0 },
  filterTab: {
    paddingHorizontal: 16, paddingVertical: 10,
    marginRight: 4, borderBottomWidth: 2, borderBottomColor: 'transparent',
  },
  filterTabActive: { borderBottomColor: RED },
  filterTabText: { fontFamily: 'BarlowCondensed_500Medium', fontSize: 14, color: '#666' },
  filterTabTextActive: { color: '#fff', fontWeight: '700' },

  list: { paddingHorizontal: 16, paddingTop: 12 },
  notifItem: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 14,
    backgroundColor: CARD, borderRadius: 12, padding: 14,
    marginBottom: 8, borderWidth: 1, borderColor: '#1A1A1A',
  },
  notifIcon: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  notifEmoji: { fontSize: 20 },
  notifContent: { flex: 1 },
  notifMsg: {
    fontFamily: 'BarlowCondensed_400Regular',
    fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 20, marginBottom: 3,
  },
  notifMsgUnread: { color: '#fff', fontWeight: '600' },
  notifSub: { fontFamily: 'BarlowCondensed_400Regular', fontSize: 12, color: '#555', marginBottom: 4 },
  notifTime: { fontFamily: 'BarlowCondensed_400Regular', fontSize: 11, color: '#444' },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: RED, marginTop: 6, flexShrink: 0 },

  paginationSection: { paddingHorizontal: 16, paddingTop: 8 },
  showingText: { fontFamily: 'BarlowCondensed_400Regular', fontSize: 13, color: '#555', marginBottom: 10 },
  paginationRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  pageBtn: {
    width: 36, height: 36, borderRadius: 8,
    backgroundColor: CARD, borderWidth: 1, borderColor: '#1A1A1A',
    alignItems: 'center', justifyContent: 'center',
  },
  pageBtnActive: { backgroundColor: RED, borderColor: RED },
  pageBtnDisabled: { opacity: 0.3 },
  pageBtnText: { fontFamily: 'BarlowCondensed_500Medium', fontSize: 16, color: '#888' },
  pageBtnTextActive: { color: '#fff' },

  emptyBox: { alignItems: 'center', paddingVertical: 60 },
  emptyEmoji: { fontSize: 40, marginBottom: 12 },
  emptyTitle: { fontFamily: 'BarlowCondensed_600SemiBold', fontSize: 18, color: '#888', marginBottom: 4 },
  emptySub: { fontFamily: 'BarlowCondensed_400Regular', fontSize: 14, color: '#555' },
});