'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'

type AuditLog = {
  id: string
  userEmail: string
  action: string
  resource: string
  createdAt: number
}

type User = {
  id: string
  email: string
  name: string
  role: string
  lastLogin: number | null
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'dashboard' | 'content' | 'users' | 'logs' | 'settings'>('dashboard')
  const [users, setUsers] = useState<User[]>([])
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [content, setContent] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(true)

  // New user form
  const [newUserEmail, setNewUserEmail] = useState('')
  const [newUserName, setNewUserName] = useState('')
  const [newUserPassword, setNewUserPassword] = useState('')
  const [newUserRole, setNewUserRole] = useState<'editor' | 'admin'>('editor')
  const [showNewUserForm, setShowNewUserForm] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/manage/login')
    }
  }, [status, router])

  // Fetch data
  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [contentRes, usersRes, logsRes] = await Promise.all([
        fetch('/api/v2/content'),
        fetch('/api/v2/users'),
        fetch('/api/v2/audit?limit=20'),
      ])

      if (contentRes.ok) {
        const contentData = await contentRes.json()
        setContent(contentData)
      }

      if (usersRes.ok) {
        const usersData = await usersRes.json()
        setUsers(usersData)
      }

      if (logsRes.ok) {
        const logsData = await logsRes.json()
        setLogs(logsData)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchData()
    }
  }, [status, fetchData])

  // Save content
  const saveContent = async () => {
    if (!content) return
    setSaving(true)
    try {
      const res = await fetch('/api/v2/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      })
      if (res.ok) {
        setMessage({ type: 'success', text: 'Content saved successfully!' })
        fetchData()
      } else {
        setMessage({ type: 'error', text: 'Failed to save content' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error saving content' })
    } finally {
      setSaving(false)
      setTimeout(() => setMessage(null), 3000)
    }
  }

  // Create user
  const createUser = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/v2/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newUserEmail,
          name: newUserName,
          password: newUserPassword,
          role: newUserRole,
        }),
      })
      if (res.ok) {
        setMessage({ type: 'success', text: 'User created successfully!' })
        setShowNewUserForm(false)
        setNewUserEmail('')
        setNewUserName('')
        setNewUserPassword('')
        fetchData()
      } else {
        const data = await res.json()
        setMessage({ type: 'error', text: data.error || 'Failed to create user' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error creating user' })
    }
    setTimeout(() => setMessage(null), 3000)
  }

  // Delete user
  const deleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return
    try {
      const res = await fetch(`/api/v2/users?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setMessage({ type: 'success', text: 'User deleted successfully!' })
        fetchData()
      } else {
        const data = await res.json()
        setMessage({ type: 'error', text: data.error || 'Failed to delete user' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error deleting user' })
    }
    setTimeout(() => setMessage(null), 3000)
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  if (!session) return null

  const roleColors = {
    super_admin: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    admin: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    editor: 'bg-green-500/20 text-green-400 border-green-500/30',
  }

  const actionIcons: Record<string, string> = {
    login: '🔐',
    logout: '🚪',
    content_update: '📝',
    content_bulk_update: '📦',
    user_create: '👤',
    user_update: '✏️',
    user_delete: '🗑️',
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {/* Header */}
      <header className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b sticky top-0 z-50`}>
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-400 hover:bg-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              NABSHY <span className="text-blue-500">Admin</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-200 text-gray-600'}`}
            >
              {darkMode ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* Save Button */}
            <button
              onClick={saveContent}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save
                </>
              )}
            </button>

            {/* User Menu */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{session.user.name}</p>
                <p className="text-xs text-gray-500">{session.user.role}</p>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: '/manage/login' })}
                className={`p-2 rounded-lg ${darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-200'}`}
                title="Sign out"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Message Banner */}
        {message && (
          <div className={`px-4 py-2 ${message.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            {message.text}
          </div>
        )}
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r
          pt-16 lg:pt-0
        `}>
          <nav className="p-4 space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: '📊' },
              { id: 'content', label: 'Content', icon: '📝' },
              { id: 'users', label: 'Users', icon: '👥', adminOnly: true },
              { id: 'logs', label: 'Activity Logs', icon: '📋', adminOnly: true },
              { id: 'settings', label: 'Settings', icon: '⚙️' },
            ].map((item) => {
              if (item.adminOnly && !['super_admin', 'admin'].includes(session.user.role)) {
                return null
              }
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as typeof activeTab)
                    setSidebarOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === item.id
                      ? 'bg-blue-600 text-white'
                      : darkMode
                        ? 'text-gray-400 hover:bg-gray-700 hover:text-white'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </button>
              )
            })}
          </nav>

          {/* Quick Links */}
          <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <p className={`text-xs uppercase tracking-wider mb-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Quick Links</p>
            <div className="space-y-2">
              <a href="/" target="_blank" className={`flex items-center gap-2 text-sm ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                <span>🌐</span> View Website
              </a>
              <a href="/manage" className={`flex items-center gap-2 text-sm ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                <span>📄</span> Old Admin Panel
              </a>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8 min-h-[calc(100vh-64px)]">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Dashboard</h2>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl p-5`}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">👥</span>
                    </div>
                    <div>
                      <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{users.length}</p>
                      <p className="text-gray-500 text-sm">Total Users</p>
                    </div>
                  </div>
                </div>

                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl p-5`}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">📝</span>
                    </div>
                    <div>
                      <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{content ? Object.keys(content).length : 0}</p>
                      <p className="text-gray-500 text-sm">Content Sections</p>
                    </div>
                  </div>
                </div>

                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl p-5`}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">📋</span>
                    </div>
                    <div>
                      <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{logs.length}</p>
                      <p className="text-gray-500 text-sm">Recent Actions</p>
                    </div>
                  </div>
                </div>

                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl p-5`}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">🔐</span>
                    </div>
                    <div>
                      <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{session.user.role}</p>
                      <p className="text-gray-500 text-sm">Your Role</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl p-5`}>
                <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Recent Activity</h3>
                <div className="space-y-3">
                  {logs.slice(0, 5).map((log) => (
                    <div key={log.id} className={`flex items-center gap-3 p-3 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                      <span className="text-xl">{actionIcons[log.action] || '📌'}</span>
                      <div className="flex-1">
                        <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          <span className="font-medium">{log.userEmail}</span> - {log.action.replace('_', ' ')}
                        </p>
                        <p className="text-xs text-gray-500">
                          {log.resource && `on ${log.resource} • `}
                          {new Date(log.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Content Tab - Link to old admin */}
          {activeTab === 'content' && (
            <div className="space-y-6">
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Content Management</h2>
              <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl p-8 text-center`}>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                  Use the full content editor to manage all website content
                </p>
                <a
                  href="/manage"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium"
                >
                  <span>📝</span> Open Content Editor
                </a>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && ['super_admin', 'admin'].includes(session.user.role) && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>User Management</h2>
                <button
                  onClick={() => setShowNewUserForm(!showNewUserForm)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
                >
                  <span>+</span> Add User
                </button>
              </div>

              {/* New User Form */}
              {showNewUserForm && (
                <form onSubmit={createUser} className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl p-5`}>
                  <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Create New User</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Name</label>
                      <input
                        type="text"
                        value={newUserName}
                        onChange={(e) => setNewUserName(e.target.value)}
                        className={`w-full rounded-lg p-3 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                        required
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
                      <input
                        type="email"
                        value={newUserEmail}
                        onChange={(e) => setNewUserEmail(e.target.value)}
                        className={`w-full rounded-lg p-3 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                        required
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Password</label>
                      <input
                        type="password"
                        value={newUserPassword}
                        onChange={(e) => setNewUserPassword(e.target.value)}
                        className={`w-full rounded-lg p-3 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                        required
                        minLength={6}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Role</label>
                      <select
                        value={newUserRole}
                        onChange={(e) => setNewUserRole(e.target.value as 'editor' | 'admin')}
                        className={`w-full rounded-lg p-3 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                      >
                        <option value="editor">Editor</option>
                        {session.user.role === 'super_admin' && <option value="admin">Admin</option>}
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                      Create User
                    </button>
                    <button type="button" onClick={() => setShowNewUserForm(false)} className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg">
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Users List */}
              <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl overflow-hidden`}>
                <table className="w-full">
                  <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                    <tr>
                      <th className={`text-left px-5 py-3 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>User</th>
                      <th className={`text-left px-5 py-3 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Role</th>
                      <th className={`text-left px-5 py-3 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Last Login</th>
                      <th className={`text-right px-5 py-3 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-5 py-4">
                          <div>
                            <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{user.name}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${roleColors[user.role as keyof typeof roleColors]}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className={`px-5 py-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}
                        </td>
                        <td className="px-5 py-4 text-right">
                          {session.user.role === 'super_admin' && user.id !== session.user.id && (
                            <button
                              onClick={() => deleteUser(user.id)}
                              className="text-red-400 hover:text-red-300 text-sm"
                            >
                              Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Logs Tab */}
          {activeTab === 'logs' && ['super_admin', 'admin'].includes(session.user.role) && (
            <div className="space-y-6">
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Activity Logs</h2>
              <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl overflow-hidden`}>
                <table className="w-full">
                  <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                    <tr>
                      <th className={`text-left px-5 py-3 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Action</th>
                      <th className={`text-left px-5 py-3 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>User</th>
                      <th className={`text-left px-5 py-3 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Resource</th>
                      <th className={`text-left px-5 py-3 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {logs.map((log) => (
                      <tr key={log.id}>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <span>{actionIcons[log.action] || '📌'}</span>
                            <span className={darkMode ? 'text-white' : 'text-gray-900'}>{log.action.replace('_', ' ')}</span>
                          </div>
                        </td>
                        <td className={`px-5 py-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{log.userEmail}</td>
                        <td className={`px-5 py-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{log.resource || '-'}</td>
                        <td className={`px-5 py-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {new Date(log.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Settings</h2>
              <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl p-5`}>
                <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Your Profile</h3>
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Name</label>
                    <input
                      type="text"
                      defaultValue={session.user.name}
                      className={`w-full rounded-lg p-3 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
                    <input
                      type="email"
                      defaultValue={session.user.email}
                      className={`w-full rounded-lg p-3 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                    />
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                    Update Profile
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
