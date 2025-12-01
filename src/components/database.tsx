'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const projectsDatabase: { [key: string]: ProjectData } = {
  'nabshy-15': {
    code: 'nabshy-15',
    title: 'nabshy-15',
    status: 'completed',
    image: '/activo.avif',
    description: 'A revolutionary residential complex that redefines urban living through innovative architectural solutions. The project seamlessly blends functionality with aesthetic excellence, creating spaces that inspire and elevate daily life. Completed in 2023, this development stands as a testament to forward-thinking design and meticulous craftsmanship.',
    location: 'Mashhad, Iran',
    type: 'Residential',
    floors: 5,
    units: 5,
    areaPerUnit: 250,
    files: [
      {
        type: 'PDF',
        title: 'Welcome to V1',
        subtitle: 'nabshy project',
        date: '7/22/2025',
        downloadUrl: '#'
      }
    ]
  }
}

interface ProjectFile {
  type: string
  title: string
  subtitle: string
  date: string
  downloadUrl: string
}

interface ProjectData {
  code: string
  title: string
  status: string
  image: string
  description: string
  location: string
  type: string
  floors: number
  units: number
  areaPerUnit: number
  files: ProjectFile[]
}

export default function Database() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchCode, setSearchCode] = useState('')
  const [projectData, setProjectData] = useState<ProjectData | null>(null)
  const [searchPerformed, setSearchPerformed] = useState(false)
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchPerformed(true)
    setShowResults(false)
    
    const found = projectsDatabase[searchCode.toLowerCase().trim()]
    
    setTimeout(() => {
      setProjectData(found || null)
      setShowResults(true)
    }, 500)
  }

  return (
    <div className="min-h-screen bg-reform-red px-4 sm:px-6 md:px-8 py-6 md:py-8">
      <header className="w-full max-w-[1860px] mx-auto flex justify-between items-start gap-4 mb-10 md:mb-16 animate-slide-up">
        <Link href="/" className="text-[20px] xs:text-[22px] sm:text-[24px] md:text-[28px] lg:text-[32px] font-bold text-reform-black leading-none text-appear">
          NABSHY
        </Link>

        <nav className="hidden lg:flex flex-row gap-8 lg:gap-12 xl:gap-16">
          <Link
            href="/projects"
            className="text-[15px] lg:text-[16px] font-medium text-reform-black hover:opacity-70 transition-opacity border-b-2 border-reform-black pb-1 text-appear text-appear-delay-1"
          >
            PROJECTS
          </Link>
          <Link
            href="/database"
            className="text-[15px] lg:text-[16px] font-medium text-reform-black hover:opacity-70 transition-opacity border-b-2 border-reform-black pb-1 text-appear text-appear-delay-2"
          >
            DATABASE
          </Link>
          <Link
            href="/studio"
            className="text-[15px] lg:text-[16px] font-medium text-reform-black hover:opacity-70 transition-opacity border-b-2 border-reform-black pb-1 text-appear text-appear-delay-3"
          >
            STUDIO
          </Link>
          <Link
            href="/contact"
            className="text-[15px] lg:text-[16px] font-medium text-reform-black hover:opacity-70 transition-opacity border-b-2 border-reform-black pb-1 text-appear text-appear-delay-4"
          >
            CONTACT
          </Link>
        </nav>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden flex flex-col gap-1.5 p-2 z-50"
          aria-label="Toggle menu"
        >
          <span className={`w-6 h-0.5 bg-reform-black transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-reform-black transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-reform-black transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>

        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}>
            <div className="absolute right-0 top-0 h-full w-[70%] max-w-[280px] bg-reform-red shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <nav className="flex flex-col gap-8 items-start p-8 mt-20">
                <Link href="/projects" onClick={() => setMobileMenuOpen(false)} className="text-[20px] font-medium text-reform-black hover:opacity-70 transition-opacity">
                  PROJECTS
                </Link>
                <Link href="/database" onClick={() => setMobileMenuOpen(false)} className="text-[20px] font-medium text-reform-black hover:opacity-70 transition-opacity">
                  DATABASE
                </Link>
                <Link href="/studio" onClick={() => setMobileMenuOpen(false)} className="text-[20px] font-medium text-reform-black hover:opacity-70 transition-opacity">
                  STUDIO
                </Link>
                <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="text-[20px] font-medium text-reform-black hover:opacity-70 transition-opacity">
                  CONTACT
                </Link>
              </nav>
            </div>
          </div>
        )}
      </header>

      <main className="w-full max-w-[1860px] mx-auto animate-slide-up">
        <div className="mb-6 md:mb-8">
          <h1 className="text-[28px] xs:text-[32px] sm:text-[36px] md:text-[40px] lg:text-[48px] xl:text-[56px] font-bold text-reform-black uppercase mb-3 md:mb-4">
            DATABASE.
          </h1>
          <p className="text-[14px] md:text-[16px] text-reform-black/80">
            Only accessible by Nabshy customers, Enter the given code to access files.
          </p>
        </div>
      </main>

      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] border-t border-reform-black mb-12" />

      <main className="w-full max-w-[1860px] mx-auto mb-16">
        <form onSubmit={handleSearch} className="w-full max-w-[800px] mx-auto flex gap-0">
          <input
            type="text"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            placeholder="Enter the code ..."
            className="flex-1 bg-reform-black/10 text-reform-black placeholder:text-reform-black/50 text-[16px] md:text-[18px] px-6 md:px-8 py-4 md:py-5 border-2 border-reform-black/30 focus:border-reform-black focus:outline-none transition-colors"
          />
          <button
            type="submit"
            className="bg-reform-black hover:bg-reform-black/90 transition-colors px-6 md:px-8 py-4 md:py-5 flex items-center justify-center"
            aria-label="Search"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-reform-red">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>
        </form>
      </main>

      {searchPerformed && (
        <main className="w-full max-w-[1860px] mx-auto px-4 sm:px-6 md:px-8 pb-24">
          {showResults && projectData ? (
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-8 md:gap-12 animate-slide-up">
              <div className="bg-reform-black/10 border border-reform-black/20 rounded-none p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-reform-black">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  <h2 className="text-[20px] md:text-[24px] font-bold text-reform-black uppercase">Project Info</h2>
                </div>

                <div className="relative w-full aspect-[4/3] mb-6 overflow-hidden rounded-none bg-black">
                  <Image
                    src={projectData.image}
                    alt={projectData.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="space-y-4 text-reform-black">
                  <div>
                    <p className="text-[14px] md:text-[16px] text-reform-black/60 mb-1 uppercase tracking-wide">{projectData.status}</p>
                    <h3 className="text-[20px] md:text-[24px] font-bold text-reform-black mb-3">{projectData.title}</h3>
                    <p className="text-[14px] md:text-[16px] leading-relaxed text-reform-black/80">{projectData.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div>
                      <p className="text-[12px] text-reform-black/60 uppercase tracking-wider mb-1 font-semibold">Location</p>
                      <p className="text-[14px] md:text-[16px]">{projectData.location}</p>
                    </div>

                    <div>
                      <p className="text-[12px] text-reform-black/60 uppercase tracking-wider mb-1 font-semibold">Status</p>
                      <p className="text-[14px] md:text-[16px]">{projectData.status}</p>
                    </div>

                    <div>
                      <p className="text-[12px] text-reform-black/60 uppercase tracking-wider mb-1 font-semibold">Type</p>
                      <p className="text-[14px] md:text-[16px]">{projectData.type}</p>
                    </div>

                    <div>
                      <p className="text-[12px] text-reform-black/60 uppercase tracking-wider mb-1 font-semibold">Floors</p>
                      <p className="text-[14px] md:text-[16px]">{projectData.floors}</p>
                    </div>

                    <div>
                      <p className="text-[12px] text-reform-black/60 uppercase tracking-wider mb-1 font-semibold">Units</p>
                      <p className="text-[14px] md:text-[16px]">{projectData.units}</p>
                    </div>

                    <div>
                      <p className="text-[12px] text-reform-black/60 uppercase tracking-wider mb-1 font-semibold">Area/Unit</p>
                      <p className="text-[14px] md:text-[16px]">{projectData.areaPerUnit}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-reform-black/10 border border-reform-black/20 rounded-none p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-reform-black">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  <h2 className="text-[20px] md:text-[24px] font-bold text-reform-black uppercase">Project Files</h2>
                </div>

                <div className="space-y-4">
                  {projectData.files.map((file, index) => (
                    <div key={index} className="bg-reform-black border border-reform-black/20 rounded-none p-4 md:p-6 flex items-center gap-4 sm:gap-5 md:gap-6">
                      <div className="bg-[#1a1a1a] text-white text-[14px] sm:text-[16px] md:text-[18px] font-bold px-3 sm:px-4 md:px-5 py-6 sm:py-7 md:py-8 rounded-none uppercase shrink-0 flex items-center justify-center min-w-[60px] sm:min-w-[70px] md:min-w-[80px]">
                        {file.type}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[16px] sm:text-[18px] md:text-[20px] font-bold text-white mb-1">{file.title}</h3>
                        <p className="text-[14px] sm:text-[15px] md:text-[16px] text-white/70 mb-1">{file.subtitle}</p>
                        <p className="text-[12px] sm:text-[13px] md:text-[14px] text-white/50">{file.date}</p>
                      </div>
                      <a
                        href={file.downloadUrl}
                        download
                        className="flex items-center gap-2 text-[13px] sm:text-[14px] md:text-[16px] font-semibold text-reform-red hover:text-white transition-colors border-b border-reform-red hover:border-white pb-1 shrink-0"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        DOWNLOAD
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : showResults ? (
            <div className="text-center py-16 animate-slide-up">
              <p className="text-[18px] md:text-[24px] text-reform-black/80">No project found with code "{searchCode}"</p>
              <p className="text-[14px] md:text-[16px] text-reform-black/60 mt-2">Please check the code and try again</p>
            </div>
          ) : null}
        </main>
      )}

    </div>
  )
}
