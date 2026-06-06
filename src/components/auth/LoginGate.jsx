import { useState } from 'react';
import styles from './LoginGate.module.css';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../common/Button';
import { ErrorMessage } from '../common/ErrorMessage';

export const LoginGate = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loadingAction, setLoadingAction] = useState(false);
  const [error, setError] = useState('');

  const { loginWithEmail, registerWithEmail, signInWithGoogle } = useAuth();

  const handleAuthError = (err) => {
    console.error(err);
    if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
      setError('Nieprawidłowy email lub hasło.');
    } else if (err.code === 'auth/email-already-in-use') {
      setError('Podany adres email jest już zajęty.');
    } else if (err.code === 'auth/weak-password') {
      setError('Hasło musi mieć co najmniej 6 znaków.');
    } else if (err.code === 'auth/popup-closed-by-user') {
      setError(''); // User closed the popup, don't show error
    } else {
      setError('Wystąpił błąd podczas uwierzytelniania.');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Wypełnij wszystkie pola.');
      return;
    }

    setLoadingAction(true);
    setError('');

    try {
      await loginWithEmail(email, password);
    } catch (err) {
      handleAuthError(err);
    } finally {
      setLoadingAction(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!email || !password || !displayName) {
      setError('Wypełnij wszystkie pola.');
      return;
    }

    setLoadingAction(true);
    setError('');

    try {
      await registerWithEmail(email, password, displayName);
    } catch (err) {
      handleAuthError(err);
    } finally {
      setLoadingAction(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoadingAction(true);
    setError('');

    try {
      await signInWithGoogle();
    } catch (err) {
      handleAuthError(err);
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        <button
          className={activeTab === 'login' ? styles.activeTab : styles.tab}
          onClick={() => { setActiveTab('login'); setError(''); }}
        >
          Zaloguj się
        </button>
        <button
          className={activeTab === 'register' ? styles.activeTab : styles.tab}
          onClick={() => { setActiveTab('register'); setError(''); }}
        >
          Zarejestruj się
        </button>
      </div>

      <div className={styles.content}>
        {error && <ErrorMessage message={error} />}

        {activeTab === 'login' ? (
          <form onSubmit={handleLogin} className={styles.form}>
            <fieldset className={styles.fieldset}>
              <legend className={styles.srOnly}>Logowanie</legend>
              <label htmlFor="loginEmail" className={styles.label}>Email</label>
              <input
                id="loginEmail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                placeholder="Twój adres email"
                disabled={loadingAction}
              />

              <label htmlFor="loginPassword" className={styles.label}>Hasło</label>
              <input
                id="loginPassword"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                placeholder="Twoje hasło"
                disabled={loadingAction}
              />

              <Button type="submit" loading={loadingAction} disabled={loadingAction}>
                Zaloguj
              </Button>
            </fieldset>
          </form>
        ) : (
          <form onSubmit={handleRegister} className={styles.form}>
            <fieldset className={styles.fieldset}>
              <legend className={styles.srOnly}>Rejestracja</legend>
              <label htmlFor="registerName" className={styles.label}>Imię</label>
              <input
                id="registerName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className={styles.input}
                placeholder="Jak się nazywasz?"
                disabled={loadingAction}
              />

              <label htmlFor="registerEmail" className={styles.label}>Email</label>
              <input
                id="registerEmail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                placeholder="Twój adres email"
                disabled={loadingAction}
              />

              <label htmlFor="registerPassword" className={styles.label}>Hasło</label>
              <input
                id="registerPassword"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                placeholder="Minimum 6 znaków"
                disabled={loadingAction}
              />

              <Button type="submit" loading={loadingAction} disabled={loadingAction}>
                Zarejestruj
              </Button>
            </fieldset>
          </form>
        )}

        <div className={styles.divider}>
          <span className={styles.dividerText}>lub</span>
        </div>

        <Button
          variant="secondary"
          onClick={handleGoogleSignIn}
          disabled={loadingAction}
        >
          Zaloguj przez Google
        </Button>
      </div>
    </div>
  );
};
