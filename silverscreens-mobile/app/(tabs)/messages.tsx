import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, KeyboardAvoidingView, Platform, ActivityIndicator,
  RefreshControl, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts, BebasNeue_400Regular } from '@expo-google-fonts/bebas-neue';
import {
  BarlowCondensed_400Regular,
  BarlowCondensed_500Medium,
  BarlowCondensed_600SemiBold,
} from '@expo-google-fonts/barlow-condensed';
import Toast from 'react-native-toast-message';

import { Colors, Fonts } from '../../constants/theme';
import { api } from '../../lib/api';
import { getUser, getToken } from '../../lib/auth';

const BG2 = '#0B0F14';
const BG3 = '#121821';
const BG4 = '#1C2030';

const BG_COLORS = ['#1A3A5C','#1A3A2C','#3D1515','#15153D','#2A1A3A','#0F2D2D','#3D0B0E'];

const CONV_TABS = ['All', 'Unread', 'Starred'];

interface Conversation {
  id: string;
  name: string;
  initials: string;
  avatarBg: string;
  preview: string;
  time: string;
  unread: number;
  starred: boolean;
}

interface Message {
  id: string;
  sender: 'me' | 'them';
  text: string;
  time: string;
  delivered: boolean;
}

export default function MessagesScreen() {
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [convTab, setConvTab] = useState(0);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const [fontsLoaded] = useFonts({
    BebasNeue_400Regular,
    BarlowCondensed_400Regular,
    BarlowCondensed_500Medium,
    BarlowCondensed_600SemiBold,
  });

  useEffect(() => {
    loadUser();
    loadConversations(true);
  }, []);

  useEffect(() => {
    if (!activeConv) return;
    loadMessages(activeConv.id);
    const poll = setInterval(() => loadMessages(activeConv.id), 5000);
    return () => clearInterval(poll);
  }, [activeConv?.id]);

  const loadUser = async () => {
    const user = await getUser();
    if (user) setCurrentUserId(user.id);
  };

  const loadConversations = async (initial = false) => {
    try {
      const res = await api.get('/api/messages/conversations');
      const list = res.data?.data?.conversations ?? res.data?.conversations ?? [];
      const mapped: Conversation[] = list.map((c: any, i: number) => {
        const other = c.otherParty ?? c.participant ?? {};
        const name = other.name ?? c.name ?? `Conversation ${i + 1}`;
        const initials = name.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase();
        return {
          id: String(c.id ?? i),
          name,
          initials,
          avatarBg: BG_COLORS[i % BG_COLORS.length],
          preview: c.lastMessage?.content ?? c.preview ?? '',
          time: c.lastMessageAt
            ? new Date(c.lastMessageAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
            : '',
          unread: c.unreadCount ?? 0,
          starred: c.starred ?? false,
        };
      });
      setConversations(mapped);
    } catch {
      Toast.show({ type: 'error', text1: 'Failed to load conversations' });
    } finally {
      setLoadingConvs(false);
      setRefreshing(false);
    }
  };

  const loadMessages = async (convId: string, initial = false) => {
    if (initial) setLoadingMsgs(true);
    try {
      const res = await api.get(`/api/messages/${convId}`);
      const list = res.data?.data?.messages ?? res.data?.messages ?? [];
      const mapped: Message[] = list.map((m: any, i: number) => {
        const isOwn = m.isOwn !== undefined ? m.isOwn : m.sender_id === currentUserId;
        return {
          id: String(m.id ?? i),
          sender: isOwn ? 'me' : 'them',
          text: m.content ?? m.text ?? '',
          time: m.sent_at
            ? new Date(m.sent_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
            : '',
          delivered: m.is_read ?? false,
        };
      });
      setMessages(mapped);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: false }), 100);
    } catch {} finally {
      setLoadingMsgs(false);
    }
  };

  const handleSend = async () => {
    if (!messageText.trim() || !activeConv) return;
    const text = messageText.trim();
    setMessageText('');

    const optimistic: Message = {
      id: `opt_${Date.now()}`, sender: 'me', text,
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      delivered: false,
    };
    setMessages(prev => [...prev, optimistic]);
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);

    try {
      await api.post('/api/messages/send', {
        conversationId: activeConv.id, content: text,
      });
      setMessages(prev => prev.map(m =>
        m.id === optimistic.id ? { ...m, delivered: true } : m
      ));
    } catch {
      Toast.show({ type: 'error', text1: 'Failed to send message' });
    }
  };

  const openConversation = (conv: Conversation) => {
    setActiveConv(conv);
    setConversations(prev => prev.map(c =>
      c.id === conv.id ? { ...c, unread: 0 } : c
    ));
    api.put(`/api/messages/${conv.id}`).catch(() => {});
  };

  if (!fontsLoaded) return null;

  const filtered = conversations.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (convTab === 1) return matchSearch && c.unread > 0;
    if (convTab === 2) return matchSearch && c.starred;
    return matchSearch;
  });

  // ── CHAT VIEW ──
  if (activeConv) {
    return (
      <SafeAreaView style={styles.safe}>
        {/* Chat header */}
        <View style={styles.chatHeader}>
          <TouchableOpacity onPress={() => setActiveConv(null)} style={styles.backBtn}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <View style={[styles.convAvatar, { backgroundColor: activeConv.avatarBg }]}>
            <Text style={styles.convInitials}>{activeConv.initials}</Text>
          </View>
          <View style={styles.chatHeaderInfo}>
            <Text style={styles.chatHeaderName}>{activeConv.name}</Text>
            <Text style={styles.chatHeaderSub}>Agency</Text>
          </View>
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={0}
        >
          {/* Messages */}
          {loadingMsgs ? (
            <ActivityIndicator color={Colors.gold} style={{ marginTop: 40 }} />
          ) : (
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={m => m.id}
              contentContainerStyle={styles.messagesList}
              onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
              ListEmptyComponent={
                <View style={styles.emptyChat}>
                  <Text style={styles.emptyChatText}>No messages yet. Say hello!</Text>
                </View>
              }
              renderItem={({ item: msg }) => (
                <View style={[
                  styles.msgRow,
                  msg.sender === 'me' ? styles.msgRowMe : styles.msgRowThem,
                ]}>
                  {msg.sender === 'them' && (
                    <View style={[styles.msgAvatar, { backgroundColor: activeConv.avatarBg }]}>
                      <Text style={styles.msgAvatarText}>{activeConv.initials}</Text>
                    </View>
                  )}
                  <View style={[
                    styles.bubble,
                    msg.sender === 'me' ? styles.bubbleMe : styles.bubbleThem,
                  ]}>
                    <Text style={styles.bubbleText}>{msg.text}</Text>
                    <Text style={styles.bubbleTime}>
                      {msg.time}{msg.sender === 'me' ? (msg.delivered ? ' ✓✓' : ' ✓') : ''}
                    </Text>
                  </View>
                </View>
              )}
            />
          )}

          {/* Input */}
          <View style={styles.inputBar}>
            <TextInput
              style={styles.textInput}
              value={messageText}
              onChangeText={setMessageText}
              placeholder={`Message ${activeConv.name}…`}
              placeholderTextColor="#444"
              multiline
            />
            <TouchableOpacity
              style={[styles.sendBtn, messageText.trim() && styles.sendBtnActive]}
              onPress={handleSend}
            >
              <Text style={styles.sendBtnText}>➤</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // ── CONVERSATION LIST VIEW ──
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>MY MESSAGES</Text>
        <Text style={styles.pageSub}>All your conversations in one place</Text>
      </View>

      {/* Search */}
      <View style={styles.searchRow}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search messages..."
          placeholderTextColor="#444"
        />
      </View>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        {CONV_TABS.map((tab, i) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, convTab === i && styles.tabActive]}
            onPress={() => setConvTab(i)}
          >
            <Text style={[styles.tabText, convTab === i && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loadingConvs ? (
        <ActivityIndicator color={Colors.gold} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={c => c.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadConversations(); }} tintColor={Colors.gold} />}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Text style={styles.emptyEmoji}>💬</Text>
              <Text style={styles.emptyTitle}>No conversations yet</Text>
              <Text style={styles.emptySub}>When an agency messages you, it will appear here.</Text>
            </View>
          }
          renderItem={({ item: conv }) => (
            <TouchableOpacity
              style={styles.convItem}
              onPress={() => openConversation(conv)}
              activeOpacity={0.75}
            >
              <View style={[styles.convAvatar, { backgroundColor: conv.avatarBg }]}>
                <Text style={styles.convInitials}>{conv.initials}</Text>
              </View>
              <View style={styles.convInfo}>
                <View style={styles.convTopRow}>
                  <Text style={[styles.convName, conv.unread > 0 && { color: Colors.white, fontWeight: '700' }]}>
                    {conv.name}
                  </Text>
                  <Text style={styles.convTime}>{conv.time}</Text>
                </View>
                <View style={styles.convBottomRow}>
                  <Text style={styles.convPreview} numberOfLines={1}>{conv.preview}</Text>
                  {conv.unread > 0 && (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadText}>{conv.unread}</Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },

  header: {
    paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12,
    borderBottomWidth: 1, borderBottomColor: '#1A1A1A',
  },
  pageTitle: { fontFamily: Fonts.heading, fontSize: 28, color: Colors.white, letterSpacing: 3 },
  pageSub: { fontFamily: Fonts.body, fontSize: 14, color: '#666', marginTop: 2 },

  searchRow: {
    flexDirection: 'row', alignItems: 'center',
    margin: 12, backgroundColor: BG3,
    borderRadius: 10, paddingHorizontal: 12,
    borderWidth: 1, borderColor: '#1A1A1A',
  },
  searchIcon: { fontSize: 14, marginRight: 8 },
  searchInput: {
    flex: 1, fontFamily: Fonts.body, fontSize: 15,
    color: Colors.white, paddingVertical: 10,
  },

  tabsRow: {
    flexDirection: 'row',
    borderBottomWidth: 1, borderBottomColor: '#1A1A1A',
    paddingHorizontal: 16,
  },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: Colors.red },
  tabText: { fontFamily: Fonts.bodyMedium, fontSize: 15, color: '#666' },
  tabTextActive: { color: Colors.white, fontWeight: '700' },

  convItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: '#111',
  },
  convAvatar: {
    width: 46, height: 46, borderRadius: 23,
    alignItems: 'center', justifyContent: 'center',
  },
  convInitials: { fontFamily: Fonts.heading, fontSize: 18, color: Colors.white },
  convInfo: { flex: 1 },
  convTopRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  convName: { fontFamily: Fonts.bodyMedium, fontSize: 15, color: '#aaa' },
  convTime: { fontFamily: Fonts.body, fontSize: 13, color: '#555' },
  convBottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  convPreview: { fontFamily: Fonts.body, fontSize: 14, color: '#555', flex: 1 },
  unreadBadge: {
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: Colors.red,
    alignItems: 'center', justifyContent: 'center', marginLeft: 8,
  },
  unreadText: { fontFamily: Fonts.bodyMedium, fontSize: 11, color: Colors.white },

  emptyBox: { alignItems: 'center', paddingVertical: 60 },
  emptyEmoji: { fontSize: 40, marginBottom: 12 },
  emptyTitle: { fontFamily: Fonts.bodyMedium, fontSize: 16, color: '#888', marginBottom: 4 },
  emptySub: { fontFamily: Fonts.body, fontSize: 14, color: '#555', textAlign: 'center', paddingHorizontal: 32 },

  // Chat view
  chatHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: '#1A1A1A',
    backgroundColor: BG2,
  },
  backBtn: { padding: 4 },
  backArrow: { fontSize: 22, color: Colors.white },
  chatHeaderInfo: { flex: 1 },
  chatHeaderName: { fontFamily: Fonts.bodySemiBold, fontSize: 16, color: Colors.white },
  chatHeaderSub: { fontFamily: Fonts.body, fontSize: 13, color: '#666' },

  messagesList: { padding: 16, gap: 8 },
  emptyChat: { alignItems: 'center', paddingTop: 60 },
  emptyChatText: { fontFamily: Fonts.body, fontSize: 14, color: '#555' },

  msgRow: { flexDirection: 'row', marginBottom: 8, alignItems: 'flex-end' },
  msgRowMe: { justifyContent: 'flex-end' },
  msgRowThem: { justifyContent: 'flex-start' },
  msgAvatar: {
    width: 28, height: 28, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center', marginRight: 8,
  },
  msgAvatarText: { fontFamily: Fonts.heading, fontSize: 12, color: Colors.white },

  bubble: { maxWidth: '72%', borderRadius: 16, padding: 10 },
  bubbleMe: { backgroundColor: Colors.red, borderBottomRightRadius: 4 },
  bubbleThem: { backgroundColor: BG3, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: '#1A1A1A' },
  bubbleText: { fontFamily: Fonts.body, fontSize: 15, color: Colors.white, lineHeight: 20 },
  bubbleTime: { fontFamily: Fonts.body, fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 4, textAlign: 'right' },

  inputBar: {
    flexDirection: 'row', alignItems: 'flex-end', gap: 10,
    padding: 12, borderTopWidth: 1, borderTopColor: '#1A1A1A',
    backgroundColor: BG2,
  },
  textInput: {
    flex: 1, fontFamily: Fonts.body, fontSize: 15, color: Colors.white,
    backgroundColor: BG3, borderRadius: 20, paddingHorizontal: 16,
    paddingVertical: 10, maxHeight: 100,
    borderWidth: 1, borderColor: '#1A1A1A',
  },
  sendBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#222', alignItems: 'center', justifyContent: 'center',
  },
  sendBtnActive: { backgroundColor: Colors.red },
  sendBtnText: { fontSize: 16, color: Colors.white },
});