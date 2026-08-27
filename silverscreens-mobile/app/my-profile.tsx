import React, { useState, useEffect } from 'react';
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
import { Colors, Fonts } from '../constants/theme';
import { api } from '../lib/api';
import { getUser, clearAuth } from '../lib/auth';

const BG2 = '#0B0F14';
const BG3 = '#121821';
const GREEN = '#22C55E';

const PROFILE_TABS = ['Overview', 'Media', 'Experience', 'Skills', 'Education', 'Awards', 'Documents'];

export default function MyProfileScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
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
      const savedUser = await getUser();
      if (!savedUser) { router.replace('/login'); return; }
      setUser(savedUser);

      const res = await api.get('/api/profile/aspirant');
      const p = res.data?.data?.profile ?? res.data?.profile ?? res.data;
      setProfile(p);
    } catch (err: any) {
      if (err?.response?.status === 401) { await clearAuth(); router.replace('/login'); }
      else Toast.show({ type: 'error', text1: 'Failed to load profile' });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  if (!fontsLoaded) return null;

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={Colors.gold} size="large" />
      </View>
    );
  }

  const ap = profile?.aspirant_profiles ?? profile?.aspirant_profile ?? {};
  const photos = profile?.aspirant_media?.filter((m: any) => m.media_type === 'photo') ?? [];
  const videos = profile?.aspirant_media?.filter((m: any) => m.media_type === 'video') ?? [];
  const skills = profile?.aspirant_skills ?? [];
  const experience = profile?.aspirant_experience ?? [];
  const education = profile?.aspirant_education ?? [];
  const awards = profile?.aspirant_awards ?? [];
  const documents = profile?.aspirant_documents ?? [];
  const profilePct = ap?.profile_completion ?? user?.aspirant_profile?.profile_completion ?? 0;
  const primaryPhoto = photos.find((m: any) => m.is_primary)?.url ?? photos[0]?.url ?? null;

  const strengthItems = [
    { label: 'Profile Information',     pct: profile ? 100 : 0 },
    { label: 'Media (Photos / Videos)', pct: photos.length > 0 ? 100 : 0 },
    { label: 'Skills & Languages',      pct: skills.length > 0 ? 100 : 0 },
    { label: 'Experience',              pct: experience.length > 0 ? 100 : 0 },
    { label: 'Verification',            pct: ap?.verification_status === 'approved' ? 100 : 0 },
  ];

  const renderOverview = () => (
    <View style={styles.tabContent}>
      {/* About Me */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ABOUT ME</Text>
        <Text style={styles.bodyText}>{ap?.bio ?? profile?.bio ?? 'No bio added yet.'}</Text>
      </View>

      {/* Personal Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitleRed}>PERSONAL INFORMATION</Text>
        {[
          { label: 'Date of Birth', value: ap?.date_of_birth ? new Date(ap.date_of_birth).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : '—' },
          { label: 'Gender',        value: profile?.gender ?? '—' },
          { label: 'Mobile',        value: profile?.phone ?? '—' },
          { label: 'Email',         value: profile?.email ?? '—' },
          { label: 'Nationality',   value: ap?.nationality ?? '—' },
          { label: 'Languages',     value: Array.isArray(ap?.languages) ? ap.languages.join(', ') : ap?.languages ?? '—' },
        ].map(({ label, value }) => (
          <View key={label} style={styles.infoRow}>
            <Text style={styles.infoLabel}>{label}</Text>
            <Text style={styles.infoValue}>{value}</Text>
          </View>
        ))}
      </View>

      {/* Physical Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitleRed}>PHYSICAL DETAILS</Text>
        {[
          { label: 'Height',     value: ap?.height ?? '—' },
          { label: 'Weight',     value: ap?.weight ? `${ap.weight} kg` : '—' },
          { label: 'Body Type',  value: ap?.body_type ?? '—' },
          { label: 'Complexion', value: ap?.complexion ?? '—' },
          { label: 'Eye Color',  value: ap?.eye_color ?? '—' },
          { label: 'Hair Color', value: ap?.hair_color ?? '—' },
        ].map(({ label, value }) => (
          <View key={label} style={styles.infoRow}>
            <Text style={styles.infoLabel}>{label}</Text>
            <Text style={styles.infoValue}>{value}</Text>
          </View>
        ))}
      </View>

      {/* Measurements */}
      <View style={styles.section}>
        <Text style={styles.sectionTitleRed}>MEASUREMENTS</Text>
        <View style={styles.measureGrid}>
          {[
            { label: 'Chest',     value: ap?.chest ?? '—' },
            { label: 'Waist',     value: ap?.waist ?? '—' },
            { label: 'Hip',       value: ap?.hip ?? '—' },
            { label: 'Shoe Size', value: ap?.shoe_size ?? '—' },
          ].map(({ label, value }) => (
            <View key={label} style={styles.measureCard}>
              <Text style={styles.measureLabel}>{label}</Text>
              <Text style={styles.measureValue}>{value}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Available For */}
      {ap?.available_for && (
        <View style={styles.section}>
          <Text style={styles.sectionTitleRed}>AVAILABLE FOR</Text>
          <View style={styles.tagsRow}>
            {(Array.isArray(ap.available_for) ? ap.available_for : [ap.available_for]).map((item: string) => (
              <View key={item} style={styles.tagRed}>
                <Text style={styles.tagRedText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Departments */}
      {ap?.departments && (
        <View style={styles.section}>
          <Text style={styles.sectionTitleRed}>DEPARTMENTS & ROLES</Text>
          {(Array.isArray(ap.departments) ? ap.departments : []).map((d: any, i: number) => (
            <View key={i} style={styles.deptRow}>
              <Text style={styles.deptName}>{d.dept ?? d.department}</Text>
              <View style={styles.tagsRow}>
                {(d.roles ?? []).map((r: string) => (
                  <View key={r} style={styles.tagRed}>
                    <Text style={styles.tagRedText}>{r}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Profile Strength */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>PROFILE STRENGTH</Text>
        <View style={styles.strengthCircleRow}>
          <View style={styles.strengthCircle}>
            <Text style={styles.strengthPct}>{profilePct}%</Text>
          </View>
          <View style={styles.strengthItems}>
            {strengthItems.map(item => (
              <View key={item.label} style={styles.strengthItem}>
                <View style={[styles.strengthDot, { backgroundColor: item.pct === 100 ? GREEN : '#555' }]} />
                <Text style={styles.strengthLabel}>{item.label}</Text>
                <Text style={[styles.strengthPctText, { color: item.pct === 100 ? GREEN : '#555' }]}>
                  {item.pct}%
                </Text>
              </View>
            ))}
          </View>
        </View>
        <TouchableOpacity style={styles.improveBtn} onPress={() => router.push('/edit-profile' as any)}>
          <Text style={styles.improveBtnText}>↗ Improve Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderMedia = () => (
    <View style={styles.tabContent}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>PHOTOS ({photos.length})</Text>
        {photos.length === 0 ? (
          <Text style={styles.emptyText}>No photos added yet.</Text>
        ) : (
          <View style={styles.photoGrid}>
            {photos.map((photo: any, i: number) => (
              <View key={i} style={styles.photoItem}>
                <Image source={{ uri: photo.url }} style={styles.photo} />
                {photo.is_primary && (
                  <View style={styles.primaryBadge}>
                    <Text style={styles.primaryBadgeText}>⭐ Primary</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>VIDEOS ({videos.length})</Text>
        {videos.length === 0 ? (
          <Text style={styles.emptyText}>No videos added yet.</Text>
        ) : (
          videos.map((v: any, i: number) => (
            <View key={i} style={styles.videoItem}>
              <Text style={styles.videoName}>▶ {v.title ?? `Video ${i + 1}`}</Text>
            </View>
          ))
        )}
      </View>
    </View>
  );

  const renderExperience = () => (
    <View style={styles.tabContent}>
      {experience.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyEmoji}>🎬</Text>
          <Text style={styles.emptyTitle}>No Experience Added</Text>
          <Text style={styles.emptySubText}>Add your film, TV, or theatre experience.</Text>
        </View>
      ) : experience.map((exp: any, i: number) => (
        <View key={i} style={styles.section}>
          <Text style={styles.expTitle}>{exp.title ?? exp.role}</Text>
          <Text style={styles.expMeta}>{exp.production ?? exp.project} • {exp.year}</Text>
          {exp.description && <Text style={styles.bodyText}>{exp.description}</Text>}
        </View>
      ))}
    </View>
  );

  const renderSkills = () => (
    <View style={styles.tabContent}>
      {skills.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyEmoji}>🎭</Text>
          <Text style={styles.emptyTitle}>No Skills Added</Text>
          <Text style={styles.emptySubText}>Add your acting, dancing, or other skills.</Text>
        </View>
      ) : (
        <View style={styles.section}>
          <View style={styles.tagsRow}>
            {skills.map((s: any, i: number) => (
              <View key={i} style={styles.tagGold}>
                <Text style={styles.tagGoldText}>{s.skill ?? s.name}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );

  const renderEducation = () => (
    <View style={styles.tabContent}>
      {education.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyEmoji}>🎓</Text>
          <Text style={styles.emptyTitle}>No Education Added</Text>
        </View>
      ) : education.map((edu: any, i: number) => (
        <View key={i} style={styles.section}>
          <Text style={styles.expTitle}>{edu.degree ?? edu.course}</Text>
          <Text style={styles.expMeta}>{edu.institution} • {edu.year}</Text>
        </View>
      ))}
    </View>
  );

  const renderAwards = () => (
    <View style={styles.tabContent}>
      {awards.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyEmoji}>🏆</Text>
          <Text style={styles.emptyTitle}>No Awards Added</Text>
        </View>
      ) : awards.map((a: any, i: number) => (
        <View key={i} style={styles.section}>
          <Text style={styles.expTitle}>{a.title ?? a.award}</Text>
          <Text style={styles.expMeta}>{a.organization} • {a.year}</Text>
        </View>
      ))}
    </View>
  );

  const renderDocuments = () => (
    <View style={styles.tabContent}>
      {documents.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyEmoji}>📁</Text>
          <Text style={styles.emptyTitle}>No Documents Added</Text>
        </View>
      ) : documents.map((d: any, i: number) => (
        <View key={i} style={styles.section}>
          <Text style={styles.expTitle}>📄 {d.name ?? d.document_type}</Text>
          <Text style={styles.expMeta}>{d.uploaded_at ? new Date(d.uploaded_at).toLocaleDateString() : ''}</Text>
        </View>
      ))}
    </View>
  );

  const tabContent = [
    renderOverview, renderMedia, renderExperience,
    renderSkills, renderEducation, renderAwards, renderDocuments,
  ];

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.pageTitle}>MY PROFILE</Text>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => router.push('/edit-profile' as any)}
        >
          <Text style={styles.editBtnText}>✏ Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadData(); }} tintColor={Colors.gold} />}
      >
        {/* Profile Hero */}
        <View style={styles.hero}>
          <View style={styles.heroLeft}>
            {primaryPhoto ? (
              <Image source={{ uri: primaryPhoto }} style={styles.heroPhoto} />
            ) : (
              <View style={styles.heroPhotoPlaceholder}>
                <Text style={styles.heroPhotoInitial}>
                  {user?.name?.charAt(0)?.toUpperCase() ?? 'A'}
                </Text>
              </View>
            )}
            <View style={styles.primaryTag}>
              <Text style={styles.primaryTagText}>Primary</Text>
            </View>
          </View>

          <View style={styles.heroRight}>
            <View style={styles.heroNameRow}>
              <Text style={styles.heroName}>{user?.name?.toUpperCase() ?? 'ASPIRANT'}</Text>
              {ap?.verification_status === 'approved' && (
                <Text style={styles.verifiedDot}>🟢</Text>
              )}
            </View>

            {ap?.departments?.[0] && (
              <View style={styles.deptBadge}>
                <Text style={styles.deptBadgeText}>
                  {ap.departments[0].dept ?? ap.departments[0].department}
                </Text>
              </View>
            )}

            <Text style={styles.heroRole}>{ap?.role_type ?? ap?.primary_role ?? ''}</Text>

            <View style={styles.heroMeta}>
              {ap?.experience_years && <Text style={styles.heroMetaItem}>🎂 {ap.experience_years} Years</Text>}
              {ap?.height && <Text style={styles.heroMetaItem}>📏 {ap.height}</Text>}
              {ap?.city && <Text style={styles.heroMetaItem}>📍 {ap.city}</Text>}
            </View>

            <View style={styles.heroBadges}>
              {ap?.availability_status === 'available' && (
                <View style={styles.availableBadge}>
                  <Text style={styles.availableBadgeText}>● Available for Work</Text>
                </View>
              )}
            </View>

            {/* Action buttons */}
            <View style={styles.heroActions}>
              <TouchableOpacity
                style={styles.editProfileBtn}
                onPress={() => router.push('/edit-profile' as any)}
              >
                <Text style={styles.editProfileBtnText}>✏ Edit Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applicationsBtn}
                onPress={() => router.push('/(tabs)/applications')}
              >
                <Text style={styles.applicationsBtnText}>📄 Applications</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Profile ID */}
        <View style={styles.idBar}>
          <Text style={styles.idLabel}>ASPIRANT ID</Text>
          <Text style={styles.idValue}>{user?.profile_number ?? '—'}</Text>
        </View>

        {/* Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll}>
          {PROFILE_TABS.map((tab, i) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === i && styles.tabActive]}
              onPress={() => setActiveTab(i)}
            >
              <Text style={[styles.tabText, activeTab === i && styles.tabTextActive]}>
                {tab}
                {tab === 'Media' && photos.length > 0 ? ` (${photos.length})` : ''}
                {tab === 'Experience' && experience.length > 0 ? ` (${experience.length})` : ''}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Tab Content */}
        {tabContent[activeTab]?.()}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  centered: { flex: 1, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center' },

  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12,
    borderBottomWidth: 1, borderBottomColor: '#1A1A1A',
  },
  backBtn: { padding: 4, marginRight: 10 },
  backArrow: { fontSize: 22, color: Colors.white },
  pageTitle: { fontFamily: Fonts.heading, fontSize: 24, color: Colors.white, letterSpacing: 3, flex: 1 },
  editBtn: {
    backgroundColor: 'rgba(212,166,74,0.15)',
    borderWidth: 1, borderColor: Colors.gold,
    borderRadius: 8, paddingHorizontal: 14, paddingVertical: 7,
  },
  editBtnText: { fontFamily: Fonts.bodyMedium, fontSize: 14, color: Colors.gold },

  // Hero
  hero: {
    flexDirection: 'row', padding: 16, gap: 16,
    borderBottomWidth: 1, borderBottomColor: '#1A1A1A',
  },
  heroLeft: { position: 'relative' },
  heroPhoto: { width: 110, height: 140, borderRadius: 8, backgroundColor: '#222' },
  heroPhotoPlaceholder: {
    width: 110, height: 140, borderRadius: 8,
    backgroundColor: Colors.red,
    alignItems: 'center', justifyContent: 'center',
  },
  heroPhotoInitial: { fontFamily: Fonts.heading, fontSize: 48, color: Colors.white },
  primaryTag: {
    position: 'absolute', top: 6, left: 6,
    backgroundColor: Colors.red, borderRadius: 4,
    paddingHorizontal: 6, paddingVertical: 2,
  },
  primaryTagText: { fontFamily: Fonts.bodyMedium, fontSize: 10, color: Colors.white },

  heroRight: { flex: 1 },
  heroNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  heroName: { fontFamily: Fonts.heading, fontSize: 22, color: Colors.white, letterSpacing: 2, flex: 1 },
  verifiedDot: { fontSize: 14 },

  deptBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.red,
    borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3, marginBottom: 4,
  },
  deptBadgeText: { fontFamily: Fonts.bodyMedium, fontSize: 12, color: Colors.white },
  heroRole: { fontFamily: Fonts.body, fontSize: 14, color: '#888', marginBottom: 8 },

  heroMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  heroMetaItem: { fontFamily: Fonts.body, fontSize: 13, color: '#aaa' },

  heroBadges: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  availableBadge: {
    backgroundColor: 'rgba(34,197,94,0.15)',
    borderWidth: 1, borderColor: 'rgba(34,197,94,0.3)',
    borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4,
  },
  availableBadgeText: { fontFamily: Fonts.body, fontSize: 12, color: GREEN },

  heroActions: { flexDirection: 'row', gap: 8 },
  editProfileBtn: {
    backgroundColor: Colors.red, borderRadius: 6,
    paddingHorizontal: 12, paddingVertical: 8,
  },
  editProfileBtnText: { fontFamily: Fonts.bodyMedium, fontSize: 13, color: Colors.white },
  applicationsBtn: {
    backgroundColor: BG3, borderRadius: 6,
    borderWidth: 1, borderColor: '#2A2A2A',
    paddingHorizontal: 12, paddingVertical: 8,
  },
  applicationsBtnText: { fontFamily: Fonts.bodyMedium, fontSize: 13, color: Colors.white },

  // ID bar
  idBar: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: '#1A1A1A',
    backgroundColor: BG2,
  },
  idLabel: { fontFamily: Fonts.bodyMedium, fontSize: 12, color: '#555', letterSpacing: 2 },
  idValue: { fontFamily: Fonts.bodyMedium, fontSize: 13, color: Colors.gold },

  // Tabs
  tabsScroll: { borderBottomWidth: 1, borderBottomColor: '#1A1A1A', paddingLeft: 16 },
  tab: {
    paddingHorizontal: 14, paddingVertical: 12,
    marginRight: 4, borderBottomWidth: 2, borderBottomColor: 'transparent',
  },
  tabActive: { borderBottomColor: Colors.red },
  tabText: { fontFamily: Fonts.bodyMedium, fontSize: 14, color: '#666' },
  tabTextActive: { color: Colors.red, fontWeight: '700' },

  // Tab content
  tabContent: { paddingBottom: 32 },
  section: {
    marginHorizontal: 16, marginTop: 16,
    backgroundColor: BG2, borderRadius: 12,
    padding: 16, borderWidth: 1, borderColor: '#1A1A1A',
  },
  sectionTitle: { fontFamily: Fonts.heading, fontSize: 18, color: Colors.white, letterSpacing: 2, marginBottom: 12 },
  sectionTitleRed: { fontFamily: Fonts.heading, fontSize: 16, color: Colors.red, letterSpacing: 2, marginBottom: 12 },

  bodyText: { fontFamily: Fonts.body, fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 22 },

  infoRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#1A1A1A',
  },
  infoLabel: { fontFamily: Fonts.body, fontSize: 14, color: '#666' },
  infoValue: { fontFamily: Fonts.bodyMedium, fontSize: 14, color: Colors.white, flex: 1, textAlign: 'right' },

  measureGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  measureCard: {
    flex: 1, minWidth: '45%', backgroundColor: BG3,
    borderRadius: 8, padding: 12, borderWidth: 1, borderColor: '#1A1A1A',
  },
  measureLabel: { fontFamily: Fonts.body, fontSize: 12, color: '#555', marginBottom: 4 },
  measureValue: { fontFamily: Fonts.heading, fontSize: 20, color: Colors.white },

  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tagRed: {
    backgroundColor: 'rgba(200,32,42,0.15)',
    borderWidth: 1, borderColor: 'rgba(200,32,42,0.3)',
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5,
  },
  tagRedText: { fontFamily: Fonts.bodyMedium, fontSize: 13, color: Colors.red },
  tagGold: {
    backgroundColor: 'rgba(212,166,74,0.15)',
    borderWidth: 1, borderColor: 'rgba(212,166,74,0.3)',
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5,
  },
  tagGoldText: { fontFamily: Fonts.bodyMedium, fontSize: 13, color: Colors.gold },

  deptRow: { marginBottom: 10 },
  deptName: { fontFamily: Fonts.bodyMedium, fontSize: 15, color: Colors.white, marginBottom: 6 },

  // Strength
  strengthCircleRow: { flexDirection: 'row', gap: 16, alignItems: 'center', marginBottom: 12 },
  strengthCircle: {
    width: 70, height: 70, borderRadius: 35,
    borderWidth: 6, borderColor: Colors.red,
    alignItems: 'center', justifyContent: 'center',
  },
  strengthPct: { fontFamily: Fonts.heading, fontSize: 18, color: Colors.red },
  strengthItems: { flex: 1, gap: 6 },
  strengthItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  strengthDot: { width: 8, height: 8, borderRadius: 4 },
  strengthLabel: { fontFamily: Fonts.body, fontSize: 13, color: 'rgba(255,255,255,0.6)', flex: 1 },
  strengthPctText: { fontFamily: Fonts.bodyMedium, fontSize: 13 },
  improveBtn: {
    borderWidth: 1, borderColor: '#2A2A2A',
    borderRadius: 8, paddingVertical: 10, alignItems: 'center',
  },
  improveBtnText: { fontFamily: Fonts.bodyMedium, fontSize: 14, color: '#888' },

  // Media
  photoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  photoItem: { position: 'relative', width: '31%' },
  photo: { width: '100%', aspectRatio: 0.75, borderRadius: 8, backgroundColor: '#222' },
  primaryBadge: {
    position: 'absolute', bottom: 6, left: 4,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 4, paddingHorizontal: 4, paddingVertical: 2,
  },
  primaryBadgeText: { fontFamily: Fonts.body, fontSize: 10, color: Colors.gold },
  videoItem: {
    backgroundColor: BG3, borderRadius: 8, padding: 12,
    borderWidth: 1, borderColor: '#1A1A1A', marginBottom: 8,
  },
  videoName: { fontFamily: Fonts.bodyMedium, fontSize: 14, color: Colors.white },

  // Experience/Skills/etc
  expTitle: { fontFamily: Fonts.bodyMedium, fontSize: 16, color: Colors.white, marginBottom: 4 },
  expMeta: { fontFamily: Fonts.body, fontSize: 14, color: Colors.gold },

  emptyBox: { alignItems: 'center', paddingVertical: 48 },
  emptyEmoji: { fontSize: 36, marginBottom: 10 },
  emptyTitle: { fontFamily: Fonts.bodyMedium, fontSize: 16, color: '#888', marginBottom: 4 },
  emptySubText: { fontFamily: Fonts.body, fontSize: 14, color: '#555', textAlign: 'center' },
  emptyText: { fontFamily: Fonts.body, fontSize: 14, color: '#555', textAlign: 'center', paddingVertical: 20 },
});