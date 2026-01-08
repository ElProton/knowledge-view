import { ResourceConfig } from '../../types/resource.types';
import { ModelDocument, DocumentType, MongoDateValue } from '../../types/document.types';
import { formatMongoDate } from '../../utils/dataHelpers';

export const modelsConfig: ResourceConfig<ModelDocument> = {
  resourceType: DocumentType.MODEL,

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
        formatter: (value) => formatMongoDate(value as MongoDateValue),
      },
      {
        key: 'updated_at',
        label: 'Dernière modification',
        formatter: (value) => formatMongoDate(value as MongoDateValue),
      },
    ],
  },

  readOnlyFields: ['title'],
};
