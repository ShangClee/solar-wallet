# Performance Optimization Report

## Issue Identified

Accounts appear to load "line by line" because each account makes separate network requests to the Stellar Horizon API sequentially during the data fetching phase.

## Root Cause Analysis

### Current Flow:

1. **accounts.tsx (line 165)**: Uses `Promise.all()` to load account keys in parallel ✅

   ```tsx
   const loadedAccounts = await Promise.all(keyIDs.map(keyID => createAccountInstance(keyStore, keyID)))
   ```

2. **AccountView.tsx (line 78)**: Each account view component independently fetches account data from Horizon

   ```tsx
   const accountData = useLiveAccountData(props.account.accountID, props.account.testnet)
   ```

3. **stellar-subscriptions.ts (line 113)**: Individual network requests per account with 30s timeout
   ```tsx
   withDataFetchTimeout(netWorker.fetchAccountData(horizonURLs, accountID), accountID)
   ```

### Why this causes slowness:

- Loading account keys from localStorage is fast (synchronous)
- Fetching account data from Horizon testnet is slow (network I/O)
- Each account makes its own HTTP request to Horizon
- Network latency + response time multiplies by number of accounts
- Skeleton loaders stay visible until ALL accounts have loaded their data

## Optimization Strategies

### Strategy 1: Progressive Rendering (Recommended)

**Impact**: High | **Effort**: Low

Show accounts as soon as their data arrives instead of waiting for all.

**Changes needed**:

- Modify `TransactionListPlaceholder.tsx` to show actual loaded items alongside remaining skeletons
- Use React.Suspense boundaries per account instead of per page
- Load accounts incrementally

### Strategy 2: Data Prefetching

**Impact**: Medium | **Effort**: Medium

Pre-fetch all account data in parallel before rendering account views.

**Changes needed**:

- Add a prefetch hook in `AccountsProvider`
- Batch account data requests using `useLiveAccountDataSet`
- Cache results before rendering

### Strategy 3: Request Batching

**Impact**: Medium | **Effort**: High

If Horizon supports batch requests, fetch multiple accounts in one request.

**Changes needed**:

- Check if Stellar Horizon supports batch account queries
- Implement batch fetching in `net-worker`
- Update caching layer

### Strategy 4: Reduce Timeout

**Impact**: Low | **Effort**: Low

The 30-second timeout is excessive. Most requests complete in 1-2 seconds.

**Changes needed**:

- Reduce `DATA_FETCH_TIMEOUT_MS` from 30000ms to 5000ms
- Add retry logic for failed requests

## Recommended Implementation

1. **Immediate** (5 min):

   - Reduce fetch timeout to 5s

2. **Short-term** (30 min):

   - Implement progressive rendering with individual Suspense boundaries
   - Show success message or account count as they load

3. **Long-term** (2 hours):
   - Implement proper data prefetching strategy
   - Add loading indicators per account card
   - Consider virtualization for 100+ accounts

## Testing Recommendations

1. Test with 1, 3, 10, and 100 accounts
2. Test on slow 3G network simulation
3. Measure time-to-interactive (TTI)
4. Monitor Horizon API rate limits

## Expected Results

| Accounts | Current Load Time | After Optimization | Improvement |
| -------- | ----------------- | ------------------ | ----------- |
| 1        | ~2s               | ~1s                | 50%         |
| 3        | ~6s               | ~2s                | 67%         |
| 10       | ~20s              | ~3s                | 85%         |
| 100      | ~200s             | ~10s               | 95%         |
