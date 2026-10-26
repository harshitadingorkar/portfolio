'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import Plate from '@/components/Plate'
import { entryById } from '@/lib/entries'

// Mirrors DevEditTool's localStorage key, so dragged positions still apply.
const POSITIONS_KEY = 'dev_image_positions'

export type HoverState =
  | null
  | { type: 'work' }
  | { type: 'project'; id: string }
  | { type: 'about' }
  | { type: 'explorations' }

// dmcg.co's motion: arrivals decelerate long and soft; exits are quick and plain.
const EASE = [0.22, 1, 0.36, 1] as const
const EXIT = [0.4, 0, 0.2, 1] as const

// The stage sits just left of the index panel. Panel: right = 50% − 450px,
// 296px wide, so its left edge is at 50% + 154px. Images end 64px before it.
const STAGE_RIGHT = 90 // px right of center
const SMALL_W = 250
const SMALL_H = 175
const G = 22
const COL_R = `calc(50% + ${STAGE_RIGHT - SMALL_W}px)`
const COL_L = `calc(50% + ${STAGE_RIGHT - SMALL_W * 2 - G}px)`
const VCENTER = '46%'
const ROW_1 = `calc(${VCENTER} - ${SMALL_H + G / 2 + 24}px)`
const ROW_2 = `calc(${VCENTER} + ${G / 2}px)`

const FEATURE_W = 520
const FEATURE_H = 364
const FEATURE_LEFT = `calc(50% + ${STAGE_RIGHT - FEATURE_W}px)`
const FEATURE_TOP = `calc(${VCENTER} - ${FEATURE_H / 2 + 30}px)`

interface Slot { id: string; left: string; top: string; delay: number }

const WORK_SLOTS: Slot[] = [
  { id: 'influence', left: COL_L, top: ROW_1, delay: 0 },
  { id: 'ai_email',  left: COL_R, top: ROW_1, delay: 0.07 },
  { id: 'github',    left: COL_L, top: ROW_2, delay: 0.14 },
  { id: 'sony',      left: COL_R, top: ROW_2, delay: 0.21 },
]
const EXPLORATION_SLOTS: Slot[] = [
  { id: 'patronus',  left: COL_L, top: `calc(${VCENTER} - ${SMALL_H / 2 + 24}px)`, delay: 0 },
  { id: 'sitevoice', left: COL_R, top: `calc(${VCENTER} - ${SMALL_H / 2 + 24}px)`, delay: 0.07 },
]

function Caption({ id, large }: { id: string; large?: boolean }) {
  const e = entryById(id)
  if (!e) return null
  return (
    <div style={{ padding: large ? '12px 1px 0' : '9px 1px 0' }}>
      <div style={{ fontFamily: 'var(--font-serif)', fontSize: large ? '21px' : '16.5px', lineHeight: 1.2, color: 'var(--ink)' }}>{e.title}</div>
      <div style={{ fontFamily: 'var(--font-courier)', fontSize: '11px', color: 'var(--ink-faint)', marginTop: '3px' }}>{e.meta}</div>
      {large && (
        <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '16px', lineHeight: 1.4, color: 'var(--ink-muted)', marginTop: '6px', maxWidth: '46ch' }}>{e.line}</div>
      )}
    </div>
  )
}

function Figure({ id, w, h, large }: { id: string; w: number; h: number; large?: boolean }) {
  const e = entryById(id)
  if (!e) return null
  return (
    <div style={{ width: `${w}px` }}>
      <Plate id={e.id} title={e.title} plate={e.plate} width={w} height={h} />
      <Caption id={id} large={large} />
    </div>
  )
}

export default function HoverImages({
  hoverState,
  expandedProjectId,
}: {
  hoverState: HoverState
  expandedProjectId?: string | null
}) {
  const [devPositions, setDevPositions] = useState<Record<string, { left: string; top: string }>>({})
  const [editMode, setEditMode] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(POSITIONS_KEY)
      if (raw) setDevPositions(JSON.parse(raw))
    } catch {}
    const handler = (e: Event) => setEditMode((e as CustomEvent<{ on: boolean }>).detail.on)
    window.addEventListener('dev:edit-mode', handler)
    return () => window.removeEventListener('dev:edit-mode', handler)
  }, [])

  const pos = (s: Slot) => devPositions[s.id] ?? { left: s.left, top: s.top }

  // A single project — hovered or expanded — gets the stage to itself.
  const featureId =
    expandedProjectId ?? (hoverState?.type === 'project' ? hoverState.id : null)
  const slots =
    featureId ? [] : hoverState?.type === 'work' ? WORK_SLOTS : hoverState?.type === 'explorations' ? EXPLORATION_SLOTS : []

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 10 }}>
      <AnimatePresence>
        {featureId && entryById(featureId) && (
          <motion.div
            key={`feature-${featureId}`}
            data-hover-image-id={`feature-${featureId}`}
            initial={{ opacity: 0, scale: 0.97, filter: 'blur(8px)' }}
            animate={{
              opacity: 1, scale: 1, filter: 'blur(0px)',
              transition: { opacity: { duration: 0.42, ease: 'easeOut' }, filter: { duration: 0.52, ease: EASE }, scale: { duration: 0.62, ease: EASE } },
            }}
            exit={{ opacity: 0, filter: 'blur(4px)', transition: { duration: 0.22, ease: EXIT } }}
            style={{ position: 'absolute', left: FEATURE_LEFT, top: FEATURE_TOP, pointerEvents: editMode ? 'auto' : 'none' }}
          >
            <Figure id={featureId} w={FEATURE_W} h={FEATURE_H} large />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {slots.map(s => (
          <motion.div
            key={s.id}
            data-hover-image-id={s.id}
            initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: EASE, delay: 0.04 + s.delay } }}
            exit={{ opacity: 0, filter: 'blur(4px)', transition: { duration: 0.2, ease: EXIT } }}
            style={{ position: 'absolute', ...pos(s), pointerEvents: editMode ? 'auto' : 'none', cursor: editMode ? 'move' : 'default' }}
          >
            <Figure id={s.id} w={SMALL_W} h={SMALL_H} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
