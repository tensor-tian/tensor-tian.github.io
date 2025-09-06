"use client"
import React, { useContext } from "react"
import { Code as CodeSSC } from "./code"
import { HighlightedCodeType, Range } from "./block"
import { FocusContext, useFocusRange } from "./focus-context"

export type CodeProps = {
  hlCode: HighlightedCodeType
  height?: number
  tabIndex?: number
}
export const CodeContext = React.createContext<Range[]>([])

export function Code({ tabIndex, ...rest }: CodeProps) {
  const { focus, tabIndex: activeTabIndex } = useContext(FocusContext)
  const focusRange = activeTabIndex != String(tabIndex) ? "" : focus
  return (
    <CodeContext.Provider value={rest.hlCode.lineRanges}>
      <CodeSSC {...rest} focusRange={focusRange} />
    </CodeContext.Provider>
  )
}
