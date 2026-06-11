# AI Pipeline Builder

A visual AI workflow builder built with React, React Flow, and Zustand. Users construct pipelines by dragging nodes onto a canvas, connecting them via handles, and configuring each node directly inline or through a synchronized Properties Panel. A FastAPI backend validates the resulting directed graph and checks whether it forms a valid DAG.

---

## Features

**Drag-and-Drop Canvas** — Nodes are dragged from a categorized sidebar onto a React Flow canvas. Each drop generates a unique node ID and pre-populates default configuration values.

**Inline Node Editing** — Every node exposes its primary configuration fields directly on the canvas (Model select, Temperature slider, Duration input, Text textarea, etc.). Users configure pipelines without switching contexts.

**Properties Panel** — Selecting a node opens a right-side panel that mirrors all configurable fields. Changes in either surface are immediately reflected in the other, enforced through the single Zustand store.

**Dynamic Variable Parsing** — The Text node parses `{{variable}}` syntax from its content. Each unique variable generates a dedicated input handle. Removing the variable from the text removes the handle and cleans up any connected edges automatically.

**Auto-Resizing Text Node** — The Text node measures its content via a hidden mirror DOM element and adjusts its width and height to fit, clamped within min/max bounds.

**9 Node Types** — Input, Output, Text, LLM (model + temperature), Filter, Math, Aggregate, Condition, and Delay — each with type-specific inline controls and validated data fields.

