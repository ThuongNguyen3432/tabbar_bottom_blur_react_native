import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { useAppTheme } from '../theme';
import { AppModal } from './AppModal';
import { AppText } from './AppText';

export type SelectOption<T extends string> = { value: T; label: string };

/**
 * A field that opens a list.
 *
 * Not a native picker: iOS and Android render those completely differently and
 * neither honours the app theme.
 */
export function AppSelect<T extends string>({
  options,
  value,
  onChange,
  label,
  placeholder = 'Chọn…',
}: {
  options: SelectOption<T>[];
  value: T | null;
  onChange: (next: T) => void;
  label?: string;
  placeholder?: string;
}) {
  const { colors, radius, spacing } = useAppTheme();
  const [open, setOpen] = useState(false);
  const selected = options.find(option => option.value === value);

  return (
    <View style={{ marginBottom: spacing.md }}>
      {label ? (
        <AppText variant="caption" color="textMuted" style={{ marginBottom: spacing.xs }}>
          {label}
        </AppText>
      ) : null}

      <Pressable
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        style={{
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderWidth: 1,
          borderRadius: radius.md,
          padding: spacing.md,
          minHeight: 48,
          justifyContent: 'center',
        }}
      >
        <AppText color={selected ? 'text' : 'textMuted'}>
          {selected?.label ?? placeholder}
        </AppText>
      </Pressable>

      <AppModal visible={open} onClose={() => setOpen(false)} title={label}>
        <ScrollView style={{ maxHeight: 320 }}>
          {options.map(option => (
            <Pressable
              key={option.value}
              onPress={() => {
                onChange(option.value);
                setOpen(false);
              }}
              style={{ paddingVertical: spacing.md }}
            >
              <AppText color={option.value === value ? 'primary' : 'text'}>
                {option.label}
              </AppText>
            </Pressable>
          ))}
        </ScrollView>
      </AppModal>
    </View>
  );
}
