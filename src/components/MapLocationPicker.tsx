import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  useColorScheme,
  Dimensions,
  Keyboard,
  Platform
} from 'react-native';
import {
  getCurrentLocationWithDistance,
  getAddressSuggestions,
  getCoordinatesFromAddress,
  calculateDistance,
  LocationCoordinates
} from '../utils/LocationService';
import { createGlassStyles, glassColors, glassTypography } from '../styles/glassmorphism';

// Conditional import for native map component
let NativeMapView: any = null;
if (Platform.OS !== 'web') {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const NativeMapModule = require('./NativeMapView');
    NativeMapView = NativeMapModule.default;
  } catch (error) {
    console.log('Native map view not available:', error);
  }
}

interface MapLocationPickerProps {
  physicalAddress: string;
  setPhysicalAddress: (address: string) => void;
  distance: string;
  setDistance: (distance: string) => void;
  additionalInstructions: string;
  setAdditionalInstructions: (instructions: string) => void;
}

const { height } = Dimensions.get('window');

// Douglas St coordinates
const DOUGLAS_ST_COORDINATES: LocationCoordinates = {
  latitude: -26.1158,
  longitude: 28.2303,
};

export default function MapLocationPicker({
  physicalAddress,
  setPhysicalAddress,
  distance,
  setDistance,
  additionalInstructions,
  setAdditionalInstructions
}: MapLocationPickerProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const nativeMapRef = useRef<any>(null);

  const glassStyles = createGlassStyles({ isDark });
  const colors = isDark ? glassColors.dark : glassColors.light;

  // State management
  const [selectedLocation, setSelectedLocation] = useState<LocationCoordinates | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  // Update search results when query changes
  useEffect(() => {
    if (searchQuery.length >= 2) {
      const suggestions = getAddressSuggestions(searchQuery);
      setSearchResults(suggestions);
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
    }
  }, [searchQuery]);

  // Calculate distance when location changes
  useEffect(() => {
    if (selectedLocation) {
      const calculatedDistance = calculateDistance(selectedLocation, DOUGLAS_ST_COORDINATES);
      setDistance(calculatedDistance.toFixed(1));
    }
  }, [selectedLocation, setDistance]);

  const handleSearchResultPress = async (result: string) => {
    setSearchQuery(result);
    setPhysicalAddress(result);
    setShowSearchResults(false);
    Keyboard.dismiss();

    try {
      const coordinates = await getCoordinatesFromAddress(result);
      if (coordinates) {
        setSelectedLocation(coordinates);

        // Animate to location on native platforms
        if (Platform.OS !== 'web' && nativeMapRef.current) {
          nativeMapRef.current.animateToLocation(coordinates);
        }
      }
    } catch (error) {
      console.error('Error getting coordinates from address:', error);
      // Could show user feedback here if needed
    }
  };

  const getCurrentLocation = async () => {
    setIsLoadingLocation(true);
    try {
      const result = await getCurrentLocationWithDistance();
      if (result) {
        setSelectedLocation(result.coordinates);
        setPhysicalAddress(result.formattedAddress);
        setSearchQuery(result.formattedAddress);
        setDistance(result.distance?.toString() || '0');

        // Animate to user location on native platforms
        if (Platform.OS !== 'web' && nativeMapRef.current) {
          nativeMapRef.current.animateToLocation(result.coordinates);
        }

        Alert.alert(
          'Location Found',
          `Distance from base: ${result.distance?.toFixed(1)} km`
        );
      }
    } catch {
      Alert.alert('Error', 'Unable to get your current location. Please try again.');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const focusOnDouglasSt = () => {
    if (Platform.OS !== 'web' && nativeMapRef.current) {
      nativeMapRef.current.focusOnDouglasSt();
    }
  };

  // Web fallback component
  const WebFallbackMap = () => (
    <View style={[styles.mapContainer, styles.webFallback]}>
      <View style={styles.webFallbackContent}>
        <Text style={styles.webFallbackTitle}>🗺️ Map View</Text>
        <Text style={styles.webFallbackText}>
          Interactive maps are available on mobile devices.
        </Text>
        <Text style={styles.webFallbackText}>
          For web testing, please use the &quot;📝 Form Input&quot; mode or test on a mobile device.
        </Text>

        {selectedLocation && (
          <View style={styles.webLocationInfo}>
            <Text style={styles.webLocationText}>📍 Selected Location:</Text>
            <Text style={styles.webLocationAddress}>{physicalAddress}</Text>
            <Text style={styles.webLocationDistance}>
              Distance: {distance} km from base
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      ...glassStyles.glassContainer,
      padding: 20,
      marginBottom: 20,
      height: height * 0.75, // Take up most of the screen
    },
    sectionTitle: {
      ...glassTypography.title3,
      color: colors.primary,
      marginBottom: 16,
      textAlign: 'center',
    },
    searchContainer: {
      marginBottom: 16,
      zIndex: 1000,
    },
    searchInput: {
      ...glassStyles.glassInput,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
      color: colors.text,
      marginBottom: 8,
    },
    searchResults: {
      ...glassStyles.glassContainer,
      maxHeight: 150,
      marginBottom: 8,
      zIndex: 999,
    },
    searchResultItem: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
    },
    searchResultText: {
      ...glassTypography.body,
      color: colors.text,
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: 8,
      marginBottom: 16,
      zIndex: 998,
    },
    actionButton: {
      ...glassStyles.glassButton,
      flex: 1,
      paddingVertical: 10,
      backgroundColor: isDark
        ? 'rgba(0, 122, 255, 0.15)'
        : 'rgba(0, 122, 255, 0.1)',
      borderColor: isDark
        ? 'rgba(0, 122, 255, 0.3)'
        : 'rgba(0, 122, 255, 0.2)',
    },
    actionButtonText: {
      ...glassTypography.callout,
      color: colors.primary,
      textAlign: 'center',
      fontSize: 12,
    },
    mapContainer: {
      ...glassStyles.glassContainer,
      flex: 1,
      overflow: 'hidden',
      marginBottom: 16,
    },
    map: {
      flex: 1,
    },
    distanceContainer: {
      ...glassStyles.glassContainerSecondary,
      padding: 12,
      marginBottom: 12,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    distanceText: {
      ...glassTypography.callout,
      color: colors.text,
    },
    distanceValue: {
      ...glassTypography.callout,
      color: colors.primary,
      fontWeight: '600',
    },
    instructionsInput: {
      ...glassStyles.glassInput,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 14,
      color: colors.text,
      minHeight: 80,
    },
    loadingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    loadingText: {
      ...glassTypography.caption1,
      color: colors.textSecondary,
    },
    mapLoadingOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    // Web fallback styles
    webFallback: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: isDark
        ? 'rgba(255, 255, 255, 0.05)'
        : 'rgba(0, 0, 0, 0.05)',
    },
    webFallbackContent: {
      alignItems: 'center',
      padding: 32,
    },
    webFallbackTitle: {
      ...glassTypography.title2,
      color: colors.primary,
      marginBottom: 16,
    },
    webFallbackText: {
      ...glassTypography.body,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 8,
      lineHeight: 22,
    },
    webLocationInfo: {
      ...glassStyles.glassContainerSecondary,
      padding: 16,
      marginTop: 20,
      alignItems: 'center',
    },
    webLocationText: {
      ...glassTypography.callout,
      color: colors.text,
      fontWeight: '600',
      marginBottom: 8,
    },
    webLocationAddress: {
      ...glassTypography.body,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 8,
    },
    webLocationDistance: {
      ...glassTypography.callout,
      color: colors.primary,
      fontWeight: '600',
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>📍 Map Location Picker</Text>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for an address or place..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFocus={() => searchQuery.length >= 2 && setShowSearchResults(true)}
        />

        {/* Search Results */}
        {showSearchResults && searchResults.length > 0 && (
          <View style={styles.searchResults}>
            <FlatList
              data={searchResults}
              keyExtractor={(item, index) => `${item}-${index}`}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.searchResultItem}
                  onPress={() => handleSearchResultPress(item)}
                >
                  <Text style={styles.searchResultText}>🔍 {item}</Text>
                </TouchableOpacity>
              )}
              nestedScrollEnabled
            />
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={getCurrentLocation}
            disabled={isLoadingLocation}
          >
            {isLoadingLocation ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={styles.loadingText}>Getting location...</Text>
              </View>
            ) : (
              <Text style={styles.actionButtonText}>📍 Current Location</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={focusOnDouglasSt}
          >
            <Text style={styles.actionButtonText}>🏢 Douglas St Base</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Map - Platform Conditional */}
      {Platform.OS === 'web' ? (
        <WebFallbackMap />
      ) : (
        NativeMapView && (
          <NativeMapView
            ref={nativeMapRef}
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
            physicalAddress={physicalAddress}
            setPhysicalAddress={(address: string) => {
              setPhysicalAddress(address);
              setSearchQuery(address);
            }}
            setDistance={setDistance}
            mapReady={mapReady}
            setMapReady={setMapReady}
          />
        )
      )}

      {/* Distance Display */}
      {selectedLocation && (
        <View style={styles.distanceContainer}>
          <Text style={styles.distanceText}>Distance from base:</Text>
          <Text style={styles.distanceValue}>{distance} km</Text>
        </View>
      )}

      {/* Additional Instructions */}
      <TextInput
        style={styles.instructionsInput}
        placeholder="Additional instructions (gate codes, parking info, landmarks...)"
        placeholderTextColor={colors.textSecondary}
        value={additionalInstructions}
        onChangeText={setAdditionalInstructions}
        multiline
        textAlignVertical="top"
      />
    </View>
  );
}