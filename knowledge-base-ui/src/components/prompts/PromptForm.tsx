import React, { useState, useEffect } from 'react';
import { PromptDocument } from '../../types/document.types';
import styles from './PromptForm.module.css';
import { Button } from '../common/Button/Button';

interface PromptFormProps {
  initialData?: Partial<PromptDocument>;
  onSubmit: (data: Partial<PromptDocument>) => Promise<void>;
  isEditing?: boolean;
  isLoading?: boolean;
}

export const PromptForm: React.FC<PromptFormProps> = ({
  initialData,
  onSubmit,
  isEditing = false,
  isLoading = false,
}) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [theme, setTheme] = useState(initialData?.theme?.join(', ') || '');
  const [tags, setTags] = useState(initialData?.tags?.join(', ') || '');
  const [content, setContent] = useState(initialData?.data?.content || '');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setTheme(initialData.theme?.join(', ') || '');
      setTags(initialData.tags?.join(', ') || '');
      setContent(initialData.data?.content || '');
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData: Partial<PromptDocument> = {
      title,
      theme: theme.split(',').map((t) => t.trim()).filter(Boolean),
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      data: {
        content,
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
        <label htmlFor="content">Contenu du Prompt</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          className={styles.textarea}
        />
      </div>

      <div className={styles.actions}>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Enregistrement...' : isEditing ? 'Mettre à jour' : 'Créer'}
        </Button>
      </div>
    </form>
  );
};
