'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

export default function Studio() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const teamVideos = ['/team1.mp4', '/team2.mp4', '/team3.mp4']

  const videoSectionRefs = useRef<(HTMLDivElement | null)[]>([])
  const [videoScales, setVideoScales] = useState<number[]>(() =>
    teamVideos.map(() => 0.4),
  )
  const footerRef = useRef<HTMLDivElement | null>(null)
  const [footerProgress, setFooterProgress] = useState(0)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight

      const newScales = teamVideos.map((_, index) => {
        const section = videoSectionRefs.current[index]
        if (!section) return 0.4

        const rect = section.getBoundingClientRect()
        const sectionTop = rect.top
        const sectionHeight = rect.height

        if (sectionTop < windowHeight && sectionTop > -sectionHeight) {
          const scrollProgress =
            (windowHeight - sectionTop) / (windowHeight + sectionHeight * 0.5)
          return Math.min(1, Math.max(0.4, 0.4 + scrollProgress * 0.7))
        }
        if (sectionTop <= -sectionHeight) {
          return 1
        }

        return 0.4
      })

      setVideoScales(newScales)

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

  return (
    <div className="min-h-screen w-full bg-reform-red">
      <header className="w-full px-4 sm:px-6 md:px-8 py-6 md:py-8 bg-reform-red">
        <div className="w-full max-w-[1860px] mx-auto flex justify-between items-start gap-4 animate-slide-up">
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
        </div>
      </header>

      <section className="w-full px-4 sm:px-6 md:px-8 py-10 md:py-16">
        <div className="w-full max-w-[1860px] mx-auto">
          <div className="relative">
            <div className="mb-6 md:mb-8">
              <h1 className="text-[28px] xs:text-[32px] sm:text-[40px] md:text-[52px] lg:text-[64px] xl:text-[80px] font-bold leading-[1.05] uppercase text-reform-black text-appear text-appear-delay-2">
                REDEFINING THE<br />
                STANDARDS OF<br />
                CREATIVITY.
              </h1>
            </div>

            <div className="flex flex-col lg:flex-row justify-between gap-6 lg:gap-8 mt-6 md:mt-8">
              <div className="w-full lg:w-1/2 lg:pr-8 xl:pr-12" />
              <div className="w-full lg:w-1/2 lg:pl-8 xl:pl-16 text-appear text-appear-delay-3">
                <h2 className="text-[16px] xs:text-[17px] sm:text-[18px] md:text-[20px] lg:text-[22px] font-bold uppercase text-reform-black mb-2 md:mb-3">
                  OVERVIEW
                </h2>
                <p className="text-[14px] xs:text-[15px] sm:text-[16px] md:text-[17px] lg:text-[18px] font-light leading-[1.6] text-reform-black mb-3 md:mb-4">
                  At NABSHY, we believe in reshaping perspectives. Our team combines expertise in strategy, design, and technology to deliver transformative experiences that challenge the ordinary.
                </p>
                <p className="text-[14px] xs:text-[15px] sm:text-[16px] md:text-[17px] lg:text-[18px] font-light leading-[1.6] text-reform-black">
                  Its work involves communication systems and visual strategies, working across multiple disciplines like brand and visual identity, web design, graphics, event communication and digital contents.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-0">
        <div className="w-full max-w-[1860px] mx-auto flex flex-col gap-2">
          {teamVideos.map((src, index) => (
            <div
              key={src}
              ref={(el) => {
                videoSectionRefs.current[index] = el
              }}
              className="w-full flex justify-center"
            >
              <div
                className="flex items-center justify-center transition-all duration-300 ease-out"
                style={{
                  width: `${videoScales[index] * 100}vw`,
                  height: `${videoScales[index] * 100}vh`,
                }}
              >
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                  style={{
                    borderRadius: videoScales[index] >= 0.98 ? '0px' : '12px',
                  }}
                >
                  <source src={src} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="sticky top-0 h-screen bg-reform-red flex items-start justify-center px-8 py-24 z-10">
        <div className="w-full max-w-[1860px]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <h2 className="text-[36px] sm:text-[44px] md:text-[53.8px] lg:text-[64px] font-bold leading-[1.2] uppercase text-reform-black">
              Ready to transform<br />
              your vision?<br />
              We&apos;re here to help.
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
                className="flex flex-col md:flex-row justify-between items-start gap-8 md:gap-12 transition-opacity duration-500"
                style={{
                  opacity: footerProgress > 0.3 ? 1 : 0,
                }}
              >
                <div className="flex flex-col xs:flex-row gap-8 xs:gap-12 md:gap-16">
                  <div className="flex flex-col gap-4 md:gap-6">
                    <h3 className="text-[12px] sm:text-[13px] md:text-[14px] font-extralight uppercase text-reform-red tracking-wider">
                      NAVIGATE
                    </h3>
                    <nav className="flex flex-col gap-2 md:gap-3">
                      <Link href="/" className="text-[14px] sm:text-[16px] md:text-[18px] font-extralight text-reform-red hover:opacity-70 transition-opacity">
                        Home
                      </Link>
                      <Link href="/studio" className="text-[14px] sm:text-[16px] md:text-[18px] font-extralight text-reform-red hover:opacity-70 transition-opacity">
                        Studio
                      </Link>
                      <Link href="/projects" className="text-[14px] sm:text-[16px] md:text-[18px] font-extralight text-reform-red hover:opacity-70 transition-opacity">
                        Projects
                      </Link>
                      <Link href="/contact" className="text-[14px] sm:text-[16px] md:text-[18px] font-extralight text-reform-red hover:opacity-70 transition-opacity">
                        Contact
                      </Link>
                    </nav>
                  </div>

                  <div className="flex flex-col gap-4 md:gap-6">
                    <h3 className="text-[12px] sm:text-[13px] md:text-[14px] font-extralight uppercase text-reform-red tracking-wider">
                      SOCIAL
                    </h3>
                    <nav className="flex flex-col gap-2 md:gap-3">
                      <a
                        href="https://instagram.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[14px] sm:text-[16px] md:text-[18px] font-extralight text-reform-red hover:opacity-70 transition-opacity"
                      >
                        Instagram
                      </a>
                      <a
                        href="https://twitter.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[14px] sm:text-[16px] md:text-[18px] font-extralight text-reform-red hover:opacity-70 transition-opacity"
                      >
                        X
                      </a>
                      <a
                        href="https://behance.net"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[14px] sm:text-[16px] md:text-[18px] font-extralight text-reform-red hover:opacity-70 transition-opacity"
                      >
                        Behance
                      </a>
                      <a
                        href="https://linkedin.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[14px] sm:text-[16px] md:text-[18px] font-extralight text-reform-red hover:opacity-70 transition-opacity"
                      >
                        LinkedIn
                      </a>
                    </nav>
                  </div>
                </div>

                <div
                  className="flex flex-col items-start md:items-end gap-4 md:gap-8 transition-opacity duration-500 w-full md:w-auto"
                  style={{
                    opacity: footerProgress > 0.5 ? 1 : 0,
                  }}
                >
                  <h3 className="text-[16px] sm:text-[18px] md:text-[20px] lg:text-[24px] font-medium text-reform-red text-left md:text-right leading-tight">
                    WE WOULD LOVE TO<br />
                    HEAR MORE FROM YOU!
                  </h3>
                  <Link href="/contact" className="group relative flex items-center pb-1.5">
                    <span className="text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] font-semibold leading-[22px] text-reform-red tracking-wide">
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
                  NABSHY
                </h2>
              </div>

              <div
                className="flex flex-col xs:flex-row justify-between items-center gap-3 xs:gap-4 transition-opacity duration-500 text-center xs:text-left"
                style={{
                  opacity: footerProgress > 0.6 ? 1 : 0,
                }}
              >
                <div className="text-[11px] xs:text-[12px] sm:text-[13px] md:text-[14px] lg:text-[16px] font-extralight text-reform-red/70">
                  ©NABSHY AGENCY Studio 2025
                </div>
                <div className="text-[11px] xs:text-[12px] sm:text-[13px] md:text-[14px] lg:text-[16px] font-extralight text-reform-red/70">
                  
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
