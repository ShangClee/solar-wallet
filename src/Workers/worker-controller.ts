import "threads/register"
import { ModuleThread, registerSerializer, spawn } from "threads"
import { CustomErrorSerializer } from "../Generic/lib/errors"
import { NetWorker as NetWorkerInterface } from "./net-worker"

const WORKER_TIMEOUT_MS = 15000

function withTimeout<T>(p: Promise<T>, ms: number, message: string): Promise<T> {
  return Promise.race([p, new Promise<never>((_, reject) => setTimeout(() => reject(new Error(message)), ms))])
}

// Load worker eagerly
const netWorker = new Worker(new URL("./net-worker.ts", import.meta.url), { type: "module" })

registerSerializer(CustomErrorSerializer)

async function spawnNetWorker() {
  window.addEventListener("message", event => {
    if (event.data && ["app:pause", "app:resume"].indexOf(event.data) > -1) {
      netWorker.postMessage(event.data)
    }
  })

  const worker = await spawn<NetWorkerInterface>(netWorker)
  await worker.enableLogging(localStorage.getItem("debug") || "")

  return worker
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

export type NetWorker = ModuleThread<NetWorkerInterface>
