import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ErrorDisplay } from '../../components/common/ErrorDisplay/ErrorDisplay';
import styles from './LoginPage.module.css';

export const LoginPage: React.FC = () => {
  const { user, loading, error, signIn } = useAuth();

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginCard}>
        <div className={styles.logoSection}>
          <span className={styles.logoIcon}>📊</span>
          <h1 className={styles.title}>Knowledge Base Manager</h1>
          <p className={styles.subtitle}>
            Interface de gestion de la base de connaissances
          </p>
        </div>

        {error && (
          <ErrorDisplay
            message={error}
            onDismiss={() => window.location.reload()}
          />
        )}

        <button
          onClick={signIn}
          disabled={loading}
          className={styles.googleButton}
        >
          {loading ? (
            'Connexion en cours...'
          ) : (
            <>
              <span className={styles.googleIcon}>G</span>
              Se connecter avec Google
            </>
          )}
        </button>

        <p className={styles.notice}>
          Accès réservé aux utilisateurs internes autorisés.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
