'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface Block {
  id: string
  content_url: string | null
  type: string
}

interface NowPreviewProps {
  isHovered: boolean
}

export default function NowPreview({ isHovered }: NowPreviewProps) {
  const [portrait, setPortrait] = useState<string>('')
  const [blocks, setBlocks] = useState<Block[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch me.md portrait
        const portraitRes = await fetch('/api/portrait-text')
        if (portraitRes.ok) {
          const text = await portraitRes.text()
          setPortrait(text)
        }

        // Fetch latest image blocks from taste channel
        const blocksRes = await fetch('/api/taste-blocks')
        if (blocksRes.ok) {
          const data = await blocksRes.json()
          setBlocks(data.blocks)
        }
      } catch (err) {
        console.error('Failed to fetch preview data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const portraitSummary = portrait
    .split('\n\n')[1]
    ?.replace(/^# who I am as a creative person\n\n/, '')
    .slice(0, 250)

  const imageBlocks = blocks.filter((b) => b.type === 'image' && b.content_url)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 10, filter: 'blur(4px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5 } },
  }

  return (
    <motion.div
      className="absolute left-12 top-1/2 -translate-y-1/2 max-w-sm space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate={isHovered ? 'visible' : 'hidden'}
      transition={{ duration: 0.4 }}
    >
      {/* Live stream card — images */}
      <motion.div
        variants={cardVariants}
        className="border border-border bg-bg-subtle rounded-lg overflow-hidden"
      >
        <div className="px-4 py-2 border-b border-border flex items-center justify-between">
          <span className="text-[11px] font-mono text-ink-muted uppercase tracking-widest">
            live stream
          </span>
          <motion.span
            className="text-[10px] text-accent font-bold"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ● live
          </motion.span>
        </div>

        {loading ? (
          <div className="aspect-video bg-bg-subtle flex items-center justify-center">
            <span className="text-xs text-ink-muted">loading...</span>
          </div>
        ) : imageBlocks.length > 0 ? (
          <div className="aspect-video relative bg-bg-subtle">
            {imageBlocks[0]?.content_url && (
              <Image
                src={imageBlocks[0].content_url}
                alt="Live preview"
                fill
                className="object-cover"
              />
            )}
          </div>
        ) : (
          <div className="aspect-video bg-bg-subtle flex items-center justify-center">
            <span className="text-xs text-ink-muted">no images yet</span>
          </div>
        )}
      </motion.div>

      {/* Logic card — who I am */}
      <motion.div
        variants={cardVariants}
        className="border border-border bg-bg-subtle rounded-lg p-4"
      >
        <p className="text-[11px] font-mono text-ink-muted uppercase tracking-widest mb-3">
          who I am
        </p>
        <p
          className="text-sm leading-relaxed text-ink"
          style={{ fontFamily: 'var(--font-ibm-plex-mono)' }}
        >
          {portraitSummary || (
            <span className="text-ink-muted italic">
              run npm run portrait to generate portrait...
            </span>
          )}
        </p>
      </motion.div>
    </motion.div>
  )
}
