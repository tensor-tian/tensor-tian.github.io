import { z } from "zod"
import { Block, CodeBlock, parseProps } from "codehike/blocks"
import { highlight, type HighlightedCode } from "codehike/code"
import { theme } from "../config"

export const CodeBlockFromFile = CodeBlock.extend({
  lineRanges: z.array(
    z.object({
      from: z.number(),
      to: z.number(),
    }),
  ),
})
export type Range = { from: number; to: number }
export type CodeBlockType = z.infer<typeof CodeBlockFromFile>
export type BlockType = z.infer<typeof Block>
export type HighlightedCodeType = HighlightedCode & { lineRanges: Range[] }
export type StepType = z.infer<typeof Block> & {
  codes?: HighlightedCodeType[]
}

export const StepsSchema = Block.extend({
  steps: z.array(
    Block.extend({
      codes: z
        .array(CodeBlock)
        .optional()
        .transform((list, ctx) =>
          list
            ? list
                .map((code) => transformCode(code, ctx))
                .filter((code) => Boolean(code))
            : [],
        ),
    }),
  ),
})

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

export async function hl(codeBlock: CodeBlockType | undefined) {
  if (!codeBlock) return
  const code = (await highlight(codeBlock, theme)) as HighlightedCodeType
  return code
}

export async function parseSteps(props: any): Promise<StepType[]> {
  const { steps } = parseProps(props, StepsSchema)
  const stepsWithHLCode = (await Promise.all(
    steps.map(async (step) => {
      if (Array.isArray(step.codes)) {
        const codes = await Promise.all(
          step.codes.map(async (c) => {
            if (c) {
              return hl(c)
            }
          }) as Promise<HighlightedCodeType>[],
        )
        return { ...step, codes } as StepType
      } else {
        return []
      }
    }),
  )) as StepType[]
  return stepsWithHLCode
}

const TreePropsSchema = Block.extend({
  right: Block.extend({
    content: Block.optional(),
    codes: z.array(CodeBlock.transform(transformCode)).optional(),
  }),
  left: Block,
})

export type TreeDataType = {
  left: BlockType
  right: {
    content?: BlockType
    codes?: HighlightedCodeType[]
  }
}

export async function parseTreeProps(props: any): Promise<TreeDataType> {
  const { left, right } = parseProps(props, TreePropsSchema)
  const codes = right.codes
    ? ((await Promise.all(
        right.codes.map((c) => hl(c)),
      )) as HighlightedCodeType[])
    : []
  return {
    left,
    right: {
      content: right.content,
      codes,
    },
  }
}
