import { useState, useEffect } from 'react';
import { ModelDocument } from '../../types/document.types';
import { ResourceFormProps } from '../../types/resource.types';
import styles from './ModelForm.module.css';

/**
 * Formulaire spécifique pour l'édition des Modèles.
 * Implémente ResourceFormProps pour être injectable dans ResourceView.
 * 
 * Gère la dualité String (édition) / Object (stockage) pour data.content :
 * - L'utilisateur édite du JSON texte dans un TextArea
 * - La validation syntaxique est effectuée en temps réel
 * - Seul du JSON valide est propagé au parent via onChange
 */
export const ModelForm: React.FC<ResourceFormProps<ModelDocument>> = ({
  value,
  onChange,
  isLoading = false,
}) => {
  const [title, setTitle] = useState(value?.title || '');
  const [theme, setTheme] = useState(value?.theme?.join(', ') || '');
  const [tags, setTags] = useState(value?.tags?.join(', ') || '');
  const [jsonText, setJsonText] = useState('');
  const [jsonError, setJsonError] = useState<string | null>(null);

  // Initialisation : convertir Record<string, any> en texte JSON formaté
  useEffect(() => {
    if (value) {
      setTitle(value.title || '');
      setTheme(value.theme?.join(', ') || '');
      setTags(value.tags?.join(', ') || '');
      
      if (value.data?.content) {
        try {
          setJsonText(JSON.stringify(value.data.content, null, 2));
        } catch (error) {
          setJsonText('{}');
        }
      } else {
        setJsonText('{}');
      }
    }
  }, [value?.id]); // Dépendance sur l'ID pour éviter re-sync intempestive

  // Mise à jour : parser le JSON et propager si valide
  useEffect(() => {
    let parsedContent: Record<string, any> | null = null;

    // Tentative de parsing du JSON
    if (jsonText.trim() === '') {
      setJsonError('Le contenu JSON ne peut pas être vide');
      parsedContent = null;
    } else {
      try {
        parsedContent = JSON.parse(jsonText);
        setJsonError(null);
      } catch (error) {
        if (error instanceof SyntaxError) {
          setJsonError(`JSON invalide : ${error.message}`);
        } else {
          setJsonError('Erreur de parsing JSON');
        }
        parsedContent = null;
      }
    }

    // Construction du document avec validation
    const formData: Partial<ModelDocument> = {
      title,
      theme: theme.split(',').map((t) => t.trim()).filter(Boolean),
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
    };

    // Ne propager que si le JSON est valide
    if (parsedContent !== null) {
      formData.data = {
        content: parsedContent,
      };
    }

    onChange(formData);
  }, [title, theme, tags, jsonText, onChange]);

  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonText(e.target.value);
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.formGroup}>
        <label htmlFor="title" className={styles.label}>
          Titre <span className={styles.required}>*</span>
        </label>
        <input
          id="title"
          type="text"
          className={styles.input}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isLoading}
          placeholder="Ex: FicheUtilisateur, ConfigurationAPI..."
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="theme" className={styles.label}>
          Thème
        </label>
        <input
          id="theme"
          type="text"
          className={styles.input}
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          disabled={isLoading}
          placeholder="Ex: authentification, base de données (séparés par des virgules)"
        />
        <p className={styles.hint}>Séparez les thèmes par des virgules</p>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="tags" className={styles.label}>
          Tags
        </label>
        <input
          id="tags"
          type="text"
          className={styles.input}
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          disabled={isLoading}
          placeholder="Ex: user, api, schema (séparés par des virgules)"
        />
        <p className={styles.hint}>Séparez les tags par des virgules</p>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="content" className={styles.label}>
          Contenu JSON <span className={styles.required}>*</span>
        </label>
        <textarea
          id="content"
          className={`${styles.textarea} ${jsonError ? styles.textareaError : ''}`}
          value={jsonText}
          onChange={handleJsonChange}
          disabled={isLoading}
          placeholder='{"nom": "string", "age": "number", "email": "string"}'
          rows={15}
          required
        />
        {jsonError && (
          <p className={styles.error}>
            <span className={styles.errorIcon}>⚠️</span>
            {jsonError}
          </p>
        )}
        <p className={styles.hint}>
          Saisissez la structure JSON du modèle. La syntaxe doit être valide pour pouvoir sauvegarder.
        </p>
      </div>
    </div>
  );
};
