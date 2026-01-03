import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ModelDocument } from '../../types/document.types';
import { ResourceView } from '../../components/generic/ResourceView';
import { ModelForm } from '../../components/models/ModelForm';
import { useResource } from '../../hooks/useResource';
import { modelsConfig } from '../../features/models/models.config';

/**
 * Page de détail/édition d'un modèle existant.
 * Utilise l'architecture générique ResourceView en mode édition.
 */
export default function ModelDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { currentItem, loading, error, fetchOne, update, remove } = useResource<ModelDocument>(modelsConfig);

  useEffect(() => {
    if (id) {
      fetchOne(id);
    }
  }, [id, fetchOne]);

  const handleSubmit = async (data: Partial<ModelDocument>) => {
    if (!id) {
      return;
    }

    try {
      await update(id, data);
      alert('Modèle mis à jour avec succès.');
    } catch (err) {
      console.error('Error updating model:', err);
    }
  };

  const handleDelete = async () => {
    if (!id) {
      return;
    }

    try {
      await remove(id);
    } catch (err) {
      console.error('Error deleting model:', err);
      throw err;
    }
  };

  return (
    <ResourceView
      config={modelsConfig}
      mode="edit"
      FormComponent={ModelForm}
      initialValues={currentItem || undefined}
      loading={loading}
      error={error}
      onSubmit={handleSubmit}
      onDelete={handleDelete}
      listPath="/models"
      onRetry={() => id && fetchOne(id)}
    />
  );
}
