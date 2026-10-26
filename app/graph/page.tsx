'use client'

import { useState } from 'react'
import Link from 'next/link'
import NodeGraph from '@/components/NodeGraph'

export default function GraphPrototypePage() {
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null)

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', background: 'var(--bg)' }}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', zIndex: 50 }}>
        <Link href="/" style={{ fontFamily: 'var(--font-ibm-plex-mono)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--ink-faint)', textDecoration: 'none' }}>
          ← Back
        </Link>
        <span style={{ fontFamily: 'var(--font-ibm-plex-mono)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--ink-faint)' }}>
          Node graph prototype — hover to bloom
        </span>
      </div>

      <div style={{ width: '100%', height: '100%' }}>
        <NodeGraph
          activeNodeId={activeNodeId}
          onNodeEnter={setActiveNodeId}
          onNodeLeave={() => setActiveNodeId(null)}
        />
      </div>
    </div>
  )
}
