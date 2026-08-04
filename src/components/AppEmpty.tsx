import { View } from 'react-native';

import { useAppTheme } from '../theme';
import { AppButton } from './AppButton';
import { AppText } from './AppText';

/** Shown when a request succeeded and returned nothing — not when it failed. */
export function AppEmpty({
  title,
  message,
  actionLabel,
  onAction,
}: {
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  const { spacing } = useAppTheme();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg }}>
      <AppText variant="heading">{title}</AppText>
      {message ? (
        <AppText
          variant="body"
          color="textMuted"
          style={{ marginTop: spacing.sm, textAlign: 'center' }}
        >
          {message}
        </AppText>
      ) : null}
      {actionLabel && onAction ? (
        <AppButton
          title={actionLabel}
          variant="secondary"
          onPress={onAction}
          style={{ marginTop: spacing.lg }}
        />
      ) : null}
    </View>
  );
}
