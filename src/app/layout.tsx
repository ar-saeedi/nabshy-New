import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  weight: ['200', '400', '500', '700'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Reform - Branding Studio',
  description: 'Reform is a branding studio that specializes in elevating brands through the power of storytelling.',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-inter antialiased`}>
        {children}
      </body>
    </html>
  )
}

