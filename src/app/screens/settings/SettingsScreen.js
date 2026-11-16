import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import { useAppTheme } from '../../providers/ThemeProvider';

export default function SettingsScreen() {
  const { theme, isDark, toggleTheme } = useAppTheme();

  return (
    <ScreenContainer>
      <View style={styles.headingBlock}>
        <Text style={[styles.eyebrow, { color: theme.accent }]}>PERSONALIZE</Text>
        <Text style={[styles.title, { color: theme.text }]}>Settings</Text>
        <Text style={[styles.subtitle, { color: theme.muted }]}>A few details to make this space feel right.</Text>
      </View>

      <View style={[styles.profileCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={[styles.avatar, { backgroundColor: theme.accentSoft }]}>
          <Ionicons name="person-outline" size={21} color={theme.accent} />
        </View>
        <View style={styles.profileCopy}>
          <Text style={[styles.profileName, { color: theme.text }]}>Student Account</Text>
          <Text style={[styles.profileMeta, { color: theme.muted }]}>Personal learning space</Text>
        </View>
        <View style={[styles.memberPill, { backgroundColor: theme.successSoft }]}>
          <View style={[styles.memberDot, { backgroundColor: theme.success }]} />
          <Text style={[styles.memberText, { color: theme.success }]}>Active</Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Appearance</Text>
        <Text style={[styles.sectionMeta, { color: theme.muted }]}>APP DISPLAY</Text>
      </View>

      <View style={[styles.settingCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={[styles.settingIcon, { backgroundColor: theme.surfaceAlt }]}>
          <Ionicons name={isDark ? 'moon' : 'sunny'} size={19} color={theme.primary} />
        </View>
        <View style={styles.settingCopy}>
          <Text style={[styles.settingTitle, { color: theme.text }]}>{isDark ? 'Dark appearance' : 'Light appearance'}</Text>
          <Text style={[styles.settingDescription, { color: theme.muted }]}>Choose how LabSpace looks on this device.</Text>
        </View>
        <Switch
          value={isDark}
          onValueChange={toggleTheme}
          trackColor={{ false: theme.border, true: theme.accent }}
          thumbColor="#FFFFFF"
          ios_backgroundColor={theme.border}
          accessibilityLabel="Toggle dark appearance"
        />
      </View>

      <View style={[styles.previewCard, { backgroundColor: theme.accentSoft }]}>
        <View style={styles.previewTop}>
          <View style={[styles.previewIcon, { backgroundColor: theme.surface }]}>
            <Ionicons name="eye-outline" size={17} color={theme.accent} />
          </View>
          <View style={styles.previewCopy}>
            <Text style={[styles.previewTitle, { color: theme.text }]}>A look that works for you</Text>
            <Text style={[styles.previewSubtitle, { color: theme.muted }]}>{isDark ? 'Dark mode is on' : 'Light mode is on'} · Changes apply across the app</Text>
          </View>
        </View>
        <View style={[styles.previewSample, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={[styles.sampleLineStrong, { backgroundColor: theme.text }]} />
          <View style={[styles.sampleLine, { backgroundColor: theme.border }]} />
          <View style={[styles.sampleAccent, { backgroundColor: theme.accent }]} />
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>About</Text>
      </View>
      <View style={[styles.aboutCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={[styles.aboutIcon, { backgroundColor: theme.surfaceAlt }]}>
          <Ionicons name="grid-outline" size={19} color={theme.primary} />
        </View>
        <View style={styles.aboutCopy}>
          <Text style={[styles.aboutName, { color: theme.text }]}>LabSpace</Text>
          <Text style={[styles.aboutDescription, { color: theme.muted }]}>One organized place for your laboratory work.</Text>
        </View>
        <Text style={[styles.version, { color: theme.muted }]}>1.0</Text>
      </View>

      <View style={styles.footer}>
        <Ionicons name="heart-outline" size={12} color={theme.muted} />
        <Text style={[styles.footerText, { color: theme.muted }]}>Made for learning and creating.</Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headingBlock: { marginBottom: 15 },
  eyebrow: { fontSize: 8, letterSpacing: 1.2, fontWeight: '900', marginBottom: 5 },
  title: { fontSize: 25, lineHeight: 30, fontWeight: '900', letterSpacing: -0.8 },
  subtitle: { fontSize: 10, lineHeight: 15, marginTop: 4 },
  profileCard: { borderWidth: 1, borderRadius: 16, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 11, marginBottom: 18 },
  avatar: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  profileCopy: { flex: 1, gap: 3 },
  profileName: { fontSize: 12, fontWeight: '900' },
  profileMeta: { fontSize: 9 },
  memberPill: { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 5 },
  memberDot: { width: 5, height: 5, borderRadius: 3 },
  memberText: { fontSize: 8, fontWeight: '900' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 9 },
  sectionTitle: { fontSize: 13, fontWeight: '900' },
  sectionMeta: { fontSize: 7, fontWeight: '900', letterSpacing: 0.9 },
  settingCard: { borderWidth: 1, borderRadius: 16, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 10 },
  settingIcon: { width: 39, height: 39, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  settingCopy: { flex: 1, gap: 3 },
  settingTitle: { fontSize: 11, fontWeight: '900' },
  settingDescription: { fontSize: 8, lineHeight: 12 },
  previewCard: { borderRadius: 16, padding: 12, marginTop: 11, marginBottom: 17, gap: 11 },
  previewTop: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  previewIcon: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  previewCopy: { flex: 1, gap: 3 },
  previewTitle: { fontSize: 10, fontWeight: '900' },
  previewSubtitle: { fontSize: 8 },
  previewSample: { minHeight: 45, borderWidth: 1, borderRadius: 11, padding: 9, flexDirection: 'row', alignItems: 'center', gap: 8 },
  sampleLineStrong: { width: 52, height: 5, borderRadius: 4 },
  sampleLine: { flex: 1, height: 5, borderRadius: 4 },
  sampleAccent: { width: 22, height: 22, borderRadius: 7 },
  aboutCard: { borderWidth: 1, borderRadius: 15, padding: 11, flexDirection: 'row', alignItems: 'center', gap: 10 },
  aboutIcon: { width: 36, height: 36, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  aboutCopy: { flex: 1, gap: 3 },
  aboutName: { fontSize: 11, fontWeight: '900' },
  aboutDescription: { fontSize: 8 },
  version: { fontSize: 8, fontWeight: '800' },
  footer: { marginTop: 'auto', paddingTop: 9, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 5 },
  footerText: { fontSize: 8, fontWeight: '600' },
});
