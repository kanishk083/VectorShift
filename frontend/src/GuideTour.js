import React, { useState, useEffect, useRef } from 'react';
import { useStore } from './store';

const steps = [
  {
    selector: '.navbar',
    position: 'bottom',
    title: 'VectorShift Tour',
    content: 'This is the main control bar. Here you can undo/redo changes, track credit balance, run pipeline checks, and publish workflows.',
  },
  {
    selector: '.sidebar',
    position: 'right',
    title: 'Nodes Library',
    content: 'Find and drag modules from here onto your workspace canvas. We offer Inputs, LLMs, Text formatting, Logic gates, and Delays.',
  },
  {
    selector: '.app-main',
    position: 'bottom',
    title: 'Pipeline Canvas',
    content: 'This is your design playground. Arrange nodes and drag connections from output ports (right) to input ports (left) of other nodes.',
  },
  {
    selector: '.panel',
    position: 'left',
    title: 'Properties Panel',
    content: 'When a node is selected, this sidebar slides open. Customize model selections, prompts, text variables, and configurations here.',
  },
  {
    selector: '.analyze-btn',
    position: 'top',
    title: 'Submit & Analyze',
    content: 'Click here to validate your pipeline. It checks node counts, edge counts, and runs Kahn\'s topological sort to verify if the graph is a DAG.',
  },
];

const getTargetCoords = (selector, position) => {
  const el = document.querySelector(selector);
  let coords = { x: window.innerWidth / 2 - 140, y: window.innerHeight / 2 - 100 };
  
  if (el) {
    const rect = el.getBoundingClientRect();
    if (position === 'right') {
      coords = { x: rect.right + 20, y: rect.top + rect.height / 2 - 80 };
    } else if (position === 'left') {
      coords = { x: rect.left - 300, y: rect.top + rect.height / 2 - 80 };
    } else if (position === 'bottom') {
      coords = { x: rect.left + rect.width / 2 - 140, y: rect.bottom + 20 };
    } else if (position === 'top') {
      coords = { x: rect.left + rect.width / 2 - 140, y: rect.top - 200 };
    } else {
      coords = { x: rect.left, y: rect.top };
    }
  }

  // Viewport boundary clamps to prevent tooltips rendering off-screen
  coords.x = Math.max(20, Math.min(coords.x, window.innerWidth - 300));
  coords.y = Math.max(20, Math.min(coords.y, window.innerHeight - 220));
  
  return coords;
};

export const GuideTour = () => {
  const tourActive = useStore((state) => state.tourActive);
  const setTourActive = useStore((state) => state.setTourActive);
  const [step, setStep] = useState(0);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isFadingIn, setIsFadingIn] = useState(true);
  
  const cursorRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  // 1. Keep track of cursor coordinates globally
  useEffect(() => {
    const handleMouseMove = (e) => {
      cursorRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 2. Highlight focused element by adding CSS classes and handling static positions
  useEffect(() => {
    if (!tourActive) return;
    const currentSelector = steps[step]?.selector;
    const el = document.querySelector(currentSelector);
    
    if (el) {
      el.classList.add('guide-highlight');
      const computedStyle = window.getComputedStyle(el);
      if (computedStyle.position === 'static') {
        el.style.position = 'relative';
        el.dataset.wasStatic = 'true';
      }
    }
    
    return () => {
      if (el) {
        el.classList.remove('guide-highlight');
        if (el.dataset.wasStatic === 'true') {
          el.style.position = '';
          delete el.dataset.wasStatic;
        }
      }
    };
  }, [step, tourActive]);

  // 3. Auto-select first node during Step 4 to ensure the Properties Panel is open
  useEffect(() => {
    if (tourActive && step === 3) {
      const currentNodes = useStore.getState().nodes;
      if (currentNodes.length > 0) {
        const alreadySelected = currentNodes.some(n => n.selected);
        if (!alreadySelected) {
          useStore.getState().onNodesChange([{ type: 'select', id: currentNodes[0].id, selected: true }]);
        }
      }
    }
  }, [step, tourActive]);

  // 4. Move tooltip from cursor coordinates to target element dynamically
  useEffect(() => {
    if (!tourActive) return;
    
    // Set initial position at current cursor pointer, fade out and scale down
    setIsFadingIn(true);
    setCoords({ x: cursorRef.current.x, y: cursorRef.current.y });
    
    // Wait a brief tick to animate transition to final coordinates
    const timer = setTimeout(() => {
      const target = getTargetCoords(steps[step].selector, steps[step].position);
      setCoords(target);
      setIsFadingIn(false);
    }, 40);
    
    return () => clearTimeout(timer);
  }, [step, tourActive]);

  if (!tourActive) return null;

  const currentStepData = steps[step];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleClose = () => {
    setTourActive(false);
    setStep(0);
  };

  return (
    <>
      {/* Blurred dimmed full-screen backdrop overlay */}
      <div className="guide-overlay" onClick={handleClose}></div>

      {/* Sticky Note Tooltip flying in from cursor position */}
      <div
        className="guide-tooltip"
        style={{
          position: 'fixed',
          left: coords.x,
          top: coords.y,
          zIndex: 999999,
          transform: isFadingIn ? 'scale(0.1)' : 'scale(1)',
          opacity: isFadingIn ? 0 : 1,
          transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease, left 0.5s cubic-bezier(0.16, 1, 0.3, 1), top 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div className="guide-tooltip__header">
          <span className="guide-tooltip__title">{currentStepData.title}</span>
          <span className="guide-tooltip__step">
            {step + 1} / {steps.length}
          </span>
        </div>
        <div className="guide-tooltip__content">
          {currentStepData.content}
        </div>
        <div className="guide-tooltip__footer">
          <button className="guide-tooltip__skip-btn" onClick={handleClose}>
            Skip
          </button>
          <div className="guide-tooltip__nav">
            {step > 0 && (
              <button className="guide-tooltip__btn guide-tooltip__btn--secondary" onClick={handlePrev}>
                Back
              </button>
            )}
            <button className="guide-tooltip__btn" onClick={handleNext}>
              {step === steps.length - 1 ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
