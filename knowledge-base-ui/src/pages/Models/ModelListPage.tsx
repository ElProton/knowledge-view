import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { modelService } from '../../services/models/modelService';
import { ModelDocument } from '../../types/document.types';
import { Button } from '../../components/common/Button/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner/LoadingSpinner';
import { ErrorDisplay } from '../../components/common/ErrorDisplay/ErrorDisplay';
import styles from './ModelListPage.module.css';

export default function ModelListPage() {
  const navigate = useNavigate();
  const [models, setModels] = useState<ModelDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [limit, setLimit] = useState(25);
  const [skip, setSkip] = useState(0);

  const fetchModels = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await modelService.getModels(limit, skip);
      setModels(data);
    } catch (err) {
      setError('Impossible de charger les modèles.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, [limit, skip]);

  const handleNextPage = () => {
    setSkip(skip + limit);
  };

  const handlePrevPage = () => {
    setSkip(Math.max(0, skip - limit));
  };

  if (loading && models.length === 0) {
    return <LoadingSpinner message="Chargement des modèles..." />;
  }

  if (error) {
    return <ErrorDisplay message={error} onRetry={fetchModels} />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Modèles de Données</h1>
        <Button onClick={() => navigate('/models/new')}>Ajouter un Modèle</Button>
      </div>

      <div className={styles.list}>
        {models.length === 0 ? (
          <p className={styles.empty}>Aucun modèle trouvé.</p>
        ) : (
          models.map((model) => (
            <div
              key={model.id}
              className={styles.card}
              onClick={() => navigate(`/models/${model.id}`)}
            >
              <h3 className={styles.cardTitle}>{model.title}</h3>
              <span className={styles.cardDate}>
                Mis à jour le : {new Date(model.updated_at).toLocaleDateString()}
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
          disabled={models.length < limit}
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
