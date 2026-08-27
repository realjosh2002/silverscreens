import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, RefreshControl,
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

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const EVENT_COLORS: Record<string, string> = {
  audition:  '#22C55E',
  callback:  '#D4A64A',
  workshop:  '#A78BFA',
  meeting:   '#60A5FA',
  important: '#F87171',
};

const FILTER_TYPES = [
  { key: 'audition',  label: 'Audition',       color: '#22C55E' },
  { key: 'callback',  label: 'Callback',        color: '#D4A64A' },
  { key: 'workshop',  label: 'Workshop / Class',color: '#A78BFA' },
  { key: 'meeting',   label: 'Meeting / Other', color: '#60A5FA' },
  { key: 'important', label: 'Important',       color: '#F87171' },
];

interface CalEvent {
  id: string;
  title: string;
  type: string;
  date: Date;
  time: string;
  location?: string;
}

export default function CalendarScreen() {
  const router = useRouter();
  const [today] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState<CalEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, boolean>>({
    audition: true, callback: true, workshop: true, meeting: true, important: true,
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'list'>('month');

  const [fontsLoaded] = useFonts({
    BebasNeue_400Regular,
    BarlowCondensed_400Regular,
    BarlowCondensed_500Medium,
    BarlowCondensed_600SemiBold,
  });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const user = await getUser();
      if (!user) { router.replace('/login'); return; }
      const res = await api.get('/api/auditions?limit=100');
      const list = res.data?.data?.auditions ?? res.data?.auditions ?? [];
      const mapped: CalEvent[] = list.map((a: any) => ({
        id:       String(a.id),
        title:    a.casting_calls?.title ?? 'Audition',
        type:     'audition',
        date:     a.scheduled_at ? new Date(a.scheduled_at) : new Date(),
        time:     a.scheduled_at
          ? new Date(a.scheduled_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
          : '',
        location: a.venue_details ?? '',
      }));
      setEvents(mapped);
    } catch (err: any) {
      if (err?.response?.status === 401) { await clearAuth(); router.replace('/login'); }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  if (!fontsLoaded) return null;

  // Calendar grid
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const calDays: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (calDays.length % 7 !== 0) calDays.push(null);

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));
  const goToday  = () => { setCurrentMonth(new Date()); setSelectedDate(today); };

  const getEventsForDay = (day: number) => {
    return events.filter(e => {
      const d = e.date;
      return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day && activeFilters[e.type];
    });
  };

  const upcomingEvents = events
    .filter(e => e.date >= today && activeFilters[e.type])
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5);

  const selectedDayEvents = selectedDate
    ? events.filter(e => {
        const d = e.date;
        return d.getFullYear() === selectedDate.getFullYear()
          && d.getMonth() === selectedDate.getMonth()
          && d.getDate() === selectedDate.getDate()
          && activeFilters[e.type];
      })
    : [];

  const isToday = (day: number) =>
    today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;

  const isSelected = (day: number) =>
    selectedDate?.getFullYear() === year && selectedDate?.getMonth() === month && selectedDate?.getDate() === day;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.pageTitle}>MY CALENDAR</Text>
        <View style={styles.viewToggle}>
          <TouchableOpacity
            style={[styles.viewBtn, viewMode === 'month' && styles.viewBtnActive]}
            onPress={() => setViewMode('month')}
          >
            <Text style={[styles.viewBtnText, viewMode === 'month' && styles.viewBtnTextActive]}>Month</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.viewBtn, viewMode === 'list' && styles.viewBtnActive]}
            onPress={() => setViewMode('list')}
          >
            <Text style={[styles.viewBtnText, viewMode === 'list' && styles.viewBtnTextActive]}>List</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadData(); }} tintColor={Colors.gold} />}
      >
        {viewMode === 'month' ? (
          <>
            {/* Month navigation */}
            <View style={styles.monthNav}>
              <TouchableOpacity onPress={prevMonth} style={styles.navBtn}>
                <Text style={styles.navBtnText}>‹</Text>
              </TouchableOpacity>
              <View style={styles.monthCenter}>
                <Text style={styles.monthTitle}>
                  {MONTHS[month].toUpperCase()} {year}
                </Text>
                <TouchableOpacity onPress={goToday} style={styles.todayBtn}>
                  <Text style={styles.todayBtnText}>Today</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={nextMonth} style={styles.navBtn}>
                <Text style={styles.navBtnText}>›</Text>
              </TouchableOpacity>
            </View>

            {/* Day headers */}
            <View style={styles.dayHeaders}>
              {DAYS.map(d => (
                <Text key={d} style={styles.dayHeader}>{d}</Text>
              ))}
            </View>

            {/* Calendar grid */}
            <View style={styles.calGrid}>
              {Array.from({ length: calDays.length / 7 }, (_, week) => (
                <View key={week} style={styles.calRow}>
                  {calDays.slice(week * 7, week * 7 + 7).map((day, i) => {
                    const dayEvents = day ? getEventsForDay(day) : [];
                    return (
                      <TouchableOpacity
                        key={i}
                        style={[
                          styles.calCell,
                          isToday(day!) && styles.calCellToday,
                          isSelected(day!) && styles.calCellSelected,
                        ]}
                        onPress={() => day && setSelectedDate(new Date(year, month, day))}
                        disabled={!day}
                      >
                        {day ? (
                          <>
                            <Text style={[
                              styles.calDayNum,
                              isToday(day) && styles.calDayNumToday,
                              isSelected(day) && styles.calDayNumSelected,
                            ]}>{day}</Text>
                            <View style={styles.eventDots}>
                              {dayEvents.slice(0, 2).map((e, ei) => (
                                <View
                                  key={ei}
                                  style={[styles.eventDot, { backgroundColor: EVENT_COLORS[e.type] ?? Colors.gold }]}
                                />
                              ))}
                            </View>
                          </>
                        ) : null}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ))}
            </View>

            {/* Legend */}
            <View style={styles.legend}>
              {FILTER_TYPES.map(t => (
                <View key={t.key} style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: t.color }]} />
                  <Text style={styles.legendText}>{t.label}</Text>
                </View>
              ))}
            </View>

            {/* Selected day events */}
            {selectedDate && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  {selectedDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                </Text>
                {selectedDayEvents.length === 0 ? (
                  <Text style={styles.emptyText}>No events on this day.</Text>
                ) : selectedDayEvents.map(e => (
                  <View key={e.id} style={styles.eventCard}>
                    <View style={[styles.eventDotLarge, { backgroundColor: EVENT_COLORS[e.type] }]} />
                    <View style={styles.eventInfo}>
                      <Text style={styles.eventTitle}>{e.title}</Text>
                      <Text style={styles.eventMeta}>{e.time}{e.location ? ` • ${e.location}` : ''}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </>
        ) : (
          /* List view */
          <View style={styles.listView}>
            <Text style={styles.listViewTitle}>UPCOMING EVENTS</Text>
            {loading ? (
              <ActivityIndicator color={Colors.gold} />
            ) : upcomingEvents.length === 0 ? (
              <View style={styles.emptyBox}>
                <Text style={styles.emptyEmoji}>📅</Text>
                <Text style={styles.emptyTitle}>No Upcoming Events</Text>
                <Text style={styles.emptySubText}>Apply to casting calls to get audition invites.</Text>
              </View>
            ) : upcomingEvents.map(e => (
              <View key={e.id} style={styles.eventCard}>
                <View style={styles.eventDateBox}>
                  <Text style={styles.eventDateDay}>{e.date.getDate()}</Text>
                  <Text style={styles.eventDateMonth}>{MONTHS[e.date.getMonth()].slice(0, 3).toUpperCase()}</Text>
                </View>
                <View style={[styles.eventTypeLine, { backgroundColor: EVENT_COLORS[e.type] }]} />
                <View style={styles.eventInfo}>
                  <Text style={styles.eventTitle}>{e.title}</Text>
                  <Text style={styles.eventMeta}>{e.time}{e.location ? ` • ${e.location}` : ''}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Filters */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Calendar Filters</Text>
            <TouchableOpacity onPress={() => setActiveFilters({ audition: true, callback: true, workshop: true, meeting: true, important: true })}>
              <Text style={styles.clearAllText}>Clear All</Text>
            </TouchableOpacity>
          </View>
          {FILTER_TYPES.map(ft => (
            <TouchableOpacity
              key={ft.key}
              style={styles.filterRow}
              onPress={() => setActiveFilters(prev => ({ ...prev, [ft.key]: !prev[ft.key] }))}
            >
              <View style={[styles.filterCheck, { borderColor: ft.color, backgroundColor: activeFilters[ft.key] ? ft.color : 'transparent' }]}>
                {activeFilters[ft.key] && <Text style={styles.checkMark}>✓</Text>}
              </View>
              <Text style={styles.filterLabel}>{ft.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Enable Reminders */}
        <View style={styles.reminderBanner}>
          <Text style={styles.reminderEmoji}>🔔</Text>
          <View style={styles.reminderInfo}>
            <Text style={styles.reminderTitle}>Never Miss an Opportunity</Text>
            <Text style={styles.reminderSub}>Enable calendar reminders and get notified before your important events.</Text>
          </View>
          <TouchableOpacity style={styles.reminderBtn}>
            <Text style={styles.reminderBtnText}>🔔 Enable</Text>
          </TouchableOpacity>
        </View>

        {/* Need Help */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Need Help?</Text>
          <Text style={styles.helpSub}>Sync your calendar or learn how to manage your schedule.</Text>
          <TouchableOpacity style={styles.helpBtn} onPress={() => router.push('/support' as any)}>
            <Text style={styles.helpBtnText}>Visit Help Center →</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },

  header: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12,
    borderBottomWidth: 1, borderBottomColor: '#1A1A1A',
  },
  backBtn: { padding: 4 },
  backArrow: { fontSize: 22, color: Colors.white },
  pageTitle: { fontFamily: Fonts.heading, fontSize: 24, color: Colors.white, letterSpacing: 3, flex: 1 },

  viewToggle: { flexDirection: 'row', backgroundColor: BG3, borderRadius: 8, padding: 2 },
  viewBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  viewBtnActive: { backgroundColor: Colors.gold },
  viewBtnText: { fontFamily: Fonts.bodyMedium, fontSize: 13, color: '#666' },
  viewBtnTextActive: { color: Colors.background },

  // Month nav
  monthNav: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
  },
  navBtn: { padding: 8 },
  navBtnText: { fontSize: 24, color: Colors.white },
  monthCenter: { alignItems: 'center', gap: 4 },
  monthTitle: { fontFamily: Fonts.heading, fontSize: 20, color: Colors.white, letterSpacing: 2 },
  todayBtn: {
    backgroundColor: Colors.gold, borderRadius: 6,
    paddingHorizontal: 12, paddingVertical: 4,
  },
  todayBtnText: { fontFamily: Fonts.bodyMedium, fontSize: 12, color: Colors.background },

  // Calendar
  dayHeaders: { flexDirection: 'row', paddingHorizontal: 8, marginBottom: 4 },
  dayHeader: {
    flex: 1, textAlign: 'center',
    fontFamily: Fonts.bodyMedium, fontSize: 12, color: '#555',
  },
  calGrid: { paddingHorizontal: 8 },
  calRow: { flexDirection: 'row' },
  calCell: {
    flex: 1, aspectRatio: 1, padding: 4,
    alignItems: 'center', justifyContent: 'flex-start',
    borderWidth: 0.5, borderColor: '#111',
  },
  calCellToday: { backgroundColor: 'rgba(212,166,74,0.1)' },
  calCellSelected: { backgroundColor: 'rgba(200,32,42,0.15)' },
  calDayNum: { fontFamily: Fonts.body, fontSize: 13, color: '#888' },
  calDayNumToday: { color: Colors.gold, fontWeight: '700' },
  calDayNumSelected: { color: Colors.red, fontWeight: '700' },
  eventDots: { flexDirection: 'row', gap: 2, marginTop: 2 },
  eventDot: { width: 5, height: 5, borderRadius: 3 },

  // Legend
  legend: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 12,
    paddingHorizontal: 16, paddingVertical: 12,
    borderTopWidth: 1, borderTopColor: '#1A1A1A',
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontFamily: Fonts.body, fontSize: 12, color: '#888' },

  // Events
  section: {
    marginHorizontal: 16, marginBottom: 12,
    backgroundColor: BG2, borderRadius: 12, padding: 16,
    borderWidth: 1, borderColor: '#1A1A1A',
  },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontFamily: Fonts.bodySemiBold, fontSize: 16, color: Colors.white, marginBottom: 12 },
  clearAllText: { fontFamily: Fonts.bodyMedium, fontSize: 13, color: Colors.gold },
  emptyText: { fontFamily: Fonts.body, fontSize: 14, color: '#555', textAlign: 'center', paddingVertical: 12 },

  eventCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    marginBottom: 10, padding: 10, backgroundColor: BG3,
    borderRadius: 8, borderWidth: 1, borderColor: '#1A1A1A',
  },
  eventDotLarge: { width: 10, height: 10, borderRadius: 5 },
  eventInfo: { flex: 1 },
  eventTitle: { fontFamily: Fonts.bodyMedium, fontSize: 14, color: Colors.white, marginBottom: 2 },
  eventMeta: { fontFamily: Fonts.body, fontSize: 13, color: '#666' },

  // List view
  listView: { paddingHorizontal: 16, paddingTop: 16 },
  listViewTitle: { fontFamily: Fonts.heading, fontSize: 20, color: Colors.white, letterSpacing: 2, marginBottom: 12 },
  eventDateBox: { alignItems: 'center', width: 40 },
  eventDateDay: { fontFamily: Fonts.heading, fontSize: 22, color: Colors.white, lineHeight: 24 },
  eventDateMonth: { fontFamily: Fonts.body, fontSize: 11, color: '#666' },
  eventTypeLine: { width: 3, height: '100%', borderRadius: 2, minHeight: 40 },

  emptyBox: { alignItems: 'center', paddingVertical: 40 },
  emptyEmoji: { fontSize: 36, marginBottom: 10 },
  emptyTitle: { fontFamily: Fonts.bodyMedium, fontSize: 16, color: '#888', marginBottom: 4 },
  emptySubText: { fontFamily: Fonts.body, fontSize: 14, color: '#555', textAlign: 'center' },

  // Filters
  filterRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#111' },
  filterCheck: {
    width: 20, height: 20, borderRadius: 4, borderWidth: 2,
    alignItems: 'center', justifyContent: 'center',
  },
  checkMark: { fontSize: 12, color: Colors.white, fontWeight: '800' },
  filterLabel: { fontFamily: Fonts.bodyMedium, fontSize: 15, color: Colors.white },

  // Reminders
  reminderBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    marginHorizontal: 16, marginBottom: 12, padding: 14,
    backgroundColor: 'rgba(212,166,74,0.08)',
    borderWidth: 1, borderColor: 'rgba(212,166,74,0.2)',
    borderRadius: 12,
  },
  reminderEmoji: { fontSize: 24 },
  reminderInfo: { flex: 1 },
  reminderTitle: { fontFamily: Fonts.bodyMedium, fontSize: 15, color: Colors.white, marginBottom: 2 },
  reminderSub: { fontFamily: Fonts.body, fontSize: 12, color: '#666' },
  reminderBtn: {
    backgroundColor: 'rgba(212,166,74,0.15)',
    borderWidth: 1, borderColor: Colors.gold,
    borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8,
  },
  reminderBtnText: { fontFamily: Fonts.bodyMedium, fontSize: 13, color: Colors.gold },

  helpSub: { fontFamily: Fonts.body, fontSize: 14, color: '#666', marginBottom: 10 },
  helpBtn: {},
  helpBtnText: { fontFamily: Fonts.bodyMedium, fontSize: 14, color: Colors.gold },
});