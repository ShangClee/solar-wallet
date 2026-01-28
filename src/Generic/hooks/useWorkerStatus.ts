import React from "react"

interface WorkerError {
  error: Error | null
  isLoading: boolean
}

export function useWorkerStatus(): WorkerError {
  const [error, setError] = React.useState<Error | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    let mounted = true

    // Listen for worker errors from the worker controller
    const handleWorkerError = ((event: CustomEvent) => {
      if (mounted) {
        console.error("[useWorkerStatus] Worker error detected:", event.detail)
        setError(event.detail)
        setIsLoading(false)
      }
    }) as EventListener

    const handleWorkerReady = (() => {
      if (mounted) {
        console.log("[useWorkerStatus] Worker initialized successfully")
        setError(null)
        setIsLoading(false)
      }
    }) as EventListener

    window.addEventListener("worker:error", handleWorkerError)
    window.addEventListener("worker:ready", handleWorkerReady)

    // Check worker status on mount
    import("../../Workers/worker-controller")
      .then(module => module.workers)
      .then(() => {
        if (mounted) {
          window.dispatchEvent(new CustomEvent("worker:ready"))
        }
      })
      .catch(err => {
        if (mounted) {
          window.dispatchEvent(new CustomEvent("worker:error", { detail: err }))
        }
      })

    return () => {
      mounted = false
      window.removeEventListener("worker:error", handleWorkerError)
      window.removeEventListener("worker:ready", handleWorkerReady)
    }
  }, [])

  return { error, isLoading }
}
