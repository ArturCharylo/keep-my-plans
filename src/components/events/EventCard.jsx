import { useState, useCallback } from 'react';
import styles from './EventCard.module.css';
import { Button } from '../common/Button';
import { useAuth } from '../../hooks/useAuth';
import { deleteEvent } from '../../services/eventService';
import { MAX_DESCRIPTION_LENGTH } from '../../constants';

const EVENT_TYPE_LABELS = {
  meeting: 'Spotkanie',
  trip: 'Wyjazd',
  other: 'Inne',
};

// Formatting using native Intl.DateTimeFormat
const dateFormatter = new Intl.DateTimeFormat('pl-PL', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric'
});

export const EventCard = ({ event, groupId, isPast }) => {
  const { user } = useAuth();
  const [showDetails, setShowDetails] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const isAuthor = user && event.createdBy === user.uid;
  const isDescriptionLong = event.description && event.description.length > MAX_DESCRIPTION_LENGTH;

  // We assume event.date is stored as YYYY-MM-DD
  const formattedDate = event.date
    ? dateFormatter.format(new Date(event.date))
    : '';

  const handleDelete = useCallback(async () => {
    if (!window.confirm('Czy na pewno chcesz usunąć to wydarzenie?')) {
      return;
    }

    setDeleteLoading(true);
    setDeleteError('');

    try {
      await deleteEvent(groupId, event.id);
    } catch (err) {
      console.error('Failed to delete event:', err);
      setDeleteError('Nie udało się usunąć wydarzenia.');
      setDeleteLoading(false);
    }
  }, [groupId, event.id]);

  return (
    <div className={`${styles.card} ${isPast ? styles.past : ''}`}>
      {deleteError && (
        <div className={styles.errorBanner} aria-live="assertive">
          {deleteError}
        </div>
      )}

      <div className={styles.header}>
        <div className={styles.titleInfo}>
          <h3 className={styles.title}>{event.title}</h3>
          <span className={styles.badge}>
            {EVENT_TYPE_LABELS[event.type] || event.type}
          </span>
        </div>

        {isAuthor && (
          <Button
            variant="danger"
            onClick={handleDelete}
            loading={deleteLoading}
            disabled={deleteLoading}
          >
            Usuń
          </Button>
        )}
      </div>

      <div className={styles.content}>
        <div className={styles.infoRow}>
          <span className={styles.icon} aria-hidden="true">📅</span>
          <span className={styles.infoText}>{formattedDate}</span>
        </div>

        {event.location && (
          <div className={styles.infoRow}>
            <span className={styles.icon} aria-hidden="true">📍</span>
            <span className={styles.infoText}>{event.location}</span>
          </div>
        )}

        {event.description && (
          <div className={styles.descriptionContainer}>
            <p className={styles.description}>
              {showDetails || !isDescriptionLong
                ? event.description
                : `${event.description.substring(0, MAX_DESCRIPTION_LENGTH)}...`}
            </p>
            {isDescriptionLong && (
              <button
                className={styles.toggleButton}
                onClick={() => setShowDetails(!showDetails)}
                aria-expanded={showDetails}
              >
                {showDetails ? 'Ukryj opis' : 'Pokaż pełny opis'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
