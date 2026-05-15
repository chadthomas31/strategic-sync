// lib/content.ts
import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'

const CONTENT = path.join(process.cwd(), 'content')

export type Service = {
  slug: string
  name: string
  tagline: string
  description: string
  tags: string[]
  starting: string
  timeline: string
  deliverables: string[]
  buyerProfile: string
}

export type Integration = {
  slug: string
  name: string
  category: string
  useCase: string
  details: string[]
  relatedServices: string[]
}

export type CaseFront = {
  slug: string
  client: string
  industry: string
  date: string
  outcome: string
  metric: string
  metricLabel: string
  stack: string[]
  description: string
}

export type JournalFront = {
  slug: string
  title: string
  date: string
  author: string
  description: string
  readingTime: string
  kicker: string
}

export async function listServices(): Promise<Service[]> {
  const raw = await fs.readFile(path.join(CONTENT, 'services.json'), 'utf-8')
  return JSON.parse(raw)
}

export async function listIntegrations(): Promise<Integration[]> {
  const dir = path.join(CONTENT, 'integrations')
  const files = await fs.readdir(dir)
  const items = await Promise.all(
    files.filter((f) => f.endsWith('.json')).map(async (f) => {
      const raw = await fs.readFile(path.join(dir, f), 'utf-8')
      return JSON.parse(raw) as Integration
    })
  )
  return items.sort((a, b) => a.name.localeCompare(b.name))
}

async function listMdx<T extends { slug: string; date: string }>(subdir: string): Promise<(T & { content: string })[]> {
  const dir = path.join(CONTENT, subdir)
  let files: string[]
  try { files = await fs.readdir(dir) } catch { return [] }
  const items = await Promise.all(
    files.filter((f) => f.endsWith('.mdx')).map(async (f) => {
      const raw = await fs.readFile(path.join(dir, f), 'utf-8')
      const { data, content } = matter(raw)
      return { ...(data as T), slug: data.slug ?? f.replace(/\.mdx$/, ''), content }
    })
  )
  return items.sort((a, b) => (b.date > a.date ? 1 : -1))
}

export const listCases = () => listMdx<CaseFront>('cases')
export const listJournal = () => listMdx<JournalFront>('journal')

export const getCase = async (slug: string) => (await listCases()).find((c) => c.slug === slug)
export const getJournalPost = async (slug: string) => (await listJournal()).find((j) => j.slug === slug)
export const getService = async (slug: string) => (await listServices()).find((s) => s.slug === slug)
export const getIntegration = async (slug: string) => (await listIntegrations()).find((i) => i.slug === slug)
