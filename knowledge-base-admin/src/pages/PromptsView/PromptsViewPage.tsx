import { ContentFrame } from '@/components/layout/ContentFrame/ContentFrame';
import styles from './PromptsViewPage.module.css';

const PromptsViewPage = () => {
  return (
    <ContentFrame title="Visualisation des Prompts">
      <div className={styles.placeholder}>
        <span className={styles.icon}>💬</span>
        <h2>Section en cours de développement</h2>
        <p>
          Cette section permettra de visualiser et modifier les prompts 
          d'instruction des agents IA.
        </p>
        <ul>
          <li>Liste des prompts disponibles</li>
          <li>Visualisation formatée</li>
          <li>Édition avec prévisualisation Markdown</li>
        </ul>
      </div>
    </ContentFrame>
  );
};

export default PromptsViewPage;
