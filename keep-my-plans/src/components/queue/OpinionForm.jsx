import { useState, useEffect } from 'react';
import styles from './OpinionForm.module.css';
import { Button } from '../common/Button';
import { setReaction } from '../../services/queueService';
import { useAuth } from '../../hooks/useAuth';

export const OpinionForm = ({ groupId, itemId, initialRating, initialOpinion }) => {
  const [rating, setRating] = useState(initialRating || 0);
  const [opinion, setOpinion] = useState(initialOpinion || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [blurError, setBlurError] = useState('');
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    setRating(initialRating || 0);
    setOpinion(initialOpinion || '');
  }, [initialRating, initialOpinion]);

  const handleBlur = () => {
    if (opinion.length > 300) {
      setBlurError(`Przekroczono limit znaków: ${opinion.length}/300.`);
    } else {
      setBlurError('');
    }
  };

  const handleOpinionChange = (e) => {
    setOpinion(e.target.value);
    if (blurError && e.target.value.length <= 300) {
      setBlurError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (opinion.length > 300) {
      setError('Opinia jest zbyt długa.');
      return;
    }

    if (!user) return;

    setLoading(true);

    try {
      await setReaction(groupId, itemId, user.uid, {
        rating: rating > 0 ? rating : null,
        opinion: opinion.trim()
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save opinion:', err);
      setError('Wystąpił błąd podczas zapisywania opinii.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <div className={styles.ratingContainer}>
        <span className={styles.label}>Ocena:</span>
        <div className={styles.stars}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className={`${styles.star} ${star <= rating ? styles.active : ''}`}
              onClick={() => setRating(star)}
              aria-label={`Oceń na ${star}`}
            >
              ★
            </button>
          ))}
          {rating > 0 && (
            <button
              type="button"
              className={styles.clearBtn}
              onClick={() => setRating(0)}
              aria-label="Wyczyść ocenę"
            >
              Wyczyść
            </button>
          )}
        </div>
      </div>

      <div className={styles.opinionContainer}>
        <label htmlFor={`opinion-${itemId}`} className={styles.label}>
          Twoja opinia (opcjonalnie)
        </label>
        <textarea
          id={`opinion-${itemId}`}
          className={`${styles.textarea} ${blurError ? styles.textareaError : ''}`}
          value={opinion}
          onChange={handleOpinionChange}
          onBlur={handleBlur}
          placeholder="Napisz co myślisz..."
          rows={3}
        />
        <div className={styles.infoRow}>
          <span className={`${styles.charCount} ${opinion.length > 300 ? styles.countError : ''}`}>
            {opinion.length}/300
          </span>
          {blurError && <span className={styles.errorText} aria-live="polite">{blurError}</span>}
        </div>
      </div>

      {error && <div className={styles.globalError} aria-live="assertive">{error}</div>}

      <div className={styles.actions}>
        <Button type="submit" loading={loading} disabled={loading || opinion.length > 300}>
          Zapisz opinię
        </Button>
        {success && <span className={styles.success} aria-live="polite">Zapisano!</span>}
      </div>
    </form>
  );
};
