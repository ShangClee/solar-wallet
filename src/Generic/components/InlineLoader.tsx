import React from "react"
import Fade from "@mui/material/Fade"
import LinearProgress from "@mui/material/LinearProgress"

const InlineLoader = () => {
  return (
    <Fade appear in timeout={1500}>
      <LinearProgress style={{ display: "inline-block", width: 250, margin: "8px 0" }} />
    </Fade>
  )
}

export default InlineLoader
