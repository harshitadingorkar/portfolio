'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const CASE_STUDIES = [
  {
    id: 'github',
    title: 'Pull Request Experience',
    org: 'GitHub',
    img: '/work-3.jpg',
    route: '/work/github',
  },
  {
    id: 'ai_email',
    title: 'AI Email Assistant',
    org: 'Salesloft',
    img: '/work-2.jpg',
    route: '/work/salesloft',
  },
  {
    id: 'sony',
    title: 'Sustainable Customer Experience',
    org: 'Sony',
    img: '/work-4.jpg',
    route: '/work/sony',
  },
  {
    id: 'influence',
    title: 'AI Observability',
    org: 'HPE',
    img: '/work-1.jpg',
    route: '/work/hpe',
  },
]

interface WorkPreviewProps {
  isHovered: boolean
}

export default function WorkPreview({ isHovered }: WorkPreviewProps) {
  const router = useRouter()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.05 },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 15, filter: 'blur(6px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5 } },
  }

  return (
    <motion.div
      className="absolute left-12 top-1/2 -translate-y-1/2 max-w-lg"
      variants={containerVariants}
      initial="hidden"
      animate={isHovered ? 'visible' : 'hidden'}
      transition={{ duration: 0.4 }}
    >
      <div className="grid grid-cols-2 gap-4">
        {CASE_STUDIES.map((study) => (
          <motion.button
            key={study.id}
            variants={cardVariants}
            onClick={() => router.push(study.route)}
            className="group relative aspect-square rounded-lg overflow-hidden border border-border hover:border-accent transition-colors"
          >
            <Image
              src={study.img}
              alt={study.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-end justify-end p-3">
              <p className="text-white text-[10px] font-mono uppercase tracking-widest text-right">
                {study.title}
              </p>
              <p className="text-white/70 text-[9px] font-mono text-right mt-1">
                {study.org}
              </p>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}
