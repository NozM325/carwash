import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { createGlassStyles, glassColors, glassTypography } from '../../styles/glassmorphism';
import ProfessionalBubbles from '../../components/ProfessionalBubbles';

interface LoginScreenProps {
  onNavigateToSignup: () => void;
}

export default function LoginScreen({ onNavigateToSignup }: LoginScreenProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { login, isLoading, error, clearError } = useAuth();

  const glassStyles = createGlassStyles({ isDark });
  const colors = isDark ? glassColors.dark : glassColors.light;

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [validation, setValidation] = useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);

  const validateForm = (): boolean => {
    const newValidation = { email: '', password: '' };
    let isValid = true;

    // Email validation
    if (!formData.email.trim()) {
      newValidation.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newValidation.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Password validation
    if (!formData.password.trim()) {
      newValidation.password = 'Password is required';
      isValid = false;
    }

    setValidation(newValidation);
    return isValid;
  };

  const handleLogin = async () => {
    clearError();

    if (!validateForm()) {
      return;
    }

    const success = await login({
      email: formData.email.trim(),
      password: formData.password
    });

    if (!success && error) {
      Alert.alert('Login Failed', error.message);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear validation error when user starts typing
    if (validation[field]) {
      setValidation(prev => ({ ...prev, [field]: '' }));
    }
    clearError();
  };

  const fillTestCredentials = (type: 'customer' | 'staff' | 'admin') => {
    const testCredentials = {
      customer: { email: 'customer@test.com', password: 'password' },
      staff: { email: 'staff@test.com', password: 'password' },
      admin: { email: 'admin@shybay.com', password: 'admin123' }
    };

    const credentials = testCredentials[type];
    setFormData(credentials);
    setValidation({ email: '', password: '' });
    clearError();
  };

  // Show demo accounts only in development mode
  const showDemoAccounts = __DEV__;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSolid,
    },
    backgroundGradient: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: isDark
        ? 'linear-gradient(135deg, #000428 0%, #004e92 100%)'
        : 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 50%, #90CAF9 100%)',
    },
    scrollContent: {
      flexGrow: 1,
      padding: 20,
      justifyContent: 'center',
    },
    headerCard: {
      ...glassStyles.glassCard,
      alignItems: 'center',
      padding: 32,
      marginBottom: 32,
    },
    logo: {
      fontSize: 48,
      marginBottom: 16,
    },
    title: {
      ...glassTypography.largeTitle,
      color: colors.primary,
      textAlign: 'center',
      marginBottom: 8,
    },
    subtitle: {
      ...glassTypography.body,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    formCard: {
      ...glassStyles.glassCard,
      padding: 24,
      marginBottom: 24,
    },
    formTitle: {
      ...glassTypography.title2,
      color: colors.primary,
      textAlign: 'center',
      marginBottom: 24,
    },
    inputContainer: {
      marginBottom: 20,
    },
    label: {
      ...glassTypography.callout,
      color: colors.text,
      marginBottom: 8,
      fontWeight: '500',
    },
    input: {
      ...glassStyles.glassInput,
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontSize: 16,
      color: colors.text,
    },
    passwordContainer: {
      position: 'relative',
    },
    passwordToggle: {
      position: 'absolute',
      right: 16,
      top: 14,
      padding: 4,
    },
    passwordToggleText: {
      ...glassTypography.callout,
      color: colors.primary,
      fontSize: 12,
    },
    errorText: {
      ...glassTypography.caption1,
      color: '#FF3B30',
      marginTop: 4,
    },
    loginButton: {
      ...glassStyles.glassButton,
      paddingVertical: 16,
      marginTop: 8,
      backgroundColor: isDark
        ? 'rgba(52, 215, 75, 0.25)'
        : 'rgba(52, 199, 89, 0.2)',
      borderColor: isDark
        ? 'rgba(52, 215, 75, 0.4)'
        : 'rgba(52, 199, 89, 0.3)',
    },
    disabledButton: {
      backgroundColor: isDark
        ? 'rgba(255, 255, 255, 0.05)'
        : 'rgba(255, 255, 255, 0.1)',
      borderColor: isDark
        ? 'rgba(255, 255, 255, 0.1)'
        : 'rgba(255, 255, 255, 0.2)',
    },
    buttonText: {
      ...glassTypography.headline,
      color: colors.success,
      textAlign: 'center',
      fontWeight: '600',
    },
    disabledButtonText: {
      color: colors.textSecondary,
    },
    loadingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    divider: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 24,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: colors.textSecondary + '40',
    },
    dividerText: {
      ...glassTypography.caption1,
      color: colors.textSecondary,
      marginHorizontal: 16,
    },
    testCredentialsCard: {
      ...glassStyles.glassContainer,
      padding: 20,
      marginBottom: 24,
    },
    testTitle: {
      ...glassTypography.callout,
      color: colors.text,
      textAlign: 'center',
      marginBottom: 16,
      fontWeight: '600',
    },
    testButtonContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      justifyContent: 'center',
    },
    testButton: {
      ...glassStyles.glassContainerSecondary,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: isDark
        ? 'rgba(255, 149, 0, 0.15)'
        : 'rgba(255, 149, 0, 0.1)',
      borderColor: isDark
        ? 'rgba(255, 149, 0, 0.3)'
        : 'rgba(255, 149, 0, 0.2)',
    },
    testButtonText: {
      ...glassTypography.caption1,
      color: isDark ? '#FF9500' : '#FF8C00',
      fontWeight: '600',
    },
    signupPrompt: {
      ...glassStyles.glassContainer,
      padding: 16,
      alignItems: 'center',
      marginBottom: 20,
    },
    signupText: {
      ...glassTypography.body,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 12,
    },
    signupButton: {
      ...glassStyles.glassButton,
      paddingVertical: 12,
      paddingHorizontal: 24,
      backgroundColor: isDark
        ? 'rgba(0, 122, 255, 0.15)'
        : 'rgba(0, 122, 255, 0.1)',
      borderColor: isDark
        ? 'rgba(0, 122, 255, 0.3)'
        : 'rgba(0, 122, 255, 0.2)',
    },
    signupButtonText: {
      ...glassTypography.callout,
      color: colors.primary,
      textAlign: 'center',
      fontWeight: '600',
    },
  });

  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      <View style={styles.backgroundGradient} />

      {/* Professional Bubble Animation */}
      <ProfessionalBubbles numBubbles={6} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.headerCard}>
            <Text style={styles.logo}>🚗</Text>
            <Text style={styles.title}>Shybay Car Wash</Text>
            <Text style={styles.subtitle}>Professional car wash service at your location</Text>
          </View>

          {/* Test Credentials - Only show in development */}
          {showDemoAccounts && (
            <View style={styles.testCredentialsCard}>
              <Text style={styles.testTitle}>Developer Demo</Text>
              <View style={styles.testButtonContainer}>
                <TouchableOpacity
                  style={styles.testButton}
                  onPress={() => fillTestCredentials('customer')}
                >
                  <Text style={styles.testButtonText}>👤 Customer</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.testButton}
                  onPress={() => fillTestCredentials('staff')}
                >
                  <Text style={styles.testButtonText}>👷 Staff</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.testButton}
                  onPress={() => fillTestCredentials('admin')}
                >
                  <Text style={styles.testButtonText}>👑 Admin</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Login Form */}
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Sign In</Text>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor={colors.textSecondary}
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              {validation.email ? (
                <Text style={styles.errorText}>{validation.email}</Text>
              ) : null}
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor={colors.textSecondary}
                  value={formData.password}
                  onChangeText={(value) => handleInputChange('password', value)}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  style={styles.passwordToggle}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Text style={styles.passwordToggleText}>
                    {showPassword ? 'Hide' : 'Show'}
                  </Text>
                </TouchableOpacity>
              </View>
              {validation.password ? (
                <Text style={styles.errorText}>{validation.password}</Text>
              ) : null}
            </View>

            {/* Login Button */}
            <TouchableOpacity
              style={[
                styles.loginButton,
                isLoading && styles.disabledButton
              ]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color={colors.success} />
                  <Text style={styles.disabledButtonText}>Signing In...</Text>
                </View>
              ) : (
                <Text style={styles.buttonText}>Sign In</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Signup Prompt */}
          <View style={styles.signupPrompt}>
            <Text style={styles.signupText}>
              Don&apos;t have an account yet?
            </Text>
            <TouchableOpacity
              style={styles.signupButton}
              onPress={onNavigateToSignup}
            >
              <Text style={styles.signupButtonText}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}