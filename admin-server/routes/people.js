import express from 'express';
import { peopleRepo } from '../src/db/database.js';
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

// Get all people
router.get('/', async (req, res) => {
  try {
    const people = peopleRepo.getAll();
    const formatted = people.map(person => ({
      id: person.id,
      name: person.name,
      IMetThemAt: person.met_at
    }));
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single person
router.get('/:id', async (req, res) => {
  try {
    const person = peopleRepo.getById(req.params.id);

    if (!person) {
      return res.status(404).json({ error: 'Person not found' });
    }

    res.json({
      id: person.id,
      name: person.name,
      IMetThemAt: person.met_at
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new person
router.post('/', async (req, res) => {
  try {
    const { id, name, IMetThemAt } = req.body;

    if (!id || !name) {
      return res.status(400).json({ error: 'Missing required fields (id, name)' });
    }

    const newPerson = {
      id: id,
      name: name,
      met_at: IMetThemAt || ''
    };

    peopleRepo.create(newPerson);

    // Trigger static file generation
    triggerBuild();

    res.json({ success: true, person: { id, name, IMetThemAt: IMetThemAt || '' } });
  } catch (error) {
    // Check if it's a unique constraint error
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ error: 'Person with this ID already exists' });
    }
    res.status(500).json({ error: error.message });
  }
});

// Update person
router.put('/:id', async (req, res) => {
  try {
    const { name, IMetThemAt } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Missing required field: name' });
    }

    const updates = {
      name: name,
      met_at: IMetThemAt || ''
    };

    peopleRepo.update(req.params.id, updates);

    // Trigger static file generation
    triggerBuild();

    res.json({ success: true, person: { id: req.params.id, name, IMetThemAt: IMetThemAt || '' } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete person
router.delete('/:id', async (req, res) => {
  try {
    peopleRepo.delete(req.params.id);

    // Trigger static file generation
    triggerBuild();

    res.json({ success: true, id: req.params.id });
  } catch (error) {
    // Check if it's a foreign key constraint error
    if (error.message.includes('FOREIGN KEY constraint failed')) {
      return res.status(400).json({
        error: 'Cannot delete person: they have associated stories. Delete the stories first.'
      });
    }
    res.status(500).json({ error: error.message });
  }
});

export default router;
