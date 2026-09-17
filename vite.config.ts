import path from "node:path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

// Served from https://lanmalkieri.github.io/debates/ ; built into docs/ for GitHub Pages.
export default defineConfig({
  base: "/debates/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  build: { outDir: "docs", emptyOutDir: true },
})
