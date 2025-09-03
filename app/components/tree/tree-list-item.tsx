import React from "react"
import { Focusable } from "./focus-context"
// import { Selectable } from "./tree-selection.client"

export function ListItem(props: { children: React.ReactNode }) {
  let children = React.Children.toArray(props.children)
  const first = children[0]
  if (typeof first !== "string") {
    return <li>{children}</li>
  }
  const res = first.match(/!focus\((.*)\)/)
  if (!res || !res[1]) {
    return <li>{children}</li>
  }
  children[0] = first.slice(res[0].length)
  children = children.filter((c) => {
    if (typeof c === "string") {
      return c.trim().length > 0
    }
    return true
  })
  console.log("parse focus:", res[1])
  let last = children.length > 0 ? children[children.length - 1] : null
  const isList =
    React.isValidElement(last) && (last.type === "ul" || last.type === "ol")

  const content = isList ? children.slice(0, -1) : children
  const listChild = isList ? last : null
  return (
    <Focusable>
      <li data-focus={res[1]}>
        <span className="hover:bg-zinc-700 block w-full cursor-pointer">
          {content}
        </span>
        {listChild}
      </li>
    </Focusable>
  )
}
