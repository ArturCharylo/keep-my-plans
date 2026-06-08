import { useState } from 'react';
import styles from './QueueView.module.css';
import { useQueueItems } from '../../hooks/useQueueItems';
import { ItemCard } from './ItemCard';
import { AddItemForm } from './AddItemForm';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

const FILTER_OPTIONS = {
  ALL: 'all',
  UNWATCHED: 'unwatched',
  WATCHED: 'watched',
};

export const QueueView = ({ groupId, groupMembersCount }) => {
  const { items, loading, error } = useQueueItems(groupId);
  const [filter, setFilter] = useState(FILTER_OPTIONS.ALL);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  if (loading) {
    return (
      <div className={styles.loadingContainer} aria-live="polite">
        Ładowanie kolejki...
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer} aria-live="assertive">
        Nie udało się załadować kolejki.
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.headerControls}>
        <Button onClick={() => setIsAddModalOpen(true)}>
          + Dodaj pozycję
        </Button>
      </div>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Dodaj pozycję"
      >
        <AddItemForm groupId={groupId} onSuccess={() => setIsAddModalOpen(false)} />
      </Modal>

      <div className={styles.filters}>
        <span className={styles.filterLabel}>Filtruj:</span>
        <button
          className={`${styles.filterBtn} ${filter === FILTER_OPTIONS.ALL ? styles.active : ''}`}
          onClick={() => setFilter(FILTER_OPTIONS.ALL)}
          aria-pressed={filter === FILTER_OPTIONS.ALL}
        >
          Wszystkie
        </button>
        <button
          className={`${styles.filterBtn} ${filter === FILTER_OPTIONS.UNWATCHED ? styles.active : ''}`}
          onClick={() => setFilter(FILTER_OPTIONS.UNWATCHED)}
          aria-pressed={filter === FILTER_OPTIONS.UNWATCHED}
        >
          Nieobejrzane
        </button>
        <button
          className={`${styles.filterBtn} ${filter === FILTER_OPTIONS.WATCHED ? styles.active : ''}`}
          onClick={() => setFilter(FILTER_OPTIONS.WATCHED)}
          aria-pressed={filter === FILTER_OPTIONS.WATCHED}
        >
          Obejrzane
        </button>
      </div>

      <div className={styles.list}>
        {items.length === 0 ? (
          <div className={styles.emptyState}>
            Kolejka jest pusta. Dodaj coś jako pierwszy!
          </div>
        ) : (
          items.map(item => (
            <ItemCard
              key={item.id}
              item={item}
              groupId={groupId}
              groupMembersCount={groupMembersCount}
              filter={filter}
            />
          ))
        )}
      </div>
    </div>
  );
};
