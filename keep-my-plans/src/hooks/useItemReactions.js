import { useState, useEffect } from 'react';
import { subscribeToReactions } from '../services/queueService';
import { useAuth } from './useAuth';

export const useItemReactions = ({ groupId, itemId }) => {
  const [reactions, setReactions] = useState({});
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    let mounted = true;

    if (!groupId || !itemId) {
      if (mounted) {
        setReactions({});
        setLoading(false);
      }
      return;
    }

    if (mounted) {
      setLoading(true);
    }

    const unsubscribe = subscribeToReactions(groupId, itemId, (fetchedReactions) => {
      if (!mounted) return;
      setReactions(fetchedReactions);
      setLoading(false);
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [groupId, itemId]);

  const myReaction = user?.uid ? (reactions[user.uid] ?? null) : null;

  return { reactions, loading, myReaction };
};
