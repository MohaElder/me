/**
 * Migration script - Import existing markdown files into SQLite database
 */
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readdirSync, readFileSync, existsSync } from 'fs';
import { getDatabase, storiesRepo, blogsRepo, peopleRepo } from '../db/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SRC_DIR = join(__dirname, '../../../src');
const STORIES_DIR = join(SRC_DIR, 'stories');
const BLOGS_DIR = join(SRC_DIR, 'blogs');
const PEOPLE_DATA_PATH = join(SRC_DIR, 'utils/peopleData.json');

/**
 * Parse frontmatter from markdown content
 * @param {string} content
 * @returns {{metadata: object, content: string}}
 */
function parseFrontmatter(content) {
  const frontmatterRegex = /^<!--\s*\n([\s\S]*?)\n-->/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return { metadata: {}, content };
  }

  const frontmatterText = match[1];
  const metadata = {};

  frontmatterText.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > -1) {
      const key = line.substring(0, colonIndex).trim();
      const value = line.substring(colonIndex + 1).trim();
      metadata[key] = value;
    }
  });

  const contentWithoutFrontmatter = content.substring(match[0].length).trim();
  return { metadata, content: contentWithoutFrontmatter };
}

/**
 * Migrate stories from markdown files
 */
function migrateStories() {
  console.log('\n📖 Migrating stories...');

  if (!existsSync(STORIES_DIR)) {
    console.log('⚠️  Stories directory not found, skipping stories migration');
    return 0;
  }

  const files = readdirSync(STORIES_DIR).filter(f => f.endsWith('.md'));
  let count = 0;

  for (const file of files) {
    const filePath = join(STORIES_DIR, file);
    const fileContent = readFileSync(filePath, 'utf-8');
    const { metadata, content } = parseFrontmatter(fileContent);

    if (!metadata.id || !metadata.title) {
      console.warn(`⚠️  Skipping ${file}: missing required fields (id or title)`);
      continue;
    }

    const story = {
      id: metadata.id,
      person_id: metadata.person || '',
      title: metadata.title,
      content: content,
      published: metadata.published === 'true' ? 1 : 0
    };

    try {
      storiesRepo.create(story);
      console.log(`  ✓ Migrated story: ${story.title} (${story.id})`);
      count++;
    } catch (error) {
      console.error(`  ✗ Error migrating ${file}:`, error.message);
    }
  }

  console.log(`✅ Migrated ${count} stories`);
  return count;
}

/**
 * Migrate blogs from markdown files
 */
function migrateBlogs() {
  console.log('\n📝 Migrating blogs...');

  if (!existsSync(BLOGS_DIR)) {
    console.log('⚠️  Blogs directory not found, skipping blogs migration');
    return 0;
  }

  const files = readdirSync(BLOGS_DIR).filter(f => f.endsWith('.md'));
  let count = 0;

  for (const file of files) {
    const filePath = join(BLOGS_DIR, file);
    const fileContent = readFileSync(filePath, 'utf-8');
    const { metadata, content } = parseFrontmatter(fileContent);

    if (!metadata.id || !metadata.title) {
      console.warn(`⚠️  Skipping ${file}: missing required fields (id or title)`);
      continue;
    }

    // Map type to color
    const colorMap = {
      'share': '#64b5f6',
      'life': '#ffee58',
      'comment': '#ff8a65'
    };

    const blog = {
      id: metadata.id,
      title: metadata.title,
      content: content,
      date: metadata.date || '',
      color: metadata.color || colorMap[metadata.type] || '',
      brief: metadata.brief || '',
      cover_url: metadata.cover || '',
      cover_caption: metadata['cover-caption'] || '',
      type: metadata.type || '',
      published: metadata.published === 'true' ? 1 : 0
    };

    try {
      blogsRepo.create(blog);
      console.log(`  ✓ Migrated blog: ${blog.title} (${blog.id})`);
      count++;
    } catch (error) {
      console.error(`  ✗ Error migrating ${file}:`, error.message);
    }
  }

  console.log(`✅ Migrated ${count} blogs`);
  return count;
}

/**
 * Migrate people from peopleData.json
 */
function migratePeople() {
  console.log('\n👥 Migrating people...');

  if (!existsSync(PEOPLE_DATA_PATH)) {
    console.log('⚠️  peopleData.json not found, skipping people migration');
    return 0;
  }

  const peopleData = JSON.parse(readFileSync(PEOPLE_DATA_PATH, 'utf-8'));
  let count = 0;

  if (!peopleData.people || !Array.isArray(peopleData.people)) {
    console.warn('⚠️  Invalid peopleData.json format');
    return 0;
  }

  for (const person of peopleData.people) {
    if (!person.id || !person.name) {
      console.warn(`⚠️  Skipping person: missing required fields (id or name)`);
      continue;
    }

    try {
      peopleRepo.create({
        id: person.id,
        name: person.name,
        met_at: person.IMetThemAt || ''
      });
      console.log(`  ✓ Migrated person: ${person.name} (${person.id})`);
      count++;
    } catch (error) {
      console.error(`  ✗ Error migrating ${person.name}:`, error.message);
    }
  }

  console.log(`✅ Migrated ${count} people`);
  return count;
}

/**
 * Main migration function
 */
function runMigration() {
  console.log('\n🚀 Starting migration from markdown files to SQLite...\n');

  try {
    // Initialize database
    const db = getDatabase();
    console.log('✅ Database initialized\n');

    // Run migrations
    const peopleCount = migratePeople();
    const storiesCount = migrateStories();
    const blogsCount = migrateBlogs();

    console.log('\n' + '='.repeat(50));
    console.log('✨ Migration complete!');
    console.log('='.repeat(50));
    console.log(`  People:  ${peopleCount}`);
    console.log(`  Stories: ${storiesCount}`);
    console.log(`  Blogs:   ${blogsCount}`);
    console.log('='.repeat(50) + '\n');

    // Validate foreign key references
    console.log('🔍 Validating data integrity...');
    const stories = storiesRepo.getAll();
    const people = peopleRepo.getAll();
    const peopleIds = new Set(people.map(p => p.id));

    let invalidRefs = 0;
    for (const story of stories) {
      if (story.person_id && !peopleIds.has(story.person_id)) {
        console.warn(`⚠️  Story "${story.title}" references non-existent person: ${story.person_id}`);
        invalidRefs++;
      }
    }

    if (invalidRefs === 0) {
      console.log('✅ All references are valid');
    } else {
      console.warn(`⚠️  Found ${invalidRefs} invalid person references`);
    }

    return true;
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    throw error;
  }
}

// Run migration if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigration();
}

export { runMigration };
