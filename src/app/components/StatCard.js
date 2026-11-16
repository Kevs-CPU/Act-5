import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../providers/ThemeProvider';

export default function StatCard({ label, value, icon, tone = 'primary', onPress }) {
  const { theme } = useAppTheme();
  const iconColor = tone === 'success' ? theme.success : tone === 'accent' ? theme.accent : theme.primary;
  const iconBackground = tone === 'success' ? theme.successSoft : tone === 'accent' ? theme.accentSoft : theme.surfaceAlt;

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={onPress ? `${label}: ${value}. Open matching activities.` : undefined}
      style={({ pressed }) => [styles.card, { backgroundColor: theme.surface, borderColor: theme.border, opacity: pressed ? 0.78 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] }]}
    >
      <View style={[styles.iconWrap, { backgroundColor: iconBackground }]}>
        <Ionicons name={icon} size={15} color={iconColor} />
      </View>
      <View style={styles.copy}>
        <Text style={[styles.value, { color: theme.text }]}>{value}</Text>
        <Text style={[styles.label, { color: theme.muted }]} numberOfLines={1}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={11} color={theme.muted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, minWidth: 0, borderWidth: 1, borderRadius: 15, paddingHorizontal: 9, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', gap: 7 },
  iconWrap: { width: 29, height: 29, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  copy: { flex: 1, minWidth: 0, gap: 1 },
  value: { fontSize: 18, lineHeight: 21, fontWeight: '900', letterSpacing: -0.5 },
  label: { fontSize: 8, fontWeight: '700' },
});
