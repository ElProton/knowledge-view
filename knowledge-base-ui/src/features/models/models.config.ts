import { ResourceConfig } from '../../types/resource.types';
import { ModelDocument } from '../../types/document.types';
import { formatMongoDate } from '../../utils/dataHelpers';

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
        formatter: (value) => formatMongoDate(value),
      },
      {
        key: 'updated_at',
        label: 'Dernière modification',
        formatter: (value) => formatMongoDate(value),
      },
    ],
  },

  readOnlyFields: ['title'],
};
