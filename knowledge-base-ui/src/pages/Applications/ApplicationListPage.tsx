import { useEffect, useState } from 'react';
import { ApplicationDocument } from '../../types/document.types';
import { ResourceList } from '../../components/generic/ResourceList';
import { useResource } from '../../hooks/useResource';
import { applicationsConfig } from '../../features/applications/applications.config';

/**
 * Page de liste des applications.
 * Utilise le composant générique ResourceList avec la configuration spécifique aux applications.
 */
export default function ApplicationListPage() {
  const [limit, setLimit] = useState(25);
  const [skip, setSkip] = useState(0);

  const { items, loading, error, total, fetchAll } = useResource<ApplicationDocument>(applicationsConfig);

  useEffect(() => {
    fetchAll(limit, skip).catch((err) => {
      console.error('Error loading applications:', err);
    });
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
      config={applicationsConfig}
      items={items}
      loading={loading}
      error={error}
      basePath="/application"
      createPath="/application/new"
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
