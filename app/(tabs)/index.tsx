import React from 'react';
import { ChatScreen } from '../../src/features/chat/presentation/screens/ChatScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider>
      <ChatScreen />
    </SafeAreaProvider>
  );
}
