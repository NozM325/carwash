import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { createGlassStyles, glassColors, glassTypography } from '../styles/glassmorphism';

interface UserProfileProps {
  showInHeader?: boolean;
}

export default function UserProfile({ showInHeader = false }: UserProfileProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { user, logout, updateProfile, isLoading } = useAuth();

  const glassStyles = createGlassStyles({ isDark });
  const colors = isDark ? glassColors.dark : glassColors.light;

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phoneNumber: user?.phoneNumber || ''
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

  const handleSaveProfile = async () => {
    if (!user) return;

    const success = await updateProfile({
      firstName: editedProfile.firstName.trim(),
      lastName: editedProfile.lastName.trim(),
      phoneNumber: editedProfile.phoneNumber.trim()
    });

    if (success) {
      setEditMode(false);
      Alert.alert('Success', 'Profile updated successfully');
    }
  };

  const handleCancelEdit = () => {
    setEditedProfile({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phoneNumber: user?.phoneNumber || ''
    });
    setEditMode(false);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return '👑';
      case 'staff': return '👷';
      case 'customer': return '👤';
      default: return '👤';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return '#FF6B35';
      case 'staff': return '#4ECDC4';
      case 'customer': return colors.primary;
      default: return colors.primary;
    }
  };

  if (!user) return null;

  const styles = StyleSheet.create({
    // Header Profile (Compact)
    headerProfile: {
      flexDirection: 'row',
      alignItems: 'center',
      ...glassStyles.glassContainerSecondary,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
    },
    headerAvatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: getRoleColor(user.role) + '20',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 8,
    },
    headerAvatarText: {
      fontSize: 16,
    },
    headerName: {
      ...glassTypography.callout,
      color: colors.text,
      fontWeight: '600',
    },

    // Full Profile Card
    profileCard: {
      ...glassStyles.glassCard,
      padding: 20,
      marginBottom: 20,
    },
    profileHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    avatar: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: getRoleColor(user.role) + '20',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 16,
    },
    avatarText: {
      fontSize: 24,
    },
    profileInfo: {
      flex: 1,
    },
    userName: {
      ...glassTypography.title3,
      color: colors.text,
      marginBottom: 4,
    },
    userRole: {
      ...glassTypography.callout,
      color: getRoleColor(user.role),
      textTransform: 'capitalize',
      fontWeight: '600',
    },
    userEmail: {
      ...glassTypography.caption1,
      color: colors.textSecondary,
      marginTop: 2,
    },
    profileActions: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 16,
    },
    actionButton: {
      flex: 1,
      backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: isDark ? '#3A3A3C' : '#D1D1D6',
      paddingVertical: 12,
      paddingHorizontal: 16,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 44,
    },
    primaryButton: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    dangerButton: {
      backgroundColor: '#FF3B30',
      borderColor: '#FF3B30',
    },
    buttonText: {
      ...glassTypography.callout,
      textAlign: 'center',
      fontWeight: '600',
      color: colors.text,
    },
    primaryButtonText: {
      color: '#FFFFFF',
    },
    dangerButtonText: {
      color: '#FFFFFF',
    },

    // Modal Styles
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    modalContent: {
      backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
      borderRadius: 16,
      width: '100%',
      maxWidth: 400,
      padding: 24,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 10,
      },
      shadowOpacity: 0.3,
      shadowRadius: 20,
      elevation: 15,
      borderWidth: 1,
      borderColor: isDark ? '#2C2C2E' : '#E5E5E7',
    },
    modalTitle: {
      ...glassTypography.title2,
      color: colors.primary,
      textAlign: 'center',
      marginBottom: 24,
    },
    inputContainer: {
      marginBottom: 16,
    },
    label: {
      ...glassTypography.callout,
      color: colors.text,
      marginBottom: 8,
      fontWeight: '500',
    },
    input: {
      backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: isDark ? '#3A3A3C' : '#D1D1D6',
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
      color: colors.text,
      minHeight: 48,
    },
    disabledInput: {
      opacity: 0.6,
    },
    modalActions: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 24,
    },
    modalButton: {
      flex: 1,
      backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: isDark ? '#3A3A3C' : '#D1D1D6',
      paddingVertical: 14,
      paddingHorizontal: 16,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 48,
    },
    loadingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
  });

  if (showInHeader) {
    return (
      <>
        <TouchableOpacity
          style={styles.headerProfile}
          onPress={() => setShowProfileModal(true)}
        >
          <View style={styles.headerAvatar}>
            <Text style={styles.headerAvatarText}>
              {getRoleIcon(user.role)}
            </Text>
          </View>
          <Text style={styles.headerName}>
            {user.firstName} {user.lastName}
          </Text>
        </TouchableOpacity>

        <Modal
          visible={showProfileModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowProfileModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Profile</Text>

              {/* Profile Display/Edit */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>First Name</Text>
                <TextInput
                  style={[styles.input, !editMode && styles.disabledInput]}
                  value={editedProfile.firstName}
                  onChangeText={(text) => setEditedProfile(prev => ({ ...prev, firstName: text }))}
                  editable={editMode}
                  placeholder="First Name"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Last Name</Text>
                <TextInput
                  style={[styles.input, !editMode && styles.disabledInput]}
                  value={editedProfile.lastName}
                  onChangeText={(text) => setEditedProfile(prev => ({ ...prev, lastName: text }))}
                  editable={editMode}
                  placeholder="Last Name"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={[styles.input, styles.disabledInput]}
                  value={user.email}
                  editable={false}
                  placeholder="Email"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                  style={[styles.input, !editMode && styles.disabledInput]}
                  value={editedProfile.phoneNumber}
                  onChangeText={(text) => setEditedProfile(prev => ({ ...prev, phoneNumber: text }))}
                  editable={editMode}
                  placeholder="Phone Number"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Role</Text>
                <TextInput
                  style={[styles.input, styles.disabledInput]}
                  value={user.role}
                  editable={false}
                  placeholder="Role"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              {/* Modal Actions */}
              <View style={styles.modalActions}>
                {editMode ? (
                  <>
                    <TouchableOpacity
                      style={styles.modalButton}
                      onPress={handleCancelEdit}
                      disabled={isLoading}
                    >
                      <Text style={[styles.buttonText, styles.primaryButtonText]}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.modalButton, styles.primaryButton]}
                      onPress={handleSaveProfile}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <View style={styles.loadingContainer}>
                          <ActivityIndicator size="small" color={colors.primary} />
                          <Text style={[styles.buttonText, styles.primaryButtonText]}>Saving...</Text>
                        </View>
                      ) : (
                        <Text style={[styles.buttonText, styles.primaryButtonText]}>Save</Text>
                      )}
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <TouchableOpacity
                      style={styles.modalButton}
                      onPress={() => setShowProfileModal(false)}
                    >
                      <Text style={[styles.buttonText, styles.primaryButtonText]}>Close</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.modalButton, styles.primaryButton]}
                      onPress={() => setEditMode(true)}
                    >
                      <Text style={[styles.buttonText, styles.primaryButtonText]}>Edit</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>

              {/* Logout Button */}
              {!editMode && (
                <TouchableOpacity
                  style={[styles.modalButton, styles.dangerButton, { marginTop: 12 }]}
                  onPress={() => {
                    setShowProfileModal(false);
                    handleLogout();
                  }}
                >
                  <Text style={[styles.buttonText, styles.dangerButtonText]}>Sign Out</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Modal>
      </>
    );
  }

  return (
    <View style={styles.profileCard}>
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {getRoleIcon(user.role)}
          </Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.userName}>
            {user.firstName} {user.lastName}
          </Text>
          <Text style={styles.userRole}>{user.role}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>
      </View>
      <View style={styles.profileActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.primaryButton]}
          onPress={() => setShowProfileModal(true)}
        >
          <Text style={[styles.buttonText, styles.primaryButtonText]}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.dangerButton]}
          onPress={handleLogout}
        >
          <Text style={[styles.buttonText, styles.dangerButtonText]}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}