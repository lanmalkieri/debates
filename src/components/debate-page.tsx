import React, { useEffect, useState } from "react"
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react"
import AuroraBackground from "@/components/ui/aurora-background"
import { cn } from "@/lib/utils"
import { BASE } from "@/App"
import { fetchDebate, formatDate, type Debate } from "@/lib/data"

interface Props {
  slug: string
}

/** One debate: a full-screen aurora hero with the title and lede, the essay, and each speaker's own overview behind a button. */
const DebatePage: React.FC<Props> = ({ slug }) => {
  const [debate, setDebate] = useState<Debate | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showSpeakers, setShowSpeakers] = useState(false)
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    fetchDebate(slug).then(setDebate).catch((e: Error) => setError(e.message))
  }, [slug])

  useEffect(() => {
    if (debate) document.title = debate.title
  }, [debate])

  if (error) {
    return (
      <AuroraBackground className="px-4">
        <p className="text-lg text-gray-300">{error}</p>
        <a href={BASE} className="mt-6 inline-flex items-center gap-2 text-gray-400 hover:text-white">
          <ArrowLeft size={16} /> All debates
        </a>
      </AuroraBackground>
    )
  }
  if (!debate) {
    return <AuroraBackground className="px-4"><p className="text-gray-400">Loading…</p></AuroraBackground>
  }

  return (
    <div className="bg-black text-slate-50">
      <AuroraBackground className="px-4 py-8" starCount={80} pulseDuration={8}
        gradientColors={["var(--aurora-color1, rgba(99,102,241,0.2))", "var(--aurora-color2, rgba(139,92,246,0.2))"]}>
        <div className="flex max-w-4xl flex-col items-center text-center">
          <a href={BASE} className="mb-8 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white">
            <ArrowLeft size={14} /> All debates
          </a>
          {debate.imageUrl && (
            <img
              src={debate.imageUrl}
              alt={debate.imageAlt ?? ""}
              className="mb-8 max-h-[40vh] w-auto max-w-full rounded-2xl shadow-[0_0_80px_-10px_rgba(168,85,247,0.55)]"
            />
          )}
          <p className="mb-4 text-sm tracking-wide text-gray-400">On {debate.subject}</p>
          <h1 className="bg-gradient-to-br from-gray-50 to-gray-400 bg-clip-text text-5xl font-bold tracking-tight text-transparent md:text-7xl">
            {debate.title}
          </h1>
          <div className="lede mt-6 max-w-2xl text-lg text-gray-300 md:text-xl" dangerouslySetInnerHTML={{ __html: debate.ledeHtml }} />
          <a href="#essay" className="mt-10 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white">
            Read <ChevronDown size={16} />
          </a>
        </div>
      </AuroraBackground>

      <main id="essay" className="relative mx-auto max-w-3xl px-6 py-20">
        <article className="essay text-lg leading-relaxed text-gray-300 md:text-xl md:leading-relaxed" dangerouslySetInnerHTML={{ __html: debate.essayHtml }} />

        <footer className="mt-16 border-t border-white/10 pt-6 text-sm text-gray-500">
          Written up from a formal debate held on {formatDate(debate.date)} in the {debate.format} format. The question put to the debate was: {debate.motion}.
        </footer>

        {debate.speakers.length > 0 && (
          <section className="mt-10">
            <button
              type="button"
              onClick={() => setShowSpeakers((v) => !v)}
              aria-expanded={showSpeakers}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2 text-sm text-gray-200 backdrop-blur transition hover:border-purple-400/60 hover:bg-white/10"
            >
              What each speaker argued, in their own words
              {showSpeakers ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {showSpeakers && (
              <div className="mt-6">
                <p className="mb-4 text-sm text-gray-500">
                  The essay above was written from the whole debate. These are the debaters' own overviews of the case each one made, unedited. Pick a speaker.
                </p>
                <div className="flex flex-wrap gap-2">
                  {debate.speakers.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setActive(active === s.id ? null : s.id)}
                      aria-expanded={active === s.id}
                      className={cn(
                        "rounded-full border px-4 py-1.5 text-sm transition",
                        active === s.id
                          ? "border-purple-400/70 bg-purple-500/15 text-white"
                          : "border-white/15 bg-white/5 text-gray-300 hover:border-white/40 hover:text-white",
                      )}
                    >
                      {s.name} <span className="ml-1 text-xs text-gray-500">{s.detail}</span>
                    </button>
                  ))}
                </div>
                {debate.speakers.filter((s) => s.id === active).map((s) => (
                  <div key={s.id} className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                    <p className="mb-3 text-sm text-gray-500">
                      {s.name} spoke as {s.role} for {s.team}, {s.side} the motion.
                    </p>
                    <div className="essay text-base leading-relaxed text-gray-300" dangerouslySetInnerHTML={{ __html: s.html }} />
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  )
}

export default DebatePage
