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

        <button
          type="button"
          className={styles.googleButton}
          onClick={handleGoogleSignIn}
          disabled={loadingAction}
        >
          <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
            <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
              <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
              <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
              <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
              <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
            </g>
          </svg>
          <span>Zaloguj przez Google</span>
        </button>
      </div>
    </div>
  );
};
