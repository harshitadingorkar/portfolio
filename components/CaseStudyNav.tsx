'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'

const PROJECTS = [
  { id: 'influence', title: 'Influence Graph',      route: '/work/influence-graph'      },
  { id: 'ai_email',  title: 'AI Email Assistant',   route: '/work/ai-email-assistant'   },
  { id: 'github',    title: 'GitHub Pull Requests', route: '/work/github'               },
  { id: 'sony',      title: 'Sony',                 route: '/work/sony'                 },
]

function DotDivider() {
  return (
    <div style={{
      borderTop: '1px dotted var(--border)',
      margin: '4px 0',
    }} />
  )
}

function PlusIcon({ open }: { open: boolean }) {
  return (
    <motion.svg
      animate={{ rotate: open ? 45 : 0 }}
      transition={{ duration: 0.22 }}
      width="10" height="10" viewBox="0 0 10 10" fill="none"
      style={{ display: 'block', flexShrink: 0 }}
    >
      <line x1="5" y1="1" x2="5" y2="9" stroke="var(--ink-faint)" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="1" y1="5" x2="9" y2="5" stroke="var(--ink-faint)" strokeWidth="1.3" strokeLinecap="round" />
    </motion.svg>
  )
}

export default function CaseStudyNav({ currentRoute }: { currentRoute?: string }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [workOpen, setWorkOpen] = useState(true)
  const panelRef = useRef<HTMLDivElement>(null)

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open])

  // Close on click-outside
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    window.addEventListener('mousedown', handler, true)
    return () => window.removeEventListener('mousedown', handler, true)
  }, [open])

  return (
    <motion.div
      ref={panelRef}
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      style={{ position: 'fixed', right: '32px', top: '32px', zIndex: 50 }}
    >
      <AnimatePresence mode="wait">
        {!open ? (
          /* ── Pill (collapsed) ── */
          <motion.button
            key="pill"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            onClick={() => setOpen(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              height: '36px', padding: '0 14px',
              background: 'var(--panel-bg)',
              border: '1px solid var(--border)',
              borderRadius: '2px',
              backdropFilter: 'blur(8px)',
              cursor: 'pointer',
              fontFamily: 'var(--font-ibm-plex-mono)',
              fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase',
              color: 'var(--ink)',
              transition: 'border-color 0.2s ease',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--ink)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)' }}
          >
            <svg width="5" height="5" viewBox="0 0 5 5" fill="none" style={{ flexShrink: 0 }}>
              <circle cx="2.5" cy="2.5" r="2.5" fill="#c84b2f" />
            </svg>
            Index
            <PlusIcon open={false} />
          </motion.button>
        ) : (
          /* ── Expanded panel ── */
          <motion.div
            key="panel"
            initial={{ opacity: 0, scale: 0.97, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -4 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            style={{
              width: '240px',
              background: 'var(--panel-bg)',
              border: '1px solid var(--border)',
              borderRadius: '2px',
              backdropFilter: 'blur(8px)',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 14px',
              borderBottom: '1px solid var(--border)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                <svg width="5" height="5" viewBox="0 0 5 5" fill="none">
                  <circle cx="2.5" cy="2.5" r="2.5" fill="#c84b2f" />
                </svg>
                <span style={{
                  fontFamily: 'var(--font-ibm-plex-mono)',
                  fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: 'var(--ink)',
                }}>
                  Index
                </span>
              </div>
              <button
                onClick={() => setOpen(false)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '2px', color: 'var(--ink-faint)',
                }}
                aria-label="Close index"
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <line x1="1.5" y1="1.5" x2="8.5" y2="8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                  <line x1="8.5" y1="1.5" x2="1.5" y2="8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* WORK accordion */}
            <div style={{ padding: '4px 0' }}>
              <button
                onClick={() => setWorkOpen(v => !v)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '7px 14px', background: 'none', border: 'none', cursor: 'pointer',
                }}
              >
                <span style={{
                  fontFamily: 'var(--font-ibm-plex-mono)',
                  fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: 'var(--ink-faint)',
                }}>
                  Work
                </span>
                <PlusIcon open={workOpen} />
              </button>

              {/* Accordion body */}
              <div style={{
                display: 'grid',
                gridTemplateRows: workOpen ? '1fr' : '0fr',
                transition: 'grid-template-rows 0.25s ease',
              }}>
                <div style={{ overflow: 'hidden' }}>
                  {PROJECTS.map(p => {
                    const isCurrent = currentRoute === p.route
                    return (
                      <button
                        key={p.id}
                        onClick={() => { router.push(p.route); setOpen(false) }}
                        style={{
                          width: '100%', textAlign: 'left',
                          padding: '7px 14px 7px 22px',
                          background: 'none', border: 'none', cursor: 'pointer',
                          fontFamily: 'var(--font-ibm-plex-mono)',
                          fontSize: '11px',
                          color: isCurrent ? 'var(--ink)' : 'var(--ink-muted)',
                          display: 'flex', alignItems: 'center', gap: '7px',
                          transition: 'color 0.15s ease',
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--ink)' }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = isCurrent ? 'var(--ink)' : 'var(--ink-muted)' }}
                      >
                        {isCurrent && (
                          <svg width="4" height="4" viewBox="0 0 4 4" fill="none" style={{ flexShrink: 0 }}>
                            <circle cx="2" cy="2" r="2" fill="#c84b2f" />
                          </svg>
                        )}
                        {p.title}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            <DotDivider />

            {/* Home link */}
            <button
              onClick={() => router.push('/')}
              style={{
                width: '100%', textAlign: 'left',
                padding: '9px 14px',
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-ibm-plex-mono)',
                fontSize: '10px', letterSpacing: '0.06em',
                color: 'var(--ink-muted)',
                display: 'flex', alignItems: 'center', gap: '6px',
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--ink)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--ink-muted)' }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M8 3L4 6L8 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Home
            </button>

          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
