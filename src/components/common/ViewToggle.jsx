import styles from './ViewToggle.module.css';
import { VIEW_MODES } from '../../constants';

export const ViewToggle = ({ viewMode, onViewModeChange }) => {
  return (
    <div className={styles.container} role="group" aria-label="Wybór widoku">
      <button
        type="button"
        className={`${styles.button} ${viewMode === VIEW_MODES.QUEUE ? styles.active : ''}`}
        aria-pressed={viewMode === VIEW_MODES.QUEUE}
        onClick={() => onViewModeChange(VIEW_MODES.QUEUE)}
      >
        Kolejka
      </button>
      <button
        type="button"
        className={`${styles.button} ${viewMode === VIEW_MODES.EVENTS ? styles.active : ''}`}
        aria-pressed={viewMode === VIEW_MODES.EVENTS}
        onClick={() => onViewModeChange(VIEW_MODES.EVENTS)}
      >
        Spotkania / Wyjazdy
      </button>
    </div>
  );
};
