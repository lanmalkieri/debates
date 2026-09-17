import React, { useEffect, useState } from "react"
import { ArrowRight } from "lucide-react"
import AuroraBackground from "@/components/ui/aurora-background"
import { BASE } from "@/App"
import { fetchIndex, formatDate, type DebateSummary } from "@/lib/data"

/** The site index: the aurora fills the page; a hero and one card per published debate scroll over it. */
const IndexPage: React.FC = () => {
  const [items, setItems] = useState<DebateSummary[] | null>(null)

  useEffect(() => {
    document.title = "Debates"
    fetchIndex().then((d) => setItems([...d].sort((a, b) => (a.date < b.date ? 1 : -1)))).catch(() => setItems([]))
  }, [])

  return (
    <AuroraBackground
      fixed
      starCount={90}
      pulseDuration={8}
      gradientColors={["var(--aurora-color1, rgba(99,102,241,0.2))", "var(--aurora-color2, rgba(139,92,246,0.2))"]}
    >
      <section className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-16 text-center">
        <h1 className="bg-gradient-to-br from-gray-50 to-gray-400 bg-clip-text text-5xl font-bold tracking-tight text-transparent md:text-7xl">
          Debates
        </h1>
        <p className="mt-4 max-w-xl text-lg text-gray-300">
          Essays on the big arguments inside books, each one written up from a formal debate.
        </p>
      </section>

      <main className="mx-auto max-w-3xl px-6 pb-24">
        {items === null && <p className="text-gray-500">Loading…</p>}
        {items?.length === 0 && <p className="text-gray-500">Nothing published yet.</p>}
        <ul className="space-y-5">
          {items?.map((d) => (
            <li key={d.slug}>
              <a
                href={`${BASE}${d.slug}/`}
                className="group flex gap-6 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur transition hover:border-purple-400/60 hover:bg-white/10"
              >
                {d.imageUrl && (
                  <img src={d.imageUrl} alt="" className="hidden h-32 w-48 shrink-0 rounded-xl object-cover ring-1 ring-white/10 sm:block" />
                )}
                <div>
                  <p className="text-xs text-gray-500">{formatDate(d.date)} · {d.subject}</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">{d.title}</h2>
                  <p className="mt-2 text-gray-400">{d.result}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm text-gray-400 group-hover:text-white">
                    Read <ArrowRight size={14} />
                  </span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </main>
    </AuroraBackground>
  )
}

export default IndexPage
