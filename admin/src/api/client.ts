import axios from 'axios'

const API_BASE_URL = 'http://localhost:3001/api'

export interface Metadata {
  id?: string
  published?: string
  person?: string
  title?: string
  date?: string
  color?: string
  brief?: string
  [key: string]: string | undefined
}

export interface Content {
  id: string
  filename: string
  metadata: Metadata
  content: string
  preview?: string
}

export interface Person {
  id: string
  name: string
  IMetThemAt: string
}

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Stories API
export const storiesApi = {
  getAll: () => client.get<Content[]>('/stories'),
  getOne: (id: string) => client.get<Content>(`/stories/${id}`),
  create: (id: string, metadata: Metadata, content: string) => 
    client.post('/stories', { id, metadata, content }),
  update: (id: string, metadata: Metadata, content: string) => 
    client.put(`/stories/${id}`, { metadata, content }),
  delete: (id: string) => client.delete(`/stories/${id}`)
}

// Blogs API
export const blogsApi = {
  getAll: () => client.get<Content[]>('/blogs'),
  getOne: (id: string) => client.get<Content>(`/blogs/${id}`),
  create: (id: string, metadata: Metadata, content: string) => 
    client.post('/blogs', { id, metadata, content }),
  update: (id: string, metadata: Metadata, content: string) => 
    client.put(`/blogs/${id}`, { metadata, content }),
  delete: (id: string) => client.delete(`/blogs/${id}`)
}

// People API
export const peopleApi = {
  getAll: () => client.get<Person[]>('/people'),
  getOne: (id: string) => client.get<Person>(`/people/${id}`),
  create: (id: string, data: Omit<Person, 'id'>) => 
    client.post('/people', { id, ...data }),
  update: (id: string, data: Omit<Person, 'id'>) => 
    client.put(`/people/${id}`, data),
  delete: (id: string) => client.delete(`/people/${id}`)
}

// Build API
export const buildApi = {
  rebuild: (type: 'all' | 'story' | 'blog' = 'all') => 
    client.post('/build', { type })
}

export default client

