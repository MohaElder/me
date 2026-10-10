import { readFileSync, writeFileSync } from 'node:fs'
import { chromium } from 'playwright-core'
import { preview } from 'vite'

// Opens each page of the built site in headless Chromium and saves what Vue
// renders into the page's HTML file, along with the page's own stylesheets, so
// crawlers that don't run JavaScript (most AI assistants) can read it. Vue
// replaces it on load. Returns the visible text of each page's <main>.
//
// Uses Playwright's Chromium, or Google Chrome (as on GitHub's runners), or the
// browser at CHROME_PATH. With none of them, pages keep their empty <body>.
export async function prerender(dir: string, keys: string[]) {
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH })
    .catch(() => chromium.launch({ channel: 'chrome' }))
    .catch(() => null)
  if (!browser) {
    console.warn('prerender: no Chromium found, skipped')
    return {}
  }
  const server = await preview({ configFile: false, base: '/me/', build: { outDir: dir }, logLevel: 'silent' })
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  const text: Record<string, string> = {}
  try {
    for (const key of keys) {
      try {
        await page.goto(server.resolvedUrls!.local[0] + key, { waitUntil: 'networkidle', timeout: 60000 })
        const { app, css, main } = await page.evaluate(() => ({
          app: document.getElementById('app')!.innerHTML,
          css: [...document.querySelectorAll('link[rel="stylesheet"][href*="/assets/"]')].map(link => link.getAttribute('href')!),
          main: document.querySelector('main')?.innerText ?? '',
        }))
        const file = `${dir}/${key || 'index'}.html`
        const html = readFileSync(file, 'utf8')
        const links = css.filter(href => !html.includes(href)).map(href => `<link rel="stylesheet" href="${href}">\n`).join('')
        writeFileSync(file, html
          .replace('</head>', () => links + '</head>')
          .replace('<div id="app"></div>', () => `<div id="app">${app}</div>`))
        text[key] = main.trim()
      } catch (error) {
        console.warn(`prerender: /${key} failed, kept its empty <body>`, error)
      }
    }
  } finally {
    await browser.close()
    server.httpServer.close()
  }
  return text
}
