import styles from './Input.module.css';

export const Input = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  type = 'text'
}) => {
  return (
    <div className={styles.container}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label} {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`${styles.input} ${error ? styles.inputError : ''}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && (
        <span id={`${id}-error`} className={styles.error} aria-live="polite">
          {error}
        </span>
      )}
    </div>
  );
};
