import { useAuth } from '@/auth/useAuth';
import { Button } from '@/components/common/Button/Button';
import styles from './Header.module.css';

export const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <span className={styles.logoIcon}>📊</span>
        <span className={styles.logoText}>KB Admin</span>
      </div>
      
      <div className={styles.userSection}>
        {user && (
          <>
            <span className={styles.username}>{user.username}</span>
            <Button variant="secondary" size="small" onClick={logout}>
              Déconnexion
            </Button>
          </>
        )}
      </div>
    </header>
  );
};
