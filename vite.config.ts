// Plugins
import vue from '@vitejs/plugin-vue'

// Utilities
import { defineConfig, type Plugin } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import { readFileSync, writeFileSync } from 'node:fs'
import { pages, siteUrl, titleOf } from './src/seo'

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

// Writes <page>.html for every page (GitHub Pages serves /me/photos from
// photos.html) and a sitemap. Blog posts and stories share blog.html and
// story.html, which keep the site-wide head without a canonical URL, as their
// content depends on ?id.
const seo = (): Plugin => ({
  name: 'seo',
  transformIndexHtml: html => html.replace('<!-- seo -->', head('')),
  writeBundle({ dir }) {
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
