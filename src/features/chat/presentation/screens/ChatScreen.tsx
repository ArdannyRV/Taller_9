import React, { useState, useRef } from 'react';
import { View, FlatList, TextInput, TouchableOpacity,
  Text, StyleSheet, KeyboardAvoidingView, Platform,
  ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useChat } from '../hooks/useChat';
import { MessageBubble } from '../components/MessageBubble';

export const ChatScreen: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);
  const { messages, isLoading, error, sendMessage, clearChat } = useChat();

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;
    const text = inputText;
    setInputText('');
    await sendMessage(text);
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chat con Gemini</Text>
        <TouchableOpacity onPress={clearChat} style={styles.clearBtn}>
          <Text style={styles.clearText}>Limpiar</Text>
        </TouchableOpacity>
      </View>
      <KeyboardAvoidingView style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <MessageBubble message={item} />}
          contentContainerStyle={styles.messagesList}
        />
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size='small' color='#8B6F47' />
            <Text style={styles.loadingText}>Gemini está escribiendo...</Text>
          </View>
        )}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder='Escribe un mensaje...'
            placeholderTextColor='#9B8B7A'
            multiline
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity
            style={[styles.sendButton,
              (!inputText.trim() || isLoading) && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!inputText.trim() || isLoading}
          >
            <Text style={styles.sendIcon}>Enviar</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F0EB' },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E0D5',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#2C1810' },
  clearBtn: { paddingHorizontal: 12, paddingVertical: 6 },
  clearText: { color: '#8B6F47', fontSize: 14 },
  messagesList: { padding: 16, paddingBottom: 8 },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  loadingText: { color: '#9B8B7A', fontSize: 14 },
  errorContainer: {
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 12,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
  },
  errorText: { color: '#C0392B', fontSize: 14 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E8E0D5',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: '#E8E0D5',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
    color: '#2C1810',
    backgroundColor: '#F5F0EB',
  },
  sendButton: {
    backgroundColor: '#8B6F47',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: { backgroundColor: '#C4A882' },
  sendIcon: { color: '#FFFFFF', fontWeight: '600', fontSize: 14 },
});
