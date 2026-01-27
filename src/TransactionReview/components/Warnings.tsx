import ListItem from "@mui/material/ListItem"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import WarningIcon from "@mui/icons-material/Warning"
import React from "react"
import { useTranslation } from "react-i18next"
import { warningColor } from "~App/theme"

interface WarningProps {
  primary: React.ReactNode
  secondary?: React.ReactNode
  style?: React.CSSProperties
}

const Warning = React.memo(function Warning(props: WarningProps) {
  return (
    <ListItem component="div" style={{ background: warningColor, marginBottom: 16, ...props.style }}>
      <ListItemIcon style={{ minWidth: 40 }}>
        <WarningIcon />
      </ListItemIcon>
      <ListItemText primary={props.primary} secondary={props.secondary} />
    </ListItem>
  )
})

export function AccountCreationWarning() {
  const { t } = useTranslation()
  return (
    <Warning
      primary={t("account.transaction-review.account-creation-warning.primary")}
      secondary={t("account.transaction-review.account-creation-warning.secondary")}
    />
  )
}

export function AddingSignerWarning() {
  const { t } = useTranslation()
  return (
    <Warning
      primary={t("account.transaction-review.add-signer-warning.primary")}
      secondary={t("account.transaction-review.add-signer-warning.secondary")}
    />
  )
}

export function DangerousTransactionWarning() {
  const { t } = useTranslation()
  return (
    <Warning
      primary={t("account.transaction-review.dangerous-transaction-warning.primary")}
      secondary={t("account.transaction-review.dangerous-transaction-warning.secondary")}
    />
  )
}
