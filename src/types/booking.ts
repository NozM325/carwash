// Shybay App TypeScript Type Definitions

export type VehicleType = 'Hatchback' | 'Sedan' | 'SUV' | 'Minibus' | 'Bakkie';

export type CarBrand =
  | 'BMW'
  | 'Mercedes'
  | 'Toyota'
  | 'Volkswagen'
  | 'Ford'
  | 'Nissan'
  | 'Audi'
  | 'Hyundai'
  | 'Kia'
  | 'Other';

export type WashType =
  | 'Basic Wash'
  | 'Wash & Dry'
  | 'Deep Clean'
  | 'Full Service'
  | 'Interior & Exterior';

export type BookingStatus = 'Pending Payment' | 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled';

export type UserRole = 'customer' | 'staff' | 'admin';

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

export interface BookingData {
  id: string;
  // Customer Information
  customerName: string;
  phoneNumber: string;

  // Service Details
  serviceDate: Date;
  serviceTime: string;

  // Vehicle Information
  vehicleRegistration: string;
  vehicleType: VehicleType;
  carBrand: CarBrand;

  // Service Type
  washType: WashType;

  // Location
  location: Location;
  physicalAddress: string;
  additionalInstructions?: string;

  // Pricing
  basePrice: number;
  distanceMarkup: number;
  totalAmount: number;
  distanceFromBase: number;

  // Payment
  paymentMethod: 'Instant EFT';
  paymentStatus: 'Pending' | 'Completed' | 'Failed';

  // Booking Status
  status: BookingStatus;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface PriceCalculation {
  total: number;
  base: number;
  markup: number;
  error?: string;
}

export interface TermsProps {
  onAccept: () => void;
}