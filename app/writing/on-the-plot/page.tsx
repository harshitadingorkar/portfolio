import type { Metadata } from 'next'
import Link from 'next/link'
import PageShell, { label, prose } from '@/components/PageShell'

export const metadata: Metadata = {
  title: 'On the plot — Harshita Shyale',
  description: 'How this site is arranged: two axes, wonder to work and gather to make.',
}

export default function OnThePlot() {
  return (
    <PageShell current="writing">
      <p style={label}>October 2026 · a note on how this site is arranged</p>
      <h1 style={{
        fontFamily: 'var(--font-serif)', fontWeight: 200, fontStyle: 'italic',
        fontSize: 'clamp(36px, 5vw, 52px)', letterSpacing: '-0.01em', lineHeight: 1.1,
        color: 'var(--ink)', margin: '0 0 40px',
      }}>
        On the plot
      </h1>

      <p style={prose}>
        Most portfolios are a list, sorted by importance. This one is a map. Everything Harshita makes or
        keeps sits on two axes, and where it sits says what kind of attention made it.
      </p>
      <p style={prose}>
        Left to right runs <em>wonder</em> to <em>work</em>: from the exploratory, aesthetic and open-ended,
        to the practical and applied — product and systems with outcomes. Bottom to top runs <em>gather</em>{' '}
        to <em>make</em>: from things collected, kept and arranged, to things produced.
      </p>
      <p style={prose}>
        So the shipped work lives top right. The experiments live top left. The references kept because a
        problem needed them belong bottom right; the things kept simply because they pulled, bottom left.
        That is also where you are. Every visitor is given a name, and counted among the things gathered.
      </p>
      <p style={prose}>
        Turn the sound on and each point plays its own note. Higher on the plot is higher in pitch; further
        right is further into your right ear. You can hear where a thing sits.
      </p>
      <p style={prose}>
        The type is IM Fell English, a revival of seventeenth-century types, inky and a little uneven, and
        Courier Prime, the screenwriting typewriter — so the small print reads like stage directions. Her
        name, at the origin, is set in Ballet. The plot and the text hold the same
        things. <Link href="/" style={{ color: 'var(--ink)' }}>Read it whichever way you like.</Link>
      </p>
    </PageShell>
  )
}
