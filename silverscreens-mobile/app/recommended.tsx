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
import { Colors, Fonts } from '../constants/theme';
import { api } from '../lib/api';
import { getUser, clearAuth } from '../lib/auth';

const BG2 = '#0B0F14';
const BG3 = '#121821';

const TABS = ['All', 'Film', 'Web Series', 'TV', 'Ad Films'];

const TYPE_CFG: Record<string, { bg: string; color: string }> = {
  'Web Series': { bg: 'rgba(59,130,246,0.1)',   color: '#60A5FA' },
  'Film':       { bg: 'rgba(148,163,184,0.08)', color: '#94A3B8' },
  'TV Series':  { bg: 'rgba(34,197,94,0.1)',    color: '#4ADE80' },
  'Ad Film':    { bg: 'rgba(236,72,153,0.1)',   color: '#F472B6' },
};

const SORT_OPTIONS = ['Most Relevant', 'Newest First', 'Deadline Soon'];

const DEPARTMENTS = ['Acting', 'Modelling', 'Dancing', 'Singing', 'Direction', 'Production'];
const LANGUAGES   = ['Hindi', 'English', 'Tamil', 'Telugu', 'Bengali', 'Kannada'];
const LOCATIONS   = ['Mumbai', 'Delhi', 'Chennai', 'Hyderabad', 'Bangalore', 'Kolkata'];

const WHY_REASONS = [
  'Your profile & skills match the brief',
  'Based on your past applications',
  'Saved preferences & genre interests',
  'Casting team requirements align',
];

const TIPS = [
  'Keep your profile 100% complete',
  'Add recent photos & showreel videos',
  'Update your availability calendar',
  'Apply to more castings to rank higher',
];

