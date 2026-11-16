import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../providers/ThemeProvider';

export default function SectionHeader({ title, subtitle, actionLabel, onAction }) {
  const { theme } = useAppTheme();
  return (
    <View style={styles.row}>
      <View style={styles.copy}>
        <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
        {subtitle ? <Text style={[styles.subtitle, { color: theme.muted }]}>{subtitle}</Text> : null}
      </View>
      {actionLabel && onAction ? (
        <Pressable onPress={onAction} style={styles.action} accessibilityRole="button">
          <Text style={[styles.actionText, { color: theme.accent }]}>{actionLabel}</Text>
          <Ionicons name="arrow-forward" size={14} color={theme.accent} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 26, marginBottom: 13, gap: 12 },
  copy: { flex: 1 },
  title: { fontSize: 18, fontWeight: '800', letterSpacing: -0.3 },
  subtitle: { fontSize: 12, marginTop: 4 },
  action: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 5 },
  actionText: { fontSize: 12, fontWeight: '700' },
});
