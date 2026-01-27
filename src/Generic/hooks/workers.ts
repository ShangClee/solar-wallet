import { workers, NetWorker } from "~Workers/worker-controller"

let netWorker: NetWorker | undefined
let workerInitPromise: Promise<void> | undefined

export function useNetWorker() {
  if (netWorker) {
    return netWorker
  }

  // Create the initialization promise once
  if (!workerInitPromise) {
    workerInitPromise = workers.then(
      initializedWorkers => {
        netWorker = initializedWorkers.netWorker
      },
      error => {
        // Reset so we can retry on next render
        workerInitPromise = undefined
        throw error
      }
    )
  }

  // Suspend React component
  throw workerInitPromise
}
