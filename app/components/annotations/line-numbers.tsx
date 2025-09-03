"use client"
import { AnnotationHandler, InnerLine } from "codehike/code"
import { CodeContext } from "../tree/code"
import { useContext } from "react"

export const lineNumbers: AnnotationHandler = {
  name: "line-numbers",
  Line: (props) => {
    const width = props.totalLines.toString().length + 1
    const lineRanges = useContext(CodeContext)
    return (
      <div className="flex">
        <span
          className="text-right opacity-50 select-none"
          style={{ minWidth: `${width}ch` }}
        >
          {calcLineNumber(props.lineNumber, lineRanges)}
        </span>
        <InnerLine merge={props} className="flex-1 pl-2" />
      </div>
    )
  },
}

function calcLineNumber(
  ln: number,
  ranges: { from: number; to: number }[],
): number {
  if (ranges.length == 0) {
    return ln
  }
  let n = ln - 1
  for (let i = 0; i < ranges.length; i++) {
    const { from, to } = ranges[i]
    if (n + from <= to) {
      return n + from
    }
    n -= to - from + 1
  }
  return ln
}
