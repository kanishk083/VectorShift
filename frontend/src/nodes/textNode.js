import React, { useMemo, useEffect } from 'react';
import { BaseNode } from './BaseNode';
import { parseVariables } from '../utils/parseVariables';
import { useAutoResize } from '../hooks/useAutoResize';
import { useStore } from '../store';
import { FileText } from 'lucide-react';

const HEADER_HEIGHT = 40;
const CONTENT_PADDING_V = 36;
const ICON_HEIGHT = 36;
const CONTENT_PADDING_H = 36;
const BORDER = 3;

const LAYOUT_OVERHEAD_W = BORDER + CONTENT_PADDING_H;
const MIN_NODE_HEIGHT = HEADER_HEIGHT + CONTENT_PADDING_V + ICON_HEIGHT;

const NODE_MIN_WIDTH = 280;
const NODE_MAX_WIDTH = 440;

const CONTENT_MIN_WIDTH = NODE_MIN_WIDTH - LAYOUT_OVERHEAD_W;
const CONTENT_MAX_WIDTH = NODE_MAX_WIDTH - LAYOUT_OVERHEAD_W;

const MIRROR_STYLE = {
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  fontSize: '11px',
  lineHeight: '1.4',
  padding: '0',
  letterSpacing: '0',
};

export const TextNode = ({ id, data, selected }) => {
  const currText = data?.text ?? '';
  const textName = data?.textName ?? 'Extract Text';
  const edges = useStore((state) => state.edges);
  const onEdgesChange = useStore((state) => state.onEdgesChange);
  const updateNodeField = useStore((state) => state.updateNodeField);

  const { variables } = useMemo(() => parseVariables(currText), [currText]);

  // Inputs: always includes default INPUT handle at index 0, followed by dynamic variables
  const inputs = useMemo(() => {
    const list = [{ id: `${id}-input`, label: 'INPUT' }];
    variables.forEach((v) => {
      const lowerName = v.name.toLowerCase();
      if (lowerName !== 'input') {
        list.push({ id: `${id}-${v.name}`, label: v.name });
      }
    });
    return list;
  }, [id, variables]);

  // Natural text auto-resize measurement (mirror element logic remains unchanged)
  // We measure the natural height of the full editable text
  const contentDim = useAutoResize(currText, MIRROR_STYLE, CONTENT_MIN_WIDTH, CONTENT_MAX_WIDTH);

  // Spacing and layout positioning for dynamic handles
  const lastHandleY = 20 + (inputs.length - 1) * 28;
  const minTextareaY = lastHandleY + 16;
  const naturalTextareaY = 40 + 16 + 24 + 12; // header (40) + padding (16) + body/title (24) + gap (12)
  const extraMargin = Math.max(0, minTextareaY - naturalTextareaY);

  const nodeStyle = useMemo(() => {
    // Height adapts to whichever is larger:
    // 1. Natural flow height: Header (40) + Top Padding (16) + Icon/Title (approx 24) + Gap (12) + Extra Margin + Textarea (min 60 or contentDim.height) + Bottom Padding (16)
    // 2. Minimum handle bounding box height: lastHandleY + 24
    const textareaHeight = Math.max(60, contentDim.height);
    const baseHeight = 40 + 16 + 24 + 12 + extraMargin + textareaHeight + 16;
    const styles = {
      width: Math.max(NODE_MIN_WIDTH, contentDim.width + LAYOUT_OVERHEAD_W),
      height: Math.max(MIN_NODE_HEIGHT, baseHeight),
    };

    // Set custom CSS variables on parent node style to accurately place each handle
    inputs.forEach((_, index) => {
      styles[`--handle-top-${index}`] = `${20 + index * 28}px`;
    });

    return styles;
  }, [contentDim, extraMargin, inputs]);

  const handleIdKey = useMemo(() => {
    const ids = inputs.map((h) => h.id);
    ids.push(`${id}-output`);
    ids.sort();
    return ids.join(',');
  }, [inputs, id]);

  useEffect(() => {
    const validIds = new Set(handleIdKey.split(','));

    const toRemove = edges.filter(
      (e) =>
        (e.source === id && e.sourceHandle && !validIds.has(e.sourceHandle)) ||
        (e.target === id && e.targetHandle && !validIds.has(e.targetHandle))
    );

    if (toRemove.length > 0) {
      onEdgesChange(toRemove.map((e) => ({ type: 'remove', id: e.id })));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleIdKey, id, onEdgesChange]);

  const handleTextChange = (e) => {
    updateNodeField(id, 'text', e.target.value);
  };

  return (
    <BaseNode
      id={id}
      typeLabel="Text"
      title={textName}
      icon={FileText}
      selected={selected}
      className="node--text"
      inputs={inputs}
      outputs={[{ id: `${id}-output`, label: 'output' }]}
      style={nodeStyle}
    >
      <div className="node--text__content">
        <textarea
          value={currText}
          placeholder="Enter text..."
          onChange={handleTextChange}
          className="node--text__textarea nodrag nowheel nopan"
          style={{ marginTop: `${extraMargin}px`, height: `${Math.max(60, contentDim.height)}px` }}
        />
      </div>
    </BaseNode>
  );
};
