// import "threads/register"
import { wrap, Remote } from "comlink"
// import { CustomErrorSerializer } from "../Generic/lib/errors"
import { NetWorker as NetWorkerInterface } from "./net-worker"

const WORKER_TIMEOUT_MS = 15000

function withTimeout<T>(p: Promise<T>, ms: number, message: string): Promise<T> {
  return Promise.race([p, new Promise<never>((_, reject) => setTimeout(() => reject(new Error(message)), ms))])
}

// @ts-ignore
import NetWorkerConstructor from "./net-worker?worker"

// registerSerializer(CustomErrorSerializer)

async function spawnNetWorker() {
  console.log("[worker-controller] Spawning worker...")
  const worker = new NetWorkerConstructor()
  const netWorker = wrap<NetWorkerInterface>(worker)

  // Wait for worker to be ready (optional, or just start using it)
  // Comlink doesn't have an explicit handshake, but we can call a method
  // console.log("[worker-controller] Worker spawned. Enabling logging...")
  // await netWorker.enableLogging(localStorage.getItem("debug") || "")
  // console.log("[worker-controller] Worker ready.")

  // Handle app events
  window.addEventListener("message", event => {
    if (event.data && ["app:pause", "app:resume"].indexOf(event.data) > -1) {
      worker.postMessage(event.data)
    }
  })

  return netWorker
}

async function spawnWorkers() {
  return {
    netWorker: await spawnNetWorker()
  }
}

const workersPromise = spawnWorkers()
  .then(workers => {
    // Dispatch success event
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("worker:ready"))
    }
    return workers
  })
  .catch(err => {
    // tslint:disable-next-line no-console
    console.error("[worker-controller] Worker failed:", err)

    // Dispatch error event for UI
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("worker:error", { detail: err }))
    }

    throw err
  })

export const workers = withTimeout(
  workersPromise,
  WORKER_TIMEOUT_MS,
  "Network worker failed to start in time. Please refresh the page."
)

export type NetWorker = Remote<NetWorkerInterface>
