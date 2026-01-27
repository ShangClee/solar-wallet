import React from "react"
import { useTranslation } from "react-i18next"
import Divider from "@mui/material/Divider"
import FormControlLabel from "@mui/material/FormControlLabel"
import IconButton from "@mui/material/IconButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import { makeStyles } from "~Generic/lib/makeStyles"
import AddIcon from "@mui/icons-material/Add"
import InfoIcon from "@mui/icons-material/Info"
import MenuIcon from "@mui/icons-material/Menu"
import SettingsIcon from "@mui/icons-material/Settings"
import Switch from "@mui/material/Switch"
import Tooltip from "@mui/material/Tooltip"
import useMediaQuery from "@mui/material/useMediaQuery"
import UpdateIcon from "@mui/icons-material/SystemUpdateAlt"
import DialogBody from "~Layout/components/DialogBody"
import { Box, VerticalLayout } from "~Layout/components/Box"
import { Section } from "~Layout/components/Page"
import MainTitle from "~Generic/components/MainTitle"
import { useRouter } from "~Generic/hooks/userinterface"
import getUpdater from "~Platform/updater"
import AppNotificationPermission from "~Toasts/components/AppNotificationPermission"
import { AccountsContext } from "../contexts/accounts"
import { NotificationsContext, trackError } from "../contexts/notifications"
import { SettingsContext } from "../contexts/settings"
import * as routes from "../routes"
import AccountList from "./AccountList"
import TermsAndConditions from "./TermsAndConditionsDialog"
import pkg from "../../../package.json"

const useStyles = makeStyles({
  "@keyframes glowing": {
    "0%": { filter: "drop-shadow(0 0 30px #ffffff)" },
    "50%": { filter: "drop-shadow(0 0 0px #ffffff)" },
    "100%": { filter: "drop-shadow(0 0 30px #ffffff)" }
  },

  icon: {
    animation: "$glowing 5000ms infinite"
  },
  menuIcon: {
    flex: "0 0 24px",
    minWidth: 24,
    marginRight: 16
  },
  menuItem: {
    minWidth: 200
  },
  versionText: {
    opacity: 0.6,
    fontSize: "0.85em",
    padding: "8px 16px"
  }
})

