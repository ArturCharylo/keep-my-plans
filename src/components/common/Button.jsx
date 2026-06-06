import styles from './Button.module.css';

export const Button = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  loading = false,
  type = 'button'
}) => {
  const baseClass = styles.button;
  const variantClass = styles[variant] || styles.primary;

  return (
    <button
      type={type}
      className={`${baseClass} ${variantClass} ${loading ? styles.loading : ''}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && <span className={styles.spinner} aria-hidden="true" />}
      <span className={loading ? styles.hiddenText : ''}>{children}</span>
    </button>
  );
};
