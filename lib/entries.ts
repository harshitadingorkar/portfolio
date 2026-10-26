// Everything on the plot. Position is meaning:
//   x: −1 wonder (exploratory, open-ended) … +1 work (applied, shipped)
//   y: −1 gather (things kept, arranged)  … +1 make (things produced)
// so make · work — the professional home cluster — sits top-right.
//
// Images: a real artifact where one exists in /public. Everything else shows a
// seeded placeholder photograph (placeholder: true) until Harshita's real work
// replaces it — drop a file at /public/work/<id>/hover.(avif|jpg) and point
// `src` at it.

export type Quadrant = 'make-work' | 'make-wonder' | 'gather-work' | 'gather-wonder'

export interface Plate {
  src?: string          // image to show
  placeholder?: boolean // true until a real artifact replaces it
  alt: string           // bracketed, descriptive — part of the poem
  litany?: string       // for title cards
  tint?: string         // title-card ground
}

export interface Entry {
  id: string
  title: string
  meta: string
  line: string
  x: number
  y: number
  route?: string
  plate: Plate
}

export interface Visitor {
  name: string
  animal: string
  greeting: string
  createdAt: number
  x: number
  y: number
}

export const ENTRIES: Entry[] = [
  // ── make · work — top right ──────────────────────────────────────────────
  {
    id: 'influence',
    title: 'Influence Graph',
    meta: 'Salesloft · 2025 · locked',
    line: 'who actually moves a deal, drawn as paths a seller can walk.',
    x: 0.7, y: 0.78,
    route: '/work/influence-graph',
    plate: {
      src: 'https://picsum.photos/seed/hs-paths/1400/980',
      placeholder: true,
      alt: '[Placeholder photograph — the Influence Graph artifact goes here.]',
      litany: 'sellers and buyers, paths and power, the people behind a deal',
      tint: '#efe9df',
    },
  },
  {
    id: 'ai_email',
    title: 'AI Email Assistant',
    meta: 'Salesloft · 2025 · locked',
    line: 'generated email that shows its reasons, so reps edit instead of accept.',
    x: 0.36, y: 0.95,
    route: '/work/ai-email-assistant',
    plate: {
      src: 'https://picsum.photos/seed/hs-letters/1400/980',
      placeholder: true,
      alt: '[Placeholder photograph — the AI Email Assistant artifact goes here.]',
      litany: 'drafts and reasons, trust and edits, a voice kept',
      tint: '#ebe8e1',
    },
  },
  {
    id: 'github',
    title: 'GitHub usability study',
    meta: 'GitHub · 2024',
    line: 'a review change that helped most developers and quietly broke it for some.',
    x: 0.62, y: 0.16,
    route: '/work/github',
    plate: {
      src: '/work/github/hover.avif',
      alt: '[A pull request on a pale sky ground: a file tree, line 108 highlighted, and a comment from harshitashyale — "This function is causing weird behavior, please check & fix!"]',
    },
  },
  {
    id: 'sony',
    title: 'Sony capstone',
    meta: 'Sony · UW',
    line: 'an AI assistant that asks before it learns — consent as a slider, not a checkbox.',
    x: 0.22, y: 0.61,
    route: '/work/sony',
    plate: {
      src: '/work/sony/hover.avif',
      alt: '[A phone on a dark field glowing violet. Sonia, an AI assistant, asks to use your data — a slider from "No, thank you" to "Yes, do it all".]',
    },
  },
  {
    id: 'hpe',
    title: 'Agents before agents',
    meta: 'HPE · 2021–23',
    line: 'RPA bots doing the tedious part, before anyone called it agentic.',
    x: 0.32, y: 0.3,
    plate: {
      src: 'https://picsum.photos/seed/hs-machines/1400/980',
      placeholder: true,
      alt: '[Placeholder photograph — the HPE automation work goes here.]',
      litany: 'bots and bottlenecks, tedium and time, agents before agents',
      tint: '#ece9e3',
    },
  },
  {
    id: 'nutanix',
    title: 'Support progress tool',
    meta: 'Nutanix · 2021',
    line: 'from SRE work to an internal tool for watching support staff grow.',
    x: 0.88, y: 0.44,
    plate: {
      src: 'https://picsum.photos/seed/hs-floor/1400/980',
      placeholder: true,
      alt: '[Placeholder photograph — the Nutanix support tool goes here.]',
      litany: 'tickets and growth, uptime and people, a tool for the support floor',
      tint: '#eeeae2',
    },
  },

  // ── make · wonder — top left: this site, made to find out ────────────────
  {
    id: 'patronus',
    title: 'Patronus',
    meta: 'this site',
    line: 'every visitor is given a name, and a creature drawn in dots.',
    x: -0.46, y: 0.5,
    plate: { alt: '[Three creatures drawn in scattered dots: a fox, a moth, a heron.]' },
  },
  {
    id: 'sitevoice',
    title: 'Site voice',
    meta: 'this site',
    line: 'the margins talk back, now and then.',
    x: -0.72, y: 0.18,
    plate: {
      src: 'https://picsum.photos/seed/hs-margins/1400/980',
      placeholder: true,
      alt: '[Placeholder photograph — a capture of the site voice goes here.]',
      litany: 'built a lot of this in march. the grey helps somehow.',
      tint: '#efede7',
    },
  },
]

