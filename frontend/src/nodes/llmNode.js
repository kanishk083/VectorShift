import React from 'react';
import { BaseNode } from './BaseNode';
import { BrainCircuit } from 'lucide-react';
import { useStore } from '../store';
import { MODEL_OPTIONS } from './constants';

export const LLMNode = ({ id, data, selected }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  
  const llmName = data?.llmName ?? 'Generate Insights';
  const model = data?.model ?? 'GPT-4 Turbo';
  const temp = data?.temperature ?? 0.7;

  return (
    <BaseNode
      id={id}
      typeLabel="LLM"
      title={llmName}
      icon={BrainCircuit}
      selected={selected}
      className="node--llm"
      inputs={[
        { id: 'system', label: 'system' },
        { id: 'prompt', label: 'prompt' },
      ]}
      outputs={[{ id: 'response', label: 'response' }]}
    >
      <div className="node-control-group">
        <label className="node-control-label">Model</label>
        <select
          value={model}
          onChange={(e) => updateNodeField(id, 'model', e.target.value)}
          className="node-control-select nodrag nopan nowheel"
        >
          {MODEL_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="node-control-group">
        <div className="node-control-slider-header">
          <label className="node-control-label">Temperature</label>
          <span className="node-control-slider-val">{temp.toFixed(1)}</span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={temp}
          onChange={(e) => updateNodeField(id, 'temperature', parseFloat(e.target.value))}
          className="node-control-slider nodrag nopan nowheel"
        />
      </div>
    </BaseNode>
  );
};
