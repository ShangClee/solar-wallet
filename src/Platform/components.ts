import React from "react"
import * as ElectronImpl from "./components/electron"
import * as CordovaImpl from "./components/cordova"
import * as WebImpl from "./components/web"

interface QRReaderProps {
  onError: (error: Error) => void
  onScan: (data: string | null) => void
  style?: any // ignored
}

function getImplementation() {
  if (window.electron) {
    return ElectronImpl
  } else if (process.env.PLATFORM === "android" || process.env.PLATFORM === "ios") {
    return CordovaImpl
  } else if (process.browser || true) {
    return WebImpl
  } else {
    throw new Error("There are no platform components for your platform.")
  }
}

const components: any = getImplementation()

export const isFullscreenQRPreview: boolean = components.isFullscreenQRPreview

export const QRReader: React.ComponentType<QRReaderProps> = components.QRReader
