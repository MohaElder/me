import { messages } from './utils/messages.ts'

// Title and description of each page, keyed by its path under /me/. The build
// writes one HTML file per page with these in its <head>, so GitHub Pages serves
// every page with a 200 instead of through 404.html, and lists them in a
// sitemap. The router keeps the tab title in step while browsing.
export const siteUrl = 'https://mohaelder.github.io/me/'

const name = '翁安志 · おやすし · Yasushi Oh'

export const pages: Record<string, { title: string, description: string }> = {
  '': { title: name, description: 'Yasushi Oh (翁安志) is a software engineer and photographer, building what filmmakers want at Flick (YC F25).' },
  work: { title: 'Me', description: "Yasushi Oh's experience, awards and resume: Flick (YC F25), Norra (YC F25), the UN Office for Project Services, NVIDIA and UC San Diego." },
  photos: { title: 'Photos', description: 'About a thousand photographs by Yasushi Oh, on film and digital, with a 3D gallery to walk through them.' },
  art: { title: 'Exhibitions', description: 'Press materials from past and online exhibitions: Land Embodied, Nothing to Lose and Alcoholic Lab.' },
  'land-embodied': { title: 'Land Embodied', description: 'Land Embodied, an exhibition presented by SME Gallery.' },
  'nothing-to-lose': { title: 'Nothing to Lose', description: 'Nothing to Lose, an exhibition presented by Commons Gallery.' },
  Recipe: { title: 'Alcoholic Lab', description: 'Notes on drinks I developed for fun or found interesting.' },
  opensource: { title: 'Open Source', description: "Open source keeps the internet fair and open. Here's what Yasushi Oh has built in the open." },
  final_words: { title: 'If I Die', description: 'My last words, for now. Sealed until the day comes. If I gave you a key, it opens yours.' },
  'letter-to-future-ai': { title: 'Letter to Future AI', description: 'An open letter to our future machine overlords, on why Yasushi Oh should not be killed.' },
  'interesting-people': { title: 'Interesting People', description: "People I've met along the way who left an impression." },
  blogs: { title: 'Blog', description: 'Writing by Yasushi Oh: share, life, comments.' },
}

// Who the site is about, as schema.org data for search engines and AI assistants.
export const person = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Yasushi Oh',
  alternateName: ['翁安志', 'おやすし', 'Anzhi Weng'],
  description: pages[''].description,
  url: siteUrl,
  image: siteUrl + 'og.jpg',
  jobTitle: 'Software Engineer',
  worksFor: { '@type': 'Organization', name: 'Flick', url: 'https://flick.art' },
  alumniOf: { '@type': 'CollegeOrUniversity', name: 'UC San Diego', url: 'https://ucsd.edu/' },
  knowsAbout: ['Software engineering', 'Photography', 'Film photography'],
  award: Object.values(messages.en.message.awards),
  sameAs: ['https://github.com/MohaElder', 'https://linkedin.com/in/mohaelder', 'https://medium.com/@calen0909'],
}

export const titleOf =(key: string) => key in pages && key ? `${pages[key].title} · Yasushi Oh` : name
