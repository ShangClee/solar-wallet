# Solar Wallet Codebase Explanation

**Date:** January 26, 2026  
**Version:** 0.28.1  
**Project:** Solar Wallet - Stellar Network Wallet Application

---

## 1. Project Overview

**Solar Wallet** is a user-friendly cryptocurrency wallet for the Stellar payment network, developed by SatoshiPay Ltd. It enables users to manage Stellar accounts, send/receive payments, trade assets on the Stellar DEX (Decentralized Exchange), and manage multi-signature accounts.

### Key Features

- **Multi-platform Support**: Desktop (Electron: macOS, Windows, Linux) and Mobile (Cordova: iOS, Android)
- **Account Management**: Create, import, and manage multiple Stellar accounts
- **Multi-signature Support**: Create and manage multi-sig accounts with configurable thresholds
- **Asset Management**: Add/remove trustlines for custom Stellar assets
- **Payment Processing**: Send and receive payments on the Stellar network
- **Trading Interface**: Access to Stellar DEX for asset trading
- **Security**: Local key encryption with password protection

---

## 2. Technology Stack

### Core Technologies

- **Language**: TypeScript (v5.3)
- **Frontend Framework**: React 19 (with Hooks & Context API)
- **UI Library**: Material-UI v7 (MUI) with Emotion styling
- **Routing**: React Router v6
- **Build Tool**: Vite 7.3 (migrated from Parcel)
- **Stellar SDK**: stellar-sdk v13.3.0
- **Cryptography**: sodium-javascript (replaced sodium-native for cross-platform compatibility)

### Platform-Specific

- **Desktop**: Electron 40.0
- **Mobile**: Cordova
- **State Management**: React Context API (no Redux/MobX)
- **Internationalization**: i18next with react-i18next
- **Testing/Dev**: Storybook for component development

### Recent Modernization (2025/2026)

The codebase underwent significant modernization:

- ✅ Migrated from Parcel to **Vite** for faster builds
- ✅ Upgraded React from v16 to **React 19**
- ✅ Upgraded TypeScript from v3.9 to **v5.3**
- ✅ Migrated Material-UI from v4 to **MUI v7** (Emotion-based)
- ✅ Upgraded React Router from v5 to **v6**
- ✅ Replaced `sodium-native` with `sodium-javascript`
- ✅ Upgraded Stellar SDK from v9 to v13.3.0

---

## 3. Architecture Overview

### Application Structure

The codebase follows a **shared codebase** approach where the core React application (`src/`) is shared across all platforms, with platform-specific implementations in `electron/` and `cordova/`.

```
┌─────────────────────────────────────────┐
│         Platform Layer                  │
│  (Electron / Cordova / Web)            │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│      Core React Application (src/)      │
│  - Components, Hooks, Contexts           │
│  - Business Logic                        │
│  - Stellar Network Integration           │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│      Platform Abstraction (Platform/)   │
│  - Storage, Clipboard, Notifications    │
│  - QR Reader, etc.                      │
└─────────────────────────────────────────┘
```

### Bootstrap Flow

1. **Entry Point**: `src/bootstrap.ts`

   - Loads polyfills
   - Registers Web Workers
   - Initializes splash screen
   - Loads `App/bootstrap`

2. **App Bootstrap**: `src/App/bootstrap.ts`

   - Loads i18n
   - Loads `app-stage1`

3. **Stage 1** (`src/App/bootstrap/app-stage1.tsx`):

   - Sets up React Router (HashRouter)
   - Wraps app with ThemeProvider (MUI)
   - Wraps with ContextProviders
   - Lazy loads Stage 2

4. **Stage 2** (`src/App/bootstrap/app-stage2.tsx`):
   - Defines all routes
   - Renders main application views
   - Sets up error boundaries
   - Initializes global components (notifications, etc.)

---

## 4. Directory Structure

### Core Application (`src/`)

#### `src/App/`

Application-level setup and global state:

- **`bootstrap/`**: Application initialization and routing setup
- **`contexts/`**: Global React Context providers:
  - `accounts.tsx`: Account management (create, delete, rename, password management)
  - `stellar.tsx`: Stellar network configuration (Horizon URLs, testnet/mainnet)
  - `settings.tsx`: Application settings
  - `caches.tsx`: Caching providers for various data
  - `notifications.tsx`: Toast notifications
  - `signatureDelegation.tsx`: Multi-sig signature delegation
