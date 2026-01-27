import React from "react"
import MaterialList from "@mui/material/List"
import MaterialListItem from "@mui/material/ListItem"
import MaterialListItemText from "@mui/material/ListItemText"
import MaterialListSubheader from "@mui/material/ListSubheader"

const noop = () => undefined

const IconDiv = (props: { children: React.ReactNode }) => {
  const marginSize = 12
  return <div style={{ display: "flex", flexGrow: 0, flexShrink: 0, marginRight: marginSize }}>{props.children}</div>
}

interface ListItemProps {
  primaryText: React.ReactNode
  secondaryText?: React.ReactNode | null
  button?: boolean
  heading?: React.ReactNode | null
  leftIcon?: React.ReactNode | null
  rightIcon?: React.ReactNode | null
  onClick?: React.MouseEventHandler<{}>
  style?: React.CSSProperties
}

const ListItem = (props: ListItemProps) => {
  const content = (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "nowrap",
        justifyContent: "space-between",
        alignItems: "center"
      }}
    >
      {props.leftIcon ? <IconDiv>{props.leftIcon}</IconDiv> : null}
      <div style={{ flexGrow: 1, overflow: "hidden" }}>
        {props.heading ? <div>{props.heading}</div> : null}
        <div>{props.primaryText}</div>
        {props.secondaryText ? <div>{props.secondaryText}</div> : null}
      </div>
      {props.rightIcon ? <IconDiv>{props.rightIcon}</IconDiv> : null}
    </div>
  )
  return (
    <MaterialListItem
      button={(props.button || Boolean(props.onClick)) as any}
      onClick={props.onClick || noop}
      style={props.style}
    >
      <MaterialListItemText primary={content} />
    </MaterialListItem>
  )
}

export { MaterialList as List, MaterialListSubheader as ListSubheader, ListItem }
