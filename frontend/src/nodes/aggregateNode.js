import React from 'react';
import { BaseNode } from './BaseNode';
import { Rows3 } from 'lucide-react';
import { useStore } from '../store';
import { AGGREGATION_OPTIONS } from './constants';

export const AggregateNode = ({ id, data, selected }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  
  const aggregateName = data?.aggregateName ?? 'Aggregate';
  const aggregation = data?.aggregation ?? 'concat';

  return (
    <BaseNode
      id={id}
      typeLabel="Aggregate"
      title={aggregateName}
      icon={Rows3}
      selected={selected}
      className="node--aggregate"
      inputs={[
        { id: 'in-0', label: 'input 1' },
        { id: 'in-1', label: 'input 2' },
        { id: 'in-2', label: 'input 3' },
      ]}
      outputs={[{ id: 'output', label: 'output' }]}
    >
      <div className="node-control-group">
        <label className="node-control-label">Aggregation</label>
        <select
          value={aggregation}
          onChange={(e) => updateNodeField(id, 'aggregation', e.target.value)}
          className="node-control-select nodrag nopan nowheel"
        >
          {AGGREGATION_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </BaseNode>
  );
};
