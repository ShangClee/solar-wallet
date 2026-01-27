import React from "react"
import IconButton from "@mui/material/IconButton"
import InputAdornment from "@mui/material/InputAdornment"
import TextField, { StandardTextFieldProps } from "@mui/material/TextField"
import Visibility from "@mui/icons-material/Visibility"
import VisibilityOff from "@mui/icons-material/VisibilityOff"

function PasswordField(props: Omit<StandardTextFieldProps, "type">) {
  const [showPassword, setShowPassword] = React.useState(false)

  const handleClickShowPassword = React.useCallback(() => {
    setShowPassword(!showPassword)
  }, [showPassword])

  return (
    <TextField
      {...props}
      InputProps={{
        ...props.InputProps,
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={handleClickShowPassword}>
              {showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        )
      }}
      type={showPassword ? "text" : "password"}
    />
  )
}

export default PasswordField
