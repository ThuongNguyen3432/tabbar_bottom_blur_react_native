import { Pressable, View } from 'react-native';

import { useAppTheme } from '../theme';
import { AppText } from './AppText';

export function AppCheckbox({
  checked,
  onChange,
  label,
  disabled,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label?: string;
  disabled?: boolean;
}) {
  const { colors, radius, spacing } = useAppTheme();

  return (
    <Pressable
      onPress={() => onChange(!checked)}
      disabled={disabled}
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.sm,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <View
        style={{
          width: 22,
          height: 22,
          borderRadius: radius.sm - 2,
          borderWidth: 2,
          borderColor: checked ? colors.primary : colors.border,
          backgroundColor: checked ? colors.primary : 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: spacing.sm,
        }}
      >
        {checked ? (
          <AppText variant="caption" color="textOnPrimary">
            ✓
          </AppText>
        ) : null}
      </View>
      {label ? <AppText variant="body">{label}</AppText> : null}
    </Pressable>
  );
}
