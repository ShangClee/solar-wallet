import { makeStyles as tssMakeStyles } from "tss-react/mui"

// Shim to provide backward compatibility for MUI v4 makeStyles API using tss-react
// MUI v4: makeStyles(theme => styles)(props) -> classes
// tss-react: makeStyles()((theme) => styles)(props) -> { classes }

export function makeStyles(stylesOrCreator: any) {
  // Use <any> to bypass strict type checks during migration
  const useStylesTss = tssMakeStyles<any>()(stylesOrCreator)

  return function useStyles(props?: any) {
    const { classes } = useStylesTss(props)
    return classes
  }
}
