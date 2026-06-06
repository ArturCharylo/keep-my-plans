import { useState } from 'react';
import styles from './AddEventForm.module.css';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { EVENT_TYPES } from '../../constants';
import { addEvent } from '../../services/eventService';
import { useAuth } from '../../hooks/useAuth';

export const AddEventForm = ({ groupId }) => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    type: EVENT_TYPES.MEETING,
    date: '',
    location: '',
    description: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Calculate today's date in YYYY-MM-DD for the input min attribute
  const today = new Date().toISOString().split('T')[0];

  const validate = () => {
    const newErrors = {};

    if (!formData.title || formData.title.trim().length < 2) {
      newErrors.title = 'Title must be at least 2 characters long.';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required.';
    } else if (formData.date < today) {
      newErrors.date = 'Date cannot be in the past.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!validate() || !user || !groupId) return;

    setLoading(true);

    try {
      await addEvent(groupId, {
        title: formData.title.trim(),
        type: formData.type,
        date: formData.date,
        location: formData.location.trim(),
        description: formData.description.trim(),
      }, user.uid);

      setFormData({
        title: '',
        type: EVENT_TYPES.MEETING,
        date: '',
        location: '',
        description: ''
      });
    } catch (err) {
      console.error('Error adding event:', err);
      setSubmitError('Wystąpił błąd podczas dodawania wydarzenia. Spróbuj ponownie.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Zaplanuj wydarzenie</h2>

      {submitError && (
        <div className={styles.globalError} aria-live="assertive">
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <Input
          id="event-title"
          name="title"
          label="Nazwa wydarzenia"
          value={formData.title}
          onChange={handleChange}
          placeholder="np. Wyjazd w góry"
          error={errors.title}
          required
        />

        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Szczegóły wydarzenia</legend>
        <div className={styles.row}>
          <div className={styles.fieldGroup}>
            <label htmlFor="event-type" className={styles.label}>
              Rodzaj <span className={styles.required}>*</span>
            </label>
            <select
              id="event-type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className={styles.select}
              required
            >
              <option value={EVENT_TYPES.MEETING}>Spotkanie</option>
              <option value={EVENT_TYPES.TRIP}>Wyjazd</option>
              <option value={EVENT_TYPES.OTHER}>Inne</option>
            </select>
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="event-date" className={styles.label}>
              Data <span className={styles.required}>*</span>
            </label>
            <input
              type="date"
              id="event-date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              min={today}
              className={`${styles.input} ${errors.date ? styles.inputError : ''}`}
              required
              aria-invalid={!!errors.date}
              aria-describedby={errors.date ? "event-date-error" : undefined}
            />
            {errors.date && (
              <span id="event-date-error" className={styles.error} aria-live="polite">
                {errors.date}
              </span>
            )}
          </div>
        </div>
        </fieldset>

        <Input
          id="event-location"
          name="location"
          label="Lokalizacja (opcjonalnie)"
          value={formData.location}
          onChange={handleChange}
          placeholder="np. Warszawa, ul. Prosta 1"
        />

        <div className={styles.fieldGroup}>
          <label htmlFor="event-description" className={styles.label}>
            Opis (opcjonalnie)
          </label>
          <textarea
            id="event-description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Dodatkowe informacje, plan itp."
            className={styles.textarea}
            rows={3}
          />
        </div>

        <div className={styles.actions}>
          <Button type="submit" loading={loading} disabled={loading}>
            Dodaj wydarzenie
          </Button>
        </div>
      </form>
    </div>
  );
};
