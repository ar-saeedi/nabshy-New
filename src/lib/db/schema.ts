import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

// Users table - for admin authentication
export const users = sqliteTable('users', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  name: text('name').notNull(),
  role: text('role', { enum: ['super_admin', 'admin', 'editor'] }).notNull().default('editor'),
  avatar: text('avatar'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  lastLogin: integer('last_login', { mode: 'timestamp' }),
})

// Sessions table - for NextAuth
export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

// Content table - stores all website content as key-value pairs
export const content = sqliteTable('content', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  key: text('key').notNull().unique(), // e.g., 'homepage', 'projects', 'studioPage'
  value: text('value').notNull(), // JSON stringified content
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedBy: text('updated_by').references(() => users.id),
})

// Content versions - for undo/history
export const contentVersions = sqliteTable('content_versions', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  contentKey: text('content_key').notNull(),
  value: text('value').notNull(),
  version: integer('version').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  createdBy: text('created_by').references(() => users.id),
  changeDescription: text('change_description'),
})

// Audit log - tracks all admin actions
export const auditLog = sqliteTable('audit_log', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').references(() => users.id),
  userEmail: text('user_email'),
  action: text('action').notNull(), // 'login', 'logout', 'content_update', 'user_create', etc.
  resource: text('resource'), // 'homepage', 'projects', 'users', etc.
  details: text('details'), // JSON with additional info
  ipAddress: text('ip_address'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

// File uploads tracking
export const uploads = sqliteTable('uploads', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  filename: text('filename').notNull(),
  originalName: text('original_name').notNull(),
  mimeType: text('mime_type').notNull(),
  size: integer('size').notNull(),
  path: text('path').notNull(),
  uploadedBy: text('uploaded_by').references(() => users.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

// Types for TypeScript
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Session = typeof sessions.$inferSelect
export type Content = typeof content.$inferSelect
export type AuditLog = typeof auditLog.$inferSelect
export type Upload = typeof uploads.$inferSelect
