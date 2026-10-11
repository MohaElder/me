// The photo catalogue in src/content/photos.json, newest first. Shared by the
// Photos page, the Room and the admin.
import { t } from './i18n'

export const categories = ['Nature', 'Street', 'Architecture', 'Other'] as const
export type Category = typeof categories[number]

export interface Photo {
  file: string // in src/images, beside <file>_thumbnail.jpg
  w: number // thumbnail size, so the grid can lay out tiles before they load
  h: number
  date?: number // when it was taken, in Unix seconds
  camera?: string
  category?: Category // unset until confirmed in the admin
  suggestion?: { category: Category, score: number } // the admin's CLIP guess
}

// A series (src/content/series.json): photos by file name, in order; the first
// is the cover. A photo can be in several.
export interface Series {
  id: string // its link: /series/<id>
  title: string
  statement: string
  photos: string[]
}

// The CDN serves the repo from GitHub, so photos only reach it once pushed;
// during development (and in the admin) they load from src/images directly.
const images = import.meta.env.DEV ? '/src/images/' : 'https://cdn.jsdelivr.net/gh/mohaelder/me/src/images/'
export const photoUrl = (p: { file: string }) => images + p.file
export const thumbUrl = (p: { file: string }) => images + p.file + '_thumbnail.jpg'

// Shown under each photo, in the viewer and on the Room's wall label.
export const caption = (p: Photo) => p.category ? t(`message.categories.${p.category}`) : ''

// For image search and screen readers.
export const describe = (p: Photo) =>
  `${p.category && p.category !== 'Other' ? `${p.category} photograph` : 'Photograph'} by Yasushi Oh${p.camera ? `, shot on ${p.camera}` : ''}`
