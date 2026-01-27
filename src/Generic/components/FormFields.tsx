import React from "react"
import IconButton from "@mui/material/IconButton"
import { InputProps } from "@mui/material/Input"
import InputAdornment from "@mui/material/InputAdornment"
import TextField, { OutlinedTextFieldProps, TextFieldProps } from "@mui/material/TextField"
import { makeStyles } from "~Generic/lib/makeStyles"
import useMediaQuery from "@mui/material/useMediaQuery"
import SearchIcon from "@mui/icons-material/Search"
import { trackError } from "~App/contexts/notifications"
import QRImportDialog from "~Generic/components/QRImport"
import QRReaderIcon from "~Icons/components/QRReader"

const desktopQRIconStyle: React.CSSProperties = { fontSize: 20 }
const mobileQRIconStyle: React.CSSProperties = {}

interface Props {
  onScan: (data: string) => void
}

export const QRReader = React.memo(function QRReader(props: Props) {
  const { onScan } = props
  const isTouchScreen = useMediaQuery("(hover: none)")
  const [isQRReaderOpen, setQRReaderOpen] = React.useState(false)
  const closeQRReader = React.useCallback(() => setQRReaderOpen(false), [])
  const openQRReader = React.useCallback(() => setQRReaderOpen(true), [])

  const handleQRScan = React.useCallback(
    (data: string | null) => {
      if (data) {
        onScan(data)
        closeQRReader()
      }
    },
    [closeQRReader, onScan]
  )

  return (
    <>
      <IconButton onClick={openQRReader} tabIndex={99}>
        <QRReaderIcon style={isTouchScreen ? mobileQRIconStyle : desktopQRIconStyle} />
      </IconButton>
      <QRImportDialog open={isQRReaderOpen} onClose={closeQRReader} onError={trackError} onScan={handleQRScan} />
    </>
  )
})

type PriceInputProps = TextFieldProps & {
  assetCode: React.ReactNode
  assetStyle?: React.CSSProperties
  readOnly?: boolean
}

export const PriceInput = React.memo(function PriceInput(props: PriceInputProps) {
  const { assetCode, assetStyle, readOnly, disableUnderline, ...textfieldProps } = props
  const InputField = readOnly ? ReadOnlyTextfield : TextField

  const inputProps = {
    endAdornment: (
      <InputAdornment
        disableTypography
        position="end"
        style={{
          pointerEvents: typeof assetCode === "string" ? "none" : undefined,
          ...assetStyle
        }}
      >
        {assetCode}
      </InputAdornment>
    ),
    ...(disableUnderline !== undefined && !readOnly ? { disableUnderline } : {}),
    ...textfieldProps.InputProps
  }

  return (
    <InputField
      {...textfieldProps}
      {...(readOnly ? { disableUnderline } : {})}
      inputProps={{
        pattern: "[0-9]*",
        inputMode: "decimal"
      }}
      InputProps={inputProps}
      style={{
        pointerEvents: props.readOnly ? "none" : undefined,
        ...textfieldProps.style
      }}
    />
  )
})

const useReadOnlyTextfieldStyles = makeStyles({
  root: {
    "&:focus": {
      outline: "none"
    },
    "&&, && > div": {
      color: "inherit"
    }
  }
})

type ReadOnlyTextfieldProps = TextFieldProps & {
  disableUnderline?: boolean
  multiline?: boolean
}

export const ReadOnlyTextfield = React.memo(function ReadOnlyTextfield(props: ReadOnlyTextfieldProps) {
  const { disableUnderline, multiline, ...textfieldProps } = props
  const classes = useReadOnlyTextfieldStyles()

  // tslint:disable-next-line no-shadowed-variable
  const InputProps: InputProps = {
    disableUnderline: disableUnderline === false ? false : true,
    multiline,
    disabled: true,
    readOnly: true,
    ...props.InputProps
  }
  return (
    <TextField
      {...textfieldProps}
      className={`${classes.root} ${props.className || ""}`}
      tabIndex={-1}
      InputProps={InputProps}
    />
  )
})

export const SearchField = React.memo(function SearchField(props: Omit<OutlinedTextFieldProps, "variant">) {
  return (
    <TextField
      fullWidth
      variant="outlined"
      {...props}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <SearchIcon />
          </InputAdornment>
        ),
        ...props.InputProps
      }}
    />
  )
})
