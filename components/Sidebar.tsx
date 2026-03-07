'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import Link from 'next/link';

const NAV_LINKS = [
  { label: 'Work', href: '#work' },
  { label: 'Odds & Ends', href: '#odds' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="8" cy="8" r="3" />
      <line x1="8" y1="1" x2="8" y2="3" />
      <line x1="8" y1="13" x2="8" y2="15" />
      <line x1="1" y1="8" x2="3" y2="8" />
      <line x1="13" y1="8" x2="15" y2="8" />
      <line x1="2.93" y1="2.93" x2="4.34" y2="4.34" />
      <line x1="11.66" y1="11.66" x2="13.07" y2="13.07" />
      <line x1="13.07" y1="2.93" x2="11.66" y2="4.34" />
      <line x1="4.34" y1="11.66" x2="2.93" y2="13.07" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M13.5 9.5A6 6 0 016.5 2.5a6 6 0 000 11 6 6 0 007-4z" />
    </svg>
  );
}

export default function Sidebar() {
  const [visible, setVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const hero = document.getElementById('hero-canvas-wrapper');
    if (!hero) return;

    const obs = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0.1 }
    );
    obs.observe(hero);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const sections = ['work', 'odds', 'about', 'contact'];
    const observers: IntersectionObserver[] = [];

    sections.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { threshold: 0.3 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '48px',
        zIndex: 100,
        background: 'var(--bg)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 40px',
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'all' : 'none',
        transition: 'opacity 0.4s ease',
      }}
    >
      <Link
        href="/"
        style={{
          fontFamily: 'var(--font-playfair, serif)',
          fontSize: '15px',
          color: 'var(--ink)',
          textDecoration: 'none',
        }}
      >
        HS
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        {NAV_LINKS.map(link => (
          <NavLink
            key={link.href}
            href={link.href}
            label={link.label}
            active={activeSection === link.href.replace('#', '')}
          />
        ))}

        {mounted && (
          <button
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--ink-muted)',
              display: 'flex',
              alignItems: 'center',
              padding: '4px',
              transition: 'color 0.2s ease',
            }}
            aria-label="Toggle dark mode"
          >
            {resolvedTheme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
        )}
      </div>
    </nav>
  );
}

function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: 'var(--font-ibm-plex-mono, monospace)',
        fontSize: '11px',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        color: 'var(--ink)',
        textDecoration: 'none',
        position: 'relative',
        paddingBottom: '2px',
      }}
    >
      {label}
      <span
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: '1px',
          background: 'var(--ink)',
          width: active || hovered ? '100%' : '0%',
          transition: 'width 0.25s ease',
        }}
      />
    </a>
  );
}
