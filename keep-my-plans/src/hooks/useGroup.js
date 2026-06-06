import { useState, useEffect } from 'react';
import { subscribeToGroup } from '../services/groupService';

export const useGroup = (groupId) => {
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    if (!groupId) {
      if (mounted) {
        setGroup(null);
        setError(null);
        setLoading(false);
      }
      return;
    }

    if (mounted) {
      setGroup(null);
      setError(null);
      setLoading(true);
    }

    const unsubscribe = subscribeToGroup(groupId, (groupData) => {
      if (!mounted) return;
      if (groupData) {
        setGroup(groupData);
      } else {
        setError(new Error('GROUP_NOT_FOUND'));
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [groupId]);

  return { group, loading, error };
};