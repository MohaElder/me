/**
 * Database connection and management
 */
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { initializeSchema } from './schema.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Database file path - in project root
const DB_PATH = join(__dirname, '../../../content.db');

let dbInstance = null;

/**
 * Get or create the database instance
 * @returns {Database.Database}
 */
export function getDatabase() {
  if (!dbInstance) {
    dbInstance = new Database(DB_PATH);
    dbInstance.pragma('journal_mode = WAL'); // Better performance for concurrent access
    initializeSchema(dbInstance);
    console.log(`📦 Database connected: ${DB_PATH}`);
  }
  return dbInstance;
}

/**
 * Close the database connection
 */
export function closeDatabase() {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
    console.log('🔒 Database connection closed');
  }
}

/**
 * Stories repository
 */
export const storiesRepo = {
  /**
   * Get all stories
   * @returns {Array}
   */
  getAll() {
    const db = getDatabase();
    return db.prepare('SELECT * FROM stories ORDER BY created_at DESC').all();
  },

  /**
   * Get a story by ID
   * @param {string} id
   * @returns {object|undefined}
   */
  getById(id) {
    const db = getDatabase();
    return db.prepare('SELECT * FROM stories WHERE id = ?').get(id);
  },

  /**
   * Create a new story
   * @param {object} story
   */
  create(story) {
    const db = getDatabase();
    const stmt = db.prepare(`
      INSERT INTO stories (id, person_id, title, content, published)
      VALUES (?, ?, ?, ?, ?)
    `);
    stmt.run(story.id, story.person_id, story.title, story.content, story.published ? 1 : 0);
  },

  /**
   * Update a story
   * @param {string} id
   * @param {object} updates
   */
  update(id, updates) {
    const db = getDatabase();
    const stmt = db.prepare(`
      UPDATE stories
      SET person_id = ?, title = ?, content = ?, published = ?, updated_at = datetime('now')
      WHERE id = ?
    `);
    stmt.run(updates.person_id, updates.title, updates.content, updates.published ? 1 : 0, id);
  },

  /**
   * Delete a story
   * @param {string} id
   */
  delete(id) {
    const db = getDatabase();
    const stmt = db.prepare('DELETE FROM stories WHERE id = ?');
    stmt.run(id);
  },

  /**
   * Get all published stories
   * @returns {Array}
   */
  getPublished() {
    const db = getDatabase();
    return db.prepare('SELECT * FROM stories WHERE published = 1 ORDER BY created_at DESC').all();
  }
};

/**
 * Blogs repository
 */
export const blogsRepo = {
  /**
   * Get all blogs
   * @returns {Array}
   */
  getAll() {
    const db = getDatabase();
    return db.prepare('SELECT * FROM blogs ORDER BY date DESC').all();
  },

  /**
   * Get a blog by ID
   * @param {string} id
   * @returns {object|undefined}
   */
  getById(id) {
    const db = getDatabase();
    return db.prepare('SELECT * FROM blogs WHERE id = ?').get(id);
  },

  /**
   * Create a new blog
   * @param {object} blog
   */
  create(blog) {
    const db = getDatabase();
    const stmt = db.prepare(`
      INSERT INTO blogs (id, title, content, date, color, brief, cover_url, cover_caption, type, published)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      blog.id,
      blog.title,
      blog.content,
      blog.date,
      blog.color,
      blog.brief,
      blog.cover_url,
      blog.cover_caption,
      blog.type,
      blog.published ? 1 : 0
    );
  },

  /**
   * Update a blog
   * @param {string} id
   * @param {object} updates
   */
  update(id, updates) {
    const db = getDatabase();
    const stmt = db.prepare(`
      UPDATE blogs
      SET title = ?, content = ?, date = ?, color = ?, brief = ?, cover_url = ?, cover_caption = ?, type = ?, published = ?, updated_at = datetime('now')
      WHERE id = ?
    `);
    stmt.run(
      updates.title,
      updates.content,
      updates.date,
      updates.color,
      updates.brief,
      updates.cover_url,
      updates.cover_caption,
      updates.type,
      updates.published ? 1 : 0,
      id
    );
  },

  /**
   * Delete a blog
   * @param {string} id
   */
  delete(id) {
    const db = getDatabase();
    const stmt = db.prepare('DELETE FROM blogs WHERE id = ?');
    stmt.run(id);
  },

  /**
   * Get all published blogs
   * @returns {Array}
   */
  getPublished() {
    const db = getDatabase();
    return db.prepare('SELECT * FROM blogs WHERE published = 1 ORDER BY date DESC').all();
  }
};

/**
 * People repository
 */
export const peopleRepo = {
  /**
   * Get all people
   * @returns {Array}
   */
  getAll() {
    const db = getDatabase();
    return db.prepare('SELECT * FROM people ORDER BY name').all();
  },

  /**
   * Get a person by ID
   * @param {string} id
   * @returns {object|undefined}
   */
  getById(id) {
    const db = getDatabase();
    return db.prepare('SELECT * FROM people WHERE id = ?').get(id);
  },

  /**
   * Create a new person
   * @param {object} person
   */
  create(person) {
    const db = getDatabase();
    const stmt = db.prepare(`
      INSERT INTO people (id, name, met_at)
      VALUES (?, ?, ?)
    `);
    stmt.run(person.id, person.name, person.met_at);
  },

  /**
   * Update a person
   * @param {string} id
   * @param {object} updates
   */
  update(id, updates) {
    const db = getDatabase();
    const stmt = db.prepare(`
      UPDATE people
      SET name = ?, met_at = ?
      WHERE id = ?
    `);
    stmt.run(updates.name, updates.met_at, id);
  },

  /**
   * Delete a person
   * @param {string} id
   */
  delete(id) {
    const db = getDatabase();
    const stmt = db.prepare('DELETE FROM people WHERE id = ?');
    stmt.run(id);
  }
};
