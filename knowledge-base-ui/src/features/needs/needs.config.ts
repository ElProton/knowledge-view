import { ResourceConfig } from '../../types/resource.types';
import { NeedDocument, NeedStatus, DocumentType, MongoDateValue } from '../../types/document.types';
import { formatMongoDate } from '../../utils/dataHelpers';

/**
 * Configuration de la ressource "Besoins" pour le système générique.
 */
export const needsConfig: ResourceConfig<NeedDocument> = {
  resourceType: DocumentType.BESOIN,
  
  labels: {
    singular: 'Besoin',
    plural: 'Besoins',
  },
  
  list: {
    columns: [
      {
        key: 'title',
        label: 'Titre',
        sortable: true,
      },
      {
        key: 'data.status',
        label: 'Statut',
        formatter: (value) => value ? String(value).toUpperCase() : '',
      },
      {
        key: 'data.iteration',
        label: 'Itération',
      },
      {
        key: 'updated_at',
        label: 'Dernière mise à jour',
        formatter: (value) => formatMongoDate(value as MongoDateValue),
      },
    ],
    
    quickFilters: [
      {
        id: 'analyse',
        label: 'En analyse',
        filterFn: (item) => item.data.status === NeedStatus.ANALYSE,
      },
      {
        id: 'validation',
        label: 'En validation',
        filterFn: (item) => item.data.status === NeedStatus.VALIDATION,
      },
      {
        id: 'detail',
        label: 'En détail',
        filterFn: (item) => item.data.status === NeedStatus.DETAIL,
      },
      {
        id: 'specification',
        label: 'En spécification',
        filterFn: (item) => item.data.status === NeedStatus.SPECIFICATION,
      },
    ],
  },
  
  readOnlyFields: ['id', 'created_at', 'updated_at', 'type'],
};
