import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  weight: ['200', '400', '500', '700'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Nabshy New - Branding Studio',
  description: 'Modern branding studio website built with React, Next.js, TypeScript, and Tailwind CSS. Specializing in elevating brands through the power of storytelling.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
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

