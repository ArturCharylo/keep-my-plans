import { Link, useLocation } from 'react-router-dom';
import styles from './Navigation.module.css';
import { ROUTES } from '../../constants';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';

export const Navigation = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navLinks = [
    { name: 'Moje Grupy', path: ROUTES.HOME, icon: 'group' },
    // You can add more links here when required
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <header className={`${styles.desktopNav}`}>
        <div className={styles.desktopContainer}>
          {/* Brand */}
          <div className={styles.brand}>
            <Link to={ROUTES.HOME} className={styles.brandLink}>
              Keep My Plans
            </Link>
          </div>

          {/* Center Links */}
          {user && (
            <nav className={styles.centerNav}>
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`${styles.navLink} ${
                    location.pathname === link.path ||
                    (link.path === ROUTES.HOME && location.pathname.startsWith('/group/'))
                    ? styles.activeLink : ''
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          )}

          {/* Actions */}
          <div className={styles.actions}>
            <button className={styles.iconButton} aria-label="Powiadomienia">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button
              className={styles.iconButton}
              onClick={toggleTheme}
              aria-label="Przełącz motyw"
            >
              <span className="material-symbols-outlined">
                {theme === 'dark' ? 'light_mode' : 'dark_mode'}
              </span>
            </button>

            {user ? (
              <>
                <button className={styles.logoutButton} onClick={handleLogout}>
                  Wyloguj
                </button>
                <div className={styles.avatar}>
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="User Avatar" />
                  ) : (
                    <span className="material-symbols-outlined">person</span>
                  )}
                </div>
              </>
            ) : (
              <div className={styles.loginPlaceholder}>
                 {/* For layout consistency if needed, but LoginGate is main method */}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      {user && (
        <nav className={styles.mobileNav}>
          <div className={styles.mobileContainer}>
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path ||
                               (link.path === ROUTES.HOME && location.pathname.startsWith('/group/'));
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`${styles.mobileLink} ${isActive ? styles.mobileActiveLink : ''}`}
                >
                  <span className={`material-symbols-outlined ${isActive ? styles.iconActive : ''}`}>
                    {link.icon}
                  </span>
                  <span className={styles.mobileLinkLabel}>{link.name}</span>
                </Link>
              );
            })}
             <button
                className={styles.mobileLink}
                onClick={handleLogout}
              >
                <span className="material-symbols-outlined">logout</span>
                <span className={styles.mobileLinkLabel}>Wyloguj</span>
              </button>
          </div>
        </nav>
      )}
    </>
  );
};
