import React from 'react';
import { Handle, Position } from 'reactflow';
import { MoreHorizontal } from 'lucide-react';

function distributePosition(index, count) {
  if (count <= 1) return 50;
  return ((index + 1) / (count + 1)) * 100;
}

export const BaseNode = ({
  id,
  typeLabel,
  title,
  subtitle,
  icon: Icon,
  inputs = [],
  outputs = [],
  selected = false,
  className = '',
  style = {},
  children,
}) => {
  const nodeIndex = id.split('-').pop() || '';

  return (
    <div
      className={`base-node${selected ? ' base-node--selected' : ''}${className ? ` ${className}` : ''}`}
      style={style}
    >
      <div className="base-node__header">
        <div className="base-node__header-left">
          <span className="base-node__index-badge">{nodeIndex}</span>
          <span className="base-node__type-label">{typeLabel}</span>
        </div>
        <MoreHorizontal size={14} className="base-node__menu-dots" />
      </div>

      <div className="base-node__content">
        <div className="base-node__content-body">
          {Icon && (
            <div className="base-node__icon-container">
              <Icon size={18} strokeWidth={1.5} />
            </div>
          )}
          <div className="base-node__text-container">
            <div className="base-node__title" title={title}>
              {title}
            </div>
            {subtitle && (
              <div className="base-node__desc" title={subtitle}>
                {subtitle}
              </div>
            )}
          </div>
        </div>
        {children}
      </div>

      {inputs.map((input, i) => {
        const top = input.position ?? distributePosition(i, inputs.length);
        return (
          <React.Fragment key={input.id}>
            <span
              className="base-node__handle-label base-node__handle-label--input"
              style={{ top: `${top}%` }}
            >
              {input.label}
            </span>
            <Handle
              type="target"
              position={Position.Left}
              id={input.id}
              className="base-node__handle base-node__handle--target"
              style={{ top: `${top}%` }}
            />
          </React.Fragment>
        );
      })}

      {outputs.map((output, i) => {
        const top = output.position ?? distributePosition(i, outputs.length);
        return (
          <React.Fragment key={output.id}>
            <span
              className="base-node__handle-label base-node__handle-label--output"
              style={{ top: `${top}%` }}
            >
              {output.label}
            </span>
            <Handle
              type="source"
              position={Position.Right}
              id={output.id}
              className="base-node__handle base-node__handle--source"
              style={{ top: `${top}%` }}
            />
          </React.Fragment>
        );
      })}
    </div>
  );
};
