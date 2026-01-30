import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  useColorScheme,
  Platform
} from 'react-native';
import {
  getAddressFromCoordinates,
  calculateDistance,
  LocationCoordinates
} from '../utils/LocationService';
import { createGlassStyles, glassColors } from '../styles/glassmorphism';

// Conditional imports for native platforms only
let MapView: any = null;
let Marker: any = null;
let Circle: any = null;
let PROVIDER_GOOGLE: any = null;

if (Platform.OS !== 'web') {
  try {
    const MapsModule = require('react-native-maps');
    MapView = MapsModule.default;
    Marker = MapsModule.Marker;
    Circle = MapsModule.Circle;
    PROVIDER_GOOGLE = MapsModule.PROVIDER_GOOGLE;
  } catch (error) {
    console.log('react-native-maps not available:', error);
  }
}

interface NativeMapViewProps {
  selectedLocation: LocationCoordinates | null;
  setSelectedLocation: (location: LocationCoordinates | null) => void;
  physicalAddress: string;
  setPhysicalAddress: (address: string) => void;
  setDistance: (distance: string) => void;
  mapReady: boolean;
  setMapReady: (ready: boolean) => void;
}

export interface NativeMapViewRef {
  animateToLocation: (coordinates: LocationCoordinates) => void;
  focusOnDouglasSt: () => void;
}

// Douglas St coordinates
const DOUGLAS_ST_COORDINATES: LocationCoordinates = {
  latitude: -26.1158,
  longitude: 28.2303,
};

// Base styles for web placeholder
const webStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    margin: 16,
  },
  webPlaceholderText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  webPlaceholderSubtext: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});

const NativeMapView = forwardRef<NativeMapViewRef, NativeMapViewProps>(({
  selectedLocation,
  setSelectedLocation,
  physicalAddress,
  setPhysicalAddress,
  setDistance,
  mapReady,
  setMapReady
}, ref) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const mapRef = useRef<any>(null);

  // If we're on web or maps aren't available, show a placeholder
  if (Platform.OS === 'web' || !MapView) {
    const colors = isDark ? glassColors.dark : glassColors.light;

    useImperativeHandle(ref, () => ({
      animateToLocation: () => {},
      focusOnDouglasSt: () => {}
    }));

    return (
      <View style={[webStyles.container, { backgroundColor: colors.backgroundSolid }]}>
        <View style={[webStyles.webPlaceholder, createGlassStyles({ isDark }).glassCard]}>
          <Text style={[webStyles.webPlaceholderText, { color: colors.text }]}>
            🗺️ Map View
          </Text>
          <Text style={[webStyles.webPlaceholderSubtext, { color: colors.textSecondary }]}>
            Map functionality is available on mobile devices.
            Please use the address input to specify your location.
          </Text>
        </View>
      </View>
    );
  }

  const glassStyles = createGlassStyles({ isDark });
  const colors = isDark ? glassColors.dark : glassColors.light;

  const mapRegion = {
    latitude: DOUGLAS_ST_COORDINATES.latitude,
    longitude: DOUGLAS_ST_COORDINATES.longitude,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  };

  const handleMapPress = async (event: any) => {
    const coordinate = event.nativeEvent.coordinate;
    setSelectedLocation(coordinate);

    // Calculate distance
    const calculatedDistance = calculateDistance(coordinate, DOUGLAS_ST_COORDINATES);
    setDistance(calculatedDistance.toFixed(1));

    try {
      const address = await getAddressFromCoordinates(coordinate);
      setPhysicalAddress(address);
    } catch (error) {
      console.error('Error getting address from coordinates:', error);
      Alert.alert('Error', 'Unable to get address for this location');
    }
  };

  const animateToLocation = (coordinates: LocationCoordinates) => {
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        ...coordinates,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);
    }
  };

  const focusOnDouglasSt = () => {
    animateToLocation(DOUGLAS_ST_COORDINATES);
  };

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    animateToLocation,
    focusOnDouglasSt,
  }));

  const styles = StyleSheet.create({
    mapContainer: {
      ...glassStyles.glassContainer,
      flex: 1,
      overflow: 'hidden',
      marginBottom: 16,
    },
    map: {
      flex: 1,
    },
    mapLoadingOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    loadingText: {
      color: colors.textSecondary,
      marginTop: 12,
    },
  });

  return (
    <View style={styles.mapContainer}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={mapRegion}
        onPress={handleMapPress}
        onMapReady={() => setMapReady(true)}
        showsUserLocation
        showsMyLocationButton={false}
        showsCompass
        mapType="standard"
      >
        {/* Douglas St Base Marker */}
        <Marker
          coordinate={DOUGLAS_ST_COORDINATES}
          title="32 Douglas St (Base)"
          description="Shybay Service Base"
          pinColor="blue"
        />

        {/* Service radius circle */}
        <Circle
          center={DOUGLAS_ST_COORDINATES}
          radius={15000} // 15km radius
          strokeColor={isDark ? 'rgba(0, 122, 255, 0.5)' : 'rgba(0, 122, 255, 0.3)'}
          fillColor={isDark ? 'rgba(0, 122, 255, 0.1)' : 'rgba(0, 122, 255, 0.05)'}
        />

        {/* Selected Location Marker */}
        {selectedLocation && (
          <Marker
            coordinate={selectedLocation}
            title="Service Location"
            description={physicalAddress || "Selected location"}
            pinColor="red"
          />
        )}
      </MapView>

      {/* Map Loading Overlay */}
      {!mapReady && (
        <View style={styles.mapLoadingOverlay}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading map...</Text>
        </View>
      )}
    </View>
  );
});

NativeMapView.displayName = 'NativeMapView';

export default NativeMapView;