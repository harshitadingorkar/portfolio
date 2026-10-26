// The plot, audible. Height picks the pitch (make low → gather high),
// horizontal position picks the ear (work left → wonder right).
// Synthesised, no audio files. Off unless the visitor turns it on.

const KEY = 'sound'

// A-major pentatonic across two octaves: any two notes sit well together,
// so moving across the plot can't make an ugly chord.
const SCALE = [220.0, 246.94, 277.18, 329.63, 369.99, 440.0, 493.88, 554.37, 659.25, 739.99]

let ctx: AudioContext | null = null
let out: GainNode | null = null

export function soundEnabled(): boolean {
  try { return localStorage.getItem(KEY) === 'on' } catch { return false }
}

export function setSoundEnabled(on: boolean) {
  try { localStorage.setItem(KEY, on ? 'on' : 'off') } catch {}
  if (on) wake()
}

// Only ever called from a click/keypress — browsers keep audio asleep until then.
function wake() {
  if (typeof window === 'undefined') return
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AC) return
    ctx = new AC()
    out = ctx.createGain()
    out.gain.value = 0.9
    const soften = ctx.createBiquadFilter()
    soften.type = 'lowpass'
    soften.frequency.value = 2400
    out.connect(soften)
    soften.connect(ctx.destination)
  }
  if (ctx.state === 'suspended') void ctx.resume()
}

function tone(freq: number, pan: number, peak: number, delay = 0) {
  if (!ctx || !out) return
  const t = ctx.currentTime + delay
  const env = ctx.createGain()
  env.gain.setValueAtTime(0, t)
  env.gain.linearRampToValueAtTime(peak, t + 0.008)
  env.gain.exponentialRampToValueAtTime(0.0001, t + 1.4)

  const panner = ctx.createStereoPanner()
  panner.pan.value = pan

  const body = ctx.createOscillator()
  body.type = 'sine'
  body.frequency.value = freq

  const shimmer = ctx.createOscillator()
  shimmer.type = 'triangle'
  shimmer.frequency.value = freq * 2
  const shimmerGain = ctx.createGain()
  shimmerGain.gain.value = 0.12

  body.connect(env)
  shimmer.connect(shimmerGain)
  shimmerGain.connect(env)
  env.connect(panner)
  panner.connect(out)

  body.start(t); shimmer.start(t)
  body.stop(t + 1.5); shimmer.stop(t + 1.5)
}

let lastPluck = 0

export function pluck(x: number, y: number) {
  if (!ctx || ctx.state !== 'running' || !soundEnabled()) return
  const now = performance.now()
  if (now - lastPluck < 60) return
  lastPluck = now
  const i = Math.round(((y + 1) / 2) * (SCALE.length - 1))
  tone(SCALE[Math.max(0, Math.min(SCALE.length - 1, i))], Math.max(-1, Math.min(1, x * 0.8)), 0.05)
}

export function chime() {
  wake()
  tone(SCALE[3], -0.2, 0.05)
  tone(SCALE[5], 0.2, 0.04, 0.12)
}

// A returning visitor who left sound on gets it back at their first click or keypress.
export function wakeOnFirstGesture(): () => void {
  if (typeof window === 'undefined' || !soundEnabled()) return () => {}
  const h = () => wake()
  window.addEventListener('pointerdown', h, { once: true })
  window.addEventListener('keydown', h, { once: true })
  return () => {
    window.removeEventListener('pointerdown', h)
    window.removeEventListener('keydown', h)
  }
}
