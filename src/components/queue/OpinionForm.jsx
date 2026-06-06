import { useState } from 'react';
import styles from './OpinionForm.module.css';
import { Button } from '../common/Button';
import { setReaction } from '../../services/queueService';
import { useAuth } from '../../hooks/useAuth';
import { MAX_OPINION_LENGTH, SUCCESS_TIMEOUT_MS, MAX_RATING_STARS, DEFAULT_TEXTAREA_ROWS } from '../../constants';

export const OpinionForm = ({ groupId, itemId, initialRating, initialOpinion }) => {
  // Use keys to reset the component when these change from parents if necessary, rather than useEffect syncs
  const [rating, setRating] = useState(initialRating || 0);
  const [opinion, setOpinion] = useState(initialOpinion || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [blurError, setBlurError] = useState('');
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();

  const handleBlur = () => {
    if (opinion.length > MAX_OPINION_LENGTH) {
      setBlurError(`Przekroczono limit znaków: ${opinion.length}/${MAX_OPINION_LENGTH}.`);
    } else {
      setBlurError('');
    }
  };

  const handleOpinionChange = (e) => {
    setOpinion(e.target.value);
    if (blurError && e.target.value.length <= MAX_OPINION_LENGTH) {
      setBlurError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (opinion.length > MAX_OPINION_LENGTH) {
      setError('Opinia jest zbyt długa.');
      return;
    }

    if (!user) return;

    setLoading(true);

    try {
      await setReaction(groupId, itemId, user, {
        rating: rating > 0 ? rating : null,
        opinion: opinion.trim()
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), SUCCESS_TIMEOUT_MS);
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
          {Array.from({ length: MAX_RATING_STARS }, (_, i) => i + 1).map((star) => (
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
          rows={DEFAULT_TEXTAREA_ROWS}
        />
        <div className={styles.infoRow}>
          <span className={`${styles.charCount} ${opinion.length > MAX_OPINION_LENGTH ? styles.countError : ''}`}>
            {opinion.length}/{MAX_OPINION_LENGTH}
          </span>
          {blurError && <span className={styles.errorText} aria-live="polite">{blurError}</span>}
        </div>
      </div>

      {error && <div className={styles.globalError} aria-live="assertive">{error}</div>}

      <div className={styles.actions}>
        <Button type="submit" loading={loading} disabled={loading || opinion.length > MAX_OPINION_LENGTH}>
          Zapisz opinię
        </Button>
        {success && <span className={styles.success} aria-live="polite">Zapisano!</span>}
      </div>
    </form>
  );
};