- **`components/`**: Global app components (AccountList, TermsAndConditions, etc.)
- **`cordova/`**: Cordova-specific implementations
- **`theme.ts`**: MUI theme configuration

#### `src/Account/`

Account viewing and management:

- **`components/`**:
  - `AccountView.tsx`: Main account view with balances, transactions
  - `AccountBalances.tsx`: Display account balances
  - `AccountTransactions.tsx`: Transaction history
  - `AccountActions.tsx`: Account action buttons
  - `TransactionList.tsx`: List of transactions
  - `OfferList.tsx`: Open orders on DEX
  - `SignatureRequestList.tsx`: Pending signature requests (multi-sig)

#### `src/AccountCreation/`

Account creation flow:

- **`components/`**: UI for creating/importing accounts
  - `NewAccountSettings.tsx`: Account name, password settings
  - `SecretKeyImport.tsx`: Import existing secret key
  - `MultisigAccountPubKey.tsx`: Multi-sig account setup
- **`hooks/useAccountCreation.ts`**: Account creation logic
- **`types/types.ts`**: TypeScript types for account creation

#### `src/AccountSettings/`

Account-specific settings (rename, password change, etc.)

#### `src/Assets/`

Stellar asset management:

- **`components/`**:
  - `AddAssetDialog.tsx`: Add trustline for custom asset
  - `RemoveTrustline.tsx`: Remove asset trustline
  - `AssetDetailsDialog.tsx`: View asset details
  - `BalanceDetailsDialog.tsx`: Balance breakdown
  - `CustomTrustline.tsx`: Custom asset trustline UI

#### `src/Payment/`

Payment processing components

#### `src/Trading/`

Stellar DEX trading interface:

- **`components/`**:
  - `TradingDialog.tsx`: Main trading interface
  - `TradingForm.tsx`: Trading form (buy/sell)
  - `TradingPrice.tsx`: Price display
- **`hooks/`**: Trading logic and conversions

#### `src/Transaction/`

Transaction creation and review:

- Transaction building and signing
- Transaction review UI

#### `src/TransactionReview/`

Transaction review and confirmation dialogs

#### `src/TransferService/`

Transfer service integration (SEP-6, SEP-24):

- Components for deposit/withdrawal flows
- Integration with transfer servers

#### `src/ManageSigners/`

Multi-signature account management:

- **`components/`**:
  - `ManageSignersDialog.tsx`: Main multi-sig management UI
  - `SignersEditor.tsx`: Add/remove signers
  - `ThresholdInput.tsx`: Configure thresholds
  - `PresetSelector.tsx`: Pre-configured multi-sig presets
- **`hooks/useSignersEditor.ts`**: Multi-sig editing logic
- **`lib/editor.ts`**: Multi-sig state management

#### `src/Generic/`

Shared utilities and components:

- **`components/`**: Reusable UI components (buttons, dialogs, form fields, etc.)
- **`hooks/`**: Shared React hooks:
  - `stellar.ts`: Stellar network hooks (Horizon, account data, federation lookup)
  - `stellar-ecosystem.ts`: Ecosystem integrations
  - `stellar-subscriptions.ts`: Real-time subscriptions
  - `transfer-server.ts`: Transfer service hooks
  - `workers.ts`: Web Worker access
- **`lib/`**: Utility libraries:
  - `account.ts`: Account data utilities
  - `balances.ts`: Balance calculations
  - `transaction.ts`: Transaction building
  - `stellar.ts`: Stellar utilities
  - `multisig-discovery.ts`: Multi-sig account discovery
  - `multisig-service.ts`: Multi-sig operations
  - `persistent-cache.ts`: Local caching
  - `makeStyles.ts`: Style utility (shim for MUI migration)

#### `src/Workers/`

Web Workers for offloading heavy operations:

- **`net-worker/`**: Network operations worker:
  - `stellar-network.ts`: Horizon API calls
  - `stellar-ecosystem.ts`: Ecosystem integrations
  - `sep-10.ts`: SEP-10 authentication
  - `multisig.ts`: Multi-sig operations
- **`lib/`**: Worker utilities (connection, subscriptions, REST client)
- **`net-worker.ts`**: Main worker entry point

#### `src/Platform/`

Platform abstraction layer:

- **`components.ts`**: Platform-specific component implementations (QR reader, etc.)
- **`key-store.ts`**: Key storage abstraction
- **`ipc/`**: Inter-process communication (Electron-specific)
- Platform-specific implementations in subdirectories:
  - `electron/`: Electron implementations
  - `cordova/`: Cordova implementations
  - `web/`: Web implementations

