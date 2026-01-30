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

export default function StaffDashboard() {
  const { user } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? glassColors.dark : glassColors.light;
  const glassStyles = createGlassStyles({ isDark });

  const mockJobs = [
    {
      id: '1',
      customer: 'J. Smith',
      customerPhone: '+27 11 123 4567',
      service: 'Full Service Detail',
      location: '123 Douglas St, Johannesburg',
      time: '10:30 AM',
      earnings: 120,
      distance: '2.5km',
      priority: 'High'
    },
    {
      id: '2',
      customer: 'S. Johnson',
      customerPhone: '+27 11 765 4321',
      service: 'Standard Wash',
      location: '456 Main Rd, Sandton',
      time: '2:00 PM',
      earnings: 80,
      distance: '1.8km',
      priority: 'Standard'
    }
  ];

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
        ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
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
      color: '#2563eb',
      fontWeight: '700',
    },
    staffBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#2563eb' + '15',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 6,
      marginTop: 8,
      borderWidth: 1,
      borderColor: '#2563eb' + '30',
    },
    badgeText: {
      ...glassTypography.caption1,
      color: '#2563eb',
      fontWeight: '600',
      marginLeft: 4,
    },
    badgeIcon: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#2563eb',
    },
    statsGrid: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 24,
    },
    statCard: {
      flex: 1,
      ...glassStyles.glassContainer,
      padding: 18,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.primary + '20',
    },
    statNumber: {
      ...glassTypography.title2,
      color: colors.primary,
      fontWeight: '700',
      marginBottom: 4,
    },
    statLabel: {
      ...glassTypography.caption1,
      color: colors.textSecondary,
      textAlign: 'center',
      fontWeight: '500',
    },
    availableJobsCard: {
      ...glassStyles.glassCard,
      padding: 20,
      marginBottom: 24,
    },
    sectionTitle: {
      ...glassTypography.title3,
      color: colors.text,
      marginBottom: 16,
      fontWeight: '600',
    },
    jobCard: {
      ...glassStyles.glassContainerSecondary,
      padding: 18,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.textSecondary + '15',
    },
    jobHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    customerInfo: {
      flex: 1,
    },
    customerName: {
      ...glassTypography.callout,
      color: colors.text,
      fontWeight: '600',
    },
    customerPhone: {
      ...glassTypography.caption1,
      color: colors.textSecondary,
      marginTop: 2,
    },
    earnings: {
      ...glassTypography.callout,
      color: colors.success,
      fontWeight: '700',
    },
    serviceType: {
      ...glassTypography.body,
      color: colors.primary,
      marginBottom: 6,
      fontWeight: '500',
    },
    jobDetails: {
      ...glassTypography.caption1,
      color: colors.textSecondary,
      marginBottom: 10,
      lineHeight: 16,
    },
    jobFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    timeDistance: {
      ...glassTypography.caption1,
      color: colors.textSecondary,
      fontWeight: '500',
    },
    acceptButton: {
      ...glassStyles.glassButton,
      paddingHorizontal: 18,
      paddingVertical: 8,
      backgroundColor: colors.success + '20',
      borderColor: colors.success + '40',
    },
    acceptButtonText: {
      ...glassTypography.callout,
      color: colors.success,
      fontWeight: '600',
    },
    quickActions: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 24,
    },
    actionButton: {
      flex: 1,
      ...glassStyles.glassButton,
      paddingVertical: 18,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.primary + '20',
    },
    actionLabel: {
      ...glassTypography.callout,
      color: colors.text,
      fontWeight: '600',
      marginTop: 6,
    },
    actionDescription: {
      ...glassTypography.caption2,
      color: colors.textSecondary,
      marginTop: 2,
    },
    statusCard: {
      ...glassStyles.glassContainer,
      padding: 20,
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 24,
      borderWidth: 1,
      borderColor: colors.success + '30',
    },
    statusIndicator: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: colors.success,
      marginRight: 12,
    },
    statusText: {
      flex: 1,
    },
    statusTitle: {
      ...glassTypography.callout,
      color: colors.text,
      fontWeight: '600',
    },
    statusSubtitle: {
      ...glassTypography.caption1,
      color: colors.textSecondary,
      marginTop: 2,
    },
    priorityBadge: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 4,
      marginLeft: 8,
    },
    highPriority: {
      backgroundColor: '#ef4444' + '20',
    },
    standardPriority: {
      backgroundColor: colors.textSecondary + '20',
    },
    priorityText: {
      ...glassTypography.caption2,
      fontWeight: '600',
      fontSize: 10,
    },
    highPriorityText: {
      color: '#ef4444',
    },
    standardPriorityText: {
      color: colors.textSecondary,
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
        {/* Header with Greeting and Profile */}
        <View style={styles.header}>
          <View style={styles.greetingContainer}>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.userName}>{user?.firstName}</Text>
            <View style={styles.staffBadge}>
              <View style={styles.badgeIcon} />
              <Text style={styles.badgeText}>Service Technician</Text>
            </View>
          </View>
          <UserProfile showInHeader />
        </View>

        {/* Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusIndicator} />
          <View style={styles.statusText}>
            <Text style={styles.statusTitle}>Available for Service</Text>
            <Text style={styles.statusSubtitle}>Ready to accept appointments in your area</Text>
          </View>
        </View>

        {/* Daily Performance */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>R680</Text>
            <Text style={styles.statLabel}>Today's Earnings</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>4.9</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionLabel}>Navigation</Text>
            <Text style={styles.actionDescription}>GPS to location</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionLabel}>Customer</Text>
            <Text style={styles.actionDescription}>Call client</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionLabel}>Document</Text>
            <Text style={styles.actionDescription}>Photo upload</Text>
          </TouchableOpacity>
        </View>

        {/* Available Assignments */}
        <View style={styles.availableJobsCard}>
          <Text style={styles.sectionTitle}>Available Assignments</Text>

          {mockJobs.map((job) => (
            <View key={job.id} style={styles.jobCard}>
              <View style={styles.jobHeader}>
                <View style={styles.customerInfo}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.customerName}>{job.customer}</Text>
                    <View style={[
                      styles.priorityBadge,
                      job.priority === 'High' ? styles.highPriority : styles.standardPriority
                    ]}>
                      <Text style={[
                        styles.priorityText,
                        job.priority === 'High' ? styles.highPriorityText : styles.standardPriorityText
                      ]}>
                        {job.priority.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.customerPhone}>{job.customerPhone}</Text>
                </View>
                <Text style={styles.earnings}>R{job.earnings}</Text>
              </View>

              <Text style={styles.serviceType}>{job.service}</Text>
              <Text style={styles.jobDetails}>{job.location}</Text>

              <View style={styles.jobFooter}>
                <Text style={styles.timeDistance}>{job.time} • {job.distance}</Text>
                <TouchableOpacity style={styles.acceptButton}>
                  <Text style={styles.acceptButtonText}>Accept</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}