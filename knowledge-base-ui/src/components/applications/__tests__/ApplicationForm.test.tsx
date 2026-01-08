/**
 * Tests pour ApplicationForm
 * 
 * Ces tests vérifient les règles de gestion critiques :
 * - RG-002 : Initialisation features = []
 * - RG-003 : Préservation features en édition
 * - RG-005 : Validation champs requis
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ApplicationForm } from '../ApplicationForm';
import { ApplicationDocument, ApplicationStatus } from '../../../types/document.types';

describe('ApplicationForm', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  describe('Création (RG-002)', () => {
    it('initialise avec des features vides si aucune valeur fournie', async () => {
      render(
        <ApplicationForm
          value={undefined}
          onChange={mockOnChange}
          isEditing={false}
        />
      );

      // Vérifier que le composant affiche "Aucune fonctionnalité"
      expect(screen.getByText(/Aucune fonctionnalité associée/i)).toBeInTheDocument();

      // Vérifier que onChange a été appelé avec features: []
      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith(
          expect.objectContaining({
            data: expect.objectContaining({
              features: [],
            }),
          })
        );
      });
    });
  });

  describe('Édition (RG-003)', () => {
    const mockApplicationWithFeatures: Partial<ApplicationDocument> = {
      id: '123',
      title: 'Test App',
      data: {
        content: 'Description test',
        status: ApplicationStatus.PROD,
        features: [
          { name: 'Login', description: 'Auth via OAuth2' },
          { name: 'Export', description: 'Export PDF' },
        ],
      },
    };

    it('affiche les features existantes en lecture seule', () => {
      render(
        <ApplicationForm
          value={mockApplicationWithFeatures}
          onChange={mockOnChange}
          isEditing={true}
        />
      );

      // Vérifier que les features sont affichées
      expect(screen.getByText('Login')).toBeInTheDocument();
      expect(screen.getByText('Export')).toBeInTheDocument();
    });

    it('préserve les features lors de la modification d\'autres champs', async () => {
      render(
        <ApplicationForm
          value={mockApplicationWithFeatures}
          onChange={mockOnChange}
          isEditing={true}
        />
      );

      // Modifier le contenu
      const contentInput = screen.getByLabelText(/Description/i);
      await userEvent.clear(contentInput);
      await userEvent.type(contentInput, 'Nouvelle description');

      // Vérifier que les features sont préservées
      await waitFor(() => {
        const lastCall = mockOnChange.mock.calls[mockOnChange.mock.calls.length - 1];
        expect(lastCall[0].data.features).toEqual(
          mockApplicationWithFeatures.data?.features
        );
      });
    });

    it('permet de déplier/replier les features', async () => {
      render(
        <ApplicationForm
          value={mockApplicationWithFeatures}
          onChange={mockOnChange}
          isEditing={true}
        />
      );

      const loginSummary = screen.getByText('Login');
      
      // La description ne devrait pas être visible initialement
      expect(screen.queryByText('Auth via OAuth2')).not.toBeVisible();

      // Cliquer pour déplier
      await userEvent.click(loginSummary);

      // La description devrait maintenant être visible
      expect(screen.getByText('Auth via OAuth2')).toBeVisible();
    });
  });

  describe('Validation (RG-005)', () => {
    it('marque les champs requis dans le DOM', () => {
      render(
        <ApplicationForm
          value={undefined}
          onChange={mockOnChange}
          isEditing={false}
        />
      );

      // Vérifier les astérisques rouges
      const requiredLabels = screen.getAllByText('*');
      expect(requiredLabels.length).toBeGreaterThanOrEqual(2); // Titre, Statut, Description
    });

    it('propage les changements à chaque modification', async () => {
      render(
        <ApplicationForm
          value={undefined}
          onChange={mockOnChange}
          isEditing={false}
        />
      );

      const titleInput = screen.getByLabelText(/Titre/i);
      await userEvent.type(titleInput, 'Ma Super App');

      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'Ma Super App',
          })
        );
      });
    });
  });

  describe('Synchronisation avec props (Point de vigilance)', () => {
    it('met à jour le state local quand value change', async () => {
      const { rerender } = render(
        <ApplicationForm
          value={undefined}
          onChange={mockOnChange}
          isEditing={false}
        />
      );

      // Initialement vide
      expect(screen.getByLabelText(/Titre/i)).toHaveValue('');

      // Simuler le chargement asynchrone
      const loadedValue: Partial<ApplicationDocument> = {
        id: '456',
        title: 'App Chargée',
        data: {
          content: 'Contenu chargé',
          status: ApplicationStatus.DEV,
          features: [],
        },
      };

      rerender(
        <ApplicationForm
          value={loadedValue}
          onChange={mockOnChange}
          isEditing={true}
        />
      );

      // Le formulaire doit afficher les nouvelles valeurs
      await waitFor(() => {
        expect(screen.getByLabelText(/Titre/i)).toHaveValue('App Chargée');
        expect(screen.getByLabelText(/Description/i)).toHaveValue('Contenu chargé');
      });
    });
  });

  describe('Interface utilisateur', () => {
    it('affiche la note MVP pour les features', () => {
      render(
        <ApplicationForm
          value={undefined}
          onChange={mockOnChange}
          isEditing={false}
        />
      );

      expect(
        screen.getByText(/La gestion des fonctionnalités sera disponible dans une version ultérieure/i)
      ).toBeInTheDocument();
    });

    it('désactive le titre en mode édition si configuré', () => {
      render(
        <ApplicationForm
          value={{ title: 'Test' }}
          onChange={mockOnChange}
          isEditing={true}
        />
      );

      const titleInput = screen.getByLabelText(/Titre/i) as HTMLInputElement;
      expect(titleInput.disabled).toBe(true);
    });
  });
});
