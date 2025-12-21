import { ContentFrame } from '@/components/layout/ContentFrame/ContentFrame';
import styles from './SpecReviewPage.module.css';

const SpecReviewPage = () => {
  return (
    <ContentFrame title="Revue des Spécifications">
      <div className={styles.placeholder}>
        <span className={styles.icon}>📋</span>
        <h2>Section en cours de développement</h2>
        <p>
          Cette section permettra de visualiser et valider les spécifications 
          générées par les agents IA (status: <code>spec_to_validate</code>).
        </p>
        <ul>
          <li>Liste des spécifications en attente</li>
          <li>Visualisation du contenu Markdown</li>
          <li>Actions: Valider / Rejeter / Modifier</li>
        </ul>
      </div>
    </ContentFrame>
  );
};

export default SpecReviewPage;
