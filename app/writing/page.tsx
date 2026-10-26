import type { Metadata } from 'next'
import Link from 'next/link'
import PageShell, { label } from '@/components/PageShell'

export const metadata: Metadata = {
  title: 'Writing — Harshita Shyale',
  description: 'Notes from Harshita Shyale.',
}

const NOTES = [
  { href: '/writing/on-the-plot', title: 'On the plot', when: 'October 2026', line: 'how this site is arranged, and why it is a map instead of a list.' },
]

export default function WritingPage() {
  return (
    <PageShell current="writing">
      <p style={label}>writing</p>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {NOTES.map(n => (
          <li key={n.href} style={{ borderTop: '1px solid var(--rule)' }}>
            <Link href={n.href} className="note-row" style={{ display: 'block', padding: '16px 0 18px', textDecoration: 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '16px' }}>
                <span className="note-title" style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', fontWeight: 300, color: 'var(--ink)' }}>
                  {n.title}
                </span>
                <span style={{ fontFamily: 'var(--font-courier)', fontSize: '12px', color: 'var(--ink-faint)', whiteSpace: 'nowrap' }}>
                  {n.when}
                </span>
              </div>
              <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 300, fontSize: '17px', color: 'var(--ink-muted)', marginTop: '4px' }}>
                {n.line}
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <style>{`@media (hover: hover) { .note-row:hover .note-title { text-decoration: underline; text-underline-offset: 5px; text-decoration-thickness: 1px; } }`}</style>
    </PageShell>
  )
}
