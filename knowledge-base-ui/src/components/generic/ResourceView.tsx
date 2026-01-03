import { ReactNode, useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BaseDocument, ResourceConfig, ResourceFormComponent } from '../../types/resource.types';
import { Button } from '../common/Button/Button';
import { LoadingSpinner } from '../common/LoadingSpinner/LoadingSpinner';
import { ErrorDisplay } from '../common/ErrorDisplay/ErrorDisplay';
import styles from './ResourceView.module.css';

interface ResourceViewProps<T extends BaseDocument> {
  /** Configuration de la ressource */
  config: ResourceConfig<T>;
  /** Mode d'affichage (création ou édition) */
  mode: 'create' | 'edit';
  /** Composant de formulaire à injecter */
  FormComponent: ResourceFormComponent<T>;
  /** Valeurs initiales du formulaire (pour le mode édition) */
  initialValues?: T;
  /** Indique si les données sont en cours de chargement */
  loading?: boolean;
  /** Message d'erreur éventuel */
  error?: string | null;
  /** Callback appelé lors de la soumission du formulaire */
  onSubmit: (data: Partial<T>) => Promise<void>;
  /** Callback appelé lors de la suppression (mode édition uniquement) */
  onDelete?: () => Promise<void>;
  /** URL de retour à la liste */
  listPath: string;
  /** Callback pour réessayer en cas d'erreur */
  onRetry?: () => void;
  /** Actions supplémentaires (slot) */
  extraActions?: ReactNode;
}

/**
 * Composant générique pour afficher et éditer une ressource.
 * Gère l'enveloppe (Header, Actions) et injecte le formulaire spécifique.
 * 
 * @example
 * <ResourceView
 *   config={postsConfig}
 *   mode="edit"
 *   FormComponent={PostForm}
 *   initialValues={post}
 *   onSubmit={handleSubmit}
 *   listPath="/post"
 * />
 */
export function ResourceView<T extends BaseDocument>({
  config,
  mode,
  FormComponent,
  initialValues,
  loading = false,
  error = null,
  onSubmit,
  onDelete,
  listPath,
  onRetry,
  extraActions,
}: ResourceViewProps<T>) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Partial<T>>(initialValues || {});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Synchroniser formData avec initialValues quand elles changent
  useEffect(() => {
    if (initialValues) {
      setFormData(initialValues);
    }
  }, [initialValues]);

  const handleFormChange = useCallback((data: Partial<T>) => {
    setFormData(data);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
    } catch (err) {
      console.error('Error submitting form:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) {
      return;
    }

    const confirmMessage = `Êtes-vous sûr de vouloir supprimer ce ${config.labels.singular.toLowerCase()} ?`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onDelete();
      navigate(listPath);
    } catch (err) {
      console.error('Error deleting resource:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(listPath);
  };

  if (loading && mode === 'edit') {
    return (
      <LoadingSpinner
        message={`Chargement du ${config.labels.singular.toLowerCase()}...`}
      />
    );
  }

  if (error && mode === 'edit') {
    return <ErrorDisplay message={error} onRetry={onRetry} />;
  }

  const title = mode === 'create'
    ? `Créer ${config.labels.singular}`
    : `Modifier ${config.labels.singular}`;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>{title}</h1>
        <div className={styles.headerActions}>
          {extraActions}
          <Button onClick={handleCancel} variant="secondary">
            Retour à la liste
          </Button>
        </div>
      </div>

      {error && (
        <div className={styles.errorContainer}>
          <ErrorDisplay message={error} />
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <FormComponent
          value={formData}
          onChange={handleFormChange}
          isEditing={mode === 'edit'}
          isLoading={isSubmitting}
        />

        <div className={styles.actions}>
          {mode === 'edit' && onDelete && (
            <Button
              type="button"
              onClick={handleDelete}
              variant="secondary"
              disabled={isSubmitting}
            >
              Supprimer
            </Button>
          )}
          <div className={styles.actionsSpacer} />
          <Button type="button" onClick={handleCancel} variant="secondary" disabled={isSubmitting}>
            Annuler
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? 'Enregistrement...'
              : mode === 'create'
              ? 'Créer'
              : 'Mettre à jour'}
          </Button>
        </div>
      </form>
    </div>
  );
}
