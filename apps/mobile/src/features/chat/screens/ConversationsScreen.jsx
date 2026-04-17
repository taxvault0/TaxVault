import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import useConversations from '../hooks/useConversations';
import ConversationCard from '../components/ConversationCard';

const ConversationsScreen = ({ navigation }) => {
  const { conversations, loading, refreshing, error, reload } = useConversations();

  const openConversation = (conversation) => {
    navigation.navigate('ChatScreen', {
      conversationId: conversation.id,
      title: conversation.title,
      receiverId: conversation.otherParticipantId,
    });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {!!error && <Text style={styles.error}>{error}</Text>}

      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ConversationCard item={item} onPress={openConversation} />
        )}
        onRefresh={() => reload({ silent: true })}
        refreshing={refreshing}
        contentContainerStyle={conversations.length === 0 ? styles.emptyContainer : undefined}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyTitle}>No conversations yet</Text>
            <Text style={styles.emptyText}>
              Once a CA or user starts messaging, it will appear here.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyContainer: {
    flexGrow: 1,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  error: {
    color: '#B91C1C',
    padding: 12,
  },
});

export default ConversationsScreen;