I have researched the current project structure and dependencies to plan the setup of test modules.

**Analysis:**

- **Current State**: The project lacks a modern testing framework configuration (no `jest.config.ts` or `vitest.config.ts`). The `package.json` references `tslint` and `eslint` in the `test` script, but no unit testing runner.
- **Dependencies**: The project uses `vite`, `react`, and `stellar-sdk`.
- **Recommendation**: Since the project is already using Vite, **Vitest** is the natural choice for a test runner. It integrates seamlessly with Vite's configuration, is faster than Jest, and supports ESM out of the box (which is important given the project's use of `stellar-sdk` and worker threads).

**Plan:**

1.  **Install Dependencies**: Install `vitest`, `@vitest/ui`, `@testing-library/react`, `@testing-library/jest-dom`, and `jsdom` (for React component testing).
2.  **Configure Vitest**: Create a `vitest.config.ts` that extends the existing `vite.config.ts` to share path aliases (`~Generic`, etc.) and polyfills.
3.  **Setup Test Environment**: Create a `test/setup.ts` file to import `@testing-library/jest-dom` and mock necessary browser APIs (like `matchMedia` or `ResizeObserver`) if needed.
4.  **Update Scripts**: Add `test:unit` and `test:ui` scripts to `package.json`.
5.  **Create Example Test**: Create a simple test file (e.g., `src/Generic/lib/strings.test.ts`) to verify the setup works.

This approach minimizes configuration overhead and ensures compatibility with the existing build system.
