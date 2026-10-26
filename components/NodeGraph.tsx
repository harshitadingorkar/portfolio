'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

// ── Types ─────────────────────────────────────────────────────────────────
type NodeId =
  | 'harshita' | 'ai_ml' | 'ux_research' | 'research' | 'systems'
  | 'influence' | 'ai_email' | 'github' | 'sony'
  | 'theatre' | 'photography'

type NodeKind = 'root' | 'category' | 'image' | 'faded'

interface GraphNode {
  id: NodeId
  x: number
  y: number
  kind: NodeKind
  label: string
  sublabel?: string
  route?: string
  image?: string
  company?: string
  year?: string
  description?: string
}

interface GraphEdge {
  from: NodeId
  to: NodeId
  dashed?: boolean
}

// ── Data — these are each node's fully-bloomed position ─────────────────────
const CENTER = { x: 415, y: 290 }
const IMG_W = 108
const IMG_H = 72

const NODES: GraphNode[] = [
  { id: 'harshita', x: CENTER.x, y: CENTER.y, kind: 'root', label: 'Harshita Shyale', sublabel: 'Product Designer' },

  { id: 'ai_ml',       x: 250, y: 195, kind: 'category', label: 'AI & ML' },
  { id: 'ux_research', x: 575, y: 182, kind: 'category', label: 'UX Research' },
  { id: 'research',    x: 252, y: 392, kind: 'category', label: 'Research' },
  { id: 'systems',     x: 568, y: 405, kind: 'category', label: 'Systems' },

  {
    id: 'influence', x: 100, y: 112, kind: 'image', label: 'Influence Graph',
    route: '/work/influence-graph', company: 'Salesloft', year: '2024',
    image: 'https://picsum.photos/seed/influence-graph/400/260',
    description: 'AI-powered relationship intelligence for enterprise sales — surfacing hidden stakeholder paths across accounts.',
  },
  {
    id: 'ai_email', x: 372, y: 58, kind: 'image', label: 'AI Email Assistant',
    route: '/work/ai-email-assistant', company: 'Salesloft', year: '2023',
    image: 'https://picsum.photos/seed/ai-email-assistant/400/260',
    description: 'Generative email with built-in explainability — reps build intuition instead of just clicking accept.',
  },
  {
    id: 'github', x: 712, y: 96, kind: 'image', label: 'GitHub Pull Requests',
    route: '/work/github', company: 'GitHub', year: '2022',
    image: 'https://picsum.photos/seed/github-prs/400/260',
    description: 'Code review UX research across 50M+ developers — an accessibility paradox that nearly shipped.',
  },
  {
    id: 'sony', x: 726, y: 328, kind: 'image', label: 'Sony Audio',
    route: '/work/sony', company: 'Sony', year: '2021',
    image: 'https://picsum.photos/seed/sony-audio/400/260',
    description: 'Hardware-software interaction design for next-gen audio onboarding.',
  },

  { id: 'theatre',     x: 600, y: 60,  kind: 'faded', label: 'Theatre' },
  { id: 'photography', x: 90,  y: 498, kind: 'faded', label: 'Photography' },
]

const EDGES: GraphEdge[] = [
  { from: 'harshita',    to: 'ai_ml' },
  { from: 'harshita',    to: 'ux_research' },
  { from: 'harshita',    to: 'research' },
  { from: 'harshita',    to: 'systems' },
  { from: 'ai_ml',       to: 'influence' },
  { from: 'ai_ml',       to: 'ai_email' },
  { from: 'ux_research', to: 'github' },
  { from: 'ux_research', to: 'sony' },
  { from: 'ux_research', to: 'theatre', dashed: true },
  { from: 'research',    to: 'photography', dashed: true },
]

// How far each ring sits from center while closed — the ring a node belongs
// to (by hop count from the center) determines how tightly it nests when
// the graph is dormant, so the bloom unfurls outward in visible waves
// rather than every node snapping open at once.
const RING_CLOSED_FRACTION: Record<number, number> = {
  1: 0.3,   // AI & ML / UX Research / Research / Systems — nearest the center
  2: 0.18,  // project thumbnails / Theatre / Photography
}
const hopFromCenter = (id: NodeId): number =>
  id === 'harshita' ? 0 : EDGES.some(e => e.from === 'harshita' && e.to === id) ? 1 : 2

