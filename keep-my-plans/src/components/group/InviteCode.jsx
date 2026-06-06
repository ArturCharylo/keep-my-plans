import { useState } from 'react';
import styles from './InviteCode.module.css';
import { COPIED_TIMEOUT_MS } from '../../constants';

export const InviteCode = ({ inviteCode }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteCode);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, COPIED_TIMEOUT_MS);
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
