import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'Harshita Shyale — Product Designer',
  description: 'Product designer based in Seattle. Specializing in human-centered AI interfaces and systems.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&family=IBM+Plex+Mono:ital,wght@0,300;0,400;1,300;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeProvider attribute="data-theme" defaultTheme="light" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
