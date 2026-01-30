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
  ScrollView,
  Dimensions
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { createGlassStyles, glassColors, glassTypography } from '../../styles/glassmorphism';
import ProfessionalBubbles from '../../components/ProfessionalBubbles';

interface UberStyleLoginScreenProps {
  onNavigateToSignup: () => void;
}

type LoginStep = 'email' | 'password' | 'social';

const { width } = Dimensions.get('window');

export default function UberStyleLoginScreen({ onNavigateToSignup }: UberStyleLoginScreenProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { login, socialLogin, isLoading, error, clearError } = useAuth();

  const glassStyles = createGlassStyles({ isDark });
  const colors = isDark ? glassColors.dark : glassColors.light;

  const [currentStep, setCurrentStep] = useState<LoginStep>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailValidation, setEmailValidation] = useState('');

  const validateEmail = (emailValue: string): boolean => {
    if (!emailValue.trim()) {
      setEmailValidation('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      setEmailValidation('Please enter a valid email address');
      return false;
    }
    setEmailValidation('');
    return true;
  };

  const handleEmailContinue = () => {
    clearError();
    if (validateEmail(email)) {
      // Check if user exists (in a real app, this would be an API call)
      // For demo, we'll always show password step
      setCurrentStep('password');
    }
  };

  const handlePasswordLogin = async () => {
    clearError();

    if (!password.trim()) {
      Alert.alert('Error', 'Password is required');
      return;
    }

    const success = await login({
      email: email.trim(),
      password: password
    });

    if (!success && error) {
      Alert.alert('Login Failed', error.message);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'apple' | 'microsoft') => {
    clearError();

    const success = await socialLogin(provider);

    if (!success && error) {
      Alert.alert('Social Login Failed', error.message);
    }
  };

  const handleBackToEmail = () => {
    setCurrentStep('email');
    setPassword('');
    setEmailValidation('');
    clearError();
  };

  const fillTestEmail = (type: 'customer' | 'staff' | 'admin') => {
    const testEmails = {
      customer: 'customer@test.com',
      staff: 'staff@test.com',
      admin: 'admin@shybay.com'
    };

    setEmail(testEmails[type]);
    setEmailValidation('');
    clearError();
  };

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
      padding: 24,
      justifyContent: 'center',
      minHeight: Dimensions.get('window').height - 100,
    },
    header: {
      alignItems: 'center',
      marginBottom: 48,
    },
    logo: {
      fontSize: 56,
      marginBottom: 16,
    },
    title: {
      ...glassTypography.largeTitle,
      color: colors.text,
      textAlign: 'center',
      marginBottom: 8,
    },
    subtitle: {
      ...glassTypography.body,
      color: colors.textSecondary,
      textAlign: 'center',
      maxWidth: width - 80,
    },
    mainCard: {
      ...glassStyles.glassCard,
      padding: 32,
      marginBottom: 24,
      alignItems: 'center',
    },
    stepTitle: {
      ...glassTypography.title2,
      color: colors.text,
      textAlign: 'center',
      marginBottom: 8,
    },
    stepSubtitle: {
      ...glassTypography.body,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 32,
    },
    inputContainer: {
      width: '100%',
      marginBottom: 24,
    },
    input: {
      ...glassStyles.glassInput,
      paddingHorizontal: 20,
      paddingVertical: 16,
      fontSize: 18,
      color: colors.text,
      width: '100%',
    },
    passwordContainer: {
      position: 'relative',
      width: '100%',
    },
    passwordToggle: {
      position: 'absolute',
      right: 20,
      top: 16,
      padding: 4,
    },
    passwordToggleText: {
      ...glassTypography.callout,
      color: colors.primary,
      fontSize: 14,
      fontWeight: '600',
    },
    errorText: {
      ...glassTypography.caption1,
      color: '#FF3B30',
      marginTop: 8,
      textAlign: 'center',
    },
    continueButton: {
      ...glassStyles.glassButton,
      paddingVertical: 16,
      width: '100%',
      backgroundColor: colors.primary + '20',
      borderColor: colors.primary + '40',
    },
    continueButtonText: {
      ...glassTypography.headline,
      color: colors.primary,
      textAlign: 'center',
      fontWeight: '600',
      fontSize: 18,
    },
    disabledButton: {
      backgroundColor: colors.textSecondary + '20',
      borderColor: colors.textSecondary + '30',
    },
    disabledButtonText: {
      color: colors.textSecondary,
    },
    backButton: {
      alignSelf: 'flex-start',
      marginBottom: 24,
      paddingVertical: 8,
      paddingHorizontal: 12,
    },
    backButtonText: {
      ...glassTypography.callout,
      color: colors.primary,
      fontWeight: '600',
    },
    divider: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 32,
      width: '100%',
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
      backgroundColor: colors.backgroundSolid,
      paddingHorizontal: 8,
    },
    socialButtons: {
      width: '100%',
      gap: 12,
    },
    socialButton: {
      ...glassStyles.glassButton,
      paddingVertical: 14,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isDark
        ? 'rgba(255, 255, 255, 0.08)'
        : 'rgba(255, 255, 255, 0.6)',
    },
    socialButtonText: {
      ...glassTypography.callout,
      color: colors.text,
      fontWeight: '600',
      marginLeft: 12,
    },
    socialIcon: {
      fontSize: 20,
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
    },
    signupText: {
      ...glassTypography.body,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 12,
    },
    signupButton: {
      paddingVertical: 12,
      paddingHorizontal: 24,
    },
    signupButtonText: {
      ...glassTypography.callout,
      color: colors.primary,
      fontWeight: '600',
    },
    loadingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
  });

  const renderEmailStep = () => (
    <>
      <Text style={styles.stepTitle}>What's your email?</Text>
      <Text style={styles.stepSubtitle}>
        We'll check if you have an account
      </Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter your email address"
          placeholderTextColor={colors.textSecondary}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoFocus
        />
        {emailValidation ? (
          <Text style={styles.errorText}>{emailValidation}</Text>
        ) : null}
      </View>

      <TouchableOpacity
        style={[styles.continueButton, !email.trim() && styles.disabledButton]}
        onPress={handleEmailContinue}
        disabled={!email.trim()}
      >
        <Text style={[styles.continueButtonText, !email.trim() && styles.disabledButtonText]}>
          Continue
        </Text>
      </TouchableOpacity>
    </>
  );

  const renderPasswordStep = () => (
    <>
      <TouchableOpacity style={styles.backButton} onPress={handleBackToEmail}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.stepTitle}>Welcome back</Text>
      <Text style={styles.stepSubtitle}>
        {email}
      </Text>

      <View style={styles.inputContainer}>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor={colors.textSecondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus
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
      </View>

      <TouchableOpacity
        style={[styles.continueButton, isLoading && styles.disabledButton]}
        onPress={handlePasswordLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.disabledButtonText}>Signing in...</Text>
          </View>
        ) : (
          <Text style={styles.continueButtonText}>Sign In</Text>
        )}
      </TouchableOpacity>

      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>or continue with</Text>
        <View style={styles.dividerLine} />
      </View>

      <View style={styles.socialButtons}>
        <TouchableOpacity
          style={styles.socialButton}
          onPress={() => handleSocialLogin('google')}
        >
          <Text style={styles.socialIcon}>🔍</Text>
          <Text style={styles.socialButtonText}>Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.socialButton}
          onPress={() => handleSocialLogin('apple')}
        >
          <Text style={styles.socialIcon}>🍎</Text>
          <Text style={styles.socialButtonText}>Continue with Apple</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.socialButton}
          onPress={() => handleSocialLogin('microsoft')}
        >
          <Text style={styles.socialIcon}>Ⓜ️</Text>
          <Text style={styles.socialButtonText}>Continue with Microsoft</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  const showDemoAccounts = __DEV__;

  return (
    <View style={styles.container}>
      <View style={styles.backgroundGradient} />
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
          <View style={styles.header}>
            <Text style={styles.logo}>🚗</Text>
            <Text style={styles.title}>Shybay</Text>
            <Text style={styles.subtitle}>
              Professional car wash service at your location
            </Text>
          </View>

          {/* Test Credentials - Only in development */}
          {showDemoAccounts && currentStep === 'email' && (
            <View style={styles.testCredentialsCard}>
              <Text style={styles.testTitle}>Quick Demo Access</Text>
              <View style={styles.testButtonContainer}>
                <TouchableOpacity
                  style={styles.testButton}
                  onPress={() => fillTestEmail('customer')}
                >
                  <Text style={styles.testButtonText}>👤 Customer</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.testButton}
                  onPress={() => fillTestEmail('staff')}
                >
                  <Text style={styles.testButtonText}>👷 Staff</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.testButton}
                  onPress={() => fillTestEmail('admin')}
                >
                  <Text style={styles.testButtonText}>👑 Admin</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View style={styles.mainCard}>
            {currentStep === 'email' ? renderEmailStep() : renderPasswordStep()}
          </View>

          {currentStep === 'email' && (
            <View style={styles.signupPrompt}>
              <Text style={styles.signupText}>
                Don't have an account?
              </Text>
              <TouchableOpacity
                style={styles.signupButton}
                onPress={onNavigateToSignup}
              >
                <Text style={styles.signupButtonText}>Sign up</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}