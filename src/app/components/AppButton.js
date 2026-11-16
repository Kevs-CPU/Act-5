import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../providers/ThemeProvider';

export default function AppButton({ title, onPress, variant = 'primary', icon, disabled = false, style }) {
  const { theme } = useAppTheme();
  const inverse = variant === 'inverse';
  const subtle = variant === 'subtle';
  const backgroundColor = inverse ? '#FFFFFF' : subtle ? theme.surfaceAlt : theme.primary;
  const foregroundColor = inverse ? '#193B56' : subtle ? theme.text : theme.primaryText;
  const borderColor = variant === 'outline' ? theme.border : 'transparent';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: variant === 'outline' ? 'transparent' : backgroundColor, borderColor },
        variant === 'outline' && styles.outline,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      {icon ? <Ionicons name={icon} size={17} color={variant === 'outline' ? theme.text : foregroundColor} /> : null}
      <Text style={[styles.label, { color: variant === 'outline' ? theme.text : foregroundColor }]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { minHeight: 46, paddingHorizontal: 16, borderRadius: 13, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1 },
  outline: { borderColor: '#D6DEE5' },
  label: { fontSize: 14, fontWeight: '700' },
  pressed: { opacity: 0.82, transform: [{ scale: 0.99 }] },
  disabled: { opacity: 0.45 },
});
