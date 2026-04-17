import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { caMessages } from '@/features/ca/config/caMockData';
import { formatAccountType } from '@/features/ca/utils/caFormatters';

const seedMessages = [
  {
    id: 'chat-001',
    sender: 'client',
    text: 'Hello, I uploaded the documents you requested.',
    time: '9:10 AM',
  },
  {
    id: 'chat-002',
    sender: 'ca',
    text: 'Thank you. I am reviewing them now.',
    time: '9:14 AM',
  },
  {
    id: 'chat-003',
    sender: 'client',
    text: 'Please let me know if anything is still missing.',
    time: '9:16 AM',
  },
];

const CAChatScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const clientId = route?.params?.clientId;
  const clientName = route?.params?.clientName || 'Client';
  const accountType = route?.params?.accountType || 'single';

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(seedMessages);

  const threadSummary = useMemo(() => {
    return (
      caMessages.find((item) => item.clientName === clientName) || {
        unreadCount: 0,
        priority: 'medium',
      }
    );
  }, [clientName]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const newMessage = {
      id: `chat-${Date.now()}`,
      sender: 'ca',
      text: trimmed,
      time: 'Now',
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput('');
  };

  const quickReplies = [
    'Please upload the missing document.',
    'Your file is under review.',
    'Let us schedule a consultation.',
  ];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          activeOpacity={0.85}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={22} color="#111827" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{clientName}</Text>
          <Text style={styles.headerSubtitle}>
            {formatAccountType(accountType)} • Client chat
          </Text>
        </View>

        <TouchableOpacity
          style={styles.headerButton}
          activeOpacity={0.85}
          onPress={() =>
            navigation.navigate('ClientDetail', {
              clientId,
            })
          }
        >
          <Icon name="account-details-outline" size={22} color="#111827" />
        </TouchableOpacity>
      </View>

      <View style={styles.summaryCard}>
        <View>
          <Text style={styles.summaryTitle}>Conversation Status</Text>
          <Text style={styles.summaryText}>
            Priority: {String(threadSummary.priority || 'medium').toUpperCase()}
          </Text>
        </View>

        <View style={styles.unreadBadge}>
          <Text style={styles.unreadText}>{threadSummary.unreadCount || 0} unread</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message) => {
          const isCA = message.sender === 'ca';

          return (
            <View
              key={message.id}
              style={[styles.messageRow, isCA ? styles.messageRowRight : styles.messageRowLeft]}
            >
              <View style={[styles.messageBubble, isCA ? styles.caBubble : styles.clientBubble]}>
                <Text style={[styles.messageText, isCA && styles.caMessageText]}>
                  {message.text}
                </Text>
                <Text style={[styles.messageTime, isCA && styles.caMessageTime]}>
                  {message.time}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.quickReplyRow}>
        {quickReplies.map((reply) => (
          <TouchableOpacity
            key={reply}
            style={styles.quickReplyChip}
            activeOpacity={0.85}
            onPress={() => setInput(reply)}
          >
            <Text style={styles.quickReplyText} numberOfLines={1}>
              {reply}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.inputWrap}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Type a message..."
          placeholderTextColor="#9CA3AF"
          style={styles.input}
          multiline
        />

        <TouchableOpacity style={styles.sendButton} activeOpacity={0.88} onPress={handleSend}>
          <Icon name="send" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default CAChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    paddingHorizontal: 12,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
  },
  headerSubtitle: {
    marginTop: 3,
    fontSize: 13,
    color: '#6B7280',
  },
  summaryCard: {
    margin: 16,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
  },
  summaryText: {
    marginTop: 4,
    fontSize: 13,
    color: '#6B7280',
  },
  unreadBadge: {
    backgroundColor: '#DBEAFE',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  unreadText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1D4ED8',
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  messageRow: {
    marginBottom: 12,
    flexDirection: 'row',
  },
  messageRowLeft: {
    justifyContent: 'flex-start',
  },
  messageRowRight: {
    justifyContent: 'flex-end',
  },
  messageBubble: {
    maxWidth: '78%',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  clientBubble: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  caBubble: {
    backgroundColor: '#2563EB',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#111827',
  },
  caMessageText: {
    color: '#FFFFFF',
  },
  messageTime: {
    marginTop: 6,
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '700',
  },
  caMessageTime: {
    color: '#DBEAFE',
  },
  quickReplyRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  quickReplyChip: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  quickReplyText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#374151',
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    paddingTop: 8,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  input: {
    flex: 1,
    minHeight: 48,
    maxHeight: 110,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#111827',
    marginRight: 10,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
});


