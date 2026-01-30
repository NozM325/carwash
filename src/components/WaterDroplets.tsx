import React, { useEffect, useRef } from 'react';
import { View, Animated, Dimensions, StyleSheet, useColorScheme } from 'react-native';

const { width, height } = Dimensions.get('window');

interface Droplet {
  id: number;
  x: Animated.Value;
  y: Animated.Value;
  opacity: Animated.Value;
  size: number;
}

export default function WaterDroplets({ numDroplets = 12 }: { numDroplets?: number }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const dropletsRef = useRef<Droplet[]>([]);

  useEffect(() => {
    // Create droplets with random sizes
    dropletsRef.current = Array.from({ length: numDroplets }, (_, i) => ({
      id: i,
      x: new Animated.Value(Math.random() * width),
      y: new Animated.Value(-100),
      opacity: new Animated.Value(0),
      size: 0.7 + Math.random() * 0.6, // Random size between 0.7 and 1.3
    }));

    // Start animations
    const animateDroplets = () => {
      dropletsRef.current.forEach((droplet, index) => {
        const delay = Math.random() * 3000 + index * 400;
        const duration = 1500 + Math.random() * 1000;

        Animated.sequence([
          Animated.delay(delay),
          // Droplet appears
          Animated.timing(droplet.opacity, {
            toValue: 0.7 + Math.random() * 0.2, // Higher opacity (0.7-0.9)
            duration: 300,
            useNativeDriver: false,
          }),
          // Droplet falls
          Animated.timing(droplet.y, {
            toValue: height + 100,
            duration: duration,
            useNativeDriver: false,
          }),
          // Droplet fades
          Animated.timing(droplet.opacity, {
            toValue: 0,
            duration: 400,
            useNativeDriver: false,
          }),
        ]).start(() => {
          // Reset droplet position
          droplet.y.setValue(-100);
          droplet.x.setValue(Math.random() * width);
          droplet.opacity.setValue(0);
        });
      });
    };

    animateDroplets();

    // Restart animation loop
    const interval = setInterval(animateDroplets, 5000);
    return () => clearInterval(interval);
  }, [numDroplets]);

  return (
    <View style={styles.container} pointerEvents="none">
      {dropletsRef.current.map((droplet) => (
        <Animated.View
          key={droplet.id}
          style={[
            styles.droplet,
            {
              left: droplet.x,
              top: droplet.y,
              opacity: droplet.opacity,
              backgroundColor: isDark
                ? 'rgba(135, 206, 250, 0.95)' // Light blue with high opacity
                : 'rgba(30, 144, 255, 0.85)', // Dodger blue with good opacity
              width: 6 * droplet.size,
              height: 18 * droplet.size,
              borderRadius: 3 * droplet.size,
              shadowColor: isDark ? '#87CEEB' : '#1E90FF',
              shadowOpacity: 0.8,
              shadowRadius: 4 * droplet.size,
              elevation: 4,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1, // Visible but behind interactive elements
    pointerEvents: 'none',
  },
  droplet: {
    position: 'absolute',
    // Dynamic sizes now set in the component
    shadowOffset: { width: 0, height: 3 },
  },
});