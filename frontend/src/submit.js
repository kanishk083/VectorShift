import { useState, useCallback } from 'react';
import { useStore } from './store';
import { submitPipeline } from './services/pipelineApi';
import { PipelineModal } from './PipelineModal';

export const SubmitButton = () => {
  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);
  const [modalOpen, setModalOpen] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = useCallback(async () => {
    setResult(null);
    setError(null);
    setModalOpen(true);

    console.table(nodes);
    console.table(edges);

    const nodeIds = new Set(nodes.map((n) => n.id));
    const invalidEdges = edges.filter(
      (e) => !nodeIds.has(e.source) || !nodeIds.has(e.target)
    );
    if (invalidEdges.length > 0) {
      console.error("Invalid edges referencing non-existent nodes:", invalidEdges);
    }

    try {
      const res = await submitPipeline(nodes, edges);
      setResult(res);
    } catch (err) {
      setError(err.message);
    }
  }, [nodes, edges]);

  const handleClose = useCallback(() => {
    setModalOpen(false);
    setResult(null);
    setError(null);
  }, []);

  return (
    <>
      <button type="button" className="analyze-btn" onClick={handleSubmit}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
        Analyze Pipeline
      </button>
      <PipelineModal open={modalOpen} onClose={handleClose} result={result} error={error} />
    </>
  );
};
