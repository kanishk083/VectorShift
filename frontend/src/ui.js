import { useState, useRef, useCallback } from 'react';
import ReactFlow, { Background, MiniMap, ReactFlowProvider, useReactFlow } from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { nodeTypes } from './nodes/registry';
import { Maximize, Minus, Plus, Lock, Unlock } from 'lucide-react';

import 'reactflow/dist/style.css';

const gridSize = 20;
const proOptions = { hideAttribution: true };

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

const getInitNodeData = (nodeID, type) => {
  let nodeData = { id: nodeID };
  if (type === 'customInput') {
    nodeData.inputName = nodeID.replace('customInput-', 'input_');
    nodeData.inputType = 'Text';
  } else if (type === 'customOutput') {
    nodeData.outputName = nodeID.replace('customOutput-', 'output_');
    nodeData.outputType = 'Text';
  } else if (type === 'text') {
    nodeData.text = '{{input}}';
  } else if (type === 'llm') {
    nodeData.model = 'GPT-4 Turbo';
    nodeData.temperature = 0.7;
    nodeData.maxTokens = 1024;
    nodeData.systemPrompt = 'You are a helpful analytics assistant. Provide clear, actionable insights.';
    nodeData.userMessage = 'Analyze the following customer data and provide key insights and recommendations.';
  } else if (type === 'filter') {
    nodeData.expression = 'value > 0';
  } else if (type === 'math') {
    nodeData.operation = 'add';
  } else if (type === 'condition') {
    nodeData.expression = 'input !== null';
  } else if (type === 'aggregate') {
    nodeData.aggregation = 'concat';
  } else if (type === 'delay') {
    nodeData.duration = 5;
  }
  return nodeData;
};

const PipelineUIContent = () => {
  const reactFlowWrapper = useRef(null);
  const [zoomPercent, setZoomPercent] = useState(100);
  const [isLocked, setIsLocked] = useState(false);
  
  const { zoomIn, zoomOut, fitView, project } = useReactFlow();

  const {
    nodes,
    edges,
    getNodeID,
    addNode,
    onNodesChange,
    onEdgesChange,
    onConnect
  } = useStore(selector, shallow);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();

      const type = event?.dataTransfer?.getData('application/reactflow');
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const nodeID = getNodeID(type);
      const newNode = {
        id: nodeID,
        type,
        position,
        data: getInitNodeData(nodeID, type),
      };

      console.log("CREATE NODE", newNode.id);
      console.trace();

      addNode(newNode);
    },
    [project, addNode, getNodeID]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onViewportChange = useCallback((viewport) => {
    setZoomPercent(Math.round(viewport.zoom * 100));
  }, []);

  const handleZoomIn = () => {
    zoomIn();
  };

  const handleZoomOut = () => {
    zoomOut();
  };

  const handleFitView = () => {
    fitView({ duration: 300 });
  };

  return (
    <div ref={reactFlowWrapper} className="react-flow-wrapper">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onMove={(e, viewport) => onViewportChange(viewport)}
        nodeTypes={nodeTypes}
        proOptions={proOptions}
        snapGrid={[gridSize, gridSize]}
        connectionLineType='smoothstep'
        deleteKeyCode={['Backspace', 'Delete']}
        panOnDrag={!isLocked}
        zoomOnScroll={!isLocked}
        zoomOnPinch={!isLocked}
        zoomOnDoubleClick={!isLocked}
      >
        <Background color="#1a1a1e" gap={gridSize} variant="lines" size={1} />
        
        <MiniMap
          nodeColor={() => '#121316'}
          maskColor="rgba(0, 0, 0, 0.7)"
          style={{ width: 120, height: 80 }}
        />
      </ReactFlow>

      {/* Custom Controls Panel */}
      <div className="custom-controls">
        <button className="custom-controls__btn" onClick={handleFitView} title="Fit View">
          <Maximize size={12} />
        </button>
        <button className="custom-controls__btn" onClick={handleZoomOut} title="Zoom Out">
          <Minus size={12} />
        </button>
        <span className="custom-controls__zoom">{zoomPercent}%</span>
        <button className="custom-controls__btn" onClick={handleZoomIn} title="Zoom In">
          <Plus size={12} />
        </button>
        <button 
          className="custom-controls__btn" 
          onClick={() => setIsLocked(!isLocked)} 
          title={isLocked ? "Unlock Pan/Zoom" : "Lock Pan/Zoom"}
        >
          {isLocked ? <Lock size={12} fill="currentColor" /> : <Unlock size={12} />}
        </button>
      </div>

      {/* Auto-Save Indicator */}
      <div className="auto-save">
        <div className="auto-save__dot"></div>
        <span>Auto-saved 2s ago</span>
      </div>

      {nodes.length === 0 && (
        <div className="onboarding">
          <div className="onboarding__icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 6h16M4 12h16M4 18h16"/>
              <path d="M7 3L9 3M12 3L12 3M17 3L19 3" strokeWidth="1"/>
              <path d="M7 21L9 21M12 21L12 21M17 21L19 21" strokeWidth="1"/>
            </svg>
          </div>
          <h2 className="onboarding__title">AI Pipeline Builder</h2>
          <p className="onboarding__text">Build production AI workflows visually.</p>
          <p className="onboarding__hint">Drag nodes from the left sidebar to begin.</p>
          <div className="onboarding__tip">
            <span className="onboarding__tip-arrow">→</span>
            Connect nodes from left to right to build your AI workflow.
          </div>
        </div>
      )}
      {nodes.length > 0 && edges.length === 0 && (
        <div className="workflow-tip">
          <span className="workflow-tip__icon">→</span>
          <span className="workflow-tip__text">
            Connect nodes from left to right to build your AI workflow.
          </span>
        </div>
      )}
    </div>
  );
};

export const PipelineUI = () => {
  return (
    <ReactFlowProvider>
      <PipelineUIContent />
    </ReactFlowProvider>
  );
};

