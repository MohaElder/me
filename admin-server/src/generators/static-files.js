/**
 * Static file generator - replaces Python helper
 * Generates storyLink.js, blogLink.js, peopleData.json, and markdown files from SQLite
 */
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { writeFileSync, mkdirSync } from 'fs';
import { storiesRepo, blogsRepo, peopleRepo } from '../db/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Output paths
const SRC_DIR = join(__dirname, '../../../src');
const STORIES_DIR = join(SRC_DIR, 'stories');
const BLOGS_DIR = join(SRC_DIR, 'blogs');
const UTILS_DIR = join(SRC_DIR, 'utils');

// Ensure directories exist
mkdirSync(STORIES_DIR, { recursive: true });
mkdirSync(BLOGS_DIR, { recursive: true });
mkdirSync(UTILS_DIR, { recursive: true });

/**
 * Generate frontmatter from metadata
 * @param {object} metadata
 * @returns {string}
 */
function generateFrontmatter(metadata) {
  let frontmatter = '<!--\n';
  for (const [key, value] of Object.entries(metadata)) {
    if (value !== null && value !== undefined && key !== 'content') {
      frontmatter += `${key}: ${value}\n`;
    }
  }
  frontmatter += '-->\n\n';
  return frontmatter;
}

/**
 * Escape string for JavaScript output
 * @param {string} str
 * @returns {string}
 */
function escapeJs(str) {
  if (!str) return '';
  return str
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
}

/**
 * Generate storyLink.js from database
 */
export function generateStoryLink() {
  console.log('📝 Generating storyLink.js...');

  const stories = storiesRepo.getPublished();

  const storiesObj = {};
  stories.forEach(story => {
    storiesObj[story.id] = {
      person: story.person_id,
      title: story.title,
      article: `https://raw.githubusercontent.com/MohaElder/me/main/src/stories/${story.id}.md`,
      published: 'true'
    };
  });

  const js = `const stories = ${JSON.stringify(storiesObj, null, 20)}
 export { stories };`;

  const outputPath = join(UTILS_DIR, 'storyLink.js');
  writeFileSync(outputPath, js, 'utf-8');
  console.log(`✅ Generated storyLink.js with ${stories.length} stories`);
}

/**
 * Generate blogLink.js from database
 */
export function generateBlogLink() {
  console.log('📝 Generating blogLink.js...');

  const blogs = blogsRepo.getPublished();

  const blogsObj = {};
  blogs.forEach(blog => {
    blogsObj[blog.id] = {
      color: blog.color || '',
      img: blog.cover_url || '',
      title: blog.title,
      brief: blog.brief || '',
      date: blog.date || '',
      img_caption: blog.cover_caption || '',
      article: `https://raw.githubusercontent.com/MohaElder/me/main/src/blogs/${blog.id}.md`
    };
  });

  const js = `const blogs = ${JSON.stringify(blogsObj, null, 20)}
 export { blogs };`;

  const outputPath = join(UTILS_DIR, 'blogLink.js');
  writeFileSync(outputPath, js, 'utf-8');
  console.log(`✅ Generated blogLink.js with ${blogs.length} blogs`);
}

/**
 * Generate peopleData.json from database
 */
export function generatePeopleData() {
  console.log('📝 Generating peopleData.json...');

  const people = peopleRepo.getAll();

  const peopleData = {
    people: people.map(person => ({
      id: person.id,
      name: person.name,
      IMetThemAt: person.met_at || ''
    }))
  };

  const outputPath = join(UTILS_DIR, 'peopleData.json');
  writeFileSync(outputPath, JSON.stringify(peopleData, null, 2), 'utf-8');
  console.log(`✅ Generated peopleData.json with ${people.length} people`);
}

/**
 * Sync story markdown files from database
 */
export function syncStoryMarkdownFiles() {
  console.log('📝 Syncing story markdown files...');

  const stories = storiesRepo.getAll(); // Include unpublished for backup

  stories.forEach(story => {
    const frontmatter = generateFrontmatter({
      id: story.id,
      title: story.title,
      person: story.person_id,
      published: story.published ? 'true' : 'false'
    });

    const markdown = frontmatter + story.content;
    const outputPath = join(STORIES_DIR, `${story.id}.md`);
    writeFileSync(outputPath, markdown, 'utf-8');
  });

  console.log(`✅ Synced ${stories.length} story markdown files`);
}

/**
 * Sync blog markdown files from database
 */
export function syncBlogMarkdownFiles() {
  console.log('📝 Syncing blog markdown files...');

  const blogs = blogsRepo.getAll(); // Include unpublished for backup

  blogs.forEach(blog => {
    const frontmatter = generateFrontmatter({
      id: blog.id,
      title: blog.title,
      date: blog.date,
      color: blog.color,
      brief: blog.brief,
      cover: blog.cover_url,
      'cover-caption': blog.cover_caption,
      type: blog.type,
      published: blog.published ? 'true' : 'false'
    });

    const markdown = frontmatter + blog.content;
    const outputPath = join(BLOGS_DIR, `${blog.id}.md`);
    writeFileSync(outputPath, markdown, 'utf-8');
  });

  console.log(`✅ Synced ${blogs.length} blog markdown files`);
}

/**
 * Generate all static files - main entry point
 */
export function generateAllStaticFiles() {
  console.log('\n🚀 Starting static file generation...\n');

  try {
    generateStoryLink();
    generateBlogLink();
    generatePeopleData();
    syncStoryMarkdownFiles();
    syncBlogMarkdownFiles();

    console.log('\n✨ All static files generated successfully!\n');
    return true;
  } catch (error) {
    console.error('❌ Error generating static files:', error);
    throw error;
  }
}
