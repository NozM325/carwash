import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert, Linking, useColorScheme } from 'react-native';
import { BookingData } from '../../types/booking';
import ProfessionalBubbles from '../../components/ProfessionalBubbles';
import { createGlassStyles, glassColors, glassTypography } from '../../styles/glassmorphism';

// Mock assigned task for staff member
const mockTask: BookingData = {
  id: '001',
  customerName: 'John Doe',
  phoneNumber: '0721234567',
  serviceDate: new Date(),
  serviceTime: '09:00 AM',
  vehicleRegistration: 'ABC123GP',
  vehicleType: 'Sedan',
  carBrand: 'Toyota',
  washType: 'Deep Clean',
  location: { latitude: -26.1234, longitude: 28.5678, address: 'Kempton Park' },
  physicalAddress: '123 Test Street, Kempton Park, 1619',
  additionalInstructions: 'Please wash carefully - new car. Gate code is 1234. Park in the driveway.',
  basePrice: 150,
  distanceMarkup: 50,
  totalAmount: 200,
  distanceFromBase: 8,
  paymentMethod: 'Instant EFT',
  paymentStatus: 'Completed',
  status: 'Confirmed',
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-15')
};

export default function TaskDetailScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Create glass styles based on theme
  const glassStyles = createGlassStyles({ isDark });
  const colors = isDark ? glassColors.dark : glassColors.light;

  const [currentTask, setCurrentTask] = useState<BookingData>(mockTask);
  const [taskStarted, setTaskStarted] = useState<boolean>(false);

  const handleStartTask = () => {
    setTaskStarted(true);
    setCurrentTask(prev => ({ ...prev, status: 'In Progress', updatedAt: new Date() }));
    Alert.alert('Task Started', 'You have started this car wash service. Navigate to customer location.');
  };

  const handleCompleteTask = () => {
    Alert.alert(
      'Complete Task',
      'Are you sure you want to mark this task as completed?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Complete',
          onPress: () => {
            setCurrentTask(prev => ({ ...prev, status: 'Completed', updatedAt: new Date() }));
            Alert.alert('Task Completed', 'Great job! The customer will be notified.');
          }
        }
      ]
    );
  };

  const handleCallCustomer = () => {
    Linking.openURL(`tel:${currentTask.phoneNumber}`);
  };

  const handleGetDirections = () => {
    // Mock navigation - in Phase 2 this would open GPS navigation
    const address = encodeURIComponent(currentTask.physicalAddress);
    const url = `https://www.google.com/maps/search/?api=1&query=${address}`;
    Linking.openURL(url);
  };

  const handleWhatsAppCustomer = () => {
    // Mock WhatsApp - in Phase 2 this would integrate with WhatsApp Business API
    const message = encodeURIComponent(`Hi ${currentTask.customerName}, I'm on my way to provide your car wash service. I'll be there around ${currentTask.serviceTime}.`);
    Linking.openURL(`https://wa.me/${currentTask.phoneNumber.replace(/^0/, '27')}?text=${message}`);
  };

  const getStatusColor = () => {
    switch (currentTask.status) {
      case 'Confirmed': return '#27ae60';
      case 'In Progress': return '#3498db';
      case 'Completed': return '#2c3e50';
      default: return '#95a5a6';
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
    statusCard: {
      ...glassStyles.glassContainer,
      padding: 20,
      marginBottom: 20,
    },
    statusHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    statusBadge: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 16,
    },
    statusText: {
      ...glassTypography.callout,
      color: 'white',
      fontWeight: '600',
    },
    taskId: {
      ...glassTypography.headline,
      color: colors.text,
      fontWeight: '600',
    },
    sectionCard: {
      ...glassStyles.glassContainer,
      padding: 20,
      marginBottom: 20,
    },
    sectionTitle: {
      ...glassTypography.title3,
      color: colors.primary,
      marginBottom: 16,
    },
    customerName: {
      ...glassTypography.title2,
      color: colors.text,
      marginBottom: 8,
    },
    detailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 12,
      gap: 16,
    },
    label: {
      ...glassTypography.callout,
      color: colors.text,
      fontWeight: '600',
      flex: 1,
    },
    detail: {
      ...glassTypography.callout,
      color: colors.textSecondary,
      flex: 1.5,
      textAlign: 'right',
    },
    priceText: {
      ...glassTypography.headline,
      color: colors.success,
      fontWeight: '600',
      flex: 1.5,
      textAlign: 'right',
    },
    address: {
      ...glassTypography.body,
      color: colors.text,
      marginBottom: 8,
      lineHeight: 20,
    },
    distance: {
      ...glassTypography.callout,
      color: colors.textSecondary,
      marginBottom: 16,
    },
    instructionsContainer: {
      ...glassStyles.glassContainerSecondary,
      padding: 16,
      borderLeftWidth: 4,
      borderLeftColor: colors.warning,
    },
    instructions: {
      ...glassTypography.body,
      color: colors.text,
      lineHeight: 20,
    },
    actionRow: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 16,
    },
    actionButton: {
      ...glassStyles.glassButton,
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    callButton: {
      backgroundColor: isDark
        ? 'rgba(10, 132, 255, 0.25)'
        : 'rgba(0, 122, 255, 0.2)',
      borderColor: isDark
        ? 'rgba(10, 132, 255, 0.4)'
        : 'rgba(0, 122, 255, 0.3)',
    },
    whatsappButton: {
      backgroundColor: isDark
        ? 'rgba(52, 215, 75, 0.25)'
        : 'rgba(52, 199, 89, 0.2)',
      borderColor: isDark
        ? 'rgba(52, 215, 75, 0.4)'
        : 'rgba(52, 199, 89, 0.3)',
    },
    actionButtonText: {
      ...glassTypography.callout,
      color: colors.text,
      fontWeight: '600',
      textAlign: 'center',
    },
    directionsButton: {
      ...glassStyles.glassButton,
      paddingVertical: 12,
      backgroundColor: isDark
        ? 'rgba(255, 159, 10, 0.25)'
        : 'rgba(255, 149, 0, 0.2)',
      borderColor: isDark
        ? 'rgba(255, 159, 10, 0.4)'
        : 'rgba(255, 149, 0, 0.3)',
    },
    directionsButtonText: {
      ...glassTypography.callout,
      color: colors.text,
      fontWeight: '600',
      textAlign: 'center',
    },
    taskActionsCard: {
      ...glassStyles.glassContainer,
      padding: 20,
      marginBottom: 20,
    },
    startButton: {
      ...glassStyles.glassButton,
      paddingVertical: 18,
      backgroundColor: isDark
        ? 'rgba(52, 215, 75, 0.25)'
        : 'rgba(52, 199, 89, 0.2)',
      borderColor: isDark
        ? 'rgba(52, 215, 75, 0.4)'
        : 'rgba(52, 199, 89, 0.3)',
    },
    startButtonText: {
      ...glassTypography.headline,
      color: colors.success,
      fontWeight: '600',
      textAlign: 'center',
    },
    completeButton: {
      ...glassStyles.glassButton,
      paddingVertical: 18,
      backgroundColor: isDark
        ? 'rgba(10, 132, 255, 0.25)'
        : 'rgba(0, 122, 255, 0.2)',
      borderColor: isDark
        ? 'rgba(10, 132, 255, 0.4)'
        : 'rgba(0, 122, 255, 0.3)',
    },
    completeButtonText: {
      ...glassTypography.headline,
      color: colors.primary,
      fontWeight: '600',
      textAlign: 'center',
    },
    completedIndicator: {
      ...glassStyles.glassContainer,
      padding: 20,
      alignItems: 'center',
      backgroundColor: isDark
        ? 'rgba(52, 215, 75, 0.1)'
        : 'rgba(52, 199, 89, 0.08)',
      borderColor: isDark
        ? 'rgba(52, 215, 75, 0.3)'
        : 'rgba(52, 199, 89, 0.25)',
    },
    completedText: {
      ...glassTypography.headline,
      color: colors.success,
      fontWeight: '600',
      marginBottom: 8,
    },
    completedSubtext: {
      ...glassTypography.callout,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    emergencyCard: {
      ...glassStyles.glassContainer,
      padding: 20,
      marginBottom: 40,
      backgroundColor: isDark
        ? 'rgba(255, 69, 58, 0.1)'
        : 'rgba(255, 59, 48, 0.08)',
      borderColor: isDark
        ? 'rgba(255, 69, 58, 0.3)'
        : 'rgba(255, 59, 48, 0.25)',
    },
    emergencyTitle: {
      ...glassTypography.headline,
      color: colors.error,
      fontWeight: '600',
      marginBottom: 12,
      textAlign: 'center',
    },
    emergencyButton: {
      ...glassStyles.glassButton,
      paddingVertical: 12,
      backgroundColor: isDark
        ? 'rgba(255, 69, 58, 0.25)'
        : 'rgba(255, 59, 48, 0.2)',
      borderColor: isDark
        ? 'rgba(255, 69, 58, 0.4)'
        : 'rgba(255, 59, 48, 0.3)',
    },
    emergencyButtonText: {
      ...glassTypography.callout,
      color: colors.error,
      fontWeight: '600',
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      <View style={styles.backgroundGradient} />

      {/* Professional Bubble Animation */}
      <ProfessionalBubbles numBubbles={3} />

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerCard}>
          <Text style={styles.title}>Current Task</Text>
          <Text style={styles.subtitle}>Service assignment details</Text>
        </View>

        {/* Task Status */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
              <Text style={styles.statusText}>{currentTask.status}</Text>
            </View>
            <Text style={styles.taskId}>Task #{currentTask.id}</Text>
          </View>
        </View>

        {/* Customer Information */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Customer Information</Text>
          <Text style={styles.customerName}>{currentTask.customerName}</Text>
          <Text style={styles.detail}>{currentTask.phoneNumber}</Text>

          <View style={styles.actionRow}>
            <TouchableOpacity style={[styles.actionButton, styles.callButton]} onPress={handleCallCustomer}>
              <Text style={styles.actionButtonText}>Call</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.whatsappButton]} onPress={handleWhatsAppCustomer}>
              <Text style={styles.actionButtonText}>WhatsApp</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Service Details */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Service Details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Date & Time</Text>
            <Text style={styles.detail}>
              {currentTask.serviceDate.toDateString()} at {currentTask.serviceTime}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Service Type</Text>
            <Text style={styles.detail}>{currentTask.washType}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Vehicle</Text>
            <Text style={styles.detail}>
              {currentTask.vehicleType} • {currentTask.carBrand} • {currentTask.vehicleRegistration}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Service Fee</Text>
            <Text style={styles.priceText}>R{currentTask.totalAmount}</Text>
          </View>
        </View>

        {/* Location */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Location</Text>
          <Text style={styles.address}>{currentTask.physicalAddress}</Text>
          <Text style={styles.distance}>Distance: {currentTask.distanceFromBase}km from base</Text>

          <TouchableOpacity style={styles.directionsButton} onPress={handleGetDirections}>
            <Text style={styles.directionsButtonText}>Get Directions</Text>
          </TouchableOpacity>
        </View>

        {/* Special Instructions */}
        {currentTask.additionalInstructions && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Special Instructions</Text>
            <View style={styles.instructionsContainer}>
              <Text style={styles.instructions}>{currentTask.additionalInstructions}</Text>
            </View>
          </View>
        )}

        {/* Task Actions */}
        <View style={styles.taskActionsCard}>
          {currentTask.status === 'Confirmed' && !taskStarted && (
            <TouchableOpacity style={styles.startButton} onPress={handleStartTask}>
              <Text style={styles.startButtonText}>Start Task</Text>
            </TouchableOpacity>
          )}

          {(currentTask.status === 'In Progress' || taskStarted) && currentTask.status !== 'Completed' && (
            <TouchableOpacity style={styles.completeButton} onPress={handleCompleteTask}>
              <Text style={styles.completeButtonText}>Complete Task</Text>
            </TouchableOpacity>
          )}

          {currentTask.status === 'Completed' && (
            <View style={styles.completedIndicator}>
              <Text style={styles.completedText}>Task Completed</Text>
              <Text style={styles.completedSubtext}>Great job! Customer has been notified.</Text>
            </View>
          )}
        </View>

        {/* Emergency Contact */}
        <View style={styles.emergencyCard}>
          <Text style={styles.emergencyTitle}>Need Help?</Text>
          <TouchableOpacity
            style={styles.emergencyButton}
            onPress={() => Linking.openURL('tel:+27123456789')}>
            <Text style={styles.emergencyButtonText}>Contact Supervisor</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}