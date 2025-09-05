import { RawCode, Inline, highlight } from "codehike/code"
import { theme } from "./config"
import { LLRBTree } from "./tree/LLRBTree"
import { LLRBTreeViz } from "./tree/LLRBTViz"
import { FaLongArrowAltRight } from "react-icons/fa"
const PrefixRBTSerialized = "rbt_serialized"
const PrefixRBT = "rbt"
export async function InlineCode({ codeblock }: { codeblock: RawCode }) {
  if (codeblock.lang.startsWith(PrefixRBTSerialized)) {
    const title = codeblock.lang.slice(PrefixRBTSerialized.length + 1) || ""
    const treeList = codeblock.value.split(":")
    if (treeList.length === 1) {
      return (
        <span className="inline-block relative pb-4">
          {drawRBTSerialized(treeList[0])}
          <span className="text-center block absolute text-xs w-full bg-zinc-800">
            {title}
          </span>
        </span>
      )
    } else if (treeList.length === 3) {
      return (
        <span className="inline-block">
          <span className="flex flex-col items-start">
            <span className="flex relative bg-zinc-800 pb-4">
              <span>{drawRBTSerialized(treeList[0])}</span>
              <span className="w-6 flex items-center justify-center bg-zinc-800">
                <FaLongArrowAltRight size={20} />
              </span>
              <span>{drawRBTSerialized(treeList[2])}</span>
              <span className="text-center absolute bottom-0  left-0  text-xs bg-zinc-800 w-full">
                {title}
              </span>
            </span>
          </span>
        </span>
      )
    }
  } else if (codeblock.lang.startsWith(PrefixRBT)) {
    const title = codeblock.lang.slice(PrefixRBT.length + 1) || ""
    const tree = LLRBTree.fromList(codeblock.value)
    return (
      <span className="inline-block pb-4 relative">
        <LLRBTreeViz tree={tree} className="block" />
        <span className="text-center block absolute bottom-0 text-xs w-full bg-zinc-800">
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

function drawRBTSerialized(data: string) {
  const tree = LLRBTree.deserialize(data)
  return <LLRBTreeViz tree={tree} className="block" />
}
