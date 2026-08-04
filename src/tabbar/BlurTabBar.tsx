import { Platform, Pressable, StyleSheet, View } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

import { BlurTabBarBackground } from './BlurTabBarBackground';
import {
  TAB_BAR_BOTTOM_OFFSET,
  TAB_BAR_HEIGHT,
  TAB_BAR_SIDE_MARGIN,
} from './metrics';

/**
 * A custom tab bar rather than the stock one with `tabBarStyle` overrides.
 *
 * The built-in BottomTabItem applies `tabBarItemStyle` to an outer wrapper while
 * laying the icon out in an inner pressable that uses `padding: 10` and the
 * default `justifyContent: 'flex-start'` — so icons stack from the top of the
 * pill and no style option reaches the view that decides that. Owning the tab
 * bar is the only way to centre them.
 */
export function BlurTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  return (
    <View style={styles.pill} role="tablist">
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <BlurTabBarBackground />
      </View>

      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const { options } = descriptors[route.key];

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({ type: 'tabLongPress', target: route.key });
        };

        const color = focused
          ? options.tabBarActiveTintColor
          : options.tabBarInactiveTintColor;

        return (
          <Pressable
            key={route.key}
            style={styles.item}
            onPress={onPress}
            onLongPress={onLongPress}
            android_ripple={{ borderless: true }}
            role={Platform.select({ ios: 'button', default: 'tab' })}
            aria-selected={focused}
            aria-label={options.tabBarAccessibilityLabel ?? route.name}
          >
            {options.tabBarIcon?.({
              focused,
              color: color ?? '#000000',
              size: 24,
            })}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    position: 'absolute',
    left: TAB_BAR_SIDE_MARGIN,
    right: TAB_BAR_SIDE_MARGIN,
    bottom: TAB_BAR_BOTTOM_OFFSET,
    height: TAB_BAR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: TAB_BAR_HEIGHT / 2,
    // Clips the blur to the pill; without it the backdrop renders as a square.
    overflow: 'hidden',
  },
  item: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
