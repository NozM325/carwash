import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  Platform,
  Modal,
  Alert
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { createGlassStyles, glassColors, glassTypography } from '../styles/glassmorphism';

interface DateTimePickerSectionProps {
  serviceDate: string;
  setServiceDate: (date: string) => void;
  serviceTime: string;
  setServiceTime: (time: string) => void;
}

export default function DateTimePickerSection({
  serviceDate,
  setServiceDate,
  serviceTime,
  setServiceTime
}: DateTimePickerSectionProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const glassStyles = createGlassStyles({ isDark });
  const colors = isDark ? glassColors.dark : glassColors.light;

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    serviceDate ? new Date(serviceDate) : new Date()
  );
  const [selectedTime, setSelectedTime] = useState(() => {
    if (serviceTime) {
      return new Date(`2023-01-01 ${serviceTime}`);
    }
    // Default to 9:00 AM (within business hours)
    const defaultTime = new Date();
    defaultTime.setHours(9, 0, 0, 0);
    return defaultTime;
  });

  // Predefined time slots (business hours)
  const timeSlots = [
    '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
    '05:00 PM', '05:30 PM'
  ];

  const formatDate = (date: Date): string => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${dayName}, ${day} ${month} ${year}`;
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleDateChange = (_event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (date) {
      setSelectedDate(date);
      setServiceDate(date.toISOString().split('T')[0]); // YYYY-MM-DD format
    }
  };

  const handleTimeChange = (_event: any, time?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    if (time) {
      // Check if time is within business hours (8:00 AM to 5:30 PM)
      const hours = time.getHours();
      const minutes = time.getMinutes();
      const timeInMinutes = hours * 60 + minutes;

      const businessStart = 8 * 60; // 8:00 AM in minutes
      const businessEnd = 17 * 60 + 30; // 5:30 PM in minutes

      if (timeInMinutes < businessStart || timeInMinutes > businessEnd) {
        Alert.alert(
          'Business Hours Only',
          'Please select a time between 8:00 AM and 5:30 PM. These are our operating hours.',
          [{ text: 'OK' }]
        );
        return;
      }

      setSelectedTime(time);
      setServiceTime(formatTime(time));
    }
  };

  const handleTimeSlotPress = (timeSlot: string) => {
    setServiceTime(timeSlot);
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isTomorrow = (date: Date): boolean => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return date.toDateString() === tomorrow.toDateString();
  };

  const getDateDisplayText = (): string => {
    if (!serviceDate) return 'Select Date';

    const date = new Date(serviceDate);
    if (isToday(date)) return `Today, ${formatDate(date).split(', ')[1]}`;
    if (isTomorrow(date)) return `Tomorrow, ${formatDate(date).split(', ')[1]}`;
    return formatDate(date);
  };

  const styles = StyleSheet.create({
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
    label: {
      ...glassTypography.callout,
      color: colors.text,
      marginTop: 12,
      marginBottom: 8,
      fontWeight: '500',
    },
    pickerButton: {
      ...glassStyles.glassInput,
      paddingHorizontal: 16,
      paddingVertical: 16,
      marginBottom: 12,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    pickerButtonText: {
      ...glassTypography.body,
      color: colors.text,
      fontSize: 16,
    },
    pickerButtonPlaceholder: {
      color: colors.textSecondary,
    },
    pickerButtonIcon: {
      fontSize: 18,
    },
    timeSlotsContainer: {
      marginTop: 8,
    },
    timeSlotsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 16,
    },
    timeSlot: {
      ...glassStyles.glassContainerSecondary,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
      minWidth: 80,
      alignItems: 'center',
      borderColor: colors.textSecondary + '40',
    },
    selectedTimeSlot: {
      backgroundColor: isDark
        ? 'rgba(52, 215, 75, 0.25)'
        : 'rgba(52, 199, 89, 0.2)',
      borderColor: colors.success + '80',
    },
    timeSlotText: {
      ...glassTypography.caption1,
      color: colors.textSecondary,
      fontSize: 12,
    },
    selectedTimeSlotText: {
      color: colors.success,
      fontWeight: '600',
    },
    customTimeButton: {
      ...glassStyles.glassButton,
      paddingVertical: 8,
      marginTop: 8,
      backgroundColor: isDark
        ? 'rgba(0, 122, 255, 0.15)'
        : 'rgba(0, 122, 255, 0.1)',
      borderColor: isDark
        ? 'rgba(0, 122, 255, 0.3)'
        : 'rgba(0, 122, 255, 0.2)',
    },
    customTimeButtonText: {
      ...glassTypography.callout,
      color: colors.primary,
      textAlign: 'center',
      fontWeight: '600',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      ...glassStyles.glassCard,
      padding: 20,
      margin: 20,
      width: '80%',
    },
    modalTitle: {
      ...glassTypography.title3,
      color: colors.primary,
      textAlign: 'center',
      marginBottom: 20,
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
      gap: 12,
    },
    modalButton: {
      ...glassStyles.glassButton,
      flex: 1,
      paddingVertical: 12,
    },
    modalButtonText: {
      ...glassTypography.callout,
      textAlign: 'center',
      fontWeight: '600',
    },
    cancelButton: {
      backgroundColor: isDark
        ? 'rgba(255, 59, 48, 0.15)'
        : 'rgba(255, 59, 48, 0.1)',
      borderColor: isDark
        ? 'rgba(255, 59, 48, 0.3)'
        : 'rgba(255, 59, 48, 0.2)',
    },
    cancelButtonText: {
      color: '#FF3B30',
    },
    confirmButton: {
      backgroundColor: isDark
        ? 'rgba(52, 215, 75, 0.25)'
        : 'rgba(52, 199, 89, 0.2)',
      borderColor: isDark
        ? 'rgba(52, 215, 75, 0.4)'
        : 'rgba(52, 199, 89, 0.3)',
    },
    confirmButtonText: {
      color: colors.success,
    },
  });

  return (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>Service Date & Time</Text>

      {/* Date Picker */}
      <Text style={styles.label}>Service Date *</Text>
      <TouchableOpacity
        style={styles.pickerButton}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={[
          styles.pickerButtonText,
          !serviceDate && styles.pickerButtonPlaceholder
        ]}>
          {getDateDisplayText()}
        </Text>
        <Text style={styles.pickerButtonIcon}>📅</Text>
      </TouchableOpacity>

      {/* Time Slots */}
      <Text style={styles.label}>Service Time *</Text>
      <View style={styles.timeSlotsContainer}>
        <View style={styles.timeSlotsGrid}>
          {timeSlots.map((slot) => (
            <TouchableOpacity
              key={slot}
              style={[
                styles.timeSlot,
                serviceTime === slot && styles.selectedTimeSlot
              ]}
              onPress={() => handleTimeSlotPress(slot)}
            >
              <Text style={[
                styles.timeSlotText,
                serviceTime === slot && styles.selectedTimeSlotText
              ]}>
                {slot}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Custom Time Button */}
        <TouchableOpacity
          style={styles.customTimeButton}
          onPress={() => setShowTimePicker(true)}
        >
          <Text style={styles.customTimeButtonText}>
            🕐 {serviceTime && !timeSlots.includes(serviceTime)
              ? `Custom Time: ${serviceTime}`
              : 'Select Custom Time'
            }
          </Text>
        </TouchableOpacity>
      </View>

      {/* Date Picker Modal/Native */}
      {showDatePicker && (
        Platform.OS === 'ios' ? (
          <Modal transparent animationType="fade">
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select Date</Text>
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display="spinner"
                  onChange={handleDateChange}
                  minimumDate={new Date()}
                  textColor={colors.text}
                />
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setShowDatePicker(false)}
                  >
                    <Text style={[styles.modalButtonText, styles.cancelButtonText]}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.confirmButton]}
                    onPress={() => {
                      setServiceDate(selectedDate.toISOString().split('T')[0]);
                      setShowDatePicker(false);
                    }}
                  >
                    <Text style={[styles.modalButtonText, styles.confirmButtonText]}>
                      Confirm
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        ) : (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
            minimumDate={new Date()}
          />
        )
      )}

      {/* Time Picker Modal/Native */}
      {showTimePicker && (
        Platform.OS === 'ios' ? (
          <Modal transparent animationType="fade">
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select Time</Text>
                <DateTimePicker
                  value={selectedTime}
                  mode="time"
                  display="spinner"
                  onChange={handleTimeChange}
                  textColor={colors.text}
                />
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setShowTimePicker(false)}
                  >
                    <Text style={[styles.modalButtonText, styles.cancelButtonText]}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.confirmButton]}
                    onPress={() => {
                      setServiceTime(formatTime(selectedTime));
                      setShowTimePicker(false);
                    }}
                  >
                    <Text style={[styles.modalButtonText, styles.confirmButtonText]}>
                      Confirm
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        ) : (
          <DateTimePicker
            value={selectedTime}
            mode="time"
            display="default"
            onChange={handleTimeChange}
          />
        )
      )}
    </View>
  );
}