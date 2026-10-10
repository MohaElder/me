import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs'
import type { IncomingMessage, ServerResponse } from 'node:http'
import exifr from 'exifr'
import sharp from 'sharp'
import type { Plugin } from 'vite'
import type { Photo } from '../src/photos.ts'

// The API behind admin.html, served by `pnpm dev` only. It reads and writes the
// site's own files: src/content/*.json, src/stories and src/blogs (Markdown),
// and src/images. Nothing here ships; commit the changes to publish them.

const COLLECTIONS = ['photos', 'people', 'stories', 'blogs']
const ARTICLES = ['stories', 'blogs']
const SAFE_ID = /^[\w-]+$/

const readBody = (req: IncomingMessage) => new Promise<Buffer>((resolve, reject) => {
  const chunks: Buffer[] = []
  req.on('data', chunk => chunks.push(chunk))
  req.on('end', () => resolve(Buffer.concat(chunks)))
  req.on('error', reject)
})

const send = (res: ServerResponse, status: number, data: unknown) => {
  res.statusCode = status
  res.setHeader('Content-Type', typeof data === 'string' ? 'text/plain; charset=utf-8' : 'application/json')
  res.end(typeof data === 'string' ? data : JSON.stringify(data))
}

const collection = (name: string) => JSON.parse(readFileSync(`src/content/${name}.json`, 'utf8'))

// Saves a full-size copy (long edge 4096px, metadata stripped) and a 512px
// thumbnail, and returns the catalogue entry, with the date and camera from
// EXIF. No camera usually means a film scan; black and white is measured.
async function importPhoto(name: string, bytes: Buffer): Promise<Photo> {
  const stem = name.replace(/\.[^.]+$/, '').replace(/[^\w-]+/g, '_')
  let file = `${stem}.jpg`
  for (let n = 2; existsSync(`src/images/${file}`); n++) file = `${stem}-${n}.jpg`

  const exif = await exifr.parse(bytes, ['DateTimeOriginal', 'Make', 'Model']).catch(() => undefined)
  const image = sharp(bytes).rotate()
  await image.clone().resize(4096, 4096, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true }).toFile(`src/images/${file}`)
  const thumb = await image.clone().resize(512, 512, { fit: 'inside' })
    .jpeg({ quality: 80 }).toFile(`src/images/${file}_thumbnail.jpg`)
  const { data } = await image.clone().resize(64, 64, { fit: 'inside' }).removeAlpha().raw().toBuffer({ resolveWithObject: true })
  let spread = 0
  for (let i = 0; i < data.length; i += 3) spread += Math.max(data[i], data[i + 1], data[i + 2]) - Math.min(data[i], data[i + 1], data[i + 2])

  const camera = [exif?.Make, exif?.Model].filter(Boolean).join(' ')
  return {
    file,
    w: thumb.width,
    h: thumb.height,
    ...exif?.DateTimeOriginal && { date: Math.round(exif.DateTimeOriginal.getTime() / 1000) },
    ...camera ? { camera } : { film: true },
    ...spread / (data.length / 3) < 8 && { bw: true },
  }
}

export const admin = (): Plugin => ({
  name: 'admin',
  apply: 'serve',
  configureServer(server) {
    server.middlewares.use('/__admin', async (req, res) => {
      const url = new URL(req.url!, 'http://localhost')
      const [, first, kind, id] = url.pathname.split('/')
      try {
        if (first === 'content' && req.method === 'GET') {
          return send(res, 200, Object.fromEntries(COLLECTIONS.map(name => [name, collection(name)])))
        }
        if (first === 'content' && req.method === 'PUT' && COLLECTIONS.includes(kind)) {
          const data = JSON.parse((await readBody(req)).toString())
          writeFileSync(`src/content/${kind}.json`, JSON.stringify(data, null, 1) + '\n')
          return send(res, 200, {})
        }
        if (first === 'body' && ARTICLES.includes(kind) && SAFE_ID.test(id)) {
          const path = `src/${kind}/${id}.md`
          if (req.method === 'GET') return send(res, 200, existsSync(path) ? readFileSync(path, 'utf8') : '')
          if (req.method === 'PUT') {
            writeFileSync(path, (await readBody(req)).toString())
            return send(res, 200, {})
          }
          if (req.method === 'DELETE') {
            if (existsSync(path)) unlinkSync(path)
            return send(res, 200, {})
          }
        }
        if (first === 'photos' && req.method === 'POST') {
          return send(res, 200, await importPhoto(url.searchParams.get('name') ?? 'photo', await readBody(req)))
        }
        // Streams progress as JSON lines, then the suggestions.
        if (first === 'suggest' && req.method === 'POST') {
          const { files } = JSON.parse((await readBody(req)).toString())
          const { suggest } = await import('./clip.ts') // the ML runtime loads only when asked
          res.setHeader('Content-Type', 'application/x-ndjson')
          const line = (data: unknown) => res.write(JSON.stringify(data) + '\n')
          line({ suggestions: await suggest(collection('photos'), files, (done, total) => line({ done, total })) })
          return res.end()
        }
        send(res, 404, 'Not found')
      } catch (error) {
        server.config.logger.error(`admin: ${(error as Error).stack}`)
        if (!res.headersSent) send(res, 500, (error as Error).message)
        else res.end()
      }
    })
  },
})
