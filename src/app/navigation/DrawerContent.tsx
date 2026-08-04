import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  DrawerContentScrollView,
  type DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppTheme } from '../../theme';

/**
 * The drawer body.
 *
 * Written out rather than using `DrawerItemList` so the rows read the app
 * theme: the stock items take individual colour props, and threading the whole
 * palette through them is more code than drawing a row.
 */
export function DrawerContent({ state, navigation }: DrawerContentComponentProps) {
  const { colors, spacing, radius, typography } = useAppTheme();
  const insets = useSafeAreaInsets();

  return (
    <DrawerContentScrollView
      contentContainerStyle={{ paddingTop: insets.top + spacing.lg }}
      style={{ backgroundColor: colors.surface }}
    >
      <Text
        style={[
          typography.heading,
          { color: colors.text, paddingHorizontal: spacing.md, marginBottom: spacing.md },
        ]}
      >
        Menu
      </Text>

      {state.routes.map((route, index) => {
        const focused = index === state.index;
        return (
          <Pressable
            key={route.key}
            onPress={() => navigation.navigate(route.name)}
            accessibilityRole="button"
            accessibilityState={{ selected: focused }}
            style={[
              styles.item,
              {
                marginHorizontal: spacing.sm,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.sm + 4,
                borderRadius: radius.md,
                backgroundColor: focused ? colors.surfaceElevated : 'transparent',
              },
            ]}
          >
            <View
              style={[
                styles.marker,
                { backgroundColor: focused ? colors.primary : 'transparent' },
              ]}
            />
            <Text
              style={[
                typography.bodyStrong,
                { color: focused ? colors.primary : colors.text },
              ]}
            >
              {route.name}
            </Text>
          </Pressable>
        );
      })}
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  marker: {
    width: 3,
    height: 18,
    borderRadius: 2,
    marginRight: 12,
  },
});
