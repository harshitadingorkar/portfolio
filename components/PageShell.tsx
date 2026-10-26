import Link from 'next/link'

// The quieter rooms of the house: same corners as the plot, one column of text.
export default function PageShell({ current, children }: { current: 'about' | 'writing' | 'resume'; children: React.ReactNode }) {
  const link = (href: string, label: string, key: string) => (
    <Link
      href={href}
      className="corner-link"
      aria-current={current === key ? 'page' : undefined}
      style={{
        fontFamily: 'var(--font-courier)', fontSize: '12px', textDecoration: 'none',
        color: current === key ? 'var(--ink)' : 'var(--ink-muted)',
        borderBottom: current === key ? '1px solid var(--ink)' : '1px solid transparent',
        paddingBottom: '1px',
      }}
    >
      {label}
    </Link>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <header className="no-print" style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        padding: '30px 40px', gap: '24px', flexWrap: 'wrap',
      }}>
        <Link href="/" style={{
          fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 200,
          fontSize: '22px', letterSpacing: '-0.01em', color: 'var(--ink)', textDecoration: 'none',
        }}>
          everything Harshita notices and makes
        </Link>
        <nav aria-label="Pages" style={{ display: 'flex', gap: '18px' }}>
          {link('/about', 'about', 'about')}
          {link('/writing', 'writing', 'writing')}
          {link('/resume', 'résumé', 'resume')}
        </nav>
      </header>

      <main style={{ maxWidth: '720px', margin: '0 auto', padding: '160px 40px 140px' }}>
        {children}
      </main>

      <style>{`
        @media (hover: hover) { .corner-link:hover { color: var(--ink) !important; } }
        @media print { .no-print { display: none !important; } main { padding-top: 0 !important; } }
      `}</style>
    </div>
  )
}

export const label: React.CSSProperties = {
  fontFamily: 'var(--font-courier)', fontSize: '12px', color: 'var(--ink-faint)',
  margin: '0 0 10px',
}

export const prose: React.CSSProperties = {
  fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: '19px', lineHeight: 1.6,
  color: 'var(--ink)', margin: '0 0 18px', textWrap: 'pretty' as 'pretty',
}
