import React from 'react';
import { Sidebar } from '../Sidebar/Sidebar';
import { MainFrame } from '../MainFrame/MainFrame';
import styles from './AppLayout.module.css';

export const AppLayout: React.FC = () => {
  return (
    <div className={styles.appLayout}>
      <Sidebar />
      <MainFrame />
    </div>
  );
};
