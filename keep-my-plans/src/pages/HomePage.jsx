import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './HomePage.module.css';
import { useAuth } from '../hooks/useAuth';
import { GroupGate } from '../components/group/GroupGate';

export const HomePage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const savedGroupId = localStorage.getItem('watchqueue_group');

  useEffect(() => {
    // If we have a saved group and user is fully loaded and logged in, redirect
    if (savedGroupId && !loading && user) {
      navigate(`/group/${savedGroupId}`, { replace: true });
    }
  }, [savedGroupId, loading, user, navigate]);

  const handleGroupJoined = (groupId) => {
    navigate(`/group/${groupId}`);
  };

  // If there's a saved group but auth is pending, show loading state
  if (savedGroupId && loading) {
    return (
      <div className={styles.loadingContainer}>
        <p aria-live="polite">Ładowanie...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Keep My Plans</h1>
        <p className={styles.subtitle}>Zarządzaj swoimi planami ze znajomymi</p>
      </header>

      <main className={styles.main}>
        {loading ? (
          <div className={styles.loadingContainer}>
            <p aria-live="polite">Przygotowywanie...</p>
          </div>
        ) : (
          <GroupGate onGroupJoined={handleGroupJoined} />
        )}
      </main>
    </div>
  );
};
