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

interface SignupScreenProps {
  onNavigateToLogin: () => void;
}

export default function SignupScreen({ onNavigateToLogin }: SignupScreenProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { signup, isLoading, error, clearError } = useAuth();

  const glassStyles = createGlassStyles({ isDark });
  const colors = isDark ? glassColors.dark : glassColors.light;

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    role: 'customer' as 'customer' | 'staff'
  });

  const [validation, setValidation] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = (): boolean => {
    const newValidation = {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: ''
    };
    let isValid = true;

    // First name validation
    if (!formData.firstName.trim()) {
      newValidation.firstName = 'First name is required';
      isValid = false;
    } else if (formData.firstName.trim().length < 2) {
      newValidation.firstName = 'First name must be at least 2 characters';
      isValid = false;
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      newValidation.lastName = 'Last name is required';
      isValid = false;
    } else if (formData.lastName.trim().length < 2) {
      newValidation.lastName = 'Last name must be at least 2 characters';
      isValid = false;
    }

    // Email validation
    if (!formData.email.trim()) {
      newValidation.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newValidation.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Phone number validation
    if (!formData.phoneNumber.trim()) {
      newValidation.phoneNumber = 'Phone number is required';
      isValid = false;
    } else {
      const cleanPhone = formData.phoneNumber.replace(/\s|-/g, '');
      if (!/^(\+27|0)[0-9]{9,10}$/.test(cleanPhone)) {
        newValidation.phoneNumber = 'Please enter a valid South African phone number';
        isValid = false;
      }
    }

    // Password validation
    if (!formData.password) {
      newValidation.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      newValidation.password = 'Password must be at least 6 characters long';
      isValid = false;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])|(?=.*[0-9])/.test(formData.password)) {
      newValidation.password = 'Password should contain uppercase, lowercase or numbers';
      isValid = false;
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newValidation.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newValidation.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setValidation(newValidation);
    return isValid;
  };

  const handleSignup = async () => {
    clearError();

    if (!validateForm()) {
      return;
    }

    const success = await signup({
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      role: formData.role
    });

    if (success) {
      Alert.alert(
        'Welcome to Shybay!',
        'Your account has been created successfully. You can now start booking car wash services.',
        [{ text: 'Get Started', style: 'default' }]
      );
    } else if (error) {
      Alert.alert('Signup Failed', error.message);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear validation error when user starts typing
    if (field !== 'role' && validation[field as keyof typeof validation]) {
      setValidation(prev => ({ ...prev, [field]: '' }));
    }
    clearError();
  };

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digit characters except +
    const cleanValue = value.replace(/[^\d+]/g, '');

    // Format South African numbers
    if (cleanValue.startsWith('+27')) {
      const digits = cleanValue.slice(3);
      if (digits.length <= 2) return `+27 ${digits}`;
      if (digits.length <= 5) return `+27 ${digits.slice(0, 2)} ${digits.slice(2)}`;
      return `+27 ${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 9)}`;
    }

    if (cleanValue.startsWith('0')) {
      const digits = cleanValue.slice(1);
      if (digits.length <= 2) return `0${digits}`;
      if (digits.length <= 5) return `0${digits.slice(0, 2)} ${digits.slice(2)}`;
      return `0${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 9)}`;
    }

    return value;
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    handleInputChange('phoneNumber', formatted);
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
      padding: 20,
      paddingTop: 60,
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
    row: {
      flexDirection: 'row',
      gap: 12,
    },
    inputContainer: {
      marginBottom: 20,
    },
    inputContainerHalf: {
      flex: 1,
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
    roleSection: {
      marginBottom: 24,
    },
    roleContainer: {
      flexDirection: 'row',
      gap: 12,
    },
    roleButton: {
      flex: 1,
      ...glassStyles.glassContainerSecondary,
      paddingVertical: 16,
      paddingHorizontal: 16,
      alignItems: 'center',
      borderColor: colors.textSecondary + '40',
    },
    activeRoleButton: {
      backgroundColor: isDark
        ? 'rgba(0, 122, 255, 0.25)'
        : 'rgba(0, 122, 255, 0.2)',
      borderColor: colors.primary + '80',
    },
    roleIcon: {
      fontSize: 24,
      marginBottom: 8,
    },
    roleText: {
      ...glassTypography.callout,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    activeRoleText: {
      color: colors.primary,
      fontWeight: '600',
    },
    signupButton: {
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
    loginPrompt: {
      ...glassStyles.glassContainer,
      padding: 16,
      alignItems: 'center',
      marginBottom: 40,
    },
    loginText: {
      ...glassTypography.body,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 12,
    },
    loginButton: {
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
    loginButtonText: {
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
            <Text style={styles.title}>Welcome to Shybay</Text>
            <Text style={styles.subtitle}>Get started with professional car wash service at your location</Text>
          </View>

          {/* Signup Form */}
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Create Account</Text>

            {/* Name Row */}
            <View style={styles.row}>
              <View style={styles.inputContainerHalf}>
                <Text style={styles.label}>First Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="John"
                  placeholderTextColor={colors.textSecondary}
                  value={formData.firstName}
                  onChangeText={(value) => handleInputChange('firstName', value)}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
                {validation.firstName ? (
                  <Text style={styles.errorText}>{validation.firstName}</Text>
                ) : null}
              </View>
              <View style={styles.inputContainerHalf}>
                <Text style={styles.label}>Last Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Doe"
                  placeholderTextColor={colors.textSecondary}
                  value={formData.lastName}
                  onChangeText={(value) => handleInputChange('lastName', value)}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
                {validation.lastName ? (
                  <Text style={styles.errorText}>{validation.lastName}</Text>
                ) : null}
              </View>
            </View>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="john@example.com"
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

            {/* Phone Number Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                placeholder="+27 11 123 4567"
                placeholderTextColor={colors.textSecondary}
                value={formData.phoneNumber}
                onChangeText={handlePhoneChange}
                keyboardType="phone-pad"
                autoCorrect={false}
              />
              {validation.phoneNumber ? (
                <Text style={styles.errorText}>{validation.phoneNumber}</Text>
              ) : null}
            </View>

            {/* Account Type Selection */}
            <View style={styles.roleSection}>
              <Text style={styles.label}>Account Type</Text>
              <View style={styles.roleContainer}>
                <TouchableOpacity
                  style={[
                    styles.roleButton,
                    formData.role === 'customer' && styles.activeRoleButton
                  ]}
                  onPress={() => handleInputChange('role', 'customer')}
                >
                  <Text style={styles.roleIcon}>👤</Text>
                  <Text style={[
                    styles.roleText,
                    formData.role === 'customer' && styles.activeRoleText
                  ]}>
                    Customer
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.roleButton,
                    formData.role === 'staff' && styles.activeRoleButton
                  ]}
                  onPress={() => handleInputChange('role', 'staff')}
                >
                  <Text style={styles.roleIcon}>👷</Text>
                  <Text style={[
                    styles.roleText,
                    formData.role === 'staff' && styles.activeRoleText
                  ]}>
                    Staff
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Create a secure password"
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

            {/* Confirm Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirm Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Confirm your password"
                  placeholderTextColor={colors.textSecondary}
                  value={formData.confirmPassword}
                  onChangeText={(value) => handleInputChange('confirmPassword', value)}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  style={styles.passwordToggle}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Text style={styles.passwordToggleText}>
                    {showConfirmPassword ? 'Hide' : 'Show'}
                  </Text>
                </TouchableOpacity>
              </View>
              {validation.confirmPassword ? (
                <Text style={styles.errorText}>{validation.confirmPassword}</Text>
              ) : null}
            </View>

            {/* Signup Button */}
            <TouchableOpacity
              style={[
                styles.signupButton,
                isLoading && styles.disabledButton
              ]}
              onPress={handleSignup}
              disabled={isLoading}
            >
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color={colors.success} />
                  <Text style={styles.disabledButtonText}>Creating Account...</Text>
                </View>
              ) : (
                <Text style={styles.buttonText}>Create Account</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Login Prompt */}
          <View style={styles.loginPrompt}>
            <Text style={styles.loginText}>
              Already have an account?
            </Text>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={onNavigateToLogin}
            >
              <Text style={styles.loginButtonText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}