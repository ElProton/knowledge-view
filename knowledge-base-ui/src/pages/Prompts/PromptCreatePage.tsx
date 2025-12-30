import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { promptService } from '../../services/prompts/promptService';
import { PromptForm } from '../../components/prompts/PromptForm';
import { PromptDocument } from '../../types/document.types';
import { ErrorDisplay } from '../../components/common/ErrorDisplay/ErrorDisplay';
import styles from './PromptCreatePage.module.css';

export default function PromptCreatePage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: Partial<PromptDocument>) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!data.title) {
        throw new Error('Le titre est requis.');
      }

      const exists = await promptService.checkTitleExists(data.title);
      if (exists) {
        throw new Error('Un prompt avec ce titre existe déjà.');
      }

      await promptService.createPrompt(data);
      navigate('/prompts');
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création du prompt.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Créer un nouveau Prompt</h1>
      </div>

      {error && <ErrorDisplay message={error} />}

      <PromptForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
