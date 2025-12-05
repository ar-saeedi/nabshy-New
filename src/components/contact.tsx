'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Office {
  id: string
  tabTitle: string
  title: string
  label: string
  address: string
  email: string
  phoneDisplay: string
  phoneHref: string
  imageSrc: string
}

interface ContactContent {
  title: string
  offices: Office[]
}

interface ContentData {
  contactPage: ContactContent
}

export default function Contact() {
  const [content, setContent] = useState<ContentData | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeOfficeIndex, setActiveOfficeIndex] = useState(0)

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
  }, [])

  if (!content) {
    return (
      <div className="min-h-screen bg-reform-red flex items-center justify-center">
        <div className="text-reform-black text-2xl font-bold animate-pulse">Loading...</div>
      </div>
    )
  }

  const contactPage = content.contactPage
  const office = contactPage.offices[activeOfficeIndex]

  return (
    <div className="min-h-screen w-full bg-reform-red px-4 sm:px-6 md:px-8 py-6 md:py-8">
      <header className="w-full max-w-[1860px] mx-auto flex justify-between items-start gap-4 mb-8 md:mb-12 animate-slide-up">
        <Link href="/" className="text-[20px] xs:text-[22px] sm:text-[24px] md:text-[28px] lg:text-[32px] font-bold text-reform-black leading-none">
          NABSHY
        </Link>

        <nav className="hidden lg:flex flex-row gap-8 lg:gap-12 xl:gap-16">
          <Link href="/projects" className="text-[15px] lg:text-[16px] font-medium text-reform-black hover:opacity-70 transition-opacity border-b-2 border-reform-black pb-1">PROJECTS</Link>
          <Link href="/database" className="text-[15px] lg:text-[16px] font-medium text-reform-black hover:opacity-70 transition-opacity border-b-2 border-reform-black pb-1">DATABASE</Link>
          <Link href="/studio" className="text-[15px] lg:text-[16px] font-medium text-reform-black hover:opacity-70 transition-opacity border-b-2 border-reform-black pb-1">STUDIO</Link>
          <Link href="/contact" className="text-[15px] lg:text-[16px] font-medium text-reform-black hover:opacity-70 transition-opacity border-b-2 border-reform-black pb-1">CONTACT</Link>
        </nav>

        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden flex flex-col gap-1.5 p-2 z-50" aria-label="Toggle menu">
          <span className={`w-6 h-0.5 bg-reform-black transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-reform-black transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-reform-black transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>

        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}>
            <div className="absolute right-0 top-0 h-full w-[70%] max-w-[280px] bg-reform-red shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <nav className="flex flex-col gap-8 items-start p-8 mt-20">
                <Link href="/projects" onClick={() => setMobileMenuOpen(false)} className="text-[20px] font-medium text-reform-black hover:opacity-70 transition-opacity">PROJECTS</Link>
                <Link href="/database" onClick={() => setMobileMenuOpen(false)} className="text-[20px] font-medium text-reform-black hover:opacity-70 transition-opacity">DATABASE</Link>
                <Link href="/studio" onClick={() => setMobileMenuOpen(false)} className="text-[20px] font-medium text-reform-black hover:opacity-70 transition-opacity">STUDIO</Link>
                <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="text-[20px] font-medium text-reform-black hover:opacity-70 transition-opacity">CONTACT</Link>
              </nav>
            </div>
          </div>
        )}
      </header>

      <main className="w-full max-w-[1860px] mx-auto mt-8 md:mt-12 animate-slide-up flex flex-col gap-6 md:gap-10">
        <div className="flex flex-col md:flex-row items-start justify-between gap-6 md:gap-8">
          <h1 className="text-[24px] xs:text-[28px] sm:text-[32px] md:text-[36px] lg:text-[40px] xl:text-[48px] font-bold text-reform-black leading-tight">
            {contactPage.title}
          </h1>
        </div>

        <div className="flex flex-col gap-2">
          <div className="relative flex gap-4 xs:gap-6 sm:gap-8 text-[12px] xs:text-[13px] sm:text-[14px] md:text-[15px] lg:text-[16px] font-medium text-reform-black pb-0">
            {contactPage.offices.map((off, i) => (
              <button
                key={off.id}
                type="button"
                onClick={() => setActiveOfficeIndex(i)}
                className={`relative pb-1 transition-colors whitespace-nowrap ${activeOfficeIndex === i ? 'text-reform-black' : 'text-reform-black/60 hover:text-reform-black'}`}
              >
                {off.tabTitle}
                {activeOfficeIndex === i && (
                  <span className="pointer-events-none absolute left-0 right-0 bottom-0 h-[2px] bg-reform-black z-10" />
                )}
              </button>
            ))}
            <div className="pointer-events-none absolute left-0 right-0 bottom-0 h-[1px] bg-reform-black/30 z-0" />
          </div>
        </div>

        {office && (
          <div key={office.id} className="flex flex-col lg:flex-row gap-6 sm:gap-8 md:gap-10 lg:gap-16 xl:gap-20 pt-4 animate-slide-up">
            <div className="w-full lg:w-1/2">
              <div className="relative overflow-hidden rounded-none bg-white">
                <Image src={office.imageSrc} alt={office.label} width={900} height={600} className="w-full h-full object-cover" priority />
                <div className="absolute inset-x-0 bottom-0 bg-white/85 py-2 sm:py-3 px-3 sm:px-4">
                  <p className="text-[11px] xs:text-[12px] sm:text-[13px] md:text-[14px] text-reform-black text-center">{office.label}</p>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-1/2 flex flex-col gap-4 sm:gap-5 md:gap-6">
              <h2 className="text-[18px] xs:text-[20px] sm:text-[22px] md:text-[24px] lg:text-[28px] font-medium text-reform-black">{office.title}</h2>

              <div className="space-y-3 sm:space-y-4 text-[13px] xs:text-[14px] sm:text-[15px] md:text-[16px] text-reform-black">
                <div>
                  <div className="text-[10px] xs:text-[11px] tracking-[0.16em] text-reform-black/70 mb-1">Address</div>
                  <p>{office.address}</p>
                </div>
                <div>
                  <div className="text-[10px] xs:text-[11px] tracking-[0.16em] text-reform-black/70 mb-1">Email</div>
                  <a href={`mailto:${office.email}`} className="border-b border-reform-black hover:opacity-70 transition-opacity break-all">{office.email}</a>
                </div>
                <div>
                  <div className="text-[10px] xs:text-[11px] tracking-[0.16em] text-reform-black/70 mb-1">Phone</div>
                  <a href={office.phoneHref} className="hover:opacity-70 transition-opacity">{office.phoneDisplay}</a>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
