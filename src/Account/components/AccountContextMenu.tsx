import React from "react"
import { useTranslation } from "react-i18next"
import Divider from "@mui/material/Divider"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import { makeStyles } from "~Generic/lib/makeStyles"
import CallMadeIcon from "@mui/icons-material/CallMade"
import CallReceivedIcon from "@mui/icons-material/CallReceived"
import ListIcon from "@mui/icons-material/List"
import MoneyIcon from "@mui/icons-material/AttachMoney"
import SettingsIcon from "@mui/icons-material/Settings"
import SwapHorizIcon from "@mui/icons-material/SwapHoriz"
import { Account } from "~App/contexts/accounts"
import { SettingsContextType } from "~App/contexts/settings"
import { useLiveAccountData } from "~Generic/hooks/stellar-subscriptions"
import { useIsMobile } from "~Generic/hooks/userinterface"
import ContextMenu, { AnchorRenderProps } from "~Generic/components/ContextMenu"

const useContextMenuItemStyles = makeStyles({
  disabled: {
    opacity: "1 !important" as any,

    "& > *": {
      opacity: "0.5 !important" as any
    }
  },
  icon: {
    flex: "0 0 24px",
    minWidth: 24,
    marginRight: 24
  }
})

interface ItemProps {
  disabled?: boolean
  hidden?: boolean
  icon: React.ReactElement<any>
  label: string
  onClick: () => void
}

const AccountContextMenuItem = React.memo(
  React.forwardRef((props: ItemProps, ref) => {
    const classes = useContextMenuItemStyles()

    if (props.hidden) {
      return null
    }
    return (
      <MenuItem className={props.disabled ? classes.disabled : ""} disabled={props.disabled} onClick={props.onClick}>
        <ListItemIcon className={classes.icon}>{props.icon}</ListItemIcon>
        <ListItemText ref={ref}>{props.label}</ListItemText>
      </MenuItem>
    )
  })
)

interface MenuProps {
  account: Account
  children: (anchorProps: AnchorRenderProps) => React.ReactNode
  onAccountSettings?: () => void
  onAccountTransactions?: () => void
  onDeposit?: () => void
  onManageAssets?: () => void
  onPurchaseLumens?: () => void
  onTrade?: () => void
  onWithdraw?: () => void
  settings: SettingsContextType
  showingSettings: boolean
}

function LiveAccountContextMenuItems(
  props: MenuProps & { closeAndCall: (fn: (() => void) | undefined) => () => void }
) {
  const { closeAndCall } = props

  const accountData = useLiveAccountData(props.account.accountID, props.account.testnet)
  const isFunded = accountData.balances.length > 0
  const isSigner = accountData.signers.some(signer => signer.key === props.account.publicKey)
  const activated = isFunded && isSigner
  const { t } = useTranslation()

  return (
    <>
      <AccountContextMenuItem
        disabled={!activated || !props.onTrade}
        icon={<SwapHorizIcon style={{ transform: "scale(1.2)" }} />}
        label={t("account.context-menu.trade.label")}
        onClick={closeAndCall(props.onTrade)}
      />
      <AccountContextMenuItem
        disabled={!isSigner || !props.onDeposit}
        icon={<CallReceivedIcon />}
        label={t("account.context-menu.deposit.label")}
        onClick={closeAndCall(accountData.balances.length > 1 ? props.onDeposit : props.onPurchaseLumens)}
      />
      <AccountContextMenuItem
        disabled={!activated || !props.onWithdraw}
        icon={<CallMadeIcon />}
        label={t("account.context-menu.withdraw.label")}
        onClick={closeAndCall(props.onWithdraw)}
      />
      <Divider />
      <AccountContextMenuItem
        disabled={!activated || !props.onManageAssets}
        icon={<MoneyIcon />}
        label={t("account.context-menu.assets-and-balances.label")}
        onClick={closeAndCall(props.onManageAssets)}
      />
    </>
  )
}

function AccountContextMenu(props: MenuProps) {
  const isSmallScreen = useIsMobile()
  const { t } = useTranslation()

  return (
    <ContextMenu
      anchor={props.children}
      menu={({ anchorEl, open, onClose, closeAndCall }) => (
        <Menu
          anchorEl={isSmallScreen ? document.body : anchorEl || undefined}
          disableAutoFocusItem={isSmallScreen}
          onClose={onClose}
          open={open}
        >
          <React.Suspense fallback={null}>
            <LiveAccountContextMenuItems closeAndCall={closeAndCall} {...props} />
          </React.Suspense>
          {props.showingSettings ? (
            <AccountContextMenuItem
              disabled={!props.onAccountTransactions}
              icon={<ListIcon />}
              label={t("account.context-menu.transactions.label")}
              onClick={closeAndCall(props.onAccountTransactions)}
            />
          ) : (
            <AccountContextMenuItem
              disabled={!props.onAccountSettings}
              icon={<SettingsIcon />}
              label={t("account.context-menu.account-settings.label")}
              onClick={closeAndCall(props.onAccountSettings)}
            />
          )}
        </Menu>
      )}
    />
  )
}

export default React.memo(AccountContextMenu)
