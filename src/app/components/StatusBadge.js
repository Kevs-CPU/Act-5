import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '../providers/ThemeProvider';

const LABELS = {
  completed: 'Done',
  'in-progress': 'Active',
  'not-started': 'Planned',
};

export default function StatusBadge({ status, compact = false }) {
  const { theme } = useAppTheme();
  const colors = status === 'completed'
    ? { background: theme.successSoft, foreground: theme.success }
    : status === 'in-progress'
      ? { background: theme.warningSoft, foreground: theme.warning }
      : { background: theme.neutralSoft, foreground: theme.neutral };

  return (
    <View style={[styles.badge, compact && styles.compactBadge, { backgroundColor: colors.background }]}>
      <View style={[styles.dot, compact && styles.compactDot, { backgroundColor: colors.foreground }]} />
      <Text style={[styles.label, compact && styles.compactLabel, { color: colors.foreground }]}>{LABELS[status] || 'Planned'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', borderRadius: 20, paddingHorizontal: 9, paddingVertical: 6, gap: 6 },
  compactBadge: { paddingHorizontal: 7, paddingVertical: 4, gap: 4 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  compactDot: { width: 5, height: 5, borderRadius: 3 },
  label: { fontSize: 10, fontWeight: '700' },
  compactLabel: { fontSize: 8, fontWeight: '800' },
});
