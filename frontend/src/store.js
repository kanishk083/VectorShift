// store.js

import { create } from "zustand";
import {
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
    MarkerType,
  } from 'reactflow';

export const useStore = create((set, get) => ({
    nodes: [],
    edges: [],
    tourActive: false,
    setTourActive: (active) => set({ tourActive: active }),
    getNodeID: (type) => {
        const newIDs = {...get().nodeIDs};
        if (newIDs[type] === undefined) {
            newIDs[type] = 0;
        }
        newIDs[type] += 1;
        set({nodeIDs: newIDs});
        return `${type}-${newIDs[type]}`;
    },
    addNode: (node) => {
        set({
            nodes: [...get().nodes, node]
        });
    },
    onNodesChange: (changes) => {
      const removed = changes.filter((c) => c.type === 'remove').map((c) => c.id);
      const nextNodes = applyNodeChanges(changes, get().nodes);
      if (removed.length > 0) {
        const remainingIds = new Set(nextNodes.map((n) => n.id));
        const keptEdges = get().edges.filter(
          (e) => remainingIds.has(e.source) && remainingIds.has(e.target)
        );
        set({ nodes: nextNodes, edges: keptEdges });
      } else {
        set({ nodes: nextNodes });
      }
    },
    onEdgesChange: (changes) => {
      set({
        edges: applyEdgeChanges(changes, get().edges),
      });
    },
    onConnect: (connection) => {
      set({
        edges: addEdge({...connection, type: 'smoothstep', animated: true, markerEnd: {type: MarkerType.Arrow, height: '20px', width: '20px'}}, get().edges),
      });
    },
    updateNodeField: (nodeId, fieldName, fieldValue) => {
      set({
        nodes: get().nodes.map((node) => {
          if (node.id === nodeId) {
            return {
              ...node,
              data: { ...node.data, [fieldName]: fieldValue }
            };
          }
  
          return node;
        }),
      });
    },
  }));

