import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useFonts, BebasNeue_400Regular } from '@expo-google-fonts/bebas-neue';
import {
  BarlowCondensed_400Regular,
  BarlowCondensed_500Medium,
  BarlowCondensed_600SemiBold,
} from '@expo-google-fonts/barlow-condensed';
import Toast from 'react-native-toast-message';
import * as SecureStore from 'expo-secure-store';
import { Colors, Fonts } from '../constants/theme';
import { api } from '../lib/api';
import { saveToken } from '../lib/auth';

const ROLES = ['aspirant', 'agency'];

export default function RegisterScreen() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('aspirant');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const [fontsLoaded] = useFonts({
    BebasNeue_400Regular,
    BarlowCondensed_400Regular,
    BarlowCondensed_500Medium,
    BarlowCondensed_600SemiBold,
  });

  if (!fontsLoaded) return null;

  const handleRegister = async () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim()) {
      Toast.show({ type: 'error', text1: 'Missing fields', text2: 'Please fill in all required fields.' });
      return;
    }
    if (password !== confirmPassword) {
      Toast.show({ type: 'error', text1: 'Passwords do not match' });
      return;
    }
    if (password.length < 8) {
      Toast.show({ type: 'error', text1: 'Password too short', text2: 'Must be at least 8 characters.' });
      return;
    }
    if (!agreed) {
      Toast.show({ type: 'error', text1: 'Please accept the terms and conditions.' });
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/api/auth/register', {
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        password,
        role,
      });

      const { session, user } = res.data.data;
      await saveToken(session.access_token);
      await SecureStore.setItemAsync('sb-refresh-token', session.refresh_token);
      await SecureStore.setItemAsync('sb-user', JSON.stringify(user));

      Toast.show({ type: 'success', text1: 'Account created!', text2: `Welcome to SilverScreens, ${user.name}!` });
      router.replace('/(tabs)/dashboard');
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Registration failed. Please try again.';
      Toast.show({ type: 'error', text1: 'Registration failed', text2: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          {/* Brand */}
          <View style={styles.header}>
            <Text style={styles.logo}>SILVER<Text style={styles.logoAccent}>SCREENS</Text></Text>
            <View style={styles.goldDivider} />
            <Text style={styles.tagline}>YOUR TALENT. YOUR STAGE.</Text>
          </View>

          {/* Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>CREATE ACCOUNT</Text>
            <Text style={styles.cardSubtitle}>Join thousands of talented aspirants</Text>

            {/* Role selector */}
            <Text style={styles.label}>I AM A *</Text>
            <View style={styles.roleRow}>
              {ROLES.map(r => (
                <TouchableOpacity
                  key={r}
                  style={[styles.roleBtn, role === r && styles.roleBtnActive]}
                  onPress={() => setRole(r)}
                >
                  <Text style={[styles.roleBtnText, role === r && styles.roleBtnTextActive]}>
                    {r === 'aspirant' ? '🎭 Aspirant' : '🏢 Agency'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Name */}
            <View style={styles.row}>
              <View style={styles.halfField}>
                <Text style={styles.label}>FIRST NAME *</Text>
                <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} placeholder="First" placeholderTextColor={Colors.muted} autoCapitalize="words" />
              </View>
              <View style={styles.halfField}>
                <Text style={styles.label}>LAST NAME *</Text>
                <TextInput style={styles.input} value={lastName} onChangeText={setLastName} placeholder="Last" placeholderTextColor={Colors.muted} autoCapitalize="words" />
              </View>
            </View>

            {/* Email */}
            <Text style={styles.label}>EMAIL ADDRESS *</Text>
            <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="you@example.com" placeholderTextColor={Colors.muted} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} />

            {/* Phone */}
            <Text style={styles.label}>MOBILE NUMBER</Text>
            <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="+91 XXXXX XXXXX" placeholderTextColor={Colors.muted} keyboardType="phone-pad" />

            {/* Password */}
            <Text style={styles.label}>PASSWORD *</Text>
            <View style={styles.inputWrapper}>
              <TextInput style={[styles.input, styles.inputFlex]} value={password} onChangeText={setPassword} placeholder="Min. 8 characters" placeholderTextColor={Colors.muted} secureTextEntry={!showPassword} autoCapitalize="none" />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                <Text style={styles.eyeText}>{showPassword ? 'HIDE' : 'SHOW'}</Text>
              </TouchableOpacity>
            </View>

            {/* Confirm Password */}
            <Text style={styles.label}>CONFIRM PASSWORD *</Text>
            <TextInput style={styles.input} value={confirmPassword} onChangeText={setConfirmPassword} placeholder="Repeat password" placeholderTextColor={Colors.muted} secureTextEntry={!showPassword} autoCapitalize="none" />

            {/* Terms */}
            <TouchableOpacity style={styles.termsRow} onPress={() => setAgreed(!agreed)}>
              <View style={[styles.checkbox, agreed && styles.checkboxActive]}>
                {agreed && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.termsText}>
                I agree to the <Text style={styles.termsLink}>Terms of Service</Text> and <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
            </TouchableOpacity>

            {/* Register button */}
            <TouchableOpacity
              style={[styles.registerBtn, loading && styles.registerBtnDisabled]}
              onPress={handleRegister}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color={Colors.background} />
              ) : (
                <Text style={styles.registerBtnText}>CREATE ACCOUNT</Text>
              )}
            </TouchableOpacity>

            <View style={styles.redAccent} />

            {/* Login link */}
            <View style={styles.loginRow}>
              <Text style={styles.loginMuted}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.replace('/login')}>
                <Text style={styles.loginLink}>Sign in</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.footer}>© 2025 SilverScreens. All rights reserved.</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 36, paddingBottom: 32, alignItems: 'center' },

  header: { alignItems: 'center', marginBottom: 28 },
  logo: { fontFamily: Fonts.heading, fontSize: 44, color: Colors.white, letterSpacing: 5 },
  logoAccent: { color: Colors.red },
  goldDivider: { width: 60, height: 2, backgroundColor: Colors.gold, marginTop: 8, marginBottom: 8 },
  tagline: { fontFamily: Fonts.bodySemiBold, fontSize: 11, color: Colors.muted, letterSpacing: 4 },

  card: {
    width: '100%', backgroundColor: '#0D0D0D',
    borderRadius: 4, borderWidth: 1, borderColor: '#1A1A1A',
    padding: 24, marginBottom: 20,
  },
  cardTitle: { fontFamily: Fonts.heading, fontSize: 26, color: Colors.white, letterSpacing: 3, marginBottom: 4 },
  cardSubtitle: { fontFamily: Fonts.body, fontSize: 14, color: Colors.muted, marginBottom: 20 },

  roleRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  roleBtn: {
    flex: 1, paddingVertical: 12, borderRadius: 4,
    borderWidth: 1, borderColor: '#2A2A2A',
    alignItems: 'center', backgroundColor: '#111',
  },
  roleBtnActive: { borderColor: Colors.gold, backgroundColor: 'rgba(212,166,74,0.12)' },
  roleBtnText: { fontFamily: Fonts.bodyMedium, fontSize: 14, color: Colors.muted },
  roleBtnTextActive: { color: Colors.gold },

  row: { flexDirection: 'row', gap: 10 },
  halfField: { flex: 1 },

  label: { fontFamily: Fonts.bodyMedium, fontSize: 11, color: Colors.gold, letterSpacing: 2, marginBottom: 8, marginTop: 14 },
  input: {
    backgroundColor: '#111', borderWidth: 1, borderColor: '#2A2A2A',
    borderRadius: 2, paddingHorizontal: 14, paddingVertical: 12,
    fontFamily: Fonts.body, fontSize: 15, color: Colors.white,
  },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111', borderWidth: 1, borderColor: '#2A2A2A', borderRadius: 2 },
  inputFlex: { flex: 1, borderWidth: 0 },
  eyeBtn: { paddingHorizontal: 14 },
  eyeText: { fontFamily: Fonts.bodyMedium, fontSize: 11, color: Colors.gold, letterSpacing: 1 },

  termsRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginTop: 16, marginBottom: 4 },
  checkbox: {
    width: 20, height: 20, borderRadius: 4,
    borderWidth: 1.5, borderColor: '#444',
    alignItems: 'center', justifyContent: 'center', marginTop: 1,
  },
  checkboxActive: { backgroundColor: Colors.gold, borderColor: Colors.gold },
  checkmark: { fontSize: 12, color: Colors.background, fontWeight: '800' },
  termsText: { fontFamily: Fonts.body, fontSize: 13, color: Colors.muted, flex: 1, lineHeight: 18 },
  termsLink: { color: Colors.gold },

  registerBtn: { backgroundColor: Colors.gold, paddingVertical: 15, borderRadius: 2, alignItems: 'center', marginTop: 20 },
  registerBtnDisabled: { opacity: 0.6 },
  registerBtnText: { fontFamily: Fonts.heading, fontSize: 18, color: Colors.background, letterSpacing: 4 },

  redAccent: { height: 2, backgroundColor: Colors.red, marginTop: 12, marginBottom: 16, width: '30%', alignSelf: 'center' },

  loginRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  loginMuted: { fontFamily: Fonts.body, fontSize: 14, color: Colors.muted },
  loginLink: { fontFamily: Fonts.bodyMedium, fontSize: 14, color: Colors.gold },

  footer: { fontFamily: Fonts.body, fontSize: 12, color: '#333', textAlign: 'center' },
});