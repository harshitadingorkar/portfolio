'use client'

import Link from 'next/link'
import {
  ENTRIES, QUADRANT_ORDER, QUADRANT_LABEL, QUADRANT_NOTE, quadrantOf,
  type Entry, type Visitor,
} from '@/lib/entries'
import { pluck } from '@/lib/sound'
import Plate from '@/components/Plate'
import { timeAgo } from '@/lib/patronus'

type Row = Entry & { isVisitor?: boolean }

export default function QuietList({ visitor }: { visitor: Visitor | null }) {
  const rows: Row[] = [...ENTRIES]
  if (visitor) {
    rows.push({
      id: 'you',
      title: `you, ${visitor.name}`,
      meta: `gathered ${timeAgo(visitor.createdAt)}`,
      line: visitor.greeting,
      x: visitor.x,
      y: visitor.y,
      isVisitor: true,
      plate: { alt: `[Your creature — ${visitor.animal} — drawn in scattered dots.]` },
    })
  }

  return (
    <div className="plot-anim" style={{
      maxWidth: '580px', margin: '0 auto', padding: '0 24px',
      animation: 'fade-in 400ms ease both',
    }}>
      {QUADRANT_ORDER.map(q => {
        // Newest first — the source order — not the plot's center-out reveal order.
        const items = rows.filter(r => quadrantOf(r) === q)
        return (
          <section key={q} style={{ marginBottom: '56px' }}>
            <h2 style={{
              fontFamily: 'var(--font-courier)', fontSize: '10.5px', fontWeight: 400,
              letterSpacing: '0.06em', color: 'var(--ink-faint)', margin: 0,
            }}>
              {QUADRANT_LABEL[q]}
            </h2>
            <p style={{
              fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '14px',
              color: 'var(--ink-faint)', margin: '4px 0 14px',
            }}>
              {QUADRANT_NOTE[q]}
            </p>

            {items.length === 0 ? (
              <p style={{
                fontFamily: 'var(--font-serif)', fontSize: '15px',
                color: 'var(--ink-muted)', margin: 0, padding: '10px 0',
                borderTop: '1px solid var(--rule)',
              }}>
                nothing gathered here yet.
              </p>
            ) : (
              items.map(r => {
                const inner = (
                  <div style={{ display: 'grid', gridTemplateColumns: '96px minmax(0, 1fr)', gap: '16px', alignItems: 'start' }}>
                    <Plate id={r.id} title={r.title} plate={r.plate} animal={r.isVisitor ? visitor?.animal : undefined} width={96} height={68} />
                    <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '16px' }}>
                      <span style={{
                        fontFamily: 'var(--font-serif)', fontSize: '17px',
                        color: r.isVisitor ? 'var(--accent)' : 'var(--ink)',
                      }}>
                        {r.title}
                      </span>
                      <span style={{
                        fontFamily: 'var(--font-courier)', fontSize: '10px', letterSpacing: '0.04em',
                        color: 'var(--ink-faint)', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums',
                      }}>
                        {r.meta}
                      </span>
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-serif)', fontSize: '15px', lineHeight: 1.5,
                      color: 'var(--ink-muted)', marginTop: '2px', textWrap: 'pretty' as 'pretty',
                    }}>
                      {r.line}
                    </div>
                    </div>
                  </div>
                )
                const style = {
                  display: 'block', padding: '14px 0 16px',
                  borderTop: '1px solid var(--rule)',
                  textDecoration: 'none', color: 'inherit',
                }
                const handlers = { onMouseEnter: () => pluck(r.x, r.y), onFocus: () => pluck(r.x, r.y) }
                return r.route ? (
                  <Link key={r.id} href={r.route} className="list-row" style={style} {...handlers}>{inner}</Link>
                ) : (
                  <div key={r.id} style={style} {...handlers}>{inner}</div>
                )
              })
            )}
          </section>
        )
      })}

      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @media (hover: hover) { .list-row:hover span:first-child { text-decoration: underline; text-underline-offset: 3px; text-decoration-thickness: 1px; } }
      `}</style>
    </div>
  )
}
