import React from 'react';
import { BaseNode } from './BaseNode';
import { Clock3 } from 'lucide-react';
import { useStore } from '../store';

export const DelayNode = ({ id, data, selected }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  
  const delayName = data?.delayName ?? 'Delay';
  const duration = data?.duration;

  return (
    <BaseNode
      id={id}
      typeLabel="Delay"
      title={delayName}
      icon={Clock3}
      selected={selected}
      className="node--delay"
      inputs={[{ id: 'input', label: 'input' }]}
      outputs={[{ id: 'output', label: 'output' }]}
    >
      <div className="node-control-group">
        <label className="node-control-label">Duration</label>
        <input
          type="number"
          value={duration ?? ''}
          placeholder="5"
          onChange={(e) => {
            const val = e.target.value === '' ? '' : parseInt(e.target.value) || 0;
            updateNodeField(id, 'duration', val);
          }}
          className="node-control-input nodrag nopan nowheel"
        />
      </div>
    </BaseNode>
  );
};