// gather · work and gather · wonder stay honest until there's a real Are.na
// handle to read from. The visitor is the one thing already gathered.

export function quadrantOf(p: { x: number; y: number }): Quadrant {
  return `${p.y >= 0 ? 'make' : 'gather'}-${p.x >= 0 ? 'work' : 'wonder'}` as Quadrant
}

export const QUADRANT_ORDER: Quadrant[] = ['make-work', 'make-wonder', 'gather-work', 'gather-wonder']

export const QUADRANT_LABEL: Record<Quadrant, string> = {
  'make-work': 'make · work',
  'make-wonder': 'make · wonder',
  'gather-work': 'gather · work',
  'gather-wonder': 'gather · wonder',
}

export const QUADRANT_NOTE: Record<Quadrant, string> = {
  'make-work': 'things made to be used — applied, shipped, accountable.',
  'make-wonder': 'things made to find out.',
  'gather-work': 'references kept because a problem needed them.',
  'gather-wonder': 'things kept because they pulled.',
}

export type Pole = 'make' | 'gather' | 'work' | 'wonder'

// Short gloss shown beneath each axis word, always.
export const AXIS_GLOSS: Record<Pole, string> = {
  make: 'things produced',
  gather: 'things kept',
  work: 'applied, shipped',
  wonder: 'open-ended',
}

export const AXIS: Record<Pole, { definition: string; lives: string }> = {
  make:   { definition: 'things Harshita produced — shipped, prototyped, built.', lives: 'product work, studies, this site' },
  gather: { definition: 'things she collected, kept, and arranged.',              lives: 'references, channels, and you' },
  work:   { definition: 'practical, applied — product and systems with outcomes.', lives: 'Salesloft, GitHub, Sony, HPE, Nutanix' },
  wonder: { definition: 'exploratory, aesthetic, research-y, open-ended.',        lives: 'experiments, playgrounds, taste' },
}

export function countAt(pole: Pole, visitor: boolean): number {
  const n = ENTRIES.filter(e =>
    pole === 'make' ? e.y >= 0 : pole === 'gather' ? e.y < 0 : pole === 'work' ? e.x >= 0 : e.x < 0,
  ).length
  return n + (visitor && (pole === 'gather' || pole === 'wonder') ? 1 : 0)
}

// The catalogue voice: a year, and the kind of work — shown under each title.
export const CAPTION: Record<string, { year: string; kind: string }> = {
  influence: { year: '2025', kind: 'product design' },
  ai_email:  { year: '2025', kind: 'product design' },
  github:    { year: '2024', kind: 'research' },
  sony:      { year: 'UW',   kind: 'product design' },
  hpe:       { year: '2021', kind: 'automation' },
  nutanix:   { year: '2021', kind: 'internal tools' },
  patronus:  { year: '2026', kind: 'this site' },
  sitevoice: { year: '2026', kind: 'this site' },
}

export function entryById(id: string): Entry | undefined {
  return ENTRIES.find(e => e.id === id)
}

// SiteVoice listens for these section names.
export function svSection(p: { x: number }) {
  return p.x >= 0 ? 'work' : 'explorations'
}

// Verified résumé facts only (from the experience list already on the site).
export const EXPERIENCE = [
  { role: 'Product Designer', org: 'Salesloft', when: '2025 — now' },
  { role: 'Graduate Product Designer', org: 'GitHub', when: '2024' },
  { role: 'M.S. Human Centered Design & Engineering', org: 'University of Washington', when: '2023 — 2025' },
  { role: 'Software Designer → UX Designer', org: 'Hewlett Packard Enterprise', when: '2021 — 2023' },
  { role: 'UX Developer Intern', org: 'Nutanix', when: '2021' },
]

export const CONTACT = {
  email: 'hello@harshitashyale.com',
  linkedin: 'https://linkedin.com/in/harshitashyale',
}
