import React from 'react';
import { NavLink } from 'react-router-dom';
import { SectionConfig } from '../../../types/section.types';
import styles from './Sidebar.module.css';

const iconMap: Record<string, string> = {
  home: '🏠',
  document: '📄',
  book: '📚',
  code: '💻',
  default: '📁',
};

interface SidebarItemProps {
  section: SectionConfig;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({ section }) => {
  return (
    <NavLink
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
  );
};
