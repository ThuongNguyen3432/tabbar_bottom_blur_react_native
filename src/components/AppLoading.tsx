import { ActivityIndicator, View } from 'react-native';

import { useAppTheme } from '../theme';
import { AppText } from './AppText';

/** Centred spinner. `fullscreen` fills its parent; otherwise it sits inline. */
export function AppLoading({ label, fullscreen = true }: { label?: string; fullscreen?: boolean }) {
  const { colors, spacing } = useAppTheme();
  return (
    <View
      style={{
        flex: fullscreen ? 1 : undefined,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.lg,
      }}
    >
      <ActivityIndicator color={colors.primary} />
      {label ? (
        <AppText variant="caption" color="textMuted" style={{ marginTop: spacing.sm }}>
          {label}
        </AppText>
      ) : null}
    </View>
  );
}
