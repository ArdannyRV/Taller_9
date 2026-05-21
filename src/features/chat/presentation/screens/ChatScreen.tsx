import React, { useState, useRef, useCallback } from 'react';
import { View, FlatList, TextInput, TouchableOpacity,
  Text, StyleSheet, KeyboardAvoidingView, Platform,
  ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  useSpeechRecognitionEvent,
  ExpoSpeechRecognitionModule,
} from 'expo-speech-recognition';
import { useChat } from '../hooks/useChat';
import { MessageBubble } from '../components/MessageBubble';

export const ChatScreen: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const { messages, isLoading, error, sendMessage, clearChat } = useChat();

  useSpeechRecognitionEvent('result', useCallback((event) => {
    const transcript = event.results[0]?.transcript ?? '';
    setInputText(transcript);
  }, []));

  useSpeechRecognitionEvent('end', useCallback(() => {
    setIsListening(false);
  }, []));

  useSpeechRecognitionEvent('error', useCallback(() => {
    setIsListening(false);
  }, []));

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;
    const text = inputText;
    setInputText('');
    await sendMessage(text);
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  const toggleListening = async () => {
    if (isListening) {
      await ExpoSpeechRecognitionModule.stop();
      setIsListening(false);
    } else {
      try {
        await ExpoSpeechRecognitionModule.start({
          lang: 'es-EC',
          interimResults: true,
        });
        setIsListening(true);
      } catch {
        setIsListening(false);
      }
    }
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
            <ActivityIndicator size='small' color='#2563EB' />
            <Text style={styles.loadingText}>Gemini está escribiendo...</Text>
          </View>
        )}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
        <View style={styles.inputContainer}>
          <TouchableOpacity
            style={[
              styles.micButton,
              isListening ? styles.micButtonActive : styles.micButtonInactive,
            ]}
            onPress={toggleListening}
            disabled={isLoading}
          >
            <Text style={styles.micIcon}>
              {isListening ? '■' : '🎤'}
            </Text>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder='Escribe un mensaje...'
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
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#111827' },
  clearBtn: { paddingHorizontal: 12, paddingVertical: 6 },
  clearText: { color: '#EF4444', fontSize: 14 },
  messagesList: { padding: 16, paddingBottom: 8 },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  loadingText: { color: '#6B7280', fontSize: 14 },
  errorContainer: {
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 12,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
  },
  errorText: { color: '#DC2626', fontSize: 14 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
  },
  sendButton: {
    backgroundColor: '#2563EB',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: { backgroundColor: '#93C5FD' },
  sendIcon: { color: '#FFFFFF', fontWeight: '600', fontSize: 14 },
  micButton: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  micButtonActive: { backgroundColor: '#EF4444' },
  micButtonInactive: { backgroundColor: '#6B7280' },
  micIcon: { fontSize: 16 },
});
