import { ReactNode, Suspense } from 'react';
import { Header } from '../Header/Header';
import { Sidebar } from '../Sidebar/Sidebar';
import { Loader } from '@/components/common/Loader/Loader';
import styles from './MainLayout.module.css';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className={styles.layout}>
      <Header />
      <div className={styles.container}>
        <Sidebar />
        <Suspense fallback={<Loader message="Chargement de la page..." />}>
          {children}
        </Suspense>
      </div>
    </div>
  );
};
