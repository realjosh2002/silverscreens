import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput,
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

const BG2 = '#0B0F14';
const BG3 = '#121821';

const FAQS = [
  { q: 'How do I apply for a casting call?', a: 'Go to the casting calls section, find a role that matches your profile and tap "Apply". Make sure your profile is complete for better chances.' },
  { q: 'How long does profile verification take?', a: 'Profile verification typically takes 2-3 business days after you submit your profile and complete payment.' },
  { q: 'How do I get recommended for castings?', a: 'Keep your profile 100% complete, add recent photos and a showreel, and apply to relevant casting calls regularly.' },
  { q: 'Can I message agencies directly?', a: 'Yes! Once your profile is approved, agencies can message you and you can reply from the Messages tab.' },
  { q: 'How do I cancel my subscription?', a: 'Go to Settings → Subscription & Billing and tap "Cancel Subscription". Your access continues until the end of the billing period.' },
  { q: 'What happens if I miss an audition?', a: 'Contact the agency through Messages as soon as possible to explain the situation. Agencies may reschedule at their discretion.' },
];

const CONTACT_OPTIONS = [
  { emoji: '📧', label: 'Email Support',   sub: 'support@silverscreens.in',    color: Colors.gold },
  { emoji: '💬', label: 'Live Chat',       sub: 'Available 9 AM – 6 PM IST',   color: '#60A5FA'  },
  { emoji: '📞', label: 'Call Us',         sub: '+91 80000 12345',              color: '#4ADE80'  },
  { emoji: '🐛', label: 'Report a Bug',   sub: 'Help us improve the app',      color: '#F472B6'  },
];

export default function SupportScreen() {
  const router = useRouter();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const [fontsLoaded] = useFonts({
    BebasNeue_400Regular,
    BarlowCondensed_400Regular,
    BarlowCondensed_500Medium,
    BarlowCondensed_600SemiBold,
  });

  if (!fontsLoaded) return null;

  const handleSend = async () => {
    if (!subject.trim() || !message.trim()) {
      Toast.show({ type: 'error', text1: 'Please fill in all fields' });
      return;
    }
    setSending(true);
    try {
      await api.post('/api/support', { subject, message });
      Toast.show({ type: 'success', text1: 'Message sent!', text2: 'We\'ll get back to you within 24 hours.' });
      setSubject('');
      setMessage('');
    } catch {
      Toast.show({ type: 'error', text1: 'Failed to send', text2: 'Please try again or email us directly.' });
    } finally {
      setSending(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.pageTitle}>HELP & SUPPORT</Text>
          <Text style={styles.pageSub}>We're here to help you succeed.</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Contact options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          {CONTACT_OPTIONS.map((opt, i) => (
            <TouchableOpacity key={i} style={styles.contactRow}>
              <View style={[styles.contactIcon, { backgroundColor: `${opt.color}20` }]}>
                <Text style={styles.contactEmoji}>{opt.emoji}</Text>
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>{opt.label}</Text>
                <Text style={[styles.contactSub, { color: opt.color }]}>{opt.sub}</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* FAQs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          {FAQS.map((faq, i) => (
            <TouchableOpacity
              key={i}
              style={styles.faqItem}
              onPress={() => setExpandedFaq(expandedFaq === i ? null : i)}
            >
              <View style={styles.faqHeader}>
                <Text style={styles.faqQ}>{faq.q}</Text>
                <Text style={styles.faqChevron}>{expandedFaq === i ? '∧' : '∨'}</Text>
              </View>
              {expandedFaq === i && (
                <Text style={styles.faqA}>{faq.a}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Send message form */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Send Us a Message</Text>
          <Text style={styles.formSub}>We'll get back to you within 24 hours.</Text>

          <Text style={styles.inputLabel}>SUBJECT</Text>
          <TextInput
            style={styles.input}
            value={subject}
            onChangeText={setSubject}
            placeholder="What's your question about?"
            placeholderTextColor="#444"
          />

          <Text style={styles.inputLabel}>MESSAGE</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={message}
            onChangeText={setMessage}
            placeholder="Describe your issue or question in detail..."
            placeholderTextColor="#444"
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />

          <TouchableOpacity
            style={[styles.sendBtn, sending && { opacity: 0.6 }]}
            onPress={handleSend}
            disabled={sending}
          >
            <Text style={styles.sendBtnText}>
              {sending ? 'Sending...' : '📧 Send Message'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Links */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal</Text>
          {['Privacy Policy', 'Terms of Use', 'Cookie Policy'].map((link, i) => (
            <TouchableOpacity key={i} style={styles.legalRow}>
              <Text style={styles.legalLink}>{link}</Text>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.footer}>SilverScreens v1.0.0 • Made with ❤️ in India</Text>

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

  section: {
    marginHorizontal: 16, marginTop: 16,
    backgroundColor: BG2, borderRadius: 12, padding: 16,
    borderWidth: 1, borderColor: '#1A1A1A',
  },
  sectionTitle: { fontFamily: Fonts.bodySemiBold, fontSize: 17, color: Colors.white, marginBottom: 14 },

  contactRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#111',
  },
  contactIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  contactEmoji: { fontSize: 18 },
  contactInfo: { flex: 1 },
  contactLabel: { fontFamily: Fonts.bodyMedium, fontSize: 15, color: Colors.white, marginBottom: 2 },
  contactSub: { fontFamily: Fonts.body, fontSize: 13 },
  chevron: { fontSize: 20, color: '#444' },

  faqItem: { borderBottomWidth: 1, borderBottomColor: '#111', paddingVertical: 14 },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 },
  faqQ: { fontFamily: Fonts.bodyMedium, fontSize: 15, color: Colors.white, flex: 1, lineHeight: 20 },
  faqChevron: { fontSize: 16, color: Colors.gold, marginTop: 2 },
  faqA: { fontFamily: Fonts.body, fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 20, marginTop: 10 },

  formSub: { fontFamily: Fonts.body, fontSize: 14, color: '#666', marginBottom: 16, marginTop: -8 },
  inputLabel: { fontFamily: Fonts.bodyMedium, fontSize: 11, color: Colors.gold, letterSpacing: 2, marginBottom: 8 },
  input: {
    backgroundColor: BG3, borderRadius: 8, borderWidth: 1, borderColor: '#2A2A2A',
    paddingHorizontal: 14, paddingVertical: 12,
    fontFamily: Fonts.body, fontSize: 15, color: Colors.white, marginBottom: 16,
  },
  textArea: { height: 120, textAlignVertical: 'top' },
  sendBtn: {
    backgroundColor: Colors.red, borderRadius: 8,
    paddingVertical: 14, alignItems: 'center',
  },
  sendBtnText: { fontFamily: Fonts.bodySemiBold, fontSize: 16, color: Colors.white },

  legalRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#111',
  },
  legalLink: { fontFamily: Fonts.bodyMedium, fontSize: 15, color: Colors.white },

  footer: {
    fontFamily: Fonts.body, fontSize: 12, color: '#333',
    textAlign: 'center', marginVertical: 24,
  },
});