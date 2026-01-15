import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { promptService } from '../../services/prompts/promptService';
import { PromptForm } from '../../components/prompts/PromptForm';
import { PromptDocument } from '../../types/document.types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner/LoadingSpinner';
import { ErrorDisplay } from '../../components/common/ErrorDisplay/ErrorDisplay';
import styles from './PromptDetailPage.module.css';

export default function PromptDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [prompt, setPrompt] = useState<PromptDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchPrompt = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await promptService.getPrompt(id);
      setPrompt(data);
    } catch (err) {
      setError('Impossible de charger le prompt.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPrompt();
  }, [fetchPrompt]);

  const handleSubmit = async (data: Partial<PromptDocument>) => {
    if (!id) return;
    setIsSaving(true);
    setError(null);

    try {
      // Title is read-only in edit mode, so we don't need to check uniqueness or send it
      // But the form might send it back. The service/API should handle partial updates.
      // The spec says "title non modifiable".
      // We should ensure we don't change the title if the API allows it but we don't want to.
      // However, the form sends what's in the state.
      // The API `update` endpoint usually takes a body.
      // Let's trust the API or filter the data here.
      // The spec says "On y affiche à nouveau le titre ('title' non modifiable)".
      // So the user can't change it in the UI.
      
      await promptService.updatePrompt(id, data);
      // Refresh data or navigate back? Usually stay on page or show success.
      // Let's refresh the data to be sure.
      await fetchPrompt();
      alert('Prompt mis à jour avec succès.');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage || 'Erreur lors de la mise à jour du prompt.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Chargement du prompt..." />;
  }

  if (error) {
    return <ErrorDisplay message={error} onRetry={fetchPrompt} />;
  }

  if (!prompt) {
    return <ErrorDisplay message="Prompt introuvable." />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Détail du Prompt</h1>
      </div>

      <PromptForm
        initialData={prompt}
        onSubmit={handleSubmit}
        isEditing={true}
        isLoading={isSaving}
      />
    </div>
  );
}
