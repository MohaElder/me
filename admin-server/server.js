import express from 'express';
import cors from 'cors';
import chokidar from 'chokidar';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import storiesRouter from './routes/stories.js';
import blogsRouter from './routes/blogs.js';
import peopleRouter from './routes/people.js';
import { rebuildJSON } from './utils/fileManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/stories', storiesRouter);
app.use('/api/blogs', blogsRouter);
app.use('/api/people', peopleRouter);

// Build endpoint
app.post('/api/build', async (req, res) => {
  try {
    const { type = 'all' } = req.body;
    const result = await rebuildJSON(type);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// File watcher for auto-rebuild (optional, can be disabled if too aggressive)
const STORIES_DIR = join(__dirname, '../src/stories');
const BLOGS_DIR = join(__dirname, '../src/blogs');

let rebuildTimeout;
const watcherOptions = {
  ignored: /(^|[\/\\])\../, // ignore dotfiles
  persistent: true,
  ignoreInitial: true
};

const watcher = chokidar.watch([STORIES_DIR, BLOGS_DIR], watcherOptions);

watcher.on('change', (path) => {
  console.log(`File changed: ${path}`);
  
  // Debounce rebuilds
  clearTimeout(rebuildTimeout);
  rebuildTimeout = setTimeout(async () => {
    try {
      console.log('Auto-rebuilding JSON files...');
      await rebuildJSON('all');
      console.log('JSON files rebuilt successfully');
    } catch (error) {
      console.error('Error auto-rebuilding:', error);
    }
  }, 1000);
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Admin Server running on http://localhost:${PORT}`);
  console.log(`📁 Watching for file changes...`);
  console.log(`\nAvailable endpoints:`);
  console.log(`  - GET    /api/stories`);
  console.log(`  - GET    /api/stories/:id`);
  console.log(`  - POST   /api/stories`);
  console.log(`  - PUT    /api/stories/:id`);
  console.log(`  - DELETE /api/stories/:id`);
  console.log(`  - GET    /api/blogs`);
  console.log(`  - GET    /api/blogs/:id`);
  console.log(`  - POST   /api/blogs`);
  console.log(`  - PUT    /api/blogs/:id`);
  console.log(`  - DELETE /api/blogs/:id`);
  console.log(`  - POST   /api/build`);
  console.log(`  - GET    /api/health\n`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server...');
  watcher.close();
  process.exit(0);
});

