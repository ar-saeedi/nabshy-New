import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db, content, contentVersions, auditLog } from '@/lib/db'
import { eq } from 'drizzle-orm'

// GET - Fetch all content (public for frontend)
export async function GET() {
  try {
    const allContent = await db.query.content.findMany()
    
    // Reconstruct the content object
    const contentObj: Record<string, unknown> = {}
    for (const item of allContent) {
      contentObj[item.key] = JSON.parse(item.value)
    }
    
    return NextResponse.json(contentObj)
  } catch (error) {
    console.error('Error fetching content:', error)
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 })
  }
}

// PUT - Update content (requires authentication)
export async function PUT(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has permission to edit
    if (!['super_admin', 'admin', 'editor'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { key, value, description } = body

    if (!key || value === undefined) {
      return NextResponse.json({ error: 'Key and value are required' }, { status: 400 })
    }

    // Get current content for versioning
    const existing = await db.query.content.findFirst({
      where: eq(content.key, key),
    })

    const valueString = JSON.stringify(value)
    const now = new Date()

    if (existing) {
      // Save current version to history
      const currentVersion = await db.query.contentVersions.findFirst({
        where: eq(contentVersions.contentKey, key),
        orderBy: (versions, { desc }) => [desc(versions.version)],
      })

      const newVersion = (currentVersion?.version || 0) + 1

      await db.insert(contentVersions).values({
        contentKey: key,
        value: existing.value,
        version: newVersion,
        createdBy: session.user.id,
        changeDescription: description || `Updated ${key}`,
      })

      // Update content
      await db
        .update(content)
        .set({
          value: valueString,
          updatedAt: now,
          updatedBy: session.user.id,
        })
        .where(eq(content.key, key))
    } else {
      // Create new content
      await db.insert(content).values({
        key,
        value: valueString,
        updatedAt: now,
        updatedBy: session.user.id,
      })
    }

    // Log the action
    await db.insert(auditLog).values({
      userId: session.user.id,
      userEmail: session.user.email,
      action: 'content_update',
      resource: key,
      details: JSON.stringify({ description: description || `Updated ${key}` }),
    })

    return NextResponse.json({ success: true, key, updatedAt: now })
  } catch (error) {
    console.error('Error updating content:', error)
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 })
  }
}

// POST - Bulk update all content
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!['super_admin', 'admin', 'editor'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const now = new Date()

    // Update each top-level key
    for (const [key, value] of Object.entries(body)) {
      const valueString = JSON.stringify(value)
      
      const existing = await db.query.content.findFirst({
        where: eq(content.key, key),
      })

      if (existing) {
        await db
          .update(content)
          .set({
            value: valueString,
            updatedAt: now,
            updatedBy: session.user.id,
          })
          .where(eq(content.key, key))
      } else {
        await db.insert(content).values({
          key,
          value: valueString,
          updatedAt: now,
          updatedBy: session.user.id,
        })
      }
    }

    // Log the action
    await db.insert(auditLog).values({
      userId: session.user.id,
      userEmail: session.user.email,
      action: 'content_bulk_update',
      resource: 'all',
      details: JSON.stringify({ keys: Object.keys(body) }),
    })

    return NextResponse.json({ success: true, updatedAt: now })
  } catch (error) {
    console.error('Error updating content:', error)
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 })
  }
}
