import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { modelService } from '../../services/models/modelService';
import { ModelForm } from '../../components/models/ModelForm';
import { ModelDocument } from '../../types/document.types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner/LoadingSpinner';
import { ErrorDisplay } from '../../components/common/ErrorDisplay/ErrorDisplay';
import styles from './ModelDetailPage.module.css';

export default function ModelDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [model, setModel] = useState<ModelDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchModel = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await modelService.getModel(id);
      setModel(data);
    } catch (err) {
      setError('Impossible de charger le modèle.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchModel();
  }, [fetchModel]);

  const handleSubmit = async (data: Partial<ModelDocument>) => {
    if (!id) return;
    setIsSaving(true);
    setError(null);

    try {
      await modelService.updateModel(id, data);
      await fetchModel();
      alert('Modèle mis à jour avec succès.');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage || 'Erreur lors de la mise à jour du modèle.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Chargement du modèle..." />;
  }

  if (error) {
    return <ErrorDisplay message={error} onRetry={fetchModel} />;
  }

  if (!model) {
    return <ErrorDisplay message="Modèle introuvable." />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Détail du Modèle</h1>
      </div>

      <ModelForm
        initialData={model}
        onSubmit={handleSubmit}
        isEditing={true}
        isLoading={isSaving}
      />
    </div>
  );
}
