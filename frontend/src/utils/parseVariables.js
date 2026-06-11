const RESERVED_WORDS = new Set([
  'await', 'break', 'case', 'catch', 'class', 'const', 'continue',
  'debugger', 'default', 'delete', 'do', 'else', 'enum', 'export',
  'extends', 'false', 'finally', 'for', 'function', 'if', 'import',
  'in', 'instanceof', 'let', 'new', 'null', 'return', 'super',
  'switch', 'this', 'throw', 'true', 'try', 'typeof', 'var',
  'void', 'while', 'with', 'yield',
  'undefined', 'NaN', 'Infinity',
]);

const VALID_IDENTIFIER = /^[_$a-zA-Z][_$a-zA-Z0-9]*$/;

/**
 * Parse text for {{variable}} patterns.
 *
 * Pure function. No React, no DOM, no hooks, no side effects.
 *
 * Returns:
 *   variables: Array<{ name: string, raw: string, start: number }>
 *     - name: validated, deduplicated variable name
 *     - raw: the original {{...}} string
 *     - start: character index in the input text
 *   errors: Array<{ raw: string, reason: string }>
 */
export function parseVariables(text) {
  const variables = [];
  const errors = [];
  const seen = new Set();
  const regex = /\{\{\s*([^}]+?)\s*\}\}/g;

  let match;
  while ((match = regex.exec(text)) !== null) {
    const rawName = match[1].trim();

    if (rawName.length === 0) {
      errors.push({ raw: match[0], reason: 'empty variable name' });
      continue;
    }

    if (!VALID_IDENTIFIER.test(rawName)) {
      errors.push({ raw: match[0], reason: 'invalid JavaScript identifier' });
      continue;
    }

    if (RESERVED_WORDS.has(rawName)) {
      errors.push({ raw: match[0], reason: 'reserved word' });
      continue;
    }

    if (!seen.has(rawName)) {
      seen.add(rawName);
      variables.push({ name: rawName, raw: match[0], start: match.index });
    }
  }

  return { variables, errors };
}
