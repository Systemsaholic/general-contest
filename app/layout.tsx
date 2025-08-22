import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

export const metadata: Metadata = {
  title: 'Phoenix Voyages Golf Tee Contest - Win a $250 Vacation Voucher',
  description: 'Enter the Phoenix Voyages golf tee guessing contest for a chance to win a $250 vacation voucher. Guess the number of golf tees and win!',
  generator: 'v0.dev',
  keywords: 'phoenix voyages, contest, vacation voucher, golf tee contest, win vacation, travel contest',
  openGraph: {
    title: 'Win a $250 Vacation Voucher!',
    description: 'Guess the number of golf tees in the jar and win with Phoenix Voyages',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  )
}
