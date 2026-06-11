import React from 'react';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import {
  FileInput, FileOutput, BrainCircuit, FileText,
  Filter, Sigma, GitBranch, Rows3, Clock3, X, Trash2
} from 'lucide-react';

const iconMap = {
  customInput:  FileInput,
  customOutput: FileOutput,
  llm:          BrainCircuit,
  text:         FileText,
  filter:       Filter,
  math:         Sigma,
  condition:    GitBranch,
  aggregate:    Rows3,
  delay:        Clock3,
};

const iconClassMap = {
  customInput:  'panel__icon-wrapper--input',
  customOutput: 'panel__icon-wrapper--output',
  llm:          'panel__icon-wrapper--ai',
  text:         'panel__icon-wrapper--processing',
  filter:       'panel__icon-wrapper--processing',
  math:         'panel__icon-wrapper--processing',
  condition:    'panel__icon-wrapper--logic',
  aggregate:    'panel__icon-wrapper--processing',
  delay:        'panel__icon-wrapper--flow',
};

const FIELD_LABELS = {
  inputName: 'Node Name',
  inputType: 'Input Type',
  outputName: 'Node Name',
  outputType: 'Output Type',
  llmName: 'Node Name',
  model: 'Model',
  temperature: 'Temperature',
  maxTokens: 'Max Tokens',
  systemPrompt: 'System Prompt',
  userMessage: 'User Message',
  textName: 'Node Name',
  text: 'Text Content',
  filterName: 'Node Name',
  expression: 'Filter Expression',
  mathName: 'Node Name',
  operation: 'Operation',
  conditionName: 'Node Name',
  aggregateName: 'Node Name',
  aggregation: 'Aggregation Type',
  delayName: 'Node Name',
  duration: 'Delay (seconds)',
};

function formatFieldName(name) {
  return FIELD_LABELS[name] || name.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase());
}

