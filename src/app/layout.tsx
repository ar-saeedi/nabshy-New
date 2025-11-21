import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import './globals.css'

const montserrat = localFont({
  src: [
    {
      path: '../../fonts/Montserrat-Thin.ttf',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../../fonts/Montserrat-ThinItalic.ttf',
      weight: '100',
      style: 'italic',
    },
    {
      path: '../../fonts/Montserrat-ExtraLight.ttf',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../../fonts/Montserrat-ExtraLightItalic.ttf',
      weight: '200',
      style: 'italic',
    },
    {
      path: '../../fonts/Montserrat-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../fonts/Montserrat-LightItalic.ttf',
      weight: '300',
      style: 'italic',
    },
    {
      path: '../../fonts/Montserrat-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../fonts/Montserrat-Italic.ttf',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../../fonts/Montserrat-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../fonts/Montserrat-MediumItalic.ttf',
      weight: '500',
      style: 'italic',
    },
    {
      path: '../../fonts/Montserrat-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../fonts/Montserrat-SemiBoldItalic.ttf',
      weight: '600',
      style: 'italic',
    },
    {
      path: '../../fonts/Montserrat-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../fonts/Montserrat-BoldItalic.ttf',
      weight: '700',
      style: 'italic',
    },
    {
      path: '../../fonts/Montserrat-ExtraBold.ttf',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../../fonts/Montserrat-ExtraBoldItalic.ttf',
      weight: '800',
      style: 'italic',
    },
    {
      path: '../../fonts/Montserrat-Black.ttf',
      weight: '900',
      style: 'normal',
    },
    {
      path: '../../fonts/Montserrat-BlackItalic.ttf',
      weight: '900',
      style: 'italic',
    },
  ],
  variable: '--font-montserrat',
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
      <body className={`${montserrat.variable} font-montserrat antialiased`}>
        {children}
      </body>
    </html>
  )
}

