import React, { useState, useEffect, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, RefreshControl, Alert,
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

type CastingType = 'Web Series' | 'Film' | 'TV Series' | 'Ad Film' | string;

const TYPE_CFG: Record<string, { bg: string; color: string }> = {
  'Web Series': { bg: 'rgba(59,130,246,0.1)',   color: '#60A5FA' },
  'Film':       { bg: 'rgba(148,163,184,0.08)', color: '#94A3B8' },
  'TV Series':  { bg: 'rgba(34,197,94,0.1)',    color: '#4ADE80' },
  'Ad Film':    { bg: 'rgba(236,72,153,0.1)',   color: '#F472B6' },
};

const TABS = ['All Saved', 'Film', 'Web Series', 'TV', 'Ad Films'];

const SORT_OPTIONS = ['Recently Saved', 'Oldest Saved', 'Application Deadline'];

const QUICK_TIPS = [
  { emoji: '❤️', text: "Save castings you're interested in to apply later." },
  { emoji: '🔔', text: "We'll notify you about updates to saved castings."  },
  { emoji: '📅', text: 'Keep track and never miss an opportunity.'          },
];

export default function SavedCastingsScreen() {
  const router = useRouter();
  const [castings, setCastings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [sortBy, setSortBy] = useState('Recently Saved');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [language, setLanguage] = useState('All Languages');
  const [location, setLocation] = useState('All Locations');

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
      const res = await api.get('/api/saved-castings');
      const list = res.data?.data?.saved ?? res.data?.saved ?? [];
      const mapped = Array.isArray(list) ? list.map((s: any, i: number) => {
        const cc = s.casting_calls ?? {};
        const ag = cc.agency_profiles ?? {};
        const typeMap: Record<string, string> = {
          Film: 'Film', Web_Series: 'Web Series', 'Web Series': 'Web Series',
          TV_Series: 'TV Series', 'TV Series': 'TV Series',
          Ad_Film: 'Ad Film', 'Ad Film': 'Ad Film',
        };
        return {
          id:             s.id ?? i,
          castingCallId:  cc.id,
          title:          cc.title ?? 'Casting Call',
          type:           typeMap[cc.project_type] ?? 'Film',
          genres:         cc.category ?? '',
          language:       Array.isArray(cc.languages_required) ? cc.languages_required.join(', ') : '',
          agency:         ag.company_name ?? '',
          agencyInitials: (ag.company_name ?? 'A').slice(0, 2).toUpperCase(),
          description:    cc.role_description ?? cc.eligibility_criteria ?? '',
          role:           cc.role_name ?? '',
          ageRange:       cc.age_min && cc.age_max ? `${cc.age_min} – ${cc.age_max} Yrs` : '',
          location:       cc.location ?? ag.city ?? '',
          postedOn:       cc.created_at
            ? new Date(cc.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
            : '',
          savedOn:        s.created_at
            ? new Date(s.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
            : '',
          savedAt:        s.created_at ? new Date(s.created_at).getTime() : 0,
        };
      }) : [];
      setCastings(mapped);
    } catch (err: any) {
      if (err?.response?.status === 401) { await clearAuth(); router.replace('/login'); }
      else Toast.show({ type: 'error', text1: 'Failed to load saved castings' });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const unsave = (castingCallId: string, title: string) => {
    Alert.alert(
      'Remove Saved Casting',
      `Remove "${title}" from saved castings?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove', style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/api/saved-castings?casting_call_id=${castingCallId}`);
              setCastings(prev => prev.filter((c: any) => c.castingCallId !== castingCallId));
              Toast.show({ type: 'success', text1: 'Removed from saved castings' });
            } catch {
              Toast.show({ type: 'error', text1: 'Failed to remove' });
            }
          },
        },
      ]
    );
  };

  if (!fontsLoaded) return null;

  const filtered = useMemo(() => {
    let list = castings;
    if (activeTab === 1) list = list.filter(c => c.type === 'Film');
    if (activeTab === 2) list = list.filter(c => c.type === 'Web Series');
    if (activeTab === 3) list = list.filter(c => c.type === 'TV Series');
    if (activeTab === 4) list = list.filter(c => c.type === 'Ad Film');
    if (sortBy === 'Recently Saved') list = [...list].sort((a, b) => b.savedAt - a.savedAt);
    if (sortBy === 'Oldest Saved')   list = [...list].sort((a, b) => a.savedAt - b.savedAt);
    return list;
  }, [castings, activeTab, sortBy]);

  const tabCounts = [
    castings.length,
    castings.filter(c => c.type === 'Film').length,
    castings.filter(c => c.type === 'Web Series').length,
    castings.filter(c => c.type === 'TV Series').length,
    castings.filter(c => c.type === 'Ad Film').length,
  ];

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.pageTitle}>SAVED CASTINGS</Text>
          <Text style={styles.pageSub}>Castings you've saved to apply later.</Text>
        </View>
      </View>

      {/* Tabs */}
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

      {/* Sort bar */}
      <View style={styles.sortBar}>
        <TouchableOpacity
          style={styles.sortBtn}
          onPress={() => setShowSortMenu(!showSortMenu)}
        >
          <Text style={styles.sortBtnText}>{sortBy} ▾</Text>
        </TouchableOpacity>
      </View>

      {/* Sort menu */}
      {showSortMenu && (
        <View style={styles.sortMenu}>
          {SORT_OPTIONS.map(opt => (
            <TouchableOpacity
              key={opt}
              style={styles.sortMenuItem}
              onPress={() => { setSortBy(opt); setShowSortMenu(false); }}
            >
              <Text style={[styles.sortMenuText, sortBy === opt && { color: Colors.gold }]}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadData(); }} tintColor={Colors.gold} />}
      >
        {/* Cards */}
        <View style={styles.list}>
          {loading ? (
            <ActivityIndicator color={Colors.gold} style={{ marginTop: 40 }} />
          ) : filtered.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyEmoji}>🔖</Text>
              <Text style={styles.emptyTitle}>No Saved Castings</Text>
              <Text style={styles.emptySub}>Save castings you're interested in to apply later.</Text>
              <TouchableOpacity style={styles.browseBtn} onPress={() => router.push('/casting-calls' as any)}>
                <Text style={styles.browseBtnText}>Browse Casting Calls</Text>
              </TouchableOpacity>
            </View>
          ) : filtered.map(c => {
            const tCfg = TYPE_CFG[c.type] ?? { bg: 'rgba(255,255,255,0.06)', color: '#aaa' };
            return (
              <View key={c.id} style={styles.card}>
                {/* Type + Saved */}
                <View style={styles.cardTop}>
                  <View style={[styles.typeBadge, { backgroundColor: tCfg.bg }]}>
                    <Text style={[styles.typeText, { color: tCfg.color }]}>{c.type}</Text>
                  </View>
                  <View style={styles.savedInfo}>
                    <TouchableOpacity onPress={() => unsave(c.castingCallId, c.title)}>
                      <Text style={styles.unsaveIcon}>🔖</Text>
                    </TouchableOpacity>
                    <View>
                      <Text style={styles.savedLabel}>Saved on</Text>
                      <Text style={styles.savedDate}>{c.savedOn}</Text>
                    </View>
                  </View>
                </View>

                <Text style={styles.cardTitle}>{c.title}</Text>
                <Text style={styles.cardMeta}>{c.genres}{c.language ? ` • ${c.language}` : ''}</Text>

                {/* Agency + Location */}
                <View style={styles.cardRow}>
                  <View style={styles.agencyRow}>
                    <View style={styles.agencyAvatar}>
                      <Text style={styles.agencyInitials}>{c.agencyInitials}</Text>
                    </View>
                    <Text style={styles.agencyName}>by {c.agency}</Text>
                  </View>
                  {c.location ? <Text style={styles.locationText}>📍 {c.location}</Text> : null}
                </View>

                {/* Posted */}
                <Text style={styles.postedText}>📅 Posted {c.postedOn}</Text>

                {/* Description */}
                {c.description ? (
                  <Text style={styles.description} numberOfLines={3}>{c.description}</Text>
                ) : null}

                {/* Role + Age */}
                <View style={styles.cardRow}>
                  {c.role ? (
                    <View>
                      <Text style={styles.metaLabel}>Role</Text>
                      <Text style={styles.metaValue}>{c.role}</Text>
                    </View>
                  ) : null}
                  {c.ageRange ? (
                    <View>
                      <Text style={styles.metaLabel}>Age Range</Text>
                      <Text style={styles.metaValue}>{c.ageRange}</Text>
                    </View>
                  ) : null}
                </View>

                {/* View Details */}
                <TouchableOpacity
                  style={styles.viewDetailsBtn}
                  onPress={() => router.push(`/casting-calls/${c.castingCallId}` as any)}
                >
                  <Text style={styles.viewDetailsText}>View Details</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        {/* Quick Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Tips</Text>
          {QUICK_TIPS.map((tip, i) => (
            <View key={i} style={styles.tipRow}>
              <View style={styles.tipIcon}>
                <Text style={styles.tipEmoji}>{tip.emoji}</Text>
              </View>
              <Text style={styles.tipText}>{tip.text}</Text>
            </View>
          ))}
        </View>

        {/* Need Help */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Need Help?</Text>
          <Text style={styles.helpSub}>Have questions about your saved castings? We're here to help.</Text>
          <TouchableOpacity style={styles.helpBtn} onPress={() => router.push('/support' as any)}>
            <Text style={styles.helpBtnText}>🎧  Contact Support</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12,
    borderBottomWidth: 1, borderBottomColor: '#1A1A1A',
  },
  backBtn: { padding: 4 },
  backArrow: { fontSize: 22, color: Colors.white },
  pageTitle: { fontFamily: Fonts.heading, fontSize: 26, color: Colors.white, letterSpacing: 3 },
  pageSub: { fontFamily: Fonts.body, fontSize: 13, color: '#666', marginTop: 2 },

  tabsScroll: { paddingHorizontal: 16, paddingTop: 12, borderBottomWidth: 1, borderBottomColor: '#1A1A1A' },
  tab: { paddingHorizontal: 14, paddingVertical: 10, marginRight: 4, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: Colors.gold },
  tabText: { fontFamily: Fonts.bodyMedium, fontSize: 14, color: '#666' },
  tabTextActive: { color: Colors.gold, fontWeight: '700' },

  sortBar: { paddingHorizontal: 16, paddingVertical: 10, flexDirection: 'row', justifyContent: 'flex-end' },
  sortBtn: { backgroundColor: BG3, borderRadius: 8, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1, borderColor: '#1A1A1A' },
  sortBtnText: { fontFamily: Fonts.bodyMedium, fontSize: 14, color: Colors.white },
  sortMenu: {
    position: 'absolute', right: 16, top: 140, zIndex: 100,
    backgroundColor: BG3, borderRadius: 8, borderWidth: 1, borderColor: '#2A2A2A',
    shadowColor: '#000', shadowOpacity: 0.5, shadowRadius: 8,
  },
  sortMenuItem: { paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#1A1A1A' },
  sortMenuText: { fontFamily: Fonts.bodyMedium, fontSize: 14, color: Colors.white },

  list: { paddingHorizontal: 16, paddingTop: 8 },
  card: {
    backgroundColor: BG2, borderRadius: 12, padding: 14,
    borderWidth: 1, borderColor: '#1A1A1A', marginBottom: 12,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  typeBadge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  typeText: { fontFamily: Fonts.bodyMedium, fontSize: 13 },
  savedInfo: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  unsaveIcon: { fontSize: 18 },
  savedLabel: { fontFamily: Fonts.body, fontSize: 12, color: '#555' },
  savedDate: { fontFamily: Fonts.bodyMedium, fontSize: 13, color: Colors.gold },

  cardTitle: { fontFamily: Fonts.bodySemiBold, fontSize: 18, color: Colors.white, marginBottom: 4 },
  cardMeta: { fontFamily: Fonts.body, fontSize: 13, color: '#666', marginBottom: 8 },

  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  agencyRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  agencyAvatar: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: 'rgba(212,166,74,0.2)',
    borderWidth: 1, borderColor: 'rgba(212,166,74,0.4)',
    alignItems: 'center', justifyContent: 'center',
  },
  agencyInitials: { fontFamily: Fonts.bodyMedium, fontSize: 10, color: Colors.gold },
  agencyName: { fontFamily: Fonts.body, fontSize: 13, color: '#888' },
  locationText: { fontFamily: Fonts.body, fontSize: 13, color: '#666' },
  postedText: { fontFamily: Fonts.body, fontSize: 13, color: '#555', marginBottom: 8 },
  description: { fontFamily: Fonts.body, fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 18, marginBottom: 10 },

  metaLabel: { fontFamily: Fonts.body, fontSize: 12, color: '#555', marginBottom: 2 },
  metaValue: { fontFamily: Fonts.bodyMedium, fontSize: 14, color: Colors.white },

  viewDetailsBtn: {
    marginTop: 10, borderWidth: 1, borderColor: Colors.gold,
    borderRadius: 8, paddingVertical: 10, alignItems: 'center',
  },
  viewDetailsText: { fontFamily: Fonts.bodyMedium, fontSize: 14, color: Colors.gold },

  emptyBox: { alignItems: 'center', paddingVertical: 60, paddingHorizontal: 32 },
  emptyEmoji: { fontSize: 40, marginBottom: 12 },
  emptyTitle: { fontFamily: Fonts.heading, fontSize: 22, color: Colors.white, letterSpacing: 2, marginBottom: 8 },
  emptySub: { fontFamily: Fonts.body, fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 20 },
  browseBtn: { backgroundColor: Colors.red, borderRadius: 8, paddingHorizontal: 24, paddingVertical: 12 },
  browseBtnText: { fontFamily: Fonts.bodySemiBold, fontSize: 15, color: Colors.white },

  section: {
    marginHorizontal: 16, marginBottom: 12,
    backgroundColor: BG2, borderRadius: 12, padding: 16,
    borderWidth: 1, borderColor: '#1A1A1A',
  },
  sectionTitle: { fontFamily: Fonts.bodySemiBold, fontSize: 17, color: Colors.white, marginBottom: 12 },
  tipRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  tipIcon: {
    width: 36, height: 36, borderRadius: 8,
    backgroundColor: 'rgba(212,166,74,0.1)',
    borderWidth: 1, borderColor: 'rgba(212,166,74,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  tipEmoji: { fontSize: 16 },
  tipText: { fontFamily: Fonts.body, fontSize: 14, color: 'rgba(255,255,255,0.55)', flex: 1, lineHeight: 20 },
  helpSub: { fontFamily: Fonts.body, fontSize: 14, color: '#666', marginBottom: 12 },
  helpBtn: { borderWidth: 1, borderColor: Colors.red, borderRadius: 8, paddingVertical: 12, alignItems: 'center' },
  helpBtnText: { fontFamily: Fonts.bodySemiBold, fontSize: 15, color: Colors.red },
});