function closedOffset(node: GraphNode) {
  if (node.kind === 'root') return { x: 0, y: 0 }
  const hop = hopFromCenter(node.id)
  const fraction = RING_CLOSED_FRACTION[hop] ?? 0.22
  return {
    x: (node.x - CENTER.x) * -(1 - fraction),
    y: (node.y - CENTER.y) * -(1 - fraction),
  }
}

// Pill width from label length — mirrors dmcg.co's text-fitted taxonomy chips
function pillWidth(label: string, padding = 28) {
  return Math.round(label.length * 6.3 + padding)
}

// ── Pill node (root / category / faded) ─────────────────────────────────────
function Pill({ node, isActive, dimmed }: { node: GraphNode; isActive: boolean; dimmed: boolean }) {
  const { x, y, label, sublabel, kind } = node
  const isRoot = kind === 'root'
  const isFaded = kind === 'faded'
  const h = isRoot ? 30 : 24
  const w = pillWidth(label, isRoot ? 36 : 26)

  return (
    <>
      <rect
        x={x - w / 2} y={y - h / 2}
        width={w} height={h}
        rx={h / 2}
        fill={isRoot ? 'var(--ink)' : isActive ? 'var(--ink)' : 'var(--bg)'}
        stroke={isFaded ? 'var(--ink-faint)' : 'var(--ink)'}
        strokeWidth="0.9"
        strokeDasharray={isFaded ? '3,3' : undefined}
        style={{ transition: 'fill 0.15s ease' }}
      />
      <text
        x={x} y={y + (isRoot ? 1 : 0.5)}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={isRoot ? 11 : 10}
        fontFamily="var(--font-ibm-plex-mono)"
        fill={isRoot || isActive ? 'var(--bg)' : isFaded ? 'var(--ink-faint)' : 'var(--ink)'}
        style={{ pointerEvents: 'none', transition: 'fill 0.15s ease' }}
      >
        {label}
      </text>
      {sublabel && (
        <text
          x={x} y={y + h / 2 + 14}
          textAnchor="middle"
          fontSize="8.5"
          fontFamily="var(--font-ibm-plex-mono)"
          fill="var(--ink-faint)"
          style={{ pointerEvents: 'none' }}
        >
          {sublabel}
        </text>
      )}
    </>
  )
}

// ── Image card node — dmcg.co-style thumbnail with title underneath ─────────
function ImageCard({ node }: { node: GraphNode }) {
  const { x, y, label, image, id } = node
  const clipId = `clip-${id}`

  return (
    <>
      <defs>
        <clipPath id={clipId}>
          <rect x={x - IMG_W / 2} y={y - IMG_H / 2} width={IMG_W} height={IMG_H} rx={6} />
        </clipPath>
      </defs>
      <image
        href={image}
        x={x - IMG_W / 2} y={y - IMG_H / 2}
        width={IMG_W} height={IMG_H}
        clipPath={`url(#${clipId})`}
        preserveAspectRatio="xMidYMid slice"
      />
      <rect
        x={x - IMG_W / 2} y={y - IMG_H / 2}
        width={IMG_W} height={IMG_H}
        rx={6}
        fill="none"
        stroke="var(--border)"
        strokeWidth="1"
      />
      <text
        x={x} y={y + IMG_H / 2 + 16}
        textAnchor="middle"
        fontSize="10"
        fontFamily="var(--font-ibm-plex-mono)"
        fill="var(--ink)"
        style={{ pointerEvents: 'none' }}
      >
        {label}
      </text>
    </>
  )
}

