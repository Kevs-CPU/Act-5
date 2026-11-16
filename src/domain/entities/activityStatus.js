/**
 * Derive an activity's status from its checklist so the Dashboard and
 * Laboratory Activities screen always agree, even for older saved records.
 */
export function getActivityStatus(activity) {
  const modules = Array.isArray(activity?.modules) ? activity.modules : [];

  if (modules.length > 0) {
    const completedCount = modules.filter((module) => Boolean(module.completed)).length;
    if (completedCount === modules.length) return 'completed';
    if (completedCount > 0) return 'in-progress';

    // Keep an explicitly started activity active when its checklist is empty
    // of completed items (for example, after opening it to begin working).
    const savedStatus = normalizeStatus(activity?.status);
    return savedStatus === 'in-progress' ? 'in-progress' : 'not-started';
  }

  return normalizeStatus(activity?.status);
}

export function getActivityProgress(activity) {
  const modules = Array.isArray(activity?.modules) ? activity.modules : [];
  if (modules.length > 0) {
    const completedCount = modules.filter((module) => Boolean(module.completed)).length;
    return Math.round((completedCount / modules.length) * 100);
  }
  const progress = Number(activity?.progress);
  return Number.isFinite(progress) ? Math.max(0, Math.min(100, progress)) : 0;
}


function normalizeStatus(status) {
  const value = String(status || '').trim().toLowerCase().replace(/_/g, '-');
  if (['completed', 'complete', 'done', 'all-done'].includes(value)) return 'completed';
  if (['in-progress', 'active', 'ongoing', 'started'].includes(value)) return 'in-progress';
  if (['not-started', 'not started', 'planned', 'pending', ''].includes(value)) return 'not-started';
  return 'not-started';
}
