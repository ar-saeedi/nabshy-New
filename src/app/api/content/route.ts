import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'content.json')

function getContent() {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading content file:', error)
    return null
  }
}

function saveContent(content: Record<string, unknown>) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(content, null, 2), 'utf-8')
    return true
  } catch (error) {
    console.error('Error saving content file:', error)
    return false
  }
}

export async function GET() {
  const content = getContent()
  if (!content) {
    return NextResponse.json({ error: 'Failed to read content' }, { status: 500 })
  }
  return NextResponse.json(content)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { section, data } = body

    const content = getContent()
    if (!content) {
      return NextResponse.json({ error: 'Failed to read content' }, { status: 500 })
    }

    if (section) {
      content[section] = data
    } else {
      Object.assign(content, data)
    }

    const saved = saveContent(content)
    if (!saved) {
      return NextResponse.json({ error: 'Failed to save content' }, { status: 500 })
    }

    return NextResponse.json({ success: true, content })
  } catch (error) {
    console.error('Error updating content:', error)
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    
    const saved = saveContent(body)
    if (!saved) {
      return NextResponse.json({ error: 'Failed to save content' }, { status: 500 })
    }

    return NextResponse.json({ success: true, content: body })
  } catch (error) {
    console.error('Error replacing content:', error)
    return NextResponse.json({ error: 'Failed to replace content' }, { status: 500 })
  }
}