// ── Node element ──────────────────────────────────────────────────────────
function NodeEl({
  node,
  isActive,
  dimmed,
  bloomed,
  delay,
  onEnter,
  onLeave,
  onClick,
}: {
  node: GraphNode
  isActive: boolean
  dimmed: boolean
  bloomed: boolean
  delay: number
  onEnter: () => void
  onLeave: () => void
  onClick: () => void
}) {
  const { x, y, kind } = node
  const restOpacity = kind === 'faded' ? (dimmed ? 0.12 : 0.32) : dimmed ? 0.15 : 1
  const isImage = kind === 'image'
  const hitR = isImage ? Math.max(IMG_W, IMG_H) / 2 + 6 : 28

  const closed = closedOffset(node)
  // Image cards are much bigger than pills, so they need to shrink a lot
  // more while dormant or they overlap into a messy pile at the center.
  const closedScale = kind === 'root' ? 1 : isImage ? 0.32 : 0.62
  const closedOpacity = kind === 'root' ? 1 : isImage ? 0.4 : 0.55

  return (
    <motion.g
      initial={false}
      animate={{
        x: bloomed ? 0 : closed.x,
        y: bloomed ? 0 : closed.y,
        opacity: bloomed ? restOpacity : closedOpacity,
        scale: bloomed ? 1 : closedScale,
      }}
      transition={{
        type: 'spring',
        stiffness: 160,
        damping: 16,
        mass: 0.7,
        delay: bloomed ? delay : delay * 0.4,
      }}
      style={{ transformOrigin: `${x}px ${y}px` }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={onClick}
    >
      <g style={{ cursor: isImage && bloomed ? 'pointer' : 'default' }}>
        {!isImage && <circle cx={x} cy={y} r={hitR} fill="transparent" />}
        {isImage ? (
          <ImageCard node={node} />
        ) : (
          <Pill node={node} isActive={isActive} dimmed={dimmed} />
        )}
      </g>
    </motion.g>
  )
}

// ── Edge element — draws itself in as the graph blooms ──────────────────────
function EdgeEl({ edge, from, to, isRelated, hasFocus, bloomed, delay }: {
  edge: GraphEdge
  from: GraphNode
  to: GraphNode
  isRelated: boolean
  hasFocus: boolean
  bloomed: boolean
  delay: number
}) {
  const fromClosed = closedOffset(from)
  const toClosed = closedOffset(to)

  return (
    <motion.line
      x1={from.x + fromClosed.x}
      y1={from.y + fromClosed.y}
      x2={to.x + toClosed.x}
      y2={to.y + toClosed.y}
      stroke="var(--ink)"
      strokeDasharray={edge.dashed ? '4,4' : undefined}
      initial={false}
      animate={{
        x1: bloomed ? from.x : from.x + fromClosed.x,
        y1: bloomed ? from.y : from.y + fromClosed.y,
        x2: bloomed ? to.x : to.x + toClosed.x,
        y2: bloomed ? to.y : to.y + toClosed.y,
        opacity: bloomed ? (hasFocus ? (isRelated ? 0.5 : 0.1) : 0.3) : 0.2,
        strokeWidth: isRelated ? 0.9 : 0.65,
      }}
      transition={{
        x1: { type: 'spring', stiffness: 160, damping: 16, mass: 0.7, delay: bloomed ? delay : delay * 0.4 },
        y1: { type: 'spring', stiffness: 160, damping: 16, mass: 0.7, delay: bloomed ? delay : delay * 0.4 },
        x2: { type: 'spring', stiffness: 160, damping: 16, mass: 0.7, delay: bloomed ? delay : delay * 0.4 },
        y2: { type: 'spring', stiffness: 160, damping: 16, mass: 0.7, delay: bloomed ? delay : delay * 0.4 },
        opacity: { duration: 0.3, delay: bloomed ? delay : 0 },
        strokeWidth: { duration: 0.18 },
      }}
    />
  )
}

// ── Lightbox — click an image node to pop it open, dmcg-style ───────────────
function Lightbox({ node, onClose, onViewCaseStudy }: { node: GraphNode; onClose: () => void; onViewCaseStudy: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(20,18,15,0.55)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '32px',
      }}
    >
      <motion.div
        onClick={e => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 6 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        style={{
          width: 'min(640px, 100%)',
          background: 'var(--bg)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 30px 70px rgba(0,0,0,0.3)',
        }}
      >
        <img
          src={node.image}
          alt={node.label}
          style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', display: 'block' }}
        />
        <div style={{ padding: '20px 24px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '8px' }}>
            <h3 style={{ fontFamily: 'var(--font-playfair)', fontSize: '20px', fontWeight: 400, color: 'var(--ink)', margin: 0 }}>
              {node.label}
            </h3>
            <button
              onClick={onClose}
              aria-label="Close"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-faint)', fontSize: '16px', padding: 0, lineHeight: 1 }}
            >
              ×
            </button>
          </div>
          <p style={{ fontFamily: 'var(--font-ibm-plex-mono)', fontSize: '9.5px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-faint)', marginBottom: '12px' }}>
            {node.company} · {node.year}
          </p>
          <p style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '13px', color: 'var(--ink-muted)', lineHeight: 1.7, marginBottom: '18px' }}>
            {node.description}
          </p>
          <button
            onClick={onViewCaseStudy}
            style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              fontFamily: 'var(--font-ibm-plex-mono)', fontSize: '10px', letterSpacing: '0.1em',
              textTransform: 'uppercase', color: 'var(--ink)',
              borderBottom: '1px solid var(--ink)', paddingBottom: '2px',
            }}
          >
            View case study →
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Main export ───────────────────────────────────────────────────────────
export default function NodeGraph({
  activeNodeId,
  onNodeEnter,
  onNodeLeave,
}: {
  activeNodeId: string | null
  onNodeEnter: (id: string) => void
  onNodeLeave: () => void
}) {
  const router = useRouter()
  const [bloomed, setBloomed] = useState(false)
  const [expandedId, setExpandedId] = useState<NodeId | null>(null)

  const nodeMap = new Map(NODES.map(n => [n.id, n]))
  const expandedNode = expandedId ? nodeMap.get(expandedId) ?? null : null

  const relatedIds = new Set<string>()
  if (activeNodeId) {
    relatedIds.add(activeNodeId)
    EDGES.forEach(e => {
      if (e.from === activeNodeId) relatedIds.add(e.to)
      if (e.to === activeNodeId) relatedIds.add(e.from)
    })
  }
  const hasFocus = activeNodeId !== null

  // Stagger by distance from center so the bloom unfurls outward in rings
  // rather than every node moving in lockstep.
  const delayFor = (id: NodeId) => hopFromCenter(id) * 0.06

  return (
    <>
      <svg
        viewBox="0 0 820 560"
        width="100%"
        height="100%"
        style={{ display: 'block', userSelect: 'none', cursor: bloomed ? 'default' : 'pointer' }}
        onMouseEnter={() => setBloomed(true)}
        onMouseLeave={() => { setBloomed(false); onNodeLeave() }}
      >
        {/* Edges */}
        {EDGES.map(edge => {
          const from = nodeMap.get(edge.from)!
          const to = nodeMap.get(edge.to)!
          const isRelated = hasFocus && (edge.from === activeNodeId || edge.to === activeNodeId)
          return (
            <EdgeEl
              key={`${edge.from}-${edge.to}`}
              edge={edge}
              from={from}
              to={to}
              isRelated={isRelated}
              hasFocus={hasFocus}
              bloomed={bloomed}
              delay={Math.min(delayFor(edge.from), delayFor(edge.to))}
            />
          )
        })}

        {/* Nodes */}
        {NODES.map(node => {
          const isActive = activeNodeId === node.id
          const dimmed = hasFocus && !relatedIds.has(node.id)
          return (
            <NodeEl
              key={node.id}
              node={node}
              isActive={isActive}
              dimmed={dimmed}
              bloomed={bloomed}
              delay={delayFor(node.id)}
              onEnter={() => bloomed && onNodeEnter(node.id)}
              onLeave={onNodeLeave}
              onClick={() => {
                if (!bloomed) return
                if (node.kind === 'image') setExpandedId(node.id)
              }}
            />
          )
        })}
      </svg>

      <AnimatePresence>
        {expandedNode && (
          <Lightbox
            node={expandedNode}
            onClose={() => setExpandedId(null)}
            onViewCaseStudy={() => { if (expandedNode.route) router.push(expandedNode.route) }}
          />
        )}
      </AnimatePresence>
    </>
  )
}
