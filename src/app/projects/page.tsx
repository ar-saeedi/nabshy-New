import { Suspense } from 'react'
import Projects from '@/components/projects'

export default function ProjectsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0D0D0D]" />}>
      <Projects />
    </Suspense>
  )
}
