'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';

interface Section {
  label: string;
  body: React.ReactNode;
}

interface ProjectShellProps {
  title: string;
  description: string;
  sections: Section[];
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="8" cy="8" r="3" />
      <line x1="8" y1="1" x2="8" y2="3" /><line x1="8" y1="13" x2="8" y2="15" />
      <line x1="1" y1="8" x2="3" y2="8" /><line x1="13" y1="8" x2="15" y2="8" />
      <line x1="2.93" y1="2.93" x2="4.34" y2="4.34" /><line x1="11.66" y1="11.66" x2="13.07" y2="13.07" />
      <line x1="13.07" y1="2.93" x2="11.66" y2="4.34" /><line x1="4.34" y1="11.66" x2="2.93" y2="13.07" />
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

export default function ProjectShell({ title, description, sections }: ProjectShellProps) {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [collapseActive, setCollapseActive] = useState(false);
  const [circleR, setCircleR] = useState(0);
  const animRef = useRef<number>(0);

  useEffect(() => setMounted(true), []);

  const handleBack = () => {
    const maxR = Math.hypot(window.innerWidth, window.innerHeight) * 1.1;

    setCircleR(maxR);
    setCollapseActive(true);

    const start = performance.now();
    const animate = (now: number) => {
      const t = Math.min((now - start) / 600, 1);
      const eased = t * t * (3 - 2 * t); // smoothstep
      const r = maxR * (1 - eased);
      setCircleR(r);
      if (t < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        router.push('/');
      }
    };
    animRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => () => cancelAnimationFrame(animRef.current), []);

  const dotX = typeof window !== 'undefined'
    ? parseFloat(sessionStorage.getItem('clickedDotX') || '0') || window.innerWidth / 2
    : 0;
  const dotY = typeof window !== 'undefined'
    ? parseFloat(sessionStorage.getItem('clickedDotY') || '0') || window.innerHeight / 2
    : 0;

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--ink)' }}>
      {/* Collapse circle overlay */}
      {collapseActive && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            pointerEvents: 'none',
            overflow: 'hidden',
          }}
        >
          <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
            <defs>
              <mask id="collapse-mask">
                <rect width="100%" height="100%" fill="white" />
                <circle cx={dotX} cy={dotY} r={circleR} fill="black" />
              </mask>
            </defs>
            <rect
              width="100%" height="100%"
              fill="var(--bg)"
              mask="url(#collapse-mask)"
            />
          </svg>
        </div>
      )}

      {/* Top bar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        height: '48px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', padding: '0 40px',
        background: 'var(--bg)', borderBottom: '1px solid var(--border)',
        backdropFilter: 'blur(8px)',
      }}>
        <button
          onClick={handleBack}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: 'var(--font-ibm-plex-mono, monospace)',
            fontSize: '12px', color: 'var(--ink-muted)',
            display: 'flex', alignItems: 'center', gap: '6px',
          }}
        >
          ← Back
        </button>
        <span style={{ fontFamily: 'var(--font-playfair, serif)', fontSize: '15px', color: 'var(--ink)' }}>
          HS
        </span>
        {mounted && (
          <button
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-muted)' }}
            aria-label="Toggle theme"
          >
            {resolvedTheme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
        )}
      </div>

      {/* Hero */}
      <div style={{ padding: '80px 72px 48px', maxWidth: '1100px' }}>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            fontFamily: 'var(--font-playfair, serif)',
            fontSize: '52px',
            fontWeight: 400,
            lineHeight: 1.1,
            marginBottom: '20px',
            color: 'var(--ink)',
          }}
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            fontFamily: 'var(--font-ibm-plex-mono, monospace)',
            fontSize: '13px',
            color: 'var(--ink-muted)',
            maxWidth: '560px',
            lineHeight: 1.7,
          }}
        >
          {description}
        </motion.p>
      </div>

      {/* Full-width placeholder media */}
      <MediaPlaceholder label="Hero image / prototype video" />

      {/* Sections */}
      {sections.map((section, i) => (
        <div key={i}>
          <SectionBlock label={section.label} body={section.body} />
          {i < sections.length - 1 && <MediaPlaceholder label={`Section ${i + 1} visual`} />}
        </div>
      ))}

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '28px 72px',
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '80px',
      }}>
        <span style={{ fontFamily: 'var(--font-ibm-plex-mono, monospace)', fontSize: '11px', color: 'var(--ink-faint)' }}>
          Designed & developed by Harshita · © 2025
        </span>
        <span style={{ fontFamily: 'var(--font-ibm-plex-mono, monospace)', fontSize: '11px', color: 'var(--ink-faint)' }}>
          harshitashyale.com
        </span>
      </footer>
    </div>
  );
}

function MediaPlaceholder({ label }: { label: string }) {
  return (
    <div style={{
      width: '100%',
      aspectRatio: '16/6',
      background: 'var(--bg-subtle)',
      backgroundImage: 'repeating-linear-gradient(45deg, var(--border) 0, var(--border) 1px, transparent 0, transparent 50%)',
      backgroundSize: '16px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0',
    }}>
      <span style={{
        fontFamily: 'var(--font-ibm-plex-mono, monospace)',
        fontSize: '11px',
        color: 'var(--ink-faint)',
      }}>
        {label}
      </span>
    </div>
  );
}

function SectionBlock({ label, body }: { label: string; body: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      style={{
        display: 'grid',
        gridTemplateColumns: '200px 1fr',
        gap: '64px',
        padding: '64px 72px',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div style={{
        fontFamily: 'var(--font-ibm-plex-mono, monospace)',
        fontSize: '11px',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        color: 'var(--ink-faint)',
        paddingTop: '4px',
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: 'var(--font-ibm-plex-mono, monospace)',
        fontSize: '13px',
        color: 'var(--ink-muted)',
        lineHeight: 1.85,
        maxWidth: '640px',
      }}>
        {body}
      </div>
    </motion.div>
  );
}
