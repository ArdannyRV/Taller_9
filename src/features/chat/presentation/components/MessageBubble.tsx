import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Message } from '../../domain/entities/Message';

interface Props { message: Message; }

export const MessageBubble: React.FC<Props> = ({ message }) => {
  const isUser = message.role === 'user';
  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.aiContainer]}>
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
        <Text style={[styles.text, isUser ? styles.userText : styles.aiText]}>
          {message.content}
        </Text>
      </View>
      <Text style={styles.timestamp}>
        {message.timestamp.toLocaleTimeString('es-EC', {
          hour: '2-digit', minute: '2-digit',
        })}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginVertical: 4, marginHorizontal: 12, maxWidth: '80%' },
  userContainer: { alignSelf: 'flex-end', alignItems: 'flex-end' },
  aiContainer:  { alignSelf: 'flex-start', alignItems: 'flex-start' },
  bubble:       { borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10 },
  userBubble:   { backgroundColor: '#2563EB', borderBottomRightRadius: 4 },
  aiBubble:     { backgroundColor: '#F1F5F9', borderBottomLeftRadius: 4 },
  text:         { fontSize: 15, lineHeight: 21 },
  userText:     { color: '#FFFFFF' },
  aiText:       { color: '#1E293B' },
  timestamp:    { fontSize: 10, color: '#94A3B8', marginTop: 2 },
});
