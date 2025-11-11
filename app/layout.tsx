import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Emlak - Gayrimenkul Portalı',
  description: 'Hayalinizdeki evi bulun',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  )
}
