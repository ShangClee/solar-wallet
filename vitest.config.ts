import { mergeConfig } from "vite"
import { defineConfig } from "vitest/config"
import viteConfig from "./vite.config"

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: ["./test/setup.ts"],
      include: ["src/**/*.{test,spec}.{ts,tsx}", "electron/**/*.{test,spec}.{ts,tsx}"],
      coverage: {
        provider: "v8",
        reporter: ["text", "json", "html"]
      }
    }
  })
)
