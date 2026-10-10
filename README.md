# me

The source of my personal website, [mohaelder.github.io/me](https://mohaelder.github.io/me/), in English and Chinese.

## Tech

Vue 3, Vite and TypeScript with plain CSS, no UI framework. Three.js renders the 3D gallery.

## Development

Requires Node 22 and pnpm 11.

```bash
pnpm install
pnpm dev        # local dev server
pnpm build      # type-check + production build into dist/
pnpm preview    # serve the production build
```

The build saves each page's rendered HTML for crawlers using headless Chrome or Playwright's Chromium. If it finds neither, it skips that step. Point `CHROME_PATH` at a Chromium binary to use another browser.

## Deploy

Pushing to `main` builds the site with GitHub Actions and publishes it to GitHub Pages.

## Credits

- The Room is a Three.js remake of my earlier Unity gallery ([MohaElder/Gallery](https://github.com/MohaElder/Gallery)), with its paper wall texture (Rawpixel) and lighting.
- The quote on the Room wall is from Rumi, *Night and Sleep*.
- The scroll-driven frames on Hi were inspired by Apple's AirPods Pro page.

## License

The code is licensed under the [GNU GPL v3](LICENSE) or later. My photos, writing and other personal content (images, blog posts, stories, letters and resumes) are not covered: they are © Yasushi Oh, and photos may be used under the terms on the Photo page.

## History

### 2022

- **Jan 12**: Repository created.
- **Mar 4**: First Vue site (Vue 2, Vue CLI, Vuetify): Hi, Work, Photos. A Python script (`helpers/init.py`) acts as the backend for photos and posts.
- **Mar 9**: Hi page gets its scroll-driven frame animation.
- **Mar 17**: Blog.
- **Apr 2**: If I Die, a page of last words.
- **Apr 16**: Recipe page.
- **Apr 18**: If I Die letters sealed with AES.
- **Jul 19**: Gallery mode: a 3D photo gallery built in Unity, running in WebGL.
- **Jul 25**: Images move to a CDN.
- **Aug 28**: Open Source page.
- **Nov 7**: English and Chinese translations with vue-i18n, plus a Chinese resume.
- **Nov 30**: Photo tag filters and sorting.

### 2023

- **Jan 28**: Photo thumbnails, which fixed loading on phones.
- **Mar 4**: Vue 2 → Vue 3, Vue CLI → Vite, Vuetify 2 → Vuetify 3, Markdown through markdown-it. Work page becomes **Me**. The Vue 2 site lives in the [vue2](https://github.com/MohaElder/me/tree/vue2) branch.
- **Oct 18**: New font, links open in new tabs, better blog typography.
- **Dec 25**: Photos page rework (masonry layout, download dialog, grid/gallery switch), new sky frames on Hi.

### 2024

- **Jan 19**: Switched to pnpm.
- **Nov 3**: Frosted-glass top bar and footer.
- **Dec 10**: Exhibition write-up for *Nothing to Lose*.

### 2025

- **Mar 11**: Exhibition write-up for *Land Embodied*.
- **Jul 11**: UI overhaul with an OLED-friendly black look, Exhibitions page.
- **Aug 20**: Vue 3.5, performance pass, more TypeScript.
- **Oct 27**: Stories and Interesting People pages, managed from a local admin dashboard backed by SQLite.

### 2026

- **Oct 8**: The big cleanup.
  - Removed Vuetify, vue-i18n, animate.css and other unused packages. First-load JavaScript went from 252 KB to 49 KB compressed, and CSS from 105 KB to 2.4 KB.
  - Upgraded to Vite 8, vue-router 5, TypeScript 6 and pnpm 11. Every page except Hi now loads on demand.
  - Redesigned Me, Open Source, If I Die and Photos. Photos gets a darkroom viewer that develops each print from a negative.
  - Rebuilt the 3D gallery in Three.js as Room, which also works on phones.
  - Added a letter to future AI.
