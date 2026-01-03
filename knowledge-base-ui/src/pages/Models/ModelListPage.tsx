import { useEffect, useState } from 'react';
import { ModelDocument } from '../../types/document.types';
import { ResourceList } from '../../components/generic/ResourceList';
import { useResource } from '../../hooks/useResource';
import { modelsConfig } from '../../features/models/models.config';

/**
 * Page liste des modèles.
 * Utilise l'architecture générique ResourceList.
 */
export default function ModelListPage() {
  const [limit, setLimit] = useState(25);
  const [skip, setSkip] = useState(0);

  const { items, loading, error, total, fetchAll } = useResource<ModelDocument>(modelsConfig);

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
      config={modelsConfig}
      items={items}
      loading={loading}
      error={error}
      basePath="/models"
      createPath="/models/new"
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
