import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const PEOPLE_FILE = path.join(__dirname, '../../src/utils/peopleData.json');

// Helper to read people data
async function readPeople() {
  try {
    const data = await fs.readFile(PEOPLE_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, return empty structure
    return { people: [] };
  }
}

// Helper to write people data
async function writePeople(data) {
  await fs.writeFile(PEOPLE_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// Get all people
router.get('/', async (req, res) => {
  try {
    const data = await readPeople();
    res.json(data.people);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single person
router.get('/:id', async (req, res) => {
  try {
    const data = await readPeople();
    const person = data.people.find(p => p.id === req.params.id);
    
    if (!person) {
      return res.status(404).json({ error: 'Person not found' });
    }
    
    res.json(person);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new person
router.post('/', async (req, res) => {
  try {
    const { id, name, IMetThemAt } = req.body;
    
    if (!id || !name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const data = await readPeople();
    
    // Check if person with this ID already exists
    if (data.people.find(p => p.id === id)) {
      return res.status(400).json({ error: 'Person with this ID already exists' });
    }
    
    const newPerson = { id, name, IMetThemAt: IMetThemAt || '' };
    data.people.push(newPerson);
    
    await writePeople(data);
    
    res.json({ success: true, person: newPerson });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update person
router.put('/:id', async (req, res) => {
  try {
    const { name, IMetThemAt } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const data = await readPeople();
    const personIndex = data.people.findIndex(p => p.id === req.params.id);
    
    if (personIndex === -1) {
      return res.status(404).json({ error: 'Person not found' });
    }
    
    data.people[personIndex] = {
      ...data.people[personIndex],
      name,
      IMetThemAt: IMetThemAt || ''
    };
    
    await writePeople(data);
    
    res.json({ success: true, person: data.people[personIndex] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete person
router.delete('/:id', async (req, res) => {
  try {
    const data = await readPeople();
    const personIndex = data.people.findIndex(p => p.id === req.params.id);
    
    if (personIndex === -1) {
      return res.status(404).json({ error: 'Person not found' });
    }
    
    data.people.splice(personIndex, 1);
    
    await writePeople(data);
    
    res.json({ success: true, id: req.params.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