#### `src/Layout/`

Layout components (navigation, headers, etc.)

#### `src/Icons/`

Custom icon components

#### `src/Toasts/`

Toast notification components

#### `src/AppSettings/`

Application-wide settings

#### `src/LumenPurchase/`

Lumen (XLM) purchase integration

### Platform-Specific Code

#### `electron/`

Electron desktop application:

- **`src/`**: Main process code
  - `app.ts`: Application lifecycle
  - `window.ts`: Window management
  - `menu.ts`: Application menu
  - `ipc/`: IPC handlers (storage, etc.)
  - `protocol-handler.ts`: Custom protocol handling (stellar: URIs)
- **`lib/`**: Compiled TypeScript output

#### `cordova/`

Cordova mobile application:

- Configuration files
- Platform-specific hooks
- Build scripts

### Configuration & Build

- **`vite.config.ts`**: Vite build configuration
- **`electron-build.yml`**: Electron Builder configuration
- **`i18n/`**: Internationalization files (30+ languages)
- **`.storybook/`**: Storybook configuration

---

## 5. Key Features & Flows

### Account Management

**Account Creation Flow:**

1. User navigates to `/account/create/mainnet` or `/account/create/testnet`
2. `AccountCreation` components collect:
   - Account name
   - Password (optional)
   - Secret key (if importing) or generate new keypair
   - Multi-sig settings (if applicable)
3. `useAccountCreation` hook validates and creates account
4. `AccountsContext.createAccount()` saves encrypted key to platform key store
5. Account is added to accounts list

**Key Storage:**

- Keys are encrypted using `PBKDF2` (SHA256) + `xsalsa20-poly1305`
- Platform-specific storage:
  - **Electron**: `electron-store` (local filesystem)
  - **Cordova**: Secure storage plugin
  - **Web**: LocalStorage (less secure, not recommended for production)

**Account Interface:**

```typescript
interface Account {
  accountID: string // Public key or cosigner identifier
  cosignerOf?: string // If this is a cosigner key
  id: string // Internal wallet ID
  name: string // User-friendly name
  publicKey: string // Stellar public key
  requiresPassword: boolean
  testnet: boolean
  getPrivateKey(password: string | null): Promise<string>
  signTransaction(transaction: Transaction, password: string | null): Promise<Transaction>
}
```

### Stellar Network Integration

**Horizon API Access:**

- Uses `stellar-sdk` Horizon client
- Horizon URLs configured in `StellarContext`
- Supports multiple Horizon servers for redundancy
- Network operations run in Web Workers (`net-worker`)

**Account Data Fetching:**

- `useAccountData(accountID, testnet)`: Fetches account data from Horizon
- Cached using suspense-based caching system
- Real-time updates via subscriptions

**Hooks Available:**

- `useHorizonURLs(testnet)`: Get Horizon server URLs
- `useAccountData(accountID, testnet)`: Fetch account data
- `useAccountHomeDomain(accountID, testnet)`: Get account home domain
- `useStellarToml(domain)`: Fetch stellar.toml metadata
- `useAssetMetadata(asset, testnet)`: Get asset metadata from stellar.toml
- `useFederationLookup()`: Stellar address federation lookup
- `useWebAuth()`: SEP-10 WebAuth authentication

### Multi-Signature Support

**Multi-Sig Account Management:**

- `ManageSigners` components allow adding/removing signers
- Configurable thresholds (low, medium, high)
- Preset configurations (2-of-3, 3-of-5, etc.)
- Cosigner keys can be added to existing accounts

**Signature Delegation:**

- `SignatureDelegationContext` manages pending signature requests
- Signers can approve/reject transactions
- Transaction requires threshold number of signatures

### Payment Processing

**Payment Flow:**

1. User initiates payment from account view
2. Payment form collects:
   - Recipient (Stellar address or federation address)
   - Amount and asset
   - Memo (optional)
3. Transaction is built using `stellar-sdk`
4. Transaction is signed (requires password if account is protected)
5. Transaction is submitted to Horizon
6. UI updates with transaction status

**Transaction Building:**

- `src/Generic/lib/transaction.ts` provides utilities
- Handles fee calculation
- Manages sequence numbers
- Supports memos and timebounds

### Trading (DEX)

**Trading Flow:**

