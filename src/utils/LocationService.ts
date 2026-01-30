import * as Location from 'expo-location';
import { Alert } from 'react-native';

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

export interface AddressResult {
  formattedAddress: string;
  coordinates: LocationCoordinates;
  distance?: number;
}

// Reference location: 32 Douglas St (you may need to update these coordinates)
const DOUGLAS_ST_COORDINATES: LocationCoordinates = {
  latitude: -33.9249, // Example coordinates - replace with actual
  longitude: 18.4241, // Example coordinates - replace with actual
};

/**
 * Calculate distance between two coordinates using Haversine formula
 */
export function calculateDistance(
  coord1: LocationCoordinates,
  coord2: LocationCoordinates
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(coord2.latitude - coord1.latitude);
  const dLon = toRadians(coord2.longitude - coord1.longitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(coord1.latitude)) * Math.cos(toRadians(coord2.latitude)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 100) / 100; // Round to 2 decimal places
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Request location permissions
 */
export async function requestLocationPermissions(): Promise<boolean> {
  try {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Location permission is needed to calculate distances automatically.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Settings', onPress: () => Location.requestForegroundPermissionsAsync() }
        ]
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error requesting location permissions:', error);
    return false;
  }
}

/**
 * Get current GPS location
 */
export async function getCurrentLocation(): Promise<LocationCoordinates | null> {
  try {
    const hasPermission = await requestLocationPermissions();
    if (!hasPermission) return null;

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
      timeInterval: 5000,
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    console.error('Error getting current location:', error);
    Alert.alert('Location Error', 'Unable to get your current location. Please try again.');
    return null;
  }
}

/**
 * Convert coordinates to address (reverse geocoding)
 */
export async function getAddressFromCoordinates(coordinates: LocationCoordinates): Promise<string> {
  try {
    const results = await Location.reverseGeocodeAsync(coordinates);
    if (results && results.length > 0) {
      const result = results[0];
      const addressParts = [
        result.streetNumber,
        result.street,
        result.subregion || result.district,
        result.city,
        result.region,
        result.postalCode
      ].filter(Boolean);

      return addressParts.join(', ');
    }
    return 'Address not found';
  } catch (error) {
    console.error('Error getting address from coordinates:', error);
    return 'Unable to get address';
  }
}

/**
 * Convert address to coordinates (geocoding)
 */
export async function getCoordinatesFromAddress(address: string): Promise<LocationCoordinates | null> {
  try {
    const results = await Location.geocodeAsync(address);
    if (results && results.length > 0) {
      return {
        latitude: results[0].latitude,
        longitude: results[0].longitude,
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting coordinates from address:', error);
    return null;
  }
}

/**
 * Get current location and calculate distance from Douglas St
 */
export async function getCurrentLocationWithDistance(): Promise<AddressResult | null> {
  try {
    const coordinates = await getCurrentLocation();
    if (!coordinates) return null;

    const address = await getAddressFromCoordinates(coordinates);
    const distance = calculateDistance(coordinates, DOUGLAS_ST_COORDINATES);

    return {
      formattedAddress: address,
      coordinates,
      distance,
    };
  } catch (error) {
    console.error('Error getting location with distance:', error);
    return null;
  }
}

/**
 * Calculate distance from any address to Douglas St
 */
export async function getDistanceFromDouglasSt(address: string): Promise<number | null> {
  try {
    const coordinates = await getCoordinatesFromAddress(address);
    if (!coordinates) return null;

    return calculateDistance(coordinates, DOUGLAS_ST_COORDINATES);
  } catch (error) {
    console.error('Error calculating distance from Douglas St:', error);
    return null;
  }
}

/**
 * Search for address suggestions (basic implementation)
 */
export function getAddressSuggestions(partialAddress: string): string[] {
  // This is a basic implementation. For production, you might want to use
  // Google Places API, Mapbox Geocoding API, or similar service
  const commonAreas = [
    'Cape Town, Western Cape',
    'Bellville, Western Cape',
    'Stellenbosch, Western Cape',
    'Paarl, Western Cape',
    'Somerset West, Western Cape',
    'Brackenfell, Western Cape',
    'Goodwood, Western Cape',
    'Parow, Western Cape',
    'Durbanville, Western Cape',
    'Milnerton, Western Cape'
  ];

  if (!partialAddress.trim()) return commonAreas.slice(0, 5);

  return commonAreas.filter(area =>
    area.toLowerCase().includes(partialAddress.toLowerCase())
  ).slice(0, 8);
}