import { Pressable, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useAppTheme } from '../theme';
import { AppText } from './AppText';

export function AppHeader({
  title,
  showBack = false,
  right,
}: {
  title: string;
  showBack?: boolean;
  right?: React.ReactNode;
}) {
  const { colors, spacing } = useAppTheme();
  const navigation = useNavigation();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        backgroundColor: colors.background,
      }}
    >
      {showBack ? (
        <Pressable
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Quay lại"
          // Wider than the glyph: the visible arrow is far below the 44pt
          // minimum touch target.
          hitSlop={12}
          style={{ marginRight: spacing.sm }}
        >
          <AppText variant="heading" color="primary">
            ←
          </AppText>
        </Pressable>
      ) : null}

      <AppText variant="heading" style={{ flex: 1 }} numberOfLines={1}>
        {title}
      </AppText>

      {right}
    </View>
  );
}
