'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    location: '',
    message: ''
  })
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
  }

  return (
    <div className="min-h-screen w-full bg-reform-red px-8 py-8">
      <header className="w-full max-w-[1860px] mx-auto flex justify-between items-start mb-12 animate-slide-up">
        <Link href="/" className="text-[24px] sm:text-[28px] md:text-[32px] font-bold text-reform-black leading-none text-appear">
          REFORM
        </Link>

        <nav className="flex gap-8 md:gap-12 lg:gap-16">
          <Link
            href="/projects"
            className="text-[14px] sm:text-[15px] md:text-[16px] font-medium text-reform-black hover:opacity-70 transition-opacity border-b-2 border-reform-black pb-1 text-appear text-appear-delay-1"
          >
            PROJECTS
          </Link>
          <Link
            href="/studio"
            className="text-[14px] sm:text-[15px] md:text-[16px] font-medium text-reform-black hover:opacity-70 transition-opacity border-b-2 border-reform-black pb-1 text-appear text-appear-delay-2"
          >
            STUDIO
          </Link>
          <Link
            href="/contact"
            className="text-[14px] sm:text-[15px] md:text-[16px] font-medium text-reform-black hover:opacity-70 transition-opacity border-b-2 border-reform-black pb-1 text-appear text-appear-delay-3"
          >
            CONTACT
          </Link>
        </nav>
      </header>

      <div className="w-full max-w-[1860px] mx-auto flex flex-col lg:flex-row justify-between items-start gap-12 mt-12 animate-slide-up">
        <div className="w-full lg:w-[55%] xl:w-[50%]">
          <h1 className="text-[28px] sm:text-[32px] md:text-[40px] lg:text-[48px] font-bold text-reform-black leading-[1.15] uppercase mb-10 text-appear text-appear-delay-2">
            READY TO TRANSFORM<br />
            YOUR VISION?<br />
            WE'RE HERE TO HELP.
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-appear text-appear-delay-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                required
                className="w-full px-4 py-3 bg-transparent border border-reform-black rounded-md text-[14px] text-reform-black placeholder-reform-black/60 focus:outline-none focus:border-reform-black/80 transition-all"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
                className="w-full px-4 py-3 bg-transparent border border-reform-black rounded-md text-[14px] text-reform-black placeholder-reform-black/60 focus:outline-none focus:border-reform-black/80 transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Company / Brand Name"
                className="w-full px-4 py-3 bg-transparent border border-reform-black rounded-md text-[14px] text-reform-black placeholder-reform-black/60 focus:outline-none focus:border-reform-black/80 transition-all"
              />
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Location"
                className="w-full px-4 py-3 bg-transparent border border-reform-black rounded-md text-[14px] text-reform-black placeholder-reform-black/60 focus:outline-none focus:border-reform-black/80 transition-all"
              />
            </div>

            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell Us About Your Project!"
              required
              rows={6}
              className="w-full px-4 py-3 bg-transparent border border-reform-black rounded-md text-[14px] text-reform-black placeholder-reform-black/60 focus:outline-none focus:border-reform-black/80 resize-none transition-all"
            />

            <button
              type="submit"
              className="w-fit px-10 py-3 bg-reform-black text-white text-[14px] sm:text-[16px] font-normal rounded-xl hover:bg-reform-black/90 transition-all"
            >
              Submit
            </button>
          </form>
        </div>

        <div className="w-full lg:w-auto flex flex-col items-start lg:items-end justify-end h-full lg:self-end gap-4 mt-auto text-appear text-appear-delay-4">
          <a 
            href="tel:+32653892017" 
            className="text-[16px] sm:text-[18px] md:text-[20px] font-medium text-reform-black hover:opacity-70 transition-opacity"
          >
            +32 653 892 017
          </a>
          <a 
            href="mailto:project@reformstudio.com" 
            className="text-[16px] sm:text-[18px] md:text-[20px] font-medium text-reform-black hover:opacity-70 transition-opacity border-b-2 border-reform-black"
          >
            project@reformstudio.com
          </a>
        </div>
      </div>
    </div>
  )
}
