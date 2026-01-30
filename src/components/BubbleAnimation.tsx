import React, { useEffect, useRef } from 'react';
import { View, Animated, Dimensions, StyleSheet, useColorScheme, Easing } from 'react-native';

const { width, height } = Dimensions.get('window');

interface AdvancedBubble {
  id: number;
  x: Animated.Value;
  y: Animated.Value;
  size: Animated.Value;
  opacity: Animated.Value;
  rotation: Animated.Value;
  wobble: Animated.Value;
  scale: Animated.Value;
}

export default function BubbleAnimation({ numBubbles = 25 }: { numBubbles?: number }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const bubblesRef = useRef<AdvancedBubble[]>([]);

  useEffect(() => {
    // Create enhanced bubbles with more properties
    bubblesRef.current = Array.from({ length: numBubbles }, (_, i) => ({
      id: i,
      x: new Animated.Value(Math.random() * width),
      y: new Animated.Value(height + 200),
      size: new Animated.Value(0),
      opacity: new Animated.Value(0),
      rotation: new Animated.Value(0),
      wobble: new Animated.Value(0),
      scale: new Animated.Value(1),
    }));

    // Enhanced animation function
    const animateEnhancedBubbles = () => {
      bubblesRef.current.forEach((bubble, index) => {
        const delay = Math.random() * 3000 + index * 150;
        const duration = 4000 + Math.random() * 4000;
        const bubbleSize = 12 + Math.random() * 35;
        const maxOpacity = 0.3 + Math.random() * 0.5;

        // Main bubble lifecycle animation
        Animated.sequence([
          Animated.delay(delay),

          // Bubble birth - grows and appears
          Animated.parallel([
            Animated.timing(bubble.size, {
              toValue: bubbleSize,
              duration: 800,
              easing: Easing.elastic(1.2),
              useNativeDriver: false,
            }),
            Animated.timing(bubble.opacity, {
              toValue: maxOpacity,
              duration: 800,
              easing: Easing.out(Easing.quad),
              useNativeDriver: false,
            }),
            Animated.timing(bubble.scale, {
              toValue: 1 + Math.random() * 0.3,
              duration: 800,
              easing: Easing.bounce,
              useNativeDriver: false,
            }),
          ]),

          // Bubble floating up with sine wave movement
          Animated.timing(bubble.y, {
            toValue: -200,
            duration: duration,
            easing: Easing.out(Easing.linear),
            useNativeDriver: false,
          }),

          // Bubble burst at the top
          Animated.parallel([
            Animated.timing(bubble.scale, {
              toValue: 1.5,
              duration: 200,
              easing: Easing.out(Easing.quad),
              useNativeDriver: false,
            }),
            Animated.timing(bubble.opacity, {
              toValue: 0,
              duration: 200,
              useNativeDriver: false,
            }),
          ]),
        ]).start(() => {
          // Reset bubble for next cycle
          bubble.y.setValue(height + 200);
          bubble.x.setValue(Math.random() * width);
          bubble.size.setValue(0);
          bubble.opacity.setValue(0);
          bubble.scale.setValue(1);
          bubble.rotation.setValue(0);
          bubble.wobble.setValue(0);
        });

        // Continuous wobble animation (sine wave horizontal movement)
        Animated.loop(
          Animated.timing(bubble.wobble, {
            toValue: 1,
            duration: 2000 + Math.random() * 1000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: false,
          })
        ).start();

        // Add horizontal sine wave movement
        let baseXValue = Math.random() * width;
        const wobbleListener = bubble.wobble.addListener(({ value }) => {
          const wobbleAmount = 50 + Math.random() * 40;
          const newX = baseXValue + Math.sin(value * Math.PI * 4) * wobbleAmount;
          bubble.x.setValue(Math.max(0, Math.min(width - 50, newX)));
        });

        // Continuous rotation
        Animated.loop(
          Animated.timing(bubble.rotation, {
            toValue: 360,
            duration: 8000 + Math.random() * 4000,
            easing: Easing.linear,
            useNativeDriver: false,
          })
        ).start();

        // Random size pulsing for some bubbles
        if (Math.random() > 0.7) {
          Animated.loop(
            Animated.sequence([
              Animated.timing(bubble.scale, {
                toValue: 1.2,
                duration: 1500,
                easing: Easing.inOut(Easing.sin),
                useNativeDriver: false,
              }),
              Animated.timing(bubble.scale, {
                toValue: 1,
                duration: 1500,
                easing: Easing.inOut(Easing.sin),
                useNativeDriver: false,
              }),
            ])
          ).start();
        }

        // Cleanup listener when component unmounts
        return () => {
          bubble.wobble.removeListener(wobbleListener);
        };
      });
    };

    animateEnhancedBubbles();

    // Restart animation loop
    const interval = setInterval(animateEnhancedBubbles, 12000);
    return () => {
      clearInterval(interval);
      // Cleanup all listeners
      bubblesRef.current.forEach(bubble => {
        bubble.wobble.removeAllListeners();
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
              transform: [
                {
                  rotate: bubble.rotation.interpolate({
                    inputRange: [0, 360],
                    outputRange: ['0deg', '360deg'],
                  })
                },
                { scale: bubble.scale }
              ],
              backgroundColor: isDark
                ? `rgba(173, 216, 230, ${0.6 + Math.sin(index * 0.5) * 0.2})`
                : `rgba(135, 206, 235, ${0.5 + Math.cos(index * 0.3) * 0.2})`,
              borderColor: isDark
                ? `rgba(173, 216, 230, ${0.8 + Math.sin(index * 0.7) * 0.2})`
                : `rgba(255, 255, 255, ${0.7 + Math.cos(index * 0.4) * 0.2})`,
            },
          ]}
        >
          {/* Inner bubble shine effect */}
          <Animated.View
            style={[
              styles.bubbleShine,
              {
                width: Animated.multiply(bubble.size, 0.3),
                height: Animated.multiply(bubble.size, 0.3),
                opacity: Animated.multiply(bubble.opacity, 0.8),
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
    borderWidth: 1,
    shadowColor: '#87CEEB',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
    overflow: 'hidden',
  },
  bubbleShine: {
    position: 'absolute',
    top: 2,
    left: 2,
    borderRadius: 1000,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 2,
  },
});