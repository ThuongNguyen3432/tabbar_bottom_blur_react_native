import { ScrollView, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppTheme } from '../../../theme';

export function RegisterScreen() {
  const { colors, spacing, typography } = useAppTheme();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={{ padding: spacing.md, paddingTop: insets.top + spacing.xxl }}
    >
      <Text style={[typography.title, { color: colors.text }]}>Tạo tài khoản</Text>
      <Text style={[typography.body, { color: colors.textMuted, marginTop: spacing.sm }]}>
        Dùng registerSchema và useRegisterMutation, theo mẫu ở LoginScreen.
      </Text>
    </ScrollView>
  );
}
