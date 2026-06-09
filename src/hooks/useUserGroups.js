import { useState, useEffect } from 'react';
import { onSnapshot } from 'firebase/firestore';
import { getUserGroups } from '../services/groupService';

export const useUserGroups = (userId) => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    if (!userId) {
      setTimeout(() => {
        if (mounted) {
          setGroups([]);
          setLoading(false);
        }
      }, 0);
      return;
    }

    setTimeout(() => {
      if (mounted) {
        setLoading(true);
      }
    }, 0);

    const q = getUserGroups(userId);
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!mounted) return;
        const groupsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setGroups(groupsData);
        setLoading(false);
        setError(null);
      },
      (err) => {
        if (!mounted) return;
        console.error('Error fetching user groups:', err);
        setError(err);
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [userId]);

  return { groups, loading, error };
};
