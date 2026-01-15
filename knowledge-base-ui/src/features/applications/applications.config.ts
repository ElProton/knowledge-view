import { ResourceConfig } from '../../types/resource.types';
import { ApplicationDocument, DocumentType, MongoDateValue } from '../../types/document.types';
import { formatMongoDate } from '../../utils/dataHelpers';

/**
 * Configuration de la ressource "Applications".
 * Définit les colonnes affichées, les labels et les champs en lecture seule.
 */
export const applicationsConfig: ResourceConfig<ApplicationDocument> = {
  resourceType: DocumentType.APPLICATION,
  
  labels: {
    singular: 'une Application',
    plural: 'Applications',
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
        formatter: (value) => (typeof value === 'string' ? value.toUpperCase() : 'N/A'),
      },
      {
        key: 'data.url',
        label: 'URL',
        formatter: (value) => String(value || '-'),
      },
      {
        key: 'created_at',
        label: 'Date de création',
        formatter: (value) => formatMongoDate(value as MongoDateValue, 'Date inconnue'),
      },
    ],
  },
  
  readOnlyFields: ['title'],
};
