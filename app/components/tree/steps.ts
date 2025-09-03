import { z } from "zod"
import { transformCode } from "./block"
import { Block, CodeBlock } from "codehike/blocks"

export const StepsSchema = Block.extend({
  steps: z.array(
    Block.extend({
      code: CodeBlock.optional().transform(transformCode),
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
