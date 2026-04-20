import React, { useLayoutEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import useMessages from '../hooks/useMessages';
import MessageBubble from '../components/MessageBubble';
import ChatComposer from '../components/ChatComposer';

const ChatScreen = ({ route, navigation }) => {
  const { conversationId, title, receiverId } = route.params || {};
  const { messages, loading, sending, error, sendMessage } = useMessages(conversationId);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: title || 'Chat',
    });
  }, [navigation, title]);

  const handleSend = async (text) => {
    await sendMessage({ text, receiverId });
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
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {!!error && <Text style={styles.error}>{error}</Text>}

        <FlatList
          data={[...messages].reverse()}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <MessageBubble message={item} />}
          inverted
          contentContainerStyle={styles.listContent}
        />

        <ChatComposer onSend={handleSend} disabled={sending} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  listContent: {
    paddingVertical: 8,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    color: '#B91C1C',
    padding: 12,
  },
});

export default ChatScreen;