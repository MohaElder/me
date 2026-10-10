// Plugins
import vue from '@vitejs/plugin-vue'

// Utilities
import { defineConfig, type Plugin } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import { readFileSync, writeFileSync } from 'node:fs'
import { person, pages, siteUrl, titleOf } from './src/seo.ts'
import { prerender } from './scripts/prerender.ts'

const head = (key: string, url: string | null = siteUrl + key) => [
  `<title>${titleOf(key)}</title>`,
  `<meta name="description" content="${pages[key].description}">`,
  ...url ? [`<link rel="canonical" href="${url}">`, `<meta property="og:url" content="${url}">`] : [],
  `<meta property="og:type" content="website">`,
  `<meta property="og:site_name" content="Yasushi Oh">`,
  `<meta property="og:title" content="${titleOf(key)}">`,
  `<meta property="og:description" content="${pages[key].description}">`,
  `<meta property="og:image" content="${siteUrl}og.jpg">`,
  `<meta name="twitter:card" content="summary_large_image">`,
].join('\n  ')

// The pages llms.txt lists, as Markdown links.
const pageList = () => Object.entries(pages)
  .map(([key, { title, description }]) => `- [${key ? title : 'Home'}](${siteUrl + key}): ${description}`).join('\n')

const intro = `# Yasushi Oh

> ${person.description}

Also known as ${person.alternateName.join(', ')}. The site is in English and Chinese.`

// Writes <page>.html for every page (GitHub Pages serves /me/photos from
// photos.html), fills each with its rendered content, and writes a sitemap,
// llms.txt and llms-full.txt. Blog posts and stories share blog.html and
// story.html, which keep the site-wide head without a canonical URL, as their
// content depends on ?id.
const seo = (): Plugin => ({
  name: 'seo',
  transformIndexHtml: html => html.replace('<!-- seo -->',
    `${head('')}\n  <script type="application/ld+json">${JSON.stringify(person)}</script>`),
  async writeBundle({ dir }) {
    const html = readFileSync(`${dir}/index.html`, 'utf8')
    for (const key of Object.keys(pages).filter(Boolean)) {
      writeFileSync(`${dir}/${key}.html`, html.replace(head(''), head(key)))
    }
    for (const key of ['blog', 'story']) writeFileSync(`${dir}/${key}.html`, html.replace(head(''), head('', null)))
    writeFileSync(`${dir}/sitemap.xml`, `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${Object.keys(pages).map(key => `  <url><loc>${siteUrl + key}</loc></url>`).join('\n')}
</urlset>
`)

    // Hi and Photos are mostly pictures, so their text is left out of llms-full.txt.
    const text = await prerender(dir!, Object.keys(pages))
    const full = Object.entries(text).filter(([key, body]) => key && key !== 'photos' && body)
      .map(([key, body]) => `## ${pages[key].title}\n\n${siteUrl + key}\n\n${body}`)
    if (full.length) writeFileSync(`${dir}/llms-full.txt`, `${intro}\n\n${full.join('\n\n')}\n`)
    writeFileSync(`${dir}/llms.txt`, `${intro}

## Pages

${pageList()}

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
