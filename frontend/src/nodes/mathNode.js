import React from 'react';
import { BaseNode } from './BaseNode';
import { Sigma } from 'lucide-react';
import { useStore } from '../store';
import { OPERATION_OPTIONS } from './constants';

export const MathNode = ({ id, data, selected }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  
  const mathName = data?.mathName ?? 'Math';
  const operation = data?.operation ?? 'add';

  return (
    <BaseNode
      id={id}
      typeLabel="Math"
      title={mathName}
      icon={Sigma}
      selected={selected}
      className="node--math"
      inputs={[
        { id: 'a', label: 'A' },
        { id: 'b', label: 'B' },
      ]}
      outputs={[{ id: 'result', label: 'result' }]}
    >
      <div className="node-control-group">
        <label className="node-control-label">Operation</label>
        <select
          value={operation}
          onChange={(e) => updateNodeField(id, 'operation', e.target.value)}
          className="node-control-select nodrag nopan nowheel"
        >
          {OPERATION_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </BaseNode>
  );
};
