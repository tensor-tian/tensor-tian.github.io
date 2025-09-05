"use client"
import { CodeContext } from "../tree/code.client"
import { useContext } from "react"

export function LineNumberClient({ ln }: { ln: number }) {
  const lineRanges = useContext(CodeContext)
  return <>{calcLineNumber(ln, lineRanges)}</>
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
