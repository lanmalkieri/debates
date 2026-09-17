import React from "react"
import DebatePage from "@/components/debate-page"
import IndexPage from "@/components/index-page"

/** Base path the site is served from (matches vite.config.ts `base`). */
export const BASE = "/debates/"

/** The debate slug from the URL, or null on the index. GitHub Pages serves a copy of index.html at /debates/<slug>/. */
function slugFromPath(): string | null {
  const rest = window.location.pathname.startsWith(BASE)
    ? window.location.pathname.slice(BASE.length)
    : window.location.pathname.replace(/^\//, "")
  const first = rest.split("/").filter(Boolean)[0]
  if (!first || first === "index.html" || first === "data" || first === "assets") return null
  return first
}

const App: React.FC = () => {
  const slug = slugFromPath()
  return slug ? <DebatePage slug={slug} /> : <IndexPage />
}

export default App
