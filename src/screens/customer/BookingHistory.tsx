import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  useColorScheme
} from 'react-native';
import { createGlassStyles, glassColors, glassTypography } from '../../styles/glassmorphism';
import ProfessionalBubbles from '../../components/ProfessionalBubbles';

interface Booking {
  id: string;
  date: string;
  time: string;
  service: string;
  vehicle: string;
  address: string;
  status: 'completed' | 'cancelled' | 'in-progress';
  price: number;
  rating?: number;
}

// Mock booking data
const mockBookings: Booking[] = [
  {
    id: '1',
    date: '2024-01-28',
    time: '10:00 AM',
    service: 'Full Service Wash',
    vehicle: 'Toyota Camry',
    address: '123 Douglas St, Johannesburg',
    status: 'completed',
    price: 150,
    rating: 5
  },
  {
    id: '2',
    date: '2024-01-20',
    time: '2:30 PM',
    service: 'Basic Wash',
    vehicle: 'Toyota Camry',
    address: '123 Douglas St, Johannesburg',
    status: 'completed',
    price: 80,
    rating: 4
  },
  {
    id: '3',
    date: '2024-01-15',
    time: '11:00 AM',
    service: 'Deep Clean',
    vehicle: 'Toyota Camry',
    address: '456 Main Rd, Sandton',
    status: 'completed',
    price: 200,
    rating: 5
  }
];

export default function BookingHistory() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? glassColors.dark : glassColors.light;
  const glassStyles = createGlassStyles({ isDark });

  const [bookings] = useState<Booking[]>(mockBookings);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return colors.success;
      case 'cancelled':
        return '#FF3B30';
      case 'in-progress':
        return '#FF9500';
      default:
        return colors.textSecondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return '✅';
      case 'cancelled':
        return '❌';
      case 'in-progress':
        return '🔄';
      default:
        return '⏳';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const renderStars = (rating: number) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
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
      marginBottom: 24,
    },
    title: {
      ...glassTypography.largeTitle,
      color: colors.primary,
      marginBottom: 8,
    },
    subtitle: {
      ...glassTypography.body,
      color: colors.textSecondary,
    },
    emptyState: {
      ...glassStyles.glassCard,
      padding: 40,
      alignItems: 'center',
      marginTop: 40,
    },
    emptyIcon: {
      fontSize: 64,
      marginBottom: 16,
    },
    emptyTitle: {
      ...glassTypography.title2,
      color: colors.text,
      textAlign: 'center',
      marginBottom: 8,
    },
    emptyDescription: {
      ...glassTypography.body,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    bookingCard: {
      ...glassStyles.glassContainer,
      padding: 20,
      marginBottom: 16,
    },
    bookingHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    dateTime: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    date: {
      ...glassTypography.callout,
      color: colors.text,
      fontWeight: '600',
      marginRight: 8,
    },
    time: {
      ...glassTypography.caption1,
      color: colors.textSecondary,
    },
    status: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary + '20',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    statusIcon: {
      marginRight: 4,
    },
    statusText: {
      ...glassTypography.caption1,
      fontWeight: '600',
      fontSize: 11,
    },
    bookingDetails: {
      marginBottom: 12,
    },
    service: {
      ...glassTypography.title3,
      color: colors.text,
      marginBottom: 4,
    },
    vehicle: {
      ...glassTypography.callout,
      color: colors.textSecondary,
      marginBottom: 4,
    },
    address: {
      ...glassTypography.caption1,
      color: colors.textSecondary,
      marginBottom: 8,
    },
    bookingFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    price: {
      ...glassTypography.title3,
      color: colors.success,
      fontWeight: '600',
    },
    rating: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    ratingStars: {
      marginRight: 8,
    },
    ratingText: {
      ...glassTypography.caption1,
      color: colors.textSecondary,
    },
    actionButtons: {
      flexDirection: 'row',
      gap: 8,
      marginTop: 12,
    },
    actionButton: {
      flex: 1,
      ...glassStyles.glassButton,
      paddingVertical: 8,
    },
    primaryActionButton: {
      backgroundColor: colors.primary + '20',
      borderColor: colors.primary + '40',
    },
    actionButtonText: {
      ...glassTypography.callout,
      textAlign: 'center',
      fontWeight: '600',
    },
    primaryActionButtonText: {
      color: colors.primary,
    },
    secondaryActionButtonText: {
      color: colors.textSecondary,
    },
  });

  if (bookings.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.backgroundGradient} />
        <ProfessionalBubbles numBubbles={6} />

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Booking History</Text>
            <Text style={styles.subtitle}>Your past car wash services</Text>
          </View>

          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyTitle}>No Bookings Yet</Text>
            <Text style={styles.emptyDescription}>
              Book your first car wash service to see your history here
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.backgroundGradient} />
      <ProfessionalBubbles numBubbles={6} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Booking History</Text>
          <Text style={styles.subtitle}>{bookings.length} completed services</Text>
        </View>

        {bookings.map((booking) => (
          <View key={booking.id} style={styles.bookingCard}>
            <View style={styles.bookingHeader}>
              <View style={styles.dateTime}>
                <Text style={styles.date}>{formatDate(booking.date)}</Text>
                <Text style={styles.time}>{booking.time}</Text>
              </View>
              <View style={[styles.status, { backgroundColor: getStatusColor(booking.status) + '20' }]}>
                <Text style={styles.statusIcon}>{getStatusIcon(booking.status)}</Text>
                <Text style={[styles.statusText, { color: getStatusColor(booking.status) }]}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </Text>
              </View>
            </View>

            <View style={styles.bookingDetails}>
              <Text style={styles.service}>{booking.service}</Text>
              <Text style={styles.vehicle}>{booking.vehicle}</Text>
              <Text style={styles.address}>📍 {booking.address}</Text>
            </View>

            <View style={styles.bookingFooter}>
              <Text style={styles.price}>R{booking.price}</Text>
              {booking.rating && (
                <View style={styles.rating}>
                  <Text style={styles.ratingStars}>{renderStars(booking.rating)}</Text>
                  <Text style={styles.ratingText}>({booking.rating}/5)</Text>
                </View>
              )}
            </View>

            {booking.status === 'completed' && (
              <View style={styles.actionButtons}>
                <TouchableOpacity style={[styles.actionButton, styles.primaryActionButton]}>
                  <Text style={[styles.actionButtonText, styles.primaryActionButtonText]}>
                    Book Again
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={[styles.actionButtonText, styles.secondaryActionButtonText]}>
                    Receipt
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}