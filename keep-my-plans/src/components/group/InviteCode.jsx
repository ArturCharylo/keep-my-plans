import { useState } from 'react';
import styles from './InviteCode.module.css';

export const InviteCode = ({ inviteCode }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteCode);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className={styles.container}>
      <span className={styles.label}>Kod zaproszenia:</span>
      <div className={styles.pill}>
        <span className={styles.code}>{inviteCode}</span>
        <button
          onClick={handleCopy}
          className={styles.copyButton}
          aria-label="Kopiuj kod zaproszenia"
        >
          {copied ? 'Skopiowano!' : 'Kopiuj'}
        </button>
      </div>
    </div>
  );
};
