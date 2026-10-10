import { reactive, ref, watch } from 'vue'
import type { Photo } from '../photos'

export interface Person { id: string, name: string, metAt: string }
export interface Story { id: string, person: string, title: string, published: boolean }
export interface Post {
  id: string
  title: string
  date: string
  brief: string
  color: string
  cover: string
  coverCaption: string
  published: boolean
}

// Everything the admin edits, as in src/content/*.json. Each collection is
// written back shortly after it changes.
export const content = reactive({ photos: [] as Photo[], people: [] as Person[], stories: [] as Story[], blogs: [] as Post[] })
export const status = ref('All changes are saved to src/')

const saved = (ok: boolean, path: string) =>
  (status.value = ok ? `Saved to ${path} at ${new Date().toLocaleTimeString([], { timeStyle: 'short' })}` : `Couldn't save ${path}`)

const timers: Record<string, number> = {}
const save = (name: keyof typeof content) => {
  clearTimeout(timers[name])
  timers[name] = window.setTimeout(async () => {
    // Photo flags are only written when set.
    const body = JSON.stringify(content[name], (_, v) => name === 'photos' && v === false ? undefined : v)
    const res = await fetch(`/__admin/content/${name}`, { method: 'PUT', body })
    saved(res.ok, `src/content/${name}.json`)
  }, 400)
}

export async function load() {
  Object.assign(content, await (await fetch('/__admin/content')).json())
  for (const name of Object.keys(content) as (keyof typeof content)[]) {
    watch(() => content[name], () => save(name), { deep: true })
  }
}

// Story and blog bodies, in src/stories and src/blogs.
export type Kind = 'stories' | 'blogs'
export const article = {
  read: (kind: Kind, id: string) => fetch(`/__admin/body/${kind}/${id}`).then(r => r.text()),
  write: async (kind: Kind, id: string, text: string) =>
    saved((await fetch(`/__admin/body/${kind}/${id}`, { method: 'PUT', body: text })).ok, `src/${kind}/${id}.md`),
  remove: (kind: Kind, id: string) => fetch(`/__admin/body/${kind}/${id}`, { method: 'DELETE' }),
}

export const newId = () => Date.now().toString(36)
