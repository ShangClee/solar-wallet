## Goal (Phase 0 + Phase 1)

- Add TailwindCSS to the Vite build without changing existing UI.
- Map your existing MUI theme tokens (colors, radius, breakpoints, background gradient) into Tailwind so future migration is consistent.
- Keep risk low by disabling Tailwind preflight initially (so it won’t unexpectedly restyle existing MUI-based UI).

## What I will change

### 1) Dependencies
- Add devDependencies:
  - `tailwindcss`
  - `postcss`
  - `autoprefixer`

### 2) Build configuration
- Create `postcss.config.cjs` enabling Tailwind + Autoprefixer.
- Create `tailwind.config.cjs`:
  - `content`: scan `./src/**/*.{ts,tsx,js,jsx}` and `./index.html`
  - `corePlugins.preflight = false` (avoid global reset during transition)
  - `theme.extend` tokens derived from `src/App/theme.ts`:
    - `colors.brand` (`main`, `dark`, `light`, `main15`)
    - `backgroundImage.primary` for `primaryBackground`
    - `borderRadius` (8px mapping)
    - custom `screens` that match existing max-width breakpoints:
      - `sm: { max: '600px' }`
      - `xs: { max: '400px' }`
      - `xxs: { max: '350px' }`

### 3) CSS entry
- Add a Tailwind entry stylesheet (e.g. `src/App/css/tailwind.css`) containing:
  - `@tailwind base;` (safe because preflight is disabled)
  - `@tailwind components;`
  - `@tailwind utilities;`

### 4) Load Tailwind in the app
- Update the Vite entry module [bootstrap.ts](file:///Users/shang/gitHub/solar-wallet/src/bootstrap.ts) to import the Tailwind CSS file once (so utilities are available everywhere).
- Keep existing global CSS links in [index.html](file:///Users/shang/gitHub/solar-wallet/index.html) unchanged for now.

### 5) Verification
- Run `npm run dev:vite` and ensure there are no build errors.
- Confirm existing screens render the same (Tailwind is present but not used yet, so visuals should remain unchanged).

## Notes / Optional (Not part of Phase 0 + 1 unless you want)
- Storybook currently won’t process Tailwind directives unless we also wire PostCSS into its webpack config. Since Phase 0+1 will load Tailwind only through app bootstrap, Storybook remains unaffected.

If you confirm, I will implement exactly Phase 0 + Phase 1 above and nothing more.