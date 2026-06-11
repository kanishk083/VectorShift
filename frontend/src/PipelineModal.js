import React, { useRef, useEffect, useCallback } from 'react';
import { X, CheckCircle2, AlertCircle, Network, GitBranch } from 'lucide-react';

export const PipelineModal = ({ open, onClose, result, error }) => {
  const overlayRef = useRef(null);

  const handleOverlayClick = useCallback(
    (e) => {
      if (e.target === overlayRef.current) onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="pipeline-modal-overlay" ref={overlayRef} onClick={handleOverlayClick}>
      <div className="pipeline-modal">
        <div className="pipeline-modal__header">
          <span className="pipeline-modal__title">Pipeline Analysis</span>
          <button className="pipeline-modal__close" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="pipeline-modal__body">
          {error ? (
            <div className="pipeline-modal__error">{error}</div>
          ) : result ? (
            <>
              <div className="pipeline-modal__row">
                <span className="pipeline-modal__label">
                  <Network size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                  Nodes
                </span>
                <span className="pipeline-modal__value">{result.num_nodes}</span>
              </div>
              <div className="pipeline-modal__row">
                <span className="pipeline-modal__label">
                  <GitBranch size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                  Edges
                </span>
                <span className="pipeline-modal__value">{result.num_edges}</span>
              </div>
              <div className="pipeline-modal__row">
                <span className="pipeline-modal__label">
                  {result.is_dag ? (
                    <CheckCircle2 size={14} style={{ marginRight: 6, verticalAlign: 'middle', color: '#34d399' }} />
                  ) : (
                    <AlertCircle size={14} style={{ marginRight: 6, verticalAlign: 'middle', color: '#ef4444' }} />
                  )}
                  Valid DAG
                </span>
                <span className={`pipeline-modal__value ${result.is_dag ? 'pipeline-modal__value--dag' : 'pipeline-modal__value--not-dag'}`}>
                  {result.is_dag ? 'Yes' : 'No'}
                </span>
              </div>
            </>
          ) : (
            <div className="pipeline-modal__error">Analyzing...</div>
          )}
        </div>

        <div className="pipeline-modal__footer">
          <button className="pipeline-modal__btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
