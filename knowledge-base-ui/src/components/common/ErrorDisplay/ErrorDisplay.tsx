import React from 'react';
import styles from './ErrorDisplay.module.css';

interface ErrorDisplayProps {
  title?: string;
  message: string;
  code?: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  title = 'Erreur',
  message,
  code,
  onRetry,
  onDismiss,
}) => {
  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorIcon}>⚠️</div>
      <div className={styles.errorContent}>
        <h3 className={styles.errorTitle}>
          {title}
          {code && <span className={styles.errorCode}> (Code: {code})</span>}
        </h3>
        <p className={styles.errorMessage}>{message}</p>
        <div className={styles.errorActions}>
          {onRetry && (
            <button onClick={onRetry} className={styles.retryButton}>
              Réessayer
            </button>
          )}
          {onDismiss && (
            <button onClick={onDismiss} className={styles.dismissButton}>
              Fermer
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
