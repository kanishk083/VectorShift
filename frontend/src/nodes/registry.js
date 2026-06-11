import { InputNode } from './inputNode';
import { OutputNode } from './outputNode';
import { LLMNode } from './llmNode';
import { TextNode } from './textNode';
import { FilterNode } from './filterNode';
import { MathNode } from './mathNode';
import { ConditionNode } from './conditionNode';
import { AggregateNode } from './aggregateNode';
import { DelayNode } from './delayNode';

export const nodeConfigs = [
  { type: 'customInput',  component: InputNode,    label: 'Input',     category: 'Input' },
  { type: 'customOutput', component: OutputNode,   label: 'Output',    category: 'Output' },
  { type: 'llm',          component: LLMNode,      label: 'LLM',       category: 'AI' },
  { type: 'text',         component: TextNode,     label: 'Text',      category: 'Processing' },
  { type: 'filter',       component: FilterNode,   label: 'Filter',    category: 'Processing' },
  { type: 'math',         component: MathNode,     label: 'Math',      category: 'Processing' },
  { type: 'condition',    component: ConditionNode, label: 'Condition', category: 'Logic' },
  { type: 'aggregate',    component: AggregateNode, label: 'Aggregate', category: 'Processing' },
  { type: 'delay',        component: DelayNode,    label: 'Delay',     category: 'Flow' },
];

export const nodeTypes = Object.fromEntries(
  nodeConfigs.map((c) => [c.type, c.component])
);
