import { ResourceConfig } from '../../types/resource.types';
import { PostDocument } from '../../types/document.types';
import { formatMongoDate } from '../../utils/dataHelpers';

/**
 * Configuration de la ressource "Posts".
 * Définit les colonnes affichées, les labels et les champs en lecture seule.
 */
export const postsConfig: ResourceConfig<PostDocument> = {
  resourceType: 'post',
  
  labels: {
    singular: 'un Post',
    plural: 'Posts',
  },
  
  list: {
    columns: [
      {
        key: 'title',
        label: 'Titre',
        sortable: true,
      },
      {
        key: 'data.platform',
        label: 'Plateforme',
        formatter: (value) => value || 'Non définie',
      },
      {
        key: 'data.published_date',
        label: 'Date de publication',
        formatter: (value) => formatMongoDate(value, 'Non définie'),
      },
    ],
  },
  
  readOnlyFields: ['title'],
};