export default function RecommendedScreen() {
  const router = useRouter();
  const [castings, setCastings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [sortBy, setSortBy] = useState('Most Relevant');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedLang, setSelectedLang] = useState('');
  const [selectedLoc, setSelectedLoc] = useState('');
  const [categories, setCategories] = useState<Record<string, boolean>>({
    Film: false, 'Web Series': false, TV: false, 'Ad Films': false, Others: false,
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
      const res = await api.get('/api/recommended');
      const list = res.data?.data?.castings ?? res.data?.castings ?? res.data?.data ?? [];
      const mapped = Array.isArray(list) ? list.map((c: any, i: number) => {
        const ag = c.agency_profiles ?? {};
        const typeMap: Record<string, string> = {
          Film: 'Film', Web_Series: 'Web Series', 'Web Series': 'Web Series',
          TV_Series: 'TV Series', 'TV Series': 'TV Series',
          Ad_Film: 'Ad Film', 'Ad Film': 'Ad Film',
        };
        return {
          id:             c.id ?? i,
          title:          c.title ?? 'Casting Call',
          type:           typeMap[c.project_type] ?? 'Film',
          role:           c.role_name ?? '',
          agency:         ag.company_name ?? '',
          agencyInitials: (ag.company_name ?? 'A').slice(0, 2).toUpperCase(),
          location:       c.location ?? '',
          language:       Array.isArray(c.languages_required) ? c.languages_required.join(', ') : '',
          ageRange:       c.age_min && c.age_max ? `${c.age_min}–${c.age_max} Yrs` : '',
          deadline:       c.apply_by ? new Date(c.apply_by).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '',
          postedOn:       c.created_at ? new Date(c.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : '',
          matchScore:     c.match_score ?? Math.floor(70 + Math.random() * 30),
        };
      }) : [];
      setCastings(mapped);
    } catch (err: any) {
      if (err?.response?.status === 401) { await clearAuth(); router.replace('/login'); }
      else Toast.show({ type: 'error', text1: 'Failed to load recommendations' });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const resetFilters = () => {
    setCategories({ Film: false, 'Web Series': false, TV: false, 'Ad Films': false, Others: false });
    setSelectedDept('');
    setSelectedLang('');
    setSelectedLoc('');
  };

  if (!fontsLoaded) return null;

  const filtered = useMemo(() => {
    let list = castings;
    if (activeTab === 1) list = list.filter(c => c.type === 'Film');
    if (activeTab === 2) list = list.filter(c => c.type === 'Web Series');
    if (activeTab === 3) list = list.filter(c => c.type === 'TV Series');
    if (activeTab === 4) list = list.filter(c => c.type === 'Ad Film');
    if (selectedLoc) list = list.filter(c => c.location?.includes(selectedLoc));
    if (selectedLang) list = list.filter(c => c.language?.includes(selectedLang));
    return list;
  }, [castings, activeTab, selectedLoc, selectedLang]);

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
        <View style={{ flex: 1 }}>
          <Text style={styles.pageTitle}>RECOMMENDED CASTINGS</Text>
          <Text style={styles.pageSub}>Personalized based on your profile & preferences.</Text>
        </View>
        <TouchableOpacity
          style={styles.filterToggleBtn}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Text style={styles.filterToggleText}>⚙ Filters</Text>
        </TouchableOpacity>
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

      {/* Sort + filter bar */}
      <View style={styles.sortBar}>
        <TouchableOpacity style={styles.sortBtn} onPress={() => setShowSortMenu(!showSortMenu)}>
          <Text style={styles.sortBtnText}>⚡ {sortBy} ▾</Text>
        </TouchableOpacity>
        {Object.values(categories).some(Boolean) || selectedLang || selectedLoc ? (
          <TouchableOpacity onPress={resetFilters}>
            <Text style={styles.resetText}>🔄 Reset</Text>
          </TouchableOpacity>
        ) : null}
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

      {/* Filter panel */}
      {showFilters && (
        <View style={styles.filterPanel}>
          <Text style={styles.filterTitle}>REFINE RECOMMENDATIONS</Text>

          <Text style={styles.filterLabel}>CATEGORY</Text>
          <View style={styles.tagsRow}>
            {Object.keys(categories).map(cat => (
              <TouchableOpacity
                key={cat}
                style={[styles.filterTag, categories[cat] && styles.filterTagActive]}
                onPress={() => setCategories(prev => ({ ...prev, [cat]: !prev[cat] }))}
              >
                <Text style={[styles.filterTagText, categories[cat] && { color: Colors.gold }]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.filterLabel}>DEPARTMENT</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.tagsRow}>
              {DEPARTMENTS.map(d => (
                <TouchableOpacity
                  key={d}
                  style={[styles.filterTag, selectedDept === d && styles.filterTagActive]}
                  onPress={() => setSelectedDept(selectedDept === d ? '' : d)}
                >
                  <Text style={[styles.filterTagText, selectedDept === d && { color: Colors.gold }]}>{d}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <Text style={styles.filterLabel}>LANGUAGE</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.tagsRow}>
              {LANGUAGES.map(l => (
                <TouchableOpacity
                  key={l}
                  style={[styles.filterTag, selectedLang === l && styles.filterTagActive]}
                  onPress={() => setSelectedLang(selectedLang === l ? '' : l)}
                >
                  <Text style={[styles.filterTagText, selectedLang === l && { color: Colors.gold }]}>{l}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <Text style={styles.filterLabel}>LOCATION</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.tagsRow}>
              {LOCATIONS.map(loc => (
                <TouchableOpacity
                  key={loc}
                  style={[styles.filterTag, selectedLoc === loc && styles.filterTagActive]}
                  onPress={() => setSelectedLoc(selectedLoc === loc ? '' : loc)}
                >
                  <Text style={[styles.filterTagText, selectedLoc === loc && { color: Colors.gold }]}>{loc}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <TouchableOpacity
            style={styles.applyBtn}
            onPress={() => setShowFilters(false)}
          >
            <Text style={styles.applyBtnText}>Apply Filters</Text>
          </TouchableOpacity>
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
              <Text style={styles.emptyEmoji}>🎬</Text>
              <Text style={styles.emptyTitle}>No castings match your filters</Text>
              <Text style={styles.emptySub}>Try adjusting or resetting your filters to see more results.</Text>
              <TouchableOpacity style={styles.resetBtn} onPress={resetFilters}>
                <Text style={styles.resetBtnText}>Reset Filters</Text>
              </TouchableOpacity>
            </View>
          ) : filtered.map(c => {
            const tCfg = TYPE_CFG[c.type] ?? { bg: 'rgba(255,255,255,0.06)', color: '#aaa' };
            return (
              <TouchableOpacity
                key={c.id}
                style={styles.card}
                activeOpacity={0.8}
                onPress={() => router.push(`/casting-calls/${c.id}` as any)}
              >
                {/* Type + Match */}
                <View style={styles.cardTop}>
                  <View style={[styles.typeBadge, { backgroundColor: tCfg.bg }]}>
                    <Text style={[styles.typeText, { color: tCfg.color }]}>{c.type}</Text>
                  </View>
                  <View style={styles.matchBadge}>
                    <Text style={styles.matchText}>⭐ {c.matchScore}% Match</Text>
                  </View>
                </View>

                <Text style={styles.cardTitle}>{c.title}</Text>
                <Text style={styles.cardRole}>{c.role}</Text>

                {/* Agency + Location */}
                <View style={styles.cardRow}>
                  <View style={styles.agencyRow}>
                    <View style={styles.agencyAvatar}>
                      <Text style={styles.agencyInitials}>{c.agencyInitials}</Text>
                    </View>
                    <Text style={styles.agencyName}>{c.agency}</Text>
                  </View>
                  {c.location ? <Text style={styles.locationText}>📍 {c.location}</Text> : null}
                </View>

                {/* Meta */}
                <View style={styles.cardMeta}>
                  {c.language ? <Text style={styles.metaChip}>🗣 {c.language}</Text> : null}
                  {c.ageRange ? <Text style={styles.metaChip}>👤 {c.ageRange}</Text> : null}
                  {c.deadline ? <Text style={styles.metaChip}>📅 Apply by {c.deadline}</Text> : null}
                </View>

                {/* Apply button */}
                <TouchableOpacity
                  style={styles.applyCardBtn}
                  onPress={() => router.push(`/casting-calls/${c.id}` as any)}
                >
                  <Text style={styles.applyCardBtnText}>View & Apply</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Footer note */}
        {!loading && (
          <Text style={styles.footerNote}>
            ℹ No more recommendations right now. Check back later for new casting calls that match your profile.
          </Text>
        )}

        {/* Why these recommendations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Why these recommendations?</Text>
          {WHY_REASONS.map((reason, i) => (
            <View key={i} style={styles.reasonRow}>
              <Text style={styles.checkIcon}>✅</Text>
              <Text style={styles.reasonText}>{reason}</Text>
            </View>
          ))}
          <TouchableOpacity
            style={styles.updatePrefBtn}
            onPress={() => router.push('/settings' as any)}
          >
            <Text style={styles.updatePrefText}>Update Preferences</Text>
          </TouchableOpacity>
        </View>

        {/* Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tips to get more matches</Text>
          {TIPS.map((tip, i) => (
            <View key={i} style={styles.reasonRow}>
              <Text style={styles.checkIcon}>✅</Text>
              <Text style={styles.reasonText}>{tip}</Text>
            </View>
          ))}
          <TouchableOpacity
            style={styles.strengthBtn}
            onPress={() => router.push('/my-profile' as any)}
          >
            <View style={styles.strengthBtnLeft}>
              <Text style={styles.strengthBtnLabel}>View Profile Strength</Text>
            </View>
            <Text style={styles.strengthBtnValue}>Excellent ({`${86}%`})</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },

  header: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12,
    borderBottomWidth: 1, borderBottomColor: '#1A1A1A',
  },
  backBtn: { padding: 4, marginTop: 2 },
  backArrow: { fontSize: 22, color: Colors.white },
  pageTitle: { fontFamily: Fonts.heading, fontSize: 22, color: Colors.white, letterSpacing: 2 },
  pageSub: { fontFamily: Fonts.body, fontSize: 13, color: '#666', marginTop: 2 },
  filterToggleBtn: {
    backgroundColor: 'rgba(212,166,74,0.12)',
    borderWidth: 1, borderColor: 'rgba(212,166,74,0.3)',
    borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6, marginTop: 2,
  },
  filterToggleText: { fontFamily: Fonts.bodyMedium, fontSize: 13, color: Colors.gold },

  tabsScroll: { paddingHorizontal: 16, paddingTop: 12, borderBottomWidth: 1, borderBottomColor: '#1A1A1A' },
  tab: { paddingHorizontal: 14, paddingVertical: 10, marginRight: 4, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: Colors.red },
  tabText: { fontFamily: Fonts.bodyMedium, fontSize: 14, color: '#666' },
  tabTextActive: { color: Colors.red, fontWeight: '700' },

  sortBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 10,
  },
  sortBtn: {
    backgroundColor: BG3, borderRadius: 8,
    paddingHorizontal: 14, paddingVertical: 8,
    borderWidth: 1, borderColor: '#1A1A1A',
  },
  sortBtnText: { fontFamily: Fonts.bodyMedium, fontSize: 14, color: Colors.white },
  resetText: { fontFamily: Fonts.bodyMedium, fontSize: 14, color: Colors.gold },

  sortMenu: {
    marginHorizontal: 16, backgroundColor: BG3,
    borderRadius: 8, borderWidth: 1, borderColor: '#2A2A2A',
    marginBottom: 8,
  },
  sortMenuItem: { paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#1A1A1A' },
  sortMenuText: { fontFamily: Fonts.bodyMedium, fontSize: 14, color: Colors.white },

  // Filter panel
  filterPanel: {
    marginHorizontal: 16, marginBottom: 8,
    backgroundColor: BG2, borderRadius: 12, padding: 16,
    borderWidth: 1, borderColor: '#1A1A1A',
  },
  filterTitle: { fontFamily: Fonts.heading, fontSize: 16, color: Colors.white, letterSpacing: 2, marginBottom: 12 },
  filterLabel: { fontFamily: Fonts.bodyMedium, fontSize: 11, color: '#555', letterSpacing: 2, marginBottom: 8, marginTop: 8 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  filterTag: {
    backgroundColor: BG3, borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 6,
    borderWidth: 1, borderColor: '#2A2A2A',
  },
  filterTagActive: { borderColor: Colors.gold, backgroundColor: 'rgba(212,166,74,0.12)' },
  filterTagText: { fontFamily: Fonts.bodyMedium, fontSize: 13, color: '#888' },
  applyBtn: {
    backgroundColor: Colors.gold, borderRadius: 8,
    paddingVertical: 12, alignItems: 'center', marginTop: 12,
  },
  applyBtnText: { fontFamily: Fonts.bodySemiBold, fontSize: 15, color: Colors.background },

  // Cards
  list: { paddingHorizontal: 16, paddingTop: 8 },
  card: {
    backgroundColor: BG2, borderRadius: 12, padding: 14,
    borderWidth: 1, borderColor: '#1A1A1A', marginBottom: 12,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  typeBadge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  typeText: { fontFamily: Fonts.bodyMedium, fontSize: 13 },
  matchBadge: {
    backgroundColor: 'rgba(212,166,74,0.12)',
    borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3,
    borderWidth: 1, borderColor: 'rgba(212,166,74,0.25)',
  },
  matchText: { fontFamily: Fonts.bodyMedium, fontSize: 12, color: Colors.gold },
  cardTitle: { fontFamily: Fonts.bodySemiBold, fontSize: 17, color: Colors.white, marginBottom: 3 },
  cardRole: { fontFamily: Fonts.body, fontSize: 14, color: '#888', marginBottom: 8 },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  agencyRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  agencyAvatar: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: 'rgba(212,166,74,0.2)',
    borderWidth: 1, borderColor: 'rgba(212,166,74,0.4)',
    alignItems: 'center', justifyContent: 'center',
  },
  agencyInitials: { fontFamily: Fonts.bodyMedium, fontSize: 10, color: Colors.gold },
  agencyName: { fontFamily: Fonts.body, fontSize: 13, color: '#888' },
  locationText: { fontFamily: Fonts.body, fontSize: 13, color: '#666' },
  cardMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 },
  metaChip: { fontFamily: Fonts.body, fontSize: 12, color: '#666' },
  applyCardBtn: {
    backgroundColor: Colors.red, borderRadius: 8,
    paddingVertical: 10, alignItems: 'center',
  },
  applyCardBtnText: { fontFamily: Fonts.bodySemiBold, fontSize: 14, color: Colors.white },

  // Empty
  emptyBox: { alignItems: 'center', paddingVertical: 48, paddingHorizontal: 32 },
  emptyEmoji: { fontSize: 40, marginBottom: 12 },
  emptyTitle: { fontFamily: Fonts.bodyMedium, fontSize: 16, color: '#888', marginBottom: 6, textAlign: 'center' },
  emptySub: { fontFamily: Fonts.body, fontSize: 14, color: '#555', textAlign: 'center', marginBottom: 16 },
  resetBtn: {
    borderWidth: 1, borderColor: Colors.gold,
    borderRadius: 8, paddingHorizontal: 24, paddingVertical: 10,
  },
  resetBtnText: { fontFamily: Fonts.bodyMedium, fontSize: 14, color: Colors.gold },

  footerNote: {
    fontFamily: Fonts.body, fontSize: 13, color: '#444',
    textAlign: 'center', marginHorizontal: 16, marginBottom: 8,
  },

  // Sections
  section: {
    marginHorizontal: 16, marginBottom: 12,
    backgroundColor: BG2, borderRadius: 12, padding: 16,
    borderWidth: 1, borderColor: '#1A1A1A',
  },
  sectionTitle: { fontFamily: Fonts.bodySemiBold, fontSize: 16, color: Colors.white, marginBottom: 12 },
  reasonRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  checkIcon: { fontSize: 14 },
  reasonText: { fontFamily: Fonts.body, fontSize: 14, color: 'rgba(255,255,255,0.6)', flex: 1 },
  updatePrefBtn: {
    marginTop: 10, borderWidth: 1, borderColor: '#2A2A2A',
    borderRadius: 8, paddingVertical: 10, alignItems: 'center',
  },
  updatePrefText: { fontFamily: Fonts.bodyMedium, fontSize: 14, color: '#888' },
  strengthBtn: {
    marginTop: 10, flexDirection: 'row', justifyContent: 'space-between',
    backgroundColor: BG3, borderRadius: 8, padding: 12,
    borderWidth: 1, borderColor: '#1A1A1A',
  },
  strengthBtnLeft: {},
  strengthBtnLabel: { fontFamily: Fonts.bodyMedium, fontSize: 14, color: Colors.white },
  strengthBtnValue: { fontFamily: Fonts.bodyMedium, fontSize: 14, color: '#22C55E' },
});