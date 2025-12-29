import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { sectionsConfig } from '../../../config/sections.config';
import { LoadingSpinner } from '../../common/LoadingSpinner/LoadingSpinner';
import { NotFoundPage } from '../../../pages/NotFound/NotFoundPage';
import styles from './MainFrame.module.css';

export const MainFrame: React.FC = () => {
  return (
    <main className={styles.mainFrame}>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {sectionsConfig.map((section) => (
            <Route
              key={section.id}
              path={section.path}
              element={<section.component />}
            />
          ))}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </main>
  );
};
