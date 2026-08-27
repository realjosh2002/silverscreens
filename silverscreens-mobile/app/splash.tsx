import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Dimensions, Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFonts, BebasNeue_400Regular } from '@expo-google-fonts/bebas-neue';
import {
  BarlowCondensed_400Regular,
  BarlowCondensed_500Medium,
} from '@expo-google-fonts/barlow-condensed';
import { getToken } from '../lib/auth';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();
  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [fontsLoaded] = useFonts({
    BebasNeue_400Regular,
    BarlowCondensed_400Regular,
    BarlowCondensed_500Medium,
  });

  useEffect(() => {
    if (!fontsLoaded) return;

    // Fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Progress bar animation
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 2500,
      useNativeDriver: false,
    }).start();

    // Navigate after 3 seconds
    const timer = setTimeout(async () => {
      const token = await getToken();
      if (token) {
        router.replace('/(tabs)/dashboard');
      } else {
        router.replace('/login');
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '60%'],
  });

  return (
    <View style={styles.container}>
      {/* Dark cinematic background */}
      <View style={styles.bg} />

      {/* Spotlight effect top left */}
      <View style={styles.spotlight} />

      {/* Floor reflection */}
      <View style={styles.floorReflection} />

      {/* Warm glow center */}
      <View style={styles.centerGlow} />

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>

        {/* Clapperboard */}
        <View style={styles.clapperWrapper}>
          {/* Clapperboard top (striped part) */}
          <View style={styles.clapperTop}>
            <View style={styles.stripesRow}>
              {Array.from({ length: 8 }).map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.stripe,
                    { backgroundColor: i % 2 === 0 ? '#D4A64A' : '#111' }
                  ]}
                />
              ))}
            </View>
          </View>

          {/* Clapperboard body */}
          <View style={styles.clapperBody}>
            {/* Top stripes on body */}
            <View style={styles.bodyStripes}>
              {Array.from({ length: 8 }).map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.bodyStripe,
                    { backgroundColor: i % 2 === 0 ? '#D4A64A' : '#111' }
                  ]}
                />
              ))}
            </View>

            {/* Logo text on clapperboard */}
            <View style={styles.logoArea}>
              <Text style={styles.logoText}>SILVER</Text>
              <Text style={styles.logoText}>SCREENS</Text>

              {/* Tagline with lines */}
              <View style={styles.taglineRow}>
                <View style={styles.taglineLine} />
                <Text style={styles.tagline}>WE MAKE CELEBRITIES</Text>
                <View style={styles.taglineLine} />
              </View>
            </View>
          </View>
        </View>

      </Animated.View>

      {/* Loading section */}
      <Animated.View style={[styles.loadingSection, { opacity: fadeAnim }]}>
        <Text style={styles.loadingText}>LOADING</Text>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressBar, { width: progressWidth }]} />
        </View>
      </Animated.View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Background layers
  bg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#050300',
  },
  spotlight: {
    position: 'absolute',
    top: -100,
    left: -80,
    width: 300,
    height: 500,
    borderRadius: 150,
    backgroundColor: 'rgba(180,120,20,0.08)',
    transform: [{ rotate: '20deg' }],
  },
  floorReflection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: 'rgba(180,120,10,0.04)',
  },
  centerGlow: {
    position: 'absolute',
    top: '30%',
    left: '20%',
    right: '20%',
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(212,166,74,0.05)',
  },

  content: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },

  // Clapperboard
  clapperWrapper: {
    width: width * 0.75,
    alignItems: 'center',
  },
  clapperTop: {
    width: '100%',
    height: 50,
    backgroundColor: '#111',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: -4,
    zIndex: 2,
    transform: [{ rotate: '-3deg' }],
    borderWidth: 2,
    borderColor: '#222',
  },
  stripesRow: {
    flex: 1,
    flexDirection: 'row',
  },
  stripe: {
    flex: 1,
    transform: [{ skewX: '-15deg' }],
  },
  clapperBody: {
    width: '100%',
    backgroundColor: '#0D0D0D',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#222',
    paddingBottom: 20,
  },
  bodyStripes: {
    height: 28,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  bodyStripe: {
    flex: 1,
    transform: [{ skewX: '-15deg' }],
  },
  logoArea: {
    padding: 24,
    alignItems: 'center',
  },
  logoText: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 56,
    color: '#D4A64A',
    letterSpacing: 4,
    lineHeight: 58,
    textShadowColor: 'rgba(212,166,74,0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  taglineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
  },
  taglineLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#D4A64A',
    opacity: 0.5,
  },
  tagline: {
    fontFamily: 'BarlowCondensed_500Medium',
    fontSize: 12,
    color: '#D4A64A',
    letterSpacing: 4,
  },

  // Loading
  loadingSection: {
    position: 'absolute',
    bottom: 60,
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 60,
  },
  loadingText: {
    fontFamily: 'BarlowCondensed_500Medium',
    fontSize: 13,
    color: '#D4A64A',
    letterSpacing: 6,
    marginBottom: 12,
  },
  progressTrack: {
    width: '100%',
    height: 2,
    backgroundColor: '#1A1A1A',
    borderRadius: 2,
  },
  progressBar: {
    height: 2,
    backgroundColor: '#D4A64A',
    borderRadius: 2,
  },
});