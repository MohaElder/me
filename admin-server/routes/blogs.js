import express from 'express';
import { getFiles, readFile, writeFile, deleteFile, dirs, rebuildJSON } from '../utils/fileManager.js';
import path from 'path';

const router = express.Router();

// Get all blogs
router.get('/', async (req, res) => {
  try {
    const files = await getFiles(dirs.blogs);
    const blogs = await Promise.all(
      files.map(async (filename) => {
        const file = await readFile(dirs.blogs, filename);
        const filenameWithoutExt = path.parse(filename).name;
        return {
          ...file.metadata,
          id: filenameWithoutExt, // Use filename as ID for routing
          filename,
          metadataId: file.metadata.id, // Keep the hash ID separate
          preview: file.content.substring(0, 200)
        };
      })
    );
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single blog
router.get('/:id', async (req, res) => {
  try {
    const filename = `${req.params.id}.md`;
    const file = await readFile(dirs.blogs, filename);
    res.json({
      id: req.params.id,
      filename,
      metadata: file.metadata,
      content: file.content
    });
  } catch (error) {
    res.status(404).json({ error: 'Blog not found' });
  }
});

// Create new blog
router.post('/', async (req, res) => {
  try {
    const { id, metadata, content } = req.body;
    
    if (!id || !metadata || content === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const filename = `${id}.md`;
    await writeFile(dirs.blogs, filename, metadata, content);
    
    // Rebuild JSON asynchronously (don't wait)
    rebuildJSON('blog').catch(err => console.error('Error rebuilding JSON:', err));
    
    res.json({ success: true, id, filename });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update blog
router.put('/:id', async (req, res) => {
  try {
    const { metadata, content } = req.body;
    
    if (!metadata || content === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const filename = `${req.params.id}.md`;
    await writeFile(dirs.blogs, filename, metadata, content);
    
    // Rebuild JSON asynchronously (don't wait)
    rebuildJSON('blog').catch(err => console.error('Error rebuilding JSON:', err));
    
    res.json({ success: true, id: req.params.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete blog
router.delete('/:id', async (req, res) => {
  try {
    const filename = `${req.params.id}.md`;
    await deleteFile(dirs.blogs, filename);
    
    // Rebuild JSON asynchronously (don't wait)
    rebuildJSON('blog').catch(err => console.error('Error rebuilding JSON:', err));
    
    res.json({ success: true, id: req.params.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

