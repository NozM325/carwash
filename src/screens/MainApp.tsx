import React, { useState } from 'react';
import { StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import CustomerTabs from './customer/CustomerTabs';
import StaffDashboard from './staff/StaffDashboard';
import AdminDashboard from './admin/AdminDashboard';
import TermsScreen from './customer/TermsScreen';
import { glassColors } from '../styles/glassmorphism';

export default function MainApp() {
  const { user } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? glassColors.dark : glassColors.light;
  const [termsAccepted, setTermsAccepted] = useState(true); // Start with terms accepted for demo

  if (!user) {
    return null; // This shouldn't happen as MainApp is only rendered when authenticated
  }

  // For customers who haven't accepted terms yet (disabled for demo)
  if (user.role === 'customer' && !termsAccepted) {
    return <TermsScreen onAccept={() => setTermsAccepted(true)} />;
  }

  // Main authenticated app content based on user role
  switch (user.role) {
    case 'customer':
      return <CustomerTabs />;

    case 'staff':
      return <StaffDashboard />;

    case 'admin':
      return <AdminDashboard />;

    default:
      return <CustomerTabs />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
});