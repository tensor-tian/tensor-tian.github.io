"use client"
import {
  highlight,
  RawCode,
  Pre,
  HighlightedCode,
  CodeAnnotation,
  BlockAnnotation,
  Inline,
} from "codehike/code"
import { HoverContainer } from "../hover-container"
import { theme } from "../config"
import { CopyButton } from "../copy-button"
import { mark, hover, lineNumbers, focus } from "../annotations"
import React, { useCallback, useEffect, useState } from "react"
import { TreeContext } from "./context"
import { wordWrap } from "../annotations/word-wrap"

export function Tree(props: any) {
  const [code, setCode] = useState<HighlightedCode | null>(null)
  const [offset, setOffset] = useState(0)
  const onClick = useCallback(
    (e: React.MouseEvent<HTMLLIElement>) => {
      e.stopPropagation()
      const ranges = e.currentTarget.dataset.focus
      if (ranges && ranges.length > 0) {
        const annotations = genFocusAnnotation(ranges, offset)
        if (code !== null) {
          setCode({ ...code, annotations })
        }
      }
    },
    [code, offset],
  )
  const codeblock = props.tree?.code
  useEffect(() => {
    highlight(codeblock, theme).then((code) => {
      setCode(code)
      const ret = code.meta?.match(/!offset\((\d+)\)/)
      if (ret && ret[1]) {
        setOffset(parseInt(ret[1], 10) - 1)
      }
    })
  }, [codeblock])
  const onMouseLeave = useCallback(() => {
    if (code !== null && code.annotations && code.annotations.length > 0) {
      setCode({ ...code, annotations: [] })
    }
  }, [code])
  if (!props.tree || !props.tree.children) {
    return <div>Loading...</div>
  }
  return (
    <HoverContainer>
      <TreeContext.Provider value={{ onClick, offset }}>
        <div className="flex" onMouseLeave={onMouseLeave}>
          <div className="flex-1 mt-4 ml-2 mr-2">{props.tree.children}</div>
          <div className="w-[40vw] max-w-xl">
            {code && <Code code={code} />}
          </div>
        </div>
      </TreeContext.Provider>
    </HoverContainer>
  )
}

function Code({ code }: { code: HighlightedCode }) {
  return (
    <div className="relative">
      <CopyButton text={code.code} />
      <Pre
        code={code}
        handlers={[hover, lineNumbers, focus, wordWrap]}
        className="border border-zinc-800"
      />
    </div>
  )
}

function genFocusAnnotation(
  rangeStr: string,
  offset: number,
): BlockAnnotation[] {
  return rangeStr.split(",").map((r) =>
    r
      .split(":")
      .map((x) => parseInt(x, 10))
      .reduce(
        (prev, cur) => {
          prev.toLineNumber = cur - offset
          if (prev.fromLineNumber === -1) {
            prev.fromLineNumber = cur - offset
          }
          return prev
        },
        {
          name: "focus",
          query: "",
          fromLineNumber: -1,
          toLineNumber: -1,
        } as BlockAnnotation,
      ),
  )
}
