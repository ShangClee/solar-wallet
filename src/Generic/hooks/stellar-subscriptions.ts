import { proxy } from "comlink"
// tslint:disable:no-shadowed-variable

// import { ObservableLike } from "observable-fns"
import React from "react"
import { Asset, Horizon } from "stellar-sdk"
import { Account } from "~App/contexts/accounts"
import { createEmptyAccountData, AccountData, BalanceLine } from "../lib/account"
import { FixedOrderbookRecord } from "../lib/orderbook"
import { stringifyAsset } from "../lib/stellar"
import { mapSuspendables } from "../lib/suspense"
import { CollectionPage } from "~Workers/net-worker/stellar-network"
import {
  accountDataCache,
  accountOpenOrdersCache,
  accountTransactionsCache,
  orderbookCache,
  resetNetworkCaches,
  OfferHistory,
  TransactionHistory
} from "./_caches"
import { useHorizonURLs } from "./stellar"
import { useDebouncedState, useForceRerender } from "./util"
import { useNetWorker } from "./workers"

function useDataSubscriptions<DataT, UpdateT>(
  reducer: (prev: DataT, update: UpdateT) => DataT,
  items: Array<{ get(): DataT; set(value: DataT): void; subscribe(cb: (data: UpdateT) => void): Promise<() => void> }>
): DataT[] {
  const unfinishedFetches: Array<Promise<DataT>> = []
  const [, setRefreshCounter] = useDebouncedState(0, 100)

  const currentDataSets = mapSuspendables(items, item => item.get())

  if (unfinishedFetches.length > 0) {
    throw unfinishedFetches.length === 1 ? unfinishedFetches[0] : Promise.all(unfinishedFetches)
  }

  React.useEffect(() => {
    const unsubscribers: Array<() => void> = []

    const setupSubscriptions = async () => {
      for (const item of items) {
        const unsub = await item.subscribe(
          proxy((update: UpdateT) => {
            item.set(reducer(item.get(), update))
            setRefreshCounter(counter => counter + 1)
          })
        )
        unsubscribers.push(unsub)
      }
    }

    setupSubscriptions()

    return () => {
      unsubscribers.forEach(unsub => unsub())
    }
  }, [reducer, items, setRefreshCounter])

  return currentDataSets as DataT[]
}

function useDataSubscription<DataT, UpdateT>(
  reducer: (prev: DataT, update: UpdateT) => DataT,
  get: () => DataT,
  set: (value: DataT) => void,
  subscribe: (cb: (data: UpdateT) => void) => Promise<() => void>
): DataT {
  const items = React.useMemo(() => [{ get, set, subscribe }], [get, set, subscribe])
  return useDataSubscriptions(reducer, items)[0]
}

function applyAccountDataUpdate(prev: AccountData, next: AccountData): AccountData {
  // We ignore `prev` here
  return next
}

// Timeout for individual data fetches (15 seconds) - fail fast and retry
const DATA_FETCH_TIMEOUT_MS = 15000

