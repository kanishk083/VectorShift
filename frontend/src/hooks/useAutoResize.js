import { useState, useRef, useLayoutEffect, useEffect } from 'react';

/**
 * useAutoResize — measures text dimensions using a hidden DOM mirror element.
 *
 * Why DOM measurement over character estimation:
 *   Character estimation (text.length * 8, lines * 24) assumes monospace
 *   font and ignores CSS properties like letter-spacing, word-spacing,
 *   padding, and dynamic line-wrapping behavior. It produces incorrect
 *   results for proportional fonts, mixed-content text, and any styling
 *   beyond the simplest case.
 *
 *   A hidden mirror element lets the browser's layout engine compute the
 *   exact rendered dimensions, accounting for every CSS property that
 *   affects text size. This is the approach used by production text editors
 *   (CodeMirror, Monaco, etc.) for auto-sizing textareas.
 *
 * Two-pass measurement:
 *   1. Measure natural width (whiteSpace: nowrap) to see how wide the
 *      content wants to be without line wrapping.
 *   2. Clamp width to [minWidth, maxWidth], then measure height at the
 *      clamped width (whiteSpace: pre-wrap) so that wrapping is accounted
 *      for accurately.
 *
 * Trade-offs vs. character estimation:
 *   - DOM measurement requires an extra layout pass (useLayoutEffect runs
 *     after DOM mutations but before paint, so no visual flash occurs).
 *     Character estimation is synchronous and single-pass.
 *   - The mirror element adds one hidden DOM node per TextNode instance.
 *   - DOM measurement is accurate; character estimation is approximate.
 *     For a node editor used in a pipeline builder, accuracy matters more
 *     than the marginal render cost.
 *
 * @param {string}  value          — text content to measure
 * @param {Object}  style          — CSS properties for the mirror
 *                                   (must match textarea styling)
 * @param {number}  minWidth       — minimum content width
 * @param {number}  maxWidth       — maximum content width
 * @returns {{ width: number, height: number }} clamped content dimensions
 */
export function useAutoResize(value, style = {}, minWidth = 0, maxWidth = Infinity) {
  const mirrorRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: minWidth, height: 0 });

  useLayoutEffect(() => {
    const mirror = getMirror(mirrorRef);
    if (!mirror) return;

    // Apply textarea styling to the mirror
    mirror.style.whiteSpace = 'nowrap';
    mirror.style.width = 'auto';
    mirror.style.height = 'auto';
    Object.assign(mirror.style, style);

    // Update content
    mirror.textContent = value || '';

    // Pass 1: natural width without line wrapping
    const naturalWidth = mirror.scrollWidth;

    // Clamp the content width
    const clampedWidth = Math.min(Math.max(naturalWidth, minWidth), maxWidth);

    // Pass 2: measure height at the clamped width with wrapping
    mirror.style.whiteSpace = 'pre-wrap';
    mirror.style.width = `${clampedWidth}px`;
    const height = mirror.scrollHeight;

    setDimensions({ width: Math.round(clampedWidth), height: Math.round(height) });
  }, [value, style, minWidth, maxWidth]);

  useEffect(() => {
    const mirror = mirrorRef.current;
    return () => {
      if (mirror?.parentNode) {
        mirror.parentNode.removeChild(mirror);
      }
    };
  }, []);

  return dimensions;
}

function getMirror(ref) {
  if (!ref.current) {
    ref.current = document.createElement('div');
    ref.current.style.position = 'absolute';
    ref.current.style.top = '-9999px';
    ref.current.style.left = '-9999px';
    ref.current.style.visibility = 'hidden';
    ref.current.style.pointerEvents = 'none';
    ref.current.style.overflowWrap = 'break-word';
    document.body.appendChild(ref.current);
  }
  return ref.current;
}
