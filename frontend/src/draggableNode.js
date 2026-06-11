import {
  FileInput, FileOutput, BrainCircuit, FileText,
  Filter, Sigma, GitBranch, Rows3, Clock3,
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

const descriptions = {
  customInput:  'Data Source',
  customOutput: 'Destination',
  llm:          'Language Model',
  text:         'Text Processing',
  filter:       'Conditional Filter',
  math:         'Math Operation',
  condition:    'Branch Logic',
  aggregate:    'Data Merge',
  delay:        'Time Delay',
};

export const DraggableNode = ({ type, label }) => {
    const Icon = iconMap[type];
    const desc = descriptions[type] || '';

    const onDragStart = (event, nodeType) => {
      event.target.style.cursor = 'grabbing';
      event.dataTransfer.setData('application/reactflow', nodeType);
      event.dataTransfer.effectAllowed = 'move';
    };

    return (
      <div
        className="sidebar-node"
        onDragStart={(event) => onDragStart(event, type)}
        onDragEnd={(event) => (event.target.style.cursor = 'grab')}
        draggable={true}
      >
        {Icon && <Icon size={14} className="sidebar-node__icon" strokeWidth={1.5} />}
        <div className="sidebar-node__body">
          <span className="sidebar-node__label">{label}</span>
          {desc && <span className="sidebar-node__desc">{desc}</span>}
        </div>
      </div>
    );
  };
