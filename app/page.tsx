'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Field from '@/components/Field'
import QuietList from '@/components/QuietList'
import RightPanel from '@/components/RightPanel'
import HoverImages, { type HoverState } from '@/components/HoverImages'
import { greetingMessage } from '@/components/PatronGreeting'
import {
  getOrCreatePatron, hasVisitedBefore, getLastVisit, markVisited, setLastVisit,
  mulberry32, hashString,
} from '@/lib/patronus'
import { soundEnabled, setSoundEnabled, chime, wakeOnFirstGesture } from '@/lib/sound'
import type { Visitor } from '@/lib/entries'

type View = 'plot' | 'text'

const HER_TZ = 'America/Los_Angeles'
function timeIn(d: Date, timeZone?: string) {
  return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZone })
    .format(d).toLowerCase().replace(/\s/g, ' ')
}
function clockLine(d: Date) {
  const hers = timeIn(d, HER_TZ)
  const yours = timeIn(d)
  return hers === yours ? `seattle ${hers} — your time too` : `seattle ${hers} · you, ${yours}`
}
const VIEW_KEY = 'view_mode'
// dmcg.co's curve: a long, soft deceleration.
const EASE = [0.22, 1, 0.36, 1] as const

// Read the visit once per page load, then record it — module-level so React's
// dev double-mount (or coming back from a case study) can't turn a first visit
// into "back so soon".
let visitorOnce: Visitor | null = null
function readVisitor(): Visitor {
  if (visitorOnce) return visitorOnce
  const first = !hasVisitedBefore()
  const last = getLastVisit()
  const patron = getOrCreatePatron()
  const r = mulberry32(hashString(patron.id) ^ 0x5eed)
  visitorOnce = {
    name: patron.name,
    animal: patron.animal,
    greeting: greetingMessage(patron.name, first ? null : last ? Date.now() - last : null),
    createdAt: patron.createdAt,
    // Visitors are something gathered, and they pulled — gather · wonder, bottom left.
    x: -(0.3 + r() * 0.48),
    y: -(0.32 + r() * 0.4),
  }
  markVisited()
  setLastVisit()
  return visitorOnce
}

