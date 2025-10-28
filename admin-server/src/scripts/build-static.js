/**
 * Build static files script - manually generate all static files from database
 */
import { generateAllStaticFiles } from '../generators/static-files.js';
import { getDatabase } from '../db/database.js';

try {
  // Initialize database connection
  getDatabase();

  // Generate all static files
  generateAllStaticFiles();

  console.log('✅ Build complete!');
  process.exit(0);
} catch (error) {
  console.error('❌ Build failed:', error);
  process.exit(1);
}
