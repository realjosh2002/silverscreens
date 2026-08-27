import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Alert,
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
import { clearAuth, getUser } from '../../lib/auth';

const MENU_SECTIONS = [
  {
    title: 'ACCOUNT',
    items: [
      { label: 'My Profile',     emoji: '👤', route: '/my-profile'       },
      { label: 'Subscription',   emoji: '👑', route: '/subscription'     },
      { label: 'Analytics',      emoji: '📊', route: '/analytics'        },
    ],
  },
  {
    title: 'LIBRARY',
    items: [
      { label: 'Saved Castings', emoji: '🔖', route: '/saved-castings'   },
      { label: 'Notifications',  emoji: '🔔', route: '/notifications'    },
    ],
  },
  {
    title: 'TOOLS',
    items: [
      { label: 'Calendar',       emoji: '📅', route: '/calendar'         },
      { label: 'Settings',       emoji: '⚙️',  route: '/settings'        },
      { label: 'Help & Support', emoji: '🎧', route: '/support'          },
    ],
  },
];

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = React.useState<any>(null);

  const [fontsLoaded] = useFonts({
    BebasNeue_400Regular,
    BarlowCondensed_400Regular,
    BarlowCondensed_500Medium,
    BarlowCondensed_600SemiBold,
  });

  React.useEffect(() => {
    getUser().then(setUser);
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            await clearAuth();
            Toast.show({ type: 'success', text1: 'Logged out successfully' });
            router.replace('/login');
          },
        },
      ]
    );
  };

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.pageTitle}>PROFILE</Text>
        </View>

        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0)?.toUpperCase() || 'A'}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name || 'Aspirant'}</Text>
            <Text style={styles.userId}>
              {user?.profile_number || 'ASP000000'}
            </Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleBadgeText}>ASPIRANT</Text>
            </View>
          </View>
        </View>

        {/* Aspirant ID card */}
        <View style={styles.idCard}>
          <Text style={styles.idLabel}>ASPIRANT ID</Text>
          <Text style={styles.idValue}>{user?.profile_number || '—'}</Text>
        </View>

        {/* Menu Sections */}
        {MENU_SECTIONS.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionLabel}>{section.title}</Text>
            {section.items.map((item) => (
              <TouchableOpacity
                key={item.label}
                style={styles.menuItem}
                onPress={() => router.push(item.route as any)}
                activeOpacity={0.7}
              >
                <Text style={styles.menuEmoji}>{item.emoji}</Text>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.menuChevron}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}

        {/* Logout */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutEmoji}>🚪</Text>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* App version */}
        <Text style={styles.version}>SilverScreens v1.0.0</Text>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },

  header: {
    paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8,
    borderBottomWidth: 1, borderBottomColor: '#1A1A1A',
  },
  pageTitle: {
    fontFamily: Fonts.heading, fontSize: 28,
    color: Colors.white, letterSpacing: 4,
  },

  // User card
  userCard: {
    flexDirection: 'row', alignItems: 'center', gap: 16,
    margin: 16, padding: 16,
    backgroundColor: '#0D1117',
    borderRadius: 12, borderWidth: 1, borderColor: '#1A1A1A',
  },
  avatar: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: Colors.red,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: Colors.gold,
  },
  avatarText: { fontFamily: Fonts.heading, fontSize: 28, color: Colors.white },
  userInfo: { flex: 1 },
  userName: { fontFamily: Fonts.heading, fontSize: 22, color: Colors.white, letterSpacing: 1 },
  userId: { fontFamily: Fonts.body, fontSize: 14, color: Colors.gold, marginTop: 2 },
  roleBadge: {
    alignSelf: 'flex-start', marginTop: 6,
    backgroundColor: 'rgba(212,166,74,0.12)',
    borderRadius: 4, paddingHorizontal: 8, paddingVertical: 3,
    borderWidth: 1, borderColor: 'rgba(212,166,74,0.3)',
  },
  roleBadgeText: {
    fontFamily: Fonts.bodyMedium, fontSize: 11,
    color: Colors.gold, letterSpacing: 2,
  },

  // ID card
  idCard: {
    marginHorizontal: 16, marginBottom: 16,
    padding: 12, backgroundColor: '#0D1117',
    borderRadius: 8, borderWidth: 1, borderColor: '#1A1A1A',
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  idLabel: { fontFamily: Fonts.bodyMedium, fontSize: 11, color: '#666', letterSpacing: 2 },
  idValue: { fontFamily: Fonts.bodyMedium, fontSize: 14, color: Colors.gold },

  // Menu
  section: { marginHorizontal: 16, marginBottom: 12 },
  sectionLabel: {
    fontFamily: Fonts.bodyMedium, fontSize: 11,
    color: '#555', letterSpacing: 3, marginBottom: 8, marginLeft: 4,
  },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: '#0D1117', borderRadius: 10, padding: 14,
    borderWidth: 1, borderColor: '#1A1A1A', marginBottom: 6,
  },
  menuEmoji: { fontSize: 18, width: 24, textAlign: 'center' },
  menuLabel: { fontFamily: Fonts.bodyMedium, fontSize: 15, color: Colors.white, flex: 1 },
  menuChevron: { fontSize: 22, color: '#444' },

  // Logout
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: 'rgba(200,32,42,0.08)', borderRadius: 10, padding: 14,
    borderWidth: 1, borderColor: 'rgba(200,32,42,0.2)',
  },
  logoutEmoji: { fontSize: 18, width: 24, textAlign: 'center' },
  logoutText: { fontFamily: Fonts.bodyMedium, fontSize: 15, color: Colors.red, flex: 1 },

  version: {
    fontFamily: Fonts.body, fontSize: 12, color: '#333',
    textAlign: 'center', marginVertical: 24,
  },
});