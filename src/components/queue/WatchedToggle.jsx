import { useState } from 'react';
import styles from './WatchedToggle.module.css';
import { setReaction } from '../../services/queueService';
import { useAuth } from '../../hooks/useAuth';

export const WatchedToggle = ({ groupId, itemId, currentWatched = false }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const handleToggle = async () => {
    if (!user) return;

    setLoading(true);
    setError('');

    try {
      await setReaction(groupId, itemId, user, { watched: !currentWatched });
    } catch (err) {
      console.error('Failed to update watched status:', err);
      setError('Wystąpił błąd podczas zapisywania.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <label className={styles.label}>
        <input
          type="checkbox"
          checked={currentWatched}
          onChange={handleToggle}
          disabled={loading}
          className={styles.checkbox}
          aria-label="Oznacz jako obejrzane"
        />
        <span className={styles.text}>Obejrzałem/am</span>
      </label>

      {loading && <span className={styles.loadingText} aria-live="polite">Zapisywanie...</span>}

      {error && (
        <span className={styles.error} aria-live="polite">
          {error}
        </span>
      )}
    </div>
  );
};
