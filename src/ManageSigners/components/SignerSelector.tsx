import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import Radio from "@mui/material/Radio"
import RadioGroup from "@mui/material/RadioGroup"
import React from "react"
import { useTranslation } from "react-i18next"
import { Horizon } from "stellar-sdk"
import { Account } from "~App/contexts/accounts"
import { Address } from "~Generic/components/PublicKey"

interface SignerSelectorProps {
  accounts: Account[]
  onSelect: (signer: Horizon.AccountSigner) => void
  selected: Horizon.AccountSigner | undefined
  signers: Horizon.AccountSigner[]
  testnet: boolean
}

function SignerSelector(props: SignerSelectorProps) {
  const { t } = useTranslation()
  return (
    <RadioGroup value={props.selected?.key || ""}>
      <List>
        {props.signers.map(signer => (
          <ListItem button key={signer.key} onClick={() => props.onSelect(signer)}>
            <ListItemIcon>
              <Radio edge="start" value={signer.key} />
            </ListItemIcon>
            <ListItemText
              primary={<Address address={signer.key} variant="full" testnet={props.testnet} />}
              secondary={
                props.accounts.some(
                  account => account.publicKey === signer.key && account.testnet === props.testnet
                ) ? (
                  <span>{t("account-settings.manage-signers.signers-editor.list.item.local-key")}</span>
                ) : null
              }
            />
          </ListItem>
        ))}
      </List>
    </RadioGroup>
  )
}

export default React.memo(SignerSelector)
