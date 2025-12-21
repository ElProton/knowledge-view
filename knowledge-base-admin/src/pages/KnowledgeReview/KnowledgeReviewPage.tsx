import { ContentFrame } from '@/components/layout/ContentFrame/ContentFrame';
import styles from './KnowledgeReviewPage.module.css';

const KnowledgeReviewPage = () => {
  return (
    <ContentFrame title="Gestion des Connaissances">
      <div className={styles.placeholder}>
        <span className={styles.icon}>📚</span>
        <h2>Section en cours de développement</h2>
        <p>
          Cette section permettra de consulter et modifier les documents 
          de connaissance stockés dans la base.
        </p>
        <ul>
          <li>Liste des documents de type <code>knowledge</code></li>
          <li>Filtrage par status</li>
          <li>Édition du contenu Markdown</li>
        </ul>
      </div>
    </ContentFrame>
  );
};

export default KnowledgeReviewPage;
