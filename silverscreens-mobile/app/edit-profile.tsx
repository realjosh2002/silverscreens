import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, ActivityIndicator, KeyboardAvoidingView, Platform,
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

const STEPS = ['Basic Info', 'Details', 'Departments', 'Media', 'Review'];

const TITLES = ['Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Prof.'];
const GENDERS = ['Male', 'Female', 'Other', 'Prefer not to say'];
const EXPERIENCE_LEVELS = ['Fresher', '1-2 Years', '3-5 Years', '5-10 Years', '10+ Years'];
const LANGUAGES_LIST = ['Hindi', 'English', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Bengali', 'Marathi', 'Gujarati', 'Punjabi', 'Urdu', 'Odia', 'Other'];
const BODY_TYPES = ['Slim', 'Athletic', 'Average', 'Heavy'];
const COMPLEXIONS = ['Fair', 'Wheatish', 'Dusky', 'Dark'];
const AVAILABLE_FOR = ['Feature Films', 'Short Films', 'Web Series', 'TV Series', 'Ad Films', 'Music Videos', 'Modelling', 'Theatre'];
const DEPARTMENTS = ['Acting', 'Modelling', 'Dancing', 'Singing', 'Direction', 'Production', 'Cinematography', 'Editing'];

const PROFILE_TIPS = [
  { emoji: '📸', title: 'Add a clear profile photo', sub: 'Profiles with real photos get 70% more views.' },
  { emoji: '🎬', title: 'Upload a showreel',          sub: 'A showreel increases your chances of getting noticed.' },
  { emoji: '✅', title: 'Complete all sections',      sub: 'Complete profiles are 3x more likely to be shortlisted.' },
  { emoji: '🎭', title: 'Select correct departments', sub: 'Agencies search by department and role. Be accurate.' },
];

export default function EditProfileScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Step 1 — Basic Info
  const [title, setTitle] = useState('Mr.');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [gender, setGender] = useState('Male');
  const [dob, setDob] = useState('');
  const [country, setCountry] = useState('India');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [languages, setLanguages] = useState<string[]>([]);
  const [experienceLevel, setExperienceLevel] = useState('Fresher');

  // Step 2 — Details
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bodyType, setBodyType] = useState('Athletic');
  const [complexion, setComplexion] = useState('Fair');
  const [eyeColor, setEyeColor] = useState('');
  const [hairColor, setHairColor] = useState('');
  const [chest, setChest] = useState('');
  const [waist, setWaist] = useState('');
  const [hip, setHip] = useState('');
  const [shoeSize, setShoeSize] = useState('');
  const [bio, setBio] = useState('');
  const [availableFor, setAvailableFor] = useState<string[]>([]);

  // Step 3 — Departments
  const [selectedDepts, setSelectedDepts] = useState<string[]>([]);

  const [fontsLoaded] = useFonts({
    BebasNeue_400Regular,
    BarlowCondensed_400Regular,
    BarlowCondensed_500Medium,
    BarlowCondensed_600SemiBold,
  });

  useEffect(() => { loadProfile(); }, []);

  const loadProfile = async () => {
    try {
      const user = await getUser();
      if (!user) { router.replace('/login'); return; }

      const nameParts = user.name?.split(' ') ?? [];
      setFirstName(nameParts[0] ?? '');
      setLastName(nameParts.slice(1).join(' ') ?? '');
      setEmail(user.email ?? '');
      setMobile(user.phone ?? '');

      const res = await api.get('/api/profile/aspirant');
      const p = res.data?.data?.profile ?? res.data?.profile ?? {};
      const ap = p.aspirant_profiles ?? {};

      setDob(ap.date_of_birth ? new Date(ap.date_of_birth).toISOString().split('T')[0] : '');
      setGender(p.gender ?? 'Male');
      setCity(ap.city ?? '');
      setState(ap.state ?? '');
      setAddress1(ap.address_line1 ?? '');
      setAddress2(ap.address_line2 ?? '');
      setPinCode(ap.pin_code ?? '');
      setLanguages(Array.isArray(ap.languages) ? ap.languages : []);
      setExperienceLevel(ap.experience_level ?? 'Fresher');
      setHeight(ap.height ?? '');
      setWeight(ap.weight ? String(ap.weight) : '');
      setBodyType(ap.body_type ?? 'Athletic');
      setComplexion(ap.complexion ?? 'Fair');
      setEyeColor(ap.eye_color ?? '');
      setHairColor(ap.hair_color ?? '');
      setChest(ap.chest ?? '');
      setWaist(ap.waist ?? '');
      setHip(ap.hip ?? '');
      setShoeSize(ap.shoe_size ?? '');
      setBio(ap.bio ?? '');
      setAvailableFor(Array.isArray(ap.available_for) ? ap.available_for : []);
      setSelectedDepts(Array.isArray(ap.departments) ? ap.departments.map((d: any) => d.dept ?? d.department) : []);
    } catch (err: any) {
      if (err?.response?.status === 401) { await clearAuth(); router.replace('/login'); }
    } finally {
      setLoading(false);
    }
  };

  const saveDraft = async () => {
    setSaving(true);
    try {
      await api.put('/api/profile/aspirant', {
        first_name: firstName, last_name: lastName,
        gender, date_of_birth: dob,
        city, state, address_line1: address1,
        address_line2: address2, pin_code: pinCode,
        languages, experience_level: experienceLevel,
        height, weight: weight ? Number(weight) : undefined,
        body_type: bodyType, complexion,
        eye_color: eyeColor, hair_color: hairColor,
        chest, waist, hip, shoe_size: shoeSize,
        bio, available_for: availableFor,
      });
      Toast.show({ type: 'success', text1: 'Draft saved!' });
    } catch {
      Toast.show({ type: 'error', text1: 'Failed to save draft' });
    } finally {
      setSaving(false);
    }
  };

  const submitProfile = async () => {
    setSaving(true);
    try {
      await api.put('/api/profile/aspirant', {
        first_name: firstName, last_name: lastName,
        gender, date_of_birth: dob,
        city, state, address_line1: address1,
        address_line2: address2, pin_code: pinCode,
        languages, experience_level: experienceLevel,
        height, weight: weight ? Number(weight) : undefined,
        body_type: bodyType, complexion,
        eye_color: eyeColor, hair_color: hairColor,
        chest, waist, hip, shoe_size: shoeSize,
        bio, available_for: availableFor,
        submit: true,
      });
      Toast.show({ type: 'success', text1: 'Profile submitted for review!' });
      router.replace('/my-profile' as any);
    } catch {
      Toast.show({ type: 'error', text1: 'Failed to submit profile' });
    } finally {
      setSaving(false);
    }
  };

  if (!fontsLoaded || loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={Colors.gold} size="large" />
      </View>
    );
  }

  const toggleLanguage = (lang: string) => {
    setLanguages(prev => prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]);
  };

  const toggleAvailableFor = (item: string) => {
    setAvailableFor(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  const toggleDept = (dept: string) => {
    setSelectedDepts(prev => prev.includes(dept) ? prev.filter(d => d !== dept) : [...prev, dept]);
  };

  const renderStep1 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepHeading}>1. BASIC INFORMATION</Text>
      <Text style={styles.stepSub}>Personal details for your profile</Text>

      {/* Title */}
      <Text style={styles.fieldLabel}>TITLE *</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsRow}>
        {TITLES.map(t => (
          <TouchableOpacity
            key={t}
            style={[styles.optionChip, title === t && styles.optionChipActive]}
            onPress={() => setTitle(t)}
          >
            <Text style={[styles.optionChipText, title === t && styles.optionChipTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Name */}
      <View style={styles.row}>
        <View style={styles.halfField}>
          <Text style={styles.fieldLabel}>FIRST NAME *</Text>
          <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} placeholder="First name" placeholderTextColor="#444" />
        </View>
        <View style={styles.halfField}>
          <Text style={styles.fieldLabel}>LAST NAME *</Text>
          <TextInput style={styles.input} value={lastName} onChangeText={setLastName} placeholder="Last name" placeholderTextColor="#444" />
        </View>
      </View>

      {/* Email + Mobile */}
      <Text style={styles.fieldLabel}>EMAIL ADDRESS *</Text>
      <TextInput style={[styles.input, styles.inputDisabled]} value={email} editable={false} />

      <Text style={styles.fieldLabel}>MOBILE NUMBER *</Text>
      <TextInput style={styles.input} value={mobile} onChangeText={setMobile} keyboardType="phone-pad" placeholder="+91 XXXXX XXXXX" placeholderTextColor="#444" />

      {/* Gender */}
      <Text style={styles.fieldLabel}>GENDER *</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsRow}>
        {GENDERS.map(g => (
          <TouchableOpacity
            key={g}
            style={[styles.optionChip, gender === g && styles.optionChipActive]}
            onPress={() => setGender(g)}
          >
            <Text style={[styles.optionChipText, gender === g && styles.optionChipTextActive]}>{g}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* DOB */}
      <Text style={styles.fieldLabel}>DATE OF BIRTH *</Text>
      <TextInput style={styles.input} value={dob} onChangeText={setDob} placeholder="YYYY-MM-DD" placeholderTextColor="#444" />

      {/* Location */}
      <View style={styles.row}>
        <View style={styles.halfField}>
          <Text style={styles.fieldLabel}>STATE *</Text>
          <TextInput style={styles.input} value={state} onChangeText={setState} placeholder="Tamil Nadu" placeholderTextColor="#444" />
        </View>
        <View style={styles.halfField}>
          <Text style={styles.fieldLabel}>CITY *</Text>
          <TextInput style={styles.input} value={city} onChangeText={setCity} placeholder="Chennai" placeholderTextColor="#444" />
        </View>
      </View>

      <Text style={styles.fieldLabel}>ADDRESS LINE 1</Text>
      <TextInput style={styles.input} value={address1} onChangeText={setAddress1} placeholder="Street address" placeholderTextColor="#444" />

      <Text style={styles.fieldLabel}>ADDRESS LINE 2</Text>
      <TextInput style={styles.input} value={address2} onChangeText={setAddress2} placeholder="Landmark, area" placeholderTextColor="#444" />

      <Text style={styles.fieldLabel}>PIN CODE</Text>
      <TextInput style={styles.input} value={pinCode} onChangeText={setPinCode} keyboardType="numeric" placeholder="600001" placeholderTextColor="#444" />

      {/* Languages */}
      <Text style={styles.fieldLabel}>LANGUAGES KNOWN *</Text>
      <View style={styles.tagsWrap}>
        {LANGUAGES_LIST.map(lang => (
          <TouchableOpacity
            key={lang}
            style={[styles.optionChip, languages.includes(lang) && styles.optionChipActive]}
            onPress={() => toggleLanguage(lang)}
          >
            <Text style={[styles.optionChipText, languages.includes(lang) && styles.optionChipTextActive]}>{lang}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Experience */}
      <Text style={styles.fieldLabel}>EXPERIENCE LEVEL *</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsRow}>
        {EXPERIENCE_LEVELS.map(lvl => (
          <TouchableOpacity
            key={lvl}
            style={[styles.optionChip, experienceLevel === lvl && styles.optionChipActive]}
            onPress={() => setExperienceLevel(lvl)}
          >
            <Text style={[styles.optionChipText, experienceLevel === lvl && styles.optionChipTextActive]}>{lvl}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepHeading}>2. PHYSICAL DETAILS</Text>
      <Text style={styles.stepSub}>Help agencies find the right look</Text>

      {/* Bio */}
      <Text style={styles.fieldLabel}>ABOUT YOU</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={bio} onChangeText={setBio}
        placeholder="Write a short bio about yourself..."
        placeholderTextColor="#444" multiline numberOfLines={4}
        textAlignVertical="top"
      />

      {/* Height + Weight */}
      <View style={styles.row}>
        <View style={styles.halfField}>
          <Text style={styles.fieldLabel}>HEIGHT</Text>
          <TextInput style={styles.input} value={height} onChangeText={setHeight} placeholder={`5'10"`} placeholderTextColor="#444" />
        </View>
        <View style={styles.halfField}>
          <Text style={styles.fieldLabel}>WEIGHT (KG)</Text>
          <TextInput style={styles.input} value={weight} onChangeText={setWeight} keyboardType="numeric" placeholder="70" placeholderTextColor="#444" />
        </View>
      </View>

      {/* Body Type */}
      <Text style={styles.fieldLabel}>BODY TYPE</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsRow}>
        {BODY_TYPES.map(bt => (
          <TouchableOpacity key={bt} style={[styles.optionChip, bodyType === bt && styles.optionChipActive]} onPress={() => setBodyType(bt)}>
            <Text style={[styles.optionChipText, bodyType === bt && styles.optionChipTextActive]}>{bt}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Complexion */}
      <Text style={styles.fieldLabel}>COMPLEXION</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsRow}>
        {COMPLEXIONS.map(c => (
          <TouchableOpacity key={c} style={[styles.optionChip, complexion === c && styles.optionChipActive]} onPress={() => setComplexion(c)}>
            <Text style={[styles.optionChipText, complexion === c && styles.optionChipTextActive]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Eye + Hair */}
      <View style={styles.row}>
        <View style={styles.halfField}>
          <Text style={styles.fieldLabel}>EYE COLOR</Text>
          <TextInput style={styles.input} value={eyeColor} onChangeText={setEyeColor} placeholder="Black" placeholderTextColor="#444" />
        </View>
        <View style={styles.halfField}>
          <Text style={styles.fieldLabel}>HAIR COLOR</Text>
          <TextInput style={styles.input} value={hairColor} onChangeText={setHairColor} placeholder="Black" placeholderTextColor="#444" />
        </View>
      </View>

      {/* Measurements */}
      <Text style={styles.sectionLabel}>MEASUREMENTS</Text>
      <View style={styles.row}>
        <View style={styles.halfField}>
          <Text style={styles.fieldLabel}>CHEST</Text>
          <TextInput style={styles.input} value={chest} onChangeText={setChest} placeholder={`40"`} placeholderTextColor="#444" />
        </View>
        <View style={styles.halfField}>
          <Text style={styles.fieldLabel}>WAIST</Text>
          <TextInput style={styles.input} value={waist} onChangeText={setWaist} placeholder={`32"`} placeholderTextColor="#444" />
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.halfField}>
          <Text style={styles.fieldLabel}>HIP</Text>
          <TextInput style={styles.input} value={hip} onChangeText={setHip} placeholder={`36"`} placeholderTextColor="#444" />
        </View>
        <View style={styles.halfField}>
          <Text style={styles.fieldLabel}>SHOE SIZE</Text>
          <TextInput style={styles.input} value={shoeSize} onChangeText={setShoeSize} placeholder="UK 9" placeholderTextColor="#444" />
        </View>
      </View>

      {/* Available For */}
      <Text style={styles.fieldLabel}>AVAILABLE FOR</Text>
      <View style={styles.tagsWrap}>
        {AVAILABLE_FOR.map(item => (
          <TouchableOpacity
            key={item}
            style={[styles.optionChip, availableFor.includes(item) && styles.optionChipActive]}
            onPress={() => toggleAvailableFor(item)}
          >
            <Text style={[styles.optionChipText, availableFor.includes(item) && styles.optionChipTextActive]}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepHeading}>3. DEPARTMENTS & ROLES</Text>
      <Text style={styles.stepSub}>Select the departments you work in</Text>
      <View style={styles.tagsWrap}>
        {DEPARTMENTS.map(dept => (
          <TouchableOpacity
            key={dept}
            style={[styles.deptChip, selectedDepts.includes(dept) && styles.deptChipActive]}
            onPress={() => toggleDept(dept)}
          >
            <Text style={[styles.deptChipText, selectedDepts.includes(dept) && styles.deptChipTextActive]}>{dept}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepHeading}>4. MEDIA</Text>
      <Text style={styles.stepSub}>Upload photos and videos to showcase your talent</Text>
      <View style={styles.mediaPlaceholder}>
        <Text style={styles.mediaEmoji}>📸</Text>
        <Text style={styles.mediaTitle}>Upload Photos & Videos</Text>
        <Text style={styles.mediaSub}>Use the web app to upload media files for best experience.</Text>
        <TouchableOpacity style={styles.mediaBtn} onPress={() => router.push('/my-profile' as any)}>
          <Text style={styles.mediaBtnText}>View My Media</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStep5 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepHeading}>5. REVIEW & SUBMIT</Text>
      <Text style={styles.stepSub}>Review your changes before submitting for admin review</Text>

      <View style={styles.reviewBanner}>
        <Text style={styles.reviewBannerEmoji}>✏️</Text>
        <View style={styles.reviewBannerInfo}>
          <Text style={styles.reviewBannerTitle}>EDITING YOUR PROFILE</Text>
          <Text style={styles.reviewBannerSub}>Your changes will be submitted for admin review before going live. Your current profile remains visible until approved.</Text>
        </View>
      </View>

      {/* Summary */}
      {[
        { label: 'Name',        value: `${firstName} ${lastName}` },
        { label: 'Email',       value: email },
        { label: 'Mobile',      value: mobile },
        { label: 'Location',    value: `${city}, ${state}` },
        { label: 'Experience',  value: experienceLevel },
        { label: 'Languages',   value: languages.join(', ') || '—' },
        { label: 'Departments', value: selectedDepts.join(', ') || '—' },
      ].map(({ label, value }) => (
        <View key={label} style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>{label}</Text>
          <Text style={styles.reviewValue}>{value || '—'}</Text>
        </View>
      ))}

      {/* Profile tips */}
      <Text style={styles.sectionLabel}>PROFILE TIPS</Text>
      {PROFILE_TIPS.map((tip, i) => (
        <View key={i} style={styles.tipRow}>
          <Text style={styles.tipEmoji}>{tip.emoji}</Text>
          <View>
            <Text style={styles.tipTitle}>{tip.title}</Text>
            <Text style={styles.tipSub}>{tip.sub}</Text>
          </View>
        </View>
      ))}
    </View>
  );

  const stepContent = [renderStep1, renderStep2, renderStep3, renderStep4, renderStep5];

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.pageTitle}>EDIT YOUR PROFILE</Text>
          <Text style={styles.pageSub}>Update your details — changes will be sent for admin review</Text>
        </View>
      </View>

      {/* Step indicator */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.stepsScroll}>
        {STEPS.map((step, i) => (
          <TouchableOpacity
            key={step}
            style={styles.stepIndicator}
            onPress={() => setCurrentStep(i)}
          >
            <View style={[styles.stepCircle, i === currentStep && styles.stepCircleActive, i < currentStep && styles.stepCircleDone]}>
              <Text style={[styles.stepNum, (i === currentStep || i < currentStep) && styles.stepNumActive]}>
                {i < currentStep ? '✓' : i + 1}
              </Text>
            </View>
            <Text style={[styles.stepLabel, i === currentStep && styles.stepLabelActive]}>{step}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {stepContent[currentStep]?.()}

          {/* Navigation buttons */}
          <View style={styles.navButtons}>
            <TouchableOpacity style={styles.draftBtn} onPress={saveDraft} disabled={saving}>
              <Text style={styles.draftBtnText}>{saving ? 'Saving...' : 'SAVE DRAFT'}</Text>
            </TouchableOpacity>

            {currentStep < STEPS.length - 1 ? (
              <TouchableOpacity
                style={styles.nextBtn}
                onPress={() => setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1))}
              >
                <Text style={styles.nextBtnText}>NEXT STEP →</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.submitBtn} onPress={submitProfile} disabled={saving}>
                <Text style={styles.submitBtnText}>{saving ? 'Submitting...' : 'SUBMIT PROFILE ✓'}</Text>
              </TouchableOpacity>
            )}
          </View>

          {currentStep > 0 && (
            <TouchableOpacity style={styles.prevBtn} onPress={() => setCurrentStep(prev => Math.max(prev - 1, 0))}>
              <Text style={styles.prevBtnText}>← Previous Step</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  centered: { flex: 1, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center' },

  header: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12,
    borderBottomWidth: 1, borderBottomColor: '#1A1A1A',
  },
  backBtn: { padding: 4, marginTop: 2 },
  backArrow: { fontSize: 22, color: Colors.white },
  pageTitle: { fontFamily: Fonts.heading, fontSize: 22, color: Colors.white, letterSpacing: 2 },
  pageSub: { fontFamily: Fonts.body, fontSize: 12, color: '#666', marginTop: 2 },

  // Steps
  stepsScroll: { paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#1A1A1A' },
  stepIndicator: { alignItems: 'center', marginRight: 20 },
  stepCircle: {
    width: 32, height: 32, borderRadius: 16,
    borderWidth: 2, borderColor: '#333',
    alignItems: 'center', justifyContent: 'center', marginBottom: 4,
  },
  stepCircleActive: { borderColor: Colors.red, backgroundColor: Colors.red },
  stepCircleDone: { borderColor: Colors.gold, backgroundColor: Colors.gold },
  stepNum: { fontFamily: Fonts.bodyMedium, fontSize: 13, color: '#555' },
  stepNumActive: { color: Colors.white },
  stepLabel: { fontFamily: Fonts.body, fontSize: 11, color: '#555', textAlign: 'center' },
  stepLabelActive: { color: Colors.red },

  // Form
  stepContent: { padding: 16 },
  stepHeading: { fontFamily: Fonts.heading, fontSize: 20, color: Colors.white, letterSpacing: 2, marginBottom: 4 },
  stepSub: { fontFamily: Fonts.body, fontSize: 13, color: '#666', marginBottom: 20 },
  sectionLabel: { fontFamily: Fonts.bodyMedium, fontSize: 11, color: Colors.gold, letterSpacing: 2, marginTop: 16, marginBottom: 10 },

  fieldLabel: { fontFamily: Fonts.bodyMedium, fontSize: 11, color: Colors.gold, letterSpacing: 2, marginBottom: 8, marginTop: 12 },
  input: {
    backgroundColor: BG3, borderRadius: 8, borderWidth: 1, borderColor: '#2A2A2A',
    paddingHorizontal: 14, paddingVertical: 12,
    fontFamily: Fonts.body, fontSize: 15, color: Colors.white,
  },
  inputDisabled: { opacity: 0.5 },
  textArea: { height: 100, textAlignVertical: 'top' },

  row: { flexDirection: 'row', gap: 12 },
  halfField: { flex: 1 },

  optionsRow: { marginBottom: 4 },
  optionChip: {
    paddingHorizontal: 14, paddingVertical: 8, marginRight: 8,
    borderRadius: 20, borderWidth: 1, borderColor: '#2A2A2A',
    backgroundColor: BG3,
  },
  optionChipActive: { borderColor: Colors.red, backgroundColor: 'rgba(200,32,42,0.15)' },
  optionChipText: { fontFamily: Fonts.bodyMedium, fontSize: 13, color: '#888' },
  optionChipTextActive: { color: Colors.red },

  tagsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },

  deptChip: {
    paddingHorizontal: 16, paddingVertical: 10,
    borderRadius: 8, borderWidth: 1, borderColor: '#2A2A2A',
    backgroundColor: BG3, minWidth: '45%', alignItems: 'center',
  },
  deptChipActive: { borderColor: Colors.gold, backgroundColor: 'rgba(212,166,74,0.12)' },
  deptChipText: { fontFamily: Fonts.bodyMedium, fontSize: 14, color: '#888' },
  deptChipTextActive: { color: Colors.gold },

  // Media step
  mediaPlaceholder: {
    alignItems: 'center', paddingVertical: 40,
    backgroundColor: BG2, borderRadius: 12, padding: 24,
    borderWidth: 1, borderColor: '#1A1A1A',
  },
  mediaEmoji: { fontSize: 48, marginBottom: 12 },
  mediaTitle: { fontFamily: Fonts.bodyMedium, fontSize: 18, color: Colors.white, marginBottom: 8 },
  mediaSub: { fontFamily: Fonts.body, fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 20 },
  mediaBtn: { borderWidth: 1, borderColor: Colors.gold, borderRadius: 8, paddingHorizontal: 24, paddingVertical: 10 },
  mediaBtnText: { fontFamily: Fonts.bodyMedium, fontSize: 14, color: Colors.gold },

  // Review step
  reviewBanner: {
    flexDirection: 'row', gap: 12, alignItems: 'flex-start',
    backgroundColor: 'rgba(212,166,74,0.08)',
    borderWidth: 1, borderColor: 'rgba(212,166,74,0.2)',
    borderRadius: 10, padding: 14, marginBottom: 16,
  },
  reviewBannerEmoji: { fontSize: 20 },
  reviewBannerInfo: { flex: 1 },
  reviewBannerTitle: { fontFamily: Fonts.bodyMedium, fontSize: 13, color: Colors.gold, letterSpacing: 1, marginBottom: 4 },
  reviewBannerSub: { fontFamily: Fonts.body, fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 18 },

  reviewRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#111',
  },
  reviewLabel: { fontFamily: Fonts.body, fontSize: 14, color: '#666' },
  reviewValue: { fontFamily: Fonts.bodyMedium, fontSize: 14, color: Colors.white, flex: 1, textAlign: 'right', marginLeft: 10 },

  tipRow: { flexDirection: 'row', gap: 12, alignItems: 'flex-start', marginBottom: 12 },
  tipEmoji: { fontSize: 20, width: 28 },
  tipTitle: { fontFamily: Fonts.bodyMedium, fontSize: 14, color: Colors.white, marginBottom: 2 },
  tipSub: { fontFamily: Fonts.body, fontSize: 12, color: '#666' },

  // Nav buttons
  navButtons: { flexDirection: 'row', gap: 12, paddingHorizontal: 16, marginTop: 8, marginBottom: 8 },
  draftBtn: {
    flex: 1, borderWidth: 1, borderColor: '#2A2A2A',
    borderRadius: 8, paddingVertical: 14, alignItems: 'center',
  },
  draftBtnText: { fontFamily: Fonts.bodySemiBold, fontSize: 14, color: '#888', letterSpacing: 1 },
  nextBtn: {
    flex: 2, backgroundColor: Colors.red,
    borderRadius: 8, paddingVertical: 14, alignItems: 'center',
  },
  nextBtnText: { fontFamily: Fonts.bodySemiBold, fontSize: 15, color: Colors.white, letterSpacing: 1 },
  submitBtn: {
    flex: 2, backgroundColor: Colors.gold,
    borderRadius: 8, paddingVertical: 14, alignItems: 'center',
  },
  submitBtnText: { fontFamily: Fonts.bodySemiBold, fontSize: 15, color: Colors.background, letterSpacing: 1 },
  prevBtn: { alignItems: 'center', paddingVertical: 12, marginBottom: 16 },
  prevBtnText: { fontFamily: Fonts.bodyMedium, fontSize: 14, color: '#666' },
});