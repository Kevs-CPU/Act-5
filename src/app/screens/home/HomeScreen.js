import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ScreenContainer from '../../components/ScreenContainer';
import StatCard from '../../components/StatCard';
import ActivityCard from '../../components/ActivityCard';
import useActivities from '../../hooks/useActivities';
import { getActivityStatus } from '../../../domain/entities/activityStatus';
import { useAppTheme } from '../../providers/ThemeProvider';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { theme } = useAppTheme();
  const { height } = useWindowDimensions();
  const compact = height < 760;
  const { activities, loading, error } = useActivities();

  const completed = activities.filter((item) => getActivityStatus(item) === 'completed').length;
  const active = activities.filter((item) => getActivityStatus(item) === 'in-progress').length;
  const planned = activities.filter((item) => getActivityStatus(item) === 'not-started').length;

  const openStatus = (filter) => navigation.navigate('Activities', { filter, filterRequestId: Date.now() });
  const continueItems = activities.filter((item) => getActivityStatus(item) === 'in-progress').slice(0, compact ? 1 : 2);

  const openActivity = (activityId) => navigation.navigate('ActivityDetail', { activityId });

  return (
    <ScreenContainer>
      <View style={styles.topBar}>
        <View style={styles.brandRow}>
          <View style={[styles.brandIcon, { backgroundColor: theme.primary }]}>
            <Ionicons name="grid" size={18} color={theme.primaryText} />
          </View>
          <View>
            <Text style={[styles.brandName, { color: theme.text }]}>LABSPACE</Text>
            <Text style={[styles.brandTag, { color: theme.muted }]}>YOUR LEARNING WORKSPACE</Text>
          </View>
        </View>
        <Pressable onPress={() => navigation.navigate('Settings')} style={[styles.avatar, { backgroundColor: theme.accentSoft }]} accessibilityRole="button" accessibilityLabel="Open settings">
          <Ionicons name="person-outline" size={18} color={theme.accent} />
        </Pressable>
      </View>

      <View style={[styles.greeting, compact && styles.compactGreeting]}>
        <Text style={[styles.eyebrow, { color: theme.accent }]}>STUDENT WORKSPACE</Text>
        <Text style={[styles.pageTitle, { color: theme.text }]}>Welcome back.</Text>
        <Text style={[styles.pageSubtitle, { color: theme.muted }]}>Your projects, progress, and next steps — all in one place.</Text>
      </View>

      <View style={[styles.hero, compact && styles.compactHero, { backgroundColor: theme.hero }]}>
        <View style={styles.heroContent}>
          <View style={styles.heroCopy}>
            <Text style={[styles.heroEyebrow, { color: theme.heroMuted }]}>A SPACE FOR YOUR BEST WORK</Text>
            <Text style={styles.heroTitle}>Make every session count.</Text>
            <Text style={[styles.heroBody, { color: theme.heroMuted }]} numberOfLines={2}>Keep your laboratory work organized and move forward one step at a time.</Text>
          </View>
          <View style={styles.heroArtwork}>
            <Ionicons name="albums-outline" size={34} color="#FFFFFF" />
            <View style={styles.artworkDot} />
          </View>
        </View>
        <Pressable onPress={() => navigation.navigate('Activities')} style={styles.heroAction} accessibilityRole="button">
          <Text style={styles.heroActionText}>Explore my work</Text>
          <Ionicons name="arrow-forward" size={15} color="#193B56" />
        </Pressable>
        <View style={styles.heroDecor} />
      </View>

      <View style={styles.sectionHeading}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Your overview</Text>
        <Text style={[styles.sectionMeta, { color: theme.muted }]}>THIS TERM</Text>
      </View>

      {loading ? (
        <View style={styles.loading}><ActivityIndicator color={theme.accent} /></View>
      ) : error ? (
        <Text style={[styles.errorText, { color: theme.muted }]}>{error}</Text>
      ) : (
        <View style={styles.statsRow}>
          <StatCard label="Active" value={String(active).padStart(2, '0')} icon="time-outline" tone="accent" onPress={() => openStatus('in-progress')} />
          <StatCard label="All done" value={String(completed).padStart(2, '0')} icon="checkmark-circle-outline" tone="success" onPress={() => openStatus('completed')} />
          <StatCard label="Planned" value={String(planned).padStart(2, '0')} icon="calendar-outline" onPress={() => openStatus('not-started')} />
        </View>
      )}

      <View style={[styles.sectionHeading, styles.recentHeading]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Continue where you left off</Text>
        <Pressable onPress={() => navigation.navigate('Activities')} style={styles.viewAll} accessibilityRole="button">
          <Text style={[styles.viewAllText, { color: theme.accent }]}>View all</Text>
          <Ionicons name="chevron-forward" size={13} color={theme.accent} />
        </Pressable>
      </View>

      {loading ? null : continueItems.length ? (
        <View>
          {continueItems.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} compact onPress={() => openActivity(activity.id)} />
          ))}
        </View>
      ) : (
        <View style={[styles.emptyCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Ionicons name="checkmark-done-circle-outline" size={22} color={theme.success} />
          <View style={styles.emptyCopy}>
            <Text style={[styles.emptyTitle, { color: theme.text }]}>You are all caught up</Text>
            <Text style={[styles.emptyText, { color: theme.muted }]}>Explore your work to find the next activity.</Text>
          </View>
        </View>
      )}

      <View style={styles.bottomNote}>
        <Ionicons name="hand-left-outline" size={13} color={theme.muted} />
        <Text style={[styles.footerText, { color: theme.muted }]}>Tap a status card to view matching activities</Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  topBar: { minHeight: 42, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 13 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brandIcon: { width: 37, height: 37, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  brandName: { fontSize: 12, fontWeight: '900', letterSpacing: 1.1 },
  brandTag: { fontSize: 7, fontWeight: '800', letterSpacing: 0.9, marginTop: 3 },
  avatar: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  greeting: { marginBottom: 15 },
  compactGreeting: { marginBottom: 11 },
  eyebrow: { fontSize: 8, letterSpacing: 1.2, fontWeight: '900', marginBottom: 5 },
  pageTitle: { fontSize: 25, lineHeight: 29, fontWeight: '900', letterSpacing: -0.8 },
  pageSubtitle: { fontSize: 10, lineHeight: 15, marginTop: 4 },
  hero: { borderRadius: 20, padding: 16, overflow: 'hidden', marginBottom: 14, minHeight: 139, justifyContent: 'space-between' },
  compactHero: { minHeight: 124, padding: 14, marginBottom: 11 },
  heroContent: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  heroCopy: { flex: 1, zIndex: 1 },
  heroEyebrow: { fontSize: 7, fontWeight: '900', letterSpacing: 1.05, marginBottom: 7 },
  heroTitle: { fontSize: 19, lineHeight: 23, fontWeight: '900', color: '#FFFFFF', letterSpacing: -0.45, maxWidth: 225 },
  heroBody: { fontSize: 9, lineHeight: 14, marginTop: 5, maxWidth: 235 },
  heroArtwork: { width: 58, height: 58, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.12)', marginRight: 2 },
  artworkDot: { position: 'absolute', width: 9, height: 9, borderRadius: 5, backgroundColor: '#49C6A7', top: 6, right: 7, borderWidth: 2, borderColor: '#193B56' },
  heroAction: { alignSelf: 'flex-start', minHeight: 31, paddingHorizontal: 11, borderRadius: 10, marginTop: 10, backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center', gap: 7 },
  heroActionText: { color: '#193B56', fontSize: 9, fontWeight: '900' },
  heroDecor: { position: 'absolute', width: 130, height: 130, borderRadius: 70, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', right: -70, bottom: -85 },
  sectionHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  sectionTitle: { fontSize: 13, fontWeight: '900', letterSpacing: -0.2 },
  sectionMeta: { fontSize: 7, fontWeight: '900', letterSpacing: 1 },
  statsRow: { flexDirection: 'row', gap: 7 },
  loading: { height: 66, alignItems: 'center', justifyContent: 'center' },
  errorText: { fontSize: 10 },
  recentHeading: { marginTop: 15, marginBottom: 8 },
  viewAll: { flexDirection: 'row', alignItems: 'center', gap: 1, paddingVertical: 3 },
  viewAllText: { fontSize: 9, fontWeight: '800' },
  emptyCard: { borderWidth: 1, borderRadius: 15, paddingHorizontal: 13, paddingVertical: 11, flexDirection: 'row', alignItems: 'center', gap: 10 },
  emptyCopy: { flex: 1, gap: 2 },
  emptyTitle: { fontSize: 11, fontWeight: '800' },
  emptyText: { fontSize: 9 },
  bottomNote: { marginTop: 'auto', paddingTop: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  footerText: { fontSize: 8, fontWeight: '600' },
});
