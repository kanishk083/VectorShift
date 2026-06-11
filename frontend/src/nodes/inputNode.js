import React from 'react';
import { BaseNode } from './BaseNode';
import { FileInput } from 'lucide-react';
import { useStore } from '../store';
import { INPUT_TYPE_OPTIONS } from './constants';

export const InputNode = ({ id, data, selected }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  
  const inputName = data?.inputName ?? '';
  const inputType = data?.inputType ?? 'Text';

  return (
    <BaseNode
      id={id}
      typeLabel="Input"
      title="Input"
      icon={FileInput}
      selected={selected}
      className="node--input"
      inputs={[]}
      outputs={[{ id: 'value', label: 'value' }]}
    >
      <div className="node-control-group">
        <label className="node-control-label">Node Name</label>
        <input
          type="text"
          value={inputName}
          placeholder={id.replace('customInput-', 'input_')}
          onChange={(e) => updateNodeField(id, 'inputName', e.target.value)}
          className="node-control-input nodrag nopan nowheel"
        />
      </div>
      
      <div className="node-control-group">
        <label className="node-control-label">Input Type</label>
        <select
          value={inputType}
          onChange={(e) => updateNodeField(id, 'inputType', e.target.value)}
          className="node-control-select nodrag nopan nowheel"
        >
          {INPUT_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </BaseNode>
  );
};
