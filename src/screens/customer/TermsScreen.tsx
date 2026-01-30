import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import { TermsProps } from '../../types/booking';
import ProfessionalBubbles from '../../components/ProfessionalBubbles';
import { createGlassStyles, glassColors, glassTypography } from '../../styles/glassmorphism';

export default function TermsScreen({ onAccept }: TermsProps) {
  const [accepted, setAccepted] = useState<boolean>(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Create glass styles based on theme
  const glassStyles = createGlassStyles({ isDark });
  const colors = isDark ? glassColors.dark : glassColors.light;

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
    contentContainer: {
      flex: 1,
      padding: 20,
      paddingTop: 60,
    },
    headerCard: {
      ...glassStyles.glassCard,
      alignItems: 'center',
      padding: 24,
      marginBottom: 24,
    },
    title: {
      ...glassTypography.title1,
      color: colors.primary,
      textAlign: 'center',
      marginBottom: 8,
    },
    subtitle: {
      ...glassTypography.callout,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    scrollView: {
      flex: 1,
    },
    termsCard: {
      ...glassStyles.glassContainer,
      padding: 24,
      marginBottom: 24,
    },
    termItem: {
      ...glassTypography.body,
      color: colors.text,
      lineHeight: 24,
      marginBottom: 16,
    },
    termLabel: {
      fontWeight: '600',
      color: colors.primary,
    },
    buttonContainer: {
      gap: 16,
      paddingBottom: 40,
    },
    acceptButton: {
      ...glassStyles.glassButton,
      paddingVertical: 16,
      backgroundColor: accepted
        ? (isDark ? 'rgba(52, 215, 75, 0.25)' : 'rgba(52, 199, 89, 0.2)')
        : (isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.15)'),
      borderColor: accepted
        ? (isDark ? 'rgba(52, 215, 75, 0.4)' : 'rgba(52, 199, 89, 0.3)')
        : (isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.25)'),
    },
    continueButton: {
      ...glassStyles.glassButton,
      paddingVertical: 16,
      backgroundColor: accepted
        ? (isDark ? 'rgba(10, 132, 255, 0.25)' : 'rgba(0, 122, 255, 0.2)')
        : (isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.08)'),
      borderColor: accepted
        ? (isDark ? 'rgba(10, 132, 255, 0.4)' : 'rgba(0, 122, 255, 0.3)')
        : (isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.15)'),
    },
    buttonText: {
      ...glassTypography.headline,
      color: accepted ? colors.text : colors.textSecondary,
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      <View style={styles.backgroundGradient} />

      {/* Professional Bubble Animation */}
      <ProfessionalBubbles numBubbles={6} />

      {/* Main Content */}
      <View style={styles.contentContainer}>
        {/* Header Card */}
        <View style={styles.headerCard}>
          <Text style={styles.title}>Terms & Conditions</Text>
          <Text style={styles.subtitle}>Please review before proceeding</Text>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.termsCard}>
            <Text style={styles.termItem}>
              <Text style={styles.termLabel}>Water Access:</Text> Access to water on-site is mandatory for all car wash services. Please ensure hose connection availability.
            </Text>

            <Text style={styles.termItem}>
              <Text style={styles.termLabel}>Vehicle Safety:</Text> Staff are strictly prohibited from driving customer vehicles under any circumstances for insurance and safety reasons.
            </Text>

            <Text style={styles.termItem}>
              <Text style={styles.termLabel}>Professional Ethics:</Text> Private deals with staff members will result in a permanent service ban. All payments must go through official channels.
            </Text>

            <Text style={styles.termItem}>
              <Text style={styles.termLabel}>Service Area:</Text> Services are only provided within Kempton Park and surrounding areas (21km radius from base location).
            </Text>

            <Text style={styles.termItem}>
              <Text style={styles.termLabel}>Payment Policy:</Text> Payment must be completed via Instant EFT before service confirmation. No cash payments accepted.
            </Text>

            <Text style={styles.termItem}>
              <Text style={styles.termLabel}>Customer Support:</Text> For queries or support, contact us via WhatsApp during business hours (8AM - 6PM).
            </Text>

            <Text style={styles.termItem}>
              <Text style={styles.termLabel}>Quality Guarantee:</Text> We guarantee professional service and will address any concerns within 24 hours of service completion.
            </Text>
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.acceptButton}
            onPress={() => setAccepted(!accepted)}
            activeOpacity={0.8}>
            <Text style={styles.buttonText}>
              {accepted ? "Terms Accepted" : "Accept Terms & Conditions"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            disabled={!accepted}
            onPress={onAccept}
            style={styles.continueButton}
            activeOpacity={accepted ? 0.8 : 1}>
            <Text style={styles.buttonText}>
              {accepted ? "Continue to Booking" : "Please Accept Terms to Continue"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}