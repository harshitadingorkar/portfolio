'use client'

import { forwardRef, useEffect, useRef, Component, type ReactNode } from 'react'

const PROJECT_ID = '68NPqs52HBHIFhXMihRV'
const SDK_URL    = 'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.1.3/dist/unicornStudio.umd.js'

type UnicornStudioGlobal = {
  init?: () => void
  destroyScene?: (id: string) => void
}

// Catch any crash from the third-party scene without killing the page
class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? null : this.props.children }
}

// Module-level singleton: the SDK script is appended at most once, and every
// mounted scene (including React 18 Strict Mode's double-invoke in dev) awaits
// the SAME promise instead of racing a fresh <script> / onload pair. Appending
// the script twice, or calling initScene() before window.UnicornStudio exists,
// silently drops the scene — which is what was happening before this fix.
let sdkPromise: Promise<UnicornStudioGlobal> | null = null

function loadUnicornSDK(): Promise<UnicornStudioGlobal> {
  if (sdkPromise) return sdkPromise

  sdkPromise = new Promise((resolve, reject) => {
    const w = window as unknown as Record<string, unknown>
    if (w.UnicornStudio) {
      resolve(w.UnicornStudio as UnicornStudioGlobal)
      return
    }

    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SDK_URL}"]`)
    const script = existing ?? document.createElement('script')
    if (!existing) {
      script.src = SDK_URL
      document.head.appendChild(script)
    }
    script.addEventListener('load', () => resolve((window as unknown as Record<string, unknown>).UnicornStudio as UnicornStudioGlobal))
    script.addEventListener('error', () => reject(new Error('Failed to load Unicorn Studio SDK')))
  })

  return sdkPromise
}

// Loads Unicorn Studio SDK via script tag and mounts the scene imperatively.
// This replaces the unicornstudio-react/next import which fails to resolve
// on Vercel due to package exports field conflicts with webpack.
function UnicornScene() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const id = `us-${Math.random().toString(36).slice(2, 8)}`
    container.setAttribute('data-us-project', PROJECT_ID)
    container.id = id

    let destroyed = false

    loadUnicornSDK().then(US => {
      if (destroyed) return
      // Wait a frame so the container has its final laid-out size before the
      // engine measures it — calling init() mid-layout is what produces a
      // scene stuck rendering into a small top-left region.
      requestAnimationFrame(() => {
        if (destroyed) return
        // init() re-scans the DOM for any data-us-project element not yet
        // bound to a scene, so it's safe (and necessary) to call on every mount.
        US.init?.()
      })
    }).catch(() => {
      // SceneBoundary / silent fallback — a missing hero graphic shouldn't break the page
    })

    return () => {
      destroyed = true
      const US = (window as unknown as Record<string, unknown>).UnicornStudio as UnicornStudioGlobal | undefined
      US?.destroyScene?.(id)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '100%' }}
    />
  )
}

const UnicornHero = forwardRef<HTMLDivElement, { style?: React.CSSProperties; onReady?: () => void }>(
function UnicornHero({ style, onReady }, ref) {

  useEffect(() => {
    const t = setTimeout(() => onReady?.(), 800)
    return () => clearTimeout(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div ref={ref} style={{ position: 'absolute', inset: 0, overflow: 'hidden', ...style }}>
      <SceneBoundary>
        <UnicornScene />
      </SceneBoundary>
    </div>
  )
})

UnicornHero.displayName = 'UnicornHero'
export default UnicornHero
