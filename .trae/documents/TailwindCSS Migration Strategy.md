## Current State

- UI is built on MUI components, styled with Emotion and `tss-react` (`makeStyles` shim). The theme has many global component overrides and breakpoint-specific tweaks. <mccoremem id="03fhg2w0u1a7qvnv8f2r2fo1a" />
- This means a “Tailwind migration” is not just adding Tailwind; it’s also replacing (or wrapping) a large set of MUI components and styles.

## Good Ideas (What Usually Works Best)

### 1) Prefer a **hybrid migration** first (Tailwind for layout + custom UI, keep MUI for complex widgets)

- Use Tailwind for: page layout, spacing, typography, simple cards/containers, responsive rules.
- Keep MUI temporarily for: Dialogs, Menu/Select, form fields, tables, date pickers (if any), and accessibility-heavy primitives.
- This reduces churn and delivers simplification early, without rewriting every interaction component.

### 2) Migrate via **design tokens first**, not component-by-component styling

- Take existing brand tokens from the MUI theme (colors, radii, key breakpoints like 600/400/350) and map them into Tailwind’s `theme.extend`.
- Prefer CSS variables for tokens (`--brand-main`, `--bg-gradient`, etc.) so Tailwind utilities stay stable even if you adjust design later.

### 3) Replace `makeStyles` usage before attempting “remove MUI”

- Biggest simplification win here is eliminating the `makeStyles` shim and ad-hoc style objects.
- Tailwind can replace most `makeStyles` usage quickly (spacing/typography/layout).

### 4) Decide end-state clearly

- **Option A (Pragmatic)**: Tailwind for layout + light components; MUI remains for complex primitives.
- **Option B (Full)**: Tailwind + Headless UI/Radix primitives, remove MUI & Emotion.
- Option A gives 80% benefit with far less risk.

## Proposed Migration Plan

### Phase 0 — Baseline Setup

1. Add TailwindCSS + PostCSS + Autoprefixer.
2. Configure Tailwind content paths for `src/**/*.{ts,tsx}` and Storybook if used.
3. Add a single `src/App/css/tailwind.css` (or similar) that imports Tailwind layers and is loaded once.

### Phase 1 — Token Bridging

1. Mirror existing MUI theme tokens into Tailwind config:
   - Brand colors from `src/App/theme.ts`.
   - Border radius (8px) to `rounded-lg` style.
   - Custom breakpoints (600, 400, 350) into Tailwind `screens`.
2. Add CSS variables (optional but recommended) and reference them in Tailwind config.

### Phase 2 — Incremental Component Migration (Low Risk)

1. Convert “layout-first” components to Tailwind:
   - Containers, headers, spacing wrappers, simple list layouts.
2. Keep MUI components, but wrap them with Tailwind for layout (e.g., `<div className="flex gap-4"> <Button/> …`).
3. Replace `makeStyles` patterns with Tailwind classes where possible.

### Phase 3 — Replace MUI Hotspots (If Desired)

1. Identify the most common MUI primitives in the codebase (Button, ListItem, TextField, Dialog) and choose a replacement approach:
   - Tailwind + headless primitives (Radix/Headless UI) OR
   - Keep MUI but reduce theme overrides and custom CSS.
2. Migrate one primitive at a time behind internal wrappers (e.g., `AppButton`, `AppDialog`, `AppInput`).

### Phase 4 — Cleanup

1. Remove unused MUI theme overrides as equivalents move into Tailwind.
2. Remove `tss-react` shim when no longer used.
3. If going full Option B, remove MUI + Emotion after verifying no imports remain.

## Risks & Mitigations

- **Large rewrite risk** (full removal of MUI): mitigate by internal wrapper components + incremental migration.
- **Inconsistent design** during transition: mitigate via shared tokens + lint rules (e.g., prefer Tailwind classes over inline styles).
- **ClassName bloat**: mitigate via small wrapper components and utility helpers (e.g., `clsx`, `tailwind-merge`).

## Verification Strategy

- Run TypeScript type-check.
- Smoke-test key flows: create account, account list, send payment, trading, settings.
- Check Storybook pages for regressions (if used).

If you want, I can propose a concrete “Phase 0 + Phase 1” patch that adds Tailwind and maps your current theme tokens into Tailwind config without changing any UI yet.
