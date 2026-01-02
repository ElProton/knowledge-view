import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { BaseDocument, ResourceConfig } from '../../types/resource.types';
import { Button } from '../common/Button/Button';
import { LoadingSpinner } from '../common/LoadingSpinner/LoadingSpinner';
import { ErrorDisplay } from '../common/ErrorDisplay/ErrorDisplay';
import { getNestedValue } from '../../utils/dataHelpers';
import styles from './ResourceList.module.css';

interface ResourceListProps<T extends BaseDocument> {
  /** Configuration de la ressource */
  config: ResourceConfig<T>;
  /** Liste des items à afficher */
  items: T[];
  /** Indique si les données sont en cours de chargement */
  loading: boolean;
  /** Message d'erreur éventuel */
  error: string | null;
  /** URL de base pour la navigation vers le détail (ex: '/post') */
  basePath: string;
  /** URL pour la création d'un nouvel item (ex: '/post/new') */
  createPath: string;
  /** Callback pour réessayer en cas d'erreur */
  onRetry?: () => void;
  /** Actions personnalisées pour chaque item (slot) */
  customActions?: (item: T) => ReactNode;
  /** Pagination */
  pagination?: {
    limit: number;
    skip: number;
    total: number;
    onLimitChange: (limit: number) => void;
    onNext: () => void;
    onPrevious: () => void;
  };
}

/**
 * Composant générique pour afficher une liste de ressources.
 * Gère l'affichage en grille, la navigation et la pagination.
 * 
 * @example
 * <ResourceList
 *   config={postsConfig}
 *   items={posts}
 *   loading={loading}
 *   error={error}
 *   basePath="/post"
 *   createPath="/post/new"
 *   pagination={paginationConfig}
 * />
 */
export function ResourceList<T extends BaseDocument>({
  config,
  items,
  loading,
  error,
  basePath,
  createPath,
  onRetry,
  customActions,
  pagination,
}: ResourceListProps<T>) {
  const navigate = useNavigate();

  const handleItemClick = (item: T) => {
    navigate(`${basePath}/${item.id}`);
  };

  if (loading && items.length === 0) {
    return <LoadingSpinner message={`Chargement des ${config.labels.plural.toLowerCase()}...`} />;
  }

  if (error) {
    return <ErrorDisplay message={error} onRetry={onRetry} />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>{config.labels.plural}</h1>
        <Button onClick={() => navigate(createPath)}>
          Ajouter {config.labels.singular}
        </Button>
      </div>

      <div className={styles.list}>
        {items.length === 0 ? (
          <p className={styles.empty}>
            Aucun {config.labels.singular.toLowerCase()} trouvé.
          </p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className={styles.card}
              onClick={() => handleItemClick(item)}
            >
              {config.list.columns.map((column, index) => {
                const value = getNestedValue(item, column.key as string);
                const displayValue = column.formatter
                  ? column.formatter(value, item)
                  : value;

                if (index === 0) {
                  return (
                    <h3 key={column.key as string} className={styles.cardTitle}>
                      {displayValue}
                    </h3>
                  );
                }

                return (
                  <div key={column.key as string} className={styles.cardMeta}>
                    <span className={styles.metaLabel}>{column.label}:</span>
                    <span className={styles.metaValue}>{displayValue}</span>
                  </div>
                );
              })}

              {customActions && (
                <div className={styles.customActions} onClick={(e) => e.stopPropagation()}>
                  {customActions(item)}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {pagination && (
        <div className={styles.pagination}>
          <Button
            onClick={pagination.onPrevious}
            disabled={pagination.skip === 0}
            variant="secondary"
          >
            Précédent
          </Button>
          <span className={styles.pageInfo}>
            Page {Math.floor(pagination.skip / pagination.limit) + 1}
          </span>
          <Button
            onClick={pagination.onNext}
            disabled={items.length < pagination.limit}
            variant="secondary"
          >
            Suivant
          </Button>
          <select
            value={pagination.limit}
            onChange={(e) => pagination.onLimitChange(Number(e.target.value))}
            className={styles.limitSelect}
          >
            <option value={10}>10 par page</option>
            <option value={25}>25 par page</option>
            <option value={50}>50 par page</option>
          </select>
        </div>
      )}
    </div>
  );
}
