import type { ReactNode } from 'react';
import { View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppTheme } from '../theme';

/**
 * Screen container: theme background plus safe-area padding.
 *
 * Edges are opt-in. The bottom is excluded by default because the floating tab
 * bar already reserves that space, and padding it twice leaves a visible gap.
 */
export function AppScreen({
  children,
  edges = ['top'],
  style,
}: {
  children: ReactNode;
  edges?: ('top' | 'bottom')[];
  style?: ViewStyle;
}) {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        { flex: 1, backgroundColor: colors.background },
        edges.includes('top') && { paddingTop: insets.top },
        edges.includes('bottom') && { paddingBottom: insets.bottom },
        style,
      ]}
    >
      {children}
    </View>
  );
}
