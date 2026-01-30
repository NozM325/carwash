import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { createGlassStyles, glassColors, glassTypography } from '../../styles/glassmorphism';
import ProfessionalBubbles from '../../components/ProfessionalBubbles';
import UserProfile from '../../components/UserProfile';

export default function AdminDashboard() {
  const { user } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? glassColors.dark : glassColors.light;
  const glassStyles = createGlassStyles({ isDark });

  const todaysMetrics = {
    revenue: 2450,
    bookings: 18,
    activeStaff: 6,
    completionRate: 94.2,
    customerSatisfaction: 4.8
  };

  const recentBookings = [
    { id: '1', customer: 'M. Williams', service: 'Premium Detail', status: 'In Progress', amount: 180 },
    { id: '2', customer: 'R. Davis', service: 'Standard Wash', status: 'Completed', amount: 85 },
    { id: '3', customer: 'A. Johnson', service: 'Full Service', status: 'Assigned', amount: 120 },
  ];

  const staffPerformance = [
    { id: '1', name: 'James Wilson', rating: 4.9, completed: 8, earnings: 720 },
    { id: '2', name: 'Sarah Chen', rating: 4.8, completed: 6, earnings: 540 },
    { id: '3', name: 'Mike Thompson', rating: 4.7, completed: 5, earnings: 450 },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return colors.success;
      case 'in progress':
        return '#3b82f6';
      case 'assigned':
        return '#f59e0b';
      default:
        return colors.textSecondary;
    }
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
        ? 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)'
        : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 40,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 32,
    },
    titleSection: {
      flex: 1,
    },
    title: {
      ...glassTypography.largeTitle,
      color: '#7c3aed',
      fontWeight: '700',
    },
    subtitle: {
      ...glassTypography.body,
      color: colors.textSecondary,
      marginTop: 4,
    },
    adminBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#7c3aed' + '15',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 6,
      marginTop: 8,
      borderWidth: 1,
      borderColor: '#7c3aed' + '30',
    },
    badgeIcon: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#7c3aed',
    },
    badgeText: {
      ...glassTypography.caption1,
      color: '#7c3aed',
      fontWeight: '600',
      marginLeft: 6,
    },
    metricsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      marginBottom: 24,
    },
    metricCard: {
      ...glassStyles.glassContainer,
      padding: 18,
      minWidth: '48%',
      flex: 1,
      borderWidth: 1,
      borderColor: colors.primary + '20',
    },
    metricValue: {
      ...glassTypography.title2,
      color: colors.primary,
      fontWeight: '700',
      marginBottom: 4,
    },
    metricLabel: {
      ...glassTypography.caption1,
      color: colors.textSecondary,
      fontWeight: '500',
    },
    metricChange: {
      ...glassTypography.caption2,
      marginTop: 4,
      fontWeight: '600',
    },
    positiveChange: {
      color: colors.success,
    },
    sectionCard: {
      ...glassStyles.glassCard,
      padding: 20,
      marginBottom: 20,
    },
    sectionTitle: {
      ...glassTypography.title3,
      color: colors.text,
      marginBottom: 16,
      fontWeight: '600',
    },
    bookingItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.textSecondary + '15',
    },
    lastBookingItem: {
      borderBottomWidth: 0,
    },
    bookingLeft: {
      flex: 1,
    },
    bookingCustomer: {
      ...glassTypography.callout,
      color: colors.text,
      fontWeight: '600',
    },
    bookingService: {
      ...glassTypography.caption1,
      color: colors.textSecondary,
      marginTop: 2,
    },
    bookingRight: {
      alignItems: 'flex-end',
    },
    bookingAmount: {
      ...glassTypography.callout,
      color: colors.text,
      fontWeight: '700',
    },
    bookingStatus: {
      ...glassTypography.caption1,
      fontWeight: '600',
      marginTop: 2,
    },
    staffItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.textSecondary + '15',
    },
    lastStaffItem: {
      borderBottomWidth: 0,
    },
    staffLeft: {
      flex: 1,
    },
    staffName: {
      ...glassTypography.callout,
      color: colors.text,
      fontWeight: '600',
    },
    staffStats: {
      ...glassTypography.caption1,
      color: colors.textSecondary,
      marginTop: 2,
    },
    staffRight: {
      alignItems: 'flex-end',
    },
    staffEarnings: {
      ...glassTypography.callout,
      color: colors.success,
      fontWeight: '700',
    },
    staffRating: {
      ...glassTypography.caption1,
      color: colors.primary,
      fontWeight: '600',
      marginTop: 2,
    },
    quickActions: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 24,
    },
    actionButton: {
      flex: 1,
      ...glassStyles.glassButton,
      paddingVertical: 16,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.primary + '20',
    },
    actionTitle: {
      ...glassTypography.callout,
      color: colors.text,
      fontWeight: '600',
      marginBottom: 2,
    },
    actionDescription: {
      ...glassTypography.caption2,
      color: colors.textSecondary,
    },
    viewAllButton: {
      ...glassStyles.glassButton,
      paddingVertical: 8,
      paddingHorizontal: 16,
      marginTop: 8,
      alignSelf: 'flex-end',
    },
    viewAllText: {
      ...glassTypography.caption1,
      color: colors.primary,
      fontWeight: '600',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backgroundGradient} />
      <ProfessionalBubbles numBubbles={6} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleSection}>
            <Text style={styles.title}>Admin Dashboard</Text>
            <Text style={styles.subtitle}>Business overview and management</Text>
            <View style={styles.adminBadge}>
              <View style={styles.badgeIcon} />
              <Text style={styles.badgeText}>Administrator</Text>
            </View>
          </View>
          <UserProfile showInHeader />
        </View>

        {/* Key Metrics */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>R{todaysMetrics.revenue.toLocaleString()}</Text>
            <Text style={styles.metricLabel}>Today's Revenue</Text>
            <Text style={[styles.metricChange, styles.positiveChange]}>+12.5%</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{todaysMetrics.bookings}</Text>
            <Text style={styles.metricLabel}>Active Bookings</Text>
            <Text style={[styles.metricChange, styles.positiveChange]}>+8.3%</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{todaysMetrics.activeStaff}</Text>
            <Text style={styles.metricLabel}>Staff Online</Text>
            <Text style={[styles.metricChange, styles.positiveChange]}>+2</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{todaysMetrics.completionRate}%</Text>
            <Text style={styles.metricLabel}>Completion Rate</Text>
            <Text style={[styles.metricChange, styles.positiveChange]}>+1.2%</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionTitle}>Staff</Text>
            <Text style={styles.actionDescription}>Manage team</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionTitle}>Analytics</Text>
            <Text style={styles.actionDescription}>View reports</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionTitle}>Settings</Text>
            <Text style={styles.actionDescription}>Configure</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Bookings */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Recent Bookings</Text>
          {recentBookings.map((booking, index) => (
            <View
              key={booking.id}
              style={[
                styles.bookingItem,
                index === recentBookings.length - 1 && styles.lastBookingItem
              ]}
            >
              <View style={styles.bookingLeft}>
                <Text style={styles.bookingCustomer}>{booking.customer}</Text>
                <Text style={styles.bookingService}>{booking.service}</Text>
              </View>
              <View style={styles.bookingRight}>
                <Text style={styles.bookingAmount}>R{booking.amount}</Text>
                <Text style={[styles.bookingStatus, { color: getStatusColor(booking.status) }]}>
                  {booking.status}
                </Text>
              </View>
            </View>
          ))}
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View All Bookings</Text>
          </TouchableOpacity>
        </View>

        {/* Staff Performance */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Staff Performance Today</Text>
          {staffPerformance.map((staff, index) => (
            <View
              key={staff.id}
              style={[
                styles.staffItem,
                index === staffPerformance.length - 1 && styles.lastStaffItem
              ]}
            >
              <View style={styles.staffLeft}>
                <Text style={styles.staffName}>{staff.name}</Text>
                <Text style={styles.staffStats}>{staff.completed} completed • {staff.rating} rating</Text>
              </View>
              <View style={styles.staffRight}>
                <Text style={styles.staffEarnings}>R{staff.earnings}</Text>
                <Text style={styles.staffRating}>{staff.rating} ⭐</Text>
              </View>
            </View>
          ))}
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>Manage Staff</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}