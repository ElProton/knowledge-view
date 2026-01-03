import { useEffect, useState } from 'react';
import { ResourceList } from '../../components/generic/ResourceList';
import { useResource } from '../../hooks/useResource';
import { NeedDocument } from '../../types/document.types';
import { needsConfig } from '../../features/needs/needs.config';

/**
 * Page de liste des Besoins.
 * Utilise le composant générique ResourceList avec la configuration des besoins.
 */
export default function NeedListPage() {
  const [limit, setLimit] = useState(25);
  const [skip, setSkip] = useState(0);

  const { items, loading, error, total, fetchAll } = useResource<NeedDocument>(needsConfig);

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
      config={needsConfig}
      items={items}
      loading={loading}
      error={error}
      basePath="/need"
      createPath="/need/new"
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
