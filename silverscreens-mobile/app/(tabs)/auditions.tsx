import React, { useState, useEffect, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, RefreshControl,
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

import { Colors, Fonts } from '../../constants/theme';
import { api } from '../../lib/api';
import { getUser, clearAuth } from '../../lib/auth';

const BG2 = '#0B0F14';
const BG3 = '#121821';

type AuditionStatus = 'Upcoming' | 'Completed' | 'Cancelled';

const STATUS_CFG: Record<AuditionStatus, { bg: string; color: string; border: string }> = {
  'Upcoming':  { bg: 'rgba(139,92,246,0.12)', color: '#A78BFA', border: 'rgba(139,92,246,0.25)' },
  'Completed': { bg: 'rgba(34,197,94,0.12)',  color: '#4ADE80', border: 'rgba(34,197,94,0.25)'  },
  'Cancelled': { bg: 'rgba(239,68,68,0.12)',  color: '#F87171', border: 'rgba(239,68,68,0.25)'  },
};

const TABS = ['All', 'Upcoming', 'Completed', 'Cancelled'];

interface Audition {
  id: string;
  title: string;
  type: string;
  agency: string;
  agencyInitials: string;
  status: AuditionStatus;
  role: string;
  date: string;
  day: string;
  time: string;
  location: string;
  mode: string;
}

export default function AuditionsScreen() {
  const router = useRouter();
  const [auditions, setAuditions] = useState<Audition[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);

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

      const res = await api.get('/api/auditions?limit=100');
      const list = res.data?.data?.auditions ?? res.data?.auditions ?? [];

      const statusMap: Record<string, AuditionStatus> = {
        scheduled:   'Upcoming',
        completed:   'Completed',
        cancelled:   'Cancelled',
        rescheduled: 'Upcoming',
        no_show:     'Cancelled',
      };

      const mapped: Audition[] = list.map((a: any) => {
        const cc = a.casting_calls ?? {};
        const ap = a.agency_profiles ?? {};
        const scheduledAt = a.scheduled_at ? new Date(a.scheduled_at) : null;
        const agencyName = ap.company_name ?? 'Agency';
        return {
          id:             String(a.id),
          title:          cc.title ?? 'Audition',
          type:           cc.project_type ?? 'Film',
          agency:         agencyName,
          agencyInitials: agencyName.slice(0, 2).toUpperCase(),
          status:         statusMap[a.status] ?? 'Upcoming',
          role:           cc.role_name ?? '',
          date:           scheduledAt
            ? scheduledAt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
            : '',
          day: scheduledAt
            ? scheduledAt.toLocaleDateString('en-IN', { weekday: 'long' })
            : '',
          time: scheduledAt
            ? scheduledAt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST'
            : '',
          location: a.venue_details ?? (a.mode === 'online' ? 'Video Call (link sent)' : '—'),
          mode:     a.mode === 'online' ? 'Virtual' : a.mode === 'both' ? 'Hybrid' : 'In-Person',
        };
      });

      setAuditions(mapped);
    } catch (err: any) {
      if (err?.response?.status === 401) {
        await clearAuth();
        router.replace('/login');
      } else {
        Toast.show({ type: 'error', text1: 'Failed to load auditions' });
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => { setRefreshing(true); loadData(); };

  const tabCounts = [
    auditions.length,
    auditions.filter(a => a.status === 'Upcoming').length,
    auditions.filter(a => a.status === 'Completed').length,
    auditions.filter(a => a.status === 'Cancelled').length,
  ];

  const filtered = useMemo(() => {
    if (activeTab === 0) return auditions;
    return auditions.filter(a => a.status === TABS[activeTab]);
  }, [activeTab, auditions]);

  const upcomingList = auditions.filter(a => a.status === 'Upcoming');

  if (!fontsLoaded) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={Colors.gold} size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>MY AUDITIONS</Text>
        <Text style={styles.pageSub}>Track all your audition invitations and their status.</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll}>
        {TABS.map((tab, i) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === i && styles.tabActive]}
            onPress={() => setActiveTab(i)}
          >
            <Text style={[styles.tabText, activeTab === i && styles.tabTextActive]}>
              {tab} ({tabCounts[i]})
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.gold} />}
      >
        {upcomingList.length > 0 && (
          <View style={styles.upcomingBanner}>
            <Text style={styles.upcomingTitle}>📅 Upcoming Auditions</Text>
            {upcomingList.map(a => (
              <View key={a.id} style={styles.upcomingItem}>
                <View style={styles.upcomingLeft}>
                  <Text style={styles.upcomingName}>{a.title}</Text>
                  <Text style={styles.upcomingMeta}>{a.date} • {a.time}</Text>
                  <Text style={styles.upcomingMeta}>📍 {a.location}</Text>
                </View>
                <View style={[styles.statusBadge, {
                  backgroundColor: STATUS_CFG['Upcoming'].bg,
                  borderColor: STATUS_CFG['Upcoming'].border,
                }]}>
                  <Text style={[styles.statusText, { color: STATUS_CFG['Upcoming'].color }]}>Upcoming</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={styles.list}>
          {loading ? (
            <ActivityIndicator color={Colors.gold} style={{ marginTop: 40 }} />
          ) : filtered.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyEmoji}>🎬</Text>
              <Text style={styles.emptyTitle}>No Auditions Yet</Text>
              <Text style={styles.emptySub}>
                Apply to casting calls and agencies will invite you for auditions once they shortlist you.
              </Text>
              <TouchableOpacity style={styles.browseBtn}>
                <Text style={styles.browseBtnText}>Browse Casting Calls</Text>
              </TouchableOpacity>
            </View>
          ) : filtered.map(a => {
            const sCfg = STATUS_CFG[a.status];
            const isExpanded = expandedId === a.id;
            return (
              <View key={a.id} style={styles.card}>
                <View style={styles.cardTop}>
                  <View style={[styles.statusBadge, { backgroundColor: sCfg.bg, borderColor: sCfg.border }]}>
                    <Text style={[styles.statusText, { color: sCfg.color }]}>{a.status}</Text>
                  </View>
                  <View style={styles.dateBox}>
                    <Text style={styles.dateText}>{a.date}</Text>
                    <Text style={styles.dayText}>{a.day}</Text>
                  </View>
                </View>

                <Text style={styles.cardTitle}>{a.title}</Text>
                <Text style={styles.cardType}>{a.type}</Text>

                <View style={styles.cardRow}>
                  <View style={styles.agencyRow}>
                    <View style={styles.agencyAvatar}>
                      <Text style={styles.agencyInitials}>{a.agencyInitials}</Text>
                    </View>
                    <Text style={styles.agencyName}>by {a.agency}</Text>
                  </View>
                  <Text style={styles.timeText}>⏰ {a.time}</Text>
                </View>

                <Text style={styles.locationText}>📍 {a.location}</Text>

                <View style={styles.cardRow}>
                  {a.role ? (
                    <View>
                      <Text style={styles.metaLabel}>Role</Text>
                      <Text style={styles.metaValue}>{a.role}</Text>
                    </View>
                  ) : null}
                  <View>
                    <Text style={styles.metaLabel}>Mode</Text>
                    <Text style={styles.metaValue}>{a.mode}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.viewDetailsBtn}
                  onPress={() => setExpandedId(isExpanded ? null : a.id)}
                >
                  <Text style={styles.viewDetailsText}>
                    View Details {isExpanded ? '∧' : '∨'}
                  </Text>
                </TouchableOpacity>

                {isExpanded && (
                  <View style={styles.expandedBox}>
                    <View style={styles.expandedRow}>
                      <View style={styles.expandedItem}>
                        <Text style={styles.metaLabel}>Audition Type</Text>
                        <Text style={styles.metaValue}>{a.mode}</Text>
                      </View>
                      <View style={styles.expandedItem}>
                        <Text style={styles.metaLabel}>Date & Time</Text>
                        <Text style={styles.metaValue}>{a.date}, {a.time}</Text>
                      </View>
                    </View>
                    <View style={styles.expandedItem}>
                      <Text style={styles.metaLabel}>Venue</Text>
                      <Text style={styles.metaValue}>{a.location}</Text>
                    </View>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        <View style={styles.helpSection}>
          <Text style={styles.helpTitle}>Need Help?</Text>
          <Text style={styles.helpSub}>Have questions about your audition? We're here to help.</Text>
          <TouchableOpacity style={styles.helpBtn}>
            <Text style={styles.helpBtnText}>🎧  Contact Support</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  centered: { flex: 1, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center' },

  header: {
    paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12,
    borderBottomWidth: 1, borderBottomColor: '#1A1A1A',
  },
  pageTitle: { fontFamily: Fonts.heading, fontSize: 28, color: Colors.white, letterSpacing: 3 },
  pageSub: { fontFamily: Fonts.body, fontSize: 14, color: '#666', marginTop: 2 },

  tabsScroll: { paddingHorizontal: 16, paddingTop: 12, borderBottomWidth: 1, borderBottomColor: '#1A1A1A' },
  tab: { paddingHorizontal: 14, paddingVertical: 10, marginRight: 4, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: Colors.red },
  tabText: { fontFamily: Fonts.bodyMedium, fontSize: 15, color: '#666' },
  tabTextActive: { color: Colors.red, fontWeight: '700' },

  upcomingBanner: {
    margin: 16, backgroundColor: BG2,
    borderRadius: 12, padding: 14,
    borderWidth: 1, borderColor: '#1A1A1A',
  },
  upcomingTitle: { fontFamily: Fonts.bodySemiBold, fontSize: 16, color: Colors.white, marginBottom: 10 },
  upcomingItem: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 10,
    paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#1A1A1A',
  },
  upcomingLeft: { flex: 1, marginRight: 10 },
  upcomingName: { fontFamily: Fonts.bodyMedium, fontSize: 14, color: Colors.white, marginBottom: 2 },
  upcomingMeta: { fontFamily: Fonts.body, fontSize: 13, color: '#666' },

  list: { paddingHorizontal: 16, paddingTop: 8 },
  card: {
    backgroundColor: BG2, borderRadius: 12, padding: 14,
    borderWidth: 1, borderColor: '#1A1A1A', marginBottom: 12,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  statusBadge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3, borderWidth: 1 },
  statusText: { fontFamily: Fonts.bodyMedium, fontSize: 13 },
  dateBox: { alignItems: 'flex-end' },
  dateText: { fontFamily: Fonts.bodyMedium, fontSize: 14, color: Colors.white },
  dayText: { fontFamily: Fonts.body, fontSize: 12, color: '#666' },

  cardTitle: { fontFamily: Fonts.bodySemiBold, fontSize: 18, color: Colors.white, marginBottom: 2 },
  cardType: { fontFamily: Fonts.body, fontSize: 14, color: '#666', marginBottom: 10 },

  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  agencyRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  agencyAvatar: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: 'rgba(212,166,74,0.2)',
    borderWidth: 1, borderColor: 'rgba(212,166,74,0.4)',
    alignItems: 'center', justifyContent: 'center',
  },
  agencyInitials: { fontFamily: Fonts.bodyMedium, fontSize: 10, color: Colors.gold },
  agencyName: { fontFamily: Fonts.body, fontSize: 14, color: '#888' },
  timeText: { fontFamily: Fonts.body, fontSize: 13, color: '#888' },
  locationText: { fontFamily: Fonts.body, fontSize: 13, color: '#666', marginBottom: 10 },

  metaLabel: { fontFamily: Fonts.body, fontSize: 12, color: '#555', marginBottom: 2 },
  metaValue: { fontFamily: Fonts.bodyMedium, fontSize: 14, color: Colors.white },

  viewDetailsBtn: { marginTop: 8, alignSelf: 'flex-start' },
  viewDetailsText: { fontFamily: Fonts.bodyMedium, fontSize: 14, color: Colors.gold },

  expandedBox: {
    marginTop: 10, padding: 12,
    backgroundColor: BG3, borderRadius: 8,
    borderWidth: 1, borderColor: '#1A1A1A', gap: 8,
  },
  expandedRow: { flexDirection: 'row', gap: 16 },
  expandedItem: { flex: 1 },

  emptyBox: { alignItems: 'center', paddingVertical: 60, paddingHorizontal: 32 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontFamily: Fonts.heading, fontSize: 24, color: Colors.white, letterSpacing: 2, marginBottom: 8 },
  emptySub: { fontFamily: Fonts.body, fontSize: 14, color: '#666', textAlign: 'center', lineHeight: 20, marginBottom: 20 },
  browseBtn: { backgroundColor: Colors.red, borderRadius: 8, paddingHorizontal: 24, paddingVertical: 12 },
  browseBtnText: { fontFamily: Fonts.bodySemiBold, fontSize: 15, color: Colors.white },

  helpSection: {
    margin: 16, backgroundColor: BG2,
    borderRadius: 12, padding: 16,
    borderWidth: 1, borderColor: '#1A1A1A',
  },
  helpTitle: { fontFamily: Fonts.bodySemiBold, fontSize: 17, color: Colors.white, marginBottom: 6 },
  helpSub: { fontFamily: Fonts.body, fontSize: 14, color: '#666', marginBottom: 12 },
  helpBtn: { borderWidth: 1, borderColor: Colors.red, borderRadius: 8, paddingVertical: 12, alignItems: 'center' },
  helpBtnText: { fontFamily: Fonts.bodySemiBold, fontSize: 15, color: Colors.red },
});