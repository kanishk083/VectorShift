// constants.js

export const INPUT_TYPE_OPTIONS = [
  { value: 'Text', label: 'Text' },
  { value: 'File', label: 'File' },
];

export const OUTPUT_TYPE_OPTIONS = [
  { value: 'Text', label: 'Text' },
  { value: 'Image', label: 'Image' },
  { value: 'JSON', label: 'JSON' },
];

export const MODEL_OPTIONS = [
  { value: 'GPT-4 Turbo', label: 'GPT-4 Turbo' },
  { value: 'GPT-3.5 Turbo', label: 'GPT-3.5 Turbo' },
  { value: 'Claude 3 Opus', label: 'Claude 3 Opus' },
];

export const OPERATION_OPTIONS = [
  { value: 'add', label: 'Add' },
  { value: 'subtract', label: 'Subtract' },
  { value: 'multiply', label: 'Multiply' },
  { value: 'divide', label: 'Divide' },
];

export const AGGREGATION_OPTIONS = [
  { value: 'concat', label: 'Concatenate' },
  { value: 'merge', label: 'Merge' },
  { value: 'pick', label: 'Pick First' },
];
