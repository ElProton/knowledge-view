import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PostDocument } from '../../types/document.types';
import { ResourceView } from '../../components/generic/ResourceView';
import { PostForm } from '../../components/posts/PostForm';
import { useResource } from '../../hooks/useResource';
import { postsConfig } from '../../features/posts/posts.config';

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { currentItem, loading, error, fetchOne, update, remove } = useResource<PostDocument>(postsConfig);

  useEffect(() => {
    if (id) {
      fetchOne(id).catch((err) => {
        console.error('Error loading post:', err);
      });
    }
  }, [id, fetchOne]);

  const handleSubmit = async (data: Partial<PostDocument>) => {
    if (!id) {
      return;
    }

    try {
      await update(id, data);
      alert('Post mis à jour avec succès.');
    } catch (err) {
      console.error('Error updating post:', err);
    }
  };

  const handleDelete = async () => {
    if (!id) {
      return;
    }

    try {
      await remove(id);
    } catch (err) {
      console.error('Error deleting post:', err);
      throw err;
    }
  };

  const getPostUrl = (): string | null => {
    const postLink = currentItem?.links?.find((link) => link.label === 'post');
    return postLink?.url || null;
  };

  const postUrl = getPostUrl();

  return (
    <ResourceView
      config={postsConfig}
      mode="edit"
      FormComponent={PostForm}
      initialValues={currentItem || undefined}
      loading={loading}
      error={error}
      onSubmit={handleSubmit}
      onDelete={handleDelete}
      listPath="/post"
      onRetry={() => id && fetchOne(id)}
      extraActions={
        postUrl && (
          <a
            href={postUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'var(--primary-color)',
              textDecoration: 'none',
              fontWeight: 500,
            }}
          >
            Voir le post original ↗
          </a>
        )
      }
    />
  );
}