1. User navigates to trading interface
2. Selects asset pair (buy/sell)
3. Trading form collects:
   - Asset to buy/sell
   - Amount
   - Price (market or limit)
4. Creates order operation
5. Signs and submits transaction
6. Order appears in `OfferList`

### Asset Management

**Trustline Management:**

- Add trustline: `AddAssetDialog` → Creates change trust operation
- Remove trustline: `RemoveTrustline` → Removes trustline
- Asset details: Fetches metadata from stellar.toml
- Balance display: Shows spendable vs. available balances

---

## 6. Security Model

### Key Encryption

**Encryption Process:**

1. User provides password
2. Password is hashed using `PBKDF2` with SHA256 (key derivation)
3. Derived key is used to encrypt private key with `xsalsa20-poly1305`
4. Encrypted key is stored in platform-specific secure storage

**Important Security Notes:**

- Private keys never leave the device unencrypted
- Password is never stored (only used for encryption)
- If password is forgotten, keys cannot be recovered (user must have backup)
- Keys are decrypted only when needed (for signing transactions)

### Platform Security

**Electron:**

- Context isolation enabled
- Node integration disabled in renderer
- Sandbox enabled
- Preload scripts for secure IPC

**Cordova:**

- Uses secure storage plugins
- Keys stored in platform secure storage (Keychain/Keystore)

### Transaction Signing

- Transactions are signed locally on device
- Private key is decrypted only during signing
- Signed transactions are submitted to Horizon
- No private keys are ever sent over network

---

## 7. Platform Abstraction

The `src/Platform/` directory provides platform-agnostic APIs:

**Key Store:**

```typescript
interface KeyStoreAPI {
  saveKey(id, password, privateData, publicData): Promise<void>
  getPrivateKeyData(id, password): Promise<PrivateKeyData>
  getPublicKeyData(id): Promise<PublicKeyData>
  signTransaction(id, transaction, password): Promise<Transaction>
  // ...
}
```

**Components:**

- QR Reader: Platform-specific implementations
- Clipboard: Copy/paste functionality
- Notifications: Desktop/mobile notifications
- Storage: Secure storage abstraction

**Implementation Selection:**

```typescript
// src/Platform/components.ts
function getImplementation() {
  if (window.electron) return ElectronImpl
  else if (process.env.PLATFORM === "android" || process.env.PLATFORM === "ios") return CordovaImpl
  else return WebImpl
}
```

---

## 8. State Management

**React Context API:**

- No Redux or MobX - uses React Context for global state
- Context providers in `src/App/contexts/`:
  - `StellarProvider`: Network configuration
  - `AccountsProvider`: Account list and operations
  - `SettingsProvider`: App settings
  - `CachingProviders`: Various caches
  - `NotificationsProvider`: Toast notifications
  - `SignatureDelegationProvider`: Multi-sig signatures

**Local State:**

- Component-level state with `useState`
- Form state with `react-hook-form`
- Custom hooks for complex logic

**Caching:**

- Suspense-based caching for async data
- Persistent cache for stellar.toml, home domains
- In-memory caches for account data, balances

---

## 9. Web Workers

**Network Worker (`net-worker`):**

- Runs in separate thread to avoid blocking UI
- Handles all Horizon API calls
- Manages subscriptions and real-time updates
- Implements SEP-10, multi-sig operations, ecosystem integrations

**Worker Access:**

```typescript
import { workers } from "~Workers/worker-controller"
const { netWorker } = await workers
const accountData = await netWorker.fetchAccountData(horizonURLs, accountID)
```

---

## 10. Internationalization

**i18n Setup:**

- Uses `i18next` and `react-i18next`
- Translation files in `i18n/locales/` (30+ languages)
- Language detection via `i18next-browser-languagedetector`
- Translations loaded in `src/App/i18n.ts`

**Usage:**

```typescript
import { useTranslation } from "react-i18next"
const { t } = useTranslation()
const message = t("create-account.validation.no-account-name")
```

---

## 11. Development Workflow

### Running Development Server

**Desktop (Electron):**

```bash
npm run dev
# Runs: Vite dev server + Electron app
# Vite serves on http://localhost:3000
```

**Web Only:**

```bash
cd web/
npm run dev
```

### Building

**Desktop:**

```bash
npm run build:mac      # macOS
npm run build:win      # Windows
npm run build:linux    # Linux
```

**Mobile:**
See `cordova/README.md` for Cordova build instructions

### Testing

