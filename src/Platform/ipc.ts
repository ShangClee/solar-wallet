// Global IPC.* types are defined in types/ipc.d.ts
import * as ElectronImpl from "./ipc/electron"
import * as CordovaImpl from "./ipc/cordova"
import * as WebImpl from "./ipc/web"

function getImplementation() {
  if (window.electron) {
    return ElectronImpl
  } else if (process.env.PLATFORM === "android" || process.env.PLATFORM === "ios") {
    return CordovaImpl
  } else if (process.browser || true) {
    // Fallback to web if nothing else matches
    return WebImpl
  } else {
    throw new Error("There is no IPC implementation for your platform.")
  }
}

const implementation: any = getImplementation()

export function call<Message extends keyof IPC.MessageType>(
  messageType: Message,
  ...args: IPC.MessageArgs<Message>
): Promise<IPC.MessageReturnType<Message>> {
  return implementation.call(messageType, ...args)
}

type UnsubscribeFn = () => void

export function subscribeToMessages<Message extends keyof IPC.MessageType>(
  messageType: Message,
  callback: (message: any) => void
): UnsubscribeFn {
  return implementation.subscribeToMessages(messageType, callback)
}
