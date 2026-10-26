'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import Plate from '@/components/Plate'
import Origin from '@/components/Origin'
import { ENTRIES, AXIS, AXIS_GLOSS, CAPTION, countAt, svSection, type Entry, type Pole, type Visitor } from '@/lib/entries'
import { pluck } from '@/lib/sound'
import { timeAgo } from '@/lib/patronus'

// Plot geometry, in percent of the plot box from its center. Wide and confident:
// the axes run nearly edge to edge, and their words sit just past the ends.
const XS = 40
const YS = 41
const GX = 'clamp(78px, 7vw, 112px)' // from the box's side to the end of the x axis
const GY = '34px'                     // from the box's top/bottom to the ends of the y axis
const left = (x: number) => `${50 + x * XS}%`
const top = (y: number) => `${50 - y * YS}%`

// dmcg.co's motion: one long, soft deceleration for every arrival; a plainer,
// quicker curve for leaving.
const EASE_OUT = 'cubic-bezier(.22, 1, .36, 1)'
const EASE_OUT_ARR = [0.22, 1, 0.36, 1] as const
const EASE_EXIT_ARR = [0.4, 0, 0.2, 1] as const
const AXIS_MS = 700

function dispatch(name: string, detail?: Record<string, unknown>) {
  window.dispatchEvent(new CustomEvent(name, { detail }))
}

type Point = Entry & { isVisitor?: boolean; animal?: string }

// ── Axis word — small, just past the end of its line; a fuller card on hover ──
function AxisWord({ pole, visitor, style, card }: {
  pole: Pole
  visitor: boolean
  style: React.CSSProperties
  card: React.CSSProperties
}) {
  const [open, setOpen] = useState(false)
  const n = countAt(pole, visitor)

  return (
    <div
      tabIndex={0}
      className="plot-anim axis-word"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      aria-label={`${pole}: ${AXIS[pole].definition}`}
      style={{
        position: 'absolute', zIndex: open ? 60 : 3,
        cursor: 'default', whiteSpace: 'nowrap', outline: 'none',
        fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '17px', lineHeight: 1,
        color: 'var(--ink)',
        animation: `fade-in 700ms ${EASE_OUT} ${AXIS_MS - 200}ms both`,
        ...style,
      }}
    >
      {pole}
      <div aria-hidden style={{
        position: 'absolute', ...card, width: '250px', whiteSpace: 'normal', textAlign: 'left', fontStyle: 'normal',
        padding: '14px 16px 15px', background: 'var(--panel-bg)', borderRadius: '3px',
        boxShadow: '0 0 0 1px rgba(18,38,27,.08), 0 16px 40px -12px rgba(18,38,27,.24)',
        opacity: open ? 1 : 0, filter: open ? 'blur(0)' : 'blur(4px)',
        transform: open ? 'translateY(0)' : 'translateY(4px)',
        transition: `opacity 0.3s ease, filter 0.42s ${EASE_OUT}, transform 0.42s ${EASE_OUT}`,
        pointerEvents: 'none',
      }}>
        <div style={{ fontFamily: 'var(--font-courier)', fontSize: '11px', color: 'var(--ink-faint)', marginBottom: '7px' }}>
          {AXIS_GLOSS[pole]} · {n} {n === 1 ? 'thing' : 'things'}
        </div>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: '17px', lineHeight: 1.35, color: 'var(--ink)' }}>
          {AXIS[pole].definition}
        </div>
        <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '15px', lineHeight: 1.4, color: 'var(--ink-muted)', marginTop: '7px' }}>
          lives here: {AXIS[pole].lives}
        </div>
      </div>
    </div>
  )
}

