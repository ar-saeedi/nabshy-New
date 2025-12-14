'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'

type PageKey = 'homepage' | 'projects' | 'studio' | 'database' | 'contact'

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginLoading, setLoginLoading] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  
  const [content, setContent] = useState<Record<string, unknown> | null>(null)
  const [activePage, setActivePage] = useState<PageKey>('homepage')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadTarget, setUploadTarget] = useState<{ path: string[]; index?: number } | null>(null)
  const [projectsTab, setProjectsTab] = useState<'main' | 'individual'>('main')
  
  // Theme and mobile sidebar state
  const [darkMode, setDarkMode] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({})

  // Toggle section collapse
  const toggleSection = (sectionId: string) => {
    setCollapsedSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }))
  }

  // Check authentication on mount
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth')
      const data = await res.json()
      setIsAuthenticated(data.authenticated)
    } catch {
      setIsAuthenticated(false)
    } finally {
      setLoginLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = await res.json()
      if (data.success) {
        setIsAuthenticated(true)
      } else {
        setLoginError(data.error || 'Login failed')
      }
    } catch {
      setLoginError('Login failed')
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' })
    setIsAuthenticated(false)
  }

  const fetchContent = useCallback(async () => {
    try {
      const res = await fetch('/api/content')
      const data = await res.json()
      setContent(data)
    } catch (error) {
      console.error('Error fetching content:', error)
      setMessage({ type: 'error', text: 'Failed to load content' })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      fetchContent()
    }
  }, [isAuthenticated, fetchContent])

  const saveContent = async () => {
    if (!content) return
    setSaving(true)
    setMessage(null)
    try {
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      })
      if (res.ok) {
        setMessage({ type: 'success', text: 'Content saved successfully!' })
      } else {
        setMessage({ type: 'error', text: 'Failed to save content' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to save content' })
    } finally {
      setSaving(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !uploadTarget || !content) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      
      if (data.success) {
        const newContent = JSON.parse(JSON.stringify(content))
        let target: Record<string, unknown> = newContent
        for (let i = 0; i < uploadTarget.path.length - 1; i++) {
          target = target[uploadTarget.path[i]] as Record<string, unknown>
        }
        const lastKey = uploadTarget.path[uploadTarget.path.length - 1]
        if (uploadTarget.index !== undefined) {
          (target[lastKey] as unknown[])[uploadTarget.index] = data.url
        } else {
          target[lastKey] = data.url
        }
        setContent(newContent)
        setMessage({ type: 'success', text: 'File uploaded!' })
      } else {
        setMessage({ type: 'error', text: 'Upload failed' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Upload failed' })
    } finally {
      setUploading(false)
      setUploadTarget(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const triggerUpload = (path: string[], index?: number) => {
    setUploadTarget({ path, index })
    fileInputRef.current?.click()
  }

  const updateNestedValue = (path: string[], value: unknown) => {
    if (!content) return
    const newContent = JSON.parse(JSON.stringify(content))
    let target: Record<string, unknown> = newContent
    for (let i = 0; i < path.length - 1; i++) {
      target = target[path[i]] as Record<string, unknown>
    }
    target[path[path.length - 1]] = value
    setContent(newContent)
  }

  const getNestedValue = (obj: Record<string, unknown>, path: string[]): unknown => {
    let current: unknown = obj
    for (const key of path) {
      if (current && typeof current === 'object' && key in current) {
        current = (current as Record<string, unknown>)[key]
      } else {
        return undefined
      }
    }
    return current
  }

  // Login Screen
  if (loginLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 relative overflow-hidden">
        {/* Background Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'url("/Logoicon-01.png")',
            backgroundSize: '40px 40px',
            backgroundRepeat: 'repeat',
            backgroundPosition: 'center',
          }}
        />
        
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full blur-3xl" />
        
        <div className="relative z-10 w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Image
              src="/NabshyTYPE.png"
              alt="Nabshy"
              width={500}
              height={150}
              className="h-32 md:h-36 w-auto object-contain brightness-0 invert"
              priority
            />
          </div>

          {/* Login Card */}
          <div className="bg-white/[0.03] backdrop-blur-xl rounded-none p-8 border border-white/[0.08] shadow-2xl shadow-black/20">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-semibold text-white tracking-tight">Welcome</h1>
              <p className="text-white/40 text-sm mt-2">Sign in to access the admin panel</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-white/[0.04] text-white rounded-xl px-4 py-3.5 border border-white/[0.08] focus:border-white/20 focus:bg-white/[0.06] focus:outline-none transition-all placeholder-white/20"
                    placeholder="admin@nabshy.com"
                    required
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <svg className="w-5 h-5 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/[0.04] text-white rounded-xl px-4 py-3.5 border border-white/[0.08] focus:border-white/20 focus:bg-white/[0.06] focus:outline-none transition-all placeholder-white/20"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {showPassword ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M3 3l18 18M10.477 10.49A3 3 0 0113.5 13.5m-2.26 3.24C10.83 16.9 10.42 17 10 17c-3.333 0-6-3.5-7-5 0 0 1.273-1.83 3.272-3.177M9.88 9.88C10.27 9.34 10.86 9 11.5 9a3 3 0 012.995 2.824M6.228 6.228C7.5 5.5 8.907 5 10 5c3.333 0 6 3.5 7 5 0 0-.463.666-1.273 1.48"
                        />
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7zm9.542-3a3 3 0 100 6 3 3 0 000-6z"
                        />
                      )}
                    </svg>
                  </button>
                </div>
              </div>

              {loginError && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 flex items-center gap-3">
                  <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-400 text-sm">{loginError}</p>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-white text-black py-3.5 rounded-xl font-semibold transition-all hover:bg-white/90 active:scale-[0.98] mt-2"
              >
                Sign In
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/[0.06]">
              <p className="text-center text-white/30 text-xs">
                Protected area • Authorized personnel only
              </p>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-white/20 text-xs mt-8">
            © 2025 Nabshy. All rights reserved.
          </p>
        </div>
      </div>
    )
  }

  if (loading || !content) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading admin panel...</div>
      </div>
    )
  }

  const pages: { key: PageKey; label: string }[] = [
    { key: 'homepage', label: 'Homepage' },
    { key: 'projects', label: 'Projects Page' },
    { key: 'studio', label: 'Studio Page' },
    { key: 'database', label: 'Database Page' },
    { key: 'contact', label: 'Contact Page' },
  ]

  const homepage = content.homepage as Record<string, unknown>
  const projects = content.projects as Array<Record<string, unknown>>
  const projectsPage = content.projectsPage as Record<string, unknown>
  const studioPage = content.studioPage as Record<string, unknown>
  const contactPage = content.contactPage as Record<string, unknown>
  const databasePage = content.databasePage as Record<string, unknown>

  return (
    <div className={`min-h-screen transition-colors ${darkMode ? 'bg-[#0a0a0a]' : 'bg-gray-100'}`}>
      <input ref={fileInputRef} type="file" accept="image/*,video/*,.gif" onChange={handleFileUpload} className="hidden" />
      
      {/* Header */}
      <header className={`${darkMode ? 'bg-[#111111] border-white/[0.06]' : 'bg-white border-gray-200'} border-b px-4 md:px-8 py-4 sticky top-0 z-50 backdrop-blur-xl bg-opacity-80`}>
        <div className="flex justify-between items-center max-w-[1800px] mx-auto">
          {/* Mobile menu button */}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className={`lg:hidden p-2.5 rounded-xl mr-3 transition-all ${darkMode ? 'text-white/60 hover:bg-white/[0.06] hover:text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {sidebarOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          
          <div className="flex-1 flex items-center gap-4">
            <Image src="/NabshyTYPE.png" alt="Nabshy" width={240} height={80} className={`h-14 w-auto object-contain hidden sm:block ${darkMode ? 'brightness-0 invert' : ''}`} />
            <div className={`hidden sm:block w-px h-8 ${darkMode ? 'bg-white/10' : 'bg-gray-200'}`} />
            <div>
              <h1 className={`text-base md:text-lg font-semibold tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>Admin Panel</h1>
              <p className={`text-xs hidden md:block ${darkMode ? 'text-white/40' : 'text-gray-500'}`}>Content Management System</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 md:gap-3">
            {message && (
              <div className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                {message.type === 'success' ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                )}
                {message.text}
              </div>
            )}
            
            {/* Theme Toggle */}
            <button 
              onClick={() => setDarkMode(!darkMode)} 
              className={`p-2.5 rounded-xl transition-all ${darkMode ? 'bg-white/[0.04] text-amber-400 hover:bg-white/[0.08] border border-white/[0.06]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'}`}
              title={darkMode ? 'Light Mode' : 'Dark Mode'}
            >
              {darkMode ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
            
            <button onClick={saveContent} disabled={saving} className={`flex items-center gap-2 px-4 md:px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${saving ? 'bg-white/10 text-white/50' : 'bg-white text-black hover:bg-white/90 active:scale-[0.98]'}`}>
              {saving ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                  <span className="hidden md:inline">Saving...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <span className="hidden md:inline">Save Changes</span>
                </>
              )}
            </button>
            <a href="/" target="_blank" className={`hidden lg:flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${darkMode ? 'bg-white/[0.04] text-white/70 hover:bg-white/[0.08] hover:text-white border border-white/[0.06]' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              View Site
            </a>
            <button onClick={handleLogout} className={`flex items-center gap-2 px-3 md:px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${darkMode ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20' : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex relative max-w-[1800px] mx-auto">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}
        
        {/* Sidebar */}
        <aside className={`
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0 
          fixed lg:sticky top-[65px] lg:top-[73px] 
          ${sidebarCollapsed ? 'lg:w-16' : 'w-72 lg:w-56'} 
          ${darkMode ? 'bg-[#111111] border-white/[0.06]' : 'bg-white border-gray-200'} 
          min-h-screen h-[calc(100vh-65px)] lg:h-[calc(100vh-73px)] 
          p-4 overflow-y-auto shrink-0 
          z-50 lg:z-auto 
          transition-all duration-300
          lg:border-r
        `}>
          {/* Collapse Button */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={`hidden lg:flex w-full items-center justify-center mb-4 p-2 rounded-xl transition-all ${darkMode ? 'bg-white/[0.04] hover:bg-white/[0.08] text-white/60' : 'bg-gray-100 hover:bg-gray-200 text-gray-500'}`}
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg className={`w-5 h-5 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
          
          {!sidebarCollapsed && (
            <div className={`text-xs font-medium uppercase tracking-wider mb-3 px-4 ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>Navigation</div>
          )}
          <nav className="space-y-1">
            {pages.map((page) => (
              <button
                key={page.key}
                onClick={() => { setActivePage(page.key); setSidebarOpen(false); }}
                title={sidebarCollapsed ? page.label : undefined}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all text-sm ${
                  activePage === page.key 
                    ? darkMode 
                      ? 'bg-white text-black font-semibold shadow-lg shadow-white/10' 
                      : 'bg-gray-900 text-white font-semibold shadow-lg'
                    : darkMode 
                      ? 'text-white/70 hover:bg-white/[0.06] hover:text-white' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                } ${sidebarCollapsed ? 'flex items-center justify-center' : ''}`}
              >
                {sidebarCollapsed ? page.label.charAt(0) : page.label}
              </button>
            ))}
          </nav>
          
          {/* Sidebar Footer */}
          {!sidebarCollapsed && (
            <div className={`mt-8 pt-6 border-t ${darkMode ? 'border-white/[0.06]' : 'border-gray-200'}`}>
              <div className={`px-3 py-2 rounded-xl text-xs ${darkMode ? 'bg-white/[0.02] text-white/30' : 'bg-gray-50 text-gray-500'}`}>
                <p className="font-medium mb-1">Nabshy CMS</p>
                <p>v1.0.0 • Professional</p>
              </div>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className={`flex-1 p-4 md:p-8 ${darkMode ? 'bg-[#0a0a0a]' : 'bg-gray-100'}`}>
          {uploading && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
              <div className={`${darkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-200'} border px-8 py-6 rounded-2xl flex items-center gap-4 shadow-2xl`}>
                <svg className="w-6 h-6 animate-spin text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Uploading file...</span>
              </div>
            </div>
          )}

          {/* HOMEPAGE */}
          {activePage === 'homepage' && (
            <div className="space-y-6 md:space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className={`text-xl md:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Homepage</h2>
                  <p className={`text-sm mt-1 ${darkMode ? 'text-white/40' : 'text-gray-500'}`}>Manage your homepage content</p>
                </div>
              </div>
              
              {/* Hero Section */}
              <section className={`rounded-2xl p-5 md:p-7 border ${darkMode ? 'bg-[#111111] border-white/[0.06]' : 'bg-white border-gray-200 shadow-sm'}`}>
                <h3 className={`text-lg md:text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Hero Section</h3>
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Main Title</label>
                    <textarea
                      value={String((homepage.hero as Record<string, unknown>)?.mainTitle || '')}
                      onChange={(e) => updateNestedValue(['homepage', 'hero', 'mainTitle'], e.target.value)}
                      className="w-full bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                      rows={2}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Brand Name</label>
                      <input type="text" value={String((homepage.hero as Record<string, unknown>)?.brandName || '')} onChange={(e) => updateNestedValue(['homepage', 'hero', 'brandName'], e.target.value)} className="w-full bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Circa Text</label>
                      <input type="text" value={String((homepage.hero as Record<string, unknown>)?.circaText || '')} onChange={(e) => updateNestedValue(['homepage', 'hero', 'circaText'], e.target.value)} className="w-full bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Location</label>
                      <input type="text" value={String((homepage.hero as Record<string, unknown>)?.locationText || '')} onChange={(e) => updateNestedValue(['homepage', 'hero', 'locationText'], e.target.value)} className="w-full bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
                    </div>
                  </div>
                </div>
              </section>

              {/* Video Section */}
              <section className={`rounded-2xl p-5 md:p-7 border ${darkMode ? 'bg-[#111111] border-white/[0.06]' : 'bg-white border-gray-200 shadow-sm'}`}>
                <h3 className={`text-lg md:text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Video Section</h3>
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Heading Lines</label>
                    {((homepage.videoSection as Record<string, unknown>)?.heading as string[] || []).map((line: string, i: number) => (
                      <input key={i} type="text" value={line} onChange={(e) => {
                        const newHeading = [...((homepage.videoSection as Record<string, unknown>)?.heading as string[] || [])]
                        newHeading[i] = e.target.value
                        updateNestedValue(['homepage', 'videoSection', 'heading'], newHeading)
                      }} className="w-full bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base mb-2" />
                    ))}
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Description</label>
                    <textarea value={String((homepage.videoSection as Record<string, unknown>)?.description || '')} onChange={(e) => updateNestedValue(['homepage', 'videoSection', 'description'], e.target.value)} className="w-full bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" rows={3} />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Video</label>
                    <div className="flex gap-4">
                      <input type="text" value={String((homepage.videoSection as Record<string, unknown>)?.videoUrl || '')} onChange={(e) => updateNestedValue(['homepage', 'videoSection', 'videoUrl'], e.target.value)} className="flex-1 bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
                      <button onClick={() => triggerUpload(['homepage', 'videoSection', 'videoUrl'])} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">Upload</button>
                    </div>
                  </div>
                </div>
              </section>

              {/* Belief Section */}
              <section className={`rounded-2xl p-5 md:p-7 border ${darkMode ? 'bg-[#111111] border-white/[0.06]' : 'bg-white border-gray-200 shadow-sm'}`}>
                <h3 className={`text-lg md:text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Belief Section</h3>
                <p className="text-gray-500 text-sm mb-4">&quot;WE BELIEVE THAT EVERY BRAND HAS A STORY...&quot;</p>
                <div className="space-y-2">
                  {((homepage.beliefSection as Record<string, unknown>)?.lines as string[] || []).map((line: string, i: number) => (
                    <input key={i} type="text" value={line} onChange={(e) => {
                      const newLines = [...((homepage.beliefSection as Record<string, unknown>)?.lines as string[] || [])]
                      newLines[i] = e.target.value
                      updateNestedValue(['homepage', 'beliefSection', 'lines'], newLines)
                    }} className="w-full bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
                  ))}
                </div>
              </section>

              {/* What We Do */}
              <section className={`rounded-2xl p-5 md:p-7 border ${darkMode ? 'bg-[#111111] border-white/[0.06]' : 'bg-white border-gray-200 shadow-sm'}`}>
                <h3 className={`text-lg md:text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>What We Do</h3>
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Section Title</label>
                    <input type="text" value={String((homepage.whatWeDo as Record<string, unknown>)?.title || '')} onChange={(e) => updateNestedValue(['homepage', 'whatWeDo', 'title'], e.target.value)} className="w-full bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4 bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-blue-800">Learn More Button Text</label>
                      <input type="text" value={String((homepage.whatWeDo as Record<string, unknown>)?.learnMoreText || '')} onChange={(e) => updateNestedValue(['homepage', 'whatWeDo', 'learnMoreText'], e.target.value)} className="w-full bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base" placeholder="LEARN MORE" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-blue-800">Learn More Link</label>
                      <input type="text" value={String((homepage.whatWeDo as Record<string, unknown>)?.learnMoreLink || '')} onChange={(e) => updateNestedValue(['homepage', 'whatWeDo', 'learnMoreLink'], e.target.value)} className="w-full bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base" placeholder="/studio" />
                    </div>
                  </div>
                  {((homepage.whatWeDo as Record<string, unknown>)?.cards as Array<Record<string, unknown>> || []).map((card, i) => (
                    <div key={i} className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
                      <p className="text-gray-700 font-semibold">Card {i + 1}: {String(card.title || '')}</p>
                      <input type="text" value={String(card.title || '')} onChange={(e) => {
                        const newCards = [...((homepage.whatWeDo as Record<string, unknown>)?.cards as Array<Record<string, unknown>> || [])]
                        newCards[i] = { ...newCards[i], title: e.target.value }
                        updateNestedValue(['homepage', 'whatWeDo', 'cards'], newCards)
                      }} className="w-full bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base" placeholder="Title" />
                      <textarea value={String(card.description || '')} onChange={(e) => {
                        const newCards = [...((homepage.whatWeDo as Record<string, unknown>)?.cards as Array<Record<string, unknown>> || [])]
                        newCards[i] = { ...newCards[i], description: e.target.value }
                        updateNestedValue(['homepage', 'whatWeDo', 'cards'], newCards)
                      }} className="w-full bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base" rows={2} placeholder="Description" />
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Hover Link Text</label>
                          <input type="text" value={String(card.linkText || '')} onChange={(e) => {
                            const newCards = [...((homepage.whatWeDo as Record<string, unknown>)?.cards as Array<Record<string, unknown>> || [])]
                            newCards[i] = { ...newCards[i], linkText: e.target.value }
                            updateNestedValue(['homepage', 'whatWeDo', 'cards'], newCards)
                          }} className="w-full bg-white text-gray-900 rounded-lg p-3 border border-gray-300 text-sm" placeholder="VIEW PROJECTS" />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Hover Link URL</label>
                          <input type="text" value={String(card.linkUrl || '')} onChange={(e) => {
                            const newCards = [...((homepage.whatWeDo as Record<string, unknown>)?.cards as Array<Record<string, unknown>> || [])]
                            newCards[i] = { ...newCards[i], linkUrl: e.target.value }
                            updateNestedValue(['homepage', 'whatWeDo', 'cards'], newCards)
                          }} className="w-full bg-white text-gray-900 rounded-lg p-3 border border-gray-300 text-sm" placeholder="/projects?category=brand-strategy" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Latest Projects Text (the 4 lines section) */}
              <section className={`rounded-2xl p-5 md:p-7 border ${darkMode ? 'bg-[#111111] border-white/[0.06]' : 'bg-white border-gray-200 shadow-sm'}`}>
                <h3 className={`text-lg md:text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Latest Projects Text Lines</h3>
                <p className="text-gray-500 text-sm mb-4">&quot;LATEST PROJECTS - WE PUSH LIMITS TO DELIVER TRANSFORMATIVE EXPERIENCE&quot;</p>
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Subtitle (small text at top)</label>
                    <input type="text" value={String((homepage.latestProjectsText as Record<string, unknown>)?.subtitle || '')} onChange={(e) => updateNestedValue(['homepage', 'latestProjectsText', 'subtitle'], e.target.value)} className="w-full bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Big Lines</label>
                    {((homepage.latestProjectsText as Record<string, unknown>)?.lines as string[] || []).map((line: string, i: number) => (
                      <input key={i} type="text" value={line} onChange={(e) => {
                        const newLines = [...((homepage.latestProjectsText as Record<string, unknown>)?.lines as string[] || [])]
                        newLines[i] = e.target.value
                        updateNestedValue(['homepage', 'latestProjectsText', 'lines'], newLines)
                      }} className="w-full bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base mb-2" />
                    ))}
                  </div>
                </div>
              </section>

              {/* Homepage Project Cards (ACTIVO, DARKO, ELEMENTO, ENERGIO) */}
              <section className={`rounded-2xl p-5 md:p-7 border ${darkMode ? 'bg-[#111111] border-white/[0.06]' : 'bg-white border-gray-200 shadow-sm'}`}>
                <h3 className={`text-lg md:text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Homepage Project Cards</h3>
                <p className="text-gray-500 text-sm mb-4">Edit the &quot;LATEST PROJECTS&quot; heading, &quot;VIEW ALL PROJECTS&quot; button, and the 4 project cards</p>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4 bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div>
                      <label className={`block text-sm font-medium mb-2 text-blue-800`}>Section Title (LATEST PROJECTS)</label>
                      <input type="text" value={String((homepage.latestProjectsText as Record<string, unknown>)?.sectionTitle || '')} onChange={(e) => updateNestedValue(['homepage', 'latestProjectsText', 'sectionTitle'], e.target.value)} className="w-full bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" placeholder="LATEST PROJECTS" />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 text-blue-800`}>View All Button Text</label>
                      <input type="text" value={String((homepage.latestProjectsText as Record<string, unknown>)?.viewAllText || '')} onChange={(e) => updateNestedValue(['homepage', 'latestProjectsText', 'viewAllText'], e.target.value)} className="w-full bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" placeholder="VIEW ALL PROJECTS" />
                    </div>
                  </div>
                  {(projects as Array<Record<string, unknown>>)
                    .map((p, idx) => ({ p, idx }))
                    .sort((a, b) => {
                      const ao = typeof a.p.order === 'number' ? a.p.order : Number(a.p.order)
                      const bo = typeof b.p.order === 'number' ? b.p.order : Number(b.p.order)
                      const av = Number.isFinite(ao) ? ao : 999999
                      const bv = Number.isFinite(bo) ? bo : 999999
                      const d = av - bv
                      return d !== 0 ? d : a.idx - b.idx
                    })
                    .slice(0, 4)
                    .map(({ p: project, idx: projectIndex }, i) => (
                    <div key={String(project.id)} className="bg-gray-50 p-5 rounded-lg space-y-4 border border-gray-200">
                      <h4 className="font-bold text-gray-900">{String(project.title) || `Project ${i + 1}`}</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Title</label>
                          <input type="text" value={String(project.title || '')} onChange={(e) => {
                            const newProjects = [...(projects as Array<Record<string, unknown>>)]
                            newProjects[projectIndex] = { ...newProjects[projectIndex], title: e.target.value }
                            updateNestedValue(['projects'], newProjects)
                          }} className="w-full bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base" />
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Subtitle</label>
                          <input type="text" value={String(project.subtitle || '')} onChange={(e) => {
                            const newProjects = [...(projects as Array<Record<string, unknown>>)]
                            newProjects[projectIndex] = { ...newProjects[projectIndex], subtitle: e.target.value }
                            updateNestedValue(['projects'], newProjects)
                          }} className="w-full bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base" />
                        </div>
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Card Image</label>
                        <div className="flex gap-2">
                          <input type="text" value={String(project.image || '')} onChange={(e) => {
                            const newProjects = [...(projects as Array<Record<string, unknown>>)]
                            newProjects[projectIndex] = { ...newProjects[projectIndex], image: e.target.value }
                            updateNestedValue(['projects'], newProjects)
                          }} className="flex-1 bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base" />
                          <button type="button" onClick={() => triggerUpload(['projects', projectIndex.toString(), 'image'])} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                            Upload
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Tags/Features (comma separated)</label>
                        <input type="text" value={(project.features as string[] || []).join(', ')} onChange={(e) => {
                          const newProjects = [...(projects as Array<Record<string, unknown>>)]
                          newProjects[projectIndex] = { ...newProjects[projectIndex], features: e.target.value.split(',').map(s => s.trim()).filter(s => s) }
                          updateNestedValue(['projects'], newProjects)
                        }} className="w-full bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base" placeholder="Brand Strategy, Visual Identity" />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Process Section Heading */}
              <section className={`rounded-2xl p-5 md:p-7 border ${darkMode ? 'bg-[#111111] border-white/[0.06]' : 'bg-white border-gray-200 shadow-sm'}`}>
                <h3 className={`text-lg md:text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Our Process Section Text</h3>
                <p className="text-gray-500 text-sm mb-4">&quot;OUR PROCESS - RESHAPING PERSPECTIVE THAT CHALLENGE THE ORDINARY&quot;</p>
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Subtitle</label>
                    <input type="text" value={String((homepage.processSection as Record<string, unknown>)?.subtitle || '')} onChange={(e) => updateNestedValue(['homepage', 'processSection', 'subtitle'], e.target.value)} className="w-full bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Lines</label>
                    {((homepage.processSection as Record<string, unknown>)?.lines as string[] || []).map((line: string, i: number) => (
                      <input key={i} type="text" value={line} onChange={(e) => {
                        const newLines = [...((homepage.processSection as Record<string, unknown>)?.lines as string[] || [])]
                        newLines[i] = e.target.value
                        updateNestedValue(['homepage', 'processSection', 'lines'], newLines)
                      }} className="w-full bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base mb-2" />
                    ))}
                  </div>
                </div>
              </section>

              {/* Process Cards */}
              <section className={`rounded-2xl p-5 md:p-7 border ${darkMode ? 'bg-[#111111] border-white/[0.06]' : 'bg-white border-gray-200 shadow-sm'}`}>
                <h3 className={`text-lg md:text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Process Cards (Analyze/Observe/Execute)</h3>
                {((homepage.processSection as Record<string, unknown>)?.cards as Array<Record<string, unknown>> || []).map((card, i) => (
                  <div key={i} className="bg-gray-50 p-5 rounded-lg space-y-4 border border-gray-200">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Title</label>
                        <input type="text" value={String(card.title || '')} onChange={(e) => {
                          const newCards = [...((homepage.processSection as Record<string, unknown>)?.cards as Array<Record<string, unknown>> || [])]
                          newCards[i] = { ...newCards[i], title: e.target.value }
                          updateNestedValue(['homepage', 'processSection', 'cards'], newCards)
                        }} className="w-full bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base" />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Image</label>
                        <div className="flex gap-2">
                          <input type="text" value={String(card.image || '')} onChange={(e) => {
                            const newCards = [...((homepage.processSection as Record<string, unknown>)?.cards as Array<Record<string, unknown>> || [])]
                            newCards[i] = { ...newCards[i], image: e.target.value }
                            updateNestedValue(['homepage', 'processSection', 'cards'], newCards)
                          }} className="flex-1 bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base" />
                          <button onClick={() => {
                            setUploadTarget({ path: ['homepage', 'processSection', 'cards'], index: i })
                            fileInputRef.current?.click()
                          }} className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm">Upload</button>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Description</label>
                      <textarea value={String(card.description || '')} onChange={(e) => {
                        const newCards = [...((homepage.processSection as Record<string, unknown>)?.cards as Array<Record<string, unknown>> || [])]
                        newCards[i] = { ...newCards[i], description: e.target.value }
                        updateNestedValue(['homepage', 'processSection', 'cards'], newCards)
                      }} className="w-full bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base" rows={2} />
                    </div>
                  </div>
                ))}
              </section>

              {/* Testimonials */}
              <section className={`rounded-2xl p-5 md:p-7 border ${darkMode ? 'bg-[#111111] border-white/[0.06]' : 'bg-white border-gray-200 shadow-sm'}`}>
                <h3 className={`text-lg md:text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Testimonials</h3>
                {((homepage.testimonials as Record<string, unknown>)?.items as Array<Record<string, unknown>> || []).map((item, i) => (
                  <div key={i} className="bg-gray-50 p-5 rounded-lg space-y-4 border border-gray-200">
                    <textarea value={String(item.quote || '')} onChange={(e) => {
                      const newItems = [...((homepage.testimonials as Record<string, unknown>)?.items as Array<Record<string, unknown>> || [])]
                      newItems[i] = { ...newItems[i], quote: e.target.value }
                      updateNestedValue(['homepage', 'testimonials', 'items'], newItems)
                    }} className="w-full bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base mb-2" rows={2} placeholder="Quote" />
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" value={String(item.name || '')} onChange={(e) => {
                        const newItems = [...((homepage.testimonials as Record<string, unknown>)?.items as Array<Record<string, unknown>> || [])]
                        newItems[i] = { ...newItems[i], name: e.target.value }
                        updateNestedValue(['homepage', 'testimonials', 'items'], newItems)
                      }} className="bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base" placeholder="Name" />
                      <input type="text" value={String(item.position || '')} onChange={(e) => {
                        const newItems = [...((homepage.testimonials as Record<string, unknown>)?.items as Array<Record<string, unknown>> || [])]
                        newItems[i] = { ...newItems[i], position: e.target.value }
                        updateNestedValue(['homepage', 'testimonials', 'items'], newItems)
                      }} className="bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base" placeholder="Position" />
                    </div>
                  </div>
                ))}
                <button onClick={() => {
                  const newItems = [...((homepage.testimonials as Record<string, unknown>)?.items as Array<Record<string, unknown>> || []), { id: Date.now().toString(), quote: '', name: '', position: '' }]
                  updateNestedValue(['homepage', 'testimonials', 'items'], newItems)
                }} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">+ Add Testimonial</button>
              </section>

              {/* CTA Section */}
              <section className={`rounded-2xl p-5 md:p-7 border ${darkMode ? 'bg-[#111111] border-white/[0.06]' : 'bg-white border-gray-200 shadow-sm'}`}>
                <h3 className={`text-lg md:text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>CTA Section</h3>
                <p className="text-gray-500 text-sm mb-4">&quot;Ready to transform your vision? We&apos;re here to help.&quot;</p>
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Heading Lines</label>
                    {((homepage.ctaSection as Record<string, unknown>)?.heading as string[] || []).map((line: string, i: number) => (
                      <input key={i} type="text" value={line} onChange={(e) => {
                        const newHeading = [...((homepage.ctaSection as Record<string, unknown>)?.heading as string[] || [])]
                        newHeading[i] = e.target.value
                        updateNestedValue(['homepage', 'ctaSection', 'heading'], newHeading)
                      }} className="w-full bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base mb-2" />
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Button Text</label>
                      <input type="text" value={String((homepage.ctaSection as Record<string, unknown>)?.buttonText || '')} onChange={(e) => updateNestedValue(['homepage', 'ctaSection', 'buttonText'], e.target.value)} className="w-full bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Button Link URL</label>
                      <input type="text" value={String((homepage.ctaSection as Record<string, unknown>)?.buttonLink || '')} onChange={(e) => updateNestedValue(['homepage', 'ctaSection', 'buttonLink'], e.target.value)} className="w-full bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" placeholder="/contact" />
                    </div>
                  </div>
                </div>
              </section>

              {/* Footer (Shared across all pages) */}
              <section className={`rounded-2xl p-5 md:p-7 border ${darkMode ? 'bg-[#111111] border-white/[0.06]' : 'bg-white border-gray-200 shadow-sm'}`}>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Footer</h3>
                <p className="text-gray-500 text-sm mb-4">This footer is shared across all pages (Homepage, Projects, Studio, etc.)</p>
                <div className="space-y-6">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>CTA Title (Right side text)</label>
                    <input type="text" value={String((homepage.footer as Record<string, unknown>)?.ctaTitle || '')} onChange={(e) => updateNestedValue(['homepage', 'footer', 'ctaTitle'], e.target.value)} className="w-full bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" placeholder="WE WOULD LOVE TO HEAR MORE FROM YOU!" autoCapitalize="off" autoCorrect="off" spellCheck={false} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>CTA Button Text</label>
                      <input type="text" value={String((homepage.footer as Record<string, unknown>)?.ctaButtonText || '')} onChange={(e) => updateNestedValue(['homepage', 'footer', 'ctaButtonText'], e.target.value)} className="w-full bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" placeholder="GET IN TOUCH" />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>CTA Button Link URL</label>
                      <input type="text" value={String((homepage.footer as Record<string, unknown>)?.ctaButtonLink || '')} onChange={(e) => updateNestedValue(['homepage', 'footer', 'ctaButtonLink'], e.target.value)} className="w-full bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" placeholder="/contact" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Brand Name (Large Text)</label>
                      <input type="text" value={String((homepage.footer as Record<string, unknown>)?.brandName || '')} onChange={(e) => updateNestedValue(['homepage', 'footer', 'brandName'], e.target.value)} className="w-full bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" autoCapitalize="off" autoCorrect="off" spellCheck={false} />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Copyright</label>
                      <input type="text" value={String((homepage.footer as Record<string, unknown>)?.copyright || '')} onChange={(e) => updateNestedValue(['homepage', 'footer', 'copyright'], e.target.value)} className="w-full bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" autoCapitalize="off" autoCorrect="off" spellCheck={false} />
                    </div>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Navigation Links</label>
                    {(((homepage.footer as Record<string, unknown>)?.navigation as Array<Record<string, string>>) || []).map((link, i) => (
                      <div key={i} className="flex gap-2 mb-2">
                        <input type="text" value={link.label || ''} onChange={(e) => {
                          const nav = [...(((homepage.footer as Record<string, unknown>)?.navigation as Array<Record<string, string>>) || [])]
                          nav[i] = { ...nav[i], label: e.target.value }
                          updateNestedValue(['homepage', 'footer', 'navigation'], nav)
                        }} className="flex-1 bg-white text-gray-900 rounded-lg p-2 border border-gray-300" placeholder="Label" autoCapitalize="off" />
                        <input type="text" value={link.href || ''} onChange={(e) => {
                          const nav = [...(((homepage.footer as Record<string, unknown>)?.navigation as Array<Record<string, string>>) || [])]
                          nav[i] = { ...nav[i], href: e.target.value }
                          updateNestedValue(['homepage', 'footer', 'navigation'], nav)
                        }} className="flex-1 bg-white text-gray-900 rounded-lg p-2 border border-gray-300" placeholder="URL" />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Social Links</label>
                    {(((homepage.footer as Record<string, unknown>)?.social as Array<Record<string, string>>) || []).map((link, i) => (
                      <div key={i} className="flex gap-2 mb-2">
                        <input type="text" value={link.label || ''} onChange={(e) => {
                          const social = [...(((homepage.footer as Record<string, unknown>)?.social as Array<Record<string, string>>) || [])]
                          social[i] = { ...social[i], label: e.target.value }
                          updateNestedValue(['homepage', 'footer', 'social'], social)
                        }} className="flex-1 bg-white text-gray-900 rounded-lg p-2 border border-gray-300" placeholder="Label" autoCapitalize="off" />
                        <input type="text" value={link.href || ''} onChange={(e) => {
                          const social = [...(((homepage.footer as Record<string, unknown>)?.social as Array<Record<string, string>>) || [])]
                          social[i] = { ...social[i], href: e.target.value }
                          updateNestedValue(['homepage', 'footer', 'social'], social)
                        }} className="flex-1 bg-white text-gray-900 rounded-lg p-2 border border-gray-300" placeholder="URL" />
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* PROJECTS PAGE */}
          {activePage === 'projects' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
              
              {/* Tab Navigation */}
              <div className="flex gap-2 border-b border-gray-300 pb-0">
                <button
                  onClick={() => setProjectsTab('main')}
                  className={`px-6 py-3 font-medium rounded-t-lg transition-colors ${projectsTab === 'main' ? 'bg-white text-gray-900 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
                >
                  Main Projects Page
                </button>
                <button
                  onClick={() => setProjectsTab('individual')}
                  className={`px-6 py-3 font-medium rounded-t-lg transition-colors ${projectsTab === 'individual' ? 'bg-white text-gray-900 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
                >
                  Individual Project Pages
                </button>
              </div>

              {/* Main Projects Page Tab */}
              {projectsTab === 'main' && (
                <div className="space-y-6">
                  <p className="text-gray-500 text-sm">Edit the main projects listing page at /projects</p>
                  
                  <section className={`rounded-2xl p-5 md:p-7 border ${darkMode ? 'bg-[#111111] border-white/[0.06]' : 'bg-white border-gray-200 shadow-sm'}`}>
                    <h3 className={`text-lg md:text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Page Title</h3>
                    <input type="text" value={String(projectsPage?.title || '')} onChange={(e) => updateNestedValue(['projectsPage', 'title'], e.target.value)} className="w-full bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" placeholder="e.g., PROJECTS." autoCapitalize="off" autoCorrect="off" spellCheck={false} />
                  </section>

                  <section className={`rounded-2xl p-5 md:p-7 border ${darkMode ? 'bg-[#111111] border-white/[0.06]' : 'bg-white border-gray-200 shadow-sm'}`}>
                    <h3 className={`text-lg md:text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Filter Categories</h3>
                    <p className="text-gray-400 text-sm mb-4">Categories shown as filter buttons on the projects page</p>
                    {((projectsPage?.filters as string[]) || []).map((filter: string, i: number) => (
                      <div key={i} className="flex gap-2 mb-2">
                        <input type="text" value={filter} onChange={(e) => {
                          const newFilters = [...((projectsPage?.filters as string[]) || [])]
                          newFilters[i] = e.target.value
                          updateNestedValue(['projectsPage', 'filters'], newFilters)
                        }} className="flex-1 bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" autoCapitalize="off" autoCorrect="off" spellCheck={false} />
                        <button onClick={() => {
                          const newFilters = ((projectsPage?.filters as string[]) || []).filter((_, idx) => idx !== i)
                          updateNestedValue(['projectsPage', 'filters'], newFilters)
                        }} className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm">Remove</button>
                      </div>
                    ))}
                    <button onClick={() => {
                      const newFilters = [...((projectsPage?.filters as string[]) || []), 'NEW FILTER']
                      updateNestedValue(['projectsPage', 'filters'], newFilters)
                    }} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm mt-2">+ Add Filter</button>
                  </section>

                  <section className={`rounded-2xl p-5 md:p-7 border ${darkMode ? 'bg-[#111111] border-white/[0.06]' : 'bg-white border-gray-200 shadow-sm'}`}>
                    <h3 className={`text-lg md:text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Project Cards</h3>
                    <p className="text-gray-400 text-sm mb-4">Projects displayed on the listing page</p>
                    {projects.map((project, i) => (
                      <div key={String(project.id)} className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
                        <h4 className="text-lg font-bold text-gray-900 mb-3">{String(project.title)}</h4>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Display Order</label>
                            <input type="number" value={project.order === undefined ? '' : String(project.order)} onChange={(e) => {
                              const raw = e.target.value
                              const n = raw === '' ? undefined : Number(raw)
                              const newProjects = [...projects]
                              newProjects[i] = { ...newProjects[i], order: (n !== undefined && Number.isFinite(n)) ? n : undefined }
                              updateNestedValue(['projects'], newProjects)
                            }} className="w-full bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base" />
                          </div>
                          <div>
                            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Card Image</label>
                            <div className="flex gap-2">
                              <input type="text" value={String(project.image || '')} onChange={(e) => {
                                const newProjects = [...projects]
                                newProjects[i] = { ...newProjects[i], image: e.target.value }
                                updateNestedValue(['projects'], newProjects)
                              }} className="flex-1 bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base" />
                              <button onClick={() => {
                                setUploadTarget({ path: ['projects', String(i), 'image'] })
                                fileInputRef.current?.click()
                              }} className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm">Upload</button>
                            </div>
                            {project.image ? <img src={String(project.image)} alt="" className="mt-2 w-24 h-16 object-cover rounded" /> : null}
                          </div>
                          <div>
                            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Title</label>
                            <input type="text" value={String(project.title || '')} onChange={(e) => {
                              const newProjects = [...projects]
                              newProjects[i] = { ...newProjects[i], title: e.target.value }
                              updateNestedValue(['projects'], newProjects)
                            }} className="w-full bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base" autoCapitalize="off" autoCorrect="off" spellCheck={false} />
                          </div>
                        </div>
                        <div className="mb-4">
                          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Subtitle/Description</label>
                          <input type="text" value={String(project.subtitle || '')} onChange={(e) => {
                            const newProjects = [...projects]
                            newProjects[i] = { ...newProjects[i], subtitle: e.target.value }
                            updateNestedValue(['projects'], newProjects)
                          }} className="w-full bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base" autoCapitalize="off" autoCorrect="off" spellCheck={false} />
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Tags/Features (comma separated)</label>
                          <input type="text" value={(project.features as string[] || []).join(', ')} onChange={(e) => {
                            const newProjects = [...projects]
                            newProjects[i] = { ...newProjects[i], features: e.target.value.split(',').map(f => f.trim()) }
                            updateNestedValue(['projects'], newProjects)
                          }} className="w-full bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base" autoCapitalize="off" autoCorrect="off" spellCheck={false} />
                        </div>
                      </div>
                    ))}
                  </section>

                  <section className={`rounded-2xl p-5 md:p-7 border ${darkMode ? 'bg-[#111111] border-white/[0.06]' : 'bg-white border-gray-200 shadow-sm'}`}>
                    <h3 className={`text-lg md:text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>CTA Section Heading</h3>
                    <p className="text-gray-400 text-sm mb-4">The call-to-action heading at the bottom of the page</p>
                    {((projectsPage?.ctaHeading as string[]) || []).map((line: string, i: number) => (
                      <input key={i} type="text" value={line} onChange={(e) => {
                        const newHeading = [...((projectsPage?.ctaHeading as string[]) || [])]
                        newHeading[i] = e.target.value
                        updateNestedValue(['projectsPage', 'ctaHeading'], newHeading)
                      }} className="w-full bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base mb-2" autoCapitalize="off" autoCorrect="off" spellCheck={false} />
                    ))}
                  </section>

                  <section className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <p className="text-blue-700 text-sm">💡 <strong>Footer</strong> is shared across all pages. Edit it in the <strong>Homepage</strong> section.</p>
                  </section>
                </div>
              )}

              {/* Individual Project Pages Tab */}
              {projectsTab === 'individual' && (
                <div className="space-y-6">
                  <p className="text-gray-500 text-sm">Edit individual project pages. Each project has: Hero, Gallery Images, Carousel, and Footer.</p>

                  {projects.map((project, i) => (
                    <section key={String(project.id)} className="bg-white rounded-lg p-6 space-y-6 border border-gray-200 shadow-sm">
                      <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                        <h3 className="text-xl font-bold text-gray-900">{String(project.title)}</h3>
                        <span className="text-gray-500 text-sm">/projects/{String(project.id)}</span>
                      </div>

                      {/* Project Slug/ID */}
                      <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                        <label className="block text-sm font-medium mb-2 text-gray-700">Project URL Slug (ID)</label>
                        <p className="text-gray-500 text-xs mb-2">This determines the URL path: /projects/[slug]</p>
                        <input type="text" value={String(project.id || '')} onChange={(e) => {
                          const newSlug = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-')
                          const newProjects = [...projects]
                          newProjects[i] = { ...newProjects[i], id: newSlug, href: '/projects/' + newSlug }
                          updateNestedValue(['projects'], newProjects)
                        }} className="w-full bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base" placeholder="e.g., my-project-name" />

                        <div className="mt-4">
                          <label className="block text-sm font-medium mb-2 text-gray-700">Display Order</label>
                          <p className="text-gray-500 text-xs mb-2">Lower numbers appear first on /projects and Homepage.</p>
                          <input type="number" value={project.order === undefined ? '' : String(project.order)} onChange={(e) => {
                            const raw = e.target.value
                            const n = raw === '' ? undefined : Number(raw)
                            const newProjects = [...projects]
                            newProjects[i] = { ...newProjects[i], order: (n !== undefined && Number.isFinite(n)) ? n : undefined }
                            updateNestedValue(['projects'], newProjects)
                          }} className="w-full bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base" placeholder="e.g., 1" />
                        </div>
                      </div>

                      {/* Remove Project */}
                      <div className="flex justify-end mt-3">
                        <button
                          type="button"
                          onClick={() => {
                            if (!window.confirm('Remove this project? This cannot be undone.')) return
                            const newProjects = projects.filter((_, index) => index !== i)
                            updateNestedValue(['projects'], newProjects)
                          }}
                          className="px-3 py-1.5 text-sm rounded-lg bg-red-600 hover:bg-red-700 text-white"
                        >
                          Remove Project
                        </button>
                      </div>

                      {/* BLOCK 1: Hero Section */}
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <h4 className="text-lg font-semibold text-blue-600 mb-3">Block 1: Hero Section</h4>
                        <p className="text-gray-500 text-xs mb-3">Full-width background image with title overlay</p>
                        <div className="mb-4">
                          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Hero Image</label>
                          <div className="flex gap-2">
                            <input type="text" value={String(project.heroImage || '')} onChange={(e) => {
                              const newProjects = [...projects]
                              newProjects[i] = { ...newProjects[i], heroImage: e.target.value }
                              updateNestedValue(['projects'], newProjects)
                            }} className="flex-1 bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base" />
                            <button onClick={() => {
                              setUploadTarget({ path: ['projects', String(i), 'heroImage'] })
                              fileInputRef.current?.click()
                            }} className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm">Upload</button>
                          </div>
                          {project.heroImage ? <img src={String(project.heroImage)} alt="" className="mt-2 w-48 h-28 object-cover rounded" /> : null}
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Hero Title Lines</label>
                          {((project.heroTitle as string[]) || []).map((line: string, j: number) => (
                            <input key={j} type="text" value={line} onChange={(e) => {
                              const newProjects = [...projects]
                              const newHeroTitle = [...((project.heroTitle as string[]) || [])]
                              newHeroTitle[j] = e.target.value
                              newProjects[i] = { ...newProjects[i], heroTitle: newHeroTitle }
                              updateNestedValue(['projects'], newProjects)
                            }} className="w-full bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base mb-2" autoCapitalize="off" autoCorrect="off" spellCheck={false} />
                          ))}
                        </div>
                      </div>

                      {/* BLOCK 2: Gallery Images (with loading effects) */}
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <h4 className="text-lg font-semibold text-green-600 mb-3">Block 2: Gallery Images (Parallax Effect)</h4>
                        <p className="text-gray-500 text-xs mb-3">Two images with scroll-based parallax/loading animations</p>
                        <div className="grid grid-cols-2 gap-4">
                          {((project.galleryImages as string[]) || []).map((img: string, j: number) => (
                            <div key={j}>
                              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Image {j + 1}</label>
                              <div className="flex gap-2">
                                <input type="text" value={img} onChange={(e) => {
                                  const newProjects = [...projects]
                                  const newGallery = [...((project.galleryImages as string[]) || [])]
                                  newGallery[j] = e.target.value
                                  newProjects[i] = { ...newProjects[i], galleryImages: newGallery }
                                  updateNestedValue(['projects'], newProjects)
                                }} className="flex-1 bg-white text-gray-900 rounded-lg p-2 border border-gray-300" />
                                <button onClick={() => {
                                  setUploadTarget({ path: ['projects', String(i), 'galleryImages', String(j)] })
                                  fileInputRef.current?.click()
                                }} className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded-lg text-xs">Upload</button>
                              </div>
                              {img ? <img src={img} alt="" className="mt-2 w-24 h-16 object-cover rounded" /> : null}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* BLOCK 3: Carousel Section */}
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <h4 className="text-lg font-semibold text-purple-600 mb-3">Block 3: Carousel Section</h4>
                        <p className="text-gray-500 text-xs mb-3">Section title + navigable image carousel</p>
                        <div className="mb-4">
                          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Section Title</label>
                          <input type="text" value={String(project.sectionTitle || '')} onChange={(e) => {
                            const newProjects = [...projects]
                            newProjects[i] = { ...newProjects[i], sectionTitle: e.target.value }
                            updateNestedValue(['projects'], newProjects)
                          }} className="w-full bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base" autoCapitalize="off" autoCorrect="off" spellCheck={false} />
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Carousel Slides (2 images per slide)</label>
                          {((project.carouselSlides as string[][]) || []).map((slide: string[], slideIdx: number) => (
                            <div key={slideIdx} className="bg-white p-3 rounded-lg mb-3 border border-gray-200">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-600">Slide {slideIdx + 1}</span>
                                <button onClick={() => {
                                  const newProjects = [...projects]
                                  const newSlides = ((project.carouselSlides as string[][]) || []).filter((_, idx) => idx !== slideIdx)
                                  newProjects[i] = { ...newProjects[i], carouselSlides: newSlides }
                                  updateNestedValue(['projects'], newProjects)
                                }} className="text-red-400 hover:text-red-300 text-xs">Remove Slide</button>
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                {slide.map((imgUrl: string, imgIdx: number) => (
                                  <div key={imgIdx}>
                                    <div className="flex gap-2">
                                      <input type="text" value={imgUrl} onChange={(e) => {
                                        const newProjects = [...projects]
                                        const newSlides = [...((project.carouselSlides as string[][]) || [])]
                                        newSlides[slideIdx] = [...newSlides[slideIdx]]
                                        newSlides[slideIdx][imgIdx] = e.target.value
                                        newProjects[i] = { ...newProjects[i], carouselSlides: newSlides }
                                        updateNestedValue(['projects'], newProjects)
                                      }} className="flex-1 bg-white text-gray-900 rounded p-2 border border-gray-300 text-sm" />
                                      <button onClick={() => {
                                        setUploadTarget({ path: ['projects', String(i), 'carouselSlides', String(slideIdx), String(imgIdx)] })
                                        fileInputRef.current?.click()
                                      }} className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs">Upload</button>
                                    </div>
                                    {imgUrl ? <img src={imgUrl} alt="" className="mt-1 w-20 h-12 object-cover rounded" /> : null}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                          <button onClick={() => {
                            const newProjects = [...projects]
                            const newSlides = [...((project.carouselSlides as string[][]) || []), ['', '']]
                            newProjects[i] = { ...newProjects[i], carouselSlides: newSlides }
                            updateNestedValue(['projects'], newProjects)
                          }} className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-sm">+ Add Carousel Slide</button>
                        </div>
                      </div>

                      {/* BLOCK 4: Project Info */}
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <h4 className="text-lg font-semibold text-yellow-600 mb-3">Block 4: Project Info</h4>
                        <div className="mb-4">
                          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Title</label>
                          <input type="text" value={String(project.title || '')} onChange={(e) => {
                            const newProjects = [...projects]
                            newProjects[i] = { ...newProjects[i], title: e.target.value }
                            updateNestedValue(['projects'], newProjects)
                          }} className="w-full bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base" autoCapitalize="off" />
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Year</label>
                            <input type="text" value={String(project.year || '')} onChange={(e) => {
                              const newProjects = [...projects]
                              newProjects[i] = { ...newProjects[i], year: e.target.value }
                              updateNestedValue(['projects'], newProjects)
                            }} className="w-full bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base" />
                          </div>
                          <div>
                            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Client</label>
                            <input type="text" value={String(project.client || '')} onChange={(e) => {
                              const newProjects = [...projects]
                              newProjects[i] = { ...newProjects[i], client: e.target.value }
                              updateNestedValue(['projects'], newProjects)
                            }} className="w-full bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base" />
                          </div>
                        </div>
                        <div className="mb-4">
                          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Description</label>
                          <textarea value={String(project.description || '')} onChange={(e) => {
                            const newProjects = [...projects]
                            newProjects[i] = { ...newProjects[i], description: e.target.value }
                            updateNestedValue(['projects'], newProjects)
                          }} className="w-full bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base" rows={3} />
                        </div>
                        <div className="mb-4">
                          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Card Image (for projects listing)</label>
                          <div className="flex gap-2">
                            <input type="text" value={String(project.image || '')} onChange={(e) => {
                              const newProjects = [...projects]
                              newProjects[i] = { ...newProjects[i], image: e.target.value }
                              updateNestedValue(['projects'], newProjects)
                            }} className="flex-1 bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base" />
                            <button onClick={() => {
                              setUploadTarget({ path: ['projects', String(i), 'image'] })
                              fileInputRef.current?.click()
                            }} className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm">Upload</button>
                          </div>
                          {project.image ? <img src={String(project.image)} alt="" className="mt-2 w-32 h-20 object-cover rounded" /> : null}
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Scope of Work</label>
                          <input type="text" value={(project.features as string[] || []).join(', ')} onChange={(e) => {
                            const newProjects = [...projects]
                            newProjects[i] = { ...newProjects[i], features: e.target.value.split(',').map(f => f.trim()) }
                            updateNestedValue(['projects'], newProjects)
                          }} className="w-full bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base" />
                        </div>
                      </div>

                      {/* Footer Note */}
                      <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                        <p className="text-blue-700 text-sm">💡 <strong>Footer</strong> is shared across all pages. Edit it in the <strong>Homepage</strong> section.</p>
                      </div>
                    </section>
                  ))}
                  
                  <button onClick={() => {
                    const newId = 'project-' + Date.now()
                    const existingOrders = (projects as Array<Record<string, unknown>>)
                      .map(p => (typeof p.order === 'number' ? p.order : Number(p.order)))
                      .filter(n => Number.isFinite(n)) as number[]
                    const nextOrder = existingOrders.length ? (Math.max(...existingOrders) + 1) : ((projects as Array<Record<string, unknown>>).length + 1)
                    const newProject = {
                      id: newId,
                      title: 'NEW PROJECT',
                      subtitle: 'Project subtitle',
                      image: '',
                      heroImage: '',
                      href: '/projects/' + newId,
                      order: nextOrder,
                      features: ['Feature 1'],
                      year: '2024',
                      client: 'Client Name',
                      description: 'Project description',
                      heroTitle: ['NEW', 'PROJECT'],
                      sectionTitle: 'Section title',
                      galleryImages: ['', ''],
                      carouselSlides: [['', '']],
                      nextProjects: []
                    }
                    updateNestedValue(['projects'], [...projects, newProject])
                  }} className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium">+ Add New Project</button>
                </div>
              )}
            </div>
          )}

          {/* STUDIO PAGE */}
          {activePage === 'studio' && (
            <div className="space-y-8">
              <h2 className={`text-xl md:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Studio Page</h2>
              
              <section className={`rounded-2xl p-5 md:p-7 border ${darkMode ? 'bg-[#111111] border-white/[0.06]' : 'bg-white border-gray-200 shadow-sm'}`}>
                <h3 className={`text-lg md:text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Heading</h3>
                {((studioPage?.heading as string[]) || []).map((line: string, i: number) => (
                  <input key={i} type="text" value={line} onChange={(e) => {
                    const newHeading = [...((studioPage?.heading as string[]) || [])]
                    newHeading[i] = e.target.value
                    updateNestedValue(['studioPage', 'heading'], newHeading)
                  }} className="w-full bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base mb-2" autoCapitalize="off" autoCorrect="off" spellCheck={false} />
                ))}
              </section>

              <section className={`rounded-2xl p-5 md:p-7 border ${darkMode ? 'bg-[#111111] border-white/[0.06]' : 'bg-white border-gray-200 shadow-sm'}`}>
                <h3 className={`text-lg md:text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Overview</h3>
                <input type="text" value={String(studioPage?.overviewTitle || '')} onChange={(e) => updateNestedValue(['studioPage', 'overviewTitle'], e.target.value)} className="w-full bg-gray-50 text-gray-900 rounded-xl p-4 border border-gray-300 text-base mb-4" placeholder="Overview Title" />
                <textarea value={String(studioPage?.overviewText1 || '')} onChange={(e) => updateNestedValue(['studioPage', 'overviewText1'], e.target.value)} className="w-full bg-gray-50 text-gray-900 rounded-xl p-4 border border-gray-300 text-base mb-4" rows={3} placeholder="Overview Text 1" />
                <textarea value={String(studioPage?.overviewText2 || '')} onChange={(e) => updateNestedValue(['studioPage', 'overviewText2'], e.target.value)} className="w-full bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" rows={3} placeholder="Overview Text 2" />
              </section>

              <section className={`rounded-2xl p-5 md:p-7 border ${darkMode ? 'bg-[#111111] border-white/[0.06]' : 'bg-white border-gray-200 shadow-sm'}`}>
                <h3 className={`text-lg md:text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Founders/Team</h3>
                {((studioPage?.founders as Array<Record<string, unknown>>) || []).map((founder, i) => (
                  <div key={i} className="bg-gray-50 p-5 rounded-lg space-y-4 border border-gray-200">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Name</label>
                        <input type="text" value={String(founder.name || '')} onChange={(e) => {
                          const newFounders = [...((studioPage?.founders as Array<Record<string, unknown>>) || [])]
                          newFounders[i] = { ...newFounders[i], name: e.target.value }
                          updateNestedValue(['studioPage', 'founders'], newFounders)
                        }} className="w-full bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base" />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Role</label>
                        <input type="text" value={String(founder.role || '')} onChange={(e) => {
                          const newFounders = [...((studioPage?.founders as Array<Record<string, unknown>>) || [])]
                          newFounders[i] = { ...newFounders[i], role: e.target.value }
                          updateNestedValue(['studioPage', 'founders'], newFounders)
                        }} className="w-full bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base" />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Video</label>
                      <div className="flex gap-2">
                        <input type="text" value={String(founder.video || '')} onChange={(e) => {
                          const newFounders = [...((studioPage?.founders as Array<Record<string, unknown>>) || [])]
                          newFounders[i] = { ...newFounders[i], video: e.target.value }
                          updateNestedValue(['studioPage', 'founders'], newFounders)
                        }} className="flex-1 bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base" />
                        <button onClick={() => {
                          setUploadTarget({ path: ['studioPage', 'founders', String(i), 'video'] })
                          fileInputRef.current?.click()
                        }} className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm">Upload</button>
                      </div>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Description</label>
                      <textarea value={String(founder.description || '')} onChange={(e) => {
                        const newFounders = [...((studioPage?.founders as Array<Record<string, unknown>>) || [])]
                        newFounders[i] = { ...newFounders[i], description: e.target.value }
                        updateNestedValue(['studioPage', 'founders'], newFounders)
                      }} className="w-full bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base" rows={2} />
                    </div>
                  </div>
                ))}
              </section>
            </div>
          )}

          {/* DATABASE PAGE */}
          {activePage === 'database' && (
            <div className="space-y-8">
              <h2 className={`text-xl md:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Database Page</h2>
              
              {/* Page Settings */}
              <section className={`rounded-2xl p-5 md:p-7 border ${darkMode ? 'bg-[#111111] border-white/[0.06]' : 'bg-white border-gray-200 shadow-sm'}`}>
                <h3 className={`text-lg md:text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Page Settings</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Page Title</label>
                      <input type="text" value={String(databasePage?.title || '')} onChange={(e) => updateNestedValue(['databasePage', 'title'], e.target.value)} className="w-full bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" autoCapitalize="off" />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Search Placeholder</label>
                      <input type="text" value={String(databasePage?.searchPlaceholder || '')} onChange={(e) => updateNestedValue(['databasePage', 'searchPlaceholder'], e.target.value)} className="w-full bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" autoCapitalize="off" />
                    </div>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Subtitle</label>
                    <input type="text" value={String(databasePage?.subtitle || '')} onChange={(e) => updateNestedValue(['databasePage', 'subtitle'], e.target.value)} className="w-full bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" autoCapitalize="off" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Not Found Title</label>
                      <input type="text" value={String(databasePage?.notFoundTitle || '')} onChange={(e) => updateNestedValue(['databasePage', 'notFoundTitle'], e.target.value)} className="w-full bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" autoCapitalize="off" />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Not Found Subtitle</label>
                      <input type="text" value={String(databasePage?.notFoundSubtitle || '')} onChange={(e) => updateNestedValue(['databasePage', 'notFoundSubtitle'], e.target.value)} className="w-full bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" autoCapitalize="off" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Project Info Section Title</label>
                      <input type="text" value={String(databasePage?.projectInfoTitle || '')} onChange={(e) => updateNestedValue(['databasePage', 'projectInfoTitle'], e.target.value)} className="w-full bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" autoCapitalize="off" />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Project Files Section Title</label>
                      <input type="text" value={String(databasePage?.projectFilesTitle || '')} onChange={(e) => updateNestedValue(['databasePage', 'projectFilesTitle'], e.target.value)} className="w-full bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" autoCapitalize="off" />
                    </div>
                  </div>
                </div>
              </section>

              {/* Database Projects */}
              <section className={`rounded-2xl p-5 md:p-7 border ${darkMode ? 'bg-[#111111] border-white/[0.06]' : 'bg-white border-gray-200 shadow-sm'}`}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className={`text-lg md:text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Database Projects</h3>
                  <button onClick={() => {
                    const newProjects = [...((databasePage?.projects as Array<Record<string, unknown>>) || [])]
                    const currentProjects = [...((databasePage?.projects as Array<Record<string, unknown>>) || [])]
                    newProjects.push({
                      code: 'project-' + Date.now(),
                      title: 'New Project',
                      status: 'in-progress',
                      image: '/placeholder.avif',
                      description: 'Project description...',
                      scopeOfWork: '',
                      client: '',
                      year: '',
                      files: []
                    })
                    updateNestedValue(['databasePage', 'projects'], newProjects)
                  }} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">+ Add New Project</button>
                </div>
                
                {((databasePage?.projects as Array<Record<string, unknown>>) || []).map((project, i) => (
                  <div key={i} className="bg-gray-50 p-5 rounded-lg space-y-4 border border-gray-200">
                    {/* Project Header */}
                    <div className="flex justify-between items-center border-b border-gray-300 pb-3">
                      <h4 className="text-lg font-bold text-gray-900">Project: {String(project.code || 'Untitled')}</h4>
                      <button onClick={() => {
                        const newProjects = ((databasePage?.projects as Array<Record<string, unknown>>) || []).filter((_, idx) => idx !== i)
                        updateNestedValue(['databasePage', 'projects'], newProjects)
                      }} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm">Delete Project</button>
                    </div>

                    {/* Basic Info */}
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <h5 className="text-md font-semibold text-blue-600 mb-3">🔑 Access & Basic Info</h5>
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Access Code</label>
                          <input type="text" value={String(project.code || '')} onChange={(e) => {
                            const newProjects = [...((databasePage?.projects as Array<Record<string, unknown>>) || [])]
                            newProjects[i] = { ...newProjects[i], code: e.target.value }
                            updateNestedValue(['databasePage', 'projects'], newProjects)
                          }} className="w-full bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base" autoCapitalize="off" />
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Project Title</label>
                          <input type="text" value={String(project.title || '')} onChange={(e) => {
                            const newProjects = [...((databasePage?.projects as Array<Record<string, unknown>>) || [])]
                            newProjects[i] = { ...newProjects[i], title: e.target.value }
                            updateNestedValue(['databasePage', 'projects'], newProjects)
                          }} className="w-full bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base" autoCapitalize="off" />
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Status</label>
                          <select value={String(project.status || '')} onChange={(e) => {
                            const newProjects = [...((databasePage?.projects as Array<Record<string, unknown>>) || [])]
                            newProjects[i] = { ...newProjects[i], status: e.target.value }
                            updateNestedValue(['databasePage', 'projects'], newProjects)
                          }} className="w-full bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base">
                            <option value="completed">Completed</option>
                            <option value="in-progress">In Progress</option>
                            <option value="planning">Planning</option>
                          </select>
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Project Image</label>
                        <div className="flex gap-2">
                          <input type="text" value={String(project.image || '')} onChange={(e) => {
                            const newProjects = [...((databasePage?.projects as Array<Record<string, unknown>>) || [])]
                            newProjects[i] = { ...newProjects[i], image: e.target.value }
                            updateNestedValue(['databasePage', 'projects'], newProjects)
                          }} className="flex-1 bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base" />
                          <button onClick={() => {
                            setUploadTarget({ path: ['databasePage', 'projects', String(i), 'image'] })
                            fileInputRef.current?.click()
                          }} className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm">Upload</button>
                        </div>
                        {project.image ? <img src={String(project.image)} alt="" className="mt-2 w-32 h-20 object-cover rounded" /> : null}
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Description</label>
                        <textarea value={String(project.description || '')} onChange={(e) => {
                          const newProjects = [...((databasePage?.projects as Array<Record<string, unknown>>) || [])]
                          newProjects[i] = { ...newProjects[i], description: e.target.value }
                          updateNestedValue(['databasePage', 'projects'], newProjects)
                        }} className="w-full bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base" rows={3} />
                      </div>
                    </div>

                    {/* Project Details */}
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <h5 className="text-md font-semibold text-green-600 mb-3">📋 Project Details</h5>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Scope of Work</label>
                          <input type="text" value={String(project.scopeOfWork || '')} onChange={(e) => {
                            const newProjects = [...((databasePage?.projects as Array<Record<string, unknown>>) || [])]
                            newProjects[i] = { ...newProjects[i], scopeOfWork: e.target.value }
                            updateNestedValue(['databasePage', 'projects'], newProjects)
                          }} className="w-full bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base" autoCapitalize="off" />
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Client</label>
                          <input type="text" value={String(project.client || '')} onChange={(e) => {
                            const newProjects = [...((databasePage?.projects as Array<Record<string, unknown>>) || [])]
                            newProjects[i] = { ...newProjects[i], client: e.target.value }
                            updateNestedValue(['databasePage', 'projects'], newProjects)
                          }} className="w-full bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base" autoCapitalize="off" />
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Year</label>
                          <input type="text" value={String(project.year || '')} onChange={(e) => {
                            const newProjects = [...((databasePage?.projects as Array<Record<string, unknown>>) || [])]
                            newProjects[i] = { ...newProjects[i], year: e.target.value }
                            updateNestedValue(['databasePage', 'projects'], newProjects)
                          }} className="w-full bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base" autoCapitalize="off" />
                        </div>
                      </div>
                    </div>

                    {/* Project Files */}
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex justify-between items-center mb-3">
                        <h5 className="text-md font-semibold text-purple-600">📁 Project Files</h5>
                        <button onClick={() => {
                          const newProjects = [...((databasePage?.projects as Array<Record<string, unknown>>) || [])]
                          const currentFiles = (project.files as Array<Record<string, unknown>>) || []
                          newProjects[i] = { ...newProjects[i], files: [...currentFiles, { type: 'PDF', title: 'Welcome to Nabshy', subtitle: 'nabshy project', date: new Date().toLocaleDateString(), downloadUrl: '#' }] }
                          updateNestedValue(['databasePage', 'projects'], newProjects)
                        }} className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-lg text-sm">+ Add File</button>
                      </div>
                      {((project.files as Array<Record<string, unknown>>) || []).map((file, fileIdx) => (
                        <div key={fileIdx} className="bg-white p-3 rounded-lg mb-3 border border-gray-200">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600">File {fileIdx + 1}</span>
                            <button onClick={() => {
                              const newProjects = [...((databasePage?.projects as Array<Record<string, unknown>>) || [])]
                              const newFiles = ((project.files as Array<Record<string, unknown>>) || []).filter((_, idx) => idx !== fileIdx)
                              newProjects[i] = { ...newProjects[i], files: newFiles }
                              updateNestedValue(['databasePage', 'projects'], newProjects)
                            }} className="text-red-400 hover:text-red-300 text-xs">Remove</button>
                          </div>
                          <div className="grid grid-cols-4 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
                              <select value={String(file.type || 'PDF')} onChange={(e) => {
                                const newProjects = [...((databasePage?.projects as Array<Record<string, unknown>>) || [])]
                                const newFiles = [...((project.files as Array<Record<string, unknown>>) || [])]
                                newFiles[fileIdx] = { ...newFiles[fileIdx], type: e.target.value }
                                newProjects[i] = { ...newProjects[i], files: newFiles }
                                updateNestedValue(['databasePage', 'projects'], newProjects)
                              }} className="w-full bg-white text-gray-900 rounded p-2 border border-gray-300 text-sm">
                                <option value="PDF">PDF</option>
                                <option value="DOC">DOC</option>
                                <option value="DWG">DWG</option>
                                <option value="ZIP">ZIP</option>
                                <option value="IMG">IMG</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
                              <input type="text" value={String(file.title || '')} onChange={(e) => {
                                const newProjects = [...((databasePage?.projects as Array<Record<string, unknown>>) || [])]
                                const newFiles = [...((project.files as Array<Record<string, unknown>>) || [])]
                                newFiles[fileIdx] = { ...newFiles[fileIdx], title: e.target.value }
                                newProjects[i] = { ...newProjects[i], files: newFiles }
                                updateNestedValue(['databasePage', 'projects'], newProjects)
                              }} className="w-full bg-white text-gray-900 rounded p-2 border border-gray-300 text-sm" />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Subtitle</label>
                              <input type="text" value={String(file.subtitle || '')} onChange={(e) => {
                                const newProjects = [...((databasePage?.projects as Array<Record<string, unknown>>) || [])]
                                const newFiles = [...((project.files as Array<Record<string, unknown>>) || [])]
                                newFiles[fileIdx] = { ...newFiles[fileIdx], subtitle: e.target.value }
                                newProjects[i] = { ...newProjects[i], files: newFiles }
                                updateNestedValue(['databasePage', 'projects'], newProjects)
                              }} className="w-full bg-white text-gray-900 rounded p-2 border border-gray-300 text-sm" />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Date</label>
                              <input type="text" value={String(file.date || '')} onChange={(e) => {
                                const newProjects = [...((databasePage?.projects as Array<Record<string, unknown>>) || [])]
                                const newFiles = [...((project.files as Array<Record<string, unknown>>) || [])]
                                newFiles[fileIdx] = { ...newFiles[fileIdx], date: e.target.value }
                                newProjects[i] = { ...newProjects[i], files: newFiles }
                                updateNestedValue(['databasePage', 'projects'], newProjects)
                              }} className="w-full bg-white text-gray-900 rounded p-2 border border-gray-300 text-sm" />
                            </div>
                          </div>
                          <div className="mt-2">
                            <label className="block text-xs font-medium text-gray-600 mb-1">Download URL</label>
                            <div className="flex gap-2">
                              <input type="text" value={String(file.downloadUrl || '')} onChange={(e) => {
                                const newProjects = [...((databasePage?.projects as Array<Record<string, unknown>>) || [])]
                                const newFiles = [...((project.files as Array<Record<string, unknown>>) || [])]
                                newFiles[fileIdx] = { ...newFiles[fileIdx], downloadUrl: e.target.value }
                                newProjects[i] = { ...newProjects[i], files: newFiles }
                                updateNestedValue(['databasePage', 'projects'], newProjects)
                              }} className="flex-1 bg-white text-gray-900 rounded p-2 border border-gray-300 text-sm" />
                              <button onClick={() => {
                                setUploadTarget({ path: ['databasePage', 'projects', String(i), 'files', String(fileIdx), 'downloadUrl'] })
                                fileInputRef.current?.click()
                              }} className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs">Upload</button>
                            </div>
                          </div>
                        </div>
                      ))}
                      {((project.files as Array<Record<string, unknown>>) || []).length === 0 && (
                        <p className="text-gray-400 text-sm text-center py-4">No files yet. Click &quot;+ Add File&quot; to add downloadable files.</p>
                      )}
                    </div>
                  </div>
                ))}

                {((databasePage?.projects as Array<Record<string, unknown>>) || []).length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-400 mb-4">No database projects yet.</p>
                    <button onClick={() => {
                      const newProjects = [{
                        code: 'project-001',
                        title: 'First Project',
                        status: 'in-progress',
                        image: '/placeholder.avif',
                        description: 'Project description...',
                        location: 'Location',
                        type: 'Type',
                        floors: 0,
                        units: 0,
                        areaPerUnit: 0,
                        files: []
                      }]
                      updateNestedValue(['databasePage', 'projects'], newProjects)
                    }} className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg">Create First Project</button>
                  </div>
                )}
              </section>
            </div>
          )}

          {/* CONTACT PAGE */}
          {activePage === 'contact' && (
            <div className="space-y-8">
              <h2 className={`text-xl md:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Contact Page</h2>
              
              <section className={`rounded-2xl p-5 md:p-7 border ${darkMode ? 'bg-[#111111] border-white/[0.06]' : 'bg-white border-gray-200 shadow-sm'}`}>
                <h3 className={`text-lg md:text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Page Title</h3>
                <input type="text" value={String(contactPage?.title || '')} onChange={(e) => updateNestedValue(['contactPage', 'title'], e.target.value)} className="w-full bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
              </section>

              <section className={`rounded-2xl p-5 md:p-7 border ${darkMode ? 'bg-[#111111] border-white/[0.06]' : 'bg-white border-gray-200 shadow-sm'}`}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className={`text-lg md:text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Offices</h3>
                  <button onClick={() => {
                    const newOffices = [...((contactPage?.offices as Array<Record<string, unknown>>) || []), {
                      id: Date.now().toString(),
                      tabTitle: 'New Office',
                      title: 'New Office',
                      label: 'New Office',
                      address: '',
                      email: '',
                      phoneDisplay: '',
                      phoneHref: '',
                      imageSrc: '',
                      mapUrl: ''
                    }]
                    updateNestedValue(['contactPage', 'offices'], newOffices)
                  }} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">+ Add Office</button>
                </div>
                
                {((contactPage?.offices as Array<Record<string, unknown>>) || []).map((office, i) => (
                  <div key={i} className="bg-gray-50 p-5 rounded-lg space-y-4 border border-gray-200">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Tab Title</label>
                        <input type="text" value={String(office.tabTitle || '')} onChange={(e) => {
                          const newOffices = [...((contactPage?.offices as Array<Record<string, unknown>>) || [])]
                          newOffices[i] = { ...newOffices[i], tabTitle: e.target.value }
                          updateNestedValue(['contactPage', 'offices'], newOffices)
                        }} className="w-full bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base" />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Title</label>
                        <input type="text" value={String(office.title || '')} onChange={(e) => {
                          const newOffices = [...((contactPage?.offices as Array<Record<string, unknown>>) || [])]
                          newOffices[i] = { ...newOffices[i], title: e.target.value }
                          updateNestedValue(['contactPage', 'offices'], newOffices)
                        }} className="w-full bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Address</label>
                        <input type="text" value={String(office.address || '')} onChange={(e) => {
                          const newOffices = [...((contactPage?.offices as Array<Record<string, unknown>>) || [])]
                          newOffices[i] = { ...newOffices[i], address: e.target.value }
                          updateNestedValue(['contactPage', 'offices'], newOffices)
                        }} className="w-full bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base" />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
                        <input type="text" value={String(office.email || '')} onChange={(e) => {
                          const newOffices = [...((contactPage?.offices as Array<Record<string, unknown>>) || [])]
                          newOffices[i] = { ...newOffices[i], email: e.target.value }
                          updateNestedValue(['contactPage', 'offices'], newOffices)
                        }} className="w-full bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 mb-4">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Phone Display</label>
                        <input type="text" value={String(office.phoneDisplay || '')} onChange={(e) => {
                          const newOffices = [...((contactPage?.offices as Array<Record<string, unknown>>) || [])]
                          newOffices[i] = { ...newOffices[i], phoneDisplay: e.target.value }
                          updateNestedValue(['contactPage', 'offices'], newOffices)
                        }} className="w-full bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base" />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Map URL (Google Maps link or coordinates)</label>
                      <input
                        type="text"
                        value={String((office as any).mapUrl || '')}
                        onChange={(e) => {
                          const newOffices = [...((contactPage?.offices as Array<Record<string, unknown>>) || [])]
                          newOffices[i] = { ...newOffices[i], mapUrl: e.target.value }
                          updateNestedValue(['contactPage', 'offices'], newOffices)
                        }}
                        className="w-full bg-white text-gray-900 rounded-xl p-4 border border-gray-300 text-base"
                      />
                    </div>
                    <button onClick={() => {
                      const newOffices = ((contactPage?.offices as Array<Record<string, unknown>>) || []).filter((_, idx) => idx !== i)
                      updateNestedValue(['contactPage', 'offices'], newOffices)
                    }} className="text-red-500 hover:text-red-400 text-sm">Remove Office</button>
                  </div>
                ))}
              </section>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
