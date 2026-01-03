import { useNavigate } from 'react-router-dom';
import { ModelDocument } from '../../types/document.types';
import { ResourceView } from '../../components/generic/ResourceView';
import { ModelForm } from '../../components/models/ModelForm';
import { useResource } from '../../hooks/useResource';
import { modelsConfig } from '../../features/models/models.config';

/**
 * Page de création d'un nouveau modèle.
 * Utilise l'architecture générique ResourceView en mode création.
 */
export default function ModelCreatePage() {
  const navigate = useNavigate();
  const { loading, error, create } = useResource<ModelDocument>(modelsConfig);

  const handleSubmit = async (data: Partial<ModelDocument>) => {
    try {
      await create(data);
      navigate('/models');
    } catch (err) {
      console.error('Error creating model:', err);
    }
  };

  return (
    <ResourceView
      config={modelsConfig}
      mode="create"
      FormComponent={ModelForm}
      loading={loading}
      error={error}
      onSubmit={handleSubmit}
      listPath="/models"
    />
  );
}
