'use client'

import Link from 'next/link'

export default function Header() {
  return (
    <div className="w-full max-w-[1860px] flex justify-between items-start gap-4 px-4 md:px-8 py-6 md:py-8">
      {/* Tagline - 3 lines */}
      <div className="flex-1 max-w-[700px]">
        <h1 className="text-[20px] sm:text-[24px] md:text-[28px] lg:text-[32px] xl:text-[36px] font-extralight leading-[1.25] text-reform-black">
          Reform is a branding studio that<br />
          specializes in elevating brands<br />
          through the power of storytelling.
        </h1>
      </div>

      {/* Navigation Menu */}
      <nav className="flex flex-col gap-2.5 min-w-[102px]">
        <Link 
          href="/projects" 
          className="group relative flex items-center pb-1.5 transition-all"
        >
          <span className="text-[16px] sm:text-[18px] md:text-[20px] font-extralight leading-[22px] text-reform-black">
            PROJECTS
          </span>
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-reform-black"></div>
        </Link>

        <Link 
          href="/studio" 
          className="group relative flex items-center pb-1.5 transition-all"
        >
          <span className="text-[16px] sm:text-[18px] md:text-[20px] font-extralight leading-[22px] text-reform-black">
            STUDIO
          </span>
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-reform-black"></div>
        </Link>

        <Link 
          href="/contact" 
          className="group relative flex items-center pb-1.5 transition-all"
        >
          <span className="text-[16px] sm:text-[18px] md:text-[20px] font-extralight leading-[22px] text-reform-black">
            CONTACT
          </span>
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-reform-black"></div>
        </Link>
      </nav>
    </div>
  )
}
