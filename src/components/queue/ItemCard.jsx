import React, { useCallback, useState } from 'react';
import styles from './ItemCard.module.css';
import { useAuth } from '../../hooks/useAuth';
import { useItemReactions } from '../../hooks/useItemReactions';
import { deleteItem } from '../../services/queueService';
import { WatchedToggle } from './WatchedToggle';
import { OpinionForm } from './OpinionForm';
import { ReactionSummary } from './ReactionSummary';
import { Button } from '../common/Button';
import { ConfirmModal } from '../common/ConfirmModal';
import { ITEM_TYPE_LABELS } from '../../constants';

export const ItemCard = React.memo(({ item, groupId, groupMembersCount, filter }) => {
  const { user } = useAuth();
  const { reactions, myReaction, loading: reactionsLoading } = useItemReactions({ groupId, itemId: item.id });

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [imageFailed, setImageFailed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isAuthor = user && item.addedBy === user.uid;

  const handleDeleteClick = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    setIsModalOpen(false);
    setDeleteLoading(true);
    setDeleteError('');

    try {
      await deleteItem(groupId, item.id);
    } catch (err) {
      console.error('Failed to delete item:', err);
      setDeleteError('Nie udało się usunąć pozycji.');
      setDeleteLoading(false);
    }
  }, [groupId, item.id]);

  const handleCancelDelete = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleImageError = useCallback(() => {
    setImageFailed(true);
  }, []);

  if (filter === 'watched' && !myReaction?.watched) return null;
  if (filter === 'unwatched' && myReaction?.watched) return null;

  return (
    <div className={styles.card}>
      {deleteError && (
        <div className={styles.errorBanner} aria-live="assertive">
          {deleteError}
        </div>
      )}

      <div className={styles.header}>
        <div className={styles.titleInfo}>
          <h3 className={styles.title}>{item.title}</h3>
          <span className={styles.typeBadge}>
            {ITEM_TYPE_LABELS[item.type] || item.type}
          </span>
        </div>

        {isAuthor && (
          <Button
            variant="danger"
            onClick={handleDeleteClick}
            loading={deleteLoading}
            disabled={deleteLoading}
          >
            Usuń
          </Button>
        )}
      </div>

      <div className={styles.content}>
        {item.coverUrl && !imageFailed && (
          <div className={styles.coverContainer}>
            <img
              src={item.coverUrl}
              alt={`Okładka dla ${item.title}`}
              className={styles.coverImage}
              onError={handleImageError}
            />
          </div>
        )}

        <div className={styles.details}>
          {item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              Zobacz link zew.
            </a>
          )}

          {item.notes && (
            <p className={styles.notes}>{item.notes}</p>
          )}

          {!reactionsLoading && (
            <>
              <WatchedToggle
                groupId={groupId}
                itemId={item.id}
                currentWatched={myReaction?.watched || false}
              />

              <OpinionForm
                key={`${item.id}-${myReaction?.rating}-${myReaction?.opinion}`}
                groupId={groupId}
                itemId={item.id}
                initialRating={myReaction?.rating || 0}
                initialOpinion={myReaction?.opinion || ''}
              />

              <ReactionSummary
                reactions={reactions}
                totalMembers={groupMembersCount}
              />
            </>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={isModalOpen}
        title="Potwierdzenie"
        message="Czy na pewno chcesz usunąć tę pozycję z kolejki?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
});

ItemCard.displayName = 'ItemCard';
