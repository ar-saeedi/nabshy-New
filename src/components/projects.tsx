'use client'

import Link from 'next/link'
import { useEffect, useRef, useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'

interface Project {
  id: string
  title: string
  subtitle: string
  image: string
  href: string
  features: string[]
  order?: number
}

interface FooterContent {
  navigation: Array<{ label: string; href: string }>
  social: Array<{ label: string; href: string }>
  ctaTitle: string
  brandName: string
  copyright: string
}

interface ProjectsPageContent {
  title: string
  filters: string[]
  ctaHeading: string[]
}

interface ContentData {
  projectsPage: ProjectsPageContent
  projects: Project[]
  homepage: { footer: FooterContent }
}

export default function Projects() {
  const [content, setContent] = useState<ContentData | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const footerRef = useRef<HTMLDivElement>(null)
  const [footerProgress, setFooterProgress] = useState(0)
  const [activeFilter, setActiveFilter] = useState('ALL')
  const [isTransitioning, setIsTransitioning] = useState(false)
  const searchParams = useSearchParams()
  const initializedFromQuery = useRef(false)

  const normalizeTag = (tag: unknown) => String(tag ?? '').trim().toLowerCase()
  const slugifyTag = (tag: unknown) =>
    normalizeTag(tag)
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

  const fetchContent = useCallback(async () => {
    try {
      const res = await fetch('/api/content', { cache: 'no-store' })
      const data = await res.json()
      setContent(data)
    } catch (error) {
      console.error('Error fetching content:', error)
    }
  }, [])

  useEffect(() => {
    fetchContent()
    const interval = setInterval(fetchContent, 2000)
    return () => clearInterval(interval)
  }, [fetchContent])

  useEffect(() => {
    window.scrollTo(0, 0)

    const handleScroll = () => {
      if (footerRef.current) {
        const rect = footerRef.current.getBoundingClientRect()
        const windowHeight = window.innerHeight
        const scrolledIntoFooter = Math.max(0, windowHeight - rect.top)
        const progress = Math.max(0, Math.min(1, scrolledIntoFooter / windowHeight))
        setFooterProgress(progress)
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (initializedFromQuery.current) return

    const tag = searchParams.get('tag')
    if (tag) {
      setActiveFilter(tag)
      initializedFromQuery.current = true
      return
    }

    const category = searchParams.get('category')
    if (!category) {
      initializedFromQuery.current = true
      return
    }

    if (category === 'all') {
      setActiveFilter('ALL')
      initializedFromQuery.current = true
      return
    }

    setActiveFilter(category)
    initializedFromQuery.current = true
  }, [searchParams])

  const handleFilterChange = (filter: string) => {
    if (filter === activeFilter) return
    setIsTransitioning(true)
    setTimeout(() => {
      setActiveFilter(filter)
      setIsTransitioning(false)
      try {
        const next = new URLSearchParams(window.location.search)
        if (filter === 'ALL') next.delete('tag')
        else next.set('tag', filter)
        next.delete('category')
        const q = next.toString()
        window.history.replaceState({}, '', q ? `/projects?${q}` : '/projects')
      } catch {
      }
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 300)
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-black" />
    )
  }

  const projectsPage = content.projectsPage
  const projects = content.projects
  const footer = content.homepage.footer

  const getOrder = (value: unknown) => {
    const n = typeof value === 'number' ? value : Number(value)
    return Number.isFinite(n) ? n : 999999
  }

  const orderedProjects = projects
    .map((p, idx) => ({ p, idx }))
    .sort((a, b) => {
      const d = getOrder(a.p.order) - getOrder(b.p.order)
      return d !== 0 ? d : a.idx - b.idx
    })
    .map(({ p }) => p)

  const derivedTags = (() => {
    const seen = new Set<string>()
    const out: string[] = []
    for (const project of orderedProjects) {
      for (const f of project.features || []) {
        const raw = String(f ?? '').trim()
        if (!raw) continue
        const key = normalizeTag(raw)
        if (seen.has(key)) continue
        seen.add(key)
        out.push(raw)
      }
    }
    return out
  })()

  const resolvedActiveFilter = (() => {
    if (activeFilter === 'ALL') return 'ALL'

    const direct = derivedTags.find(t => normalizeTag(t) === normalizeTag(activeFilter))
    if (direct) return direct

    const bySlug = derivedTags.find(t => slugifyTag(t) === normalizeTag(activeFilter))
    if (bySlug) return bySlug

    return activeFilter
  })()

  const filters = ['ALL', ...derivedTags]

  const filteredProjects = orderedProjects.filter((project) => {
    if (resolvedActiveFilter === 'ALL') return true
    return (project.features || []).some(f => normalizeTag(f) === normalizeTag(resolvedActiveFilter))
  })

  return (
    <div className="min-h-screen bg-black px-4 sm:px-6 md:px-8 py-6 md:py-8">
      <header className="w-full max-w-[1860px] mx-auto flex justify-between items-start gap-4 mb-10 md:mb-16 animate-slide-up">
        <Link href="/" className="text-[20px] xs:text-[22px] sm:text-[24px] md:text-[28px] lg:text-[32px] font-bold text-white leading-none">
          NABSHY
        </Link>

        <nav className="hidden lg:flex flex-row gap-8 lg:gap-12 xl:gap-16">
          <Link href="/projects" className="text-[15px] lg:text-[16px] font-medium text-white hover:opacity-80 transition-opacity border-b-2 border-white pb-1">PROJECTS</Link>
          <Link href="/database" className="text-[15px] lg:text-[16px] font-medium text-white hover:opacity-80 transition-opacity border-b-2 border-white pb-1">DATABASE</Link>
          <Link href="/studio" className="text-[15px] lg:text-[16px] font-medium text-white hover:opacity-80 transition-opacity border-b-2 border-white pb-1">STUDIO</Link>
          <Link href="/contact" className="text-[15px] lg:text-[16px] font-medium text-white hover:opacity-80 transition-opacity border-b-2 border-white pb-1">CONTACT</Link>
        </nav>

        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden flex flex-col gap-1.5 p-2 z-50" aria-label="Toggle menu">
          <span className={`w-6 h-0.5 bg-white transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-white transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-white transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>

        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}>
            <div className="absolute right-0 top-0 h-full w-[70%] max-w-[280px] bg-black shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <nav className="flex flex-col gap-8 items-start p-8 mt-20">
                <Link href="/projects" onClick={() => setMobileMenuOpen(false)} className="text-[20px] font-medium text-white hover:opacity-80 transition-opacity">PROJECTS</Link>
                <Link href="/database" onClick={() => setMobileMenuOpen(false)} className="text-[20px] font-medium text-white hover:opacity-80 transition-opacity">DATABASE</Link>
                <Link href="/studio" onClick={() => setMobileMenuOpen(false)} className="text-[20px] font-medium text-white hover:opacity-80 transition-opacity">STUDIO</Link>
                <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="text-[20px] font-medium text-white hover:opacity-80 transition-opacity">CONTACT</Link>
              </nav>
            </div>
          </div>
        )}
      </header>

      <main className="w-full max-w-[1860px] mx-auto animate-slide-up">
        <div className="mb-6 md:mb-8">
          <h1 className="text-[28px] xs:text-[32px] sm:text-[36px] md:text-[40px] lg:text-[48px] xl:text-[56px] font-bold text-white mb-3 md:mb-4">
            {projectsPage.title}
          </h1>
          <div className="flex flex-wrap items-center gap-2 xs:gap-2.5 sm:gap-3 text-[11px] xs:text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] tracking-wide">
            {filters.map((filter, i) => (
              <span key={filter} className="flex items-center gap-2 xs:gap-2.5 sm:gap-3">
                {i > 0 && <span className="text-white/60">/</span>}
                <button 
                  onClick={() => handleFilterChange(filter)}
                  className={`transition-all whitespace-nowrap ${resolvedActiveFilter === filter ? 'font-bold text-white' : 'font-medium text-white/70 hover:text-white'}`}
                >
                  {filter}
                </button>
              </span>
            ))}
          </div>
        </div>
      </main>

      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] border-t border-white/40 mb-12" />

      <main className="w-full max-w-[1860px] mx-auto">
        <section 
          key={activeFilter}
          className={`grid grid-cols-1 md:grid-cols-2 gap-10 mb-16 ${isTransitioning ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0 animate-slide-up'} transition-all duration-300`}
        >
          {filteredProjects.map((project) => (
            <Link href={project.href} key={project.id} className="group flex flex-col gap-4">
              <div className="w-full aspect-[16/9] rounded-none overflow-hidden bg-black">
                <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="text-[22px] sm:text-[26px] md:text-[32px] font-bold text-white">{project.title}</h2>
                <p className="text-[16px] sm:text-[18px] md:text-[20px] font-extralight text-white/80">{project.subtitle}</p>
              </div>
              <div className="flex flex-wrap gap-3 mt-2">
                {(project.features || []).map((feature, featureIndex) => (
                  <button
                    key={`${project.id}-${featureIndex}`}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleFilterChange(feature)
                    }}
                    className="px-4 py-1 border border-white rounded-none text-[12px] sm:text-[13px] md:text-[14px] text-white hover:bg-white/10 transition-colors"
                  >
                    {feature}
                  </button>
                ))}
              </div>
            </Link>
          ))}
        </section>
      </main>

      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] border-t border-white/40 my-16" />

      <section className="sticky top-0 h-screen bg-black flex items-start justify-center px-8 py-24 z-10">
        <div className="w-full max-w-[1860px]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <h2 className="text-[24px] sm:text-[32px] md:text-[40px] lg:text-[48px] font-bold leading-[1.2] text-white">
              {projectsPage.ctaHeading.map((line, i) => (
                <span key={i}>{line}{i < projectsPage.ctaHeading.length - 1 && <br />}</span>
              ))}
            </h2>
            <Link href="/contact" className="group relative flex items-center pb-1.5 shrink-0">
              <span className="text-[16px] md:text-[18px] lg:text-[20px] font-semibold leading-[22px] text-white tracking-wide">GET IN TOUCH</span>
              <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white"></div>
            </Link>
          </div>
        </div>
      </section>

      <section ref={footerRef} className="relative h-[120vh] bg-black overflow-visible z-20">
        <div className="fixed bottom-0 left-0 w-full bg-white transition-all duration-300 ease-out z-30" style={{ height: `${footerProgress * 100}vh` }}>
          <div className="relative w-full h-full px-8 py-16">
            <div className="w-full max-w-[1860px] mx-auto h-full flex flex-col justify-between">
              <div className="flex flex-col md:flex-row justify-between items-start gap-8 md:gap-12 transition-opacity duration-500" style={{ opacity: footerProgress > 0.3 ? 1 : 0 }}>
                <div className="flex flex-col xs:flex-row gap-8 xs:gap-12 md:gap-16">
                  <div className="flex flex-col gap-4 md:gap-6">
                    <h3 className="text-[12px] sm:text-[13px] md:text-[14px] font-extralight text-reform-red tracking-wider">NAVIGATE</h3>
                    <nav className="flex flex-col gap-2 md:gap-3">
                      {footer.navigation.map((link, i) => (
                        <Link key={i} href={link.href} className="text-[14px] sm:text-[16px] md:text-[18px] font-extralight text-reform-red hover:opacity-70 transition-opacity">{link.label}</Link>
                      ))}
                    </nav>
                  </div>
                  <div className="flex flex-col gap-4 md:gap-6">
                    <h3 className="text-[12px] sm:text-[13px] md:text-[14px] font-extralight text-reform-red tracking-wider">SOCIAL</h3>
                    <nav className="flex flex-col gap-2 md:gap-3">
                      {footer.social.map((link, i) => (
                        <a key={i} href={link.href} target="_blank" rel="noopener noreferrer" className="text-[14px] sm:text-[16px] md:text-[18px] font-extralight text-reform-red hover:opacity-70 transition-opacity">{link.label}</a>
                      ))}
                    </nav>
                  </div>
                </div>
                <div className="flex flex-col items-start md:items-end gap-4 md:gap-8 transition-opacity duration-500 w-full md:w-auto" style={{ opacity: footerProgress > 0.5 ? 1 : 0 }}>
                  <h3 className="text-[16px] sm:text-[18px] md:text-[20px] lg:text-[24px] font-medium text-reform-red text-left md:text-right leading-tight">
                    {footer.ctaTitle.split(' ').slice(0, 4).join(' ')}<br />{footer.ctaTitle.split(' ').slice(4).join(' ')}
                  </h3>
                  <Link href="/contact" className="group relative flex items-center pb-1.5">
                    <span className="text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] font-semibold leading-[22px] text-reform-red tracking-wide">GET IN TOUCH</span>
                    <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-reform-red"></div>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center transition-opacity duration-500" style={{ opacity: footerProgress > 0.4 ? 1 : 0 }}>
                <h2 className="text-[clamp(80px,15vw,320px)] font-bold leading-[0.9] text-reform-red select-none tracking-tight">{footer.brandName}</h2>
              </div>
              <div className="flex flex-col xs:flex-row justify-between items-center gap-3 xs:gap-4 transition-opacity duration-500 text-center xs:text-left" style={{ opacity: footerProgress > 0.6 ? 1 : 0 }}>
                <div className="text-[11px] xs:text-[12px] sm:text-[13px] md:text-[14px] lg:text-[16px] font-extralight text-reform-red/70">{footer.copyright}</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
