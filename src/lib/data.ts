import { BASE } from "@/App"

/** One debater's own overview, shown in the collapsed appendix. */
export interface SpeakerOverview {
  id: string
  name: string
  detail: string
  role: string
  team: string
  side: "for" | "against"
  html: string
}

/** One part of the essay: a narrative subhead, its paragraphs, and an optional pull quote taken from them. */
export interface Section {
  heading: string
  html: string
  pullquote: string | null
}

/** One published debate, as written by the /debate skill's publish step. */
export interface Debate {
  slug: string
  title: string
  subject: string
  date: string
  format: string
  motion: string
  ledeHtml: string
  essayHtml: string
  sections: Section[]
  readingMinutes: number
  imageUrl?: string | null
  imageAlt?: string
  speakers: SpeakerOverview[]
}

/** A row of the site index. */
export interface DebateSummary {
  slug: string
  title: string
  subject: string
  date: string
  result: string
  imageUrl?: string | null
}

export async function fetchDebate(slug: string): Promise<Debate> {
  const r = await fetch(`${BASE}data/${slug}.json`, { cache: "no-cache" })
  if (!r.ok) throw new Error(`No debate at ${slug} (${r.status})`)
  return (await r.json()) as Debate
}

export async function fetchIndex(): Promise<DebateSummary[]> {
  const r = await fetch(`${BASE}data/index.json`, { cache: "no-cache" })
  if (!r.ok) throw new Error(`No index (${r.status})`)
  return (await r.json()) as DebateSummary[]
}

/** "17 September 2026" from an ISO timestamp. */
export function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
}

/** URL-safe anchor from a subhead. */
export function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
}
