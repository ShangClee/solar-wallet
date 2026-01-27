import "core-js/es6"
import { Buffer } from "buffer"

// Polyfill Buffer for stellar-sdk
if (typeof globalThis.Buffer === "undefined") {
  globalThis.Buffer = Buffer
}

// Polyfill process for libraries that expect it
if (typeof globalThis.process === "undefined") {
  globalThis.process = {
    env: {},
    version: "",
    nextTick: (cb: Function) => setTimeout(cb, 0),
    browser: true
  } as any
}
