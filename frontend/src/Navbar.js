import React from 'react';
import { HelpCircle } from 'lucide-react';
import { useStore } from './store';

export const Navbar = () => {
  const setTourActive = useStore((state) => state.setTourActive);

  return (
    <header className="navbar">
      <div className="navbar__left">
        <div className="navbar__logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="navbar__logo-svg">
            <path d="M12 2L2 22h20L12 2z" fill="url(#logo-grad)" />
            <path d="M12 6L5 20h14L12 6z" fill="#000000" opacity="0.4" />
            <path d="M12 9l-4 8h8l-4-8z" fill="#d4d4d8" />
            <defs>
              <linearGradient id="logo-grad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                <stop stopColor="#ffffff" />
                <stop offset="1" stopColor="#a1a1aa" />
              </linearGradient>
            </defs>
          </svg>
          <span className="navbar__logo-text">VectorShift</span>
        </div>
        <div className="navbar__separator">/</div>
        <div className="navbar__breadcrumb">
          <span className="navbar__breadcrumb-parent">AI Pipeline Builder</span>
          <span className="navbar__breadcrumb-slash">/</span>
          <span className="navbar__breadcrumb-active">Growth Analytics Pipeline</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="navbar__breadcrumb-arrow">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      <div className="navbar__right">
        <button className="navbar__btn navbar__btn--outline" onClick={() => setTourActive(true)}>
          <HelpCircle size={14} />
          <span>Tour</span>
        </button>
      </div>
    </header>
  );
};

