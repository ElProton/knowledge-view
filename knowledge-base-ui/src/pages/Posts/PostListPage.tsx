import { useEffect, useState } from 'react';
import { PostDocument } from '../../types/document.types';
import { ResourceList } from '../../components/generic/ResourceList';
import { useResource } from '../../hooks/useResource';
import { postsConfig } from '../../features/posts/posts.config';

export default function PostListPage() {
  const [limit, setLimit] = useState(25);
  const [skip, setSkip] = useState(0);

  const { items, loading, error, total, fetchAll } = useResource<PostDocument>(postsConfig);

  useEffect(() => {
    fetchAll(limit, skip);
  }, [limit, skip, fetchAll]);

  const handleNextPage = () => {
    setSkip(skip + limit);
  };

  const handlePrevPage = () => {
    setSkip(Math.max(0, skip - limit));
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setSkip(0);
  };

  return (
    <ResourceList
      config={postsConfig}
      items={items}
      loading={loading}
      error={error}
      basePath="/post"
      createPath="/post/new"
      onRetry={() => fetchAll(limit, skip)}
      pagination={{
        limit,
        skip,
        total,
        onLimitChange: handleLimitChange,
        onNext: handleNextPage,
        onPrevious: handlePrevPage,
      }}
    />
  );
}
