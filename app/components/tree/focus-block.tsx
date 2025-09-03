"use client"
import { Focusable } from "./focus-context"
import React from "react"
import { MDXProvider } from "@mdx-js/react"

export function P(props: React.HTMLAttributes<HTMLParagraphElement>) {
  let children = React.Children.toArray(props.children)
  const first = children[0]
  if (typeof first !== "string") {
    return <p>{children}</p>
  }
  const res = first.match(/!focus\((.*)\)/)
  console.log("p:", res)
  if (!res || !res[1]) {
    return <p>{children}</p>
  }
  children[0] = first.slice(res[0].length)
  return (
    <Focusable>
      <p data-focus={res[1]}>{children}</p>
    </Focusable>
  )
}

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
  // 最后一个元素是 ol 或者 ul 时，单独提出来
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
const FocusableComponents = {
  p: P,
  li: ListItem,
}

export function FocusableMDXProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return <MDXProvider components={FocusableComponents}>{children}</MDXProvider>
}
