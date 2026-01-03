import { ResourceConfig } from '../../types/resource.types';
import { ModelDocument } from '../../types/document.types';
import { formatMongoDate } from '../../utils/dataHelpers';

/**
 * Configuration de la ressource "Modèles".
 * Définit les colonnes affichées, les labels et les champs en lecture seule.
 */
export const modelsConfig: ResourceConfig<ModelDocument> = {
  resourceType: 'model',
  
  labels: {
    singular: 'un Modèle',
    plural: 'Modèles',
  },
  
  list: {
    columns: [
      {
        key: 'title',
        label: 'Titre',
        sortable: true,
      },
      {
        key: 'created_at',
        label: 'Date de création',
        formatter: (value) => formatMongoDate(value, 'Non définie'),
      },
    ],
  },
  
  readOnlyFields: [],
};
