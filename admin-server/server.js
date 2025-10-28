import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import storiesRouter from './routes/stories.js';
import blogsRouter from './routes/blogs.js';
import peopleRouter from './routes/people.js';
import { getDatabase, closeDatabase } from './src/db/database.js';
import { generateAllStaticFiles } from './src/generators/static-files.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3001;

// Initialize database on startup
try {
  const db = getDatabase();
  console.log('✅ Database initialized successfully');
} catch (error) {
  console.error('❌ Failed to initialize database:', error);
  process.exit(1);
}

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

// Build endpoint - manually trigger static file generation
app.post('/api/build', async (req, res) => {
  try {
    console.log('📝 Manual build triggered...');
    await generateAllStaticFiles();
    res.json({ success: true, message: 'Static files generated successfully' });
  } catch (error) {
    console.error('❌ Build failed:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Admin Server running on http://localhost:${PORT}`);
  console.log(`📦 SQLite database: content.db`);
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
  console.log(`  - GET    /api/people`);
  console.log(`  - GET    /api/people/:id`);
  console.log(`  - POST   /api/people`);
  console.log(`  - PUT    /api/people/:id`);
  console.log(`  - DELETE /api/people/:id`);
  console.log(`  - POST   /api/build`);
  console.log(`  - GET    /api/health\n`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server...');
  closeDatabase();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\nSIGINT received, closing server...');
  closeDatabase();
  process.exit(0);
});
