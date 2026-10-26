'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { garland, flourish, BLOB_ROUND, BLOB_BREATHS, BLOB_LINES } from '@/lib/organic'
import { CONTACT } from '@/lib/entries'
import { chime, soundEnabled } from '@/lib/sound'

const RING = garland()
const SWASH = flourish()
const EASE = [0.22, 1, 0.36, 1] as const
const EXIT = [0.4, 0, 0.2, 1] as const
// A pen's pace: it eases in, travels steadily, and lifts gently.
const PEN = [0.45, 0, 0.25, 1] as const

const line = {
  hidden: { opacity: 0, y: 10, filter: 'blur(6px)' },
  show: (i: number) => ({
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.8, ease: EASE, delay: 0.95 + i * 0.09 },
  }),
  gone: { opacity: 0, transition: { duration: 0.14 } },
}

// The point where the axes cross. Everything on the plot is measured from
// here, so this is where she introduces herself.
export default function Origin({ quiet }: { quiet: boolean }) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [hour, setHour] = useState(0)
  const [from, setFrom] = useState({ x: 0, y: 0 })
  const [breathing, setBreathing] = useState(false)
  const knot = useRef<HTMLButtonElement>(null)
  const dialog = useRef<HTMLDivElement>(null)
  const close = useRef<HTMLButtonElement>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    setMounted(true)
    // The mark is turned to the hour in Seattle — a full turn a day.
    const h = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', hourCycle: 'h23', timeZone: 'America/Los_Angeles' })
      .formatToParts(new Date())
    const get = (t: string) => Number(h.find(p => p.type === t)?.value ?? 0)
    setHour(get('hour') + get('minute') / 60)
  }, [])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const t = setTimeout(() => close.current?.focus({ preventScroll: true }), 60)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') hide()
      if (e.key === 'Tab' && dialog.current) {
        const f = Array.from(dialog.current.querySelectorAll<HTMLElement>('a, button'))
        const first = f[0], last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => { clearTimeout(t); document.body.style.overflow = prev; window.removeEventListener('keydown', onKey) }
  }, [open])

  function show() {
    const r = knot.current!.getBoundingClientRect()
    setFrom({ x: r.left + r.width / 2 - window.innerWidth / 2, y: r.top + r.height / 2 - window.innerHeight / 2 })
    setBreathing(false)
    setOpen(true)
    if (soundEnabled()) chime()
  }
  function hide() {
    setOpen(false)
    knot.current?.focus({ preventScroll: true })
  }

  return (
    <>
      <button
        ref={knot}
        type="button"
        className="origin plot-anim"
        onClick={show}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="Who's plotting this? A note from Harshita."
        style={{
          position: 'absolute', left: '50%', top: '50%', zIndex: 5,
          width: '84px', height: '84px', margin: '-42px 0 0 -42px',
          padding: 0, border: 0, background: 'none', cursor: 'pointer',
          opacity: quiet ? 0 : 1, pointerEvents: quiet ? 'none' : 'auto',
          transition: 'opacity 0.18s ease',
        }}
      >
        <svg viewBox="0 0 84 84" width="84" height="84" aria-hidden style={{ display: 'block', overflow: 'visible' }}>
          <circle className="origin-disc" cx="42" cy="42" r="40" fill="var(--bg)" />
          <g className="origin-ring" data-open={open || undefined}>
            <g transform={`rotate(${hour * 15} 42 42)`}>
              <path className="origin-ink" d={RING} pathLength={1} fill="none" stroke="var(--ink)"
                strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </g>
        </svg>
        <span className="origin-cap" aria-hidden>(who&rsquo;s plotting this?)</span>
      </button>

      {mounted && createPortal(
        <AnimatePresence>
          {open && (
            <div key="hello" style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'grid', placeItems: 'center', overflow: 'hidden' }}>
              <motion.div
                aria-hidden
                onClick={hide}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } }}
                exit={{ opacity: 0, transition: { duration: 0.45, ease: EXIT, delay: 0.08 } }}
                style={{
                  position: 'absolute', inset: 0,
                  background: 'color-mix(in srgb, var(--bg) 58%, transparent)',
                  backdropFilter: 'blur(7px)', WebkitBackdropFilter: 'blur(7px)',
                }}
              />

              <motion.div
                ref={dialog}
                role="dialog"
                aria-modal="true"
                aria-labelledby="hello-name"
                initial={reduce ? { opacity: 0 } : { x: from.x, y: from.y, scale: 0.1, rotate: -9, opacity: 0 }}
                animate={{ x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 }}
                exit={reduce
                  ? { opacity: 0, transition: { duration: 0.2 } }
                  : { x: from.x, y: from.y, scale: 0.08, rotate: 7, opacity: 0, transition: { duration: 0.5, ease: EXIT, opacity: { duration: 0.28, delay: 0.22 } } }}
                transition={reduce ? { duration: 0.3 } : { type: 'spring', stiffness: 90, damping: 14, mass: 1, opacity: { duration: 0.25 } }}
                style={{ position: 'relative', width: 'min(440px, calc(100vw - 64px))', willChange: 'transform' }}
              >
                {/* The shape: a pressed petal of paper, breathing slowly, with a pencil line around it.
                    The shadow sits on its own still layer, so the breathing never re-blurs it. */}
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden style={{
                  position: 'absolute', left: '-36%', top: '-21%', width: '172%', height: '142%', overflow: 'visible',
                  filter: 'drop-shadow(0 26px 44px rgba(18,38,27,.17)) drop-shadow(0 2px 3px rgba(18,38,27,.06))',
                }}>
                  <path d={BLOB_BREATHS[0]} transform="translate(50 50) scale(.9) translate(-50 -50)" fill="var(--panel-bg)" />
                </svg>
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden style={{
                  position: 'absolute', left: '-36%', top: '-21%', width: '172%', height: '142%', overflow: 'visible',
                }}>
                  <motion.path
                    fill="var(--panel-bg)"
                    initial={{ d: BLOB_ROUND }}
                    animate={{ d: breathing ? [BLOB_BREATHS[0], BLOB_BREATHS[1], BLOB_BREATHS[2], BLOB_BREATHS[0]] : BLOB_BREATHS[0] }}
                    transition={breathing ? { duration: 18, ease: 'easeInOut', repeat: Infinity } : { duration: 1.2, ease: EASE }}
                    onAnimationComplete={() => setBreathing(true)}
                  />
                  <motion.path
                    fill="none" stroke="var(--ink)" strokeOpacity={0.38} strokeWidth={0.16}
                    strokeLinecap="round"
                    initial={{ d: BLOB_LINES[0], pathLength: 0, opacity: 1 }}
                    animate={{
                      pathLength: 1,
                      d: breathing ? [BLOB_LINES[0], BLOB_LINES[1], BLOB_LINES[2], BLOB_LINES[0]] : BLOB_LINES[0],
                    }}
                    exit={{ opacity: 0, transition: { duration: 0.15 } }}
                    transition={{
                      pathLength: { duration: 1.6, ease: PEN, delay: 0.3 },
                      d: breathing ? { duration: 21, ease: 'easeInOut', repeat: Infinity } : { duration: 0 },
                    }}
                  />
                </svg>

                <div className="hello-body" style={{ position: 'relative', padding: '4px 2px' }}>
                  <motion.button
                    ref={close}
                    type="button"
                    onClick={hide}
                    className="hello-close"
                    variants={line} custom={4} initial="hidden" animate="show" exit="gone"
                    style={{
                      position: 'absolute', top: 0, right: 0, padding: '4px 2px',
                      background: 'none', border: 0, cursor: 'pointer',
                      fontFamily: 'var(--font-courier)', fontSize: '12px', color: 'var(--ink-muted)',
                    }}
                  >
                    (close)
                  </motion.button>

                  <motion.p variants={line} custom={-4} initial="hidden" animate="show" exit="gone" style={{
                    margin: 0, fontFamily: 'var(--font-courier)', fontSize: '11.5px', color: 'var(--ink-faint)',
                  }}>
                    (0, 0) — the origin
                  </motion.p>

                  <motion.h2
                    id="hello-name"
                    className="hello-name"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.14 } }}
                    style={{
                      fontFamily: 'var(--font-script), "Snell Roundhand", cursive', fontWeight: 400,
                      fontVariationSettings: '"opsz" 72',
                      fontSize: 'clamp(40px, 7.4vw, 60px)', lineHeight: 1.2, color: 'var(--ink)',
                      margin: '14px -0.3em 0', padding: '0.12em 0.3em 0.22em',
                    }}
                  >
                    Harshita Shyale
                  </motion.h2>

                  <svg viewBox="0 0 150 22" width="150" height="22" aria-hidden style={{ display: 'block', margin: '-10px 0 14px 34%', overflow: 'visible' }}>
                    <motion.path
                      d={SWASH} fill="none" stroke="var(--ink-muted)" strokeWidth={1.2} strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      exit={{ opacity: 0, transition: { duration: 0.14 } }}
                      transition={{ pathLength: { duration: 1.1, ease: PEN, delay: 1.55 }, opacity: { duration: 0.1, delay: 1.55 } }}
                    />
                  </svg>

                  <motion.p variants={line} custom={0} initial="hidden" animate="show" exit="gone" style={{
                    margin: 0, fontFamily: 'var(--font-serif)', fontSize: '19px', lineHeight: 1.45, color: 'var(--ink)',
                    textWrap: 'pretty' as 'pretty',
                  }}>
                    Hello. I&rsquo;m a product designer and researcher in Seattle, and this is where the plot begins &mdash; everything on it is measured from here.
                  </motion.p>
                  <motion.p variants={line} custom={1} initial="hidden" animate="show" exit="gone" style={{
                    margin: '14px 0 0', fontFamily: 'var(--font-serif)', fontSize: '17px', lineHeight: 1.5, color: 'var(--ink-muted)',
                    textWrap: 'pretty' as 'pretty',
                  }}>
                    I care about the moment a person meets a machine: that they can understand it, and that they can still say no. About tools that leave the people using them a little more capable. And about noticing &mdash; the small thing in the room everyone else walked past.
                  </motion.p>
                  <motion.p variants={line} custom={2} initial="hidden" animate="show" exit="gone" style={{
                    margin: '14px 0 0', fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '17px', lineHeight: 1.5, color: 'var(--ink-muted)',
                    textWrap: 'pretty' as 'pretty',
                  }}>
                    Theatre and a camera came first. Both taught me to watch a room before I try to change it.
                  </motion.p>

                  <motion.p variants={line} custom={3} initial="hidden" animate="show" exit="gone" style={{
                    margin: '20px 0 0', fontFamily: 'var(--font-courier)', fontSize: '11.5px', lineHeight: 1.7, color: 'var(--ink-faint)',
                  }}>
                    now — Salesloft · before — GitHub, HPE, Nutanix<br />M.S. in Human Centered Design, University of Washington
                  </motion.p>

                  <motion.div variants={line} custom={4} initial="hidden" animate="show" exit="gone" style={{
                    display: 'flex', flexWrap: 'wrap', gap: '6px 18px', marginTop: '14px',
                    fontFamily: 'var(--font-courier)', fontSize: '12px',
                  }}>
                    <Link href="/about" className="hello-link">(the longer version →)</Link>
                    <Link href="/resume" className="hello-link">(résumé)</Link>
                    <a href={`mailto:${CONTACT.email}`} className="hello-link">{CONTACT.email}</a>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body,
      )}

      <style>{`
        .origin-disc { animation: fade-in 500ms ease 520ms both; }
        .origin-ink { stroke-dasharray: 1; stroke-dashoffset: 1; animation: pen 2.4s cubic-bezier(.45,0,.25,1) 760ms forwards; }
        @keyframes pen { to { stroke-dashoffset: 0; } }
        .origin-ring { transform-origin: 42px 42px; transition: transform 0.9s cubic-bezier(.22,1,.36,1), opacity 0.4s ease; }
        .origin-ring[data-open] { transform: rotate(150deg) scale(.35); opacity: 0; transition: transform 0.55s cubic-bezier(.4,0,.2,1), opacity 0.35s ease; }
        .origin-cap {
          position: absolute; left: 50%; top: calc(100% + 6px); transform: translate(-50%, -3px);
          white-space: nowrap; font-family: var(--font-courier); font-size: 11.5px; color: var(--ink-muted);
          opacity: 0; filter: blur(3px); pointer-events: none;
          transition: opacity 0.3s ease, filter 0.42s cubic-bezier(.22,1,.36,1), transform 0.42s cubic-bezier(.22,1,.36,1);
        }
        @media (hover: hover) {
          .origin:hover .origin-ring:not([data-open]) { transform: rotate(18deg) scale(1.07); }
          .origin:hover .origin-cap { opacity: 1; filter: blur(0); transform: translate(-50%, 0); }
          .hello-link:hover, .hello-close:hover { color: var(--ink) !important; text-decoration: underline; text-underline-offset: 4px; text-decoration-thickness: 1px; }
        }
        @media (max-width: 760px) { .origin { transform: scale(.78); } }
        .origin:focus-visible { outline: none; }
        .hello-close:focus-visible, .hello-link:focus-visible { outline: 1px dashed var(--ink); outline-offset: 3px; border-radius: 2px; }
        .origin:focus-visible .origin-cap { opacity: 1; filter: blur(0); transform: translate(-50%, 0); }
        .origin:focus-visible .origin-disc { stroke: var(--ink); stroke-width: 1; stroke-dasharray: 2 3; }
        @media (max-height: 740px) { .hello-body { max-height: calc(100vh - 72px); overflow: hidden auto; padding: 4px 0.4em !important; margin: 0 -0.4em; } }
        .hello-link { color: var(--ink-muted); text-decoration: none; transition: color .16s ease; }
        .hello-name {
          -webkit-mask-image: linear-gradient(90deg, #000 0 33.3%, transparent 40% 100%);
                  mask-image: linear-gradient(90deg, #000 0 33.3%, transparent 40% 100%);
          -webkit-mask-size: 300% 100%; mask-size: 300% 100%;
          -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat;
          animation: ink-write 1.7s cubic-bezier(.45,0,.25,1) 420ms both;
        }
        @keyframes ink-write {
          from { -webkit-mask-position: 100% 0; mask-position: 100% 0; }
          to   { -webkit-mask-position: 0 0;    mask-position: 0 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .origin-ink, .origin-disc, .hello-name { animation: none !important; stroke-dashoffset: 0; -webkit-mask-image: none; mask-image: none; }
        }
      `}</style>
    </>
  )
}
