'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PasswordGateProps {
  children: React.ReactNode;
  password?: string;
}

export default function PasswordGate({ children, password = 'salesloft' }: PasswordGateProps) {
  const [unlocked, setUnlocked] = useState(false);
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value === password) {
      setUnlocked(true);
    } else {
      setError(true);
      setValue('');
      setTimeout(() => setError(false), 2000);
      inputRef.current?.focus();
    }
  };

  return (
    <AnimatePresence mode="wait">
      {unlocked ? (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      ) : (
        <motion.div
          key="gate"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg)',
          }}
        >
          <div style={{ textAlign: 'center', maxWidth: '320px', width: '100%', padding: '0 24px' }}>
            <p
              style={{
                fontFamily: 'var(--font-playfair, serif)',
                fontSize: '20px',
                fontStyle: 'italic',
                color: 'var(--ink)',
                marginBottom: '32px',
                lineHeight: 1.5,
              }}
            >
              This case study is password protected.
            </p>

            <form onSubmit={handleSubmit}>
              <input
                ref={inputRef}
                type="password"
                value={value}
                onChange={e => setValue(e.target.value)}
                placeholder="enter password"
                autoFocus
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: `1px solid ${error ? 'var(--accent)' : 'var(--border)'}`,
                  borderRadius: 0,
                  padding: '10px 12px',
                  fontFamily: 'var(--font-ibm-plex-mono, monospace)',
                  fontSize: '12px',
                  color: 'var(--ink)',
                  outline: 'none',
                  transition: 'border-color 0.2s ease',
                  boxSizing: 'border-box',
                }}
              />

              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{
                      fontFamily: 'var(--font-ibm-plex-mono, monospace)',
                      fontSize: '10px',
                      color: 'var(--ink-faint)',
                      marginTop: '8px',
                      marginBottom: 0,
                    }}
                  >
                    incorrect
                  </motion.p>
                )}
              </AnimatePresence>

              <SubmitButton />
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SubmitButton() {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="submit"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        marginTop: '16px',
        width: '100%',
        padding: '10px 12px',
        fontFamily: 'var(--font-ibm-plex-mono, monospace)',
        fontSize: '11px',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        border: '1px solid var(--ink)',
        background: hovered ? 'var(--ink)' : 'transparent',
        color: hovered ? 'var(--bg)' : 'var(--ink)',
        cursor: 'pointer',
        transition: 'background 0.2s ease, color 0.2s ease',
      }}
    >
      Enter
    </button>
  );
}
