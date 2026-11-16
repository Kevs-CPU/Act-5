import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useAppTheme } from '../providers/ThemeProvider';

export default function ProgressBar({ progress = 0, color, compact = false }) {
  const { theme } = useAppTheme();
  const safeProgress = Math.max(0, Math.min(100, progress));
  return (
    <View style={[styles.track, compact && styles.compactTrack, { backgroundColor: theme.surfaceAlt }]}>
      <View style={[styles.fill, { width: `${safeProgress}%`, backgroundColor: color || theme.accent }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { height: 7, borderRadius: 10, overflow: 'hidden', width: '100%' },
  compactTrack: { height: 4 },
  fill: { height: '100%', borderRadius: 10 },
});
