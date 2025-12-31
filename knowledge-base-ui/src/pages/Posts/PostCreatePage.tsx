// TODO: REFACTOR - Generic Component needed
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postService } from '../../services/posts/postService';
import { PostForm } from '../../components/posts/PostForm';
import { PostDocument } from '../../types/document.types';
import { ErrorDisplay } from '../../components/common/ErrorDisplay/ErrorDisplay';
import styles from './PostCreatePage.module.css';

export default function PostCreatePage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: Partial<PostDocument>) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!data.title) {
        throw new Error('Le titre est requis.');
      }

      const exists = await postService.checkTitleExists(data.title);
      if (exists) {
        throw new Error('Un post avec ce titre existe déjà.');
      }

      await postService.createPost(data);
      navigate('/post');
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création du post.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Créer un nouveau Post</h1>
      </div>

      {error && <ErrorDisplay message={error} />}

      <PostForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
