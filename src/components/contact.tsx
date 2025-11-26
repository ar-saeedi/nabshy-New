'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

type OfficeKey = 'tehran' | 'mashhad'

const offices: Record<
  OfficeKey,
  {
    title: string
    label: string
    address: string
    email: string
    phoneDisplay: string
    phoneHref: string
    imageSrc: string
  }
> = {
  tehran: {
    title: 'Tehran, Iran',
    label: 'Tehran Office',
    address: 'Jordan st, Tehran',
    email: 'info@nabshy.com',
    phoneDisplay: '+21-52938',
    phoneHref: 'tel:+21-52938',
    imageSrc: '/dubaioffice.jpg',
  },
  mashhad: {
    title: 'Mashhad, Iran',
    label: 'Mashhad Office',
    address: 'Sajjad Blv,Mashhad',
    email: 'info@nabshy.com',
    phoneDisplay: '+51-31636',
    phoneHref: 'tel:+51-31636',
    imageSrc: '/abudhabioffice.jpg',
  },
}

const socialItems = [
  { id: 'whatsapp', name: 'WhatsApp', iconSrc: '/icons/social-whatsapp.svg' },
  { id: 'telegram', name: 'Telegram', iconSrc: '/icons/social-telegram.svg' },
  { id: 'instagram', name: 'Instagram', iconSrc: '/icons/social-instagram.svg' },
  { id: 'facebook', name: 'Facebook', iconSrc: '/icons/social-facebook.svg' },
  { id: 'linkedin', name: 'LinkedIn', iconSrc: '/icons/social-linkedin.svg' },
  { id: 'youtube', name: 'YouTube', iconSrc: '/icons/social-youtube.svg' },
  { id: 'tiktok', name: 'TikTok', iconSrc: '/icons/social-tiktok.svg' },
] as const