export const PropertiesPanel = () => {
  const nodes = useStore((state) => state.nodes, shallow);
  const edges = useStore((state) => state.edges, shallow);
  const updateNodeField = useStore((state) => state.updateNodeField);
  const onNodesChange = useStore((state) => state.onNodesChange);

  const selected = nodes.find((n) => n.selected);

  if (!selected) return null;

  const nodeType = selected.type;
  const data = selected.data || {};
  const Icon = iconMap[nodeType];
  const iconClass = iconClassMap[nodeType] || '';

  const internalKeys = ['id'];
  const fieldKeys = Object.keys(data).filter((k) => !internalKeys.includes(k));

  // Sort fields so that Name is always at the top
  fieldKeys.sort((a, b) => {
    if (a.toLowerCase().includes('name')) return -1;
    if (b.toLowerCase().includes('name')) return 1;
    return 0;
  });

  const handleClose = () => {
    onNodesChange([{ type: 'select', id: selected.id, selected: false }]);
  };

  const handleDelete = () => {
    onNodesChange([{ type: 'remove', id: selected.id }]);
  };

  const handleFieldChange = (name, value) => {
    updateNodeField(selected.id, name, value);
  };

  const renderCustomField = (key, value) => {
    // Dropdown selects
    if (key === 'inputType') {
      return (
        <select
          value={value}
          onChange={(e) => handleFieldChange(key, e.target.value)}
          className="panel__field-select"
        >
          <option value="Text">Text</option>
          <option value="File">File</option>
        </select>
      );
    }
    
    if (key === 'outputType') {
      return (
        <select
          value={value}
          onChange={(e) => handleFieldChange(key, e.target.value)}
          className="panel__field-select"
        >
          <option value="Text">Text</option>
          <option value="Image">Image</option>
          <option value="JSON">JSON</option>
        </select>
      );
    }

    if (key === 'model') {
      return (
        <select
          value={value}
          onChange={(e) => handleFieldChange(key, e.target.value)}
          className="panel__field-select"
        >
          <option value="GPT-4 Turbo">GPT-4 Turbo</option>
          <option value="GPT-3.5 Turbo">GPT-3.5 Turbo</option>
          <option value="Claude 3 Opus">Claude 3 Opus</option>
        </select>
      );
    }

    if (key === 'operation') {
      return (
        <select
          value={value}
          onChange={(e) => handleFieldChange(key, e.target.value)}
          className="panel__field-select"
        >
          <option value="add">Add</option>
          <option value="subtract">Subtract</option>
          <option value="multiply">Multiply</option>
          <option value="divide">Divide</option>
        </select>
      );
    }

    if (key === 'aggregation') {
      return (
        <select
          value={value}
          onChange={(e) => handleFieldChange(key, e.target.value)}
          className="panel__field-select"
        >
          <option value="concat">Concatenate</option>
          <option value="merge">Merge</option>
          <option value="pick">Pick First</option>
        </select>
      );
    }

    // Temperature Slider
    if (key === 'temperature') {
      const numVal = parseFloat(value) ?? 0.7;
      return (
        <div className="panel__field-slider-container">
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={numVal}
            onChange={(e) => handleFieldChange(key, parseFloat(e.target.value))}
            className="panel__field-slider"
          />
          <span className="panel__field-slider-val">{numVal.toFixed(1)}</span>
        </div>
      );
    }

    // Textareas
    if (key === 'systemPrompt' || key === 'userMessage' || key === 'text') {
      return (
        <textarea
          value={value}
          onChange={(e) => handleFieldChange(key, e.target.value)}
          className="panel__field-textarea nodrag nopan nowheel"
          placeholder={`Enter ${formatFieldName(key).toLowerCase()}...`}
        />
      );
    }

    // Number Inputs
    if (key === 'duration' || key === 'maxTokens') {
      const placeholderVal = key === 'duration' ? '5' : '1024';
      return (
        <input
          type="number"
          value={value ?? ''}
          placeholder={placeholderVal}
          onChange={(e) => {
            const val = e.target.value === '' ? '' : parseInt(e.target.value) || 0;
            handleFieldChange(key, val);
          }}
          className="panel__field-input nodrag nopan nowheel"
        />
      );
    }

    // Default text inputs
    return (
      <input
        type="text"
        value={value}
        onChange={(e) => handleFieldChange(key, e.target.value)}
        className="panel__field-input"
      />
    );
  };

  return (
    <aside className="panel">
      {/* Panel Header */}
      <div className="panel__header">
        <div className="panel__header-left">
          {Icon && (
            <div className={`panel__icon-wrapper ${iconClass}`}>
              <Icon size={16} strokeWidth={1.5} />
            </div>
          )}
          <span className="panel__title">
            {nodeType === 'customInput' ? 'Input' : nodeType === 'customOutput' ? 'Output' : nodeType.charAt(0).toUpperCase() + nodeType.slice(1)}
          </span>
        </div>
        <button className="panel__close" onClick={handleClose} title="Close Panel">
          <X size={16} />
        </button>
      </div>

      {/* Panel Body */}
      <div className="panel__body">
        {fieldKeys.length > 0 && (
          <div className="panel__section">
            <div className="panel__section-title">Configuration</div>
            <div className="panel__fields">
              {fieldKeys.map((key) => {
                const val = data[key] ?? '';
                return (
                  <div key={key} className="panel__field">
                    <label className="panel__field-label">{formatFieldName(key)}</label>
                    {renderCustomField(key, val)}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Section: Connections */}
        <div className="panel__section">
          <div className="panel__section-title">Connections</div>
          <div className="panel__section-stats">
            <div className="panel__stat-row">
              <span className="panel__stat-label">Inputs Connected</span>
              <span className="panel__stat-value">{edges.filter((e) => e.target === selected.id).length}</span>
            </div>
            <div className="panel__stat-row">
              <span className="panel__stat-label">Outputs Connected</span>
              <span className="panel__stat-value">{edges.filter((e) => e.source === selected.id).length}</span>
            </div>
          </div>
        </div>

        {/* Section: Node ID */}
        <div className="panel__section">
          <div className="panel__section-title">System Information</div>
          <div className="panel__section-stats">
            <div className="panel__stat-row">
              <span className="panel__stat-label">System ID</span>
              <span className="panel__stat-value panel__stat-value--mono">{selected.id}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Panel Footer */}
      <div className="panel__footer">
        <button className="panel__delete-btn" onClick={handleDelete}>
          <Trash2 size={14} />
          <span>Delete Node</span>
        </button>
      </div>
    </aside>
  );
};
