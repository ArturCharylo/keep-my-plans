import styles from './GroupHeader.module.css';
import { Button } from '../common/Button';
import { InviteCode } from './InviteCode';

export const GroupHeader = ({ groupName, inviteCode, membersCount, onLeave }) => {


  return (
    <header className={styles.header}>
      <div className={styles.topRow}>
        <div>
          <h1 className={styles.title}>{groupName}</h1>
          <span className={styles.membersCount}>
            Członkowie: {membersCount}
          </span>
        </div>
        <div className={styles.actionButtons}>
          <Button variant="secondary" onClick={onLeave}>
            Opuść grupę
          </Button>
        </div>
      </div>

      <div className={styles.inviteContainer}>
        <InviteCode inviteCode={inviteCode} />
      </div>
    </header>
  );
};