export default function HomePage() {
  const router = useRouter()
  const [revealed, setRevealed] = useState(false)
  const [view, setView] = useState<View>('plot')
  const [wide, setWide] = useState(true)
  const [visitor, setVisitor] = useState<Visitor | null>(null)
  const [sound, setSound] = useState(false)
  const [hover, setHover] = useState<HoverState>(null)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    setWide(mq.matches)
    const onMq = () => setWide(mq.matches)
    mq.addEventListener('change', onMq)

    const saved = localStorage.getItem(VIEW_KEY)
    if (saved === 'text' || saved === 'list') setView('text')
    else if (saved !== 'plot' && saved !== 'field' && !mq.matches) setView('text')

    setVisitor(readVisitor())
    setSound(soundEnabled())
    const sleep = wakeOnFirstGesture()

    // The opening pause can always be skipped — click or any key.
    const reveal = () => setRevealed(true)
    const pause = setTimeout(reveal, 1400)
    window.addEventListener('pointerdown', reveal, { once: true })
    window.addEventListener('keydown', reveal, { once: true })
    return () => {
      clearTimeout(pause); sleep(); mq.removeEventListener('change', onMq)
      window.removeEventListener('pointerdown', reveal)
      window.removeEventListener('keydown', reveal)
    }
  }, [])

  // Her time beside yours — updated each half minute.
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => {
    setNow(new Date())
    const t = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(t)
  }, [])

  function choose(next: View) {
    setView(next)
    setHover(null)
    setExpanded(null)
    localStorage.setItem(VIEW_KEY, next)
  }

  function toggleSound() {
    const next = !sound
    setSound(next)
    setSoundEnabled(next)
    if (next) chime()
  }

  const control = (active: boolean) => ({
    background: 'none', border: 'none', padding: 0, cursor: 'pointer',
    fontFamily: 'var(--font-courier)', fontSize: '12px',
    color: active ? 'var(--ink)' : 'var(--ink-faint)',
    transition: 'color 150ms ease',
  })
  const link = {
    fontFamily: 'var(--font-courier)', fontSize: '12px', color: 'var(--ink-muted)',
    textDecoration: 'none',
  }

  return (
    <main style={{ position: 'relative', minHeight: '100vh', background: 'var(--bg)', overflowX: 'hidden' }}>
      {/* ── Tagline: alone at first, then it settles into the corner ── */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '100vh',
        display: 'flex',
        alignItems: revealed ? 'flex-start' : 'center',
        justifyContent: revealed ? 'flex-start' : 'center',
        padding: revealed ? '30px 40px' : '0 24px',
        pointerEvents: 'none', zIndex: 5,
      }}>
        <motion.h1
          layout
          transition={{ layout: { duration: 0.9, ease: EASE } }}
          style={{
            fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400,
            fontSize: revealed ? 'clamp(18px, 1.8vw, 22px)' : 'clamp(24px, 5.6vw, 68px)',
            letterSpacing: '-0.01em',
            color: 'var(--ink)', margin: 0, whiteSpace: 'nowrap', lineHeight: 1.15,
          }}
        >
          everything Harshita notices and makes
        </motion.h1>
      </div>

      {/* ── The one stage direction the opening needs ── */}
      {!revealed && (
        <button
          onClick={() => setRevealed(true)}
          style={{
            position: 'absolute', left: '50%', bottom: '40px', transform: 'translateX(-50%)',
            background: 'none', border: 'none', cursor: 'pointer', padding: '6px',
            fontFamily: 'var(--font-courier)', fontSize: '12px', color: 'var(--ink-faint)',
            animation: 'fade-in 600ms ease 500ms both',
          }}
        >
          (skip)
        </button>
      )}

      {revealed && (
        <>
          {/* ── Her time, and yours ── */}
          {now && (
            <p className="plot-anim clock" style={{
              position: 'absolute', top: '64px', left: '40px', zIndex: 6, margin: 0,
              fontFamily: 'var(--font-courier)', fontSize: '11.5px', color: 'var(--ink-faint)',
              animation: 'settle-in 700ms cubic-bezier(.22,1,.36,1) 400ms both',
            }}>
              {clockLine(now)}
            </p>
          )}

          {/* ── Top right: how to read it ── */}
          <nav className="plot-anim top-nav" aria-label="View" style={{
            position: 'absolute', top: '36px', right: '40px', zIndex: 20,
            display: 'flex', gap: '10px', alignItems: 'baseline',
            animation: 'settle-in 700ms cubic-bezier(.22,1,.36,1) 300ms both',
          }}>
            <button onClick={() => choose('plot')} aria-pressed={view === 'plot'} style={control(view === 'plot')}>plot</button>
            <span aria-hidden style={{ color: 'var(--ink-faint)', fontSize: '12px' }}>/</span>
            <button onClick={() => choose('text')} aria-pressed={view === 'text'} style={control(view === 'text')}>as text</button>
            <span aria-hidden style={{ width: '20px' }} />
            <button
              onClick={toggleSound}
              aria-pressed={sound}
              title="each point has a note — higher on the plot, higher in pitch; further right, further in your right ear"
              style={control(sound)}
            >
              (sound {sound ? 'on' : 'off'})
            </button>
          </nav>

          {view === 'plot' ? (
            <div style={{ position: 'relative', height: 'max(100vh, 760px)' }}>
              <div className="plot-box" style={{ position: 'absolute', top: '76px', bottom: '58px', left: 0, right: 0 }}>
                <Field visitor={visitor} />
              </div>
            </div>
          ) : wide ? (
            <div style={{ height: '100vh' }}>
              <HoverImages hoverState={hover} expandedProjectId={expanded} />
              <RightPanel
                onHoverChange={setHover}
                onProjectExpand={setExpanded}
                onNavigate={route => router.push(route)}
              />
            </div>
          ) : (
            <div style={{ padding: '124px 0 112px' }}>
              <QuietList visitor={visitor} />
            </div>
          )}

          {/* ── Bottom right: the rest of the house ── */}
          <nav className="plot-anim" aria-label="Pages" style={{
            position: 'absolute', right: '40px', bottom: '30px', zIndex: 20,
            display: 'flex', gap: '18px', alignItems: 'baseline',
            background: 'var(--bg)', padding: '4px 0 4px 10px',
            animation: 'settle-in 700ms cubic-bezier(.22,1,.36,1) 500ms both',
          }}>
            <Link href="/about" className="corner-link" style={link}>about</Link>
            <Link href="/writing" className="corner-link" style={link}>writing</Link>
            <Link href="/resume" className="corner-link" style={link}>résumé</Link>
          </nav>
        </>
      )}

      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes settle-in { from { opacity: 0; filter: blur(8px); transform: scale(1.012); } to { opacity: 1; filter: blur(0); transform: none; } }
        @media (hover: hover) { .corner-link:hover { color: var(--ink) !important; text-decoration: underline; text-underline-offset: 4px; text-decoration-thickness: 1px; } }
        @media (max-width: 760px) { .top-nav { top: 92px !important; right: auto !important; left: 40px; } .plot-box { top: 124px !important; } }
      `}</style>
    </main>
  )
}
