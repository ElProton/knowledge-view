// TODO: REFACTOR - Generic Component needed
import React, { useState, useEffect } from 'react';
import { PostDocument } from '../../types/document.types';
import styles from './PostForm.module.css';
import { Button } from '../common/Button/Button';

const POST_CONTENT_MAX_LENGTH = 2000;

interface PostFormProps {
  initialData?: Partial<PostDocument>;
  onSubmit: (data: Partial<PostDocument>) => Promise<void>;
  isEditing?: boolean;
  isLoading?: boolean;
}

export const PostForm: React.FC<PostFormProps> = ({
  initialData,
  onSubmit,
  isEditing = false,
  isLoading = false,
}) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [theme, setTheme] = useState(initialData?.theme?.join(', ') || '');
  const [tags, setTags] = useState(initialData?.tags?.join(', ') || '');
  const [platform, setPlatform] = useState(initialData?.data?.platform || '');
  const [publishedDate, setPublishedDate] = useState(initialData?.data?.published_date || '');
  const [content, setContent] = useState(initialData?.data?.content || '');
  const [postUrl, setPostUrl] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setTheme(initialData.theme?.join(', ') || '');
      setTags(initialData.tags?.join(', ') || '');
      setPlatform(initialData.data?.platform || '');
      setPublishedDate(initialData.data?.published_date || '');
      setContent(initialData.data?.content || '');

      // Récupérer le lien du post (label === 'post')
      const postLink = initialData.links?.find((link) => link.label === 'post');
      setPostUrl(postLink?.url || '');
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (content.length > POST_CONTENT_MAX_LENGTH) {
      alert(`Le contenu ne peut pas dépasser ${POST_CONTENT_MAX_LENGTH} caractères.`);
      return;
    }

    const formData: Partial<PostDocument> = {
      title,
      theme: theme.split(',').map((t) => t.trim()).filter(Boolean),
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      data: {
        platform,
        published_date: publishedDate,
        content,
        engagement: initialData?.data?.engagement || {},
      },
      links: postUrl
        ? [{ label: 'post', url: postUrl, id: null }]
        : [],
    };
    await onSubmit(formData);
  };

  const remainingChars = POST_CONTENT_MAX_LENGTH - content.length;

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

      <div className={styles.actions}>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Enregistrement...' : isEditing ? 'Mettre à jour' : 'Créer'}
        </Button>
      </div>
    </form>
  );
};
