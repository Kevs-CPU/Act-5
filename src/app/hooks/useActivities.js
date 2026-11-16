import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import container from '../../core/di/container';

export default function useActivities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const reload = useCallback(async () => {
    try { setError(null); setActivities(await container.getActivities.execute()); }
    catch (_error) { setError('Unable to load your activities.'); }
    finally { setLoading(false); }
  }, []);
  useFocusEffect(useCallback(() => { reload(); }, [reload]));
  return { activities, loading, error, reload };
}
