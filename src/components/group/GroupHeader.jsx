import { useNavigate } from 'react-router-dom';
import styles from './GroupHeader.module.css';
import { Button } from '../common/Button';
import { InviteCode } from './InviteCode';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';

export const GroupHeader = ({ groupName, inviteCode, membersCount, onLeave }) => {
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
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
          <Button variant="secondary" onClick={toggleTheme} aria-label="Przełącz motyw">
            {theme === 'dark' ? '☀️' : '🌙'}
          </Button>
          <Button variant="secondary" onClick={onLeave}>
            Opuść grupę
          </Button>
          <Button variant="secondary" onClick={handleLogout}>
            Wyloguj
          </Button>
        </div>
      </div>

      <div className={styles.inviteContainer}>
        <InviteCode inviteCode={inviteCode} />
      </div>
    </header>
  );
};
