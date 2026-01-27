import React from "react"
// @ts-ignore
import { createRoot } from "react-dom/client"
import { HashRouter as Router } from "react-router-dom"
import { ThemeProvider } from "@mui/material/styles"
import ViewLoading from "~Generic/components/ViewLoading"
import { appIsLoaded } from "~SplashScreen/splash-screen"
import { ContextProviders } from "./context"
import theme from "../theme"

const Stage2 = React.lazy(() => import("./app-stage2"))

/** Hides splash and shows loading spinner. Ensures we never reveal a blank #app. */
function FallbackWithSplashHide() {
  React.useEffect(() => {
    appIsLoaded()
  }, [])
  return <ViewLoading />
}

export const Providers = (props: { children: React.ReactNode }) => (
  <Router>
    <ThemeProvider theme={theme}>
      <ContextProviders>{props.children}</ContextProviders>
    </ThemeProvider>
  </Router>
)

const App = () => (
  <Providers>
    <React.Suspense fallback={<FallbackWithSplashHide />}>
      <Stage2 />
    </React.Suspense>
  </Providers>
)

const container = document.getElementById("app")
if (container) {
  const root = createRoot(container)
  root.render(<App />)
}

// Hot Module Replacement
if (import.meta.hot) {
  import.meta.hot.accept()
}
