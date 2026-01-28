// import "isomorphic-fetch"
import { Buffer } from "buffer"
import { EventSource } from "../Generic/lib/event-source-shim"

// Polyfill Buffer for stellar-sdk
if (typeof globalThis.Buffer === "undefined") {
  globalThis.Buffer = Buffer
}

// Polyfill EventSource for stellar-sdk
if (typeof globalThis.EventSource === "undefined") {
  globalThis.EventSource = EventSource as any
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
