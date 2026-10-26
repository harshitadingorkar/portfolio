'use client'

import { IndexItem } from './Index'
import NowPreview from './NowPreview'
import WorkPreview from './WorkPreview'

interface PreviewCanvasProps {
  hovered: IndexItem | null
}

export default function PreviewCanvas({ hovered }: PreviewCanvasProps) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <NowPreview isHovered={hovered === 'now'} />
      <WorkPreview isHovered={hovered === 'work'} />
    </div>
  )
}
