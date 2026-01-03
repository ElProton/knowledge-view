import React, { useState, useEffect } from 'react';
import { ModelDocument } from '../../types/document.types';
import styles from './ModelForm.module.css';
import { Button } from '../common/Button/Button';

interface ModelFormProps {
  initialData?: Partial<ModelDocument>;
  onSubmit: (data: Partial<ModelDocument>) => Promise<void>;
  isEditing?: boolean;
  isLoading?: boolean;
}

export const ModelForm: React.FC<ModelFormProps> = ({
  initialData,
  onSubmit,
  isEditing = false,
  isLoading = false,
}) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [theme, setTheme] = useState(initialData?.theme?.join(', ') || '');
  const [tags, setTags] = useState(initialData?.tags?.join(', ') || '');
  const [jsonText, setJsonText] = useState('');
  const [jsonError, setJsonError] = useState<string | null>(null);

  // Initialiser le state local à partir des props (chargement asynchrone)
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setTheme(initialData.theme?.join(', ') || '');
      setTags(initialData.tags?.join(', ') || '');
      
      // Convertir l'objet JSON en texte formaté
      if (initialData.data?.content) {
        setJsonText(JSON.stringify(initialData.data.content, null, 2));
      }
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Valider le JSON avant la soumission
    let parsedContent: Record<string, any>;
    try {
      parsedContent = JSON.parse(jsonText);
      setJsonError(null);
    } catch (error) {
      setJsonError('Le contenu JSON est invalide. Veuillez corriger la syntaxe.');
      return;
    }

    const formData: Partial<ModelDocument> = {
      title,
      theme: theme.split(',').map((t) => t.trim()).filter(Boolean),
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      data: {
        content: parsedContent,
      },
    };

    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
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
        {isEditing && (
          <small className={styles.hint}>Le titre ne peut pas être modifié.</small>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="theme">Thèmes (séparés par des virgules)</label>
        <input
          type="text"
          id="theme"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className={styles.input}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="tags">Tags (séparés par des virgules)</label>
        <input
          type="text"
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className={styles.input}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="content">Contenu JSON du Modèle</label>
        <textarea
          id="content"
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
          rows={15}
          className={styles.textarea}
          placeholder='{"attribut": "description", "exemple": "valeur"}'
        />
        {jsonError && <div className={styles.error}>{jsonError}</div>}
        <small className={styles.hint}>
          Saisissez un objet JSON valide décrivant la structure du modèle.
        </small>
      </div>

      <div className={styles.actions}>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Enregistrement...' : isEditing ? 'Mettre à jour' : 'Créer'}
        </Button>
      </div>
    </form>
  );
};
