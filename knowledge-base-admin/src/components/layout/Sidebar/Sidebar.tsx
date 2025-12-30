import { NavLink } from 'react-router-dom';
import { getEnabledSections } from '@/config/sections';
import styles from './Sidebar.module.css';

export const Sidebar = () => {
  const sections = getEnabledSections();

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        <ul className={styles.navList}>
          {sections.map(section => (
            <li key={section.id}>
              <NavLink
                to={section.path}
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.active : ''}`
                }
              >
                <span className={styles.icon}>{section.icon}</span>
                <span className={styles.label}>{section.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};
