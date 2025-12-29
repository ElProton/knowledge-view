import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { sectionsConfig } from '../../config/sections.config';
import styles from './HomePage.module.css';

const iconMap: Record<string, string> = {
  home: '🏠',
  document: '📄',
  book: '📚',
  code: '💻',
  default: '📁',
};

export const HomePage: React.FC = () => {
  const { user } = useAuth();

  const otherSections = sectionsConfig.filter(
    (section) => section.id !== 'home' && !section.disabled
  );

  return (
    <div className={styles.homePage}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          Bienvenue{user?.displayName ? `, ${user.displayName.split(' ')[0]}` : ''} 👋
        </h1>
        <p className={styles.subtitle}>
          Interface de gestion de la base de connaissances
        </p>
      </header>

      <section className={styles.sectionsOverview}>
        <h2 className={styles.sectionTitle}>Sections disponibles</h2>

        {otherSections.length > 0 ? (
          <div className={styles.sectionsGrid}>
            {otherSections.map((section) => (
              <Link
                key={section.id}
                to={section.path}
                className={styles.sectionCard}
              >
                <span className={styles.sectionIcon}>
                  {iconMap[section.icon || 'default']}
                </span>
                <h3 className={styles.sectionName}>{section.label}</h3>
                {section.description && (
                  <p className={styles.sectionDescription}>
                    {section.description}
                  </p>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p className={styles.emptyMessage}>
              Aucune section configurée pour le moment.
            </p>
            <p className={styles.emptyHint}>
              Les sections seront ajoutées au fur et à mesure du développement.
            </p>
          </div>
        )}
      </section>

      <section className={styles.infoSection}>
        <h2 className={styles.sectionTitle}>À propos</h2>
        <p className={styles.infoText}>
          Cette interface permet de gérer les documents de la base de connaissances :
        </p>
        <ul className={styles.infoList}>
          <li>Valider les spécifications générées par les agents IA</li>
          <li>Consulter et modifier les connaissances stockées</li>
          <li>Gérer les prompts système</li>
          <li>Suivre les prospects et autres données métier</li>
        </ul>
      </section>
    </div>
  );
};

export default HomePage;