// An open arrowhead at the end of an axis, drawn in the same 2px ink.
function Head({ dir, style }: { dir: 'up' | 'down' | 'left' | 'right'; style: React.CSSProperties }) {
  const rot = { right: 0, down: 90, left: 180, up: 270 }[dir]
  return (
    <svg className="plot-anim" aria-hidden width="14" height="14" viewBox="0 0 14 14" style={{
      position: 'absolute', zIndex: 1, overflow: 'visible',
      animation: `fade-in 400ms ease ${AXIS_MS - 150}ms both`, ...style,
    }}>
      <path d="M3 2.5 L11 7 L3 11.5" transform={`rotate(${rot} 7 7)`} fill="none" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function Field({ visitor }: { visitor: Visitor | null }) {
  const [active, setActive] = useState<string | null>(null)
  const [greeting, setGreeting] = useState(true)
  const [figW, setFigW] = useState(560)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const t = setTimeout(() => setGreeting(false), 6500)
    const size = () => setFigW(Math.round(Math.min(640, Math.max(280, window.innerWidth * 0.42))))
    size()
    window.addEventListener('resize', size)
    return () => { clearTimeout(t); window.removeEventListener('resize', size) }
  }, [])

  const points: Point[] = useMemo(() => {
    const all: Point[] = [...ENTRIES]
    if (visitor) {
      all.push({
        id: 'you',
        title: 'you',
        meta: `${visitor.name} · gathered ${timeAgo(visitor.createdAt)}`,
        line: visitor.greeting,
        x: visitor.x,
        y: visitor.y,
        isVisitor: true,
        animal: visitor.animal,
        plate: { alt: `[Your creature — ${visitor.animal} — drawn in scattered dots.]` },
      })
    }
    // Plot closest-to-origin first, so the field spreads outward like ink.
    return all.sort((a, b) => Math.hypot(a.x, a.y) - Math.hypot(b.x, b.y))
  }, [visitor])

  const activePoint = points.find(p => p.id === active) ?? null

  function hold() {
    if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null }
  }
  function open(p: Point) {
    hold()
    if (active !== p.id) {
      setActive(p.id)
      pluck(p.x, p.y)
      dispatch('sv:project-hover', { id: p.id })
      dispatch('sv:section', { section: svSection(p) })
    }
  }
  // A short grace period, so the pointer can travel from a dot onto its image.
  function release() {
    hold()
    closeTimer.current = setTimeout(() => {
      setActive(null)
      dispatch('sv:project-hover-end')
    }, 200)
  }
  useEffect(() => () => hold(), [])

  const figH = Math.round(figW * 0.66)

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }} aria-label="A plot of Harshita's work. Left to right: wonder to work. Bottom to top: gather to make.">
      {/* ── Axes: heavy, solid ink, running nearly to the edges ── */}
      <div className="plot-anim" aria-hidden style={{
        position: 'absolute', zIndex: 1, top: 'calc(50% - 1px)', left: GX, right: GX,
        height: '2px', background: 'var(--ink)', animation: `axis-x ${AXIS_MS}ms ${EASE_OUT} both`,
      }} />
      <div className="plot-anim" aria-hidden style={{
        position: 'absolute', zIndex: 1, left: 'calc(50% - 1px)', top: GY, bottom: GY,
        width: '2px', background: 'var(--ink)', animation: `axis-y ${AXIS_MS}ms ${EASE_OUT} both`,
      }} />
      <Head dir="right" style={{ right: `calc(${GX} - 3px)`, top: 'calc(50% - 7px)' }} />
      <Head dir="left" style={{ left: `calc(${GX} - 3px)`, top: 'calc(50% - 7px)' }} />
      <Head dir="up" style={{ top: `calc(${GY} - 3px)`, left: 'calc(50% - 7px)' }} />
      <Head dir="down" style={{ bottom: `calc(${GY} - 3px)`, left: 'calc(50% - 7px)' }} />
      {[-0.5, 0.5].map(v => (
        <div key={`tx${v}`} className="plot-anim" aria-hidden style={{
          position: 'absolute', zIndex: 1, top: 'calc(50% - 6px)', left: `calc(${left(v)} - 1px)`, width: '2px', height: '12px',
          background: 'var(--ink)', animation: `fade-in 400ms ease ${AXIS_MS - 150}ms both`,
        }} />
      ))}
      {[-0.5, 0.5].map(v => (
        <div key={`ty${v}`} className="plot-anim" aria-hidden style={{
          position: 'absolute', zIndex: 1, left: 'calc(50% - 6px)', top: `calc(${top(v)} - 1px)`, width: '12px', height: '2px',
          background: 'var(--ink)', animation: `fade-in 400ms ease ${AXIS_MS - 150}ms both`,
        }} />
      ))}

      {/* ── Axis words, just past the ends of their lines ── */}
      <AxisWord pole="make" visitor={!!visitor}
        style={{ left: '50%', bottom: `calc(100% - ${GY} + 12px)`, transform: 'translateX(-50%)' }}
        card={{ top: '-4px', left: 'calc(100% + 14px)' }} />
      <AxisWord pole="gather" visitor={!!visitor}
        style={{ left: '50%', top: `calc(100% - ${GY} + 12px)`, transform: 'translateX(-50%)' }}
        card={{ bottom: '-4px', left: 'calc(100% + 14px)' }} />
      <AxisWord pole="work" visitor={!!visitor}
        style={{ left: `calc(100% - ${GX} + 16px)`, top: '50%', transform: 'translateY(-55%)' }}
        card={{ top: 'calc(100% + 14px)', right: 0 }} />
      <AxisWord pole="wonder" visitor={!!visitor}
        style={{ right: `calc(100% - ${GX} + 16px)`, top: '50%', transform: 'translateY(-55%)' }}
        card={{ top: 'calc(100% + 14px)', left: 0 }} />

      {/* ── The origin: where she introduces herself ── */}
      <Origin quiet={!!active} />

      {/* gather · work is still empty — say so, plainly */}
      <span className="plot-anim" style={{
        position: 'absolute', left: left(0.5), top: top(-0.5), transform: 'translate(-50%, -50%)',
        fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '17px',
        color: 'var(--ink-faint)', whiteSpace: 'nowrap',
        opacity: active ? 0 : undefined, transition: 'opacity 0.16s ease',
        animation: `fade-in 700ms ease ${AXIS_MS + 300}ms both`,
      }}>
        nothing gathered here yet
      </span>

      {/* ── The work, big and centered: dots stay on top, so you never leave the map ── */}
      <AnimatePresence>
        {activePoint && (
          <motion.div
            key={activePoint.id}
            onMouseEnter={hold}
            onMouseLeave={release}
            initial={{ opacity: 0, scale: 0.97, filter: 'blur(8px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.99, filter: 'blur(4px)', transition: { duration: 0.22, ease: EASE_EXIT_ARR } }}
            transition={{
              opacity: { duration: 0.42, ease: 'easeOut' },
              filter: { duration: 0.52, ease: EASE_OUT_ARR },
              scale: { duration: 0.62, ease: EASE_OUT_ARR },
            }}
            style={{
              position: 'absolute', zIndex: 4, left: '50%', top: '50%',
              width: `${figW}px`, marginLeft: `${-figW / 2}px`, marginTop: `${-figH / 2 - 34}px`,
            }}
          >
            {activePoint.route ? (
              <Link href={activePoint.route} className="figure-link" aria-label={`Open the case study: ${activePoint.title}`} style={{ display: 'block', color: 'inherit', textDecoration: 'none' }}>
                <Figure p={activePoint} w={figW} h={figH} openLabel />
              </Link>
            ) : (
              <Figure p={activePoint} w={figW} h={figH} />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Points ── */}
      {points.map((p, i) => {
        const isActive = active === p.id
        const showGreeting = p.isVisitor && greeting && !active

        const body = (
          <>
            <span aria-hidden style={{ position: 'absolute', left: '-16px', top: '-16px', width: '32px', height: '32px' }} />
            <span aria-hidden className="plot-dot" style={{
              position: 'absolute', left: 0, top: 0,
              width: p.isVisitor ? '12px' : '11px', height: p.isVisitor ? '12px' : '11px',
              borderRadius: '50%',
              background: p.isVisitor ? 'var(--accent)' : 'var(--ink)',
              boxShadow: active ? '0 0 0 2px var(--bg)' : 'none',
              transform: `translate(-50%, -50%) scale(${isActive ? 1.45 : 1})`,
              transition: `transform 0.42s ${EASE_OUT}, box-shadow 0.16s ease`,
            }} />
            {/* Resting label — steps back while any work is open */}
            <div className="pt-label" style={{
              position: 'absolute', left: 0, top: '14px', transform: 'translateX(-50%)',
              width: 'max-content', maxWidth: '210px', textAlign: 'center',
              fontFamily: 'var(--font-serif)', lineHeight: 1.15,
              color: p.isVisitor ? 'var(--accent)' : 'var(--ink)',
              opacity: active ? 0 : 1, filter: active ? 'blur(2px)' : 'blur(0)',
              transition: `opacity 0.16s ease, filter 0.32s ${EASE_OUT}`,
              pointerEvents: 'none',
            }}>
              {CAPTION[p.id] && (
                <span className="yr" style={{ fontFamily: 'var(--font-courier)', fontSize: '11.5px', color: 'var(--ink)', marginRight: '6px', fontVariantNumeric: 'tabular-nums' }}>
                  {CAPTION[p.id].year}
                </span>
              )}
              {p.title}
              {showGreeting && (
                <div style={{ fontStyle: 'italic', fontSize: '15px', color: 'var(--ink-muted)', marginTop: '3px' }}>
                  {p.line}
                </div>
              )}
            </div>
          </>
        )

        const anchor = {
          position: 'absolute' as const,
          left: left(p.x),
          top: top(p.y),
          width: 0,
          height: 0,
          zIndex: isActive ? 7 : 6,
          animation: `point-in 700ms ${EASE_OUT} ${AXIS_MS - 280 + i * 60}ms both`,
          outline: 'none',
        }
        const handlers = {
          onMouseEnter: () => open(p),
          onMouseLeave: release,
          onFocus: () => open(p),
          onBlur: release,
          'aria-label': `${p.title}. ${p.meta}. ${p.line}`,
        }

        return p.route ? (
          <Link key={p.id} href={p.route} className="plot-anim plot-point" style={anchor} {...handlers}>
            {body}
          </Link>
        ) : (
          <div key={p.id} tabIndex={0} className="plot-anim plot-point" style={{ ...anchor, cursor: 'default' }} {...handlers}>
            {body}
          </div>
        )
      })}

      <style>{`
        @keyframes axis-x { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        @keyframes axis-y { from { transform: scaleY(0); } to { transform: scaleY(1); } }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes point-in {
          from { opacity: 0; transform: translateY(10px); filter: blur(8px); }
          to   { opacity: 1; transform: translateY(0);    filter: blur(0); }
        }
        .figure-link .figure-plate { transition: transform 0.56s ${EASE_OUT}; }
        @media (hover: hover) { .figure-link:hover .figure-plate { transform: scale(1.012); } .figure-link:hover .figure-open { color: var(--ink); } }
        .plot-point:focus-visible .plot-dot { box-shadow: 0 0 0 3px var(--bg), 0 0 0 5px var(--ink); }
        .axis-word:focus-visible { text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 6px; }
        .pt-label { font-size: 17px; }
        @media (max-width: 900px) { .yr { display: none; } .pt-label { font-size: 14.5px; } }
      `}</style>
    </div>
  )
}

function Figure({ p, w, h, openLabel }: { p: Point; w: number; h: number; openLabel?: boolean }) {
  return (
    <>
      <div className="figure-plate" style={{ transformOrigin: '50% 50%' }}>
        <Plate id={p.id} title={p.title} plate={p.plate} animal={p.animal} width={w} height={h} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '16px', padding: '12px 2px 0', background: 'var(--bg)' }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', lineHeight: 1.15, color: p.isVisitor ? 'var(--accent)' : 'var(--ink)' }}>
            {p.title}
          </div>
          <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '16px', lineHeight: 1.4, color: 'var(--ink-muted)', marginTop: '4px', textWrap: 'pretty' as 'pretty' }}>
            {p.line}
          </div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontFamily: 'var(--font-courier)', fontSize: '11px', color: 'var(--ink-faint)', whiteSpace: 'nowrap' }}>
            {CAPTION[p.id] ? `${CAPTION[p.id].kind} · ${p.meta}` : p.meta}
          </div>
          {openLabel && (
            <div className="figure-open" style={{ fontFamily: 'var(--font-courier)', fontSize: '11.5px', color: 'var(--ink-muted)', marginTop: '6px', transition: 'color 0.16s ease' }}>
              (open the case study →)
            </div>
          )}
        </div>
      </div>
    </>
  )
}
