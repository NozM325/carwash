import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  ScrollView
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { createGlassStyles, glassColors, glassTypography } from '../../styles/glassmorphism';
import ProfessionalBubbles from '../../components/ProfessionalBubbles';
import UserProfile from '../../components/UserProfile';

interface CustomerHomeProps {
  onNavigateToBook: () => void;
}

export default function CustomerHome({ onNavigateToBook }: CustomerHomeProps) {
  const { user } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? glassColors.dark : glassColors.light;
  const glassStyles = createGlassStyles({ isDark });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
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
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 100, // Space for tab bar
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 32,
    },
    greetingContainer: {
      flex: 1,
    },
    greeting: {
      ...glassTypography.title2,
      color: colors.text,
      marginBottom: 4,
    },
    userName: {
      ...glassTypography.largeTitle,
      color: colors.primary,
      fontWeight: '700',
    },
    quickBookCard: {
      ...glassStyles.glassCard,
      padding: 24,
      alignItems: 'center',
      marginBottom: 24,
    },
    quickBookIcon: {
      fontSize: 48,
      marginBottom: 16,
    },
    quickBookTitle: {
      ...glassTypography.title2,
      color: colors.primary,
      marginBottom: 8,
      textAlign: 'center',
    },
    quickBookSubtitle: {
      ...glassTypography.body,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 20,
    },
    bookButton: {
      ...glassStyles.glassButton,
      paddingHorizontal: 32,
      paddingVertical: 16,
      backgroundColor: colors.primary + '20',
      borderColor: colors.primary + '40',
      minWidth: 200,
    },
    bookButtonText: {
      ...glassTypography.headline,
      color: colors.primary,
      textAlign: 'center',
      fontWeight: '600',
      fontSize: 18,
    },
    statusCard: {
      ...glassStyles.glassContainer,
      padding: 20,
      marginBottom: 24,
    },
    statusTitle: {
      ...glassTypography.title3,
      color: colors.text,
      marginBottom: 16,
    },
    noActiveBooking: {
      ...glassTypography.body,
      color: colors.textSecondary,
      textAlign: 'center',
      fontStyle: 'italic',
    },
    featuresGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      marginBottom: 24,
    },
    featureCard: {
      ...glassStyles.glassContainerSecondary,
      flex: 1,
      minWidth: '45%',
      padding: 16,
      alignItems: 'center',
    },
    featureIcon: {
      fontSize: 32,
      marginBottom: 8,
    },
    featureTitle: {
      ...glassTypography.callout,
      color: colors.text,
      fontWeight: '600',
      marginBottom: 4,
      textAlign: 'center',
    },
    featureDescription: {
      ...glassTypography.caption1,
      color: colors.textSecondary,
      textAlign: 'center',
      fontSize: 11,
    },
    weatherCard: {
      ...glassStyles.glassContainer,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 24,
    },
    weatherIcon: {
      fontSize: 32,
      marginRight: 12,
    },
    weatherText: {
      flex: 1,
    },
    weatherTitle: {
      ...glassTypography.callout,
      color: colors.text,
      fontWeight: '600',
    },
    weatherDescription: {
      ...glassTypography.caption1,
      color: colors.textSecondary,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.backgroundGradient} />
      <ProfessionalBubbles numBubbles={8} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Greeting and Profile */}
        <View style={styles.header}>
          <View style={styles.greetingContainer}>
            <Text style={styles.greeting}>{getGreeting()},</Text>
            <Text style={styles.userName}>{user?.firstName}!</Text>
          </View>
          <UserProfile showInHeader />
        </View>

        {/* Service Status */}
        <View style={styles.weatherCard}>
          <View style={styles.statusIndicator} />
          <View style={styles.weatherText}>
            <Text style={styles.weatherTitle}>Service Available</Text>
            <Text style={styles.weatherDescription}>Book your next car wash appointment</Text>
          </View>
        </View>

        {/* Quick Book Service */}
        <View style={styles.quickBookCard}>
          <Text style={styles.quickBookTitle}>Professional Car Wash Service</Text>
          <Text style={styles.quickBookSubtitle}>
            Premium cleaning delivered to your location
          </Text>
          <TouchableOpacity
            style={styles.bookButton}
            onPress={onNavigateToBook}
          >
            <Text style={styles.bookButtonText}>Book Service</Text>
          </TouchableOpacity>
        </View>

        {/* Current Booking Status */}
        <View style={styles.statusCard}>
          <Text style={styles.statusTitle}>Current Booking</Text>
          <Text style={styles.noActiveBooking}>
            No active bookings. Book a service to get started!
          </Text>
        </View>

        {/* Service Features */}
        <View style={styles.featuresGrid}>
          <View style={styles.featureCard}>
            <Text style={styles.featureTitle}>Mobile Service</Text>
            <Text style={styles.featureDescription}>At your location</Text>
          </View>
          <View style={styles.featureCard}>
            <Text style={styles.featureTitle}>Business Hours</Text>
            <Text style={styles.featureDescription}>8AM - 5:30PM</Text>
          </View>
          <View style={styles.featureCard}>
            <Text style={styles.featureTitle}>Professional</Text>
            <Text style={styles.featureDescription}>Trained technicians</Text>
          </View>
          <View style={styles.featureCard}>
            <Text style={styles.featureTitle}>Eco-Friendly</Text>
            <Text style={styles.featureDescription}>Safe products</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}