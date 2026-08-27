import React, { useState, useEffect, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, RefreshControl, Image,
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

const STATUS_CFG: Record<string, { bg: string; color: string }> = {
  'In Review':   { bg: 'rgba(212,166,74,0.15)',  color: '#D4A64A' },
  'Applied':     { bg: 'rgba(59,130,246,0.15)',  color: '#60A5FA' },
  'Shortlisted': { bg: 'rgba(34,197,94,0.15)',   color: '#4ADE80' },
  'Rejected':    { bg: 'rgba(239,68,68,0.15)',   color: '#F87171' },
  'selected':    { bg: 'rgba(34,197,94,0.15)',   color: '#4ADE80' },
};

const TYPE_CFG: Record<string, string> = {
  'Film':       '#4ADE80',
  'Web Series': '#A78BFA',
  'TV Series':  '#60A5FA',
  'Ad Film':    '#F472B6',
};

const TABS = ['All', 'Applied', 'In Review', 'Shortlisted', 'Rejected'];

export default function ApplicationsScreen() {
  const router = useRouter();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

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
      const res = await api.get('/api/applications');
      const list = res.data?.data?.applications ?? res.data?.applications ?? res.data?.data ?? [];
      const mapped = Array.isArray(list) ? list.map((a: any) => ({
        id:          a.id ?? String(Date.now()),
        title:       a.casting_calls?.title ?? a.title ?? 'Casting Call',
        type:        a.casting_calls?.project_type ?? a.genre ?? 'Film',
        role:        a.casting_calls?.role_name ?? a.role ?? '',
        agency:      a.casting_calls?.agency_profiles?.company_name ?? a.agency ?? '',
        location:    a.casting_calls?.location ?? a.location ?? '',
        appliedDate: a.applied_at ? new Date(a.applied_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '',
        documents:   0,
        status:      a.status === 'applied'      ? 'Applied'
                   : a.status === 'in_review'    ? 'In Review'
                   : a.status === 'shortlisted'  ? 'Shortlisted'
                   : a.status === 'rejected'     ? 'Rejected'
                   : a.status ?? 'Applied',
        image:       a.casting_calls?.cover_image ?? null,
      })) : [];
      setApplications(mapped);
    } catch (err: any) {
      if (err?.response?.status === 401) { await clearAuth(); router.replace('/login'); }
      else Toast.show({ type: 'error', text1: 'Failed to load applications' });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filtered = useMemo(() => {
    if (activeTab === 0) return applications;
    return applications.filter(a => a.status === TABS[activeTab]);
  }, [activeTab, applications]);

  const counts = {
    all:         applications.length,
    applied:     applications.filter(a => a.status === 'Applied').length,
    inReview:    applications.filter(a => a.status === 'In Review').length,
    shortlisted: applications.filter(a => a.status === 'Shortlisted').length,
    rejected:    applications.filter(a => a.status === 'Rejected').length,
  };

  const tabCounts = [counts.all, counts.applied, counts.inReview, counts.shortlisted, counts.rejected];

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.brandWhite}>SILVER </Text>
          <Text style={styles.brandRed}>SCREENS</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.bellWrap}>
            <Text style={styles.bellIcon}>🔔</Text>
            <View style={styles.bellDot} />
          </View>
          <TouchableOpacity onPress={() => router.push('/my-profile' as any)}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>V</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Page title */}
      <View style={styles.titleSection}>
        <Text style={styles.pageTitle}>MY APPLICATIONS</Text>
        <Text style={styles.pageSub}>Track and manage all your casting applications</Text>
      </View>

      {/* Tabs with count badges */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll} contentContainerStyle={{ paddingHorizontal: 16 }}>
        {TABS.map((tab, i) => (
          <TouchableOpacity
            key={tab}
            style={styles.tabItem}
            onPress={() => setActiveTab(i)}
          >
            <View style={[styles.tabBadge, activeTab === i && styles.tabBadgeActive]}>
              <Text style={[styles.tabBadgeNum, activeTab === i && styles.tabBadgeNumActive]}>
                {tabCounts[i]}
              </Text>
            </View>
            <Text style={[styles.tabLabel, activeTab === i && styles.tabLabelActive]}>{tab}</Text>
            {activeTab === i && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Sort + Filter row */}
      <View style={styles.filterRow}>
        <TouchableOpacity style={styles.filterBtn}>
          <Text style={styles.filterIcon}>⇅</Text>
          <Text style={styles.filterText}>Sort</Text>
          <Text style={styles.filterValue}>Newest First ▾</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterBtn}>
          <Text style={styles.filterIcon}>📅</Text>
          <Text style={styles.filterText}>Filter</Text>
          <Text style={styles.filterValue}>All Status ▾</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator color={GOLD} style={{ marginTop: 40 }} />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadData(); }} tintColor={GOLD} />}
        >
          <View style={styles.list}>
            {filtered.length === 0 ? (
              <View style={styles.emptyBox}>
                <Text style={styles.emptyEmoji}>📋</Text>
                <Text style={styles.emptyTitle}>No applications found</Text>
                <Text style={styles.emptySub}>Apply to casting calls to see them here.</Text>
              </View>
            ) : filtered.map(app => {
              const sCfg = STATUS_CFG[app.status] ?? STATUS_CFG['Applied'];
              const typeColor = TYPE_CFG[app.type] ?? '#888';
              return (
                <TouchableOpacity key={app.id} style={styles.appCard} activeOpacity={0.8}>
                  {/* Left image */}
                  <View style={styles.appImg}>
                    <Text style={{ fontSize: 28, opacity: 0.5 }}>🎬</Text>
                  </View>
                  {/* Content */}
                  <View style={styles.appContent}>
                    <View style={styles.appTitleRow}>
                      <Text style={styles.appTitle} numberOfLines={1}>{app.title}</Text>
                      <View style={[styles.typeBadge, { backgroundColor: `${typeColor}20` }]}>
                        <Text style={[styles.typeText, { color: typeColor }]}>{app.type}</Text>
                      </View>
                    </View>
                    <Text style={styles.appRole}>{app.role}</Text>
                    <View style={styles.appAgencyRow}>
                      <Text style={styles.appAgency}>{app.agency}</Text>
                      {app.location ? <Text style={styles.appLocation}>📍</Text> : null}
                    </View>
                    <View style={styles.appMetaRow}>
                      <Text style={styles.appMeta}>📅 Applied on {app.appliedDate}</Text>
                      <Text style={styles.appMeta}>  •  </Text>
                      <Text style={styles.appMeta}>📄 {app.documents} Documents</Text>
                    </View>
                  </View>
                  {/* Status + chevron */}
                  <View style={styles.appRight}>
                    <View style={[styles.statusBadge, { backgroundColor: sCfg.bg }]}>
                      <Text style={[styles.statusText, { color: sCfg.color }]}>{app.status}</Text>
                    </View>
                    <Text style={styles.appChevron}>›</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {filtered.length > 0 && (
            <Text style={styles.showingText}>Showing 1-{filtered.length} of {applications.length} applications</Text>
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
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  brandWhite: { fontFamily: 'BebasNeue_400Regular', fontSize: 20, color: '#fff', letterSpacing: 2 },
  brandRed: { fontFamily: 'BebasNeue_400Regular', fontSize: 20, color: RED, letterSpacing: 2 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  bellWrap: { position: 'relative' },
  bellIcon: { fontSize: 22 },
  bellDot: { position: 'absolute', top: -2, right: -2, width: 8, height: 8, borderRadius: 4, backgroundColor: RED, borderWidth: 1.5, borderColor: BG },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#333', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: GOLD },
  avatarText: { fontFamily: 'BebasNeue_400Regular', fontSize: 18, color: '#fff' },

  titleSection: { padding: 16, paddingBottom: 12 },
  pageTitle: { fontFamily: 'BebasNeue_400Regular', fontSize: 32, color: '#fff', letterSpacing: 2 },
  pageSub: { fontFamily: 'BarlowCondensed_400Regular', fontSize: 14, color: '#666', marginTop: 2 },

  // Tabs
  tabsScroll: { borderBottomWidth: 1, borderBottomColor: '#151515', marginBottom: 0 },
  tabItem: { alignItems: 'center', marginRight: 20, paddingBottom: 12, position: 'relative' },
  tabBadge: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: '#1A1A1A', alignItems: 'center', justifyContent: 'center', marginBottom: 4,
  },
  tabBadgeActive: { backgroundColor: RED },
  tabBadgeNum: { fontFamily: 'BarlowCondensed_600SemiBold', fontSize: 12, color: '#666' },
  tabBadgeNumActive: { color: '#fff' },
  tabLabel: { fontFamily: 'BarlowCondensed_400Regular', fontSize: 13, color: '#666' },
  tabLabelActive: { color: RED, fontWeight: '700' },
  tabUnderline: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, backgroundColor: RED, borderRadius: 1 },

  // Filter row
  filterRow: { flexDirection: 'row', gap: 10, padding: 12, paddingTop: 10 },
  filterBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: CARD, borderRadius: 8, padding: 10,
    borderWidth: 1, borderColor: '#1A1A1A',
  },
  filterIcon: { fontSize: 14 },
  filterText: { fontFamily: 'BarlowCondensed_400Regular', fontSize: 13, color: '#666' },
  filterValue: { fontFamily: 'BarlowCondensed_500Medium', fontSize: 13, color: '#aaa', flex: 1 },

  // List
  list: { paddingHorizontal: 16, paddingTop: 8 },
  appCard: {
    backgroundColor: CARD, borderRadius: 12, marginBottom: 10,
    borderWidth: 1, borderColor: '#1A1A1A',
    flexDirection: 'row', overflow: 'hidden',
  },
  appImg: {
    width: 100, backgroundColor: '#0D0D10',
    alignItems: 'center', justifyContent: 'center',
  },
  appContent: { flex: 1, padding: 12, gap: 3 },
  appTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  appTitle: { fontFamily: 'BarlowCondensed_600SemiBold', fontSize: 16, color: '#fff', flex: 1 },
  typeBadge: { borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  typeText: { fontFamily: 'BarlowCondensed_500Medium', fontSize: 11 },
  appRole: { fontFamily: 'BarlowCondensed_400Regular', fontSize: 13, color: '#888' },
  appAgencyRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  appAgency: { fontFamily: 'BarlowCondensed_400Regular', fontSize: 13, color: '#666' },
  appLocation: { fontSize: 12 },
  appMetaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  appMeta: { fontFamily: 'BarlowCondensed_400Regular', fontSize: 11, color: '#555' },
  appRight: { padding: 12, alignItems: 'flex-end', justifyContent: 'center', gap: 8, minWidth: 90 },
  statusBadge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  statusText: { fontFamily: 'BarlowCondensed_600SemiBold', fontSize: 12 },
  appChevron: { fontSize: 20, color: '#444' },

  showingText: { fontFamily: 'BarlowCondensed_400Regular', fontSize: 13, color: '#555', textAlign: 'center', paddingVertical: 12 },

  emptyBox: { alignItems: 'center', paddingVertical: 60 },
  emptyEmoji: { fontSize: 40, marginBottom: 12 },
  emptyTitle: { fontFamily: 'BarlowCondensed_600SemiBold', fontSize: 18, color: '#888', marginBottom: 6 },
  emptySub: { fontFamily: 'BarlowCondensed_400Regular', fontSize: 14, color: '#555' },
});