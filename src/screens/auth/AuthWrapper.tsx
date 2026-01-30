import React, { useState } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import UberStyleLoginScreen from './UberStyleLoginScreen';
import SignupScreen from './SignupScreen';

type AuthScreen = 'login' | 'signup';

export default function AuthWrapper() {
  const { isLoading } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<AuthScreen>('login');

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0A84FF" />
      </View>
    );
  }

  if (currentScreen === 'login') {
    return (
      <UberStyleLoginScreen
        onNavigateToSignup={() => setCurrentScreen('signup')}
      />
    );
  }

  return (
    <SignupScreen
      onNavigateToLogin={() => setCurrentScreen('login')}
    />
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
});