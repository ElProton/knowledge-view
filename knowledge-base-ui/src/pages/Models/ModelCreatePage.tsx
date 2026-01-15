import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { modelService } from '../../services/models/modelService';
import { ModelForm } from '../../components/models/ModelForm';
import { ModelDocument } from '../../types/document.types';
import { ErrorDisplay } from '../../components/common/ErrorDisplay/ErrorDisplay';
import styles from './ModelCreatePage.module.css';

export default function ModelCreatePage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: Partial<ModelDocument>) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!data.title) {
        throw new Error('Le titre est requis.');
      }

      const exists = await modelService.checkTitleExists(data.title);
      if (exists) {
        throw new Error('Un modèle avec ce titre existe déjà.');
      }

      await modelService.createModel(data);
      navigate('/models');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage || 'Erreur lors de la création du modèle.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Créer un nouveau Modèle</h1>
      </div>

      {error && <ErrorDisplay message={error} />}

      <ModelForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
