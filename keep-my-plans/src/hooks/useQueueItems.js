import { useState, useEffect } from 'react';
import { subscribeToItems } from '../services/queueService';

export const useQueueItems = (groupId) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    if (!groupId) {
      setTimeout(() => {
        if (mounted) {
          setItems([]);
          setError(null);
          setLoading(false);
        }
      }, 0);
      return;
    }

    setTimeout(() => {
      if (mounted) {
        setLoading(true);
        setError(null);
      }
    }, 0);

    const unsubscribe = subscribeToItems(groupId, (fetchedItems) => {
      if (!mounted) return;
      try {
        setItems(fetchedItems);
        setError(null);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [groupId]);

  return { items, loading, error };
};
