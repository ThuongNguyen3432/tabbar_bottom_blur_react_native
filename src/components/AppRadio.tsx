import { Pressable, View } from 'react-native';

import { useAppTheme } from '../theme';
import { AppText } from './AppText';

export type RadioOption<T extends string> = {
  value: T;
  label: string;
  hint?: string;
};

/**
 * Takes the whole group rather than one option, because "exactly one selected"
 * is a property of the set — a lone radio cannot enforce it.
 */
export function AppRadio<T extends string>({
  options,
  value,
  onChange,
}: {
  options: RadioOption<T>[];
  value: T;
  onChange: (next: T) => void;
}) {
  const { colors, radius, spacing } = useAppTheme();

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: radius.md,
        overflow: 'hidden',
      }}
    >
      {options.map((option, index) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: spacing.md,
              borderTopWidth: index === 0 ? 0 : 1,
              borderTopColor: colors.border,
            }}
          >
            <View style={{ flex: 1 }}>
              <AppText variant="bodyStrong">{option.label}</AppText>
              {option.hint ? (
                <AppText variant="caption" color="textMuted">
                  {option.hint}
                </AppText>
              ) : null}
            </View>
            <View
              style={{
                width: 22,
                height: 22,
                borderRadius: 11,
                borderWidth: 2,
                borderColor: selected ? colors.primary : colors.border,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {selected ? (
                <View
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: colors.primary,
                  }}
                />
              ) : null}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}
