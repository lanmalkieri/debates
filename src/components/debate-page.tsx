import React, { useEffect, useState } from "react"
import { motion, useScroll, useSpring } from "framer-motion"
import { ArrowLeft, ChevronDown, ChevronUp, Clock } from "lucide-react"
import AuroraBackground from "@/components/ui/aurora-background"
import { cn } from "@/lib/utils"
import { BASE } from "@/App"
import { fetchDebate, formatDate, slugify, type Debate } from "@/lib/data"

interface Props {
  slug: string
}

/** Thin reading-progress line pinned to the top of the viewport. */
const Progress: React.FC = () => {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 })
  return <motion.div style={{ scaleX }} className="fixed left-0 top-0 z-50 h-0.5 w-full origin-left bg-gradient-to-r from-purple-400 to-fuchsia-400" />
}

/** One debate: the aurora fills the whole page; the hero, the sectioned essay and the speakers' overviews scroll over it. */
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

  const aurora = {
    starCount: 90,
    pulseDuration: 8,
    gradientColors: ["var(--aurora-color1, rgba(99,102,241,0.2))", "var(--aurora-color2, rgba(139,92,246,0.2))"] as [string, string],
  }

  if (error) {
    return (
      <AuroraBackground {...aurora} className="justify-center px-4">
        <div className="text-center">
          <p className="text-lg text-gray-300">{error}</p>
          <a href={BASE} className="mt-6 inline-flex items-center gap-2 text-gray-400 hover:text-white"><ArrowLeft size={16} /> All debates</a>
        </div>
      </AuroraBackground>
    )
  }
  if (!debate) {
    return <AuroraBackground {...aurora} className="justify-center px-4"><p className="text-center text-gray-400">Loading…</p></AuroraBackground>
  }

  const sections = debate.sections?.length ? debate.sections : [{ heading: "", html: debate.essayHtml, pullquote: null }]
  const toc = sections.filter((s) => s.heading)

  return (
    <AuroraBackground {...aurora} fixed>
      <Progress />

      {/* Hero */}
      <section className="flex min-h-screen flex-col items-center justify-center px-6 py-16 text-center">
        <a href={BASE} className="mb-10 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white">
          <ArrowLeft size={14} /> All debates
        </a>
        {debate.imageUrl && (
          <motion.img
            src={debate.imageUrl}
            alt={debate.imageAlt ?? ""}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="mb-10 max-h-[46vh] w-auto max-w-full rounded-2xl shadow-[0_0_120px_-20px_rgba(168,85,247,0.7)] ring-1 ring-white/10"
          />
        )}
        <p className="mb-4 text-sm tracking-wide text-gray-400">On {debate.subject}</p>
        <h1 className="max-w-4xl bg-gradient-to-br from-gray-50 to-gray-400 bg-clip-text text-5xl font-bold tracking-tight text-transparent md:text-7xl">
          {debate.title}
        </h1>
        <div className="lede mt-7 max-w-2xl text-lg text-gray-300 md:text-xl" dangerouslySetInnerHTML={{ __html: debate.ledeHtml }} />
        <p className="mt-6 inline-flex items-center gap-2 text-sm text-gray-500"><Clock size={14} /> {debate.readingMinutes} min read</p>
        {toc.length > 0 && (
          <nav className="mt-10 flex max-w-3xl flex-wrap justify-center gap-2">
            {toc.map((s, i) => (
              <a key={s.heading} href={`#${slugify(s.heading)}`}
                 className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-gray-300 backdrop-blur transition hover:border-purple-400/60 hover:text-white">
                <span className="mr-2 text-gray-500">{i + 1}</span>{s.heading}
              </a>
            ))}
          </nav>
        )}
        <a href={`#${toc[0] ? slugify(toc[0].heading) : "essay"}`} className="mt-12 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white">
          Read <ChevronDown size={16} />
        </a>
      </section>

      {/* Essay */}
      <main id="essay" className="mx-auto max-w-3xl px-6 pb-24">
        {sections.map((s, i) => (
          <motion.section
            key={i}
            id={s.heading ? slugify(s.heading) : undefined}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="scroll-mt-16 pt-16"
          >
            {s.heading && (
              <h2 className="mb-6 text-3xl font-semibold tracking-tight text-white md:text-4xl">
                <span className="mr-3 text-base font-normal text-purple-300/80">{i + 1}</span>{s.heading}
              </h2>
            )}
            {s.pullquote && (
              <blockquote className="pull my-8 border-l-2 border-purple-400/70 pl-6 text-2xl leading-snug text-gray-100 md:text-3xl">
                {s.pullquote}
              </blockquote>
            )}
            <div className="essay text-lg leading-8 text-gray-200 md:text-[1.2rem] md:leading-9" dangerouslySetInnerHTML={{ __html: s.html }} />
          </motion.section>
        ))}

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
    </AuroraBackground>
  )
}

export default DebatePage
