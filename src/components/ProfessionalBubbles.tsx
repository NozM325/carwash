import React, { useEffect, useRef } from 'react';
import { View, Animated, Dimensions, StyleSheet, useColorScheme, Easing } from 'react-native';

const { width, height } = Dimensions.get('window');

interface ProfessionalBubble {
  id: number;
  x: Animated.Value;
  y: Animated.Value;
  size: Animated.Value;
  opacity: Animated.Value;
  drift: Animated.Value;
}

export default function ProfessionalBubbles({ numBubbles = 12 }: { numBubbles?: number }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const bubblesRef = useRef<ProfessionalBubble[]>([]);

  useEffect(() => {
    // Create professional, subtle bubbles
    bubblesRef.current = Array.from({ length: numBubbles }, (_, i) => ({
      id: i,
      x: new Animated.Value(Math.random() * width),
      y: new Animated.Value(height + 100),
      size: new Animated.Value(0),
      opacity: new Animated.Value(0),
      drift: new Animated.Value(0),
    }));

    const animateProfessionalBubbles = () => {
      bubblesRef.current.forEach((bubble, index) => {
        const delay = Math.random() * 4000 + index * 300;
        const duration = 8000 + Math.random() * 4000; // Slower, more elegant
        const bubbleSize = 6 + Math.random() * 18; // Smaller, more subtle
        const maxOpacity = 0.15 + Math.random() * 0.25; // More transparent

        // Main bubble animation - elegant and subtle
        Animated.sequence([
          Animated.delay(delay),

          // Gentle appearance
          Animated.parallel([
            Animated.timing(bubble.size, {
              toValue: bubbleSize,
              duration: 1200,
              easing: Easing.out(Easing.quad),
              useNativeDriver: false,
            }),
            Animated.timing(bubble.opacity, {
              toValue: maxOpacity,
              duration: 1200,
              easing: Easing.out(Easing.quad),
              useNativeDriver: false,
            }),
          ]),

          // Slow, steady rise
          Animated.timing(bubble.y, {
            toValue: -150,
            duration: duration,
            easing: Easing.out(Easing.linear),
            useNativeDriver: false,
          }),

          // Gentle fade out
          Animated.timing(bubble.opacity, {
            toValue: 0,
            duration: 800,
            easing: Easing.out(Easing.quad),
            useNativeDriver: false,
          }),
        ]).start(() => {
          // Reset for next cycle
          bubble.y.setValue(height + 100);
          bubble.x.setValue(Math.random() * width);
          bubble.size.setValue(0);
          bubble.opacity.setValue(0);
          bubble.drift.setValue(0);
        });

        // Subtle horizontal drift
        Animated.loop(
          Animated.sequence([
            Animated.timing(bubble.drift, {
              toValue: 1,
              duration: 3000 + Math.random() * 2000,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: false,
            }),
            Animated.timing(bubble.drift, {
              toValue: 0,
              duration: 3000 + Math.random() * 2000,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: false,
            }),
          ])
        ).start();

        // Gentle horizontal movement
        const baseXValue = Math.random() * width;
        const driftListener = bubble.drift.addListener(({ value }) => {
          const driftAmount = 20 + Math.random() * 15; // Subtle drift
          const newX = baseXValue + Math.sin(value * Math.PI * 2) * driftAmount;
          bubble.x.setValue(Math.max(0, Math.min(width - 30, newX)));
        });

        return () => {
          bubble.drift.removeListener(driftListener);
        };
      });
    };

    animateProfessionalBubbles();

    const interval = setInterval(animateProfessionalBubbles, 15000);
    return () => {
      clearInterval(interval);
      bubblesRef.current.forEach(bubble => {
        bubble.drift.removeAllListeners();
      });
    };
  }, [numBubbles]);

  return (
    <View style={styles.container} pointerEvents="none">
      {bubblesRef.current.map((bubble, index) => (
        <Animated.View
          key={bubble.id}
          style={[
            styles.bubble,
            {
              left: bubble.x,
              top: bubble.y,
              width: bubble.size,
              height: bubble.size,
              opacity: bubble.opacity,
              backgroundColor: isDark
                ? `rgba(135, 206, 235, ${0.2 + Math.sin(index * 0.3) * 0.1})`
                : `rgba(135, 206, 235, ${0.3 + Math.cos(index * 0.4) * 0.1})`,
              borderColor: isDark
                ? `rgba(255, 255, 255, ${0.3 + Math.sin(index * 0.5) * 0.1})`
                : `rgba(255, 255, 255, ${0.4 + Math.cos(index * 0.6) * 0.1})`,
            },
          ]}
        >
          {/* Subtle inner highlight */}
          <Animated.View
            style={[
              styles.bubbleHighlight,
              {
                width: Animated.multiply(bubble.size, 0.25),
                height: Animated.multiply(bubble.size, 0.25),
                opacity: Animated.multiply(bubble.opacity, 0.6),
              }
            ]}
          />
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
    zIndex: -1,
  },
  bubble: {
    position: 'absolute',
    borderRadius: 1000,
    borderWidth: 0.5,
    shadowColor: '#87CEEB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  bubbleHighlight: {
    position: 'absolute',
    top: 2,
    left: 2,
    borderRadius: 1000,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
});