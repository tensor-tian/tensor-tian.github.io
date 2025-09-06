import { RawCode, Inline, highlight } from "codehike/code"
import { theme } from "./config"
import { LLRBTree } from "./tree/LLRBTree"
import { LLRBTreeViz } from "./tree/LLRBTViz"
import { FaLongArrowAltRight } from "react-icons/fa"
import { ReactNode } from "react"
import { cn } from "@/lib/utils"
const PrefixRBTLevelOrder = "rbt_level"
const PrefixRBTInsertion = "rbt_insert"
const SuffixTitleLeft = "!left"

function parseLang(lang: string) {
  let isRBT = false
  let isLevelOrder = false
  let k = 0
  if (lang.startsWith(PrefixRBTInsertion)) {
    k = PrefixRBTInsertion.length + 1
    isRBT = true
  } else if (lang.startsWith(PrefixRBTLevelOrder)) {
    k = PrefixRBTLevelOrder.length + 1
    isRBT = true
    isLevelOrder = true
  }
  let title = ""
  let size: "m" | "s" = "m"
  let alignLeft = false
  if (!isRBT) {
    return { isRBT, isLevelOrder, title, size, alignLeft }
  }
  const parts = lang.slice(k).split("|")
  alignLeft = parts[0].endsWith(SuffixTitleLeft)
  title = alignLeft ? parts[0].slice(0, -SuffixTitleLeft.length) : parts[0]
  size = parts[1] === "s" ? "s" : "m"
  return { isRBT, isLevelOrder, title, size, alignLeft }
}
/**
 *   _rbt_level|1.黑结点右侧变红!left|s`5::5,null,7|red:rotateLeft(5):7,5|red`_
 * _rbt_insert|title|s`a,b,c,d,e`_
 */
export async function InlineCode({ codeblock }: { codeblock: RawCode }) {
  const { isRBT, isLevelOrder, title, size, alignLeft } = parseLang(
    codeblock.lang,
  )
  if (!isRBT) {
    const code = await highlight(codeblock, theme)
    return (
      <Inline
        code={code}
        style={code.style}
        className="not-prose text-[0.85em] "
      />
    )
  } else if (!isLevelOrder) {
    const tree = LLRBTree.fromList(codeblock.value)
    return (
      <span className="inline-block pb-4 relative">
        <LLRBTreeViz tree={tree} className="block" size={size} />
        <span
          className={
            (cn("block absolute bottom-0 text-xs w-full bg-zinc-950"),
            alignLeft ? "text-left" : "text-center")
          }
        >
          {title}
        </span>
      </span>
    )
  } else {
    const treeList = codeblock.value.split(":")
    const graphs: ReactNode[] = [drawRBTSerialized(treeList[0], size, 0)]
    for (let i = 1; i < treeList.length; i++) {
      if (i % 2 === 1) {
        const w = Math.ceil(7.3 * Math.max(2, treeList[i].length))
        graphs.push(
          <span
            className={cn(
              "flex flex-col w-8 items-center justify-center ",
              `w-[${w}px]`,
            )}
            key={i}
          >
            <span className="flex items-center justify-center bg-zinc-950 text-xs">
              <code>{treeList[i]}</code>
            </span>
            <span className="w-8 flex items-center justify-center bg-zinc-950">
              <FaLongArrowAltRight size={20} />
            </span>
          </span>,
        )
      } else {
        graphs.push(drawRBTSerialized(treeList[i], size, i))
      }
    }
    return (
      <span className="inline-block not-prose">
        <span className="flex flex-col items-start">
          <span className="flex flex-wrap relative bg-zinc-950 pb-4">
            {graphs}
            <span
              className={cn(
                "absolute bottom-0  left-0  text-xs bg-zinc-950 w-full",
                alignLeft ? "text-left pl-2" : "text-center",
              )}
            >
              {title}
            </span>
          </span>
        </span>
      </span>
    )
  }
}

function drawRBTSerialized(data: string, size: "s" | "m", key: number = 0) {
  const tree = LLRBTree.deserialize(data)
  return <LLRBTreeViz tree={tree} className="block" size={size} key={key} />
}
