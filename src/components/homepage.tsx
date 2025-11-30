'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Homepage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  const thirdSectionRef = useRef<HTMLDivElement>(null)
  const totalLines = 15
  const lineRefs = useRef<(HTMLDivElement | null)[]>(new Array(totalLines).fill(null))
  const [boldLines, setBoldLines] = useState<boolean[]>(new Array(totalLines).fill(false))

  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  const processRef = useRef<HTMLDivElement>(null)
  const [processProgress, setProcessProgress] = useState(0)

  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null)

  const footerRef = useRef<HTMLDivElement>(null)
  const [footerProgress, setFooterProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const section = sectionRef.current
        const rect = section.getBoundingClientRect()
        const windowHeight = window.innerHeight

        const entryProgress = Math.max(0, Math.min(1, 1 - (rect.top / windowHeight)))
        const scrollPastTop = Math.max(0, -rect.top)
        const fullscreenProgress = Math.min(1, scrollPastTop / (windowHeight * 1.0))

        const totalProgress = entryProgress + fullscreenProgress
        setScrollProgress(totalProgress)
      }

      const windowHeight = window.innerHeight
      const threshold = windowHeight * 0.6
      const newBold = lineRefs.current.map((line) => {
        if (!line) return false
        const rect = line.getBoundingClientRect()
        return rect.top <= threshold
      })
      setBoldLines((prev) => {
        const changed = newBold.some((value, idx) => value !== prev[idx])
        return changed ? newBold : prev
      })

      if (processRef.current) {
        const rect = processRef.current.getBoundingClientRect()
        const total = rect.height + windowHeight
        const scrolled = windowHeight - rect.top
        const p = Math.max(0, Math.min(1, scrolled / total))
        setProcessProgress(p)
      }

      if (footerRef.current) {
        const rect = footerRef.current.getBoundingClientRect()
        const windowHeight = window.innerHeight
        const sectionHeight = footerRef.current.offsetHeight
        const scrolledIntoFooter = Math.max(0, windowHeight - rect.top)
        const progress = Math.max(0, Math.min(1, scrolledIntoFooter / windowHeight))
        setFooterProgress(progress)
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const minWidthPercent = 40
  const maxWidthPercent = 100
  const slowedProgress = Math.min(1, scrollProgress * 0.5)
  const currentWidthPercent = minWidthPercent + (slowedProgress * (maxWidthPercent - minWidthPercent))

  const needsFullWidth = scrollProgress > 0.3
  const containerStyle = needsFullWidth ? {
    marginLeft: 'calc(-50vw + 50%)',
    marginRight: 'calc(-50vw + 50%)',
    width: '100vw',
    maxWidth: '100vw',
    paddingLeft: 0,
    paddingRight: 0,
  } : {}

  const videoStyle = {
    width: `${currentWidthPercent}vw`,
    height: 'auto',
    opacity: 1,
    transform: 'none',
    maxWidth: '100vw',
    display: 'block',
  }

  const cards = [
    {
      title: 'STRATEGY',
      description: 'Our extensive range of digital services is designed to satisfy changing needs of our customers.'
    },
    {
      title: 'VISUAL IDENTITY',
      description: 'Distinct visual language that evokes strong feelings and memorable impressions in your target audience.'
    },
    {
      title: 'WEB DEVELOPMENT',
      description: 'In order to provide user-centric solutions that enhance your brand and captivate your audience, our website design services combine creativity and innovation.'
    },
  ]

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
    },
  ]

  const processCards = [
    {
      title: 'ANALYZE',
      image: '/Analyze.avif',
      desc: 'Collecting data through research, audits, and interviews is the initial stage in establishing project objectives.',
      offset: 0,
      baseMargin: 48
    },
    {
      title: 'OBSERVE',
      image: '/Observe.avif',
      desc: 'In this stage, we will specify how you want your company to be seen by customers and how it differs from the other.',
      offset: 0.15,
      baseMargin: 96
    },
    {
      title: 'EXECUTE',
      image: '/Execute.avif',
      desc: "After everything is ready, it's time to execute what we've learned before. We'll start transforming your ideas into reality.",
      offset: 0.3,
      baseMargin: 144
    },
  ]

  const testimonials = [
    {
      quote: "Partnering with NABSHY was a game-changer. Their creativity and dedication exceeded our expectations.",
      name: "Thomas Shelby",
      position: "Manchester Energy / Founder"
    },
    {
      quote: "NABSHY helps us with amazing ideas, and also provides excellent execution during our partnerships.",
      name: "Michael De Santa",
      position: "LifeInvader / CEO"
    },
    {
      quote: "NABSHY exceeded our expectations. Their ability to combine functionality with aesthetics is truly exceptional.",
      name: "Carl Johnson",
      position: "GroveTech / COO"
    }
  ]

  const nextTestimonial = () => {
    if (currentTestimonial < testimonials.length - 1) {
      setSlideDirection('right')
      setTimeout(() => {
        setCurrentTestimonial((prev) => prev + 1)
        setSlideDirection(null)
      }, 500)
    }
  }

  const prevTestimonial = () => {
    if (currentTestimonial > 0) {
      setSlideDirection('left')
      setTimeout(() => {
        setCurrentTestimonial((prev) => prev - 1)
        setSlideDirection(null)
      }, 500)
    }
  }

  const isLastTestimonial = currentTestimonial === testimonials.length - 1
  const isFirstTestimonial = currentTestimonial === 0

  return (
    <div className="relative">
      <header className="sticky top-0 flex flex-col items-center justify-between px-4 sm:px-6 md:px-8 py-6 md:py-8 bg-reform-red min-h-screen z-0">
        <div className="w-full max-w-[1860px] flex justify-between items-start gap-4">
          <div className="flex-1 max-w-[700px]">
            <h1 className="text-[16px] xs:text-[18px] sm:text-[22px] md:text-[32px] lg:text-[36px] font-medium leading-[1.2] text-reform-black">
              NABSHY is a branding studio that<br />
              specializes in elevating brands<br />
              through the power of storytelling.
            </h1>
          </div>

          <nav className="hidden xl:flex flex-col gap-2.5 min-w-[102px]">
            <Link
              href="/projects"
              className="group relative flex items-center pb-1.5 transition-all"
            >
              <span className="text-[18px] lg:text-[20px] font-medium leading-[22px] text-reform-black whitespace-nowrap">
                PROJECTS
              </span>
              <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-reform-black"></div>
            </Link>

            <Link
              href="/database"
              className="group relative flex items-center pb-1.5 transition-all"
            >
              <span className="text-[18px] lg:text-[20px] font-medium leading-[22px] text-reform-black whitespace-nowrap">
                DATABASE
              </span>
              <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-reform-black"></div>
            </Link>

            <Link
              href="/studio"
              className="group relative flex items-center pb-1.5 transition-all"
            >
              <span className="text-[18px] lg:text-[20px] font-medium leading-[22px] text-reform-black whitespace-nowrap">
                STUDIO
              </span>
              <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-reform-black"></div>
            </Link>

            <Link
              href="/contact"
              className="group relative flex items-center pb-1.5 transition-all"
            >
              <span className="text-[18px] lg:text-[20px] font-medium leading-[22px] text-reform-black whitespace-nowrap">
                CONTACT
              </span>
              <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-reform-black"></div>
            </Link>
          </nav>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden flex flex-col gap-1.5 p-2 z-50 relative"
            aria-label="Toggle menu"
          >
            <span className={`w-6 h-0.5 bg-reform-black transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-reform-black transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-reform-black transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>

        {mobileMenuOpen && (
          <div 
            className="xl:hidden fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div 
              className="absolute right-0 top-0 h-full w-[70%] max-w-[280px] bg-reform-red shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <nav className="flex flex-col gap-8 items-start p-8 mt-20">
                <Link
                  href="/projects"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-[20px] font-medium text-reform-black hover:opacity-70 transition-opacity"
                >
                  PROJECTS
                </Link>
                <Link
                  href="/database"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-[20px] font-medium text-reform-black hover:opacity-70 transition-opacity"
                >
                  DATABASE
                </Link>
                <Link
                  href="/studio"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-[20px] font-medium text-reform-black hover:opacity-70 transition-opacity"
                >
                  STUDIO
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-[20px] font-medium text-reform-black hover:opacity-70 transition-opacity"
                >
                  CONTACT
                </Link>
              </nav>
            </div>
          </div>
        )}

        <div className="w-full max-w-[1860px] flex flex-col items-center justify-end gap-5 flex-1">
          <div className="relative w-full flex items-center justify-center my-auto px-2">
            <h2 className="text-[clamp(60px,20vw,400px)] font-bold leading-[1.2] text-reform-black select-none tracking-normal text-center max-w-[1372px]">
              NABSHY
            </h2>
          </div>

          <div className="w-full flex flex-col xs:flex-row justify-between items-center xs:items-end gap-3 xs:gap-2 px-0 py-1 text-center xs:text-left">
            <div className="flex flex-col">
              <span className="inline-block text-[18px] xs:text-[20px] sm:text-[22px] md:text-[24px] lg:text-[26px] xl:text-[28px] font-normal leading-[1.2] text-reform-black tracking-normal">
                CIRCA 2021
              </span>
            </div>

            <div className="flex flex-col">
              <span className="block text-[18px] xs:text-[20px] sm:text-[22px] md:text-[24px] lg:text-[26px] xl:text-[28px] font-normal leading-[1.2] text-reform-black tracking-normal">
                BASED IN BRUSSELS
              </span>
            </div>
          </div>
        </div>
      </header>

      <section
        ref={sectionRef}
        className="relative bg-black z-10 overflow-hidden rounded-t-[40px]"
      >
        <div className="flex flex-col px-4 sm:px-6 md:px-8 pt-12 md:pt-16 pb-0">
          <div className="w-full max-w-[1860px] mx-auto flex flex-col lg:flex-row justify-between items-start gap-6 md:gap-8 mb-12 md:mb-16 lg:mb-20">
            <div className="flex flex-col w-full lg:w-[562px] lg:pr-8 xl:pr-12">
              <h2 className="text-[24px] xs:text-[28px] sm:text-[32px] md:text-[40px] lg:text-[48px] xl:text-[53.8px] font-bold leading-[1.2] uppercase text-reform-red">
                {"REDEFINING\u00a0THE"}<br />
                {"STANDARDS\u00a0OF"}<br />
                CREATIVITY.
              </h2>
            </div>

            <div className="flex flex-col w-full lg:w-[638px] gap-4 lg:gap-6 lg:pl-16 xl:pl-32 lg:ml-8 xl:ml-16">
              <div>
                <p className="text-[18px] font-normal leading-[21.6px] text-reform-red">
                  At NABSHY, we believe in reshaping perspectives. Our team combines expertise in strategy, design, and technology to deliver transformative experiences that challenge the ordinary.
                </p>
              </div>

              <Link
                href="/studio"
                className="group inline-flex w-fit"
              >
                <div className="relative flex items-center pb-1.5">
                  <span className="text-[18px] font-normal leading-[21.6px] text-reform-red">
                    ABOUT US
                  </span>
                  <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-reform-red"></div>
                </div>
              </Link>
            </div>
          </div>

          <div
            className="flex items-center justify-center mt-auto -mb-1 leading-none"
            style={{
              ...containerStyle,
              lineHeight: 0,
            }}
          >
            <div className="relative transition-all duration-300 ease-out flex justify-center">
              <video
                ref={videoRef}
                autoPlay
                loop
                muted
                playsInline
                className={`h-auto object-cover leading-none ${
                  slowedProgress >= 0.9
                    ? 'rounded-none'
                    : 'rounded-lg'
                }`}
                style={videoStyle}
                onLoadedMetadata={(e) => {
                  e.currentTarget.play().catch(err => console.log('Video play error:', err))
                }}
              >
                <source src="/Venice_5.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </section>

      <section ref={thirdSectionRef} className="relative min-h-screen bg-reform-red px-8 py-16 overflow-x-hidden max-w-full">
        <div className="w-full max-w-[1860px] mx-auto flex flex-col">

          <div className="w-full text-center px-4 pt-12 md:pt-16 mb-24 md:mb-32 pb-12 md:pb-16">
            <h2 className="leading-tight flex flex-col gap-4 md:gap-6 items-center">
              <div
                ref={(el) => { if (el) lineRefs.current[0] = el }}
                className={`text-[clamp(18px,5vw,64px)] transition-all duration-500 whitespace-nowrap ${boldLines[0] ? 'font-bold' : 'font-extralight'} text-reform-black uppercase`}
              >
                WE BELIEVE THAT EVERY
              </div>
              <div
                ref={(el) => { if (el) lineRefs.current[1] = el }}
                className={`text-[clamp(18px,5vw,64px)] transition-all duration-500 whitespace-nowrap ${boldLines[1] ? 'font-bold' : 'font-extralight'} text-reform-black uppercase`}
              >
                BRAND HAS A STORY THAT
              </div>
              <div
                ref={(el) => { if (el) lineRefs.current[2] = el }}
                className={`text-[clamp(18px,5vw,64px)] transition-all duration-500 whitespace-nowrap ${boldLines[2] ? 'font-bold' : 'font-extralight'} text-reform-black uppercase`}
              >
                NEED TO BE TOLD
              </div>
            </h2>
          </div>

          <div className="flex flex-col pt-16">
            <div className="flex justify-between items-start mb-10 md:mb-16">
              <h2 className="text-[28px] sm:text-[36px] md:text-[44px] lg:text-[53.8px] font-bold leading-[1.2] uppercase text-reform-black">
                WHAT WE DO.
              </h2>
              <Link href="/studio" className="group relative flex items-center pb-1.5">
                <span className="text-[16px] md:text-[18px] lg:text-[20px] font-semibold leading-[22px] text-reform-black tracking-wide">
                  LEARN MORE
                </span>
                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-reform-black"></div>
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5 lg:gap-6">
              {cards.map((card, index) => (
                <div
                  key={index}
                  className="relative bg-reform-red border-2 border-reform-black rounded-xl p-6 md:p-8 lg:p-10 flex flex-col aspect-square transition-all duration-300 cursor-pointer group"
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <h3 className="text-[16px] xs:text-[17px] sm:text-[18px] md:text-[22px] lg:text-[26px] xl:text-[32px] font-bold leading-[1.1] uppercase text-reform-black break-words">
                    {card.title}
                  </h3>
                  <div className="flex-1" />
                  <div className="relative flex flex-col justify-end gap-4">
                    <p className={`text-[14px] xs:text-[15px] sm:text-[16px] md:text-[17px] lg:text-[18px] font-medium leading-[1.5] text-reform-black transition-all duration-300 ${hoveredCard === index ? 'mb-2' : 'mb-0'}`}>
                      {card.description}
                    </p>
                    <Link
                      href={
                        index === 0
                          ? '/projects?category=brand-strategy'
                          : index === 1
                          ? '/projects?category=visual-identity'
                          : index === 2
                          ? '/projects?category=website'
                          : '/projects'
                      }
                      className={`transition-all duration-300 ${hoveredCard === index ? 'opacity-100 h-auto' : 'opacity-0 h-0 pointer-events-none'}`}
                    >
                      <span className="text-[16px] md:text-[18px] font-semibold leading-[22px] text-reform-black underline">
                        VIEW PROJECTS
                      </span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="w-full border-t border-reform-black/35 mt-24 md:mt-32 pt-8 md:pt-12"></div>

            <div className="w-full flex flex-col items-center text-center gap-8 md:gap-10 mt-16 md:mt-20">
              <div className="flex flex-col gap-8 md:gap-12">
                <div
                  ref={(el) => { if (el) lineRefs.current[3] = el }}
                  className={`text-[clamp(18px,2.2vw,40px)] transition-all duration-500 uppercase ${boldLines[3] ? 'font-bold' : 'font-extralight'} text-reform-black whitespace-nowrap`}
                >
                  LATEST PROJECTS
                </div>
                <div
                  ref={(el) => { if (el) lineRefs.current[4] = el }}
                  className={`text-[clamp(20px,5.5vw,104px)] transition-all duration-500 uppercase ${boldLines[4] ? 'font-bold' : 'font-extralight'} text-reform-black whitespace-nowrap`}
                >
                  WE PUSH LIMITS TO
                </div>
                <div
                  ref={(el) => { if (el) lineRefs.current[5] = el }}
                  className={`text-[clamp(20px,5.5vw,104px)] transition-all duration-500 uppercase ${boldLines[5] ? 'font-bold' : 'font-extralight'} text-reform-black whitespace-nowrap`}
                >
                  DELIVER TRANSFORMATIVE
                </div>
                <div
                  ref={(el) => { if (el) lineRefs.current[6] = el }}
                  className={`text-[clamp(20px,5.5vw,104px)] transition-all duration-500 uppercase ${boldLines[6] ? 'font-bold' : 'font-extralight'} text-reform-black whitespace-nowrap`}
                >
                  EXPERIENCE
                </div>
              </div>
            </div>

            <div className="w-full px-4 md:px-0 mt-48 md:mt-64 xl:mt-72">
              <div className="flex items-center justify-between mb-8 md:mb-12">
                <h3 className="text-[28px] sm:text-[36px] md:text-[44px] lg:text-[53.8px] font-bold uppercase text-reform-black">
                  LATEST PROJECTS
                </h3>
                <Link href="/projects" className="group relative pb-1.5">
                  <span className="text-[16px] md:text-[18px] font-semibold text-reform-black">
                    VIEW ALL PROJECTS
                  </span>
                  <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-reform-black"></div>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                {projects.map((p, idx) => (
                  <div key={idx} className="flex flex-col">
                    <Link href={p.href} className="group rounded-xl overflow-hidden">
                      <div className="relative w-full h-[240px] sm:h-[300px] md:h-[360px] xl:h-[420px]">
                        <Image
                          src={p.image}
                          alt={p.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    </Link>
                    <div className="flex flex-wrap gap-3 mt-5">
                      {p.features.map((f, i) => (
                        <div key={i} className="inline-flex items-center gap-2 px-4 py-1 border border-reform-black rounded-full text-reform-black">
                          <span className="text-[12px] sm:text-[13px] md:text-[14px]">{f}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-5">
                      <h4 className="text-[22px] sm:text-[26px] md:text-[32px] font-bold uppercase text-reform-black">
                        {p.title}
                      </h4>
                      <p className="text-[16px] sm:text-[18px] md:text-[20px] font-extralight text-reform-black">
                        {p.subtitle}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="w-full mt-24 md:mt-36 xl:mt-48 pt-12 md:pt-16 xl:pt-20 border-t border-reform-black"></div>
            </div>

            <div className="w-full text-center px-4 mt-16 md:mt-24">
              <div className="flex flex-col gap-8 md:gap-12 items-center">
                <div
                  ref={(el) => { if (el) lineRefs.current[7] = el }}
                  className={`text-[clamp(14px,2vw,20px)] transition-all duration-500 uppercase ${boldLines[7] ? 'font-bold' : 'font-extralight'} text-reform-black whitespace-nowrap`}
                >
                  OUR PROCESS
                </div>
                <div
                  ref={(el) => { if (el) lineRefs.current[8] = el }}
                  className={`text-[clamp(20px,5.5vw,104px)] transition-all duration-500 uppercase ${boldLines[8] ? 'font-bold' : 'font-extralight'} text-reform-black whitespace-nowrap`}
                >
                  RESHAPING PERSPECTIVE
                </div>
                <div
                  ref={(el) => { if (el) lineRefs.current[9] = el }}
                  className={`text-[clamp(20px,5.5vw,104px)] transition-all duration-500 uppercase ${boldLines[9] ? 'font-bold' : 'font-extralight'} text-reform-black whitespace-nowrap`}
                >
                  THAT CHALLENGE
                </div>
                <div
                  ref={(el) => { if (el) lineRefs.current[10] = el }}
                  className={`text-[clamp(20px,5.5vw,104px)] transition-all duration-500 uppercase ${boldLines[10] ? 'font-bold' : 'font-extralight'} text-reform-black whitespace-nowrap`}
                >
                  THE ORDINARY
                </div>
              </div>
            </div>

            <div ref={processRef} className="w-full px-4 md:px-0 mt-32 md:mt-48 mb-[15vh]">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 lg:gap-10 xl:gap-12">
                {processCards.map((c, i) => {
                  const raw = Math.max(0, Math.min(1, processProgress - c.offset))
                  const local = Math.max(0, Math.min(1, raw / (1 - c.offset)))
                  const eased = 1 - Math.pow(1 - local, 3)
                  const TRANSITION_START = 0.2
                  const TRANSITION_END = 0.5
                  const finalStateProgress = Math.max(0, Math.min(1, (processProgress - TRANSITION_START) / (TRANSITION_END - TRANSITION_START)))
                  const finalEased = finalStateProgress * finalStateProgress * (3 - 2 * finalStateProgress)
                  const initialOpacity = eased
                  const initialTranslateY = (1 - eased) * 40
                  const initialStairOffset = c.baseMargin
                  const initialScale = 0.94 + eased * 0.06
                  const finalOpacity = 1.0
                  const finalTranslateY = 0
                  const finalStairOffset = 0
                  const finalScale = 1.0
                  const opacity = initialOpacity + (finalOpacity - initialOpacity) * finalEased
                  const translateY = initialTranslateY + (finalTranslateY - initialTranslateY) * finalEased
                  const stairOffset = initialStairOffset * (1 - finalEased)
                  const scale = initialScale + (finalScale - initialScale) * finalEased
                  const imgShift = Math.sin(processProgress * 6.28318) * 20

                  return (
                    <div
                      key={i}
                      className="bg-black rounded-xl p-4 xs:p-5 sm:p-6 md:p-7 lg:p-8"
                      style={{
                        opacity,
                        transform: `translateY(${translateY + stairOffset}px) scale(${scale})`,
                        transition: 'transform 400ms ease-out, opacity 400ms ease-out'
                      }}
                    >
                      <div className="text-reform-red text-[28px] xs:text-[32px] sm:text-[38px] md:text-[44px] lg:text-[50px] xl:text-[56px] font-extrabold uppercase mb-3 md:mb-4 tracking-wide">
                        {c.title}
                      </div>
                      <div className="relative w-full h-[180px] xs:h-[200px] sm:h-[220px] md:h-[240px] lg:h-[260px] xl:h-[300px] overflow-hidden rounded-lg mb-3 md:mb-4">
                        <Image
                          src={c.image}
                          alt={c.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                          className="object-cover"
                          style={{
                            transform: `translateY(${imgShift}px)`,
                            transition: 'transform 400ms ease-in-out'
                          }}
                        />
                      </div>
                      <p className="text-reform-red text-[13px] xs:text-[14px] sm:text-[14px] md:text-[15px] lg:text-[16px] font-extralight leading-[1.6]">
                        {c.desc}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] mt-24 md:mt-32 border-t border-reform-black"></div>

          <div className="w-full px-4 md:px-0 mt-24 md:mt-32">
            <div className="flex justify-between items-start mb-16 md:mb-24">
              <h2 className="text-[28px] sm:text-[34px] md:text-[42px] font-bold leading-[1.2] uppercase text-reform-black">
                WHAT THEY SAID.
              </h2>
              <Link href="/studio" className="group relative flex items-center pb-1.5">
                <span className="text-[14px] md:text-[16px] lg:text-[18px] font-semibold leading-[22px] text-reform-black tracking-wide">
                  ABOUT US
                </span>
                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-reform-black"></div>
              </Link>
            </div>

            <div className="flex items-center gap-4 mb-12 md:mb-16 ml-8 md:ml-16">
              <button
                onClick={prevTestimonial}
                disabled={isFirstTestimonial}
                className={`w-12 h-12 md:w-14 md:h-14 border-2 border-reform-black rounded-lg flex items-center justify-center transition-colors ${isFirstTestimonial ? 'opacity-30 cursor-not-allowed' : 'hover:bg-reform-black hover:text-reform-red'}`}
                aria-label="Previous testimonial"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                onClick={nextTestimonial}
                disabled={isLastTestimonial}
                className={`w-12 h-12 md:w-14 md:h-14 border-2 border-reform-black rounded-lg flex items-center justify-center transition-colors ${isLastTestimonial ? 'opacity-30 cursor-not-allowed' : 'hover:bg-reform-black hover:text-reform-red'}`}
                aria-label="Next testimonial"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
              <div className="text-[16px] md:text-[18px] font-medium text-reform-black ml-8 md:ml-12">
                {currentTestimonial + 1} / {testimonials.length}
              </div>
            </div>

            <div className="flex justify-center ml-8 md:ml-16">
              <div className="max-w-[900px] w-full overflow-hidden relative">
                <div
                  key={`testimonial-${currentTestimonial}`}
                  className="animate-slide-in-from-direction"
                  style={{
                    animation: slideDirection === 'right'
                      ? 'slideInFromRight 0.5s ease-out'
                      : slideDirection === 'left'
                      ? 'slideInFromLeft 0.5s ease-out'
                      : 'none'
                  }}
                >
                  <blockquote className="text-[22px] sm:text-[28px] md:text-[34px] lg:text-[40px] font-medium leading-[1.3] text-reform-black mb-8 md:mb-12 text-left">
                    &ldquo;{testimonials[currentTestimonial].quote}&rdquo;
                  </blockquote>
                  <div className="text-[16px] sm:text-[18px] md:text-[20px] text-reform-black text-left">
                    <div className="font-bold mb-1">{testimonials[currentTestimonial].name}</div>
                    <div className="font-light">{testimonials[currentTestimonial].position}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] mt-24 md:mt-32 border-t border-reform-black"></div>

          </div>
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
                      <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-[14px] sm:text-[16px] md:text-[18px] font-extralight text-reform-red hover:opacity-70 transition-opacity">
                        Instagram
                      </a>
                      <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-[14px] sm:text-[16px] md:text-[18px] font-extralight text-reform-red hover:opacity-70 transition-opacity">
                        X
                      </a>
                      <a href="https://behance.net" target="_blank" rel="noopener noreferrer" className="text-[14px] sm:text-[16px] md:text-[18px] font-extralight text-reform-red hover:opacity-70 transition-opacity">
                        Behance
                      </a>
                      <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-[14px] sm:text-[16px] md:text-[18px] font-extralight text-reform-red hover:opacity-70 transition-opacity">
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
