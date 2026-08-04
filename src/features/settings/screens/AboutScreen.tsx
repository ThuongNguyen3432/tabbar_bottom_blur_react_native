import { ScrollView, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { APP } from '../../../constants/app';
import { env } from '../../../config';
import { useAppTheme } from '../../../theme';

/** A second drawer destination, so the drawer has somewhere to navigate to. */
export function AboutScreen() {
  const { colors, spacing, radius, typography } = useAppTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={{ padding: spacing.md, paddingTop: insets.top + spacing.lg }}
    >
      <Pressable
        onPress={() => navigation.goBack()}
        style={{ marginBottom: spacing.md }}
        accessibilityRole="button"
      >
        <Text style={[typography.body, { color: colors.primary }]}>← Quay lại</Text>
      </Pressable>

      <Text style={[typography.title, { color: colors.text }]}>{APP.name}</Text>

      <View
        style={{
          backgroundColor: colors.surface,
          borderRadius: radius.md,
          padding: spacing.md,
          marginTop: spacing.lg,
        }}
      >
        <Text style={[typography.caption, { color: colors.textMuted }]}>Môi trường</Text>
        <Text style={[typography.bodyStrong, { color: colors.text }]}>
          {env.environment}
        </Text>

        <Text
          style={[typography.caption, { color: colors.textMuted, marginTop: spacing.md }]}
        >
          API
        </Text>
        <Text style={[typography.body, { color: colors.text }]}>{env.apiUrl}</Text>
      </View>
    </ScrollView>
  );
}
