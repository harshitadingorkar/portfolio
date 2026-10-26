'use client'

import { motion } from 'framer-motion'

export type IndexItem = 'now' | 'work' | 'info' | 'contact'

interface IndexProps {
  onHover: (item: IndexItem | null) => void
  hovered: IndexItem | null
}

const ITEMS: { id: IndexItem; label: string; badge?: string }[] = [
  { id: 'now', label: 'NOW', badge: 'LIVE' },
  { id: 'work', label: 'WORK' },
  { id: 'info', label: 'INFO' },
  { id: 'contact', label: 'CONTACT' },
]

export default function Index({ onHover, hovered }: IndexProps) {
  return (
    <motion.div
      className="fixed right-0 top-0 h-screen flex flex-col justify-center pr-8 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.6 }}
    >
      <nav className="space-y-6">
        {ITEMS.map((item) => (
          <motion.button
            key={item.id}
            onMouseEnter={() => onHover(item.id)}
            onMouseLeave={() => onHover(null)}
            className="text-right block text-sm font-mono tracking-wide relative group"
            whileHover={{ letterSpacing: '0.05em' }}
            transition={{ duration: 0.3 }}
          >
            <span
              className={`transition-all duration-300 ${
                hovered === item.id ? 'text-white' : 'text-ink-muted opacity-50'
              }`}
            >
              {item.label}
            </span>

            {/* Pulsing badge for NOW */}
            {item.badge && hovered === item.id && (
              <motion.span
                className="ml-3 inline-block text-[10px] font-bold tracking-widest text-accent"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ● {item.badge}
              </motion.span>
            )}

            {/* Underline accent on hover */}
            <motion.div
              className="absolute -bottom-1 right-0 h-px bg-accent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: hovered === item.id ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              style={{ transformOrigin: 'right' }}
            />
          </motion.button>
        ))}
      </nav>
    </motion.div>
  )
}
