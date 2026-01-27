// @ts-ignore
const globalScope = typeof window !== "undefined" ? window : typeof self !== "undefined" ? self : globalThis

class MockEventSource {
  static CONNECTING = 0
  static OPEN = 1
  static CLOSED = 2
}

export const EventSource = globalScope.EventSource || MockEventSource
export default globalScope.EventSource || MockEventSource
