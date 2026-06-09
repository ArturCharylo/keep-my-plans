import { useMemo, useState } from 'react';
import styles from './EventsView.module.css';
import { useNavigate } from 'react-router-dom';
import { useEvents } from '../../hooks/useEvents';
import { EventCard } from './EventCard';
import { AddEventForm } from './AddEventForm';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

export const EventsView = ({ groupId }) => {
  const { events, loading, error } = useEvents(groupId);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const navigate = useNavigate();

  const { upcomingEvents, pastEvents } = useMemo(() => {
    if (!events) return { upcomingEvents: [], pastEvents: [] };

    const today = new Date().toISOString().split('T')[0];
    const upcoming = [];
    const past = [];

    events.forEach(event => {
      if (event.date && event.date < today) {
        past.push(event);
      } else {
        upcoming.push(event);
      }
    });

    return { upcomingEvents: upcoming, pastEvents: past };
  }, [events]);

  if (loading) {
    return (
      <div className={styles.loadingContainer} aria-live="polite">
        Ładowanie wydarzeń...
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer} aria-live="assertive">
        Nie udało się załadować wydarzeń.
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.headerControls}>
        <Button variant="secondary" onClick={() => navigate('/')}>
          &larr; Wróć do grup
        </Button>
        
        <Button onClick={() => setIsAddModalOpen(true)}>
          + Dodaj wydarzenie
        </Button>
      </div>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Dodaj wydarzenie"
      >
        <AddEventForm groupId={groupId} onSuccess={() => setIsAddModalOpen(false)} />
      </Modal>

      <div className={styles.sections}>
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Nadchodzące</h3>
          {upcomingEvents.length === 0 ? (
            <div className={styles.emptyState}>Brak nadchodzących wydarzeń.</div>
          ) : (
            <div className={styles.list}>
              {upcomingEvents.map(event => (
                <EventCard
                  key={event.id}
                  event={event}
                  groupId={groupId}
                  isPast={false}
                />
              ))}
            </div>
          )}
        </section>

        {pastEvents.length > 0 && (
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Przeszłe</h3>
            <div className={styles.list}>
              {pastEvents.map(event => (
                <EventCard
                  key={event.id}
                  event={event}
                  groupId={groupId}
                  isPast={true}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
