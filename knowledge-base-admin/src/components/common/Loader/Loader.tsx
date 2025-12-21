import styles from './Loader.module.css';

interface LoaderProps {
  fullScreen?: boolean;
  message?: string;
}

export const Loader = ({ fullScreen = false, message }: LoaderProps) => {
  return (
    <div className={`${styles.loader} ${fullScreen ? styles.fullScreen : ''}`}>
      <div className={styles.spinner}></div>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
};
