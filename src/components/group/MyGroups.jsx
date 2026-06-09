import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MyGroups.module.css';
import { useAuth } from '../../hooks/useAuth';
import { deleteGroup } from '../../services/groupService';
import { ConfirmModal } from '../common/ConfirmModal';

export const MyGroups = ({ groups }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [groupToDelete, setGroupToDelete] = useState(null);

  const handleTileClick = (groupId) => {
    navigate(`/group/${groupId}`);
  };

  const handleDeleteClick = (e, group) => {
    e.stopPropagation();
    setGroupToDelete(group);
  };

  const confirmDelete = useCallback(async () => {
    if (groupToDelete) {
      try {
        await deleteGroup(groupToDelete.id);
        if (localStorage.getItem('watchqueue_group') === groupToDelete.id) {
          localStorage.removeItem('watchqueue_group');
        }
      } catch (error) {
        console.error('Error deleting group:', error);
      } finally {
        setGroupToDelete(null);
      }
    }
  }, [groupToDelete]);

  const cancelDelete = useCallback(() => {
    setGroupToDelete(null);
  }, []);

  if (!groups || groups.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>Nie należysz jeszcze do żadnej grupy.</p>
        <p>Utwórz nową grupę lub dołącz do istniejącej!</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Twoje grupy</h2>
      <div className={styles.grid}>
        {groups.map((group) => (
          <div
            key={group.id}
            className={styles.tile}
            onClick={() => handleTileClick(group.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleTileClick(group.id);
              }
            }}
          >
            <div className={styles.tileHeader}>
              <h3 className={styles.groupName}>{group.name}</h3>
              {user && group.createdBy === user.uid && (
                <button
                  className={styles.deleteButton}
                  onClick={(e) => handleDeleteClick(e, group)}
                  aria-label="Usuń grupę"
                  title="Usuń grupę"
                >
                  🗑️
                </button>
              )}
            </div>
            <div className={styles.tileInfo}>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Kod:</span>
                <span className={styles.infoValue}>{group.inviteCode}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Członkowie:</span>
                <span>{group.members ? group.members.length : 0}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal
        isOpen={!!groupToDelete}
        title="Usuń grupę"
        message={`Czy na pewno chcesz usunąć grupę "${groupToDelete?.name}"? Spowoduje to bezpowrotne usunięcie wszystkich filmów i wydarzeń w tej grupie.`}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
};
