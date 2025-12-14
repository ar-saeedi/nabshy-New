import type { Metadata } from 'next'
import Database from '@/components/database'

export const metadata: Metadata = {
  title: 'database',
}

export default function DatabasePage() {
  return <Database />
}