function withDataFetchTimeout<T>(promise: Promise<T>, accountID: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout fetching data for account ${accountID}`)), DATA_FETCH_TIMEOUT_MS)
    )
  ])
}

export function useLiveAccountDataSet(accountIDs: string[], testnet: boolean): AccountData[] {
  const horizonURLs = useHorizonURLs(testnet)
  const netWorker = useNetWorker()

  const items = React.useMemo(
    () =>
      accountIDs.map(accountID => {
        const selector = [horizonURLs, accountID] as const
        const prepare = (account: Horizon.AccountResponse | null) => {
          return account
            ? {
                ...account,
                balances: account.balances.filter(
                  (balance): balance is BalanceLine => balance.asset_type !== "liquidity_pool_shares"
                ),
                data_attr: account.data
              }
            : createEmptyAccountData(accountID)
        }

        return {
          get() {
            return (
              accountDataCache.get(selector) ||
              accountDataCache.suspend(selector, () =>
                withDataFetchTimeout(netWorker.fetchAccountData(horizonURLs, accountID), accountID)
                  .then(prepare)
                  .catch(() => createEmptyAccountData(accountID))
              )
            )
          },
          set(updated: AccountData) {
            accountDataCache.set(selector, updated)
          },
          subscribe(cb: (data: AccountData) => void) {
            return netWorker.subscribeToAccount(
              horizonURLs,
              accountID,
              proxy(data => cb(prepare(data)))
            )
          }
        }
      }),
    [accountIDs, horizonURLs, netWorker]
  )

  return useDataSubscriptions(applyAccountDataUpdate, items)
}

export function useLiveAccountData(accountID: string, testnet: boolean): AccountData {
  return useLiveAccountDataSet([accountID], testnet)[0]
}

function applyAccountOffersUpdate(prev: OfferHistory, next: Horizon.ServerApi.OfferRecord[]): OfferHistory {
  // We ignore `prev` here
  return { olderOffersAvailable: prev.olderOffersAvailable, offers: next }
}

export function useLiveAccountOffers(accountID: string, testnet: boolean): OfferHistory {
  const horizonURLs = useHorizonURLs(testnet)
  const netWorker = useNetWorker()

  const { get, set, subscribe } = React.useMemo(() => {
    const selector = [horizonURLs, accountID] as const
    const limit = 10
    return {
      get() {
        return (
          accountOpenOrdersCache.get(selector) ||
          accountOpenOrdersCache.suspend(selector, async () => {
            try {
              const page = await withDataFetchTimeout(
                netWorker.fetchAccountOpenOrders(horizonURLs, accountID, { limit, order: "desc" }),
                accountID
              )
              const offers = page._embedded.records
              return {
                olderOffersAvailable: offers.length === limit,
                offers
              }
            } catch {
              return { olderOffersAvailable: false, offers: [] }
            }
          })
        )
      },
      set(updated: OfferHistory) {
        // reset olderOffersAvailable because updated history will only have the 10 most recent offers
        const olderOffersAvailable = updated.offers.length === limit
        accountOpenOrdersCache.set(selector, { ...updated, olderOffersAvailable })
      },
      subscribe(cb: (data: Horizon.ServerApi.OfferRecord[]) => void) {
        return netWorker.subscribeToOpenOrders(horizonURLs, accountID, proxy(cb))
      }
    }
  }, [accountID, horizonURLs, netWorker])

  return useDataSubscription(applyAccountOffersUpdate, get, set, subscribe)
}

export function useOlderOffers(accountID: string, testnet: boolean) {
  const forceRerender = useForceRerender()
  const horizonURLs = useHorizonURLs(testnet)
  const netWorker = useNetWorker()

  const fetchMoreOffers = React.useCallback(
    async function fetchMoreOffers() {
      let fetched: CollectionPage<Horizon.ServerApi.OfferRecord>

      const selector = [horizonURLs, accountID] as const
      const history = accountOpenOrdersCache.get(selector)

      const limit = 10
      const prevOffers = history?.offers || []

      if (prevOffers.length > 0) {
        fetched = await netWorker.fetchAccountOpenOrders(horizonURLs, accountID, {
          cursor: prevOffers[prevOffers.length - 1].paging_token,
          limit,
          order: "desc"
        })
      } else {
        fetched = await netWorker.fetchAccountOpenOrders(horizonURLs, accountID, {
          limit,
          order: "desc"
        })
      }

      const fetchedOffers: Horizon.ServerApi.OfferRecord[] = fetched._embedded.records

      accountOpenOrdersCache.set(
        selector,
        {
          // not an accurate science right now…
          olderOffersAvailable: fetchedOffers.length === limit,
          offers: [...(accountOpenOrdersCache.get(selector)?.offers || []), ...fetchedOffers]
        },
        true
      )

      // hacky…
      forceRerender()
    },
    [accountID, forceRerender, horizonURLs, netWorker]
  )

  return fetchMoreOffers
}

type EffectHandler = (account: Account, effect: Horizon.ServerApi.EffectRecord) => void

export function useLiveAccountEffects(accounts: Account[], handler: EffectHandler) {
  const netWorker = useNetWorker()
  const mainnetHorizonURLs = useHorizonURLs(false)
  const testnetHorizonURLs = useHorizonURLs(true)

  React.useEffect(() => {
    const unsubscribers: Array<() => void> = []

    const setupSubscriptions = async () => {
      for (const account of accounts) {
        const horizonURLs = account.testnet ? testnetHorizonURLs : mainnetHorizonURLs
        const unsub = await netWorker.subscribeToAccountEffects(
          horizonURLs,
          account.accountID,
          proxy(effect => effect && handler(account, effect))
        )
        unsubscribers.push(unsub)
      }
    }

    setupSubscriptions()

    return () => unsubscribers.forEach(unsub => unsub())
  }, [accounts, handler, mainnetHorizonURLs, netWorker, testnetHorizonURLs])
}

function applyOrderbookUpdate(prev: FixedOrderbookRecord, next: FixedOrderbookRecord) {
  // Ignoring `prev` here
  return next
}

export function useLiveOrderbook(selling: Asset, buying: Asset, testnet: boolean): FixedOrderbookRecord {
  const horizonURLs = useHorizonURLs(testnet)
  const netWorker = useNetWorker()

  const { get, set, subscribe } = React.useMemo(() => {
    const selector = [horizonURLs, selling, buying] as const
    return {
      get() {
        return (
          orderbookCache.get(selector) ||
          orderbookCache.suspend(selector, () =>
            netWorker.fetchOrderbookRecord(horizonURLs, stringifyAsset(selling), stringifyAsset(buying))
          )
        )
      },
      set(updated: FixedOrderbookRecord) {
        orderbookCache.set(selector, updated)
      },
      subscribe(cb: (data: FixedOrderbookRecord) => void) {
        return netWorker.subscribeToOrderbook(horizonURLs, stringifyAsset(selling), stringifyAsset(buying), proxy(cb))
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stringifyAsset(buying), horizonURLs, netWorker, stringifyAsset(selling)])

  return useDataSubscription(applyOrderbookUpdate, get, set, subscribe)
}

const txsMatch = (a: Horizon.HorizonApi.TransactionResponse, b: Horizon.HorizonApi.TransactionResponse): boolean => {
  return a.source_account === b.source_account && a.source_account_sequence === b.source_account_sequence
}

function applyAccountTransactionsUpdate(
  prev: TransactionHistory,
  update: Horizon.HorizonApi.TransactionResponse
): TransactionHistory {
  if (prev.transactions.some(tx => txsMatch(tx, update))) {
    return prev
  } else {
    return {
      ...prev,
      transactions: [update, ...prev.transactions]
    }
  }
}

export function useLiveRecentTransactions(accountID: string, testnet: boolean): TransactionHistory {
  const horizonURLs = useHorizonURLs(testnet)
  const netWorker = useNetWorker()

  const { get, set, subscribe } = React.useMemo(() => {
    const limit = 15
    const selector = [horizonURLs, accountID] as const

    return {
      get() {
        return (
          accountTransactionsCache.get(selector) ||
          accountTransactionsCache.suspend(selector, async () => {
            const fetchPromise = netWorker.fetchAccountTransactions(horizonURLs, accountID, {
              emptyOn404: true,
              limit,
              order: "desc"
            })

            try {
              const page = await withDataFetchTimeout(fetchPromise, accountID)
              const transactions = page._embedded.records
              return {
                // not an accurate science right now…
                olderTransactionsAvailable: transactions.length === limit,
                transactions
              }
            } catch {
              return { olderTransactionsAvailable: false, transactions: [] }
            }
          })
        )
      },
      set(updated: TransactionHistory) {
        accountTransactionsCache.set(selector, updated)
      },
      subscribe(cb: (data: Horizon.HorizonApi.TransactionResponse) => void) {
        return netWorker.subscribeToAccountTransactions(horizonURLs, accountID, proxy(cb))
      }
    }
  }, [accountID, horizonURLs, netWorker])

  return useDataSubscription(applyAccountTransactionsUpdate, get, set, subscribe)
}

export function useOlderTransactions(accountID: string, testnet: boolean) {
  const forceRerender = useForceRerender()
  const horizonURLs = useHorizonURLs(testnet)
  const netWorker = useNetWorker()

  const fetchMoreTransactions = React.useCallback(
    async function fetchMoreTransactions() {
      let fetched: CollectionPage<Horizon.HorizonApi.TransactionResponse>

      const selector = [horizonURLs, accountID] as const
      const history = accountTransactionsCache.get(selector)

      const limit = 15
      const prevTransactions = history?.transactions || []

      if (prevTransactions.length > 0) {
        fetched = await netWorker.fetchAccountTransactions(horizonURLs, accountID, {
          emptyOn404: true,
          cursor: prevTransactions[prevTransactions.length - 1].paging_token,
          limit: 15,
          order: "desc"
        })
      } else {
        fetched = await netWorker.fetchAccountTransactions(horizonURLs, accountID, {
          emptyOn404: true,
          limit,
          order: "desc"
        })
      }

      const fetchedTransactions: Horizon.HorizonApi.TransactionResponse[] = fetched._embedded.records

      accountTransactionsCache.set(
        selector,
        {
          // not an accurate science right now…
          olderTransactionsAvailable: fetchedTransactions.length === limit,
          transactions: [
            ...(accountTransactionsCache.get(selector)?.transactions || []),
            ...fetchedTransactions.filter(record => !prevTransactions.some(prevTx => txsMatch(prevTx, record)))
          ]
        },
        true
      )

      // hacky…
      forceRerender()
    },
    [accountID, forceRerender, horizonURLs, netWorker]
  )

  return fetchMoreTransactions
}

export function useNetworkCacheReset() {
  return resetNetworkCaches
}
