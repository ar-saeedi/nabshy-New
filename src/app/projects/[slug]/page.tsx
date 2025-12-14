import ProjectDetail from '@/components/project-detail'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function DynamicProjectPage({ params }: PageProps) {
  const { slug } = await params
  return <ProjectDetail projectId={slug} />
}
