import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  ActivityIndicator, RefreshControl, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useFonts, BebasNeue_400Regular } from '@expo-google-fonts/bebas-neue';
import {
  BarlowCondensed_400Regular,
  BarlowCondensed_500Medium,
  BarlowCondensed_600SemiBold,
} from '@expo-google-fonts/barlow-condensed';
import { Colors, Fonts } from '../../constants/theme';
import { api } from '../../lib/api';
import { getUser, clearAuth } from '../../lib/auth';

const { width } = Dimensions.get('window');
const RED = '#C8202A';
const GOLD = '#D4A64A';
const BG = '#080808';
const CARD = '#111113';
const CARD2 = '#0D0D0F';

const STAT_CARDS = (stats: any, profilePct: number) => [
  { label: 'APPLICATIONS', sub: 'Total Applied',    value: stats?.applications ?? 0, icon: '🎬', highlight: false },
  { label: 'SHORTLISTED',  sub: 'By Agencies',      value: stats?.shortlisted  ?? 0, icon: '🔖', highlight: false },
  { label: 'AUDITIONS',    sub: 'This Month',        value: stats?.auditions    ?? 0, icon: '📅', highlight: false },
  { label: 'OFFERS',       sub: 'Received',          value: stats?.offers       ?? 0, icon: '📨', highlight: false },
  { label: 'PROFILE STR.', sub: 'Excellent',         value: `${profilePct}%`,         icon: '📊', highlight: true  },
  { label: 'TOTAL EARNS',  sub: '+12% vs last month',value: '₹0',                     icon: '💰', highlight: true  },
];

const QUICK_ACTIONS = [
  { label: 'Update Availability', icon: '🕐', route: '/settings'    },
  { label: 'Upload Media',        icon: '📤', route: '/edit-profile' },
  { label: 'Add New Skill',       icon: '➕', route: '/settings'    },
  { label: 'View My Profile',     icon: '👁', route: '/my-profile'  },
  { label: 'Manage Documents',    icon: '📁', route: '/settings'    },
];

