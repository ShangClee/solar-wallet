import React from "react"
import { useTranslation } from "react-i18next"
import { useNavigate, useLocation, useParams } from "react-router-dom"
import useMediaQuery from "@mui/material/useMediaQuery"
import { NotificationsContext } from "~App/contexts/notifications"
import * as Clipboard from "~Platform/clipboard"

export const useIsMobile = () => useMediaQuery("(max-width:600px)")
export const useIsSmallMobile = () => useMediaQuery("(max-width:400px)")

export function useClipboard() {
  const { showError, showNotification } = React.useContext(NotificationsContext)
  const { t } = useTranslation()

  return React.useMemo(
    () => ({
      async copyToClipboard(value: string, notificationMessage?: string) {
        try {
          await Clipboard.copyToClipboard(value)
          const message = notificationMessage ? notificationMessage : t("generic.user-interface.copied-to-clipboard")
          showNotification("info", message)
        } catch (error) {
          showError(error)
        }
      }
    }),
    [showError, showNotification, t]
  )
}

export interface RefStateObject {
  element: HTMLElement | null
  update: (element: HTMLElement) => void
}

export function useDialogActions(): RefStateObject {
  const [dialogActions, setDialogActions] = React.useState<HTMLElement | null>(null)
  const actionsRef = React.useMemo(
    () => ({
      element: dialogActions,
      update: setDialogActions
    }),
    [dialogActions]
  )

  return actionsRef
}

export function useRouter<Params extends { [K in keyof Params]?: string } = {}>() {
  const navigate = useNavigate()
  const location = useLocation()
  const params = useParams<Params>()

  return React.useMemo(() => {
    return {
      history: {
        push: (path: string) => navigate(path),
        replace: (path: string) => navigate(path, { replace: true }),
        goBack: () => navigate(-1),
        listen: (_listener: any) => {
          // console.warn("router.history.listen is deprecated. Use useEffect on location instead.")
          return () => {}
        }
      },
      location,
      match: {
        params,
        isExact: true,
        path: location.pathname,
        url: location.pathname
      }
    }
  }, [navigate, location, params])
}
