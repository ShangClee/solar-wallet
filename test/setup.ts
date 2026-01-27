import "@testing-library/jest-dom"
import { vi } from "vitest"

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }))
})

// Mock global variables often needed by stellar-sdk or electron
if (typeof global.TextEncoder === "undefined") {
  const { TextEncoder, TextDecoder } = require("util")
  global.TextEncoder = TextEncoder
  global.TextDecoder = TextDecoder
}
