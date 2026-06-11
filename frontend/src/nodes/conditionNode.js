import React from 'react';
import { BaseNode } from './BaseNode';
import { GitBranch } from 'lucide-react';
import { useStore } from '../store';

export const ConditionNode = ({ id, data, selected }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  
  const conditionName = data?.conditionName ?? 'Condition';
  const expression = data?.expression ?? '';

  return (
    <BaseNode
      id={id}
      typeLabel="Condition"
      title={conditionName}
      icon={GitBranch}
      selected={selected}
      className="node--condition"
      inputs={[{ id: 'input', label: 'input' }]}
      outputs={[
        { id: 'true', label: 'true' },
        { id: 'false', label: 'false' },
      ]}
    >
      <div className="node-control-group">
        <label className="node-control-label">Expression</label>
        <input
          type="text"
          value={expression}
          placeholder="input !== null"
          onChange={(e) => updateNodeField(id, 'expression', e.target.value)}
          className="node-control-input nodrag nopan nowheel"
        />
      </div>
    </BaseNode>
  );
};
