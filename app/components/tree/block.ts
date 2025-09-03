import { z } from "zod"
import { Block, CodeBlock, parseProps } from "codehike/blocks"

export const CodeBlockFromFile = CodeBlock.extend({
  lineRanges: z.array(
    z.object({
      from: z.number(),
      to: z.number(),
    }),
  ),
})

export type CodeBlockType = z.infer<typeof CodeBlockFromFile>

const LinesReg = /!lines\((.*?)\)/
export function transformCode(
  code: z.infer<typeof CodeBlock> | undefined,
  ctx: z.RefinementCtx,
): CodeBlockType | undefined {
  if (!code) {
    return
  }
  try {
    let meta = code.meta
    let lineRanges: CodeBlockType["lineRanges"] = []
    const ret = meta.match(LinesReg)
    if (ret && ret[1].length > 0) {
      lineRanges = ret[1].split(",").map((r) => {
        if (r.length == 0) {
          return { from: 0, to: 0 }
        }
        return r
          .split(":")
          .map((x) => parseInt(x, 10))
          .reduce(
            (prev, cur) => {
              prev.to = cur
              if (prev.from == -1) {
                prev.from = cur
              }
              return prev
            },
            { from: -1, to: -1 },
          )
      })
      meta = meta.slice(ret[0].length).trim()
    }
    let value = code.value
    if (lineRanges.length > 0) {
      let j = 0
      let lineNumber = lineRanges[0].from
      value = value
        .split("\n")
        .reduce((prev, cur) => {
          if (
            lineRanges[j].from <= lineNumber &&
            lineNumber <= lineRanges[j].to
          ) {
            prev.push(cur)
            if (lineNumber == lineRanges[j].to) {
              j++
            }
          }
          lineNumber++
          return prev
        }, [] as string[])
        .join("\n")
    } else {
      lineRanges[0] = {
        from: 1,
        to: value.split("\n").length,
      }
    }

    return {
      value,
      meta,
      lang: code.lang,
      lineRanges,
    }
  } catch (e) {
    ctx.addIssue({
      code: "custom",
      message: "解析 !lines 指令失败",
    })
    console.error("code:", code)
  }
}
