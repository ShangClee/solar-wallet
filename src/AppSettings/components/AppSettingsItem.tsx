import React from "react"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import { makeStyles } from "~Generic/lib/makeStyles"
import ListItemText from "@mui/material/ListItemText"
import { useIsMobile } from "~Generic/hooks/userinterface"
import { breakpoints } from "~App/theme"

const isMobileDevice = process.env.PLATFORM === "android" || process.env.PLATFORM === "ios"

const useAppSettingsItemStyles = makeStyles({
  caret: {
    color: "rgba(0, 0, 0, 0.35)",
    fontSize: 48,
    justifyContent: "center",
    marginRight: -8,
    width: 48
  },
  icon: {
    fontSize: 28,
    justifyContent: "center",
    marginRight: 4,
    width: 28
  },
  settingsItem: {
    position: "relative",
    padding: "16px 24px",
    background: "#FFFFFF",

    [breakpoints.down(600)]: {
      padding: "16px 12px"
    },

    "&:focus": {
      backgroundColor: "#FFFFFF"
    },
    "&$actionable:hover": {
      backgroundColor: isMobileDevice ? "#FFFFFF" : "rgb(232, 232, 232)"
    },
    "&:not(:first-of-type)": {
      borderTop: "1px solid rgba(230, 230, 230, 1.0)"
    }
  },
  actionable: {}
})

interface AppSettingsItemProps {
  actions?: React.ReactNode
  disabled?: boolean
  icon: React.ReactElement
  primaryText: string
  secondaryText?: string
  style?: React.CSSProperties
  onClick?: () => void
}

function AppSettingsItem(props: AppSettingsItemProps) {
  const classes = useAppSettingsItemStyles()
  const isSmallScreen = useIsMobile()
  const isButton = Boolean(props.onClick)

  const { actions, primaryText, secondaryText, style } = props

  const listItemTextStyle: React.CSSProperties = React.useMemo(
    () => ({
      paddingRight: isSmallScreen ? 0 : undefined
    }),
    [isSmallScreen]
  )

  const className = `${classes.settingsItem} ${props.onClick ? classes.actionable : ""}`

  return (
    <ListItem disablePadding={isButton} className={isButton ? undefined : className} style={style}>
      {isButton ? (
        <ListItemButton className={className} disabled={props.disabled} onClick={props.onClick}>
          <ListItemIcon className={classes.icon}>{props.icon}</ListItemIcon>
          <ListItemText primary={primaryText} secondary={secondaryText} style={listItemTextStyle} />
          {actions}
        </ListItemButton>
      ) : (
        <>
          <ListItemIcon className={classes.icon}>{props.icon}</ListItemIcon>
          <ListItemText primary={primaryText} secondary={secondaryText} style={listItemTextStyle} />
          {actions}
        </>
      )}
    </ListItem>
  )
}

export default AppSettingsItem
