// The photo catalogue in src/content/photos.json, newest first. Shared by the
// Photos page, the Room and the admin.
import { t } from './i18n'

// IPA's competition categories that fit this work.
export const categories = ['Nature', 'People', 'Architecture', 'Editorial', 'Fine Art', 'Event', 'Sports'] as const
export type Category = typeof categories[number]

export interface Photo {
  file: string // in src/images, beside <file>_thumbnail.jpg
  w: number // thumbnail size, so the grid can lay out tiles before they load
  h: number
  date?: number // when it was taken, in Unix seconds
  camera?: string
  category?: Category // unset until confirmed in the admin
  suggestion?: { category: Category, score: number } // the admin's CLIP guess
  place?: string[] // country first, e.g. ['Thailand', 'Sukhothai']
  film?: boolean
  bw?: boolean
  favorite?: boolean
  mature?: boolean
}

const cdn = 'https://cdn.jsdelivr.net/gh/mohaelder/me/src/images/'
export const photoUrl = (p: Photo) => cdn + p.file
export const thumbUrl = (p: Photo) => cdn + p.file + '_thumbnail.jpg'

// Shown under each photo, in the viewer and on the Room's wall label.
export const caption = (p: Photo) => [p.category && t(`message.categories.${p.category}`), p.place?.at(-1)]
  .filter(Boolean).join(' · ')

// For image search and screen readers.
export const describe = (p: Photo) => [
  p.bw ? 'Black-and-white' : '',
  p.film ? 'film' : '',
  p.category ? p.category.toLowerCase() : '',
  'photograph',
  p.place ? `from ${[...p.place].reverse().join(', ')}` : '',
  'by Yasushi Oh',
].filter(Boolean).join(' ').replace(/^./, c => c.toUpperCase()) + (p.camera ? `, shot on ${p.camera}` : '')
