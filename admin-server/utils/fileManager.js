import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STORIES_DIR = path.join(__dirname, '../../src/stories');
const BLOGS_DIR = path.join(__dirname, '../../src/blogs');
const HELPERS_DIR = path.join(__dirname, '../../helpers');

// Parse markdown frontmatter
export function parseFrontmatter(content) {
  const frontmatterRegex = /^<!--\s*\n([\s\S]*?)\n-->/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return { metadata: {}, content: content };
  }
  
  const frontmatterText = match[1];
  const metadata = {};
  
  frontmatterText.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length > 0) {
      const value = valueParts.join(':').trim();
      metadata[key.trim()] = value;
    }
  });
  
  const contentWithoutFrontmatter = content.replace(frontmatterRegex, '').trim();
  
  return { metadata, content: contentWithoutFrontmatter };
}

// Generate frontmatter string
export function generateFrontmatter(metadata) {
  // Always ensure 'id' field is first (even if empty)
  const metadataWithId = { id: '', ...metadata };

  const lines = Object.entries(metadataWithId)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');

  return `<!--\n${lines}\n-->`;
}

// Get all files from a directory
export async function getFiles(directory) {
  try {
    const files = await fs.readdir(directory);
    return files.filter(file => file.endsWith('.md'));
  } catch (error) {
    console.error(`Error reading directory ${directory}:`, error);
    return [];
  }
}

// Read file with metadata
export async function readFile(directory, filename) {
  try {
    const filepath = path.join(directory, filename);
    const content = await fs.readFile(filepath, 'utf-8');
    const { metadata, content: body } = parseFrontmatter(content);
    
    return {
      filename,
      metadata,
      content: body,
      fullContent: content
    };
  } catch (error) {
    console.error(`Error reading file ${filename}:`, error);
    throw error;
  }
}

// Write file with metadata
export async function writeFile(directory, filename, metadata, content) {
  try {
    const filepath = path.join(directory, filename);
    const frontmatter = generateFrontmatter(metadata);
    const fullContent = `${frontmatter}\n\n${content}`;
    
    await fs.writeFile(filepath, fullContent, 'utf-8');
    return true;
  } catch (error) {
    console.error(`Error writing file ${filename}:`, error);
    throw error;
  }
}

// Delete file
export async function deleteFile(directory, filename) {
  try {
    const filepath = path.join(directory, filename);
    await fs.unlink(filepath);
    return true;
  } catch (error) {
    console.error(`Error deleting file ${filename}:`, error);
    throw error;
  }
}

// Run Python helper script to rebuild JSON
export async function rebuildJSON(type = 'all') {
  try {
    const command = type === 'story' 
      ? `cd ${HELPERS_DIR} && echo "story" | python3 init.py`
      : type === 'blog'
      ? `cd ${HELPERS_DIR} && echo "blog" | python3 init.py`
      : `cd ${HELPERS_DIR} && echo "all" | python3 init.py`;
    
    // For non-interactive execution, we'll need to handle this differently
    // Let's create a simpler approach
    const { stdout, stderr } = await execAsync(
      `cd ${HELPERS_DIR} && python3 -c "from init import updateStoryLink, updateBlogLink; updateStoryLink('../src/stories'); updateBlogLink('../src/blogs')"`
    );
    
    if (stderr && !stderr.includes('Warning')) {
      console.error('Python script error:', stderr);
    }
    
    return { success: true, output: stdout };
  } catch (error) {
    console.error('Error rebuilding JSON:', error);
    throw error;
  }
}

export const dirs = {
  stories: STORIES_DIR,
  blogs: BLOGS_DIR
};



