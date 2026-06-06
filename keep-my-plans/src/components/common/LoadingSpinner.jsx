import styles from './LoadingSpinner.module.css';

export const LoadingSpinner = ({ fullScreen = false }) => {
  return (
    <div className={fullScreen ? styles.fullScreenContainer : styles.container}>
      <div className={styles.spinner} role="status" aria-label="Ładowanie...">
        <span className={styles.srOnly}>Ładowanie...</span>
      </div>
      <p className={styles.text} aria-live="polite">Pobieranie danych...</p>
    </div>
  );
};
