'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const activoSlides = [
  ['/elementoim5.avif', '/elementoim4.avif'],
  ['/elementoim4.avif', '/elementoim5.avif'],
]

export default function ElementoPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [slideIndex, setSlideIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [direction, setDirection] = useState<'left' | 'right'>('right')
  const [image1Visible, setImage1Visible] = useState(false)
  const [image2Visible, setImage2Visible] = useState(false)
  const [carouselVisible, setCarouselVisible] = useState(false)
  const [footerVisible, setFooterVisible] = useState(false)

  const image1Ref = useRef<HTMLDivElement | null>(null)
  const image2Ref = useRef<HTMLDivElement | null>(null)
  const carouselRef = useRef<HTMLDivElement | null>(null)
  const footerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleScroll = () => {
      const trigger = window.innerHeight * 0.85

      if (image1Ref.current && !image1Visible) {
        const rect = image1Ref.current.getBoundingClientRect()
        if (rect.top < trigger) setImage1Visible(true)
      }

      if (image2Ref.current && !image2Visible) {
        const rect = image2Ref.current.getBoundingClientRect()
        if (rect.top < trigger) setImage2Visible(true)
      }

      if (carouselRef.current && !carouselVisible) {
        const rect = carouselRef.current.getBoundingClientRect()
        if (rect.top < trigger) setCarouselVisible(true)
      }

      if (footerRef.current && !footerVisible) {
        const rect = footerRef.current.getBoundingClientRect()
        if (rect.top < trigger) setFooterVisible(true)
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [image1Visible, image2Visible, carouselVisible, footerVisible])

  const totalSlides = activoSlides.length

  const handleNext = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setDirection('right')
    setSlideIndex((prev) => (prev + 1) % totalSlides)
    setTimeout(() => setIsTransitioning(false), 500)
  }

  const handlePrev = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setDirection('left')
    setSlideIndex((prev) => (prev - 1 + totalSlides) % totalSlides)
    setTimeout(() => setIsTransitioning(false), 500)
  }

  return (
    <div className="bg-black text-white min-h-screen">
      <section className="relative min-h-screen w-full overflow-hidden">
        <Image
          src="/elementoheroimage.avif"
          alt="Elemento – Project Hero"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/45" />

        <div className="relative z-10 flex flex-col min-h-screen px-4 sm:px-6 md:px-8 py-6 sm:py-8">
          <header className="w-full max-w-[1860px] mx-auto flex justify-between items-start gap-4 mb-8 md:mb-12 animate-slide-up">
            <Link
              href="/"
              className="text-[20px] xs:text-[22px] sm:text-[24px] md:text-[28px] lg:text-[32px] font-bold leading-none text-white text-appear z-50"
            >
              NABSHY
            </Link>

            <nav className="hidden lg:flex flex-row gap-8 lg:gap-12 xl:gap-16">
              <Link
                href="/projects"
                className="text-[15px] lg:text-[16px] font-medium text-white hover:opacity-80 transition-opacity border-b-2 border-white pb-1 text-appear text-appear-delay-1"
              >
                PROJECTS
              </Link>
              <Link
                href="/database"
                className="text-[15px] lg:text-[16px] font-medium text-white hover:opacity-80 transition-opacity border-b-2 border-white pb-1 text-appear text-appear-delay-2"
              >
                DATABASE
              </Link>
              <Link
                href="/studio"
                className="text-[15px] lg:text-[16px] font-medium text-white hover:opacity-80 transition-opacity border-b-2 border-white pb-1 text-appear text-appear-delay-3"
              >
                STUDIO
              </Link>
              <Link
                href="/contact"
                className="text-[15px] lg:text-[16px] font-medium text-white hover:opacity-80 transition-opacity border-b-2 border-white pb-1 text-appear text-appear-delay-4"
              >
                CONTACT
              </Link>
            </nav>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex flex-col gap-1.5 p-2 z-50 relative"
              aria-label="Toggle menu"
            >
              <span className={`w-6 h-0.5 bg-white transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`w-6 h-0.5 bg-white transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`w-6 h-0.5 bg-white transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </button>

            {mobileMenuOpen && (
              <div className="lg:hidden fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}>
                <div className="absolute right-0 top-0 h-full w-[70%] max-w-[280px] bg-black shadow-2xl" onClick={(e) => e.stopPropagation()}>
                  <nav className="flex flex-col gap-8 items-start p-8 mt-20">
                    <Link href="/projects" onClick={() => setMobileMenuOpen(false)} className="text-[20px] font-bold text-white hover:opacity-70 transition-opacity">
                      PROJECTS
                    </Link>
                    <Link href="/database" onClick={() => setMobileMenuOpen(false)} className="text-[20px] font-bold text-white hover:opacity-70 transition-opacity">
                      DATABASE
                    </Link>
                    <Link href="/studio" onClick={() => setMobileMenuOpen(false)} className="text-[20px] font-bold text-white hover:opacity-70 transition-opacity">
                      STUDIO
                    </Link>
                    <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="text-[20px] font-bold text-white hover:opacity-70 transition-opacity">
                      CONTACT
                    </Link>
                  </nav>
                </div>
              </div>
            )}
          </header>

          <div className="flex-1 flex items-end">
            <div className="w-full max-w-[1860px] mx-auto">
              <h1 className="text-[28px] xs:text-[32px] sm:text-[40px] md:text-[52px] lg:text-[64px] xl:text-[80px] 2xl:text-[88px] font-bold leading-[0.95] tracking-tight max-w-[720px]">
                <span className="block">Feel the</span>
                <span className="block">Element.</span>
              </h1>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-black px-4 sm:px-6 md:px-8 pt-16 pb-24 md:pt-24 md:pb-36">
        <div className="w-full max-w-[1860px] mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.6fr)] gap-12">
          <div>
            <h2 className="text-[24px] sm:text-[28px] md:text-[32px] font-bold mb-6">ELEMENTO</h2>
            <p className="text-[14px] sm:text-[15px] md:text-[16px] leading-relaxed max-w-[640px] text-white/90">
              A branding identity rooted in the unique story of the brand. Inspired by their values, the project aimed to
              translate their vision into a compelling visual narrative. Through meticulous design and strategy, we crafted
              a logo, typography, and color palette that reflect their essence and set the foundation for a cohesive and
              memorable brand presence.
            </p>
          </div>

          <div className="text-[13px] sm:text-[14px] md:text-[15px]">
            <div className="grid grid-cols-[1.6fr_1fr_0.7fr] gap-x-8 mb-8 text-white/70">
              <div>Scope of Work</div>
              <div>Client</div>
              <div>Year</div>
            </div>
            <div className="grid grid-cols-[1.6fr_1fr_0.7fr] gap-x-8 text-white">
              <div className="space-y-2 pt-2">
                <div>Brand Strategy</div>
                <div>Visual Identity</div>
              </div>
              <div className="pt-3">Elemento</div>
              <div className="pt-3">2024</div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-black px-4 sm:px-6 md:px-8 pt-8 pb-32 md:pt-16 md:pb-40">
        <div className="w-full max-w-[1860px] mx-auto">
          <div
            ref={image1Ref}
            className={`w-full md:w-[72%] lg:w-[60%] transition-all duration-[900ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] will-change-transform ${
              image1Visible ? 'animate-slide-up' : 'opacity-0 translate-y-16'
            }`}
          >
            <div className="relative w-full aspect-[16/10] overflow-hidden">
              <Image
                src="/elementoim2.avif"
                alt="Elemento visual 1"
                fill
                sizes="(min-width: 1024px) 60vw, 90vw"
                className="object-cover"
              />
            </div>
          </div>

          <div className="h-[26vh] md:h-[32vh]" />

          <div className="flex justify-end">
            <div
              ref={image2Ref}
              className={`w-full md:w-[72%] lg:w-[60%] transition-all duration-[900ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] will-change-transform ${
                image2Visible ? 'animate-slide-up' : 'opacity-0 translate-y-16'
              }`}
            >
              <div className="relative w-full aspect-[16/10] overflow-hidden">
                <Image
                  src="/elemntoim3.avif"
                  alt="Elemento visual 2"
                  fill
                  sizes="(min-width: 1024px) 60vw, 90vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-black px-4 sm:px-6 md:px-8 pt-16 pb-10 md:pt-24 md:pb-12">
        <div className="w-full max-w-[1860px] mx-auto">
          <h2 className="text-[24px] sm:text-[32px] md:text-[40px] lg:text-[48px] font-bold leading-tight max-w-[720px] uppercase">
            Translating vision into a compelling visual narrative
          </h2>
        </div>
      </section>

      <section className="w-full bg-black px-4 sm:px-6 md:px-8 pb-20 md:pb-32">
        <div className="w-full max-w-[1860px] mx-auto">
          <div
            ref={carouselRef}
            className={`relative flex items-center transition-all duration-[900ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] will-change-transform ${
              carouselVisible ? 'animate-slide-up' : 'opacity-0 translate-y-16'
            }`}
          >
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous images"
              className="absolute left-2 sm:left-0 sm:-translate-x-1/2 top-1/2 -translate-y-1/2 w-10 h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 rounded-none border border-white/60 flex items-center justify-center bg-black/60 hover:bg-white hover:text-black transition-colors"
            >
              <span className="text-[18px] md:text-[20px]">&#8592;</span>
            </button>

            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-10">
              {activoSlides[slideIndex].map((src, idx) => (
                <div 
                  key={`${slideIndex}-${src}`} 
                  className="w-full aspect-[16/10] overflow-hidden bg-black"
                  style={{
                    animation: `${direction === 'right' ? 'slideInFromRight' : 'slideInFromLeft'} 0.5s ease-out`,
                    animationDelay: `${idx * 0.1}s`,
                    opacity: 0,
                    animationFillMode: 'forwards'
                  }}
                >
                  <Image
                    src={src}
                    alt="Elemento gallery image"
                    width={1600}
                    height={1000}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Next images"
              className="absolute right-2 sm:right-0 sm:translate-x-1/2 top-1/2 -translate-y-1/2 w-10 h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 rounded-none border border-white/60 flex items-center justify-center bg-black/60 hover:bg-white hover:text-black transition-colors"
            >
              <span className="text-[18px] md:text-[20px]">&#8594;</span>
            </button>
          </div>
        </div>
      </section>
      <section className="w-full bg-black px-4 sm:px-6 md:px-8 pt-12 pb-24">
        <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] border-t border-white/20 mb-10" />

        <div className="w-full max-w-[1860px] mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-[24px] sm:text-[28px] md:text-[32px] lg:text-[40px] font-bold uppercase">
              NEXT PROJECTS
            </h2>
            <Link
              href="/projects"
              className="text-[13px] sm:text-[14px] md:text-[15px] font-medium tracking-wide border-b border-white pb-1 hover:opacity-80 transition-opacity"
            >
              VIEW ALL PROJECTS
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            <Link
              href="/projects/energio"
              className="group flex flex-col gap-4"
            >
              <div className="w-full aspect-[16/9] rounded-none overflow-hidden bg-white/5">
                <Image
                  src="/energio.avif"
                  alt="ENERGIO"
                  width={1600}
                  height={900}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <div className="flex flex-wrap gap-3 mt-3">
                <span className="px-4 py-1 border border-white rounded-none text-[12px] sm:text-[13px] md:text-[14px]">
                  Brand Strategy
                </span>
                <span className="px-4 py-1 border border-white rounded-none text-[12px] sm:text-[13px] md:text-[14px]">
                  Visual Identity
                </span>
              </div>
              <div className="mt-2 flex flex-col gap-1">
                <h3 className="text-[18px] sm:text-[20px] md:text-[22px] font-bold">
                  ENERGIO
                </h3>
                <p className="text-[14px] sm:text-[15px] md:text-[16px] text-white/85">
                  Energy to Break the Limit.
                </p>
              </div>
            </Link>

            <Link
              href="/projects/activo"
              className="group flex flex-col gap-4"
            >
              <div className="w-full aspect-[16/9] rounded-none overflow-hidden bg-white/5">
                <Image
                  src="/activo.avif"
                  alt="ACTIVO"
                  width={1600}
                  height={900}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <div className="flex flex-wrap gap-3 mt-3">
                <span className="px-4 py-1 border border-white rounded-none text-[12px] sm:text-[13px] md:text-[14px]">
                  Brand Strategy
                </span>
                <span className="px-4 py-1 border border-white rounded-none text-[12px] sm:text-[13px] md:text-[14px]">
                  Visual Identity
                </span>
              </div>
              <div className="mt-2 flex flex-col gap-1">
                <h3 className="text-[18px] sm:text-[20px] md:text-[22px] font-bold">
                  ACTIVO
                </h3>
                <p className="text-[14px] sm:text-[15px] md:text-[16px] text-white/85">
                  Redefining the Active Lifestyle.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="w-full bg-black pt-8 md:pt-10 pb-16 md:pb-20">
        <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] border-t border-white/20 mb-12" />

        <div className="w-full max-w-[1860px] mx-auto px-4 sm:px-6 md:px-8 flex flex-col gap-12 md:gap-16">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 md:gap-12">
            <div className="flex flex-col xs:flex-row gap-8 xs:gap-12 md:gap-16">
              <div className="flex flex-col gap-4 md:gap-6">
                <h3 className="text-[12px] sm:text-[13px] md:text-[14px] font-extralight uppercase tracking-wider text-white/80">NAVIGATE</h3>
                <nav className="flex flex-col gap-2 md:gap-3 text-[14px] sm:text-[16px] md:text-[18px] font-extralight">
                  <Link href="/" className="hover:opacity-70 transition-opacity">
                    Home
                  </Link>
                  <Link href="/studio" className="hover:opacity-70 transition-opacity">
                    Studio
                  </Link>
                  <Link href="/projects" className="hover:opacity-70 transition-opacity">
                    Projects
                  </Link>
                  <Link href="/contact" className="hover:opacity-70 transition-opacity">
                    Contact
                  </Link>
                </nav>
              </div>

              <div className="flex flex-col gap-4 md:gap-6">
                <h3 className="text-[12px] sm:text-[13px] md:text-[14px] font-extralight uppercase tracking-wider text-white/80">SOCIAL</h3>
                <nav className="flex flex-col gap-2 md:gap-3 text-[14px] sm:text-[16px] md:text-[18px] font-extralight">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-70 transition-opacity"
                  >
                    Instagram
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-70 transition-opacity"
                  >
                    X
                  </a>
                  <a
                    href="https://behance.net"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-70 transition-opacity"
                  >
                    Behance
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-70 transition-opacity"
                  >
                    LinkedIn
                  </a>
                </nav>
              </div>
            </div>

            <div className="flex flex-col items-start md:items-end gap-4 md:gap-6 w-full md:w-auto">
              <h3 className="text-[16px] sm:text-[18px] md:text-[20px] lg:text-[24px] font-medium text-left md:text-right leading-tight">
                WE WOULD LOVE TO
                <br />
                HEAR MORE FROM YOU!
              </h3>
              <Link href="/contact" className="group relative flex items-center pb-1.5">
                <span className="text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] font-semibold leading-[22px] tracking-wide">
                  GET IN TOUCH
                </span>
                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white" />
              </Link>
            </div>
          </div>

          <div
            ref={footerRef}
            className={`flex items-center justify-center transition-all duration-[900ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] will-change-transform ${
              footerVisible ? 'animate-slide-up' : 'opacity-0 translate-y-16'
            }`}
          >
            <h2 className="text-[clamp(80px,15vw,260px)] font-bold leading-[0.9] tracking-tight text-white text-appear text-appear-delay-4">
              NABSHY
            </h2>
          </div>

          <div className="flex flex-col xs:flex-row justify-between items-center gap-3 xs:gap-4 text-center xs:text-left">
            <div className="text-[11px] xs:text-[12px] sm:text-[13px] md:text-[14px] lg:text-[16px] font-extralight text-white/70">
              ©Nabshy Studio 2025
            </div>
            <div className="text-[11px] xs:text-[12px] sm:text-[13px] md:text-[14px] lg:text-[16px] font-extralight text-white/70">
              
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
