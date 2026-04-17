import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const MessageBubble = ({ message }) => {
  const isMine = !!message?.isMine;

  return (
    <View style={[styles.row, isMine ? styles.rowMine : styles.rowOther]}>
      <View style={[styles.bubble, isMine ? styles.bubbleMine : styles.bubbleOther]}>
        <Text style={[styles.text, isMine ? styles.textMine : styles.textOther]}>
          {message?.text}
        </Text>
        <Text style={[styles.time, isMine ? styles.timeMine : styles.timeOther]}>
          {new Date(message?.createdAt).toLocaleTimeString([], {
            hour: 'numeric',
            minute: '2-digit',
          })}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    marginVertical: 4,
    paddingHorizontal: 12,
  },
  rowMine: {
    alignItems: 'flex-end',
  },
  rowOther: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  bubbleMine: {
    backgroundColor: '#111827',
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    backgroundColor: '#F3F4F6',
    borderBottomLeftRadius: 4,
  },
  text: {
    fontSize: 15,
  },
  textMine: {
    color: '#FFFFFF',
  },
  textOther: {
    color: '#111827',
  },
  time: {
    fontSize: 11,
    marginTop: 6,
  },
  timeMine: {
    color: '#D1D5DB',
  },
  timeOther: {
    color: '#6B7280',
  },
});

export default MessageBubble;