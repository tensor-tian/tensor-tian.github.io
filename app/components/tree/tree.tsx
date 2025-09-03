"use client"
import React, { useContext } from "react"
// import { TreeItemDataProvider, TreeContext } from "./tree-selection.client"
import { Code } from "./code"
import { Block, CodeBlock, parseProps } from "codehike/blocks"
import { transformCode } from "./block"
import { FocusContext, FocusProvider, useFocusRange } from "./focus-context"

const TreePropsSchema = Block.extend({
  tree: Block.extend({
    code: CodeBlock.transform(transformCode),
  }),
})
export function Tree(props: any) {
  const { tree } = parseProps(props, TreePropsSchema)
  const code = tree.code
  if (!tree.children) {
    return <div>Loading...</div>
  }
  return (
    <FocusProvider className="flex">
      <div className="flex-1 mt-4 ml-2 mr-2">{props.tree.children}</div>
      <div className="w-[40vw] max-w-xl">
        {code && <Code codeblock={code} />}
      </div>
    </FocusProvider>
  )
}
