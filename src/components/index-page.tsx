import React, { useEffect, useState } from "react"
import { ArrowRight } from "lucide-react"
import AuroraBackground from "@/components/ui/aurora-background"
import { BASE } from "@/App"
import { fetchIndex, formatDate, type DebateSummary } from "@/lib/data"

/** The site index: an aurora hero and one card per published debate. */
const IndexPage: React.FC = () => {
  const [items, setItems] = useState<DebateSummary[] | null>(null)

  useEffect(() => {
    document.title = "Debates"
    fetchIndex().then((d) => setItems([...d].sort((a, b) => (a.date < b.date ? 1 : -1)))).catch(() => setItems([]))
  }, [])

  return (
    <div className="bg-black text-slate-50">
      <AuroraBackground className="px-4 py-8" starCount={80} pulseDuration={8}
        gradientColors={["var(--aurora-color1, rgba(99,102,241,0.2))", "var(--aurora-color2, rgba(139,92,246,0.2))"]}>
        <div className="flex max-w-3xl flex-col items-center text-center">
          <h1 className="bg-gradient-to-br from-gray-50 to-gray-400 bg-clip-text text-5xl font-bold tracking-tight text-transparent md:text-7xl">
            Debates
          </h1>
          <p className="mt-4 max-w-xl text-lg text-gray-300">
            Essays on the big arguments inside books, each one written up from a formal debate.
          </p>
        </div>
      </AuroraBackground>

      <main className="mx-auto max-w-3xl px-6 py-16">
        {items === null && <p className="text-gray-500">Loading…</p>}
        {items?.length === 0 && <p className="text-gray-500">Nothing published yet.</p>}
        <ul className="space-y-4">
          {items?.map((d) => (
            <li key={d.slug}>
              <a
                href={`${BASE}${d.slug}/`}
                className="group block rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:border-purple-400/60 hover:bg-white/10"
              >
                <p className="text-xs text-gray-500">{formatDate(d.date)} · {d.subject}</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">{d.title}</h2>
                <p className="mt-2 text-gray-400">{d.result}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm text-gray-400 group-hover:text-white">
                  Read <ArrowRight size={14} />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </main>
    </div>
  )
}

export default IndexPage
