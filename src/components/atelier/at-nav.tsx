'use client';

import { FC, useState, useEffect, useCallback } from 'react';
import { useScroll, useMotionValueEvent } from 'framer-motion';
import type { ATNavProps } from './types';

export const ATNav: FC<ATNavProps> = ({ dictionary, onOpen, theme, setTheme }) => {
  const [scroll, setScroll] = useState(false);
  const navItems = dictionary?.nav || [];
  const { scrollY } = useScroll();

  const handleScroll = useCallback((y: number) => {
    setScroll(y > 24);
  }, []);

  useMotionValueEvent(scrollY, 'change', handleScroll);

  useEffect(() => {
    handleScroll(window.scrollY);
  }, [handleScroll]);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
  };

  return (
    <nav className={`nav ${scroll ? 'scroll' : ''}`}>
      <div className="wrap">
        <div className="nav-inner">
          <a href="#top" className="brand" onClick={go('top')}>
            <span>jon</span>
            <span className="dot">.</span>
          </a>
          <div className="nav-links">
            {navItems.map((n: any) => (
              <a
                key={n.id}
                className="nav-link"
                href={n.href}
                onClick={n.href.startsWith('#') ? go(n.href.slice(1)) : undefined}
              >
                {n.label}
              </a>
            ))}
          </div>
          <div className="nav-right">
            <button
              className="icon-btn"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="theme"
            >
              {theme === 'dark' ? '☀' : '☾'}
            </button>
            <button className="btn btn-primary" onClick={onOpen}>
              {dictionary?.hero_cta || 'Bepul tahlil'} <span className="ar">↗</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
