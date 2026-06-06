import styles from './ErrorMessage.module.css';
import { Button } from './Button';

export const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className={styles.container} role="alert" aria-live="assertive">
      <div className={styles.icon}>⚠️</div>
      <h3 className={styles.title}>Wystąpił błąd</h3>
      <p className={styles.message}>{message || 'Nie udało się załadować zawartości.'}</p>
      {onRetry && (
        <div className={styles.actions}>
          <Button onClick={onRetry} variant="secondary">
            Spróbuj ponownie
          </Button>
        </div>
      )}
    </div>
  );
};
