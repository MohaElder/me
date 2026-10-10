import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { AutoProcessor, CLIPVisionModelWithProjection, RawImage } from '@huggingface/transformers'
import type { Category, Photo } from '../src/photos.ts'

// Suggests categories for the admin with CLIP, locally. Each photo becomes an
// embedding (cached, since computing them is the slow part); a photo's
// suggestion is the vote of the confirmed photos that look most like it, so it
// follows the choices already made rather than CLIP's idea of the words.

const MODEL = 'Xenova/clip-vit-base-patch32' // downloaded once, about 90 MB at q8
const CACHE = 'node_modules/.cache/clip-embeddings.json'
const NEIGHBOURS = 15

let model: Promise<[CLIPVisionModelWithProjection, AutoProcessor]> | undefined

const embed = async (file: string) => {
  model ??= Promise.all([
    CLIPVisionModelWithProjection.from_pretrained(MODEL, { dtype: 'q8' }),
    AutoProcessor.from_pretrained(MODEL),
  ])
  const [vision, processor] = await model
  const { image_embeds } = await vision(await processor(await RawImage.read(`src/images/${file}_thumbnail.jpg`)))
  const v = image_embeds.data as Float32Array
  const length = Math.hypot(...v)
  return Array.from(v, x => Math.round(x / length * 1e4) / 1e4)
}

const dot = (a: number[], b: number[]) => a.reduce((sum, x, i) => sum + x * b[i], 0)

export async function suggest(photos: Photo[], targets: string[], progress: (done: number, total: number) => void) {
  const cache: Record<string, number[]> = existsSync(CACHE) ? JSON.parse(readFileSync(CACHE, 'utf8')) : {}
  const known = photos.filter(p => p.category)
  const missing = [...new Set([...known.map(p => p.file), ...targets])].filter(file => !cache[file])
  for (const [i, file] of missing.entries()) {
    cache[file] = await embed(file).catch(() => [])
    progress(i + 1, missing.length)
  }
  mkdirSync('node_modules/.cache', { recursive: true })
  writeFileSync(CACHE, JSON.stringify(cache))

  const result: Record<string, { category: Category, score: number }> = {}
  for (const file of targets) {
    if (!cache[file]?.length) continue
    const near = known.filter(p => p.file !== file && cache[p.file]?.length)
      .map(p => ({ category: p.category!, similarity: dot(cache[file], cache[p.file]) }))
      .sort((a, b) => b.similarity - a.similarity).slice(0, NEIGHBOURS)
    const votes = new Map<Category, number>()
    near.forEach(n => votes.set(n.category, (votes.get(n.category) ?? 0) + n.similarity))
    const total = [...votes.values()].reduce((a, b) => a + b, 0)
    const [category, weight] = [...votes].sort((a, b) => b[1] - a[1])[0] ?? []
    if (category) result[file] = { category, score: Math.round(weight / total * 100) / 100 }
  }
  return result
}
