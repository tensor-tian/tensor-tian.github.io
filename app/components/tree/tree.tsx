"use client"
import React from "react"
import { Code } from "./code"
import { Block, CodeBlock, parseProps } from "codehike/blocks"
import { transformCode } from "./block"
import { FocusProvider } from "./focus-context"

const TreePropsSchema = Block.extend({
  tree: Block.extend({
    code: CodeBlock.transform(transformCode),
  }),
})
export function Tree(props: any) {
  const { tree } = parseProps(props, TreePropsSchema)
  const { code, children } = tree
  if (!children) {
    return <div>Loading...</div>
  }
  return (
    <FocusProvider className="flex">
      <div className="flex-1 mt-4 ml-2 mr-2">{children}</div>
      <div className="w-[40vw] max-w-xl">
        {code && <Code codeblock={code} />}
      </div>
    </FocusProvider>
  )
}
