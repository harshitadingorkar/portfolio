'use client'

import { useState } from 'react'
import { SHAPES, type AnimalType } from '@/lib/patronus'
import type { Plate as PlateData } from '@/lib/entries'

// dmcg.co's curve — a long, soft deceleration — used for every reveal on the site.
export const EASE_OUT = 'cubic-bezier(.22, 1, .36, 1)'

// Images come into focus as they load, rather than popping in.
function FocusImage({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false)
  return (
    <img
      src={src}
      alt={alt}
      onLoad={() => setLoaded(true)}
      ref={el => { if (el?.complete && el.naturalWidth) setLoaded(true) }}
      style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block',
        opacity: loaded ? 1 : 0,
        filter: loaded ? 'blur(0)' : 'blur(8px)',
        transition: `opacity 0.45s ease, filter 0.56s ${EASE_OUT}`,
      }}
    />
  )
}

// One image system for both the plot and the index panel.
// Real artifact → the image. No artifact → a typeset title card (Chia's form:
// a centered serif title, a paired-noun litany beneath). Patronus → creatures
// drawn from the actual point clouds in lib/patronus.ts.

const FRAME = {
  position: 'relative' as const,
  overflow: 'hidden' as const,
  borderRadius: '3px',
  boxShadow: '0 0 0 1px rgba(18,38,27,.07), 0 1px 2px -1px rgba(18,38,27,.08), 0 14px 36px -8px rgba(18,38,27,.16)',
}

function Creatures({ animals }: { animals: AnimalType[] }) {
  return (
    <svg viewBox={`0 0 ${animals.length} 1`} width="100%" height="100%" preserveAspectRatio="xMidYMid meet" aria-hidden>
      {animals.map((a, i) =>
        SHAPES[a].map((p, j) => (
          <circle key={`${a}-${j}`} cx={i + 0.12 + p.x * 0.76} cy={0.1 + p.y * 0.8} r={0.0075} fill="var(--ink)" opacity={0.72} />
        )),
      )}
    </svg>
  )
}

export default function Plate({
  id, title, plate, animal, width, height,
}: {
  id: string
  title: string
  plate: PlateData
  animal?: string
  width: number
  height: number
}) {
  const box = { ...FRAME, width: `${width}px`, height: `${height}px` }

  if (plate.src) {
    return (
      <div style={{ ...box, background: 'var(--bg-subtle)' }}>
        <FocusImage src={plate.src} alt={plate.alt} />
      </div>
    )
  }

  if (id === 'you' || id === 'patronus') {
    const animals = (id === 'you' && animal ? [animal] : ['fox', 'moth', 'heron']) as AnimalType[]
    return (
      <div role="img" aria-label={plate.alt} style={{ ...box, background: 'var(--panel-bg)', padding: id === 'you' ? '18px' : '14px 10px' }}>
        <Creatures animals={animals} />
        {id === 'you' && (
          <span style={{
            position: 'absolute', left: '14px', bottom: '10px',
            fontFamily: 'var(--font-courier)', fontSize: '10.5px', color: 'var(--ink-faint)',
          }}>
            {animal}
          </span>
        )}
      </div>
    )
  }

  return (
    <div role="img" aria-label={plate.alt} style={{
      ...box, background: 'var(--panel-bg)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: `0 ${Math.round(width * 0.1)}px`, textAlign: 'center',
    }}>
      {id !== 'sitevoice' && (
        <div style={{
          fontFamily: 'var(--font-serif)', fontWeight: 300, fontStyle: 'italic',
          fontSize: `${Math.round(width / 11)}px`, lineHeight: 1.1, color: 'var(--ink)',
          textWrap: 'balance' as 'balance',
        }}>
          {title}
        </div>
      )}
      <div style={{
        fontFamily: 'var(--font-courier)',
        fontSize: id === 'sitevoice' ? `${Math.max(12, Math.round(width / 22))}px` : '11px',
        lineHeight: 1.6, color: 'var(--ink-muted)',
        marginTop: id === 'sitevoice' ? 0 : '12px', maxWidth: '86%',
        textWrap: 'balance' as 'balance',
      }}>
        {id === 'sitevoice' ? `↳ ${plate.litany}` : plate.litany}
      </div>
    </div>
  )
}
