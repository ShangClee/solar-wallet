import "./worker-polyfills"
import { expose } from "threads"

console.log("[test-worker] Worker script (with threads) is EXECUTING!")
expose({ hello: () => "world" })
self.postMessage("ready")
