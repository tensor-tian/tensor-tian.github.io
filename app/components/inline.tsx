import { RawCode, Inline, highlight, HighlightedCode } from "codehike/code"
import { theme } from "./config"
import { LLRBTree } from "./tree/LLRBTree"
import { LLRBTreeViz } from "./tree/LLRBTViz"

const PrefixRBTSerialized = "rbt_serialized"
const PrefixRBT = "rbt"
export async function InlineCode({ codeblock }: { codeblock: RawCode }) {
  if (codeblock.lang.startsWith(PrefixRBTSerialized)) {
    const title = codeblock.lang.slice(PrefixRBTSerialized.length + 1) || ""
    const tree = LLRBTree.deserialize(codeblock.value)
    return (
      <span className="inline-block">
        <LLRBTreeViz tree={tree} className="block" />
        <span className="text-center block -translate-y-4 text-xs">
          {title}
        </span>
      </span>
    )
  } else if (codeblock.lang.startsWith(PrefixRBT)) {
    const title = codeblock.lang.slice(PrefixRBT.length + 1) || ""
    const tree = LLRBTree.fromList(codeblock.value)
    return (
      <span className="inline-block">
        <LLRBTreeViz tree={tree} className="block" />
        <span className="text-center block -translate-y-4 text-xs">
          {title}
        </span>
      </span>
    )
  }
  const code = await highlight(codeblock, theme)
  return (
    <Inline
      code={code}
      style={code.style}
      className="not-prose text-[0.85em] "
    />
  )
}
