import { useNavigate } from 'react-router-dom';
import { NeedDocument } from '../../types/document.types';
import { ResourceView } from '../../components/generic/ResourceView';
import { NeedForm } from '../../components/needs/NeedForm';
import { useResource } from '../../hooks/useResource';
import { needsConfig } from '../../features/needs/needs.config';

export default function NeedCreatePage() {
  const navigate = useNavigate();

  const { create, checkTitleExists } = useResource<NeedDocument>(needsConfig);

  const handleSubmit = async (data: Partial<NeedDocument>) => {
    if (!data.title) {
      throw new Error('Le titre est requis.');
    }

    const exists = await checkTitleExists(data.title);
    if (exists) {
      throw new Error('Un besoin avec ce titre existe déjà.');
    }

    try {
      await create(data);
      navigate('/need');
    } catch (err) {
      console.error('Error creating need:', err);
      throw err;
    }
  };

  return (
    <ResourceView
      config={needsConfig}
      mode="create"
      FormComponent={NeedForm}
      onSubmit={handleSubmit}
      listPath="/need"
    />
  );
}
