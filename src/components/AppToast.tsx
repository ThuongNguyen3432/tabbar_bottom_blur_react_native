import { View } from 'react-native';
import Toast, {
  type BaseToastProps,
  type ToastConfig,
} from 'react-native-toast-message';

import { useAppTheme } from '../theme';
import { AppText } from './AppText';

type Kind = 'success' | 'error' | 'info';

function ToastCard({ kind, text1, text2 }: BaseToastProps & { kind: Kind }) {
  const { colors, radius, spacing, shadows } = useAppTheme();

  const accent: Record<Kind, string> = {
    success: colors.success,
    error: colors.danger,
    info: colors.primary,
  };

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          marginHorizontal: spacing.md,
          padding: spacing.md,
          borderRadius: radius.md,
          backgroundColor: colors.surfaceElevated,
        },
        shadows.md,
      ]}
    >
      {/* A bar rather than a coloured background: the text has to stay legible
          in both palettes, which a tinted surface cannot guarantee. */}
      <View
        style={{
          width: 4,
          alignSelf: 'stretch',
          borderRadius: 2,
          backgroundColor: accent[kind],
          marginRight: spacing.sm,
        }}
      />
      <View style={{ flex: 1 }}>
        <AppText variant="bodyStrong">{text1}</AppText>
        {text2 ? (
          <AppText variant="caption" color="textMuted">
            {text2}
          </AppText>
        ) : null}
      </View>
    </View>
  );
}

/**
 * Themed replacement for the library's default toasts, whose colours are fixed
 * and unreadable on a dark background.
 *
 * Built as a hook because the config has to be rebuilt when the palette
 * changes; a module-level object would capture the palette at import time.
 */
export function useToastConfig(): ToastConfig {
  return {
    success: props => <ToastCard {...props} kind="success" />,
    error: props => <ToastCard {...props} kind="error" />,
    info: props => <ToastCard {...props} kind="info" />,
  };
}

/**
 * Render last, outside every navigator, so toasts draw above modals and sheets.
 */
export function AppToast() {
  const config = useToastConfig();
  return <Toast config={config} topOffset={60} />;
}

/**
 * Call sites use this rather than importing Toast, so swapping the library
 * later is a change to this file.
 */
export const toast = {
  success: (title: string, message?: string) =>
    Toast.show({ type: 'success', text1: title, text2: message }),
  error: (title: string, message?: string) =>
    Toast.show({ type: 'error', text1: title, text2: message }),
  info: (title: string, message?: string) =>
    Toast.show({ type: 'info', text1: title, text2: message }),
  hide: () => Toast.hide(),
};
