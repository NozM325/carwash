import React from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import AuthWrapper from '../src/screens/auth/AuthWrapper';
import MainApp from '../src/screens/MainApp';

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    // You could show a splash screen here
    return null;
  }

  return isAuthenticated ? <MainApp /> : <AuthWrapper />;
}

export default function Page() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <StatusBar style="auto" />
          <AppContent />
        </SafeAreaView>
      </AuthProvider>
    </SafeAreaProvider>
  );
}