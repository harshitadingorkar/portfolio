import type { Metadata } from 'next'
import Link from 'next/link'
import PageShell, { label } from '@/components/PageShell'
import PrintButton from '@/components/PrintButton'
import { EXPERIENCE, CONTACT, entryById } from '@/lib/entries'

export const metadata: Metadata = {
  title: 'Résumé — Harshita Shyale',
  description: 'Harshita Shyale — product designer and researcher.',
}

// Which things on the plot came out of which chapter.
const WORK_BY_ORG: Record<string, string[]> = {
  'Salesloft': ['influence', 'ai_email'],
  'GitHub': ['github'],
  'University of Washington': ['sony'],
  'Hewlett Packard Enterprise': ['hpe'],
  'Nutanix': ['nutanix'],
}

export default function ResumePage() {
  return (
    <PageShell current="resume">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '16px', flexWrap: 'wrap' }}>
        <h1 style={{
          fontFamily: 'var(--font-serif)', fontWeight: 200, fontSize: 'clamp(36px, 5vw, 48px)',
          letterSpacing: '-0.01em', lineHeight: 1.1, color: 'var(--ink)', margin: 0,
        }}>
          Harshita Shyale
        </h1>
        <PrintButton />
      </div>
      <p style={{ fontFamily: 'var(--font-courier)', fontSize: '12.5px', color: 'var(--ink-muted)', margin: '10px 0 0' }}>
        product designer and researcher · Seattle ·{' '}
        <a href={`mailto:${CONTACT.email}`} style={{ color: 'var(--ink-muted)' }}>{CONTACT.email}</a> ·{' '}
        <a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--ink-muted)' }}>LinkedIn</a>
      </p>

      <section style={{ marginTop: '64px' }}>
        <p style={label}>experience &amp; education</p>
        {EXPERIENCE.map(e => (
          <article key={e.role + e.org} style={{ padding: '18px 0 20px', borderTop: '1px solid var(--rule)', breakInside: 'avoid' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '16px', alignItems: 'baseline' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: '19px', color: 'var(--ink)', margin: 0 }}>
                {e.role}
                <span style={{ fontWeight: 300, color: 'var(--ink-muted)' }}> — {e.org}</span>
              </h2>
              <span style={{ fontFamily: 'var(--font-courier)', fontSize: '12px', color: 'var(--ink-faint)', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
                {e.when}
              </span>
            </div>
            {(WORK_BY_ORG[e.org] ?? []).map(id => {
              const w = entryById(id)
              if (!w) return null
              const title = w.route
                ? <Link href={w.route} style={{ color: 'var(--ink)' }}>{w.title}</Link>
                : <span style={{ color: 'var(--ink)' }}>{w.title}</span>
              return (
                <p key={id} style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: '16.5px', lineHeight: 1.55, color: 'var(--ink-muted)', margin: '8px 0 0' }}>
                  {title} — {w.line}
                </p>
              )
            })}
          </article>
        ))}
      </section>
    </PageShell>
  )
}
