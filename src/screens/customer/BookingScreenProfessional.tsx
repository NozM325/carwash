import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, useColorScheme, Platform } from 'react-native';
import { calculateShybayPrice } from '../../utils/PricingEngine';
import { VehicleType, CarBrand, WashType, BookingData } from '../../types/booking';
import ProfessionalBubbles from '../../components/ProfessionalBubbles';
import LocationAddressSection from '../../components/LocationAddressSection';
import DateTimePickerSection from '../../components/DateTimePickerSection';
import MapLocationPicker from '../../components/MapLocationPicker';
import UserProfile from '../../components/UserProfile';
import { useAuth } from '../../context/AuthContext';
import { createGlassStyles, glassColors, glassTypography } from '../../styles/glassmorphism';

export default function BookingScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { user } = useAuth();

  // Create glass styles based on theme
  const glassStyles = createGlassStyles({ isDark });
  const colors = isDark ? glassColors.dark : glassColors.light;

  // Form state - pre-populate with user data if available
  const [customerName, setCustomerName] = useState<string>(
    user ? `${user.firstName} ${user.lastName}` : ''
  );
  const [phoneNumber, setPhoneNumber] = useState<string>(user?.phoneNumber || '');
  const [vehicleType, setVehicleType] = useState<VehicleType>('Sedan');
  const [carBrand, setCarBrand] = useState<CarBrand>('Toyota');
  const [vehicleRegistration, setVehicleRegistration] = useState<string>('');
  const [washType, setWashType] = useState<WashType>('Basic Wash');
  const [serviceDate, setServiceDate] = useState<string>('');
  const [serviceTime, setServiceTime] = useState<string>('');
  const [distance, setDistance] = useState<string>('0');
  const [physicalAddress, setPhysicalAddress] = useState<string>('');
  const [additionalInstructions, setAdditionalInstructions] = useState<string>('');
  const [useMapPicker, setUseMapPicker] = useState<boolean>(false);

  const priceCalculation = calculateShybayPrice(vehicleType, parseFloat(distance) || 0);

  // Options
  const vehicleTypes: VehicleType[] = ['Hatchback', 'Sedan', 'SUV', 'Minibus', 'Bakkie'];
  const carBrands: CarBrand[] = ['BMW', 'Mercedes', 'Toyota', 'Volkswagen', 'Ford', 'Nissan', 'Audi', 'Other'];
  const washTypes: WashType[] = ['Basic Wash', 'Wash & Dry', 'Deep Clean', 'Full Service', 'Interior & Exterior'];

  const handleBooking = () => {
    // Validation
    if (!customerName.trim()) {
      Alert.alert('Missing Information', 'Please enter your full name');
      return;
    }
    if (!phoneNumber.trim()) {
      Alert.alert('Missing Information', 'Please enter your phone number');
      return;
    }
    if (!vehicleRegistration.trim()) {
      Alert.alert('Missing Information', 'Please enter vehicle registration number');
      return;
    }
    if (!serviceDate.trim()) {
      Alert.alert('Missing Information', 'Please select service date');
      return;
    }
    if (!serviceTime.trim()) {
      Alert.alert('Missing Information', 'Please select service time');
      return;
    }
    if (!physicalAddress.trim()) {
      Alert.alert('Missing Information', 'Please enter your physical address');
      return;
    }
    if (priceCalculation.error) {
      Alert.alert('Service Area Error', priceCalculation.error);
      return;
    }

    // Mock booking creation with user information
    const booking: Partial<BookingData> & { userId?: string; userEmail?: string } = {
      userId: user?.id,
      userEmail: user?.email,
      customerName: customerName.trim(),
      phoneNumber: phoneNumber.trim(),
      vehicleType,
      carBrand,
      vehicleRegistration: vehicleRegistration.trim(),
      washType,
      serviceDate: serviceDate ? new Date(serviceDate) : new Date(),
      serviceTime,
      physicalAddress: physicalAddress.trim(),
      additionalInstructions: additionalInstructions.trim(),
      basePrice: priceCalculation.base,
      distanceMarkup: priceCalculation.markup,
      totalAmount: priceCalculation.total,
      distanceFromBase: parseFloat(distance) || 0,
      paymentMethod: 'Instant EFT',
      paymentStatus: 'Pending',
      status: 'Pending Payment'
    };

    console.log('Booking created:', booking);
    Alert.alert(
      'Booking Confirmed!',
      `Thank you ${user?.firstName || 'Customer'}! Your car wash service has been booked for ${serviceDate} at ${serviceTime}. Total amount: R${priceCalculation.total}. Proceeding to payment...`,
      [{ text: 'Continue to Payment', onPress: () => console.log('Navigate to payment') }]
    );
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
      padding: 24,
      marginBottom: 24,
    },
    headerTop: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    headerText: {
      flex: 1,
      marginRight: 16,
    },
    title: {
      ...glassTypography.title1,
      color: colors.primary,
      marginBottom: 8,
    },
    subtitle: {
      ...glassTypography.callout,
      color: colors.textSecondary,
    },
    headerProfile: {
      flexShrink: 0,
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
    label: {
      ...glassTypography.callout,
      color: colors.text,
      marginTop: 12,
      marginBottom: 8,
      fontWeight: '500',
    },
    input: {
      ...glassStyles.glassInput,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
      color: colors.text,
      marginBottom: 12,
    },
    chipContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 16,
    },
    chip: {
      ...glassStyles.glassContainerSecondary,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderColor: colors.textSecondary + '40',
    },
    activeChip: {
      backgroundColor: isDark
        ? 'rgba(10, 132, 255, 0.25)'
        : 'rgba(0, 122, 255, 0.2)',
      borderColor: colors.primary + '80',
    },
    chipText: {
      ...glassTypography.callout,
      color: colors.textSecondary,
    },
    activeChipText: {
      color: colors.primary,
      fontWeight: '600',
    },
    priceCard: {
      ...glassStyles.glassCard,
      padding: 24,
      marginBottom: 24,
      backgroundColor: isDark
        ? 'rgba(52, 215, 75, 0.1)'
        : 'rgba(52, 199, 89, 0.08)',
      borderColor: isDark
        ? 'rgba(52, 215, 75, 0.3)'
        : 'rgba(52, 199, 89, 0.25)',
    },
    priceTitle: {
      ...glassTypography.title3,
      color: colors.success,
      textAlign: 'center',
      marginBottom: 12,
    },
    priceDetail: {
      ...glassTypography.body,
      color: colors.text,
      textAlign: 'center',
      marginBottom: 4,
    },
    totalPrice: {
      ...glassTypography.largeTitle,
      color: colors.success,
      textAlign: 'center',
      marginTop: 8,
    },
    errorText: {
      ...glassTypography.headline,
      color: '#FF3B30',
      textAlign: 'center',
    },
    bookButton: {
      ...glassStyles.glassButton,
      paddingVertical: 18,
      marginBottom: 40,
      backgroundColor: isDark
        ? 'rgba(52, 215, 75, 0.25)'
        : 'rgba(52, 199, 89, 0.2)',
      borderColor: isDark
        ? 'rgba(52, 215, 75, 0.4)'
        : 'rgba(52, 199, 89, 0.3)',
    },
    disabledButton: {
      backgroundColor: isDark
        ? 'rgba(255, 255, 255, 0.05)'
        : 'rgba(255, 255, 255, 0.1)',
      borderColor: isDark
        ? 'rgba(255, 255, 255, 0.1)'
        : 'rgba(255, 255, 255, 0.2)',
    },
    buttonText: {
      ...glassTypography.headline,
      color: colors.success,
      textAlign: 'center',
    },
    disabledButtonText: {
      color: colors.textSecondary,
    },
    toggleContainer: {
      flexDirection: 'row',
      backgroundColor: isDark
        ? 'rgba(255, 255, 255, 0.05)'
        : 'rgba(0, 0, 0, 0.05)',
      borderRadius: 12,
      padding: 4,
      gap: 4,
    },
    toggleButton: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      alignItems: 'center',
      backgroundColor: 'transparent',
    },
    activeToggle: {
      backgroundColor: isDark
        ? 'rgba(0, 122, 255, 0.25)'
        : 'rgba(0, 122, 255, 0.2)',
    },
    toggleText: {
      ...glassTypography.callout,
      color: colors.textSecondary,
      fontWeight: '500',
    },
    activeToggleText: {
      color: colors.primary,
      fontWeight: '600',
    },
    webNotice: {
      ...glassStyles.glassContainerSecondary,
      padding: 12,
      marginTop: 12,
      backgroundColor: isDark
        ? 'rgba(255, 149, 0, 0.1)'
        : 'rgba(255, 149, 0, 0.05)',
      borderColor: isDark
        ? 'rgba(255, 149, 0, 0.2)'
        : 'rgba(255, 149, 0, 0.15)',
    },
    webNoticeText: {
      ...glassTypography.caption1,
      color: isDark ? '#FF9500' : '#FF8C00',
      textAlign: 'center',
      lineHeight: 18,
    },
  });

  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      <View style={styles.backgroundGradient} />

      {/* Professional Bubble Animation */}
      <ProfessionalBubbles numBubbles={5} />

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Header with User Profile */}
        <View style={styles.headerCard}>
          <View style={styles.headerTop}>
            <View style={styles.headerText}>
              <Text style={styles.title}>Book Car Wash Service</Text>
              <Text style={styles.subtitle}>Professional mobile service at your location</Text>
            </View>
            {user && (
              <View style={styles.headerProfile}>
                <UserProfile showInHeader={true} />
              </View>
            )}
          </View>
        </View>

        {/* Customer Information */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Customer Information</Text>
          <TextInput
            style={styles.input}
            placeholder="Full Name *"
            placeholderTextColor={colors.textSecondary}
            value={customerName}
            onChangeText={setCustomerName}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number *"
            placeholderTextColor={colors.textSecondary}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
        </View>

        {/* Vehicle Information */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Vehicle Information</Text>
          <TextInput
            style={styles.input}
            placeholder="Vehicle Registration *"
            placeholderTextColor={colors.textSecondary}
            value={vehicleRegistration}
            onChangeText={setVehicleRegistration}
            autoCapitalize="characters"
          />

          <Text style={styles.label}>Vehicle Type</Text>
          <View style={styles.chipContainer}>
            {vehicleTypes.map((type) => (
              <TouchableOpacity
                key={type}
                onPress={() => setVehicleType(type)}
                style={[styles.chip, vehicleType === type && styles.activeChip]}>
                <Text style={[styles.chipText, vehicleType === type && styles.activeChipText]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Car Brand</Text>
          <View style={styles.chipContainer}>
            {carBrands.map((brand) => (
              <TouchableOpacity
                key={brand}
                onPress={() => setCarBrand(brand)}
                style={[styles.chip, carBrand === brand && styles.activeChip]}>
                <Text style={[styles.chipText, carBrand === brand && styles.activeChipText]}>
                  {brand}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Service Details */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Service Details</Text>

          <Text style={styles.label}>Type of Wash</Text>
          <View style={styles.chipContainer}>
            {washTypes.map((type) => (
              <TouchableOpacity
                key={type}
                onPress={() => setWashType(type)}
                style={[styles.chip, washType === type && styles.activeChip]}>
                <Text style={[styles.chipText, washType === type && styles.activeChipText]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Date & Time Selection */}
        <DateTimePickerSection
          serviceDate={serviceDate}
          setServiceDate={setServiceDate}
          serviceTime={serviceTime}
          setServiceTime={setServiceTime}
        />

        {/* Location Picker Toggle */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Choose Location Method</Text>
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[styles.toggleButton, !useMapPicker && styles.activeToggle]}
              onPress={() => setUseMapPicker(false)}
            >
              <Text style={[styles.toggleText, !useMapPicker && styles.activeToggleText]}>
                📝 Form Input
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleButton, useMapPicker && styles.activeToggle]}
              onPress={() => setUseMapPicker(true)}
            >
              <Text style={[styles.toggleText, useMapPicker && styles.activeToggleText]}>
                🗺️ Google Maps {Platform.OS === 'web' && '(Mobile Only)'}
              </Text>
            </TouchableOpacity>
          </View>
          {useMapPicker && Platform.OS === 'web' && (
            <View style={styles.webNotice}>
              <Text style={styles.webNoticeText}>
                💡 Interactive maps work best on mobile devices. For web testing, the form input mode is recommended.
              </Text>
            </View>
          )}
        </View>

        {/* Location Picker - Conditional Rendering */}
        {useMapPicker ? (
          <MapLocationPicker
            physicalAddress={physicalAddress}
            setPhysicalAddress={setPhysicalAddress}
            distance={distance}
            setDistance={setDistance}
            additionalInstructions={additionalInstructions}
            setAdditionalInstructions={setAdditionalInstructions}
          />
        ) : (
          <LocationAddressSection
            physicalAddress={physicalAddress}
            setPhysicalAddress={setPhysicalAddress}
            distance={distance}
            setDistance={setDistance}
            additionalInstructions={additionalInstructions}
            setAdditionalInstructions={setAdditionalInstructions}
          />
        )}

        {/* Price Summary */}
        <View style={styles.priceCard}>
          <Text style={styles.priceTitle}>Price Summary</Text>
          {priceCalculation.error ? (
            <Text style={styles.errorText}>{priceCalculation.error}</Text>
          ) : (
            <>
              <Text style={styles.priceDetail}>Base Price ({vehicleType}): R{priceCalculation.base}</Text>
              <Text style={styles.priceDetail}>Distance Markup: R{priceCalculation.markup}</Text>
              <Text style={styles.totalPrice}>R{priceCalculation.total}</Text>
            </>
          )}
        </View>

        {/* Book Button */}
        <TouchableOpacity
          style={[styles.bookButton, priceCalculation.error && styles.disabledButton]}
          onPress={handleBooking}
          disabled={!!priceCalculation.error}>
          <Text style={[styles.buttonText, priceCalculation.error && styles.disabledButtonText]}>
            Book Service - R{priceCalculation.total} (Instant EFT)
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}