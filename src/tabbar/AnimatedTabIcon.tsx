import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { TabBarIcon, type IconName } from './TabBarIcon';

/**
 * Lifts and grows the icon as its tab becomes active, and wipes the underline in
 * from the centre. Driven natively so the animation runs on the UI thread and
 * cannot be stalled by JS work — which matters here, since the blur behind it is
 * already recomputing every frame.
 */
export function AnimatedTabIcon({
  name,
  color,
  focused,
}: {
  name: IconName;
  color: string;
  focused: boolean;
}) {
  const progress = useRef(new Animated.Value(focused ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(progress, {
      toValue: focused ? 1 : 0,
      useNativeDriver: true,
      speed: 18,
      bounciness: 10,
    }).start();
  }, [focused, progress]);

  const scale = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.18],
  });
  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -2],
  });

  return (
    <View style={styles.slot}>
      <Animated.View style={{ transform: [{ scale }, { translateY }] }}>
        <TabBarIcon name={name} color={color} />
      </Animated.View>
      <Animated.View
        style={[
          styles.indicator,
          {
            backgroundColor: color,
            opacity: progress,
            transform: [{ scaleX: progress }],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  slot: {
    width: 40,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicator: {
    // Absolute so the underline cannot push the active icon off-centre relative
    // to the inactive ones.
    position: 'absolute',
    bottom: 0,
    width: 16,
    height: 2,
    borderRadius: 1,
  },
});
