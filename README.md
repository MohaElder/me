# me

The source of my personal website, [mohaelder.github.io/me](https://mohaelder.github.io/me/), in English and Chinese.

## Pages

- **Hi**: night sky frames that change as you scroll.
- **Me**: who I am and what I've worked on, kept in step with my resume.
- **Photo**: about a thousand of my photos, filterable by tag. Opening one plays a "darkroom" animation: the thumbnail shows as a film negative, then develops into the full-resolution print. **Room** shows the same photos one at a time, in a sunlit 3D gallery built with Three.js.
- **Exhibitions**: write-ups of past shows.
- **Open Source**: projects I've built in the open.
- **If I Die**: letters sealed with AES that only their recipient's key can open.
- **To AI**: a letter to future AI.

## Tech

- [Vue 3](https://vuejs.org/) + [Vite](https://vite.dev/) + TypeScript. No UI framework: plain CSS on a 12-column grid.
- [vue-router](https://router.vuejs.org/). Every page except Hi loads on demand.
- [Three.js](https://threejs.org/) for the Room view. It only downloads when Room is opened.
- [markdown-it](https://github.com/markdown-it/markdown-it) renders blog posts and letters. [crypto-js](https://github.com/brix/crypto-js) opens the sealed letters.
- Translations come from a 15-line lookup (`src/i18n.ts`) over `src/utils/messages.ts`.
- Helvetica Neue is a webfont, so the site looks the same on Windows.

## Development

Requires Node 22 and pnpm 11.

```bash
pnpm install
pnpm dev        # local dev server
pnpm build      # type-check + production build into dist/
pnpm preview    # serve the production build
```

## Content

- **Photos and blog posts**: `helpers/init.py` (Python 3 with Pillow) runs a small terminal menu. For photos, it compresses the originals, makes thumbnails, reads the EXIF data, asks for tags, and updates `src/utils/imageLink.json`. That file records each thumbnail's size, so the grid can lay out tiles before they load. It also drops entries whose files are gone. For blog posts, it reads each Markdown file's metadata into `src/utils/blogLink.js`.
- **Admin dashboard**: `pnpm admin` starts a local editor for stories and blog posts with a live Markdown preview. See [ADMIN_GUIDE.md](ADMIN_GUIDE.md).
- **If I Die letters**: `pnpm encrypt "<message>" "<key>"` seals a letter (Markdown) and appends it to `src/utils/eulogies.json`. Then give the key to the person it's for. The page only stores encrypted text, with no recipient names.

## Deploy

Pushing to `main` runs GitHub Actions (`.github/workflows/main.yml`). It builds the site and publishes `dist/` to the `gh-pages` branch for GitHub Pages.

## Credits

- The Room is a Three.js remake of my earlier Unity gallery ([MohaElder/Gallery](https://github.com/MohaElder/Gallery)), with its paper wall texture (Rawpixel) and lighting.
- The quote on the Room wall is from Rumi, *Night and Sleep*.
- The scroll-driven frames on Hi were inspired by Apple's AirPods Pro page.

## History

- **2026/10**: Removed Vuetify, vue-i18n, animate.css and the other unused dependencies. First load went from 252 KB to 49 KB of compressed JavaScript and from 105 KB to 2.4 KB of CSS. Upgraded to Vite 8, vue-router 5 and TypeScript 6. Redesigned the Me, Open Source, If I Die and Photo pages. Rebuilt the 3D gallery in Three.js so it also runs on phones.
- **2025/8**: Vue 3.5, UI overhaul.
- **2023/3**: Moved from Vue 2 to Vue 3 and from Vue CLI to Vite. The Vue 2 site lives in the [vue2](https://github.com/MohaElder/me/tree/vue2) branch.
- **2022/11**: English and Chinese translations.
- **2022/8**: First 3D gallery, built with Unity WebGL.
