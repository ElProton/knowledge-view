import { useNavigate } from 'react-router-dom';
import { ApplicationDocument, ApplicationStatus } from '../../types/document.types';
import { ResourceView } from '../../components/generic/ResourceView';
import { ApplicationForm } from '../../components/applications/ApplicationForm';
import { useResource } from '../../hooks/useResource';
import { applicationsConfig } from '../../features/applications/applications.config';

/**
 * Page de création d'une nouvelle application.
 * Initialise les features comme un tableau vide (RG-002).
 */
export default function ApplicationCreatePage() {
  const navigate = useNavigate();

  const { create, checkTitleExists } = useResource<ApplicationDocument>(applicationsConfig);

  const handleSubmit = async (data: Partial<ApplicationDocument>) => {
    if (!data.title) {
      throw new Error('Le titre est requis.');
    }

    if (!data.data?.status) {
      throw new Error('Le statut est requis.');
    }

    if (!data.data?.content) {
      throw new Error('Le contenu est requis.');
    }

    const exists = await checkTitleExists(data.title);
    if (exists) {
      throw new Error('Une application avec ce titre existe déjà.');
    }

    /**
     * RG-002 : Initialisation des features comme tableau vide.
     * Les features ne peuvent pas être ajoutées lors de la création (MVP).
     */
    const applicationData: Partial<ApplicationDocument> = {
      ...data,
      data: {
        content: data.data.content,
        url: data.data.url || null,
        status: data.data.status || ApplicationStatus.DRAFT,
        features: [], // Initialisation obligatoire
      },
    };

    try {
      await create(applicationData);
      navigate('/application');
    } catch (err) {
      console.error('Error creating application:', err);
      throw err;
    }
  };

  return (
    <ResourceView
      config={applicationsConfig}
      mode="create"
      FormComponent={ApplicationForm}
      onSubmit={handleSubmit}
      listPath="/application"
    />
  );
}
