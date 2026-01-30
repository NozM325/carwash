import { StyleSheet } from 'react-native';

interface GlassStyleOptions {
  isDark: boolean;
  opacity?: number;
  blur?: number;
  borderOpacity?: number;
}

export const createGlassStyles = ({
  isDark,
  opacity = 0.15,
  blur = 10,
  borderOpacity = 0.2
}: GlassStyleOptions) => {
  return StyleSheet.create({
    // Primary glass container
    glassContainer: {
      backgroundColor: isDark
        ? `rgba(255, 255, 255, ${opacity})`
        : `rgba(255, 255, 255, ${opacity + 0.1})`,
      borderWidth: 1,
      borderColor: isDark
        ? `rgba(255, 255, 255, ${borderOpacity})`
        : `rgba(255, 255, 255, ${borderOpacity + 0.1})`,
      borderRadius: 16,
      shadowColor: isDark ? '#000' : '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: isDark ? 0.3 : 0.15,
      shadowRadius: 16,
      elevation: 8,
      // Note: React Native doesn't support backdrop-filter, but we simulate it
    },

    // Secondary glass container (less prominent)
    glassContainerSecondary: {
      backgroundColor: isDark
        ? `rgba(255, 255, 255, ${opacity * 0.7})`
        : `rgba(255, 255, 255, ${opacity * 0.8})`,
      borderWidth: 0.5,
      borderColor: isDark
        ? `rgba(255, 255, 255, ${borderOpacity * 0.8})`
        : `rgba(255, 255, 255, ${borderOpacity * 0.9})`,
      borderRadius: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },

    // Card glass effect
    glassCard: {
      backgroundColor: isDark
        ? `rgba(255, 255, 255, ${opacity + 0.05})`
        : `rgba(255, 255, 255, ${opacity + 0.15})`,
      borderWidth: 1,
      borderColor: isDark
        ? `rgba(255, 255, 255, ${borderOpacity + 0.05})`
        : `rgba(255, 255, 255, ${borderOpacity + 0.1})`,
      borderRadius: 20,
      shadowColor: isDark ? '#000' : '#000',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: isDark ? 0.4 : 0.2,
      shadowRadius: 20,
      elevation: 12,
    },

    // Button glass effect
    glassButton: {
      backgroundColor: isDark
        ? `rgba(255, 255, 255, ${opacity + 0.1})`
        : `rgba(255, 255, 255, ${opacity + 0.2})`,
      borderWidth: 1,
      borderColor: isDark
        ? `rgba(255, 255, 255, ${borderOpacity + 0.1})`
        : `rgba(255, 255, 255, ${borderOpacity + 0.2})`,
      borderRadius: 14,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 6,
    },

    // Input glass effect
    glassInput: {
      backgroundColor: isDark
        ? `rgba(255, 255, 255, ${opacity + 0.02})`
        : `rgba(255, 255, 255, ${opacity + 0.12})`,
      borderWidth: 1,
      borderColor: isDark
        ? `rgba(255, 255, 255, ${borderOpacity})`
        : `rgba(255, 255, 255, ${borderOpacity + 0.15})`,
      borderRadius: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
  });
};

// Professional color palette
export const glassColors = {
  light: {
    primary: '#007AFF',      // iOS Blue
    secondary: '#5856D6',    // iOS Purple
    success: '#34C759',      // iOS Green
    background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 50%, #90CAF9 100%)',
    backgroundSolid: '#F0F8FF',
    text: '#1D1D1F',
    textSecondary: '#6D6D80',
    accent: '#00C7BE',       // Aqua accent
  },
  dark: {
    primary: '#0A84FF',      // iOS Blue Dark
    secondary: '#5E5CE6',    // iOS Purple Dark
    success: '#32D74B',      // iOS Green Dark
    background: 'linear-gradient(135deg, #1C1C1E 0%, #2C2C2E 50%, #3A3A3C 100%)',
    backgroundSolid: '#000000',
    text: '#F2F2F7',
    textSecondary: '#8E8E93',
    accent: '#64D2FF',       // Light Aqua accent
  }
};

// Professional typography
export const glassTypography = {
  // iOS-style font weights
  largeTitle: {
    fontSize: 34,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
  },
  title1: {
    fontSize: 28,
    fontWeight: '600' as const,
    letterSpacing: -0.3,
  },
  title2: {
    fontSize: 22,
    fontWeight: '600' as const,
    letterSpacing: -0.2,
  },
  title3: {
    fontSize: 20,
    fontWeight: '600' as const,
  },
  headline: {
    fontSize: 17,
    fontWeight: '600' as const,
  },
  body: {
    fontSize: 17,
    fontWeight: '400' as const,
  },
  callout: {
    fontSize: 16,
    fontWeight: '400' as const,
  },
  subhead: {
    fontSize: 15,
    fontWeight: '400' as const,
  },
  footnote: {
    fontSize: 13,
    fontWeight: '400' as const,
  },
  caption1: {
    fontSize: 12,
    fontWeight: '400' as const,
  },
  caption2: {
    fontSize: 11,
    fontWeight: '400' as const,
  },
};