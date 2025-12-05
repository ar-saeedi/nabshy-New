import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const adminFilePath = path.join(process.cwd(), 'src', 'data', 'admin.json')

function getAdminCredentials() {
  try {
    const data = fs.readFileSync(adminFilePath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading admin file:', error)
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    const admin = getAdminCredentials()
    if (!admin) {
      return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }

    if (username === admin.username && password === admin.password) {
      // Generate a simple token (in production, use JWT or proper session management)
      const token = Buffer.from(`${username}:${Date.now()}`).toString('base64')
      
      const response = NextResponse.json({ 
        success: true, 
        message: 'Login successful',
        token 
      })
      
      // Set cookie for session
      response.cookies.set('admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 // 24 hours
      })
      
      return response
    } else {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }
  } catch (error) {
    console.error('Error during authentication:', error)
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin_token')?.value
    
    if (token) {
      return NextResponse.json({ authenticated: true })
    } else {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: 'Logged out' })
  response.cookies.delete('admin_token')
  return response
}
