import { View } from 'react-native';

import { getErrorMessage } from '../utils/getErrorMessage';
import { useAppTheme } from '../theme';
import { AppButton } from './AppButton';
import { AppText } from './AppText';

/**
 * Takes the raw error rather than a message, so every screen renders failures
 * the same way and none of them has to remember how to unwrap one.
 */
export function AppError({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  const { spacing } = useAppTheme();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg }}>
      <AppText variant="heading" color="danger">
        Có lỗi xảy ra
      </AppText>
      <AppText
        variant="body"
        color="textMuted"
        style={{ marginTop: spacing.sm, textAlign: 'center' }}
      >
        {getErrorMessage(error)}
      </AppText>
      {onRetry ? (
        <AppButton title="Thử lại" onPress={onRetry} style={{ marginTop: spacing.lg }} />
      ) : null}
    </View>
  );
}
