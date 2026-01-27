import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./", // Important for Electron
  resolve: {
    alias: [
      { find: /^~/, replacement: path.join(__dirname, "src/") },
      { find: "shared", replacement: path.join(__dirname, "shared") },
      { find: "eventsource", replacement: path.join(__dirname, "src/Generic/lib/event-source-shim.ts") },
      // Use sodium-javascript instead of sodium-native
      { find: "sodium-native", replacement: "sodium-javascript" }
    ]
  },
  build: {
    outDir: "dist",
    emptyOutDir: true
  },
  server: {
    port: 3000
  },
  define: {
    // Polyfill process.env for legacy code
    "process.env": {},
    // Polyfill global for legacy code
    global: "window",
    // Polyfill process.browser for legacy code
    "process.browser": true
  }
})
