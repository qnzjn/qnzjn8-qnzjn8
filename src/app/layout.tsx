import type { Metadata } from 'next'
import './globals.css'
import Navbar from './components/Navbar'

export const metadata: Metadata = {
  title: 'Next.js VanillaJS App',
  description: 'Created with Next.js and VanillaJS',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>
        <Navbar />
        <main style={{ paddingTop: '80px' }}>{children}</main>
      </body>
    </html>
  )
}
