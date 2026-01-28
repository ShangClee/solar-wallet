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
    emptyOutDir: true,
    // Increase chunk size warning limit for workers
    chunkSizeWarningLimit: 1000
  },
  server: {
    port: 3000
  },
  define: {
    // Polyfill process.env for legacy code
    "process.env": {},
    // Polyfill global for legacy code
    global: "globalThis",
    // Polyfill process.browser for legacy code
    "process.browser": true
  },
  worker: {
    format: "es",
    rollupOptions: {
      output: {
        // Ensure workers are properly bundled
        entryFileNames: "assets/[name].js",
        chunkFileNames: "assets/[name].js"
      }
    }
  },
  optimizeDeps: {
    exclude: ["threads"],
    include: ["stellar-sdk", "debug", "observable-fns", "isomorphic-fetch", "is-observable"]
  }
})