export default function Contact() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeOffice, setActiveOffice] = useState<OfficeKey>('tehran')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const office = offices[activeOffice]

  return (
    <div className="min-h-screen w-full bg-reform-red px-4 sm:px-6 md:px-8 py-6 md:py-8">
      <header className="w-full max-w-[1860px] mx-auto flex justify-between items-start gap-4 mb-8 md:mb-12 animate-slide-up">
        <Link href="/" className="text-[20px] xs:text-[22px] sm:text-[24px] md:text-[28px] lg:text-[32px] font-bold text-reform-black leading-none text-appear">
          REFORM
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex flex-row gap-8 lg:gap-12 xl:gap-16">
          <Link
            href="/projects"
            className="text-[15px] lg:text-[16px] font-medium text-reform-black hover:opacity-70 transition-opacity border-b-2 border-reform-black pb-1 text-appear text-appear-delay-1"
          >
            PROJECTS
          </Link>
          <Link
            href="/studio"
            className="text-[15px] lg:text-[16px] font-medium text-reform-black hover:opacity-70 transition-opacity border-b-2 border-reform-black pb-1 text-appear text-appear-delay-2"
          >
            STUDIO
          </Link>
          <Link
            href="/contact"
            className="text-[15px] lg:text-[16px] font-medium text-reform-black hover:opacity-70 transition-opacity border-b-2 border-reform-black pb-1 text-appear text-appear-delay-3"
          >
            CONTACT
          </Link>
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2 z-50"
          aria-label="Toggle menu"
        >
          <span className={`w-6 h-0.5 bg-reform-black transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-reform-black transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-reform-black transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 bg-reform-red z-40 flex items-center justify-center">
            <nav className="flex flex-col gap-8 items-center">
              <Link href="/projects" onClick={() => setMobileMenuOpen(false)} className="text-[24px] font-bold text-reform-black">
                PROJECTS
              </Link>
              <Link href="/studio" onClick={() => setMobileMenuOpen(false)} className="text-[24px] font-bold text-reform-black">
                STUDIO
              </Link>
              <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="text-[24px] font-bold text-reform-black">
                CONTACT
              </Link>
            </nav>
          </div>
        )}
      </header>
      <main className="w-full max-w-[1860px] mx-auto mt-8 md:mt-12 animate-slide-up flex flex-col gap-6 md:gap-10">
        <div className="flex flex-col md:flex-row items-start justify-between gap-6 md:gap-8">
          <h1 className="text-[24px] xs:text-[28px] sm:text-[32px] md:text-[36px] lg:text-[40px] xl:text-[48px] font-bold text-reform-black leading-tight">
            Offices
          </h1>

          <div className="flex flex-wrap gap-2 xs:gap-2.5 sm:gap-3 md:gap-4">
            {socialItems.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-label={item.name}
                className="w-9 h-9 xs:w-10 xs:h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 lg:w-13 lg:h-13 rounded-full border border-reform-black flex items-center justify-center bg-transparent hover:bg-reform-black/10 transition-colors transition-transform duration-200 ease-out hover:scale-110"
              >
                <Image
                  src={item.iconSrc}
                  alt={item.name}
                  width={32}
                  height={32}
                  className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 object-contain"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="relative flex gap-4 xs:gap-6 sm:gap-8 text-[12px] xs:text-[13px] sm:text-[14px] md:text-[15px] lg:text-[16px] font-medium text-reform-black pb-0">
            <button
              type="button"
              onClick={() => setActiveOffice('tehran')}
              className={`relative pb-1 transition-colors whitespace-nowrap ${
                activeOffice === 'tehran'
                  ? 'text-reform-black'
                  : 'text-reform-black/60 hover:text-reform-black'
              }`}
            >
              Tehran, Iran
              {activeOffice === 'tehran' && (
                <span className="pointer-events-none absolute left-0 right-0 bottom-0 h-[2px] bg-reform-black z-10" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveOffice('mashhad')}
              className={`relative pb-1 transition-colors whitespace-nowrap ${
                activeOffice === 'mashhad'
                  ? 'text-reform-black'
                  : 'text-reform-black/60 hover:text-reform-black'
              }`}
            >
              Mashhad, Iran
              {activeOffice === 'mashhad' && (
                <span className="pointer-events-none absolute left-0 right-0 bottom-0 h-[2px] bg-reform-black z-10" />
              )}
            </button>
            <div className="pointer-events-none absolute left-0 right-0 bottom-0 h-[1px] bg-reform-black/30 z-0" />
          </div>
        </div>

        <div
          key={activeOffice}
          className="flex flex-col lg:flex-row gap-6 sm:gap-8 md:gap-10 lg:gap-16 xl:gap-20 pt-4 animate-slide-up"
        >
          <div className="w-full lg:w-1/2">
            <div className="relative overflow-hidden rounded-xl bg-white">
              <Image
                src={office.imageSrc}
                alt={office.label}
                width={900}
                height={600}
                className="w-full h-full object-cover"
                priority
              />
              <div className="absolute inset-x-0 bottom-0 bg-white/85 py-2 sm:py-3 px-3 sm:px-4">
                <p className="text-[11px] xs:text-[12px] sm:text-[13px] md:text-[14px] text-reform-black text-center">
                  {office.label}
                </p>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2 flex flex-col gap-4 sm:gap-5 md:gap-6">
            <h2 className="text-[18px] xs:text-[20px] sm:text-[22px] md:text-[24px] lg:text-[28px] font-medium text-reform-black">
              {office.title}
            </h2>

            <div className="space-y-3 sm:space-y-4 text-[13px] xs:text-[14px] sm:text-[15px] md:text-[16px] text-reform-black">
              <div>
                <div className="uppercase text-[10px] xs:text-[11px] tracking-[0.16em] text-reform-black/70 mb-1">
                  Address
                </div>
                <p>{office.address}</p>
              </div>

              <div>
                <div className="uppercase text-[10px] xs:text-[11px] tracking-[0.16em] text-reform-black/70 mb-1">
                  Email
                </div>
                <a
                  href={`mailto:${office.email}`}
                  className="border-b border-reform-black hover:opacity-70 transition-opacity break-all"
                >
                  {office.email}
                </a>
              </div>

              <div>
                <div className="uppercase text-[10px] xs:text-[11px] tracking-[0.16em] text-reform-black/70 mb-1">
                  Phone
                </div>
                <a
                  href={office.phoneHref}
                  className="hover:opacity-70 transition-opacity"
                >
                  {office.phoneDisplay}
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