export default function DashboardScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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
      try {
        const res = await api.get('/api/aspirant/dashboard');
        setStats(res.data?.data ?? res.data);
      } catch {}
    } catch (err: any) {
      if (err?.response?.status === 401) { await clearAuth(); router.replace('/login'); }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => { setRefreshing(true); loadData(); };

  if (!fontsLoaded || loading) {
    return <View style={styles.centered}><ActivityIndicator color={GOLD} size="large" /></View>;
  }

  const profilePct = stats?.profile_completion ?? user?.aspirant_profile?.profile_completion ?? 86;
  const firstName = user?.name?.split(' ')[0] ?? 'Aspirant';
  const initial = user?.name?.charAt(0)?.toUpperCase() ?? 'V';

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
          <Text style={styles.headerBrand}>
            <Text style={styles.brandWhite}>SILVER </Text>
            <Text style={styles.brandRed}>SCREENS</Text>
          </Text>
          <Text style={styles.headerSub}>— ASPIRANT —</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.bellWrap}>
            <Text style={styles.bellIcon}>🔔</Text>
            <View style={styles.bellDot} />
          </View>
          <TouchableOpacity onPress={() => router.push('/my-profile' as any)}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initial}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={GOLD} />}
      >
        {/* Welcome */}
        <View style={styles.welcomeSection}>
          <View style={styles.welcomeLeft}>
            <Text style={styles.welcomeSmall}>WELCOME BACK,</Text>
            <Text style={styles.welcomeName}>{firstName.toUpperCase()} 👋</Text>
            <Text style={styles.welcomeSub}>Here's what's happening with your career today.</Text>
          </View>
          <TouchableOpacity style={styles.starCard}>
            <Text style={styles.starIcon}>⭐</Text>
            <View>
              <Text style={styles.starTitle}>Silver Star</Text>
              <Text style={styles.starPoints}>120 Points</Text>
            </View>
            <Text style={styles.starChevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Stats horizontal scroll */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsScroll} contentContainerStyle={{ paddingLeft: 16, paddingRight: 8 }}>
          {STAT_CARDS(stats, profilePct).map((card, i) => (
            <View key={i} style={styles.statCard}>
              <Text style={styles.statIcon}>{card.icon}</Text>
              <Text style={styles.statLabel}>{card.label}</Text>
              <Text style={[styles.statValue, card.highlight && { color: GOLD }]}>{card.value}</Text>
              <Text style={[styles.statSub, card.highlight && { color: GOLD }]}>{card.sub}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Recommended Casting Calls */}
        <View style={styles.sectionPad}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>RECOMMENDED CASTING CALLS</Text>
            <TouchableOpacity onPress={() => router.push('/recommended' as any)}>
              <Text style={styles.viewAll}>VIEW ALL ›</Text>
            </TouchableOpacity>
          </View>
          {/* Casting card */}
          <View style={styles.castingCard}>
            <View style={styles.castingCardInner}>
              {/* Left image */}
              <View style={styles.castingImg}>
                <Text style={styles.castingImgEmoji}>🎭</Text>
                <View style={styles.featuredBadge}>
                  <Text style={styles.featuredText}>FEATURED</Text>
                </View>
                <TouchableOpacity style={styles.heartBtn}>
                  <Text style={styles.heartIcon}>🤍</Text>
                </TouchableOpacity>
              </View>
              {/* Right content */}
              <View style={styles.castingContent}>
                <Text style={styles.castingTitle}>LEAD ACTOR – WEB SERIES</Text>
                <View style={styles.castingTags}>
                  <Text style={styles.castingTag}>Hindi</Text>
                  <Text style={styles.castingTag}>18–30 yrs</Text>
                  <Text style={styles.castingTag}>📍 Mumbai</Text>
                </View>
                <Text style={styles.castingDeadline}>Apply by 25 May 2025</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.applyBtn}>
              <Text style={styles.applyBtnText}>APPLY NOW</Text>
            </TouchableOpacity>
          </View>
          {/* Dots */}
          <View style={styles.dotsRow}>
            <View style={[styles.dot, { backgroundColor: RED }]} />
            <View style={styles.dot} /><View style={styles.dot} /><View style={styles.dot} />
          </View>
        </View>

        {/* Upcoming */}
        <View style={styles.sectionPad}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>UPCOMING</Text>
            <TouchableOpacity onPress={() => router.push('/calendar' as any)}>
              <Text style={styles.viewAll}>VIEW CALENDAR ›</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.upcomingCard}>
            <View style={styles.upcomingImg}>
              <Text style={{ fontSize: 32, opacity: 0.5 }}>🎬</Text>
            </View>
            <View style={styles.upcomingContent}>
              <Text style={styles.upcomingTitle}>No upcoming auditions</Text>
              <Text style={styles.upcomingSub}>Apply to casting calls to get invited for auditions.</Text>
              <TouchableOpacity>
                <Text style={styles.browseLink}>BROWSE CASTING CALLS</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Messages */}
        <View style={styles.sectionPad}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>MESSAGES</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/messages')}>
              <Text style={styles.viewAll}>VIEW ALL ›</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.messagesCard} onPress={() => router.push('/(tabs)/messages')}>
            <View style={styles.msgIconBox}>
              <Text style={{ fontSize: 22 }}>💬</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.msgTitle}>No messages yet</Text>
              <Text style={styles.msgSub}>You'll see messages from agencies here.</Text>
            </View>
            <Text style={styles.msgChevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Completion */}
        <View style={styles.sectionPad}>
          <Text style={styles.sectionLabel}>PROFILE COMPLETION</Text>
          <View style={styles.profileCompCard}>
            <View style={styles.profileCompLeft}>
              {/* Circle */}
              <View style={styles.circleWrap}>
                <Text style={styles.circleText}>{profilePct}%</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.profileCompTitle}>Profile looks great!</Text>
                <Text style={styles.profileCompSub}>You're all set to get noticed by top agencies.</Text>
                <TouchableOpacity style={styles.improveBtn} onPress={() => router.push('/edit-profile' as any)}>
                  <Text style={styles.improveBtnText}>↗ Improve Profile</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.trophyIcon}>⭐</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.sectionPad}>
          <Text style={styles.sectionLabel}>QUICK ACTIONS</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 4 }}>
            {QUICK_ACTIONS.map((action, i) => (
              <TouchableOpacity
                key={i}
                style={styles.quickCard}
                onPress={() => router.push(action.route as any)}
                activeOpacity={0.75}
              >
                <Text style={styles.quickIcon}>{action.icon}</Text>
                <Text style={styles.quickLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },
  centered: { flex: 1, backgroundColor: BG, alignItems: 'center', justifyContent: 'center' },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: '#151515',
  },
  hamburger: { gap: 4, padding: 4 },
  hLine: { width: 22, height: 2, backgroundColor: '#666', borderRadius: 1 },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerBrand: { fontSize: 20 },
  brandWhite: { fontFamily: 'BebasNeue_400Regular', color: '#fff', letterSpacing: 2 },
  brandRed: { fontFamily: 'BebasNeue_400Regular', color: RED, letterSpacing: 2 },
  headerSub: { fontFamily: 'BarlowCondensed_400Regular', fontSize: 9, color: GOLD, letterSpacing: 4, marginTop: 1 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  bellWrap: { position: 'relative' },
  bellIcon: { fontSize: 22 },
  bellDot: { position: 'absolute', top: -2, right: -2, width: 8, height: 8, borderRadius: 4, backgroundColor: RED, borderWidth: 1.5, borderColor: BG },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#333', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: GOLD },
  avatarText: { fontFamily: 'BebasNeue_400Regular', fontSize: 18, color: '#fff' },

  // Welcome
  welcomeSection: { flexDirection: 'row', alignItems: 'flex-start', padding: 16, gap: 12 },
  welcomeLeft: { flex: 1 },
  welcomeSmall: { fontFamily: 'BarlowCondensed_400Regular', fontSize: 13, color: '#888', letterSpacing: 1 },
  welcomeName: { fontFamily: 'BebasNeue_400Regular', fontSize: 40, color: '#fff', letterSpacing: 2, lineHeight: 42 },
  welcomeSub: { fontFamily: 'BarlowCondensed_400Regular', fontSize: 13, color: '#666', marginTop: 4, lineHeight: 18 },
  starCard: {
    backgroundColor: CARD, borderWidth: 1, borderColor: GOLD,
    borderRadius: 10, padding: 10, flexDirection: 'row',
    alignItems: 'center', gap: 8, minWidth: 130,
  },
  starIcon: { fontSize: 20 },
  starTitle: { fontFamily: 'BarlowCondensed_600SemiBold', fontSize: 14, color: GOLD },
  starPoints: { fontFamily: 'BarlowCondensed_400Regular', fontSize: 12, color: '#888' },
  starChevron: { fontSize: 18, color: GOLD, marginLeft: 4 },

  // Stats
  statsScroll: { marginBottom: 8 },
  statCard: {
    width: 110, backgroundColor: CARD, borderRadius: 12, padding: 14,
    marginRight: 8, borderWidth: 1, borderColor: '#1A1A1A',
  },
  statIcon: { fontSize: 22, marginBottom: 8 },
  statLabel: { fontFamily: 'BarlowCondensed_500Medium', fontSize: 10, color: '#666', letterSpacing: 1, marginBottom: 6 },
  statValue: { fontFamily: 'BebasNeue_400Regular', fontSize: 28, color: '#fff', lineHeight: 30 },
  statSub: { fontFamily: 'BarlowCondensed_400Regular', fontSize: 11, color: '#555', marginTop: 4 },

  // Sections
  sectionPad: { paddingHorizontal: 16, marginBottom: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionLabel: { fontFamily: 'BarlowCondensed_600SemiBold', fontSize: 13, color: '#888', letterSpacing: 2 },
  viewAll: { fontFamily: 'BarlowCondensed_600SemiBold', fontSize: 13, color: GOLD },

  // Casting card
  castingCard: { backgroundColor: CARD, borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#1A1A1A' },
  castingCardInner: { flexDirection: 'row', height: 130 },
  castingImg: {
    width: 130, backgroundColor: '#1A0A00',
    alignItems: 'center', justifyContent: 'center', position: 'relative',
  },
  castingImgEmoji: { fontSize: 40, opacity: 0.6 },
  featuredBadge: { position: 'absolute', top: 8, left: 8, backgroundColor: RED, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  featuredText: { fontFamily: 'BarlowCondensed_700SemiBold', fontSize: 9, color: '#fff', letterSpacing: 1 },
  heartBtn: { position: 'absolute', top: 8, right: 8 },
  heartIcon: { fontSize: 18 },
  castingContent: { flex: 1, padding: 12, justifyContent: 'center', gap: 6 },
  castingTitle: { fontFamily: 'BebasNeue_400Regular', fontSize: 17, color: '#fff', letterSpacing: 1, lineHeight: 19 },
  castingTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  castingTag: { fontFamily: 'BarlowCondensed_400Regular', fontSize: 11, color: '#888', backgroundColor: '#1A1A1A', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  castingDeadline: { fontFamily: 'BarlowCondensed_500Medium', fontSize: 12, color: RED },
  applyBtn: { borderTopWidth: 1, borderColor: '#1A1A1A', paddingVertical: 12, alignItems: 'center' },
  applyBtnText: { fontFamily: 'BebasNeue_400Regular', fontSize: 16, color: GOLD, letterSpacing: 3 },
  dotsRow: { flexDirection: 'row', gap: 6, justifyContent: 'center', marginTop: 10 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#333' },

  // Upcoming
  upcomingCard: { backgroundColor: CARD, borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#1A1A1A', flexDirection: 'row', height: 100 },
  upcomingImg: { width: 100, backgroundColor: '#0A0A1A', alignItems: 'center', justifyContent: 'center' },
  upcomingContent: { flex: 1, padding: 14, justifyContent: 'center', gap: 4 },
  upcomingTitle: { fontFamily: 'BarlowCondensed_600SemiBold', fontSize: 15, color: '#fff' },
  upcomingSub: { fontFamily: 'BarlowCondensed_400Regular', fontSize: 12, color: '#666', lineHeight: 16 },
  browseLink: { fontFamily: 'BarlowCondensed_600SemiBold', fontSize: 12, color: GOLD, marginTop: 4, letterSpacing: 1 },

  // Messages
  messagesCard: {
    backgroundColor: CARD, borderRadius: 12, padding: 14,
    borderWidth: 1, borderColor: '#1A1A1A',
    flexDirection: 'row', alignItems: 'center', gap: 14,
  },
  msgIconBox: {
    width: 44, height: 44, borderRadius: 10,
    backgroundColor: '#1A0808', borderWidth: 1, borderColor: '#2A1010',
    alignItems: 'center', justifyContent: 'center',
  },
  msgTitle: { fontFamily: 'BarlowCondensed_600SemiBold', fontSize: 15, color: '#fff', marginBottom: 2 },
  msgSub: { fontFamily: 'BarlowCondensed_400Regular', fontSize: 13, color: '#666' },
  msgChevron: { fontSize: 22, color: '#444' },

  // Profile completion
  profileCompCard: {
    backgroundColor: CARD, borderRadius: 12, padding: 16,
    borderWidth: 1, borderColor: '#1A1A1A',
    flexDirection: 'row', alignItems: 'center', gap: 14,
  },
  profileCompLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 14 },
  circleWrap: {
    width: 70, height: 70, borderRadius: 35,
    borderWidth: 4, borderColor: RED,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  circleText: { fontFamily: 'BebasNeue_400Regular', fontSize: 18, color: '#fff' },
  profileCompTitle: { fontFamily: 'BarlowCondensed_600SemiBold', fontSize: 15, color: '#fff', marginBottom: 3 },
  profileCompSub: { fontFamily: 'BarlowCondensed_400Regular', fontSize: 12, color: '#666', lineHeight: 16, marginBottom: 8 },
  improveBtn: {
    borderWidth: 1, borderColor: RED, borderRadius: 6,
    paddingHorizontal: 10, paddingVertical: 5, alignSelf: 'flex-start',
  },
  improveBtnText: { fontFamily: 'BarlowCondensed_500Medium', fontSize: 12, color: RED },
  trophyIcon: { fontSize: 36 },

  // Quick Actions
  quickCard: {
    backgroundColor: CARD, borderRadius: 12, padding: 14,
    marginRight: 8, alignItems: 'center', gap: 8,
    borderWidth: 1, borderColor: '#1A1A1A', minWidth: 85,
  },
  quickIcon: { fontSize: 22 },
  quickLabel: { fontFamily: 'BarlowCondensed_400Regular', fontSize: 11, color: '#888', textAlign: 'center', lineHeight: 14 },
});