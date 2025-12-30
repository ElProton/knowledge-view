import React from 'react';
import { NavLink } from 'react-router-dom';
import { sectionsConfig } from '../../../config/sections.config';
import { useAuth } from '../../../contexts/AuthContext';
import styles from './Sidebar.module.css';

const iconMap: Record<string, string> = {
  home: '🏠',
  document: '📄',
  book: '📚',
  code: '💻',
  default: '📁',
};

export const Sidebar: React.FC = () => {
  const { user, signOut } = useAuth();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <span className={styles.logoIcon}>📊</span>
        <span className={styles.logoText}>KB Manager</span>
      </div>

      <nav className={styles.nav}>
        {sectionsConfig
          .filter((section) => !section.disabled && !section.hidden)
          .map((section) => (
            <NavLink
              key={section.id}
              to={section.path}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ''}`
              }
            >
              <span className={styles.navIcon}>
                {iconMap[section.icon || 'default']}
              </span>
              <span className={styles.navLabel}>{section.label}</span>
            </NavLink>
          ))}
      </nav>

      <div className={styles.userSection}>
        {user && (
          <>
            <div className={styles.userInfo}>
              <img
                src={user.photoURL || '/default-avatar.png'}
                alt={user.displayName || 'User'}
                className={styles.userAvatar}
              />
              <span className={styles.userName}>
                {user.displayName || user.email}
              </span>
            </div>
            <button onClick={signOut} className={styles.logoutButton}>
              Déconnexion
            </button>
          </>
        )}
      </div>
    </aside>
  );
};