```bash
npm test              # Linting
npm run storybook     # Component development
```

### Code Quality

- **Linting**: TSLint + ESLint
- **Formatting**: Prettier (auto-format on commit via lint-staged)
- **Type Checking**: TypeScript strict mode

---

## 12. Key Files Reference

### Entry Points

- `src/bootstrap.ts`: Application entry point
- `src/App/bootstrap.ts`: App initialization
- `src/App/bootstrap/app-stage1.tsx`: React app setup
- `src/App/bootstrap/app-stage2.tsx`: Routes and main views

### Core Contexts

- `src/App/contexts/accounts.tsx`: Account management
- `src/App/contexts/stellar.tsx`: Stellar network config
- `src/App/contexts/settings.tsx`: App settings

### Key Utilities

- `src/Generic/hooks/stellar.ts`: Stellar network hooks
- `src/Generic/lib/transaction.ts`: Transaction building
- `src/Generic/lib/account.ts`: Account utilities
- `src/Platform/key-store.ts`: Key storage abstraction

### Workers

- `src/Workers/net-worker.ts`: Network worker entry
- `src/Workers/net-worker/stellar-network.ts`: Horizon API

### Platform

- `src/Platform/components.ts`: Platform component selection
- `electron/src/app.ts`: Electron main process
- `electron/src/window.ts`: Window management

---

## 13. Important Notes

### Migration Status

- ✅ Vite migration complete
- ✅ React 19 upgrade complete
- ✅ MUI v7 migration complete (with `makeStyles` shim for compatibility)
- ✅ React Router v6 migration complete
- ✅ Stellar SDK v13 upgrade complete

### Legacy Code

- Some components still use old `makeStyles` pattern (shimmed for compatibility)
- Gradual migration to Emotion-based styling
- Some deprecated hooks/utilities may still exist

### Browser Support

- Chrome 50+
- Chrome Android 50+
- iOS 10+

### Dependencies

- `stellar-sdk`: Core Stellar blockchain interaction
- `@satoshipay/stellar-sep-10`: SEP-10 authentication
- `@satoshipay/stellar-transfer`: Transfer service integration
- `sodium-javascript`: Cryptography (replaced sodium-native)

---

## 14. Common Development Tasks

### Adding a New Route

1. Add route in `src/App/bootstrap/app-stage2.tsx`
2. Create component in appropriate directory
3. Add translations if needed

### Adding a New Context

1. Create context file in `src/App/contexts/`
2. Add provider to `src/App/bootstrap/context.tsx`
3. Export hook for consuming context

### Adding Platform-Specific Code

1. Create implementation in `src/Platform/` subdirectory
2. Export from platform-specific file
3. Update `src/Platform/components.ts` (or similar) to select implementation

### Working with Stellar Network

- Use hooks from `src/Generic/hooks/stellar.ts`
- Network operations go through `net-worker`
- Account data is cached automatically

### Styling Components

- Use MUI components and Emotion styling
- For legacy compatibility, `makeStyles` shim is available
- Prefer `tss-react` for new components

---

## 15. Troubleshooting

### Build Issues

- Clear `node_modules` and reinstall if Vite issues occur
- Check TypeScript version compatibility
- Ensure all platform-specific dependencies are installed

### Runtime Issues

- Check browser console for errors
- Verify Horizon server connectivity
- Check network worker is running (in DevTools)

### Key Storage Issues

- Verify platform-specific storage is accessible
- Check encryption/decryption is working
- Ensure password is correct for encrypted accounts

---

## Summary

Solar Wallet is a well-architected, cross-platform Stellar wallet application. The codebase uses modern React patterns, TypeScript for type safety, and a platform abstraction layer to support multiple deployment targets. The recent modernization effort has brought it up to date with current web standards while maintaining backward compatibility where needed.

The application follows a clear separation of concerns:

- **UI Components**: React components in feature directories
- **Business Logic**: Hooks and utility libraries
- **Network Operations**: Web Workers for performance
- **Platform Integration**: Abstraction layer for multi-platform support
- **State Management**: React Context API

Key strengths:

- ✅ Cross-platform code sharing
- ✅ Strong TypeScript typing
- ✅ Secure key management
- ✅ Modern React patterns
- ✅ Comprehensive feature set (multi-sig, trading, assets)

Areas for continued improvement:

- Complete migration from `makeStyles` to Emotion
- Further optimization of Web Worker usage
- Enhanced error handling and user feedback
- Additional test coverage
