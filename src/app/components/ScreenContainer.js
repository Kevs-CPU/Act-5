import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '../providers/ThemeProvider';

/** Fixed-viewport screen shell. Content is arranged to fit without vertical scrolling. */
export default function ScreenContainer({ children, contentContainerStyle }) {
  const { theme, isDark } = useAppTheme();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top', 'left', 'right']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
      <View style={[styles.content, contentContainerStyle]}>
        <View style={styles.inner}>{children}</View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 18, paddingTop: 10, paddingBottom: 8 },
  inner: { flex: 1, width: '100%', maxWidth: 680, alignSelf: 'center' },
});
