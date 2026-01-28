import "./worker-polyfills"

import DebugLogger from "debug"
import { expose } from "comlink"
import { ConnectionErrorDescription, ConnectionErrorEvent, Exposed as Errors, ServiceID } from "./net-worker/errors"

import * as Multisig from "./net-worker/multisig"
import * as SEP10 from "./net-worker/sep-10"
import * as Ecosystem from "./net-worker/stellar-ecosystem"
import * as Network from "./net-worker/stellar-network"

// TODO: resetAllSubscriptions() if a different horizon server has been selected
// TODO: selectTransactionFeeWithFallback(), horizon.fetchTimebounds() (see createTransaction())

const Logging = {
  enableLogging(namespaces: string) {
    DebugLogger.enable(namespaces)
  }
}

const netWorker = {
  ...Ecosystem,
  ...Errors,
  ...Logging,
  ...Multisig,
  ...Network,
  ...SEP10
}

export type NetWorker = typeof netWorker
export type Service = ServiceID

export { ConnectionErrorDescription, ConnectionErrorEvent } from "./net-worker/errors"

expose(netWorker)
console.log("[net-worker] Exposed.")
