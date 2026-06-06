import { useState } from 'react';
import styles from './GroupGate.module.css';
import { createGroup, joinGroupByCode } from '../../services/groupService';
import { useAuth } from '../../hooks/useAuth';
import { MIN_TITLE_LENGTH } from '../../constants';

export const GroupGate = ({ onGroupJoined }) => {
  const [activeTab, setActiveTab] = useState('create');
  const [groupName, setGroupName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { user } = useAuth();

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!user) return;

    if (groupName.trim().length < MIN_TITLE_LENGTH) {
      setError(`Nazwa grupy musi mieć co najmniej ${MIN_TITLE_LENGTH} znaki.`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { groupId } = await createGroup(groupName.trim(), user.uid);
      localStorage.setItem('watchqueue_group', groupId);
      onGroupJoined(groupId);
    } catch (err) {
      setError('Wystąpił błąd podczas tworzenia grupy.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGroup = async (e) => {
    e.preventDefault();
    if (!user) return;

    if (!inviteCode.trim()) {
      setError('Podaj kod zaproszenia.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formattedCode = inviteCode.trim().toUpperCase();
      const { groupId } = await joinGroupByCode(formattedCode, user.uid);
      localStorage.setItem('watchqueue_group', groupId);
      onGroupJoined(groupId);
    } catch (err) {
      if (err.message === 'GROUP_NOT_FOUND') {
        setError('Nie znaleziono grupy o tym kodzie.');
      } else {
        setError('Wystąpił błąd podczas dołączania do grupy.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInviteCodeChange = (e) => {
    setInviteCode(e.target.value.toUpperCase());
  };

  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        <button
          className={activeTab === 'create' ? styles.activeTab : styles.tab}
          onClick={() => { setActiveTab('create'); setError(''); }}
        >
          Utwórz grupę
        </button>
        <button
          className={activeTab === 'join' ? styles.activeTab : styles.tab}
          onClick={() => { setActiveTab('join'); setError(''); }}
        >
          Dołącz do grupy
        </button>
      </div>

      <div className={styles.content}>
        {error && (
          <div className={styles.error} aria-live="polite">
            {error}
          </div>
        )}

        {loading && (
          <div className={styles.loading} aria-live="polite">
            Przetwarzanie...
          </div>
        )}

        {activeTab === 'create' ? (
          <form onSubmit={handleCreateGroup} className={styles.form}>
            <label htmlFor="groupName" className={styles.label}>
              Nazwa grupy
            </label>
            <input
              id="groupName"
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className={styles.input}
              placeholder="Wpisz nazwę grupy"
              disabled={loading}
            />
            <button type="submit" className={styles.submitButton} disabled={loading}>
              Utwórz
            </button>
          </form>
        ) : (
          <form onSubmit={handleJoinGroup} className={styles.form}>
            <label htmlFor="inviteCode" className={styles.label}>
              Kod zaproszenia
            </label>
            <input
              id="inviteCode"
              type="text"
              value={inviteCode}
              onChange={handleInviteCodeChange}
              className={styles.input}
              placeholder="Wpisz kod (np. AB12CD)"
              disabled={loading}
            />
            <button type="submit" className={styles.submitButton} disabled={loading}>
              Dołącz
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
