import Database from 'better-sqlite3'
import { hash } from 'bcryptjs'
import path from 'path'
import fs from 'fs'

const dbPath = path.join(process.cwd(), 'data', 'admin.db')
const dbDir = path.dirname(dbPath)

// Ensure directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

const sqlite = new Database(dbPath)

// Enable WAL mode
sqlite.pragma('journal_mode = WAL')

console.log('🚀 Running database migrations...')

// Create tables
sqlite.exec(`
  -- Users table
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('super_admin', 'admin', 'editor')),
    avatar TEXT,
    created_at INTEGER DEFAULT (unixepoch()),
    updated_at INTEGER DEFAULT (unixepoch()),
    last_login INTEGER
  );

  -- Sessions table
  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE,
    expires_at INTEGER NOT NULL,
    created_at INTEGER DEFAULT (unixepoch())
  );

  -- Content table
  CREATE TABLE IF NOT EXISTS content (
    id TEXT PRIMARY KEY,
    key TEXT NOT NULL UNIQUE,
    value TEXT NOT NULL,
    updated_at INTEGER DEFAULT (unixepoch()),
    updated_by TEXT REFERENCES users(id)
  );

  -- Content versions (history)
  CREATE TABLE IF NOT EXISTS content_versions (
    id TEXT PRIMARY KEY,
    content_key TEXT NOT NULL,
    value TEXT NOT NULL,
    version INTEGER NOT NULL,
    created_at INTEGER DEFAULT (unixepoch()),
    created_by TEXT REFERENCES users(id),
    change_description TEXT
  );

  -- Audit log
  CREATE TABLE IF NOT EXISTS audit_log (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id),
    user_email TEXT,
    action TEXT NOT NULL,
    resource TEXT,
    details TEXT,
    ip_address TEXT,
    created_at INTEGER DEFAULT (unixepoch())
  );

  -- File uploads
  CREATE TABLE IF NOT EXISTS uploads (
    id TEXT PRIMARY KEY,
    filename TEXT NOT NULL,
    original_name TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    size INTEGER NOT NULL,
    path TEXT NOT NULL,
    uploaded_by TEXT REFERENCES users(id),
    created_at INTEGER DEFAULT (unixepoch())
  );

  -- Create indexes for better performance
  CREATE INDEX IF NOT EXISTS idx_content_key ON content(key);
  CREATE INDEX IF NOT EXISTS idx_audit_log_user ON audit_log(user_id);
  CREATE INDEX IF NOT EXISTS idx_audit_log_created ON audit_log(created_at);
  CREATE INDEX IF NOT EXISTS idx_content_versions_key ON content_versions(content_key);
`)

console.log('✅ Tables created successfully!')

// Seed default super admin
async function seedAdmin() {
  const existingAdmin = sqlite.prepare('SELECT id FROM users WHERE role = ?').get('super_admin')
  
  if (!existingAdmin) {
    const hashedPassword = await hash('admin123', 12)
    const id = crypto.randomUUID()
    
    sqlite.prepare(`
      INSERT INTO users (id, email, password, name, role, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, 'admin@nabshy.com', hashedPassword, 'Super Admin', 'super_admin', Date.now(), Date.now())
    
    console.log('✅ Default admin created:')
    console.log('   Email: admin@nabshy.com')
    console.log('   Password: admin123')
    console.log('   ⚠️  Change this password after first login!')
  } else {
    console.log('ℹ️  Admin user already exists')
  }
}

// Migrate existing content from JSON file
async function migrateContent() {
  const contentPath = path.join(process.cwd(), 'src', 'data', 'content.json')
  
  if (fs.existsSync(contentPath)) {
    console.log('📦 Migrating content from JSON file...')
    
    const jsonContent = JSON.parse(fs.readFileSync(contentPath, 'utf-8'))
    
    // Store each top-level key as a separate content entry
    const keys = ['homepage', 'projects', 'projectsPage', 'studioPage', 'databasePage', 'contactPage']
    
    for (const key of keys) {
      if (jsonContent[key]) {
        const existingContent = sqlite.prepare('SELECT id FROM content WHERE key = ?').get(key)
        
        if (!existingContent) {
          const id = crypto.randomUUID()
          sqlite.prepare(`
            INSERT INTO content (id, key, value, updated_at)
            VALUES (?, ?, ?, ?)
          `).run(id, key, JSON.stringify(jsonContent[key]), Date.now())
          console.log(`   ✅ Migrated: ${key}`)
        } else {
          console.log(`   ℹ️  Already exists: ${key}`)
        }
      }
    }
    
    console.log('✅ Content migration complete!')
  } else {
    console.log('ℹ️  No existing content.json found')
  }
}

// Run migrations
seedAdmin().then(() => {
  migrateContent().then(() => {
    console.log('\n🎉 Database setup complete!')
    sqlite.close()
  })
})
