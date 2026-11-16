import { getActivityProgress, getActivityStatus } from './activityStatus';

export function createActivity(record) {
  const modules = (record.modules || []).map((module) => ({ ...module, completed: Boolean(module.completed) }));
  const normalized = { ...record, modules };
  return {
    id: record.id,
    code: record.code,
    title: record.title,
    category: record.category,
    description: record.description,
    duration: record.duration,
    dueDate: record.dueDate,
    status: getActivityStatus(normalized),
    progress: getActivityProgress(normalized),
    icon: record.icon,
    saved: Boolean(record.saved),
    modules,
  };
}
