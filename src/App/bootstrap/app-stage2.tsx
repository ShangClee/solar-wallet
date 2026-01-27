import React from "react"
import { Navigate, Route, Routes, useParams } from "react-router-dom"
import AccountPage from "~Account/components/AccountView"
import SettingsPage from "~AppSettings/components/AppSettingsView"
import { MainErrorBoundary } from "~Generic/components/ErrorBoundaries"
import ViewLoading from "~Generic/components/ViewLoading"
import { VerticalLayout } from "~Layout/components/Box"
import { appIsLoaded } from "~SplashScreen/splash-screen"
import ConnectionErrorListener from "~Toasts/components/ConnectionErrorListener"
import NotificationContainer from "~Toasts/components/NotificationContainer"
import AllAccountsPage from "../components/AccountListView"
import AndroidBackButton from "../components/AndroidBackButton"
import DesktopNotifications from "../components/DesktopNotifications"
import LinkHandler from "../components/LinkHandler"

const CreateMainnetAccount = () => (
  <React.Suspense fallback={null}>
    <AccountPage accountCreation="pubnet" />
  </React.Suspense>
)

const CreateTestnetAccount = () => (
  <React.Suspense fallback={null}>
    <AccountPage accountCreation="testnet" />
  </React.Suspense>
)

const AccountPageWrapper = () => {
  const params = useParams()
  return (
    <React.Suspense fallback={null}>
      <AccountPage accountID={params.id} />
    </React.Suspense>
  )
}

function Stage2() {
  React.useEffect(() => {
    appIsLoaded()
  }, [])
  return (
    <>
      <VerticalLayout height="100%" style={{ WebkitOverflowScrolling: "touch" }}>
        <VerticalLayout height="100%" grow overflowY="hidden" style={{ minHeight: "50vh" }}>
          <MainErrorBoundary>
            <React.Suspense fallback={<ViewLoading style={{ minHeight: "50vh" }} />}>
              <Routes>
                <Route path="/" element={<AllAccountsPage />} />
                <Route path="" element={<Navigate to="/" replace />} />

                {[
                  "/account/create/mainnet",
                  "/account/import/mainnet",
                  "/account/join/mainnet",
                  "/account/new/mainnet"
                ].map(path => (
                  <Route key={path} path={path} element={<CreateMainnetAccount />} />
                ))}

                {[
                  "/account/create/testnet",
                  "/account/import/testnet",
                  "/account/join/testnet",
                  "/account/new/testnet"
                ].map(path => (
                  <Route key={path} path={path} element={<CreateTestnetAccount />} />
                ))}

                {["/account/:id/:action/:subaction", "/account/:id/:action", "/account/:id"].map(path => (
                  <Route key={path} path={path} element={<AccountPageWrapper />} />
                ))}

                {["/settings/:action", "/settings"].map(path => (
                  <Route
                    key={path}
                    path={path}
                    element={
                      <React.Suspense fallback={null}>
                        <SettingsPage />
                      </React.Suspense>
                    }
                  />
                ))}
              </Routes>
            </React.Suspense>
          </MainErrorBoundary>
        </VerticalLayout>
      </VerticalLayout>
      <React.Suspense fallback={null}>
        <NotificationContainer />
        <ConnectionErrorListener />
      </React.Suspense>
      <React.Suspense fallback={null}>
        {/* Notifications need to come after the -webkit-overflow-scrolling element on iOS */}
        <DesktopNotifications />
      </React.Suspense>
      {process.env.PLATFORM === "android" ? <AndroidBackButton /> : null}
      {process.env.PLATFORM === "android" || process.env.PLATFORM === "ios" ? <LinkHandler /> : null}
    </>
  )
}

export default React.memo(Stage2)
