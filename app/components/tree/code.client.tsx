"use client"
import React from "react"
import { Code as CodeSSC } from "./code"
import { HighlightedCodeType, Range } from "./block"
import { useFocusRange } from "./focus-context"

export type CodeProps = {
  hlCode: HighlightedCodeType
  height?: number
  tabIndex?: number
}
export const CodeContext = React.createContext<Range[]>([])

export function Code(props: CodeProps) {
  const focusRange = useFocusRange()
  return (
    <CodeContext.Provider value={props.hlCode.lineRanges}>
      <CodeSSC {...props} focusRange={focusRange} />
    </CodeContext.Provider>
  )
}
