import type { Metadata } from 'next'
import { Playfair_Display, IBM_Plex_Mono, Manrope, IM_Fell_English, Courier_Prime, Ballet } from 'next/font/google'
import Providers from '@/components/Providers'
import SiteVoice from '@/components/SiteVoice'
import DevEditTool from '@/components/DevEditTool'
import '@/styles/globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['300', '400'],
  style: ['normal', 'italic'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
})

// IM Fell English — Igino Marini's revival of the 17th-century Fell types. Inky and
// irregular, a naturalist's notebook. One weight only: never set it bold or light.
const fell = IM_Fell_English({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
})

// Courier Prime — the screenwriting typewriter. Metadata reads like stage directions.
const courierPrime = Courier_Prime({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-courier',
  display: 'swap',
})

// Ballet — a high-contrast formal script with an optical-size axis. Used once:
// her name, at the origin.
const ballet = Ballet({
  subsets: ['latin'],
  axes: ['opsz'],
  variable: '--font-script',
  display: 'swap',
})

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-manrope',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Harshita Shyale — Product Designer',
  description:
    'Product Designer based in Seattle, specializing in human-centered AI interfaces and systems.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${playfair.variable} ${ibmPlexMono.variable} ${manrope.variable} ${fell.variable} ${courierPrime.variable} ${ballet.variable}`}
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Averia+Serif+Libre:ital,wght@0,400;1,400&display=swap"
          rel="stylesheet"
        />
        {/* Runs before any JS — prevents a flash of the wrong ground on load */}
        <style>{`html,body{background-color:#BCE4C5}`}</style>
      </head>
      <body style={{ backgroundColor: '#BCE4C5' }}>
        <Providers>
          {children}
          <SiteVoice />
          <DevEditTool />
        </Providers>
      </body>
    </html>
  )
}
