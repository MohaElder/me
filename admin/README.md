# Content Admin Dashboard

A local Vue 3 admin dashboard for managing stories and blogs.

## Features

- 📝 Split-pane markdown editor with live preview
- 🎨 Syntax highlighting for code blocks
- 💾 Auto-save drafts to localStorage
- 🔄 Auto-rebuild JSON files on save
- 🎯 Metadata management (person, title, published status, etc.)
- 🗂️ Browse and edit all stories and blogs

## Development

### Prerequisites

- Node.js 18+ and pnpm
- Python 3.x with Pillow installed

### Setup

1. Install backend dependencies:
```bash
cd admin-server
pnpm install
```

2. Install frontend dependencies:
```bash
cd admin
pnpm install
```

### Running the Admin

From the root directory:

```bash
pnpm admin
```

This will start:
- Backend server on `http://localhost:3001`
- Frontend admin on `http://localhost:5173`

Or run them separately:

```bash
# Backend only
pnpm admin:server

# Frontend only
pnpm admin:client
```

## Usage

1. **Dashboard**: View all stories and blogs, see their published status
2. **Create**: Click "New Story" or "New Blog" to create content
3. **Edit**: Click on any card to edit existing content
4. **Delete**: Use the delete button on cards (with confirmation)
5. **Publish**: Toggle the "Published" checkbox in the metadata form

## Architecture

- **Frontend**: Vue 3 with Composition API, Vite, TypeScript
- **Backend**: Node.js/Express with file system operations
- **Storage**: Markdown files in `src/stories/` and `src/blogs/`
- **Build**: Python helper script generates JSON files for main site

## Important Notes

- Admin runs **locally only**, never deployed
- Changes are written directly to markdown files
- JSON files are auto-rebuilt after saves
- Main site remains purely static
- Python helper script still works in parallel



