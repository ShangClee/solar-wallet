import React from "react"
import { TransitionProps } from "@mui/material/transitions/transition"
import Slide from "@mui/material/Slide"

export const SlideUpTransition = React.forwardRef((props: TransitionProps, ref) => (
  <Slide direction="up" ref={ref} {...props} />
))

export const SlideLeftTransition = React.forwardRef((props: TransitionProps, ref) => (
  <Slide direction="left" ref={ref} {...props} />
))
