// Plugins
import vue from '@vitejs/plugin-vue'

// Utilities
import { defineConfig, type Plugin } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'
import { person, pages, siteUrl, titleOf } from './src/seo.ts'
import { prerender } from './scripts/prerender.ts'
import { admin } from './scripts/admin.ts'
import type { Series } from './src/photos.ts'

// A page with its own URL and head: the fixed pages, then one per series.
interface Entry { path: string, name: string, title: string, description: string, image?: string }

const home: Entry = { path: '', name: 'Home', title: titleOf(''), description: pages[''].description }

// Series are read at build time rather than imported, so saving one in the
// admin doesn't restart the dev server.
const entries = (): Entry[] => [
  home,
  ...Object.entries(pages).filter(([path]) => path)
    .map(([path, { title, description }]) => ({ path, name: title, title: titleOf(path), description })),
  ...(JSON.parse(readFileSync('src/content/series.json', 'utf8')) as Series[]).filter(s => s.photos.length)
    .map(s => ({
      path: `series/${s.id}`,
      name: s.title,
      title: `${s.title} · Yasushi Oh`,
      description: s.statement.split('\n')[0] || `${s.title}, a photo series by Yasushi Oh.`,
      image: `https://cdn.jsdelivr.net/gh/mohaelder/me/src/images/${s.photos[0]}`,
    })),
]

const attr = (text: string) => text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

const head = (e: Entry, url: string | null = siteUrl + e.path) => [
  `<title>${attr(e.title)}</title>`,
  `<meta name="description" content="${attr(e.description)}">`,
  ...url ? [`<link rel="canonical" href="${url}">`, `<meta property="og:url" content="${url}">`] : [],
  `<meta property="og:type" content="website">`,
  `<meta property="og:site_name" content="Yasushi Oh">`,
  `<meta property="og:title" content="${attr(e.title)}">`,
  `<meta property="og:description" content="${attr(e.description)}">`,
  `<meta property="og:image" content="${e.image ?? `${siteUrl}og.jpg`}">`,
  `<meta name="twitter:card" content="summary_large_image">`,
].join('\n  ')

const intro = `# Yasushi Oh

> ${person.description}

Also known as ${person.alternateName.join(', ')}. The site is in English and Chinese.`

// Writes <path>.html for every entry (GitHub Pages serves /me/photos from
// photos.html), fills each with its rendered content, and writes a sitemap,
// llms.txt and llms-full.txt. Blog posts and stories share blog.html and
// story.html, which keep the site-wide head without a canonical URL, as their
// content depends on ?id.
const seo = (): Plugin => ({
  name: 'seo',
  transformIndexHtml: html => html.replace('<!-- seo -->',
    `${head(home)}\n  <script type="application/ld+json">${JSON.stringify(person)}</script>`),
  async writeBundle({ dir }) {
    const all = entries()
    const html = readFileSync(`${dir}/index.html`, 'utf8')
    for (const e of all.slice(1)) {
      mkdirSync(dirname(`${dir}/${e.path}`), { recursive: true })
      writeFileSync(`${dir}/${e.path}.html`, html.replace(head(home), head(e)))
    }
    for (const path of ['blog', 'story']) writeFileSync(`${dir}/${path}.html`, html.replace(head(home), head(home, null)))
    writeFileSync(`${dir}/sitemap.xml`, `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${all.map(e => `  <url><loc>${siteUrl + e.path}</loc></url>`).join('\n')}
</urlset>
`)

    // Hi and Photos are mostly pictures, so their text is left out of llms-full.txt.
    const text = await prerender(dir!, all.map(e => e.path))
    const full = all.filter(e => e.path && e.path !== 'photos' && text[e.path])
      .map(e => `## ${e.name}\n\n${siteUrl + e.path}\n\n${text[e.path]}`)
    if (full.length) writeFileSync(`${dir}/llms-full.txt`, `${intro}\n\n${full.join('\n\n')}\n`)
    writeFileSync(`${dir}/llms.txt`, `${intro}

## Pages

${all.map(e => `- [${e.name}](${siteUrl + e.path}): ${e.description}`).join('\n')}

## Elsewhere

${person.sameAs.map(url => `- ${url}`).join('\n')}
${full.length ? `\n## Optional\n\n- [Full text of the pages](${siteUrl}llms-full.txt)\n` : ''}`)
  },
})

// https://vitejs.dev/config/
export default defineConfig({
  base: '/me/',
  plugins: [
    vue(),
    seo(),
    admin(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue',
    ],
  },
  server: {
    port: 3000,
  },
})
