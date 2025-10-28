import express from 'express';
import { blogsRepo } from '../src/db/database.js';
import { generateAllStaticFiles } from '../src/generators/static-files.js';

const router = express.Router();

/**
 * Helper to trigger static file generation
 */
function triggerBuild() {
  // Generate files asynchronously, don't block response
  setImmediate(() => {
    try {
      generateAllStaticFiles();
    } catch (err) {
      console.error('Error generating static files:', err);
    }
  });
}

// Get all blogs
router.get('/', async (req, res) => {
  try {
    const blogs = blogsRepo.getAll();
    const formatted = blogs.map(blog => ({
      id: blog.id,
      filename: `${blog.id}.md`,
      metadata: {
        id: blog.id,
        title: blog.title,
        date: blog.date,
        color: blog.color,
        brief: blog.brief,
        cover: blog.cover_url,
        'cover-caption': blog.cover_caption,
        type: blog.type,
        published: blog.published ? 'true' : 'false'
      },
      content: blog.content,
      preview: blog.content.substring(0, 200),
      title: blog.title,
      date: blog.date,
      brief: blog.brief,
      published: blog.published ? 'true' : 'false'
    }));
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single blog
router.get('/:id', async (req, res) => {
  try {
    const blog = blogsRepo.getById(req.params.id);

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    res.json({
      id: blog.id,
      metadata: {
        id: blog.id,
        title: blog.title,
        date: blog.date,
        color: blog.color,
        brief: blog.brief,
        cover: blog.cover_url,
        'cover-caption': blog.cover_caption,
        type: blog.type,
        published: blog.published ? 'true' : 'false'
      },
      content: blog.content
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new blog
router.post('/', async (req, res) => {
  try {
    const { id, metadata, content } = req.body;

    if (!id || !metadata || content === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!metadata.title) {
      return res.status(400).json({ error: 'Missing required metadata field: title' });
    }

    const blog = {
      id: id,
      title: metadata.title,
      content: content,
      date: metadata.date || '',
      color: metadata.color || '',
      brief: metadata.brief || '',
      cover_url: metadata.cover || '',
      cover_caption: metadata['cover-caption'] || '',
      type: metadata.type || '',
      published: metadata.published === 'true'
    };

    blogsRepo.create(blog);

    // Trigger static file generation
    triggerBuild();

    res.status(200).json({ success: true, id });
  } catch (error) {
    console.error('Error creating blog:', error);
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

    if (!metadata.title) {
      return res.status(400).json({ error: 'Missing required metadata field: title' });
    }

    // Check if blog exists
    const existingBlog = blogsRepo.getById(req.params.id);
    if (!existingBlog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    const updates = {
      title: metadata.title,
      content: content,
      date: metadata.date || '',
      color: metadata.color || '',
      brief: metadata.brief || '',
      cover_url: metadata.cover || '',
      cover_caption: metadata['cover-caption'] || '',
      type: metadata.type || '',
      published: metadata.published === 'true'
    };

    blogsRepo.update(req.params.id, updates);

    // Trigger static file generation
    triggerBuild();

    res.json({ success: true, id: req.params.id });
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete blog
router.delete('/:id', async (req, res) => {
  try {
    blogsRepo.delete(req.params.id);

    // Trigger static file generation
    triggerBuild();

    res.json({ success: true, id: req.params.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
