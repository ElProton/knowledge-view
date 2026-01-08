import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ApplicationDocument } from '../../types/document.types';
import { ResourceView } from '../../components/generic/ResourceView';
import { ApplicationForm } from '../../components/applications/ApplicationForm';
import { useResource } from '../../hooks/useResource';
import { applicationsConfig } from '../../features/applications/applications.config';

/**
 * Page de détail/édition d'une application.
 * Utilise le composant générique ResourceView avec le formulaire spécifique aux applications.
 */
export default function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { currentItem, loading, error, fetchOne, update, remove } = 
    useResource<ApplicationDocument>(applicationsConfig);

  useEffect(() => {
    if (id) {
      fetchOne(id).catch((err) => {
        console.error('Error loading application:', err);
      });
    }
  }, [id, fetchOne]);

  const handleSubmit = async (data: Partial<ApplicationDocument>) => {
    if (!id) {
      return;
    }

    try {
      await update(id, data);
      alert('Application mise à jour avec succès.');
    } catch (err) {
      console.error('Error updating application:', err);
    }
  };

  const handleDelete = async () => {
    if (!id) {
      return;
    }

    try {
      await remove(id);
    } catch (err) {
      console.error('Error deleting application:', err);
      throw err;
    }
  };

  return (
    <ResourceView
      config={applicationsConfig}
      mode="edit"
      FormComponent={ApplicationForm}
      initialValues={currentItem || undefined}
      loading={loading}
      error={error}
      onSubmit={handleSubmit}
      onDelete={handleDelete}
      listPath="/application"
      onRetry={() => id && fetchOne(id)}
    />
  );
}