**Pipeline Validation** — Clicking "Analyze Pipeline" sends the full node/edge graph to the backend, which returns node count, edge count, and DAG status (via Kahn's algorithm). Results are displayed in a custom modal.

**Orphaned Edge Cleanup** — When a node is deleted (Backspace/Del), all edges connected to it are automatically removed to prevent stale references in the graph.

**Guided Tour** — A multi-step overlay tour walks new users through the canvas, sidebar, Properties Panel, and validation flow.

**Dark UI** — Modern dark theme with consistent spacing, color-coded node categories, and CSS custom properties for theming.

---

## Tech Stack

**Frontend**
- React 18 — UI component model
- React Flow v11 — graph canvas, node dragging, edge routing, viewport controls
- Zustand — lightweight state management with selector-based subscriptions
- CSS (no framework) — custom properties, flexbox layout, keyframe animations

**Backend**
- FastAPI — async Python server with Pydantic validation
- Kahn's Algorithm — topological sort for DAG detection

React Flow was chosen over raw SVG/Canvas libraries because it provides production-grade node dragging, edge routing, handle connection validation, and viewport controls out of the box. Zustand was chosen over Redux or Context because it provides selector-based subscriptions with shallow comparison, avoiding unnecessary re-renders without middleware boilerplate.

---

## Architecture

```
Sidebar ─────────┐
                 ▼
Left Menu Rail ──▶  React Flow Canvas (ui.js)
                     │
          ┌──────────┼──────────┐
          ▼          ▼          ▼
      Custom     BaseNode    Properties
      Nodes      (generic)   Panel
          │          │          │
          └──────────┼──────────┘
                     ▼
              Zustand Store
              (single source)
                     │
                     ▼
            SubmitButton ──▶  POST /pipelines/parse
                                  │
                                  ▼
                              FastAPI
                          build_graph + is_dag
                                  │
                                  ▼
                          PipelineModal (result)
```

**Data Flow** — All node and edge state lives in the Zustand store. Node components read their own `data` via React props. The Properties Panel reads `selected.data` from the store and writes through `updateNodeField`. The SubmitButton reads `nodes` and `edges` directly from the store and sends them to the backend. The backend never mutates state — it returns analysis results displayed in a modal.

---

## Project Structure

```
frontend/
├── src/
│   ├── App.js                  Root layout: Navbar + Sidebar + Canvas + Panel
│   ├── index.js                Entry point
│   ├── index.css               All styles (1759 lines), CSS custom properties
│   ├── store.js                Zustand store (nodes, edges, actions)
│   ├── ui.js                   React Flow wrapper, drag-drop handler, zoom controls
│   ├── submit.js               SubmitButton + API call orchestration
│   ├── propertiesPanel.js      Right-side panel for selected node editing
│   ├── Navbar.js               Top bar with undo/redo/play/tour/credits/share/publish
│   ├── toolbar.js              Left sidebar with categorized node list + search
│   ├── draggableNode.js        Draggable sidebar node item
│   ├── LeftMenuRail.js         Left icon rail
│   ├── PipelineModal.js        Analysis results modal
│   ├── GuideTour.js            Multi-step interactive tour
│   ├── nodes/
│   │   ├── BaseNode.js         Generic node shell: header, handles, label gutter, content slot
│   │   ├── registry.js         Central registry of 9 node types → components + configs
│   │   ├── constants.js        Shared option arrays (models, operations, types)
│   │   ├── inputNode.js        Input: type selection (Text/File)
│   │   ├── outputNode.js       Output: type selection (Text/Image/JSON)
│   │   ├── textNode.js         Text: textarea, dynamic variable parsing, auto-resize
│   │   ├── llmNode.js          LLM: model dropdown + temperature slider
│   │   ├── filterNode.js       Filter: expression input
│   │   ├── mathNode.js         Math: operation select (add/subtract/multiply/divide)
│   │   ├── conditionNode.js    Condition: expression input
│   │   ├── aggregateNode.js    Aggregate: aggregation select (concat/merge/pick)
│   │   └── delayNode.js        Delay: duration number input
│   ├── hooks/
│   │   ├── useAutoResize.js    DOM-based text measurement for auto-resizing
│   │   └── useFieldState.js    Generic field state bridge helper
│   ├── utils/
│   │   └── parseVariables.js   Pure function: extracts unique {{name}} tokens from text
│   └── services/
│       └── pipelineApi.js      POST /pipelines/parse fetch wrapper
└── backend/
    ├── main.py                 FastAPI app, CORS, /pipelines/parse endpoint
    ├── schemas.py              Pydantic request/response models
    ├── graph.py                Graph builder + validation + deduplication
    └── dag.py                  Kahn's algorithm topological sort
```

---

## Editable Node System

Every node renders its primary configuration controls directly inside the canvas node body. This is the primary editing surface. The Properties Panel mirrors the same fields.

| Node      | Inline Controls                          | Data Fields                                      |
|-----------|------------------------------------------|--------------------------------------------------|
| Input     | Node name, Input type (Text/File)        | `inputName`, `inputType`                         |
| Output    | Node name, Output type (Text/Image/JSON) | `outputName`, `outputType`                       |
| Text      | Text content textarea                    | `text`, `textName`                               |
| LLM       | Model dropdown, Temperature slider       | `model`, `temperature`, `llmName`, `systemPrompt`, `userMessage`, `maxTokens` |
| Filter    | Filter expression input                  | `expression`, `filterName`                       |
| Math      | Operation dropdown                       | `operation`, `mathName`                          |
| Condition | Condition expression input               | `expression`, `conditionName`                    |
| Aggregate | Aggregation type dropdown                | `aggregation`, `aggregateName`                   |
| Delay     | Duration (seconds) number input          | `duration`, `delayName`                          |

Changes via inline controls and the Properties Panel both call `updateNodeField(id, fieldName, value)` in the Zustand store, ensuring two-way synchronization without duplication.

---

## Dynamic Variable Detection

The Text node runs `parseVariables()` on its content, which extracts all `{{name}}` tokens and deduplicates them. For example:

```
Hello {{name}}

Today is {{date}}
```

Produces variables `[{ name: "name" }, { name: "date" }]`, which generate two input handles labeled `name` and `date` alongside the default `INPUT` handle.

The implementation is:
1. A regex extracts all `{{...}}` tokens that match valid identifier rules (no numbers-only, no reserved words)
2. Results are deduplicated into a unique set
3. The `inputs` array is recomputed via `useMemo`, triggering handle re-mounting
4. A `useEffect` cleans up any edges connected to handles that no longer exist

All handle IDs are prefixed with the node ID (`${id}-input`, `${id}-name`, etc.) to guarantee uniqueness across nodes.

---

## State Management

Zustand is the single source of truth. The store holds:

- `nodes` — React Flow node objects with `id`, `type`, `position`, `data`
- `edges` — React Flow edge objects with `source`, `target`, `sourceHandle`, `targetHandle`
- Actions: `addNode`, `onNodesChange`, `onEdgesChange`, `onConnect`, `updateNodeField`
- UI state: `tourActive`, `nodeIDs` (counter per type)

`updateNodeField` creates a new `nodes` array and spreads the node's `data` with the updated field, ensuring React detects the change and re-renders subscribers.

The Properties Panel and each node component subscribe independently. The `shallow` comparator from Zustand prevents re-renders when the `nodes` array reference changes but the selected node's identity doesn't.

---

## Design Decisions

**Canvas-first editing.** Nodes expose their most-frequently-changed controls directly on the canvas (Model select, Temperature slider, textarea). This reduces friction vs. requiring a panel for every edit. The Properties Panel serves as a convenience for less-frequent fields (system prompt, user message) and provides a unified view.

**Single state surface for both editors.** Both inline controls and the Properties Panel write through `updateNodeField`. There is no branching logic or dual state — one function, one store. This eliminates synchronization bugs.

**Dynamic handle generation.** Rather than pre-defining handles on every node, the Text node computes its handle list reactively from parsed variables. This maps the data model (text with placeholders) directly to the visual model (handles). The tradeoff is added complexity in handle positioning and edge cleanup, which is managed through `useMemo` + `useEffect`.

**Interaction isolation.** All inline controls use CSS classes `nodrag nopan nowheel` to prevent React Flow from intercepting input events. This avoids the common pitfall where typing in a node textarea starts dragging the node.

**Separating UI state from graph state.** The store separates graph data (nodes, edges) from UI state (tourActive, zoom percent). This prevents graph operations from triggering unrelated re-renders and keeps the data model clean for backend serialization.

**Scalability.** The registry pattern (`nodeConfigs` array + `Object.fromEntries` map) means adding a new node type requires creating one component file and adding one entry to the registry — no switch statements, no manual routing. The `BaseNode` provides consistent header/handle/label layout, so new nodes only implement their specific controls.

---

## Pipeline Validation

The "Analyze Pipeline" button sends the current `nodes` and `edges` arrays to `POST /pipelines/parse`. The backend:

1. Extracts node IDs from the payload
2. Validates every edge's `source` and `target` references an existing node
3. Deduplicates parallel edges (same source + target)
4. Builds an adjacency list and in-degree map
5. Runs Kahn's algorithm to detect cycles

Results are displayed in a custom modal showing node count, edge count, and whether the graph is a valid DAG. Errors (missing nodes, invalid edges) are caught and displayed as plain-text error messages in the same modal.

Before each submission, the frontend logs nodes and edges to the console and validates internally that all edge references exist — catching mismatches before they reach the API.

---

## Local Development

**Frontend**

```bash
cd frontend
npm install
npm start
```

Runs on `http://localhost:3000`.

**Backend**

```bash
cd backend
python -m uvicorn main:app --reload --port 8000
```

Runs on `http://localhost:8000`. The frontend is pre-configured to proxy API calls to this address.

---

## Future Improvements

- **Save/Load workflows** — Serialize pipeline state to JSON and persist to localStorage or a database
- **Keyboard shortcuts** — Copy/paste nodes, Select All, duplicate
- **Node duplication** — Clone selected node with offset position
- **Undo/Redo** — Action history stack in the store for full undo support
- **Minimap navigation** — Click-to-navigate from minimap (React Flow built-in, needs wiring)
- **Pipeline execution engine** — Execute the DAG by traversing nodes in topological order
- **Backend execution logs** — Real-time streaming logs per node when running a pipeline
- **Collaborative editing** — CRDT-based real-time collaboration on the same pipeline
- **Version history** — Snapshot diff-based history for reverting changes

---

## Engineering Notes

- **Modular components.** Each node type is an independent component registered in a central registry. Adding a node type requires zero changes outside its component file and the registry entry.
- **Reusable architecture.** `BaseNode` provides the shell (header, handles, labels) and layout; concrete nodes only supply their specific content. The store and panel are generic — they operate on any node type's `data` keys without branching.
- **Centralized state management.** All mutations go through Zustand actions. There are no local state variables competing with the store, no prop drilling beyond the immediate node component, and no side effects hidden in reducers.
- **Maintainable code organization.** Separation into `nodes/`, `hooks/`, `utils/`, `services/` follows a flat, discoverable structure. CSS is a single file but organized by component section with clear section headers.
- **Testable data flow.** `parseVariables` is a pure function with zero React dependencies. The store actions are pure transformations on state. The backend graph validation is a pure computation isolated from HTTP concerns.

---

## Assignment Summary

- Drag-and-drop nodes onto a React Flow canvas
- Inline editing controls on every node
- Properties Panel with bidirectional synchronization
- Dynamic `{{variable}}` parsing with automatic handle generation
- Auto-resizing Text node based on content
- 9 node types with type-specific configuration
- Pipeline validation via backend DAG analysis
- Custom analysis results modal
- Guided tour system
- React Flow integration with custom node types
- Zustand centralized state management
- Orphaned edge cleanup on node deletion
- Searchable, categorized node sidebar
- Modern dark UI with custom controls

---

## Author

Kanishk Wagh

Built as part of the VectorShift Frontend Engineering Assignment.
