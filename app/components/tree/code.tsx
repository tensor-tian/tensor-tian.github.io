import { Pre, BlockAnnotation } from "codehike/code"
import { lineNumbers, focus, wordWrap } from "../annotations"
import { CopyButton } from "../copy-button"
import React, { CSSProperties } from "react"
import { HighlightedCodeType, Range } from "./block"

export type CodeProps = {
  hlCode: HighlightedCodeType
  height?: number
  tabIndex?: number
  focusRange: string | undefined
}

export function Code({ hlCode, height, tabIndex, focusRange }: CodeProps) {
  const annotations = genFocusAnnotation(
    hlCode.lineRanges,
    tabIndex,
    focusRange,
  )
  const code = { ...hlCode, annotations }
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
      <Pre
        code={code}
        className="max-h-[70vh] min-h-[18rem] bg-zinc-900 h-full m-0  border-zinc-700 "
        handlers={[lineNumbers, focus, wordWrap]}
        style={style}
      />
    </div>
  )
}

const TabIndexReg = /^@(\d+)/

function genFocusAnnotation(
  lineRanges: Range[],
  tabIndex = 0,
  rangeStr?: string,
): BlockAnnotation[] {
  if (!rangeStr || rangeStr.length === 0) {
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
