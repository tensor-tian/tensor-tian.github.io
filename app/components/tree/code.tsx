"use client"
import { Pre, highlight, BlockAnnotation, HighlightedCode } from "codehike/code"
import { lineNumbers, focus, wordWrap } from "../annotations"
import { CopyButton } from "../copy-button"
import React, { CSSProperties, useEffect } from "react"
import { CodeBlockType } from "./block"
import { useFocusRange } from "./focus-context"

type Range = { from: number; to: number }
export const CodeContext = React.createContext<Range[]>([])

export type CodeProps = {
  codeblock: CodeBlockType
  height?: number
  tabIndex?: number
}

type CustomHighlightedCode = HighlightedCode & {
  lineRanges: Range[]
}

export function Code({ codeblock, height, tabIndex }: CodeProps) {
  const [code, setCode] = React.useState<CustomHighlightedCode | null>(null)
  const lineRanges = codeblock.lineRanges
  const focusRange = useFocusRange()
  useEffect(() => {
    highlight(codeblock, "github-dark").then((highlighted) => {
      const lineRanges = codeblock.lineRanges
      const annotations = genFocusAnnotation(focusRange, lineRanges, tabIndex)
      setCode({ ...highlighted, annotations, lineRanges })
    })
  }, [codeblock, focusRange, tabIndex])

  if (!code) {
    return null
  }
  const style: CSSProperties = {}
  if (typeof height === "number" && height - 40 > 0) {
    style.maxHeight = `${height - 50}px`
  }
  return (
    <div className="relative">
      <CopyButton text={code.code} />
      <CodeContext.Provider value={lineRanges}>
        <Pre
          code={code}
          className="max-h-[70vh] min-h-[18rem] bg-zinc-900 h-full m-0  border-zinc-700 "
          handlers={[lineNumbers, focus, wordWrap]}
          style={style}
        />
      </CodeContext.Provider>
    </div>
  )
}

const TabIndexReg = /^@(\d+)/

function genFocusAnnotation(
  rangeStr: string,
  lineRanges: Range[],
  tabIndex = 0,
): BlockAnnotation[] {
  if (rangeStr.length === 0) {
    return []
  }
  const indexRes = rangeStr.match(TabIndexReg)
  let s = 0
  let focusTabIndex = 0
  if (indexRes) {
    s = indexRes[0].length
    focusTabIndex = parseInt(indexRes[1], 10)
  }
  if (focusTabIndex !== tabIndex || rangeStr.charAt(s) !== "#") {
    return []
  }

  const ranges = rangeStr
    .substring(s + 1)
    .split(",")
    .map((r) => r.split(":").map((x) => parseInt(x, 10)))
    .map((r) => (r.length == 2 ? r : [r[0], r[0]]))
  let i = 0
  let offset = 1
  for (let j = 0; j < lineRanges.length && i / 2 < ranges.length; ) {
    const { from, to } = lineRanges[j]
    const k = Math.floor(i / 2)
    const n = ranges[k][i % 2]
    if (from <= n && n <= to) {
      ranges[k][i % 2] = offset + (n - from)
      i++
    } else if (n > to) {
      offset += to - from + 1
      j++
    }
  }
  return ranges.map(([from, to]) => ({
    fromLineNumber: from,
    toLineNumber: to,
    name: "focus",
    query: "",
  }))
}
