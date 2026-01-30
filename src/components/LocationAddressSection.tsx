import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  useColorScheme,
  FlatList
} from 'react-native';
import * as Location from 'expo-location';
import {
  getCurrentLocationWithDistance,
  getDistanceFromDouglasSt,
  getAddressSuggestions,
  requestLocationPermissions
} from '../utils/LocationService';
import { createGlassStyles, glassColors, glassTypography } from '../styles/glassmorphism';

interface LocationAddressSectionProps {
  physicalAddress: string;
  setPhysicalAddress: (address: string) => void;
  distance: string;
  setDistance: (distance: string) => void;
  additionalInstructions: string;
  setAdditionalInstructions: (instructions: string) => void;
}

export default function LocationAddressSection({
  physicalAddress,
  setPhysicalAddress,
  distance,
  setDistance,
  additionalInstructions,
  setAdditionalInstructions
}: LocationAddressSectionProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const glassStyles = createGlassStyles({ isDark });
  const colors = isDark ? glassColors.dark : glassColors.light;

  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isCalculatingDistance, setIsCalculatingDistance] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [hasLocationPermission, setHasLocationPermission] = useState<boolean | null>(null);

  // Define functions first
  const checkLocationPermission = async () => {
    const { status } = await Location.getForegroundPermissionsAsync();
    setHasLocationPermission(status === 'granted');
  };

  const calculateDistanceFromAddress = useCallback(async () => {
    if (!physicalAddress.trim()) return;

    setIsCalculatingDistance(true);
    try {
      const calculatedDistance = await getDistanceFromDouglasSt(physicalAddress);
      if (calculatedDistance !== null) {
        setDistance(calculatedDistance.toFixed(1));
      } else {
        // If geocoding fails, keep manual distance entry available
        console.log('Could not calculate distance for:', physicalAddress);
      }
    } catch (error) {
      console.error('Error calculating distance:', error);
    } finally {
      setIsCalculatingDistance(false);
    }
  }, [physicalAddress, setDistance]);

  // Check location permission on mount
  useEffect(() => {
    checkLocationPermission();
  }, []);

  // Update address suggestions when user types
  useEffect(() => {
    if (physicalAddress.length >= 2) {
      const suggestions = getAddressSuggestions(physicalAddress);
      setAddressSuggestions(suggestions);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [physicalAddress]);

  // Calculate distance when address changes (with debounce)
  useEffect(() => {
    if (physicalAddress.trim().length >= 10) {
      const timeoutId = setTimeout(() => {
        calculateDistanceFromAddress();
      }, 1500); // Wait 1.5s after user stops typing

      return () => clearTimeout(timeoutId);
    }
  }, [physicalAddress, calculateDistanceFromAddress]);

  const handleGetCurrentLocation = async () => {
    setIsLoadingLocation(true);
    try {
      const result = await getCurrentLocationWithDistance();
      if (result) {
        setPhysicalAddress(result.formattedAddress);
        setDistance(result.distance?.toString() || '0');
        setShowSuggestions(false);
        Alert.alert(
          'Location Found',
          `Distance from 32 Douglas St: ${result.distance?.toFixed(1)} km`,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Unable to get your current location. Please try again.');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleAddressSuggestionPress = (suggestion: string) => {
    setPhysicalAddress(suggestion);
    setShowSuggestions(false);
  };

  const handleRequestLocationPermission = async () => {
    const granted = await requestLocationPermissions();
    setHasLocationPermission(granted);
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
    input: {
      ...glassStyles.glassInput,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
      color: colors.text,
      marginBottom: 12,
    },
    locationButtonsContainer: {
      flexDirection: 'row',
      gap: 8,
      marginBottom: 16,
    },
    locationButton: {
      ...glassStyles.glassButton,
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 16,
      backgroundColor: isDark
        ? 'rgba(0, 122, 255, 0.15)'
        : 'rgba(0, 122, 255, 0.1)',
      borderColor: isDark
        ? 'rgba(0, 122, 255, 0.3)'
        : 'rgba(0, 122, 255, 0.2)',
    },
    disabledButton: {
      backgroundColor: isDark
        ? 'rgba(255, 255, 255, 0.05)'
        : 'rgba(255, 255, 255, 0.1)',
      borderColor: isDark
        ? 'rgba(255, 255, 255, 0.1)'
        : 'rgba(255, 255, 255, 0.2)',
    },
    locationButtonText: {
      ...glassTypography.callout,
      color: colors.primary,
      textAlign: 'center',
      fontWeight: '600',
    },
    disabledButtonText: {
      color: colors.textSecondary,
    },
    distanceContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    distanceInput: {
      ...glassStyles.glassInput,
      flex: 1,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
      color: colors.text,
    },
    distanceUnit: {
      ...glassTypography.callout,
      color: colors.textSecondary,
      paddingHorizontal: 8,
    },
    suggestionsList: {
      ...glassStyles.glassContainer,
      marginTop: -8,
      marginBottom: 12,
      maxHeight: 200,
    },
    suggestionItem: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
    },
    suggestionText: {
      ...glassTypography.body,
      color: colors.text,
    },
    loadingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      paddingVertical: 8,
    },
    loadingText: {
      ...glassTypography.callout,
      color: colors.textSecondary,
    },
    permissionContainer: {
      ...glassStyles.glassContainerSecondary,
      padding: 16,
      marginBottom: 16,
      borderColor: isDark ? 'rgba(255, 149, 0, 0.3)' : 'rgba(255, 149, 0, 0.2)',
    },
    permissionText: {
      ...glassTypography.body,
      color: colors.text,
      textAlign: 'center',
      marginBottom: 12,
    },
    permissionButton: {
      ...glassStyles.glassButton,
      paddingVertical: 8,
      backgroundColor: isDark
        ? 'rgba(255, 149, 0, 0.15)'
        : 'rgba(255, 149, 0, 0.1)',
      borderColor: isDark
        ? 'rgba(255, 149, 0, 0.3)'
        : 'rgba(255, 149, 0, 0.2)',
    },
    permissionButtonText: {
      ...glassTypography.callout,
      color: isDark ? '#FF9500' : '#FF8C00',
      textAlign: 'center',
      fontWeight: '600',
    },
  });

  return (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>Location & Address</Text>

      {hasLocationPermission === false && (
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>
            Enable location access to automatically calculate distances and get your current address.
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={handleRequestLocationPermission}
          >
            <Text style={styles.permissionButtonText}>Enable Location Access</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* GPS Location Buttons */}
      <View style={styles.locationButtonsContainer}>
        <TouchableOpacity
          style={[
            styles.locationButton,
            (isLoadingLocation || hasLocationPermission === false) && styles.disabledButton
          ]}
          onPress={handleGetCurrentLocation}
          disabled={isLoadingLocation || hasLocationPermission === false}
        >
          {isLoadingLocation ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={styles.loadingText}>Getting location...</Text>
            </View>
          ) : (
            <Text style={[
              styles.locationButtonText,
              hasLocationPermission === false && styles.disabledButtonText
            ]}>
              📍 Use Current Location
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Address Input */}
      <Text style={styles.label}>Physical Address *</Text>
      <TextInput
        style={styles.input}
        placeholder="Start typing your address..."
        placeholderTextColor={colors.textSecondary}
        value={physicalAddress}
        onChangeText={setPhysicalAddress}
        multiline
        numberOfLines={2}
      />

      {/* Address Suggestions */}
      {showSuggestions && addressSuggestions.length > 0 && (
        <View style={styles.suggestionsList}>
          <FlatList
            data={addressSuggestions}
            keyExtractor={(item, index) => `${item}-${index}`}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => handleAddressSuggestionPress(item)}
              >
                <Text style={styles.suggestionText}>{item}</Text>
              </TouchableOpacity>
            )}
            nestedScrollEnabled
          />
        </View>
      )}

      {/* Distance from Douglas St */}
      <Text style={styles.label}>
        Distance from 32 Douglas St
        {isCalculatingDistance && ' (calculating...)'}
      </Text>
      <View style={styles.distanceContainer}>
        <TextInput
          style={styles.distanceInput}
          keyboardType="numeric"
          placeholder="Distance will be calculated automatically"
          placeholderTextColor={colors.textSecondary}
          value={distance}
          onChangeText={setDistance}
        />
        <Text style={styles.distanceUnit}>km</Text>
        {isCalculatingDistance && (
          <ActivityIndicator size="small" color={colors.primary} />
        )}
      </View>

      {/* Additional Instructions */}
      <TextInput
        style={styles.input}
        placeholder="Additional Instructions (e.g., gate code, parking instructions)"
        placeholderTextColor={colors.textSecondary}
        value={additionalInstructions}
        onChangeText={setAdditionalInstructions}
        multiline
        numberOfLines={3}
      />
    </View>
  );
}