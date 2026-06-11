import React from 'react';
import { BaseNode } from './BaseNode';
import { Filter } from 'lucide-react';
import { useStore } from '../store';

export const FilterNode = ({ id, data, selected }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  
  const filterName = data?.filterName ?? 'Filter';
  const expression = data?.expression ?? '';

  return (
    <BaseNode
      id={id}
      typeLabel="Filter"
      title={filterName}
      icon={Filter}
      selected={selected}
      className="node--filter"
      inputs={[{ id: 'input', label: 'input' }]}
      outputs={[{ id: 'output', label: 'output' }]}
    >
      <div className="node-control-group">
        <label className="node-control-label">Filter Expression</label>
        <input
          type="text"
          value={expression}
          placeholder="value > 0"
          onChange={(e) => updateNodeField(id, 'expression', e.target.value)}
          className="node-control-input nodrag nopan nowheel"
        />
      </div>
    </BaseNode>
  );
};
