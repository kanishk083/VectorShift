import { useState } from 'react';
import { DraggableNode } from './draggableNode';
import { nodeConfigs } from './nodes/registry';
import { HelpCircle } from 'lucide-react';

const categories = [...new Set(nodeConfigs.map((c) => c.category))];

export const PipelineToolbar = () => {
    const [search, setSearch] = useState('');

    const q = search.toLowerCase().trim();

    return (
        <aside className="sidebar">
            <div className="sidebar__header">
                <div className="sidebar__title">Nodes</div>
                <div className="sidebar__search">
                    <svg className="sidebar__search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="M21 21l-4.35-4.35"/>
                    </svg>
                    <input
                        type="text"
                        placeholder="Search nodes..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="sidebar__search-input"
                    />
                    <span className="sidebar__search-shortcut">⌘K</span>
                </div>
            </div>
            <div className="sidebar__body">
                <div className="sidebar__groups-wrapper">
                    {categories.map((category) => {
                        const items = nodeConfigs.filter(
                            (c) => c.category === category && (!q || c.label.toLowerCase().includes(q))
                        );
                        if (items.length === 0) return null;
                        return (
                            <div key={category} className="sidebar__group">
                                <div className="sidebar__group-label">{category}</div>
                                <div className="sidebar__items">
                                    {items.map((config) => (
                                        <DraggableNode
                                            key={config.type}
                                            type={config.type}
                                            label={config.label}
                                            category={config.category}
                                        />
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Help Tip Card at bottom of sidebar */}
                <div className="sidebar__tip-card">
                    <div className="sidebar__tip-header">
                        <HelpCircle size={12} />
                        <span>Tip</span>
                    </div>
                    <div className="sidebar__tip-text">
                        Connect nodes from left to right to build your AI workflow.
                    </div>
                </div>
            </div>
        </aside>
    );
};
