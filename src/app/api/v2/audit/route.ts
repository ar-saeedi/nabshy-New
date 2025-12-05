import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db, auditLog } from '@/lib/db'
import { desc } from 'drizzle-orm'

// GET - Fetch audit logs (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!['super_admin', 'admin'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const logs = await db.query.auditLog.findMany({
      orderBy: [desc(auditLog.createdAt)],
      limit,
      offset,
    })

    return NextResponse.json(logs)
  } catch (error) {
    console.error('Error fetching audit logs:', error)
    return NextResponse.json({ error: 'Failed to fetch audit logs' }, { status: 500 })
  }
}
