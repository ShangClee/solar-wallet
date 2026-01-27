import React from "react"
import Snackbar, { SnackbarOrigin } from "@mui/material/Snackbar"
import SnackbarContent from "@mui/material/SnackbarContent"
import { makeStyles } from "~Generic/lib/makeStyles"
import CheckIcon from "@mui/icons-material/CheckCircle"
import ErrorIcon from "@mui/icons-material/Error"
import InfoIcon from "@mui/icons-material/Info"
import OfflineBoltIcon from "@mui/icons-material/OfflineBolt"
import { blue, green, grey } from "@mui/material/colors"
import { Notification as NotificationModel, NotificationType } from "~App/contexts/notifications"
import theme from "~App/theme"

const icons: { [key in NotificationType]: React.ComponentType<any> } = {
  connection: OfflineBoltIcon,
  error: ErrorIcon,
  info: InfoIcon,
  success: CheckIcon
}

const useNotificationStyles = makeStyles({
  clickable: {
    cursor: "pointer"
  },
  connection: {
    backgroundColor: grey["500"]
  },
  error: {
    backgroundColor: theme.palette.error.dark
  },
  info: {
    backgroundColor: blue["500"]
  },
  success: {
    backgroundColor: green["500"]
  },
  icon: {
    fontSize: 20,
    opacity: 0.9,
    marginRight: theme.spacing(1)
  },
  message: {
    alignItems: "center",
    display: "flex",
    overflow: "hidden",

    [theme.breakpoints.down(600)]: {
      width: "90vw"
    }
  },
  messageText: {
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap"
  }
})

interface NotificationProps {
  anchorOrigin?: SnackbarOrigin
  autoHideDuration?: number
  contentStyle?: React.CSSProperties
  icon?: React.ComponentType<{ className: string }>
  message: string
  type: NotificationType
  open?: boolean
  onClick?: () => void
  onClose?: () => void
  style?: React.CSSProperties
}

function Notification(props: NotificationProps) {
  const { open = true } = props
  const classes = useNotificationStyles(props)

  const Icon = props.icon || icons[props.type]
  const contentClassnames: { [key in NotificationType]: string } = {
    connection: classes.connection,
    error: classes.error,
    info: classes.info,
    success: classes.success
  }

  return (
    <Snackbar
      anchorOrigin={props.anchorOrigin}
      autoHideDuration={props.autoHideDuration}
      className={props.onClick ? classes.clickable : undefined}
      open={open}
      onClick={props.onClick}
      onClose={props.onClose}
      style={props.style}
    >
      <SnackbarContent
        classes={{
          root: contentClassnames[props.type],
          message: classes.message
        }}
        message={
          <>
            <Icon className={classes.icon} />
            <span className={classes.messageText}>{props.message}</span>
          </>
        }
        style={props.contentStyle}
      />
    </Snackbar>
  )
}

export default React.memo(Notification)
