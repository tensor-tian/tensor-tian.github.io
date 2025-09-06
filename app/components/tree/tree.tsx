import React from "react"

import { BlockType, HighlightedCodeType, parseTreeProps } from "./block"
import { FocusProvider, TabsFocused } from "./focus-context"
import { cn, maxHeight } from "@/lib/utils"

export async function Tree(props: any) {
  const { left, right } = await parseTreeProps(props)
  const h = maxHeight(props.className)
  const { contents, codes } = right
  if (!left.children) {
    return <div>Loading...</div>
  }
  const tabs: (BlockType | HighlightedCodeType)[] = codes ? [...codes] : []
  if (contents && contents.length > 0) {
    tabs.push(...contents)
  }
  return (
    <div>
      {props.children}
      <FocusProvider className={cn("flex ", props.className)}>
        <div className="flex-1 mt-4 ml-2 mr-2 overflow-y-auto">
          {left.children}
        </div>
        <TabsFocused tabs={tabs} height={h} />
      </FocusProvider>
    </div>
  )
}
