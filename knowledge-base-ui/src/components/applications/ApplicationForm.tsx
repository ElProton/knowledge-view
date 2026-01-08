import { useState, useEffect, useCallback } from 'react';
import { ApplicationDocument, ApplicationStatus, Feature } from '../../types/document.types';
import { ResourceFormProps } from '../../types/resource.types';
import styles from './ApplicationForm.module.css';

/**
 * Formulaire spécifique pour l'édition des Applications.
 * Implémente ResourceFormProps pour être injectable dans ResourceView.
 * 
 * Note MVP : Les features sont affichées en lecture seule uniquement.
 * L'ajout/modification de features sera implémenté dans une version ultérieure.
 */
export const ApplicationForm: React.FC<ResourceFormProps<ApplicationDocument>> = ({
  value,
  onChange,
  isEditing = false,
}) => {
  const [title, setTitle] = useState(value?.title || '');
  const [content, setContent] = useState(value?.data?.content || '');
  const [url, setUrl] = useState(value?.data?.url || '');
  const [status, setStatus] = useState<ApplicationStatus>(
    value?.data?.status || ApplicationStatus.DRAFT
  );
  const [features, setFeatures] = useState<Feature[]>(value?.data?.features || []);
  const [expandedFeatures, setExpandedFeatures] = useState<Set<number>>(new Set());

  /**
   * Synchronisation du state local avec les props (chargement asynchrone).
   * CRITIQUE : Sans cela, le formulaire restera vide après le chargement des données.
   */
  useEffect(() => {
    if (value) {
      setTitle(value.title || '');
      setContent(value.data?.content || '');
      setUrl(value.data?.url || '');
      setStatus(value.data?.status || ApplicationStatus.DRAFT);
      setFeatures(value.data?.features || []);
    }
  }, [value]);

  /**
   * Propagation des changements vers le parent.
   * Mémoïsation pour éviter les re-renders inutiles.
   */
  const handleFormChange = useCallback(() => {
    const formData: Partial<ApplicationDocument> = {
      title,
      data: {
        content,
        url: url || null,
        status,
        features, // Préservation des features existantes (MVP: lecture seule)
      },
    };

    onChange(formData);
  }, [title, content, url, status, features, onChange]);

  useEffect(() => {
    handleFormChange();
  }, [handleFormChange]);

  /**
   * Toggle l'état déplié/replié d'une feature spécifique.
   */
  const toggleFeature = (index: number) => {
    setExpandedFeatures(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <div className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="title">
          Titre <span className={styles.required}>*</span>
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isEditing}
          required
          className={styles.input}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="status">
          Statut <span className={styles.required}>*</span>
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
          required
          className={styles.select}
        >
          <option value={ApplicationStatus.DRAFT}>Draft</option>
          <option value={ApplicationStatus.DEV}>Développement</option>
          <option value={ApplicationStatus.STAGING}>Staging</option>
          <option value={ApplicationStatus.PROD}>Production</option>
          <option value={ApplicationStatus.DEPRECATED}>Dépréciée</option>
        </select>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="content">
          Description <span className={styles.required}>*</span>
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={6}
          className={styles.textarea}
          placeholder="Description globale de l'application"
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="url">URL</label>
        <input
          type="url"
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className={styles.input}
          placeholder="https://example.com"
        />
      </div>

      {/* Section Features - Lecture seule dans le MVP */}
      <div className={styles.featuresSection}>
        <h3 className={styles.sectionTitle}>Fonctionnalités</h3>
        
        {features.length === 0 ? (
          <p className={styles.noFeatures}>
            Aucune fonctionnalité associée.
          </p>
        ) : (
          <div className={styles.featuresList}>
            {features.map((feature, index) => (
              <details
                key={index}
                className={styles.featureItem}
                open={expandedFeatures.has(index)}
                onToggle={() => toggleFeature(index)}
              >
                <summary className={styles.featureSummary}>
                  {feature.name || `Feature #${index + 1}`}
                </summary>
                <div className={styles.featureContent}>
                  {feature.description && (
                    <div className={styles.featureField}>
                      <strong>Description :</strong>
                      <p>{feature.description}</p>
                    </div>
                  )}
                  
                  {/* Affichage des autres propriétés de la feature */}
                  {Object.entries(feature)
                    .filter(([key]) => key !== 'name' && key !== 'description')
                    .map(([key, val]) => (
                      <div key={key} className={styles.featureField}>
                        <strong>{key} :</strong>
                        <p>{typeof val === 'object' ? JSON.stringify(val, null, 2) : String(val)}</p>
                      </div>
                    ))
                  }
                </div>
              </details>
            ))}
          </div>
        )}
        
        <p className={styles.mvpNote}>
          Note : La gestion des fonctionnalités sera disponible dans une version ultérieure.
        </p>
      </div>
    </div>
  );
};
