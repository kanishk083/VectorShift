import React from 'react';
import { BaseNode } from './BaseNode';
import { FileOutput } from 'lucide-react';
import { useStore } from '../store';
import { OUTPUT_TYPE_OPTIONS } from './constants';

export const OutputNode = ({ id, data, selected }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  
  const outputName = data?.outputName ?? '';
  const outputType = data?.outputType ?? 'Text';

  return (
    <BaseNode
      id={id}
      typeLabel="Output"
      title="Output"
      icon={FileOutput}
      selected={selected}
      className="node--output"
      inputs={[{ id: 'value', label: 'value' }]}
      outputs={[]}
    >
      <div className="node-control-group">
        <label className="node-control-label">Node Name</label>
        <input
          type="text"
          value={outputName}
          placeholder={id.replace('customOutput-', 'output_')}
          onChange={(e) => updateNodeField(id, 'outputName', e.target.value)}
          className="node-control-input nodrag nopan nowheel"
        />
      </div>
      
      <div className="node-control-group">
        <label className="node-control-label">Output Type</label>
        <select
          value={outputType}
          onChange={(e) => updateNodeField(id, 'outputType', e.target.value)}
          className="node-control-select nodrag nopan nowheel"
        >
          {OUTPUT_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </BaseNode>
  );
};
