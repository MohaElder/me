/**
 * Database schema initialization and management
 */

export const SCHEMA_VERSION = 1;

/**
 * SQL schema for the content database
 */
export const schema = `
-- Stories table
CREATE TABLE IF NOT EXISTS stories (
  id TEXT PRIMARY KEY,
  person_id TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  published INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (person_id) REFERENCES people(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_stories_person ON stories(person_id);
CREATE INDEX IF NOT EXISTS idx_stories_published ON stories(published);

-- Blogs table
CREATE TABLE IF NOT EXISTS blogs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  date TEXT,
  color TEXT,
  brief TEXT,
  cover_url TEXT,
  cover_caption TEXT,
  type TEXT,
  published INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_blogs_published ON blogs(published);
CREATE INDEX IF NOT EXISTS idx_blogs_date ON blogs(date);

-- People table
CREATE TABLE IF NOT EXISTS people (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  met_at TEXT
);

-- Metadata table for schema versioning
CREATE TABLE IF NOT EXISTS metadata (
  key TEXT PRIMARY KEY,
  value TEXT
);

INSERT OR REPLACE INTO metadata (key, value) VALUES ('schema_version', '${SCHEMA_VERSION}');
`;

/**
 * Initialize the database schema
 * @param {import('better-sqlite3').Database} db
 */
export function initializeSchema(db) {
  // Enable foreign keys
  db.pragma('foreign_keys = ON');

  // Execute schema
  db.exec(schema);

  console.log('✅ Database schema initialized');
}

/**
 * Get the current schema version from the database
 * @param {import('better-sqlite3').Database} db
 * @returns {number}
 */
export function getSchemaVersion(db) {
  try {
    const row = db.prepare('SELECT value FROM metadata WHERE key = ?').get('schema_version');
    return row ? parseInt(row.value) : 0;
  } catch (error) {
    return 0;
  }
}
