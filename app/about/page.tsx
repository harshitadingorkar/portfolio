import type { Metadata } from 'next'
import Link from 'next/link'
import PageShell, { label, prose } from '@/components/PageShell'
import { EXPERIENCE, CONTACT } from '@/lib/entries'

export const metadata: Metadata = {
  title: 'About — Harshita Shyale',
  description: 'Harshita Shyale is a product designer and researcher in Seattle.',
}

const section = { marginTop: '56px' }

export default function AboutPage() {
  return (
    <PageShell current="about">
      <h1 style={{
        fontFamily: 'var(--font-serif)', fontWeight: 200, fontSize: 'clamp(30px, 4.4vw, 42px)',
        lineHeight: 1.25, letterSpacing: '-0.01em', color: 'var(--ink)', margin: 0,
        textWrap: 'balance' as 'balance',
      }}>
        Harshita is a product designer and researcher. Her work sits where careful observation meets AI systems.
      </h1>

      <section style={section}>
        <p style={label}>now</p>
        <p style={prose}>
          Product designer at Salesloft, in revenue and sales engagement — most recently{' '}
          <Link href="/work/influence-graph" style={{ color: 'var(--ink)' }}>Influence Graph</Link>, and{' '}
          <Link href="/work/ai-email-assistant" style={{ color: 'var(--ink)' }}>an AI email assistant</Link> that shows its reasons.
        </p>
      </section>

      <section style={section}>
        <p style={label}>before</p>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {EXPERIENCE.map(e => (
            <li key={e.role + e.org} style={{
              display: 'grid', gridTemplateColumns: '1fr auto', gap: '16px', alignItems: 'baseline',
              padding: '12px 0', borderTop: '1px solid var(--rule)',
            }}>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', color: 'var(--ink)' }}>
                {e.role}<span style={{ color: 'var(--ink-muted)', fontWeight: 300 }}>, {e.org}</span>
              </span>
              <span style={{ fontFamily: 'var(--font-courier)', fontSize: '12px', color: 'var(--ink-faint)', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
                {e.when}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section style={section}>
        <p style={label}>this site</p>
        <p style={prose}>
          Everything here is plotted on two axes — wonder to work, gather to make. The note{' '}
          <Link href="/writing/on-the-plot" style={{ color: 'var(--ink)' }}>On the plot</Link> explains why.
        </p>
      </section>

      <section style={section}>
        <p style={label}>elsewhere</p>
        <p style={{ ...prose, margin: 0 }}>
          <a href={`mailto:${CONTACT.email}`} style={{ color: 'var(--ink)' }}>{CONTACT.email}</a>
          <br />
          <a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--ink)' }}>LinkedIn ↗</a>
        </p>
      </section>
    </PageShell>
  )
}
