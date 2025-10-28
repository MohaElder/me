import express from 'express';
import { storiesRepo } from '../src/db/database.js';
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

// Get all stories
router.get('/', async (req, res) => {
  try {
    const stories = storiesRepo.getAll();
    const formatted = stories.map(story => ({
      id: story.id,
      filename: `${story.id}.md`,
      metadata: {
        id: story.id,
        title: story.title,
        person: story.person_id,
        published: story.published ? 'true' : 'false'
      },
      content: story.content,
      preview: story.content.substring(0, 200),
      title: story.title,
      person: story.person_id,
      published: story.published ? 'true' : 'false'
    }));
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single story
router.get('/:id', async (req, res) => {
  try {
    const story = storiesRepo.getById(req.params.id);

    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    res.json({
      id: story.id,
      metadata: {
        id: story.id,
        title: story.title,
        person: story.person_id,
        published: story.published ? 'true' : 'false'
      },
      content: story.content
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new story
router.post('/', async (req, res) => {
  try {
    const { id, metadata, content } = req.body;

    if (!id || !metadata || content === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!metadata.title || !metadata.person) {
      return res.status(400).json({ error: 'Missing required metadata fields (title, person)' });
    }

    const story = {
      id: id,
      person_id: metadata.person,
      title: metadata.title,
      content: content,
      published: metadata.published === 'true'
    };

    storiesRepo.create(story);

    // Trigger static file generation
    triggerBuild();

    res.status(200).json({ success: true, id });
  } catch (error) {
    console.error('Error creating story:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update story
router.put('/:id', async (req, res) => {
  try {
    const { metadata, content } = req.body;

    if (!metadata || content === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!metadata.title || !metadata.person) {
      return res.status(400).json({ error: 'Missing required metadata fields (title, person)' });
    }

    // Check if story exists
    const existingStory = storiesRepo.getById(req.params.id);
    if (!existingStory) {
      return res.status(404).json({ error: 'Story not found' });
    }

    const updates = {
      person_id: metadata.person,
      title: metadata.title,
      content: content,
      published: metadata.published === 'true'
    };

    storiesRepo.update(req.params.id, updates);

    // Trigger static file generation
    triggerBuild();

    res.json({ success: true, id: req.params.id });
  } catch (error) {
    console.error('Error updating story:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete story
router.delete('/:id', async (req, res) => {
  try {
    storiesRepo.delete(req.params.id);

    // Trigger static file generation
    triggerBuild();

    res.json({ success: true, id: req.params.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
