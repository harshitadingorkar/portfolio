'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface Block {
  id: string
  content_url: string | null
  type: string
}

export default function GaragePage() {
  const [portrait, setPortrait] = useState<string>('')
  const [blocks, setBlocks] = useState<Block[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const portraitRes = await fetch('/api/portrait-text')
        if (portraitRes.ok) {
          setPortrait(await portraitRes.text())
        }

        const blocksRes = await fetch('/api/taste-blocks?limit=12')
        if (blocksRes.ok) {
          const data = await blocksRes.json()
          setBlocks(data.blocks)
        }
      } catch (err) {
        console.error('Failed to fetch garage data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const portraitSummary = portrait
    .split('\n\n')[1]
    ?.replace(/^# who I am as a creative person\n\n/, '')

  const imageBlocks = blocks.filter((b) => b.type === 'image' && b.content_url)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#c3bcaa' }}>
      {/* Back button */}
      <div className="fixed top-8 left-8 z-50">
        <Link
          href="/"
          className="font-mono text-sm text-ink-muted hover:text-ink transition-colors"
        >
          ← back
        </Link>
      </div>

      {/* Main content */}
      <motion.div
        className="max-w-6xl mx-auto px-12 py-24"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero section */}
        <motion.div variants={itemVariants} className="mb-24">
          <h1 className="text-6xl font-display mb-8">the garage door is open</h1>
          {portraitSummary && (
            <p className="text-lg max-w-2xl leading-relaxed text-ink-muted">
              {portraitSummary}
            </p>
          )}
        </motion.div>

        {/* Live images gallery */}
        <motion.div variants={itemVariants} className="mb-24">
          <p className="font-mono text-xs text-ink-muted uppercase tracking-widest mb-8">
            live collected
          </p>
          {loading ? (
            <div className="text-sm text-ink-muted">loading...</div>
          ) : imageBlocks.length > 0 ? (
            <div className="grid grid-cols-3 gap-6">
              {imageBlocks.map((block) => (
                <div
                  key={block.id}
                  className="aspect-square relative rounded-lg overflow-hidden bg-bg-subtle border border-border"
                >
                  {block.content_url && (
                    <Image
                      src={block.content_url}
                      alt="Collected image"
                      fill
                      className="object-cover hover:scale-110 transition-transform duration-500"
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-ink-muted">no images yet</div>
          )}
        </motion.div>

        {/* Full portrait */}
        {portrait && (
          <motion.div variants={itemVariants} className="max-w-2xl">
            <p className="font-mono text-xs text-ink-muted uppercase tracking-widest mb-6">
              full portrait
            </p>
            <div
              className="prose prose-sm max-w-none font-mono text-sm text-ink leading-relaxed space-y-4"
              style={{
                '--tw-prose-body': 'var(--ink)',
                '--tw-prose-headings': 'var(--ink)',
                '--tw-prose-links': 'var(--accent)',
              } as any}
            >
              {portrait.split('\n\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
