import { ReactNode } from 'react';
import styles from './ContentFrame.module.css';

interface ContentFrameProps {
  children: ReactNode;
  title?: string;
}

export const ContentFrame = ({ children, title }: ContentFrameProps) => {
  return (
    <main className={styles.contentFrame}>
      {title && <h1 className={styles.title}>{title}</h1>}
      <div className={styles.content}>
        {children}
      </div>
    </main>
  );
};
