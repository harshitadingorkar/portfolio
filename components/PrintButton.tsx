'use client'

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="no-print"
      style={{
        background: 'none', border: 'none', padding: 0, cursor: 'pointer',
        fontFamily: 'var(--font-courier)', fontSize: '12px', color: 'var(--ink-muted)',
        textDecoration: 'underline', textUnderlineOffset: '4px', textDecorationThickness: '1px',
      }}
    >
      print, or save as pdf
    </button>
  )
}
