import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useFonts, BebasNeue_400Regular } from '@expo-google-fonts/bebas-neue';
import {
  BarlowCondensed_400Regular,
  BarlowCondensed_500Medium,
} from '@expo-google-fonts/barlow-condensed';
import Toast from 'react-native-toast-message';
import { Colors, Fonts } from '../constants/theme';
import { api } from '../lib/api';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const [fontsLoaded] = useFonts({
    BebasNeue_400Regular,
    BarlowCondensed_400Regular,
    BarlowCondensed_500Medium,
  });

  if (!fontsLoaded) return null;

  const handleSubmit = async () => {
    if (!email.trim()) {
      Toast.show({ type: 'error', text1: 'Enter your email address.' });
      return;
    }
    setLoading(true);
    try {
      await api.post('/api/auth/forgot-password', { email });
      setSent(true);
      Toast.show({ type: 'success', text1: 'Reset link sent!', text2: 'Check your email inbox.' });
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Failed to send reset link. Please try again.';
      Toast.show({ type: 'error', text1: 'Error', text2: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <View style={styles.container}>

          {/* Back button */}
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>

          {/* Brand */}
          <View style={styles.header}>
            <Text style={styles.logo}>SILVER<Text style={styles.logoAccent}>SCREENS</Text></Text>
            <View style={styles.goldDivider} />
          </View>

          {sent ? (
            /* Success state */
            <View style={styles.card}>
              <Text style={styles.successEmoji}>📧</Text>
              <Text style={styles.cardTitle}>CHECK YOUR EMAIL</Text>
              <Text style={styles.cardSubtitle}>
                We've sent a password reset link to{'\n'}
                <Text style={styles.emailHighlight}>{email}</Text>
              </Text>
              <Text style={styles.helpText}>
                Didn't receive it? Check your spam folder or try again.
              </Text>
              <TouchableOpacity style={styles.retryBtn} onPress={() => setSent(false)}>
                <Text style={styles.retryBtnText}>Try Again</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.loginBtn} onPress={() => router.replace('/login')}>
                <Text style={styles.loginBtnText}>BACK TO LOGIN</Text>
              </TouchableOpacity>
            </View>
          ) : (
            /* Form state */
            <View style={styles.card}>
              <Text style={styles.cardTitle}>FORGOT PASSWORD</Text>
              <Text style={styles.cardSubtitle}>
                Enter your email address and we'll send you a link to reset your password.
              </Text>

              <Text style={styles.label}>EMAIL ADDRESS</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor={Colors.muted}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />

              <TouchableOpacity
                style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
                onPress={handleSubmit}
                disabled={loading}
                activeOpacity={0.85}
              >
                {loading ? (
                  <ActivityIndicator color={Colors.background} />
                ) : (
                  <Text style={styles.submitBtnText}>SEND RESET LINK</Text>
                )}
              </TouchableOpacity>

              <View style={styles.redAccent} />

              <TouchableOpacity onPress={() => router.back()} style={styles.backToLoginRow}>
                <Text style={styles.backToLoginText}>← Back to Login</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 20, justifyContent: 'center' },

  backBtn: { position: 'absolute', top: 20, left: 24, padding: 8, zIndex: 10 },
  backArrow: { fontSize: 22, color: Colors.white },

  header: { alignItems: 'center', marginBottom: 32 },
  logo: { fontFamily: Fonts.heading, fontSize: 40, color: Colors.white, letterSpacing: 5 },
  logoAccent: { color: Colors.red },
  goldDivider: { width: 50, height: 2, backgroundColor: Colors.gold, marginTop: 8 },

  card: {
    backgroundColor: '#0D0D0D', borderRadius: 4,
    borderWidth: 1, borderColor: '#1A1A1A', padding: 24,
  },
  successEmoji: { fontSize: 48, textAlign: 'center', marginBottom: 16 },
  cardTitle: { fontFamily: Fonts.heading, fontSize: 26, color: Colors.white, letterSpacing: 3, marginBottom: 8 },
  cardSubtitle: { fontFamily: Fonts.body, fontSize: 14, color: Colors.muted, lineHeight: 20, marginBottom: 24 },
  emailHighlight: { color: Colors.gold, fontFamily: Fonts.bodyMedium },
  helpText: { fontFamily: Fonts.body, fontSize: 13, color: '#555', marginBottom: 20 },

  label: { fontFamily: Fonts.bodyMedium, fontSize: 11, color: Colors.gold, letterSpacing: 2, marginBottom: 8 },
  input: {
    backgroundColor: '#111', borderWidth: 1, borderColor: '#2A2A2A',
    borderRadius: 2, paddingHorizontal: 14, paddingVertical: 13,
    fontFamily: Fonts.body, fontSize: 16, color: Colors.white, marginBottom: 20,
  },

  submitBtn: { backgroundColor: Colors.gold, paddingVertical: 15, borderRadius: 2, alignItems: 'center' },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText: { fontFamily: Fonts.heading, fontSize: 18, color: Colors.background, letterSpacing: 4 },

  redAccent: { height: 2, backgroundColor: Colors.red, marginTop: 12, marginBottom: 16, width: '30%', alignSelf: 'center' },

  backToLoginRow: { alignItems: 'center' },
  backToLoginText: { fontFamily: Fonts.bodyMedium, fontSize: 14, color: Colors.muted },

  retryBtn: { borderWidth: 1, borderColor: '#2A2A2A', borderRadius: 8, paddingVertical: 12, alignItems: 'center', marginBottom: 10 },
  retryBtnText: { fontFamily: Fonts.bodyMedium, fontSize: 14, color: '#888' },
  loginBtn: { backgroundColor: Colors.gold, paddingVertical: 14, borderRadius: 2, alignItems: 'center' },
  loginBtnText: { fontFamily: Fonts.heading, fontSize: 18, color: Colors.background, letterSpacing: 3 },
});