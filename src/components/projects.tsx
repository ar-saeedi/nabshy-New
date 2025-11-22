'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'

const projects = [
  {
    title: 'ACTIVO',
    subtitle: 'Redefining the Active Lifestyle.',
    image: '/activo.avif',
    href: '/projects/activo',
    features: ['Brand Strategy', 'Visual Identity']
  },
  {
    title: 'DARKO',
    subtitle: 'Reveal the Darkness Within.',
    image: '/darko.avif',
    href: '/projects/darko',
    features: ['Visual Identity', 'Web Development']
  },
  {
    title: 'ELEMENTO',
    subtitle: 'Feel the Element.',
    image: '/elemento.avif',
    href: '/projects/elemento',
    features: ['Brand Strategy', 'Visual Identity']
  },
  {
    title: 'ENERGIO',
    subtitle: 'Energy to Break the Limit.',
    image: '/energio.avif',
    href: '/projects/energio',
    features: ['Brand Strategy', 'Visual Identity']
  }
]

export default function Projects() {
  const footerRef = useRef<HTMLDivElement>(null)
  const [footerProgress, setFooterProgress] = useState(0)
  const [activeFilter, setActiveFilter] = useState('ALL')
  const [isTransitioning, setIsTransitioning] = useState(false)
  const searchParams = useSearchParams()
  const initializedFromQuery = useRef(false)

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

    const category = searchParams.get('category')

    let initialFilter: string | null = null

    if (category === 'brand-strategy') initialFilter = 'BRAND STRATEGY'
    else if (category === 'visual-identity') initialFilter = 'VISUAL IDENTITY'
    else if (category === 'website') initialFilter = 'WEBSITE'
    else if (category === 'all') initialFilter = 'ALL'

    if (initialFilter) {
      setActiveFilter(initialFilter)
    }

    initializedFromQuery.current = true
  }, [searchParams])

  const handleFilterChange = (filter: string) => {
    if (filter === activeFilter) return
    
    setIsTransitioning(true)
    setTimeout(() => {
      setActiveFilter(filter)
      setIsTransitioning(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 300)
  }

  const filteredProjects = projects.filter(project => {
    if (activeFilter === 'ALL') return true
    if (activeFilter === 'BRAND STRATEGY') return project.features.includes('Brand Strategy')
    if (activeFilter === 'VISUAL IDENTITY') return project.features.includes('Visual Identity')
    if (activeFilter === 'WEBSITE') return project.features.includes('Web Development')
    return true
  })

  return (
    <div className="min-h-screen bg-reform-red px-8 py-8">
      <header className="w-full max-w-[1860px] mx-auto flex justify-between items-start mb-16 animate-slide-up">
        <Link href="/" className="text-[24px] sm:text-[28px] md:text-[32px] font-bold text-reform-black leading-none text-appear">
          REFORM
        </Link>
        <nav className="flex gap-8 md:gap-12 lg:gap-16">
          <Link href="/projects" className="text-[14px] sm:text-[15px] md:text-[16px] font-medium text-reform-black hover:opacity-70 transition-opacity border-b-2 border-reform-black pb-1 text-appear text-appear-delay-1">
            PROJECTS
          </Link>
          <Link href="/studio" className="text-[14px] sm:text-[15px] md:text-[16px] font-medium text-reform-black hover:opacity-70 transition-opacity border-b-2 border-reform-black pb-1 text-appear text-appear-delay-2">
            STUDIO
          </Link>
          <Link href="/contact" className="text-[14px] sm:text-[15px] md:text-[16px] font-medium text-reform-black hover:opacity-70 transition-opacity border-b-2 border-reform-black pb-1 text-appear text-appear-delay-3">
            CONTACT
          </Link>
        </nav>
      </header>

      <main className="w-full max-w-[1860px] mx-auto animate-slide-up">
        <div className="mb-8">
          <h1 className="text-[32px] sm:text-[40px] md:text-[48px] lg:text-[56px] font-bold text-reform-black uppercase mb-4">
            PROJECTS.
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-[13px] sm:text-[14px] md:text-[15px] tracking-wide">
            <button 
              onClick={() => handleFilterChange('ALL')}
              className={`transition-all ${activeFilter === 'ALL' ? 'font-bold text-reform-black' : 'font-medium text-reform-black/80 hover:text-reform-black'}`}
            >
              ALL
            </button>
            <span className="text-reform-black/70">/</span>
            <button 
              onClick={() => handleFilterChange('BRAND STRATEGY')}
              className={`transition-all ${activeFilter === 'BRAND STRATEGY' ? 'font-bold text-reform-black' : 'font-medium text-reform-black/80 hover:text-reform-black'}`}
            >
              BRAND STRATEGY
            </button>
            <span className="text-reform-black/70">/</span>
            <button 
              onClick={() => handleFilterChange('VISUAL IDENTITY')}
              className={`transition-all ${activeFilter === 'VISUAL IDENTITY' ? 'font-bold text-reform-black' : 'font-medium text-reform-black/80 hover:text-reform-black'}`}
            >
              VISUAL IDENTITY
            </button>
            <span className="text-reform-black/70">/</span>
            <button 
              onClick={() => handleFilterChange('WEBSITE')}
              className={`transition-all ${activeFilter === 'WEBSITE' ? 'font-bold text-reform-black' : 'font-medium text-reform-black/80 hover:text-reform-black'}`}
            >
              WEBSITE
            </button>
          </div>
        </div>
      </main>

      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] border-t border-reform-black mb-12" />

      <main className="w-full max-w-[1860px] mx-auto">

        <section 
          key={activeFilter}
          className={`grid grid-cols-1 md:grid-cols-2 gap-10 mb-16 ${isTransitioning ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0 animate-slide-up'} transition-all duration-300`}
        >
          {filteredProjects.map((project) => (
            <Link
              href={project.href}
              key={project.title}
              className="group flex flex-col gap-4"
            >
              <div className="w-full aspect-[16/9] rounded-3xl overflow-hidden bg-black">
                <Image
                  src={project.image}
                  alt={project.title}
                  width={1600}
                  height={900}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="text-[20px] sm:text-[22px] md:text-[24px] font-bold text-reform-black">
                  {project.title}
                </h2>
                <p className="text-[14px] sm:text-[15px] md:text-[16px] text-reform-black">
                  {project.subtitle}
                </p>
              </div>
              <div className="flex flex-wrap gap-3 mt-2">
                {project.features.map((feature) => (
                  <span
                    key={feature}
                    className="px-4 py-1 border border-reform-black rounded-full text-[12px] sm:text-[13px] md:text-[14px] text-reform-black"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </section>

      </main>

      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] border-t border-reform-black my-16" />

      <section className="sticky top-0 h-screen bg-reform-red flex items-start justify-center px-8 py-24 z-10">
        <div className="w-full max-w-[1860px]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <h2 className="text-[36px] sm:text-[44px] md:text-[53.8px] lg:text-[64px] font-bold leading-[1.2] uppercase text-reform-black">
              Ready to transform<br />
              your vision?<br />
              We're here to help.
            </h2>
            <Link href="/contact" className="group relative flex items-center pb-1.5 shrink-0">
              <span className="text-[16px] md:text-[18px] lg:text-[20px] font-semibold leading-[22px] text-reform-black tracking-wide">
                GET IN TOUCH
              </span>
              <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-reform-black"></div>
            </Link>
          </div>
        </div>
      </section>

      <section
        ref={footerRef}
        className="relative h-[120vh] bg-reform-red overflow-visible z-20"
      >
        <div
          className="fixed bottom-0 left-0 w-full bg-black transition-all duration-300 ease-out z-30"
          style={{
            height: `${footerProgress * 100}vh`,
            borderTopLeftRadius: footerProgress > 0 ? '40px' : '0px',
            borderTopRightRadius: footerProgress > 0 ? '40px' : '0px',
          }}
        >
          <div className="relative w-full h-full px-8 py-16">
            <div className="w-full max-w-[1860px] mx-auto h-full flex flex-col justify-between">

              <div
                className="flex justify-between items-start transition-opacity duration-500"
                style={{
                  opacity: footerProgress > 0.3 ? 1 : 0,
                }}
              >
                <div className="flex gap-16">
                <div className="flex flex-col gap-6">
                  <h3 className="text-[14px] font-extralight uppercase text-reform-red tracking-wider">
                    NAVIGATE
                  </h3>
                  <nav className="flex flex-col gap-3">
                  <Link href="/" className="text-[18px] font-extralight text-reform-red hover:opacity-70 transition-opacity">
                    Home
                  </Link>
                  <Link href="/studio" className="text-[18px] font-extralight text-reform-red hover:opacity-70 transition-opacity">
                    Studio
                  </Link>
                  <Link href="/projects" className="text-[18px] font-extralight text-reform-red hover:opacity-70 transition-opacity">
                    Projects
                  </Link>
                  <Link href="/contact" className="text-[18px] font-extralight text-reform-red hover:opacity-70 transition-opacity">
                    Contact
                  </Link>
                  </nav>
                </div>

                <div className="flex flex-col gap-6">
                  <h3 className="text-[14px] font-extralight uppercase text-reform-red tracking-wider">
                    SOCIAL
                  </h3>
                  <nav className="flex flex-col gap-3">
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-[18px] font-extralight text-reform-red hover:opacity-70 transition-opacity">
                    Instagram
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-[18px] font-extralight text-reform-red hover:opacity-70 transition-opacity">
                    X
                  </a>
                  <a href="https://behance.net" target="_blank" rel="noopener noreferrer" className="text-[18px] font-extralight text-reform-red hover:opacity-70 transition-opacity">
                    Behance
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-[18px] font-extralight text-reform-red hover:opacity-70 transition-opacity">
                    LinkedIn
                  </a>
                  </nav>
                </div>
                </div>

                <div
                  className="flex flex-col items-end gap-8 transition-opacity duration-500"
                  style={{
                    opacity: footerProgress > 0.5 ? 1 : 0,
                  }}
                >
                  <h3 className="text-[20px] md:text-[24px] font-medium text-reform-red text-right leading-tight">
                    WE WOULD LOVE TO<br />
                    HEAR MORE FROM YOU!
                  </h3>
                  <Link href="/contact" className="group relative flex items-center pb-1.5">
                    <span className="text-[18px] md:text-[20px] font-semibold leading-[22px] text-reform-red tracking-wide">
                      GET IN TOUCH
                    </span>
                    <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-reform-red"></div>
                  </Link>
                </div>
              </div>

              <div
                className="flex items-center justify-center transition-opacity duration-500"
                style={{
                  opacity: footerProgress > 0.4 ? 1 : 0,
                }}
              >
                <h2 className="text-[clamp(80px,15vw,320px)] font-bold leading-[0.9] text-reform-red select-none tracking-tight">
                  REFORM
                </h2>
              </div>

              <div
                className="flex justify-between items-center transition-opacity duration-500"
                style={{
                  opacity: footerProgress > 0.6 ? 1 : 0,
                }}
              >
                <div className="text-[14px] md:text-[16px] font-extralight text-reform-red/70">
                  &copy;NABSHY AGENCY Studio 2025
                </div>
                <div className="text-[14px] md:text-[16px] font-extralight text-reform-red/70">
                  Made by Alireza Saeedi
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
