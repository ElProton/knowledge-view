import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { NeedDocument, NeedStatus } from '../../types/document.types';
import { ResourceView } from '../../components/generic/ResourceView';
import { NeedForm } from '../../components/needs/NeedForm';
import { NeedWorkflowActions } from '../../components/needs/NeedWorkflowActions';
import { useResource } from '../../hooks/useResource';
import { needsConfig } from '../../features/needs/needs.config';

export default function NeedDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [isUpdating, setIsUpdating] = useState(false);

  const { currentItem, loading, error, fetchOne, update, remove } = useResource<NeedDocument>(needsConfig);

  useEffect(() => {
    if (id) {
      fetchOne(id).catch((err) => {
        console.error('Error loading need:', err);
      });
    }
  }, [id, fetchOne]);

  const handleSubmit = async (data: Partial<NeedDocument>) => {
    if (!id) {
      return;
    }

    try {
      await update(id, data);
      alert('Besoin mis à jour avec succès.');
    } catch (err) {
      console.error('Error updating need:', err);
    }
  };

  const handleDelete = async () => {
    if (!id) {
      return;
    }

    try {
      await remove(id);
    } catch (err) {
      console.error('Error deleting need:', err);
      throw err;
    }
  };

  const handleStatusChange = async (newStatus: NeedStatus, response?: string) => {
    if (!id || !currentItem) {
      return;
    }

    setIsUpdating(true);
    try {
      const updatedData: Partial<NeedDocument> = {
        data: {
          ...currentItem.data,
          status: newStatus,
          response: response || currentItem.data.response,
          iteration: response ? currentItem.data.iteration + 1 : currentItem.data.iteration,
        },
      };

      await update(id, updatedData);
      alert(`Statut mis à jour vers: ${newStatus}`);
      
      // Recharger les données mises à jour
      await fetchOne(id);
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Erreur lors de la mise à jour du statut.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <ResourceView
      config={needsConfig}
      mode="edit"
      FormComponent={NeedForm}
      initialValues={currentItem || undefined}
      loading={loading}
      error={error}
      onSubmit={handleSubmit}
      onDelete={handleDelete}
      listPath="/need"
      onRetry={() => id && fetchOne(id)}
      extraActions={
        currentItem && (
          <NeedWorkflowActions
            need={currentItem}
            onStatusChange={handleStatusChange}
            isLoading={isUpdating}
          />
        )
      }
    />
  );
}
