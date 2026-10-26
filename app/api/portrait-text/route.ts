import { readFile } from 'fs/promises'
import { join } from 'path'

export async function GET() {
  try {
    // Read the portrait from the taste-engine wiki
    const portraitPath = join(process.cwd(), '..', 'taste-engine', 'wiki', 'me.md')
    const portrait = await readFile(portraitPath, 'utf-8')
    return new Response(portrait, {
      headers: { 'Content-Type': 'text/markdown' },
    })
  } catch (err) {
    console.error('Failed to read portrait:', err)
    return new Response('portrait not yet generated', { status: 404 })
  }
}
