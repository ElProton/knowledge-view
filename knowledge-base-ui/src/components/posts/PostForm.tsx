import { useState, useEffect, useCallback } from 'react';
import { PostDocument } from '../../types/document.types';
import { ResourceFormProps } from '../../types/resource.types';
import styles from './PostForm.module.css';

const POST_CONTENT_MAX_LENGTH = 2000;

/**
 * Formulaire spécifique pour l'édition des Posts.
 * Implémente ResourceFormProps pour être injectable dans ResourceView.
 */
export const PostForm: React.FC<ResourceFormProps<PostDocument>> = ({
  value,
  onChange,
  isEditing = false,
  isLoading = false,
}) => {
  const [title, setTitle] = useState(value?.title || '');
  const [theme, setTheme] = useState(value?.theme?.join(', ') || '');
  const [tags, setTags] = useState(value?.tags?.join(', ') || '');
  const [platform, setPlatform] = useState(value?.data?.platform || '');
  const [publishedDate, setPublishedDate] = useState(value?.data?.published_date || '');
  const [content, setContent] = useState(value?.data?.content || '');
  const [postUrl, setPostUrl] = useState('');

  // Synchronisation de l'état local avec la valeur externe
  useEffect(() => {
    if (value) {
      setTitle(value.title || '');
      setTheme(value.theme?.join(', ') || '');
      setTags(value.tags?.join(', ') || '');
      setPlatform(value.data?.platform || '');
      setPublishedDate(value.data?.published_date || '');
      setContent(value.data?.content || '');

      const postLink = value.links?.find((link) => link.label === 'post');
      setPostUrl(postLink?.url || '');
    }
  }, [value]);

  // Mémoïsation de la fonction de mise à jour pour éviter les re-renders inutiles
  const handleFormChange = useCallback(() => {
    const formData: Partial<PostDocument> = {
      title,
      theme: theme.split(',').map((t) => t.trim()).filter(Boolean),
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      data: {
        platform,
        published_date: publishedDate,
        content,
        engagement: value?.data?.engagement || {},
      },
      links: postUrl
        ? [{ label: 'post', url: postUrl }]
        : [],
    };

    onChange(formData);
  }, [title, theme, tags, platform, publishedDate, content, postUrl, onChange, value?.data?.engagement]);

  // Appel de la fonction mémorisée lors des changements
  useEffect(() => {
    handleFormChange();
  }, [handleFormChange]);

  const remainingChars = POST_CONTENT_MAX_LENGTH - content.length;

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
          <label htmlFor="platform">Plateforme</label>
          <input
            type="text"
            id="platform"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            placeholder="LinkedIn, Twitter, etc."
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="publishedDate">Date de publication</label>
          <input
            type="date"
            id="publishedDate"
            value={publishedDate}
            onChange={(e) => setPublishedDate(e.target.value)}
            className={styles.input}
          />
        </div>
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
        <label htmlFor="postUrl">Lien vers le post</label>
        <input
          type="url"
          id="postUrl"
          value={postUrl}
          onChange={(e) => setPostUrl(e.target.value)}
          placeholder="https://www.linkedin.com/posts/..."
          className={styles.input}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="content">
          Contenu du Post
          <span className={styles.charCounter}>
            {remainingChars} caractères restants
          </span>
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          maxLength={POST_CONTENT_MAX_LENGTH}
          className={styles.textarea}
        />
      </div>
    </div>
  );
};
