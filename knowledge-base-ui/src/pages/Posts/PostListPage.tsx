// TODO: REFACTOR - Generic Component needed
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postService } from '../../services/posts/postService';
import { PostDocument } from '../../types/document.types';
import { Button } from '../../components/common/Button/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner/LoadingSpinner';
import { ErrorDisplay } from '../../components/common/ErrorDisplay/ErrorDisplay';
import styles from './PostListPage.module.css';

export default function PostListPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<PostDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [limit, setLimit] = useState(25);
  const [skip, setSkip] = useState(0);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await postService.getPosts(limit, skip);
      setPosts(data);
    } catch (err) {
      setError('Impossible de charger les posts.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [limit, skip]);

  const handleNextPage = () => {
    setSkip(skip + limit);
  };

  const handlePrevPage = () => {
    setSkip(Math.max(0, skip - limit));
  };

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) {
      return 'Non définie';
    }
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  if (loading && posts.length === 0) {
    return <LoadingSpinner message="Chargement des posts..." />;
  }

  if (error) {
    return <ErrorDisplay message={error} onRetry={fetchPosts} />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Posts Réseaux Sociaux</h1>
        <Button onClick={() => navigate('/post/new')}>Ajouter un Post</Button>
      </div>

      <div className={styles.list}>
        {posts.length === 0 ? (
          <p className={styles.empty}>Aucun post trouvé.</p>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className={styles.card}
              onClick={() => navigate(`/post/${post.id}`)}
            >
              <h3 className={styles.cardTitle}>{post.title}</h3>
              <div className={styles.cardMeta}>
                <span className={styles.cardPlatform}>
                  {post.data?.platform || 'Plateforme inconnue'}
                </span>
                <span className={styles.cardDate}>
                  {formatDate(post.data?.published_date)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className={styles.pagination}>
        <Button onClick={handlePrevPage} disabled={skip === 0} variant="secondary">
          Précédent
        </Button>
        <span className={styles.pageInfo}>
          Page {Math.floor(skip / limit) + 1}
        </span>
        <Button
          onClick={handleNextPage}
          disabled={posts.length < limit}
          variant="secondary"
        >
          Suivant
        </Button>
        <select
          value={limit}
          onChange={(e) => {
            setLimit(Number(e.target.value));
            setSkip(0);
          }}
          className={styles.limitSelect}
        >
          <option value={10}>10 par page</option>
          <option value={25}>25 par page</option>
          <option value={50}>50 par page</option>
        </select>
      </div>
    </div>
  );
}
