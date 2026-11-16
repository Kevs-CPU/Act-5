import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../providers/ThemeProvider';
import ProgressBar from './ProgressBar';
import StatusBadge from './StatusBadge';

export default function ActivityCard({ activity, onPress, onEdit, onDelete, onSave, compact = false }) {
  const { theme } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Open ${activity.title}`}
      style={({ pressed }) => [
        styles.card,
        compact && styles.compactCard,
        { backgroundColor: theme.surface, borderColor: theme.border },
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.iconWrap, compact && styles.compactIcon, { backgroundColor: theme.surfaceAlt }]}>
        <Ionicons name={activity.icon || 'document-text-outline'} size={compact ? 18 : 20} color={theme.primary} />
      </View>

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, compact && styles.compactTitle, { color: theme.text }]} numberOfLines={1}>
            {activity.title}
          </Text>
          <StatusBadge status={activity.status} compact />
        </View>
        <View style={styles.metaRow}>
          <Text style={[styles.meta, { color: theme.muted }]} numberOfLines={1}>
            {activity.code}  ·  {activity.category}
          </Text>
          <Text style={[styles.duration, { color: theme.muted }]}>{activity.duration}</Text>
        </View>
        <ProgressBar progress={activity.progress} compact={compact} />
      </View>

      <Pressable onPress={() => Alert.alert(activity.title, 'Choose an action', [
        { text: 'Edit', onPress: onEdit },
        { text: activity.saved ? 'Remove from saved' : 'Save', onPress: onSave },
        { text: 'Delete', style: 'destructive', onPress: onDelete },
        { text: 'Cancel', style: 'cancel' },
      ])} hitSlop={10} accessibilityRole="button" accessibilityLabel={`More actions for ${activity.title}`} style={styles.moreButton}>
        <Ionicons name="ellipsis-vertical" size={19} color={theme.muted} />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { minHeight: 70, borderWidth: 1, borderRadius: 16, paddingHorizontal: 11, paddingVertical: 9, marginBottom: 9, flexDirection: 'row', alignItems: 'center', gap: 11 },
  compactCard: { minHeight: 62, paddingHorizontal: 10, paddingVertical: 8, marginBottom: 7, gap: 9 },
  pressed: { opacity: 0.84, transform: [{ scale: 0.995 }] },
  moreButton: { width: 30, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 9 },
  iconWrap: { width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  compactIcon: { width: 36, height: 36, borderRadius: 11 },
  content: { flex: 1, minWidth: 0, gap: 5 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 7 },
  title: { flex: 1, minWidth: 0, fontSize: 13, lineHeight: 17, fontWeight: '800', letterSpacing: -0.2 },
  compactTitle: { fontSize: 12, lineHeight: 15 },
  metaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  meta: { flex: 1, minWidth: 0, fontSize: 9, fontWeight: '600' },
  duration: { fontSize: 9, fontWeight: '600' },
});
