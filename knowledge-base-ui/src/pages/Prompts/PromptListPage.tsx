import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { promptService } from '../../services/prompts/promptService';
import { PromptDocument } from '../../types/document.types';
import { Button } from '../../components/common/Button/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner/LoadingSpinner';
import { ErrorDisplay } from '../../components/common/ErrorDisplay/ErrorDisplay';
import styles from './PromptListPage.module.css';

export default function PromptListPage() {
  const navigate = useNavigate();
  const [prompts, setPrompts] = useState<PromptDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [limit, setLimit] = useState(25);
  const [skip, setSkip] = useState(0);

  const fetchPrompts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await promptService.getPrompts(limit, skip);
      setPrompts(data);
    } catch (err) {
      setError('Impossible de charger les prompts.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrompts();
  }, [limit, skip]);

  const handleNextPage = () => {
    setSkip(skip + limit);
  };

  const handlePrevPage = () => {
    setSkip(Math.max(0, skip - limit));
  };

  if (loading && prompts.length === 0) {
    return <LoadingSpinner message="Chargement des prompts..." />;
  }

  if (error) {
    return <ErrorDisplay message={error} onRetry={fetchPrompts} />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Prompts Système</h1>
        <Button onClick={() => navigate('/prompts/new')}>Ajouter un Prompt</Button>
      </div>

      <div className={styles.list}>
        {prompts.length === 0 ? (
          <p className={styles.empty}>Aucun prompt trouvé.</p>
        ) : (
          prompts.map((prompt) => (
            <div
              key={prompt.id}
              className={styles.card}
              onClick={() => navigate(`/prompts/${prompt.id}`)}
            >
              <h3 className={styles.cardTitle}>{prompt.title}</h3>
              <span className={styles.cardDate}>
                Mis à jour le : {new Date(prompt.updated_at).toLocaleDateString()}
              </span>
            </div>
          ))
        )}
      </div>

      <div className={styles.pagination}>
        <Button onClick={handlePrevPage} disabled={skip === 0} variant="secondary">
          Précédent
        </Button>
        <span className={styles.pageInfo}>
          Page {Math.floor(skip / limit) + 1}
        </span>
        <Button
          onClick={handleNextPage}
          disabled={prompts.length < limit}
          variant="secondary"
        >
          Suivant
        </Button>
        <select
          value={limit}
          onChange={(e) => {
            setLimit(Number(e.target.value));
            setSkip(0);
          }}
          className={styles.limitSelect}
        >
          <option value={10}>10 par page</option>
          <option value={25}>25 par page</option>
          <option value={50}>50 par page</option>
        </select>
      </div>
    </div>
  );
}
