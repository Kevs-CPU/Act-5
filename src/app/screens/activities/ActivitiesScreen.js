import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, TextInput, View, useWindowDimensions, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import ScreenContainer from '../../components/ScreenContainer';
import ActivityCard from '../../components/ActivityCard';
import { useAppTheme } from '../../providers/ThemeProvider';
import useActivities from '../../hooks/useActivities';
import container from '../../../core/di/container';
import { getActivityStatus } from '../../../domain/entities/activityStatus';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'in-progress', label: 'Active' },
  { key: 'completed', label: 'All done' },
  { key: 'not-started', label: 'Planned' },
];

export default function ActivitiesScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { theme } = useAppTheme();
  const { height } = useWindowDimensions();
  const { activities, loading, error, reload } = useActivities();
  const [createOpen, setCreateOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('General');
  const [newDescription, setNewDescription] = useState('');
  const [newChecklist, setNewChecklist] = useState('');
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const initialFilter = FILTERS.some((item) => item.key === route.params?.filter) ? route.params.filter : 'all';
  const [activeFilter, setActiveFilter] = useState(initialFilter);

  const [page, setPage] = useState(0);

  useEffect(() => {
    const requestedFilter = route.params?.filter;
    if (requestedFilter && FILTERS.some((item) => item.key === requestedFilter)) {
      setActiveFilter(requestedFilter);
      setSearchQuery('');
      setPage(0);
      navigation.setParams({ filter: undefined, filterRequestId: undefined });
    }
  }, [route.params?.filter, route.params?.filterRequestId, navigation]);
  const pageSize = height < 680 ? 3 : height < 760 ? 4 : 5;

  const filteredActivities = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return activities.filter((activity) => {
      const matchesFilter = activeFilter === 'all' || getActivityStatus(activity) === activeFilter;
      const matchesSearch = !query || `${activity.title} ${activity.category} ${activity.code}`.toLowerCase().includes(query);
      return matchesFilter && matchesSearch;
    });
  }, [activities, searchQuery, activeFilter]);

  useEffect(() => {
    setPage(0);
  }, [searchQuery, activeFilter, pageSize]);

  const pageCount = Math.max(1, Math.ceil(filteredActivities.length / pageSize));
  const visibleActivities = filteredActivities.slice(page * pageSize, (page + 1) * pageSize);

  const saveActivity = async () => {
    const items = newChecklist.split(',').map((item) => item.trim()).filter(Boolean);
    if (!items.length) {
      Alert.alert('Add a checklist item', 'Enter at least one checklist item.');
      return;
    }

    setSaving(true);
    try {
      const id = editingActivity?.id || `activity-${Date.now()}`;
      const modules = items.map((title, index) => {
        const previous = editingActivity?.modules?.find((module) => module.title === title);
        return {
          id: previous?.id || `${id}-item-${index}`,
          title,
          duration: previous?.duration || '—',
          completed: Boolean(previous?.completed),
        };
      });
      const completedCount = modules.filter((module) => module.completed).length;
      const progress = modules.length ? Math.round((completedCount / modules.length) * 100) : 0;
      const status = progress === 100 ? 'completed' : progress > 0 || (editingActivity && getActivityStatus(editingActivity) === 'in-progress') ? 'in-progress' : 'not-started';
      const record = {
        ...(editingActivity || {}),
        id,
        code: editingActivity?.code || `ACT-${String(Date.now()).slice(-5)}`,
        title: newTitle.trim(),
        category: newCategory.trim() || 'General',
        description: newDescription.trim() || 'Personal activity',
        duration: `${modules.length * 10} min`,
        dueDate: editingActivity?.dueDate || 'Not set',
        status,
        progress,
        icon: editingActivity?.icon || 'document-text-outline',
        modules,
      };

      if (editingActivity) await container.updateActivity(id, record);
      else await container.createActivity(record);

      setNewTitle('');
      setNewCategory('General');
      setNewDescription('');
      setNewChecklist('');
      setEditingActivity(null);
      setCreateOpen(false);
      await reload();
    } catch (_error) {
      Alert.alert('Unable to save', 'Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScreenContainer>
      <View style={styles.headingBlock}>
        <Text style={[styles.eyebrow, { color: theme.accent }]}>YOUR WORKSPACE</Text>
        <Text style={[styles.title, { color: theme.text }]}>My Work</Text>
        <Text style={[styles.subtitle, { color: theme.muted }]}>A clear view of your laboratory activities.</Text>
        <Pressable onPress={() => setCreateOpen(true)} style={[styles.addButton, { backgroundColor: theme.primary }]}><Ionicons name="add" size={16} color={theme.primaryText}/><Text style={{ color: theme.primaryText, fontSize: 10, fontWeight: '900' }}>New activity</Text></Pressable>
      </View>

      <View style={[styles.searchBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Ionicons name="search-outline" size={17} color={theme.muted} />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by name or area"
          placeholderTextColor={theme.muted}
          returnKeyType="search"
          style={[styles.searchInput, { color: theme.text }]}
          accessibilityLabel="Search work"
        />
        {searchQuery.length > 0 ? (
          <Pressable onPress={() => setSearchQuery('')} accessibilityRole="button" accessibilityLabel="Clear search">
            <Ionicons name="close-circle" size={17} color={theme.muted} />
          </Pressable>
        ) : null}
      </View>

      <View style={styles.filterRow}>
        {FILTERS.map((filter) => {
          const selected = activeFilter === filter.key;
          return (
            <Pressable
              key={filter.key}
              onPress={() => setActiveFilter(filter.key)}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              style={[styles.filterChip, { backgroundColor: selected ? theme.primary : theme.surface, borderColor: selected ? theme.primary : theme.border }]}
            >
              <Text style={[styles.filterText, { color: selected ? theme.primaryText : theme.muted }]}>{filter.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.resultsHeader}>
        <Text style={[styles.resultsTitle, { color: theme.text }]}>Laboratory activities</Text>
        <Text style={[styles.resultCount, { color: theme.muted }]}>{filteredActivities.length} items</Text>
      </View>

      {loading ? (
        <View style={styles.loading}><ActivityIndicator color={theme.accent} /><Text style={{ color: theme.muted, fontSize: 11 }}>Loading your work...</Text></View>
      ) : error ? (
        <Text style={[styles.errorText, { color: theme.muted }]}>{error}</Text>
      ) : visibleActivities.length ? (
        <View style={styles.list}>
          {visibleActivities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} compact onPress={() => navigation.navigate('ActivityDetail', { activityId: activity.id })} onEdit={() => { setEditingActivity(activity); setNewTitle(activity.title); setNewCategory(activity.category || 'General'); setNewDescription(activity.description || ''); setNewChecklist((activity.modules || []).map((item) => item.title).join(', ')); setCreateOpen(true); }} onSave={async () => { await container.updateActivity(activity.id, { saved: !activity.saved }); await reload(); }} onDelete={() => Alert.alert('Delete activity?', 'This will permanently remove this activity and its checklist.', [{ text: 'Cancel', style: 'cancel' }, { text: 'Delete', style: 'destructive', onPress: async () => { await container.deleteActivity(activity.id); await reload(); } }])} />
          ))}
        </View>
      ) : (
        <View style={[styles.empty, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Ionicons name="search-outline" size={25} color={theme.muted} />
          <Text style={[styles.emptyTitle, { color: theme.text }]}>{activeFilter === 'in-progress' ? 'No active activities yet' : 'Nothing found'}</Text>
          <Text style={[styles.emptyText, { color: theme.muted }]}>{activeFilter === 'in-progress' ? 'Open a planned activity and complete at least one checklist item. It will appear here automatically.' : 'Try another search or choose a different filter.'}</Text>
        </View>
      )}

      {!loading && pageCount > 1 ? (
        <View style={styles.pagination}>
          <Pressable onPress={() => setPage((value) => Math.max(0, value - 1))} disabled={page === 0} style={[styles.pageButton, { backgroundColor: theme.surface, borderColor: theme.border, opacity: page === 0 ? 0.4 : 1 }]} accessibilityRole="button" accessibilityLabel="Previous page">
            <Ionicons name="chevron-back" size={15} color={theme.text} />
          </Pressable>
          <Text style={[styles.pageText, { color: theme.muted }]}>{page + 1} of {pageCount}</Text>
          <Pressable onPress={() => setPage((value) => Math.min(pageCount - 1, value + 1))} disabled={page >= pageCount - 1} style={[styles.pageButton, { backgroundColor: theme.surface, borderColor: theme.border, opacity: page >= pageCount - 1 ? 0.4 : 1 }]} accessibilityRole="button" accessibilityLabel="Next page">
            <Ionicons name="chevron-forward" size={15} color={theme.text} />
          </Pressable>
        </View>
      ) : null}
      <Modal visible={createOpen} transparent animationType="fade" onRequestClose={() => setCreateOpen(false)}>
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.modalHeading}><Text style={[styles.modalTitle, { color: theme.text }]}>{editingActivity ? 'Edit activity' : 'Create activity'}</Text><Pressable onPress={() => { setCreateOpen(false); setEditingActivity(null); }}><Ionicons name="close" size={21} color={theme.muted}/></Pressable></View>
            <TextInput value={newTitle} onChangeText={setNewTitle} placeholder="Activity name" placeholderTextColor={theme.muted} style={[styles.formInput, { color: theme.text, borderColor: theme.border }]} />
            <TextInput value={newCategory} onChangeText={setNewCategory} placeholder="Category" placeholderTextColor={theme.muted} style={[styles.formInput, { color: theme.text, borderColor: theme.border }]} />
            <TextInput value={newDescription} onChangeText={setNewDescription} placeholder="Short description (optional)" placeholderTextColor={theme.muted} style={[styles.formInput, { color: theme.text, borderColor: theme.border }]} />
            <TextInput value={newChecklist} onChangeText={setNewChecklist} multiline placeholder="Checklist items, separated by commas" placeholderTextColor={theme.muted} style={[styles.formInput, styles.checklistInput, { color: theme.text, borderColor: theme.border }]} />
            <Text style={{ color: theme.muted, fontSize: 9 }}>Separate checklist items with commas.</Text>
            <Pressable disabled={saving || !newTitle.trim()} onPress={saveActivity} style={[styles.saveButton, { backgroundColor: theme.primary, opacity: !newTitle.trim() ? 0.5 : 1 }]}><Text style={{ color: theme.primaryText, fontWeight: '900', fontSize: 11 }}>{saving ? 'Saving…' : editingActivity ? 'Update activity' : 'Save activity'}</Text></Pressable>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headingBlock: { marginBottom: 13 },
  addButton: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, marginTop: 9 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.48)', justifyContent: 'center', padding: 20 },
  modalCard: { borderWidth: 1, borderRadius: 18, padding: 16, gap: 9 },
  modalHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  modalTitle: { fontSize: 17, fontWeight: '900' },
  formInput: { minHeight: 42, borderWidth: 1, borderRadius: 10, paddingHorizontal: 11, fontSize: 11 },
  checklistInput: { minHeight: 66, textAlignVertical: 'top', paddingTop: 10 },
  saveButton: { minHeight: 42, borderRadius: 11, alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  eyebrow: { fontSize: 8, letterSpacing: 1.2, fontWeight: '900', marginBottom: 5 },
  title: { fontSize: 25, lineHeight: 30, fontWeight: '900', letterSpacing: -0.8 },
  subtitle: { fontSize: 10, lineHeight: 15, marginTop: 4 },
  searchBox: { minHeight: 43, borderRadius: 13, borderWidth: 1, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 9 },
  searchInput: { flex: 1, fontSize: 11, paddingVertical: 8 },
  filterRow: { flexDirection: 'row', gap: 6, marginTop: 10, marginBottom: 3 },
  filterChip: { flex: 1, minHeight: 31, borderWidth: 1, borderRadius: 10, paddingHorizontal: 3, alignItems: 'center', justifyContent: 'center' },
  filterText: { fontSize: 9, fontWeight: '800' },
  resultsHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, marginBottom: 8 },
  resultsTitle: { fontSize: 12, fontWeight: '900' },
  resultCount: { fontSize: 9, fontWeight: '700' },
  loading: { flex: 1, minHeight: 100, alignItems: 'center', justifyContent: 'center', gap: 8 },
  errorText: { fontSize: 10 },
  list: { flex: 0, minHeight: 0 },
  empty: { flex: 1, minHeight: 150, borderWidth: 1, borderRadius: 17, padding: 18, alignItems: 'center', justifyContent: 'center', gap: 7 },
  emptyTitle: { fontSize: 14, fontWeight: '900' },
  emptyText: { fontSize: 10, textAlign: 'center', lineHeight: 15 },
  pagination: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 14, marginTop: 'auto', paddingTop: 4 },
  pageButton: { width: 29, height: 27, borderWidth: 1, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  pageText: { fontSize: 9, fontWeight: '800' },
});
