import { useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/auth/useAuth';
import { Button } from '@/components/common/Button/Button';
import { Loader } from '@/components/common/Loader/Loader';
import styles from './LoginPage.module.css';

const LoginPage = () => {
  const { login, handleCallback, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const code = searchParams.get('code');
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  useEffect(() => {
    if (code) {
      handleCallback(code);
    }
  }, [code, handleCallback]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  if (isLoading || code) {
    return <Loader fullScreen message="Authentification en cours..." />;
  }

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginCard}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>📊</span>
          <h1 className={styles.logoText}>Knowledge Base Admin</h1>
        </div>
        
        <p className={styles.description}>
          Interface d'administration de la base de connaissances. 
          Connectez-vous pour accéder à l'application.
        </p>

        <Button onClick={login} size="large">
          Se connecter
        </Button>
      </div>
    </div>
  );
};

export default LoginPage;
