import { useState } from 'react';
import { NeedDocument, NeedStatus } from '../../types/document.types';
import { Button } from '../common/Button/Button';
import styles from './NeedWorkflowActions.module.css';

interface NeedWorkflowActionsProps {
  need: NeedDocument;
  onStatusChange: (newStatus: NeedStatus, response?: string) => Promise<void>;
  isLoading?: boolean;
}

/**
 * Composant pour gérer les transitions d'état du workflow des Besoins.
 * Affiche les actions possibles selon le statut actuel et gère la validation.
 */
export const NeedWorkflowActions: React.FC<NeedWorkflowActionsProps> = ({
  need,
  onStatusChange,
  isLoading = false,
}) => {
  const [response, setResponse] = useState('');
  const [showResponseField, setShowResponseField] = useState(false);

  const currentStatus = need.data.status;

  const handleAccept = async () => {
    const nextStatus = getNextStatus(currentStatus);
    if (nextStatus) {
      await onStatusChange(nextStatus);
      setResponse('');
      setShowResponseField(false);
    }
  };

  const handleReject = async () => {
    if (!response.trim()) {
      alert('Une réponse est requise pour le rejet.');
      return;
    }
    await onStatusChange(NeedStatus.ANALYSE, response);
    setResponse('');
    setShowResponseField(false);
  };

  const handleRejectClick = () => {
    setShowResponseField(true);
  };

  const handleCancelReject = () => {
    setResponse('');
    setShowResponseField(false);
  };

  // Détermine le statut suivant dans le workflow
  const getNextStatus = (status: NeedStatus): NeedStatus | null => {
    const workflow: Record<NeedStatus, NeedStatus | null> = {
      [NeedStatus.ANALYSE]: NeedStatus.VALIDATION,
      [NeedStatus.VALIDATION]: NeedStatus.DETAIL,
      [NeedStatus.DETAIL]: NeedStatus.SPECIFICATION,
      [NeedStatus.SPECIFICATION]: null, // Fin du workflow
    };
    return workflow[status];
  };

  const nextStatus = getNextStatus(currentStatus);

  // Si on est à la fin du workflow
  if (!nextStatus) {
    return (
      <div className={styles.container}>
        <div className={styles.endWorkflow}>
          ✓ Besoin validé et spécifié
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>Actions du workflow</h3>
        <span className={styles.currentStatus}>
          Statut: <strong>{currentStatus}</strong>
        </span>
      </div>

      {showResponseField ? (
        <div className={styles.responseSection}>
          <label htmlFor="response" className={styles.label}>
            Raison du rejet (obligatoire)
          </label>
          <textarea
            id="response"
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            className={styles.textarea}
            rows={4}
            placeholder="Expliquez pourquoi ce besoin est rejeté..."
          />
          <div className={styles.actions}>
            <Button
              onClick={handleReject}
              variant="secondary"
              disabled={isLoading || !response.trim()}
            >
              Confirmer le rejet
            </Button>
            <Button
              onClick={handleCancelReject}
              variant="secondary"
              disabled={isLoading}
            >
              Annuler
            </Button>
          </div>
        </div>
      ) : (
        <div className={styles.actions}>
          <Button
            onClick={handleAccept}
            disabled={isLoading}
          >
            Valider → {nextStatus}
          </Button>
          <Button
            onClick={handleRejectClick}
            variant="secondary"
            disabled={isLoading}
          >
            Rejeter
          </Button>
        </div>
      )}

      {need.data.response && (
        <div className={styles.previousResponse}>
          <h4>Dernière réponse de rejet :</h4>
          <p>{need.data.response}</p>
        </div>
      )}
    </div>
  );
};
