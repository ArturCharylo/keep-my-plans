import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './HomePage.module.css';
import { useAuth } from '../hooks/useAuth';
import { useUserGroups } from '../hooks/useUserGroups';
import { GroupGate } from '../components/group/GroupGate';
import { LoginGate } from '../components/auth/LoginGate';
import { MyGroups } from '../components/group/MyGroups';
import { Modal } from '../components/common/Modal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const HomePage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

  // Load user groups
  const { groups, loading: groupsLoading } = useUserGroups(user?.uid);

  const savedGroupId = localStorage.getItem('watchqueue_group');

  useEffect(() => {
    // If we have a saved group and user is fully loaded and logged in, redirect
    if (savedGroupId && !authLoading && user) {
      navigate(`/group/${savedGroupId}`, { replace: true });
    }
  }, [savedGroupId, authLoading, user, navigate]);

  const handleGroupJoined = (groupId) => {
    setIsGroupModalOpen(false);
    navigate(`/group/${groupId}`);
  };

  // If there's a saved group but auth is pending, show loading state
  if (savedGroupId && authLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Keep My Plans</h1>
        <p className={styles.subtitle}>Zarządzaj swoimi planami ze znajomymi</p>
      </header>

      <main className={styles.main}>
        {authLoading ? (
          <LoadingSpinner />
        ) : !user ? (
          <LoginGate />
        ) : (
          <div className={styles.dashboard}>
            <div className={styles.dashboardHeader}>
              <button
                className={styles.addGroupButton}
                onClick={() => setIsGroupModalOpen(true)}
              >
                + Dodaj nową grupę
              </button>
            </div>

            {groupsLoading ? (
              <LoadingSpinner />
            ) : (
              <MyGroups groups={groups} />
            )}

            <Modal
              isOpen={isGroupModalOpen}
              onClose={() => setIsGroupModalOpen(false)}
              title="Zarządzaj grupami"
            >
              <GroupGate onGroupJoined={handleGroupJoined} />
            </Modal>
          </div>
        )}
      </main>
    </div>
  );
};
