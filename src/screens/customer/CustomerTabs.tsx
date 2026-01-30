import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  SafeAreaView
} from 'react-native';
import { createGlassStyles, glassColors, glassTypography } from '../../styles/glassmorphism';
import BookingScreenProfessional from './BookingScreenProfessional';
import BookingHistory from './BookingHistory';
import CustomerProfile from './CustomerProfile';
import CustomerHome from './CustomerHome';

type TabType = 'home' | 'book' | 'history' | 'profile';

export default function CustomerTabs() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? glassColors.dark : glassColors.light;
  const glassStyles = createGlassStyles({ isDark });

  const [activeTab, setActiveTab] = useState<TabType>('home');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return <CustomerHome onNavigateToBook={() => setActiveTab('book')} />;
      case 'book':
        return <BookingScreenProfessional />;
      case 'history':
        return <BookingHistory />;
      case 'profile':
        return <CustomerProfile />;
      default:
        return <CustomerHome onNavigateToBook={() => setActiveTab('book')} />;
    }
  };

  const tabs = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'book', icon: '📅', label: 'Book' },
    { id: 'history', icon: '📚', label: 'History' },
    { id: 'profile', icon: '👤', label: 'Profile' }
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundSolid,
    },
    content: {
      flex: 1,
    },
    tabBar: {
      ...glassStyles.glassContainer,
      flexDirection: 'row',
      paddingVertical: 8,
      paddingHorizontal: 4,
      marginHorizontal: 16,
      marginBottom: 16,
      borderRadius: 16,
    },
    tab: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: 12,
      borderRadius: 12,
      marginHorizontal: 2,
    },
    activeTab: {
      backgroundColor: colors.primary + '20',
      ...glassStyles.glassButton,
    },
    tabIcon: {
      fontSize: 20,
      marginBottom: 4,
    },
    tabLabel: {
      ...glassTypography.caption1,
      fontSize: 11,
      fontWeight: '600',
    },
    activeTabLabel: {
      color: colors.primary,
    },
    inactiveTabLabel: {
      color: colors.textSecondary,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {renderTabContent()}
      </View>

      <View style={styles.tabBar}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              activeTab === tab.id && styles.activeTab
            ]}
            onPress={() => setActiveTab(tab.id as TabType)}
          >
            <Text style={styles.tabIcon}>{tab.icon}</Text>
            <Text
              style={[
                styles.tabLabel,
                activeTab === tab.id ? styles.activeTabLabel : styles.inactiveTabLabel
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}