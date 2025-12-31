// TODO: REFACTOR - Generic Component needed
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { postService } from '../../services/posts/postService';
import { PostForm } from '../../components/posts/PostForm';
import { PostDocument } from '../../types/document.types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner/LoadingSpinner';
import { ErrorDisplay } from '../../components/common/ErrorDisplay/ErrorDisplay';
import styles from './PostDetailPage.module.css';

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<PostDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchPost = async () => {
    if (!id) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await postService.getPost(id);
      setPost(data);
    } catch (err) {
      setError('Impossible de charger le post.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  const handleSubmit = async (data: Partial<PostDocument>) => {
    if (!id) {
      return;
    }
    setIsSaving(true);
    setError(null);

    try {
      await postService.updatePost(id, data);
      await fetchPost();
      alert('Post mis à jour avec succès.');
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la mise à jour du post.');
    } finally {
      setIsSaving(false);
    }
  };

  const getPostUrl = (): string | null => {
    const postLink = post?.links?.find((link) => link.label === 'post');
    return postLink?.url || null;
  };

  if (loading) {
    return <LoadingSpinner message="Chargement du post..." />;
  }

  if (error) {
    return <ErrorDisplay message={error} onRetry={fetchPost} />;
  }

  if (!post) {
    return <ErrorDisplay message="Post introuvable." />;
  }

  const postUrl = getPostUrl();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Détail du Post</h1>
        {postUrl && (
          <a
            href={postUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.externalLink}
          >
            Voir le post original ↗
          </a>
        )}
      </div>

      <PostForm
        initialData={post}
        onSubmit={handleSubmit}
        isEditing={true}
        isLoading={isSaving}
      />
    </div>
  );
}
