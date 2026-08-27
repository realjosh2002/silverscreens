import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { useFonts, BebasNeue_400Regular } from '@expo-google-fonts/bebas-neue';
import {
  BarlowCondensed_400Regular,
  BarlowCondensed_500Medium,
  BarlowCondensed_600SemiBold,
} from '@expo-google-fonts/barlow-condensed';
import * as SecureStore from 'expo-secure-store';
import { api } from '../lib/api';
import { saveToken } from '../lib/auth';

const { width, height } = Dimensions.get('window');
const RED = '#C8202A';
const GOLD = '#D4A64A';

export default function LoginScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'aspirant' | 'agency'>('aspirant');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [fontsLoaded] = useFonts({
    BebasNeue_400Regular,
    BarlowCondensed_400Regular,
    BarlowCondensed_500Medium,
    BarlowCondensed_600SemiBold,
  });

  if (!fontsLoaded) return null;

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Toast.show({ type: 'error', text1: 'Missing fields', text2: 'Enter your email and password.' });
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/api/auth/login', { email, password });
      const { session, user } = res.data.data;
      await saveToken(session.access_token);
      await SecureStore.setItemAsync('sb-refresh-token', session.refresh_token);
      await SecureStore.setItemAsync('sb-user', JSON.stringify(user));
      Toast.show({ type: 'success', text1: `Welcome back, ${user.name}!` });
      router.replace('/(tabs)/dashboard');
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Login failed. Please try again.';
      Toast.show({ type: 'error', text1: 'Login failed', text2: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Cinematic background */}
      <View style={styles.bgDark} />
      <View style={styles.bgSpotlight} />
      <View style={styles.bgGlow} />
      <View style={styles.bgBottomFade} />

      {/* Hero top section */}
      <View style={styles.heroSection}>
        <Text style={styles.heroTitle}>SILVER</Text>
        <Text style={styles.heroTitleRed}>SCREENS</Text>
        <View style={styles.taglineRow}>
          <View style={styles.taglineLine} />
          <Text style={styles.tagline}>WE MAKE CELEBRITIES</Text>
          <View style={styles.taglineLine} />
        </View>
      </View>

      {/* Bottom sheet */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.bottomSheet}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Role tabs */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'aspirant' && styles.tabBtnActive]}
              onPress={() => setActiveTab('aspirant')}
            >
              <Text style={styles.tabIcon}>🎬</Text>
              <Text style={[styles.tabText, activeTab === 'aspirant' && styles.tabTextActive]}>
                ASPIRANT
              </Text>
              {activeTab === 'aspirant' && <View style={styles.tabUnderline} />}
            </TouchableOpacity>
            <View style={styles.tabDivider} />
            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'agency' && styles.tabBtnActive]}
              onPress={() => setActiveTab('agency')}
            >
              <Text style={styles.tabIcon}>🏢</Text>
              <Text style={[styles.tabText, activeTab === 'agency' && styles.tabTextActive]}>
                AGENCIES
              </Text>
              {activeTab === 'agency' && <View style={styles.tabUnderline} />}
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Email field */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputIcon}>✉</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Email or Phone Number"
                placeholderTextColor="#555"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Password field */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputIcon}>🔒</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                placeholderTextColor="#555"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeBtn}
              >
                <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁'}</Text>
              </TouchableOpacity>
            </View>

            {/* Forgot password */}
            <TouchableOpacity
              style={styles.forgotRow}
              onPress={() => router.push('/forgot-password')}
            >
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Login button */}
            <TouchableOpacity
              style={[styles.loginBtn, loading && { opacity: 0.7 }]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginBtnText}>LOGIN</Text>
              )}
            </TouchableOpacity>

            {/* OR divider */}
            <View style={styles.orRow}>
              <View style={styles.orLine} />
              <Text style={styles.orText}>OR</Text>
              <View style={styles.orLine} />
            </View>

            {/* Register link */}
            <View style={styles.registerRow}>
              <Text style={styles.registerMuted}>New to SilverScreens? </Text>
              <TouchableOpacity onPress={() => router.push('/register')}>
                <Text style={styles.registerLink}>Create Account ›</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Trust badges */}
          <View style={styles.trustRow}>
            <View style={styles.trustItem}>
              <Text style={styles.trustIcon}>🛡</Text>
              <Text style={styles.trustLabel}>Trusted by{'\n'}Industry Professionals</Text>
            </View>
            <View style={styles.trustDivider} />
            <View style={styles.trustItem}>
              <Text style={styles.trustIcon}>🔒</Text>
              <Text style={styles.trustLabel}>Secure{'\n'}& Private</Text>
            </View>
            <View style={styles.trustDivider} />
            <View style={styles.trustItem}>
              <Text style={styles.trustIcon}>⭐</Text>
              <Text style={styles.trustLabel}>Reliable{'\n'}Platform</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#080808' },

  // Background layers
  bgDark: { ...StyleSheet.absoluteFillObject, backgroundColor: '#060608' },
  bgSpotlight: {
    position: 'absolute', top: -50, left: -100,
    width: 350, height: 500, borderRadius: 200,
    backgroundColor: 'rgba(20,30,60,0.4)',
    transform: [{ rotate: '15deg' }],
  },
  bgGlow: {
    position: 'absolute', top: height * 0.1, right: -50,
    width: 200, height: 300, borderRadius: 100,
    backgroundColor: 'rgba(15,20,40,0.3)',
  },
  bgBottomFade: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: height * 0.65,
    backgroundColor: 'rgba(8,8,10,0.97)',
  },

  // Hero section
  heroSection: {
    position: 'absolute', top: height * 0.08, left: 0, right: 0,
    alignItems: 'center', zIndex: 1,
  },
  heroTitle: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 64, color: '#fff', letterSpacing: 6, lineHeight: 66,
  },
  heroTitleRed: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 64, color: RED, letterSpacing: 6, lineHeight: 66,
  },
  taglineRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8 },
  taglineLine: { flex: 1, height: 1, backgroundColor: RED, opacity: 0.6, maxWidth: 60 },
  tagline: {
    fontFamily: 'BarlowCondensed_500Medium',
    fontSize: 12, color: '#aaa', letterSpacing: 4,
  },

  // Bottom sheet
  bottomSheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    height: height * 0.62,
    backgroundColor: '#0D0D0F',
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    borderTopWidth: 1, borderColor: '#1A1A1A',
  },
  scrollContent: { paddingBottom: 20 },

  // Tabs
  tabsContainer: {
    flexDirection: 'row', alignItems: 'center',
    borderBottomWidth: 1, borderBottomColor: '#1A1A1A',
  },
  tabBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 8,
    paddingVertical: 16, position: 'relative',
  },
  tabBtnActive: {},
  tabIcon: { fontSize: 16 },
  tabText: {
    fontFamily: 'BarlowCondensed_600SemiBold',
    fontSize: 15, color: '#555', letterSpacing: 2,
  },
  tabTextActive: { color: '#fff' },
  tabUnderline: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    height: 2, backgroundColor: RED,
  },
  tabDivider: { width: 1, height: 30, backgroundColor: '#1A1A1A' },

  // Form
  form: { padding: 20, gap: 12 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#161618', borderRadius: 10,
    borderWidth: 1, borderColor: '#252525',
    paddingHorizontal: 14, height: 52,
  },
  inputIcon: { fontSize: 16, marginRight: 10, opacity: 0.6 },
  input: {
    flex: 1,
    fontFamily: 'BarlowCondensed_400Regular',
    fontSize: 16, color: '#fff',
  },
  eyeBtn: { padding: 4 },
  eyeIcon: { fontSize: 16 },