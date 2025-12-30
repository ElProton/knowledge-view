import { ApiError } from '@/types/api.types';
import styles from './ErrorDisplay.module.css';

interface ErrorDisplayProps {
  error: ApiError | null;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export const ErrorDisplay = ({ error, onRetry, onDismiss }: ErrorDisplayProps) => {
  if (!error) return null;

  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorContent}>
        <span className={styles.errorIcon}>⚠️</span>
        <div className={styles.errorText}>
          <strong>Erreur {error.code > 0 ? `(${error.code})` : ''}</strong>
          <p>{error.message}</p>
          {error.details && <p className={styles.details}>{error.details}</p>}
        </div>
      </div>
      <div className={styles.errorActions}>
        {onRetry && (
          <button onClick={onRetry} className={styles.retryButton}>
            Réessayer
          </button>
        )}
        {onDismiss && (
          <button onClick={onDismiss} className={styles.dismissButton}>
            ✕
          </button>
        )}
      </div>
    </div>
  );
};
