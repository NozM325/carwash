import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert, useColorScheme } from 'react-native';
import { BookingData, BookingStatus } from '../../types/booking';
import ProfessionalBubbles from '../../components/ProfessionalBubbles';
import { createGlassStyles, glassColors, glassTypography } from '../../styles/glassmorphism';

// Mock booking data for Phase 1
const mockBookings: BookingData[] = [
  {
    id: '001',
    customerName: 'John Doe',
    phoneNumber: '0123456789',
    serviceDate: new Date('2024-01-20'),
    serviceTime: '09:00 AM',
    vehicleRegistration: 'ABC123GP',
    vehicleType: 'Sedan',
    carBrand: 'Toyota',
    washType: 'Deep Clean',
    location: { latitude: -26.1234, longitude: 28.5678, address: 'Mock Location' },
    physicalAddress: '123 Test Street, Kempton Park',
    additionalInstructions: 'Please wash carefully',
    basePrice: 150,
    distanceMarkup: 50,
    totalAmount: 200,
    distanceFromBase: 8,
    paymentMethod: 'Instant EFT',
    paymentStatus: 'Completed',
    status: 'Confirmed',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  }
];

export default function AdminDashboard() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Create glass styles based on theme
  const glassStyles = createGlassStyles({ isDark });
  const colors = isDark ? glassColors.dark : glassColors.light;

  const [bookings, setBookings] = useState<BookingData[]>(mockBookings);
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus | 'All'>('All');

  const statuses: (BookingStatus | 'All')[] = ['All', 'Pending Payment', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'];

  const filteredBookings = selectedStatus === 'All'
    ? bookings
    : bookings.filter(booking => booking.status === selectedStatus);

  const updateBookingStatus = (bookingId: string, newStatus: BookingStatus) => {
    setBookings(prev => prev.map(booking =>
      booking.id === bookingId
        ? { ...booking, status: newStatus, updatedAt: new Date() }
        : booking
    ));
    Alert.alert('Success', `Booking ${bookingId} status updated to ${newStatus}`);
  };

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case 'Pending Payment': return '#f39c12';
      case 'Confirmed': return '#27ae60';
      case 'In Progress': return '#3498db';
      case 'Completed': return '#2c3e50';
      case 'Cancelled': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const getBookingStats = () => {
    const stats = {
      total: bookings.length,
      pending: bookings.filter(b => b.status === 'Pending Payment').length,
      confirmed: bookings.filter(b => b.status === 'Confirmed').length,
      inProgress: bookings.filter(b => b.status === 'In Progress').length,
      completed: bookings.filter(b => b.status === 'Completed').length,
      revenue: bookings.filter(b => b.paymentStatus === 'Completed').reduce((sum, b) => sum + b.totalAmount, 0)
    };
    return stats;
  };

  const stats = getBookingStats();

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
    scrollContainer: {
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
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
      gap: 12,
    },
    statCard: {
      ...glassStyles.glassContainer,
      flex: 1,
      padding: 16,
      alignItems: 'center',
    },
    statNumber: {
      ...glassTypography.title2,
      color: colors.primary,
      textAlign: 'center',
    },
    statLabel: {
      ...glassTypography.caption1,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 4,
    },
    filterCard: {
      ...glassStyles.glassContainer,
      padding: 20,
      marginBottom: 20,
    },
    filterTitle: {
      ...glassTypography.headline,
      color: colors.primary,
      marginBottom: 16,
    },
    filterScrollView: {
      flexGrow: 0,
    },
    filterChip: {
      ...glassStyles.glassContainerSecondary,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      marginRight: 10,
      borderColor: colors.textSecondary + '40',
    },
    activeFilterChip: {
      backgroundColor: isDark
        ? 'rgba(10, 132, 255, 0.25)'
        : 'rgba(0, 122, 255, 0.2)',
      borderColor: colors.primary + '80',
    },
    filterChipText: {
      ...glassTypography.callout,
      color: colors.textSecondary,
    },
    activeFilterChipText: {
      color: colors.primary,
      fontWeight: '600',
    },
    bookingsCard: {
      ...glassStyles.glassContainer,
      padding: 20,
      marginBottom: 40,
    },
    sectionTitle: {
      ...glassTypography.title3,
      color: colors.primary,
      marginBottom: 16,
    },
    bookingCard: {
      ...glassStyles.glassContainerSecondary,
      padding: 16,
      marginBottom: 16,
    },
    bookingHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    bookingId: {
      ...glassTypography.headline,
      color: colors.text,
      fontWeight: '600',
    },
    statusBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
    },
    statusText: {
      ...glassTypography.caption1,
      color: 'white',
      fontWeight: '600',
    },
    customerName: {
      ...glassTypography.title3,
      color: colors.text,
      marginBottom: 6,
    },
    bookingDetail: {
      ...glassTypography.callout,
      color: colors.textSecondary,
      marginBottom: 4,
    },
    priceText: {
      ...glassTypography.headline,
      color: colors.success,
      marginTop: 8,
      marginBottom: 12,
      fontWeight: '600',
    },
    actionButtons: {
      flexDirection: 'row',
      gap: 10,
      marginTop: 8,
    },
    actionBtn: {
      ...glassStyles.glassButton,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
    },
    startButton: {
      backgroundColor: isDark
        ? 'rgba(10, 132, 255, 0.25)'
        : 'rgba(0, 122, 255, 0.2)',
      borderColor: isDark
        ? 'rgba(10, 132, 255, 0.4)'
        : 'rgba(0, 122, 255, 0.3)',
    },
    completeButton: {
      backgroundColor: isDark
        ? 'rgba(52, 215, 75, 0.25)'
        : 'rgba(52, 199, 89, 0.2)',
      borderColor: isDark
        ? 'rgba(52, 215, 75, 0.4)'
        : 'rgba(52, 199, 89, 0.3)',
    },
    cancelButton: {
      backgroundColor: isDark
        ? 'rgba(255, 69, 58, 0.25)'
        : 'rgba(255, 59, 48, 0.2)',
      borderColor: isDark
        ? 'rgba(255, 69, 58, 0.4)'
        : 'rgba(255, 59, 48, 0.3)',
    },
    actionBtnText: {
      ...glassTypography.callout,
      color: colors.text,
      fontWeight: '600',
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      <View style={styles.backgroundGradient} />

      {/* Professional Bubble Animation */}
      <ProfessionalBubbles numBubbles={4} />

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerCard}>
          <Text style={styles.title}>Admin Dashboard</Text>
          <Text style={styles.subtitle}>Manage bookings and monitor operations</Text>
        </View>

        {/* Statistics */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total Bookings</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.confirmed}</Text>
            <Text style={styles.statLabel}>Confirmed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>R{stats.revenue}</Text>
            <Text style={styles.statLabel}>Revenue</Text>
          </View>
        </View>

        {/* Status Filter */}
        <View style={styles.filterCard}>
          <Text style={styles.filterTitle}>Filter by Status</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScrollView}>
            {statuses.map(status => (
              <TouchableOpacity
                key={status}
                onPress={() => setSelectedStatus(status)}
                style={[
                  styles.filterChip,
                  selectedStatus === status && styles.activeFilterChip
                ]}>
                <Text style={[
                  styles.filterChipText,
                  selectedStatus === status && styles.activeFilterChipText
                ]}>
                  {status}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Bookings List */}
        <View style={styles.bookingsCard}>
          <Text style={styles.sectionTitle}>Bookings ({filteredBookings.length})</Text>
          {filteredBookings.map(booking => (
            <View key={booking.id} style={styles.bookingCard}>
              <View style={styles.bookingHeader}>
                <Text style={styles.bookingId}>#{booking.id}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) }]}>
                  <Text style={styles.statusText}>{booking.status}</Text>
                </View>
              </View>

              <Text style={styles.customerName}>{booking.customerName}</Text>
              <Text style={styles.bookingDetail}>{booking.phoneNumber}</Text>
              <Text style={styles.bookingDetail}>
                {booking.vehicleType} • {booking.carBrand} • {booking.vehicleRegistration}
              </Text>
              <Text style={styles.bookingDetail}>
                {booking.serviceDate.toDateString()} at {booking.serviceTime}
              </Text>
              <Text style={styles.bookingDetail}>{booking.washType}</Text>
              <Text style={styles.priceText}>Total: R{booking.totalAmount}</Text>

              {/* Quick Status Actions */}
              <View style={styles.actionButtons}>
                {booking.status === 'Confirmed' && (
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.startButton]}
                    onPress={() => updateBookingStatus(booking.id, 'In Progress')}>
                    <Text style={styles.actionBtnText}>Start</Text>
                  </TouchableOpacity>
                )}
                {booking.status === 'In Progress' && (
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.completeButton]}
                    onPress={() => updateBookingStatus(booking.id, 'Completed')}>
                    <Text style={styles.actionBtnText}>Complete</Text>
                  </TouchableOpacity>
                )}
                {['Confirmed', 'In Progress'].includes(booking.status) && (
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.cancelButton]}
                    onPress={() => updateBookingStatus(booking.id, 'Cancelled')}>
                    <Text style={styles.actionBtnText}>Cancel</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}