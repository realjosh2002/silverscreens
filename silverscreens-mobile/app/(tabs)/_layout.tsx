import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';

const RED = '#C8202A';
const GOLD = '#D4A64A';

function TabIcon({ label, focused, emoji }: { label: string; focused: boolean; emoji: string }) {
  return (
    <View style={s.wrap}>
      <Text style={[s.emoji, { opacity: focused ? 1 : 0.4 }]}>{emoji}</Text>
      <Text style={[s.label, focused && s.labelActive]}>{label}</Text>
      {focused && <View style={s.underline} />}
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', paddingTop: 6, width: 70, position: 'relative' },
  emoji: { fontSize: 20, marginBottom: 3 },
  label: { fontSize: 10, color: '#555', letterSpacing: 0.3 },
  labelActive: { color: RED, fontWeight: '700' },
  underline: { position: 'absolute', bottom: -8, left: 10, right: 10, height: 2, backgroundColor: RED, borderRadius: 1 },
});

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0A0A0A',
          borderTopColor: '#1A1A1A',
          borderTopWidth: 1,
          height: 68,
          paddingBottom: 10,
          paddingTop: 6,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{ tabBarIcon: ({ focused }) => <TabIcon label="Dashboard" focused={focused} emoji="⊞" /> }}
      />
      <Tabs.Screen
        name="applications"
        options={{ tabBarIcon: ({ focused }) => <TabIcon label="Applications" focused={focused} emoji="📋" /> }}
      />
      <Tabs.Screen
        name="auditions"
        options={{ tabBarIcon: ({ focused }) => <TabIcon label="Auditions" focused={focused} emoji="📅" /> }}
      />
      <Tabs.Screen
        name="messages"
        options={{ tabBarIcon: ({ focused }) => <TabIcon label="Messages" focused={focused} emoji="💬" /> }}
      />
      <Tabs.Screen
        name="notifications"
        options={{ tabBarIcon: ({ focused }) => <TabIcon label="Notifications" focused={focused} emoji="🔔" /> }}
      />
    </Tabs>
  );
}