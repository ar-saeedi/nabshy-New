import type { Metadata } from 'next'
import Contact from '@/components/contact'

export const metadata: Metadata = {
  title: 'contact us',
}

export default function ContactPage() {
  return <Contact />
}
