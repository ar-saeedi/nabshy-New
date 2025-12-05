import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db, users, auditLog } from '@/lib/db'
import { eq, ne } from 'drizzle-orm'
import { hash } from 'bcryptjs'

// GET - List all users (admin only)
export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!['super_admin', 'admin'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const allUsers = await db.query.users.findMany({
      columns: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        createdAt: true,
        lastLogin: true,
      },
    })

    return NextResponse.json(allUsers)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}

// POST - Create new user (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!['super_admin', 'admin'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { email, password, name, role } = body

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Email, password, and name are required' }, { status: 400 })
    }

    // Check if email already exists
    const existing = await db.query.users.findFirst({
      where: eq(users.email, email),
    })

    if (existing) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 })
    }

    // Only super_admin can create other admins
    const userRole = role || 'editor'
    if (userRole !== 'editor' && session.user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Only super admin can create admin users' }, { status: 403 })
    }

    const hashedPassword = await hash(password, 12)

    const [newUser] = await db
      .insert(users)
      .values({
        email,
        password: hashedPassword,
        name,
        role: userRole,
      })
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        createdAt: users.createdAt,
      })

    // Log the action
    await db.insert(auditLog).values({
      userId: session.user.id,
      userEmail: session.user.email,
      action: 'user_create',
      resource: 'users',
      details: JSON.stringify({ newUserEmail: email, role: userRole }),
    })

    return NextResponse.json(newUser, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
  }
}

// PUT - Update user (admin only)
export async function PUT(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, email, name, role, password } = body

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Users can update their own profile, admins can update anyone
    const isOwnProfile = id === session.user.id
    const isAdmin = ['super_admin', 'admin'].includes(session.user.role)

    if (!isOwnProfile && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Only super_admin can change roles
    if (role && session.user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Only super admin can change roles' }, { status: 403 })
    }

    const updates: Record<string, unknown> = { updatedAt: new Date() }
    if (email) updates.email = email
    if (name) updates.name = name
    if (role) updates.role = role
    if (password) updates.password = await hash(password, 12)

    await db.update(users).set(updates).where(eq(users.id, id))

    // Log the action
    await db.insert(auditLog).values({
      userId: session.user.id,
      userEmail: session.user.email,
      action: 'user_update',
      resource: 'users',
      details: JSON.stringify({ targetUserId: id, fields: Object.keys(updates) }),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}

// DELETE - Delete user (super_admin only)
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Only super admin can delete users' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Prevent deleting self
    if (id === session.user.id) {
      return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 })
    }

    // Get user info for audit log
    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    await db.delete(users).where(eq(users.id, id))

    // Log the action
    await db.insert(auditLog).values({
      userId: session.user.id,
      userEmail: session.user.email,
      action: 'user_delete',
      resource: 'users',
      details: JSON.stringify({ deletedUserEmail: user.email }),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
  }
}
