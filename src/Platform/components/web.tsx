import React from "react"
import { props as QRReaderProps } from "react-qr-reader"
import ViewLoading from "../../Generic/components/ViewLoading"

function patchComponentModule<T>(mod: T | { default: T }): { default: T } {
  if (mod && typeof mod === "object" && "default" in mod && (mod as any).default) {
    return mod
  } else {
    return { default: mod as T }
  }
}

const ReactQRReader = React.lazy(() => import("react-qr-reader").then(patchComponentModule))

function QRReader(props: QRReaderProps) {
  return (
    <React.Suspense fallback={<ViewLoading />}>
      <ReactQRReader {...props} />
    </React.Suspense>
  )
}

const isFullscreenQRPreview = false

export { isFullscreenQRPreview, QRReader }
