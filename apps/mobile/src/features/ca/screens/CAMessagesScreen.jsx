import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import MessageThreadCard from '@/features/ca/components/MessageThreadCard';
import { caMessages } from '@/features/ca/config/caMockData';

const CAMessagesScreen = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Messages</Text>
        <Text style={styles.subtitle}>
          Review active conversations, urgent follow-ups, and client questions across single and household accounts.
        </Text>

        <View style={styles.listWrap}>
          {caMessages.map((thread) => (
            <MessageThreadCard key={thread.id} thread={thread} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 16,
    paddingBottom: 28,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 21,
  },
  listWrap: {
    marginTop: 18,
  },
});

export default CAMessagesScreen;