function AllAccountsPage() {
  const { accounts, networkSwitch, toggleNetwork } = React.useContext(AccountsContext)
  const router = useRouter()
  const settings = React.useContext(SettingsContext)
  const { showNotification } = React.useContext(NotificationsContext)
  const testnetAccounts = React.useMemo(() => accounts.filter(account => account.testnet), [accounts])
  const [isUpdateInProgress, setUpdateInProgress] = React.useState(false)
  const [menuAnchorEl, setMenuAnchorEl] = React.useState<HTMLElement | null>(null)
  const { t } = useTranslation()

  const styles = useStyles()
  const isWidthMax450 = useMediaQuery("(max-width:450px)")
  const isMenuOpen = Boolean(menuAnchorEl)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setMenuAnchorEl(null)
  }

  const handleMenuItemClick = (action: () => void) => {
    handleMenuClose()
    action()
  }

  const updater = getUpdater()

  const startUpdate = React.useCallback(async () => {
    if (settings.updateAvailable && !updater.isUpdateStarted() && !updater.isUpdateDownloaded()) {
      try {
        showNotification("info", t("app.all-accounts.update.notification.start"))
        setUpdateInProgress(true)
        await updater.startUpdate()
        showNotification("success", t("app.all-accounts.update.notification.success"))
      } catch (error) {
        trackError(error)
      } finally {
        setUpdateInProgress(false)
      }
    }
  }, [settings.updateAvailable, showNotification, updater, t])

  const updateButton = (
    <Tooltip title={t("app.all-accounts.update.tooltip")}>
      <IconButton
        onClick={startUpdate}
        color="secondary"
        style={{ marginLeft: isWidthMax450 ? 0 : 8, marginRight: -12, color: "inherit" }}
      >
        <UpdateIcon className={styles.icon}></UpdateIcon>
      </IconButton>
    </Tooltip>
  )

  const networkSwitchButton = (
    <FormControlLabel
      control={<Switch checked={networkSwitch === "testnet"} color="secondary" onChange={toggleNetwork} />}
      label={t("app.all-accounts.switch.label")}
      style={{ marginRight: 0 }}
    />
  )

  const headerContent = React.useMemo(
    () => (
      <MainTitle
        title={networkSwitch === "testnet" ? t("app.all-accounts.title.testnet") : t("app.all-accounts.title.mainnet")}
        titleColor="inherit"
        titleStyle={isWidthMax450 ? { marginRight: 0 } : {}}
        hideBackButton
        onBack={() => undefined}
        actions={
          <Box style={{ marginLeft: "auto" }}>
            {settings.showTestnet || networkSwitch === "testnet" || testnetAccounts.length > 0
              ? networkSwitchButton
              : null}
            {settings.updateAvailable &&
            !isUpdateInProgress &&
            !updater.isUpdateStarted() &&
            !updater.isUpdateDownloaded()
              ? updateButton
              : null}
            <IconButton
              onClick={handleMenuOpen}
              style={{ marginLeft: isWidthMax450 ? 0 : 8, marginRight: -12, color: "inherit" }}
              aria-label="menu"
              aria-controls="main-menu"
              aria-haspopup="true"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="main-menu"
              anchorEl={menuAnchorEl}
              open={isMenuOpen}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right"
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right"
              }}
            >
              <MenuItem
                className={styles.menuItem}
                onClick={() =>
                  handleMenuItemClick(() => router.history.push(routes.newAccount(networkSwitch === "testnet")))
                }
              >
                <ListItemIcon className={styles.menuIcon}>
                  <AddIcon />
                </ListItemIcon>
                <ListItemText>{t("app.all-accounts.menu.create-account")}</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem
                className={styles.menuItem}
                onClick={() => handleMenuItemClick(() => router.history.push(routes.settings()))}
              >
                <ListItemIcon className={styles.menuIcon}>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText>{t("app.all-accounts.menu.settings")}</ListItemText>
              </MenuItem>
              <MenuItem className={styles.menuItem} disabled>
                <ListItemIcon className={styles.menuIcon}>
                  <InfoIcon />
                </ListItemIcon>
                <ListItemText>{t("app.all-accounts.menu.about")}</ListItemText>
              </MenuItem>
              <Divider />
              <div className={styles.versionText}>v{pkg.version}</div>
            </Menu>
          </Box>
        }
      />
    ),
    [
      handleMenuClose,
      handleMenuOpen,
      isMenuOpen,
      isUpdateInProgress,
      isWidthMax450,
      menuAnchorEl,
      networkSwitch,
      networkSwitchButton,
      router.history,
      settings.showTestnet,
      settings.updateAvailable,
      styles.menuIcon,
      styles.menuItem,
      styles.versionText,
      testnetAccounts.length,
      updater,
      updateButton,
      t
    ]
  )

  return (
    <Section bottom brandColored noPadding style={{ height: "100vh" }}>
      <DialogBody backgroundColor="unset" top={headerContent}>
        <VerticalLayout justifyContent="space-between" grow margin="16px 0 0">
          <AccountList
            accounts={accounts}
            testnet={networkSwitch === "testnet"}
            onCreatePubnetAccount={() => router.history.push(routes.newAccount(false))}
            onCreateTestnetAccount={() => router.history.push(routes.newAccount(true))}
          />
          <AppNotificationPermission />
        </VerticalLayout>
      </DialogBody>
      <TermsAndConditions
        // Do not render T&Cs while loading settings; 99.9% chance we will unmount it immediately
        open={settings.initialized && !settings.agreedToTermsAt}
        onConfirm={settings.confirmToC}
      />
    </Section>
  )
}

export default React.memo(AllAccountsPage)
