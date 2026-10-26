// Hand-drawn geometry, made from loose paths rather than filters: crisp lines
// whose shapes wander a little, the way a pen does.

import { mulberry32 } from '@/lib/patronus'

const f = (n: number) => n.toFixed(2)

// The origin mark — a wreath of cursive loops, like a line of l's written
// around the point where the axes cross. It never quite closes: the pen
// overshoots a little past where it started, and lifts.
export function garland({ R = 27, r = 13.5, loops = 7, cx = 42, cy = 42 } = {}) {
  const k = loops - 1
  const t0 = -0.2
  const t1 = Math.PI * 2 + 0.16
  const steps = 420
  let d = ''
  for (let i = 0; i <= steps; i++) {
    const t = t0 + (t1 - t0) * (i / steps)
    // A slight outward drift, so the end of the stroke lands beside its start.
    const drift = 1 + 0.03 * ((t - t0) / (t1 - t0))
    const RR = R * drift * (1 + 0.035 * Math.sin(2 * t + 0.7) + 0.015 * Math.sin(5 * t + 2))
    // Loops vary in size, the way they do by hand.
    const rr = r * (1 + 0.16 * Math.sin(3 * t + 1.3) + 0.05 * Math.sin(7 * t))
    const x = cx + RR * Math.cos(t) - rr * Math.cos(k * t)
    const y = cy + RR * Math.sin(t) + rr * Math.sin(k * t)
    d += `${i ? 'L' : 'M'}${f(x)} ${f(y)}`
  }
  return d
}

// A short written flourish — the same loops, unwound into a line.
export function flourish({ w = 150, loops = 4, a = 6.5 } = {}) {
  const steps = 220
  const span = Math.PI * 2 * loops + Math.PI * 0.9
  const c = (w - 24) / span
  let d = ''
  for (let i = 0; i <= steps; i++) {
    const s = i / steps
    const th = s * span
    // Loops swell in the middle and thin at the ends, like a pen gaining speed.
    const amp = a * Math.sin(Math.PI * Math.min(1, s * 1.1)) + 0.6
    const x = 6 + c * th - amp * 0.9 * Math.sin(th)
    const y = 10 - amp * Math.cos(th) * 0.62 + amp * 0.62 - s * 2.5
    d += `${i ? 'L' : 'M'}${f(x)} ${f(y)}`
  }
  return d
}

// A closed organic outline through n points, smoothed with Catmull-Rom.
// Same command structure for every set of radii, so outlines can morph.
const N = 9
const JITTER = Array.from({ length: N }, (_, i) => (mulberry32(9001 + i)() - 0.5) * 0.32)

export function blob(radii: number[], rot = 0) {
  const pts = radii.map((r, i) => {
    const a = rot + (i / N) * Math.PI * 2 + JITTER[i]
    return [50 + Math.cos(a) * 48 * r, 50 + Math.sin(a) * 48 * r]
  })
  const p = (i: number) => pts[(i + N) % N]
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`
  for (let i = 0; i < N; i++) {
    const [p0, p1, p2, p3] = [p(i - 1), p(i), p(i + 1), p(i + 2)]
    d += `C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`
  }
  return d + 'Z'
}

const radiiFrom = (seed: number) => {
  const r = mulberry32(seed)
  return Array.from({ length: N }, () => 0.87 + r() * 0.13)
}

export const BLOB_ROUND = blob(Array(N).fill(0.9))
// Three breaths the panel moves between while it's open.
export const BLOB_BREATHS = [radiiFrom(11), radiiFrom(23), radiiFrom(47)].map(r => blob(r))
// The pencil line around it: a little larger, a little turned, out of step.
export const BLOB_LINES = [radiiFrom(23), radiiFrom(47), radiiFrom(11)].map(r => blob(r.map(v => v * 1.025), 0.07))
