import { useState, useEffect } from 'react';
import { NeedDocument, NeedStatus } from '../../types/document.types';
import { ResourceFormProps } from '../../types/resource.types';
import styles from './NeedForm.module.css';

/**
 * Formulaire spécifique pour l'édition des Besoins.
 * Implémente ResourceFormProps pour être injectable dans ResourceView.
 */
export const NeedForm: React.FC<ResourceFormProps<NeedDocument>> = ({
  value,
  onChange,
  isEditing = false,
  isLoading = false,
}) => {
  const [title, setTitle] = useState(value?.title || '');
  const [theme, setTheme] = useState(value?.theme?.join(', ') || '');
  const [tags, setTags] = useState(value?.tags?.join(', ') || '');
  const [content, setContent] = useState(value?.data?.content || '');
  const [parentAppId, setParentAppId] = useState(value?.data?.parent_application_id || '');
  const [parentAppName, setParentAppName] = useState(value?.data?.parent_application_name || '');

  useEffect(() => {
    if (value) {
      setTitle(value.title || '');
      setTheme(value.theme?.join(', ') || '');
      setTags(value.tags?.join(', ') || '');
      setContent(value.data?.content || '');
      setParentAppId(value.data?.parent_application_id || '');
      setParentAppName(value.data?.parent_application_name || '');
    }
  }, [value]);

  useEffect(() => {
    const formData: Partial<NeedDocument> = {
      title,
      theme: theme.split(',').map((t) => t.trim()).filter(Boolean),
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      data: {
        status: value?.data?.status || NeedStatus.ANALYSE,
        content,
        iteration: value?.data?.iteration || 1,
        response: value?.data?.response,
        parent_application_id: parentAppId || undefined,
        parent_application_name: parentAppName || undefined,
      },
    };

    onChange(formData);
  }, [title, theme, tags, content, parentAppId, parentAppName, value?.data?.status, value?.data?.iteration, value?.data?.response]);

  return (
    <div className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="title">Titre</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isEditing}
          required
          className={styles.input}
        />
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label htmlFor="theme">Thème(s)</label>
          <input
            type="text"
            id="theme"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            placeholder="Séparez par des virgules"
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="tags">Tags</label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Séparez par des virgules"
            className={styles.input}
          />
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label htmlFor="parentAppId">ID Application parente (optionnel)</label>
          <input
            type="text"
            id="parentAppId"
            value={parentAppId}
            onChange={(e) => setParentAppId(e.target.value)}
            placeholder="Identifiant technique"
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="parentAppName">Nom Application parente (optionnel)</label>
          <input
            type="text"
            id="parentAppName"
            value={parentAppName}
            onChange={(e) => setParentAppName(e.target.value)}
            placeholder="Nom lisible"
            className={styles.input}
          />
        </div>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="content">Description du besoin</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={8}
          className={styles.textarea}
          placeholder="Décrivez le besoin en détail..."
        />
      </div>

      {isEditing && value?.data && (
        <div className={styles.readOnlySection}>
          <h3 className={styles.sectionTitle}>Informations de workflow</h3>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Statut actuel</label>
              <input
                type="text"
                value={value.data.status}
                disabled
                className={styles.inputReadOnly}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Itération</label>
              <input
                type="number"
                value={value.data.iteration}
                disabled
                className={styles.inputReadOnly}
              />
            </div>
          </div>

          {value.data.response && (
            <div className={styles.formGroup}>
              <label>Réponse</label>
              <textarea
                value={value.data.response}
                disabled
                rows={4}
                className={styles.textareaReadOnly}
              />
            </div>
          )}
        </div>
      )}

      {isLoading && (
        <div className={styles.loadingOverlay}>
          Enregistrement...
        </div>
      )}
    </div>
  );
};
