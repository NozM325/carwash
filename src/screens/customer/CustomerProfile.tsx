import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  Switch,
  Alert
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { createGlassStyles, glassColors, glassTypography } from '../../styles/glassmorphism';
import ProfessionalBubbles from '../../components/ProfessionalBubbles';

export default function CustomerProfile() {
  const { user, logout } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? glassColors.dark : glassColors.light;
  const glassStyles = createGlassStyles({ isDark });

  const [notifications, setNotifications] = useState({
    bookingUpdates: true,
    promotions: false,
    serviceReminders: true
  });

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => logout()
        }
      ]
    );
  };

  const profileSections = [
    {
      title: 'Account',
      items: [
        { icon: '👤', label: 'Personal Information', action: () => {} },
        { icon: '🚗', label: 'Vehicle Information', action: () => {} },
        { icon: '📍', label: 'Saved Addresses', action: () => {} },
        { icon: '💳', label: 'Payment Methods', action: () => {} }
      ]
    },
    {
      title: 'Preferences',
      items: [
        { icon: '🔔', label: 'Notification Settings', action: () => {} },
        { icon: '🌙', label: 'Dark Mode', action: () => {}, toggle: true },
        { icon: '🌐', label: 'Language', action: () => {} }
      ]
    },
    {
      title: 'Support',
      items: [
        { icon: '❓', label: 'Help & FAQ', action: () => {} },
        { icon: '📞', label: 'Contact Support', action: () => {} },
        { icon: '⭐', label: 'Rate the App', action: () => {} },
        { icon: '📢', label: 'Send Feedback', action: () => {} }
      ]
    },
    {
      title: 'Legal',
      items: [
        { icon: '📄', label: 'Terms of Service', action: () => {} },
        { icon: '🔒', label: 'Privacy Policy', action: () => {} },
        { icon: '📋', label: 'Licenses', action: () => {} }
      ]
    }
  ];

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
    profileHeader: {
      ...glassStyles.glassCard,
      padding: 24,
      alignItems: 'center',
      marginBottom: 24,
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.primary + '20',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    },
    avatarText: {
      fontSize: 32,
    },
    userName: {
      ...glassTypography.title2,
      color: colors.text,
      marginBottom: 4,
    },
    userEmail: {
      ...glassTypography.callout,
      color: colors.textSecondary,
      marginBottom: 16,
    },
    userStats: {
      flexDirection: 'row',
      gap: 24,
    },
    statItem: {
      alignItems: 'center',
    },
    statNumber: {
      ...glassTypography.title3,
      color: colors.primary,
      fontWeight: '600',
    },
    statLabel: {
      ...glassTypography.caption1,
      color: colors.textSecondary,
    },
    section: {
      ...glassStyles.glassContainer,
      padding: 20,
      marginBottom: 16,
    },
    sectionTitle: {
      ...glassTypography.title3,
      color: colors.text,
      marginBottom: 16,
      fontWeight: '600',
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.textSecondary + '20',
    },
    lastMenuItem: {
      borderBottomWidth: 0,
    },
    menuIcon: {
      fontSize: 20,
      width: 30,
      marginRight: 12,
    },
    menuLabel: {
      flex: 1,
      ...glassTypography.callout,
      color: colors.text,
    },
    menuArrow: {
      ...glassTypography.callout,
      color: colors.textSecondary,
    },
    notificationSection: {
      marginTop: 16,
    },
    notificationItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.textSecondary + '20',
    },
    notificationLabel: {
      ...glassTypography.callout,
      color: colors.text,
    },
    logoutButton: {
      ...glassStyles.glassButton,
      paddingVertical: 16,
      backgroundColor: '#FF3B30' + '20',
      borderColor: '#FF3B30' + '40',
      marginTop: 24,
    },
    logoutButtonText: {
      ...glassTypography.headline,
      color: '#FF3B30',
      textAlign: 'center',
      fontWeight: '600',
    },
  });

  if (!user) return null;

  return (
    <View style={styles.container}>
      <View style={styles.backgroundGradient} />
      <ProfessionalBubbles numBubbles={6} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user.role === 'admin' ? '👑' : user.role === 'staff' ? '👷' : '👤'}
            </Text>
          </View>
          <Text style={styles.userName}>
            {user.firstName} {user.lastName}
          </Text>
          <Text style={styles.userEmail}>{user.email}</Text>

          <View style={styles.userStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Services</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>4.9</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>3</Text>
              <Text style={styles.statLabel}>Vehicles</Text>
            </View>
          </View>
        </View>

        {/* Profile Sections */}
        {profileSections.map((section, sectionIndex) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>

            {section.items.map((item, itemIndex) => (
              <TouchableOpacity
                key={item.label}
                style={[
                  styles.menuItem,
                  itemIndex === section.items.length - 1 && styles.lastMenuItem
                ]}
                onPress={item.action}
              >
                <Text style={styles.menuIcon}>{item.icon}</Text>
                <Text style={styles.menuLabel}>{item.label}</Text>
                {item.toggle ? (
                  <Switch
                    value={isDark}
                    onValueChange={() => {}}
                    trackColor={{
                      false: colors.textSecondary + '40',
                      true: colors.primary + '60'
                    }}
                    thumbColor={isDark ? colors.primary : '#f4f3f4'}
                  />
                ) : (
                  <Text style={styles.menuArrow}>›</Text>
                )}
              </TouchableOpacity>
            ))}

            {/* Special handling for notification section */}
            {section.title === 'Preferences' && (
              <View style={styles.notificationSection}>
                <View style={styles.notificationItem}>
                  <Text style={styles.notificationLabel}>Booking Updates</Text>
                  <Switch
                    value={notifications.bookingUpdates}
                    onValueChange={(value) =>
                      setNotifications(prev => ({ ...prev, bookingUpdates: value }))
                    }
                    trackColor={{
                      false: colors.textSecondary + '40',
                      true: colors.primary + '60'
                    }}
                    thumbColor={notifications.bookingUpdates ? colors.primary : '#f4f3f4'}
                  />
                </View>
                <View style={styles.notificationItem}>
                  <Text style={styles.notificationLabel}>Promotions</Text>
                  <Switch
                    value={notifications.promotions}
                    onValueChange={(value) =>
                      setNotifications(prev => ({ ...prev, promotions: value }))
                    }
                    trackColor={{
                      false: colors.textSecondary + '40',
                      true: colors.primary + '60'
                    }}
                    thumbColor={notifications.promotions ? colors.primary : '#f4f3f4'}
                  />
                </View>
                <View style={[styles.notificationItem, styles.lastMenuItem]}>
                  <Text style={styles.notificationLabel}>Service Reminders</Text>
                  <Switch
                    value={notifications.serviceReminders}
                    onValueChange={(value) =>
                      setNotifications(prev => ({ ...prev, serviceReminders: value }))
                    }
                    trackColor={{
                      false: colors.textSecondary + '40',
                      true: colors.primary + '60'
                    }}
                    thumbColor={notifications.serviceReminders ? colors.primary : '#f4f3f4'}
                  />
                </View>
              </View>
            )}
          </View>
        ))}

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}