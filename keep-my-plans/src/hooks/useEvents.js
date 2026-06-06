import { useState, useEffect } from 'react';
import { subscribeToEvents } from '../services/eventService';

export const useEvents = (groupId) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    if (!groupId) {
      setTimeout(() => {
        if (mounted) {
          setEvents([]);
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

    const unsubscribe = subscribeToEvents(groupId, (fetchedEvents) => {
      if (!mounted) return;
      try {
        setEvents(fetchedEvents);
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

  return { events, loading, error };
};
