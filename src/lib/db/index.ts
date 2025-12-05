import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import * as schema from './schema'
import path from 'path'

// Database file location - in project root for local, can be changed for production
const dbPath = process.env.DATABASE_URL || path.join(process.cwd(), 'data', 'admin.db')

// Ensure the directory exists
import fs from 'fs'
const dbDir = path.dirname(dbPath)
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

// Create SQLite connection
const sqlite = new Database(dbPath)

// Enable WAL mode for better concurrent access
sqlite.pragma('journal_mode = WAL')

// Create Drizzle instance with schema
export const db = drizzle(sqlite, { schema })

// Export schema for use in other files
export * from './schema'
