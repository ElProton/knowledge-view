import { ContentFrame } from '@/components/layout/ContentFrame/ContentFrame';
import { useAuth } from '@/auth/useAuth';
import { getEnabledSections } from '@/config/sections';
import { Link } from 'react-router-dom';
import styles from './HomePage.module.css';

const HomePage = () => {
  const { user } = useAuth();
  const sections = getEnabledSections().filter(s => s.id !== 'home');

  return (
    <ContentFrame title="Tableau de bord">
      <div className={styles.welcome}>
        <h2>Bienvenue, {user?.username} 👋</h2>
        <p>
          Utilisez le menu de gauche pour naviguer entre les différentes sections
          de l'interface d'administration.
        </p>
      </div>

      <div className={styles.sectionsGrid}>
        {sections.map(section => (
          <Link 
            key={section.id} 
            to={section.path} 
            className={styles.sectionCard}
          >
            <span className={styles.sectionIcon}>{section.icon}</span>
            <span className={styles.sectionLabel}>{section.label}</span>
          </Link>
        ))}
      </div>

      <div className={styles.info}>
        <h3>📌 Workflow de validation</h3>
        <p>
          Les spécifications générées par les agents IA sont placées en status 
          <code>spec_to_validate</code>. Accédez à la section "Revue Specs" pour 
          les valider ou les rejeter.
        </p>
      </div>
    </ContentFrame>
  );
};

export default HomePage;
