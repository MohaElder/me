# Admin Dashboard Quick Start

## What is this?

A local web-based content management system for editing stories and blogs. It provides a beautiful markdown editor with live preview, making it much easier to create and edit content compared to the Python CLI script.

## Quick Start

1. **Install dependencies** (first time only):
```bash
cd admin-server && pnpm install && cd ..
cd admin && pnpm install && cd ..
pnpm install
```

2. **Start the admin dashboard**:
```bash
pnpm admin
```

This will start:
- Backend API server on `http://localhost:3001`
- Admin dashboard on `http://localhost:5173`

3. **Open your browser** and go to `http://localhost:5173`

## Features

### Dashboard
- View all stories and blogs in grid layout
- See published status at a glance
- Quick access to edit or delete content
- Create new content with one click

### Editor
- **Split-pane interface**: Metadata form on left, editor/preview on right
- **Live markdown preview**: See formatted content as you type
- **Syntax highlighting**: Code blocks with proper highlighting
- **Auto-save**: Drafts saved to localStorage
- **Metadata management**: Easy forms for all metadata fields

### Stories
Required fields:
- ID (filename, cannot be changed after creation)
- Title
- Person (who the story is about)
- Content

Optional:
- Published status (toggle)

### Blogs
Required fields:
- ID (filename, cannot be changed after creation)
- Title
- Content

Optional:
- Date
- Color (hex code)
- Brief (short description)
- Published status (toggle)

## Workflow

1. **Create**: Click "New Story" or "New Blog"
2. **Fill metadata**: ID, title, and other required fields
3. **Write content**: Use markdown in the editor
4. **Preview**: See live preview on the right
5. **Save**: Click "Create" or "Save"
6. **Auto-build**: JSON files are automatically rebuilt
7. **Commit**: Add and commit your changes to git
8. **Deploy**: Push to GitHub to trigger deployment

## Important Notes

- **Local only**: Admin never gets deployed, only runs locally
- **Direct file editing**: Changes write directly to markdown files
- **Python still works**: The Python helper script still works in parallel
- **Auto-rebuild**: JSON files (storyLink.js, blogLink.js) auto-update on save
- **File watching**: Server watches for file changes and rebuilds automatically

## Troubleshooting

### Port already in use
If you get "port already in use" errors:
```bash
# Kill process on port 3001 (backend)
lsof -ti:3001 | xargs kill -9

# Kill process on port 5173 (frontend)
lsof -ti:5173 | xargs kill -9
```

### Backend not connecting
Make sure the backend server started successfully. Check the terminal for errors.

### JSON not rebuilding
The backend calls the Python script to rebuild JSON files. Make sure:
- Python 3 is installed
- Pillow is installed (`pip3 install Pillow`)
- helpers/init.py exists and is executable

### Fresh start
```bash
# Stop all servers (Ctrl+C)
# Delete node_modules if needed
rm -rf admin/node_modules admin-server/node_modules
# Reinstall
cd admin-server && pnpm install && cd ..
cd admin && pnpm install && cd ..
```

## Architecture

```
┌─────────────────────────────────────────────────┐
│  Browser (localhost:5173)                       │
│  Vue 3 Admin Dashboard                          │
└─────────────────┬───────────────────────────────┘
                  │ HTTP/REST
┌─────────────────▼───────────────────────────────┐
│  Backend (localhost:3001)                       │
│  Node.js/Express API                            │
└─────────────────┬───────────────────────────────┘
                  │ File System
┌─────────────────▼───────────────────────────────┐
│  Markdown Files                                 │
│  src/stories/*.md                               │
│  src/blogs/*.md                                 │
└─────────────────┬───────────────────────────────┘
                  │ Python Script
┌─────────────────▼───────────────────────────────┐
│  Generated JSON                                 │
│  src/utils/storyLink.js                         │
│  src/utils/blogLink.js                          │
└─────────────────┬───────────────────────────────┘
                  │ Import
┌─────────────────▼───────────────────────────────┐
│  Main Site (Static)                             │
│  Deployed on GitHub Pages                       │
└─────────────────────────────────────────────────┘
```

## Tips

- Use keyboard shortcuts in the editor (varies by browser)
- Markdown files are the source of truth
- Preview shows how it will look on the main site
- ID becomes the filename, choose wisely
- Published=false means draft (won't appear on main site)

