import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import ScreenContainer from '../../components/ScreenContainer';
import AppButton from '../../components/AppButton';
import ProgressBar from '../../components/ProgressBar';
import StatusBadge from '../../components/StatusBadge';
import container from '../../../core/di/container';
import { useAppTheme } from '../../providers/ThemeProvider';

export default function ActivityDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { theme } = useAppTheme();
  const { height } = useWindowDimensions();
  const compact = height < 740;
  const { activityId } = route.params || {};
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkedModules, setCheckedModules] = useState({});
  const [loadError, setLoadError] = useState(false);
  const [modulePage, setModulePage] = useState(0);

  useEffect(() => {
    let isActive = true;
    setLoading(true);
    setModulePage(0);
    container.getActivityById.execute(activityId)
      .then(async (result) => {
        if (!isActive) return;
        if (!result) {
          setActivity(null);
          setLoadError(true);
          return;
        }

        // Opening a planned item means the student has started working on it.
        // Persist this transition so it immediately appears in the Active filter.
        const isCompleted = result.status === 'completed';
        const startedActivity = !isCompleted && result.status !== 'in-progress'
          ? { ...result, status: 'in-progress' }
          : result;
        if (startedActivity !== result) {
          await container.updateActivity(result.id, { status: 'in-progress' });
        }
        if (isActive) {
          setActivity(startedActivity);
          setLoadError(false);
        }
      })
      .catch(() => {
        if (isActive) setLoadError(true);
      })
      .finally(() => {
        if (isActive) setLoading(false);
      });

    return () => { isActive = false; };
  }, [activityId]);

  useEffect(() => {
    if (!activity) return;
    const initialChecks = {};
    activity.modules.forEach((module) => { initialChecks[module.id] = Boolean(module.completed); });
    setCheckedModules(initialChecks);
  }, [activity]);

  if (loading) {
    return (
      <ScreenContainer>
        <View style={styles.loading}><ActivityIndicator color={theme.accent} /><Text style={{ color: theme.muted, fontSize: 11 }}>Opening your activity...</Text></View>
      </ScreenContainer>
    );
  }

  if (loadError || !activity) {
    return (
      <ScreenContainer>
        <Pressable onPress={() => navigation.goBack()} style={styles.backRow} accessibilityRole="button">
          <Ionicons name="arrow-back" size={18} color={theme.text} />
          <Text style={{ color: theme.text, fontWeight: '800', fontSize: 12 }}>Back to work</Text>
        </Pressable>
        <View style={styles.errorPanel}>
          <Ionicons name="alert-circle-outline" size={28} color={theme.muted} />
          <Text style={{ color: theme.text, fontSize: 16, fontWeight: '900' }}>Activity unavailable</Text>
          <Text style={{ color: theme.muted, fontSize: 10, textAlign: 'center' }}>This item could not be opened. Return to your work list and try again.</Text>
        </View>
      </ScreenContainer>
    );
  }

  const completedModules = activity.modules.filter((module) => checkedModules[module.id]).length;
  const progress = activity.modules.length ? Math.round((completedModules / activity.modules.length) * 100) : 0;
  const displayedStatus = progress === 100 ? 'completed' : progress > 0 || activity.status === 'in-progress' ? 'in-progress' : 'not-started';

  const toggleModule = async (moduleId) => {
    const nextChecks = { ...checkedModules, [moduleId]: !checkedModules[moduleId] };
    setCheckedModules(nextChecks);
    const updatedModules = activity.modules.map((item) => ({ ...item, completed: Boolean(nextChecks[item.id]) }));
    const done = updatedModules.filter((item) => item.completed).length;
    const nextProgress = updatedModules.length ? Math.round((done / updatedModules.length) * 100) : 0;
    const updated = { ...activity, modules: updatedModules, progress: nextProgress, status: nextProgress === 100 ? 'completed' : nextProgress > 0 || activity.status === 'in-progress' ? 'in-progress' : 'not-started' };
    setActivity(updated);
    await container.updateActivity(activity.id, { modules: updatedModules, progress: nextProgress, status: updated.status });
  };

  const markAllComplete = async () => {
    const allChecked = {};
    activity.modules.forEach((module) => { allChecked[module.id] = true; });
    setCheckedModules(allChecked);
    const updatedModules = activity.modules.map((item) => ({ ...item, completed: true }));
    setActivity({ ...activity, modules: updatedModules, progress: 100, status: 'completed' });
    await container.updateActivity(activity.id, { modules: updatedModules, progress: 100, status: 'completed' });
  };

  const modulePageCount = Math.max(1, Math.ceil(activity.modules.length / 3));
  const displayedModules = activity.modules.slice(modulePage * 3, modulePage * 3 + 3);

  return (
    <ScreenContainer>
      <Pressable onPress={() => navigation.goBack()} style={styles.backRow} accessibilityRole="button">
        <View style={[styles.backIcon, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Ionicons name="arrow-back" size={17} color={theme.text} />
        </View>
        <Text style={[styles.backText, { color: theme.text }]}>Back to my work</Text>
        <View style={{ flex: 1 }} />
        <Text style={[styles.code, { color: theme.accent }]}>{activity.code}</Text>

      </Pressable>

      <View style={[styles.heroCard, compact && styles.compactHeroCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={[styles.activityIcon, compact && styles.compactActivityIcon, { backgroundColor: theme.surfaceAlt }]}>
          <Ionicons name={activity.icon || 'document-text-outline'} size={compact ? 21 : 24} color={theme.primary} />
        </View>
        <View style={styles.titleBlock}>
          <Text style={[styles.category, { color: theme.accent }]} numberOfLines={1}>{activity.category}</Text>
          <Text style={[styles.title, compact && styles.compactTitle, { color: theme.text }]} numberOfLines={2}>{activity.title}</Text>
        </View>
        <Text style={[styles.description, { color: theme.muted }]} numberOfLines={2}>{activity.description}</Text>
        <View style={styles.badgeRow}>
          <StatusBadge status={displayedStatus} />
          <Text style={[styles.dueDate, { color: theme.muted }]}>{activity.dueDate === 'Completed' ? 'Finished' : `Due ${activity.dueDate}`}</Text>
        </View>
      </View>

      <View style={styles.summaryRow}>
        <View style={[styles.summaryCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={[styles.summaryIcon, { backgroundColor: theme.accentSoft }]}><Ionicons name="time-outline" size={15} color={theme.accent} /></View>
          <View style={styles.summaryCopy}>
            <Text style={[styles.summaryLabel, { color: theme.muted }]}>Estimated time</Text>
            <Text style={[styles.summaryValue, { color: theme.text }]}>{activity.duration}</Text>
          </View>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={[styles.summaryIcon, { backgroundColor: theme.successSoft }]}><Ionicons name="checkmark-circle-outline" size={15} color={theme.success} /></View>
          <View style={styles.summaryCopy}>
            <Text style={[styles.summaryLabel, { color: theme.muted }]}>Items finished</Text>
            <Text style={[styles.summaryValue, { color: theme.text }]}>{completedModules} of {activity.modules.length}</Text>
          </View>
        </View>
      </View>

      <View style={styles.progressBlock}>
        <View style={styles.progressHeading}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Your progress</Text>
          <Text style={[styles.progressPercent, { color: theme.accent }]}>{progress}%</Text>
        </View>
        <ProgressBar progress={progress} />
      </View>

      <View style={styles.checklistHeading}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Activity checklist</Text>
          <Text style={[styles.sectionSubtitle, { color: theme.muted }]}>Tap an item when it is finished.</Text>
        </View>
        <Text style={[styles.checkCount, { color: theme.muted }]}>{completedModules}/{activity.modules.length}</Text>
      </View>

      <View style={[styles.moduleList, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        {displayedModules.map((module, index) => {
          const checked = Boolean(checkedModules[module.id]);
          return (
            <Pressable
              key={module.id}
              onPress={() => toggleModule(module.id)}
              style={[styles.moduleRow, compact && styles.compactModuleRow, index < displayedModules.length - 1 && { borderBottomColor: theme.border, borderBottomWidth: 1 }]}
              accessibilityRole="checkbox"
              accessibilityState={{ checked }}
            >
              <View style={[styles.checkbox, { backgroundColor: checked ? theme.accent : 'transparent', borderColor: checked ? theme.accent : theme.border }]}>
                {checked ? <Ionicons name="checkmark" size={13} color="#FFFFFF" /> : null}
              </View>
              <View style={styles.moduleCopy}>
                <Text style={[styles.moduleTitle, { color: checked ? theme.muted : theme.text }, checked && styles.moduleDone]} numberOfLines={1}>{module.title}</Text>
                <Text style={[styles.moduleDuration, { color: theme.muted }]}>{module.duration}</Text>
              </View>
              <Ionicons name="chevron-forward" size={14} color={theme.muted} />
            </Pressable>
          );
        })}
      </View>

      {modulePageCount > 1 ? (
        <View style={styles.modulePagination}>
          <Pressable onPress={() => setModulePage((value) => Math.max(0, value - 1))} disabled={modulePage === 0} style={[styles.pageButton, { backgroundColor: theme.surface, borderColor: theme.border, opacity: modulePage === 0 ? 0.4 : 1 }]} accessibilityRole="button" accessibilityLabel="Previous checklist page">
            <Ionicons name="chevron-back" size={13} color={theme.text} />
          </Pressable>
          <Text style={[styles.pageText, { color: theme.muted }]}>{modulePage + 1} of {modulePageCount}</Text>
          <Pressable onPress={() => setModulePage((value) => Math.min(modulePageCount - 1, value + 1))} disabled={modulePage >= modulePageCount - 1} style={[styles.pageButton, { backgroundColor: theme.surface, borderColor: theme.border, opacity: modulePage >= modulePageCount - 1 ? 0.4 : 1 }]} accessibilityRole="button" accessibilityLabel="Next checklist page">
            <Ionicons name="chevron-forward" size={13} color={theme.text} />
          </Pressable>
        </View>
      ) : null}

      <View style={styles.bottomAction}>
        <AppButton title={progress === 100 ? 'All items completed' : 'Mark all as complete'} icon="checkmark-circle-outline" onPress={markAllComplete} disabled={progress === 100} style={styles.completeButton} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 9 },
  errorPanel: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 9, paddingHorizontal: 24 },
  backRow: { minHeight: 37, flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 10 },
  backIcon: { width: 32, height: 32, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  backText: { fontSize: 11, fontWeight: '800' },
  code: { fontSize: 8, fontWeight: '900', letterSpacing: 0.9 },
  heroCard: { borderWidth: 1, borderRadius: 18, padding: 14, gap: 7 },
  compactHeroCard: { padding: 12, gap: 5 },
  activityIcon: { width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  compactActivityIcon: { width: 36, height: 36, borderRadius: 11 },
  titleBlock: { gap: 3 },
  category: { fontSize: 8, fontWeight: '900', letterSpacing: 0.7 },
  title: { fontSize: 19, lineHeight: 23, fontWeight: '900', letterSpacing: -0.5 },
  compactTitle: { fontSize: 17, lineHeight: 20 },
  description: { fontSize: 10, lineHeight: 14 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 2, gap: 8 },
  dueDate: { fontSize: 8, fontWeight: '700' },
  summaryRow: { flexDirection: 'row', gap: 8, marginTop: 9 },
  summaryCard: { flex: 1, minWidth: 0, borderWidth: 1, borderRadius: 13, padding: 9, flexDirection: 'row', alignItems: 'center', gap: 8 },
  summaryIcon: { width: 28, height: 28, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  summaryCopy: { flex: 1, minWidth: 0, gap: 2 },
  summaryLabel: { fontSize: 8, fontWeight: '700' },
  summaryValue: { fontSize: 11, fontWeight: '900' },
  progressBlock: { marginTop: 14, gap: 8 },
  progressHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: 12, fontWeight: '900' },
  progressPercent: { fontSize: 11, fontWeight: '900' },
  checklistHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 14, marginBottom: 8 },
  sectionSubtitle: { fontSize: 9, marginTop: 3 },
  checkCount: { fontSize: 9, fontWeight: '800' },
  moduleList: { borderWidth: 1, borderRadius: 15, paddingHorizontal: 11 },
  moduleRow: { minHeight: 53, flexDirection: 'row', alignItems: 'center', paddingVertical: 8, gap: 10 },
  compactModuleRow: { minHeight: 47, paddingVertical: 6 },
  checkbox: { width: 21, height: 21, borderWidth: 1.5, borderRadius: 7, alignItems: 'center', justifyContent: 'center' },
  moduleCopy: { flex: 1, minWidth: 0, gap: 2 },
  moduleTitle: { fontSize: 10, fontWeight: '800' },
  moduleDone: { textDecorationLine: 'line-through' },
  moduleDuration: { fontSize: 8 },
  modulePagination: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 11, paddingTop: 7 },
  pageButton: { width: 27, height: 25, borderWidth: 1, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  pageText: { fontSize: 8, fontWeight: '800' },
  bottomAction: { marginTop: 'auto', paddingTop: 10 },
  completeButton: { minHeight: 42 },
});
