import React from 'react';
import { Play, Layers, Code2, Database, BarChart3, Settings } from 'lucide-react';

export const LeftMenuRail = () => {
  return (
    <aside className="menu-rail">
      <div className="menu-rail__group">
        <button className="menu-rail__item menu-rail__item--active" title="Editor">
          <div className="menu-rail__icon-wrapper">
            <Play size={18} fill="currentColor" />
          </div>
        </button>
        <button className="menu-rail__item" title="Pipelines">
          <Layers size={18} />
        </button>
        <button className="menu-rail__item" title="Code Elements">
          <Code2 size={18} />
        </button>
        <button className="menu-rail__item" title="Data & Storage">
          <Database size={18} />
        </button>
        <button className="menu-rail__item" title="Analytics">
          <BarChart3 size={18} />
        </button>
      </div>
      <div className="menu-rail__footer">
        <button className="menu-rail__item" title="Settings">
          <Settings size={18} />
        </button>
      </div>
    </aside>
  );
};
