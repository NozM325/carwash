import React, { useEffect, useRef } from 'react';
import { View, Animated, Dimensions, StyleSheet, useColorScheme, Easing } from 'react-native';

const { width, height } = Dimensions.get('window');

interface SoapSud {
  id: number;
  x: Animated.Value;
  y: Animated.Value;
  size: Animated.Value;
  opacity: Animated.Value;
  rotation: Animated.Value;
  float: Animated.Value;
}

export default function SoapSuds({ numSuds = 15 }: { numSuds?: number }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const sudsRef = useRef<SoapSud[]>([]);

  useEffect(() => {
    // Create soap suds with enhanced properties
    sudsRef.current = Array.from({ length: numSuds }, (_, i) => ({
      id: i,
      x: new Animated.Value(Math.random() * width),
      y: new Animated.Value(height + 100),
      size: new Animated.Value(0),
      opacity: new Animated.Value(0),
      rotation: new Animated.Value(0),
      float: new Animated.Value(0),
    }));

    // Animate soap suds
    const animateSoapSuds = () => {
      sudsRef.current.forEach((sud, index) => {
        const delay = Math.random() * 4000 + index * 200;
        const duration = 6000 + Math.random() * 4000;
        const sudSize = 8 + Math.random() * 20;
        const maxOpacity = 0.4 + Math.random() * 0.4;

        // Main soap sud animation
        Animated.sequence([
          Animated.delay(delay),

          // Sud appears with foam effect
          Animated.parallel([
            Animated.timing(sud.size, {
              toValue: sudSize,
              duration: 1000,
              easing: Easing.elastic(1.5),
              useNativeDriver: false,
            }),
            Animated.timing(sud.opacity, {
              toValue: maxOpacity,
              duration: 1000,
              easing: Easing.out(Easing.quad),
              useNativeDriver: false,
            }),
          ]),

          // Sud floats up with irregular movement
          Animated.timing(sud.y, {
            toValue: -150,
            duration: duration,
            easing: Easing.out(Easing.quad),
            useNativeDriver: false,
          }),

          // Sud pops/dissolves
          Animated.parallel([
            Animated.timing(sud.size, {
              toValue: sudSize * 1.8,
              duration: 300,
              easing: Easing.out(Easing.quad),
              useNativeDriver: false,
            }),
            Animated.timing(sud.opacity, {
              toValue: 0,
              duration: 300,
              useNativeDriver: false,
            }),
          ]),
        ]).start(() => {
          // Reset sud for next cycle
          sud.y.setValue(height + 100);
          sud.x.setValue(Math.random() * width);
          sud.size.setValue(0);
          sud.opacity.setValue(0);
          sud.rotation.setValue(0);
          sud.float.setValue(0);
        });

        // Floating animation (up and down bobbing)
        Animated.loop(
          Animated.sequence([
            Animated.timing(sud.float, {
              toValue: 1,
              duration: 1500 + Math.random() * 1000,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: false,
            }),
            Animated.timing(sud.float, {
              toValue: 0,
              duration: 1500 + Math.random() * 1000,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: false,
            }),
          ])
        ).start();

        // Horizontal drift with floating
        const floatListener = sud.float.addListener(({ value }) => {
          const driftAmount = 30 + Math.random() * 20;
          const baseX = sud.x._value;
          const newX = baseX + Math.sin(value * Math.PI * 2) * driftAmount;
          sud.x.setValue(Math.max(0, Math.min(width - 40, newX)));
        });

        // Slow rotation
        Animated.loop(
          Animated.timing(sud.rotation, {
            toValue: 360,
            duration: 10000 + Math.random() * 5000,
            easing: Easing.linear,
            useNativeDriver: false,
          })
        ).start();

        // Cleanup
        return () => {
          sud.float.removeListener(floatListener);
        };
      });
    };

    animateSoapSuds();

    // Restart animation loop
    const interval = setInterval(animateSoapSuds, 15000);
    return () => {
      clearInterval(interval);
      sudsRef.current.forEach(sud => {
        sud.float.removeAllListeners();
      });
    };
  }, [numSuds]);

  return (
    <View style={styles.container} pointerEvents="none">
      {sudsRef.current.map((sud, index) => (
        <Animated.View
          key={sud.id}
          style={[
            styles.soapSud,
            {
              left: sud.x,
              top: sud.y,
              width: sud.size,
              height: sud.size,
              opacity: sud.opacity,
              transform: [
                {
                  rotate: sud.rotation.interpolate({
                    inputRange: [0, 360],
                    outputRange: ['0deg', '360deg'],
                  })
                }
              ],
              backgroundColor: isDark
                ? `rgba(255, 255, 255, ${0.7 + Math.sin(index * 0.4) * 0.2})`
                : `rgba(255, 255, 255, ${0.8 + Math.cos(index * 0.3) * 0.2})`,
            },
          ]}
        >
          {/* Inner foam texture */}
          <View style={styles.foamTexture}>
            <View style={[styles.foamBubble, { top: '20%', left: '30%' }]} />
            <View style={[styles.foamBubble, { top: '60%', left: '70%', width: 3, height: 3 }]} />
            <View style={[styles.foamBubble, { top: '40%', left: '20%', width: 2, height: 2 }]} />
          </View>
        </Animated.View>
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
    zIndex: -2,
  },
  soapSud: {
    position: 'absolute',
    borderRadius: 1000,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  foamTexture: {
    flex: 1,
    position: 'relative',
  },
  foamBubble: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
});